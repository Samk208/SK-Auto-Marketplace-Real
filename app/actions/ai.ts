"use server"

import { createSupabaseServerClient } from "@/lib/auth/supabase-auth-server"
import { analyzeMarketTrends, estimateExportCosts, getPricingRecommendation, type MarketInsight } from "@/lib/gemini"

export interface ExportCostResult {
    shipping: number
    customs: number
    duties: number
    insurance: number
    handling: number
    total: number
    transitDays: number
    notes: string[]
}

export async function estimateExportCostAction(
    vehiclePrice: number,
    destinationCountry: string,
    vehicleType: string = "Sedan" // Default if not provided
): Promise<ExportCostResult> {
    const supabase = await createSupabaseServerClient()

    // 1. Fetch real shipping rate from DB if available
    const { data: route } = await supabase
        .from('shipping_rates')
        .select('*')
        .ilike('destination_country', destinationCountry)
        .single()

    let knownFreightCost: number | undefined
    let transitTime: number | undefined

    if (route) {
        // Simple logic: SUV vs Sedan rate
        const isSuv = vehicleType.toLowerCase().includes('suv') || vehicleType.toLowerCase().includes('truck')
        knownFreightCost = isSuv ? route.base_rate_suv : route.base_rate_sedan
        transitTime = route.transit_time_days
    }

    try {
        // Call the actual Gemini function with real context
        const result = await estimateExportCosts({
            vehicleType,
            departurePort: route?.port_name || "Incheon",
            destinationCountry,
            vehiclePrice,
            knownFreightCost,
            transitTime
        })

        return result
    } catch (error) {
        console.error("Export Cost Action Error:", error)
        // Fallback to a basic calculation if AI fails (but strictly LOGGED as fallback)
        // In a real app we might throw, but for UI resilience we return a safe estimate
        return {
            shipping: knownFreightCost || 1500,
            customs: vehiclePrice * 0.1,
            duties: vehiclePrice * 0.2,
            insurance: vehiclePrice * 0.015,
            handling: 300,
            total: vehiclePrice * 1.315 + (knownFreightCost || 1800),
            transitDays: transitTime || 45,
            notes: ["AI Service Unavailable - Using Standard Rates"],
        }
    }
}

// -----------------------------------------------------------------------------
// TRUST SCORE ACTION
// -----------------------------------------------------------------------------


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

export interface TrustScoreResult {
    score: number // 0-100
    level: "low" | "medium" | "high"
    color: string
    verifiedDocuments: VerifiedDocument[]
    trustFactors: TrustFactor[]
    warnings: string[]
}

export async function calculateTrustScoreAction(listingId: string): Promise<TrustScoreResult> {
    const supabase = await createSupabaseServerClient()

    // 1. Fetch Listing with Dealer and Condition Reports
    const { data: listing, error } = await supabase
        .from("car_listings")
        .select(`
      id, vin, inspection_report_url, service_history, 
      dealers ( id, verified, rating, business_license_url ),
      ai_condition_reports ( id, overall_score )
    `)
        .eq("id", listingId)
        .single()

    if (error || !listing) {
        console.error("Trust Score: Listing not found", error)
        return {
            score: 50,
            level: "low",
            color: "text-red-500",
            verifiedDocuments: [],
            trustFactors: [],
            warnings: ["Listing data unavailable"]
        }
    }

    const dealer = listing.dealers as any
    const conditionReports = listing.ai_condition_reports as any[]
    const hasAiReport = conditionReports && conditionReports.length > 0
    const aiScore = hasAiReport ? conditionReports[0].overall_score : 0

    // Fetch dealer listing count for volume trust factor
    let dealerListingCount = 0
    if (dealer?.id) {
        const { count } = await supabase
            .from("car_listings")
            .select("*", { count: "exact", head: true })
            .eq("dealer_id", dealer.id)
        dealerListingCount = count || 0
    }

    // 2. Build Documents List
    const verifiedDocuments: VerifiedDocument[] = [
        {
            name: "Vehicle Identification Number (VIN)",
            verified: !!listing.vin,
            verifiedDate: listing.vin ? new Date().toISOString().split('T')[0] : undefined
        },
        {
            name: "Inspection Report",
            verified: !!listing.inspection_report_url,
            verifiedDate: listing.inspection_report_url ? new Date().toISOString().split('T')[0] : undefined
        },
        {
            name: "Dealer License",
            verified: !!dealer?.business_license_url || !!dealer?.verified,
        },
        {
            name: "AI Condition Check",
            verified: hasAiReport,
            verifiedDate: hasAiReport ? new Date().toISOString().split('T')[0] : undefined
        }
    ]

    // 3. Build Trust Factors
    const trustFactors: TrustFactor[] = [
        {
            name: "Verified Dealer",
            status: dealer?.verified ? "verified" : "pending",
            impact: "high",
            description: dealer?.verified ? "Dealer identity verified by SK AutoSphere" : "Dealer verification pending"
        },
        {
            name: "AI Assessment",
            status: hasAiReport ? "verified" : "missing",
            impact: "high",
            description: hasAiReport ? `AI scored this vehicle ${aiScore}/100` : "No AI condition report generated yet"
        },
        {
            name: "Inspection Valid",
            status: listing.inspection_report_url ? "verified" : "missing",
            impact: "high",
            description: listing.inspection_report_url ? "Third-party inspection report available" : "No inspection report uploaded"
        },
        {
            name: "Service History",
            status: listing.service_history ? "verified" : "pending",
            impact: "medium",
            description: listing.service_history ? "Service records available" : "Service history not provided"
        }
    ]

    if (dealerListingCount > 10) {
        trustFactors.push({
            name: "Established Volume",
            status: "verified",
            impact: "medium",
            description: `Dealer has ${dealerListingCount} active listings`
        })
    }

    // 4. Calculate Score
    let score = 0
    let maxScore = 0

    // Weighting
    const weights = {
        dealerVerified: 25,
        hasInspection: 20,
        hasAiReport: 15,
        hasVin: 10,
        hasService: 10,
        highDealerRating: 10,
        highVolume: 10 // New factor
    }

    maxScore = 100

    if (dealer?.verified) score += weights.dealerVerified
    if (listing.inspection_report_url) score += weights.hasInspection
    if (hasAiReport) score += weights.hasAiReport
    if (listing.vin) score += weights.hasVin
    if (listing.service_history) score += weights.hasService
    if (dealer?.rating && dealer.rating >= 4.5) score += weights.highDealerRating
    if (dealerListingCount > 10) score += weights.highVolume

    // Normalize or cap
    score = Math.min(100, score)

    // 5. Determine Level & Color
    let level: "low" | "medium" | "high" = "low"
    let color = "text-red-600"

    if (score >= 80) {
        level = "high"
        color = "text-green-600"
    } else if (score >= 50) {
        level = "medium"
        color = "text-yellow-600"
    }

    // 6. Generate Warnings
    const warnings: string[] = []
    if (!dealer?.verified) warnings.push("Dealer is not yet verified")
    if (!listing.inspection_report_url) warnings.push("Missing inspection report")
    if (!hasAiReport) warnings.push("No AI condition check performed")

    return {
        score,
        level,
        color,
        verifiedDocuments,
        trustFactors,
        warnings
    }
}

