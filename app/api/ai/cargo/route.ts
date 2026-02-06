import { NextRequest, NextResponse } from "next/server";

/**
 * Captain Cargo - Logistics Agent
 *
 * Goal: Automate "Where is my car?" tracking.
 * Integration: Mocking MarineTraffic / Shipping Line APIs.
 */

interface TrackingStatus {
  booking_ref: string;
  vessel_name: string;
  eta: string;
  status: "AT_SEA" | "DOCKED" | "CUSTOMS" | "DELIVERED";
  current_location: string;
  last_update: string;
  action_required: boolean;
  ai_message: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { booking_ref } = body;

    if (!booking_ref) {
      return NextResponse.json(
        { error: "Booking Ref / BL required" },
        { status: 400 },
      );
    }

    // MOCK: Simulate lookup logic
    // In prod: await fetch(`https://api.marinetraffic.com/...`)

    let status: TrackingStatus["status"] = "AT_SEA";
    let location = "Indian Ocean";
    let eta = "2026-02-15";
    let vessel = "GLOVIS STAR";

    // Deterministic mock based on ref length
    if (booking_ref.endsWith("X")) {
      status = "DOCKED";
      location = "Lagos (Apapa)";
      eta = "2026-01-28";
    }

    const response: TrackingStatus = {
      booking_ref,
      vessel_name: vessel,
      eta,
      status,
      current_location: location,
      last_update: new Date().toISOString(),
      action_required: status === "DOCKED", // If docked, maybe need clearing agent
      ai_message: generateUpdateMessage(status, vessel, location, eta),
    };

    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function generateUpdateMessage(
  status: string,
  vessel: string,
  loc: string,
  eta: string,
): string {
  if (status === "DOCKED") {
    return `🚢 Update: Values has docked at ${loc}! clear your vehicle now to avoid demurrage.`;
  }
  return `🌊 Your vehicle is currently sailing on ${vessel}. Location: ${loc}. ETA: ${eta}.`;
}
