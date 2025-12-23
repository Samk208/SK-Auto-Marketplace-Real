export interface SearchFilters {
  query: string
  location: string
  priceRange: [number, number]
  make: string
  model: string
  yearRange: [number, number]
  bodyTypes: string[]
  transmissions: string[]
  fuelTypes: string[]
  mileageRange: [number, number]
  radius: number
}

export interface SavedSearch {
  id: string
  name: string
  filters: SearchFilters
  createdAt: Date
}

export interface SearchSuggestion {
  id: string
  text: string
  type: "recent" | "location" | "make" | "model"
  icon?: string
}

export interface FilterTag {
  id: string
  label: string
  value: string
  type: "query" | "location" | "priceRange" | "make" | "model" | "bodyTypes" | "transmissions" | "fuelTypes"
}

export interface SortOption {
  value: string
  label: string
}

export interface CarMake {
  value: string
  label: string
  models: string[]
}

export interface SearchAndFilterProps {
  onFiltersChange: (filters: SearchFilters) => void
  onSaveSearch: (name: string, filters: SearchFilters) => void
  savedSearches: SavedSearch[]
  resultsCount: number
  isLoading?: boolean
}

export interface Dealer {
  id: string
  name: string
  rating: number
  totalReviews: number
  location: string
  verified: boolean
  logo?: string
  description?: string
  specialties?: string[]
}

export interface CarListing {
  id: string
  title: string
  year: number
  make: string
  model: string
  trim?: string
  price: number
  originalPrice?: number
  currency: string
  location: string
  images: string[]
  transmission: "Manual" | "Automatic" | "CVT"
  fuelType: "Petrol" | "Diesel" | "Electric" | "Hybrid" | "Gas"
  mileage: number
  mileageUnit: "km" | "miles"
  isReserved?: boolean
  seller: {
    name: string
    rating: number
    totalReviews: number
  }
  dealerId: string
  sellerRating: number
  sellerTotalReviews: number
  isFavorite?: boolean
  showTranslate?: boolean
  bodyType?: string
  verified?: boolean
  destinationPorts?: string[]
  features?: string[]
  description?: string
  // DMS-inspired enhancements
  vin?: string
  vehicleCondition?: "excellent" | "good" | "fair" | "poor"
  previousOwners?: number
  exteriorColor?: string
  interiorColor?: string
  engineSize?: number
  horsepower?: number
  seatingCapacity?: number
  serviceHistory?: ServiceRecord[]
  inspectionReportUrl?: string
  availableForViewing?: boolean
  locationCity?: string
  locationCountry?: string
  // Analytics
  totalViews?: number
  totalInquiries?: number
}

export interface ServiceRecord {
  date: string
  type: "maintenance" | "repair" | "inspection" | "accident"
  description: string
  cost?: number
  mileage: number
  provider?: string
  documents?: string[]
}

export interface CarListingCardProps {
  listing: CarListing
  isLoading?: boolean
  hasError?: boolean
  onViewDetails: (id: string) => void
  onContactSeller: (id: string) => void
  onTranslate?: (id: string) => void
  onToggleFavorite: (id: string) => void
}
