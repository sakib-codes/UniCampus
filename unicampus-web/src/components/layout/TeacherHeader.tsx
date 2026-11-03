"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Bell, 
  Search, 
  CheckCheck, 
  ChevronRight,
  Menu,
  ArrowRight
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "@/components/common/ThemeToggle";

export function TeacherHeader() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getBreadcrumbs = () => {
    if (pathname === '/teacher/dashboard' || pathname === '/teacher') {
      return { parent: 'Faculty Portal', active: 'Command Center' };
    }
    if (pathname === '/teacher/grades') {
      return { parent: 'Faculty Portal', active: 'Gradebook Matrix' };
    }
    if (pathname === '/teacher/attendance') {
      return { parent: 'Faculty Portal', active: 'Attendance Register' };
    }
    if (pathname === '/teacher/routine') {
      return { parent: 'Faculty Portal', active: 'Assigned Courses' };
    }
    if (pathname === '/teacher/materials') {
      return { parent: 'Faculty Portal', active: 'Courseware Uploads' };
    }
    if (pathname === '/teacher/notices') {
      return { parent: 'Faculty Portal', active: 'Campus Notices' };
    }
    const paths = pathname.split('/').filter(Boolean);
    const currentPath = paths.length > 0 ? paths[paths.length - 1] : 'Dashboard';
    const formatted = currentPath.charAt(0).toUpperCase() + currentPath.slice(1);
    return { parent: 'Faculty Portal', active: formatted };
  };

  const breadcrumb = getBreadcrumbs();

  return (
    <header className="h-16 sticky top-0 z-50 bg-white/70 dark:bg-[#0D1117]/75 backdrop-blur-2xl border-b border-white/80 dark:border-white/10 px-4 md:px-8 flex items-center justify-between select-none transition-colors shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
      {/* Left: Mobile Menu Trigger + Clean Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent("open-mobile-nav"))}
          className="md:hidden p-2 text-slate-500 hover:text-slate-900 dark:text-[#8D96A0] dark:hover:text-[#F0F6FC] rounded-xl hover:bg-white/60 dark:hover:bg-[#161B22] focus:outline-none cursor-pointer"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <Link 
            href="/teacher/dashboard" 
            className="text-slate-500 hover:text-slate-900 dark:text-[#8D96A0] dark:hover:text-[#F0F6FC] transition-colors cursor-pointer"
          >
            {breadcrumb.parent}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-[#6E747D]" />
          <span className="text-slate-900 dark:text-[#F0F6FC] font-semibold flex items-center gap-1.5">
            <span>{breadcrumb.active}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand dark:bg-[#2563EB] shadow-[0_0_6px_rgba(29, 91, 216,0.4)] dark:shadow-[0_0_6px_#2563EB]" />
          </span>
        </div>
      </div>

      {/* Right: Command Search + Utilities (Exact match to Student Header) */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Command Search Bar (320px wide) */}
        <div 
          onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
          className="relative w-48 sm:w-[320px] group cursor-pointer"
        >
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-hover:text-slate-900 dark:text-[#8D96A0] dark:group-hover:text-[#F0F6FC] transition-colors">
            <Search className="w-4 h-4" />
          </div>
          <input 
            type="text" 
            readOnly 
            placeholder="Quick search courses, students..." 
            className="w-full pl-9 pr-14 sm:pr-16 py-1.5 bg-black/[0.035] dark:bg-black/25 backdrop-blur-sm border border-white/80 dark:border-white/10 group-hover:border-white dark:group-hover:border-[#2563EB]/60 rounded-xl text-xs text-slate-900 dark:text-[#F0F6FC] placeholder-slate-400 dark:placeholder-[#6E747D] cursor-pointer transition-all focus:outline-none shadow-inner truncate"
          />
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
            <span className="font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded bg-white dark:bg-[#21262D] border border-white/80 dark:border-[#30363D] text-slate-500 dark:text-[#8D96A0] shadow-2xs">
              Cmd+K
            </span>
          </div>
        </div>

        {/* Notification Bell with Pulsing Dot */}
        <div className="relative" ref={notifRef}>
          <button 
            type="button"
            onClick={() => {
              setNotificationsOpen((prev) => !prev);
            }}
            className="relative p-2 rounded-xl bg-white/70 dark:bg-[#161B22] border border-white/80 dark:border-[#30363D] text-slate-600 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-[#F0F6FC] hover:border-white dark:hover:border-[#2563EB]/40 transition-colors cursor-pointer shadow-xs"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {hasUnread && (
              <>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand dark:bg-[#2563EB] shadow-xs dark:shadow-[0_0_8px_#2563EB] ring-2 ring-white dark:ring-[#0D1117] animate-ping" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand dark:bg-[#2563EB]" />
              </>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {notificationsOpen && (
            <div className="frosted-glass-dropdown dropdown-glass absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-88 max-w-[340px] rounded-3xl p-5 shadow-2xl dark:shadow-black/70 border border-slate-200 dark:border-[#30363D] text-slate-800 dark:text-[#F0F6FC] z-50">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#30363D]">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-[#F0F6FC]">Faculty Alerts</h3>
                  {hasUnread && (
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 font-bold text-[10px] rounded-full">
                      1 New
                    </span>
                  )}
                </div>
                {hasUnread && (
                  <button 
                    type="button"
                    onClick={() => setHasUnread(false)}
                    className="text-[11px] font-semibold text-brand hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5" /> Mark read
                  </button>
                )}
              </div>

              <div className="space-y-2.5 py-3 max-h-80 overflow-y-auto">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] hover:bg-blue-50/60 dark:hover:bg-[#21262D] transition-colors shadow-xs">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 dark:text-[#6E747D] mb-1">
                    <span className="text-brand font-bold">Grade Submission</span>
                    <span>1 hr ago</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-[#F0F6FC]">
                    Midterm marks submission portal closes in 3 days for CSE-311.
                  </h4>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-[#30363D] text-center">
                <Link
                  href="/teacher/notices"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-xs font-bold text-brand hover:underline inline-flex items-center gap-1.5"
                >
                  View all faculty notices <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Dark/Light Theme Toggle Switch (Dual-icon pill with smooth sliding animation) */}
        <ThemeToggle />
      </div>
    </header>
  );
}
