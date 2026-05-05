'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { HRSidebar } from '@/components/hr/HRSidebar';
import { NotificationDropdown } from '@/components/notifications/NotificationDropdown';
import { Button } from '@/components/UI/button';
import { RoleProvider } from '@/lib/role-context';
import { Menu, User, ArrowLeft, ChevronRight, LogOut } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

const SEGMENT_LABELS: Record<string, string> = {
  hr: 'HR Portal',
  'employee-management': 'Employee Management',
  'leave-management': 'Leave Management',
  'performance-management': 'Performance',
  'attendance-tracking': 'Attendance Tracking',
  'payroll-coordination': 'Payroll Coordination',
  'gov-compliance-tracking': 'Gov Compliance',
  'hr-request': 'HR Requests',
};

function resolveLabel(seg: string, parentSeg?: string): string {
  if (SEGMENT_LABELS[seg]) return SEGMENT_LABELS[seg];
  if (/^\d+$/.test(seg) || /^[a-z0-9]{20,}$/i.test(seg)) {
    if (parentSeg === 'employee-management') return 'Employee Profile';
    return 'Details';
  }
  return seg;
}

function HRBreadcrumb() {
  const pathname = usePathname();
  const router = useRouter();

  const allSegments = pathname.split('/').filter(Boolean);
  const hrIndex = allSegments.indexOf('hr');
  const hrSegments = hrIndex >= 0 ? allSegments.slice(hrIndex) : ['hr'];

  const crumbs = hrSegments.map((seg, i) => {
    const path = '/' + allSegments.slice(0, hrIndex + i + 1).join('/');
    const label = resolveLabel(seg, hrSegments[i - 1]);
    const isLast = i === hrSegments.length - 1;
    return { label, path, isLast };
  });

  const backTarget =
    hrSegments.length > 1
      ? '/' + allSegments.slice(0, hrIndex + hrSegments.length - 1).join('/')
      : '/dashboard';

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => router.push(backTarget)}
        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        aria-label="Go back"
      >
        <ArrowLeft size={16} />
      </button>
      <nav className="hidden sm:flex items-center gap-1 text-sm" aria-label="Breadcrumb">
        {crumbs.map((crumb, i) => (
          <React.Fragment key={crumb.path}>
            {i > 0 && <ChevronRight size={13} className="text-slate-300 shrink-0" />}
            {crumb.isLast ? (
              <span className="font-semibold text-slate-800 max-w-50 truncate">
                {crumb.label}
              </span>
            ) : (
              <button
                onClick={() => router.push(crumb.path)}
                className="text-slate-400 hover:text-rose-600 transition-colors max-w-40 truncate"
              >
                {crumb.label}
              </button>
            )}
          </React.Fragment>
        ))}
      </nav>
    </div>
  );
}

export default function HRLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = React.useRef<HTMLDivElement>(null);
  const router = useRouter();

  /* eslint-disable react-hooks/set-state-in-effect -- Subscribing to DOM event for click-outside detection */
  React.useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  return (
    <RoleProvider>
      <div className="flex h-screen overflow-hidden bg-slate-50">
        <HRSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0 z-30 shadow-sm">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                className="lg:hidden"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu size={20} />
              </Button>
              <HRBreadcrumb />
            </div>

            <div className="flex items-center gap-2">
              <NotificationDropdown />
              <div className="relative" ref={dropRef}>
                <Button variant="ghost" onClick={() => setDropOpen(o => !o)} title="Account">
                  <User size={18} />
                </Button>
                {dropOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-44 rounded-xl border border-slate-200 bg-white shadow-lg z-50 overflow-hidden">
                    <button
                      onClick={() => { setDropOpen(false); router.push('/dashboard/profile'); }}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <User size={14} /> Profile
                    </button>
                    <div className="h-px bg-slate-100" />
                    <button
                      onClick={async () => { setDropOpen(false); await authClient.signOut(); router.push('/sign-in'); }}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </RoleProvider>
  );
}
