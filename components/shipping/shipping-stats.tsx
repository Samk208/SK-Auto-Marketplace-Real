import { Anchor, Clock, Globe2, ShieldCheck } from 'lucide-react'

const stats = [
    {
        icon: <Globe2 className="w-6 h-6" />,
        value: "110+",
        label: "Countries Served",
        description: "Global delivery network"
    },
    {
        icon: <Anchor className="w-6 h-6" />,
        value: "2,500+",
        label: "Monthly Exports",
        description: "Active shipping volume"
    },
    {
        icon: <Clock className="w-6 h-6" />,
        value: "3-5",
        label: "Days to Ship",
        description: "Fast processing time"
    },
    {
        icon: <ShieldCheck className="w-6 h-6" />,
        value: "100%",
        label: "Insured",
        description: "Full cargo protection"
    }
]

export default function ShippingStats() {
    return (
        <div className="bg-white py-12 border-b border-slate-100">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, i) => (
                        <div key={i} className="text-center group">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#2558fa] group-hover:scale-110 transition-transform">
                                {stat.icon}
                            </div>
                            <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                            <div className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-1">{stat.label}</div>
                            <div className="text-sm text-slate-500">{stat.description}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
