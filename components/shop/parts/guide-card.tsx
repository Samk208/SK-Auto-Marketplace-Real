"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { ArrowRight, Clock } from "lucide-react"
import Link from "next/link"
import { Guide } from "./guides-mock-data"

interface GuideCardProps {
    guide: Guide
}

export function GuideCard({ guide }: GuideCardProps) {
    return (
        <Link href={`/parts/guides/${guide.slug}`} className="group block h-full">
            <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-all border-slate-200 group-hover:border-blue-200">
                <div className="relative aspect-video bg-slate-100 overflow-hidden">
                    {/* Mock Image */}
                    <div className="absolute inset-0 flex items-center justify-center text-slate-300 bg-slate-50">
                        <span>Guide Image</span>
                    </div>
                    <Badge className="absolute top-3 left-3 bg-white/90 text-slate-800 hover:bg-white border-none shadow-sm backdrop-blur-sm">
                        {guide.category}
                    </Badge>
                </div>

                <CardHeader className="p-5 pb-2">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#2558fa] transition-colors line-clamp-2">
                        {guide.title}
                    </h3>
                </CardHeader>

                <CardContent className="p-5 pt-2 flex-grow">
                    <div className="flex items-center text-xs text-slate-500 mb-3 space-x-2">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{guide.readTime} read</span>
                    </div>
                    <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
                        {guide.excerpt}
                    </p>
                </CardContent>

                <CardFooter className="p-5 pt-0 mt-auto">
                    <span className="text-sm font-medium text-[#2558fa] flex items-center group-hover:underline underline-offset-4">
                        Read Guide <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                </CardFooter>
            </Card>
        </Link>
    )
}
