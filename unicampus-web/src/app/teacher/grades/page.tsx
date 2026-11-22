"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { ShieldCheck, X, Lock } from "lucide-react";
import { adminService } from "@/lib/services/adminService";
import {
  INITIAL_ROWS,
  LIMITS,
  COURSE_OPTIONS,
  SEMESTER_OPTIONS,
  StudentMarkEntry,
  ScoreField,
  EditableScoreField,
  calculateGrade,
} from "@/components/teacher/grades/gradesData";
import { GradesOverviewRow } from "@/components/teacher/grades/GradesOverviewRow";
import { GradesMatrixTable } from "@/components/teacher/grades/GradesMatrixTable";
import {
  SubmitGradesModal,
  ImportCsvModal,
} from "@/components/teacher/grades/GradesModals";

export default function TeacherGradesPage() {
  const [rows, setRows] = useState<StudentMarkEntry[]>(INITIAL_ROWS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string>(COURSE_OPTIONS[0]);
  const [selectedSemester, setSelectedSemester] = useState<string>(SEMESTER_OPTIONS[0]);
  const [activeCellId, setActiveCellId] = useState<string>("stud-2-final");
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [gradebookPolicy, setGradebookPolicy] = useState(() =>
    adminService.getGradebookPolicy(selectedCourse)
  );
  const [submitSuccessToast, setSubmitSuccessToast] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const syncPolicy = () => {
      const p = adminService.getGradebookPolicy(selectedCourse);
      setGradebookPolicy(p);
      setIsLocked(p.is_locked);
    };
    syncPolicy();

    window.addEventListener("unicampus:gradebook-policy-updated", syncPolicy);
    window.addEventListener("storage", syncPolicy);
    return () => {
      window.removeEventListener("unicampus:gradebook-policy-updated", syncPolicy);
      window.removeEventListener("storage", syncPolicy);
    };
  }, [selectedCourse]);

  const outOfRangeErrors = useMemo(() => {
    let count = 0;
    rows.forEach((r) => {
      if (r.attendance < 0 || r.attendance > LIMITS.attendance) count++;
      if (r.quiz < 0 || r.quiz > LIMITS.quiz) count++;
      if (r.midterm < 0 || r.midterm > LIMITS.midterm) count++;
      if (r.lab < 0 || r.lab > LIMITS.lab) count++;
      if (r.final < 0 || r.final > LIMITS.final) count++;
    });
    return count;
  }, [rows]);

  const handleScoreChange = useCallback(
    (id: string, field: ScoreField, rawVal: string) => {
      if (isLocked) return;
      const num = parseFloat(rawVal);
      const parsed = isNaN(num) ? 0 : Number(num.toFixed(1));

      setRows((prev) =>
        prev.map((row) => {
          if (row.id !== id) return row;
          const updated = { ...row, [field]: parsed };
          const total = Number(
            (
              updated.attendance +
              updated.quiz +
              updated.midterm +
              updated.lab +
              updated.final
            ).toFixed(1)
          );
          const { gpa, letter } = calculateGrade(total);
          return {
            ...updated,
            total,
            gpa,
            letterGrade: letter,
          };
        })
      );
    },
    [isLocked]
  );

  const handleScoreKeyDown = useCallback(
    (
      e: React.KeyboardEvent<HTMLInputElement>,
      id: string,
      field: EditableScoreField,
      currentVal: number
    ) => {
      if (isLocked) return;
      if (e.key === "ArrowUp") {
        e.preventDefault();
        const nextVal = Math.min(LIMITS[field], Number((currentVal + 0.5).toFixed(1)));
        handleScoreChange(id, field, nextVal.toString());
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const nextVal = Math.max(0, Number((currentVal - 0.5).toFixed(1)));
        handleScoreChange(id, field, nextVal.toString());
      }
    },
    [isLocked, handleScoreChange]
  );

  const handleSearchChange = useCallback((q: string) => {
    setSearchQuery(q);
    setCurrentPage(1);
  }, []);

  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return rows;
    const q = searchQuery.toLowerCase();
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.studentId.toLowerCase().includes(q)
    );
  }, [rows, searchQuery]);

  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const paginatedRows = useMemo(() => {
    return filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }, [filteredRows, currentPage, pageSize]);

  const handleDownloadDraft = useCallback(() => {
    const headers =
      "Student ID,Student Name,Attendance (10),Quiz (10),Midterm (25),Lab (15),Final (40),Total (100),GPA,Letter Grade\n";
    const body = rows
      .map(
        (r) =>
          `"${r.studentId}","${r.name}",${r.attendance},${r.quiz},${r.midterm},${r.lab},${r.final},${r.total},${r.gpa.toFixed(2)},"${r.letterGrade}"`
      )
      .join("\n");
    const blob = new Blob([headers + body], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "CSE-3101_Spring2026_SecA_Marks_Draft.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [rows]);

  const handleLockAndSubmit = useCallback(() => {
    adminService.setGradebookLock(selectedCourse, true, "Dr. Asif Rahman", "dept-cse");
    setIsLocked(true);
    setSubmitModalOpen(false);
    setSubmitSuccessToast(true);
    setTimeout(() => setSubmitSuccessToast(false), 4000);
  }, [selectedCourse]);

  return (
    <div className="w-full space-y-6 pb-20">
      {/* Toast Notification on Lock/Submit */}
      {submitSuccessToast && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-surface border border-success text-success shadow-xl max-w-[calc(100vw-2rem)]">
          <ShieldCheck className="w-5 h-5 text-success shrink-0" aria-hidden="true" />
          <div className="text-xs text-fg">
            <span className="font-semibold text-success">Evaluation Finalized!</span> Gradebook locked and securely transmitted to the Office of the Registrar.
          </div>
          <button
            type="button"
            onClick={() => setSubmitSuccessToast(false)}
            className="text-fg-muted hover:text-fg ml-2 p-1 rounded-md cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            aria-label="Close Toast"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Official Registry Lock Banner */}
      {isLocked && (
        <div className="p-4 rounded-2xl bg-warning-light border border-warning/30 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-warning text-on-brand flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-fg">
                Official Gradebook Locked • {selectedCourse} ({selectedSemester})
              </p>
              <p className="text-fg-muted font-sans mt-0.5">
                Marks submission has been finalized and locked by {gradebookPolicy.locked_by || "Academic Administration"}. Contact the Registrar to request evaluation amendments.
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-surface border border-line font-mono font-semibold text-warning shrink-0">
            Read-Only
          </span>
        </div>
      )}

      {/* 1. TOP OVERVIEW & DISTRIBUTION ROW (65% / 35% SPLIT) */}
      <GradesOverviewRow
        selectedCourse={selectedCourse}
        onSelectCourse={setSelectedCourse}
        selectedSemester={selectedSemester}
        onSelectSemester={setSelectedSemester}
        enrolledCount={rows.length}
      />

      {/* 2. SPREADSHEET-STYLE MARKS ENTRY MATRIX CARD */}
      <GradesMatrixTable
        totalRowsCount={rows.length}
        filteredRowsCount={filteredRows.length}
        paginatedRows={paginatedRows}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        outOfRangeErrors={outOfRangeErrors}
        isLocked={isLocked}
        activeCellId={activeCellId}
        onFocusCell={setActiveCellId}
        onScoreChange={handleScoreChange}
        onScoreKeyDown={handleScoreKeyDown}
        onOpenImport={() => setImportModalOpen(true)}
        onDownloadDraft={handleDownloadDraft}
        onOpenSubmit={() => setSubmitModalOpen(true)}
        currentPage={currentPage}
        pageSize={pageSize}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* 3. MODALS */}
      <SubmitGradesModal
        open={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        onConfirm={handleLockAndSubmit}
        selectedCourse={selectedCourse}
        selectedSemester={selectedSemester}
        enrolledCount={rows.length}
      />

      <ImportCsvModal
        open={importModalOpen}
        onClose={() => setImportModalOpen(false)}
      />
    </div>
  );
}
