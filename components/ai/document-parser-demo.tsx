"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle, FileText, Scan, Upload } from "lucide-react";
import { useState } from "react";

export function DocumentParserDemo() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const [result, setResult] = useState<any>(null);

  const handleUpload = () => {
    // Simulate file upload
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.jpg,.png";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setFileName(file.name);
        startScan(file);
      }
    };
    input.click();
  };

  const startScan = async (file: File) => {
    setIsScanning(true);
    setScanComplete(false);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/ai/documents/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Analysis failed");

      const data = await res.json();
      setResult(data);
      setScanComplete(true);
    } catch (error) {
      console.error(error);
      // Ideally show error state
    } finally {
      setIsScanning(false);
    }
  };

  const reset = () => {
    setFileName(null);
    setScanComplete(false);
    setIsScanning(false);
  };

  return (
    <Card className="bg-slate-900 border-slate-800 overflow-hidden h-full min-h-[500px] flex flex-col">
      <div className="p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">
              Document Intelligence
            </h3>
            <p className="text-slate-400 text-sm">
              Korean Auction Sheet Parser (OCR + Translation)
            </p>
          </div>
          {scanComplete && (
            <div className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/20 flex items-center gap-2">
              <CheckCircle size={14} /> Analysis Complete
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center relative">
          {/* State 1: Upload Prompt */}
          {!fileName && (
            <div className="text-center space-y-6">
              <div
                className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto border-2 border-dashed border-slate-700 hover:border-blue-500/50 transition-colors group cursor-pointer"
                onClick={handleUpload}
              >
                <Upload className="w-8 h-8 text-slate-500 group-hover:text-blue-400 transition-colors" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  Upload Auction Sheet
                </h4>
                <p className="text-slate-500 text-sm max-w-xs mx-auto">
                  Supports PDF, JPG, PNG (Max 10MB). <br />
                  Automatically detects Korean text.
                </p>
              </div>
              <Button
                onClick={handleUpload}
                variant="outline"
                className="border-slate-700 hover:bg-slate-800 text-white"
              >
                Select File
              </Button>
            </div>
          )}

          {/* State 2: Scanning */}
          {isScanning && (
            <div className="text-center space-y-6 animate-in fade-in duration-500">
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Scan className="w-8 h-8 text-blue-400 animate-pulse" />
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  Analyzing Document...
                </h4>
                <p className="text-slate-500 text-sm">
                  Extracting VIN, Mileage, and Inspection Points
                </p>
              </div>
              <div className="w-64 h-1.5 bg-slate-800 rounded-full mx-auto overflow-hidden">
                <div className="h-full bg-blue-500 animate-progress origin-left"></div>
              </div>
            </div>
          )}

          {/* State 3: Results */}
          {scanComplete && (
            <div className="w-full h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 mb-6 flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium text-white truncate">
                    {fileName}
                  </p>
                  <p className="text-xs text-slate-400">
                    Processed in 1.2s • 98% Confidence
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-slate-400 hover:text-white"
                  onClick={reset}
                >
                  New Scan
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                    Vehicle
                  </p>
                  <p className="text-white font-mono text-lg">
                    {result?.vehicleName || "Unknown Vehicle"}
                  </p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                    Lot No.
                  </p>
                  <p className="text-white font-mono text-lg">
                    {result?.lotNumber || "N/A"}
                  </p>
                </div>
                <div className="col-span-2 h-px bg-slate-800 my-2"></div>

                <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                  <p className="text-xs text-slate-400 mb-1">Auction Grade</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-green-400">
                      {result?.auctionGrade || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                  <p className="text-xs text-slate-400 mb-1">Mileage</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-white">
                      {result?.mileage?.toLocaleString() || "0"}
                    </span>
                    <span className="text-xs text-slate-500">km</span>
                  </div>
                </div>

                <div className="col-span-2 mt-2">
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-3">
                    Detected Conditions
                  </p>
                  <div className="space-y-2">
                    {result?.repairs && result.repairs.length > 0 ? (
                      result.repairs.map((repair: any, i: number) => (
                        <div
                          key={i}
                          className="flex items-center justify-between text-sm p-2 rounded bg-slate-800/50 border border-slate-800"
                        >
                          <span className="flex items-center gap-2 text-slate-300">
                            <AlertCircle className="w-3 h-3 text-red-400" />
                            {repair.part}
                          </span>
                          <span className="text-red-400 text-xs">
                            {repair.action} ({repair.severity})
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center gap-2 text-xs text-green-400 p-2 bg-green-500/10 rounded border border-green-500/20">
                        <CheckCircle className="w-3 h-3" />
                        No significant issues detected.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
