"use client"

import { calculateTrustScoreAction, type TrustScoreResult } from "@/app/actions/ai"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { CheckCircle, Shield } from "lucide-react"
import { useEffect, useState } from "react"

interface TrustScoreBadgeProps {
  listingId: string
  showLabel?: boolean
  size?: "sm" | "md" | "lg"
}

export function TrustScoreBadge({ listingId, showLabel = true, size = "md" }: TrustScoreBadgeProps) {
  const [data, setData] = useState<TrustScoreResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function fetchData() {
      try {
        const result = await calculateTrustScoreAction(listingId)
        if (mounted) setData(result)
      } catch (e) {
        console.error("Failed to fetch trust score", e)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchData()
    return () => { mounted = false }
  }, [listingId])

  if (loading) {
    return (
      <Badge variant="secondary" className="animate-pulse bg-gray-100 text-transparent select-none">
        <Shield className="h-3.5 w-3.5 mr-1" />
        Loading...
      </Badge>
    )
  }

  if (!data) return null

  const { score, trustFactors } = data
  // Recalculate UI colors on client to match theme exactly, or use server provided ones?
  // Let's stick to the client theme consistency for now using the score.

  const getScoreColor = (score: number) => {
    if (score >= 90) return { bg: "bg-green-100", text: "text-green-800", icon: "text-green-600" }
    if (score >= 80) return { bg: "bg-green-100", text: "text-green-700", icon: "text-green-500" }
    if (score >= 70) return { bg: "bg-yellow-100", text: "text-yellow-800", icon: "text-yellow-600" }
    if (score >= 60) return { bg: "bg-orange-100", text: "text-orange-800", icon: "text-orange-600" }
    return { bg: "bg-red-100", text: "text-red-800", icon: "text-red-600" }
  }

  const getScoreLevel = (score: number) => {
    if (score >= 90) return "Excellent"
    if (score >= 80) return "Very Good"
    if (score >= 70) return "Good"
    if (score >= 60) return "Fair"
    return "Low"
  }

  const colors = getScoreColor(score)
  const level = getScoreLevel(score)

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  }

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-3.5 w-3.5",
    lg: "h-4 w-4",
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="secondary"
            className={cn(
              "flex items-center gap-1.5 font-semibold cursor-help transition-all hover:scale-105",
              colors.bg,
              colors.text,
              sizeClasses[size],
            )}
          >
            <Shield className={cn(iconSizes[size], colors.icon)} />
            {showLabel && <span>Trust Score:</span>}
            <span>{score}/100</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b pb-2">
              <Shield className={cn("h-5 w-5", colors.icon)} />
              <div>
                <p className="font-bold text-base">Trust Score: {level}</p>
                <p className="text-xs text-muted-foreground">{score}/100 Confidence</p>
              </div>
            </div>

            <div className="space-y-2">
              {trustFactors.slice(0, 4).map((factor, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  {factor.status === "verified" ? (
                    <CheckCircle className="h-3.5 w-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                  ) : factor.status === "pending" ? (
                    <div className="h-3.5 w-3.5 rounded-full border-2 border-yellow-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <div className="h-3.5 w-3.5 rounded-full border-2 border-gray-300 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <span className="font-medium text-foreground">{factor.name}</span>
                    <p className="text-muted-foreground leading-tight text-[11px]">{factor.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {data.warnings.length > 0 && (
              <div className="pt-2 border-t mt-2">
                <p className="text-xs font-medium text-amber-600 mb-1">Attention:</p>
                <ul className="list-disc pl-3 text-[10px] text-muted-foreground space-y-0.5">
                  {data.warnings.slice(0, 2).map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
