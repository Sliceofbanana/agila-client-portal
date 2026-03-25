// src/proxy.ts
import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export function proxy(request: NextRequest) {
  // Skip auth in development so the dev bypass button works without ATMS running.
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next();
  }

  const sessionCookie = getSessionCookie(request);

  // THIS IS NOT SECURE on its own — optimistic redirect only.
  // Real DB-backed session validation is handled in each layout via auth.api.getSession().
  if (!sessionCookie) {
    const { pathname, search } = request.nextUrl;
    const callbackUrl = encodeURIComponent(pathname + search);
    return NextResponse.redirect(
      new URL(`/sign-in?callbackUrl=${callbackUrl}`, request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/portal/:path*",
    "/select-business",
    // Dynamic client business routes — matches /DCGM-001, /ADS-002, etc.
    // Excludes Next.js internals, static files, and known public routes.
    "/((?!sign-in|sign-up|register-account|forget-password|reset-password|api|_next|favicon.ico|images).*)",
  ],
};
