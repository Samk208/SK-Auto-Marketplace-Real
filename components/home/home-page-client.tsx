"use client";

import { SKAutoCopilot } from "@/components/sk-auto-copilot";
import { TrustStrip } from "@/components/trust-strip";
import type { Locale } from "@/lib/i18n";
import type { UserRole } from "@/lib/role-context";
import { useState } from "react";

import { PublicVisionDemo } from "@/components/ai/public-vision-demo";
import { AboutUsSection } from "@/components/home/about-us-section";
import { AiFeaturesSectionV2 } from "@/components/home/ai-features-section-v2"; // TEST RUN ANIMATION
import { BrowseCarsSection } from "@/components/home/browse-cars-section";
import { CtaSection } from "@/components/home/cta-section";
import { DealersSection } from "@/components/home/dealers-section";
import { FeaturesSection } from "@/components/home/features-section";
import { FinancingSection } from "@/components/home/financing-section";
import { HeroSectionV2 } from "@/components/home/hero-section-v2"; // DRY RUN ANIMATION VERSION
import { HomeHeader } from "@/components/home/home-header";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { ResourcesSection } from "@/components/home/resources-section";
import { RoleSelectionSection } from "@/components/home/role-selection-section";
import { StatsSection } from "@/components/home/stats-section";
import { TrustSafetySection } from "@/components/home/trust-safety-section";
import type { CarListing } from "@/types";

interface HomePageClientProps {
  userMenu: React.ReactNode;
  initialListings: CarListing[];
}

export function HomePageClient({
  userMenu,
  initialListings,
}: HomePageClientProps) {
  const [locale, setLocale] = useState<Locale>("en");
  const [userRole, setUserRole] = useState<UserRole>(null);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

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

      <HeroSectionV2 userRole={userRole} onScrollTo={scrollToSection} />

      <AiFeaturesSectionV2 />
      <PublicVisionDemo />

      <RoleSelectionSection
        userRole={userRole}
        setUserRole={setUserRole}
        locale={locale}
      />

      <HowItWorksSection />

      <TrustStrip />

      <TrustSafetySection />

      <ResourcesSection />

      <FeaturesSection />

      <BrowseCarsSection initialListings={initialListings} />

      <DealersSection />

      <FinancingSection />

      <StatsSection />

      <AboutUsSection />

      <CtaSection />

      <SKAutoCopilot />
    </div>
  );
}
