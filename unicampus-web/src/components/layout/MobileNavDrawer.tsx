"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  X, 
  Home, 
  Calendar, 
  Megaphone, 
  MessageSquare, 
  FolderGit2, 
  TrendingUp, 
  Users, 
  GraduationCap, 
  Settings, 
  User as UserIcon, 
  LogOut, 
  LayoutDashboard, 
  CheckSquare, 
  Building2, 
  CreditCard, 
  BarChart3, 
  Crown, 
  Lock,
  Sun,
  Moon
} from "lucide-react";
import { useTheme } from "next-themes";
import { executeThemeTransition } from "@/lib/themeTransition";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { themeTokens } from "@/lib/theme";
import { SidebarFooter } from "@/components/layout/SidebarFooter";

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNavDrawer({ isOpen, onClose }: MobileNavDrawerProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { currentUser, isSuperAdmin, isDeptAdmin, adminDepartmentName, logout } = useAdminAuth();

  const isTeacher = pathname === "/teacher" || pathname.startsWith("/teacher/");
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Close when pathname changes
  useEffect(() => {
    onClose();
  }, [pathname]);

  if (!isOpen) return null;

  const handleLogout = () => {
    logout();
    onClose();
    router.push("/login");
  };

  const studentNavItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Routine", href: "/routine", icon: Calendar, badge: "Live" },
    { name: "Course Materials", href: "/materials", icon: FolderGit2 },
    { name: "Notices", href: "/notices", icon: Megaphone, badge: "3 New" },
    { name: "Messages", href: "/messages", icon: MessageSquare, badge: "2 New" },
    { name: "Grades & Progress", href: "/dashboard/progress", icon: TrendingUp },
    { name: "Faculty Directory", href: "/teachers", icon: Users },
    { name: "Peers", href: "/students", icon: GraduationCap },
    { name: "My Profile", href: "/profile", icon: UserIcon },
    { name: "Portal Settings", href: "/settings", icon: Settings },
  ];

  const teacherNavItems = [
    { name: "Overview", href: "/teacher/dashboard", icon: LayoutDashboard },
    { name: "Take Attendance", href: "/teacher/attendance", icon: CheckSquare, badge: "Live" },
    { name: "Gradebook & Marks", href: "/teacher/grades", icon: GraduationCap },
    { name: "Teaching Routine", href: "/teacher/routine", icon: Calendar },
    { name: "Course Materials", href: "/teacher/materials", icon: FolderGit2 },
    { name: "Circulars & Notices", href: "/teacher/notices", icon: Megaphone },
    { name: "Messages", href: "/messages", icon: MessageSquare, badge: "1 New" },
  ];

  const adminNavItems = [
    { name: "Executive Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "User Directory & Approvals", href: "/admin/users", icon: Users },
    { name: "Notice Circulars", href: "/admin/notices", icon: Megaphone },
    { name: "Class Timetable", href: "/admin/routine", icon: Calendar },
    { name: "Departments & Curriculum", href: "/admin/departments", icon: Building2 },
    { name: "Finance & Payroll", href: "/admin/finance", icon: CreditCard },
    { name: "Analytics & Reports", href: "/admin/analytics", icon: BarChart3 },
    ...(isSuperAdmin
      ? [{ name: "System Settings", href: "/admin/settings", icon: Settings }]
      : []),
  ];

  const currentItems = isAdmin ? adminNavItems : isTeacher ? teacherNavItems : studentNavItems;
  const portalTitle = isAdmin
    ? isSuperAdmin
      ? "SuperAdmin Console"
      : `${adminDepartmentName || "Department"} Admin`
    : isTeacher
    ? "Faculty Workspace"
    : "Student Portal";

  const portalBadge = isAdmin
    ? isSuperAdmin
      ? "SUPER"
      : "DEPT"
    : isTeacher
    ? "FACULTY"
    : "STUDENT";

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-start">
      <div className={`w-[85vw] max-w-sm h-full ${themeTokens.surface} border-r ${themeTokens.border} shadow-2xl flex flex-col justify-between  select-none`}>
        
        {/* Top Header */}
        <div>
          <div className={`h-16 px-4 border-b ${themeTokens.border} flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm bg-brand">
                {isAdmin ? (
                  isSuperAdmin ? <Crown className="w-5 h-5" /> : <Building2 className="w-5 h-5" />
                ) : isTeacher ? (
                  <GraduationCap className="w-5 h-5" />
                ) : (
                  <span>U</span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm text-slate-900 dark:text-[#F0F6FC]">UniCampus</span>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-brand/10 text-brand dark:text-[#60A5FA]">
                    {portalBadge}
                  </span>
                </div>
                <p className={`text-[10px] ${themeTokens.textMuted} truncate`}>{portalTitle}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-[#161B22] cursor-pointer"
              aria-label="Close Navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="p-3 space-y-1 max-h-[calc(100vh-160px)] overflow-y-auto">
            <div className="px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-[#6E747D]">
              Navigation
            </div>
            {currentItems.map((item) => {
              const isActive = pathname === item.href || (pathname === "/" && item.href === "/dashboard");
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-brand text-white font-bold shadow-xs"
                      : "text-slate-600 dark:text-[#8D96A0] hover:bg-slate-100 dark:hover:bg-[#161B22] hover:text-slate-900 dark:hover:text-[#F0F6FC]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 dark:text-[#8D96A0]'}`} />
                    <span>{item.name}</span>
                  </div>
                  {(item as { badge?: string }).badge && (
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-brand/10 text-brand border border-brand/20'
                    }`}>
                      {(item as { badge?: string }).badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Bar & Logout */}
        <SidebarFooter className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs bg-brand">
              {currentUser?.full_name ? currentUser.full_name[0] : 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-[#F0F6FC] truncate">
                {currentUser?.full_name || (isAdmin ? "Administrator" : isTeacher ? "Dr. Asif Rahman" : "Sakib Ahmed")}
              </p>
              <p className={`text-[10px] ${themeTokens.textMuted} truncate`}>
                {currentUser?.email || "UniCampus Verified"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={(e) => executeThemeTransition({
                theme: resolvedTheme === 'dark' ? 'light' : 'dark',
                event: e,
                setTheme,
                currentTheme: resolvedTheme,
              })}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-[#8D96A0] dark:hover:text-[#F0F6FC] rounded-lg hover:bg-slate-100 dark:hover:bg-[#161B22] cursor-pointer"
              title="Toggle Theme"
              aria-label="Toggle Theme"
              suppressHydrationWarning
            >
              {mounted && resolvedTheme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={handleLogout}
              className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </SidebarFooter>

      </div>

      {/* Backdrop tap to dismiss */}
      <div className="flex-1" onClick={onClose}></div>
    </div>
  );
}