// -----------------------------------------------------------------------------
// PRICING RECOMMENDATION ACTION
// -----------------------------------------------------------------------------


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

// We map the Gemini response to match this interface + add comparable listings from DB
export interface PricingRecommendationResult {
    recommendedPrice: number
    priceRange: {
        min: number
        max: number
    }
    confidence: number // 0-100
    reasoning: string[]
    comparableListings: ComparableListing[]
    competitorPrices?: {
        autowini: number
        beForward: number
        sbt: number
    }
}

export async function estimateDetailedPricingAction(
    make: string,
    model: string,
    year: number,
    mileage: number
): Promise<PricingRecommendationResult> {
    const supabase = await createSupabaseServerClient()

    // 1. Fetch Comparable Listings from Supabase
    // Logic: Same Make/Model, Year +/- 2 years
    const { data: listings } = await supabase
        .from("car_listings")
        .select("id, brand, model, year, mileage, price, created_at, status")
        .eq("brand", make)
        .ilike("model", model)
        .gte("year", year - 2)
        .lte("year", year + 2)
        .limit(10)

    // Map DB listings to ComparableListing
    const comparableListings: ComparableListing[] = (listings || []).map((l: any) => ({
        id: l.id,
        make: l.brand,
        model: l.model,
        year: l.year,
        mileage: l.mileage,
        price: l.price,
        daysOnMarket: Math.floor((new Date().getTime() - new Date(l.created_at).getTime()) / (1000 * 3600 * 24))
    }))

    try {
        // 2. Get AI Recommendation
        const aiResult = await getPricingRecommendation({
            make,
            model,
            year,
            mileage
        })

        return {
            recommendedPrice: aiResult.recommendedPrice,
            priceRange: aiResult.priceRange,
            confidence: aiResult.confidence,
            reasoning: aiResult.reasoning,
            comparableListings: comparableListings.slice(0, 4), // Show top 4
            competitorPrices: aiResult.competitorPrices
        }
    } catch (error) {
        console.error("Pricing estimation failed", error)
        // Fallback if AI fails but we have DB data
        const avgPrice = comparableListings.length > 0
            ? comparableListings.reduce((sum, l) => sum + l.price, 0) / comparableListings.length
            : 0

        if (avgPrice > 0) {
            return {
                recommendedPrice: Math.round(avgPrice),
                priceRange: { min: Math.round(avgPrice * 0.9), max: Math.round(avgPrice * 1.1) },
                confidence: 70,
                reasoning: ["Based on internal sales data", "AI service unavailable temporarily"],
                comparableListings: comparableListings.slice(0, 4)
            }
        }

        throw new Error("Could not generate pricing recommendation")
    }
}

// -----------------------------------------------------------------------------
// MARKET INSIGHTS ACTION
// -----------------------------------------------------------------------------

export async function getMarketInsightsAction(): Promise<MarketInsight[]> {
    const supabase = await createSupabaseServerClient()

    // 1. Call the RPC function 
    const { data: marketData, error } = await supabase.rpc('get_market_trends')

    if (error) {
        console.error("Market Trends RPC Error", error)
        // Fallback to AI-only if RPC fails
        return await analyzeMarketTrends("Africa")
    }

    // 2. Pass real data to AI
    return await analyzeMarketTrends("Africa", marketData)
}
