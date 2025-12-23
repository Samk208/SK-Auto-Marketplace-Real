"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react"

interface FitmentBadgeProps {
    status: "match" | "no-match" | "unknown"
    vehicleName?: string
    className?: string
}

export function FitmentBadge({ status, vehicleName, className }: FitmentBadgeProps) {
    if (status === "match") {
        return (
            <div className={cn("rounded-lg bg-green-50 border border-green-200 p-4 flex items-start gap-3", className)}>
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                <div>
                    <h4 className="font-semibold text-green-800">Guaranteed to fit</h4>
                    <p className="text-sm text-green-700">
                        This part is a confirmed match for your <span className="font-semibold">{vehicleName}</span>
                    </p>
                </div>
            </div>
        )
    }

    if (status === "no-match") {
        return (
            <div className={cn("rounded-lg bg-red-50 border border-red-200 p-4 flex items-start gap-3", className)}>
                <XCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                <div>
                    <h4 className="font-semibold text-red-800">Does NOT fit</h4>
                    <p className="text-sm text-red-700">
                        This part is not compatible with your <span className="font-semibold">{vehicleName}</span>
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className={cn("rounded-lg bg-amber-50 border border-amber-200 p-4 flex items-start gap-3", className)}>
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <div className="flex-1">
                <h4 className="font-semibold text-amber-800">Check Compatibility</h4>
                <p className="text-sm text-amber-700 mb-2">
                    Select your vehicle to check if this part fits.
                </p>
                <Button size="sm" variant="outline" className="bg-white border-amber-300 text-amber-800 hover:bg-amber-100 hover:text-amber-900">
                    Select Vehicle
                </Button>
            </div>
        </div>
    )
}
