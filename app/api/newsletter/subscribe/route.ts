import { supabaseServer } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const subscribeSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
})

export async function POST(req: Request) {
    try {
        const json = await req.json()
        const result = subscribeSchema.safeParse(json)

        if (!result.success) {
            return NextResponse.json(
                { error: result.error.errors[0].message },
                { status: 400 }
            )
        }

        const { email } = result.data

        // Check if email already exists
        const { data: existing } = await supabaseServer
            .from('newsletter_subscribers')
            .select('id')
            .eq('email', email)
            .single()

        if (existing) {
            return NextResponse.json(
                { message: 'You are already subscribed!' },
                { status: 200 }
            )
        }

        // Insert new subscriber
        const { error } = await supabaseServer
            .from('newsletter_subscribers')
            .insert({
                email,
                source: 'blog_footer',
                status: 'active',
                subscribed_at: new Date().toISOString(),
            })

        if (error) {
            console.error('Newsletter subscription error:', error)
            return NextResponse.json(
                { error: 'Failed to subscribe. Please try again later.' },
                { status: 500 }
            )
        }

        return NextResponse.json(
            { message: 'Successfully subscribed to the newsletter!' },
            { status: 201 }
        )
    } catch (error) {
        console.error('Newsletter subscription error:', error)
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        )
    }
}
