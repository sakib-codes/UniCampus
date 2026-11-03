"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  GraduationCap, 
  MessageSquare, 
  Users, 
  Building2, 
  Radio,
  CheckCircle2, 
  UserPlus, 
  Download, 
  X, 
  Copy, 
  Check, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  MoreVertical
} from "lucide-react";
import { SPOTLIGHT } from "@/lib/theme";
import SpotlightCard from "@/components/bits/SpotlightCard";
import FadeIn from "@/components/bits/FadeIn";

type Student = {
  id: string;
  name: string;
  studentId: string;
  semester: string;
  section: string;
  department: string;
  skills: string[];
  isActive: boolean;
  activeStatusText: string;
  avatarColor: string;
};

const studentsData: Student[] = [
  {
    id: "1",
    name: "Nusrat Jahan",
    studentId: "211-15-4425",
    semester: "6th Sem",
    section: "Sec A",
    department: "CSE",
    skills: ["React", "Machine Learning", "Python"],
    isActive: true,
    activeStatusText: "Active 2m ago",
    avatarColor: "from-[#2563EB]/30 to-[#818CF8]/20 text-[#2563EB] border-[#2563EB]/40",
  },
  {
    id: "2",
    name: "Tanvir Hasan",
    studentId: "211-15-4412",
    semester: "6th Sem",
    section: "Sec A",
    department: "CSE",
    skills: ["TypeScript", "System Design", "Docker"],
    isActive: true,
    activeStatusText: "Active now",
    avatarColor: "from-[#38BDF8]/30 to-[#0284C7]/20 text-[#38BDF8] border-[#38BDF8]/40",
  },
  {
    id: "3",
    name: "Rafiqul Islam",
    studentId: "211-15-4438",
    semester: "6th Sem",
    section: "Sec B",
    department: "CSE",
    skills: ["Competitive Programming", "C++", "Graph Theory"],
    isActive: true,
    activeStatusText: "Active 15m ago",
    avatarColor: "from-[#A855F7]/30 to-[#7E22CE]/20 text-[#A855F7] border-[#A855F7]/40",
  },
  {
    id: "4",
    name: "Mehrin Sultana",
    studentId: "211-15-4409",
    semester: "6th Sem",
    section: "Sec A",
    department: "CSE",
    skills: ["UI/UX", "Figma", "Next.js"],
    isActive: true,
    activeStatusText: "Active now",
    avatarColor: "from-[#EC4899]/30 to-[#BE185D]/20 text-[#EC4899] border-[#EC4899]/40",
  },
  {
    id: "5",
    name: "Farhan Sadik",
    studentId: "211-15-4450",
    semester: "5th Sem",
    section: "Sec B",
    department: "EEE",
    skills: ["Cybersecurity", "Linux", "Go"],
    isActive: false,
    activeStatusText: "Seen 2h ago",
    avatarColor: "from-[#64748B]/30 to-[#334155]/20 text-[#94A3B8] border-[#64748B]/40",
  },
  {
    id: "6",
    name: "Tasnim Zara",
    studentId: "211-15-4467",
    semester: "6th Sem",
    section: "Sec A",
    department: "BBA",
    skills: ["Data Science", "PyTorch", "SQL"],
    isActive: true,
    activeStatusText: "Active now",
    avatarColor: "from-[#10B981]/30 to-[#047857]/20 text-[#10B981] border-[#10B981]/40",
  },
  {
    id: "7",
    name: "Anika Kabir",
    studentId: "211-15-4431",
    semester: "6th Sem",
    section: "Sec A",
    department: "CSE",
    skills: ["Cloud Computing", "AWS", "Node.js"],
    isActive: true,
    activeStatusText: "Active now",
    avatarColor: "from-[#F59E0B]/30 to-[#D97706]/20 text-[#F59E0B] border-[#F59E0B]/40",
  },
  {
    id: "8",
    name: "Rifat Chowdhury",
    studentId: "211-15-4419",
    semester: "4th Sem",
    section: "Sec A",
    department: "CSE",
    skills: ["Algorithms", "Java", "Spring Boot"],
    isActive: true,
    activeStatusText: "Active 5m ago",
    avatarColor: "from-[#06B6D4]/30 to-[#0891B2]/20 text-[#06B6D4] border-[#06B6D4]/40",
  },
  {
    id: "9",
    name: "Sadia Afrin",
    studentId: "211-15-4402",
    semester: "6th Sem",
    section: "Sec A",
    department: "CSE",
    skills: ["Database Systems", "PostgreSQL", "Prisma"],
    isActive: false,
    activeStatusText: "Seen 4h ago",
    avatarColor: "from-[#F43F5E]/30 to-[#E11D48]/20 text-[#F43F5E] border-[#F43F5E]/40",
  },
  {
    id: "10",
    name: "Abrar Zahin",
    studentId: "211-15-4488",
    semester: "6th Sem",
    section: "Sec B",
    department: "EEE",
    skills: ["Embedded Systems", "IoT", "Robotics"],
    isActive: true,
    activeStatusText: "Active now",
    avatarColor: "from-[#8B5CF6]/30 to-[#6D28D9]/20 text-[#8B5CF6] border-[#8B5CF6]/40",
  },
  {
    id: "11",
    name: "Fahim Faysal",
    studentId: "211-15-4441",
    semester: "4th Sem",
    section: "Sec B",
    department: "CSE",
    skills: ["Mobile Dev", "Flutter", "Firebase"],
    isActive: false,
    activeStatusText: "Seen yesterday",
    avatarColor: "from-[#64748B]/30 to-[#475569]/20 text-[#94A3B8] border-[#64748B]/40",
  },
];

