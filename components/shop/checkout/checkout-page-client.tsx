"use client"

import { useEffect, useState } from "react"
import { CheckoutSteps } from "./checkout-steps"
import { CheckoutSummary } from "./checkout-summary"
import { OrderConfirmation } from "./order-confirmation"
import { StepCart } from "./step-cart"
import { StepContact } from "./step-contact"
import { StepPayment } from "./step-payment"
import { StepReview } from "./step-review"
import { StepShippingAddress } from "./step-shipping-address"
import { StepShippingMethod } from "./step-shipping-method"
import { CheckoutState, CheckoutStep, INITIAL_CHECKOUT_STATE } from "./types"

export function CheckoutPageClient() {
    const [state, setState] = useState<CheckoutState>(INITIAL_CHECKOUT_STATE)
    const [isMounted, setIsMounted] = useState(false)

    // Hydration fix
    useEffect(() => {
        setIsMounted(true)
        // Load from local storage here if needed
    }, [])

    if (!isMounted) return null

    const updateState = (updates: Partial<CheckoutState>) => {
        setState(prev => ({ ...prev, ...updates }))
    }

    const navigateTo = (step: CheckoutStep) => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        updateState({ step })
    }

    const renderStep = () => {
        switch (state.step) {
            case "cart":
                return <StepCart
                    state={state}
                    onUpdate={updateState}
                    onNext={() => navigateTo('contact')}
                />
            case "contact":
                return <StepContact
                    state={state}
                    onUpdate={updateState}
                    onNext={() => navigateTo('shipping')}
                    onBack={() => navigateTo('cart')}
                />
            case "shipping":
                return <StepShippingAddress
                    state={state}
                    onUpdate={updateState}
                    onNext={() => navigateTo('delivery')}
                    onBack={() => navigateTo('contact')}
                />
            case "delivery":
                return <StepShippingMethod
                    state={state}
                    onUpdate={updateState}
                    onNext={() => navigateTo('payment')}
                    onBack={() => navigateTo('shipping')}
                />
            case "payment":
                return <StepPayment
                    state={state}
                    onUpdate={updateState}
                    onNext={() => navigateTo('review')}
                    onBack={() => navigateTo('delivery')}
                />
            case "review":
                return <StepReview
                    state={state}
                    onNext={() => navigateTo('confirmation')}
                    onBack={() => navigateTo('payment')}
                    onEditStep={(step) => navigateTo(step)}
                />
            case "confirmation":
                return <OrderConfirmation />
            default:
                return null
        }
    }

    return (
        <div className="min-h-screen bg-[#F9FAFB] pb-24">
            {/* Hide main header on checkout for distraction-free, or keep simple version */}
            <div className="bg-white border-b py-4">
                <div className="container flex items-center justify-center">
                    <h1 className="text-xl font-bold tracking-tight text-[#2558fa]">SK AutoSphere <span className="text-slate-900 font-normal ml-1">Secure Checkout</span></h1>
                </div>
            </div>

            <CheckoutSteps currentStep={state.step} />

            <div className="container max-w-5xl py-8 px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-7 order-2 lg:order-1">
                        {renderStep()}
                    </div>

                    {/* Sidebar Summary */}
                    <div className="lg:col-span-5 order-1 lg:order-2">
                        <div className="sticky top-24">
                            <CheckoutSummary state={state} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Summary Logic */}
            <div className="lg:hidden">
                <CheckoutSummary state={state} collapsible={true} />
            </div>
        </div>
    )
}
