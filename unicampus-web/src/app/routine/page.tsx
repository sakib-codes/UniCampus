"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock, 
  Printer, 
  Download, 
  CalendarPlus, 
  Calendar, 
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
  Sparkles,
  BookOpen,
  Send,
  HelpCircle,
  LayoutGrid,
  List,
  Compass,
  Users,
  Building,
  GraduationCap,
  Layers,
  ChevronRight,
  TrendingUp,
  Award,
  Bell
} from "lucide-react";
import FadeIn from "@/components/bits/FadeIn";
import SpotlightCard from "@/components/bits/SpotlightCard";
import ProfileAvatar from "@/components/common/ProfileAvatar";
import { SPOTLIGHT } from "@/lib/theme";

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
  { time: "08:30 - 10:00", mon: "CSE-3103", tue: "-", wed: "CSE-3205", thu: "-", fri: "CSE-3200", sat: "-" },
  { time: "09:00 - 10:30", mon: "-", tue: "CSE-3105", wed: "-", thu: "CSE-3105", fri: "CSE-3200", sat: "CSE-3301" },
  { time: "10:15 - 11:45", mon: "CSE-3205 (Active)", tue: "-", wed: "CSE-3103", thu: "-", fri: "CSE-3200", sat: "CSE-3301" },
  { time: "10:45 - 12:15", mon: "-", tue: "CSE-3101", wed: "-", thu: "CSE-3101", fri: "-", sat: "-" },
  { time: "11:45 - 01:00", mon: "Break", tue: "Break", wed: "Break", thu: "Break", fri: "Break", sat: "-" },
  { time: "01:00 - 02:30", mon: "CSE-3101", tue: "-", wed: "GEN-2101", thu: "-", fri: "-", sat: "-" },
  { time: "01:30 - 04:30", mon: "-", tue: "CSE-3104 (Lab)", wed: "-", thu: "CSE-3106 (Lab)", fri: "-", sat: "-" },
  { time: "02:45 - 04:45", mon: "CSE-3206 (Lab)", tue: "-", wed: "-", thu: "-", fri: "-", sat: "-" },
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

  const handleExportPDF = () => {
    alert("Exporting Spring 2026 Timetable PDF for Section A...");
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
      <FadeIn delay={0.05} direction="down">
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-[#30363D]/40">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="font-manrope font-extrabold text-xl md:text-2xl tracking-tight text-slate-900 dark:text-[#F0F6FC]">
                Weekly Class Routine &amp; Timetable
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-brand/10 text-brand border border-brand/25 dark:bg-[#2563EB]/15 dark:text-[#2563EB] dark:border-[#2563EB]/30 text-[11px] font-mono font-semibold whitespace-nowrap">
                Live Spring 2026
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#8D96A0] mt-0.5 font-jakarta">
              Semester Spring 2026 • Section A • Dept. of Computer Science &amp; Engineering • Student ID: 211-15-4424
            </p>
          </div>

          {/* Action Cluster & View Switcher */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* View Mode Switcher */}
            <div className="p-0.5 rounded-xl bg-slate-100 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] flex items-center relative">
              <button
                type="button"
                onClick={() => setViewMode("daily")}
                className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer z-10 ${
                  viewMode === "daily"
                    ? "text-slate-900 dark:text-[#F0F6FC]"
                    : "text-slate-500 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-[#F0F6FC]"
                }`}
              >
                {viewMode === "daily" && (
                  <motion.div
                    layoutId="routine-view-pill"
                    className="absolute inset-0 bg-white dark:bg-[#21262D] rounded-lg shadow-xs -z-10"
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
                    ? "text-slate-900 dark:text-[#F0F6FC]"
                    : "text-slate-500 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-[#F0F6FC]"
                }`}
              >
                {viewMode === "weekly" && (
                  <motion.div
                    layoutId="routine-view-pill"
                    className="absolute inset-0 bg-white dark:bg-[#21262D] rounded-lg shadow-xs -z-10"
                    transition={{ type: "spring", stiffness: 450, damping: 32 }}
                  />
                )}
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Weekly Timetable Matrix</span>
              </button>
            </div>

            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="h-8.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#161B22] dark:hover:bg-[#21262D] border border-slate-200 dark:border-[#30363D] text-slate-700 dark:text-[#C9D1D9] hover:text-slate-900 dark:hover:text-[#F0F6FC] transition-all flex items-center gap-1.5 text-xs font-semibold shadow-xs cursor-pointer active:scale-[0.98]"
              title="Print Timetable"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            {/* Export PDF Button */}
            <button
              type="button"
              onClick={handleExportPDF}
              className="h-8.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#161B22] dark:hover:bg-[#21262D] border border-slate-200 dark:border-[#30363D] text-slate-700 dark:text-[#C9D1D9] hover:text-slate-900 dark:hover:text-[#F0F6FC] transition-all flex items-center gap-1.5 text-xs font-semibold shadow-xs cursor-pointer active:scale-[0.98]"
              title="Export as PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export PDF</span>
            </button>

            {/* Google Calendar Sync (Primary Accent #2563EB) */}
            <button
              type="button"
              onClick={() => setIsCalendarModalOpen(true)}
              className="h-8.5 px-3.5 rounded-xl bg-brand hover:bg-brand-hover dark:bg-[#2563EB] dark:hover:bg-[#5852ff] text-white transition-all flex items-center gap-1.5 text-xs font-semibold shadow-sm dark:shadow-[0_0_16px_rgba(37, 99, 235,0.35)] active:scale-[0.98] cursor-pointer"
            >
              <CalendarPlus className="w-3.5 h-3.5" />
              <span>Google Calendar Sync</span>
            </button>
          </div>
        </section>
      </FadeIn>

      {/* ========================================================================= */}
      {/* 2. OVERVIEW HERO BENTO GRID (4 Cards across 12 cols, identical to Progress)*/}
      {/* ========================================================================= */}
      <FadeIn delay={0.1}>
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: Live Class Status */}
          <SpotlightCard
            className="bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] hover:border-brand/40 dark:hover:border-[#2563EB]/60 rounded-2xl p-4 transition-all duration-300 shadow-xs hover:shadow-md flex flex-col justify-between"
            spotlightColor={SPOTLIGHT.wash}
            borderGlowColor={SPOTLIGHT.glow}
          >
            <div className="flex items-center justify-between pb-2">
              <span className="text-[11px] font-bold text-slate-700 dark:text-[#8D96A0] uppercase tracking-wider font-mono">
                Current Class Status
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                In Progress
              </span>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-mono font-extrabold text-xl text-brand dark:text-[#2563EB]">
                  CSE-3205
                </span>
                <span className="text-xs text-slate-500 dark:text-[#8D96A0] font-mono">42m left</span>
              </div>
              <p className="text-xs font-semibold text-slate-900 dark:text-[#F0F6FC] truncate mt-0.5">
                Software Engineering • Dr. Farhana Khan
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-[#30363D]/60 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 dark:text-[#8D96A0] flex items-center gap-1">
                <MapPin className="w-3 h-3 text-brand dark:text-[#2563EB]" />
                Room 604-B (Bldg 2)
              </span>
              <span className="font-mono text-emerald-500 font-semibold">Slot 02</span>
            </div>
          </SpotlightCard>

          {/* Card 2: Weekly Lectures Load */}
          <SpotlightCard
            className="bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] hover:border-brand/40 dark:hover:border-[#2563EB]/60 rounded-2xl p-4 transition-all duration-300 shadow-xs hover:shadow-md flex flex-col justify-between"
            spotlightColor={SPOTLIGHT.wash}
            borderGlowColor={SPOTLIGHT.glow}
          >
            <div className="flex items-center justify-between pb-2">
              <span className="text-[11px] font-bold text-slate-700 dark:text-[#8D96A0] uppercase tracking-wider font-mono">
                Weekly Lectures Load
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-[#161B22] text-slate-700 dark:text-[#C9D1D9] border border-slate-200 dark:border-[#30363D]">
                15.0 Cr Theory
              </span>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-manrope font-extrabold text-2xl text-slate-900 dark:text-[#F0F6FC]">
                  18
                </span>
                <span className="text-xs text-slate-500 dark:text-[#8D96A0]">Sessions / Week</span>
              </div>
              {/* Progress Bar */}
              <div className="w-full bg-slate-100 dark:bg-[#161B22] h-2 rounded-full mt-2 overflow-hidden border border-slate-200 dark:border-[#30363D]">
                <div className="bg-gradient-to-r from-brand to-[#8A86FF] dark:from-[#2563EB] dark:to-[#8A86FF] h-full rounded-full w-[33%]" />
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-[#30363D]/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-[#8D96A0]">
              <span>6 of 18 completed</span>
              <span className="font-mono font-semibold text-slate-800 dark:text-[#C9D1D9]">33% this week</span>
            </div>
          </SpotlightCard>

          {/* Card 3: Practical Lab Sessional */}
          <SpotlightCard
            className="bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] hover:border-brand/40 dark:hover:border-[#2563EB]/60 rounded-2xl p-4 transition-all duration-300 shadow-xs hover:shadow-md flex flex-col justify-between"
            spotlightColor={SPOTLIGHT.wash}
            borderGlowColor={SPOTLIGHT.glow}
          >
            <div className="flex items-center justify-between pb-2">
              <span className="text-[11px] font-bold text-slate-700 dark:text-[#8D96A0] uppercase tracking-wider font-mono">
                Practical Labs
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                6.0 Cr Sessional
              </span>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-manrope font-extrabold text-2xl text-emerald-500 dark:text-emerald-400">
                  4
                </span>
                <span className="text-xs text-slate-500 dark:text-[#8D96A0]">Dedicated Labs</span>
              </div>
              <div className="flex items-center gap-1.5 mt-2 flex-wrap text-[10px] font-mono">
                <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] text-slate-700 dark:text-[#C9D1D9]">SE Lab</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] text-slate-700 dark:text-[#C9D1D9]">DB Lab</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] text-slate-700 dark:text-[#C9D1D9]">Networks</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] text-slate-700 dark:text-[#C9D1D9]">Capstone</span>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-[#30363D]/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-[#8D96A0]">
              <span>Next: SE Lab (Today 2:45)</span>
              <span className="font-mono text-emerald-500 font-semibold">Bldg 3</span>
            </div>
          </SpotlightCard>

          {/* Card 4: Attendance Health & Free Periods */}
          <SpotlightCard
            className="bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] hover:border-brand/40 dark:hover:border-[#2563EB]/60 rounded-2xl p-4 transition-all duration-300 shadow-xs hover:shadow-md flex flex-col justify-between"
            spotlightColor={SPOTLIGHT.wash}
            borderGlowColor={SPOTLIGHT.glow}
          >
            <div className="flex items-center justify-between pb-2">
              <span className="text-[11px] font-bold text-slate-700 dark:text-[#8D96A0] uppercase tracking-wider font-mono">
                Attendance Health
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Dean&apos;s Honor Met
              </span>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-manrope font-extrabold text-2xl text-slate-900 dark:text-[#F0F6FC]">
                  96.4%
                </span>
                <span className="text-xs text-emerald-500 font-semibold">On-Track</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-[#8D96A0] mt-1">
                6 Free Study Intervals • 0 Attendance Shortages
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-[#30363D]/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-[#8D96A0]">
              <span>Min. Required: 75%</span>
              <span className="font-mono font-semibold text-emerald-500">+21.4% margin</span>
            </div>
          </SpotlightCard>
        </section>
      </FadeIn>

      {/* ========================================================================= */}
      {/* 3. CONTROL STRIP & DAY SELECTOR (Full edge-to-edge width)                 */}
      {/* ========================================================================= */}
      <FadeIn delay={0.15}>
        <section className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-2 bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] rounded-2xl shadow-xs transition-colors">
          {/* Day Selector Pill Track */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-[#1C2128] rounded-xl border border-slate-200 dark:border-[#30363D]/60 overflow-x-auto custom-scrollbar gap-1 flex-1 relative">
            {daysList.map((day) => {
              const isActive = selectedDay === day;
              const count = weeklyRoutineData[day]?.filter((s) => !s.isBreak).length || 0;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={`relative flex-1 min-w-[110px] px-3.5 py-1.5 rounded-lg font-manrope text-xs tracking-tight transition-colors flex items-center justify-center gap-2 shrink-0 cursor-pointer z-10 ${
                    isActive
                      ? "text-white dark:text-[#F0F6FC] font-bold"
                      : "text-slate-600 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-[#F0F6FC] font-semibold"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="routine-student-day-pill"
                      className="absolute inset-0 bg-brand dark:bg-[#2563EB] rounded-lg shadow-xs dark:shadow-[0_0_12px_rgba(37, 99, 235,0.4)] -z-10"
                      transition={{ type: "spring", stiffness: 450, damping: 32 }}
                    />
                  )}
                  <span>{day}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full transition-colors ${
                      isActive
                        ? "bg-white/20 text-white font-bold"
                        : "bg-slate-200 dark:bg-[#0D1117] text-slate-500 dark:text-[#8D96A0]"
                    }`}
                  >
                    {count}
                  </span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                </button>
              );
            })}
          </div>

          {/* Quick Filters & Live Clock Chip */}
          <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
            {/* Filter Pills */}
            <div className="p-0.5 rounded-lg bg-slate-100 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] flex items-center text-xs relative">
              {(["all", "theory", "lab"] as const).map((type) => {
                const isActive = filterType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFilterType(type)}
                    className={`relative px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer capitalize z-10 ${
                      isActive
                        ? "text-slate-900 dark:text-[#F0F6FC]"
                        : "text-slate-500 dark:text-[#8D96A0] hover:text-slate-800 dark:hover:text-white"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="routine-filter-pill"
                        className="absolute inset-0 bg-white dark:bg-[#21262D] rounded-md shadow-xs -z-10"
                        transition={{ type: "spring", stiffness: 450, damping: 32 }}
                      />
                    )}
                    {type === "all" ? "All" : type === "theory" ? "Theory" : "Labs"}
                  </button>
                );
              })}
            </div>

            {/* Live Campus Time Chip */}
            <div className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] flex items-center gap-2 font-mono text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-500 dark:text-[#8D96A0]">Campus Time:</span>
              <span className="font-bold text-brand dark:text-[#2563EB]">11:03 AM</span>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ========================================================================= */}
      {/* 4. MAIN CONTENT AREA (Conditional: Daily Schedule or Weekly Matrix)       */}
      {/* ========================================================================= */}
      {viewMode === "daily" ? (
        /* DAILY SCHEDULE: Balanced 12-Column Layout (8 cols schedule + 4 cols companion) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* LEFT 8 COLUMNS: High-Density Full-Width Lecture Cards */}
          <div className="lg:col-span-8 space-y-3">
            {activeDaySlots.length === 0 ? (
              <div className="bg-white dark:bg-[#0D1117] rounded-2xl border border-slate-200 dark:border-[#30363D] p-12 text-center text-slate-400 dark:text-[#8D96A0] font-mono text-xs">
                No scheduled lectures matching criteria for {selectedDay}. Enjoy your study break!
              </div>
            ) : (
              activeDaySlots.map((slot, index) => {
                // CASE A: Midday Break Card
                if (slot.isBreak) {
                  return (
                    <FadeIn key={slot.id} delay={0.1 + index * 0.04}>
                      <div className="w-full bg-slate-50/70 dark:bg-[#0D1117] border border-dashed border-slate-300 dark:border-[#30363D] rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 dark:text-[#8D96A0] hover:border-slate-400 dark:hover:border-[#484F58] transition-colors gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 dark:text-amber-400 flex items-center justify-center shrink-0">
                            <Coffee className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-manrope font-bold text-slate-800 dark:text-[#F0F6FC] text-sm">
                                {slot.breakLabel}
                              </span>
                              <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-[#161B22] text-slate-600 dark:text-[#8D96A0]">
                                {slot.breakDuration}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 dark:text-[#8D96A0] mt-0.5">
                              <span>{slot.startTime} - {slot.endTime}</span>
                              <span>•</span>
                              <span>{slot.breakLocation}</span>
                            </div>
                          </div>
                        </div>
                        <div className="self-end sm:self-center font-mono text-[10.5px] px-2.5 py-1 rounded-lg bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] text-slate-600 dark:text-[#C9D1D9]">
                          Interval Slot 03
                        </div>
                      </div>
                    </FadeIn>
                  );
                }

                // CASE B: Active In-Progress Slot (Glowing Border & Highlight)
                if (slot.status === "active") {
                  return (
                    <FadeIn key={slot.id} delay={0.1 + index * 0.04}>
                      <SpotlightCard
                        className="w-full bg-indigo-50/40 dark:bg-[#161B22] border-2 border-brand dark:border-[#2563EB] rounded-2xl p-4 shadow-md dark:shadow-[0_0_30px_rgba(37, 99, 235,0.18)] relative overflow-hidden transition-all"
                        spotlightColor={SPOTLIGHT.wash}
                        borderGlowColor={SPOTLIGHT.glow}
                      >
                        {/* Top gradient highlight strip */}
                        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-brand dark:via-[#2563EB] to-transparent" />

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5">
                          {/* Integrated Left Time Block */}
                          <div className="flex sm:flex-col items-center sm:items-start justify-between sm:justify-center w-full sm:w-36 shrink-0 pb-2 sm:pb-0 sm:pr-4 sm:border-r border-slate-200 dark:border-[#30363D]/60 gap-1">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-brand dark:bg-[#2563EB] shadow-[0_0_8px_#2563EB] animate-ping" />
                              <span className="font-mono font-bold text-sm text-brand dark:text-[#2563EB]">
                                {slot.startTime}
                              </span>
                            </div>
                            <span className="font-mono text-xs text-slate-500 dark:text-[#8D96A0]">
                              to {slot.endTime}
                            </span>
                            <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-brand/10 text-brand dark:bg-[#2563EB]/20 dark:text-[#60A5FA] font-semibold mt-1">
                              Slot 02 • Active
                            </span>
                          </div>

                          {/* Center Content Body (Edge-to-Edge Spanning) */}
                          <div className="flex-1 space-y-1.5 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-xs font-bold text-brand dark:text-[#2563EB] px-2 py-0.5 rounded-md bg-brand/10 dark:bg-[#2563EB]/20 border border-brand/30 dark:border-[#2563EB]/40">
                                {slot.courseCode}
                              </span>
                              <h3 className="font-manrope font-extrabold text-sm md:text-base text-slate-900 dark:text-[#F0F6FC]">
                                {slot.courseTitle}
                              </h3>
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand/15 dark:bg-[#2563EB]/20 text-brand dark:text-[#60A5FA] border border-brand/30 dark:border-[#2563EB]/40 text-[10.5px] font-bold font-jakarta">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                {slot.statusText || "In Progress"}
                              </span>
                            </div>

                            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-[#8D96A0] flex-wrap">
                              <div className="flex items-center gap-1.5">
                                <ProfileAvatar alt={slot.instructorName || "Instructor"} size="xs" className="w-5 h-5 border border-brand/40" />
                                <span className="text-slate-900 dark:text-[#F0F6FC] font-semibold">{slot.instructorName}</span>
                              </div>
                              <span>•</span>
                              <div className="flex items-center gap-1 font-mono text-[11px] text-slate-900 dark:text-[#F0F6FC] px-2 py-0.5 rounded bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D]">
                                <MapPin className="w-3 h-3 text-brand dark:text-[#2563EB]" />
                                <span className="font-bold">{slot.room}</span>
                              </div>
                              <span>•</span>
                              <span className="text-slate-600 dark:text-[#8D96A0] truncate max-w-sm">{slot.metaTopic}</span>
                            </div>
                          </div>

                          {/* Right Action Buttons */}
                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                            {slot.secondaryAction && (
                              <Link
                                href={slot.secondaryAction.href || "/materials"}
                                className="h-8 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 dark:bg-[#0D1117] dark:hover:bg-[#1C2128] dark:border-[#30363D] text-xs font-semibold dark:text-[#F0F6FC] transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer whitespace-nowrap"
                              >
                                <slot.secondaryAction.icon className="w-3.5 h-3.5 text-brand dark:text-[#2563EB]" />
                                <span>{slot.secondaryAction.label}</span>
                              </Link>
                            )}
                            {slot.primaryAction && (
                              <button
                                type="button"
                                onClick={() => alert("Connecting to Dr. Farhana Khan's Live Lecture Room...")}
                                className="h-8 px-3.5 rounded-xl bg-brand hover:bg-brand-hover dark:bg-[#2563EB] dark:hover:bg-[#5852ff] text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm shadow-brand/20 dark:shadow-[#2563EB]/30 active:scale-[0.98] cursor-pointer whitespace-nowrap"
                              >
                                <slot.primaryAction.icon className="w-3.5 h-3.5" />
                                <span>{slot.primaryAction.label}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </SpotlightCard>
                    </FadeIn>
                  );
                }

                // CASE C: Completed or Upcoming Standard Slot
                const isCompleted = slot.status === "completed";
                return (
                  <FadeIn key={slot.id} delay={0.1 + index * 0.04}>
                    <SpotlightCard
                      className={`w-full bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] hover:border-brand/40 dark:hover:border-[#2563EB]/50 rounded-2xl p-4 transition-all duration-200 shadow-xs hover:shadow-md ${
                        isCompleted ? "opacity-90 hover:opacity-100" : ""
                      }`}
                      spotlightColor={SPOTLIGHT.wash}
                      borderGlowColor={SPOTLIGHT.glow}
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5">
                        {/* Integrated Left Time Block */}
                        <div className="flex sm:flex-col items-center sm:items-start justify-between sm:justify-center w-full sm:w-36 shrink-0 pb-2 sm:pb-0 sm:pr-4 sm:border-r border-slate-200 dark:border-[#30363D]/60 gap-1">
                          <span className="font-mono font-bold text-sm text-slate-800 dark:text-[#C9D1D9]">
                            {slot.startTime}
                          </span>
                          <span className="font-mono text-xs text-slate-400 dark:text-[#8D96A0]">
                            to {slot.endTime}
                          </span>
                          <span
                            className={`font-mono text-[10px] px-2 py-0.5 rounded-full mt-1 ${
                              isCompleted
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : slot.isLab
                                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold"
                                : "bg-slate-100 dark:bg-[#161B22] text-slate-500 dark:text-[#8D96A0]"
                            }`}
                          >
                            {isCompleted ? "Completed" : slot.isLab ? slot.labHours || "Lab Slot" : `Slot 0${index + 1}`}
                          </span>
                        </div>

                        {/* Center Content Body */}
                        <div className="flex-1 space-y-1.5 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`font-mono text-xs font-bold px-2 py-0.5 rounded-md border ${
                                slot.isLab
                                  ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                                  : "text-slate-700 dark:text-[#8D96A0] bg-slate-100 dark:bg-[#161B22] border-slate-200 dark:border-[#30363D]"
                              }`}
                            >
                              {slot.courseCode}
                            </span>
                            <h3 className="font-manrope font-bold text-sm md:text-base text-slate-900 dark:text-[#F0F6FC]">
                              {slot.courseTitle}
                            </h3>
                            {isCompleted ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10.5px] font-semibold font-jakarta">
                                <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                                Completed
                              </span>
                            ) : (
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold font-jakarta border ${
                                  slot.statusText?.includes("Upcoming in")
                                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                                    : "bg-slate-100 dark:bg-[#161B22] text-slate-600 dark:text-[#8D96A0] border-slate-200 dark:border-[#30363D]"
                                }`}
                              >
                                <CircleDot className="w-2.5 h-2.5" />
                                {slot.statusText || "Upcoming"}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-[#8D96A0] flex-wrap">
                            <div className="flex items-center gap-1.5">
                              <ProfileAvatar alt={slot.instructorName || "Instructor"} size="xs" className="w-5 h-5 border border-slate-200 dark:border-[#30363D]" />
                              <span className="text-slate-700 dark:text-[#C9D1D9] font-medium">{slot.instructorName}</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1 font-mono text-[11px] text-slate-700 dark:text-[#C9D1D9] px-2 py-0.5 rounded bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D]">
                              {slot.isLab ? (
                                <Cpu className="w-2.5 h-2.5 text-emerald-500 dark:text-emerald-400" />
                              ) : (
                                <MapPin className="w-2.5 h-2.5 text-brand dark:text-[#2563EB]" />
                              )}
                              <span>{slot.room}</span>
                            </div>
                            <span>•</span>
                            <span className="text-slate-500 dark:text-[#8D96A0] truncate max-w-sm">{slot.metaTopic}</span>
                          </div>
                        </div>

                        {/* Right Action Buttons */}
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          {slot.secondaryAction && (
                            <Link
                              href={slot.secondaryAction.href || "/materials"}
                              className="h-8 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 dark:bg-[#161B22] dark:hover:bg-[#21262D] dark:border-[#30363D] dark:text-[#C9D1D9] dark:hover:text-[#F0F6FC] transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer whitespace-nowrap shadow-xs"
                            >
                              <slot.secondaryAction.icon className="w-3.5 h-3.5 text-slate-400 dark:text-[#8D96A0]" />
                              <span>{slot.secondaryAction.label}</span>
                            </Link>
                          )}
                          {slot.primaryAction && (
                            <button
                              type="button"
                              onClick={() => alert(`Launching ${slot.courseTitle} Classroom Link...`)}
                              className="h-8 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 dark:bg-[#161B22] dark:hover:bg-[#21262D] dark:border-[#30363D] dark:text-[#8D96A0] dark:hover:text-[#C9D1D9] transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer whitespace-nowrap shadow-xs"
                            >
                              <slot.primaryAction.icon className="w-3.5 h-3.5" />
                              <span>{slot.primaryAction.label}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </SpotlightCard>
                  </FadeIn>
                );
              })
            )}

            {/* Bottom Council Notice Bar */}
            <div className="p-3 rounded-xl bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-[#8D96A0] gap-2">
              <div className="flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-brand dark:text-[#2563EB] shrink-0" />
                <span>Routine adjustments made by academic council are automatically reflected in real-time.</span>
              </div>
              <button
                type="button"
                onClick={() => setIsSwapModalOpen(true)}
                className="text-brand dark:text-[#2563EB] hover:underline font-semibold flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span>Request reschedule or swap</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* RIGHT 4 COLUMNS: Companion Widgets (Radar, Office Hours, Classmates) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Widget 1: Campus Classroom Radar */}
            <SpotlightCard
              className="bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] rounded-2xl p-4.5 shadow-xs"
              spotlightColor={SPOTLIGHT.wash}
              borderGlowColor={SPOTLIGHT.glow}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#30363D]/60">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-brand/10 text-brand dark:bg-[#2563EB]/15 dark:text-[#2563EB] flex items-center justify-center">
                    <Compass className="w-4 h-4" />
                  </div>
                  <h3 className="font-manrope font-bold text-sm text-slate-900 dark:text-[#F0F6FC]">
                    Campus Location Radar
                  </h3>
                </div>
                <span className="font-mono text-[10.5px] text-emerald-500 font-semibold">Live GPS</span>
              </div>

              <div className="mt-3.5 space-y-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-[#8D96A0]">Current Hall:</span>
                    <span className="font-bold text-slate-900 dark:text-[#F0F6FC]">Room 604-B</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-[#8D96A0]">Building &amp; Floor:</span>
                    <span className="font-mono text-slate-700 dark:text-[#C9D1D9]">Faculty Bldg 2 • 6th Fl</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-brand/5 dark:bg-[#2563EB]/10 border border-brand/20 dark:border-[#2563EB]/30 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-brand dark:text-[#60A5FA] font-semibold">Next Lecture Up:</span>
                    <span className="font-bold text-slate-900 dark:text-[#F0F6FC]">Room 402</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-[#8D96A0]">Transit Estimate:</span>
                    <span className="font-mono text-emerald-500 font-semibold">3 mins walk (East Wing)</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => alert("Opening Campus Interactive 3D Map...")}
                  className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#1C2128] dark:hover:bg-[#21262D] border border-slate-200 dark:border-[#30363D] text-xs font-semibold text-slate-800 dark:text-[#F0F6FC] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-brand dark:text-[#2563EB]" />
                  <span>Open Campus Floor Map</span>
                </button>
              </div>
            </SpotlightCard>

            {/* Widget 2: Faculty Office Hours Today */}
            <SpotlightCard
              className="bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] rounded-2xl p-4.5 shadow-xs"
              spotlightColor={SPOTLIGHT.wash}
              borderGlowColor={SPOTLIGHT.glow}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#30363D]/60">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <h3 className="font-manrope font-bold text-sm text-slate-900 dark:text-[#F0F6FC]">
                    Faculty Drop-In Hours
                  </h3>
                </div>
                <span className="text-[10.5px] font-mono text-slate-400 dark:text-[#8D96A0]">Today</span>
              </div>

              <div className="mt-3.5 space-y-2.5">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ProfileAvatar alt="Dr. Farhana Khan" size="xs" className="w-6 h-6 border border-slate-200 dark:border-[#30363D]" />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-[#F0F6FC]">Dr. Farhana Khan</p>
                      <p className="text-[10.5px] font-mono text-slate-500 dark:text-[#8D96A0]">12:00 PM - 01:30 PM • Room 612</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold border border-emerald-500/20">
                    Open
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ProfileAvatar alt="Dr. Asif Rahman" size="xs" className="w-6 h-6 border border-slate-200 dark:border-[#30363D]" />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-[#F0F6FC]">Dr. Asif Rahman</p>
                      <p className="text-[10.5px] font-mono text-slate-500 dark:text-[#8D96A0]">02:30 PM - 04:00 PM • Room 405</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-[#21262D] text-slate-600 dark:text-[#8D96A0] text-[10px] font-semibold">
                    By Appt
                  </span>
                </div>
              </div>
            </SpotlightCard>

            {/* Widget 3: Class Study Groups & Peers */}
            <SpotlightCard
              className="bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] rounded-2xl p-4.5 shadow-xs"
              spotlightColor={SPOTLIGHT.wash}
              borderGlowColor={SPOTLIGHT.glow}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#30363D]/60">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-brand/10 text-brand dark:bg-[#2563EB]/15 dark:text-[#2563EB] flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <h3 className="font-manrope font-bold text-sm text-slate-900 dark:text-[#F0F6FC]">
                    Peer Study Circles
                  </h3>
                </div>
                <span className="text-[10.5px] font-mono text-emerald-500 font-semibold">5 Active</span>
              </div>

              <div className="mt-3.5 space-y-2.5">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-[#F0F6FC]">
                      Algorithms Sprint Practice
                    </span>
                    <span className="font-mono text-[10.5px] text-brand dark:text-[#2563EB]">03:00 PM</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-[#8D96A0]">
                    Central Library 3rd Floor • Collaborative Booth 4
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex -space-x-1.5">
                      <ProfileAvatar alt="Tanjim" size="xs" className="w-5 h-5 border border-white dark:border-[#0D1117]" />
                      <ProfileAvatar alt="Rahim" size="xs" className="w-5 h-5 border border-white dark:border-[#0D1117]" />
                      <ProfileAvatar alt="Nusrat" size="xs" className="w-5 h-5 border border-white dark:border-[#0D1117]" />
                    </div>
                    <button
                      type="button"
                      onClick={() => alert("Joined Study Circle! Room notification sent.")}
                      className="text-xs font-semibold text-brand dark:text-[#2563EB] hover:underline cursor-pointer"
                    >
                      Join Circle
                    </button>
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </div>
        </div>
      ) : (
        /* WEEKLY TIMETABLE MATRIX: Full Screen Edge-to-Edge Grid (100% Horizontal Fill) */
        <FadeIn delay={0.1}>
          <SpotlightCard
            className="w-full bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] rounded-2xl p-4 shadow-sm overflow-hidden"
            spotlightColor={SPOTLIGHT.wash}
            borderGlowColor={SPOTLIGHT.glow}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 dark:border-[#30363D]/60 mb-3 gap-2">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-brand/10 dark:bg-[#2563EB]/15 text-brand dark:text-[#2563EB] border border-brand/20 dark:border-[#2563EB]/30">
                  <LayoutGrid className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-manrope font-bold text-base text-slate-900 dark:text-[#F0F6FC]">
                    Spring 2026 Master Timetable Grid
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-[#8D96A0]">
                    Full weekly department layout • CSE Section A
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-brand/10 dark:bg-[#2563EB]/15 text-brand dark:text-[#60A5FA] border border-brand/20 dark:border-[#2563EB]/30">
                  <span className="w-2 h-2 rounded-full bg-brand dark:bg-[#2563EB]" /> Theory Lecture
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
                  <tr className="border-b border-slate-200 dark:border-[#30363D] bg-slate-50 dark:bg-[#161B22]">
                    <th className="py-3 px-3 font-mono text-xs font-bold text-slate-700 dark:text-[#C9D1D9] w-36">
                      Time Slot
                    </th>
                    {daysList.map((day) => (
                      <th
                        key={day}
                        className={`py-3 px-3 font-manrope text-xs font-bold ${
                          day === selectedDay
                            ? "text-brand dark:text-[#2563EB] bg-brand/5 dark:bg-[#2563EB]/10"
                            : "text-slate-700 dark:text-[#C9D1D9]"
                        }`}
                      >
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-[#30363D]/60 text-xs">
                  {weeklyTimeGridSlots.map((row, i) => {
                    const isBreakRow = row.mon === "Break";
                    return (
                      <tr
                        key={i}
                        className={
                          isBreakRow
                            ? "bg-amber-500/5 dark:bg-amber-500/5"
                            : "hover:bg-slate-50/60 dark:hover:bg-[#161B22]/60 transition-colors"
                        }
                      >
                        <td className="py-3 px-3 font-mono text-[11px] font-semibold text-slate-500 dark:text-[#8D96A0] whitespace-nowrap bg-slate-50/50 dark:bg-[#161B22]/30">
                          {row.time}
                        </td>
                        {daysList.map((day) => {
                          const slotKey = day.toLowerCase().slice(0, 3) as "mon" | "tue" | "wed" | "thu" | "fri" | "sat";
                          const val = row[slotKey] || "-";
                          const isBreak = val === "Break";
                          const isLab = val.includes("(Lab)");
                          const isActiveSlot = val.includes("(Active)");

                          if (val === "-") {
                            return (
                              <td key={day} className="py-3 px-3 text-slate-300 dark:text-[#30363D] font-mono text-[11px]">
                                —
                              </td>
                            );
                          }

                          if (isBreak) {
                            return (
                              <td key={day} className="py-2.5 px-3">
                                <span className="inline-flex items-center gap-1 font-mono text-[10.5px] text-amber-500 dark:text-amber-400">
                                  <Coffee className="w-3 h-3" />
                                  Midday Recess
                                </span>
                              </td>
                            );
                          }

                          return (
                            <td key={day} className="py-2.5 px-3">
                              <div
                                className={`p-2 rounded-xl border transition-all ${
                                  isActiveSlot
                                    ? "bg-brand/10 dark:bg-[#2563EB]/15 border-brand dark:border-[#2563EB] shadow-xs"
                                    : isLab
                                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                                    : "bg-slate-100 dark:bg-[#161B22] border-slate-200 dark:border-[#30363D]"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-mono font-bold text-xs text-slate-900 dark:text-[#F0F6FC]">
                                    {val.replace(" (Active)", "").replace(" (Lab)", "")}
                                  </span>
                                  {isLab && (
                                    <span className="font-mono text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-500 font-bold">
                                      LAB
                                    </span>
                                  )}
                                  {isActiveSlot && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-brand dark:bg-[#2563EB] animate-pulse" />
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
          </SpotlightCard>
        </FadeIn>
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
              className="relative z-10 w-full max-w-md bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] rounded-3xl p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#30363D] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-brand/10 text-brand dark:bg-[#2563EB]/15 dark:text-[#2563EB] flex items-center justify-center">
                    <CalendarPlus className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-manrope font-extrabold text-base text-slate-900 dark:text-[#F0F6FC]">
                      Google Calendar Sync
                    </h3>
                    <p className="text-[11px] font-mono text-slate-500 dark:text-[#8D96A0]">
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
                  <p className="text-xs text-slate-600 dark:text-[#8D96A0]">
                    Your lectures and labs have been added to your linked Google Calendar with 10-minute notifications.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] space-y-2.5 text-xs">
                    <div className="flex items-center justify-between text-slate-700 dark:text-[#C9D1D9]">
                      <span>Target Calendar:</span>
                      <span className="font-mono font-semibold text-slate-900 dark:text-[#F0F6FC]">sakib.cse@unicampus.edu</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-700 dark:text-[#C9D1D9]">
                      <span>Reminders:</span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">10 mins before class</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-700 dark:text-[#C9D1D9]">
                      <span>Automatic Updates:</span>
                      <span className="font-mono text-brand dark:text-[#2563EB] font-semibold">Enabled</span>
                    </div>
                  </div>

                  <p className="text-[11.5px] text-slate-500 dark:text-[#8D96A0] leading-relaxed">
                    Syncing imports all weekly lectures, room allocations, instructor names, and exam blackout slots directly into your calendar.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCalendarModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-[#8D96A0] dark:hover:text-white transition-colors cursor-pointer"
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
              className="relative z-10 w-full max-w-lg bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] rounded-3xl p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#30363D] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-brand/10 text-brand dark:bg-[#2563EB]/15 dark:text-[#2563EB] flex items-center justify-center">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-manrope font-extrabold text-base text-slate-900 dark:text-[#F0F6FC]">
                      Request Reschedule or Swap
                    </h3>
                    <p className="text-[11px] font-mono text-slate-500 dark:text-[#8D96A0]">
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
                  <p className="text-xs text-slate-600 dark:text-[#8D96A0]">
                    Your suggestion has been logged with the Department Routine Committee. You will receive a notification once reviewed.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSwapSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-[#C9D1D9]">
                      Select Course Slot to Adjust
                    </label>
                    <select
                      required
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] text-xs text-slate-900 dark:text-[#F0F6FC] focus:outline-none focus:border-brand dark:focus:border-[#2563EB]"
                    >
                      <option value="CSE-3205">CSE-3205 • Software Engineering (Monday 10:15 AM)</option>
                      <option value="CSE-3101">CSE-3101 • Design &amp; Analysis of Algorithms (Monday 01:00 PM)</option>
                      <option value="CSE-3206">CSE-3206 • Software Engineering Lab (Monday 02:45 PM)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-[#C9D1D9]">
                      Proposed Day &amp; Time Slot
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Wednesday 03:00 PM - 04:30 PM (Lab 4 Available)"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] text-xs text-slate-900 dark:text-[#F0F6FC] placeholder-slate-400 dark:placeholder-[#6E747D] focus:outline-none focus:border-brand dark:focus:border-[#2563EB]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-[#C9D1D9]">
                      Reason for Reschedule / Swap
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="e.g. Consecutive lab clashes with department programming contest preparation..."
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] text-xs text-slate-900 dark:text-[#F0F6FC] placeholder-slate-400 dark:placeholder-[#6E747D] focus:outline-none focus:border-brand dark:focus:border-[#2563EB]"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsSwapModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-[#8D96A0] dark:hover:text-white transition-colors cursor-pointer"
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
