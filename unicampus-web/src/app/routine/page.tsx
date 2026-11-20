"use client";

import { useState, useMemo, useCallback } from "react";
import { WEEKLY_ROUTINE_DATA } from "@/components/routine/routineData";
import { RoutineHeaderControls } from "@/components/routine/RoutineHeaderControls";
import { RoutineDailyList } from "@/components/routine/RoutineDailyList";
import { RoutineSidebar } from "@/components/routine/RoutineSidebar";
import { WeeklyMatrixView } from "@/components/routine/WeeklyMatrixView";
import {
  CalendarSyncModal,
  SwapRequestModal,
} from "@/components/routine/RoutineModals";

export default function RoutinePage() {
  const [selectedDay, setSelectedDay] = useState<string>("Monday");
  const [viewMode, setViewMode] = useState<"daily" | "weekly">("daily");
  const [filterType, setFilterType] = useState<"all" | "theory" | "lab">("all");
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [calendarSyncSuccess, setCalendarSyncSuccess] = useState(false);
  const [swapSubmitted, setSwapSubmitted] = useState(false);

  const activeDaySlots = useMemo(() => {
    const rawSlots = WEEKLY_ROUTINE_DATA[selectedDay] || [];
    if (filterType === "theory") {
      return rawSlots.filter((s) => s.isBreak || (!s.isLab && s.courseCode));
    }
    if (filterType === "lab") {
      return rawSlots.filter((s) => s.isBreak || s.isLab);
    }
    return rawSlots;
  }, [selectedDay, filterType]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleSyncCalendar = useCallback(() => {
    setCalendarSyncSuccess(true);
    setTimeout(() => {
      setCalendarSyncSuccess(false);
      setIsCalendarModalOpen(false);
    }, 1800);
  }, []);

  const handleSwapSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setSwapSubmitted(true);
    setTimeout(() => {
      setSwapSubmitted(false);
      setIsSwapModalOpen(false);
    }, 1800);
  }, []);

  return (
    <div className="w-full space-y-4 pb-8">
      {/* 1. Top Header & Separated Controls */}
      <RoutineHeaderControls
        selectedDay={selectedDay}
        onSelectDay={setSelectedDay}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        filterType={filterType}
        onChangeFilterType={setFilterType}
        onPrint={handlePrint}
        onOpenCalendarModal={() => setIsCalendarModalOpen(true)}
      />

      {/* 2. Main Content View Area */}
      {viewMode === "daily" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <RoutineDailyList
            selectedDay={selectedDay}
            activeDaySlots={activeDaySlots}
            onOpenSwapModal={() => setIsSwapModalOpen(true)}
          />
          <RoutineSidebar />
        </div>
      ) : (
        <WeeklyMatrixView selectedDay={selectedDay} />
      )}

      {/* 3. Modals */}
      <CalendarSyncModal
        open={isCalendarModalOpen}
        syncSuccess={calendarSyncSuccess}
        onClose={() => setIsCalendarModalOpen(false)}
        onSync={handleSyncCalendar}
      />
      <SwapRequestModal
        open={isSwapModalOpen}
        submitted={swapSubmitted}
        onClose={() => setIsSwapModalOpen(false)}
        onSubmit={handleSwapSubmit}
      />
    </div>
  );
}
