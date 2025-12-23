"use client"

import { Button } from "@/components/ui/button"
import { Search, ShieldCheck } from "lucide-react"; // Updated icons

export function EmptyStateNoResults() {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-6">
            <div className="bg-slate-50 p-6 rounded-full">
                <Search className="w-12 h-12 text-slate-300" />
            </div>

            <div className="space-y-2 max-w-md">
                <h3 className="text-xl font-semibold text-slate-900">No parts found matching your search</h3>
                <p className="text-slate-500">
                    Try adjusting your filters, checking for typos, or searching by a different term (like VIN or Part Number).
                </p>
            </div>

            <div className="flex gap-4">
                <Button variant="outline">Clear Filters</Button>
                <Button>Contact Support</Button>
            </div>

            <div className="pt-8 border-t w-full max-w-lg mt-8">
                <p className="text-sm font-medium text-slate-900 mb-4">Popular Parts You Might Need:</p>
                <div className="flex flex-wrap justify-center gap-2">
                    {["Oil Filter", "Brake Pads", "Air Filter", "Spark Plugs"].map((tag) => (
                        <Button key={tag} variant="secondary" size="sm" className="bg-slate-100 hover:bg-slate-200 text-slate-700">
                            {tag}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export function EmptyStateNoFilters() {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
            {/* Illustration placeholder */}
            <div className="bg-blue-50 p-8 rounded-full mb-2">
                <ShieldCheck className="w-16 h-16 text-blue-500" />
            </div>

            <div className="space-y-2 max-w-lg">
                <h2 className="text-2xl font-bold text-slate-900">Browse 500+ Korean Car Parts</h2>
                <p className="text-lg text-slate-600">
                    Use filters to find the perfect part or search by VIN for exact compatibility.
                </p>
            </div>

            <div className="w-full max-w-xs">
                <Button size="lg" className="w-full bg-[#2558fa] hover:bg-[#1a3ec1]">
                    Enter VIN Number
                </Button>
            </div>
        </div>
    )
}
