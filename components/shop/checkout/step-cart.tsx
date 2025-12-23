"use client"

import { Button } from "@/components/ui/button"
import { Minus, Plus, Trash2 } from "lucide-react"
import { CheckoutState } from "./types"

interface StepCartProps {
    state: CheckoutState
    onUpdate: (updates: Partial<CheckoutState>) => void
    onNext: () => void
}

export function StepCart({ state, onUpdate, onNext }: StepCartProps) {
    const updateQuantity = (id: string, delta: number) => {
        const newCart = state.cart.map(item => {
            if (item.id === id) {
                return { ...item, quantity: Math.max(1, item.quantity + delta) }
            }
            return item
        })
        onUpdate({ cart: newCart })
    }

    const removeItem = (id: string) => {
        const newCart = state.cart.filter(item => item.id !== id)
        onUpdate({ cart: newCart })
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Your Cart ({state.cart.length} items)</h2>
            </div>

            <div className="space-y-4">
                {state.cart.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 border rounded-xl bg-white shadow-sm">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                            {/* Image Placeholder */}
                            <span className="text-xs text-gray-400">Image</span>
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                                <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                                <p className="text-sm text-gray-500 font-mono">{item.partNumber}</p>
                            </div>

                            <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => updateQuantity(item.id, -1)}
                                        className="w-8 h-8 flex items-center justify-center border rounded-md hover:bg-gray-50"
                                        disabled={item.quantity <= 1}
                                    >
                                        <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, 1)}
                                        className="w-8 h-8 flex items-center justify-center border rounded-md hover:bg-gray-50"
                                    >
                                        <Plus className="w-3 h-3" />
                                    </button>
                                </div>
                                <span className="font-bold text-gray-900">₩{(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-500 self-start p-1"
                            aria-label="Remove item"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            <Button
                onClick={onNext}
                size="lg"
                className="w-full bg-[#2558fa] hover:bg-[#1a3ec1] h-12 text-base"
                disabled={state.cart.length === 0}
            >
                Continue to Checkout
            </Button>
        </div>
    )
}
