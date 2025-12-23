"use client"

import { LanguageBadge } from "@/components/language-badge"
import { RegionBadge } from "@/components/region-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UserRole } from "@/lib/role-context"
import { Car, Users } from "lucide-react"

import { useTranslation } from "@/hooks/useTranslation"

interface HeroSectionProps {
    userRole: UserRole
    onScrollTo: (sectionId: string) => void
}

export function HeroSection({ userRole, onScrollTo }: HeroSectionProps) {
    const { t } = useTranslation()

    return (
        <section className="relative overflow-hidden py-16 md:py-24 lg:py-28 bg-[#f8fafc] dark:bg-slate-950">
            {/* Brand Pattern Background */}
            <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}
            />
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-blob" />
                <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/8 rounded-full blur-3xl animate-blob animation-delay-2000" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <Badge
                        variant="secondary"
                        className="mb-6 px-3 py-1.5 text-xs font-medium border border-border-subtle rounded-full shadow-sm"
                    >
                        Korea's Premier Car Marketplace
                    </Badge>
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 text-[#0f172a] dark:text-white leading-[1.1] tracking-tight max-w-4xl mx-auto">
                        {t("homepage.hero_heading")} <span className="text-[#2558fa]">Today</span>
                    </h1>
                    <p className="text-base md:text-lg text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
                        {t("homepage.hero_subheading")}
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center mb-6">
                        <LanguageBadge languages={["English", "한국어", "Français"]} size="md" />
                        <RegionBadge region="Ships to 15+ African Countries" size="md" />
                    </div>
                    <div className="flex flex-wrap gap-3 justify-center mb-8">
                        <Button
                            size="lg"
                            className="px-8 h-12 text-base shadow-xl shadow-blue-600/20 hover:shadow-2xl hover:shadow-blue-600/30 hover:-translate-y-0.5 transition-all duration-300 bg-[#2558fa] hover:bg-[#1a3ec1] text-white border-0"
                            onClick={() => onScrollTo(userRole === "seller" ? "dealers" : "browse")}
                        >
                            <Car className="mr-2 h-5 w-5" />
                            {userRole === "seller" ? "Start Listing" : "Browse Cars"}
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="px-8 h-12 text-base bg-surface hover:bg-primary-soft/50 border-border shadow-sm hover:shadow-md transition-all duration-300"
                            onClick={() => onScrollTo("dealers")}
                        >
                            <Users className="mr-2 h-5 w-5" />
                            For Dealers
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-4 justify-center items-center text-sm">
                        <div className="flex items-center gap-2 bg-surface border border-border-subtle px-4 py-2 rounded-full shadow-sm">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="font-medium text-foreground/90">10,000+ Verified Listings</span>
                        </div>
                        <div className="flex items-center gap-2 bg-surface border border-border-subtle px-4 py-2 rounded-full shadow-sm">
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            <span className="font-medium text-foreground/90">Trusted Dealer Network</span>
                        </div>
                        <div className="flex items-center gap-2 bg-surface border border-border-subtle px-4 py-2 rounded-full shadow-sm">
                            <div className="w-2 h-2 bg-purple-500 rounded-full" />
                            <span className="font-medium text-foreground/90">Secure Transactions</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
