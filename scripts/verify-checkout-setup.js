/**
 * Checkout Implementation Verification Script
 *
 * Checks that all components and API routes are properly set up
 * for the Stripe checkout flow.
 *
 * Run: node scripts/verify-checkout-setup.js
 */

const fs = require("fs");
const path = require("path");

console.log("🔍 SK AutoSphere - Checkout Implementation Verification\n");
console.log("=".repeat(60));

const checks = [];
let passedChecks = 0;
let failedChecks = 0;

// Helper function to check file exists
function checkFile(filePath, description) {
  const fullPath = path.join(process.cwd(), filePath);
  const exists = fs.existsSync(fullPath);

  checks.push({
    description,
    status: exists ? "PASS" : "FAIL",
    path: filePath,
  });

  if (exists) {
    passedChecks++;
  } else {
    failedChecks++;
  }

  return exists;
}

// Helper function to check environment variable
function checkEnvVar(varName, description) {
  // Try to read .env.local
  const envPath = path.join(process.cwd(), ".env.local");
  let envContent = "";

  try {
    envContent = fs.readFileSync(envPath, "utf-8");
  } catch (error) {
    checks.push({
      description: ".env.local file",
      status: "FAIL",
      path: ".env.local",
    });
    failedChecks++;
    return false;
  }

  const hasVar = envContent.includes(`${varName}=`);

  checks.push({
    description,
    status: hasVar ? "PASS" : "FAIL",
    path: `.env.local (${varName})`,
  });

  if (hasVar) {
    passedChecks++;
  } else {
    failedChecks++;
  }

  return hasVar;
}

console.log("\n📋 CHECKING FILES...\n");

// Check server component
checkFile(
  "app/checkout/[listingId]/page.tsx",
  "Checkout page (server component)",
);

// Check success page
checkFile("app/checkout/success/page.tsx", "Success page");

// Check client components
checkFile(
  "components/checkout/stripe-checkout-client.tsx",
  "Stripe checkout client wrapper",
);

checkFile("components/checkout/stripe-payment-form.tsx", "Stripe payment form");

checkFile(
  "components/checkout/checkout-order-summary.tsx",
  "Order summary component",
);

// Check API routes
checkFile(
  "app/api/stripe/create-payment-intent/route.ts",
  "Create payment intent API",
);

checkFile("app/api/stripe/webhooks/route.ts", "Stripe webhooks API");

checkFile("app/api/stripe/payment-status/route.ts", "Payment status API");

// Check library files
checkFile("lib/stripe/server.ts", "Stripe server configuration");

checkFile("lib/stripe/client.ts", "Stripe client configuration");

checkFile("lib/supabase-server.ts", "Supabase server client");

// Check database migration
checkFile(
  "supabase/migrations/20251203_1516_create_transactions.sql",
  "Transactions table migration",
);

// Check documentation
checkFile("docs/CHECKOUT-IMPLEMENTATION.md", "Checkout documentation");

console.log("\n🔐 CHECKING ENVIRONMENT VARIABLES...\n");

checkEnvVar("STRIPE_SECRET_KEY", "Stripe secret key");

checkEnvVar("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", "Stripe publishable key");

checkEnvVar("STRIPE_WEBHOOK_SECRET", "Stripe webhook secret");

checkEnvVar("NEXT_PUBLIC_SUPABASE_URL", "Supabase URL");

checkEnvVar("SUPABASE_SECRET_KEY", "Supabase service role key");

checkEnvVar("NEXT_PUBLIC_SITE_URL", "Site URL");

// Print results
console.log("\n📊 RESULTS:\n");
console.log("=".repeat(60));

checks.forEach((check) => {
  const icon = check.status === "PASS" ? "✅" : "❌";
  const status = check.status === "PASS" ? "PASS" : "FAIL";
  console.log(`${icon} ${status} - ${check.description}`);
  if (check.status === "FAIL") {
    console.log(`   Missing: ${check.path}`);
  }
});

console.log("\n" + "=".repeat(60));
console.log(`\n✅ Passed: ${passedChecks}`);
console.log(`❌ Failed: ${failedChecks}`);
console.log(`📊 Total:  ${checks.length}`);

if (failedChecks === 0) {
  console.log("\n🎉 All checks passed! Checkout implementation is ready.\n");
  console.log("Next steps:");
  console.log("1. Run the Supabase migration for transactions table");
  console.log('2. Add "Buy Now" button to listing pages');
  console.log("3. Test the checkout flow with Stripe test cards");
  console.log("4. Set up Stripe webhook endpoint in Stripe dashboard");
  console.log("\nSee docs/CHECKOUT-IMPLEMENTATION.md for details.\n");
} else {
  console.log("\n⚠️  Some checks failed. Please fix the issues above.\n");
  process.exit(1);
}
