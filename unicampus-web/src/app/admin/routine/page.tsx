"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Switch } from "@/components/common/Switch";
import {
  Calendar,
  Clock,
  CheckCircle2,
  FileDown,
  Send,
  Plus,
  ChevronDown,
  X,
  GripVertical,
  Monitor,
  Video,
  Volume2,
  Check,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { Badge, Button, PageHeader, Toast } from "@/components/ui";
import {
  ACTIVE_TERM,
  CAMPUS_METRICS,
  CANONICAL_COURSES,
  CANONICAL_DEPARTMENTS,
  CANONICAL_FACULTY,
  CANONICAL_TIME_SLOTS,
} from "@/lib/canonicalCampus";

type DeptType = "cse" | "eee" | "bba" | "pharm" | "eng" | "lab";
type BuildingType = "bldg-1" | "bldg-2" | "lab";

interface SlotData {
  id: string;
  room: string;
  roomCapacity: number;
  roomType: string;
  slotIndex: number; // 0 to 5
  slotSpan?: number; // 1 or 2
  day: string;
  timeRange: string;
  courseCode: string;
  courseName: string;
  section: string;
  instructor: string;
  instructorDept: string;
  initials: string;
  enrolled: number;
  deptType: DeptType;
  conflictFree: boolean;
}

const COURSE_OPTIONS = [
  {
    code: CANONICAL_COURSES["CSE-3101"].code,
    title: CANONICAL_COURSES["CSE-3101"].title,
    instructor: CANONICAL_COURSES["CSE-3101"].instructor,
    instructorDept: "Associate Professor • CSE",
    initials: "AR",
    deptType: "cse" as const,
  },
  {
    code: CANONICAL_COURSES["CSE-3102"].code,
    title: CANONICAL_COURSES["CSE-3102"].title,
    instructor: CANONICAL_FACULTY.name,
    instructorDept: "Associate Professor • CSE",
    initials: "AR",
    deptType: "lab" as const,
  },
  {
    code: CANONICAL_COURSES["CSE-3205"].code,
    title: CANONICAL_COURSES["CSE-3205"].title,
    instructor: CANONICAL_COURSES["CSE-3205"].instructor,
    instructorDept: "Senior Lecturer • CSE",
    initials: "FT",
    deptType: "cse" as const,
  },
  {
    code: CANONICAL_COURSES["CSE-4109"].code,
    title: CANONICAL_COURSES["CSE-4109"].title,
    instructor: CANONICAL_COURSES["CSE-4109"].instructor,
    instructorDept: "Associate Professor • CSE",
    initials: "AR",
    deptType: "cse" as const,
  },
  {
    code: "EEE-2201",
    title: "Circuit Theory & Analysis",
    instructor: "Prof. Jamal Uddin",
    instructorDept: "Professor & Head • EEE",
    initials: "JU",
    deptType: "eee" as const,
  },
  {
    code: "FIN-3102",
    title: "Managerial Finance",
    instructor: "Dr. Farhana Khan",
    instructorDept: "Professor & Head • BBA",
    initials: "FK",
    deptType: "bba" as const,
  },
];

const INITIAL_SLOTS: SlotData[] = [
  {
    id: "slot-eee-101",
    room: "Room 101",
    roomCapacity: 60,
    roomType: "Auditorium Tier",
    slotIndex: 0,
    slotSpan: 1,
    day: "Mon",
    timeRange: CANONICAL_TIME_SLOTS[0],
    courseCode: "EEE-2201",
    courseName: "Circuit Theory & Analysis",
    section: "Section B",
    instructor: "Prof. Jamal Uddin",
    instructorDept: "Professor & Head • EEE",
    initials: "JU",
    enrolled: 54,
    deptType: "eee",
    conflictFree: true,
  },
  {
    id: "slot-bba-101",
    room: "Room 101",
    roomCapacity: 60,
    roomType: "Auditorium Tier",
    slotIndex: 3,
    slotSpan: 1,
    day: "Mon",
    timeRange: CANONICAL_TIME_SLOTS[3],
    courseCode: "FIN-3102",
    courseName: "Managerial Finance",
    section: "Section A",
    instructor: "Dr. Farhana Khan",
    instructorDept: "Professor & Head • BBA",
    initials: "FK",
    enrolled: 58,
    deptType: "bba",
    conflictFree: true,
  },
  {
    id: "slot-cse-102",
    room: "Room 102",
    roomCapacity: 60,
    roomType: "Multimedia Enabled",
    slotIndex: 1,
    slotSpan: 1,
    day: "Mon",
    timeRange: CANONICAL_TIME_SLOTS[1],
    courseCode: CANONICAL_COURSES["CSE-3205"].code,
    courseName: CANONICAL_COURSES["CSE-3205"].title,
    section: "Section A",
    instructor: CANONICAL_COURSES["CSE-3205"].instructor,
    instructorDept: "Senior Lecturer • CSE",
    initials: "FT",
    enrolled: 48,
    deptType: "cse",
    conflictFree: true,
  },
  {
    id: "slot-cse-402",
    room: "Room 402",
    roomCapacity: 50,
    roomType: "Interactive Board",
    slotIndex: 1,
    slotSpan: 1,
    day: "Mon",
    timeRange: CANONICAL_TIME_SLOTS[1],
    courseCode: CANONICAL_COURSES["CSE-3101"].code,
    courseName: CANONICAL_COURSES["CSE-3101"].title,
    section: "Section A",
    instructor: CANONICAL_FACULTY.name,
    instructorDept: "Associate Professor • CSE",
    initials: "AR",
    enrolled: 45,
    deptType: "cse",
    conflictFree: true,
  },
  {
    id: "slot-lab-4a",
    room: "Lab 4A",
    roomCapacity: 40,
    roomType: "Computing Lab",
    slotIndex: 3,
    slotSpan: 2,
    day: "Mon",
    timeRange: "01:00–04:45",
    courseCode: CANONICAL_COURSES["CSE-3102"].code,
    courseName: CANONICAL_COURSES["CSE-3102"].title,
    section: "Section A",
    instructor: CANONICAL_FACULTY.name,
    instructorDept: "Associate Professor • CSE",
    initials: "AR",
    enrolled: 38,
    deptType: "lab",
    conflictFree: true,
  },
  {
    id: "slot-cse-402-tue",
    room: "Room 402",
    roomCapacity: 50,
    roomType: "Interactive Board",
    slotIndex: 0,
    slotSpan: 1,
    day: "Tue",
    timeRange: CANONICAL_TIME_SLOTS[0],
    courseCode: CANONICAL_COURSES["CSE-4109"].code,
    courseName: CANONICAL_COURSES["CSE-4109"].title,
    section: "Section A",
    instructor: CANONICAL_FACULTY.name,
    instructorDept: "Associate Professor • CSE",
    initials: "AR",
    enrolled: 36,
    deptType: "cse",
    conflictFree: true,
  },
  {
    id: "slot-lab-4a-wed",
    room: "Lab 4A",
    roomCapacity: 40,
    roomType: "Computing Lab",
    slotIndex: 4,
    slotSpan: 1,
    day: "Wed",
    timeRange: CANONICAL_TIME_SLOTS[4],
    courseCode: CANONICAL_COURSES["CSE-3102"].code,
    courseName: CANONICAL_COURSES["CSE-3102"].title,
    section: "Section A",
    instructor: CANONICAL_FACULTY.name,
    instructorDept: "Associate Professor • CSE",
    initials: "AR",
    enrolled: 38,
    deptType: "lab",
    conflictFree: true,
  },
];

const TIME_SLOTS = [
  { label: CANONICAL_TIME_SLOTS[0], sub: "Slot 1 • 90m" },
  { label: CANONICAL_TIME_SLOTS[1], sub: "Slot 2 • 90m" },
  { label: CANONICAL_TIME_SLOTS[2], sub: "Slot 3 • Midday", isBreak: true },
  { label: CANONICAL_TIME_SLOTS[3], sub: "Slot 4 • 90m" },
  { label: CANONICAL_TIME_SLOTS[4], sub: "Slot 5 • 120m" },
  { label: "04:45–06:00", sub: "Slot 6 • 75m" },
];

const ROOMS = [
  { id: "r101", name: "Room 101", capacity: 60, util: "90%", type: "Auditorium Tier", building: "bldg-1" as const },
  { id: "r102", name: "Room 102", capacity: 60, util: "80%", type: "Multimedia Enabled", building: "bldg-1" as const },
  { id: "r402", name: "Room 402", capacity: 50, util: "90%", type: "Interactive Board", building: "bldg-2" as const },
  { id: "l4a", name: "Lab 4A", capacity: 40, util: "95%", type: "Computing Lab", isLab: true, building: "lab" as const },
  { id: "l4b", name: "Lab 4B", capacity: 40, util: "Maint", type: "Network Sim Lab", isLab: true, building: "lab" as const },
];

export default function AdminRoutinePage() {
  const [building, setBuilding] = useState<BuildingType>("bldg-1");
  const [selectedDay, setSelectedDay] = useState("Mon");
  const [semester, setSemester] = useState(`${ACTIVE_TERM} (Active)`);
  const [capacityFilter, setCapacityFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [highlightConflicts, setHighlightConflicts] = useState(true);
  const [showUtilization, setShowUtilization] = useState(true);

  // Selected Active Slot in Drawer — Defaults to CSE-3101 in Room 402
  const [activeSlotId, setActiveSlotId] = useState<string>("slot-cse-402");
  const [slots, setSlots] = useState<SlotData[]>(INITIAL_SLOTS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  const activeSlot = useMemo(
    () => slots.find((s) => s.id === activeSlotId) ?? slots[0] ?? null,
    [slots, activeSlotId]
  );

  const filteredRooms = useMemo(() => {
    return ROOMS.filter((room) => {
      if (capacityFilter === "40-60" && (room.capacity < 40 || room.capacity > 60)) {
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

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
  };

  const handleUpdateSlot = () => {
    if (!activeSlot) return;
    triggerToast(`Updated schedule parameters for ${activeSlot.courseCode} in ${activeSlot.room}.`);
  };

  const handleUnassignSlot = () => {
    if (!activeSlot) return;
    const removed = activeSlot;
    setSlots((prev) => prev.filter((s) => s.id !== removed.id));
    triggerToast(`Unassigned ${removed.courseCode} from ${removed.room}. Slot is now open.`);
  };

  const handleCourseChange = (newCode: string) => {
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
  };

  const handleSectionChange = (newSection: string) => {
    if (!activeSlot) return;
    setSlots((prev) =>
      prev.map((s) => (s.id === activeSlot.id ? { ...s, section: newSection } : s))
    );
  };

  const handleAssignFreeSlot = (room: (typeof ROOMS)[number], slotIdx: number) => {
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
    triggerToast(`Assigned ${defaultCourse.code} to ${room.name} (${selectedDay} ${TIME_SLOTS[slotIdx].label}).`);
  };

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
                className="min-h-[44px] appearance-none bg-surface border border-line text-fg text-xs font-mono font-semibold rounded-xl pl-3 pr-8 py-2 focus:outline-none focus:border-brand cursor-pointer"
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
              onClick={() => triggerToast("Conflict check verified zero lecturer or room overlaps.")}
            >
              Verify Conflicts
            </Button>

            <Button
              variant="secondary"
              size="sm"
              leftIcon={<FileDown className="w-3.5 h-3.5 text-fg-muted" />}
              onClick={() => triggerToast("Exporting Master Timetable Matrix CSV & PDF...")}
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

      {/* MOBILE-SAFE FILTER TOOLBAR */}
      <div className="bg-surface rounded-[20px] p-3.5 border border-line flex flex-col gap-3">
        {/* Top Row: Building & Day Pickers */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 min-w-0">
            {/* Building Selector Segmented Pills */}
            <div className="w-full sm:w-auto overflow-x-auto max-w-full [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="inline-flex items-center bg-surface-2 p-1 rounded-xl border border-line text-xs relative min-w-max">
                {(
                  [
                    { id: "bldg-1", label: "Academic Building 1" },
                    { id: "bldg-2", label: "Academic Building 2" },
                    { id: "lab", label: "Lab Complex" },
                  ] as const
                ).map((b) => {
                  const isActive = building === b.id;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setBuilding(b.id)}
                      className={`relative px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap z-10 min-h-[36px] ${
                        isActive
                          ? "text-on-brand font-bold"
                          : "text-fg-muted hover:text-fg"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="admin-routine-bldg-pill"
                          className="absolute inset-0 bg-brand rounded-lg -z-10"
                          transition={{ type: "spring", stiffness: 450, damping: 32 }}
                        />
                      )}
                      {b.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="hidden sm:block h-5 w-px bg-line shrink-0" />

            {/* Day Picker */}
            <div className="w-full sm:w-auto overflow-x-auto max-w-full [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="inline-flex items-center gap-1 p-1 bg-surface-2 rounded-xl border border-line relative min-w-max">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => {
                  const isActive = selectedDay === day;
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setSelectedDay(day)}
                      className={`relative w-10 h-9 rounded-lg font-mono text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer z-10 ${
                        isActive
                          ? "text-on-brand font-bold"
                          : "text-fg-muted hover:text-fg"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="admin-routine-day-pill"
                          className="absolute inset-0 bg-brand rounded-lg -z-10"
                          transition={{ type: "spring", stiffness: 450, damping: 32 }}
                        />
                      )}
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Dropdowns & Toggles */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2.5 w-full xl:w-auto">
            <select
              value={capacityFilter}
              onChange={(e) => setCapacityFilter(e.target.value)}
              aria-label="Filter by room capacity"
              className="w-full sm:w-auto min-h-[40px] bg-surface-2 border border-line text-fg text-xs font-mono rounded-xl px-3 py-1.5 focus:outline-none focus:border-brand cursor-pointer"
            >
              <option value="all">Room Capacity: All (40 - 120 seats)</option>
              <option value="40-60">Tier 1: 40 - 60 seats</option>
              <option value="60-100">Tier 2: 60 - 100 seats</option>
              <option value="120+">Auditorium (120+ seats)</option>
            </select>

            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              aria-label="Filter by department"
              className="w-full sm:w-auto min-h-[40px] bg-surface-2 border border-line text-fg text-xs font-mono rounded-xl px-3 py-1.5 focus:outline-none focus:border-brand cursor-pointer"
            >
              <option value="all">Department: All Departments</option>
              {CANONICAL_DEPARTMENTS.map((d) => (
                <option key={d.id} value={d.code.toLowerCase()}>
                  {d.code} — {d.name}
                </option>
              ))}
            </select>

            <div className="flex flex-wrap items-center gap-4 pt-1 sm:pt-0">
              <div className="flex items-center gap-2 select-none">
                <Switch
                  size="sm"
                  checked={highlightConflicts}
                  onChange={setHighlightConflicts}
                  ariaLabel="Highlight conflicts toggle"
                />
                <span className="text-xs text-fg-muted font-sans whitespace-nowrap">
                  Highlight Conflicts
                </span>
              </div>

              <div className="flex items-center gap-2 select-none">
                <Switch
                  size="sm"
                  checked={showUtilization}
                  onChange={setShowUtilization}
                  ariaLabel="Show utilization toggle"
                />
                <span className="text-xs text-fg-muted font-sans whitespace-nowrap">
                  Show Utilization %
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN WORKSPACE: Flex-1 Matrix Grid + Fixed-Width Inspector */}
      <div className="flex flex-col lg:flex-row items-start gap-5">
        {/* LEFT SECTION: Master Matrix Timetable Grid */}
        <div className="w-full lg:flex-1 min-w-0 bg-surface rounded-[20px] border border-line overflow-hidden flex flex-col">
          <div className="overflow-x-auto w-full">
            <div className="min-w-[736px]">
              {/* Matrix Header Row */}
              <div className="grid grid-cols-[124px_repeat(6,minmax(102px,1fr))] bg-surface-2 border-b border-line">
                <div className="sticky left-0 z-20 p-3 bg-surface-2 border-r border-line flex flex-col justify-center">
                  <span className="font-mono text-xs font-semibold text-fg leading-tight">
                    Room
                  </span>
                  <span className="font-mono text-[11px] text-fg-muted leading-tight">
                    Time Slot →
                  </span>
                </div>

                {TIME_SLOTS.map((slot, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 text-center border-r border-line/60 last:border-r-0 ${
                      slot.isBreak ? "bg-warning-light/40" : ""
                    }`}
                  >
                    <span
                      className={`font-mono text-xs font-semibold block tabular-nums whitespace-nowrap ${
                        slot.isBreak ? "text-warning" : "text-fg"
                      }`}
                    >
                      {slot.label}
                    </span>
                    <span
                      className={`text-[11px] whitespace-nowrap ${
                        slot.isBreak ? "text-warning font-mono" : "text-fg-muted"
                      }`}
                    >
                      {slot.sub}
                    </span>
                  </div>
                ))}
              </div>

              {/* Matrix Rows */}
              {filteredRooms.length === 0 ? (
                <div className="py-12 px-6 text-center text-xs text-fg-muted">
                  No rooms match the selected capacity filter.
                </div>
              ) : (
                filteredRooms.map((room) => {
                  const roomSlots = slots.filter(
                    (s) =>
                      s.room === room.name &&
                      s.day === selectedDay &&
                      (deptFilter === "all" ||
                        s.deptType === deptFilter ||
                        (deptFilter === "cse" && s.deptType === "lab"))
                  );

                  const cells: React.ReactNode[] = [];
                  let sIdx = 0;
                  while (sIdx < TIME_SLOTS.length) {
                    const currentIdx = sIdx;
                    const slotItem = roomSlots.find((s) => s.slotIndex === currentIdx);
                    const span = slotItem ? (slotItem.slotSpan ?? 1) : 1;
                    sIdx += span;

                    if (slotItem) {
                      const isActive = activeSlot?.id === slotItem.id;
                      const isLab = slotItem.deptType === "lab";
                      const isEee = slotItem.deptType === "eee";
                      const isBba = slotItem.deptType === "bba";

                      const cardTone = isActive
                        ? "bg-brand-soft/60 border-2 border-brand"
                        : isEee
                        ? "bg-success-light/60 border border-success/30 hover:border-success"
                        : isBba
                        ? "bg-warning-light/60 border border-warning/30 hover:border-warning"
                        : isLab
                        ? "bg-brand-soft/40 border border-brand/30 hover:border-brand"
                        : "bg-brand-soft/40 border border-brand/30 hover:border-brand";

                      const titleColor = isEee
                        ? "text-success"
                        : isBba
                        ? "text-warning"
                        : "text-brand";

                      cells.push(
                        <div
                          key={`${room.id}-${currentIdx}`}
                          className={`${
                            span === 2 ? "col-span-2" : ""
                          } p-1.5 border-r border-line/50 last:border-r-0`}
                        >
                          <button
                            type="button"
                            onClick={() => setActiveSlotId(slotItem.id)}
                            className={`h-full w-full text-left rounded-xl p-2 flex flex-col justify-between transition-colors cursor-pointer ${cardTone}`}
                          >
                            <div className="flex items-start justify-between gap-1">
                              <span
                                className={`font-mono text-xs font-bold truncate ${titleColor}`}
                              >
                                {slotItem.courseCode} •{" "}
                                {slotItem.section.replace("Section ", "")}
                              </span>
                              {isActive ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-brand shrink-0" />
                              ) : (
                                <GripVertical className="w-3.5 h-3.5 text-fg-muted/60 shrink-0" />
                              )}
                            </div>

                            <p className="text-[11px] text-fg truncate font-medium my-1">
                              {slotItem.instructor} • {slotItem.courseName}
                            </p>

                            <div className="flex items-center justify-between gap-1">
                              <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-surface border border-line text-fg font-semibold tabular-nums">
                                {slotItem.enrolled}/{slotItem.roomCapacity}
                              </span>
                              {span === 2 ? (
                                <span className="font-mono text-[11px] text-brand font-semibold">
                                  Lab Block
                                </span>
                              ) : isActive ? (
                                <span className="text-[11px] text-brand font-semibold">
                                  Selected
                                </span>
                              ) : null}
                            </div>
                          </button>
                        </div>
                      );
                    } else {
                      const isBreak = Boolean(TIME_SLOTS[currentIdx].isBreak);
                      cells.push(
                        <div
                          key={`${room.id}-${currentIdx}`}
                          className={`p-1.5 border-r border-line/50 last:border-r-0 ${
                            isBreak ? "bg-surface-2/40" : ""
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              isBreak
                                ? triggerToast("Midday recess window (11:45–01:00) reserved across campus.")
                                : handleAssignFreeSlot(room, currentIdx)
                            }
                            className="h-full w-full border border-dashed border-line rounded-xl flex flex-col items-center justify-center p-2 text-center hover:bg-surface-2 hover:border-brand/60 group transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5 text-fg-muted group-hover:text-brand" />
                            <span className="text-[11px] font-mono text-fg-muted group-hover:text-fg mt-1 whitespace-nowrap">
                              {isBreak
                                ? "Midday Break"
                                : room.isLab
                                ? "Free Lab"
                                : "Free Slot"}
                            </span>
                          </button>
                        </div>
                      );
                    }
                  }

                  return (
                    <div
                      key={room.id}
                      className="grid grid-cols-[124px_repeat(6,minmax(102px,1fr))] border-b border-line/60 min-h-[104px] last:border-b-0"
                    >
                      {/* Sticky Room Y-Axis Meta */}
                      <div className="sticky left-0 z-10 p-3 bg-surface-2 border-r border-line flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-mono text-xs font-bold text-fg truncate">
                              {room.name}
                            </span>
                            {showUtilization && (
                              <span
                                className={`font-mono text-[11px] px-1 py-0.5 rounded shrink-0 ${
                                  room.util === "Maint"
                                    ? "bg-warning-light text-warning border border-warning/20"
                                    : "bg-success-light text-success border border-success/20"
                                }`}
                              >
                                {room.util}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-fg-muted font-mono block mt-0.5">
                            {room.capacity} {room.isLab ? "PCs" : "Seats"}
                          </span>
                        </div>
                        <span className="text-[11px] text-fg-muted font-sans truncate">
                          {room.type}
                        </span>
                      </div>

                      {cells}
                    </div>
                  );
                })
              )}

              {/* Matrix Footer Bar */}
              <div className="p-3.5 bg-surface-2 border-t border-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono text-fg-muted px-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-success-light border border-success" />
                    <span>Dept EEE</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-brand-soft border border-brand" />
                    <span>Dept CSE &amp; Labs</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-warning-light border border-warning" />
                    <span>Dept BBA</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span>Total Weekly Capacity Utilization:</span>
                  <span className="font-bold text-fg font-mono">78.4%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION: Fixed-Width Slot Inspector */}
        <div className="w-full lg:w-[330px] xl:w-[340px] shrink-0 bg-surface rounded-[20px] border border-line p-5 flex flex-col justify-between">
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
                      <h2 className="text-base font-bold text-fg">
                        Edit Slot Allocation
                      </h2>
                    </div>
                    <Badge variant="brand" className="mt-2 font-mono whitespace-nowrap">
                      {activeSlot.room} · {activeSlot.day}{" "}
                      {activeSlot.timeRange.replace(" - ", "–")}
                    </Badge>
                  </div>

                  <button
                    type="button"
                    onClick={() => triggerToast("Slot details synced with Central Registry.")}
                    className="min-w-[40px] min-h-[40px] inline-flex items-center justify-center rounded-xl hover:bg-surface-2 text-fg-muted hover:text-fg transition-colors cursor-pointer shrink-0"
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
                    <label className="block text-xs font-mono text-fg-muted mb-1.5 font-semibold">
                      Assigned Course
                    </label>
                    <div className="relative">
                      <select
                        value={activeSlot.courseCode}
                        onChange={(e) => handleCourseChange(e.target.value)}
                        className="w-full min-h-[44px] bg-surface-2 border border-line text-fg text-xs font-sans rounded-xl pl-3 pr-9 py-2.5 truncate focus:outline-none focus:border-brand cursor-pointer appearance-none"
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
                      <label className="block text-xs font-mono text-fg-muted mb-1.5 font-semibold">
                        Batch Section
                      </label>
                      <input
                        type="text"
                        value={activeSlot.section}
                        onChange={(e) => handleSectionChange(e.target.value)}
                        className="w-full min-h-[40px] bg-surface-2 border border-line text-fg text-xs font-mono rounded-xl px-3 py-2 focus:outline-none focus:border-brand"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-fg-muted mb-1.5 font-semibold">
                        Enrolled
                      </label>
                      <div className="flex items-center h-[40px] px-3 bg-surface-2 border border-line rounded-xl text-xs font-mono text-brand font-semibold">
                        <span>{activeSlot.enrolled} Students</span>
                      </div>
                    </div>
                  </div>

                  {/* Lead Instructor */}
                  <div>
                    <label className="block text-xs font-mono text-fg-muted mb-1.5 font-semibold">
                      Lead Instructor
                    </label>
                    <div className="bg-surface-2 border border-line rounded-xl p-3 space-y-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-brand-soft border border-brand/20 flex items-center justify-center text-xs font-bold text-brand shrink-0">
                          {activeSlot.initials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-fg truncate">
                            {activeSlot.instructor}
                          </p>
                          <p className="text-xs text-fg-muted font-sans truncate">
                            {activeSlot.instructorDept}
                          </p>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-line flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1 font-mono text-xs text-success font-semibold">
                          <CheckCircle2 className="w-3 h-3 shrink-0" />
                          <span>No Conflict</span>
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            triggerToast(
                              `Reassignment directory opened for ${activeSlot.courseCode}.`
                            )
                          }
                          className="text-xs text-brand hover:underline font-semibold cursor-pointer"
                        >
                          Reassign
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Room & Capacity Status */}
                  <div>
                    <label className="block text-xs font-mono text-fg-muted mb-1.5 font-semibold">
                      Capacity &amp; Room Equipment
                    </label>
                    <div className="bg-surface-2 border border-line rounded-xl p-3 space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                          <span className="text-fg-muted">Room Saturation:</span>
                          <span className="text-fg font-bold tabular-nums">
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
                                  (activeSlot.enrolled / activeSlot.roomCapacity) * 100
                                )
                              )}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-xs px-2 py-0.5 rounded-md bg-success-light text-success border border-success/20 flex items-center gap-1 font-mono">
                          <Video className="w-3 h-3" /> Projector
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-md bg-success-light text-success border border-success/20 flex items-center gap-1 font-mono">
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
                        <p className="text-xs text-fg-muted font-mono">
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
                  onClick={handleUpdateSlot}
                >
                  Update Slot Allocation
                </Button>

                <Button
                  variant="danger"
                  size="sm"
                  fullWidth
                  leftIcon={<X className="w-3.5 h-3.5" />}
                  onClick={handleUnassignSlot}
                >
                  Unassign Room / Clear Slot
                </Button>

                <p className="text-xs font-mono text-fg-muted text-center pt-1">
                  Last modified by Syed Tariqul Islam 4m ago
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* MODAL: Publish Semester Timetable */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-surface border border-line rounded-[20px] w-full max-w-md shadow-xl p-6 relative">
            <div className="flex items-center justify-between border-b border-line pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-soft border border-brand/20 text-brand flex items-center justify-center">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-fg">
                    Publish Semester Timetable
                  </h3>
                  <p className="text-xs text-fg-muted">
                    Deploy live schedule to student &amp; faculty portals
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPublishModalOpen(false)}
                aria-label="Close modal"
                className="min-w-[40px] min-h-[40px] inline-flex items-center justify-center rounded-lg text-fg-muted hover:text-fg hover:bg-surface-2 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-fg-muted">
              <div className="p-3.5 rounded-xl bg-surface-2 border border-line space-y-2">
                <div className="flex items-center justify-between font-mono">
                  <span>Target Semester:</span>
                  <span className="text-fg font-bold">{ACTIVE_TERM}</span>
                </div>
                <div className="flex items-center justify-between font-mono">
                  <span>Assigned Sections:</span>
                  <span className="text-success font-bold">142 of 142 (100%)</span>
                </div>
                <div className="flex items-center justify-between font-mono">
                  <span>Conflict Validation:</span>
                  <span className="text-success font-bold">0 Overlaps Detected</span>
                </div>
              </div>

              <p className="text-xs leading-relaxed">
                Publishing will push notifications to{" "}
                {CAMPUS_METRICS.students.toLocaleString()} enrolled students and{" "}
                {CAMPUS_METRICS.faculty.toLocaleString()} teaching faculty. Course
                routines will be immediately reflected across student dashboard calendars.
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-line flex items-center justify-end gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsPublishModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setIsPublishModalOpen(false);
                  triggerToast("Semester timetable officially published across university portals!");
                }}
              >
                Confirm &amp; Deploy Routine
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
