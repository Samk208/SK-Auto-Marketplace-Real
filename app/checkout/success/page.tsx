/**
 * Checkout Success Page
 * 
 * Displayed after successful payment completion.
 * Fetches payment details and transaction information.
 */

'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, CheckCircle2, Download, Loader2, Mail, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// =====================================================
// TYPES
// =====================================================

interface PaymentDetails {
  success: boolean;
  transactionId: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
  listingId: string;
  listingTitle: string;
  buyerEmail: string;
  createdAt: string;
  receiptUrl?: string;
}

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const listingId = searchParams.get('listing_id');
  const paymentIntentId = searchParams.get('payment_intent');

  const [isLoading, setIsLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [error, setError] = useState('');

  // Fetch payment status on mount
  useEffect(() => {
    if (!listingId || !paymentIntentId) {
      setError('Missing payment information');
      setIsLoading(false);
      return;
    }

    fetchPaymentStatus();
  }, [listingId, paymentIntentId]);

  async function fetchPaymentStatus() {
    try {
      const response = await fetch(
        `/api/stripe/payment-status?payment_intent=${paymentIntentId}&listing_id=${listingId}`
      );

      if (!response.ok) {
        throw new Error('Failed to verify payment status');
      }

      const data = await response.json();
      setPaymentDetails(data);
    } catch (err) {
      console.error('[Success] Error fetching payment status:', err);
      setError('Failed to verify payment. Please contact support.');
    } finally {
      setIsLoading(false);
    }
  }

  // =====================================================
  // LOADING STATE
  // =====================================================

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR STATE
  // =====================================================

  if (error || !paymentDetails) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4">
              <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-center">Payment Verification Failed</CardTitle>
            <CardDescription className="text-center">
              {error || 'We could not verify your payment status'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                If you were charged, please contact our support team with your payment reference.
              </AlertDescription>
            </Alert>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" asChild>
                <Link href="/">Go Home</Link>
              </Button>
              <Button className="flex-1" asChild>
                <Link href="/support">Contact Support</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // =====================================================
  // SUCCESS STATE
  // =====================================================

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Success Header */}
          <Card>
            <CardHeader>
              <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-center text-2xl">Payment Successful!</CardTitle>
              <CardDescription className="text-center text-base">
                Thank you for your purchase. Your order has been confirmed.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Payment Details */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <span className="font-mono font-medium">{paymentDetails.transactionId}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Payment Intent</span>
                  <span className="font-mono text-xs">{paymentDetails.paymentIntentId}</span>
                </div>

                <Separator />

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Vehicle</span>
                  <span className="font-medium">{paymentDetails.listingTitle}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount Paid</span>
                  <span className="font-semibold text-lg">
                    {formatCurrency(paymentDetails.amount, paymentDetails.currency)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Date</span>
                  <span>{formatDate(paymentDetails.createdAt)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Receipt Email</span>
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {paymentDetails.buyerEmail}
                  </span>
                </div>
              </div>

              {paymentDetails.receiptUrl && (
                <>
                  <Separator />
                  <Button variant="outline" className="w-full" asChild>
                    <a href={paymentDetails.receiptUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="mr-2 h-4 w-4" />
                      Download Receipt
                    </a>
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle>What Happens Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium text-xs">
                    1
                  </span>
                  <div>
                    <p className="font-medium">Confirmation Email Sent</p>
                    <p className="text-muted-foreground">
                      Check your inbox at {paymentDetails.buyerEmail} for your receipt and order details.
                    </p>
                  </div>
                </li>

                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium text-xs">
                    2
                  </span>
                  <div>
                    <p className="font-medium">Dealer Notification</p>
                    <p className="text-muted-foreground">
                      The dealer has been notified and will contact you within 24 hours.
                    </p>
                  </div>
                </li>

                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium text-xs">
                    3
                  </span>
                  <div>
                    <p className="font-medium">Arrange Inspection & Delivery</p>
                    <p className="text-muted-foreground">
                      Work with the dealer to schedule a vehicle inspection and discuss delivery options.
                    </p>
                  </div>
                </li>
              </ol>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex-1" asChild>
              <Link href={`/shop/${paymentDetails.listingId}`}>
                View Listing
              </Link>
            </Button>
            <Button className="flex-1" asChild>
              <Link href="/shop">
                Continue Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Support Notice */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <p className="text-sm text-center text-muted-foreground">
                Need help? Contact our support team at{' '}
                <a href="mailto:support@example.com" className="text-primary hover:underline">
                  support@example.com
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
