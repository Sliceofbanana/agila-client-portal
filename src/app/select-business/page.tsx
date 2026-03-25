// src/app/select-business/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Building2, ArrowRight, LogOut, Loader2 } from 'lucide-react';
import { MOCK_GATEWAY_CLIENTS } from '@/lib/mock-client-gateway-data';

interface Business {
  id: string;
  name: string;
  type: 'professional' | 'sole_proprietor';
  plan: string;
}

const MOCK_BUSINESSES: Business[] = MOCK_GATEWAY_CLIENTS
  .filter((c) => c.status === 'Active')
  .map((c) => ({
    id: c.companyCode,
    name: c.businessName,
    type: c.businessType === 'Sole Proprietorship' ? 'sole_proprietor' : 'professional',
    plan: c.servicePlan,
  }));

export default function SelectBusinessPage(): React.ReactNode {
  const router = useRouter();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setBusinesses(MOCK_BUSINESSES);
    setLoaded(true);
  }, []);

  const handleSignOut = () => {
    router.push('/sign-in');
  };

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/images/client_portal_logo.png"
              alt="Agila"
              width={28}
              height={28}
              className="rounded-md"
            />
            <span className="text-sm font-bold text-foreground">Agila Client Portal</span>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut size={13} />
            Sign out
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Select a Business</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose the business you want to view.
          </p>
        </div>

        {/* Empty state */}
        {businesses.length === 0 && (
          <div className="rounded-xl border border-border bg-card px-5 py-12 text-center text-sm text-muted-foreground">
            No businesses found for your account. Please contact support.
          </div>
        )}

        {/* Business grid */}
        {businesses.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {businesses.map(biz => (
              <button
                key={biz.id}
                onClick={() => router.push('/dashboard')}
                className="group text-left rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-blue-300"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md transition-transform group-hover:scale-105 group-hover:rotate-3">
                  <Building2 size={20} />
                </div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-base text-foreground leading-snug group-hover:text-blue-600 transition-colors">
                    {biz.name}
                  </h3>
                  <ArrowRight
                    size={16}
                    className="text-muted-foreground shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground font-mono">{biz.id}</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
                    {biz.type === 'sole_proprietor' ? 'Sole Proprietor' : 'Professional'}
                  </span>
                  <span className="rounded-full bg-blue-50 border border-blue-100 px-2.5 py-1 text-[10px] font-semibold text-blue-600">
                    {biz.plan} Plan
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
