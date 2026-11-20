"use client";

import { useState, useEffect } from "react";
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
  Check
} from "lucide-react";
import { 
  AreaChart, Area, 
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";
import { adminService } from "@/lib/services/adminService";
import CountUp from "@/components/bits/CountUp";

const departmentAttendanceData = [
  { dept: 'CSE', present: 94, absent: 6 },
  { dept: 'EEE', present: 92, absent: 8 },
  { dept: 'BBA', present: 90, absent: 10 },
  { dept: 'PHARM', present: 96, absent: 4 },
  { dept: 'ENG', present: 88, absent: 12 },
];

const userGrowthData = [
  { month: 'Jan', students: 4400, faculty: 210 },
  { month: 'Feb', students: 4520, faculty: 220 },
  { month: 'Mar', students: 4610, faculty: 225 },
  { month: 'Apr', students: 4700, faculty: 230 },
  { month: 'May', students: 4780, faculty: 235 },
  { month: 'Jun', students: 4820, faculty: 240 },
];

const CHART_TOOLTIP_STYLE = {
  backgroundColor: "var(--surface)",
  borderRadius: "12px",
  border: "1px solid var(--line)",
  boxShadow: "var(--shadow-lg)",
  color: "var(--fg)",
  fontSize: "12px",
};

const CHART_TOOLTIP_ITEM_STYLE = { color: "var(--fg)" };
const CHART_TOOLTIP_LABEL_STYLE = {
  fontWeight: 600,
  color: "var(--fg-muted)",
  marginBottom: "4px",
};

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("month");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [data, setData] = useState({
    totalUsers: 5072,
    activeUsers: 4912,
    students: 4820,
    teachers: 240,
    pendingApprovals: 118,
    totalRevenue: 25200,
    pendingPayments: 0,
    collectionRate: 100.0,
    completedTxns: 3,
    performanceRate: 94.2,
    noticesCount: 2,
    classesCount: 156,
    coursesCount: 24,
  });

  useEffect(() => {
    queueMicrotask(() => {
      const transactions = adminService.getTransactions();
      const notices = adminService.getNotices();

      const paidTxns = transactions.filter(t => t.type === 'student_fee' && t.status === 'Paid');
      const revenue = paidTxns.reduce((sum, t) => sum + t.amount, 0);
      const pendingAmount = transactions
        .filter(t => t.type === 'student_fee' && t.status === 'Pending')
        .reduce((sum, t) => sum + t.amount, 0);

      const totalTarget = revenue + pendingAmount;
      const collectionRate = totalTarget > 0 ? (revenue / totalTarget) * 100 : 100.0;

      setData({
        totalUsers: 5072,
        activeUsers: 4912,
        students: 4820,
        teachers: 240,
        pendingApprovals: 118,
        totalRevenue: revenue || 25200,
        pendingPayments: pendingAmount,
        collectionRate: Number(collectionRate.toFixed(1)),
        completedTxns: paidTxns.length || 3,
        performanceRate: 94.2,
        noticesCount: notices.length || 2,
        classesCount: 156,
        coursesCount: 24,
      });
    });
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div className="w-full space-y-7 pb-10">
      {/* Top Header & Segmented Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-fg tracking-tight">
            Analytics &amp; Reports
          </h1>
          <p className="text-xs font-medium text-fg-muted mt-1">
            Campus metrics, student enrollment, and academic session performance
          </p>
        </div>

        {/* Time Segmented Control */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="inline-flex items-center rounded-xl bg-canvas border border-line p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setTimeRange("week")}
              className={`min-h-[36px] px-3 py-1.5 rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                timeRange === "week"
                  ? "bg-surface text-fg font-semibold border border-line"
                  : "text-fg-muted hover:text-fg"
              }`}
            >
              Week
            </button>

            <button
              type="button"
              onClick={() => setTimeRange("month")}
              className={`min-h-[36px] px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                timeRange === "month"
                  ? "bg-surface text-fg font-semibold border border-line"
                  : "text-fg-muted hover:text-fg"
              }`}
            >
              {timeRange === "month" && <Check className="w-3.5 h-3.5 text-brand" />}
              Month
            </button>

            <button
              type="button"
              onClick={() => setTimeRange("year")}
              className={`min-h-[36px] px-3 py-1.5 rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                timeRange === "year"
                  ? "bg-surface text-fg font-semibold border border-line"
                  : "text-fg-muted hover:text-fg"
              }`}
            >
              Year
            </button>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            title="Refresh Analytics"
            aria-label="Refresh Analytics"
            className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center bg-canvas hover:bg-surface-2 text-fg border border-line rounded-xl font-semibold cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <RotateCcw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-brand" : ""}`} />
          </button>
        </div>
      </div>

      {/* SECTION 1: User Analytics */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-fg-muted">
          <Users className="w-4 h-4 text-brand" />
          <span>User Analytics</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* Card 1: Total Users */}
          <div className="rounded-2xl bg-surface border border-line p-5 flex flex-col justify-between hover:border-fg-subtle/40 transition-colors">
            <div className="flex items-start justify-between">
              <div className="w-8 h-8 rounded-xl bg-brand-soft text-brand flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-success-light text-success font-semibold tabular-nums text-xs rounded-full">
                ↗ +12%
              </span>
            </div>
            <div className="mt-5">
              <h3 className="text-3xl font-bold text-fg tracking-tight leading-none tabular-nums">
                <CountUp to={data.totalUsers} duration={0.6} />
              </h3>
              <p className="text-xs font-medium text-fg-muted mt-1.5">
                Total Users
              </p>
            </div>
          </div>

          {/* Card 2: Active Users */}
          <div className="rounded-2xl bg-surface border border-line p-5 flex flex-col justify-between hover:border-fg-subtle/40 transition-colors">
            <div className="flex items-start justify-between">
              <div className="w-8 h-8 rounded-xl bg-success-light text-success flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-success-light text-success font-semibold tabular-nums text-xs rounded-full">
                ↗ +8%
              </span>
            </div>
            <div className="mt-5">
              <h3 className="text-3xl font-bold text-fg tracking-tight leading-none tabular-nums">
                <CountUp to={data.activeUsers} duration={0.6} />
              </h3>
              <p className="text-xs font-medium text-fg-muted mt-1.5">
                Active Users
              </p>
            </div>
          </div>

          {/* Card 3: Students */}
          <div className="rounded-2xl bg-surface border border-line p-5 flex flex-col justify-between hover:border-fg-subtle/40 transition-colors">
            <div className="flex items-start justify-between">
              <div className="w-8 h-8 rounded-xl bg-brand-soft text-brand flex items-center justify-center shrink-0">
                <GraduationCap className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-5">
              <h3 className="text-3xl font-bold text-fg tracking-tight leading-none tabular-nums">
                <CountUp to={data.students} duration={0.6} />
              </h3>
              <p className="text-xs font-medium text-fg-muted mt-1.5">
                Students
              </p>
            </div>
          </div>

          {/* Card 4: Teachers */}
          <div className="rounded-2xl bg-surface border border-line p-5 flex flex-col justify-between hover:border-fg-subtle/40 transition-colors">
            <div className="flex items-start justify-between">
              <div className="w-8 h-8 rounded-xl bg-warning-light text-warning flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-5">
              <h3 className="text-3xl font-bold text-fg tracking-tight leading-none tabular-nums">
                <CountUp to={data.teachers} duration={0.6} />
              </h3>
              <p className="text-xs font-medium text-fg-muted mt-1.5">
                Teachers
              </p>
            </div>
          </div>

          {/* Card 5: Pending Approvals */}
          <div className="rounded-2xl bg-surface border border-line p-5 flex flex-col justify-between hover:border-fg-subtle/40 transition-colors">
            <div className="flex items-start justify-between">
              <div className="w-8 h-8 rounded-xl bg-surface-2 text-fg-muted flex items-center justify-center shrink-0">
                <ClipboardList className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-5">
              <h3 className="text-3xl font-bold text-fg tracking-tight leading-none tabular-nums">
                <CountUp to={data.pendingApprovals} duration={0.5} />
              </h3>
              <p className="text-xs font-medium text-fg-muted mt-1.5">
                Pending Approvals
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Financial Overview */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-fg-muted">
          <CreditCard className="w-4 h-4 text-brand" />
          <span>Financial Overview</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          {/* Revenue Wide Card */}
          <div className="md:col-span-5 rounded-2xl bg-surface border border-line p-6 flex flex-col justify-between hover:border-fg-subtle/40 transition-colors">
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded-xl bg-success-light text-success flex items-center justify-center shrink-0">
                <CreditCard className="w-4 h-4" />
              </div>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-success-light text-success font-semibold tabular-nums text-xs rounded-full">
                ↗ +15%
              </span>
            </div>
            <div className="mt-6">
              <h3 className="text-3xl font-bold text-fg tracking-tight leading-none tabular-nums">
                ৳{data.totalRevenue.toLocaleString()}
              </h3>
              <p className="text-xs font-semibold text-fg-muted mt-2">
                Total Revenue
              </p>
              <p className="text-xs text-fg-muted mt-0.5">
                All completed transactions
              </p>
            </div>
          </div>

          {/* Pending Payments Card */}
          <div className="md:col-span-3 rounded-2xl bg-surface border border-line p-6 flex flex-col justify-between hover:border-fg-subtle/40 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-warning-light text-warning flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div className="mt-6">
              <h3 className="text-3xl font-bold text-fg tracking-tight leading-none tabular-nums">
                ৳{data.pendingPayments.toLocaleString()}
              </h3>
              <p className="text-xs font-semibold text-fg-muted mt-2">
                Pending Payments
              </p>
              <p className="text-xs text-fg-muted mt-0.5">
                Awaiting collection
              </p>
            </div>
          </div>

          {/* Collection Rate Card */}
          <div className="md:col-span-2 rounded-2xl bg-surface border border-line p-6 flex flex-col justify-between hover:border-fg-subtle/40 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-success-light text-success flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="mt-6">
              <h3 className="text-3xl font-bold text-fg tracking-tight leading-none tabular-nums">
                {data.collectionRate}%
              </h3>
              <p className="text-xs font-semibold text-fg-muted mt-2">
                Collection Rate
              </p>
            </div>
          </div>

          {/* Completed Transactions Card */}
          <div className="md:col-span-2 rounded-2xl bg-surface border border-line p-6 flex flex-col justify-between hover:border-fg-subtle/40 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-brand-soft text-brand flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="mt-6">
              <h3 className="text-3xl font-bold text-fg tracking-tight leading-none tabular-nums">
                {data.completedTxns}
              </h3>
              <p className="text-xs font-semibold text-fg-muted mt-2">
                Completed
              </p>
              <p className="text-xs text-fg-muted mt-0.5">
                Transactions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Academic Performance */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-fg-muted">
          <BookOpen className="w-4 h-4 text-brand" />
          <span>Academic Performance</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          {/* Card 1: Attendance / Pass Rate */}
          <div className="md:col-span-5 rounded-2xl bg-surface border border-line p-6 flex flex-col justify-between hover:border-fg-subtle/40 transition-colors">
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded-xl bg-success-light text-success flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-success-light text-success font-semibold tabular-nums text-xs rounded-full">
                ↗ +5%
              </span>
            </div>
            <div className="mt-6">
              <h3 className="text-3xl font-bold text-fg tracking-tight leading-none tabular-nums">
                {data.performanceRate}%
              </h3>
              <p className="text-xs font-semibold text-fg-muted mt-2">
                Average Campus Attendance
              </p>
              <p className="text-xs text-fg-muted mt-0.5">
                Calculated across all batches &amp; sections
              </p>
            </div>
          </div>

          {/* Card 2: Campus Notices */}
          <div className="md:col-span-3 rounded-2xl bg-surface border border-line p-6 flex flex-col justify-between hover:border-fg-subtle/40 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-brand-soft text-brand flex items-center justify-center shrink-0">
              <Megaphone className="w-4 h-4" />
            </div>
            <div className="mt-6">
              <h3 className="text-3xl font-bold text-fg tracking-tight leading-none tabular-nums">
                {data.noticesCount}
              </h3>
              <p className="text-xs font-semibold text-fg-muted mt-2">
                Published Notices
              </p>
              <p className="text-xs text-fg-muted mt-0.5">
                Active announcements in broadcast stream
              </p>
            </div>
          </div>

          {/* Card 3: Dual metric (Classes & Courses) */}
          <div className="md:col-span-4 rounded-2xl bg-surface border border-line p-4 sm:p-5 grid grid-cols-2 divide-x divide-line hover:border-fg-subtle/40 transition-colors">
            <div className="text-center px-3">
              <h3 className="text-3xl font-bold text-brand tracking-tight leading-none tabular-nums">
                {data.classesCount}
              </h3>
              <p className="text-xs font-semibold text-fg-muted mt-2">
                Classes
              </p>
              <p className="text-xs text-fg-muted mt-0.5 max-w-[110px] mx-auto">
                Weekly scheduled slots
              </p>
            </div>

            <div className="text-center px-3">
              <h3 className="text-3xl font-bold text-success tracking-tight leading-none tabular-nums">
                {data.coursesCount}
              </h3>
              <p className="text-xs font-semibold text-fg-muted mt-2">
                Courses
              </p>
              <p className="text-xs text-fg-muted mt-0.5 max-w-[110px] mx-auto">
                Active curriculum subjects
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Department Attendance Rates & Academic Cohorts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
        {/* Department Attendance Rates Area Chart */}
        <div className="rounded-2xl bg-surface border border-line p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
            <div>
              <h2 className="text-sm font-semibold text-fg">Department Attendance Rates</h2>
              <p className="text-xs text-fg-muted mt-0.5">Verified lecture attendance percentage across academic faculties</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-fg-muted">
                <span className="w-2 h-2 rounded bg-brand"></span> Present (%)
              </span>
              <span className="flex items-center gap-1.5 text-fg-muted">
                <span className="w-2 h-2 rounded bg-danger"></span> Absent (%)
              </span>
            </div>
          </div>
          
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={departmentAttendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--brand)" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="var(--brand)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAbsent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--danger)" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="var(--danger)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--line)" />
                <XAxis dataKey="dept" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--fg-muted)", fontWeight: 600 }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--fg-muted)", fontWeight: 600 }} />
                <Tooltip 
                  contentStyle={CHART_TOOLTIP_STYLE}
                  itemStyle={CHART_TOOLTIP_ITEM_STYLE}
                  labelStyle={CHART_TOOLTIP_LABEL_STYLE}
                />
                <Area type="monotone" dataKey="present" stroke="var(--brand)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPresent)" />
                <Area type="monotone" dataKey="absent" stroke="var(--danger)" strokeWidth={2} fillOpacity={1} fill="url(#colorAbsent)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Growth Bar Chart */}
        <div className="rounded-2xl bg-surface border border-line p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
            <div>
              <h2 className="text-sm font-semibold text-fg">Active Accounts Cohort</h2>
              <p className="text-xs text-fg-muted mt-0.5">Monthly verified students &amp; faculty</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-fg-muted">
                <span className="w-2 h-2 rounded bg-brand"></span> Students
              </span>
              <span className="flex items-center gap-1.5 text-fg-muted">
                <span className="w-2 h-2 rounded bg-warning"></span> Faculty
              </span>
            </div>
          </div>
          
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barGap={6}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--line)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--fg-muted)", fontWeight: 600 }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--fg-muted)", fontWeight: 600 }} />
                <Tooltip 
                  contentStyle={CHART_TOOLTIP_STYLE}
                  itemStyle={CHART_TOOLTIP_ITEM_STYLE}
                  labelStyle={CHART_TOOLTIP_LABEL_STYLE}
                />
                <Bar dataKey="students" fill="var(--brand)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="faculty" fill="var(--warning)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
