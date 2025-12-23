/**
 * POST /api/views
 *
 * Record a vehicle view with analytics data
 * Uses the record_vehicle_view database function
 *
 * Request Body:
 * {
 *   listing_id: string
 *   viewer_country?: string (ISO 2-letter code)
 *   referrer?: string
 * }
 */

import { supabaseServer } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { listing_id } = body

    if (!listing_id) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: {
            message: 'listing_id is required',
            code: 'VALIDATION_ERROR',
          },
        },
        { status: 400 }
      )
    }

    // Get viewer info from headers
    const forwarded = request.headers.get('x-forwarded-for')
    const viewer_ip = forwarded?.split(',')[0]?.trim() || 
                      request.headers.get('x-real-ip') || 
                      null
    const user_agent = request.headers.get('user-agent') || null
    const referrer = body.referrer || request.headers.get('referer') || null
    const viewer_country = body.viewer_country || null

    // Call the record_vehicle_view function
    // @ts-ignore - RPC function defined in migration
    const { error } = await supabaseServer.rpc('record_vehicle_view', {
      p_listing_id: listing_id,
      p_viewer_country: viewer_country,
      p_viewer_ip: viewer_ip,
      p_user_agent: user_agent,
      p_referrer: referrer,
    })

    if (error) {
      console.error('Error recording view:', error)
      // Don't fail the request - view tracking is non-critical
      return NextResponse.json(
        {
          success: true,
          data: { recorded: false, reason: error.message },
          error: null,
        },
        { status: 200 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: { recorded: true },
        error: null,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in POST /api/views:', error)

    // View tracking failures should not break the user experience
    return NextResponse.json(
      {
        success: true,
        data: { recorded: false },
        error: null,
      },
      { status: 200 }
    )
  }
}

