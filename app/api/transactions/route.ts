/**
 * Transaction API - List Transactions
 * 
 * GET /api/transactions
 * - List transactions for authenticated user
 * - Dealers see their listing transactions
 * - Buyers see their purchases
 * - Admins see all
 * - Supports filtering and pagination
 */

import { createSupabaseServerActionClient, getCurrentDealer, getCurrentUser, isAdmin } from '@/lib/auth/supabase-auth-server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerActionClient();

    // 1. Check authentication
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sort = searchParams.get('sort') || 'created_at';
    const order = searchParams.get('order') || 'desc';

    // Validate pagination
    const validatedPage = Math.max(1, page);
    const validatedLimit = Math.min(Math.max(1, limit), 100); // Max 100 items per page
    const offset = (validatedPage - 1) * validatedLimit;

    // 3. Determine user role and build query
    const userIsAdmin = await isAdmin();
    const dealer = await getCurrentDealer();

    let query = supabase
      .from('transactions')
      .select(`
        id,
        listing_id,
        buyer_id,
        dealer_id,
        amount,
        currency,
        stripe_payment_intent_id,
        stripe_payment_method,
        status,
        buyer_email,
        buyer_name,
        buyer_phone,
        buyer_country,
        shipping_address,
        metadata,
        created_at,
        completed_at,
        updated_at,
        car_listings (
          id,
          title,
          make,
          model,
          year,
          price,
          primary_image_url,
          status
        ),
        dealers (
          id,
          business_name,
          verified,
          trust_score
        )
      `, { count: 'exact' });

    // Apply role-based filtering
    if (userIsAdmin) {
      // Admins see all transactions (no additional filter)
    } else if (dealer) {
      // Dealers see only their transactions
      query = query.eq('dealer_id', dealer.id);
    } else {
      // Regular users see only their purchases
      query = query.eq('buyer_id', user.id);
    }

    // Apply status filter if provided
    if (status) {
      const validStatuses = ['pending', 'processing', 'succeeded', 'failed', 'refunded'];
      if (validStatuses.includes(status)) {
        query = query.eq('status', status);
      }
    }

    // Apply sorting
    const validSortFields = ['created_at', 'amount', 'status', 'completed_at'];
    const sortField = validSortFields.includes(sort) ? sort : 'created_at';
    const sortOrder = order === 'asc' ? true : false;

    query = query.order(sortField, { ascending: sortOrder });

    // Apply pagination
    query = query.range(offset, offset + validatedLimit - 1);

    // 4. Execute query
    const { data: transactions, error, count } = await query;

    if (error) {
      console.error('Error fetching transactions:', error);
      return NextResponse.json(
        { error: 'Failed to fetch transactions' },
        { status: 500 }
      );
    }

    // 5. Return response with pagination metadata
    return NextResponse.json({
      transactions: transactions || [],
      pagination: {
        page: validatedPage,
        limit: validatedLimit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / validatedLimit),
        hasMore: (count || 0) > (offset + validatedLimit)
      },
      role: userIsAdmin ? 'admin' : dealer ? 'dealer' : 'buyer'
    });

  } catch (error) {
    console.error('Transaction list error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerActionClient();
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { listing_id, amount, currency, buyer_email, buyer_name, buyer_phone, buyer_country, shipping_address } = body;

    // Validate required fields
    if (!listing_id || !amount || !currency || !buyer_email || !buyer_name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get listing to verify dealer
    const { data: listing, error: listingError } = await supabase
      .from('car_listings')
      .select('dealer_id, price')
      .eq('id', listing_id)
      .single();

    if (listingError || !listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    // Create transaction
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert({
        listing_id,
        buyer_id: user.id,
        dealer_id: (listing as any).dealer_id,
        amount,
        currency,
        status: 'pending',
        buyer_email,
        buyer_name,
        buyer_phone,
        buyer_country,
        shipping_address,
        metadata: {
          source: 'web_checkout',
          listing_price: (listing as any).price
        }
      } as any)
      .select()
      .single();

    if (transactionError) {
      console.error('Error creating transaction:', transactionError);
      return NextResponse.json(
        { error: 'Failed to create transaction' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, transaction },
      { status: 201 }
    );

  } catch (error) {
    console.error('Transaction create error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
