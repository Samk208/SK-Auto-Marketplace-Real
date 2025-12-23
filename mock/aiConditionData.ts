// Vehicle Condition Estimator Mock Data
export interface ConditionReport {
  score: number // 0-100
  estimatedMaintenanceCost: number
  summary: string[]
  details: ConditionDetail[]
}

export interface ConditionDetail {
  category: string
  severity: "minor" | "moderate" | "major"
  description: string
  confidence: number
}

export function generateConditionReport(make: string, model: string, year: number, images: string[]): ConditionReport {
  // Mock algorithm based on year and images count
  const age = new Date().getFullYear() - year
  const baseScore = Math.max(50, 100 - age * 3)
  const imageBonus = Math.min(15, images.length * 3)
  const score = Math.min(100, baseScore + imageBonus + Math.floor(Math.random() * 10))

  const maintenanceCost = Math.round((100 - score) * 50 + Math.random() * 500)

  const summaryItems = [
    score > 85 ? "Excellent overall condition" : score > 70 ? "Good condition with minor wear" : "Fair condition",
    `Vehicle is ${age} years old`,
    images.length > 5 ? "Comprehensive photo documentation" : "Limited photos available",
    maintenanceCost < 2000 ? "Low maintenance risk" : "Moderate maintenance expected",
  ]

  const details: ConditionDetail[] = [
    {
      category: "Exterior Condition",
      severity: score > 85 ? "minor" : "moderate",
      description: score > 85 ? "Minor scratches on left side panel" : "Visible paint wear on multiple panels",
      confidence: 92,
    },
    {
      category: "Interior Condition",
      severity: "minor",
      description: "Seats show normal wear for age, dashboard in good condition",
      confidence: 88,
    },
    {
      category: "Mechanical Systems",
      severity: age > 5 ? "moderate" : "minor",
      description: age > 5 ? "Engine shows expected wear, regular maintenance recommended" : "All systems nominal",
      confidence: 85,
    },
    {
      category: "Tires",
      severity: age > 4 ? "moderate" : "minor",
      description: age > 4 ? "Tires approaching replacement threshold (est. 6-12 months)" : "Tire condition good",
      confidence: 90,
    },
    {
      category: "Mileage Verification",
      severity: "minor",
      description: "Odometer reading consistent with vehicle age and condition",
      confidence: 95,
    },
  ]

  return {
    score,
    estimatedMaintenanceCost: maintenanceCost,
    summary: summaryItems,
    details,
  }
}
