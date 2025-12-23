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
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Briefcase,
  Building,
  Calendar,
  Car,
  CheckCircle,
  FileCheck,
  FileSignature,
  FileText,
  Gavel,
  Landmark,
  Scale,
  Shield,
  Stamp,
  UserCheck
} from "lucide-react"
import Link from "next/link"

export default function LegalRequirementsPage() {
  const tocItems = [
    { id: "documents-for-purchase", title: "Documents for Purchase", number: 1 },
    { id: "bill-of-sale", title: "The Bill of Sale", number: 2 },
    { id: "registration-process", title: "Registration Process", number: 3 },
    { id: "fees-taxes", title: "Fees & Taxes", number: 4 },
    { id: "state-requirements", title: "State-Specific Rules", number: 5 },
    { id: "lemon-laws", title: "Lemon Law Protection", number: 6 },
    { id: "final-checklist", title: "Closing the Deal", number: 7 },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <ArticleHero
        title="Legal Requirements Guide"
        subtitle="Don't get caught in red tape. Learn exactly what paperwork you need to buy and register a vehicle legally."
        category="Legal Guide"
        readTime="~12 min read"
        badges={["Compliance", "DMV", "Contracts"]}
        gradient="purple"
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
              <div className="bg-gradient-to-r from-violet-500/10 via-violet-500/5 to-transparent px-6 py-4 border-b">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Scale className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                  Legal Essentials
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  The non-negotiable paperwork for every sale
                </p>
              </div>
              <CardContent className="pt-6">
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { icon: FileCheck, text: "Signed Vehicle Title" },
                    { icon: FileText, text: "Bill of Sale" },
                    { icon: UserCheck, text: "Verify ID Match" },
                    { icon: Shield, text: "Proof of Insurance" },
                    { icon: Stamp, text: "Odometer Disclosure" },
                    { icon: Building, text: "DMV Registration" },
                    { icon: AlertTriangle, text: "Lien Release" },
                    { icon: FileSignature, text: "Emissions/Safety Certs" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-violet-50/50 dark:bg-violet-950/10 hover:bg-violet-100/50 dark:hover:bg-violet-900/20 transition-colors group"
                    >
                      <div className="h-8 w-8 rounded-lg bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center group-hover:bg-violet-500 group-hover:text-white transition-colors">
                        <item.icon className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Callout variant="warning" title="Critical Warning">
              Never buy a car without a title. If the seller says "I'll mail it to you later," <strong>walk away</strong>. The title is the only legal proof of ownership.
            </Callout>

            {/* Step 1: Documents for Purchase */}
            <div id="documents-for-purchase">
              <StepCard
                stepNumber={1}
                title="Required Documents"
                description="The papers you absolutely must have in hand."
                icon={FileCheck}
              >
                <div className="space-y-4">
                  <FeatureBullet
                    title="Vehicle Title"
                    description="Seller must sign and date the 'transfer' section. Check that the VIN on the title matches the car's VIN plate."
                    icon={<FileSignature className="h-4 w-4 text-violet-600" />}
                    highlight
                  />
                  <FeatureBullet
                    title="Lien Release"
                    description="If the seller had a loan, you need an official letter from the bank stating the loan is paid off. Otherwise, you buy their debt!"
                    icon={<AlertTriangle className="h-4 w-4 text-amber-500" />}
                  />
                  <FeatureBullet
                    title="Odometer Disclosure"
                    description="Federal law requires this for cars under 10 years old. It certifies the mileage is accurate and not rolled back."
                    icon={<Stamp className="h-4 w-4 text-slate-500" />}
                  />
                </div>
              </StepCard>
            </div>

            {/* Step 2: Bill of Sale */}
            <div id="bill-of-sale">
              <StepCard
                stepNumber={2}
                title="The Bill of Sale"
                description="Your receipt and proof of purchase price."
                icon={FileText}
              >
                <div className="grid gap-4">
                  <p className="text-muted-foreground mb-2">
                    Even if your state doesn't strictly require one, write one up for your protection. It should include:
                  </p>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      "Date of sale",
                      "Final purchase price",
                      "Year, Make, Model & VIN",
                      "Odometer reading",
                      "Seller's full legal name",
                      "Buyer's full legal name",
                      "'As-is' warranty disclaimer",
                      "Signatures from both parties"
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm bg-slate-50 dark:bg-slate-900/50 p-2 rounded">
                        <CheckCircle className="h-3 w-3 text-violet-500" /> {item}
                      </div>
                    ))}
                  </div>
                </div>

                <Callout variant="tip">
                  You can download generic Bill of Sale templates online or get one from your local DMV website.
                </Callout>
              </StepCard>
            </div>

            {/* Step 3: Registration Process */}
            <div id="registration-process">
              <StepCard
                stepNumber={3}
                title="Registration Process"
                description="Making it legal to drive on public roads."
                icon={Building}
              >
                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <h4 className="font-semibold text-sm">Timeline Requirement</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You typically have <strong>7 to 30 days</strong> (varies by state) to register your new vehicle. Don't delay—late fees can be steep.
                  </p>
                </div>

                <h4 className="font-semibold text-sm mb-3">Checklist for the DMV Trip:</h4>
                <div className="space-y-2">
                  <ChecklistItem checked>Signed Vehicle Title</ChecklistItem>
                  <ChecklistItem checked>Bill of Sale</ChecklistItem>
                  <ChecklistItem checked>Proof of Active Insurance</ChecklistItem>
                  <ChecklistItem checked>Your Valid Driver's License</ChecklistItem>
                  <ChecklistItem checked>Payment for Taxes & Fees</ChecklistItem>
                  <ChecklistItem>Emissions Certificate (if required)</ChecklistItem>
                </div>
              </StepCard>
            </div>

            {/* Step 4: Fees & Taxes */}
            <div id="fees-taxes">
              <StepCard
                stepNumber={4}
                title="Fees & Taxes"
                description="Budget for these extra costs to avoid sticker shock."
                icon={Landmark}
              >
                <div className="space-y-3">
                  <FeatureBullet
                    title="Sales Tax"
                    description="Usually 5-10% of the purchase price. Some states charge this based on the 'Blue Book' value, not just what you paid."
                    icon={<Building className="h-4 w-4 text-slate-500" />}
                  />
                  <FeatureBullet
                    title="Title Transfer Fee"
                    description="Typically $15 - $100. This pays for printing the new title in your name."
                    icon={<FileCheck className="h-4 w-4 text-slate-500" />}
                  />
                  <FeatureBullet
                    title="Registration Fee"
                    description="$30 - $200 annually. This gets you your license plates and tags."
                    icon={<Car className="h-4 w-4 text-slate-500" />}
                  />
                </div>
              </StepCard>
            </div>

            {/* Step 5: State Specific Requirements */}
            <div id="state-requirements">
              <StepCard
                stepNumber={5}
                title="State Contracts & Rules"
                description="Location matters. Know your local laws."
                icon={BookOpen}
              >
                <div className="grid gap-4">
                  <div className="p-4 rounded-xl bg-violet-50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900">
                    <h4 className="font-semibold text-violet-800 dark:text-violet-200 mb-2 flex items-center gap-2">
                      <FileSignature className="h-4 w-4" /> Emissions Testing
                    </h4>
                    <p className="text-sm text-violet-700 dark:text-violet-300 mb-2">
                      Required in major metro areas of CA, NY, TX, IL, MA, NJ, PA, and many others.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
                      <Shield className="h-4 w-4" /> Safety Inspections
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                      Mandatory in ~15 states including TX, NY, PA, VA, MA, and HI. The car must pass a mechanic's check before it can be registered.
                    </p>
                  </div>
                </div>
              </StepCard>
            </div>

            {/* Step 6: Lemon Laws */}
            <div id="lemon-laws">
              <StepCard
                stepNumber={6}
                title="Lemon Law Protection"
                description="Do you have any recourse if the car breaks down?"
                icon={Gavel}
              >
                <Callout variant="info">
                  <strong>Reality Check:</strong> Most used car sales are "As-Is." This means once you drive away, any problems are yours to fix. Lemon laws for used cars are very rare.
                </Callout>

                <div className="space-y-4">
                  <h4 className="font-semibold text-sm">Typical Lemon Law Limitations:</h4>
                  <ul className="grid sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2"><ArrowRight className="h-4 w-4 mt-0.5 text-primary" /> Only applies to dealer sales (not private party)</li>
                    <li className="flex items-start gap-2"><ArrowRight className="h-4 w-4 mt-0.5 text-primary" /> Must have an existing warranty</li>
                    <li className="flex items-start gap-2"><ArrowRight className="h-4 w-4 mt-0.5 text-primary" /> Issues must be reported within 30-90 days</li>
                    <li className="flex items-start gap-2"><ArrowRight className="h-4 w-4 mt-0.5 text-primary" /> Defect must substantially impair safety/value</li>
                  </ul>
                </div>
              </StepCard>
            </div>

            {/* Step 7: Final Checklist */}
            <div id="final-checklist">
              <StepCard
                stepNumber={7}
                title="Closing the Deal"
                description="The final steps to make it official."
                icon={Briefcase}
              >
                <Callout variant="checklist" title="Transaction Checklist">
                  <div className="space-y-1 mt-2">
                    <ChecklistItem>Meet in a safe public place (police station)</ChecklistItem>
                    <ChecklistItem>Verify Seller's ID matches the Title name</ChecklistItem>
                    <ChecklistItem>Sign Bill of Sale & Title Transfer</ChecklistItem>
                    <ChecklistItem>Exchange Payment for Keys & Title</ChecklistItem>
                    <ChecklistItem>Get Manuals & Service Records</ChecklistItem>
                    <ChecklistItem>Remove Seller's License Plates (in most states)</ChecklistItem>
                  </div>
                </Callout>

                <Callout variant="safety" className="mt-4">
                  Once the sale is complete, immediately call your insurance company to add the vehicle to your policy before driving home.
                </Callout>
              </StepCard>
            </div>

            {/* CTA Section */}
            <Card className="mt-10 overflow-hidden border-0 shadow-lg bg-gradient-to-br from-violet-600 via-violet-600/90 to-violet-700">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/20 mb-4">
                  <Gavel className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Ready to Sign on the Dotted Line?
                </h3>
                <p className="text-white/80 mb-6 max-w-md mx-auto">
                  Find a legitimate, verified vehicle on SK AutoSphere and buy with confidence.
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

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Table of Contents - Sticky */}
            <div className="sticky top-24">
              <TableOfContents items={tocItems} />

              {/* Quick CTA */}
              <Card className="mt-6 border shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-violet-500/10 to-transparent p-4 border-b">
                  <h4 className="font-semibold text-sm text-violet-900 dark:text-violet-100">🛡️ Verified Listings</h4>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    Our dealers are vetted to ensure clean titles and smooth transactions.
                  </p>
                  <Button asChild className="w-full gap-2 bg-violet-600 hover:bg-violet-700" size="sm">
                    <Link href="/shop">
                      Browse Safe Cars
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
                      { title: "Beginner's Guide", href: "/resources/buyer-guides/beginners-guide" },
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
