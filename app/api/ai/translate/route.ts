import { isGeminiConfigured, translateListingWithAI } from "@/lib/gemini";
import { translateListing } from "@/lib/mock-ai-data";
import { TranslationService } from "@/lib/translation/service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { text, targetLanguage } = body;

        // Validate required fields
        if (!text || !targetLanguage) {
            return NextResponse.json(
                { error: "Missing required fields: text, targetLanguage" },
                { status: 400 }
            );
        }

        // Check if Gemini is configured
        if (!isGeminiConfigured()) {
            console.log("Gemini API not configured, using mock translation");
            const mockResult = translateListing(text, targetLanguage);
            return NextResponse.json({
                translatedText: mockResult,
                detectedLanguage: "en",
                source: "mock",
            });
        }

        let translatedText: string;
        let source = "gemini";
        const { listingId, fieldName } = body;

        if (listingId && fieldName) {
            // Use cached service
            try {
                translatedText = await TranslationService.translateListingField(listingId, fieldName, text, targetLanguage);
                source = "cache-optimized";
            } catch (error) {
                console.error("Service Error:", error);
                // Fallback
                const result = await translateListingWithAI(text, targetLanguage);
                translatedText = result.translatedText;
            }
        } else {
            // Direct translation
            translatedText = await TranslationService.translateText(text, targetLanguage);
        }

        return NextResponse.json({
            translatedText,
            detectedLanguage: "en", // Simplified for now
            source,
        });
    } catch (error) {
        console.error("Translation API Error:", error);

        // Fallback to mock
        try {
            const { text, targetLanguage } = await request.json();
            const mockResult = translateListing(text, targetLanguage);
            return NextResponse.json({
                translatedText: mockResult,
                detectedLanguage: "en",
                source: "mock-fallback",
            });
        } catch {
            return NextResponse.json(
                { error: "Failed to translate" },
                { status: 500 }
            );
        }
    }
}
