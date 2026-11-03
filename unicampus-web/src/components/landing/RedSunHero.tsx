"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { 
  Building2, 
  GraduationCap, 
  ArrowRight, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  ChevronDown
} from "lucide-react";

interface RedSunHeroProps {
  onOpenAuthModal: (role?: "student" | "faculty" | "admin", mode?: "signin" | "register") => void;
  onQuickDemoLogin?: (role: "student" | "faculty") => void;
}

type PersonaTab = "faculty" | "student";

export default function RedSunHero({
  onOpenAuthModal,
  onQuickDemoLogin,
}: RedSunHeroProps) {
  const [activeTab, setActiveTab] = useState<PersonaTab>("faculty");
  const [attendanceCount, setAttendanceCount] = useState(42);
  const [justPunched, setJustPunched] = useState(false);
  const [selectedDay, setSelectedDay] = useState<"Mon" | "Tue" | "Wed" | "Thu">("Mon");

  const heroTrackRef = useRef<HTMLDivElement>(null);

  // Exact Webflow Continuous Scroll Physics from RedSun (Hero Home V1 Animation a-41)
  const { scrollYProgress } = useScroll({
    target: heroTrackRef,
    offset: ["start start", "end end"],
  });

  // 1. 3D Perspective Rotation:
  // Starts at 32deg (tilted back into 3D space), smoothly flattens to 0deg at 50% scroll!
  const rotateX = useTransform(scrollYProgress, [0, 0.5], [32, 0]);

  // 2. 3D Scale:
  // Starts at 0.90, smoothly scales up to 1.05 to fill viewport!
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.90, 1.05]);

  // 3. Vertical Y Translation:
  // Moves from 80px down to -30px (lifting into center stage as header departs):
  const appTranslateY = useTransform(scrollYProgress, [0, 0.5], [80, -30]);

  // 4. Hero Content Header (Badge, Headline, Subtitle, Buttons):
  // Fades and translates up smoothly:
  const headerOpacity = useTransform(scrollYProgress, [0, 0.38], [1, 0]);
  const headerY = useTransform(scrollYProgress, [0, 0.38], [0, -75]);
  const headerScale = useTransform(scrollYProgress, [0, 0.38], [1, 0.92]);

  // 5. Signature Concentric Royal Blue Celestial Portal Expansion:
  const portalScale = useTransform(scrollYProgress, [0, 0.55], [1, 1.45]);
  const portalOpacity = useTransform(scrollYProgress, [0, 0.55], [0.65, 1]);

  // 6. Floating Glass Cards Depth Parallax:
  const floatCardLeftY = useTransform(scrollYProgress, [0, 0.5], [0, -45]);
  const floatCardRightY = useTransform(scrollYProgress, [0, 0.5], [0, -35]);

  // 7. Scroll Hint indicator fades out quickly:
  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  const handleDemoPunch = () => {
    if (justPunched) return;
    setJustPunched(true);
    setAttendanceCount((prev) => (prev >= 45 ? 42 : prev + 1));
    setTimeout(() => setJustPunched(false), 2000);
  };

  return (
    <div id="vision" className="relative bg-[#F0F4FA] dark:bg-[#060A14] text-[#0A192F] dark:text-[#F0F6FC] transition-colors">
      
      {/* =========================================================================
          CONTINUOUS 3D SCROLL TRACK (DEDICATED STICKY STAGE)
      ========================================================================= */}
      <div 
        ref={heroTrackRef}
        className="relative h-[220vh] w-full"
      >
        {/* Sticky Viewport Container */}
        <div className="sticky top-0 h-screen w-full flex flex-col justify-between overflow-hidden pt-6 sm:pt-8 pb-3 sm:pb-5">
          
          {/* =======================================================================
              SIGNATURE CONCENTRIC ROYAL BLUE PORTAL (USER SLIDE 1 & SLIDE 4 REFERENCE)
              Light mode: Elegant, clean sky-cobalt rings with subtle depth
              Dark mode: Neon glow + deep navy translucent portal
          ======================================================================= */}
          <motion.div 
            style={{ scale: portalScale, opacity: portalOpacity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] pointer-events-none -z-10 flex items-center justify-center"
          >
            {/* Ambient Outer Halo */}
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(29,91,216,0.08)_0%,rgba(56,189,248,0.03)_45%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(29,91,216,0.32)_0%,rgba(15,50,119,0.18)_42%,transparent_74%)] blur-[50px] dark:blur-[95px]" />
            
            {/* Outer Disc — clean subtle gradient in light, deep navy glow in dark */}
            <div className="absolute w-[800px] h-[800px] rounded-full border border-[#1D5BD8]/20 bg-gradient-to-b from-[#1D5BD8]/[0.05] via-[#38BDF8]/[0.02] to-transparent shadow-[0_0_60px_rgba(29,91,216,0.06)] dark:border-blue-500/25 dark:bg-gradient-to-b dark:from-[#133E92]/30 dark:via-[#0A1D40]/20 dark:to-transparent dark:shadow-[0_0_120px_rgba(29,91,216,0.25)]" />
            
            {/* Mid Ring — crisp cobalt boundary */}
            <div className="absolute w-[640px] h-[640px] rounded-full border-2 border-[#1D5BD8]/30 bg-[radial-gradient(circle,rgba(29,91,216,0.06)_0%,rgba(56,189,248,0.02)_60%,transparent_100%)] shadow-[0_0_40px_rgba(29,91,216,0.08)] dark:border-[#1D5BD8]/40 dark:bg-[radial-gradient(circle,rgba(29,91,216,0.24)_0%,rgba(13,43,96,0.14)_60%,transparent_100%)] dark:shadow-[0_0_90px_rgba(29,91,216,0.40)]" />
            
            {/* Inner Rim — luminous cyan accent */}
            <div className="absolute w-[470px] h-[470px] rounded-full border border-[#1D5BD8]/30 dark:border-sky-400/60 shadow-[0_0_30px_rgba(56,189,248,0.15)] dark:shadow-[0_0_60px_rgba(56,189,248,0.45),inset_0_0_40px_rgba(29,91,216,0.30)]" />
          </motion.div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center relative z-10 flex flex-col items-center justify-between h-full py-1">
            
            {/* =====================================================================
                HERO CONTENT — CLEAN, SPACIOUS, HUMAN-CRAFTED
            ===================================================================== */}
            <motion.div 
              style={{ opacity: headerOpacity, y: headerY, scale: headerScale }}
              className="flex flex-col items-center shrink-0 w-full pt-4 sm:pt-8"
            >
              {/* Master Display Headline */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-3xl mx-auto"
              >
                <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-black tracking-tight font-serif text-[#0A192F] dark:text-white leading-[1.04]">
                  UniCampus
                </h1>
              </motion.div>

              {/* Subtitle — lighter weight, generous spacing */}
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-lg text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed font-normal"
              >
                One platform for <span className="font-semibold text-slate-800 dark:text-slate-200">students</span>, <span className="font-semibold text-slate-800 dark:text-slate-200">teachers</span>, and <span className="font-semibold text-slate-800 dark:text-slate-200">administration</span> — academic records, attendance, and campus intelligence in one place.
              </motion.p>

              {/* CTA Buttons — ample top margin */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center justify-center gap-3.5 mt-6 sm:mt-8"
              >
                <button
                  onClick={() => onOpenAuthModal(undefined, "signin")}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 sm:px-7 sm:py-3 rounded-2xl bg-gradient-to-r from-[#1D5BD8] via-[#2162E6] to-[#2563EB] text-white text-xs sm:text-sm font-bold shadow-[0_8px_25px_rgba(29,91,216,0.35)] hover:shadow-[0_12px_32px_rgba(29,91,216,0.50)] hover:scale-105 transition-all duration-300 active:scale-95 cursor-pointer border border-blue-400/40"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    const target = document.getElementById("chapter-student");
                    if (target) target.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="group flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-2xl bg-white/90 hover:bg-white dark:bg-white/[0.08] dark:hover:bg-white/[0.16] text-slate-800 hover:text-[#1D5BD8] dark:text-slate-100 dark:hover:text-white text-xs sm:text-sm font-semibold border border-slate-200/90 hover:border-[#1D5BD8]/40 dark:border-white/15 dark:hover:border-white/30 shadow-xs hover:shadow-md hover:shadow-blue-500/10 dark:shadow-none hover:scale-105 transition-all duration-300 active:scale-95 cursor-pointer backdrop-blur-md"
                >
                  <span>Explore Platform</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1D5BD8] dark:group-hover:text-white transition-colors" />
                </button>
              </motion.div>
            </motion.div>

            {/* =====================================================================
                3D PERSPECTIVE APP HOLDER (ANIMATES ON SCROLL - REDSUN PHYSICS)
            ===================================================================== */}
            <div className="w-full relative [perspective:1400px] flex-1 flex items-center justify-center max-w-5xl">
              
              {/* Floating Glass Tile A (Top Right): Slide 1 Sta Charts / Gradebook */}
              <motion.div
                style={{ y: floatCardRightY }}
                className="hidden lg:flex absolute -top-8 -right-8 z-30 flex-col gap-1 p-3.5 rounded-2xl bg-white/90 dark:bg-[#0B1528]/90 backdrop-blur-2xl border border-white/95 dark:border-blue-500/30 shadow-[0_16px_36px_rgba(29,91,216,0.18)] max-w-[210px] text-left"
              >
                <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                  <span className="font-semibold uppercase tracking-wider">Sta charts</span>
                  <span className="font-bold text-emerald-500">+14.8%</span>
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  Academic Standing
                </p>
                {/* Mini SVG Trend Curve */}
                <svg className="w-full h-8 mt-1 text-[#1D5BD8]" viewBox="0 0 100 30" fill="none">
                  <path 
                    d="M0 24 Q 25 15, 50 18 T 100 4" 
                    stroke="currentColor" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                  />
                  <circle cx="100" cy="4" r="3" fill="#38BDF8" />
                </svg>
              </motion.div>

              {/* Floating Glass Tile B (Top Left): Live Verification Pill */}
              <motion.div
                style={{ y: floatCardLeftY }}
                className="hidden lg:flex absolute -top-6 -left-8 z-30 items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/90 dark:bg-[#0B1528]/90 backdrop-blur-2xl border border-white/95 dark:border-blue-500/30 shadow-[0_16px_36px_rgba(29,91,216,0.18)] text-left"
              >
                <div className="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Biometrics Live</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">42 / 45 Present Synced</p>
                </div>
              </motion.div>

              <motion.div
                style={{ 
                  rotateX, 
                  scale, 
                  y: appTranslateY,
                  transformStyle: "preserve-3d" 
                }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="w-full rounded-2xl sm:rounded-3xl bg-white/95 dark:bg-[#0A1222]/95 border border-white/95 dark:border-blue-500/30 p-2 sm:p-3.5 backdrop-blur-2xl shadow-[0_30px_100px_-20px_rgba(29,91,216,0.22),0_10px_30px_-10px_rgba(0,0,0,0.08)] dark:shadow-[0_30px_100px_-20px_rgba(0,0,0,0.95),inset_0_24px_48px_rgba(56,189,248,0.06)] hover:border-[#1D5BD8]/50 transition-colors"
              >
                
                {/* Window Top Chrome (macOS / Webflow Style) */}
                <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 border-b border-slate-200/80 dark:border-white/10 bg-slate-100/90 dark:bg-[#070D18] rounded-t-xl sm:rounded-t-2xl">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 ml-2 hidden sm:inline">
                      https://unicampus.edu/live-portal
                    </span>
                  </div>

                  {/* Persona Switcher Tabs inside the OS window */}
                  <div className="flex items-center p-1 rounded-xl bg-white/90 dark:bg-[#111A2D] border border-slate-200 dark:border-white/10 shadow-inner">
                    <button
                      onClick={() => setActiveTab("faculty")}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        activeTab === "faculty"
                          ? "bg-[#1D5BD8] text-white shadow-sm shadow-[#1D5BD8]/40"
                          : "text-slate-600 dark:text-slate-400 hover:text-[#1D5BD8] dark:hover:text-white"
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Faculty Console</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("student")}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        activeTab === "student"
                          ? "bg-[#1D5BD8] text-white shadow-sm shadow-[#1D5BD8]/40"
                          : "text-slate-600 dark:text-slate-400 hover:text-[#1D5BD8] dark:hover:text-white"
                      }`}
                    >
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>Student Hub</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-500 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="hidden sm:inline">Fall 2026 Live</span>
                  </div>
                </div>

                {/* Living Campus Content Area */}
                <div className="p-3 sm:p-6 bg-[#F8FAFC]/95 dark:bg-[#070C16] rounded-b-xl sm:rounded-b-2xl relative overflow-hidden">
                  <AnimatePresence mode="wait">
                    {activeTab === "faculty" ? (
                      /* =========================================================
                         FACULTY COMMAND PERSPECTIVE (Dr. Asif Rahman & 3D Art)
                      ========================================================= */
                      <motion.div
                        key="faculty-view"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.25 }}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center text-left"
                      >
                        {/* Left: 3D Faculty Mentor Artwork Seamlessly Blended */}
                        <div className="lg:col-span-6 relative flex flex-col items-center justify-center min-h-[260px] sm:min-h-[340px]">
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(29,91,216,0.18)_0%,transparent_70%)] pointer-events-none" />
                          
                          {/* Feathered image canvas with ZERO box border */}
                          <div className="relative w-full h-[250px] sm:h-[320px] [mask-image:radial-gradient(ellipse_at_center,black_75%,transparent_100%)]">
                            <Image
                              src="/images/hero-faculty.png"
                              alt="Faculty Professor Mentoring"
                              fill
                              priority
                              className="object-contain object-left select-none drop-shadow-[0_20px_40px_rgba(0,0,0,0.45)] dark:drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)]"
                              sizes="(max-width: 1024px) 100vw, 45vw"
                            />
                          </div>

                          {/* Faculty Profile Pill */}
                          <div className="absolute bottom-1 left-2 z-20 flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/95 dark:bg-[#0D1524]/90 backdrop-blur-xl border border-[#1D5BD8]/30 shadow-[0_8px_20px_rgba(29,91,216,0.15)]">
                            <div className="w-7 h-7 rounded-lg bg-[#1D5BD8]/15 text-[#1D5BD8] dark:text-[#60A5FA] flex items-center justify-center">
                              <Building2 className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900 dark:text-white">Dr. Asif Rahman</p>
                              <p className="text-[9px] text-slate-500 dark:text-slate-400">Head of Computer Science & Engineering</p>
                            </div>
                          </div>
                        </div>

                        {/* Right: High-Fidelity Faculty Workspace Panel */}
                        <div className="lg:col-span-6 space-y-3.5">
                          
                          {/* Active Session Card */}
                          <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-[#0D1628] border border-slate-200 dark:border-white/10 shadow-sm space-y-2.5">
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-1.5 text-[#1D5BD8] dark:text-[#60A5FA] font-semibold text-xs">
                                <Clock className="w-3 h-3" />
                                <span>09:30 AM — 11:00 AM</span>
                              </div>
                              <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-bold">
                                In Session
                              </span>
                            </div>

                            <div>
                              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">
                                CSE-311: Software Architecture
                              </h3>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                <span>Lab 402 • Academic Block B</span>
                              </p>
                            </div>

                            {/* Syllabus Velocity */}
                            <div className="space-y-1 pt-1">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-slate-500 dark:text-slate-400">Syllabus Progress</span>
                                <span className="font-bold text-[#1D5BD8] dark:text-[#60A5FA]">84% Milestone</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-200 dark:bg-[#162238] rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-[#1D5BD8] to-[#38BDF8] rounded-full w-[84%]" />
                              </div>
                            </div>
                          </div>

                          {/* Interactive Biometric Attendance Module */}
                          <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-[#0D1628] border border-slate-200 dark:border-white/10 shadow-sm flex items-center justify-between gap-3">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Biometric Roll Call</span>
                                {justPunched && (
                                  <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                                    +1 Checked In!
                                  </span>
                                )}
                              </div>
                              <p className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                                {attendanceCount} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">/ 45 Present</span>
                              </p>
                            </div>

                            <button
                              onClick={handleDemoPunch}
                              className="px-3.5 py-2 rounded-xl bg-[#1D5BD8]/10 hover:bg-[#1D5BD8]/20 dark:bg-white/10 dark:hover:bg-white/15 text-[#1D5BD8] dark:text-[#60A5FA] border border-[#1D5BD8]/30 shadow-xs text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                              <span>Test Roll Call</span>
                            </button>
                          </div>

                          {/* Action Buttons */}
                          <div className="pt-1 flex items-center gap-3">
                            <button
                              onClick={() => {
                                if (onQuickDemoLogin) {
                                  onQuickDemoLogin("faculty");
                                } else {
                                  onOpenAuthModal("faculty", "signin");
                                }
                              }}
                              className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#1D5BD8] to-[#2563EB] hover:from-[#1548B0] hover:to-[#1D5BD8] text-white text-xs font-bold shadow-md shadow-[#1D5BD8]/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                            >
                              <Building2 className="w-3.5 h-3.5" />
                              <span>Sign In (Dr. Asif Rahman)</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>

                            <Link
                              href="/teachers"
                              className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all border border-slate-200 dark:border-white/10"
                            >
                              Directory
                            </Link>
                          </div>

                        </div>
                      </motion.div>
                    ) : (
                      /* =========================================================
                         STUDENT ODYSSEY PERSPECTIVE (Sakib Ahmed & Dean's Cohort)
                      ========================================================= */
                      <motion.div
                        key="student-view"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.25 }}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center text-left"
                      >
                        {/* Left: High-Fidelity Student Academic Hub */}
                        <div className="lg:col-span-6 space-y-3.5 order-2 lg:order-1">
                          
                          {/* GPA & Honors Card */}
                          <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-[#0D1628] border border-slate-200 dark:border-white/10 shadow-sm space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                Sakib Ahmed (ID: 211-15-4424)
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-blue-500/15 text-[#1D5BD8] dark:text-[#60A5FA] border border-blue-500/30 text-[10px] font-mono font-bold">
                                4th Semester
                              </span>
                            </div>

                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">3.92</span>
                              <span className="text-xs text-slate-500 dark:text-slate-400">/ 4.00 Cumulative CGPA</span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="p-2 rounded-lg bg-slate-50 dark:bg-[#142036] border border-slate-200 dark:border-white/5">
                                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Algorithms</span>
                                <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-xs">A+ (94%)</span>
                              </div>
                              <div className="p-2 rounded-lg bg-slate-50 dark:bg-[#142036] border border-slate-200 dark:border-white/5">
                                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Databases</span>
                                <span className="font-bold text-[#1D5BD8] dark:text-[#60A5FA] font-mono text-xs">A (88%)</span>
                              </div>
                            </div>
                          </div>

                          {/* Daily Class Routine Card */}
                          <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-[#0D1628] border border-slate-200 dark:border-white/10 shadow-sm space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Class Timetable</span>
                              <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-100 dark:bg-[#142036] border border-slate-200 dark:border-white/5">
                                {(["Mon", "Tue", "Wed", "Thu"] as const).map((day) => (
                                  <button
                                    key={day}
                                    onClick={() => setSelectedDay(day)}
                                    className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all cursor-pointer ${
                                      selectedDay === day
                                        ? "bg-[#1D5BD8] text-white shadow-xs"
                                        : "text-slate-500 dark:text-slate-400 hover:text-[#1D5BD8] dark:hover:text-white"
                                    }`}
                                  >
                                    {day}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#142036] border border-slate-200 dark:border-white/5 flex items-center justify-between">
                              <div>
                                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 block uppercase font-bold">
                                  09:30 AM — In Session
                                </span>
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                  CSE-311: Software Architecture
                                </h4>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400">Lab 402 • Block B</span>
                              </div>
                              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                                Room Verified
                              </span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="pt-1 flex items-center gap-3">
                            <button
                              onClick={() => {
                                if (onQuickDemoLogin) {
                                  onQuickDemoLogin("student");
                                } else {
                                  onOpenAuthModal("student", "signin");
                                }
                              }}
                              className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#1D5BD8] to-[#2563EB] hover:from-[#1548B0] hover:to-[#1D5BD8] text-white text-xs font-bold shadow-md shadow-[#1D5BD8]/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                            >
                              <GraduationCap className="w-3.5 h-3.5" />
                              <span>Sign In (Sakib Ahmed)</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>

                            <Link
                              href="/routine"
                              className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all border border-slate-200 dark:border-white/10"
                            >
                              Routine
                            </Link>
                          </div>

                        </div>

                        {/* Right: 3D Student Achievers Artwork Seamlessly Blended */}
                        <div className="lg:col-span-6 relative flex flex-col items-center justify-center min-h-[260px] sm:min-h-[340px] order-1 lg:order-2">
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.18)_0%,transparent_70%)] pointer-events-none" />
                          
                          {/* Feathered image canvas with ZERO box border */}
                          <div className="relative w-full h-[250px] sm:h-[320px] [mask-image:radial-gradient(ellipse_at_center,black_75%,transparent_100%)]">
                            <Image
                              src="/images/hero-students.png"
                              alt="High achieving university students"
                              fill
                              priority
                              className="object-contain object-right select-none drop-shadow-[0_20px_40px_rgba(0,0,0,0.45)] dark:drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)]"
                              sizes="(max-width: 1024px) 100vw, 45vw"
                            />
                          </div>

                          {/* Student Honors Pill */}
                          <div className="absolute bottom-1 right-2 z-20 flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/95 dark:bg-[#0D1524]/90 backdrop-blur-xl border border-[#1D5BD8]/30 shadow-[0_8px_20px_rgba(29,91,216,0.15)]">
                            <div className="w-7 h-7 rounded-lg bg-[#1D5BD8]/15 text-[#1D5BD8] dark:text-[#60A5FA] flex items-center justify-center">
                              <GraduationCap className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900 dark:text-white">Dean&apos;s Honors Cohort</p>
                              <p className="text-[9px] text-slate-500 dark:text-slate-400">Class of 2026 • Computer Science</p>
                            </div>
                          </div>
                        </div>

                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </motion.div>
            </div>

            {/* =====================================================================
                SCROLL HINT PILL (FADES OUT AS USER SCROLLS DOWN)
            ===================================================================== */}
            <motion.div 
              style={{ opacity: scrollHintOpacity }}
              className="flex items-center gap-2 text-[11px] font-mono text-slate-500 dark:text-slate-400 animate-bounce cursor-pointer mt-1"
              onClick={() => {
                window.scrollBy({ top: window.innerHeight * 0.8, behavior: "smooth" });
              }}
            >
              <span className="uppercase tracking-widest text-[#1D5BD8] dark:text-[#60A5FA] font-semibold">Scroll to rotate 3D canvas</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#1D5BD8]" />
            </motion.div>

          </div>
        </div>
      </div>

      {/* =========================================================================
          REDSUN SIGNATURE 4-METRIC FEATURE GRID (SCROLLS IN CLEANLY AFTER 3D STAGE)
      ========================================================================= */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-left">
          
          <div className="p-5 sm:p-6 rounded-2xl bg-white/80 dark:bg-[#0B1528] border border-[#1D5BD8]/20 shadow-[0_10px_30px_rgba(29,91,216,0.06),inset_0_-8px_24px_rgba(29,91,216,0.08)] hover:border-[#1D5BD8]/50 transition-colors">
            <span className="text-[10px] font-mono text-[#1D5BD8] dark:text-[#60A5FA] uppercase tracking-wider block mb-1 font-bold">
              Scholars
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              12,850+
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Undergraduate & Masters enrolled
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-white/80 dark:bg-[#0B1528] border border-[#1D5BD8]/20 shadow-[0_10px_30px_rgba(29,91,216,0.06),inset_0_-8px_24px_rgba(29,91,216,0.08)] hover:border-[#1D5BD8]/50 transition-colors">
            <span className="text-[10px] font-mono text-[#1D5BD8] dark:text-[#60A5FA] uppercase tracking-wider block mb-1 font-bold">
              Faculty
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              340+
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Professors, PhDs & Researchers
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-white/80 dark:bg-[#0B1528] border border-[#1D5BD8]/20 shadow-[0_10px_30px_rgba(29,91,216,0.06),inset_0_-8px_24px_rgba(29,91,216,0.08)] hover:border-[#1D5BD8]/50 transition-colors">
            <span className="text-[10px] font-mono text-[#1D5BD8] dark:text-[#60A5FA] uppercase tracking-wider block mb-1 font-bold">
              Biometrics
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              98.4%
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Automated roll-call compliance
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-white/80 dark:bg-[#0B1528] border border-[#1D5BD8]/20 shadow-[0_10px_30px_rgba(29,91,216,0.06),inset_0_-8px_24px_rgba(29,91,216,0.08)] hover:border-[#1D5BD8]/50 transition-colors">
            <span className="text-[10px] font-mono text-[#1D5BD8] dark:text-[#60A5FA] uppercase tracking-wider block mb-1 font-bold">
              Cloud Uptime
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              99.98%
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Dhaka DC High-Availability
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}