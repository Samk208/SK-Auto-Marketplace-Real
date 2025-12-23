// Smart Matching Engine Mock Data
export interface MatchRequest {
  budget: number
  destination: string
  vehicleType: string
  preferredYear?: number
  seats?: number
  features?: string[]
}

export interface MatchResult {
  vehicleId: string
  title: string
  make: string
  model: string
  year: number
  price: number
  matchScore: number // 0-100
  matchReasons: string[]
  exportRoute: {
    from: string
    to: string
    estimatedDays: number
  }
  landedCost: number
  images: string[]
}

export function findVehicleMatches(request: MatchRequest): MatchResult[] {
  // Mock matching algorithm
  const mockResults: MatchResult[] = [
    {
      vehicleId: "VEH001",
      title: "2018 Hyundai Universe 45-Seat Bus",
      make: "Hyundai",
      model: "Universe",
      year: 2018,
      price: 35000,
      matchScore: 94,
      matchReasons: [
        "Perfect match for 30-40 seat requirement",
        "Within budget range",
        "Optimized for Ghana export route",
        "High reliability rating for African markets",
        "Recently serviced, export-ready",
      ],
      exportRoute: {
        from: "Busan Port, Korea",
        to: "Tema Port, Ghana",
        estimatedDays: 28,
      },
      landedCost: 43500,
      images: ["/placeholder.svg?height=300&width=400&text=Bus"],
    },
    {
      vehicleId: "VEH002",
      title: "2017 Kia Granbird 35-Seat Luxury Bus",
      make: "Kia",
      model: "Granbird",
      year: 2017,
      price: 32000,
      matchScore: 89,
      matchReasons: [
        "Matches seat capacity requirement",
        "Under budget by $3,000",
        "Excellent condition for year",
        "Fuel-efficient for long routes",
      ],
      exportRoute: {
        from: "Incheon Port, Korea",
        to: "Tema Port, Ghana",
        estimatedDays: 30,
      },
      landedCost: 39800,
      images: ["/placeholder.svg?height=300&width=400&text=Bus"],
    },
    {
      vehicleId: "VEH003",
      title: "2019 Hyundai County 28-Seat Minibus",
      make: "Hyundai",
      model: "County",
      year: 2019,
      price: 28000,
      matchScore: 82,
      matchReasons: [
        "Slightly under seat requirement but newer model",
        "Well within budget",
        "Lower operating costs",
        "Popular model in West Africa",
      ],
      exportRoute: {
        from: "Busan Port, Korea",
        to: "Tema Port, Ghana",
        estimatedDays: 28,
      },
      landedCost: 35000,
      images: ["/placeholder.svg?height=300&width=400&text=Bus"],
    },
  ]

  // Filter and sort by match score
  return mockResults
    .filter((result) => result.price <= request.budget * 1.1) // Allow 10% over budget
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5) // Return top 5 matches
}
