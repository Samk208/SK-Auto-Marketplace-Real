"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MessageCircle } from "lucide-react"
import { CheckoutState } from "./types"

interface StepContactProps {
    state: CheckoutState
    onUpdate: (updates: Partial<CheckoutState>) => void
    onNext: () => void
    onBack: () => void
}

export function StepContact({ state, onUpdate, onNext, onBack }: StepContactProps) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onNext()
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-xl font-semibold">Contact Information</h2>
                <p className="text-sm text-gray-500">
                    We'll use this to send order updates. No account needed.
                </p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="user@example.com"
                        value={state.contact.email}
                        onChange={(e) => onUpdate({ contact: { ...state.contact, email: e.target.value } })}
                        required
                        className="h-12"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="flex gap-2">
                        <select
                            className="h-12 border rounded-md px-3 bg-white text-sm w-24 shrink-0"
                            value={state.contact.countryCode}
                            onChange={(e) => onUpdate({ contact: { ...state.contact, countryCode: e.target.value } })}
                        >
                            <option value="+234">🇳🇬 +234</option>
                            <option value="+233">🇬🇭 +233</option>
                            <option value="+254">🇰🇪 +254</option>
                        </select>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="812 345 6789"
                            value={state.contact.phone}
                            onChange={(e) => onUpdate({ contact: { ...state.contact, phone: e.target.value } })}
                            required
                            className="h-12 flex-1"
                        />
                    </div>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-green-50 border border-green-100 rounded-lg">
                    <Checkbox
                        id="whatsapp"
                        checked={state.contact.whatsapp}
                        onCheckedChange={(checked) => onUpdate({ contact: { ...state.contact, whatsapp: checked === true } })}
                    />
                    <div className="space-y-1 leading-none">
                        <Label htmlFor="whatsapp" className="flex items-center text-green-800 font-medium cursor-pointer">
                            <MessageCircle className="w-4 h-4 mr-2 text-green-600" />
                            Send updates via WhatsApp
                        </Label>
                        <p className="text-sm text-green-700">
                            Get tracking info and delivery photos directly to your phone.
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onBack} className="h-12 text-base sm:w-1/3">
                    Back
                </Button>
                <Button type="submit" className="h-12 bg-[#2558fa] hover:bg-[#1a3ec1] text-base flex-1">
                    Continue to Shipping
                </Button>
            </div>
        </form>
    )
}
