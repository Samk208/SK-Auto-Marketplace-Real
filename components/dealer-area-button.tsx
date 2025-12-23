"use client"

import { Button } from "@/components/ui/button"
import { useTranslation } from "@/hooks/useTranslation"
import Link from "next/link"

export function DealerAreaButton() {
    const { t } = useTranslation()

    return (
        <Link href="/dealer/dashboard" className="hidden md:inline">
            <Button variant="ghost" size="sm">
                {t("nav.dealer_area")}
            </Button>
        </Link>
    )
}
