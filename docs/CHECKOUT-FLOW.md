# Checkout Flow Documentation

## Overview

The SK AutoSphere marketplace now has a complete mock checkout system that mimics real payment flows like Stripe.

## User Journey

### 1. Browse & Select Vehicle

- Navigate to `/shop` to browse all available vehicles
- Each listing card displays:
  - Vehicle details (make, model, year, mileage)
  - Dealer information with ratings
  - Destination ports for shipping
  - Price and specifications
  - **Buy Now** button (primary action)
  - Contact and View Details buttons (secondary actions)

### 2. Initiate Checkout

When a user clicks "Buy Now" on any listing card:

- User is redirected to `/checkout?listing={listingId}`
- The checkout page loads with the selected vehicle information

### 3. Checkout Page (`/checkout`)

The checkout page consists of two main sections:

#### Left Column - Payment Form

- Card details input (number, expiry, CVC)
- Cardholder name
- Billing address form (country, street, city, postal code)
- Data saver mode toggle
- Secure payment button

#### Right Column - Order Summary

- Vehicle thumbnail and details
- Dealer information
- Export route/destination port
- Price breakdown:
  - Vehicle price
  - Shipping estimate
  - Pre-shipment inspection fee
  - Total amount
- Reservation fee notice ($500 to hold vehicle for 24 hours)

### 4. Payment Processing (Mock)

The payment form includes demo mode logic:

- **Test card number**: `4242 4242 4242 4242`
- **CVC codes**:
  - `000` = Guaranteed success
  - `999` = Guaranteed failure
  - Any other = Random result (70% success rate)
- Processing animation (2 second delay to simulate real payment)

### 5. Payment Result

After processing:

#### Success State

- Confirmation message
- Unique receipt number (e.g., `REC-1234567890-ABC123`)
- Next steps information
- Buttons to:
  - View order details
  - Continue shopping
  - Contact dealer

#### Error State

- Error message explaining the failure
- Retry button to return to payment form
- Alternative payment options information

## File Structure

\`\`\`
app/
checkout/
page.tsx # Main checkout page
[listingId]/page.tsx # Dynamic route (redirects to main checkout)
loading.tsx # Loading skeleton

components/
checkout/
order-summary.tsx # Vehicle & price summary
payment-form.tsx # Card payment form
payment-result.tsx # Success/error states

lib/
mock-checkout-data.ts # Mock checkout items data
\`\`\`

## Key Features

### Security Indicators

- SSL encryption notice
- Lock icon on payment button
- Secure checkout header

### Mobile Optimization

- Responsive two-column layout (stacks on mobile)
- Data saver mode option
- Touch-friendly form inputs

### UX Enhancements

- Real-time card number formatting (spaces every 4 digits)
- Expiry date auto-formatting (MM/YY)
- CVC masking (password input)
- Processing state with loading animation
- Clear error messaging

### African Market Focus

- Country selector includes major African markets:
  - Ghana, Nigeria, Kenya, South Africa
  - Uganda, Tanzania, Ethiopia
- Destination port information prominent
- Export route clearly displayed

## Testing the Flow

1. **Navigate to shop**: Visit `/shop`
2. **Select a vehicle**: Click "Buy Now" on any listing card
3. **Fill payment form**: Use test card `4242 4242 4242 4242`
4. **Test success**: Enter CVC `000` and submit
5. **Test failure**: Enter CVC `999` and submit
6. **Test random**: Enter any other CVC for random result

## Integration Points

### Current (Mock)

- Mock vehicle data from `lib/mock-shop-data.ts`
- Mock checkout items from `lib/mock-checkout-data.ts`
- Client-side payment simulation

### Future (Real Integration)

To integrate with real payment processor (Stripe, Paystack, Flutterwave):

1. Replace mock payment logic in `payment-form.tsx`
2. Add API route for server-side payment processing
3. Implement webhook handlers for payment events
4. Add real order creation in database
5. Set up email notifications
6. Integrate with dealer dashboard

## Navigation Flow

\`\`\`
Homepage (/)
→ Browse Cars (Nav Menu)
→ Shop Page (/shop)
→ [Select Vehicle]
→ Buy Now Button
→ Checkout Page (/checkout?listing=ID)
→ [Payment Success]
→ Confirmation & Receipt
→ [Payment Error]
→ Retry or Contact Support
\`\`\`

## Notes

- All payments are currently mock/demo mode
- No real money is processed
- No database persistence (refresh loses state)
- Receipt numbers are randomly generated
- Dealer notifications are not yet implemented
