"use client"

import {
  ArticleHero,
  TableOfContents
} from "@/components/resources/article-hero"
import { Callout } from "@/components/resources/callout"
import {
  FeatureBullet,
  QuickStat,
  StepCard
} from "@/components/resources/step-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  AlertTriangle,
  ArrowRight,
  Banknote,
  Briefcase,
  Building2,
  Calculator,
  Car,
  CheckCircle,
  CreditCard,
  DollarSign,
  FileText,
  Landmark,
  Percent,
  PiggyBank,
  Shield,
  ShieldCheck,
  TrendingUp,
  Wallet
} from "lucide-react"
import Link from "next/link"

export default function FinancingPage() {
  const tocItems = [
    { id: "loans-101", title: "Car Loans 101", number: 1 },
    { id: "financing-options", title: "Where to Get a Loan", number: 2 },
    { id: "factors", title: "Factors that Affect Rates", number: 3 },
    { id: "insurance-basics", title: "Insurance Requirements", number: 4 },
    { id: "coverage-types", title: "Types of Coverage", number: 5 },
    { id: "money-saving-tips", title: "Money Saving Tips", number: 6 },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <ArticleHero
        title="Financing & Insurance Guide"
        subtitle="Navigate the complex world of auto loans and insurance with confidence. Save thousands by understanding your options."
        category="Finance Guide"
        readTime="~10 min read"
        badges={["Money Saving", "Loans", "Insurance"]}
        gradient="emerald"
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
              <div className="bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent px-6 py-4 border-b">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Banknote className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  Quick Overview
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Key financial concepts every buyer should know
                </p>
              </div>
              <CardContent className="pt-6">
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { icon: Calculator, text: "Calculate total budget" },
                    { icon: Briefcase, text: "Get pre-approved first" },
                    { icon: Landmark, text: "Credit Union vs Bank" },
                    { icon: Percent, text: "Understand APR rates" },
                    { icon: ShieldCheck, text: "Liability vs Full Coverage" },
                    { icon: Wallet, text: "Down payment strategy" },
                    { icon: FileText, text: "Loan term lengths" },
                    { icon: PiggyBank, text: "Reduce insurance costs" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/10 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/20 transition-colors group"
                    >
                      <div className="h-8 w-8 rounded-lg bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                        <item.icon className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Callout variant="tip" title="Golden Rule of Financing">
              Always negotiate the <strong>"out-the-door" price</strong> of the vehicle first, then discuss financing. Dealers sometimes lower the car price but make it up with a higher interest rate loan.
            </Callout>

            {/* Step 1: Loans 101 */}
            <div id="loans-101">
              <StepCard
                stepNumber={1}
                title="Car Loans 101"
                description="Understanding the basics of how auto financing works."
                icon={Landmark}
              >
                <div className="grid sm:grid-cols-2 gap-3 mb-6">
                  <QuickStat
                    value="10-20%"
                    label="Ideal down payment"
                    icon={<DollarSign className="h-5 w-5" />}
                  />
                  <QuickStat
                    value="36-48 mo"
                    label="Recommended term"
                    icon={<TrendingUp className="h-5 w-5" />}
                  />
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4">
                    <h4 className="font-semibold text-sm mb-3">Key Terms to Know</h4>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                        <div>
                          <span className="font-medium text-sm block">Principal</span>
                          <span className="text-sm text-muted-foreground">The actual price of the car plus fees/taxes.</span>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                        <div>
                          <span className="font-medium text-sm block">APR (Annual Percentage Rate)</span>
                          <span className="text-sm text-muted-foreground">The interest rate plus any fees needed to get the loan.</span>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                        <div>
                          <span className="font-medium text-sm block">Loan Term</span>
                          <span className="text-sm text-muted-foreground">Length of time to pay back. 60 months (5 years) is common, but shorter is better to save interest.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </StepCard>
            </div>

            {/* Step 2: Where to Get a Loan */}
            <div id="financing-options">
              <StepCard
                stepNumber={2}
                title="Where to Get a Loan"
                description="Shop around for money just like you shop for the car."
                icon={Building2}
              >
                <div className="grid gap-4">
                  <div className="p-4 rounded-xl border bg-white dark:bg-slate-950 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                        <Landmark className="h-5 w-5" />
                      </div>
                      <h4 className="font-semibold text-base">Credit Unions</h4>
                      <span className="ml-auto text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded">Best Rates</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 pl-[3.25rem]">
                      Non-profits that exist to serve members. Typically offer 1-2% lower rates than big banks. Join one before you start shopping.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border bg-white dark:bg-slate-950 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <h4 className="font-semibold text-base">Traditional Banks</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 pl-[3.25rem]">
                      Good if you have an existing relationship. Convenient, but rates are often slightly higher than credit unions.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border bg-white dark:bg-slate-950 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <h4 className="font-semibold text-base">Dealer Financing</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 pl-[3.25rem]">
                      Most convenient but risky. Dealers mark up rates from lenders to make a profit. Only use if they offer 0% or special factory incentives.
                    </p>
                  </div>
                </div>

                <Callout variant="pro" title="Pre-Approval Strategy" className="mt-4">
                  Get pre-approved by a credit union <strong>before</strong> visiting a dealer. This locks in a "rate to beat." If the dealer can't beat it, you use your pre-approved check.
                </Callout>
              </StepCard>
            </div>

            {/* Step 3: Factors Affecting Rates */}
            <div id="factors">
              <StepCard
                stepNumber={3}
                title="Factors that Affect Your Rate"
                description="Why your neighbor might get 3% while you get 7%."
                icon={Percent}
              >
                <div className="space-y-3">
                  <FeatureBullet
                    title="Credit Score"
                    description="The biggest factor. Scores above 720 get the 'Prime' rates. Below 600 may face double-digit rates."
                    icon={<TrendingUp className="h-4 w-4 text-emerald-500" />}
                    highlight
                  />
                  <FeatureBullet
                    title="Down Payment"
                    description="Putting 20% down reduces the lender's risk, often lowering your rate by 0.5-1%."
                    icon={<DollarSign className="h-4 w-4 text-blue-500" />}
                  />
                  <FeatureBullet
                    title="Loan Term"
                    description="Shorter terms (36-48 months) get lower rates because there's less risk of default over time."
                    icon={<Calculator className="h-4 w-4 text-purple-500" />}
                  />
                  <FeatureBullet
                    title="Vehicle Age"
                    description="New cars get cheaper financing than used cars. Used car rates are typically 1-3% higher."
                    icon={<Car className="h-4 w-4 text-slate-500" />}
                  />
                </div>
              </StepCard>
            </div>

            {/* Step 4: Insurance Requirements */}
            <div id="insurance-basics">
              <StepCard
                stepNumber={4}
                title="Insurance Requirements"
                description="You cannot legally drive off the lot without proof of insurance."
                icon={Shield}
              >
                <p className="text-muted-foreground mb-4">
                  Insurance isn't just about protecting your car—it's about protecting your financial future from lawsuits.
                </p>

                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-4 rounded-xl mb-6">
                  <h4 className="text-amber-800 dark:text-amber-200 font-semibold flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5" /> Minimum Legal Requirements
                  </h4>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
                    Varies by state, but almost always includes:
                  </p>
                  <ul className="text-sm text-amber-800 dark:text-amber-300 space-y-1 ml-1">
                    <li className="flex items-center gap-2"><CheckCircle className="h-3 w-3" /> <strong>Bodily Injury Liability:</strong> Pays for injuries to others if you crash.</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-3 w-3" /> <strong>Property Damage Liability:</strong> Pays for damage you cause to other cars/property.</li>
                  </ul>
                </div>

                <Callout variant="warning">
                  If you are financing a car, the <strong>lender will require</strong> you to have "Full Coverage" (Comprehensive + Collision) until the loan is paid off.
                </Callout>
              </StepCard>
            </div>

            {/* Step 5: Coverage Types */}
            <div id="coverage-types">
              <StepCard
                stepNumber={5}
                title="Types of Coverage"
                description="Deciphering the insurance menu."
                icon={ShieldCheck}
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                    <h4 className="font-semibold text-primary mb-2">Collision</h4>
                    <p className="text-sm text-muted-foreground">
                      Pays to repair <strong>your</strong> car if you hit another car or object (like a tree or fence).
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                    <h4 className="font-semibold text-primary mb-2">Comprehensive</h4>
                    <p className="text-sm text-muted-foreground">
                      Covers "bad luck" events unrelated to driving: theft, fire, hail, vandalism, or hitting a deer.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                    <h4 className="font-semibold text-primary mb-2">Gap Insurance</h4>
                    <p className="text-sm text-muted-foreground">
                      Essential if you put little money down. Pays the difference if you total the car and owe more than it's worth.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                    <h4 className="font-semibold text-primary mb-2">Uninsured Motorist</h4>
                    <p className="text-sm text-muted-foreground">
                      Protects you if you get hit by a driver who has no insurance or flees the scene (hit-and-run).
                    </p>
                  </div>
                </div>
              </StepCard>
            </div>

            {/* Step 6: Money Saving Tips */}
            <div id="money-saving-tips">
              <StepCard
                stepNumber={6}
                title="Money Saving Tips"
                description="Smart moves to lower your monthly costs."
                icon={PiggyBank}
              >
                <div className="space-y-4">
                  <FeatureBullet
                    title="Bundle Policies"
                    description="Combining auto with renters or homeowners insurance typically saves 10-25%."
                    icon={<Briefcase className="h-4 w-4 text-emerald-600" />}
                    highlight
                  />
                  <FeatureBullet
                    title="Increase Deductible"
                    description="Raising your deductible from $500 to $1,000 can drop premiums by 15-30%. Just keep that cash in savings."
                    icon={<TrendingUp className="h-4 w-4 text-blue-500" />}
                  />
                  <FeatureBullet
                    title="Quote Before Buying"
                    description="Some cars cost 2x more to insure than similar models. Get a quote for the specific VIN before signing."
                    icon={<Car className="h-4 w-4 text-purple-500" />}
                  />
                </div>
              </StepCard>
            </div>

            {/* CTA Section */}
            <Card className="mt-10 overflow-hidden border-0 shadow-lg bg-gradient-to-br from-emerald-600 via-emerald-600/90 to-emerald-700">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/20 mb-4">
                  <Calculator className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Ready to Calculate Your Budget?
                </h3>
                <p className="text-white/80 mb-6 max-w-md mx-auto">
                  Browse affordable listings on SK AutoSphere and find a car that fits your financial goals.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button size="lg" variant="secondary" asChild className="gap-2">
                    <Link href="/shop">
                      Browse Listings
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="bg-transparent border-white/30 text-white hover:bg-white/10">
                    <Link href="/resources/buyer-guides/beginners-guide">
                      Beginner's Guide
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
                    <Briefcase className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Need Financial Advice?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Our SK Auto Copilot can answer specific questions about interest rates, loan terms, and insurance costs.
                    </p>
                    <div className="flex gap-3">
                      <Button asChild size="sm">
                        <Link href="/">Ask Copilot</Link>
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
                <div className="bg-gradient-to-r from-emerald-500/10 to-transparent p-4 border-b">
                  <h4 className="font-semibold text-sm text-emerald-900 dark:text-emerald-100">💰 Buying Power</h4>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    Don't overspend. Find cars within your monthly budget.
                  </p>
                  <Button asChild className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700" size="sm">
                    <Link href="/shop">
                      Filter by Price
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
                      { title: "Beginner's Guide to Buying", href: "/resources/buyer-guides/beginners-guide" },
                      { title: "Vehicle Inspection Checklist", href: "/resources/buyer-guides/inspection-checklist" },
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
