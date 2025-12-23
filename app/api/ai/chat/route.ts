import { chatWithGemini, GeminiChatMessage, isGeminiConfigured } from "@/lib/gemini";
import { getCopilotAIResponse } from "@/lib/mock-ai-data";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    let userMessage: string | undefined;

    try {
        const body = await request.json();
        const { message, history, context } = body;
        userMessage = message;

        if (!message || typeof message !== "string") {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }

        // Check if Gemini is configured, otherwise use mock
        if (!isGeminiConfigured()) {
            console.log("Gemini API not configured, using mock response");
            const mockResponse = getCopilotAIResponse(message);
            return NextResponse.json({
                response: mockResponse,
                source: "mock",
            });
        }

        // Convert history format if provided
        const geminiHistory: GeminiChatMessage[] = (history || []).map(
            (msg: { role: string; content: string }) => ({
                role: msg.role === "user" ? "user" : "model",
                parts: [{ text: msg.content }],
            })
        );

        const response = await chatWithGemini(message, geminiHistory, context);

        return NextResponse.json({
            response,
            source: "gemini",
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("AI Chat API Error:", errorMessage);

        // Fallback to mock on error if we have the message
        if (userMessage) {
            const mockResponse = getCopilotAIResponse(userMessage);
            return NextResponse.json({
                response: mockResponse,
                source: "mock-fallback",
                debug_error: errorMessage,
            });
        }

        return NextResponse.json(
            { error: "Failed to process request" },
            { status: 500 }
        );
    }
}

