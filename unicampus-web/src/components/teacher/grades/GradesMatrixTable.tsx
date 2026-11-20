"use client";

import React, { memo } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Upload,
  Download,
  Lock,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  StudentMarkEntry,
  LIMITS,
  ScoreField,
  EditableScoreField,
  getGradeBadge,
} from "./gradesData";

const scoreInputClass = (isActive: boolean) =>
  `w-20 h-8 text-right px-2.5 py-1.5 rounded-lg font-sans text-xs tabular-nums transition-colors duration-150 border text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:border-brand [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
    isActive
      ? "bg-surface border-brand ring-2 ring-brand/40 text-fg font-semibold"
      : "bg-surface-2 border-line hover:border-line/80 hover:bg-surface text-fg"
  }`;

interface GradeEntryRowProps {
  student: StudentMarkEntry;
  isLocked: boolean;
  activeCellId: string;
  onFocusCell: (cellId: string) => void;
  onScoreChange: (id: string, field: ScoreField, rawVal: string) => void;
  onScoreKeyDown: (
    e: React.KeyboardEvent<HTMLInputElement>,
    id: string,
    field: EditableScoreField,
    currentVal: number
  ) => void;
}

const GradeEntryRow = memo(function GradeEntryRow({
  student,
  isLocked,
  activeCellId,
  onFocusCell,
  onScoreChange,
  onScoreKeyDown,
}: GradeEntryRowProps) {
  const isNusrat = student.studentId === "211-15-4425";
  const isFarhan = student.studentId === "211-15-4435";
  const isRowHover = isNusrat
    ? "bg-brand-soft/40"
    : isFarhan
      ? "bg-warning-light/40 hover:bg-warning-light/60"
      : "hover:bg-surface-2/60";

  return (
    <tr className={`transition-colors duration-150 ${isRowHover}`}>
      {/* 1. Student ID */}
      <td className="py-2.5 px-3.5 font-mono text-xs font-medium text-brand border-r border-line whitespace-nowrap">
        {student.studentId}
      </td>

      {/* 2. Full Name & Badges */}
      <td className="py-2.5 px-3.5 border-r border-line whitespace-nowrap">
        <div className="flex items-center gap-2">
          <span className="font-medium text-xs sm:text-[13px] text-fg">
            {student.name}
          </span>
          {student.rankBadge && (
            <span className="font-sans text-xs px-1.5 py-0.5 bg-brand-soft text-brand border border-brand/30 rounded-md font-semibold">
              {student.rankBadge}
            </span>
          )}
          {student.crBadge && (
            <span className="font-sans text-xs px-1.5 py-0.5 bg-brand-soft text-brand border border-brand/30 rounded-md font-semibold">
              {student.crBadge}
            </span>
          )}
          {isFarhan && (
            <span
              className="font-sans text-xs px-1.5 py-0.5 bg-warning-light text-warning border border-warning/30 rounded-md font-semibold flex items-center gap-1"
              title="Inline Validation: Midterm below class mean"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-warning" aria-hidden="true" />
              <span>Review Warning</span>
            </span>
          )}
        </div>
      </td>

      {/* 3. Attendance (Static Max 10) */}
      <td className="py-2 px-3 text-right font-sans text-xs text-fg-muted font-normal tabular-nums border-r border-line whitespace-nowrap">
        {student.attendance.toFixed(1)}
      </td>

      {/* 4. Quiz (0-10) Editable Input */}
      <td className="py-2 px-3 text-right border-r border-line whitespace-nowrap">
        <div className="flex justify-end">
          <input
            type="number"
            step="0.5"
            min="0"
            max={LIMITS.quiz}
            disabled={isLocked}
            value={student.quiz.toFixed(1)}
            onFocus={() => onFocusCell(`${student.id}-quiz`)}
            onKeyDown={(e) => onScoreKeyDown(e, student.id, "quiz", student.quiz)}
            onChange={(e) => onScoreChange(student.id, "quiz", e.target.value)}
            className={scoreInputClass(activeCellId === `${student.id}-quiz`)}
            aria-label={`Quiz score for ${student.name}`}
          />
        </div>
      </td>

      {/* 5. Midterm (0-25) Editable Input */}
      <td className="py-2 px-3 text-right border-r border-line whitespace-nowrap">
        <div className="flex justify-end">
          <input
            type="number"
            step="0.5"
            min="0"
            max={LIMITS.midterm}
            disabled={isLocked}
            value={student.midterm.toFixed(1)}
            onFocus={() => onFocusCell(`${student.id}-midterm`)}
            onKeyDown={(e) => onScoreKeyDown(e, student.id, "midterm", student.midterm)}
            onChange={(e) => onScoreChange(student.id, "midterm", e.target.value)}
            className={scoreInputClass(activeCellId === `${student.id}-midterm`)}
            aria-label={`Midterm score for ${student.name}`}
          />
        </div>
      </td>

      {/* 6. Lab (0-15) Editable Input */}
      <td className="py-2 px-3 text-right border-r border-line whitespace-nowrap">
        <div className="flex justify-end">
          <input
            type="number"
            step="0.5"
            min="0"
            max={LIMITS.lab}
            disabled={isLocked}
            value={student.lab.toFixed(1)}
            onFocus={() => onFocusCell(`${student.id}-lab`)}
            onKeyDown={(e) => onScoreKeyDown(e, student.id, "lab", student.lab)}
            onChange={(e) => onScoreChange(student.id, "lab", e.target.value)}
            className={scoreInputClass(activeCellId === `${student.id}-lab`)}
            aria-label={`Lab score for ${student.name}`}
          />
        </div>
      </td>

      {/* 7. Final Exam (0-40) Editable Input */}
      <td className="py-2 px-3 text-right border-r border-line whitespace-nowrap">
        <div className="flex justify-end">
          <input
            type="number"
            step="0.5"
            min="0"
            max={LIMITS.final}
            disabled={isLocked}
            value={student.final.toFixed(1)}
            onFocus={() => onFocusCell(`${student.id}-final`)}
            onKeyDown={(e) => onScoreKeyDown(e, student.id, "final", student.final)}
            onChange={(e) => onScoreChange(student.id, "final", e.target.value)}
            className={scoreInputClass(activeCellId === `${student.id}-final`)}
            aria-label={`Final exam score for ${student.name}`}
          />
        </div>
      </td>

      {/* 8. Total Marks (100) */}
      <td className="py-2 px-3 text-right font-sans font-semibold text-fg tabular-nums border-r border-line whitespace-nowrap">
        {student.total.toFixed(1)}
      </td>

      {/* 9. Calculated GPA */}
      <td className="py-2 px-3 text-right font-sans font-semibold text-fg tabular-nums border-r border-line whitespace-nowrap">
        {student.gpa.toFixed(2)}
      </td>

      {/* 10. Letter Grade Pill */}
      <td className="py-2 px-3 text-center whitespace-nowrap">
        <span
          className={`inline-block font-sans text-xs font-semibold px-2 py-0.5 rounded-md ${getGradeBadge(
            student.letterGrade
          )}`}
        >
          {student.letterGrade}
        </span>
      </td>
    </tr>
  );
});

