export interface SmartListingResult {
  title: string
  description: string
  suggestedPrice: number
  tags: string[]
  imageEnhancements: string[]
  aiConfidence: number
}

export interface BuyerMatchResult {
  vehicleId: string
  title: string
  matchScore: number
  price: number
  year: number
  make: string
  model: string
  exportRoute: {
    from: string
    to: string
    estimatedDays: number
  }
  landedCost: number
  matchReasons: string[]
}

export interface AIConditionFlag {
  severity: "info" | "warning" | "critical"
  category: string
  description: string
  confidence: number
}

export interface MarketInsight {
  title: string
  description: string
  actionable: boolean
  data?: any
}

// Mock Smart Listing Generator
export function generateSmartListing(
  make: string,
  model: string,
  year: number,
  mileage: number,
  port: string,
): SmartListingResult {
  const titles = [
    `${year} ${make} ${model} - Excellent Condition for Export`,
    `${make} ${model} ${year} | Low Mileage | Ready for ${port}`,
    `Premium ${year} ${make} ${model} - Export to Africa`,
  ]

  const descriptions = [
    `This well-maintained ${year} ${make} ${model} with ${mileage.toLocaleString()} km is ready for export. Features include modern safety systems, fuel-efficient engine, and spacious interior. Perfect for African markets. All documents ready for customs clearance at ${port}.`,
    `Presenting a ${year} ${make} ${model} in excellent condition. With only ${mileage.toLocaleString()} km on the odometer, this vehicle has been regularly serviced and is mechanically sound. Ideal for export via ${port}. Complete inspection report available.`,
    `Export-ready ${year} ${make} ${model} with ${mileage.toLocaleString()} km. This vehicle combines reliability with modern features, making it perfect for African road conditions. Full documentation for ${port} export included.`,
  ]

  const basePrices: Record<string, number> = {
    Hyundai: 15000,
    Kia: 16000,
    Genesis: 35000,
    Toyota: 18000,
    Honda: 17000,
  }

  const basePrice = basePrices[make] || 15000
  const yearFactor = Math.max(0, (year - 2010) * 500)
  const mileageFactor = Math.max(0, (200000 - mileage) / 10)

  return {
    title: titles[Math.floor(Math.random() * titles.length)],
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    suggestedPrice: Math.round(basePrice + yearFactor + mileageFactor),
    tags: ["Export Ready", `${port} Port`, "Low Mileage", "Well Maintained", `${year} Model`, make],
    imageEnhancements: [
      "Increase brightness by 15%",
      "Auto-enhance color balance",
      "Remove background distractions",
      "Highlight key features",
    ],
    aiConfidence: 85 + Math.random() * 10,
  }
}

// Mock Buyer Match Engine
export function findVehicleMatches(
  budget: number,
  destination: string,
  vehicleType: string,
  maxYear?: number,
): BuyerMatchResult[] {
  const mockMatches: BuyerMatchResult[] = [
    {
      vehicleId: "1",
      title: "Hyundai County Bus 30-Seater",
      matchScore: 92,
      price: 18000,
      year: 2018,
      make: "Hyundai",
      model: "County",
      exportRoute: {
        from: "Busan",
        to: destination || "Tema",
        estimatedDays: 35,
      },
      landedCost: 21500,
      matchReasons: [
        "Within budget range",
        "Seats 30 passengers (close to requirement)",
        "Year meets criteria (2018)",
        "Popular model for African routes",
      ],
    },
    {
      vehicleId: "2",
      title: "Kia Granbird 40-Seater Coach",
      matchScore: 88,
      price: 22000,
      year: 2017,
      make: "Kia",
      model: "Granbird",
      exportRoute: {
        from: "Incheon",
        to: destination || "Tema",
        estimatedDays: 38,
      },
      landedCost: 26000,
      matchReasons: [
        "Slightly above budget but excellent value",
        "40 seats (exceeds requirement)",
        "2017 model (meets year criteria)",
        "Lower maintenance costs",
      ],
    },
    {
      vehicleId: "3",
      title: "Hyundai Universe 35-Seater",
      matchScore: 85,
      price: 16500,
      year: 2016,
      make: "Hyundai",
      model: "Universe",
      exportRoute: {
        from: "Busan",
        to: destination || "Tema",
        estimatedDays: 35,
      },
      landedCost: 19800,
      matchReasons: [
        "Best price-to-value ratio",
        "35 seats (within range)",
        "Proven reliability in Ghana",
        "Well under budget",
      ],
    },
  ]

  return mockMatches.sort((a, b) => b.matchScore - a.matchScore)
}

