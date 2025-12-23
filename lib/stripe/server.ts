/**
 * Stripe Server-Side Configuration
 * 
 * This module initializes the Stripe SDK for server-side operations.
 * Used in API routes, server components, and server actions.
 * 
 * @requires STRIPE_SECRET_KEY environment variable
 */

import Stripe from 'stripe';

// Validate that the Stripe secret key is configured
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    'Missing required environment variable: STRIPE_SECRET_KEY\n' +
    'Please add it to your .env.local file.\n' +
    'For testing, use a key from: https://dashboard.stripe.com/test/apikeys'
  );
}

/**
 * Stripe SDK instance configured with your secret key
 * 
 * @see https://stripe.com/docs/api
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  // Use the latest API version for all requests
  apiVersion: '2025-11-17.clover',
  
  // Enable TypeScript type definitions
  typescript: true,
  
  // Add app metadata for better tracking in Stripe Dashboard
  appInfo: {
    name: 'SK AutoSphere',
    version: '1.0.0',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://skautosphere.com',
  },
});

/**
 * Format amount for Stripe (convert to smallest currency unit)
 * 
 * Stripe expects amounts in the smallest currency unit (cents for USD).
 * This function handles the conversion and validates the input.
 * 
 * @param amount - The amount in standard units (e.g., 25.50 for $25.50)
 * @param currency - ISO currency code (e.g., 'usd', 'eur', 'jpy')
 * @returns Amount in smallest currency unit (e.g., 2550 cents for $25.50)
 * 
 * @example
 * formatAmountForStripe(25.50, 'usd') // Returns 2550
 * formatAmountForStripe(1000, 'jpy')  // Returns 1000 (JPY has no decimal)
 */
export function formatAmountForStripe(
  amount: number,
  currency: string
): number {
  // Validate amount is a positive number
  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error(`Invalid amount: ${amount}. Must be a positive number.`);
  }

  // Zero-decimal currencies (no cents/subunits)
  // See: https://stripe.com/docs/currencies#zero-decimal
  const zeroDecimalCurrencies = [
    'bif', 'clp', 'djf', 'gnf', 'jpy', 'kmf', 'krw',
    'mga', 'pyg', 'rwf', 'ugx', 'vnd', 'vuv', 'xaf',
    'xof', 'xpf'
  ];

  const normalizedCurrency = currency.toLowerCase();

  if (zeroDecimalCurrencies.includes(normalizedCurrency)) {
    // For zero-decimal currencies, return amount as-is
    return Math.round(amount);
  }

  // For standard currencies, multiply by 100 to get cents
  return Math.round(amount * 100);
}

/**
 * Format amount for display (convert from Stripe's smallest unit)
 * 
 * Converts Stripe's amount (in smallest unit) back to a human-readable
 * format with proper currency symbol and formatting.
 * 
 * @param amount - Amount in smallest currency unit (from Stripe)
 * @param currency - ISO currency code
 * @returns Formatted string with currency symbol (e.g., "$25.50")
 * 
 * @example
 * formatAmountForDisplay(2550, 'usd') // Returns "$25.50"
 * formatAmountForDisplay(1000, 'jpy') // Returns "¥1,000"
 */
export function formatAmountForDisplay(
  amount: number,
  currency: string
): string {
  // Validate amount
  if (!Number.isFinite(amount)) {
    throw new Error(`Invalid amount: ${amount}. Must be a number.`);
  }

  // Zero-decimal currencies
  const zeroDecimalCurrencies = [
    'bif', 'clp', 'djf', 'gnf', 'jpy', 'kmf', 'krw',
    'mga', 'pyg', 'rwf', 'ugx', 'vnd', 'vuv', 'xaf',
    'xof', 'xpf'
  ];

  const normalizedCurrency = currency.toLowerCase();
  
  // Calculate display amount based on currency type
  const displayAmount = zeroDecimalCurrencies.includes(normalizedCurrency)
    ? amount
    : amount / 100;

  // Use Intl.NumberFormat for locale-aware formatting
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: zeroDecimalCurrencies.includes(normalizedCurrency) ? 0 : 2,
  }).format(displayAmount);
}

/**
 * Create a Payment Intent for a vehicle listing
 * 
 * @param params - Payment intent parameters
 * @returns Stripe PaymentIntent object
 */
export async function createPaymentIntent(params: {
  amount: number;
  currency: string;
  listingId: string;
  buyerEmail?: string;
  metadata?: Record<string, string>;
}): Promise<Stripe.PaymentIntent> {
  const { amount, currency, listingId, buyerEmail, metadata = {} } = params;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: formatAmountForStripe(amount, currency),
      currency: currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true,
      },
      receipt_email: buyerEmail,
      metadata: {
        listing_id: listingId,
        ...metadata,
      },
    });

    return paymentIntent;
  } catch (error) {
    if (error instanceof Stripe.errors.StripeError) {
      throw new Error(`Stripe error: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Retrieve a Payment Intent by ID
 * 
 * @param paymentIntentId - Stripe Payment Intent ID
 * @returns Stripe PaymentIntent object
 */
export async function retrievePaymentIntent(
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> {
  try {
    return await stripe.paymentIntents.retrieve(paymentIntentId);
  } catch (error) {
    if (error instanceof Stripe.errors.StripeError) {
      throw new Error(`Stripe error: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Verify Stripe webhook signature
 * 
 * @param payload - Raw request body
 * @param signature - Stripe signature header
 * @returns Verified Stripe event
 */
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error('Missing STRIPE_WEBHOOK_SECRET environment variable');
  }

  try {
    return stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret
    );
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Webhook signature verification failed: ${error.message}`);
    }
    throw error;
  }
}
