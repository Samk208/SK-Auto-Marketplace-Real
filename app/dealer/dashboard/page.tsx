import { MarketInsightsDashboard } from "@/components/ai/market-insights-dashboard"
import { DealerVerificationCard } from "@/components/dealer/verification-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentDealer, getCurrentUser, isAdmin } from "@/lib/auth/supabase-auth-server"
import { getDealerStats } from "@/lib/repositories/dealers"
import { Car, DollarSign, Eye, MessageSquare, Plus } from "lucide-react"
import Link from "next/link"

export default async function DealerDashboardPage() {
  const user = await getCurrentUser()
  let dealer = await getCurrentDealer()

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Dealer Access Required</CardTitle>
            <CardDescription>Please log in to access your dealer dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/auth/login?redirect=/dealer/dashboard">
              <Button className="w-full">Log in</Button>
            </Link>
            <p className="text-xs text-center text-slate-600">
              Demo: dealer@test.com / dealer123
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Check if admin (allow access without dealer profile)
  const isUserAdmin = await isAdmin();

  // Create mock dealer profile for admin view if none exists
  if (!dealer && isUserAdmin) {
    dealer = {
      id: "admin-view", // Mock ID
      user_id: user.id,
      business_name: "Admin View (All Dealers)",
      description: "Administrator Dashboard access",
      rating: 5,
      review_count: 0,
      verified: true,
      trust_score: 100,
      location: "Global Admin",
      joined_date: new Date().toISOString(),
      active_listings: 0,
      sold_vehicles: 0,
      verification_status: 'verified',
      verification_notes: 'Administrator Access Granted',
      business_license_url: null,
      logo_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }

  // Check if dealer profile exists (and not admin)
  if (!dealer) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Dealer Profile Required</CardTitle>
            <CardDescription>You need a dealer profile to access this dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 mb-4">
              Please contact support to set up your dealer account.
            </p>
            <Link href="/">
              <Button className="w-full">Back to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Fetch real dealer statistics (or default for admin mock)
  const stats = dealer.id === "admin-view"
    ? { activeListings: 0, pendingListings: 0, totalViews: 0, soldVehicles: 0, averagePrice: 0 }
    : await getDealerStats(dealer.id)

  const dealerName = dealer.business_name || user.email?.split("@")[0] || "Dealer"

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dealer Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Welcome back, {dealerName}!
          </p>
        </div>
        <div className="flex gap-2">
          {/* Show badge if verified */}
          {dealer.verification_status === 'verified' && (
            <div className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium border border-green-200">
              ✅ Verified Dealer
            </div>
          )}
          <Link href="/dealer/listings/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Listing
            </Button>
          </Link>
        </div>
      </div>

      <DealerVerificationCard
        status={dealer.verification_status || (dealer.verified ? 'verified' : 'unverified')}
        notes={dealer.verification_notes}
        licenseUrl={dealer.business_license_url}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Active Listings</CardTitle>
            <Car className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeListings}</div>
            <p className="text-xs text-slate-600 mt-1">
              {stats.pendingListings} pending approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
            <p className="text-xs text-slate-600 mt-1">
              Across all listings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Sold Vehicles</CardTitle>
            <MessageSquare className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.soldVehicles}</div>
            <p className="text-xs text-slate-600 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Average Price</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${(stats.averagePrice / 1000).toFixed(1)}k
            </div>
            <p className="text-xs text-slate-600 mt-1">Active listings</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Market Intelligence */}
      <div className="grid grid-cols-1 gap-6">
        <MarketInsightsDashboard />
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your listings and account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dealer/listings/new">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Create New Listing
              </Button>
            </Link>
            <Link href="/dealer/listings">
              <Button variant="outline" className="w-full justify-start">
                <Eye className="h-4 w-4 mr-2" />
                View My Listings
              </Button>
            </Link>
            <Button variant="outline" className="w-full justify-start" disabled>
              <MessageSquare className="h-4 w-4 mr-2" />
              Messages (Coming Soon)
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-slate-600">
              <p>• Your listing "2023 Hyundai Sonata" was approved</p>
              <p>• New inquiry on "2022 Kia Sportage"</p>
              <p>• Payment received for "2021 Genesis G80"</p>
              <p className="text-xs italic">
                (This section will show real data once write operations are implemented)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>✅ Real Data:</strong> Dashboard statistics are now pulling from your Supabase database.
            Create listings to see your stats update in real-time!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}





















