"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Check, Lock } from "lucide-react"
import { useState } from "react"
import { CheckoutState } from "./types"

interface StepReviewProps {
    state: CheckoutState
    onNext: () => void
    onBack: () => void
    onEditStep: (step: any) => void
}

export function StepReview({ state, onNext, onBack, onEditStep }: StepReviewProps) {
    const [isProcessing, setIsProcessing] = useState(false)

    const handlePlaceOrder = () => {
        setIsProcessing(true)
        // Simulate API call
        setTimeout(() => {
            setIsProcessing(false)
            onNext()
        }, 2000)
    }

    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const shippingCost = state.shippingMethod === 'express' ? 25000 : 15000
    const estimatedCustoms = Math.round(subtotal * 0.15)
    // Mock NGN calc again for consistency
    const exchangeRate = 0.55
    const subtotalNGN = Math.round(subtotal * exchangeRate)
    const totalNGN = subtotalNGN + shippingCost + estimatedCustoms

    const ReviewSection = ({ title, children, stepId }: any) => (
        <div className="bg-white rounded-xl border p-4 space-y-3">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">{title}</h3>
                <Button variant="link" size="sm" className="h-auto p-0 text-[#2558fa]" onClick={() => onEditStep(stepId)}>
                    Edit
                </Button>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
                {children}
            </div>
        </div>
    )

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-xl font-semibold">Review Your Order</h2>
                <p className="text-sm text-gray-500">
                    Please verify your information before placing the order.
                </p>
            </div>

            <div className="space-y-4">
                <ReviewSection title="Contact Info" stepId="contact">
                    <p className="font-medium text-gray-900">{state.contact.email}</p>
                    <p>{state.contact.phone}</p>
                    {state.contact.whatsapp && (
                        <p className="text-green-600 flex items-center gap-1 text-xs mt-1">
                            <span className="bg-green-100 p-0.5 rounded-full"><Check className="w-2.5 h-2.5" /></span>
                            WhatsApp updates enabled
                        </p>
                    )}
                </ReviewSection>

                <ReviewSection title="Shipping Address" stepId="shipping">
                    <p className="font-medium text-gray-900">{state.shippingAddress.firstName} {state.shippingAddress.lastName}</p>
                    <p>{state.shippingAddress.address1}</p>
                    <p>{state.shippingAddress.city}, {state.shippingAddress.state} {state.shippingAddress.zip}</p>
                    <p>{state.shippingAddress.country}</p>
                </ReviewSection>

                <ReviewSection title="Shipping Method" stepId="delivery">
                    <p className="font-medium text-gray-900">
                        {state.shippingMethod === 'express' ? 'Express Shipping' : 'Standard Shipping'}
                    </p>
                    <p className="text-xs text-gray-500">
                        {state.shippingMethod === 'express' ? '3-5 business days' : '7-10 business days'}
                    </p>
                </ReviewSection>

                <ReviewSection title="Payment Method" stepId="payment">
                    <div className="flex items-center gap-2">
                        {state.paymentMethod === 'card' && "Credit/Debit Card"}
                        {state.paymentMethod === 'mpesa' && "M-Pesa"}
                        {state.paymentMethod === 'bank' && "Bank Transfer"}
                    </div>
                </ReviewSection>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₦{subtotalNGN.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">₦{shippingCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Est. Customs</span>
                    <span className="font-medium">₦{estimatedCustoms.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-end">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-bold text-xl text-[#2558fa]">₦{totalNGN.toLocaleString()}</span>
                </div>
            </div>

            <div className="flex items-start space-x-2">
                <Checkbox id="terms" defaultChecked className="mt-1" />
                <Label htmlFor="terms" className="font-normal text-sm text-gray-600 leading-snug">
                    I agree to the Terms of Service and Privacy Policy. I understand that customs duties are estimates.
                </Label>
            </div>

            <Button
                onClick={handlePlaceOrder}
                size="lg"
                className="w-full bg-[#2558fa] hover:bg-[#1a3ec1] h-14 text-lg shadow-lg shadow-blue-900/10"
                disabled={isProcessing}
            >
                {isProcessing ? (
                    <>Processing...</>
                ) : (
                    <div className="flex items-center gap-2">
                        <Lock className="w-5 h-5" />
                        Place Order - ₦{totalNGN.toLocaleString()}
                    </div>
                )}
            </Button>

            <div className="text-center">
                <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3" />
                    Your payment information is widely encrypted
                </p>
            </div>
        </div>
    )
}
