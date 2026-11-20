"use client";

import React, { memo } from "react";
import { Check, Clock3, XCircle } from "lucide-react";
import { StudentRosterRecord } from "@/lib/attendanceService";
import { Avatar } from "@/components/ui/Avatar";

export interface AttendanceRosterRowProps {
  student: StudentRosterRecord;
  onSetStatus: (studentId: string, status: "present" | "late" | "absent") => void;
}

function getAcademicSubtitle(student: StudentRosterRecord): string {
  if (student.name === "Anika Tabassum") return "Section A • CR Assistant";
  if (student.name === "Farhan Sadik") return "Section A • Competitive Prog Lead";
  if (
    student.rankBadge &&
    !student.rankBadge.toLowerCase().includes("check") &&
    !student.rankBadge.toLowerCase().includes("awaiting") &&
    !student.rankBadge.toLowerCase().includes("ping")
  ) {
    return student.rankBadge;
  }
  return "Section A";
}

export const AttendanceRosterRow = memo(function AttendanceRosterRow({
  student,
  onSetStatus,
}: AttendanceRosterRowProps) {
  const isPresent = student.status === "present";
  const isLate = student.status === "late";
  const isAbsent = student.status === "absent";
  const isUnscanned = student.status === "unscanned" || (!isPresent && !isLate && !isAbsent);

  return (
    <tr
      data-unscanned={isUnscanned ? "true" : undefined}
      className={`h-[54px] transition-colors duration-150 ${
        isLate
          ? "bg-warning-light/20 hover:bg-warning-light/30"
          : isAbsent
          ? "bg-danger-light/20 hover:bg-danger-light/30"
          : "hover:bg-surface-2/80"
      }`}
    >
      {/* Student Avatar + Name */}
      <td className="py-2.5 px-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <Avatar
            name={student.name}
            size="sm"
            className="shrink-0"
          />
          <div>
            <div className="font-medium text-xs sm:text-[13.5px] text-fg leading-none">
              {student.name}
            </div>
            <div className="text-xs text-fg-muted mt-1 font-normal">
              {getAcademicSubtitle(student)}
            </div>
          </div>
        </div>
      </td>

      {/* Student ID */}
      <td className="py-2.5 px-3 font-mono text-xs sm:text-[13px] text-fg-muted whitespace-nowrap">
        {student.studentId}
      </td>

      {/* Check-in Time */}
      <td className="py-2.5 px-3 whitespace-nowrap">
        {isUnscanned ? (
          <span className="text-fg-subtle text-xs sm:text-[13px] font-normal">
            —
          </span>
        ) : (
          <div
            className={`text-xs sm:text-[13px] font-medium flex items-center gap-1.5 tabular-nums ${
              isPresent
                ? "text-success"
                : isLate
                ? "text-warning"
                : "text-fg-muted"
            }`}
          >
            {isPresent && <Check className="w-3.5 h-3.5 text-success shrink-0" aria-hidden="true" />}
            {isLate && <Clock3 className="w-3.5 h-3.5 text-warning shrink-0" aria-hidden="true" />}
            <span>
              {student.checkInTime}
              {student.checkInMethod !== "--" && ` (${student.checkInMethod})`}
            </span>
          </div>
        )}
      </td>

      {/* Manual Status Toggle Segmented Control */}
      <td className="py-2.5 px-4 whitespace-nowrap">
        <div className="flex items-center justify-center bg-surface-2 p-0.5 rounded-lg border border-line gap-0.5 max-w-[210px] mx-auto">
          {/* Present Button */}
          <button
            type="button"
            aria-pressed={isPresent}
            onClick={() => onSetStatus(student.id, "present")}
            className={`flex-1 py-1 px-2 rounded-md font-semibold text-xs flex items-center justify-center gap-1 transition-colors duration-150 cursor-pointer min-h-[30px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
              isPresent
                ? "bg-success text-on-brand shadow-xs"
                : "text-fg-muted hover:text-fg"
            }`}
          >
            <Check className="w-3 h-3 shrink-0" aria-hidden="true" />
            <span>Present</span>
          </button>

          {/* Late Button */}
          <button
            type="button"
            aria-pressed={isLate}
            onClick={() => onSetStatus(student.id, "late")}
            className={`flex-1 py-1 px-2 rounded-md font-semibold text-xs flex items-center justify-center gap-1 transition-colors duration-150 cursor-pointer min-h-[30px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
              isLate
                ? "bg-warning text-on-brand shadow-xs"
                : "text-fg-muted hover:text-fg"
            }`}
          >
            <Clock3 className="w-3 h-3 shrink-0" aria-hidden="true" />
            <span>Late</span>
          </button>

          {/* Absent Button */}
          <button
            type="button"
            aria-pressed={isAbsent}
            onClick={() => onSetStatus(student.id, "absent")}
            className={`flex-1 py-1 px-2 rounded-md font-semibold text-xs flex items-center justify-center gap-1 transition-colors duration-150 cursor-pointer min-h-[30px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
              isAbsent
                ? "bg-danger text-on-brand shadow-xs"
                : "text-fg-muted hover:text-fg"
            }`}
          >
            <XCircle className="w-3 h-3 shrink-0" aria-hidden="true" />
            <span>Absent</span>
          </button>
        </div>
      </td>
    </tr>
  );
});

