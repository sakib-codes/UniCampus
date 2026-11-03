"use client";

import { useState, useMemo, useRef, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  Search, 
  FileText, 
  Pin, 
  Paperclip, 
  Calendar, 
  CheckCircle2, 
  Bookmark, 
  BookmarkCheck, 
  Printer, 
  Download, 
  ArrowRight, 
  ShieldCheck, 
  GraduationCap, 
  Building2, 
  Sparkles, 
  AlertTriangle, 
  Clock, 
  FileSpreadsheet, 
  Share2, 
  Check, 
  ExternalLink,
  ChevronRight,
  Info
} from "lucide-react";
import { themeTokens, SPOTLIGHT } from "@/lib/theme";
import SpotlightCard from "@/components/bits/SpotlightCard";
import { adminService } from "@/lib/services/adminService";

export interface NoticeItem {
  id: string;
  refNo: string;
  category: "EXAM SCHEDULE" | "ACADEMIC" | "EVENTS" | "ADMINISTRATION";
  categoryKey: "exam" | "academic" | "events" | "admin";
  categoryColor: {
    bg: string;
    text: string;
    border: string;
  };
  title: string;
  summary: string;
  body: string[];
  author: string;
  authorDesignation: string;
  authorCouncil: string;
  department: string;
  dateStr: string;
  timeStr: string;
  academicSession: string;
  targetAudience: string;
  attachmentName?: string;
  attachmentSize?: string;
  pinnedUrgent?: boolean;
  sha256: string;
  protocols?: {
    title: string;
    items: string[];
  };
  scheduleTable?: {
    title: string;
    headers: string[];
    rows: {
      code: string;
      title: string;
      col1: string;
      col2: string;
      col3: string;
    }[];
  };
}

