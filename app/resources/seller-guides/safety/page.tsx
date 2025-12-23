"use client"

import {
  ArticleHero,
  TableOfContents
} from "@/components/resources/article-hero"
import { Callout, ChecklistItem } from "@/components/resources/callout"
import {
  FeatureBullet,
  StepCard
} from "@/components/resources/step-card"
import { Card, CardContent } from "@/components/ui/card"
import {
  Banknote,
  Car,
  CreditCard,
  Eye,
  FileCheck,
  Globe,
  MapPin,
  Phone,
  ShieldAlert,
  ShieldCheck,
  Users
} from "lucide-react"
import Link from "next/link"

export default function SafetyTipsPage() {
  const tocItems = [
    { id: "meeting-safety", title: "Meeting Protocols", number: 1 },
    { id: "test-drives", title: "Test Drive Rules", number: 2 },
    { id: "payment-safety", title: "Secure Payments", number: 3 },
    { id: "common-scams", title: "Scam Awareness", number: 4 },
    { id: "document-safety", title: "Protecting Info", number: 5 },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <ArticleHero
        title="Seller Safety Guide"
        subtitle="Staying safe is more important than the sale. Learn how to protect yourself, your car, and your money."
        category="Seller's Guide"
        readTime="~8 min read"
        badges={["Security", "Anti-Fraud", "Best Practices"]}
        gradient="red" // Red for Safety/Warning theme
        backLink="/resources"
        backLabel="Back to Resources"
      />

      {/* Main Content */}
      <div className="container py-10">
        <div className="grid lg:grid-cols-[1fr_300px] gap-8">
          {/* Article Content */}
          <div className="max-w-3xl">

            <Callout variant="warning" title="Safety Priority">
              Most buyers are genuine people just like you. However, scammers target vehicle sales specifically. Trust your gut—if it feels off, walk away.
            </Callout>

            {/* Step 1: Meeting Protocols */}
            <div id="meeting-safety">
              <StepCard
                stepNumber={1}
                title="Meeting Protocols"
                description="Control the environment. Never meet on their terms alone."
                icon={MapPin}
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900">
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4" /> Safe Locations
                    </h4>
                    <ul className="space-y-2 text-sm text-green-700 dark:text-green-300">
                      <li>• Police Station parking lots</li>
                      <li>• Bank lobbies (great for payment)</li>
                      <li>• Busy shopping mall lots (daytime)</li>
                      <li>• DMV offices</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900">
                    <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2 flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4" /> Danger Zones
                    </h4>
                    <ul className="space-y-2 text-sm text-red-700 dark:text-red-300">
                      <li>• Your home address</li>
                      <li>• Secluded areas or warehouses</li>
                      <li>• The buyer's home</li>
                      <li>• Any location at night</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-4">
                  <FeatureBullet
                    title="The 'Buddy System'"
                    description="Always bring a friend or family member. There is safety in numbers."
                    icon={<Users className="h-4 w-4 text-blue-500" />}
                  />
                </div>
              </StepCard>
            </div>

            {/* Step 2: Test Drive Rules */}
            <div id="test-drives">
              <StepCard
                stepNumber={2}
                title="Test Drive Rules"
                description="You are letting a stranger operate your heavy machinery. Set boundaries."
                icon={Car}
              >
                <Callout variant="warning">
                  <strong>NEVER</strong> let a buyer test drive the car alone. You (or your friend) must be in the passenger seat.
                </Callout>

                <div className="space-y-4 mt-4">
                  <h4 className="font-semibold text-sm">Before Keys Change Hands:</h4>
                  <div className="space-y-2">
                    <ChecklistItem checked>Snap a photo of their Driver's License</ChecklistItem>
                    <ChecklistItem checked>Verify the license face matches the person</ChecklistItem>
                    <ChecklistItem checked>Confirm your insurance covers other drivers</ChecklistItem>
                    <ChecklistItem checked>Remove personal valuables from the glovebox/trunk</ChecklistItem>
                  </div>
                </div>
              </StepCard>
            </div>

            {/* Step 3: Payment Safety */}
            <div id="payment-safety">
              <StepCard
                stepNumber={3}
                title="Secure Payments"
                description="The most critical moment. Don't get scammed at the finish line."
                icon={Banknote}
              >
                <div className="space-y-4">
                  <FeatureBullet
                    title="Cashier's Checks (Verify!)"
                    description="Banks can print fake checks easily. Meet the buyer AT their bank to watch the teller print it, OR verify funds with the bank before handing over keys."
                    icon={<FileCheck className="h-4 w-4 text-primary" />}
                  />
                  <FeatureBullet
                    title="Cash (Bank Counters)"
                    description="If accepting cash, meet at your bank so the teller can count it and check for counterfeits immediately."
                    icon={<Banknote className="h-4 w-4 text-green-500" />}
                  />
                  <FeatureBullet
                    title="Bank Transfer"
                    description="Instant transfers are good, but verify the balance is actually 'Available' in your account, not just 'Pending'."
                    icon={<CreditCard className="h-4 w-4 text-violet-500" />}
                  />
                </div>
              </StepCard>
            </div>

            {/* Step 4: Common Scams */}
            <div id="common-scams">
              <StepCard
                stepNumber={4}
                title="Common Scams to Avoid"
                description="If you see these red flags, block the buyer immediately."
                icon={ShieldAlert}
              >
                <div className="grid gap-4">
                  <div className="p-4 border rounded-xl bg-slate-50 dark:bg-slate-900/50">
                    <h4 className="font-bold text-sm mb-1 text-red-600">The "Overpayment" Scam</h4>
                    <p className="text-sm">Buyer sends a check for <i>more</i> than the asking price and asks you to "wire back the difference" for shipping. The check will bounce weeks later.</p>
                  </div>
                  <div className="p-4 border rounded-xl bg-slate-50 dark:bg-slate-900/50">
                    <h4 className="font-bold text-sm mb-1 text-red-600">The "Unseen" Buyer</h4>
                    <p className="text-sm">"I'm currently on an oil rig / military base / overseas. I will buy the car sight unseen. Sending a mover to pick it up." 99.9% fraud.</p>
                  </div>
                  <div className="p-4 border rounded-xl bg-slate-50 dark:bg-slate-900/50">
                    <h4 className="font-bold text-sm mb-1 text-red-600">The Pressure Tactic</h4>
                    <p className="text-sm">A "mechanic" finds a fake problem and pressures you to sell cheap right now. Or buyer claims "I have cash now but leaving town in 10 mins."</p>
                  </div>
                </div>
              </StepCard>
            </div>

            {/* Step 5: Document Safety */}
            <div id="document-safety">
              <StepCard
                stepNumber={5}
                title="Protecting Your Info"
                description="Don't facilitate identity theft."
                icon={FileCheck}
              >
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <Eye className="h-5 w-5 text-primary shrink-0" />
                    <div className="text-sm">
                      <strong>Redact Sensitive Info:</strong> When sending photos of maintenance records, black out your address, phone number, and credit card info.
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <Globe className="h-5 w-5 text-primary shrink-0" />
                    <div className="text-sm">
                      <strong>Title Privacy:</strong> Don't send a clear photo of the Title until you are sure the buyer is serious. Scammers use title photos to clone cars.
                    </div>
                  </li>
                </ul>
              </StepCard>
            </div>

            {/* Emergency Section */}
            <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/20 p-6 mt-8">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-red-900 dark:text-red-100 mb-2">In an Emergency</h4>
                  <p className="text-sm text-red-800 dark:text-red-200 mb-4">
                    If you feel threatened or something goes wrong:
                  </p>
                  <ul className="text-sm text-red-800 dark:text-red-200 space-y-1 list-disc list-inside">
                    <li>Leave immediately. Don't argue.</li>
                    <li>Call 911 or local police.</li>
                    <li>Report the user to SK AutoSphere Support afterwards.</li>
                  </ul>
                </div>
              </div>
            </div>

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
                      { title: "Required Documents", href: "/resources/seller-guides/documents" },
                      { title: "Pricing Guide", href: "/resources/seller-guides/pricing" },
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
