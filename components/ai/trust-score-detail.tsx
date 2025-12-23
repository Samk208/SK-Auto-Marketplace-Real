"use client"

import { calculateTrustScoreAction, type TrustScoreResult } from "@/app/actions/ai"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { AlertTriangle, CheckCircle, Clock, Info, Loader2, Shield, XCircle } from "lucide-react"
import { useEffect, useState } from "react"

interface TrustScoreDetailProps {
  listingId: string
}

export function TrustScoreDetail({ listingId }: TrustScoreDetailProps) {
  const [loading, setLoading] = useState(true)
  const [trustData, setTrustData] = useState<TrustScoreResult | null>(null)

  useEffect(() => {
    async function loadScore() {
      try {
        const result = await calculateTrustScoreAction(listingId)
        setTrustData(result)
      } catch (error) {
        console.error("Failed to load trust score", error)
      } finally {
        setLoading(false)
      }
    }
    loadScore()
  }, [listingId])

  const getStatusIcon = (verified: boolean) => {
    return verified ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Clock className="h-4 w-4 text-yellow-600" />
  }

  const getFactorIcon = (status: string) => {
    if (status === "verified") return <CheckCircle className="h-4 w-4 text-green-600" />
    if (status === "pending") return <Clock className="h-4 w-4 text-yellow-600" />
    return <XCircle className="h-4 w-4 text-red-600" />
  }

  const getImpactBadge = (impact: string) => {
    const colors = {
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-blue-100 text-blue-800",
    }
    return (
      <Badge variant="secondary" className={cn("text-xs", colors[impact as keyof typeof colors])}>
        {impact}
      </Badge>
    )
  }

  if (loading) {
    return (
      <Card className="border-2 border-green-200 dark:border-green-800 p-8 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </Card>
    )
  }

  if (!trustData) return null

  return (
    <Card className="border-2 border-green-200 dark:border-green-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            <CardTitle className="text-xl">Trust & Verification</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            AI-Verified
          </Badge>
        </div>
        <CardDescription>AI-powered fraud detection and document verification</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Trust Score */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30 p-6 rounded-lg border-2 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Overall Trust Score</p>
              <div className="flex items-baseline gap-2">
                <p className={cn("text-4xl font-bold", trustData.color)}>{trustData.score}</p>
                <p className="text-2xl text-muted-foreground">/100</p>
              </div>
              <p className="text-sm font-medium mt-1 capitalize">{trustData.level} Trust Level</p>
            </div>
            <Shield className={cn("h-16 w-16", trustData.color)} />
          </div>
          <Progress value={trustData.score} className="h-3" />
        </div>

        {/* Warnings */}
        {trustData.warnings.length > 0 && (
          <div className="space-y-2">
            {trustData.warnings.map((warning, index) => (
              <div
                key={index}
                className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg border border-yellow-200 dark:border-yellow-800"
              >
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-yellow-900 dark:text-yellow-100">{warning}</p>
              </div>
            ))}
          </div>
        )}

        {/* Verified Documents */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Verified Documents
          </h3>
          <div className="space-y-2">
            {trustData.verifiedDocuments.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  {getStatusIcon(doc.verified)}
                  <div>
                    <p className="text-sm font-medium">{doc.name}</p>
                    {doc.verifiedDate && <p className="text-xs text-muted-foreground">Verified {doc.verifiedDate}</p>}
                  </div>
                </div>
                {doc.verified ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    Pending
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Trust Factors */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Trust Factors
          </h3>
          <div className="space-y-2">
            {trustData.trustFactors.map((factor, index) => (
              <div key={index} className="p-3 bg-muted/50 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getFactorIcon(factor.status)}
                    <p className="text-sm font-medium">{factor.name}</p>
                  </div>
                  {getImpactBadge(factor.impact)}
                </div>
                <p className="text-xs text-muted-foreground pl-6">{factor.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
          <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-blue-900 dark:text-blue-100">
            Our AI system continuously monitors listings for authenticity, analyzes documents with computer vision, and
            cross-references vehicle data across multiple databases to ensure buyer protection.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

