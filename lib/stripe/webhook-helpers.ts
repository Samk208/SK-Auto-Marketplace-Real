/**
 * Stripe Webhook Helper Functions
 * 
 * Utilities for processing Stripe webhook events with proper
 * signature verification, type safety, and error handling.
 */

import { supabaseServer } from '@/lib/supabase-server';
import Stripe from 'stripe';
import { stripe } from './server';

// =====================================================
// TYPE DEFINITIONS
// =====================================================

export interface TransactionUpdate {
  status?: 'pending' | 'processing' | 'succeeded' | 'failed' | 'refunded';
  completed_at?: string;
  metadata?: any;
  stripe_payment_method?: string;
}

export interface PaymentSuccessResult {
  transactionId: string;
  listingId: string;
  buyerEmail: string;
  dealerEmail: string | null;
}

export interface PaymentFailureResult {
  transactionId: string;
  errorCode: string | null;
  errorMessage: string | null;
}

export interface RefundResult {
  transactionId: string;
  listingId: string;
  refundAmount: number;
}

// =====================================================
// RAW BODY HANDLING
// =====================================================

/**
 * Read raw request body as string
 * 
 * Required for Stripe webhook signature verification.
 * The body must be in raw format (not parsed JSON) to verify the signature.
 * 
 * @param request - Next.js Request object
 * @returns Raw body as string
 * 
 * @throws Error if body cannot be read
 * 
 * @example
 * ```ts
 * const rawBody = await getRawBody(request);
 * const event = await verifyWebhookSignature(rawBody, signature, secret);
 * ```
 */
export async function getRawBody(request: Request): Promise<string> {
  try {
    const chunks: Uint8Array[] = [];
    const reader = request.body?.getReader();

    if (!reader) {
      throw new Error('Request body is null or undefined');
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }

    const buffer = Buffer.concat(chunks);
    return buffer.toString('utf8');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to read raw body: ${errorMessage}`);
  }
}

// =====================================================
// SIGNATURE VERIFICATION
// =====================================================

/**
 * Verify Stripe webhook signature
 * 
 * CRITICAL SECURITY FUNCTION: This prevents unauthorized webhook requests.
 * Always call this before processing any webhook event.
 * 
 * @param payload - Raw request body (string, not parsed JSON)
 * @param signature - Value from 'stripe-signature' header
 * @param secret - Webhook signing secret from environment
 * @returns Verified Stripe event object
 * 
 * @throws Error if signature is invalid or verification fails
 * 
 * @example
 * ```ts
 * const event = await verifyWebhookSignature(
 *   rawBody,
 *   headers.get('stripe-signature'),
 *   process.env.STRIPE_WEBHOOK_SECRET
 * );
 * ```
 */
export async function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): Promise<Stripe.Event> {
  if (!signature) {
    throw new Error('Missing stripe-signature header');
  }

  if (!secret) {
    throw new Error('Missing webhook secret. Set STRIPE_WEBHOOK_SECRET environment variable');
  }

  try {
    const event = stripe.webhooks.constructEvent(payload, signature, secret);
    return event;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Webhook signature verification failed: ${errorMessage}`);
  }
}

// =====================================================
// DATABASE OPERATIONS
// =====================================================

/**
 * Update transaction in database
 */
