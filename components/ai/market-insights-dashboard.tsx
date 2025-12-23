"use client"

import { getMarketInsightsAction } from "@/app/actions/ai"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type MarketInsight } from "@/lib/gemini"
import { ArrowRight, Loader2, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"

export function MarketInsightsDashboard() {
  const [insights, setInsights] = useState<MarketInsight[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getMarketInsightsAction()
        setInsights(data)
      } catch (err) {
        console.error("Failed to load market insights", err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            AI Market Insights
          </CardTitle>
          <CardDescription>Generating data-driven recommendations...</CardDescription>
        </CardHeader>
        <CardContent className="py-8 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          AI Market Insights
        </CardTitle>
        <CardDescription>Data-driven recommendations to optimize your inventory and pricing</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold">{insight.title}</h4>
                  {insight.actionable && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Actionable
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
              </div>
            </div>

            {insight.data && (
              <div className="bg-muted rounded-lg p-3 space-y-2">
                {insight.data.trend && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Trend</span>
                    <span className="font-medium text-green-600">{insight.data.trend}</span>
                  </div>
                )}
                {insight.data.route && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Best Route</span>
                    <span className="font-medium">{insight.data.route}</span>
                  </div>
                )}
                {insight.data.topModels && (
                  <div className="text-sm">
                    <p className="text-muted-foreground mb-1">Top Models:</p>
                    <div className="flex flex-wrap gap-1">
                      {insight.data.topModels.map((model: string, i: number) => (
                        <Badge key={i} variant="outline">
                          {model}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {insight.data.vehicles && (
                  <div className="text-sm space-y-1">
                    {insight.data.vehicles.map((vehicle: any, i: number) => (
                      <div key={i} className="flex items-center justify-between">
                        <span>{vehicle.model}</span>
                        <span className="font-medium">
                          ${vehicle.currentPrice.toLocaleString()} → ${vehicle.suggestedPrice.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {insight.actionable && (
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                Take Action
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
