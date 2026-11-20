"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Printer, CalendarPlus, LayoutGrid, List } from "lucide-react";
import { ACTIVE_TERM } from "@/lib/canonicalCampus";
import { DAYS_LIST, WEEKLY_ROUTINE_DATA } from "./routineData";

export interface RoutineHeaderControlsProps {
  selectedDay: string;
  onSelectDay: (day: string) => void;
  viewMode: "daily" | "weekly";
  onChangeViewMode: (mode: "daily" | "weekly") => void;
  filterType: "all" | "theory" | "lab";
  onChangeFilterType: (type: "all" | "theory" | "lab") => void;
  onPrint: () => void;
  onOpenCalendarModal: () => void;
}

export const RoutineHeaderControls = memo(function RoutineHeaderControls({
  selectedDay,
  onSelectDay,
  viewMode,
  onChangeViewMode,
  filterType,
  onChangeFilterType,
  onPrint,
  onOpenCalendarModal,
}: RoutineHeaderControlsProps) {
  return (
    <div className="w-full space-y-3.5">
      {/* 1. Top Page Header Row */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-line">
        <div className="min-w-0">
          <h1 className="font-semibold text-2xl md:text-3xl tracking-tight text-fg">
            Class Routine &amp; Timetable
          </h1>
          <p className="text-xs sm:text-sm text-fg-muted mt-0.5 font-sans">
            Semester {ACTIVE_TERM} • Section A • Dept. of Computer Science &amp; Engineering
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {/* View Mode Switcher */}
          <div className="p-0.5 rounded-xl bg-surface-2 border border-line flex items-center relative">
            <button
              type="button"
              onClick={() => onChangeViewMode("daily")}
              className={`relative min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                viewMode === "daily"
                  ? "text-fg"
                  : "text-fg-muted hover:text-fg"
              }`}
            >
              {viewMode === "daily" && (
                <motion.div
                  layoutId="routine-view-pill"
                  className="absolute inset-0 bg-surface rounded-lg -z-10 shadow-xs"
                  transition={{ type: "spring", stiffness: 450, damping: 32 }}
                />
              )}
              <List className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Daily Schedule</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeViewMode("weekly")}
              className={`relative min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                viewMode === "weekly"
                  ? "text-fg"
                  : "text-fg-muted hover:text-fg"
              }`}
            >
              {viewMode === "weekly" && (
                <motion.div
                  layoutId="routine-view-pill"
                  className="absolute inset-0 bg-surface rounded-lg -z-10 shadow-xs"
                  transition={{ type: "spring", stiffness: 450, damping: 32 }}
                />
              )}
              <LayoutGrid className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Weekly Matrix</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onPrint}
            className="min-h-[38px] px-3 rounded-xl bg-surface-2 hover:bg-surface border border-line text-fg transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            title="Print Timetable"
          >
            <Printer className="w-3.5 h-3.5 text-fg-muted" aria-hidden="true" />
            <span>Print</span>
          </button>

          <button
            type="button"
            onClick={onOpenCalendarModal}
            className="min-h-[38px] px-3.5 rounded-xl bg-brand hover:bg-brand-hover text-on-brand transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <CalendarPlus className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Sync Calendar</span>
          </button>
        </div>
      </section>

      {/* 2. Separated Independent UI Tracks: Day Selector and Type Filter */}
      {viewMode === "daily" && (
        <section aria-label="Schedule Filters" className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Independent UI Track 1: Day Selector */}
          <div className="flex-1 min-w-0 bg-surface border border-line rounded-2xl p-1.5 flex items-center overflow-x-auto gap-1">
            {DAYS_LIST.map((day) => {
              const isActive = selectedDay === day;
              const count =
                WEEKLY_ROUTINE_DATA[day]?.filter((s) => !s.isBreak).length || 0;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => onSelectDay(day)}
                  className={`relative flex-1 min-w-[105px] min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-semibold tracking-tight transition-colors flex items-center justify-center gap-1.5 shrink-0 cursor-pointer z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                    isActive ? "text-on-brand" : "text-fg-muted hover:text-fg"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="routine-student-day-pill"
                      className="absolute inset-0 bg-brand rounded-xl -z-10 shadow-xs"
                      transition={{
                        type: "spring",
                        stiffness: 450,
                        damping: 32,
                      }}
                    />
                  )}
                  <span>{day}</span>
                  <span
                    className={`text-xs font-sans tabular-nums px-1.5 py-0.5 rounded-full transition-colors ${
                      isActive
                        ? "bg-on-brand/20 text-on-brand font-semibold"
                        : "bg-surface-2 text-fg-muted"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Independent UI Track 2: Type Filter */}
          <div className="bg-surface border border-line rounded-2xl p-1.5 flex items-center gap-1 shrink-0 self-start sm:self-auto">
            {(["all", "theory", "lab"] as const).map((type) => {
              const isActive = filterType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => onChangeFilterType(type)}
                  className={`relative min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer capitalize z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                    isActive ? "text-fg" : "text-fg-muted hover:text-fg"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="routine-filter-pill"
                      className="absolute inset-0 bg-surface-2 border border-line/60 rounded-xl -z-10 shadow-xs"
                      transition={{
                        type: "spring",
                        stiffness: 450,
                        damping: 32,
                      }}
                    />
                  )}
                  {type === "all" ? "All" : type === "theory" ? "Theory" : "Labs"}
                </button>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
});