export interface GradesMatrixTableProps {
  totalRowsCount: number;
  filteredRowsCount: number;
  paginatedRows: StudentMarkEntry[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  outOfRangeErrors: number;
  isLocked: boolean;
  activeCellId: string;
  onFocusCell: (cellId: string) => void;
  onScoreChange: (id: string, field: ScoreField, rawVal: string) => void;
  onScoreKeyDown: (
    e: React.KeyboardEvent<HTMLInputElement>,
    id: string,
    field: EditableScoreField,
    currentVal: number
  ) => void;
  onOpenImport: () => void;
  onDownloadDraft: () => void;
  onOpenSubmit: () => void;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function GradesMatrixTable({
  totalRowsCount,
  filteredRowsCount,
  paginatedRows,
  searchQuery,
  onSearchChange,
  outOfRangeErrors,
  isLocked,
  activeCellId,
  onFocusCell,
  onScoreChange,
  onScoreKeyDown,
  onOpenImport,
  onDownloadDraft,
  onOpenSubmit,
  currentPage,
  pageSize,
  totalPages,
  onPageChange,
}: GradesMatrixTableProps) {
  return (
    <section className="bg-surface rounded-2xl border border-line overflow-hidden">
      {/* MATRIX TOOLBAR */}
      <div className="p-4 bg-surface-2 border-b border-line flex flex-wrap items-center justify-between gap-4">
        {/* Left: Search Input + Validation Status Badge */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted" aria-hidden="true" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Filter student name or ID..."
              aria-label="Filter student name or ID"
              className="w-full h-9 pl-9 pr-8 rounded-xl bg-surface border border-line text-xs text-fg placeholder:text-fg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus:border-brand transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-fg-muted hover:text-fg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
                aria-label="Clear filter"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Row Validation Notice */}
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-sans font-medium transition-colors tabular-nums ${
              outOfRangeErrors === 0
                ? "bg-success-light border border-success/30 text-success"
                : "bg-danger-light border border-danger/30 text-danger"
            }`}
          >
            {outOfRangeErrors === 0 ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-success shrink-0" aria-hidden="true" />
                <span>All {totalRowsCount} rows valid (0 out-of-range errors)</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-danger shrink-0" aria-hidden="true" />
                <span>{outOfRangeErrors} out-of-range error(s) detected</span>
              </>
            )}
          </div>
        </div>

        {/* Right: Import / Export & Primary Lock & Submit CTA */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Import CSV */}
          <button
            type="button"
            onClick={onOpenImport}
            className="flex items-center gap-2 min-h-[38px] px-3.5 py-2 rounded-xl bg-surface hover:bg-surface-2 border border-line text-fg text-xs font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <Upload className="w-3.5 h-3.5 text-fg-muted" aria-hidden="true" />
            <span>Import Marks CSV</span>
          </button>

          {/* Download Draft */}
          <button
            type="button"
            onClick={onDownloadDraft}
            className="flex items-center gap-2 min-h-[38px] px-3.5 py-2 rounded-xl bg-surface hover:bg-surface-2 border border-line text-fg text-xs font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <Download className="w-3.5 h-3.5 text-fg-muted" aria-hidden="true" />
            <span>Download Draft</span>
          </button>

          {/* Lock & Submit to Registrar */}
          <button
            type="button"
            onClick={() => {
              if (!isLocked) onOpenSubmit();
            }}
            disabled={isLocked}
            className={`flex items-center gap-2 min-h-[38px] px-4 py-2 rounded-xl text-xs font-semibold transition-colors duration-150 cursor-pointer active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
              isLocked
                ? "bg-surface-2 text-fg-muted border border-line cursor-not-allowed opacity-60"
                : "bg-brand hover:bg-brand-hover text-on-brand"
            }`}
          >
            <Lock className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{isLocked ? "Submitted to Registrar" : "Lock & Submit to Registrar"}</span>
          </button>
        </div>
      </div>

      {/* INTERACTIVE SPREADSHEET TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-2 border-b border-line text-xs font-semibold text-fg-muted font-sans whitespace-nowrap">
              <th className="py-3 px-3.5 text-left border-r border-line">Student ID</th>
              <th className="py-3 px-3.5 text-left border-r border-line">Full Name</th>
              <th className="py-3 px-3 text-right border-r border-line">
                Attendance <span className="lowercase font-normal text-fg-muted">(10)</span>
              </th>
              <th className="py-3 px-3 text-right border-r border-line">
                Quiz <span className="lowercase font-normal text-fg-muted">(0-10)</span>
              </th>
              <th className="py-3 px-3 text-right border-r border-line">
                Midterm <span className="lowercase font-normal text-fg-muted">(0-25)</span>
              </th>
              <th className="py-3 px-3 text-right border-r border-line">
                Lab <span className="lowercase font-normal text-fg-muted">(0-15)</span>
              </th>
              <th className="py-3 px-3 text-right border-r border-line">
                Final <span className="lowercase font-normal text-fg-muted">(0-40)</span>
              </th>
              <th className="py-3 px-3 text-right border-r border-line">
                Total <span className="lowercase font-normal text-fg-muted">(100)</span>
              </th>
              <th className="py-3 px-3 text-right border-r border-line">Calculated GPA</th>
              <th className="py-3 px-3 text-center">Letter Grade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line text-xs">
            {paginatedRows.map((student) => (
              <GradeEntryRow
                key={student.id}
                student={student}
                isLocked={isLocked}
                activeCellId={activeCellId}
                onFocusCell={onFocusCell}
                onScoreChange={onScoreChange}
                onScoreKeyDown={onScoreKeyDown}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* TABLE FOOTER: PAGINATION & KEYBOARD SHORTCUT TIPS */}
      <div className="p-4 bg-surface-2 border-t border-line flex flex-wrap items-center justify-between gap-4">
        {/* Left: Showing count & keyboard hints */}
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
          <span className="text-xs text-fg-muted font-sans tabular-nums">
            Showing{" "}
            <span className="font-semibold text-fg">
              {filteredRowsCount === 0 ? 0 : (currentPage - 1) * pageSize + 1}–
              {Math.min(currentPage * pageSize, filteredRowsCount)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-fg">{filteredRowsCount}</span>{" "}
            enrolled students
          </span>

          <div className="h-4 w-px bg-line hidden sm:block" aria-hidden="true" />

          {/* Keyboard hints */}
          <div className="hidden sm:flex items-center gap-4 text-fg-muted font-sans text-xs">
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded-md bg-surface border border-line text-fg-muted text-xs font-mono">
                Tab
              </kbd>
              <span>Move to next cell</span>
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded-md bg-surface border border-line text-fg-muted text-xs font-mono">
                Enter
              </kbd>
              <span>Commit score</span>
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded-md bg-surface border border-line text-fg-muted text-xs font-mono">
                ↑ / ↓
              </kbd>
              <span>Step ±0.5</span>
            </span>
          </div>
        </div>

        {/* Right: Pagination Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg bg-surface border border-line text-fg-muted hover:text-fg hover:bg-surface-2 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            aria-label="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 rounded-lg font-sans text-xs font-semibold tabular-nums transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                currentPage === page
                  ? "bg-brand text-on-brand"
                  : "bg-surface border border-line text-fg-muted hover:text-fg hover:bg-surface-2"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
            className="p-1.5 rounded-lg bg-surface border border-line text-fg-muted hover:text-fg hover:bg-surface-2 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            aria-label="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
