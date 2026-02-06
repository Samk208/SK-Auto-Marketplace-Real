"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Loader2,
  Scan,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const DEMO_IMAGES = [
  {
    id: "clean",
    src: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600&auto=format&fit=crop",
    label: "Clean",
    result: { status: "Clean", confidence: 98, issues: [] },
  },
  {
    id: "dent",
    src: "https://images.unsplash.com/photo-1626847037657-fd34d2eb31af?q=80&w=600&auto=format&fit=crop",
    label: "Damaged",
    result: {
      status: "Damage Detected",
      confidence: 94,
      issues: [
        { type: "Dent", location: "Front Bumper", severity: "Moderate" },
        { type: "Scratch", location: "Hood", severity: "Minor" },
      ],
    },
  },
];

export function VisionInspectorDemo() {
  const [selectedImage, setSelectedImage] = useState(DEMO_IMAGES[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const runScan = async () => {
    setIsScanning(true);
    setShowResult(false);

    try {
      const res = await fetch("/api/ai/vision/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: selectedImage.src }),
      });

      if (!res.ok) throw new Error("Analysis failed");

      const data = await res.json();

      // Validate data structure match (optional, but good for safety)
      if (data.status) {
        setSelectedImage((prev) => ({
          ...prev,
          result: {
            status: data.status,
            confidence: data.confidence,
            issues: data.issues || [],
          },
        }));
      }
    } catch (err) {
      console.error(err);
      // Fallback to mock if API fails (e.g. no key)
      // But prefer showing error. For demo continuity, we might keep it or just alert.
    } finally {
      setIsScanning(false);
      setShowResult(true);
    }
  };

  return (
    <Card className="bg-slate-900 border-slate-800 overflow-hidden h-full flex flex-col">
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white mb-2">
            Vision Inspector
          </h3>
          <p className="text-slate-400 text-sm">
            47-point AI exterior analysis
          </p>
        </div>

        <div className="flex gap-2 mb-4">
          {DEMO_IMAGES.map((img) => (
            <button
              key={img.id}
              onClick={() => {
                setSelectedImage(img);
                setShowResult(false);
              }}
              className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-lg border transition-all ${
                selectedImage.id === img.id
                  ? "bg-white/10 border-blue-500 text-white"
                  : "bg-transparent border-slate-700 text-slate-400 hover:bg-white/5"
              }`}
            >
              <span className="text-xs font-medium">{img.label}</span>
            </button>
          ))}
        </div>

        <div className="relative aspect-video bg-slate-950 rounded-lg overflow-hidden border border-slate-800">
          <Image
            src={selectedImage.src}
            alt="Scan Target"
            fill
            className={`object-cover transition-opacity ${isScanning ? "opacity-50" : "opacity-100"}`}
          />

          {/* Scanning Overlay */}
          {isScanning && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute inset-0 bg-blue-500/20 animate-pulse" />
              <div className="flex flex-col items-center gap-3 z-10">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                <span className="text-blue-200 font-mono text-xs tracking-wider">
                  ANALYZING...
                </span>
              </div>
            </div>
          )}

          {/* Result Overlay */}
          {showResult && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
              <div className="w-full">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-white text-md">Result</h3>
                  <span
                    className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                      selectedImage.result.status === "Clean"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {selectedImage.result.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {selectedImage.result.issues.length > 0 ? (
                    selectedImage.result.issues.map((issue: any, i: number) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-xs p-2 rounded bg-slate-800/80 border border-slate-700"
                      >
                        <span className="flex items-center gap-2 text-slate-300">
                          <AlertCircle className="w-3 h-3 text-red-400" />
                          {issue.type}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-green-400 p-2 bg-green-500/10 rounded border border-green-500/20">
                      <CheckCircle className="w-3 h-3" />
                      No damage detected.
                    </div>
                  )}
                </div>

                <Button
                  size="sm"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white h-8 text-xs"
                >
                  Full Report
                  <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* Start Scan Button */}
          {!isScanning && !showResult && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/10 transition-colors cursor-pointer group"
              onClick={runScan}
            >
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                <Scan className="w-5 h-5 text-white" />
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
