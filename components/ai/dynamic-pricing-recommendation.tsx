"use client"

import { estimateDetailedPricingAction, type PricingRecommendationResult } from "@/app/actions/ai"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { BarChart3, CheckCircle, DollarSign, Globe, Info, Sparkles, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"

interface DynamicPricingRecommendationProps {
  make: string
  model: string
  year: number
  mileage: number
  currentPrice?: number
  onPriceChange?: (price: number) => void
}

export function DynamicPricingRecommendation({
  make,
  model,
  year,
  mileage,
  currentPrice,
  onPriceChange,
}: DynamicPricingRecommendationProps) {
  const [recommendation, setRecommendation] = useState<PricingRecommendationResult | null>(null)
  const [useRecommendedPrice, setUseRecommendedPrice] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    let mounted = true
    async function fetchPricing() {
      setIsAnalyzing(true)
      try {
        const result = await estimateDetailedPricingAction(make, model, year, mileage)
        if (mounted) setRecommendation(result)
      } catch (error) {
        console.error("Pricing analysis failed", error)
      } finally {
        if (mounted) setIsAnalyzing(false)
      }
    }

    // Debounce slightly or just run once on mount/change
    const timer = setTimeout(() => {
      fetchPricing()
    }, 500)

    return () => {
      mounted = false
      clearTimeout(timer)
    }
  }, [make, model, year, mileage])

  const handleTogglePrice = (checked: boolean) => {
    setUseRecommendedPrice(checked)
    if (checked && recommendation && onPriceChange) {
      onPriceChange(recommendation.recommendedPrice)
    } else if (!checked && currentPrice && onPriceChange) {
      onPriceChange(currentPrice)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (isAnalyzing) {
    return (
      <Card className="border-2 border-purple-200 dark:border-purple-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600 animate-pulse" />
            <CardTitle className="text-xl">AI Pricing Recommendation</CardTitle>
          </div>
          <CardDescription>Analyzing market data...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Progress value={66} className="h-2" />
            <p className="text-sm text-muted-foreground">Processing comparable listings and market trends...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!recommendation) return null

  return (
    <Card className="border-2 border-purple-200 dark:border-purple-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-xl">AI Pricing Recommendation</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            {recommendation.confidence}% Confidence
          </Badge>
        </div>
        <CardDescription>
          Based on {recommendation.comparableListings.length} similar listings in your market
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Recommended Price */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 p-6 rounded-lg border-2 border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Recommended Price</p>
                <p className="text-3xl font-bold text-purple-600">{formatCurrency(recommendation.recommendedPrice)}</p>
              </div>
            </div>
          </div>

          {/* Price Range */}
          <div className="flex items-center justify-between text-sm">
            <div>
              <p className="text-muted-foreground">Min</p>
              <p className="font-semibold">{formatCurrency(recommendation.priceRange.min)}</p>
            </div>
            <div className="flex-1 px-4">
              <div className="h-2 bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 rounded-full" />
            </div>
            <div className="text-right">
              <p className="text-muted-foreground">Max</p>
              <p className="font-semibold">{formatCurrency(recommendation.priceRange.max)}</p>
            </div>
          </div>
        </div>

        {/* Use This Price Toggle */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-muted-foreground" />
            <div>
              <Label htmlFor="use-price" className="font-medium cursor-pointer">
                Use Recommended Price
              </Label>
              <p className="text-xs text-muted-foreground">Apply this price to your listing</p>
            </div>
          </div>
          <Switch id="use-price" checked={useRecommendedPrice} onCheckedChange={handleTogglePrice} />
        </div>

        {useRecommendedPrice && (
          <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <p className="text-sm text-green-900 dark:text-green-100">
              Price updated to {formatCurrency(recommendation.recommendedPrice)}
            </p>
          </div>
        )}

        {/* Competitor Benchmarks (New) */}
        {recommendation.competitorPrices && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium">Export Market Benchmarks</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center border border-gray-100 dark:border-gray-700">
                <p className="text-xs text-muted-foreground mb-1">Autowini</p>
                <p className="font-semibold text-sm">{formatCurrency(recommendation.competitorPrices.autowini)}</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center border border-gray-100 dark:border-gray-700">
                <p className="text-xs text-muted-foreground mb-1">Be Forward</p>
                <p className="font-semibold text-sm">{formatCurrency(recommendation.competitorPrices.beForward)}</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center border border-gray-100 dark:border-gray-700">
                <p className="text-xs text-muted-foreground mb-1">SBT Japan</p>
                <p className="font-semibold text-sm">{formatCurrency(recommendation.competitorPrices.sbt)}</p>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground text-center">
              *Estimated averages based on current export listings
            </p>
          </div>
        )}

        {/* AI Reasoning */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-medium">AI Analysis</p>
          </div>
          <div className="space-y-2">
            {recommendation.reasoning.map((reason, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">{reason}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Comparable Listings */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Comparable Listings</p>
          <div className="space-y-2">
            {recommendation.comparableListings.slice(0, 3).map((listing) => (
              <div key={listing.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg text-sm">
                <div>
                  <p className="font-medium">
                    {listing.year} {listing.make} {listing.model}
                  </p>
                  <p className="text-xs text-muted-foreground">{listing.mileage.toLocaleString()} km</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(listing.price)}</p>
                  {listing.soldDate ? (
                    <Badge variant="outline" className="text-xs">
                      Sold
                    </Badge>
                  ) : (
                    <p className="text-xs text-muted-foreground">{listing.daysOnMarket} days</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
          <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-blue-900 dark:text-blue-100">
            Our AI analyzes real-time market data, demand trends, and comparable sales to suggest optimal pricing. You
            can adjust this recommendation based on your specific needs.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
