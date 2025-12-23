"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Brain, Eye, MessageSquare, Search, Sparkles } from "lucide-react"
import Link from "next/link"

export function AiFeaturesSection() {
    return (
        <section className="py-16 md:py-20 bg-gradient-to-br from-primary/5 via-accent/5 to-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-14">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent mb-4 shadow-lg shadow-primary/20">
                        <Brain className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        AI-Powered Marketplace
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Experience the future of vehicle trading with intelligent matching, automated inspections, and smart insights
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {/* AI Vehicle Finder */}
                    <Card className="border border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-surface">
                        <CardContent className="p-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-md">
                                <Search className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">AI Vehicle Finder</h3>
                            <p className="text-base text-muted-foreground mb-4 leading-relaxed">
                                Tell us what you need and AI instantly matches you with perfect vehicles, complete with export routes and
                                landed costs.
                            </p>
                            <Button asChild variant="outline" className="w-full bg-transparent border-primary/20 hover:bg-primary/5 hover:text-primary">
                                <Link href="/find-vehicle">
                                    <Sparkles className="h-4 w-4 mr-2" />
                                    Try AI Finder
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Visual Inspection AI */}
                    <Card className="border border-accent/20 hover:border-accent/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-surface">
                        <CardContent className="p-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-violet-600 rounded-xl flex items-center justify-center mb-4 shadow-md">
                                <Eye className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Visual Inspection AI</h3>
                            <p className="text-base text-muted-foreground mb-4 leading-relaxed">
                                Automated condition reports analyze vehicle photos to detect scratches, wear, and verify mileage claims functionality.
                            </p>
                            <Button asChild variant="outline" className="w-full bg-transparent border-accent/20 hover:bg-accent/5 hover:text-accent">
                                <Link href="/shop">View Examples</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* 24/7 AI Assistant */}
                    <Card className="border border-green-500/20 hover:border-green-500/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-surface">
                        <CardContent className="p-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center mb-4 shadow-md">
                                <MessageSquare className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">24/7 AI Assistant</h3>
                            <p className="text-base text-muted-foreground mb-4 leading-relaxed">
                                Get instant help with listings, pricing, export costs, translations, and market insights anytime.
                            </p>
                            <Button
                                variant="outline"
                                className="w-full bg-transparent border-green-500/20 hover:bg-green-500/5 hover:text-green-600"
                                onClick={() => {
                                    const copilot = document.querySelector('[aria-label="Open SK Auto Copilot"]') as HTMLButtonElement
                                    copilot?.click()
                                }}
                            >
                                <Brain className="h-4 w-4 mr-2" />
                                Chat Now
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="text-center mt-10">
                    <p className="text-sm font-medium text-muted-foreground/80 bg-surface/50 inline-block px-4 py-2 rounded-full border border-border-subtle">
                        For dealers: Smart Listing Generator, Market Insights Dashboard, and Multilingual Translator available in
                        your dashboard
                    </p>
                </div>
            </div>
        </section>
    )
}
