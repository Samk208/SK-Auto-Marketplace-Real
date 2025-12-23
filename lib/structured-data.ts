import type { CarListing, Dealer } from "@/types"

export function generateVehicleSchema(listing: CarListing, dealer?: Dealer) {
  return {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name: `${listing.year} ${listing.make} ${listing.model}`,
    description: listing.description || `${listing.year} ${listing.make} ${listing.model} for export to Africa`,
    image: listing.images,
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
      availability: listing.isReserved ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      seller: dealer
        ? {
            "@type": "Organization",
            name: dealer.name,
            address: {
              "@type": "PostalAddress",
              addressLocality: dealer.location,
              addressCountry: "KR",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: dealer.rating,
              reviewCount: dealer.totalReviews,
            },
          }
        : {
            "@type": "Organization",
            name: listing.seller.name,
          },
    },
    itemCondition: "https://schema.org/UsedCondition",
  }
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function generateCollectionPageSchema(name: string, description: string, url: string, numberOfItems: number) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems,
    },
  }
}
