'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Loader2, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm({ escrowId, amount, currency }: { escrowId: string, amount: number, currency: string }) {
    const stripe = useStripe();
    const elements = useElements();
    const { toast } = useToast();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Return URL where the user is redirected after the payment attempt
                return_url: `${window.location.origin}/orders/${escrowId}`,
            },
        });

        if (error) {
            setErrorMessage(error.message ?? "An unexpected error occurred.");
            setIsLoading(false);
        } else {
            // This point will only be reached if there is an immediate error when
            // confirming the payment. Otherwise, your customer will be redirected to
            // your `return_url`.
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement />

            {errorMessage && (
                <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
                    {errorMessage}
                </div>
            )}

            <Button
                type="submit"
                disabled={!stripe || isLoading}
                className="w-full text-lg h-12"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Starting Secure Payment...
                    </>
                ) : (
                    <>
                        <Lock className="mr-2 h-4 w-4" />
                        Pay {new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(amount)}
                    </>
                )}
            </Button>

            <p className="text-xs text-center text-slate-500">
                Your payment is held securely in escrow until the vehicle is shipped.
                processed by <strong>Stripe</strong>.
            </p>
        </form>
    );
}

interface EscrowCheckoutProps {
    listingId: string;
    dealerId: string;
    amount: number;
    currency: string;
    listingTitle: string;
}

export function EscrowCheckout({ listingId, dealerId, amount, currency, listingTitle }: EscrowCheckoutProps) {
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [escrowId, setEscrowId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Create PaymentIntent as soon as the page loads
        fetch("/api/escrow/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ listingId, dealerId, amount, currency }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    setError(data.error);
                } else {
                    setClientSecret(data.clientSecret);
                    setEscrowId(data.escrowId);
                }
            })
            .catch((err) => setError("Failed to initialize payment"));
    }, [listingId, dealerId, amount, currency]);

    if (error) {
        return (
            <div className="p-4 bg-red-50 text-red-600 rounded-md">
                Error initializing checkout: {error}
            </div>
        )
    }

    if (!clientSecret || !escrowId) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
        )
    }

    const options: StripeElementsOptions = {
        clientSecret,
        appearance: {
            theme: 'stripe',
        },
    };

    return (
        <Card className="w-full max-w-lg mx-auto shadow-lg border-blue-100 dark:border-blue-900/50">
            <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b pb-6">
                <CardTitle>Secure Checkout</CardTitle>
                <CardDescription>Complete your purchase for {listingTitle}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
                <Elements options={options} stripe={stripePromise}>
                    <CheckoutForm escrowId={escrowId} amount={amount} currency={currency} />
                </Elements>
            </CardContent>
        </Card>
    );
}
