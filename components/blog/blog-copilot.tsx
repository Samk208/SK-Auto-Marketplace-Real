'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { Bot, Send, Sparkles } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface Message {
    role: 'user' | 'model'
    text: string
}

export function BlogCopilot() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'model',
            text: 'Hi! I’m the Blog Copilot. Ask me anything about exporting Korean cars, shipping logistics, or our latest market insights.',
        },
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return

        const userMsg = input.trim()
        setInput('')
        setMessages((prev) => [...prev, { role: 'user', text: userMsg }])
        setIsLoading(true)

        try {
            // Prepare history for API (excluding the initial greeting if needed, or map it)
            const historyForApi = messages
                .filter(m => m.role !== 'model' || m.text !== messages[0].text) // optional filter
                .map(m => ({
                    role: m.role,
                    parts: [{ text: m.text }]
                }))

            const res = await fetch('/api/blog/copilot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg, history: historyForApi }),
            })

            const data = await res.json()

            if (!res.ok) throw new Error(data.error)

            setMessages((prev) => [...prev, { role: 'model', text: data.response }])
        } catch (error) {
            console.error(error)
            setMessages((prev) => [
                ...prev,
                { role: 'model', text: 'Sorry, I encountered a temporary error. Please try again.' },
            ])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            {/* Floating Trigger */}
            <div className="fixed bottom-6 right-6 z-40">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button
                            size="lg"
                            className="h-14 w-14 rounded-full shadow-2xl transition-transform hover:scale-105 hover:shadow-primary/25"
                        >
                            <Sparkles className="h-6 w-6" />
                            <span className="sr-only">Ask Blog Copilot</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-full border-l-slate-200 bg-slate-50 p-0 dark:border-slate-800 dark:bg-slate-950 sm:max-w-md">
                        <div className="flex h-full flex-col">
                            <SheetHeader className="border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <Bot className="h-5 w-5" />
                                    </div>
                                    <SheetTitle className="text-left">Blog Copilot</SheetTitle>
                                </div>
                            </SheetHeader>

                            <div className="flex-1 overflow-y-auto p-4" ref={scrollRef}>
                                <div className="space-y-4">
                                    {messages.map((msg, i) => (
                                        <div
                                            key={i}
                                            className={cn(
                                                "flex w-max max-w-[85%] flex-col gap-2 rounded-2xl px-4 py-3 text-sm",
                                                msg.role === 'user'
                                                    ? "ml-auto bg-primary text-primary-foreground"
                                                    : "bg-white text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-300"
                                            )}
                                        >
                                            <div className="prose prose-sm dark:prose-invert">
                                                {/* Simple markdown rendering can be added here or just text */}
                                                {msg.text}
                                            </div>
                                        </div>
                                    ))}
                                    {isLoading && (
                                        <div className="flex w-max items-center gap-2 rounded-2xl bg-white px-4 py-3 text-slate-500 shadow-sm dark:bg-slate-900">
                                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="border-t border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                                <form onSubmit={handleSend} className="relative flex items-center">
                                    <Input
                                        placeholder="Ask about shipping, prices, or guides..."
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        className="h-12 rounded-full border-slate-200 bg-slate-50 pr-12 focus-visible:ring-primary/50 dark:border-slate-800 dark:bg-slate-950"
                                        disabled={isLoading}
                                    />
                                    <Button
                                        type="submit"
                                        size="icon"
                                        disabled={!input.trim() || isLoading}
                                        className="absolute right-1 top-1 h-10 w-10 rounded-full"
                                    >
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </>
    )
}
