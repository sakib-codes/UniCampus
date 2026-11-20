"use client";

import { Users, TrendingUp, Clock, Calendar, MapPin } from "lucide-react";
import { CANONICAL_FACULTY } from "@/lib/canonicalCampus";

interface TeacherMetricBentoProps {
  totalAssignedStudents: number;
  sessionCount: number;
}

export function TeacherMetricBento({
  totalAssignedStudents,
  sessionCount,
}: TeacherMetricBentoProps) {
  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Assigned Students */}
        <div className="rounded-2xl bg-surface border border-line p-5 hover:border-brand/30 transition-colors relative">
          <div className="flex items-center justify-between text-fg-muted mb-3">
            <span className="text-xs font-semibold">
              Total Assigned Students
            </span>
            <div className="w-8 h-8 rounded-lg bg-brand-soft border border-brand/20 text-brand flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-3xl font-bold text-fg tracking-tight font-sans tabular-nums">
              {totalAssignedStudents}
            </span>
            <span className="text-xs font-sans text-success bg-success-light px-2 py-0.5 rounded-full border border-success/20 font-semibold">
              Active
            </span>
          </div>
          <p className="text-xs text-fg-muted mt-2 font-normal tabular-nums">
            Across {sessionCount} active sections
          </p>
        </div>

        {/* Card 2: Average Class Attendance */}
        <div className="rounded-2xl bg-surface border border-line p-5 hover:border-brand/30 transition-colors relative">
          <div className="flex items-center justify-between text-fg-muted mb-3">
            <span className="text-xs font-semibold">
              Average Class Attendance
            </span>
            <div className="w-8 h-8 rounded-lg bg-success-light border border-success/20 text-success flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-3xl font-bold text-fg tracking-tight font-sans tabular-nums">
              88.5%
            </span>
            <span className="text-xs font-sans tabular-nums text-success bg-success-light px-2 py-0.5 rounded-full border border-success/20 inline-flex items-center gap-0.5 font-semibold">
              <TrendingUp className="w-3 h-3" />
              +3.2% vs Dept Avg
            </span>
          </div>
          <p className="text-xs text-fg-muted mt-2 font-normal">
            Outperforming CSE Dept baseline (85%)
          </p>
        </div>

        {/* Card 3: Pending Grading Tasks */}
        <div className="rounded-2xl bg-surface border border-line p-5 hover:border-brand/30 transition-colors relative">
          <div className="flex items-center justify-between text-fg-muted mb-3">
            <span className="text-xs font-semibold">
              Pending Grading Tasks
            </span>
            <div className="w-8 h-8 rounded-lg bg-warning-light border border-warning/20 text-warning flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-3xl font-bold text-fg tracking-tight font-sans tabular-nums">
              2
            </span>
            <span className="text-xs font-semibold text-fg-muted">
              assignments
            </span>
          </div>
          <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-warning-light border border-warning/25 text-xs font-sans text-warning font-semibold truncate max-w-full">
            <span className="truncate">CSE-3101 Quiz 2 &amp; CSE-3102 Lab</span>
          </div>
        </div>

        {/* Card 4: Office Hours */}
        <div className="rounded-2xl bg-surface border border-line p-5 hover:border-brand/30 transition-colors relative">
          <div className="flex items-center justify-between text-fg-muted mb-3">
            <span className="text-xs font-semibold">
              Office Consultation Hours
            </span>
            <div className="w-8 h-8 rounded-lg bg-brand-soft border border-brand/20 text-brand flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline">
            <span className="text-base font-semibold text-fg tracking-tight font-sans tabular-nums">
              Today {CANONICAL_FACULTY.officeHours.replace(/^Mon\s+/, "")}
            </span>
          </div>
          <p className="text-xs text-fg-muted mt-2 flex items-center gap-1.5 font-normal">
            <MapPin className="w-3.5 h-3.5 text-brand shrink-0" />
            <span>{CANONICAL_FACULTY.office} • 3 student slots booked</span>
          </p>
        </div>
      </div>
    </section>
  );
}
