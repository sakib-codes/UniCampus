"use client";

import {
  Calendar,
  Clock,
  CheckCircle2,
  X,
  Monitor,
  Video,
  Volume2,
  Check,
  RefreshCw,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { Badge, Button } from "@/components/ui";
import { ACTIVE_TERM } from "@/lib/canonicalCampus";
import { COURSE_OPTIONS, type SlotData } from "./adminRoutineData";

interface SlotInspectorPanelProps {
  activeSlot: SlotData | null;
  onCourseChange: (newCode: string) => void;
  onSectionChange: (newSection: string) => void;
  onUpdateSlot: () => void;
  onUnassignSlot: () => void;
  onSyncSlot: () => void;
  onReassignClick: (courseCode: string) => void;
}

export function SlotInspectorPanel({
  activeSlot,
  onCourseChange,
  onSectionChange,
  onUpdateSlot,
  onUnassignSlot,
  onSyncSlot,
  onReassignClick,
}: SlotInspectorPanelProps) {
  return (
    <div className="w-full lg:max-w-[330px] xl:max-w-[340px] min-w-0 shrink-0 bg-surface rounded-2xl border border-line p-5 flex flex-col justify-between">
      {!activeSlot ? (
        <div className="py-12 text-center space-y-2">
          <Monitor className="w-8 h-8 text-fg-muted/50 mx-auto" />
          <p className="text-sm font-semibold text-fg">No slot selected</p>
          <p className="text-xs text-fg-muted">
            Click any scheduled card or free slot in the timetable matrix to inspect or assign it.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {/* Drawer Header */}
            <div className="flex items-start justify-between gap-2 border-b border-line pb-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand shrink-0" />
                  <h2 className="text-base font-semibold text-fg">
                    Edit Slot Allocation
                  </h2>
                </div>
                <Badge variant="brand" className="mt-2 font-sans tabular-nums whitespace-nowrap">
                  {activeSlot.room} · {activeSlot.day}{" "}
                  {activeSlot.timeRange.replace(" - ", "–")}
                </Badge>
              </div>

              <button
                type="button"
                onClick={onSyncSlot}
                className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-xl hover:bg-surface-2 text-fg-muted hover:text-fg transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                title="Sync Slot"
                aria-label="Sync Slot"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Controlled Course Field */}
              <div>
                <label
                  htmlFor="routine-course-select"
                  className="block text-xs font-sans text-fg-muted mb-1.5 font-semibold"
                >
                  Assigned Course
                </label>
                <div className="relative">
                  <select
                    id="routine-course-select"
                    value={activeSlot.courseCode}
                    onChange={(e) => onCourseChange(e.target.value)}
                    className="w-full min-h-[44px] bg-surface-2 border border-line text-fg text-xs font-sans rounded-xl pl-3 pr-9 py-2.5 truncate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus:border-brand cursor-pointer appearance-none"
                  >
                    {COURSE_OPTIONS.map((course) => (
                      <option key={course.code} value={course.code}>
                        {course.code} • {course.title}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-fg-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Section & Enrolled */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="routine-batch-section"
                    className="block text-xs font-sans text-fg-muted mb-1.5 font-semibold"
                  >
                    Batch Section
                  </label>
                  <input
                    id="routine-batch-section"
                    type="text"
                    value={activeSlot.section}
                    onChange={(e) => onSectionChange(e.target.value)}
                    className="w-full min-h-[40px] bg-surface-2 border border-line text-fg text-xs font-sans rounded-xl px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus:border-brand"
                  />
                </div>
                <div>
                  <span
                    id="routine-enrolled-count-label"
                    className="block text-xs font-sans text-fg-muted mb-1.5 font-semibold"
                  >
                    Enrolled
                  </span>
                  <div
                    id="routine-enrolled-count"
                    aria-labelledby="routine-enrolled-count-label"
                    className="flex items-center h-[40px] px-3 bg-surface-2 border border-line rounded-xl text-xs font-sans tabular-nums text-brand font-semibold"
                  >
                    <span>{activeSlot.enrolled} Students</span>
                  </div>
                </div>
              </div>

              {/* Lead Instructor */}
              <div>
                <span
                  id="routine-lead-instructor-label"
                  className="block text-xs font-sans text-fg-muted mb-1.5 font-semibold"
                >
                  Lead Instructor
                </span>
                <div
                  id="routine-lead-instructor"
                  aria-labelledby="routine-lead-instructor-label"
                  className="bg-surface-2 border border-line rounded-xl p-3 space-y-2"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-brand-soft border border-brand/20 flex items-center justify-center text-xs font-semibold text-brand shrink-0">
                      {activeSlot.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-fg truncate">
                        {activeSlot.instructor}
                      </p>
                      <p className="text-xs text-fg-muted font-sans truncate">
                        {activeSlot.instructorDept}
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-line flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 font-sans text-xs text-success font-semibold">
                      <CheckCircle2 className="w-3 h-3 shrink-0" />
                      <span>No Conflict</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => onReassignClick(activeSlot.courseCode)}
                      className="text-xs text-brand hover:underline font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded px-1"
                    >
                      Reassign
                    </button>
                  </div>
                </div>
              </div>

              {/* Room & Capacity Status */}
              <div>
                <span
                  id="routine-room-capacity-label"
                  className="block text-xs font-sans text-fg-muted mb-1.5 font-semibold"
                >
                  Capacity &amp; Room Equipment
                </span>
                <div
                  id="routine-room-capacity"
                  aria-labelledby="routine-room-capacity-label"
                  className="bg-surface-2 border border-line rounded-xl p-3 space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-sans mb-1.5">
                      <span className="text-fg-muted">Room Saturation:</span>
                      <span className="text-fg font-semibold tabular-nums">
                        {activeSlot.enrolled} / {activeSlot.roomCapacity} seats (
                        {Math.round(
                          (activeSlot.enrolled / activeSlot.roomCapacity) * 100
                        )}
                        %)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-canvas rounded-full overflow-hidden border border-line">
                      <div
                        className="h-full bg-brand rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round(
                              (activeSlot.enrolled / activeSlot.roomCapacity) *
                              100
                            )
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-xs px-2 py-0.5 rounded-md bg-success-light text-success border border-success/20 flex items-center gap-1 font-sans">
                      <Video className="w-3 h-3" /> Projector
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-success-light text-success border border-success/20 flex items-center gap-1 font-sans">
                      <Volume2 className="w-3 h-3" /> Sound System
                    </span>
                  </div>
                </div>
              </div>

              {/* Recurring Schedule Rule */}
              <div className="bg-surface-2 rounded-xl p-3 border border-line flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-brand shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-fg">
                      Weekly on {activeSlot.day}
                    </p>
                    <p className="text-xs text-fg-muted font-sans">
                      Effective {ACTIVE_TERM} Term
                    </p>
                  </div>
                </div>
                <ShieldCheck className="w-4 h-4 text-success shrink-0" />
              </div>
            </div>
          </div>

          {/* Bottom Drawer Actions */}
          <div className="mt-5 space-y-2.5 pt-4 border-t border-line">
            <Button
              variant="primary"
              size="sm"
              fullWidth
              leftIcon={<Check className="w-4 h-4" />}
              onClick={onUpdateSlot}
            >
              Update Slot Allocation
            </Button>

            <Button
              variant="danger"
              size="sm"
              fullWidth
              leftIcon={<X className="w-3.5 h-3.5" />}
              onClick={onUnassignSlot}
            >
              Unassign Room / Clear Slot
            </Button>

            <p className="text-xs font-sans text-fg-muted text-center pt-1">
              Last modified by Syed Tariqul Islam 4m ago
            </p>
          </div>
        </>
      )}
    </div>
  );
}
