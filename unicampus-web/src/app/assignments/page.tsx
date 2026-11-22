"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ClipboardList,
  Upload,
  CheckCircle2,
  Clock,
  FileCheck2,
  ExternalLink,
  Award,
} from "lucide-react";
import { Badge, Button, EmptyState, Modal, PageHeader, Toast } from "@/components/ui";
import {
  assignmentService,
  type AssignmentSubmission,
  type CourseAssignment,
} from "@/lib/services/assignmentService";
import { CANONICAL_STUDENT } from "@/lib/canonicalCampus";
import { useAdminAuth } from "@/context/AdminAuthContext";

export default function StudentAssignmentsPage() {
  const { currentUser } = useAdminAuth();
  const studentId = currentUser?.student_id || CANONICAL_STUDENT.studentId;
  const studentName = currentUser?.full_name || CANONICAL_STUDENT.name;

  const [assignments, setAssignments] = useState<CourseAssignment[]>([]);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "submitted" | "graded">("all");
  const [activeAssignment, setActiveAssignment] = useState<CourseAssignment | null>(null);
  const [fileName, setFileName] = useState("");
  const [submissionLink, setSubmissionLink] = useState("");
  const [notes, setNotes] = useState("");
  const [toast, setToast] = useState<{ open: boolean; message: string }>({
    open: false,
    message: "",
  });

  useEffect(() => {
    const sync = () => {
      queueMicrotask(() => {
        setAssignments(assignmentService.getAssignments());
        setSubmissions(assignmentService.getSubmissions());
      });
    };
    sync();
    window.addEventListener("unicampus:assignments-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("unicampus:assignments-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const mySubmissionsMap = useMemo(() => {
    const map = new Map<string, AssignmentSubmission>();
    submissions
      .filter((s) => s.studentId === studentId)
      .forEach((s) => map.set(s.assignmentId, s));
    return map;
  }, [submissions, studentId]);

  const filteredAssignments = useMemo(() => {
    return assignments.filter((a) => {
      const sub = mySubmissionsMap.get(a.id);
      if (filter === "pending") return !sub;
      if (filter === "submitted") return sub?.status === "Submitted";
      if (filter === "graded") return sub?.status === "Graded";
      return true;
    });
  }, [assignments, filter, mySubmissionsMap]);

  const openSubmitModal = (asg: CourseAssignment) => {
    const existing = mySubmissionsMap.get(asg.id);
    setActiveAssignment(asg);
    setFileName(existing?.fileName || "");
    setSubmissionLink(existing?.submissionLink || "");
    setNotes(existing?.notes || "");
  };

  const handleSubmitWork = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAssignment || !fileName.trim()) return;
    assignmentService.submitWork({
      assignmentId: activeAssignment.id,
      studentId,
      studentName,
      fileName: fileName.trim(),
      submissionLink: submissionLink.trim() || undefined,
      notes: notes.trim() || undefined,
    });
    setSubmissions(assignmentService.getSubmissions());
    setActiveAssignment(null);
    setToast({
      open: true,
      message: `Submitted "${fileName.trim()}" for ${activeAssignment.courseCode}.`,
    });
  };

  return (
    <div className="w-full space-y-6 pb-14">
      <PageHeader
        title="Assignments & Lab Submissions"
        description="Track course assignments, upload lab reports and project deliverables, and view instructor grades & feedback."
      />

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none]">
        {(
          [
            { id: "all", label: `All Tasks (${assignments.length})` },
            { id: "pending", label: "Pending Submission" },
            { id: "submitted", label: "Submitted" },
            { id: "graded", label: "Graded" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-colors shrink-0 cursor-pointer ${
              filter === tab.id
                ? "bg-brand text-on-brand border-brand"
                : "bg-surface text-fg-muted border-line hover:text-fg"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Assignments Grid */}
      {filteredAssignments.length === 0 ? (
        <div className="rounded-2xl bg-surface border border-line p-10">
          <EmptyState
            icon={<ClipboardList className="w-6 h-6" />}
            title="No assignments in this view"
            description="You're all caught up! Switch tabs to view your submitted or graded coursework."
          />
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAssignments.map((asg) => {
            const sub = mySubmissionsMap.get(asg.id);
            const isGraded = sub?.status === "Graded";
            const isSubmitted = Boolean(sub);

            return (
              <div
                key={asg.id}
                className="rounded-2xl bg-surface border border-line p-5 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-brand bg-brand-soft px-2.5 py-0.5 rounded-md">
                        {asg.courseCode}
                      </span>
                      <Badge variant="neutral">{asg.type}</Badge>
                      {isGraded ? (
                        <Badge variant="success">
                          Graded: {sub?.marks} / {asg.maxMarks}
                        </Badge>
                      ) : isSubmitted ? (
                        <Badge variant="brand">Submitted</Badge>
                      ) : (
                        <Badge variant="warning">Due {asg.dueDate}</Badge>
                      )}
                    </div>
                    <h3 className="text-base font-semibold text-fg">{asg.title}</h3>
                    <p className="text-xs text-fg-muted leading-relaxed max-w-3xl">
                      {asg.description}
                    </p>
                  </div>

                  <div className="shrink-0">
                    <Button
                      type="button"
                      variant={isSubmitted ? "secondary" : "primary"}
                      size="sm"
                      onClick={() => openSubmitModal(asg)}
                      leftIcon={
                        isSubmitted ? (
                          <FileCheck2 className="w-3.5 h-3.5 text-brand" />
                        ) : (
                          <Upload className="w-3.5 h-3.5" />
                        )
                      }
                    >
                      {isGraded ? "View Submission" : isSubmitted ? "Update Submission" : "Submit Work"}
                    </Button>
                  </div>
                </div>

                {/* Submission / Feedback Box */}
                {sub && (
                  <div className="p-3.5 rounded-xl bg-surface-2 border border-line space-y-1.5 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-semibold text-fg inline-flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                        <span>Submitted File: {sub.fileName}</span>
                      </span>
                      <span className="text-[11px] text-fg-muted">
                        {new Date(sub.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                    {sub.submissionLink && (
                      <a
                        href={sub.submissionLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-brand hover:underline text-[11px]"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>{sub.submissionLink}</span>
                      </a>
                    )}
                    {isGraded && sub.feedback && (
                      <div className="pt-2 mt-1 border-t border-line flex items-start gap-2">
                        <Award className="w-4 h-4 text-success shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-fg">Instructor Feedback ({sub.marks}/{asg.maxMarks}): </strong>
                          <span className="text-fg-muted">{sub.feedback}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-line text-xs text-fg-muted">
                  <span>Instructor: {asg.instructorName}</span>
                  <span className="inline-flex items-center gap-1.5 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    Due: {asg.dueDate} • Max Marks: {asg.maxMarks}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Submit Work Modal */}
      <Modal
        open={Boolean(activeAssignment)}
        onClose={() => setActiveAssignment(null)}
        title={activeAssignment ? `Submit: ${activeAssignment.courseCode}` : "Submit Work"}
        description={activeAssignment?.title}
        size="md"
      >
        <form onSubmit={handleSubmitWork} className="space-y-4 pt-1">
          <div>
            <label className="text-xs font-semibold text-fg block mb-1.5">
              Upload Deliverable File (PDF / ZIP / DOCX) *
            </label>
            <label className="flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl bg-surface-2 border border-dashed border-line hover:border-brand cursor-pointer transition-colors">
              <span className="text-xs text-fg truncate">
                {fileName || "Choose file from your device..."}
              </span>
              <span className="text-xs font-semibold text-brand shrink-0">Browse</span>
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setFileName(f.name);
                }}
              />
            </label>
          </div>

          <div>
            <label htmlFor="sub-link" className="text-xs font-semibold text-fg block mb-1">
              GitHub / Google Drive Link (Optional)
            </label>
            <input
              id="sub-link"
              type="url"
              value={submissionLink}
              onChange={(e) => setSubmissionLink(e.target.value)}
              placeholder="https://github.com/username/lab-report"
              className="w-full min-h-[42px] px-3 py-2 rounded-xl bg-surface-2 border border-line text-xs text-fg focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
            />
          </div>

          <div>
            <label htmlFor="sub-notes" className="text-xs font-semibold text-fg block mb-1">
              Submission Notes (Optional)
            </label>
            <textarea
              id="sub-notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any execution notes or team member details..."
              className="w-full rounded-xl bg-surface-2 border border-line p-3 text-xs text-fg focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-line">
            <Button type="button" variant="secondary" size="md" onClick={() => setActiveAssignment(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" disabled={!fileName.trim()}>
              Submit Assignment
            </Button>
          </div>
        </form>
      </Modal>

      <Toast
        open={toast.open}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      />
    </div>
  );
}
