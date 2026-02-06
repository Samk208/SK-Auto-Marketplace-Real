# Stripe Webhook Helpers - Usage Guide

## Overview

The `lib/stripe/webhook-helpers.ts` module provides reusable, type-safe functions for processing Stripe webhook events. This separates business logic from the API route handler for better maintainability and testability.

---

## 📁 Module Structure

```typescript
lib/stripe/webhook-helpers.ts

├── Core Functions
│   ├── getRawBody()              // Read request body for signature verification
│   ├── verifyWebhookSignature()  // Verify Stripe signature (SECURITY)
│   └── Event Handlers
│       ├── handlePaymentSucceeded()
│       ├── handlePaymentFailed()
│       └── handleRefund()
│
├── Helper Functions
│   ├── extractPaymentIntent()
│   ├── extractCharge()
│   ├── isSupportedEventType()
│   └── getEventHandler()
│
└── Internal Functions (not exported)
    ├── updateTransaction()
    ├── updateListingStatus()
    ├── getDealerEmail()
    ├── createAuditLog()
    └── sendEmailNotification()
```

---

## 🚀 Basic Usage

### 1. In Your Webhook Route

```typescript
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import {
  getRawBody,
  verifyWebhookSignature,
  handlePaymentSucceeded,
  handlePaymentFailed,
  handleRefund,
} from "@/lib/stripe/webhook-helpers";

export async function POST(request: NextRequest) {
  try {
    // 1. Get signature and raw body
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const rawBody = await getRawBody(request);

    // 2. Verify signature (CRITICAL SECURITY)
    const event = await verifyWebhookSignature(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );

    // 3. Process event
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentSucceeded(event);
        break;

      case "payment_intent.payment_failed":
        await handlePaymentFailed(event);
        break;

      case "charge.refunded":
        await handleRefund(event);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
```

---

## 📚 Function Reference

### `getRawBody()`

**Purpose:** Read raw request body as string for signature verification

**Signature:**

```typescript
async function getRawBody(request: Request): Promise<string>;
```

**Usage:**

```typescript
const rawBody = await getRawBody(request);
// Returns: "{\\"id\\":\\"evt_xxx\\",...}"
```

**Error Handling:**

```typescript
try {
  const rawBody = await getRawBody(request);
} catch (error) {
  // Handle: Request body is null/undefined
  console.error("Failed to read body:", error.message);
}
```

---

### `verifyWebhookSignature()`

**Purpose:** Verify Stripe webhook signature (CRITICAL SECURITY)

**Signature:**

```typescript
async function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string,
): Promise<Stripe.Event>;
```

**Usage:**

```typescript
const event = await verifyWebhookSignature(
  rawBody,
  "whsec_xxx",
  process.env.STRIPE_WEBHOOK_SECRET!,
);

console.log("Event type:", event.type);
console.log("Event ID:", event.id);
```

**Error Handling:**

```typescript
try {
  const event = await verifyWebhookSignature(rawBody, signature, secret);
  // Event verified ✅
} catch (error) {
  // Signature invalid - REJECT request
  return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
}
```

**Security Notes:**

- ✅ Always call this before processing any event
- ✅ Never skip signature verification
- ✅ Use environment variable for secret
- ❌ Never hardcode webhook secret

---

### `handlePaymentSucceeded()`

**Purpose:** Process successful payment events

**Signature:**

```typescript
async function handlePaymentSucceeded(
  event: Stripe.Event,
): Promise<PaymentSuccessResult>;
```

**Return Type:**

```typescript
interface PaymentSuccessResult {
  transactionId: string;
  listingId: string;
  buyerEmail: string;
  dealerEmail: string | null;
}
```

**Usage:**

```typescript
const result = await handlePaymentSucceeded(event);

console.log("Transaction ID:", result.transactionId);
console.log("Listing ID:", result.listingId);
console.log("Buyer:", result.buyerEmail);
console.log("Dealer:", result.dealerEmail);
```

