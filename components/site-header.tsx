import { UserMenu } from "@/components/auth/user-menu"
import { DealerAreaButton } from "@/components/dealer-area-button"
import { LanguageSwitcher } from "@/components/language-switcher"
import { NotificationBell } from "@/components/notifications/notification-bell"
import { SiteNav } from "@/components/site-nav"
import { Car } from "lucide-react"
import Link from "next/link"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <Car className="h-6 w-6" />
            <span className="font-bold text-xl">SK AutoSphere</span>
          </Link>
          <SiteNav />
        </div>
        <div className="flex items-center gap-4">
          <DealerAreaButton />
          <LanguageSwitcher />
          <NotificationBell />
          <UserMenu />
        </div>
      </div>
    </header>
  )
}



