/**
 * Checkout Error Page
 * 
 * Displayed when payment fails due to an error.
 * Provides troubleshooting steps and support options.
 */

'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CreditCard, Home, Mail, RefreshCcw, Shield, Wifi, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function CheckoutErrorPage() {
  const searchParams = useSearchParams();
  const listingId = searchParams.get('listing_id');
  const errorCode = searchParams.get('error_code');
  const errorMessage = searchParams.get('error_message');

  // Parse error message
  const getErrorDetails = () => {
    if (errorCode === 'card_declined') {
      return {
        title: 'Card Declined',
        description: 'Your card was declined by your bank.',
        icon: CreditCard,
      };
    } else if (errorCode === 'insufficient_funds') {
      return {
        title: 'Insufficient Funds',
        description: 'Your card does not have sufficient funds.',
        icon: CreditCard,
      };
    } else if (errorCode === 'expired_card') {
      return {
        title: 'Card Expired',
        description: 'The card you entered has expired.',
        icon: CreditCard,
      };
    } else if (errorCode === 'network_error') {
      return {
        title: 'Network Error',
        description: 'Unable to connect to payment processor.',
        icon: Wifi,
      };
    } else {
      return {
        title: 'Payment Failed',
        description: errorMessage || 'An unexpected error occurred during payment processing.',
        icon: XCircle,
      };
    }
  };

  const error = getErrorDetails();
  const ErrorIcon = error.icon;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        {/* Main Error Card */}
        <Card>
          <CardHeader>
            <div className="mx-auto w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4">
              <ErrorIcon className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-center text-2xl">{error.title}</CardTitle>
            <CardDescription className="text-center text-base">
              {error.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Error Alert */}
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>What happened?</AlertTitle>
              <AlertDescription>
                Your payment could not be processed. Don't worry — you haven't been charged.
              </AlertDescription>
            </Alert>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Try Again */}
              {listingId && (
                <Button className="w-full" size="lg" asChild>
                  <Link href={`/checkout/${listingId}`}>
                    <RefreshCcw className="mr-2 h-5 w-5" />
                    Try Again with Different Payment Method
                  </Link>
                </Button>
              )}

              {/* Contact Support */}
              <Button variant="outline" className="w-full" size="lg" asChild>
                <Link href="/support">
                  <Mail className="mr-2 h-5 w-5" />
                  Contact Support
                </Link>
              </Button>

              {/* Go Home */}
              <Button variant="ghost" className="w-full" asChild>
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Homepage
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Troubleshooting Guide */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Troubleshooting Steps
            </CardTitle>
            <CardDescription>
              Try these common solutions to resolve payment issues
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {/* Card Issues */}
              <AccordionItem value="card">
                <AccordionTrigger>Check Your Card Details</AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Verify the card number is entered correctly</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Check the expiration date hasn't passed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Confirm the CVC/CVV code is correct</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Ensure billing address matches your card records</span>
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              {/* Bank Issues */}
              <AccordionItem value="bank">
                <AccordionTrigger>Contact Your Bank</AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Your bank may have declined the transaction. Common reasons:
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Insufficient funds in your account</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Daily transaction limit reached</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Card flagged for unusual activity</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>International transactions blocked</span>
                    </li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-2">
                    Call the number on the back of your card to resolve these issues.
                  </p>
                </AccordionContent>
              </AccordionItem>

              {/* Alternative Payment */}
              <AccordionItem value="alternative">
                <AccordionTrigger>Try a Different Payment Method</AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    If one card doesn't work, try:
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>A different credit or debit card</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Using a different browser or device</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Waiting a few minutes and trying again</span>
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              {/* Technical Issues */}
              <AccordionItem value="technical">
                <AccordionTrigger>Technical Issues</AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    If you're experiencing technical problems:
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Check your internet connection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Clear your browser cache and cookies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Disable browser extensions temporarily</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Try using incognito/private mode</span>
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Support Card */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6 space-y-3">
            <h3 className="font-semibold text-center">Still Having Issues?</h3>
            <p className="text-sm text-center text-muted-foreground">
              Our support team is here to help you complete your purchase.
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" asChild>
                <Link href="/support">
                  <Mail className="mr-2 h-4 w-4" />
                  Email Support
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <a href="tel:+1234567890">
                  📞 Call Us
                </a>
              </Button>
            </div>
            <p className="text-xs text-center text-muted-foreground">
              Monday - Friday: 9:00 AM - 6:00 PM EST
            </p>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertTitle>Your Security Matters</AlertTitle>
          <AlertDescription>
            All payment information is encrypted and secure. We never store your full card details on our servers.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
