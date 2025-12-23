/**
 * Stripe Checkout Client Component
 * 
 * Main checkout page component that integrates Stripe Elements
 * and handles the payment flow.
 */

'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CheckoutOrderSummary } from './checkout-order-summary';
import { StripePaymentForm } from './stripe-payment-form';

// =====================================================
// TYPES
// =====================================================

export interface CheckoutListing {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  currency: string;
  images: string[];
  primary_image: string | null;
  dealer: {
    id: string;
    business_name: string;
    verified: boolean;
    rating: number;
    location: string | null;
  };
}

interface StripeCheckoutClientProps {
  listing: CheckoutListing;
}

// =====================================================
// STRIPE INITIALIZATION
// =====================================================

// Initialize Stripe (singleton pattern)
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

// =====================================================
// MAIN COMPONENT
// =====================================================

export function StripeCheckoutClient({ listing }: StripeCheckoutClientProps) {
  const [clientSecret, setClientSecret] = useState<string>('');
  const [paymentIntentId, setPaymentIntentId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Create Payment Intent on mount
  useEffect(() => {
    createPaymentIntent();
  }, [listing.id]);

  async function createPaymentIntent() {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listingId: listing.id,
          buyerInfo: {
            email: '', // Will be collected in form
            name: '',
            country: '',
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to initialize payment');
      }

      const data = await response.json();
      setClientSecret(data.clientSecret);
      setPaymentIntentId(data.paymentIntentId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('[Checkout] Failed to create payment intent:', err);
    } finally {
      setIsLoading(false);
    }
  }

  // Stripe Elements options
  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#0F172A',
        colorBackground: '#ffffff',
        colorText: '#1e293b',
        colorDanger: '#ef4444',
        fontFamily: 'system-ui, sans-serif',
        borderRadius: '8px',
      },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/listings/${listing.id}`}>
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Secure Checkout</h1>
              <p className="text-sm text-muted-foreground">
                Complete your purchase for {listing.brand} {listing.model}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-6xl">
          {/* Error State */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>
                {error}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={createPaymentIntent}
                  className="ml-4"
                >
                  Try Again
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">
                Initializing secure payment...
              </p>
            </div>
          )}

          {/* Payment Form */}
          {!isLoading && !error && clientSecret && (
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Left Column - Payment Form */}
              <div className="order-2 lg:order-1">
                <Elements stripe={stripePromise} options={options}>
                  <StripePaymentForm
                    listing={listing}
                    paymentIntentId={paymentIntentId}
                  />
                </Elements>
              </div>

              {/* Right Column - Order Summary */}
              <div className="order-1 lg:order-2">
                <CheckoutOrderSummary listing={listing} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