const filterTabs = [
  { id: "all", label: "All Peers" },
  { id: "cse", label: "Computer Science (CSE)" },
  { id: "sem6", label: "6th Semester" },
  { id: "active", label: "Active Only" },
];

export default function StudentsPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteCopied, setInviteCopied] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const { currentUser } = useAdminAuth();

  const selfName = currentUser?.full_name?.trim() ?? "";
  const selfStudentId = currentUser?.student_id?.trim() ?? "";

  const isSelf = (student: Student) =>
    (!!selfName && student.name.toLowerCase() === selfName.toLowerCase()) ||
    (!!selfStudentId && student.studentId === selfStudentId);

  // Keyboard shortcut listener: press "/" to focus search
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

  const peerRoster = useMemo(
    () => studentsData.filter((student) => !isSelf(student)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selfName, selfStudentId]
  );

  const stats = useMemo(() => {
    return {
      total: peerRoster.length,
      active: peerRoster.filter((s) => s.isActive).length,
      sixthSem: peerRoster.filter((s) => s.semester === "6th Sem" && s.department === "CSE").length,
      depts: new Set(peerRoster.map((s) => s.department)).size,
    };
  }, [peerRoster]);

  const filteredStudents = useMemo(() => {
    return peerRoster.filter((student) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        student.name.toLowerCase().includes(q) ||
        student.studentId.toLowerCase().includes(q) ||
        student.department.toLowerCase().includes(q) ||
        student.section.toLowerCase().includes(q) ||
        student.skills.some((skill) => skill.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      if (activeFilter === "cse") return student.department === "CSE";
      if (activeFilter === "sem6") return student.semester === "6th Sem";
      if (activeFilter === "active") return student.isActive;

      return true;
    });
  }, [peerRoster, searchQuery, activeFilter]);

  // Pagination (6 cards per page)
  const pageSize = 6;
  const totalPages = Math.ceil(filteredStudents.length / pageSize) || 1;
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredStudents.slice(startIndex, startIndex + pageSize);
  }, [filteredStudents, currentPage]);

  const handleMessagePeer = (name: string) => {
    window.dispatchEvent(
      new CustomEvent("open-messaging", { detail: { peerName: name } })
    );
  };

  const handleExportCSV = () => {
    const headers = ["Name", "Student ID", "Department", "Semester", "Section", "Status", "Skills"];
    const rows = filteredStudents.map((s) => [
      `"${s.name}"`,
      `"${s.studentId}"`,
      `"${s.department}"`,
      `"${s.semester}"`,
      `"${s.section}"`,
      `"${s.isActive ? "Online" : "Offline"}"`,
      `"${s.skills.join(", ")}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `unicampus_peers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText("https://unicampus.edu/join?cohort=cse-spring-2026");
    setInviteCopied(true);
    setTimeout(() => setInviteCopied(false), 2000);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setInviteSuccess(true);
    setTimeout(() => {
      setInviteSuccess(false);
      setIsInviteModalOpen(false);
      setInviteEmail("");
    }, 1800);
  };

  return (
    <div className="w-full space-y-6 pb-12 select-none">
      {/* ========================================================================= */}
      {/* 1. PAGE HEADER ROW                                                        */}
      {/* ========================================================================= */}
      <FadeIn delay={0.05} direction="down">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-200 dark:border-[#30363D]/40">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-brand/10 text-brand border border-brand/25 dark:bg-[#2563EB]/15 dark:text-[#2563EB] dark:border-[#2563EB]/30 text-[11px] font-mono font-medium">
                BATCH 2021-2025
              </span>
              <span className="text-[12px] text-slate-500 dark:text-[#8D96A0]">
                • Dept. of Computer Science &amp; Engineering
              </span>
            </div>
            <h1 className="text-[28px] font-manrope font-extrabold tracking-[-0.02em] text-slate-900 dark:text-[#F0F6FC] leading-tight">
              Student Peers &amp; Directory
            </h1>
            <p className="text-[14px] text-slate-500 dark:text-[#8D96A0] font-normal">
              Connect, exchange project insights, and collaborate with enrolled peers across departments.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsInviteModalOpen(true)}
              className="h-9 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#161B22] dark:hover:bg-[#1C2128] border border-slate-200 dark:border-[#30363D] text-[13px] font-semibold text-slate-800 dark:text-[#F0F6FC] flex items-center gap-2 transition-colors cursor-pointer shadow-xs active:scale-[0.98]"
            >
              <UserPlus className="w-4 h-4 text-slate-500 dark:text-[#8D96A0]" />
              <span>Invite Peer</span>
            </button>
            <button
              type="button"
              onClick={handleExportCSV}
              className="h-9 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#161B22] dark:hover:bg-[#1C2128] border border-slate-200 dark:border-[#30363D] text-[13px] font-semibold text-slate-800 dark:text-[#F0F6FC] flex items-center gap-2 transition-colors cursor-pointer shadow-xs active:scale-[0.98]"
            >
              <Download className="w-4 h-4 text-slate-500 dark:text-[#8D96A0]" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </FadeIn>

      {/* ========================================================================= */}
      {/* 2. STATS STRIP (4 compact bento stat cards in a row, 20px gap)           */}
      {/* ========================================================================= */}
      <FadeIn delay={0.1}>
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card A: Enrolled Peers */}
          <SpotlightCard
            className="p-[18px] rounded-[16px] bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] flex items-center justify-between relative overflow-hidden transition-all duration-300 shadow-xs hover:border-brand/40 dark:hover:border-[#2563EB]/40"
            spotlightColor={SPOTLIGHT.wash}
            borderGlowColor={SPOTLIGHT.glow}
          >
            <div className="flex flex-col gap-1 z-10">
              <span className="text-[12px] font-medium text-slate-500 dark:text-[#8D96A0] tracking-wide uppercase font-mono">
                Enrolled Peers
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-[28px] font-manrope font-extrabold text-slate-900 dark:text-[#F0F6FC] leading-none">
                  {stats.total}
                </span>
                <span className="text-[11px] font-mono text-emerald-600 dark:text-[#3FB950] font-medium">
                  +2 this term
                </span>
              </div>
              <span className="text-[12px] text-slate-500 dark:text-[#8D96A0]">
                Active directory
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] flex items-center justify-center text-brand dark:text-[#2563EB] shrink-0">
              <Users className="w-6 h-6" />
            </div>
          </SpotlightCard>

          {/* Card B: Active Now */}
          <SpotlightCard
            className="p-[18px] rounded-[16px] bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] flex items-center justify-between relative overflow-hidden transition-all duration-300 shadow-xs hover:border-emerald-500/40 dark:hover:border-[#3FB950]/40"
            spotlightColor={SPOTLIGHT.wash}
            borderGlowColor={SPOTLIGHT.glow}
          >
            <div className="flex flex-col gap-1 z-10">
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-medium text-slate-500 dark:text-[#8D96A0] tracking-wide uppercase font-mono">
                  Active Now
                </span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 dark:bg-[#3FB950]" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-[28px] font-manrope font-extrabold text-emerald-600 dark:text-[#3FB950] leading-none">
                  {stats.active}
                </span>
                <span className="text-[11px] font-mono text-slate-500 dark:text-[#8D96A0]">
                  of {stats.total} online
                </span>
              </div>
              <span className="text-[12px] text-emerald-600 dark:text-[#3FB950] font-medium">
                Currently Online
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] flex items-center justify-center text-emerald-600 dark:text-[#3FB950] shrink-0">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
          </SpotlightCard>

          {/* Card C: 6th Semester */}
          <SpotlightCard
            className="p-[18px] rounded-[16px] bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] flex items-center justify-between relative overflow-hidden transition-all duration-300 shadow-xs hover:border-brand/40 dark:hover:border-[#2563EB]/40"
            spotlightColor={SPOTLIGHT.wash}
            borderGlowColor={SPOTLIGHT.glow}
          >
            <div className="flex flex-col gap-1 z-10">
              <span className="text-[12px] font-medium text-slate-500 dark:text-[#8D96A0] tracking-wide uppercase font-mono">
                6th Semester
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-[28px] font-manrope font-extrabold text-brand dark:text-[#2563EB] leading-none">
                  {stats.sixthSem}
                </span>
                <span className="text-[11px] font-mono text-slate-500 dark:text-[#8D96A0]">
                  Sec A &amp; B
                </span>
              </div>
              <span className="text-[12px] text-slate-500 dark:text-[#8D96A0]">
                Your batch peers
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] flex items-center justify-center text-brand dark:text-[#2563EB] shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
          </SpotlightCard>

          {/* Card D: Departments */}
          <SpotlightCard
            className="p-[18px] rounded-[16px] bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] flex items-center justify-between relative overflow-hidden transition-all duration-300 shadow-xs hover:border-brand/40 dark:hover:border-[#2563EB]/40"
            spotlightColor={SPOTLIGHT.wash}
            borderGlowColor={SPOTLIGHT.glow}
          >
            <div className="flex flex-col gap-1 z-10">
              <span className="text-[12px] font-medium text-slate-500 dark:text-[#8D96A0] tracking-wide uppercase font-mono">
                Departments
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-[28px] font-manrope font-extrabold text-slate-900 dark:text-[#F0F6FC] leading-none">
                  {stats.depts}
                </span>
                <span className="text-[11px] font-mono text-slate-500 dark:text-[#8D96A0]">
                  Programs
                </span>
              </div>
              <span className="text-[12px] text-slate-500 dark:text-[#8D96A0] font-medium">
                CSE, EEE, BBA
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] flex items-center justify-center text-slate-800 dark:text-[#F0F6FC] shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
          </SpotlightCard>
        </section>
      </FadeIn>

      {/* ========================================================================= */}
      {/* 3. FILTER & SEARCH TOOLBAR (#0D1117 rounded-2xl bar, 16px padding)        */}
      {/* ========================================================================= */}
      <FadeIn delay={0.15}>
        <section className="p-4 rounded-2xl bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
          {/* Left: Search Input (420px wide) */}
          <div className="relative w-full md:w-[420px]">
            <Search className="w-4 h-4 text-slate-400 dark:text-[#8D96A0] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by name, ID, or department..."
              className="w-full h-10 pl-10 pr-10 rounded-xl bg-slate-100 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] text-[13px] text-slate-900 dark:text-[#F0F6FC] placeholder-slate-400 dark:placeholder-[#8D96A0] focus:outline-none focus:border-brand dark:focus:border-[#2563EB] transition-colors"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-slate-200 dark:bg-[#1C2128] border border-slate-300 dark:border-[#30363D] text-[10px] font-mono text-slate-500 dark:text-[#8D96A0]">
                /
              </kbd>
            )}
          </div>

          {/* Right: Segmented Filter Tabs (#1C2128 track) */}
          <div className="w-full md:w-auto flex items-center overflow-x-auto p-1 rounded-xl bg-slate-100 dark:bg-[#1C2128] border border-slate-200 dark:border-[#30363D]/60 gap-1 custom-scrollbar">
            {filterTabs.map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveFilter(tab.id);
                    setCurrentPage(1);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-[12px] font-semibold tracking-tight transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? "bg-brand text-white dark:bg-[#2563EB] dark:text-[#F0F6FC] shadow-xs"
                      : "text-slate-600 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-[#F0F6FC] hover:bg-slate-200/60 dark:hover:bg-[#161B22]"
                  }`}
                >
                  {tab.id === "active" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-[#3FB950]" />
                  )}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </section>
      </FadeIn>

      {/* ========================================================================= */}
      {/* 4. RESPONSIVE 3-COLUMN PEER CARD GRID (3 cols x 2 rows, 20px gap)         */}
      {/* ========================================================================= */}
      {paginatedStudents.length === 0 ? (
        <FadeIn delay={0.2}>
          <div className="p-12 rounded-3xl bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] text-center space-y-3">
            <GraduationCap className="w-12 h-12 text-slate-300 dark:text-[#30363D] mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-[#F0F6FC]">
              No peers match your search criteria
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#8D96A0] max-w-sm mx-auto">
              Try searching for a different student name, ID, or switching your filter tabs.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("all");
              }}
              className="px-4 py-2 rounded-xl bg-brand text-white text-xs font-semibold hover:bg-brand-hover transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        </FadeIn>
      ) : (
        <FadeIn delay={0.2}>
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedStudents.map((student) => {
              const initials = student.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <SpotlightCard
                  key={student.id}
                  className="p-[22px] rounded-[24px] bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] flex flex-col justify-between gap-5 relative group transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/40 dark:hover:border-[#2563EB]/40 shadow-xs hover:shadow-[0_12px_30px_-10px_rgba(37, 99, 235,0.15)] h-full"
                  spotlightColor={SPOTLIGHT.wash}
                  borderGlowColor={SPOTLIGHT.glow}
                >
                  <div className="flex flex-col gap-3.5">
                    {/* Top Row: Avatar + Name + Monospace ID */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* 48px Circular Avatar with Online/Offline Status Dot */}
                        <div className="relative w-12 h-12 shrink-0">
                          <div
                            className={`w-12 h-12 rounded-full bg-gradient-to-br ${student.avatarColor} border flex items-center justify-center font-manrope font-bold text-[15px] shadow-inner`}
                          >
                            {initials}
                          </div>
                          <span
                            className={`w-3.5 h-3.5 rounded-full border-2 border-white dark:border-[#0D1117] absolute bottom-0 right-0 z-10 shadow-sm ${
                              student.isActive ? "bg-emerald-500 dark:bg-[#3FB950]" : "bg-slate-400 dark:bg-[#6E747D]"
                            }`}
                            title={student.isActive ? "Online now" : "Offline"}
                          />
                        </div>

                        {/* Student Full Name & Monospace ID */}
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-[16px] font-manrope font-bold text-slate-900 dark:text-[#F0F6FC] leading-snug truncate">
                              {student.name}
                            </h3>
                            <span title="Verified Student" className="shrink-0 flex items-center">
                              <CheckCircle2 className="w-4 h-4 text-brand dark:text-[#2563EB]" />
                            </span>
                          </div>
                          <span className="text-[11px] font-mono text-slate-500 dark:text-[#8D96A0] mt-0.5">
                            ID: {student.studentId}
                          </span>
                        </div>
                      </div>

                      {/* Bookmark / More Options */}
                      <button
                        type="button"
                        onClick={() => alert(`Student: ${student.name} (${student.studentId})\nDept: ${student.department} • ${student.semester} ${student.section}`)}
                        className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 dark:text-[#8D96A0] dark:hover:text-[#F0F6FC] hover:bg-slate-100 dark:hover:bg-[#161B22] flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                        title="Student Details"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Department, Semester, Section Tag Row */}
                    <div className="flex items-center gap-2 text-[12px] flex-wrap">
                      <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] text-slate-700 dark:text-[#C9D1D9]">
                        {student.department}
                      </span>
                      <span className="text-slate-400 dark:text-[#30363D]">•</span>
                      <span className="font-medium text-slate-600 dark:text-[#8D96A0]">
                        {student.semester}
                      </span>
                      <span className="text-slate-400 dark:text-[#30363D]">•</span>
                      <span className="font-mono text-slate-600 dark:text-[#8D96A0]">
                        {student.section}
                      </span>
                      <span className="text-slate-400 dark:text-[#30363D]">•</span>
                      <span
                        className={`text-[11px] font-medium ${
                          student.isActive
                            ? "text-emerald-600 dark:text-[#3FB950]"
                            : "text-slate-400 dark:text-[#8D96A0]"
                        }`}
                      >
                        {student.activeStatusText}
                      </span>
                    </div>

                    {/* Skills & Interests Chip Row (3 compact #161B22 pills) */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {student.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] text-[11px] font-medium text-slate-700 dark:text-[#C9D1D9] hover:border-brand/40 dark:hover:border-[#2563EB]/40 transition-colors"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Primary Action: Full-width Electric Indigo Button */}
                  <button
                    type="button"
                    onClick={() => handleMessagePeer(student.name)}
                    className="w-full h-[38px] rounded-[10px] bg-brand hover:bg-brand-hover dark:bg-[#2563EB] dark:hover:bg-[#5852ff] text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-sm dark:shadow-[0_0_16px_rgba(37, 99, 235,0.3)] hover:shadow-brand/30 active:scale-[0.98] cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Message Peer</span>
                  </button>
                </SpotlightCard>
              );
            })}
          </section>
        </FadeIn>
      )}

      {/* ========================================================================= */}
      {/* 5. PAGINATION FOOTER ROW                                                  */}
      {/* ========================================================================= */}
      <FadeIn delay={0.25}>
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-[#8D96A0]">
          <div>
            Showing{" "}
            <span className="font-mono font-bold text-slate-900 dark:text-[#F0F6FC]">
              {filteredStudents.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}–
              {Math.min(currentPage * pageSize, filteredStudents.length)}
            </span>{" "}
            of{" "}
            <span className="font-mono font-bold text-slate-900 dark:text-[#F0F6FC]">
              {filteredStudents.length}
            </span>{" "}
            enrolled peers • Semester 6 Spring 2026 Batch Directory
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-8 px-3 rounded-lg bg-slate-100 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] text-slate-700 dark:text-[#C9D1D9] hover:bg-slate-200 dark:hover:bg-[#1C2128] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg font-mono font-semibold transition-all cursor-pointer ${
                  currentPage === page
                    ? "bg-brand text-white dark:bg-[#2563EB] dark:text-[#F0F6FC] shadow-xs"
                    : "bg-slate-100 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] text-slate-700 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-[#F0F6FC]"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="h-8 px-3 rounded-lg bg-slate-100 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] text-slate-700 dark:text-[#C9D1D9] hover:bg-slate-200 dark:hover:bg-[#1C2128] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </FadeIn>

      {/* ========================================================================= */}
      {/* 6. MODAL: INVITE PEER                                                     */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isInviteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsInviteModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative z-10 w-full max-w-md bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] rounded-3xl p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#30363D] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-brand/10 text-brand dark:bg-[#2563EB]/15 dark:text-[#2563EB] flex items-center justify-center">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-manrope font-extrabold text-base text-slate-900 dark:text-[#F0F6FC]">
                      Invite Cohort Peer
                    </h3>
                    <p className="text-[11px] font-mono text-slate-500 dark:text-[#8D96A0]">
                      Semester Spring 2026 Directory
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {inviteSuccess ? (
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto animate-bounce" />
                  <h4 className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                    Invitation Dispatched!
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-[#8D96A0]">
                    We sent an official campus cohort invite to <span className="font-mono font-semibold">{inviteEmail}</span>.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSendInvite} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-[#C9D1D9]">
                      Peer Institutional Email
                    </label>
                    <input
                      type="email"
                      required
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="e.g. classmate@unicampus.edu"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] text-xs text-slate-900 dark:text-[#F0F6FC] placeholder-slate-400 dark:placeholder-[#8D96A0] focus:outline-none focus:border-brand dark:focus:border-[#2563EB]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-[#C9D1D9]">
                      Direct Cohort Link
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value="https://unicampus.edu/join?cohort=cse-spring-2026"
                        className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] text-xs font-mono text-slate-500 dark:text-[#8D96A0] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleCopyInviteLink}
                        className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#1C2128] dark:hover:bg-[#21262D] border border-slate-200 dark:border-[#30363D] text-xs font-semibold text-slate-800 dark:text-[#F0F6FC] flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                      >
                        {inviteCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-emerald-500">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsInviteModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-[#8D96A0] dark:hover:text-white transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-brand hover:bg-brand-hover dark:bg-[#2563EB] dark:hover:bg-[#5852ff] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                    >
                      Send Invite
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
