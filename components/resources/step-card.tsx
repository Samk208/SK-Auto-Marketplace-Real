"use client"

import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"
import * as React from "react"

interface StepCardProps {
    stepNumber: number
    title: string
    description?: string
    icon?: LucideIcon
    children: React.ReactNode
    className?: string
}

export function StepCard({
    stepNumber,
    title,
    description,
    icon: Icon,
    children,
    className,
}: StepCardProps) {
    return (
        <div className={cn("relative", className)}>
            {/* Timeline connector */}
            <div className="absolute left-7 top-16 bottom-0 w-0.5 bg-gradient-to-b from-primary/40 to-transparent hidden md:block" />

            <div className="flex gap-4 md:gap-6">
                {/* Step number badge */}
                <div className="shrink-0 relative">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/25 ring-4 ring-primary/10">
                        <span className="text-xl font-bold text-primary-foreground">{stepNumber}</span>
                    </div>
                    {Icon && (
                        <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-white dark:bg-slate-900 border-2 border-primary flex items-center justify-center shadow-sm">
                            <Icon className="h-3 w-3 text-primary" />
                        </div>
                    )}
                </div>

                {/* Step content */}
                <div className="flex-1 pb-10">
                    <div className="bg-card rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                        {/* Header */}
                        <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-900/50 dark:to-transparent border-b">
                            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-1">
                                {title}
                            </h2>
                            {description && (
                                <p className="text-sm text-muted-foreground">{description}</p>
                            )}
                        </div>
                        {/* Content */}
                        <div className="px-6 py-5">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Feature bullet component for within steps
interface FeatureBulletProps {
    icon?: React.ReactNode
    title: string
    description: string
    highlight?: boolean
}

export function FeatureBullet({ icon, title, description, highlight = false }: FeatureBulletProps) {
    return (
        <div className={cn(
            "flex gap-3 p-3 rounded-lg transition-colors",
            highlight
                ? "bg-primary/5 border border-primary/20"
                : "hover:bg-slate-50 dark:hover:bg-slate-900/50"
        )}>
            <div className="shrink-0 mt-0.5">
                {icon || (
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                )}
            </div>
            <div>
                <div className="font-medium text-sm text-foreground">{title}</div>
                <div className="text-sm text-muted-foreground">{description}</div>
            </div>
        </div>
    )
}

// Quick stat component
interface QuickStatProps {
    value: string
    label: string
    icon?: React.ReactNode
}

export function QuickStat({ value, label, icon }: QuickStatProps) {
    return (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/10">
            {icon && <div className="text-primary">{icon}</div>}
            <div>
                <div className="text-lg font-bold text-primary">{value}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
            </div>
        </div>
    )
}
