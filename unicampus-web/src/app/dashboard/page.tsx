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
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import ProfileAvatar from "@/components/common/ProfileAvatar";
import LectureScheduleCard from "@/components/common/LectureScheduleCard";
import NoticeSnippetCard from "@/components/common/NoticeSnippetCard";
import AttendanceScannerModal from "@/components/attendance/AttendanceScannerModal";
import { IdCardStatusWidget } from "@/components/common/IdCardStatusWidget";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { Button } from "@/components/ui/Button";
import { Stat } from "@/components/ui/Stat";
import { getRoster, subscribeToAttendance, StudentRosterRecord } from "@/lib/attendanceService";
import { ACTIVE_TERM, CANONICAL_STUDENT } from "@/lib/canonicalCampus";
import { adminService } from "@/lib/services/adminService";
import type { Profile } from "@/types/admin";

interface DashboardScheduleSlot {
  courseCode: string;
  courseTitle: string;
  timeRange: string;
  room: string;
  instructorName: string;
  status: "ongoing" | "upcoming" | "scheduled" | "completed";
  statusText?: string;
  secondaryNote?: string;
  isLab?: boolean;
}

const MONDAY_SCHEDULE: DashboardScheduleSlot[] = [
  {
    courseCode: "CSE-3101",
    courseTitle: "Design & Analysis of Algorithms",
    timeRange: "10:15 AM - 11:45 AM",
    room: "Room 402",
    instructorName: "Dr. Asif Rahman",
    status: "ongoing",
    statusText: "Ongoing",
  },
  {
    courseCode: "CSE-3205",
    courseTitle: "Software Engineering",
    timeRange: "01:00 PM - 02:30 PM",
    room: "Room 604-B",
    instructorName: "Dr. Farhana Khan",
    status: "upcoming",
    statusText: "Upcoming",
    secondaryNote: "Starts in 1h 15m",
  },
  {
    courseCode: "CSE-3102",
    courseTitle: "Algorithms Sessional Lab",
    timeRange: "02:45 PM - 04:45 PM",
    room: "Lab 4A",
    instructorName: "Tanvir Hasan",
    status: "scheduled",
    statusText: "Scheduled",
    secondaryNote: "Lab Workstation #14",
    isLab: true,
  },
];

