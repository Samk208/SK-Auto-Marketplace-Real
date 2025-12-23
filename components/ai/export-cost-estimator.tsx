"use client"

import { estimateExportCostAction, type ExportCostResult } from "@/app/actions/ai"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { exportDestinations } from "@/mock/aiData"; // We still use the list of destinations from mock for dropdown options
import { DollarSign, FileText, Loader2, Package, Shield, Ship, TrendingUp } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

interface ExportCostEstimatorProps {
  vehiclePrice: number
  defaultCountry?: string
  vehicleType?: string
}

export function ExportCostEstimator({ vehiclePrice, defaultCountry = "Ghana", vehicleType = "Sedan" }: ExportCostEstimatorProps) {
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry)
  const [isLoading, setIsLoading] = useState(false)
  const [costBreakdown, setCostBreakdown] = useState<ExportCostResult | null>(null)

  const fetchEstimate = useCallback(async (country: string) => {
    setIsLoading(true)
    try {
      const result = await estimateExportCostAction(vehiclePrice, country, vehicleType)
      setCostBreakdown(result)
    } catch (error) {
      console.error("Failed to fetch estimate", error)
    } finally {
      setIsLoading(false)
    }
  }, [vehiclePrice, vehicleType])

  // Initial load
  useEffect(() => {
    fetchEstimate(selectedCountry)
  }, [fetchEstimate, selectedCountry])

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country)
    // Fetch triggered by useEffect dependency or explicit call? 
    // Since we put selectedCountry in dependency array of useEffect, it will trigger automatically.
    // simpler to just let useEffect handle it.
  }

  const destination = exportDestinations.find((d) => d.country === selectedCountry)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ship className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl">Export Cost Estimator</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {isLoading ? "Calculating..." : "AI-Powered"}
          </Badge>
        </div>
        <CardDescription>
          Estimated landed cost to {selectedCountry} • {destination?.estimatedDays || 45} days shipping
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Country Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Destination Country</label>
          <Select value={selectedCountry} onValueChange={handleCountryChange} disabled={isLoading}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {exportDestinations.map((dest) => (
                <SelectItem key={dest.country} value={dest.country}>
                  {dest.country} ({dest.portName})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Cost Breakdown */}
        {isLoading && !costBreakdown ? (
          <div className="py-8 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : costBreakdown ? (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Vehicle Price</span>
              </div>
              <span className="font-semibold">{formatCurrency(vehiclePrice)}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Ship className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Freight Cost</span>
              </div>
              <span className="font-semibold">{formatCurrency(costBreakdown.shipping)}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Port & Handling</span>
              </div>
              <span className="font-semibold">{formatCurrency(costBreakdown.handling)}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Duties & Taxes</span>
              </div>
              <span className="font-semibold">{formatCurrency(costBreakdown.duties + costBreakdown.customs)}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Insurance</span>
              </div>
              <span className="font-semibold">{formatCurrency(costBreakdown.insurance)}</span>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg border-2 border-primary/20 mt-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="font-bold text-lg">Total Landed Cost</span>
              </div>
              <span className="font-bold text-2xl text-primary">{formatCurrency(costBreakdown.total)}</span>
            </div>
          </div>
        ) : null}

        {/* Info Banner */}
        <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
          <p className="text-xs text-blue-900 dark:text-blue-100">
            💡 This is an AI-generated estimate. Actual costs may vary based on exchange rates and current
            regulations. Contact us for a binding quote.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

