/**
 * Client-side Supabase client for browser usage
 * Uses browser cookies for auth state
 * Singleton pattern to avoid recreating client on every call
 */

import type { Database } from '@/types/database'
import { createBrowserClient } from '@supabase/ssr'

let client: ReturnType<typeof createBrowserClient<Database>> | null = null

export function createClient() {
  if (client) return client
  
  client = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  
  return client
}
