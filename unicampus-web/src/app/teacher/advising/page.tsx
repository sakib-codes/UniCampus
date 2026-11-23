"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  Search,
  X,
} from "lucide-react";
import { Badge, Button, EmptyState, PageHeader, Toast } from "@/components/ui";
import {
  ADVISING_OFFERINGS,
  detectScheduleClashes,
} from "@/components/advising/advisingData";
import {
  advisingService,
  calculateSubmissionCredits,
  type AdvisingSubmissionRecord,
} from "@/lib/services/advisingService";
import { CANONICAL_FACULTY, formatProgramDuration, formatYearSemester } from "@/lib/canonicalCampus";
import { adminService } from "@/lib/services/adminService";

type QueueFilter = "all" | "submitted" | "approved" | "revision_requested";

export default function TeacherAdvisingPage() {
  const [submissions, setSubmissions] = useState<AdvisingSubmissionRecord[]>([]);
  const [filter, setFilter] = useState<QueueFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [revisionTargetId, setRevisionTargetId] = useState<string | null>(null);
  const [revisionNote, setRevisionNote] = useState("");
  const [toast, setToast] = useState<{ open: boolean; message: string }>({
    open: false,
    message: "",
  });

  useEffect(() => {
    const sync = () => {
      queueMicrotask(() => {
        setSubmissions(advisingService.getSubmissions());
      });
    };
    sync();
    window.addEventListener("unicampus:advising-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("unicampus:advising-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const counts = useMemo(() => {
    const pending = submissions.filter((s) => s.status === "submitted").length;
    const approved = submissions.filter((s) => s.status === "approved").length;
    const revision = submissions.filter((s) => s.status === "revision_requested").length;
    return { pending, approved, revision, total: submissions.length };
  }, [submissions]);

  const filtered = useMemo(() => {
    return submissions.filter((sub) => {
      if (filter !== "all" && sub.status !== filter) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        sub.studentName.toLowerCase().includes(q) ||
        sub.studentId.toLowerCase().includes(q) ||
        sub.items.some((i) => i.courseCode.toLowerCase().includes(q))
      );
    });
  }, [submissions, filter, searchQuery]);

  const handleApprove = (sub: AdvisingSubmissionRecord) => {
    const updated = advisingService.approveSubmission(sub.id, CANONICAL_FACULTY.name);
    setSubmissions(updated);
    setToast({
      open: true,
      message: `Approved course advising for ${sub.studentName} (${sub.studentId}).`,
    });
  };

  const handleRequestRevision = (sub: AdvisingSubmissionRecord) => {
    if (!revisionNote.trim()) return;
    const updated = advisingService.requestRevision(
      sub.id,
      revisionNote.trim(),
      CANONICAL_FACULTY.name
    );
    setSubmissions(updated);
    setRevisionTargetId(null);
    setRevisionNote("");
    setToast({
      open: true,
      message: `Returned advising plan to ${sub.studentName} with revision note.`,
    });
  };

  return (
    <div className="w-full space-y-6 pb-14">
      <PageHeader
        title="Course Advising Approvals"
        description={`Review student ${formatProgramDuration(adminService.getDepartmentSemesterCount(CANONICAL_FACULTY.departmentCode))} course plans assigned to ${CANONICAL_FACULTY.name}, verify credit caps & timetable clashes, and authorize enrollment.`}
      />

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-surface border border-line">
          <span className="text-xs text-fg-muted">Pending Advisor Review</span>
          <div className="text-2xl font-bold text-warning tabular-nums mt-1">
            {counts.pending}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-surface border border-line">
          <span className="text-xs text-fg-muted">Approved &amp; Enrolled</span>
          <div className="text-2xl font-bold text-success tabular-nums mt-1">
            {counts.approved}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-surface border border-line">
          <span className="text-xs text-fg-muted">Returned for Revision</span>
          <div className="text-2xl font-bold text-danger tabular-nums mt-1">
            {counts.revision}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-surface border border-line">
          <span className="text-xs text-fg-muted">Total Advisee Plans</span>
          <div className="text-2xl font-bold text-fg tabular-nums mt-1">
            {counts.total}
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="p-4 rounded-2xl bg-surface border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 text-fg-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, ID, or course code..."
            className="w-full min-h-[44px] pl-10 pr-9 rounded-xl bg-surface-2 border border-line text-xs sm:text-sm text-fg placeholder:text-fg-muted focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-colors duration-150"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-fg-muted hover:text-fg cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-surface-2 border border-line overflow-x-auto max-w-full [scrollbar-width:none]">
          {(
            [
              { id: "all", label: "All Plans" },
              { id: "submitted", label: `Pending (${counts.pending})` },
              { id: "approved", label: `Approved (${counts.approved})` },
              { id: "revision_requested", label: `Revision (${counts.revision})` },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 cursor-pointer ${
                filter === tab.id
                  ? "bg-surface text-fg font-semibold border border-line/80 shadow-2xs"
                  : "text-fg-muted hover:text-fg"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Submissions List */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl bg-surface border border-line p-10">
          <EmptyState
            icon={<BookOpen className="w-6 h-6" />}
            title="No advising plans matched"
            description="Adjust your filter or wait for students to submit their course advising plans."
          />
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((sub) => {
            const totalCredits = calculateSubmissionCredits(sub.items);
            const clashes = detectScheduleClashes(sub.items, ADVISING_OFFERINGS);
            const isOverCap = totalCredits > sub.maxCredits;
            const isEditingRevision = revisionTargetId === sub.id;

            return (
              <div
                key={sub.id}
                className="rounded-2xl bg-surface border border-line p-5 space-y-4"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-line">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-semibold text-fg">
                        {sub.studentName}
                      </h3>
                      <span className="font-mono text-xs font-semibold text-brand bg-brand-soft px-2 py-0.5 rounded border border-brand/25">
                        {sub.studentId}
                      </span>
                      {sub.status === "approved" && (
                        <Badge variant="success">Approved &amp; Enrolled</Badge>
                      )}
                      {sub.status === "submitted" && (
                        <Badge variant="warning">Pending Review</Badge>
                      )}
                      {sub.status === "revision_requested" && (
                        <Badge variant="danger">Revision Requested</Badge>
                      )}
                    </div>
                    <p className="text-xs text-fg-muted">
                      {sub.departmentCode} • {formatYearSemester(sub.semesterName)} • CGPA{" "}
                      <strong className="text-fg font-mono">{sub.cgpa.toFixed(2)}</strong> (Max{" "}
                      {sub.maxCredits.toFixed(1)} Cr)
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs shrink-0">
                    <span
                      className={`px-2.5 py-1 rounded-lg font-mono font-bold border ${
                        isOverCap
                          ? "bg-danger-light text-danger border-danger/30"
                          : "bg-surface-2 text-fg border-line"
                      }`}
                    >
                      {totalCredits.toFixed(1)} / {sub.maxCredits.toFixed(1)} Cr
                    </span>
                    {clashes.length > 0 ? (
                      <Badge variant="danger">
                        <AlertTriangle className="w-3 h-3" />
                        <span>{clashes.length} Clash</span>
                      </Badge>
                    ) : (
                      <Badge variant="success">No Clashes</Badge>
                    )}
                  </div>
                </div>

                {/* Course Chips */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {sub.items.map((item) => {
                    const course = ADVISING_OFFERINGS.find((c) => c.code === item.courseCode);
                    const section = course?.sections.find((s) => s.id === item.sectionId);
                    return (
                      <div
                        key={item.courseCode}
                        className="p-3 rounded-xl bg-surface-2 border border-line text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono font-bold text-brand">
                            {item.courseCode}
                          </span>
                          <span className="font-mono text-fg-muted">
                            {(course?.credits || 3).toFixed(1)} Cr
                          </span>
                        </div>
                        <div className="font-semibold text-fg truncate">
                          {course?.title || item.courseCode}
                        </div>
                        <div className="text-[11px] text-fg-muted truncate">
                          {section ? `${section.sectionName} • ${section.days.join(", ")} ${section.timeSlot}` : "Section A"}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Advisor Note (if present) */}
                {sub.advisorNote && (
                  <div className="p-3 rounded-xl bg-canvas border border-line text-xs text-fg-muted">
                    <strong className="text-fg">Advisor Note:</strong> {sub.advisorNote}
                  </div>
                )}

                {/* Revision Note Composer */}
                {isEditingRevision && (
                  <div className="p-3.5 rounded-xl bg-danger-light/60 border border-danger/30 space-y-2.5">
                    <label className="text-xs font-semibold text-danger block">
                      Reason / Instruction for Student Revision *
                    </label>
                    <textarea
                      rows={2}
                      value={revisionNote}
                      onChange={(e) => setRevisionNote(e.target.value)}
                      placeholder="e.g. Please swap CSE-4215 to Section B to balance your afternoon lab load."
                      className="w-full rounded-xl bg-surface border border-line focus:border-danger focus:outline-none p-2.5 text-xs text-fg resize-none"
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setRevisionTargetId(null);
                          setRevisionNote("");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        disabled={!revisionNote.trim()}
                        onClick={() => handleRequestRevision(sub)}
                      >
                        Send Revision Request
                      </Button>
                    </div>
                  </div>
                )}

                {/* Action Footer */}
                {sub.status !== "approved" && !isEditingRevision && (
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-line">
                    <span className="text-[11px] text-fg-muted inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Submitted {new Date(sub.submittedAt).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setRevisionTargetId(sub.id);
                          setRevisionNote("");
                        }}
                        leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                      >
                        Return for Revision
                      </Button>
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        disabled={clashes.length > 0 || isOverCap}
                        onClick={() => handleApprove(sub)}
                        leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                      >
                        Approve &amp; Enroll
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Toast
        open={toast.open}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      />
    </div>
  );
}
