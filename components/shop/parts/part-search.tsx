"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Camera, Mic, Search, Sparkles } from "lucide-react"

interface PartSearchProps {
    className?: string
}

export function PartSearch({ className }: PartSearchProps) {
    return (
        <div className={cn("relative w-full max-w-3xl mx-auto", className)}>
            <div className="relative flex items-center shadow-2xl rounded-xl bg-white focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-300">
                <div className="pl-4 text-muted-foreground">
                    <Search className="w-5 h-5" />
                </div>

                <Input
                    type="text"
                    placeholder="Search by part name, VIN, or part number..."
                    className="h-14 sm:h-16 border-none text-base sm:text-lg focus-visible:ring-0 rounded-l-xl rounded-r-none bg-transparent px-4"
                />

                <div className="flex items-center gap-1 sm:gap-2 pr-2">
                    {/* Mobile only mostly, but good to have */}
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                        <Mic className="w-5 h-5" />
                        <span className="sr-only">Voice Search</span>
                    </Button>

                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                        <Camera className="w-5 h-5" />
                        <span className="sr-only">Image Search</span>
                    </Button>

                    <Button size="lg" className="h-10 sm:h-12 px-6 sm:px-8 bg-[#2558fa] hover:bg-[#1a3ec1] rounded-lg ml-1 font-medium text-base shadow-lg shadow-blue-500/20">
                        <Sparkles className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">AI Search</span>
                        <span className="sm:hidden">Search</span>
                    </Button>
                </div>
            </div>

            {/* Search Hints */}
            <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-slate-600">
                <span className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2" />
                    Express 3-5 Day Shipping
                </span>
                <span className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2" />
                    VIN Verified Compatibility
                </span>
                <span className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2" />
                    100% Refund Guarantee
                </span>
                <span className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2" />
                    WhatsApp Support
                </span>
            </div>
        </div>
    )
}
