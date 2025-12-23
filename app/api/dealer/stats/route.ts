/**
 * GET /api/dealer/stats
 *
 * Get enhanced dealer statistics using the get_dealer_stats_enhanced function
 * Requires dealer authentication
 *
 * Response:
 * {
 *   success: true,
 *   data: {
 *     total_listings: number
 *     active_listings: number
 *     sold_listings: number
 *     pending_listings: number
 *     rejected_listings: number
 *     total_views: number
 *     total_inquiries: number
 *     new_inquiries: number
 *     total_transactions: number
 *     completed_transactions: number
 *     total_revenue: number
 *     avg_listing_price: number
 *   }
 * }
 */

import { getCurrentDealer } from '@/lib/auth/supabase-auth-server'
import { supabaseServer } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check dealer authentication
    const dealer = await getCurrentDealer()
    if (!dealer) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: {
            message: 'Dealer authentication required',
            code: 'UNAUTHORIZED',
          },
        },
        { status: 401 }
      )
    }

    // Call the get_dealer_stats_enhanced function
    // @ts-ignore - RPC function defined in migration
    const { data, error } = await supabaseServer.rpc('get_dealer_stats_enhanced', {
      p_dealer_id: dealer.id,
    })

    if (error) {
      console.error('Error fetching dealer stats:', error)
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: {
            message: `Failed to fetch stats: ${error.message}`,
            code: 'DATABASE_ERROR',
          },
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: data,
        error: null,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in GET /api/dealer/stats:', error)

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

