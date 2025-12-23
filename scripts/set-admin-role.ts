/**
 * Quick script to set admin role for a user
 * Usage: npx tsx scripts/set-admin-role.ts [email]
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { join } from "path";

// Load environment variables from .env.local
function loadEnv() {
  try {
    const envPath = join(process.cwd(), ".env.local");
    const envFile = readFileSync(envPath, "utf-8");
    envFile.split("\n").forEach((line) => {
      const [key, ...values] = line.split("=");
      if (key && values.length > 0) {
        const value = values.join("=").trim().replace(/^["']|["']$/g, "");
        process.env[key.trim()] = value;
      }
    });
  } catch (error) {
    // .env.local might not exist, that's okay
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("❌ Missing environment variables!");
  console.error("Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function setAdminRole(email?: string) {
  try {
    let targetEmail = email;

    // If no email provided, get the first user
    if (!targetEmail) {
      console.log("📋 Fetching users...");
      const { data: users, error: listError } = await supabase.auth.admin.listUsers();

      if (listError) {
        console.error("❌ Error fetching users:", listError);
        process.exit(1);
      }

      if (users.users.length === 0) {
        console.error("❌ No users found!");
        process.exit(1);
      }

      // Use the first user
      targetEmail = users.users[0].email;
      console.log(`📧 Found user: ${targetEmail}`);
    }

    // Find user by email
    const { data: users, error: searchError } = await supabase.auth.admin.listUsers();
    
    if (searchError) {
      console.error("❌ Error searching for user:", searchError);
      process.exit(1);
    }

    const user = users.users.find((u) => u.email === targetEmail);

    if (!user) {
      console.error(`❌ User not found: ${targetEmail}`);
      process.exit(1);
    }

    console.log(`🔧 Setting admin role for: ${user.email} (${user.id})`);

    // Update user with admin role
    const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
      app_metadata: {
        role: "admin",
      },
    });

    if (error) {
      console.error("❌ Failed to set admin role:", error);
      process.exit(1);
    }

    console.log("✅ Admin role set successfully!");
    console.log(`   User: ${data.user.email}`);
    console.log(`   App Metadata:`, data.user.app_metadata);
    console.log("\n🎉 User can now access admin routes!");
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    process.exit(1);
  }
}

// Get email from command line argument or use first user
const email = process.argv[2];
setAdminRole(email);

