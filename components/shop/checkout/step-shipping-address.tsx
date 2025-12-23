"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckoutState } from "./types"

interface StepShippingAddressProps {
    state: CheckoutState
    onUpdate: (updates: Partial<CheckoutState>) => void
    onNext: () => void
    onBack: () => void
}

export function StepShippingAddress({ state, onUpdate, onNext, onBack }: StepShippingAddressProps) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onNext()
    }

    const updateAddress = (field: keyof CheckoutState['shippingAddress'], value: string) => {
        onUpdate({
            shippingAddress: { ...state.shippingAddress, [field]: value }
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-xl font-semibold">Shipping Address</h2>
                <p className="text-sm text-gray-500">
                    Where should we deliver your parts?
                </p>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                            id="firstName"
                            value={state.shippingAddress.firstName}
                            onChange={(e) => updateAddress('firstName', e.target.value)}
                            required
                            className="h-12"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                            id="lastName"
                            value={state.shippingAddress.lastName}
                            onChange={(e) => updateAddress('lastName', e.target.value)}
                            required
                            className="h-12"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select
                        defaultValue={state.shippingAddress.country}
                        onValueChange={(val) => updateAddress('country', val)}
                    >
                        <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select Country" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Nigeria">🇳🇬 Nigeria</SelectItem>
                            <SelectItem value="Ghana">🇬🇭 Ghana</SelectItem>
                            <SelectItem value="Kenya">🇰🇪 Kenya</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="address1">Street Address</Label>
                    <Input
                        id="address1"
                        placeholder="123 Main St"
                        value={state.shippingAddress.address1}
                        onChange={(e) => updateAddress('address1', e.target.value)}
                        required
                        className="h-12"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                            id="city"
                            value={state.shippingAddress.city}
                            onChange={(e) => updateAddress('city', e.target.value)}
                            required
                            className="h-12"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="state">State/Region</Label>
                        <Input
                            id="state"
                            value={state.shippingAddress.state}
                            onChange={(e) => updateAddress('state', e.target.value)}
                            required
                            className="h-12"
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                    <Checkbox id="save-address" />
                    <Label htmlFor="save-address" className="font-normal text-slate-600">
                        Save this address for next time
                    </Label>
                </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onBack} className="h-12 text-base sm:w-1/3">
                    Back
                </Button>
                <Button type="submit" className="h-12 bg-[#2558fa] hover:bg-[#1a3ec1] text-base flex-1">
                    Continue to Shipping Method
                </Button>
            </div>
        </form>
    )
}
