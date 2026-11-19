"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Printer, 
  CalendarPlus, 
  MapPin, 
  FileText, 
  ExternalLink, 
  Video, 
  Coffee, 
  FolderOpen, 
  Check, 
  CircleDot, 
  Cpu, 
  Info, 
  ArrowRight, 
  X, 
  CheckCircle2,
  Send,
  LayoutGrid,
  List,
  Users,
  GraduationCap
} from "lucide-react";
import ProfileAvatar from "@/components/common/ProfileAvatar";

type ScheduleSlot = {
  id: string;
  startTime: string;
  endTime: string;
  isBreak?: boolean;
  breakLabel?: string;
  breakDuration?: string;
  breakLocation?: string;
  courseCode?: string;
  courseTitle?: string;
  status?: "completed" | "active" | "upcoming";
  statusText?: string;
  instructorName?: string;
  instructorAvatar?: string;
  room?: string;
  metaTopic?: string;
  isLab?: boolean;
  labHours?: string;
  primaryAction?: {
    label: string;
    icon: typeof Video | typeof ExternalLink;
    href?: string;
  };
  secondaryAction?: {
    label: string;
    icon: typeof FileText | typeof FolderOpen;
    href?: string;
  };
};

const weeklyRoutineData: Record<string, ScheduleSlot[]> = {
  Monday: [
    {
      id: "mon-1",
      startTime: "08:30 AM",
      endTime: "10:00 AM",
      courseCode: "CSE-3103",
      courseTitle: "Database Management Systems",
      status: "completed",
      statusText: "Completed",
      instructorName: "Prof. Mahmudul Hasan",
      room: "Room 301-A",
      metaTopic: "Theory • 90 Mins",
      isLab: false,
      secondaryAction: { label: "Course Materials", icon: FolderOpen, href: "/materials" },
      primaryAction: { label: "Classroom Link", icon: ExternalLink, href: "#" },
    },
    {
      id: "mon-2",
      startTime: "10:15 AM",
      endTime: "11:45 AM",
      courseCode: "CSE-3205",
      courseTitle: "Software Engineering & System Design",
      status: "active",
      statusText: "In Progress (42m left)",
      instructorName: "Dr. Farhana Khan",
      room: "Room 604-B",
      metaTopic: "Sprint Planning & Agile Modeling",
      isLab: false,
      secondaryAction: { label: "Course Materials", icon: FolderOpen, href: "/materials" },
      primaryAction: { label: "Classroom Link", icon: Video, href: "#" },
    },
    {
      id: "mon-3",
      startTime: "11:45 AM",
      endTime: "01:00 PM",
      isBreak: true,
      breakLabel: "Midday Prayer & Lunch Break",
      breakDuration: "1 hr 15 mins",
      breakLocation: "Cafeteria Open • Campus Mosque",
    },
    {
      id: "mon-4",
      startTime: "01:00 PM",
      endTime: "02:30 PM",
      courseCode: "CSE-3101",
      courseTitle: "Design & Analysis of Algorithms",
      status: "upcoming",
      statusText: "Upcoming in 1h 12m",
      instructorName: "Dr. Asif Rahman",
      room: "Room 402",
      metaTopic: "Dynamic Programming & Graph Theory",
      isLab: false,
      secondaryAction: { label: "Course Materials", icon: FolderOpen, href: "/materials" },
      primaryAction: { label: "Classroom Link", icon: ExternalLink, href: "#" },
    },
    {
      id: "mon-5",
      startTime: "02:45 PM",
      endTime: "04:45 PM",
      courseCode: "CSE-3206",
      courseTitle: "Software Engineering Lab",
      status: "upcoming",
      statusText: "Upcoming",
      instructorName: "Sadia Afrin",
      room: "Software Lab 2 (Bldg 3)",
      metaTopic: "Workstation #14 Allocated",
      isLab: true,
      labHours: "2.0 hrs Lab",
      secondaryAction: { label: "Lab Manual", icon: FileText, href: "/materials" },
      primaryAction: { label: "Classroom Link", icon: ExternalLink, href: "#" },
    },
  ],
  Tuesday: [
    {
      id: "tue-1",
      startTime: "09:00 AM",
      endTime: "10:30 AM",
      courseCode: "CSE-3105",
      courseTitle: "Computer Networks & Protocols",
      status: "upcoming",
      statusText: "Scheduled",
      instructorName: "Dr. Tanvir Ahmed",
      room: "Room 502",
      metaTopic: "OSI Reference Model & Routing",
      isLab: false,
      secondaryAction: { label: "Course Materials", icon: FolderOpen, href: "/materials" },
      primaryAction: { label: "Classroom Link", icon: ExternalLink, href: "#" },
    },
    {
      id: "tue-2",
      startTime: "10:45 AM",
      endTime: "12:15 PM",
      courseCode: "CSE-3101",
      courseTitle: "Design & Analysis of Algorithms",
      status: "upcoming",
      statusText: "Scheduled",
      instructorName: "Dr. Asif Rahman",
      room: "Room 402",
      metaTopic: "Greedy Algorithms & Divide & Conquer",
      isLab: false,
      secondaryAction: { label: "Course Materials", icon: FolderOpen, href: "/materials" },
      primaryAction: { label: "Classroom Link", icon: ExternalLink, href: "#" },
    },
    {
      id: "tue-3",
      startTime: "12:15 PM",
      endTime: "01:30 PM",
      isBreak: true,
      breakLabel: "Midday Prayer & Lunch Break",
      breakDuration: "1 hr 15 mins",
      breakLocation: "Cafeteria Open • Campus Mosque",
    },
    {
      id: "tue-4",
      startTime: "01:30 PM",
      endTime: "04:30 PM",
      courseCode: "CSE-3104",
      courseTitle: "Database Management Systems Lab",
      status: "upcoming",
      statusText: "Scheduled",
      instructorName: "Prof. Mahmudul Hasan",
      room: "Database Lab 4",
      metaTopic: "PostgreSQL Complex Joins & Indices",
      isLab: true,
      labHours: "3.0 hrs Lab",
      secondaryAction: { label: "Lab Manual", icon: FileText, href: "/materials" },
      primaryAction: { label: "Classroom Link", icon: ExternalLink, href: "#" },
    },
  ],
  Wednesday: [
    {
      id: "wed-1",
      startTime: "08:30 AM",
      endTime: "10:00 AM",
      courseCode: "CSE-3205",
      courseTitle: "Software Engineering & System Design",
      status: "upcoming",
      statusText: "Scheduled",
      instructorName: "Dr. Farhana Khan",
      room: "Room 604-B",
      metaTopic: "Microservices Architecture & REST APIs",
      isLab: false,
      secondaryAction: { label: "Course Materials", icon: FolderOpen, href: "/materials" },
      primaryAction: { label: "Classroom Link", icon: ExternalLink, href: "#" },
    },
    {
      id: "wed-2",
      startTime: "10:15 AM",
      endTime: "11:45 AM",
      courseCode: "CSE-3103",
      courseTitle: "Database Management Systems",
      status: "upcoming",
      statusText: "Scheduled",
      instructorName: "Prof. Mahmudul Hasan",
      room: "Room 301-A",
      metaTopic: "ACID Properties & Transaction Control",
      isLab: false,
      secondaryAction: { label: "Course Materials", icon: FolderOpen, href: "/materials" },
      primaryAction: { label: "Classroom Link", icon: ExternalLink, href: "#" },
    },
    {
      id: "wed-3",
      startTime: "11:45 AM",
      endTime: "01:00 PM",
      isBreak: true,
      breakLabel: "Midday Prayer & Lunch Break",
      breakDuration: "1 hr 15 mins",
      breakLocation: "Student Center Lounge",
    },
    {
      id: "wed-4",
      startTime: "01:00 PM",
      endTime: "03:00 PM",
      courseCode: "GEN-2101",
      courseTitle: "Engineering Economics & Ethics",
      status: "upcoming",
      statusText: "Scheduled",
      instructorName: "Dr. Nazmul Huda",
      room: "Auditorium Hall B",
      metaTopic: "Cost Benefit Analysis & Professional Conduct",
      isLab: false,
      secondaryAction: { label: "Course Materials", icon: FolderOpen, href: "/materials" },
      primaryAction: { label: "Classroom Link", icon: ExternalLink, href: "#" },
    },
  ],
  Thursday: [
    {
      id: "thu-1",
      startTime: "09:00 AM",
      endTime: "10:30 AM",
      courseCode: "CSE-3105",
      courseTitle: "Computer Networks & Protocols",
      status: "upcoming",
      statusText: "Scheduled",
      instructorName: "Dr. Tanvir Ahmed",
      room: "Room 502",
      metaTopic: "TCP/UDP Flow Control & Congestion Avoidance",
      isLab: false,
      secondaryAction: { label: "Course Materials", icon: FolderOpen, href: "/materials" },
      primaryAction: { label: "Classroom Link", icon: ExternalLink, href: "#" },
    },
    {
      id: "thu-2",
      startTime: "10:45 AM",
      endTime: "12:15 PM",
      courseCode: "CSE-3101",
      courseTitle: "Design & Analysis of Algorithms",
      status: "upcoming",
      statusText: "Scheduled",
      instructorName: "Dr. Asif Rahman",
      room: "Room 402",
      metaTopic: "Complexity Theory (P vs NP & Reductions)",
      isLab: false,
      secondaryAction: { label: "Course Materials", icon: FolderOpen, href: "/materials" },
      primaryAction: { label: "Classroom Link", icon: ExternalLink, href: "#" },
    },
    {
      id: "thu-3",
      startTime: "12:15 PM",
      endTime: "01:30 PM",
      isBreak: true,
      breakLabel: "Midday Prayer & Lunch Break",
      breakDuration: "1 hr 15 mins",
      breakLocation: "Cafeteria Open • Campus Mosque",
    },
    {
      id: "thu-4",
      startTime: "01:30 PM",
      endTime: "04:30 PM",
      courseCode: "CSE-3106",
      courseTitle: "Computer Networks Sessional Lab",
      status: "upcoming",
      statusText: "Scheduled",
      instructorName: "Dr. Tanvir Ahmed",
      room: "Hardware & Telecom Lab 1",
      metaTopic: "Cisco Packet Tracer Subnetting Lab",
      isLab: true,
      labHours: "3.0 hrs Lab",
      secondaryAction: { label: "Lab Manual", icon: FileText, href: "/materials" },
      primaryAction: { label: "Classroom Link", icon: ExternalLink, href: "#" },
    },
  ],
  Friday: [
    {
      id: "fri-1",
      startTime: "08:30 AM",
      endTime: "11:30 AM",
      courseCode: "CSE-3200",
      courseTitle: "Capstone Project & Research Colloquium",
      status: "upcoming",
      statusText: "Scheduled",
      instructorName: "Prof. Mahmudul Hasan",
      room: "Innovation Hub Room 101",
      metaTopic: "Bi-Weekly Mentor Standup & Milestone Review",
      isLab: true,
      labHours: "3.0 hrs Lab",
      secondaryAction: { label: "Guidelines", icon: FileText, href: "/materials" },
      primaryAction: { label: "Classroom Link", icon: ExternalLink, href: "#" },
    },
    {
      id: "fri-2",
      startTime: "11:30 AM",
      endTime: "02:30 PM",
      isBreak: true,
      breakLabel: "Jumu'ah Prayer & Extended Weekend Recess",
      breakDuration: "3 hrs",
      breakLocation: "Campus Central Mosque & Dining Hall",
    },
  ],
  Saturday: [
    {
      id: "sat-1",
      startTime: "09:30 AM",
      endTime: "11:30 AM",
      courseCode: "CSE-3301",
      courseTitle: "Competitive Programming Seminar (Optional)",
      status: "upcoming",
      statusText: "Scheduled",
      instructorName: "Alumni Guest Mentors",
      room: "Seminar Hall CSE",
      metaTopic: "Advanced Segment Trees & Combinatorics",
      isLab: false,
      secondaryAction: { label: "Problems", icon: FolderOpen, href: "/materials" },
      primaryAction: { label: "Classroom Link", icon: ExternalLink, href: "#" },
    },
  ],
};

