"use client"

import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SHOP_COUNTRY_PRESETS } from "@/lib/mock-shop-data"

interface PortPresetButtonsProps {
  selectedCountry: string
  onCountryChange: (country: string) => void
}

export function PortPresetButtons({ selectedCountry, onCountryChange }: PortPresetButtonsProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-muted-foreground whitespace-nowrap">Quick select:</span>
      {SHOP_COUNTRY_PRESETS.map((preset) => (
        <Button
          key={preset.id}
          variant={selectedCountry === preset.id ? "default" : "outline"}
          size="sm"
          onClick={() => onCountryChange(preset.id)}
          className="gap-1.5 whitespace-nowrap"
        >
          <span>{preset.flag}</span>
          <span>{preset.name}</span>
          <MapPin className="h-3.5 w-3.5" />
        </Button>
      ))}
    </div>
  )
}
