'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  LayoutDashboard, Clock, FileBadge, SendHorizontal,
  Settings, LogOut, ChevronLeft, ChevronRight, X, Menu, User,
  ChevronDown, ChevronUp, Briefcase, UserCheck, Layers,
  Sun, Moon
} from 'lucide-react';
import { Button } from '@/components/UI/button';
import { NotificationDropdown } from '@/components/notifications/NotificationDropdown';
import { RoleProvider } from '@/lib/role-context';
import { AuthProvider } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { authClient } from '@/lib/auth-client';


const NAV_ITEMS = [
  { href: '/dashboard',                   label: 'Dashboard',   icon: LayoutDashboard },
  { href: '/dashboard/timesheet',         label: 'Timesheet',   icon: Clock },
  { href: '/dashboard/payslips',          label: 'Payslip',     icon: FileBadge },
  { href: '/dashboard/hr-apps',           label: 'Application', icon: SendHorizontal },
  { href: '/dashboard/services',          label: 'Services',    icon: Layers },
];

const PORTAL_ITEMS = [
  { href: '/portal/hr', label: 'Agila HR Portal', icon: UserCheck },
];

const DASH_LABELS: Record<string, string> = {
  dashboard:          'Dashboard',
  timesheet:          'Timesheet',
  payslips:           'Payslips',
  'hr-apps':          'HR Applications',
  services:           'Services & Compliance',
  profile:            'Profile',
  settings:           'Settings',
  notifications:      'Notifications',
  admin:              'Admin',
  clients:            'Clients',
  hr:                 'HR',
  'user-management':  'User Management',
};

