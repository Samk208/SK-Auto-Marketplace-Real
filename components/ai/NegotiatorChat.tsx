"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Send, Shield } from "lucide-react";
import { useState } from "react";

interface Message {
  role: "user" | "model";
  content: string;
  safetyStatus?: "safe" | "blocked" | "flagged";
}

export function NegotiatorChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      content:
        "Hello! I am The Negotiator. I can help you find the best deals on Korean cars. How can I assist you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [safetyActive, setSafetyActive] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setSafetyActive(true); // Start safety scan animation

    try {
      const res = await fetch("/api/ai/negotiator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content, history: messages }),
      });
      const data = await res.json();

      // Simulate "Thinking" delay for effect
      await new Promise((r) => setTimeout(r, 1500));

      setSafetyActive(false);
      setIsTyping(false);

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          { role: "model", content: "System Error: " + data.error },
        ]);
        return;
      }

      const botMsg: Message = {
        role: "model",
        content: data.response,
        safetyStatus: data.safety_status === "block" ? "blocked" : "safe",
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (e) {
      setIsTyping(false);
      setSafetyActive(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] w-full max-w-md bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative">
      {/* Header */}
      <div className="bg-slate-50 dark:bg-slate-950 p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <h3 className="font-semibold text-sm">The Negotiator</h3>
        </div>

        {/* Safety Indicator */}
        <motion.div
          animate={
            safetyActive ? { scale: [1, 1.2, 1], opacity: 1 } : { opacity: 0.5 }
          }
          transition={{ repeat: safetyActive ? Infinity : 0, duration: 1 }}
          className="flex items-center gap-1 text-xs text-blue-500"
        >
          <Shield size={14} />
          {safetyActive ? "Scanning..." : "Active"}
        </motion.div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "max-w-[85%] p-3 rounded-lg text-sm",
              m.role === "user"
                ? "bg-blue-600 text-white ml-auto rounded-tr-none"
                : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none",
              m.safetyStatus === "blocked" &&
                "border-2 border-red-500 bg-red-50 dark:bg-red-900/10",
            )}
          >
            {m.content}
            {m.safetyStatus === "blocked" && (
              <div className="flex items-center gap-1 text-red-500 text-xs mt-2 font-bold">
                <Shield size={12} /> BLOCKED BY SAFETY LAYER
              </div>
            )}
          </motion.div>
        ))}
        {isTyping && (
          <div className="text-xs text-slate-400 italic">
            Negotiator is typing...
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex gap-2">
        <input
          className="flex-1 bg-transparent text-sm outline-none"
          placeholder="Ask for a discount..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="p-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
