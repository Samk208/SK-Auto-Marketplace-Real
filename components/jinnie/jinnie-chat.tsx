"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Loader2, Send } from "lucide-react"
import { useMemo, useRef, useState } from "react"

type ChatMessage = {
  role: "user" | "assistant"
  content: string
}

export function JinnieChat({ initialContext }: { initialContext?: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi, I’m Jinnie. Ask me anything about buying a car in Korea, registration, insurance, or finding the right model for your budget.",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const endRef = useRef<HTMLDivElement | null>(null)

  const apiHistory = useMemo(
    () =>
      messages
        .filter((m) => m.role !== "assistant" || m.content.trim().length > 0)
        .map((m) => ({ role: m.role === "user" ? "user" : "assistant", content: m.content })),
    [messages]
  )

  const context = initialContext ||
    "You are Jinnie (지니), SK AutoSphere’s multilingual car concierge for Korea. Be concise, practical, and step-by-step. If the user asks about legal/official processes, recommend confirming with relevant government/insurance offices.";

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      endRef.current?.scrollIntoView({ behavior: "smooth" })
    })
  }

  const send = async () => {
    const msg = input.trim()
    if (!msg || isLoading) return

    setInput("")
    setIsLoading(true)

    setMessages((prev) => [...prev, { role: "user", content: msg }])

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msg,
          history: apiHistory.map((m) => ({ role: m.role, content: m.content })),
          context,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || "Failed to get response")
      }

      setMessages((prev) => [...prev, { role: "assistant", content: String(data?.response || "") }])
      scrollToBottom()
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            e instanceof Error
              ? `Sorry — I couldn’t answer that right now. ${e.message}`
              : "Sorry — I couldn’t answer that right now.",
        },
      ])
      scrollToBottom()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Jinnie (지니) – Chat Beta</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-[480px] rounded-md border p-4">
          <div className="space-y-3">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={cn(
                  "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                  m.role === "user"
                    ? "ml-auto bg-[#2558fa] text-white"
                    : "mr-auto bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50"
                )}
              >
                {m.content}
              </div>
            ))}
            {isLoading && (
              <div className="mr-auto inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-900 dark:bg-slate-800 dark:text-slate-50">
                <Loader2 className="h-4 w-4 animate-spin" />
                Thinking...
              </div>
            )}
            <div ref={endRef} />
          </div>
        </ScrollArea>

        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                void send()
              }
            }}
            placeholder="Ask about registration, insurance, recommended cars, etc."
          />
          <Button onClick={() => void send()} disabled={isLoading || input.trim().length === 0}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
