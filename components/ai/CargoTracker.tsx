"use client";

import { motion } from "framer-motion";
import { Search, Ship } from "lucide-react";
import { useState } from "react";

export function CargoTracker() {
  const [bl, setBl] = useState("");
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/cargo", {
        method: "POST",
        body: JSON.stringify({ booking_ref: bl }),
      });
      const data = await res.json();
      setStatus(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-6 w-full max-w-md">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
        <Ship className="text-blue-600" /> Captain Cargo
      </h3>

      <div className="flex gap-2 mb-6">
        <input
          className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2 text-sm outline-none border border-transparent focus:border-blue-500"
          placeholder="Enter BL Number (e.g. SK-123X)"
          value={bl}
          onChange={(e) => setBl(e.target.value)}
        />
        <button
          onClick={handleTrack}
          disabled={loading}
          className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Search size={18} />
        </button>
      </div>

      {status && (
        <div className="space-y-6">
          {/* Map Viz (Abstract) */}
          <div className="h-32 bg-slate-100 dark:bg-slate-800 rounded-lg relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center" />

            {/* Route Line */}
            <div className="absolute h-1 w-3/4 bg-slate-300 top-1/2 left-1/2 -translate-x-1/2 rounded-full" />

            {/* Ship Icon Moving */}
            <motion.div
              initial={{ x: -100 }}
              animate={{ x: 0 }}
              className="absolute z-10 text-blue-600 bg-white rounded-full p-1 shadow-lg"
            >
              <Ship size={24} />
            </motion.div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Vessel</span>
              <span className="font-semibold">{status.vessel_name}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Status</span>
              <span
                className={`px-2 py-0.5 rounded text-xs font-bold ${status.status === "DOCKED" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}
              >
                {status.status}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Location</span>
              <span className="font-semibold">{status.current_location}</span>
            </div>

            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 text-xs rounded-lg border border-blue-100 dark:border-blue-800">
              🤖 <b>Captain says:</b> "{status.ai_message}"
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
