"use client";

import { motion } from "framer-motion";
import { Switch } from "@/components/common/Switch";
import { CANONICAL_DEPARTMENTS } from "@/lib/canonicalCampus";
import type { BuildingType } from "./adminRoutineData";

interface AdminRoutineToolbarProps {
  building: BuildingType;
  onBuildingChange: (b: BuildingType) => void;
  selectedDay: string;
  onDayChange: (day: string) => void;
  capacityFilter: string;
  onCapacityFilterChange: (v: string) => void;
  deptFilter: string;
  onDeptFilterChange: (v: string) => void;
  highlightConflicts: boolean;
  onHighlightConflictsChange: (v: boolean) => void;
  showUtilization: boolean;
  onShowUtilizationChange: (v: boolean) => void;
  isDeptAdmin?: boolean;
}

export function AdminRoutineToolbar({
  building,
  onBuildingChange,
  selectedDay,
  onDayChange,
  capacityFilter,
  onCapacityFilterChange,
  deptFilter,
  onDeptFilterChange,
  highlightConflicts,
  onHighlightConflictsChange,
  showUtilization,
  onShowUtilizationChange,
  isDeptAdmin = false,
}: AdminRoutineToolbarProps) {
  return (
    <div className="bg-surface rounded-2xl p-3.5 border border-line flex flex-col gap-3">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 min-w-0">
          {/* Building Selector Segmented Pills */}
          <div className="w-full sm:w-auto overflow-x-auto max-w-full [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="inline-flex items-center bg-surface-2 p-1 rounded-xl border border-line text-xs relative min-w-max">
              {(
                [
                  { id: "bldg-1", label: "Academic Building 1" },
                  { id: "bldg-2", label: "Academic Building 2" },
                  { id: "lab", label: "Lab Complex" },
                ] as const
              ).map((b) => {
                const isActive = building === b.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => onBuildingChange(b.id)}
                    className={`relative px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap z-10 min-h-[36px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                      isActive ? "text-on-brand" : "text-fg-muted hover:text-fg"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="admin-routine-bldg-pill"
                        className="absolute inset-0 bg-brand rounded-lg -z-10"
                        transition={{ type: "spring", stiffness: 450, damping: 32 }}
                      />
                    )}
                    {b.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="hidden sm:block h-5 w-px bg-line shrink-0" />

          {/* Day Picker */}
          <div className="w-full sm:w-auto overflow-x-auto max-w-full [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="inline-flex items-center gap-1 p-1 bg-surface-2 rounded-xl border border-line relative min-w-max">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => {
                const isActive = selectedDay === day;
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => onDayChange(day)}
                    className={`relative w-10 h-9 rounded-lg font-sans text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                      isActive ? "text-on-brand" : "text-fg-muted hover:text-fg"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="admin-routine-day-pill"
                        className="absolute inset-0 bg-brand rounded-lg -z-10"
                        transition={{ type: "spring", stiffness: 450, damping: 32 }}
                      />
                    )}
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dropdowns & Toggles */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2.5 w-full xl:w-auto">
          <select
            value={capacityFilter}
            onChange={(e) => onCapacityFilterChange(e.target.value)}
            aria-label="Filter by room capacity"
            className="w-full sm:w-auto min-h-[40px] bg-surface-2 border border-line text-fg text-xs font-sans rounded-xl px-3 py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus:border-brand cursor-pointer"
          >
            <option value="all">Room Capacity: All (40 - 120 seats)</option>
            <option value="40-60">Tier 1: 40 - 60 seats</option>
            <option value="60-100">Tier 2: 60 - 100 seats</option>
            <option value="120+">Auditorium (120+ seats)</option>
          </select>

          <select
            value={deptFilter}
            onChange={(e) => onDeptFilterChange(e.target.value)}
            disabled={isDeptAdmin}
            aria-label="Filter by department"
            className="w-full sm:w-auto min-h-[40px] bg-surface-2 border border-line text-fg text-xs font-sans rounded-xl px-3 py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus:border-brand cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {!isDeptAdmin && <option value="all">Department: All Departments</option>}
            {CANONICAL_DEPARTMENTS.map((d) => (
              <option key={d.id} value={d.code.toLowerCase()}>
                {d.code} — {d.name}
              </option>
            ))}
          </select>

          <div className="flex flex-wrap items-center gap-4 pt-1 sm:pt-0">
            <div className="flex items-center gap-2 select-none">
              <Switch
                size="sm"
                checked={highlightConflicts}
                onChange={onHighlightConflictsChange}
                ariaLabel="Highlight conflicts toggle"
              />
              <span className="text-xs text-fg-muted font-sans whitespace-nowrap">
                Highlight Conflicts
              </span>
            </div>

            <div className="flex items-center gap-2 select-none">
              <Switch
                size="sm"
                checked={showUtilization}
                onChange={onShowUtilizationChange}
                ariaLabel="Show utilization toggle"
              />
              <span className="text-xs text-fg-muted font-sans whitespace-nowrap">
                Show Utilization %
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
