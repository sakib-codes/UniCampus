"use client";

import React, { useState } from "react";
import { BookOpen, Calendar, ChevronDown } from "lucide-react";
import { COURSE_OPTIONS, SEMESTER_OPTIONS } from "./gradesData";

export interface GradesOverviewRowProps {
  selectedCourse: string;
  onSelectCourse: (course: string) => void;
  selectedSemester: string;
  onSelectSemester: (semester: string) => void;
  enrolledCount: number;
}

export function GradesOverviewRow({
  selectedCourse,
  onSelectCourse,
  selectedSemester,
  onSelectSemester,
  enrolledCount,
}: GradesOverviewRowProps) {
  const [courseDropdownOpen, setCourseDropdownOpen] = useState(false);
  const [semesterDropdownOpen, setSemesterDropdownOpen] = useState(false);

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
      {/* LEFT CARD (65% / col-span-8): COURSE & WEIGHTS */}
      <div className="lg:col-span-8 bg-surface rounded-2xl p-5 sm:p-6 border border-line flex flex-col justify-between relative">
        <div>
          <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
            <div>
              <span className="font-sans text-xs font-semibold text-brand">
                Course Assessment Matrix
              </span>
              <h1 className="font-semibold text-xl sm:text-2xl text-fg tracking-tight mt-0.5">
                Gradebook &amp; Marks Entry Matrix
              </h1>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success-light border border-success/25 text-success font-sans text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-success" aria-hidden="true" />
              <span>Section A Active</span>
            </span>
          </div>

          {/* Interactive Dropdown Selectors */}
          <div className="flex flex-wrap items-center gap-3 mb-5 mt-4">
            {/* Course Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setCourseDropdownOpen((prev) => !prev);
                  setSemesterDropdownOpen(false);
                }}
                aria-expanded={courseDropdownOpen}
                className="flex items-center gap-2 min-h-[40px] px-3.5 py-2 rounded-xl bg-surface-2 border border-line hover:border-brand/60 text-fg text-xs font-semibold cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <BookOpen className="w-3.5 h-3.5 text-brand" aria-hidden="true" />
                <span>{selectedCourse}</span>
                <ChevronDown className="w-3.5 h-3.5 text-fg-muted ml-1" aria-hidden="true" />
              </button>
              {courseDropdownOpen && (
                <div className="absolute left-0 mt-1.5 w-72 max-w-[calc(100vw-2rem)] rounded-2xl bg-surface-2 border border-line shadow-lg z-30 p-1.5">
                  {COURSE_OPTIONS.map((course) => (
                    <button
                      key={course}
                      type="button"
                      onClick={() => {
                        onSelectCourse(course);
                        setCourseDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                        selectedCourse === course
                          ? "bg-brand-soft text-brand font-semibold"
                          : "text-fg-muted hover:bg-surface hover:text-fg"
                      }`}
                    >
                      {course}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Semester Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setSemesterDropdownOpen((prev) => !prev);
                  setCourseDropdownOpen(false);
                }}
                aria-expanded={semesterDropdownOpen}
                className="flex items-center gap-2 min-h-[40px] px-3.5 py-2 rounded-xl bg-surface-2 border border-line hover:border-brand/60 text-fg text-xs font-semibold cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <Calendar className="w-3.5 h-3.5 text-brand" aria-hidden="true" />
                <span>{selectedSemester}</span>
                <ChevronDown className="w-3.5 h-3.5 text-fg-muted ml-1" aria-hidden="true" />
              </button>
              {semesterDropdownOpen && (
                <div className="absolute left-0 mt-1.5 w-56 max-w-[calc(100vw-2rem)] rounded-2xl bg-surface-2 border border-line shadow-lg z-30 p-1.5">
                  {SEMESTER_OPTIONS.map((sem) => (
                    <button
                      key={sem}
                      type="button"
                      onClick={() => {
                        onSelectSemester(sem);
                        setSemesterDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                        selectedSemester === sem
                          ? "bg-brand-soft text-brand font-semibold"
                          : "text-fg-muted hover:bg-surface hover:text-fg"
                      }`}
                    >
                      {sem}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Assessment Weight Breakdown Pills */}
        <div className="pt-4 border-t border-line">
          <div className="flex items-center justify-between mb-2.5">
            <span className="font-sans text-xs font-semibold text-fg-muted">
              Grading Policy &amp; Weights
            </span>
            <span className="font-sans text-xs font-semibold text-brand tabular-nums">
              100% Normalized Basis
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {/* Attendance */}
            <div className="p-2.5 rounded-2xl bg-surface-2 border border-line flex flex-col justify-between">
              <span className="font-sans text-xs font-medium text-fg-muted">
                Attendance
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="font-semibold text-base text-fg tabular-nums">
                  10%
                </span>
                <span className="font-sans text-xs text-fg-muted tabular-nums">
                  Max 10
                </span>
              </div>
            </div>

            {/* Quiz 1 */}
            <div className="p-2.5 rounded-2xl bg-surface-2 border border-line flex flex-col justify-between">
              <span className="font-sans text-xs font-medium text-fg-muted">
                Quiz 1
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="font-semibold text-base text-fg tabular-nums">
                  10%
                </span>
                <span className="font-sans text-xs text-fg-muted tabular-nums">
                  Max 10
                </span>
              </div>
            </div>

            {/* Midterm */}
            <div className="p-2.5 rounded-2xl bg-surface-2 border border-line flex flex-col justify-between">
              <span className="font-sans text-xs font-medium text-fg-muted">
                Midterm
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="font-semibold text-base text-fg tabular-nums">
                  25%
                </span>
                <span className="font-sans text-xs text-fg-muted tabular-nums">
                  Max 25
                </span>
              </div>
            </div>

            {/* Lab Sessional */}
            <div className="p-2.5 rounded-2xl bg-surface-2 border border-line flex flex-col justify-between">
              <span className="font-sans text-xs font-medium text-fg-muted">
                Lab
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="font-semibold text-base text-fg tabular-nums">
                  15%
                </span>
                <span className="font-sans text-xs text-fg-muted tabular-nums">
                  Max 15
                </span>
              </div>
            </div>

            {/* Final Exam (Highlight Pill) */}
            <div className="col-span-2 sm:col-span-1 p-2.5 rounded-2xl bg-brand-soft border border-brand/35 flex flex-col justify-between">
              <span className="font-sans text-xs font-semibold text-brand">
                Final Exam
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="font-semibold text-base text-brand tabular-nums">
                  40%
                </span>
                <span className="font-sans text-xs text-brand/80 tabular-nums">
                  Max 40
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT CARD (35% / col-span-4): GRADE DISTRIBUTION */}
      <div className="lg:col-span-4 bg-surface rounded-2xl p-5 sm:p-6 border border-line flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-semibold text-base sm:text-lg text-fg tracking-tight">
              Grade Distribution Summary
            </h2>
            <span className="font-sans text-xs font-semibold px-2 py-0.5 rounded-lg bg-surface-2 border border-line text-fg-muted tabular-nums">
              {enrolledCount} enrolled
            </span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div>
              <span className="text-xs text-fg-muted">Class Avg GPA: </span>
              <span className="font-sans font-semibold text-sm text-fg tabular-nums">3.64</span>
            </div>
            <span className="text-line" aria-hidden="true">•</span>
            <div className="text-xs text-success font-semibold tabular-nums">
              Passing Rate 97.6%
            </div>
          </div>

          {/* MINI SMOOTH BELL-CURVE AREA CHART */}
          <div className="relative h-28 w-full bg-surface-2 rounded-2xl p-2 border border-line flex items-center justify-center overflow-hidden">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 320 90" aria-hidden="true">
              <defs>
                <linearGradient id="bellGlow" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="var(--brand)" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Baseline */}
              <line stroke="currentColor" className="text-line" strokeDasharray="2 2" strokeWidth="1" x1="10" x2="310" y1="80" y2="80" />
              {/* Area Fill */}
              <path
                d="M 15 80 C 80 80, 110 75, 140 30 C 160 5, 185 5, 205 32 C 235 70, 275 80, 305 80 Z"
                fill="url(#bellGlow)"
              />
              {/* Smooth Curve Line */}
              <path
                d="M 15 80 C 80 80, 110 75, 140 30 C 160 5, 185 5, 205 32 C 235 70, 275 80, 305 80"
                fill="none"
                stroke="var(--brand)"
                strokeWidth="2.5"
              />
              {/* Benchmark Mean Indicator (3.64) */}
              <line stroke="var(--brand)" strokeDasharray="3 3" strokeWidth="1.5" x1="172" x2="172" y1="12" y2="80" />
              <circle cx="172" cy="12" fill="var(--brand)" r="3.5" />
            </svg>
            {/* Mean Indicator Pill */}
            <div className="absolute top-2 left-[54%] -translate-x-1/2 px-1.5 py-0.5 rounded bg-brand text-on-brand font-sans text-xs font-semibold tabular-nums">
              μ = 3.64
            </div>
          </div>
        </div>

        {/* Frequency Grade Badges Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 pt-3 border-t border-line">
          <div className="p-2 rounded-xl bg-surface-2 border border-success/25 flex items-center justify-between">
            <span className="font-sans text-xs font-semibold text-success">A+ (90-100%)</span>
            <span className="font-sans text-xs font-semibold text-fg tabular-nums">12 st</span>
          </div>
          <div className="p-2 rounded-xl bg-surface-2 border border-brand/30 flex items-center justify-between">
            <span className="font-sans text-xs font-semibold text-brand">A (80-89%)</span>
            <span className="font-sans text-xs font-semibold text-fg tabular-nums">14 st</span>
          </div>
          <div className="p-2 rounded-xl bg-surface-2 border border-brand/20 flex items-center justify-between">
            <span className="font-sans text-xs font-semibold text-brand">A- (75-79%)</span>
            <span className="font-sans text-xs font-semibold text-fg tabular-nums">5 st</span>
          </div>
          <div className="p-2 rounded-xl bg-surface-2 border border-warning/25 flex items-center justify-between">
            <span className="font-sans text-xs font-semibold text-warning">B+ (70-74%)</span>
            <span className="font-sans text-xs font-semibold text-fg tabular-nums">5 st</span>
          </div>
          <div className="p-2 rounded-xl bg-surface-2 border border-warning/25 flex items-center justify-between">
            <span className="font-sans text-xs font-semibold text-warning">B (65-69%)</span>
            <span className="font-sans text-xs font-semibold text-fg tabular-nums">4 st</span>
          </div>
          <div className="p-2 rounded-xl bg-surface-2 border border-line flex items-center justify-between">
            <span className="font-sans text-xs font-semibold text-fg-muted">C (60-64%)</span>
            <span className="font-sans text-xs font-semibold text-fg tabular-nums">3 st</span>
          </div>
        </div>
      </div>
    </section>
  );
}
