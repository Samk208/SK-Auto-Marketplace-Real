"use client"

import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import { CheckoutStep } from "./types"

interface CheckoutStepsProps {
    currentStep: CheckoutStep
}

const STEPS: { id: CheckoutStep; label: string }[] = [
    { id: "cart", label: "Cart" },
    { id: "contact", label: "Contact" },
    { id: "shipping", label: "Address" },
    { id: "delivery", label: "Shipping" },
    { id: "payment", label: "Payment" },
    { id: "review", label: "Review" },
]

export function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
    // We don't show steps on confirmation page or if step is not in list
    const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep)
    if (currentStepIndex === -1) return null

    const progressPercent = Math.round(((currentStepIndex) / (STEPS.length - 1)) * 100)

    return (
        <div className="sticky top-0 z-30 bg-white border-b shadow-sm">
            {/* Desktop Stepper */}
            <div className="hidden md:flex container items-center justify-between py-4 text-sm">
                {STEPS.map((step, index) => {
                    const isCompleted = index < currentStepIndex
                    const isCurrent = step.id === currentStep

                    return (
                        <div key={step.id} className="flex items-center">
                            <div
                                className={cn(
                                    "flex items-center gap-2",
                                    isCompleted ? "text-green-600" : isCurrent ? "text-blue-600 font-bold" : "text-gray-400"
                                )}
                            >
                                <div
                                    className={cn(
                                        "w-6 h-6 rounded-full flex items-center justify-center text-xs border transition-colors",
                                        isCompleted ? "bg-green-100 border-green-200" : isCurrent ? "bg-blue-100 border-blue-200" : "bg-gray-50 border-gray-200"
                                    )}
                                >
                                    {isCompleted ? <Check className="w-3 h-3" /> : index + 1}
                                </div>
                                <span>{step.label}</span>
                            </div>
                            {index < STEPS.length - 1 && (
                                <div className="mx-4 h-[1px] w-8 bg-gray-200" />
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Mobile Progress Bar */}
            <div className="md:hidden">
                <div className="px-4 py-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">
                        Step {currentStepIndex + 1} of {STEPS.length}: {STEPS[currentStepIndex].label}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                        {progressPercent}%
                    </span>
                </div>
                <div className="h-1 w-full bg-gray-100">
                    <div
                        className="h-full bg-[#2558fa] transition-all duration-300 ease-out"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </div>
        </div>
    )
}
