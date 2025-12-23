"use client"

import { CategoryNav } from "@/components/shop/category-nav"
import { ListingCardWithDealer } from "@/components/shop/listing-card-with-dealer"
import { PortPresetButtons } from "@/components/shop/port-preset-buttons"
import { ResourcesLinkSection } from "@/components/shop/resources-link-section"
import { ShopControls } from "@/components/shop/shop-controls"
import { ShopFiltersPanel, type ShopFilters } from "@/components/shop/shop-filters"
import { ShopHeader } from "@/components/shop/shop-header"
import { ShopResultsSummary } from "@/components/shop/shop-results-summary"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { SHOP_COUNTRY_PRESETS } from "@/lib/mock-shop-data"
import { generateBreadcrumbSchema, generateCollectionPageSchema } from "@/lib/structured-data"
import type { CarListing } from "@/types"
import dynamic from "next/dynamic"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useMemo, useState } from "react"
const ShopTrustStrip = dynamic(
  () => import("@/components/shop/shop-trust-strip").then(mod => ({ default: mod.ShopTrustStrip })),
  { ssr: false }
)

const ITEMS_PER_PAGE = 12

interface ShopPageClientProps {
  initialListings: CarListing[]
  totalListings: number
  totalPages: number
  initialPage: number
  initialFilters: {
    brand?: string
    bodyType?: string
    destinationPort?: string
    minPrice?: number
    maxPrice?: number
    minYear?: number
    maxYear?: number
    transmission?: string
    fuelType?: string
    condition?: string
    search?: string
    sortBy?: "price" | "year" | "created_at" | "mileage"
    sortOrder?: "asc" | "desc"
  }
}

