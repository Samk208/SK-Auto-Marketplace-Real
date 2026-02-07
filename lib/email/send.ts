/**
 * Email sending helper functions
 *
 * This module provides high-level functions to send transactional emails
 * using Resend and React Email templates
 */

import { FROM_EMAIL, getResend, REPLY_TO_EMAIL } from "./client";
import { DealerRefundNotificationEmail } from "./templates/dealer-refund-notification";
import { DealerSaleNotificationEmail } from "./templates/dealer-sale-notification";
import { ListingApprovedEmail } from "./templates/listing-approved";
import { ListingRejectedEmail } from "./templates/listing-rejected";
import { PaymentSuccessEmail } from "./templates/payment-success";
import { RefundConfirmationEmail } from "./templates/refund-confirmation";

interface Listing {
  id: string;
  title: string;
  dealer_id: string;
  primary_image_url?: string;
}

interface Dealer {
  business_name: string;
  user_id: string;
}

interface DealerWithEmail extends Dealer {
  email?: string;
}

/**
 * Send payment success email to buyer
 */
export async function sendPaymentSuccessEmail(params: {
  buyerEmail: string;
  buyerName: string;
  transactionId: string;
  listingTitle: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: number;
  amount: number;
  currency: string;
  dealerName: string;
  receiptUrl?: string;
}) {
  try {
    if (!params.buyerEmail) {
      console.error(
        "Cannot send payment success email: buyer email not provided",
      );
      return { success: false, error: "No email address" };
    }

    const { data, error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to: params.buyerEmail,
      replyTo: REPLY_TO_EMAIL,
      subject: `✅ Payment Confirmed - ${params.listingTitle}`,
      react: PaymentSuccessEmail({
        buyerName: params.buyerName,
        transactionId: params.transactionId,
        listingTitle: params.listingTitle,
        vehicleBrand: params.vehicleBrand,
        vehicleModel: params.vehicleModel,
        vehicleYear: params.vehicleYear,
        amount: params.amount,
        currency: params.currency,
        dealerName: params.dealerName,
        receiptUrl: params.receiptUrl,
      }),
    });

    if (error) {
      console.error("Failed to send payment success email:", error);
      return { success: false, error };
    }

    console.log("Payment success email sent:", data?.id);
    return { success: true, data };
  } catch (error) {
    console.error("Error sending payment success email:", error);
    return { success: false, error };
  }
}

/**
 * Send sale notification email to dealer
 */
export async function sendDealerSaleNotificationEmail(params: {
  dealerEmail: string;
  dealerName: string;
  transactionId: string;
  listingTitle: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: number;
  amount: number;
  currency: string;
  buyerName: string;
  buyerEmail: string;
  buyerCountry?: string;
}) {
  try {
    if (!params.dealerEmail) {
      console.error(
        "Cannot send dealer sale notification: dealer email not provided",
      );
      return { success: false, error: "No email address" };
    }

    const { data, error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to: params.dealerEmail,
      replyTo: REPLY_TO_EMAIL,
      subject: `🎉 New Sale! ${params.listingTitle}`,
      react: DealerSaleNotificationEmail({
        dealerName: params.dealerName,
        transactionId: params.transactionId,
        listingTitle: params.listingTitle,
        vehicleBrand: params.vehicleBrand,
        vehicleModel: params.vehicleModel,
        vehicleYear: params.vehicleYear,
        amount: params.amount,
        currency: params.currency,
        buyerName: params.buyerName,
        buyerEmail: params.buyerEmail,
        buyerCountry: params.buyerCountry,
      }),
    });

    if (error) {
      console.error("Failed to send dealer sale notification:", error);
      return { success: false, error };
    }

    console.log("Dealer sale notification sent:", data?.id);
    return { success: true, data };
  } catch (error) {
    console.error("Error sending dealer sale notification:", error);
    return { success: false, error };
  }
}

/**
 * Send email notification when a listing is approved
 */
export async function sendListingApprovedEmail(
  listing: Listing,
  dealer: DealerWithEmail,
  dealerEmail?: string,
) {
  try {
    const toEmail = dealerEmail || dealer.email;

    if (!toEmail) {
      console.error("Cannot send approved email: dealer email not provided");
      return { success: false, error: "No email address" };
    }

    const listingUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://skautosphere.com"}/listings/${listing.id}`;

    const { data, error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to: toEmail,
      replyTo: REPLY_TO_EMAIL,
      subject: `✅ Your listing "${listing.title}" is now live!`,
      react: ListingApprovedEmail({
        dealerName: dealer.business_name,
        listingTitle: listing.title,
        listingId: listing.id,
        listingUrl,
        listingImageUrl: listing.primary_image_url,
      }),
    });

    if (error) {
      console.error("Failed to send approval email:", error);
      return { success: false, error };
    }

    console.log("Approval email sent successfully:", data?.id);
    return { success: true, data };
  } catch (error) {
    console.error("Error sending approval email:", error);
    return { success: false, error };
  }
}

