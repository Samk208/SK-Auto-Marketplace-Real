import type { CarMake, SortOption } from "./types";

export const CAR_MAKES: CarMake[] = [
  {
    value: "hyundai",
    label: "Hyundai",
    models: [
      "Sonata",
      "Elantra",
      "Tucson",
      "Santa Fe",
      "Palisade",
      "Kona",
      "Venue",
      "Accent",
      "Genesis G90",
      "Ioniq 5",
    ],
  },
  {
    value: "kia",
    label: "Kia",
    models: [
      "K5",
      "Forte",
      "Sportage",
      "Sorento",
      "Telluride",
      "Seltos",
      "Rio",
      "Stinger",
      "EV6",
      "Niro",
    ],
  },
  {
    value: "genesis",
    label: "Genesis",
    models: [
      "G70",
      "G80",
      "G90",
      "GV70",
      "GV80",
      "Electrified G80",
      "Electrified GV70",
    ],
  },
  {
    value: "ssangyong",
    label: "SsangYong",
    models: ["Tivoli", "Korando", "Rexton", "XLV", "Musso", "Torres"],
  },
  {
    value: "toyota",
    label: "Toyota",
    models: [
      "Camry",
      "Corolla",
      "RAV4",
      "Highlander",
      "Prius",
      "Sienna",
      "Avalon",
    ],
  },
  {
    value: "honda",
    label: "Honda",
    models: ["Civic", "Accord", "CR-V", "Pilot", "HR-V", "Insight"],
  },
  {
    value: "nissan",
    label: "Nissan",
    models: ["Altima", "Sentra", "Rogue", "Murano", "Pathfinder", "Leaf"],
  },
  {
    value: "bmw",
    label: "BMW",
    models: ["3 Series", "5 Series", "7 Series", "X3", "X5", "X7", "i3", "iX"],
  },
  {
    value: "mercedes",
    label: "Mercedes-Benz",
    models: [
      "C-Class",
      "E-Class",
      "S-Class",
      "GLC",
      "GLE",
      "GLS",
      "A-Class",
      "EQS",
    ],
  },
  {
    value: "audi",
    label: "Audi",
    models: ["A3", "A4", "A6", "A8", "Q3", "Q5", "Q7", "Q8", "e-tron"],
  },
];

export const BODY_TYPES = [
  "Sedan",
  "SUV",
  "Hatchback",
  "Coupe",
  "Convertible",
  "Wagon",
  "Pickup Truck",
  "Van",
  "Crossover",
];

export const TRANSMISSION_TYPES = ["Manual", "Automatic", "CVT"];

export const FUEL_TYPES = ["Gas", "Hybrid", "Electric", "Diesel"];

export const SORT_OPTIONS: SortOption[] = [
  { value: "relevance", label: "Relevance" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "year_new", label: "Year: Newest First" },
  { value: "year_old", label: "Year: Oldest First" },
  { value: "mileage_low", label: "Mileage: Low to High" },
  { value: "date_new", label: "Date: Newest First" },
];

export const RECENT_SEARCHES = [
  "Hyundai Sonata",
  "Kia K5",
  "Genesis G70",
  "Hyundai Tucson under $30,000",
];

export const LOCATION_SUGGESTIONS = [
  "Seoul, South Korea",
  "Busan, South Korea",
  "Incheon, South Korea",
  "Daegu, South Korea",
  "Daejeon, South Korea",
  "Gwangju, South Korea",
];
