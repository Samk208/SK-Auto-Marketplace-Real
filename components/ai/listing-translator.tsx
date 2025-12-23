"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Check, Copy, Languages } from "lucide-react"
import { useState } from "react"

async function translateWithApi(text: string, lang: string) {
  const res = await fetch('/api/ai/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, targetLanguage: lang })
  });

  if (!res.ok) throw new Error("Translation request failed");

  const data = await res.json();
  return data.translatedText;
}

export function ListingTranslator() {
  const [originalText, setOriginalText] = useState("")
  const [targetLang, setTargetLang] = useState("")
  const [translatedText, setTranslatedText] = useState("")
  const [isTranslating, setIsTranslating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleTranslate = async () => {
    if (!originalText || !targetLang) return

    setIsTranslating(true)
    setError(null)

    try {
      const translated = await translateWithApi(originalText, targetLang)
      setTranslatedText(translated)
    } catch (err) {
      console.error("Translation error:", err)
      setError("Failed to translate. Please try again.")
    } finally {
      setIsTranslating(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(translatedText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Languages className="h-5 w-5 text-primary" />
          Multilingual Listing Translator
        </CardTitle>
        <CardDescription>Translate your listings to reach buyers across Africa</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="original">Original Listing Text</Label>
          <Textarea
            id="original"
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            placeholder="Enter your listing title and description..."
            className="min-h-32"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">Target Language</Label>
          <Select value={targetLang} onValueChange={setTargetLang}>
            <SelectTrigger id="language">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fr">Français (French)</SelectItem>
              <SelectItem value="sw">Kiswahili (Swahili)</SelectItem>
              <SelectItem value="ar">العربية (Arabic)</SelectItem>
              <SelectItem value="pt">Português (Portuguese)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleTranslate} disabled={!originalText || !targetLang || isTranslating} className="w-full">
          {isTranslating ? (
            <>
              <Languages className="h-4 w-4 mr-2 animate-pulse" />
              Translating...
            </>
          ) : (
            <>
              <Languages className="h-4 w-4 mr-2" />
              Translate Listing
            </>
          )}
        </Button>

        {error && (
          <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-md flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {translatedText && (
          <div className="space-y-2 pt-4 border-t">
            <div className="flex items-center justify-between">
              <Label>Translated Text</Label>
              <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <Textarea value={translatedText} readOnly className="min-h-32" />
            <p className="text-xs text-muted-foreground">
              Powered by Google Gemini AI - Optimized for automotive terminology.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
