"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Building2,
  Check,
  Globe,
  Lock,
  LogOut,
  Moon,
  Sun,
  X,
} from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { adminService } from "@/lib/services/adminService";
import { executeThemeTransition } from "@/lib/themeTransition";
import { PORTAL_NAV, isNavItemActive, type PortalRole } from "@/lib/navigation";

const emptySubscribe = () => () => {};

interface MoreSheetProps {
  role: PortalRole;
  isOpen: boolean;
  onClose: () => void;
  onOpenShortcuts?: () => void;
}

export function MoreSheet({
  role,
  isOpen,
  onClose,
}: MoreSheetProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();
  const {
    isSuperAdmin,
    isDeptAdmin,
    adminDepartmentName,
    activeScopeDeptId,
    setActiveScopeDeptId,
    logout,
  } = useAdminAuth();

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const reduceMotion = useReducedMotion();

  const departments = useMemo(() => {
    if (!mounted || !isOpen || role !== "admin") return [];
    try {
      return adminService.getDepartments();
    } catch {
      return [];
    }
  }, [mounted, isOpen, role]);

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const overflowItems = PORTAL_NAV[role].mobileOverflow;
  const isDark = resolvedTheme === "dark";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex items-end">
          <motion.button
            type="button"
            aria-label="Close menu"
            tabIndex={-1}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/45 dark:bg-black/70"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="More options"
            initial={reduceMotion ? { opacity: 1 } : { y: "100%" }}
            animate={{ y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { y: "100%" }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="relative z-10 w-full max-h-[85vh] overflow-y-auto rounded-t-2xl border-t border-line bg-surface shadow-lg px-4 pt-3 pb-[calc(1.25rem+env(safe-area-inset-bottom))]"
          >
            {/* Drag handle + Header */}
            <div className="w-10 h-1 rounded-full bg-line mx-auto mb-3" />
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <h2 className="text-[15px] font-semibold text-fg">
                {PORTAL_NAV[role].portalLabel} Menu
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-fg-muted hover:text-fg hover:bg-surface-2 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Overflow Navigation Links */}
            <div className="py-3 space-y-1">
              {overflowItems.map((item) => {
                const Icon = item.icon;
                const isActive = isNavItemActive(pathname, item.href, item.exact);
                const isRestricted = Boolean(isDeptAdmin && item.superAdminOnly);

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={onClose}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex items-center justify-between gap-3 px-3 min-h-[44px] rounded-xl text-[15px] transition-colors ${
                      isActive
                        ? "bg-brand-soft text-brand font-semibold"
                        : isRestricted
                        ? "text-fg-subtle hover:bg-surface-2 font-medium"
                        : "text-fg hover:bg-surface-2 font-medium"
                    }`}
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      <Icon className="w-5 h-5 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </span>
                    {isRestricted && (
                      <Lock className="w-4 h-4 text-fg-subtle shrink-0" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Admin Department Scope Switcher on Mobile */}
            {role === "admin" && (
              <div className="py-3 border-t border-line">
                <p className="px-3 mb-2 text-xs font-medium text-fg-muted">
                  Department Scope
                </p>
                {isSuperAdmin ? (
                  <div className="flex flex-wrap gap-2 px-1">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveScopeDeptId("all");
                        onClose();
                      }}
                      className={`min-h-[44px] px-3 rounded-xl border text-sm font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                        activeScopeDeptId === "all"
                          ? "bg-brand-soft border-brand text-brand"
                          : "bg-surface-2 border-line text-fg-muted hover:text-fg"
                      }`}
                    >
                      <Globe className="w-4 h-4" />
                      <span>All</span>
                      {activeScopeDeptId === "all" && (
                        <Check className="w-3.5 h-3.5" />
                      )}
                    </button>
                    {departments.map((dept) => {
                      const selected = activeScopeDeptId === dept.id;
                      return (
                        <button
                          key={dept.id}
                          type="button"
                          onClick={() => {
                            setActiveScopeDeptId(dept.id);
                            onClose();
                          }}
                          className={`min-h-[44px] px-3 rounded-xl border text-sm font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                            selected
                              ? "bg-brand-soft border-brand text-brand"
                              : "bg-surface-2 border-line text-fg-muted hover:text-fg"
                          }`}
                        >
                          <span>{dept.code}</span>
                          {selected && <Check className="w-3.5 h-3.5" />}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mx-3 px-3 py-2.5 rounded-xl bg-surface-2 border border-line text-sm text-fg-muted flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-brand shrink-0" />
                    <span className="truncate">
                      {adminDepartmentName || "Department"}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Utility Actions */}
            <div className="pt-3 border-t border-line space-y-1">
              <button
                type="button"
                onClick={(e) => {
                  executeThemeTransition({
                    theme: isDark ? "light" : "dark",
                    event: e,
                    setTheme,
                    currentTheme: resolvedTheme,
                  });
                }}
                className="w-full flex items-center justify-between px-3 min-h-[44px] rounded-xl text-[15px] font-medium text-fg hover:bg-surface-2 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-3">
                  {isDark ? (
                    <Sun className="w-5 h-5 text-warning" />
                  ) : (
                    <Moon className="w-5 h-5 text-brand" />
                  )}
                  <span>{isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}</span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  logout();
                  onClose();
                  router.push("/login");
                }}
                className="w-full flex items-center gap-3 px-3 min-h-[44px] rounded-xl text-[15px] font-medium text-danger hover:bg-danger-light transition-colors cursor-pointer"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
