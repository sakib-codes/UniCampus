"use client";

import { useState } from "react";
import { 
  FolderGit2, 
  FileText, 
  UploadCloud, 
  Download, 
  Trash2, 
  Plus, 
  FileCode,
  FileCheck,
  Check
} from "lucide-react";
import { themeTokens } from "@/lib/theme";
import SpotlightCard from "@/components/bits/SpotlightCard";
import ClickSpark from "@/components/bits/ClickSpark";
import DecryptedText from "@/components/bits/DecryptedText";

interface CourseMaterial {
  id: string;
  courseCode: string;
  title: string;
  type: 'Slides' | 'Lab Manual' | 'Syllabus' | 'Assignment';
  fileSize: string;
  uploadedAt: string;
  downloads: number;
}

const INITIAL_MATERIALS: CourseMaterial[] = [
  { id: 'mat-1', courseCode: 'CSE-311', title: 'Chapter 04: Relational Algebra & SQL DDL.pdf', type: 'Slides', fileSize: '4.2 MB', uploadedAt: 'Sep 06, 2026', downloads: 48 },
  { id: 'mat-2', courseCode: 'CSE-311', title: 'Syllabus & Course Outline - Fall 2026.pdf', type: 'Syllabus', fileSize: '1.1 MB', uploadedAt: 'Aug 28, 2026', downloads: 96 },
  { id: 'mat-3', courseCode: 'CSE-402', title: 'Lab 03: PyTorch Deep Learning Primer.ipynb', type: 'Lab Manual', fileSize: '2.8 MB', uploadedAt: 'Sep 08, 2026', downloads: 36 },
  { id: 'mat-4', courseCode: 'CSE-401', title: 'Assignment 01: Backpropagation Algorithms.pdf', type: 'Assignment', fileSize: '850 KB', uploadedAt: 'Sep 02, 2026', downloads: 41 },
];

export default function TeacherMaterialsPage() {
  const [materials, setMaterials] = useState<CourseMaterial[]>(INITIAL_MATERIALS);
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const filtered = materials.filter((m) => {
    if (selectedCourse === 'all') return true;
    return m.courseCode === selectedCourse;
  });

  const handleDownload = (fileName: string) => {
    const blob = new Blob([`UniCampus Faculty Material: ${fileName}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDelete = (id: string) => {
    setMaterials(prev => prev.filter(m => m.id !== id));
  };

  const handleSimulateUpload = () => {
    const newDoc: CourseMaterial = {
      id: `mat-${Date.now()}`,
      courseCode: selectedCourse === 'all' ? 'CSE-311' : selectedCourse,
      title: 'Lecture 05: Indexing & B-Trees Optimization.pdf',
      type: 'Slides',
      fileSize: '3.6 MB',
      uploadedAt: 'Today',
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
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              ACADEMIC REPOSITORY
            </span>
            <span className="text-xs text-slate-400 dark:text-[#6E747D] font-mono">• Course Content</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-[#F0F6FC] tracking-tight">
            Course Materials &amp; Lecture Handouts
          </h1>
          <p className="text-xs font-medium text-slate-500 dark:text-[#8D96A0] mt-0.5">
            Distribute lecture slides, laboratory manuals, and problem sets to enrolled cohorts
          </p>
        </div>

        <div className="flex items-center gap-2">
          {uploadSuccess && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold">
              <Check className="w-3.5 h-3.5" />
              <span>Material Uploaded!</span>
            </div>
          )}
          <ClickSpark sparkColor="#1D5BD8" sparkCount={8} sparkRadius={22}>
            <button
              onClick={handleSimulateUpload}
              className={`${themeTokens.btnHero} px-4 py-2 text-xs flex items-center gap-2 cursor-pointer shadow-md`}
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload New Document</span>
            </button>
          </ClickSpark>
        </div>
      </div>

      {/* Course Filter Bar */}
      <div className={`${themeTokens.card} p-4 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-500 dark:text-[#6E747D]">Filter by Course:</span>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className={`${themeTokens.select} px-3 py-1.5 font-mono font-bold text-xs`}
          >
            <option value="all">All Assigned Courses</option>
            <option value="CSE-311">CSE-311: DBMS</option>
            <option value="CSE-401">CSE-401: AI</option>
            <option value="CSE-402">CSE-402: AI Lab</option>
          </select>
        </div>
        <span className="font-mono text-xs text-slate-400 dark:text-[#6E747D]">
          {filtered.length} Documents Available
        </span>
      </div>

      {/* Materials Grid */}
      {filtered.length === 0 ? (
        <div className={`${themeTokens.card} p-12 text-center`}>
          <FolderGit2 className="w-12 h-12 text-slate-300 dark:text-[#30363D] mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-[#F0F6FC]">
            No course documents found
          </h3>
          <p className={`text-xs ${themeTokens.textMuted} mt-1`}>
            Upload a lecture handout above or select another course filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <SpotlightCard
              key={item.id}
              className={`${themeTokens.card} p-5 flex items-start justify-between gap-4 hover:border-slate-400 dark:hover:border-[#6E747D] transition-all`}
              spotlightColor="rgba(99, 102, 241, 0.12)"
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0 border border-brand/20">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] font-bold text-brand bg-brand/10 px-1.5 py-0.2 rounded border border-brand/20">
                      <DecryptedText text={item.courseCode} speed={30} maxIterations={8} animateOn="hover" />
                    </span>
                    <span className="font-mono text-[10px] font-bold px-2 py-0.2 rounded bg-slate-100 dark:bg-[#161B22] text-slate-600 dark:text-[#8D96A0] border border-slate-200 dark:border-[#30363D]">
                      {item.type}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-[#F0F6FC] truncate">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 dark:text-[#6E747D] font-mono mt-1">
                    <span>{item.fileSize}</span>
                    <span>•</span>
                    <span>{item.uploadedAt}</span>
                    <span>•</span>
                    <span className="text-emerald-500 font-bold">{item.downloads} downloads</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <ClickSpark sparkColor="#10b981" sparkCount={6} sparkRadius={18}>
                  <button 
                    onClick={() => handleDownload(item.title)}
                    title="Download Document"
                    aria-label="Download Document"
                    className="p-2 text-slate-500 hover:text-brand hover:bg-slate-100 dark:hover:bg-[#161B22] rounded-lg transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </ClickSpark>
                <ClickSpark sparkColor="#f43f5e" sparkCount={5} sparkRadius={16}>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    title="Remove Document"
                    aria-label="Remove Document"
                    className="p-2 text-slate-400 dark:text-[#6E747D] hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </ClickSpark>
              </div>
            </SpotlightCard>
          ))}
        </div>
      )}
    </div>
  );
}

