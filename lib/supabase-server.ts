/**
 * Server-side Supabase client
 *
 * This client uses the service role key and should ONLY be used in:
 * - API route handlers (app/api/*)
 * - Server Components
 * - Server Actions
 *
 * DO NOT import this in client components!
 */

import type { Database } from "@/types/database";
import { createClient } from "@supabase/supabase-js";

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl) {
  console.error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
} else {
  console.log("Supabase URL loaded:", supabaseUrl.substring(0, 10) + "...");
}

if (!supabaseServiceRoleKey) {
  console.error("Missing env.SUPABASE_SECRET_KEY");
  throw new Error("Missing env.SUPABASE_SECRET_KEY");
} else {
  console.log(
    "Supabase Secret Key loaded:",
    supabaseServiceRoleKey.substring(0, 10) + "...",
  );
}

/**
 * Create a Supabase client for server-side operations
 * This client has admin privileges and bypasses RLS policies
 */
export function getSupabaseServerClient() {
  return createClient<Database>(supabaseUrl!, supabaseServiceRoleKey!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Singleton instance for reuse in server contexts
 * Use this for better performance in API routes
 */
export const supabaseServer = createClient<Database>(
  supabaseUrl!,
  supabaseServiceRoleKey!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);
