"use client";

import { useState } from "react";
import { Clock } from "lucide-react";
import { ACTIVE_TERM, CANONICAL_FACULTY } from "@/lib/canonicalCampus";
import {
  INITIAL_INQUIRIES,
  SCHEDULE_SESSIONS,
  TOTAL_ASSIGNED_STUDENTS,
  type StudentInquiry,
  type TeachingSession,
} from "@/components/teacher/dashboard/teacherDashboardData";
import { TeachingSchedulePanel } from "@/components/teacher/dashboard/TeachingSchedulePanel";
import { StudentInquiriesPanel } from "@/components/teacher/dashboard/StudentInquiriesPanel";
import { TeacherMetricBento } from "@/components/teacher/dashboard/TeacherMetricBento";
import { TeacherDashboardModals } from "@/components/teacher/dashboard/TeacherDashboardModals";

export default function TeacherCommandCenterPage() {
  const [inquiries, setInquiries] = useState<StudentInquiry[]>(INITIAL_INQUIRIES);
  const [activeSessionModal, setActiveSessionModal] = useState<TeachingSession | null>(null);
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);
  const [announcementSection, setAnnouncementSection] = useState("All Sections");
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementBody, setAnnouncementBody] = useState("");
  const [announcementSuccess, setAnnouncementSuccess] = useState(false);

  const [replyInquiry, setReplyInquiry] = useState<StudentInquiry | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replySentId, setReplySentId] = useState<string | null>(null);

  const handleApproveMedical = (id: string) => {
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, status: "approved" } : inq))
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
      {/* 1. FACULTY HERO HEADER CARD */}
      <div className="relative rounded-2xl bg-surface border border-line p-5 sm:p-7 overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-semibold text-fg tracking-tight leading-tight">
              Welcome, {CANONICAL_FACULTY.name}
            </h1>
            <p className="text-xs sm:text-sm text-fg-muted mt-1 font-normal">
              {CANONICAL_FACULTY.designation}, Department of{" "}
              {CANONICAL_FACULTY.departmentName} • {ACTIVE_TERM}
            </p>
          </div>

          <div className="shrink-0 flex flex-wrap items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-2 border border-line text-xs">
            <Clock className="w-3.5 h-3.5 text-warning shrink-0" />
            <span className="text-fg-muted">Next class:</span>
            <span className="font-semibold text-fg">CSE-3101 (Room 402)</span>
            <span className="font-sans tabular-nums text-warning font-semibold">
              in 25m
            </span>
          </div>
        </div>
      </div>

      {/* 2. TODAY'S TEACHING SCHEDULE & INQUIRIES WORKSPACE SPLIT GRID */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        <TeachingSchedulePanel
          sessions={SCHEDULE_SESSIONS}
          onOpenAnnouncement={() => setIsAnnouncementOpen(true)}
          onStartQr={setActiveSessionModal}
        />

        <StudentInquiriesPanel
          inquiries={inquiries}
          onApproveMedical={handleApproveMedical}
          onReply={setReplyInquiry}
        />
      </section>

      {/* 3. 4-COLUMN FACULTY METRIC BENTO GRID */}
      <TeacherMetricBento
        totalAssignedStudents={TOTAL_ASSIGNED_STUDENTS}
        sessionCount={SCHEDULE_SESSIONS.length}
      />

      {/* 4. MODALS */}
      <TeacherDashboardModals
        activeSessionModal={activeSessionModal}
        onCloseSessionModal={() => setActiveSessionModal(null)}
        isAnnouncementOpen={isAnnouncementOpen}
        onCloseAnnouncement={() => setIsAnnouncementOpen(false)}
        announcementSection={announcementSection}
        onAnnouncementSectionChange={setAnnouncementSection}
        announcementTitle={announcementTitle}
        onAnnouncementTitleChange={setAnnouncementTitle}
        announcementBody={announcementBody}
        onAnnouncementBodyChange={setAnnouncementBody}
        announcementSuccess={announcementSuccess}
        onPostAnnouncement={handlePostAnnouncement}
        replyInquiry={replyInquiry}
        onCloseReply={() => setReplyInquiry(null)}
        replyText={replyText}
        onReplyTextChange={setReplyText}
        replySentId={replySentId}
        onSendReply={handleSendReply}
      />
    </div>
  );
}
