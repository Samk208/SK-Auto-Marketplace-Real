/**
 * GET /api/listings/[id]
 *
 * Get a single car listing by ID
 *
 * Response:
 * Success (200):
 * {
 *   success: true,
 *   data: CarListing,
 *   error: null
 * }
 *
 * Not Found (404):
 * {
 *   success: false,
 *   data: null,
 *   error: { message: "Listing not found", code: "NOT_FOUND" }
 * }
 */

import { getListingById } from '@/lib/repositories/listings'
import { supabaseServer } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // Extract listing ID from route params
    const params = await context.params
    const { id } = params

    // Validate ID format (basic UUID check)
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: {
            message: 'Invalid listing ID format',
            code: 'INVALID_ID',
          },
        },
        { status: 400 }
      )
    }

    // Fetch listing from repository
    const listing = await getListingById(id)

    // Return 404 if not found
    if (!listing) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: {
            message: 'Listing not found',
            code: 'NOT_FOUND',
          },
        },
        { status: 404 }
      )
    }

    // Record view using DMS-inspired function (async, don't wait)
    const forwarded = request.headers.get('x-forwarded-for')
    const viewerIp = forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || null
    const userAgent = request.headers.get('user-agent') || null
    const referrer = request.headers.get('referer') || null

    // Record view asynchronously (fire-and-forget)
    ;(async () => {
      try {
        // @ts-ignore - RPC function defined in migration
        await supabaseServer.rpc('record_vehicle_view', {
          p_listing_id: id,
          p_viewer_country: null, // Could be derived from IP using GeoIP service
          p_viewer_ip: viewerIp,
          p_user_agent: userAgent,
          p_referrer: referrer,
        })
      } catch (error) {
        console.error('Failed to record view:', error)
      }
    })()

    // Return success response
    return NextResponse.json(
      {
        success: true,
        data: listing,
        error: null,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in GET /api/listings/[id]:', error)

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
