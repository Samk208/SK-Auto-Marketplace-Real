"use client"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { BODY_TYPES, FUEL_TYPES, TRANSMISSION_TYPES } from "@/data"
import { CheckCircle, SlidersHorizontal, X, Zap } from "lucide-react"

export interface ShopFilters {
  priceRange: [number, number]
  yearRange: [number, number]
  bodyTypes: string[]
  transmissions: string[]
  fuelTypes: string[]
  location: string
  condition?: string
  verifiedOnly: boolean
  dataSaver: boolean
}

interface ShopFiltersProps {
  filters: ShopFilters
  onFiltersChange: (filters: ShopFilters) => void
  activeCount: number
}

export function ShopFiltersPanel({ filters, onFiltersChange, activeCount }: ShopFiltersProps) {
  const updateFilter = (key: keyof ShopFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const toggleArrayFilter = (key: "bodyTypes" | "transmissions" | "fuelTypes", value: string) => {
    const current = filters[key]
    const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
    updateFilter(key, updated)
  }

  const resetFilters = () => {
    onFiltersChange({
      priceRange: [0, 100000],
      yearRange: [2010, 2024],
      bodyTypes: [],
      transmissions: [],
      fuelTypes: [],
      location: "",
      verifiedOnly: false,
      dataSaver: false,
    })
  }

  const filterContent = (
    <div className="space-y-6">
      {/* Price Range */}
      <div className="space-y-3">
        <Label>Price Range (USD)</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.priceRange[0]}
            onChange={(e) => updateFilter("priceRange", [Number(e.target.value), filters.priceRange[1]])}
            className="flex-1"
          />
          <span className="text-muted-foreground">-</span>
          <Input
            type="number"
            placeholder="Max"
            value={filters.priceRange[1]}
            onChange={(e) => updateFilter("priceRange", [filters.priceRange[0], Number(e.target.value)])}
            className="flex-1"
          />
        </div>
        <Slider
          value={filters.priceRange}
          onValueChange={(value) => updateFilter("priceRange", value)}
          max={100000}
          step={1000}
          className="mt-2"
        />
      </div>

      {/* Year Range */}
      <div className="space-y-3">
        <Label>Year Range</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="From"
            value={filters.yearRange[0]}
            onChange={(e) => updateFilter("yearRange", [Number(e.target.value), filters.yearRange[1]])}
            className="flex-1"
          />
          <span className="text-muted-foreground">-</span>
          <Input
            type="number"
            placeholder="To"
            value={filters.yearRange[1]}
            onChange={(e) => updateFilter("yearRange", [filters.yearRange[0], Number(e.target.value)])}
            className="flex-1"
          />
        </div>
      </div>

      {/* Body Type */}
      <div className="space-y-3">
        <Label>Body Type</Label>
        <div className="space-y-2">
          {BODY_TYPES.slice(0, 7).map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`body-${type}`}
                checked={filters.bodyTypes.includes(type)}
                onCheckedChange={() => toggleArrayFilter("bodyTypes", type)}
              />
              <label
                htmlFor={`body-${type}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {type}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Transmission */}
      <div className="space-y-3">
        <Label>Transmission</Label>
        <div className="space-y-2">
          {TRANSMISSION_TYPES.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`trans-${type}`}
                checked={filters.transmissions.includes(type)}
                onCheckedChange={() => toggleArrayFilter("transmissions", type)}
              />
              <label
                htmlFor={`trans-${type}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {type}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Fuel Type */}
      <div className="space-y-3">
        <Label>Fuel Type</Label>
        <div className="space-y-2">
          {FUEL_TYPES.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`fuel-${type}`}
                checked={filters.fuelTypes.includes(type)}
                onCheckedChange={() => toggleArrayFilter("fuelTypes", type)}
              />
              <label
                htmlFor={`fuel-${type}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {type}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Location */}
      <div className="space-y-3">
        <Label>Location</Label>
        <Select value={filters.location} onValueChange={(value) => updateFilter("location", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="seoul">Seoul</SelectItem>
            <SelectItem value="busan">Busan</SelectItem>
            <SelectItem value="incheon">Incheon</SelectItem>
            <SelectItem value="daegu">Daegu</SelectItem>
            <SelectItem value="daejeon">Daejeon</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Condition */}
      <div className="space-y-3">
        <Label>Condition</Label>
        <Select value={filters.condition || ""} onValueChange={(value) => updateFilter("condition", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="excellent">Excellent</SelectItem>
            <SelectItem value="good">Good</SelectItem>
            <SelectItem value="fair">Fair</SelectItem>
            <SelectItem value="poor">Poor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Verified Dealers Only */}
      <div className="flex items-center space-x-2 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
        <Checkbox
          id="verified"
          checked={filters.verifiedOnly}
          onCheckedChange={(checked) => updateFilter("verifiedOnly", checked)}
        />
        <label
          htmlFor="verified"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2"
        >
          <CheckCircle className="h-4 w-4 text-green-600" />
          Verified dealers only
        </label>
      </div>

      {/* Data Saver */}
      <div className="flex items-center space-x-2 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
        <Checkbox
          id="datasaver"
          checked={filters.dataSaver}
          onCheckedChange={(checked) => updateFilter("dataSaver", checked)}
        />
        <label
          htmlFor="datasaver"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2"
        >
          <Zap className="h-4 w-4 text-blue-600" />
          Data saver mode
        </label>
      </div>

      {activeCount > 0 && (
        <Button variant="outline" className="w-full bg-transparent" onClick={resetFilters}>
          <X className="h-4 w-4 mr-2" />
          Clear all filters ({activeCount})
        </Button>
      )}
    </div>
  )

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden lg:block sticky top-4">
        <div className="p-6 border rounded-lg bg-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg">Filters</h3>
            {activeCount > 0 && <span className="text-sm text-muted-foreground">({activeCount} active)</span>}
          </div>
          {filterContent}
        </div>
      </div>

      {/* Mobile Filters */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="lg:hidden w-full bg-transparent">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
            {activeCount > 0 && <span className="ml-2">({activeCount})</span>}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>Refine your search to find the perfect vehicle</SheetDescription>
          </SheetHeader>
          <div className="mt-6">{filterContent}</div>
        </SheetContent>
      </Sheet>
    </>
  )
}
