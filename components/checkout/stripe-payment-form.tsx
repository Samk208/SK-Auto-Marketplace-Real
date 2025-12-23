/**
 * Stripe Payment Form Component
 * 
 * Handles payment collection with Stripe Elements,
 * buyer information form, and payment submission.
 */

'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Loader2, Lock, Mail, MapPin, Phone, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CheckoutListing } from './stripe-checkout-client';

// =====================================================
// VALIDATION SCHEMA
// =====================================================

const buyerInfoSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().optional(),
  country: z.string().min(1, 'Please select your country'),
  // Shipping address (optional)
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
});

type BuyerInfoFormData = z.infer<typeof buyerInfoSchema>;

// =====================================================
// TYPES
// =====================================================

interface StripePaymentFormProps {
  listing: CheckoutListing;
  paymentIntentId: string;
}

// =====================================================
// COUNTRIES LIST
// =====================================================

const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'GH', name: 'Ghana' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'KE', name: 'Kenya' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'UG', name: 'Uganda' },
  { code: 'TZ', name: 'Tanzania' },
  { code: 'ET', name: 'Ethiopia' },
  { code: 'RW', name: 'Rwanda' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'JP', name: 'Japan' },
  { code: 'CN', name: 'China' },
  { code: 'IN', name: 'India' },
  { code: 'BR', name: 'Brazil' },
];

// =====================================================
// MAIN COMPONENT
// =====================================================

export function StripePaymentForm({ listing, paymentIntentId }: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showShippingAddress, setShowShippingAddress] = useState(false);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BuyerInfoFormData>({
    resolver: zodResolver(buyerInfoSchema),
    defaultValues: {
      email: '',
      fullName: '',
      phone: '',
      country: '',
      address: '',
      city: '',
      postalCode: '',
    },
  });

  const selectedCountry = watch('country');

  // =====================================================
  // PAYMENT SUBMISSION
  // =====================================================

  const onSubmit = async (formData: BuyerInfoFormData) => {
    if (!stripe || !elements) {
      setErrorMessage('Stripe has not loaded. Please refresh the page.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success?listing_id=${listing.id}&payment_intent=${paymentIntentId}`,
          receipt_email: formData.email,
          shipping: showShippingAddress
            ? {
                name: formData.fullName,
                phone: formData.phone || '',
                address: {
                  line1: formData.address || '',
                  city: formData.city || '',
                  postal_code: formData.postalCode || '',
                  country: formData.country,
                },
              }
            : undefined,
        },
        redirect: 'if_required', // Handle 3D Secure inline
      });

      if (error) {
        // Payment failed
        if (error.type === 'card_error' || error.type === 'validation_error') {
          setErrorMessage(error.message || 'Payment failed. Please try again.');
        } else {
          setErrorMessage('An unexpected error occurred. Please try again.');
        }
        console.error('[Payment] Error:', error);
      } else if (paymentIntent) {
        // Payment succeeded
        if (paymentIntent.status === 'succeeded') {
          // Redirect to success page
          router.push(
            `/checkout/success?listing_id=${listing.id}&payment_intent=${paymentIntent.id}`
          );
        } else if (paymentIntent.status === 'requires_action') {
          // 3D Secure or additional authentication needed
          setErrorMessage('Additional authentication required. Please follow the prompts.');
        } else {
          setErrorMessage('Payment processing. Please wait...');
        }
      }
    } catch (err) {
      console.error('[Payment] Unexpected error:', err);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Buyer Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Contact Information
          </CardTitle>
          <CardDescription>We'll send your receipt and updates to this email</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              {...register('email')}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="John Doe"
              {...register('fullName')}
              className={errors.fullName ? 'border-red-500' : ''}
            />
            {errors.fullName && (
              <p className="text-sm text-red-500">{errors.fullName.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone Number (Optional)
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              {...register('phone')}
            />
          </div>

          {/* Country */}
          <div className="space-y-2">
            <Label htmlFor="country" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Country *
            </Label>
            <Select
              value={selectedCountry}
              onValueChange={(value) => setValue('country', value)}
            >
              <SelectTrigger
                id="country"
                className={errors.country ? 'border-red-500' : ''}
              >
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.country && (
              <p className="text-sm text-red-500">{errors.country.message}</p>
            )}
          </div>

          {/* Shipping Address Toggle */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="showShipping"
              checked={showShippingAddress}
              onChange={(e) => setShowShippingAddress(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="showShipping" className="cursor-pointer text-sm font-normal">
              Add shipping address (for delivery tracking)
            </Label>
          </div>

          {/* Shipping Address Fields */}
          {showShippingAddress && (
            <div className="space-y-4 rounded-lg border p-4 bg-muted/50">
              <h4 className="font-medium text-sm">Shipping Address</h4>

              {/* Street Address */}
              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="123 Main Street"
                  {...register('address')}
                />
              </div>

              {/* City and Postal Code */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    type="text"
                    placeholder="New York"
                    {...register('city')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    type="text"
                    placeholder="10001"
                    {...register('postalCode')}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Details Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Payment Details
          </CardTitle>
          <CardDescription>Your payment is secured with 256-bit encryption</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Stripe Payment Element */}
          <PaymentElement
            options={{
              layout: 'tabs',
              terms: {
                card: 'auto',
              },
            }}
          />

          {/* Error Message */}
          {errorMessage && (
            <Alert variant="destructive">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={!stripe || isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <Lock className="mr-2 h-5 w-5" />
                Pay {listing.currency} {listing.price.toLocaleString()}
              </>
            )}
          </Button>

          {/* Security Notice */}
          <div className="text-center text-xs text-muted-foreground space-y-1">
            <p>🔒 Your payment information is encrypted and secure</p>
            <p>Powered by Stripe • PCI DSS Level 1 Certified</p>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
