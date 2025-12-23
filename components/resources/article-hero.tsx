"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowLeft, Calendar, Clock, User } from "lucide-react"
import Link from "next/link"
import * as React from "react"

interface ArticleHeroProps {
    title: string
    subtitle: string
    category?: string
    readTime?: string
    date?: string
    author?: string
    backLink?: string
    backLabel?: string
    badges?: string[]
    gradient?: "blue" | "purple" | "emerald" | "amber" | "green" | "red" | "orange" | "indigo" | "pink"
    children?: React.ReactNode
}

const gradients = {
    blue: "from-blue-600 via-indigo-600 to-violet-600",
    purple: "from-violet-600 via-purple-600 to-fuchsia-600",
    emerald: "from-emerald-600 via-teal-600 to-cyan-600",
    amber: "from-amber-500 via-orange-500 to-red-500",
    green: "from-green-600 via-emerald-600 to-teal-600",
    red: "from-red-600 via-orange-600 to-amber-600",
    orange: "from-orange-500 via-amber-500 to-yellow-500",
    indigo: "from-indigo-600 via-violet-600 to-purple-600",
    pink: "from-pink-600 via-rose-600 to-red-600",
}

const overlayGradients = {
    blue: "from-blue-950/90 via-indigo-950/80 to-violet-950/70",
    purple: "from-violet-950/90 via-purple-950/80 to-fuchsia-950/70",
    emerald: "from-emerald-950/90 via-teal-950/80 to-cyan-950/70",
    amber: "from-amber-950/90 via-orange-950/80 to-red-950/70",
    green: "from-green-950/90 via-emerald-950/80 to-teal-950/70",
    red: "from-red-950/90 via-orange-950/80 to-amber-950/70",
    orange: "from-orange-950/90 via-amber-950/80 to-yellow-950/70",
    indigo: "from-indigo-950/90 via-violet-950/80 to-purple-950/70",
    pink: "from-pink-950/90 via-rose-950/80 to-red-950/70",
}

export function ArticleHero({
    title,
    subtitle,
    category,
    readTime,
    date,
    author,
    backLink = "/resources",
    backLabel = "Back to Resources",
    badges = [],
    gradient = "blue",
    children,
}: ArticleHeroProps) {
    return (
        <div className="relative overflow-hidden">
            {/* Background gradient */}
            <div className={cn(
                "absolute inset-0 bg-gradient-to-br",
                gradients[gradient]
            )} />

            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-white/5 to-transparent rounded-full blur-3xl" />
                {/* Grid pattern overlay */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />
            </div>

            <div className="relative container py-8 md:py-12">
                {/* Back button */}
                <Button
                    variant="ghost"
                    asChild
                    className="mb-6 text-white/80 hover:text-white hover:bg-white/10 -ml-4"
                >
                    <Link href={backLink}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        {backLabel}
                    </Link>
                </Button>

                <div className="max-w-4xl">
                    {/* Category and badges */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        {category && (
                            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                                {category}
                            </Badge>
                        )}
                        {badges.map((badge, index) => (
                            <Badge
                                key={index}
                                variant="outline"
                                className="border-white/30 text-white/90 bg-white/5"
                            >
                                {badge}
                            </Badge>
                        ))}
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                        {title}
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg md:text-xl text-white/80 mb-6 max-w-2xl leading-relaxed">
                        {subtitle}
                    </p>

                    {/* Meta info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
                        {readTime && (
                            <div className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4" />
                                <span>{readTime}</span>
                            </div>
                        )}
                        {date && (
                            <div className="flex items-center gap-1.5">
                                <Calendar className="h-4 w-4" />
                                <span>{date}</span>
                            </div>
                        )}
                        {author && (
                            <div className="flex items-center gap-1.5">
                                <User className="h-4 w-4" />
                                <span>{author}</span>
                            </div>
                        )}
                    </div>

                    {/* Optional children content */}
                    {children && (
                        <div className="mt-6">
                            {children}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// Table of contents component
interface TocItem {
    id: string
    title: string
    number?: number
}

interface TableOfContentsProps {
    items: TocItem[]
    className?: string
}

export function TableOfContents({ items, className }: TableOfContentsProps) {
    return (
        <div className={cn(
            "bg-card rounded-xl border shadow-sm overflow-hidden",
            className
        )}>
            <div className="px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border-b">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                    📖 Quick Navigation
                </h3>
            </div>
            <div className="p-4">
                <nav className="space-y-1">
                    {items.map((item, index) => (
                        <a
                            key={item.id}
                            href={`#${item.id}`}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors group"
                        >
                            {item.number !== undefined && (
                                <span className="w-6 h-6 rounded-md bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    {item.number}
                                </span>
                            )}
                            <span className="flex-1">{item.title}</span>
                        </a>
                    ))}
                </nav>
            </div>
        </div>
    )
}
