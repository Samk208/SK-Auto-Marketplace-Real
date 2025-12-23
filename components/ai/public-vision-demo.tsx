"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertCircle, CheckCircle, ChevronRight, Loader2, Scan } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

// Use placeholder images from Unsplash
const DEMO_IMAGES = [
    {
        id: "clean",
        src: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600&auto=format&fit=crop",
        label: "Clean Example",
        result: { status: "Clean", confidence: 98, issues: [] }
    },
    {
        id: "dent",
        src: "https://images.unsplash.com/photo-1626847037657-fd34d2eb31af?q=80&w=600&auto=format&fit=crop",
        label: "Damage Example",
        result: {
            status: "Damage Detected",
            confidence: 94,
            issues: [
                { type: "Dent", location: "Front Bumper", severity: "Moderate" },
                { type: "Scratch", location: "Hood", severity: "Minor" }
            ]
        }
    }
]

export function PublicVisionDemo() {
    const [selectedImage, setSelectedImage] = useState(DEMO_IMAGES[0])
    const [isScanning, setIsScanning] = useState(false)
    const [showResult, setShowResult] = useState(false)

    const runScan = () => {
        setIsScanning(true)
        setShowResult(false)

        // Simulate API delay
        setTimeout(() => {
            setIsScanning(false)
            setShowResult(true)
        }, 2000)
    }

    return (
        <section className="py-20 bg-slate-900 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-500/5 blur-3xl rounded-full translate-x-1/2" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    {/* Left: Text */}
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm font-medium mb-6 border border-blue-500/20">
                            <Scan className="w-4 h-4" />
                            <span className="animate-pulse">Live Demo</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">
                            See What Others Miss <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                                Before You Buy
                            </span>
                        </h2>
                        <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                            Our AI scans every listing for hidden damage, dents, and repainted panels.
                            Try it now on these sample vehicles to see the power of SK AutoSphere Vision™.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            {DEMO_IMAGES.map((img) => (
                                <button
                                    key={img.id}
                                    onClick={() => { setSelectedImage(img); setShowResult(false); }}
                                    className={`flex items-center gap-3 p-2 pr-4 rounded-xl border transition-all ${selectedImage.id === img.id
                                            ? "bg-white/10 border-blue-500"
                                            : "bg-transparent border-white/10 hover:bg-white/5"
                                        }`}
                                >
                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                                        <Image src={img.src} alt={img.label} fill className="object-cover" />
                                    </div>
                                    <span className="text-sm font-medium">{img.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Interactive Scanner */}
                    <div className="relative">
                        <Card className="bg-slate-800 border-slate-700 overflow-hidden shadow-2xl">
                            <div className="relative aspect-video bg-slate-950">
                                <Image
                                    src={selectedImage.src}
                                    alt="Scan Target"
                                    fill
                                    className={`object-cover transition-opacity ${isScanning ? 'opacity-50' : 'opacity-100'}`}
                                />

                                {/* Scanning Overlay */}
                                {isScanning && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="absolute inset-0 bg-blue-500/20 animate-pulse" />
                                        <div className="flex flex-col items-center gap-3 z-10">
                                            <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
                                            <span className="text-blue-200 font-mono text-sm tracking-wider">ANALYZING GEOMETRY...</span>
                                        </div>
                                    </div>
                                )}

                                {/* Result Overlay */}
                                {showResult && (
                                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 transition-all animate-in fade-in">
                                        <div className="w-full max-w-sm bg-slate-900 rounded-xl border border-slate-700 p-6 shadow-xl">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="font-bold text-lg">Analysis Result</h3>
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${selectedImage.result.status === 'Clean' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                                    }`}>
                                                    {selectedImage.result.status}
                                                </span>
                                            </div>

                                            <div className="space-y-3 mb-6">
                                                {selectedImage.result.issues.length > 0 ? (
                                                    selectedImage.result.issues.map((issue: any, i: number) => (
                                                        <div key={i} className="flex items-center justify-between text-sm p-2 rounded bg-slate-800">
                                                            <span className="flex items-center gap-2 text-slate-300">
                                                                <AlertCircle className="w-4 h-4 text-red-400" />
                                                                {issue.type}
                                                            </span>
                                                            <span className="text-slate-500">{issue.location}</span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="flex items-center gap-3 text-sm text-green-400 p-2 bg-green-500/10 rounded">
                                                        <CheckCircle className="w-5 h-5" />
                                                        No visible external damage detected.
                                                    </div>
                                                )}
                                                <div className="flex justify-between text-xs text-slate-500 pt-2 border-t border-slate-800">
                                                    <span>Confidence Score</span>
                                                    <span className="text-blue-400 font-mono">{selectedImage.result.confidence}%</span>
                                                </div>
                                            </div>

                                            <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white">
                                                Get Full Report
                                                <ChevronRight className="w-4 h-4 ml-1" />
                                            </Button>
                                            <p className="text-center mt-3 text-xs text-slate-500">
                                                *Demo simulation. Actual results may vary.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Start Scan Overlay (Initial) */}
                                {!isScanning && !showResult && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/10 transition-colors cursor-pointer group" onClick={runScan}>
                                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                                            <Scan className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    )
}
