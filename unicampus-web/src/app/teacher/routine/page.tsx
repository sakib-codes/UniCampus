"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  BookOpen, 
  Download, 
  Printer, 
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { teacherService, TeacherTimetableSlot } from "@/lib/services/teacherService";
import { themeTokens } from "@/lib/theme";
import SpotlightCard from "@/components/bits/SpotlightCard";
import ClickSpark from "@/components/bits/ClickSpark";
import DecryptedText from "@/components/bits/DecryptedText";

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
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              FACULTY SCHEDULE
            </span>
            <span className="text-xs text-slate-400 dark:text-[#6E747D] font-mono">• Fall 2026</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-[#F0F6FC] tracking-tight">
            Teaching Timetable &amp; Office Hours
          </h1>
          <p className="text-xs font-medium text-slate-500 dark:text-[#8D96A0] mt-0.5">
            Personal academic lecture roster, laboratory allocations, and advising sessions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ClickSpark sparkColor="#2563EB" sparkCount={6} sparkRadius={18}>
            <button
              onClick={() => window.print()}
              className={`${themeTokens.btnSecondary} px-3.5 py-2 text-xs flex items-center gap-1.5 cursor-pointer`}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Schedule</span>
            </button>
          </ClickSpark>
        </div>
      </div>

      {/* Day Filter Tabs */}
      <div className={`flex items-center gap-1.5 p-1.5 ${themeTokens.tabTrack} overflow-x-auto relative`}>
        {daysList.map((day) => {
          const isActive = activeDay === day;
          return (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`relative px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors duration-200 z-10 ${
                isActive
                  ? "text-slate-900 dark:text-white"
                  : "text-slate-500 hover:text-slate-800 dark:text-[#8D96A0] dark:hover:text-white"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="teacher-routine-day-pill"
                  className="absolute inset-0 bg-white dark:bg-[#1A2234] shadow-[0_2px_8px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,1)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.15)] border border-white dark:border-white/20 rounded-xl -z-10"
                  transition={{ type: "spring", stiffness: 450, damping: 32 }}
                />
              )}
              {day}
            </button>
          );
        })}
      </div>

      {/* Routine Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeDay}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filteredSlots.map((slot) => {
            const isLab = slot.type === 'Lab';
            const isConsultation = slot.type === 'Consultation';

            return (
              <SpotlightCard
                key={slot.id}
                className={`${themeTokens.card} p-5 flex flex-col justify-between border-t-4 ${
                  isLab
                    ? "border-t-emerald-500"
                    : isConsultation
                    ? "border-t-amber-500"
                    : "border-t-brand"
                }`}
                spotlightColor="rgba(99, 102, 241, 0.12)"
              >
                <div>
                  {/* Day & Type Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-slate-500 dark:text-[#8D96A0]">
                      {slot.day}
                    </span>
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                      isLab
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        : isConsultation
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                        : "bg-brand/10 text-brand border border-brand/20"
                    }`}>
                      {slot.type}
                    </span>
                  </div>

                  {/* Course Code & Title */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono text-xs font-black text-brand">
                      <DecryptedText text={slot.courseCode} speed={30} maxIterations={8} animateOn="hover" />
                    </span>
                    {slot.section && (
                      <span className="font-mono text-[10px] font-bold text-slate-400 dark:text-[#6E747D]">
                        ({slot.section})
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-[#F0F6FC] leading-snug mb-4">
                    {slot.courseTitle}
                  </h3>

                  {/* Time & Room metadata */}
                  <div className="space-y-2 text-xs text-slate-600 dark:text-[#8D96A0]">
                    <div className="flex items-center gap-2 font-mono">
                      <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-[#6E747D]" />
                      <span>{slot.startTime} - {slot.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-[#6E747D]" />
                      <span className="font-bold text-slate-800 dark:text-[#F0F6FC]">
                        <DecryptedText text={slot.room} speed={30} maxIterations={8} animateOn="view" />
                      </span>
                    </div>
                  </div>
                </div>

                <div className={`mt-4 pt-3 border-t ${themeTokens.border} flex items-center justify-between text-[11px]`}>
                  <span className="text-slate-400 dark:text-[#6E747D]">Status</span>
                  <span className="text-emerald-500 font-bold flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3 h-3" />
                    Room Allocated
                  </span>
                </div>
              </SpotlightCard>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