export const OFFICIAL_NOTICES: NoticeItem[] = [
  {
    id: "not-exam-108",
    refNo: "UC/COE/2026/108",
    category: "EXAM SCHEDULE",
    categoryKey: "exam",
    categoryColor: {
      bg: "bg-[#2563EB]/15 dark:bg-[#2563EB]/20",
      text: "text-[#2563EB] dark:text-[#60A5FA]",
      border: "border-[#2563EB]/30",
    },
    title: "Final Examination Schedule Spring 2026 Released",
    summary: "Mandatory clearance certification and physical admit cards are required for all 3000 & 4000 series course enrollments.",
    body: [
      "It is hereby notified for all undergraduate scholars of the Department of Computer Science & Engineering that the Semester Final Examinations (Spring 2026) will commence from November 12, 2026 in accordance with the routine delineated below.",
      "Scholars are advised to cross-examine their enrolled course codes, exam halls, and designated seat rows. Any clash in the examination timetable must be submitted to the Controller's Office within 72 hours of publication."
    ],
    author: "Dr. M. Rezaul Karim",
    authorDesignation: "Controller of Examinations",
    authorCouncil: "UniCampus Academic Council & Exam Directorate",
    department: "Office of the Controller of Examinations",
    dateStr: "October 22, 2026",
    timeStr: "Today, 10:30 AM",
    academicSession: "Spring Semester 2026",
    targetAudience: "All Undergrad Departments (CSE, EEE, BBA)",
    attachmentName: "PDF • 1.4 MB",
    attachmentSize: "1.4 MB",
    pinnedUrgent: true,
    sha256: "8f9b4d17c3e5a201...a12c4e88",
    protocols: {
      title: "MANDATORY EXAM HALL PROTOCOLS",
      items: [
        "Physical Admit Cards and Student Identity Smart Cards must be produced upon entry.",
        "Programmable scientific calculators and smart devices are strictly restricted unless authorized by course instructor.",
        "Reporting time is strictly 30 minutes prior to scheduled session. Examination hall gates lock 15 minutes post-commencement."
      ]
    },
    scheduleTable: {
      title: "Scheduled Course Assessments",
      headers: ["Course Code & Title", "Date", "Time Slot", "Venue Hall"],
      rows: [
        {
          code: "CSE-3101",
          title: "Design & Analysis of Algorithms",
          col1: "Nov 12, 2026",
          col2: "10:00 AM - 01:00 PM",
          col3: "Hall A-102"
        },
        {
          code: "CSE-3205",
          title: "Software Engineering & System Design",
          col1: "Nov 15, 2026",
          col2: "10:00 AM - 01:00 PM",
          col3: "Hall B-204"
        },
        {
          code: "CSE-3103",
          title: "Database Management Systems",
          col1: "Nov 18, 2026",
          col2: "02:00 PM - 05:00 PM",
          col3: "Hall A-105"
        }
      ]
    }
  },
  {
    id: "not-reg-089",
    refNo: "UC/REG/2026/089",
    category: "ACADEMIC",
    categoryKey: "academic",
    categoryColor: {
      bg: "bg-emerald-500/10 dark:bg-emerald-500/15",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-500/30",
    },
    title: "Course Advising & Pre-Registration Window for Fall 2026",
    summary: "All level-3 engineering scholars must finalize their elective tracks via ERP portal prior to slot freeze deadline.",
    body: [
      "All continuing undergraduate scholars of 3rd and 4th academic years are hereby informed that course pre-registration for the Fall 2026 semester will open according to the batch slots scheduled below.",
      "Scholars must review their completed credit tallies and prerequisite clearances before submitting their registration request. Academic advisors will be available during physical consultation hours for curriculum exceptions."
    ],
    author: "Prof. Shamsul Alam",
    authorDesignation: "Office of the Registrar",
    authorCouncil: "Admissions & Records Directorate",
    department: "Office of the Registrar",
    dateStr: "October 20, 2026",
    timeStr: "Oct 20, 2026",
    academicSession: "Fall Semester 2026",
    targetAudience: "Continuing Undergraduate Scholars (Batches 2021 - 2023)",
    attachmentName: "Form Link • ERP Guideline",
    attachmentSize: "0.8 MB",
    pinnedUrgent: false,
    sha256: "3c881fa4b7e901dc...e901ab33",
    protocols: {
      title: "PRE-REGISTRATION CRITERIA & POLICY",
      items: [
        "Maximum allowable credit load: 21 Credits for regular status; 24 Credits for CGPA ≥ 3.75.",
        "Prerequisites will be auto-validated by the ERP system; missing prerequisite courses require advisor waiver.",
        "Pre-registration slot freezes automatically at 05:00 PM on the designated batch day."
      ]
    },
    scheduleTable: {
      title: "Advising Timeline by Batch",
      headers: ["Batch / Cohort", "Date", "Window Time", "Portal Status"],
      rows: [
        {
          code: "Batch 2021",
          title: "Level 4 / Senior Scholars",
          col1: "Oct 28 - Oct 30, 2026",
          col2: "09:00 AM - 05:00 PM",
          col3: "Active Window"
        },
        {
          code: "Batch 2022",
          title: "Level 3 / Junior Scholars",
          col1: "Nov 01 - Nov 03, 2026",
          col2: "09:00 AM - 05:00 PM",
          col3: "Active Window"
        },
        {
          code: "Batch 2023",
          title: "Level 2 / Sophomore Scholars",
          col1: "Nov 04 - Nov 05, 2026",
          col2: "09:00 AM - 05:00 PM",
          col3: "Upcoming"
        }
      ]
    }
  },
  {
    id: "not-hack-044",
    refNo: "UC/CSE/2026/044",
    category: "EVENTS",
    categoryKey: "events",
    categoryColor: {
      bg: "bg-amber-500/10 dark:bg-amber-500/15",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-500/30",
    },
    title: "Intra-University Hackathon & AI Showcase 2026 Registration Open",
    summary: "48-hour sprint focusing on Large Multimodal Systems, Edge AI robotics, and verifiable blockchain smart contracts.",
    body: [
      "Department of Computer Science & Engineering cordially invites multidisciplinary student innovators to participate in the flagship Intra-University Hackathon & AI Showcase 2026.",
      "The competition includes three tracks, mentorship from industry architects, and a total cash pool of $5,000 for top prototyping solutions."
    ],
    author: "Dr. Farhana Khan",
    authorDesignation: "Convenor, CSE Society",
    authorCouncil: "Department of Computer Science & Engineering",
    department: "Dept. of CSE",
    dateStr: "October 18, 2026",
    timeStr: "Oct 18, 2026",
    academicSession: "Spring 2026 Techfest",
    targetAudience: "All Engineering & Computing Students",
    attachmentName: "Prize Pool $5,000 • PDF",
    attachmentSize: "2.1 MB",
    pinnedUrgent: false,
    sha256: "7e2a9b31cd5e4402...ff3388a1",
    protocols: {
      title: "HACKATHON PARTICIPATION RULES",
      items: [
        "Teams must comprise 3 to 4 members with at least one member from CSE.",
        "All code repositories must be initialized from the official competition GitHub classroom template.",
        "Deployments must run on edge microcontrollers or live accessible cloud links during final jury demonstration."
      ]
    },
    scheduleTable: {
      title: "Event Milestones & Submission Deadlines",
      headers: ["Milestone Phase", "Target Date", "Time Slot", "Platform / Venue"],
      rows: [
        {
          code: "Phase 1",
          title: "Team Registration & Abstract Submission",
          col1: "Nov 05, 2026",
          col2: "11:59 PM (Hard Lock)",
          col3: "Online Portal"
        },
        {
          code: "Phase 2",
          title: "Preliminary Shortlisting & Pitch",
          col1: "Nov 08, 2026",
          col2: "02:00 PM - 06:00 PM",
          col3: "Virtual Screening"
        },
        {
          code: "Phase 3",
          title: "Grand 48-Hour On-Campus Hackathon",
          col1: "Nov 20 - Nov 22, 2026",
          col2: "Continuous Sprint",
          col3: "Innovation Hub Lab 4"
        }
      ]
    }
  },
  {
    id: "not-trn-021",
    refNo: "UC/TRN/2026/021",
    category: "ADMINISTRATION",
    categoryKey: "admin",
    categoryColor: {
      bg: "bg-slate-500/10 dark:bg-slate-500/15",
      text: "text-slate-600 dark:text-slate-300",
      border: "border-slate-500/30",
    },
    title: "Updated Campus Shuttle Bus Timings for Evening Lab Batches",
    summary: "Route 3 and Route 7 schedules have been extended up to 9:30 PM to facilitate capstone research teams.",
    body: [
      "In response to extended engineering laboratory schedules and senior capstone requirements, the Transport Operations Directorate has revised departure timings for campus shuttle buses effective immediately.",
      "Students commuting on evening routes are requested to verify their pickup points and board with verified RFID campus cards."
    ],
    author: "Engr. Tariq Hasan",
    authorDesignation: "Director of Transport Operations",
    authorCouncil: "University Administrative & Logistic Services",
    department: "Transport Division",
    dateStr: "October 15, 2026",
    timeStr: "Oct 15, 2026",
    academicSession: "Ongoing Term 2026",
    targetAudience: "Campus Commuters & Evening Laboratory Students",
    attachmentName: "Route Maps • PDF",
    attachmentSize: "3.4 MB",
    pinnedUrgent: false,
    sha256: "1f48bc29701aef42...9902bd81",
    protocols: {
      title: "CAMPUS FLEET TRANSIT REGULATIONS",
      items: [
        "Valid University ID Smart Card must be tapped at the onboard NFC scanner.",
        "Seating is allocated on a first-come, first-served basis; priority seating reserved for female scholars.",
        "Real-time GPS telemetry is viewable on the UniCampus Transport Tracker mobile interface."
      ]
    },
    scheduleTable: {
      title: "Evening Shuttle Route Matrix",
      headers: ["Transit Route", "Departure Days", "Evening Departures", "Pickup Station"],
      rows: [
        {
          code: "Route 3",
          title: "Campus to City Center Express",
          col1: "Daily (Sun - Thu)",
          col2: "07:30 PM & 09:30 PM",
          col3: "East Gate Bay 2"
        },
        {
          code: "Route 7",
          title: "Campus to North Suburb Transit",
          col1: "Daily (Sun - Thu)",
          col2: "08:00 PM & 09:30 PM",
          col3: "Main Terminal"
        },
        {
          code: "Route 1",
          title: "Campus to Central Railway Station",
          col1: "Daily (Sun - Thu)",
          col2: "06:30 PM, 08:30 PM, 10:00 PM",
          col3: "East Gate Bay 1"
        }
      ]
    }
  }
];

