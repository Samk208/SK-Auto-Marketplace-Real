
import { CheckoutPageClient } from "@/components/shop/checkout/checkout-page-client"
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Secure Checkout | SK AutoSphere',
    description: 'Complete your purchase securely.',
    robots: 'noindex' // Don't index checkout pages
}

export default function CheckoutPage() {
    return <CheckoutPageClient />
}
