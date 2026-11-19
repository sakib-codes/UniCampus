"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import {
  Clock,
  ArrowRight,
  MessageSquare,
  GraduationCap,
  BookOpen,
  QrCode,
  ShieldCheck,
  Layers,
  CheckCircle2
} from "lucide-react";
import ProfileAvatar from "@/components/common/ProfileAvatar";
import StatCard from "@/components/common/StatCard";
import LectureScheduleCard from "@/components/common/LectureScheduleCard";
import NoticeSnippetCard from "@/components/common/NoticeSnippetCard";
import AttendanceScannerModal from "@/components/attendance/AttendanceScannerModal";
import { Button } from "@/components/ui/Button";
import { getRoster, subscribeToAttendance, StudentRosterRecord } from "@/lib/attendanceService";
import { ACTIVE_TERM, CANONICAL_STUDENT } from "@/lib/canonicalCampus";

export default function DashboardPage() {
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [attendanceRecord, setAttendanceRecord] = useState<StudentRosterRecord | null>(null);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  // Check shared real-time attendance roster on mount & subscribe to updates
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
    <div className="w-full space-y-6 pb-6">
      {/* 1. Welcome Banner Card */}
      <section className="rounded-[20px] bg-surface border border-line p-6 md:p-8 transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            {attendanceRecord && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>
                  Attendance recorded: CSE-3101 · {attendanceRecord.checkInTime} ({attendanceRecord.checkInMethod === "QR" ? "QR Scan" : "PIN"})
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs font-semibold text-brand">
              <span>{ACTIVE_TERM}</span>
              <span>•</span>
              <span>{CANONICAL_STUDENT.semester}</span>
              <span>•</span>
              <span className="font-mono">{CANONICAL_STUDENT.id}</span>
            </div>

            <h1 className="font-bold text-2xl md:text-3xl tracking-tight text-fg">
              {greeting}, {CANONICAL_STUDENT.name}
            </h1>

            {attendanceRecord ? (
              <p className="text-sm text-fg-muted leading-relaxed">
                Your attendance for <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono">CSE-3101 (Room 402)</span> is recorded. Next class starts in{" "}
                <span className="text-fg font-medium">18 minutes</span>.
              </p>
            ) : (
              <p className="text-sm text-fg-muted leading-relaxed">
                You have <span className="text-fg font-medium">2 lectures</span> and{" "}
                <span className="text-fg font-medium">1 lab session</span> scheduled today. Next class starts in{" "}
                <span className="text-brand font-medium">18 minutes</span> in Room 402.
              </p>
            )}
          </div>

          {/* Action Buttons: Single focused CTA */}
          <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
            {attendanceRecord ? (
              <Button
                variant="primary"
                size="md"
                onClick={() => setIsAttendanceModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verified Pass</span>
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={() => setIsAttendanceModalOpen(true)}
              >
                <QrCode className="w-4 h-4" />
                <span>Scan Attendance</span>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* 2. Top Metric Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="Current CGPA"
          value="3.78"
          suffix="/ 4.00"
          icon={GraduationCap}
        />
        <StatCard
          label="Attendance Rate"
          value="92.4%"
          icon={ShieldCheck}
        />
        <StatCard
          label="Credits Completed"
          value="96"
          suffix="/ 144"
          icon={Layers}
        />
        <StatCard
          label="Active Courses"
          value="5"
          suffix="Enrolled"
          icon={BookOpen}
        />
      </section>

      {/* 3. Main Split Grid (8-col Routine / 4-col Sidebar) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Today's Routine */}
        <div className="lg:col-span-8 rounded-[20px] bg-surface border border-line p-6 space-y-6 transition-colors">
          <div className="flex items-center justify-between pb-4 border-b border-line">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-semibold text-base md:text-lg text-fg">
                  Today&apos;s Schedule
                </h2>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-fg-muted">
                  <span>Monday, Spring 2026</span>
                  <span>·</span>
                  <span className="text-brand font-medium">2 Lectures &amp; 1 Lab</span>
                </div>
              </div>
            </div>

            <Link
              href="/routine"
              className="text-xs font-semibold text-brand hover:underline inline-flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Full Timetable</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Routine List */}
          <div className="space-y-3.5">
            <LectureScheduleCard
              courseCode="CSE-3101"
              courseTitle="Design & Analysis of Algorithms"
              timeRange="10:00 AM - 11:30 AM"
              room="Room 402"
              instructorName="Dr. Asif Rahman"
              status="ongoing"
              statusText="Ongoing"
            />

            <LectureScheduleCard
              courseCode="CSE-3205"
              courseTitle="Software Engineering & System Design"
              timeRange="11:45 AM - 01:15 PM"
              room="Room 604-B"
              instructorName="Dr. Farhana Khan"
              status="upcoming"
              statusText="Upcoming"
              secondaryNote="Starts in 1h 15m"
            />

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
            />
          </div>
        </div>

        {/* Right Column: Notices & Messages */}
        <div className="lg:col-span-4 space-y-6">
          {/* Notices */}
          <div className="rounded-[20px] bg-surface border border-line p-5 space-y-4 transition-colors">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand" />
                <h2 className="font-semibold text-sm text-fg">
                  Campus Notices
                </h2>
              </div>
              <Link
                href="/notices"
                className="text-xs text-fg-muted hover:text-brand transition-colors cursor-pointer"
              >
                View all
              </Link>
            </div>

            <div className="space-y-3">
              <NoticeSnippetCard
                id="not-exam-108"
                category="URGENT"
                timeAgo="2h ago"
                title="Final Examination Schedule (Spring 2026) released"
                description="Controller of Examinations published the master final seat plan & time slots."
              />
              <NoticeSnippetCard
                id="not-reg-089"
                category="ACADEMIC"
                timeAgo="Yesterday"
                title="Course Add/Drop Deadline Extended for CSE & EEE"
                description="Academic registrar approved extended window for semester credit adjustments."
              />
              <NoticeSnippetCard
                id="not-hack-044"
                category="EVENT"
                timeAgo="3d ago"
                title="National Inter-University Hackathon 2026 Registration"
                description="Department inviting 3-member teams to represent UniCampus in national contest."
              />
            </div>
          </div>

          {/* Quick Messages */}
          <div className="rounded-[20px] bg-surface border border-line p-5 space-y-4 transition-colors">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <h2 className="font-semibold text-sm text-fg">
                  Direct Messages
                </h2>
              </div>
              <span className="text-xs text-fg-muted">2 unread</span>
            </div>

            <div className="space-y-2.5">
              <div
                onClick={() => openDirectMessage("Dr. Asif Rahman")}
                className="p-3 rounded-xl bg-canvas hover:bg-surface-2 border border-line transition-colors flex items-start gap-3 cursor-pointer group"
              >
                <div className="relative shrink-0 mt-0.5">
                  <ProfileAvatar alt="Dr. Asif Rahman" size="sm" className="rounded-xl" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-surface" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-semibold text-xs text-fg group-hover:text-brand transition-colors truncate">
                      Dr. Asif Rahman
                    </span>
                    <span className="text-xs text-fg-muted shrink-0">12m ago</span>
                  </div>
                  <p className="text-xs text-fg-muted mt-0.5 line-clamp-1">
                    Please upload your lab group roster by 5 PM.
                  </p>
                </div>
              </div>

              <div
                onClick={() => openDirectMessage("Nusrat Jahan")}
                className="p-3 rounded-xl bg-canvas hover:bg-surface-2 border border-line transition-colors flex items-start gap-3 cursor-pointer group"
              >
                <div className="relative shrink-0 mt-0.5">
                  <ProfileAvatar alt="Nusrat Jahan" size="sm" className="rounded-xl" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-surface" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-semibold text-xs text-fg group-hover:text-brand transition-colors truncate">
                      Nusrat Jahan
                    </span>
                    <span className="text-xs text-fg-muted shrink-0">1h ago</span>
                  </div>
                  <p className="text-xs text-fg-muted mt-0.5 line-clamp-1">
                    Shared the CSE-3101 DP notes in Google Drive.
                  </p>
                </div>
              </div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={() => window.dispatchEvent(new CustomEvent("open-messaging"))}
            >
              <MessageSquare className="w-3.5 h-3.5 text-brand" />
              <span>Open Messaging Drawer</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Attendance Modal */}
      <AttendanceScannerModal
        isOpen={isAttendanceModalOpen}
        onClose={() => setIsAttendanceModalOpen(false)}
        onSuccess={(student) => {
          setAttendanceRecord(student);
        }}
      />
    </div>
  );
}
