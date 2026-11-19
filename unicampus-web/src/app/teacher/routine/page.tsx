"use client";

import { useState, useMemo, memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Calendar, Clock, MapPin, Printer } from "lucide-react";
import { ACTIVE_TERM, CANONICAL_FACULTY } from "@/lib/canonicalCampus";
import { teacherService, TeacherTimetableSlot } from "@/lib/services/teacherService";
import { Tabs, Badge, EmptyState, type BadgeVariant } from "@/components/ui";

const WEEKDAYS = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
] as const;

const DAYS_LIST = ["All Days", ...WEEKDAYS] as const;

const SLOT_TYPE_STYLES: Record<
  TeacherTimetableSlot["type"],
  { badgeVariant: BadgeVariant; codeAccent: string }
> = {
  Theory: { badgeVariant: "brand", codeAccent: "text-brand" },
  Lab: { badgeVariant: "success", codeAccent: "text-success" },
  Consultation: { badgeVariant: "warning", codeAccent: "text-warning" },
};

/** Parse "HH:MM AM/PM" into minutes since midnight for chronological sorting. */
function parseTimeToMinutes(timeStr: string): number {
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return 0;
  let hours = Number.parseInt(match[1], 10);
  const minutes = Number.parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  if (period === "AM" && hours === 12) hours = 0;
  else if (period === "PM" && hours !== 12) hours += 12;
  return hours * 60 + minutes;
}

