"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  Download, 
  FileText, 
  Filter, 
  Search, 
  Printer, 
  X, 
  Sliders, 
  RotateCcw, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  Info,
  ChevronRight,
  School,
  ExternalLink
} from "lucide-react";
import FadeIn from "@/components/bits/FadeIn";
import SpotlightCard from "@/components/bits/SpotlightCard";
import { themeTokens, SPOTLIGHT } from "@/lib/theme";

// Types
type GradeScale = "A+" | "A" | "A-" | "B+" | "B" | "B-" | "C+" | "C" | "F";

interface CourseRecord {
  code: string;
  name: string;
  instructor: string;
  section: string;
  credits: number;
  grade: GradeScale;
  gradePoint: number;
  status: "Completed" | "In Progress";
  semester: string;
}

interface SemesterMilestone {
  id: string;
  termName: string;
  termShort: string;
  academicYear: string;
  sgpa: number;
  cgpa: number;
  credits: number;
  ranking: string;
  honorBadge?: string;
  isProjected?: boolean;
}

const semesterMilestones: SemesterMilestone[] = [
  {
    id: "sem-1",
    termName: "Semester 1 (Fall 2023)",
    termShort: "Sem 1 (Fall 23)",
    academicYear: "2023-2024",
    sgpa: 3.62,
    cgpa: 3.62,
    credits: 18.0,
    ranking: "Top 8%",
  },
  {
    id: "sem-2",
    termName: "Semester 2 (Spring 2024)",
    termShort: "Sem 2 (Spr 24)",
    academicYear: "2023-2024",
    sgpa: 3.70,
    cgpa: 3.66,
    credits: 18.0,
    ranking: "Top 6%",
  },
  {
    id: "sem-3",
    termName: "Semester 3 (Fall 2024)",
    termShort: "Sem 3 (Fall 24)",
    academicYear: "2024-2025",
    sgpa: 3.68,
    cgpa: 3.67,
    credits: 21.0,
    ranking: "Top 7%",
  },
  {
    id: "sem-4",
    termName: "Semester 4 (Spring 2025)",
    termShort: "Sem 4 (Spr 25)",
    academicYear: "2024-2025",
    sgpa: 3.81,
    cgpa: 3.71,
    credits: 18.0,
    ranking: "Top 4.5%",
    honorBadge: "Dean's Honor",
  },
  {
    id: "sem-5",
    termName: "Semester 5 (Fall 2025)",
    termShort: "Sem 5 (Fall 25)",
    academicYear: "2025-2026",
    sgpa: 3.84,
    cgpa: 3.78,
    credits: 21.0,
    ranking: "Top 4.2%",
    honorBadge: "Dean's Honor",
  },
  {
    id: "sem-6",
    termName: "Semester 6 (Spring 2026)",
    termShort: "Sem 6 (Spring 26*)",
    academicYear: "2025-2026",
    sgpa: 3.85,
    cgpa: 3.79,
    credits: 15.0,
    ranking: "Top 3.5%",
    isProjected: true,
  },
];

