"use client";

import { memo } from "react";
import { ArrowRight, CheckCircle2, Search, X } from "lucide-react";
import type { CourseRecord } from "./progressData";

interface CourseBreakdownRowProps {
  course: CourseRecord;
}

export const CourseBreakdownRow = memo(function CourseBreakdownRow({
  course,
}: CourseBreakdownRowProps) {
  return (
    <tr className="hover:bg-surface-2/80 transition-colors group">
      <td className="py-3 px-5 font-mono font-semibold text-brand">
        {course.code}
      </td>

      <td className="py-3 px-5 font-medium text-fg">
        <span>{course.name}</span>
        <span className="block text-xs text-fg-muted font-normal mt-0.5">
          Instructor: {course.instructor} • {course.section}
        </span>
      </td>

      <td className="py-3 px-5 text-right font-sans tabular-nums text-fg font-semibold">
        {course.credits.toFixed(1)}
      </td>

      <td className="py-3 px-5">
        {course.grade === "A+" ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded font-sans tabular-nums text-xs font-semibold bg-success-light text-success border border-success/30">
            A+
          </span>
        ) : course.grade === "A" ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded font-sans tabular-nums text-xs font-semibold bg-brand-soft text-brand border border-brand/30">
            A
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-0.5 rounded font-sans tabular-nums text-xs font-semibold bg-surface-2 text-fg border border-line">
            {course.grade}
          </span>
        )}
      </td>

      <td className="py-3 px-5 text-right font-sans tabular-nums font-semibold text-fg">
        {course.gradePoint.toFixed(2)}
      </td>

      <td className="py-3 px-5 text-center">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-success-light text-success font-sans text-xs font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-success" />
          {course.status}
        </span>
      </td>
    </tr>
  );
});

interface CourseBreakdownTableProps {
  selectedSemesterTab: string;
  searchFilter: string;
  filteredCourses: CourseRecord[];
  tableSummary: { totalCredits: number; sgpa: string };
  onSelectSemesterTab: (tab: string) => void;
  onSearchFilterChange: (value: string) => void;
  onOpenTranscript: () => void;
}

const SEMESTER_TABS = [
  { id: "all", label: "All Courses", pill: "96.0 Cr", tone: "neutral" as const },
  { id: "sem-6", label: "3rd Year · 6th Sem (Active)", pill: "Proj 3.85", tone: "success" as const },
  { id: "sem-5", label: "3rd Year · 5th Sem", pill: "SGPA 3.84", tone: "brand" as const },
  { id: "sem-4", label: "2nd Year · 4th Sem", pill: "SGPA 3.81", tone: "neutral" as const },
  { id: "sem-3", label: "2nd Year · 3rd Sem", pill: "SGPA 3.68", tone: "neutral" as const },
  { id: "sem-2", label: "1st Year · 2nd Sem", pill: "SGPA 3.70", tone: "neutral" as const },
  { id: "sem-1", label: "1st Year · 1st Sem", pill: "SGPA 3.62", tone: "neutral" as const },
];

export const CourseBreakdownTable = memo(function CourseBreakdownTable({
  selectedSemesterTab,
  searchFilter,
  filteredCourses,
  tableSummary,
  onSelectSemesterTab,
  onSearchFilterChange,
  onOpenTranscript,
}: CourseBreakdownTableProps) {
  return (
    <div className="w-full">
      <div className="bg-surface border border-line hover:border-brand/40 rounded-2xl overflow-hidden transition-colors duration-150">
        <div className="relative z-10">
          {/* Controls Bar: Semester Selector Tabs & Course Search */}
          <div className="p-3.5 sm:p-4 border-b border-line flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-surface">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 custom-scrollbar">
              {SEMESTER_TABS.map((tab) => {
                const isSelected = selectedSemesterTab === tab.id;
                const activeBorder =
                  tab.tone === "success" ? "border-success/60" : "border-brand/60";
                const pillClass =
                  tab.tone === "success"
                    ? "bg-success-light text-success border border-success/20"
                    : tab.tone === "brand"
                    ? "bg-brand-soft text-brand border border-brand/20"
                    : "bg-surface-2 text-fg-muted";

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => onSelectSemesterTab(tab.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                      isSelected
                        ? `bg-surface-2 border ${activeBorder} text-fg`
                        : "text-fg-muted hover:text-fg hover:bg-surface-2 border border-transparent"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`font-sans tabular-nums text-xs px-1.5 py-0.5 rounded ${pillClass}`}>
                      {tab.pill}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center bg-surface-2 border border-line rounded-lg px-2.5 py-1 w-full sm:w-64 focus-within:border-brand transition-colors">
              <Search className="w-3.5 h-3.5 text-fg-muted mr-2 shrink-0" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => onSearchFilterChange(e.target.value)}
                placeholder="Filter courses in this view..."
                aria-label="Filter courses in this view"
                className="bg-transparent border-0 p-0 text-fg placeholder:text-fg-muted font-sans text-xs w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
              />
              {searchFilter && (
                <button
                  type="button"
                  onClick={() => onSearchFilterChange("")}
                  aria-label="Clear course filter"
                  className="text-fg-muted hover:text-fg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-2 border-b border-line font-sans text-xs text-fg-muted">
                  <th scope="col" className="py-3 px-5 font-semibold">Course Code</th>
                  <th scope="col" className="py-3 px-5 font-semibold">Course Name</th>
                  <th scope="col" className="py-3 px-5 font-semibold text-right">Credits</th>
                  <th scope="col" className="py-3 px-5 font-semibold">Grade</th>
                  <th scope="col" className="py-3 px-5 font-semibold text-right">Grade Point</th>
                  <th scope="col" className="py-3 px-5 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-xs">
                {filteredCourses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-fg-muted font-sans">
                      No courses match your filter query.
                    </td>
                  </tr>
                ) : (
                  filteredCourses.map((course) => (
                    <CourseBreakdownRow
                      key={course.code + course.semester}
                      course={course}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-3.5 sm:p-4 bg-surface-2 border-t border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-4 sm:gap-6 font-sans text-xs flex-wrap tabular-nums">
              <div>
                <span className="text-fg-muted">Completed Credits:</span>
                <span className="text-fg font-semibold ml-1.5">
                  {tableSummary.totalCredits.toFixed(1)} Cr
                </span>
              </div>
              <div className="h-3.5 w-px bg-line" />
              <div>
                <span className="text-fg-muted">Term SGPA:</span>
                <span className="text-brand font-semibold ml-1.5">
                  {tableSummary.sgpa}
                </span>
              </div>
              <div className="hidden md:block h-3.5 w-px bg-line" />
              <div className="hidden md:flex items-center gap-1 text-success font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>All Grade Prerequisites Met</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenTranscript}
              className="inline-flex items-center gap-1 text-brand hover:text-brand-hover text-xs font-semibold transition-colors group cursor-pointer self-start sm:self-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
            >
              <span>View Official Grade Sheet</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
