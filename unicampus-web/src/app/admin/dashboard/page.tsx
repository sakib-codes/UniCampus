"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Users,
  Briefcase,
  CheckCircle2,
  CreditCard,
  BarChart3,
  CalendarClock,
  ShieldCheck,
  Lock,
  Database,
  ArrowRight,
  Download,
  Activity,
  Building2,
  Plus,
} from "lucide-react";
import { Badge, Button, PageHeader, Toast } from "@/components/ui";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { ACTIVE_TERM } from "@/lib/canonicalCampus";
import { adminService } from "@/lib/services/adminService";
import type { AuditLogItem, Department, PaymentTransaction, Profile } from "@/types/admin";

export default function AdminDashboardPage() {
  const { effectiveDeptId } = useAdminAuth();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [activityLogs, setActivityLogs] = useState<AuditLogItem[]>([]);

  const syncLiveData = useCallback(() => {
    setProfiles(adminService.getProfiles());
    setDepartments(adminService.getDepartments());
    setTransactions(adminService.getTransactions());
    setActivityLogs(
      adminService.getAuditLogs(effectiveDeptId !== "all" ? effectiveDeptId : undefined)
    );
  }, [effectiveDeptId]);

  useEffect(() => {
    queueMicrotask(syncLiveData);
    void adminService
      .hydrateFromSupabase()
      .then((hydrated) => {
        if (hydrated) syncLiveData();
      })
      .finally(() => {
        setIsHydrating(false);
      });

    window.addEventListener("unicampus:audit-updated", syncLiveData);
    window.addEventListener("unicampus:profiles-updated", syncLiveData);
    window.addEventListener("unicampus:departments-updated", syncLiveData);
    window.addEventListener("unicampus:finance-updated", syncLiveData);
    window.addEventListener("storage", syncLiveData);

    return () => {
      window.removeEventListener("unicampus:audit-updated", syncLiveData);
      window.removeEventListener("unicampus:profiles-updated", syncLiveData);
      window.removeEventListener("unicampus:departments-updated", syncLiveData);
      window.removeEventListener("unicampus:finance-updated", syncLiveData);
      window.removeEventListener("storage", syncLiveData);
    };
  }, [syncLiveData]);

  const activeDept = useMemo(
    () => departments.find((d) => d.id === effectiveDeptId),
    [departments, effectiveDeptId]
  );

  const scopedProfiles = useMemo(() => {
    if (!activeDept) return profiles;
    return profiles.filter((p) => p.department_id === activeDept.id);
  }, [profiles, activeDept]);

  const metrics = useMemo(() => {
    const students = scopedProfiles.filter((p) => p.role === "student").length;
    const faculty = scopedProfiles.filter((p) => p.role === "teacher").length;
    const pending = scopedProfiles.filter(
      (p) => !p.is_approved && p.account_status !== "rejected" && p.account_status !== "suspended"
    ).length;
    const active = scopedProfiles.filter((p) => p.is_approved && p.account_status !== "suspended").length;

    const scopedTxns = activeDept
      ? transactions.filter(
          (t) =>
            t.department_name === activeDept.name ||
            t.department_name?.toLowerCase().includes(activeDept.code.toLowerCase())
        )
      : transactions;

    const paidInflow = scopedTxns
      .filter((t) => (t.type === "student_fee" || t.type === "late_fine") && t.status === "Paid")
      .reduce((sum, t) => sum + t.amount, 0);
    const pendingDues = scopedTxns
      .filter(
        (t) =>
          (t.type === "student_fee" || t.type === "late_fine") &&
          (t.status === "Pending" || t.status === "Overdue")
      )
      .reduce((sum, t) => sum + t.amount, 0);
    const totalWages = scopedTxns
      .filter((t) => t.type === "teacher_wage" && t.status === "Paid")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalUsers: scopedProfiles.length,
      students,
      faculty,
      pending,
      active,
      paidInflow,
      pendingDues,
      totalWages,
    };
  }, [scopedProfiles, transactions, activeDept]);

  const departmentDistribution = useMemo(() => {
    const list = activeDept ? [activeDept] : departments;
    const totalStudents = Math.max(
      1,
      list.reduce(
        (sum, d) =>
          sum + profiles.filter((p) => p.role === "student" && p.department_id === d.id).length,
        0
      )
    );
    return list.map((d) => {
      const count = profiles.filter((p) => p.role === "student" && p.department_id === d.id).length;
      return {
        id: d.id,
        code: d.code,
        name: d.name,
        count,
        pct: Math.round((count / totalStudents) * 100),
      };
    });
  }, [departments, activeDept, profiles]);

  const showColdSkeleton = isHydrating && profiles.length === 0 && departments.length === 0;

  return (
    <div className="w-full space-y-6 pb-8">
      <Toast
        open={Boolean(toastMessage)}
        message={toastMessage ?? ""}
        tone="success"
        durationMs={3500}
        onClose={() => setToastMessage(null)}
      />

      <PageHeader
        title={activeDept ? `${activeDept.name} Overview` : "Campus Overview"}
        description={`Live summary across ${departments.length} academic ${
          departments.length === 1 ? "department" : "departments"
        } and ${metrics.totalUsers.toLocaleString()} portal ${
          metrics.totalUsers === 1 ? "account" : "accounts"
        }.`}
        actions={
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-surface border border-line text-xs font-medium text-fg-muted">
              <CalendarClock className="w-3.5 h-3.5 text-brand" />
              <span>{ACTIVE_TERM}</span>
            </span>
            {departments.length > 0 && (
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Download className="w-3.5 h-3.5" />}
                onClick={() => setToastMessage("Exported live campus summary report.")}
              >
                Export Report
              </Button>
            )}
          </div>
        }
      />

      {/* Live 4-Column KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-surface border border-line space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-fg-muted">Total Enrolled Students</span>
            <div className="w-9 h-9 rounded-xl bg-brand-soft text-brand flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          {showColdSkeleton ? (
            <Skeleton variant="text" className="h-8 w-20" />
          ) : (
            <div className="text-3xl font-semibold text-fg tabular-nums">
              {metrics.students.toLocaleString()}
            </div>
          )}
          <div className="text-xs text-fg-muted">
            {metrics.pending > 0
              ? `${metrics.pending} pending registration ${metrics.pending === 1 ? "request" : "requests"}`
              : "Live from Supabase"}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-line space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-fg-muted">Active Faculty Members</span>
            <div className="w-9 h-9 rounded-xl bg-brand-soft text-brand flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          {showColdSkeleton ? (
            <Skeleton variant="text" className="h-8 w-16" />
          ) : (
            <div className="text-3xl font-semibold text-fg tabular-nums">
              {metrics.faculty.toLocaleString()}
            </div>
          )}
          <div className="text-xs text-fg-muted">
            Across {departments.length} academic {departments.length === 1 ? "department" : "departments"}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-line space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-fg-muted">Active Portal Accounts</span>
            <div className="w-9 h-9 rounded-xl bg-success-light text-success flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          {showColdSkeleton ? (
            <Skeleton variant="text" className="h-8 w-16" />
          ) : (
            <div className="text-3xl font-semibold text-fg tabular-nums">
              {metrics.active.toLocaleString()}
            </div>
          )}
          <div className="text-xs text-fg-muted">
            of {metrics.totalUsers.toLocaleString()} registered{" "}
            {metrics.totalUsers === 1 ? "account" : "accounts"}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-line space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-fg-muted">Tuition &amp; Fee Collections</span>
            <div className="w-9 h-9 rounded-xl bg-brand-soft text-brand flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          {showColdSkeleton ? (
            <Skeleton variant="text" className="h-8 w-24" />
          ) : (
            <div className="text-3xl font-semibold text-fg tabular-nums">
              ৳{metrics.paidInflow.toLocaleString()}
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-fg-muted tabular-nums">
            <span>৳{metrics.pendingDues.toLocaleString()} pending</span>
            <span>·</span>
            <span>৳{metrics.totalWages.toLocaleString()} payroll</span>
          </div>
        </div>
      </div>

      {/* Pending Approvals Callout (Only shown when real pending applications exist) */}
      {metrics.pending > 0 && (
        <div className="p-4 rounded-2xl bg-warning-light/60 border border-warning/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Badge variant="warning">{metrics.pending} Pending</Badge>
            <p className="text-xs sm:text-sm font-medium text-fg">
              New student or faculty registration {metrics.pending === 1 ? "dossier is" : "dossiers are"} awaiting verification.
            </p>
          </div>
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline shrink-0"
          >
            <span>Review Registrations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Main 2-Column Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Department Enrollment Distribution */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-surface border border-line flex flex-col justify-between gap-5">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="text-sm font-semibold text-fg flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-brand" />
                  <span>Department Enrollment Distribution</span>
                </h2>
                <p className="text-xs text-fg-muted mt-0.5">
                  Live student headcount across configured departments
                </p>
              </div>
              <Link
                href="/admin/departments"
                className="text-xs font-semibold text-brand hover:underline shrink-0"
              >
                Manage Departments
              </Link>
            </div>

            {departmentDistribution.length === 0 ? (
              <div className="py-10 text-center space-y-3 border border-dashed border-line rounded-xl bg-surface-2/40">
                <div className="w-10 h-10 rounded-xl bg-brand-soft text-brand flex items-center justify-center mx-auto">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-fg">No departments configured yet</p>
                  <p className="text-xs text-fg-muted max-w-xs mx-auto">
                    Create your first academic department to start enrolling students and assigning faculty.
                  </p>
                </div>
                <Link
                  href="/admin/departments"
                  className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-brand text-on-brand text-xs font-semibold hover:opacity-95 transition-opacity"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Department</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {departmentDistribution.map((dept) => (
                  <div key={dept.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-fg">
                        {dept.code}{" "}
                        <span className="font-normal text-fg-muted">({dept.name})</span>
                      </span>
                      <span className="font-semibold text-fg tabular-nums">
                        {dept.count.toLocaleString()}{" "}
                        <span className="text-fg-muted font-normal">({dept.pct}%)</span>
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-surface-2 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-brand transition-[width] duration-300"
                        style={{ width: `${Math.max(dept.count > 0 ? 4 : 0, dept.pct)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-line flex items-center justify-between text-xs text-fg-muted">
            <span>
              {departments.length} active {departments.length === 1 ? "department" : "departments"}
            </span>
            <span className="inline-flex items-center gap-1 text-success font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Live Supabase Sync</span>
            </span>
          </div>
        </div>

        {/* Recent Administrative Activity */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-surface border border-line flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="text-sm font-semibold text-fg flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-success" />
                  <span>Recent Administrative Activity</span>
                </h2>
                <p className="text-xs text-fg-muted mt-0.5">
                  Approvals, rejections, role updates, and department changes
                </p>
              </div>
            </div>

            {activityLogs.length === 0 ? (
              <div className="py-10 text-center space-y-2 border border-dashed border-line rounded-xl bg-surface-2/40">
                <Database className="w-5 h-5 text-fg-muted mx-auto" />
                <p className="text-sm font-semibold text-fg">No activity logged yet</p>
                <p className="text-xs text-fg-muted max-w-xs mx-auto">
                  Actions such as creating departments or approving registrations will appear here live.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {activityLogs.slice(0, 5).map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 p-3 rounded-xl bg-surface-2/60 border border-line"
                  >
                    <div className="w-8 h-8 rounded-lg bg-brand-soft text-brand flex items-center justify-center shrink-0 mt-0.5">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-fg truncate">{log.title}</p>
                        <span className="text-[11px] text-fg-muted shrink-0 tabular-nums">
                          {log.time}
                        </span>
                      </div>
                      <p className="text-xs text-fg-muted mt-0.5 line-clamp-2">
                        {log.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-line flex items-center justify-between text-xs text-fg-muted">
            <span>Campus Activity Ledger</span>
            <Link
              href="/admin/analytics"
              className="inline-flex items-center gap-1 font-semibold text-brand hover:underline"
            >
              <span>View Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
