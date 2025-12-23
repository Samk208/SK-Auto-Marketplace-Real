/**
 * Checkout Cancel Page
 * 
 * Displayed when user cancels the payment process.
 * Provides friendly options to try again or explore other listings.
 */

'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, ArrowLeft, Home, Mail, RefreshCcw, Search } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function CheckoutCancelPage() {
  const searchParams = useSearchParams();
  const listingId = searchParams.get('listing_id');

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-6">
        {/* Main Card */}
        <Card>
          <CardHeader>
            <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center mb-4">
              <AlertCircle className="h-10 w-10 text-amber-600 dark:text-amber-400" />
            </div>
            <CardTitle className="text-center text-2xl">Payment Canceled</CardTitle>
            <CardDescription className="text-center text-base">
              No worries! Your payment wasn't processed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Reassurance Message */}
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                You can always come back to complete your purchase when you're ready.
              </p>
              <p className="text-sm text-muted-foreground">
                The vehicle is still available and waiting for you!
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Try Again */}
              {listingId && (
                <Button className="w-full" size="lg" asChild>
                  <Link href={`/checkout/${listingId}`}>
                    <RefreshCcw className="mr-2 h-5 w-5" />
                    Try Again
                  </Link>
                </Button>
              )}

              {/* View Listing */}
              {listingId && (
                <Button variant="outline" className="w-full" size="lg" asChild>
                  <Link href={`/listings/${listingId}`}>
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Back to Listing
                  </Link>
                </Button>
              )}

              {/* Browse Other Listings */}
              <Button variant="outline" className="w-full" size="lg" asChild>
                <Link href="/shop">
                  <Search className="mr-2 h-5 w-5" />
                  Browse Other Vehicles
                </Link>
              </Button>

              {/* Go Home */}
              <Button variant="ghost" className="w-full" asChild>
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Go to Homepage
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Help Card */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6 space-y-3">
            <h3 className="font-semibold text-sm text-center">Need Help?</h3>
            <p className="text-sm text-center text-muted-foreground">
              If you encountered an issue during checkout, we're here to assist.
            </p>
            <div className="flex justify-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/support">
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Support
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Common Reasons */}
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-sm">Common Reasons for Cancellation</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Wanted to review the details again</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Need to check with someone first</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Comparing with other options</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Accidentally started checkout</span>
              </li>
            </ul>
            <p className="mt-4 text-xs text-center text-muted-foreground">
              Whatever your reason, you're welcome back anytime!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
