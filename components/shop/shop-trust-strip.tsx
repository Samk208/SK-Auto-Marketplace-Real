import { Shield, CheckCircle, TrendingUp, Globe } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function ShopTrustStrip() {
  const trustItems = [
    {
      icon: Shield,
      title: "50+ verified Korean dealers",
      description: "All dealers are pre-screened and certified",
    },
    {
      icon: CheckCircle,
      title: "200+ vehicles exported",
      description: "Successfully delivered across Africa",
    },
    {
      icon: Globe,
      title: "15+ African destination countries",
      description: "Nigeria, Ghana, Kenya, and more",
    },
    {
      icon: TrendingUp,
      title: "Secure inspections & transparent pricing",
      description: "Full vehicle history and condition reports",
    },
  ]

  return (
    <section className="py-12 bg-muted/30 border-t">
      <div className="container mx-auto px-4">
        <h3 className="text-2xl font-bold text-center mb-8">Why Choose SK AutoSphere</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustItems.map((item, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