const courseDatabase: CourseRecord[] = [
  // Sem 6 (Spring 2026 - Active / In Progress)
  {
    code: "CSE-3205",
    name: "Software Engineering & System Architecture",
    instructor: "Dr. Farhana Khan",
    section: "Sec 02",
    credits: 3.0,
    grade: "A+",
    gradePoint: 4.00,
    status: "In Progress",
    semester: "sem-6",
  },
  {
    code: "CSE-3206",
    name: "Software Engineering Studio Lab",
    instructor: "Sadia Afrin",
    section: "Sec 02",
    credits: 1.5,
    grade: "A+",
    gradePoint: 4.00,
    status: "In Progress",
    semester: "sem-6",
  },
  {
    code: "CSE-3201",
    name: "Design & Analysis of Algorithms II",
    instructor: "Dr. Asif Rahman",
    section: "Sec 01",
    credits: 3.0,
    grade: "A",
    gradePoint: 3.75,
    status: "In Progress",
    semester: "sem-6",
  },
  {
    code: "CSE-3202",
    name: "Algorithms II Engineering Lab",
    instructor: "Faisal Ahmed",
    section: "Sec 01",
    credits: 1.5,
    grade: "A+",
    gradePoint: 4.00,
    status: "In Progress",
    semester: "sem-6",
  },
  {
    code: "CSE-3203",
    name: "Web Engineering & Distributed Cloud Platforms",
    instructor: "Prof. Mahmudul Hasan",
    section: "Sec 03",
    credits: 3.0,
    grade: "A",
    gradePoint: 3.75,
    status: "In Progress",
    semester: "sem-6",
  },
  {
    code: "GED-3201",
    name: "Technical Writing & Presentation Studio",
    instructor: "Dr. Shahed Rahman",
    section: "Sec 05",
    credits: 3.0,
    grade: "A",
    gradePoint: 3.75,
    status: "In Progress",
    semester: "sem-6",
  },

  // Sem 5 (Fall 2025) - SGPA 3.84, Credits 21.0
  {
    code: "CSE-3101",
    name: "Operating Systems",
    instructor: "Dr. Rafiqul Islam",
    section: "Sec 02",
    credits: 3.0,
    grade: "A+",
    gradePoint: 4.00,
    status: "Completed",
    semester: "sem-5",
  },
  {
    code: "CSE-3102",
    name: "Operating Systems Lab",
    instructor: "Sadia Afrin",
    section: "Sec 02",
    credits: 1.5,
    grade: "A+",
    gradePoint: 4.00,
    status: "Completed",
    semester: "sem-5",
  },
  {
    code: "CSE-3103",
    name: "Database Management Systems",
    instructor: "Prof. Tanvir Hasan",
    section: "Sec 01",
    credits: 3.0,
    grade: "A+",
    gradePoint: 4.00,
    status: "Completed",
    semester: "sem-5",
  },
  {
    code: "CSE-3104",
    name: "Database Management Systems Lab",
    instructor: "Faisal Ahmed",
    section: "Sec 01",
    credits: 1.5,
    grade: "A+",
    gradePoint: 4.00,
    status: "Completed",
    semester: "sem-5",
  },
  {
    code: "CSE-3105",
    name: "Computer Networks",
    instructor: "Ms. Nadia Sultana",
    section: "Sec 03",
    credits: 3.0,
    grade: "A",
    gradePoint: 3.75,
    status: "Completed",
    semester: "sem-5",
  },
  {
    code: "CSE-3106",
    name: "Computer Networks Lab",
    instructor: "Ms. Nadia Sultana",
    section: "Sec 03",
    credits: 1.5,
    grade: "A+",
    gradePoint: 4.00,
    status: "Completed",
    semester: "sem-5",
  },
  {
    code: "CSE-3107",
    name: "Microprocessors & Assembly",
    instructor: "Engr. Faisal Ahmed",
    section: "Sec 01",
    credits: 3.0,
    grade: "A",
    gradePoint: 3.75,
    status: "Completed",
    semester: "sem-5",
  },
  {
    code: "CSE-3108",
    name: "Microprocessors Lab",
    instructor: "Engr. Faisal Ahmed",
    section: "Sec 01",
    credits: 1.5,
    grade: "A",
    gradePoint: 3.75,
    status: "Completed",
    semester: "sem-5",
  },
  {
    code: "GED-2201",
    name: "Engineering Ethics & Environmental Law",
    instructor: "Dr. Shahed Rahman",
    section: "Sec 05",
    credits: 3.0,
    grade: "A-",
    gradePoint: 3.50,
    status: "Completed",
    semester: "sem-5",
  },

  // Sem 4 (Spring 2025) - SGPA 3.81, Credits 18.0
  {
    code: "CSE-2201",
    name: "Algorithms & Complexity",
    instructor: "Dr. Asif Rahman",
    section: "Sec 01",
    credits: 3.0,
    grade: "A+",
    gradePoint: 4.00,
    status: "Completed",
    semester: "sem-4",
  },
  {
    code: "CSE-2202",
    name: "Algorithms & Complexity Lab",
    instructor: "Sadia Afrin",
    section: "Sec 01",
    credits: 1.5,
    grade: "A+",
    gradePoint: 4.00,
    status: "Completed",
    semester: "sem-4",
  },
  {
    code: "CSE-2203",
    name: "Software Engineering Principles",
    instructor: "Dr. Farhana Khan",
    section: "Sec 02",
    credits: 3.0,
    grade: "A+",
    gradePoint: 4.00,
    status: "Completed",
    semester: "sem-4",
  },
  {
    code: "CSE-2204",
    name: "Software Engineering Lab",
    instructor: "Sadia Afrin",
    section: "Sec 02",
    credits: 1.5,
    grade: "A+",
    gradePoint: 4.00,
    status: "Completed",
    semester: "sem-4",
  },
  {
    code: "MATH-2201",
    name: "Linear Algebra & Differential Equations",
    instructor: "Prof. K. M. Hossain",
    section: "Sec 04",
    credits: 3.0,
    grade: "A",
    gradePoint: 3.75,
    status: "Completed",
    semester: "sem-4",
  },
  {
    code: "CSE-2205",
    name: "Theory of Computation",
    instructor: "Dr. Nazmul Huda",
    section: "Sec 01",
    credits: 3.0,
    grade: "A-",
    gradePoint: 3.50,
    status: "Completed",
    semester: "sem-4",
  },
  {
    code: "CSE-2207",
    name: "Computer Architecture",
    instructor: "Dr. Rafiqul Islam",
    section: "Sec 02",
    credits: 3.0,
    grade: "A-",
    gradePoint: 3.50,
    status: "Completed",
    semester: "sem-4",
  },

  // Sem 3 (Fall 2024) - SGPA 3.68, Credits 21.0
  {
    code: "CSE-2101",
    name: "Data Structures",
    instructor: "Dr. Asif Rahman",
    section: "Sec 01",
    credits: 3.0,
    grade: "A",
    gradePoint: 3.75,
    status: "Completed",
    semester: "sem-3",
  },
  {
    code: "CSE-2102",
    name: "Data Structures Lab",
    instructor: "Faisal Ahmed",
    section: "Sec 01",
    credits: 1.5,
    grade: "A+",
    gradePoint: 4.00,
    status: "Completed",
    semester: "sem-3",
  },
  {
    code: "CSE-2103",
    name: "Digital Logic Design",
    instructor: "Prof. Mahmudul Hasan",
    section: "Sec 03",
    credits: 3.0,
    grade: "B+",
    gradePoint: 3.25,
    status: "Completed",
    semester: "sem-3",
  },
  {
    code: "CSE-2104",
    name: "Digital Logic Design Lab",
    instructor: "Prof. Mahmudul Hasan",
    section: "Sec 03",
    credits: 1.5,
    grade: "A+",
    gradePoint: 4.00,
    status: "Completed",
    semester: "sem-3",
  },
  {
    code: "MATH-2101",
    name: "Probability & Statistics",
    instructor: "Dr. Shahed Rahman",
    section: "Sec 02",
    credits: 3.0,
    grade: "A+",
    gradePoint: 4.00,
    status: "Completed",
    semester: "sem-3",
  },
  {
    code: "ENG-1201",
    name: "Professional Communication",
    instructor: "Ms. Tania Sultana",
    section: "Sec 05",
    credits: 2.0,
    grade: "A",
    gradePoint: 3.75,
    status: "Completed",
    semester: "sem-3",
  },
  {
    code: "EEE-2101",
    name: "Electronic Devices & Circuits",
    instructor: "Engr. Nayeem Kabir",
    section: "Sec 02",
    credits: 3.0,
    grade: "A-",
    gradePoint: 3.50,
    status: "Completed",
    semester: "sem-3",
  },
  {
    code: "EEE-2102",
    name: "Electronic Devices Lab",
    instructor: "Engr. Nayeem Kabir",
    section: "Sec 02",
    credits: 1.0,
    grade: "A",
    gradePoint: 3.75,
    status: "Completed",
    semester: "sem-3",
  },
  {
    code: "GED-2101",
    name: "Engineering Economics & Finance",
    instructor: "Dr. Shahed Rahman",
    section: "Sec 04",
    credits: 3.0,
    grade: "A-",
    gradePoint: 3.50,
    status: "Completed",
    semester: "sem-3",
  },

  // Sem 2 (Spring 2024) - SGPA 3.70, Credits 18.0
  {
    code: "CSE-1201",
    name: "Discrete Mathematics",
    instructor: "Dr. Nazmul Huda",
    section: "Sec 02",
    credits: 3.0,
    grade: "A",
    gradePoint: 3.75,
    status: "Completed",
    semester: "sem-2",
  },
  {
    code: "CSE-1203",
    name: "Object Oriented Programming",
    instructor: "Dr. Farhana Khan",
    section: "Sec 01",
    credits: 3.0,
    grade: "A+",
    gradePoint: 4.00,
    status: "Completed",
    semester: "sem-2",
  },
  {
    code: "CSE-1204",
    name: "Object Oriented Programming Lab",
    instructor: "Sadia Afrin",
    section: "Sec 01",
    credits: 1.5,
    grade: "A+",
    gradePoint: 4.00,
    status: "Completed",
    semester: "sem-2",
  },
  {
    code: "EEE-1201",
    name: "Electrical Circuits & Devices",
    instructor: "Engr. Nayeem Kabir",
    section: "Sec 03",
    credits: 3.0,
    grade: "A-",
    gradePoint: 3.50,
    status: "Completed",
    semester: "sem-2",
  },
  {
    code: "EEE-1202",
    name: "Electrical Circuits Lab",
    instructor: "Engr. Nayeem Kabir",
    section: "Sec 03",
    credits: 1.5,
    grade: "A+",
    gradePoint: 4.00,
    status: "Completed",
    semester: "sem-2",
  },
  {
    code: "MATH-1201",
    name: "Coordinate Geometry & Linear Algebra",
    instructor: "Prof. K. M. Hossain",
    section: "Sec 04",
    credits: 3.0,
    grade: "B+",
    gradePoint: 3.25,
    status: "Completed",
    semester: "sem-2",
  },
  {
    code: "GED-1201",
    name: "Economics & Sustainable Development",
    instructor: "Dr. Shahed Rahman",
    section: "Sec 02",
    credits: 3.0,
    grade: "A",
    gradePoint: 3.75,
    status: "Completed",
    semester: "sem-2",
  },

  // Sem 1 (Fall 2023) - SGPA 3.62, Credits 18.0
  {
    code: "CSE-1101",
    name: "Structured Programming Language",
    instructor: "Dr. Rafiqul Islam",
    section: "Sec 01",
    credits: 3.0,
    grade: "A",
    gradePoint: 3.75,
    status: "Completed",
    semester: "sem-1",
  },
  {
    code: "CSE-1102",
    name: "Structured Programming Lab",
    instructor: "Faisal Ahmed",
    section: "Sec 01",
    credits: 1.5,
    grade: "A+",
    gradePoint: 4.00,
    status: "Completed",
    semester: "sem-1",
  },
  {
    code: "MATH-1101",
    name: "Differential & Integral Calculus",
    instructor: "Prof. K. M. Hossain",
    section: "Sec 03",
    credits: 3.0,
    grade: "A",
    gradePoint: 3.75,
    status: "Completed",
    semester: "sem-1",
  },
  {
    code: "PHY-1101",
    name: "Physics (Mechanics, Waves & Optics)",
    instructor: "Dr. Anisur Rahman",
    section: "Sec 02",
    credits: 3.0,
    grade: "B+",
    gradePoint: 3.25,
    status: "Completed",
    semester: "sem-1",
  },
  {
    code: "PHY-1102",
    name: "Physics Laboratory",
    instructor: "Dr. Anisur Rahman",
    section: "Sec 02",
    credits: 1.5,
    grade: "A+",
    gradePoint: 4.00,
    status: "Completed",
    semester: "sem-1",
  },
  {
    code: "ENG-1101",
    name: "English Reading & Academic Writing",
    instructor: "Ms. Tania Sultana",
    section: "Sec 04",
    credits: 3.0,
    grade: "A-",
    gradePoint: 3.50,
    status: "Completed",
    semester: "sem-1",
  },
  {
    code: "GED-1101",
    name: "Bangladesh Studies & Liberation Heritage",
    instructor: "Dr. Shahed Rahman",
    section: "Sec 01",
    credits: 3.0,
    grade: "A-",
    gradePoint: 3.50,
    status: "Completed",
    semester: "sem-1",
  },
];

// Active courses for GPA simulator (Spring 2026)
interface SimCourse {
  code: string;
  name: string;
  credits: number;
  grade: GradeScale;
}

const initialSimCourses: SimCourse[] = [
  { code: "CSE-3205", name: "Software Engineering & Architecture", credits: 3.0, grade: "A+" },
  { code: "CSE-3103", name: "Advanced Database Systems", credits: 3.0, grade: "A" },
  { code: "CSE-3101", name: "Design & Analysis of Algorithms II", credits: 3.0, grade: "A" },
  { code: "CSE-3206", name: "Software Engineering Studio Lab", credits: 1.5, grade: "A+" },
  { code: "CSE-3104", name: "Database Engineering Lab", credits: 1.5, grade: "A+" },
  { code: "GED-3201", name: "Technical Writing & Presentation", credits: 3.0, grade: "A" },
];

const gradePointsMap: Record<GradeScale, number> = {
  "A+": 4.00,
  "A": 3.75,
  "A-": 3.50,
  "B+": 3.25,
  "B": 3.00,
  "B-": 2.75,
  "C+": 2.50,
  "C": 2.25,
  "F": 0.00,
};

