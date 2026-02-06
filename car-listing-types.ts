export interface CarListing {
  id: string;
  title: string;
  year: number;
  make: string;
  model: string;
  price: number;
  currency: string;
  location: string;
  images: string[];
  transmission: "Manual" | "Automatic" | "CVT";
  fuelType: "Petrol" | "Diesel" | "Electric" | "Hybrid" | "Gas";
  mileage: number;
  mileageUnit: "km" | "miles";
  isReserved?: boolean;
  seller: {
    name: string;
    rating: number;
    totalReviews: number;
  };
  isFavorite?: boolean;
  showTranslate?: boolean;
}

export interface CarListingCardProps {
  listing: CarListing;
  isLoading?: boolean;
  hasError?: boolean;
  onViewDetails: (id: string) => void;
  onContactSeller: (id: string) => void;
  onTranslate?: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}
