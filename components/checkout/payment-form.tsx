"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CreditCard, Lock } from "lucide-react"
import { useState } from "react"

interface PaymentFormProps {
  amount: number
  currency: string
  onSuccess: (receiptNumber: string) => void
  onError: (message: string) => void
}

export function PaymentForm({ amount, currency, onSuccess, onError }: PaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [dataSaver, setDataSaver] = useState(false)
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiry: "",
    cvc: "",
    name: "",
    country: "",
    address: "",
    city: "",
    postalCode: "",
  })

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "")
    const groups = digits.match(/.{1,4}/g) || []
    return groups.join(" ").substring(0, 19)
  }

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "")
    if (digits.length >= 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`
    }
    return digits
  }

  const handleInputChange = (field: string, value: string) => {
    if (field === "cardNumber") {
      value = formatCardNumber(value)
    } else if (field === "expiry") {
      value = formatExpiry(value)
    } else if (field === "cvc") {
      value = value.replace(/\D/g, "").substring(0, 3)
    }
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock payment logic: CVC determines outcome
    // 000 = success, 999 = error, others = random
    const cvc = formData.cvc
    let shouldSucceed = Math.random() > 0.3

    if (cvc === "000") {
      shouldSucceed = true
    } else if (cvc === "999") {
      shouldSucceed = false
    }

    setIsProcessing(false)

    if (shouldSucceed) {
      const receiptNumber = `REC-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`
      onSuccess(receiptNumber)
    } else {
      onError("Card declined. Please try a different payment method.")
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Secure Payment
          </CardTitle>
          <CardDescription>Select your preferred payment method</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Demo Mode Notice */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm dark:border-blue-800 dark:bg-blue-950">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="font-medium text-blue-900 dark:text-blue-100">Demo Mode - No Real Payment Processed</p>
                <p className="mt-1 text-blue-700 dark:text-blue-300">
                  Test card: <code className="font-mono">4242 4242 4242 4242</code>
                  <br />
                  CVC <code className="font-mono">000</code> = Success, <code className="font-mono">999</code> = Error
                </p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="card" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="card">Card</TabsTrigger>
              <TabsTrigger value="mobile_money">Mobile Money</TabsTrigger>
              <TabsTrigger value="bank">Bank Transfer</TabsTrigger>
            </TabsList>

            <TabsContent value="card" className="space-y-4">
              {/* Card Details */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <div className="relative">
                    <Input
                      id="cardNumber"
                      placeholder="4242 4242 4242 4242"
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                      required={false} // Validation handled manually if tab active
                      maxLength={19}
                      className="pr-10"
                    />
                    <CreditCard className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={formData.expiry}
                      onChange={(e) => handleInputChange("expiry", e.target.value)}
                      required={false}
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvc">CVC</Label>
                    <Input
                      id="cvc"
                      placeholder="123"
                      value={formData.cvc}
                      onChange={(e) => handleInputChange("cvc", e.target.value)}
                      required={false}
                      maxLength={3}
                      type="password"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="name">Cardholder Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required={false}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="mobile_money" className="space-y-4">
              <div className="space-y-4">
                <p className="text-sm text-slate-600">Pay directly from your mobile wallet. We support M-Pesa, MTN Mobile Money, and Airtel Money.</p>
                <div>
                  <Label htmlFor="provider">Provider</Label>
                  <Select defaultValue="mpesa">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mpesa">M-Pesa (Safaricom)</SelectItem>
                      <SelectItem value="mtn">MTN Mobile Money</SelectItem>
                      <SelectItem value="airtel">Airtel Money</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input type="tel" placeholder="+254 700 000 000" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="bank" className="space-y-4">
              <div className="rounded-md bg-slate-50 p-4 border text-sm space-y-2">
                <p className="font-semibold">Bank Transfer Instructions</p>
                <p>Make a transfer to the following account:</p>
                <div className="mt-2 space-y-1 font-mono text-xs">
                  <p>Bank: SK AutoSphere Bank</p>
                  <p>Account: 1234567890</p>
                  <p>Swift/BIC: SKASKRSE</p>
                  <p>Reference: {`RES-${Date.now().toString().slice(-6)}`}</p>
                </div>
                <p className="mt-2 text-slate-500 italic">Upload proof of payment after request.</p>
              </div>
            </TabsContent>
          </Tabs>

          {/* Billing Address (Common) */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold">Billing Address</h3>
            <div>
              <Label htmlFor="country">Country/Region</Label>
              <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                <SelectTrigger id="country">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gh">Ghana</SelectItem>
                  <SelectItem value="ng">Nigeria</SelectItem>
                  <SelectItem value="ke">Kenya</SelectItem>
                  <SelectItem value="za">South Africa</SelectItem>
                  <SelectItem value="ug">Uganda</SelectItem>
                  <SelectItem value="tz">Tanzania</SelectItem>
                  <SelectItem value="et">Ethiopia</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Address fields simplified for brevity in this view update, can be expanded */}
            <div>
              <Label htmlFor="address">Street Address</Label>
              <Input
                id="address"
                placeholder="123 Main Street"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
              />
            </div>
          </div>

          {/* Data Saver Toggle */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="dataSaver" className="font-medium">
                Data Saver Mode
              </Label>
              <p className="text-sm text-muted-foreground">Reduce data usage during checkout</p>
            </div>
            <Switch id="dataSaver" checked={dataSaver} onCheckedChange={setDataSaver} />
          </div>

          {/* Submit Button */}
          <Button type="submit" size="lg" className="w-full" disabled={isProcessing}>
            {isProcessing ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                Processing...
              </>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" />
                Pay {currency} {amount.toLocaleString()}
              </>
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Your payment is secured with 256-bit SSL encryption
          </p>
        </CardContent>
      </Card>
    </form>
  )
}