**What It Does:**

1. ✅ Updates transaction status to `'succeeded'`
2. ✅ Sets `completed_at` timestamp
3. ✅ Marks listing as `'sold'`
4. ✅ Creates audit log entry
5. ✅ Sends buyer confirmation email
6. ✅ Sends dealer notification email

**Error Handling:**

```typescript
try {
  const result = await handlePaymentSucceeded(event);
} catch (error) {
  // Handle database errors, email failures, etc.
  console.error("Payment processing failed:", error.message);

  // Still return 200 to Stripe to acknowledge receipt
  return NextResponse.json({ received: true, error: error.message });
}
```

---

### `handlePaymentFailed()`

**Purpose:** Process failed payment events

**Signature:**

```typescript
async function handlePaymentFailed(
  event: Stripe.Event,
): Promise<PaymentFailureResult>;
```

**Return Type:**

```typescript
interface PaymentFailureResult {
  transactionId: string;
  errorCode: string | null;
  errorMessage: string | null;
}
```

**Usage:**

```typescript
const result = await handlePaymentFailed(event);

console.log("Transaction ID:", result.transactionId);
console.log("Error code:", result.errorCode);
console.log("Error message:", result.errorMessage);
```

**What It Does:**

1. ✅ Updates transaction status to `'failed'`
2. ✅ Stores error details in metadata:
   - Error code
   - Error message
   - Error type
   - Decline code
3. ✅ Creates audit log entry
4. ✅ Sends failure notification to buyer

---

### `handleRefund()`

**Purpose:** Process refund events

**Signature:**

```typescript
async function handleRefund(event: Stripe.Event): Promise<RefundResult>;
```

**Return Type:**

```typescript
interface RefundResult {
  transactionId: string;
  listingId: string;
  refundAmount: number;
}
```

**Usage:**

```typescript
const result = await handleRefund(event);

console.log("Transaction ID:", result.transactionId);
console.log("Listing ID:", result.listingId);
console.log("Refund amount (cents):", result.refundAmount);
```

**What It Does:**

1. ✅ Updates transaction status to `'refunded'`
2. ✅ Stores refund details in metadata:
   - Refund ID
   - Refund amount
   - Refund reason
   - Refund status
3. ✅ **Reactivates listing** (sets status to `'active'`)
4. ✅ Creates audit log entry
5. ✅ Sends refund confirmation to buyer

---

## 🔧 Helper Functions

### `extractPaymentIntent()`

Extract PaymentIntent from event safely:

```typescript
const paymentIntent = extractPaymentIntent(event);

if (paymentIntent) {
  console.log("Amount:", paymentIntent.amount);
  console.log("Currency:", paymentIntent.currency);
}
```

### `extractCharge()`

Extract Charge from charge.\* events:

```typescript
const charge = extractCharge(event);

if (charge) {
  console.log("Charge ID:", charge.id);
  console.log("Refunded amount:", charge.amount_refunded);
}
```

### `isSupportedEventType()`

Check if event type is handled:

```typescript
if (isSupportedEventType(event.type)) {
  // Process event
} else {
  console.log("Unhandled event type:", event.type);
}
```

Supported events:

- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `payment_intent.canceled`
- `charge.refunded`

### `getEventHandler()`

Get handler function for event type:

```typescript
const handler = getEventHandler(event.type);

if (handler) {
  const result = await handler(event);
} else {
  console.log("No handler for:", event.type);
}
```

---

## 🧪 Testing Examples

### Test Successful Payment

```typescript
import { handlePaymentSucceeded } from "@/lib/stripe/webhook-helpers";

// Mock event from Stripe CLI or test
const mockEvent = {
  type: "payment_intent.succeeded",
  data: {
    object: {
      id: "pi_test_123",
      amount: 50000, // $500
      currency: "usd",
      payment_method: "pm_test_xxx",
      // ... other fields
    },
  },
};

const result = await handlePaymentSucceeded(mockEvent);

expect(result.transactionId).toBeDefined();
expect(result.listingId).toBeDefined();
```

