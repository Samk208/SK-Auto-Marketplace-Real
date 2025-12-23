"use client"

import { DocumentChecklist } from "@/components/document-checklist"
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
  Book,
  FileCheck,
  FileSignature,
  FileText,
  Globe,
  History,
  Info,
  PenTool,
  Printer,
  ShieldCheck,
  Wrench
} from "lucide-react"
import Link from "next/link"

export default function SellerDocumentsPage() {
  const tocItems = [
    { id: "checklist", title: "Interactive Checklist", number: 1 },
    { id: "essential-docs", title: "Essential Documents", number: 2 },
    { id: "recommended-docs", title: "Value-Adding Docs", number: 3 },
    { id: "transaction-docs", title: "Closing Paperwork", number: 4 },
    { id: "international", title: "International Export", number: 5 },
  ]

  const requiredDocs = [
    { name: "Vehicle Title (clean, in your name)", required: true, verified: false },
    { name: "Current Registration Certificate", required: true, verified: false },
    { name: "Bill of Sale (Template)", required: true, verified: false },
    { name: "Maintenance Records", required: false, verified: false },
    { name: "Vehicle History Report", required: false, verified: false },
    { name: "Spare Keys and Manuals", required: false, verified: false },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <ArticleHero
        title="Required Seller Documents"
        subtitle="Don't let paperwork kill the deal. Organize these documents before you list your car."
        category="Seller's Guide"
        readTime="~12 min read"
        badges={["Paperwork", "Legal", "Organization"]}
        gradient="orange" // Orange for Administrative/Warning theme
        backLink="/resources"
        backLabel="Back to Resources"
      />

      {/* Main Content */}
      <div className="container py-10">
        <div className="grid lg:grid-cols-[1fr_300px] gap-8">
          {/* Article Content */}
          <div className="max-w-3xl">

            <Callout variant="pro" title="Pro Tip: The 'Binder Effect'">
              Buyers are impressed by organization. Presenting all these documents in a neat folder or binder instantly builds trust and justifies a higher price.
            </Callout>

            {/* Step 1: Checklist */}
            <div id="checklist">
              <Card className="mb-8 border-orange-200 dark:border-orange-900 bg-orange-50/50 dark:bg-orange-950/10">
                <CardContent className="pt-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <FileCheck className="h-5 w-5 text-orange-600" />
                    Quick Readiness Check
                  </h3>
                  <DocumentChecklist documents={requiredDocs} />
                </CardContent>
              </Card>
            </div>

            {/* Step 2: Essential Docs */}
            <div id="essential-docs">
              <StepCard
                stepNumber={1}
                title="The Essentials (Deal Breakers)"
                description="You cannot legally sell the car without these."
                icon={FileText}
              >
                <div className="space-y-6">
                  <FeatureBullet
                    title="Vehicle Title (The 'Pink Slip')"
                    description="Must be in YOUR name. If it has a lien (loan), you need a payoff letter or lien release from the bank first."
                    icon={<FileSignature className="h-4 w-4 text-primary" />}
                    highlight
                  />

                  <div className="pl-11 -mt-2">
                    <Info className="h-4 w-4 text-amber-500 inline mr-1" />
                    <span className="text-xs text-muted-foreground">Don't sign the transfer section until money changes hands!</span>
                  </div>

                  <FeatureBullet
                    title="Current Registration"
                    description="Proves the car is road-legal and taxes are paid. Buyers need this to transfer plates (in some states) or get temporary tags."
                    icon={<FileText className="h-4 w-4 text-blue-500" />}
                  />
                </div>
              </StepCard>
            </div>

            {/* Step 3: Recommended Docs */}
            <div id="recommended-docs">
              <StepCard
                stepNumber={2}
                title="Value-Adding Documents"
                description="These justify your asking price and silence low-ballers."
                icon={Wrench}
              >
                <div className="space-y-3">
                  <FeatureBullet
                    title="Maintenance Records"
                    description="Invoices for oil changes, tire rotations, and repairs. Shows the car was loved."
                    icon={<History className="h-4 w-4 text-green-500" />}
                  />
                  <FeatureBullet
                    title="Vehicle History Report"
                    description="Buying your own Carfax/AutoCheck upfront (~$40) proves you have nothing to hide regarding accidents."
                    icon={<ShieldCheck className="h-4 w-4 text-violet-500" />}
                  />
                  <FeatureBullet
                    title="Manuals & Spare Keys"
                    description="Original booklets and that expensive second key fob ($200+ value) go a long way."
                    icon={<Book className="h-4 w-4 text-slate-500" />}
                  />
                </div>
              </StepCard>
            </div>

            {/* Step 4: Transaction Docs */}
            <div id="transaction-docs">
              <StepCard
                stepNumber={3}
                title="Closing Paperwork"
                description="Documents you create at the time of sale."
                icon={PenTool}
              >
                <div className="grid gap-4">
                  <div className="p-4 rounded-xl border bg-white dark:bg-slate-950">
                    <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                      <FileSignature className="h-4 w-4 text-primary" /> Bill of Sale
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">Your receipt. Must include: VIN, Price, Mileage, Date, and "AS-IS" statement.</p>
                    <Button variant="outline" size="sm" className="gap-2 h-8 text-xs">
                      <Printer className="h-3 w-3" /> Print Template
                    </Button>
                  </div>

                  <div className="p-4 rounded-xl border bg-white dark:bg-slate-950">
                    <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                      <Info className="h-4 w-4 text-primary" /> Odometer Disclosure
                    </h4>
                    <p className="text-sm text-muted-foreground">Federal Requirement for cars under 10 years old. certifies mileage is accurate.</p>
                  </div>

                  <div className="p-4 rounded-xl border bg-white dark:bg-slate-950">
                    <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-primary" /> Release of Liability
                    </h4>
                    <p className="text-sm text-muted-foreground"><strong>CRITICAL:</strong> File this with the DMV immediately after sale. It tells the state "I don't own this anymore" so you aren't liable for the new owner's parking tickets or accidents.</p>
                  </div>
                </div>
              </StepCard>
            </div>

            {/* Step 5: International */}
            <div id="international">
              <StepCard
                stepNumber={4}
                title="International Export Docs"
                description="Selling to an overseas buyer? You'll need extra paper."
                icon={Globe}
              >
                <ul className="space-y-3 text-sm">
                  <li className="flex gap-2 items-start">
                    <ArrowRight className="h-4 w-4 mt-0.5 text-primary" />
                    <div><strong>Export Certificate:</strong> Required for shipping.</div>
                  </li>
                  <li className="flex gap-2 items-start">
                    <ArrowRight className="h-4 w-4 mt-0.5 text-primary" />
                    <div><strong>Commercial Invoice:</strong> For customs declaration.</div>
                  </li>
                  <li className="flex gap-2 items-start">
                    <ArrowRight className="h-4 w-4 mt-0.5 text-primary" />
                    <div><strong>Port-Specific Forms:</strong> E.g., Form M (Nigeria), IDF (Kenya). Check with the shipper.</div>
                  </li>
                </ul>
              </StepCard>
            </div>

            {/* CTA Section */}
            <Card className="mt-10 overflow-hidden border-0 shadow-lg bg-gradient-to-br from-orange-600 via-orange-600/90 to-orange-700">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/20 mb-4">
                  <Printer className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Need Forms?
                </h3>
                <p className="text-white/80 mb-6 max-w-md mx-auto">
                  Download our free Bill of Sale template and State-specific checklists.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button size="lg" variant="secondary" className="gap-2">
                    <Link href="#">Download Templates</Link>
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
                      { title: "Pricing Guide", href: "/resources/seller-guides/pricing" },
                      { title: "Safety Tips", href: "/resources/seller-guides/safety" },
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
