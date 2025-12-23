"use client"

import { CarListingCard } from "@/car-listing-card-component"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import type { CarListing } from "@/types"

interface ShopGridProps {
  listings: CarListing[]
  isLoading?: boolean
  onViewDetails: (id: string) => void
  onContactSeller: (id: string) => void
  onToggleFavorite: (id: string) => void
}

export function ShopGrid({ listings, isLoading, onViewDetails, onContactSeller, onToggleFavorite }: ShopGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <Card key={i}>
            <Skeleton className="aspect-[4/3] w-full" />
            <CardContent className="p-4 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
              <div className="grid grid-cols-3 gap-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">No vehicles found matching your filters</p>
        <p className="text-sm text-muted-foreground mt-2">Try adjusting your search criteria</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <CarListingCard
          key={listing.id}
          listing={listing}
          onViewDetails={onViewDetails}
          onContactSeller={onContactSeller}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  )
}
