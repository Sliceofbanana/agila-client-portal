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

    // Forward the ATMS session cookie to the browser so session checks work
    const setCookie = loginRes.headers.get('set-cookie');
    if (setCookie) {
      response.headers.set('set-cookie', setCookie);
    }

    // Store userId in an HttpOnly cookie for use in the sign-out proxy
    response.cookies.set('session-user-id', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8, // 8 hours
    });

    // Store user name for display in the portal UI
    response.cookies.set('session-user-name', user.name, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8, // 8 hours
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Unable to reach authentication server.' }, { status: 502 });
  }
}
