"use client";

import { useState } from "react";
import Link from "next/link";
import {
  QrCode,
  Megaphone,
  Users,
  TrendingUp,
  Clock,
  Calendar,
  MapPin,
  CheckCircle2,
  Play,
  ArrowRight,
  Paperclip,
  MessageSquare,
  Send,
  CalendarDays,
  Printer,
  ChevronRight,
} from "lucide-react";
import {
  ACTIVE_TERM,
  CANONICAL_COURSES,
  CANONICAL_FACULTY,
  CANONICAL_ROSTER,
} from "@/lib/canonicalCampus";
import { teacherService } from "@/lib/services/teacherService";
import { Modal } from "@/components/ui";

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

function formatCompactRange(startTime: string, endTime: string): string {
  const startMeridiem = startTime.slice(-2);
  const endMeridiem = endTime.slice(-2);
  const startClean = startTime.replace(/\s*(AM|PM)$/i, "");
  if (startMeridiem === endMeridiem) {
    return `${startClean} - ${endTime}`;
  }
  return `${startTime} - ${endTime}`;
}

const CANONICAL_SECTION_ENROLLMENT: Record<string, number> = {
  "CSE-3101|Sec B": 48,
  "CSE-3101|Sec A": 45,
  "CSE-4109|Sec A": 36,
  "CSE-3102|Lab 4A": 45,
};

const SCHEDULE_SESSIONS: TeachingSession[] = teacherService
  .getRoutine()
  .filter((slot) => slot.day === "Monday" && slot.type !== "Consultation")
  .map((slot) => ({
    id: slot.id,
    timeSlot: formatCompactRange(slot.startTime, slot.endTime),
    courseCode: slot.courseCode,
    courseTitle:
      CANONICAL_COURSES[slot.courseCode as keyof typeof CANONICAL_COURSES]
        ?.title ?? slot.courseTitle,
    section: slot.section,
    room: slot.room,
    enrolledCount:
      CANONICAL_SECTION_ENROLLMENT[`${slot.courseCode}|${slot.section}`] ?? 45,
    isNext: slot.courseCode === "CSE-3101" && slot.section === "Sec A",
  }));

const TOTAL_ASSIGNED_STUDENTS = SCHEDULE_SESSIONS.reduce(
  (sum, s) => sum + s.enrolledCount,
  0
);

const ANNOUNCEMENT_SECTION_OPTIONS = [
  {
    value: "All Sections",
    label: `All Sections (${TOTAL_ASSIGNED_STUDENTS} Assigned Students)`,
  },
  {
    value: "CSE-3101 Sec A",
    label: `CSE-3101 ${CANONICAL_COURSES["CSE-3101"].title} — Sec A (45 Students)`,
  },
  {
    value: "CSE-3101 Sec B",
    label: `CSE-3101 ${CANONICAL_COURSES["CSE-3101"].title} — Sec B (48 Students)`,
  },
  {
    value: "CSE-4109 Sec A",
    label: `CSE-4109 ${CANONICAL_COURSES["CSE-4109"].title} — Sec A (36 Students)`,
  },
  {
    value: "CSE-3102 Lab 4A",
    label: `CSE-3102 ${CANONICAL_COURSES["CSE-3102"].title} — Lab 4A (45 Students)`,
  },
];

