"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Part } from "@/lib/parts"
import { cn } from "@/lib/utils"
import { Heart, ShoppingCart } from "lucide-react"

interface PartCardProps {
    part: Part
    className?: string
}

export function PartCard({ part, className }: PartCardProps) {
    // Stock status color mapping
    const stockColor = {
        "In Stock": "bg-emerald-500",
        "Low Stock": "bg-amber-500",
        "Out of Stock": "bg-red-500",
        "Pre-Order": "bg-blue-500",
    }

    return (
        <Card className={cn("group overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50", className)}>
            <div className="relative aspect-video bg-gray-100 overflow-hidden">
                {/* Placeholder for actual image since we use local paths that might not exist yet */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-50">
                    {/* In a real app we would use next/image here */}
                    {/* <Image src={part.image} alt={part.name} fill className="object-cover transition-transform group-hover:scale-105" /> */}
                    <span className="text-xs">Image: {part.name}</span>
                </div>

                <div className="absolute top-2 right-2 flex flex-col gap-1">
                    {part.condition === 'New' && (
                        <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-none shadow-sm">
                            NEW
                        </Badge>
                    )}
                    {/* Sale Logic Not in Type Yet, Removing or adding check if we update type later */}
                    {/* {part.isSale && (
                        <Badge className="bg-red-500 hover:bg-red-600 text-white border-none shadow-sm">
                            SALE
                        </Badge>
                    )} */}
                    {part.brand === "OEM" && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 backdrop-blur-sm">
                            OEM
                        </Badge>
                    )}
                </div>
            </div>

            <CardContent className="p-4 space-y-3">
                <div>
                    <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">
                        {part.name}
                    </h3>
                    <p className="text-xs text-muted-foreground font-mono mt-1">
                        {part.partNumber} • {part.brand}
                    </p>
                </div>

                <div className="text-sm text-gray-600 italic border-l-2 border-gray-200 pl-2 line-clamp-2 min-h-[40px]">
                    Fits: {part.compatibleVehicles.join(', ') || 'Universal'}
                </div>

                <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-gray-900">
                        ₩{part.priceKRW.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground">
                        (${part.priceUSD})
                    </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-medium">
                    <span className={cn("w-2 h-2 rounded-full", stockColor[part.stockStatus])} />
                    <span className={
                        part.stockStatus === "Out of Stock" ? "text-red-600" :
                            part.stockStatus === "Low Stock" ? "text-amber-600" :
                                "text-emerald-700"
                    }>
                        {part.stockStatus} • Ships in 2-4 days
                    </span>
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 gap-2">
                <Button className="flex-1 bg-[#2558fa] hover:bg-[#1a3ec1]" size="sm">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                </Button>
                <Button variant="outline" size="icon" className="h-9 w-9 border-gray-200 hover:border-red-200 hover:text-red-500 hover:bg-red-50">
                    <Heart className="w-4 h-4" />
                    <span className="sr-only">Add to wishlist</span>
                </Button>
            </CardFooter>
        </Card>
    )
}
