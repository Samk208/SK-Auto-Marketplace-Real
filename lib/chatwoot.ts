export type ChatwootConfig = {
  baseUrl: string;
  accountId: string;
  apiAccessToken: string;
};

export type ChatwootCreateConversationInput = {
  inboxId: number;
  sourceId: string;
  contact: {
    phone_number: string;
    name?: string;
  };
  content: string;
  customAttributes?: Record<string, unknown>;
};

export async function createChatwootConversation(
  config: ChatwootConfig,
  input: ChatwootCreateConversationInput,
): Promise<{ conversationId: number; url?: string }> {
  const url = `${config.baseUrl.replace(/\/$/, "")}/api/v1/accounts/${config.accountId}/conversations`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      api_access_token: config.apiAccessToken,
    },
    body: JSON.stringify({
      inbox_id: input.inboxId,
      source_id: input.sourceId,
      contact: {
        phone_number: input.contact.phone_number,
        name: input.contact.name,
      },
      message: {
        content: input.content,
        message_type: "incoming",
      },
      custom_attributes: input.customAttributes || {},
    }),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      data && (data.message || data.error || data.errors)
        ? JSON.stringify(data)
        : `Chatwoot request failed with status ${res.status}`;
    throw new Error(message);
  }

  const conversationId =
    typeof data?.id === "number"
      ? data.id
      : typeof data?.conversation?.id === "number"
        ? data.conversation.id
        : null;

  if (!conversationId) {
    throw new Error("Chatwoot response did not include conversation id");
  }

  const conversationUrl =
    config.baseUrl && conversationId
      ? `${config.baseUrl.replace(/\/$/, "")}/app/accounts/${config.accountId}/conversations/${conversationId}`
      : undefined;

  return { conversationId, url: conversationUrl };
}
