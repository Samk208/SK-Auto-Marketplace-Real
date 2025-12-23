"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Part } from "@/lib/parts"
import { MessageCircle, PackageCheck, RotateCcw, ShoppingCart, Truck } from "lucide-react"
import { useState } from "react"
import { FitmentBadge } from "./fitment-badge"

interface PartDetailHeroProps {
    part: Part
}

export function PartDetailHero({ part }: PartDetailHeroProps) {
    const [selectedImage, setSelectedImage] = useState(0)
    const [quantity, setQuantity] = useState(1)

    // Mock multiple images
    const images = part.images.length > 0 ? part.images : ['/placeholder.jpg']

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column: Images */}
            <div className="space-y-4">
                <div className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        {/* Use basic img for now if next/image placeholder paths don't exist, or just placeholder text */}
                        <div className="text-center p-8">
                            <span className="block text-6xl mb-4">📦</span>
                            <span>{part.name} Image {selectedImage + 1}</span>
                        </div>
                    </div>
                    {part.condition === 'New' && (
                        <Badge className="absolute top-4 left-4 bg-emerald-500 text-white border-none py-1.5 px-3">
                            NEW CONDITION
                        </Badge>
                    )}
                </div>

                <div className="grid grid-cols-4 gap-4">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedImage(idx)}
                            className={`relative aspect-square bg-gray-50 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === idx ? "border-[#2558fa]" : "border-transparent hover:border-gray-200"
                                }`}
                        >
                            <div className="flex items-center justify-center h-full text-xs text-gray-400">View {idx + 1}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Right Column: Info & Buy Box */}
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                        {part.name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                        <span className="font-mono">Part #: {part.partNumber}</span>
                        <span>•</span>
                        <span className="text-[#2558fa] font-medium">{part.brand}</span>
                        <span>•</span>
                        <div className="flex items-center">
                            <span className="text-yellow-400 mr-1">★</span>
                            <span className="text-gray-700 font-medium">{part.rating || "4.8"}</span>
                            <span className="text-gray-400 ml-1">({part.reviewCount || 42} reviews)</span>
                        </div>
                    </div>
                </div>

                <FitmentBadge status="unknown" />

                <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 space-y-6">
                    <div className="flex items-baseline justify-between">
                        <div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-gray-900">₩{part.priceKRW.toLocaleString()}</span>
                                <span className="text-lg text-gray-500 font-medium">(${part.priceUSD})</span>
                            </div>
                            <p className="text-sm text-emerald-600 font-medium flex items-center mt-1">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2" />
                                {part.stockStatus} • Ships in 2-4 days
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center border border-gray-300 rounded-lg bg-white h-12 w-32">
                            <button
                                className="w-10 h-full flex items-center justify-center hover:bg-gray-50 text-gray-600 disabled:opacity-50"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                disabled={quantity <= 1}
                            >
                                -
                            </button>
                            <span className="flex-1 text-center font-medium">{quantity}</span>
                            <button
                                className="w-10 h-full flex items-center justify-center hover:bg-gray-50 text-gray-600"
                                onClick={() => setQuantity(quantity + 1)}
                            >
                                +
                            </button>
                        </div>
                        <Button size="lg" className="flex-1 h-12 bg-[#2558fa] hover:bg-[#1a3ec1] text-base">
                            <ShoppingCart className="w-5 h-5 mr-2" />
                            Add to Cart
                        </Button>
                    </div>

                    <Button variant="outline" size="lg" className="w-full h-12 border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800">
                        <MessageCircle className="w-5 h-5 mr-2" />
                        Chat on WhatsApp
                    </Button>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Truck className="w-4 h-4 text-gray-400" />
                            <span>Express Shipping (3-5 days)</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                            <PackageCheck className="w-4 h-4 text-gray-400" />
                            <span>Genuine OEM Parts</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                            <RotateCcw className="w-4 h-4 text-gray-400" />
                            <span>30-Day Returns</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Shield className="w-4 h-4 text-gray-400" />
                            <span>Secure Checkout</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Shield({ className }: { className?: string }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        </svg>
    )
}
