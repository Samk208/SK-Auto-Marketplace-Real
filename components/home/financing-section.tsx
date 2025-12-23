"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useTranslation } from "@/hooks/useTranslation"
import { CheckCircle, DollarSign, Shield } from "lucide-react"

export function FinancingSection() {
    const { t } = useTranslation()

    return (
        <section
            id="financing"
            className="py-16 md:py-20 bg-gradient-to-b from-background to-primary-soft/10 scroll-mt-24"
        >
            <div className="container mx-auto px-4">
                <div className="text-center mb-14">
                    <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        {t("financing.title")}
                    </h2>
                    <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                        {t("financing.subtitle")}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
                    {[
                        {
                            icon: CheckCircle,
                            title: "Quick Approval",
                            desc: "Get pre-approved in as little as 5 minutes with our streamlined process",
                            gradient: "from-green-400 to-emerald-600"
                        },
                        {
                            icon: DollarSign,
                            title: "Competitive Rates",
                            desc: "Access the best rates from our network of trusted lending partners",
                            gradient: "from-blue-400 to-indigo-600"
                        },
                        {
                            icon: Shield,
                            title: "Flexible Terms",
                            desc: "Choose from 12 to 84 month terms that fit your budget and lifestyle",
                            gradient: "from-purple-400 to-violet-600"
                        }
                    ].map((item, index) => (
                        <Card key={index} className="border border-border-subtle shadow-md text-center bg-surface">
                            <CardContent className="p-6">
                                <div className={`w-14 h-14 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm`}>
                                    <item.icon className="h-7 w-7 text-white" />
                                </div>
                                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                                <p className="text-muted-foreground text-sm">
                                    {item.desc}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="max-w-2xl mx-auto bg-gradient-to-r from-primary-soft/40 to-accent/10 rounded-xl p-7 md:p-9 border border-border-subtle shadow-md">
                    <h3 className="text-2xl font-bold mb-6 text-center">Calculate Your Monthly Payment</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                        <div>
                            <label className="text-sm font-medium mb-2 block text-foreground/90">Car Price</label>
                            <input
                                type="text"
                                placeholder="$30,000"
                                className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-2 block text-foreground/90">Down Payment</label>
                            <input
                                type="text"
                                placeholder="$5,000"
                                className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-2 block text-foreground/90">Interest Rate (%)</label>
                            <input
                                type="text"
                                placeholder="4.5"
                                className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-2 block text-foreground/90">Loan Term (months)</label>
                            <input
                                type="text"
                                placeholder="60"
                                className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                        </div>
                    </div>
                    <Button size="lg" className="w-full h-11 text-base shadow-lg hover:shadow-xl transition-all">
                        Get Pre-Approved Now
                    </Button>
                </div>
            </div>
        </section>
    )
}
