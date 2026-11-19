"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, MapPin, Printer } from "lucide-react";
import { ACTIVE_TERM, CANONICAL_FACULTY } from "@/lib/canonicalCampus";
import { teacherService, TeacherTimetableSlot } from "@/lib/services/teacherService";
import { Tabs, EmptyState } from "@/components/ui";

const daysList = ["All Days", "Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

export default function TeacherRoutinePage() {
  const [activeDay, setActiveDay] = useState("All Days");
  const slots: TeacherTimetableSlot[] = teacherService.getRoutine();

  const filteredSlots = slots.filter((slot) => {
    if (activeDay === "All Days") return true;
    return slot.day === activeDay;
  });

  return (
    <div className="w-full space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-fg tracking-tight">
            Teaching Timetable &amp; Office Hours
          </h1>
          <p className="text-xs font-medium text-fg-muted mt-1">
            {CANONICAL_FACULTY.name} • {CANONICAL_FACULTY.office} • {ACTIVE_TERM} lecture, lab, and advising schedule
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="min-h-[44px] bg-surface hover:bg-surface-2 text-fg border border-line px-3.5 py-2 text-xs inline-flex items-center gap-1.5 cursor-pointer rounded-xl font-semibold transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Schedule</span>
          </button>
        </div>
      </div>

      {/* Day Filter Tabs */}
      <Tabs
        tabs={daysList.map((day) => ({ id: day, label: day }))}
        value={activeDay}
        onChange={setActiveDay}
        layoutId="teacher-routine-day-pill"
        ariaLabel="Filter routine by day"
        className="w-full sm:w-auto"
      />

      {/* Routine Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeDay}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {filteredSlots.length === 0 ? (
            <div className="rounded-[20px] bg-surface border border-line">
              <EmptyState
                icon={<Calendar className="w-5 h-5" />}
                title={`No sessions scheduled for ${activeDay}`}
                description={`Select another day or switch to All Days to view ${CANONICAL_FACULTY.name}'s ${ACTIVE_TERM} timetable.`}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSlots.map((slot) => {
                const isLab = slot.type === "Lab";
                const isConsultation = slot.type === "Consultation";

                return (
                  <div
                    key={slot.id}
                    className={`rounded-[20px] bg-surface border border-line p-5 flex flex-col justify-between border-t-4 ${
                      isLab
                        ? "border-t-success"
                        : isConsultation
                        ? "border-t-warning"
                        : "border-t-brand"
                    }`}
                  >
                    <div>
                      {/* Day & Type Badge */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="font-mono text-xs font-bold text-fg-muted">
                          {slot.day}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                            isLab
                              ? "bg-success-light text-success border border-success/20"
                              : isConsultation
                              ? "bg-warning-light text-warning border border-warning/20"
                              : "bg-brand-soft text-brand border border-brand/20"
                          }`}
                        >
                          {slot.type}
                        </span>
                      </div>

                      {/* Course Code & Title */}
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="font-mono text-xs font-bold text-brand">
                          {slot.courseCode}
                        </span>
                        {slot.section && (
                          <span className="font-mono text-xs font-medium text-fg-muted">
                            ({slot.section})
                          </span>
                        )}
                      </div>

                      <h3 className="font-semibold text-sm text-fg leading-snug mb-4">
                        {slot.courseTitle}
                      </h3>

                      {/* Time & Room metadata */}
                      <div className="space-y-2 text-xs text-fg-muted">
                        <div className="flex items-center gap-2 font-mono">
                          <Clock className="w-3.5 h-3.5 text-fg-muted shrink-0" />
                          <span>
                            {slot.startTime} - {slot.endTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 font-mono">
                          <MapPin className="w-3.5 h-3.5 text-fg-muted shrink-0" />
                          <span className="font-semibold text-fg">{slot.room}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

