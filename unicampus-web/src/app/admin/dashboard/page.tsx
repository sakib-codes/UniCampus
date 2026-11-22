"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  Briefcase,
  CheckCircle2,
  AlertCircle,
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
import { Badge, Button, PageHeader, Toast } from "@/components/ui";
import { useAdminAuth } from "@/context/AdminAuthContext";
import {
  ACTIVE_TERM,
  CAMPUS_METRICS,
  CANONICAL_DEPARTMENTS,
  CANONICAL_FACULTY,
} from "@/lib/canonicalCampus";
import { INITIAL_TRANSACTIONS } from "@/lib/mockData";
import { adminService } from "@/lib/services/adminService";
import type { AuditLogItem, PaymentTransaction } from "@/types/admin";
import { getAttendanceAlerts, type AttendanceAlertItem } from "@/lib/attendanceService";

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
    time: "12m ago",
    category: "Access",
    title: "Role Assignment",
    description: "Faculty portal role assigned to dr.farhana@unicampus.edu.",
    iconBg: "bg-brand-soft",
    iconColor: "text-brand",
  },
  {
    id: "log-2",
    time: "24m ago",
    category: "Gradebook",
    title: "Gradebook Lock",
    description: `CSE-3101 Sec A marks finalized by ${CANONICAL_FACULTY.name}.`,
    iconBg: "bg-success-light",
    iconColor: "text-success",
  },
  {
    id: "log-3",
    time: "48m ago",
    category: "Routine",
    title: "Master Routine Sync",
    description: "Room allocation verified for Lab 4A (Wednesday 02:45 PM slot).",
    iconBg: "bg-brand-soft",
    iconColor: "text-brand",
  },
  {
    id: "log-4",
    time: "1h ago",
    category: "Snapshot",
    title: "Academic Term Archive",
    description: "Semester gradebook & student registry records archived.",
    iconBg: "bg-surface-2",
    iconColor: "text-fg-muted",
  },
];

