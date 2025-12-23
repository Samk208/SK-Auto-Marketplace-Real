
import { MOCK_GUIDES } from "@/components/shop/parts/guides-mock-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, ChevronRight, Clock, Home } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface PageProps {
    params: {
        slug: string
    }
}

export async function generateMetadata({ params }: PageProps) {
    const guide = MOCK_GUIDES.find(g => g.slug === params.slug)

    if (!guide) {
        return {
            title: "Guide Not Found | SK AutoSphere",
        }
    }

    return {
        title: `${guide.title} | SK AutoSphere Guides`,
        description: guide.excerpt,
    }
}

export default function GuideArticlePage({ params }: PageProps) {
    const guide = MOCK_GUIDES.find(g => g.slug === params.slug)

    if (!guide) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-white pb-20">
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
                        <Link href="/parts/guides" className="hover:text-[#2558fa]">
                            Guides
                        </Link>
                        <ChevronRight className="w-4 h-4 mx-2" />
                        <span className="text-gray-900 font-medium truncate">{guide.title}</span>
                    </div>
                </div>
            </div>

            <article className="container max-w-4xl py-12 px-4">
                <Link
                    href="/parts/guides"
                    className="inline-flex items-center text-sm text-slate-500 hover:text-[#2558fa] mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Guides
                </Link>

                {/* Header */}
                <header className="mb-10 text-center">
                    <Badge className="mb-4 bg-blue-50 text-blue-700 hover:bg-blue-100 border-none px-3 py-1">
                        {guide.category}
                    </Badge>
                    <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                        {guide.title}
                    </h1>
                    <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
                        <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            {guide.readTime} read
                        </span>
                        <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            Updated recently
                        </span>
                    </div>
                </header>

                {/* Featured Image */}
                <div className="relative aspect-video bg-slate-100 rounded-2xl overflow-hidden mb-12 shadow-sm">
                    <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                        <span className="text-2xl">Featured Image: {guide.title}</span>
                    </div>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Main Article */}
                    <div className="lg:col-span-8">
                        <div
                            className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-[#2558fa]"
                            dangerouslySetInnerHTML={{ __html: guide.content }}
                        />
                    </div>

                    {/* Sidebar CTA */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-6 sticky top-24">
                            <h4 className="font-bold text-slate-900 mb-3">Looking for parts mentioned?</h4>
                            <p className="text-sm text-slate-600 mb-6">
                                We stock genuine OEM parts for Hyundai, Kia, and more. Verify fitment with your VIN.
                            </p>
                            <Button className="w-full bg-[#2558fa] hover:bg-[#1a3ec1] mb-3">
                                Shop {guide.category}
                            </Button>
                            <Button variant="outline" className="w-full">
                                Chat with Expert
                            </Button>
                        </div>
                    </div>
                </div>
            </article>

            {/* Read Next Section */}
            <div className="container max-w-6xl py-12 border-t">
                <h3 className="text-2xl font-bold mb-8">Related Guides</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {MOCK_GUIDES.filter(g => g.slug !== guide.slug).slice(0, 3).map(g => (
                        <div key={g.slug} className="group">
                            <div className="aspect-video bg-slate-100 rounded-lg mb-3"></div>
                            <h4 className="font-bold text-lg group-hover:text-[#2558fa] transition-colors">{g.title}</h4>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
