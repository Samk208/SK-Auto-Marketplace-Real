/**
 * Stripe Client-Side Configuration
 * 
 * This module provides the Stripe.js client for frontend components.
 * Use this in client components for Payment Elements and card forms.
 * 
 * @requires NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable
 */

import { loadStripe, Stripe } from '@stripe/stripe-js';

// Validate that the publishable key is configured
if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  console.error(
    'Missing required environment variable: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY\n' +
    'Please add it to your .env.local file.\n' +
    'For testing, use a key from: https://dashboard.stripe.com/test/apikeys'
  );
}

/**
 * Cached Stripe.js instance
 * 
 * This ensures we only initialize Stripe once, even if the function
 * is called multiple times. This is important for performance.
 */
let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Load and return the Stripe.js instance
 * 
 * This function loads the Stripe.js library and returns a Promise that
 * resolves to the Stripe object. The library is loaded only once and
 * cached for subsequent calls.
 * 
 * @returns Promise that resolves to Stripe instance or null if key is missing
 * 
 * @example
 * ```tsx
 * import { getStripe } from '@/lib/stripe/client';
 * 
 * const stripe = await getStripe();
 * if (stripe) {
 *   // Use Stripe.js
 * }
 * ```
 */
export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    if (!publishableKey) {
      console.warn('Stripe publishable key not found. Stripe.js will not be initialized.');
      return Promise.resolve(null);
    }

    stripePromise = loadStripe(publishableKey, {
      // Optional: Specify locale for localized error messages
      locale: 'en',
    });
  }

  return stripePromise;
};

/**
 * Type guard to check if Stripe is loaded
 * 
 * @param stripe - Stripe instance or null
 * @returns True if Stripe is loaded and ready
 * 
 * @example
 * ```tsx
 * const stripe = await getStripe();
 * if (isStripeLoaded(stripe)) {
 *   // TypeScript knows stripe is not null here
 *   const paymentIntent = await stripe.createPaymentMethod(...);
 * }
 * ```
 */
export function isStripeLoaded(stripe: Stripe | null): stripe is Stripe {
  return stripe !== null;
}

/**
 * Create a payment method using card details
 * 
 * @param stripe - Stripe instance
 * @param cardElement - Stripe Card Element
 * @param billingDetails - Billing information
 * @returns Payment Method ID or error
 * 
 * @example
 * ```tsx
 * const { paymentMethod, error } = await createPaymentMethod(
 *   stripe,
 *   cardElement,
 *   {
 *     name: 'John Doe',
 *     email: 'john@example.com',
 *     address: {
 *       line1: '123 Main St',
 *       city: 'San Francisco',
 *       state: 'CA',
 *       postal_code: '94105',
 *       country: 'US',
 *     }
 *   }
 * );
 * ```
 */
export async function createPaymentMethod(
  stripe: Stripe,
  cardElement: any,
  billingDetails: {
    name: string;
    email?: string;
    phone?: string;
    address?: {
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      postal_code?: string;
      country?: string;
    };
  }
): Promise<{ paymentMethod?: any; error?: any }> {
  try {
    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: billingDetails,
    });

    if (error) {
      return { error };
    }

    return { paymentMethod };
  } catch (err) {
    return {
      error: {
        message: err instanceof Error ? err.message : 'An unexpected error occurred',
      },
    };
  }
}

/**
 * Confirm a card payment with a Payment Intent
 * 
 * @param stripe - Stripe instance
 * @param clientSecret - Payment Intent client secret
 * @param paymentMethodId - Payment Method ID
 * @returns Confirmation result
 */
export async function confirmCardPayment(
  stripe: Stripe,
  clientSecret: string,
  paymentMethodId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethodId,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    if (paymentIntent?.status === 'succeeded') {
      return { success: true };
    }

    return {
      success: false,
      error: 'Payment was not successful',
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'An unexpected error occurred',
    };
  }
}

// Re-export Stripe types for convenience
export type {
    PaymentIntent,
    PaymentMethod, Stripe, StripeCardElement, StripeElements
} from '@stripe/stripe-js';

