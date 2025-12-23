import { notFound } from "next/navigation"
import type { Metadata } from "next"

const BODY_TYPES = {
  sedan: {
    title: "Korean Sedans for Export to Africa",
    description:
      "Browse premium Korean sedans from Hyundai, Kia, and Genesis. Verified dealers, competitive prices, ready for export to African ports.",
  },
  suv: {
    title: "Korean SUVs for Export to Africa",
    description:
      "Explore Korean SUVs perfect for African roads. From compact crossovers to luxury SUVs, find your ideal vehicle from verified dealers.",
  },
  bus: {
    title: "Korean Buses to Africa",
    description:
      "Commercial buses and passenger vehicles from Korea to African ports. Hyundai County and more with full export support.",
  },
  van: {
    title: "Korean Vans for Export to Africa",
    description:
      "Spacious passenger vans and cargo vans from Korean dealers. Perfect for transport businesses across Africa.",
  },
}

export async function generateMetadata({ params }: { params: Promise<{ type: string }> }): Promise<Metadata> {
  const { type } = await params
  const typeData = BODY_TYPES[type as keyof typeof BODY_TYPES]

  if (!typeData) {
    return {
      title: "Category Not Found",
    }
  }

  return {
    title: typeData.title + " | SK AutoSphere",
    description: typeData.description,
  }
}

export default async function BodyTypePage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params
  const typeData = BODY_TYPES[type as keyof typeof BODY_TYPES]

  if (!typeData) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{typeData.title}</h1>
      <p className="text-muted-foreground mb-8">{typeData.description}</p>
      <p className="text-center text-muted-foreground">
        Category page implementation - Use shop page with pre-filtered body type: {type}
      </p>
    </div>
  )
}
