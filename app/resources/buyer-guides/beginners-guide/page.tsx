"use client"

import {
  ArticleHero,
  TableOfContents
} from "@/components/resources/article-hero"
import { Callout, ChecklistItem } from "@/components/resources/callout"
import {
  FeatureBullet,
  QuickStat,
  StepCard
} from "@/components/resources/step-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ArrowRight,
  Building2,
  Calculator,
  Car,
  CheckCircle2,
  ClipboardCheck,
  CreditCard,
  DollarSign,
  Ear,
  FileCheck,
  FileText,
  Filter,
  Fuel,
  HandCoins,
  MapPin,
  MessageCircle,
  Search,
  Shield,
  Sparkles,
  Thermometer,
  TrendingUp,
  Wrench
} from "lucide-react"
import Link from "next/link"

export default function BeginnersGuidePage() {
  const tocItems = [
    { id: "step-1", title: "Determine Your Budget", number: 1 },
    { id: "step-2", title: "Research Vehicles", number: 2 },
    { id: "step-3", title: "Browse Listings on SK Auto", number: 3 },
    { id: "step-4", title: "Contact Sellers", number: 4 },
    { id: "step-5", title: "Inspect the Vehicle", number: 5 },
    { id: "step-6", title: "Take a Test Drive", number: 6 },
    { id: "step-7", title: "Negotiate the Price", number: 7 },
    { id: "step-8", title: "Complete the Purchase", number: 8 },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <ArticleHero
        title="Beginner's Guide to Buying a Car"
        subtitle="Your complete step-by-step guide to purchasing your first vehicle with confidence. From budgeting to driving away, we've got you covered."
        category="Buyer's Guide"
        readTime="12 min read"
        badges={["Essential", "Step-by-Step"]}
        gradient="blue"
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
              <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-6 py-4 border-b">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Quick Overview
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  8 essential steps to your first car purchase
                </p>
              </div>
              <CardContent className="pt-6">
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { icon: Calculator, text: "Determine your budget and financing" },
                    { icon: Search, text: "Research makes and models" },
                    { icon: Filter, text: "Browse and filter listings" },
                    { icon: MessageCircle, text: "Contact sellers directly" },
                    { icon: ClipboardCheck, text: "Inspect the vehicle thoroughly" },
                    { icon: Car, text: "Take a comprehensive test drive" },
                    { icon: HandCoins, text: "Negotiate the best price" },
                    { icon: FileCheck, text: "Complete paperwork and payment" },
                  ].map((step, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 hover:bg-primary/5 transition-colors group"
                    >
                      <div className="h-8 w-8 rounded-lg bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <step.icon className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium">{step.text}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Callout variant="info" title="Before You Begin">
              Buying a car is one of the biggest financial decisions you'll make. Take your time, do your research, and don't rush into any purchase. This guide will walk you through every step to ensure you get the best deal possible.
            </Callout>

            {/* Step 1 */}
            <div id="step-1">
              <StepCard
                stepNumber={1}
                title="Determine Your Budget"
                description="Before you start shopping, figure out how much you can truly afford."
                icon={Calculator}
              >
                <p className="text-muted-foreground mb-4">
                  Setting a realistic budget is the foundation of smart car shopping. Consider not just the purchase price, but all the ongoing costs of ownership.
                </p>

                <div className="grid sm:grid-cols-2 gap-3 mb-4">
                  <QuickStat
                    value="10-20%"
                    label="Typical down payment"
                    icon={<DollarSign className="h-5 w-5" />}
                  />
                  <QuickStat
                    value="3-7% APR"
                    label="Loan interest rates"
                    icon={<TrendingUp className="h-5 w-5" />}
                  />
                </div>

                <div className="space-y-2">
                  <FeatureBullet
                    title="Total Vehicle Cost"
                    description="Purchase price plus taxes, registration, and dealer fees"
                  />
                  <FeatureBullet
                    title="Monthly Expenses"
                    description="Insurance, fuel, maintenance, and parking costs"
                    highlight
                  />
                  <FeatureBullet
                    title="Down Payment"
                    description="Typically 10-20% of the purchase price reduces your loan amount"
                  />
                  <FeatureBullet
                    title="Financing Terms"
                    description="Consider loan length and interest rates—shorter terms mean less interest"
                  />
                </div>

                <Callout variant="tip" title="Budget Rule of Thumb">
                  A good rule: your total monthly car expenses (payment + insurance + fuel) shouldn't exceed 15-20% of your monthly take-home pay.
                </Callout>
              </StepCard>
            </div>

            {/* Step 2 */}
            <div id="step-2">
              <StepCard
                stepNumber={2}
                title="Research Vehicles"
                description="Not all cars are created equal. Find what suits your lifestyle."
                icon={Search}
              >
                <p className="text-muted-foreground mb-4">
                  Take time to research different makes and models. Consider your daily needs, driving habits, and long-term ownership costs.
                </p>

                <div className="space-y-2">
                  <FeatureBullet
                    icon={<Fuel className="h-4 w-4 text-emerald-500" />}
                    title="Fuel Efficiency"
                    description="How many miles per gallon? Consider hybrid or electric options"
                  />
                  <FeatureBullet
                    icon={<Shield className="h-4 w-4 text-blue-500" />}
                    title="Reliability Ratings"
                    description="Check consumer reports and owner reviews for real-world feedback"
                  />
                  <FeatureBullet
                    icon={<CheckCircle2 className="h-4 w-4 text-green-500" />}
                    title="Safety Ratings"
                    description="Look for 4-5 star NHTSA or IIHS crash test ratings"
                    highlight
                  />
                  <FeatureBullet
                    icon={<Wrench className="h-4 w-4 text-orange-500" />}
                    title="Maintenance Costs"
                    description="Some brands are significantly more expensive to repair"
                  />
                  <FeatureBullet
                    icon={<TrendingUp className="h-4 w-4 text-purple-500" />}
                    title="Resale Value"
                    description="Will the car hold its value if you want to sell later?"
                  />
                </div>

                <Callout variant="pro">
                  Use resources like Kelley Blue Book (KBB), Edmunds, and Consumer Reports to compare vehicles objectively. Focus on models with strong reliability records and reasonable maintenance costs.
                </Callout>
              </StepCard>
            </div>

            {/* Step 3 */}
            <div id="step-3">
              <StepCard
                stepNumber={3}
                title="Browse Listings on SK AutoSphere"
                description="Use our advanced filters to find your perfect match."
                icon={Filter}
              >
                <p className="text-muted-foreground mb-4">
                  SK AutoSphere makes it easy to find the right vehicle with powerful search and filter options designed for serious buyers.
                </p>

                <div className="bg-gradient-to-r from-primary/5 to-transparent rounded-xl p-4 mb-4 border border-primary/10">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Filter className="h-4 w-4 text-primary" />
                    Search Features
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-2 text-sm">
                    {[
                      "Set your price range",
                      "Filter by make and model",
                      "Choose year and mileage",
                      "Select vehicle condition",
                      "Sort by price or date",
                      "Save favorite listings",
                    ].map((feature, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                <Callout variant="tip">
                  Save your search criteria and enable notifications to be alerted when new matching vehicles are listed. The best deals often go quickly!
                </Callout>

                <div className="mt-4">
                  <Button asChild className="gap-2">
                    <Link href="/shop">
                      Browse SK AutoSphere Listings
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </StepCard>
            </div>

            {/* Step 4 */}
            <div id="step-4">
              <StepCard
                stepNumber={4}
                title="Contact Sellers"
                description="Reach out to sellers and gather important information."
                icon={MessageCircle}
              >
                <p className="text-muted-foreground mb-4">
                  Once you find promising listings, it's time to connect with sellers. Ask the right questions to avoid wasting time on unsuitable vehicles.
                </p>

                <div className="space-y-2 mb-4">
                  <FeatureBullet
                    title="Multiple Contact Methods"
                    description="Use WhatsApp, phone, or email based on your preference"
                  />
                  <FeatureBullet
                    title="Key Questions to Ask"
                    description="Vehicle history, maintenance records, reason for selling"
                    highlight
                  />
                  <FeatureBullet
                    title="Request More Photos"
                    description="Ask for detailed photos of any areas of concern"
                  />
                  <FeatureBullet
                    icon={<MapPin className="h-4 w-4 text-red-500" />}
                    title="Safe Meeting Location"
                    description="Always meet in a public place for initial viewings"
                  />
                </div>

                <Callout variant="safety">
                  Always verify the seller's identity matches the vehicle title before proceeding. Meet at a safe public location like a police station parking lot or busy shopping center.
                </Callout>
              </StepCard>
            </div>

            {/* Step 5 */}
            <div id="step-5">
              <StepCard
                stepNumber={5}
                title="Inspect the Vehicle"
                description="Never skip the inspection—it can save you thousands."
                icon={ClipboardCheck}
              >
                <p className="text-muted-foreground mb-4">
                  A thorough inspection reveals problems that aren't visible in photos. Know what to look for or hire a professional.
                </p>

                <Callout variant="checklist" title="Inspection Checklist">
                  <div className="space-y-1 mt-2">
                    <ChecklistItem>Exterior: Check for rust, dents, and mismatched paint</ChecklistItem>
                    <ChecklistItem>Interior: Assess wear, test all features, check for odors</ChecklistItem>
                    <ChecklistItem>Engine: Look for oil leaks, listen for unusual noises</ChecklistItem>
                    <ChecklistItem>Tires: Check tread depth and ensure even wear</ChecklistItem>
                    <ChecklistItem>Documents: Verify title, registration, and maintenance records</ChecklistItem>
                  </div>
                </Callout>

                <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-4 border border-amber-200 dark:border-amber-800 mt-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center shrink-0">
                      <Wrench className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-1">
                        Professional Inspection
                      </h4>
                      <p className="text-sm text-amber-700 dark:text-amber-300">
                        Hire a certified mechanic for <strong>$100-200</strong> to perform a comprehensive inspection. This small investment can save you thousands by uncovering hidden problems.
                      </p>
                    </div>
                  </div>
                </div>
              </StepCard>
            </div>

            {/* Step 6 */}
            <div id="step-6">
              <StepCard
                stepNumber={6}
                title="Take a Test Drive"
                description="Experience how the car actually performs on the road."
                icon={Car}
              >
                <p className="text-muted-foreground mb-4">
                  A test drive reveals issues you can't see in photos or during a stationary inspection. Pay attention to every detail.
                </p>

                <div className="grid sm:grid-cols-2 gap-3 mb-4">
                  {[
                    { icon: Car, label: "Engine starting & acceleration" },
                    { icon: TrendingUp, label: "Transmission shifting smoothly" },
                    { icon: Shield, label: "Brake responsiveness" },
                    { icon: Search, label: "Steering alignment" },
                    { icon: Ear, label: "Unusual noises or vibrations" },
                    { icon: Thermometer, label: "A/C and heating function" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                      <item.icon className="h-4 w-4 text-primary" />
                      <span className="text-sm">{item.label}</span>
                    </div>
                  ))}
                </div>

                <Callout variant="tip">
                  Test the vehicle for at least 20-30 minutes on different road types: highway driving, city streets, and parking. Check all controls while driving safely.
                </Callout>
              </StepCard>
            </div>

            {/* Step 7 */}
            <div id="step-7">
              <StepCard
                stepNumber={7}
                title="Negotiate the Price"
                description="Don't be afraid to negotiate—it's expected!"
                icon={HandCoins}
              >
                <p className="text-muted-foreground mb-4">
                  Negotiating is a normal part of buying a used car. Come prepared with research and be willing to walk away.
                </p>

                <div className="space-y-2 mb-4">
                  <FeatureBullet
                    title="Research Comparable Listings"
                    description="Know the fair market value before making an offer"
                    highlight
                  />
                  <FeatureBullet
                    title="Use Inspection Findings"
                    description="Issues found during inspection can justify a lower price"
                  />
                  <FeatureBullet
                    title="Start Smart"
                    description="Begin with an offer 5-10% below asking price"
                  />
                  <FeatureBullet
                    title="Be Prepared to Walk"
                    description="If the price isn't right, be ready to move on"
                  />
                </div>

                <Callout variant="warning">
                  Never commit to a price verbally without seeing it in writing. Get the final agreed price documented before making any payment.
                </Callout>
              </StepCard>
            </div>

            {/* Step 8 */}
            <div id="step-8">
              <StepCard
                stepNumber={8}
                title="Complete the Purchase"
                description="Finalize everything properly to protect yourself."
                icon={FileCheck}
              >
                <p className="text-muted-foreground mb-4">
                  You've made it to the final step! Complete the purchase correctly to ensure a smooth ownership transfer.
                </p>

                <Callout variant="checklist" title="Final Steps Checklist">
                  <div className="space-y-1 mt-2">
                    <ChecklistItem>Use a secure payment method (bank transfer or cashier's check)</ChecklistItem>
                    <ChecklistItem>Sign a detailed bill of sale documenting the transaction</ChecklistItem>
                    <ChecklistItem>Get the vehicle title properly signed over to you</ChecklistItem>
                    <ChecklistItem>Obtain all registration documents</ChecklistItem>
                    <ChecklistItem>Transfer or purchase insurance before driving</ChecklistItem>
                    <ChecklistItem>Register the vehicle at your local DMV within 7-30 days</ChecklistItem>
                  </div>
                </Callout>

                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                    <CreditCard className="h-5 w-5 mx-auto mb-1 text-primary" />
                    <div className="text-xs text-muted-foreground">Secure Payment</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                    <FileText className="h-5 w-5 mx-auto mb-1 text-primary" />
                    <div className="text-xs text-muted-foreground">Bill of Sale</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                    <Building2 className="h-5 w-5 mx-auto mb-1 text-primary" />
                    <div className="text-xs text-muted-foreground">DMV Registration</div>
                  </div>
                </div>
              </StepCard>
            </div>

            {/* CTA Section */}
            <Card className="mt-10 overflow-hidden border-0 shadow-lg bg-gradient-to-br from-primary via-primary/90 to-primary/80">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/20 mb-4">
                  <Car className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Ready to Find Your Perfect Car?
                </h3>
                <p className="text-white/80 mb-6 max-w-md mx-auto">
                  Browse thousands of verified listings on SK AutoSphere and start your car-buying journey today.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button size="lg" variant="secondary" asChild className="gap-2">
                    <Link href="/shop">
                      Browse Listings
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="bg-transparent border-white/30 text-white hover:bg-white/10">
                    <Link href="/resources">
                      More Guides
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Help Section */}
            <Card className="mt-6 border shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Need More Help?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Use our SK Auto Copilot AI assistant for instant answers to your questions, or explore more resources in our hub.
                    </p>
                    <div className="flex gap-3">
                      <Button asChild size="sm">
                        <Link href="/resources">View All Resources</Link>
                      </Button>
                      <Button variant="outline" asChild size="sm">
                        <Link href="/shop">Browse Listings</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Table of Contents - Sticky */}
            <div className="sticky top-24">
              <TableOfContents items={tocItems} />

              {/* Quick CTA */}
              <Card className="mt-6 border shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-primary/10 to-transparent p-4 border-b">
                  <h4 className="font-semibold text-sm">🚗 Ready to Shop?</h4>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    Find your perfect vehicle on SK AutoSphere.
                  </p>
                  <Button asChild className="w-full gap-2" size="sm">
                    <Link href="/shop">
                      Browse Listings
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Related Guides */}
              <Card className="mt-6 border shadow-sm">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-sm mb-3">📚 Related Guides</h4>
                  <div className="space-y-2">
                    {[
                      { title: "Vehicle Inspection Checklist", href: "/resources/buyer-guides/inspection-checklist" },
                      { title: "Financing Options", href: "/resources/buyer-guides/financing" },
                      { title: "Legal Requirements", href: "/resources/buyer-guides/legal" },
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
