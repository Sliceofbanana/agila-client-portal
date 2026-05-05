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
  const atmsApiKey = process.env.ATMS_API_KEY;
  if (!atmsBaseUrl || !atmsApiKey) {
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }

  try {
    // Step 1 — Login to ATMS
    const loginRes = await fetch(`${atmsBaseUrl}/api/client-auth/sign-in/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed.data),
      // Note: credentials: "include" is browser-only — not valid in Node.js fetch.
      // The ATMS session cookie is captured via loginRes.headers.get('set-cookie') below.
    });

    const loginData = await loginRes.json() as { user?: { id: string; name: string; email: string }; error?: string };

    if (!loginRes.ok) {
      return NextResponse.json(
        { error: loginData.error ?? 'Invalid email or password.' },
        { status: loginRes.status }
      );
    }

    const user = loginData.user!;

    // Step 2 — Fetch assigned clients for this user
    const clientsRes = await fetch(
      `${atmsBaseUrl}/api/v1/clients?clientUserId=${user.id}`,
      {
        headers: { Authorization: `Bearer ${atmsApiKey}` },
      }
    );

    if (!clientsRes.ok) {
      return NextResponse.json({ error: 'Failed to load client accounts.' }, { status: 502 });
    }

    const clientsData = await clientsRes.json() as { data?: unknown[] };

    const response = NextResponse.json({ user, clients: clientsData.data ?? clientsData });

    // Forward the ATMS session cookie to the browser so session checks work
    const setCookie = loginRes.headers.get('set-cookie');
    if (setCookie) {
      response.headers.set('set-cookie', setCookie);
    }

    return response;
  } catch {
    return NextResponse.json({ error: 'Unable to reach authentication server.' }, { status: 502 });
  }
}
