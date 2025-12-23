// Market Insights Dashboard Mock Data for Dealers
export interface MarketInsight {
  category: string
  trend: "rising" | "stable" | "declining"
  change: number // percentage
  description: string
  recommendation: string
}

export interface DemandInsight {
  vehicleType: string
  region: string
  demandLevel: "high" | "medium" | "low"
  trend: "increasing" | "stable" | "decreasing"
  averagePrice: number
  timeToSell: number // days
}

export interface RegionalTrend {
  region: string
  growthRate: number // percentage
  topModels: string[]
  averageBudget: number
}

export const mockMarketInsights: MarketInsight[] = [
  {
    category: "Buses (30-50 seats)",
    trend: "rising",
    change: 28,
    description: "2015-2018 models under 50k km showing highest demand",
    recommendation: "Stock up on Hyundai Universe and Kia Granbird models in this range",
  },
  {
    category: "SUVs & 4x4",
    trend: "rising",
    change: 18,
    description: "Increased demand for rugged vehicles in East Africa",
    recommendation: "Focus on Toyota Land Cruiser and Nissan Patrol inventory",
  },
  {
    category: "Sedans",
    trend: "stable",
    change: 5,
    description: "Steady demand for mid-size sedans, especially hybrid models",
    recommendation: "Maintain current sedan inventory levels",
  },
  {
    category: "Trucks & Commercial",
    trend: "rising",
    change: 22,
    description: "Growing construction sector driving commercial vehicle demand",
    recommendation: "Increase inventory of Isuzu and Mitsubishi trucks",
  },
]

export const mockDemandInsights: DemandInsight[] = [
  {
    vehicleType: "Bus (35-45 seats)",
    region: "West Africa",
    demandLevel: "high",
    trend: "increasing",
    averagePrice: 32000,
    timeToSell: 8,
  },
  {
    vehicleType: "SUV (4x4)",
    region: "East Africa",
    demandLevel: "high",
    trend: "increasing",
    averagePrice: 28000,
    timeToSell: 12,
  },
  {
    vehicleType: "Sedan (Hybrid)",
    region: "All Regions",
    demandLevel: "medium",
    trend: "stable",
    averagePrice: 22000,
    timeToSell: 18,
  },
  {
    vehicleType: "Truck (Commercial)",
    region: "Central Africa",
    demandLevel: "high",
    trend: "increasing",
    averagePrice: 35000,
    timeToSell: 15,
  },
]

export const mockRegionalTrends: RegionalTrend[] = [
  {
    region: "West Africa",
    growthRate: 28,
    topModels: ["Hyundai Universe", "Kia Granbird", "Toyota Hiace"],
    averageBudget: 30000,
  },
  {
    region: "East Africa",
    growthRate: 22,
    topModels: ["Toyota Land Cruiser", "Nissan Patrol", "Toyota Hilux"],
    averageBudget: 35000,
  },
  {
    region: "Central Africa",
    growthRate: 18,
    topModels: ["Isuzu Trucks", "Toyota Coaster", "Mitsubishi Fuso"],
    averageBudget: 32000,
  },
  {
    region: "Southern Africa",
    growthRate: 15,
    topModels: ["Toyota Fortuner", "Ford Ranger", "Nissan Navara"],
    averageBudget: 28000,
  },
]

export function getMarketInsights(): MarketInsight[] {
  return mockMarketInsights
}

export function getDemandInsights(): DemandInsight[] {
  return mockDemandInsights
}

export function getRegionalTrends(): RegionalTrend[] {
  return mockRegionalTrends
}
