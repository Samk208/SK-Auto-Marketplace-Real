"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useTranslation } from "@/hooks/useTranslation"
import { Award, Car, Heart, MapPin, MessageSquare, Shield, TrendingUp, Users } from "lucide-react"

export function FeaturesSection() {
    const { t } = useTranslation()

    const features = [
        {
            icon: Car,
            title: t("features.inventory_title"),
            description: t("features.inventory_desc"),
        },
        {
            icon: Shield,
            title: t("features.history_title"),
            description: t("features.history_desc"),
        },
        {
            icon: TrendingUp,
            title: t("features.insights_title"),
            description: t("features.insights_desc"),
        },
        {
            icon: MessageSquare,
            title: t("features.communication_title"),
            description: t("features.communication_desc"),
        },
        {
            icon: Heart,
            title: t("features.favorites_title"),
            description: t("features.favorites_desc"),
        },
        {
            icon: Award,
            title: t("features.quality_title"),
            description: t("features.quality_desc"),
        },
        {
            icon: MapPin,
            title: t("features.coverage_title"),
            description: t("features.coverage_desc"),
        },
        {
            icon: Users,
            title: t("features.support_title"),
            description: t("features.support_desc"),
        },
    ]

    return (
        <section className="py-16 md:py-20 bg-primary-soft/20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-14">
                    <h2 className="text-3xl md:text-4xl font-bold mb-3">{t("features.title")}</h2>
                    <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                        {t("features.subtitle")}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <Card
                            key={index}
                            className="border border-border-subtle shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 bg-surface"
                        >
                            <CardContent className="p-5">
                                <div className="w-11 h-11 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mb-3.5 shadow-sm">
                                    <feature.icon className="h-5 w-5 text-white" />
                                </div>
                                <h3 className="text-base font-bold mb-2">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