/**
 * Send email notification when a listing is rejected
 */
export async function sendListingRejectedEmail(
  listing: Listing,
  dealer: DealerWithEmail,
  rejectionReason: string,
  dealerEmail?: string,
) {
  try {
    const toEmail = dealerEmail || dealer.email;

    if (!toEmail) {
      console.error("Cannot send rejection email: dealer email not provided");
      return { success: false, error: "No email address" };
    }

    const { data, error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to: toEmail,
      replyTo: REPLY_TO_EMAIL,
      subject: `📋 Update needed for your listing - ${listing.title}`,
      react: ListingRejectedEmail({
        dealerName: dealer.business_name,
        listingTitle: listing.title,
        listingId: listing.id,
        rejectionReason,
        dashboardUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "https://skautosphere.com"}/dealer/listings`,
      }),
    });

    if (error) {
      console.error("Failed to send rejection email:", error);
      return { success: false, error };
    }

    console.log("Rejection email sent successfully:", data?.id);
    return { success: true, data };
  } catch (error) {
    console.error("Error sending rejection email:", error);
    return { success: false, error };
  }
}

/**
 * Helper to get dealer email from user_id
 * Uses service role client to access admin.getUserById()
 *
 * SECURITY: Must use service role client - anon client cannot call admin methods
 */
import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function getDealerEmail(userId: string): Promise<string | null> {
  try {
    // Use service role client for admin operations
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase.auth.admin.getUserById(userId);

    if (error || !data?.user?.email) {
      console.error("Failed to get dealer email:", error);
      return null;
    }

    return data.user.email;
  } catch (error) {
    console.error("Error getting dealer email:", error);
    return null;
  }
}

/**
 * Send refund confirmation email to buyer
 */
export async function sendRefundConfirmationEmail(
  buyerEmail: string,
  buyerName: string,
  transactionId: string,
  listingTitle: string,
  refundAmount: number,
  originalAmount: number,
  currency: string,
  refundReason?: string,
) {
  try {
    if (!buyerEmail) {
      console.error(
        "Cannot send refund confirmation: buyer email not provided",
      );
      return { success: false, error: "No email address" };
    }

    const { data, error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to: buyerEmail,
      replyTo: REPLY_TO_EMAIL,
      subject: `Refund Processed - ${listingTitle}`,
      react: RefundConfirmationEmail({
        buyerName,
        transactionId,
        listingTitle,
        refundAmount,
        originalAmount,
        currency,
        refundReason,
      }),
    });

    if (error) {
      console.error("Failed to send refund confirmation email:", error);
      return { success: false, error };
    }

    console.log("Refund confirmation email sent successfully:", data?.id);
    return { success: true, data };
  } catch (error) {
    console.error("Error sending refund confirmation email:", error);
    return { success: false, error };
  }
}

/**
 * Send refund notification email to dealer
 */
export async function sendDealerRefundNotificationEmail(
  dealerEmail: string,
  dealerName: string,
  transactionId: string,
  listingTitle: string,
  listingId: string,
  refundAmount: number,
  originalAmount: number,
  currency: string,
  buyerEmail: string,
  refundReason?: string,
) {
  try {
    if (!dealerEmail) {
      console.error(
        "Cannot send dealer refund notification: dealer email not provided",
      );
      return { success: false, error: "No email address" };
    }

    const { data, error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to: dealerEmail,
      replyTo: REPLY_TO_EMAIL,
      subject: `Transaction Refunded - ${listingTitle}`,
      react: DealerRefundNotificationEmail({
        dealerName,
        transactionId,
        listingTitle,
        listingId,
        refundAmount,
        originalAmount,
        currency,
        refundReason,
        buyerEmail,
      }),
    });

    if (error) {
      console.error("Failed to send dealer refund notification:", error);
      return { success: false, error };
    }

    console.log("Dealer refund notification sent successfully:", data?.id);
    return { success: true, data };
  } catch (error) {
    console.error("Error sending dealer refund notification:", error);
    return { success: false, error };
  }
}
