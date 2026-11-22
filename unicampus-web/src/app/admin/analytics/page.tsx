"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Users,
  ShieldCheck,
  GraduationCap,
  User,
  ClipboardList,
  CreditCard,
  TrendingUp,
  CheckCircle2,
  Clock,
  Megaphone,
  BookOpen,
  RotateCcw,
  Building2,
  CalendarDays,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { adminService } from "@/lib/services/adminService";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { PageHeader, Tabs } from "@/components/ui";
import { Skeleton } from "@/components/ui/Skeleton";
import type {
  ClassRoutine,
  Department,
  Notice,
  PaymentTransaction,
  Profile,
  Subject,
} from "@/types/admin";

const CHART_TOOLTIP_STYLE = {
  backgroundColor: "var(--surface)",
  borderRadius: "12px",
  border: "1px solid var(--line)",
  boxShadow: "var(--shadow-lg)",
  color: "var(--fg)",
  fontSize: "12px",
};

export default function AdminAnalyticsPage() {
  const { effectiveDeptId } = useAdminAuth();
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("month");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isHydrating, setIsHydrating] = useState(true);

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [routines, setRoutines] = useState<ClassRoutine[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);

  const loadLiveMetrics = useCallback(() => {
    setProfiles(adminService.getProfiles());
    setDepartments(adminService.getDepartments());
    setSubjects(adminService.getSubjects());
    setRoutines(adminService.getRoutines());
    setNotices(adminService.getNotices());
    setTransactions(adminService.getTransactions());
  }, []);

  useEffect(() => {
    queueMicrotask(loadLiveMetrics);
    void adminService
      .hydrateFromSupabase()
      .then((hydrated) => {
        if (hydrated) loadLiveMetrics();
      })
      .finally(() => {
        setIsHydrating(false);
      });
  }, [loadLiveMetrics]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await adminService.hydrateFromSupabase(true);
    loadLiveMetrics();
    setTimeout(() => setIsRefreshing(false), 300);
  };

  const activeDept = useMemo(
    () => departments.find((d) => d.id === effectiveDeptId),
    [departments, effectiveDeptId]
  );

  const stats = useMemo(() => {
    const scopedProfiles = activeDept
      ? profiles.filter((p) => p.department_id === activeDept.id)
      : profiles;
    const scopedTxns = activeDept
      ? transactions.filter(
          (t) =>
            t.department_name === activeDept.name ||
            t.department_name?.toLowerCase().includes(activeDept.code.toLowerCase())
        )
      : transactions;
    const scopedSubjects = activeDept
      ? subjects.filter((s) => s.department_id === activeDept.id)
      : subjects;
    const scopedRoutines = activeDept
      ? routines.filter((r) => r.department_name === activeDept.name)
      : routines;
    const scopedNotices = activeDept
      ? notices.filter((n) => n.department_id === activeDept.id || !n.department_id)
      : notices;

    const totalUsers = scopedProfiles.length;
    const activeUsers = scopedProfiles.filter(
      (p) => p.is_approved && p.account_status !== "suspended"
    ).length;
    const students = scopedProfiles.filter((p) => p.role === "student").length;
    const teachers = scopedProfiles.filter((p) => p.role === "teacher").length;
    const pendingApprovals = scopedProfiles.filter(
      (p) => !p.is_approved && p.account_status !== "rejected" && p.account_status !== "suspended"
    ).length;

    const paidTxns = scopedTxns.filter(
      (t) => (t.type === "student_fee" || t.type === "late_fine") && t.status === "Paid"
    );
    const totalRevenue = paidTxns.reduce((sum, t) => sum + t.amount, 0);
    const pendingPayments = scopedTxns
      .filter(
        (t) =>
          (t.type === "student_fee" || t.type === "late_fine") &&
          (t.status === "Pending" || t.status === "Overdue")
      )
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpected = totalRevenue + pendingPayments;
    const collectionRate =
      totalExpected > 0 ? `${((totalRevenue / totalExpected) * 100).toFixed(1)}%` : "—";

    return {
      totalUsers,
      activeUsers,
      students,
      teachers,
      pendingApprovals,
      totalRevenue,
      pendingPayments,
      collectionRate,
      completedTxns: paidTxns.length,
      noticesCount: scopedNotices.length,
      classesCount: scopedRoutines.length,
      coursesCount: scopedSubjects.length,
      departmentsCount: activeDept ? 1 : departments.length,
    };
  }, [activeDept, profiles, transactions, subjects, routines, notices, departments.length]);

  const deptHeadcountChart = useMemo(() => {
    const list = activeDept ? [activeDept] : departments;
    return list.map((d) => ({
      code: d.code,
      Students: profiles.filter((p) => p.role === "student" && p.department_id === d.id).length,
      Faculty: profiles.filter((p) => p.role === "teacher" && p.department_id === d.id).length,
    }));
  }, [activeDept, departments, profiles]);

  return (
    <div className="w-full space-y-6 pb-8">
      <PageHeader
        title="Analytics & Reports"
        description={`Live campus metrics across ${stats.departmentsCount} ${
          stats.departmentsCount === 1 ? "department" : "departments"
        } and ${stats.totalUsers.toLocaleString()} portal ${
          stats.totalUsers === 1 ? "account" : "accounts"
        }.`}
        actions={
          <div className="flex items-center gap-2">
            {/* Spring-Animated Segmented Time Filter */}
            <Tabs
              tabs={[
                { id: "week" as const, label: "Week" },
                { id: "month" as const, label: "Month" },
                { id: "year" as const, label: "Year" },
              ]}
              value={timeRange}
              onChange={setTimeRange}
              layoutId="admin-analytics-time-range"
              size="sm"
              ariaLabel="Analytics time range"
            />
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              aria-label="Refresh analytics"
              className="w-10 h-10 rounded-xl bg-surface border border-line inline-flex items-center justify-center text-fg-muted hover:text-fg transition-colors cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </button>
          </div>
        }
      />

      {/* Section 1: User Analytics (5 Equal Cards) */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold text-fg-muted flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-brand" />
          <span>User Analytics</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { label: "Total Users", value: stats.totalUsers, icon: Users, tone: "bg-brand-soft text-brand" },
            { label: "Active Users", value: stats.activeUsers, icon: ShieldCheck, tone: "bg-success-light text-success" },
            { label: "Students", value: stats.students, icon: GraduationCap, tone: "bg-brand-soft text-brand" },
            { label: "Faculty", value: stats.teachers, icon: User, tone: "bg-warning-light text-warning" },
            { label: "Pending Approvals", value: stats.pendingApprovals, icon: ClipboardList, tone: "bg-surface-2 text-fg-muted" },
          ].map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div key={kpi.label} className="p-4 rounded-2xl bg-surface border border-line space-y-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${kpi.tone}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  {isHydrating && profiles.length === 0 ? (
                    <Skeleton variant="text" className="h-7 w-14 mb-1" />
                  ) : (
                    <div className="text-2xl font-semibold text-fg tabular-nums">
                      {kpi.value.toLocaleString()}
                    </div>
                  )}
                  <div className="text-xs text-fg-muted mt-0.5">{kpi.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 2: Financial Overview (Balanced 4 Equal Columns) */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold text-fg-muted flex items-center gap-1.5">
          <CreditCard className="w-3.5 h-3.5 text-brand" />
          <span>Financial Overview</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Total Revenue",
              sub: "Completed tuition & fees",
              value: `৳${stats.totalRevenue.toLocaleString()}`,
              icon: CreditCard,
              tone: "bg-success-light text-success",
            },
            {
              label: "Pending Payments",
              sub: "Awaiting collection",
              value: `৳${stats.pendingPayments.toLocaleString()}`,
              icon: Clock,
              tone: "bg-warning-light text-warning",
            },
            {
              label: "Collection Rate",
              sub: "Paid vs total billed",
              value: stats.collectionRate,
              icon: TrendingUp,
              tone: "bg-success-light text-success",
            },
            {
              label: "Completed Transactions",
              sub: "Verified receipts",
              value: stats.completedTxns.toLocaleString(),
              icon: CheckCircle2,
              tone: "bg-brand-soft text-brand",
            },
          ].map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div key={kpi.label} className="p-5 rounded-2xl bg-surface border border-line space-y-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${kpi.tone}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-2xl font-semibold text-fg tabular-nums">{kpi.value}</div>
                  <div className="text-xs font-medium text-fg mt-0.5">{kpi.label}</div>
                  <div className="text-[11px] text-fg-muted">{kpi.sub}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 3: Academic Operations (Consistent 4 Equal Left-Aligned Cards) */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold text-fg-muted flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-brand" />
          <span>Academic Operations</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Departments",
              sub: "Active academic faculties",
              value: stats.departmentsCount.toLocaleString(),
              icon: Building2,
              tone: "bg-brand-soft text-brand",
            },
            {
              label: "Curriculum Subjects",
              sub: "4-Year / 8-Semester catalog",
              value: stats.coursesCount.toLocaleString(),
              icon: BookOpen,
              tone: "bg-success-light text-success",
            },
            {
              label: "Scheduled Classes",
              sub: "Weekly routine slots",
              value: stats.classesCount.toLocaleString(),
              icon: CalendarDays,
              tone: "bg-brand-soft text-brand",
            },
            {
              label: "Published Notices",
              sub: "Active campus broadcasts",
              value: stats.noticesCount.toLocaleString(),
              icon: Megaphone,
              tone: "bg-warning-light text-warning",
            },
          ].map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div key={kpi.label} className="p-5 rounded-2xl bg-surface border border-line space-y-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${kpi.tone}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-2xl font-semibold text-fg tabular-nums">{kpi.value}</div>
                  <div className="text-xs font-medium text-fg mt-0.5">{kpi.label}</div>
                  <div className="text-[11px] text-fg-muted">{kpi.sub}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Live Department Headcount Chart */}
      <div className="p-6 rounded-2xl bg-surface border border-line space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-fg">Department Headcount Overview</h3>
          <p className="text-xs text-fg-muted mt-0.5">
            Live registered students and faculty per department
          </p>
        </div>

        {deptHeadcountChart.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-line rounded-xl bg-surface-2/40 space-y-1.5">
            <p className="text-sm font-semibold text-fg">No department data to chart yet</p>
            <p className="text-xs text-fg-muted">
              Charts will populate automatically once you create departments and approve students or faculty.
            </p>
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptHeadcountChart} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
                <XAxis dataKey="code" tick={{ fill: "var(--fg-muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: "var(--fg-muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                <Bar dataKey="Students" fill="var(--brand)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Faculty" fill="var(--success)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
