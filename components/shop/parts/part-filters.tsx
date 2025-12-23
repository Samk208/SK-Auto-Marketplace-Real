"use client"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { CategoryGroup, PartSegment } from "@/lib/parts"
import { cn } from "@/lib/utils"
import { RotateCcw, SlidersHorizontal } from "lucide-react"

export interface PartFiltersProps {
    className?: string
    segment?: PartSegment
    categories?: CategoryGroup[]
    activeCategory?: string | null
    onCategoryChange?: (id: string | null) => void
    priceRange?: number[]
    onPriceRangeChange?: (range: number[]) => void
}

export function PartFilters({
    className,
    segment = 'new',
    categories = [],
    activeCategory = null,
    onCategoryChange = () => { },
    priceRange = [0, 5000000],
    onPriceRangeChange = () => { }
}: PartFiltersProps) {

    // Segment-specific colors
    const segmentColors = {
        new: {
            accent: "text-[#2558fa]",
            bg: "bg-blue-50",
            border: "border-[#2558fa]",
            checkbox: "data-[state=checked]:bg-[#2558fa] data-[state=checked]:border-[#2558fa]"
        },
        used: {
            accent: "text-green-600",
            bg: "bg-green-50",
            border: "border-green-600",
            checkbox: "data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
        },
        machine: {
            accent: "text-amber-600",
            bg: "bg-amber-50",
            border: "border-amber-600",
            checkbox: "data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
        }
    }

    const colors = segmentColors[segment]

    // Count active filters
    const activeFilterCount = (activeCategory ? 1 : 0) + (priceRange[0] > 0 || priceRange[1] < 5000000 ? 1 : 0)

    return (
        <div className={cn("space-y-6", className)}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className={cn("p-1.5 rounded-lg", colors.bg)}>
                        <SlidersHorizontal className={cn("w-4 h-4", colors.accent)} />
                    </div>
                    <h3 className="text-base font-semibold text-slate-900">Filters</h3>
                    {activeFilterCount > 0 && (
                        <Badge variant="secondary" className={cn("h-5 px-1.5 text-[10px]", colors.bg, colors.accent)}>
                            {activeFilterCount}
                        </Badge>
                    )}
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                        onCategoryChange(null)
                        onPriceRangeChange([0, 5000000])
                    }}
                    className="h-7 text-xs text-slate-500 hover:text-red-500 gap-1"
                >
                    <RotateCcw className="h-3 w-3" />
                    Reset
                </Button>
            </div>

            <Accordion type="multiple" defaultValue={["category", "vehicle", "price", "condition"]} className="w-full space-y-2">

                {/* Category Filter */}
                <AccordionItem value="category" className="border rounded-lg px-3">
                    <AccordionTrigger className="text-sm font-medium hover:no-underline py-3">
                        <span className="flex items-center gap-2">
                            {segment === 'machine' ? 'Machine Systems' : 'Category'}
                            {activeCategory && (
                                <Badge variant="secondary" className={cn("h-5 px-1.5 text-[10px]", colors.bg, colors.accent)}>
                                    1
                                </Badge>
                            )}
                        </span>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-2 pb-2">
                            {categories.map((cat) => (
                                <div
                                    key={cat.id}
                                    className={cn(
                                        "flex items-center space-x-3 p-2 rounded-md transition-colors cursor-pointer",
                                        activeCategory === cat.id ? colors.bg : "hover:bg-slate-50"
                                    )}
                                    onClick={() => onCategoryChange(activeCategory === cat.id ? null : cat.id)}
                                >
                                    <Checkbox
                                        id={`cat-${cat.id}`}
                                        checked={activeCategory === cat.id}
                                        className={colors.checkbox}
                                        onCheckedChange={(checked) => onCategoryChange(checked ? cat.id : null)}
                                    />
                                    <Label
                                        htmlFor={`cat-${cat.id}`}
                                        className={cn(
                                            "text-sm cursor-pointer flex-1",
                                            activeCategory === cat.id
                                                ? cn("font-medium", colors.accent)
                                                : "text-slate-700"
                                        )}
                                    >
                                        {cat.name}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Compatibility Filter - Dynamic based on Segment */}
                {segment !== 'machine' ? (
                    <AccordionItem value="vehicle" className="border rounded-lg px-3">
                        <AccordionTrigger className="text-sm font-medium hover:no-underline py-3">
                            Vehicle Compatibility
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-4 pb-2">
                                <div className="space-y-2">
                                    <Label className="text-xs font-medium text-slate-500">Make</Label>
                                    <Select>
                                        <SelectTrigger className="h-10 bg-slate-50 border-slate-200">
                                            <SelectValue placeholder="Select Make" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="hyundai">Hyundai</SelectItem>
                                            <SelectItem value="kia">Kia</SelectItem>
                                            <SelectItem value="genesis">Genesis</SelectItem>
                                            <SelectItem value="ssangyong">SsangYong</SelectItem>
                                            <SelectItem value="renault">Renault Samsung</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-medium text-slate-500">Model</Label>
                                    <Select disabled>
                                        <SelectTrigger className="h-10 bg-slate-50 border-slate-200">
                                            <SelectValue placeholder="Select Model" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="sonata">Sonata</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-medium text-slate-500">Year</Label>
                                    <Select disabled>
                                        <SelectTrigger className="h-10 bg-slate-50 border-slate-200">
                                            <SelectValue placeholder="Select Year" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="2024">2024</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ) : (
                    <AccordionItem value="machine" className="border rounded-lg px-3">
                        <AccordionTrigger className="text-sm font-medium hover:no-underline py-3">
                            Machine Type
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-4 pb-2">
                                <div className="space-y-2">
                                    <Label className="text-xs font-medium text-slate-500">Equipment Type</Label>
                                    <Select>
                                        <SelectTrigger className="h-10 bg-slate-50 border-slate-200">
                                            <SelectValue placeholder="Select Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="excavator">Excavator</SelectItem>
                                            <SelectItem value="forklift">Forklift</SelectItem>
                                            <SelectItem value="loader">Wheel Loader</SelectItem>
                                            <SelectItem value="dozer">Bulldozer</SelectItem>
                                            <SelectItem value="crane">Crane</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-medium text-slate-500">Brand</Label>
                                    <Select>
                                        <SelectTrigger className="h-10 bg-slate-50 border-slate-200">
                                            <SelectValue placeholder="Select Brand" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="hyundai">Hyundai</SelectItem>
                                            <SelectItem value="doosan">Doosan</SelectItem>
                                            <SelectItem value="volvo">Volvo</SelectItem>
                                            <SelectItem value="caterpillar">Caterpillar</SelectItem>
                                            <SelectItem value="komatsu">Komatsu</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )}

                {/* Price Filter */}
                <AccordionItem value="price" className="border rounded-lg px-3">
                    <AccordionTrigger className="text-sm font-medium hover:no-underline py-3">
                        <span className="flex items-center gap-2">
                            Price Range
                            {(priceRange[0] > 0 || priceRange[1] < 5000000) && (
                                <Badge variant="secondary" className={cn("h-5 px-1.5 text-[10px]", colors.bg, colors.accent)}>
                                    Set
                                </Badge>
                            )}
                        </span>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="pt-2 pb-4 space-y-4">
                            <Slider
                                value={priceRange}
                                max={segment === 'machine' ? 10000000 : 5000000}
                                step={segment === 'machine' ? 100000 : 10000}
                                onValueChange={onPriceRangeChange}
                                className={cn(
                                    "w-full",
                                    segment === 'new' && "[&_[role=slider]]:bg-[#2558fa]",
                                    segment === 'used' && "[&_[role=slider]]:bg-green-600",
                                    segment === 'machine' && "[&_[role=slider]]:bg-amber-600"
                                )}
                            />
                            <div className="flex items-center justify-between">
                                <div className="bg-slate-100 rounded-md px-2 py-1">
                                    <span className="text-xs font-mono text-slate-700">₩{priceRange[0].toLocaleString()}</span>
                                </div>
                                <span className="text-xs text-slate-400">to</span>
                                <div className="bg-slate-100 rounded-md px-2 py-1">
                                    <span className="text-xs font-mono text-slate-700">₩{priceRange[1].toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Condition Filter */}
                <AccordionItem value="condition" className="border rounded-lg px-3">
                    <AccordionTrigger className="text-sm font-medium hover:no-underline py-3">
                        Condition
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-2 pb-2">
                            {["New", "Used", "Remanufactured"].map((c) => (
                                <div
                                    key={c}
                                    className="flex items-center space-x-3 p-2 rounded-md hover:bg-slate-50 cursor-pointer"
                                >
                                    <Checkbox
                                        id={`cond-${c}`}
                                        className={colors.checkbox}
                                    />
                                    <Label htmlFor={`cond-${c}`} className="text-sm cursor-pointer text-slate-700">
                                        {c}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Stock Status Filter */}
                <AccordionItem value="stock" className="border rounded-lg px-3">
                    <AccordionTrigger className="text-sm font-medium hover:no-underline py-3">
                        Availability
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-2 pb-2">
                            {["In Stock", "Low Stock", "Out of Stock"].map((status) => (
                                <div
                                    key={status}
                                    className="flex items-center space-x-3 p-2 rounded-md hover:bg-slate-50 cursor-pointer"
                                >
                                    <Checkbox
                                        id={`stock-${status}`}
                                        className={colors.checkbox}
                                    />
                                    <Label htmlFor={`stock-${status}`} className="text-sm cursor-pointer text-slate-700 flex items-center gap-2">
                                        <span className={cn(
                                            "h-2 w-2 rounded-full",
                                            status === "In Stock" && "bg-green-500",
                                            status === "Low Stock" && "bg-amber-500",
                                            status === "Out of Stock" && "bg-red-500"
                                        )} />
                                        {status}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

            </Accordion>

            {/* WhatsApp Help - Important for African market */}
            <div className={cn("p-4 rounded-xl border-2 border-dashed", colors.bg, colors.border.replace('border-', 'border-').replace('/50', '/30'))}>
                <p className="text-sm font-medium text-slate-700 mb-2">Can't find what you need?</p>
                <p className="text-xs text-slate-500 mb-3">Send us your part number or photo via WhatsApp</p>
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2 bg-white hover:bg-green-50 border-green-500 text-green-700"
                >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp Us
                </Button>
            </div>
        </div>
    )
}
