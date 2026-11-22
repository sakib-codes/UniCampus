"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Building2,
  Check,
  ChevronDown,
  Globe,
  GraduationCap,
  Search,
} from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { adminService } from "@/lib/services/adminService";
import type { PortalRole } from "@/lib/navigation";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { NotificationsMenu } from "@/components/shell/NotificationsMenu";
import { AccountMenu } from "@/components/shell/AccountMenu";

const emptySubscribe = () => () => {};

interface TopBarProps {
  role: PortalRole;
  section: string;
  title: string;
  homeHref: string;
  onOpenCommand: () => void;
  onOpenShortcuts: () => void;
}

export function TopBar({
  role,
  section,
  title,
  homeHref,
  onOpenCommand,
  onOpenShortcuts,
}: TopBarProps) {
  const {
    isSuperAdmin,
    isDeptAdmin,
    adminDepartmentName,
    activeScopeDeptId,
    setActiveScopeDeptId,
    effectiveDeptId,
  } = useAdminAuth();

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const [scopeOpen, setScopeOpen] = useState(false);
  const scopeRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const departments = useMemo(() => {
    if (!mounted || role !== "admin") return [];
    try {
      return adminService.getDepartments();
    } catch {
      return [];
    }
  }, [mounted, role]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (scopeRef.current && !scopeRef.current.contains(event.target as Node)) {
        setScopeOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setScopeOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const activeScopeDepartment = departments.find((d) => d.id === effectiveDeptId);
  const activeScopeLabel = isDeptAdmin
    ? adminDepartmentName || activeScopeDepartment?.code || "Department"
    : activeScopeDeptId === "all"
    ? "All Departments"
    : departments.find((d) => d.id === activeScopeDeptId)?.code || "Department";

  return (
    <header className="h-14 sticky top-0 z-30 bg-surface/85 backdrop-blur-md border-b border-line px-3 sm:px-4 md:px-6 flex items-center justify-between gap-1.5 sm:gap-2 shrink-0 select-none">
      {/* Left: Mobile Brand Icon + Clean Title */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 flex-1">
        <Link
          href={homeHref}
          aria-label={`UniCampus ${section}`}
          className="md:hidden w-8 h-8 rounded-lg bg-brand-soft text-brand flex items-center justify-center shrink-0"
        >
          <GraduationCap className="w-[18px] h-[18px]" />
        </Link>

        <div className="flex items-center gap-2 min-w-0">
          <span className="hidden lg:inline text-sm text-fg-muted shrink-0">
            {section}
          </span>
          <span className="hidden lg:inline text-fg-subtle shrink-0">/</span>
          <span className="text-sm sm:text-[15px] font-semibold text-fg truncate">
            {title}
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
        {/* Admin Department Scope Switcher (hidden < sm to prevent 390px crowding; available in MoreSheet on mobile) */}
        {role === "admin" && (
          <div className="hidden sm:block relative" ref={scopeRef}>
            {isSuperAdmin ? (
              <>
                <button
                  type="button"
                  onClick={() => setScopeOpen((prev) => !prev)}
                  aria-label="Department scope"
                  aria-expanded={scopeOpen}
                  aria-haspopup="listbox"
                  className="h-9 px-3 rounded-lg bg-surface-2 border border-line text-sm font-medium text-fg hover:border-brand/40 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {activeScopeDeptId === "all" ? (
                    <Globe className="w-4 h-4 text-brand shrink-0" />
                  ) : (
                    <Building2 className="w-4 h-4 text-brand shrink-0" />
                  )}
                  <span className="max-w-[96px] lg:max-w-[160px] truncate">{activeScopeLabel}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-fg-muted shrink-0 transition-transform duration-200 ${
                      scopeOpen ? "rotate-180 text-brand" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {scopeOpen && (
                    <motion.div
                      role="listbox"
                      aria-label="Select department scope"
                      initial={
                        reduceMotion ? { opacity: 1 } : { opacity: 0, y: -8, scale: 0.92 }
                      }
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={
                        reduceMotion
                          ? { opacity: 0 }
                          : { opacity: 0, y: -6, scale: 0.95, transition: { duration: 0.14, ease: "easeIn" } }
                      }
                      transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 26,
                        mass: 0.8,
                      }}
                      className="absolute right-0 top-full mt-2 w-64 origin-top-right rounded-2xl border border-line bg-surface shadow-lg p-2 z-50"
                    >
                      <button
                        type="button"
                        role="option"
                        aria-selected={activeScopeDeptId === "all"}
                        onClick={() => {
                          setActiveScopeDeptId("all");
                          setScopeOpen(false);
                        }}
                        className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                          activeScopeDeptId === "all"
                            ? "bg-brand-soft text-brand"
                            : "text-fg hover:bg-surface-2"
                        }`}
                      >
                        <span className="flex items-center gap-2 min-w-0">
                          <Globe className="w-4 h-4 shrink-0" />
                          <span className="truncate">All Departments</span>
                        </span>
                        {activeScopeDeptId === "all" && (
                          <Check className="w-4 h-4 shrink-0" />
                        )}
                      </button>

                      <div className="my-1 border-t border-line" />

                      <div className="max-h-60 overflow-y-auto space-y-0.5">
                        {departments.map((dept) => {
                          const selected = activeScopeDeptId === dept.id;
                          return (
                            <button
                              key={dept.id}
                              type="button"
                              role="option"
                              aria-selected={selected}
                              onClick={() => {
                                setActiveScopeDeptId(dept.id);
                                setScopeOpen(false);
                              }}
                              className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                                selected
                                  ? "bg-brand-soft text-brand"
                                  : "text-fg-muted hover:text-fg hover:bg-surface-2"
                              }`}
                            >
                              <span className="flex items-center gap-2 min-w-0">
                                <span className="font-mono text-xs text-fg-subtle shrink-0">
                                  {dept.code}
                                </span>
                                <span className="truncate">{dept.name}</span>
                              </span>
                              {selected && <Check className="w-4 h-4 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <span className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-surface-2 border border-line text-sm font-medium text-fg-muted">
                <Building2 className="w-4 h-4 text-brand shrink-0" />
                <span className="max-w-[96px] lg:max-w-[160px] truncate">{activeScopeLabel}</span>
              </span>
            )}
          </div>
        )}

        {/* Search Trigger: 44x44 below sm, 36x36 on sm-lg, clean pill on lg+ */}
        <button
          type="button"
          onClick={onOpenCommand}
          aria-label="Search commands and routes"
          className="lg:hidden w-11 h-11 min-w-[44px] min-h-[44px] sm:w-9 sm:h-9 sm:min-h-9 sm:min-w-9 rounded-lg bg-surface-2 border border-line text-fg-muted hover:text-fg flex items-center justify-center transition-colors cursor-pointer"
        >
          <Search className="w-[18px] h-[18px]" />
        </button>

        <button
          type="button"
          onClick={onOpenCommand}
          aria-label="Open command palette"
          className="hidden lg:flex items-center justify-between gap-3 h-9 w-44 xl:w-64 px-3 rounded-lg bg-surface-2 border border-line text-fg-muted hover:text-fg hover:border-fg-subtle/50 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2 min-w-0">
            <Search className="w-4 h-4 shrink-0" />
            <span className="text-sm truncate">Search…</span>
          </span>
          <kbd className="px-1.5 py-0.5 rounded bg-surface border border-line font-mono text-xs text-fg-muted shrink-0">
            ⌘K
          </kbd>
        </button>

        <NotificationsMenu
          role={role}
          isSuperAdmin={isSuperAdmin}
          activeScopeLabel={activeScopeLabel}
        />

        <ThemeToggle size="sm" />

        <div className="hidden sm:block h-5 w-px bg-line shrink-0" aria-hidden="true" />

        <AccountMenu role={role} onOpenShortcuts={onOpenShortcuts} />
      </div>
    </header>
  );
}
