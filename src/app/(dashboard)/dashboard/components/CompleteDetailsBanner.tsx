// src/app/(dashboard)/dashboard/components/CompleteDetailsBanner.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { CompleteDetailsForm, type SessionInfo } from './CompleteDetailsForm';

const COMPLETED_KEY = 'client_details_completed';

export function CompleteDetailsBanner(): React.ReactNode {
  const [completed, setCompleted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<SessionInfo>({
    clientId: null,
    companyCode: null,
    clientNo: null,
    businessEntity: null,
    branchType: null,
  });

  /* eslint-disable react-hooks/set-state-in-effect -- Hydration-safe: must read localStorage and fetch session after mount */
  useEffect(() => {
    setCompleted(localStorage.getItem(COMPLETED_KEY) === 'true');
    setMounted(true);

    fetch('/api/portal-session', { credentials: 'include' })
      .then(r => r.json())
      .then((data: {
        clientId?: string | number | null;
        companyCode?: string | null;
        clientNo?: string | null;
        businessEntity?: string | null;
        branchType?: string | null;
      }) => {
        setSessionInfo({
          clientId: data.clientId ?? null,
          companyCode: data.companyCode ?? null,
          clientNo: data.clientNo ?? null,
          businessEntity: data.businessEntity ?? null,
          branchType: data.branchType ?? null,
        });
      })
      .catch(() => {});
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (!mounted || completed) return null;

  return (
    <>
      <div className="flex items-center justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
        <div className="flex min-w-0 items-start gap-3">
          <AlertCircle className="mt-0.5 shrink-0 text-amber-500" size={18} />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-amber-900">
              Your account details are incomplete
            </p>
            <p className="mt-0.5 text-xs text-amber-700">
              Complete your business and personal information to unlock full access to your account.
            </p>
          </div>
        </div>
        <button
          onClick={() => setFormOpen(true)}
          className="shrink-0 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-amber-600 active:scale-[0.97]"
        >
          Complete Details
        </button>
      </div>

      <CompleteDetailsForm
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onCompleted={() => {
          setCompleted(true);
          setFormOpen(false);
        }}
        session={sessionInfo}
      />
    </>
  );
}

