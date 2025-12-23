"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { CheckCircle2, Loader2, UploadCloud } from "lucide-react"
import { useMemo, useState } from "react"

type KycDocType = "arc_front" | "arc_back" | "passport"

type UploadState = {
  status: "idle" | "uploading" | "done" | "error"
  url?: string
  error?: string
}

export default function ForeignerOnboardingPage() {
  const [step, setStep] = useState(1)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [docs, setDocs] = useState<Record<KycDocType, UploadState>>({
    arc_front: { status: "idle" },
    arc_back: { status: "idle" },
    passport: { status: "idle" },
  })

  const progress = useMemo(() => {
    const total = 3
    return Math.round((step / total) * 100)
  }, [step])

  const uploadedCount = useMemo(() => {
    return (Object.values(docs).filter((d) => d.status === "done").length)
  }, [docs])

  const uploadDoc = async (type: KycDocType, file: File) => {
    setDocs((prev) => ({ ...prev, [type]: { status: "uploading" } }))

    try {
      const form = new FormData()
      form.append("document", file)
      form.append("documentType", type)

      const res = await fetch("/api/foreigner/kyc-documents", {
        method: "POST",
        body: form,
        credentials: "include",
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || "Upload failed")
      }

      setDocs((prev) => ({
        ...prev,
        [type]: { status: "done", url: data?.url },
      }))
    } catch (e) {
      setDocs((prev) => ({
        ...prev,
        [type]: {
          status: "error",
          error: e instanceof Error ? e.message : "Upload failed",
        },
      }))
    }
  }

  const canContinueStep1 = fullName.trim().length > 1 && email.trim().length > 3
  const canContinueStep2 = uploadedCount >= 2

  return (
    <div className="container mx-auto max-w-4xl py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Foreigner Onboarding (Beta)</h1>
        <p className="mt-2 text-muted-foreground">
          A guided setup for expats to buy and own cars in Korea. This is an MVP flow from the Korea Lifestyle Platform strategy.
        </p>
      </div>

      <div className="mb-6">
        <Progress value={progress} />
        <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
          <span>Step {step} of 3</span>
          <span>{progress}%</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className={cn(step === 1 && "border-[#2558fa]")}
          >
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              1) Basic Info
              {step > 1 && <CheckCircle2 className="h-5 w-5 text-green-600" />}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g. Jane Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <Button className="w-full" disabled={!canContinueStep1} onClick={() => setStep(2)}>
              Continue
            </Button>
          </CardContent>
        </Card>

        <Card className={cn(step === 2 && "border-[#2558fa]")}
          >
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              2) Upload Documents
              {uploadedCount >= 2 && <Badge variant="outline">{uploadedCount}/3</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Upload at least 2 documents to proceed (ARC front/back and/or passport). Files are stored securely in Supabase Storage.
            </p>

            <DocUploadRow
              label="ARC Front"
              state={docs.arc_front}
              onFile={(file) => uploadDoc("arc_front", file)}
            />
            <DocUploadRow
              label="ARC Back"
              state={docs.arc_back}
              onFile={(file) => uploadDoc("arc_back", file)}
            />
            <DocUploadRow
              label="Passport"
              state={docs.passport}
              onFile={(file) => uploadDoc("passport", file)}
            />

            <Button className="w-full" disabled={!canContinueStep2} onClick={() => setStep(3)}>
              Continue
            </Button>
          </CardContent>
        </Card>

        <Card className={cn(step === 3 && "border-[#2558fa]")}
          >
          <CardHeader>
            <CardTitle>3) Next Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              You’re ready for the Korea ownership flow. Next we’ll guide you through:
            </p>
            <ul className="list-disc pl-5 text-sm">
              <li>Insurance quote basics (foreigner-friendly)</li>
              <li>Registration checklist (documents + where to go)</li>
              <li>Finding a car that matches your budget and visa duration</li>
            </ul>

            <div className="rounded-lg border p-4">
              <div className="font-medium">Recommended next</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Ask Jinnie for a step-by-step plan for your situation.
              </div>
              <div className="mt-3">
                <Button asChild>
                  <a href="/jinnie">Chat with Jinnie</a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function DocUploadRow({
  label,
  state,
  onFile,
}: {
  label: string
  state: UploadState
  onFile: (file: File) => void
}) {
  const isUploading = state.status === "uploading"

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
      <div className="min-w-0">
        <div className="font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">
          {state.status === "idle" && "Not uploaded"}
          {state.status === "uploading" && "Uploading..."}
          {state.status === "done" && "Uploaded"}
          {state.status === "error" && state.error}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {state.status === "done" && <CheckCircle2 className="h-5 w-5 text-green-600" />}
        {isUploading && <Loader2 className="h-5 w-5 animate-spin" />}
        <label className={cn(
          "inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm",
          isUploading && "pointer-events-none opacity-60"
        )}>
          <UploadCloud className="h-4 w-4" />
          <span>Upload</span>
          <input
            type="file"
            className="hidden"
            accept="image/*,application/pdf"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) onFile(file)
              e.currentTarget.value = ""
            }}
          />
        </label>
      </div>
    </div>
  )
}
