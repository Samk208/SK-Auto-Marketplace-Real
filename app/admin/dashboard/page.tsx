import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentUser, isAdmin } from "@/lib/auth/supabase-auth-server"
import { AlertCircle, Car, CheckCircle, DollarSign, TrendingUp, Users } from "lucide-react"
import { headers } from "next/headers"
import Link from "next/link"

export const dynamic = 'force-dynamic';

async function getAdminStats() {
  try {
    // Get the host from the request headers
    const headersList = await headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const baseUrl = `${protocol}://${host}`;
    
    const cookie = headersList.get('cookie') || '';
    
    const response = await fetch(`${baseUrl}/api/admin/stats`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookie, // Forward cookies for authentication
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch admin stats:', response.statusText);
      return null;
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return null;
  }
}

export default async function AdminDashboardPage() {
  const user = await getCurrentUser()
  const userIsAdmin = await isAdmin()

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Access Required</CardTitle>
            <CardDescription>Please log in to access the admin dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/auth/login?redirect=/admin/dashboard">
              <Button className="w-full">Log in</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show access denied if not admin
  if (!userIsAdmin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You do not have admin privileges</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button variant="outline" className="w-full">Go to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Fetch real stats from API
  const statsData = await getAdminStats();
  
  // Fallback to basic structure if API fails
  const stats = statsData || {
    listings: { total: 0, active: 0, pending: 0, sold: 0, rejected: 0 },
    dealers: { total: 0, verified: 0, unverified: 0 },
    revenue: { total: 0, currency: 'USD', growth: 0 },
    activity: { newListingsThisWeek: 0, newDealersThisWeek: 0 }
  };

  return (
    <div className="space-y-8">
      <div>        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Platform overview and management
          {statsData && <span className="text-xs ml-2 text-green-600">• Live Data</span>}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Listings</CardTitle>
            <Car className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.listings.total}</div>
            <p className="text-xs text-slate-600 mt-1">{stats.listings.active} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Pending Review</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.listings.pending}</div>
            <p className="text-xs text-slate-600 mt-1">Requires approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Dealers</CardTitle>
            <Users className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.dealers.total}</div>
            <p className="text-xs text-slate-600 mt-1">{stats.dealers.verified} verified</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${stats.revenue.total > 0 ? (stats.revenue.total / 1000).toFixed(1) : '0'}k
            </div>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {stats.revenue.growth.toFixed(1)}% growth
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>New listings and dealers this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b">
                <div className="space-y-1">
                  <p className="font-medium text-sm">New Listings</p>
                  <p className="text-xs text-slate-600">Added this week</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-2xl text-blue-600">{stats.activity.newListingsThisWeek}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium text-sm">New Dealers</p>
                  <p className="text-xs text-slate-600">Joined this week</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-2xl text-purple-600">{stats.activity.newDealersThisWeek}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common admin tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link href="/admin/listings">
                <Button variant="outline" className="w-full justify-start">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Review Pending Listings ({stats.listings.pending})
                </Button>
              </Link>
              <Link href="/admin/dealers">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Dealers
                </Button>
              </Link>
              <Link href="/admin/audit-logs">
                <Button variant="outline" className="w-full justify-start">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  View Audit Logs
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
