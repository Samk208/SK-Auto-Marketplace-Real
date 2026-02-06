"use client";

import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import { useEffect, useState } from "react";

interface AuctionDecision {
  vehicle: string;
  price: number;
  action: "BID" | "HOLD" | "FOLD";
  confidence: number;
  profit: number;
}

export function AuctionTicker() {
  const [decisions, setDecisions] = useState<AuctionDecision[]>([]);

  // Simulate Live Feed
  useEffect(() => {
    const vehicles = [
      "Hyundai Santa Fe",
      "Kia Sorento",
      "Toyota Camry",
      "Hyundai Tucson",
      "Kia Sportage",
    ];
    const interval = setInterval(async () => {
      const vehicle = vehicles[Math.floor(Math.random() * vehicles.length)];
      const price = 4000 + Math.floor(Math.random() * 8000);

      // Call our RL Agent (Mocked via API)
      try {
        const res = await fetch("/api/ai/auction", {
          method: "POST",
          body: JSON.stringify({
            vehicle_id: "SIM-" + Date.now(),
            current_price: price,
            condition_grade: 85,
            market_value_nigeria: price * 1.6,
          }),
        });
        const data = await res.json();

        const newDecision: AuctionDecision = {
          vehicle,
          price,
          action: data.action,
          confidence: data.confidence,
          profit: data.expected_profit,
        };

        setDecisions((prev) => [newDecision, ...prev].slice(0, 5));
      } catch (e) {
        console.error(e);
      }
    }, 3000); // New auction every 3s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900 text-green-400 p-4 rounded-xl font-mono text-sm border border-slate-800 shadow-2xl relative overflow-hidden">
      {/* Scanline Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 pointer-events-none bg-[length:100%_2px,3px_100%] opacity-20" />

      <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Activity className="animate-pulse" size={16} />
          <span className="font-bold tracking-widest text-xs uppercase">
            Auction RL Swarm
          </span>
        </div>
        <div className="text-xs text-slate-500">LIVE FEED • PPO-MODEL-V1</div>
      </div>

      <div className="space-y-2 relative z-20">
        {decisions.map((d, i) => (
          <motion.div
            key={i + d.vehicle}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex justify-between items-center bg-slate-800/50 p-2 rounded border border-slate-700/50"
          >
            <div>
              <div className="text-white font-bold">{d.vehicle}</div>
              <div className="text-xs text-slate-400 opacity-70">
                Cur: ${d.price.toLocaleString()}
              </div>
            </div>

            <div className="text-right">
              <div
                className={`font-black text-lg ${d.action === "BID" ? "text-green-400" : "text-red-400"}`}
              >
                {d.action}
              </div>
              <div className="text-xs opacity-70">
                {Math.round(d.confidence * 100)}% Conf.
              </div>
            </div>
          </motion.div>
        ))}

        {decisions.length === 0 && (
          <div className="text-center py-8 opacity-50">
            Connecting to Auction Stream...
          </div>
        )}
      </div>
    </div>
  );
}
