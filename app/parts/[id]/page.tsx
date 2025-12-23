import { getPart } from "@/app/actions/parts"
import { PartDetailHero } from "@/components/shop/parts/part-detail-hero"
import { PartSpecs } from "@/components/shop/parts/part-specs"
import { ChevronRight, Home } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface PageProps {
    params: {
        id: string
    }
}

export async function generateMetadata({ params }: PageProps) {
    const part = await getPart(params.id)

    if (!part) {
        return {
            title: "Part Not Found | SK AutoSphere",
        }
    }

    return {
        title: `${part.name} - ${part.brand} | SK AutoSphere`,
        description: `Buy ${part.name} (${part.partNumber}) for ${part.compatibleVehicles.join(', ')}. Genuine ${part.brand} parts from Korea with express shipping.`,
    }
}

export default async function PartDetailPage({ params }: PageProps) {
    const part = await getPart(params.id)

    if (!part) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-white pb-12">
            {/* Breadcrumbs */}
            <div className="border-b bg-gray-50">
                <div className="container py-3">
                    <div className="flex items-center text-sm text-gray-500">
                        <Link href="/" className="hover:text-[#2558fa] flex items-center">
                            <Home className="w-4 h-4 mr-1" />
                            Home
                        </Link>
                        <ChevronRight className="w-4 h-4 mx-2" />
                        <Link href="/parts" className="hover:text-[#2558fa]">
                            Parts
                        </Link>
                        <ChevronRight className="w-4 h-4 mx-2" />
                        <span className="truncate max-w-[200px]">{part.category}</span>
                        <ChevronRight className="w-4 h-4 mx-2" />
                        <span className="text-gray-900 font-medium truncate">{part.name}</span>
                    </div>
                </div>
            </div>

            <div className="container py-8">
                <PartDetailHero part={part} />
                <PartSpecs part={part} />
            </div>
        </div>
    )
}
