// src/app/(auth)/select-client/components/ClientSelector.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Building2, ChevronRight, AlertCircle } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface AssignedClient {
  id: string;
  businessName: string;
  portalName?: string;
  companyCode?: string;
  role?: string;
  active?: boolean;
}

export default function ClientSelector(): React.ReactNode {
  const router = useRouter();
  const params = useSearchParams();
  const { error: showError } = useToast();

  const userId = params.get('userId');

  const [clients, setClients] = useState<AssignedClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      router.replace('/sign-in');
      return;
    }

    async function fetchClients() {
      try {
        const res = await fetch(`/api/auth/client/clients?clientUserId=${encodeURIComponent(userId!)}`, {
          credentials: 'include',
        });
        const json = await res.json() as { data?: AssignedClient[]; error?: string };

        if (!res.ok) {
          showError('Failed to load clients', json.error ?? 'Please try signing in again.');
          router.replace('/sign-in');
          return;
        }

        const active = (json.data ?? []).filter(c => c.active !== false);

        if (active.length === 0) {
          showError('No clients assigned', 'Your account has no active clients. Please contact support.');
          router.replace('/sign-in');
          return;
        }

        // Skip picker if only one client
        if (active.length === 1) {
          await selectClient(active[0]);
          return;
        }

        setClients(active);
      } catch {
        showError('Network error', 'Could not fetch your clients. Please try again.');
        router.replace('/sign-in');
      } finally {
        setLoading(false);
      }
    }

    void fetchClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  async function selectClient(client: AssignedClient) {
    setSelecting(client.id);
    try {
      const res = await fetch('/api/auth/client/select', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: client.id,
          businessName: client.businessName,
          portalName: client.portalName,
          companyCode: client.companyCode,
          role: client.role,
        }),
        credentials: 'include',
      });

      if (!res.ok) {
        const json = await res.json() as { error?: string };
        showError('Selection failed', json.error ?? 'Please try again.');
        setSelecting(null);
        return;
      }

      router.push('/dashboard');
    } catch {
      showError('Network error', 'Could not complete selection. Please try again.');
      setSelecting(null);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-3 text-slate-500">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-sm">Loading your clients…</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold text-slate-800">Select a Client</h1>
        <p className="mt-1 text-sm text-slate-500">
          Choose the client account you want to manage.
        </p>
      </div>

      {clients.length === 0 ? (
        <div className="flex flex-col items-center gap-3 text-slate-500 py-12">
          <AlertCircle className="w-10 h-10 text-slate-300" />
          <p className="text-sm">No clients found.</p>
        </div>
      ) : (
        <ul className="grid gap-3">
          {clients.map(client => (
            <li key={client.id}>
              <button
                type="button"
                disabled={selecting !== null}
                onClick={() => void selectClient(client)}
                className="w-full flex items-center gap-4 px-5 py-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-blue-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed text-left"
              >
                <div className="shrink-0 w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">
                    {client.portalName ?? client.businessName}
                  </p>
                  <div className="flex items-center gap-3 mt-0.5">
                    {client.companyCode && (
                      <span className="text-xs text-slate-400">{client.companyCode}</span>
                    )}
                    {client.role && (
                      <span className="text-xs text-blue-600 font-medium capitalize">
                        {client.role.toLowerCase().replace(/_/g, ' ')}
                      </span>
                    )}
                  </div>
                </div>

                {selecting === client.id ? (
                  <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin shrink-0" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8 text-center">
        <button
          type="button"
          onClick={() => router.push('/sign-in')}
          className="text-sm text-slate-500 hover:text-slate-700 transition"
        >
          Sign in with a different account
        </button>
      </div>
    </div>
  );
}
