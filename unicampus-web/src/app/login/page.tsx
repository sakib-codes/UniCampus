"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowRight, 
  Lock, 
  Mail, 
  GraduationCap, 
  Building2, 
  Crown, 
  ShieldCheck, 
  Check, 
  X, 
  LifeBuoy, 
  Copy, 
  Eye, 
  EyeOff, 
  Sun, 
  Moon, 
  HelpCircle, 
  Laptop, 
  CheckCircle2,
  Sparkles,
  Compass
} from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useTheme } from "next-themes";
import { executeThemeTransition } from "@/lib/themeTransition";
import { SubtleAuroraBackground } from "@/components/common/SubtleAuroraBackground";

type PortalType = "student" | "faculty" | "admin";
type AdminDeptOption = "super" | "dept-cse" | "dept-eee" | "dept-bba";

interface RoleDetails {
  title: string;
  label: string;
  placeholder: string;
  defaultId: string;
  destination: string;
  badge: string;
  btnLabel: string;
  helpText: string;
}

const ROLE_CONFIGS: Record<PortalType, RoleDetails> = {
  student: {
    title: "Student Portal",
    label: "University ID or Institutional Email",
    placeholder: "211-15-4424 or student@unicampus.edu",
    defaultId: "211-15-4424",
    destination: "/",
    badge: "UNDERGRADUATE",
    btnLabel: "Sign In as Student",
    helpText: "Need help activating your student ID? Contact IT Helpdesk (Ext. 404)"
  },
  faculty: {
    title: "Faculty Workspace",
    label: "Faculty ID or Academic Email",
    placeholder: "FAC-1042 or asif.rahman@unicampus.edu",
    defaultId: "asif.rahman@unicampus.edu",
    destination: "/teacher/dashboard",
    badge: "FACULTY / PROFESSOR",
    btnLabel: "Sign In to Faculty Portal",
    helpText: "Faculty 2FA token or department PIN required for first session"
  },
  admin: {
    title: "Administrative Console",
    label: "System Admin Identifier / Root Auth",
    placeholder: "ADM-00104 or admin@unicampus.edu",
    defaultId: "admin@unicampus.edu",
    destination: "/admin/dashboard",
    badge: "SUPERADMIN & RBAC",
    btnLabel: "Access Superadmin Console",
    helpText: "Hardware security key (FIDO2 / YubiKey) authentication supported"
  }
};