export function NoticeboardContent({ initialNoticeId }: { initialNoticeId?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const readerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const queryId = searchParams.get("id") || initialNoticeId || "not-exam-108";
  
  const [selectedNoticeId, setSelectedNoticeId] = useState<string>(queryId);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(["not-exam-108"]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Sync selected ID when URL query changes
  useEffect(() => {
    if (queryId && queryId !== selectedNoticeId) {
      setSelectedNoticeId(queryId);
    }
  }, [queryId]);

  // Keyboard shortcut listener: "/" to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter notices based on category and search query
  const filteredNotices = useMemo(() => {
    return OFFICIAL_NOTICES.filter((notice) => {
      // Category filter
      if (activeCategory === "Urgent") {
        if (!notice.pinnedUrgent) return false;
      } else if (activeCategory === "Academic") {
        if (notice.categoryKey !== "academic") return false;
      } else if (activeCategory === "Exam Schedule") {
        if (notice.categoryKey !== "exam") return false;
      } else if (activeCategory === "Events") {
        if (notice.categoryKey !== "events") return false;
      } else if (activeCategory === "Administration") {
        if (notice.categoryKey !== "admin") return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = notice.title.toLowerCase().includes(q);
        const inRef = notice.refNo.toLowerCase().includes(q);
        const inAuthor = notice.author.toLowerCase().includes(q);
        const inDept = notice.department.toLowerCase().includes(q);
        const inBody = notice.body.some((p) => p.toLowerCase().includes(q));
        return inTitle || inRef || inAuthor || inDept || inBody;
      }

      return true;
    });
  }, [activeCategory, searchQuery]);

  // Selected Notice Object
  const activeNotice = useMemo(() => {
    return (
      OFFICIAL_NOTICES.find((n) => n.id === selectedNoticeId) ||
      OFFICIAL_NOTICES[0]
    );
  }, [selectedNoticeId]);

  const handleSelectNotice = (id: string) => {
    setSelectedNoticeId(id);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("id", id);
      window.history.replaceState({}, "", url.toString());
    }
  };

  const handleReadOfficialCircular = () => {
    handleSelectNotice("not-exam-108");
    if (readerRef.current) {
      readerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleDownloadPDF = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setDownloadSuccess(true);

      // Create official document text blob
      const content = `=======================================================
OFFICE OF THE CONTROLLER OF EXAMINATIONS • UNICAMPUS
Official Institutional Circular
=======================================================
Reference Number: ${activeNotice.refNo}
Date of Release : ${activeNotice.dateStr}
Academic Term   : ${activeNotice.academicSession}
Issued By       : ${activeNotice.author} (${activeNotice.authorDesignation})
Department      : ${activeNotice.department}
Verification    : Authenticated via UniCampus Digital Ledger
SHA-256 Digest  : ${activeNotice.sha256}
=======================================================

TITLE: ${activeNotice.title}

STATEMENT OF CIRCULAR:
${activeNotice.body.join("\n\n")}

${activeNotice.protocols ? `\n${activeNotice.protocols.title}:\n` + activeNotice.protocols.items.map((i, idx) => `  ${idx + 1}. ${i}`).join("\n") : ""}

${activeNotice.scheduleTable ? `\n${activeNotice.scheduleTable.title.toUpperCase()}:\n` + activeNotice.scheduleTable.rows.map(r => `  - [${r.code}] ${r.title} | Date: ${r.col1} | Slot: ${r.col2} | Venue: ${r.col3}`).join("\n") : ""}

=======================================================
Digitally Signed by:
${activeNotice.author}
${activeNotice.authorDesignation}
${activeNotice.authorCouncil}
=======================================================`;

      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${activeNotice.refNo.replace(/\//g, "_")}_Official_Circular.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => setDownloadSuccess(false), 3000);
    }, 900);
  };

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const categories = [
    { label: "All Notices", key: "All" },
    { label: "Academic", key: "Academic" },
    { label: "Exam Schedule", key: "Exam Schedule" },
    { label: "Events", key: "Events" },
    { label: "Administration", key: "Administration" },
    { label: "Urgent Notices", key: "Urgent", isUrgent: true },
  ];

  return (
    <div className="w-full space-y-6 pb-20 select-none">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & FILTER BAR                                                */}
      {/* ========================================================================= */}
      <section className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-[28px] font-manrope font-extrabold text-slate-900 dark:text-[#F0F6FC] tracking-[-0.02em] leading-tight">
                Campus Noticeboard
              </h1>
              <p className="text-[14px] text-slate-500 dark:text-[#8D96A0] mt-1 font-normal">
                Official academic notifications, circulars, and departmental announcements.
              </p>
            </div>

            {/* Dynamic Search Bar */}
            <div className="w-full md:w-96 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-[#6E747D]" />
              <input
                ref={searchInputRef}
                type="text"
                aria-label="Search notices"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notices by title, ref no, or department..."
                className="w-full h-10 pl-10 pr-12 bg-white dark:bg-[#161B22] border border-slate-300 dark:border-[#30363D] rounded-xl text-xs sm:text-sm text-slate-900 dark:text-[#F0F6FC] placeholder:text-slate-400 dark:placeholder:text-[#6E747D] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all shadow-xs"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] text-[10px] font-mono text-slate-400 dark:text-[#6E747D]">
                  /
                </kbd>
              </div>
            </div>
          </div>

          {/* Filter Pills Row */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-[#30363D]/40">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? "bg-[#2563EB] text-white shadow-xs font-bold"
                      : cat.isUrgent
                      ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/15 border border-rose-500/25"
                      : "bg-white dark:bg-[#0D1117] text-slate-600 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-[#F0F6FC] hover:bg-slate-100 dark:hover:bg-[#161B22] border border-slate-200 dark:border-[#30363D]"
                  }`}
                >
                  {cat.isUrgent && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                    </span>
                  )}
                  {cat.label}
                </button>
              );
            })}
          </div>
        </section>

      {/* ========================================================================= */}
      {/* 2. PINNED URGENT NOTICE BANNER                                            */}
      {/* ========================================================================= */}
        <section className="relative overflow-hidden rounded-2xl bg-rose-500/[0.08] dark:bg-rose-500/[0.07] border border-rose-500/30 p-4 sm:p-5 px-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[0_0_24px_-4px_rgba(248,81,73,0.12)]">
          <div className="flex items-start gap-4">
            <div className="mt-1 w-9 h-9 rounded-xl bg-rose-500/15 dark:bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-600 dark:text-rose-400 text-[10px] font-mono font-bold tracking-wider uppercase border border-rose-500/35">
                  PINNED URGENT
                </span>
                <span className="text-xs font-mono text-slate-500 dark:text-[#8D96A0]">
                  Published Oct 22, 2026 • Ref: UC/COE/2026/108
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-manrope font-bold text-slate-900 dark:text-[#F0F6FC] leading-snug">
                Final Examination Schedule Spring 2026 Released — Verify Exam Hall &amp; Seat Allocation
              </h2>
            </div>
          </div>

          <button
            onClick={handleReadOfficialCircular}
            className="self-start md:self-center flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#161B22] text-slate-900 dark:text-[#F0F6FC] border border-rose-500/40 hover:bg-slate-100 dark:hover:bg-[#21262D] transition-colors shrink-0 text-xs sm:text-sm font-semibold shadow-xs cursor-pointer group"
          >
            <span>Read Official Circular</span>
            <ArrowRight className="w-4 h-4 text-rose-500 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </section>

      {/* ========================================================================= */}
      {/* 3. MASTER-DETAIL SPLIT WORKSPACE (Feed 42% / Reader 58%)                  */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-12 gap-6 items-start">
        {/* ================= LEFT COLUMN: SCROLLABLE FEED LIST ================= */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-[#8D96A0] font-semibold">
              Feed Archive ({filteredNotices.length} Available)
            </span>
            <span className="text-xs font-mono text-slate-500 dark:text-[#8D96A0] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Syncing
            </span>
          </div>

          {filteredNotices.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-[#0D1117] rounded-2xl border border-slate-200 dark:border-[#30363D]">
              <FileText className="w-10 h-10 text-slate-400 dark:text-[#6E747D] mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-800 dark:text-[#F0F6FC]">
                No announcements match this filter
              </p>
              <button
                onClick={() => {
                  setActiveCategory("All");
                  setSearchQuery("");
                }}
                className="mt-3 text-xs text-[#2563EB] hover:underline font-semibold"
              >
                Reset filters
              </button>
            </div>
          ) : (
            filteredNotices.map((notice) => {
              const isSelected = selectedNoticeId === notice.id;

              return (
                <article
                  key={notice.id}
                  onClick={() => handleSelectNotice(notice.id)}
                  className={`p-4 sm:p-5 rounded-2xl cursor-pointer transition-all duration-200 flex flex-col gap-3 relative border ${
                    isSelected
                      ? "bg-white dark:bg-[#161B22] border-[#2563EB] shadow-[0_0_20px_-3px_rgba(37, 99, 235,0.22)]"
                      : "bg-white dark:bg-[#0D1117] border-slate-200 dark:border-[#30363D] hover:border-slate-300 dark:hover:border-[#6E747D]/80 hover:bg-slate-50 dark:hover:bg-[#161B22]/60"
                  }`}
                >
                  {/* Left Active Indicator Bar */}
                  {isSelected && (
                    <div className="absolute left-0 top-3 bottom-3 w-1 bg-[#2563EB] rounded-r-md"></div>
                  )}

                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold tracking-wider uppercase border ${notice.categoryColor.bg} ${notice.categoryColor.text} ${notice.categoryColor.border}`}
                    >
                      {notice.category}
                    </span>
                    <span className="text-xs font-mono text-slate-400 dark:text-[#6E747D]">
                      {notice.timeStr}
                    </span>
                  </div>

                  <h3
                    className={`text-sm sm:text-base font-manrope font-bold leading-snug transition-colors ${
                      isSelected
                        ? "text-[#2563EB] dark:text-[#60A5FA]"
                        : "text-slate-900 dark:text-[#F0F6FC]"
                    }`}
                  >
                    {notice.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-[#8D96A0] line-clamp-2 leading-relaxed font-normal">
                    {notice.summary}
                  </p>

                  <div className="flex items-center justify-between pt-2.5 border-t border-slate-200 dark:border-[#30363D]/60 text-xs">
                    <span className="text-slate-500 dark:text-[#8D96A0] flex items-center gap-1.5 font-medium truncate max-w-[260px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]"></span>
                      {notice.department}
                    </span>

                    {notice.attachmentName && (
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-[#1C2128] border border-slate-200 dark:border-[#30363D] text-[11px] font-mono text-slate-700 dark:text-[#F0F6FC] flex items-center gap-1 shrink-0">
                        <Paperclip className="w-3 h-3 text-[#2563EB]" />
                        {notice.attachmentName}
                      </span>
                    )}
                  </div>
                </article>
              );
            })
          )}
        </div>

        {/* ================= RIGHT COLUMN: STICKY OFFICIAL CIRCULAR READER ================= */}
        <div
          ref={readerRef}
          className="col-span-12 lg:col-span-7 lg:sticky lg:top-20 bg-white dark:bg-[#0D1117] rounded-3xl border border-slate-200 dark:border-[#30363D] overflow-hidden shadow-xl relative"
        >
          {/* Background University Seal Watermark */}
          <div className="absolute right-4 top-20 pointer-events-none opacity-[0.03] select-none">
            <GraduationCap className="w-72 h-72 text-slate-400 dark:text-white" />
          </div>

          {/* Reader Top Utility Toolbar */}
          <div className="px-6 py-3.5 bg-slate-50 dark:bg-[#161B22] border-b border-slate-200 dark:border-[#30363D] flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono text-[#2563EB] bg-[#2563EB]/10 dark:bg-[#2563EB]/20 px-2.5 py-1 rounded-md border border-[#2563EB]/30 font-semibold">
                Ref: {activeNotice.refNo}
              </span>
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/15 px-2.5 py-1 rounded-md border border-emerald-500/30 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Signed &amp; Sealed
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleBookmark(activeNotice.id)}
                title={
                  bookmarkedIds.includes(activeNotice.id)
                    ? "Remove Bookmark"
                    : "Bookmark Notice"
                }
                className="p-2 rounded-xl bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] text-slate-600 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-[#F0F6FC] hover:bg-slate-100 dark:hover:bg-[#1C2128] transition-colors cursor-pointer shadow-xs"
              >
                {bookmarkedIds.includes(activeNotice.id) ? (
                  <BookmarkCheck className="w-4 h-4 text-[#2563EB]" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </button>

              <button
                onClick={handlePrint}
                title="Print Official Circular"
                className="p-2 rounded-xl bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] text-slate-600 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-[#F0F6FC] hover:bg-slate-100 dark:hover:bg-[#1C2128] transition-colors cursor-pointer shadow-xs"
              >
                <Printer className="w-4 h-4" />
              </button>

              <button
                onClick={handleShare}
                title="Share Notice Link"
                className="p-2 rounded-xl bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] text-slate-600 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-[#F0F6FC] hover:bg-slate-100 dark:hover:bg-[#1C2128] transition-colors cursor-pointer shadow-xs"
              >
                {copiedShare ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Share2 className="w-4 h-4" />
                )}
              </button>

              <button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.98] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>
                  {isDownloading
                    ? "Generating..."
                    : downloadSuccess
                    ? "Downloaded"
                    : `Download PDF (${activeNotice.attachmentSize || "1.4 MB"})`}
                </span>
              </button>
            </div>
          </div>

          {/* Official Document Letterhead & Content Container */}
          <div className="p-6 sm:p-8 flex flex-col gap-6 relative z-10">
            {/* Formal University Letterhead */}
            <div className="text-center pb-6 border-b border-slate-200 dark:border-[#30363D] flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-[#161B22] border border-[#2563EB]/30 flex items-center justify-center text-[#2563EB] mb-3 shadow-xs">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-slate-500 dark:text-[#8D96A0] font-bold">
                {activeNotice.department.toUpperCase()} • UNICAMPUS
              </span>
              <h2 className="text-xl sm:text-2xl font-manrope font-extrabold text-slate-900 dark:text-[#F0F6FC] mt-1.5 leading-snug">
                {activeNotice.title}
              </h2>
              <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-4 mt-2.5 text-xs font-mono text-slate-400 dark:text-[#6E747D]">
                <span>Date: {activeNotice.dateStr}</span>
                <span>•</span>
                <span>Session: {activeNotice.academicSession}</span>
                <span>•</span>
                <span>Target: {activeNotice.targetAudience}</span>
              </div>
            </div>

            {/* Document Body Paragraphs */}
            <div className="flex flex-col gap-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
              {activeNotice.body.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}

              {/* Policy / Protocol Callout Box */}
              {activeNotice.protocols && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#161B22] border-l-4 border-[#2563EB] border-t border-r border-b border-slate-200 dark:border-[#30363D] flex flex-col gap-2 shadow-xs">
                  <span className="text-xs font-mono text-[#2563EB] font-bold flex items-center gap-1.5 uppercase">
                    <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
                    {activeNotice.protocols.title}
                  </span>
                  <ul className="list-disc list-inside text-xs sm:text-sm text-slate-800 dark:text-[#F0F6FC] space-y-1.5 font-normal">
                    {activeNotice.protocols.items.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Formatted Schedule Table */}
              {activeNotice.scheduleTable && (
                <div className="mt-2 flex flex-col gap-2.5">
                  <span className="text-xs font-manrope font-bold text-slate-900 dark:text-[#F0F6FC] uppercase tracking-wider">
                    {activeNotice.scheduleTable.title}
                  </span>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-[#30363D] bg-white dark:bg-[#161B22]/70 shadow-xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-100 dark:bg-[#1C2128] border-b border-slate-200 dark:border-[#30363D] text-[11px] font-mono text-slate-500 dark:text-[#8D96A0] uppercase tracking-wider">
                          {activeNotice.scheduleTable.headers.map((h, idx) => (
                            <th key={idx} className="py-2.5 px-4 font-semibold">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-[#30363D]/60 text-xs sm:text-sm">
                        {activeNotice.scheduleTable.rows.map((row, idx) => (
                          <tr
                            key={idx}
                            className="hover:bg-slate-50 dark:hover:bg-[#1C2128]/50 transition-colors"
                          >
                            <td className="py-3 px-4 font-semibold text-slate-900 dark:text-[#F0F6FC]">
                              <span className="text-[#2563EB] font-mono text-xs block">
                                {row.code}
                              </span>
                              {row.title}
                            </td>
                            <td className="py-3 px-4 text-slate-500 dark:text-[#8D96A0] font-mono text-xs whitespace-nowrap">
                              {row.col1}
                            </td>
                            <td className="py-3 px-4 text-slate-500 dark:text-[#8D96A0] font-mono text-xs whitespace-nowrap">
                              {row.col2}
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] text-xs font-mono text-slate-900 dark:text-[#F0F6FC] whitespace-nowrap inline-block">
                                {row.col3}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Sign-Off Footer & Seal Verification Block */}
            <div className="mt-4 pt-6 border-t border-slate-200 dark:border-[#30363D] flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
              {/* Verification Badging */}
              <div className="flex items-center gap-3">
                <div className="w-13 h-13 rounded-xl bg-slate-100 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] p-1.5 flex items-center justify-center shrink-0">
                  {/* Digital QR Code Pattern representation */}
                  <div className="grid grid-cols-4 gap-0.5 w-full h-full p-1 bg-slate-900/10 dark:bg-white/10 rounded">
                    <div className="bg-[#2563EB] rounded-xs"></div>
                    <div className="bg-[#2563EB]/40 rounded-xs"></div>
                    <div className="bg-[#2563EB] rounded-xs"></div>
                    <div className="bg-[#2563EB]/20 rounded-xs"></div>
                    <div className="bg-[#2563EB]/30 rounded-xs"></div>
                    <div className="bg-[#2563EB] rounded-xs"></div>
                    <div className="bg-[#2563EB]/60 rounded-xs"></div>
                    <div className="bg-[#2563EB] rounded-xs"></div>
                    <div className="bg-[#2563EB] rounded-xs"></div>
                    <div className="bg-[#2563EB]/20 rounded-xs"></div>
                    <div className="bg-[#2563EB] rounded-xs"></div>
                    <div className="bg-[#2563EB]/50 rounded-xs"></div>
                    <div className="bg-[#2563EB]/40 rounded-xs"></div>
                    <div className="bg-[#2563EB] rounded-xs"></div>
                    <div className="bg-[#2563EB]/20 rounded-xs"></div>
                    <div className="bg-[#2563EB] rounded-xs"></div>
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    VERIFIED OFFICIAL CIRCULAR
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 dark:text-[#6E747D]">
                    Sha-256: {activeNotice.sha256}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-[#8D96A0]">
                    Authenticated by UniCampus Cloud Ledger
                  </span>
                </div>
              </div>

              {/* Official Digital Signature */}
              <div className="flex flex-col items-start md:items-end">
                <div className="h-8 mb-1 flex items-end">
                  <span className="font-serif italic text-[#2563EB] text-lg font-bold tracking-wider select-none border-b border-[#2563EB]/40 pb-0.5">
                    {activeNotice.author}
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-manrope font-bold text-slate-900 dark:text-[#F0F6FC]">
                  {activeNotice.author}
                </span>
                <span className="text-xs font-mono text-slate-500 dark:text-[#8D96A0]">
                  {activeNotice.authorDesignation}
                </span>
                <span className="text-[10px] font-mono text-slate-400 dark:text-[#6E747D]">
                  {activeNotice.authorCouncil}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NoticesPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full py-16 text-center text-slate-400 dark:text-[#8D96A0] font-mono text-sm">
          Loading UniCampus Noticeboard...
        </div>
      }
    >
      <NoticeboardContent />
    </Suspense>
  );
}
