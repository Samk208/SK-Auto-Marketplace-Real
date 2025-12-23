"use client"

import { SKAutoCopilot } from "@/components/sk-auto-copilot"
import { TrustStrip } from "@/components/trust-strip"
import type { Locale } from "@/lib/i18n"
import type { UserRole } from "@/lib/role-context"
import MarketplaceShop from "@/marketplace-shop"
import { useState } from "react"

import { PublicVisionDemo } from "@/components/ai/public-vision-demo"
import { AboutUsSection } from "@/components/home/about-us-section"
import { AiFeaturesSection } from "@/components/home/ai-features-section"
import { CtaSection } from "@/components/home/cta-section"
import { DealersSection } from "@/components/home/dealers-section"
import { FeaturesSection } from "@/components/home/features-section"
import { FinancingSection } from "@/components/home/financing-section"
import { HeroSection } from "@/components/home/hero-section"
import { HomeHeader } from "@/components/home/home-header"
import { HowItWorksSection } from "@/components/home/how-it-works-section"
import { ResourcesSection } from "@/components/home/resources-section"
import { RoleSelectionSection } from "@/components/home/role-selection-section"
import { StatsSection } from "@/components/home/stats-section"
import { TrustSafetySection } from "@/components/home/trust-safety-section"

interface HomePageClientProps {
    userMenu: React.ReactNode
}

export function HomePageClient({ userMenu }: HomePageClientProps) {
    const [locale, setLocale] = useState<Locale>("en")
    const [userRole, setUserRole] = useState<UserRole>(null)

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId)
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" })
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <HomeHeader
                locale={locale}
                setLocale={setLocale}
                userRole={userRole}
                setUserRole={setUserRole}
                scrollToSection={scrollToSection}
                userMenu={userMenu}
            />

            <HeroSection userRole={userRole} onScrollTo={scrollToSection} />

            <AiFeaturesSection />
            <PublicVisionDemo />

            <RoleSelectionSection userRole={userRole} setUserRole={setUserRole} locale={locale} />

            <HowItWorksSection />

            <TrustStrip />

            <TrustSafetySection />

            <ResourcesSection />

            <FeaturesSection />

            {/* Browse Cars Section */}
            <section id="browse" className="scroll-mt-24">
                <MarketplaceShop locale={locale} />
            </section>

            <DealersSection />

            <FinancingSection />

            <StatsSection />

            <AboutUsSection />

            <CtaSection />

            <SKAutoCopilot />
        </div>
    )
}
