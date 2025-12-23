"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, ArrowLeft, Download } from "lucide-react"
import Link from "next/link"

interface PaymentResultProps {
  success: boolean
  message: string
  receiptNumber?: string
  listingId?: string
  onRetry?: () => void
}

export function PaymentResult({ success, message, receiptNumber, listingId, onRetry }: PaymentResultProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center">
          {success ? (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-950">
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="mb-2 text-2xl font-bold">Payment Successful!</h2>
              <p className="mb-6 text-muted-foreground">{message}</p>

              {receiptNumber && (
                <div className="mb-6 rounded-lg bg-muted p-4">
                  <p className="mb-1 text-sm font-medium">Receipt Number</p>
                  <p className="font-mono text-lg">{receiptNumber}</p>
                  {listingId && <p className="mt-2 text-sm text-muted-foreground">Listing ID: {listingId}</p>}
                </div>
              )}

              <div className="space-y-3">
                <Button size="lg" className="w-full" asChild>
                  <Link href="/shop">Continue Shopping</Link>
                </Button>
                <Button size="lg" variant="outline" className="w-full bg-transparent">
                  <Download className="mr-2 h-4 w-4" />
                  Download Receipt
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-950">
                <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="mb-2 text-2xl font-bold">Payment Failed</h2>
              <p className="mb-6 text-muted-foreground">{message}</p>

              <div className="space-y-3">
                {onRetry && (
                  <Button size="lg" className="w-full" onClick={onRetry}>
                    Try Again
                  </Button>
                )}
                <Button size="lg" variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/shop">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Shop
                  </Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
