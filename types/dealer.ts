/**
 * SK AutoSphere - Dealer System Types
 * Generated from database schema
 * Date: 2025-12-09
 */

// ============================================================================
// DEALER APPLICATION TYPES
// ============================================================================

export type DealerType = 'licensed_dealership' | 'export_company' | 'individual_seller'

export type ApplicationStatus =
    | 'pending'
    | 'documents_review'
    | 'bank_verification'
    | 'deposit_pending'
    | 'approved'
    | 'rejected'

export type PaymentMethod = 'bank_transfer' | 'credit_card'

export interface DealerApplication {
    id: string
    application_id: string // Format: DS-YYYYMMDD-XXX
    user_id: string

    // Step 1: Dealer Type
    dealer_type: DealerType

    // Step 2: Business Information
    business_name: string
    business_registration_number: string
    business_type?: string
    year_established?: number
    vehicles_in_stock?: string
    business_address: string
    city: string
    postal_code: string

    // Contact Information
    primary_contact_name: string
    position_title?: string
    business_phone: string
    mobile_phone?: string
    has_whatsapp: boolean
    business_email: string

    // Step 3: Documents
    business_license_url?: string
    owner_id_url?: string
    bank_statement_url?: string
    lot_photos_urls: string[]
    documents_verified: boolean

    // Step 4: Bank Account
    bank_name?: string
    account_holder_name?: string
    account_number?: string
    swift_code?: string
    branch_name?: string
    bank_verified: boolean
    verification_code?: string

    // Step 5: Deposit & Agreement
    deposit_paid: boolean
    deposit_amount: number
    deposit_payment_method?: PaymentMethod
    deposit_transaction_id?: string
    terms_accepted: boolean
    privacy_accepted: boolean
    info_accuracy_confirmed: boolean

    // Application Status
    status: ApplicationStatus
    rejection_reason?: string
    admin_notes?: string

    // Timestamps
    submitted_at: string
    reviewed_at?: string
    approved_at?: string
    created_at: string
    updated_at: string
}

export interface DealerApplicationFormData {
    // Step 1
    dealer_type: DealerType

    // Step 2
    business_name: string
    business_registration_number: string
    business_type?: string
    year_established?: number
    vehicles_in_stock?: string
    business_address: string
    city: string
    postal_code: string
    primary_contact_name: string
    position_title?: string
    business_phone: string
    mobile_phone?: string
    has_whatsapp: boolean
    business_email: string

    // Step 3
    documents: {
        business_license?: File
        owner_id?: File
        bank_statement?: File
        lot_photos?: File[]
    }

    // Step 4
    bank_name?: string
    account_holder_name?: string
    account_number?: string
    swift_code?: string
    branch_name?: string

    // Step 5
    deposit_payment_method?: PaymentMethod
    terms_accepted: boolean
    privacy_accepted: boolean
    info_accuracy_confirmed: boolean
}

// ============================================================================
// DEALER DOCUMENT TYPES
// ============================================================================

export type DocumentType =
    | 'business_license'
    | 'owner_id'
    | 'bank_statement'
    | 'lot_photo'
    | 'vehicle_registration'
    | 'insurance_certificate'
    | 'other'

export interface DealerDocument {
    id: string
    application_id?: string
    dealer_id?: string

    document_type: DocumentType
    file_name: string
    file_url: string
    file_size?: number
    mime_type?: string

    // AI Verification
    ai_verified: boolean
    ai_confidence_score?: number
    ai_verification_notes?: string

    // Manual Verification
    manually_verified: boolean
    verified_by?: string
    verified_at?: string
    verification_notes?: string

    uploaded_at: string
    created_at: string
}

// ============================================================================
// DEALER BANK ACCOUNT TYPES
// ============================================================================

export interface DealerBankAccount {
    id: string
    dealer_id: string

    bank_name: string
    account_holder_name: string
    account_number: string
    swift_code?: string
    branch_name?: string

    // Verification
    verified: boolean
    verification_code?: string
    verification_sent_at?: string
    verified_at?: string

    // Status
    is_primary: boolean
    is_active: boolean

    created_at: string
    updated_at: string
}

