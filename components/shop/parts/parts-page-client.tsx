"use client"

import { Button } from "@/components/ui/button"
import { LayoutGrid, List } from "lucide-react"
import { useState } from "react"
import { MOCK_PARTS } from "./mock-data"
import { PartCard } from "./part-card"
import { PartFilters } from "./part-filters"
import { PartsHero } from "./parts-hero"

export function PartsPageClient() {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    // In a real app, strict filtering logic would happen here or on the server.
    // For now, we just pass the mock parts directly.
    const parts = MOCK_PARTS

    return (
        <div className="min-h-screen bg-gray-50">
            <PartsHero />

            <div className="container py-8 md:py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <div className="w-full lg:w-72 flex-shrink-0">
                        <div className="sticky top-24">
                            <PartFilters />
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 space-y-6">
                        {/* Toolbar */}
                        <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border">
                            <h2 className="font-semibold text-gray-900">
                                Showing {parts.length} Parts
                            </h2>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                                    size="icon"
                                    onClick={() => setViewMode("grid")}
                                >
                                    <LayoutGrid className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant={viewMode === "list" ? "secondary" : "ghost"}
                                    size="icon"
                                    onClick={() => setViewMode("list")}
                                >
                                    <List className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Parts Grid */}
                        <div className={`grid gap-6 ${viewMode === "grid"
                            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                            : "grid-cols-1"
                            }`}>
                            {parts.map((part) => (
                                <PartCard
                                    key={part.id}
                                    part={part}
                                    className={viewMode === "list" ? "flex-row" : ""}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
