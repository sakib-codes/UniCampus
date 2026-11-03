"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  QrCode, 
  GraduationCap, 
  BookOpen, 
  UploadCloud, 
  Megaphone, 
  MessageSquare,
  ChevronLeft, 
  ChevronRight,
  LogOut,
  Sparkles,
  Shield,
  ChevronsUpDown,
  User,
  Settings,
  Users,
  Keyboard
} from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { themeTokens } from "@/lib/theme";
import { SidebarFooter } from "@/components/layout/SidebarFooter";

const teacherNavItems = [
  { name: "Command Center", href: "/teacher/dashboard", icon: LayoutDashboard },
  { name: "Live Attendance (QR)", href: "/teacher/attendance", icon: QrCode, badge: "Live" },
  { name: "Gradebook & Marks", href: "/teacher/grades", icon: GraduationCap },
  { name: "Assigned Courses", href: "/teacher/routine", icon: BookOpen },
  { name: "Courseware Uploads", href: "/teacher/materials", icon: UploadCloud },
  { name: "Campus Notices", href: "/teacher/notices", icon: Megaphone },
  { name: "Student Messages", href: "/messages", icon: MessageSquare, badge: "4" },
];

export function TeacherSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout } = useAdminAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close profile menu when pathname changes
  useEffect(() => {
    setProfileMenuOpen(false);
  }, [pathname]);

  // Click outside and escape key handling
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Keyboard shortcut '[' to collapse sidebar
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        e.key === "[" && 
        !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        setCollapsed((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <aside 
      className={`${
        collapsed ? "w-20" : "w-[260px]"
      } h-screen sticky top-0 shrink-0 bg-white/70 dark:bg-[#0D1117]/75 backdrop-blur-2xl border-r border-white/80 dark:border-white/10 shadow-[4px_0_24px_rgba(0,0,0,0.03)] flex flex-col justify-between hidden md:flex z-40 select-none transition-all duration-200 group/sidebar`}
    >
      <div className="flex flex-col flex-1 min-h-0">
        {/* Brand Header */}
        <div className={`h-16 ${collapsed ? "px-2 justify-center" : "px-4 justify-between"} flex items-center border-b border-white/60 dark:border-white/10 relative`}>
          <Link 
            href="/teacher/dashboard" 
            className="flex items-center gap-2.5 min-w-0"
            title="UniCampus Faculty Portal"
          >
            {/* Academic Crest Icon */}
            <div className="w-9 h-9 rounded-xl bg-brand/10 dark:bg-[#2563EB]/15 border border-brand/30 dark:border-[#2563EB]/40 flex items-center justify-center text-brand dark:text-[#2563EB] shadow-xs dark:shadow-[0_0_15px_rgba(37, 99, 235,0.25)] shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>

            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-manrope font-extrabold text-[15.5px] tracking-tight text-slate-900 dark:text-[#F0F6FC] truncate">
                  UniCampus
                </span>
                <span className="font-mono text-[9px] text-slate-400 dark:text-[#8D96A0] tracking-wider uppercase">
                  Faculty Portal
                </span>
              </div>
            )}
          </Link>

          {!collapsed && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-brand/10 text-brand border border-brand/30 dark:bg-[#2563EB]/20 dark:text-[#2563EB] dark:border-[#2563EB]/40 shrink-0 select-none">
              FACULTY
            </span>
          )}

          {/* Toggle Expand/Collapse Handle */}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expand Sidebar ([)" : "Collapse Sidebar ([)"}
            aria-label={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            className={`absolute -right-3 top-5 w-6 h-6 rounded-full bg-white dark:bg-[#161B22] border border-white/80 dark:border-[#30363D] shadow-md flex items-center justify-center text-slate-400 hover:text-slate-900 dark:text-[#8D96A0] dark:hover:text-[#F0F6FC] hover:scale-110 transition-all z-50 cursor-pointer ${
              collapsed ? "opacity-100" : "hidden"
            }`}
          >
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className={`flex-1 overflow-y-auto ${collapsed ? "px-2" : "px-3"} py-3 space-y-1`}>
          {!collapsed && (
            <div className="px-3 pt-1 pb-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-[#6E747D]">
              Faculty Navigation
            </div>
          )}

          {teacherNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                title={collapsed ? item.name : undefined}
                aria-current={isActive ? "page" : undefined}
                className={`group flex items-center ${
                  collapsed ? "justify-center w-11 h-11 mx-auto" : "gap-3 px-3 py-2.5"
                } rounded-2xl text-xs font-semibold transition-all duration-150 relative ${
                  isActive 
                    ? "bg-white dark:bg-white/15 text-slate-900 dark:text-[#F0F6FC] font-bold border border-white dark:border-white/25 shadow-[0_4px_16px_rgba(15,23,42,0.06),inset_0_1.5px_1.5px_rgba(255,255,255,1)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.4),inset_0_1.5px_1.5px_rgba(255,255,255,0.18)]" 
                    : "text-slate-600 dark:text-[#8D96A0] hover:bg-white/50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-[#F0F6FC]"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1.5 bottom-1.5 w-[3.5px] bg-[#2563EB] rounded-r-full shadow-xs dark:shadow-[0_0_8px_#2563EB]" />
                )}
                <item.icon className={`w-4 h-4 shrink-0 transition-transform duration-150 group-hover:scale-110 ${isActive ? "text-[#2563EB]" : "text-slate-400 dark:text-[#6E747D]"}`} />
                {!collapsed && (
                  <div className="flex-1 flex items-center justify-between min-w-0">
                    <span className="truncate">{item.name}</span>
                    {item.badge && (
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md ${
                        item.badge === "Live"
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                          : "bg-[#2563EB] text-white shadow-xs font-bold"
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Faculty Profile Card */}
      <SidebarFooter>
        <div className="relative" ref={profileMenuRef}>
          {/* Faculty Options Popover */}
          {profileMenuOpen && (
            <div 
              className={`absolute ${
                collapsed 
                  ? "left-full bottom-0 ml-3 w-72" 
                  : "bottom-full left-0 mb-3 w-[268px] -left-1.5"
              } rounded-3xl p-4 shadow-2xl dark:shadow-black/80 bg-white/95 dark:bg-[#161B22]/95 backdrop-blur-2xl border border-slate-200 dark:border-[#30363D] text-slate-800 dark:text-[#F0F6FC] z-50`}
            >
              {/* Faculty Identity */}
              <div className="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-[#30363D]">
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#1D5BD8] to-blue-500 text-white flex items-center justify-center font-manrope font-bold text-sm shadow-sm">
                    AR
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#161B22]" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-extrabold text-slate-900 dark:text-[#F0F6FC] text-sm truncate font-manrope">
                    {currentUser?.full_name || "Dr. Asif Rahman"}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-[#8D96A0] font-medium truncate">
                    {currentUser?.email || "asif.rahman@unicampus.edu"}
                  </p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400 rounded-md font-bold text-[10px]">
                    CSE Faculty • Verified
                  </span>
                </div>
              </div>

              {/* Account & System Options (Non-redundant, essentials only) */}
              <div className="py-2 space-y-0.5">
                <Link
                  href="/teachers/1"
                  onClick={() => setProfileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-[#C9D1D9] hover:bg-slate-100/90 dark:hover:bg-[#21262D] hover:text-slate-900 dark:hover:text-[#F0F6FC] transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <User className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
                    <span>Faculty Profile</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 dark:text-[#6E747D]">Bio &amp; HOD</span>
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setProfileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-[#C9D1D9] hover:bg-slate-100/90 dark:hover:bg-[#21262D] hover:text-slate-900 dark:hover:text-[#F0F6FC] transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <Settings className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                    <span>Account Settings</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 dark:text-[#6E747D]">2FA &amp; Prefs</span>
                </Link>

                <Link
                  href="/teachers"
                  onClick={() => setProfileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-[#C9D1D9] hover:bg-slate-100/90 dark:hover:bg-[#21262D] hover:text-slate-900 dark:hover:text-[#F0F6FC] transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-indigo-500 group-hover:scale-110 transition-transform" />
                    <span>Faculty Directory</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 dark:text-[#6E747D]">Colleagues</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    window.dispatchEvent(new KeyboardEvent("keydown", { key: "?", bubbles: true }));
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-[#C9D1D9] hover:bg-slate-100/90 dark:hover:bg-[#21262D] hover:text-slate-900 dark:hover:text-[#F0F6FC] transition-colors group text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Keyboard className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                    <span>Keyboard Shortcuts</span>
                  </div>
                  <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-[#30363D] text-slate-500 dark:text-[#8D96A0] border border-slate-200 dark:border-[#30363D]">?</kbd>
                </button>
              </div>

              {/* Session Status + Sign Out */}
              <div className="pt-2.5 border-t border-slate-200 dark:border-[#30363D] space-y-2">
                <div className="flex items-center justify-between px-3 py-1.5 bg-blue-50/70 dark:bg-blue-950/40 rounded-xl text-[11px] font-bold text-blue-700 dark:text-blue-400 border border-blue-500/20">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span>Faculty Session Active</span>
                  </div>
                  <Shield className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    logout();
                    router.push("/login");
                  }}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors w-full cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}

          {/* Trigger Card */}
          <button
            type="button"
            onClick={() => setProfileMenuOpen((prev) => !prev)}
            aria-expanded={profileMenuOpen}
            aria-label="Faculty account options"
            className={`w-full flex items-center justify-between gap-2 p-2 rounded-2xl transition-all text-left cursor-pointer ${
              profileMenuOpen
                ? "bg-white/90 dark:bg-white/10 ring-2 ring-[#1D5BD8]/30 dark:ring-[#2563EB]/40 border border-transparent shadow-xs"
                : "bg-white/65 dark:bg-white/5 backdrop-blur-xl border border-white/80 dark:border-white/10 hover:bg-white/85 dark:hover:bg-white/10 hover:border-white dark:hover:border-[#2563EB]/40 shadow-2xs"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1D5BD8]/30 to-blue-500/30 border border-[#1D5BD8]/40 flex items-center justify-center font-manrope font-bold text-xs text-slate-900 dark:text-[#F0F6FC]">
                  AR
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#161B22]" />
              </div>
              {!collapsed && (
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-[#F0F6FC] truncate leading-tight font-manrope">
                    {currentUser?.full_name || "Dr. Asif Rahman"}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-[#8D96A0] truncate mt-0.5">
                    Associate Professor • CSE
                  </p>
                </div>
              )}
            </div>

            {!collapsed && (
              <div className="p-1 text-slate-400 group-hover:text-slate-600 dark:text-[#8D96A0] dark:group-hover:text-[#F0F6FC] transition-colors shrink-0">
                <ChevronsUpDown className="w-4 h-4" />
              </div>
            )}
          </button>
        </div>
      </SidebarFooter>
    </aside>
  );
}
