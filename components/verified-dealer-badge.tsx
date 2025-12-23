import { BadgeCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface VerifiedDealerBadgeProps {
  verified: boolean
  className?: string
}

export function VerifiedDealerBadge({ verified, className = "" }: VerifiedDealerBadgeProps) {
  if (!verified) return null

  return (
    <Badge variant="default" className={`gap-1 bg-blue-600 hover:bg-blue-700 ${className}`}>
      <BadgeCheck className="h-3 w-3" />
      <span>Verified Dealer</span>
    </Badge>
  )
}
