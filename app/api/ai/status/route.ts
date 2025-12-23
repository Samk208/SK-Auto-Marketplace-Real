/**
 * AI Status API
 * 
 * Returns the status of available AI providers.
 */

import { NextResponse } from "next/server";
import { getAIStatus, isAIAvailable, getActiveProvider, getProviderDisplayName } from "@/lib/ai";

export async function GET() {
    const status = getAIStatus();
    const activeProvider = getActiveProvider();

    return NextResponse.json({
        available: isAIAvailable(),
        providers: {
            gemini: {
                configured: status.gemini,
                name: "Gemini AI",
                description: "Google's Gemini 1.5 Flash model",
            },
            openai: {
                configured: status.openai,
                name: "OpenAI GPT",
                description: "OpenAI's GPT-4o-mini model",
            },
        },
        activeProvider: activeProvider,
        activeProviderName: activeProvider ? getProviderDisplayName(activeProvider) : null,
    });
}
