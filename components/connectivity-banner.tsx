import { Phone, MessageSquare, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ConnectivityBannerProps {
  phone?: string
  whatsapp?: string
  email?: string
  className?: string
}

export function ConnectivityBanner({ phone, whatsapp, email, className = "" }: ConnectivityBannerProps) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {phone && (
        <Button variant="outline" size="sm" asChild>
          <a href={`tel:${phone}`} className="gap-2">
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">Call</span>
          </a>
        </Button>
      )}

      {whatsapp && (
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-green-600 text-green-700 hover:bg-green-50 bg-transparent"
          asChild
        >
          <a href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        </Button>
      )}

      {email && (
        <Button variant="outline" size="sm" asChild>
          <a href={`mailto:${email}`} className="gap-2">
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Email</span>
          </a>
        </Button>
      )}
    </div>
  )
}
