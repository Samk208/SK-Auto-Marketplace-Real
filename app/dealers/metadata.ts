import type { Metadata } from "next"
import { generateMarketplaceMetadata } from "@/components/seo-head"

export const metadata: Metadata = generateMarketplaceMetadata({
  title: "Verified Dealers",
  description:
    "Connect with trusted, verified car dealers across Africa. Browse dealer profiles, inventory, and customer reviews.",
  path: "/dealers",
  keywords: ["car dealers", "verified dealers", "dealer directory", "African dealerships"],
})
