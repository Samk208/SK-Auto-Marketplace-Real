const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY in .env.local",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addColumn() {
  console.log("🛠️ Adding 'focus_keyword' column to 'blog_posts'...");

  const { error } = await supabase.rpc("execute_sql", {
    sql_query: `
      ALTER TABLE blog_posts 
      ADD COLUMN IF NOT EXISTS focus_keyword TEXT DEFAULT '';
    `,
  });

  // Fallback if RPC not available (often restricted), try raw query implies using a migration.
  // Since we can't run migration CLI, standard practice is using Dashboard SQL Editor.
  // HOWEVER, for this environment, we will try to use a specialized migration script if RPC fails.

  if (error) {
    console.error("⚠️ RPC Failed (Subject to permissions):", error.message);
    console.log(
      "Attempting direct SQL execution via storage/migration pattern ignored for this specific simplified script.",
    );
    console.log("Please run this SQL in your Supabase Dashboard SQL Editor:");
    console.log(
      "ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS focus_keyword TEXT DEFAULT '';",
    );
  } else {
    console.log("✅ Column added successfully!");
  }
}

// Since we cannot rely on RPC for DDL often, we'll try to just remove 'focus_keyword' from the seed script
// IF the column doesn't exist, OR we just ask the user to add it.
// But let's try to proceed by stripping the column if insert fails again? No, let's fix the schema.

// Actually, I'll provide a separate migration file for the user to copy/paste if they have to,
// OR I will use the `apply-dynamic-migration.js` pattern found in the file list.

const fs = require("fs");
const path = require("path");

async function runMigration() {
  // Check if we can use the existing dynamic migration tool pattern
  console.log("Checking for migration capability...");

  // Let's just output the SQL file for the user or use the migration tool if fully configured
  // But since the previous 'npx supabase' failed, I will try to use the seed script WITHOUT the column first
  // to ensure at least content is there, OR try to add the column via a "magic" query if possible.

  // BETTER PLAN: Update the seed script to NOT include focus_keyword if it fails, OR
  // Just instruct the user. But I want to be agentic.

  // Let's try to modify the seed script to be "safe" - check if column exists, if not, skip it.
}

addColumn();
