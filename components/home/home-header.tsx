"use client"

import { LanguageSelector } from "@/components/language-selector"
import { NotificationBell } from "@/components/notifications/notification-bell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Locale } from "@/lib/i18n"
import { UserRole } from "@/lib/role-context"
import { Car, Sparkles } from "lucide-react"
import Link from "next/link"

interface HomeHeaderProps {
    locale: Locale
    setLocale: (locale: Locale) => void
    userRole: UserRole
    setUserRole: (role: UserRole) => void
    scrollToSection: (sectionId: string) => void
    userMenu: React.ReactNode
}

export function HomeHeader({ locale, setLocale, userRole, setUserRole, scrollToSection, userMenu }: HomeHeaderProps) {
    return (
        <header className="sticky top-0 z-50 border-b border-border-subtle bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-9 h-9 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-sm">
                                <Car className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                                SK AutoSphere
                            </span>
                        </Link>

                        <nav className="hidden md:flex items-center gap-6">
                            <Link
                                href="/shop"
                                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors relative group"
                            >
                                Shop Cars
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                            </Link>
                            <Link
                                href="/parts"
                                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors relative group"
                            >
                                Shop Parts
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                            </Link>
                            <Link
                                href="/find-vehicle"
                                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors relative group flex items-center gap-1"
                            >
                                <Sparkles className="h-3.5 w-3.5" />
                                AI Finder
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                            </Link>
                            <Link
                                href="/dealers"
                                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors relative group"
                            >
                                Dealers
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                            </Link>
                            <Link
                                href="/orders"
                                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors relative group"
                            >
                                Orders
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                            </Link>
                            <Link
                                href="/resources"
                                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors relative group"
                            >
                                Resources
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                            </Link>
                            <Link
                                href="/blog"
                                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors relative group"
                            >
                                Blog
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                            </Link>
                            <button
                                onClick={() => scrollToSection("financing")}
                                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors relative group"
                            >
                                Financing
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                            </button>
                            <button
                                onClick={() => scrollToSection("about")}
                                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors relative group"
                            >
                                About Us
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                            </button>
                        </nav>
                    </div>

                    <div className="flex items-center gap-3">
                        <LanguageSelector currentLocale={locale} onLocaleChange={setLocale} />
                        <NotificationBell />
                        {userRole ? (
                            <>
                                <Badge variant="secondary" className="text-xs font-medium border-primary/20 bg-primary/5 text-primary">
                                    {userRole === "buyer" ? "Buyer Account" : "Seller Account"}
                                </Badge>
                                <Button variant="ghost" size="sm" onClick={() => setUserRole(null)} className="h-8">
                                    Switch Role
                                </Button>
                                {userMenu}
                            </>
                        ) : (
                            <Button size="sm" className="hidden md:flex shadow-md hover:shadow-lg transition-all" onClick={() => scrollToSection("get-started")}>
                                Get Started
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}
