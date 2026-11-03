"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Users, 
  Megaphone,
  Calendar,
  LayoutDashboard,
  LogOut,
  BarChart3,
  Building2,
  Settings,
  CreditCard,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Lock,
  Crown
} from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { adminService } from "@/lib/services/adminService";
import { themeTokens } from "@/lib/theme";
import { SidebarFooter } from "@/components/layout/SidebarFooter";

const baseNavItems = [
  { name: "Executive Overview", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "User Accounts & RBAC", href: "/admin/users", icon: Users, hasPendingBadge: true },
  { name: "Departments & Curriculum", href: "/admin/departments", icon: Building2 },
  { name: "Master Routine & Rooms", href: "/admin/routine", icon: Calendar },
  { name: "Tuition & Finance", href: "/admin/finance", icon: CreditCard },
  { name: "System Audit Logs", href: "/admin/analytics", icon: BarChart3 },
  { name: "Global Settings", href: "/admin/settings", icon: Settings, superAdminOnly: true },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, isSuperAdmin, isDeptAdmin, adminDepartmentName, logout } = useAdminAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const profiles = adminService.getProfiles();
      const relevant = isDeptAdmin && currentUser?.department_id
        ? profiles.filter(p => p.department_id === currentUser.department_id)
        : profiles;
      setPendingCount(relevant.filter(p => !p.is_approved).length);
    } catch {
      setPendingCount(0);
    }

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
  }, [currentUser, isDeptAdmin]);

  const deptShortName = currentUser?.department_name
    ? currentUser.department_name.split(' ')[0]
    : 'Dept';

  return (
    <aside 
      className={`${
        collapsed ? "w-20" : "w-64"
      } h-screen sticky top-0 shrink-0 bg-white/70 dark:bg-[#0D1117]/75 backdrop-blur-2xl border-r border-white/80 dark:border-white/10 shadow-[4px_0_24px_rgba(0,0,0,0.03)] flex flex-col justify-between hidden md:flex z-40 select-none transition-all duration-200 group/sidebar`}
    >
      <div className="flex flex-col flex-1 min-h-0">
        {/* Brand Header */}
        <div className={`h-16 ${collapsed ? "px-2 justify-center" : "px-4 justify-between"} flex items-center border-b border-white/60 dark:border-white/10 relative`}>
          <Link 
            href="/admin/dashboard" 
            className="flex items-center gap-2.5 min-w-0"
            title="UniCampus Superadmin Console"
          >
            {/* Academic Governance Crest Icon */}
            <div className="w-9 h-9 rounded-xl bg-brand/10 dark:bg-[#2563EB]/15 border border-brand/30 dark:border-[#2563EB]/40 flex items-center justify-center text-brand dark:text-[#2563EB] shadow-xs dark:shadow-[0_0_15px_rgba(37, 99, 235,0.25)] shrink-0">
              <Crown className="w-5 h-5" />
            </div>

            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-manrope font-extrabold text-[15.5px] tracking-tight text-slate-900 dark:text-[#F0F6FC] truncate">
                  UniCampus
                </span>
                <span className="font-mono text-[9px] text-slate-400 dark:text-[#8D96A0] tracking-wider uppercase">
                  Central Governance
                </span>
              </div>
            )}
          </Link>

          {!collapsed && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-brand/10 text-brand border border-brand/30 dark:bg-[#2563EB]/20 dark:text-[#2563EB] dark:border-[#2563EB]/40 shrink-0 select-none">
              SUPERADMIN
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

        {/* Navigation List */}
        <nav className={`flex-1 overflow-y-auto ${collapsed ? "px-2" : "px-3"} py-3 space-y-1`}>
          {baseNavItems.map((item) => {
            const isExact = pathname === item.href;
            const isBaseMatch = item.href.startsWith("/admin/") && pathname.startsWith(item.href.split("?")[0]) && item.href !== "/admin/dashboard";
            const isActive = isExact || (isBaseMatch && !item.href.includes("?"));
            const isRestrictedForDept = isDeptAdmin && item.superAdminOnly;

            return (
              <Link
                key={item.name}
                href={item.href}
                title={collapsed ? item.name : undefined}
                aria-current={isActive ? "page" : undefined}
                className={`group flex items-center ${
                  collapsed ? "justify-center w-11 h-11 mx-auto" : "gap-3 px-3.5 py-2.5"
                } rounded-2xl text-xs font-semibold transition-all duration-150 relative ${
                  isActive
                    ? "bg-white dark:bg-white/15 text-slate-900 dark:text-[#F0F6FC] font-bold border border-white dark:border-white/25 shadow-[0_4px_16px_rgba(15,23,42,0.06),inset_0_1.5px_1.5px_rgba(255,255,255,1)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.4),inset_0_1.5px_1.5px_rgba(255,255,255,0.18)]"
                    : isRestrictedForDept
                      ? "text-slate-400 dark:text-[#6E747D] hover:bg-white/40 dark:hover:bg-white/5 opacity-75"
                      : "text-slate-600 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-[#F0F6FC] hover:bg-white/40 dark:hover:bg-white/5"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1.5 bottom-1.5 w-[3.5px] bg-[#2563EB] rounded-r-full shadow-xs dark:shadow-[0_0_8px_#2563EB]" />
                )}
                <item.icon className="w-4 h-4 shrink-0 transition-transform duration-150 group-hover:scale-110" />
                {!collapsed && (
                  <div className="flex-1 flex items-center justify-between min-w-0">
                    <span className="truncate">{item.name}</span>
                    {item.hasPendingBadge && mounted && pendingCount > 0 && (
                      <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold rounded bg-rose-500 text-white animate-pulse">
                        {pendingCount}
                      </span>
                    )}
                    {isRestrictedForDept && (
                      <span className="flex items-center gap-0.5 text-[9px] font-mono font-semibold px-1 py-0.2 rounded bg-slate-200/60 dark:bg-[#21262D] text-slate-500">
                        <Lock className="w-2.5 h-2.5" /> Super
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}

        </nav>
      </div>

      {/* Software User Footer */}
      <SidebarFooter>
        <div className="flex items-center justify-between gap-2 p-2 rounded-2xl bg-white/65 dark:bg-white/5 backdrop-blur-xl border border-white/80 dark:border-white/10 hover:border-white dark:hover:border-[#2563EB]/40 transition-colors shadow-2xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm bg-[#2563EB] shadow-[0_0_10px_rgba(37, 99, 235,0.4)]">
              ST
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 dark:text-[#F0F6FC] truncate leading-tight">
                  Syed Tariqul Islam
                </p>
                <p className="text-[10px] font-semibold truncate mt-0.5 text-[#2563EB] dark:text-[#60A5FA]">
                  Chief Systems Administrator
                </p>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              logout();
              router.push("/login");
            }}
            title="Sign Out of Admin Console"
            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors shrink-0 cursor-pointer"
            aria-label="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </SidebarFooter>
    </aside>
  );
}
