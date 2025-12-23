import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Award, Building2, Globe, Mail, MapPin, Phone, Search, Shield, Star, Truck } from "lucide-react"
import Link from "next/link"

// Korean dealers who export to Africa
const KOREAN_DEALERS = [
  {
    id: "dealer-1",
    name: "Seoul Premium Motors",
    location: "Seoul, South Korea",
    rating: 4.8,
    reviews: 203,
    verified: true,
    specialties: ["Hyundai", "Genesis", "Luxury Sedans"],
    inventory: 68,
    phone: "+82 2 1234 5678",
    email: "export@seoulpremium.kr",
    exportsTo: ["Nigeria", "Ghana", "Kenya", "Tanzania"],
  },
  {
    id: "dealer-2",
    name: "Busan Commercial Vehicles",
    location: "Busan, South Korea",
    rating: 4.9,
    reviews: 156,
    verified: true,
    specialties: ["Buses", "Vans", "Commercial"],
    inventory: 42,
    phone: "+82 51 987 6543",
    email: "sales@busancommercial.kr",
    exportsTo: ["Nigeria", "Kenya", "South Africa", "Ghana"],
  },
  {
    id: "dealer-3",
    name: "Incheon Auto Export",
    location: "Incheon, South Korea",
    rating: 4.9,
    reviews: 127,
    verified: true,
    specialties: ["Kia", "SUVs", "Family Cars"],
    inventory: 55,
    phone: "+82 32 456 7890",
    email: "info@incheonexport.kr",
    exportsTo: ["Ghana", "Ivory Coast", "Senegal", "Cameroon"],
  },
  {
    id: "dealer-4",
    name: "Daegu EV Specialists",
    location: "Daegu, South Korea",
    rating: 4.7,
    reviews: 89,
    verified: true,
    specialties: ["Electric Vehicles", "Hybrids", "Kia EV6"],
    inventory: 31,
    phone: "+82 53 234 5678",
    email: "ev@daeguspecialists.kr",
    exportsTo: ["South Africa", "Morocco", "Egypt", "Kenya"],
  },
  {
    id: "dealer-5",
    name: "Gyeonggi Motors",
    location: "Suwon, South Korea",
    rating: 4.6,
    reviews: 94,
    verified: true,
    specialties: ["Hyundai Tucson", "Kia Sportage", "SUVs"],
    inventory: 73,
    phone: "+82 31 876 5432",
    email: "export@gyeonggimotors.kr",
    exportsTo: ["Nigeria", "Ghana", "Tanzania", "Uganda"],
  },
  {
    id: "dealer-6",
    name: "Korea Auto Hub",
    location: "Seoul, South Korea",
    rating: 4.8,
    reviews: 178,
    verified: true,
    specialties: ["Genesis", "Luxury", "Premium Export"],
    inventory: 45,
    phone: "+82 2 9876 1234",
    email: "luxury@koreaautohub.kr",
    exportsTo: ["Nigeria", "South Africa", "Kenya", "Ethiopia"],
  },
]

export default function DealersPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border-subtle bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-balance">Verified Korean Dealers</h1>
                <p className="text-foreground/60 mt-2">Trusted Korean auto dealers exporting quality vehicles to Africa</p>
              </div>
              <Link href="/">
                <Button variant="ghost">Back to Home</Button>
              </Link>
            </div>

            {/* Search */}
            <div className="flex gap-3 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
                <Input placeholder="Search by dealer name or location..." className="pl-9" />
              </div>
              <Button>Search</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Info Banner */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-900">Korean Export Specialists</p>
              <p className="text-sm text-blue-700">All dealers are based in South Korea and specialize in exporting quality vehicles to African countries. They handle documentation, shipping, and port delivery.</p>
            </div>
          </div>
        </div>

        {/* Dealers Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {KOREAN_DEALERS.map((dealer) => (
            <Card key={dealer.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{dealer.name}</h3>
                      {dealer.verified && (
                        <Badge variant="secondary" className="gap-1 bg-green-100 text-green-800">
                          <Shield className="h-3 w-3" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-foreground/60 mt-1">
                      <MapPin className="h-3 w-3" />
                      {dealer.location}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  <span className="font-medium">{dealer.rating}</span>
                  <span className="text-sm text-foreground/60">({dealer.reviews} reviews)</span>
                </div>
                <Badge variant="outline" className="gap-1">
                  <Award className="h-3 w-3" />
                  {dealer.inventory} vehicles
                </Badge>
              </div>

              {/* Specialties */}
              <div className="flex flex-wrap gap-2 mb-3">
                {dealer.specialties.map((specialty) => (
                  <Badge key={specialty} variant="secondary" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
              </div>

              {/* Exports To */}
              <div className="flex items-center gap-2 mb-4 text-sm text-foreground/70">
                <Truck className="h-4 w-4 text-primary" />
                <span>Exports to: {dealer.exportsTo.slice(0, 3).join(", ")}{dealer.exportsTo.length > 3 && "..."}</span>
              </div>

              <div className="space-y-2 text-sm text-foreground/70 mb-4">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {dealer.phone}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {dealer.email}
                </div>
              </div>

              <div className="flex gap-2">
                <Link href={`/shop?dealer=${dealer.id}`} className="flex-1">
                  <Button className="w-full" variant="default">
                    View Inventory
                  </Button>
                </Link>
                <Button variant="outline">Contact</Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center bg-muted/50 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-2">Are you a Korean dealer?</h2>
          <p className="text-foreground/60 mb-4">Join SK AutoSphere and reach thousands of African buyers looking for quality Korean vehicles.</p>
          <Link href="/dealers/become-dealer">
            <Button size="lg">Become a Verified Dealer</Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
