/**
 * AI Condition Report API
 * 
 * Analyzes vehicle images using Gemini or OpenAI to generate a condition report.
 * Automatically selects the best available AI provider.
 */

import { NextRequest, NextResponse } from "next/server";
import { analyzeVehicleCondition, isAIAvailable, getAIStatus, getProviderDisplayName } from "@/lib/ai";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { images, vehicleInfo, preferredProvider } = body;

        if (!images || !Array.isArray(images) || images.length === 0) {
            return NextResponse.json(
                { error: "At least one image URL is required" },
                { status: 400 }
            );
        }

        // Check AI status
        const aiStatus = getAIStatus();
        if (!isAIAvailable()) {
            console.log("[AI Condition] No AI provider configured, using fallback");
        }

        const result = await analyzeVehicleCondition(images, vehicleInfo, {
            provider: preferredProvider || "auto",
        });

        return NextResponse.json({
            success: true,
            flags: result.flags,
            imageCount: images.length,
            aiPowered: isAIAvailable(),
            provider: result.provider,
            providerName: getProviderDisplayName(result.provider),
            availableProviders: aiStatus,
        });
    } catch (error) {
        console.error("[AI Condition Report] Error:", error);
        return NextResponse.json(
            { 
                error: "Failed to generate condition report",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}

