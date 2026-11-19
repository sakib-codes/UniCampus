"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { executeThemeTransition } from "@/lib/themeTransition";
import { useAdminAuth } from "@/context/AdminAuthContext";
import {
  Search,
  Home,
  Calendar,
  Megaphone,
  Users,
  GraduationCap,
  User,
  Settings,
  LayoutDashboard,
  Sun,
  Moon,
  ArrowRight,
  Command,
  CreditCard,
  Building2,
  TrendingUp,
  X,
  CheckSquare,
  FolderGit2,
  MessageSquare,
  BarChart3,
} from "lucide-react";

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  category: "Navigation" | "Academic" | "Quick Actions" | "Admin" | "Faculty";
  icon: React.ElementType;
  badge?: string;
  action: () => void;
  keywords?: string[];
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const { currentUser } = useAdminAuth();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const isDark = resolvedTheme === "dark";

  const commands: CommandItem[] = [
    // Navigation
    {
      id: "nav-dashboard",
      title: "Dashboard Overview",
      subtitle: "Live lectures, upcoming events & attendance",
      category: "Navigation",
      icon: Home,
      action: () => {
        router.push("/dashboard");
        onClose();
      },
      keywords: ["home", "main", "overview", "analytics"],
    },
    {
      id: "nav-routine",
      title: "Class Routine & Timetable",
      subtitle: "Weekly timetable schedule and rooms",
      category: "Navigation",
      icon: Calendar,
      badge: "Schedule",
      action: () => {
        router.push("/routine");
        onClose();
      },
      keywords: ["classes", "timetable", "schedule", "routine", "period"],
    },
    {
      id: "nav-notices",
      title: "Campus Notice Board",
      subtitle: "Official circulars and announcements",
      category: "Navigation",
      icon: Megaphone,
      badge: "Announcements",
      action: () => {
        router.push("/notices");
        onClose();
      },
      keywords: ["news", "circulars", "alerts", "announcements"],
    },
    {
      id: "nav-messages",
      title: "Campus Messenger & Direct Chat",
      subtitle: "Full messaging hub with advisors, study groups & offices",
      category: "Navigation",
      icon: MessageSquare,
      badge: currentUser?.role === "teacher" ? "4 New" : "2 New",
      action: () => {
        router.push("/messages");
        onClose();
      },
      keywords: ["messages", "chat", "messenger", "inbox", "conversation", "dm"],
    },
    {
      id: "nav-teachers",
      title: "Faculty Directory",
      subtitle: "Find professors, consultation hours & emails",
      category: "Navigation",
      icon: Users,
      action: () => {
        router.push("/teachers");
        onClose();
      },
      keywords: ["professors", "faculty", "teachers", "staff", "instructors"],
    },
    {
      id: "nav-students",
      title: "Student Roster",
      subtitle: "Peer directory and cohort classmates",
      category: "Navigation",
      icon: GraduationCap,
      action: () => {
        router.push("/students");
        onClose();
      },
      keywords: ["peers", "classmates", "students", "batch"],
    },
    {
      id: "nav-materials",
      title: "Course Materials & Slides",
      subtitle: "Download lecture slides, lab manuals & assignments",
      category: "Academic",
      icon: FolderGit2,
      action: () => {
        router.push("/materials");
        onClose();
      },
      keywords: ["slides", "handouts", "pdf", "materials", "syllabus", "notes", "downloads"],
    },
    {
      id: "nav-progress",
      title: "Grades & Academic Progress",
      subtitle: "CGPA tracking, credits completed & progress",
      category: "Academic",
      icon: TrendingUp,
      action: () => {
        router.push("/dashboard/progress");
        onClose();
      },
      keywords: ["grades", "cgpa", "progress", "credits", "transcript"],
    },
    {
      id: "nav-profile",
      title: "Student Identity Profile",
      subtitle: "Personal information, student ID & records",
      category: "Navigation",
      icon: User,
      action: () => {
        router.push("/profile");
        onClose();
      },
      keywords: ["account", "id", "sakib", "bio"],
    },
    {
      id: "nav-settings",
      title: "Preferences & System Settings",
      subtitle: "Theme, privacy, notifications & display options",
      category: "Navigation",
      icon: Settings,
      action: () => {
        router.push("/settings");
        onClose();
      },
      keywords: ["preferences", "theme", "config", "appearance"],
    },

    // Quick Actions
    {
      id: "act-open-messages",
      title: "Open Quick Messenger",
      subtitle: "Message professors, study groups, advisors & office",
      category: "Quick Actions",
      icon: MessageSquare,
      badge: "Chat",
      action: () => {
        window.dispatchEvent(new CustomEvent("open-messaging"));
        onClose();
      },
      keywords: ["chat", "messages", "messenger", "dm", "advisor", "talk"],
    },
    {
      id: "act-toggle-theme",
      title: isDark ? "Switch to Light Mode" : "Switch to Dark Mode",
      subtitle: isDark
        ? "Calm Campus light surface palette"
        : "Calm Campus dark surface palette",
      category: "Quick Actions",
      icon: isDark ? Sun : Moon,
      badge: "Theme",
      action: () => {
        executeThemeTransition({
          theme: isDark ? "light" : "dark",
          setTheme,
          currentTheme: resolvedTheme,
        });
        onClose();
      },
      keywords: ["dark", "light", "mode", "color", "theme"],
    },
    {
      id: "act-latest-notice",
      title: "View Latest Pinned Notice",
      subtitle: "Final Examination Schedule Spring 2026",
      category: "Quick Actions",
      icon: Megaphone,
      action: () => {
        router.push("/notices/1");
        onClose();
      },
      keywords: ["latest", "midterm", "exam", "notice", "spring", "2026"],
    },

    // Admin Console
    {
      id: "admin-console",
      title: "Admin Overview",
      subtitle: "User provisioning, timetable scheduling & finance",
      category: "Admin",
      icon: LayoutDashboard,
      badge: "Admin",
      action: () => {
        router.push("/admin/dashboard");
        onClose();
      },
      keywords: ["admin", "superadmin", "management", "overview"],
    },
    {
      id: "admin-users",
      title: "Admin User Management",
      subtitle: "Verify pending faculty and student accounts",
      category: "Admin",
      icon: Users,
      action: () => {
        router.push("/admin/users");
        onClose();
      },
      keywords: ["provision", "verify", "users", "roles", "approvals"],
    },
    {
      id: "admin-departments",
      title: "Departments & Curriculum",
      subtitle: "Manage programs, semesters & course curriculum",
      category: "Admin",
      icon: Building2,
      action: () => {
        router.push("/admin/departments");
        onClose();
      },
      keywords: ["curriculum", "syllabus", "subjects", "degrees", "departments"],
    },
    {
      id: "admin-routine",
      title: "Master Routine & Rooms",
      subtitle: "Schedule department classes and room assignments",
      category: "Admin",
      icon: Calendar,
      action: () => {
        router.push("/admin/routine");
        onClose();
      },
      keywords: ["routine", "timetable", "rooms", "schedule", "admin"],
    },
    {
      id: "admin-notices",
      title: "Admin Notices",
      subtitle: "Publish and manage official campus circulars",
      category: "Admin",
      icon: Megaphone,
      action: () => {
        router.push("/admin/notices");
        onClose();
      },
      keywords: ["notices", "circulars", "announcements", "admin"],
    },
    {
      id: "admin-finance",
      title: "Finance & Fee Payments",
      subtitle: "Tuition collection, payroll cycles & records",
      category: "Admin",
      icon: CreditCard,
      action: () => {
        router.push("/admin/finance");
        onClose();
      },
      keywords: ["tuition", "salary", "payroll", "fees", "finance"],
    },
    {
      id: "admin-analytics",
      title: "Analytics",
      subtitle: "Enrollment trends, attendance & institutional metrics",
      category: "Admin",
      icon: BarChart3,
      action: () => {
        router.push("/admin/analytics");
        onClose();
      },
      keywords: ["analytics", "reports", "metrics", "charts", "admin"],
    },
    {
      id: "admin-settings",
      title: "Global Settings",
      subtitle: "University-wide preferences and access controls",
      category: "Admin",
      icon: Settings,
      action: () => {
        router.push("/admin/settings");
        onClose();
      },
      keywords: ["settings", "global", "superadmin", "config"],
    },

    // Faculty Console
    {
      id: "faculty-dashboard",
      title: "Faculty Workspace Home",
      subtitle: "Teaching dashboard, syllabus progress & upcoming lectures",
      category: "Faculty",
      icon: LayoutDashboard,
      badge: "Faculty",
      action: () => {
        router.push("/teacher/dashboard");
        onClose();
      },
      keywords: ["faculty", "teacher", "instructor", "teaching", "professor"],
    },
    {
      id: "faculty-attendance",
      title: "Attendance Register",
      subtitle: "Start QR/PIN session and mark student attendance",
      category: "Faculty",
      icon: CheckSquare,
      badge: "Live",
      action: () => {
        router.push("/teacher/attendance");
        onClose();
      },
      keywords: ["attendance", "roll", "present", "absent", "late", "session"],
    },
    {
      id: "faculty-grades",
      title: "Course Gradebook & Marks",
      subtitle: "Enter quiz, midterm, final marks & calculate GPA",
      category: "Faculty",
      icon: GraduationCap,
      action: () => {
        router.push("/teacher/grades");
        onClose();
      },
      keywords: ["grades", "marks", "exam", "gradebook", "gpa", "quiz"],
    },
    {
      id: "faculty-routine",
      title: "Assigned Courses & Schedule",
      subtitle: "Assigned lecture rooms, labs, and office hours",
      category: "Faculty",
      icon: Calendar,
      action: () => {
        router.push("/teacher/routine");
        onClose();
      },
      keywords: ["schedule", "classes", "routine", "teaching", "consultation"],
    },
    {
      id: "faculty-materials",
      title: "Course Materials & Handouts",
      subtitle: "Distribute lecture slides, manuals, and problem sets",
      category: "Faculty",
      icon: FolderGit2,
      action: () => {
        router.push("/teacher/materials");
        onClose();
      },
      keywords: ["slides", "handouts", "pdf", "materials", "syllabus", "notes"],
    },
    {
      id: "faculty-notices",
      title: "Faculty Circulars & Notices",
      subtitle: "Official university circulars, meetings & exam notices",
      category: "Faculty",
      icon: Megaphone,
      badge: "Notices",
      action: () => {
        router.push("/teacher/notices");
        onClose();
      },
      keywords: ["circulars", "notices", "directives", "faculty", "announcements"],
    },
  ];

  const isStudent = !currentUser || currentUser.role === "student";
  const isTeacher = currentUser?.role === "teacher";

  const roleAllowedCommands = commands.filter((cmd) => {
    if (isStudent && (cmd.category === "Admin" || cmd.category === "Faculty")) {
      return false;
    }
    if (isTeacher && cmd.category === "Admin") {
      return false;
    }
    return true;
  });

  const filteredCommands = roleAllowedCommands.filter((cmd) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    const titleMatch = cmd.title.toLowerCase().includes(q);
    const subMatch = cmd.subtitle?.toLowerCase().includes(q);
    const keywordMatch = cmd.keywords?.some((k) => k.toLowerCase().includes(q));
    const catMatch = cmd.category.toLowerCase().includes(q);
    return titleMatch || subMatch || keywordMatch || catMatch;
  });

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(
          (prev) =>
            (prev - 1 + (filteredCommands.length || 1)) %
            (filteredCommands.length || 1)
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  useEffect(() => {
    if (listRef.current) {
      const activeElem = listRef.current.querySelector(
        `[data-index="${selectedIndex}"]`
      ) as HTMLElement | null;
      if (activeElem) {
        activeElem.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 dark:bg-black/70 select-none"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div
        className="w-full max-w-xl max-h-[85vh] bg-surface border border-line rounded-[20px] shadow-lg overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-line gap-3 bg-surface-2">
          <Search className="w-4 h-4 text-fg-muted shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or jump to a destination..."
            aria-label="Type a command or jump to a destination"
            className="flex-1 bg-transparent text-sm font-medium text-fg placeholder:text-fg-muted outline-none rounded px-1"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSelectedIndex(0);
              }}
              aria-label="Clear query"
              className="p-1.5 rounded-lg text-fg-muted hover:text-fg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="px-2 py-0.5 rounded-md bg-surface border border-line font-mono text-xs text-fg-muted">
              ESC
            </kbd>
          )}
        </div>

        {/* Command List */}
        <div
          ref={listRef}
          className="max-h-[380px] min-h-0 overflow-y-auto p-2 space-y-1"
        >
          {filteredCommands.length === 0 ? (
            <div className="py-12 text-center text-sm text-fg-muted">
              No commands or routes found for &ldquo;
              <span className="font-semibold text-fg">{query}</span>&rdquo;
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              const Icon = cmd.icon;

              return (
                <button
                  key={cmd.id}
                  type="button"
                  data-index={idx}
                  onClick={() => cmd.action()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-brand text-on-brand"
                      : "text-fg-muted hover:bg-surface-2 hover:text-fg"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected
                          ? "bg-on-brand/15 text-on-brand"
                          : "bg-surface-2 text-fg border border-line"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-semibold truncate ${
                            isSelected ? "text-on-brand" : "text-fg"
                          }`}
                        >
                          {cmd.title}
                        </span>
                        {cmd.badge && (
                          <span
                            className={`text-[12px] font-medium px-2 py-0.5 rounded-full shrink-0 ${
                              isSelected
                                ? "bg-on-brand/20 text-on-brand"
                                : "bg-surface-2 text-fg-muted border border-line"
                            }`}
                          >
                            {cmd.badge}
                          </span>
                        )}
                      </div>
                      {cmd.subtitle && (
                        <p
                          className={`text-xs truncate mt-0.5 ${
                            isSelected ? "text-on-brand/85" : "text-fg-muted"
                          }`}
                        >
                          {cmd.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pl-3 shrink-0">
                    <span
                      className={`text-xs font-medium ${
                        isSelected ? "text-on-brand/85" : "text-fg-muted"
                      }`}
                    >
                      {cmd.category}
                    </span>
                    <ArrowRight
                      className={`w-3.5 h-3.5 ${
                        isSelected ? "text-on-brand" : "text-fg-subtle"
                      }`}
                    />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="px-4 py-2.5 border-t border-line bg-surface-2 flex items-center justify-between text-xs text-fg-muted">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-surface border border-line font-mono text-xs text-fg">
                ↑
              </kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-surface border border-line font-mono text-xs text-fg">
                ↓
              </kbd>
              <span>Navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-surface border border-line font-mono text-xs text-fg">
                ↵
              </kbd>
              <span>Select</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Command className="w-3.5 h-3.5 text-brand" />
            <span className="font-medium text-fg-muted">UniCampus Command</span>
          </div>
        </div>
      </div>
    </div>
  );
}
