"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Users, 
  GraduationCap, 
  Briefcase,
  AlertCircle, 
  CheckCircle2, 
  Building2, 
  Calendar, 
  CreditCard, 
  BarChart3, 
  TrendingUp, 
  UserPlus, 
  Megaphone, 
  Sparkles, 
  CalendarClock, 
  ShieldCheck, 
  Lock, 
  Database, 
  ArrowRight, 
  Download, 
  X, 
  Check, 
  Cloud,
  Server,
  Activity,
  Radio
} from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";

interface AuditLogRow {
  id: string;
  time: string;
  category: "RBAC" | "Gradebook" | "Routine" | "Snapshot";
  title: string;
  description: string;
  highlightText: string;
  iconBg: string;
  iconColor: string;
}

const INITIAL_AUDIT_LOGS: AuditLogRow[] = [
  {
    id: "log-1",
    time: "17:52:10",
    category: "RBAC",
    title: "RBAC Role Grant",
    description: "Role FACULTY granted to dr.farhana@unicampus.edu by Admin.",
    highlightText: "FACULTY",
    iconBg: "bg-[#2563EB]/15",
    iconColor: "text-[#2563EB]",
  },
  {
    id: "log-2",
    time: "17:40:04",
    category: "Gradebook",
    title: "Gradebook Lock",
    description: "CSE-3205 Sec A final marks locked & signed by Dr. Asif Rahman.",
    highlightText: "CSE-3205 Sec A",
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-400",
  },
  {
    id: "log-3",
    time: "17:15:39",
    category: "Routine",
    title: "Master Routine Sync",
    description: "Room conflict resolved for Lab 4A (Monday 10:15 AM slot).",
    highlightText: "Lab 4A",
    iconBg: "bg-blue-500/15",
    iconColor: "text-blue-400",
  },
  {
    id: "log-4",
    time: "16:58:22",
    category: "Snapshot",
    title: "Automated Snapshot",
    description: "PostgreSQL primary cluster backup completed (4.8 GB, 0 errors).",
    highlightText: "4.8 GB",
    iconBg: "bg-sky-500/15",
    iconColor: "text-sky-400",
  },
];

const DEPARTMENT_DISTRIBUTION = [
  { name: "CSE (Computer Science)", code: "CSE", full: "Computer Science & Engineering", count: 1420, percent: 30, color: "from-[#2563EB] to-[#60A5FA]" },
  { name: "EEE (Electrical Eng)", code: "EEE", full: "Electrical & Electronic Eng", count: 1080, percent: 22, color: "from-[#1D5BD8] to-[#2563EB]" },
  { name: "BBA (Business School)", code: "BBA", full: "School of Business Admin", count: 960, percent: 20, color: "from-[#1548B0] to-[#2563EB]" },
  { name: "Pharmacy", code: "PHARM", full: "Clinical & Bio Sciences", count: 740, percent: 15, color: "from-[#133E92] to-[#1D5BD8]" },
  { name: "English & Humanities", code: "ENG", full: "Liberal Arts & Languages", count: 620, percent: 13, color: "from-[#0F3277] to-[#1548B0]" },
];

