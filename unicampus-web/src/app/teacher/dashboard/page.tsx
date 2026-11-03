"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  QrCode, 
  TableProperties, 
  Megaphone, 
  UploadCloud, 
  Users, 
  TrendingUp, 
  Clock, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Play, 
  ArrowRight, 
  ExternalLink, 
  Paperclip, 
  FileText, 
  MessageSquare, 
  Check, 
  X, 
  Send, 
  Sparkles, 
  AlertCircle,
  Building2,
  CalendarDays,
  Printer,
  ChevronRight,
  ShieldCheck,
  Eye
} from "lucide-react";
import { SPOTLIGHT } from "@/lib/theme";
import SpotlightCard from "@/components/bits/SpotlightCard";

interface TeachingSession {
  id: string;
  timeSlot: string;
  courseCode: string;
  courseTitle: string;
  section: string;
  room: string;
  enrolledCount: number;
  isNext?: boolean;
}

interface StudentInquiry {
  id: string;
  name: string;
  studentId: string;
  courseCode: string;
  timeAgo: string;
  message: string;
  attachment?: {
    name: string;
    type: "pdf" | "medical";
  };
  hasApproveAction?: boolean;
  status?: "pending" | "approved";
}

const SCHEDULE_SESSIONS: TeachingSession[] = [
  {
    id: "sess-1",
    timeSlot: "10:00 - 11:30 AM",
    courseCode: "CSE-3101",
    courseTitle: "Design & Analysis of Algorithms",
    section: "Sec A",
    room: "Room 402",
    enrolledCount: 45,
    isNext: true,
  },
  {
    id: "sess-2",
    timeSlot: "11:45 - 01:15 PM",
    courseCode: "CSE-3101",
    courseTitle: "Design & Analysis of Algorithms",
    section: "Sec B",
    room: "Room 405",
    enrolledCount: 48,
    isNext: false,
  },
  {
    id: "sess-3",
    timeSlot: "02:00 - 04:00 PM",
    courseCode: "CSE-4109",
    courseTitle: "Advanced Graph Theory & Network Flows",
    section: "Sec A",
    room: "Room 602",
    enrolledCount: 36,
    isNext: false,
  },
];

const INITIAL_INQUIRIES: StudentInquiry[] = [
  {
    id: "inq-1",
    name: "Sakib Ahmed",
    studentId: "211-15-4424",
    courseCode: "CSE-3101",
    timeAgo: "12m ago",
    message: "Submitted Group 04 Heap Benchmark proposal PDF for approval.",
    attachment: {
      name: "proposal.pdf",
      type: "pdf",
    },
  },
  {
    id: "inq-2",
    name: "Nusrat Jahan",
    studentId: "211-15-4425",
    courseCode: "CSE-3101",
    timeAgo: "45m ago",
    message: "Requesting medical leave attendance excusal for Oct 18 lecture.",
    attachment: {
      name: "Medical slip",
      type: "medical",
    },
    hasApproveAction: true,
    status: "pending",
  },
  {
    id: "inq-3",
    name: "Rafiqul Islam",
    studentId: "211-15-4430",
    courseCode: "CSE-4109",
    timeAgo: "2h ago",
    message: "Question regarding Assignment 2 NP-completeness proof reduction.",
  },
];

