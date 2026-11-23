"use client";

import { Select } from "@/components/ui/Select";

import React from "react";
import Link from "next/link";
import { QrCode, Send } from "lucide-react";
import { Modal } from "@/components/ui";
import {
  ANNOUNCEMENT_SECTION_OPTIONS,
  type StudentInquiry,
  type TeachingSession,
} from "./teacherDashboardData";

interface TeacherDashboardModalsProps {
  activeSessionModal: TeachingSession | null;
  onCloseSessionModal: () => void;
  isAnnouncementOpen: boolean;
  onCloseAnnouncement: () => void;
  announcementSection: string;
  onAnnouncementSectionChange: (value: string) => void;
  announcementTitle: string;
  onAnnouncementTitleChange: (value: string) => void;
  announcementBody: string;
  onAnnouncementBodyChange: (value: string) => void;
  announcementSuccess: boolean;
  onPostAnnouncement: (e: React.FormEvent) => void;
  replyInquiry: StudentInquiry | null;
  onCloseReply: () => void;
  replyText: string;
  onReplyTextChange: (value: string) => void;
  replySentId: string | null;
  onSendReply: () => void;
}

export function TeacherDashboardModals({
  activeSessionModal,
  onCloseSessionModal,
  isAnnouncementOpen,
  onCloseAnnouncement,
  announcementSection,
  onAnnouncementSectionChange,
  announcementTitle,
  onAnnouncementTitleChange,
  announcementBody,
  onAnnouncementBodyChange,
  announcementSuccess,
  onPostAnnouncement,
  replyInquiry,
  onCloseReply,
  replyText,
  onReplyTextChange,
  replySentId,
  onSendReply,
}: TeacherDashboardModalsProps) {
  return (
    <>
      <Modal
        open={Boolean(activeSessionModal)}
        onClose={onCloseSessionModal}
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
            <p className="text-xs text-fg-muted tabular-nums">
              Time: {activeSessionModal.timeSlot} • {activeSessionModal.enrolledCount} Registered Students
            </p>

            <div className="p-4 rounded-xl bg-surface-2 border border-line space-y-3">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="text-fg-muted">Attendance Session:</span>
                <span className="text-success font-sans font-semibold">
                  Ready to stream
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="text-fg-muted">Presentation Mode:</span>
                <span className="text-fg font-sans">Lecture 09 Slides synced</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={`/teacher/attendance?course=${activeSessionModal.courseCode}&section=${encodeURIComponent(activeSessionModal.section)}`}
                className="flex-1 min-h-[44px] py-2.5 px-4 rounded-xl bg-brand hover:bg-brand-hover text-on-brand text-xs font-semibold flex items-center justify-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <QrCode className="w-4 h-4" />
                <span>Launch QR Attendance Now</span>
              </Link>
              <button
                type="button"
                onClick={onCloseSessionModal}
                className="min-h-[44px] py-2.5 px-4 rounded-xl bg-surface-2 text-fg border border-line text-xs font-semibold hover:bg-surface transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={isAnnouncementOpen}
        onClose={onCloseAnnouncement}
        title="Post Class Announcement"
        description="Send instant broadcast circulars to students enrolled in your teaching sections."
        size="md"
      >
        <form onSubmit={onPostAnnouncement} className="space-y-4">
          <div>
            <label
              htmlFor="announcement-section"
              className="block text-xs font-semibold text-fg mb-1"
            >
              Target Enrolled Section
            </label>
            <Select
              id="announcement-section"
              ariaLabel="Target Enrolled Section"
              value={announcementSection}
              onChange={onAnnouncementSectionChange}
              options={ANNOUNCEMENT_SECTION_OPTIONS}
              size="md"
              variant="surface2"
            />
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
              onChange={(e) => onAnnouncementTitleChange(e.target.value)}
              placeholder="e.g. CSE-3102 Lab 4 Submission Grace Period & Rubric Update"
              className="w-full h-11 px-3 bg-surface-2 border border-line rounded-xl text-xs text-fg placeholder:text-fg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus:border-brand"
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
              onChange={(e) => onAnnouncementBodyChange(e.target.value)}
              placeholder="Details regarding lecture slides, lab deadline extensions, or room reallocations..."
              className="w-full p-3 bg-surface-2 border border-line rounded-xl text-xs text-fg placeholder:text-fg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus:border-brand"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 min-h-[44px] py-2.5 px-4 rounded-xl bg-brand hover:bg-brand-hover text-on-brand text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <Send className="w-4 h-4" />
              <span>
                {announcementSuccess ? "Broadcast Dispatched!" : "Publish Announcement"}
              </span>
            </button>
            <button
              type="button"
              onClick={onCloseAnnouncement}
              className="min-h-[44px] py-2.5 px-4 rounded-xl bg-surface-2 text-fg border border-line text-xs font-semibold hover:bg-surface transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={Boolean(replyInquiry)}
        onClose={onCloseReply}
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

            <div>
              <label htmlFor="reply-inquiry-message" className="sr-only">
                Response message
              </label>
              <textarea
                id="reply-inquiry-message"
                rows={3}
                value={replyText}
                onChange={(e) => onReplyTextChange(e.target.value)}
                placeholder="Type your response to the student..."
                className="w-full p-3 bg-surface-2 border border-line rounded-xl text-xs text-fg placeholder:text-fg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus:border-brand"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onSendReply}
                className="flex-1 min-h-[44px] py-2 px-3 rounded-xl bg-brand hover:bg-brand-hover text-on-brand text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{replySentId ? "Sent!" : "Send Response"}</span>
              </button>
              <button
                type="button"
                onClick={onCloseReply}
                className="min-h-[44px] py-2 px-3 rounded-xl bg-surface-2 text-fg-muted border border-line text-xs font-semibold hover:text-fg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
