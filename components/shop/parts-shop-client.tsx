"use client"

import { PartCard } from "@/components/shop/part-card"
import { PartFilters } from "@/components/shop/parts/part-filters"
import { WholesaleOrderModal } from "@/components/shop/parts/wholesale-order-modal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { CAR_PARTS_CATEGORIES, MACHINE_PARTS_CATEGORIES, Part, PartSegment } from "@/lib/parts"
import { cn } from "@/lib/utils"
import {
    BadgeCheck,
    Car,
    ChevronRight,
    Cog,
    Filter,
    Hammer,
    Heart,
    MessageCircle,
    Package,
    Recycle,
    Search,
    Shield,
    ShoppingCart,
    Sparkles,
    Timer,
    Truck,
    Wrench,
    Zap
} from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import * as React from "react"

const MACHINE_CATEGORIES = ["Hydraulic System", "Undercarriage", "Bearings & Seals", "Attachments", "Heavy Engine Parts"]

interface PartsShopClientProps {
    initialParts: Part[]
}

export function PartsShopClient({ initialParts = [] }: PartsShopClientProps) {
    const searchParams = useSearchParams()
    const router = useRouter()

    // State for Parts Data - Initialize with server data
    const [parts, setParts] = React.useState<Part[]>(initialParts)
    const [isLoading, setIsLoading] = React.useState(false)

    // State for Segment (New | Used | Machine)
    // Default to 'new' if not specified
    const initialSegment = (searchParams.get("segment") as PartSegment) || "new"
    const [activeSegment, setActiveSegment] = React.useState<PartSegment>(initialSegment)

    // State for filters
    const [activeCategory, setActiveCategory] = React.useState<string | null>(searchParams.get("category"))
    const [priceRange, setPriceRange] = React.useState([0, 5000000]) // Increased range for machine parts
    const [searchQuery, setSearchQuery] = React.useState("")
    const [isFilterOpen, setIsFilterOpen] = React.useState(false)

    // Sync with server data if needed (optional)
    React.useEffect(() => {
        setParts(initialParts)
    }, [initialParts])

    // Update active categories based on segment
    const currentCategories = React.useMemo(() => {
        return activeSegment === "machine" ? MACHINE_PARTS_CATEGORIES : CAR_PARTS_CATEGORIES
    }, [activeSegment])

    // Filter Parts Logic
    const filteredParts = React.useMemo(() => {
        return parts.filter((part) => {
            // Segment Filter (Strict)
            if (part.segment !== activeSegment) return false

            // Category Filter
            if (activeCategory) {
                // Check if category matches ID or Name
                const cat = currentCategories.find(c => c.id === activeCategory)
                if (cat) {
                    // If category found, match exact category name
                    if (cat.name !== part.category) return false
                } else {
                    // Fallback ID match
                    if (part.category.toLowerCase() !== activeCategory.toLowerCase()) return false
                }
            }

            // Search Filter
            if (searchQuery) {
                const q = searchQuery.toLowerCase()
                if (
                    !part.name.toLowerCase().includes(q) &&
                    !part.partNumber.toLowerCase().includes(q) &&
                    !part.compatibleVehicles.some(v => v.toLowerCase().includes(q))
                ) {
                    return false
                }
            }

            // Price Filter
            if (part.priceKRW < priceRange[0] || part.priceKRW > priceRange[1]) {
                return false
            }

            return true
        })
    }, [parts, activeSegment, activeCategory, searchQuery, priceRange, currentCategories])

    // Handlers
    const handleSegmentChange = (segment: string) => {
        const s = segment as PartSegment
        setActiveSegment(s)
        setActiveCategory(null) // Reset category on segment switching

        const params = new URLSearchParams(searchParams.toString())
        params.set("segment", s)
        params.delete("category") // Clear old category param
        router.push(`/shop/parts?${params.toString()}`)
    }

    const handleCategoryClick = (catId: string | null) => {
        if (catId === null) {
            setActiveCategory(null)
            const params = new URLSearchParams(searchParams.toString())
            params.delete("category")
            router.push(`/shop/parts?${params.toString()}`)
            return
        }

        setActiveCategory(catId === activeCategory ? null : catId)
        const params = new URLSearchParams(searchParams.toString())
        if (catId === activeCategory) {
            params.delete("category")
        } else {
            params.set("category", catId)
        }
        router.push(`/shop/parts?${params.toString()}`)
    }

    // Visuals for Segments
    const segmentConfig = {
        new: {
            label: "New Auto Parts",
            icon: <Package className="h-4 w-4" />,
            color: "bg-[#2558fa]",
            textColor: "text-[#2558fa]",
            lightBg: "bg-blue-50",
            tagline: "Express delivery in 3-5 days • 100% Authentic • VIN Verified",
            gradient: "from-[#2558fa] via-[#4f7aff] to-[#7c9dff]"
        },
        used: {
            label: "Used Auto Parts",
            icon: <Recycle className="h-4 w-4" />,
            color: "bg-green-600",
            textColor: "text-green-600",
            lightBg: "bg-green-50",
            tagline: "Quality Tested • Eco-Friendly • Up to 70% Savings",
            gradient: "from-green-600 via-green-500 to-emerald-400"
        },
        machine: {
            label: "Heavy Machine Parts",
            icon: <Hammer className="h-4 w-4" />,
            color: "bg-amber-600",
            textColor: "text-amber-600",
            lightBg: "bg-amber-50",
            tagline: "Excavators • Forklifts • Loaders • Trucks",
            gradient: "from-amber-600 via-amber-500 to-yellow-400"
        },
    }

    // Category icons mapping
    const categoryIcons: Record<string, React.ReactNode> = {
        "engine": <Cog className="h-5 w-5" />,
        "body": <Car className="h-5 w-5" />,
        "suspension": <Wrench className="h-5 w-5" />,
        "electrical": <Zap className="h-5 w-5" />,
        "interior": <Sparkles className="h-5 w-5" />,
        "hydraulics": <Cog className="h-5 w-5" />,
        "undercarriage": <Truck className="h-5 w-5" />,
        "engine_heavy": <Cog className="h-5 w-5" />,
        "attachments": <Hammer className="h-5 w-5" />,
    }

    const config = segmentConfig[activeSegment]

    return (
        <div className="flex min-h-screen flex-col bg-slate-50">

            {/* 1. HERO SECTION - Enhanced with Plus Grid Pattern */}
            <section className="relative overflow-hidden bg-white border-b">
                {/* Plus Grid Background Pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2v-4h4v-2h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }}
                />
                {/* Gradient Overlay based on segment */}
                <div className={cn(
                    "absolute inset-0 opacity-5 bg-gradient-to-br",
                    config.gradient
                )} />

                <div className="relative mx-auto max-w-7xl px-4 py-12 md:py-16">
                    <div className="mx-auto max-w-3xl text-center">
                        {/* Beta Badge */}
                        <div className={cn(
                            "inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium mb-6",
                            activeSegment === 'new' && "border-blue-200 bg-blue-50 text-blue-700",
                            activeSegment === 'used' && "border-green-200 bg-green-50 text-green-700",
                            activeSegment === 'machine' && "border-amber-200 bg-amber-50 text-amber-700"
                        )}>
                            <span className={cn(
                                "flex h-2 w-2 rounded-full mr-2",
                                activeSegment === 'new' && "bg-[#2558fa]",
                                activeSegment === 'used' && "bg-green-600",
                                activeSegment === 'machine' && "bg-amber-600"
                            )} />
                            Beta • {config.label}
                        </div>

                        {/* Main Headline */}
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
                            Find <span className={config.textColor}>{config.label}</span>
                        </h1>
                        <p className="mt-4 text-lg text-slate-600">
                            {config.tagline}
                        </p>

                        {/* Segment Toggles - Pill Style */}
                        <div className="mt-8 flex justify-center">
                            <div className="inline-flex rounded-full bg-slate-100 p-1">
                                <button
                                    onClick={() => handleSegmentChange('new')}
                                    className={cn(
                                        "flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all",
                                        activeSegment === 'new'
                                            ? "bg-white text-[#2558fa] shadow-sm"
                                            : "text-slate-600 hover:text-slate-900"
                                    )}
                                >
                                    <Package className="h-4 w-4" />
                                    New Parts
                                </button>
                                <button
                                    onClick={() => handleSegmentChange('used')}
                                    className={cn(
                                        "flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all",
                                        activeSegment === 'used'
                                            ? "bg-white text-green-600 shadow-sm"
                                            : "text-slate-600 hover:text-slate-900"
                                    )}
                                >
                                    <Recycle className="h-4 w-4" />
                                    Used Parts
                                </button>
                                <button
                                    onClick={() => handleSegmentChange('machine')}
                                    className={cn(
                                        "flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all",
                                        activeSegment === 'machine'
                                            ? "bg-white text-amber-600 shadow-sm"
                                            : "text-slate-600 hover:text-slate-900"
                                    )}
                                >
                                    <Hammer className="h-4 w-4" />
                                    Machine
                                </button>
                            </div>
                        </div>

                        {/* Enhanced Search Bar */}
                        <div className="mt-8 relative">
                            <div className={cn(
                                "relative mx-auto flex max-w-2xl items-center overflow-hidden rounded-xl border-2 bg-white shadow-lg transition-all",
                                "focus-within:ring-4",
                                activeSegment === 'new' && "border-blue-200 focus-within:border-[#2558fa] focus-within:ring-blue-100",
                                activeSegment === 'used' && "border-green-200 focus-within:border-green-500 focus-within:ring-green-100",
                                activeSegment === 'machine' && "border-amber-200 focus-within:border-amber-500 focus-within:ring-amber-100"
                            )}>
                                <div className={cn(
                                    "flex h-12 w-12 items-center justify-center",
                                    config.textColor
                                )}>
                                    <Search className="h-5 w-5" />
                                </div>
                                <input
                                    type="text"
                                    placeholder={
                                        activeSegment === 'machine'
                                            ? "Search by machine model (e.g. R210LC-7) or part number..."
                                            : "Search by part name, part number, or VIN..."
                                    }
                                    className="h-14 w-full border-none bg-transparent text-base md:text-lg placeholder:text-slate-400 focus:outline-none focus:ring-0"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <div className="flex items-center gap-2 pr-2">
                                    <Button
                                        className={cn(
                                            "h-10 rounded-lg px-6 font-semibold",
                                            activeSegment === 'new' && "bg-[#2558fa] hover:bg-[#1a3ec1]",
                                            activeSegment === 'used' && "bg-green-600 hover:bg-green-700",
                                            activeSegment === 'machine' && "bg-amber-600 hover:bg-amber-700"
                                        )}
                                        size="sm"
                                    >
                                        Search
                                    </Button>
                                </div>
                            </div>
                            {/* Search Examples */}
                            <p className="mt-3 text-sm text-slate-500">
                                Try: <button className="text-slate-700 hover:underline">26300-35504</button>
                                {activeSegment !== 'machine' && (
                                    <>, <button className="text-slate-700 hover:underline">KMHD35LH5GU123456</button></>
                                )}
                                {activeSegment === 'machine' && (
                                    <>, <button className="text-slate-700 hover:underline">R210LC-7</button></>
                                )}
                            </p>
                        </div>

                        {/* Trust Indicators */}
                        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600">
                            <div className="flex items-center gap-2">
                                <div className={cn("rounded-full p-1.5", config.lightBg)}>
                                    <BadgeCheck className={cn("h-4 w-4", config.textColor)} />
                                </div>
                                <span>100% Authentic</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={cn("rounded-full p-1.5", config.lightBg)}>
                                    <Timer className={cn("h-4 w-4", config.textColor)} />
                                </div>
                                <span>3-5 Day Delivery</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={cn("rounded-full p-1.5", config.lightBg)}>
                                    <Shield className={cn("h-4 w-4", config.textColor)} />
                                </div>
                                <span>Buyer Protection</span>
                            </div>
                        </div>

                        {/* Wholesale Order CTA */}
                        <div className="mt-8 pt-6 border-t border-slate-200">
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <div className="text-center sm:text-left">
                                    <p className="text-sm font-medium text-slate-900">Need bulk parts?</p>
                                    <p className="text-xs text-slate-500">Submit a list for wholesale pricing</p>
                                </div>
                                <WholesaleOrderModal
                                    segment={activeSegment}
                                    trigger={
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "gap-2 border-2",
                                                activeSegment === 'new' && "border-[#2558fa] text-[#2558fa] hover:bg-blue-50",
                                                activeSegment === 'used' && "border-green-600 text-green-600 hover:bg-green-50",
                                                activeSegment === 'machine' && "border-amber-600 text-amber-600 hover:bg-amber-50"
                                            )}
                                        >
                                            <Package className="h-4 w-4" />
                                            Wholesale / Bulk Order
                                        </Button>
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. CATEGORY QUICK NAV - Visual Grid like Autoparts24 */}
            <section className="border-b bg-white py-8">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-slate-900">Browse by Category</h2>
                        <Button variant="ghost" size="sm" className="text-slate-600 gap-1">
                            View All <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {currentCategories.map((cat) => {
                            const partCount = parts.filter(
                                p => p.segment === activeSegment && p.category === cat.name
                            ).length
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => handleCategoryClick(cat.id)}
                                    className={cn(
                                        "group flex flex-col items-center gap-3 rounded-xl border p-4 transition-all hover:shadow-md",
                                        activeCategory === cat.id
                                            ? cn("border-2 shadow-sm",
                                                activeSegment === 'new' && "border-[#2558fa] bg-blue-50/50",
                                                activeSegment === 'used' && "border-green-500 bg-green-50/50",
                                                activeSegment === 'machine' && "border-amber-500 bg-amber-50/50"
                                            )
                                            : "border-slate-200 bg-white hover:border-slate-300"
                                    )}
                                >
                                    <div className={cn(
                                        "flex h-12 w-12 items-center justify-center rounded-full transition-colors",
                                        activeCategory === cat.id
                                            ? cn(
                                                activeSegment === 'new' && "bg-[#2558fa] text-white",
                                                activeSegment === 'used' && "bg-green-600 text-white",
                                                activeSegment === 'machine' && "bg-amber-600 text-white"
                                            )
                                            : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                                    )}>
                                        {categoryIcons[cat.id] || <Cog className="h-5 w-5" />}
                                    </div>
                                    <div className="text-center">
                                        <p className={cn(
                                            "text-sm font-medium",
                                            activeCategory === cat.id ? config.textColor : "text-slate-700"
                                        )}>
                                            {cat.name}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            {partCount > 0 ? `${partCount} parts` : 'Coming soon'}
                                        </p>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </section>

            <main className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-4 py-8">

                {/* 2. FILTER SIDEBAR (Desktop) */}
                <aside className="hidden w-64 shrink-0 lg:block">
                    <div className="sticky top-24 rounded-xl border bg-white p-6 shadow-sm">
                        <PartFilters
                            segment={activeSegment}
                            categories={currentCategories}
                            activeCategory={activeCategory}
                            onCategoryChange={handleCategoryClick}
                            priceRange={priceRange}
                            onPriceRangeChange={setPriceRange}
                        />
                    </div>
                </aside>

                {/* 3. PARTS GRID */}
                <div className="flex-1">
                    {/* Controls Mobile */}
                    <div className="mb-6 flex items-center justify-between lg:hidden">
                        <h2 className="text-lg font-bold">
                            {filteredParts.length} Parts
                        </h2>
                        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="sm" className="gap-2">
                                    <Filter className="h-4 w-4" /> Filters
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                                <div className="py-4 h-full overflow-y-auto">
                                    <h3 className="mb-4 text-lg font-bold">Filters</h3>
                                    <PartFilters
                                        segment={activeSegment}
                                        categories={currentCategories}
                                        activeCategory={activeCategory}
                                        onCategoryChange={handleCategoryClick}
                                        priceRange={priceRange}
                                        onPriceRangeChange={setPriceRange}
                                    />
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Desktop Header */}
                    <div className="mb-6 hidden items-center justify-between lg:flex">
                        <h2 className="text-xl font-bold text-slate-900">
                            {isLoading ? "Loading..." : `${filteredParts.length} Results`}
                            {activeCategory && <span className="font-normal text-muted-foreground"> in {currentCategories.find(c => c.id === activeCategory)?.name}</span>}
                        </h2>
                        <div className="flex gap-2">
                            {/* Sort Options could go here */}
                        </div>
                    </div>

                    {/* Grid */}
                    {isLoading ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-[400px] rounded-xl border bg-slate-50 animate-pulse" />
                            ))}
                        </div>
                    ) : filteredParts.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredParts.map((part) => (
                                <PartCard key={part.id} part={part} />
                            ))}
                        </div>
                    ) : (
                        /* EMPTY STATE */
                        <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed bg-white p-8 text-center">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-400">
                                <Search className="h-8 w-8" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold text-slate-900">No parts found</h3>
                            <p className="max-w-xs text-sm text-slate-500">
                                We couldn't find any {activeSegment} parts matching your filters.
                            </p>
                            <Button
                                variant="link"
                                className="mt-4 text-primary"
                                onClick={() => {
                                    setSearchQuery("")
                                    setActiveCategory(null)
                                    setPriceRange([0, 5000000])
                                }}
                            >
                                Clear filters
                            </Button>
                        </div>
                    )}
                </div>
            </main>

            {/* 4. QUICK ACTIONS (Mobile Sticky) */}
            <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white px-4 py-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:hidden">
                <div className="flex items-center justify-between">
                    <Button variant="ghost" className="flex flex-col items-center gap-1 text-xs text-slate-600">
                        <Search className="h-5 w-5" />
                        Search
                    </Button>
                    <Button variant="ghost" className="flex flex-col items-center gap-1 text-xs text-slate-600">
                        <Heart className="h-5 w-5" />
                        Saved
                    </Button>
                    <div className="relative">
                        <Button size="icon" className="h-12 w-12 rounded-full shadow-lg -translate-y-4 border-4 border-white">
                            <ShoppingCart className="h-6 w-6" />
                        </Button>
                        <Badge className="absolute -right-1 -top-2 flex h-5 w-5 items-center justify-center rounded-full p-0 text-[10px]">
                            3
                        </Badge>
                    </div>
                    <Button variant="ghost" className="flex flex-col items-center gap-1 text-xs text-slate-600">
                        <MessageCircle className="h-5 w-5" />
                        Chat
                    </Button>
                    <Button variant="ghost" className="flex flex-col items-center gap-1 text-xs text-slate-600">
                        <Car className="h-5 w-5" />
                        Garage
                    </Button>
                </div>
            </div>
        </div>
    )
}
