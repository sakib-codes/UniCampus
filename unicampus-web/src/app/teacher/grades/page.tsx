"use client";

import { useState, useMemo } from "react";
import { 
  BookOpen, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Upload, 
  Download, 
  Lock, 
  Search, 
  X, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  FileSpreadsheet, 
  ShieldCheck
} from "lucide-react";

export interface StudentMarkEntry {
  id: string;
  studentId: string;
  name: string;
  rankBadge?: string;
  crBadge?: string;
  attendance: number; // Max 10
  quiz: number;       // Max 10
  midterm: number;    // Max 30
  lab: number;        // Max 20
  final: number;      // Max 40
  total: number;      // Max 100
  gpa: number;
  letterGrade: string;
  isFocused?: boolean;
}

const INITIAL_ROWS: StudentMarkEntry[] = [
  {
    id: "stud-1",
    studentId: "211-15-4424",
    name: "Sakib Ahmed",
    rankBadge: "Rank #6",
    attendance: 9.5,
    quiz: 9.0,
    midterm: 23.5,
    lab: 14.0,
    final: 36.5,
    total: 92.5,
    gpa: 4.0,
    letterGrade: "A+",
  },
  {
    id: "stud-2",
    studentId: "211-15-4425",
    name: "Anika Tabassum",
    crBadge: "CR Assistant",
    attendance: 10.0,
    quiz: 8.5,
    midterm: 22.0,
    lab: 13.5,
    final: 35.0,
    total: 89.0,
    gpa: 3.75,
    letterGrade: "A",
    isFocused: true, // Default active focused cell on Final Exam
  },
  {
    id: "stud-3",
    studentId: "211-15-4426",
    name: "Tanvir Mahmud",
    attendance: 8.5,
    quiz: 8.0,
    midterm: 20.0,
    lab: 12.5,
    final: 31.0,
    total: 80.0,
    gpa: 3.75,
    letterGrade: "A",
  },
  {
    id: "stud-4",
    studentId: "211-15-4430",
    name: "Rifat Chowdhury",
    attendance: 8.0,
    quiz: 7.5,
    midterm: 18.0,
    lab: 12.0,
    final: 28.5,
    total: 74.0,
    gpa: 3.25,
    letterGrade: "B+",
  },
  {
    id: "stud-5",
    studentId: "211-15-4432",
    name: "Mehrin Sultana",
    attendance: 9.0,
    quiz: 7.0,
    midterm: 17.5,
    lab: 11.5,
    final: 26.0,
    total: 71.0,
    gpa: 3.25,
    letterGrade: "B+",
  },
  {
    id: "stud-6",
    studentId: "211-15-4435",
    name: "Farhan Sadik",
    attendance: 7.5,
    quiz: 6.5,
    midterm: 15.0,
    lab: 10.5,
    final: 23.0,
    total: 62.5,
    gpa: 2.5,
    letterGrade: "C",
  },
  {
    id: "stud-7",
    studentId: "211-15-4427",
    name: "Zara Rahman",
    attendance: 9.0,
    quiz: 8.5,
    midterm: 21.0,
    lab: 13.0,
    final: 34.0,
    total: 85.5,
    gpa: 3.75,
    letterGrade: "A",
  },
  {
    id: "stud-8",
    studentId: "211-15-4428",
    name: "Mahmudul Karim",
    attendance: 8.0,
    quiz: 7.0,
    midterm: 19.0,
    lab: 12.0,
    final: 30.0,
    total: 76.0,
    gpa: 3.5,
    letterGrade: "A-",
  },
  {
    id: "stud-9",
    studentId: "211-15-4429",
    name: "Nusrat Fariha",
    attendance: 8.5,
    quiz: 8.0,
    midterm: 18.5,
    lab: 12.5,
    final: 29.0,
    total: 76.5,
    gpa: 3.5,
    letterGrade: "A-",
  },
  {
    id: "stud-10",
    studentId: "211-15-4431",
    name: "Sabrina Mostafa",
    attendance: 7.0,
    quiz: 6.5,
    midterm: 16.0,
    lab: 11.0,
    final: 26.5,
    total: 67.0,
    gpa: 3.0,
    letterGrade: "B",
  },
];

