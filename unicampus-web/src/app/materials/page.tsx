"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Download, 
  Search, 
  Check, 
  BookOpen, 
  Sparkles,
  FolderDown, 
  Eye, 
  Copy, 
  Folder, 
  CloudDownload, 
  RefreshCw, 
  Bookmark, 
  X, 
  ChevronDown,
  MoreVertical
} from "lucide-react";
import ProfileAvatar from "@/components/common/ProfileAvatar";

type MaterialItem = {
  id: string;
  courseCode: string;
  courseName: string;
  title: string;
  instructor: string;
  instructorAvatar?: string;
  uploadedAt: string;
  fileSize: string;
  moduleTag: string;
  format: "PDF" | "ZIP" | "PPTX" | "SQL";
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  downloads: number;
};

type CourseGroup = {
  courseCode: string;
  courseName: string;
  totalFiles: number;
  modulesCount: number;
  items: MaterialItem[];
};

const COURSE_GROUPS: CourseGroup[] = [
  {
    courseCode: "CSE-3101",
    courseName: "Design & Analysis of Algorithms",
    totalFiles: 16,
    modulesCount: 4,
    items: [
      {
        id: "mat-alg-1",
        courseCode: "CSE-3101",
        courseName: "Design & Analysis of Algorithms",
        title: "Lecture 08: Dynamic Programming & Greedy Algorithms",
        instructor: "Dr. Asif Rahman",
        uploadedAt: "Oct 20, 2026",
        fileSize: "4.2 MB",
        moduleTag: "Module 4",
        format: "PDF",
        badgeBg: "bg-rose-500/10 dark:bg-rose-500/15",
        badgeText: "text-rose-600 dark:text-rose-400",
        badgeBorder: "border-rose-500/30",
        downloads: 84,
      },
      {
        id: "mat-alg-2",
        courseCode: "CSE-3101",
        courseName: "Design & Analysis of Algorithms",
        title: "Lab 05 Starter Code: Bellman-Ford & Floyd-Warshall Templates",
        instructor: "Tanvir Hasan",
        uploadedAt: "Oct 18, 2026",
        fileSize: "1.8 MB",
        moduleTag: "Lab Task",
        format: "ZIP",
        badgeBg: "bg-amber-500/10 dark:bg-amber-500/15",
        badgeText: "text-amber-600 dark:text-amber-400",
        badgeBorder: "border-amber-500/30",
        downloads: 62,
      },
      {
        id: "mat-alg-3",
        courseCode: "CSE-3101",
        courseName: "Design & Analysis of Algorithms",
        title: "Greedy Choice Property & Huffman Coding Reference Notes",
        instructor: "Dr. Asif Rahman",
        uploadedAt: "Oct 12, 2026",
        fileSize: "3.1 MB",
        moduleTag: "Module 3",
        format: "PDF",
        badgeBg: "bg-rose-500/10 dark:bg-rose-500/15",
        badgeText: "text-rose-600 dark:text-rose-400",
        badgeBorder: "border-rose-500/30",
        downloads: 47,
      },
    ],
  },
  {
    courseCode: "CSE-3205",
    courseName: "Software Engineering & System Design",
    totalFiles: 14,
    modulesCount: 5,
    items: [
      {
        id: "mat-se-1",
        courseCode: "CSE-3205",
        courseName: "Software Engineering & System Design",
        title: "Lecture 06: Microservices Architecture & Event-Driven Patterns",
        instructor: "Dr. Farhana Khan",
        uploadedAt: "Oct 19, 2026",
        fileSize: "6.5 MB",
        moduleTag: "Module 3",
        format: "PPTX",
        badgeBg: "bg-orange-500/10 dark:bg-orange-500/15",
        badgeText: "text-orange-600 dark:text-orange-400",
        badgeBorder: "border-orange-500/30",
        downloads: 112,
      },
      {
        id: "mat-se-2",
        courseCode: "CSE-3205",
        courseName: "Software Engineering & System Design",
        title: "Spring 2025 Midterm Question Paper & Rubric (Solved)",
        instructor: "Dr. Farhana Khan",
        uploadedAt: "Oct 15, 2026",
        fileSize: "2.9 MB",
        moduleTag: "Past Papers Archive",
        format: "PDF",
        badgeBg: "bg-rose-500/10 dark:bg-rose-500/15",
        badgeText: "text-rose-600 dark:text-rose-400",
        badgeBorder: "border-rose-500/30",
        downloads: 145,
      },
      {
        id: "mat-se-3",
        courseCode: "CSE-3205",
        courseName: "Software Engineering & System Design",
        title: "Agile Sprint Backlog & Jira Storyboard Templates",
        instructor: "Sadia Afrin",
        uploadedAt: "Oct 14, 2026",
        fileSize: "4.0 MB",
        moduleTag: "Studio Resource",
        format: "ZIP",
        badgeBg: "bg-amber-500/10 dark:bg-amber-500/15",
        badgeText: "text-amber-600 dark:text-amber-400",
        badgeBorder: "border-amber-500/30",
        downloads: 73,
      },
    ],
  },
  {
    courseCode: "CSE-3102",
    courseName: "Database Systems & Engineering",
    totalFiles: 12,
    modulesCount: 4,
    items: [
      {
        id: "mat-db-1",
        courseCode: "CSE-3102",
        courseName: "Database Systems & Engineering",
        title: "Lecture 05: SQL Query Optimization & B-Tree Indexing",
        instructor: "Prof. Mahmudul Hasan",
        uploadedAt: "Oct 17, 2026",
        fileSize: "3.8 MB",
        moduleTag: "Module 2",
        format: "PDF",
        badgeBg: "bg-rose-500/10 dark:bg-rose-500/15",
        badgeText: "text-rose-600 dark:text-rose-400",
        badgeBorder: "border-rose-500/30",
        downloads: 98,
      },
      {
        id: "mat-db-2",
        courseCode: "CSE-3102",
        courseName: "Database Systems & Engineering",
        title: "PostgreSQL E-Commerce Schema & Seed Migrations (.SQL)",
        instructor: "Prof. Mahmudul Hasan",
        uploadedAt: "Oct 10, 2026",
        fileSize: "1.2 MB",
        moduleTag: "Lab Dataset",
        format: "SQL",
        badgeBg: "bg-emerald-500/10 dark:bg-emerald-500/15",
        badgeText: "text-emerald-600 dark:text-emerald-400",
        badgeBorder: "border-emerald-500/30",
        downloads: 65,
      },
    ],
  },
];

