/**
 * Transaction API - Get Single Transaction
 * 
 * GET /api/transactions/[id]
 * - Get single transaction details
 * - Verify user has access (buyer, dealer, or admin)
 * - Include full details: listing, payment method, status history
 */

import { createSupabaseServerActionClient, getCurrentDealer, getCurrentUser, isAdmin } from '@/lib/auth/supabase-auth-server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseServerActionClient();
    const { id } = await params;
    
    // 1. Check authentication
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. Fetch transaction with related data
    const { data: transaction, error } = await supabase
      .from('transactions')
      .select(`
        *,
        car_listings (
          id,
          title,
          make,
          model,
          year,
          price,
          currency,
          primary_image_url,
          mileage,
          mileage_unit,
          condition,
          color,
          vin,
          status,
          location,
          country
        ),
        dealers (
          id,
          business_name,
          verified,
          trust_score,
          country,
          city,
          phone,
          email
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Transaction not found' },
          { status: 404 }
        );
      }
      console.error('Error fetching transaction:', error);
      return NextResponse.json(
        { error: 'Failed to fetch transaction' },
        { status: 500 }
      );
    }

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // 3. Verify user has access to this transaction
    const userIsAdmin = await isAdmin();
    const dealer = await getCurrentDealer();
    
    const hasAccess = 
      userIsAdmin || 
      (transaction as any).buyer_id === user.id || 
      (dealer && (transaction as any).dealer_id === dealer.id);

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have access to this transaction' },
        { status: 403 }
      );
    }

    // 4. Get buyer information (for dealers and admins)
    let buyerInfo = null;
    if (userIsAdmin || (dealer && (transaction as any).dealer_id === dealer.id)) {
      buyerInfo = {
        email: (transaction as any).buyer_email,
        name: (transaction as any).buyer_name,
        phone: (transaction as any).buyer_phone,
        country: (transaction as any).buyer_country,
        shipping_address: (transaction as any).shipping_address
      };
    }

    // 5. Get audit log history for this transaction (admins only)
    let statusHistory = null;
    if (userIsAdmin) {
      const { data: auditLogs } = await supabase
        .from('audit_logs')
        .select('action, details, created_at')
        .eq('resource_type', 'transaction')
        .eq('resource_id', id)
        .order('created_at', { ascending: true });
      
      statusHistory = auditLogs || [];
    }

    // 6. Return transaction details
    const txData = transaction as any;
    return NextResponse.json({
      transaction: {
        id: txData.id,
        listing_id: txData.listing_id,
        amount: txData.amount,
        currency: txData.currency,
        stripe_payment_intent_id: txData.stripe_payment_intent_id,
        stripe_payment_method: txData.stripe_payment_method,
        status: txData.status,
        metadata: txData.metadata,
        created_at: txData.created_at,
        completed_at: txData.completed_at,
        updated_at: txData.updated_at,
        
        // Related data
        listing: txData.car_listings,
        dealer: txData.dealers,
        
        // Conditional data based on role
        buyer: buyerInfo,
        status_history: statusHistory
      }
    });

  } catch (error) {
    console.error('Transaction detail error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
