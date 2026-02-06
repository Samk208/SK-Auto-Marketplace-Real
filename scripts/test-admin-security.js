/**
 * Admin Security Testing Script
 * Tests all critical security fixes applied on Dec 2, 2025
 */

const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// Load environment variables
const envPath = path.join(__dirname, "..", ".env.local");
const envContent = fs.readFileSync(envPath, "utf-8");
const env = {};
envContent.split("\n").forEach((line) => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith("#")) {
    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (match) {
      env[match[1].trim()] = match[2].trim();
    }
  }
});

console.log("\n🔍 SK AutoSphere - Admin Security Testing\n");
console.log("=".repeat(60));

if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SECRET_KEY) {
  console.log(
    "\n❌ ERROR: Missing required environment variables in .env.local",
  );
  console.log("Required:");
  console.log("  - NEXT_PUBLIC_SUPABASE_URL");
  console.log("  - SUPABASE_SECRET_KEY");
  console.log("\nCurrent values:");
  console.log(
    "  NEXT_PUBLIC_SUPABASE_URL:",
    env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Found" : "❌ Missing",
  );
  console.log(
    "  SUPABASE_SECRET_KEY:",
    env.SUPABASE_SECRET_KEY ? "✅ Found" : "❌ Missing",
  );
  process.exit(1);
}

// Create clients
const supabaseAdmin = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SECRET_KEY,
);

const supabaseAnon = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
);

