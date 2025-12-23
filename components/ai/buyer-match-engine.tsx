"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, TrendingUp, Calendar, Ship } from "lucide-react"
import { findVehicleMatches, type BuyerMatchResult } from "@/lib/mock-ai-data"
import Link from "next/link"

export function BuyerMatchEngine() {
  const [budget, setBudget] = useState("")
  const [destination, setDestination] = useState("")
  const [vehicleType, setVehicleType] = useState("")
  const [maxYear, setMaxYear] = useState("")
  const [matches, setMatches] = useState<BuyerMatchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = () => {
    if (!budget || !destination || !vehicleType) return

    setIsSearching(true)
    setTimeout(() => {
      const results = findVehicleMatches(
        Number.parseInt(budget),
        destination,
        vehicleType,
        maxYear ? Number.parseInt(maxYear) : undefined,
      )
      setMatches(results)
      setIsSearching(false)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            AI Vehicle Match Engine
          </CardTitle>
          <CardDescription>Tell us what you need and AI will find the perfect vehicles for you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Budget (USD)</Label>
              <Input
                id="budget"
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g., 15000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination">Destination Country</Label>
              <Select value={destination} onValueChange={setDestination}>
                <SelectTrigger id="destination">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ghana">Ghana</SelectItem>
                  <SelectItem value="Nigeria">Nigeria</SelectItem>
                  <SelectItem value="Kenya">Kenya</SelectItem>
                  <SelectItem value="Tanzania">Tanzania</SelectItem>
                  <SelectItem value="Uganda">Uganda</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleType">Vehicle Type</Label>
              <Select value={vehicleType} onValueChange={setVehicleType}>
                <SelectTrigger id="vehicleType">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bus">Bus</SelectItem>
                  <SelectItem value="Sedan">Sedan</SelectItem>
                  <SelectItem value="SUV">SUV</SelectItem>
                  <SelectItem value="Truck">Truck</SelectItem>
                  <SelectItem value="Van">Van</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxYear">Prefer Not Older Than (Optional)</Label>
              <Input
                id="maxYear"
                type="number"
                value={maxYear}
                onChange={(e) => setMaxYear(e.target.value)}
                placeholder="e.g., 2015"
              />
            </div>
          </div>

          <Button
            onClick={handleSearch}
            disabled={!budget || !destination || !vehicleType || isSearching}
            className="w-full"
            size="lg"
          >
            {isSearching ? (
              <>
                <Search className="h-4 w-4 mr-2 animate-pulse" />
                Finding matches...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Find My Perfect Vehicle
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Match Results */}
      {matches.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {matches.length} AI-Matched Vehicle{matches.length > 1 ? "s" : ""} Found
          </h3>

          {matches.map((match) => (
            <Card key={match.vehicleId} className="hover:border-primary transition-colors">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-xl font-bold mb-1">{match.title}</h4>
                        <p className="text-muted-foreground">
                          {match.year} {match.make} {match.model}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 flex items-center gap-1 text-base px-3 py-1"
                      >
                        <TrendingUp className="h-4 w-4" />
                        {match.matchScore}% Match
                      </Badge>
                    </div>

                    {/* Match Reasons */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Why this matches:</p>
                      <ul className="space-y-1">
                        {match.matchReasons.map((reason, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" />
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Export Route */}
                    <div className="flex items-center gap-4 text-sm pt-2 border-t">
                      <div className="flex items-center gap-2">
                        <Ship className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Export Route:</span>
                        <span>
                          {match.exportRoute.from} → {match.exportRoute.to}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{match.exportRoute.estimatedDays} days</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Sidebar */}
                  <div className="md:w-64 space-y-4">
                    <div className="bg-muted rounded-lg p-4 space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Vehicle Price</p>
                        <p className="text-2xl font-bold">${match.price.toLocaleString()}</p>
                      </div>
                      <div className="pt-2 border-t">
                        <p className="text-sm text-muted-foreground">Estimated Landed Cost</p>
                        <p className="text-xl font-bold text-primary">${match.landedCost.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Includes shipping, duties, and fees</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button className="w-full" asChild>
                        <Link href={`/shop?id=${match.vehicleId}`}>View Details</Link>
                      </Button>
                      <Button variant="outline" className="w-full bg-transparent" asChild>
                        <Link href={`/checkout/${match.vehicleId}`}>Reserve Now</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
