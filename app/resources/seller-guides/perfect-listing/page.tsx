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
  ArrowRight,
  Camera,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  FileCheck,
  FileText,
  Image,
  Lightbulb,
  MessageCircle,
  Search,
  Shield,
  Sparkles,
  Tag,
  User
} from "lucide-react"
import Link from "next/link"

export default function PerfectListingPage() {
  const tocItems = [
    { id: "photography", title: "Pro Photography Tips", number: 1 },
    { id: "description", title: "Writing the Description", number: 2 },
    { id: "pricing", title: "Pricing Strategy", number: 3 },
    { id: "communication", title: "Handling Inquiries", number: 4 },
    { id: "listing-checklist", title: "Final Checklist", number: 5 },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <ArticleHero
        title="Create the Perfect Listing"
        subtitle="Learn the secrets to creating high-converting vehicle listings that sell faster and for a better price."
        category="Seller's Guide"
        readTime="~15 min read"
        badges={["Best Practices", "Photography", "Sales"]}
        gradient="blue" // Using blue/indigo theme for sellers
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
              <div className="bg-gradient-to-r from-indigo-500/10 via-indigo-500/5 to-transparent px-6 py-4 border-b">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  The 4 Pillars of a Great Listing
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Master these areas to sell like a pro
                </p>
              </div>
              <CardContent className="pt-6">
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { icon: Camera, text: "High-Quality Photos" },
                    { icon: FileText, text: "Honest Description" },
                    { icon: Tag, text: "Competitive Pricing" },
                    { icon: MessageCircle, text: "Fast Response Time" },
                    { icon: Eye, text: "Detail-Oriented" },
                    { icon: CheckCircle, text: "Transparency" },
                    { icon: Search, text: "SEO Keywords" },
                    { icon: User, text: "Trust Building" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/10 hover:bg-indigo-100/50 dark:hover:bg-indigo-900/20 transition-colors group"
                    >
                      <div className="h-8 w-8 rounded-lg bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                        <item.icon className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Callout variant="tip" title="First Impressions Matter">
              Buyers spend an average of <strong>3 seconds</strong> looking at your main photo and price before deciding to click. Make them count.
            </Callout>

            {/* Step 1: Photography */}
            <div id="photography">
              <StepCard
                stepNumber={1}
                title="Professional-Quality Photos"
                description="Your photos are your 24/7 salesperson. Don't use blurry, dark, or dirty shots."
                icon={Camera}
              >
                <div className="grid gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border">
                    <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <Image className="h-4 w-4 text-primary" /> The "Money Shots" Checklist
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" /> Front 3/4 Angle (Hero Shot)
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" /> Rear 3/4 Angle
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" /> Driver's Seat & Cockpit
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" /> Odometer Reading
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" /> Engine Bay (Clean!)
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" /> Tire Tread Depth
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <FeatureBullet
                    title="Lighting is Key"
                    description="Shoot during 'Golden Hour' (early morning or just before sunset). Avoid harsh midday sun that creates deep shadows."
                    icon={<Lightbulb className="h-4 w-4 text-amber-500" />}
                  />
                  <FeatureBullet
                    title="Clean the Background"
                    description="Park in an empty parking lot or a nice park. Avoid messy garages, other cars, or trash bins in the frame."
                    icon={<Image className="h-4 w-4 text-blue-500" />}
                  />
                  <FeatureBullet
                    title="Be Honest About Flaws"
                    description="Take close-ups of scratches or dents. Transparency builds trust and prevents angry buyers later."
                    icon={<Camera className="h-4 w-4 text-slate-500" />}
                  />
                </div>
              </StepCard>
            </div>

            {/* Step 2: Description */}
            <div id="description">
              <StepCard
                stepNumber={2}
                title="Writing a Compelling Description"
                description="Don't just list specs. Tell the car's story."
                icon={FileText}
              >
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-sm mb-3">The Perfect Title Format</h4>
                    <div className="p-3 bg-muted rounded-lg font-mono text-xs md:text-sm text-muted-foreground border border-dashed border-primary/30">
                      [Year] [Make] [Model] [Trim] - [Mileage] - [Key Selling Point]
                      <br /><br />
                      <span className="text-primary font-bold">Example:</span> 2019 Toyota Camry SE - 45k Miles - One Owner, Dealer Serviced
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Description Structure</h4>
                    <FeatureBullet
                      title="The Hook"
                      description="Start with the best features (e.g., 'Low mileage,' 'New tires,' 'Under warranty')."
                    />
                    <FeatureBullet
                      title="The Facts"
                      description="List recent maintenance clearly. 'New brakes in Jan 2024, Oil change every 5k miles.'"
                    />
                    <FeatureBullet
                      title="The flaws"
                      description="A car with 'No issues' sounds fake. Mentioning 'Minor scratch on bumper' makes you credible."
                      highlight
                    />
                  </div>
                </div>
              </StepCard>
            </div>

            {/* Step 3: Pricing */}
            <div id="pricing">
              <StepCard
                stepNumber={3}
                title="Competitive Pricing Strategy"
                description="The #1 reason cars don't sell is unrealistic pricing."
                icon={DollarSign}
              >
                <div className="grid gap-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border bg-white dark:bg-slate-950 shadow-sm">
                      <h4 className="font-bold text-lg mb-1 text-green-600">$19,500</h4>
                      <p className="text-xs text-muted-foreground mb-3">Psychological Pricing</p>
                      <p className="text-sm">
                        Use just-below round numbers. $19,500 looks significantly cheaper than $20,000.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl border bg-white dark:bg-slate-950 shadow-sm">
                      <h4 className="font-bold text-lg mb-1 text-indigo-600">Comps</h4>
                      <p className="text-xs text-muted-foreground mb-3">Do Your Research</p>
                      <p className="text-sm">
                        Check KBB, Edmunds, and <strong>SK Auto listings</strong>. Price yours 5% below dealer retail for a quick sale.
                      </p>
                    </div>
                  </div>
                </div>

                <Callout variant="warning" className="mt-4">
                  <strong>Do not</strong> price your car based on what you "need" to get out of it, or what you owe on the loan. The market dictates the price, not your finances.
                </Callout>
              </StepCard>
            </div>

            {/* Step 4: Communication */}
            <div id="communication">
              <StepCard
                stepNumber={4}
                title="Handling Inquiries"
                description="Responsiveness wins the deal."
                icon={MessageCircle}
              >
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                    <Clock className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Speed is Critical</h4>
                      <p className="text-sm text-muted-foreground">
                        Reply within <strong>1 hour</strong> if possible. Serious buyers are contacting multiple sellers at once. The first to reply often gets the showing.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                    <Shield className="h-6 w-6 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Safety First</h4>
                      <p className="text-sm text-muted-foreground">
                        Keep conversation on the platform initially. Don't give out your home address. Arrange to meet in a public, well-lit place.
                      </p>
                    </div>
                  </div>
                </div>
              </StepCard>
            </div>

            {/* Step 5: Final Checklist */}
            <div id="listing-checklist">
              <StepCard
                stepNumber={5}
                title="Ready to Publish?"
                description="Double check these items before hitting submit."
                icon={FileCheck}
              >
                <Callout variant="checklist" title="Pre-Launch Checklist">
                  <div className="space-y-1 mt-2">
                    <ChecklistItem>20+ High resolution photos uploaded</ChecklistItem>
                    <ChecklistItem>VIN entered correctly (decodes to correct trim)</ChecklistItem>
                    <ChecklistItem>Mileage is exact</ChecklistItem>
                    <ChecklistItem>Price is competitive with similar local listings</ChecklistItem>
                    <ChecklistItem>Description includes 'Call to Action' (e.g., 'Text me to schedule test drive')</ChecklistItem>
                  </div>
                </Callout>
              </StepCard>
            </div>

            {/* CTA Section */}
            <Card className="mt-10 overflow-hidden border-0 shadow-lg bg-gradient-to-br from-indigo-600 via-indigo-600/90 to-indigo-700">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/20 mb-4">
                  <Camera className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Ready to Create Your Listing?
                </h3>
                <p className="text-white/80 mb-6 max-w-md mx-auto">
                  Put these tips to work and sell your vehicle fast on SK AutoSphere.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button size="lg" variant="secondary" asChild className="gap-2">
                    <Link href="/sell">
                      Start Selling
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="bg-transparent border-white/30 text-white hover:bg-white/10">
                    <Link href="/resources/seller-guides/pricing">
                      Pricing Guide
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
                <div className="bg-gradient-to-r from-indigo-500/10 to-transparent p-4 border-b">
                  <h4 className="font-semibold text-sm text-indigo-900 dark:text-indigo-100">📸 Need Help?</h4>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    Not sure what price to set? Use our AI valuation tool.
                  </p>
                  <Button asChild className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700" size="sm">
                    <Link href="/resources/seller-guides/pricing">
                      Get Value Estimate
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
                      { title: "Pricing Your Vehicle", href: "/resources/seller-guides/pricing" },
                      { title: "Required Seller Documents", href: "/resources/seller-guides/documents" },
                      { title: "Safety Tips for Sellers", href: "/resources/seller-guides/safety" },
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
