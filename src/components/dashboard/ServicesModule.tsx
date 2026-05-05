// src/components/dashboard/ServicesModule.tsx
'use client';

import { useState, useRef } from 'react';
import {
  LayoutDashboard, FolderOpen, CalendarDays, FileText, CheckCircle2,
  AlertCircle, Clock, XCircle, ArrowLeft, ChevronRight,
  Circle, FileCheck, Activity, TrendingUp, AlertTriangle,
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';

/* ── Types ─────────────────────────────────────────────────────── */

type Tab                = 'overview' | 'services' | 'timeline';
type ServiceStatus      = 'active' | 'in_progress' | 'pending' | 'completed';
type RequirementStatus  = 'missing' | 'pending_review' | 'approved' | 'rejected';
type TimelineStatus     = 'upcoming' | 'completed' | 'overdue';

interface ServiceRequirement {
  id: string;
  name: string;
  status: RequirementStatus;
  fileUrl?: string;
  notes?: string;
}

interface FilingStep {
  id: string;
  label: string;
  completed: boolean;
  current: boolean;
  date?: string;
}

interface ClientService {
  id: string;
  serviceId: string;
  name: string;
  category: string;
  team: string;
  status: ServiceStatus;
  dueDate: string;
  assignedTo: string;
  requirements: ServiceRequirement[];
  filingSteps: FilingStep[];
}

interface TaxEvent {
  id: string;
  title: string;
  date: string;
  month: string;
  status: TimelineStatus;
  form?: string;
  category: string;
}

/* ── Mock Data ──────────────────────────────────────────────────── */

const MOCK_SERVICES: ClientService[] = [
  {
    id: 'cs-001',
    serviceId: 'svc-09',
    name: 'Monthly VAT Filing (2550M)',
    category: 'BIR',
    team: 'Compliance',
    status: 'in_progress',
    dueDate: 'Mar 25, 2026',
    assignedTo: 'Maria Santos',
    requirements: [
      { id: 'r1', name: 'Sales Invoice Summary',        status: 'approved',        fileUrl: '#', notes: 'Received and verified.' },
      { id: 'r2', name: 'Purchase Receipts',             status: 'approved',        fileUrl: '#' },
      { id: 'r3', name: 'Previous VAT Return (2550M)',   status: 'pending_review',  fileUrl: '#', notes: 'Under review by compliance team.' },
      { id: 'r4', name: 'Summary List of Sales',         status: 'missing' },
      { id: 'r5', name: 'Summary List of Purchases',     status: 'missing' },
    ],
    filingSteps: [
      { id: 's1', label: 'Documents Received', completed: true,  current: false, date: 'Mar 18, 2026' },
      { id: 's2', label: 'Review',             completed: true,  current: false, date: 'Mar 20, 2026' },
      { id: 's3', label: 'Processing',         completed: false, current: true  },
      { id: 's4', label: 'Complete',           completed: false, current: false },
    ],
  },
  {
    id: 'cs-002',
    serviceId: 'svc-15',
    name: 'Quarterly ITR Filing (1702Q)',
    category: 'BIR',
    team: 'Compliance',
    status: 'pending',
    dueDate: 'May 15, 2026',
    assignedTo: 'Maria Santos',
    requirements: [
      { id: 'r1', name: 'Income Statement (Q1)',          status: 'missing' },
      { id: 'r2', name: 'Balance Sheet (Q1)',              status: 'missing' },
      { id: 'r3', name: 'Withholding Tax Certificates',   status: 'missing' },
      { id: 'r4', name: 'Books of Account',               status: 'pending_review', fileUrl: '#', notes: 'Submitted, awaiting review.' },
    ],
    filingSteps: [
      { id: 's1', label: 'Documents Received', completed: false, current: true  },
      { id: 's2', label: 'Review',             completed: false, current: false },
      { id: 's3', label: 'Processing',         completed: false, current: false },
      { id: 's4', label: 'Complete',           completed: false, current: false },
    ],
  },
  {
    id: 'cs-003',
    serviceId: 'svc-46',
    name: 'Monthly Bookkeeping',
    category: 'Accounting',
    team: 'Accounting',
    status: 'active',
    dueDate: 'Mar 31, 2026',
    assignedTo: 'Ana Lim',
    requirements: [
      { id: 'r1', name: 'Bank Statements (March)',   status: 'approved',       fileUrl: '#' },
      { id: 'r2', name: 'Sales Invoices (March)',    status: 'approved',       fileUrl: '#' },
      { id: 'r3', name: 'Official Receipts (March)', status: 'pending_review', fileUrl: '#', notes: 'Missing 3 receipts for Mar 15–20. Please re-upload.' },
    ],
    filingSteps: [
      { id: 's1', label: 'Documents Received', completed: true,  current: false, date: 'Mar 5, 2026'  },
      { id: 's2', label: 'Review',             completed: true,  current: false, date: 'Mar 12, 2026' },
      { id: 's3', label: 'Processing',         completed: false, current: true  },
      { id: 's4', label: 'Complete',           completed: false, current: false },
    ],
  },
  {
    id: 'cs-004',
    serviceId: 'svc-34',
    name: 'Business Permit Renewal',
    category: 'LGU / Permits',
    team: 'Liaison',
    status: 'completed',
    dueDate: 'Feb 28, 2026',
    assignedTo: 'Carlo Reyes',
    requirements: [
      { id: 'r1', name: 'Barangay Clearance',       status: 'approved', fileUrl: '#' },
      { id: 'r2', name: 'Previous Business Permit', status: 'approved', fileUrl: '#' },
      { id: 'r3', name: 'Fire Safety Certificate',  status: 'approved', fileUrl: '#' },
      { id: 'r4', name: 'Sanitary Permit',          status: 'approved', fileUrl: '#' },
    ],
    filingSteps: [
      { id: 's1', label: 'Documents Received', completed: true, current: false, date: 'Jan 15, 2026' },
      { id: 's2', label: 'Review',             completed: true, current: false, date: 'Jan 20, 2026' },
      { id: 's3', label: 'Processing',         completed: true, current: false, date: 'Feb 5, 2026'  },
      { id: 's4', label: 'Complete',           completed: true, current: false, date: 'Feb 25, 2026' },
    ],
  },
  {
    id: 'cs-005',
    serviceId: 'svc-41',
    name: 'SSS Monthly Contributions Filing',
    category: 'SSS / PhilHealth / Pag-IBIG',
    team: 'Compliance',
    status: 'in_progress',
    dueDate: 'Mar 31, 2026',
    assignedTo: 'Maria Santos',
    requirements: [
      { id: 'r1', name: 'Payroll Summary (March)',       status: 'approved', fileUrl: '#' },
      { id: 'r2', name: 'Employee SSS Numbers List',    status: 'approved', fileUrl: '#' },
      { id: 'r3', name: 'Previous Contribution Receipt', status: 'missing' },
    ],
    filingSteps: [
      { id: 's1', label: 'Documents Received', completed: true,  current: false, date: 'Mar 22, 2026' },
      { id: 's2', label: 'Review',             completed: false, current: true  },
      { id: 's3', label: 'Processing',         completed: false, current: false },
      { id: 's4', label: 'Complete',           completed: false, current: false },
    ],
  },
];

const MOCK_TIMELINE: TaxEvent[] = [
  { id: 'te-01', title: 'Monthly VAT Filing (2550M)',        date: 'Mar 25, 2026', month: 'March 2026',  status: 'upcoming',   form: '2550M', category: 'BIR'     },
  { id: 'te-02', title: 'SSS Monthly Contributions',         date: 'Mar 31, 2026', month: 'March 2026',  status: 'upcoming',                  category: 'SSS'     },
  { id: 'te-03', title: 'PhilHealth Monthly Payment',        date: 'Mar 31, 2026', month: 'March 2026',  status: 'upcoming',                  category: 'PhilHealth' },
  { id: 'te-04', title: 'Pag-IBIG Monthly Payment',          date: 'Mar 31, 2026', month: 'March 2026',  status: 'upcoming',                  category: 'Pag-IBIG' },
  { id: 'te-05', title: 'Monthly Bookkeeping Close',         date: 'Mar 31, 2026', month: 'March 2026',  status: 'upcoming',                  category: 'Accounting' },
  { id: 'te-06', title: 'Annual ITR Filing (1702)',           date: 'Apr 15, 2026', month: 'April 2026',  status: 'upcoming',   form: '1702',  category: 'BIR'     },
  { id: 'te-07', title: 'Quarterly VAT Filing (2550Q)',       date: 'Apr 25, 2026', month: 'April 2026',  status: 'upcoming',   form: '2550Q', category: 'BIR'     },
  { id: 'te-08', title: 'Quarterly ITR Filing (1702Q)',       date: 'May 15, 2026', month: 'May 2026',    status: 'upcoming',   form: '1702Q', category: 'BIR'     },
  { id: 'te-09', title: 'Annual Registration Fee (0605)',     date: 'Jan 31, 2026', month: 'January 2026',status: 'completed',  form: '0605',  category: 'BIR'     },
  { id: 'te-10', title: 'Monthly VAT Filing (2550M) — Feb',  date: 'Feb 25, 2026', month: 'February 2026',status: 'completed',  form: '2550M', category: 'BIR'     },
  { id: 'te-11', title: 'Business Permit Renewal',            date: 'Feb 28, 2026', month: 'February 2026',status: 'completed',               category: 'LGU'     },
];

const RECENT_ACTIVITY = [
  { id: 'a1', text: '"Sales Invoice Summary" verified for Monthly VAT Filing',             time: '2 hours ago',  type: 'approved'  },
  { id: 'a2', text: 'Monthly Bookkeeping — Bank Statements received and logged by ATMS',   time: '1 day ago',    type: 'received'  },
  { id: 'a3', text: 'Business Permit Renewal marked as Completed',                         time: '3 days ago',   type: 'completed' },
  { id: 'a4', text: '"Purchase Receipts" verified for Monthly VAT Filing',                 time: '4 days ago',   type: 'approved'  },
  { id: 'a5', text: 'SSS Payroll Summary received and logged by ATMS',                    time: '5 days ago',   type: 'received'  },
];

/* ── Config ─────────────────────────────────────────────────────── */

const SERVICE_STATUS: Record<ServiceStatus, { label: string; textColor: string; bg: string; border: string; barColor: string }> = {
  active:      { label: 'Active',      textColor: 'text-blue-700',    bg: 'bg-blue-50',    border: 'border-blue-200',    barColor: 'bg-blue-500'    },
  in_progress: { label: 'In Progress', textColor: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-200',   barColor: 'bg-amber-500'   },
  pending:     { label: 'Pending',     textColor: 'text-slate-600',   bg: 'bg-slate-50',   border: 'border-slate-200',   barColor: 'bg-slate-400'   },
  completed:   { label: 'Completed',   textColor: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', barColor: 'bg-emerald-500' },
};

const REQ_STATUS: Record<RequirementStatus, { label: string; textColor: string; bg: string; border: string; Icon: React.ElementType }> = {
  missing:        { label: 'Not Yet Submitted', textColor: 'text-red-700',     bg: 'bg-red-50',     border: 'border-red-200',     Icon: AlertCircle  },
  pending_review: { label: 'Received by ATMS',  textColor: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-200',   Icon: Clock        },
  approved:       { label: 'Verified',           textColor: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', Icon: CheckCircle2 },
  rejected:       { label: 'Returned',           textColor: 'text-red-700',     bg: 'bg-red-50',     border: 'border-red-200',     Icon: XCircle      },
};

const TIMELINE_STATUS: Record<TimelineStatus, { textColor: string; bg: string; border: string; dot: string }> = {
  upcoming:  { textColor: 'text-blue-700',    bg: 'bg-blue-50',    border: 'border-blue-200',    dot: 'bg-blue-500'    },
  completed: { textColor: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  overdue:   { textColor: 'text-red-700',     bg: 'bg-red-50',     border: 'border-red-200',     dot: 'bg-red-500'     },
};

const ACTIVITY_ICON: Record<string, { Icon: React.ElementType; color: string }> = {
  approved:  { Icon: CheckCircle2, color: 'text-emerald-600' },
  received:  { Icon: FileCheck,    color: 'text-blue-600'    },
  completed: { Icon: FileCheck,    color: 'text-emerald-600' },
};

/* ── Main Component ─────────────────────────────────────────────── */

export default function ServicesModule(): React.ReactNode {
  const [activeTab, setActiveTab]   = useState<Tab>('overview');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedService = MOCK_SERVICES.find(s => s.id === selectedId) ?? null;

  const totalActive      = MOCK_SERVICES.filter(s => s.status !== 'completed').length;
  const completedCount   = MOCK_SERVICES.filter(s => s.status === 'completed').length;
  const inProgressCount  = MOCK_SERVICES.filter(s => s.status === 'in_progress').length;
  const missingDocsCount = MOCK_SERVICES.reduce(
    (acc, s) => acc + s.requirements.filter(r => r.status === 'missing').length, 0,
  );

  const TABS: { key: Tab; label: string; Icon: React.ElementType }[] = [
    { key: 'overview',  label: 'Overview',     Icon: LayoutDashboard },
    { key: 'services',  label: 'My Services',  Icon: FolderOpen      },
    { key: 'timeline',  label: 'Tax Timeline', Icon: CalendarDays    },
  ];

  /* -- helper: requirements progress text -- */
  function reqProgress(reqs: ServiceRequirement[]) {
    const submitted = reqs.filter(r => r.status === 'approved' || r.status === 'pending_review').length;
    return `${submitted} / ${reqs.length} documents submitted`;
  }

  /* -- helper: filing steps progress % -- */
  function stepsProgress(steps: FilingStep[]) {
    return Math.round((steps.filter(s => s.completed).length / steps.length) * 100);
  }

  /* ── Rendered tabs ─────────────────────────────────────────────── */
  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-6">

      {/* Page header */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Client Portal</p>
        <h1 className="mt-1 text-2xl font-extrabold text-foreground">Services &amp; Compliance</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track your active services, document requirements, and filing schedule handled by ATMS.
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 border-b border-border">
        {TABS.map(({ key, label, Icon }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => { setActiveTab(key); setSelectedId(null); }}
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-all ${
                isActive
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          );
        })}
      </div>

      {/* ── OVERVIEW TAB ─────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">

          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: 'Active Services',    value: totalActive,      Icon: TrendingUp,    color: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-200'    },
              { label: 'Completed',          value: completedCount,   Icon: FileCheck,     color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
              { label: 'In Progress',        value: inProgressCount,  Icon: Activity,      color: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-200'   },
              { label: 'Missing Documents',  value: missingDocsCount, Icon: AlertTriangle, color: 'text-red-600',     bg: 'bg-red-50',     border: 'border-red-200'     },
            ].map(({ label, value, Icon, color, bg, border }) => (
              <div key={label} className={`rounded-2xl border ${border} ${bg} p-5 space-y-3`}>
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${bg} border ${border}`}>
                  <Icon size={18} className={color} />
                </div>
                <div>
                  <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Service summary list */}
          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Your Services</p>
              <button
                onClick={() => setActiveTab('services')}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                View all
              </button>
            </div>
            <div className="divide-y divide-border">
              {MOCK_SERVICES.map(svc => {
                const st = SERVICE_STATUS[svc.status];
                const pct = stepsProgress(svc.filingSteps);
                return (
                  <div key={svc.id} className="px-5 py-4 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-foreground truncate">{svc.name}</p>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${st.bg} ${st.border} ${st.textColor}`}>
                          {st.label}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{svc.category} · Due {svc.dueDate}</p>
                    </div>
                    <div className="w-24 shrink-0 space-y-1">
                      <div className="flex justify-between text-[10px] font-semibold text-muted-foreground">
                        <span>Progress</span><span>{pct}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div className={`h-full rounded-full ${st.barColor} transition-all duration-700`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border">
              <p className="text-sm font-semibold text-foreground">Recent Activity</p>
            </div>
            <div className="divide-y divide-border">
              {RECENT_ACTIVITY.map(a => {
                const cfg = ACTIVITY_ICON[a.type] ?? ACTIVITY_ICON.uploaded;
                const { Icon, color } = cfg;
                return (
                  <div key={a.id} className="flex items-start gap-3 px-5 py-3.5">
                    <div className={`mt-0.5 shrink-0 ${color}`}>
                      <Icon size={15} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground leading-snug">{a.text}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{a.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── MY SERVICES TAB — LIST ───────────────────────────────── */}
      {activeTab === 'services' && selectedService === null && (
        <div className="space-y-3">
          {MOCK_SERVICES.map(svc => {
            const st      = SERVICE_STATUS[svc.status];
            const missing = svc.requirements.filter(r => r.status === 'missing').length;
            const currentStep = svc.filingSteps.find(s => s.current);
            const completedSteps = svc.filingSteps.filter(s => s.completed).length;
            const totalSteps = svc.filingSteps.length;

            return (
              <button
                key={svc.id}
                onClick={() => setSelectedId(svc.id)}
                className="w-full text-left rounded-xl border border-border bg-card hover:border-foreground/20 hover:bg-muted/30 transition-all duration-150 overflow-hidden group"
              >
                <div className="p-4 flex items-start gap-4">
                  {/* Left: info */}
                  <div className="flex-1 min-w-0 space-y-3">
                    {/* Title row */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${st.bg} ${st.border} ${st.textColor}`}>
                        {st.label}
                      </span>
                      <span className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">{svc.category}</span>
                      {missing > 0 && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                          <AlertCircle size={10} /> {missing} doc{missing > 1 ? 's' : ''} needed
                        </span>
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-foreground leading-snug">{svc.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Due <span className="font-medium text-foreground">{svc.dueDate}</span>
                        <span className="mx-1.5 text-border">·</span>
                        {svc.assignedTo}
                      </p>
                    </div>

                    {/* Mini step tracker */}
                    <div className="flex items-center gap-1">
                      {svc.filingSteps.map((step, i) => (
                        <div key={step.id} className="flex items-center gap-1 flex-1 min-w-0">
                          <div className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                            step.completed ? 'bg-emerald-500' : step.current ? 'bg-blue-500' : 'bg-muted-foreground/25'
                          }`} />
                          {i < svc.filingSteps.length - 1 && (
                            <div className={`h-px flex-1 ${step.completed ? 'bg-emerald-300' : 'bg-muted-foreground/20'}`} />
                          )}
                        </div>
                      ))}
                      <span className="ml-2 text-[10px] text-muted-foreground shrink-0">
                        {currentStep ? currentStep.label : `${completedSteps}/${totalSteps} steps`}
                      </span>
                    </div>
                  </div>

                  {/* Right: chevron */}
                  <ChevronRight size={16} className="text-muted-foreground/50 group-hover:text-foreground shrink-0 mt-0.5 transition-colors" />
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* ── MY SERVICES TAB — DETAIL ─────────────────────────────── */}
      {activeTab === 'services' && selectedService !== null && (
        <div className="space-y-5">

          {/* Back + title */}
          <div className="flex items-start gap-3">
            <button
              onClick={() => setSelectedId(null)}
              className="shrink-0 mt-0.5 flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${SERVICE_STATUS[selectedService.status].bg} ${SERVICE_STATUS[selectedService.status].border} ${SERVICE_STATUS[selectedService.status].textColor}`}>
                  {SERVICE_STATUS[selectedService.status].label}
                </span>
                <span className="text-[10px] text-muted-foreground">{selectedService.category}</span>
              </div>
              <h2 className="text-base font-bold text-foreground leading-snug">{selectedService.name}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Due <span className="font-medium text-foreground">{selectedService.dueDate}</span>
                <span className="mx-1.5 text-border">·</span>{selectedService.assignedTo}
              </p>
            </div>
          </div>

          {/* ── Filing Tracker ─────────────────────────────────── */}
          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border">
              <p className="text-sm font-semibold text-foreground">Filing Progress</p>
            </div>
            <div className="px-5 py-6">
              {/* Desktop: horizontal stepper */}
              <div className="hidden sm:flex items-start gap-0">
                {selectedService.filingSteps.map((step, i) => {
                  const isLast = i === selectedService.filingSteps.length - 1;
                  return (
                    <div key={step.id} className="flex items-start flex-1 min-w-0">
                      <div className="flex flex-col items-center flex-1 min-w-0">
                        {/* Dot + line */}
                        <div className="flex items-center w-full">
                          <div className={`h-px flex-1 ${i === 0 ? 'invisible' : step.completed ? 'bg-emerald-400' : 'bg-muted'}`} />
                        <div className={`shrink-0 h-8 w-8 rounded-full border-2 flex items-center justify-center transition-all ${
                            step.completed
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : step.current
                              ? 'bg-blue-600 border-blue-600 text-white animate-pulse'
                              : 'bg-card border-border text-muted-foreground'
                          }`}>
                            {step.completed
                              ? <CheckCircle2 size={16} />
                              : step.current
                              ? <Clock size={14} />
                              : <Circle size={12} />
                            }
                          </div>
                          <div className={`h-px flex-1 ${isLast ? 'invisible' : step.completed ? 'bg-emerald-400' : 'bg-muted'}`} />
                        </div>
                        {/* Label */}
                        <div className="mt-2 px-1 text-center">
                          <p className={`text-[11px] font-semibold leading-tight ${
                            step.completed ? 'text-emerald-700' : step.current ? 'text-blue-700' : 'text-muted-foreground'
                          }`}>{step.label}</p>
                          {step.date && <p className="text-[10px] text-muted-foreground mt-0.5">{step.date}</p>}
                          {step.current && <p className="text-[10px] font-bold text-blue-600 mt-0.5">Current</p>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Mobile: vertical stepper */}
              <div className="sm:hidden space-y-0">
                {selectedService.filingSteps.map((step, i) => {
                  const isLast = i === selectedService.filingSteps.length - 1;
                  return (
                    <div key={step.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`h-7 w-7 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          step.completed
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : step.current
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'bg-card border-border text-muted-foreground'
                        }`}>
                          {step.completed ? <CheckCircle2 size={14} /> : step.current ? <Clock size={12} /> : <Circle size={10} />}
                        </div>
                        {!isLast && <div className={`w-px flex-1 my-1 ${step.completed ? 'bg-emerald-400' : 'bg-muted'}`} />}
                      </div>
                      <div className="pb-4 flex-1 min-w-0">
                        <p className={`text-sm font-semibold ${
                          step.completed ? 'text-emerald-700' : step.current ? 'text-blue-700' : 'text-muted-foreground'
                        }`}>{step.label}</p>
                        {step.date && <p className="text-xs text-muted-foreground">{step.date}</p>}
                        {step.current && <p className="text-xs font-bold text-blue-600">In Progress</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Requirements Checklist ─────────────────────────── */}
          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Requirements Checklist</p>
              <p className="text-xs text-muted-foreground">{reqProgress(selectedService.requirements)}</p>
            </div>

            {/* Progress bar */}
            <div className="px-5 pt-4 pb-2">
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all duration-700"
                  style={{
                    width: `${Math.round(
                      (selectedService.requirements.filter(r => r.status === 'approved' || r.status === 'pending_review').length /
                        selectedService.requirements.length) * 100,
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div className="divide-y divide-border">
              {selectedService.requirements.map(req => {
                const rs = REQ_STATUS[req.status];
                const { Icon: ReqIcon } = rs;
                return (
                  <div key={req.id} className="px-5 py-3 flex items-start gap-3">
                    <ReqIcon size={14} className={`mt-0.5 shrink-0 ${rs.textColor}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                        <p className="text-sm text-foreground leading-snug">{req.name}</p>
                        <span className={`shrink-0 text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${rs.bg} ${rs.border} ${rs.textColor}`}>
                          {rs.label}
                        </span>
                      </div>
                      {req.notes && (
                        <p className="mt-1 text-xs text-muted-foreground">{req.notes}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="px-5 py-3.5 border-t border-border bg-muted/30">
              <p className="text-[11px] text-muted-foreground">
                Please hand all required documents to your assigned Account Officer or Operations Manager in person. Your AO/OM will mark each document as received once collected.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── TAX TIMELINE TAB ─────────────────────────────────────── */}
      {activeTab === 'timeline' && (() => {
        const sorted = [...MOCK_TIMELINE].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        const months = Array.from(new Set(sorted.map(e => e.month)));
        return (
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 border-b border-border">
                <p className="text-sm font-semibold text-foreground">Filing Schedule</p>
                <p className="text-xs text-muted-foreground mt-0.5">All deadlines managed by ATMS on your behalf.</p>
              </div>
              <div>
                {months.map((month, mi) => {
                  const events = sorted.filter(e => e.month === month);
                  return (
                    <div key={month}>
                      <div className={`px-5 py-2 bg-muted/50 ${mi > 0 ? 'border-t border-border' : ''}`}>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{month}</p>
                      </div>
                      <div className="divide-y divide-border">
                        {events.map(event => {
                          const ts = TIMELINE_STATUS[event.status];
                          return (
                            <div key={event.id} className="flex items-center gap-4 px-5 py-3.5">
                              <div className={`h-2 w-2 rounded-full shrink-0 ${ts.dot}`} />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground leading-snug">{event.title}</p>
                                <div className="flex flex-wrap items-center gap-2 mt-0.5">
                                  <p className="text-xs text-muted-foreground">{event.date}</p>
                                  {event.form && (
                                    <span className="text-[10px] font-bold bg-muted border border-border text-muted-foreground px-1.5 py-0.5 rounded">
                                      {event.form}
                                    </span>
                                  )}
                                  <span className="text-[10px] text-muted-foreground">{event.category}</span>
                                </div>
                              </div>
                              <span className={`shrink-0 text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${ts.bg} ${ts.border} ${ts.textColor}`}>
                                {event.status === 'in_progress' ? 'In Progress' : event.status}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <p className="text-center text-[11px] text-muted-foreground">
              All filings are handled by ATMS on your behalf. This timeline is view-only.
            </p>
          </div>
        );
      })()}
    </div>
  );
}
