"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  OFFICIAL_NOTICES,
  resolveNoticeById,
  type NoticeItem,
} from "./noticeData";
import { NoticeInboxRow } from "./NoticeInboxRow";
import { NoticeCircularCanvas } from "./NoticeCircularCanvas";

interface NoticeboardContentProps {
  initialNoticeId?: string;
}

type CategoryTab =
  | "ALL"
  | "ACADEMIC"
  | "EXAM"
  | "EVENTS"
  | "ADMIN"
  | "URGENT"
  | "SAVED";

export function NoticeboardContent({
  initialNoticeId,
}: NoticeboardContentProps) {
  const searchParams = useSearchParams();
  const rawId = initialNoticeId || searchParams.get("id") || undefined;

  const defaultResolved = useMemo(
    () => resolveNoticeById(rawId),
    [rawId]
  );

  const [selectedId, setSelectedId] = useState<string>(defaultResolved.id);
  const [mobileView, setMobileView] = useState<"list" | "reader">(
    rawId ? "reader" : "list"
  );
  const [selectedCategory, setSelectedCategory] = useState<CategoryTab>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  // Update selected notice if initialNoticeId prop changes
  React.useEffect(() => {
    if (initialNoticeId) {
      queueMicrotask(() => {
        const resolved = resolveNoticeById(initialNoticeId);
        setSelectedId(resolved.id);
        setMobileView("reader");
      });
    }
  }, [initialNoticeId]);

  // Active notice item
  const activeNotice: NoticeItem = useMemo(() => {
    return (
      OFFICIAL_NOTICES.find((n) => n.id === selectedId) ||
      resolveNoticeById(selectedId)
    );
  }, [selectedId]);

  const isBookmarked = useMemo(() => {
    return bookmarkedIds.includes(activeNotice.id);
  }, [bookmarkedIds, activeNotice.id]);

  const toggleBookmark = useCallback(() => {
    setBookmarkedIds((prev) =>
      prev.includes(activeNotice.id)
        ? prev.filter((id) => id !== activeNotice.id)
        : [...prev, activeNotice.id]
    );
  }, [activeNotice.id]);

  // Filter and sort notices
  const filteredNotices = useMemo(() => {
    return OFFICIAL_NOTICES.filter((notice) => {
      // Category filter
      if (selectedCategory === "SAVED") {
        if (!bookmarkedIds.includes(notice.id)) return false;
      } else if (selectedCategory === "URGENT") {
        if (!notice.pinnedUrgent) return false;
      } else if (selectedCategory === "EXAM") {
        if (notice.categoryKey !== "exam") return false;
      } else if (selectedCategory === "ACADEMIC") {
        if (notice.categoryKey !== "academic") return false;
      } else if (selectedCategory === "EVENTS") {
        if (notice.categoryKey !== "events") return false;
      } else if (selectedCategory === "ADMIN") {
        if (notice.categoryKey !== "admin") return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = notice.title.toLowerCase().includes(q);
        const matchesRef = notice.refNo.toLowerCase().includes(q);
        const matchesDept = notice.department.toLowerCase().includes(q);
        const matchesSummary = notice.summary.toLowerCase().includes(q);
        if (!matchesTitle && !matchesRef && !matchesDept && !matchesSummary) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      // Pinned notices first
      if (a.pinnedUrgent && !b.pinnedUrgent) return -1;
      if (!a.pinnedUrgent && b.pinnedUrgent) return 1;
      return 0;
    });
  }, [selectedCategory, searchQuery, bookmarkedIds]);

  const handleSelectNotice = useCallback((id: string) => {
    setSelectedId(id);
    setMobileView("reader");
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `/notices/${id}`);
    }
  }, []);

  const handleResetFilters = useCallback(() => {
    setSelectedCategory("ALL");
    setSearchQuery("");
  }, []);

  return (
    <div className="h-full w-full flex flex-col overflow-hidden bg-canvas">
      {/* Zone 1 — Sleek Full-Width Command & Filter Bar */}
      <nav
        aria-label="Noticeboard filter and search bar"
        className="h-auto lg:h-14 px-4 sm:px-6 py-2.5 lg:py-0 bg-surface border-b border-line flex flex-wrap lg:flex-nowrap items-center justify-between gap-3 shrink-0"
      >
        {/* Left Cluster: Category Filter Rail */}
        <div className="overflow-x-auto flex items-center gap-1.5 py-1">
          <button
            type="button"
            onClick={() => setSelectedCategory("ALL")}
            className={`h-8 px-3 rounded-lg text-xs transition-colors shrink-0 ${
              selectedCategory === "ALL"
                ? "bg-brand-soft text-brand font-semibold"
                : "font-medium text-fg-muted hover:text-fg hover:bg-surface-2"
            }`}
          >
            All ({OFFICIAL_NOTICES.length})
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory("ACADEMIC")}
            className={`h-8 px-3 rounded-lg text-xs transition-colors shrink-0 ${
              selectedCategory === "ACADEMIC"
                ? "bg-brand-soft text-brand font-semibold"
                : "font-medium text-fg-muted hover:text-fg hover:bg-surface-2"
            }`}
          >
            Academic
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory("EXAM")}
            className={`h-8 px-3 rounded-lg text-xs transition-colors shrink-0 ${
              selectedCategory === "EXAM"
                ? "bg-brand-soft text-brand font-semibold"
                : "font-medium text-fg-muted hover:text-fg hover:bg-surface-2"
            }`}
          >
            Exam Schedule
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory("EVENTS")}
            className={`h-8 px-3 rounded-lg text-xs transition-colors shrink-0 ${
              selectedCategory === "EVENTS"
                ? "bg-brand-soft text-brand font-semibold"
                : "font-medium text-fg-muted hover:text-fg hover:bg-surface-2"
            }`}
          >
            Events
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory("ADMIN")}
            className={`h-8 px-3 rounded-lg text-xs transition-colors shrink-0 ${
              selectedCategory === "ADMIN"
                ? "bg-brand-soft text-brand font-semibold"
                : "font-medium text-fg-muted hover:text-fg hover:bg-surface-2"
            }`}
          >
            Administration
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory("URGENT")}
            className={`h-8 px-3 rounded-lg text-xs transition-colors shrink-0 inline-flex items-center gap-1.5 ${
              selectedCategory === "URGENT"
                ? "bg-danger-light text-danger font-semibold"
                : "font-medium text-fg-muted hover:text-fg hover:bg-surface-2"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-danger shrink-0" />
            <span>Urgent</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory("SAVED")}
            className={`h-8 px-3 rounded-lg text-xs transition-colors shrink-0 ${
              selectedCategory === "SAVED"
                ? "bg-brand-soft text-brand font-semibold"
                : "font-medium text-fg-muted hover:text-fg hover:bg-surface-2"
            }`}
          >
            Saved ({bookmarkedIds.length})
          </button>
        </div>

        {/* Right Cluster: Search Input */}
        <div className="w-full sm:w-72 xl:w-80 relative shrink-0">
          <Search className="w-4 h-4 text-fg-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notices, ref no, or dept..."
            className="w-full h-9 pl-9 pr-9 bg-surface-2/70 border border-line rounded-lg text-xs sm:text-sm text-fg placeholder:text-fg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:border-brand transition-colors"
          />
          {searchQuery ? (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-fg-muted hover:text-fg p-0.5 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-fg-muted bg-surface border border-line rounded">
              /
            </kbd>
          )}
        </div>
      </nav>

      {/* Zone 2 — Full-Height Independent 2-Pane Split Workspace */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* Left Pane — Edge-to-Edge Inbox Rail */}
        <aside
          aria-label="Notices inbox rail"
          className={`w-full lg:w-[360px] xl:w-[400px] 2xl:w-[430px] shrink-0 h-full bg-surface border-r border-line flex flex-col overflow-hidden ${
            mobileView === "reader" ? "hidden lg:flex" : "flex"
          }`}
        >
          {/* Rail Sub-header */}
          <div className="px-4 py-2.5 border-b border-line/70 flex items-center justify-between text-xs text-fg-muted shrink-0">
            <span className="font-sans tabular-nums font-medium">
              {filteredNotices.length} circular
              {filteredNotices.length === 1 ? "" : "s"}
            </span>
            <span className="text-fg-subtle">Spring 2026</span>
          </div>

          {/* Scrollable List */}
          <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-line">
            {filteredNotices.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  title="No notices match"
                  description="Try adjusting your search criteria or category filter."
                  action={
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="h-8 px-3 rounded-lg border border-line bg-surface hover:bg-surface-2 text-xs font-medium text-fg transition-colors"
                    >
                      Reset filters
                    </button>
                  }
                />
              </div>
            ) : (
              filteredNotices.map((notice) => (
                <NoticeInboxRow
                  key={notice.id}
                  notice={notice}
                  isSelected={notice.id === activeNotice.id}
                  onClick={() => handleSelectNotice(notice.id)}
                />
              ))
            )}
          </div>
        </aside>

        {/* Right Pane — Spacious Editorial Document Canvas */}
        <div
          className={`flex-1 min-w-0 h-full bg-canvas flex flex-col overflow-hidden ${
            mobileView === "list" ? "hidden lg:flex" : "flex"
          }`}
        >
          <NoticeCircularCanvas
            activeNotice={activeNotice}
            isBookmarked={isBookmarked}
            onToggleBookmark={toggleBookmark}
            onBackToList={() => setMobileView("list")}
          />
        </div>
      </div>
    </div>
  );
}