const courseFilterOptions = [
  { id: "all", label: "All Courses" },
  { id: "CSE-3101", label: "CSE-3101 Algorithms" },
  { id: "CSE-3205", label: "CSE-3205 Software Eng" },
  { id: "CSE-3102", label: "CSE-3102 Database" },
];

const typeFilterOptions = [
  { id: "all", label: "All Types" },
  { id: "PDF", label: "Lecture Notes (.PDF)" },
  { id: "PPTX", label: "Slides (.PPTX)" },
  { id: "ZIP", label: "Code Archives (.ZIP)" },
  { id: "SQL", label: "Databases (.SQL)" },
];

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
  const [savedItemIds, setSavedItemIds] = useState<string[]>(["mat-alg-1", "mat-se-2"]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

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

  const filteredGroups = useMemo(() => {
    return COURSE_GROUPS.map((group) => {
      // Course level filter
      if (selectedCourse !== "all" && group.courseCode !== selectedCourse) {
        return null;
      }

      // Filter items inside the group
      const matchingItems = group.items.filter((item) => {
        // Saved items toggle
        if (savedItemsOnly && !savedItemIds.includes(item.id)) {
          return false;
        }

        // Type filter
        if (selectedType !== "all" && item.format !== selectedType) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesTitle = item.title.toLowerCase().includes(q);
          const matchesInst = item.instructor.toLowerCase().includes(q);
          const matchesTag = item.moduleTag.toLowerCase().includes(q);
          const matchesCode = item.courseCode.toLowerCase().includes(q);
          return matchesTitle || matchesInst || matchesTag || matchesCode;
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

  const handleDownload = (item: MaterialItem) => {
    setDownloadingId(item.id);
    const blob = new Blob([`UniCampus Academic Material\nTitle: ${item.title}\nCourse: ${item.courseCode} - ${item.courseName}\nInstructor: ${item.instructor}\nDate: ${item.uploadedAt}`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${item.title.replace(/[/\\?%*:|"<>]/g, "_")}.${item.format.toLowerCase()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => {
      setDownloadingId(null);
    }, 1200);
  };

  const handleDownloadAll = (courseCode: string) => {
    const blob = new Blob([`UniCampus Bundle for ${courseCode}`], { type: "application/zip" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${courseCode}_Course_Bundle_Spring2026.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    alert(`Downloaded complete course package for ${courseCode} (.ZIP)`);
  };

  const handleCopyLink = (item: MaterialItem) => {
    navigator.clipboard.writeText(`https://unicampus.edu/materials/${item.courseCode.toLowerCase()}/${item.id}`);
    setCopiedId(item.id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const toggleSaveItem = (id: string) => {
    setSavedItemIds((prev) => 
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

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
      {/* ========================================================================= */}
      {/* 1. PAGE HEADER ROW                                                        */}
      {/* ========================================================================= */}
      <div className="w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-200 dark:border-line/40">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-brand/10 text-brand border border-brand/25 dark:bg-brand/15 dark:text-brand dark:border-brand/30 text-xs font-mono font-medium">
                ACADEMIC REPOSITORY
              </span>
              <span className="text-[12px] text-slate-500 dark:text-fg-muted">
                • Spring 2026 Enrolled Cohort
              </span>
            </div>
            <h1 className="text-[28px] font-extrabold tracking-[-0.02em] text-slate-900 dark:text-fg leading-tight">
              Course Materials &amp; Study Repository
            </h1>
            <p className="text-[14px] text-slate-500 dark:text-fg-muted font-normal">
              Verified lecture slides, lab manuals, code repositories, and past exam archives.
            </p>
          </div>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSyncCloud}
              className={`h-9 px-4 rounded-xl border text-[13px] font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-xs active:scale-[0.98] ${
                syncSuccess
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                  : "bg-slate-100 hover:bg-slate-200 dark:bg-surface-2 dark:hover:bg-surface-2 border-slate-200 dark:border-line text-slate-800 dark:text-fg"
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin text-brand dark:text-brand" : syncSuccess ? "text-emerald-500" : "text-slate-500 dark:text-fg-muted"}`} />
              <span>{isSyncing ? "Syncing..." : syncSuccess ? "Hub Synchronized" : "Sync Cloud Hub"}</span>
            </button>

            <button
              type="button"
              onClick={() => setSavedItemsOnly(!savedItemsOnly)}
              className={`h-9 px-4 rounded-xl border text-[13px] font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-xs active:scale-[0.98] ${
                savedItemsOnly
                  ? "bg-brand text-white dark:bg-brand border-brand dark:border-brand"
                  : "bg-slate-100 hover:bg-slate-200 dark:bg-surface-2 dark:hover:bg-surface-2 border-slate-200 dark:border-line text-slate-800 dark:text-fg"
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Saved Items ({savedItemIds.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. FILTER & SEARCH TOOLBAR                                                */}
      {/* ========================================================================= */}
      <div className="w-full">
        <section className="p-4 rounded-2xl bg-white dark:bg-surface border border-slate-200 dark:border-line flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 shadow-xs">
          {/* Left: Search input field */}
          <div className="relative w-full lg:max-w-[380px]">
            <Search className="w-4 h-4 text-slate-400 dark:text-fg-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by topic, filename, or instructor..."
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

          {/* Right: Course Filter Pills & Type Dropdown */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Course Selector Pills */}
            <div className="flex items-center overflow-x-auto p-1 rounded-xl bg-slate-100 dark:bg-surface-2 border border-slate-200 dark:border-line/60 gap-1 custom-scrollbar">
              {courseFilterOptions.map((opt) => {
                const isActive = selectedCourse === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedCourse(opt.id)}
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold tracking-tight transition-colors shrink-0 cursor-pointer ${
                      isActive
                        ? "bg-brand text-white dark:bg-brand dark:text-fg shadow-xs"
                        : "text-slate-600 dark:text-fg-muted hover:text-slate-900 dark:hover:text-fg hover:bg-slate-200/60 dark:hover:bg-surface-2"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {/* Type Filter Select */}
            <div className="relative">
              <select
                aria-label="Filter by material type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="h-10 pl-3.5 pr-8 rounded-xl bg-slate-100 dark:bg-surface-2 border border-slate-200 dark:border-line text-[12px] font-semibold text-slate-800 dark:text-fg focus:outline-none focus:border-brand dark:focus:border-brand cursor-pointer appearance-none"
              >
                {typeFilterOptions.map((t) => (
                  <option key={t.id} value={t.id} className="bg-white dark:bg-surface-2">
                    {t.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </section>
      </div>

      {/* ========================================================================= */}
      {/* 3. STORAGE & QUICK STATS BENTO STRIP (3 equal cards across 12 columns)    */}
      {/* ========================================================================= */}
      <div className="w-full">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Total Repository Files */}
          <div className="p-5 rounded-[20px] bg-white dark:bg-surface border border-slate-200 dark:border-line flex items-center justify-between relative overflow-hidden transition-colors duration-200 shadow-2xs hover:border-brand/40 dark:hover:border-brand/40">
            <div className="flex flex-col gap-1 z-10">
              <span className="text-[12px] font-medium text-slate-500 dark:text-fg-muted font-mono">
                Total Repository Files
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-[32px] font-extrabold text-slate-900 dark:text-fg leading-none">
                  48
                </span>
                <span className="text-xs font-mono text-brand dark:text-brand font-medium">
                  Verified assets
                </span>
              </div>
              <span className="text-[12px] text-slate-500 dark:text-fg-muted">
                Across 5 enrolled Spring 2026 courses
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-brand/10 dark:bg-brand/15 border border-brand/20 dark:border-brand/30 flex items-center justify-center text-brand dark:text-brand shrink-0">
              <Folder className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: Offline Sync & Downloads */}
          <div className="p-5 rounded-[20px] bg-white dark:bg-surface border border-slate-200 dark:border-line flex items-center justify-between relative overflow-hidden transition-colors duration-200 shadow-2xs hover:border-sky-500/40 dark:hover:border-sky-400/40">
            <div className="flex flex-col gap-1 z-10">
              <span className="text-[12px] font-medium text-slate-500 dark:text-fg-muted font-mono">
                Downloads this week
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-[32px] font-extrabold text-sky-600 dark:text-sky-400 leading-none">
                  12
                </span>
                <span className="text-xs font-mono text-slate-500 dark:text-fg-muted">
                  files cached
                </span>
              </div>
              <span className="text-[12px] text-slate-500 dark:text-fg-muted">
                142.8 MB offline bundle synced
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 dark:bg-sky-400/15 border border-sky-500/20 dark:border-sky-400/30 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
              <CloudDownload className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Recent Dispatches */}
          <div className="p-5 rounded-[20px] bg-white dark:bg-surface border border-slate-200 dark:border-line flex items-center justify-between relative overflow-hidden transition-colors duration-200 shadow-2xs hover:border-emerald-500/40 dark:hover:border-success/40">
            <div className="flex flex-col gap-1 z-10">
              <span className="text-[12px] font-medium text-slate-500 dark:text-fg-muted font-mono">
                Recent Uploads
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-[32px] font-extrabold text-emerald-600 dark:text-success leading-none">
                  3 new
                </span>
                <span className="text-xs font-mono text-emerald-600 dark:text-success font-medium">
                  today
                </span>
              </div>
              <span className="text-[12px] text-slate-500 dark:text-fg-muted">
                Latest by Dr. Asif Rahman • 2h ago
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 dark:bg-success/15 border border-emerald-500/20 dark:border-success/30 flex items-center justify-center text-emerald-600 dark:text-success shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>
        </section>
      </div>

      {/* ========================================================================= */}
      {/* 4. GROUPED RESOURCE REPOSITORY PANELS (Course Group Containers)           */}
      {/* ========================================================================= */}
      {filteredGroups.length === 0 ? (
        <div className="w-full">
          <div className="p-12 rounded-3xl bg-white dark:bg-surface border border-slate-200 dark:border-line text-center space-y-3">
            <BookOpen className="w-12 h-12 text-slate-300 dark:text-line mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-fg">
              No course resources match your filter criteria
            </h3>
            <p className="text-xs text-slate-500 dark:text-fg-muted max-w-sm mx-auto">
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
              className="px-4 py-2 rounded-xl bg-brand text-white text-xs font-semibold hover:bg-brand-hover transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full">
          <div className="space-y-6">
            {filteredGroups.map((group) => (
              <div key={group.courseCode} className="p-6 rounded-[24px] bg-white dark:bg-surface border border-slate-200 dark:border-line space-y-4 shadow-2xs">
                {/* Course Group Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-200 dark:border-line/60 gap-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-brand/10 text-brand border border-brand/20 dark:bg-brand/15 dark:text-brand dark:border-brand/30">
                      {group.courseCode}
                    </span>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-fg">
                      {group.courseName}
                    </h2>
                    <span className="text-xs font-mono text-slate-500 dark:text-fg-muted">
                      • {group.totalFiles} Files • {group.modulesCount} Modules
                    </span>
                  </div>

                  {/* Right Download All (.ZIP) Button */}
                  <button
                    type="button"
                    onClick={() => handleDownloadAll(group.courseCode)}
                    className="h-8.5 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-surface-2 dark:hover:bg-surface-2 border border-slate-200 dark:border-line text-xs font-semibold text-slate-800 dark:text-fg transition-colors flex items-center gap-1.5 self-start sm:self-center cursor-pointer shadow-xs active:scale-[0.98]"
                  >
                    <FolderDown className="w-3.5 h-3.5 text-brand dark:text-brand" />
                    <span>Download All (.ZIP)</span>
                  </button>
                </div>

                {/* Resource Rows List */}
                <div className="space-y-3">
                  {group.items.map((item) => {
                    const isSaved = savedItemIds.includes(item.id);
                    const isDownloading = downloadingId === item.id;
                    const isCopied = copiedId === item.id;

                    return (
                      <div
                        key={item.id}
                        className="p-4 rounded-xl bg-slate-50/70 dark:bg-surface-2 border border-slate-200 dark:border-line/60 hover:border-brand/40 dark:hover:border-brand/40 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-3 group"
                      >
                        {/* Left: Icon Badge + Title + Metadata */}
                        <div className="flex items-start gap-3.5 min-w-0">
                          {/* Format Badge */}
                          <div
                            className={`w-11 h-11 rounded-xl border flex items-center justify-center font-mono font-bold text-xs shrink-0 ${item.badgeBg} ${item.badgeText} ${item.badgeBorder}`}
                          >
                            {item.format}
                          </div>

                          {/* Title and Metadata */}
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-sm text-slate-900 dark:text-fg group-hover:text-brand dark:group-hover:text-brand transition-colors">
                                {item.title}
                              </h3>
                              <span className="text-xs text-slate-500 dark:text-fg-muted">
                                · {item.moduleTag}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-fg-muted flex-wrap">
                              <div className="flex items-center gap-1.5">
                                <ProfileAvatar alt={item.instructor} size="xs" className="w-4 h-4 border border-slate-300 dark:border-line" />
                                <span>{item.instructor}</span>
                              </div>
                              <span>•</span>
                              <span className="font-mono">{item.fileSize}</span>
                              <span>•</span>
                              <span className="font-mono">{item.uploadedAt}</span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Consolidated Action Buttons */}
                        <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                          {/* Quick Preview Icon Button */}
                          <button
                            type="button"
                            title="Preview In-Browser"
                            onClick={() => setPreviewItem(item)}
                            className="w-8 h-8 rounded-lg bg-white hover:bg-slate-100 dark:bg-surface dark:hover:bg-surface-2 border border-slate-200 dark:border-line text-slate-600 hover:text-slate-900 dark:text-fg-muted dark:hover:text-fg flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Primary Download Button */}
                          <button
                            type="button"
                            onClick={() => handleDownload(item)}
                            className="h-8 px-3.5 rounded-lg bg-brand hover:bg-brand-hover text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>{isDownloading ? "Downloading..." : "Download"}</span>
                          </button>

                          {/* Secondary Menu (...) */}
                          <div className="relative">
                            <button
                              type="button"
                              title="More options"
                              onClick={() => setOpenMenuId(openMenuId === item.id ? null : item.id)}
                              className="w-8 h-8 rounded-lg bg-white hover:bg-slate-100 dark:bg-surface dark:hover:bg-surface-2 border border-slate-200 dark:border-line text-slate-500 hover:text-slate-900 dark:text-fg-muted dark:hover:text-fg flex items-center justify-center transition-colors cursor-pointer"
                            >
                              <MoreVertical className="w-3.5 h-3.5" />
                            </button>
                            {openMenuId === item.id && (
                              <div className="absolute right-0 top-9 w-36 py-1 bg-surface border border-line rounded-xl shadow-lg z-20 text-xs">
                                <button
                                  type="button"
                                  onClick={() => {
                                    toggleSaveItem(item.id);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full px-3 py-1.5 text-left text-fg hover:bg-canvas flex items-center gap-2 cursor-pointer"
                                >
                                  <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-current text-brand" : "text-fg-muted"}`} />
                                  <span>{isSaved ? "Saved" : "Save for Later"}</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleCopyLink(item);
                                    setTimeout(() => setOpenMenuId(null), 800);
                                  }}
                                  className="w-full px-3 py-1.5 text-left text-fg hover:bg-canvas flex items-center gap-2 cursor-pointer"
                                >
                                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-fg-muted" />}
                                  <span>{isCopied ? "Copied!" : "Copy Link"}</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL: IN-BROWSER DOCUMENT PREVIEW                                     */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {previewItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewItem(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative z-10 w-full max-w-4xl max-h-[85vh] bg-white dark:bg-surface border border-slate-200 dark:border-line rounded-3xl p-6 shadow-2xl flex flex-col gap-4 overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-line">
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`font-mono text-xs font-bold px-2 py-0.5 rounded border ${previewItem.badgeBg} ${previewItem.badgeText} ${previewItem.badgeBorder}`}
                  >
                    {previewItem.format}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-bold text-base text-slate-900 dark:text-fg truncate">
                      {previewItem.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-fg-muted font-mono">
                      {previewItem.courseCode} • {previewItem.instructor} • {previewItem.fileSize}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleDownload(previewItem)}
                    className="h-8 px-3 rounded-lg bg-brand hover:bg-brand-hover dark:bg-brand dark:hover:bg-brand-hover text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewItem(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Document Canvas Preview Simulation */}
              <div className="flex-1 min-h-[380px] bg-slate-100 dark:bg-canvas border border-slate-200 dark:border-line rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4 overflow-y-auto">
                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-surface-2 border border-slate-200 dark:border-line flex items-center justify-center text-brand dark:text-brand shadow-xs">
                  <BookOpen className="w-8 h-8" />
                </div>
                <div className="space-y-1.5 max-w-md">
                  <h4 className="font-bold text-base text-slate-900 dark:text-fg">
                    Interactive Document Viewer
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-fg-muted">
                    Rendering authenticated secure stream for <span className="font-mono text-slate-700 dark:text-fg">{previewItem.title}</span>.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white dark:bg-surface-2 border border-slate-200 dark:border-line w-full max-w-lg text-left text-xs font-mono space-y-1.5 text-slate-600 dark:text-fg">
                  <div className="flex justify-between border-b border-slate-200 dark:border-line/60 pb-1">
                    <span className="text-slate-400 dark:text-fg-muted">Course:</span>
                    <span className="font-bold">{previewItem.courseCode} - {previewItem.courseName}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 dark:border-line/60 pb-1">
                    <span className="text-slate-400 dark:text-fg-muted">Syllabus Topic:</span>
                    <span>{previewItem.moduleTag}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 dark:border-line/60 pb-1">
                    <span className="text-slate-400 dark:text-fg-muted">File Type:</span>
                    <span>{previewItem.format} Document</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 dark:text-fg-muted">Published By:</span>
                    <span>{previewItem.instructor} ({previewItem.uploadedAt})</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
