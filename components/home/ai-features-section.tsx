"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Banknote,
  Eye,
  FileText,
  Ship,
  Sparkles,
  Target,
} from "lucide-react";
import Link from "next/link";

export function AiFeaturesSection() {
  const productionAgents = [
    {
      name: "Document Intelligence",
      category: "LANGUAGE AI",
      icon: FileText,
      color: "text-green-500",
      bg: "bg-green-500/10",
      badge: "PRODUCTION",
      badgeColor: "bg-green-500 text-white",
      stats: ["300+ Documents", "92% Accuracy"],
      href: "/ai#document",
      desc: "Converts Korean auction sheets to English in 8 seconds. Verify vehicle history, mileage, and accident records instantly.",
    },
    {
      name: "Vision Inspector",
      category: "COMPUTER VISION",
      icon: Eye,
      color: "text-green-500",
      bg: "bg-green-500/10",
      badge: "PRODUCTION",
      badgeColor: "bg-green-500 text-white",
      stats: ["500+ Vehicles", "98% Accuracy"],
      href: "/ai#vision",
      desc: "47-point vehicle condition analysis. Detects dents, rust, fraud, and prior repairs with superhuman precision.",
    },
    {
      name: "Pricing Oracle",
      category: "PREDICTIVE ANALYTICS",
      icon: Banknote,
      color: "text-green-500",
      bg: "bg-green-500/10",
      badge: "PRODUCTION",
      badgeColor: "bg-green-500 text-white",
      stats: ["±3.5% Accuracy", "3,200 Auctions"],
      href: "/ai#pricing",
      desc: "Market price predictions trained on historical auction data to optimize dealer profits and ensure fair value.",
    },
  ];

  const roadmapAgents = [
    {
      name: "Logistics Navigator",
      category: "AUTOMATED LOGISTICS",
      icon: Ship,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      badge: "Q2 2026",
      badgeColor: "bg-blue-500 text-white",
      stats: ["10 Countries", "<2 Sec Response"],
      href: "/ai#logistics",
      desc: "Real-time customs duty calculator and end-to-end shipment tracking for African markets.",
    },
    {
      name: "Smart Matcher",
      category: "RECOMMENDATION ENGINE",
      icon: Target,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      badge: "Q3 2026",
      badgeColor: "bg-blue-500 text-white",
      stats: ["8,500+ Buyers", "65% Intent"],
      href: "/ai#matcher",
      desc: "Matches vehicles to qualified buyers using collaborative filtering to predict purchase intent.",
    },
  ];

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-bold uppercase tracking-widest mb-6">
            <Sparkles size={16} /> Proprietary Technology
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-6 text-slate-900 dark:text-white tracking-tight">
            AI-Powered{" "}
            <span className="text-blue-600">Trust Infrastructure</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
            5 specialized agents verify vehicle authenticity, inspect condition,
            and ensure transparent pricing. From Korean auctions to African
            ports, we automate trust at every step.
          </p>
        </div>

        {/* Production Agents (Tier 1) */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Production Agents (Live Now)
            </span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {productionAgents.map((agent, i) => (
              <Link key={i} href={agent.href} className="block group">
                <Card className="h-full border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500"></div>
                  <CardContent className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center ${agent.bg} ${agent.color}`}
                      >
                        <agent.icon size={28} />
                      </div>
                      <span
                        className={`px-3 py-1 rounded text-[10px] font-bold tracking-wider ${agent.badgeColor}`}
                      >
                        {agent.badge}
                      </span>
                    </div>

                    <div className="mb-4">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        {agent.category}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors">
                        {agent.name}
                      </h3>
                    </div>

                    <p className="text-sm text-slate-500 leading-relaxed mb-6 min-h-[60px]">
                      {agent.desc}
                    </p>

                    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100 dark:border-slate-900">
                      {agent.stats.map((stat, j) => (
                        <div
                          key={j}
                          className="text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 py-2 px-3 rounded-lg text-center"
                        >
                          {stat}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Roadmap Agents (Tier 2) */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Roadmap Agents (Coming Soon)
            </span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {roadmapAgents.map((agent, i) => (
              <Link
                key={i}
                href={agent.href}
                className="block group opacity-90 hover:opacity-100 transition-opacity"
              >
                <Card className="h-full border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:shadow-lg transition-all duration-300 border-dashed">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${agent.bg} ${agent.color}`}
                      >
                        <agent.icon size={20} />
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${agent.badgeColor}`}
                      >
                        {agent.badge}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-3 mb-2">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        {agent.name}
                      </h3>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {agent.category}
                      </span>
                    </div>

                    <p className="text-sm text-slate-500 leading-relaxed mb-4">
                      {agent.desc}
                    </p>

                    <div className="flex gap-3">
                      {agent.stats.map((stat, j) => (
                        <span
                          key={j}
                          className="text-[10px] font-medium text-slate-500 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded"
                        >
                          {stat}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Button
            asChild
            size="lg"
            className="h-14 px-8 text-lg rounded-full bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-blue-900/20 transition-all hover:scale-105"
          >
            <Link href="/ai" className="flex items-center gap-2">
              Launch Command Center <ArrowRight size={20} />
            </Link>
          </Button>
          <p className="mt-4 text-sm text-slate-400">
            See all 5 agents in action
          </p>
        </div>
      </div>
    </section>
  );
}
