"use client"

import {
  ArticleHero,
  TableOfContents
} from "@/components/resources/article-hero"
import { Callout } from "@/components/resources/callout"
import {
  FeatureBullet,
  StepCard
} from "@/components/resources/step-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ArrowRight,
  BarChart,
  Calculator,
  Calendar,
  Clock,
  Coins,
  LineChart,
  Percent,
  Search,
  Tag,
  ThumbsDown,
  ThumbsUp,
  TrendingDown,
  TrendingUp
} from "lucide-react"
import Link from "next/link"

export default function PricingGuidePage() {
  const tocItems = [
    { id: "market-research", title: "Market Research", number: 1 },
    { id: "value-factors", title: "Value Factors", number: 2 },
    { id: "pricing-strategies", title: "Pricing Strategies", number: 3 },
    { id: "psychology", title: "Pricing Psychology", number: 4 },
    { id: "when-to-adjust", title: "When to Adjust", number: 5 },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <ArticleHero
        title="Smart Pricing Strategy"
        subtitle="Don't leave money on the table. Learn how to price your vehicle for maximum profit and a quick sale."
        category="Seller's Guide"
        readTime="~10 min read"
        badges={["Finance", "Strategy", "Market Data"]}
        gradient="green"
        backLink="/resources"
        backLabel="Back to Resources"
      />

      {/* Main Content */}
      <div className="container py-10">
        <div className="grid lg:grid-cols-[1fr_300px] gap-8">
          {/* Article Content */}
          <div className="max-w-3xl">
            {/* Quick Overview Card */}
            <Card className="mb-10 overflow-hidden border-0 shadow-lg">
              <div className="bg-gradient-to-r from-green-500/10 via-green-500/5 to-transparent px-6 py-4 border-b">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Coins className="h-5 w-5 text-green-600 dark:text-green-400" />
                  The Sweet Spot
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Pricing is a balancing act between speed and profit
                </p>
              </div>
              <CardContent className="pt-6">
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { icon: Search, text: "Research Competitors" },
                    { icon: Tag, text: "Set Competitive Price" },
                    { icon: Percent, text: "Negotiation Buffer" },
                    { icon: Clock, text: "Timing Matters" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-green-50/50 dark:bg-green-950/10 hover:bg-green-100/50 dark:hover:bg-green-900/20 transition-colors group"
                    >
                      <div className="h-8 w-8 rounded-lg bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-colors">
                        <item.icon className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Callout variant="info" title="The Golden Rule">
              Price too high, and you get zero calls. Price too low, and buyers think something is wrong with the car.
            </Callout>

            {/* Step 1: Research */}
            <div id="market-research">
              <StepCard
                stepNumber={1}
                title="Research comparable Listings"
                description="Knowledge is power. Know what your competition is doing."
                icon={Search}
              >
                <div className="space-y-3">
                  <FeatureBullet
                    title="Search Local Listings"
                    description="Look for cars with same Make, Model, Year, and similar mileage on SK AutoSphere and other sites."
                    icon={<Search className="h-4 w-4 text-primary" />}
                  />
                  <FeatureBullet
                    title="Check 'Sold' Prices"
                    description="Active listings encourage high asking prices. Sold listings show what people actually pay."
                    icon={<BarChart className="h-4 w-4 text-green-500" />}
                  />
                </div>
              </StepCard>
            </div>

            {/* Step 2: Factors */}
            <div id="value-factors">
              <StepCard
                stepNumber={2}
                title="What Affects Your Price?"
                description="Be honest about your vehicle's pros and cons."
                icon={LineChart}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="p-4 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900">
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-3 flex items-center gap-2">
                      <ThumbsUp className="h-4 w-4" /> Value Boosters
                    </h4>
                    <ul className="space-y-2 text-sm text-green-700 dark:text-green-300">
                      <li className="flex items-start gap-2">• Low Mileage (&lt;10k/year)</li>
                      <li className="flex items-start gap-2">• Single Owner</li>
                      <li className="flex items-start gap-2">• Full Service Records</li>
                      <li className="flex items-start gap-2">• Popular Color (White/Black/Silver)</li>
                      <li className="flex items-start gap-2">• Recent Tires/Brakes</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900">
                    <h4 className="font-semibold text-red-800 dark:text-red-200 mb-3 flex items-center gap-2">
                      <ThumbsDown className="h-4 w-4" /> Value Killers
                    </h4>
                    <ul className="space-y-2 text-sm text-red-700 dark:text-red-300">
                      <li className="flex items-start gap-2">• Accidents / Salvage Title</li>
                      <li className="flex items-start gap-2">• Smoking / Pet Odors</li>
                      <li className="flex items-start gap-2">• Visible Body Damage</li>
                      <li className="flex items-start gap-2">• Modifications (lowers buyer pool)</li>
                      <li className="flex items-start gap-2">• Check Engine Light On</li>
                    </ul>
                  </div>
                </div>
              </StepCard>
            </div>

            {/* Step 3: Strategies */}
            <div id="pricing-strategies">
              <StepCard
                stepNumber={3}
                title="Choose Your Strategy"
                description="Pick a lane based on your goals."
                icon={TrendingUp}
              >
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 border rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0 text-blue-600 font-bold text-lg">1</div>
                    <div>
                      <h4 className="font-bold text-base mb-1">The "Quick Sale" (Undercut)</h4>
                      <p className="text-sm text-muted-foreground mb-2">Price <strong>5-10% below</strong> average.</p>
                      <p className="text-xs font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/20 inline-block px-2 py-1 rounded">Best for: urgent cash needs or highly competitive models.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 border rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <div className="h-10 w-10 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center shrink-0 text-violet-600 font-bold text-lg">2</div>
                    <div>
                      <h4 className="font-bold text-base mb-1">The "Premium" (High Ball)</h4>
                      <p className="text-sm text-muted-foreground mb-2">Price <strong>5-10% above</strong> average.</p>
                      <p className="text-xs font-medium text-violet-600 bg-violet-50 dark:bg-violet-900/20 inline-block px-2 py-1 rounded">Best for: rare trims, extremely low mileage, or mint condition.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 border rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center shrink-0 text-orange-600 font-bold text-lg">3</div>
                    <div>
                      <h4 className="font-bold text-base mb-1">The "Negotiator" (Buffer)</h4>
                      <p className="text-sm text-muted-foreground mb-2">Price <strong>10-15% above</strong> your absolute minimum.</p>
                      <p className="text-xs font-medium text-orange-600 bg-orange-50 dark:bg-orange-900/20 inline-block px-2 py-1 rounded">Best for: standard strategy. Expect buyers to haggle.</p>
                    </div>
                  </div>
                </div>
              </StepCard>
            </div>

            {/* Step 4: Psychology */}
            <div id="psychology">
              <StepCard
                stepNumber={4}
                title="Pricing Psychology"
                description="Subconscious tricks that make price tags look smaller."
                icon={TrendingDown}
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <FeatureBullet
                    title="The $9 Effect"
                    description="Ends in 900 or 990 (e.g., ₩14,900,000 vs ₩15,000,000). It feels like a different price bracket."
                    icon={<Tag className="h-4 w-4 text-green-500" />}
                  />
                  <FeatureBullet
                    title="Round Numbers"
                    description="Use ₩15,000,000 instead of ₩15,255,000. Clean numbers imply confidence and simplify negotiation."
                    icon={<Coins className="h-4 w-4 text-blue-500" />}
                  />
                </div>
              </StepCard>
            </div>

            {/* Step 5: Adjustments */}
            <div id="when-to-adjust">
              <StepCard
                stepNumber={5}
                title="When to Drop the Price"
                description="Don't be stubborn. Listen to the market."
                icon={Calendar}
              >
                <div className="space-y-6">
                  <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-3 pl-8 pb-2 space-y-8">
                    <div className="relative">
                      <div className="absolute -left-[41px] h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-800 text-xs flex items-center justify-center font-bold text-muted-foreground">1</div>
                      <h4 className="font-semibold text-sm">Week 1-2: Hold Steady</h4>
                      <p className="text-sm text-muted-foreground">New listings get a "boost". Wait and see who bites.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[41px] h-6 w-6 rounded-full bg-yellow-100 dark:bg-yellow-900 text-xs flex items-center justify-center font-bold text-yellow-600">2</div>
                      <h4 className="font-semibold text-sm">Week 3-4: The Nudge</h4>
                      <p className="text-sm text-muted-foreground">If views are high but calls are low, drop price by <strong>3-5%</strong>.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[41px] h-6 w-6 rounded-full bg-red-100 dark:bg-red-900 text-xs flex items-center justify-center font-bold text-red-600">3</div>
                      <h4 className="font-semibold text-sm">Week 5+: The Slash</h4>
                      <p className="text-sm text-muted-foreground">Drop by <strong>10%</strong> or add incentives (e.g., "I'll pay for transfer fees").</p>
                    </div>
                  </div>
                </div>
              </StepCard>
            </div>

            {/* CTA Section */}
            <Card className="mt-10 overflow-hidden border-0 shadow-lg bg-gradient-to-br from-green-600 via-green-600/90 to-green-700">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/20 mb-4">
                  <Calculator className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Not Sure What It's Worth?
                </h3>
                <p className="text-white/80 mb-6 max-w-md mx-auto">
                  Our AI pricing tool analyzes thousands of listings to give you an accurate estimate instantly.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button size="lg" variant="secondary" asChild className="gap-2">
                    <Link href="/">
                      Ask SK Auto Copilot
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Table of Contents - Sticky */}
            <div className="sticky top-24">
              <TableOfContents items={tocItems} />

              {/* Related Guides */}
              <Card className="mt-6 border shadow-sm">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-sm mb-3">📚 Related Guides</h4>
                  <div className="space-y-2">
                    {[
                      { title: "Create Perfect Listing", href: "/resources/seller-guides/perfect-listing" },
                      { title: "Required Documents", href: "/resources/seller-guides/documents" },
                      { title: "Closing the Deal", href: "/resources/seller-guides/safety" },
                    ].map((guide, i) => (
                      <Link
                        key={i}
                        href={guide.href}
                        className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        → {guide.title}
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
