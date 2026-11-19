"use client";

import React, { memo } from "react";
import { Search, UserX, Sparkles } from "lucide-react";
import { StudentRosterRecord } from "@/lib/attendanceService";
import { AttendanceRosterRow } from "./AttendanceRosterRow";

export interface AttendanceRosterPanelProps {
  totalEnrolled: number;
  checkedInCount: number;
  absentCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterTab: "all" | "checked_in" | "absent";
  onFilterTabChange: (tab: "all" | "checked_in" | "absent") => void;
  onMarkAllAbsent: () => void;
  recentCheckIn: StudentRosterRecord | null;
  paginatedRoster: StudentRosterRecord[];
  onSetStatus: (studentId: string, status: "present" | "late" | "absent") => void;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  filteredRosterLength: number;
  onPageChange: (page: number) => void;
}

export const AttendanceRosterPanel = memo(function AttendanceRosterPanel({
  totalEnrolled,
  checkedInCount,
  absentCount,
  searchQuery,
  onSearchChange,
  filterTab,
  onFilterTabChange,
  onMarkAllAbsent,
  recentCheckIn,
  paginatedRoster,
  onSetStatus,
  currentPage,
  totalPages,
  pageSize,
  filteredRosterLength,
  onPageChange,
}: AttendanceRosterPanelProps) {
  return (
    <div className="bg-surface rounded-2xl p-5 border border-line shadow-xs flex flex-col h-full">
      {/* Section Heading & Batch Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-line">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="font-semibold text-base sm:text-lg text-fg tracking-tight">
              Live Student Attendance Roster
            </h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-brand-soft text-brand border border-brand/20">
              {totalEnrolled} Enrolled
            </span>
          </div>
          <p className="text-xs text-fg-muted mt-0.5 font-normal">
            Live attendance stream active • Room 402
          </p>
        </div>

        {/* Batch Action: Mark All Remaining Absent */}
        <button
          type="button"
          onClick={onMarkAllAbsent}
          className="self-start sm:self-auto px-3 py-1.5 rounded-xl border border-danger/30 text-danger hover:bg-danger-light text-xs font-semibold transition-colors duration-150 flex items-center gap-1.5 cursor-pointer active:scale-95 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand min-h-[36px]"
        >
          <UserX className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>Mark All Remaining Absent</span>
        </button>
      </div>

      {/* Real-time Celebration Banner */}
      {recentCheckIn && (
        <div className="mt-4 p-3.5 rounded-xl bg-success-light border border-success/30 text-fg flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-success text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              <Sparkles className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <div className="font-semibold text-xs sm:text-[13.5px] text-fg">
                🎉 {recentCheckIn.name} checked in just now!
              </div>
              <div className="text-xs text-success font-medium">
                ID: {recentCheckIn.studentId} • Recorded at {recentCheckIn.checkInTime} via {recentCheckIn.checkInMethod === "QR" ? "Live QR Code" : "Classroom PIN"}
              </div>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-success text-white text-xs font-semibold shrink-0">
            Live Synced
          </span>
        </div>
      )}

      {/* Roster Toolbar: Search input & filter counters */}
      <div className="py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-muted" aria-hidden="true" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Filter student name or ID..."
            className="w-full bg-surface-2 border border-line text-xs sm:text-[13px] rounded-xl pl-10 pr-4 py-2 text-fg placeholder:text-fg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand transition-colors duration-150 min-h-[40px]"
          />
        </div>

        {/* Filter Tab Chips */}
        <div className="flex items-center gap-1 bg-surface-2 p-1 rounded-xl border border-line text-xs self-stretch sm:self-auto justify-center">
          <button
            type="button"
            onClick={() => onFilterTabChange("all")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors duration-150 cursor-pointer min-h-[34px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
              filterTab === "all"
                ? "bg-surface text-fg shadow-xs border border-line"
                : "text-fg-muted hover:text-fg"
            }`}
          >
            All ({totalEnrolled})
          </button>
          <button
            type="button"
            onClick={() => onFilterTabChange("checked_in")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors duration-150 cursor-pointer min-h-[34px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
              filterTab === "checked_in"
                ? "bg-surface text-fg shadow-xs border border-line"
                : "text-fg-muted hover:text-fg"
            }`}
          >
            Checked In ({checkedInCount})
          </button>
          <button
            type="button"
            onClick={() => onFilterTabChange("absent")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors duration-150 cursor-pointer min-h-[34px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
              filterTab === "absent"
                ? "bg-surface text-fg shadow-xs border border-line"
                : "text-fg-muted hover:text-fg"
            }`}
          >
            Absent ({absentCount})
          </button>
        </div>
      </div>

      {/* Real-Time Roster Table with Bottom-Anchored Pagination */}
      <div className="w-full flex-1 flex flex-col justify-between overflow-x-auto rounded-xl border border-line bg-surface shadow-xs">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-surface-2 border-b border-line text-xs font-semibold text-fg-muted">
              <th scope="col" className="py-3 px-4">Student</th>
              <th scope="col" className="py-3 px-3">Student ID</th>
              <th scope="col" className="py-3 px-3">Check-in Time</th>
              <th scope="col" className="py-3 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line text-xs sm:text-[13px]">
            {paginatedRoster.map((student) => (
              <AttendanceRosterRow
                key={student.id}
                student={student}
                onSetStatus={onSetStatus}
              />
            ))}
          </tbody>
        </table>

        {/* Table Footer Pagination - Bottom Anchored */}
        <div className="mt-auto p-3 bg-surface-2 border-t border-line flex items-center justify-between text-xs text-fg-muted flex-wrap gap-2">
          <span>
            Showing {filteredRosterLength === 0 ? 0 : (currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredRosterLength)} of {filteredRosterLength} students
            <span className="text-fg-subtle mx-1.5 hidden sm:inline" aria-hidden="true">•</span>
            <span className="text-fg-muted font-normal hidden sm:inline">{totalEnrolled} total enrolled</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1.5 rounded-lg bg-surface border border-line text-fg hover:bg-surface-2 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand min-h-[32px]"
            >
              Previous
            </button>
            <span className="text-fg font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
              className="px-2.5 py-1.5 rounded-lg bg-surface border border-line text-fg hover:bg-surface-2 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand min-h-[32px]"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

