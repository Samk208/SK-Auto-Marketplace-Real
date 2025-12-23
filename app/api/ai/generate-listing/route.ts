import { generateSmartListingWithAI, isGeminiConfigured } from "@/lib/gemini";
import { generateSmartListing } from "@/lib/mock-ai-data";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { make, model, year, mileage, port, condition, features } = body;

        // Validate required fields
        if (!make || !model || !year || !mileage || !port) {
            return NextResponse.json(
                { error: "Missing required fields: make, model, year, mileage, port" },
                { status: 400 }
            );
        }

        // Check if Gemini is configured
        if (!isGeminiConfigured()) {
            console.log("Gemini API not configured, using mock listing generator");
            const mockResult = generateSmartListing(make, model, year, mileage, port);
            return NextResponse.json({
                ...mockResult,
                source: "mock",
            });
        }

        const result = await generateSmartListingWithAI({
            make,
            model,
            year,
            mileage,
            port,
            condition,
            features,
        });

        return NextResponse.json({
            ...result,
            source: "gemini",
        });
    } catch (error) {
        console.error("Generate Listing API Error:", error);

        // Fallback to mock
        try {
            const { make, model, year, mileage, port } = await request.json();
            const mockResult = generateSmartListing(make, model, year, mileage, port);
            return NextResponse.json({
                ...mockResult,
                source: "mock-fallback",
            });
        } catch {
            return NextResponse.json(
                { error: "Failed to generate listing" },
                { status: 500 }
            );
        }
    }
}
