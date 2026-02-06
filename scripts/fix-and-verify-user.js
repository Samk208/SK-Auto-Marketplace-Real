const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixUser() {
  console.log("🛠️ Attempting to fix user Foreign Key issue...");

  // 1. Get the Auth User
  const { data: authUsers, error: authError } =
    await supabase.auth.admin.listUsers();
  if (authError || !authUsers.users.length) {
    console.error("❌ No Auth users found. Cannot link public user.");
    return;
  }

  const adminUser = authUsers.users[0];
  console.log(`Found Auth User: ${adminUser.email} (${adminUser.id})`);

  // 2. Check public.users
  const { data: publicUser, error: fetchError } = await supabase
    .from("users")
    .select("*")
    .eq("id", adminUser.id)
    .single();

  if (publicUser) {
    console.log(
      "✅ User already exists in public.users. Foreign Key should represent this ID.",
    );
    return;
  }

  // 3. Insert if missing
  console.log("⚠️ User missing in public.users. Inserting now...");

  const { error: insertError } = await supabase.from("users").insert([
    {
      id: adminUser.id,
      email: adminUser.email,
      password_hash: "$2a$10$dummy_hash_for_development_purposes_only", // Required column
      full_name: "Admin User",
      role: "admin",
      verified: true,
    },
  ]);

  if (insertError) {
    console.error("❌ Failed to insert user:", insertError.message);
  } else {
    console.log("✅ User successfully inserted into public.users!");
  }
}

fixUser();
