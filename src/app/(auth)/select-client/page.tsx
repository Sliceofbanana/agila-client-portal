// src/app/(auth)/select-client/page.tsx
import { Suspense } from 'react';
import ClientSelector from './components/ClientSelector';

export default function SelectClientPage(): React.ReactNode {
  return (
    <div className="flex-1 flex items-center justify-center bg-white px-4 py-12">
      <Suspense
        fallback={
          <div className="text-sm text-slate-500 animate-pulse">Loading your clients…</div>
        }
      >
        <ClientSelector />
      </Suspense>
    </div>
  );
}
