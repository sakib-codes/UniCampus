"use client";

import React from "react";
import { Users, BookOpen, Settings } from "lucide-react";
import type { DepartmentData } from "./departmentsData";

interface DepartmentCardProps {
  dept: DepartmentData;
  onSelectRoster: (dept: DepartmentData) => void;
  onSelectCurriculum: (dept: DepartmentData) => void;
  onSelectSettings: (dept: DepartmentData) => void;
}

export const DepartmentCard = React.memo(function DepartmentCard({
  dept,
  onSelectRoster,
  onSelectCurriculum,
  onSelectSettings,
}: DepartmentCardProps) {
  return (
    <div className="bg-surface border border-line rounded-2xl p-6 relative flex flex-col justify-between hover:border-brand/60 transition-colors group">
      {/* Subtle Top-Edge Brand Accent Bar */}
      <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-brand to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

      <div>
        {/* Top Row: Monospace Code Pill + Division + Status Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-brand-soft text-brand border border-brand/30 tracking-tight">
              {dept.code} • {dept.codeNumber}
            </span>
            <span className="text-xs font-sans font-medium text-fg-muted">
              {dept.division}
            </span>
          </div>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-sans font-semibold bg-success-light text-success border border-success/30 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            <span>{dept.status}</span>
          </span>
        </div>

        {/* Department Title */}
        <h2 className="text-xl font-semibold text-fg tracking-tight mb-4">
          {dept.name}
        </h2>

        {/* Head of Department Inset Box */}
        <div className="bg-surface-2 border border-line rounded-xl p-3 mb-5 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-brand-soft border border-brand/30 flex items-center justify-center font-sans font-semibold text-brand text-xs shrink-0">
            {dept.initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-fg truncate">
                {dept.hodName}
              </span>
              <span className="px-1.5 py-0.5 rounded text-xs font-sans font-semibold bg-surface text-brand border border-brand/30">
                {dept.hodBadge}
              </span>
            </div>
            <div className="text-xs text-fg-muted font-sans flex items-center gap-2 mt-0.5 truncate">
              <span className="font-sans text-fg-muted text-xs truncate">
                Office: {dept.office}
              </span>
            </div>
          </div>
        </div>

        {/* 3-Column Metric Strip */}
        <div className="grid grid-cols-3 gap-2.5 mb-6">
          <div className="bg-surface-2 border border-line rounded-xl p-3 text-center">
            <div className="text-xs font-sans text-fg-muted">
              Total Students
            </div>
            <div className="text-lg font-sans font-bold text-fg tabular-nums mt-0.5">
              {dept.totalStudents.toLocaleString()}
            </div>
          </div>

          <div className="bg-surface-2 border border-line rounded-xl p-3 text-center">
            <div className="text-xs font-sans text-fg-muted">
              Total Faculty
            </div>
            <div className="text-lg font-sans font-bold text-fg tabular-nums mt-0.5">
              {dept.totalFaculty}
            </div>
          </div>

          <div className="bg-surface-2 border border-line rounded-xl p-3 text-center">
            <div className="text-xs font-sans text-fg-muted">
              Active Programs
            </div>
            <div className="text-xs font-sans font-semibold text-brand mt-1.5 truncate">
              {dept.activePrograms.join(", ")}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Links Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-3 border-t border-line">
        <button
          type="button"
          onClick={() => onSelectRoster(dept)}
          className="min-h-[40px] py-2 px-2.5 rounded-xl bg-surface-2 hover:bg-canvas text-fg-muted hover:text-fg text-xs font-sans font-medium border border-line transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <Users className="w-3.5 h-3.5" />
          <span>Faculty Roster</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectCurriculum(dept)}
          className="min-h-[40px] py-2 px-2.5 rounded-xl bg-surface-2 hover:bg-canvas text-fg-muted hover:text-fg text-xs font-sans font-medium border border-line transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Curriculum</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectSettings(dept)}
          className="min-h-[40px] py-2 px-2.5 rounded-xl bg-brand-soft hover:bg-brand/20 text-brand text-xs font-sans font-semibold border border-brand/30 transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Manage Settings</span>
        </button>
      </div>
    </div>
  );
});
