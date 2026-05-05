// src/app/api/client-sign-out/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const atmsBaseUrl = process.env.ATMS_BASE_URL;
  const atmsApiKey = process.env.ATMS_API_KEY;
  if (!atmsBaseUrl || !atmsApiKey) {
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }

  const userId = request.cookies.get('session-user-id')?.value;

  try {
    if (userId) {
      // Invalidates ALL sessions for this user — no cookie forwarding needed
      await fetch(`${atmsBaseUrl}/api/v1/auth/sign-out`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${atmsApiKey}`,
        },
        body: JSON.stringify({ userId }),
      });
    }
  } catch {
    // Best-effort — still clear local cookies even if ATMS is unreachable
  }

  const response = NextResponse.json({ ok: true });

  // Clear all portal cookies
  const cookieClearOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 0,
  };

  response.cookies.set('better-auth.session_token', '', cookieClearOptions);
  response.cookies.set('selected-client', '', cookieClearOptions);
  response.cookies.set('session-user-id', '', cookieClearOptions);
  response.cookies.set('session-user-name', '', cookieClearOptions);

  return response;
}
