"use client"

import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronUp, Lock } from "lucide-react"
import { useState } from "react"
import { CheckoutState } from "./types"

interface CheckoutSummaryProps {
    state: CheckoutState
    collapsible?: boolean
}

export function CheckoutSummary({ state, collapsible = false }: CheckoutSummaryProps) {
    const [isOpen, setIsOpen] = useState(!collapsible)

    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    // Dynamic Calculation
    const shippingCost = state.shippingMethod === 'express' ? 25000 : 15000 // In Naira/Local currency approx
    const estimatedCustoms = Math.round(subtotal * 0.15) // Mock 15% customs

    // Currency Conversion (Mock: 1 KRW = 0.55 NGN approx)
    const exchangeRate = 0.55
    const subtotalNGN = Math.round(subtotal * exchangeRate)
    const totalNGN = subtotalNGN + shippingCost + estimatedCustoms

    if (state.step === 'confirmation') return null;

    return (
        <div className={cn(
            "bg-slate-50 border-y md:border md:rounded-xl overflow-hidden shadow-sm",
            collapsible && "fixed bottom-0 left-0 right-0 z-40 md:static md:z-auto"
        )}>
            {/* Header / Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={!collapsible}
                className={cn(
                    "w-full flex items-center justify-between p-4 bg-white md:bg-slate-50",
                    !isOpen && "border-t md:border-t-0"
                )}
            >
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">Order Summary</span>
                    {collapsible && (
                        isOpen ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronUp className="w-4 h-4 text-slate-500" />
                    )}
                </div>
                <div className="flex flex-col items-end">
                    <span className="font-bold text-lg text-slate-900">₦{totalNGN.toLocaleString()}</span>
                    {collapsible && !isOpen && <span className="text-xs text-slate-500">Tap to details</span>}
                </div>
            </button>

            {/* Content */}
            <div className={cn(
                "transition-all duration-300 ease-in-out",
                isOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0 md:max-h-none md:opacity-100"
            )}>
                <div className="p-4 pt-0 md:pt-4 space-y-4">
                    {/* Cart Items List */}
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                        {state.cart.map((item) => (
                            <div key={item.id} className="flex gap-3">
                                <div className="w-12 h-12 bg-white rounded border flex items-center justify-center shrink-0">
                                    {/* Placeholder image logic */}
                                    <span className="text-xs text-gray-400">Img</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900 truncate">{item.name}</p>
                                    <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                                </div>
                                <p className="text-sm font-medium text-slate-900">₩{(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>

                    <Separator />

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-600">Subtotal (KRW)</span>
                            <span className="font-medium">₩{subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-500">
                            <span>Approx. in NGN</span>
                            <span>~ ₦{subtotalNGN.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-600">Shipping</span>
                            <span className="font-medium">
                                {state.step === 'cart' || state.step === 'contact' || state.step === 'shipping'
                                    ? 'Calculated next step'
                                    : `₦${shippingCost.toLocaleString()}`
                                }
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-600">Est. Customs</span>
                            <span className="font-medium">₦{estimatedCustoms.toLocaleString()}</span>
                        </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between items-baseline">
                        <span className="font-bold text-slate-900">Total</span>
                        <div className="text-right">
                            <span className="block font-bold text-xl text-[#2558fa]">₦{totalNGN.toLocaleString()}</span>
                            <span className="text-xs text-slate-500">(~₩{(subtotal + (shippingCost / exchangeRate)).toLocaleString()})</span>
                        </div>
                    </div>

                    <div className="bg-blue-50 text-blue-800 text-xs p-3 rounded-lg flex items-start gap-2">
                        <Lock className="w-3 h-3 mt-0.5 shrink-0" />
                        <span>Your payment information is encrypted and secure.</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
