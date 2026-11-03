"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Switch } from "@/components/common/Switch";
import {
  Calendar,
  Clock,
  Building2,
  CheckCircle2,
  AlertTriangle,
  FileDown,
  Wand2,
  Send,
  Plus,
  ChevronDown,
  X,
  GripVertical,
  Monitor,
  Video,
  Volume2,
  Wind,
  Check,
  RefreshCw,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Users
} from "lucide-react";
import { themeTokens } from "@/lib/theme";

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
  deptType: "cse" | "eee" | "bba" | "lab";
  conflictFree: boolean;
  facilities: {
    projector: boolean;
    ac: boolean;
    sound: boolean;
  };
}

const INITIAL_SLOTS: SlotData[] = [
  {
    id: "slot-eee-101",
    room: "Room 101",
    roomCapacity: 60,
    roomType: "Auditorium Tier",
    slotIndex: 0,
    slotSpan: 1,
    day: "Mon",
    timeRange: "08:30 - 10:00",
    courseCode: "EEE-2201",
    courseName: "Circuit Theory & Analysis",
    section: "Section B",
    instructor: "Prof. Dr. Shahidul Alam",
    instructorDept: "EEE Department",
    initials: "SA",
    enrolled: 54,
    deptType: "eee",
    conflictFree: true,
    facilities: { projector: true, ac: true, sound: true },
  },
  {
    id: "slot-bba-101",
    room: "Room 101",
    roomCapacity: 60,
    roomType: "Auditorium Tier",
    slotIndex: 2,
    slotSpan: 1,
    day: "Mon",
    timeRange: "11:45 - 01:15",
    courseCode: "FIN-3102",
    courseName: "Managerial Finance",
    section: "Section A",
    instructor: "Prof. Dr. Nazma Begum",
    instructorDept: "BBA School",
    initials: "NB",
    enrolled: 58,
    deptType: "bba",
    conflictFree: true,
    facilities: { projector: true, ac: true, sound: true },
  },
  {
    id: "slot-cse-102",
    room: "Room 102",
    roomCapacity: 60,
    roomType: "Multimedia Enabled",
    slotIndex: 1,
    slotSpan: 1,
    day: "Mon",
    timeRange: "10:15 - 11:45",
    courseCode: "CSE-3205",
    courseName: "Software Engineering & Architecture",
    section: "Section A",
    instructor: "Dr. Farhana Khan",
    instructorDept: "CSE Department",
    initials: "FK",
    enrolled: 48,
    deptType: "cse",
    conflictFree: true,
    facilities: { projector: true, ac: true, sound: true },
  },
  {
    id: "slot-cse-402",
    room: "Room 402",
    roomCapacity: 50,
    roomType: "Interactive Board",
    slotIndex: 1,
    slotSpan: 1,
    day: "Mon",
    timeRange: "10:15 - 11:45",
    courseCode: "CSE-3101",
    courseName: "Design & Analysis of Algorithms",
    section: "Section A",
    instructor: "Dr. Asif Rahman",
    instructorDept: "CSE Department",
    initials: "AR",
    enrolled: 45,
    deptType: "cse",
    conflictFree: true,
    facilities: { projector: true, ac: true, sound: true },
  },
  {
    id: "slot-lab-4a",
    room: "Lab 4A",
    roomCapacity: 40,
    roomType: "GPU Cluster",
    slotIndex: 3,
    slotSpan: 2, // Spans Slot 4 & Slot 5 (01:30 - 04:45)
    day: "Mon",
    timeRange: "01:30 - 04:45",
    courseCode: "CSE-3102 Lab",
    courseName: "Operating Systems & Concurrency Kernel Lab",
    section: "Section A",
    instructor: "Tanvir Hasan",
    instructorDept: "Senior Lecturer • CSE",
    initials: "TH",
    enrolled: 38,
    deptType: "lab",
    conflictFree: true,
    facilities: { projector: true, ac: true, sound: true },
  },
];

const TIME_SLOTS = [
  { label: "08:30 - 10:00", sub: "Slot 1 • 90m" },
  { label: "10:15 - 11:45", sub: "Slot 2 • 90m" },
  { label: "11:45 - 01:15", sub: "Slot 3 • Midday", isBreak: true },
  { label: "01:30 - 03:00", sub: "Slot 4 • 90m" },
  { label: "03:15 - 04:45", sub: "Slot 5 • 90m" },
  { label: "04:45 - 06:00", sub: "Slot 6 • 75m" },
];

const ROOMS = [
  { id: "r101", name: "Room 101", capacity: 60, util: "90%", type: "Auditorium Tier" },
  { id: "r102", name: "Room 102", capacity: 60, util: "80%", type: "Multimedia Enabled" },
  { id: "r402", name: "Room 402", capacity: 50, util: "90%", type: "Interactive Board" },
  { id: "l4a", name: "Lab 4A", capacity: 40, util: "95%", type: "GPU Cluster", isLab: true },
  { id: "l4b", name: "Lab 4B", capacity: 40, util: "Maint", type: "Network Sim Lab", isLab: true },
];

