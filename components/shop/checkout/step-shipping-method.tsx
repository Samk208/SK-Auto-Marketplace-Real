"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Truck, Zap } from "lucide-react"
import { CheckoutState } from "./types"

interface StepShippingMethodProps {
    state: CheckoutState
    onUpdate: (updates: Partial<CheckoutState>) => void
    onNext: () => void
    onBack: () => void
}

export function StepShippingMethod({ state, onUpdate, onNext, onBack }: StepShippingMethodProps) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onNext()
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-xl font-semibold">Shipping Method</h2>
                <p className="text-sm text-gray-500">
                    Choose how fast you want your order.
                </p>
            </div>

            <div className="space-y-4">
                {/* Standard */}
                <div
                    onClick={() => onUpdate({ shippingMethod: 'standard' })}
                    className={cn(
                        "relative border-2 rounded-xl p-4 cursor-pointer transition-all",
                        state.shippingMethod === 'standard' ? "border-[#2558fa] bg-blue-50/50" : "border-gray-200 hover:border-gray-300"
                    )}
                >
                    <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                            <div className={cn(
                                "w-6 h-6 rounded-full border flex items-center justify-center mt-0.5",
                                state.shippingMethod === 'standard' ? "border-[#2558fa]" : "border-gray-300"
                            )}>
                                {state.shippingMethod === 'standard' && <div className="w-3 h-3 bg-[#2558fa] rounded-full" />}
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                    Standard Shipping
                                    <Truck className="w-4 h-4 text-gray-500" />
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">7-10 business days</p>
                                <p className="text-xs text-green-600 mt-2 font-medium">Tracking Included</p>
                            </div>
                        </div>
                        <span className="font-bold text-gray-900">₦15,000</span>
                    </div>
                </div>

                {/* Express */}
                <div
                    onClick={() => onUpdate({ shippingMethod: 'express' })}
                    className={cn(
                        "relative border-2 rounded-xl p-4 cursor-pointer transition-all",
                        state.shippingMethod === 'express' ? "border-[#2558fa] bg-blue-50/50" : "border-gray-200 hover:border-gray-300"
                    )}
                >
                    <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                            <div className={cn(
                                "w-6 h-6 rounded-full border flex items-center justify-center mt-0.5",
                                state.shippingMethod === 'express' ? "border-[#2558fa]" : "border-gray-300"
                            )}>
                                {state.shippingMethod === 'express' && <div className="w-3 h-3 bg-[#2558fa] rounded-full" />}
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                    Express Shipping
                                    <Zap className="w-4 h-4 text-orange-500 fill-orange-500" />
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">3-5 business days</p>
                                <p className="text-xs text-gray-500 mt-2">Priority Handling • DHL/FedEx</p>
                            </div>
                        </div>
                        <span className="font-bold text-gray-900">₦25,000</span>
                    </div>
                </div>
            </div>

            <div className="bg-amber-50 rounded-lg p-4 text-sm text-amber-800 border border-amber-100">
                💡 Tip: Express shipping recommended for urgent repairs.
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onBack} className="h-12 text-base sm:w-1/3">
                    Back
                </Button>
                <Button type="submit" className="h-12 bg-[#2558fa] hover:bg-[#1a3ec1] text-base flex-1">
                    Continue to Payment
                </Button>
            </div>
        </form>
    )
}
