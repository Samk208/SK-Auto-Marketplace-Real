/**
 * Payment Status API Route
 * 
 * Verifies payment status and retrieves transaction details
 * after successful payment completion.
 * 
 * GET /api/stripe/payment-status?payment_intent=xxx&listing_id=xxx
 */

import { supabaseServer } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const paymentIntentId = searchParams.get('payment_intent');
    const listingId = searchParams.get('listing_id');

    // Validate parameters
    if (!paymentIntentId || !listingId) {
      return NextResponse.json(
        { error: 'Missing payment_intent or listing_id parameter' },
        { status: 400 }
      );
    }

    // =====================================================
    // 1. RETRIEVE PAYMENT INTENT FROM STRIPE
    // =====================================================

    let paymentIntent: Stripe.PaymentIntent;
    try {
      paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error) {
      console.error('[Payment Status] Error retrieving payment intent:', error);
      return NextResponse.json(
        { error: 'Invalid payment intent ID' },
        { status: 404 }
      );
    }

    // Check payment status
    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json(
        {
          success: false,
          error: 'Payment has not been completed',
          status: paymentIntent.status,
        },
        { status: 400 }
      );
    }

    // =====================================================
    // 2. RETRIEVE TRANSACTION FROM DATABASE
    // =====================================================

    const { data: transaction, error: transactionError } = await (supabaseServer
      .from('transactions') as any)
      .select(`
        *,
        car_listings (
          id,
          title,
          brand,
          model,
          year
        )
      `)
      .eq('stripe_payment_intent_id', paymentIntentId)
      .eq('listing_id', listingId)
      .single();

    if (transactionError || !transaction) {
      console.error('[Payment Status] Transaction not found:', transactionError);
      return NextResponse.json(
        { error: 'Transaction record not found' },
        { status: 404 }
      );
    }

    // =====================================================
    // 3. FORMAT RESPONSE
    // =====================================================

    const listing = transaction.car_listings;
    const listingTitle = listing
      ? `${listing.year} ${listing.brand} ${listing.model}`
      : 'Vehicle Purchase';

    // Get receipt URL from Stripe charge
    let receiptUrl: string | undefined;
    if (paymentIntent.latest_charge) {
      const charge = await stripe.charges.retrieve(
        paymentIntent.latest_charge as string
      );
      receiptUrl = charge.receipt_url || undefined;
    }

    const response = {
      success: true,
      transactionId: transaction.id,
      paymentIntentId: paymentIntent.id,
      amount: transaction.amount,
      currency: transaction.currency.toUpperCase(),
      listingId: transaction.listing_id,
      listingTitle,
      buyerEmail: transaction.buyer_email || paymentIntent.receipt_email || '',
      createdAt: transaction.created_at,
      receiptUrl,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('[Payment Status] Unexpected error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
