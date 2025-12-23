import Link from "next/link"
import { Car, Bus, Truck, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

const CATEGORIES = [
  { id: "sedan", name: "Sedans", icon: Car, href: "/shop/body-type/sedan" },
  { id: "suv", name: "SUVs", icon: Car, href: "/shop/body-type/suv" },
  { id: "bus", name: "Buses", icon: Bus, href: "/shop/body-type/bus" },
  { id: "van", name: "Vans", icon: Truck, href: "/shop/body-type/van" },
  { id: "electric", name: "Electric", icon: Zap, href: "/shop/fuel-type/electric" },
]

export function CategoryNav() {
  return (
    <div className="bg-muted/30 border-y py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <span className="text-sm font-medium text-muted-foreground whitespace-nowrap mr-2">Browse by:</span>
          {CATEGORIES.map((category) => (
            <Link key={category.id} href={category.href}>
              <Button variant="outline" size="sm" className="whitespace-nowrap gap-2 bg-transparent">
                <category.icon className="h-4 w-4" />
                {category.name}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
