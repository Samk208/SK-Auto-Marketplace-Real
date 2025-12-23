"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Wand2, Copy, Check } from "lucide-react"
import { generateSmartListing, type SmartListingResult } from "@/lib/mock-ai-data"
import { Textarea } from "@/components/ui/textarea"

export function SmartListingGenerator() {
  const [make, setMake] = useState("")
  const [model, setModel] = useState("")
  const [year, setYear] = useState("")
  const [mileage, setMileage] = useState("")
  const [port, setPort] = useState("")
  const [result, setResult] = useState<SmartListingResult | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const handleGenerate = () => {
    if (!make || !model || !year || !mileage || !port) return

    setIsGenerating(true)
    setTimeout(() => {
      const generatedResult = generateSmartListing(make, model, Number.parseInt(year), Number.parseInt(mileage), port)
      setResult(generatedResult)
      setIsGenerating(false)
    }, 1500)
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          Smart Listing Generator
        </CardTitle>
        <CardDescription>AI-powered listing creation with optimized titles, descriptions, and pricing</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="make">Make</Label>
            <Select value={make} onValueChange={setMake}>
              <SelectTrigger id="make">
                <SelectValue placeholder="Select make" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Hyundai">Hyundai</SelectItem>
                <SelectItem value="Kia">Kia</SelectItem>
                <SelectItem value="Genesis">Genesis</SelectItem>
                <SelectItem value="Toyota">Toyota</SelectItem>
                <SelectItem value="Honda">Honda</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Input id="model" value={model} onChange={(e) => setModel(e.target.value)} placeholder="e.g., Sonata" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Input id="year" type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="2020" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mileage">Mileage (km)</Label>
            <Input
              id="mileage"
              type="number"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
              placeholder="50000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="port">Destination Port</Label>
            <Select value={port} onValueChange={setPort}>
              <SelectTrigger id="port">
                <SelectValue placeholder="Select port" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tema">Tema (Ghana)</SelectItem>
                <SelectItem value="Lagos">Lagos (Nigeria)</SelectItem>
                <SelectItem value="Mombasa">Mombasa (Kenya)</SelectItem>
                <SelectItem value="Dar es Salaam">Dar es Salaam (Tanzania)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={!make || !model || !year || !mileage || !port || isGenerating}
          className="w-full"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Wand2 className="h-4 w-4 mr-2 animate-spin" />
              Generating with AI...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Smart Listing
            </>
          )}
        </Button>

        {/* Generated Result */}
        {result && (
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Generated Listing</h3>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {result.aiConfidence.toFixed(0)}% Confidence
              </Badge>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Title</Label>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.title, "title")}>
                  {copiedField === "title" ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium">{result.title}</p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Description</Label>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.description, "description")}>
                  {copiedField === "description" ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <Textarea value={result.description} readOnly className="min-h-24" />
            </div>

            {/* Suggested Price */}
            <div className="space-y-2">
              <Label>Suggested Price</Label>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-primary">${result.suggestedPrice.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Based on market analysis</p>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label>Recommended Tags</Label>
              <div className="flex flex-wrap gap-2">
                {result.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Image Enhancements */}
            <div className="space-y-2">
              <Label>Image Enhancement Suggestions</Label>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {result.imageEnhancements.map((enhancement, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {enhancement}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
