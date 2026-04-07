'use client';

// src/components/hr/HRDashboard.tsx
import React from 'react';
import {
  Users, CalendarDays, Clock, FileQuestion,
  TrendingUp, AlertTriangle, CheckCircle,
} from 'lucide-react';
import { Card } from '@/components/UI/Card';
import { Badge } from '@/components/UI/Badge';
import {
  EMPLOYEES,
  LEAVE_REQUESTS,
  HR_REQUESTS,
  ATTENDANCE_RECORDS,
  PAYROLL_RECORDS,
} from '@/lib/mock-hr-data';

// ── Types ────────────────────────────────────────────────────────────────────

interface ActionItem {
  id: string;
  type: string;
  employeeName: string;
  description: string;
  date: string;
}

interface DashboardData {
  employees: {
    active: number;
    total: number;
    byDepartment: { name: string; count: number }[];
  };
  pendingRequests: {
    leaveCount: number;
    overtimeCount: number;
    coaCount: number;
    total: number;
    items: ActionItem[];
  };
  todayAttendance: {
    present: number;
    late: number;
    absent: number;
    onLeave: number;
    total: number;
  };
  latestPayrollPeriod: {
    id: number;
    startDate: string;
    endDate: string;
    payoutDate: string;
    status: string;
    scheduleName: string | null;
    employeeCount: number;
    grossPayTotal: number;
    netPayTotal: number;
    approvedCount: number;
    pendingCount: number;
  } | null;
}

// ── Derive dashboard data from mock ───────────────────────────────────────────

const MOCK_ATTENDANCE_DATE = '2025-06-23';

const _activeEmployees = EMPLOYEES.filter(e => e.status !== 'Resigned');
const _deptMap = new Map<string, number>();
for (const emp of _activeEmployees) {
  _deptMap.set(emp.department, (_deptMap.get(emp.department) ?? 0) + 1);
}
const _byDepartment = [..._deptMap.entries()]
  .map(([name, count]) => ({ name, count }))
  .sort((a, b) => b.count - a.count);

const _pendingLeaves = LEAVE_REQUESTS.filter(l => l.status === 'Pending');
const _openRequests = HR_REQUESTS.filter(r => r.status === 'Open' || r.status === 'In Progress');
const _todayRecords = ATTENDANCE_RECORDS.filter(a => a.date === MOCK_ATTENDANCE_DATE);

const _actionItems: ActionItem[] = [
  ..._pendingLeaves.slice(0, 3).map(l => ({
    id: l.id,
    type: 'Leave',
    employeeName: l.employeeName,
    description: `${l.leaveType} · ${l.totalDays} day${l.totalDays > 1 ? 's' : ''} · ${l.startDate}`,
    date: l.appliedDate,
  })),
  ..._openRequests.slice(0, 3).map(r => ({
    id: r.id,
    type: 'Attendance Correction',
    employeeName: r.employeeName,
    description: r.subject,
    date: r.submittedDate,
  })),
].slice(0, 5);

const _jun1630 = PAYROLL_RECORDS.filter(p => p.payPeriod === 'June 16-30, 2025');

