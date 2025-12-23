"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Part } from "@/lib/parts"

interface PartSpecsProps {
    part: Part
}

export function PartSpecs({ part }: PartSpecsProps) {
    return (
        <div className="mt-8 border-t pt-8">
            <Tabs defaultValue="specs" className="w-full">
                <TabsList className="mb-6 w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-6">
                    <TabsTrigger
                        value="specs"
                        className="rounded-none border-b-2 border-transparent px-0 py-2 data-[state=active]:border-[#2558fa] data-[state=active]:text-[#2558fa]"
                    >
                        Specifications
                    </TabsTrigger>
                    <TabsTrigger
                        value="compatibility"
                        className="rounded-none border-b-2 border-transparent px-0 py-2 data-[state=active]:border-[#2558fa] data-[state=active]:text-[#2558fa]"
                    >
                        Compatibility
                    </TabsTrigger>
                    <TabsTrigger
                        value="description"
                        className="rounded-none border-b-2 border-transparent px-0 py-2 data-[state=active]:border-[#2558fa] data-[state=active]:text-[#2558fa]"
                    >
                        Description
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="specs" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-500">Part Number</span>
                            <span className="font-medium">{part.partNumber}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-500">Brand</span>
                            <span className="font-medium">{part.brand}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-500">Condition</span>
                            <span className="font-medium">{part.condition}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-500">Category</span>
                            <span className="font-medium">{part.category}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-500">Origin</span>
                            <span className="font-medium">South Korea</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-500">Warranty</span>
                            <span className="font-medium">12 Months / 20,000km</span>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="compatibility" className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Fits the following vehicles:</h4>
                        <p className="text-gray-700">{part.compatibleVehicles.join(', ') || 'Universal Fit'}</p>
                        <p className="text-sm text-gray-500 mt-4">
                            * Note: Compatibility list is for reference only. Please verify with VIN before purchase.
                        </p>
                    </div>
                </TabsContent>

                <TabsContent value="description" className="space-y-4">
                    <div className="prose max-w-none text-gray-700">
                        <p>
                            Genuine {part.brand} {part.name} for Korean vehicles. Manufactured to original equipment specifications for reliable performance and perfect fit.
                        </p>
                        <ul className="list-disc pl-5 space-y-1 mt-4">
                            <li>Direct replacement for original part</li>
                            <li>Engineered for durability and longevity</li>
                            <li>Meets or exceeds OEM standards</li>
                            <li>Includes all necessary hardware (if applicable)</li>
                        </ul>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
