"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutGrid, 
  Megaphone, 
  Calendar, 
  TrendingUp,
  Users, 
  GraduationCap, 
  FolderGit2, 
  MessageSquare, 
  LogOut, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import ProfileAvatar from "@/components/common/ProfileAvatar";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { name: "Routine", href: "/routine", icon: Calendar },
  { name: "Progress", href: "/dashboard/progress", icon: TrendingUp },
  { name: "Notices", href: "/notices", icon: Megaphone, badge: "3" },
  { name: "Peers", href: "/students", icon: GraduationCap },
  { name: "Faculty", href: "/teachers", icon: Users },
  { name: "Materials", href: "/materials", icon: FolderGit2 },
  { name: "Messages", href: "/messages", icon: MessageSquare, unreadCount: "2" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout } = useAdminAuth();
  const [collapsed, setCollapsed] = useState(false);

  const studentName = currentUser?.full_name || "Sakib Ahmed";
  const studentId = currentUser?.student_id || "211-15-4424";

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
      {/* Top Brand & Nav Section */}
      <div className="flex flex-col flex-1 min-h-0">
        {/* Brand Header */}
        <div className={`h-16 ${collapsed ? "px-2 justify-center" : "px-4 justify-between"} flex items-center border-b border-white/60 dark:border-white/10 relative`}>
          <Link 
            href="/dashboard" 
            className="flex items-center gap-2.5 min-w-0"
            title="UniCampus Portal"
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
                  Portal v3.2
                </span>
              </div>
            )}
          </Link>

          {!collapsed && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-brand/10 text-brand border border-brand/30 dark:bg-[#2563EB]/20 dark:text-[#2563EB] dark:border-[#2563EB]/40 shrink-0 select-none">
              STUDENT
            </span>
          )}

          {/* Floating Border Collapse/Expand Toggle Handle */}
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

        {/* Navigation Menu */}
        <nav className={`p-3.5 space-y-1.5 mt-2 flex-1 overflow-y-auto ${collapsed ? "px-2" : ""}`}>
          {navItems.map((item) => {
            const isActive = 
              pathname === item.href || 
              (pathname === "/" && item.href === "/dashboard") ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"));

            return (
              <Link
                key={item.name}
                href={item.href}
                title={collapsed ? item.name : undefined}
                className={`relative flex items-center ${
                  collapsed ? "justify-center p-2.5" : "justify-between px-3.5 py-2.5"
                } rounded-2xl text-sm font-semibold transition-all group ${
                  isActive
                    ? "bg-white dark:bg-white/15 text-slate-900 dark:text-[#F0F6FC] border border-white dark:border-white/25 shadow-[0_4px_16px_rgba(15,23,42,0.06),inset_0_1.5px_1.5px_rgba(255,255,255,1)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.4),inset_0_1.5px_1.5px_rgba(255,255,255,0.18)]"
                    : "text-slate-600 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-[#F0F6FC] hover:bg-white/50 dark:hover:bg-white/5"
                }`}
              >
                {isActive && (
                  <div className="absolute left-1 top-2 bottom-2 w-[3.5px] bg-brand dark:bg-[#2563EB] rounded-full shadow-xs dark:shadow-[0_0_8px_#2563EB]" />
                )}

                <div className="flex items-center gap-3 min-w-0">
                  <item.icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? "text-brand dark:text-[#2563EB]" : "text-slate-400 dark:text-[#8D96A0] group-hover:text-slate-800 dark:group-hover:text-[#F0F6FC]"}`} />
                  {!collapsed && <span className="truncate">{item.name}</span>}
                </div>

                {!collapsed && (
                  <>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-brand dark:bg-[#2563EB] shadow-xs dark:shadow-[0_0_6px_#2563EB] shrink-0" />
                    )}

                    {item.badge && !isActive && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-brand/10 text-brand border border-brand/20 dark:bg-[#2563EB]/20 dark:text-[#2563EB] dark:border-[#2563EB]/30 shrink-0">
                        {item.badge}
                      </span>
                    )}

                    {item.unreadCount && !isActive && (
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-brand dark:text-[#2563EB] shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand dark:bg-[#2563EB] animate-pulse" />
                        <span>{item.unreadCount}</span>
                      </div>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Student Identity Profile Card */}
      <div className="p-3.5 border-t border-white/60 dark:border-white/10">
        {!collapsed ? (
          <div className="p-3 rounded-2xl bg-white/65 dark:bg-white/5 backdrop-blur-xl border border-white/80 dark:border-white/10 flex items-center justify-between group hover:border-white dark:hover:border-[#2563EB]/40 transition-colors shadow-2xs">
            <Link href="/profile" className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-9 h-9 rounded-xl p-[1px] bg-gradient-to-br from-brand to-cyan-400 shrink-0">
                <ProfileAvatar alt={studentName} size="sm" className="w-full h-full rounded-[10px] border-0" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-xs text-slate-900 dark:text-[#F0F6FC] truncate group-hover:text-brand dark:group-hover:text-[#2563EB] transition-colors">
                  {studentName}
                </span>
                <span className="font-mono text-[10px] text-slate-500 dark:text-[#8D96A0] tracking-wide">
                  ID: {studentId}
                </span>
                <span className="text-[9.5px] text-slate-400 dark:text-[#6E747D]">
                  CSE • 6th Sem
                </span>
              </div>
            </Link>

            <button
              type="button"
              onClick={() => {
                logout();
                router.push("/login");
              }}
              title="Sign Out"
              aria-label="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:text-slate-500 dark:hover:text-rose-400 dark:hover:bg-rose-500/10 rounded-lg transition-colors shrink-0 ml-1 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              logout();
              router.push("/login");
            }}
            title="Sign Out"
            className="w-10 h-10 mx-auto rounded-xl bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] flex items-center justify-center text-slate-400 hover:text-rose-600 dark:text-slate-500 dark:hover:text-rose-400 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
}
