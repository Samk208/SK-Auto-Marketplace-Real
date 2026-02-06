// @ts-nocheck
"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Heart,
  MapPin,
  Star,
  Eye,
  MessageCircle,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Gauge,
  Settings,
  Fuel,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { CarListingCardProps } from "./car-listing-types";

function formatPrice(price: number, currency: string): string {
  if (currency === "KRW") {
    return `₩${(price / 10000).toFixed(0)}만`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

function formatMileage(mileage: number, unit: string): string {
  return new Intl.NumberFormat("en-US").format(mileage) + " " + unit;
}

function StarRating({
  rating,
  totalReviews,
}: {
  rating: number;
  totalReviews: number;
}) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "h-3 w-3",
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200",
            )}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">({totalReviews})</span>
    </div>
  );
}

function CarListingCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <Skeleton className="aspect-[4/3] w-full" />
        <div className="absolute top-2 right-2">
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>
        <div className="absolute top-2 left-2">
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-6 w-1/3" />
        <div className="flex items-center gap-1">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

function CarListingCardError() {
  return (
    <Card className="overflow-hidden border-destructive/50">
      <div className="relative aspect-[4/3] bg-muted flex items-center justify-center">
        <div className="text-center">
          <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Failed to load image</p>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="text-center py-4">
          <p className="text-sm text-destructive">Unable to load car listing</p>
          <Button variant="outline" size="sm" className="mt-2 bg-transparent">
            Try Again
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function CarListingCard({
  listing,
  isLoading = false,
  hasError = false,
  onViewDetails,
  onContactSeller,
  onTranslate,
  onToggleFavorite,
}: CarListingCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(listing.isFavorite);

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? listing.images.length - 1 : prevIndex - 1,
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === listing.images.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    onToggleFavorite(listing.id);
  };

  if (isLoading) {
    return <CarListingCardSkeleton />;
  }

  if (hasError) {
    return <CarListingCardError />;
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group border border-border-subtle bg-surface">
      <div className="relative">
        <div className="relative aspect-[4/3] bg-muted overflow-hidden">
          <Image
            src={listing.images[currentImageIndex] || "/placeholder.svg"}
            alt={`${listing.make} ${listing.model}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
            onError={() => setImageError(true)}
          />
          {listing.isReserved && (
            <Badge className="absolute top-2 right-2 bg-destructive text-white border-0 shadow-md">
              Reserved
            </Badge>
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
        </div>

        {listing.images.length > 1 && (
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

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {listing.images.map((_, index) => (
            <button
              key={index}
              className={cn(
                "h-1.5 rounded-full transition-all",
                index === currentImageIndex
                  ? "w-4 bg-white"
                  : "w-1.5 bg-white/50",
              )}
              onClick={() => setCurrentImageIndex(index)}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="text-lg font-bold mb-1 line-clamp-1">
            {listing.year} {listing.make} {listing.model}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {listing.trim}
          </p>
        </div>

        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-bold text-primary">
            {formatPrice(listing.price, listing.currency)}
          </p>
          {listing.originalPrice && listing.originalPrice > listing.price && (
            <p className="text-sm text-muted-foreground line-through">
              {formatPrice(listing.originalPrice, listing.currency)}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span>{listing.location}</span>
          </div>
          <StarRating
            rating={listing.sellerRating}
            totalReviews={listing.sellerTotalReviews}
          />
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex flex-col items-center gap-1 p-2 bg-primary-soft/30 rounded-lg">
            <Gauge className="h-3.5 w-3.5 text-primary" />
            <span className="font-medium">
              {formatMileage(listing.mileage, listing.mileageUnit)}
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 p-2 bg-primary-soft/30 rounded-lg">
            <Settings className="h-3.5 w-3.5 text-primary" />
            <span className="font-medium">{listing.transmission}</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-2 bg-primary-soft/30 rounded-lg">
            <Fuel className="h-3.5 w-3.5 text-primary" />
            <span className="font-medium">{listing.fuelType}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "flex-1 h-9 text-xs transition-all",
              isFavorited &&
                "bg-red-50 border-red-200 text-red-600 hover:bg-red-100 dark:bg-red-950/50 dark:border-red-800 dark:text-red-400",
            )}
            onClick={handleFavorite}
          >
            <Heart
              className={cn("h-3.5 w-3.5", isFavorited && "fill-current")}
            />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="col-span-2 h-9 text-xs hover:bg-primary hover:text-white transition-all bg-transparent"
            onClick={onContactSeller}
          >
            <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
            Contact
          </Button>
        </div>

        <Button
          className="w-full h-9 text-xs shadow-sm hover:shadow-md transition-all"
          onClick={onViewDetails}
        >
          <Eye className="mr-1.5 h-3.5 w-3.5" />
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}