// Mock AI Condition Report
export function generateConditionReport(images: string[]): AIConditionFlag[] {
  const allFlags: AIConditionFlag[] = [
    {
      severity: "info",
      category: "Exterior",
      description: "Minor scratches visible on left front door",
      confidence: 87,
    },
    {
      severity: "warning",
      category: "Tires",
      description: "Front tires at 35% tread depth - replacement recommended within 6 months",
      confidence: 92,
    },
    {
      severity: "info",
      category: "Mileage",
      description: "Odometer reading consistent with vehicle age and model year",
      confidence: 95,
    },
    {
      severity: "info",
      category: "Interior",
      description: "Seats show normal wear for vehicle age",
      confidence: 88,
    },
    {
      severity: "critical",
      category: "Engine",
      description: "Potential oil leak detected - requires inspection",
      confidence: 78,
    },
    {
      severity: "info",
      category: "Paint",
      description: "Original factory paint with minor oxidation on hood",
      confidence: 90,
    },
    {
      severity: "warning",
      category: "Lighting",
      description: "Right headlight alignment may need adjustment",
      confidence: 82,
    },
  ]

  // Return random subset of flags based on image count
  const flagCount = Math.min(Math.max(2, images.length), 5)
  return allFlags
    .sort(() => Math.random() - 0.5)
    .slice(0, flagCount)
    .sort((a, b) => {
      const severityOrder = { critical: 0, warning: 1, info: 2 }
      return severityOrder[a.severity] - severityOrder[b.severity]
    })
}

// Mock Market Insights
export function generateMarketInsights(): MarketInsight[] {
  return [
    {
      title: "High Demand: SUVs to Nigeria",
      description:
        "SUVs are currently the most requested vehicle type for Nigerian buyers. Consider listing more Hyundai Tucson and Kia Sportage models.",
      actionable: true,
      data: {
        trend: "+45% inquiries",
        topModels: ["Hyundai Tucson", "Kia Sportage", "Genesis GV70"],
      },
    },
    {
      title: "Optimal Export Route This Quarter",
      description: "Busan to Lagos route has the lowest shipping costs this quarter. Average transit time: 32 days.",
      actionable: true,
      data: {
        route: "Busan → Lagos",
        cost: "$1,200 avg",
        savings: "15% vs Q3",
      },
    },
    {
      title: "Under-Priced Opportunities",
      description:
        "10 vehicles in your inventory are priced 12-18% below market average. Consider adjusting prices or adding premium packages.",
      actionable: true,
      data: {
        vehicles: [
          { id: "7", model: "Sonata 2021", currentPrice: 25000, suggestedPrice: 28500 },
          { id: "12", model: "Sportage 2020", currentPrice: 22000, suggestedPrice: 25000 },
        ],
      },
    },
    {
      title: "Seasonal Trend Alert",
      description: "Pickup trucks and commercial vehicles see 60% increase in demand during Q1. Stock up now.",
      actionable: false,
    },
    {
      title: "Competitive Pricing Strategy",
      description:
        "Your average listing is priced 8% lower than competitors, giving you a competitive advantage while maintaining healthy margins.",
      actionable: false,
    },
  ]
}

// Mock Translation
export function translateListing(text: string, targetLang: string): string {
  const translations: Record<string, Record<string, string>> = {
    fr: {
      "Excellent Condition": "Excellent État",
      "Low Mileage": "Faible Kilométrage",
      "Export Ready": "Prêt pour l'Export",
      "Well Maintained": "Bien Entretenu",
    },
    sw: {
      "Excellent Condition": "Hali Nzuri Sana",
      "Low Mileage": "Maili Chache",
      "Export Ready": "Tayari Kusafirishwa",
      "Well Maintained": "Imetunzwa Vizuri",
    },
  }

  let translated = text
  const langTranslations = translations[targetLang] || {}

  Object.entries(langTranslations).forEach(([en, foreign]) => {
    translated = translated.replace(new RegExp(en, "gi"), foreign)
  })

  return translated
}

// Mock Copilot responses
export function getCopilotAIResponse(message: string): string {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes("list") && lowerMessage.includes("car")) {
    return "I can help you create a smart listing! Please provide: 1) Make & Model, 2) Year, 3) Mileage, 4) Destination Port. I'll generate an optimized title, description, and suggested pricing for you."
  }

  if (lowerMessage.includes("export cost") || lowerMessage.includes("shipping")) {
    return "To estimate export costs, I need to know: 1) Vehicle type (sedan/SUV/bus), 2) Departure port (Busan/Incheon), 3) Destination country. Typical costs range from $1,200-$3,500 depending on route and vehicle size."
  }

  if (lowerMessage.includes("translate")) {
    return "I can translate your listing to French, Swahili, Arabic, or Portuguese. Just tell me which language you need and share the listing text you want translated."
  }

  if (lowerMessage.includes("price") || lowerMessage.includes("worth")) {
    return "I can help with pricing! Based on current market data, I analyze: vehicle condition, mileage, year, demand in target market, and competitor pricing. Share your vehicle details for a smart price recommendation."
  }

  return "I'm here to help with listings, pricing, export estimates, translations, and market insights. What would you like to know?"
}

// Export all functions for easy access
