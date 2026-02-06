"use client";

import { ListingCardWithDealer } from "@/components/shop/listing-card-with-dealer";
import { Button } from "@/components/ui/button";
import type { CarListing } from "@/types";
import { ArrowRight, Car } from "lucide-react";
import Link from "next/link";

interface BrowseCarsSectionProps {
  initialListings: CarListing[];
}

export function BrowseCarsSection({ initialListings }: BrowseCarsSectionProps) {
  return (
    <section
      id="browse"
      className="py-20 bg-white dark:bg-slate-950 scroll-mt-24"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
              <Car size={14} /> Available Inventory
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Recent <span className="text-blue-600">Listings</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Explore the latest export-ready vehicles from verified Korean
              dealers. Each listing is inspected and ready for international
              shipping.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="group border-blue-200 dark:border-blue-800 hover:border-blue-500 transition-all"
          >
            <Link href="/shop" className="flex items-center gap-2">
              View All {initialListings.length > 0 ? "Vehicles" : ""}
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </Button>
        </div>

        {initialListings.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
            <Car className="mx-auto h-12 w-12 text-slate-400 mb-4" />
            <h3 className="text-xl font-medium text-slate-900 dark:text-white mb-2">
              No active listings found
            </h3>
            <p className="text-slate-500">
              We couldn't find any vehicles in the database. Please check back
              later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {initialListings.map((listing) => (
              <ListingCardWithDealer
                key={listing.id}
                listing={listing}
                onViewDetails={(id) => (window.location.href = `/shop/${id}`)}
                onContactSeller={(id) => {
                  console.log("[Contact] Seller for listing:", id);
                }}
                onToggleFavorite={(id) => console.log("[Favorite] Toggle:", id)}
              />
            ))}
          </div>
        )}

        <div className="mt-16 text-center">
          <Button
            asChild
            size="lg"
            className="h-16 px-10 text-lg rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/20 transition-all hover:scale-105"
          >
            <Link href="/shop">Explore Full Inventory</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