function resolveSegment(seg: string): string {
  return DASH_LABELS[seg] ?? seg.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function DashboardBreadcrumb(): React.ReactNode {
  const pathname = usePathname();
  const router   = useRouter();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length <= 1) return null;

  const crumbs = segments.map((seg, i) => ({
    label:  resolveSegment(seg),
    path:   '/' + segments.slice(0, i + 1).join('/'),
    isLast: i === segments.length - 1,
  }));

  return (
    <nav className="hidden sm:flex items-center gap-1 text-sm" aria-label="Breadcrumb">
      {crumbs.map((crumb, i) => (
        <React.Fragment key={crumb.path}>
          {i > 0 && <ChevronRight size={13} className="text-muted-foreground/40 shrink-0" />}
          {crumb.isLast ? (
            <span className="font-semibold text-foreground truncate max-w-40">{crumb.label}</span>
          ) : (
            <button
              onClick={() => router.push(crumb.path)}
              className="text-muted-foreground hover:text-foreground transition-colors truncate max-w-40"
            >
              {crumb.label}
            </button>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

function ProfileDropdown(): React.ReactNode {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  /* eslint-disable react-hooks/set-state-in-effect -- Subscribing to DOM event for click-outside detection */
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="ghost"
        onClick={() => setOpen(o => !o)}
        className="rounded-xl"
        title="Account"
      >
        <User size={18} />
      </Button>
      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-44 rounded-xl border border-border bg-card shadow-lg z-50 overflow-hidden">
          <button
            onClick={() => { setOpen(false); router.push('/dashboard/profile'); }}
            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
          >
            <User size={14} /> Profile
          </button>
          <div className="h-px bg-border" />
          <button
            onClick={async () => { setOpen(false); await authClient.signOut(); router.push('/sign-in'); }}
            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen]       = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  return (
    <RoleProvider>
      <AuthProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar
          isOpen={sidebarOpen}
          isExpanded={sidebarExpanded}
          onClose={() => setSidebarOpen(false)}
          onToggleExpand={() => setSidebarExpanded(prev => !prev)}
        />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <header className="bg-header border-b border-header-border px-6 py-4 flex items-center justify-between shrink-0 z-30 shadow-sm">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={20} />
              </Button>
              <DashboardBreadcrumb />
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={toggleTheme}
                className="rounded-xl text-muted-foreground hover:text-foreground"
                title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </Button>
              <NotificationDropdown />
              <ProfileDropdown />
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10">
            {children}
          </main>
        </div>
      </div>
      </AuthProvider>
    </RoleProvider>
  );
}

/* ─── Sidebar ─────────────────────────────────────────────────────── */

interface SidebarProps {
  isOpen: boolean;
  isExpanded: boolean;
  onClose: () => void;
  onToggleExpand: () => void;
}


function Sidebar({ isOpen, isExpanded, onClose, onToggleExpand }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [logoHovered, setLogoHovered] = useState(false);
  const [portalOpen, setPortalOpen] = useState(false);

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href);

  const navigate = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 lg:static
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isExpanded ? 'w-64' : 'w-20'}
          bg-sidebar text-sidebar-foreground transition-all duration-300 flex flex-col h-screen shadow-2xl
        `}
      >
        {/* Header */}
        <div
          className={`p-5 flex items-center ${isExpanded ? 'justify-between' : 'justify-center'} shrink-0 border-b border-sidebar-border`}
          onMouseEnter={() => !isExpanded && setLogoHovered(true)}
          onMouseLeave={() => !isExpanded && setLogoHovered(false)}
        >
          {isExpanded ? (
            <>
              <div className="flex items-center gap-3">
                <Image src="/images/client_portal_logo.png" alt="ATMS" width={36} height={36} className="shrink-0 rounded-sm" />
                <div>
                  <h2 className="text-sm font-extrabold text-white uppercase tracking-tight leading-none">Agila Tax</h2>
                  <p className="text-[9px] text-blue-400 font-semibold uppercase tracking-wider mt-0.5">Management Services</p>
                </div>
              </div>

              {/* Collapse / close buttons */}
              <button
                onClick={isOpen ? onClose : onToggleExpand}
                className="flex items-center justify-center w-7 h-7 rounded-md border border-sidebar-border text-slate-400 hover:bg-slate-800 hover:text-white transition lg:flex"
                title={isOpen ? 'Close' : 'Collapse sidebar'}
              >
                {isOpen ? <X size={16} /> : <ChevronLeft size={16} />}
              </button>
            </>
          ) : (
            <div className="relative">
              <Image src="/images/client_portal_logo.png" alt="ATMS" width={30} height={30} className="rounded-sm" />
              {logoHovered && (
                <button
                  onClick={onToggleExpand}
                  className="hidden lg:flex items-center justify-center w-6 h-6 rounded-md absolute -right-8 top-1/2 -translate-y-1/2 bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition"
                  title="Expand sidebar"
                >
                  <ChevronRight size={14} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 mt-4 space-y-1 overflow-y-auto pb-6">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <button
                key={href}
                onClick={() => navigate(href)}
                className={`
                  w-full flex items-center ${isExpanded ? 'gap-3 px-3' : 'justify-center'} 
                  p-3 rounded-xl transition-all duration-200
                  ${active
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                `}
                title={!isExpanded ? label : undefined}
              >
                <Icon size={20} className="shrink-0" />
                {isExpanded && <span className="font-semibold text-sm whitespace-nowrap">{label}</span>}
              </button>
            );
          })}

          {/* Portal Dropdown */}
          <div className="relative">
            <button
              onClick={() => setPortalOpen((open) => !open)}
              className={`w-full flex items-center ${isExpanded ? 'gap-3 px-3' : 'justify-center'} p-3 rounded-xl transition-all duration-200 text-slate-400 hover:bg-slate-800 hover:text-white`}
              title={!isExpanded ? 'Portals' : undefined}
            >
              <span className="shrink-0"><Briefcase size={20} /></span>
              {isExpanded && <span className="font-semibold text-sm whitespace-nowrap">Portals</span>}
              {isExpanded && (
                <span className="ml-auto">
                  {portalOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </span>
              )}
            </button>
            {portalOpen && isExpanded && (
              <div className="ml-8 mt-1 space-y-1">
                {PORTAL_ITEMS.map(({ href, label, icon: Icon }) => (
                  <button
                    key={href}
                    onClick={() => navigate(href)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition text-left ${isActive(href) ? 'bg-blue-700 text-white' : ''}`}
                  >
                    <Icon size={18} className="shrink-0" />
                    <span className="text-sm">{label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-sidebar-border shrink-0 space-y-1">
          <button
            onClick={() => navigate('/dashboard/settings')}
            className={`flex items-center ${isExpanded ? 'gap-3 px-3' : 'justify-center'} p-3 w-full rounded-xl transition
              ${pathname.startsWith('/dashboard/settings')
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            title={!isExpanded ? 'Settings' : undefined}
          >
            <Settings size={20} className="shrink-0" />
            {isExpanded && <span className="text-sm font-medium">Settings</span>}
          </button>


        </div>
      </aside>
    </>
  );
}
