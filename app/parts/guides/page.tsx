import { GuideCard } from "@/components/shop/parts/guide-card"
import { GUIDES_CATEGORIES, MOCK_GUIDES } from "@/components/shop/parts/guides-mock-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Parts Guides & Education | SK AutoSphere",
    description: "Learn how to find the right parts, spot fakes, and maintain your Korean vehicle.",
}

export default function GuidesPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="bg-[#0f172a] text-white py-16">
                <div className="container px-4 text-center">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">SK AutoSphere Knowledge Hub</h1>
                    <p className="text-slate-300 max-w-2xl mx-auto mb-8 text-lg">
                        Expert advice on Korean auto parts, maintenance, and importing to Africa.
                    </p>

                    <div className="max-w-xl mx-auto relative">
                        <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                        <Input
                            placeholder="How can we help you?"
                            className="h-12 pl-12 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus-visible:ring-indigo-500 rounded-full"
                        />
                    </div>
                </div>
            </div>

            <div className="container py-12 px-4">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar Categories */}
                    <aside className="w-full lg:w-64 space-y-8 shrink-0">
                        <div>
                            <h3 className="font-bold text-slate-900 mb-4 px-2">Categories</h3>
                            <div className="space-y-1">
                                {GUIDES_CATEGORIES.map((cat) => (
                                    <button
                                        key={cat}
                                        className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-white hover:text-[#2558fa] hover:shadow-sm transition-all"
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                            <h4 className="font-bold text-blue-900 mb-2">Need personal help?</h4>
                            <p className="text-sm text-blue-700 mb-4">Our mechanics are on WhatsApp ready to check your VIN.</p>
                            <Button className="w-full bg-[#2558fa]">Chat Support</Button>
                        </div>
                    </aside>

                    {/* Main Grid */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-slate-900">Latest Guides</h2>
                            <div className="flex gap-2">
                                {/* Sort toggles could go here */}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {MOCK_GUIDES.map((guide) => (
                                <GuideCard key={guide.slug} guide={guide} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