// Helper to compute Letter Grade and GPA based on standard university schema
function calculateGrade(total: number): { gpa: number; letter: string } {
  if (total >= 90) return { gpa: 4.0, letter: "A+" };
  if (total >= 80) return { gpa: 3.75, letter: "A" };
  if (total >= 75) return { gpa: 3.5, letter: "A-" };
  if (total >= 70) return { gpa: 3.25, letter: "B+" };
  if (total >= 65) return { gpa: 3.0, letter: "B" };
  if (total >= 60) return { gpa: 2.5, letter: "C" };
  return { gpa: 0.0, letter: "F" };
}

// Score limits definition (10 + 10 + 25 + 15 + 40 = 100% normalized basis)
const LIMITS = {
  attendance: 10,
  quiz: 10,
  midterm: 25,
  lab: 15,
  final: 40,
} as const;

export default function TeacherGradesPage() {
  const [rows, setRows] = useState<StudentMarkEntry[]>(INITIAL_ROWS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("CSE-3101 • Design & Analysis of Algorithms");
  const [selectedSemester, setSelectedSemester] = useState("Spring 2026 • Sec A");
  const [courseDropdownOpen, setCourseDropdownOpen] = useState(false);
  const [semesterDropdownOpen, setSemesterDropdownOpen] = useState(false);
  const [activeCellId, setActiveCellId] = useState<string>("stud-2-final"); // Nusrat Jahan Final cell default focused
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [submitSuccessToast, setSubmitSuccessToast] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Check out of range errors
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

  // Handle live score editing with automated recalculation
  const handleScoreChange = (
    id: string,
    field: "attendance" | "quiz" | "midterm" | "lab" | "final",
    rawVal: string
  ) => {
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
  };

  // Handle keyboard ArrowUp / ArrowDown stepping by 0.5 within limits
  const handleScoreKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    id: string,
    field: "quiz" | "midterm" | "lab" | "final",
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
  };

  const scoreInputClass = (isActive: boolean) =>
    `w-20 h-8 text-right px-2.5 py-1.5 rounded-lg font-sans text-xs tabular-nums transition-colors duration-150 border text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:border-brand [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
      isActive
        ? "bg-surface border-brand ring-2 ring-brand/40 shadow-xs text-fg font-semibold"
        : "bg-surface-2 border-line hover:border-line/80 hover:bg-surface text-fg"
    }`;

  // Filter rows based on search
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

  // Download draft CSV
  const handleDownloadDraft = () => {
    const headers = "Student ID,Student Name,Attendance (10),Quiz (10),Midterm (25),Lab (15),Final (40),Total (100),GPA,Letter Grade\n";
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
    link.download = `CSE-3101_Spring2026_SecA_Marks_Draft.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle Registrar Submission
  const handleLockAndSubmit = () => {
    setIsLocked(true);
    setSubmitModalOpen(false);
    setSubmitSuccessToast(true);
    setTimeout(() => setSubmitSuccessToast(false), 4000);
  };

  // Helper for grade pill styling
  const getGradeBadge = (grade: string) => {
    switch (grade) {
      case "A+":
        return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30";
      case "A":
      case "A-":
        return "bg-brand/15 text-brand border border-brand/35";
      case "B+":
        return "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30";
      case "B":
        return "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30";
      case "C":
      case "C+":
        return "bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/30";
      default:
        return "bg-surface-2 text-fg-muted border border-line";
    }
  };

  return (
    <div className="w-full space-y-6 pb-20">
      {/* Toast Notification on Lock/Submit */}
      {submitSuccessToast && (
        <div className="fixed top-20 right-8 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-surface border border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-xl">
          <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
          <div className="text-xs text-fg">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">Evaluation Finalized!</span> Gradebook locked and securely transmitted to the Office of the Registrar.
          </div>
          <button 
            onClick={() => setSubmitSuccessToast(false)} 
            className="text-fg-muted hover:text-fg ml-2 p-1 rounded-md"
            aria-label="Close Toast"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. TOP OVERVIEW & DISTRIBUTION ROW (65% / 35% SPLIT)                      */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* ================= LEFT CARD (65% / col-span-8): COURSE & WEIGHTS ================= */}
        <div className="lg:col-span-8 bg-surface rounded-3xl p-5 sm:p-6 border border-line shadow-xl flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Indigo Glow Accent */}
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-brand/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
              <div>
                <span className="font-sans text-xs font-semibold text-brand">
                  Course Assessment Matrix
                </span>
                <h1 className="font-bold text-xl sm:text-2xl text-fg tracking-tight mt-0.5">
                  Gradebook &amp; Marks Entry Matrix
                </h1>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-500 dark:text-emerald-400 font-sans text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Section A Active</span>
              </span>
            </div>

            {/* Interactive Dropdown Selectors */}
            <div className="flex flex-wrap items-center gap-3 mb-5 mt-4">
              {/* Course Selector Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setCourseDropdownOpen(!courseDropdownOpen)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-2 border border-line hover:border-brand/60 text-fg text-xs font-semibold cursor-pointer transition-colors shadow-xs"
                >
                  <BookOpen className="w-3.5 h-3.5 text-brand" />
                  <span>{selectedCourse}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-fg-muted ml-1" />
                </button>
                {courseDropdownOpen && (
                  <div className="absolute left-0 mt-1.5 w-72 rounded-2xl bg-surface-2 border border-line shadow-2xl z-30 p-1.5">
                    {[
                      "CSE-3101 • Design & Analysis of Algorithms",
                      "CSE-4109 • Advanced Graph Theory",
                      "CSE-3102 • Algorithms Sessional Lab",
                    ].map((course) => (
                      <button
                        key={course}
                        onClick={() => {
                          setSelectedCourse(course);
                          setCourseDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                          selectedCourse === course
                            ? "bg-brand/15 text-brand font-semibold"
                            : "text-fg-muted hover:bg-surface hover:text-fg"
                        }`}
                      >
                        {course}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Semester Selector Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setSemesterDropdownOpen(!semesterDropdownOpen)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-2 border border-line hover:border-brand/60 text-fg text-xs font-semibold cursor-pointer transition-colors shadow-xs"
                >
                  <Calendar className="w-3.5 h-3.5 text-brand" />
                  <span>{selectedSemester}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-fg-muted ml-1" />
                </button>
                {semesterDropdownOpen && (
                  <div className="absolute left-0 mt-1.5 w-56 rounded-2xl bg-surface-2 border border-line shadow-2xl z-30 p-1.5">
                    {[
                      "Spring 2026 • Sec A",
                      "Spring 2026 • Sec B",
                      "Fall 2025 • Sec A",
                    ].map((sem) => (
                      <button
                        key={sem}
                        onClick={() => {
                          setSelectedSemester(sem);
                          setSemesterDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                          selectedSemester === sem
                            ? "bg-brand/15 text-brand font-semibold"
                            : "text-fg-muted hover:bg-surface hover:text-fg"
                        }`}
                      >
                        {sem}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Assessment Weight Breakdown Pills */}
          <div className="pt-4 border-t border-line">
            <div className="flex items-center justify-between mb-2.5">
              <span className="font-sans text-xs font-semibold text-fg-muted">
                Grading Policy &amp; Weights
              </span>
              <span className="font-sans text-xs font-semibold text-brand">
                100% Normalized Basis
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {/* Attendance */}
              <div className="p-2.5 rounded-2xl bg-surface-2 border border-line flex flex-col justify-between">
                <span className="font-sans text-xs font-medium text-fg-muted">
                  Attendance
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="font-bold text-base text-fg">
                    10%
                  </span>
                  <span className="font-sans text-xs text-fg-muted">
                    Max 10
                  </span>
                </div>
              </div>

              {/* Quiz 1 */}
              <div className="p-2.5 rounded-2xl bg-surface-2 border border-line flex flex-col justify-between">
                <span className="font-sans text-xs font-medium text-fg-muted">
                  Quiz 1
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="font-bold text-base text-fg">
                    10%
                  </span>
                  <span className="font-sans text-xs text-fg-muted">
                    Max 10
                  </span>
                </div>
              </div>

              {/* Midterm */}
              <div className="p-2.5 rounded-2xl bg-surface-2 border border-line flex flex-col justify-between">
                <span className="font-sans text-xs font-medium text-fg-muted">
                  Midterm
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="font-bold text-base text-fg">
                    25%
                  </span>
                  <span className="font-sans text-xs text-fg-muted">
                    Max 25
                  </span>
                </div>
              </div>

              {/* Lab Sessional */}
              <div className="p-2.5 rounded-2xl bg-surface-2 border border-line flex flex-col justify-between">
                <span className="font-sans text-xs font-medium text-fg-muted">
                  Lab
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="font-bold text-base text-fg">
                    15%
                  </span>
                  <span className="font-sans text-xs text-fg-muted">
                    Max 15
                  </span>
                </div>
              </div>

              {/* Final Exam (Highlight Pill) */}
              <div className="col-span-2 sm:col-span-1 p-2.5 rounded-2xl bg-brand/10 border border-brand/40 flex flex-col justify-between shadow-xs">
                <span className="font-sans text-xs font-semibold text-brand">
                  Final Exam
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="font-bold text-base text-brand">
                    40%
                  </span>
                  <span className="font-sans text-xs text-brand/80">
                    Max 40
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT CARD (35% / col-span-4): GRADE DISTRIBUTION ================= */}
        <div className="lg:col-span-4 bg-surface rounded-3xl p-5 sm:p-6 border border-line shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-bold text-base sm:text-lg text-fg tracking-tight">
                Grade Distribution Summary
              </h2>
              <span className="font-sans text-xs font-semibold px-2 py-0.5 rounded-lg bg-surface-2 border border-line text-fg-muted">
                {rows.length} enrolled
              </span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div>
                <span className="text-xs text-fg-muted">Class Avg GPA: </span>
                <span className="font-sans font-bold text-sm text-fg">3.64</span>
              </div>
              <span className="text-line">•</span>
              <div className="text-xs text-emerald-500 font-semibold">
                Passing Rate 97.6%
              </div>
            </div>

            {/* MINI SMOOTH BELL-CURVE AREA CHART */}
            <div className="relative h-28 w-full bg-surface-2 rounded-2xl p-2 border border-line flex items-center justify-center overflow-hidden">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 320 90">
                <defs>
                  <linearGradient id="bellGlow" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-brand, #605BFF)" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="var(--color-brand, #605BFF)" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Baseline */}
                <line stroke="currentColor" className="text-line" strokeDasharray="2 2" strokeWidth="1" x1="10" x2="310" y1="80" y2="80" />
                {/* Area Fill */}
                <path
                  d="M 15 80 C 80 80, 110 75, 140 30 C 160 5, 185 5, 205 32 C 235 70, 275 80, 305 80 Z"
                  fill="url(#bellGlow)"
                />
                {/* Smooth Curve Line */}
                <path
                  d="M 15 80 C 80 80, 110 75, 140 30 C 160 5, 185 5, 205 32 C 235 70, 275 80, 305 80"
                  fill="none"
                  stroke="var(--color-brand, #605BFF)"
                  strokeWidth="2.5"
                />
                {/* Benchmark Mean Indicator (3.64) */}
                <line stroke="var(--color-brand, #605BFF)" strokeDasharray="3 3" strokeWidth="1.5" x1="172" x2="172" y1="12" y2="80" />
                <circle className="shadow-xs" cx="172" cy="12" fill="var(--color-brand, #7C78FF)" r="3.5" />
              </svg>
              {/* Mean Indicator Pill */}
              <div className="absolute top-2 left-[54%] -translate-x-1/2 px-1.5 py-0.5 rounded bg-brand text-white font-sans text-xs font-semibold shadow-xs">
                μ = 3.64
              </div>
            </div>
          </div>

          {/* Frequency Grade Badges Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 pt-3 border-t border-line">
            <div className="p-2 rounded-xl bg-surface-2 border border-emerald-500/25 flex items-center justify-between">
              <span className="font-sans text-xs font-semibold text-emerald-500 dark:text-emerald-400">A+ (90-100%)</span>
              <span className="font-sans text-xs font-semibold text-fg">12 st</span>
            </div>
            <div className="p-2 rounded-xl bg-surface-2 border border-brand/30 flex items-center justify-between">
              <span className="font-sans text-xs font-semibold text-brand">A (80-89%)</span>
              <span className="font-sans text-xs font-semibold text-fg">14 st</span>
            </div>
            <div className="p-2 rounded-xl bg-surface-2 border border-blue-500/25 flex items-center justify-between">
              <span className="font-sans text-xs font-semibold text-blue-500 dark:text-blue-400">A- (75-79%)</span>
              <span className="font-sans text-xs font-semibold text-fg">5 st</span>
            </div>
            <div className="p-2 rounded-xl bg-surface-2 border border-indigo-500/25 flex items-center justify-between">
              <span className="font-sans text-xs font-semibold text-indigo-500 dark:text-indigo-400">B+ (70-74%)</span>
              <span className="font-sans text-xs font-semibold text-fg">5 st</span>
            </div>
            <div className="p-2 rounded-xl bg-surface-2 border border-amber-500/25 flex items-center justify-between">
              <span className="font-sans text-xs font-semibold text-amber-500 dark:text-amber-400">B (65-69%)</span>
              <span className="font-sans text-xs font-semibold text-fg">4 st</span>
            </div>
            <div className="p-2 rounded-xl bg-surface-2 border border-line flex items-center justify-between">
              <span className="font-sans text-xs font-semibold text-fg-muted">C (60-64%)</span>
              <span className="font-sans text-xs font-semibold text-fg">3 st</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. SPREADSHEET-STYLE MARKS ENTRY MATRIX CARD                              */}
      {/* ========================================================================= */}
      <section className="bg-surface rounded-3xl border border-line shadow-2xl overflow-hidden">
        {/* MATRIX TOOLBAR */}
        <div className="p-4 bg-surface-2 border-b border-line flex flex-wrap items-center justify-between gap-4">
          {/* Left: Search Input + Validation Status Badge */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search Input */}
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter student name or ID..."
                className="w-full h-9 pl-9 pr-8 rounded-xl bg-surface border border-line text-xs text-fg placeholder:text-fg-muted focus:outline-none focus:border-brand transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-fg-muted hover:text-fg"
                  aria-label="Clear filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Row Validation Notice */}
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-sans font-medium transition-colors ${
                outOfRangeErrors === 0
                  ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 dark:text-emerald-400"
                  : "bg-rose-500/10 border border-rose-500/30 text-rose-500 dark:text-rose-400"
              }`}
            >
              {outOfRangeErrors === 0 ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                  <span>All {rows.length} rows valid (0 out-of-range errors)</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0" />
                  <span>{outOfRangeErrors} out-of-range error(s) detected</span>
                </>
              )}
            </div>
          </div>

          {/* Right: Import / Export & Primary Lock & Submit CTA */}
          <div className="flex items-center gap-2.5">
            {/* Import CSV */}
            <button
              onClick={() => setImportModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface hover:bg-surface-2 border border-line text-fg text-xs font-medium cursor-pointer transition-colors shadow-xs"
            >
              <Upload className="w-3.5 h-3.5 text-fg-muted" />
              <span>Import Marks CSV</span>
            </button>

            {/* Download Draft */}
            <button
              onClick={handleDownloadDraft}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface hover:bg-surface-2 border border-line text-fg text-xs font-medium cursor-pointer transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-fg-muted" />
              <span>Download Draft</span>
            </button>

            {/* Lock & Submit to Registrar */}
            <button
              onClick={() => {
                if (!isLocked) setSubmitModalOpen(true);
              }}
              disabled={isLocked}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-colors duration-150 cursor-pointer shadow-xs active:scale-[0.98] ${
                isLocked
                  ? "bg-surface-2 text-fg-muted border border-line cursor-not-allowed opacity-60"
                  : "bg-brand hover:bg-brand-hover"
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
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
              {paginatedRows.map((student) => {
                const isNusrat = student.studentId === "211-15-4425";
                const isFarhan = student.studentId === "211-15-4435";
                const isRowHover = isNusrat 
                  ? "bg-brand/5 dark:bg-brand/10" 
                  : isFarhan 
                    ? "bg-amber-500/5 dark:bg-amber-500/10 hover:bg-amber-500/15" 
                    : "hover:bg-surface-2/60";

                return (
                  <tr key={student.id} className={`transition-colors duration-150 ${isRowHover}`}>
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
                          <span className="font-sans text-xs px-1.5 py-0.5 bg-brand/15 text-brand border border-brand/30 rounded-md font-semibold">
                            {student.rankBadge}
                          </span>
                        )}
                        {student.crBadge && (
                          <span className="font-sans text-xs px-1.5 py-0.5 bg-blue-500/15 text-blue-500 dark:text-blue-400 border border-blue-500/30 rounded-md font-semibold">
                            {student.crBadge}
                          </span>
                        )}
                        {isFarhan && (
                          <span className="font-sans text-xs px-1.5 py-0.5 bg-amber-500/15 text-amber-500 dark:text-amber-400 border border-amber-500/30 rounded-md font-semibold flex items-center gap-1" title="Inline Validation: Midterm below class mean">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            <span>Review Warning</span>
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 3. Attendance (Static/Editable Max 10) */}
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
                          onFocus={() => setActiveCellId(`${student.id}-quiz`)}
                          onKeyDown={(e) => handleScoreKeyDown(e, student.id, "quiz", student.quiz)}
                          onChange={(e) => handleScoreChange(student.id, "quiz", e.target.value)}
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
                          onFocus={() => setActiveCellId(`${student.id}-midterm`)}
                          onKeyDown={(e) => handleScoreKeyDown(e, student.id, "midterm", student.midterm)}
                          onChange={(e) => handleScoreChange(student.id, "midterm", e.target.value)}
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
                          onFocus={() => setActiveCellId(`${student.id}-lab`)}
                          onKeyDown={(e) => handleScoreKeyDown(e, student.id, "lab", student.lab)}
                          onChange={(e) => handleScoreChange(student.id, "lab", e.target.value)}
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
                          onFocus={() => setActiveCellId(`${student.id}-final`)}
                          onKeyDown={(e) => handleScoreKeyDown(e, student.id, "final", student.final)}
                          onChange={(e) => handleScoreChange(student.id, "final", e.target.value)}
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
              })}
            </tbody>
          </table>
        </div>

        {/* TABLE FOOTER: PAGINATION & KEYBOARD SHORTCUT TIPS */}
        <div className="p-4 bg-surface-2 border-t border-line flex flex-wrap items-center justify-between gap-4">
          {/* Left: Showing count & keyboard hints */}
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
            <span className="text-xs text-fg-muted font-sans">
              Showing{" "}
              <span className="font-semibold text-fg">
                {filteredRows.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}–
                {Math.min(currentPage * pageSize, filteredRows.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-fg">{filteredRows.length}</span>{" "}
              enrolled students
            </span>

            {/* Subtle vertical divider */}
            <div className="h-4 w-px bg-line hidden sm:block" aria-hidden="true" />

            {/* Keyboard hints */}
            <div className="hidden sm:flex items-center gap-4 text-fg-muted font-sans text-xs">
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded-md bg-surface border border-line text-fg-muted text-xs font-sans shadow-xs">
                  Tab
                </kbd>
                <span>Move to next cell</span>
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded-md bg-surface border border-line text-fg-muted text-xs font-sans shadow-xs">
                  Enter
                </kbd>
                <span>Commit score</span>
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded-md bg-surface border border-line text-fg-muted text-xs font-sans shadow-xs">
                  ↑ / ↓
                </kbd>
                <span>Step ±0.5</span>
              </span>
            </div>
          </div>

          {/* Right: Pagination Controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-surface border border-line text-fg-muted hover:text-fg hover:bg-surface-2 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg font-sans text-xs font-semibold transition-colors ${
                  currentPage === page
                    ? "bg-brand text-white shadow-xs"
                    : "bg-surface border border-line text-fg-muted hover:text-fg hover:bg-surface-2"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-lg bg-surface border border-line text-fg-muted hover:text-fg hover:bg-surface-2 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. MODAL: LOCK & SUBMIT CONFIRMATION TO REGISTRAR                          */}
      {/* ========================================================================= */}
      {submitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="max-w-lg w-full bg-surface border border-line rounded-[20px] p-6 shadow-2xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-brand/15 text-brand flex items-center justify-center border border-brand/30">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-fg">
                  Submit Marks to Registrar?
                </h3>
                <p className="text-xs text-fg-muted">
                  Official Departmental Grade Submission • Office of Examination
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-surface-2 border border-line space-y-2 text-xs">
              <div className="flex justify-between text-fg-muted">
                <span>Course &amp; Section:</span>
                <span className="font-bold text-fg">{selectedCourse.split(" • ")[0]} • {selectedSemester.split(" • ")[1] || selectedSemester}</span>
              </div>
              <div className="flex justify-between text-fg-muted">
                <span>Enrolled Records:</span>
                <span className="font-sans font-semibold text-fg">{rows.length} students verified</span>
              </div>
              <div className="flex justify-between text-fg-muted">
                <span>Class Average GPA:</span>
                <span className="font-sans font-semibold text-emerald-500 dark:text-emerald-400">3.64 / 4.00</span>
              </div>
              <div className="flex justify-between text-fg-muted">
                <span>Instructor:</span>
                <span className="font-bold text-fg">Dr. Asif Rahman</span>
              </div>
            </div>

            <p className="text-xs text-amber-600 dark:text-amber-400 leading-relaxed bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
              <strong>Notice:</strong> Once submitted, marks are locked and cannot be edited without written approval from the Head of Department and the Controller of Examinations.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSubmitModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-surface-2 hover:bg-surface border border-line text-fg text-xs font-semibold cursor-pointer transition-colors"
              >
                Cancel &amp; Continue Editing
              </button>
              <button
                onClick={handleLockAndSubmit}
                className="px-5 py-2 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-bold shadow-xs cursor-pointer transition-colors active:scale-[0.98]"
              >
                Confirm &amp; Transmit Marks
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODAL: IMPORT MARKS CSV                                                */}
      {/* ========================================================================= */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="max-w-md w-full bg-surface border border-line rounded-[20px] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-5 h-5 text-brand" />
                <h3 className="font-bold text-base text-fg">
                  Import Marks Spreadsheet
                </h3>
              </div>
              <button
                onClick={() => setImportModalOpen(false)}
                className="text-fg-muted hover:text-fg p-1 rounded-md"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-fg-muted">
              Upload a UTF-8 formatted CSV or Excel file containing columns: `StudentID`, `Quiz`, `Midterm`, `Lab`, `Final`.
            </p>

            <div className="border-2 border-dashed border-line hover:border-brand/60 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-surface-2/50">
              <Upload className="w-8 h-8 text-brand mb-2" />
              <div className="text-xs font-semibold text-fg">
                Drag and drop your marks file here
              </div>
              <div className="text-xs text-fg-muted mt-1">
                Supports .CSV, .XLSX (Max 5MB)
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setImportModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-surface-2 border border-line text-fg text-xs font-semibold cursor-pointer hover:bg-surface transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
