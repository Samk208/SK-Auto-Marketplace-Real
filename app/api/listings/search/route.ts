/**
 * GET /api/listings/search
 *
 * Advanced vehicle search using the search_vehicles_advanced database function
 * Provides enhanced filtering with view/inquiry counts
 *
 * Query Parameters:
 * - make: Filter by make/brand (e.g., "Hyundai")
 * - model: Filter by model
 * - minYear: Minimum year
 * - maxYear: Maximum year
 * - minPrice: Minimum price
 * - maxPrice: Maximum price
 * - condition: Vehicle condition (excellent, good, fair, poor)
 * - fuelType: Fuel type
 * - transmission: Transmission type
 * - bodyType: Body type
 * - country: Location country (ISO 2-letter code)
 * - dealerId: Filter by dealer
 * - page: Page number (default: 1)
 * - pageSize: Items per page (default: 20, max: 100)
 */

import { supabaseServer } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    // Parse parameters
    const make = searchParams.get('make') || undefined
    const model = searchParams.get('model') || undefined
    const minYear = searchParams.get('minYear') ? parseInt(searchParams.get('minYear')!, 10) : undefined
    const maxYear = searchParams.get('maxYear') ? parseInt(searchParams.get('maxYear')!, 10) : undefined
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined
    const condition = searchParams.get('condition') || undefined
    const fuelType = searchParams.get('fuelType') || undefined
    const transmission = searchParams.get('transmission') || undefined
    const bodyType = searchParams.get('bodyType') || undefined
    const country = searchParams.get('country') || undefined
    const dealerId = searchParams.get('dealerId') || undefined

    const vin = searchParams.get('vin') || undefined

    // Pagination
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '20', 10)))
    const offset = (page - 1) * pageSize

    // Call the search_vehicles_advanced function
    // @ts-ignore - RPC function defined in migration
    const { data, error } = await supabaseServer.rpc('search_vehicles_advanced', {
      p_make: make,
      p_model: model,
      p_min_year: minYear,
      p_max_year: maxYear,
      p_min_price: minPrice,
      p_max_price: maxPrice,
      p_condition: condition,
      p_fuel_type: fuelType,
      p_transmission: transmission,
      p_body_type: bodyType,
      p_location_country: country,
      p_dealer_id: dealerId,
      p_vin: vin,
      p_limit: pageSize,
      p_offset: offset,
    }) as { data: any[] | null; error: any }

    if (error) {
      console.error('Error in advanced search:', error)
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: {
            message: `Search failed: ${error.message}`,
            code: 'DATABASE_ERROR',
          },
        },
        { status: 500 }
      )
    }

    // Transform results to match frontend CarListing format
    const items = (data || []).map((row: any) => ({
      id: row.id,
      title: row.title,
      make: row.brand,
      model: row.model,
      year: row.year,
      price: row.price,
      mileage: row.mileage || 0,
      mileageUnit: 'km',
      vehicleCondition: row.vehicle_condition,
      fuelType: row.fuel_type || 'Petrol',
      transmission: row.transmission || 'Manual',
      bodyType: row.body_type,
      images: Array.isArray(row.images) ? row.images : [],
      primaryImageUrl: row.primary_image_url,
      dealerId: row.dealer_id,
      seller: {
        name: row.dealer_name || 'Unknown Dealer',
        rating: 0,
        totalReviews: 0,
      },
      sellerRating: 0,
      sellerTotalReviews: 0,
      locationCity: row.location_city,
      locationCountry: row.location_country,
      currency: 'USD',
      location: row.location_city || '',
      totalViews: row.total_views || 0,
      totalInquiries: row.total_inquiries || 0,
      createdAt: row.created_at,
    }))

    return NextResponse.json(
      {
        success: true,
        data: {
          items,
          pagination: {
            page,
            pageSize,
            total: items.length, // Note: For accurate total, need COUNT query
            hasMore: items.length === pageSize,
          },
        },
        error: null,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in GET /api/listings/search:', error)

    return NextResponse.json(
      {
        success: false,
        data: null,
        error: {
          message:
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred',
          code: 'INTERNAL_ERROR',
        },
      },
      { status: 500 }
    )
  }
}

