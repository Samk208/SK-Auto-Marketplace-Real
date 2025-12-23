"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, AlertTriangle, XCircle, TrendingUp, ImageIcon, FileText, DollarSign, Copy } from "lucide-react"
import { analyzeListingQuality, type QualityMetrics } from "@/mock/aiQualityData"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ListingQualityCheckProps {
  listing: {
    title: string
    description: string
    images: string[]
    price: number
    make: string
    model: string
    year: number
  }
}

export function ListingQualityCheck({ listing }: ListingQualityCheckProps) {
  const [metrics, setMetrics] = useState<QualityMetrics | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(true)

  useEffect(() => {
    setIsAnalyzing(true)
    setTimeout(() => {
      const analysis = analyzeListingQuality(listing)
      setMetrics(analysis)
      setIsAnalyzing(false)
    }, 1500)
  }, [listing])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-green-600 bg-green-50"
      case "good":
        return "text-blue-600 bg-blue-50"
      case "needs_improvement":
        return "text-yellow-600 bg-yellow-50"
      case "poor":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "good":
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      case "needs_improvement":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "poor":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />
    }
  }

  if (isAnalyzing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary animate-pulse" />
            AI Listing Quality Check
          </CardTitle>
          <CardDescription>Analyzing your listing...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-2 bg-muted rounded w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!metrics) return null

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              AI Listing Quality Check
            </CardTitle>
            <CardDescription>Optimize your listing for better visibility and faster sales</CardDescription>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{metrics.overallScore}</div>
            <div className="text-xs text-muted-foreground">Overall Score</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quality Metrics */}
        <div className="space-y-4">
          {/* Title Quality */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Title Quality</span>
                {getStatusIcon(metrics.titleQuality.status)}
              </div>
              <Badge variant="secondary" className={getStatusColor(metrics.titleQuality.status)}>
                {metrics.titleQuality.score}%
              </Badge>
            </div>
            <Progress value={metrics.titleQuality.score} className="h-2" />
            <p className="text-sm text-muted-foreground">{metrics.titleQuality.message}</p>
          </div>

          {/* Description Quality */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Description Quality</span>
                {getStatusIcon(metrics.descriptionQuality.status)}
              </div>
              <Badge variant="secondary" className={getStatusColor(metrics.descriptionQuality.status)}>
                {metrics.descriptionQuality.score}%
              </Badge>
            </div>
            <Progress value={metrics.descriptionQuality.score} className="h-2" />
            <p className="text-sm text-muted-foreground">{metrics.descriptionQuality.message}</p>
          </div>

          {/* Image Quality */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Photo Count</span>
                {getStatusIcon(metrics.imageQuality.status)}
              </div>
              <Badge variant="secondary" className={getStatusColor(metrics.imageQuality.status)}>
                {metrics.imageQuality.score}%
              </Badge>
            </div>
            <Progress value={metrics.imageQuality.score} className="h-2" />
            <p className="text-sm text-muted-foreground">{metrics.imageQuality.message}</p>
          </div>

          {/* Price Quality */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Price Competitiveness</span>
                {getStatusIcon(metrics.priceQuality.status)}
              </div>
              <Badge variant="secondary" className={getStatusColor(metrics.priceQuality.status)}>
                {metrics.priceQuality.score}%
              </Badge>
            </div>
            <Progress value={metrics.priceQuality.score} className="h-2" />
            <p className="text-sm text-muted-foreground">{metrics.priceQuality.message}</p>
          </div>
        </div>

        {/* Duplication Warning */}
        {metrics.duplicationRisk.isDuplicate && (
          <Alert variant="destructive">
            <Copy className="h-4 w-4" />
            <AlertDescription>
              <div className="font-medium mb-2">Possible Duplicate Listing Detected</div>
              <p className="text-sm mb-3">
                We found {metrics.duplicationRisk.similarListings.length} similar listing(s) that may be duplicates:
              </p>
              <div className="space-y-2">
                {metrics.duplicationRisk.similarListings.map((similar) => (
                  <div key={similar.id} className="bg-destructive/10 rounded p-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{similar.title}</span>
                      <Badge variant="outline">{similar.similarity}% similar</Badge>
                    </div>
                    <p className="text-xs mt-1">{similar.reason}</p>
                  </div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Suggestions */}
        {metrics.suggestions.length > 0 && (
          <div className="space-y-3 pt-4 border-t">
            <h4 className="font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              AI Recommendations to Improve
            </h4>
            <ul className="space-y-2">
              {metrics.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
            <Button variant="outline" size="sm" className="w-full mt-4 bg-transparent">
              Apply All Suggestions
            </Button>
          </div>
        )}

        <div className="text-xs text-muted-foreground pt-4 border-t">
          Higher quality listings get 3x more views and sell 40% faster on average.
        </div>
      </CardContent>
    </Card>
  )
}
