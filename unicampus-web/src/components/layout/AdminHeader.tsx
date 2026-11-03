"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Bell, 
  Search, 
  Settings as SettingsIcon, 
  LogOut, 
  CheckCheck, 
  Activity, 
  Sun, 
  Moon, 
  ChevronRight,
  Building2, 
  Globe, 
  Lock, 
  Crown,
  Check,
  Menu,
  ShieldCheck,
  ArrowRight
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { adminService } from "@/lib/services/adminService";
import { Department } from "@/types/admin";
import ProfileAvatar from "@/components/common/ProfileAvatar";
import { ThemeToggle } from "@/components/common/ThemeToggle";

export function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { 
    currentUser, 
    isAdmin, 
    isSuperAdmin, 
    isDeptAdmin, 
    adminDepartmentName, 
    activeScopeDeptId, 
    setActiveScopeDeptId, 
    effectiveDeptId, 
    logout
  } = useAdminAuth();
  const { setTheme, resolvedTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [departments, setDepartments] = useState<Department[]>([]);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    try {
      const depts = adminService.getDepartments();
      setDepartments(depts);
    } catch (e) {
      console.error(e);
    }

    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getBreadcrumbs = () => {
    if (pathname === '/admin/dashboard' || pathname === '/admin') {
      return { parent: 'Superadmin', active: 'Executive Dashboard' };
    }
    if (pathname === '/admin/users') {
      return { parent: 'Superadmin', active: 'User Accounts & Role Permissions' };
    }
    if (pathname === '/admin/routine') {
      return { parent: 'Superadmin', active: 'Master Routine & Room Allocation' };
    }
    if (pathname === '/admin/departments') {
      return { parent: 'Superadmin', active: 'Academic Departments & Programs' };
    }
    if (pathname === '/admin/finance') {
      return { parent: 'Superadmin', active: 'Tuition & Finance' };
    }
    if (pathname === '/admin/analytics') {
      return { parent: 'Superadmin', active: 'System Audit Logs' };
    }
    if (pathname === '/admin/settings') {
      return { parent: 'Superadmin', active: 'Global Settings' };
    }
    if (pathname === '/admin/notices') {
      return { parent: 'Superadmin', active: 'Campus Notices' };
    }
    
    const segmentMap: Record<string, string> = {
      dashboard: 'Executive Dashboard',
      users: 'User Accounts & Roles',
      notices: 'Notice Board',
      routine: 'Master Routine & Room Allocation',
      departments: 'Academic Departments & Programs',
      finance: 'Tuition & Finance',
      analytics: 'System Audit Logs',
      settings: 'Global Settings',
    };

    const paths = pathname.split('/').filter(Boolean);
    const seg = paths[1] || 'dashboard';
    const formatted = segmentMap[seg] || (seg.charAt(0).toUpperCase() + seg.slice(1));
    return { parent: 'Superadmin', active: formatted };
  };

  const breadcrumb = getBreadcrumbs();
  const activeScopeDepartment = departments.find(d => d.id === effectiveDeptId);
  const activeScopeLabel = isDeptAdmin
    ? (adminDepartmentName || activeScopeDepartment?.name || 'Department')
    : (activeScopeDeptId === 'all' ? 'All Departments' : (departments.find(d => d.id === activeScopeDeptId)?.code || 'Selected Dept'));

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
            href="/admin/dashboard" 
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
            placeholder="Quick search commands, users..." 
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
              setProfileOpen(false);
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
            <div className="frosted-glass-dropdown dropdown-glass absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-96 max-w-[384px] rounded-3xl p-5 shadow-2xl dark:shadow-black/70 border border-slate-200 dark:border-[#30363D] text-slate-800 dark:text-[#F0F6FC] z-50">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#30363D]">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-[#F0F6FC]">
                    {isSuperAdmin ? "University Governance Alerts" : `${activeScopeLabel} Alerts`}
                  </h3>
                  {hasUnread && (
                    <span className="px-2 py-0.5 bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 font-bold text-[10px] rounded-full">
                      2 New
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
                    <span className="text-rose-600 dark:text-rose-400 font-bold">Registration</span>
                    <span>10 mins ago</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-[#F0F6FC]">
                    4 new faculty profile submissions awaiting superadmin credentials approval.
                  </h4>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] hover:bg-blue-50/60 dark:hover:bg-[#21262D] transition-colors shadow-xs">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 dark:text-[#6E747D] mb-1">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">Cloud Infrastructure</span>
                    <span>1 hr ago</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-[#F0F6FC]">
                    Automated nightly snapshot completed successfully. 99.98% cluster uptime.
                  </h4>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-[#30363D] text-center">
                <Link
                  href="/admin/analytics"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-xs font-bold text-brand hover:underline inline-flex items-center gap-1.5"
                >
                  View complete system audit logs <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Dark/Light Theme Toggle Switch (Dual-icon pill with smooth sliding animation) */}
        <ThemeToggle />

        {/* Profile Avatar Squircle */}
        <div className="relative" ref={profileRef}>
          <div 
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotificationsOpen(false);
            }}
            className="w-8 h-8 rounded-xl p-[1.5px] bg-gradient-to-br from-brand to-cyan-400 cursor-pointer hover:opacity-90 transition-opacity shrink-0"
          >
            <ProfileAvatar alt={currentUser?.full_name || "Syed Tariqul Islam"} size="sm" className="w-full h-full rounded-[10px] border-0" />
          </div>

          {/* Profile Dropdown Panel */}
          {profileOpen && (
            <div className="frosted-glass-dropdown dropdown-glass absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-88 max-w-[340px] rounded-3xl p-5 shadow-2xl dark:shadow-black/70 border border-slate-200 dark:border-[#30363D] text-slate-800 dark:text-[#F0F6FC] z-50 max-h-[calc(100vh-5rem)] overflow-y-auto">
              <div className="flex items-center gap-3.5 pb-4 border-b border-slate-200 dark:border-[#30363D]">
                <ProfileAvatar 
                  size="lg"
                  className="border-2 border-blue-100 dark:border-[#30363D] shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="font-extrabold text-slate-900 dark:text-[#F0F6FC] text-sm truncate">
                    {currentUser?.full_name || "Syed Tariqul Islam"}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-[#8D96A0] font-medium truncate">
                    {currentUser?.email || "tariqul.admin@unicampus.edu"}
                  </p>
                  <div className="mt-1">
                    {isSuperAdmin ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-brand/10 text-brand dark:text-[#60A5FA] border border-brand/20">
                        <Crown className="w-2.5 h-2.5" /> Super Admin • Universal Privileges
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                        <Building2 className="w-2.5 h-2.5" /> {adminDepartmentName || 'Department'} Admin
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Department Console Access Scope */}
              {isSuperAdmin && (
                <div className="py-3 border-b border-slate-200 dark:border-[#30363D]">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-bold uppercase text-slate-400 dark:text-[#6E747D] font-mono tracking-wider">
                      Department Console Access
                    </p>
                    <span className="text-[9px] font-mono text-brand dark:text-[#60A5FA] font-bold bg-brand/10 px-1.5 py-0.5 rounded">
                      Universal Scope
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <button
                      onClick={() => {
                        setActiveScopeDeptId('all');
                        setProfileOpen(false);
                      }}
                      className={`w-full px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer border ${
                        activeScopeDeptId === 'all'
                          ? 'bg-brand text-white border-brand shadow-sm'
                          : 'bg-slate-50 dark:bg-[#161B22] border-slate-200 dark:border-[#30363D] text-slate-700 dark:text-[#8D96A0] hover:text-brand'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Globe className={`w-3.5 h-3.5 ${activeScopeDeptId === 'all' ? 'text-white' : 'text-brand'}`} />
                        <span>All Departments (Universal Dashboard)</span>
                      </div>
                      {activeScopeDeptId === 'all' && <Check className="w-3.5 h-3.5" />}
                    </button>

                    <div className="grid grid-cols-3 gap-1.5 pt-1">
                      <button
                        onClick={() => {
                          setActiveScopeDeptId('dept-cse');
                          setProfileOpen(false);
                        }}
                        className={`px-2 py-1.5 rounded-lg text-[11px] font-bold transition-all text-center cursor-pointer border ${
                          activeScopeDeptId === 'dept-cse'
                            ? 'bg-brand text-white border-brand'
                            : 'bg-slate-50 dark:bg-[#161B22] border-slate-200 dark:border-[#30363D] text-slate-700 dark:text-[#8D96A0] hover:text-brand'
                        }`}
                      >
                        CSE Console
                      </button>

                      <button
                        onClick={() => {
                          setActiveScopeDeptId('dept-eee');
                          setProfileOpen(false);
                        }}
                        className={`px-2 py-1.5 rounded-lg text-[11px] font-bold transition-all text-center cursor-pointer border ${
                          activeScopeDeptId === 'dept-eee'
                            ? 'bg-emerald-600 text-white border-emerald-700'
                            : 'bg-slate-50 dark:bg-[#161B22] border-slate-200 dark:border-[#30363D] text-slate-700 dark:text-[#8D96A0] hover:text-emerald-500'
                        }`}
                      >
                        EEE Console
                      </button>

                      <button
                        onClick={() => {
                          setActiveScopeDeptId('dept-bba');
                          setProfileOpen(false);
                        }}
                        className={`px-2 py-1.5 rounded-lg text-[11px] font-bold transition-all text-center cursor-pointer border ${
                          activeScopeDeptId === 'dept-bba'
                            ? 'bg-amber-600 text-white border-amber-700'
                            : 'bg-slate-50 dark:bg-[#161B22] border-slate-200 dark:border-[#30363D] text-slate-700 dark:text-[#8D96A0] hover:text-amber-500'
                        }`}
                      >
                        BBA Console
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <div className="py-2.5 space-y-1">
                <Link
                  href="/admin/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-[#8D96A0] hover:bg-slate-50 dark:hover:bg-[#161B22] hover:text-slate-900 dark:hover:text-[#F0F6FC] transition-colors"
                >
                  <SettingsIcon className="w-4 h-4 text-brand" />
                  <span>System Settings &amp; Infrastructure</span>
                </Link>

                <Link
                  href="/admin/analytics"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-[#8D96A0] hover:bg-slate-50 dark:hover:bg-[#161B22] hover:text-slate-900 dark:hover:text-[#F0F6FC] transition-colors"
                >
                  <Activity className="w-4 h-4 text-emerald-500" />
                  <span>Institutional Analytics</span>
                </Link>
              </div>

              {/* Status & Sign Out */}
              <div className="pt-3 border-t border-slate-200 dark:border-[#30363D] space-y-2">
                <div className="flex items-center justify-between px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl text-[11px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Governance Session Active</span>
                  </div>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setProfileOpen(false);
                    router.push('/login');
                  }}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors w-full cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out of Admin Console</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
