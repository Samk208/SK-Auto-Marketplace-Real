"use client"

import { LanguageSelector } from "@/components/language-selector"
import { Button } from "@/components/ui/button"
import { Locale } from "@/lib/i18n"
import { Car, Sparkles } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export function PublicHeader() {
    const [locale, setLocale] = useState<Locale>("en")

    return (
        <header className="sticky top-0 z-50 border-b border-border-subtle bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-sm">
                            <Car className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            SK AutoSphere
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-6">
                        <Link href="/shop" className="text-sm font-medium hover:text-primary transition-colors">Browse Cars</Link>
                        <Link href="/parts" className="text-sm font-medium hover:text-primary transition-colors text-[#2558fa]">Shop Parts</Link>
                        <Link href="/find-vehicle" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> AI Finder
                        </Link>
                        <Link href="/shipping" className="text-sm font-medium hover:text-primary transition-colors">Shipping</Link>
                        <Link href="/dealers" className="text-sm font-medium hover:text-primary transition-colors">Dealers</Link>
                    </nav>

                    <div className="flex items-center gap-3">
                        <LanguageSelector currentLocale={locale} onLocaleChange={setLocale} />
                        <div className="hidden md:flex gap-2">
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/auth/login">Log in</Link>
                            </Button>
                            <Button size="sm" asChild>
                                <Link href="/auth/register">Sign up</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
