const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUser() {
  console.log(
    "🔍 Checking valid users in 'auth.users' vs 'users' (public table)...",
  );

  // 1. Get auth user
  const { data: authUsers } = await supabase.auth.admin.listUsers();
  const firstAuthUser = authUsers?.users?.[0];

  if (!firstAuthUser) {
    console.error("No Auth Users found!");
    return;
  }

  console.log(`Auth User ID: ${firstAuthUser.id} (${firstAuthUser.email})`);

  // 2. Check public.users table (common simple architecture)
  // Sometimes 'users' table is just a view or separate table
  // The foreign key 'blog_posts_author_id_fkey' likely points to public.users? Or auth.users?
  // Supabase usually discourages FK to auth.users due to RLS, but it's possible.
  // If it points to public.profiles, we need to insert there first.

  // Let's assume it points to public.users or public.profiles
  // We check connection
  const { data: publicUser, error } = await supabase
    .from("profiles") // Try 'profiles' first
    .select("*")
    .eq("id", firstAuthUser.id)
    .single();

  if (error) {
    console.log(
      "No profile found in public.profiles. Checking public.users...",
    );
    const { data: publicUser2, error: error2 } = await supabase
      .from("users")
      .select("*")
      .eq("id", firstAuthUser.id)
      .single();

    if (error2) {
      console.log("No user found in public.users either.");
      console.log(
        "💡 We probably need to create a public profile for this auth user first.",
      );
      await createProfile(firstAuthUser);
    } else {
      console.log("Found in public.users!");
    }
  } else {
    console.log("Found in public.profiles!");
  }
}

async function createProfile(authUser) {
  console.log("Creating public profile...");
  // Try inserting into 'users' table which is cleaner for many starters
  // OR 'profiles'

  // Let's try 'users' first as per typical Next.js starters
  const { error: error1 } = await supabase.from("users").insert([
    {
      id: authUser.id,
      email: authUser.email,
      full_name: "Admin User",
      role: "admin",
    },
  ]);

  if (error1) {
    console.log(
      "Failed to insert into 'users', trying 'profiles'...",
      error1.message,
    );
    const { error: error2 } = await supabase.from("profiles").insert([
      {
        id: authUser.id,
        full_name: "Admin User",
        role: "admin",
        email: authUser.email,
      },
    ]);

    if (error2) {
      console.error(
        "Failed to create profile in either table.",
        error2.message,
      );
    } else {
      console.log("✅ Profile created in 'profiles'.");
    }
  } else {
    console.log("✅ User created in 'users' table.");
  }
}

checkUser();
