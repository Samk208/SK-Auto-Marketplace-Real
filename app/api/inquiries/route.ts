/**
 * POST /api/inquiries
 *
 * Submit a vehicle inquiry
 * Anyone can submit an inquiry (authenticated or guest)
 *
 * Request Body:
 * {
 *   listing_id: string
 *   buyer_email: string
 *   buyer_name: string
 *   buyer_phone?: string
 *   buyer_country?: string
 *   message: string
 *   inquiry_type?: 'general' | 'price_negotiation' | 'inspection' | 'shipping' | 'financing' | 'test_drive'
 * }
 */

import { supabaseServer } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { listing_id, buyer_email, buyer_name, message } = body;
    if (!listing_id || !buyer_email || !buyer_name || !message) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: {
            message:
              "Missing required fields: listing_id, buyer_email, buyer_name, message",
            code: "VALIDATION_ERROR",
          },
        },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(buyer_email)) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: {
            message: "Invalid email format",
            code: "VALIDATION_ERROR",
          },
        },
        { status: 400 },
      );
    }

    // Get the listing to find the dealer_id
    const { data: listing, error: listingError } = await supabaseServer
      .from("car_listings")
      .select("id, dealer_id, title")
      .eq("id" as any, listing_id)
      .single();

    if (listingError || !listing) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: {
            message: "Listing not found",
            code: "NOT_FOUND",
          },
        },
        { status: 404 },
      );
    }

    // Insert the inquiry
    const inquiryData = {
      listing_id,
      dealer_id: (listing as any).dealer_id,
      buyer_email: buyer_email.trim(),
      buyer_name: buyer_name.trim(),
      buyer_phone: body.buyer_phone?.trim() || null,
      buyer_country: body.buyer_country?.trim() || null,
      message: message.trim(),
      inquiry_type: body.inquiry_type || "general",
      status: "new",
      // DMS fields
      preferred_contact_method: body.preferred_contact_method || "email",
      buyer_notes: body.buyer_notes || null,
    };

    const { data, error } = await supabaseServer
      .from("vehicle_inquiries")
      .insert(inquiryData as any)
      .select()
      .single();

    if (error) {
      console.error("Error creating inquiry:", error);
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: {
            message: `Failed to submit inquiry: ${error.message}`,
            code: "DATABASE_ERROR",
          },
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: data,
        error: null,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error in POST /api/inquiries:", error);

    return NextResponse.json(
      {
        success: false,
        data: null,
        error: {
          message:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
          code: "INTERNAL_ERROR",
        },
      },
      { status: 500 },
    );
  }
}
