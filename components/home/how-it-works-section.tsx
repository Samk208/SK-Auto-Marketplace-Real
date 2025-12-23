"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useTranslation } from "@/hooks/useTranslation"
import { DollarSign, Search } from "lucide-react"

export function HowItWorksSection() {
    const { t } = useTranslation()

    return (
        <section className="py-16 md:py-20 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-14">
                    <h2 className="text-3xl md:text-4xl font-bold mb-3">{t("how_it_works.title")}</h2>
                    <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                        {t("how_it_works.subtitle")}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                    {/* For Buyers */}
                    <Card className="border-2 border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-8">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-md">
                                    <Search className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold">{t("how_it_works.for_buyers")}</h3>
                            </div>
                            <div className="space-y-6">
                                {[
                                    {
                                        title: t("how_it_works.buyer_step_1_title"),
                                        desc: t("how_it_works.buyer_step_1_desc"),
                                    },
                                    {
                                        title: t("how_it_works.buyer_step_2_title"),
                                        desc: t("how_it_works.buyer_step_2_desc"),
                                    },
                                    {
                                        title: t("how_it_works.buyer_step_3_title"),
                                        desc: t("how_it_works.buyer_step_3_desc"),
                                    },
                                ].map((step, index) => (
                                    <div key={index} className="flex gap-4">
                                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0 font-bold text-primary border border-primary/20">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold mb-1 text-lg">{step.title}</h4>
                                            <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* For Sellers */}
                    <Card className="border-2 border-accent/20 shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-8">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-xl flex items-center justify-center shadow-md">
                                    <DollarSign className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold">{t("how_it_works.for_dealers")}</h3>
                            </div>
                            <div className="space-y-6">
                                {[
                                    {
                                        title: t("how_it_works.dealer_step_1_title"),
                                        desc: t("how_it_works.dealer_step_1_desc"),
                                    },
                                    {
                                        title: t("how_it_works.dealer_step_2_title"),
                                        desc: t("how_it_works.dealer_step_2_desc"),
                                    },
                                    {
                                        title: t("how_it_works.dealer_step_3_title"),
                                        desc: t("how_it_works.dealer_step_3_desc"),
                                    },
                                ].map((step, index) => (
                                    <div key={index} className="flex gap-4">
                                        <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center shrink-0 font-bold text-accent border border-accent/20">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold mb-1 text-lg">{step.title}</h4>
                                            <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}
