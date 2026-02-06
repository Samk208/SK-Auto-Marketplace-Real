"use client";

import { BuyerMatchEngine } from "@/components/ai/buyer-match-engine";
import { CargoTracker } from "@/components/ai/CargoTracker";
import { DocumentParserDemo } from "@/components/ai/document-parser-demo";
import { PricingOracleDemo } from "@/components/ai/pricing-oracle-demo";
import { VisionInspectorDemo } from "@/components/ai/vision-inspector-demo";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, Clock, Lock } from "lucide-react";
import { useEffect } from "react";

export default function DeepTechDashboard() {
  // Handle hash navigation for smooth scrolling to sections
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 font-sans selection:bg-blue-500/30 text-slate-200">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10 max-w-[1600px] mx-auto px-6 py-12 md:py-20">
        {/* Header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-6 border border-blue-500/20">
            <BrainCircuit className="w-4 h-4" />
            <span className="uppercase tracking-widest text-xs">
              Command Center v2.0
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4">
            AI Trust{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              Infrastructure
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl text-balance">
            Monitor and interact with our active neural networks. These agents
            autonomously process vehicles, verify condition, and optimize
            pricing in real-time.
          </p>
        </div>

        {/* Tier 1: Production Agents */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
            <span className="text-green-500 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Production Active
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* 1. Document Intelligence */}
            <section id="document" className="h-full scroll-mt-24">
              <DocumentParserDemo />
            </section>

            {/* 2. Vision Inspector */}
            <section id="vision" className="h-full scroll-mt-24">
              <VisionInspectorDemo />
            </section>

            {/* 3. Pricing Oracle */}
            <section id="pricing" className="h-full group scroll-mt-24">
              <Card className="bg-slate-900 border-slate-800 overflow-hidden h-full">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl font-bold text-white mb-2">
                        Pricing Oracle
                      </CardTitle>
                      <p className="text-slate-400 text-sm">
                        Real-time market valuation
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-green-500/30 text-green-400 bg-green-500/5"
                    >
                      LIVE
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="p-6 pt-0">
                    <PricingOracleDemo />
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>

        {/* Tier 2: Roadmap Agents */}
        <div>
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
            <span className="text-blue-500 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Roadmap (Q2-Q3 2026)
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 4. Logistics Navigator */}
            <section id="logistics" className="relative scroll-mt-24">
              <div className="absolute inset-0 bg-slate-950/80 z-10 flex items-center justify-center backdrop-blur-[2px]">
                <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl shadow-2xl text-center max-w-md">
                  <Badge className="bg-blue-500 mb-4 hover:bg-blue-600">
                    Coming Q2 2026
                  </Badge>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Logistics Navigator
                  </h3>
                  <p className="text-slate-400 mb-4">
                    End-to-end autonomous shipping coordination. Currently
                    tracking pilot shipments.
                  </p>
                  <Badge
                    variant="outline"
                    className="border-slate-700 text-slate-500"
                  >
                    <Lock className="w-3 h-3 mr-1" /> Access Restricted
                  </Badge>
                </div>
              </div>
              <div className="opacity-40 pointer-events-none grayscale filter">
                <CargoTracker />
              </div>
            </section>

            {/* 5. Smart Matcher */}
            <section id="matching" className="relative scroll-mt-24">
              <div className="absolute inset-0 bg-slate-950/80 z-10 flex items-center justify-center backdrop-blur-[2px]">
                <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl shadow-2xl text-center max-w-md">
                  <Badge className="bg-blue-500 mb-4 hover:bg-blue-600">
                    Coming Q3 2026
                  </Badge>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Smart Buyer Matcher
                  </h3>
                  <p className="text-slate-400 mb-4">
                    Predictive inventory allocation based on global buyer demand
                    patterns.
                  </p>
                  <Badge
                    variant="outline"
                    className="border-slate-700 text-slate-500"
                  >
                    <Lock className="w-3 h-3 mr-1" /> Access Restricted
                  </Badge>
                </div>
              </div>
              <div className="opacity-40 pointer-events-none grayscale filter">
                <BuyerMatchEngine />
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
