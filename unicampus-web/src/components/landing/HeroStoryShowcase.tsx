"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  GraduationCap, 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Calendar, 
  BookOpen, 
  TrendingUp, 
  Award, 
  Sparkles,
  MapPin,
  Users,
  ChevronRight,
  Check,
  Bell
} from "lucide-react";
import ClickSpark from "@/components/bits/ClickSpark";

interface HeroStoryShowcaseProps {
  onOpenAuthModal: (role?: "student" | "faculty" | "admin", mode?: "signin" | "register") => void;
  onQuickDemoLogin?: (role: "student" | "faculty") => void;
}

type StoryPersona = "faculty" | "student";

export default function HeroStoryShowcase({
  onOpenAuthModal,
  onQuickDemoLogin,
}: HeroStoryShowcaseProps) {
  const [activePersona, setActivePersona] = useState<StoryPersona>("faculty");
  
  // Interactive mini-demo states
  const [facultyAttendanceCount, setFacultyAttendanceCount] = useState(42);
  const [justPunched, setJustPunched] = useState(false);
  const [activeStudentDay, setActiveStudentDay] = useState<"Mon" | "Tue" | "Wed" | "Thu">("Mon");

  const handleDemoPunch = () => {
    if (justPunched) return;
    setJustPunched(true);
    setFacultyAttendanceCount((prev) => (prev >= 45 ? 42 : prev + 1));
    setTimeout(() => setJustPunched(false), 2000);
  };

  return (
    <div className="w-full my-10 relative">
      {/* =========================================================================
          HUMAN-CRAFTED SEGMENTED CONTROLLER (CLEAN, PURPOSEFUL, NO MONOSPACE BUZZWORDS)
      ========================================================================= */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand">
            Interactive Campus Preview
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-[#F0F6FC] tracking-tight">
            Built for how universities actually run
          </h2>
        </div>

        {/* Human Segmented Switcher */}
        <div className="inline-flex items-center p-1.5 rounded-2xl bg-slate-200/60 dark:bg-[#161B22] border border-slate-300/60 dark:border-[#30363D] shadow-inner">
          <button
            onClick={() => setActivePersona("faculty")}
            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activePersona === "faculty"
                ? "bg-white dark:bg-[#0D1117] text-slate-900 dark:text-[#F0F6FC] shadow-sm border border-slate-200 dark:border-[#30363D]"
                : "text-slate-600 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Building2 className={`w-4 h-4 ${activePersona === "faculty" ? "text-blue-500" : ""}`} />
            <span>For Faculty & Educators</span>
            {activePersona === "faculty" && (
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActivePersona("student")}
            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activePersona === "student"
                ? "bg-white dark:bg-[#0D1117] text-slate-900 dark:text-[#F0F6FC] shadow-sm border border-slate-200 dark:border-[#30363D]"
                : "text-slate-600 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <GraduationCap className={`w-4 h-4 ${activePersona === "student" ? "text-purple-500" : ""}`} />
            <span>For Students & Scholars</span>
            {activePersona === "student" && (
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            )}
          </button>
        </div>
      </div>

      {/* =========================================================================
          THE LIVING PRODUCT STAGE (SEAMLESS CANVAS INTEGRATION)
      ========================================================================= */}
      <div className="relative rounded-3xl overflow-hidden bg-[#0A0D18] text-white border border-slate-800/80 shadow-2xl shadow-black/40">
        
        {/* Subtle Ambient Studio Lighting */}
        <div 
          className={`absolute inset-0 transition-opacity duration-700 pointer-events-none -z-10 ${
            activePersona === "faculty" 
              ? "bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.18),transparent_60%)]"
              : "bg-[radial-gradient(ellipse_at_top_right,rgba(168,85,247,0.18),transparent_60%)]"
          }`} 
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(29, 91, 216,0.08),transparent_70%)] pointer-events-none" />

        <AnimatePresence mode="wait">
          {activePersona === "faculty" ? (
            /* =================================================================
               FACULTY PERSPECTIVE: SEAMLESS ART + AUTHENTIC PRODUCT CONSOLE
            ================================================================= */
            <motion.div
              key="faculty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px] items-center p-6 sm:p-10 lg:p-12 gap-10"
            >
              {/* Left Column: Seamless Character Story Art (Blends organically into the canvas) */}
              <div className="lg:col-span-5 relative flex flex-col justify-center">
                <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] flex items-center justify-center">
                  {/* Subtle backglow behind the character */}
                  <div className="absolute inset-0 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />

                  {/* Character Illustration with soft feathered edges to remove any box boundary */}
                  <div className="relative w-full h-full [mask-image:radial-gradient(ellipse_at_center,black_75%,transparent_100%)]">
                    <Image
                      src="/images/hero-faculty.png"
                      alt="Faculty mentor with digital curriculum"
                      fill
                      priority
                      className="object-contain object-left drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] select-none"
                      sizes="(max-width: 1024px) 100vw, 45vw"
                    />
                  </div>

                  {/* Authentic Anchored Badge (Anchored directly onto the visual base) */}
                  <div className="absolute bottom-2 left-2 sm:left-4 z-20 flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-[#121727]/90 backdrop-blur-xl border border-blue-500/30 shadow-xl">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Dr. Asif Rahman</p>
                      <p className="text-[10px] text-slate-400">Head of Computer Science & Engineering</p>
                    </div>
                  </div>
                </div>

                {/* Narrative Statement */}
                <div className="mt-4 space-y-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Less paperwork. More mentorship.
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Take attendance in 10 seconds, let marks cascade to academic transcripts automatically, and answer student questions without sharing personal phone numbers.
                  </p>
                </div>
              </div>

              {/* Right Column: High-Fidelity Interactive Faculty Workspace Preview */}
              <div className="lg:col-span-7 w-full space-y-4">
                
                {/* Product Frame Card */}
                <div className="rounded-2xl bg-[#101423]/95 border border-slate-700/80 shadow-2xl p-5 sm:p-6 space-y-5">
                  
                  {/* Window Bar */}
                  <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                      <span className="text-xs font-semibold text-slate-400 ml-2">
                        Faculty Console • Live Lecture Session
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live Terminal
                    </span>
                  </div>

                  {/* Active Course Banner */}
                  <div className="p-4 rounded-xl bg-[#161C30] border border-blue-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold mb-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>09:30 AM — 11:00 AM (45 min remaining)</span>
                      </div>
                      <h4 className="text-base font-bold text-white">
                        CSE-311: Software Engineering & Architecture
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span>Lab 402 • Academic Block B</span>
                        <span>•</span>
                        <span>Section 4A</span>
                      </p>
                    </div>

                    <div className="text-right sm:border-l sm:border-slate-700/80 sm:pl-5 shrink-0">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Syllabus Covered</span>
                      <span className="text-lg font-black text-blue-400">84%</span>
                      <div className="w-24 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full w-[84%]" />
                      </div>
                    </div>
                  </div>

                  {/* Interactive Attendance Card with Live Demo Action */}
                  <div className="p-4 rounded-xl bg-[#0D111C] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-200">Biometric & QR Attendance</span>
                        {justPunched && (
                          <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 animate-fade-in">
                            +1 Scholar Checked In!
                          </span>
                        )}
                      </div>
                      <p className="text-2xl font-black text-white tracking-tight">
                        {facultyAttendanceCount} <span className="text-sm font-normal text-slate-400">/ 45 Students Present</span>
                      </p>
                      <p className="text-xs text-emerald-400 font-medium">
                        {((facultyAttendanceCount / 45) * 100).toFixed(1)}% verified attendance
                      </p>
                    </div>

                    <button
                      onClick={handleDemoPunch}
                      className="px-4 py-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto active:scale-95"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Test Scan / Roll Call</span>
                    </button>
                  </div>

                  {/* Today's Schedule Snapshot */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-[#141828] border border-slate-800/80 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-mono">11:30 AM — Room 305</span>
                        <span className="font-bold text-slate-200">CSE-412: Distributed Systems</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">Upcoming</span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#141828] border border-slate-800/80 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-mono">02:00 PM — Faculty Office</span>
                        <span className="font-bold text-slate-200">Student Consultation Hours</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold">3 Booked</span>
                    </div>
                  </div>

                </div>

                {/* Bottom Action Strip */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Check className="w-3.5 h-3.5 text-blue-400" />
                    <span>Instant sync with university gradebooks & registrar</span>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <ClickSpark sparkColor="#3B82F6" sparkCount={8} sparkRadius={20}>
                      <button
                        onClick={() => {
                          if (onQuickDemoLogin) {
                            onQuickDemoLogin("faculty");
                          } else {
                            onOpenAuthModal("faculty", "signin");
                          }
                        }}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                      >
                        <Building2 className="w-3.5 h-3.5" />
                        <span>Sign In as Dr. Asif Rahman</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </ClickSpark>

                    <Link
                      href="/teachers"
                      className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-all border border-slate-800"
                    >
                      Directory
                    </Link>
                  </div>
                </div>

              </div>
            </motion.div>
          ) : (
            /* =================================================================
               STUDENT PERSPECTIVE: AUTHENTIC PRODUCT HUB + SEAMLESS ART
            ================================================================= */
            <motion.div
              key="student"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px] items-center p-6 sm:p-10 lg:p-12 gap-10"
            >
              {/* Left Column: High-Fidelity Interactive Student Academic Hub */}
              <div className="lg:col-span-7 w-full space-y-4 order-2 lg:order-1">
                
                {/* Product Frame Card */}
                <div className="rounded-2xl bg-[#101423]/95 border border-slate-700/80 shadow-2xl p-5 sm:p-6 space-y-5">
                  
                  {/* Window Bar */}
                  <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                      <span className="text-xs font-semibold text-slate-400 ml-2">
                        Student Portal • Academic Overview
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 text-[10px] font-mono font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-purple-400" />
                      Active Term: Fall 2026
                    </span>
                  </div>

                  {/* Student GPA & Honors Card */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-[#181329] to-[#12162A] border border-purple-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-purple-300 text-xs font-semibold">
                        <Award className="w-4 h-4 text-amber-400" />
                        <span>Dean&apos;s Honor List • Top 5% CSE</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-white tracking-tight">3.92</span>
                        <span className="text-xs text-slate-400">/ 4.00 Cumulative CGPA</span>
                      </div>
                      <p className="text-xs text-slate-300">
                        Sakib Ahmed (ID: 211-15-4424) • 4th Semester
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-left sm:text-right shrink-0">
                      <div className="p-2 rounded-lg bg-black/30 border border-white/5">
                        <span className="text-[10px] text-slate-400 block">Algorithms</span>
                        <span className="text-xs font-bold text-emerald-400 font-mono">A+ (94%)</span>
                      </div>
                      <div className="p-2 rounded-lg bg-black/30 border border-white/5">
                        <span className="text-[10px] text-slate-400 block">Databases</span>
                        <span className="text-xs font-bold text-blue-400 font-mono">A (88%)</span>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Class Routine Preview */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">Daily Class Routine</span>
                      
                      {/* Day Tabs */}
                      <div className="flex items-center gap-1 p-1 rounded-lg bg-[#0C101C] border border-slate-800">
                        {(["Mon", "Tue", "Wed", "Thu"] as const).map((day) => (
                          <button
                            key={day}
                            onClick={() => setActiveStudentDay(day)}
                            className={`px-2.5 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                              activeStudentDay === day
                                ? "bg-[#1D5BD8] text-white shadow-sm"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Routine Slots */}
                    <div className="space-y-2">
                      <div className="p-3 rounded-xl bg-[#141829] border border-blue-500/20 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-10 rounded-full bg-emerald-500" />
                          <div>
                            <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">
                              09:30 AM — Now In Session
                            </span>
                            <h5 className="text-xs font-bold text-white">
                              CSE-311: Software Engineering & Architecture
                            </h5>
                            <span className="text-[11px] text-slate-400">
                              Lab 402 • Prof. Asif Rahman
                            </span>
                          </div>
                        </div>
                        <span className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                          Room Confirmed
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-[#0F1322] border border-slate-800/80 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-10 rounded-full bg-slate-700" />
                          <div>
                            <span className="text-[10px] font-mono text-slate-400 uppercase">
                              11:30 AM — Next Up
                            </span>
                            <h5 className="text-xs font-bold text-slate-300">
                              CSE-215: Numerical Methods
                            </h5>
                            <span className="text-[11px] text-slate-400">
                              Room 502 • Dr. Farhana
                            </span>
                          </div>
                        </div>
                        <span className="px-2 py-1 rounded-md bg-slate-800 text-slate-400 text-[10px]">
                          18 Credits Enrolled
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Bottom Action Strip */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Check className="w-3.5 h-3.5 text-brand" />
                    <span>Real-time routine change alerts & verified graduation roadmap</span>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <ClickSpark sparkColor="#1D5BD8" sparkCount={8} sparkRadius={20}>
                      <button
                        onClick={() => {
                          if (onQuickDemoLogin) {
                            onQuickDemoLogin("student");
                          } else {
                            onOpenAuthModal("student", "signin");
                          }
                        }}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#1D5BD8] hover:bg-[#1548B0] text-white text-xs font-bold transition-all shadow-md shadow-[#1D5BD8]/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                      >
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>Sign In as Sakib Ahmed</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </ClickSpark>

                    <Link
                      href="/routine"
                      className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-all border border-slate-800"
                    >
                      Class Routine
                    </Link>
                  </div>
                </div>

              </div>

              {/* Right Column: Seamless Character Story Art (Blends organically into the canvas) */}
              <div className="lg:col-span-5 relative flex flex-col justify-center order-1 lg:order-2">
                <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] flex items-center justify-center">
                  {/* Subtle backglow behind the characters */}
                  <div className="absolute inset-0 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />

                  {/* Character Illustration with soft feathered edges to remove any box boundary */}
                  <div className="relative w-full h-full [mask-image:radial-gradient(ellipse_at_center,black_75%,transparent_100%)]">
                    <Image
                      src="/images/hero-students.png"
                      alt="High achieving university students"
                      fill
                      priority
                      className="object-contain object-right drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] select-none"
                      sizes="(max-width: 1024px) 100vw, 45vw"
                    />
                  </div>

                  {/* Authentic Anchored Badge (Anchored directly onto the visual base) */}
                  <div className="absolute bottom-2 right-2 sm:right-4 z-20 flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-[#171125]/90 backdrop-blur-xl border border-purple-500/30 shadow-xl">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Dean&apos;s Honors Cohort</p>
                      <p className="text-[10px] text-slate-400">Class of 2026 • Computer Science</p>
                    </div>
                  </div>
                </div>

                {/* Narrative Statement */}
                <div className="mt-4 space-y-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    From first semester to graduation day.
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Check your timetable on your walk to class, know what topics will appear in midterms with transparent syllabus tracking, and celebrate academic achievements.
                  </p>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* Human Editorial Footer Bar */}
        <div className="px-6 py-4 bg-[#070A12] border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-slate-300 font-medium">Real-Time University Campus Sync</span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="hidden sm:inline text-slate-400">Active Midterm Phase • Zero Clashes</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <button
              onClick={() => setActivePersona("faculty")}
              className={`transition-colors cursor-pointer ${
                activePersona === "faculty" ? "text-blue-400 font-bold" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Faculty Experience
            </button>
            <span className="text-slate-700">|</span>
            <button
              onClick={() => setActivePersona("student")}
              className={`transition-colors cursor-pointer ${
                activePersona === "student" ? "text-purple-400 font-bold" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Student Experience
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
