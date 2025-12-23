"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Package, Shield, Truck } from "lucide-react"
import type { CheckoutItem } from "@/lib/mock-checkout-data"

interface OrderSummaryProps {
  item: CheckoutItem
  reservationFee?: number
}

export function OrderSummary({ item, reservationFee = 500 }: OrderSummaryProps) {
  const shippingEstimate = 2500
  const inspectionFee = 150
  const totalAmount = item.amount + shippingEstimate + inspectionFee

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Vehicle Details */}
        <div className="flex gap-4">
          <div className="relative h-24 w-32 flex-shrink-0 overflow-hidden rounded-lg border">
            <img src={item.image || "/placeholder.svg"} alt={item.title} className="h-full w-full object-cover" />
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="font-semibold leading-tight">{item.title}</h3>
            <p className="text-sm text-muted-foreground">
              {item.year} • {item.mileage.toLocaleString()} {item.mileageUnit}
            </p>
            <Badge variant="secondary" className="text-xs">
              <Shield className="mr-1 h-3 w-3" />
              Verified Dealer
            </Badge>
          </div>
        </div>

        <Separator />

        {/* Dealer & Export Info */}
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-2">
            <Package className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">Dealer</p>
              <p className="text-muted-foreground">{item.dealerName}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Truck className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">Export Route</p>
              <p className="text-muted-foreground">{item.exportPort}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Price Breakdown */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Vehicle Price</span>
            <span className="font-medium">
              {item.currency} {item.amount.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping Estimate</span>
            <span className="font-medium">
              {item.currency} {shippingEstimate.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Pre-Shipment Inspection</span>
            <span className="font-medium">
              {item.currency} {inspectionFee.toLocaleString()}
            </span>
          </div>

          <Separator />

          <div className="flex justify-between text-base">
            <span className="font-semibold">Total Amount</span>
            <span className="font-bold">
              {item.currency} {totalAmount.toLocaleString()}
            </span>
          </div>

          <div className="rounded-lg bg-muted p-3 text-xs">
            <p className="font-medium">24-Hour Reservation Fee</p>
            <p className="mt-1 text-muted-foreground">
              Pay {item.currency} {reservationFee} now to reserve this vehicle. Full payment due within 24 hours.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
