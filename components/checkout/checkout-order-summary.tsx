/**
 * Checkout Order Summary Component
 * 
 * Displays listing details, price breakdown, and dealer information
 * in the checkout page sidebar.
 */

'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar, CheckCircle2, MapPin, Star } from 'lucide-react';
import Image from 'next/image';
import { CheckoutListing } from './stripe-checkout-client';

// =====================================================
// TYPES
// =====================================================

interface CheckoutOrderSummaryProps {
  listing: CheckoutListing;
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// =====================================================
// MAIN COMPONENT
// =====================================================

export function CheckoutOrderSummary({ listing }: CheckoutOrderSummaryProps) {
  // Calculate fees and totals
  const subtotal = listing.price;
  const platformFee = 0; // No platform fee for buyers
  const estimatedShipping = 0; // TBD - calculated later
  const total = subtotal + platformFee + estimatedShipping;

  // Get primary image or fallback
  const primaryImage = listing.primary_image || listing.images[0] || '/placeholder-car.jpg';

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Vehicle Image */}
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
          <Image
            src={primaryImage}
            alt={listing.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        </div>

        {/* Vehicle Details */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg line-clamp-2">{listing.title}</h3>
          
          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{listing.year}</span>
            </div>
            <span>•</span>
            <span>{listing.brand} {listing.model}</span>
          </div>

          {/* Dealer Info */}
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{listing.dealer.business_name}</span>
            {listing.dealer.verified && (
              <Badge variant="secondary" className="gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Verified
              </Badge>
            )}
          </div>

          {/* Dealer Rating */}
          {listing.dealer.rating > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{listing.dealer.rating.toFixed(1)}</span>
              </div>
              <span className="text-muted-foreground">Dealer Rating</span>
            </div>
          )}

          {listing.dealer.location && (
            <p className="text-sm text-muted-foreground">
              📍 {listing.dealer.location}
            </p>
          )}
        </div>

        <Separator />

        {/* Price Breakdown */}
        <div className="space-y-3">
          <h4 className="font-semibold">Price Breakdown</h4>
          
          {/* Subtotal */}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Vehicle Price</span>
            <span className="font-medium">
              {formatCurrency(subtotal, listing.currency)}
            </span>
          </div>

          {/* Platform Fee */}
          {platformFee > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Platform Fee</span>
              <span className="font-medium">
                {formatCurrency(platformFee, listing.currency)}
              </span>
            </div>
          )}

          {/* Shipping */}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span className="font-medium text-muted-foreground">
              {estimatedShipping > 0
                ? formatCurrency(estimatedShipping, listing.currency)
                : 'TBD'}
            </span>
          </div>

          {estimatedShipping === 0 && (
            <p className="text-xs text-muted-foreground">
              Shipping cost will be calculated after purchase based on your location
            </p>
          )}
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Total</span>
          <span className="text-2xl font-bold text-primary">
            {formatCurrency(total, listing.currency)}
          </span>
        </div>

        {/* Payment Security Notice */}
        <div className="rounded-lg bg-muted p-4 space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <span className="font-medium text-sm">Secure Payment</span>
          </div>
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li>✓ Encrypted payment processing</li>
            <li>✓ Buyer protection included</li>
            <li>✓ Instant receipt via email</li>
            <li>✓ 24/7 customer support</li>
          </ul>
        </div>

        {/* What Happens Next */}
        <div className="rounded-lg border p-4 space-y-2">
          <h5 className="font-medium text-sm">What happens next?</h5>
          <ol className="space-y-1 text-xs text-muted-foreground list-decimal list-inside">
            <li>Payment is securely processed</li>
            <li>Dealer is notified immediately</li>
            <li>You receive a confirmation email</li>
            <li>Dealer contacts you within 24 hours</li>
            <li>Arrange inspection & delivery details</li>
          </ol>
        </div>

        {/* Additional Info */}
        <p className="text-xs text-center text-muted-foreground">
          By completing this purchase, you agree to our Terms of Service and Privacy Policy
        </p>
      </CardContent>
    </Card>
  );
}
