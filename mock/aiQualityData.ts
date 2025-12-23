// Listing Quality & Duplication Guard Mock Data
export interface QualityMetrics {
  overallScore: number // 0-100
  titleQuality: QualityCheck
  descriptionQuality: QualityCheck
  imageQuality: QualityCheck
  priceQuality: QualityCheck
  duplicationRisk: DuplicationCheck
  suggestions: string[]
}

export interface QualityCheck {
  score: number // 0-100
  status: "excellent" | "good" | "needs_improvement" | "poor"
  message: string
}

export interface DuplicationCheck {
  isDuplicate: boolean
  confidence: number
  similarListings: SimilarListing[]
}

export interface SimilarListing {
  id: string
  title: string
  similarity: number // 0-100
  reason: string
}

export function analyzeListingQuality(listing: {
  title: string
  description: string
  images: string[]
  price: number
  make: string
  model: string
  year: number
}): QualityMetrics {
  // Title Quality Check
  const titleLength = listing.title.length
  const titleScore = Math.min(100, (titleLength / 80) * 100)
  const titleQuality: QualityCheck = {
    score: titleScore,
    status: titleScore > 80 ? "excellent" : titleScore > 60 ? "good" : titleScore > 40 ? "needs_improvement" : "poor",
    message:
      titleScore > 80
        ? "Title is descriptive and SEO-friendly"
        : titleScore > 60
          ? "Title is adequate but could be more detailed"
          : "Title needs more details (add year, features)",
  }

  // Description Quality Check
  const descWords = listing.description.split(" ").length
  const descScore = Math.min(100, (descWords / 200) * 100)
  const descriptionQuality: QualityCheck = {
    score: descScore,
    status: descScore > 80 ? "excellent" : descScore > 60 ? "good" : descScore > 40 ? "needs_improvement" : "poor",
    message:
      descScore > 80
        ? `Comprehensive description (${descWords} words)`
        : descScore > 60
          ? `Description is adequate (${descWords} words) but could be expanded`
          : `Description too short (${descWords} words). Add more details about features, condition, and history`,
  }

  // Image Quality Check
  const imageCount = listing.images.length
  const imageScore = Math.min(100, (imageCount / 10) * 100)
  const imageQuality: QualityCheck = {
    score: imageScore,
    status: imageScore > 80 ? "excellent" : imageScore > 60 ? "good" : imageScore > 40 ? "needs_improvement" : "poor",
    message:
      imageScore > 80
        ? `${imageCount} high-quality images provided`
        : imageScore > 60
          ? `${imageCount} images (recommend 10+ for best results)`
          : `Only ${imageCount} images. Add more photos from different angles`,
  }

  // Price Quality Check (compare to market average)
  const avgPrice = 25000 // Mock average
  const priceDiff = Math.abs(listing.price - avgPrice) / avgPrice
  const priceScore = Math.max(50, 100 - priceDiff * 100)
  const priceQuality: QualityCheck = {
    score: priceScore,
    status: priceScore > 80 ? "excellent" : priceScore > 60 ? "good" : priceScore > 40 ? "needs_improvement" : "poor",
    message:
      priceScore > 80
        ? "Price is competitive with market"
        : priceScore > 60
          ? "Price is slightly above/below market average"
          : "Price significantly differs from market. Consider adjustment",
  }

  // Duplication Check
  const mockSimilarListings: SimilarListing[] = [
    {
      id: "ABC123",
      title: `${listing.year} ${listing.make} ${listing.model} Premium`,
      similarity: 75,
      reason: "Same make, model, and year",
    },
  ]

  const duplicationRisk: DuplicationCheck = {
    isDuplicate: Math.random() < 0.15, // 15% chance of duplicate
    confidence: 85,
    similarListings: mockSimilarListings,
  }

  // Generate suggestions
  const suggestions: string[] = []
  if (titleScore < 80) suggestions.push("Add more details to title (trim level, key features)")
  if (descScore < 80) suggestions.push("Expand description to 200+ words with features, condition, and history")
  if (imageScore < 80) suggestions.push("Add more photos (interior, exterior, engine, trunk)")
  if (priceScore < 80) suggestions.push("Review pricing - consider market analysis suggestions")
  if (duplicationRisk.isDuplicate)
    suggestions.push("Similar listing detected - ensure yours stands out with unique details")

  const overallScore = Math.round((titleScore + descScore + imageScore + priceScore) / 4)

  return {
    overallScore,
    titleQuality,
    descriptionQuality,
    imageQuality,
    priceQuality,
    duplicationRisk,
    suggestions,
  }
}
