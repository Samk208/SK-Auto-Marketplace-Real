/\*\*

- ============================================
- STRIPE INTEGRATION - QUICK REFERENCE
- ============================================
-
- All Stripe utilities for SK AutoSphere
  \*/

// ============================================
// SERVER-SIDE USAGE (API Routes, Server Components)
// ============================================

import {
stripe,
formatAmountForStripe,
formatAmountForDisplay,
createPaymentIntent,
retrievePaymentIntent,
constructWebhookEvent
} from '@/lib/stripe/server';

// Example 1: Create Payment Intent
const paymentIntent = await createPaymentIntent({
amount: 500, // $500 USD
currency: 'usd',
listingId: 'uuid-here',
buyerEmail: 'buyer@example.com',
metadata: {
vehicle_make: 'Toyota',
vehicle_model: 'Land Cruiser'
}
});
// Returns: { id, client_secret, amount, status, ... }

// Example 2: Format Amount for Stripe
const amountInCents = formatAmountForStripe(25.50, 'usd');
// Returns: 2550 (cents)

// Example 3: Format Amount for Display
const displayAmount = formatAmountForDisplay(2550, 'usd');
// Returns: "$25.50"

// Example 4: Direct Stripe SDK Usage
const charge = await stripe.charges.create({
amount: 2000,
currency: 'usd',
source: 'tok_visa',
});

// ============================================
// CLIENT-SIDE USAGE (React Components)
// ============================================

import {
getStripe,
isStripeLoaded,
createPaymentMethod,
confirmCardPayment
} from '@/lib/stripe/client';

// Example 1: Load Stripe.js
const stripe = await getStripe();

if (isStripeLoaded(stripe)) {
// Stripe is ready to use
const elements = stripe.elements();
}

// Example 2: Using with Stripe Elements
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

function CheckoutForm() {
const stripe = useStripe();
const elements = useElements();

const handleSubmit = async (event) => {
event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (!error) {
      // Send paymentMethod.id to your server
    }

};

return (

<form onSubmit={handleSubmit}>
<CardElement />
<button type="submit" disabled={!stripe}>
Pay Now
</button>
</form>
);
}

// Wrap with Elements provider
import { getStripe } from '@/lib/stripe/client';

const stripePromise = getStripe();

export default function Page() {
return (
<Elements stripe={stripePromise}>
<CheckoutForm />
</Elements>
);
}

// ============================================
// API ROUTE EXAMPLES
// ============================================

// app/api/stripe/create-payment-intent/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createPaymentIntent } from '@/lib/stripe/server';

export async function POST(request: NextRequest) {
const { listingId, amount, currency, buyerEmail } = await request.json();

try {
const paymentIntent = await createPaymentIntent({
amount,
currency,
listingId,
buyerEmail
});

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret
    });

} catch (error) {
return NextResponse.json(
{ error: error.message },
{ status: 500 }
);
}
}

// app/api/stripe/webhooks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { constructWebhookEvent } from '@/lib/stripe/server';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
const body = await request.text();
const signature = headers().get('stripe-signature')!;

try {
const event = constructWebhookEvent(body, signature);

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        // Handle successful payment
        break;

      case 'payment_intent.payment_failed':
        // Handle failed payment
        break;
    }

    return NextResponse.json({ received: true });

} catch (error) {
return NextResponse.json(
{ error: 'Webhook verification failed' },
{ status: 400 }
);
}
}

// ============================================
// ENVIRONMENT VARIABLES REQUIRED
// ============================================

/\*
Add to .env.local:

STRIPE*SECRET_KEY=sk_test*...
NEXT*PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test*...
STRIPE*WEBHOOK_SECRET=whsec*...

Get test keys from: https://dashboard.stripe.com/test/apikeys
\*/

// ============================================
// TEST CARD NUMBERS
// ============================================

/\*
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
Insufficient Funds: 4000 0000 0000 9995
3D Secure Required: 4000 0027 6000 3184

Any future date for expiry
Any 3-digit CVC
Any postal code
\*/

// ============================================
// COMMON PATTERNS
// ============================================

// Pattern 1: Complete Checkout Flow
async function completeCheckout(listingId: string, amount: number) {
// 1. Create Payment Intent (server-side)
const response = await fetch('/api/stripe/create-payment-intent', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ listingId, amount, currency: 'usd' })
});

const { clientSecret } = await response.json();

// 2. Confirm payment (client-side)
const stripe = await getStripe();

if (isStripeLoaded(stripe)) {
const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
payment_method: {
card: cardElement,
billing_details: { name: 'John Doe' }
}
});

    if (paymentIntent?.status === 'succeeded') {
      // Payment successful!
      // Redirect to success page or show confirmation
    }

}
}

// Pattern 2: Server-side Payment Confirmation
import { retrievePaymentIntent } from '@/lib/stripe/server';

async function checkPaymentStatus(paymentIntentId: string) {
const paymentIntent = await retrievePaymentIntent(paymentIntentId);

if (paymentIntent.status === 'succeeded') {
// Save to database
await supabase.from('transactions').insert({
stripe_payment_intent_id: paymentIntent.id,
amount: paymentIntent.amount / 100,
status: 'succeeded',
// ... other fields
});
}

return paymentIntent.status;
}

// ============================================
// TYPESCRIPT TYPES
// ============================================

import type { Stripe } from 'stripe';
import type {
Stripe as StripeClient,
StripeElements,
StripeCardElement,
PaymentIntent,
PaymentMethod
} from '@/lib/stripe/client';

// All functions are fully typed
// TypeScript will provide autocomplete and type checking
