// src/app/api/auth/client/clients/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const atmsBaseUrl = process.env.ATMS_BASE_URL;
  const atmsApiKey = process.env.ATMS_API_KEY;

  if (!atmsBaseUrl || !atmsApiKey) {
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }

  const clientUserId = request.nextUrl.searchParams.get('clientUserId');
  if (!clientUserId) {
    return NextResponse.json({ error: 'clientUserId is required.' }, { status: 400 });
  }

  try {
    const atmsRes = await fetch(
      `${atmsBaseUrl}/api/v1/clients?clientUserId=${encodeURIComponent(clientUserId)}`,
      {
        headers: { Authorization: `Bearer ${atmsApiKey}` },
      }
    );

    const data = await atmsRes.json() as { data?: unknown; error?: string };

    if (!atmsRes.ok) {
      return NextResponse.json(
        { error: data.error ?? 'Failed to fetch assigned clients.' },
        { status: atmsRes.status }
      );
    }

    return NextResponse.json({ data: data.data });
  } catch {
    return NextResponse.json({ error: 'Unable to reach ATMS server.' }, { status: 502 });
  }
}
