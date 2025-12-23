"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    ArrowRight,
    BookOpen,
    Car,
    CheckCircle2,
    FileCheck,
    FileText,
    Gavel,
    GraduationCap,
    HelpCircle,
    Scale,
    Search,
    ShieldCheck,
    Sparkles,
    TrendingUp,
    Users
} from "lucide-react"
import Link from "next/link"

export default function ResourcesPage() {
  const buyerResources = [
    {
      title: "Beginner's Guide to Buying",
      description: "Everything you need to know for your first car purchase. A complete step-by-step walkthrough.",
      icon: BookOpen,
      href: "/resources/buyer-guides/beginners-guide",
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      badge: "Popular"
    },
    {
      title: "Vehicle Inspection Checklist",
      description: "Don't get a lemon. Use this printable checklist to inspect every used car before you buy.",
      icon: FileCheck,
      href: "/resources/buyer-guides/inspection-checklist",
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      badge: "Essential"
    },
    {
      title: "Financing & Insurance",
      description: "Navigate auto loans, interest rates, and insurance requirements to save money.",
      icon: TrendingUp,
      href: "/resources/buyer-guides/financing",
      color: "text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      title: "Legal Requirements",
      description: "Registration, title transfers, bills of sale, and DMV paperwork explained simply.",
      icon: Scale,
      href: "/resources/buyer-guides/legal",
      color: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-900/20",
    },
  ]

  const sellerResources = [
    {
      title: "Create the Perfect Listing",
      description: "Take better photos and write descriptions that sell your car faster.",
      icon: BookOpen,
      href: "/resources/seller-guides/perfect-listing",
      color: "text-indigo-500",
      bg: "bg-indigo-50 dark:bg-indigo-900/20",
    },
    {
      title: "Pricing Your Vehicle",
      description: "How to value your car correctly in the current market.",
      icon: TrendingUp,
      href: "/resources/seller-guides/pricing",
      color: "text-green-500",
      bg: "bg-green-50 dark:bg-green-900/20",
    },
    {
      title: "Safety Tips for Sellers",
      description: "Best practices for meeting buyers and handling test drives safely.",
      icon: ShieldCheck,
      href: "/resources/seller-guides/safety",
      color: "text-red-500",
      bg: "bg-red-50 dark:bg-red-900/20",
      badge: "Safety First"
    },
    {
      title: "Required Seller Documents",
      description: "The paperwork you need to prepare to transfer ownership legally.",
      icon: FileText,
      href: "/resources/seller-guides/documents",
      color: "text-orange-500",
      bg: "bg-orange-50 dark:bg-orange-900/20",
    },
  ]

  const regulations = [
    {
      title: "Registration Requirements",
      description: "State-by-state guides on how to register your newly purchased vehicle.",
      icon: FileText,
      href: "/resources/regulations/registration",
      color: "text-slate-500",
      bg: "bg-slate-50 dark:bg-slate-900/20",
    },
    {
      title: "Emissions & Safety",
      description: "Understanding inspection rules and emissions standards in your area.",
      icon: Car,
      href: "/resources/regulations/emissions",
      color: "text-cyan-500",
      bg: "bg-cyan-50 dark:bg-cyan-900/20",
    },
    {
      title: "Title Transfer Process",
      description: "The nitty-gritty details of signing over a vehicle title correctly.",
      icon: Gavel,
      href: "/resources/regulations/title-transfer",
      color: "text-violet-500",
      bg: "bg-violet-50 dark:bg-violet-900/20",
    },
  ]

  // FAQ data
  const faqs = [
    {
      question: "How do I verify a seller's identity?",
      answer: "Look for the \"Verified Dealer\" badge on listings. All our dealers go through a verification process. Always meet in person at a safe location, and verify that the seller's ID matches the title or registration.",
      icon: ShieldCheck,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-blue-900/30"
    },
    {
      question: "What payment methods are safe?",
      answer: "We recommend using our secure escrow service for maximum protection. Bank transfers and cashier's checks are also acceptable. Avoid wire transfers or cryptocurrency for vehicle purchases unless using an escrow service.",
      icon: TrendingUp,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-100 dark:bg-green-900/30"
    },
    {
      question: "Do I really need a vehicle inspection?",
      answer: "Yes, absolutely. While not always mandatory, a professional inspection ($100-200) detects hidden mechanical issues that test drives miss, potentially saving you thousands. We offer AI-powered condition reports to help you assess vehicles remotely.",
      icon: CheckCircle2,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-100 dark:bg-amber-900/30"
    },
    {
      question: "How does shipping to Africa work?",
      answer: "SK AutoSphere specializes in Korean vehicle exports to Africa. We handle shipping from Busan port to major African ports including Lagos, Tema, Mombasa, and more. Each listing shows estimated shipping costs and delivery times.",
      icon: Car,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-100 dark:bg-purple-900/30"
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero Section - Using explicit gradient colors for reliability */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-white/5 to-transparent rounded-full blur-3xl" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative container py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30 border-white/30">
              <GraduationCap className="h-3 w-3 mr-1" />
              Knowledge Hub
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6">
              Master the Market
            </h1>
            <p className="text-lg md:text-xl leading-8 text-white/80 max-w-2xl mx-auto mb-10">
              Whether you're buying your first car or selling your tenth, our expert guides
              will help you navigate the process with confidence and avoid costly mistakes.
            </p>

            {/* Search bar */}
            <div className="flex w-full max-w-lg items-center mx-auto bg-white/10 p-2 rounded-2xl backdrop-blur-sm border border-white/20">
              <Search className="h-5 w-5 text-white/50 ml-3" />
              <Input
                type="text"
                placeholder="Search guides (e.g. 'inspection', 'title')..."
                className="bg-transparent border-0 text-white placeholder:text-white/50 focus-visible:ring-0 focus-visible:ring-offset-0 flex-1"
              />
              <Button className="bg-white text-blue-600 hover:bg-white/90" size="sm">
                Search
              </Button>
            </div>

            {/* Quick stats */}
            <div className="flex flex-wrap justify-center gap-6 mt-10 text-white/70 text-sm">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>11 Expert Guides</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>For Buyers & Sellers</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span>Updated Weekly</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-12 -mt-8 relative z-20">
        <Card className="shadow-xl border-0 overflow-hidden">
          <Tabs defaultValue="buyers" className="w-full">
            {/* Tab Header */}
            <div className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border-b px-6 py-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <TabsList className="grid w-full md:w-auto grid-cols-4 bg-white dark:bg-slate-800 shadow-sm">
                  <TabsTrigger value="buyers" className="gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/30">
                    <Users className="h-4 w-4 hidden sm:block" />
                    For Buyers
                  </TabsTrigger>
                  <TabsTrigger value="sellers" className="gap-2 data-[state=active]:bg-green-50 data-[state=active]:text-green-700 dark:data-[state=active]:bg-green-900/30">
                    <TrendingUp className="h-4 w-4 hidden sm:block" />
                    For Sellers
                  </TabsTrigger>
                  <TabsTrigger value="regulations" className="gap-2 data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700 dark:data-[state=active]:bg-amber-900/30">
                    <Scale className="h-4 w-4 hidden sm:block" />
                    Legal
                  </TabsTrigger>
                  <TabsTrigger value="parts" className="gap-2 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-900/30">
                    <BookOpen className="h-4 w-4 hidden sm:block" />
                    Parts
                  </TabsTrigger>
                </TabsList>
                <p className="text-sm text-muted-foreground hidden md:block">
                  Browse our curated collections
                </p>
              </div>
            </div>

            <CardContent className="p-6 md:p-8">

              {/* Buyers Tab */}
              <TabsContent value="buyers" className="space-y-8 animate-in fade-in-50 duration-500">
                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {buyerResources.map((resource, index) => (
                    <Link href={resource.href} key={index} className="group">
                      <Card className="h-full hover:shadow-lg transition-all duration-300 border hover:border-primary/50 group-hover:-translate-y-1">
                        <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                          <div className={`h-12 w-12 rounded-xl ${resource.bg} flex items-center justify-center shrink-0`}>
                            <resource.icon className={`h-6 w-6 ${resource.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                                {resource.title}
                              </CardTitle>
                              {resource.badge && (
                                <Badge variant="secondary" className="text-xs font-normal">
                                  {resource.badge}
                                </Badge>
                              )}
                            </div>
                            <CardDescription className="line-clamp-2">
                              {resource.description}
                            </CardDescription>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity -ml-1">
                            Read Guide <ArrowRight className="h-4 w-4 ml-1" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </TabsContent>

              {/* Sellers Tab */}
              <TabsContent value="sellers" className="space-y-8 animate-in fade-in-50 duration-500">
                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {sellerResources.map((resource, index) => (
                    <Link href={resource.href} key={index} className="group">
                      <Card className="h-full hover:shadow-lg transition-all duration-300 border hover:border-primary/50 group-hover:-translate-y-1">
                        <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                          <div className={`h-12 w-12 rounded-xl ${resource.bg} flex items-center justify-center shrink-0`}>
                            <resource.icon className={`h-6 w-6 ${resource.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                                {resource.title}
                              </CardTitle>
                              {resource.badge && (
                                <Badge variant="secondary" className="text-xs font-normal">
                                  {resource.badge}
                                </Badge>
                              )}
                            </div>
                            <CardDescription className="line-clamp-2">
                              {resource.description}
                            </CardDescription>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity -ml-1">
                            Read Guide <ArrowRight className="h-4 w-4 ml-1" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </TabsContent>

              {/* Regulations Tab */}
              <TabsContent value="regulations" className="space-y-8 animate-in fade-in-50 duration-500">
                <div className="grid md:grid-cols-3 gap-6">
                  {regulations.map((resource, index) => (
                    <Link href={resource.href} key={index} className="group">
                      <Card className="h-full hover:shadow-lg transition-all duration-300 border hover:border-primary/50 group-hover:-translate-y-1">
                        <CardHeader className="space-y-4">
                          <div className={`h-12 w-12 rounded-xl ${resource.bg} flex items-center justify-center`}>
                            <resource.icon className={`h-6 w-6 ${resource.color}`} />
                          </div>
                          <div>
                            <CardTitle className="text-lg group-hover:text-primary transition-colors mb-2">
                              {resource.title}
                            </CardTitle>
                            <CardDescription>
                              {resource.description}
                            </CardDescription>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity -ml-1">
                            Learn More <ArrowRight className="h-4 w-4 ml-1" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </TabsContent>
              {/* Parts & Maintenance Tab */}
              <TabsContent value="parts" className="space-y-8 animate-in fade-in-50 duration-500">
                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                  <Link href="/parts/guides" className="group">
                    <Card className="h-full hover:shadow-lg transition-all duration-300 border hover:border-primary/50 group-hover:-translate-y-1">
                      <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                        <div className="h-12 w-12 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                          <BookOpen className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg group-hover:text-primary transition-colors mb-2">
                            Parts Educational Hub
                          </CardTitle>
                          <CardDescription>
                            Access our dedicated knowledge base for Korean auto parts, including VIN identification, service schedules, and import guides.
                          </CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                          Visit Hub <ArrowRight className="h-4 w-4 ml-1" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/parts" className="group">
                    <Card className="h-full hover:shadow-lg transition-all duration-300 border hover:border-primary/50 group-hover:-translate-y-1">
                      <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                        <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                          <TrendingUp className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg group-hover:text-primary transition-colors mb-2">
                            Shop Parts
                          </CardTitle>
                          <CardDescription>
                            Browse our catalog of verified OEM and aftermarket parts for Hyundai, Kia, and more.
                          </CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                          Shop Now <ArrowRight className="h-4 w-4 ml-1" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border-b px-6 py-5">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-blue-600" />
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Quick answers to common questions about buying and selling
              </p>
            </div>
            <CardContent className="p-0">
              <div className="divide-y">
                {faqs.map((faq, index) => (
                  <div key={index} className="p-5 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                    <div className="flex gap-4">
                      <div className={`h-10 w-10 rounded-xl ${faq.bg} flex items-center justify-center shrink-0`}>
                        <faq.icon className={`h-5 w-5 ${faq.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">{faq.question}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="border-0 shadow-xl overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600">
            <CardContent className="p-8 md:p-12 text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/20 mb-6">
                <Car className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Ready to Find Your Perfect Vehicle?
              </h3>
              <p className="text-white/80 mb-8 max-w-lg mx-auto">
                Browse thousands of verified Korean vehicles ready for export to Africa. Start your journey today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-white/90 gap-2" asChild>
                  <Link href="/shop">
                    Browse Vehicles
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10" asChild>
                  <Link href="/dealers">
                    View Dealers
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
