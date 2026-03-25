// src/app/(dashboard)/[businessId]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowRight, Clock, FileText, DollarSign, UserCheck, Calendar,
  ChevronDown, ChevronUp,
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';

/* --- Service links (businessId-scoped) -------------------------- */

function getServices(businessId: string) {
  return [
    {
      id: 'timesheet',
      title: 'Timesheet',
      description: 'Track daily attendance and log your clock in/out records.',
      href: `/${businessId}/timesheet`,
      icon: Clock,
      iconBg: 'bg-blue-600',
      hoverText: 'text-blue-600',
    },
    {
      id: 'payslips',
      title: 'Payslip',
      description: 'View and download your salary breakdown and payroll history.',
      href: `/${businessId}/payslips`,
      icon: DollarSign,
      iconBg: 'bg-emerald-600',
      hoverText: 'text-emerald-600',
    },
    {
      id: 'hr-apps',
      title: 'HR Applications',
      description: 'Submit leave, overtime, and other HR requests online.',
      href: `/${businessId}/hr-apps`,
      icon: FileText,
      iconBg: 'bg-violet-600',
      hoverText: 'text-violet-600',
    },
  ];
}

const HR_TAGS = ['Employee Management', 'Leave & Attendance', 'Payroll', 'Gov Compliance'];

/* --- Task types ------------------------------------------------- */

type TaskStatus   = 'pending' | 'in_progress' | 'for_review' | 'completed';
type TaskTeam     = 'compliance' | 'liaison' | 'account_officer';
type PeriodFilter = 'all' | 'month' | 'quarter' | 'year';

interface ClientTask {
  id: string;
  title: string;
  description: string;
  team: TaskTeam;
  status: TaskStatus;
  dueDate: string;
  assignedTo: string;
  progress: number; // 0–100
}

// TODO: Replace with API call to /api/[businessId]/tasks
const MOCK_TASKS: ClientTask[] = [
  {
    id: 'TSK-001',
    title: 'Annual Income Tax Return (ITR) — FY 2025',
    description: 'Preparation and filing of BIR Form 1701 for fiscal year 2025.',
    team: 'compliance',
    status: 'in_progress',
    dueDate: 'Apr 15, 2026',
    assignedTo: 'Maria Santos',
    progress: 60,
  },
  {
    id: 'TSK-002',
    title: 'Business Permit Renewal — Cebu City',
    description: "Renewal of Mayor's Permit and Barangay clearance for 2026.",
    team: 'liaison',
    status: 'for_review',
    dueDate: 'Mar 31, 2026',
    assignedTo: 'Carlo Reyes',
    progress: 85,
  },
  {
    id: 'TSK-003',
    title: 'Q1 VAT Return Filing',
    description: 'Filing of BIR Form 2550Q for the first quarter of 2026.',
    team: 'compliance',
    status: 'pending',
    dueDate: 'Apr 25, 2026',
    assignedTo: 'Maria Santos',
    progress: 0,
  },
  {
    id: 'TSK-004',
    title: 'SSS / PhilHealth / PAGIBIG Remittances — March 2026',
    description: 'Monthly government contribution remittances for all enrolled employees.',
    team: 'account_officer',
    status: 'completed',
    dueDate: 'Mar 20, 2026',
    assignedTo: 'Ana Lim',
    progress: 100,
  },
  {
    id: 'TSK-005',
    title: 'SEC General Information Sheet (GIS) Submission',
    description: 'Annual filing of GIS to the Securities and Exchange Commission.',
    team: 'liaison',
    status: 'in_progress',
    dueDate: 'May 10, 2026',
    assignedTo: 'Carlo Reyes',
    progress: 35,
  },
];

const PROGRESS_BAR_COLOR: Record<TaskStatus, string> = {
  pending:     'bg-slate-300',
  in_progress: 'bg-blue-500',
  for_review:  'bg-amber-500',
  completed:   'bg-emerald-500',
};

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function getGreeting(d: Date) {
  const h = d.getHours();
  if (h < 12) return 'Morning';
  if (h < 18) return 'Afternoon';
  return 'Evening';
}