// ============================================================================
// DEALER EARNINGS TYPES
// ============================================================================

export type TransactionType = 'sale' | 'commission' | 'withdrawal' | 'refund' | 'deposit' | 'fee'

export type TransactionStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'

export interface DealerEarning {
    id: string
    dealer_id: string
    order_id?: string

    // Transaction Details
    transaction_type: TransactionType
    amount: number
    currency: string

    // Sale Details
    vehicle_price?: number
    commission_rate?: number
    commission_amount?: number
    net_amount?: number

    // Status
    status: TransactionStatus

    // Payment Details
    payment_method?: string
    transaction_reference?: string
    processed_at?: string

    description?: string
    notes?: string

    created_at: string
}

export interface DealerEarningsSummary {
    this_month: number
    pending_clearance: number
    available_now: number
    lifetime_earnings: number
    total_sales: number
    pending_orders_count: number
}

// ============================================================================
// DEALER WITHDRAWAL TYPES
// ============================================================================

export type WithdrawalStatus = 'requested' | 'processing' | 'completed' | 'failed' | 'cancelled'

export interface DealerWithdrawal {
    id: string
    dealer_id: string
    bank_account_id?: string

    amount: number
    currency: string

    // Status
    status: WithdrawalStatus

    // Processing
    requested_at: string
    processed_at?: string
    completed_at?: string

    // Transaction Details
    transaction_reference?: string
    processing_fee: number
    net_amount?: number

    // Admin
    processed_by?: string
    admin_notes?: string
    failure_reason?: string

    created_at: string
}

// ============================================================================
// DEALER ANALYTICS TYPES
// ============================================================================

export interface DealerAnalytics {
    id: string
    dealer_id: string
    date: string

    // Listing Metrics
    total_listings: number
    active_listings: number
    sold_listings: number

    // Engagement Metrics
    total_views: number
    total_inquiries: number
    total_favorites: number

    // Sales Metrics
    total_sales: number
    gross_revenue: number
    commission_paid: number
    net_revenue: number

    // Performance Metrics
    avg_days_to_sell?: number
    conversion_rate?: number

    created_at: string
}

export interface DealerPerformanceMetrics {
    total_views: number
    total_inquiries: number
    total_conversions: number
    avg_days_to_sell: number
    conversion_rate: number
    views_trend: number
    inquiries_trend: number
    conversions_trend: number
    days_to_sell_trend: number
}

export interface TopPerformingListing {
    vehicle: string
    views: number
    inquiries: number
    days_listed: number
    status: 'active' | 'sold'
}

export interface TrafficSource {
    source: string
    percentage: number
}

export interface BuyerDemographic {
    country: string
    percentage: number
    sales_count: number
}

// ============================================================================
// VEHICLE LISTING PHOTO TYPES
// ============================================================================

export type PhotoType =
    | 'front'
    | 'rear'
    | 'left_side'
    | 'right_side'
    | 'interior_dashboard'
    | 'interior_seats'
    | 'engine_bay'
    | 'trunk'
    | 'other'

export interface ListingPhoto {
    id: string
    listing_id: string

    photo_url: string
    photo_type: PhotoType
    display_order: number

    // AI Quality Check
    quality_score?: number
    is_blurry: boolean
    has_good_lighting: boolean

    uploaded_at: string
    created_at: string
}

export interface PhotoUploadRequirement {
    type: PhotoType
    label: string
    required: boolean
    uploaded: boolean
}

// ============================================================================
// AI DAMAGE REPORT TYPES
// ============================================================================

export type VehicleCondition = 'excellent' | 'good' | 'fair' | 'poor'

export type DamageSeverity = 'low' | 'medium' | 'high' | 'severe'

export interface DamageIssue {
    type: string // e.g., "scratches", "dent", "rust", "paint_chip"
    severity: DamageSeverity
    location: string // e.g., "front_bumper", "rear_door_left"
    repair_cost: number
    photo_id?: string
    description?: string
}

export interface AIDamageReport {
    id: string
    listing_id: string

    // Overall Assessment
    overall_condition: VehicleCondition
    confidence_score: number

    // Detected Issues
    issues_detected: DamageIssue[]

