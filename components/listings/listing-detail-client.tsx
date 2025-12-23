"use client"

import { AIConditionReport } from "@/components/ai/condition-report"
import { ExportCostEstimator } from "@/components/ai/export-cost-estimator"
import { TrustScoreDetail } from "@/components/ai/trust-score-detail"
import { InquiryForm } from "@/components/listings/inquiry-form"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { CarListing } from "@/types"
import {
  ArrowLeft,
  Award,
  Calculator,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Flag,
  Heart,
  Languages,
  MapPin,
  MessageCircle,
  Phone,
  RotateCcw,
  Settings,
  Share2,
  Shield,
  Star,
  ZoomIn,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface ListingDetailClientProps {
  listing: CarListing
}

// Extended type for detail view with optional extra fields
interface CarDetail extends CarListing {
  titleKorean?: string
  coordinates?: { lat: number; lng: number }
  drivetrain?: string
  condition?: "Excellent" | "Very Good" | "Good" | "Fair"
  registrationYear?: number
  accidentHistory?: boolean
  viewCount?: number
  postedDate?: string
}

function ImageGallery({ images }: { images: string[] }) {
  const [currentImage, setCurrentImage] = useState(0)
  const validImages = images.filter(img => img && img.trim() !== "")
  const displayImages = validImages.length > 0 ? validImages : ["/placeholder.svg?height=600&width=800&text=No+Image"]

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % displayImages.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + displayImages.length) % displayImages.length)
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-[4/3] bg-muted rounded-lg overflow-hidden group">
        <img
          src={displayImages[currentImage] || "/placeholder.svg"}
          alt={`Car image ${currentImage + 1}`}
          className="w-full h-full object-cover"
        />

        {displayImages.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
          {currentImage + 1} / {displayImages.length}
        </div>

        <Button
          variant="secondary"
          size="icon"
          className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>

        <Button
          variant="secondary"
          className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          360° View
        </Button>
      </div>

      {/* Thumbnail Navigation */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {displayImages.map((image, index) => (
            <button
              key={index}
              className={cn(
                "flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors",
                currentImage === index ? "border-primary" : "border-transparent hover:border-muted-foreground",
              )}
              onClick={() => setCurrentImage(index)}
            >
              <img
                src={image || "/placeholder.svg"}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Navigation Dots */}
      {displayImages.length > 1 && (
        <div className="flex justify-center gap-2">
          {displayImages.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                currentImage === index ? "bg-primary" : "bg-muted-foreground/30 hover:bg-muted-foreground/50",
              )}
              onClick={() => setCurrentImage(index)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function CarHeader({ car }: { car: CarDetail }) {
  const [showKorean, setShowKorean] = useState(false)
  const [isFavorite, setIsFavorite] = useState(car.isFavorite || false)

  // Use totalViews from DMS enhancement or fallback to viewCount
  const viewCount = car.totalViews || car.viewCount || 0

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold">
              {showKorean && car.titleKorean ? car.titleKorean : car.title}
            </h1>
            {car.titleKorean && (
              <Button variant="outline" size="sm" onClick={() => setShowKorean(!showKorean)} className="flex-shrink-0">
                <Languages className="h-4 w-4 mr-2" />
                {showKorean ? "EN" : "한글"}
              </Button>
            )}
          </div>
          <div className="flex items-center gap-4 text-muted-foreground flex-wrap">
            <span>
              {car.year} • {car.make} {car.model}
            </span>
            {viewCount > 0 && (
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{viewCount} views</span>
              </div>
            )}
            {car.totalInquiries && car.totalInquiries > 0 && (
              <div className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                <span>{car.totalInquiries} inquiries</span>
              </div>
            )}
            {car.vehicleCondition && (
              <Badge variant="secondary" className={cn(
                car.vehicleCondition === 'excellent' && "bg-green-100 text-green-800",
                car.vehicleCondition === 'good' && "bg-blue-100 text-blue-800",
                car.vehicleCondition === 'fair' && "bg-yellow-100 text-yellow-800",
                car.vehicleCondition === 'poor' && "bg-red-100 text-red-800",
              )}>
                {car.vehicleCondition.charAt(0).toUpperCase() + car.vehicleCondition.slice(1)} Condition
              </Badge>
            )}
            {car.postedDate && (
              <span>Posted {new Date(car.postedDate).toLocaleDateString()}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={async () => {
              // Optimistic update
              setIsFavorite(!isFavorite)

              // Server action
              try {
                const { toggleFavoriteAction } = await import("@/app/actions/buyer")
                await toggleFavoriteAction(car.id)
              } catch (error) {
                console.error("Failed to toggle favorite", error)
                // Revert on error
                setIsFavorite(isFavorite)
              }
            }}
            className={cn(isFavorite && "text-red-500 border-red-500")}
          >
            <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Flag className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-3xl md:text-4xl font-bold text-primary">
          ${car.price.toLocaleString()}
        </div>
        <Button variant="outline" size="sm">
          <Calculator className="h-4 w-4 mr-2" />
          Financing Calculator
        </Button>
      </div>
    </div>
  )
}

function SpecificationsTable({ car }: { car: CarDetail }) {
  // Map vehicle condition to display text
  const conditionMap: Record<string, string> = {
    excellent: "Excellent",
    good: "Good",
    fair: "Fair",
    poor: "Poor",
  }

  const specs = [
    { label: "Year", value: car.year.toString() },
    { label: "Mileage", value: `${car.mileage.toLocaleString()} ${car.mileageUnit}` },
    { label: "Transmission", value: car.transmission },
    { label: "Fuel Type", value: car.fuelType },
    { label: "Engine", value: car.engineSize ? `${car.engineSize}L` : "N/A" },
    { label: "Horsepower", value: car.horsepower ? `${car.horsepower} hp` : "N/A" },
    { label: "Body Type", value: car.bodyType || "N/A" },
    { label: "Drivetrain", value: car.drivetrain || "N/A" },
    { label: "Exterior Color", value: car.exteriorColor || "N/A" },
    { label: "Interior Color", value: car.interiorColor || "N/A" },
    { label: "Seating", value: car.seatingCapacity ? `${car.seatingCapacity} seats` : "N/A" },
    { label: "Condition", value: car.vehicleCondition ? conditionMap[car.vehicleCondition] || car.vehicleCondition : (car.condition || "N/A") },
    { label: "Previous Owners", value: car.previousOwners?.toString() || "N/A" },
    { label: "VIN", value: car.vin || "N/A" },
  ].filter(spec => spec.value !== "N/A")

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Specifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {specs.map((spec, index) => (
            <div key={index} className="flex justify-between py-2 border-b border-muted last:border-0">
              <span className="text-muted-foreground">{spec.label}</span>
              <span className="font-medium">{spec.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function SellerCard({ seller, verified }: { seller: CarListing["seller"]; verified?: boolean }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Seller Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback>
                {seller.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{seller.name}</h3>
                {verified && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "h-3 w-3",
                        star <= seller.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200",
                      )}
                    />
                  ))}
                </div>
                <span>({seller.totalReviews} reviews)</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Usually responds within 2 hours</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-muted-foreground" />
              <span>Trusted Korean Dealer</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button className="w-full">
              <MessageCircle className="h-4 w-4 mr-2" />
              Message
            </Button>
            <Button variant="outline" className="w-full bg-transparent">
              <Phone className="h-4 w-4 mr-2" />
              Call
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function LocationCard({ location }: { location: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Location
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm">{location}</p>
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Map view coming soon</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function FeaturesCard({ features }: { features?: string[] }) {
  if (!features || features.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Features & Equipment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function DestinationPortsCard({ ports }: { ports?: string[] }) {
  if (!ports || ports.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Available Destination Ports
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {ports.map((port, index) => (
            <Badge key={index} variant="secondary">
              {port}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function ServiceHistoryCard({ serviceHistory }: { serviceHistory?: any[] }) {
  if (!serviceHistory || serviceHistory.length === 0) return null

  const typeIcons: Record<string, string> = {
    maintenance: "🔧",
    repair: "🛠️",
    inspection: "🔍",
    accident: "⚠️",
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Service History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {serviceHistory.slice(0, 5).map((record, index) => (
            <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
              <div className="text-2xl">{typeIcons[record.type] || "📋"}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium capitalize">{record.type}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(record.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{record.description}</p>
                {record.mileage && (
                  <span className="text-xs text-muted-foreground">
                    At {record.mileage.toLocaleString()} km
                  </span>
                )}
              </div>
            </div>
          ))}
          {serviceHistory.length > 5 && (
            <Button variant="outline" className="w-full" size="sm">
              View all {serviceHistory.length} records
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function InspectionReportCard({ url }: { url?: string }) {
  if (!url) return null

  return (
    <Card className="border-green-200 bg-green-50">
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <Shield className="h-5 w-5 text-green-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-green-800">Inspection Report Available</h4>
            <p className="text-sm text-green-600">This vehicle has a verified inspection report</p>
          </div>
          <Button variant="outline" size="sm" className="border-green-300 text-green-700 hover:bg-green-100" asChild>
            <a href={url} target="_blank" rel="noopener noreferrer">
              View Report
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function ActionButtons({ listingId }: { listingId: string }) {
  return (
    <div className="sticky bottom-0 bg-background border-t p-4 space-y-3">
      <Button size="lg" className="w-full text-lg font-semibold" asChild>
        <Link href={`/checkout/${listingId}`}>
          <Clock className="h-5 w-5 mr-2" />
          Reserve & Pay - $500
        </Link>
      </Button>
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" size="lg">
          <MessageCircle className="h-4 w-4 mr-2" />
          Contact Seller
        </Button>
        <Button variant="outline" size="lg">
          <Calendar className="h-4 w-4 mr-2" />
          Test Drive
        </Button>
      </div>
      <Button variant="outline" size="lg" className="w-full bg-transparent">
        <Calculator className="h-4 w-4 mr-2" />
        Request Financing
      </Button>
    </div>
  )
}

export function ListingDetailClient({ listing }: ListingDetailClientProps) {
  const car = listing as CarDetail

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="sticky top-0 bg-background border-b p-4 md:hidden z-10">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/shop">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="font-semibold truncate">{car.title}</h1>
            <p className="text-sm text-muted-foreground">${car.price.toLocaleString()}</p>
          </div>
          <Button variant="ghost" size="icon">
            <Heart className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6 space-y-6 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Desktop Header */}
            <div className="hidden md:block">
              <CarHeader car={car} />
            </div>

            {/* Image Gallery */}
            <ImageGallery images={car.images || []} />

            {/* Description */}
            {car.description && (
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{car.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Specifications */}
            <SpecificationsTable car={car} />

            {/* Inspection Report Badge */}
            <InspectionReportCard url={car.inspectionReportUrl} />

            {/* AI Condition Report */}
            {/* AI Condition Report */}
            <AIConditionReport listingId={car.id} />

            {/* Service History */}
            <ServiceHistoryCard serviceHistory={car.serviceHistory} />

            {/* Features */}
            <FeaturesCard features={car.features} />

            {/* Destination Ports */}
            <DestinationPortsCard ports={car.destinationPorts} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Mobile Header Info */}
            <div className="md:hidden">
              <CarHeader car={car} />
            </div>

            {/* Seller Card */}
            <SellerCard seller={car.seller} verified={car.verified} />

            {/* Inquiry Form */}
            <InquiryForm
              listingId={car.id}
              dealerId={car.dealerId}
              listingTitle={car.title}
            />

            {/* Location */}
            <LocationCard location={car.location} />

            {/* Desktop Action Buttons */}
            <div className="hidden md:block space-y-3">
              <Button size="lg" className="w-full text-lg font-semibold" asChild>
                <Link href={`/checkout/${car.id}`}>
                  <Clock className="h-5 w-5 mr-2" />
                  Reserve & Pay - $500
                </Link>
              </Button>
              <div className="grid grid-cols-1 gap-3">
                <Button variant="outline" size="lg" className="w-full bg-transparent">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Seller
                </Button>
                <Button variant="outline" size="lg" className="w-full bg-transparent">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Test Drive
                </Button>
                <Button variant="outline" size="lg" className="w-full bg-transparent">
                  <Calculator className="h-4 w-4 mr-2" />
                  Request Financing
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Export Cost Estimator and Trust Score sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ExportCostEstimator vehiclePrice={car.price} defaultCountry="Ghana" vehicleType={car.bodyType} />
          <TrustScoreDetail listingId={car.id} />
        </div>
      </main>

      {/* Mobile Action Buttons */}
      <div className="md:hidden">
        <ActionButtons listingId={car.id} />
      </div>
    </div>
  )
}
