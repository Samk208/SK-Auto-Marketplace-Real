import { supabaseServer } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params

    const { error } = await supabaseServer.rpc('increment_blog_view', { view_slug: slug })

    if (error) {
        console.error('Error incrementing view:', error)
        return NextResponse.json({ error: 'Failed to track view' }, { status: 500 })
    }
    return NextResponse.json({ success: true })
}

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const { data, error } = await supabaseServer
        .from('blog_views')
        .select('count')
        .eq('slug', slug)
        .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.error('Error fetching view count:', error)
    }

    return NextResponse.json({ views: data?.count ?? 0 })
}
