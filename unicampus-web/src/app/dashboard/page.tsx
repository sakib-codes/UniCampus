"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock, 
  ArrowRight, 
  MessageSquare, 
  GraduationCap, 
  ChevronUp, 
  BookOpen,
  QrCode,
  FileText,
  ShieldCheck,
  Layers,
  Play,
  X,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import FadeIn from "@/components/bits/FadeIn";
import ProfileAvatar from "@/components/common/ProfileAvatar";
import MetricBentoCard from "@/components/common/MetricBentoCard";
import LectureScheduleCard from "@/components/common/LectureScheduleCard";
import NoticeSnippetCard from "@/components/common/NoticeSnippetCard";
import AttendanceScannerModal from "@/components/attendance/AttendanceScannerModal";
import { getRoster, subscribeToAttendance, StudentRosterRecord } from "@/lib/attendanceService";

export default function DashboardPage() {
  const { currentUser } = useAdminAuth();
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [attendanceRecord, setAttendanceRecord] = useState<StudentRosterRecord | null>(null);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const studentName = currentUser?.full_name?.split(" ")[0] || "Sakib";

  // Check shared real-time attendance roster on mount & subscribe to teacher updates
  useEffect(() => {
    const syncAttendanceStatus = () => {
      const roster = getRoster();
      const match = roster.find(
        (s) =>
          (s.name.toLowerCase().includes("sakib") || s.studentId === "211-15-4424") &&
          s.status === "present"
      );
      if (match) {
        setAttendanceRecord(match);
      }
    };

    syncAttendanceStatus();

    const unsubscribe = subscribeToAttendance((event) => {
      if (event.type === "STUDENT_CHECKED_IN" && event.student) {
        if (
          event.student.name.toLowerCase().includes("sakib") ||
          event.student.studentId === "211-15-4424"
        ) {
          setAttendanceRecord(event.student);
        }
      } else if (event.type === "STATUS_CHANGED") {
        syncAttendanceStatus();
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const openDirectMessage = (peerName: string) => {
    window.dispatchEvent(
      new CustomEvent("open-messaging", { detail: { peerName } })
    );
  };

  return (
    <div className="w-full space-y-6 pb-6 select-none">
      {/* ======================================================== */}
      {/* 1. WELCOME HERO BANNER (Full-width rounded-3xl card)    */}
      {/* ======================================================== */}
      <FadeIn delay={0.05} direction="down">
        <section className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] p-6 md:p-8 shadow-xs dark:shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-colors">
          {/* Radial spotlight wash in upper right */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-brand/15 dark:bg-[#2563EB]/20 blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 right-1/4 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-2xl">
              {/* Eyebrow Pill */}
              {attendanceRecord ? (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono tracking-wider text-emerald-600 dark:text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-semibold text-slate-500 dark:text-[#8D96A0]">VERIFIED ATTENDANCE:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    CSE-3101 • {attendanceRecord.checkInTime} ({attendanceRecord.checkInMethod === "QR" ? "QR Scan" : "PIN"})
                  </span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] text-[11px] font-mono tracking-wider text-brand dark:text-[#2563EB]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                  <span className="font-semibold text-slate-500 dark:text-[#8D96A0]">ACADEMIC CYCLE:</span>
                  <span className="font-bold text-slate-900 dark:text-[#F0F6FC]">6TH SEMESTER • B.SC. IN CSE</span>
                </div>
              )}

              {/* Headline */}
              <h1 className="font-manrope font-extrabold text-2xl md:text-[30px] leading-tight tracking-[-0.02em] text-slate-900 dark:text-[#F0F6FC]">
                Welcome back, {studentName}
              </h1>

              {/* Subtitle */}
              {attendanceRecord ? (
                <p className="text-sm md:text-[14.5px] text-slate-600 dark:text-[#8D96A0] leading-relaxed">
                  Your attendance for <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">CSE-3101 (Room 402)</span> is cryptographically confirmed. Next class starts in{" "}
                  <span className="text-slate-900 dark:text-[#F0F6FC] font-semibold">18 minutes</span>.
                </p>
              ) : (
                <p className="text-sm md:text-[14.5px] text-slate-600 dark:text-[#8D96A0] leading-relaxed">
                  You have <span className="text-slate-900 dark:text-[#F0F6FC] font-semibold">3 lectures</span> and{" "}
                  <span className="text-slate-900 dark:text-[#F0F6FC] font-semibold">1 lab session</span> scheduled today. Next class starts in{" "}
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono font-medium">18 minutes</span> in Room 402.
                </p>
              )}
            </div>

            {/* Right CTA Cluster - horizontally aligned side-by-side, vertically centered */}
            <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
              {/* Secondary Action */}
              <Link
                href="/dashboard/progress"
                className="h-10 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 dark:bg-[#161B22] dark:hover:bg-[#21262D] dark:border-[#30363D] dark:hover:border-[#8D96A0]/40 text-xs font-semibold dark:text-[#F0F6FC] transition-all inline-flex items-center gap-2 cursor-pointer shadow-xs whitespace-nowrap"
              >
                <FileText className="w-4 h-4 text-slate-500 dark:text-[#8D96A0]" />
                <span>View Degree Audit</span>
              </Link>

              {/* Primary Glowing Button */}
              {attendanceRecord ? (
                <button
                  type="button"
                  onClick={() => setIsAttendanceModalOpen(true)}
                  className="h-10 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_6px_20px_rgba(16,185,129,0.30)] dark:shadow-[0_0_24px_rgba(16,185,129,0.45)] active:scale-[0.98] text-xs font-bold transition-all inline-flex items-center gap-2.5 cursor-pointer whitespace-nowrap"
                  title="View Attendance Verification Pass"
                  aria-label="Attendance Verified"
                >
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Attendance Verified ✓</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAttendanceModalOpen(true)}
                  className="h-10 px-5 rounded-2xl bg-brand hover:bg-brand-hover text-white shadow-[0_6px_20px_rgba(29, 91, 216,0.30)] dark:shadow-[0_0_24px_rgba(37, 99, 235,0.45)] dark:bg-[#2563EB] dark:hover:bg-[#5852ff] active:scale-[0.98] text-xs font-bold transition-all inline-flex items-center gap-2.5 cursor-pointer whitespace-nowrap"
                  title="Scan Classroom Attendance QR"
                  aria-label="Scan Attendance"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Scan Attendance</span>
                </button>
              )}
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ======================================================== */}
      {/* 2. TOP 4-COLUMN METRIC BENTO GRID                       */}
      {/* ======================================================== */}
      <FadeIn delay={0.1}>
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Current CGPA */}
          <MetricBentoCard
            label="Current CGPA"
            value="3.78"
            denominator="/ 4.00"
            icon={GraduationCap}
            badge={
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <ChevronUp className="w-3 h-3 stroke-[2.5]" />
                Top 5% in Batch
              </span>
            }
          />

          {/* Card 2: Attendance Rate */}
          <MetricBentoCard
            label="Attendance Rate"
            value="92.4%"
            progressPercent={92.4}
            progressBarGradient="bg-gradient-to-r from-brand to-emerald-400 dark:from-[#2563EB] dark:to-emerald-400"
            icon={ShieldCheck}
            footerText={
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                  ~ +2.1% from last month
                </span>
                <span className="text-slate-400 dark:text-[#6E747D]">Min: 75%</span>
              </div>
            }
          />

          {/* Card 3: Credits Completed */}
          <MetricBentoCard
            label="Credits Completed"
            value="96"
            denominator="/ 144"
            progressPercent={66.7}
            progressBarGradient="bg-brand dark:bg-[#2563EB]"
            icon={Layers}
            footerText="66.7% of Degree Fulfilled"
          />

          {/* Card 4: Active Courses */}
          <MetricBentoCard
            label="Active Courses"
            value="5"
            denominator="Enrolled"
            icon={BookOpen}
            footerText="15.0 Credit Hours • Spring 2026"
          />
        </section>
      </FadeIn>

      {/* ======================================================== */}
      {/* 3. MAIN CONTENT SPLIT GRID (8-col Left / 4-col Right)    */}
      {/* ======================================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ============================================== */}
        {/* LEFT COLUMN (65% width = 8/12 cols)            */}
        {/* ============================================== */}
        <div className="lg:col-span-8 rounded-3xl bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] p-6 md:p-7 space-y-6 shadow-xs transition-colors">
          {/* Panel Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#30363D]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand/10 border border-brand/20 dark:bg-[#161B22] dark:border-[#30363D] flex items-center justify-center text-brand dark:text-[#2563EB]">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-manrope font-bold text-lg text-slate-900 dark:text-[#F0F6FC]">
                  Today&apos;s Schedule &amp; Routine
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-slate-500 dark:text-[#8D96A0]">Monday, Spring 2026</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-[#6E747D]" />
                  <span className="text-xs text-brand dark:text-[#2563EB] font-medium font-mono">3 Classes &amp; 1 Lab</span>
                </div>
              </div>
            </div>

            <Link
              href="/routine"
              className="group text-xs font-semibold text-brand dark:text-[#2563EB] hover:text-brand-hover dark:hover:text-[#8682ff] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Full Timetable</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Chronological Lecture Cards (3 cards) */}
          <div className="space-y-4">
            {/* Card 1: Active / Ongoing */}
            <LectureScheduleCard
              courseCode="CSE-3101"
              courseTitle="Design & Analysis of Algorithms"
              timeRange="10:00 AM - 11:30 AM"
              room="Room 402"
              instructorName="Dr. Asif Rahman"
              status="ongoing"
              statusText="Ongoing"
              secondaryNote="Session in progress"
              actionButton={{
                label: "Join Live Note",
                href: "/materials",
                icon: Play,
              }}
            />

            {/* Card 2: Upcoming */}
            <LectureScheduleCard
              courseCode="CSE-3205"
              courseTitle="Software Engineering & System Design"
              timeRange="11:45 AM - 01:15 PM"
              room="Room 604-B"
              instructorName="Dr. Farhana Khan"
              status="upcoming"
              statusText="Upcoming"
              secondaryNote="Starts in 1h 15m"
              actionButton={{
                label: "View Syllabus",
                href: "/materials",
              }}
            />

            {/* Card 3: Scheduled Lab */}
            <LectureScheduleCard
              courseCode="CSE-3102"
              courseTitle="Algorithms Sessional Lab"
              timeRange="02:00 PM - 04:30 PM"
              room="Lab 4A (Software Wing)"
              instructorName="Tanvir Hasan"
              status="scheduled"
              statusText="Scheduled"
              secondaryNote="Lab Workstation #14"
              isLab={true}
              actionButton={{
                label: "Lab Manual",
                href: "/materials",
              }}
            />
          </div>
        </div>

        {/* ============================================== */}
        {/* RIGHT COLUMN (35% width = 4/12 cols)           */}
        {/* ============================================== */}
        <div className="lg:col-span-4 space-y-6">
          {/* Top Panel: Recent Campus Notices */}
          <div className="rounded-3xl bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] p-6 space-y-5 shadow-xs transition-colors">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#30363D]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand dark:bg-[#2563EB]" />
                <h2 className="font-manrope font-bold text-base text-slate-900 dark:text-[#F0F6FC]">
                  Recent Campus Notices
                </h2>
              </div>
              <Link
                href="/notices"
                className="text-xs font-mono font-medium text-slate-500 hover:text-brand dark:text-[#8D96A0] dark:hover:text-[#2563EB] transition-colors cursor-pointer"
              >
                View All
              </Link>
            </div>

            {/* 3 Notice Items */}
            <div className="space-y-4">
              <NoticeSnippetCard
                id="1"
                category="URGENT"
                timeAgo="2h ago"
                title="Midterm Exam Seat Plan Spring 2026 Published"
                description="Students are advised to check building allotment before Saturday."
              />

              <NoticeSnippetCard
                id="2"
                category="EXAM"
                timeAgo="Yesterday"
                title="Registration Deadline for Improvement Exams"
                description="Submit bank payment slips to Academic Registrar Office Room 102."
              />

              <NoticeSnippetCard
                id="3"
                category="ACADEMIC"
                timeAgo="3d ago"
                title="Library Extended Hours During Assessment Week"
                description="Central Library floors 2-4 will remain open until midnight."
              />
            </div>
          </div>

          {/* Bottom Panel: Quick Direct Messages Preview Card */}
          <div className="rounded-3xl bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] p-6 space-y-4 shadow-xs transition-colors">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#30363D]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <h2 className="font-manrope font-bold text-base text-slate-900 dark:text-[#F0F6FC]">
                  Quick Direct Messages
                </h2>
              </div>
              <span className="font-mono text-xs text-slate-400 dark:text-[#8D96A0]">2 unread</span>
            </div>

            {/* Messages List */}
            <div className="space-y-3">
              {/* Message 1: Dr. Asif Rahman */}
              <div
                onClick={() => openDirectMessage("Dr. Asif Rahman")}
                className="p-3 rounded-2xl bg-slate-50/70 hover:bg-slate-100/90 dark:bg-[#161B22] dark:hover:bg-[#21262D] border border-slate-200 dark:border-[#30363D] hover:border-slate-300 dark:hover:border-[#2563EB]/50 transition-all flex items-start gap-3 cursor-pointer group"
              >
                <div className="relative shrink-0 mt-0.5">
                  <ProfileAvatar alt="Dr. Asif Rahman" size="sm" className="rounded-xl border border-slate-200 dark:border-[#30363D]" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white dark:border-[#161B22]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-manrope font-bold text-xs text-slate-900 dark:text-[#F0F6FC] group-hover:text-brand dark:group-hover:text-[#2563EB] transition-colors truncate">
                      Dr. Asif Rahman
                    </span>
                    <span className="font-mono text-[10px] text-slate-400 dark:text-[#8D96A0] shrink-0">12m ago</span>
                  </div>
                  <p className="text-[11.5px] text-slate-600 dark:text-[#8D96A0] mt-0.5 line-clamp-2 leading-relaxed">
                    Please upload your lab group roster by <span className="text-slate-900 dark:text-[#F0F6FC] font-medium font-mono">5 PM</span>.
                  </p>
                </div>
              </div>

              {/* Message 2: Nusrat Jahan */}
              <div
                onClick={() => openDirectMessage("Nusrat Jahan")}
                className="p-3 rounded-2xl bg-slate-50/70 hover:bg-slate-100/90 dark:bg-[#161B22] dark:hover:bg-[#21262D] border border-slate-200 dark:border-[#30363D] hover:border-slate-300 dark:hover:border-[#2563EB]/50 transition-all flex items-start gap-3 cursor-pointer group"
              >
                <div className="relative shrink-0 mt-0.5">
                  <ProfileAvatar alt="Nusrat Jahan" size="sm" className="rounded-xl border border-slate-200 dark:border-[#30363D]" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white dark:border-[#161B22]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-manrope font-bold text-xs text-slate-900 dark:text-[#F0F6FC] group-hover:text-brand dark:group-hover:text-[#2563EB] transition-colors truncate">
                      Nusrat Jahan
                    </span>
                    <span className="font-mono text-[10px] text-slate-400 dark:text-[#8D96A0] shrink-0">1h ago</span>
                  </div>
                  <p className="text-[11.5px] text-slate-600 dark:text-[#8D96A0] mt-0.5 line-clamp-2 leading-relaxed">
                    Shared the <span className="text-brand dark:text-[#2563EB] font-mono font-medium">CSE-3101</span> DP notes in Google Drive.
                  </p>
                </div>
              </div>
            </div>

            {/* Full-width Bottom Button */}
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("open-messaging"))}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 dark:bg-[#161B22] dark:hover:bg-[#21262D] dark:border-[#30363D] dark:hover:border-[#2563EB]/40 text-xs font-semibold dark:text-[#F0F6FC] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <MessageSquare className="w-3.5 h-3.5 text-brand dark:text-[#2563EB]" />
              <span>Open Messaging Drawer</span>
            </button>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. MODAL: LIVE CAMERA / PIN ATTENDANCE SCANNER          */}
      {/* ======================================================== */}
      <AttendanceScannerModal
        isOpen={isAttendanceModalOpen}
        onClose={() => setIsAttendanceModalOpen(false)}
        onSuccess={(student, session) => {
          setAttendanceRecord(student);
        }}
      />
    </div>
  );
}