/* --- Page ------------------------------------------------------- */

export default function BusinessDashboardPage(): React.ReactNode {
  const router = useRouter();
  const params = useParams();
  const businessId = params.businessId as string;
  const { data: session } = authClient.useSession();

  const [now, setNow] = useState(new Date());
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('all');
  const [expandedTask, setExpandedTask] = useState<string | null>(null);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const services = getServices(businessId);
  const userName = session?.user?.name ?? 'there';
  const dateLabel = `${DAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
  const timeLabel = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const activeTasks = MOCK_TASKS.filter(t => t.status !== 'completed');

  const filteredTasks = activeTasks.filter(task => {
    const due = new Date(task.dueDate);
    const y = now.getFullYear();
    const m = now.getMonth();
    if (periodFilter === 'all') return true;
    if (periodFilter === 'month') return due.getFullYear() === y && due.getMonth() === m;
    if (periodFilter === 'quarter') return due.getFullYear() === y && Math.floor(due.getMonth() / 3) === Math.floor(m / 3);
    return due.getFullYear() === y;
  });

  return (
    <div className="space-y-8">

      {/* -- Hero ----------------------------------------------- */}
      <section className="relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-600 via-blue-700 to-blue-900 text-white p-8 shadow-xl">
        <div className="pointer-events-none absolute -top-12 -right-12 h-52 w-52 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-16 right-8 h-72 w-72 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute top-8 right-40 h-20 w-20 rounded-full bg-white/5" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <p className="flex items-center gap-1.5 text-sm font-medium text-blue-200">
              <Calendar size={14} /> {dateLabel}
            </p>
            <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight">
              Good {getGreeting(now)}, <span className="text-blue-200">{userName}</span>
            </h1>
            <p className="mt-1.5 text-sm text-blue-200 font-mono tracking-wide">
              {timeLabel} · {businessId}
            </p>
          </div>

          <button
            onClick={() => router.push(`/${businessId}/timesheet`)}
            className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-blue-700 shadow-md transition-all hover:bg-blue-50 active:scale-[0.97]"
          >
            <Clock size={16} /> Clock In
          </button>
        </div>
      </section>

      {/* ── Task Progress Tracker ─────────────────────────────── */}
      <section className="space-y-4">
        <div className="px-1">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Service Progress</p>
          <h2 className="mt-1 text-lg font-bold text-foreground">Your Task Tracker</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time visibility into your active tasks handled by our team — no need to call.
          </p>
        </div>

        {/* Summary pills */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'In Progress', value: activeTasks.filter(t => t.status === 'in_progress').length, color: 'text-blue-600',  bg: 'bg-blue-50 border-blue-200',   dot: 'bg-blue-500' },
            { label: 'For Review',  value: activeTasks.filter(t => t.status === 'for_review').length,  color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200',  dot: 'bg-amber-500' },
            { label: 'Pending',     value: activeTasks.filter(t => t.status === 'pending').length,     color: 'text-slate-600', bg: 'bg-slate-50 border-slate-200',  dot: 'bg-slate-400' },
          ].map(s => (
            <div key={s.label} className={`rounded-xl border ${s.bg} px-4 py-3 flex items-center gap-3`}>
              <span className={`h-2.5 w-2.5 rounded-full ${s.dot} shrink-0`} />
              <div>
                <p className={`text-xl font-extrabold ${s.color}`}>{s.value}</p>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Period filter + task list */}
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">

          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
            <p className="text-sm font-semibold text-foreground">Active Tasks</p>
            <div className="flex gap-1">
              {(['all', 'month', 'quarter', 'year'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setPeriodFilter(p)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    periodFilter === p
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {p === 'all' ? 'All' : p === 'month' ? 'Monthly' : p === 'quarter' ? 'Quarterly' : 'Yearly'}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-border">
            {filteredTasks.length === 0 && (
              <div className="py-12 text-center text-sm text-muted-foreground">
                No active tasks for this period.
              </div>
            )}
            {filteredTasks.map(task => {
              const barColor = PROGRESS_BAR_COLOR[task.status];
              const isExpanded = expandedTask === task.id;

              return (
                <div key={task.id} className="transition-colors hover:bg-muted/30">
                  <button
                    onClick={() => setExpandedTask(isExpanded ? null : task.id)}
                    className="w-full text-left px-5 py-4"
                  >
                    <div className="flex items-center justify-between gap-4 mb-3">
                      <p className="text-sm font-semibold text-foreground leading-snug flex-1 min-w-0">{task.title}</p>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-bold text-muted-foreground">{task.progress}%</span>
                        {isExpanded
                          ? <ChevronUp size={15} className="text-muted-foreground" />
                          : <ChevronDown size={15} className="text-muted-foreground" />}
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full ${barColor} transition-all duration-700`}
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-border bg-muted/40 px-5 py-4 flex flex-col sm:flex-row gap-4 text-xs">
                      <div className="flex-1">
                        <p className="font-semibold text-muted-foreground uppercase tracking-wide mb-1">Description</p>
                        <p className="text-foreground leading-relaxed">{task.description}</p>
                      </div>
                      <div className="shrink-0 sm:text-right">
                        <p className="font-semibold text-muted-foreground uppercase tracking-wide mb-1">Assigned To</p>
                        <p className="font-medium text-foreground mb-3">{task.assignedTo}</p>
                        <p className="font-semibold text-muted-foreground uppercase tracking-wide mb-1">Due Date</p>
                        <p className="font-medium text-foreground">{task.dueDate}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-center text-[11px] text-muted-foreground pt-1">
          Completed tasks are archived. For urgent concerns, contact your Account Officer.
        </p>
      </section>

      {/* -- Employee Services ----------------------------------- */}
      <section className="space-y-4">
        <div className="px-1">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Employee Services</p>
          <h2 className="mt-1 text-lg font-bold text-foreground">Your Workspace</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {services.map(svc => {
            const Icon = svc.icon;
            return (
              <button
                key={svc.id}
                onClick={() => router.push(svc.href)}
                className="group text-left rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${svc.iconBg} text-white shadow-md transition-transform group-hover:rotate-3 group-hover:scale-105`}>
                  <Icon size={22} />
                </div>
                <h3 className={`font-bold text-base text-foreground transition-colors group-hover:${svc.hoverText}`}>
                  {svc.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{svc.description}</p>
                <span className={`mt-4 inline-flex items-center gap-1 text-xs font-bold ${svc.hoverText} opacity-0 translate-y-1 transition-all group-hover:opacity-100 group-hover:translate-y-0`}>
                  Open <ArrowRight size={12} />
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* -- HR Portal ------------------------------------------- */}
      <section className="space-y-4">
        <div className="px-1">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Enterprise Portal</p>
          <h2 className="mt-1 text-lg font-bold text-foreground">Available Portals</h2>
        </div>

        <button
          onClick={() => router.push(`/${businessId}/hr-portal`)}
          className="group w-full overflow-hidden rounded-2xl border border-border bg-card text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="flex flex-col sm:flex-row">
            <div className="h-1.5 w-full rounded-t-2xl bg-linear-to-r from-teal-500 to-teal-700 sm:h-auto sm:w-1.5 sm:rounded-l-2xl sm:rounded-tr-none" />

            <div className="flex flex-1 flex-col gap-5 p-6 sm:flex-row sm:items-center">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-lg transition-all group-hover:scale-105 group-hover:rotate-3">
                <UserCheck size={28} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-bold text-foreground transition-colors group-hover:text-teal-600">
                    HR Portal
                  </h3>
                  <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-teal-700">
                    Active
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Manage employees, onboarding, payroll coordination, and company HR policies.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {HR_TAGS.map(tag => (
                    <span key={tag} className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="shrink-0 inline-flex items-center gap-2 text-sm font-bold text-teal-600 opacity-0 transition-all group-hover:opacity-100">
                Open Portal <ArrowRight size={16} />
              </div>
            </div>
          </div>
        </button>
      </section>

    </div>
  );
}
