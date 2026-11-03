"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { executeThemeTransition } from "@/lib/themeTransition";
import { 
  GraduationCap, 
  Building2, 
  Crown, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Users, 
  Calendar, 
  Lock, 
  Mail, 
  User,
  Eye, 
  EyeOff, 
  Sun, 
  Moon, 
  ChevronRight, 
  Clock, 
  BookOpen, 
  Check, 
  Zap, 
  Quote, 
  Activity, 
  ArrowUpRight,
  Fingerprint,
  ChevronDown,
  Sparkles,
  BarChart3,
  Bell,
  X,
  LogIn,
  UserPlus
} from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { themeTokens } from "@/lib/theme";
import { INITIAL_DEPARTMENTS, ORDINAL_SEMESTERS } from "@/lib/mockData";
import SpotlightCard from "@/components/bits/SpotlightCard";
import BlurText from "@/components/bits/BlurText";
import CountUp from "@/components/bits/CountUp";
import FadeIn from "@/components/bits/FadeIn";
import ClickSpark from "@/components/bits/ClickSpark";
import DecryptedText from "@/components/bits/DecryptedText";
import RedSunHero from "@/components/landing/RedSunHero";

type RoleOption = "student" | "faculty" | "admin";
type AdminDeptOption = "super" | "dept-cse" | "dept-eee" | "dept-bba";
type AuthMode = "signin" | "register";

const STORY_CHAPTERS = [
  { id: "vision", name: "Prologue", label: "The Vision", icon: Sparkles },
  { id: "chapter-student", name: "Chapter 1", label: "Student Odyssey", icon: GraduationCap },
  { id: "chapter-faculty", name: "Chapter 2", label: "Faculty Calling", icon: Building2 },
  { id: "chapter-governance", name: "Chapter 3", label: "Governance Silo", icon: Crown },
  { id: "cta-climax", name: "Epilogue", label: "Access Portal", icon: Zap },
];

