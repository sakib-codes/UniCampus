"use client";

import React, { memo } from "react";
import { BookOpen, Users, Calendar, Edit3, PauseCircle, PlayCircle, ChevronDown } from "lucide-react";

export interface SessionConfigBarProps {
  selectedCourse: string;
  courseName?: string;
  selectedSection: string;
  sessionDate: string;
  sessionTopic: string;
  isRotating: boolean;
  onToggleRotate: () => void;
}

export const SessionConfigBar = memo(function SessionConfigBar({
  selectedCourse,
  courseName = "Design & Analysis of Algorithms",
  selectedSection,
  sessionDate,
  sessionTopic,
  isRotating,
  onToggleRotate,
}: SessionConfigBarProps) {
  return (
    <section className="bg-surface rounded-2xl p-5 border border-line flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-xs">
      {/* Interactive Selector Dropdowns/Inputs */}
      <div className="flex items-center gap-3 flex-wrap flex-1 min-w-0">
        {/* Course Selector */}
        <div
          role="button"
          tabIndex={0}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-surface-2 border border-line hover:border-brand/60 transition-colors duration-150 cursor-pointer group shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <BookOpen className="w-4 h-4 text-fg-muted shrink-0" aria-hidden="true" />
          <div className="text-left">
            <span className="text-xs font-semibold text-fg-muted leading-none block">
              Course
            </span>
            <div className="font-semibold text-xs sm:text-[13px] text-fg flex items-center gap-1.5 mt-0.5">
              <span>{selectedCourse}</span>
              <span className="text-fg-subtle">•</span>
              <span className="font-normal text-fg-muted truncate max-w-[140px] sm:max-w-none">
                {courseName}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-fg-muted group-hover:text-fg transition-colors duration-150 shrink-0" />
            </div>
          </div>
        </div>

        {/* Section Selector */}
        <div
          role="button"
          tabIndex={0}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-surface-2 border border-line hover:border-brand/60 transition-colors duration-150 cursor-pointer group shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <Users className="w-4 h-4 text-fg-muted shrink-0" aria-hidden="true" />
          <div className="text-left">
            <span className="text-xs font-semibold text-fg-muted leading-none block">
              Section &amp; Term
            </span>
            <div className="font-semibold text-xs sm:text-[13px] text-fg flex items-center gap-1.5 mt-0.5">
              <span>{selectedSection}</span>
              <ChevronDown className="w-3.5 h-3.5 text-fg-muted group-hover:text-fg transition-colors duration-150 shrink-0" />
            </div>
          </div>
        </div>

        {/* Date Selector */}
        <div
          role="button"
          tabIndex={0}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-surface-2 border border-line hover:border-brand/60 transition-colors duration-150 cursor-pointer group shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <Calendar className="w-4 h-4 text-fg-muted shrink-0" aria-hidden="true" />
          <div className="text-left">
            <span className="text-xs font-semibold text-fg-muted leading-none block">
              Date &amp; Slot
            </span>
            <div className="font-semibold text-xs sm:text-[13px] text-fg flex items-center gap-1.5 mt-0.5">
              <span>{sessionDate}</span>
              <ChevronDown className="w-3.5 h-3.5 text-fg-muted group-hover:text-fg transition-colors duration-150 shrink-0" />
            </div>
          </div>
        </div>

        {/* Lecture Topic */}
        <div
          role="button"
          tabIndex={0}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-surface-2 border border-line hover:border-brand/60 transition-colors duration-150 cursor-pointer group flex-1 min-w-0 md:min-w-[260px] shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <Edit3 className="w-4 h-4 text-fg-muted shrink-0" aria-hidden="true" />
          <div className="text-left min-w-0 flex-1">
            <span className="text-xs font-semibold text-fg-muted leading-none block">
              Lecture Topic
            </span>
            <div
              className="font-semibold text-xs sm:text-[13px] text-fg truncate mt-0.5"
              title={sessionTopic}
            >
              {sessionTopic}
            </div>
          </div>
        </div>
      </div>

      {/* Right Pause / Resume Button */}
      <button
        type="button"
        onClick={onToggleRotate}
        className="px-4 py-2.5 rounded-xl bg-surface-2 hover:bg-surface border border-line text-fg font-medium text-xs sm:text-[13px] flex items-center gap-2 transition-colors duration-150 active:scale-[0.98] cursor-pointer shadow-xs whitespace-nowrap justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand min-h-[44px] sm:min-h-[38px]"
      >
        {isRotating ? (
          <>
            <PauseCircle className="w-4 h-4 text-warning" aria-hidden="true" />
            <span>Pause QR Rotation</span>
          </>
        ) : (
          <>
            <PlayCircle className="w-4 h-4 text-success" aria-hidden="true" />
            <span>Resume QR Rotation</span>
          </>
        )}
      </button>
    </section>
  );
});

