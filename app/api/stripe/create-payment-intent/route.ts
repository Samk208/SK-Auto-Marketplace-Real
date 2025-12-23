/**
 * Stripe Payment Intent Creation API
 * 
 * Creates a payment intent for vehicle purchase and records transaction in database.
 * POST /api/stripe/create-payment-intent
 */

import { formatAmountForStripe, stripe } from '@/lib/stripe/server';
import { supabaseServer } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// =====================================================
// REQUEST VALIDATION SCHEMA
// =====================================================

const AddressSchema = z.object({
  line1: z.string().min(1, 'Address line 1 is required'),
  line2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postal_code: z.string().min(1, 'Postal code is required'),
  country: z.string().length(2, 'Country must be a 2-letter ISO code'),
});

const BuyerInfoSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required'),
  phone: z.string().optional(),
  country: z.string().length(2, 'Country must be a 2-letter ISO code').optional(),
});

const CreatePaymentIntentSchema = z.object({
  listingId: z.string().uuid('Invalid listing ID format'),
  buyerInfo: BuyerInfoSchema,
  shippingAddress: AddressSchema.optional(),
});

type CreatePaymentIntentRequest = z.infer<typeof CreatePaymentIntentSchema>;

// =====================================================
// HELPER FUNCTIONS
// =====================================================

/**
 * Fetch listing details from database
 */
async function fetchListing(listingId: string) {
  const { data: listing, error } = await supabaseServer
    .from('car_listings')
    .select(`
      id,
      title,
      brand,
      model,
      year,
      price,
      currency,
      status,
      dealer_id
    `)
    .eq('id', listingId)
    .single();

  if (error) {
    console.error('[Payment Intent] Database error fetching listing:', error);
    throw new Error('Failed to fetch listing from database');
  }

  if (!listing) {
    throw new Error('Listing not found');
  }

  return listing as {
    id: string;
    title: string;
    brand: string;
    model: string;
    year: number;
    price: number;
    currency: string;
    status: string;
    dealer_id: string;
  };
}

/**
 * Create transaction record in database
 */
async function createTransactionRecord(params: {
  listingId: string;
  dealerId: string;
  buyerInfo: z.infer<typeof BuyerInfoSchema>;
  shippingAddress?: z.infer<typeof AddressSchema>;
  paymentIntentId: string;
  amount: number;
  currency: string;
}) {
  // Type assertion needed due to TypeScript inference issue with Supabase client
  const { data: transaction, error } = await (supabaseServer
    .from('transactions') as any)
    .insert({
      listing_id: params.listingId,
      dealer_id: params.dealerId,
      buyer_email: params.buyerInfo.email,
      buyer_name: params.buyerInfo.name,
      buyer_phone: params.buyerInfo.phone || null,
      buyer_country: params.buyerInfo.country || null,
      shipping_address: params.shippingAddress || null,
      stripe_payment_intent_id: params.paymentIntentId,
      amount: params.amount,
      currency: params.currency,
      status: 'pending',
      metadata: {
        created_via: 'api',
        created_at: new Date().toISOString(),
      },
    })
    .select('id')
    .single();

  if (error) {
    console.error('[Payment Intent] Database error creating transaction:', error);
    throw new Error('Failed to create transaction record');
  }

  return transaction as { id: string };
}

// =====================================================
// API ROUTE HANDLER
// =====================================================

