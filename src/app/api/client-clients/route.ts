// src/app/api/client-clients/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const clientUserId = request.nextUrl.searchParams.get('clientUserId');
  if (!clientUserId) {
    return NextResponse.json({ error: 'clientUserId is required.' }, { status: 400 });
  }

  const atmsBaseUrl = process.env.ATMS_BASE_URL;
  const atmsApiKey = process.env.ATMS_API_KEY;
  if (!atmsBaseUrl || !atmsApiKey) {
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }

  try {
    const res = await fetch(
      `${atmsBaseUrl}/api/v1/clients?clientUserId=${encodeURIComponent(clientUserId)}`,
      { headers: { Authorization: `Bearer ${atmsApiKey}` } }
    );

    const json: unknown = await res.json();

    if (!res.ok) {
      const msg = (json as { error?: string }).error ?? 'Failed to fetch clients.';
      return NextResponse.json({ error: msg }, { status: res.status });
    }

    // Normalize: support both { data: [...] } and bare array responses
    const data = Array.isArray(json) ? json : (json as { data?: unknown[] }).data ?? [];
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: 'Unable to reach authentication server.' }, { status: 502 });
  }
}
