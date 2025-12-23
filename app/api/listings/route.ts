/**
 * GET /api/listings
 *
 * List active car listings with optional filters, pagination, and sorting
 *
 * Query Parameters:
 * - brand: Filter by brand (e.g., "Hyundai", "Kia")
 * - bodyType: Filter by body type (e.g., "sedan", "suv", "truck")
 * - destinationPort: Filter by destination port (e.g., "lagos", "mombasa")
 * - status: Filter by status (default: "active")
 * - minPrice: Minimum price filter
 * - maxPrice: Maximum price filter
 * - minYear: Minimum year filter
 * - maxYear: Maximum year filter
 * - transmission: Filter by transmission (e.g., "Automatic", "Manual")
 * - fuelType: Filter by fuel type (e.g., "Petrol", "Diesel", "Hybrid", "Electric")
 * - search: Keyword search on brand, model, title, location
 * - page: Page number (default: 1)
 * - pageSize: Items per page (default: 12, max: 100)
 * - sortBy: Sort field ("price", "year", "created_at", "mileage") (default: "created_at")
 * - sortOrder: Sort direction ("asc", "desc") (default: "desc")
 *
 * Response:
 * {
 *   success: true,
 *   data: {
 *     items: CarListing[],
 *     total: number,
 *     page: number,
 *     pageSize: number,
 *     totalPages: number
 *   },
 *   error: null
 * }
 *
 * POST /api/listings
 *
 * Create a new car listing (Dealer only)
 *
 * Request Body:
 * {
 *   title: string
 *   brand: string
 *   model: string
 *   year: number
 *   price: number
 *   mileage?: number
 *   transmission?: string
 *   fuelType?: string
 *   bodyType?: string
 *   condition?: string
 *   location?: string
 *   destinationPort?: string
 *   images?: string[]
 *   specifications?: object
 * }
 */

import { getCurrentDealer, getCurrentUser } from '@/lib/auth/supabase-auth-server'
import { getActiveListings } from '@/lib/repositories/listings'
import { supabaseServer } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams
    
    // String filters
    const brand = searchParams.get('brand') || undefined
    const bodyType = searchParams.get('bodyType') || undefined
    const destinationPort = searchParams.get('destinationPort') || undefined
    const status = (searchParams.get('status') as any) || 'active'
    const transmission = searchParams.get('transmission') || undefined
    const fuelType = searchParams.get('fuelType') || undefined
    const search = searchParams.get('search') || undefined
    
    // Numeric filters
    const minPrice = searchParams.get('minPrice') 
      ? parseInt(searchParams.get('minPrice')!, 10) 
      : undefined
    const maxPrice = searchParams.get('maxPrice') 
      ? parseInt(searchParams.get('maxPrice')!, 10) 
      : undefined
    const minYear = searchParams.get('minYear') 
      ? parseInt(searchParams.get('minYear')!, 10) 
      : undefined
    const maxYear = searchParams.get('maxYear') 
      ? parseInt(searchParams.get('maxYear')!, 10) 
      : undefined
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1', 10)
    const pageSize = Math.min(
      parseInt(searchParams.get('pageSize') || '12', 10),
      100
    )
    
    // Sorting
    const sortByParam = searchParams.get('sortBy')
    const sortBy = (['price', 'year', 'created_at', 'mileage'].includes(sortByParam || '') 
      ? sortByParam 
      : 'created_at') as 'price' | 'year' | 'created_at' | 'mileage'
    const sortOrderParam = searchParams.get('sortOrder')
    const sortOrder = (['asc', 'desc'].includes(sortOrderParam || '') 
      ? sortOrderParam 
      : 'desc') as 'asc' | 'desc'

    // Validate pagination parameters
    if (page < 1) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: {
            message: 'Page must be greater than 0',
            code: 'INVALID_PAGE',
          },
        },
        { status: 400 }
      )
    }

    if (pageSize < 1) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: {
            message: 'Page size must be greater than 0',
            code: 'INVALID_PAGE_SIZE',
          },
        },
        { status: 400 }
      )
    }

    // Validate status
    const validStatuses = ['pending', 'active', 'sold', 'rejected']
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: {
            message: `Status must be one of: ${validStatuses.join(', ')}`,
            code: 'INVALID_STATUS',
          },
        },
        { status: 400 }
      )
    }

    // Fetch listings from repository
    const result = await getActiveListings({
      brand,
      bodyType,
      destinationPort,
      status,
      minPrice,
      maxPrice,
      minYear,
      maxYear,
      transmission,
      fuelType,
      search,
      page,
      pageSize,
      sortBy,
      sortOrder,
    })

    // Return success response
    return NextResponse.json(
      {
        success: true,
        data: result,
        error: null,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in GET /api/listings:', error)

    // Return error response
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

/**
 * POST /api/listings
 * Create a new car listing (Dealer only)
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Check authentication
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: {
            message: 'Authentication required',
            code: 'UNAUTHORIZED',
          },
        },
        { status: 401 }
      )
    }

    // 2. Get dealer profile
    const dealer = await getCurrentDealer()
    if (!dealer) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: {
            message: 'Dealer profile required. Please complete your dealer registration.',
            code: 'DEALER_PROFILE_REQUIRED',
          },
        },
        { status: 403 }
      )
    }

    // 3. Parse request body
    const body = await request.json()

    // 4. Validate required fields
    const { title, brand, model, year, price } = body
    if (!title || !brand || !model || !year || !price) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: {
            message: 'Missing required fields: title, brand, model, year, price',
            code: 'VALIDATION_ERROR',
          },
        },
        { status: 400 }
      )
    }

    // 5. Prepare listing data
    const listingData = {
      dealer_id: dealer.id,
      title: title.trim(),
      brand: brand.trim(),
      model: model.trim(),
      year: parseInt(year),
      price: parseFloat(price),
      currency: body.currency || 'USD',
      mileage: body.mileage ? parseInt(body.mileage) : null,
      body_type: body.bodyType || null,
      transmission: body.transmission || null,
      fuel_type: body.fuelType || null,
      condition: body.condition || null,
      location: body.location || null,
      destination_port: body.destinationPort || null,
      images: body.images || null,
      specifications: body.specifications || null,
      status: 'pending' as const, // New listings start as pending
      featured: false,
      views: 0,
    }

    // 6. Insert into database
    const { data, error } = await supabaseServer
      .from('car_listings')
      .insert(listingData as any)
      .select()
      .single()

    if (error) {
      console.error('Error creating listing:', error)
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: {
            message: `Failed to create listing: ${error.message}`,
            code: 'DATABASE_ERROR',
          },
        },
        { status: 500 }
      )
    }

    // 7. Update dealer's active_listings count
    // TODO: Fix Supabase types for update operation
    // await supabaseServer
    //   .from('dealers')
    //   .update({ active_listings: dealer.active_listings + 1 })
    //   .eq('id', dealer.id)

    // 8. Return success
    return NextResponse.json(
      {
        success: true,
        data: data,
        error: null,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error in POST /api/listings:', error)

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
