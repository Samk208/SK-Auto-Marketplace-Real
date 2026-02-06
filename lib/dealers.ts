import type { Dealer } from "@/types";

/**
 * Korean auto dealers who export to Africa
 * All dealers are based in South Korea and specialize in exporting
 * quality used vehicles to African markets
 */
export const MOCK_DEALERS: Dealer[] = [
  {
    id: "dealer-1",
    name: "Seoul Premium Motors",
    rating: 4.8,
    totalReviews: 203,
    location: "Seoul, South Korea",
    verified: true,
    description:
      "Specializing in Hyundai and Genesis luxury vehicles for African export. Over 15 years of experience shipping to Nigeria, Ghana, Kenya, and Tanzania.",
    specialties: ["Hyundai", "Genesis", "Luxury Sedans"],
  },
  {
    id: "dealer-2",
    name: "Busan Commercial Vehicles",
    rating: 4.9,
    totalReviews: 156,
    location: "Busan, South Korea",
    verified: true,
    description:
      "Leading supplier of buses, vans, and commercial vehicles to Africa. Full documentation and port delivery services included.",
    specialties: ["Buses", "Vans", "Commercial"],
  },
  {
    id: "dealer-3",
    name: "Incheon Auto Export",
    rating: 4.9,
    totalReviews: 127,
    location: "Incheon, South Korea",
    verified: true,
    description:
      "Kia specialist with comprehensive export documentation services. Ships to Ghana, Ivory Coast, Senegal, and Cameroon.",
    specialties: ["Kia", "SUVs", "Family Cars"],
  },
  {
    id: "dealer-4",
    name: "Daegu EV Specialists",
    rating: 4.7,
    totalReviews: 89,
    location: "Daegu, South Korea",
    verified: true,
    description:
      "Experts in electric and hybrid vehicles for sustainable African transportation. Specializing in Kia EV6 and Hyundai Ioniq.",
    specialties: ["Electric Vehicles", "Hybrids", "Kia EV6"],
  },
  {
    id: "dealer-5",
    name: "Gyeonggi Motors",
    rating: 4.6,
    totalReviews: 94,
    location: "Suwon, South Korea",
    verified: true,
    description:
      "Wide selection of SUVs and family vehicles ready for export. Specializing in Hyundai Tucson and Kia Sportage.",
    specialties: ["Hyundai Tucson", "Kia Sportage", "SUVs"],
  },
  {
    id: "dealer-6",
    name: "Korea Auto Hub",
    rating: 4.8,
    totalReviews: 178,
    location: "Seoul, South Korea",
    verified: true,
    description:
      "Premium Korean vehicles with luxury export service. Genesis specialists with white-glove delivery to Nigeria, South Africa, and Kenya.",
    specialties: ["Genesis", "Luxury", "Premium Export"],
  },
  {
    id: "5593fa70-6931-4b73-a156-ea162521e78a",
    name: "Test Auto Dealership",
    rating: 4.5,
    totalReviews: 12,
    location: "Seoul, South Korea",
    verified: true,
    description:
      "Premium Korean vehicle exports to Africa. Quality used cars with full documentation.",
    specialties: ["Korean Cars", "Export Ready", "Documentation"],
  },
];

export function getDealerById(id: string): Dealer | undefined {
  return MOCK_DEALERS.find((dealer) => dealer.id === id);
}
