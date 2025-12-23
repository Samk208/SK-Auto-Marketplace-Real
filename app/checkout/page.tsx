"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { OrderSummary } from "@/components/checkout/order-summary"
import { PaymentForm } from "@/components/checkout/payment-form"
import { PaymentResult } from "@/components/checkout/payment-result"
import { getCheckoutItemById, MOCK_CHECKOUT_ITEMS } from "@/lib/mock-checkout-data"

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const listingId = searchParams.get("listing")

  const [paymentStatus, setPaymentStatus] = useState<"pending" | "success" | "error">("pending")
  const [receiptNumber, setReceiptNumber] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")

  // Get checkout item from URL or use first mock item
  const checkoutItem = listingId ? (getCheckoutItemById(listingId) ?? MOCK_CHECKOUT_ITEMS[0]) : MOCK_CHECKOUT_ITEMS[0]

  const reservationFee = 500

  const handlePaymentSuccess = (receipt: string) => {
    setReceiptNumber(receipt)
    setPaymentStatus("success")
  }

  const handlePaymentError = (message: string) => {
    setErrorMessage(message)
    setPaymentStatus("error")
  }

  const handleRetry = () => {
    setPaymentStatus("pending")
    setErrorMessage("")
    setReceiptNumber("")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/shop">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Checkout</h1>
              <p className="text-sm text-muted-foreground">Secure your vehicle reservation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-6xl">
          {paymentStatus === "pending" ? (
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Left Column - Payment Form */}
              <div className="order-2 lg:order-1">
                <PaymentForm
                  amount={reservationFee}
                  currency={checkoutItem.currency}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </div>

              {/* Right Column - Order Summary */}
              <div className="order-1 lg:order-2">
                <OrderSummary item={checkoutItem} reservationFee={reservationFee} />
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-2xl">
              <PaymentResult
                success={paymentStatus === "success"}
                message={
                  paymentStatus === "success"
                    ? "Your reservation is confirmed! The dealer will contact you within 24 hours."
                    : errorMessage
                }
                receiptNumber={receiptNumber}
                listingId={checkoutItem.listingId}
                onRetry={paymentStatus === "error" ? handleRetry : undefined}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
