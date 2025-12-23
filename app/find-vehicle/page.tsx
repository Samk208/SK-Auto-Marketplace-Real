"use client"

import { ShopHeader } from "@/components/shop/shop-header"
import { BuyerMatchEngine } from "@/components/ai/buyer-match-engine"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Target, TrendingUp, Shield } from "lucide-react"

export default function FindVehiclePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ShopHeader role="buyer" locale="en" />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Brain className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">AI-Powered Vehicle Finder</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tell us what you need and our AI will instantly match you with the perfect vehicles, complete with export
            routes and landed cost estimates
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <Target className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">Smart Matching</CardTitle>
              <CardDescription>
                AI analyzes your requirements and finds vehicles that perfectly match your needs and budget
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">Export Optimization</CardTitle>
              <CardDescription>
                Get the best shipping routes and estimated landed costs for your destination port
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">Verified Listings</CardTitle>
              <CardDescription>
                All matched vehicles are from verified dealers with complete documentation
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Main Matcher */}
        <BuyerMatchEngine />

        {/* How It Works */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4 list-decimal list-inside">
              <li className="text-muted-foreground">
                <span className="font-medium text-foreground">Enter Your Requirements:</span> Tell us your budget,
                destination, and vehicle preferences
              </li>
              <li className="text-muted-foreground">
                <span className="font-medium text-foreground">AI Analysis:</span> Our algorithm analyzes thousands of
                listings to find perfect matches
              </li>
              <li className="text-muted-foreground">
                <span className="font-medium text-foreground">Get Results:</span> See ranked matches with AI scores,
                export routes, and total landed costs
              </li>
              <li className="text-muted-foreground">
                <span className="font-medium text-foreground">Contact & Purchase:</span> Reach out to dealers directly
                or reserve your vehicle instantly
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
