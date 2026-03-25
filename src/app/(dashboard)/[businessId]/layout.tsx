// src/app/(dashboard)/[businessId]/layout.tsx
'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { LogOut, Building2, ChevronDown } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export default function BusinessDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  const router = useRouter();
  const params = useParams();
  const businessId = params.businessId as string;
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development' && !isPending && !session) {
      const callbackUrl = encodeURIComponent(`/${businessId}`);
      router.replace(`/sign-in?callbackUrl=${callbackUrl}`);
    }
  }, [session, isPending, router, businessId]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push('/sign-in');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image
              src="/images/client_portal_logo.png"
              alt="Agila"
              width={28}
              height={28}
              className="rounded-md"
            />
            <span className="text-sm font-bold text-foreground hidden sm:block">
              Agila Client Portal
            </span>
          </div>

          {/* Business switcher + sign-out */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/select-business')}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-muted px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted/70 transition-colors"
            >
              <Building2 size={13} />
              <span>{businessId}</span>
              <ChevronDown size={12} className="text-muted-foreground" />
            </button>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <LogOut size={13} />
              <span className="hidden sm:block">Sign out</span>
            </button>
          </div>

        </div>
      </header>

      {/* Page content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
}
