// src/app/api/portal-session/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const userName = request.cookies.get('session-user-name')?.value ?? null;
  const selectedClientRaw = request.cookies.get('selected-client')?.value ?? null;

  let clientName: string | null = null;
  let clientId: string | number | null = null;
  let companyCode: string | null = null;
  let clientNo: string | null = null;
  let businessEntity: string | null = null;
  let branchType: string | null = null;

  if (selectedClientRaw) {
    try {
      const client = JSON.parse(selectedClientRaw) as {
        clientId?: string | number;
        businessName: string;
        portalName?: string;
        companyCode?: string;
        clientNo?: string;
        businessEntity?: string;
        branchType?: string;
      };
      clientName = client.portalName ?? client.businessName ?? null;
      clientId = client.clientId ?? null;
      companyCode = client.companyCode ?? null;
      clientNo = client.clientNo ?? null;
      businessEntity = client.businessEntity ?? null;
      branchType = client.branchType ?? null;
    } catch {
      clientName = null;
    }
  }

  return NextResponse.json({ clientName, userName, clientId, companyCode, clientNo, businessEntity, branchType });
}
