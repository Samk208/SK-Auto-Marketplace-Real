"use client";

/**
 * Admin Listings Client Component
 * Handles approve/reject actions with loading states and error handling
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import type { Database } from "@/types/database";
import { CheckCircle, Eye, Loader2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type CarListing = Database["public"]["Tables"]["car_listings"]["Row"] & {
  dealers: {
    id: string;
    business_name: string;
    verified: boolean;
  } | null;
};

interface AdminListingsClientProps {
  initialListings: CarListing[];
}

export function AdminListingsClient({
  initialListings,
}: AdminListingsClientProps) {
  const router = useRouter();
  const [listings, setListings] = useState<CarListing[]>(initialListings);
  const [filter, setFilter] = useState<
    "all" | "pending" | "active" | "rejected"
  >("all");
  const [isApproving, setIsApproving] = useState<string | null>(null);
  const [isRejecting, setIsRejecting] = useState<string | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedListing, setSelectedListing] = useState<CarListing | null>(
    null,
  );

  const filteredListings = listings.filter((listing) => {
    if (filter === "all") return true;
    return listing.status === filter;
  });

  const handleApprove = async (listingId: string) => {
    setIsApproving(listingId);

    try {
      const response = await fetch(`/api/admin/listings/${listingId}/approve`, {
        method: "PATCH",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to approve listing");
      }

      // Update local state
      setListings((prev) =>
        prev.map((listing) =>
          listing.id === listingId
            ? { ...listing, status: "active" as const }
            : listing,
        ),
      );

      // Show success message
      alert("Listing approved successfully! Email sent to dealer.");
      router.refresh();
    } catch (error) {
      console.error("Approve error:", error);
      alert(
        error instanceof Error ? error.message : "Failed to approve listing",
      );
    } finally {
      setIsApproving(null);
    }
  };

  const handleRejectClick = (listing: CarListing) => {
    setSelectedListing(listing);
    setRejectReason("");
    setRejectDialogOpen(true);
  };

  const handleRejectSubmit = async () => {
    if (!selectedListing) return;

    if (rejectReason.length < 10) {
      alert("Rejection reason must be at least 10 characters");
      return;
    }

    setIsRejecting(selectedListing.id);

    try {
      const response = await fetch(
        `/api/admin/listings/${selectedListing.id}/reject`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            rejection_reason: rejectReason,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reject listing");
      }

      // Update local state
      setListings((prev) =>
        prev.map((listing) =>
          listing.id === selectedListing.id
            ? { ...listing, status: "rejected" as const }
            : listing,
        ),
      );

      // Close dialog and reset
      setRejectDialogOpen(false);
      setRejectReason("");
      setSelectedListing(null);

      // Show success message
      alert("Listing rejected successfully! Email sent to dealer with reason.");
      router.refresh();
    } catch (error) {
      console.error("Reject error:", error);
      alert(
        error instanceof Error ? error.message : "Failed to reject listing",
      );
    } finally {
      setIsRejecting(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      pending: "secondary",
      active: "default",
      sold: "outline",
      rejected: "destructive",
    };

    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  const stats = {
    total: listings.length,
    pending: listings.filter((l) => l.status === "pending").length,
    active: listings.filter((l) => l.status === "active").length,
    rejected: listings.filter((l) => l.status === "rejected").length,
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-lg border">
          <div className="text-sm text-muted-foreground">Total Listings</div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <div className="text-sm text-muted-foreground">Pending Review</div>
          <div className="text-2xl font-bold text-orange-500">
            {stats.pending}
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <div className="text-sm text-muted-foreground">Active</div>
          <div className="text-2xl font-bold text-green-500">
            {stats.active}
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <div className="text-sm text-muted-foreground">Rejected</div>
          <div className="text-2xl font-bold text-red-500">
            {stats.rejected}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(["all", "pending", "active", "rejected"] as const).map((status) => (
          <Button
            key={status}
            variant={filter === status ? "default" : "outline"}
            onClick={() => setFilter(status)}
            className="capitalize"
          >
            {status}
          </Button>
        ))}
      </div>

      {/* Listings Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Listing</TableHead>
              <TableHead>Dealer</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredListings.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  No {filter !== "all" ? filter : ""} listings found
                </TableCell>
              </TableRow>
            ) : (
              filteredListings.map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell>
                    <div className="font-medium">{listing.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {listing.year} {listing.brand} {listing.model}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>{listing.dealers?.business_name || "N/A"}</div>
                    {listing.dealers?.verified && (
                      <Badge variant="outline" className="text-xs">
                        Verified
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>${listing.price.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(listing.status)}</TableCell>
                  <TableCell>
                    {new Date(listing.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          window.open(`/shop/${listing.id}`, "_blank")
                        }
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      {listing.status === "pending" && (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleApprove(listing.id)}
                            disabled={isApproving === listing.id}
                          >
                            {isApproving === listing.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <CheckCircle className="h-4 w-4" />
                            )}
                            <span className="ml-2">Approve</span>
                          </Button>

                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRejectClick(listing)}
                            disabled={isRejecting === listing.id}
                          >
                            {isRejecting === listing.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <XCircle className="h-4 w-4" />
                            )}
                            <span className="ml-2">Reject</span>
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Listing</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting this listing. The dealer will
              receive this feedback via email.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="listing-title">Listing</Label>
              <Input
                id="listing-title"
                value={selectedListing?.title || ""}
                disabled
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="rejection-reason">
                Rejection Reason <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="rejection-reason"
                placeholder="e.g., Images are unclear. Please upload high-resolution photos showing all angles of the vehicle."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="mt-1 min-h-[120px]"
                required
              />
              <p className="text-sm text-muted-foreground mt-1">
                Minimum 10 characters ({rejectReason.length}/10)
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectDialogOpen(false);
                setRejectReason("");
                setSelectedListing(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectSubmit}
              disabled={rejectReason.length < 10 || isRejecting !== null}
            >
              {isRejecting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Rejecting...
                </>
              ) : (
                "Reject Listing"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
