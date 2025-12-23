import { MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface RegionBadgeProps {
  region: string
  size?: "sm" | "md" | "lg"
}

export function RegionBadge({ region, size = "md" }: RegionBadgeProps) {
  const sizeClasses = {
    sm: "text-xs h-5",
    md: "text-sm h-6",
    lg: "text-base h-7",
  }

  return (
    <Badge variant="outline" className={`${sizeClasses[size]} gap-1 font-medium`}>
      <MapPin className="h-3 w-3" />
      <span>{region}</span>
    </Badge>
  )
}
