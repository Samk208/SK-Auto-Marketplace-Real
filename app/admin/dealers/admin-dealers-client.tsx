"use client";

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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle, FileText, Mail, Phone, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Dealer {
  id: string;
  user_id: string;
  business_name: string;
  location: string | null;
  active_listings: number;
  sold_vehicles: number;
  rating: number;
  review_count: number;
  verified: boolean;
  verification_status: string; // 'unverified' | 'pending' | 'verified' | 'rejected'
  verification_notes: string | null;
  business_license_url: string | null;
  users: {
    email: string;
    phone: string | null;
  } | null;
}

interface AdminDealersClientProps {
  initialDealers: Dealer[];
}

export function AdminDealersClient({
  initialDealers,
}: AdminDealersClientProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [dealers] = useState<Dealer[]>(initialDealers);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(null);
  const supabase = createClient();

  const handleVerify = async (id: string) => {
    setIsUpdating(id);
    try {
      const res = await fetch(`/api/admin/dealers/${id}/verify`, {
        method: "PATCH",
        body: JSON.stringify({ action: "approve" }),
      });
      if (!res.ok) throw new Error("Failed to verify");

      toast({
        title: "Dealer Verified",
        description: "Dealer can now operate fully.",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify dealer",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(null);
    }
  };

  const handleRejectClick = (dealer: Dealer) => {
    setSelectedDealer(dealer);
    setRejectReason("");
    setRejectDialogOpen(true);
  };

  const handleRejectSubmit = async () => {
    if (!selectedDealer) return;
    setIsUpdating(selectedDealer.id);
    try {
      const res = await fetch(
        `/api/admin/dealers/${selectedDealer.id}/verify`,
        {
          method: "PATCH",
          body: JSON.stringify({ action: "reject", notes: rejectReason }),
        },
      );
      if (!res.ok) throw new Error("Failed to reject");

      toast({
        title: "Dealer Rejected",
        description: "Verification rejected.",
      });
      setRejectDialogOpen(false);
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject dealer",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(null);
      setSelectedDealer(null);
    }
  };

  const handleViewLicense = async (path: string) => {
    const { data } = await supabase.storage
      .from("dealer-documents")
      .createSignedUrl(path, 60 * 60); // 1 hour link

    if (data?.signedUrl) {
      window.open(data.signedUrl, "_blank");
    } else {
      toast({
        title: "Error",
        description: "Could not generate link",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-medium">Dealer</th>
              <th className="text-left py-3 px-4 font-medium">Contact</th>
              <th className="text-left py-3 px-4 font-medium">Stats</th>
              <th className="text-left py-3 px-4 font-medium">Verification</th>
              <th className="text-left py-3 px-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dealers.map((dealer) => (
              <tr
                key={dealer.id}
                className="border-b hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <td className="py-3 px-4">
                  <div className="font-medium">{dealer.business_name}</div>
                  <div className="text-xs text-slate-500">
                    {dealer.location || "No Location"}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-col gap-1 text-sm">
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" /> {dealer.users?.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />{" "}
                      {dealer.users?.phone || "N/A"}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm">
                    {dealer.active_listings} listings
                  </div>
                  <div className="text-xs text-slate-500">
                    {dealer.sold_vehicles} sold ({dealer.rating}★)
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-col gap-1 items-start">
                    {dealer.verification_status === "verified" && (
                      <Badge className="bg-green-500">Verified</Badge>
                    )}
                    {dealer.verification_status === "pending" && (
                      <Badge className="bg-yellow-500">Pending Review</Badge>
                    )}
                    {dealer.verification_status === "rejected" && (
                      <Badge variant="destructive">Rejected</Badge>
                    )}
                    {dealer.verification_status === "unverified" && (
                      <Badge variant="secondary">Unverified</Badge>
                    )}

                    {dealer.business_license_url && (
                      <Button
                        variant="link"
                        size="sm"
                        className="h-6 px-0 text-blue-600"
                        onClick={() =>
                          handleViewLicense(dealer.business_license_url!)
                        }
                      >
                        <FileText className="h-3 w-3 mr-1" /> View License
                      </Button>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    {dealer.verification_status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 border-green-200 hover:bg-green-50"
                          onClick={() => handleVerify(dealer.id)}
                          disabled={isUpdating === dealer.id}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" /> Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => handleRejectClick(dealer)}
                          disabled={isUpdating === dealer.id}
                        >
                          <XCircle className="h-4 w-4 mr-1" /> Reject
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Dealer Verification</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejection.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label>Reason</Label>
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. License is expired or illegible"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectSubmit}
              disabled={!rejectReason}
            >
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
