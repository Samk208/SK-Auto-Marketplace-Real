"use client"

import type React from "react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AdminAuthProvider, useAdminAuth } from "@/lib/admin-auth-context"
import {
  BookOpen,
  Car,
  ChevronRight,
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Users,
  X,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { admin, isAuthenticated, isLoading, logout } = useAdminAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Redirect to login if not authenticated (except on login page)
  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname !== "/admin/login") {
      router.push("/admin/login")
    }
  }, [isLoading, isAuthenticated, pathname, router])

  const handleLogout = () => {
    logout()
  }

  // Don't show layout on login page
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Don't render admin layout if not authenticated
  if (!isAuthenticated) {
    return null
  }

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      href: "/admin/dashboard",
      roles: ["Super Admin", "Admin", "Moderator", "Finance"],
    },
    { icon: Car, label: "Listings", href: "/admin/listings", roles: ["Super Admin", "Admin", "Moderator"] },
    { icon: Users, label: "Dealers", href: "/admin/dealers", roles: ["Super Admin", "Admin", "Moderator"] },
    { icon: CreditCard, label: "Payments", href: "/admin/payments", roles: ["Super Admin", "Admin", "Finance"] },
    { icon: FileText, label: "Audit Logs", href: "/admin/audit-logs", roles: ["Super Admin", "Admin"] },
    { icon: BookOpen, label: "Blog", href: "/admin/blog", roles: ["Super Admin", "Admin", "Moderator"] },
    { icon: Settings, label: "Settings", href: "/admin/settings/users", roles: ["Super Admin"] },
  ]

  // Filter menu items based on role
  const visibleMenuItems = menuItems.filter((item) => admin?.role && item.roles.includes(admin.role))

  return (
    <>
      <meta name="robots" content="noindex,nofollow" />

      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        {/* Top Bar */}
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40">
          <div className="flex items-center justify-between px-4 h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <h1 className="text-lg font-semibold">SK AutoSphere Admin</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium">{admin?.name}</p>
                <p className="text-xs text-slate-500">{admin?.role}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <aside
            className={`
              fixed lg:static inset-y-0 left-0 z-30
              w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700
              transform transition-transform duration-200 ease-in-out
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
              mt-16 lg:mt-0
            `}
          >
            <nav className="p-4 space-y-2">
              <Alert className="mb-4 bg-amber-50 dark:bg-amber-900/20 border-amber-200">
                <AlertDescription className="text-xs">Secure Portal – Authorized Use Only</AlertDescription>
              </Alert>

              {visibleMenuItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

                return (
                  <Link key={item.href} href={item.href}>
                    <div
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                        ${isActive
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                        }
                      `}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                      {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
                    </div>
                  </Link>
                )
              })}
            </nav>
          </aside>

          {/* Mobile overlay */}
          {sidebarOpen && (
            <div className="fixed inset-0 bg-black/50 z-20 lg:hidden mt-16" onClick={() => setSidebarOpen(false)} />
          )}

          {/* Main Content */}
          <main className="flex-1 p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminAuthProvider>
  )
}