export async function POST(request: NextRequest) {
  try {
    // ============================================
    // 1. PARSE AND VALIDATE REQUEST
    // ============================================
    
    let body: CreatePaymentIntentRequest;
    
    try {
      const rawBody = await request.json();
      body = CreatePaymentIntentSchema.parse(rawBody);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          {
            error: 'Validation error',
            details: error.errors.map(err => ({
              field: err.path.join('.'),
              message: err.message,
            })),
          },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    console.log('[Payment Intent] Processing request for listing:', body.listingId);

    // ============================================
    // 2. FETCH AND VALIDATE LISTING
    // ============================================

    let listing;
    
    try {
      listing = await fetchListing(body.listingId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (errorMessage === 'Listing not found') {
        return NextResponse.json(
          { error: 'Listing not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch listing', details: errorMessage },
        { status: 500 }
      );
    }

    // Check if listing is available for purchase
    if (listing.status !== 'active') {
      console.warn('[Payment Intent] Listing not available:', {
        listingId: body.listingId,
        status: listing.status,
      });
      
      return NextResponse.json(
        {
          error: 'Listing not available',
          message: `This vehicle is currently ${listing.status} and cannot be purchased.`,
        },
        { status: 400 }
      );
    }

    // Validate price
    if (!listing.price || listing.price <= 0) {
      console.error('[Payment Intent] Invalid listing price:', listing.price);
      
      return NextResponse.json(
        { error: 'Invalid listing price' },
        { status: 400 }
      );
    }

    console.log('[Payment Intent] Listing validated:', {
      id: listing.id,
      title: listing.title,
      price: listing.price,
      currency: listing.currency,
    });

    // ============================================
    // 3. CREATE STRIPE PAYMENT INTENT
    // ============================================

    const currency = listing.currency?.toLowerCase() || 'usd';
    const amount = listing.price;
    const amountInCents = formatAmountForStripe(amount, currency);

    // Construct description
    const description = `Purchase: ${listing.brand} ${listing.model} ${listing.year}`;

    let paymentIntent;

    try {
      paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency,
        automatic_payment_methods: {
          enabled: true,
        },
        description,
        receipt_email: body.buyerInfo.email,
        metadata: {
          listing_id: listing.id,
          dealer_id: listing.dealer_id,
          buyer_email: body.buyerInfo.email,
          buyer_name: body.buyerInfo.name,
          vehicle_title: listing.title,
          vehicle_brand: listing.brand,
          vehicle_model: listing.model,
          vehicle_year: listing.year.toString(),
        },
        shipping: body.shippingAddress ? {
          name: body.buyerInfo.name,
          phone: body.buyerInfo.phone,
          address: {
            line1: body.shippingAddress.line1,
            line2: body.shippingAddress.line2,
            city: body.shippingAddress.city,
            state: body.shippingAddress.state,
            postal_code: body.shippingAddress.postal_code,
            country: body.shippingAddress.country,
          },
        } : undefined,
      });

      console.log('[Payment Intent] Created successfully:', {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
      });
    } catch (error) {
      console.error('[Payment Intent] Stripe API error:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown Stripe error';
      
      return NextResponse.json(
        {
          error: 'Failed to create payment intent',
          details: errorMessage,
        },
        { status: 500 }
      );
    }

    // ============================================
    // 4. CREATE TRANSACTION RECORD
    // ============================================

    let transaction;

    try {
      transaction = await createTransactionRecord({
        listingId: listing.id,
        dealerId: listing.dealer_id,
        buyerInfo: body.buyerInfo,
        shippingAddress: body.shippingAddress,
        paymentIntentId: paymentIntent.id,
        amount,
        currency,
      });

      console.log('[Payment Intent] Transaction record created:', transaction.id);
    } catch (error) {
      // If transaction creation fails, cancel the payment intent
      try {
        await stripe.paymentIntents.cancel(paymentIntent.id);
        console.log('[Payment Intent] Cancelled payment intent due to transaction creation failure');
      } catch (cancelError) {
        console.error('[Payment Intent] Failed to cancel payment intent:', cancelError);
      }

      const errorMessage = error instanceof Error ? error.message : 'Unknown database error';
      
      return NextResponse.json(
        {
          error: 'Failed to create transaction record',
          details: errorMessage,
        },
        { status: 500 }
      );
    }

    // ============================================
    // 5. RETURN SUCCESS RESPONSE
    // ============================================

    return NextResponse.json(
      {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        transactionId: transaction.id,
        amount: amount,
        currency: currency.toUpperCase(),
        listing: {
          id: listing.id,
          title: listing.title,
          brand: listing.brand,
          model: listing.model,
          year: listing.year,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    // ============================================
    // GLOBAL ERROR HANDLER
    // ============================================

    console.error('[Payment Intent] Unexpected error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Internal server error';

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

// =====================================================
// METHOD NOT ALLOWED HANDLER
// =====================================================

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to create payment intent.' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to create payment intent.' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to create payment intent.' },
    { status: 405 }
  );
}
