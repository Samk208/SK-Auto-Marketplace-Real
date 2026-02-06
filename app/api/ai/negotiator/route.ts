import { FinancialSafetyLayer } from "@/lib/agents/negotiator/safety";
import { AgentEventBus } from "@/lib/agents/orchestration/event-bus";
import {
  DealJourneyState,
  DealJourneyStateMachine,
} from "@/lib/agents/orchestration/state-machine";
import { chatWithGemini, GeminiChatMessage } from "@/lib/gemini";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Agent intents and state management
type AgentIntent =
  | "inquiry"
  | "negotiation"
  | "quote_request"
  | "shipping"
  | "general";

const stateMachine = new DealJourneyStateMachine();
const eventBus = new AgentEventBus();

import { headers } from "next/headers";

const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const limit = 60;

  const record = rateLimitMap.get(ip) || { count: 0, lastReset: now };

  if (now - record.lastReset > windowMs) {
    record.count = 0;
    record.lastReset = now;
  }

  if (record.count >= limit) {
    return true;
  }

  record.count++;
  rateLimitMap.set(ip, record);
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      message,
      history,
      customerPhone,
      customerName,
      listingId,
      threadId,
    } = body;

    // Security: Rate Limiting
    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for") || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a minute." },
        { status: 429 },
      );
    }

    // Security: Input Validation
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }
    if (message.length > 500) {
      return NextResponse.json(
        { error: "Message too long (max 500 chars)" },
        { status: 400 },
      );
    }

    // 1. Intent Classification (Simple Keyword / LLM based)
    const intent = classifyIntent(message);

    // 2. State Management - Track journey or create new
    let journeyState = null;
    if (customerPhone) {
      journeyState = await stateMachine.getState(customerPhone);

      // Create journey if first interaction
      if (!journeyState && intent === "inquiry") {
        // Insert new journey directly
        const { data: newJourney, error } = await supabase
          .from("deal_journey_state")
          .insert({
            customer_phone: customerPhone,
            customer_name: customerName || "Anonymous",
            listing_id: listingId,
            thread_id: threadId || `thread_${Date.now()}`,
            state: DealJourneyState.INQUIRY,
            metadata: {
              firstMessage: message,
              source: "negotiator_agent",
            },
          })
          .select()
          .single();

        if (error) {
          console.error("[Negotiator] Failed to create journey:", error);
        } else {
          journeyState = newJourney as any;

          // Emit event
          await eventBus.emitEvent(
            "lead.created",
            "negotiator",
            { customerPhone, listingId, message },
            ["matchmaker"],
          );
        }
      }
    }

    // 3. Routing Logic with State Context
    let systemPrompt = "";
    const currentState = journeyState?.state || "unknown";

    if (intent === "negotiation") {
      systemPrompt = `You are "The Negotiator", a senior sales agent for SK AutoSphere.
        Current deal stage: ${currentState}
        Goal: Close the deal but maximize profit.
        Strategy:
        - Never offer huge discounts. Max $50 off.
        - If asked for more, say "I need to ask my manager".
        - Focus on value (quality, inspection report).
        - If customer agrees to price, guide them to request formal quote.
        - Direct to Stripe/Invoice for payment.`;

      // Transition to negotiation state if not already
      if (customerPhone && currentState === "INQUIRY") {
        await stateMachine.transition(customerPhone, {
          to_state: DealJourneyState.NEGOTIATION,
          triggered_by: "agent",
          agent_name: "negotiator",
          notes: "Customer started price discussion",
        });
      }
    } else if (intent === "quote_request") {
      systemPrompt = `You are a professional sales agent preparing a formal quote.
        Current deal stage: ${currentState}
        - Confirm vehicle details and customer requirements
        - Provide itemized breakdown (vehicle, shipping, insurance)
        - Ask for deposit to secure the vehicle
        - Mention inspection report availability`;

      // Transition to quote state
      if (
        customerPhone &&
        ["NEGOTIATION", "INSPECTION"].includes(currentState)
      ) {
        await stateMachine.transition(customerPhone, {
          to_state: DealJourneyState.QUOTE,
          triggered_by: "agent",
          agent_name: "negotiator",
          notes: "Formal quote requested",
        });

        // Assign task to pricing oracle
        await eventBus.assignTask(
          "generate_quote",
          "pricing_oracle",
          { customerPhone, listingId },
          { priority: 3, requestedBy: "negotiator" },
        );
      }
    } else if (intent === "shipping") {
      systemPrompt = `You are a Logistics Expert. 
        Current deal stage: ${currentState}
        Explain that we ship RoRo to Lagos/Apapa and it takes 35 days.
        If customer is ready, guide them to payment.`;
    } else {
      // Inquiry / General
      systemPrompt = `You are a helpful Sales Assistant for SK AutoSphere.
        Current deal stage: ${currentState}
        - Help the user find the right car
        - Answer questions about features and reliability
        - If they ask for price negotiation, hold firm but friendly
        - Guide serious buyers toward next steps (inspection, quote)`;
    }

    // 4. LLM Generation with context
    const geminiHistory: GeminiChatMessage[] = (history || []).map(
      (msg: any) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }),
    );

    const rawResponse = await chatWithGemini(
      message,
      geminiHistory,
      systemPrompt,
    );

    // 5. Safety Layer Check
    const safetyCheck = FinancialSafetyLayer.checkResponse(rawResponse);

    if (safetyCheck.action === "block") {
      // Log safety violation event
      if (customerPhone) {
        await eventBus
          .emitEvent("safety.violation", "negotiator", {
            customerPhone,
            violations: safetyCheck.violations,
            message,
          })
          .catch((err) =>
            console.error("[Negotiator] Failed to emit safety event:", err),
          );
      }

      return NextResponse.json({
        response:
          "I apologize, but I cannot authorize that request. Please stick to official payment channels and verified condition reports for your safety.",
        violations: safetyCheck.violations,
        source: "safety-layer-block",
      });
    }

    // 6. Update journey metadata with conversation context
    if (customerPhone && journeyState) {
      // Update metadata in database
      await supabase
        .from("deal_journey_state")
        .update({
          metadata: {
            ...journeyState.metadata,
            lastInteraction: new Date().toISOString(),
            lastMessage: message,
            lastIntent: intent,
          },
          last_updated_at: new Date().toISOString(),
        })
        .eq("customer_phone", customerPhone);
    }

    return NextResponse.json({
      response: rawResponse,
      intent,
      currentState: journeyState?.state || null,
      journeyId: journeyState?.id || null,
      safety_status: safetyCheck.action,
      violations: safetyCheck.violations,
    });
  } catch (error: any) {
    console.error("Negotiator Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function classifyIntent(msg: string): AgentIntent {
  const lower = msg.toLowerCase();

  // Quote request
  if (
    lower.includes("quote") ||
    lower.includes("formal price") ||
    lower.includes("invoice")
  ) {
    return "quote_request";
  }

  // Negotiation
  if (
    lower.includes("price") ||
    lower.includes("discount") ||
    lower.includes("offer") ||
    lower.includes("money") ||
    lower.includes("cost")
  ) {
    return "negotiation";
  }

  // Shipping
  if (
    lower.includes("shipping") ||
    lower.includes("port") ||
    lower.includes("arrive") ||
    lower.includes("delivery")
  ) {
    return "shipping";
  }

  // Initial inquiry (interest expressions)
  if (
    lower.includes("interested") ||
    lower.includes("looking for") ||
    lower.includes("want to buy") ||
    lower.includes("hello") ||
    lower.includes("hi")
  ) {
    return "inquiry";
  }

  return "general";
}
