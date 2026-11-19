"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Search, 
  FileText, 
  Paperclip, 
  CheckCircle2, 
  Bookmark, 
  BookmarkCheck, 
  Printer, 
  Download, 
  ArrowRight, 
  ShieldCheck, 
  GraduationCap, 
  AlertTriangle, 
  Share2, 
  Check
} from "lucide-react";
import { OFFICIAL_NOTICES } from "@/lib/noticeData";

export function NoticeboardContent({ initialNoticeId }: { initialNoticeId?: string }) {
  const searchParams = useSearchParams();
  const readerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [userSelectedId, setUserSelectedId] = useState<string | null>(null);
  const selectedNoticeId =
    userSelectedId || searchParams.get("id") || initialNoticeId || "not-exam-108";

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(["not-exam-108"]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

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
      (Number(selectedNoticeId) > 0 && OFFICIAL_NOTICES[Number(selectedNoticeId) - 1]) ||
      OFFICIAL_NOTICES[0]
    );
  }, [selectedNoticeId]);

  const handleSelectNotice = (id: string) => {
    setUserSelectedId(id);
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
Verification    : Verified Official Institutional Circular
Reference No    : ${activeNotice.refNo}
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
    <div className="w-full space-y-6 pb-20">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & FILTER BAR                                                */}
      {/* ========================================================================= */}
      <section className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-[28px] font-extrabold text-slate-900 dark:text-fg tracking-[-0.02em] leading-tight">
                Campus Noticeboard
              </h1>
              <p className="text-[14px] text-slate-500 dark:text-fg-muted mt-1 font-normal">
                Official academic notifications, circulars, and departmental announcements.
              </p>
            </div>

            {/* Dynamic Search Bar */}
            <div className="w-full md:w-96 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-fg-muted" />
              <input
                ref={searchInputRef}
                type="text"
                aria-label="Search notices"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notices by title, ref no, or department..."
                className="w-full h-10 pl-10 pr-12 bg-white dark:bg-surface-2 border border-slate-300 dark:border-line rounded-xl text-xs sm:text-sm text-slate-900 dark:text-fg placeholder:text-slate-400 dark:placeholder:text-fg-muted focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors shadow-xs"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-surface border border-slate-200 dark:border-line text-xs font-mono text-slate-400 dark:text-fg-muted">
                  /
                </kbd>
              </div>
            </div>
          </div>

          {/* Filter Pills Row */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-line/40">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? "bg-brand text-white shadow-xs font-bold"
                      : cat.isUrgent
                      ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/15 border border-rose-500/25"
                      : "bg-white dark:bg-surface text-slate-600 dark:text-fg-muted hover:text-slate-900 dark:hover:text-fg hover:bg-slate-100 dark:hover:bg-surface-2 border border-slate-200 dark:border-line"
                  }`}
                >
                  {cat.isUrgent && (
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
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
        <section className="relative overflow-hidden rounded-2xl bg-rose-500/[0.08] dark:bg-rose-500/[0.07] border border-rose-500/30 p-4 sm:p-5 px-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="mt-1 w-9 h-9 rounded-xl bg-rose-500/15 dark:bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-mono font-bold border border-rose-500/35">
                  PINNED URGENT
                </span>
                <span className="text-xs font-mono text-slate-500 dark:text-fg-muted">
                  Published Oct 22, 2026 • Ref: UC/COE/2026/108
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-fg leading-snug">
                Final Examination Schedule Spring 2026 Released — Verify Exam Hall &amp; Seat Allocation
              </h2>
            </div>
          </div>

          <button
            onClick={handleReadOfficialCircular}
            className="self-start md:self-center flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-surface-2 text-slate-900 dark:text-fg border border-rose-500/40 hover:bg-slate-100 dark:hover:bg-surface-2 transition-colors shrink-0 text-xs sm:text-sm font-semibold shadow-xs cursor-pointer group"
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
            <span className="text-xs font-mono text-slate-500 dark:text-fg-muted font-semibold">
              Feed Archive ({filteredNotices.length} Available)
            </span>
            <span className="text-xs font-mono text-slate-500 dark:text-fg-muted">
              Official Bulletin
            </span>
          </div>

          {filteredNotices.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-surface rounded-2xl border border-slate-200 dark:border-line">
              <FileText className="w-10 h-10 text-slate-400 dark:text-fg-muted mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-800 dark:text-fg">
                No announcements match this filter
              </p>
              <button
                onClick={() => {
                  setActiveCategory("All");
                  setSearchQuery("");
                }}
                className="mt-3 text-xs text-brand hover:underline font-semibold"
              >
                Reset filters
              </button>
            </div>
          ) : (
            filteredNotices.map((notice) => {
              const isSelected =
                selectedNoticeId === notice.id ||
                (Number(selectedNoticeId) > 0 &&
                  OFFICIAL_NOTICES[Number(selectedNoticeId) - 1]?.id === notice.id);

              return (
                <article
                  key={notice.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleSelectNotice(notice.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleSelectNotice(notice.id);
                    }
                  }}
                  className={`p-4 sm:p-5 rounded-2xl cursor-pointer transition-colors duration-150 flex flex-col gap-3 relative border focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                    isSelected
                      ? "bg-white dark:bg-surface-2 border-brand shadow-sm"
                      : "bg-white dark:bg-surface border-slate-200 dark:border-line hover:border-slate-300 dark:hover:border-fg-muted/80 hover:bg-slate-50 dark:hover:bg-surface-2/60"
                  }`}
                >
                  {/* Left Active Indicator Bar */}
                  {isSelected && (
                    <div className="absolute left-0 top-3 bottom-3 w-1 bg-brand rounded-r-md"></div>
                  )}

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-xs font-mono font-bold border ${notice.categoryColor.bg} ${notice.categoryColor.text} ${notice.categoryColor.border}`}
                      >
                        {notice.category}
                      </span>
                      {notice.pinnedUrgent && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                          PINNED
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono text-slate-400 dark:text-fg-muted">
                      {notice.timeStr}
                    </span>
                  </div>

                  <h3
                    className={`text-sm sm:text-base font-bold leading-snug transition-colors ${
                      isSelected
                        ? "text-brand dark:text-brand"
                        : "text-slate-900 dark:text-fg"
                    }`}
                  >
                    {notice.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-fg-muted line-clamp-2 leading-relaxed font-normal">
                    {notice.summary}
                  </p>

                  <div className="flex items-center justify-between pt-2.5 border-t border-slate-200 dark:border-line/60 text-xs">
                    <span className="text-slate-500 dark:text-fg-muted flex items-center gap-1.5 font-medium truncate max-w-[260px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand"></span>
                      {notice.department}
                    </span>

                    {notice.attachmentName && (
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-surface-2 border border-slate-200 dark:border-line text-xs font-mono text-slate-700 dark:text-fg flex items-center gap-1 shrink-0">
                        <Paperclip className="w-3 h-3 text-brand" />
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
          className="col-span-12 lg:col-span-7 lg:sticky lg:top-20 bg-white dark:bg-surface rounded-3xl border border-slate-200 dark:border-line overflow-hidden shadow-sm relative"
        >
          {/* Background University Seal Watermark */}
          <div className="absolute right-4 top-20 pointer-events-none opacity-[0.03] select-none">
            <GraduationCap className="w-72 h-72 text-slate-400 dark:text-white" />
          </div>

          {/* Reader Top Utility Toolbar */}
          <div className="px-6 py-3.5 bg-slate-50 dark:bg-surface-2 border-b border-slate-200 dark:border-line flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono text-brand bg-brand/10 dark:bg-brand/20 px-2.5 py-1 rounded-md border border-brand/30 font-semibold">
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
                className="p-2 rounded-xl bg-white dark:bg-surface border border-slate-200 dark:border-line text-slate-600 dark:text-fg-muted hover:text-slate-900 dark:hover:text-fg hover:bg-slate-100 dark:hover:bg-surface-2 transition-colors cursor-pointer shadow-xs"
              >
                {bookmarkedIds.includes(activeNotice.id) ? (
                  <BookmarkCheck className="w-4 h-4 text-brand" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </button>

              <button
                onClick={handlePrint}
                title="Print Official Circular"
                className="p-2 rounded-xl bg-white dark:bg-surface border border-slate-200 dark:border-line text-slate-600 dark:text-fg-muted hover:text-slate-900 dark:hover:text-fg hover:bg-slate-100 dark:hover:bg-surface-2 transition-colors cursor-pointer shadow-xs"
              >
                <Printer className="w-4 h-4" />
              </button>

              <button
                onClick={handleShare}
                title="Share Notice Link"
                className="p-2 rounded-xl bg-white dark:bg-surface border border-slate-200 dark:border-line text-slate-600 dark:text-fg-muted hover:text-slate-900 dark:hover:text-fg hover:bg-slate-100 dark:hover:bg-surface-2 transition-colors cursor-pointer shadow-xs"
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
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand hover:bg-brand-hover active:scale-[0.98] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
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
            <div className="text-center pb-6 border-b border-slate-200 dark:border-line flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-surface-2 border border-brand/30 flex items-center justify-center text-brand mb-3 shadow-xs">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono text-slate-500 dark:text-fg-muted font-bold">
                {activeNotice.department.toUpperCase()} • UNICAMPUS
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-fg mt-1.5 leading-snug">
                {activeNotice.title}
              </h2>
              <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-4 mt-2.5 text-xs font-mono text-slate-400 dark:text-fg-muted">
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
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-surface-2 border-l-4 border-brand border-t border-r border-b border-slate-200 dark:border-line flex flex-col gap-2 shadow-xs">
                  <span className="text-xs font-mono text-brand font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-brand" />
                    {activeNotice.protocols.title}
                  </span>
                  <ul className="list-disc list-inside text-xs sm:text-sm text-slate-800 dark:text-fg space-y-1.5 font-normal">
                    {activeNotice.protocols.items.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Formatted Schedule Table */}
              {activeNotice.scheduleTable && (
                <div className="mt-2 flex flex-col gap-2.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-fg">
                    {activeNotice.scheduleTable.title}
                  </span>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-line bg-white dark:bg-surface-2/70 shadow-xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-100 dark:bg-surface-2 border-b border-slate-200 dark:border-line text-xs font-mono text-slate-500 dark:text-fg-muted">
                          {activeNotice.scheduleTable.headers.map((h, idx) => (
                            <th key={idx} className="py-2.5 px-4 font-semibold">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-line/60 text-xs sm:text-sm">
                        {activeNotice.scheduleTable.rows.map((row, idx) => (
                          <tr
                            key={idx}
                            className="hover:bg-slate-50 dark:hover:bg-surface-2/50 transition-colors"
                          >
                            <td className="py-3 px-4 font-semibold text-slate-900 dark:text-fg">
                              <span className="text-brand font-mono text-xs block">
                                {row.code}
                              </span>
                              {row.title}
                            </td>
                            <td className="py-3 px-4 text-slate-500 dark:text-fg-muted font-mono text-xs whitespace-nowrap">
                              {row.col1}
                            </td>
                            <td className="py-3 px-4 text-slate-500 dark:text-fg-muted font-mono text-xs whitespace-nowrap">
                              {row.col2}
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-surface border border-slate-200 dark:border-line text-xs font-mono text-slate-900 dark:text-fg whitespace-nowrap inline-block">
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
            <div className="mt-4 pt-6 border-t border-slate-200 dark:border-line flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
              {/* Verification Badging */}
              <div className="flex items-center gap-3">
                <div className="w-13 h-13 rounded-xl bg-slate-100 dark:bg-surface-2 border border-slate-200 dark:border-line p-1.5 flex items-center justify-center shrink-0">
                  {/* Digital QR Code Pattern representation */}
                  <div className="grid grid-cols-4 gap-0.5 w-full h-full p-1 bg-slate-900/10 dark:bg-white/10 rounded">
                    <div className="bg-brand rounded-xs"></div>
                    <div className="bg-brand/40 rounded-xs"></div>
                    <div className="bg-brand rounded-xs"></div>
                    <div className="bg-brand/20 rounded-xs"></div>
                    <div className="bg-brand/30 rounded-xs"></div>
                    <div className="bg-brand rounded-xs"></div>
                    <div className="bg-brand/60 rounded-xs"></div>
                    <div className="bg-brand rounded-xs"></div>
                    <div className="bg-brand rounded-xs"></div>
                    <div className="bg-brand/20 rounded-xs"></div>
                    <div className="bg-brand rounded-xs"></div>
                    <div className="bg-brand/50 rounded-xs"></div>
                    <div className="bg-brand/40 rounded-xs"></div>
                    <div className="bg-brand rounded-xs"></div>
                    <div className="bg-brand/20 rounded-xs"></div>
                    <div className="bg-brand rounded-xs"></div>
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    VERIFIED OFFICIAL CIRCULAR
                  </span>
                  <span className="text-xs font-mono text-slate-500 dark:text-fg-muted">
                    Office of the Controller of Examinations • Ref No. {activeNotice.refNo}
                  </span>
                </div>
              </div>

              {/* Official Digital Signature */}
              <div className="flex flex-col items-start md:items-end">
                <div className="h-8 mb-1 flex items-end">
                  <span className="font-serif italic text-brand text-lg font-bold select-none border-b border-brand/40 pb-0.5">
                    {activeNotice.author}
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-fg">
                  {activeNotice.author}
                </span>
                <span className="text-xs font-mono text-slate-500 dark:text-fg-muted">
                  {activeNotice.authorDesignation}
                </span>
                <span className="text-xs font-mono text-slate-400 dark:text-fg-muted">
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
