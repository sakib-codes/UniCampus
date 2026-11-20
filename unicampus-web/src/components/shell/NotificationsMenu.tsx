"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Bell, CheckCheck } from "lucide-react";
import { ACTIVE_TERM } from "@/lib/canonicalCampus";
import type { PortalRole } from "@/lib/navigation";

interface NotificationsMenuProps {
  role: PortalRole;
  isSuperAdmin?: boolean;
  activeScopeLabel?: string;
}

interface NotificationItem {
  id: string;
  category: string;
  tone: "brand" | "warning" | "danger";
  time: string;
  title: string;
  href: string;
}

export function NotificationsMenu({
  role,
  isSuperAdmin = false,
  activeScopeLabel = "All Departments",
}: NotificationsMenuProps) {
  const [open, setOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const headerTitle =
    role === "admin"
      ? isSuperAdmin
        ? "Governance Alerts"
        : `${activeScopeLabel} Alerts`
      : role === "teacher"
      ? "Faculty Alerts"
      : "Notifications";

  const unreadLabel =
    role === "admin" ? "2 New" : role === "teacher" ? "1 New" : "3 New";

  const items: NotificationItem[] =
    role === "admin"
      ? [
          {
            id: "adm-1",
            category: "Registration",
            tone: "danger",
            time: "10 mins ago",
            title: "Pending faculty and student registrations awaiting approval.",
            href: "/admin/users",
          },
          {
            id: "adm-2",
            category: "Timetable",
            tone: "brand",
            time: "1 hr ago",
            title: `${ACTIVE_TERM} timetable and room allocations verified across 5 departments.`,
            href: "/admin/routine",
          },
        ]
      : role === "teacher"
      ? [
          {
            id: "tch-1",
            category: "Grade Submission",
            tone: "brand",
            time: "1 hr ago",
            title: `Midterm marks submission closes in 3 days for CSE-3101 (${ACTIVE_TERM}).`,
            href: "/teacher/grades",
          },
        ]
      : [
          {
            id: "stu-1",
            category: "Academics",
            tone: "warning",
            time: "2 hrs ago",
            title: `Final Examination Schedule (${ACTIVE_TERM}) released for all departments.`,
            href: "/notices/1",
          },
          {
            id: "stu-2",
            category: "Routine",
            tone: "brand",
            time: "5 hrs ago",
            title: "Class schedule updated: CSE-3101 (Algorithms) scheduled in Room 402.",
            href: "/routine",
          },
          {
            id: "stu-3",
            category: "Advising",
            tone: "brand",
            time: "1 day ago",
            title: "Course advising & pre-registration window schedule published.",
            href: "/notices/2",
          },
        ];

  const footerLink =
    role === "admin"
      ? { href: "/admin/analytics", label: "View analytics" }
      : role === "teacher"
      ? { href: "/teacher/notices", label: "View faculty notices" }
      : { href: "/notices", label: "View all notices" };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Notifications"
        aria-expanded={open}
        aria-haspopup="dialog"
        className="relative min-w-[44px] min-h-[44px] sm:min-w-[40px] sm:min-h-[40px] rounded-xl bg-surface-2 border border-line text-fg-muted hover:text-fg flex items-center justify-center transition-colors cursor-pointer"
      >
        <Bell className="w-[18px] h-[18px]" />
        {hasUnread && (
          <span
            aria-hidden="true"
            className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-brand ring-2 ring-surface"
          />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label={headerTitle}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="fixed inset-x-4 top-[4.5rem] sm:inset-x-auto sm:absolute sm:right-0 sm:top-full sm:mt-2 w-auto sm:w-96 sm:max-w-[384px] rounded-2xl border border-line bg-surface shadow-lg p-4 text-fg z-50"
          >
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <div className="flex items-center gap-2 min-w-0">
                <h3 className="text-sm font-semibold text-fg truncate">
                  {headerTitle}
                </h3>
                {hasUnread && (
                  <span className="px-2 py-0.5 rounded-full bg-brand-soft text-brand text-[12px] font-medium shrink-0">
                    {unreadLabel}
                  </span>
                )}
              </div>
              {hasUnread && (
                <button
                  type="button"
                  onClick={() => setHasUnread(false)}
                  className="text-xs font-medium text-brand hover:underline inline-flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark read</span>
                </button>
              )}
            </div>

            <div className="py-2 divide-y divide-line max-h-80 overflow-y-auto">
              {items.map((item) => {
                const catClass =
                  item.tone === "danger"
                    ? "text-danger"
                    : item.tone === "warning"
                    ? "text-warning"
                    : "text-brand";
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 px-2 rounded-xl hover:bg-surface-2 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs text-fg-muted mb-1">
                      <span className={`font-medium ${catClass}`}>{item.category}</span>
                      <span>{item.time}</span>
                    </div>
                    <p className="text-sm font-medium text-fg leading-snug line-clamp-2">
                      {item.title}
                    </p>
                  </Link>
                );
              })}
            </div>

            <div className="pt-2.5 border-t border-line text-center">
              <Link
                href={footerLink.href}
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
              >
                <span>{footerLink.label}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
