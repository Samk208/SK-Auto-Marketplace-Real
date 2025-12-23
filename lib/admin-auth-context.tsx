"use client"

import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface AdminUser {
  id: string
  email: string
  role: string
  name?: string
}

interface AdminAuthContextType {
  admin: AdminUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  // Check active session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        if (session?.user) {
          // Check if user is admin
          const isAdmin =
            session.user.app_metadata?.role === 'admin' ||
            session.user.email?.endsWith('@skautosphere.com')

          if (isAdmin) {
            setAdmin({
              id: session.user.id,
              email: session.user.email!,
              role: session.user.app_metadata?.role || 'admin',
              name: session.user.user_metadata?.full_name
            })
          } else {
            // Not admin, sign out
            await supabase.auth.signOut()
            setAdmin(null)
          }
        } else {
          setAdmin(null)
        }
      } catch (error) {
        console.error("Session check error:", error)
        setAdmin(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const isAdmin =
          session.user.app_metadata?.role === 'admin' ||
          session.user.email?.endsWith('@skautosphere.com')

        if (isAdmin) {
          setAdmin({
            id: session.user.id,
            email: session.user.email!,
            role: session.user.app_metadata?.role || 'admin',
            name: session.user.user_metadata?.full_name
          })
        } else {
          setAdmin(null)
        }
      } else if (event === 'SIGNED_OUT') {
        setAdmin(null)
      }
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (data.user) {
        const isAdmin =
          data.user.app_metadata?.role === 'admin' ||
          data.user.email?.endsWith('@skautosphere.com')

        if (!isAdmin) {
          await supabase.auth.signOut()
          return { success: false, error: "Access denied. Admin privileges required." }
        }

        return { success: true }
      }

      return { success: false, error: "Login failed" }
    } catch (error) {
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setAdmin(null)
    router.push("/admin/login")
  }

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider")
  }
  return context
}
