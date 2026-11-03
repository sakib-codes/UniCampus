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
  Sparkles,
  BookOpen,
  CreditCard,
  Building2,
  TrendingUp,
  X,
  CheckSquare,
  FolderGit2,
  MessageSquare
} from "lucide-react";
import { themeTokens } from "@/lib/theme";

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
  const { theme, setTheme } = useTheme();
  const { currentUser, isAdmin } = useAdminAuth();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const commands: CommandItem[] = [
    // Navigation
    {
      id: "nav-dashboard",
      title: "Dashboard Overview",
      subtitle: "Live lectures, upcoming events & attendance",
      category: "Navigation",
      icon: Home,
      action: () => { router.push("/dashboard"); onClose(); },
      keywords: ["home", "main", "overview", "analytics"]
    },
    {
      id: "nav-routine",
      title: "Class Routine & Timetable",
      subtitle: "Weekly timetable schedule and rooms",
      category: "Navigation",
      icon: Calendar,
      badge: "Schedule",
      action: () => { router.push("/routine"); onClose(); },
      keywords: ["classes", "timetable", "schedule", "routine", "period"]
    },
    {
      id: "nav-notices",
      title: "Campus Notice Board",
      subtitle: "Official circulars and announcements",
      category: "Navigation",
      icon: Megaphone,
      badge: "Announcements",
      action: () => { router.push("/notices"); onClose(); },
      keywords: ["news", "circulars", "alerts", "announcements"]
    },
    {
      id: "nav-messages",
      title: "Campus Messenger & Direct Chat",
      subtitle: "Full messaging hub with advisors, study groups & offices",
      category: "Navigation",
      icon: MessageSquare,
      badge: "2 New",
      action: () => { router.push("/messages"); onClose(); },
      keywords: ["messages", "chat", "messenger", "inbox", "conversation", "dm"]
    },
    {
      id: "nav-teachers",
      title: "Faculty Directory",
      subtitle: "Find professors, consultation hours & emails",
      category: "Navigation",
      icon: Users,
      action: () => { router.push("/teachers"); onClose(); },
      keywords: ["professors", "faculty", "teachers", "staff", "instructors"]
    },
    {
      id: "nav-students",
      title: "Student Roster",
      subtitle: "Peer directory and cohort classmates",
      category: "Navigation",
      icon: GraduationCap,
      action: () => { router.push("/students"); onClose(); },
      keywords: ["peers", "classmates", "students", "batch"]
    },
    {
      id: "nav-materials",
      title: "Course Materials & Slides",
      subtitle: "Download lecture slides, lab manuals & assignments",
      category: "Academic",
      icon: FolderGit2,
      action: () => { router.push("/materials"); onClose(); },
      keywords: ["slides", "handouts", "pdf", "materials", "syllabus", "notes", "downloads"]
    },
    {
      id: "nav-progress",
      title: "Grades & Academic Progress",
      subtitle: "CGPA tracking, credits completed & progress",
      category: "Academic",
      icon: TrendingUp,
      action: () => { router.push("/dashboard/progress"); onClose(); },
      keywords: ["grades", "cgpa", "progress", "credits", "transcript"]
    },
    {
      id: "nav-profile",
      title: "Student Identity Profile",
      subtitle: "Personal information, student ID & records",
      category: "Navigation",
      icon: User,
      action: () => { router.push("/profile"); onClose(); },
      keywords: ["account", "id", "sakib", "bio"]
    },
    {
      id: "nav-settings",
      title: "Preferences & System Settings",
      subtitle: "Theme, privacy, notifications & display options",
      category: "Navigation",
      icon: Settings,
      action: () => { router.push("/settings"); onClose(); },
      keywords: ["preferences", "theme", "config", "appearance"]
    },

    // Quick Actions
    {
      id: "act-open-messages",
      title: "Campus Messenger & Direct Chat",
      subtitle: "Message professors, study groups, advisors & office",
      category: "Quick Actions",
      icon: MessageSquare,
      badge: "Chat",
      action: () => { window.dispatchEvent(new CustomEvent("open-messaging")); onClose(); },
      keywords: ["chat", "messages", "messenger", "dm", "advisor", "talk"]
    },
    {
      id: "act-toggle-theme",
      title: theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode",
      subtitle: theme === "dark" ? "High-contrast clean light mode" : "GitHub Deep Dark mode (#010409, #0D1117)",
      category: "Quick Actions",
      icon: theme === "dark" ? Sun : Moon,
      badge: "Theme",
      action: () => {
        executeThemeTransition({
          theme: theme === "dark" ? "light" : "dark",
          setTheme,
          currentTheme: theme,
        });
        onClose();
      },
      keywords: ["dark", "light", "mode", "color", "theme"]
    },
    {
      id: "act-latest-notice",
      title: "View Latest Pinned Notice",
      subtitle: "Mid-term registration deadline extension",
      category: "Quick Actions",
      icon: Sparkles,
      action: () => { router.push("/notices/1"); onClose(); },
      keywords: ["latest", "midterm", "exam", "notice"]
    },

    // Admin Console
    {
      id: "admin-console",
      title: "Admin Executive Console",
      subtitle: "User provisioning, timetable scheduling & finance",
      category: "Admin",
      icon: LayoutDashboard,
      badge: "Executive",
      action: () => { router.push("/admin/dashboard"); onClose(); },
      keywords: ["admin", "superadmin", "management", "control"]
    },
    {
      id: "admin-users",
      title: "Admin User Management",
      subtitle: "Verify pending faculty and student accounts",
      category: "Admin",
      icon: Users,
      action: () => { router.push("/admin/users"); onClose(); },
      keywords: ["provision", "verify", "users", "roles"]
    },
    {
      id: "admin-departments",
      title: "Curriculum & Departments",
      subtitle: "Manage programs, semesters & course curriculum",
      category: "Admin",
      icon: Building2,
      action: () => { router.push("/admin/departments"); onClose(); },
      keywords: ["curriculum", "syllabus", "subjects", "degrees"]
    },
    {
      id: "admin-finance",
      title: "Finance & Fee Payments",
      subtitle: "Tuition collection, payroll cycles & audit records",
      category: "Admin",
      icon: CreditCard,
      action: () => { router.push("/admin/finance"); onClose(); },
      keywords: ["tuition", "salary", "payroll", "fees", "money"]
    },

    // Faculty Console
    {
      id: "faculty-dashboard",
      title: "Faculty Workspace Overview",
      subtitle: "Teaching dashboard, syllabus progress & lecture countdown",
      category: "Faculty",
      icon: LayoutDashboard,
      badge: "Faculty",
      action: () => { router.push("/teacher/dashboard"); onClose(); },
      keywords: ["faculty", "teacher", "instructor", "teaching", "professor"]
    },
    {
      id: "faculty-attendance",
      title: "Take Session Attendance",
      subtitle: "Mark student present/absent/late with 1-click biometric sync",
      category: "Faculty",
      icon: CheckSquare,
      badge: "Live",
      action: () => { router.push("/teacher/attendance"); onClose(); },
      keywords: ["attendance", "roll", "present", "absent", "late", "session"]
    },
    {
      id: "faculty-grades",
      title: "Course Gradebook & Marks",
      subtitle: "Enter quiz, midterm, final marks & calculate GPA dynamically",
      category: "Faculty",
      icon: GraduationCap,
      action: () => { router.push("/teacher/grades"); onClose(); },
      keywords: ["grades", "marks", "exam", "gradebook", "gpa", "quiz"]
    },
    {
      id: "faculty-routine",
      title: "Teaching Schedule & Timetable",
      subtitle: "Assigned lecture rooms, labs, and office hours",
      category: "Faculty",
      icon: Calendar,
      action: () => { router.push("/teacher/routine"); onClose(); },
      keywords: ["schedule", "classes", "routine", "teaching", "consultation"]
    },
    {
      id: "faculty-materials",
      title: "Course Materials & Handouts",
      subtitle: "Distribute lecture slides, manuals, and problem sets",
      category: "Faculty",
      icon: FolderGit2,
      action: () => { router.push("/teacher/materials"); onClose(); },
      keywords: ["slides", "handouts", "pdf", "materials", "syllabus", "notes"]
    },
    {
      id: "faculty-notices",
      title: "Faculty Circulars & Directives",
      subtitle: "Official university circulars, meetings & exam board notices",
      category: "Faculty",
      icon: Megaphone,
      badge: "Notices",
      action: () => { router.push("/teacher/notices"); onClose(); },
      keywords: ["circulars", "notices", "directives", "faculty", "announcements"]
    }
  ];

  const isStudent = !currentUser || currentUser.role === 'student';
  const isTeacher = currentUser?.role === 'teacher';

  const roleAllowedCommands = commands.filter((cmd) => {
    // If student, strictly NEVER show Admin or Faculty commands
    if (isStudent && (cmd.category === 'Admin' || cmd.category === 'Faculty')) {
      return false;
    }
    // If teacher, strictly NEVER show Admin commands
    if (isTeacher && cmd.category === 'Admin') {
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
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
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
        setSelectedIndex((prev) => (prev - 1 + (filteredCommands.length || 1)) % (filteredCommands.length || 1));
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

  // Keep selected item scrolled into view
  useEffect(() => {
    if (listRef.current) {
      const activeElem = listRef.current.querySelector(`[data-index="${selectedIndex}"]`) as HTMLElement;
      if (activeElem) {
        activeElem.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div 
      className={`${themeTokens.modalOverlay} backdrop-blur-md  select-none`}
      onClick={onClose}
    >
      <div 
        className={`w-full max-w-xl max-h-[85vh] ${themeTokens.surface} border ${themeTokens.border} rounded-2xl shadow-2xl overflow-hidden flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className={`flex items-center px-4 py-3.5 border-b ${themeTokens.border} gap-3 bg-slate-50/50 dark:bg-[#161B22]/50`}>
          <Search className="w-4 h-4 text-slate-400 dark:text-[#6E747D] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or jump to a destination..."
            aria-label="Type a command or jump to a destination"
            className="flex-1 bg-transparent text-sm font-semibold text-slate-900 dark:text-[#F0F6FC] placeholder-slate-400 dark:placeholder-[#6E747D] outline-none focus:ring-2 focus:ring-brand/40 rounded px-1"
          />
          {query ? (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear query"
              className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-[#F0F6FC] transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-slate-400 dark:text-[#6E747D] bg-slate-200/60 dark:bg-[#21262D] px-1.5 py-0.5 rounded border border-slate-300/60 dark:border-[#30363D]">
              ESC
            </div>
          )}
        </div>

        {/* Command List */}
        <div 
          ref={listRef}
          className="max-h-[380px] min-h-0 overflow-y-auto p-2 space-y-1 divide-y divide-slate-100 dark:divide-[#21262D]/40"
        >
          {filteredCommands.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 dark:text-[#6E747D]">
              No software commands or routes found for &ldquo;<span className="font-bold text-slate-700 dark:text-[#F0F6FC]">{query}</span>&rdquo;
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              const Icon = cmd.icon;

              return (
                <div
                  key={cmd.id}
                  data-index={idx}
                  onClick={() => cmd.action()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all ${
                    isSelected 
                      ? "bg-brand text-white shadow-sm" 
                      : "text-slate-700 dark:text-[#8D96A0] hover:bg-slate-100 dark:hover:bg-[#161B22]"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 dark:bg-[#161B22] text-slate-600 dark:text-[#F0F6FC] border border-slate-200 dark:border-[#30363D]"
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold truncate ${
                          isSelected ? "text-white" : "text-slate-900 dark:text-[#F0F6FC]"
                        }`}>
                          {cmd.title}
                        </span>
                        {cmd.badge && (
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase tracking-wider ${
                            isSelected
                              ? "bg-white/25 text-white"
                              : "bg-slate-100 dark:bg-[#21262D] text-slate-600 dark:text-[#8D96A0] border border-slate-200 dark:border-[#30363D]"
                          }`}>
                            {cmd.badge}
                          </span>
                        )}
                      </div>
                      {cmd.subtitle && (
                        <p className={`text-[11px] truncate mt-0.5 ${
                          isSelected ? "text-white/80" : "text-slate-400 dark:text-[#6E747D]"
                        }`}>
                          {cmd.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pl-3 shrink-0">
                    <span className={`text-[10px] font-mono font-semibold uppercase tracking-wider ${
                      isSelected ? "text-white/70" : "text-slate-400 dark:text-[#6E747D]"
                    }`}>
                      {cmd.category}
                    </span>
                    <ArrowRight className={`w-3.5 h-3.5 ${
                      isSelected ? "text-white" : "text-slate-300 dark:text-[#30363D]"
                    }`} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className={`px-4 py-2 border-t ${themeTokens.border} bg-slate-50 dark:bg-[#161B22] flex items-center justify-between text-[11px] text-slate-500 dark:text-[#6E747D] font-mono`}>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-[#21262D] text-[10px] border border-slate-300 dark:border-[#30363D]">↑</kbd>
              <kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-[#21262D] text-[10px] border border-slate-300 dark:border-[#30363D]">↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-[#21262D] text-[10px] border border-slate-300 dark:border-[#30363D]">↵</kbd>
              Select
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Command className="w-3 h-3 text-brand" />
            <span className="font-sans font-semibold text-[10px] text-slate-600 dark:text-[#8D96A0]">UniCampus Command</span>
          </div>
        </div>
      </div>
    </div>
  );
}