export default function AdminDashboardPage() {
  const { isSuperAdmin } = useAdminAuth();
  
  // Modals & Action States
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [createDeptModalOpen, setCreateDeptModalOpen] = useState(false);
  const [broadcastModalOpen, setBroadcastModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Listen to cloud backup event dispatched from AdminHeader
  useEffect(() => {
    const handleBackupEvent = () => {
      setToastMessage("Cloud Snapshot Initiated: AWS S3 replica synchronized (4.8 GB, 0 errors)");
      setTimeout(() => setToastMessage(null), 4000);
    };

    window.addEventListener("cloud-backup-triggered", handleBackupEvent);
    return () => window.removeEventListener("cloud-backup-triggered", handleBackupEvent);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="w-full space-y-6 pb-20 select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#2563EB] text-slate-900 dark:text-white shadow-xl dark:shadow-[0_0_24px_rgba(37, 99, 235,0.4)] animate-in fade-in slide-in-from-top-4 duration-200">
          <ShieldCheck className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0" />
          <div className="text-xs font-mono font-medium">
            {toastMessage}
          </div>
          <button 
            onClick={() => setToastMessage(null)} 
            className="text-slate-400 hover:text-slate-900 dark:hover:text-white ml-2 p-1 rounded-md"
            aria-label="Dismiss toast"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. QUICK ADMINISTRATION SHORTCUTS STRIP                                   */}
      {/* ========================================================================= */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[11.5px] font-mono font-semibold tracking-wider uppercase text-slate-400 dark:text-[#8D96A0] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] shadow-[0_0_6px_#2563EB]"></span>
            Executive Quick Actions &amp; Dispatch
          </h2>
          <span className="text-[11px] text-slate-400 dark:text-[#8D96A0] font-mono">
            Instance ID: <span className="text-slate-900 dark:text-[#F0F6FC] font-semibold">uc-prod-cluster-01</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Primary #2563EB Button: + Add New User */}
          <button
            onClick={() => setAddUserModalOpen(true)}
            className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-manrope font-bold text-[13px] shadow-[0_4px_20px_rgba(37, 99, 235,0.35)] transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer group"
          >
            <UserPlus className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span>+ Add New User</span>
          </button>

          {/* 2. Secondary #0D1117 Button: + Create Department */}
          <button
            onClick={() => setCreateDeptModalOpen(true)}
            className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl bg-white dark:bg-[#0D1117] hover:bg-slate-50 dark:hover:bg-[#161B22] border border-slate-200 dark:border-[#30363D] hover:border-[#2563EB]/50 text-slate-900 dark:text-[#F0F6FC] font-manrope font-semibold text-[13px] transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer group shadow-sm"
          >
            <Building2 className="w-4 h-4 text-[#2563EB] group-hover:scale-110 transition-transform" />
            <span>+ Create Department</span>
          </button>

          {/* 3. Secondary with Rose Icon: Emergency Notice Broadcast */}
          <button
            onClick={() => setBroadcastModalOpen(true)}
            className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl bg-white dark:bg-[#0D1117] hover:bg-slate-50 dark:hover:bg-[#161B22] border border-slate-200 dark:border-[#30363D] hover:border-rose-500/50 text-slate-900 dark:text-[#F0F6FC] font-manrope font-semibold text-[13px] transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer group shadow-sm"
          >
            <Megaphone className="w-4 h-4 text-rose-500 group-hover:animate-pulse" />
            <span>Emergency Notice Broadcast</span>
          </button>

          {/* 4. Secondary with Indigo Icon: Generate Master Routine */}
          <button
            onClick={() => triggerToast("Master Routine Synthesis Complete: 384 timetable slots verified without room collisions.")}
            className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl bg-white dark:bg-[#0D1117] hover:bg-slate-50 dark:hover:bg-[#161B22] border border-slate-200 dark:border-[#30363D] hover:border-[#2563EB]/50 text-slate-900 dark:text-[#F0F6FC] font-manrope font-semibold text-[13px] transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer group shadow-sm"
          >
            <CalendarClock className="w-4 h-4 text-[#2563EB] group-hover:rotate-12 transition-transform" />
            <span>Generate Master Routine</span>
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. UNIVERSITY KPI BENTO GRID (4 Cards across 12 cols, 20px gap)           */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5">
        {/* CARD 1: Total Enrolled Students */}
        <div className="lg:col-span-3 bg-white dark:bg-[#0D1117] p-6 rounded-3xl border border-slate-200 dark:border-[#30363D] hover:border-[#2563EB]/40 transition-all flex flex-col justify-between shadow-xl relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#2563EB]/10 rounded-full blur-2xl group-hover:bg-[#2563EB]/20 transition-all pointer-events-none"></div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] font-sans font-medium text-slate-500 dark:text-[#8D96A0]">
              Total Enrolled Students
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#2563EB]/15 border border-[#2563EB]/30 flex items-center justify-center text-[#2563EB] shadow-xs">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-manrope font-extrabold text-[32px] sm:text-[34px] tracking-tight text-slate-900 dark:text-[#F0F6FC] mb-2 font-mono tabular-nums">
              4,820
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                +6.4% this year
              </span>
              <span className="text-[11px] text-slate-400 dark:text-[#6E7681] font-mono">
                vs 4,530 PY
              </span>
            </div>
          </div>
        </div>

        {/* CARD 2: Active Faculty Members */}
        <div className="lg:col-span-3 bg-white dark:bg-[#0D1117] p-6 rounded-3xl border border-slate-200 dark:border-[#30363D] hover:border-[#2563EB]/40 transition-all flex flex-col justify-between shadow-xl relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-28 h-28 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all pointer-events-none"></div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] font-sans font-medium text-slate-500 dark:text-[#8D96A0]">
              Active Faculty Members
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#2563EB]/15 border border-[#2563EB]/30 flex items-center justify-center text-[#2563EB] shadow-xs">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-manrope font-extrabold text-[32px] sm:text-[34px] tracking-tight text-slate-900 dark:text-[#F0F6FC] mb-2 font-mono tabular-nums">
              240
            </div>
            <div className="text-[12px] font-sans text-slate-500 dark:text-[#8D96A0] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]"></span>
              <span>Across 8 academic departments</span>
            </div>
          </div>
        </div>

        {/* CARD 3: Daily Active Users */}
        <div className="lg:col-span-3 bg-white dark:bg-[#0D1117] p-6 rounded-3xl border border-slate-200 dark:border-[#30363D] hover:border-[#2563EB]/40 transition-all flex flex-col justify-between shadow-xl relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all pointer-events-none"></div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] font-sans font-medium text-slate-500 dark:text-[#8D96A0]">
              Daily Active Users
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-xs">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-manrope font-extrabold text-[32px] sm:text-[34px] tracking-tight text-slate-900 dark:text-[#F0F6FC] mb-2 font-mono tabular-nums flex items-center gap-2">
              <span>3,110</span>
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            <div className="text-[12px] font-sans text-slate-500 dark:text-[#8D96A0] flex items-center gap-1">
              <span className="text-emerald-400 font-mono font-semibold tabular-nums">64.5%</span> concurrent portal engagement
            </div>
          </div>
        </div>

        {/* CARD 4: Tuition Collection Rate */}
        <div className="lg:col-span-3 bg-white dark:bg-[#0D1117] p-6 rounded-3xl border border-slate-200 dark:border-[#30363D] hover:border-[#2563EB]/40 transition-all flex flex-col justify-between shadow-xl relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#1D5BD8]/10 rounded-full blur-2xl group-hover:bg-[#1D5BD8]/20 transition-all pointer-events-none"></div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] font-sans font-medium text-slate-500 dark:text-[#8D96A0]">
              Tuition Collection Rate
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#2563EB]/15 border border-[#2563EB]/30 flex items-center justify-center text-[#2563EB] shadow-xs">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-manrope font-extrabold text-[32px] sm:text-[34px] tracking-tight text-slate-900 dark:text-[#F0F6FC] mb-2 font-mono tabular-nums">
              89.2%
            </div>
            <div className="flex items-center">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>$2.4M collected • Spring 2026</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. CHARTS & ANALYTICS SPLIT SECTION (58% / 42%, 24px gap)                 */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANEL (58% -> col-span-7): Department Enrollment Distribution */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0D1117] rounded-3xl p-6 border border-slate-200 dark:border-[#30363D] shadow-xl flex flex-col justify-between min-h-[430px]">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#30363D] pb-4 mb-5">
              <div>
                <h3 className="font-manrope font-bold text-[17px] text-slate-900 dark:text-[#F0F6FC] tracking-tight flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#2563EB]" />
                  <span>Department Enrollment Distribution</span>
                </h3>
                <p className="text-[12px] text-slate-500 dark:text-[#8D96A0] mt-0.5 font-sans">
                  Active undergraduate &amp; postgraduate headcount by faculty
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono px-2 py-1 rounded-lg bg-slate-100 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] text-slate-500 dark:text-[#8D96A0]">
                  Spring 2026 Term
                </span>
                <button
                  onClick={() => triggerToast("Enrollment CSV Exported (4,820 rows generated)")}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#161B22] transition-colors cursor-pointer"
                  title="Export Enrollment CSV"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Horizontal Rounded Bar Chart with Monospace Labels */}
            <div className="space-y-4">
              {DEPARTMENT_DISTRIBUTION.map((dept) => (
                <div key={dept.code} className="space-y-1.5">
                  <div className="flex justify-between items-center text-[12px]">
                    <span className="font-medium text-slate-900 dark:text-[#F0F6FC] flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#2563EB]"></span>
                      <span>{dept.code}</span>
                      <span className="text-slate-400 dark:text-[#8D96A0] font-normal text-[11px]">
                        ({dept.full})
                      </span>
                    </span>
                    <span className="font-mono text-slate-900 dark:text-[#F0F6FC] font-semibold tabular-nums">
                      {dept.count.toLocaleString()}{" "}
                      <span className="text-slate-400 dark:text-[#8D96A0] font-normal text-[11px]">
                        ({dept.percent}%)
                      </span>
                    </span>
                  </div>
                  {/* Progress Bar Container */}
                  <div className="w-full h-3 bg-slate-100 dark:bg-[#161B22] rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-[#21262D]">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${dept.color} shadow-[0_0_12px_rgba(37, 99, 235,0.35)] transition-all duration-500`}
                      style={{ width: `${dept.percent}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Summary Footer */}
          <div className="pt-4 mt-4 border-t border-slate-200 dark:border-[#30363D] flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-500 dark:text-[#8D96A0] gap-2">
            <span>
              Aggregated Capacity: <strong className="text-slate-900 dark:text-[#F0F6FC]">4,820</strong> students
            </span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              All 8 faculties within seat quotas
            </span>
          </div>
        </div>

        {/* RIGHT PANEL (42% -> col-span-5): System Audit Logs & Live Security Stream */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0D1117] rounded-3xl p-6 border border-slate-200 dark:border-[#30363D] shadow-xl flex flex-col justify-between min-h-[430px]">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#30363D] pb-4 mb-4">
              <div>
                <h3 className="font-manrope font-bold text-[17px] text-slate-900 dark:text-[#F0F6FC] tracking-tight flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>System Audit Logs &amp; Live Security Stream</span>
                </h3>
                <p className="text-[12px] text-slate-500 dark:text-[#8D96A0] mt-0.5 font-sans">
                  Real-time RBAC, authentication, &amp; engine audit trail
                </p>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 shrink-0">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold tracking-wider uppercase">
                  LIVE
                </span>
              </div>
            </div>

            {/* 4 Monospace-accented Activity Log Rows (#161B22 inset cards, 12px radius) */}
            <div className="space-y-2.5">
              {INITIAL_AUDIT_LOGS.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#21262D] hover:border-[#2563EB]/40 transition-colors flex items-start gap-3 shadow-2xs"
                >
                  <div
                    className={`w-7 h-7 rounded-lg ${log.iconBg} border border-slate-200 dark:border-[#30363D] flex items-center justify-center ${log.iconColor} shrink-0 mt-0.5`}
                  >
                    {log.category === "RBAC" && <ShieldCheck className="w-3.5 h-3.5" />}
                    {log.category === "Gradebook" && <Lock className="w-3.5 h-3.5" />}
                    {log.category === "Routine" && <CalendarClock className="w-3.5 h-3.5" />}
                    {log.category === "Snapshot" && <Database className="w-3.5 h-3.5" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-[11px] font-mono mb-0.5">
                      <span className={`font-semibold ${log.iconColor}`}>{log.title}</span>
                      <span className="text-slate-400 dark:text-[#8D96A0] tabular-nums font-mono">{log.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-700 dark:text-[#F0F6FC] leading-relaxed font-sans">
                      {log.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Audit CTA */}
          <div className="pt-3 mt-4 border-t border-slate-200 dark:border-[#30363D] flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400 dark:text-[#8D96A0]">
              Immutable ledger: SHA-256 enabled
            </span>
            <Link
              href="/admin/analytics"
              className="text-[11.5px] font-sans font-semibold text-[#2563EB] hover:underline flex items-center gap-1 transition-all"
            >
              <span>View Full Audit Ledger</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* MODAL 1: ADD NEW USER (RBAC)                                              */}
      {/* ========================================================================= */}
      {addUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-150">
          <div className="max-w-md w-full bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <UserPlus className="w-5 h-5 text-[#2563EB]" />
                <h3 className="font-manrope font-bold text-base text-slate-900 dark:text-[#F0F6FC]">
                  Create University Account
                </h3>
              </div>
              <button
                onClick={() => setAddUserModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-[#8D96A0]">
              Assign RBAC privileges, institutional email, and departmental authority to new personnel.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-mono text-slate-400 uppercase font-bold">Full Legal Name</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Farhana Sultana"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] text-xs text-slate-900 dark:text-[#F0F6FC] outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 uppercase font-bold">Institutional Email</label>
                <input
                  type="email"
                  placeholder="name@unicampus.edu"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] text-xs text-slate-900 dark:text-[#F0F6FC] outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 uppercase font-bold">Role Assignment</label>
                <select className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] text-xs text-slate-900 dark:text-[#F0F6FC] outline-none focus:border-[#2563EB]">
                  <option value="teacher">Faculty Member / Professor</option>
                  <option value="student">Undergraduate Student</option>
                  <option value="admin">Departmental Administrator</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setAddUserModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#161B22] text-slate-700 dark:text-[#F0F6FC] text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setAddUserModalOpen(false);
                  triggerToast("User Created Successfully: Verification email transmitted.");
                }}
                className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Issue Credentials
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: CREATE DEPARTMENT                                                */}
      {/* ========================================================================= */}
      {createDeptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-150">
          <div className="max-w-md w-full bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Building2 className="w-5 h-5 text-[#2563EB]" />
                <h3 className="font-manrope font-bold text-base text-slate-900 dark:text-[#F0F6FC]">
                  Establish Academic Department
                </h3>
              </div>
              <button
                onClick={() => setCreateDeptModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-[#8D96A0]">
              Register new department faculty codes, allocated student quotas, and curriculum tracks.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-mono text-slate-400 uppercase font-bold">Department Name</label>
                <input
                  type="text"
                  placeholder="e.g. Department of Data Science & AI"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] text-xs text-slate-900 dark:text-[#F0F6FC] outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 uppercase font-bold">Acronym / Code</label>
                <input
                  type="text"
                  placeholder="DSAI"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] text-xs text-slate-900 dark:text-[#F0F6FC] outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setCreateDeptModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#161B22] text-slate-700 dark:text-[#F0F6FC] text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setCreateDeptModalOpen(false);
                  triggerToast("Department Provisioned: Curriculum matrix initialized.");
                }}
                className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Create Department
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: EMERGENCY NOTICE BROADCAST                                       */}
      {/* ========================================================================= */}
      {broadcastModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-150">
          <div className="max-w-md w-full bg-white dark:bg-[#0D1117] border border-rose-500/50 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Megaphone className="w-5 h-5 text-rose-500" />
                <h3 className="font-manrope font-bold text-base text-slate-900 dark:text-[#F0F6FC]">
                  Campus Emergency Broadcast
                </h3>
              </div>
              <button
                onClick={() => setBroadcastModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-rose-400 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
              High-priority broadcast will push instant push alerts and sticky banners across all student and faculty apps.
            </p>

            <div>
              <label className="text-[11px] font-mono text-slate-400 uppercase font-bold">Circular Title</label>
              <input
                type="text"
                placeholder="e.g. Campus Weather Alert • Classes Suspended"
                className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] text-xs text-slate-900 dark:text-[#F0F6FC] outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setBroadcastModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#161B22] text-slate-700 dark:text-[#F0F6FC] text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setBroadcastModalOpen(false);
                  triggerToast("Emergency Alert Broadcasted to 4,820 students & 240 faculty.");
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Dispatch Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
