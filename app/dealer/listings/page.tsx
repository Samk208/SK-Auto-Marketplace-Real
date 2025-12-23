import { DeleteListingButton } from "@/components/dealer/delete-listing-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentDealer, getCurrentUser } from "@/lib/auth/supabase-auth-server"
import { getDealerListings } from "@/lib/repositories/dealers"
import { CheckCircle2, Clock, Eye, Pencil, Plus, XCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

type PageProps = {
  searchParams: Promise<{
    status?: 'pending' | 'active' | 'sold' | 'rejected'
    page?: string
  }>
}

export default async function DealerListingsPage({ searchParams }: PageProps) {
  const user = await getCurrentUser()
  const dealer = await getCurrentDealer()

  // Redirect if not authenticated
  if (!user || !dealer) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please log in as a dealer to view your listings</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/auth/login?redirect=/dealer/listings">
              <Button className="w-full">Log in</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Get search params
  const params = await searchParams
  const status = params.status
  const page = parseInt(params.page || '1', 10)

  // Fetch dealer's listings
  const { listings, total, totalPages } = await getDealerListings(dealer.id, {
    status,
    page,
    pageSize: 12,
  })

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Listings</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {total} total listing{total !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/dealer/listings/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Listing
          </Button>
        </Link>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 flex-wrap">
        <Link href="/dealer/listings">
          <Button variant={!status ? "default" : "outline"} size="sm">
            All Listings
          </Button>
        </Link>
        <Link href="/dealer/listings?status=active">
          <Button variant={status === 'active' ? "default" : "outline"} size="sm">
            Active
          </Button>
        </Link>
        <Link href="/dealer/listings?status=pending">
          <Button variant={status === 'pending' ? "default" : "outline"} size="sm">
            Pending
          </Button>
        </Link>
        <Link href="/dealer/listings?status=sold">
          <Button variant={status === 'sold' ? "default" : "outline"} size="sm">
            Sold
          </Button>
        </Link>
        <Link href="/dealer/listings?status=rejected">
          <Button variant={status === 'rejected' ? "default" : "outline"} size="sm">
            Rejected
          </Button>
        </Link>
      </div>

      {/* Listings Grid */}
      {listings.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-slate-600 mb-4">
              {status ? `No ${status} listings found.` : 'No listings yet.'}
            </p>
            <Link href="/dealer/listings/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Listing
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing: any) => (
            <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-slate-100">
                {listing.primary_image_url || (listing.image_urls && listing.image_urls.length > 0) ? (
                  <Image
                    src={listing.primary_image_url || listing.image_urls[0]}
                    alt={listing.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400">
                    No Image
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  {listing.status === 'active' && (
                    <Badge className="bg-green-600">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  )}
                  {listing.status === 'pending' && (
                    <Badge className="bg-yellow-600">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending
                    </Badge>
                  )}
                  {listing.status === 'sold' && (
                    <Badge className="bg-blue-600">Sold</Badge>
                  )}
                  {listing.status === 'rejected' && (
                    <Badge className="bg-red-600">
                      <XCircle className="h-3 w-3 mr-1" />
                      Rejected
                    </Badge>
                  )}
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-lg line-clamp-1">{listing.title}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <span className="text-lg font-bold text-green-600">
                    ${listing.price.toLocaleString()}
                  </span>
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="text-sm text-slate-600">
                  <p>{listing.year} • {listing.brand} {listing.model}</p>
                  <p className="flex items-center gap-1 mt-1">
                    <Eye className="h-3 w-3" />
                    {listing.views || 0} views
                  </p>
                </div>

                <div className="flex gap-2 items-center">
                  <Link href={`/listings/${listing.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      View
                    </Button>
                  </Link>
                  <Link href={`/dealer/listings/${listing.id}/edit`} className="flex-1">
                    <Button size="sm" className="w-full">
                      <Pencil className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </Link>
                  <DeleteListingButton 
                    listingId={listing.id} 
                    listingTitle={listing.title} 
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {page > 1 && (
            <Link href={`/dealer/listings?${status ? `status=${status}&` : ''}page=${page - 1}`}>
              <Button variant="outline">Previous</Button>
            </Link>
          )}
          <span className="flex items-center px-4 text-sm text-slate-600">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`/dealer/listings?${status ? `status=${status}&` : ''}page=${page + 1}`}>
              <Button variant="outline">Next</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
