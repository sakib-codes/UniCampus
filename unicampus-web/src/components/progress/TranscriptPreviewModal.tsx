"use client";

import { memo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Printer, School, X } from "lucide-react";
import {
  semesterMilestones,
  type CourseRecord,
  type SemesterMilestone,
} from "./progressData";

interface TranscriptPreviewModalProps {
  isOpen: boolean;
  transcriptSemester: string;
  transcriptCourses: CourseRecord[];
  activeTranscriptMilestone?: SemesterMilestone;
  onClose: () => void;
  onSelectSemester: (semesterId: string) => void;
  onPrint: () => void;
}

export const TranscriptPreviewModal = memo(function TranscriptPreviewModal({
  isOpen,
  transcriptSemester,
  transcriptCourses,
  activeTranscriptMilestone,
  onClose,
  onSelectSemester,
  onPrint,
}: TranscriptPreviewModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="UniCampus Official Academic Grade Sheet"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="w-full max-w-3xl bg-surface border border-line rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
            <div className="flex items-center justify-between pb-4 border-b border-line">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-soft border border-brand/20 flex items-center justify-center text-brand">
                  <School className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-fg">
                    UniCampus Official Academic Grade Sheet
                  </h3>
                  <p className="text-xs text-fg-muted">
                    Office of the Controller of Examinations • Issued for Sakib Ahmed
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onPrint}
                  className="h-8 px-3 rounded-lg bg-brand text-on-brand text-xs font-semibold flex items-center gap-1.5 cursor-pointer hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print PDF</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close transcript preview"
                  className="p-1.5 rounded-lg text-fg-muted hover:text-fg hover:bg-surface-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="my-4 p-4 rounded-2xl bg-surface-2 border border-line grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-sans">
              <div>
                <span className="text-fg-muted block text-xs font-semibold">STUDENT NAME</span>
                <span className="text-fg font-semibold text-sm">Sakib Ahmed</span>
              </div>
              <div>
                <span className="text-fg-muted block text-xs font-semibold">STUDENT ID</span>
                <span className="font-mono text-brand font-semibold text-sm">211-15-4424</span>
              </div>
              <div>
                <span className="text-fg-muted block text-xs font-semibold">PROGRAM</span>
                <span className="text-fg font-semibold text-sm">B.Sc. in CSE</span>
              </div>
              <div>
                <span className="text-fg-muted block text-xs font-semibold">CUMULATIVE CGPA</span>
                <span className="text-success font-semibold text-sm tabular-nums">3.78 / 4.00</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
                <button
                  type="button"
                  onClick={() => onSelectSemester("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                    transcriptSemester === "all"
                      ? "bg-brand text-on-brand"
                      : "bg-surface-2 text-fg-muted hover:text-fg border border-line"
                  }`}
                >
                  All Semesters (Cumulative)
                </button>
                {semesterMilestones.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => onSelectSemester(m.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-sans font-semibold transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                      transcriptSemester === m.id
                        ? "bg-brand text-on-brand"
                        : "bg-surface-2 text-fg-muted hover:text-fg border border-line"
                    }`}
                  >
                    {m.termShort}
                  </button>
                ))}
              </div>

              {activeTranscriptMilestone && (
                <div className="flex items-center gap-2 font-sans text-xs tabular-nums">
                  <span className="px-2 py-0.5 rounded bg-brand-soft text-brand font-semibold border border-brand/20">
                    Term SGPA: {activeTranscriptMilestone.sgpa.toFixed(2)}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-surface-2 text-fg font-medium border border-line">
                    {activeTranscriptMilestone.credits.toFixed(1)} Credits
                  </span>
                </div>
              )}
            </div>

            <div className="overflow-x-auto border border-line rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-surface-2 font-sans text-xs text-fg-muted border-b border-line">
                    <th className="py-2.5 px-3 font-semibold">Code</th>
                    <th className="py-2.5 px-3 font-semibold">Course Title</th>
                    <th className="py-2.5 px-3 text-right font-semibold">Cr</th>
                    <th className="py-2.5 px-3 text-center font-semibold">Grade</th>
                    <th className="py-2.5 px-3 text-right font-semibold">Point</th>
                    <th className="py-2.5 px-3 text-center font-semibold">Semester</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line font-sans tabular-nums">
                  {transcriptCourses.map((c) => (
                    <tr
                      key={c.code + c.semester}
                      className="hover:bg-surface-2/70 transition-colors"
                    >
                      <td className="py-2.5 px-3 font-mono font-semibold text-brand">{c.code}</td>
                      <td className="py-2.5 px-3 font-medium text-fg">{c.name}</td>
                      <td className="py-2.5 px-3 text-right font-semibold text-fg">
                        {c.credits.toFixed(1)}
                      </td>
                      <td className="py-2.5 px-3 text-center font-semibold">
                        {c.grade === "A+" ? (
                          <span className="text-success">{c.grade}</span>
                        ) : c.grade.startsWith("A") ? (
                          <span className="text-brand">{c.grade}</span>
                        ) : (
                          <span className="text-warning">{c.grade}</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right font-semibold text-fg">
                        {c.gradePoint.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 text-center text-xs text-fg-muted">
                        {c.semester.replace("sem-", "Sem ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-5 pt-4 border-t border-line flex items-center justify-between text-xs font-sans">
              <div>
                <span className="text-fg-muted">Status: </span>
                <span className="text-success font-semibold">Official Digital Copy Verified</span>
              </div>
              <div className="text-fg-muted font-medium">
                <span>Dean of Computer Sciences &amp; Engineering</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});