export default function AcademicProgressPage() {
  const [selectedSemesterTab, setSelectedSemesterTab] = useState<string>("sem-5");
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [hoveredChartNode, setHoveredChartNode] = useState<SemesterMilestone | null>(null);

  // Modals state
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);
  const [isTranscriptOpen, setIsTranscriptOpen] = useState<boolean>(false);
  const [transcriptSemester, setTranscriptSemester] = useState<string>("all");
  const [simCourses, setSimCourses] = useState<SimCourse[]>(initialSimCourses);

  // Filtered courses
  const filteredCourses = useMemo(() => {
    return courseDatabase.filter((c) => {
      const matchSemester = selectedSemesterTab === "all" || c.semester === selectedSemesterTab;
      const matchQuery = 
        searchFilter.trim() === "" ||
        c.code.toLowerCase().includes(searchFilter.toLowerCase()) ||
        c.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        c.instructor.toLowerCase().includes(searchFilter.toLowerCase());
      return matchSemester && matchQuery;
    });
  }, [selectedSemesterTab, searchFilter]);

  // Transcript modal filtered courses
  const transcriptCourses = useMemo(() => {
    if (transcriptSemester === "all") return courseDatabase;
    return courseDatabase.filter((c) => c.semester === transcriptSemester);
  }, [transcriptSemester]);

  const activeTranscriptMilestone = useMemo(() => {
    return semesterMilestones.find((m) => m.id === transcriptSemester);
  }, [transcriptSemester]);

  // Semester metrics for active table view
  const tableSummary = useMemo(() => {
    const totalCredits = filteredCourses.reduce((acc, c) => acc + c.credits, 0);
    const totalWeightedPoints = filteredCourses.reduce((acc, c) => acc + c.gradePoint * c.credits, 0);
    const sgpa = totalCredits > 0 ? (totalWeightedPoints / totalCredits).toFixed(2) : "0.00";
    return {
      totalCredits,
      sgpa,
    };
  }, [filteredCourses]);

  // GPA Simulator Calculations
  const simulationResults = useMemo(() => {
    const termCredits = simCourses.reduce((acc, c) => acc + c.credits, 0);
    const termPoints = simCourses.reduce((acc, c) => acc + (gradePointsMap[c.grade] || 0) * c.credits, 0);
    const projectedSGPA = termCredits > 0 ? termPoints / termCredits : 0;

    // Past 96 credits with CGPA 3.78
    const pastCredits = 96;
    const pastPoints = pastCredits * 3.78;
    const totalCreditsAfterTerm = pastCredits + termCredits;
    const totalPointsAfterTerm = pastPoints + termPoints;
    const simulatedCGPA = totalPointsAfterTerm / totalCreditsAfterTerm;
    const cgpaDelta = simulatedCGPA - 3.78;

    return {
      termCredits,
      projectedSGPA: projectedSGPA.toFixed(2),
      simulatedCGPA: simulatedCGPA.toFixed(2),
      cgpaDelta: (cgpaDelta >= 0 ? "+" : "") + cgpaDelta.toFixed(2),
      isPositive: cgpaDelta >= 0,
    };
  }, [simCourses]);

  const updateSimGrade = (index: number, newGrade: GradeScale) => {
    setSimCourses((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], grade: newGrade };
      return updated;
    });
  };

  const handlePrintTranscript = () => {
    window.print();
  };

  return (
    <div className="w-full space-y-4 pb-10 select-none">
      {/* ========================================================================= */}
      {/* 1. TOP PAGE HEADER ROW                                                    */}
      {/* ========================================================================= */}
      <FadeIn delay={0.05} direction="down">
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-[#30363D]/40">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-manrope font-extrabold text-xl md:text-2xl tracking-tight text-slate-900 dark:text-[#F0F6FC]">
                Academic Progress &amp; Degree Audit
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-brand/10 text-brand border border-brand/25 dark:bg-[#2563EB]/15 dark:text-[#2563EB] dark:border-[#2563EB]/30 text-[11px] font-mono font-semibold">
                Class of 2027
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#8D96A0] mt-0.5 font-jakarta">
              Bachelor of Science in Computer Science &amp; Engineering •{" "}
              <span className="font-mono text-slate-700 dark:text-[#F0F6FC] font-semibold">
                Student ID: 211-15-4424
              </span>{" "}
              • 6th Semester Active
            </p>
          </div>

          {/* Action Buttons Cluster */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Download Transcript Button */}
            <button
              type="button"
              onClick={() => setIsTranscriptOpen(true)}
              className="h-8.5 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#161B22] dark:hover:bg-[#21262D] border border-slate-200 dark:border-[#30363D] text-slate-700 dark:text-[#C9D1D9] hover:text-slate-900 dark:hover:text-[#F0F6FC] transition-all flex items-center gap-2 text-xs font-semibold shadow-xs cursor-pointer active:scale-[0.98]"
              title="Download Unofficial Academic Transcript"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Unofficial Transcript (PDF)</span>
            </button>

            {/* GPA Simulator Primary Button */}
            <button
              type="button"
              onClick={() => setIsSimulatorOpen(true)}
              className="h-8.5 px-4 rounded-xl bg-brand hover:bg-brand-hover dark:bg-[#2563EB] dark:hover:bg-[#5852ff] text-white transition-all flex items-center gap-2 text-xs font-semibold shadow-sm dark:shadow-[0_0_16px_rgba(37, 99, 235,0.35)] active:scale-[0.98] cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>GPA Simulator</span>
            </button>
          </div>
        </section>
      </FadeIn>

      {/* ========================================================================= */}
      {/* 2. OVERVIEW HERO BENTO GRID (4 Cards across 12 cols, 20px gap)             */}
      {/* ========================================================================= */}
      <FadeIn delay={0.1}>
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* ------------------------------------------------------------- */}
          {/* CARD 1: OVERALL CGPA (Radial Arc Gauge)                       */}
          {/* ------------------------------------------------------------- */}
          <SpotlightCard
            className="bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] hover:border-brand/40 dark:hover:border-[#2563EB]/60 rounded-3xl p-5 transition-all duration-300 flex flex-col justify-between shadow-xs hover:shadow-[0_12px_32px_-4px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_0_35px_-5px_rgba(37, 99, 235,0.18)]"
            spotlightColor={SPOTLIGHT.wash}
            borderGlowColor={SPOTLIGHT.glow}
          >
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-[#F0F6FC] tracking-tight">
                  Overall CGPA
                </span>
                <span className="font-mono text-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30 font-semibold">
                  CUMULATIVE
                </span>
              </div>

              <div className="py-2.5 flex flex-col items-center justify-center relative">
                {/* Radial Arc Gauge: 3.78 / 4.00 = 94.5% */}
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    {/* Track Circle */}
                    <circle
                      cx="60"
                      cy="60"
                      r="48"
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="9"
                      className="text-slate-100 dark:text-[#161B22]"
                    />
                    {/* Progress Glow Arc */}
                    <circle
                      cx="60"
                      cy="60"
                      r="48"
                      fill="transparent"
                      stroke="#2563EB"
                      strokeWidth="9"
                      strokeDasharray="301.59"
                      strokeDashoffset="16.59"
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  {/* Center Callout */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="font-mono text-2xl font-extrabold text-slate-900 dark:text-[#F0F6FC] tracking-tight">
                      3.78
                    </span>
                    <span className="font-mono text-[11px] text-slate-400 dark:text-[#8D96A0]">
                      / 4.00
                    </span>
                  </div>
                </div>

                {/* Distinction Pill */}
                <div className="mt-2 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 font-mono text-[11px] font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Dean&apos;s List Distinction</span>
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-100 dark:border-[#30363D]/60 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500 dark:text-[#8D96A0]">Cohort Standing</span>
                <span className="text-brand dark:text-[#2563EB] font-bold">
                  Rank #6 of 142 (Top 4.2%)
                </span>
              </div>
            </div>
          </SpotlightCard>

          {/* ------------------------------------------------------------- */}
          {/* CARD 2: DEGREE COMPLETION                                     */}
          {/* ------------------------------------------------------------- */}
          <SpotlightCard
            className="bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] hover:border-brand/40 dark:hover:border-[#2563EB]/60 rounded-3xl p-5 transition-all duration-300 flex flex-col justify-between shadow-xs hover:shadow-[0_12px_32px_-4px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_0_35px_-5px_rgba(37, 99, 235,0.18)]"
            spotlightColor={SPOTLIGHT.wash}
            borderGlowColor={SPOTLIGHT.glow}
          >
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-[#F0F6FC] tracking-tight">
                  Degree Completion
                </span>
                <Layers className="w-4 h-4 text-slate-400 dark:text-[#8D96A0]" />
              </div>

              <div className="py-2">
                <div className="flex items-baseline gap-2">
                  <span className="font-manrope text-3xl font-extrabold text-slate-900 dark:text-[#F0F6FC] leading-none">
                    66%
                  </span>
                  <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                    On Track
                  </span>
                </div>
                <div className="font-mono text-xs text-slate-500 dark:text-[#8D96A0] mt-2">
                  <span className="text-slate-900 dark:text-[#F0F6FC] font-bold">96</span> of{" "}
                  <span className="text-slate-900 dark:text-[#F0F6FC] font-bold">144</span> credits fulfilled
                </div>

                {/* Multi-segment Progress Bar */}
                <div className="w-full bg-slate-100 dark:bg-[#161B22] h-2.5 rounded-full mt-3 flex overflow-hidden p-0.5 border border-slate-200 dark:border-[#30363D]">
                  {/* Completed (66.6%) */}
                  <div
                    className="bg-brand dark:bg-[#2563EB] h-full rounded-l-full shadow-[0_0_6px_rgba(37, 99, 235,0.4)]"
                    style={{ width: "66.6%" }}
                    title="Completed 96 Credits"
                  />
                  {/* In Progress (10.4%) */}
                  <div
                    className="bg-emerald-500 dark:bg-[#3FB950] h-full shadow-[0_0_6px_rgba(63,185,80,0.3)]"
                    style={{ width: "10.4%" }}
                    title="Active 15 Credits"
                  />
                  {/* Left (23.0%) */}
                  <div
                    className="bg-slate-200 dark:bg-[#21262D] h-full rounded-r-full"
                    style={{ width: "23.0%" }}
                    title="Remaining 33 Credits"
                  />
                </div>

                {/* Legend Strip */}
                <div className="flex items-center gap-3 mt-2.5 text-[11px] font-mono text-slate-500 dark:text-[#8D96A0]">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-brand dark:bg-[#2563EB]" /> Done (96)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-[#3FB950]" /> Active (15)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-[#21262D]" /> Left (33)
                  </span>
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-100 dark:border-[#30363D]/60 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500 dark:text-[#8D96A0]">Target Graduation</span>
                <span className="text-slate-800 dark:text-[#F0F6FC] font-semibold">
                  48 credits left (Est. Fall 2027)
                </span>
              </div>
            </div>
          </SpotlightCard>

          {/* ------------------------------------------------------------- */}
          {/* CARD 3: CREDIT DISTRIBUTION                                   */}
          {/* ------------------------------------------------------------- */}
          <SpotlightCard
            className="bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] hover:border-brand/40 dark:hover:border-[#2563EB]/60 rounded-3xl p-5 transition-all duration-300 flex flex-col justify-between shadow-xs hover:shadow-[0_12px_32px_-4px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_0_35px_-5px_rgba(37, 99, 235,0.18)]"
            spotlightColor={SPOTLIGHT.wash}
            borderGlowColor={SPOTLIGHT.glow}
          >
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-[#F0F6FC] tracking-tight">
                  Credit Distribution
                </span>
                <BookOpen className="w-4 h-4 text-slate-400 dark:text-[#8D96A0]" />
              </div>

              <div className="space-y-2.5 py-1">
                {/* Major Core */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-slate-700 dark:text-[#F0F6FC] font-medium">Major Core</span>
                    <span className="font-mono text-[11px] text-brand dark:text-[#2563EB] font-bold">
                      72 / 90 <span className="text-slate-400 font-normal">(80%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-[#161B22] h-1.5 rounded-full overflow-hidden border border-slate-200 dark:border-[#30363D]">
                    <div className="bg-brand dark:bg-[#2563EB] h-full rounded-full" style={{ width: "80%" }} />
                  </div>
                </div>

                {/* General Electives */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-slate-700 dark:text-[#F0F6FC] font-medium">General Electives</span>
                    <span className="font-mono text-[11px] text-sky-500 dark:text-sky-400 font-bold">
                      24 / 30 <span className="text-slate-400 font-normal">(80%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-[#161B22] h-1.5 rounded-full overflow-hidden border border-slate-200 dark:border-[#30363D]">
                    <div className="bg-sky-500 dark:bg-sky-400 h-full rounded-full" style={{ width: "80%" }} />
                  </div>
                </div>

                {/* Basic Sciences & Math */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-slate-700 dark:text-[#F0F6FC] font-medium">Math &amp; Science</span>
                    <span className="font-mono text-[11px] text-emerald-500 dark:text-emerald-400 font-bold">
                      18 / 24 <span className="text-slate-400 font-normal">(75%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-[#161B22] h-1.5 rounded-full overflow-hidden border border-slate-200 dark:border-[#30363D]">
                    <div className="bg-emerald-500 dark:bg-emerald-400 h-full rounded-full" style={{ width: "75%" }} />
                  </div>
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-100 dark:border-[#30363D]/60 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500 dark:text-[#8D96A0]">Audit Requirement</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  100% Core Prereqs Met
                </span>
              </div>
            </div>
          </SpotlightCard>

          {/* ------------------------------------------------------------- */}
          {/* CARD 4: CURRENT SEMESTER SGPA FORECAST                        */}
          {/* ------------------------------------------------------------- */}
          <SpotlightCard
            className="bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] hover:border-brand/40 dark:hover:border-[#2563EB]/60 rounded-3xl p-5 transition-all duration-300 flex flex-col justify-between shadow-xs hover:shadow-[0_12px_32px_-4px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_0_35px_-5px_rgba(37, 99, 235,0.18)]"
            spotlightColor={SPOTLIGHT.wash}
            borderGlowColor={SPOTLIGHT.glow}
          >
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-[#F0F6FC] tracking-tight">
                  SGPA Forecast
                </span>
                <span className="font-mono text-[10px] bg-brand/10 text-brand border border-brand/20 dark:bg-[#2563EB]/15 dark:text-[#8A86FF] dark:border-[#2563EB]/30 px-2 py-0.5 rounded font-semibold">
                  PREDICTED
                </span>
              </div>

              <div className="py-2">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-3xl font-extrabold text-slate-900 dark:text-[#F0F6FC] leading-none">
                    3.85
                  </span>
                  <span className="font-mono text-xs text-slate-400 dark:text-[#8D96A0]">
                    est.
                  </span>
                </div>

                <div className="mt-2.5 flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 font-mono text-[11px] font-bold">
                    <TrendingUp className="w-3 h-3" />
                    +0.07 vs Fall 2025
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-[#8D96A0] mt-2 font-jakarta leading-relaxed">
                  Continuous evaluation across 5 active Spring 2026 courses (15.0 Credits).
                </p>
              </div>

              <div className="pt-2.5 border-t border-slate-100 dark:border-[#30363D]/60 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500 dark:text-[#8D96A0]">Midterm Benchmark</span>
                <span className="text-brand dark:text-[#2563EB] font-semibold">
                  All A/A+ range
                </span>
              </div>
            </div>
          </SpotlightCard>
        </section>
      </FadeIn>

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE SEMESTER PROGRESSION CHART CARD (Full width)                */}
      {/* ========================================================================= */}
      <FadeIn delay={0.15}>
        <SpotlightCard
          className="bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] hover:border-brand/40 dark:hover:border-[#2563EB]/60 rounded-3xl p-5 md:p-6 shadow-xs relative transition-all duration-300 hover:shadow-[0_12px_32px_-4px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_0_35px_-5px_rgba(37, 99, 235,0.18)]"
          spotlightColor={SPOTLIGHT.wash}
          borderGlowColor={SPOTLIGHT.glow}
        >
          <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-manrope text-base md:text-lg font-bold text-slate-900 dark:text-[#F0F6FC]">
                  SGPA vs. Cumulative CGPA Trajectory
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-100 dark:bg-[#161B22] text-slate-600 dark:text-[#8D96A0] border border-slate-200 dark:border-[#30363D]">
                  Interactive
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-[#8D96A0] mt-0.5">
                Hover or click on any semester bar to inspect specific term SGPA and cumulative CGPA curve.
              </p>
            </div>

            {/* Chart Legend */}
            <div className="flex items-center gap-3.5 font-mono text-xs flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded bg-slate-200 dark:bg-[#21262D] border-t-2 border-brand dark:border-[#2563EB]" />
                <span className="text-slate-600 dark:text-[#8D96A0]">SGPA Bars</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-1 bg-brand dark:bg-[#2563EB] shadow-[0_0_6px_#2563EB] inline-block rounded-full" />
                <span className="text-slate-900 dark:text-[#F0F6FC] font-medium">Cumulative CGPA Spline</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-0.5 border-t border-dashed border-emerald-500 inline-block" />
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">Projected</span>
              </div>
            </div>
          </div>

          {/* SVG Progression Visualization */}
          <div className="w-full overflow-x-auto custom-scrollbar">
            <div 
              className="w-full min-w-[720px] aspect-[1200/270] relative"
              onMouseLeave={() => setHoveredChartNode(null)}
            >
              <svg 
                className="w-full h-full block select-none" 
                viewBox="0 0 1200 270"
                preserveAspectRatio="xMidYMid meet"
                onMouseLeave={() => setHoveredChartNode(null)}
              >
                <defs>
                  {/* Glowing gradient for cumulative CGPA spline */}
                  <linearGradient id="chartIndigoGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Y-Axis Horizontal Gridlines & Monospace Labels (Range: 3.00 to 4.00) */}
                {/* 4.00 */}
                <line x1="48" y1="35" x2="1175" y2="35" stroke="currentColor" strokeDasharray="3 3" strokeWidth="1" className="text-slate-200 dark:text-[#30363D]" />
                <text x="38" y="39" textAnchor="end" fill="currentColor" fontFamily="JetBrains Mono, monospace" fontSize="11" className="text-slate-400 dark:text-[#8D96A0]">4.00</text>

                {/* 3.75 */}
                <line x1="48" y1="80" x2="1175" y2="80" stroke="currentColor" strokeDasharray="3 3" strokeWidth="1" className="text-slate-200 dark:text-[#30363D]" />
                <text x="38" y="84" textAnchor="end" fill="currentColor" fontFamily="JetBrains Mono, monospace" fontSize="11" className="text-slate-400 dark:text-[#8D96A0]">3.75</text>

                {/* 3.50 */}
                <line x1="48" y1="125" x2="1175" y2="125" stroke="currentColor" strokeDasharray="3 3" strokeWidth="1" className="text-slate-200 dark:text-[#30363D]" />
                <text x="38" y="129" textAnchor="end" fill="currentColor" fontFamily="JetBrains Mono, monospace" fontSize="11" className="text-slate-400 dark:text-[#8D96A0]">3.50</text>

                {/* 3.25 */}
                <line x1="48" y1="170" x2="1175" y2="170" stroke="currentColor" strokeDasharray="3 3" strokeWidth="1" className="text-slate-200 dark:text-[#30363D]" />
                <text x="38" y="174" textAnchor="end" fill="currentColor" fontFamily="JetBrains Mono, monospace" fontSize="11" className="text-slate-400 dark:text-[#8D96A0]">3.25</text>

                {/* 3.00 Base line */}
                <line x1="48" y1="215" x2="1175" y2="215" stroke="currentColor" strokeWidth="1" className="text-slate-300 dark:text-[#30363D]" />
                <text x="38" y="219" textAnchor="end" fill="currentColor" fontFamily="JetBrains Mono, monospace" fontSize="11" className="text-slate-400 dark:text-[#8D96A0]">3.00</text>

                {/* SGPA BARS (Interactive hover groups) */}
                {/* Sem 1: Center x=100, SGPA 3.62 */}
                <g 
                  className="cursor-pointer group"
                  onMouseEnter={() => setHoveredChartNode(semesterMilestones[0])}
                  onClick={() => {
                    setHoveredChartNode(semesterMilestones[0]);
                    setSelectedSemesterTab("sem-1");
                  }}
                >
                  <rect x="48" y="20" width="154" height="235" fill="transparent" />
                  <rect
                    x="76"
                    y="103"
                    width="48"
                    height="112"
                    rx="4"
                    className={`transition-all duration-150 ${
                      hoveredChartNode?.id === "sem-1"
                        ? "fill-indigo-50/50 dark:fill-[#1A202C] stroke-[#2563EB] stroke-[2] drop-shadow-[0_0_10px_rgba(37, 99, 235,0.3)]"
                        : "fill-slate-100 dark:fill-[#161B22] stroke-slate-300 dark:stroke-[#30363D] group-hover:stroke-brand"
                    }`}
                  />
                  <rect x="76" y="103" width="48" height="4" rx="2" fill="#2563EB" />
                  <text x="100" y="96" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="11" fontWeight={hoveredChartNode?.id === "sem-1" ? "700" : "600"} className={hoveredChartNode?.id === "sem-1" ? "fill-brand font-bold" : "fill-brand dark:fill-[#C3C1FF]"}>
                    3.62
                  </text>
                </g>

                {/* Sem 2: Center x=304, SGPA 3.70 */}
                <g 
                  className="cursor-pointer group"
                  onMouseEnter={() => setHoveredChartNode(semesterMilestones[1])}
                  onClick={() => {
                    setHoveredChartNode(semesterMilestones[1]);
                    setSelectedSemesterTab("sem-2");
                  }}
                >
                  <rect x="202" y="20" width="204" height="235" fill="transparent" />
                  <rect
                    x="280"
                    y="89"
                    width="48"
                    height="126"
                    rx="4"
                    className={`transition-all duration-150 ${
                      hoveredChartNode?.id === "sem-2"
                        ? "fill-indigo-50/50 dark:fill-[#1A202C] stroke-[#2563EB] stroke-[2] drop-shadow-[0_0_10px_rgba(37, 99, 235,0.3)]"
                        : "fill-slate-100 dark:fill-[#161B22] stroke-slate-300 dark:stroke-[#30363D] group-hover:stroke-brand"
                    }`}
                  />
                  <rect x="280" y="89" width="48" height="4" rx="2" fill="#2563EB" />
                  <text x="304" y="82" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="11" fontWeight={hoveredChartNode?.id === "sem-2" ? "700" : "600"} className={hoveredChartNode?.id === "sem-2" ? "fill-brand font-bold" : "fill-brand dark:fill-[#C3C1FF]"}>
                    3.70
                  </text>
                </g>

                {/* Sem 3: Center x=508, SGPA 3.68 */}
                <g 
                  className="cursor-pointer group"
                  onMouseEnter={() => setHoveredChartNode(semesterMilestones[2])}
                  onClick={() => {
                    setHoveredChartNode(semesterMilestones[2]);
                    setSelectedSemesterTab("sem-3");
                  }}
                >
                  <rect x="406" y="20" width="204" height="235" fill="transparent" />
                  <rect
                    x="484"
                    y="93"
                    width="48"
                    height="122"
                    rx="4"
                    className={`transition-all duration-150 ${
                      hoveredChartNode?.id === "sem-3"
                        ? "fill-indigo-50/50 dark:fill-[#1A202C] stroke-[#2563EB] stroke-[2] drop-shadow-[0_0_10px_rgba(37, 99, 235,0.3)]"
                        : "fill-slate-100 dark:fill-[#161B22] stroke-slate-300 dark:stroke-[#30363D] group-hover:stroke-brand"
                    }`}
                  />
                  <rect x="484" y="93" width="48" height="4" rx="2" fill="#2563EB" />
                  <text x="508" y="86" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="11" fontWeight={hoveredChartNode?.id === "sem-3" ? "700" : "600"} className={hoveredChartNode?.id === "sem-3" ? "fill-brand font-bold" : "fill-brand dark:fill-[#C3C1FF]"}>
                    3.68
                  </text>
                </g>

                {/* Sem 4: Center x=712, SGPA 3.81 */}
                <g 
                  className="cursor-pointer group"
                  onMouseEnter={() => setHoveredChartNode(semesterMilestones[3])}
                  onClick={() => {
                    setHoveredChartNode(semesterMilestones[3]);
                    setSelectedSemesterTab("sem-4");
                  }}
                >
                  <rect x="610" y="20" width="204" height="235" fill="transparent" />
                  <rect
                    x="688"
                    y="69"
                    width="48"
                    height="146"
                    rx="4"
                    className={`transition-all duration-150 ${
                      hoveredChartNode?.id === "sem-4"
                        ? "fill-indigo-50/50 dark:fill-[#1A202C] stroke-[#2563EB] stroke-[2] drop-shadow-[0_0_10px_rgba(37, 99, 235,0.3)]"
                        : "fill-slate-100 dark:fill-[#161B22] stroke-slate-300 dark:stroke-[#30363D] group-hover:stroke-brand"
                    }`}
                  />
                  <rect x="688" y="69" width="48" height="4" rx="2" fill="#2563EB" />
                  <text x="712" y="62" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="11" fontWeight={hoveredChartNode?.id === "sem-4" ? "700" : "600"} className={hoveredChartNode?.id === "sem-4" ? "fill-brand font-bold" : "fill-brand dark:fill-[#C3C1FF]"}>
                    3.81
                  </text>
                </g>

                {/* Sem 5: Center x=916, SGPA 3.84 */}
                <g 
                  className="cursor-pointer group"
                  onMouseEnter={() => setHoveredChartNode(semesterMilestones[4])}
                  onClick={() => {
                    setHoveredChartNode(semesterMilestones[4]);
                    setSelectedSemesterTab("sem-5");
                  }}
                >
                  <rect x="814" y="20" width="204" height="235" fill="transparent" />
                  <rect
                    x="892"
                    y="64"
                    width="48"
                    height="151"
                    rx="4"
                    className={`transition-all duration-150 ${
                      hoveredChartNode?.id === "sem-5"
                        ? "fill-indigo-50/50 dark:fill-[#1A202C] stroke-[#2563EB] stroke-[2] drop-shadow-[0_0_10px_rgba(37, 99, 235,0.3)]"
                        : "fill-slate-100 dark:fill-[#161B22] stroke-slate-300 dark:stroke-[#30363D] group-hover:stroke-brand"
                    }`}
                  />
                  <rect x="892" y="64" width="48" height="4" rx="2" fill="#2563EB" />
                  <text x="916" y="57" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="11" fontWeight={hoveredChartNode?.id === "sem-5" ? "700" : "600"} className={hoveredChartNode?.id === "sem-5" ? "fill-brand font-bold" : "fill-brand dark:fill-[#C3C1FF]"}>
                    3.84
                  </text>
                </g>

                {/* Sem 6: Center x=1120, SGPA 3.85 (Projected / Emerald cap) */}
                <g 
                  className="cursor-pointer group"
                  onMouseEnter={() => setHoveredChartNode(semesterMilestones[5])}
                  onClick={() => {
                    setHoveredChartNode(semesterMilestones[5]);
                    setSelectedSemesterTab("sem-6");
                  }}
                >
                  <rect x="1018" y="20" width="157" height="235" fill="transparent" />
                  <rect
                    x="1096"
                    y="62"
                    width="48"
                    height="153"
                    rx="4"
                    stroke="#3FB950"
                    strokeDasharray={hoveredChartNode?.id === "sem-6" ? undefined : "4 3"}
                    strokeWidth={hoveredChartNode?.id === "sem-6" ? "2" : "1.5"}
                    className={`transition-all duration-150 ${
                      hoveredChartNode?.id === "sem-6"
                        ? "fill-emerald-500/10 dark:fill-emerald-950/30 drop-shadow-[0_0_10px_rgba(63,185,80,0.3)]"
                        : "fill-slate-100 dark:fill-[#161B22]"
                    }`}
                  />
                  <rect x="1096" y="62" width="48" height="4" rx="2" fill="#3FB950" />
                  <text x="1120" y="55" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="11" fontWeight="700" fill="#3FB950">
                    3.85*
                  </text>
                </g>

                {/* AREA GRADIENT UNDER CUMULATIVE CGPA SPLINE */}
                <path
                  d="M 100 103 
                     C 202 103, 202 96, 304 96 
                     C 406 96, 406 94, 508 94 
                     C 610 94, 610 87, 712 87 
                     C 814 87, 814 75, 916 75 
                     L 916 215 L 100 215 Z"
                  fill="url(#chartIndigoGlow)"
                />

                {/* SOLID CUMULATIVE CGPA SPLINE (Sem 1 through Sem 5) */}
                <path
                  d="M 100 103 
                     C 202 103, 202 96, 304 96 
                     C 406 96, 406 94, 508 94 
                     C 610 94, 610 87, 712 87 
                     C 814 87, 814 75, 916 75"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* DASHED PROJECTED SPLINE FOR SEM 6 */}
                <path
                  d="M 916 75 C 1018 75, 1018 71, 1120 71"
                  fill="none"
                  stroke="#2563EB"
                  strokeDasharray="5 4"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* CUMULATIVE DATA POINTS */}
                <circle
                  cx="100"
                  cy="103"
                  r={hoveredChartNode?.id === "sem-1" ? "6.5" : "4.5"}
                  fill={hoveredChartNode?.id === "sem-1" ? "#2563EB" : "currentColor"}
                  stroke={hoveredChartNode?.id === "sem-1" ? "#F0F6FC" : "#2563EB"}
                  strokeWidth={hoveredChartNode?.id === "sem-1" ? "2.5" : "2"}
                  className={`transition-all duration-150 ${hoveredChartNode?.id === "sem-1" ? "filter drop-shadow-[0_0_8px_#2563EB]" : "text-white dark:text-[#0D1117]"}`}
                />
                <circle
                  cx="304"
                  cy="96"
                  r={hoveredChartNode?.id === "sem-2" ? "6.5" : "4.5"}
                  fill={hoveredChartNode?.id === "sem-2" ? "#2563EB" : "currentColor"}
                  stroke={hoveredChartNode?.id === "sem-2" ? "#F0F6FC" : "#2563EB"}
                  strokeWidth={hoveredChartNode?.id === "sem-2" ? "2.5" : "2"}
                  className={`transition-all duration-150 ${hoveredChartNode?.id === "sem-2" ? "filter drop-shadow-[0_0_8px_#2563EB]" : "text-white dark:text-[#0D1117]"}`}
                />
                <circle
                  cx="508"
                  cy="94"
                  r={hoveredChartNode?.id === "sem-3" ? "6.5" : "4.5"}
                  fill={hoveredChartNode?.id === "sem-3" ? "#2563EB" : "currentColor"}
                  stroke={hoveredChartNode?.id === "sem-3" ? "#F0F6FC" : "#2563EB"}
                  strokeWidth={hoveredChartNode?.id === "sem-3" ? "2.5" : "2"}
                  className={`transition-all duration-150 ${hoveredChartNode?.id === "sem-3" ? "filter drop-shadow-[0_0_8px_#2563EB]" : "text-white dark:text-[#0D1117]"}`}
                />
                <circle
                  cx="712"
                  cy="87"
                  r={hoveredChartNode?.id === "sem-4" ? "6.5" : "4.5"}
                  fill={hoveredChartNode?.id === "sem-4" ? "#2563EB" : "currentColor"}
                  stroke={hoveredChartNode?.id === "sem-4" ? "#F0F6FC" : "#2563EB"}
                  strokeWidth={hoveredChartNode?.id === "sem-4" ? "2.5" : "2"}
                  className={`transition-all duration-150 ${hoveredChartNode?.id === "sem-4" ? "filter drop-shadow-[0_0_8px_#2563EB]" : "text-white dark:text-[#0D1117]"}`}
                />
                <circle
                  cx="916"
                  cy="75"
                  r={hoveredChartNode?.id === "sem-5" ? "6.5" : "4.5"}
                  fill={hoveredChartNode?.id === "sem-5" ? "#2563EB" : "currentColor"}
                  stroke={hoveredChartNode?.id === "sem-5" ? "#F0F6FC" : "#2563EB"}
                  strokeWidth={hoveredChartNode?.id === "sem-5" ? "2.5" : "2"}
                  className={`transition-all duration-150 ${hoveredChartNode?.id === "sem-5" ? "filter drop-shadow-[0_0_8px_#2563EB]" : "text-white dark:text-[#0D1117]"}`}
                />
                <circle
                  cx="1120"
                  cy="71"
                  r={hoveredChartNode?.id === "sem-6" ? "6.5" : "4.5"}
                  fill={hoveredChartNode?.id === "sem-6" ? "#3FB950" : "currentColor"}
                  stroke={hoveredChartNode?.id === "sem-6" ? "#F0F6FC" : "#3FB950"}
                  strokeWidth={hoveredChartNode?.id === "sem-6" ? "2.5" : "2"}
                  className={`transition-all duration-150 ${hoveredChartNode?.id === "sem-6" ? "filter drop-shadow-[0_0_8px_#3FB950]" : "text-white dark:text-[#0D1117]"}`}
                />

                {/* X-AXIS LABELS */}
                <text x="100" y="246" textAnchor="middle" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="12" fontWeight={hoveredChartNode?.id === "sem-1" ? "700" : "500"} className={hoveredChartNode?.id === "sem-1" ? "fill-brand dark:fill-[#F0F6FC]" : "fill-slate-500 dark:fill-[#8D96A0]"}>Sem 1 (Fall 23)</text>
                <text x="304" y="246" textAnchor="middle" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="12" fontWeight={hoveredChartNode?.id === "sem-2" ? "700" : "500"} className={hoveredChartNode?.id === "sem-2" ? "fill-brand dark:fill-[#F0F6FC]" : "fill-slate-500 dark:fill-[#8D96A0]"}>Sem 2 (Spr 24)</text>
                <text x="508" y="246" textAnchor="middle" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="12" fontWeight={hoveredChartNode?.id === "sem-3" ? "700" : "500"} className={hoveredChartNode?.id === "sem-3" ? "fill-brand dark:fill-[#F0F6FC]" : "fill-slate-500 dark:fill-[#8D96A0]"}>Sem 3 (Fall 24)</text>
                <text x="712" y="246" textAnchor="middle" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="12" fontWeight={hoveredChartNode?.id === "sem-4" ? "700" : "500"} className={hoveredChartNode?.id === "sem-4" ? "fill-brand dark:fill-[#F0F6FC]" : "fill-slate-500 dark:fill-[#8D96A0]"}>Sem 4 (Spr 25)</text>
                <text x="916" y="246" textAnchor="middle" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="12" fontWeight={hoveredChartNode?.id === "sem-5" ? "700" : "500"} className={hoveredChartNode?.id === "sem-5" ? "fill-brand dark:fill-[#F0F6FC]" : "fill-slate-500 dark:fill-[#8D96A0]"}>Sem 5 (Fall 25)</text>
                <text x="1120" y="246" textAnchor="middle" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="12" fontWeight={hoveredChartNode?.id === "sem-6" ? "700" : "500"} className={hoveredChartNode?.id === "sem-6" ? "fill-emerald-600 dark:fill-[#3FB950]" : "fill-slate-500 dark:fill-[#8D96A0]"}>Sem 6 (Spring 26*)</text>
              </svg>

              {/* Floating Dynamic Tooltip with AnimatePresence (only visible when hovering a semester) */}
              <AnimatePresence>
                {hoveredChartNode && (
                  <motion.div 
                    key={hoveredChartNode.id}
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute top-2 bg-white/95 dark:bg-[#161B22]/95 backdrop-blur-md border border-brand/40 dark:border-[#2563EB]/60 rounded-xl p-3 shadow-xl dark:shadow-[0_12px_32px_rgba(0,0,0,0.8),0_0_20px_rgba(37, 99, 235,0.25)] text-left z-20 pointer-events-none"
                    style={{
                      left: hoveredChartNode.id === "sem-1" ? "8.33%" :
                            hoveredChartNode.id === "sem-2" ? "25.33%" :
                            hoveredChartNode.id === "sem-3" ? "42.33%" :
                            hoveredChartNode.id === "sem-4" ? "59.33%" :
                            hoveredChartNode.id === "sem-5" ? "76.33%" : "93.33%",
                      transform: hoveredChartNode.id === "sem-1" ? "translateX(-20%)" :
                                 hoveredChartNode.id === "sem-6" ? "translateX(-85%)" : "translateX(-50%)",
                    }}
                  >
                    <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200 dark:border-[#30363D]">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-[#3FB950]" />
                      <span className="font-manrope text-xs font-bold text-slate-900 dark:text-[#F0F6FC] whitespace-nowrap">
                        {hoveredChartNode.termName}
                      </span>
                      {hoveredChartNode.honorBadge && (
                        <span className="font-mono text-[9px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold ml-auto whitespace-nowrap">
                          {hoveredChartNode.honorBadge}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 font-mono text-xs">
                      <div>
                        <span className="text-slate-400 dark:text-[#8D96A0]">Term SGPA:</span>
                        <span className="text-brand dark:text-[#2563EB] font-bold ml-1.5">
                          {hoveredChartNode.sgpa.toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 dark:text-[#8D96A0]">Cumulative:</span>
                        <span className="text-slate-900 dark:text-[#F0F6FC] font-bold ml-1.5">
                          {hoveredChartNode.cgpa.toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 dark:text-[#8D96A0]">Credits:</span>
                        <span className="text-slate-700 dark:text-[#F0F6FC] ml-1.5 font-semibold">
                          {hoveredChartNode.credits.toFixed(1)} Cr
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 dark:text-[#8D96A0]">Standing:</span>
                        <span className="text-emerald-600 dark:text-emerald-400 ml-1.5 font-semibold">
                          {hoveredChartNode.ranking}
                        </span>
                      </div>
                    </div>
                    {/* Tooltip triangle tail */}
                    <div 
                      className="w-2.5 h-2.5 bg-white dark:bg-[#161B22] border-r border-b border-brand/40 dark:border-[#2563EB]/60 rotate-45 absolute -bottom-1.5"
                      style={{
                        left: hoveredChartNode.id === "sem-1" ? "25%" :
                              hoveredChartNode.id === "sem-6" ? "85%" : "50%",
                        transform: "translateX(-50%) rotate(45deg)",
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </SpotlightCard>
    </FadeIn>

      {/* ========================================================================= */}
      {/* 4. SEMESTER BREAKDOWN TABLE CARD                                          */}
      {/* ========================================================================= */}
      <FadeIn delay={0.2}>
        <SpotlightCard
          className="bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] hover:border-brand/40 dark:hover:border-[#2563EB]/60 rounded-3xl overflow-hidden shadow-xs transition-all duration-300 hover:shadow-[0_12px_32px_-4px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_0_35px_-5px_rgba(37, 99, 235,0.18)]"
          spotlightColor={SPOTLIGHT.wash}
          borderGlowColor={SPOTLIGHT.glow}
        >
          <div className="relative z-10">
          {/* Controls Bar: Semester Selector Tabs & Course Search */}
          <div className="p-3.5 sm:p-4 border-b border-slate-200 dark:border-[#30363D] flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-slate-50/50 dark:bg-[#0D1117]">
            {/* Semester Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 custom-scrollbar">
              <button
                type="button"
                onClick={() => setSelectedSemesterTab("all")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-manrope text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedSemesterTab === "all"
                    ? "bg-slate-100 dark:bg-[#161B22] border border-brand/60 dark:border-[#2563EB]/60 text-slate-900 dark:text-[#F0F6FC] shadow-xs"
                    : "text-slate-600 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-[#F0F6FC] hover:bg-slate-100 dark:hover:bg-[#161B22] border border-transparent"
                }`}
              >
                <span>All Courses</span>
                <span className="font-mono text-[10px] bg-slate-200 dark:bg-[#1C2128] text-slate-700 dark:text-[#8D96A0] px-1.5 py-0.5 rounded">
                  96.0 Cr
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedSemesterTab("sem-6")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-manrope text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedSemesterTab === "sem-6"
                    ? "bg-slate-100 dark:bg-[#161B22] border border-emerald-500/60 dark:border-[#3FB950]/60 text-slate-900 dark:text-[#F0F6FC] shadow-xs dark:shadow-[0_0_12px_rgba(63,185,80,0.2)]"
                    : "text-slate-600 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-[#F0F6FC] hover:bg-slate-100 dark:hover:bg-[#161B22] border border-transparent"
                }`}
              >
                <span>Sem 6: Spring 2026 (Active)</span>
                <span className="font-mono text-[10px] bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-[#3FB950] px-1.5 py-0.5 rounded border border-emerald-500/20">
                  Proj 3.85
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedSemesterTab("sem-5")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-manrope text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedSemesterTab === "sem-5"
                    ? "bg-slate-100 dark:bg-[#161B22] border border-brand/60 dark:border-[#2563EB]/60 text-slate-900 dark:text-[#F0F6FC] shadow-xs dark:shadow-[0_0_12px_rgba(37, 99, 235,0.2)]"
                    : "text-slate-600 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-[#F0F6FC] hover:bg-slate-100 dark:hover:bg-[#161B22] border border-transparent"
                }`}
              >
                <span>Sem 5: Fall 2025</span>
                <span className="font-mono text-[10px] bg-brand/10 text-brand dark:bg-[#2563EB]/20 dark:text-[#8A86FF] px-1.5 py-0.5 rounded border border-brand/20 dark:border-[#2563EB]/30">
                  SGPA 3.84
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedSemesterTab("sem-4")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-manrope text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedSemesterTab === "sem-4"
                    ? "bg-slate-100 dark:bg-[#161B22] border border-brand/60 dark:border-[#2563EB]/60 text-slate-900 dark:text-[#F0F6FC] shadow-xs dark:shadow-[0_0_12px_rgba(37, 99, 235,0.2)]"
                    : "text-slate-600 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-[#F0F6FC] hover:bg-slate-100 dark:hover:bg-[#161B22] border border-transparent"
                }`}
              >
                <span>Sem 4: Spring 2025</span>
                <span className="font-mono text-[10px] bg-slate-200 dark:bg-[#1C2128] text-slate-700 dark:text-[#8D96A0] px-1.5 py-0.5 rounded">
                  SGPA 3.81
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedSemesterTab("sem-3")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-manrope text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedSemesterTab === "sem-3"
                    ? "bg-slate-100 dark:bg-[#161B22] border border-brand/60 dark:border-[#2563EB]/60 text-slate-900 dark:text-[#F0F6FC] shadow-xs dark:shadow-[0_0_12px_rgba(37, 99, 235,0.2)]"
                    : "text-slate-600 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-[#F0F6FC] hover:bg-slate-100 dark:hover:bg-[#161B22] border border-transparent"
                }`}
              >
                <span>Sem 3: Fall 2024</span>
                <span className="font-mono text-[10px] bg-slate-200 dark:bg-[#1C2128] text-slate-700 dark:text-[#8D96A0] px-1.5 py-0.5 rounded">
                  SGPA 3.68
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedSemesterTab("sem-2")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-manrope text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedSemesterTab === "sem-2"
                    ? "bg-slate-100 dark:bg-[#161B22] border border-brand/60 dark:border-[#2563EB]/60 text-slate-900 dark:text-[#F0F6FC] shadow-xs dark:shadow-[0_0_12px_rgba(37, 99, 235,0.2)]"
                    : "text-slate-600 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-[#F0F6FC] hover:bg-slate-100 dark:hover:bg-[#161B22] border border-transparent"
                }`}
              >
                <span>Sem 2: Spring 2024</span>
                <span className="font-mono text-[10px] bg-slate-200 dark:bg-[#1C2128] text-slate-700 dark:text-[#8D96A0] px-1.5 py-0.5 rounded">
                  SGPA 3.70
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedSemesterTab("sem-1")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-manrope text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedSemesterTab === "sem-1"
                    ? "bg-slate-100 dark:bg-[#161B22] border border-brand/60 dark:border-[#2563EB]/60 text-slate-900 dark:text-[#F0F6FC] shadow-xs dark:shadow-[0_0_12px_rgba(37, 99, 235,0.2)]"
                    : "text-slate-600 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-[#F0F6FC] hover:bg-slate-100 dark:hover:bg-[#161B22] border border-transparent"
                }`}
              >
                <span>Sem 1: Fall 2023</span>
                <span className="font-mono text-[10px] bg-slate-200 dark:bg-[#1C2128] text-slate-700 dark:text-[#8D96A0] px-1.5 py-0.5 rounded">
                  SGPA 3.62
                </span>
              </button>
            </div>

            {/* Course Filter Search Input */}
            <div className="flex items-center bg-slate-100 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] rounded-lg px-2.5 py-1 w-full sm:w-64 focus-within:border-brand dark:focus-within:border-[#2563EB] transition-all">
              <Search className="w-3.5 h-3.5 text-slate-400 dark:text-[#8D96A0] mr-2 shrink-0" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter courses in this view..."
                className="bg-transparent border-0 p-0 text-slate-900 dark:text-[#F0F6FC] placeholder:text-slate-400 dark:placeholder:text-[#8D96A0] font-jakarta text-xs focus:ring-0 w-full outline-none"
              />
              {searchFilter && (
                <button
                  type="button"
                  onClick={() => setSearchFilter("")}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-[#F0F6FC]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* High-Precision Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-[#161B22] border-b border-slate-200 dark:border-[#30363D] font-mono text-[11px] text-slate-500 dark:text-[#8D96A0] uppercase tracking-wider">
                  <th scope="col" className="py-3 px-5 font-semibold">Course Code</th>
                  <th scope="col" className="py-3 px-5 font-semibold">Course Name</th>
                  <th scope="col" className="py-3 px-5 font-semibold text-right">Credits</th>
                  <th scope="col" className="py-3 px-5 font-semibold">Grade</th>
                  <th scope="col" className="py-3 px-5 font-semibold text-right">Grade Point</th>
                  <th scope="col" className="py-3 px-5 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#30363D]/60 text-xs">
                {filteredCourses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 dark:text-[#8D96A0] font-jakarta">
                      No courses match your filter query.
                    </td>
                  </tr>
                ) : (
                  filteredCourses.map((course) => {
                    return (
                      <tr
                        key={course.code + course.semester}
                        className="hover:bg-slate-50/80 dark:hover:bg-[#161B22]/80 transition-colors group"
                      >
                        {/* Course Code (JetBrains Mono) */}
                        <td className="py-3 px-5 font-mono font-bold text-brand dark:text-[#C3C1FF]">
                          {course.code}
                        </td>

                        {/* Course Name & Instructor */}
                        <td className="py-3 px-5 font-medium text-slate-900 dark:text-[#F0F6FC]">
                          <span>{course.name}</span>
                          <span className="block text-[11px] text-slate-400 dark:text-[#8D96A0] font-normal mt-0.5">
                            Instructor: {course.instructor} • {course.section}
                          </span>
                        </td>

                        {/* Credits */}
                        <td className="py-3 px-5 text-right font-mono text-slate-900 dark:text-[#F0F6FC] font-semibold">
                          {course.credits.toFixed(1)}
                        </td>

                        {/* Grade Badge */}
                        <td className="py-3 px-5">
                          {course.grade === "A+" ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded font-mono text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                              A+
                            </span>
                          ) : course.grade === "A" ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded font-mono text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/40 text-brand dark:text-[#8A86FF] border border-indigo-500/30">
                              A
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded font-mono text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                              {course.grade}
                            </span>
                          )}
                        </td>

                        {/* Grade Point */}
                        <td className="py-3 px-5 text-right font-mono font-bold text-slate-900 dark:text-[#F0F6FC]">
                          {course.gradePoint.toFixed(2)}
                        </td>

                        {/* Status */}
                        <td className="py-3 px-5 text-center">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-[#3FB950] shadow-[0_0_5px_#3FB950]" />
                            {course.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Summary Footer */}
          <div className="p-3.5 sm:p-4 bg-slate-50 dark:bg-[#161B22] border-t border-slate-200 dark:border-[#30363D] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-4 sm:gap-6 font-mono text-xs flex-wrap">
              <div>
                <span className="text-slate-500 dark:text-[#8D96A0]">Completed Credits:</span>
                <span className="text-slate-900 dark:text-[#F0F6FC] font-bold ml-1.5">
                  {tableSummary.totalCredits.toFixed(1)} Cr
                </span>
              </div>
              <div className="h-3.5 w-px bg-slate-300 dark:bg-[#30363D]" />
              <div>
                <span className="text-slate-500 dark:text-[#8D96A0]">Term SGPA:</span>
                <span className="text-brand dark:text-[#2563EB] font-bold ml-1.5">
                  {tableSummary.sgpa}
                </span>
              </div>
              <div className="hidden md:block h-3.5 w-px bg-slate-300 dark:bg-[#30363D]" />
              <div className="hidden md:flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>All Grade Prerequisites Met</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsTranscriptOpen(true)}
              className="inline-flex items-center gap-1 text-brand dark:text-[#2563EB] hover:text-brand-hover dark:hover:text-[#60A5FA] text-xs font-semibold transition-colors group cursor-pointer self-start sm:self-center"
            >
              <span>View Official Grade Sheet</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </SpotlightCard>
    </FadeIn>

      {/* ========================================================================= */}
      {/* 5. INTERACTIVE GPA SIMULATOR MODAL                                        */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isSimulatorOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-2xl bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] rounded-3xl p-6 shadow-2xl overflow-hidden relative"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 dark:border-[#30363D]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-brand/10 dark:bg-[#2563EB]/15 border border-brand/20 dark:border-[#2563EB]/30 flex items-center justify-center text-brand dark:text-[#2563EB]">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-manrope font-bold text-base text-slate-900 dark:text-[#F0F6FC]">
                      Interactive GPA Scenario Simulator
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-[#8D96A0]">
                      Adjust target grades for Spring 2026 courses to calculate projected SGPA and cumulative CGPA.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSimulatorOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-[#F0F6FC] hover:bg-slate-100 dark:hover:bg-[#161B22]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Simulation Result Callout Banner */}
              <div className="my-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-[10px] font-mono text-slate-400 dark:text-[#8D96A0] uppercase">
                    Projected SGPA
                  </div>
                  <div className="text-xl font-mono font-extrabold text-brand dark:text-[#2563EB] mt-0.5">
                    {simulationResults.projectedSGPA}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">15.0 Credits Term</div>
                </div>

                <div className="border-x border-slate-200 dark:border-[#30363D]">
                  <div className="text-[10px] font-mono text-slate-400 dark:text-[#8D96A0] uppercase">
                    New Cumulative CGPA
                  </div>
                  <div className="text-xl font-mono font-extrabold text-slate-900 dark:text-[#F0F6FC] mt-0.5">
                    {simulationResults.simulatedCGPA}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Base 96 + 15 = 111 Cr</div>
                </div>

                <div>
                  <div className="text-[10px] font-mono text-slate-400 dark:text-[#8D96A0] uppercase">
                    CGPA Trajectory
                  </div>
                  <div className={`text-xl font-mono font-extrabold mt-0.5 ${simulationResults.isPositive ? "text-emerald-500" : "text-amber-500"}`}>
                    {simulationResults.cgpaDelta}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">vs Current 3.78</div>
                </div>
              </div>

              {/* Course Grade Adjustments List */}
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                {simCourses.map((course, idx) => (
                  <div
                    key={course.code}
                    className="p-2.5 rounded-xl bg-slate-50/60 dark:bg-[#161B22]/70 border border-slate-200 dark:border-[#30363D] flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-mono font-bold text-brand dark:text-[#C3C1FF]">
                        {course.code}
                      </div>
                      <div className="text-slate-800 dark:text-[#F0F6FC] font-medium truncate max-w-[260px]">
                        {course.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {course.credits} Credits
                      </div>
                    </div>

                    {/* Grade Selector */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <select
                        value={course.grade}
                        onChange={(e) => updateSimGrade(idx, e.target.value as GradeScale)}
                        className="bg-white dark:bg-[#0D1117] border border-slate-300 dark:border-[#30363D] rounded-lg px-2.5 py-1 font-mono text-xs font-bold text-slate-900 dark:text-[#F0F6FC] focus:outline-none focus:border-brand dark:focus:border-[#2563EB]"
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
                ))}
              </div>

              {/* Modal Footer */}
              <div className="mt-5 pt-3 border-t border-slate-200 dark:border-[#30363D] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSimCourses(initialSimCourses)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-[#F0F6FC] font-mono text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Baseline</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsSimulatorOpen(false)}
                  className="px-4 py-2 rounded-xl bg-brand hover:bg-brand-hover dark:bg-[#2563EB] dark:hover:bg-[#5852ff] text-white font-semibold text-xs cursor-pointer shadow-sm active:scale-[0.98]"
                >
                  Done &amp; Close Simulator
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 6. UNOFFICIAL TRANSCRIPT PREVIEW MODAL                                    */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isTranscriptOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-3xl bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#30363D]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand/10 dark:bg-[#2563EB]/15 border border-brand/20 dark:border-[#2563EB]/30 flex items-center justify-center text-brand dark:text-[#2563EB]">
                    <School className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-manrope font-bold text-base text-slate-900 dark:text-[#F0F6FC]">
                      UniCampus Official Academic Grade Sheet
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-[#8D96A0]">
                      Office of the Controller of Examinations • Issued for Sakib Ahmed
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrintTranscript}
                    className="h-8 px-3 rounded-lg bg-brand dark:bg-[#2563EB] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer hover:bg-brand-hover"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsTranscriptOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-[#F0F6FC] hover:bg-slate-100 dark:hover:bg-[#161B22]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Student Metadata Box */}
              <div className="my-4 p-4 rounded-2xl bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
                <div>
                  <span className="text-slate-500 dark:text-[#8D96A0] block text-[10px] font-bold tracking-wider">STUDENT NAME</span>
                  <span className="text-slate-900 dark:text-[#F0F6FC] font-bold text-sm">Sakib Ahmed</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-[#8D96A0] block text-[10px] font-bold tracking-wider">STUDENT ID</span>
                  <span className="text-brand dark:text-[#8A86FF] font-bold text-sm">211-15-4424</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-[#8D96A0] block text-[10px] font-bold tracking-wider">PROGRAM</span>
                  <span className="text-slate-900 dark:text-[#F0F6FC] font-semibold text-sm">B.Sc. in CSE</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-[#8D96A0] block text-[10px] font-bold tracking-wider">CUMULATIVE CGPA</span>
                  <span className="text-emerald-600 dark:text-[#3FB950] font-bold text-sm">3.78 / 4.00</span>
                </div>
              </div>

              {/* Semester Selector Pill Bar in Modal */}
              <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
                  <button
                    type="button"
                    onClick={() => setTranscriptSemester("all")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      transcriptSemester === "all"
                        ? "bg-brand text-white dark:bg-[#2563EB] shadow-xs"
                        : "bg-slate-100 dark:bg-[#161B22] text-slate-600 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-[#F0F6FC] border border-slate-200 dark:border-[#30363D]"
                    }`}
                  >
                    All Semesters (Cumulative)
                  </button>
                  {semesterMilestones.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setTranscriptSemester(m.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer whitespace-nowrap ${
                        transcriptSemester === m.id
                          ? "bg-brand text-white dark:bg-[#2563EB] shadow-xs"
                          : "bg-slate-100 dark:bg-[#161B22] text-slate-600 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-[#F0F6FC] border border-slate-200 dark:border-[#30363D]"
                      }`}
                    >
                      {m.termShort}
                    </button>
                  ))}
                </div>

                {activeTranscriptMilestone && (
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="px-2 py-0.5 rounded bg-brand/10 dark:bg-[#2563EB]/20 text-brand dark:text-[#8A86FF] font-bold border border-brand/20 dark:border-[#2563EB]/30">
                      Term SGPA: {activeTranscriptMilestone.sgpa.toFixed(2)}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-[#161B22] text-slate-700 dark:text-[#C9D1D9] font-medium border border-slate-200 dark:border-[#30363D]">
                      {activeTranscriptMilestone.credits.toFixed(1)} Credits
                    </span>
                  </div>
                )}
              </div>

              {/* Course Records Table in Modal */}
              <div className="overflow-x-auto border border-slate-200 dark:border-[#30363D] rounded-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-[#161B22] font-mono text-[11px] text-slate-600 dark:text-[#8D96A0] uppercase border-b border-slate-200 dark:border-[#30363D]">
                      <th className="py-2.5 px-3 font-semibold">Code</th>
                      <th className="py-2.5 px-3 font-semibold">Course Title</th>
                      <th className="py-2.5 px-3 text-right font-semibold">Cr</th>
                      <th className="py-2.5 px-3 text-center font-semibold">Grade</th>
                      <th className="py-2.5 px-3 text-right font-semibold">Point</th>
                      <th className="py-2.5 px-3 text-center font-semibold">Semester</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-[#30363D]/60 font-mono">
                    {transcriptCourses.map((c) => (
                      <tr key={c.code + c.semester} className="hover:bg-slate-50/70 dark:hover:bg-[#161B22]/70 transition-colors">
                        <td className="py-2.5 px-3 font-bold text-brand dark:text-[#C3C1FF]">{c.code}</td>
                        <td className="py-2.5 px-3 font-sans font-medium text-slate-900 dark:text-[#F0F6FC]">{c.name}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-800 dark:text-[#E6EDF3]">{c.credits.toFixed(1)}</td>
                        <td className="py-2.5 px-3 text-center font-bold">
                          {c.grade === "A+" ? (
                            <span className="text-emerald-600 dark:text-[#3FB950]">{c.grade}</span>
                          ) : c.grade.startsWith("A") ? (
                            <span className="text-brand dark:text-[#8A86FF]">{c.grade}</span>
                          ) : (
                            <span className="text-amber-600 dark:text-[#E3B341]">{c.grade}</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-900 dark:text-[#F0F6FC]">{c.gradePoint.toFixed(2)}</td>
                        <td className="py-2.5 px-3 text-center text-[10px] text-slate-500 dark:text-[#8D96A0] uppercase">
                          {c.semester.replace("sem-", "Sem ")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Institutional Sign-off footer */}
              <div className="mt-5 pt-4 border-t border-slate-200 dark:border-[#30363D] flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-slate-500 dark:text-[#8D96A0]">Status: </span>
                  <span className="text-emerald-600 dark:text-[#3FB950] font-bold">Official Digital Copy Verified</span>
                </div>
                <div className="text-slate-500 dark:text-[#8D96A0] font-medium">
                  <span>Dean of Computer Sciences &amp; Engineering</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
