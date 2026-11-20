"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  Briefcase,
  CheckCircle2,
  CreditCard,
  BarChart3,
  TrendingUp,
  CalendarClock,
  ShieldCheck,
  Lock,
  Database,
  ArrowRight,
  Download,
  Activity,
} from "lucide-react";
import { PageHeader, Toast } from "@/components/ui";
import {
  ACTIVE_TERM,
  CAMPUS_METRICS,
  CANONICAL_DEPARTMENTS,
  CANONICAL_FACULTY,
} from "@/lib/canonicalCampus";
import { INITIAL_TRANSACTIONS } from "@/lib/mockData";
import { adminService } from "@/lib/services/adminService";
import type { PaymentTransaction } from "@/types/admin";

interface ActivityLogRow {
  id: string;
  time: string;
  category: "Access" | "Gradebook" | "Routine" | "Snapshot";
  title: string;
  description: string;
  iconBg: string;
  iconColor: string;
}

const INITIAL_ACTIVITY_LOGS: ActivityLogRow[] = [
  {
    id: "log-1",
    time: "17:52:10",
    category: "Access",
    title: "Role Assignment",
    description: "Faculty portal role assigned to dr.farhana@unicampus.edu.",
    iconBg: "bg-brand-soft",
    iconColor: "text-brand",
  },
  {
    id: "log-2",
    time: "17:40:04",
    category: "Gradebook",
    title: "Gradebook Lock",
    description: `CSE-3101 Sec A marks finalized by ${CANONICAL_FACULTY.name}.`,
    iconBg: "bg-success-light",
    iconColor: "text-success",
  },
  {
    id: "log-3",
    time: "17:15:39",
    category: "Routine",
    title: "Master Routine Sync",
    description: "Room allocation verified for Lab 4A (Wednesday 02:45 PM slot).",
    iconBg: "bg-brand-soft",
    iconColor: "text-brand",
  },
  {
    id: "log-4",
    time: "16:58:22",
    category: "Snapshot",
    title: "Academic Term Archive",
    description: "Semester gradebook & student registry records archived.",
    iconBg: "bg-surface-2",
    iconColor: "text-fg-muted",
  },
];

const DEPARTMENT_DISTRIBUTION = CANONICAL_DEPARTMENTS.map((dept) => ({
  code: dept.code,
  full: dept.name,
  count: dept.students,
  percent: Number(((dept.students / CAMPUS_METRICS.students) * 100).toFixed(1)),
}));

