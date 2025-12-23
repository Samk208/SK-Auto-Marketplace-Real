"use client"

import { Button } from "@/components/ui/button"
import { useTranslation } from "@/hooks/useTranslation"
import Link from "next/link"

export function CtaSection() {
    const { t } = useTranslation()

    return (
        <section className="py-20 md:py-28 bg-gradient-to-br from-primary via-primary to-accent text-white relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="container mx-auto px-4 text-center relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
                    {t("cta.title")}
                </h2>
                <p className="text-lg md:text-xl mb-10 opacity-90 max-w-2xl mx-auto leading-relaxed font-medium">
                    {t("cta.subtitle")}
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                    <Button
                        asChild
                        size="lg"
                        variant="secondary"
                        className="px-8 h-14 text-lg font-semibold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                    >
                        <Link href="/shop">{t("cta.button_buy")}</Link>
                    </Button>
                    <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="px-8 h-14 text-lg font-semibold bg-white/10 border-2 border-white/20 hover:bg-white/20 hover:border-white text-white backdrop-blur-sm shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                        <Link href="/dealers">{t("cta.button_sell")}</Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}
