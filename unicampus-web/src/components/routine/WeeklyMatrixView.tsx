"use client";

import { memo } from "react";
import { LayoutGrid, Coffee } from "lucide-react";
import {
  DAYS_LIST,
  WEEKLY_TIME_GRID_SLOTS,
  WeeklyMatrixRow,
} from "./routineData";

export interface WeeklyMatrixViewProps {
  selectedDay?: string;
}

const MatrixSlotCell = memo(function MatrixSlotCell({ val }: { val: string }) {
  const isLab = val.includes("(Lab)");
  const isActiveSlot = val.includes("(Active)");

  if (val === "-") {
    return (
      <td className="py-3 px-3 text-fg-subtle font-sans text-xs">—</td>
    );
  }

  return (
    <td className="py-2.5 px-3">
      <div
        className={`p-2 rounded-xl border transition-colors ${
          isActiveSlot
            ? "bg-brand-soft border-brand"
            : isLab
            ? "bg-success-light border-success/30 text-success"
            : "bg-surface-2 border-line"
        }`}
      >
        <div className="flex items-center justify-between gap-1.5">
          <span className="font-mono font-semibold text-xs text-fg">
            {val.replace(" (Active)", "").replace(" (Lab)", "")}
          </span>
          {isLab && (
            <span className="font-sans text-xs px-1.5 py-0.5 rounded bg-success-light text-success font-semibold">
              LAB
            </span>
          )}
          {isActiveSlot && (
            <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0" aria-hidden="true" />
          )}
        </div>
      </div>
    </td>
  );
});

const MatrixTableRow = memo(function MatrixTableRow({
  row,
}: {
  row: WeeklyMatrixRow;
}) {
  const isBreakRow = row.mon === "Break";
  if (isBreakRow) {
    return (
      <tr className="bg-warning-light/40 border-y border-warning/25">
        <td className="py-2.5 px-3 font-sans tabular-nums text-xs font-semibold text-warning whitespace-nowrap bg-warning-light/60">
          {row.time}
        </td>
        <td colSpan={DAYS_LIST.length} className="py-2.5 px-4 text-center">
          <span className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-warning">
            <Coffee className="w-3.5 h-3.5" aria-hidden="true" />
            Midday Recess &amp; Campus Prayer Break (All Departments)
          </span>
        </td>
      </tr>
    );
  }

  return (
    <tr className="hover:bg-surface-2/60 transition-colors">
      <td className="py-3 px-3 font-sans tabular-nums text-xs font-semibold text-fg-muted whitespace-nowrap bg-surface-2/40">
        {row.time}
      </td>
      {DAYS_LIST.map((day) => {
        const slotKey = day.toLowerCase().slice(0, 3) as
          | "mon"
          | "tue"
          | "wed"
          | "thu"
          | "fri"
          | "sat";
        return <MatrixSlotCell key={day} val={row[slotKey] || "-"} />;
      })}
    </tr>
  );
});

export const WeeklyMatrixView = memo(function WeeklyMatrixView({
  selectedDay,
}: WeeklyMatrixViewProps) {
  return (
    <div className="w-full">
      <div className="w-full bg-surface border border-line rounded-2xl p-4 sm:p-5 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-line mb-3 gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-brand-soft text-brand border border-brand/25 shrink-0">
              <LayoutGrid className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-sans font-semibold text-base text-fg">
                3rd Year · 6th Semester Master Timetable Grid
              </h2>
              <p className="text-xs text-fg-muted">
                Full weekly department layout • CSE Section A
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-sans flex-wrap">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-soft text-brand border border-brand/25 font-medium">
              <span className="w-2 h-2 rounded-full bg-brand" aria-hidden="true" />
              Theory Lecture
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-success-light text-success border border-success/25 font-medium">
              <span className="w-2 h-2 rounded-full bg-success" aria-hidden="true" />
              Lab Sessional
            </span>
          </div>
        </div>

        {/* Timetable Matrix Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-line bg-surface-2">
                <th className="py-3 px-3 font-sans text-xs font-semibold text-fg w-36 whitespace-nowrap">
                  Time Slot
                </th>
                {DAYS_LIST.map((day) => (
                  <th
                    key={day}
                    className={`py-3 px-3 font-sans text-xs font-semibold whitespace-nowrap ${
                      day === selectedDay ? "text-brand bg-brand-soft/60" : "text-fg"
                    }`}
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-xs">
              {WEEKLY_TIME_GRID_SLOTS.map((row) => (
                <MatrixTableRow key={row.time} row={row} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});
