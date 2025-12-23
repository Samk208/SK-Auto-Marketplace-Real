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
  Activity,
  AlertTriangle,
  Armchair,
  ArrowRight,
  Car,
  CheckCircle,
  Disc,
  Eye,
  FileCheck,
  FileText,
  Gauge,
  History,
  Layers,
  Settings,
  ShieldAlert,
  Thermometer,
  Wrench
} from "lucide-react"
import Link from "next/link"

export default function InspectionChecklistPage() {
  const tocItems = [
    { id: "required-documents", title: "Required Documents", number: 1 },
    { id: "exterior-inspection", title: "Exterior Inspection", number: 2 },
    { id: "tire-inspection", title: "Tire Inspection", number: 3 },
    { id: "under-the-hood", title: "Under the Hood", number: 4 },
    { id: "interior-electronics", title: "Interior & Electronics", number: 5 },
    { id: "test-drive", title: "Test Drive", number: 6 },
    { id: "professional-inspection", title: "Professional Inspection", number: 7 },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <ArticleHero
        title="Vehicle Inspection Checklist"
        subtitle="Complete this checklist before purchasing any used vehicle. Don't get stuck with a lemon—inspect it thoroughly first."
        category="Buyer's Guide"
        readTime="~8 min read"
        badges={["Checklist", "Essential", "Due Diligence"]}
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
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Quick Overview
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  8 key areas to inspect before you buy
                </p>
              </div>
              <CardContent className="pt-6">
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { icon: FileCheck, text: "VIN verification" },
                    { icon: History, text: "Vehicle history report" },
                    { icon: Car, text: "Exterior body check" },
                    { icon: Armchair, text: "Interior condition" },
                    { icon: Settings, text: "Engine inspection" },
                    { icon: Disc, text: "Tire condition" },
                    { icon: Activity, text: "Brake performance" },
                    { icon: Wrench, text: "Mechanic inspection" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 hover:bg-primary/5 transition-colors group"
                    >
                      <div className="h-8 w-8 rounded-lg bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <item.icon className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Callout variant="info" title="Before You Begin">
              Print this checklist or keep it open on your phone when viewing a car. Being thorough now can save you from expensive repairs later.
            </Callout>

            {/* Step 1: Required Documents */}
            <div id="required-documents">
              <StepCard
                stepNumber={1}
                title="Required Documents"
                description="Ensure all documents are ready and match the vehicle."
                icon={FileText}
              >
                <p className="text-muted-foreground mb-4">
                  Paperwork is just as important as the car itself. Verify the legal status of the vehicle before inspecting the mechanical condition.
                </p>

                <div className="space-y-2 mb-4">
                  <FeatureBullet
                    title="Verify the VIN"
                    description="Match VIN on dashboard with title, registration, and door jamb sticker."
                    icon={<FileCheck className="h-4 w-4 text-blue-500" />}
                  />
                  <FeatureBullet
                    title="Vehicle History Report"
                    description="Use Carfax or AutoCheck to spot accidents and ownership history."
                    icon={<History className="h-4 w-4 text-purple-500" />}
                    highlight
                  />
                  <FeatureBullet
                    title="Service Records"
                    description="Request maintenance logs to ensure the car was cared for."
                    icon={<Layers className="h-4 w-4 text-slate-500" />}
                  />
                </div>

                <Callout variant="warning" title="Red Flags">
                  <div className="space-y-1">
                    <p>Be wary if the VIN doesn't match across documents or if the title status is listed as:</p>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 mt-1">
                      <li><strong>Salvage:</strong> Was considered a total loss by insurance.</li>
                      <li><strong>Rebuilt:</strong> Was salvaged and repaired (quality varies wildly).</li>
                      <li><strong>Flood:</strong> Has confirmed water damage.</li>
                    </ul>
                  </div>
                </Callout>
              </StepCard>
            </div>

            {/* Step 2: Exterior Inspection */}
            <div id="exterior-inspection">
              <StepCard
                stepNumber={2}
                title="Exterior Inspection"
                description="Walk around the vehicle and look for signs of damage or neglect."
                icon={Car}
              >
                <p className="text-muted-foreground mb-4">
                  Inspect the car in broad daylight, preferably on a dry day (rain can hide paint defects).
                </p>

                <div className="grid sm:grid-cols-2 gap-3 mb-4">
                  {[
                    { label: "Mismatched paint colors", sub: "Indicates repairs" },
                    { label: "Panel gaps & misalignment", sub: "Suggests frame damage" },
                    { label: "Rust spots", sub: "Check wheel wells & door edges" },
                    { label: "Cracked glass", sub: "Windows, mirrors, & lights" },
                    { label: "Lights functionality", sub: "Headlights, signals, brake lights" },
                    { label: "Undercarriage check", sub: "Look for fluid leaks" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                      <Eye className="h-4 w-4 text-primary mt-1" />
                      <div>
                        <div className="text-sm font-medium">{item.label}</div>
                        <div className="text-xs text-muted-foreground">{item.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <Callout variant="tip">
                  Open and close all doors, the hood, and the trunk. They should move smoothly and close securely without excessive force.
                </Callout>
              </StepCard>
            </div>

            {/* Step 3: Tire Inspection */}
            <div id="tire-inspection">
              <StepCard
                stepNumber={3}
                title="Tire Inspection"
                description="Tires are expensive—make sure they don't need immediate replacement."
                icon={Disc}
              >
                <div className="space-y-4">
                  <FeatureBullet
                    title="Tread Depth"
                    description="Should be at least 4/32 inch. Use the 'penny test'—if you see Abe Lincoln's entire head, you need new tires."
                    icon={<Disc className="h-4 w-4 text-slate-500" />}
                  />
                  <FeatureBullet
                    title="Uneven Wear"
                    description="Wear on just the inside or outside edges typically indicates alignment or suspension issues."
                    icon={<AlertTriangle className="h-4 w-4 text-amber-500" />}
                  />
                </div>

                <Callout variant="checklist" title="Tire Checklist" className="mt-4">
                  <div className="space-y-1 mt-2">
                    <ChecklistItem>All 4 tires match brand and size</ChecklistItem>
                    <ChecklistItem>No sidewall cracks, bulges, or rot</ChecklistItem>
                    <ChecklistItem>Spare tire is present and inflated</ChecklistItem>
                    <ChecklistItem>Jack and lug wrench are in the vehicle</ChecklistItem>
                  </div>
                </Callout>
              </StepCard>
            </div>

            {/* Step 4: Under the Hood */}
            <div id="under-the-hood">
              <StepCard
                stepNumber={4}
                title="Under the Hood"
                description="Check the heart of the vehicle for leaks and maintenance."
                icon={Settings}
              >
                <Callout variant="safety" title="Safety Warning">
                  Make sure the engine is cool before touching any hoses, caps, or double-checking fluids.
                </Callout>

                <div className="space-y-2 mt-4">
                  <FeatureBullet
                    title="Oil Condition"
                    description="Pull the dipstick. Oil should be amber/brown. Black/sludge is bad; milky/frothy indicates head gasket failure."
                    icon={<Layers className="h-4 w-4 text-amber-600" />}
                    highlight
                  />
                  <FeatureBullet
                    title="Fluid Levels"
                    description="Check transmission, coolant, brake, and power steering fluids."
                    icon={<Thermometer className="h-4 w-4 text-blue-500" />}
                  />
                  <FeatureBullet
                    title="Belts & Hoses"
                    description="Squeeze hoses (should be firm, not crunchy). Check belts for fraying."
                    icon={<Activity className="h-4 w-4 text-slate-500" />}
                  />
                  <FeatureBullet
                    title="Battery"
                    description="Check terminals for white/green corrosion. Look for a date sticker."
                    icon={<Settings className="h-4 w-4 text-red-500" />}
                  />
                </div>
              </StepCard>
            </div>

            {/* Step 5: Interior & Electronics */}
            <div id="interior-electronics">
              <StepCard
                stepNumber={5}
                title="Interior & Electronics"
                description="Test every button, switch, and knob inside the cabin."
                icon={Armchair}
              >
                <div className="grid sm:grid-cols-2 gap-3 mb-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2 text-primary flex items-center gap-2">
                      <Thermometer className="h-4 w-4" /> Climate Control
                    </h4>
                    <ul className="text-sm space-y-1 text-muted-foreground list-disc pl-4">
                      <li>A/C blows cold quickly</li>
                      <li>Heater warms up</li>
                      <li>Defrosters work</li>
                      <li>Fan works at all speeds</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2 text-primary flex items-center gap-2">
                      <Settings className="h-4 w-4" /> Electronics
                    </h4>
                    <ul className="text-sm space-y-1 text-muted-foreground list-disc pl-4">
                      <li>All windows & locks</li>
                      <li>Audio & Navigation</li>
                      <li>Dashboard lights work</li>
                      <li>Sunroof operation</li>
                    </ul>
                  </div>
                </div>

                <FeatureBullet
                  title="Smell Test"
                  description="Check for mold/mildew (water damage) or heavy smoke/deodorant cover-ups."
                  icon={<ShieldAlert className="h-4 w-4 text-orange-500" />}
                />
              </StepCard>
            </div>

            {/* Step 6: Test Drive */}
            <div id="test-drive">
              <StepCard
                stepNumber={6}
                title="Test Drive"
                description="The most critical part. Do not play the radio—listen to the car."
                icon={Gauge}
              >
                <p className="text-muted-foreground mb-4">
                  Drive for at least 20 minutes. Include city streets, highways, and parking maneuvers.
                </p>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Car className="h-4 w-4 text-primary" /> Driving Performance
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Engine starts easily & idles smoothly</div>
                      <div className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Acceleration is responsive</div>
                      <div className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Transmission shifts smoothly</div>
                      <div className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Steering is straight (doesn't pull)</div>
                      <div className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />No unusual vibrations</div>
                      <div className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Cruise control works</div>
                    </div>
                  </div>

                  <Separator className="border-border/50" />

                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Activity className="h-4 w-4 text-red-500" /> Brake System
                    </h4>
                    <div className="space-y-2">
                      <FeatureBullet
                        title="Pedal Feel"
                        description="Brake pedal should feel firm, not spongy or soft."
                        icon={<Activity className="h-4 w-4 text-slate-400" />}
                      />
                      <FeatureBullet
                        title="Stopping Power"
                        description="Car should stop straight without pulling to one side or shaking."
                        icon={<Activity className="h-4 w-4 text-slate-400" />}
                      />
                      <FeatureBullet
                        title="Noise"
                        description="Listen for grinding or squealing noises when breaking."
                        icon={<Activity className="h-4 w-4 text-slate-400" />}
                      />
                    </div>
                  </div>
                </div>
              </StepCard>
            </div>

            {/* Step 7: Professional Inspection */}
            <div id="professional-inspection">
              <StepCard
                stepNumber={7}
                title="Professional Inspection"
                description="For peace of mind, get an expert opinion."
                icon={Wrench}
              >
                <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center shrink-0">
                      <Wrench className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-amber-900 dark:text-amber-100 mb-2">
                        Highly Recommended
                      </h3>
                      <p className="text-amber-800 dark:text-amber-200 mb-4">
                        For <strong>$100-200</strong>, a qualified mechanic can perform a compression test, computer scan, and lift inspection to find what you missed.
                      </p>
                      <ul className="space-y-1 text-sm text-amber-800 dark:text-amber-300">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" /> Computer diagnostic scan (OBDII)
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" /> Frame damage assessment
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" /> Suspension & alignment check
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" /> Estimated repair costs
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </StepCard>
            </div>

            {/* CTA Section */}
            <Card className="mt-10 overflow-hidden border-0 shadow-lg bg-gradient-to-br from-primary via-primary/90 to-primary/80">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/20 mb-4">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Ready to Shop with Confidence?
                </h3>
                <p className="text-white/80 mb-6 max-w-md mx-auto">
                  Now that you know what to look for, browse thousands of verified listings on SK AutoSphere.
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
                <div className="bg-gradient-to-r from-primary/10 to-transparent p-4 border-b">
                  <h4 className="font-semibold text-sm">🚗 Find Your Car</h4>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    Start your search on SK AutoSphere today.
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
                      { title: "Beginner's Guide to Buying", href: "/resources/buyer-guides/beginners-guide" },
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

function Separator({ className }: { className?: string }) {
  return <div className={`h-[1px] w-full bg-border ${className}`} />
}
