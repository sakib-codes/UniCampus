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
  ChevronLeft,
  ChevronRight,
  MoreVertical
} from "lucide-react";

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
    skills: ["Section A", "Robotics Club", "Study Group 1"],
    isActive: true,
    activeStatusText: "Active 2m ago",
    avatarColor: "from-brand/30 to-indigo-400/20 text-brand border-brand/40",
  },
  {
    id: "2",
    name: "Tanvir Mahmud",
    studentId: "211-15-4412",
    semester: "6th Sem",
    section: "Sec A",
    department: "CSE",
    skills: ["Section A", "Study Group 3", "ACM Chapter"],
    isActive: true,
    activeStatusText: "Active now",
    avatarColor: "from-sky-400/30 to-sky-600/20 text-sky-400 border-sky-400/40",
  },
  {
    id: "3",
    name: "Rifat Chowdhury",
    studentId: "211-15-4438",
    semester: "6th Sem",
    section: "Sec B",
    department: "CSE",
    skills: ["Section B", "Competitive Programming", "Math Club"],
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
    skills: ["Section A", "Design Guild", "Study Group 2"],
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
    skills: ["Section B", "Circuits Lab", "Robotics Club"],
    isActive: false,
    activeStatusText: "Seen 2h ago",
    avatarColor: "from-fg-muted/30 to-fg-muted/20 text-fg-muted border-fg-muted/40",
  },
  {
    id: "6",
    name: "Tasnim Zara",
    studentId: "211-15-4467",
    semester: "6th Sem",
    section: "Sec A",
    department: "BBA",
    skills: ["Section A", "Debating Club", "Study Group 4"],
    isActive: true,
    activeStatusText: "Active now",
    avatarColor: "from-success/30 to-[#047857]/20 text-success border-success/40",
  },
  {
    id: "7",
    name: "Anika Kabir",
    studentId: "211-15-4431",
    semester: "6th Sem",
    section: "Sec A",
    department: "CSE",
    skills: ["Section A", "Study Group 3", "Open Source Club"],
    isActive: true,
    activeStatusText: "Active now",
    avatarColor: "from-warning/30 to-warning/20 text-warning border-warning/40",
  },
  {
    id: "8",
    name: "Rifat Chowdhury",
    studentId: "211-15-4419",
    semester: "4th Sem",
    section: "Sec A",
    department: "CSE",
    skills: ["Section A", "Algorithms Lab", "Study Group 1"],
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
    skills: ["Section A", "Database R&D", "IEEE Student Branch"],
    isActive: false,
    activeStatusText: "Seen 4h ago",
    avatarColor: "from-danger/30 to-[#E11D48]/20 text-danger border-danger/40",
  },
  {
    id: "10",
    name: "Abrar Zahin",
    studentId: "211-15-4488",
    semester: "6th Sem",
    section: "Sec B",
    department: "EEE",
    skills: ["Section B", "Robotics Club", "IoT Research Group"],
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
    skills: ["Section B", "Study Group 2", "Mobile Dev Wing"],
    isActive: false,
    activeStatusText: "Seen yesterday",
    avatarColor: "from-fg-muted/30 to-fg-muted/20 text-fg-muted border-fg-muted/40",
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
    <div className="w-full space-y-6 pb-12">
      {/* ========================================================================= */}
      {/* 1. PAGE HEADER ROW                                                        */}
      {/* ========================================================================= */}
      <div className="w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-200 dark:border-line/40">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-brand/10 text-brand border border-brand/25 dark:bg-brand/15 dark:text-brand dark:border-brand/30 text-xs font-mono font-medium">
                BATCH 2021-2025
              </span>
              <span className="text-[12px] text-slate-500 dark:text-fg-muted">
                • Dept. of Computer Science &amp; Engineering
              </span>
            </div>
            <h1 className="text-[28px] font-extrabold tracking-[-0.02em] text-slate-900 dark:text-fg leading-tight">
              Student Peers &amp; Directory
            </h1>
            <p className="text-[14px] text-slate-500 dark:text-fg-muted font-normal">
              Connect, exchange project insights, and collaborate with enrolled peers across departments.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsInviteModalOpen(true)}
              className="h-9 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-surface-2 dark:hover:bg-surface-2 border border-slate-200 dark:border-line text-[13px] font-semibold text-slate-800 dark:text-fg flex items-center gap-2 transition-colors cursor-pointer shadow-xs active:scale-[0.98]"
            >
              <UserPlus className="w-4 h-4 text-slate-500 dark:text-fg-muted" />
              <span>Invite Peer</span>
            </button>
            <button
              type="button"
              onClick={handleExportCSV}
              className="h-9 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-surface-2 dark:hover:bg-surface-2 border border-slate-200 dark:border-line text-[13px] font-semibold text-slate-800 dark:text-fg flex items-center gap-2 transition-colors cursor-pointer shadow-xs active:scale-[0.98]"
            >
              <Download className="w-4 h-4 text-slate-500 dark:text-fg-muted" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. STATS STRIP (4 compact bento stat cards in a row, 20px gap)           */}
      {/* ========================================================================= */}
      <div className="w-full">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card A: Enrolled Peers */}
          <div className="p-[18px] rounded-[16px] bg-white dark:bg-surface border border-slate-200 dark:border-line flex items-center justify-between relative overflow-hidden transition-all duration-300 shadow-2xs hover:border-brand/40 dark:hover:border-brand/40">
            <div className="flex flex-col gap-1 z-10">
              <span className="text-[12px] font-medium text-slate-500 dark:text-fg-muted font-mono">
                Enrolled Peers
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-[28px] font-extrabold text-slate-900 dark:text-fg leading-none">
                  {stats.total}
                </span>
                <span className="text-xs font-mono text-emerald-600 dark:text-success font-medium">
                  +2 this term
                </span>
              </div>
              <span className="text-[12px] text-slate-500 dark:text-fg-muted">
                Active directory
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-surface-2 border border-slate-200 dark:border-line flex items-center justify-center text-brand dark:text-brand shrink-0">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* Card B: Active Now */}
          <div className="p-[18px] rounded-[16px] bg-white dark:bg-surface border border-slate-200 dark:border-line flex items-center justify-between relative overflow-hidden transition-all duration-300 shadow-2xs hover:border-emerald-500/40 dark:hover:border-success/40">
            <div className="flex flex-col gap-1 z-10">
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-medium text-slate-500 dark:text-fg-muted font-mono">
                  Active Now
                </span>
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 dark:bg-success" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-[28px] font-extrabold text-emerald-600 dark:text-success leading-none">
                  {stats.active}
                </span>
                <span className="text-xs font-mono text-slate-500 dark:text-fg-muted">
                  of {stats.total} online
                </span>
              </div>
              <span className="text-[12px] text-emerald-600 dark:text-success font-medium">
                Currently Online
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-surface-2 border border-slate-200 dark:border-line flex items-center justify-center text-emerald-600 dark:text-success shrink-0">
              <Radio className="w-6 h-6" />
            </div>
          </div>

          {/* Card C: 6th Semester */}
          <div className="p-[18px] rounded-[16px] bg-white dark:bg-surface border border-slate-200 dark:border-line flex items-center justify-between relative overflow-hidden transition-all duration-300 shadow-2xs hover:border-brand/40 dark:hover:border-brand/40">
            <div className="flex flex-col gap-1 z-10">
              <span className="text-[12px] font-medium text-slate-500 dark:text-fg-muted font-mono">
                6th Semester
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-[28px] font-extrabold text-brand dark:text-brand leading-none">
                  {stats.sixthSem}
                </span>
                <span className="text-xs font-mono text-slate-500 dark:text-fg-muted">
                  Sec A &amp; B
                </span>
              </div>
              <span className="text-[12px] text-slate-500 dark:text-fg-muted">
                Your batch peers
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-surface-2 border border-slate-200 dark:border-line flex items-center justify-center text-brand dark:text-brand shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
          </div>

          {/* Card D: Departments */}
          <div className="p-[18px] rounded-[16px] bg-white dark:bg-surface border border-slate-200 dark:border-line flex items-center justify-between relative overflow-hidden transition-all duration-300 shadow-2xs hover:border-brand/40 dark:hover:border-brand/40">
            <div className="flex flex-col gap-1 z-10">
              <span className="text-[12px] font-medium text-slate-500 dark:text-fg-muted font-mono">
                Departments
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-[28px] font-extrabold text-slate-900 dark:text-fg leading-none">
                  {stats.depts}
                </span>
                <span className="text-xs font-mono text-slate-500 dark:text-fg-muted">
                  Programs
                </span>
              </div>
              <span className="text-[12px] text-slate-500 dark:text-fg-muted font-medium">
                CSE, EEE, BBA
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-surface-2 border border-slate-200 dark:border-line flex items-center justify-center text-slate-800 dark:text-fg shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
          </div>
        </section>
      </div>

      {/* ========================================================================= */}
      {/* 3. FILTER & SEARCH TOOLBAR (#0D1117 rounded-2xl bar, 16px padding)        */}
      {/* ========================================================================= */}
      <div className="w-full">
        <section className="p-4 rounded-2xl bg-white dark:bg-surface border border-slate-200 dark:border-line flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
          {/* Left: Search Input (420px wide) */}
          <div className="relative w-full md:w-[420px]">
            <Search className="w-4 h-4 text-slate-400 dark:text-fg-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by name, ID, or department..."
              className="w-full h-10 pl-10 pr-10 rounded-xl bg-slate-100 dark:bg-surface-2 border border-slate-200 dark:border-line text-[13px] text-slate-900 dark:text-fg placeholder-slate-400 dark:placeholder-fg-muted focus:outline-none focus:border-brand dark:focus:border-brand transition-colors"
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
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-slate-200 dark:bg-surface-2 border border-slate-300 dark:border-line text-xs font-mono text-slate-500 dark:text-fg-muted">
                /
              </kbd>
            )}
          </div>

          {/* Right: Segmented Filter Tabs (#1C2128 track) */}
          <div className="w-full md:w-auto flex items-center overflow-x-auto p-1 rounded-xl bg-slate-100 dark:bg-surface-2 border border-slate-200 dark:border-line/60 gap-1 custom-scrollbar">
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
                      ? "bg-brand text-white dark:bg-brand dark:text-fg shadow-xs"
                      : "text-slate-600 dark:text-fg-muted hover:text-slate-900 dark:hover:text-fg hover:bg-slate-200/60 dark:hover:bg-surface-2"
                  }`}
                >
                  {tab.id === "active" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-success" />
                  )}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* ========================================================================= */}
      {/* 4. RESPONSIVE 3-COLUMN PEER CARD GRID (3 cols x 2 rows, 20px gap)         */}
      {/* ========================================================================= */}
      {paginatedStudents.length === 0 ? (
        <div className="w-full">
          <div className="p-12 rounded-3xl bg-white dark:bg-surface border border-slate-200 dark:border-line text-center space-y-3">
            <GraduationCap className="w-12 h-12 text-slate-300 dark:text-line mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-fg">
              No peers match your search criteria
            </h3>
            <p className="text-xs text-slate-500 dark:text-fg-muted max-w-sm mx-auto">
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
        </div>
      ) : (
        <div className="w-full">
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedStudents.map((student) => {
              const initials = student.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <div
                  key={student.id}
                  onClick={() => handleMessagePeer(student.name)}
                  className="p-[22px] rounded-[24px] bg-white dark:bg-surface border border-slate-200 dark:border-line flex flex-col justify-between gap-5 relative group transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/40 dark:hover:border-brand/40 shadow-2xs h-full cursor-pointer"
                >
                  <div className="flex flex-col gap-3.5">
                    {/* Top Row: Avatar + Name + Monospace ID */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* 48px Circular Avatar with Online/Offline Status Dot */}
                        <div className="relative w-12 h-12 shrink-0">
                          <div
                            className={`w-12 h-12 rounded-full bg-gradient-to-br ${student.avatarColor} border flex items-center justify-center font-bold text-[15px] shadow-inner`}
                          >
                            {initials}
                          </div>
                          <span
                            className={`w-3.5 h-3.5 rounded-full border-2 border-white dark:border-surface absolute bottom-0 right-0 z-10 shadow-sm ${
                              student.isActive ? "bg-emerald-500 dark:bg-success" : "bg-slate-400 dark:bg-fg-muted"
                            }`}
                            title={student.isActive ? "Online now" : "Offline"}
                          />
                        </div>

                        {/* Student Full Name & Monospace ID */}
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-[16px] font-bold text-slate-900 dark:text-fg leading-snug truncate">
                              {student.name}
                            </h3>
                            <span title="Verified Student" className="shrink-0 flex items-center">
                              <CheckCircle2 className="w-4 h-4 text-brand dark:text-brand" />
                            </span>
                          </div>
                          <span className="text-xs font-mono text-slate-500 dark:text-fg-muted mt-0.5">
                            ID: {student.studentId}
                          </span>
                        </div>
                      </div>

                      {/* Action buttons: Subtle Chat icon button + Details button */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMessagePeer(student.name);
                          }}
                          className="w-8 h-8 rounded-lg text-brand hover:bg-brand/10 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                          title={`Message ${student.name}`}
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`Student: ${student.name} (${student.studentId})\nDept: ${student.department} • ${student.semester} ${student.section}`);
                          }}
                          className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 dark:text-fg-muted dark:hover:text-fg hover:bg-slate-100 dark:hover:bg-surface-2 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                          title="Student Details"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Department, Semester, Section Tag Row */}
                    <div className="flex items-center gap-2 text-[12px] flex-wrap">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-surface-2 border border-slate-200 dark:border-line text-slate-700 dark:text-fg">
                        {student.department}
                      </span>
                      <span className="text-slate-400 dark:text-line">•</span>
                      <span className="font-medium text-slate-600 dark:text-fg-muted">
                        {student.semester}
                      </span>
                      <span className="text-slate-400 dark:text-line">•</span>
                      <span className="font-mono text-slate-600 dark:text-fg-muted">
                        {student.section}
                      </span>
                      <span className="text-slate-400 dark:text-line">•</span>
                      <span
                        className={`text-xs font-medium ${
                          student.isActive
                            ? "text-emerald-600 dark:text-success"
                            : "text-slate-400 dark:text-fg-muted"
                        }`}
                      >
                        {student.activeStatusText}
                      </span>
                    </div>

                    {/* Skills & Interests Chip Row */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {student.skills
                        .filter((skill) => !skill.toLowerCase().includes("section"))
                        .map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-surface-2 border border-slate-200 dark:border-line text-xs font-medium text-slate-700 dark:text-fg hover:border-brand/40 dark:hover:border-brand/40 transition-colors"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. PAGINATION FOOTER ROW                                                  */}
      {/* ========================================================================= */}
      <div className="w-full">
        <div className="p-4 rounded-2xl bg-white dark:bg-surface border border-slate-200 dark:border-line flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-fg-muted">
          <div>
            Showing{" "}
            <span className="font-mono font-bold text-slate-900 dark:text-fg">
              {filteredStudents.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}–
              {Math.min(currentPage * pageSize, filteredStudents.length)}
            </span>{" "}
            of{" "}
            <span className="font-mono font-bold text-slate-900 dark:text-fg">
              {filteredStudents.length}
            </span>{" "}
            enrolled peers • Semester 6 Spring 2026 Batch Directory
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-8 px-3 rounded-lg bg-slate-100 dark:bg-surface-2 border border-slate-200 dark:border-line text-slate-700 dark:text-fg hover:bg-slate-200 dark:hover:bg-surface-2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 cursor-pointer"
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
                    ? "bg-brand text-white dark:bg-brand dark:text-fg shadow-xs"
                    : "bg-slate-100 dark:bg-surface-2 border border-slate-200 dark:border-line text-slate-700 dark:text-fg-muted hover:text-slate-900 dark:hover:text-fg"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="h-8 px-3 rounded-lg bg-slate-100 dark:bg-surface-2 border border-slate-200 dark:border-line text-slate-700 dark:text-fg hover:bg-slate-200 dark:hover:bg-surface-2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

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
              className="relative z-10 w-full max-w-md bg-white dark:bg-surface border border-slate-200 dark:border-line rounded-3xl p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-line pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-brand/10 text-brand dark:bg-brand/15 dark:text-brand flex items-center justify-center">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-fg">
                      Invite Cohort Peer
                    </h3>
                    <p className="text-xs font-mono text-slate-500 dark:text-fg-muted">
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
                  <p className="text-xs text-slate-600 dark:text-fg-muted">
                    We sent an official campus cohort invite to <span className="font-mono font-semibold">{inviteEmail}</span>.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSendInvite} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-fg">
                      Peer Institutional Email
                    </label>
                    <input
                      type="email"
                      required
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="e.g. classmate@unicampus.edu"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-surface-2 border border-slate-200 dark:border-line text-xs text-slate-900 dark:text-fg placeholder-slate-400 dark:placeholder-fg-muted focus:outline-none focus:border-brand dark:focus:border-brand"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-fg">
                      Direct Cohort Link
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value="https://unicampus.edu/join?cohort=cse-spring-2026"
                        className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-surface-2 border border-slate-200 dark:border-line text-xs font-mono text-slate-500 dark:text-fg-muted focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleCopyInviteLink}
                        className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-surface-2 dark:hover:bg-surface-2 border border-slate-200 dark:border-line text-xs font-semibold text-slate-800 dark:text-fg flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
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
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-fg-muted dark:hover:text-white transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-brand hover:bg-brand-hover dark:bg-brand dark:hover:bg-brand-hover text-white text-xs font-bold transition-all shadow-md cursor-pointer"
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