export default function AdminDashboardPage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(INITIAL_TRANSACTIONS);

  useEffect(() => {
    queueMicrotask(() => {
      setTransactions(adminService.getTransactions());
    });
  }, []);

  // Listen to backup event dispatched from shell controls
  useEffect(() => {
    const handleBackupEvent = () => {
      setToastMessage("Institutional records synchronized: Academic registry archive updated.");
    };

    window.addEventListener("cloud-backup-triggered", handleBackupEvent);
    return () => window.removeEventListener("cloud-backup-triggered", handleBackupEvent);
  }, []);

  const financeSummary = useMemo(() => {
    const paidInflow = transactions
      .filter((t) => (t.type === "student_fee" || t.type === "late_fine") && t.status === "Paid")
      .reduce((sum, t) => sum + t.amount, 0);

    const pendingDues = transactions
      .filter(
        (t) =>
          (t.type === "student_fee" || t.type === "late_fine") &&
          (t.status === "Pending" || t.status === "Overdue")
      )
      .reduce((sum, t) => sum + t.amount, 0);

    const totalWages = transactions
      .filter((t) => t.type === "teacher_wage" && t.status === "Paid")
      .reduce((sum, t) => sum + t.amount, 0);

    return { paidInflow, pendingDues, totalWages };
  }, [transactions]);

  const activeEngagementPct = ((3110 / CAMPUS_METRICS.totalUsers) * 100).toFixed(1);

  return (
    <div className="w-full space-y-6 pb-20">
      <Toast
        open={Boolean(toastMessage)}
        message={toastMessage ?? ""}
        tone="success"
        durationMs={3500}
        onClose={() => setToastMessage(null)}
      />

      <PageHeader
        title="Campus Overview"
        description={`Institutional summary across ${CAMPUS_METRICS.departmentsCount} academic departments and ${CAMPUS_METRICS.totalUsers.toLocaleString()} portal accounts.`}
      />

      {/* UNIVERSITY KPI BENTO GRID */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5">
        {/* CARD 1: Total Enrolled Students */}
        <div className="lg:col-span-3 rounded-2xl bg-surface p-5 border border-line flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] font-sans font-medium text-fg-muted">
              Total Enrolled Students
            </span>
            <div className="w-9 h-9 rounded-xl bg-brand-soft border border-brand/20 flex items-center justify-center text-brand">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-bold text-[32px] sm:text-[34px] tracking-tight text-fg mb-2 font-sans tabular-nums">
              {CAMPUS_METRICS.students.toLocaleString()}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-xs font-sans tabular-nums font-semibold bg-success-light text-success border border-success/20 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-success" />
                +6.4% this year
              </span>
              <span className="text-xs text-fg-muted font-sans tabular-nums">
                vs 4,530 PY
              </span>
            </div>
          </div>
        </div>

        {/* CARD 2: Active Faculty Members */}
        <div className="lg:col-span-3 rounded-2xl bg-surface p-5 border border-line flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] font-sans font-medium text-fg-muted">
              Active Faculty Members
            </span>
            <div className="w-9 h-9 rounded-xl bg-brand-soft border border-brand/20 flex items-center justify-center text-brand">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-bold text-[32px] sm:text-[34px] tracking-tight text-fg mb-2 font-sans tabular-nums">
              {CAMPUS_METRICS.faculty.toLocaleString()}
            </div>
            <div className="text-[12px] font-sans text-fg-muted">
              Across {CAMPUS_METRICS.departmentsCount} academic departments
            </div>
          </div>
        </div>

        {/* CARD 3: Daily Active Users */}
        <div className="lg:col-span-3 rounded-2xl bg-surface p-5 border border-line flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] font-sans font-medium text-fg-muted">
              Daily Active Users
            </span>
            <div className="w-9 h-9 rounded-xl bg-success-light border border-success/20 flex items-center justify-center text-success">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-bold text-[32px] sm:text-[34px] tracking-tight text-fg mb-2 font-sans tabular-nums">
              3,110
            </div>
            <div className="text-[12px] font-sans text-fg-muted flex items-center gap-1.5 flex-wrap">
              <span className="text-success font-sans font-semibold tabular-nums">
                {activeEngagementPct}%
              </span>
              <span>of {CAMPUS_METRICS.totalUsers.toLocaleString()} portal users</span>
            </div>
          </div>
        </div>

        {/* CARD 4: Tuition & Fee Collections */}
        <div className="lg:col-span-3 rounded-2xl bg-surface p-5 border border-line flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] font-sans font-medium text-fg-muted">
              Tuition &amp; Fee Collections
            </span>
            <div className="w-9 h-9 rounded-xl bg-brand-soft border border-brand/20 flex items-center justify-center text-brand">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-bold text-[32px] sm:text-[34px] tracking-tight text-fg mb-2 font-sans tabular-nums">
              ৳{financeSummary.paidInflow.toLocaleString()}
            </div>
            <div className="flex items-center">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-sans tabular-nums font-semibold bg-success-light text-success border border-success/20 inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                <span>
                  ৳{financeSummary.pendingDues.toLocaleString()} pending • ৳
                  {financeSummary.totalWages.toLocaleString()} payroll
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CHARTS & ACTIVITY SPLIT SECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANEL: Department Enrollment Distribution */}
        <div className="lg:col-span-7 bg-surface rounded-2xl p-5 sm:p-6 border border-line flex flex-col justify-between min-h-[430px]">
          <div>
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4 mb-5">
              <div>
                <h2 className="font-semibold text-[17px] text-fg tracking-tight flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-brand" />
                  <span>Department Enrollment Distribution</span>
                </h2>
                <p className="text-[12px] text-fg-muted mt-0.5 font-sans">
                  Active undergraduate &amp; postgraduate headcount by faculty
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-sans font-medium px-2.5 py-1 rounded-lg bg-surface-2 border border-line text-fg-muted whitespace-nowrap">
                  {ACTIVE_TERM}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setToastMessage(
                      `Enrollment CSV exported (${CAMPUS_METRICS.departmentsCount} departments).`
                    )
                  }
                  className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-xl text-fg-muted hover:text-fg hover:bg-surface-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  title="Export Enrollment CSV"
                  aria-label="Export Enrollment CSV"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Horizontal Bar Chart */}
            <div className="space-y-4">
              {DEPARTMENT_DISTRIBUTION.map((dept) => (
                <div key={dept.code} className="space-y-1.5">
                  <div className="flex justify-between items-center gap-2 text-[12px]">
                    <span className="font-medium text-fg flex items-center gap-2 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-sm bg-brand shrink-0" />
                      <span className="shrink-0">{dept.code}</span>
                      <span className="text-fg-muted font-normal text-xs truncate">
                        ({dept.full})
                      </span>
                    </span>
                    <span className="font-sans text-fg font-semibold tabular-nums shrink-0">
                      {dept.count.toLocaleString()}{" "}
                      <span className="text-fg-muted font-normal text-xs">
                        ({dept.percent}%)
                      </span>
                    </span>
                  </div>
                  <div className="w-full h-3 bg-surface-2 rounded-full overflow-hidden p-0.5 border border-line">
                    <div
                      className="h-full rounded-full bg-brand transition-[width] duration-300"
                      style={{ width: `${dept.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Summary Footer */}
          <div className="pt-4 mt-4 border-t border-line flex flex-wrap items-center justify-between text-xs font-sans text-fg-muted gap-2">
            <span>
              Total across {CAMPUS_METRICS.departmentsCount} academic departments
            </span>
            <span className="text-success font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>All {CAMPUS_METRICS.departmentsCount} faculties within seat quotas</span>
            </span>
          </div>
        </div>

        {/* RIGHT PANEL: Recent Administrative Activity */}
        <div className="lg:col-span-5 bg-surface rounded-2xl p-5 sm:p-6 border border-line flex flex-col justify-between min-h-[430px]">
          <div>
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-line pb-4 mb-4">
              <div>
                <h2 className="font-semibold text-[17px] text-fg tracking-tight flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-success shrink-0" />
                  <span>Recent Administrative Activity</span>
                </h2>
                <p className="text-[12px] text-fg-muted mt-0.5 font-sans">
                  Recent role updates, gradebook locks, and schedule changes
                </p>
              </div>
            </div>

            {/* Activity Log Rows */}
            <div className="space-y-2.5">
              {INITIAL_ACTIVITY_LOGS.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-surface-2 border border-line hover:border-brand/40 transition-colors flex items-start gap-3"
                >
                  <div
                    className={`w-7 h-7 rounded-lg ${log.iconBg} border border-line flex items-center justify-center ${log.iconColor} shrink-0 mt-0.5`}
                  >
                    {log.category === "Access" && <ShieldCheck className="w-3.5 h-3.5" />}
                    {log.category === "Gradebook" && <Lock className="w-3.5 h-3.5" />}
                    {log.category === "Routine" && <CalendarClock className="w-3.5 h-3.5" />}
                    {log.category === "Snapshot" && <Database className="w-3.5 h-3.5" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-xs font-sans mb-0.5 gap-2">
                      <span className={`font-semibold ${log.iconColor}`}>{log.title}</span>
                      <span className="text-fg-muted tabular-nums font-sans shrink-0">
                        {log.time}
                      </span>
                    </div>
                    <p className="text-xs text-fg leading-relaxed font-sans">
                      {log.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Activity CTA */}
          <div className="pt-3 mt-4 border-t border-line flex items-center justify-between gap-2">
            <span className="text-xs font-sans text-fg-muted">
              Campus Activity Ledger
            </span>
            <Link
              href="/admin/analytics"
              className="text-xs font-sans font-semibold text-brand hover:underline flex items-center gap-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-md px-1"
            >
              <span>View Full Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
