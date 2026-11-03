"use client";

import { useState, useMemo, useRef } from "react";
import Link from "next/link";
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
  Sparkles, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  FileSpreadsheet, 
  Check, 
  ShieldCheck, 
  Info,
  RotateCcw,
  SlidersHorizontal,
  GraduationCap
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
    rankBadge: "Rank #1",
    attendance: 9.5,
    quiz: 9.0,
    midterm: 28.0,
    lab: 19.0,
    final: 36.5,
    total: 92.5,
    gpa: 4.0,
    letterGrade: "A+",
  },
  {
    id: "stud-2",
    studentId: "211-15-4425",
    name: "Nusrat Jahan",
    crBadge: "CR Assistant",
    attendance: 10.0,
    quiz: 8.5,
    midterm: 26.5,
    lab: 18.5,
    final: 35.0,
    total: 88.5,
    gpa: 4.0,
    letterGrade: "A+",
    isFocused: true, // Default active focused cell on Final Exam
  },
  {
    id: "stud-3",
    studentId: "211-15-4428",
    name: "Tanvir Hasan",
    attendance: 8.5,
    quiz: 8.0,
    midterm: 24.0,
    lab: 17.5,
    final: 31.0,
    total: 80.5,
    gpa: 3.75,
    letterGrade: "A",
  },
  {
    id: "stud-4",
    studentId: "211-15-4430",
    name: "Rafiqul Islam",
    attendance: 8.0,
    quiz: 7.5,
    midterm: 22.0,
    lab: 16.0,
    final: 28.5,
    total: 74.0,
    gpa: 3.5,
    letterGrade: "A-",
  },
  {
    id: "stud-5",
    studentId: "211-15-4432",
    name: "Mehrin Sultana",
    attendance: 9.0,
    quiz: 7.0,
    midterm: 20.5,
    lab: 16.5,
    final: 26.0,
    total: 70.0,
    gpa: 3.25,
    letterGrade: "B+",
  },
  {
    id: "stud-6",
    studentId: "211-15-4435",
    name: "Farhan Sadik",
    attendance: 7.5,
    quiz: 6.5,
    midterm: 18.0,
    lab: 15.0,
    final: 23.0,
    total: 62.5,
    gpa: 3.0,
    letterGrade: "B",
  },
];

// Helper to compute Letter Grade and GPA based on standard university schema
function calculateGrade(total: number): { gpa: number; letter: string } {
  if (total >= 85) return { gpa: 4.0, letter: "A+" };
  if (total >= 80) return { gpa: 3.75, letter: "A" };
  if (total >= 75) return { gpa: 3.5, letter: "A-" };
  if (total >= 70) return { gpa: 3.25, letter: "B+" };
  if (total >= 65) return { gpa: 3.0, letter: "B" };
  if (total >= 60) return { gpa: 2.75, letter: "B-" };
  if (total >= 55) return { gpa: 2.5, letter: "C+" };
  if (total >= 50) return { gpa: 2.25, letter: "C" };
  if (total >= 45) return { gpa: 2.0, letter: "D" };
  return { gpa: 0.0, letter: "F" };
}

