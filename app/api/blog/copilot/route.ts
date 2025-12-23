import { chatWithGemini } from '@/lib/gemini'
import { supabaseServer } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const { message, history } = await req.json()

        // 1. Fetch posts from Supabase to build the context index
        const { data: posts } = await supabaseServer
            .from('blog_posts')
            .select('title, slug, summary, published_at, blog_post_tags(blog_tags(name))')
            .eq('status', 'published')
            .order('published_at', { ascending: false })
            .limit(50) // Limit context to recent 50 posts to avoid huge prompts

        // 2. Build a lightweight index of the blog
        const blogIndex = (posts || []).map(p => {
            // Extract tags safely
            const tags = p.blog_post_tags?.map((pt: any) => pt.blog_tags?.name).filter(Boolean).join(', ') || ''

            return `
      - Title: ${p.title} (/blog/${p.slug})
      - Summary: ${p.summary}
      - Tags: ${tags}
      - Published: ${p.published_at}
    `}).join('\n')

        // 3. Construct a specialized prompt
        // We inject this as the user's "context" wrapper for the query
        const augmentedQuery = `
      [SYSTEM: You are the SK AutoSphere Blog Assistant. Use the following article index to answer the user's question. If the answer is in an article, explicitly recommend it by title and path.]

      BLOG INDEX:
      ${blogIndex}

      USER QUESTION:
      ${message}
    `

        // 4. Call Gemini
        // We pass the previous history if available.

        // Limit history to last 4 turns to avoid token limits
        const safeHistory = Array.isArray(history) ? history.slice(-4) : []

        const responseText = await chatWithGemini(augmentedQuery, safeHistory)

        return NextResponse.json({ response: responseText })
    } catch (error) {
        console.error('Blog Copilot Error:', error)
        return NextResponse.json(
            { error: 'Failed to process your request.' },
            { status: 500 }
        )
    }
}
