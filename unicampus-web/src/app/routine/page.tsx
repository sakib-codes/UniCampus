"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { FolderOpen, ExternalLink } from "lucide-react";
import { adminService } from "@/lib/services/adminService";
import type { ClassRoutine } from "@/types/admin";
import {
  WEEKLY_ROUTINE_DATA,
  type ScheduleSlot,
} from "@/components/routine/routineData";
import { RoutineHeaderControls } from "@/components/routine/RoutineHeaderControls";
import { RoutineDailyList } from "@/components/routine/RoutineDailyList";
import { RoutineSidebar } from "@/components/routine/RoutineSidebar";
import { WeeklyMatrixView } from "@/components/routine/WeeklyMatrixView";
import {
  CalendarSyncModal,
  SwapRequestModal,
} from "@/components/routine/RoutineModals";

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function mapAdminSlotToScheduleSlot(r: ClassRoutine, idx: number): ScheduleSlot {
  const isLab =
    r.room.toLowerCase().includes("lab") ||
    r.subject_code.toLowerCase().includes("lab");
  return {
    id: r.id || `admin-slot-${idx}`,
    startTime: r.start_time,
    endTime: r.end_time,
    courseCode: r.subject_code,
    courseTitle: r.subject_title,
    status: "upcoming",
    statusText: "Scheduled",
    instructorName: r.teacher_name,
    room: r.room,
    metaTopic: `${isLab ? "Lab Practical" : "Theory"} • ${r.section || "Sec A"}`,
    isLab,
    secondaryAction: { label: "Course Materials", icon: FolderOpen, href: "/materials" },
    primaryAction: { label: "Classroom Link", icon: ExternalLink, href: "#" },
  };
}

export default function RoutinePage() {
  const [selectedDay, setSelectedDay] = useState<string>("Monday");
  const [viewMode, setViewMode] = useState<"daily" | "weekly">("daily");
  const [filterType, setFilterType] = useState<"all" | "theory" | "lab">("all");
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [calendarSyncSuccess, setCalendarSyncSuccess] = useState(false);
  const [swapSubmitted, setSwapSubmitted] = useState(false);
  const [adminRoutines, setAdminRoutines] = useState<ClassRoutine[]>([]);

  const loadRoutines = useCallback(() => {
    try {
      const routines = adminService.getRoutines();
      setAdminRoutines(routines);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      loadRoutines();
    });

    const handleUpdate = () => {
      loadRoutines();
    };
    window.addEventListener("unicampus:routines-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("unicampus:routines-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [loadRoutines]);

  const activeDaySlots = useMemo(() => {
    const dayAdminSlots = adminRoutines.filter(
      (r) => DAYS_OF_WEEK[r.day_of_week] === selectedDay
    );
    let rawSlots: ScheduleSlot[];

    if (dayAdminSlots.length > 0) {
      const mapped = dayAdminSlots.map(mapAdminSlotToScheduleSlot);
      const defaultSlots = WEEKLY_ROUTINE_DATA[selectedDay] || [];
      const breakSlot = defaultSlots.find((s) => s.isBreak);
      if (breakSlot) {
        rawSlots = [...mapped, breakSlot].sort((a, b) =>
          a.startTime.localeCompare(b.startTime)
        );
      } else {
        rawSlots = mapped;
      }
    } else {
      rawSlots = WEEKLY_ROUTINE_DATA[selectedDay] || [];
    }

    if (filterType === "theory") {
      return rawSlots.filter((s) => s.isBreak || (!s.isLab && s.courseCode));
    }
    if (filterType === "lab") {
      return rawSlots.filter((s) => s.isBreak || s.isLab);
    }
    return rawSlots;
  }, [adminRoutines, selectedDay, filterType]);

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
