"use client";

import { useCallback, useMemo, useState } from "react";
import { Download, Sliders } from "lucide-react";
import {
  courseDatabase,
  gradePointsMap,
  initialSimCourses,
  semesterMilestones,
  ProgressKpiBento,
  SemesterProgressionChart,
  CourseBreakdownTable,
  GpaSimulatorModal,
  TranscriptPreviewModal,
  type GradeScale,
  type SimCourse,
} from "@/components/progress";

export default function AcademicProgressPage() {
  const [selectedSemesterTab, setSelectedSemesterTab] = useState<string>("sem-5");
  const [searchFilter, setSearchFilter] = useState<string>("");

  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);
  const [isTranscriptOpen, setIsTranscriptOpen] = useState<boolean>(false);
  const [transcriptSemester, setTranscriptSemester] = useState<string>("all");
  const [simCourses, setSimCourses] = useState<SimCourse[]>(initialSimCourses);

  const filteredCourses = useMemo(() => {
    return courseDatabase.filter((c) => {
      const matchSemester =
        selectedSemesterTab === "all" || c.semester === selectedSemesterTab;
      const matchQuery =
        searchFilter.trim() === "" ||
        c.code.toLowerCase().includes(searchFilter.toLowerCase()) ||
        c.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        c.instructor.toLowerCase().includes(searchFilter.toLowerCase());
      return matchSemester && matchQuery;
    });
  }, [selectedSemesterTab, searchFilter]);

  const transcriptCourses = useMemo(() => {
    if (transcriptSemester === "all") return courseDatabase;
    return courseDatabase.filter((c) => c.semester === transcriptSemester);
  }, [transcriptSemester]);

  const activeTranscriptMilestone = useMemo(() => {
    return semesterMilestones.find((m) => m.id === transcriptSemester);
  }, [transcriptSemester]);

  const tableSummary = useMemo(() => {
    const totalCredits = filteredCourses.reduce((acc, c) => acc + c.credits, 0);
    const totalWeightedPoints = filteredCourses.reduce(
      (acc, c) => acc + c.gradePoint * c.credits,
      0
    );
    const sgpa =
      totalCredits > 0 ? (totalWeightedPoints / totalCredits).toFixed(2) : "0.00";
    return { totalCredits, sgpa };
  }, [filteredCourses]);

  const simulationResults = useMemo(() => {
    const termCredits = simCourses.reduce((acc, c) => acc + c.credits, 0);
    const termPoints = simCourses.reduce(
      (acc, c) => acc + (gradePointsMap[c.grade] || 0) * c.credits,
      0
    );
    const projectedSGPA = termCredits > 0 ? termPoints / termCredits : 0;

    const pastCredits = 96;
    const pastPoints = pastCredits * 3.78;
    const totalCreditsAfterTerm = pastCredits + termCredits;
    const totalPointsAfterTerm = pastPoints + termPoints;
    const simulatedCGPA = totalPointsAfterTerm / totalCreditsAfterTerm;
    const cgpaDelta = simulatedCGPA - 3.78;

    return {
      termCredits,
      projectedSGPA: projectedSGPA.toFixed(2),
      simulatedCGPA: simulatedCGPA.toFixed(2),
      cgpaDelta: (cgpaDelta >= 0 ? "+" : "") + cgpaDelta.toFixed(2),
      isPositive: cgpaDelta >= 0,
    };
  }, [simCourses]);

  const updateSimGrade = useCallback((index: number, newGrade: GradeScale) => {
    setSimCourses((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], grade: newGrade };
      return updated;
    });
  }, []);

  const handleResetSim = useCallback(() => {
    setSimCourses(initialSimCourses);
  }, []);

  const handlePrintTranscript = useCallback(() => {
    window.print();
  }, []);

  return (
    <div className="w-full space-y-4 pb-10">
      <div className="w-full">
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-line">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="font-semibold text-xl md:text-2xl tracking-tight text-fg">
                Academic Progress &amp; Degree Audit
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-brand-soft text-brand border border-brand/25 text-xs font-sans font-semibold tabular-nums">
                Class of 2027
              </span>
            </div>
            <p className="text-xs text-fg-muted mt-0.5 font-sans">
              Bachelor of Science in Computer Science &amp; Engineering •{" "}
              <span className="text-fg font-semibold">
                Student ID: <span className="font-mono">211-15-4424</span>
              </span>{" "}
              • 6th Semester Active
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={() => setIsTranscriptOpen(true)}
              className="min-h-[40px] px-3.5 rounded-xl bg-surface-2 hover:bg-surface border border-line text-fg transition-colors flex items-center gap-2 text-xs font-semibold cursor-pointer active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              title="Download Unofficial Academic Transcript"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Unofficial Transcript (PDF)</span>
            </button>

            <button
              type="button"
              onClick={() => setIsSimulatorOpen(true)}
              className="min-h-[40px] px-4 rounded-xl bg-brand hover:bg-brand-hover text-on-brand transition-colors flex items-center gap-2 text-xs font-semibold active:scale-[0.98] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>GPA Simulator</span>
            </button>
          </div>
        </section>
      </div>

      <ProgressKpiBento />

      <SemesterProgressionChart onSelectSemester={setSelectedSemesterTab} />

      <CourseBreakdownTable
        selectedSemesterTab={selectedSemesterTab}
        searchFilter={searchFilter}
        filteredCourses={filteredCourses}
        tableSummary={tableSummary}
        onSelectSemesterTab={setSelectedSemesterTab}
        onSearchFilterChange={setSearchFilter}
        onOpenTranscript={() => setIsTranscriptOpen(true)}
      />

      <GpaSimulatorModal
        isOpen={isSimulatorOpen}
        simCourses={simCourses}
        simulationResults={simulationResults}
        onClose={() => setIsSimulatorOpen(false)}
        onUpdateGrade={updateSimGrade}
        onReset={handleResetSim}
      />

      <TranscriptPreviewModal
        isOpen={isTranscriptOpen}
        transcriptSemester={transcriptSemester}
        transcriptCourses={transcriptCourses}
        activeTranscriptMilestone={activeTranscriptMilestone}
        onClose={() => setIsTranscriptOpen(false)}
        onSelectSemester={setTranscriptSemester}
        onPrint={handlePrintTranscript}
      />
    </div>
  );
}
