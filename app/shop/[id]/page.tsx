import { ListingDetailClient } from "@/components/listings/listing-detail-client"
import { getListingById } from "@/lib/repositories/listings"
import { Metadata } from "next"
import { notFound } from "next/navigation"

interface ListingPageProps {
    params: Promise<{ id: string }>
}

/**
 * Generate dynamic metadata for SEO
 */
export async function generateMetadata({
    params,
}: ListingPageProps): Promise<Metadata> {
    const { id } = await params
    const listing = await getListingById(id)

    if (!listing) {
        return {
            title: "Listing Not Found | SK AutoSphere",
            description: "The requested vehicle listing could not be found.",
        }
    }

    const title = `${listing.title} | SK AutoSphere`
    const description = listing.description ||
        `${listing.year} ${listing.make} ${listing.model} for sale. ${listing.mileage.toLocaleString()} ${listing.mileageUnit}, ${listing.transmission}, ${listing.fuelType}. Export ready to Africa.`

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: "website",
            images: listing.images?.[0] ? [listing.images[0]] : [],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: listing.images?.[0] ? [listing.images[0]] : [],
        },
        alternates: {
            canonical: `/shop/${id}`,
        },
    }
}

/**
 * Vehicle Listing Detail Page
 * Server Component - fetches data and passes to client component
 */
export default async function ListingPage({ params }: ListingPageProps) {
    const { id } = await params
    const listing = await getListingById(id)

    if (!listing) {
        notFound()
    }

    // Generate structured data for SEO
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Vehicle",
        name: listing.title,
        brand: {
            "@type": "Brand",
            name: listing.make,
        },
        model: listing.model,
        vehicleModelDate: listing.year.toString(),
        mileageFromOdometer: {
            "@type": "QuantitativeValue",
            value: listing.mileage,
            unitCode: listing.mileageUnit === "km" ? "KMT" : "SMI",
        },
        fuelType: listing.fuelType,
        vehicleTransmission: listing.transmission,
        offers: {
            "@type": "Offer",
            price: listing.price,
            priceCurrency: listing.currency,
            availability: listing.isReserved
                ? "https://schema.org/SoldOut"
                : "https://schema.org/InStock",
            seller: {
                "@type": "Organization",
                name: listing.seller?.name || "SK AutoSphere Dealer",
            },
        },
        image: listing.images,
        description: listing.description,
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <ListingDetailClient listing={listing} />
        </>
    )
}
