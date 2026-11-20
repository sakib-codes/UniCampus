"use client";

import React, { memo } from "react";
import { CloudCheck, FileSpreadsheet, ShieldCheck, CheckCircle2 } from "lucide-react";

export interface AttendanceStickyFooterProps {
  lastAutoSaveSeconds: number;
  presentCount: number;
  lateCount: number;
  remainingCount: number;
  absentCount: number;
  saveSuccess: boolean;
  onExportExcel: () => void;
  onSaveFinalize: () => void;
}

export const AttendanceStickyFooter = memo(function AttendanceStickyFooter({
  lastAutoSaveSeconds,
  presentCount,
  lateCount,
  remainingCount,
  absentCount,
  saveSuccess,
  onExportExcel,
  onSaveFinalize,
}: AttendanceStickyFooterProps) {
  return (
    <footer className="mt-6 w-full relative lg:sticky lg:bottom-4 z-20 bg-surface border border-line rounded-2xl px-5 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
      {/* Left Summary */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-xs sm:text-[13px] text-fg-muted">
          <CloudCheck className="w-4 h-4 text-success shrink-0" aria-hidden="true" />
          <span>
            Auto-saved <span className="text-fg font-semibold tabular-nums">{lastAutoSaveSeconds} seconds ago</span>
          </span>
        </div>
        <span className="text-fg-subtle hidden sm:inline" aria-hidden="true">•</span>
        <div className="flex items-center gap-2 text-xs sm:text-[13px]">
          <span className="text-success font-semibold tabular-nums">{presentCount} Present</span>
          <span className="text-line" aria-hidden="true">|</span>
          <span className="text-warning font-semibold tabular-nums">{lateCount} Late</span>
          <span className="text-line" aria-hidden="true">|</span>
          <span className="text-fg-muted font-semibold tabular-nums">
            {saveSuccess ? `${absentCount} Absent` : `${remainingCount} Remaining`}
          </span>
        </div>
      </div>

      {/* Right Action Buttons */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
        {/* Secondary Button: Export Excel Sheet */}
        <button
          type="button"
          onClick={onExportExcel}
          className="px-4 py-2.5 rounded-xl bg-surface-2 hover:bg-surface border border-line text-fg font-semibold text-xs sm:text-[13px] flex items-center gap-2 transition-colors duration-150 cursor-pointer shadow-xs active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand min-h-[44px] sm:min-h-[38px]"
        >
          <FileSpreadsheet className="w-4 h-4 text-fg-muted" aria-hidden="true" />
          <span>Export Excel Sheet</span>
        </button>

        {/* Primary Action Button: Save & Finalize */}
        <button
          type="button"
          onClick={onSaveFinalize}
          className="px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-on-brand font-semibold text-xs sm:text-[13px] flex items-center gap-2 shadow-xs transition-colors duration-150 cursor-pointer active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand min-h-[44px] sm:min-h-[38px]"
        >
          {saveSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
              <span>Session Finalized &amp; Synced!</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              <span>Save &amp; Finalize Attendance</span>
            </>
          )}
        </button>
      </div>
    </footer>
  );
});
