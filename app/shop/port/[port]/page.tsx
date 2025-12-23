import { notFound } from "next/navigation"
import type { Metadata } from "next"

const PORT_DATA = {
  tema: {
    title: "Korean Vehicles to Tema Port, Ghana",
    description:
      "Browse Korean cars, buses, and commercial vehicles shipping to Tema Port, Ghana. Verified dealers with competitive export pricing.",
    country: "Ghana",
  },
  lagos: {
    title: "Korean Vehicles to Lagos, Nigeria",
    description:
      "Find Korean vehicles ready for export to Lagos, Nigeria. Premium selection from verified Korean dealers with full documentation support.",
    country: "Nigeria",
  },
  mombasa: {
    title: "Korean Vehicles to Mombasa, Kenya",
    description:
      "Korean cars and commercial vehicles shipping to Mombasa Port, Kenya. Trusted dealers, quality vehicles, hassle-free export.",
    country: "Kenya",
  },
  conakry: {
    title: "Korean Vehicles to Conakry, Guinea",
    description:
      "Export Korean vehicles to Conakry, Guinea. Browse sedans, SUVs, buses, and vans from verified Korean exporters.",
    country: "Guinea",
  },
}

export async function generateMetadata({ params }: { params: { port: string } }): Promise<Metadata> {
  const portData = PORT_DATA[params.port as keyof typeof PORT_DATA]

  if (!portData) {
    return {
      title: "Port Not Found",
    }
  }

  return {
    title: portData.title + " | SK AutoSphere",
    description: portData.description,
  }
}

export default function PortPage({ params }: { params: { port: string } }) {
  const portData = PORT_DATA[params.port as keyof typeof PORT_DATA]

  if (!portData) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{portData.title}</h1>
      <p className="text-muted-foreground mb-8">{portData.description}</p>
      <p className="text-center text-muted-foreground">
        Port page implementation - Use shop page with pre-filtered destination: {params.port}
      </p>
    </div>
  )
}
