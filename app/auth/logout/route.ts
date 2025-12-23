import { createSupabaseServerActionClient } from "@/lib/auth/supabase-auth-server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerActionClient()
  
  // Sign out from Supabase
  await supabase.auth.signOut()
  
  // Redirect to home page
  const redirectTo = request.nextUrl.searchParams.get("redirect") || "/"
  return NextResponse.redirect(new URL(redirectTo, request.url))
}

export async function GET(request: NextRequest) {
  // Also support GET for convenience
  const supabase = await createSupabaseServerActionClient()
  await supabase.auth.signOut()
  
  const redirectTo = request.nextUrl.searchParams.get("redirect") || "/"
  return NextResponse.redirect(new URL(redirectTo, request.url))
}





