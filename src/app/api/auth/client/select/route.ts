// src/app/api/auth/client/select/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const selectSchema = z.object({
  clientId: z.string().min(1),
  businessName: z.string().min(1),
  portalName: z.string().optional(),
  companyCode: z.string().optional(),
  role: z.string().optional(),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const parsed = selectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'clientId and businessName are required.' }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true });

  response.cookies.set('atms_selected_client', JSON.stringify(parsed.data), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8, // 8 hours
  });

  return response;
}
