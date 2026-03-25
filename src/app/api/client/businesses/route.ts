// src/app/api/client/businesses/route.ts
import { NextResponse } from 'next/server';
import { MOCK_GATEWAY_CLIENTS } from '@/lib/mock-client-gateway-data';

// TODO: Replace with real DB query after auth.ts and db.ts are configured.
// Expected implementation:
//   const session = await auth.api.getSession({ headers: await headers() });
//   if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   const rows = await prisma.clientUser.findMany({
//     where: { userId: session.user.id },
//     include: { client: { include: { servicePlan: true } } },
//   });
//   const businesses = rows.map(r => ({
//     id: r.client.companyCode,
//     name: r.client.companyName,
//     type: r.client.type,
//     plan: r.client.servicePlan?.name ?? 'Starter',
//   }));
//   return NextResponse.json({ businesses });

export async function GET() {
  const businesses = MOCK_GATEWAY_CLIENTS
    .filter((c) => c.status === 'Active')
    .map((c) => ({
      id: c.companyCode,
      name: c.businessName,
      type: c.businessType === 'Sole Proprietorship' ? 'sole_proprietor' : 'professional',
      plan: c.servicePlan,
    }));

  return NextResponse.json({ businesses });
}
