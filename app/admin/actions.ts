'use server'

import { createSupabaseServerActionClient } from "@/lib/auth/supabase-auth-server"

export async function loginAdmin(formData: FormData) {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
        return { error: "Email and password are required" }
    }

    const supabase = await createSupabaseServerActionClient()

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    if (!data.user) {
        return { error: "Login failed - no user data returned" }
    }

    // Check if user is admin
    const isAdmin =
        data.user.app_metadata?.role === 'admin' ||
        data.user.email?.endsWith('@skautosphere.com')

    if (!isAdmin) {
        await supabase.auth.signOut()
        return { error: "Access denied. Admin privileges required." }
    }

    return { success: true }
}
