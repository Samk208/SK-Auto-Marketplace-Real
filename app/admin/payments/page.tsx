"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { mockAdminPayments } from "@/mock/adminData"
import type { PaymentAdmin } from "@/types/admin"
import { DollarSign } from "lucide-react"

export default function AdminPaymentsPage() {
  const [payments] = useState<PaymentAdmin[]>(mockAdminPayments)
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredPayments = statusFilter === "all" ? payments : payments.filter((p) => p.status === statusFilter)

  const totalAmount = filteredPayments.reduce((sum, p) => (p.status === "Completed" ? sum + p.amount : sum), 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payments & Reservations</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Track all transactions and reservations</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <DollarSign className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payments.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {payments.filter((p) => p.status === "Completed").length}
            </div>
            <p className="text-xs text-slate-600 mt-1">
              $
              {payments
                .filter((p) => p.status === "Completed")
                .reduce((sum, p) => sum + p.amount, 0)
                .toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <DollarSign className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {payments.filter((p) => p.status === "Pending").length}
            </div>
            <p className="text-xs text-slate-600 mt-1">
              $
              {payments
                .filter((p) => p.status === "Pending")
                .reduce((sum, p) => sum + p.amount, 0)
                .toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                  <SelectItem value="Refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transactions ({filteredPayments.length})</CardTitle>
          <CardDescription>Total value: ${totalAmount.toLocaleString()}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Payment ID</th>
                  <th className="text-left py-3 px-4 font-medium">Listing</th>
                  <th className="text-left py-3 px-4 font-medium">Dealer</th>
                  <th className="text-left py-3 px-4 font-medium">Buyer Country</th>
                  <th className="text-left py-3 px-4 font-medium">Amount</th>
                  <th className="text-left py-3 px-4 font-medium">Method</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="border-b hover:bg-slate-50 dark:hover:bg-slate-800">
                    <td className="py-3 px-4 text-sm font-mono">#{payment.id}</td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-sm">{payment.listingTitle}</p>
                      <p className="text-xs text-slate-600">ID: {payment.listingId}</p>
                    </td>
                    <td className="py-3 px-4 text-sm">{payment.dealerName}</td>
                    <td className="py-3 px-4 text-sm">{payment.buyerCountry}</td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-sm">${payment.amount.toLocaleString()}</p>
                      {payment.reservationFee && (
                        <p className="text-xs text-slate-600">Reserve: ${payment.reservationFee}</p>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm">{payment.paymentMethod}</td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          payment.status === "Completed"
                            ? "default"
                            : payment.status === "Pending"
                              ? "secondary"
                              : payment.status === "Failed"
                                ? "destructive"
                                : "outline"
                        }
                      >
                        {payment.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {payment.transactionDate.toLocaleDateString()}
                      <p className="text-xs text-slate-600">
                        {payment.transactionDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