export default function DashboardPage() {
  const { currentUser } = useAdminAuth();
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [attendanceRecord, setAttendanceRecord] = useState<StudentRosterRecord | null>(null);
  const [studentProfile, setStudentProfile] = useState<Profile | null>(() => {
    const student = adminService.getProfiles().find(
      (p) => p.student_id === CANONICAL_STUDENT.studentId || p.id === "user-stud-1"
    );
    return student || null;
  });

  useEffect(() => {
    const syncProfile = () => {
      const student = adminService.getProfiles().find(
        (p) => p.student_id === CANONICAL_STUDENT.studentId || p.id === "user-stud-1"
      );
      if (student) setStudentProfile(student);
    };
    syncProfile();
    window.addEventListener("unicampus:profiles-updated", syncProfile);
    window.addEventListener("storage", syncProfile);
    return () => {
      window.removeEventListener("unicampus:profiles-updated", syncProfile);
      window.removeEventListener("storage", syncProfile);
    };
  }, []);

  const ongoingClass = useMemo(
    () => MONDAY_SCHEDULE.find((s) => s.status === "ongoing"),
    []
  );

  const nextUpcomingClass = useMemo(
    () =>
      MONDAY_SCHEDULE.find(
        (s) => s.status === "upcoming" || (s.status === "scheduled" && s !== ongoingClass)
      ),
    [ongoingClass]
  );

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
      {/* Official Administrative Hold Alert Banner */}
      {(studentProfile?.financial_hold || studentProfile?.academic_hold) && (
        <div className="p-4 sm:p-5 rounded-2xl bg-danger-light border border-danger/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-danger text-on-brand flex items-center justify-center shrink-0 mt-0.5">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-danger">
                  {studentProfile.financial_hold && studentProfile.academic_hold
                    ? "Academic & Financial Administrative Hold Active"
                    : studentProfile.financial_hold
                    ? "Institutional Financial Hold Active"
                    : "Academic Administrative Hold Active"}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-danger/10 text-danger border border-danger/20 uppercase tracking-wider">
                  Restricted Access
                </span>
              </div>
              <p className="text-xs text-fg-muted mt-1 leading-relaxed">
                {studentProfile.hold_reason ||
                  (studentProfile.financial_hold
                    ? "Outstanding dues detected on student ledger. Access to semester grade reports and registration is temporarily restricted."
                    : "Your account is on hold pending advisor review.")}
              </p>
            </div>
          </div>
          {studentProfile.financial_hold && (
            <Link
              href="/payments"
              className="min-h-[40px] px-4 py-2 rounded-xl bg-danger text-on-brand hover:bg-danger/90 text-xs font-semibold flex items-center justify-center gap-1.5 shrink-0 transition-colors shadow-xs"
            >
              <span>Review &amp; Pay Dues</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      )}

      {/* ID Card Issuance & Print Status Tracker */}
      <IdCardStatusWidget
        academicId={currentUser?.student_id || studentProfile?.student_id || CANONICAL_STUDENT.studentId}
        profileHref="/profile"
      />

      {/* 1. Welcome Banner Card */}
      <section className="rounded-2xl bg-surface border border-line p-6 md:p-8 transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            {attendanceRecord && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success-light border border-success/20 text-xs font-medium text-success">
                <span className="w-2 h-2 rounded-full bg-success" />
                <span>
                  Attendance recorded: <span className="font-mono">CSE-3101</span> · <span className="tabular-nums">{attendanceRecord.checkInTime}</span> ({attendanceRecord.checkInMethod === "QR" ? "QR Scan" : "PIN"})
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs font-semibold text-brand font-sans">
              <span>{ACTIVE_TERM}</span>
              <span>•</span>
              <span>{CANONICAL_STUDENT.semester}</span>
              <span>•</span>
              <span className="font-mono">{CANONICAL_STUDENT.studentId}</span>
            </div>

            <h1 className="font-semibold text-2xl md:text-3xl tracking-tight text-fg">
              {greeting}, {CANONICAL_STUDENT.name}
            </h1>

            {attendanceRecord ? (
              <p className="text-sm text-fg-muted leading-relaxed">
                Your attendance for{" "}
                <span className="text-success font-semibold">
                  <span className="font-mono">{ongoingClass?.courseCode || "CSE-3101"}</span> ({ongoingClass?.room || "Room 402"})
                </span>{" "}
                is recorded • Next:{" "}
                <span className="text-fg font-medium">
                  {nextUpcomingClass
                    ? `${nextUpcomingClass.courseTitle} at ${nextUpcomingClass.timeRange.split(" - ")[0]}`
                    : "No more classes today"}
                </span>
              </p>
            ) : ongoingClass ? (
              <p className="text-sm text-fg-muted leading-relaxed">
                Currently in{" "}
                <span className="text-fg font-medium">
                  {ongoingClass.courseTitle} ({ongoingClass.room})
                </span>{" "}
                • Next:{" "}
                <span className="text-brand font-medium">
                  {nextUpcomingClass
                    ? `${nextUpcomingClass.courseTitle} at ${nextUpcomingClass.timeRange.split(" - ")[0]}`
                    : "None"}
                </span>
              </p>
            ) : (
              <p className="text-sm text-fg-muted leading-relaxed">
                Next class:{" "}
                <span className="text-brand font-medium">
                  {nextUpcomingClass
                    ? `${nextUpcomingClass.courseTitle} at ${nextUpcomingClass.timeRange.split(" - ")[0]}`
                    : "No scheduled classes"}
                </span>
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
                className="bg-success hover:bg-success/90 text-on-brand"
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
        <Link
          href="/dashboard/progress"
          className="group block rounded-2xl bg-surface border border-line p-5 hover:border-fg-subtle/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <Stat
            label="Current CGPA"
            value={
              <>
                <span>3.78</span>
                <span className="text-base font-medium ml-1 text-fg-muted">
                  / 4.00
                </span>
              </>
            }
            icon={
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-line bg-brand-soft text-brand">
                <GraduationCap className="w-5 h-5" aria-hidden="true" />
              </div>
            }
          />
        </Link>

        <div className="rounded-2xl bg-surface border border-line p-5">
          <Stat
            label="Attendance Rate"
            value="92.4%"
            icon={
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-line bg-brand-soft text-brand">
                <ShieldCheck className="w-5 h-5" aria-hidden="true" />
              </div>
            }
          />
        </div>

        <Link
          href="/dashboard/progress"
          className="group block rounded-2xl bg-surface border border-line p-5 hover:border-fg-subtle/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <Stat
            label="Credits Completed"
            value={
              <>
                <span>96</span>
                <span className="text-base font-medium ml-1 text-fg-muted">
                  / 144
                </span>
              </>
            }
            icon={
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-line bg-brand-soft text-brand">
                <Layers className="w-5 h-5" aria-hidden="true" />
              </div>
            }
          />
        </Link>

        <Link
          href="/routine"
          className="group block rounded-2xl bg-surface border border-line p-5 hover:border-fg-subtle/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <Stat
            label="Active Courses"
            value={
              <>
                <span>5</span>
                <span className="text-sm text-fg-muted ml-1.5 font-normal">
                  Enrolled
                </span>
              </>
            }
            icon={
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-line bg-brand-soft text-brand">
                <BookOpen className="w-5 h-5" aria-hidden="true" />
              </div>
            }
          />
        </Link>
      </section>

      {/* 3. Main Split Grid (8-col Routine / 4-col Sidebar) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Today's Routine */}
        <div className="lg:col-span-8 rounded-2xl bg-surface border border-line p-6 space-y-6 transition-colors">
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
                  <span>Monday, 3rd Year · 6th Semester</span>
                  <span>·</span>
                  <span className="text-brand font-medium">2 Lectures &amp; 1 Lab</span>
                </div>
              </div>
            </div>

            <Link
              href="/routine"
              className="text-xs font-semibold text-brand hover:underline inline-flex items-center gap-1 transition-colors cursor-pointer rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <span>Full Timetable</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Routine List */}
          <div className="space-y-3.5">
            {MONDAY_SCHEDULE.map((slot) => (
              <LectureScheduleCard
                key={slot.courseCode}
                courseCode={slot.courseCode}
                courseTitle={slot.courseTitle}
                timeRange={slot.timeRange}
                room={slot.room}
                instructorName={slot.instructorName}
                status={slot.status}
                statusText={slot.statusText}
                secondaryNote={slot.secondaryNote}
                isLab={slot.isLab}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Notices & Messages */}
        <div className="lg:col-span-4 space-y-6">
          {/* Notices */}
          <div className="rounded-2xl bg-surface border border-line p-5 space-y-4 transition-colors">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand" />
                <h2 className="font-semibold text-sm text-fg">
                  Campus Notices
                </h2>
              </div>
              <Link
                href="/notices"
                className="text-xs text-fg-muted hover:text-brand transition-colors cursor-pointer rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                View all
              </Link>
            </div>

            <div className="space-y-3">
              <NoticeSnippetCard
                id="not-exam-108"
                category="URGENT"
                timeAgo="2h ago"
                title="Final Examination Schedule (6th Semester, 2026) released"
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
          <div className="rounded-2xl bg-surface border border-line p-5 space-y-4 transition-colors">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success" />
                <h2 className="font-semibold text-sm text-fg">
                  Direct Messages
                </h2>
              </div>
              <span className="text-xs text-fg-muted tabular-nums">2 unread</span>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => openDirectMessage("Dr. Asif Rahman")}
                className="w-full text-left p-3 rounded-xl bg-canvas hover:bg-surface-2 border border-line transition-colors flex items-start gap-3 cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <div className="relative shrink-0 mt-0.5">
                  <ProfileAvatar alt="Dr. Asif Rahman" size="sm" className="rounded-xl" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-success rounded-full border-2 border-surface" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-semibold text-xs text-fg group-hover:text-brand transition-colors truncate">
                      Dr. Asif Rahman
                    </span>
                    <span className="text-xs text-fg-muted tabular-nums shrink-0">12m ago</span>
                  </div>
                  <p className="text-xs text-fg-muted mt-0.5 line-clamp-1">
                    Please upload your lab group roster by 5 PM.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => openDirectMessage("Nusrat Jahan")}
                className="w-full text-left p-3 rounded-xl bg-canvas hover:bg-surface-2 border border-line transition-colors flex items-start gap-3 cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <div className="relative shrink-0 mt-0.5">
                  <ProfileAvatar alt="Nusrat Jahan" size="sm" className="rounded-xl" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-success rounded-full border-2 border-surface" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-semibold text-xs text-fg group-hover:text-brand transition-colors truncate">
                      Nusrat Jahan
                    </span>
                    <span className="text-xs text-fg-muted tabular-nums shrink-0">1h ago</span>
                  </div>
                  <p className="text-xs text-fg-muted mt-0.5 line-clamp-1">
                    Shared the CSE-3101 DP notes in Google Drive.
                  </p>
                </div>
              </button>
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
