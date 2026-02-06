"use client";

import { LanguageBadge } from "@/components/language-badge";
import { RegionBadge } from "@/components/region-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/lib/role-context";
import { motion, Variants } from "framer-motion";
import { Car, ChevronDown, Sparkles, Users } from "lucide-react";
import Image from "next/image";

import { useTranslation } from "@/hooks/useTranslation";

interface HeroSectionProps {
  userRole: UserRole;
  onScrollTo: (sectionId: string) => void;
}

export function HeroSectionV2({ userRole, onScrollTo }: HeroSectionProps) {
  const { t } = useTranslation();

  // Animation Variants - Enhanced for visibility
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Increased from 0.1 for more noticeable stagger
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 }, // Increased from 20px for more dramatic effect
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1, // Increased from 0.8 for smoother motion
        ease: [0.16, 1, 0.3, 1], // sk-motion-ease
      },
    },
  };

  return (
    <section className="relative overflow-hidden py-16 md:py-24 lg:py-28 bg-[#f8fafc] dark:bg-slate-950 min-h-[90vh] flex items-center">
      {/* Brand Pattern Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/bmw-x5.jpg"
          alt="Hero Background"
          fill
          priority
          className="object-cover opacity-10 blur-[2px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#f8fafc]/80 to-[#f8fafc] dark:from-slate-950/80 dark:to-slate-950" />
      </div>

      <div
        className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <Badge
              variant="secondary"
              className="mb-6 px-3 py-1.5 text-xs font-medium border border-border-subtle rounded-full shadow-sm"
            >
              Korea's Premier Car Marketplace
            </Badge>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 text-[#0f172a] dark:text-white leading-[1.1] tracking-tight max-w-4xl mx-auto"
            variants={itemVariants}
          >
            {t("homepage.hero_heading")}{" "}
            <span className="text-[#2558fa]">Today</span>
          </motion.h1>

          <motion.p
            className="text-base md:text-lg text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto"
            variants={itemVariants}
          >
            {t("homepage.hero_subheading")}
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-3 justify-center mb-6"
            variants={itemVariants}
          >
            <LanguageBadge
              languages={["English", "한국어", "Français"]}
              size="md"
            />
            <RegionBadge region="Ships to 15+ African Countries" size="md" />
          </motion.div>

          <motion.div
            className="flex flex-wrap gap-3 justify-center mb-8"
            variants={itemVariants}
          >
            <Button
              size="lg"
              className="px-8 h-12 text-base shadow-xl shadow-blue-600/20 transition-all duration-300 bg-[#2558fa] hover:bg-[#1a3ec1] text-white border-0 hover:scale-[1.02]"
              onClick={() =>
                onScrollTo(userRole === "seller" ? "dealers" : "browse")
              }
            >
              <Car className="mr-2 h-5 w-5" />
              {userRole === "seller" ? "Start Listing" : "Browse Cars"}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 h-12 text-base bg-surface hover:bg-primary-soft/50 border-border shadow-sm transition-all duration-300 hover:scale-[1.02]"
              onClick={() => onScrollTo("dealers")}
            >
              <Users className="mr-2 h-5 w-5" />
              For Dealers
            </Button>
            <Button
              size="lg"
              className="px-8 h-12 text-base bg-slate-900 text-white hover:bg-slate-800 border border-slate-700 shadow-xl shadow-purple-500/20 transition-all duration-300 hover:scale-[1.02] sk-pulse-purple"
              onClick={() => (window.location.href = "/ai")}
            >
              <Sparkles className="mr-2 h-5 w-5 text-purple-400" />
              AI Command Center
            </Button>
          </motion.div>

          <motion.div
            className="flex flex-wrap gap-4 justify-center items-center text-sm"
            variants={itemVariants}
          >
            <div className="flex items-center gap-2 bg-surface border border-border-subtle px-4 py-2 rounded-full shadow-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="font-medium text-foreground/90">
                10,000+ Verified Listings
              </span>
            </div>
            <div className="flex items-center gap-2 bg-surface border border-border-subtle px-4 py-2 rounded-full shadow-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span className="font-medium text-foreground/90">
                Trusted Dealer Network
              </span>
            </div>
            <div className="flex items-center gap-2 bg-surface border border-border-subtle px-4 py-2 rounded-full shadow-sm">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              <span className="font-medium text-foreground/90">
                Secure Transactions
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Animated Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-muted-foreground/50 pointer-events-none"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] uppercase tracking-widest font-medium">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
