/**
 * Dealers Repository
 *
 * Data access layer for dealer-related queries.
 * Handles statistics, profile data, and dealer-specific operations.
 */

import { supabaseServer } from '@/lib/supabase-server'
import type { Database } from '@/types/database'

type DbDealer = Database['public']['Tables']['dealers']['Row']

/**
 * Dealer statistics interface
 */
export interface DealerStats {
  activeListings: number
  totalViews: number
  pendingListings: number
  soldVehicles: number
  totalRevenue: number
  averagePrice: number
}

/**
 * Get dealer statistics
 */
export async function getDealerStats(dealerId: string): Promise<DealerStats> {
  try {
    // Use the enhanced RPC function for better performance and accuracy
    // @ts-ignore - RPC function defined in migration
    const { data, error } = await supabaseServer.rpc('get_dealer_stats_enhanced', {
      p_dealer_id: dealerId
    }) as { data: any, error: any }

    if (error) {
      console.error('Error fetching dealer stats via RPC:', error)
      // Fallback to manual calculation if RPC fails
      return getDealerStatsFallback(dealerId)
    }

    if (!data) {
      return {
        activeListings: 0,
        totalViews: 0,
        pendingListings: 0,
        soldVehicles: 0,
        totalRevenue: 0,
        averagePrice: 0,
      }
    }

    return {
      activeListings: data.active_listings || 0,
      totalViews: data.total_views || 0,
      pendingListings: data.pending_listings || 0,
      soldVehicles: data.sold_vehicles || 0,
      totalRevenue: data.total_revenue || 0,
      averagePrice: data.average_price || 0,
    }
  } catch (error) {
    console.error('Error in getDealerStats:', error)
    throw error
  }
}

/**
 * Fallback manual calculation for dealer stats
 */
async function getDealerStatsFallback(dealerId: string): Promise<DealerStats> {
  // Get dealer info
  const { data: dealer } = await supabaseServer
    .from('dealers')
    .select('sold_vehicles')
    .eq('id' as any, dealerId)
    .single()

  // Get listing counts by status
  const { data: listings } = await supabaseServer
    .from('car_listings')
    .select('status, views, price')
    .eq('dealer_id' as any, dealerId)

  if (!listings) {
    return {
      activeListings: 0,
      totalViews: 0,
      pendingListings: 0,
      soldVehicles: (dealer as any)?.sold_vehicles || 0,
      totalRevenue: 0,
      averagePrice: 0,
    }
  }

  // Calculate statistics
  const activeListings = (listings as any[]).filter((l: any) => l.status === 'active').length
  const pendingListings = (listings as any[]).filter((l: any) => l.status === 'pending').length
  const totalViews = (listings as any[]).reduce((sum: number, l: any) => sum + (l.views || 0), 0)

  // Calculate average price (only for active listings)
  const activePrices = (listings as any[])
    .filter((l: any) => l.status === 'active')
    .map((l: any) => l.price)
  const averagePrice = activePrices.length > 0
    ? activePrices.reduce((sum: number, price: number) => sum + price, 0) / activePrices.length
    : 0

  // For now, revenue is estimated (would need transactions table)
  const totalRevenue = ((dealer as any)?.sold_vehicles || 0) * averagePrice

  return {
    activeListings,
    totalViews,
    pendingListings,
    soldVehicles: (dealer as any)?.sold_vehicles || 0,
    totalRevenue,
    averagePrice,
  }
}

/**
 * Get dealer's own listings
 */
export async function getDealerListings(
  dealerId: string,
  options: {
    status?: 'pending' | 'active' | 'sold' | 'rejected'
    page?: number
    pageSize?: number
  } = {}
) {
  const { status, page = 1, pageSize = 10 } = options

  try {
    let query = supabaseServer
      .from('car_listings')
      .select('*', { count: 'exact' })
      .eq('dealer_id' as any, dealerId)
      .order('created_at', { ascending: false })

    // Filter by status if provided
    if (status) {
      query = query.eq('status' as any, status)
    }

    // Apply pagination
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching dealer listings:', error)
      throw new Error(`Failed to fetch dealer listings: ${error.message}`)
    }

    return {
      listings: data || [],
      total: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize),
    }
  } catch (error) {
    console.error('Error in getDealerListings:', error)
    throw error
  }
}

/**
 * Get dealer profile by user ID
 */
export async function getDealerByUserId(userId: string): Promise<DbDealer | null> {
  try {
    const { data, error } = await supabaseServer
      .from('dealers')
      .select('*')
      .eq('user_id' as any, userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return null
      }
      console.error('Error fetching dealer profile:', error)
      throw new Error(`Failed to fetch dealer profile: ${error.message}`)
    }

    return data as DbDealer
  } catch (error) {
    console.error('Error in getDealerByUserId:', error)
    throw error
  }
}

/**
 * Update dealer profile
 */
export async function updateDealerProfile(
  dealerId: string,
  updates: Partial<Database['public']['Tables']['dealers']['Update']>
) {
  try {
    const { data, error } = await (supabaseServer
      .from('dealers') as any)
      .update(updates)
      .eq('id', dealerId)
      .select()
      .single()

    if (error) {
      console.error('Error updating dealer profile:', error)
      throw new Error(`Failed to update dealer profile: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error('Error in updateDealerProfile:', error)
    throw error
  }
}