export default function StorytellingLandingPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { loginAsStudent, loginAsFaculty, loginAsAdmin, loginAsDeptAdmin } = useAdminAuth();

  // Modal Visibility & Mode State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("signin");

  // Sign In Form States
  const [selectedRole, setSelectedRole] = useState<RoleOption>("student");
  const [selectedAdminDept, setSelectedAdminDept] = useState<AdminDeptOption>("super");
  const [emailOrId, setEmailOrId] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Registration Form States
  const [regFullName, setRegFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regIdentifier, setRegIdentifier] = useState("");
  const [regDeptId, setRegDeptId] = useState(INITIAL_DEPARTMENTS[0]?.id || "dept-cse");
  const [regSemester, setRegSemester] = useState<string>(ORDINAL_SEMESTERS[0]);
  const [regPassword, setRegPassword] = useState("");
  const [regAgreed, setRegAgreed] = useState(false);
  const [regSubmitted, setRegSubmitted] = useState(false);
  
  // Storytelling scroll telemetry
  const [scrollPercent, setScrollPercent] = useState(0);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  // Scroll Telemetry Listener (throttled with requestAnimationFrame for performance)
  useEffect(() => {
    let rafId: number | null = null;
    
    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = window.innerHeight;
        const totalScrollable = scrollHeight - clientHeight;
        const progress = totalScrollable > 0 ? Math.min(100, Math.max(0, (scrollTop / totalScrollable) * 100)) : 0;
        setScrollPercent(progress);

        const ch1 = document.getElementById("chapter-student");
        const ch2 = document.getElementById("chapter-faculty");
        const ch3 = document.getElementById("chapter-governance");
        const climax = document.getElementById("cta-climax");

        const threshold = scrollTop + clientHeight * 0.45;

        if (climax && threshold >= climax.offsetTop) {
          setActiveChapterIndex(4);
        } else if (ch3 && threshold >= ch3.offsetTop) {
          setActiveChapterIndex(3);
        } else if (ch2 && threshold >= ch2.offsetTop) {
          setActiveChapterIndex(2);
        } else if (ch1 && threshold >= ch1.offsetTop) {
          setActiveChapterIndex(1);
        } else {
          setActiveChapterIndex(0);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Keyboard shortcut to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isAuthModalOpen) {
        setIsAuthModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAuthModalOpen]);

  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const openAuthModal = (role?: RoleOption, mode: AuthMode = "signin") => {
    if (role) {
      setSelectedRole(role);
    }
    setAuthMode(mode);
    setRegSubmitted(false);
    setIsAuthModalOpen(true);
  };

  const handleQuickDemoLogin = (role: "student" | "faculty") => {
    if (role === "faculty") {
      loginAsFaculty();
      router.push("/teacher/dashboard");
    } else {
      loginAsStudent();
      router.push("/dashboard");
    }
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);

    setTimeout(() => {
      if (selectedRole === "student") {
        loginAsStudent();
        router.push("/dashboard");
      } else if (selectedRole === "faculty") {
        loginAsFaculty();
        router.push("/teacher/dashboard");
      } else {
        if (selectedAdminDept === "super") {
          loginAsAdmin();
        } else {
          loginAsDeptAdmin(selectedAdminDept);
        }
        router.push("/admin/dashboard");
      }
    }, 450);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);

    setTimeout(() => {
      setIsAuthenticating(false);
      setRegSubmitted(true);
    }, 500);
  };

  const handleFillDemo = (role: RoleOption, dept: AdminDeptOption = "super") => {
    setSelectedRole(role);
    if (role === "student") {
      setEmailOrId("211-15-4424");
      setPassword("student123");
    } else if (role === "faculty") {
      setEmailOrId("asif.rahman@unicampus.edu");
      setPassword("faculty123");
    } else {
      setSelectedAdminDept(dept);
      if (dept === "super") {
        setEmailOrId("admin@unicampus.edu");
      } else {
        setEmailOrId(`${dept.replace("dept-", "")}.admin@unicampus.edu`);
      }
      setPassword("admin123");
    }
  };

  return (
    <div className={`min-h-screen ${themeTokens.canvas} text-slate-900 dark:text-[#F0F6FC] transition-colors selection:bg-brand selection:text-white relative`}>
      
      {/* =========================================================================
          LUMINOUS TOP SCROLL PROGRESS BAR (STORYTELLING SCROLL ANIMATION)
      ========================================================================= */}
      <div className="fixed top-0 left-0 right-0 h-1 z-[60] bg-slate-200/50 dark:bg-slate-800/50 pointer-events-none">
        <div 
          className="h-full bg-gradient-to-r from-brand via-[#38BDF8] to-blue-500 transition-[width] duration-150 ease-out shadow-[0_0_12px_rgba(29, 91, 216,0.7)]"
          style={{ width: `${scrollPercent}%` }}
        />
      </div>


      {/* =========================================================================
          ACT 0: TOP NAVIGATION & BRAND CANOPY
      ========================================================================= */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-[#0D1117]/85 border-b border-slate-200/80 dark:border-[#30363D] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo with live status indicator */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand to-[#38BDF8] flex items-center justify-center text-white font-black text-xl shadow-md shadow-brand/20 group-hover:scale-105 transition-transform">
              U
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-[#F0F6FC]">
                  UniCampus
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand/10 text-brand border border-brand/20 font-bold">
                  v1.2 Cloud
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-[#6E747D] hidden sm:block">
                Academic Operating System
              </p>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-[#8D96A0]">
            <button 
              onClick={() => scrollToSection("vision")}
              className={`transition-colors cursor-pointer ${activeChapterIndex === 0 ? "text-brand font-bold" : "hover:text-brand dark:hover:text-[#F0F6FC]"}`}
            >
              The Vision
            </button>
            <button 
              onClick={() => scrollToSection("chapter-student")}
              className={`transition-colors cursor-pointer ${activeChapterIndex === 1 ? "text-brand font-bold" : "hover:text-brand dark:hover:text-[#F0F6FC]"}`}
            >
              Student Story
            </button>
            <button 
              onClick={() => scrollToSection("chapter-faculty")}
              className={`transition-colors cursor-pointer ${activeChapterIndex === 2 ? "text-brand font-bold" : "hover:text-brand dark:hover:text-[#F0F6FC]"}`}
            >
              Faculty Story
            </button>
            <button 
              onClick={() => scrollToSection("chapter-governance")}
              className={`transition-colors cursor-pointer ${activeChapterIndex === 3 ? "text-brand font-bold" : "hover:text-brand dark:hover:text-[#F0F6FC]"}`}
            >
              Governance
            </button>
            <Link href="/teachers" className="hover:text-brand dark:hover:text-[#F0F6FC] transition-colors flex items-center gap-1">
              <span>Faculty Directory</span>
              <ArrowUpRight className="w-3 h-3 text-slate-400" />
            </Link>
          </nav>

          {/* Action CTAs & Theme Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => executeThemeTransition({
                theme: theme === "dark" ? "light" : "dark",
                event: e,
                setTheme,
                currentTheme: theme,
              })}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-[#30363D] bg-white dark:bg-[#161B22] text-slate-700 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              title="Toggle theme (Press 'T')"
              aria-label="Toggle dark/light theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Access Portal Button - Opens Login/Register Modal */}
            <ClickSpark sparkColor="#1D5BD8" sparkCount={8} sparkRadius={22}>
              <button
                onClick={() => openAuthModal()}
                className="px-4 py-2 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-bold shadow-sm shadow-brand/25 transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Access Portal</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </ClickSpark>
          </div>
        </div>
      </header>

      {/* =========================================================================
          REDSUN-GRADE 3D SCROLLING HERO SECTION (ECLIPSE & SOLAR LIGHTING)
      ========================================================================= */}
      <RedSunHero
        onOpenAuthModal={openAuthModal}
        onQuickDemoLogin={handleQuickDemoLogin}
      />

      {/* =========================================================================
          ACT II: THE THREE JOURNEYS (SCROLL-DRIVEN STORYTELLING PANELS)
      ========================================================================= */}
      <section className="py-24 border-y border-slate-200/80 dark:border-[#30363D] bg-slate-50/50 dark:bg-[#080C10] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-xs font-mono font-bold tracking-widest text-brand uppercase mb-2 inline-block">
              Three Personas • One Synchronized Campus
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-[#F0F6FC] tracking-tight">
              The Campus Story in Three Chapters
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-[#8D96A0] mt-3">
              Scroll through each narrative to experience daily campus life through the eyes of our students, educators, and institutional deans.
            </p>
          </div>

          <div className="space-y-24">
            
            {/* CHAPTER 1: THE STUDENT ODYSSEY */}
            <motion.div 
              id="chapter-student"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className={`p-6 sm:p-10 rounded-3xl ${themeTokens.surface} border ${themeTokens.border} shadow-xl relative overflow-hidden`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-mono font-bold">
                    <GraduationCap className="w-3.5 h-3.5" />
                    Chapter 01 • The Scholar
                  </div>
                  
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F0F6FC] tracking-tight leading-tight">
                    The Student Odyssey: From First Day to Senior Capstone
                  </h3>
                  
                  <p className="text-sm text-slate-600 dark:text-[#8D96A0] leading-relaxed">
                    At 09:15 AM, students glance at their digital routine. Classroom reallocations, lab syllabus completions, and direct mentorship queries happen seamlessly with zero administrative friction.
                  </p>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-xs text-slate-700 dark:text-[#C9D1D9]">
                        <strong>Real-time Class Timetables:</strong> Instant notifications on room shifts, teacher substitutions, and make-up classes.
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-xs text-slate-700 dark:text-[#C9D1D9]">
                        <strong>Visual Syllabus Progress:</strong> Transparent completion rings so scholars know exactly what topic is coming in midterms.
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-xs text-slate-700 dark:text-[#C9D1D9]">
                        <strong>Encrypted Faculty Messaging:</strong> Fast consultation channels without compromising personal phone privacy.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center gap-4">
                    <button
                      onClick={() => openAuthModal("student")}
                      className="px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-bold shadow-md shadow-brand/20 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <span>Access Student Portal</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs text-slate-400">Class schedule, progress & grades</span>
                  </div>
                </div>

                <div className="lg:col-span-6">
                  <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-[#161B22] border border-slate-200/80 dark:border-[#30363D] shadow-inner space-y-4">
                    {/* Visual Story Header */}
                    <div className="relative w-full h-44 sm:h-52 rounded-xl overflow-hidden bg-gradient-to-r from-[#0A162D] to-[#0A1224] border border-blue-500/20 group shadow-md">
                      <Image
                        src="/images/hero-students.png"
                        alt="UniCampus Scholars Journey"
                        fill
                        className="object-cover object-right group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 1024px) 100vw, 45vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A1224] via-[#0A1224]/30 to-transparent pointer-events-none" />
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                        <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-mono text-sky-300 border border-blue-500/30">
                          Academic Sprint Active
                        </span>
                        <span className="text-[10px] text-slate-300 font-mono">
                          Term GPA: 3.92 • Dean&apos;s Honor List
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#21262D]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-3 h-3 rounded-full bg-rose-400" />
                        <div className="w-3 h-3 rounded-full bg-amber-400" />
                        <div className="w-3 h-3 rounded-full bg-emerald-400" />
                        <span className="text-xs font-mono font-bold text-slate-600 dark:text-[#8D96A0] ml-2">
                          Student Portal • Live Feed
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold">
                        Connected
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono font-bold text-brand uppercase">Today&apos;s Lecture • 09:30 AM</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
                          Active Now
                        </span>
                      </div>
                      <p className="text-sm font-bold text-slate-900 dark:text-[#F0F6FC]">
                        CSE-311: Software Engineering & Architecture
                      </p>
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#8D96A0]">
                        <span>Room: Lab 402 (Block B)</span>
                        <span>Prof. Asif Rahman</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-[#F0F6FC]">
                        <span>Syllabus Velocity (CSE-211)</span>
                        <span className="font-mono text-brand">78%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-[#21262D] overflow-hidden">
                        <div className="h-full bg-brand rounded-full transition-all duration-1000" style={{ width: "78%" }} />
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-[#F0F6FC]">Attendance Logged</p>
                          <p className="text-[10px] text-slate-500 dark:text-[#6E747D]">09:32 AM • Lab 402 Biometric Terminal</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-emerald-600">Present</span>
                    </div>

                  </div>
                </div>
              </div>
            </motion.div>

            {/* CHAPTER 2: THE FACULTY'S CALLING */}
            <motion.div 
              id="chapter-faculty"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className={`p-6 sm:p-10 rounded-3xl ${themeTokens.surface} border ${themeTokens.border} shadow-xl relative overflow-hidden`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-mono font-bold">
                    <Building2 className="w-3.5 h-3.5" />
                    Chapter 02 • Academic Craft
                  </div>
                  
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F0F6FC] tracking-tight leading-tight">
                    The Faculty Workshop: Mentorship Over Bureaucracy
                  </h3>
                  
                  <p className="text-sm text-slate-600 dark:text-[#8D96A0] leading-relaxed">
                    Faculty members walk into the lecture theatre with complete control. Biometric roll calls compile in seconds, marks sync into continuous gradebooks, and class announcements reach every student immediately.
                  </p>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-xs text-slate-700 dark:text-[#C9D1D9]">
                        <strong>10-Second Attendance Punch:</strong> Automated QR and biometric roll-calls that eliminate paper logs.
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-xs text-slate-700 dark:text-[#C9D1D9]">
                        <strong>Live Continuous Gradebook:</strong> Midterms and lab marks sync with academic transcripts in real time.
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-xs text-slate-700 dark:text-[#C9D1D9]">
                        <strong>Public Faculty Profile:</strong> Showcase published research papers, office consultation slots, and direct links.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center gap-4">
                    <button
                      onClick={() => openAuthModal("faculty")}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <span>Access Faculty Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs text-slate-400">Attendance, grading & syllabus</span>
                  </div>
                </div>

                <div className="lg:col-span-6">
                  <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-[#161B22] border border-slate-200/80 dark:border-[#30363D] shadow-inner space-y-4">
                    {/* Visual Story Header */}
                    <div className="relative w-full h-44 sm:h-52 rounded-xl overflow-hidden bg-gradient-to-r from-[#141829] to-[#0F1424] border border-blue-500/20 group shadow-md">
                      <Image
                        src="/images/hero-faculty.png"
                        alt="UniCampus Faculty Lecture Management"
                        fill
                        className="object-cover object-left group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 1024px) 100vw, 45vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0F1424] via-[#0F1424]/30 to-transparent pointer-events-none" />
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                        <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-mono text-blue-300 border border-blue-500/30">
                          Biometric Terminal Active
                        </span>
                        <span className="text-[10px] text-slate-300 font-mono">
                          Prof. Asif Rahman • CSE-311 (Lab 402)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#21262D]">
                      <div className="flex items-center gap-2.5">
                        <Fingerprint className="w-4 h-4 text-blue-500" />
                        <span className="text-xs font-mono font-bold text-slate-600 dark:text-[#8D96A0]">
                          Faculty Console • Biometrics Scanner
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 font-bold">
                        Sync Active
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-500 dark:text-[#6E747D]">Class Roll Call (CSE-311)</p>
                        <p className="text-xl font-black text-slate-900 dark:text-[#F0F6FC]">42 / 45 Present</p>
                        <p className="text-[10px] text-emerald-500 font-bold mt-0.5">93.3% Attendance Rate</p>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                        <Fingerprint className="w-7 h-7" />
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-[#F0F6FC]">
                        <span>Midterm Marks Ledger</span>
                        <span className="text-[10px] font-mono text-emerald-500">Auto-Submitted</span>
                      </div>
                      <div className="text-xs text-slate-600 dark:text-[#8D96A0] flex items-center justify-between">
                        <span>Sakib Ahmed (211-15-4424)</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-[#F0F6FC]">28.5 / 30.0</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                          <Bell className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-[#F0F6FC]">Lab Submission Deadline Extended</p>
                          <p className="text-[10px] text-slate-500 dark:text-[#6E747D]">Broadcasted to 45 enrolled students</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-[#161B22] text-slate-500">Sent</span>
                    </div>

                  </div>
                </div>
              </div>
            </motion.div>

            {/* CHAPTER 3: INSTITUTIONAL GOVERNANCE */}
            <motion.div 
              id="chapter-governance"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className={`p-6 sm:p-10 rounded-3xl ${themeTokens.surface} border ${themeTokens.border} shadow-xl relative overflow-hidden`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand dark:text-[#60A5FA] text-xs font-mono font-bold">
                    <Crown className="w-3.5 h-3.5" />
                    Chapter 03 • Governance
                  </div>
                  
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F0F6FC] tracking-tight leading-tight">
                    The Institutional Sovereign: Hardware-Isolated Governance
                  </h3>
                  
                  <p className="text-sm text-slate-600 dark:text-[#8D96A0] leading-relaxed">
                    Security cannot be compromised. Deans in Computer Science, Electrical Engineering, and Business Administration govern within strict departmental boundaries, while Central Administration oversees financial velocity, teacher wage ledgers, and emergency notices.
                  </p>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-brand/10 text-brand flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-xs text-slate-700 dark:text-[#C9D1D9]">
                        <strong>Department Scope Isolation:</strong> CSE admins cannot alter EEE grades or inspect external payroll records.
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-brand/10 text-brand flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-xs text-slate-700 dark:text-[#C9D1D9]">
                        <strong>Teacher Wage Ledger:</strong> Automated calculation of monthly salaries, extra lecture stipends, and audit trails.
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-brand/10 text-brand flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-xs text-slate-700 dark:text-[#C9D1D9]">
                        <strong>Central Audit Trace:</strong> Immutable record keeping for institutional accreditation and ministry compliance.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center gap-4">
                    <button
                      onClick={() => openAuthModal("admin")}
                      className="px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-bold shadow-md shadow-brand/20 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <span>Access Admin Console</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs text-slate-400">Department silos & central audits</span>
                  </div>
                </div>

                <div className="lg:col-span-6">
                  <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-[#161B22] border border-slate-200/80 dark:border-[#30363D] shadow-inner space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#21262D]">
                      <div className="flex items-center gap-2.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-brand" />
                        <span className="text-xs font-mono font-bold text-slate-600 dark:text-[#8D96A0]">
                          Central Governance Console
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand/10 text-brand font-bold">
                        Hardware Quarantined
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] space-y-2">
                      <span className="text-[11px] font-mono font-bold text-slate-500 uppercase">Department Partition Scope</span>
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="p-2 rounded-lg bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40">
                          <p className="font-bold text-brand dark:text-[#60A5FA]">CSE</p>
                          <p className="text-[10px] text-slate-500">3,420 Enrolled</p>
                        </div>
                        <div className="p-2 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40">
                          <p className="font-bold text-emerald-700 dark:text-emerald-300">EEE</p>
                          <p className="text-[10px] text-slate-500">2,100 Enrolled</p>
                        </div>
                        <div className="p-2 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40">
                          <p className="font-bold text-amber-700 dark:text-amber-300">BBA</p>
                          <p className="text-[10px] text-slate-500">1,850 Enrolled</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-500 dark:text-[#6E747D]">Faculty Payroll Disbursed</p>
                        <p className="text-lg font-black text-slate-900 dark:text-[#F0F6FC]">$142,800.00</p>
                        <p className="text-[10px] text-emerald-500 font-bold">100% Reconciled Across Faculties</p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand dark:text-[#60A5FA] flex items-center justify-center">
                        <BarChart3 className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-brand/10 text-brand flex items-center justify-center">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-[#F0F6FC]">Security Audit Log #2026-09</p>
                          <p className="text-[10px] text-slate-500 dark:text-[#6E747D]">Zero security breaches recorded</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold">Passed</span>
                    </div>

                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          ACT III: QUANTITATIVE IMPACT (LIVE UNIVERSITY METRICS WITH COUNTUP)
      ========================================================================= */}
      <section id="metrics" className="py-20 bg-white dark:bg-[#0D1117] border-b border-slate-200/80 dark:border-[#30363D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 text-center">
            
            <div className="p-4 sm:p-6 rounded-2xl bg-slate-50/70 dark:bg-[#161B22]/50 border border-slate-100 dark:border-[#21262D]">
              <div className="text-2xl sm:text-4xl lg:text-5xl font-black text-brand tracking-tight mb-1">
                <CountUp to={12850} separator="," duration={1.2} suffix="+" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-[#F0F6FC]">
                Enrolled Scholars
              </p>
              <p className="text-[11px] text-slate-500 dark:text-[#6E747D] mt-0.5">
                Undergraduate & Masters
              </p>
            </div>

            <div className="p-4 sm:p-6 rounded-2xl bg-slate-50/70 dark:bg-[#161B22]/50 border border-slate-100 dark:border-[#21262D]">
              <div className="text-2xl sm:text-4xl lg:text-5xl font-black text-blue-600 dark:text-blue-400 tracking-tight mb-1">
                <CountUp to={340} duration={1} suffix="+" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-[#F0F6FC]">
                Faculty & Researchers
              </p>
              <p className="text-[11px] text-slate-500 dark:text-[#6E747D] mt-0.5">
                PhDs, Professors & Deans
              </p>
            </div>

            <div className="p-4 sm:p-6 rounded-2xl bg-slate-50/70 dark:bg-[#161B22]/50 border border-slate-100 dark:border-[#21262D]">
              <div className="text-2xl sm:text-4xl lg:text-5xl font-black text-brand dark:text-[#60A5FA] tracking-tight mb-1">
                <CountUp to={48} duration={0.8} />
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-[#F0F6FC]">
                Accredited Programs
              </p>
              <p className="text-[11px] text-slate-500 dark:text-[#6E747D] mt-0.5">
                Across 6 Faculties
              </p>
            </div>

            <div className="p-4 sm:p-6 rounded-2xl bg-slate-50/70 dark:bg-[#161B22]/50 border border-slate-100 dark:border-[#21262D]">
              <div className="text-2xl sm:text-4xl lg:text-5xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight mb-1">
                <CountUp to={99.98} decimals={2} duration={1.1} suffix="%" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-[#F0F6FC]">
                Cloud ERP Availability
              </p>
              <p className="text-[11px] text-slate-500 dark:text-[#6E747D] mt-0.5">
                Dhaka DC High-Availability
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          ACT IV: THE CLIMAX CALL-TO-ACTION (CLEAN NARRATIVE STRIP)
      ========================================================================= */}
      <section id="cta-climax" className="py-24 md:py-32 relative overflow-hidden bg-gradient-to-b from-transparent via-brand/5 to-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-mono font-bold uppercase tracking-wider mb-4">
            <Zap className="w-3.5 h-3.5 text-brand animate-pulse" />
            Your Academic Chapter Awaits
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-[#F0F6FC] tracking-tight mb-6">
            Ready to Enter the Campus Cloud?
          </h2>

          <p className="text-base sm:text-lg text-slate-600 dark:text-[#8D96A0] max-w-xl mx-auto leading-relaxed mb-10">
            Join 12,850+ scholars, dedicated professors, and administrative leaders across all 6 faculties. Select your designated role to enter.
          </p>

          {/* Primary CTA Triggering the Role Modal */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={() => openAuthModal(undefined, "signin")}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-brand hover:bg-brand-hover text-white text-base font-bold shadow-xl shadow-brand/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2.5 cursor-pointer group"
            >
              <LogIn className="w-5 h-5" />
              <span>Sign In to Portal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => openAuthModal(undefined, "register")}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-[#161B22] hover:bg-slate-50 dark:hover:bg-[#21262D] border border-slate-200 dark:border-[#30363D] text-slate-800 dark:text-[#F0F6FC] text-base font-bold shadow-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <UserPlus className="w-5 h-5 text-brand" />
              <span>Create New Account</span>
            </button>
          </div>

          {/* 3 Generic Role Access Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
            <button
              onClick={() => openAuthModal("student", "signin")}
              className="p-3.5 rounded-2xl bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] hover:border-brand/50 transition-all flex items-center gap-3 text-left cursor-pointer group shadow-sm"
            >
              <div className="w-9 h-9 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-[#F0F6FC]">Student Portal</p>
                <p className="text-[10px] text-slate-500">Undergraduate & Graduate</p>
              </div>
            </button>

            <button
              onClick={() => openAuthModal("faculty", "signin")}
              className="p-3.5 rounded-2xl bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] hover:border-blue-500/50 transition-all flex items-center gap-3 text-left cursor-pointer group shadow-sm"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-[#F0F6FC]">Faculty Workspace</p>
                <p className="text-[10px] text-slate-500">Professors & Mentors</p>
              </div>
            </button>

            <button
              onClick={() => openAuthModal("admin", "signin")}
              className="p-3.5 rounded-2xl bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] hover:border-brand/50 transition-all flex items-center gap-3 text-left cursor-pointer group shadow-sm"
            >
              <div className="w-9 h-9 rounded-xl bg-brand/10 text-brand dark:text-[#60A5FA] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Crown className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-[#F0F6FC]">Admin Console</p>
                <p className="text-[10px] text-slate-500">Deans & Leadership</p>
              </div>
            </button>
          </div>

        </div>
      </section>

      {/* =========================================================================
          ACT V: CAMPUS VOICES & TESTIMONIALS
      ========================================================================= */}
      <section className="py-20 bg-slate-50/60 dark:bg-[#080C10] border-t border-slate-200/80 dark:border-[#30363D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold tracking-widest text-brand uppercase mb-2 inline-block">
              Living Voices
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-[#F0F6FC] tracking-tight">
              From Those Who Learn & Lead
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className={`p-6 rounded-3xl ${themeTokens.surface} border ${themeTokens.border} flex flex-col justify-between shadow-sm`}>
              <div className="mb-4">
                <Quote className="w-6 h-6 text-brand/40 mb-3" />
                <p className="text-xs sm:text-sm text-slate-700 dark:text-[#C9D1D9] leading-relaxed italic">
                  &ldquo;The real-time routine and syllabus tracker completely changed how I plan my semester. I never have to hunt for classroom changes or midterm notices.&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-[#21262D]">
                <div className="w-9 h-9 rounded-full bg-brand/10 text-brand font-bold flex items-center justify-center text-xs">
                  SA
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-[#F0F6FC]">Sakib Ahmed</p>
                  <p className="text-[10px] text-slate-500 dark:text-[#6E747D]">4th Sem CSE Scholar</p>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-3xl ${themeTokens.surface} border ${themeTokens.border} flex flex-col justify-between shadow-sm`}>
              <div className="mb-4">
                <Quote className="w-6 h-6 text-blue-500/40 mb-3" />
                <p className="text-xs sm:text-sm text-slate-700 dark:text-[#C9D1D9] leading-relaxed italic">
                  &ldquo;Taking attendance in 10 seconds and having grade records instantly synchronized gives us back countless hours for student mentorship and departmental research.&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-[#21262D]">
                <div className="w-9 h-9 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-xs">
                  AR
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-[#F0F6FC]">Dr. Asif Rahman</p>
                  <p className="text-[10px] text-slate-500 dark:text-[#6E747D]">Professor & Head of Computer Science</p>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-3xl ${themeTokens.surface} border ${themeTokens.border} flex flex-col justify-between shadow-sm`}>
              <div className="mb-4">
                <Quote className="w-6 h-6 text-brand/40 mb-3" />
                <p className="text-xs sm:text-sm text-slate-700 dark:text-[#C9D1D9] leading-relaxed italic">
                  &ldquo;The granular role segregation ensures departmental autonomy while preserving institutional audit trails. Central governance has never been this transparent.&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-[#21262D]">
                <div className="w-9 h-9 rounded-full bg-brand/10 text-brand dark:text-[#60A5FA] font-bold flex items-center justify-center text-xs">
                  SH
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-[#F0F6FC]">Dr. Shahriar Hossain</p>
                  <p className="text-[10px] text-slate-500 dark:text-[#6E747D]">Central University Administration</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          ACT VI: INSTITUTIONAL FOOTER
      ========================================================================= */}
      <footer className="border-t border-slate-200 dark:border-[#30363D] bg-white dark:bg-[#0D1117] py-12 text-slate-600 dark:text-[#8D96A0] text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            
            <div className="col-span-2">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-7 h-7 rounded-xl bg-brand text-white flex items-center justify-center font-bold text-sm">
                  U
                </div>
                <span className="font-extrabold text-sm text-slate-900 dark:text-[#F0F6FC]">UniCampus Cloud</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-[#6E747D] max-w-sm leading-relaxed mb-4">
                The unified academic and governance engine for higher education. Built with zero-trust role segregation, instant biometric synchronization, and cloud resilience.
              </p>
              <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>All Campus Services Operational</span>
              </div>
            </div>

            <div>
              <p className="font-bold text-slate-900 dark:text-[#F0F6FC] uppercase tracking-wider text-[11px] mb-3">
                Role Portals
              </p>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => openAuthModal("student", "signin")} className="hover:text-brand dark:hover:text-[#F0F6FC] cursor-pointer">
                    Student Portal
                  </button>
                </li>
                <li>
                  <button onClick={() => openAuthModal("faculty", "signin")} className="hover:text-brand dark:hover:text-[#F0F6FC] cursor-pointer">
                    Faculty Workspace
                  </button>
                </li>
                <li>
                  <button onClick={() => openAuthModal("admin", "signin")} className="hover:text-brand dark:hover:text-[#F0F6FC] cursor-pointer">
                    Central Admin Console
                  </button>
                </li>
                <li>
                  <button onClick={() => openAuthModal(undefined, "register")} className="hover:text-brand dark:hover:text-[#F0F6FC] cursor-pointer">
                    Account Registration
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-bold text-slate-900 dark:text-[#F0F6FC] uppercase tracking-wider text-[11px] mb-3">
                Public Directories
              </p>
              <ul className="space-y-2">
                <li>
                  <Link href="/teachers" className="hover:text-brand dark:hover:text-[#F0F6FC]">
                    Faculty Directory
                  </Link>
                </li>
                <li>
                  <Link href="/students" className="hover:text-brand dark:hover:text-[#F0F6FC]">
                    Student Roster
                  </Link>
                </li>
                <li>
                  <Link href="/routine" className="hover:text-brand dark:hover:text-[#F0F6FC]">
                    Class Timetables
                  </Link>
                </li>
                <li>
                  <Link href="/notices" className="hover:text-brand dark:hover:text-[#F0F6FC]">
                    Notice Board
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-bold text-slate-900 dark:text-[#F0F6FC] uppercase tracking-wider text-[11px] mb-3">
                System
              </p>
              <ul className="space-y-2">
                <li>
                  <Link href="/splash" className="hover:text-brand dark:hover:text-[#F0F6FC]">
                    System Simulator
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        window.dispatchEvent(new CustomEvent("open-command-palette"));
                      }
                    }} 
                    className="hover:text-brand dark:hover:text-[#F0F6FC] cursor-pointer"
                  >
                    Command Palette (Ctrl+K)
                  </button>
                </li>
                <li>
                  <span className="text-slate-400 dark:text-[#6E747D]">
                    Shortcut Keys (Press &lsquo;?&rsquo;)
                  </span>
                </li>
                <li>
                  <span className="text-slate-400 dark:text-[#6E747D]">
                    Theme Switch (Press &lsquo;T&rsquo;)
                  </span>
                </li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-100 dark:border-[#21262D] flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 dark:text-[#6E747D] gap-4">
            <p>
              &copy; 2026 UniCampus Systems Inc. • ISO 27001 Certified • All Rights Reserved.
            </p>
            <div className="flex items-center gap-4">
              <span>Dhaka DC Node 01</span>
              <span>•</span>
              <span>Next.js 16 + React 19 Engine</span>
            </div>
          </div>
        </div>
      </footer>

      {/* =========================================================================
          ACTUAL AUTHENTIC LOGIN & REGISTRATION MODAL
          - Clean, generic form with Sign In & Registration tabs
          - User inputs their own email/ID and password
          - Role switcher for Student, Faculty, and Admin
      ========================================================================= */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsAuthModalOpen(false)}
              className="fixed inset-0 bg-slate-950/80 dark:bg-[#010409]/85 backdrop-blur-md"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={`w-full max-w-xl max-h-[92vh] overflow-y-auto ${themeTokens.surface} border ${themeTokens.border} rounded-3xl sm:rounded-[36px] shadow-2xl relative z-10 p-6 sm:p-9 [scrollbar-gutter:stable]`}
            >
              {/* Modal Close Button */}
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#161B22] transition-colors cursor-pointer"
                title="Close dialog (Esc)"
                aria-label="Close dialog (Esc)"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Top Mode Tabs: Sign In vs Create Account */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-[#21262D] mb-6 pr-10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand to-[#38BDF8] flex items-center justify-center text-white font-black text-sm shadow-sm">
                    U
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-[#F0F6FC] tracking-tight">
                      UniCampus Portal
                    </h3>
                    <p className="text-[10px] text-slate-500 font-mono">Secure Access Gateway</p>
                  </div>
                </div>

                {/* Segmented Switcher */}
                <div className="p-1 rounded-xl bg-slate-100 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] flex items-center">
                  <button
                    type="button"
                    onClick={() => { setAuthMode("signin"); setRegSubmitted(false); }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      authMode === "signin"
                        ? "bg-white dark:bg-[#0D1117] text-slate-900 dark:text-[#F0F6FC] shadow-sm"
                        : "text-slate-500 hover:text-slate-800 dark:hover:text-[#F0F6FC]"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAuthMode("register"); setRegSubmitted(false); }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      authMode === "register"
                        ? "bg-white dark:bg-[#0D1117] text-slate-900 dark:text-[#F0F6FC] shadow-sm"
                        : "text-slate-500 hover:text-slate-800 dark:hover:text-[#F0F6FC]"
                    }`}
                  >
                    Register
                  </button>
                </div>
              </div>

              {/* Role Segmented Track */}
              <div className="mb-6">
                <label className="block text-[11px] font-bold text-slate-500 dark:text-[#8D96A0] uppercase tracking-wider mb-2">
                  Select Your University Role
                </label>
                <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D]">
                  
                  {/* Student Tab */}
                  <ClickSpark sparkColor="#1D5BD8" sparkCount={6} sparkRadius={18}>
                    <button
                      type="button"
                      onClick={() => setSelectedRole("student")}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        selectedRole === "student"
                          ? "bg-brand text-white shadow-sm"
                          : "text-slate-600 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <GraduationCap className="w-4 h-4 shrink-0" />
                      <span>Student</span>
                    </button>
                  </ClickSpark>

                  {/* Faculty Tab */}
                  <ClickSpark sparkColor="#1D5BD8" sparkCount={6} sparkRadius={18}>
                    <button
                      type="button"
                      onClick={() => setSelectedRole("faculty")}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        selectedRole === "faculty"
                          ? "bg-brand text-white shadow-sm"
                          : "text-slate-600 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <Building2 className="w-4 h-4 shrink-0" />
                      <span>Faculty</span>
                    </button>
                  </ClickSpark>

                  {/* Admin Tab */}
                  <ClickSpark sparkColor="#1D5BD8" sparkCount={6} sparkRadius={18}>
                    <button
                      type="button"
                      onClick={() => setSelectedRole("admin")}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        selectedRole === "admin"
                          ? "bg-brand text-white shadow-sm"
                          : "text-slate-600 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <Crown className="w-4 h-4 shrink-0" />
                      <span>Admin</span>
                    </button>
                  </ClickSpark>

                </div>
              </div>

              {/* ===============================================================
                  MODE A: ACTUAL SIGN IN FORM
              =============================================================== */}
              {authMode === "signin" ? (
                <form onSubmit={handleSignIn} className="space-y-4">
                  
                  {/* If Admin Role: Clean Scope Selector */}
                  {selectedRole === "admin" && (
                    <div className="p-3 rounded-2xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-500/20 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold text-blue-700 dark:text-blue-300">
                        <span>Select Administrative Level</span>
                        <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded bg-blue-500/10">Scope Gate</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedAdminDept("super")}
                          className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all border cursor-pointer ${
                            selectedAdminDept === "super"
                              ? "bg-brand text-white border-brand shadow-sm"
                              : "bg-white dark:bg-[#161B22] border-slate-200 dark:border-[#30363D] text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          Super Admin
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedAdminDept("dept-cse")}
                          className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all border cursor-pointer ${
                            selectedAdminDept === "dept-cse"
                              ? "bg-brand text-white border-brand shadow-sm"
                              : "bg-white dark:bg-[#161B22] border-slate-200 dark:border-[#30363D] text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          CSE Dept
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedAdminDept("dept-eee")}
                          className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all border cursor-pointer ${
                            selectedAdminDept === "dept-eee"
                              ? "bg-emerald-600 text-white border-emerald-700 shadow-sm"
                              : "bg-white dark:bg-[#161B22] border-slate-200 dark:border-[#30363D] text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          EEE Dept
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedAdminDept("dept-bba")}
                          className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all border cursor-pointer ${
                            selectedAdminDept === "dept-bba"
                              ? "bg-amber-600 text-white border-amber-700 shadow-sm"
                              : "bg-white dark:bg-[#161B22] border-slate-200 dark:border-[#30363D] text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          BBA Dept
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Identifier Input */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-[#8D96A0] uppercase tracking-wider mb-1.5">
                      {selectedRole === "student" ? "Student ID or Institutional Email" : "Institutional Email Address"}
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-[#6E747D]" />
                      <input
                        type="text"
                        value={emailOrId}
                        onChange={(e) => setEmailOrId(e.target.value)}
                        required
                        placeholder={
                          selectedRole === "student"
                            ? "e.g. 211-15-4424 or name@unicampus.edu"
                            : selectedRole === "faculty"
                            ? "e.g. professor@unicampus.edu"
                            : "e.g. admin@unicampus.edu"
                        }
                        className={`w-full pl-10 pr-3.5 py-3 rounded-2xl text-xs sm:text-sm font-semibold ${themeTokens.input}`}
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-[#8D96A0] uppercase tracking-wider">
                        Password
                      </label>
                      <Link href="/login" className="text-[11px] text-brand hover:underline font-medium">
                        Forgot Password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-[#6E747D]" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Enter your account password"
                        className={`w-full pl-10 pr-10 py-3 rounded-2xl text-xs sm:text-sm font-semibold ${themeTokens.input}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-1 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-[#F0F6FC] cursor-pointer"
                        title={showPassword ? "Hide password" : "Show password"}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me Checkbox */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-[#8D96A0] cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 dark:border-[#30363D] text-brand focus:ring-brand"
                      />
                      <span>Remember this device</span>
                    </label>
                    <span className="text-[11px] font-mono text-emerald-500 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Fall 2026 Session
                    </span>
                  </div>

                  {/* Submit Button */}
                  <ClickSpark 
                    sparkColor={
                      selectedRole === "student"
                        ? "#1D5BD8"
                        : selectedRole === "faculty"
                        ? "#2563eb"
                        : "#9333ea"
                    } 
                    sparkCount={10} 
                    sparkRadius={24}
                  >
                    <button
                      type="submit"
                      disabled={isAuthenticating}
                      className={`w-full py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2.5 transition-all text-sm text-white shadow-xl mt-4 cursor-pointer active:scale-[0.99] ${
                        isAuthenticating ? "opacity-75 cursor-wait" : ""
                      } bg-brand hover:bg-brand-hover shadow-brand/25`}
                    >
                      {isAuthenticating ? (
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Verifying Credentials & Entering Portal...</span>
                        </div>
                      ) : (
                        <>
                          <span>
                            {selectedRole === "student"
                              ? "Sign In to Student Portal"
                              : selectedRole === "faculty"
                              ? "Sign In to Faculty Workspace"
                              : selectedAdminDept === "super"
                              ? "Sign In as Central Administrator"
                              : `Sign In as ${selectedAdminDept.replace("dept-", "").toUpperCase()} Admin`}
                          </span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </ClickSpark>

                  {/* Subtle Demo Quick-Fill Bar */}
                  <div className="pt-4 border-t border-slate-100 dark:border-[#21262D] flex items-center justify-between text-[11px] text-slate-500">
                    <span className="text-slate-400">Quick demo fill:</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleFillDemo("student")}
                        className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 dark:bg-[#161B22] dark:hover:bg-[#21262D] text-brand font-medium cursor-pointer"
                      >
                        Student
                      </button>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={() => handleFillDemo("faculty")}
                        className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 dark:bg-[#161B22] dark:hover:bg-[#21262D] text-blue-600 dark:text-blue-400 font-medium cursor-pointer"
                      >
                        Faculty
                      </button>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={() => handleFillDemo("admin", "super")}
                        className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 dark:bg-[#161B22] dark:hover:bg-[#21262D] text-brand dark:text-[#60A5FA] font-medium cursor-pointer"
                      >
                        Super Admin
                      </button>
                    </div>
                  </div>

                </form>
              ) : (
                /* ===============================================================
                    MODE B: ACTUAL REGISTRATION FORM
                =============================================================== */
                regSubmitted ? (
                  <div className="py-8 text-center space-y-4">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 dark:text-[#F0F6FC]">
                      Registration Submitted
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-[#8D96A0] max-w-sm mx-auto leading-relaxed">
                      Your institutional profile for <strong>{regFullName}</strong> ({regEmail}) has been created. Awaiting administrative clearance from your departmental dean.
                    </p>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setAuthMode("signin")}
                        className="px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-bold shadow-md cursor-pointer"
                      >
                        Proceed to Sign In
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleRegister} className="space-y-3.5">
                    
                    {/* Full Name */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-[#8D96A0] uppercase tracking-wider mb-1">
                        Full Legal Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-[#6E747D]" />
                        <input
                          type="text"
                          value={regFullName}
                          onChange={(e) => setRegFullName(e.target.value)}
                          required
                          placeholder="e.g. Sarah Jenkins"
                          className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold ${themeTokens.input}`}
                        />
                      </div>
                    </div>

                    {/* Academic Email */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-[#8D96A0] uppercase tracking-wider mb-1">
                        Academic / Institutional Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-[#6E747D]" />
                        <input
                          type="email"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          required
                          placeholder="e.g. sarah.jenkins@unicampus.edu"
                          className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold ${themeTokens.input}`}
                        />
                      </div>
                    </div>

                    {/* Department & Identifier Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-[#8D96A0] uppercase tracking-wider mb-1">
                          Academic Department
                        </label>
                        <select
                          value={regDeptId}
                          onChange={(e) => setRegDeptId(e.target.value)}
                          className={`w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold ${themeTokens.select}`}
                        >
                          {INITIAL_DEPARTMENTS.map((dept) => (
                            <option key={dept.id} value={dept.id}>
                              {dept.name} ({dept.code})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-[#8D96A0] uppercase tracking-wider mb-1">
                          {selectedRole === "student" ? "Student ID" : selectedRole === "faculty" ? "Teacher Code" : "Staff ID"}
                        </label>
                        <input
                          type="text"
                          value={regIdentifier}
                          onChange={(e) => setRegIdentifier(e.target.value)}
                          required
                          placeholder={
                            selectedRole === "student"
                              ? "e.g. 222-15-5501"
                              : selectedRole === "faculty"
                              ? "e.g. T-CSE-09"
                              : "e.g. ADM-009"
                          }
                          className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold ${themeTokens.input}`}
                        />
                      </div>
                    </div>

                    {/* Semester (if Student) */}
                    {selectedRole === "student" && (
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-[#8D96A0] uppercase tracking-wider mb-1">
                          Current Semester
                        </label>
                        <select
                          value={regSemester}
                          onChange={(e) => setRegSemester(e.target.value)}
                          className={`w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold ${themeTokens.select}`}
                        >
                          {ORDINAL_SEMESTERS.map((sem) => (
                            <option key={sem} value={sem}>
                              {sem}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Password */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-[#8D96A0] uppercase tracking-wider mb-1">
                        Create Secure Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-[#6E747D]" />
                        <input
                          type="password"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          required
                          placeholder="At least 8 characters with numbers & symbols"
                          className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold ${themeTokens.input}`}
                        />
                      </div>
                    </div>

                    {/* Acceptable Policy Checkbox */}
                    <div className="pt-1">
                      <label className="flex items-start gap-2 text-xs text-slate-600 dark:text-[#8D96A0] cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={regAgreed}
                          onChange={(e) => setRegAgreed(e.target.checked)}
                          required
                          className="w-4 h-4 rounded border-slate-300 dark:border-[#30363D] text-brand focus:ring-brand mt-0.5 shrink-0"
                        />
                        <span>I accept the University Acceptable Cloud Use Policy & Data Privacy Charter</span>
                      </label>
                    </div>

                    {/* Submit Registration Button */}
                    <button
                      type="submit"
                      disabled={isAuthenticating || !regAgreed}
                      className={`w-full py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2.5 transition-all text-sm text-white shadow-xl mt-4 cursor-pointer active:scale-[0.99] ${
                        isAuthenticating || !regAgreed ? "opacity-60 cursor-not-allowed" : "bg-brand hover:bg-brand-hover shadow-brand/25"
                      }`}
                    >
                      {isAuthenticating ? (
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Submitting Registration Request...</span>
                        </div>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          <span>Submit Registration & Request Access</span>
                        </>
                      )}
                    </button>

                  </form>
                )
              )}

              {/* Bottom Switcher Note */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-[#21262D] text-center text-xs text-slate-500">
                {authMode === "signin" ? (
                  <p>
                    Don&apos;t have an account yet?{" "}
                    <button
                      type="button"
                      onClick={() => { setAuthMode("register"); setRegSubmitted(false); }}
                      className="text-brand font-bold hover:underline cursor-pointer"
                    >
                      Create account
                    </button>
                  </p>
                ) : (
                  <p>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setAuthMode("signin")}
                      className="text-brand font-bold hover:underline cursor-pointer"
                    >
                      Sign In
                    </button>
                  </p>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
