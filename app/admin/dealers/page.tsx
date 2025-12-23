import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createSupabaseServerClient } from "@/lib/auth/supabase-auth-server"
import { redirect } from "next/navigation"
import { AdminDealersClient } from "./admin-dealers-client"

export const dynamic = "force-dynamic"

export default async function AdminDealersPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/admin/login")

  // Use metadata check for admin
  const isAdmin = user.app_metadata?.role === 'admin' || user.email?.endsWith('@skautosphere.com')
  if (!isAdmin) redirect("/")

  // Fetch dealers with user details
  const { data: dealers, error } = await supabase
    .from('dealers')
    .select(`
      *,
      users!inner (
        email,
        phone
      )
    `)
    .order('joined_date', { ascending: false })

  if (error) {
    console.error('Error fetching dealers:', error)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dealers Management</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Manage all dealers on the platform</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Dealers ({dealers?.length || 0})</CardTitle>
          <CardDescription>View and manage dealer accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminDealersClient initialDealers={dealers as any || []} />
        </CardContent>
      </Card>
    </div>
  )
}