### Test Error Handling

```typescript
try {
  await handlePaymentSucceeded(invalidEvent);
} catch (error) {
  expect(error.message).toContain("Transaction not found");
}
```

---

## 🔒 Security Best Practices

### 1. Always Verify Signatures

```typescript
// ✅ CORRECT
const event = await verifyWebhookSignature(rawBody, signature, secret);

// ❌ WRONG - Never skip verification
const event = JSON.parse(rawBody); // INSECURE!
```

### 2. Use Environment Variables

```typescript
// ✅ CORRECT
const secret = process.env.STRIPE_WEBHOOK_SECRET;

// ❌ WRONG - Never hardcode
const secret = "whsec_xxx"; // INSECURE!
```

### 3. Handle Errors Gracefully

```typescript
try {
  await handlePaymentSucceeded(event);
} catch (error) {
  // Log error but still return 200
  console.error("Processing error:", error);

  // Create audit log for manual review
  await createAuditLog("webhook_error", "event", event.id, { error });

  // Return 200 to Stripe (prevents retries)
  return NextResponse.json({ received: true, error: error.message });
}
```

---

## 📊 Database Updates

### Transaction Table Updates

| Event                           | Status      | Additional Fields                       |
| ------------------------------- | ----------- | --------------------------------------- |
| `payment_intent.succeeded`      | `succeeded` | `completed_at`, `stripe_payment_method` |
| `payment_intent.payment_failed` | `failed`    | `metadata.error_*`                      |
| `charge.refunded`               | `refunded`  | `metadata.refund_*`                     |

### Listing Table Updates

| Event                      | Status Change     |
| -------------------------- | ----------------- |
| `payment_intent.succeeded` | `active` → `sold` |
| `charge.refunded`          | `sold` → `active` |

---

## 📧 Email Notifications

### Current Implementation

Emails are logged to console (placeholder):

```typescript
[Webhook] Email notification: {
  to: 'buyer@example.com',
  subject: 'Payment Confirmed',
  type: 'payment_success'
}
```

### Implementing Real Emails

Update `sendEmailNotification()` function:

```typescript
import { Resend } from "resend";

async function sendEmailNotification(params) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: "SK AutoSphere <notifications@skautosphere.com>",
    to: params.to,
    subject: params.subject,
    html: generateEmailTemplate(params.type, params.data),
  });
}
```

---

## 🎯 Best Practices

1. **Always verify signatures** before processing
2. **Log all events** for audit trail
3. **Return 200** even on processing errors (prevents retry storms)
4. **Handle idempotency** to prevent duplicate processing
5. **Test locally** with Stripe CLI before production
6. **Monitor webhook** success rates in Stripe Dashboard
7. **Set up alerts** for processing failures

---

## 🔍 Debugging

### Enable Detailed Logging

Add to your webhook handler:

```typescript
console.log("[Webhook] Event received:", {
  type: event.type,
  id: event.id,
  created: new Date(event.created * 1000).toISOString(),
});
```

### Check Transaction Updates

```typescript
const result = await handlePaymentSucceeded(event);

// Verify in database
const { data } = await supabase
  .from("transactions")
  .select("*")
  .eq("id", result.transactionId)
  .single();

console.log("Transaction status:", data.status);
console.log("Completed at:", data.completed_at);
```

---

## 📚 Resources

- [lib/stripe/webhook-helpers.ts](../lib/stripe/webhook-helpers.ts) - Source code
- [app/api/stripe/webhooks/route.ts](../app/api/stripe/webhooks/route.ts) - Usage example
- [Stripe Webhooks Documentation](https://stripe.com/docs/webhooks)
- [Stripe Event Types](https://stripe.com/docs/api/events/types)
