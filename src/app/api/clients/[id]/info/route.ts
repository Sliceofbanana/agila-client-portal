// src/app/api/clients/[id]/info/route.ts
//
// GET  /api/clients/{id}/info  — Proxy to ATMS GET /api/v1/clients/{id}/info
// PATCH /api/clients/{id}/info — Proxy to ATMS PATCH /api/v1/clients/{id}/info
//
// Auth: requires valid portal session cookies (session-user-id + selected-client)

import { NextRequest, NextResponse } from 'next/server';
import { atmsRequest, getPortalSession } from '@/lib/atms';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  const session = getPortalSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const { clientUserId } = session;

  const res = await atmsRequest(`/api/v1/clients/${id}/info`, clientUserId);
  const data: unknown = await res.json();

  return NextResponse.json(data, { status: res.status });
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  const session = getPortalSession(request);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const { clientUserId } = session;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const res = await atmsRequest(`/api/v1/clients/${id}/info`, clientUserId, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
  const data: unknown = await res.json();

  return NextResponse.json(data, { status: res.status });
}
