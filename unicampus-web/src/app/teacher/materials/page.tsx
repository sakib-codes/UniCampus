"use client";

import { useState, useMemo, useRef, useEffect, useCallback, memo } from "react";
import {
  FolderGit2,
  Presentation,
  BookOpen,
  FlaskConical,
  ClipboardList,
  UploadCloud,
  Download,
  Trash2,
  Search,
  X,
  RotateCcw,
  FileUp,
} from "lucide-react";
import {
  ACTIVE_TERM,
  CANONICAL_COURSES,
  CANONICAL_FACULTY,
} from "@/lib/canonicalCampus";
import {
  Modal,
  Toast,
  EmptyState,
  Badge,
  Chip,
  ChipRow,
  type BadgeVariant,
} from "@/components/ui";
import { Select } from "@/components/ui/Select";

type MaterialType = "Slides" | "Lab Manual" | "Syllabus" | "Assignment";
type MaterialFilterType = "All" | MaterialType;

interface CourseMaterial {
  id: string;
  courseCode: string;
  title: string;
  type: MaterialType;
  fileSize: string;
  uploadedAt: string;
  downloads: number;
}

type ToastState =
  | { kind: "uploaded"; title: string; courseCode: string }
  | { kind: "deleted"; item: CourseMaterial; index: number }
  | null;

const MATERIAL_TYPES: readonly MaterialType[] = [
  "Slides",
  "Lab Manual",
  "Syllabus",
  "Assignment",
];

const FILTER_TYPES: readonly MaterialFilterType[] = ["All", ...MATERIAL_TYPES];

const COURSE_TITLE_BY_CODE: Record<string, string> = Object.fromEntries(
  Object.values(CANONICAL_COURSES).map((course) => [course.code, course.title])
);

const MATERIAL_TYPE_META: Record<
  MaterialType,
  {
    icon: typeof Presentation;
    iconBoxClass: string;
    badgeVariant: BadgeVariant;
  }
> = {
  Slides: {
    icon: Presentation,
    iconBoxClass: "bg-brand-soft text-brand border-brand/20",
    badgeVariant: "brand",
  },
  Syllabus: {
    icon: BookOpen,
    iconBoxClass: "bg-surface-2 text-fg-muted border-line",
    badgeVariant: "neutral",
  },
  "Lab Manual": {
    icon: FlaskConical,
    iconBoxClass: "bg-success-light text-success border-success/20",
    badgeVariant: "success",
  },
  Assignment: {
    icon: ClipboardList,
    iconBoxClass: "bg-warning-light text-warning border-warning/20",
    badgeVariant: "warning",
  },
};

const INITIAL_MATERIALS: CourseMaterial[] = [
  {
    id: "mat-1",
    courseCode: "CSE-3101",
    title: "Lecture 09: Shortest Paths & Dijkstra's Algorithm.pdf",
    type: "Slides",
    fileSize: "4.2 MB",
    uploadedAt: "Mar 06, 2026",
    downloads: 48,
  },
  {
    id: "mat-2",
    courseCode: "CSE-3101",
    title: `Syllabus & Course Outline - ${ACTIVE_TERM}.pdf`,
    type: "Syllabus",
    fileSize: "1.1 MB",
    uploadedAt: "Jan 18, 2026",
    downloads: 96,
  },
  {
    id: "mat-3",
    courseCode: "CSE-3102",
    title: "Lab 04: Network Flow & Ford-Fulkerson Implementation.pdf",
    type: "Lab Manual",
    fileSize: "2.8 MB",
    uploadedAt: "Mar 08, 2026",
    downloads: 45,
  },
  {
    id: "mat-4",
    courseCode: "CSE-4109",
    title: "Assignment 02: NP-Completeness & Reductions.pdf",
    type: "Assignment",
    fileSize: "850 KB",
    uploadedAt: "Mar 02, 2026",
    downloads: 36,
  },
];

/** Format a byte count into a human-readable size label. */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}

