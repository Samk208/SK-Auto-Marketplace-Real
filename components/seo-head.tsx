import type { Metadata } from "next"

export function generateMarketplaceMetadata(config: {
  title: string
  description: string
  path: string
  keywords?: string[]
}): Metadata {
  const baseUrl = "https://sk-autosphere.com"
  const { title, description, path, keywords = [] } = config

  return {
    title: `${title} | SK AutoSphere`,
    description,
    keywords: ["African car marketplace", "buy cars Africa", "sell cars Africa", "verified dealers", ...keywords],
    openGraph: {
      title,
      description,
      url: `${baseUrl}${path}`,
      siteName: "SK AutoSphere",
      type: "website",
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `${baseUrl}${path}`,
    },
  }
}
