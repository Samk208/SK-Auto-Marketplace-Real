"use client"

import { PartSearch } from "./part-search"

export function PartsHero() {
    return (
        <div className="relative w-full bg-slate-50 border-b overflow-hidden">
            {/* Background Pattern - Plus Grid + Gradient Overlay */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-transparent pointer-events-none" />

            <div className="container relative py-16 md:py-24 flex flex-col items-center text-center space-y-8">
                <div className="space-y-4 max-w-3xl">
                    <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-800 mb-4">
                        <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2"></span>
                        New: Official Korean Parts Catalog
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900">
                        Quality Parts for Your <span className="text-[#2558fa]">Korean Car</span>
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                        Direct from Korea to your doorstep. Express delivery in 3-5 days.
                        Search by part name, VIN, or upload a photo.
                    </p>
                </div>

                <PartSearch className="w-full" />
            </div>
        </div>
    )
}
