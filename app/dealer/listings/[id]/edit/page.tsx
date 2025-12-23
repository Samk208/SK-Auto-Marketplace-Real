import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { getCurrentUser } from "@/lib/auth/supabase-auth-server"
import { getDealerByUserId } from "@/lib/repositories/dealers"
import { getListingByIdForDealer } from "@/lib/repositories/listings"
import { ListingForm } from "@/components/dealer/listing-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface EditListingPageProps {
  params: Promise<{ id: string }>
}

export default async function EditListingPage({ params }: EditListingPageProps) {
  const { id } = await params
  const user = await getCurrentUser()

  // Check if user is logged in
  if (!user) {
    redirect(`/auth/login?redirect=/dealer/listings/${id}/edit`)
  }

  // Check if user is a dealer
  const dealer = await getDealerByUserId(user.id)
  if (!dealer) {
    return (
      <div className="container max-w-2xl mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Dealer Account Required</CardTitle>
            <CardDescription>
              You need to be a registered dealer to edit listings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dealer/dashboard">
              <Button variant="outline">Go to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Fetch the listing (only if owned by this dealer)
  const listing = await getListingByIdForDealer(id, dealer.id)
  if (!listing) {
    notFound()
  }

  // Parse specifications for description
  let description = ""
  if (listing.specifications) {
    const specs = listing.specifications as Record<string, string>
    description = specs.description || ""
  }

  // Map DB values to form values
  const initialValues = {
    id: listing.id,
    title: listing.title,
    brand: listing.brand,
    model: listing.model,
    year: listing.year,
    price: listing.price,
    mileage: listing.mileage || undefined,
    fuel_type: listing.fuel_type || "",
    transmission: listing.transmission || "",
    body_type: listing.body_type || "",
    condition: listing.condition || "",
    location: listing.location || "",
    destination_port: listing.destination_port || "",
    status: listing.status as "pending" | "active",
    featured: listing.featured,
    description,
    // Image fields
    primary_image_url: (listing as any).primary_image_url || undefined,
    image_urls: (listing as any).image_urls || [],
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/dealer/listings" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Listings
        </Link>
        <h1 className="text-3xl font-bold">Edit Listing</h1>
        <p className="text-muted-foreground mt-1">
          Update the details for: {listing.title}
        </p>
      </div>

      <ListingForm mode="edit" initialValues={initialValues} />
    </div>
  )
}

