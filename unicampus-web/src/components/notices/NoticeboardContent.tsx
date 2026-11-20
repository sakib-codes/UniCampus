"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Search, FileText, ArrowRight, AlertTriangle, X } from "lucide-react";
import { OFFICIAL_NOTICES } from "@/lib/noticeData";
import { NoticeFeedRow } from "./NoticeFeedRow";
import { NoticeReaderPane } from "./NoticeReaderPane";

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

  // Pinned urgent notice & conditional banner display
  const pinnedUrgentNotice = useMemo(
    () => OFFICIAL_NOTICES.find((n) => n.pinnedUrgent),
    []
  );

  const showUrgentBanner = Boolean(
    pinnedUrgentNotice &&
    activeNotice.id !== pinnedUrgentNotice.id &&
    activeNotice.id !== "not-exam-108"
  );

  const handleSelectNotice = useCallback((id: string) => {
    setUserSelectedId(id);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("id", id);
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  const handleReadOfficialCircular = useCallback(() => {
    handleSelectNotice("not-exam-108");
    if (readerRef.current) {
      readerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [handleSelectNotice]);

  const toggleBookmark = useCallback((id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const handlePrint = useCallback(() => {
    if (typeof window !== "undefined") {
      window.print();
    }
  }, []);

  const handleDownloadPDF = useCallback(() => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setDownloadSuccess(true);

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
  }, [activeNotice]);

  const handleShare = useCallback(() => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  }, []);

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
      {/* 1. TOP HEADER & FILTER BAR */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-semibold text-fg tracking-tight leading-tight">
              Campus Noticeboard
            </h1>
            <p className="text-xs sm:text-sm text-fg-muted mt-1 font-sans">
              Official academic notifications, circulars, and departmental announcements.
            </p>
          </div>

          {/* Dynamic Search Bar */}
          <div className="w-full md:max-w-96 relative shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-muted pointer-events-none" aria-hidden="true" />
            <input
              ref={searchInputRef}
              type="text"
              aria-label="Search notices"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notices, ref no, or dept..."
              className="w-full min-h-[44px] pl-10 pr-12 bg-surface-2 border border-line rounded-xl text-xs sm:text-sm text-fg placeholder:text-fg-muted focus-visible:outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand transition-colors"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    searchInputRef.current?.focus();
                  }}
                  aria-label="Clear search"
                  className="p-1 rounded-md text-fg-muted hover:text-fg hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              ) : (
                <kbd className="px-1.5 py-0.5 rounded bg-surface border border-line text-xs font-mono text-fg-muted pointer-events-none select-none">
                  /
                </kbd>
              )}
            </div>
          </div>
        </div>

        {/* Filter Pills Row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-line">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                  isActive
                    ? cat.isUrgent
                      ? "bg-danger text-on-brand"
                      : "bg-brand text-on-brand"
                    : "bg-surface text-fg-muted hover:text-fg hover:bg-surface-2 border border-line"
                }`}
              >
                {cat.isUrgent && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-on-brand" : "bg-danger"}`}
                    aria-hidden="true"
                  />
                )}
                {cat.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. PINNED URGENT NOTICE BANNER */}
      {showUrgentBanner && pinnedUrgentNotice && (
        <section className="relative overflow-hidden rounded-2xl bg-danger-light/60 border border-danger/25 p-4 sm:p-5 px-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4 min-w-0">
            <div className="mt-0.5 w-9 h-9 rounded-xl bg-danger-light border border-danger/25 flex items-center justify-center text-danger shrink-0">
              <AlertTriangle className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-danger-light text-danger text-xs font-sans font-semibold border border-danger/30">
                  PINNED URGENT
                </span>
                <span className="text-xs font-sans tabular-nums text-fg-muted">
                  Published Oct 22, 2026 • Ref: <span className="font-mono">{pinnedUrgentNotice.refNo}</span>
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-semibold text-fg leading-snug">
                {pinnedUrgentNotice.title} — Verify Exam Hall &amp; Seat Allocation
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={handleReadOfficialCircular}
            className="self-start md:self-center min-h-[44px] flex items-center gap-2 px-4 py-2 rounded-xl bg-surface text-fg border border-danger/30 hover:bg-surface-2 transition-colors shrink-0 text-xs sm:text-sm font-semibold cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <span>Read Official Circular</span>
            <ArrowRight className="w-4 h-4 text-danger group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
          </button>
        </section>
      )}

      {/* 3. MASTER-DETAIL SPLIT WORKSPACE (Feed 42% / Reader 58%) */}
      <div className="grid grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: SCROLLABLE FEED LIST */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-sans tabular-nums text-fg-muted font-semibold">
              Feed Archive ({filteredNotices.length} Available)
            </span>
            <span className="text-xs font-sans text-fg-muted">
              Official Bulletin
            </span>
          </div>

          {filteredNotices.length === 0 ? (
            <div className="p-8 text-center bg-surface rounded-2xl border border-line">
              <FileText className="w-10 h-10 text-fg-muted mx-auto mb-2" aria-hidden="true" />
              <p className="text-sm font-semibold text-fg">
                No announcements match this filter
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory("All");
                  setSearchQuery("");
                }}
                className="mt-3 min-h-[44px] px-4 py-2 rounded-xl text-xs text-brand hover:bg-brand-soft font-semibold cursor-pointer"
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
                <NoticeFeedRow
                  key={notice.id}
                  notice={notice}
                  isSelected={isSelected}
                  onSelect={handleSelectNotice}
                />
              );
            })
          )}
        </div>

        {/* RIGHT COLUMN: STICKY OFFICIAL CIRCULAR READER */}
        <NoticeReaderPane
          readerRef={readerRef}
          activeNotice={activeNotice}
          isBookmarked={bookmarkedIds.includes(activeNotice.id)}
          copiedShare={copiedShare}
          isDownloading={isDownloading}
          downloadSuccess={downloadSuccess}
          onToggleBookmark={toggleBookmark}
          onPrint={handlePrint}
          onShare={handleShare}
          onDownloadPDF={handleDownloadPDF}
        />
      </div>
    </div>
  );
}
