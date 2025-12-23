/**
 * Supabase Auth Callback Handler
 * 
 * Handles OAuth and email verification callbacks from Supabase Auth.
 * This route exchanges auth codes for sessions.
 */

import { createSupabaseServerActionClient } from '@/lib/auth/supabase-auth-server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const next = requestUrl.searchParams.get('next') || '/';
    const error = requestUrl.searchParams.get('error');
    const error_description = requestUrl.searchParams.get('error_description');

    // Handle error from auth provider
    if (error) {
        console.error('[Auth Callback] Error from provider:', error, error_description);
        return NextResponse.redirect(
            new URL(`/auth/error?error=${encodeURIComponent(error_description || error)}`, requestUrl.origin)
        );
    }

    // No code provided
    if (!code) {
        console.warn('[Auth Callback] No code provided');
        return NextResponse.redirect(new URL('/', requestUrl.origin));
    }

    try {
        const supabase = await createSupabaseServerActionClient();

        // Exchange code for session
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) {
            console.error('[Auth Callback] Code exchange failed:', exchangeError);
            return NextResponse.redirect(
                new URL(`/auth/error?error=${encodeURIComponent(exchangeError.message)}`, requestUrl.origin)
            );
        }

        console.log('[Auth Callback] Session exchanged successfully, redirecting to:', next);

        // Redirect to the intended destination
        return NextResponse.redirect(new URL(next, requestUrl.origin));
    } catch (err) {
        console.error('[Auth Callback] Unexpected error:', err);
        return NextResponse.redirect(
            new URL('/auth/error?error=An%20unexpected%20error%20occurred', requestUrl.origin)
        );
    }
}
