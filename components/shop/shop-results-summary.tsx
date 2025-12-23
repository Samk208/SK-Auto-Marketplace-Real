"use client"

import { X, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface ActiveFilter {
  id: string
  label: string
  value: string
}

interface ShopResultsSummaryProps {
  totalResults: number
  filteredResults: number
  activeFilters: ActiveFilter[]
  onRemoveFilter: (id: string) => void
  dataSaver: boolean
}

export function ShopResultsSummary({
  totalResults,
  filteredResults,
  activeFilters,
  onRemoveFilter,
  dataSaver,
}: ShopResultsSummaryProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-lg font-medium">
          Showing {filteredResults} of {totalResults} vehicles
        </p>

        {dataSaver && (
          <Badge
            variant="secondary"
            className="gap-1.5 bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
          >
            <Zap className="h-3.5 w-3.5" />
            Data Saver is active – optimized for slower connections
          </Badge>
        )}
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {activeFilters.map((filter) => (
            <Badge key={filter.id} variant="secondary" className="gap-1.5 pr-1">
              <span className="text-xs">
                {filter.label}: {filter.value}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 hover:bg-transparent"
                onClick={() => onRemoveFilter(filter.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
