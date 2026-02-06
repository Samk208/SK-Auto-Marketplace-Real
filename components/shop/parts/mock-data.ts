/**
 * Mock data for parts shop
 */

import type { Part } from "@/lib/mock-parts";

export const MOCK_PARTS: Part[] = [
  {
    id: "part-001",
    name: "Hyundai Genesis G80 Front Brake Pad Set",
    partNumber: "58101-T1A10",
    brand: "Hyundai Mobis",
    category: "Brakes",
    subcategory: "Brake Pads",
    segment: "new",
    condition: "New",
    priceKRW: 125000,
    priceUSD: 95,
    stockStatus: "In Stock",
    images: ["/placeholder.jpg"],
    description: "OEM front brake pads for Hyundai Genesis G80",
    compatibleVehicles: ["Genesis G80 2017-2023", "Genesis G90 2017-2023"],
    rating: 4.8,
    reviewCount: 24,
  },
  {
    id: "part-002",
    name: "Kia Sportage Air Filter",
    partNumber: "28113-D9100",
    brand: "Kia Genuine",
    category: "Engine",
    subcategory: "Air Filters",
    segment: "new",
    condition: "New",
    priceKRW: 45000,
    priceUSD: 35,
    stockStatus: "In Stock",
    images: ["/placeholder.jpg"],
    description: "Genuine air filter for Kia Sportage",
    compatibleVehicles: ["Kia Sportage 2016-2021"],
    rating: 4.5,
    reviewCount: 18,
  },
  {
    id: "part-003",
    name: "Used Hyundai Sonata Engine Assembly",
    partNumber: "USED-ENG-SON2020",
    brand: "Hyundai",
    category: "Engine",
    subcategory: "Complete Engines",
    segment: "used",
    condition: "Used",
    priceKRW: 2500000,
    priceUSD: 1900,
    stockStatus: "In Stock",
    images: ["/placeholder.jpg"],
    description: "Used 2.5L GDI engine from 2020 Hyundai Sonata, 45,000km",
    compatibleVehicles: ["Hyundai Sonata 2020-2023"],
    location: "Seoul Warehouse",
    rating: 4.2,
    reviewCount: 8,
  },
];

export type { Part };
