/**
 * Stripe Webhook Handler
 * 
 * CRITICAL SECURITY ENDPOINT - Processes payment events from Stripe
 * 
 * This endpoint:
 * - Verifies webhook signatures (REQUIRED for security)
 * - Processes payment lifecycle events
 * - Updates database records
 * - Sends notifications
 * - Creates audit logs
 * 
 * POST /api/stripe/webhooks
 */

import { getDealerEmail as getDealerEmailFromDb, sendDealerSaleNotificationEmail, sendPaymentSuccessEmail } from '@/lib/email/send';
import { stripe } from '@/lib/stripe/server';
import { supabaseServer } from '@/lib/supabase-server';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// =====================================================
// CONFIGURATION
// =====================================================

// Disable body parsing - we need raw body for signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

// =====================================================
// HELPER FUNCTIONS
// =====================================================

/**
 * Read raw request body as string
 */
async function getRawBody(request: NextRequest): Promise<string> {
  const chunks: Uint8Array[] = [];
  const reader = request.body?.getReader();

  if (!reader) {
    throw new Error('No request body');
  }

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  const buffer = Buffer.concat(chunks);
  return buffer.toString('utf8');
}

/**
 * Verify Stripe webhook signature
 */
function verifyWebhookSignature(
  rawBody: string,
  signature: string
): Stripe.Event {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error('Missing STRIPE_WEBHOOK_SECRET environment variable');
  }

  try {
    return stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Webhook signature verification failed: ${errorMessage}`);
  }
}

/**
 * Update transaction status in database
 */
async function updateTransaction(
  paymentIntentId: string,
  updates: {
    status?: 'pending' | 'processing' | 'succeeded' | 'failed' | 'refunded';
    completed_at?: string;
    metadata?: any;
  }
) {
  const { data, error } = await (supabaseServer
    .from('transactions') as any)
    .update(updates)
    .eq('stripe_payment_intent_id', paymentIntentId)
    .select('id, listing_id, buyer_email, buyer_name, dealer_id')
    .single();

  if (error) {
    console.error('[Webhook] Failed to update transaction:', error);
    throw new Error('Failed to update transaction');
  }

  return data as {
    id: string;
    listing_id: string;
    buyer_email: string;
    buyer_name: string | null;
    dealer_id: string | null;
  };
}

/**
 * Update listing status
 */
async function updateListingStatus(
  listingId: string,
  status: 'pending' | 'active' | 'sold' | 'rejected'
) {
  const { error } = await (supabaseServer
    .from('car_listings') as any)
    .update({ status })
    .eq('id', listingId);

  if (error) {
    console.error('[Webhook] Failed to update listing status:', error);
    throw new Error('Failed to update listing status');
  }
}

/**
 * Create audit log entry
 */
async function createAuditLog(
  action: string,
  resourceType: string,
  resourceId: string,
  details: any
) {
  try {
    const { error } = await (supabaseServer.rpc as any)('log_audit', {
      p_action: action,
      p_resource_type: resourceType,
      p_resource_id: resourceId,
      p_details: details,
      p_ip_address: null,
    });

    if (error) {
      console.warn('[Webhook] Failed to create audit log:', error);
    }
  } catch (err) {
    console.warn('[Webhook] Audit log error:', err);
  }
}

/**
 * Send email notification (placeholder - implement with your email service)
 */
async function sendEmail(params: {
  to: string;
  subject: string;
  type: 'payment_success' | 'payment_failed' | 'refund_processed' | 'dealer_notification';
  data: any;
}) {
  console.log('[Webhook] Email notification:', {
    to: params.to,
    subject: params.subject,
    type: params.type,
  });

  // TODO: Implement actual email sending using Resend or your email service
  // Example:
  // await resend.emails.send({
  //   from: 'SK AutoSphere <notifications@skautosphere.com>',
  //   to: params.to,
  //   subject: params.subject,
  //   html: generateEmailTemplate(params.type, params.data),
  // });
}

/**
 * Get dealer email from database
 */
async function getDealerEmail(dealerId: string): Promise<string | null> {
  try {
    const { data, error } = await supabaseServer
      .from('dealers')
      .select('user_id, users(email)')
      .eq('id', dealerId)
      .single();

    if (error || !data) {
      console.warn('[Webhook] Failed to get dealer email:', error);
      return null;
    }

    return (data as any).users?.email || null;
  } catch (err) {
    console.warn('[Webhook] Error getting dealer email:', err);
    return null;
  }
}

/**
 * Check if event was already processed (idempotency)
 */
const processedEvents = new Set<string>();

function isEventProcessed(eventId: string): boolean {
  return processedEvents.has(eventId);
}

function markEventAsProcessed(eventId: string): void {
  processedEvents.add(eventId);

  // Clean up old events after 1 hour to prevent memory leak
  setTimeout(() => {
    processedEvents.delete(eventId);
  }, 60 * 60 * 1000);
}

// =====================================================
// EVENT HANDLERS
// =====================================================

/**
 * Handle payment_intent.succeeded event
 */
async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('[Webhook] Processing payment success:', paymentIntent.id);

  try {
    // 1. Update transaction record
    const transaction = await updateTransaction(paymentIntent.id, {
      status: 'succeeded',
      completed_at: new Date().toISOString(),
      metadata: {
        stripe_charge_id: paymentIntent.latest_charge,
        payment_method: paymentIntent.payment_method,
        completed_at: new Date().toISOString(),
      },
    });

    console.log('[Webhook] Transaction updated:', transaction.id);

    // 2. Update listing to 'sold'
    await updateListingStatus(transaction.listing_id, 'sold');
    console.log('[Webhook] Listing marked as sold:', transaction.listing_id);

    // 3. Create audit log
    await createAuditLog(
      'payment_succeeded',
      'transaction',
      transaction.id,
      {
        payment_intent_id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        listing_id: transaction.listing_id,
      }
    );

    // 4. Send confirmation email to buyer
    // Fetch listing details for email
    const { data: listingDetails } = await supabaseServer
      .from('car_listings')
      .select('brand, model, year, title')
      .eq('id', transaction.listing_id)
      .single();

    // Get dealer name (only if dealer_id exists)
    let dealerDetails: { business_name: string; user_id: string } | null = null;
    if (transaction.dealer_id) {
      const { data } = await supabaseServer
        .from('dealers')
        .select('business_name, user_id')
        .eq('id', transaction.dealer_id)
        .single();
      dealerDetails = data as { business_name: string; user_id: string } | null;
    }

    if (transaction.buyer_email) {
      await sendPaymentSuccessEmail({
        buyerEmail: transaction.buyer_email,
        buyerName: transaction.buyer_name || 'Valued Customer',
        transactionId: transaction.id,
        listingTitle: (listingDetails as any)?.title || 'Vehicle Purchase',
        vehicleBrand: (listingDetails as any)?.brand || '',
        vehicleModel: (listingDetails as any)?.model || '',
        vehicleYear: (listingDetails as any)?.year || new Date().getFullYear(),
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency.toUpperCase(),
        dealerName: (dealerDetails as any)?.business_name || 'SK AutoSphere Dealer',
      });
      console.log('[Webhook] Payment success email sent to buyer');
    }

    // 5. Send notification to dealer
    if (transaction.dealer_id && dealerDetails) {
      const dealerEmail = await getDealerEmailFromDb((dealerDetails as any).user_id);
      if (dealerEmail) {
        await sendDealerSaleNotificationEmail({
          dealerEmail,
          dealerName: (dealerDetails as any).business_name || 'Dealer',
          transactionId: transaction.id,
          listingTitle: (listingDetails as any)?.title || 'Vehicle',
          vehicleBrand: (listingDetails as any)?.brand || '',
          vehicleModel: (listingDetails as any)?.model || '',
          vehicleYear: (listingDetails as any)?.year || new Date().getFullYear(),
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency.toUpperCase(),
          buyerName: transaction.buyer_name || 'Customer',
          buyerEmail: transaction.buyer_email,
        });
        console.log('[Webhook] Sale notification sent to dealer');
      }
    }

    console.log('[Webhook] Payment succeeded processing complete');
  } catch (error) {
    console.error('[Webhook] Error processing payment success:', error);
    throw error;
  }
}

/**
 * Handle payment_intent.payment_failed event
 */
async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('[Webhook] Processing payment failure:', paymentIntent.id);

  try {
    // 1. Update transaction record
    const transaction = await updateTransaction(paymentIntent.id, {
      status: 'failed',
      metadata: {
        error_code: paymentIntent.last_payment_error?.code,
        error_message: paymentIntent.last_payment_error?.message,
        failure_reason: paymentIntent.cancellation_reason,
        failed_at: new Date().toISOString(),
      },
    });

    console.log('[Webhook] Transaction marked as failed:', transaction.id);

    // 2. Create audit log
    await createAuditLog(
      'payment_failed',
      'transaction',
      transaction.id,
      {
        payment_intent_id: paymentIntent.id,
        error_code: paymentIntent.last_payment_error?.code,
        error_message: paymentIntent.last_payment_error?.message,
      }
    );

    // 3. Send failure notification to buyer
    await sendEmail({
      to: transaction.buyer_email,
      subject: 'Payment Failed - Action Required',
      type: 'payment_failed',
      data: {
        buyer_name: transaction.buyer_name,
        transaction_id: transaction.id,
        error_message: paymentIntent.last_payment_error?.message || 'Unknown error',
      },
    });

    console.log('[Webhook] Payment failure processing complete');
  } catch (error) {
    console.error('[Webhook] Error processing payment failure:', error);
    throw error;
  }
}

/**
 * Handle payment_intent.canceled event
 */
async function handlePaymentCanceled(paymentIntent: Stripe.PaymentIntent) {
  console.log('[Webhook] Processing payment cancellation:', paymentIntent.id);

  try {
    // Update transaction record
    await updateTransaction(paymentIntent.id, {
      status: 'failed',
      metadata: {
        cancellation_reason: paymentIntent.cancellation_reason,
        canceled_at: new Date().toISOString(),
      },
    });

    // Create audit log
    await createAuditLog(
      'payment_canceled',
      'transaction',
      paymentIntent.id,
      {
        cancellation_reason: paymentIntent.cancellation_reason,
      }
    );

    console.log('[Webhook] Payment cancellation processing complete');
  } catch (error) {
    console.error('[Webhook] Error processing payment cancellation:', error);
    throw error;
  }
}

/**
 * Handle charge.refunded event
 */
async function handleChargeRefunded(charge: Stripe.Charge) {
  console.log('[Webhook] Processing refund:', charge.id);

  try {
    // Find the payment intent ID
    const paymentIntentId = typeof charge.payment_intent === 'string'
      ? charge.payment_intent
      : charge.payment_intent?.id;

    if (!paymentIntentId) {
      console.warn('[Webhook] No payment intent ID found for charge:', charge.id);
      return;
    }

    // 1. Update transaction record
    const transaction = await updateTransaction(paymentIntentId, {
      status: 'refunded',
      metadata: {
        refund_id: charge.refunds?.data[0]?.id,
        refund_amount: charge.amount_refunded,
        refund_reason: charge.refunds?.data[0]?.reason,
        refunded_at: new Date().toISOString(),
      },
    });

    console.log('[Webhook] Transaction marked as refunded:', transaction.id);

    // 2. Update listing back to 'active' (make it available again)
    await updateListingStatus(transaction.listing_id, 'active');
    console.log('[Webhook] Listing restored to active:', transaction.listing_id);

    // 3. Create audit log
    await createAuditLog(
      'charge_refunded',
      'transaction',
      transaction.id,
      {
        charge_id: charge.id,
        refund_amount: charge.amount_refunded,
        refund_reason: charge.refunds?.data[0]?.reason,
      }
    );

    // 4. Send refund confirmation email
    await sendEmail({
      to: transaction.buyer_email,
      subject: 'Refund Processed - SK AutoSphere',
      type: 'refund_processed',
      data: {
        buyer_name: transaction.buyer_name,
        transaction_id: transaction.id,
        refund_amount: charge.amount_refunded / 100,
        currency: charge.currency.toUpperCase(),
      },
    });

    console.log('[Webhook] Refund processing complete');
  } catch (error) {
    console.error('[Webhook] Error processing refund:', error);
    throw error;
  }
}

// =====================================================
// MAIN WEBHOOK HANDLER
// =====================================================

export async function POST(request: NextRequest) {
  console.log('[Webhook] Received webhook event');

  try {
    // ============================================
    // 1. GET SIGNATURE AND RAW BODY
    // ============================================

    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      console.error('[Webhook] Missing stripe-signature header');
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    let rawBody: string;
    try {
      rawBody = await getRawBody(request);
    } catch (error) {
      console.error('[Webhook] Failed to read request body:', error);
      return NextResponse.json(
        { error: 'Failed to read request body' },
        { status: 400 }
      );
    }

    // ============================================
    // 2. VERIFY WEBHOOK SIGNATURE (CRITICAL!)
    // ============================================

    let event: Stripe.Event;

    try {
      event = verifyWebhookSignature(rawBody, signature);
      console.log('[Webhook] Signature verified:', event.type);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('[Webhook] Signature verification failed:', errorMessage);

      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    // ============================================
    // 3. CHECK IDEMPOTENCY
    // ============================================

    if (isEventProcessed(event.id)) {
      console.log('[Webhook] Event already processed:', event.id);
      return NextResponse.json({ received: true, processed: 'duplicate' });
    }

    markEventAsProcessed(event.id);

    // ============================================
    // 4. PROCESS EVENT BY TYPE
    // ============================================

    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
          break;

        case 'payment_intent.payment_failed':
          await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
          break;

        case 'payment_intent.canceled':
          await handlePaymentCanceled(event.data.object as Stripe.PaymentIntent);
          break;

        case 'charge.refunded':
          await handleChargeRefunded(event.data.object as Stripe.Charge);
          break;

        default:
          console.log('[Webhook] Unhandled event type:', event.type);
      }

      // ============================================
      // 5. RETURN SUCCESS (ALWAYS 200 FOR STRIPE)
      // ============================================

      return NextResponse.json({
        received: true,
        eventId: event.id,
        eventType: event.type
      });

    } catch (processingError) {
      // Log the error but still return 200 to Stripe
      // This prevents Stripe from retrying immediately
      console.error('[Webhook] Error processing event:', processingError);

      // You might want to store failed events for manual review
      await createAuditLog(
        'webhook_processing_error',
        'stripe_event',
        event.id,
        {
          event_type: event.type,
          error: processingError instanceof Error ? processingError.message : 'Unknown error',
        }
      );

      // Still return 200 to acknowledge receipt
      return NextResponse.json({
        received: true,
        error: 'Processing error logged',
        eventId: event.id
      });
    }

  } catch (error) {
    // ============================================
    // GLOBAL ERROR HANDLER
    // ============================================

    console.error('[Webhook] Unexpected error:', error);

    // For unexpected errors, return 500
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// =====================================================
// METHOD NOT ALLOWED HANDLERS
// =====================================================

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. This endpoint only accepts POST requests from Stripe.' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed. This endpoint only accepts POST requests from Stripe.' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed. This endpoint only accepts POST requests from Stripe.' },
    { status: 405 }
  );
}