    // Summary
    has_major_damage: boolean
    total_estimated_repair_cost: number

    // Blockchain/Verification
    blockchain_hash?: string

    // Status
    dealer_accepted: boolean
    dealer_override: boolean
    override_reason?: string
    requires_manual_review: boolean
    manually_reviewed: boolean
    reviewed_by?: string
    reviewed_at?: string

    scanned_at: string
    created_at: string
}

// ============================================================================
// VEHICLE LISTING EXTENDED TYPES
// ============================================================================

export interface VehicleListingFormData {
    // Step 1: Basic Information
    vin: string
    make: string
    model: string
    year: number
    trim_level?: string
    body_type: string
    engine_size: string
    fuel_type: string
    transmission: string
    drive_type: string
    color: string
    mileage: number
    condition: string

    // Ownership & History
    previous_owners: number
    accident_history: 'no_accidents' | 'minor_accidents' | 'major_accidents'
    accident_description?: string
    service_history: 'full_records' | 'partial_records' | 'no_records'
    special_notes?: string

    // Step 2: Photos & Media
    photos: File[]
    video_walkthrough?: File

    // Step 3: AI Damage Scan (auto-generated)
    ai_scan_accepted: boolean

    // Step 4: Pricing & Publish
    price: number
    minimum_acceptable_offer?: number
    warranty: 'none' | '3_month' | '6_month'
    add_ons: {
        spare_key: boolean
        owners_manual: boolean
        winter_tires: boolean
        floor_mats: boolean
    }
    additional_notes?: string

    // Confirmations
    info_accurate: boolean
    owns_vehicle: boolean
    accepts_terms: boolean
}

// ============================================================================
// DEALER DASHBOARD TYPES
// ============================================================================

export interface DealerDashboardStats {
    this_month_revenue: number
    revenue_trend: number
    active_listings: number
    pending_orders: number
    total_sales: number
}

export interface UrgentTask {
    id: string
    type: 'order_processing' | 'ai_scan_needed' | 'missing_photos' | 'low_price' | 'inquiry_response'
    title: string
    description: string
    count?: number
    action_url: string
    action_label: string
    priority: 'high' | 'medium' | 'low'
}

export interface RecentOrder {
    id: string
    order_number: string
    buyer_name: string
    buyer_location: string
    vehicle_title: string
    vehicle_image: string
    price: number
    status: string
    created_at: string
    actions: OrderAction[]
}

export interface OrderAction {
    label: string
    action: string
    variant?: 'default' | 'outline' | 'ghost'
}

// ============================================================================
// DEALER SETTINGS TYPES
// ============================================================================

export interface DealerProfile {
    id: string
    user_id: string
    business_name: string
    description?: string
    logo_url?: string
    rating: number
    review_count: number
    verified: boolean
    location?: string
    joined_date: string
    active_listings: number
    sold_vehicles: number

    // Extended fields
    business_hours?: {
        monday?: { open: string; close: string }
        tuesday?: { open: string; close: string }
        wednesday?: { open: string; close: string }
        thursday?: { open: string; close: string }
        friday?: { open: string; close: string }
        saturday?: { open: string; close: string }
        sunday?: { open: string; close: string }
    }
    contact_email?: string
    contact_phone?: string
    whatsapp?: string
}

export interface NotificationPreferences {
    email: {
        new_orders: boolean
        payment_received: boolean
        buyer_messages: boolean
        low_performing_listings: boolean
        marketing_updates: boolean
    }
    whatsapp: {
        new_orders: boolean
        buyer_inquiries: boolean
        daily_summary: boolean
    }
    push: {
        enabled: boolean
        new_orders: boolean
        messages: boolean
    }
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
    success: boolean
    data?: T
    error?: string
    message?: string
}

export interface PaginatedResponse<T> {
    data: T[]
    total: number
    page: number
    per_page: number
    total_pages: number
}

// ============================================================================
// FORM VALIDATION TYPES
// ============================================================================

export interface ValidationError {
    field: string
    message: string
}

export interface FormState {
    isSubmitting: boolean
    errors: ValidationError[]
    success: boolean
    message?: string
}
