/**
 * Dealer Listings API - POST (Create)
 * 
 * Creates a new listing for the authenticated dealer.
 */

import { getCurrentUser } from '@/lib/auth/supabase-auth-server'
import { getDealerByUserId } from '@/lib/repositories/dealers'
import { createListingForDealer } from '@/lib/repositories/listings'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Validation schema for creating a listing
const createListingSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters').max(200),
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().int().min(1900).max(2100),
  price: z.number().positive('Price must be positive'),
  mileage: z.number().int().nonnegative().optional(),
  vin: z.string().length(17).optional(),
  color: z.string().optional(),
  previous_owners: z.number().int().nonnegative().optional(),
  fuel_type: z.string().optional(),
  transmission: z.string().optional(),
  body_type: z.string().optional(),
  drive_type: z.string().optional(),
  condition: z.string().optional(),
  location: z.string().optional(),
  destination_port: z.string().optional(),
  status: z.enum(['pending', 'active']).optional().default('pending'),
  featured: z.boolean().optional().default(false),
  description: z.string().max(5000).optional(),
  image_urls: z.array(z.string().url()).optional(),
  primary_image_url: z.string().url().nullable().optional(),
})

export async function POST(request: NextRequest) {
  try {
    // 1. Check authentication
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in to create a listing' },
        { status: 401 }
      )
    }

    // 2. Get dealer profile
    const dealer = await getDealerByUserId(user.id)
    if (!dealer) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'You must be a registered dealer to create listings' },
        { status: 403 }
      )
    }

    // 3. Parse and validate request body
    const body = await request.json()
    const validationResult = createListingSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation Error',
          message: 'Invalid listing data',
          details: validationResult.error.flatten().fieldErrors
        },
        { status: 400 }
      )
    }

    // 4. Create listing
    const listing = await createListingForDealer(dealer.id, validationResult.data)

    return NextResponse.json(
      {
        success: true,
        message: 'Listing created successfully',
        listing
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error in POST /api/dealer/listings:', error)
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Failed to create listing'
      },
      { status: 500 }
    )
  }
}




















