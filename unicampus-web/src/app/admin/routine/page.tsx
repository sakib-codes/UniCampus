"use client";

import { useMemo, useState, useCallback } from "react";
import { CheckCircle2, FileDown, Send, ChevronDown } from "lucide-react";
import { Badge, Button, PageHeader, Toast } from "@/components/ui";
import { ACTIVE_TERM } from "@/lib/canonicalCampus";
import {
  COURSE_OPTIONS,
  INITIAL_SLOTS,
  ROOMS,
  TIME_SLOTS,
  type BuildingType,
  type RoomItem,
  type SlotData,
} from "@/components/admin/routine/adminRoutineData";
import { AdminRoutineToolbar } from "@/components/admin/routine/AdminRoutineToolbar";
import { TimetableMatrixGrid } from "@/components/admin/routine/TimetableMatrixGrid";
import { SlotInspectorPanel } from "@/components/admin/routine/SlotInspectorPanel";
import { PublishTimetableModal } from "@/components/admin/routine/PublishTimetableModal";

export default function AdminRoutinePage() {
  const [building, setBuilding] = useState<BuildingType>("bldg-1");
  const [selectedDay, setSelectedDay] = useState("Mon");
  const [semester, setSemester] = useState(`${ACTIVE_TERM} (Active)`);
  const [capacityFilter, setCapacityFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [highlightConflicts, setHighlightConflicts] = useState(true);
  const [showUtilization, setShowUtilization] = useState(true);

  const [activeSlotId, setActiveSlotId] = useState<string>("slot-cse-402");
  const [slots, setSlots] = useState<SlotData[]>(INITIAL_SLOTS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  const activeSlot = useMemo(
    () => slots.find((s) => s.id === activeSlotId) ?? slots[0] ?? null,
    [slots, activeSlotId]
  );

  const filteredRooms = useMemo(() => {
    return ROOMS.filter((room) => {
      if (
        capacityFilter === "40-60" &&
        (room.capacity < 40 || room.capacity > 60)
      ) {
        return false;
      }
      if (capacityFilter === "60-100" && room.capacity < 60) {
        return false;
      }
      if (capacityFilter === "120+" && room.capacity < 120) {
        return false;
      }
      return true;
    });
  }, [capacityFilter]);

  const triggerToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  const handleUpdateSlot = useCallback(() => {
    if (!activeSlot) return;
    triggerToast(
      `Updated schedule parameters for ${activeSlot.courseCode} in ${activeSlot.room}.`
    );
  }, [activeSlot, triggerToast]);

  const handleUnassignSlot = useCallback(() => {
    if (!activeSlot) return;
    const removed = activeSlot;
    setSlots((prev) => prev.filter((s) => s.id !== removed.id));
    triggerToast(
      `Unassigned ${removed.courseCode} from ${removed.room}. Slot is now open.`
    );
  }, [activeSlot, triggerToast]);

  const handleCourseChange = useCallback(
    (newCode: string) => {
      if (!activeSlot) return;
      const match = COURSE_OPTIONS.find((c) => c.code === newCode);
      if (!match) return;
      setSlots((prev) =>
        prev.map((s) =>
          s.id === activeSlot.id
            ? {
                ...s,
                courseCode: match.code,
                courseName: match.title,
                instructor: match.instructor,
                instructorDept: match.instructorDept,
                initials: match.initials,
                deptType: s.deptType === "lab" ? "lab" : match.deptType,
              }
            : s
        )
      );
    },
    [activeSlot]
  );

  const handleSectionChange = useCallback(
    (newSection: string) => {
      if (!activeSlot) return;
      setSlots((prev) =>
        prev.map((s) =>
          s.id === activeSlot.id ? { ...s, section: newSection } : s
        )
      );
    },
    [activeSlot]
  );

  const handleAssignFreeSlot = useCallback(
    (room: RoomItem, slotIdx: number) => {
      const newId = `slot-new-${room.id}-${selectedDay.toLowerCase()}-${slotIdx}-${Date.now()}`;
      const defaultCourse = room.isLab ? COURSE_OPTIONS[1] : COURSE_OPTIONS[0];
      const created: SlotData = {
        id: newId,
        room: room.name,
        roomCapacity: room.capacity,
        roomType: room.type,
        slotIndex: slotIdx,
        slotSpan: 1,
        day: selectedDay,
        timeRange: TIME_SLOTS[slotIdx].label,
        courseCode: defaultCourse.code,
        courseName: defaultCourse.title,
        section: "Section A",
        instructor: defaultCourse.instructor,
        instructorDept: defaultCourse.instructorDept,
        initials: defaultCourse.initials,
        enrolled: Math.min(42, room.capacity),
        deptType: room.isLab ? "lab" : defaultCourse.deptType,
        conflictFree: true,
      };
      setSlots((prev) => [...prev, created]);
      setActiveSlotId(newId);
      triggerToast(
        `Assigned ${defaultCourse.code} to ${room.name} (${selectedDay} ${TIME_SLOTS[slotIdx].label}).`
      );
    },
    [selectedDay, triggerToast]
  );

  const handleBreakClick = useCallback(() => {
    triggerToast("Midday recess window (11:45–01:00) reserved across campus.");
  }, [triggerToast]);

  return (
    <div className="w-full space-y-5 antialiased selection:bg-brand/30 pb-6">
      <Toast
        open={Boolean(toastMessage)}
        message={toastMessage ?? ""}
        tone="success"
        durationMs={3500}
        onClose={() => setToastMessage(null)}
      />

      {/* PAGE HEADER & CONFLICT STATUS */}
      <PageHeader
        title="Master Routine & Room Allocation"
        description={
          <span className="flex flex-wrap items-center gap-2.5">
            <span>
              Configure lecture hours, laboratory allotments, and room assignments across departments
            </span>
            <Badge variant="success">0 Conflicts · 142 Sections Assigned</Badge>
          </span>
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                aria-label="Select semester term"
                className="min-h-[44px] appearance-none bg-surface border border-line text-fg text-xs font-sans font-semibold rounded-xl pl-3 pr-8 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus:border-brand cursor-pointer"
              >
                <option>{ACTIVE_TERM} (Active)</option>
                <option>Fall 2025 (Archived)</option>
                <option>Summer 2026 (Draft)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-fg-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <Button
              variant="secondary"
              size="sm"
              leftIcon={<CheckCircle2 className="w-3.5 h-3.5 text-brand" />}
              onClick={() =>
                triggerToast("Conflict check verified zero lecturer or room overlaps.")
              }
            >
              Verify Conflicts
            </Button>

            <Button
              variant="secondary"
              size="sm"
              leftIcon={<FileDown className="w-3.5 h-3.5 text-fg-muted" />}
              onClick={() =>
                triggerToast("Exporting Master Timetable Matrix CSV & PDF...")
              }
            >
              Export Matrix
            </Button>

            <Button
              variant="primary"
              size="sm"
              leftIcon={<Send className="w-3.5 h-3.5" />}
              onClick={() => setIsPublishModalOpen(true)}
            >
              Publish Timetable
            </Button>
          </div>
        }
      />

      <AdminRoutineToolbar
        building={building}
        onBuildingChange={setBuilding}
        selectedDay={selectedDay}
        onDayChange={setSelectedDay}
        capacityFilter={capacityFilter}
        onCapacityFilterChange={setCapacityFilter}
        deptFilter={deptFilter}
        onDeptFilterChange={setDeptFilter}
        highlightConflicts={highlightConflicts}
        onHighlightConflictsChange={setHighlightConflicts}
        showUtilization={showUtilization}
        onShowUtilizationChange={setShowUtilization}
      />

      {/* MAIN WORKSPACE: Flex-1 Matrix Grid + Inspector */}
      <div className="flex flex-col lg:flex-row items-start gap-5">
        <TimetableMatrixGrid
          rooms={filteredRooms}
          slots={slots}
          selectedDay={selectedDay}
          deptFilter={deptFilter}
          activeSlotId={activeSlot?.id ?? null}
          showUtilization={showUtilization}
          onSelectSlot={setActiveSlotId}
          onBreakClick={handleBreakClick}
          onAssignFreeSlot={handleAssignFreeSlot}
        />

        <SlotInspectorPanel
          activeSlot={activeSlot}
          onCourseChange={handleCourseChange}
          onSectionChange={handleSectionChange}
          onUpdateSlot={handleUpdateSlot}
          onUnassignSlot={handleUnassignSlot}
          onSyncSlot={() =>
            triggerToast("Slot details synced with Central Registry.")
          }
          onReassignClick={(code) =>
            triggerToast(`Reassignment directory opened for ${code}.`)
          }
        />
      </div>

      <PublishTimetableModal
        open={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        onConfirm={() => {
          setIsPublishModalOpen(false);
          triggerToast(
            "Semester timetable officially published across university portals!"
          );
        }}
      />
    </div>
  );
}
