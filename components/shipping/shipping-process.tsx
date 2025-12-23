export default function ShippingProcess() {
    const steps = [
        {
            step: 1,
            title: "Order & Inspection",
            description: "Once payment is confirmed, we perform a final 150-point inspection and video audit before moving the vehicle.",
            date: "Day 1-2"
        },
        {
            step: 2,
            title: "Export Documentation",
            description: "We handle all de-registration, export reporting, and insurance documentation for Korean authorities.",
            date: "Day 3"
        },
        {
            step: 3,
            title: "Port Transport",
            description: "Vehicle is safely transported to Incheon or Busan port via our secure carrier network.",
            date: "Day 4"
        },
        {
            step: 4,
            title: "Container Stuffing / Ro-Ro",
            description: "Vehicle is securely loaded. For containers, we use specialized shoring to prevent damage.",
            date: "Day 5"
        },
        {
            step: 5,
            title: "Vessel Departure",
            description: "Bill of Lading (BL) is issued and the vessel departs for your destination port.",
            date: "Day 7+"
        }
    ]

    return (
        <section className="py-24 bg-slate-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">From Our Yard to Your Door</h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        We've optimized every step of the export process to ensure safety, speed, and transparency.
                    </p>
                </div>

                <div className="relative max-w-4xl mx-auto">
                    {/* Vertical Line */}
                    <div className="absolute left-[19px] md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 md:-ml-px" />

                    <div className="space-y-12">
                        {steps.map((step, i) => (
                            <div key={i} className="relative flex items-start md:items-center">
                                {/* Mobile: Content Right */}
                                <div className={`flex flex-col md:flex-row w-full ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>

                                    {/* Content */}
                                    <div className="ml-12 md:ml-0 md:w-1/2 md:px-8">
                                        <div className={`bg-white p-6 rounded-xl shadow-sm border border-slate-100 ${i % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                                            <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[#2558fa] text-xs font-bold mb-2">
                                                {step.date}
                                            </span>
                                            <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                                            <p className="text-slate-600 text-sm">{step.description}</p>
                                        </div>
                                    </div>

                                    {/* Icon/Dot */}
                                    <div className="absolute left-0 md:left-1/2 md:-ml-4 w-10 h-10 rounded-full bg-white border-4 border-[#2558fa] flex items-center justify-center z-10 shadow-sm">
                                        <span className="text-[#2558fa] font-bold text-sm">{step.step}</span>
                                    </div>

                                    {/* Empty half for desktop layout balancing */}
                                    <div className="hidden md:block md:w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
