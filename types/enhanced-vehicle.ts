// ============================================
// ENHANCED VEHICLE TYPES (Inspired by DMS)
// Source: Adapted from https://github.com/alamariful1727/dealership-management-system
// For SK AutoSphere - Type-safe vehicle operations
// ============================================

// ===========================================
// ENUMS & LITERAL TYPES
// ===========================================

export type VehicleCondition = "excellent" | "good" | "fair" | "poor";
export type TransmissionType =
  | "automatic"
  | "manual"
  | "cvt"
  | "dual-clutch"
  | "Automatic"
  | "Manual";
export type FuelType =
  | "petrol"
  | "diesel"
  | "electric"
  | "hybrid"
  | "lpg"
  | "Petrol"
  | "Diesel"
  | "Electric"
  | "Hybrid";
export type VehicleStatus = "active" | "pending" | "sold" | "rejected";
export type InquiryType =
  | "general"
  | "price_negotiation"
  | "inspection"
  | "shipping"
  | "financing"
  | "test_drive";
export type InquiryStatus = "new" | "read" | "responded" | "closed";

// ===========================================
// VEHICLE TYPES
// ===========================================

/**
 * Enhanced vehicle listing with all automotive-specific fields
 * Compatible with existing car_listings table + new DMS-inspired fields
 */
export interface EnhancedVehicleListing {
  // Core Identifiers
  id: string;
  dealer_id: string;

  // Basic Vehicle Info
  title: string;
  brand: string; // 'make' in DMS terminology
  model: string;
  year: number;
  price: number;
  currency: string;
  mileage: number | null;

  // Body & Type
  body_type: string | null;
  transmission: TransmissionType | null;
  fuel_type: FuelType | null;

  // Condition & History (DMS-inspired)
  vin?: string | null;
  vehicle_condition?: VehicleCondition | null;
  previous_owners?: number;

  // Colors
  exterior_color?: string | null;
  interior_color?: string | null;

  // Performance
  engine_size?: number | null; // in liters (e.g., 2.0, 3.5)
  horsepower?: number | null;
  seating_capacity?: number;

  // Features & Service
  features?: string[]; // ['Leather seats', 'Sunroof', 'Navigation']
  service_history?: ServiceRecord[];
  inspection_report_url?: string | null;
  available_for_viewing?: boolean;

  // Location
  location: string | null;
  location_city?: string | null;
  location_country?: string; // ISO 2-letter code, default 'KR'
  destination_port: string | null;

  // Images
  images: string[] | object | null;
  primary_image_url?: string | null;
  image_urls?: string[];

  // Specifications (JSONB in DB)
  specifications: Record<string, unknown> | null;

  // Listing Status
  status: VehicleStatus;
  featured: boolean;
  views: number;

  // Timestamps
  created_at: string;
  updated_at: string;

  // Joined Data (optional)
  dealer?: DealerInfo;
  specs?: VehicleSpecifications;
  stats?: VehicleStats;
}

/**
 * Service record for vehicle history
 */
export interface ServiceRecord {
  date: string; // ISO date
  type: "maintenance" | "repair" | "inspection" | "accident";
  description: string;
  cost?: number;
  mileage: number;
  provider?: string;
  documents?: string[]; // URLs to receipts/reports
}

/**
 * Detailed vehicle specifications (from vehicle_specifications table)
 */
export interface VehicleSpecifications {
  id: string;
  listing_id: string;

  // Dimensions (millimeters)
  length_mm?: number | null;
  width_mm?: number | null;
  height_mm?: number | null;
  wheelbase_mm?: number | null;
  weight_kg?: number | null;

  // Capacity
  fuel_tank_capacity?: number | null; // liters
  trunk_capacity_liters?: number | null;

  // Performance
  acceleration_0_100?: number | null; // seconds
  top_speed_kmh?: number | null;

  // Fuel Efficiency
  fuel_efficiency_city?: number | null; // km/L
  fuel_efficiency_highway?: number | null; // km/L
  co2_emissions?: number | null; // g/km

  created_at: string;
  updated_at: string;
}

/**
 * Vehicle statistics for analytics
 */
export interface VehicleStats {
  total_views: number;
  inquiries_count: number;
  favorites_count?: number;
  average_time_on_market?: number; // days
}

// ===========================================
// INQUIRY TYPES
// ===========================================

/**
 * Vehicle inquiry from potential buyers
 */
export interface VehicleInquiry {
  id: string;
  listing_id: string;
  dealer_id: string;

  // Buyer Information
  buyer_email: string;
  buyer_name: string;
  buyer_phone?: string | null;
  buyer_country?: string | null;

  // Inquiry Details
  message: string;
  inquiry_type: InquiryType;
  status: InquiryStatus;

  // Dealer Response
  dealer_response?: string | null;
  responded_at?: string | null;

