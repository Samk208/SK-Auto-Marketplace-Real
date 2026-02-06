/**
 * Server-side Supabase Auth client for Next.js 15
 *
 * This client uses cookies and respects RLS policies.
 * Use this for authentication operations.
 */

import type { Database } from "@/types/database";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Create a Supabase client for READ operations (Server Components)
 * Cookie set/remove are no-ops since Server Components can't modify cookies
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // This will throw in Server Components - that's expected
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // This will throw in Server Components - that's expected
          }
        },
      },
    },
  );
}

/**
 * Create a Supabase client for WRITE operations (Server Actions, Route Handlers)
 * This client CAN set cookies after login/logout
 */
export async function createSupabaseServerActionClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    },
  );
}

/**
 * Get the currently authenticated user
 * Returns null if no user is logged in
 */
export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    // Only log errors that are NOT "Auth session missing" (expected when logged out)
    if (error.message !== "Auth session missing!") {
      console.error("getCurrentUser error:", error.message);
    }
    return null;
  }

  return data.user ?? null;
}

/**
 * Get the current user's session
 * Returns null if no session exists
 */
export async function getSession() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getSession();

  if (error || !data.session) {
    return null;
  }

  return data.session;
}

/**
 * Get the current dealer for the authenticated user
 * Returns null if user is not a dealer or not logged in
 */
export async function getCurrentDealer(): Promise<
  Database["public"]["Tables"]["dealers"]["Row"] | null
> {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("dealers")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

/**
 * Check if the current user is an admin
 * Returns false if user is not logged in or not an admin
 *
 * SECURITY: Uses app_metadata.role which is server-only and cannot be
 * modified by clients. user_metadata is client-writable and should NOT
 * be used for security checks.
 */
export async function isAdmin() {
  const user = await getCurrentUser();

  if (!user) {
    return false;
  }

  // Check app_metadata for admin role (server-managed, secure)
  // app_metadata cannot be modified by clients via updateUser()
  const isAdminRole = user.app_metadata?.role === "admin";

  // Secondary check: email domain (for backwards compatibility)
  // Note: This is less secure but provides fallback for existing admins
  const isAdminEmail = user.email?.endsWith("@skautosphere.com");

  return isAdminRole || isAdminEmail || false;
}