export default function AdminRoutinePage() {
  const [building, setBuilding] = useState<"bldg-1" | "bldg-2" | "lab">("bldg-1");
  const [selectedDay, setSelectedDay] = useState("Mon");
  const [semester, setSemester] = useState("Spring 2026 (Active)");
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

  const activeSlot = slots.find((s) => s.id === activeSlotId) || slots[3];

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUpdateSlot = () => {
    triggerToast(`Updated schedule parameters for ${activeSlot.courseCode} in ${activeSlot.room}.`);
  };

  const handleUnassignSlot = () => {
    setSlots((prev) => prev.filter((s) => s.id !== activeSlotId));
    triggerToast(`Unassigned ${activeSlot.courseCode} from ${activeSlot.room}. Slot is now open.`);
  };

  return (
    <div className="w-full space-y-5 antialiased selection:bg-[#2563EB]/30 pb-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#2563EB]/40 text-xs font-semibold text-slate-900 dark:text-[#F0F6FC] shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.6)] backdrop-blur-md animate-in slide-in-from-bottom-3 duration-200">
          <div className="w-5 h-5 rounded-full bg-brand/10 dark:bg-[#2563EB]/20 flex items-center justify-center text-brand dark:text-[#2563EB] shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-[#F0F6FC] transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 3. PAGE HEADER & CONFLICT STATUS BAR */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-[#30363D]/60">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-slate-900 dark:text-[#F0F6FC] font-manrope leading-tight">
              Master Routine &amp; Room Allocation
            </h1>

            {/* Semester Dropdown Selector */}
            <div className="relative inline-block">
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="appearance-none bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] text-slate-800 dark:text-[#F0F6FC] text-xs font-mono font-semibold rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:border-[#2563EB] cursor-pointer"
              >
                <option>Spring 2026 (Active)</option>
                <option>Fall 2025 (Archived)</option>
                <option>Summer 2026 (Draft)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#8D96A0] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs text-slate-500 dark:text-[#8D96A0] font-sans">
              Configure lecture hours, laboratory allotments, and room conflicts across departments
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[rgba(35,134,54,0.15)] border border-[#3FB950]/30 text-emerald-400 font-mono text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3FB950] animate-pulse"></span>
              <span>0 Conflicts Detected • All 142 Sections Assigned</span>
            </div>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            onClick={() => triggerToast("Auto-conflict engine verified zero lecturer overlaps.")}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#161B22] hover:bg-slate-50 dark:hover:bg-[#21262D] border border-slate-200 dark:border-[#30363D] hover:border-slate-300 dark:hover:border-[#8D96A0]/60 text-slate-700 dark:text-[#F0F6FC] text-xs font-sans font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer active:scale-[0.98]"
            title="Scan for lecturer and venue conflicts"
          >
            <Wand2 className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Auto-Resolve Conflicts</span>
          </button>

          <button
            onClick={() => triggerToast("Exporting Master Timetable Matrix CSV & PDF...")}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#161B22] hover:bg-slate-50 dark:hover:bg-[#21262D] border border-slate-200 dark:border-[#30363D] hover:border-slate-300 dark:hover:border-[#8D96A0]/60 text-slate-700 dark:text-[#F0F6FC] text-xs font-sans font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer active:scale-[0.98]"
            title="Download complete semester grid"
          >
            <FileDown className="w-3.5 h-3.5 text-[#8D96A0]" />
            <span>Export Matrix PDF/CSV</span>
          </button>

          <button
            onClick={() => setIsPublishModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#5752E5] text-white text-xs font-bold font-manrope flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(37, 99, 235,0.35)] cursor-pointer active:scale-[0.98]"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publish Semester Timetable</span>
          </button>
        </div>
      </div>

      {/* 4. FILTER TOOLBAR (#0D1117 rounded-2xl bar, 14px padding) */}
      <div className="bg-white/70 dark:bg-[#0D1117] rounded-2xl p-3 sm:p-3.5 border border-white/80 dark:border-[#30363D] backdrop-blur-xl flex flex-wrap items-center justify-between gap-4 shadow-xs">
        {/* Left: Building & Day Selectors */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Building Selector Segmented Pills */}
          <div className="flex items-center bg-slate-100 dark:bg-[#161B22] p-1 rounded-xl border border-slate-200 dark:border-[#30363D] text-xs relative">
            {[
              { id: "bldg-1", label: "Academic Building 1" },
              { id: "bldg-2", label: "Academic Building 2" },
              { id: "lab", label: "Lab Complex" },
            ].map((b) => {
              const isActive = building === b.id;
              return (
                <button
                  key={b.id}
                  onClick={() => setBuilding(b.id as any)}
                  className={`relative px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap z-10 ${
                    isActive
                      ? "text-white font-bold"
                      : "text-slate-600 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-[#F0F6FC]"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="admin-routine-bldg-pill"
                      className="absolute inset-0 bg-brand dark:bg-[#2563EB] rounded-lg shadow-xs -z-10"
                      transition={{ type: "spring", stiffness: 450, damping: 32 }}
                    />
                  )}
                  {b.label}
                </button>
              );
            })}
          </div>

          <div className="hidden sm:block h-5 w-[1px] bg-[#30363D]"></div>

          {/* Day Picker */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-[#161B22] rounded-xl border border-slate-200 dark:border-[#30363D] relative">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => {
              const isActive = selectedDay === day;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`relative w-8 h-8 rounded-lg font-mono text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer z-10 ${
                    isActive
                      ? "text-white font-bold"
                      : "text-slate-600 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-[#F0F6FC]"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="admin-routine-day-pill"
                      className="absolute inset-0 bg-brand dark:bg-[#2563EB] rounded-lg shadow-xs -z-10"
                      transition={{ type: "spring", stiffness: 450, damping: 32 }}
                    />
                  )}
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Dropdowns & Toggles */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <select
              value={capacityFilter}
              onChange={(e) => setCapacityFilter(e.target.value)}
              className="bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] text-slate-700 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-[#F0F6FC] text-xs font-mono rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#2563EB] cursor-pointer"
            >
              <option value="all">Room Capacity: All (40 - 120 seats)</option>
              <option value="40-60">Tier 1: 40 - 60 seats</option>
              <option value="60-100">Tier 2: 60 - 100 seats</option>
              <option value="120+">Auditorium (120+ seats)</option>
            </select>

            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] text-slate-700 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-[#F0F6FC] text-xs font-mono rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#2563EB] cursor-pointer"
            >
              <option value="all">Department: All Departments</option>
              <option value="cse">Computer Science (CSE)</option>
              <option value="eee">Electrical Eng (EEE)</option>
              <option value="bba">Business Admin (BBA)</option>
            </select>
          </div>

          <div className="hidden sm:block h-5 w-[1px] bg-[#30363D]"></div>

          {/* Toggles */}
          <div className="flex items-center gap-2 cursor-pointer select-none">
            <Switch
              size="sm"
              checked={highlightConflicts}
              onChange={setHighlightConflicts}
              ariaLabel="Highlight conflicts toggle"
            />
            <span className="text-[11px] text-slate-600 dark:text-[#8D96A0] font-sans">Highlight Conflicts</span>
          </div>

          <div className="flex items-center gap-2 cursor-pointer select-none">
            <Switch
              size="sm"
              checked={showUtilization}
              onChange={setShowUtilization}
              ariaLabel="Show utilization toggle"
            />
            <span className="text-[11px] text-slate-600 dark:text-[#8D96A0] font-sans">Show Utilization %</span>
          </div>
        </div>
      </div>

      {/* 5. MAIN WORKSPACE (Left 72% Matrix Grid + Right 28% Slide-Over Slot Editor) */}
      <div className="flex flex-col lg:flex-row items-start gap-6">
        
        {/* LEFT SECTION (72% Master Matrix Timetable Grid) */}
        <div className="w-full lg:w-[72%] bg-white/70 dark:bg-[#0D1117] rounded-3xl border border-white/80 dark:border-[#30363D] backdrop-blur-xl overflow-hidden shadow-xl flex flex-col">
          <div className="overflow-x-auto w-full">
            <div className="min-w-[840px]">
              
              {/* Matrix Header Row (#161B22) */}
              <div className="grid grid-cols-[160px_repeat(6,1fr)] bg-slate-50 dark:bg-[#161B22] border-b border-slate-200 dark:border-[#30363D]">
                <div className="p-3.5 font-mono text-xs font-semibold text-slate-500 dark:text-[#8D96A0] border-r border-slate-200 dark:border-[#30363D] flex items-center justify-between">
                  <span>Classroom</span>
                  <span className="text-[10px] text-[#8D96A0]/60 font-normal">\ Time Slot</span>
                </div>

                {TIME_SLOTS.map((slot, idx) => (
                  <div
                    key={idx}
                    className={`p-3 text-center border-r border-[#30363D]/60 last:border-r-0 ${
                      slot.isBreak ? "bg-amber-500/10 dark:bg-[#1C2128]/50 relative" : ""
                    }`}
                  >
                    {slot.isBreak && (
                      <div
                        className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-amber-400"
                        title="Prayer / Midday Interval"
                      ></div>
                    )}
                    <span
                      className={`font-mono text-[11px] font-semibold uppercase tracking-wider block tabular-nums ${
                        slot.isBreak ? "text-amber-600 dark:text-amber-200" : "text-slate-900 dark:text-[#F0F6FC]"
                      }`}
                    >
                      {slot.label}
                    </span>
                    <span
                      className={`text-[10px] ${
                        slot.isBreak ? "text-amber-600/80 dark:text-amber-400/80 font-mono" : "text-slate-500 dark:text-[#8D96A0]"
                      }`}
                    >
                      {slot.sub}
                    </span>
                  </div>
                ))}
              </div>

              {/* Matrix Rows (5 Classrooms) */}
              {ROOMS.map((room) => {
                const roomSlots = slots.filter((s) => s.room === room.name && s.day === selectedDay);

                return (
                  <div
                    key={room.id}
                    className="grid grid-cols-[160px_repeat(6,1fr)] border-b border-slate-200 dark:border-[#30363D]/60 min-h-[105px] last:border-b-0"
                  >
                    {/* Y-Axis Room Meta */}
                    <div className="p-3.5 bg-slate-50/90 dark:bg-[#161B22]/90 border-r border-slate-200 dark:border-[#30363D] flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-slate-900 dark:text-[#F0F6FC]">
                            {room.name}
                          </span>
                          {showUtilization && (
                            <span
                              className={`font-mono text-[9px] px-1 py-0.5 rounded ${
                                room.util === "Maint"
                                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                  : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              }`}
                            >
                              {room.util}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 dark:text-[#8D96A0] font-mono block mt-0.5">
                          {room.capacity} {room.isLab ? "PCs" : "Seats"}
                        </span>
                      </div>
                      <span className="text-[9px] text-slate-500 dark:text-[#8D96A0] font-sans truncate">
                        {room.type}
                      </span>
                    </div>

                    {/* 6 Time Slot Cells */}
                    {/* Handled explicitly for clean spans */}
                    {room.name === "Room 101" && (
                      <>
                        {/* Slot 0: EEE-2201 (Emerald) */}
                        <div className="p-1.5 border-r border-slate-200 dark:border-[#30363D]/40">
                          <div
                            onClick={() => setActiveSlotId("slot-eee-101")}
                            className={`h-full w-full bg-emerald-500/10 border rounded-xl p-2.5 flex flex-col justify-between transition-all cursor-pointer group shadow-xs ${
                              activeSlotId === "slot-eee-101"
                                ? "border-emerald-500 ring-2 ring-emerald-500/30"
                                : "border-emerald-500/30 hover:border-emerald-500"
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <span className="font-mono text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                                EEE-2201 • B
                              </span>
                              <GripVertical className="w-3.5 h-3.5 text-emerald-500/50 group-hover:text-emerald-600 dark:group-hover:text-emerald-300" />
                            </div>
                            <p className="text-[10px] text-slate-800 dark:text-[#F0F6FC] truncate font-medium">Prof. S. Alam • Circuit</p>
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold">
                                54/60
                              </span>
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            </div>
                          </div>
                        </div>

                        {/* Slot 1: Free */}
                        <div className="p-1.5 border-r border-slate-200 dark:border-[#30363D]/40">
                          <div
                            onClick={() => triggerToast("Click to assign a course into Room 101 (Slot 2)")}
                            className="h-full w-full border border-dashed border-slate-200 dark:border-[#30363D] rounded-xl flex flex-col items-center justify-center p-2 text-center hover:bg-slate-50 dark:hover:bg-[#161B22]/60 hover:border-brand/60 dark:hover:border-[#2563EB]/60 group transition-all cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5 text-[#8D96A0] group-hover:text-[#2563EB]" />
                            <span className="text-[9px] font-mono text-slate-400 dark:text-[#8D96A0] group-hover:text-slate-900 dark:group-hover:text-[#F0F6FC] mt-1">
                              Free • 60 Cap
                            </span>
                          </div>
                        </div>

                        {/* Slot 2: FIN-3102 (Amber) */}
                        <div className="p-1.5 border-r border-slate-200 dark:border-[#30363D]/40 bg-amber-50/50 dark:bg-[#1C2128]/20">
                          <div
                            onClick={() => setActiveSlotId("slot-bba-101")}
                            className={`h-full w-full bg-amber-500/10 border rounded-xl p-2.5 flex flex-col justify-between transition-all cursor-pointer group shadow-xs ${
                              activeSlotId === "slot-bba-101"
                                ? "border-amber-500 ring-2 ring-amber-500/30"
                                : "border-amber-500/30 hover:border-amber-500"
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <span className="font-mono text-[11px] font-bold text-amber-700 dark:text-amber-300">
                                FIN-3102 • A
                              </span>
                              <GripVertical className="w-3.5 h-3.5 text-amber-500/50" />
                            </div>
                            <p className="text-[10px] text-slate-800 dark:text-[#F0F6FC] truncate font-medium">Dr. N. Begum • Finance</p>
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold">
                                58/60
                              </span>
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            </div>
                          </div>
                        </div>

                        {/* Slot 3, 4, 5: Free */}
                        {[3, 4, 5].map((sIdx) => (
                          <div key={sIdx} className="p-1.5 border-r border-slate-200 dark:border-[#30363D]/40 last:border-r-0">
                            <div
                              onClick={() => triggerToast(`Slot ${sIdx + 1} selected for assignment.`)}
                              className="h-full w-full border border-dashed border-slate-200 dark:border-[#30363D] rounded-xl flex flex-col items-center justify-center p-2 text-center hover:bg-slate-50 dark:hover:bg-[#161B22]/60 hover:border-brand/60 dark:hover:border-[#2563EB]/60 group transition-all cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5 text-[#8D96A0] group-hover:text-[#2563EB]" />
                              <span className="text-[9px] font-mono text-slate-400 dark:text-[#8D96A0] group-hover:text-slate-900 dark:group-hover:text-[#F0F6FC] mt-1">
                                Free Slot
                              </span>
                            </div>
                          </div>
                        ))}
                      </>
                    )}

                    {room.name === "Room 102" && (
                      <>
                        {/* Slot 0: Free */}
                        <div className="p-1.5 border-r border-slate-200 dark:border-[#30363D]/40">
                          <div className="h-full w-full border border-dashed border-slate-200 dark:border-[#30363D] rounded-xl flex flex-col items-center justify-center p-2 text-center hover:bg-slate-50 dark:hover:bg-[#161B22]/60 hover:border-brand/60 dark:hover:border-[#2563EB]/60 group transition-all cursor-pointer">
                            <Plus className="w-3.5 h-3.5 text-[#8D96A0] group-hover:text-[#2563EB]" />
                            <span className="text-[9px] font-mono text-slate-400 dark:text-[#8D96A0] group-hover:text-slate-900 dark:group-hover:text-[#F0F6FC] mt-1">
                              Free Slot
                            </span>
                          </div>
                        </div>

                        {/* Slot 1: CSE-3205 (Indigo) */}
                        <div className="p-1.5 border-r border-slate-200 dark:border-[#30363D]/40">
                          <div
                            onClick={() => setActiveSlotId("slot-cse-102")}
                            className={`h-full w-full bg-brand/10 dark:bg-[#2563EB]/10 border rounded-xl p-2.5 flex flex-col justify-between transition-all cursor-pointer group shadow-xs ${
                              activeSlotId === "slot-cse-102"
                                ? "border-brand dark:border-[#2563EB] ring-2 ring-brand/30 dark:ring-[#2563EB]/30"
                                : "border-brand/30 dark:border-[#2563EB]/30 hover:border-brand dark:hover:border-[#2563EB]"
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <span className="font-mono text-[11px] font-bold text-brand dark:text-[#60A5FA]">
                                CSE-3205 • A
                              </span>
                              <GripVertical className="w-3.5 h-3.5 text-brand/60 dark:text-[#2563EB]/60" />
                            </div>
                            <p className="text-[10px] text-slate-800 dark:text-[#F0F6FC] truncate font-medium">Dr. Farhana • Software Eng</p>
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-brand/20 dark:bg-[#2563EB]/20 text-brand dark:text-[#60A5FA] font-semibold">
                                48/60
                              </span>
                              <span className="w-1.5 h-1.5 rounded-full bg-brand dark:bg-[#2563EB]"></span>
                            </div>
                          </div>
                        </div>

                        {/* Slot 2: Midday Open */}
                        <div className="p-1.5 border-r border-slate-200 dark:border-[#30363D]/40 bg-slate-100/50 dark:bg-[#1C2128]/20">
                          <div className="h-full w-full border border-dashed border-slate-200 dark:border-[#30363D] rounded-xl flex flex-col items-center justify-center p-2 text-center hover:bg-slate-50 dark:hover:bg-[#161B22]/60 hover:border-brand/60 dark:hover:border-[#2563EB]/60 group transition-all cursor-pointer">
                            <Plus className="w-3.5 h-3.5 text-[#8D96A0] group-hover:text-[#2563EB]" />
                            <span className="text-[9px] font-mono text-slate-400 dark:text-[#8D96A0] group-hover:text-slate-900 dark:group-hover:text-[#F0F6FC] mt-1">
                              Midday Open
                            </span>
                          </div>
                        </div>

                        {/* Slot 3, 4, 5: Free */}
                        {[3, 4, 5].map((sIdx) => (
                          <div key={sIdx} className="p-1.5 border-r border-slate-200 dark:border-[#30363D]/40 last:border-r-0">
                            <div className="h-full w-full border border-dashed border-slate-200 dark:border-[#30363D] rounded-xl flex flex-col items-center justify-center p-2 text-center hover:bg-slate-50 dark:hover:bg-[#161B22]/60 hover:border-brand/60 dark:hover:border-[#2563EB]/60 group transition-all cursor-pointer">
                              <Plus className="w-3.5 h-3.5 text-[#8D96A0] group-hover:text-[#2563EB]" />
                              <span className="text-[9px] font-mono text-slate-400 dark:text-[#8D96A0] group-hover:text-slate-900 dark:group-hover:text-[#F0F6FC] mt-1">
                                Free Slot
                              </span>
                            </div>
                          </div>
                        ))}
                      </>
                    )}

                    {room.name === "Room 402" && (
                      <>
                        {/* Slot 0: Free */}
                        <div className="p-1.5 border-r border-slate-200 dark:border-[#30363D]/40">
                          <div className="h-full w-full border border-dashed border-slate-200 dark:border-[#30363D] rounded-xl flex flex-col items-center justify-center p-2 text-center hover:bg-slate-50 dark:hover:bg-[#161B22]/60 hover:border-brand/60 dark:hover:border-[#2563EB]/60 group transition-all cursor-pointer">
                            <Plus className="w-3.5 h-3.5 text-[#8D96A0] group-hover:text-[#2563EB]" />
                            <span className="text-[9px] font-mono text-slate-400 dark:text-[#8D96A0] group-hover:text-slate-900 dark:group-hover:text-[#F0F6FC] mt-1">
                              Free Slot
                            </span>
                          </div>
                        </div>

                        {/* Slot 1: ACTIVE SELECTED CARD (CSE-3101) with glowing indigo border & ring */}
                        <div className="p-1.5 border-r border-slate-200 dark:border-[#30363D]/40">
                          <div
                            onClick={() => setActiveSlotId("slot-cse-402")}
                            className="h-full w-full bg-brand/10 dark:bg-[#161B22] border-2 border-brand dark:border-[#2563EB] rounded-xl p-2.5 flex flex-col justify-between shadow-[0_0_20px_rgba(29, 91, 216,0.25)] dark:shadow-[0_0_20px_rgba(37, 99, 235,0.35)] ring-2 ring-brand/30 dark:ring-[#2563EB]/40 cursor-pointer relative overflow-hidden"
                          >
                            <div className="absolute -top-6 -right-6 w-12 h-12 bg-brand/20 dark:bg-[#2563EB]/20 rounded-full blur-xs"></div>
                            <div className="flex items-start justify-between relative z-10">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-[11px] font-bold text-slate-900 dark:text-white">
                                  CSE-3101 • A
                                </span>
                                <CheckCircle2 className="w-3.5 h-3.5 text-brand dark:text-[#2563EB] fill-brand/20 dark:fill-[#2563EB]/20" />
                              </div>
                              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-brand dark:bg-[#2563EB] text-white font-bold">
                                Room 402
                              </span>
                            </div>
                            <p className="text-[10px] text-brand dark:text-[#60A5FA] font-semibold truncate relative z-10 font-sans">
                              Dr. Asif Rahman • Algorithms
                            </p>
                            <div className="flex items-center justify-between relative z-10">
                              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold">
                                45/50 (90%)
                              </span>
                              <span className="text-[9px] text-slate-600 dark:text-[#8D96A0] font-sans">Selected</span>
                            </div>
                          </div>
                        </div>

                        {/* Slot 2: Midday Open */}
                        <div className="p-1.5 border-r border-slate-200 dark:border-[#30363D]/40 bg-slate-100/50 dark:bg-[#1C2128]/20">
                          <div className="h-full w-full border border-dashed border-slate-200 dark:border-[#30363D] rounded-xl flex flex-col items-center justify-center p-2 text-center hover:bg-slate-50 dark:hover:bg-[#161B22]/60 hover:border-brand/60 dark:hover:border-[#2563EB]/60 group transition-all cursor-pointer">
                            <Plus className="w-3.5 h-3.5 text-[#8D96A0] group-hover:text-[#2563EB]" />
                            <span className="text-[9px] font-mono text-slate-400 dark:text-[#8D96A0] group-hover:text-slate-900 dark:group-hover:text-[#F0F6FC] mt-1">
                              Midday Open
                            </span>
                          </div>
                        </div>

                        {/* Slot 3, 4, 5: Free */}
                        {[3, 4, 5].map((sIdx) => (
                          <div key={sIdx} className="p-1.5 border-r border-slate-200 dark:border-[#30363D]/40 last:border-r-0">
                            <div className="h-full w-full border border-dashed border-slate-200 dark:border-[#30363D] rounded-xl flex flex-col items-center justify-center p-2 text-center hover:bg-slate-50 dark:hover:bg-[#161B22]/60 hover:border-brand/60 dark:hover:border-[#2563EB]/60 group transition-all cursor-pointer">
                              <Plus className="w-3.5 h-3.5 text-[#8D96A0] group-hover:text-[#2563EB]" />
                              <span className="text-[9px] font-mono text-slate-400 dark:text-[#8D96A0] group-hover:text-slate-900 dark:group-hover:text-[#F0F6FC] mt-1">
                                Free Slot
                              </span>
                            </div>
                          </div>
                        ))}
                      </>
                    )}

                    {room.name === "Lab 4A" && (
                      <>
                        {/* Slot 0, 1: Free */}
                        {[0, 1].map((sIdx) => (
                          <div key={sIdx} className="p-1.5 border-r border-slate-200 dark:border-[#30363D]/40">
                            <div className="h-full w-full border border-dashed border-slate-200 dark:border-[#30363D] rounded-xl flex flex-col items-center justify-center p-2 text-center hover:bg-slate-50 dark:hover:bg-[#161B22]/60 hover:border-brand/60 dark:hover:border-[#2563EB]/60 group transition-all cursor-pointer">
                              <Plus className="w-3.5 h-3.5 text-[#8D96A0] group-hover:text-[#2563EB]" />
                              <span className="text-[9px] font-mono text-slate-400 dark:text-[#8D96A0] group-hover:text-slate-900 dark:group-hover:text-[#F0F6FC] mt-1">
                                Free Lab
                              </span>
                            </div>
                          </div>
                        ))}

                        {/* Slot 2: Break Time */}
                        <div className="p-1.5 border-r border-slate-200 dark:border-[#30363D]/40 bg-slate-100/50 dark:bg-[#1C2128]/20">
                          <div className="h-full w-full border border-dashed border-slate-200 dark:border-[#30363D] rounded-xl flex flex-col items-center justify-center p-2 text-center hover:bg-slate-50 dark:hover:bg-[#161B22]/60 hover:border-brand/60 dark:hover:border-[#2563EB]/60 group transition-all cursor-pointer">
                            <Plus className="w-3.5 h-3.5 text-[#8D96A0] group-hover:text-[#2563EB]" />
                            <span className="text-[9px] font-mono text-slate-400 dark:text-[#8D96A0] group-hover:text-slate-900 dark:group-hover:text-[#F0F6FC] mt-1">
                              Break Time
                            </span>
                          </div>
                        </div>

                        {/* DOUBLE SLOT SPAN: Slot 3 & Slot 4 (01:30 - 04:45 PM, col-span-2) */}
                        <div className="col-span-2 p-1.5 border-r border-slate-200 dark:border-[#30363D]/40">
                          <div
                            onClick={() => setActiveSlotId("slot-lab-4a")}
                            className={`h-full w-full bg-sky-500/10 border rounded-xl p-3 flex flex-col justify-between transition-all cursor-pointer group shadow-xs relative overflow-hidden ${
                              activeSlotId === "slot-lab-4a"
                                ? "border-sky-500 ring-2 ring-sky-500/30"
                                : "border-sky-500/35 hover:border-sky-500"
                            }`}
                          >
                            <div className="absolute right-0 top-0 bottom-0 w-1 bg-sky-400/80"></div>
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold text-sky-700 dark:text-sky-300">
                                  CSE-3102 Lab • Sec A
                                </span>
                                <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-sky-500/15 text-sky-700 dark:text-sky-200 border border-sky-500/30 uppercase font-semibold">
                                  3 hr Block
                                </span>
                              </div>
                              <span className="font-mono text-[10px] text-sky-700 dark:text-sky-300 flex items-center gap-1 font-semibold">
                                <Clock className="w-3 h-3" /> 01:30 - 04:45 PM
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-800 dark:text-[#F0F6FC] truncate font-medium">
                              Tanvir Hasan (Lecturer) • Operating Systems &amp; Concurrency Kernel Lab
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-700 dark:text-sky-300 font-semibold">
                                  38/40 PCs Allocated
                                </span>
                                <span className="text-[10px] text-slate-500 dark:text-[#8D96A0]">• Lab Assistant Assigned</span>
                              </div>
                              <Monitor className="w-4 h-4 text-sky-500 dark:text-sky-400" />
                            </div>
                          </div>
                        </div>

                        {/* Slot 5: Free Lab */}
                        <div className="p-1.5">
                          <div className="h-full w-full border border-dashed border-slate-200 dark:border-[#30363D] rounded-xl flex flex-col items-center justify-center p-2 text-center hover:bg-slate-50 dark:hover:bg-[#161B22]/60 hover:border-brand/60 dark:hover:border-[#2563EB]/60 group transition-all cursor-pointer">
                            <Plus className="w-3.5 h-3.5 text-[#8D96A0] group-hover:text-[#2563EB]" />
                            <span className="text-[9px] font-mono text-slate-400 dark:text-[#8D96A0] group-hover:text-slate-900 dark:group-hover:text-[#F0F6FC] mt-1">
                              Free Lab
                            </span>
                          </div>
                        </div>
                      </>
                    )}

                    {room.name === "Lab 4B" && (
                      <>
                        {[0, 1, 2, 3, 4, 5].map((sIdx) => (
                          <div
                            key={sIdx}
                            className={`p-1.5 border-r border-slate-200 dark:border-[#30363D]/40 last:border-r-0 ${
                              sIdx === 2 ? "bg-slate-100/50 dark:bg-[#1C2128]/20" : ""
                            }`}
                          >
                            <div className="h-full w-full border border-dashed border-slate-200 dark:border-[#30363D] rounded-xl flex flex-col items-center justify-center p-2 text-center hover:bg-slate-50 dark:hover:bg-[#161B22]/60 hover:border-brand/60 dark:hover:border-[#2563EB]/60 group transition-all cursor-pointer">
                              <Plus className="w-3.5 h-3.5 text-[#8D96A0] group-hover:text-[#2563EB]" />
                              <span className="text-[9px] font-mono text-slate-400 dark:text-[#8D96A0] group-hover:text-slate-900 dark:group-hover:text-[#F0F6FC] mt-1">
                                {sIdx === 2 ? "Break Time" : "Free Lab"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                );
              })}

              {/* Matrix Footer Telemetry Bar */}
              <div className="p-3.5 bg-slate-50/90 dark:bg-[#161B22]/80 border-t border-slate-200 dark:border-[#30363D] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-600 dark:text-[#8D96A0] px-5">
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-emerald-500/30 border border-emerald-500"></span>
                    <span>Dept EEE</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-brand/30 dark:bg-[#2563EB]/30 border border-brand dark:border-[#2563EB]"></span>
                    <span>Dept CSE</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-amber-500/30 border border-amber-500"></span>
                    <span>Dept BBA</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-sky-500/30 border border-sky-500"></span>
                    <span>Lab Practicums</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span>Total Weekly Capacity Utilization:</span>
                  <span className="font-bold text-slate-900 dark:text-[#F0F6FC] font-mono">78.4%</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT SECTION (28% Slide-Over Schedule Slot Editor Drawer) */}
        <div className="w-full lg:w-[28%] bg-white/70 dark:bg-[#0D1117] rounded-3xl border border-white/80 dark:border-[#30363D] backdrop-blur-xl p-5 sm:p-6 flex flex-col justify-between shadow-xl relative">
          <div className="space-y-5">
            {/* Drawer Header */}
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-[#30363D] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#2563EB]" />
                  <h2 className="text-base font-bold font-manrope text-slate-900 dark:text-[#F0F6FC]">
                    Edit Slot Allocation
                  </h2>
                </div>
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/10 dark:bg-[#161B22] border border-brand/30 dark:border-[#2563EB]/40 text-brand dark:text-[#60A5FA]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse"></span>
                  <span className="font-mono text-[11px] font-bold">
                    {activeSlot.room} • {activeSlot.day} {activeSlot.timeRange}
                  </span>
                </div>
              </div>

              <button
                onClick={() => triggerToast("Slot details synced with Central Registry.")}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-[#161B22] text-slate-400 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-[#F0F6FC] transition-colors"
                title="Sync Slot"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Course Field */}
              <div>
                <label className="block text-[11px] font-mono text-slate-500 dark:text-[#8D96A0] uppercase tracking-wider mb-1.5 font-semibold">
                  Assigned Course
                </label>
                <div className="relative">
                  <select
                    defaultValue={activeSlot.courseCode}
                    className="w-full bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] text-slate-900 dark:text-[#F0F6FC] text-xs font-sans rounded-xl px-3 py-2.5 focus:outline-none focus:border-brand dark:focus:border-[#2563EB] cursor-pointer appearance-none"
                  >
                    <option value="CSE-3101">CSE-3101 • Design &amp; Analysis of Algorithms</option>
                    <option value="CSE-3205">CSE-3205 • Software Engineering &amp; Lifecycle</option>
                    <option value="EEE-2201">EEE-2201 • Fundamental Circuit Theory</option>
                    <option value="FIN-3102">FIN-3102 • Managerial Finance &amp; Valuation</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-[#8D96A0] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Section & Enrolled Field */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-500 dark:text-[#8D96A0] uppercase tracking-wider mb-1.5 font-semibold">
                    Batch Section
                  </label>
                  <input
                    type="text"
                    defaultValue={activeSlot.section}
                    className="w-full bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] text-slate-900 dark:text-[#F0F6FC] text-xs font-mono rounded-xl px-3 py-2 focus:outline-none focus:border-brand dark:focus:border-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-slate-500 dark:text-[#8D96A0] uppercase tracking-wider mb-1.5 font-semibold">
                    Enrolled
                  </label>
                  <div className="flex items-center h-[36px] px-3 bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] rounded-xl text-xs font-mono text-brand dark:text-[#60A5FA]">
                    <span>{activeSlot.enrolled} Scholars</span>
                  </div>
                </div>
              </div>

              {/* Assigned Instructor */}
              <div>
                <label className="block text-[11px] font-mono text-slate-500 dark:text-[#8D96A0] uppercase tracking-wider mb-1.5 font-semibold">
                  Lead Instructor
                </label>
                <div className="bg-slate-50/90 dark:bg-[#161B22] border border-slate-200/90 dark:border-[#30363D] rounded-xl p-3 space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-brand/10 dark:bg-[#2563EB]/20 border border-brand/20 dark:border-[#2563EB]/40 flex items-center justify-center text-xs font-bold text-brand dark:text-[#60A5FA]">
                      {activeSlot.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold font-manrope text-slate-900 dark:text-[#F0F6FC] truncate">
                        {activeSlot.instructor}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-[#8D96A0] font-sans truncate">
                        {activeSlot.instructorDept}
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-200 dark:border-[#30363D]/60 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3 h-3" /> No Instructor Conflict
                    </span>
                    <button
                      onClick={() => triggerToast(`Reassignment directory opened for ${activeSlot.courseCode}.`)}
                      className="text-[10px] text-brand dark:text-[#2563EB] hover:underline font-semibold cursor-pointer"
                    >
                      Reassign
                    </button>
                  </div>
                </div>
              </div>

              {/* Room & Capacity Health Widget */}
              <div>
                <label className="block text-[11px] font-mono text-slate-500 dark:text-[#8D96A0] uppercase tracking-wider mb-1.5 font-semibold">
                  Capacity &amp; Health Status
                </label>
                <div className="bg-slate-50/90 dark:bg-[#161B22] border border-slate-200/90 dark:border-[#30363D] rounded-xl p-3 space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                      <span className="text-slate-500 dark:text-[#8D96A0]">Room Saturation:</span>
                      <span className="text-slate-900 dark:text-[#F0F6FC] font-bold">
                        {activeSlot.enrolled} / {activeSlot.roomCapacity} seats (
                        {Math.round((activeSlot.enrolled / activeSlot.roomCapacity) * 100)}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 dark:bg-[#080f16] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-brand dark:from-[#2563EB] to-emerald-400 rounded-full"
                        style={{
                          width: `${Math.round(
                            (activeSlot.enrolled / activeSlot.roomCapacity) * 100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Facility Checklist Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25 flex items-center gap-1 font-mono">
                      <Video className="w-3 h-3" /> Projector: OK
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25 flex items-center gap-1 font-mono">
                      <Wind className="w-3 h-3" /> AC: Optimal
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25 flex items-center gap-1 font-mono">
                      <Volume2 className="w-3 h-3" /> Sound: Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Recurring Schedule Rules */}
              <div className="bg-slate-50/90 dark:bg-[#161B22]/60 rounded-xl p-3 border border-slate-200/90 dark:border-[#30363D] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-brand dark:text-[#2563EB]" />
                  <div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-[#F0F6FC]">Weekly on Monday</p>
                    <p className="text-[10px] text-slate-500 dark:text-[#8D96A0] font-mono">Effective Spring 2026 Term</p>
                  </div>
                </div>
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </div>

          {/* Bottom Drawer Actions */}
          <div className="mt-6 space-y-2.5 pt-4 border-t border-slate-200 dark:border-[#30363D]">
            <button
              onClick={handleUpdateSlot}
              className="w-full py-2.5 bg-brand hover:bg-brand-hover dark:bg-[#2563EB] dark:hover:bg-[#5752E5] text-white font-manrope text-xs font-bold rounded-xl shadow-lg shadow-brand/20 dark:shadow-[#2563EB]/30 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98]"
            >
              <Check className="w-4 h-4" />
              <span>Update Slot Allocation</span>
            </button>

            <button
              onClick={handleUnassignSlot}
              className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 dark:bg-[#161B22] dark:hover:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98]"
            >
              <X className="w-3.5 h-3.5" />
              <span>Unassign Room / Clear Slot</span>
            </button>

            <p className="text-[10px] font-mono text-slate-500 dark:text-[#8D96A0] text-center pt-1">
              Last modified by Syed Tariqul Islam (Superadmin) 4m ago
            </p>
          </div>
        </div>

      </div>

      {/* MODAL: Publish Semester Timetable */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 dark:bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] rounded-3xl w-full max-w-md shadow-2xl p-6 relative">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#30363D] pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand/10 dark:bg-[#2563EB]/20 border border-brand/20 dark:border-[#2563EB]/40 text-brand dark:text-[#2563EB] flex items-center justify-center">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-manrope font-bold text-base text-slate-900 dark:text-[#F0F6FC]">
                    Publish Semester Timetable
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#8D96A0]">Deploy live schedule to student &amp; faculty portals</p>
                </div>
              </div>
              <button
                onClick={() => setIsPublishModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-[#F0F6FC] hover:bg-slate-100 dark:hover:bg-[#161B22]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-slate-600 dark:text-[#8D96A0]">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] space-y-2">
                <div className="flex items-center justify-between font-mono">
                  <span>Target Semester:</span>
                  <span className="text-slate-900 dark:text-[#F0F6FC] font-bold">Spring 2026</span>
                </div>
                <div className="flex items-center justify-between font-mono">
                  <span>Assigned Sections:</span>
                  <span className="text-emerald-600 dark:text-[#3FB950] font-bold">142 of 142 (100%)</span>
                </div>
                <div className="flex items-center justify-between font-mono">
                  <span>Conflict Validation:</span>
                  <span className="text-emerald-600 dark:text-[#3FB950] font-bold">0 Overlaps Detected</span>
                </div>
              </div>

              <p className="text-[11px] leading-relaxed">
                Publishing will push notifications to 5,060 enrolled students and 143 teaching faculty. Course routines will be immediately reflected across student dashboard calendars.
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-200 dark:border-[#30363D] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsPublishModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-[#F0F6FC] hover:bg-slate-100 dark:hover:bg-[#161B22]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsPublishModalOpen(false);
                  triggerToast("Semester timetable officially published across university portals!");
                }}
                className="px-4 py-2 rounded-xl bg-brand hover:bg-brand-hover dark:bg-[#2563EB] dark:hover:bg-[#5752E5] text-white text-xs font-bold shadow-md shadow-brand/25 dark:shadow-[#2563EB]/25 cursor-pointer"
              >
                Confirm &amp; Deploy Routine
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
