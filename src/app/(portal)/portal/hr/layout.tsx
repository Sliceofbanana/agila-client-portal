'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { HRSidebar } from '@/components/hr/HRSidebar';
import { NotificationDropdown } from '@/components/notifications/NotificationDropdown';
import { Button } from '@/components/UI/button';
import { RoleProvider } from '@/lib/role-context';
import { Menu, User, ArrowLeft, ChevronRight } from 'lucide-react';

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
  const router = useRouter();

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
              <Button
                variant="ghost"
                onClick={() => router.push('/dashboard/profile')}
              >
                <User size={18} />
              </Button>
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
