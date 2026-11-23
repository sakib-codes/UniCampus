"use client";

import { Select } from "@/components/ui/Select";

import React, { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  CheckCircle2,
  ClipboardList,
  FileText,
  Award,
} from "lucide-react";
import { Badge, Button, EmptyState, Modal, PageHeader, Toast } from "@/components/ui";
import {
  assignmentService,
  type AssignmentSubmission,
  type CourseAssignment,
} from "@/lib/services/assignmentService";
import { CANONICAL_COURSES_LIST, CANONICAL_FACULTY } from "@/lib/canonicalCampus";

export default function TeacherAssignmentsPage() {
  const [assignments, setAssignments] = useState<CourseAssignment[]>([]);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [gradingSubmission, setGradingSubmission] = useState<AssignmentSubmission | null>(null);
  const [gradeMarks, setGradeMarks] = useState("");
  const [gradeFeedback, setGradeFeedback] = useState("");

  // Create form state
  const [courseCode, setCourseCode] = useState("CSE-3101");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"Assignment" | "Lab Report" | "Project Milestone">("Assignment");
  const [dueDate, setDueDate] = useState("2026-12-05");
  const [maxMarks, setMaxMarks] = useState("20");
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

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const course = CANONICAL_COURSES_LIST.find((c) => c.code === courseCode);
    assignmentService.createAssignment({
      courseCode,
      courseTitle: course?.title || courseCode,
      title: title.trim(),
      description: description.trim() || "Complete and upload your solution before the deadline.",
      type,
      dueDate,
      maxMarks: parseInt(maxMarks, 10) || 20,
      instructorName: CANONICAL_FACULTY.name,
    });
    setAssignments(assignmentService.getAssignments());
    setCreateOpen(false);
    setTitle("");
    setDescription("");
    setToast({ open: true, message: `Published "${title.trim()}" to ${courseCode}.` });
  };

  const handleDelete = (id: string, taskTitle: string) => {
    setAssignments(assignmentService.deleteAssignment(id));
    setToast({ open: true, message: `Deleted assignment "${taskTitle}".` });
  };

  const openGradeModal = (sub: AssignmentSubmission) => {
    setGradingSubmission(sub);
    setGradeMarks(sub.marks != null ? String(sub.marks) : "");
    setGradeFeedback(sub.feedback || "");
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubmission || !gradeMarks.trim()) return;
    const updated = assignmentService.gradeSubmission(
      gradingSubmission.id,
      parseFloat(gradeMarks) || 0,
      gradeFeedback
    );
    setSubmissions(updated);
    setToast({
      open: true,
      message: `Published grade (${gradeMarks}) for ${gradingSubmission.studentName}.`,
    });
    setGradingSubmission(null);
  };

  return (
    <div className="w-full space-y-6 pb-14">
      <PageHeader
        title="Assignments & Lab Evaluations"
        description="Publish assignments or lab reports, review student submissions, and release marks & feedback."
        actions={
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => setCreateOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            New Assignment
          </Button>
        }
      />

      {assignments.length === 0 ? (
        <div className="rounded-2xl bg-surface border border-line p-10">
          <EmptyState
            icon={<ClipboardList className="w-6 h-6" />}
            title="No assignments published yet"
            description="Create your first assignment or lab report for students to submit online."
          />
        </div>
      ) : (
        <div className="space-y-5">
          {assignments.map((asg) => {
            const asgSubs = submissions.filter((s) => s.assignmentId === asg.id);

            return (
              <div
                key={asg.id}
                className="rounded-2xl bg-surface border border-line p-5 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-line">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-brand bg-brand-soft px-2.5 py-0.5 rounded-md">
                        {asg.courseCode}
                      </span>
                      <Badge variant="neutral">{asg.type}</Badge>
                      <span className="text-xs text-fg-muted font-mono">
                        Due {asg.dueDate} • Max {asg.maxMarks} marks
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-fg">{asg.title}</h3>
                    <p className="text-xs text-fg-muted">{asg.description}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(asg.id, asg.title)}
                    aria-label={`Delete ${asg.title}`}
                    className="p-2 rounded-xl text-fg-muted hover:text-danger hover:bg-danger-light transition-colors cursor-pointer shrink-0 self-start"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Student Submissions List */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-fg-muted">
                    Student Submissions ({asgSubs.length})
                  </div>
                  {asgSubs.length === 0 ? (
                    <div className="p-4 rounded-xl bg-surface-2 border border-line text-xs text-fg-muted text-center">
                      No student submissions received yet.
                    </div>
                  ) : (
                    <div className="divide-y divide-line border border-line rounded-xl overflow-hidden">
                      {asgSubs.map((sub) => (
                        <div
                          key={sub.id}
                          className="p-3.5 bg-surface-2/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                        >
                          <div className="min-w-0 space-y-0.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <strong className="text-fg">{sub.studentName}</strong>
                              <span className="font-mono text-[11px] text-fg-muted">
                                {sub.studentId}
                              </span>
                              {sub.status === "Graded" ? (
                                <Badge variant="success">
                                  {sub.marks}/{asg.maxMarks}
                                </Badge>
                              ) : (
                                <Badge variant="warning">Needs Grading</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 text-fg-muted">
                              <FileText className="w-3.5 h-3.5 text-brand shrink-0" />
                              <span className="truncate">{sub.fileName}</span>
                            </div>
                          </div>

                          <Button
                            type="button"
                            variant={sub.status === "Graded" ? "secondary" : "primary"}
                            size="sm"
                            onClick={() => openGradeModal(sub)}
                            leftIcon={
                              sub.status === "Graded" ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                              ) : (
                                <Award className="w-3.5 h-3.5" />
                              )
                            }
                          >
                            {sub.status === "Graded" ? "Edit Grade" : "Grade"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Assignment Modal */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Publish New Assignment / Lab Report"
        description="Students enrolled in the selected course will see this immediately on their Assignments page."
        size="md"
      >
        <form onSubmit={handleCreate} className="space-y-4 pt-1">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="asg-course" className="text-xs font-semibold text-fg block mb-1">
                Course
              </label>
              <Select
                id="asg-course"
                ariaLabel="Course"
                value={courseCode}
                onChange={setCourseCode}
                options={CANONICAL_COURSES_LIST.map((c) => ({
                  value: c.code,
                  label: c.code,
                }))}
                size="md"
                variant="surface2"
              />
            </div>
            <div>
              <label htmlFor="asg-type" className="text-xs font-semibold text-fg block mb-1">
                Task Type
              </label>
              <Select
                id="asg-type"
                ariaLabel="Task Type"
                value={type}
                onChange={(val) =>
                  setType(val as "Assignment" | "Lab Report" | "Project Milestone")
                }
                options={[
                  { value: "Assignment", label: "Assignment" },
                  { value: "Lab Report", label: "Lab Report" },
                  { value: "Project Milestone", label: "Project Milestone" },
                ]}
                size="md"
                variant="surface2"
              />
            </div>
          </div>

          <div>
            <label htmlFor="asg-title" className="text-xs font-semibold text-fg block mb-1">
              Title *
            </label>
            <input
              id="asg-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Lab Report 06: Graph Traversal Analysis"
              className="w-full min-h-[42px] px-3 py-2 rounded-xl bg-surface-2 border border-line text-xs text-fg focus:outline-none focus:border-brand"
            />
          </div>

          <div>
            <label htmlFor="asg-desc" className="text-xs font-semibold text-fg block mb-1">
              Instructions
            </label>
            <textarea
              id="asg-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline deliverables, formatting requirements, and evaluation rubric..."
              className="w-full rounded-xl bg-surface-2 border border-line p-3 text-xs text-fg focus:outline-none focus:border-brand resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="asg-due" className="text-xs font-semibold text-fg block mb-1">
                Due Date
              </label>
              <input
                id="asg-due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full min-h-[42px] px-3 py-2 rounded-xl bg-surface-2 border border-line text-xs text-fg"
              />
            </div>
            <div>
              <label htmlFor="asg-marks" className="text-xs font-semibold text-fg block mb-1">
                Max Marks
              </label>
              <input
                id="asg-marks"
                type="number"
                min="1"
                max="100"
                value={maxMarks}
                onChange={(e) => setMaxMarks(e.target.value)}
                className="w-full min-h-[42px] px-3 py-2 rounded-xl bg-surface-2 border border-line text-xs font-mono text-fg"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-line">
            <Button type="button" variant="secondary" size="md" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              Publish Assignment
            </Button>
          </div>
        </form>
      </Modal>

      {/* Grade Submission Modal */}
      <Modal
        open={Boolean(gradingSubmission)}
        onClose={() => setGradingSubmission(null)}
        title={gradingSubmission ? `Evaluate: ${gradingSubmission.studentName}` : "Evaluate Submission"}
        description={gradingSubmission ? `File: ${gradingSubmission.fileName}` : undefined}
        size="sm"
      >
        <form onSubmit={handleSaveGrade} className="space-y-4 pt-1">
          <div>
            <label htmlFor="grade-marks" className="text-xs font-semibold text-fg block mb-1">
              Awarded Marks *
            </label>
            <input
              id="grade-marks"
              type="number"
              step="0.5"
              required
              value={gradeMarks}
              onChange={(e) => setGradeMarks(e.target.value)}
              placeholder="e.g. 18"
              className="w-full min-h-[42px] px-3 py-2 rounded-xl bg-surface-2 border border-line text-sm font-mono text-fg focus:outline-none focus:border-brand"
            />
          </div>
          <div>
            <label htmlFor="grade-fb" className="text-xs font-semibold text-fg block mb-1">
              Instructor Feedback
            </label>
            <textarea
              id="grade-fb"
              rows={3}
              value={gradeFeedback}
              onChange={(e) => setGradeFeedback(e.target.value)}
              placeholder="Write constructive feedback for the student..."
              className="w-full rounded-xl bg-surface-2 border border-line p-3 text-xs text-fg focus:outline-none focus:border-brand resize-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-line">
            <Button type="button" variant="secondary" size="md" onClick={() => setGradingSubmission(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              Save &amp; Publish Grade
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
