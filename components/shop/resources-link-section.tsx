import Link from "next/link"
import { BookOpen, FileText, Ship, HelpCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const RESOURCES = [
  {
    title: "Buyer's Guide",
    description: "Learn how to import Korean vehicles to Africa",
    icon: BookOpen,
    href: "/resources/buyer-guides/beginners-guide",
  },
  {
    title: "Port Information",
    description: "Shipping details for African ports",
    icon: Ship,
    href: "/resources/buyer-guides/financing",
  },
  {
    title: "Documentation",
    description: "Required documents for import/export",
    icon: FileText,
    href: "/resources/legal/terms",
  },
  {
    title: "FAQ",
    description: "Common questions answered",
    icon: HelpCircle,
    href: "/resources",
  },
]

export function ResourcesLinkSection() {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Resources & Guides</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {RESOURCES.map((resource) => (
          <Link key={resource.href} href={resource.href}>
            <Card className="hover:shadow-md transition-shadow h-full">
              <CardContent className="p-4">
                <resource.icon className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold mb-1">{resource.title}</h3>
                <p className="text-sm text-muted-foreground">{resource.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
