// Mock AI Data for SK AutoSphere
// Contains mock data for Export Cost Estimator, Dynamic Pricing, and Trust Score features

export interface ExportCostBreakdown {
  vehiclePrice: number
  freightCost: number
  portFees: number
  dutiesAndTaxes: number
  insurance: number
  total: number
  currency: string
}

export interface CountryExportData {
  country: string
  portName: string
  estimatedDays: number
  freightRate: number // per unit
  portFeeBase: number
  dutyRate: number // percentage
  taxRate: number // percentage
  insuranceRate: number // percentage
}

export const exportDestinations: CountryExportData[] = [
  {
    country: "Ghana",
    portName: "Tema Port",
    estimatedDays: 28,
    freightRate: 1200,
    portFeeBase: 350,
    dutyRate: 0.25, // 25%
    taxRate: 0.15, // 15%
    insuranceRate: 0.02, // 2%
  },
  {
    country: "Nigeria",
    portName: "Lagos Port (Apapa)",
    estimatedDays: 32,
    freightRate: 1400,
    portFeeBase: 400,
    dutyRate: 0.35, // 35%
    taxRate: 0.075, // 7.5%
    insuranceRate: 0.025, // 2.5%
  },
  {
    country: "Kenya",
    portName: "Mombasa Port",
    estimatedDays: 35,
    freightRate: 1600,
    portFeeBase: 450,
    dutyRate: 0.3, // 30%
    taxRate: 0.16, // 16%
    insuranceRate: 0.02, // 2%
  },
  {
    country: "Guinea",
    portName: "Port of Conakry",
    estimatedDays: 30,
    freightRate: 1300,
    portFeeBase: 380,
    dutyRate: 0.28, // 28%
    taxRate: 0.18, // 18%
    insuranceRate: 0.02, // 2%
  },
]

export function calculateExportCost(vehiclePrice: number, country: string): ExportCostBreakdown {
  const destination = exportDestinations.find((d) => d.country === country) || exportDestinations[0]

  const freightCost = destination.freightRate
  const insurance = vehiclePrice * destination.insuranceRate
  const portFees = destination.portFeeBase
  const dutiableValue = vehiclePrice + freightCost + insurance
  const dutiesAndTaxes = dutiableValue * destination.dutyRate + dutiableValue * destination.taxRate

  const total = vehiclePrice + freightCost + portFees + dutiesAndTaxes + insurance

  return {
    vehiclePrice,
    freightCost,
    portFees,
    dutiesAndTaxes,
    insurance,
    total,
    currency: "USD",
  }
}

// Dynamic Pricing Recommendation
export interface ComparableListing {
  id: string
  make: string
  model: string
  year: number
  mileage: number
  price: number
  soldDate?: string
  daysOnMarket: number
}

export interface PricingRecommendation {
  recommendedPrice: number
  priceRange: {
    min: number
    max: number
  }
  confidence: number // 0-100
  reasoning: string[]
  comparableListings: ComparableListing[]
}

export const mockComparableListings: ComparableListing[] = [
  {
    id: "CMP-001",
    make: "Toyota",
    model: "Camry",
    year: 2020,
    mileage: 35000,
    price: 24500,
    soldDate: "2024-01-15",
    daysOnMarket: 12,
  },
  {
    id: "CMP-002",
    make: "Toyota",
    model: "Camry",
    year: 2020,
    mileage: 42000,
    price: 23200,
    soldDate: "2024-01-20",
    daysOnMarket: 18,
  },
  {
    id: "CMP-003",
    make: "Toyota",
    model: "Camry",
    year: 2019,
    mileage: 38000,
    price: 22800,
    daysOnMarket: 8,
  },
  {
    id: "CMP-004",
    make: "Toyota",
    model: "Camry",
    year: 2021,
    mileage: 28000,
    price: 26900,
    soldDate: "2024-01-10",
    daysOnMarket: 5,
  },
]

