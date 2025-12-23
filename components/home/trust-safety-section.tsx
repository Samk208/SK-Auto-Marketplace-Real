"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useTranslation } from "@/hooks/useTranslation"
import { Award, Shield, Users } from "lucide-react"

export function TrustSafetySection() {
    const { t } = useTranslation()

    return (
        <section className="py-16 md:py-20 bg-gradient-to-b from-background to-primary-soft/10">
            <div className="container mx-auto px-4">
                <div className="text-center mb-14">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        {t("trust.section_title")}
                    </h2>
                    <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                        {t("trust.section_subtitle")}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
                    {[
                        {
                            icon: Shield,
                            title: t("trust.verified_dealers"),
                            description: t("trust.verified_dealers_desc"),
                            gradient: "from-green-400 to-emerald-600"
                        },
                        {
                            icon: Award,
                            title: t("trust.secure_payments"),
                            description: t("trust.secure_payments_desc"),
                            gradient: "from-blue-400 to-indigo-600"
                        },
                        {
                            icon: Users,
                            title: t("trust.buyer_protection"),
                            description: t("trust.buyer_protection_desc"),
                            gradient: "from-purple-400 to-violet-600"
                        }
                    ].map((item, index) => (
                        <Card key={index} className="border border-border-subtle shadow-md hover:shadow-lg transition-all duration-300 bg-surface hover:-translate-y-1">
                            <CardContent className="p-7 text-center">
                                <div className={`w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-md`}>
                                    <item.icon className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {item.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
