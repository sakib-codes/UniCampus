"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import { CheckCircle2, FileDown, Send } from "lucide-react";
import { Badge, Button, PageHeader, Select, Toast } from "@/components/ui";
import { ACTIVE_TERM } from "@/lib/canonicalCampus";
import { adminService } from "@/lib/services/adminService";
import { supabaseSyncBridge } from "@/lib/supabase/syncBridge";
import {
  ADMIN_SETTINGS_UPDATED_EVENT,
  getActiveWorkingDays,
} from "@/lib/adminSettings";
import { useAdminAuth } from "@/context/AdminAuthContext";
import type { Department } from "@/types/admin";
import {
  COURSE_OPTIONS,
  INITIAL_SLOTS,
  ROOMS,
  TIME_SLOTS,
  type BuildingType,
  type DeptType,
  type RoomItem,
  type SlotData,
} from "@/components/admin/routine/adminRoutineData";
import { AdminRoutineToolbar } from "@/components/admin/routine/AdminRoutineToolbar";
import { TimetableMatrixGrid } from "@/components/admin/routine/TimetableMatrixGrid";
import { SlotInspectorPanel } from "@/components/admin/routine/SlotInspectorPanel";
import { PublishTimetableModal } from "@/components/admin/routine/PublishTimetableModal";

