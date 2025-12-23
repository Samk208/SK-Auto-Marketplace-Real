"use client"

import { useTranslation } from "@/hooks/useTranslation"
import Link from "next/link"

interface SiteNavProps {
    className?: string
}

export function SiteNav({ className }: SiteNavProps) {
    const { t } = useTranslation()

    return (
        <nav className={`hidden md:flex items-center gap-6 text-sm ${className}`}>
            <Link href="/shop" className="transition-colors hover:text-foreground/80 text-foreground/60">
                {t("nav.shop_cars")}
            </Link>
            <Link href="/parts" className="transition-colors hover:text-foreground/80 text-foreground/60 font-medium text-[#2558fa]">
                {t("nav.shop_parts")}
            </Link>
            <Link href="/dealers" className="transition-colors hover:text-foreground/80 text-foreground/60">
                {t("nav.dealers")}
            </Link>
            <Link href="/orders" className="transition-colors hover:text-foreground/80 text-foreground/60">
                {t("nav.orders")}
            </Link>
            <Link href="/resources" className="transition-colors hover:text-foreground/80 text-foreground/60">
                {t("nav.resources")}
            </Link>
            <Link href="/blog" className="transition-colors hover:text-foreground/80 text-foreground/60">
                {t("nav.blog")}
            </Link>
        </nav>
    )
}