export default function AdminDashboardPage() {
  const { effectiveDeptId } = useAdminAuth();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(INITIAL_TRANSACTIONS);
  const [activityLogs, setActivityLogs] = useState<AuditLogItem[]>([]);
  const [attendanceAlerts, setAttendanceAlerts] = useState<AttendanceAlertItem[]>([]);

  const activeDept = useMemo(
    () => CANONICAL_DEPARTMENTS.find((d) => d.id === effectiveDeptId),
    [effectiveDeptId]
  );

  useEffect(() => {
    queueMicrotask(() => {
      setTransactions(adminService.getTransactions());
      setActivityLogs(adminService.getAuditLogs(effectiveDeptId !== "all" ? effectiveDeptId : undefined));
      setAttendanceAlerts(getAttendanceAlerts(effectiveDeptId !== "all" ? effectiveDeptId : undefined));
    });

    const syncAdminData = () => {
      setTransactions(adminService.getTransactions());
      setActivityLogs(adminService.getAuditLogs(effectiveDeptId !== "all" ? effectiveDeptId : undefined));
      setAttendanceAlerts(getAttendanceAlerts(effectiveDeptId !== "all" ? effectiveDeptId : undefined));
    };

    window.addEventListener("unicampus:audit-updated", syncAdminData);
    window.addEventListener("unicampus:gradebook-policy-updated", syncAdminData);
    window.addEventListener("unicampus:profiles-updated", syncAdminData);
    window.addEventListener("unicampus:finance-updated", syncAdminData);
    window.addEventListener("storage", syncAdminData);

    return () => {
      window.removeEventListener("unicampus:audit-updated", syncAdminData);
      window.removeEventListener("unicampus:gradebook-policy-updated", syncAdminData);
      window.removeEventListener("unicampus:profiles-updated", syncAdminData);
      window.removeEventListener("unicampus:finance-updated", syncAdminData);
      window.removeEventListener("storage", syncAdminData);
    };
  }, [effectiveDeptId]);

  // Listen to backup event dispatched from shell controls
  useEffect(() => {
    const handleBackupEvent = () => {
      setToastMessage("Institutional records synchronized: Academic registry archive updated.");
    };

    window.addEventListener("cloud-backup-triggered", handleBackupEvent);
    return () => window.removeEventListener("cloud-backup-triggered", handleBackupEvent);
  }, []);

  const financeSummary = useMemo(() => {
    if (activeDept) {
      const direct = transactions.filter(
        (t) =>
          t.department_name === activeDept.name ||
          t.department_name?.toLowerCase().includes(activeDept.code.toLowerCase())
      );
      if (direct.length > 0) {
        const paidInflow = direct
          .filter((t) => (t.type === "student_fee" || t.type === "late_fine") && t.status === "Paid")
          .reduce((sum, t) => sum + t.amount, 0);
        const pendingDues = direct
          .filter(
            (t) =>
              (t.type === "student_fee" || t.type === "late_fine") &&
              (t.status === "Pending" || t.status === "Overdue")
          )
          .reduce((sum, t) => sum + t.amount, 0);
        const totalWages = direct
          .filter((t) => t.type === "teacher_wage" && t.status === "Paid")
          .reduce((sum, t) => sum + t.amount, 0);
        return { paidInflow, pendingDues, totalWages };
      }
      const ratio = activeDept.students / CAMPUS_METRICS.students;
      return {
        paidInflow: Math.round(143500 * ratio),
        pendingDues: Math.round(327000 * ratio),
        totalWages: Math.round(115000 * (activeDept.faculty / CAMPUS_METRICS.faculty)),
      };
    }

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
  }, [transactions, activeDept]);

  const studentsCount = activeDept ? activeDept.students : CAMPUS_METRICS.students;
  const facultyCount = activeDept ? activeDept.faculty : CAMPUS_METRICS.faculty;
  const deptUsers = activeDept ? activeDept.students + activeDept.faculty : CAMPUS_METRICS.totalUsers;
  const dauCount = activeDept ? Math.round((3110 * deptUsers) / CAMPUS_METRICS.totalUsers) : 3110;
  const activeEngagementPct = ((dauCount / deptUsers) * 100).toFixed(1);

  const departmentDistribution = useMemo(() => {
    if (activeDept) {
      return [
        {
          code: activeDept.code,
          full: activeDept.name,
          count: activeDept.students,
          percent: 100,
        },
      ];
    }
    return CANONICAL_DEPARTMENTS.map((dept) => ({
      code: dept.code,
      full: dept.name,
      count: dept.students,
      percent: Number(((dept.students / CAMPUS_METRICS.students) * 100).toFixed(1)),
    }));
  }, [activeDept]);

  const maxDeptCount = useMemo(
    () => Math.max(...departmentDistribution.map((d) => d.count)),
    [departmentDistribution]
  );

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
        description={
          activeDept
            ? `Institutional summary focused on ${activeDept.name} (${activeDept.code}) departmental scope.`
            : `Institutional summary across ${CAMPUS_METRICS.departmentsCount} academic departments and ${CAMPUS_METRICS.totalUsers.toLocaleString()} portal accounts.`
        }
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-2 border border-line text-xs font-medium text-fg-muted whitespace-nowrap">
              <CalendarClock className="w-3.5 h-3.5 text-brand" />
              <span>{ACTIVE_TERM}</span>
            </span>
            {activeDept && (
              <Badge variant="brand" appearance="soft" dot>
                {activeDept.code} Scope
              </Badge>
            )}
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={() =>
                setToastMessage(
                  `Enrollment CSV exported (${CAMPUS_METRICS.departmentsCount} departments).`
                )
              }
            >
              Export Report
            </Button>
          </div>
        }
      />

      {/* UNIVERSITY KPI BENTO GRID */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5">
        {/* CARD 1: Total Enrolled Students */}
        <Link
          href="/admin/users"
          className="lg:col-span-3 rounded-2xl bg-surface p-5 border border-line flex flex-col hover:border-brand/40 hover:bg-surface-2/40 transition-all duration-140 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <div className="h-9 mb-4 flex items-center justify-between gap-2 shrink-0">
            <span className="text-[13px] font-sans font-medium text-fg-muted group-hover:text-fg transition-colors leading-tight line-clamp-2">
              Total Enrolled Students
            </span>
            <div className="w-9 h-9 rounded-xl bg-brand-soft border border-brand/20 flex items-center justify-center text-brand shrink-0">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="font-bold text-[32px] sm:text-[34px] tracking-tight text-fg mb-2.5 font-sans tabular-nums leading-none shrink-0">
            {studentsCount.toLocaleString()}
          </div>
          <div className="mt-auto min-h-[28px] flex items-center">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="px-2 py-0.5 rounded-full text-xs font-sans tabular-nums font-semibold bg-success-light text-success border border-success/20 inline-flex items-center gap-1 whitespace-nowrap">
                <TrendingUp className="w-3 h-3 text-success shrink-0" />
                {activeDept ? `${((activeDept.students / CAMPUS_METRICS.students) * 100).toFixed(1)}% of campus` : "+6.4% this year"}
              </span>
              <span className="text-xs text-fg-muted font-sans tabular-nums whitespace-nowrap">
                {activeDept ? `Quota: ${activeDept.students.toLocaleString()}` : "vs 4,530 PY"}
              </span>
            </div>
          </div>
        </Link>

        {/* CARD 2: Active Faculty Members */}
        <Link
          href="/admin/departments"
          className="lg:col-span-3 rounded-2xl bg-surface p-5 border border-line flex flex-col hover:border-brand/40 hover:bg-surface-2/40 transition-all duration-140 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <div className="h-9 mb-4 flex items-center justify-between gap-2 shrink-0">
            <span className="text-[13px] font-sans font-medium text-fg-muted group-hover:text-fg transition-colors leading-tight line-clamp-2">
              Active Faculty Members
            </span>
            <div className="w-9 h-9 rounded-xl bg-brand-soft border border-brand/20 flex items-center justify-center text-brand shrink-0">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="font-bold text-[32px] sm:text-[34px] tracking-tight text-fg mb-2.5 font-sans tabular-nums leading-none shrink-0">
            {facultyCount.toLocaleString()}
          </div>
          <div className="mt-auto min-h-[28px] flex items-center">
            <div className="text-[12px] font-sans text-fg-muted">
              {activeDept ? `Faculty of ${activeDept.code} Department` : `Across ${CAMPUS_METRICS.departmentsCount} academic departments`}
            </div>
          </div>
        </Link>

        {/* CARD 3: Daily Active Users */}
        <Link
          href="/admin/analytics"
          className="lg:col-span-3 rounded-2xl bg-surface p-5 border border-line flex flex-col hover:border-brand/40 hover:bg-surface-2/40 transition-all duration-140 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <div className="h-9 mb-4 flex items-center justify-between gap-2 shrink-0">
            <span className="text-[13px] font-sans font-medium text-fg-muted group-hover:text-fg transition-colors leading-tight line-clamp-2">
              Daily Active Users
            </span>
            <div className="w-9 h-9 rounded-xl bg-success-light border border-success/20 flex items-center justify-center text-success shrink-0">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="font-bold text-[32px] sm:text-[34px] tracking-tight text-fg mb-2.5 font-sans tabular-nums leading-none shrink-0">
            {dauCount.toLocaleString()}
          </div>
          <div className="mt-auto min-h-[28px] flex items-center">
            <div className="text-[12px] font-sans text-fg-muted flex items-center gap-1.5 flex-wrap">
              <span className="text-success font-sans font-semibold tabular-nums">
                {activeEngagementPct}%
              </span>
              <span>
                {activeDept ? `of ${deptUsers.toLocaleString()} dept accounts` : `of ${CAMPUS_METRICS.totalUsers.toLocaleString()} portal users`}
              </span>
            </div>
          </div>
        </Link>

        {/* CARD 4: Tuition & Fee Collections */}
        <Link
          href="/admin/finance"
          className="lg:col-span-3 rounded-2xl bg-surface p-5 border border-line flex flex-col hover:border-brand/40 hover:bg-surface-2/40 transition-all duration-140 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <div className="h-9 mb-4 flex items-center justify-between gap-2 shrink-0">
            <span className="text-[13px] font-sans font-medium text-fg-muted group-hover:text-fg transition-colors leading-tight line-clamp-2">
              Tuition &amp; Fee Collections
            </span>
            <div className="w-9 h-9 rounded-xl bg-brand-soft border border-brand/20 flex items-center justify-center text-brand shrink-0">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="font-bold text-[32px] sm:text-[34px] tracking-tight text-fg mb-2.5 font-sans tabular-nums leading-none shrink-0">
            ৳{financeSummary.paidInflow.toLocaleString()}
          </div>
          <div className="mt-auto min-h-[28px] flex items-center">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="px-2 py-0.5 rounded-full text-xs font-sans tabular-nums font-semibold bg-warning-light text-warning border border-warning/20 inline-flex items-center gap-1 whitespace-nowrap">
                <AlertCircle className="w-3 h-3 text-warning shrink-0" />
                ৳{financeSummary.pendingDues.toLocaleString()} pending
              </span>
              <span className="text-xs text-fg-muted font-sans tabular-nums whitespace-nowrap">
                ৳{financeSummary.totalWages.toLocaleString()} payroll
              </span>
            </div>
          </div>
        </Link>
      </section>

      {/* AT-RISK ATTENDANCE WATCHLIST (<75% THRESHOLD) */}
      {attendanceAlerts.length > 0 && (
        <section className="bg-surface rounded-2xl p-5 border border-line">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-line">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-danger-light border border-danger/20 text-danger flex items-center justify-center shrink-0">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-fg flex items-center gap-2">
                  <span>At-Risk Attendance Watchlist (&lt;75% Threshold)</span>
                  <Badge variant="danger" appearance="soft">
                    {attendanceAlerts.reduce((sum, a) => sum + a.lowAttendanceCount, 0)} Students
                  </Badge>
                </h3>
                <p className="text-xs text-fg-muted font-sans">
                  Automated surveillance flagged courses with attendance deficits requiring faculty intervention
                </p>
              </div>
            </div>
            <Link
              href="/admin/analytics"
              className="text-xs font-semibold text-brand hover:underline flex items-center gap-1"
            >
              <span>View Attendance Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-3.5">
            {attendanceAlerts.map((alert) => (
              <div
                key={alert.courseCode}
                className="p-3.5 rounded-xl bg-surface-2 border border-line flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-fg">
                        {alert.courseCode}
                      </span>
                      <span className="text-xs text-fg-muted">
                        {alert.section}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-fg mt-0.5 truncate max-w-[240px]">
                      {alert.courseName}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold font-mono text-danger tabular-nums">
                      {alert.averageAttendance}% avg
                    </span>
                    <div className="text-[11px] text-fg-muted">
                      {alert.lowAttendanceCount} critical
                    </div>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-line/60 flex items-center justify-between text-xs text-fg-muted">
                  <span className="truncate">
                    Flagged: {alert.atRiskStudents.slice(0, 3).join(", ")}
                    {alert.atRiskStudents.length > 3 ? "..." : ""}
                  </span>
                  <span className="text-[11px] font-semibold text-danger shrink-0 ml-2">
                    Notice Pending
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CHARTS & ACTIVITY SPLIT SECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* LEFT PANEL: Department Enrollment Distribution */}
        <div className="lg:col-span-7 bg-surface rounded-2xl p-5 sm:p-6 border border-line flex flex-col justify-between min-h-[430px]">
          <div>
            {/* Header */}
            <div className="border-b border-line pb-4 mb-5">
              <h2 className="font-semibold text-[17px] text-fg tracking-tight flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-brand" />
                <span>Department Enrollment Distribution</span>
              </h2>
              <p className="text-[12px] text-fg-muted mt-0.5 font-sans">
                Active undergraduate &amp; postgraduate headcount by faculty
              </p>
            </div>

            {/* Horizontal Bar Chart */}
            <div className="space-y-4">
              {departmentDistribution.map((dept) => (
                <div key={dept.code} className="space-y-1.5">
                  <div className="flex justify-between items-center gap-2 text-[12px]">
                    <span className="font-medium text-fg flex items-center gap-2 min-w-0">
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
                      style={{ width: `${(dept.count / maxDeptCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Summary Footer */}
          <div className="pt-4 mt-4 border-t border-line flex flex-wrap items-center justify-between text-xs font-sans text-fg-muted gap-2">
            <span>
              {activeDept
                ? `Department enrollment: ${activeDept.name}`
                : `Total across ${CAMPUS_METRICS.departmentsCount} academic departments`}
            </span>
            <span className="text-success font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>
                {activeDept
                  ? "Department within seat quota"
                  : `All ${CAMPUS_METRICS.departmentsCount} faculties within seat quotas`}
              </span>
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
            <div className="divide-y divide-line">
              {(activityLogs.length > 0 ? activityLogs : INITIAL_ACTIVITY_LOGS).slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="py-3 first:pt-0 last:pb-0 flex items-start gap-3 group"
                >
                  <div
                    className={`w-7 h-7 rounded-lg ${log.iconBg || "bg-brand-soft"} border border-line flex items-center justify-center ${log.iconColor || "text-brand"} shrink-0 mt-0.5`}
                  >
                    {log.category === "Access" && <ShieldCheck className="w-3.5 h-3.5" />}
                    {log.category === "Gradebook" && <Lock className="w-3.5 h-3.5" />}
                    {log.category === "Routine" && <CalendarClock className="w-3.5 h-3.5" />}
                    {log.category === "Snapshot" && <Database className="w-3.5 h-3.5" />}
                    {log.category === "Finance" && <CreditCard className="w-3.5 h-3.5" />}
                    {log.category === "Hold" && <AlertCircle className="w-3.5 h-3.5" />}
                    {log.category === "Notice" && <Activity className="w-3.5 h-3.5" />}
                    {log.category === "Curriculum" && <BarChart3 className="w-3.5 h-3.5" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-xs font-sans mb-0.5 gap-2">
                      <span className="font-medium text-fg">{log.title}</span>
                      <span className="text-fg-muted tabular-nums font-sans shrink-0">
                        {log.time}
                      </span>
                    </div>
                    <p className="text-xs text-fg-muted leading-relaxed font-sans">
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
