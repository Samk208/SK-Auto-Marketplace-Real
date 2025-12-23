import { requireAdmin } from '@/lib/auth/admin-auth';
import { createSupabaseServerActionClient } from '@/lib/auth/supabase-auth-server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // 1. Check admin authorization using helper
    const authResult = await requireAdmin();
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const supabase = await createSupabaseServerActionClient();

    // 2. Get listing stats
    const { data: listingsData } = await supabase
      .from('car_listings')
      .select('status, price, created_at')
      .returns<{ status: string; price: number; created_at: string }[]>();

    const listingStats = {
      total: listingsData?.length || 0,
      active: listingsData?.filter((l) => l.status === 'active').length || 0,
      pending: listingsData?.filter((l) => l.status === 'pending').length || 0,
      sold: listingsData?.filter((l) => l.status === 'sold').length || 0,
      rejected: listingsData?.filter((l) => l.status === 'rejected').length || 0,
    };

    // 3. Get dealer stats
    const { data: dealersData } = await supabase
      .from('dealers')
      .select('verified, joined_date')
      .returns<{ verified: boolean; joined_date: string }[]>();

    const dealerStats = {
      total: dealersData?.length || 0,
      verified: dealersData?.filter((d) => d.verified).length || 0,
      unverified: dealersData?.filter((d) => !d.verified).length || 0,
    };

    // 4. Get revenue stats
    let revenueStats = {
      total: 0,
      currency: 'USD',
      growth: 0
    };

    const { data: transactionsData, error: txError } = await supabase
      .from('transactions')
      .select('amount, created_at, status')
      .eq('status', 'succeeded')
      .returns<{ amount: number; created_at: string; status: string }[]>();

    if (!txError && transactionsData) {
      const totalRevenue = transactionsData.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);

      // Calculate 7-day growth
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const recentRevenue = transactionsData
        .filter((tx) => new Date(tx.created_at!) >= sevenDaysAgo)
        .reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);

      revenueStats = {
        total: totalRevenue,
        currency: 'USD',
        growth: totalRevenue > 0 ? (recentRevenue / totalRevenue) * 100 : 0
      };
    }

    // 5. Get recent activity
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const newListingsThisWeek = listingsData?.filter(
      (l) => new Date(l.created_at) >= sevenDaysAgo
    ).length || 0;

    const newDealersThisWeek = dealersData?.filter(
      (d) => new Date(d.joined_date) >= sevenDaysAgo
    ).length || 0;

    // 6. Return stats
    return NextResponse.json({
      listings: listingStats,
      dealers: dealerStats,
      revenue: revenueStats,
      activity: {
        newListingsThisWeek,
        newDealersThisWeek
      },
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