export function ShopPageClient({
  initialListings,
  totalListings,
  totalPages: serverTotalPages,
  initialPage,
  initialFilters,
}: ShopPageClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Initialize state from server-provided filters
  const [searchQuery, setSearchQuery] = useState(initialFilters.search || "")
  const [sortBy, setSortBy] = useState(() => {
    if (initialFilters.sortBy === "price" && initialFilters.sortOrder === "asc") return "price_low"
    if (initialFilters.sortBy === "price" && initialFilters.sortOrder === "desc") return "price_high"
    if (initialFilters.sortBy === "year") return "year_new"
    if (initialFilters.sortBy === "mileage") return "mileage_low"
    return "recommended"
  })
  const [selectedCountry, setSelectedCountry] = useState(
    initialFilters.destinationPort ? getCountryFromPort(initialFilters.destinationPort) : ""
  )
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [isLoading, setIsLoading] = useState(false)
  const [listings, setListings] = useState<CarListing[]>(initialListings)

  const [filters, setFilters] = useState<ShopFilters>({
    priceRange: [initialFilters.minPrice || 0, initialFilters.maxPrice || 100000],
    yearRange: [initialFilters.minYear || 2010, initialFilters.maxYear || 2024],
    bodyTypes: initialFilters.bodyType ? [initialFilters.bodyType] : [],
    transmissions: initialFilters.transmission ? [initialFilters.transmission] : [],
    fuelTypes: initialFilters.fuelType ? [initialFilters.fuelType] : [],
    location: "",
    condition: initialFilters.condition || "",
    verifiedOnly: false,
    dataSaver: false,
  })

  // Generate structured data for SEO
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://skautosphere.com" },
    { name: "Shop", url: "https://skautosphere.com/shop" },
  ])

  const collectionSchema = generateCollectionPageSchema(
    "Browse Korean Vehicles for Africa | SK AutoSphere",
    "Explore verified listings from Korean dealers, ready for export to African ports including Lagos, Tema, Mombasa, and more.",
    "https://skautosphere.com/shop",
    totalListings,
  )

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.bodyTypes.length > 0) count++
    if (filters.transmissions.length > 0) count++
    if (filters.fuelTypes.length > 0) count++
    if (filters.location) count++
    if (filters.condition) count++
    if (filters.verifiedOnly) count++
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 100000) count++
    if (filters.yearRange[0] > 2010 || filters.yearRange[1] < 2024) count++
    return count
  }, [filters])

  // Generate active filter tags
  const activeFilters = useMemo(() => {
    const tags = []
    if (filters.bodyTypes.length > 0) {
      tags.push({ id: "bodyTypes", label: "Body Type", value: filters.bodyTypes.join(", ") })
    }
    if (filters.transmissions.length > 0) {
      tags.push({ id: "transmissions", label: "Transmission", value: filters.transmissions.join(", ") })
    }
    if (filters.fuelTypes.length > 0) {
      tags.push({ id: "fuelTypes", label: "Fuel", value: filters.fuelTypes.join(", ") })
    }
    if (filters.location) {
      tags.push({ id: "location", label: "Location", value: filters.location })
    }
    if (filters.condition) {
      tags.push({ id: "condition", label: "Condition", value: filters.condition })
    }
    if (filters.verifiedOnly) {
      tags.push({ id: "verifiedOnly", label: "Verified", value: "Yes" })
    }
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 100000) {
      tags.push({
        id: "priceRange",
        label: "Price",
        value: `$${filters.priceRange[0].toLocaleString()} - $${filters.priceRange[1].toLocaleString()}`,
      })
    }
    if (filters.yearRange[0] > 2010 || filters.yearRange[1] < 2024) {
      tags.push({ id: "yearRange", label: "Year", value: `${filters.yearRange[0]} - ${filters.yearRange[1]}` })
    }
    return tags
  }, [filters])

  // Client-side filtering for search, sort, and advanced filters
  const filteredListings = useMemo(() => {
    let result = [...listings]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (listing) =>
          listing.title.toLowerCase().includes(query) ||
          listing.make.toLowerCase().includes(query) ||
          listing.model.toLowerCase().includes(query),
      )
    }

    // Port/Country filter (client-side for preset buttons)
    if (selectedCountry) {
      const preset = SHOP_COUNTRY_PRESETS.find((p) => p.id === selectedCountry)
      if (preset) {
        result = result.filter((listing) => listing.destinationPorts?.includes(preset.port))
      }
    }

    // Price filter
    result = result.filter(
      (listing) => listing.price >= filters.priceRange[0] && listing.price <= filters.priceRange[1],
    )

    // Year filter
    result = result.filter((listing) => listing.year >= filters.yearRange[0] && listing.year <= filters.yearRange[1])

    // Body type filter (client-side additional filtering)
    if (filters.bodyTypes.length > 0) {
      result = result.filter((listing) => filters.bodyTypes.includes(listing.bodyType || ""))
    }

    // Transmission filter
    if (filters.transmissions.length > 0) {
      result = result.filter((listing) => filters.transmissions.includes(listing.transmission))
    }

    // Fuel type filter
    if (filters.fuelTypes.length > 0) {
      result = result.filter((listing) => filters.fuelTypes.includes(listing.fuelType))
    }

    // Location filter
    if (filters.location) {
      result = result.filter((listing) => listing.location.toLowerCase().includes(filters.location.toLowerCase()))
    }

    // Condition filter
    if (filters.condition) {
      result = result.filter((listing) =>
        (listing as any).vehicleCondition?.toLowerCase() === filters.condition?.toLowerCase() ||
        (listing as any).condition?.toLowerCase() === filters.condition?.toLowerCase()
      )
    }

    // Verified only filter
    if (filters.verifiedOnly) {
      result = result.filter((listing) => listing.verified)
    }

    // Sort
    switch (sortBy) {
      case "price_low":
        result.sort((a, b) => a.price - b.price)
        break
      case "price_high":
        result.sort((a, b) => b.price - a.price)
        break
      case "year_new":
        result.sort((a, b) => b.year - a.year)
        break
      case "mileage_low":
        result.sort((a, b) => a.mileage - b.mileage)
        break
      default:
        // Recommended (verified first, then by rating)
        result.sort((a, b) => {
          if (a.verified && !b.verified) return -1
          if (!a.verified && b.verified) return 1
          return (b.sellerRating || 0) - (a.sellerRating || 0)
        })
    }

    return result
  }, [listings, searchQuery, selectedCountry, filters, sortBy])

  // Paginate
  const paginatedListings = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    const end = start + ITEMS_PER_PAGE
    return filteredListings.slice(start, end)
  }, [filteredListings, currentPage])

  const totalPages = Math.ceil(filteredListings.length / ITEMS_PER_PAGE)

  // Update URL with filters - triggers server-side refetch
  const updateUrlWithFilters = useCallback((newFilters: Partial<{
    brand?: string
    bodyType?: string
    destinationPort?: string
    minPrice?: number
    maxPrice?: number
    minYear?: number
    maxYear?: number
    transmission?: string
    fuelType?: string
    condition?: string
    search?: string
    page?: number
    sortBy?: string
    sortOrder?: string
  }>) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.set(key, value.toString())
      } else {
        params.delete(key)
      }
    })

    // Reset to page 1 when filters change (except when explicitly setting page)
    if (!('page' in newFilters)) {
      params.delete('page')
    }

    router.push(`/shop?${params.toString()}`, { scroll: false })
  }, [router, searchParams])

  const handleRemoveFilter = (id: string) => {
    const updatedFilters = { ...filters }
    switch (id) {
      case "bodyTypes":
        updatedFilters.bodyTypes = []
        updateUrlWithFilters({ bodyType: undefined })
        break
      case "transmissions":
        updatedFilters.transmissions = []
        updateUrlWithFilters({ transmission: undefined })
        break
      case "fuelTypes":
        updatedFilters.fuelTypes = []
        updateUrlWithFilters({ fuelType: undefined })
        break
      case "location":
        updatedFilters.location = ""
        break
      case "condition":
        updatedFilters.condition = ""
        updateUrlWithFilters({ condition: undefined })
        break
      case "verifiedOnly":
        updatedFilters.verifiedOnly = false
        break
      case "priceRange":
        updatedFilters.priceRange = [0, 100000]
        updateUrlWithFilters({ minPrice: undefined, maxPrice: undefined })
        break
      case "yearRange":
        updatedFilters.yearRange = [2010, 2024]
        updateUrlWithFilters({ minYear: undefined, maxYear: undefined })
        break
    }
    setFilters(updatedFilters)
  }

  // Apply filters to URL (for server-side filtering)
  const applyFiltersToUrl = useCallback(() => {
    updateUrlWithFilters({
      minPrice: filters.priceRange[0] > 0 ? filters.priceRange[0] : undefined,
      maxPrice: filters.priceRange[1] < 100000 ? filters.priceRange[1] : undefined,
      minYear: filters.yearRange[0] > 2010 ? filters.yearRange[0] : undefined,
      maxYear: filters.yearRange[1] < 2024 ? filters.yearRange[1] : undefined,
      transmission: filters.transmissions.length === 1 ? filters.transmissions[0] : undefined,
      fuelType: filters.fuelTypes.length === 1 ? filters.fuelTypes[0] : undefined,
      bodyType: filters.bodyTypes.length === 1 ? filters.bodyTypes[0] : undefined,
      condition: filters.condition,
    })
  }, [filters, updateUrlWithFilters])

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country)
    const preset = SHOP_COUNTRY_PRESETS.find((p) => p.id === country)
    if (preset) {
      updateUrlWithFilters({ destinationPort: preset.port.toLowerCase() })
    } else {
      updateUrlWithFilters({ destinationPort: undefined })
    }
  }

  // Handle sort change - sync to URL for server-side sorting
  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy)
    let sortByParam: string | undefined
    let sortOrderParam: string | undefined

    switch (newSortBy) {
      case "price_low":
        sortByParam = "price"
        sortOrderParam = "asc"
        break
      case "price_high":
        sortByParam = "price"
        sortOrderParam = "desc"
        break
      case "year_new":
        sortByParam = "year"
        sortOrderParam = "desc"
        break
      case "mileage_low":
        sortByParam = "mileage"
        sortOrderParam = "asc"
        break
      default:
        sortByParam = undefined
        sortOrderParam = undefined
    }
    updateUrlWithFilters({ sortBy: sortByParam, sortOrder: sortOrderParam })
  }

  // Handle search - sync to URL for server-side search
  const handleSearchSubmit = useCallback(() => {
    updateUrlWithFilters({ search: searchQuery || undefined })
  }, [searchQuery, updateUrlWithFilters])

  const handleLoadMore = () => {
    setIsLoading(true)
    const nextPage = currentPage + 1
    updateUrlWithFilters({ page: nextPage })
    setCurrentPage(nextPage)
    setIsLoading(false)
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

      <div className="min-h-screen flex flex-col">
        <ShopHeader role="buyer" locale="en" />
        <CategoryNav />

        {/* Shop Page Hero Header */}
        <div className="relative py-12 md:py-16 bg-[#f8fafc] dark:bg-slate-950 border-b border-sidebar-border/50 mb-8 overflow-hidden">
          {/* Brand Pattern Background */}
          <div className="absolute inset-0 z-0 opacity-[0.04] dark:opacity-[0.06]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          />
          <div className="container relative z-10 mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-[#0f172a] dark:text-white tracking-tight">
              Browse Korean Vehicles for <span className="text-[#2558fa]">Africa</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Explore verified listings from Korean dealers, ready for export to your port in Africa.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 pb-12">

          <ShopControls
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSearchSubmit={handleSearchSubmit}
            sortBy={sortBy}
            onSortChange={handleSortChange}
          />

          <div className="mt-6">
            <PortPresetButtons selectedCountry={selectedCountry} onCountryChange={handleCountryChange} />
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Panel */}
            <div className="lg:col-span-1">
              <ShopFiltersPanel filters={filters} onFiltersChange={setFilters} activeCount={activeFilterCount} />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              <ShopResultsSummary
                totalResults={totalListings}
                filteredResults={filteredListings.length}
                activeFilters={activeFilters}
                onRemoveFilter={handleRemoveFilter}
                dataSaver={filters.dataSaver}
              />

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <Card key={i}>
                      <Skeleton className="aspect-[4/3] w-full" />
                      <CardContent className="p-4 space-y-3">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-6 w-1/3" />
                        <Skeleton className="h-4 w-1/2" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : paginatedListings.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">No vehicles found matching your filters</p>
                  <p className="text-sm text-muted-foreground mt-2">Try adjusting your search criteria</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedListings.map((listing) => (
                    <ListingCardWithDealer
                      key={listing.id}
                      listing={listing}
                      onViewDetails={(id) => (window.location.href = `/shop/${id}`)}
                      onContactSeller={(id) => {
                        // TODO: Add WhatsApp integration when dealer phone data is available
                        console.log("[Contact] Seller for listing:", id)
                      }}
                      onToggleFavorite={(id) => console.log("[v0] Toggle favorite:", id)}
                      dataSaver={filters.dataSaver}
                    />
                  ))}
                </div>
              )}

              {/* Pagination / Load More */}
              {filteredListings.length > ITEMS_PER_PAGE && currentPage < totalPages && (
                <div className="flex justify-center pt-8">
                  <Button size="lg" onClick={handleLoadMore} disabled={isLoading} className="min-w-[200px]">
                    {isLoading ? "Loading..." : `Load more (${currentPage} of ${totalPages})`}
                  </Button>
                </div>
              )}

              <ResourcesLinkSection />
            </div>
          </div>
        </div>

        <ShopTrustStrip />
      </div>
    </>
  )
}

// Helper function to get country ID from port name
function getCountryFromPort(port: string): string {
  const portLower = port.toLowerCase()
  const preset = SHOP_COUNTRY_PRESETS.find(
    (p) => p.port.toLowerCase().includes(portLower) || portLower.includes(p.port.toLowerCase())
  )
  return preset?.id || ""
}

