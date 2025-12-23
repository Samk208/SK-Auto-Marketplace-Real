"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

interface ShopControlsProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onSearchSubmit?: () => void
  sortBy: string
  onSortChange: (sort: string) => void
}

export function ShopControls({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  sortBy,
  onSortChange,
}: ShopControlsProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && onSearchSubmit) {
      onSearchSubmit()
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center">
      {/* Search Bar */}
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/70" />
        <Input
          placeholder="Search by make, model or keyword…"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-10 h-12 bg-white dark:bg-slate-900 border-border shadow-sm focus-visible:ring-primary/30 transition-shadow"
        />
        {onSearchSubmit && (
          <Button
            variant="default"
            size="sm"
            onClick={onSearchSubmit}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 px-4 shadow-sm"
          >
            Search
          </Button>
        )}
      </div>

      {/* Sort Select */}
      <div className="w-full sm:w-[220px]">
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="h-12 bg-white dark:bg-slate-900 border-border shadow-sm">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recommended">Recommended</SelectItem>
            <SelectItem value="price_low">Price: Low to High</SelectItem>
            <SelectItem value="price_high">Price: High to Low</SelectItem>
            <SelectItem value="year_new">Newest listings</SelectItem>
            <SelectItem value="mileage_low">Lowest mileage</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
