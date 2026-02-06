/**
 * Next.js Middleware for Supabase Auth
 *
 * This middleware refreshes the Supabase session and ensures
 * auth cookies are properly maintained across requests.
 *
 * CRITICAL for Supabase SSR in Next.js 15!
 */

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // 1. Create an initial response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 2. Track cookies that need to be set on the response
  // We do this because creating a new NextResponse (which we might do)
  // resets the Set-Cookie headers.
  const cookiesToSet: {
    name: string;
    value: string;
    options: CookieOptions;
  }[] = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // Update request cookies (for the server/downstream)
          request.cookies.set({
            name,
            value,
            ...options,
          });
          // Track for response (for the browser)
          cookiesToSet.push({ name, value, options });
        },
        remove(name: string, options: CookieOptions) {
          // Update request cookies (for the server/downstream)
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          // Track for response (for the browser)
          cookiesToSet.push({ name, value: "", options });
        },
      },
    },
  );

  // 3. Refresh session if expired
  // This will trigger the 'set'/'remove' methods above if the session is refreshed
  await supabase.auth.getUser();

  // 4. Create the final response
  // We recreate it to ensure it has the latest request headers (including updated cookies)
  response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 5. Apply all tracked cookies to the response
  cookiesToSet.forEach(({ name, value, options }) => {
    response.cookies.set({
      name,
      value,
      ...options,
    });
  });

  return response;
}

// Apply middleware to all routes EXCEPT static files and _next internals
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
