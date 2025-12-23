/**
 * Unified AI Provider for SK AutoSphere
 * 
 * Automatically selects between Gemini and OpenAI based on configuration.
 * Falls back gracefully if one provider is unavailable.
 */

import { isGeminiConfigured, chatWithGemini, analyzeVehicleCondition as analyzeWithGemini } from "@/lib/gemini";
import { isOpenAIConfigured, chatWithOpenAI, analyzeVehicleWithOpenAI } from "@/lib/ai/openai";

export type AIProvider = "gemini" | "openai" | "auto";

export interface AIConfig {
    provider?: AIProvider;
    preferredModel?: string;
}

/**
 * Get the currently active AI provider
 */
export function getActiveProvider(): AIProvider | null {
    if (isGeminiConfigured()) return "gemini";
    if (isOpenAIConfigured()) return "openai";
    return null;
}

/**
 * Check if any AI provider is available
 */
export function isAIAvailable(): boolean {
    return isGeminiConfigured() || isOpenAIConfigured();
}

/**
 * Get AI provider status
 */
export function getAIStatus(): {
    gemini: boolean;
    openai: boolean;
    active: AIProvider | null;
} {
    return {
        gemini: isGeminiConfigured(),
        openai: isOpenAIConfigured(),
        active: getActiveProvider(),
    };
}

/**
 * Unified chat function - automatically selects provider
 */
export async function chat(
    message: string,
    history: Array<{ role: string; content: string }> = [],
    config: AIConfig = {}
): Promise<{ response: string; provider: AIProvider }> {
    const provider = config.provider === "auto" || !config.provider
        ? getActiveProvider()
        : config.provider;

    if (!provider) {
        throw new Error("No AI provider configured. Please set GEMINI_API_KEY or OPENAI_API_KEY.");
    }

    if (provider === "gemini" && isGeminiConfigured()) {
        const geminiHistory = history.map((msg) => ({
            role: msg.role as "user" | "model",
            parts: [{ text: msg.content }],
        }));
        const response = await chatWithGemini(message, geminiHistory);
        return { response, provider: "gemini" };
    }

    if (provider === "openai" && isOpenAIConfigured()) {
        const openaiHistory = history.map((msg) => ({
            role: msg.role as "system" | "user" | "assistant",
            content: msg.content,
        }));
        const response = await chatWithOpenAI(message, openaiHistory, config.preferredModel);
        return { response, provider: "openai" };
    }

    throw new Error(`AI provider ${provider} is not configured.`);
}

/**
 * Unified vehicle condition analysis
 */
export async function analyzeVehicleCondition(
    imageUrls: string[],
    vehicleInfo?: { make?: string; model?: string; year?: number; mileage?: number },
    config: AIConfig = {}
): Promise<{
    flags: Array<{
        severity: "info" | "warning" | "critical";
        category: string;
        description: string;
        confidence: number;
    }>;
    provider: AIProvider;
}> {
    const provider = config.provider === "auto" || !config.provider
        ? getActiveProvider()
        : config.provider;

    if (!provider) {
        // Return fallback data if no AI is configured
        return {
            flags: [
                {
                    severity: "info",
                    category: "Status",
                    description: "AI condition analysis not available. Please configure an AI provider.",
                    confidence: 0,
                },
            ],
            provider: "gemini",
        };
    }

    try {
        if (provider === "gemini" && isGeminiConfigured()) {
            const flags = await analyzeWithGemini(imageUrls, vehicleInfo);
            return { flags, provider: "gemini" };
        }

        if (provider === "openai" && isOpenAIConfigured()) {
            const flags = await analyzeVehicleWithOpenAI(imageUrls, vehicleInfo);
            return { flags, provider: "openai" };
        }
    } catch (error) {
        console.error(`[AI Provider] ${provider} analysis failed:`, error);
        
        // Try fallback provider
        const fallbackProvider = provider === "gemini" ? "openai" : "gemini";
        if (fallbackProvider === "openai" && isOpenAIConfigured()) {
            console.log("[AI Provider] Falling back to OpenAI");
            const flags = await analyzeVehicleWithOpenAI(imageUrls, vehicleInfo);
            return { flags, provider: "openai" };
        }
        if (fallbackProvider === "gemini" && isGeminiConfigured()) {
            console.log("[AI Provider] Falling back to Gemini");
            const flags = await analyzeWithGemini(imageUrls, vehicleInfo);
            return { flags, provider: "gemini" };
        }
        
        throw error;
    }

    throw new Error(`AI provider ${provider} is not configured.`);
}

/**
 * Get provider display name
 */
export function getProviderDisplayName(provider: AIProvider): string {
    const names: Record<AIProvider, string> = {
        gemini: "Gemini AI",
        openai: "OpenAI GPT",
        auto: "Auto",
    };
    return names[provider] || provider;
}






