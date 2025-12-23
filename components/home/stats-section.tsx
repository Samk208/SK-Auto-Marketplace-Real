"use client"

import { useTranslation } from "@/hooks/useTranslation"

export function StatsSection() {
    const { t } = useTranslation()

    const stats = [
        { value: "10,000+", label: t("stats.active_listings"), sublabel: t("stats.updated_daily") },
        { value: "500+", label: t("stats.verified_dealers"), sublabel: t("stats.across_korea") },
        { value: "50,000+", label: t("stats.happy_customers"), sublabel: t("stats.and_counting") },
        { value: "₩45B+", label: t("stats.cars_sold"), sublabel: t("stats.this_year") },
    ]

    return (
        <section className="py-16 md:py-18 bg-gradient-to-r from-primary/8 via-accent/6 to-primary/8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {stats.map((stat, index) => (
                        <div key={index} className="space-y-1.5">
                            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                                {stat.value}
                            </div>
                            <div className="text-base font-semibold">{stat.label}</div>
                            <div className="text-sm text-muted-foreground">{stat.sublabel}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
