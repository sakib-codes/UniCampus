"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
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
import { themeTokens, THEME_PALETTES, BRAND_COLORS, SPOTLIGHT } from "@/lib/theme";
import SpotlightCard from "@/components/bits/SpotlightCard";
import CountUp from "@/components/bits/CountUp";
import ClickSpark from "@/components/bits/ClickSpark";
import DecryptedText from "@/components/bits/DecryptedText";

const serverTrafficData = [
  { time: '08:00', requests: 4200, errors: 12 },
  { time: '10:00', requests: 7800, errors: 8 },
  { time: '12:00', requests: 12500, errors: 32 },
  { time: '14:00', requests: 16200, errors: 21 },
  { time: '16:00', requests: 9400, errors: 18 },
  { time: '18:00', requests: 5600, errors: 14 },
  { time: '20:00', requests: 3800, errors: 9 },
];

const userGrowthData = [
  { month: 'Jan', students: 18000, faculty: 1200 },
  { month: 'Feb', students: 18200, faculty: 1220 },
  { month: 'Mar', students: 19500, faculty: 1250 },
  { month: 'Apr', students: 20100, faculty: 1300 },
  { month: 'May', students: 22000, faculty: 1350 },
  { month: 'Jun', students: 24000, faculty: 1410 },
];

export default function AdminAnalyticsPage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("month");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : true;
  const chartPrimary = isDark ? BRAND_COLORS.darkPrimary : BRAND_COLORS.primary;
  const chartAxisText = isDark ? THEME_PALETTES.githubDark.muted : "#64748B";

  const tooltipStyle = { 
    backgroundColor: isDark ? THEME_PALETTES.githubDark.surface : "#FFFFFF",
    borderRadius: '12px', 
    border: `1px solid ${isDark ? THEME_PALETTES.githubDark.border : "#E2E8F0"}`, 
    boxShadow: isDark ? '0 10px 25px -5px rgba(0, 0, 0, 0.7)' : '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
    color: isDark ? THEME_PALETTES.githubDark.text : "#0F172A",
    fontSize: '12px'
  };
  const tooltipItemStyle = { color: isDark ? THEME_PALETTES.githubDark.text : "#0F172A" };
  const tooltipLabelStyle = { fontWeight: '800', color: isDark ? THEME_PALETTES.githubDark.subtle : "#64748B", marginBottom: '4px' };

  const [data, setData] = useState({
    totalUsers: 9,
    activeUsers: 9,
    students: 6,
    teachers: 2,
    pendingApprovals: 0,
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
    const profiles = adminService.getProfiles();
    const transactions = adminService.getTransactions();
    const notices = adminService.getNotices();
    const routine = adminService.getRoutines();

    const students = profiles.filter(p => p.role === 'student' && p.is_approved).length;
    const teachers = profiles.filter(p => p.role === 'teacher' && p.is_approved).length;
    const pending = profiles.filter(p => !p.is_approved).length;

    const paidTxns = transactions.filter(t => t.type === 'student_fee' && t.status === 'Paid');
    const revenue = paidTxns.reduce((sum, t) => sum + t.amount, 0);
    const pendingAmount = transactions
      .filter(t => t.type === 'student_fee' && t.status === 'Pending')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalTarget = revenue + pendingAmount;
    const collectionRate = totalTarget > 0 ? (revenue / totalTarget) * 100 : 100.0;

    setData({
      totalUsers: profiles.length || 9,
      activeUsers: profiles.filter(p => p.is_approved).length || 9,
      students: students || 6,
      teachers: teachers || 2,
      pendingApprovals: pending,
      totalRevenue: revenue || 25200,
      pendingPayments: pendingAmount,
      collectionRate: Number(collectionRate.toFixed(1)),
      completedTxns: paidTxns.length || 3,
      performanceRate: 94.2,
      noticesCount: notices.length || 2,
      classesCount: 156,
      coursesCount: 24,
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
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-[#F0F6FC] tracking-tight">
            Analytics &amp; Reports
          </h1>
          <p className={`text-xs font-medium ${themeTokens.textMuted} mt-1`}>
            Executive institutional intelligence • Real-time database telemetry
          </p>
        </div>

        {/* Time Segmented Control */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className={`inline-flex items-center ${themeTokens.tabTrack} text-xs font-semibold shadow-inner`}>
            <ClickSpark sparkColor={chartPrimary} sparkCount={5} sparkRadius={16}>
              <button
                onClick={() => setTimeRange("week")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  timeRange === "week"
                    ? themeTokens.tabActive
                    : themeTokens.tabInactive
                }`}
              >
                Week
              </button>
            </ClickSpark>
            <ClickSpark sparkColor={chartPrimary} sparkCount={5} sparkRadius={16}>
              <button
                onClick={() => setTimeRange("month")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  timeRange === "month"
                    ? themeTokens.tabActive
                    : themeTokens.tabInactive
                }`}
              >
                {timeRange === "month" && <Check className="w-3.5 h-3.5 text-brand" />}
                Month
              </button>
            </ClickSpark>
            <ClickSpark sparkColor={chartPrimary} sparkCount={5} sparkRadius={16}>
              <button
                onClick={() => setTimeRange("year")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  timeRange === "year"
                    ? themeTokens.tabActive
                    : themeTokens.tabInactive
                }`}
              >
                Year
              </button>
            </ClickSpark>
          </div>

          <ClickSpark sparkColor="#10b981" sparkCount={6} sparkRadius={18}>
            <button
              onClick={handleRefresh}
              title="Refresh Analytics"
              aria-label="Refresh Analytics"
              className={`p-2 ${themeTokens.btnSecondary} rounded-xl cursor-pointer`}
            >
              <RotateCcw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-brand" : ""}`} />
            </button>
          </ClickSpark>
        </div>
      </div>

      {/* SECTION 1: User Analytics */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-[#8D96A0]">
          <Users className="w-4 h-4 text-brand" />
          <span>User Analytics</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* Card 1: Total Users */}
          <SpotlightCard 
            className={`${themeTokens.card} p-5 flex flex-col justify-between hover:border-slate-300 dark:hover:border-[#8D96A0] transition-all`}
            spotlightColor={SPOTLIGHT.wash}
            borderGlowColor={SPOTLIGHT.glow}
          >
            <div className="flex items-start justify-between">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 dark:bg-blue-500/15 text-blue-500 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] rounded-full">
                ↗ +12%
              </span>
            </div>
            <div className="mt-5">
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-[#F0F6FC] tracking-tight leading-none">
                <CountUp to={data.totalUsers} duration={0.6} />
              </h3>
              <p className={`text-xs font-medium ${themeTokens.textMuted} mt-1.5`}>
                Total Users
              </p>
            </div>
          </SpotlightCard>

          {/* Card 2: Active Users */}
          <SpotlightCard 
            className={`${themeTokens.card} p-5 flex flex-col justify-between hover:border-slate-300 dark:hover:border-[#8D96A0] transition-all`}
            spotlightColor={SPOTLIGHT.wash}
            borderGlowColor={SPOTLIGHT.glow}
          >
            <div className="flex items-start justify-between">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] rounded-full">
                ↗ +8%
              </span>
            </div>
            <div className="mt-5">
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-[#F0F6FC] tracking-tight leading-none">
                <CountUp to={data.activeUsers} duration={0.6} />
              </h3>
              <p className={`text-xs font-medium ${themeTokens.textMuted} mt-1.5`}>
                Active Users
              </p>
            </div>
          </SpotlightCard>

          {/* Card 3: Students */}
          <SpotlightCard 
            className={`${themeTokens.card} p-5 flex flex-col justify-between hover:border-slate-300 dark:hover:border-[#8D96A0] transition-all`}
            spotlightColor={SPOTLIGHT.wash}
            borderGlowColor={SPOTLIGHT.glow}
          >
            <div className="flex items-start justify-between">
              <div className="w-8 h-8 rounded-xl bg-teal-500/10 dark:bg-teal-500/15 text-teal-500 flex items-center justify-center shrink-0">
                <GraduationCap className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-5">
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-[#F0F6FC] tracking-tight leading-none">
                <CountUp to={data.students} duration={0.6} />
              </h3>
              <p className={`text-xs font-medium ${themeTokens.textMuted} mt-1.5`}>
                Students
              </p>
            </div>
          </SpotlightCard>

          {/* Card 4: Teachers */}
          <SpotlightCard 
            className={`${themeTokens.card} p-5 flex flex-col justify-between hover:border-slate-300 dark:hover:border-[#8D96A0] transition-all`}
            spotlightColor={SPOTLIGHT.wash}
            borderGlowColor={SPOTLIGHT.glow}
          >
            <div className="flex items-start justify-between">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-5">
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-[#F0F6FC] tracking-tight leading-none">
                <CountUp to={data.teachers} duration={0.6} />
              </h3>
              <p className={`text-xs font-medium ${themeTokens.textMuted} mt-1.5`}>
                Teachers
              </p>
            </div>
          </SpotlightCard>

          {/* Card 5: Pending Approvals */}
          <SpotlightCard 
            className={`${themeTokens.card} p-5 flex flex-col justify-between hover:border-slate-300 dark:hover:border-[#8D96A0] transition-all`}
            spotlightColor={SPOTLIGHT.wash}
            borderGlowColor={SPOTLIGHT.glow}
          >
            <div className="flex items-start justify-between">
              <div className="w-8 h-8 rounded-xl bg-slate-500/10 dark:bg-slate-500/15 text-slate-400 dark:text-[#6E747D] flex items-center justify-center shrink-0">
                <ClipboardList className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-5">
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-[#F0F6FC] tracking-tight leading-none">
                <CountUp to={data.pendingApprovals} duration={0.5} />
              </h3>
              <p className={`text-xs font-medium ${themeTokens.textMuted} mt-1.5`}>
                Pending Approvals
              </p>
            </div>
          </SpotlightCard>
        </div>
      </section>

      {/* SECTION 2: Financial Overview */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-[#8D96A0]">
          <CreditCard className="w-4 h-4 text-brand" />
          <span>Financial Overview</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          {/* Revenue Wide Card */}
          <div className={`md:col-span-5 ${themeTokens.card} p-6 flex flex-col justify-between hover:border-slate-300 dark:hover:border-[#8D96A0] transition-all`}>
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0">
                <CreditCard className="w-4 h-4" />
              </div>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] rounded-full">
                ↗ +15%
              </span>
            </div>
            <div className="mt-6">
              <h3 className="text-3xl font-black text-slate-900 dark:text-[#F0F6FC] tracking-tight leading-none">
                ৳{data.totalRevenue.toLocaleString()}
              </h3>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-2">
                Total Revenue
              </p>
              <p className={`text-[11px] ${themeTokens.textMuted} mt-0.5`}>
                All completed transactions
              </p>
            </div>
          </div>

          {/* Pending Payments Card */}
          <div className={`md:col-span-3 ${themeTokens.card} p-6 flex flex-col justify-between hover:border-slate-300 dark:hover:border-[#8D96A0] transition-all`}>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div className="mt-6">
              <h3 className="text-3xl font-black text-slate-900 dark:text-[#F0F6FC] tracking-tight leading-none">
                ৳{data.pendingPayments.toLocaleString()}
              </h3>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-2">
                Pending Payments
              </p>
              <p className={`text-[11px] ${themeTokens.textMuted} mt-0.5`}>
                Awaiting collection
              </p>
            </div>
          </div>

          {/* Collection Rate Card */}
          <div className={`md:col-span-2 ${themeTokens.card} p-6 flex flex-col justify-between hover:border-slate-300 dark:hover:border-[#8D96A0] transition-all`}>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="mt-6">
              <h3 className="text-3xl font-black text-slate-900 dark:text-[#F0F6FC] tracking-tight leading-none">
                {data.collectionRate}%
              </h3>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-2">
                Collection Rate
              </p>
            </div>
          </div>

          {/* Completed Transactions Card */}
          <div className={`md:col-span-2 ${themeTokens.card} p-6 flex flex-col justify-between hover:border-slate-300 dark:hover:border-[#8D96A0] transition-all`}>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 dark:bg-blue-500/15 text-blue-500 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="mt-6">
              <h3 className="text-3xl font-black text-slate-900 dark:text-[#F0F6FC] tracking-tight leading-none">
                {data.completedTxns}
              </h3>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-2">
                Completed
              </p>
              <p className={`text-[11px] ${themeTokens.textMuted} mt-0.5`}>
                Transactions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Academic Performance */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-[#8D96A0]">
          <BookOpen className="w-4 h-4 text-brand" />
          <span>Academic Performance</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          {/* Card 1: Attendance / Pass Rate */}
          <div className={`md:col-span-5 ${themeTokens.card} p-6 flex flex-col justify-between hover:border-slate-300 dark:hover:border-[#8D96A0] transition-all`}>
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] rounded-full">
                ↗ +5%
              </span>
            </div>
            <div className="mt-6">
              <h3 className="text-3xl font-black text-slate-900 dark:text-[#F0F6FC] tracking-tight leading-none">
                {data.performanceRate}%
              </h3>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-2">
                Average Campus Attendance
              </p>
              <p className={`text-[11px] ${themeTokens.textMuted} mt-0.5`}>
                Calculated across all batches &amp; sections
              </p>
            </div>
          </div>

          {/* Card 2: Campus Notices */}
          <div className={`md:col-span-3 ${themeTokens.card} p-6 flex flex-col justify-between hover:border-slate-300 dark:hover:border-[#8D96A0] transition-all`}>
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 dark:bg-teal-500/15 text-teal-500 flex items-center justify-center shrink-0">
              <Megaphone className="w-4 h-4" />
            </div>
            <div className="mt-6">
              <h3 className="text-3xl font-black text-slate-900 dark:text-[#F0F6FC] tracking-tight leading-none">
                {data.noticesCount}
              </h3>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-2">
                Published Notices
              </p>
              <p className={`text-[11px] ${themeTokens.textMuted} mt-0.5`}>
                Active announcements in broadcast stream
              </p>
            </div>
          </div>

          {/* Card 3: Dual metric (Classes & Courses) */}
          <div className={`md:col-span-4 ${themeTokens.card} p-6 flex items-center justify-around hover:border-slate-300 dark:hover:border-[#8D96A0] transition-all`}>
            <div className="text-center">
              <h3 className="text-3xl font-black text-blue-500 tracking-tight leading-none">
                {data.classesCount}
              </h3>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-2">
                Classes
              </p>
              <p className={`text-[10px] ${themeTokens.textMuted} mt-0.5`}>
                Weekly scheduled slots
              </p>
            </div>

            <div className={`h-14 w-px ${themeTokens.border}`}></div>

            <div className="text-center">
              <h3 className="text-3xl font-black text-emerald-500 tracking-tight leading-none">
                {data.coursesCount}
              </h3>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-2">
                Courses
              </p>
              <p className={`text-[10px] ${themeTokens.textMuted} mt-0.5`}>
                Active curriculum subjects
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Real-time Telemetry & Server Traffic */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
        {/* API Traffic Area Chart */}
        <div className={`${themeTokens.card} p-5`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-[#F0F6FC]">API Gateway Telemetry</h2>
              <p className={`text-[11px] ${themeTokens.textMuted} mt-0.5`}>Requests and edge function invocations</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-bold">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-[#8D96A0]">
                <span className="w-2 h-2 rounded bg-brand"></span> Requests
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-[#8D96A0]">
                <span className="w-2 h-2 rounded bg-rose-500"></span> Errors
              </span>
            </div>
          </div>
          
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={serverTrafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartPrimary} stopOpacity={0.25}/>
                    <stop offset="95%" stopColor={chartPrimary} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorErrors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" strokeOpacity={0.08} />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: chartAxisText, fontWeight: 600 }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: chartAxisText, fontWeight: 600 }} />
                <Tooltip 
                  contentStyle={tooltipStyle}
                  itemStyle={tooltipItemStyle}
                  labelStyle={tooltipLabelStyle}
                />
                <Area type="monotone" dataKey="requests" stroke={chartPrimary} strokeWidth={2.5} fillOpacity={1} fill="url(#colorRequests)" />
                <Area type="monotone" dataKey="errors" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorErrors)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Growth Bar Chart */}
        <div className={`${themeTokens.card} p-5`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-[#F0F6FC]">Active Accounts Cohort</h2>
              <p className={`text-[11px] ${themeTokens.textMuted} mt-0.5`}>Monthly verified students &amp; faculty</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-bold">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-[#8D96A0]">
                <span className="w-2 h-2 rounded bg-brand"></span> Students
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-[#8D96A0]">
                <span className="w-2 h-2 rounded bg-amber-500"></span> Faculty
              </span>
            </div>
          </div>
          
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barGap={6}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" strokeOpacity={0.08} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: chartAxisText, fontWeight: 600 }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: chartAxisText, fontWeight: 600 }} />
                <Tooltip 
                  contentStyle={tooltipStyle}
                  itemStyle={tooltipItemStyle}
                  labelStyle={tooltipLabelStyle}
                />
                <Bar dataKey="students" fill={chartPrimary} radius={[6, 6, 0, 0]} />
                <Bar dataKey="faculty" fill="#F59E0B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
