// src/app/api/auth/client/sign-in/route.ts
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
    const atmsRes = await fetch(`${atmsBaseUrl}/api/client-auth/sign-in/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed.data),
      // Note: credentials: "include" is browser-only — not valid in Node.js fetch.
      // The ATMS session cookie is captured via atmsRes.headers.get('set-cookie') below.
    });

    const data = await atmsRes.json() as { user?: { id: string; name: string; email: string }; error?: string };

    if (!atmsRes.ok) {
      return NextResponse.json(
        { error: data.error ?? 'Invalid email or password.' },
        { status: atmsRes.status }
      );
    }

    const response = NextResponse.json({ user: data.user });

    // Forward the ATMS session cookie to the browser so session checks work
    const setCookie = atmsRes.headers.get('set-cookie');
    if (setCookie) {
      response.headers.set('set-cookie', setCookie);
    }

    return response;
  } catch {
    return NextResponse.json({ error: 'Unable to reach authentication server.' }, { status: 502 });
  }
}
