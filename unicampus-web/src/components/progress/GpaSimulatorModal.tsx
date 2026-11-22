"use client";

import { memo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw, Sliders, X } from "lucide-react";
import type { GradeScale, SimCourse } from "./progressData";

interface SimCourseRowProps {
  course: SimCourse;
  index: number;
  onUpdateGrade: (index: number, grade: GradeScale) => void;
}

export const SimCourseRow = memo(function SimCourseRow({
  course,
  index,
  onUpdateGrade,
}: SimCourseRowProps) {
  return (
    <div className="p-2.5 rounded-xl bg-surface-2/70 border border-line flex items-center justify-between gap-3 text-xs">
      <div className="min-w-0">
        <div className="font-mono font-semibold text-brand">
          {course.code}
        </div>
        <div className="text-fg font-medium truncate max-w-[260px]">
          {course.name}
        </div>
        <div className="text-xs text-fg-muted font-sans tabular-nums">
          {course.credits} Credits
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <select
          aria-label={`Target grade for ${course.code}`}
          value={course.grade}
          onChange={(e) => onUpdateGrade(index, e.target.value as GradeScale)}
          className="bg-surface border border-line rounded-lg px-2.5 py-1 font-sans tabular-nums text-xs font-semibold text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:border-brand"
        >
          <option value="A+">A+ (4.00)</option>
          <option value="A">A (3.75)</option>
          <option value="A-">A- (3.50)</option>
          <option value="B+">B+ (3.25)</option>
          <option value="B">B (3.00)</option>
          <option value="B-">B- (2.75)</option>
          <option value="C+">C+ (2.50)</option>
          <option value="C">C (2.25)</option>
          <option value="F">F (0.00)</option>
        </select>
      </div>
    </div>
  );
});

interface GpaSimulatorModalProps {
  isOpen: boolean;
  simCourses: SimCourse[];
  simulationResults: {
    termCredits: number;
    projectedSGPA: string;
    simulatedCGPA: string;
    cgpaDelta: string;
    isPositive: boolean;
  };
  onClose: () => void;
  onUpdateGrade: (index: number, grade: GradeScale) => void;
  onReset: () => void;
}

export const GpaSimulatorModal = memo(function GpaSimulatorModal({
  isOpen,
  simCourses,
  simulationResults,
  onClose,
  onUpdateGrade,
  onReset,
}: GpaSimulatorModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Interactive GPA Scenario Simulator"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="w-full max-w-2xl bg-surface border border-line rounded-2xl p-6 shadow-2xl overflow-hidden relative"
          >
            <div className="flex items-center justify-between pb-3.5 border-b border-line">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-brand-soft border border-brand/20 flex items-center justify-center text-brand">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-fg">
                    Interactive GPA Scenario Simulator
                  </h3>
                  <p className="text-xs text-fg-muted">
                    Adjust target grades for 3rd Year · 6th Semester courses to calculate projected SGPA and cumulative CGPA.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close GPA simulator"
                className="p-1 rounded-lg text-fg-muted hover:text-fg hover:bg-surface-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4 p-3.5 rounded-2xl bg-surface-2 border border-line grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-xs font-sans text-fg-muted">
                  Projected SGPA
                </div>
                <div className="text-xl font-sans font-bold text-brand mt-0.5 tabular-nums">
                  {simulationResults.projectedSGPA}
                </div>
                <div className="text-xs text-fg-muted mt-0.5 tabular-nums">
                  {simulationResults.termCredits.toFixed(1)} Credits Term
                </div>
              </div>

              <div className="border-x border-line">
                <div className="text-xs font-sans text-fg-muted">
                  New Cumulative CGPA
                </div>
                <div className="text-xl font-sans font-bold text-fg mt-0.5 tabular-nums">
                  {simulationResults.simulatedCGPA}
                </div>
                <div className="text-xs text-fg-muted mt-0.5 tabular-nums">Base 96 + 15 = 111 Cr</div>
              </div>

              <div>
                <div className="text-xs font-sans text-fg-muted">
                  CGPA Trajectory
                </div>
                <div
                  className={`text-xl font-sans font-bold mt-0.5 tabular-nums ${
                    simulationResults.isPositive ? "text-success" : "text-warning"
                  }`}
                >
                  {simulationResults.cgpaDelta}
                </div>
                <div className="text-xs text-fg-muted mt-0.5 tabular-nums">vs Current 3.78</div>
              </div>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
              {simCourses.map((course, idx) => (
                <SimCourseRow
                  key={course.code}
                  course={course}
                  index={idx}
                  onUpdateGrade={onUpdateGrade}
                />
              ))}
            </div>

            <div className="mt-5 pt-3 border-t border-line flex items-center justify-between">
              <button
                type="button"
                onClick={onReset}
                className="px-3 py-1.5 rounded-lg text-fg-muted hover:text-fg font-sans text-xs font-medium flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Baseline</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-brand hover:bg-brand-hover text-on-brand font-semibold text-xs cursor-pointer active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                Done &amp; Close Simulator
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});