const MOCK_DASHBOARD_DATA: DashboardData = {
  employees: {
    active: EMPLOYEES.filter(e => e.status === 'Active' || e.status === 'Probationary').length,
    total: _activeEmployees.length,
    byDepartment: _byDepartment,
  },
  pendingRequests: {
    leaveCount: _pendingLeaves.length,
    overtimeCount: 0,
    coaCount: _openRequests.filter(r => r.requestType === 'Certificate of Employment').length,
    total: _pendingLeaves.length + _openRequests.length,
    items: _actionItems,
  },
  todayAttendance: {
    present: _todayRecords.filter(a => a.status === 'Present').length,
    late: _todayRecords.filter(a => a.status === 'Late').length,
    absent: _todayRecords.filter(a => a.status === 'Absent').length,
    onLeave: _todayRecords.filter(a => a.status === 'On Leave').length,
    total: _todayRecords.length,
  },
  latestPayrollPeriod: {
    id: 2,
    startDate: '2025-06-16',
    endDate: '2025-06-30',
    payoutDate: '2025-07-05',
    status: 'PROCESSING',
    scheduleName: 'Semi-monthly',
    employeeCount: _jun1630.length,
    grossPayTotal: _jun1630.reduce((s, p) => s + p.basicPay + p.overtime + p.allowances, 0),
    netPayTotal: _jun1630.reduce((s, p) => s + p.netPay, 0),
    approvedCount: _jun1630.filter(p => p.status === 'Completed').length,
    pendingCount: _jun1630.filter(p => p.status !== 'Completed').length,
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const PERIOD_STATUS_VARIANT: Record<string, 'success' | 'warning' | 'info' | 'neutral' | 'danger'> = {
  DRAFT:      'neutral',
  PROCESSING: 'warning',
  APPROVED:   'info',
  PAID:       'success',
  CLOSED:     'neutral',
};

const PERIOD_STATUS_LABEL: Record<string, string> = {
  DRAFT:      'Draft',
  PROCESSING: 'Processing',
  APPROVED:   'Approved',
  PAID:       'Paid',
  CLOSED:     'Closed',
};

const ACTION_TYPE_COLOR: Record<string, { bg: string; icon: string; text: string; sub: string }> = {
  'Leave':                { bg: 'bg-amber-50', icon: 'text-amber-500', text: 'text-amber-700', sub: 'text-amber-600' },
  'Overtime':             { bg: 'bg-violet-50', icon: 'text-violet-500', text: 'text-violet-700', sub: 'text-violet-600' },
  'Attendance Correction':{ bg: 'bg-blue-50', icon: 'text-blue-500', text: 'text-blue-700', sub: 'text-blue-600' },
};

function fmtPeso(n: number): string {
  return `₱${n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtDateDisplay(iso: string): string {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-PH', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

function todayDisplay(): string {
  return new Date().toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' });
}

// ── Component ─────────────────────────────────────────────────────────────────

export function HRDashboard(): React.ReactNode {
  const data = MOCK_DASHBOARD_DATA;
  const { employees, pendingRequests, todayAttendance, latestPayrollPeriod } = data;

  const maxDeptCount = employees.byDepartment[0]?.count ?? 1;

  const kpiCards = [
    {
      label: 'Active Employees',
      value: employees.active,
      sub: `of ${employees.total} total`,
      icon: Users,
      iconColor: 'bg-rose-50 text-rose-600',
    },
    {
      label: 'Pending Leaves',
      value: pendingRequests.leaveCount,
      sub: 'awaiting approval',
      icon: CalendarDays,
      iconColor: 'bg-amber-50 text-amber-600',
    },
    {
      label: 'Pending Requests',
      value: pendingRequests.total,
      sub: `OT: ${pendingRequests.overtimeCount} · COA: ${pendingRequests.coaCount}`,
      icon: FileQuestion,
      iconColor: 'bg-blue-50 text-blue-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">HR Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Overview of people operations & compliance</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label} className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${kpi.iconColor}`}>
                  <Icon size={20} />
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900">{kpi.value}</p>
              <p className="text-sm font-bold text-slate-700 mt-1">{kpi.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{kpi.sub}</p>
            </Card>
          );
        })}
      </div>

      {/* Attendance + Action Required */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Today's Attendance */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={18} className="text-rose-600" />
            <h2 className="text-sm font-bold text-slate-900">Today&apos;s Attendance</h2>
            <span className="text-xs text-slate-400 ml-auto">{todayDisplay()}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Present', count: todayAttendance.present, textColor: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Late',    count: todayAttendance.late,    textColor: 'text-amber-600',   bg: 'bg-amber-50'   },
              { label: 'Absent',  count: todayAttendance.absent,  textColor: 'text-red-600',     bg: 'bg-red-50'     },
              { label: 'On Leave',count: todayAttendance.onLeave, textColor: 'text-blue-600',    bg: 'bg-blue-50'    },
            ].map(item => (
              <div key={item.label} className={`rounded-xl p-3 text-center ${item.bg}`}>
                <p className={`text-2xl font-black ${item.textColor}`}>{item.count}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider mt-1 text-slate-500">{item.label}</p>
              </div>
            ))}
          </div>
          {todayAttendance.total === 0 && (
            <p className="text-xs text-slate-400 mt-3 text-center italic">No timesheet entries for today yet</p>
          )}
        </Card>

        {/* Action Required */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={18} className="text-amber-500" />
            <h2 className="text-sm font-bold text-slate-900">Action Required</h2>
            {pendingRequests.total > 0 && (
              <Badge variant="warning" className="ml-auto text-[10px]">
                {pendingRequests.total} pending
              </Badge>
            )}
          </div>
          {pendingRequests.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-slate-400">
              <CheckCircle size={28} className="text-emerald-400 mb-2" />
              <p className="text-sm font-medium text-emerald-600">All caught up!</p>
              <p className="text-xs text-slate-400 mt-1">No pending HR requests</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {pendingRequests.items.map(item => {
                const colors = ACTION_TYPE_COLOR[item.type] ?? ACTION_TYPE_COLOR['Leave'];
                const Icon = item.type === 'Leave' ? CalendarDays
                  : item.type === 'Overtime' ? Clock
                  : FileQuestion;
                return (
                  <div key={item.id} className={`flex items-start gap-3 p-3 rounded-lg ${colors.bg}`}>
                    <Icon size={15} className={`${colors.icon} mt-0.5 shrink-0`} />
                    <div className="min-w-0">
                      <p className={`text-xs font-bold ${colors.text} truncate`}>
                        {item.employeeName}
                        <span className="font-normal ml-1 opacity-70">· {item.type}</span>
                      </p>
                      <p className={`text-[11px] ${colors.sub} mt-0.5`}>{item.description}</p>
                    </div>
                  </div>
                );
              })}
              {pendingRequests.total > 5 && (
                <p className="text-[11px] text-center text-slate-400 pt-1">
                  +{pendingRequests.total - 5} more pending requests
                </p>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* Payroll + Department Headcount */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Latest Payroll Period */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-rose-600" />
            <h2 className="text-sm font-bold text-slate-900">Latest Payroll Period</h2>
            {latestPayrollPeriod && (
              <Badge
                variant={PERIOD_STATUS_VARIANT[latestPayrollPeriod.status] ?? 'neutral'}
                className="ml-auto text-[10px]"
              >
                {PERIOD_STATUS_LABEL[latestPayrollPeriod.status] ?? latestPayrollPeriod.status}
              </Badge>
            )}
          </div>
          {latestPayrollPeriod ? (
            <>
              <p className="text-xs text-slate-500 mb-4">
                {fmtDateDisplay(latestPayrollPeriod.startDate)} — {fmtDateDisplay(latestPayrollPeriod.endDate)}
                {latestPayrollPeriod.scheduleName && (
                  <span className="ml-1 text-slate-400">· {latestPayrollPeriod.scheduleName}</span>
                )}
              </p>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-xs text-slate-500">Total Net Pay</span>
                  <span className="text-sm font-black text-slate-900">{fmtPeso(latestPayrollPeriod.netPayTotal)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-xs text-slate-500">Total Gross Pay</span>
                  <span className="text-sm font-bold text-slate-700">{fmtPeso(latestPayrollPeriod.grossPayTotal)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-xs text-slate-500">Employees</span>
                  <span className="text-sm font-bold text-slate-700">{latestPayrollPeriod.employeeCount}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-xs text-slate-500">Approved Payslips</span>
                  <span className="text-sm font-bold text-emerald-600">{latestPayrollPeriod.approvedCount}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-xs text-slate-500">Pending Approval</span>
                  <span className="text-sm font-bold text-amber-600">{latestPayrollPeriod.pendingCount}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-slate-400">
              <TrendingUp size={28} className="mb-2 opacity-30" />
              <p className="text-sm">No payroll periods yet</p>
            </div>
          )}
        </Card>

        {/* Department Headcount */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle size={18} className="text-rose-600" />
            <h2 className="text-sm font-bold text-slate-900">Department Headcount</h2>
          </div>
          {employees.byDepartment.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-slate-400">
              <Users size={28} className="mb-2 opacity-30" />
              <p className="text-sm">No departments found</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {employees.byDepartment.map(dept => {
                const pct = Math.round((dept.count / maxDeptCount) * 100);
                return (
                  <div key={dept.name} className="flex items-center gap-3">
                    <span className="text-xs text-slate-600 w-28 truncate shrink-0">{dept.name}</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-rose-500 h-full rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-700 w-6 text-right shrink-0">{dept.count}</span>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
