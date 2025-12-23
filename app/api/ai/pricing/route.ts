import { getPricingRecommendation, isGeminiConfigured } from "@/lib/gemini";
import { generatePricingRecommendation } from "@/mock/aiData";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { make, model, year, mileage, condition } = body;

        // Validate required fields
        if (!make || !model || !year || !mileage) {
            return NextResponse.json(
                { error: "Missing required fields: make, model, year, mileage" },
                { status: 400 }
            );
        }

        // Check if Gemini is configured
        if (!isGeminiConfigured()) {
            console.log("Gemini API not configured, using mock pricing");
            const mockResult = generatePricingRecommendation(make, model, year, mileage);
            return NextResponse.json({
                ...mockResult,
                marketTrend: "stable",
                source: "mock",
            });
        }

        const result = await getPricingRecommendation({
            make,
            model,
            year,
            mileage,
            condition,
        });

        return NextResponse.json({
            ...result,
            source: "gemini",
        });
    } catch (error) {
        console.error("Pricing API Error:", error);

        // Fallback to mock
        try {
            const { make, model, year, mileage } = await request.json();
            const mockResult = generatePricingRecommendation(make, model, year, mileage);
            return NextResponse.json({
                ...mockResult,
                marketTrend: "stable",
                source: "mock-fallback",
            });
        } catch {
            return NextResponse.json(
                { error: "Failed to get pricing recommendation" },
                { status: 500 }
            );
        }
    }
}