const daysList = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Time blocks for Weekly Grid Matrix View
const weeklyTimeGridSlots = [
  { time: "08:30 - 10:00", mon: "CSE-3103", tue: "-", wed: "CSE-3205", thu: "-", fri: "CSE-3200 (Lab)", sat: "-" },
  { time: "10:15 - 11:45", mon: "CSE-3205 (Active)", tue: "CSE-3105", wed: "CSE-3103", thu: "CSE-3105", fri: "-", sat: "CSE-3301" },
  { time: "11:45 - 01:00", mon: "Break", tue: "Break", wed: "Break", thu: "Break", fri: "Break", sat: "-" },
  { time: "01:00 - 02:30", mon: "CSE-3101", tue: "CSE-3101", wed: "GEN-2101", thu: "CSE-3101", fri: "-", sat: "-" },
  { time: "02:45 - 04:45", mon: "CSE-3206 (Lab)", tue: "CSE-3104 (Lab)", wed: "-", thu: "CSE-3106 (Lab)", fri: "-", sat: "-" },
];

export default function RoutinePage() {
  const [selectedDay, setSelectedDay] = useState<string>("Monday");
  const [viewMode, setViewMode] = useState<"daily" | "weekly">("daily");
  const [filterType, setFilterType] = useState<"all" | "theory" | "lab">("all");
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [calendarSyncSuccess, setCalendarSyncSuccess] = useState(false);
  const [swapSubmitted, setSwapSubmitted] = useState(false);

  const activeDaySlots = useMemo(() => {
    const rawSlots = weeklyRoutineData[selectedDay] || [];
    if (filterType === "theory") {
      return rawSlots.filter((s) => s.isBreak || (!s.isLab && s.courseCode));
    }
    if (filterType === "lab") {
      return rawSlots.filter((s) => s.isBreak || s.isLab);
    }
    return rawSlots;
  }, [selectedDay, filterType]);

  const handlePrint = () => {
    window.print();
  };

  const handleSyncCalendar = () => {
    setCalendarSyncSuccess(true);
    setTimeout(() => {
      setCalendarSyncSuccess(false);
      setIsCalendarModalOpen(false);
    }, 1800);
  };

  const handleSwapSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSwapSubmitted(true);
    setTimeout(() => {
      setSwapSubmitted(false);
      setIsSwapModalOpen(false);
    }, 1800);
  };

  return (
    <div className="w-full space-y-4 pb-8 select-none">
      {/* ========================================================================= */}
      {/* 1. TOP PAGE HEADER ROW (Full width, balanced actions)                     */}
      {/* ========================================================================= */}
      <div className="w-full">
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-line">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="font-extrabold text-xl md:text-2xl tracking-tight text-fg">
                Class Routine &amp; Timetable
              </h1>
            </div>
            <p className="text-xs text-fg-muted mt-0.5">
              Semester Spring 2026 • Section A • Dept. of Computer Science &amp; Engineering
            </p>
          </div>

          {/* Action Cluster & View Switcher */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* View Mode Switcher */}
            <div className="p-0.5 rounded-xl bg-surface-2 border border-line flex items-center relative">
              <button
                type="button"
                onClick={() => setViewMode("daily")}
                className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer z-10 ${
                  viewMode === "daily"
                    ? "text-fg"
                    : "text-fg-muted hover:text-fg"
                }`}
              >
                {viewMode === "daily" && (
                  <motion.div
                    layoutId="routine-view-pill"
                    className="absolute inset-0 bg-surface rounded-lg shadow-xs -z-10"
                    transition={{ type: "spring", stiffness: 450, damping: 32 }}
                  />
                )}
                <List className="w-3.5 h-3.5" />
                <span>Daily Schedule</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("weekly")}
                className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer z-10 ${
                  viewMode === "weekly"
                    ? "text-fg"
                    : "text-fg-muted hover:text-fg"
                }`}
              >
                {viewMode === "weekly" && (
                  <motion.div
                    layoutId="routine-view-pill"
                    className="absolute inset-0 bg-surface rounded-lg shadow-xs -z-10"
                    transition={{ type: "spring", stiffness: 450, damping: 32 }}
                  />
                )}
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Weekly Matrix</span>
              </button>
            </div>

            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="h-8.5 px-3 rounded-xl bg-surface-2 hover:bg-surface border border-line text-fg transition-all flex items-center gap-1.5 text-xs font-semibold shadow-xs cursor-pointer active:scale-[0.98]"
              title="Print Timetable"
            >
              <Printer className="w-3.5 h-3.5 text-fg-muted" />
              <span>Print</span>
            </button>

            {/* Google Calendar Sync */}
            <button
              type="button"
              onClick={() => setIsCalendarModalOpen(true)}
              className="h-8.5 px-3.5 rounded-xl bg-brand hover:bg-brand-hover text-white transition-all flex items-center gap-1.5 text-xs font-semibold shadow-xs active:scale-[0.98] cursor-pointer"
            >
              <CalendarPlus className="w-3.5 h-3.5" />
              <span>Sync Calendar</span>
            </button>
          </div>
        </section>
      </div>

      {/* ========================================================================= */}
      {/* 3. CONTROL STRIP & DAY SELECTOR (Visible only in Daily Schedule view)     */}
      {/* ========================================================================= */}
      {viewMode === "daily" && (
        <div className="w-full">
          <section className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-2 bg-surface border border-line rounded-2xl shadow-xs transition-colors">
            {/* Day Selector Pill Track */}
            <div className="flex items-center p-1 bg-surface-2 rounded-xl border border-line overflow-x-auto custom-scrollbar gap-1 flex-1 relative">
              {daysList.map((day) => {
                const isActive = selectedDay === day;
                const count = weeklyRoutineData[day]?.filter((s) => !s.isBreak).length || 0;
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    className={`relative flex-1 min-w-[110px] px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-colors flex items-center justify-center gap-2 shrink-0 cursor-pointer z-10 ${
                      isActive
                        ? "text-white font-bold"
                        : "text-fg-muted hover:text-fg"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="routine-student-day-pill"
                        className="absolute inset-0 bg-brand rounded-lg shadow-xs -z-10"
                        transition={{ type: "spring", stiffness: 450, damping: 32 }}
                      />
                    )}
                    <span>{day}</span>
                    <span
                      className={`text-xs font-mono px-1.5 py-0.2 rounded-full transition-colors ${
                        isActive
                          ? "bg-white/20 text-white font-bold"
                          : "bg-surface text-fg-muted"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick Filters */}
            <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
              <div className="p-0.5 rounded-lg bg-surface-2 border border-line flex items-center text-xs relative">
                {(["all", "theory", "lab"] as const).map((type) => {
                  const isActive = filterType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFilterType(type)}
                      className={`relative px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer capitalize z-10 ${
                        isActive
                          ? "text-fg"
                          : "text-fg-muted hover:text-fg"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="routine-filter-pill"
                          className="absolute inset-0 bg-surface rounded-md shadow-xs -z-10"
                          transition={{ type: "spring", stiffness: 450, damping: 32 }}
                        />
                      )}
                      {type === "all" ? "All" : type === "theory" ? "Theory" : "Labs"}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MAIN CONTENT AREA (Conditional: Daily Schedule or Weekly Matrix)       */}
      {/* ========================================================================= */}
      {viewMode === "daily" ? (
        /* DAILY SCHEDULE: Balanced 12-Column Layout (8 cols schedule + 4 cols companion) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* LEFT 8 COLUMNS: High-Density Full-Width Lecture Cards */}
          <div className="lg:col-span-8 space-y-3">
            {activeDaySlots.length === 0 ? (
              <div className="bg-white dark:bg-surface rounded-2xl border border-slate-200 dark:border-line p-12 text-center text-slate-400 dark:text-fg-muted font-mono text-xs">
                No scheduled lectures matching criteria for {selectedDay}. Enjoy your study break!
              </div>
            ) : (
              activeDaySlots.map((slot, index) => {
                // CASE A: Midday Break Card
                if (slot.isBreak) {
                  return (
                    <div key={slot.id} className="w-full">
                      <div className="w-full bg-slate-50/70 dark:bg-surface border border-dashed border-slate-300 dark:border-line rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 dark:text-fg-muted hover:border-slate-400 dark:hover:border-line transition-colors gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 dark:text-amber-400 flex items-center justify-center shrink-0">
                            <Coffee className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-manrope font-bold text-slate-800 dark:text-fg text-sm">
                                {slot.breakLabel}
                              </span>
                              <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-surface-2 text-slate-600 dark:text-fg-muted">
                                {slot.breakDuration}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 dark:text-fg-muted mt-0.5">
                              <span>{slot.startTime} - {slot.endTime}</span>
                              <span>•</span>
                              <span>{slot.breakLocation}</span>
                            </div>
                          </div>
                        </div>
                        <div className="self-end sm:self-center font-mono text-xs px-2.5 py-1 rounded-lg bg-white dark:bg-surface-2 border border-slate-200 dark:border-line text-slate-600 dark:text-fg">
                          Interval Slot 03
                        </div>
                      </div>
                    </div>
                  );
                }

                // CASE B: Active In-Progress Slot (Glowing Border & Highlight)
                if (slot.status === "active") {
                  return (
                    <div key={slot.id} className="w-full">
                      <div className="w-full bg-indigo-50/40 dark:bg-surface-2 border-2 border-brand dark:border-[var(--color-brand, #605BFF)] rounded-2xl p-4 shadow-md dark:shadow-[0_0_30px_rgba(37, 99, 235,0.18)] relative overflow-hidden transition-all">
                        {/* Top gradient highlight strip */}
                        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-brand dark:via-[var(--color-brand, #605BFF)] to-transparent" />

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5">
                          {/* Integrated Left Time Block */}
                          <div className="flex sm:flex-col items-center sm:items-start justify-between sm:justify-center w-full sm:w-36 shrink-0 pb-2 sm:pb-0 sm:pr-4 sm:border-r border-slate-200 dark:border-line gap-1">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-brand" />
                              <span className="font-mono font-bold text-sm text-brand">
                                {slot.startTime}
                              </span>
                            </div>
                            <span className="font-mono text-xs text-slate-500 dark:text-fg-muted">
                              to {slot.endTime}
                            </span>
                            <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-brand/10 text-brand dark:bg-[var(--color-brand, #605BFF)]/20 dark:text-blue-400 font-semibold mt-1">
                              Slot 02 • Active
                            </span>
                          </div>

                          {/* Center Content Body (Edge-to-Edge Spanning) */}
                          <div className="flex-1 space-y-1.5 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-xs font-bold text-brand dark:text-[var(--color-brand, #605BFF)] px-2 py-0.5 rounded-md bg-brand/10 dark:bg-[var(--color-brand, #605BFF)]/20 border border-brand/30 dark:border-[var(--color-brand, #605BFF)]/40">
                                {slot.courseCode}
                              </span>
                              <h3 className="font-manrope font-extrabold text-sm md:text-base text-slate-900 dark:text-fg">
                                {slot.courseTitle}
                              </h3>
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand/15 dark:bg-brand/20 text-brand border border-brand/30 text-xs font-bold font-jakarta">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                {slot.statusText || "In Progress"}
                              </span>
                            </div>

                            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-fg-muted flex-wrap">
                              <div className="flex items-center gap-1.5">
                                <ProfileAvatar alt={slot.instructorName || "Instructor"} size="xs" className="w-5 h-5 border border-brand/40" />
                                <span className="text-slate-900 dark:text-fg font-semibold">{slot.instructorName}</span>
                              </div>
                              <span>•</span>
                              <div className="flex items-center gap-1 font-mono text-xs text-slate-900 dark:text-fg px-2 py-0.5 rounded bg-white dark:bg-surface border border-slate-200 dark:border-line">
                                <MapPin className="w-3 h-3 text-brand dark:text-[var(--color-brand, #605BFF)]" />
                                <span className="font-bold">{slot.room}</span>
                              </div>
                              <span>•</span>
                              <span className="text-slate-600 dark:text-fg-muted truncate max-w-sm">{slot.metaTopic}</span>
                            </div>
                          </div>

                          {/* Right Action Buttons */}
                          <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                            {slot.secondaryAction && (
                              <Link
                                href={slot.secondaryAction.href || "/materials"}
                                className="text-xs font-medium text-brand hover:underline inline-flex items-center gap-1 cursor-pointer"
                              >
                                <slot.secondaryAction.icon className="w-3.5 h-3.5" />
                                <span>Materials</span>
                              </Link>
                            )}
                            {slot.primaryAction && (
                              <button
                                type="button"
                                title={slot.primaryAction.label}
                                onClick={() => alert("Connecting to Dr. Farhana Khan's Live Lecture Room...")}
                                className="h-8 w-8 rounded-xl bg-brand hover:bg-brand-hover text-white flex items-center justify-center shadow-xs cursor-pointer"
                              >
                                <slot.primaryAction.icon className="w-3.5 h-3.5" />
                                <span className="sr-only">{slot.primaryAction.label}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                // CASE C: Completed or Upcoming Standard Slot
                const isCompleted = slot.status === "completed";
                return (
                  <div key={slot.id} className="w-full">
                    <div className="">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5">
                        {/* Integrated Left Time Block */}
                        <div className="flex sm:flex-col items-center sm:items-start justify-between sm:justify-center w-full sm:w-36 shrink-0 pb-2 sm:pb-0 sm:pr-4 sm:border-r border-slate-200 dark:border-line gap-1">
                          <span className="font-mono font-bold text-sm text-slate-800 dark:text-fg">
                            {slot.startTime}
                          </span>
                          <span className="font-mono text-xs text-slate-400 dark:text-fg-muted">
                            to {slot.endTime}
                          </span>
                          <span
                            className={`font-mono text-xs px-2 py-0.5 rounded-full mt-1 ${
                              isCompleted
                                ? "bg-surface-2 text-fg-muted"
                                : slot.isLab
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold"
                                : "bg-surface-2 text-fg-muted"
                            }`}
                          >
                            {slot.isLab ? (slot.labHours || "Lab Slot") : `Slot 0${index + 1}`}
                          </span>
                        </div>

                        {/* Center Content Body */}
                        <div className="flex-1 space-y-1.5 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`font-mono text-xs font-bold px-2 py-0.5 rounded-md border ${
                                slot.isLab
                                  ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                                  : "text-slate-700 dark:text-fg-muted bg-slate-100 dark:bg-surface-2 border-slate-200 dark:border-line"
                              }`}
                            >
                              {slot.courseCode}
                            </span>
                            <h3 className="font-manrope font-bold text-sm md:text-base text-slate-900 dark:text-fg">
                              {slot.courseTitle}
                            </h3>
                            {isCompleted ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold font-jakarta">
                                <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                                Completed
                              </span>
                            ) : (
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold font-jakarta border ${
                                  slot.statusText?.includes("Upcoming in")
                                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                                    : "bg-slate-100 dark:bg-surface-2 text-slate-600 dark:text-fg-muted border-slate-200 dark:border-line"
                                }`}
                              >
                                <CircleDot className="w-2.5 h-2.5" />
                                {slot.statusText || "Upcoming"}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-fg-muted flex-wrap">
                            <div className="flex items-center gap-1.5">
                              <ProfileAvatar alt={slot.instructorName || "Instructor"} size="xs" className="w-5 h-5 border border-slate-200 dark:border-line" />
                              <span className="text-slate-700 dark:text-fg font-medium">{slot.instructorName}</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1 font-mono text-xs text-slate-700 dark:text-fg px-2 py-0.5 rounded bg-slate-50 dark:bg-surface-2 border border-slate-200 dark:border-line">
                              {slot.isLab ? (
                                <Cpu className="w-2.5 h-2.5 text-emerald-500 dark:text-emerald-400" />
                              ) : (
                                <MapPin className="w-2.5 h-2.5 text-brand dark:text-[var(--color-brand, #605BFF)]" />
                              )}
                              <span>{slot.room}</span>
                            </div>
                            <span>•</span>
                            <span className="text-slate-500 dark:text-fg-muted truncate max-w-sm">{slot.metaTopic}</span>
                          </div>
                        </div>

                        {/* Right Action Buttons */}
                        <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                          {slot.secondaryAction && (
                            <Link
                              href={slot.secondaryAction.href || "/materials"}
                              className="text-xs font-medium text-fg-muted hover:text-brand hover:underline inline-flex items-center gap-1 cursor-pointer"
                            >
                              <slot.secondaryAction.icon className="w-3.5 h-3.5" />
                              <span>Materials</span>
                            </Link>
                          )}
                          {slot.primaryAction && (
                            <button
                              type="button"
                              title={slot.primaryAction.label}
                              onClick={() => alert(`Launching ${slot.courseTitle} Classroom Link...`)}
                              className="h-8 w-8 rounded-xl bg-canvas hover:bg-surface-2 text-fg-muted hover:text-fg border border-line flex items-center justify-center transition-colors cursor-pointer"
                            >
                              <slot.primaryAction.icon className="w-3.5 h-3.5" />
                              <span className="sr-only">{slot.primaryAction.label}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {/* Bottom Council Notice Bar */}
            <div className="p-3 rounded-xl bg-white dark:bg-surface border border-slate-200 dark:border-line flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-fg-muted gap-2">
              <div className="flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-brand dark:text-[var(--color-brand, #605BFF)] shrink-0" />
                <span>Routine adjustments made by academic council are automatically reflected in real-time.</span>
              </div>
              <button
                type="button"
                onClick={() => setIsSwapModalOpen(true)}
                className="text-brand dark:text-[var(--color-brand, #605BFF)] hover:underline font-semibold flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span>Request reschedule or swap</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* RIGHT 4 COLUMNS: Companion Widgets (Office Hours, Classmates) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Widget 2: Faculty Office Hours Today */}
            <div className="bg-white dark:bg-surface border border-slate-200 dark:border-line rounded-2xl p-4.5 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-line">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <h3 className="font-manrope font-bold text-sm text-slate-900 dark:text-fg">
                    Faculty Drop-In Hours
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-400 dark:text-fg-muted">Today</span>
              </div>

              <div className="mt-3.5 space-y-2.5">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-surface-2 border border-slate-200 dark:border-line flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ProfileAvatar alt="Dr. Farhana Khan" size="xs" className="w-6 h-6 border border-slate-200 dark:border-line" />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-fg">Dr. Farhana Khan</p>
                      <p className="text-xs font-mono text-slate-500 dark:text-fg-muted">12:00 PM - 01:30 PM • Room 612</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                    Open
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-surface-2 border border-slate-200 dark:border-line flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ProfileAvatar alt="Dr. Asif Rahman" size="xs" className="w-6 h-6 border border-slate-200 dark:border-line" />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-fg">Dr. Asif Rahman</p>
                      <p className="text-xs font-mono text-slate-500 dark:text-fg-muted">02:30 PM - 04:00 PM • Room 405</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-surface-2 text-slate-600 dark:text-fg-muted text-xs font-semibold">
                    By Appt
                  </span>
                </div>
              </div>
            </div>

            {/* Widget 3: Class Study Groups & Peers */}
            <div className="bg-white dark:bg-surface border border-slate-200 dark:border-line rounded-2xl p-4.5 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-line">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-brand/10 text-brand dark:bg-[var(--color-brand, #605BFF)]/15 dark:text-[var(--color-brand, #605BFF)] flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <h3 className="font-manrope font-bold text-sm text-slate-900 dark:text-fg">
                    Peer Study Circles
                  </h3>
                </div>
                <span className="text-xs font-mono text-emerald-500 font-semibold">5 Active</span>
              </div>

              <div className="mt-3.5 space-y-2.5">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-surface-2 border border-slate-200 dark:border-line space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-fg">
                      Algorithms Sprint Practice
                    </span>
                    <span className="font-mono text-xs text-brand dark:text-[var(--color-brand, #605BFF)]">03:00 PM</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-fg-muted">
                    Central Library 3rd Floor • Collaborative Booth 4
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-slate-500 dark:text-fg-muted font-medium">3 members joined</span>
                    <button
                      type="button"
                      onClick={() => alert("Joined Study Circle! Room notification sent.")}
                      className="text-xs font-semibold text-brand dark:text-[var(--color-brand, #605BFF)] hover:underline cursor-pointer"
                    >
                      Join Circle
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* WEEKLY TIMETABLE MATRIX: Full Screen Edge-to-Edge Grid (100% Horizontal Fill) */
        <div className="w-full">
          <div className="w-full bg-white dark:bg-surface border border-slate-200 dark:border-line rounded-2xl p-4 shadow-sm overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 dark:border-line mb-3 gap-2">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-brand/10 dark:bg-[var(--color-brand, #605BFF)]/15 text-brand dark:text-[var(--color-brand, #605BFF)] border border-brand/20 dark:border-[var(--color-brand, #605BFF)]/30">
                  <LayoutGrid className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-manrope font-bold text-base text-slate-900 dark:text-fg">
                    Spring 2026 Master Timetable Grid
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-fg-muted">
                    Full weekly department layout • CSE Section A
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-brand/10 dark:bg-[var(--color-brand, #605BFF)]/15 text-brand dark:text-blue-400 border border-brand/20 dark:border-[var(--color-brand, #605BFF)]/30">
                  <span className="w-2 h-2 rounded-full bg-brand dark:bg-[var(--color-brand, #605BFF)]" /> Theory Lecture
                </span>
                <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Lab Sessional
                </span>
              </div>
            </div>

            {/* Timetable Matrix Table */}
            <div className="w-full overflow-x-auto custom-scrollbar">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-line bg-slate-50 dark:bg-surface-2">
                    <th className="py-3 px-3 font-mono text-xs font-bold text-slate-700 dark:text-fg w-36">
                      Time Slot
                    </th>
                    {daysList.map((day) => (
                      <th
                        key={day}
                        className={`py-3 px-3 font-manrope text-xs font-bold ${
                          day === selectedDay
                            ? "text-brand dark:text-[var(--color-brand, #605BFF)] bg-brand/5 dark:bg-[var(--color-brand, #605BFF)]/10"
                            : "text-slate-700 dark:text-fg"
                        }`}
                      >
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-line text-xs">
                  {weeklyTimeGridSlots.map((row, i) => {
                    const isBreakRow = row.mon === "Break";
                    if (isBreakRow) {
                      return (
                        <tr key={i} className="bg-amber-500/5 dark:bg-amber-500/5 border-y border-amber-500/20">
                          <td className="py-2.5 px-3 font-mono text-xs font-semibold text-amber-600 dark:text-amber-400 whitespace-nowrap bg-amber-500/10">
                            {row.time}
                          </td>
                          <td colSpan={daysList.length} className="py-2.5 px-4 text-center">
                            <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-amber-600 dark:text-amber-400">
                              <Coffee className="w-3.5 h-3.5" />
                              Midday Recess &amp; Campus Prayer Break (All Departments)
                            </span>
                          </td>
                        </tr>
                      );
                    }

                    return (
                      <tr
                        key={i}
                        className="hover:bg-slate-50/60 dark:hover:bg-surface-2/60 transition-colors"
                      >
                        <td className="py-3 px-3 font-mono text-xs font-semibold text-slate-500 dark:text-fg-muted whitespace-nowrap bg-slate-50/50 dark:bg-surface-2/30">
                          {row.time}
                        </td>
                        {daysList.map((day) => {
                          const slotKey = day.toLowerCase().slice(0, 3) as "mon" | "tue" | "wed" | "thu" | "fri" | "sat";
                          const val = row[slotKey] || "-";
                          const isLab = val.includes("(Lab)");
                          const isActiveSlot = val.includes("(Active)");

                          if (val === "-") {
                            return (
                              <td key={day} className="py-3 px-3 text-slate-300 dark:text-border-line font-mono text-xs">
                                —
                              </td>
                            );
                          }

                          return (
                            <td key={day} className="py-2.5 px-3">
                              <div
                                className={`p-2 rounded-xl border transition-all ${
                                  isActiveSlot
                                    ? "bg-brand/10 dark:bg-[var(--color-brand, #605BFF)]/15 border-brand dark:border-[var(--color-brand, #605BFF)] shadow-xs"
                                    : isLab
                                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                                    : "bg-slate-100 dark:bg-surface-2 border-slate-200 dark:border-line"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-mono font-bold text-xs text-slate-900 dark:text-fg">
                                    {val.replace(" (Active)", "").replace(" (Lab)", "")}
                                  </span>
                                  {isLab && (
                                    <span className="font-mono text-xs px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-500 font-bold">
                                      LAB
                                    </span>
                                  )}
                                  {isActiveSlot && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                                  )}
                                </div>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL: GOOGLE CALENDAR SYNC                                            */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isCalendarModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCalendarModalOpen(false)}
              className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative z-10 w-full max-w-md bg-white dark:bg-surface border border-slate-200 dark:border-line rounded-3xl p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-line pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-brand/10 text-brand dark:bg-[var(--color-brand, #605BFF)]/15 dark:text-[var(--color-brand, #605BFF)] flex items-center justify-center">
                    <CalendarPlus className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-manrope font-extrabold text-base text-slate-900 dark:text-fg">
                      Google Calendar Sync
                    </h3>
                    <p className="text-xs font-mono text-slate-500 dark:text-fg-muted">
                      Semester Spring 2026 • 18 Weekly Events
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCalendarModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {calendarSyncSuccess ? (
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto animate-bounce" />
                  <h4 className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                    Synced Successfully!
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-fg-muted">
                    Your lectures and labs have been added to your linked Google Calendar with 10-minute notifications.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-surface-2 border border-slate-200 dark:border-line space-y-2.5 text-xs">
                    <div className="flex items-center justify-between text-slate-700 dark:text-fg">
                      <span>Target Calendar:</span>
                      <span className="font-mono font-semibold text-slate-900 dark:text-fg">sakib.cse@unicampus.edu</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-700 dark:text-fg">
                      <span>Reminders:</span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">10 mins before class</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-700 dark:text-fg">
                      <span>Automatic Updates:</span>
                      <span className="font-mono text-brand dark:text-[var(--color-brand, #605BFF)] font-semibold">Enabled</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-fg-muted leading-relaxed">
                    Syncing imports all weekly lectures, room allocations, instructor names, and exam blackout slots directly into your calendar.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCalendarModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-fg-muted dark:hover:text-white transition-colors cursor-pointer"
                >
                  Close
                </button>
                {!calendarSyncSuccess && (
                  <button
                    type="button"
                    onClick={handleSyncCalendar}
                    className="px-5 py-2 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                  >
                    Sync Now
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 6. MODAL: REQUEST RESCHEDULE OR SWAP                                      */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isSwapModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSwapModalOpen(false)}
              className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative z-10 w-full max-w-lg bg-white dark:bg-surface border border-slate-200 dark:border-line rounded-3xl p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-line pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-brand/10 text-brand dark:bg-[var(--color-brand, #605BFF)]/15 dark:text-[var(--color-brand, #605BFF)] flex items-center justify-center">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-manrope font-extrabold text-base text-slate-900 dark:text-fg">
                      Request Reschedule or Swap
                    </h3>
                    <p className="text-xs font-mono text-slate-500 dark:text-fg-muted">
                      Academic Council &amp; Class Representative Channel
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSwapModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {swapSubmitted ? (
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto animate-bounce" />
                  <h4 className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                    Request Submitted to Academic CR!
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-fg-muted">
                    Your suggestion has been logged with the Department Routine Committee. You will receive a notification once reviewed.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSwapSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-fg">
                      Select Course Slot to Adjust
                    </label>
                    <select
                      required
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-surface-2 border border-slate-200 dark:border-line text-xs text-slate-900 dark:text-fg focus:outline-none focus:border-brand dark:focus:border-[var(--color-brand, #605BFF)]"
                    >
                      <option value="CSE-3205">CSE-3205 • Software Engineering (Monday 10:15 AM)</option>
                      <option value="CSE-3101">CSE-3101 • Design &amp; Analysis of Algorithms (Monday 01:00 PM)</option>
                      <option value="CSE-3206">CSE-3206 • Software Engineering Lab (Monday 02:45 PM)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-fg">
                      Proposed Day &amp; Time Slot
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Wednesday 03:00 PM - 04:30 PM (Lab 4 Available)"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-surface-2 border border-slate-200 dark:border-line text-xs text-slate-900 dark:text-fg placeholder-slate-400 dark:placeholder-fg-muted focus:outline-none focus:border-brand dark:focus:border-[var(--color-brand, #605BFF)]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-fg">
                      Reason for Reschedule / Swap
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="e.g. Consecutive lab clashes with department programming contest preparation..."
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-surface-2 border border-slate-200 dark:border-line text-xs text-slate-900 dark:text-fg placeholder-slate-400 dark:placeholder-fg-muted focus:outline-none focus:border-brand dark:focus:border-[var(--color-brand, #605BFF)]"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsSwapModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-fg-muted dark:hover:text-white transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                    >
                      Submit Proposal
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
