// src/app/(dashboard)/dashboard/components/CompleteDetailsBanner.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';

const COMPLETED_KEY = 'client_details_completed';

export function CompleteDetailsBanner(): React.ReactNode {
  const router = useRouter();
  const [completed, setCompleted] = useState(false);
  const [mounted, setMounted] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect -- Hydration-safe: must read localStorage after mount */
  useEffect(() => {
    setCompleted(localStorage.getItem(COMPLETED_KEY) === 'true');
    setMounted(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (!mounted || completed) return null;

  return (
    <div className="flex items-center justify-center gap-3 border-b border-amber-300 bg-amber-50 px-5 py-2.5 shrink-0">
      <AlertCircle className="shrink-0 text-amber-500" size={16} />
      <p className="text-sm text-amber-900">
        <span className="font-semibold">Your account details are incomplete.</span>
        {' '}Complete your business and personal information to unlock full access.
      </p>
      <button
        onClick={() => router.push('/dashboard/complete-details')}
        className="shrink-0 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-amber-600 active:scale-[0.97]"
      >
        Complete Details
      </button>
    </div>
  );
}

