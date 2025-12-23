import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ShippingHero() {
    return (
        <section className="relative overflow-hidden bg-slate-900 py-20 lg:py-32">
            {/* Background with Gradient */}
            <div className="absolute inset-0 z-0 bg-slate-950" />
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-blue-950/20 to-slate-950" />

            {/* Plus Grid Pattern */}
            <div
                className="absolute inset-0 z-10 opacity-10"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}
            />

            <div className="container relative z-20 mx-auto px-4 text-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-400 mb-8 border border-blue-500/20">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    Weekly Departures to West Africa
                </div>

                <h1 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-6xl">
                    Straight from Korea to <br />
                    <span className="text-[#2558fa]">Your Trusted Port</span>
                </h1>

                <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-300 md:text-xl leading-relaxed">
                    We handle everything: Inspection, Stuffing, Customs, and Ocean Freight.
                    Track your vehicle every step of the way with our realtime logistics dashboard.
                </p>

                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Button size="lg" className="h-14 bg-[#2558fa] px-8 text-lg hover:bg-[#1a3ec1] w-full sm:w-auto shadow-lg shadow-blue-900/20" asChild>
                        <Link href="/shop">Browse Inventory</Link>
                    </Button>
                    <Button size="lg" variant="outline" className="h-14 px-8 text-lg text-white border-white/10 bg-white/5 hover:bg-white/10 w-full sm:w-auto backdrop-blur-sm">
                        Calculate Shipping
                    </Button>
                </div>
            </div>
        </section>
    )
}