const INITIAL_INQUIRIES: StudentInquiry[] = [
  {
    id: "inq-1",
    name: CANONICAL_ROSTER[0].name,
    studentId: CANONICAL_ROSTER[0].studentId,
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
    name: CANONICAL_ROSTER[1].name,
    studentId: CANONICAL_ROSTER[1].studentId,
    courseCode: "CSE-3101",
    timeAgo: "45m ago",
    message: "Requesting medical leave attendance excusal for last lecture.",
    attachment: {
      name: "Medical slip",
      type: "medical",
    },
    hasApproveAction: true,
    status: "pending",
  },
  {
    id: "inq-3",
    name: CANONICAL_ROSTER[6].name,
    studentId: CANONICAL_ROSTER[6].studentId,
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
    <div className="w-full space-y-7 pb-20">
      {/* ========================================================================= */}
      {/* 1. FACULTY HERO HEADER CARD                                               */}
      {/* ========================================================================= */}
      <div className="relative rounded-[20px] bg-surface border border-line p-5 sm:p-7 overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-fg tracking-tight leading-tight">
              Welcome, {CANONICAL_FACULTY.name}
            </h1>
            <p className="text-xs sm:text-sm text-fg-muted mt-1 font-normal">
              {CANONICAL_FACULTY.designation}, Department of {CANONICAL_FACULTY.departmentName} • {ACTIVE_TERM}
            </p>
          </div>

          {/* Clean Next Lecture Pill */}
          <div className="shrink-0 flex flex-wrap items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-2 border border-line text-xs">
            <Clock className="w-3.5 h-3.5 text-warning shrink-0" />
            <span className="text-fg-muted">Next class:</span>
            <span className="font-semibold text-fg">CSE-3101 (Room 402)</span>
            <span className="font-mono text-warning font-bold">in 25m</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TODAY'S TEACHING SCHEDULE & INQUIRIES WORKSPACE SPLIT GRID             */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Left Panel (65%): Today's Teaching Schedule */}
        <div className="lg:col-span-8 rounded-[20px] bg-surface border border-line p-5 sm:p-6 flex flex-col justify-between">
          <div>
            {/* Header bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-line">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-bold text-fg tracking-tight">
                    Today&apos;s Teaching Schedule
                  </h2>
                  <span className="px-2 py-0.5 rounded-md bg-surface-2 text-fg-muted text-xs font-mono border border-line whitespace-nowrap">
                    {SCHEDULE_SESSIONS.length} Sessions
                  </span>
                </div>
                <p className="text-xs text-fg-muted mt-0.5">
                  Faculty course allocation for Monday, {ACTIVE_TERM}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAnnouncementOpen(true)}
                  className="min-h-[44px] sm:min-h-[36px] px-3 py-1.5 rounded-xl bg-surface-2 text-xs font-semibold text-fg border border-line hover:border-brand/40 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Megaphone className="w-3.5 h-3.5 text-brand" />
                  <span>Post Notice</span>
                </button>

                <Link
                  href="/teacher/routine"
                  className="min-h-[44px] sm:min-h-[36px] px-3 py-1.5 rounded-xl bg-surface-2 text-xs font-semibold text-fg border border-line hover:border-brand/40 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <CalendarDays className="w-3.5 h-3.5 text-brand" />
                  <span>Full Week</span>
                </Link>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="min-h-[44px] sm:min-h-[36px] px-3 py-1.5 rounded-xl bg-brand text-on-brand text-xs font-semibold hover:bg-brand-hover transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* Desktop Teaching Schedule Table */}
            <div className="hidden md:block overflow-x-auto mt-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-xs font-mono text-fg-muted border-b border-line/60">
                    <th className="py-3 px-2.5 font-semibold">Time Slot</th>
                    <th className="py-3 px-2.5 font-semibold min-w-[160px]">Course</th>
                    <th className="py-3 px-2.5 font-semibold">Section</th>
                    <th className="py-3 px-2.5 font-semibold">Room</th>
                    <th className="py-3 px-2.5 font-semibold text-right">Students</th>
                    <th className="py-3 px-2.5 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/40">
                  {SCHEDULE_SESSIONS.map((session) => (
                    <tr
                      key={session.id}
                      className="group hover:bg-surface-2/60 transition-colors"
                    >
                      {/* Time Slot */}
                      <td className="py-4 px-2.5 font-mono font-semibold text-fg whitespace-nowrap">
                        <span>{session.timeSlot}</span>
                      </td>

                      {/* Course Code & Title */}
                      <td className="py-4 px-2.5 min-w-[160px]">
                        <div className="font-mono font-bold text-brand">
                          {session.courseCode}
                        </div>
                        <div className="text-xs text-fg-muted">
                          {session.courseTitle}
                        </div>
                      </td>

                      {/* Section */}
                      <td className="py-4 px-2.5 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-surface-2 border border-line font-mono text-xs text-fg whitespace-nowrap inline-block">
                          {session.section}
                        </span>
                      </td>

                      {/* Room Number */}
                      <td className="py-4 px-2.5 font-mono text-fg whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-fg-muted shrink-0" />
                          {session.room}
                        </span>
                      </td>

                      {/* Enrolled Count */}
                      <td className="py-4 px-2.5 text-right font-mono text-fg font-semibold tabular-nums whitespace-nowrap">
                        {session.enrolledCount}
                      </td>

                      {/* Action */}
                      <td className="py-4 px-2.5 text-right whitespace-nowrap">
                        {session.isNext ? (
                          <button
                            type="button"
                            onClick={() => setActiveSessionModal(session)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand hover:bg-brand-hover text-on-brand text-xs font-semibold transition-colors cursor-pointer active:scale-[0.98] whitespace-nowrap"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Start QR</span>
                          </button>
                        ) : (
                          <span className="text-xs font-mono text-fg-muted whitespace-nowrap">
                            Upcoming
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Session Cards (< md) */}
            <div className="md:hidden mt-4 space-y-3">
              {SCHEDULE_SESSIONS.map((session) => (
                <div
                  key={session.id}
                  className="p-4 rounded-2xl bg-surface-2 border border-line space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-xs font-semibold text-fg">
                      {session.timeSlot}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-surface border border-line font-mono text-xs text-fg whitespace-nowrap">
                      {session.section}
                    </span>
                  </div>

                  <div>
                    <div className="font-mono text-xs font-bold text-brand">
                      {session.courseCode}
                    </div>
                    <div className="text-sm font-semibold text-fg mt-0.5">
                      {session.courseTitle}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-fg-muted">
                    <span className="inline-flex items-center gap-1.5 text-fg">
                      <MapPin className="w-3.5 h-3.5 text-fg-muted shrink-0" />
                      {session.room}
                    </span>
                    <span>{session.enrolledCount} students</span>
                  </div>

                  {session.isNext ? (
                    <button
                      type="button"
                      onClick={() => setActiveSessionModal(session)}
                      className="w-full min-h-[44px] px-4 py-2 rounded-xl bg-brand hover:bg-brand-hover text-on-brand text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Start QR</span>
                    </button>
                  ) : (
                    <div className="text-xs font-mono text-fg-muted pt-1 border-t border-line">
                      Status: Upcoming
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Table Footer */}
          <div className="mt-4 pt-4 border-t border-line flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-fg-muted">
            <span className="font-mono">Total teaching hours scheduled today: 5.0 hrs</span>
            <Link
              href="/teacher/routine"
              className="text-brand hover:underline font-semibold inline-flex items-center gap-1"
            >
              <span>View Enrolled Student Rosters</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Panel (35%): Student Inquiries Requiring Review */}
        <div className="lg:col-span-4 rounded-[20px] bg-surface border border-line p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="pb-4 border-b border-line">
              <h2 className="text-lg font-bold text-fg tracking-tight">
                Student Inquiries Requiring Review
              </h2>
              <p className="text-xs text-fg-muted mt-0.5">
                {inquiries.length} inquiries pending direct instructor review
              </p>
            </div>

            {/* Inquiries List */}
            <div className="mt-4 space-y-3.5">
              {inquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="p-3.5 rounded-2xl bg-surface-2 border border-line hover:border-brand/40 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-brand-soft border border-brand/20 font-bold text-xs text-brand flex items-center justify-center shrink-0">
                        {inquiry.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-fg group-hover:text-brand transition-colors truncate">
                          {inquiry.name}
                        </h4>
                        <p className="text-xs font-mono text-fg-muted">
                          ID: {inquiry.studentId} •{" "}
                          <span className="text-brand font-semibold whitespace-nowrap">
                            {inquiry.courseCode}
                          </span>
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-fg-muted whitespace-nowrap shrink-0">
                      {inquiry.timeAgo}
                    </span>
                  </div>

                  <p className="text-xs text-fg mt-2.5 leading-relaxed bg-surface p-2.5 rounded-xl border border-line font-normal">
                    &quot;{inquiry.message}&quot;
                  </p>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-line text-xs">
                    {inquiry.attachment ? (
                      inquiry.attachment.type === "medical" ? (
                        <span className="inline-flex items-center gap-1 text-xs font-mono text-success font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Medical slip
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-mono text-fg-muted">
                          <Paperclip className="w-3.5 h-3.5 text-warning shrink-0" />{" "}
                          {inquiry.attachment.name}
                        </span>
                      )
                    ) : (
                      <span className="text-xs text-fg-muted font-mono">
                        Office Hours Slot?
                      </span>
                    )}

                    <div className="flex items-center gap-2">
                      {inquiry.hasApproveAction && (
                        <button
                          type="button"
                          onClick={() => handleApproveMedical(inquiry.id)}
                          disabled={inquiry.status === "approved"}
                          className={`min-h-[36px] px-2.5 py-1 rounded-md text-xs font-mono font-bold transition-colors cursor-pointer ${
                            inquiry.status === "approved"
                              ? "bg-success-light text-success border border-success/30"
                              : "bg-success-light/60 text-success hover:bg-success-light border border-success/20"
                          }`}
                        >
                          {inquiry.status === "approved" ? "Approved" : "Approve"}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setReplyInquiry(inquiry)}
                        className="min-h-[36px] px-1 text-xs font-semibold text-brand hover:underline transition-colors inline-flex items-center gap-1 cursor-pointer"
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
          <div className="mt-4 pt-4 border-t border-line">
            <Link
              href="/messages"
              className="w-full min-h-[44px] py-2.5 px-3 rounded-2xl bg-surface-2 hover:bg-surface border border-line text-xs font-semibold text-fg flex items-center justify-center gap-2 transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-brand" />
              <span>Open Messages</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. 4-COLUMN FACULTY METRIC BENTO GRID                                     */}
      {/* ========================================================================= */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Total Assigned Students */}
          <div className="rounded-[20px] bg-surface border border-line p-5 hover:border-brand/30 transition-colors relative">
            <div className="flex items-center justify-between text-fg-muted mb-3">
              <span className="text-xs font-semibold">
                Total Assigned Students
              </span>
              <div className="w-8 h-8 rounded-lg bg-brand-soft border border-brand/20 text-brand flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-3xl font-extrabold text-fg tracking-tight font-mono tabular-nums">
                {TOTAL_ASSIGNED_STUDENTS}
              </span>
              <span className="text-xs font-mono text-success bg-success-light px-2 py-0.5 rounded-full border border-success/20 font-bold">
                Active
              </span>
            </div>
            <p className="text-xs text-fg-muted mt-2 font-normal">
              Across {SCHEDULE_SESSIONS.length} active sections
            </p>
          </div>

          {/* Card 2: Average Class Attendance */}
          <div className="rounded-[20px] bg-surface border border-line p-5 hover:border-brand/30 transition-colors relative">
            <div className="flex items-center justify-between text-fg-muted mb-3">
              <span className="text-xs font-semibold">
                Average Class Attendance
              </span>
              <div className="w-8 h-8 rounded-lg bg-success-light border border-success/20 text-success flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-3xl font-extrabold text-fg tracking-tight font-mono tabular-nums">
                88.5%
              </span>
              <span className="text-xs font-mono text-success bg-success-light px-2 py-0.5 rounded-full border border-success/20 inline-flex items-center gap-0.5 font-bold">
                <TrendingUp className="w-3 h-3" />
                +3.2% vs Dept Avg
              </span>
            </div>
            <p className="text-xs text-fg-muted mt-2 font-normal">
              Outperforming CSE Dept baseline (85%)
            </p>
          </div>

          {/* Card 3: Pending Grading Tasks */}
          <div className="rounded-[20px] bg-surface border border-line p-5 hover:border-brand/30 transition-colors relative">
            <div className="flex items-center justify-between text-fg-muted mb-3">
              <span className="text-xs font-semibold">
                Pending Grading Tasks
              </span>
              <div className="w-8 h-8 rounded-lg bg-warning-light border border-warning/20 text-warning flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-3xl font-extrabold text-fg tracking-tight font-mono tabular-nums">
                2
              </span>
              <span className="text-xs font-semibold text-fg-muted">
                assignments
              </span>
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-warning-light border border-warning/25 text-xs font-mono text-warning font-bold truncate max-w-full">
              <span className="truncate">CSE-3101 Quiz 2 &amp; CSE-3102 Lab</span>
            </div>
          </div>

          {/* Card 4: Office Hours */}
          <div className="rounded-[20px] bg-surface border border-line p-5 hover:border-brand/30 transition-colors relative">
            <div className="flex items-center justify-between text-fg-muted mb-3">
              <span className="text-xs font-semibold">
                Office Consultation Hours
              </span>
              <div className="w-8 h-8 rounded-lg bg-brand-soft border border-brand/20 text-brand flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline">
              <span className="text-base font-bold text-fg tracking-tight font-mono">
                Today {CANONICAL_FACULTY.officeHours.replace(/^Mon\s+/, "")}
              </span>
            </div>
            <p className="text-xs text-fg-muted mt-2 flex items-center gap-1.5 font-normal">
              <MapPin className="w-3.5 h-3.5 text-brand shrink-0" />
              <span>{CANONICAL_FACULTY.office} • 3 student slots booked</span>
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. MODALS (Class Launch, Announcements & Reply)                           */}
      {/* ========================================================================= */}
      <Modal
        open={Boolean(activeSessionModal)}
        onClose={() => setActiveSessionModal(null)}
        title={activeSessionModal?.courseTitle}
        description={
          activeSessionModal
            ? `${activeSessionModal.courseCode} • ${activeSessionModal.section} • ${activeSessionModal.room}`
            : undefined
        }
        size="md"
      >
        {activeSessionModal && (
          <div className="space-y-5">
            <p className="text-xs text-fg-muted">
              Time: {activeSessionModal.timeSlot} • {activeSessionModal.enrolledCount} Registered Students
            </p>

            <div className="p-4 rounded-2xl bg-surface-2 border border-line space-y-3">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="text-fg-muted">Attendance Session:</span>
                <span className="text-success font-mono font-bold">
                  Ready to stream
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="text-fg-muted">Presentation Mode:</span>
                <span className="text-fg font-mono">Lecture 09 Slides synced</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={`/teacher/attendance?course=${activeSessionModal.courseCode}&section=${encodeURIComponent(activeSessionModal.section)}`}
                className="flex-1 min-h-[44px] py-2.5 px-4 rounded-2xl bg-brand hover:bg-brand-hover text-on-brand text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <QrCode className="w-4 h-4" />
                <span>Launch QR Attendance Now</span>
              </Link>
              <button
                type="button"
                onClick={() => setActiveSessionModal(null)}
                className="min-h-[44px] py-2.5 px-4 rounded-2xl bg-surface-2 text-fg border border-line text-xs font-semibold hover:bg-surface transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={isAnnouncementOpen}
        onClose={() => setIsAnnouncementOpen(false)}
        title="Post Class Announcement"
        description="Send instant broadcast circulars to students enrolled in your teaching sections."
        size="md"
      >
        <form onSubmit={handlePostAnnouncement} className="space-y-4">
          <div>
            <label
              htmlFor="announcement-section"
              className="block text-xs font-semibold text-fg mb-1"
            >
              Target Enrolled Section
            </label>
            <select
              id="announcement-section"
              value={announcementSection}
              onChange={(e) => setAnnouncementSection(e.target.value)}
              className="w-full h-11 px-3 bg-surface-2 border border-line rounded-xl text-xs text-fg focus:outline-none focus:border-brand"
            >
              {ANNOUNCEMENT_SECTION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="announcement-title"
              className="block text-xs font-semibold text-fg mb-1"
            >
              Announcement Title
            </label>
            <input
              id="announcement-title"
              type="text"
              required
              value={announcementTitle}
              onChange={(e) => setAnnouncementTitle(e.target.value)}
              placeholder="e.g. CSE-3102 Lab 4 Submission Grace Period & Rubric Update"
              className="w-full h-11 px-3 bg-surface-2 border border-line rounded-xl text-xs text-fg placeholder:text-fg-muted focus:outline-none focus:border-brand"
            />
          </div>

          <div>
            <label
              htmlFor="announcement-body"
              className="block text-xs font-semibold text-fg mb-1"
            >
              Message Body
            </label>
            <textarea
              id="announcement-body"
              rows={4}
              value={announcementBody}
              onChange={(e) => setAnnouncementBody(e.target.value)}
              placeholder="Details regarding lecture slides, lab deadline extensions, or room reallocations..."
              className="w-full p-3 bg-surface-2 border border-line rounded-xl text-xs text-fg placeholder:text-fg-muted focus:outline-none focus:border-brand"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 min-h-[44px] py-2.5 px-4 rounded-2xl bg-brand hover:bg-brand-hover text-on-brand text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>
                {announcementSuccess ? "Broadcast Dispatched!" : "Publish Announcement"}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setIsAnnouncementOpen(false)}
              className="min-h-[44px] py-2.5 px-4 rounded-2xl bg-surface-2 text-fg border border-line text-xs font-semibold hover:bg-surface transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={Boolean(replyInquiry)}
        onClose={() => setReplyInquiry(null)}
        title={replyInquiry ? `Reply to ${replyInquiry.name}` : undefined}
        description={
          replyInquiry
            ? `ID: ${replyInquiry.studentId} • Course: ${replyInquiry.courseCode}`
            : undefined
        }
        size="sm"
      >
        {replyInquiry && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-surface-2 border border-line text-xs text-fg-muted">
              &quot;{replyInquiry.message}&quot;
            </div>

            <textarea
              rows={3}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your response to the student..."
              className="w-full p-3 bg-surface-2 border border-line rounded-xl text-xs text-fg placeholder:text-fg-muted focus:outline-none focus:border-brand"
            />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSendReply}
                className="flex-1 min-h-[44px] py-2 px-3 rounded-xl bg-brand hover:bg-brand-hover text-on-brand text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{replySentId ? "Sent!" : "Send Response"}</span>
              </button>
              <button
                type="button"
                onClick={() => setReplyInquiry(null)}
                className="min-h-[44px] py-2 px-3 rounded-xl bg-surface-2 text-fg-muted border border-line text-xs font-semibold hover:text-fg transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