export function generatePricingRecommendation(
  make: string,
  model: string,
  year: number,
  mileage: number,
): PricingRecommendation {
  // Mock algorithm: Average of comparable listings with adjustments
  const basePrice =
    mockComparableListings.reduce((sum, listing) => sum + listing.price, 0) / mockComparableListings.length

  // Adjust for year (newer = higher)
  const yearDiff = year - 2020
  const yearAdjustment = yearDiff * 1000

  // Adjust for mileage (lower = higher)
  const avgMileage =
    mockComparableListings.reduce((sum, listing) => sum + listing.mileage, 0) / mockComparableListings.length
  const mileageAdjustment = (avgMileage - mileage) * 0.1

  const recommendedPrice = Math.round(basePrice + yearAdjustment + mileageAdjustment)
  const priceRange = {
    min: Math.round(recommendedPrice * 0.92),
    max: Math.round(recommendedPrice * 1.08),
  }

  return {
    recommendedPrice,
    priceRange,
    confidence: 87,
    reasoning: [
      `Based on ${mockComparableListings.length} similar ${make} ${model} listings`,
      `Average market price: $${Math.round(basePrice).toLocaleString()}`,
      `Your vehicle has ${mileage < avgMileage ? "lower" : "higher"} mileage than average`,
      `${year} model year is ${yearDiff > 0 ? "newer" : "older"} than average`,
      "High demand for this model in your region",
    ],
    comparableListings: mockComparableListings,
  }
}

// Trust Score & Fraud Detection
export interface TrustScore {
  score: number // 0-100
  level: "low" | "medium" | "high"
  color: string
  verifiedDocuments: VerifiedDocument[]
  trustFactors: TrustFactor[]
  warnings: string[]
}

export interface VerifiedDocument {
  name: string
  verified: boolean
  verifiedDate?: string
}

export interface TrustFactor {
  name: string
  status: "verified" | "pending" | "missing"
  impact: "high" | "medium" | "low"
  description: string
}

export const mockVerifiedDocuments: VerifiedDocument[] = [
  {
    name: "Export Certificate",
    verified: true,
    verifiedDate: "2024-01-15",
  },
  {
    name: "Inspection Report",
    verified: true,
    verifiedDate: "2024-01-14",
  },
  {
    name: "Mileage Check",
    verified: true,
    verifiedDate: "2024-01-13",
  },
  {
    name: "Title Document",
    verified: true,
    verifiedDate: "2024-01-12",
  },
  {
    name: "Service History",
    verified: false,
  },
]

export const mockTrustFactors: TrustFactor[] = [
  {
    name: "Verified Dealer",
    status: "verified",
    impact: "high",
    description: "Dealer has been verified by SK AutoSphere",
  },
  {
    name: "Clean Title",
    status: "verified",
    impact: "high",
    description: "Vehicle has a clean title with no liens",
  },
  {
    name: "Inspection Passed",
    status: "verified",
    impact: "high",
    description: "Vehicle passed 150-point inspection",
  },
  {
    name: "Accurate Photos",
    status: "verified",
    impact: "medium",
    description: "Photos verified to match vehicle VIN",
  },
  {
    name: "Price Verification",
    status: "verified",
    impact: "medium",
    description: "Price is within market range",
  },
  {
    name: "Service Records",
    status: "pending",
    impact: "low",
    description: "Awaiting service history verification",
  },
]

export function calculateTrustScore(listingId: string): TrustScore {
  // Mock calculation based on verified documents and trust factors
  const verifiedCount = mockVerifiedDocuments.filter((doc) => doc.verified).length
  const totalDocs = mockVerifiedDocuments.length
  const docScore = (verifiedCount / totalDocs) * 40

  const verifiedFactors = mockTrustFactors.filter((factor) => factor.status === "verified")
  const factorScore = (verifiedFactors.length / mockTrustFactors.length) * 60

  const score = Math.round(docScore + factorScore)

  let level: "low" | "medium" | "high"
  let color: string

  if (score >= 80) {
    level = "high"
    color = "text-green-600"
  } else if (score >= 60) {
    level = "medium"
    color = "text-yellow-600"
  } else {
    level = "low"
    color = "text-red-600"
  }

  const warnings: string[] = []
  if (score < 80) {
    warnings.push("Some documents are still pending verification")
  }
  if (mockTrustFactors.some((f) => f.status === "missing" && f.impact === "high")) {
    warnings.push("Critical documents are missing")
  }

  return {
    score,
    level,
    color,
    verifiedDocuments: mockVerifiedDocuments,
    trustFactors: mockTrustFactors,
    warnings,
  }
}

// Random trust scores for different listings (for demo purposes)
export const listingTrustScores: Record<string, number> = {
  "1": 92,
  "2": 87,
  "3": 94,
  "4": 78,
  "5": 85,
  "6": 91,
  "7": 89,
}

export function getTrustScoreForListing(listingId: string): number {
  return listingTrustScores[listingId] || 85
}
