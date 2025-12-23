import { ShopPageClient } from "@/components/shop/shop-page-client"
import { getActiveListings } from "@/lib/repositories/listings"
import { Metadata } from "next"
import { unstable_cache } from "next/cache"

// Cache listings for 60 seconds to reduce DB load
const getCachedListings = unstable_cache(
  async (filters: Parameters<typeof getActiveListings>[0]) => {
    return getActiveListings(filters)
  },
  ["shop-listings"],
  { revalidate: 60, tags: ["listings"] }
)

interface ShopPageProps {
  searchParams: Promise<{
    brand?: string
    bodyType?: string
    destinationPort?: string
    minPrice?: string
    maxPrice?: string
    minYear?: string
    maxYear?: string
    transmission?: string
    fuelType?: string
    search?: string
    page?: string
    pageSize?: string
    sortBy?: string
    sortOrder?: string
  }>
}

/**
 * SEO Metadata for Shop page
 */
export const metadata: Metadata = {
  title: "Browse Korean Vehicles for Africa | SK AutoSphere",
  description:
    "Explore verified Korean car listings ready for export to African ports. Find Hyundai, Kia, Genesis, and more from trusted Korean dealers.",
  keywords: [
    "Korean cars",
    "Hyundai",
    "Kia",
    "Genesis",
    "car export Africa",
    "Lagos port",
    "Tema port",
    "Mombasa",
    "used cars Korea",
  ],
  openGraph: {
    title: "Browse Korean Vehicles for Africa | SK AutoSphere",
    description:
      "Explore verified Korean car listings ready for export to African ports.",
    type: "website",
    url: "/shop",
  },
  alternates: {
    canonical: "/shop",
  },
}

/**
 * Shop Page - Server Component
 * Fetches listings from API and passes to client component for interactivity
 */
export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams

  // Parse query parameters
  const filters = {
    brand: params.brand,
    bodyType: params.bodyType,
    destinationPort: params.destinationPort,
    minPrice: params.minPrice ? parseInt(params.minPrice, 10) : undefined,
    maxPrice: params.maxPrice ? parseInt(params.maxPrice, 10) : undefined,
    minYear: params.minYear ? parseInt(params.minYear, 10) : undefined,
    maxYear: params.maxYear ? parseInt(params.maxYear, 10) : undefined,
    transmission: params.transmission,
    fuelType: params.fuelType,
    search: params.search,
    page: params.page ? parseInt(params.page, 10) : 1,
    pageSize: params.pageSize ? parseInt(params.pageSize, 10) : 12,
    sortBy: (params.sortBy as "price" | "year" | "created_at" | "mileage") || undefined,
    sortOrder: (params.sortOrder as "asc" | "desc") || undefined,
  }

  // Fetch listings from API with caching
  const { items, total, totalPages } = await getCachedListings(filters)

  return (
    <ShopPageClient
      initialListings={items}
      totalListings={total}
      totalPages={totalPages}
      initialPage={filters.page}
      initialFilters={{
        brand: filters.brand,
        bodyType: filters.bodyType,
        destinationPort: filters.destinationPort,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        minYear: filters.minYear,
        maxYear: filters.maxYear,
        transmission: filters.transmission,
        fuelType: filters.fuelType,
        search: filters.search,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      }}
    />
  )
}
