// src/lib/atms.ts
// Shared fetch helper for all ATMS /api/v1/* calls from portal route handlers.
// Automatically attaches Authorization (system API key) and X-Client-User-Id headers.
// Must only be used server-side (API routes / Server Components).

const ATMS_BASE_URL = process.env.ATMS_BASE_URL!;
const ATMS_API_KEY = process.env.ATMS_API_KEY!;

/**
 * Wraps fetch for ATMS client-scoped API calls.
 *
 * @param path          - ATMS path, e.g. `/api/v1/clients/${clientId}/employees`
 * @param clientUserId  - The ClientUser.id stored in the `session-user-id` cookie
 * @param options       - Optional RequestInit overrides (method, body, extra headers, etc.)
 */
export function atmsRequest(
  path: string,
  clientUserId: string,
  options?: RequestInit
): Promise<Response> {
  return fetch(`${ATMS_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ATMS_API_KEY}`,
      'X-Client-User-Id': clientUserId,
      ...(options?.headers ?? {}),
    },
  });
}

/**
 * Reads the portal session cookies from a NextRequest and returns the
 * clientUserId and selectedClient values needed for ATMS requests.
 *
 * Usage in a route handler:
 *   import { getPortalSession } from '@/lib/atms';
 *   const session = getPortalSession(request);
 *   if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
 */
export function getPortalSession(request: { cookies: { get: (name: string) => { value: string } | undefined } }): {
  clientUserId: string;
  selectedClient: {
    clientId: string | number;
    businessName: string;
    portalName?: string;
    companyCode?: string;
    clientNo?: string;
    businessEntity?: string;
    branchType?: string;
    logoUrl?: string | null;
    role?: string;
  };
} | null {
  const clientUserId = request.cookies.get('session-user-id')?.value;
  const selectedClientRaw = request.cookies.get('selected-client')?.value;

  if (!clientUserId || !selectedClientRaw) return null;

  try {
    const selectedClient = JSON.parse(selectedClientRaw) as {
      clientId: string | number;
      businessName: string;
      portalName?: string;
      companyCode?: string;
      clientNo?: string;
      businessEntity?: string;
      branchType?: string;
      logoUrl?: string | null;
      role?: string;
    };
    return { clientUserId, selectedClient };
  } catch {
    return null;
  }
}
