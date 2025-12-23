'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CheckCircle2, Loader2, Mail } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'; // Assuming sonner is used, or we can use basic alert/state

export function NewsletterSignup() {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const res = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Failed to subscribe')
            }

            setIsSuccess(true)
            setEmail('')
            toast.success(data.message)
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message)
            } else {
                toast.error("Something went wrong. Please try again.")
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#2558fa] via-[#4f7aff] to-[#7c9dff] px-6 py-12 shadow-2xl sm:px-12 sm:py-16">
            {/* Plus Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-grid-plus-white opacity-10 pointer-events-none" />

            {/* Abstract Shapes */}
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -left-24 -bottom-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

            <div className="relative z-10 mx-auto max-w-2xl text-center">
                {!isSuccess ? (
                    <>
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-white shadow-inner backdrop-blur-sm ring-1 ring-white/20">
                            <Mail className="h-8 w-8" />
                        </div>
                        <h2 className="mt-8 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Get intelligence delivered to your inbox
                        </h2>
                        <p className="mt-4 text-lg leading-relaxed text-slate-300">
                            Join 8,000+ dealers and logistics pros receiving our weekly digest on Korean vehicle sourcing, pricing trends, and shipping updates.
                        </p>
                        <form onSubmit={handleSubmit} className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                            <Input
                                type="email"
                                placeholder="Enter your work email"
                                className="h-14 min-w-0 flex-auto rounded-full border-white/20 bg-white/5 px-6 text-lg text-white placeholder:text-slate-400 focus-visible:ring-primary/50 sm:max-w-xs transition-all hover:bg-white/10"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                data-1p-ignore
                            />
                            <Button
                                type="submit"
                                size="lg"
                                className="h-14 w-full rounded-full px-8 text-base font-semibold shadow-lg shadow-primary/25 sm:w-auto"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Subscribing...
                                    </>
                                ) : (
                                    'Subscribe Free'
                                )}
                            </Button>
                        </form>
                        <p className="mt-6 text-xs text-slate-400">
                            Zero spam. Focused market intelligence. Unsubscribe at any time.
                        </p>
                    </>
                ) : (
                    <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20 text-green-400 shadow-lg ring-1 ring-green-500/40">
                            <CheckCircle2 className="h-10 w-10" />
                        </div>
                        <h2 className="mt-6 text-3xl font-bold text-white">You're on the list!</h2>
                        <p className="mt-4 text-slate-300">
                            Check your inbox for our latest market report.
                        </p>
                        <Button
                            variant="link"
                            className="mt-6 text-white/60 hover:text-white"
                            onClick={() => setIsSuccess(false)}
                        >
                            Add another email
                        </Button>
                    </div>
                )}
            </div>
        </section>
    )
}
