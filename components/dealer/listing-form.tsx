"use client"

import { DynamicPricingRecommendation } from "@/components/ai/dynamic-pricing-recommendation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle, Car, ImageIcon, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ImageUpload } from "./image-upload"

// Validation schema
const listingFormSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters").max(200),
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  year: z.coerce.number().int().min(1900, "Invalid year").max(2100, "Invalid year"),
  price: z.coerce.number().positive("Price must be positive"),
  mileage: z.coerce.number().int().nonnegative().optional().or(z.literal("")),
  vin: z.string().length(17, "VIN must be exactly 17 characters").optional().or(z.literal("")),
  color: z.string().optional(),
  previous_owners: z.coerce.number().int().nonnegative().optional().or(z.literal("")),
  fuel_type: z.string().optional(),
  transmission: z.string().optional(),
  body_type: z.string().optional(),
  drive_type: z.string().optional(),
  condition: z.string().optional(),
  location: z.string().optional(),
  destination_port: z.string().optional(),
  status: z.enum(["pending", "active"]),
  featured: z.boolean(),
  description: z.string().max(5000).optional(),
})

type ListingFormData = z.infer<typeof listingFormSchema>

// Korean car brands for select dropdown
const KOREAN_BRANDS = [
  "Hyundai",
  "Kia",
  "Genesis",
  "SsangYong",
  "Renault Korea",
  "Chevrolet Korea",
  "Other",
]

const BODY_TYPES = ["Sedan", "SUV", "Truck", "Van", "Coupe", "Wagon", "Bus", "Other"]
const FUEL_TYPES = ["Petrol", "Diesel", "Electric", "Hybrid", "Gas"]
const TRANSMISSIONS = ["Manual", "Automatic", "CVT"]
const CONDITIONS = ["Excellent", "Good", "Fair", "Poor"]
const DESTINATION_PORTS = ["Mombasa", "Lagos", "Tema", "Dar es Salaam", "Durban", "Other"]

interface ListingFormProps {
  mode: "create" | "edit"
  initialValues?: Partial<ListingFormData> & {
    id?: string
    image_urls?: string[]
    primary_image_url?: string
  }
  onSuccess?: () => void
}

