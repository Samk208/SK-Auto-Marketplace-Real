"use client"

import { Users, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { LanguageBadge } from "@/components/language-badge"
import { RegionBadge } from "@/components/region-badge"

interface ShopHeaderProps {
  role?: "buyer" | "seller"
  locale?: string
}

export function ShopHeader({ role = "buyer", locale = "en" }: ShopHeaderProps) {
  return (
    <div className="border-b bg-gradient-to-r from-primary/5 to-accent/5">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary" className="gap-1.5">
              <Users className="h-3.5 w-3.5" />
              <span className="capitalize">{role}</span>
            </Badge>
            <LanguageBadge languages={["EN", "KO", "FR"]} size="sm" />
            <RegionBadge region="Ships to 15+ African Countries" size="sm" />
          </div>

          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Browse Vehicles</h1>
            <p className="text-muted-foreground text-lg">Find Korean vehicles ready to export to your country</p>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>Popular routes: Busan → Lagos · Busan → Tema · Busan → Mombasa</span>
          </div>
        </div>
      </div>
    </div>
  )
}
