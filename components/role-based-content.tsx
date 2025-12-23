"use client"
import { ShoppingCart, DollarSign } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface RoleBasedContentProps {
  role: "buyer" | "seller" | null
}

export function RoleBasedContent({ role }: RoleBasedContentProps) {
  if (!role) return null

  if (role === "buyer") {
    return (
      <Alert className="mb-6">
        <ShoppingCart className="h-4 w-4" />
        <AlertTitle>Buyer's Checklist</AlertTitle>
        <AlertDescription className="mt-2">
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Get vehicle history report before purchase</li>
            <li>Arrange professional inspection ($100-200)</li>
            <li>Verify seller's identity matches title</li>
            <li>Test drive in various conditions</li>
          </ul>
          <Button asChild variant="link" className="px-0 mt-2">
            <Link href="/resources/buyer-guides/beginners-guide">View Complete Buyer's Guide →</Link>
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  if (role === "seller") {
    return (
      <Alert className="mb-6">
        <DollarSign className="h-4 w-4" />
        <AlertTitle>Seller's Checklist</AlertTitle>
        <AlertDescription className="mt-2">
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Take 15-25 high-quality photos</li>
            <li>Write detailed, honest description</li>
            <li>Research comparable listings for pricing</li>
            <li>Gather all maintenance records and documents</li>
          </ul>
          <Button asChild variant="link" className="px-0 mt-2">
            <Link href="/resources/seller-guides/perfect-listing">View Complete Seller's Guide →</Link>
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return null
}