async function updateTransaction(
  paymentIntentId: string,
  updates: TransactionUpdate
) {
  const { data, error } = await (supabaseServer
    .from('transactions') as any)
    .update(updates)
    .eq('stripe_payment_intent_id', paymentIntentId)
    .select('id, listing_id, buyer_email, buyer_name, dealer_id')
    .single();

  if (error) {
    console.error('[Webhook] Failed to update transaction:', error);
    throw new Error(`Database error: ${error.message}`);
  }

  if (!data) {
    throw new Error(`Transaction not found for payment intent: ${paymentIntentId}`);
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
    console.error('[Webhook] Failed to update listing:', error);
    throw new Error(`Failed to update listing status: ${error.message}`);
  }
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
    console.warn('[Webhook] Error fetching dealer email:', err);
    return null;
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
 * Send email notification (placeholder)
 */
async function sendEmailNotification(params: {
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

  // TODO: Implement with Resend or your email service
  // import { Resend } from 'resend';
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({
  //   from: 'SK AutoSphere <notifications@skautosphere.com>',
  //   to: params.to,
  //   subject: params.subject,
  //   html: generateEmailTemplate(params.type, params.data),
  // });
}

// =====================================================
// EVENT HANDLERS
// =====================================================

/**
 * Handle payment_intent.succeeded event
 * 
 * This function processes a successful payment by:
 * 1. Updating the transaction status to 'succeeded'
 * 2. Marking the listing as 'sold'
 * 3. Creating an audit log entry
 * 4. Sending confirmation email to buyer
 * 5. Sending notification email to dealer
 * 
 * @param event - Stripe payment_intent.succeeded event
 * @returns Result containing transaction and email details
 * 
 * @throws Error if any database operation fails
 * 
 * @example
 * ```ts
 * if (event.type === 'payment_intent.succeeded') {
 *   const result = await handlePaymentSucceeded(event);
 *   console.log('Payment processed:', result.transactionId);
 * }
 * ```
 */
export async function handlePaymentSucceeded(
  event: Stripe.Event
): Promise<PaymentSuccessResult> {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;

  console.log('[Webhook] Processing payment success:', paymentIntent.id);

  try {
    // 1. Update transaction to succeeded
    const transaction = await updateTransaction(paymentIntent.id, {
      status: 'succeeded',
      completed_at: new Date().toISOString(),
      stripe_payment_method: paymentIntent.payment_method as string | undefined,
      metadata: {
        stripe_charge_id: paymentIntent.latest_charge,
        payment_method: paymentIntent.payment_method,
        completed_at: new Date().toISOString(),
        amount_received: paymentIntent.amount_received,
      },
    });

    console.log('[Webhook] Transaction updated:', transaction.id);

    // 2. Mark listing as sold
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

    // 4. Send buyer confirmation email
    await sendEmailNotification({
      to: transaction.buyer_email,
      subject: 'Payment Confirmed - Your Vehicle Purchase',
      type: 'payment_success',
      data: {
        buyer_name: transaction.buyer_name,
        transaction_id: transaction.id,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency.toUpperCase(),
        payment_intent_id: paymentIntent.id,
      },
    });

    // 5. Send dealer notification email
    let dealerEmail: string | null = null;
    if (transaction.dealer_id) {
      dealerEmail = await getDealerEmail(transaction.dealer_id);
      if (dealerEmail) {
        await sendEmailNotification({
          to: dealerEmail,
          subject: 'New Vehicle Sale - Payment Received',
          type: 'dealer_notification',
          data: {
            transaction_id: transaction.id,
            listing_id: transaction.listing_id,
            amount: paymentIntent.amount / 100,
            currency: paymentIntent.currency.toUpperCase(),
            buyer_email: transaction.buyer_email,
          },
        });
      }
    }

    console.log('[Webhook] Payment success processing complete');

    return {
      transactionId: transaction.id,
      listingId: transaction.listing_id,
      buyerEmail: transaction.buyer_email,
      dealerEmail,
    };
  } catch (error) {
    console.error('[Webhook] Error processing payment success:', error);
    throw error;
  }
}

/**
 * Handle payment_intent.payment_failed event
 * 
 * This function processes a failed payment by:
 * 1. Updating the transaction status to 'failed'
 * 2. Storing error details in metadata
 * 3. Creating an audit log entry
 * 4. Sending failure notification to buyer
 * 
 * @param event - Stripe payment_intent.payment_failed event
 * @returns Result containing transaction and error details
 * 
 * @throws Error if database operation fails
 * 
 * @example
 * ```ts
 * if (event.type === 'payment_intent.payment_failed') {
 *   const result = await handlePaymentFailed(event);
 *   console.log('Payment failed:', result.errorMessage);
 * }
 * ```
 */
export async function handlePaymentFailed(
  event: Stripe.Event
): Promise<PaymentFailureResult> {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;

  console.log('[Webhook] Processing payment failure:', paymentIntent.id);

  try {
    const errorCode = paymentIntent.last_payment_error?.code || null;
    const errorMessage = paymentIntent.last_payment_error?.message || null;

    // 1. Update transaction to failed with error details
    const transaction = await updateTransaction(paymentIntent.id, {
      status: 'failed',
      metadata: {
        error_code: errorCode,
        error_message: errorMessage,
        error_type: paymentIntent.last_payment_error?.type,
        decline_code: paymentIntent.last_payment_error?.decline_code,
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
        error_code: errorCode,
        error_message: errorMessage,
        error_type: paymentIntent.last_payment_error?.type,
      }
    );

    // 3. Send failure notification to buyer
    await sendEmailNotification({
      to: transaction.buyer_email,
      subject: 'Payment Failed - Action Required',
      type: 'payment_failed',
      data: {
        buyer_name: transaction.buyer_name,
        transaction_id: transaction.id,
        error_message: errorMessage || 'Your payment could not be processed',
        error_code: errorCode,
      },
    });

    console.log('[Webhook] Payment failure processing complete');

    return {
      transactionId: transaction.id,
      errorCode,
      errorMessage,
    };
  } catch (error) {
    console.error('[Webhook] Error processing payment failure:', error);
    throw error;
  }
}

/**
 * Handle charge.refunded event
 * 
 * This function processes a refund by:
 * 1. Updating the transaction status to 'refunded'
 * 2. Storing refund details in metadata
 * 3. Reactivating the listing (make it available again)
 * 4. Creating an audit log entry
 * 5. Sending refund confirmation to buyer
 * 
 * @param event - Stripe charge.refunded event
 * @returns Result containing transaction and refund details
 * 
 * @throws Error if database operation fails
 * 
 * @example
 * ```ts
 * if (event.type === 'charge.refunded') {
 *   const result = await handleRefund(event);
 *   console.log('Refund processed:', result.refundAmount);
 * }
 * ```
 */
export async function handleRefund(
  event: Stripe.Event
): Promise<RefundResult> {
  const charge = event.data.object as Stripe.Charge;

  console.log('[Webhook] Processing refund for charge:', charge.id);

  try {
    // Extract payment intent ID
    const paymentIntentId = typeof charge.payment_intent === 'string'
      ? charge.payment_intent
      : charge.payment_intent?.id;

    if (!paymentIntentId) {
      throw new Error('No payment intent ID found for charge');
    }

    const refundDetails = charge.refunds?.data[0];

    // 1. Update transaction to refunded
    const transaction = await updateTransaction(paymentIntentId, {
      status: 'refunded',
      metadata: {
        refund_id: refundDetails?.id,
        refund_amount: charge.amount_refunded,
        refund_reason: refundDetails?.reason,
        refund_status: refundDetails?.status,
        refunded_at: new Date().toISOString(),
        original_charge_id: charge.id,
      },
    });

    console.log('[Webhook] Transaction marked as refunded:', transaction.id);

    // 2. Reactivate listing (make it available for purchase again)
    await updateListingStatus(transaction.listing_id, 'active');
    console.log('[Webhook] Listing reactivated:', transaction.listing_id);

    // 3. Create audit log
    await createAuditLog(
      'charge_refunded',
      'transaction',
      transaction.id,
      {
        charge_id: charge.id,
        refund_id: refundDetails?.id,
        refund_amount: charge.amount_refunded,
        refund_reason: refundDetails?.reason,
      }
    );

    // 4. Send refund confirmation email
    await sendEmailNotification({
      to: transaction.buyer_email,
      subject: 'Refund Processed - SK AutoSphere',
      type: 'refund_processed',
      data: {
        buyer_name: transaction.buyer_name,
        transaction_id: transaction.id,
        refund_amount: charge.amount_refunded / 100,
        currency: charge.currency.toUpperCase(),
        refund_reason: refundDetails?.reason || 'Refund processed',
      },
    });

    console.log('[Webhook] Refund processing complete');

    return {
      transactionId: transaction.id,
      listingId: transaction.listing_id,
      refundAmount: charge.amount_refunded,
    };
  } catch (error) {
    console.error('[Webhook] Error processing refund:', error);
    throw error;
  }
}

// =====================================================
// ADDITIONAL HELPER FUNCTIONS
// =====================================================

/**
 * Extract payment intent from event
 * 
 * Safely extracts PaymentIntent from various event types
 */
export function extractPaymentIntent(event: Stripe.Event): Stripe.PaymentIntent | null {
  if (
    event.type === 'payment_intent.succeeded' ||
    event.type === 'payment_intent.payment_failed' ||
    event.type === 'payment_intent.canceled'
  ) {
    return event.data.object as Stripe.PaymentIntent;
  }
  return null;
}

/**
 * Extract charge from event
 * 
 * Safely extracts Charge from charge.* events
 */
export function extractCharge(event: Stripe.Event): Stripe.Charge | null {
  if (event.type.startsWith('charge.')) {
    return event.data.object as Stripe.Charge;
  }
  return null;
}

/**
 * Check if event type is supported
 */
export function isSupportedEventType(eventType: string): boolean {
  const supportedEvents = [
    'payment_intent.succeeded',
    'payment_intent.payment_failed',
    'payment_intent.canceled',
    'charge.refunded',
  ];
  return supportedEvents.includes(eventType);
}

/**
 * Get event handler for event type
 */
export function getEventHandler(eventType: string): ((event: Stripe.Event) => Promise<any>) | null {
  switch (eventType) {
    case 'payment_intent.succeeded':
      return handlePaymentSucceeded;
    case 'payment_intent.payment_failed':
      return handlePaymentFailed;
    case 'charge.refunded':
      return handleRefund;
    default:
      return null;
  }
}