async function runSecurityTests() {
  let passedTests = 0;
  let failedTests = 0;

  console.log("\n📋 TEST 1: Admin User Configuration");
  console.log("-".repeat(60));

  try {
    const {
      data: { users },
      error,
    } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
      console.log("❌ FAILED: Could not list users");
      failedTests++;
    } else {
      const adminUsers = users.filter(
        (u) =>
          u.app_metadata?.role === "admin" ||
          u.email?.includes("@skautosphere.com"),
      );

      if (adminUsers.length > 0) {
        console.log(`✅ PASSED: Found ${adminUsers.length} admin user(s)`);
        adminUsers.forEach((admin) => {
          console.log(`   - ${admin.email}`);
          console.log(
            `     app_metadata.role: ${admin.app_metadata?.role || "NOT SET"}`,
          );
          console.log(
            `     user_metadata.role: ${admin.user_metadata?.role || "NOT SET"}`,
          );
        });
        passedTests++;
      } else {
        console.log("❌ FAILED: No admin users found");
        console.log(
          "   Action needed: Run scripts/set-admin.js to create admin user",
        );
        failedTests++;
      }
    }
  } catch (error) {
    console.log("❌ FAILED:", error.message);
    failedTests++;
  }

  console.log("\n📋 TEST 2: Audit Logs Table & RLS Policies");
  console.log("-".repeat(60));

  try {
    // Test with admin client
    const { data: adminLogs, error: adminError } = await supabaseAdmin
      .from("audit_logs")
      .select("id, action")
      .limit(5);

    if (adminError) {
      console.log("❌ FAILED: audit_logs table does not exist or has errors");
      console.log("   Error:", adminError.message);
      failedTests++;
    } else {
      console.log(
        `✅ PASSED: audit_logs table exists (${adminLogs?.length || 0} recent records)`,
      );
      passedTests++;
    }

    // Test with anon client (should fail)
    const { data: anonLogs, error: anonError } = await supabaseAnon
      .from("audit_logs")
      .select("id")
      .limit(1);

    if (anonError || !anonLogs || anonLogs.length === 0) {
      console.log(
        "✅ PASSED: Anonymous users cannot read audit_logs (RLS working)",
      );
      passedTests++;
    } else {
      console.log(
        "❌ FAILED: Anonymous users CAN read audit_logs (RLS BROKEN!)",
      );
      console.log(
        "   SECURITY RISK: Audit logs should only be readable by admins",
      );
      failedTests++;
    }
  } catch (error) {
    console.log("❌ FAILED:", error.message);
    failedTests++;
  }

  console.log("\n📋 TEST 3: Database Tables & RLS Policies");
  console.log("-".repeat(60));

  try {
    // Test car_listings RLS (public can only see active)
    const { data: activeListings } = await supabaseAnon
      .from("car_listings")
      .select("id, status")
      .eq("status", "active")
      .limit(1);

    const { data: pendingListings } = await supabaseAnon
      .from("car_listings")
      .select("id, status")
      .eq("status", "pending")
      .limit(1);

    if (activeListings && activeListings.length > 0) {
      console.log("✅ PASSED: Public can view active listings");
      passedTests++;
    } else {
      console.log("⚠️  WARNING: No active listings to test with");
    }

    if (!pendingListings || pendingListings.length === 0) {
      console.log(
        "✅ PASSED: Public cannot view pending listings (RLS working)",
      );
      passedTests++;
    } else {
      console.log("❌ FAILED: Public CAN view pending listings (RLS BROKEN!)");
      console.log(
        "   SECURITY RISK: Only admins/dealers should see pending listings",
      );
      failedTests++;
    }
  } catch (error) {
    console.log("❌ FAILED:", error.message);
    failedTests++;
  }

  console.log("\n📋 TEST 4: Concurrency Protection Check");
  console.log("-".repeat(60));

  try {
    // Get a pending listing if exists
    const { data: pendingListing } = await supabaseAdmin
      .from("car_listings")
      .select("id, status, title")
      .eq("status", "pending")
      .limit(1)
      .single();

    if (pendingListing) {
      console.log(`   Testing with listing: ${pendingListing.title}`);
      console.log(`   Listing ID: ${pendingListing.id}`);

      // Simulate concurrent update
      const update1 = supabaseAdmin
        .from("car_listings")
        .update({ status: "active" })
        .eq("id", pendingListing.id)
        .eq("status", "pending")
        .select()
        .single();

      const update2 = supabaseAdmin
        .from("car_listings")
        .update({ status: "active" })
        .eq("id", pendingListing.id)
        .eq("status", "pending")
        .select()
        .single();

      const results = await Promise.allSettled([update1, update2]);

      const successful = results.filter(
        (r) => r.status === "fulfilled" && r.value.data,
      ).length;
      const failed = results.filter(
        (r) => r.status === "rejected" || r.value.error,
      ).length;

      if (successful === 1 && failed === 1) {
        console.log(
          "✅ PASSED: Concurrency protection works (only 1 update succeeded)",
        );
        passedTests++;
      } else {
        console.log(
          `❌ FAILED: Both updates succeeded (${successful}) or both failed (${failed})`,
        );
        console.log("   Concurrency protection may not be working correctly");
        failedTests++;
      }

      // Revert for testing
      await supabaseAdmin
        .from("car_listings")
        .update({ status: "pending" })
        .eq("id", pendingListing.id);
    } else {
      console.log("⚠️  SKIPPED: No pending listings to test with");
      console.log(
        "   Action: Create a pending listing to test concurrency protection",
      );
    }
  } catch (error) {
    console.log("❌ FAILED:", error.message);
    failedTests++;
  }

  console.log("\n📋 TEST 5: log_audit() Function Check");
  console.log("-".repeat(60));

  try {
    // Test if log_audit function exists and works
    const { data, error } = await supabaseAdmin.rpc("log_audit", {
      p_action: "test_action",
      p_resource_type: "test",
      p_resource_id: "00000000-0000-0000-0000-000000000000",
      p_details: { test: true },
    });

    if (error) {
      console.log("❌ FAILED: log_audit() function error:", error.message);
      failedTests++;
    } else {
      console.log("✅ PASSED: log_audit() function works");

      // Verify the log was created
      const { data: logs } = await supabaseAdmin
        .from("audit_logs")
        .select("*")
        .eq("action", "test_action")
        .order("created_at", { ascending: false })
        .limit(1);

      if (logs && logs.length > 0) {
        console.log("✅ PASSED: Audit log was created successfully");
        console.log(`   Log ID: ${logs[0].id}`);
        passedTests++;
      } else {
        console.log("❌ FAILED: Audit log was not created");
        failedTests++;
      }
    }
  } catch (error) {
    console.log("❌ FAILED:", error.message);
    failedTests++;
  }

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("📊 TEST SUMMARY");
  console.log("=".repeat(60));
  console.log(`✅ Passed: ${passedTests}`);
  console.log(`❌ Failed: ${failedTests}`);
  console.log(
    `📈 Success Rate: ${Math.round((passedTests / (passedTests + failedTests)) * 100)}%`,
  );

  if (failedTests === 0) {
    console.log("\n🎉 ALL TESTS PASSED! Security implementation verified.");
  } else {
    console.log(
      "\n⚠️  SOME TESTS FAILED! Review failures above and fix before production.",
    );
  }

  console.log("\n");
}

runSecurityTests().catch(console.error);
