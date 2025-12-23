import { getParts } from "@/app/actions/parts"
import { PartsShopClient } from "@/components/shop/parts-shop-client"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Shop Auto Parts | SK AutoSphere",
    description: "Authentic OEM and aftermarket parts for Hyundai, Kia, GM Daewoo, and more. Express shipping to Africa.",
}

export const revalidate = 3600 // Cache for 1 hour

export default async function PartsShopPage() {
    const parts = await getParts()
    return <PartsShopClient initialParts={parts} />
}