export default function LoginPage() {
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();
  const { loginAsStudent, loginAsFaculty, loginAsAdmin, loginAsDeptAdmin } = useAdminAuth();

  const [activePortal, setActivePortal] = useState<PortalType>("student");
  const [selectedAdminDept, setSelectedAdminDept] = useState<AdminDeptOption>("super");
  const [emailOrId, setEmailOrId] = useState(ROLE_CONFIGS.student.defaultId);
  const [password, setPassword] = useState("SuperScholar2026!");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handlePortalSwitch = (portal: PortalType) => {
    setActivePortal(portal);
    setIsSuccess(false);
    if (portal === "student") {
      setEmailOrId(ROLE_CONFIGS.student.defaultId);
    } else if (portal === "faculty") {
      setEmailOrId(ROLE_CONFIGS.faculty.defaultId);
    } else {
      if (selectedAdminDept === "super") {
        setEmailOrId("admin@unicampus.edu");
      } else {
        setEmailOrId(`${selectedAdminDept.replace("dept-", "")}.admin@unicampus.edu`);
      }
    }
  };

  const handleAdminDeptSelect = (dept: AdminDeptOption) => {
    setSelectedAdminDept(dept);
    if (dept === "super") {
      setEmailOrId("admin@unicampus.edu");
    } else {
      setEmailOrId(`${dept.replace("dept-", "")}.admin@unicampus.edu`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);

      setTimeout(() => {
        if (activePortal === "student") {
          loginAsStudent();
          router.push("/");
        } else if (activePortal === "faculty") {
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
      }, 400);
    }, 600);
  };

  const handleSSOLogin = (provider: "google" | "microsoft") => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        if (activePortal === "student") {
          loginAsStudent();
          router.push("/");
        } else if (activePortal === "faculty") {
          loginAsFaculty();
          router.push("/teacher/dashboard");
        } else {
          loginAsAdmin();
          router.push("/admin/dashboard");
        }
      }, 400);
    }, 700);
  };

  const currentConfig = ROLE_CONFIGS[activePortal];

  return (
    <div className="min-h-screen bg-[#E2E7EE] dark:bg-[#070A12] text-[#111827] dark:text-[#F0F6FC] font-sans antialiased relative overflow-x-hidden selection:bg-[#1D5BD8]/20 selection:text-[#1D5BD8] flex flex-col justify-between transition-colors duration-300">
      
      {/* Organic Colorful Aurora Background (Zero Grid Lines) */}
      <SubtleAuroraBackground />

      {/* Top Frosted System Bar */}
      <header className="relative z-10 w-full px-6 sm:px-8 py-3.5 flex items-center justify-between border-b border-white/60 dark:border-white/10 backdrop-blur-xl bg-white/30 dark:bg-[#0D131F]/40 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        {/* Top-Left: Brand / OS telemetry Pill */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white/70 dark:bg-[#0D131F]/70 backdrop-blur-2xl border border-white/90 dark:border-white/15 shadow-[0_2px_8px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,1)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.12)]">
            <span className="w-2 h-2 rounded-full bg-[#1D5BD8] dark:bg-[#2563EB] shadow-[0_0_8px_rgba(29, 91, 216,0.6)]"></span>
            <span className="font-mono text-xs font-bold tracking-wider text-[#1E252D] dark:text-[#F0F6FC] uppercase">UNICAMPUS</span>
            <span className="text-[#94A3B8] dark:text-[#64748B]">•</span>
            <span className="font-mono text-xs text-[#64748B] dark:text-[#8D96A0] font-medium">ACADEMIC OS V4.2</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 font-mono text-xs text-[#64748B] dark:text-[#8D96A0]">
            <span>GATEWAY:</span>
            <span className="text-[#1E252D] dark:text-[#F0F6FC] font-semibold">/login</span>
            <span className="text-[#CBD5E1] dark:text-[#475569]">•</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              NODE_PROD_OK
            </span>
          </div>
        </div>

        {/* Top-Right: Operational Status & Glass Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white/70 dark:bg-[#0D131F]/70 backdrop-blur-2xl border border-white/90 dark:border-white/15 shadow-[0_2px_8px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,1)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.12)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-xs font-bold text-emerald-800 dark:text-emerald-300">System Status: Operational</span>
          </div>

          {/* Theme Toggle Button */}
          <button 
            type="button" 
            onClick={(e) => executeThemeTransition({
              theme: resolvedTheme === "dark" ? "light" : "dark",
              event: e,
              setTheme,
              currentTheme: resolvedTheme,
            })}
            title="Toggle theme mode"
            aria-label="Toggle theme mode" 
            className="w-9 h-9 rounded-2xl bg-white/70 dark:bg-[#0D131F]/70 backdrop-blur-2xl border border-white/90 dark:border-white/15 flex items-center justify-center text-[#4B5563] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F0F6FC] hover:bg-white dark:hover:bg-[#1A2234] transition shadow-[0_2px_8px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,1)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.12)] cursor-pointer"
          >
            {resolvedTheme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-[#64748B]" />
            )}
          </button>

          {/* Helpdesk Icon Button */}
          <button 
            type="button" 
            onClick={() => setHelpModalOpen(true)}
            title="Campus Directory & Help"
            aria-label="Campus Directory & Help" 
            className="w-9 h-9 rounded-2xl bg-white/70 dark:bg-[#0D131F]/70 backdrop-blur-2xl border border-white/90 dark:border-white/15 flex items-center justify-center text-[#4B5563] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F0F6FC] hover:bg-white dark:hover:bg-[#1A2234] transition shadow-[0_2px_8px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,1)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.12)] cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Viewport: Centered Frosted Glass Card Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-2 sm:py-3">
        <div className="w-full max-w-[480px] bg-white/65 dark:bg-[#0D131F]/70 backdrop-blur-3xl rounded-[32px] border border-white/90 dark:border-white/12 p-7 sm:p-8 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.12),0_2px_8px_rgba(15,23,42,0.03),inset_0_1.5px_1.5px_rgba(255,255,255,1)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),inset_0_1.5px_1.5px_rgba(255,255,255,0.14)] relative transition-all duration-300">
          
          {/* Delicate Top Highlight Specular Edge */}
          <div className="absolute inset-x-8 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white dark:via-white/30 to-transparent opacity-95"></div>

          {/* 1. Brand Header (Centered) */}
          <div className="flex flex-col items-center text-center">
            {/* Glowing 52px rounded-2xl Royal Cobalt academic crest logo */}
            <div className="w-[52px] h-[52px] rounded-2xl bg-gradient-to-tr from-[#1D5BD8] via-[#2563EB] to-[#38BDF8] flex items-center justify-center shadow-[0_8px_25px_rgba(29,91,216,0.35),inset_0_1.5px_1.5px_rgba(255,255,255,0.5)] mb-3 text-white">
              <GraduationCap className="w-6 h-6 text-white drop-shadow-sm" />
            </div>

            <h1 className="text-[25px] font-extrabold text-[#111827] dark:text-[#F0F6FC] tracking-[-0.02em] leading-snug font-manrope">
              Sign in to UniCampus
            </h1>
            <p className="text-[13.5px] text-[#64748B] dark:text-[#94A3B8] mt-1 font-normal max-w-sm">
              Enter your university credentials to access your portal
            </p>
          </div>

          {/* 2. Role Switcher Segmented Track (Frosted Glass Pill Track) */}
          <div className="mt-5 w-full bg-black/[0.04] dark:bg-white/[0.04] backdrop-blur-md rounded-2xl p-1 flex items-center border border-white/70 dark:border-white/10 shadow-inner">
            {/* Student Tab */}
            <button 
              id="tab-student" 
              type="button" 
              onClick={() => handlePortalSwitch("student")}
              className={`flex-1 py-1.5 px-2 text-center rounded-xl text-[13px] transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer font-manrope ${
                activePortal === "student"
                  ? "bg-white text-[#111827] dark:bg-[#1A2234] dark:text-[#F0F6FC] shadow-[0_2px_8px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,1)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.15)] border border-white dark:border-white/20 font-bold"
                  : "text-[#64748B] dark:text-[#8D96A0] hover:text-[#111827] dark:hover:text-[#F0F6FC] hover:bg-white/30 dark:hover:bg-white/5 border border-transparent font-medium"
              }`}
            >
              <GraduationCap className={`w-4 h-4 ${activePortal === "student" ? "text-[#1D5BD8] dark:text-[#2563EB]" : "text-[#64748B] dark:text-[#8D96A0]"}`} />
              <span>Student</span>
            </button>

            {/* Faculty / Teacher Tab */}
            <button 
              id="tab-faculty" 
              type="button" 
              onClick={() => handlePortalSwitch("faculty")}
              className={`flex-1 py-1.5 px-2 text-center rounded-xl text-[13px] transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer font-manrope ${
                activePortal === "faculty"
                  ? "bg-white text-[#111827] dark:bg-[#1A2234] dark:text-[#F0F6FC] shadow-[0_2px_8px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,1)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.15)] border border-white dark:border-white/20 font-bold"
                  : "text-[#64748B] dark:text-[#8D96A0] hover:text-[#111827] dark:hover:text-[#F0F6FC] hover:bg-white/30 dark:hover:bg-white/5 border border-transparent font-medium"
              }`}
            >
              <Building2 className={`w-4 h-4 ${activePortal === "faculty" ? "text-[#1D5BD8] dark:text-[#2563EB]" : "text-[#64748B] dark:text-[#8D96A0]"}`} />
              <span>Faculty</span>
            </button>

            {/* Administrator Tab */}
            <button 
              id="tab-admin" 
              type="button" 
              onClick={() => handlePortalSwitch("admin")}
              className={`flex-1 py-1.5 px-2 text-center rounded-xl text-[13px] transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer font-manrope ${
                activePortal === "admin"
                  ? "bg-white text-[#111827] dark:bg-[#1A2234] dark:text-[#F0F6FC] shadow-[0_2px_8px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,1)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.15)] border border-white dark:border-white/20 font-bold"
                  : "text-[#64748B] dark:text-[#8D96A0] hover:text-[#111827] dark:hover:text-[#F0F6FC] hover:bg-white/30 dark:hover:bg-white/5 border border-transparent font-medium"
              }`}
            >
              <Crown className={`w-4 h-4 ${activePortal === "admin" ? "text-[#1D5BD8] dark:text-[#2563EB]" : "text-[#64748B] dark:text-[#8D96A0]"}`} />
              <span>Admin</span>
            </button>
          </div>

          {/* Admin Department Sub-Selector (Only rendered when Admin is selected) */}
          {activePortal === "admin" && (
            <div className="mt-3 p-2.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] backdrop-blur-md border border-white/70 dark:border-white/10 space-y-2 shadow-inner">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#1D5BD8] dark:text-[#60A5FA]">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1D5BD8] dark:text-[#60A5FA]" />
                  Administrative Role Level
                </span>
                <span className="font-mono text-[9px] uppercase px-2 py-0.5 rounded-full bg-[#1D5BD8]/10 dark:bg-[#2563EB]/20 text-[#1D5BD8] dark:text-[#60A5FA] border border-[#1D5BD8]/25 dark:border-[#2563EB]/30 font-bold">
                  Role Gate
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                <button
                  type="button"
                  onClick={() => handleAdminDeptSelect("super")}
                  className={`p-2 rounded-xl text-[11px] font-medium transition-all text-left flex items-center justify-between cursor-pointer border ${
                    selectedAdminDept === "super"
                      ? "bg-white text-[#111827] dark:bg-[#1A2234] dark:text-[#F0F6FC] border-[#1D5BD8] dark:border-[#2563EB] shadow-xs font-bold"
                      : "bg-white/60 dark:bg-white/5 border-white/80 dark:border-white/10 text-[#64748B] dark:text-[#8D96A0] hover:text-[#111827] dark:hover:text-[#F0F6FC] hover:bg-white/80 dark:hover:bg-white/10"
                  }`}
                >
                  <div>
                    <p className="leading-tight">Super Admin</p>
                    <p className="text-[9px] font-mono text-[#94A3B8] dark:text-[#64748B]">Full Access</p>
                  </div>
                  {selectedAdminDept === "super" && <Check className="w-3.5 h-3.5 text-[#1D5BD8] dark:text-[#2563EB]" />}
                </button>

                <button
                  type="button"
                  onClick={() => handleAdminDeptSelect("dept-cse")}
                  className={`p-2 rounded-xl text-[11px] font-medium transition-all text-left flex items-center justify-between cursor-pointer border ${
                    selectedAdminDept === "dept-cse"
                      ? "bg-white text-[#111827] dark:bg-[#1A2234] dark:text-[#F0F6FC] border-[#1D5BD8] dark:border-[#2563EB] shadow-xs font-bold"
                      : "bg-white/60 dark:bg-white/5 border-white/80 dark:border-white/10 text-[#64748B] dark:text-[#8D96A0] hover:text-[#111827] dark:hover:text-[#F0F6FC] hover:bg-white/80 dark:hover:bg-white/10"
                  }`}
                >
                  <div>
                    <p className="leading-tight">CSE Admin</p>
                    <p className="text-[9px] font-mono text-[#94A3B8] dark:text-[#64748B]">Dept Scope</p>
                  </div>
                  {selectedAdminDept === "dept-cse" && <Check className="w-3.5 h-3.5 text-[#1D5BD8] dark:text-[#2563EB]" />}
                </button>
              </div>
            </div>
          )}

          {/* 3. Form Fields (Frosted Inset Wells with 14px vertical spacing) */}
          <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
            
            {/* Field 1: University ID or Institutional Email */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="university-id" className="block text-[12.5px] font-bold text-[#1E252D] dark:text-[#E2E8F0] font-manrope">
                  {currentConfig.label}
                </label>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/80 dark:bg-white/10 text-[#64748B] dark:text-[#94A3B8] border border-white dark:border-white/15 shadow-2xs font-bold">
                  {currentConfig.badge}
                </span>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B] dark:text-[#8D96A0] group-focus-within:text-[#1D5BD8] dark:group-focus-within:text-[#2563EB] transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <input 
                  type="text" 
                  id="university-id" 
                  name="university-id"
                  required
                  placeholder={currentConfig.placeholder}
                  value={emailOrId}
                  onChange={(e) => setEmailOrId(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 bg-black/[0.035] dark:bg-black/35 backdrop-blur-sm rounded-2xl border border-white/80 dark:border-white/10 text-[#111827] dark:text-[#F0F6FC] placeholder:text-[#94A3B8] dark:placeholder:text-[#64748B] text-[13px] font-mono shadow-[inset_0_1.5px_2.5px_rgba(0,0,0,0.04)] dark:shadow-[inset_0_1.5px_2.5px_rgba(0,0,0,0.4)] focus:outline-none focus:border-[#1D5BD8] dark:focus:border-[#2563EB] focus:bg-white/90 dark:focus:bg-black/50 focus:ring-4 focus:ring-[#1D5BD8]/12 dark:focus:ring-[#2563EB]/20 transition-all duration-200"
                />
              </div>
            </div>

            {/* Field 2: Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="text-[12.5px] font-bold text-[#1E252D] dark:text-[#E2E8F0] font-manrope">
                  Password
                </label>
                <button 
                  type="button" 
                  onClick={() => setForgotModalOpen(true)}
                  className="text-[12px] font-bold text-[#1D5BD8] dark:text-[#60A5FA] hover:underline transition-colors cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B] dark:text-[#8D96A0] group-focus-within:text-[#1D5BD8] dark:group-focus-within:text-[#2563EB] transition-colors">
                  <Lock className="w-4 h-4" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"}
                  id="password" 
                  name="password"
                  required
                  placeholder="••••••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 pl-10 pr-11 bg-black/[0.035] dark:bg-black/35 backdrop-blur-sm rounded-2xl border border-white/80 dark:border-white/10 text-[#111827] dark:text-[#F0F6FC] placeholder:text-[#94A3B8] dark:placeholder:text-[#64748B] text-[13px] font-mono tracking-widest shadow-[inset_0_1.5px_2.5px_rgba(0,0,0,0.04)] dark:shadow-[inset_0_1.5px_2.5px_rgba(0,0,0,0.4)] focus:outline-none focus:border-[#1D5BD8] dark:focus:border-[#2563EB] focus:bg-white/90 dark:focus:bg-black/50 focus:ring-4 focus:ring-[#1D5BD8]/12 dark:focus:ring-[#2563EB]/20 transition-all duration-200"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"} 
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#64748B] dark:text-[#8D96A0] hover:text-[#111827] dark:hover:text-[#F0F6FC] transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Utility Row: Checkbox + Remember Device + 2FA Badge */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  id="remember" 
                  name="remember" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded-md border-slate-300 dark:border-white/20 bg-white/80 dark:bg-white/10 text-[#1D5BD8] focus:ring-[#1D5BD8] focus:ring-offset-0 cursor-pointer accent-[#1D5BD8] transition-all"
                />
                <span className="text-[12.5px] text-[#475569] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F0F6FC] font-semibold transition-colors">
                  Remember this device for 30 days
                </span>
              </label>
              <span className="text-[10.5px] font-mono text-emerald-800 dark:text-emerald-300 bg-emerald-500/10 dark:bg-emerald-500/15 backdrop-blur-sm px-2.5 py-0.5 rounded-full border border-emerald-500/25 flex items-center gap-1.5 font-bold shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]"></span>
                2FA Active
              </span>
            </div>

            {/* 4. Primary Action Button (Tactile Pill with Inner Highlight) */}
            <button 
              type="submit" 
              id="submit-btn"
              disabled={isLoading || isSuccess}
              className={`w-full h-11.5 rounded-2xl text-white text-[14.5px] font-manrope font-bold flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(29, 91, 216,0.32),inset_0_1.5px_1.5px_rgba(255,255,255,0.4)] hover:shadow-[0_8px_25px_rgba(29, 91, 216,0.42)] active:scale-[0.99] transition-all duration-150 cursor-pointer ${
                isSuccess 
                  ? "bg-emerald-600 hover:bg-emerald-600 shadow-[0_6px_20px_rgba(16,185,129,0.32)]" 
                  : "bg-[#1D5BD8] hover:bg-[#1548B0] dark:bg-[#2563EB] dark:hover:bg-[#5853E6]"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Authenticating...</span>
                </div>
              ) : isSuccess ? (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Verified! Redirecting...</span>
                </div>
              ) : (
                <span className="flex items-center gap-1.5">
                  <span>{currentConfig.btnLabel}</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </button>

          </form>

          {/* 5. Divider & Single Sign-On (SSO) */}
          <div className="relative my-4.5 flex items-center justify-center">
            <div className="w-full border-t border-slate-300/60 dark:border-white/10"></div>
            <span className="absolute bg-white/90 dark:bg-[#1A2234] backdrop-blur-md px-3 py-0.5 rounded-full border border-white dark:border-white/15 font-mono text-[9.5px] font-bold text-[#64748B] dark:text-[#8D96A0] uppercase tracking-wider shadow-2xs">
              OR CONTINUE WITH UNIVERSITY SSO
            </span>
          </div>

          {/* Secondary Full-Width SSO Button (Frosted Glass Pill) */}
          <button 
            type="button" 
            onClick={() => handleSSOLogin("google")}
            className="w-full h-11 rounded-2xl bg-white/75 dark:bg-white/10 hover:bg-white dark:hover:bg-white/15 border border-white dark:border-white/15 text-[#1E252D] dark:text-[#F0F6FC] text-[12.5px] font-bold font-manrope flex items-center justify-center gap-2.5 transition-all duration-200 group cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,1)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.12)] active:scale-[0.99]"
          >
            {/* Dual Brand Crest Icons (Google & Microsoft) */}
            <div className="flex items-center -space-x-1">
              {/* Google 'G' icon badge */}
              <div className="w-4.5 h-4.5 rounded-full bg-white flex items-center justify-center p-0.5 shadow-2xs border border-slate-200/60">
                <svg className="w-3 h-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
              </div>
              {/* Microsoft Windows crest */}
              <div className="w-4.5 h-4.5 rounded-full bg-white border border-slate-200/60 flex items-center justify-center p-0.5 shadow-2xs">
                <svg className="w-2.5 h-2.5" viewBox="0 0 21 21">
                  <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
                  <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
                  <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
                  <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
                </svg>
              </div>
            </div>
            <span className="text-[#1E252D] dark:text-[#F0F6FC] group-hover:text-black dark:group-hover:text-white transition-colors">
              Single Sign-On (Google / Microsoft Account)
            </span>
          </button>

          {/* 6. Bottom Card Footer */}
          <div className="mt-4 pt-3.5 border-t border-slate-300/50 dark:border-white/10 text-center">
            <p className="text-[11.5px] text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
              Need help activating your student ID?{" "}
              <button 
                type="button" 
                onClick={() => setForgotModalOpen(true)}
                className="text-[#1D5BD8] dark:text-[#60A5FA] hover:underline font-bold underline-offset-2 transition-colors cursor-pointer"
              >
                Contact IT Helpdesk (Ext. 404)
              </button>
            </p>
          </div>

        </div>
      </main>

      {/* Sticky Minimal Frosted Footer */}
      <footer className="relative z-10 w-full px-6 sm:px-8 py-3 border-t border-white/60 dark:border-white/10 backdrop-blur-xl bg-white/30 dark:bg-[#0D131F]/40 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#64748B] dark:text-[#94A3B8] gap-2 shadow-[0_-1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-4">
          <span>UniCampus Enterprise Suite © 2026</span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:inline text-[#1E252D] dark:text-[#F0F6FC] font-semibold">All Systems Encrypted (AES-256 / SHA-512)</span>
        </div>
        <div className="flex items-center gap-5">
          <button 
            type="button" 
            onClick={() => setHelpModalOpen(true)}
            className="hover:text-[#111827] dark:hover:text-[#F0F6FC] transition-colors cursor-pointer"
          >
            Privacy Policy
          </button>
          <button 
            type="button" 
            onClick={() => setHelpModalOpen(true)}
            className="hover:text-[#111827] dark:hover:text-[#F0F6FC] transition-colors cursor-pointer"
          >
            Acceptable Use
          </button>
          <span className="text-[#1E252D] dark:text-[#F0F6FC] font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]"></span>
            Server Node: AWS-US-EAST-1
          </span>
        </div>
      </footer>

      {/* Institutional Password Reset Modal (Frosted Glass) */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 dark:bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white/85 dark:bg-[#0D131F]/95 backdrop-blur-2xl rounded-3xl border border-white dark:border-white/15 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/70 dark:border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#1D5BD8]/10 dark:bg-[#2563EB]/20 text-[#1D5BD8] dark:text-[#60A5FA] flex items-center justify-center border border-[#1D5BD8]/20 dark:border-[#2563EB]/30">
                  <LifeBuoy className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#111827] dark:text-[#F0F6FC]">
                    Credential Recovery Assistance
                  </h3>
                  <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                    University Security & Verification Policy
                  </p>
                </div>
              </div>
              <button
                onClick={() => setForgotModalOpen(false)}
                className="p-1.5 text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F0F6FC] rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
              <p>
                For institutional security and role integrity, password resets are mediated by administrative officers to prevent unauthorized portal access:
              </p>

              <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-white/5 border border-white dark:border-white/10 space-y-2 text-xs shadow-inner">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#111827] dark:text-[#F0F6FC]">Registrar Helpdesk</span>
                  <span className="font-mono text-[11px] text-[#1D5BD8] dark:text-[#60A5FA] font-bold">registrar@unicampus.edu</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#111827] dark:text-[#F0F6FC]">IT Support & 2FA Desk</span>
                  <span className="font-mono text-[11px] text-[#1D5BD8] dark:text-[#60A5FA] font-bold">it-helpdesk@unicampus.edu</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-white/10 text-[11px]">
                  <span>Physical Cabin:</span>
                  <span className="font-bold text-[#111827] dark:text-[#F0F6FC]">Room 102, Block A (9 AM – 5 PM)</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText("registrar@unicampus.edu");
                  setCopiedEmail(true);
                  setTimeout(() => setCopiedEmail(false), 2000);
                }}
                className="px-4 py-2 bg-white/70 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 border border-white/90 dark:border-white/15 rounded-xl text-xs text-[#334155] dark:text-[#F0F6FC] font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
              >
                {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEmail ? "Email Copied!" : "Copy Support Email"}</span>
              </button>
              <button
                type="button"
                onClick={() => setForgotModalOpen(false)}
                className="px-4 py-2 bg-[#1D5BD8] hover:bg-[#1548B0] dark:bg-[#2563EB] dark:hover:bg-[#5853E6] text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IT Helpdesk Modal (Frosted Glass) */}
      {helpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 dark:bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white/85 dark:bg-[#0D131F]/95 backdrop-blur-2xl rounded-3xl border border-white dark:border-white/15 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/70 dark:border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20 dark:border-emerald-500/30">
                  <Laptop className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#111827] dark:text-[#F0F6FC]">
                    UniCampus Support & Directory
                  </h3>
                  <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                    Campus IT Services • Extension 404
                  </p>
                </div>
              </div>
              <button
                onClick={() => setHelpModalOpen(false)}
                className="p-1.5 text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F0F6FC] rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#64748B] dark:text-[#94A3B8]">
              <div className="p-3 bg-white/60 dark:bg-white/5 rounded-2xl border border-white dark:border-white/10 shadow-inner">
                <p className="font-bold text-[#111827] dark:text-[#F0F6FC] mb-1">Central University Server Status</p>
                <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                  All cluster nodes operating normally with 99.98% uptime. Active semester registration window is open.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs py-1 border-b border-slate-200/60 dark:border-white/10">
                  <span className="text-[#64748B] dark:text-[#94A3B8]">Direct Hotline</span>
                  <span className="font-mono text-[#111827] dark:text-[#F0F6FC] font-bold">+880 (2) 9834-5500</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1 border-b border-slate-200/60 dark:border-white/10">
                  <span className="text-[#64748B] dark:text-[#94A3B8]">Emergency Escalation</span>
                  <span className="font-mono text-[#111827] dark:text-[#F0F6FC] font-bold">security@unicampus.edu</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1">
                  <span className="text-[#64748B] dark:text-[#94A3B8]">IT Operations Center</span>
                  <span className="text-[#111827] dark:text-[#F0F6FC] font-bold">Block B, Level 3, Room 304</span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setHelpModalOpen(false)}
                className="px-4 py-2 bg-[#1D5BD8] hover:bg-[#1548B0] dark:bg-[#2563EB] dark:hover:bg-[#5853E6] text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm"
              >
                Close Directory
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
