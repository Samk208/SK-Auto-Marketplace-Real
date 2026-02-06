/**
 * Dealer Listings API - PATCH (Update) and DELETE
 *
 * Updates or deletes a listing for the authenticated dealer.
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/supabase-auth-server";
import { getDealerByUserId } from "@/lib/repositories/dealers";
import {
  updateListingForDealer,
  deleteListingForDealer,
  getListingByIdForDealer,
} from "@/lib/repositories/listings";

// Validation schema for updating a listing (all fields optional)
const updateListingSchema = z.object({
  title: z
    .string()
    .min(10, "Title must be at least 10 characters")
    .max(200)
    .optional(),
  brand: z.string().min(1, "Brand is required").optional(),
  model: z.string().min(1, "Model is required").optional(),
  year: z.number().int().min(1900).max(2100).optional(),
  price: z.number().positive("Price must be positive").optional(),
  mileage: z.number().int().nonnegative().optional(),
  fuel_type: z
    .enum(["Petrol", "Diesel", "Electric", "Hybrid", "Gas"])
    .optional(),
  transmission: z.enum(["Manual", "Automatic", "CVT"]).optional(),
  body_type: z
    .enum(["Sedan", "SUV", "Truck", "Van", "Coupe", "Wagon", "Bus", "Other"])
    .optional(),
  condition: z.enum(["Excellent", "Good", "Fair", "Poor"]).optional(),
  location: z.string().optional(),
  destination_port: z.string().optional(),
  status: z.enum(["pending", "active", "sold"]).optional(),
  featured: z.boolean().optional(),
  description: z.string().max(5000).optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET - Get a single listing for editing
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // 1. Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized", message: "You must be logged in" },
        { status: 401 },
      );
    }

    // 2. Get dealer profile
    const dealer = await getDealerByUserId(user.id);
    if (!dealer) {
      return NextResponse.json(
        { error: "Forbidden", message: "You must be a registered dealer" },
        { status: 403 },
      );
    }

    // 3. Get listing (only if owned by this dealer)
    const listing = await getListingByIdForDealer(id, dealer.id);
    if (!listing) {
      return NextResponse.json(
        {
          error: "Not Found",
          message: "Listing not found or you do not have permission to view it",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({ listing });
  } catch (error) {
    console.error("Error in GET /api/dealer/listings/[id]:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to fetch listing" },
      { status: 500 },
    );
  }
}

/**
 * PATCH - Update a listing
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // 1. Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "You must be logged in to update a listing",
        },
        { status: 401 },
      );
    }

    // 2. Get dealer profile
    const dealer = await getDealerByUserId(user.id);
    if (!dealer) {
      return NextResponse.json(
        {
          error: "Forbidden",
          message: "You must be a registered dealer to update listings",
        },
        { status: 403 },
      );
    }

    // 3. Parse and validate request body
    const body = await request.json();
    const validationResult = updateListingSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation Error",
          message: "Invalid listing data",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    // 4. Update listing
    const listing = await updateListingForDealer(
      id,
      dealer.id,
      validationResult.data,
    );

    return NextResponse.json({
      success: true,
      message: "Listing updated successfully",
      listing,
    });
  } catch (error) {
    console.error("Error in PATCH /api/dealer/listings/[id]:", error);

    // Handle specific errors
    if (error instanceof Error) {
      if (error.message.includes("not found")) {
        return NextResponse.json(
          { error: "Not Found", message: "Listing not found" },
          { status: 404 },
        );
      }
      if (error.message.includes("permission")) {
        return NextResponse.json(
          { error: "Forbidden", message: error.message },
          { status: 403 },
        );
      }
    }

    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to update listing" },
      { status: 500 },
    );
  }
}

/**
 * DELETE - Delete a listing
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // 1. Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "You must be logged in to delete a listing",
        },
        { status: 401 },
      );
    }

    // 2. Get dealer profile
    const dealer = await getDealerByUserId(user.id);
    if (!dealer) {
      return NextResponse.json(
        {
          error: "Forbidden",
          message: "You must be a registered dealer to delete listings",
        },
        { status: 403 },
      );
    }

    // 3. Delete listing
    await deleteListingForDealer(id, dealer.id);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error in DELETE /api/dealer/listings/[id]:", error);

    // Handle specific errors
    if (error instanceof Error) {
      if (error.message.includes("not found")) {
        return NextResponse.json(
          { error: "Not Found", message: "Listing not found" },
          { status: 404 },
        );
      }
      if (error.message.includes("permission")) {
        return NextResponse.json(
          { error: "Forbidden", message: error.message },
          { status: 403 },
        );
      }
    }

    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to delete listing" },
      { status: 500 },
    );
  }
}