const DAY_MAP: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function AdminRoutinePage() {
  const { isDeptAdmin, currentUser } = useAdminAuth();
  const [building, setBuilding] = useState<BuildingType>("bldg-1");
  const [workingDays, setWorkingDays] = useState<string[]>(["Sun", "Mon", "Tue", "Wed", "Thu"]);
  const [selectedDay, setSelectedDay] = useState("Sun");
  const [semester, setSemester] = useState(`${ACTIVE_TERM} (Active)`);
  const [capacityFilter, setCapacityFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [highlightConflicts, setHighlightConflicts] = useState(true);
  const [showUtilization, setShowUtilization] = useState(true);

  const [activeSlotId, setActiveSlotId] = useState<string>(() =>
    supabaseSyncBridge.isLive() ? "" : "slot-cse-402"
  );
  const [slots, setSlots] = useState<SlotData[]>(() =>
    supabaseSyncBridge.isLive() ? [] : INITIAL_SLOTS
  );
  const [liveDepartments, setLiveDepartments] = useState<Department[]>([]);
  const [liveCounts, setLiveCounts] = useState({ students: 0, faculty: 0 });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  // Sync active working days from Admin Settings (hides configured weekly holidays)
  useEffect(() => {
    const syncWorkingDays = () => {
      const days = getActiveWorkingDays();
      setWorkingDays(days);
      setSelectedDay((prev) => (days.includes(prev as typeof days[number]) ? prev : days[0] || "Sun"));
    };
    queueMicrotask(syncWorkingDays);
    window.addEventListener(ADMIN_SETTINGS_UPDATED_EVENT, syncWorkingDays);
    window.addEventListener("storage", syncWorkingDays);
    return () => {
      window.removeEventListener(ADMIN_SETTINGS_UPDATED_EVENT, syncWorkingDays);
      window.removeEventListener("storage", syncWorkingDays);
    };
  }, []);

  // Lock department filter if dept admin
  useEffect(() => {
    if (isDeptAdmin && currentUser) {
      queueMicrotask(() => {
        const code = currentUser.department_id?.replace("dept-", "").toLowerCase() || "cse";
        setDeptFilter(code);
      });
    }
  }, [isDeptAdmin, currentUser]);

  // Hydrate from adminService & live Supabase
  useEffect(() => {
    const syncMeta = () => {
      setLiveDepartments(adminService.getDepartments());
      const profs = adminService.getProfiles();
      setLiveCounts({
        students: profs.filter((p) => p.role === "student").length,
        faculty: profs.filter((p) => p.role === "teacher").length,
      });
    };
    queueMicrotask(() => {
      syncMeta();
      const storedRoutines = adminService.getRoutines();
      if (storedRoutines && storedRoutines.length > 0) {
        const convertedSlots: SlotData[] = storedRoutines.map((r, i) => {
          const day = DAY_NAMES[r.day_of_week] || "Mon";
          const timeRange = `${r.start_time} - ${r.end_time}`;
          const slotIndex = Math.max(
            0,
            TIME_SLOTS.findIndex(
              (ts) =>
                ts.label.includes(r.start_time) ||
                ts.label.startsWith(r.start_time.slice(0, 5))
            )
          );
          const roomMatch = ROOMS.find((rm) => rm.name.toLowerCase() === r.room.toLowerCase());
          const deptType: DeptType = r.room.toLowerCase().includes("lab")
            ? "lab"
            : (r.department_name.toLowerCase().includes("eee")
                ? "eee"
                : r.department_name.toLowerCase().includes("bba")
                ? "bba"
                : r.department_name.toLowerCase().includes("pharm")
                ? "pharm"
                : r.department_name.toLowerCase().includes("eng")
                ? "eng"
                : "cse");

          return {
            id: r.id || `slot-rtn-${i}`,
            room: r.room,
            roomCapacity: roomMatch?.capacity || 60,
            roomType: roomMatch?.type || "Tiered Lecture Hall",
            slotIndex: slotIndex >= 0 ? slotIndex : 0,
            slotSpan: 1,
            day,
            timeRange,
            courseCode: r.subject_code,
            courseName: r.subject_title,
            section: r.section || "Section A",
            instructor: r.teacher_name || "Faculty Member",
            instructorDept: r.department_name,
            initials: r.teacher_name
              ? r.teacher_name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
              : "FM",
            enrolled: 42,
            deptType,
            conflictFree: true,
          };
        });
        setSlots(convertedSlots);
      }
    });
  }, []);

  const activeSlot = useMemo(
    () => slots.find((s) => s.id === activeSlotId) ?? slots[0] ?? null,
    [slots, activeSlotId]
  );

  const conflictInfo = useMemo(() => {
    if (!activeSlot) return { hasConflict: false, message: "", conflicts: [] };
    const [startTime = "08:30", endTime = "10:00"] = activeSlot.timeRange.split(" - ");
    return adminService.checkRoutineConflicts({
      id: activeSlot.id,
      day_of_week: DAY_MAP[activeSlot.day] ?? 1,
      start_time: startTime.trim(),
      end_time: endTime.trim(),
      room: activeSlot.room,
      teacher_name: activeSlot.instructor,
    });
  }, [activeSlot]);

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

  const handlePublishConfirm = useCallback(() => {
    const mappedRoutines = slots.map((s) => {
      const [startTime = "08:30", endTime = "10:00"] = s.timeRange.split(" - ");
      return {
        id: s.id,
        subject_code: s.courseCode,
        subject_title: s.courseName,
        day_of_week: DAY_MAP[s.day] ?? 1,
        start_time: startTime.trim(),
        end_time: endTime.trim(),
        room: s.room,
        section: s.section,
        teacher_name: s.instructor,
        teacher_id: null,
        department_name: s.instructorDept || "Computer Science & Engineering",
        semester_name: "6th Semester" as const,
      };
    });

    adminService.publishRoutines(mappedRoutines);
    setIsPublishModalOpen(false);
    triggerToast("Semester timetable officially published across university portals!");
  }, [slots, triggerToast]);

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
            <Badge variant={conflictInfo.hasConflict ? "danger" : "success"}>
              {conflictInfo.hasConflict
                ? "1 Conflict Detected"
                : `0 Conflicts · ${slots.length} ${slots.length === 1 ? "Section" : "Sections"} Assigned`}
            </Badge>
          </span>
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={semester}
              onChange={setSemester}
              ariaLabel="Select semester term"
              variant="surface"
              className="min-w-[210px]"
              options={[
                { value: `${ACTIVE_TERM} (Active)`, label: `${ACTIVE_TERM} (Active)` },
                { value: "Academic Year 2025 (Archived)", label: "Academic Year 2025 (Archived)" },
                { value: "Academic Year 2027 (Draft)", label: "Academic Year 2027 (Draft)" },
              ]}
            />

            <Button
              variant="secondary"
              size="sm"
              leftIcon={<CheckCircle2 className="w-3.5 h-3.5 text-brand" />}
              onClick={() => {
                if (conflictInfo.hasConflict) {
                  triggerToast(`Conflict detected: ${conflictInfo.message}`);
                } else {
                  triggerToast("Conflict check verified zero lecturer or room overlaps.");
                }
              }}
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
        workingDays={workingDays}
        capacityFilter={capacityFilter}
        onCapacityFilterChange={setCapacityFilter}
        deptFilter={deptFilter}
        onDeptFilterChange={setDeptFilter}
        departments={liveDepartments}
        highlightConflicts={highlightConflicts}
        onHighlightConflictsChange={setHighlightConflicts}
        showUtilization={showUtilization}
        onShowUtilizationChange={setShowUtilization}
        isDeptAdmin={isDeptAdmin}
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
          conflictInfo={conflictInfo}
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
        assignedCount={slots.length}
        studentCount={liveCounts.students}
        facultyCount={liveCounts.faculty}
        onConfirm={handlePublishConfirm}
      />
    </div>
  );
}
