"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, TrendingUp, Users } from "lucide-react"

export function DealersSection() {
    return (
        <section id="dealers" className="py-16 md:py-20 bg-primary-soft/20 scroll-mt-24">
            <div className="container mx-auto px-4">
                <div className="text-center mb-14">
                    <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        For Dealers
                    </h2>
                    <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                        Join Korea's fastest-growing automotive marketplace and reach thousands of qualified buyers
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-10">
                    <Card className="border border-border-subtle shadow-md bg-surface">
                        <CardContent className="p-7">
                            <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mb-5 shadow-sm">
                                <Users className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Reach More Buyers</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                                Connect with over 50,000 active buyers searching for their next vehicle. Our platform attracts serious
                                buyers ready to make a purchase.
                            </p>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2 text-sm">
                                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                    <span>Unlimited listing uploads</span>
                                </li>
                                <li className="flex items-center gap-2 text-sm">
                                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                    <span>Featured placement options</span>
                                </li>
                                <li className="flex items-center gap-2 text-sm">
                                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                    <span>Direct messaging with buyers</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="border border-border-subtle shadow-md bg-surface">
                        <CardContent className="p-7">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl flex items-center justify-center mb-5 shadow-sm">
                                <TrendingUp className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Powerful Analytics</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                                Track your performance with comprehensive analytics. Understand your market position and optimize your
                                listings for better results.
                            </p>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2 text-sm">
                                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                    <span>Real-time sales dashboard</span>
                                </li>
                                <li className="flex items-center gap-2 text-sm">
                                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                    <span>Market insights & pricing data</span>
                                </li>
                                <li className="flex items-center gap-2 text-sm">
                                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                    <span>Performance benchmarking</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                <div className="text-center">
                    <Button size="lg" className="px-7 h-11 text-base shadow-lg hover:shadow-xl transition-all">
                        Become a Dealer Partner
                    </Button>
                </div>
            </div>
        </section>
    )
}
