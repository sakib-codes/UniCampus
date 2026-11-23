"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import {
  Search,
  BookOpen,
  RefreshCw,
  Bookmark,
  X,
} from "lucide-react";
import { Select } from "@/components/ui/Select";
import {
  COURSE_GROUPS,
  COURSE_FILTER_OPTIONS,
  TYPE_FILTER_OPTIONS,
  CourseGroup,
  MaterialItem,
} from "@/components/materials/materialsData";
import { MaterialsStatsStrip } from "@/components/materials/MaterialsStatsStrip";
import { CourseResourceGroup } from "@/components/materials/CourseResourceGroup";
import { MaterialPreviewModal } from "@/components/materials/MaterialPreviewModal";

export default function StudentMaterialsPage() {
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<MaterialItem | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [savedItemsOnly, setSavedItemsOnly] = useState(false);
  const [savedItemIds, setSavedItemIds] = useState<string[]>([
    "mat-alg-1",
    "mat-se-2",
  ]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener: "/" to focus search
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

  const filteredGroups = useMemo(() => {
    return COURSE_GROUPS.map((group) => {
      if (selectedCourse !== "all" && group.courseCode !== selectedCourse) {
        return null;
      }

      const matchingItems = group.items.filter((item) => {
        if (savedItemsOnly && !savedItemIds.includes(item.id)) {
          return false;
        }
        if (selectedType !== "all" && item.format !== selectedType) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          return (
            item.title.toLowerCase().includes(q) ||
            item.instructor.toLowerCase().includes(q) ||
            item.moduleTag.toLowerCase().includes(q) ||
            item.courseCode.toLowerCase().includes(q)
          );
        }
        return true;
      });

      if (matchingItems.length === 0) return null;

      return {
        ...group,
        items: matchingItems,
      };
    }).filter(Boolean) as CourseGroup[];
  }, [selectedCourse, selectedType, searchQuery, savedItemsOnly, savedItemIds]);

  const handleDownload = useCallback((item: MaterialItem) => {
    setDownloadingId(item.id);
    const blob = new Blob(
      [`UniCampus Academic Material\nTitle: ${item.title}\nCourse: ${item.courseCode} - ${item.courseName}\nInstructor: ${item.instructor}\nDate: ${item.uploadedAt}`],
      { type: "text/plain" }
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${item.title.replace(/[/\\?%*:|"<>]/g, "_")}.${item.format.toLowerCase()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => setDownloadingId(null), 1200);
  }, []);

  const handleDownloadAll = useCallback((courseCode: string) => {
    const blob = new Blob([`UniCampus Bundle for ${courseCode}`], { type: "application/zip" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${courseCode}_Course_Bundle_Spring2026.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    alert(`Downloaded complete course package for ${courseCode} (.ZIP)`);
  }, []);

  const handleCopyLink = useCallback((item: MaterialItem) => {
    navigator.clipboard.writeText(`https://unicampus.edu/materials/${item.courseCode.toLowerCase()}/${item.id}`);
    setCopiedId(item.id);
    setTimeout(() => {
      setCopiedId(null);
      setOpenMenuId(null);
    }, 800);
  }, []);

  const handleToggleSave = useCallback((id: string) => {
    setSavedItemIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
    setOpenMenuId(null);
  }, []);

  const handleToggleMenu = useCallback((id: string) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  }, []);

  const handleSyncCloud = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 2500);
    }, 1500);
  };

  return (
    <div className="w-full space-y-6 pb-16">
      {/* 1. PAGE HEADER ROW */}
      <div className="w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-3 border-b border-line">
          <div className="flex flex-col gap-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-brand-soft text-brand border border-brand/25 text-xs font-sans font-semibold">
                ACADEMIC REPOSITORY
              </span>
              <span className="text-xs text-fg-muted">
                • 3rd Year · 6th Semester Enrolled Cohort
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-fg leading-tight">
              Course Materials &amp; Study Repository
            </h1>
            <p className="text-xs sm:text-sm text-fg-muted font-normal">
              Verified lecture slides, lab manuals, code repositories, and past exam archives.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleSyncCloud}
              className={`min-h-[40px] px-4 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                syncSuccess
                  ? "bg-success-light text-success border-success/30"
                  : "bg-surface hover:bg-surface-2 border-line text-fg"
              }`}
            >
              <RefreshCw
                className={`w-4 h-4 ${
                  isSyncing
                    ? "animate-spin text-brand"
                    : syncSuccess
                    ? "text-success"
                    : "text-fg-muted"
                }`}
                aria-hidden="true"
              />
              <span>
                {isSyncing
                  ? "Syncing..."
                  : syncSuccess
                  ? "Hub Synchronized"
                  : "Sync Cloud Hub"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSavedItemsOnly(!savedItemsOnly)}
              className={`min-h-[40px] px-4 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                savedItemsOnly
                  ? "bg-brand text-on-brand border-brand"
                  : "bg-surface hover:bg-surface-2 border-line text-fg"
              }`}
            >
              <Bookmark className="w-4 h-4" aria-hidden="true" />
              <span className="tabular-nums">
                Saved Items ({savedItemIds.length})
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. FILTER & SEARCH TOOLBAR */}
      <div className="w-full">
        <section className="p-4 rounded-2xl bg-surface border border-line flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="relative w-full lg:max-w-[380px] min-w-0">
            <Search
              className="w-4 h-4 text-fg-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              ref={searchInputRef}
              type="text"
              aria-label="Filter materials by topic, filename, or instructor"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by topic, filename, or instructor..."
              className="w-full min-h-[44px] pl-10 pr-10 rounded-xl bg-surface-2 border border-line text-xs sm:text-sm text-fg placeholder:text-fg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:border-brand transition-colors"
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

          <div className="flex flex-wrap items-center gap-2.5 min-w-0">
            <div className="flex items-center overflow-x-auto p-1 rounded-xl bg-surface-2 border border-line gap-1 max-w-full">
              {COURSE_FILTER_OPTIONS.map((opt) => {
                const isActive = selectedCourse === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedCourse(opt.id)}
                    className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-medium tracking-tight transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                      isActive
                        ? "bg-surface text-fg font-semibold border border-line/80 shadow-2xs"
                        : "text-fg-muted hover:text-fg"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            <Select
              ariaLabel="Filter by material type"
              value={selectedType}
              onChange={setSelectedType}
              options={TYPE_FILTER_OPTIONS.map((t) => ({ value: t.id, label: t.label }))}
              size="md"
              variant="surface2"
              menuAlign="right"
              className="w-40 shrink-0"
            />
          </div>
        </section>
      </div>

      {/* 3. STORAGE & QUICK STATS BENTO STRIP */}
      <MaterialsStatsStrip />

      {/* 4. GROUPED RESOURCE REPOSITORY PANELS */}
      {filteredGroups.length === 0 ? (
        <div className="w-full">
          <div className="p-12 rounded-2xl bg-surface border border-line text-center space-y-3">
            <BookOpen className="w-12 h-12 text-fg-subtle mx-auto" aria-hidden="true" />
            <h3 className="text-base font-semibold text-fg">
              No course resources match your filter criteria
            </h3>
            <p className="text-xs text-fg-muted max-w-sm mx-auto">
              Try searching with different keywords or reset your course filter pills.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCourse("all");
                setSelectedType("all");
                setSavedItemsOnly(false);
              }}
              className="min-h-[40px] px-4 py-2 rounded-xl bg-brand text-on-brand text-xs font-semibold hover:bg-brand-hover transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full space-y-6">
          {filteredGroups.map((group) => (
            <CourseResourceGroup
              key={group.courseCode}
              group={group}
              savedItemIds={savedItemIds}
              downloadingId={downloadingId}
              copiedId={copiedId}
              openMenuId={openMenuId}
              onDownloadAll={handleDownloadAll}
              onPreview={setPreviewItem}
              onDownload={handleDownload}
              onToggleMenu={handleToggleMenu}
              onToggleSave={handleToggleSave}
              onCopyLink={handleCopyLink}
            />
          ))}
        </div>
      )}

      {/* 5. MODAL: IN-BROWSER DOCUMENT PREVIEW */}
      <MaterialPreviewModal
        previewItem={previewItem}
        onClose={() => setPreviewItem(null)}
        onDownload={handleDownload}
      />
    </div>
  );
}