const MaterialCard = memo(function MaterialCard({
  item,
  onDownload,
  onDelete,
}: {
  item: CourseMaterial;
  onDownload: (fileName: string) => void;
  onDelete: (id: string) => void;
}) {
  const meta = MATERIAL_TYPE_META[item.type];
  const Icon = meta.icon;

  return (
    <div className="rounded-2xl bg-surface border border-line hover:border-fg-subtle/40 p-5 flex items-start justify-between gap-3 transition-colors">
      <div className="flex items-start gap-3.5 min-w-0">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${meta.iconBoxClass}`}
        >
          <Icon className="w-5 h-5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="font-mono text-xs font-semibold text-brand bg-brand-soft px-2 py-0.5 rounded-md border border-brand/20">
              {item.courseCode}
            </span>
            <Badge variant={meta.badgeVariant}>{item.type}</Badge>
          </div>
          <h2
            className="font-semibold text-sm text-fg truncate"
            title={item.title}
          >
            {item.title}
          </h2>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-sans tabular-nums text-fg-muted mt-1.5">
            <span>{item.fileSize}</span>
            <span className="text-fg-subtle" aria-hidden="true">
              •
            </span>
            <span>{item.uploadedAt}</span>
            <span className="text-fg-subtle" aria-hidden="true">
              •
            </span>
            <span className="inline-flex items-center gap-1 font-medium text-fg-muted">
              <Download className="w-3 h-3 text-fg-subtle" aria-hidden="true" />
              <span>{item.downloads} downloads</span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={() => onDownload(item.title)}
          title="Download Document"
          aria-label={`Download ${item.title}`}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center text-fg-muted hover:text-brand hover:bg-surface-2 rounded-xl transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <Download className="w-4 h-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(item.id)}
          title="Remove Document"
          aria-label={`Remove ${item.title}`}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center text-fg-muted hover:text-danger hover:bg-danger-light rounded-xl transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <Trash2 className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
});

export default function TeacherMaterialsPage() {
  const [materials, setMaterials] = useState<CourseMaterial[]>(INITIAL_MATERIALS);
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedType, setSelectedType] = useState<MaterialFilterType>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastState, setToastState] = useState<ToastState>(null);

  // Upload modal state
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadCourse, setUploadCourse] = useState<string>(
    CANONICAL_FACULTY.courses[0]
  );
  const [uploadType, setUploadType] = useState<MaterialType>("Slides");
  const [uploadTitle, setUploadTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    sizeLabel: string;
  } | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const toastTimerRef = useRef<number | null>(null);

  const assignedCourses = useMemo(
    () => CANONICAL_FACULTY.courses.map((code) => CANONICAL_COURSES[code]),
    []
  );

  const clearToastTimer = useCallback(() => {
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearToastTimer();
    };
  }, [clearToastTimer]);

  const showTimedToast = useCallback(
    (nextToast: NonNullable<ToastState>, durationMs: number) => {
      clearToastTimer();
      setToastState(nextToast);
      toastTimerRef.current = window.setTimeout(() => {
        setToastState(null);
        toastTimerRef.current = null;
      }, durationMs);
    },
    [clearToastTimer]
  );

  const dismissToast = useCallback(() => {
    clearToastTimer();
    setToastState(null);
  }, [clearToastTimer]);

  const courseAndSearchMatches = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return materials.filter((item) => {
      if (selectedCourse !== "all" && item.courseCode !== selectedCourse) {
        return false;
      }
      if (!query) return true;
      const courseTitle =
        COURSE_TITLE_BY_CODE[item.courseCode]?.toLowerCase() ?? "";
      return (
        item.title.toLowerCase().includes(query) ||
        item.courseCode.toLowerCase().includes(query) ||
        courseTitle.includes(query)
      );
    });
  }, [materials, selectedCourse, searchQuery]);

  const typeCounts = useMemo(() => {
    const counts: Record<MaterialFilterType, number> = {
      All: courseAndSearchMatches.length,
      Slides: 0,
      "Lab Manual": 0,
      Syllabus: 0,
      Assignment: 0,
    };
    for (const item of courseAndSearchMatches) {
      counts[item.type] += 1;
    }
    return counts;
  }, [courseAndSearchMatches]);

  const filtered = useMemo(() => {
    if (selectedType === "All") return courseAndSearchMatches;
    return courseAndSearchMatches.filter((item) => item.type === selectedType);
  }, [courseAndSearchMatches, selectedType]);

  const hasActiveFilters =
    selectedCourse !== "all" ||
    selectedType !== "All" ||
    searchQuery.trim().length > 0;

  const handleClearFilters = useCallback(() => {
    setSelectedCourse("all");
    setSelectedType("All");
    setSearchQuery("");
  }, []);

  const handleDownload = useCallback((fileName: string) => {
    const blob = new Blob([`UniCampus Faculty Material: ${fileName}`], {
      type: "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      const idx = materials.findIndex((m) => m.id === id);
      if (idx === -1) return;
      const target = materials[idx];
      setMaterials((prev) => prev.filter((m) => m.id !== id));
      showTimedToast({ kind: "deleted", item: target, index: idx }, 6000);
    },
    [materials, showTimedToast]
  );

  const handleUndoDelete = useCallback(() => {
    if (toastState?.kind !== "deleted") return;
    const { item, index } = toastState;
    setMaterials((prev) => {
      if (prev.some((m) => m.id === item.id)) return prev;
      const next = [...prev];
      const clampedIndex = Math.max(0, Math.min(index, next.length));
      next.splice(clampedIndex, 0, item);
      return next;
    });
    dismissToast();
  }, [toastState, dismissToast]);

  const openUploadModal = useCallback(() => {
    setUploadCourse(
      selectedCourse === "all" ? CANONICAL_FACULTY.courses[0] : selectedCourse
    );
    setUploadType(selectedType === "All" ? "Slides" : selectedType);
    setUploadTitle("");
    setSelectedFile(null);
    setUploadError("");
    setIsDraggingFile(false);
    setUploadOpen(true);
  }, [selectedCourse, selectedType]);

  const applyPickedFile = useCallback((file: File | undefined | null) => {
    if (!file) return;
    setSelectedFile({
      name: file.name,
      sizeLabel: formatFileSize(file.size),
    });
    setUploadTitle((prev) => (prev.trim() ? prev : file.name));
    setUploadError("");
  }, []);

  const handlePublishMaterial = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const resolvedTitle = uploadTitle.trim() || selectedFile?.name || "";
      if (!resolvedTitle) {
        setUploadError("Enter a document title or choose a file to publish.");
        return;
      }

      const newDoc: CourseMaterial = {
        id: `mat-${Date.now()}`,
        courseCode: uploadCourse,
        title: resolvedTitle,
        type: uploadType,
        fileSize: selectedFile?.sizeLabel ?? "2.4 MB",
        uploadedAt: "Just now",
        downloads: 0,
      };

      setMaterials((prev) => [newDoc, ...prev]);
      setUploadOpen(false);
      showTimedToast(
        { kind: "uploaded", title: resolvedTitle, courseCode: uploadCourse },
        4000
      );
    },
    [uploadTitle, selectedFile, uploadCourse, uploadType, showTimedToast]
  );

  return (
    <div className="w-full space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-fg tracking-tight">
            Course Materials &amp; Lecture Handouts
          </h1>
          <p className="text-[13px] text-fg-muted mt-1">
            {ACTIVE_TERM} • Distribute lecture slides, laboratory manuals, and problem sets
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={openUploadModal}
            className="min-h-[44px] bg-brand text-on-brand hover:bg-brand-hover rounded-xl font-semibold px-4 py-2 text-xs inline-flex items-center gap-2 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
          >
            <UploadCloud className="w-4 h-4" aria-hidden="true" />
            <span>Upload New Document</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-2xl bg-surface border border-line p-4 space-y-3.5">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 min-w-0">
            <Search
              className="w-4 h-4 text-fg-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by title or course..."
              aria-label="Search course materials"
              className="w-full min-h-[44px] bg-surface-2 border border-line text-fg placeholder:text-fg-muted rounded-xl pl-10 pr-10 py-2 text-xs font-sans focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:border-brand transition-colors [&::-webkit-search-cancel-button]:appearance-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="min-w-[36px] min-h-[36px] absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-lg text-fg-muted hover:text-fg hover:bg-surface transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Course Filter Select */}
          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <label
              htmlFor="materials-course-filter"
              className="text-xs font-sans font-medium text-fg-muted shrink-0"
            >
              Course
            </label>
            <Select
              id="materials-course-filter"
              ariaLabel="Filter by course"
              value={selectedCourse}
              onChange={setSelectedCourse}
              options={[
                { value: "all", label: "All Assigned Courses" },
                ...assignedCourses.map((course) => ({
                  value: course.code,
                  label: `${course.code}: ${course.title}`,
                })),
              ]}
              size="md"
              variant="surface2"
              menuAlign="right"
              className="w-full md:w-64"
            />
          </div>
        </div>

        {/* Type Filter Chips & Document Count */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-line/60">
          <ChipRow label="Filter by document type" className="pb-0">
            {FILTER_TYPES.map((type) => (
              <Chip
                key={type}
                tone="brand"
                active={selectedType === type}
                count={typeCounts[type]}
                onClick={() => setSelectedType(type)}
                className="px-3.5 py-2 text-xs"
              >
                {type}
              </Chip>
            ))}
          </ChipRow>

          <span className="font-sans tabular-nums text-xs text-fg-muted shrink-0 whitespace-nowrap">
            {filtered.length} {filtered.length === 1 ? "document" : "documents"}
          </span>
        </div>
      </div>

      {/* Materials Grid or Shared EmptyState */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl bg-surface border border-line">
          <EmptyState
            icon={<FolderGit2 className="w-5 h-5" aria-hidden="true" />}
            title={
              hasActiveFilters
                ? "No matching documents"
                : "No course documents yet"
            }
            description={
              hasActiveFilters
                ? "No course materials match your current search or filter criteria."
                : "Upload lecture slides, lab manuals, or assignments to share them with enrolled cohorts."
            }
            action={
              hasActiveFilters ? (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-surface-2 hover:bg-line/50 border border-line text-fg text-xs font-semibold cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  Clear Filters
                </button>
              ) : (
                <button
                  type="button"
                  onClick={openUploadModal}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-brand hover:bg-brand-hover text-on-brand text-xs font-semibold cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  Upload New Document
                </button>
              )
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <MaterialCard
              key={item.id}
              item={item}
              onDownload={handleDownload}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Upload Course Material Modal */}
      <Modal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        size="md"
        title="Upload Course Material"
        description="Publish lecture slides, lab manuals, or assignments to enrolled students."
        footer={
          <>
            <button
              type="button"
              onClick={() => setUploadOpen(false)}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-surface-2 hover:bg-line/50 border border-line text-fg text-xs font-semibold cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="upload-material-form"
              className="min-h-[44px] px-4 py-2 rounded-xl bg-brand hover:bg-brand-hover text-on-brand text-xs font-semibold cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              Publish Material
            </button>
          </>
        }
      >
        <form
          id="upload-material-form"
          onSubmit={handlePublishMaterial}
          className="space-y-4"
        >
          {/* Course Selector */}
          <div className="space-y-1.5">
            <label
              htmlFor="upload-course-select"
              className="block text-xs font-sans font-medium text-fg"
            >
              Assigned Course
            </label>
            <select
              id="upload-course-select"
              value={uploadCourse}
              onChange={(e) => setUploadCourse(e.target.value)}
              className="w-full min-h-[44px] bg-surface-2 border border-line text-fg rounded-xl px-3 py-2 text-xs font-sans font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:border-brand transition-colors cursor-pointer"
            >
              {assignedCourses.map((course) => (
                <option key={course.code} value={course.code}>
                  {course.code}: {course.title}
                </option>
              ))}
            </select>
          </div>

          {/* Document Type Selector */}
          <div className="space-y-1.5">
            <span className="block text-xs font-sans font-medium text-fg">
              Document Type
            </span>
            <div
              role="group"
              aria-label="Document type"
              className="grid grid-cols-2 sm:grid-cols-4 gap-2"
            >
              {MATERIAL_TYPES.map((type) => {
                const isSelected = uploadType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setUploadType(type)}
                    className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                      isSelected
                        ? "bg-brand-soft text-brand border-brand/40 font-semibold"
                        : "bg-surface-2 text-fg-muted border-line hover:text-fg hover:bg-surface"
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Document Title Input */}
          <div className="space-y-1.5">
            <label
              htmlFor="upload-title-input"
              className="block text-xs font-sans font-medium text-fg"
            >
              Document Title
            </label>
            <input
              id="upload-title-input"
              type="text"
              value={uploadTitle}
              onChange={(e) => {
                setUploadTitle(e.target.value);
                if (uploadError) setUploadError("");
              }}
              placeholder="e.g. Lecture 10: Dynamic Programming & Memoization.pdf"
              className="w-full min-h-[44px] bg-surface-2 border border-line text-fg placeholder:text-fg-muted rounded-xl px-3.5 py-2 text-xs font-sans focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:border-brand transition-colors"
            />
            {uploadError && (
              <p className="text-xs text-danger font-medium">{uploadError}</p>
            )}
          </div>

          {/* Optional File Attachment Dropzone */}
          <div className="space-y-1.5">
            <label
              htmlFor="teacher-material-file-upload"
              className="block text-xs font-sans font-medium text-fg"
            >
              File Attachment <span className="text-fg-muted font-normal">(optional)</span>
            </label>
            <input
              id="teacher-material-file-upload"
              ref={fileInputRef}
              type="file"
              accept=".pdf,.pptx,.docx,.zip"
              onChange={(e) => applyPickedFile(e.target.files?.[0])}
              className="sr-only"
            />
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingFile(true);
              }}
              onDragLeave={() => setIsDraggingFile(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingFile(false);
                applyPickedFile(e.dataTransfer.files?.[0]);
              }}
              className={`rounded-2xl border-2 border-dashed p-5 text-center transition-colors ${
                isDraggingFile
                  ? "border-brand bg-brand-soft/60"
                  : "border-line bg-surface-2/60 hover:border-fg-subtle/50"
              }`}
            >
              {selectedFile ? (
                <div className="flex items-center justify-between gap-3 text-left">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-brand-soft text-brand border border-brand/20 flex items-center justify-center shrink-0">
                      <FileUp className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-fg truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-fg-muted font-sans tabular-nums">
                        {selectedFile.sizeLabel}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    aria-label="Remove attached file"
                    className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-xl text-fg-muted hover:text-fg hover:bg-surface transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-surface border border-line text-brand flex items-center justify-center">
                    <UploadCloud className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <p className="text-xs font-medium text-fg">
                    Drag and drop a file here, or{" "}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-brand hover:underline font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
                    >
                      browse files
                    </button>
                  </p>
                  <p className="text-xs text-fg-muted">
                    PDF, PPTX, DOCX, or ZIP • Defaults to 2.4 MB if published by title
                  </p>
                </div>
              )}
            </div>
          </div>
        </form>
      </Modal>

      {/* Non-intrusive Feedback & Undo Toast */}
      <Toast
        open={toastState !== null}
        onClose={dismissToast}
        tone={toastState?.kind === "uploaded" ? "success" : "neutral"}
        title={
          toastState?.kind === "uploaded"
            ? "Material published"
            : toastState?.kind === "deleted"
            ? "Document removed"
            : undefined
        }
        message={
          toastState?.kind === "uploaded"
            ? `Published "${toastState.title}" to ${toastState.courseCode}.`
            : toastState?.kind === "deleted"
            ? `Removed "${toastState.item.title}"`
            : ""
        }
        action={
          toastState?.kind === "deleted" ? (
            <button
              type="button"
              onClick={handleUndoDelete}
              className="min-h-[36px] px-3 py-1.5 rounded-lg bg-brand-soft hover:bg-brand/20 text-brand text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Undo</span>
            </button>
          ) : undefined
        }
      />
    </div>
  );
}

