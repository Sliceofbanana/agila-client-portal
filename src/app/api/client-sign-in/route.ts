// src/app/api/client-sign-in/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const parsed = signInSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
  }

  const atmsBaseUrl = process.env.ATMS_BASE_URL;
  if (!atmsBaseUrl) {
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }

  try {
    // Step 1 — Login to ATMS
    const loginRes = await fetch(`${atmsBaseUrl}/api/client-auth/sign-in/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': atmsBaseUrl,
      },
      body: JSON.stringify(parsed.data),
    });

    const loginData = await loginRes.json() as { user?: { id: string; name: string; email: string }; error?: string };

    if (!loginRes.ok) {
      return NextResponse.json(
        { error: loginData.error ?? 'Invalid email or password.' },
        { status: loginRes.status }
      );
    }

    const user = loginData.user!;

    const response = NextResponse.json({ user });

    // Set portal cookies first via cookies.set() which manages its own Set-Cookie header.
    // The ATMS session cookie is appended AFTER so it is never overwritten —
    // cookies.set() internally calls headers.set() which would replace the entire header.
    response.cookies.set('session-user-id', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8, // 8 hours
    });

    response.cookies.set('session-user-name', user.name, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8, // 8 hours
    });

    // Append the ATMS session cookie(s) after portal cookies are committed.
    // Use getSetCookie() to get each Set-Cookie header as a proper array
    // (avoids the comma-joining bug of headers.get('set-cookie') with multiple values).
    const atmsSetCookies: string[] =
      typeof loginRes.headers.getSetCookie === 'function'
        ? loginRes.headers.getSetCookie()
        : (() => { const raw = loginRes.headers.get('set-cookie'); return raw ? [raw] : []; })();

    for (const cookie of atmsSetCookies) {
      response.headers.append('set-cookie', cookie);
    }

    return response;
  } catch {
    return NextResponse.json({ error: 'Unable to reach authentication server.' }, { status: 502 });
  }
}
