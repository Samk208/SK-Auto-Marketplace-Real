"use client";

import { motion } from "framer-motion";
import { Camera, Check, Scan } from "lucide-react";
import { useState } from "react";

export function PartsScanner() {
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const startScan = async () => {
    setScanning(true);
    setResult(null);
    setScanned(false);

    // Simulate API delay
    setTimeout(async () => {
      try {
        const res = await fetch("/api/ai/parts", {
          method: "POST",
          body: JSON.stringify({ image_url: "demo", vehicle_vin: "123" }),
        });
        const data = await res.json();
        setResult(data.analysis);
      } catch (e) {
        console.error(e);
      } finally {
        setScanning(false);
        setScanned(true);
      }
    }, 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-6 w-full max-w-md">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
        <Camera className="text-purple-600" /> Parts Vision AI
      </h3>

      <div
        className="relative aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden mb-6 flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 group cursor-pointer"
        onClick={startScan}
      >
        {!scanned && !scanning && (
          <div className="text-center text-slate-400">
            <Scan size={48} className="mx-auto mb-2 opacity-50" />
            <span className="text-sm">Click to Simulate Scan</span>
          </div>
        )}

        {/* Simulated Image */}
        {(scanning || scanned) && (
          <img
            src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=600"
            alt="Car Part"
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
        )}

        {/* Laser Effect */}
        {scanning && (
          <motion.div
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="absolute left-0 right-0 h-1 bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)] z-10"
          />
        )}
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800 p-4 rounded-lg"
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-bold text-lg text-purple-900 dark:text-purple-100">
              {result.part_name}
            </h4>
            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-bold flex items-center gap-1">
              <Check size={12} /> {Math.round(result.confidence * 100)}% Match
            </span>
          </div>
          <div className="text-sm space-y-1 text-slate-600 dark:text-slate-300">
            <div>
              OEM: <span className="font-mono">{result.oem_number}</span>
            </div>
            <div>Fits: {result.compatibility}</div>
            <div>Est: {result.estimated_price_krw.toLocaleString()} KRW</div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