const RoutineSlotCard = memo(function RoutineSlotCard({
  slot,
}: {
  slot: TeacherTimetableSlot;
}) {
  const style = SLOT_TYPE_STYLES[slot.type];

  return (
    <div className="rounded-2xl bg-surface border border-line hover:border-fg-subtle/40 p-5 flex flex-col justify-between transition-colors break-inside-avoid">
      <div>
        {/* Course Code, Section & Category Pill */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className={`font-mono text-xs font-semibold tracking-tight ${style.codeAccent}`}>
              {slot.courseCode}
            </span>
            {slot.section && (
              <>
                <span className="text-fg-subtle text-xs" aria-hidden="true">
                  •
                </span>
                <span className="font-sans text-xs text-fg-muted truncate">
                  {slot.section}
                </span>
              </>
            )}
          </div>
          <Badge variant={style.badgeVariant}>{slot.type}</Badge>
        </div>

        {/* Course / Session Title */}
        <h3 className="text-[15px] font-semibold text-fg leading-snug mt-2.5">
          {slot.courseTitle}
        </h3>
      </div>

      {/* Footer Time & Room Metadata */}
      <div className="pt-3 mt-4 border-t border-line/60 flex items-center justify-between gap-3 text-xs font-sans">
        <div className="flex items-center gap-1.5 text-fg-muted tabular-nums whitespace-nowrap">
          <Clock className="w-3.5 h-3.5 text-fg-muted shrink-0" aria-hidden="true" />
          <span>
            {slot.startTime} – {slot.endTime}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-fg font-medium whitespace-nowrap">
          <MapPin className="w-3.5 h-3.5 text-fg-muted shrink-0" aria-hidden="true" />
          <span>{slot.room}</span>
        </div>
      </div>
    </div>
  );
});

export default function TeacherRoutinePage() {
  const [activeDay, setActiveDay] = useState<string>("All Days");
  const shouldReduceMotion = useReducedMotion();
  const slots: TeacherTimetableSlot[] = useMemo(() => teacherService.getRoutine(), []);

  const workloadSummary = useMemo(() => {
    let theory = 0;
    let lab = 0;
    let consultation = 0;
    for (const s of slots) {
      if (s.type === "Theory") theory += 1;
      else if (s.type === "Lab") lab += 1;
      else if (s.type === "Consultation") consultation += 1;
    }
    return { total: slots.length, theory, lab, consultation };
  }, [slots]);

  const dayCounts = useMemo(() => {
    const counts: Record<string, number> = { "All Days": slots.length };
    for (const day of WEEKDAYS) counts[day] = 0;
    for (const s of slots) {
      if (s.day in counts) counts[s.day] += 1;
    }
    return counts;
  }, [slots]);

  const groupedByDay = useMemo(() => {
    return WEEKDAYS.map((day) => ({
      day,
      items: slots
        .filter((s) => s.day === day)
        .sort((a, b) => parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime)),
    })).filter((group) => group.items.length > 0);
  }, [slots]);

  const selectedDaySlots = useMemo(() => {
    if (activeDay === "All Days") return [];
    return slots
      .filter((s) => s.day === activeDay)
      .sort((a, b) => parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime));
  }, [slots, activeDay]);

  return (
    <div className="w-full space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-fg tracking-tight">
            Teaching Timetable &amp; Office Hours
          </h1>
          <p className="text-[13px] text-fg-muted mt-1">
            {CANONICAL_FACULTY.name} • {CANONICAL_FACULTY.office} • {ACTIVE_TERM} lecture, lab, and advising schedule
          </p>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-sans tabular-nums text-fg-muted mt-2">
            <span className="font-medium text-fg">{workloadSummary.total} sessions</span>
            <span className="text-fg-subtle" aria-hidden="true">
              •
            </span>
            <span>{workloadSummary.theory} Theory</span>
            <span className="text-fg-subtle" aria-hidden="true">
              •
            </span>
            <span>{workloadSummary.lab} Lab</span>
            <span className="text-fg-subtle" aria-hidden="true">
              •
            </span>
            <span>{workloadSummary.consultation} Consultation</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="min-h-[44px] bg-surface hover:bg-surface-2 text-fg border border-line px-3.5 py-2 text-xs inline-flex items-center gap-1.5 cursor-pointer rounded-xl font-semibold transition-colors print:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <Printer className="w-3.5 h-3.5 text-fg-muted" aria-hidden="true" />
            <span>Print Schedule</span>
          </button>
        </div>
      </div>

      {/* Day Filter Tabs */}
      <Tabs
        tabs={DAYS_LIST.map((day) => ({
          id: day,
          label: day,
          count: dayCounts[day] ?? 0,
        }))}
        value={activeDay}
        onChange={setActiveDay}
        layoutId="teacher-routine-day-pill"
        size="sm"
        ariaLabel="Filter routine by day"
        className="print:hidden max-w-full"
      />

      {/* Routine Content */}
      <motion.div
        key={activeDay}
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.12, ease: "easeOut" }}
      >
        {activeDay === "All Days" ? (
          groupedByDay.length === 0 ? (
            <div className="rounded-2xl bg-surface border border-line">
              <EmptyState
                icon={<Calendar className="w-5 h-5" />}
                title="No teaching sessions scheduled"
                description={`No weekly sessions are configured for ${CANONICAL_FACULTY.name} in ${ACTIVE_TERM}.`}
              />
            </div>
          ) : (
            <div className="space-y-6">
              {groupedByDay.map((group) => (
                <section key={group.day} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <h2 className="text-sm font-semibold text-fg tracking-tight">
                      {group.day}
                    </h2>
                    <span className="text-xs font-sans tabular-nums text-fg-muted bg-surface-2 border border-line px-2 py-0.5 rounded-full">
                      {group.items.length} {group.items.length === 1 ? "session" : "sessions"}
                    </span>
                    <div className="flex-1 h-px bg-line" aria-hidden="true" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {group.items.map((slot) => (
                      <RoutineSlotCard key={slot.id} slot={slot} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )
        ) : selectedDaySlots.length === 0 ? (
          <div className="rounded-2xl bg-surface border border-line">
            <EmptyState
              icon={<Calendar className="w-5 h-5" />}
              title={`No sessions scheduled for ${activeDay}`}
              description={`Select another day or switch to All Days to view ${CANONICAL_FACULTY.name}'s ${ACTIVE_TERM} timetable.`}
            />
          </div>
        ) : (
          <div>
            <h2 className="hidden print:block text-sm font-semibold text-fg mb-3">
              {activeDay}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {selectedDaySlots.map((slot) => (
                <RoutineSlotCard key={slot.id} slot={slot} />
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

