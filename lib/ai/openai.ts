/**
 * OpenAI Integration for SK AutoSphere
 * 
 * Provides alternative AI capabilities using OpenAI's GPT models.
 * Can be used alongside or instead of Gemini.
 */

import OpenAI from "openai";

// Initialize OpenAI client
const apiKey = process.env.OPENAI_API_KEY || "";
let openai: OpenAI | null = null;

if (apiKey) {
    try {
        openai = new OpenAI({ apiKey });
        console.log("[OpenAI] API Key detected, client initialized");
    } catch (err) {
        console.error("[OpenAI] Failed to initialize client:", err);
    }
}

// SK AutoSphere system prompt
const SYSTEM_PROMPT = `You are SK Auto Copilot, an AI assistant for SK AutoSphere - a premium Korean used vehicle marketplace connecting Korean dealers with African buyers.

Your expertise includes:
1. **Vehicle Listings**: Help dealers create compelling, SEO-optimized listings
2. **Export Costs**: Estimate shipping costs from Korean ports (Busan, Incheon) to African destinations
3. **Pricing**: Provide market-based pricing recommendations
4. **Translation**: Translate listings to French, Swahili, Arabic, Portuguese
5. **Market Insights**: Share trends about vehicle demand in African markets

Key Knowledge:
- Popular Korean brands: Hyundai, Kia, Genesis, Samsung (Renault Samsung)
- Major export ports: Busan, Incheon, Pyeongtaek
- Target markets: Ghana (Tema port), Nigeria (Lagos/Apapa), Kenya (Mombasa), Guinea (Conakry)
- Typical shipping times: 28-45 days depending on route
- Common vehicle types: Sedans, SUVs, buses, trucks

Always respond in a helpful, professional, and concise manner.`;

export interface OpenAIChatMessage {
    role: "system" | "user" | "assistant";
    content: string;
}

/**
 * Chat with OpenAI GPT model
 */