  created_at: string;

  // Joined Data (optional)
  listing?: EnhancedVehicleListing;
  dealer?: DealerInfo;
}

/**
 * Input for creating a new inquiry
 */
export interface CreateInquiryInput {
  listing_id: string;
  buyer_email: string;
  buyer_name: string;
  buyer_phone?: string;
  buyer_country?: string;
  message: string;
  inquiry_type?: InquiryType;
}

// ===========================================
// DEALER TYPES
// ===========================================

/**
 * Dealer information (enhanced)
 */
export interface DealerInfo {
  id: string;
  user_id: string;
  business_name: string;
  description?: string | null;
  logo_url?: string | null;
  location?: string | null;
  rating?: number;
  review_count?: number;
  verified: boolean;
  joined_date: string;
  active_listings: number;
  sold_vehicles: number;

  // Stats (from get_dealer_stats_enhanced function)
  stats?: DealerStats;
}

/**
 * Comprehensive dealer statistics
 */
export interface DealerStats {
  total_listings: number;
  active_listings: number;
  sold_listings: number;
  pending_listings: number;
  rejected_listings?: number;
  total_views: number;
  total_inquiries: number;
  new_inquiries?: number;
  total_transactions?: number;
  completed_transactions?: number;
  total_revenue: number;
  avg_listing_price?: number;
}

// ===========================================
// SEARCH TYPES
// ===========================================

/**
 * Filters for vehicle search (DMS-inspired)
 */
export interface VehicleSearchFilters {
  // Basic filters
  make?: string; // brand
  model?: string;
  min_year?: number;
  max_year?: number;
  min_price?: number;
  max_price?: number;

  // Vehicle details
  condition?: VehicleCondition;
  fuel_type?: FuelType | string;
  transmission?: TransmissionType | string;
  body_type?: string;

  // Location
  location_country?: string;
  destination_port?: string;

  // Dealer
  dealer_id?: string;

  // Search text
  search?: string;

  // Pagination
  limit?: number;
  offset?: number;
  page?: number;
  pageSize?: number;

  // Sorting
  sortBy?: "price" | "year" | "created_at" | "mileage" | "views";
  sortOrder?: "asc" | "desc";
}

/**
 * Vehicle search result (from search_vehicles_advanced function)
 */
export interface VehicleSearchResult {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number | null;
  vehicle_condition: VehicleCondition | null;
  fuel_type: FuelType | null;
  transmission: TransmissionType | null;
  body_type: string | null;
  images: string[] | object | null;
  primary_image_url: string | null;
  dealer_id: string;
  dealer_name: string | null;
  location_city: string | null;
  location_country: string | null;
  total_views: number;
  total_inquiries: number;
  created_at: string;
}

// ===========================================
// ANALYTICS TYPES
// ===========================================

/**
 * Vehicle view record (for analytics)
 */
export interface VehicleView {
  id: string;
  listing_id: string;
  viewer_country?: string | null;
  viewer_ip?: string | null;
  user_agent?: string | null;
  referrer?: string | null;
  viewed_at: string;
}

/**
 * Vehicle analytics data
 */
export interface VehicleAnalytics {
  total_views: number;
  unique_countries: number;
  top_countries: Array<{ country: string; views: number }>;
  views_by_day: Array<{ date: string; views: number }>;
}

// ===========================================
// API RESPONSE TYPES
// ===========================================

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  };
}

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  } | null;
}

// ===========================================
// INPUT TYPES FOR API ROUTES
// ===========================================

/**
 * Input for recording a vehicle view
 */
export interface RecordViewInput {
  listing_id: string;
  viewer_country?: string;
  viewer_ip?: string;
  user_agent?: string;
  referrer?: string;
}

/**
 * Input for creating vehicle specifications
 */
export interface CreateSpecificationsInput {
  listing_id: string;
  length_mm?: number;
  width_mm?: number;
  height_mm?: number;
  wheelbase_mm?: number;
  weight_kg?: number;
  fuel_tank_capacity?: number;
  trunk_capacity_liters?: number;
  acceleration_0_100?: number;
  top_speed_kmh?: number;
  fuel_efficiency_city?: number;
  fuel_efficiency_highway?: number;
  co2_emissions?: number;
}

// ===========================================
// TYPE GUARDS
// ===========================================

export function isVehicleCondition(value: string): value is VehicleCondition {
  return ["excellent", "good", "fair", "poor"].includes(value);
}

export function isInquiryType(value: string): value is InquiryType {
  return [
    "general",
    "price_negotiation",
    "inspection",
    "shipping",
    "financing",
    "test_drive",
  ].includes(value);
}

export function isVehicleStatus(value: string): value is VehicleStatus {
  return ["active", "pending", "sold", "rejected"].includes(value);
}