export function ListingForm({ mode, initialValues, onSuccess }: ListingFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize images from existing data
  const [images, setImages] = useState<string[]>(() => {
    if (initialValues?.image_urls && initialValues.image_urls.length > 0) {
      return initialValues.image_urls
    }
    if (initialValues?.primary_image_url) {
      return [initialValues.primary_image_url]
    }
    return []
  })

  const form = useForm<ListingFormData>({
    resolver: zodResolver(listingFormSchema),
    defaultValues: {
      title: initialValues?.title || "",
      brand: initialValues?.brand || "",
      model: initialValues?.model || "",
      year: initialValues?.year || new Date().getFullYear(),
      price: initialValues?.price || 0,
      mileage: initialValues?.mileage || undefined,
      vin: initialValues?.vin || "",
      color: initialValues?.color || "",
      previous_owners: initialValues?.previous_owners || 1,
      fuel_type: initialValues?.fuel_type || "",
      transmission: initialValues?.transmission || "",
      body_type: initialValues?.body_type || "",
      drive_type: initialValues?.drive_type || "",
      condition: initialValues?.condition || "",
      location: initialValues?.location || "",
      destination_port: initialValues?.destination_port || "",
      status: initialValues?.status || "pending",
      featured: initialValues?.featured || false,
      description: initialValues?.description || "",
    },
  })

  const onSubmit = async (data: ListingFormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Clean up mileage if empty string and include images
      const payload = {
        ...data,
        mileage: data.mileage === "" ? undefined : data.mileage,
        image_urls: images,
        primary_image_url: images.length > 0 ? images[0] : null,
      }

      const url = mode === "create"
        ? "/api/dealer/listings"
        : `/api/dealer/listings/${initialValues?.id}`

      const method = mode === "create" ? "POST" : "PATCH"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || `Failed to ${mode} listing`)
      }

      // Success!
      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/dealer/listings")
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Vehicle Information
          </CardTitle>
          <CardDescription>Basic details about the vehicle</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Listing Title *</Label>
            <Input
              id="title"
              placeholder="e.g., 2023 Hyundai Sonata SEL - Low Mileage"
              {...form.register("title")}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Brand *</Label>
              <Select
                value={form.watch("brand")}
                onValueChange={(value) => form.setValue("brand", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  {KOREAN_BRANDS.map((brand) => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.brand && (
                <p className="text-sm text-red-500">{form.formState.errors.brand.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                placeholder="e.g., Sonata"
                {...form.register("model")}
              />
              {form.formState.errors.model && (
                <p className="text-sm text-red-500">{form.formState.errors.model.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                type="number"
                min="1900"
                max="2100"
                {...form.register("year")}
              />
              {form.formState.errors.year && (
                <p className="text-sm text-red-500">{form.formState.errors.year.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (USD) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="100"
                placeholder="25000"
                {...form.register("price")}
              />
              {form.formState.errors.price && (
                <p className="text-sm text-red-500">{form.formState.errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mileage">Mileage (km)</Label>
              <Input
                id="mileage"
                type="number"
                min="0"
                placeholder="50000"
                {...form.register("mileage")}
              />
            </div>
          </div>

          {/* AI Pricing Recommendation */}
          {form.watch("brand") && form.watch("model") && (
            <div className="mt-4">
              <DynamicPricingRecommendation
                make={form.watch("brand")}
                model={form.watch("model")}
                year={Number(form.watch("year"))}
                mileage={Number(form.watch("mileage") || 0)}
                currentPrice={Number(form.watch("price") || 0)}
                onPriceChange={(price: number) => form.setValue("price", price)}
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vin">VIN (Vehicle Identification Number)</Label>
              <Input
                id="vin"
                placeholder="17-character VIN"
                maxLength={17}
                {...form.register("vin")}
              />
              {form.formState.errors.vin && (
                <p className="text-sm text-red-500">{form.formState.errors.vin.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="previous_owners">Previous Owners</Label>
              <Input
                id="previous_owners"
                type="number"
                min="0"
                {...form.register("previous_owners")}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Specifications */}
      <Card>
        <CardHeader>
          <CardTitle>Specifications</CardTitle>
          <CardDescription>Technical details and condition</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Body Type</Label>
              <Select
                value={form.watch("body_type") || ""}
                onValueChange={(value) => form.setValue("body_type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {BODY_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Transmission</Label>
              <Select
                value={form.watch("transmission") || ""}
                onValueChange={(value) => form.setValue("transmission", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {TRANSMISSIONS.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Fuel Type</Label>
              <Select
                value={form.watch("fuel_type") || ""}
                onValueChange={(value) => form.setValue("fuel_type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {FUEL_TYPES.map((f) => (
                    <SelectItem key={f} value={f}>{f}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Drive Type</Label>
              <Select
                value={form.watch("drive_type") || ""}
                onValueChange={(value) => form.setValue("drive_type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FWD">FWD</SelectItem>
                  <SelectItem value="RWD">RWD</SelectItem>
                  <SelectItem value="AWD">AWD</SelectItem>
                  <SelectItem value="4WD">4WD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Condition</Label>
              <Select
                value={form.watch("condition") || ""}
                onValueChange={(value) => form.setValue("condition", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {CONDITIONS.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Color</Label>
              <Input
                placeholder="e.g., White, Silver"
                {...form.register("color")}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location & Export */}
      <Card>
        <CardHeader>
          <CardTitle>Location & Export</CardTitle>
          <CardDescription>Where the vehicle is and where it can be shipped</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Current Location</Label>
              <Input
                id="location"
                placeholder="e.g., Seoul, South Korea"
                {...form.register("location")}
              />
            </div>

            <div className="space-y-2">
              <Label>Destination Port</Label>
              <Select
                value={form.watch("destination_port") || ""}
                onValueChange={(value) => form.setValue("destination_port", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select port" />
                </SelectTrigger>
                <SelectContent>
                  {DESTINATION_PORTS.map((port) => (
                    <SelectItem key={port} value={port}>{port}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Photos
          </CardTitle>
          <CardDescription>
            Add photos of your vehicle. First image will be the primary/thumbnail.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ImageUpload
            images={images}
            onChange={setImages}
            maxImages={10}
            listingId={initialValues?.id}
            disabled={isSubmitting}
          />
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
          <CardDescription>Detailed information about the vehicle</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Describe the vehicle's features, history, and condition..."
            className="min-h-[150px]"
            {...form.register("description")}
          />
        </CardContent>
      </Card>

      {/* Status & Options */}
      <Card>
        <CardHeader>
          <CardTitle>Listing Options</CardTitle>
          <CardDescription>Status and visibility settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={form.watch("status")}
                onValueChange={(value: "pending" | "active") => form.setValue("status", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending (Review Required)</SelectItem>
                  <SelectItem value="active">Active (Publish Now)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2 pt-8">
              <Checkbox
                id="featured"
                checked={form.watch("featured")}
                onCheckedChange={(checked) => form.setValue("featured", checked === true)}
              />
              <Label htmlFor="featured" className="cursor-pointer">
                Feature this listing (higher visibility)
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "create" ? "Create Listing" : "Save Changes"}
        </Button>
      </div>
    </form>
  )
}

