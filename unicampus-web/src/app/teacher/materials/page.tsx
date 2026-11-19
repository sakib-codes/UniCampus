"use client";

import { useState } from "react";
import {
  FolderGit2,
  FileText,
  UploadCloud,
  Download,
  Trash2,
  Check,
} from "lucide-react";
import {
  ACTIVE_TERM,
  CANONICAL_COURSES,
  CANONICAL_FACULTY,
} from "@/lib/canonicalCampus";

interface CourseMaterial {
  id: string;
  courseCode: string;
  title: string;
  type: "Slides" | "Lab Manual" | "Syllabus" | "Assignment";
  fileSize: string;
  uploadedAt: string;
  downloads: number;
}

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

export default function TeacherMaterialsPage() {
  const [materials, setMaterials] = useState<CourseMaterial[]>(INITIAL_MATERIALS);
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const assignedCourses = CANONICAL_FACULTY.courses.map(
    (code) => CANONICAL_COURSES[code]
  );

  const filtered = materials.filter((m) => {
    if (selectedCourse === "all") return true;
    return m.courseCode === selectedCourse;
  });

  const handleDownload = (fileName: string) => {
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
  };

  const handleDelete = (id: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
  };

  const handleSimulateUpload = () => {
    const targetCourse =
      selectedCourse === "all" ? CANONICAL_FACULTY.courses[0] : selectedCourse;
    const newDoc: CourseMaterial = {
      id: `mat-${Date.now()}`,
      courseCode: targetCourse,
      title: "Lecture 10: Dynamic Programming & Memoization.pdf",
      type: "Slides",
      fileSize: "3.6 MB",
      uploadedAt: "Today",
      downloads: 0,
    };
    setMaterials([newDoc, ...materials]);
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 2500);
  };

  return (
    <div className="w-full space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-mono text-fg-muted mb-1">
            Course Content • {ACTIVE_TERM} • {CANONICAL_FACULTY.name}
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-fg tracking-tight">
            Course Materials &amp; Lecture Handouts
          </h1>
          <p className="text-xs font-medium text-fg-muted mt-0.5">
            Distribute lecture slides, laboratory manuals, and problem sets to enrolled cohorts
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {uploadSuccess && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-success-light text-success border border-success/30 rounded-xl text-xs font-bold">
              <Check className="w-3.5 h-3.5" />
              <span>Material Uploaded!</span>
            </div>
          )}
          <button
            type="button"
            onClick={handleSimulateUpload}
            className="min-h-[44px] bg-brand text-on-brand hover:bg-brand-hover rounded-xl font-bold px-4 py-2 text-xs inline-flex items-center gap-2 cursor-pointer transition-colors"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload New Document</span>
          </button>
        </div>
      </div>

      {/* Course Filter Bar */}
      <div className="rounded-[20px] bg-surface border border-line p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <label
            htmlFor="materials-course-filter"
            className="text-xs font-bold text-fg-muted shrink-0"
          >
            Filter by Course:
          </label>
          <select
            id="materials-course-filter"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full sm:w-auto min-h-[44px] bg-canvas border border-line text-fg rounded-xl px-3 py-2 font-mono font-bold text-xs focus:outline-none focus:border-brand"
          >
            <option value="all">All Assigned Courses</option>
            {assignedCourses.map((course) => (
              <option key={course.code} value={course.code}>
                {course.code}: {course.title}
              </option>
            ))}
          </select>
        </div>
        <span className="font-mono text-xs text-fg-muted shrink-0">
          {filtered.length} Documents Available
        </span>
      </div>

      {/* Materials Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-[20px] bg-surface border border-line p-12 text-center">
          <FolderGit2 className="w-12 h-12 text-fg-subtle mx-auto mb-3" />
          <h3 className="text-base font-bold text-fg">
            No course documents found
          </h3>
          <p className="text-xs text-fg-muted mt-1">
            Upload a lecture handout above or select another course filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="rounded-[20px] bg-surface border border-line p-5 flex items-start justify-between gap-3 hover:border-fg-muted transition-colors"
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-brand-soft text-brand flex items-center justify-center shrink-0 border border-brand/20">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-brand bg-brand-soft px-1.5 py-0.5 rounded border border-brand/20">
                      {item.courseCode}
                    </span>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-surface-2 text-fg-muted border border-line">
                      {item.type}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-fg truncate">
                    {item.title}
                  </h4>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-fg-muted font-mono mt-1">
                    <span>{item.fileSize}</span>
                    <span aria-hidden="true">•</span>
                    <span>{item.uploadedAt}</span>
                    <span aria-hidden="true">•</span>
                    <span className="text-success font-bold">
                      {item.downloads} downloads
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => handleDownload(item.title)}
                  title="Download Document"
                  aria-label={`Download ${item.title}`}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center text-fg-muted hover:text-brand hover:bg-surface-2 rounded-lg transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  title="Remove Document"
                  aria-label={`Remove ${item.title}`}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center text-fg-muted hover:text-danger hover:bg-danger-light rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

