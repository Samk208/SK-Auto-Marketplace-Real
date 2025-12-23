import { PublicHeader } from '@/components/public-header'
import ShippingHero from '@/components/shipping/shipping-hero'
import ShippingProcess from '@/components/shipping/shipping-process'
import ShippingStats from '@/components/shipping/shipping-stats'
import { SiteFooter } from '@/components/site-footer'
import { Button } from '@/components/ui/button'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Global Shipping & Logistics | SK AutoSphere',
    description: 'Fast, insured, and transparent vehicle shipping from Korea to Africa. We handle customs, documents, and logistics.',
}

export default function ShippingPage() {
    return (
        <div className="min-h-screen bg-white">
            <PublicHeader />
            <main>
                <ShippingHero />
                <ShippingStats />
                <ShippingProcess />

                {/* FAQ / CTA Section */}
                <section className="py-24 bg-white">
                    <div className="container mx-auto px-4 text-center">
                        <div className="max-w-3xl mx-auto bg-slate-900 rounded-3xl p-12 text-white relative overflow-hidden">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-10 bg-[url('/shipping-bg.jpg')] bg-cover bg-center" />
                            <div className="relative z-10">
                                <h2 className="text-3xl font-bold mb-4">Ready to Ship?</h2>
                                <p className="text-lg text-slate-300 mb-8">
                                    Contact our logistics team for a custom quote or tracking update.
                                    We are available 24/7 to assist with your import needs.
                                </p>
                                <div className="flex justify-center gap-4">
                                    <Button size="lg" className="bg-[#2558fa] hover:bg-[#1a3ec1]" asChild>
                                        <Link href="/contact">Contact Logistics Team</Link>
                                    </Button>
                                    <Button size="lg" variant="outline" className="text-[#2558fa] border-white/20 bg-white hover:bg-slate-100" asChild>
                                        <Link href="/shop">Browse Cars</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <SiteFooter />
        </div>
    )
}
