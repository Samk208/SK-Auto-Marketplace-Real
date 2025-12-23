"use client"

import { TrustScoreBadge } from "@/components/ai/trust-score-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getDealerById } from "@/lib/dealers"
import { generateVehicleSchema } from "@/lib/structured-data"
import { cn } from "@/lib/utils"
import type { CarListing } from "@/types"
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Fuel,
  Gauge,
  Heart,
  MapPin,
  MapPinned,
  MessageCircle,
  Settings,
  Star,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

interface ListingCardWithDealerProps {
  listing: CarListing
  onViewDetails: (id: string) => void
  onContactSeller: (id: string) => void
  onToggleFavorite: (id: string) => void
  dataSaver?: boolean
}

function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

function formatMileage(mileage: number, unit: string): string {
  return new Intl.NumberFormat("en-US").format(mileage) + " " + unit
}

export function ListingCardWithDealer({
  listing,
  onViewDetails,
  onContactSeller,
  onToggleFavorite,
  dataSaver = false,
}: ListingCardWithDealerProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorited, setIsFavorited] = useState(listing.isFavorite)
  const dealer = getDealerById(listing.dealerId)

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? listing.images.length - 1 : prevIndex - 1))
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === listing.images.length - 1 ? 0 : prevIndex + 1))
  }

  const handleFavorite = async () => {
    // Optimistic update
    setIsFavorited(!isFavorited)
    onToggleFavorite(listing.id)

    // Server action
    try {
      const { toggleFavoriteAction } = await import("@/app/actions/buyer")
      await toggleFavoriteAction(listing.id)
    } catch (error) {
      console.error("Failed to toggle favorite", error)
      // Revert on error
      setIsFavorited(isFavorited)
    }
  }

  const structuredData = generateVehicleSchema(listing, dealer)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group border border-border">
        <div className="relative">
          <div className="relative aspect-[4/3] bg-muted overflow-hidden">
            <Image
              src={
                dataSaver || !listing.images || listing.images.length === 0 || !listing.images[currentImageIndex]
                  ? "/placeholder.svg?height=200&width=300"
                  : listing.images[currentImageIndex]
              }
              alt={`${listing.make} ${listing.model}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={currentImageIndex === 0}
            />
            {listing.isReserved && (
              <Badge className="absolute top-2 right-2 bg-destructive text-white border-0 shadow-md">Reserved</Badge>
            )}
            {listing.verified && (
              <Badge
                variant="secondary"
                className="absolute top-2 left-2 bg-green-500/90 text-white border-0 shadow-md"
              >
                <CheckCircle className="mr-1 h-3 w-3" />
                Verified
              </Badge>
            )}
            <div className="absolute bottom-2 left-2">
              <TrustScoreBadge listingId={listing.id} showLabel={false} size="sm" />
            </div>
          </div>

          {!dataSaver && listing.images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handlePrevImage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleNextImage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        <CardContent className="p-4 space-y-3">
          <div>
            <h3 className="text-lg font-bold mb-1 line-clamp-1">
              {listing.year} {listing.make} {listing.model}
            </h3>
            {listing.trim && <p className="text-sm text-muted-foreground line-clamp-1">{listing.trim}</p>}
          </div>

          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-primary">{formatPrice(listing.price, listing.currency)}</p>
            {listing.originalPrice && listing.originalPrice > listing.price && (
              <p className="text-sm text-muted-foreground line-through">
                {formatPrice(listing.originalPrice, listing.currency)}
              </p>
            )}
          </div>

          {dealer && (
            <Link
              href={`/dealers/${dealer.id}`}
              className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-medium truncate">{dealer.name}</p>
                  {dealer.verified && <CheckCircle className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{dealer.location}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{dealer.rating}</span>
                <span className="text-xs text-muted-foreground">({dealer.totalReviews})</span>
              </div>
            </Link>
          )}

          {listing.destinationPorts && listing.destinationPorts.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPinned className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">Ships to: {listing.destinationPorts.slice(0, 2).join(", ")}</span>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="flex flex-col items-center gap-1 p-2 bg-muted/50 rounded-lg">
              <Gauge className="h-3.5 w-3.5 text-primary" />
              <span className="font-medium text-center">{formatMileage(listing.mileage, listing.mileageUnit)}</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2 bg-muted/50 rounded-lg">
              <Settings className="h-3.5 w-3.5 text-primary" />
              <span className="font-medium text-center">{listing.transmission}</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2 bg-muted/50 rounded-lg">
              <Fuel className="h-3.5 w-3.5 text-primary" />
              <span className="font-medium text-center">{listing.fuelType}</span>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "h-9 w-9 transition-all flex-shrink-0",
                isFavorited && "bg-red-50 border-red-200 text-red-600 hover:bg-red-100",
              )}
              onClick={handleFavorite}
            >
              <Heart className={cn("h-3.5 w-3.5", isFavorited && "fill-current")} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-9 text-xs hover:bg-primary hover:text-white transition-all bg-transparent"
              onClick={() => onContactSeller(listing.id)}
            >
              <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
              Contact
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="w-full h-9 text-xs hover:bg-secondary transition-all bg-transparent"
              onClick={() => onViewDetails(listing.id)}
            >
              <Eye className="mr-1.5 h-3.5 w-3.5" />
              Details
            </Button>
            <Link href={`/checkout/${listing.id}`} className="w-full">
              <Button
                className="w-full h-9 text-xs shadow-sm hover:shadow-md transition-all bg-primary hover:bg-primary/90"
                disabled={listing.isReserved}
              >
                {listing.isReserved ? "Reserved" : "Buy Now"}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
