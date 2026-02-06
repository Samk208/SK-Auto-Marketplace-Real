"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DollarSign, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const fetchPayments = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (statusFilter !== "all")
          params.append("status", statusFilter.toLowerCase());
        params.append("limit", "100");

        const response = await fetch(`/api/transactions?${params.toString()}`);
        const data = await response.json();

        if (data.transactions) {
          setPayments(data.transactions);
        }
      } catch (error) {
        console.error("Failed to fetch payments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, [statusFilter]);

  const completedPayments = payments.filter((p) => p.status === "succeeded");
  const pendingPayments = payments.filter(
    (p) => p.status === "pending" || p.status === "processing",
  );

  const completedAmount = completedPayments.reduce(
    (sum, p) => sum + p.amount,
    0,
  );
  const pendingAmount = pendingPayments.reduce((sum, p) => sum + p.amount, 0);
  const filteredAmount = payments.reduce(
    (sum, p) => (p.status === "succeeded" ? sum + p.amount : sum),
    0,
  );

  const getStatusVariant = (status: string) => {
    if (status === "succeeded") return "default";
    if (status === "pending" || status === "processing") return "secondary";
    if (status === "failed") return "destructive";
    return "outline";
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (payments.length === 0) {
      return (
        <div className="text-center py-20 text-muted-foreground">
          No transactions found matching your criteria.
        </div>
      );
    }

    return (
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4 font-medium">Payment ID</th>
            <th className="text-left py-3 px-4 font-medium">Listing</th>
            <th className="text-left py-3 px-4 font-medium">Dealer</th>
            <th className="text-left py-3 px-4 font-medium">Buyer</th>
            <th className="text-left py-3 px-4 font-medium">Amount</th>
            <th className="text-left py-3 px-4 font-medium">Status</th>
            <th className="text-left py-3 px-4 font-medium">Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr
              key={payment.id}
              className="border-b hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <td className="py-3 px-4 text-sm font-mono truncate max-w-[150px]">
                #{payment.id}
              </td>
              <td className="py-3 px-4">
                <p className="font-medium text-sm line-clamp-1">
                  {payment.car_listings?.title || "Unknown Listing"}
                </p>
                <p className="text-xs text-slate-600">
                  ID: {payment.listing_id}
                </p>
              </td>
              <td className="py-3 px-4 text-sm">
                {payment.dealers?.business_name || "N/A"}
              </td>
              <td className="py-3 px-4 text-sm">
                <p className="font-medium">{payment.buyer_name}</p>
                <p className="text-xs text-slate-600">
                  {payment.buyer_country}
                </p>
              </td>
              <td className="py-3 px-4">
                <p className="font-semibold text-sm">
                  ${payment.amount.toLocaleString()}
                </p>
                <p className="text-xs text-slate-600 uppercase">
                  {payment.currency}
                </p>
              </td>
              <td className="py-3 px-4">
                <Badge
                  variant={getStatusVariant(payment.status)}
                  className="capitalize"
                >
                  {payment.status}
                </Badge>
              </td>
              <td className="py-3 px-4 text-sm">
                {new Date(payment.created_at).toLocaleDateString()}
                <p className="text-xs text-slate-600">
                  {new Date(payment.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payments & Reservations</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Track all transactions and reservations
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Transactions
            </CardTitle>
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
              {completedPayments.length}
            </div>
            <p className="text-xs text-slate-600 mt-1">
              ${completedAmount.toLocaleString()}
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
              {pendingPayments.length}
            </div>
            <p className="text-xs text-slate-600 mt-1">
              ${pendingAmount.toLocaleString()}
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
                  <SelectItem value="Succeeded">Succeeded</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
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
          <CardTitle>Transactions ({payments.length})</CardTitle>
          <CardDescription>
            Total value (Succeeded): ${filteredAmount.toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">{renderContent()}</div>
        </CardContent>
      </Card>
    </div>
  );
}
