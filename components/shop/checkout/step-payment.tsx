"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { CreditCard, Landmark, Smartphone } from "lucide-react"
import { CheckoutState } from "./types"

interface StepPaymentProps {
    state: CheckoutState
    onUpdate: (updates: Partial<CheckoutState>) => void
    onNext: () => void
    onBack: () => void
}

export function StepPayment({ state, onUpdate, onNext, onBack }: StepPaymentProps) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onNext()
    }

    const PaymentOption = ({ id, icon: Icon, title, desc }: any) => (
        <div
            onClick={() => onUpdate({ paymentMethod: id })}
            className={cn(
                "relative border-2 rounded-xl p-4 cursor-pointer transition-all",
                state.paymentMethod === id ? "border-[#2558fa] bg-blue-50/50" : "border-gray-200 hover:border-gray-300"
            )}
        >
            <div className="flex gap-4 items-center">
                <div className={cn(
                    "w-6 h-6 rounded-full border flex items-center justify-center",
                    state.paymentMethod === id ? "border-[#2558fa]" : "border-gray-300"
                )}>
                    {state.paymentMethod === id && <div className="w-3 h-3 bg-[#2558fa] rounded-full" />}
                </div>
                <div className="w-10 h-10 rounded-full bg-white border flex items-center justify-center text-gray-600">
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900">{title}</h3>
                    <p className="text-sm text-gray-500">{desc}</p>
                </div>
            </div>
        </div>
    )

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-xl font-semibold">Payment Method</h2>
                <p className="text-sm text-gray-500">
                    All transactions are secure and encrypted.
                </p>
            </div>

            <div className="space-y-3">
                <PaymentOption
                    id="card"
                    icon={CreditCard}
                    title="Credit/Debit Card"
                    desc="Visa, Mastercard, Amex via Stripe"
                />

                {state.paymentMethod === 'card' && (
                    <div className="p-4 bg-gray-50 border rounded-xl animate-in slide-in-from-top-2 fade-in duration-200">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Card Number</Label>
                                <div className="relative">
                                    <Input placeholder="0000 0000 0000 0000" className="pl-10" />
                                    <CreditCard className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Expiry</Label>
                                    <Input placeholder="MM / YY" />
                                </div>
                                <div className="space-y-2">
                                    <Label>CVV</Label>
                                    <Input placeholder="123" />
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="save-card" />
                                <Label htmlFor="save-card" className="font-normal text-sm">Save card for future purchases</Label>
                            </div>
                        </div>
                    </div>
                )}

                <PaymentOption
                    id="mpesa"
                    icon={Smartphone}
                    title="M-Pesa / Mobile Money"
                    desc="Instant payment via phone"
                />

                {state.paymentMethod === 'mpesa' && (
                    <div className="p-4 bg-gray-50 border rounded-xl animate-in slide-in-from-top-2 fade-in duration-200">
                        <div className="space-y-4">
                            <Label>M-Pesa Phone Number</Label>
                            <div className="flex gap-2">
                                <div className="h-10 px-3 border rounded-md bg-white flex items-center text-sm font-medium">🇰🇪 +254</div>
                                <Input placeholder="712 345 678" className="flex-1" />
                            </div>
                            <p className="text-xs text-gray-500">
                                Prompt will be sent to your phone. Enter PIN to complete.
                            </p>
                        </div>
                    </div>
                )}

                <PaymentOption
                    id="bank"
                    icon={Landmark}
                    title="Bank Transfer"
                    desc="Manual transfer (2-3 days)"
                />
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onBack} className="h-12 text-base sm:w-1/3">
                    Back
                </Button>
                <Button type="submit" className="h-12 bg-[#2558fa] hover:bg-[#1a3ec1] text-base flex-1">
                    Review Order
                </Button>
            </div>
        </form>
    )
}
