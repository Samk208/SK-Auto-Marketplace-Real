"use client"

import { useTranslation } from "@/hooks/useTranslation"
import { Award, FileCheck, Lock, Shield } from "lucide-react"

export function TrustStrip() {
  const { t } = useTranslation()

  const trustItems = [
    {
      icon: Shield,
      text: t("trust_strip.verified_sellers"),
      description: t("trust_strip.verified_sellers_desc"),
    },
    {
      icon: FileCheck,
      text: t("trust_strip.doc_verification"),
      description: t("trust_strip.doc_verification_desc"),
    },
    {
      icon: Award,
      text: t("trust_strip.quality_assurance"),
      description: t("trust_strip.quality_assurance_desc"),
    },
    {
      icon: Lock,
      text: t("trust_strip.secure_trans"),
      description: t("trust_strip.secure_trans_desc"),
    },
  ]

  return (
    <div className="bg-muted/50 border-y py-6">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {trustItems.map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center gap-2">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">{item.text}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
