import { Globe } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface LanguageBadgeProps {
  languages: string[]
  size?: "sm" | "md" | "lg"
}

export function LanguageBadge({ languages, size = "md" }: LanguageBadgeProps) {
  if (languages.length === 0) return null

  const sizeClasses = {
    sm: "text-xs h-5",
    md: "text-sm h-6",
    lg: "text-base h-7",
  }

  return (
    <Badge variant="secondary" className={`${sizeClasses[size]} gap-1 font-medium`}>
      <Globe className="h-3 w-3" />
      <span>{languages.join(", ")}</span>
    </Badge>
  )
}
