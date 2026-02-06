import { createChatwootConversation } from "@/lib/chatwoot";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function isAuthorized(request: NextRequest) {
  const expected = process.env.SUPPORT_INTERNAL_TOKEN;
  if (!expected) return false;
  const provided = request.headers.get("x-internal-token");
  return provided === expected;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return NextResponse.json(
        { error: "Supabase server credentials are not configured" },
        { status: 500 },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const body = await request.json();
    const {
      phone_number,
      customer_name,
      message,
      escalation_reason,
      source_id,
      chatwoot_inbox_id,
    } = body as {
      phone_number?: string;
      customer_name?: string;
      message?: string;
      escalation_reason?: string;
      source_id?: string;
      chatwoot_inbox_id?: number;
    };

    if (!phone_number || !message) {
      return NextResponse.json(
        { error: "phone_number and message are required" },
        { status: 400 },
      );
    }

    const chatwootBaseUrl = process.env.CHATWOOT_BASE_URL;
    const chatwootAccountId = process.env.CHATWOOT_ACCOUNT_ID;
    const chatwootApiAccessToken = process.env.CHATWOOT_API_ACCESS_TOKEN;

    if (!chatwootBaseUrl || !chatwootAccountId || !chatwootApiAccessToken) {
      return NextResponse.json(
        { error: "Chatwoot is not configured" },
        { status: 500 },
      );
    }

    const inboxIdEnv = process.env.CHATWOOT_INBOX_ID;
    const inboxId =
      typeof chatwoot_inbox_id === "number"
        ? chatwoot_inbox_id
        : inboxIdEnv
          ? Number(inboxIdEnv)
          : NaN;

    if (!Number.isFinite(inboxId)) {
      return NextResponse.json(
        { error: "Chatwoot inbox id is not configured" },
        { status: 500 },
      );
    }

    const upsertRes = await supabase
      .from("whatsapp_sessions")
      .upsert(
        {
          phone_number,
          customer_name: customer_name || null,
          status: "human_escalated",
          mode: "human",
          escalated_at: new Date().toISOString(),
          escalation_reason: escalation_reason || "unknown",
        },
        { onConflict: "phone_number" },
      )
      .select("*")
      .single();

    if (upsertRes.error || !upsertRes.data) {
      return NextResponse.json(
        { error: upsertRes.error?.message || "Failed to upsert session" },
        { status: 500 },
      );
    }

    const session = upsertRes.data as { id: string };

    const { conversationId, url } = await createChatwootConversation(
      {
        baseUrl: chatwootBaseUrl,
        accountId: chatwootAccountId,
        apiAccessToken: chatwootApiAccessToken,
      },
      {
        inboxId,
        sourceId: source_id || phone_number,
        contact: {
          phone_number,
          name: customer_name,
        },
        content: message,
        customAttributes: {
          session_id: session.id,
          escalation_reason: escalation_reason || "unknown",
          channel: "whatsapp",
        },
      },
    );

    const updateRes = await supabase
      .from("whatsapp_sessions")
      .update({
        chatwoot_conversation_id: String(conversationId),
      })
      .eq("id", session.id);

    if (updateRes.error) {
      return NextResponse.json(
        {
          error: "Escalated but failed to store chatwoot conversation id",
          detail: updateRes.error.message,
          chatwoot_conversation_id: String(conversationId),
          chatwoot_url: url,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      session_id: session.id,
      mode: "human",
      chatwoot_conversation_id: String(conversationId),
      chatwoot_url: url,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
