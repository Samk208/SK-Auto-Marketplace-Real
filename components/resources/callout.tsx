"use client"

import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import {
    AlertTriangle,
    CheckSquare,
    Info,
    Lightbulb,
    Shield,
    Sparkles
} from "lucide-react"
import * as React from "react"

const calloutVariants = cva(
    "relative flex gap-4 rounded-xl border p-5 my-6 transition-all duration-300",
    {
        variants: {
            variant: {
                tip: "bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 dark:from-emerald-950/50 dark:to-teal-950/50 dark:border-emerald-800",
                warning: "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 dark:from-amber-950/50 dark:to-orange-950/50 dark:border-amber-800",
                checklist: "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 dark:from-blue-950/50 dark:to-indigo-950/50 dark:border-blue-800",
                info: "bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200 dark:from-slate-950/50 dark:to-gray-950/50 dark:border-slate-800",
                pro: "bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200 dark:from-violet-950/50 dark:to-purple-950/50 dark:border-violet-800",
                safety: "bg-gradient-to-br from-red-50 to-rose-50 border-red-200 dark:from-red-950/50 dark:to-rose-950/50 dark:border-red-800",
            },
        },
        defaultVariants: {
            variant: "info",
        },
    }
)

const iconVariants = cva(
    "shrink-0 mt-0.5",
    {
        variants: {
            variant: {
                tip: "text-emerald-600 dark:text-emerald-400",
                warning: "text-amber-600 dark:text-amber-400",
                checklist: "text-blue-600 dark:text-blue-400",
                info: "text-slate-600 dark:text-slate-400",
                pro: "text-violet-600 dark:text-violet-400",
                safety: "text-red-600 dark:text-red-400",
            },
        },
        defaultVariants: {
            variant: "info",
        },
    }
)

const titleVariants = cva(
    "font-semibold text-sm uppercase tracking-wide mb-2",
    {
        variants: {
            variant: {
                tip: "text-emerald-800 dark:text-emerald-200",
                warning: "text-amber-800 dark:text-amber-200",
                checklist: "text-blue-800 dark:text-blue-200",
                info: "text-slate-800 dark:text-slate-200",
                pro: "text-violet-800 dark:text-violet-200",
                safety: "text-red-800 dark:text-red-200",
            },
        },
        defaultVariants: {
            variant: "info",
        },
    }
)

const icons = {
    tip: Lightbulb,
    warning: AlertTriangle,
    checklist: CheckSquare,
    info: Info,
    pro: Sparkles,
    safety: Shield,
}

const titles = {
    tip: "💡 Pro Tip",
    warning: "⚠️ Warning",
    checklist: "✅ Checklist",
    info: "ℹ️ Note",
    pro: "✨ Expert Advice",
    safety: "🛡️ Safety First",
}

interface CalloutProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof calloutVariants> {
    title?: string
    children: React.ReactNode
}

export function Callout({
    className,
    variant = "info",
    title,
    children,
    ...props
}: CalloutProps) {
    const Icon = icons[variant as keyof typeof icons] || Info
    const defaultTitle = titles[variant as keyof typeof titles] || "Note"

    return (
        <div
            className={cn(calloutVariants({ variant }), className)}
            {...props}
        >
            <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center",
                variant === "tip" && "bg-emerald-100 dark:bg-emerald-900/50",
                variant === "warning" && "bg-amber-100 dark:bg-amber-900/50",
                variant === "checklist" && "bg-blue-100 dark:bg-blue-900/50",
                variant === "info" && "bg-slate-100 dark:bg-slate-900/50",
                variant === "pro" && "bg-violet-100 dark:bg-violet-900/50",
                variant === "safety" && "bg-red-100 dark:bg-red-900/50"
            )}>
                <Icon className={cn("h-5 w-5", iconVariants({ variant }))} />
            </div>
            <div className="flex-1 min-w-0">
                <div className={cn(titleVariants({ variant }))}>
                    {title || defaultTitle}
                </div>
                <div className="text-sm text-muted-foreground leading-relaxed">
                    {children}
                </div>
            </div>
        </div>
    )
}

// Checklist Item component
interface ChecklistItemProps {
    children: React.ReactNode
    checked?: boolean
}

export function ChecklistItem({ children, checked = false }: ChecklistItemProps) {
    return (
        <div className="flex items-start gap-3 py-1.5">
            <div className={cn(
                "h-5 w-5 rounded flex items-center justify-center shrink-0 mt-0.5 transition-colors",
                checked
                    ? "bg-emerald-500 text-white"
                    : "border-2 border-slate-300 dark:border-slate-600"
            )}>
                {checked && (
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </div>
            <span className="text-sm">{children}</span>
        </div>
    )
}
