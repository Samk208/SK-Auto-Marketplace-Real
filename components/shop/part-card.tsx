"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Part } from "@/lib/mock-parts"
import { cn } from "@/lib/utils"
import { Eye, Heart, MapPin, ShoppingCart, Star, Truck } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import * as React from "react"

function shouldDisableImageOptimization(src: string) {
    // Supabase Storage occasionally serves incorrect content-types (e.g. jpg served as image/svg+xml)
    // and animated GIFs are not optimized by Next.js.
    const lower = src.toLowerCase()
    return (
        lower.endsWith(".gif") ||
        lower.endsWith(".svg") ||
        lower.includes("/storage/v1/object/public/parts-images/")
    )
}

interface PartCardProps {
    part: Part
    className?: string
}

export function PartCard({ part, className }: PartCardProps) {
    const [isHovered, setIsHovered] = React.useState(false)
    const [isWishlisted, setIsWishlisted] = React.useState(false)

    // Segment-specific colors
    const segmentColors = {
        new: {
            border: "border-[#2558fa]/50",
            badge: "bg-[#2558fa] text-white",
            lightBadge: "bg-blue-50 text-[#2558fa] border-blue-200",
            accent: "text-[#2558fa]"
        },
        used: {
            border: "border-green-500/50",
            badge: "bg-green-600 text-white",
            lightBadge: "bg-green-50 text-green-700 border-green-200",
            accent: "text-green-600"
        },
        machine: {
            border: "border-amber-500/50",
            badge: "bg-amber-600 text-white",
            lightBadge: "bg-amber-50 text-amber-700 border-amber-200",
            accent: "text-amber-600"
        }
    }

    const colors = segmentColors[part.segment]

    return (
        <Card
            className={cn(
                "group relative overflow-hidden border bg-white transition-all duration-300",
                isHovered && "shadow-xl -translate-y-1",
                isHovered && colors.border,
                !isHovered && "border-slate-200 shadow-sm",
                className
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Section */}
            <Link href={`/shop/parts/${part.id}`} className="block">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50">
                    <Image
                        src={part.images[0] || "/placeholder.jpg"}
                        alt={part.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        unoptimized={shouldDisableImageOptimization(part.images[0] || "")}
                        className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Top Left Badges - Stacked */}
                    <div className="absolute left-2 top-2 flex flex-col gap-1.5">
                        {part.condition === "New" && (
                            <Badge className="bg-[#2558fa] text-white text-[10px] font-semibold px-2 py-0.5 shadow-sm">
                                NEW
                            </Badge>
                        )}
                        {part.condition === "Used" && (
                            <Badge className="bg-green-600 text-white text-[10px] font-semibold px-2 py-0.5 shadow-sm">
                                USED
                            </Badge>
                        )}
                        {part.condition === "Remanufactured" && (
                            <Badge className="bg-amber-600 text-white text-[10px] font-semibold px-2 py-0.5 shadow-sm">
                                REMAN
                            </Badge>
                        )}
                        {(part.brand === "OEM" || part.brand.includes("Genuine") || part.brand.includes("Mobis")) && (
                            <Badge variant="outline" className="bg-white/90 text-[#2558fa] border-[#2558fa]/30 text-[10px] font-semibold px-2 py-0.5">
                                OEM
                            </Badge>
                        )}
                    </div>

                    {/* Quick View Overlay */}
                    <div className={cn(
                        "absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300",
                        isHovered && "opacity-100"
                    )}>
                        <Button
                            variant="secondary"
                            size="sm"
                            className="gap-2 bg-white hover:bg-white/90 text-slate-900 shadow-lg"
                        >
                            <Eye className="h-4 w-4" />
                            Quick View
                        </Button>
                    </div>
                </div>
            </Link>

            {/* Wishlist Button - Always visible but styled differently on hover */}
            <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                    e.preventDefault()
                    setIsWishlisted(!isWishlisted)
                }}
                className={cn(
                    "absolute right-2 top-2 h-8 w-8 rounded-full transition-all z-10",
                    isWishlisted
                        ? "bg-red-50 text-red-500 hover:bg-red-100"
                        : "bg-white/80 text-slate-400 hover:bg-white hover:text-red-500 shadow-sm"
                )}
            >
                <Heart className={cn("h-4 w-4", isWishlisted && "fill-current")} />
            </Button>

            {/* Content Section */}
            <CardContent className="p-4">
                {/* Brand & Part Number */}
                <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-slate-500 truncate">
                        {part.brand}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        {part.partNumber}
                    </span>
                </div>

                {/* Product Name */}
                <Link href={`/shop/parts/${part.id}`}>
                    <h3 className={cn(
                        "line-clamp-2 min-h-[40px] text-sm font-semibold text-slate-900 transition-colors",
                        isHovered && colors.accent
                    )}>
                        {part.name}
                    </h3>
                </Link>

                {/* Compatibility */}
                <p className="mt-1.5 line-clamp-1 text-xs text-slate-500">
                    <span className="font-medium">{part.segment === 'machine' ? 'Models:' : 'Fits:'}</span>{' '}
                    {part.compatibleVehicles.length > 0 ? part.compatibleVehicles.join(", ") : "Universal / Check Desc."}
                </p>

                {/* Location for Used Parts */}
                {part.location && (
                    <div className="mt-1.5 flex items-center gap-1 text-xs text-slate-500">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{part.location}</span>
                    </div>
                )}

                {/* Rating (if exists) */}
                {part.rating > 0 && (
                    <div className="mt-2 flex items-center gap-1">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={cn(
                                        "h-3 w-3",
                                        i < Math.floor(part.rating)
                                            ? "text-amber-400 fill-amber-400"
                                            : "text-slate-200"
                                    )}
                                />
                            ))}
                        </div>
                        <span className="text-xs text-slate-500">({part.reviewCount})</span>
                    </div>
                )}

                {/* Price Section */}
                <div className="mt-3 flex items-baseline gap-2">
                    <span className={cn("text-xl font-bold", colors.accent)}>
                        ₩{part.priceKRW ? part.priceKRW.toLocaleString() : "TBD"}
                    </span>
                    {part.priceUSD > 0 && (
                        <span className="text-xs text-slate-400">
                            ~${part.priceUSD.toFixed(0)} USD
                        </span>
                    )}
                </div>

                {/* Stock & Shipping Status */}
                <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        <div
                            className={cn(
                                "h-2 w-2 rounded-full",
                                part.stockStatus === "In Stock"
                                    ? "bg-green-500"
                                    : part.stockStatus === "Low Stock"
                                        ? "bg-amber-500 animate-pulse"
                                        : "bg-red-500"
                            )}
                        />
                        <span
                            className={cn(
                                "text-xs font-medium",
                                part.stockStatus === "In Stock"
                                    ? "text-green-700"
                                    : part.stockStatus === "Low Stock"
                                        ? "text-amber-700"
                                        : "text-red-700"
                            )}
                        >
                            {part.stockStatus}
                        </span>
                    </div>
                    {part.stockStatus === "In Stock" && (
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                            <Truck className="h-3 w-3" />
                            <span>2-4 days</span>
                        </div>
                    )}
                </div>
            </CardContent>

            {/* Footer / Actions */}
            <CardFooter className="p-4 pt-0">
                <Button
                    className={cn(
                        "w-full gap-2 transition-all",
                        isHovered && part.segment === 'new' && "bg-[#2558fa] hover:bg-[#1a3ec1]",
                        isHovered && part.segment === 'used' && "bg-green-600 hover:bg-green-700",
                        isHovered && part.segment === 'machine' && "bg-amber-600 hover:bg-amber-700",
                        !isHovered && "bg-slate-900 hover:bg-slate-800"
                    )}
                >
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                </Button>
            </CardFooter>
        </Card>
    )
}
