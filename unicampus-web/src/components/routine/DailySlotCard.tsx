"use client";

import { memo } from "react";
import Link from "next/link";
import {
  Coffee,
  MapPin,
  Check,
  CircleDot,
  Cpu,
  Video,
  ExternalLink,
  FolderOpen,
} from "lucide-react";
import ProfileAvatar from "@/components/common/ProfileAvatar";
import { ScheduleSlot } from "./routineData";

export interface DailySlotCardProps {
  slot: ScheduleSlot;
  index: number;
}

export const DailySlotCard = memo(function DailySlotCard({
  slot,
  index,
}: DailySlotCardProps) {
  if (slot.isBreak) {
    return (
      <div className="w-full bg-surface-2 border border-dashed border-line rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-fg-muted gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-warning-light border border-warning/25 text-warning flex items-center justify-center shrink-0">
            <Coffee className="w-4 h-4" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-sans font-semibold text-fg text-sm">
                {slot.breakLabel}
              </span>
              <span className="font-sans tabular-nums text-xs px-2 py-0.5 rounded-full bg-surface border border-line text-fg-muted">
                {slot.breakDuration}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-sans tabular-nums text-fg-muted mt-0.5 flex-wrap">
              <span>
                {slot.startTime} - {slot.endTime}
              </span>
              <span aria-hidden="true">•</span>
              <span>{slot.breakLocation}</span>
            </div>
          </div>
        </div>
        <div className="self-end sm:self-center font-sans tabular-nums text-xs px-2.5 py-1 rounded-xl bg-surface border border-line text-fg shrink-0">
          Interval Slot 03
        </div>
      </div>
    );
  }

  if (slot.status === "active") {
    return (
      <div className="w-full bg-brand-soft/15 border border-brand/50 rounded-2xl p-4 transition-colors">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5">
          {/* Integrated Left Time Block */}
          <div className="flex sm:flex-col items-center sm:items-start justify-between sm:justify-center w-full sm:w-36 shrink-0 pb-2 sm:pb-0 sm:pr-4 sm:border-r border-line gap-1">
            <span className="font-sans tabular-nums font-semibold text-sm text-brand">
              {slot.startTime}
            </span>
            <span className="font-sans tabular-nums text-xs text-fg-muted">
              to {slot.endTime}
            </span>
            <span className="font-sans tabular-nums text-xs px-2 py-0.5 rounded-full bg-surface-2 text-fg-muted mt-1 border border-line">
              Slot 02
            </span>
          </div>

          {/* Center Content Body */}
          <div className="flex-1 space-y-2 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-semibold text-brand px-2 py-0.5 rounded-md bg-brand-soft border border-brand/30">
                {slot.courseCode}
              </span>
              <h3 className="font-sans font-semibold text-sm md:text-base text-fg">
                {slot.courseTitle}
              </h3>
              {/* Single calm active badge */}
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-soft text-brand border border-brand/30 text-xs font-semibold font-sans tabular-nums">
                In Progress • 42m left
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-fg-muted flex-wrap">
              <div className="flex items-center gap-1.5">
                <ProfileAvatar
                  alt={slot.instructorName || "Instructor"}
                  size="xs"
                  className="w-5 h-5 border border-line shrink-0"
                />
                <span className="text-fg font-medium">{slot.instructorName}</span>
              </div>
              <span aria-hidden="true">•</span>
              {/* Clean inline room metadata, NO heavy bordered pill */}
              <div className="inline-flex items-center gap-1.5 text-xs text-fg">
                <MapPin className="w-3.5 h-3.5 text-brand shrink-0" aria-hidden="true" />
                <span className="font-medium">{slot.room}</span>
              </div>
              {slot.metaTopic && (
                <>
                  <span aria-hidden="true">•</span>
                  <span className="text-fg-muted truncate max-w-sm">{slot.metaTopic}</span>
                </>
              )}
            </div>
          </div>

          {/* Right Action Buttons: Clean labeled buttons */}
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            {slot.secondaryAction && (
              <Link
                href={slot.secondaryAction.href || "/materials"}
                className="min-h-[36px] px-3 rounded-xl bg-surface-2 hover:bg-surface border border-line text-fg text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <FolderOpen className="w-3.5 h-3.5 text-fg-muted" aria-hidden="true" />
                <span>Materials</span>
              </Link>
            )}
            {slot.primaryAction && (
              <button
                type="button"
                title={slot.primaryAction.label}
                aria-label={slot.primaryAction.label}
                onClick={() =>
                  alert(`Connecting to ${slot.instructorName || "Instructor"}'s Live Lecture Room...`)
                }
                className="min-h-[36px] px-3.5 rounded-xl bg-brand hover:bg-brand-hover text-on-brand text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <Video className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Join Live</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const isCompleted = slot.status === "completed";

  return (
    <div className="w-full rounded-2xl bg-surface border border-line p-4 hover:border-brand/40 transition-colors">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5">
        {/* Integrated Left Time Block */}
        <div className="flex sm:flex-col items-center sm:items-start justify-between sm:justify-center w-full sm:w-36 shrink-0 pb-2 sm:pb-0 sm:pr-4 sm:border-r border-line gap-1">
          <span className="font-sans tabular-nums font-semibold text-sm text-fg">
            {slot.startTime}
          </span>
          <span className="font-sans tabular-nums text-xs text-fg-muted">
            to {slot.endTime}
          </span>
          <span
            className={`font-sans tabular-nums text-xs px-2 py-0.5 rounded-full mt-1 ${
              isCompleted
                ? "bg-surface-2 text-fg-muted"
                : slot.isLab
                ? "bg-success-light text-success font-semibold"
                : "bg-surface-2 text-fg-muted"
            }`}
          >
            {slot.isLab ? slot.labHours || "Lab Slot" : `Slot 0${index + 1}`}
          </span>
        </div>

        {/* Center Content Body */}
        <div className="flex-1 space-y-2 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`font-mono text-xs font-semibold px-2 py-0.5 rounded-md border ${
                slot.isLab
                  ? "text-success bg-success-light border-success/25"
                  : "text-fg-muted bg-surface-2 border-line"
              }`}
            >
              {slot.courseCode}
            </span>
            <h3 className="font-sans font-semibold text-sm md:text-base text-fg">
              {slot.courseTitle}
            </h3>
            {isCompleted ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-success-light text-success border border-success/25 text-xs font-semibold font-sans">
                <Check className="w-3 h-3 stroke-[2.5]" aria-hidden="true" />
                Completed
              </span>
            ) : (
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold font-sans tabular-nums border ${
                  slot.statusText?.includes("Upcoming in")
                    ? "bg-warning-light text-warning border-warning/25"
                    : "bg-surface-2 text-fg-muted border-line"
                }`}
              >
                <CircleDot className="w-2.5 h-2.5" aria-hidden="true" />
                {slot.statusText || "Upcoming"}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-fg-muted flex-wrap">
            <div className="flex items-center gap-1.5">
              <ProfileAvatar
                alt={slot.instructorName || "Instructor"}
                size="xs"
                className="w-5 h-5 border border-line shrink-0"
              />
              <span className="text-fg font-medium">{slot.instructorName}</span>
            </div>
            <span aria-hidden="true">•</span>
            {/* Clean inline room metadata, NO heavy bordered pill */}
            <div className="inline-flex items-center gap-1.5 text-xs text-fg">
              {slot.isLab ? (
                <Cpu className="w-3.5 h-3.5 text-success shrink-0" aria-hidden="true" />
              ) : (
                <MapPin className="w-3.5 h-3.5 text-brand shrink-0" aria-hidden="true" />
              )}
              <span className="font-medium">{slot.room}</span>
            </div>
            {slot.metaTopic && (
              <>
                <span aria-hidden="true">•</span>
                <span className="text-fg-muted truncate max-w-sm">{slot.metaTopic}</span>
              </>
            )}
          </div>
        </div>

        {/* Right Action Buttons: Clean labeled buttons */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          {slot.secondaryAction && (
            <Link
              href={slot.secondaryAction.href || "/materials"}
              className="min-h-[36px] px-3 rounded-xl bg-surface-2 hover:bg-surface border border-line text-fg text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <FolderOpen className="w-3.5 h-3.5 text-fg-muted" aria-hidden="true" />
              <span>Materials</span>
            </Link>
          )}
          {slot.primaryAction && (
            <button
              type="button"
              title={slot.primaryAction.label}
              aria-label={slot.primaryAction.label}
              onClick={() => alert(`Launching ${slot.courseTitle} Classroom Link...`)}
              className="min-h-[36px] px-3 rounded-xl bg-surface-2 hover:bg-surface border border-line text-fg text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <ExternalLink className="w-3.5 h-3.5 text-fg-muted" aria-hidden="true" />
              <span>Classroom</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
});
