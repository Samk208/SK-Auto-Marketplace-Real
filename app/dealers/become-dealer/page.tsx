import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, CheckCircle2, Globe2, MessageCircle, ShieldCheck, Truck } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Become a Dealer | SK AutoSphere',
    description: 'Sell Korean cars to Africa. Reach 54 countries with one listing.',
}

export default function BecomeDealerPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-24 lg:py-32 bg-slate-50 border-b">
                <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-8">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        Accepting New Dealer Applications
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6">
                        Sell Korean Cars to <span className="text-[#2558fa]">Africa</span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
                        Join the #1 automotive marketplace connecting Korean sellers with African buyers. Reach 54 countries with a single listing.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button size="lg" className="h-14 px-8 text-lg bg-[#2558fa] hover:bg-[#1a3ec1] w-full sm:w-auto" asChild>
                            <Link href="/dealers/register">Become a Dealer</Link>
                        </Button>
                        <Button size="lg" variant="outline" className="h-14 px-8 text-lg w-full sm:w-auto">
                            Learn More
                        </Button>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Sell on SK AutoSphere?</h2>
                        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                            We handle the complexity of cross-border car sales so you can focus on sourcing quality inventory.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {benefits.map((benefit, index) => (
                            <Card key={index} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-4 text-[#2558fa]">
                                        {benefit.icon}
                                    </div>
                                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-slate-600">{benefit.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-[#0F172A] text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Grow Your Export Business?</h2>
                    <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-10">
                        Create your account today and start selling to thousands of verified buyers across Africa.
                    </p>
                    <Button size="lg" className="h-14 px-8 text-lg bg-[#2558fa] hover:bg-[#1a3ec1] text-white" asChild>
                        <Link href="/dealers/register">Start Selling Now</Link>
                    </Button>
                    <p className="mt-6 text-sm text-slate-400">
                        No credit card required for registration. Verified dealers only.
                    </p>
                </div>
            </section>
        </div>
    )
}

const benefits = [
    {
        title: 'Access 54 Markets',
        description: 'Instantly reach buyers in Nigeria, Ghana, Kenya, and 50+ other African countries with translated listings.',
        icon: <Globe2 className="w-6 h-6" />
    },
    {
        title: 'Guaranteed Payment',
        description: 'Our escrow service secures funds before you ship. No more payment fraud or chase-ups.',
        icon: <ShieldCheck className="w-6 h-6" />
    },
    {
        title: 'Seamless Logistics',
        description: 'We handle shipping, customs documents, and delivery. You just drop off the vehicle at the port.',
        icon: <Truck className="w-6 h-6" />
    },
    {
        title: 'AI Damage Detection',
        description: 'Automatically scan and report vehicle condition to build trust with remote buyers.',
        icon: <CheckCircle2 className="w-6 h-6" />
    },
    {
        title: 'Market Insights',
        description: 'Get real-time data on high-demand models and pricing trends to optimize your inventory.',
        icon: <BarChart3 className="w-6 h-6" />
    },
    {
        title: 'WhatsApp Integration',
        description: 'Communicate directly with buyers through our integrated WhatsApp Business platform.',
        icon: <MessageCircle className="w-6 h-6" />
    }
]
