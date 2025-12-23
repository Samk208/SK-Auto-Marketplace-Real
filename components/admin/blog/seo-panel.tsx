"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { AlertTriangle, BookOpen, Check, Info, Search, X } from "lucide-react"
import { useEffect, useState } from "react"

interface SeoPanelProps {
    title: string
    slug: string
    summary: string
    content: string
    seoTitle: string
    seoDescription: string
    focusKeyword: string
    onUpdate: (field: string, value: string) => void
}

export default function SeoPanel({
    title,
    slug,
    summary,
    content,
    seoTitle,
    seoDescription,
    focusKeyword,
    onUpdate,
}: SeoPanelProps) {
    const [analysis, setAnalysis] = useState({
        keywordInTitle: false,
        keywordInFirstPara: false,
        keywordInHeadings: 0,
        keywordDensity: 0,
        wordCount: 0,
        sentences: 0,
        avgWordsPerSentence: 0,
        readabilityScore: 0,
        readabilityLabel: "N/A",
    })

    const displayTitle = seoTitle || title
    const displayDesc = seoDescription || summary
    const displaySlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")

    useEffect(() => {
        analyzeContent()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [content, title, seoTitle, seoDescription, summary, focusKeyword])

    const analyzeContent = () => {
        // Strip HTML for text analysis
        const tempDiv = document.createElement("div")
        tempDiv.innerHTML = content
        const text = tempDiv.textContent || tempDiv.innerText || ""
        const words = text.split(/\s+/).filter(w => w.length > 0)

        // Basic Stats
        const wordCount = words.length
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length
        const avgWordsPerSentence = sentences > 0 ? Math.round(wordCount / sentences) : 0

        // Readability (Simplified Flesch-Kincaid)
        // 206.835 - 1.015(total words/total sentences) - 84.6(total syllables/total words)
        // We'll use a simplified heuristic since accurate syllable counting is complex
        const score = Math.max(0, Math.min(100, 100 - (avgWordsPerSentence * 1.5)))
        let readabilityLabel = "Difficult"
        if (score > 80) readabilityLabel = "Very Easy"
        else if (score > 70) readabilityLabel = "Easy"
        else if (score > 60) readabilityLabel = "Standard"
        else if (score > 50) readabilityLabel = "Fair"

        // Keyword Analysis
        let keywordInTitle = false
        let keywordInFirstPara = false
        let keywordInHeadings = 0
        let keywordDensity = 0

        if (focusKeyword) {
            const lowerKeyword = focusKeyword.toLowerCase()

            // In Title
            keywordInTitle = (seoTitle || title).toLowerCase().includes(lowerKeyword)

            // In First Paragraph
            const firstPara = tempDiv.querySelector("p")?.textContent || ""
            keywordInFirstPara = firstPara.toLowerCase().includes(lowerKeyword)

            // In Headings
            const headings = tempDiv.querySelectorAll("h1, h2, h3, h4, h5, h6")
            headings.forEach(h => {
                if (h.textContent?.toLowerCase().includes(lowerKeyword)) {
                    keywordInHeadings++
                }
            })

            // Density
            const matches = text.toLowerCase().split(lowerKeyword).length - 1
            keywordDensity = wordCount > 0 ? (matches / wordCount) * 100 : 0
        }

        setAnalysis({
            keywordInTitle,
            keywordInFirstPara,
            keywordInHeadings,
            keywordDensity: parseFloat(keywordDensity.toFixed(2)),
            wordCount,
            sentences,
            avgWordsPerSentence,
            readabilityScore: Math.round(score),
            readabilityLabel,
        })
    }

    const slugValid = {
        lowercase: /^[a-z0-9-]+$/.test(displaySlug),
        hyphens: !displaySlug.includes("_") && !displaySlug.includes(" "),
        keyword: focusKeyword ? displaySlug.includes(focusKeyword.toLowerCase().replace(/\s+/g, "-")) : false,
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Search className="w-5 h-5 text-[#2558fa]" />
                        Search Engine Optimization
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Focus Keyword */}
                    <div className="space-y-2">
                        <Label htmlFor="focusKeyword" className="font-semibold text-slate-900">
                            Focus Keyword
                            <span className="text-slate-500 font-normal ml-2">(Primary SEO target)</span>
                        </Label>
                        <Input
                            id="focusKeyword"
                            placeholder="e.g. import korean cars"
                            value={focusKeyword}
                            onChange={(e) => onUpdate("focus_keyword", e.target.value)}
                            className="focus:ring-[#2558fa]"
                        />

                        {focusKeyword && (
                            <div className="mt-4 p-4 bg-slate-50 rounded-lg space-y-2 border border-slate-100">
                                <div className="text-sm font-medium text-slate-900 mb-2">Keyword Analysis</div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600">In title</span>
                                    {analysis.keywordInTitle ? (
                                        <span className="text-green-600 flex items-center gap-1">
                                            <Check className="w-4 h-4" /> Found
                                        </span>
                                    ) : (
                                        <span className="text-red-500 flex items-center gap-1">
                                            <X className="w-4 h-4" /> Missing
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600">In first paragraph</span>
                                    {analysis.keywordInFirstPara ? (
                                        <span className="text-green-600 flex items-center gap-1">
                                            <Check className="w-4 h-4" /> Found
                                        </span>
                                    ) : (
                                        <span className="text-orange-500 flex items-center gap-1">
                                            <AlertTriangle className="w-4 h-4" /> Missing
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600">In headings</span>
                                    {analysis.keywordInHeadings > 0 ? (
                                        <span className="text-green-600 flex items-center gap-1">
                                            <Check className="w-4 h-4" /> Found in {analysis.keywordInHeadings}
                                        </span>
                                    ) : (
                                        <span className="text-slate-400 flex items-center gap-1">
                                            Not found
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600">Density</span>
                                    <span className={cn(
                                        "flex items-center gap-1 font-medium",
                                        analysis.keywordDensity >= 0.5 && analysis.keywordDensity <= 2.5 ? "text-green-600" : "text-orange-500"
                                    )}>
                                        {analysis.keywordDensity >= 0.5 && analysis.keywordDensity <= 2.5 && <Check className="w-4 h-4" />}
                                        {analysis.keywordDensity}% {
                                            analysis.keywordDensity < 0.5 ? "(Low)" :
                                                analysis.keywordDensity > 2.5 ? "(High)" : "(Optimal)"
                                        }
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Google Snippet Preview */}
                    <div className="space-y-2">
                        <Label className="font-semibold text-slate-900">Snippet Preview</Label>
                        <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="bg-slate-200 rounded-full w-4 h-4 flex-shrink-0" />
                                <div className="text-sm text-slate-800">skautosphere.com</div>
                                <span className="text-slate-400">›</span>
                                <div className="text-sm text-slate-600">blog</div>
                            </div>
                            <div className="text-[#1a0dab] text-xl font-medium hover:underline cursor-pointer truncate leading-tight">
                                {displayTitle || "Your Title Here"}
                            </div>
                            <div className="text-sm text-slate-600 mt-1 line-clamp-2">
                                {displayDesc || "Your description will appear here..."}
                            </div>
                        </div>
                    </div>

                    {/* Meta Fields */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label htmlFor="seoTitle" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Meta Title
                                </Label>
                                <span className={cn(
                                    "text-xs",
                                    displayTitle.length > 60 ? "text-red-500 font-medium" : "text-slate-500"
                                )}>
                                    {displayTitle.length}/60
                                </span>
                            </div>
                            <Input
                                id="seoTitle"
                                placeholder="SEO optimized title"
                                value={seoTitle}
                                onChange={(e) => onUpdate("seo_title", e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label htmlFor="seoDesc" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Meta Description
                                </Label>
                                <span className={cn(
                                    "text-xs",
                                    displayDesc.length > 160 ? "text-red-500 font-medium" : "text-slate-500"
                                )}>
                                    {displayDesc.length}/160
                                </span>
                            </div>
                            <Textarea
                                id="seoDesc"
                                placeholder="Compelling description for search results..."
                                value={seoDescription}
                                onChange={(e) => onUpdate("seo_description", e.target.value)}
                                className="h-24 resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slugVal" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                URL Slug
                            </Label>
                            <div className="flex items-center gap-1">
                                <span className="text-sm text-slate-400 bg-slate-50 px-2 py-2 rounded-l-md border border-r-0 border-slate-200">
                                    /blog/
                                </span>
                                <Input
                                    id="slugVal"
                                    value={slug}
                                    onChange={(e) => onUpdate("slug", e.target.value)}
                                    className="rounded-l-none"
                                />
                            </div>
                            <div className="flex gap-4 mt-1">
                                {slugValid.lowercase && (
                                    <span className="text-[10px] text-green-600 flex items-center gap-1">
                                        <Check className="w-3 h-3" /> Lowercase
                                    </span>
                                )}
                                {slugValid.hyphens && (
                                    <span className="text-[10px] text-green-600 flex items-center gap-1">
                                        <Check className="w-3 h-3" /> Hyphens
                                    </span>
                                )}
                                {slugValid.keyword && (
                                    <span className="text-[10px] text-green-600 flex items-center gap-1">
                                        <Check className="w-3 h-3" /> Keyword match
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Readability Score */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-[#2558fa]" />
                            Readability
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className={cn(
                                "text-2xl font-bold",
                                analysis.readabilityScore > 60 ? "text-green-600" : "text-orange-500"
                            )}>{analysis.readabilityScore}</span>
                            <span className="text-sm text-slate-400">/100</span>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium text-slate-700">{analysis.readabilityLabel}</span>
                            <span className="text-slate-500">Grade Level: 8-9</span>
                        </div>
                        <Progress value={analysis.readabilityScore} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-2 bg-slate-50 rounded text-center border border-slate-100">
                            <div className="text-lg font-bold text-slate-700">{analysis.wordCount}</div>
                            <div className="text-[10px] uppercase tracking-wide text-slate-500">Words</div>
                        </div>
                        <div className="p-2 bg-slate-50 rounded text-center border border-slate-100">
                            <div className="text-lg font-bold text-slate-700">{analysis.sentences}</div>
                            <div className="text-[10px] uppercase tracking-wide text-slate-500">Sentences</div>
                        </div>
                    </div>

                    {analysis.avgWordsPerSentence > 20 && (
                        <div className="mt-4 flex items-start gap-2 p-2 bg-orange-50 rounded text-xs text-orange-800 border border-orange-100">
                            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span>
                                <strong>Long sentences detected.</strong> Avg {analysis.avgWordsPerSentence} words/sentence. Try breaking them down for better readability on mobile.
                            </span>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
} 
