"use client";

import { DynamicPricingRecommendation } from "@/components/ai/dynamic-pricing-recommendation";

export function PricingOracleDemo() {
  return (
    <div className="h-full">
      <DynamicPricingRecommendation
        make="Kia"
        model="Sportage"
        year={2022}
        mileage={45000}
        currentPrice={18500}
      />
      <div className="mt-4 p-4 bg-slate-900/50 rounded-xl border border-slate-800 text-center">
        <p className="text-xs text-slate-400">
          *Demo Mode: Analysis based on real-time market data for{" "}
          <strong className="text-white">2022 Kia Sportage</strong>
        </p>
      </div>
    </div>
  );
}