export default function TeacherGradesPage() {
  const [rows, setRows] = useState<StudentMarkEntry[]>(INITIAL_ROWS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("CSE-3205 • Software Engineering");
  const [selectedSemester, setSelectedSemester] = useState("Spring 2026 • Sec A");
  const [courseDropdownOpen, setCourseDropdownOpen] = useState(false);
  const [semesterDropdownOpen, setSemesterDropdownOpen] = useState(false);
  const [activeCellId, setActiveCellId] = useState<string>("stud-2-final"); // Nusrat Jahan Final cell default focused
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [submitSuccessToast, setSubmitSuccessToast] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Score limits definition
  const LIMITS = {
    attendance: 10,
    quiz: 10,
    midterm: 30,
    lab: 20,
    final: 40,
  };

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

  // Download draft CSV
  const handleDownloadDraft = () => {
    const headers = "Student ID,Student Name,Attendance (10),Quiz (10),Midterm (30),Lab (20),Final (40),Total (100),GPA,Letter Grade\n";
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
    link.download = `CSE-3205_Spring2026_SecA_Marks_Draft.csv`;
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
        return "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30";
      case "A":
      case "A-":
        return "bg-[#2563EB]/20 text-[#60A5FA] border border-[#2563EB]/35";
      case "B+":
        return "bg-blue-500/15 text-blue-400 border border-blue-500/30";
      case "B":
        return "bg-amber-500/15 text-amber-400 border border-amber-500/30";
      case "C":
      case "C+":
        return "bg-orange-500/15 text-orange-400 border border-orange-500/30";
      default:
        return "bg-slate-500/15 text-slate-400 border border-slate-500/30";
    }
  };

  return (
    <div className="w-full space-y-6 pb-20 select-none">
      {/* Toast Notification on Lock/Submit */}
      {submitSuccessToast && (
        <div className="fixed top-20 right-8 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-white dark:bg-[#0D1117] border border-emerald-500 text-emerald-700 dark:text-emerald-400 shadow-xl dark:shadow-[0_0_24px_rgba(46,160,67,0.35)] animate-in fade-in slide-in-from-top-4 duration-200">
          <ShieldCheck className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0" />
          <div className="text-xs">
            <span className="font-bold">Evaluation Finalized!</span> Gradebook locked and securely transmitted to the Office of the Registrar.
          </div>
          <button 
            onClick={() => setSubmitSuccessToast(false)} 
            className="text-slate-400 hover:text-slate-900 dark:hover:text-white ml-2 p-1 rounded-md"
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
        <div className="lg:col-span-8 bg-white dark:bg-[#0D1117] rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-[#30363D] shadow-xl flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Indigo Glow Accent */}
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#2563EB]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div>
            <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
              <div>
                <span className="font-mono text-[10.5px] uppercase font-bold text-[#2563EB] tracking-wider">
                  Course Assessment Matrix
                </span>
                <h1 className="font-manrope font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-[#F0F6FC] tracking-tight mt-0.5">
                  Gradebook &amp; Marks Entry Matrix
                </h1>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-mono text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Section A Active</span>
              </span>
            </div>

            <p className="text-[13px] text-slate-500 dark:text-[#8D96A0] mb-5 font-normal">
              Course: <span className="text-slate-900 dark:text-[#F0F6FC] font-semibold">{selectedCourse}</span> | Semester: <span className="text-slate-900 dark:text-[#F0F6FC] font-semibold">{selectedSemester} (Room 402)</span>
            </p>

            {/* Interactive Dropdown Selectors */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              {/* Course Selector Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setCourseDropdownOpen(!courseDropdownOpen)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] hover:border-[#2563EB]/60 text-slate-900 dark:text-[#F0F6FC] text-xs font-semibold cursor-pointer transition-all shadow-xs"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>{selectedCourse}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
                </button>
                {courseDropdownOpen && (
                  <div className="absolute left-0 mt-1.5 w-72 rounded-2xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] shadow-2xl z-30 p-1.5">
                    {[
                      "CSE-3205 • Software Engineering",
                      "CSE-3101 • Design & Analysis of Algorithms",
                      "CSE-3206 • Software Engineering Lab",
                    ].map((course) => (
                      <button
                        key={course}
                        onClick={() => {
                          setSelectedCourse(course);
                          setCourseDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                          selectedCourse === course
                            ? "bg-[#2563EB]/15 text-[#2563EB] font-bold"
                            : "text-slate-700 dark:text-[#8D96A0] hover:bg-slate-100 dark:hover:bg-[#21262D] hover:text-slate-900 dark:hover:text-[#F0F6FC]"
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
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] hover:border-[#2563EB]/60 text-slate-900 dark:text-[#F0F6FC] text-xs font-semibold cursor-pointer transition-all shadow-xs"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#60A5FA]" />
                  <span>{selectedSemester}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
                </button>
                {semesterDropdownOpen && (
                  <div className="absolute left-0 mt-1.5 w-56 rounded-2xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] shadow-2xl z-30 p-1.5">
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
                            ? "bg-[#2563EB]/15 text-[#2563EB] font-bold"
                            : "text-slate-700 dark:text-[#8D96A0] hover:bg-slate-100 dark:hover:bg-[#21262D] hover:text-slate-900 dark:hover:text-[#F0F6FC]"
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

          {/* Assessment Weight Breakdown Pills (#161B22 chips with #2563EB badges) */}
          <div className="pt-4 border-t border-slate-200 dark:border-[#30363D]/60">
            <div className="flex items-center justify-between mb-2.5">
              <span className="font-mono text-[10px] uppercase font-bold text-slate-400 dark:text-[#8D96A0] tracking-wider">
                Grading Policy &amp; Weights
              </span>
              <span className="font-mono text-[11px] font-bold text-[#2563EB] dark:text-[#60A5FA]">
                100% Normalized Basis
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {/* Attendance */}
              <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] flex flex-col justify-between">
                <span className="font-mono text-[10.5px] font-semibold text-slate-500 dark:text-[#8D96A0]">
                  Attendance
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="font-manrope font-extrabold text-base text-slate-900 dark:text-[#F0F6FC]">
                    10%
                  </span>
                  <span className="font-mono text-[10px] text-slate-400 dark:text-[#6E7681]">
                    Max 10
                  </span>
                </div>
              </div>

              {/* Quiz 1 */}
              <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] flex flex-col justify-between">
                <span className="font-mono text-[10.5px] font-semibold text-slate-500 dark:text-[#8D96A0]">
                  Quiz 1
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="font-manrope font-extrabold text-base text-slate-900 dark:text-[#F0F6FC]">
                    10%
                  </span>
                  <span className="font-mono text-[10px] text-slate-400 dark:text-[#6E7681]">
                    Max 10
                  </span>
                </div>
              </div>

              {/* Midterm */}
              <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] flex flex-col justify-between">
                <span className="font-mono text-[10.5px] font-semibold text-slate-500 dark:text-[#8D96A0]">
                  Midterm
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="font-manrope font-extrabold text-base text-slate-900 dark:text-[#F0F6FC]">
                    30%
                  </span>
                  <span className="font-mono text-[10px] text-slate-400 dark:text-[#6E7681]">
                    Max 30
                  </span>
                </div>
              </div>

              {/* Lab Sessional */}
              <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] flex flex-col justify-between">
                <span className="font-mono text-[10.5px] font-semibold text-slate-500 dark:text-[#8D96A0]">
                  Lab
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="font-manrope font-extrabold text-base text-slate-900 dark:text-[#F0F6FC]">
                    20%
                  </span>
                  <span className="font-mono text-[10px] text-slate-400 dark:text-[#6E7681]">
                    Max 20
                  </span>
                </div>
              </div>

              {/* Final Exam (Highlight Pill) */}
              <div className="p-2.5 rounded-2xl bg-[#2563EB]/10 dark:bg-[#161B22] border border-[#2563EB]/40 dark:border-[#2563EB]/40 flex flex-col justify-between shadow-[0_0_12px_rgba(37, 99, 235,0.12)]">
                <span className="font-mono text-[10.5px] font-bold text-[#2563EB] dark:text-[#60A5FA]">
                  Final Exam
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="font-manrope font-extrabold text-base text-[#2563EB] dark:text-[#F0F6FC]">
                    40%
                  </span>
                  <span className="font-mono text-[10px] text-[#2563EB]/80 dark:text-[#60A5FA]">
                    Max 40
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT CARD (35% / col-span-4): GRADE DISTRIBUTION ================= */}
        <div className="lg:col-span-4 bg-white dark:bg-[#0D1117] rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-[#30363D] shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-manrope font-extrabold text-base sm:text-lg text-slate-900 dark:text-[#F0F6FC] tracking-tight">
                Grade Distribution Summary
              </h2>
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] text-slate-500 dark:text-[#8D96A0]">
                43 enrolled
              </span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div>
                <span className="text-xs text-slate-400 dark:text-[#8D96A0]">Class Avg GPA: </span>
                <span className="font-mono font-bold text-sm text-slate-900 dark:text-[#F0F6FC]">3.64</span>
              </div>
              <span className="text-slate-300 dark:text-[#30363D]">•</span>
              <div className="text-xs text-emerald-500 font-semibold">
                Passing Rate 97.6%
              </div>
            </div>

            {/* MINI SMOOTH BELL-CURVE AREA CHART */}
            <div className="relative h-28 w-full bg-slate-50 dark:bg-[#161B22] rounded-2xl p-2 border border-slate-200 dark:border-[#30363D] flex items-center justify-center overflow-hidden">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 320 90">
                <defs>
                  <linearGradient id="bellGlow" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#8582ff" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#8582ff" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Baseline */}
                <line stroke="#30363D" strokeDasharray="2 2" strokeWidth="1" x1="10" x2="310" y1="80" y2="80" />
                {/* Area Fill */}
                <path
                  d="M 15 80 C 80 80, 110 75, 140 30 C 160 5, 185 5, 205 32 C 235 70, 275 80, 305 80 Z"
                  fill="url(#bellGlow)"
                />
                {/* Smooth Curve Line */}
                <path
                  d="M 15 80 C 80 80, 110 75, 140 30 C 160 5, 185 5, 205 32 C 235 70, 275 80, 305 80"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="2.5"
                />
                {/* Benchmark Mean Indicator (3.64) */}
                <line stroke="#2563EB" strokeDasharray="3 3" strokeWidth="1.5" x1="172" x2="172" y1="12" y2="80" />
                <circle className="shadow-lg" cx="172" cy="12" fill="#8582ff" r="3.5" />
              </svg>
              {/* Mean Indicator Pill */}
              <div className="absolute top-2 left-[54%] -translate-x-1/2 px-1.5 py-0.5 rounded bg-[#2563EB] text-white font-mono text-[9px] font-bold shadow-md">
                μ = 3.64
              </div>
            </div>
          </div>

          {/* Frequency Grade Badges Breakdown */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-200 dark:border-[#30363D]/60">
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#161B22] border border-emerald-500/25 flex items-center justify-between">
              <span className="font-mono text-[10.5px] font-bold text-emerald-400">A+ (90-100%)</span>
              <span className="font-mono text-xs font-bold text-slate-900 dark:text-[#F0F6FC]">12 st</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#161B22] border border-[#2563EB]/30 flex items-center justify-between">
              <span className="font-mono text-[10.5px] font-bold text-[#2563EB] dark:text-[#60A5FA]">A (80-89%)</span>
              <span className="font-mono text-xs font-bold text-slate-900 dark:text-[#F0F6FC]">18 st</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#161B22] border border-blue-500/25 flex items-center justify-between">
              <span className="font-mono text-[10.5px] font-bold text-blue-400">B (70-79%)</span>
              <span className="font-mono text-xs font-bold text-slate-900 dark:text-[#F0F6FC]">9 st</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#161B22] border border-slate-300 dark:border-[#30363D] flex items-center justify-between">
              <span className="font-mono text-[10.5px] font-bold text-slate-400 dark:text-[#8D96A0]">C (60-69%)</span>
              <span className="font-mono text-xs font-bold text-slate-900 dark:text-[#F0F6FC]">4 st</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. SPREADSHEET-STYLE MARKS ENTRY MATRIX CARD (#0D1117)                    */}
      {/* ========================================================================= */}
      <section className="bg-white dark:bg-[#0D1117] rounded-3xl border border-slate-200 dark:border-[#30363D] shadow-2xl overflow-hidden">
        {/* MATRIX TOOLBAR (16px padding, #161B22 bar) */}
        <div className="p-4 bg-slate-50 dark:bg-[#161B22] border-b border-slate-200 dark:border-[#30363D] flex flex-wrap items-center justify-between gap-4">
          {/* Left: Search Input + Validation Status Badge */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search Input */}
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#8D96A0]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter student name or ID..."
                className="w-full h-9 pl-9 pr-8 rounded-xl bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] text-xs text-slate-900 dark:text-[#F0F6FC] placeholder:text-slate-400 dark:placeholder:text-[#6E7681] focus:outline-none focus:border-[#2563EB] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-[#F0F6FC]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Row Validation Notice */}
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-colors ${
                outOfRangeErrors === 0
                  ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                  : "bg-rose-500/10 border border-rose-500/30 text-rose-400"
              }`}
            >
              {outOfRangeErrors === 0 ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>All 43 rows valid (0 out-of-range errors)</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
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
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-[#1C2128] hover:bg-slate-100 dark:hover:bg-[#252C36] border border-slate-200 dark:border-[#30363D] text-slate-700 dark:text-[#F0F6FC] text-xs font-medium cursor-pointer transition-colors shadow-xs"
            >
              <Upload className="w-3.5 h-3.5 text-slate-400 dark:text-[#8D96A0]" />
              <span>Import Marks CSV</span>
            </button>

            {/* Download Draft */}
            <button
              onClick={handleDownloadDraft}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-[#1C2128] hover:bg-slate-100 dark:hover:bg-[#252C36] border border-slate-200 dark:border-[#30363D] text-slate-700 dark:text-[#F0F6FC] text-xs font-medium cursor-pointer transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-400 dark:text-[#8D96A0]" />
              <span>Download Draft</span>
            </button>

            {/* Lock & Submit to Registrar */}
            <button
              onClick={() => {
                if (!isLocked) setSubmitModalOpen(true);
              }}
              disabled={isLocked}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all duration-150 cursor-pointer shadow-lg active:scale-[0.98] ${
                isLocked
                  ? "bg-slate-700 cursor-not-allowed opacity-60"
                  : "bg-[#2563EB] hover:bg-[#1D4ED8] shadow-[0_0_20px_rgba(37, 99, 235,0.4)]"
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isLocked ? "Submitted to Registrar" : "Lock & Submit to Registrar"}</span>
            </button>
          </div>
        </div>

        {/* INTERACTIVE SPREADSHEET TABLE (10 columns, 1px #30363D cell borders) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-[#161B22] border-b border-slate-200 dark:border-[#30363D] text-[11px] font-bold text-slate-500 dark:text-[#8D96A0] uppercase tracking-wider font-sans whitespace-nowrap">
                <th className="py-3 px-3.5 border-r border-slate-200 dark:border-[#30363D]/60">Student ID</th>
                <th className="py-3 px-3.5 border-r border-slate-200 dark:border-[#30363D]/60">Full Name</th>
                <th className="py-3 px-2 text-right border-r border-slate-200 dark:border-[#30363D]/60">
                  Attendance <span className="lowercase font-normal text-slate-400">(10)</span>
                </th>
                <th className="py-3 px-2 text-right border-r border-slate-200 dark:border-[#30363D]/60">
                  Quiz <span className="lowercase font-normal text-slate-400">(0-10)</span>
                </th>
                <th className="py-3 px-2 text-right border-r border-slate-200 dark:border-[#30363D]/60">
                  Midterm <span className="lowercase font-normal text-slate-400">(0-30)</span>
                </th>
                <th className="py-3 px-2 text-right border-r border-slate-200 dark:border-[#30363D]/60">
                  Lab <span className="lowercase font-normal text-slate-400">(0-20)</span>
                </th>
                <th className="py-3 px-2 text-right border-r border-slate-200 dark:border-[#30363D]/60">
                  Final <span className="lowercase font-normal text-slate-400">(0-40)</span>
                </th>
                <th className="py-3 px-2.5 text-right border-r border-slate-200 dark:border-[#30363D]/60">
                  Total <span className="lowercase font-normal text-slate-400">(100)</span>
                </th>
                <th className="py-3 px-2.5 text-right border-r border-slate-200 dark:border-[#30363D]/60">Calculated GPA</th>
                <th className="py-3 px-3 text-center">Letter Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-[#30363D]/50 text-xs">
              {filteredRows.map((student) => {
                const isNusrat = student.studentId === "211-15-4425";
                const isFarhan = student.studentId === "211-15-4435";
                const isRowHover = isNusrat 
                  ? "bg-[#2563EB]/5 dark:bg-[#161B22]/60" 
                  : isFarhan 
                    ? "bg-amber-500/5 dark:bg-amber-500/[0.03] hover:bg-amber-500/10" 
                    : "hover:bg-slate-50 dark:hover:bg-[#161B22]/40";

                return (
                  <tr key={student.id} className={`transition-colors ${isRowHover}`}>
                    {/* 1. Student ID */}
                    <td className="py-2.5 px-3.5 font-mono font-medium text-[#2563EB] dark:text-[#60A5FA] border-r border-slate-200 dark:border-[#30363D]/60 whitespace-nowrap">
                      {student.studentId}
                    </td>

                    {/* 2. Full Name & Badges */}
                    <td className="py-2.5 px-3.5 border-r border-slate-200 dark:border-[#30363D]/60 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 dark:text-[#F0F6FC]">
                          {student.name}
                        </span>
                        {student.rankBadge && (
                          <span className="font-mono text-[9.5px] px-1.5 py-0.5 bg-[#2563EB]/15 text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]/30 rounded font-bold">
                            {student.rankBadge}
                          </span>
                        )}
                        {student.crBadge && (
                          <span className="font-mono text-[9.5px] px-1.5 py-0.5 bg-blue-500/15 text-blue-400 border border-blue-500/30 rounded font-bold">
                            {student.crBadge}
                          </span>
                        )}
                        {isFarhan && (
                          <span className="font-mono text-[9px] px-1.5 py-0.5 bg-amber-500/15 text-amber-400 border border-amber-500/30 rounded font-bold flex items-center gap-1" title="Inline Validation: Midterm below class mean">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                            <span>Review Warning</span>
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 3. Attendance (Static/Editable Max 10) */}
                    <td className="py-2 px-2 text-right font-mono text-slate-700 dark:text-[#8D96A0] font-medium tabular-nums border-r border-slate-200 dark:border-[#30363D]/60 whitespace-nowrap">
                      {student.attendance.toFixed(1)}
                    </td>

                    {/* 4. Quiz (0-10) Editable Input */}
                    <td className="py-2 px-2 text-right border-r border-slate-200 dark:border-[#30363D]/60 whitespace-nowrap">
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="10"
                        disabled={isLocked}
                        value={student.quiz.toFixed(1)}
                        onFocus={() => setActiveCellId(`${student.id}-quiz`)}
                        onChange={(e) => handleScoreChange(student.id, "quiz", e.target.value)}
                        className={`w-15 h-7.5 text-right px-1.5 rounded-lg font-mono text-xs tabular-nums transition-all focus:outline-none ${
                          activeCellId === `${student.id}-quiz`
                            ? "bg-white dark:bg-[#1C2128] border-2 border-[#2563EB] shadow-[0_0_12px_rgba(37, 99, 235,0.4)] text-slate-900 dark:text-white"
                            : "bg-slate-100 dark:bg-[#161B22] border border-slate-300 dark:border-[#30363D] text-slate-900 dark:text-[#F0F6FC] hover:border-slate-400 dark:hover:border-[#6E7681]"
                        }`}
                      />
                    </td>

                    {/* 5. Midterm (0-30) Editable Input */}
                    <td className="py-2 px-2 text-right border-r border-slate-200 dark:border-[#30363D]/60 whitespace-nowrap">
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="30"
                        disabled={isLocked}
                        value={student.midterm.toFixed(1)}
                        onFocus={() => setActiveCellId(`${student.id}-midterm`)}
                        onChange={(e) => handleScoreChange(student.id, "midterm", e.target.value)}
                        className={`w-15 h-7.5 text-right px-1.5 rounded-lg font-mono text-xs tabular-nums transition-all focus:outline-none ${
                          activeCellId === `${student.id}-midterm`
                            ? "bg-white dark:bg-[#1C2128] border-2 border-[#2563EB] shadow-[0_0_12px_rgba(37, 99, 235,0.4)] text-slate-900 dark:text-white"
                            : "bg-slate-100 dark:bg-[#161B22] border border-slate-300 dark:border-[#30363D] text-slate-900 dark:text-[#F0F6FC] hover:border-slate-400 dark:hover:border-[#6E7681]"
                        }`}
                      />
                    </td>

                    {/* 6. Lab (0-20) Editable Input */}
                    <td className="py-2 px-2 text-right border-r border-slate-200 dark:border-[#30363D]/60 whitespace-nowrap">
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="20"
                        disabled={isLocked}
                        value={student.lab.toFixed(1)}
                        onFocus={() => setActiveCellId(`${student.id}-lab`)}
                        onChange={(e) => handleScoreChange(student.id, "lab", e.target.value)}
                        className={`w-15 h-7.5 text-right px-1.5 rounded-lg font-mono text-xs tabular-nums transition-all focus:outline-none ${
                          activeCellId === `${student.id}-lab`
                            ? "bg-white dark:bg-[#1C2128] border-2 border-[#2563EB] shadow-[0_0_12px_rgba(37, 99, 235,0.4)] text-slate-900 dark:text-white"
                            : "bg-slate-100 dark:bg-[#161B22] border border-slate-300 dark:border-[#30363D] text-slate-900 dark:text-[#F0F6FC] hover:border-slate-400 dark:hover:border-[#6E7681]"
                        }`}
                      />
                    </td>

                    {/* 7. Final Exam (0-40) Editable Input */}
                    <td className="py-2 px-2 text-right border-r border-slate-200 dark:border-[#30363D]/60 whitespace-nowrap">
                      <div className="relative inline-block">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max="40"
                          disabled={isLocked}
                          value={student.final.toFixed(1)}
                          onFocus={() => setActiveCellId(`${student.id}-final`)}
                          onChange={(e) => handleScoreChange(student.id, "final", e.target.value)}
                          className={`w-15 h-7.5 text-right px-1.5 rounded-lg font-mono text-xs tabular-nums transition-all focus:outline-none ${
                            activeCellId === `${student.id}-final`
                              ? "bg-white dark:bg-[#1C2128] border-2 border-[#2563EB] shadow-[0_0_12px_rgba(37, 99, 235,0.5)] text-slate-900 dark:text-white font-bold"
                              : "bg-slate-100 dark:bg-[#161B22] border border-slate-300 dark:border-[#30363D] text-slate-900 dark:text-[#F0F6FC] hover:border-slate-400 dark:hover:border-[#6E7681]"
                          }`}
                        />
                      </div>
                    </td>

                    {/* 8. Total Marks (100) */}
                    <td className="py-2 px-2.5 text-right font-mono font-bold text-slate-900 dark:text-[#F0F6FC] tabular-nums border-r border-slate-200 dark:border-[#30363D]/60 whitespace-nowrap">
                      {student.total.toFixed(1)}
                    </td>

                    {/* 9. Calculated GPA */}
                    <td className="py-2 px-2.5 text-right font-mono font-bold text-slate-900 dark:text-[#F0F6FC] tabular-nums border-r border-slate-200 dark:border-[#30363D]/60 whitespace-nowrap">
                      {student.gpa.toFixed(2)}
                    </td>

                    {/* 10. Letter Grade Pill */}
                    <td className="py-2 px-3 text-center whitespace-nowrap">
                      <span
                        className={`inline-block font-mono text-[11px] font-bold px-2 py-0.5 rounded-md ${getGradeBadge(
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
        <div className="p-4 bg-slate-50 dark:bg-[#161B22] border-t border-slate-200 dark:border-[#30363D] flex flex-wrap items-center justify-between gap-4">
          {/* Left: Showing count & keyboard hints */}
          <div className="flex items-center gap-6">
            <span className="text-xs text-slate-500 dark:text-[#8D96A0]">
              Showing <span className="font-semibold text-slate-900 dark:text-[#F0F6FC]">1-6</span> of{" "}
              <span className="font-semibold text-slate-900 dark:text-[#F0F6FC]">43</span> enrolled students
            </span>

            {/* Keyboard hints */}
            <div className="hidden sm:flex items-center gap-4 text-slate-400 dark:text-[#8D96A0] font-mono text-[11px]">
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-[#0D1117] border border-slate-300 dark:border-[#30363D] text-slate-700 dark:text-[#F0F6FC] text-[10px]">
                  Tab
                </kbd>
                <span>Move to next cell</span>
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-[#0D1117] border border-slate-300 dark:border-[#30363D] text-slate-700 dark:text-[#F0F6FC] text-[10px]">
                  Enter
                </kbd>
                <span>Commit score</span>
              </span>
            </div>
          </div>

          {/* Right: Pagination Controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg font-mono text-xs font-bold transition-colors ${
                  currentPage === page
                    ? "bg-[#2563EB] text-white shadow-md shadow-[#2563EB]/30"
                    : "bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] text-slate-600 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(3, currentPage + 1))}
              disabled={currentPage === 3}
              className="p-1.5 rounded-lg bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-150">
          <div className="max-w-lg w-full bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#2563EB]/15 text-[#2563EB] flex items-center justify-center border border-[#2563EB]/30">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-manrope font-bold text-lg text-slate-900 dark:text-[#F0F6FC]">
                  Submit Marks to Registrar?
                </h3>
                <p className="text-xs text-slate-500 dark:text-[#8D96A0]">
                  Official Departmental Grade Submission • Office of Examination
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-[#8D96A0]">
                <span>Course &amp; Section:</span>
                <span className="font-bold text-slate-900 dark:text-[#F0F6FC]">CSE-3205 • Section A</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-[#8D96A0]">
                <span>Enrolled Records:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-[#F0F6FC]">43 students verified</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-[#8D96A0]">
                <span>Class Average GPA:</span>
                <span className="font-mono font-bold text-emerald-400">3.64 / 4.00</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-[#8D96A0]">
                <span>Instructor:</span>
                <span className="font-bold text-slate-900 dark:text-[#F0F6FC]">Dr. Asif Rahman</span>
              </div>
            </div>

            <p className="text-xs text-amber-500 dark:text-amber-400/90 leading-relaxed bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
              <strong>Notice:</strong> Once submitted, marks are locked and cannot be edited without written approval from the Head of Department and the Controller of Examinations.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSubmitModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#161B22] hover:bg-slate-200 dark:hover:bg-[#21262D] text-slate-700 dark:text-[#F0F6FC] text-xs font-semibold cursor-pointer transition-colors"
              >
                Cancel &amp; Continue Editing
              </button>
              <button
                onClick={handleLockAndSubmit}
                className="px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-lg shadow-[#2563EB]/30 cursor-pointer transition-all active:scale-[0.98]"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-150">
          <div className="max-w-md w-full bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-5 h-5 text-[#2563EB]" />
                <h3 className="font-manrope font-bold text-base text-slate-900 dark:text-[#F0F6FC]">
                  Import Marks Spreadsheet
                </h3>
              </div>
              <button
                onClick={() => setImportModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-[#8D96A0]">
              Upload a UTF-8 formatted CSV or Excel file containing columns: `StudentID`, `Quiz`, `Midterm`, `Lab`, `Final`.
            </p>

            <div className="border-2 border-dashed border-slate-300 dark:border-[#30363D] hover:border-[#2563EB]/60 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50 dark:bg-[#161B22]/50">
              <Upload className="w-8 h-8 text-[#2563EB] mb-2" />
              <div className="text-xs font-semibold text-slate-800 dark:text-[#F0F6FC]">
                Drag and drop your marks file here
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Supports .CSV, .XLSX (Max 5MB)
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setImportModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#161B22] text-slate-700 dark:text-[#F0F6FC] text-xs font-semibold cursor-pointer"
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