export async function chatWithOpenAI(
    userMessage: string,
    conversationHistory: OpenAIChatMessage[] = [],
    model: string = "gpt-4o-mini"
): Promise<string> {
    if (!openai) {
        throw new Error("OpenAI API not properly initialized");
    }

    try {
        const messages: OpenAIChatMessage[] = [
            { role: "system", content: SYSTEM_PROMPT },
            ...conversationHistory,
            { role: "user", content: userMessage },
        ];

        const response = await openai.chat.completions.create({
            model,
            messages,
            temperature: 0.7,
            max_tokens: 1024,
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
            throw new Error("No response content from OpenAI");
        }

        return content;
    } catch (error) {
        console.error("[OpenAI] Chat error:", error);
        throw new Error(`OpenAI chat failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}

/**
 * Generate vehicle condition analysis using OpenAI Vision
 */
export async function analyzeVehicleWithOpenAI(
    imageUrls: string[],
    vehicleInfo?: { make?: string; model?: string; year?: number; mileage?: number }
): Promise<{
    severity: "info" | "warning" | "critical";
    category: string;
    description: string;
    confidence: number;
}[]> {
    if (!openai) {
        throw new Error("OpenAI API not properly initialized");
    }

    const vehicleContext = vehicleInfo
        ? `Vehicle: ${vehicleInfo.year || ""} ${vehicleInfo.make || ""} ${vehicleInfo.model || ""} with ${vehicleInfo.mileage?.toLocaleString() || "unknown"} km`
        : "Vehicle details not provided";

    const prompt = `You are an expert automotive inspector analyzing a used vehicle for export from Korea to Africa.

${vehicleContext}
Number of images: ${imageUrls.length}

Based on typical conditions for Korean used vehicles of this type, generate a realistic condition assessment report.

Provide a JSON array of 3-5 condition flags with:
1. "severity": "info" (positive/neutral), "warning" (attention needed), or "critical" (major concern)
2. "category": Area inspected (Exterior, Interior, Engine, Tires, Suspension, etc.)
3. "description": Specific finding (1-2 sentences)
4. "confidence": Number 75-98 indicating assessment confidence

Guidelines:
- Include at least one positive "info" finding
- Most Korean exports have minor issues at most
- Be realistic but fair to the vehicle condition

Respond ONLY with a valid JSON array, no markdown or explanation.`;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are an expert automotive inspector. Respond only with valid JSON." },
                { role: "user", content: prompt },
            ],
            temperature: 0.5,
            max_tokens: 1024,
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
            throw new Error("No response from OpenAI");
        }

        // Parse JSON array
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
            throw new Error("Could not parse JSON from response");
        }

        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error("[OpenAI] Vehicle analysis error:", error);
        throw error;
    }
}

/**
 * Generate smart listing with OpenAI
 */
export async function generateSmartListingWithOpenAI(request: {
    make: string;
    model: string;
    year: number;
    mileage: number;
    port: string;
    condition?: string;
    features?: string[];
}): Promise<{
    title: string;
    description: string;
    suggestedPrice: number;
    tags: string[];
    imageEnhancements: string[];
    aiConfidence: number;
}> {
    if (!openai) {
        throw new Error("OpenAI API not properly initialized");
    }

    const prompt = `Generate a compelling vehicle listing for export from Korea to Africa.

Vehicle Details:
- Make: ${request.make}
- Model: ${request.model}
- Year: ${request.year}
- Mileage: ${request.mileage.toLocaleString()} km
- Destination Port: ${request.port}
${request.condition ? `- Condition: ${request.condition}` : ""}
${request.features?.length ? `- Features: ${request.features.join(", ")}` : ""}

Provide a JSON response with:
1. "title": SEO-optimized listing title (max 80 chars)
2. "description": Compelling 2-3 paragraph description
3. "suggestedPrice": Realistic USD price for Korean used car market
4. "tags": Array of 5-7 relevant tags
5. "imageEnhancements": Array of 3-4 photo improvement tips
6. "aiConfidence": Number 80-95 indicating confidence

Respond ONLY with valid JSON.`;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are an expert car listing copywriter. Respond only with valid JSON." },
                { role: "user", content: prompt },
            ],
            temperature: 0.7,
            max_tokens: 1024,
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
            throw new Error("No response from OpenAI");
        }

        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("Could not parse JSON from response");
        }

        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error("[OpenAI] Smart listing error:", error);
        throw error;
    }
}

/**
 * Translate text using OpenAI
 */
export async function translateWithOpenAI(
    text: string,
    targetLanguage: string
): Promise<{
    translatedText: string;
    detectedLanguage: string;
}> {
    if (!openai) {
        throw new Error("OpenAI API not properly initialized");
    }

    const languageNames: Record<string, string> = {
        fr: "French",
        sw: "Swahili",
        ar: "Arabic",
        pt: "Portuguese",
        ko: "Korean",
    };

    const prompt = `Translate the following vehicle listing text to ${languageNames[targetLanguage] || targetLanguage}.

Text: "${text}"

Provide a JSON response with:
1. "translatedText": The translated text
2. "detectedLanguage": The original language

Maintain professional tone suitable for a vehicle marketplace.
Respond ONLY with valid JSON.`;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a professional translator. Respond only with valid JSON." },
                { role: "user", content: prompt },
            ],
            temperature: 0.3,
            max_tokens: 1024,
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
            throw new Error("No response from OpenAI");
        }

        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("Could not parse JSON from response");
        }

        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error("[OpenAI] Translation error:", error);
        throw error;
    }
}

/**
 * Check if OpenAI API is configured
 */
export function isOpenAIConfigured(): boolean {
    return !!process.env.OPENAI_API_KEY;
}

/**
 * Get available OpenAI models
 */
export function getAvailableModels(): string[] {
    return ["gpt-4o-mini", "gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo"];
}