export default function TeacherCommandCenterPage() {
  const [inquiries, setInquiries] = useState<StudentInquiry[]>(INITIAL_INQUIRIES);
  const [activeSessionModal, setActiveSessionModal] = useState<TeachingSession | null>(null);
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);
  const [announcementSection, setAnnouncementSection] = useState("All Sections");
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementBody, setAnnouncementBody] = useState("");
  const [announcementSuccess, setAnnouncementSuccess] = useState(false);

  // Quick reply modal
  const [replyInquiry, setReplyInquiry] = useState<StudentInquiry | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replySentId, setReplySentId] = useState<string | null>(null);

  const handleApproveMedical = (id: string) => {
    setInquiries((prev) =>
      prev.map((inq) =>
        inq.id === id ? { ...inq, status: "approved" } : inq
      )
    );
  };

  const handleSendReply = () => {
    if (!replyInquiry) return;
    setReplySentId(replyInquiry.id);
    setTimeout(() => {
      setReplyInquiry(null);
      setReplyText("");
      setReplySentId(null);
    }, 1000);
  };

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementTitle.trim()) return;
    setAnnouncementSuccess(true);
    setTimeout(() => {
      setAnnouncementSuccess(false);
      setIsAnnouncementOpen(false);
      setAnnouncementTitle("");
      setAnnouncementBody("");
    }, 1200);
  };

  return (
    <div className="w-full space-y-7 pb-20 select-none">
      {/* ========================================================================= */}
      {/* 1. FACULTY HERO HEADER CARD                                               */}
      {/* ========================================================================= */}
      <SpotlightCard
        className="relative rounded-3xl bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] p-6 sm:p-7 overflow-hidden shadow-xl"
        spotlightColor="rgba(37, 99, 235, 0.16)"
        borderGlowColor="rgba(37, 99, 235, 0.4)"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2563EB]/10 dark:bg-[#2563EB]/15 border border-[#2563EB]/25 text-xs font-mono text-[#2563EB] dark:text-[#60A5FA] font-semibold mb-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Spring Semester 2026 • Live Sync Active
            </div>
            <h1 className="text-2xl sm:text-3xl font-manrope font-extrabold text-slate-900 dark:text-[#F0F6FC] tracking-[-0.02em] leading-tight">
              Welcome, Dr. Asif Rahman
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#8D96A0] mt-1 font-normal">
              Associate Professor, Department of Computer Science &amp; Engineering • Spring 2026
            </p>
          </div>

          {/* Pulsing Amber/Indigo Countdown Pill Badge */}
          <div className="shrink-0 flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#161B22] border border-amber-500/35 shadow-[0_0_20px_rgba(245,158,11,0.08)]">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono tracking-wider font-bold text-amber-500 dark:text-amber-400">
                Immediate Session
              </div>
              <div className="text-xs font-manrope font-bold text-slate-900 dark:text-[#F0F6FC]">
                Next Class in <span className="text-amber-500 dark:text-amber-400 font-mono">25 mins</span> •{" "}
                <span className="font-mono text-[#2563EB] dark:text-[#60A5FA]">CSE-3101</span> (Room 402)
              </div>
            </div>
          </div>
        </div>
      </SpotlightCard>

      {/* ========================================================================= */}
      {/* 2. QUICK ACTION STRIP (4 prominent interactive action cards)               */}
      {/* ========================================================================= */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Action 1: Primary #2563EB Gradient Card */}
          <Link
            href="/teacher/attendance"
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2563EB] via-[#1D5BD8] to-[#4F4AE6] p-5 text-white shadow-lg shadow-[#2563EB]/20 hover:scale-[1.01] hover:shadow-[#2563EB]/30 transition-all cursor-pointer group flex flex-col justify-between min-h-[135px]"
          >
            <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/10 blur-xl"></div>
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                <QrCode className="w-5 h-5 text-white" />
              </div>
              <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
            <div className="mt-3">
              <h3 className="font-manrope font-bold text-sm sm:text-base tracking-tight text-white">
                Launch Live Attendance (QR)
              </h3>
              <p className="text-xs text-white/80 mt-0.5 font-normal">
                Start dynamic 15s check-in
              </p>
            </div>
          </Link>

          {/* Action 2: Enter Grades */}
          <Link
            href="/teacher/grades"
            className="rounded-2xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] p-5 hover:border-[#2563EB]/50 hover:bg-slate-50 dark:hover:bg-[#1C2128] hover:scale-[1.01] transition-all cursor-pointer group flex flex-col justify-between min-h-[135px] shadow-xs"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] flex items-center justify-center text-[#2563EB] group-hover:bg-[#2563EB]/10 transition-colors">
                <TableProperties className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 dark:text-[#6E747D] group-hover:text-[#2563EB] group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="mt-3">
              <h3 className="font-manrope font-bold text-sm sm:text-base text-slate-900 dark:text-[#F0F6FC] tracking-tight group-hover:text-[#2563EB] transition-colors">
                Enter Grades
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#8D96A0] mt-0.5">
                Midterm marks due in <span className="text-amber-500 dark:text-amber-400 font-mono font-bold">3 days</span>
              </p>
            </div>
          </Link>

          {/* Action 3: Post Class Announcement */}
          <div
            onClick={() => setIsAnnouncementOpen(true)}
            className="rounded-2xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] p-5 hover:border-[#2563EB]/50 hover:bg-slate-50 dark:hover:bg-[#1C2128] hover:scale-[1.01] transition-all cursor-pointer group flex flex-col justify-between min-h-[135px] shadow-xs"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] flex items-center justify-center text-[#2563EB] group-hover:bg-[#2563EB]/10 transition-colors">
                <Megaphone className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 dark:text-[#6E747D] group-hover:text-[#2563EB] group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="mt-3">
              <h3 className="font-manrope font-bold text-sm sm:text-base text-slate-900 dark:text-[#F0F6FC] tracking-tight group-hover:text-[#2563EB] transition-colors">
                Post Class Announcement
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#8D96A0] mt-0.5">
                Notify enrolled sections
              </p>
            </div>
          </div>

          {/* Action 4: Upload Courseware */}
          <Link
            href="/teacher/materials"
            className="rounded-2xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] p-5 hover:border-[#2563EB]/50 hover:bg-slate-50 dark:hover:bg-[#1C2128] hover:scale-[1.01] transition-all cursor-pointer group flex flex-col justify-between min-h-[135px] shadow-xs"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] flex items-center justify-center text-[#2563EB] group-hover:bg-[#2563EB]/10 transition-colors">
                <UploadCloud className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 dark:text-[#6E747D] group-hover:text-[#2563EB] group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="mt-3">
              <h3 className="font-manrope font-bold text-sm sm:text-base text-slate-900 dark:text-[#F0F6FC] tracking-tight group-hover:text-[#2563EB] transition-colors">
                Upload Courseware
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#8D96A0] mt-0.5">
                Slides, labs &amp; references
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. 4-COLUMN FACULTY METRIC BENTO GRID                                     */}
      {/* ========================================================================= */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Total Assigned Students */}
          <div className="rounded-3xl bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] p-5 hover:border-[#2563EB]/30 transition-colors shadow-xs relative">
            <div className="flex items-center justify-between text-slate-500 dark:text-[#8D96A0] mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Total Assigned Students
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#2563EB]/10 border border-[#2563EB]/20 text-[#2563EB] flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-manrope font-extrabold text-slate-900 dark:text-[#F0F6FC] tracking-tight font-mono tabular-nums">
                184
              </span>
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold">
                Active
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#8D96A0] mt-2 font-normal">
              Across 3 active sections
            </p>
          </div>

          {/* Card 2: Average Class Attendance */}
          <div className="rounded-3xl bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] p-5 hover:border-[#2563EB]/30 transition-colors shadow-xs relative">
            <div className="flex items-center justify-between text-slate-500 dark:text-[#8D96A0] mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Average Class Attendance
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-manrope font-extrabold text-slate-900 dark:text-[#F0F6FC] tracking-tight font-mono tabular-nums">
                88.5%
              </span>
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-0.5 font-bold">
                <TrendingUp className="w-3 h-3" />
                +3.2% vs Dept Avg
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#8D96A0] mt-2 font-normal">
              Outperforming CSE Dept baseline (85%)
            </p>
          </div>

          {/* Card 3: Pending Grading Tasks */}
          <div className="rounded-3xl bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] p-5 hover:border-[#2563EB]/30 transition-colors shadow-xs relative">
            <div className="flex items-center justify-between text-slate-500 dark:text-[#8D96A0] mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Pending Grading Tasks
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-manrope font-extrabold text-slate-900 dark:text-[#F0F6FC] tracking-tight font-mono tabular-nums">
                2
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-[#8D96A0]">
                assignments
              </span>
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/25 text-[11px] font-mono text-amber-600 dark:text-amber-400 font-bold truncate max-w-full">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
              <span className="truncate">CSE-3101 Quiz 2 &amp; Lab 4</span>
            </div>
          </div>

          {/* Card 4: Office Hours */}
          <div className="rounded-3xl bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] p-5 hover:border-[#2563EB]/30 transition-colors shadow-xs relative">
            <div className="flex items-center justify-between text-slate-500 dark:text-[#8D96A0] mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Office Consultation Hours
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#2563EB]/10 border border-[#2563EB]/20 text-[#2563EB] flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline">
              <span className="text-base font-manrope font-bold text-slate-900 dark:text-[#F0F6FC] tracking-tight font-mono">
                Today 02:00 PM - 04:00 PM
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#8D96A0] mt-2 flex items-center gap-1.5 font-normal">
              <MapPin className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
              <span>Room 508 • 3 student slots booked</span>
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. BOTTOM WORKSPACE SPLIT GRID (65% Schedule / 35% Inquiries)             */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Left Panel (65%): Today's Teaching Schedule */}
        <div className="lg:col-span-8 rounded-3xl bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] p-6 flex flex-col justify-between shadow-xl">
          <div>
            {/* Header bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-[#30363D]">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-manrope font-bold text-slate-900 dark:text-[#F0F6FC] tracking-tight">
                    Today&apos;s Teaching Schedule
                  </h2>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#161B22] text-slate-600 dark:text-[#8D96A0] text-[11px] font-mono border border-slate-200 dark:border-[#30363D]">
                    3 Sessions
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-[#8D96A0] mt-0.5">
                  Faculty course allocation for Monday, Spring 2026
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/teacher/routine"
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#161B22] text-xs font-semibold text-slate-800 dark:text-[#F0F6FC] border border-slate-200 dark:border-[#30363D] hover:border-[#2563EB]/40 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <CalendarDays className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Full Week</span>
                </Link>

                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl bg-[#2563EB] text-white text-xs font-semibold shadow-xs hover:bg-[#1D4ED8] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* Teaching Schedule Table */}
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-[#6E747D] border-b border-slate-200 dark:border-[#30363D]/60">
                    <th className="py-3 px-3 font-semibold">Time Slot</th>
                    <th className="py-3 px-3 font-semibold">Course Code &amp; Title</th>
                    <th className="py-3 px-3 font-semibold">Section</th>
                    <th className="py-3 px-3 font-semibold">Room Number</th>
                    <th className="py-3 px-3 font-semibold text-right">Enrolled Count</th>
                    <th className="py-3 px-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#30363D]/40">
                  {SCHEDULE_SESSIONS.map((session, idx) => (
                    <tr
                      key={session.id}
                      className="group hover:bg-slate-50 dark:hover:bg-[#161B22]/60 transition-colors"
                    >
                      {/* Time Slot */}
                      <td className="py-4 px-3 font-mono font-semibold text-slate-900 dark:text-[#F0F6FC] whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {session.isNext && (
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                          )}
                          <span>{session.timeSlot}</span>
                        </div>
                      </td>

                      {/* Course Code & Title */}
                      <td className="py-4 px-3">
                        <div className="font-mono font-bold text-[#2563EB] dark:text-[#60A5FA] group-hover:underline cursor-pointer">
                          {session.courseCode}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-[#8D96A0]">
                          {session.courseTitle}
                        </div>
                      </td>

                      {/* Section */}
                      <td className="py-4 px-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] font-mono text-[11px] text-slate-800 dark:text-[#F0F6FC] whitespace-nowrap inline-block">
                          {session.section}
                        </span>
                      </td>

                      {/* Room Number */}
                      <td className="py-4 px-3 font-mono text-slate-800 dark:text-[#F0F6FC] whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-[#6E747D]" />
                          {session.room}
                        </span>
                      </td>

                      {/* Enrolled Count */}
                      <td className="py-4 px-3 text-right font-mono text-slate-900 dark:text-[#F0F6FC] font-semibold tabular-nums">
                        {session.enrolledCount}{" "}
                        <span className="text-[10px] text-slate-400 dark:text-[#6E747D] font-sans">
                          Students
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-4 px-3 text-right whitespace-nowrap">
                        {idx === 0 ? (
                          <button
                            onClick={() => setActiveSessionModal(session)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-[0.98]"
                          >
                            <Play className="w-3.5 h-3.5 fill-white" />
                            <span>Launch Class</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => setActiveSessionModal(session)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-[#161B22] hover:bg-slate-200 dark:hover:bg-[#21262D] text-slate-900 dark:text-[#F0F6FC] border border-slate-200 dark:border-[#30363D] text-xs font-medium transition-all cursor-pointer active:scale-[0.98]"
                          >
                            <Play className="w-3.5 h-3.5 text-slate-400 dark:text-[#6E747D]" />
                            <span>Launch Class</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table Footer */}
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-[#30363D] flex items-center justify-between text-xs text-slate-500 dark:text-[#8D96A0]">
            <span className="font-mono">Total teaching hours scheduled today: 5.0 hrs</span>
            <Link
              href="/teacher/routine"
              className="text-[#2563EB] dark:text-[#60A5FA] hover:underline font-semibold inline-flex items-center gap-1"
            >
              <span>View Enrolled Student Rosters</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Panel (35%): Student Inquiries Requiring Review */}
        <div className="lg:col-span-4 rounded-3xl bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#30363D]">
              <div>
                <h2 className="text-lg font-manrope font-bold text-slate-900 dark:text-[#F0F6FC] tracking-tight">
                  Student Inquiries Requiring Review
                </h2>
                <p className="text-xs text-slate-500 dark:text-[#8D96A0] mt-0.5">
                  3 inquiries pending direct instructor review
                </p>
              </div>
              <span className="w-6 h-6 rounded-full bg-[#2563EB]/20 text-[#2563EB] border border-[#2563EB]/30 text-xs font-mono font-bold flex items-center justify-center">
                {inquiries.length}
              </span>
            </div>

            {/* Inquiries List */}
            <div className="mt-4 space-y-3.5">
              {inquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] hover:border-[#2563EB]/40 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#2563EB]/20 to-purple-500/20 border border-[#2563EB]/30 font-manrope font-bold text-xs text-slate-900 dark:text-[#F0F6FC] flex items-center justify-center shrink-0">
                        {inquiry.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold font-manrope text-slate-900 dark:text-[#F0F6FC] group-hover:text-[#2563EB] transition-colors">
                          {inquiry.name}
                        </h4>
                        <p className="text-[10px] font-mono text-slate-400 dark:text-[#6E747D]">
                          ID: {inquiry.studentId} •{" "}
                          <span className="text-[#2563EB] font-semibold">
                            {inquiry.courseCode}
                          </span>
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 dark:text-[#6E747D]">
                      {inquiry.timeAgo}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 mt-2.5 leading-relaxed bg-white dark:bg-[#0D1117] p-2.5 rounded-xl border border-slate-200/80 dark:border-[#30363D]/60 font-normal">
                    &quot;{inquiry.message}&quot;
                  </p>

                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-200 dark:border-[#30363D]/40 text-xs">
                    {inquiry.attachment ? (
                      inquiry.attachment.type === "medical" ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Medical slip
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-500 dark:text-[#8D96A0]">
                          <Paperclip className="w-3.5 h-3.5 text-amber-500" />{" "}
                          {inquiry.attachment.name}
                        </span>
                      )
                    ) : (
                      <span className="text-[11px] text-slate-400 dark:text-[#6E747D] font-mono">
                        Office Hours Slot?
                      </span>
                    )}

                    <div className="flex items-center gap-2">
                      {inquiry.hasApproveAction && (
                        <button
                          onClick={() => handleApproveMedical(inquiry.id)}
                          disabled={inquiry.status === "approved"}
                          className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-bold transition-colors cursor-pointer ${
                            inquiry.status === "approved"
                              ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                              : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20"
                          }`}
                        >
                          {inquiry.status === "approved" ? "Approved" : "Approve"}
                        </button>
                      )}

                      <button
                        onClick={() => setReplyInquiry(inquiry)}
                        className="text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] hover:underline transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Reply</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Action */}
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-[#30363D]">
            <Link
              href="/messages"
              className="w-full py-2.5 px-3 rounded-2xl bg-slate-50 dark:bg-[#161B22] hover:bg-slate-100 dark:hover:bg-[#1C2128] border border-slate-200 dark:border-[#30363D] text-xs font-semibold text-slate-900 dark:text-[#F0F6FC] flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <MessageSquare className="w-4 h-4 text-[#2563EB]" />
              <span>Open Faculty Communication Hub</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. MODALS & SLIDE-OVERS (Class Launch & Announcements)                      */}
      {/* ========================================================================= */}
      {/* Launch Class Modal */}
      {activeSessionModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] rounded-3xl p-6 sm:p-7 shadow-2xl relative">
            <button
              onClick={() => setActiveSessionModal(null)}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-[#F0F6FC] hover:bg-slate-100 dark:hover:bg-[#161B22] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-md font-mono text-[10px] font-bold bg-[#2563EB]/15 text-[#2563EB] border border-[#2563EB]/30 uppercase">
                {activeSessionModal.courseCode} • {activeSessionModal.section}
              </span>
              <span className="text-xs font-mono text-slate-400 dark:text-[#6E747D]">
                {activeSessionModal.room}
              </span>
            </div>

            <h3 className="text-xl font-manrope font-bold text-slate-900 dark:text-[#F0F6FC]">
              {activeSessionModal.courseTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#8D96A0] mt-1">
              Time: {activeSessionModal.timeSlot} • {activeSessionModal.enrolledCount} Registered Students
            </p>

            <div className="my-5 p-4 rounded-2xl bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-[#8D96A0]">Biometric Attendance:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Ready to stream
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-[#8D96A0]">Presentation Mode:</span>
                <span className="text-slate-800 dark:text-[#F0F6FC] font-mono">Lecture 08 Slides synced</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={`/teacher/attendance?course=${activeSessionModal.courseCode}&section=${activeSessionModal.section}`}
                className="flex-1 py-2.5 px-4 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <QrCode className="w-4 h-4" />
                <span>Launch QR Attendance Now</span>
              </Link>
              <button
                onClick={() => setActiveSessionModal(null)}
                className="py-2.5 px-4 rounded-2xl bg-slate-100 dark:bg-[#161B22] text-slate-800 dark:text-[#F0F6FC] border border-slate-200 dark:border-[#30363D] text-xs font-semibold hover:bg-slate-200 dark:hover:bg-[#21262D] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post Class Announcement Modal */}
      {isAnnouncementOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] rounded-3xl p-6 sm:p-7 shadow-2xl relative">
            <button
              onClick={() => setIsAnnouncementOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-[#F0F6FC] hover:bg-slate-100 dark:hover:bg-[#161B22] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-2 text-[#2563EB]">
              <Megaphone className="w-5 h-5" />
              <h3 className="text-lg font-manrope font-bold text-slate-900 dark:text-[#F0F6FC]">
                Post Class Announcement
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#8D96A0] mb-4">
              Send instant broadcast circulars to students enrolled in your teaching sections.
            </p>

            <form onSubmit={handlePostAnnouncement} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-[#F0F6FC] mb-1">
                  Target Enrolled Section
                </label>
                <select
                  value={announcementSection}
                  onChange={(e) => setAnnouncementSection(e.target.value)}
                  className="w-full h-10 px-3 bg-white dark:bg-[#161B22] border border-slate-300 dark:border-[#30363D] rounded-xl text-xs text-slate-900 dark:text-[#F0F6FC] focus:outline-none focus:border-[#2563EB]"
                >
                  <option value="All Sections">All Sections (184 Enrolled Students)</option>
                  <option value="CSE-3101 Sec A">CSE-3101 Algorithms — Sec A (45 Students)</option>
                  <option value="CSE-3101 Sec B">CSE-3101 Algorithms — Sec B (48 Students)</option>
                  <option value="CSE-4109 Sec A">CSE-4109 Graph Theory — Sec A (36 Students)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-[#F0F6FC] mb-1">
                  Announcement Title
                </label>
                <input
                  type="text"
                  required
                  value={announcementTitle}
                  onChange={(e) => setAnnouncementTitle(e.target.value)}
                  placeholder="e.g. Lab 4 Submission Grace Period & Rubric Update"
                  className="w-full h-10 px-3 bg-white dark:bg-[#161B22] border border-slate-300 dark:border-[#30363D] rounded-xl text-xs text-slate-900 dark:text-[#F0F6FC] focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-[#F0F6FC] mb-1">
                  Message Body
                </label>
                <textarea
                  rows={4}
                  value={announcementBody}
                  onChange={(e) => setAnnouncementBody(e.target.value)}
                  placeholder="Details regarding lecture slides, lab deadline extensions, or room reallocations..."
                  className="w-full p-3 bg-white dark:bg-[#161B22] border border-slate-300 dark:border-[#30363D] rounded-xl text-xs text-slate-900 dark:text-[#F0F6FC] focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {announcementSuccess ? "Broadcast Dispatched!" : "Publish Announcement"}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsAnnouncementOpen(false)}
                  className="py-2.5 px-4 rounded-2xl bg-slate-100 dark:bg-[#161B22] text-slate-800 dark:text-[#F0F6FC] border border-slate-200 dark:border-[#30363D] text-xs font-semibold hover:bg-slate-200 dark:hover:bg-[#21262D] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Reply Modal */}
      {replyInquiry && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setReplyInquiry(null)}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-[#F0F6FC] hover:bg-slate-100 dark:hover:bg-[#161B22] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-manrope font-bold text-slate-900 dark:text-[#F0F6FC] mb-1">
              Reply to {replyInquiry.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#8D96A0] font-mono mb-4">
              ID: {replyInquiry.studentId} • Course: {replyInquiry.courseCode}
            </p>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] text-xs text-slate-600 dark:text-[#8D96A0] mb-4">
              &quot;{replyInquiry.message}&quot;
            </div>

            <textarea
              rows={3}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your response to the student..."
              className="w-full p-3 bg-white dark:bg-[#161B22] border border-slate-300 dark:border-[#30363D] rounded-xl text-xs text-slate-900 dark:text-[#F0F6FC] focus:outline-none focus:border-[#2563EB] mb-4"
            />

            <div className="flex gap-2">
              <button
                onClick={handleSendReply}
                className="flex-1 py-2 px-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{replySentId ? "Sent!" : "Send Response"}</span>
              </button>
              <button
                onClick={() => setReplyInquiry(null)}
                className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-[#161B22] text-slate-700 dark:text-[#8D96A0] text-xs font-semibold hover:bg-slate-200 dark:hover:bg-[#21262D] transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
