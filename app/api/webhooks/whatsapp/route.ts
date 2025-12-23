
import { chatWithGemini, GeminiChatMessage } from "@/lib/gemini";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; // Use service role if available for webhooks, but anon is what we have in env usually
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Helper to send message efficiently via Meta Graph API
async function sendMessageToWhatsApp(to: string, text: string) {
    const token = process.env.WHATSAPP_API_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_ID; // The ID, not the number itself

    if (!token || !phoneId) {
        console.error("Missing WhatsApp credentials (WHATSAPP_API_TOKEN or WHATSAPP_PHONE_ID)");
        return;
    }

    try {
        const response = await fetch(
            `https://graph.facebook.com/v17.0/${phoneId}/messages`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    messaging_product: "whatsapp",
                    to: to,
                    type: "text",
                    text: { body: text }
                })
            }
        );

        const data = await response.json();
        if (!response.ok) {
            console.error("WhatsApp Send Error:", data);
        } else {
            console.log("WhatsApp Message Sent:", data);
        }
    } catch (e) {
        console.error("WhatsApp Network Error:", e);
    }
}

// Verify Webhook (GET)
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const mode = searchParams.get("hub.mode");
    const token = searchParams.get("hub.verify_token");
    const challenge = searchParams.get("hub.challenge");

    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

    if (mode && token) {
        if (mode === "subscribe" && token === verifyToken) {
            console.log("WEBHOOK_VERIFIED");
            return new NextResponse(challenge, { status: 200 });
        } else {
            return new NextResponse("Forbidden", { status: 403 });
        }
    }

    return new NextResponse("Bad Request", { status: 400 });
}

// Handle Incoming Messages (POST)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Check if it's a WhatsApp status update or message
        if (body.object) {
            if (
                body.entry &&
                body.entry[0].changes &&
                body.entry[0].changes[0].value.messages &&
                body.entry[0].changes[0].value.messages[0]
            ) {
                const messageObject = body.entry[0].changes[0].value.messages[0];
                const phoneNumber = messageObject.from; // Sender's phone number
                const textObject = messageObject.text;
                const messageBody = textObject ? textObject.body : null;
                const name = body.entry[0].changes[0].value.contacts[0]?.profile?.name || "Unknown";

                if (messageBody) {
                    console.log(`[WhatsApp] Received message from ${name} (${phoneNumber}): ${messageBody}`);

                    // 1. Get or Create Session
                    let { data: session, error: sessionError } = await supabase
                        .from("whatsapp_sessions")
                        .select("*")
                        .eq("phone_number", phoneNumber)
                        .single();

                    if (sessionError || !session) {
                        console.log("[WhatsApp] Creating new session for", phoneNumber);
                        const { data: newSession, error: createError } = await supabase
                            .from("whatsapp_sessions")
                            .insert({
                                phone_number: phoneNumber,
                                customer_name: name,
                                status: 'active'
                            })
                            .select()
                            .single();

                        if (createError) {
                            console.error("Error creating session:", createError);
                            return NextResponse.json({ error: "Database Error" }, { status: 500 });
                        }
                        session = newSession;
                    }

                    // 2. Store User Message
                    await supabase.from("whatsapp_messages").insert({
                        session_id: session.id,
                        role: "user",
                        content: messageBody
                    });

                    // 3. Get Chat History (Last 10 messages)
                    const { data: historyData } = await supabase
                        .from("whatsapp_messages")
                        .select("role, content")
                        .eq("session_id", session.id)
                        .order("created_at", { ascending: false }) // Get recent first
                        .limit(10);

                    // Convert to Gemini format (reverse to chronological)
                    const history: GeminiChatMessage[] = (historyData || [])
                        .reverse()
                        .map(msg => ({
                            role: msg.role === "user" ? "user" : "model",
                            parts: [{ text: msg.content }]
                        }));

                    // Remove the very last message we just added from history to avoid duplication in prompt if Gemini SDK handles it,
                    // but usually SDK expects history NOT including the current turn. 
                    // Since we query ALL messages including the one we just inserted, we should pop it or filter it.
                    // Actually, `chatWithGemini` takes `userMessage` as current and `history` as previous.
                    // So we should exclude the current message from history.
                    const contextHistory = history.slice(0, -1);

                    // 4. Get AI Response
                    const aiResponse = await chatWithGemini(messageBody, contextHistory, { username: name });

                    // 5. Store AI Response
                    await supabase.from("whatsapp_messages").insert({
                        session_id: session.id,
                        role: "assistant",
                        content: aiResponse
                    });

                    // 6. Send Response back to WhatsApp
                    console.log(`[WhatsApp] Sending response to ${phoneNumber}: ${aiResponse}`);
                    await sendMessageToWhatsApp(phoneNumber, aiResponse);
                }
            }
            return NextResponse.json({ success: true }, { status: 200 });
        } else {
            return NextResponse.json({ error: "Not a valid event" }, { status: 404 });
        }
    } catch (error) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
