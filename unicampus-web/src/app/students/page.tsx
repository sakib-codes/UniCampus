"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import {
  Search,
  GraduationCap,
  UserPlus,
  Download,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  STUDENTS_DATA,
  STUDENT_FILTER_TABS,
  Student,
} from "@/components/students/studentsData";
import { StudentsStatsStrip } from "@/components/students/StudentsStatsStrip";
import { StudentPeerCard } from "@/components/students/StudentPeerCard";
import { InvitePeerModal } from "@/components/students/InvitePeerModal";

export default function StudentsPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const { currentUser } = useAdminAuth();

  const selfName = currentUser?.full_name?.trim() ?? "";
  const selfStudentId = currentUser?.student_id?.trim() ?? "";

  // Keyboard shortcut listener: press "/" to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const peerRoster = useMemo(
    () =>
      STUDENTS_DATA.filter((student) => {
        const matchesName =
          !!selfName && student.name.toLowerCase() === selfName.toLowerCase();
        const matchesId =
          !!selfStudentId && student.studentId === selfStudentId;
        return !matchesName && !matchesId;
      }),
    [selfName, selfStudentId]
  );

  const stats = useMemo(() => {
    return {
      total: peerRoster.length,
      active: peerRoster.filter((s) => s.isActive).length,
      sixthSem: peerRoster.filter(
        (s) => s.semester === "6th Sem" && s.department === "CSE"
      ).length,
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

  const pageSize = 6;
  const totalPages = Math.ceil(filteredStudents.length / pageSize) || 1;
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredStudents.slice(startIndex, startIndex + pageSize);
  }, [filteredStudents, currentPage]);

  const handleMessagePeer = useCallback((name: string) => {
    window.dispatchEvent(
      new CustomEvent("open-messaging", { detail: { peerName: name } })
    );
  }, []);

  const handleShowDetails = useCallback((student: Student) => {
    alert(
      `Student: ${student.name} (${student.studentId})\nDept: ${student.department} • ${student.semester} ${student.section}`
    );
  }, []);

  const handleExportCSV = useCallback(() => {
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
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `unicampus_peers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [filteredStudents]);

  return (
    <div className="w-full space-y-6 pb-12">
      {/* 1. PAGE HEADER ROW */}
      <div className="w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-3 border-b border-line">
          <div className="flex flex-col gap-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-brand-soft text-brand border border-brand/25 text-xs font-sans font-semibold">
                BATCH 2021-2025
              </span>
              <span className="text-xs text-fg-muted">
                • Dept. of Computer Science &amp; Engineering
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-fg leading-tight">
              Student Peers &amp; Directory
            </h1>
            <p className="text-xs sm:text-sm text-fg-muted font-normal">
              Connect, exchange project insights, and collaborate with enrolled peers across departments.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsInviteModalOpen(true)}
              className="min-h-[40px] px-4 rounded-xl bg-surface hover:bg-surface-2 border border-line text-xs font-semibold text-fg flex items-center gap-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <UserPlus className="w-4 h-4 text-fg-muted" aria-hidden="true" />
              <span>Invite Peer</span>
            </button>
            <button
              type="button"
              onClick={handleExportCSV}
              className="min-h-[40px] px-4 rounded-xl bg-surface hover:bg-surface-2 border border-line text-xs font-semibold text-fg flex items-center gap-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <Download className="w-4 h-4 text-fg-muted" aria-hidden="true" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. STATS STRIP */}
      <StudentsStatsStrip stats={stats} />

      {/* 3. FILTER & SEARCH TOOLBAR */}
      <div className="w-full">
        <section className="p-4 rounded-2xl bg-surface border border-line flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative w-full md:max-w-[420px] min-w-0">
            <Search
              className="w-4 h-4 text-fg-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              ref={searchInputRef}
              type="text"
              aria-label="Search students by name, ID, or department"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by name, ID, or department..."
              className="w-full min-h-[44px] pl-10 pr-10 rounded-xl bg-surface-2 border border-line text-xs sm:text-sm text-fg placeholder:text-fg-muted focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-colors duration-150"
            />
            {searchQuery ? (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-fg-muted hover:text-fg rounded-md cursor-pointer"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            ) : (
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-surface border border-line text-xs font-mono text-fg-muted pointer-events-none">
                /
              </kbd>
            )}
          </div>

          <div className="w-full md:w-auto flex items-center overflow-x-auto p-1 rounded-xl bg-surface-2 border border-line gap-1">
            {STUDENT_FILTER_TABS.map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveFilter(tab.id);
                    setCurrentPage(1);
                  }}
                  className={`min-h-[36px] px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-colors shrink-0 cursor-pointer flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                    isActive
                      ? "bg-brand text-on-brand"
                      : "text-fg-muted hover:text-fg hover:bg-surface"
                  }`}
                >
                  {tab.id === "active" && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isActive ? "bg-on-brand" : "bg-success"
                      }`}
                      aria-hidden="true"
                    />
                  )}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* 4. RESPONSIVE 3-COLUMN PEER CARD GRID */}
      {paginatedStudents.length === 0 ? (
        <div className="w-full">
          <div className="p-12 rounded-2xl bg-surface border border-line text-center space-y-3">
            <GraduationCap className="w-12 h-12 text-fg-subtle mx-auto" aria-hidden="true" />
            <h3 className="text-base font-semibold text-fg">
              No peers match your search criteria
            </h3>
            <p className="text-xs text-fg-muted max-w-sm mx-auto">
              Try searching for a different student name, ID, or switching your filter tabs.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("all");
              }}
              className="min-h-[40px] px-4 py-2 rounded-xl bg-brand text-on-brand text-xs font-semibold hover:bg-brand-hover transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full">
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedStudents.map((student) => (
              <StudentPeerCard
                key={student.id}
                student={student}
                onMessagePeer={handleMessagePeer}
                onShowDetails={handleShowDetails}
              />
            ))}
          </section>
        </div>
      )}

      {/* 5. PAGINATION FOOTER ROW */}
      <div className="w-full">
        <div className="p-4 rounded-2xl bg-surface border border-line flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-fg-muted font-sans tabular-nums">
          <div>
            Showing{" "}
            <span className="font-semibold text-fg">
              {filteredStudents.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}–
              {Math.min(currentPage * pageSize, filteredStudents.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-fg">
              {filteredStudents.length}
            </span>{" "}
            enrolled peers • 3rd Year · 6th Semester Batch Directory
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="min-h-[36px] px-3 rounded-lg bg-surface-2 border border-line text-fg hover:bg-canvas disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Previous</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`min-w-[36px] min-h-[36px] rounded-lg font-sans tabular-nums font-semibold transition-colors cursor-pointer ${
                  currentPage === page
                    ? "bg-brand text-on-brand"
                    : "bg-surface-2 border border-line text-fg-muted hover:text-fg"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="min-h-[36px] px-3 rounded-lg bg-surface-2 border border-line text-fg hover:bg-canvas disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* 6. MODAL: INVITE PEER */}
      <InvitePeerModal
        open={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />
    </div>
  );
}
