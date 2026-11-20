"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BarChart3,
  Keyboard,
  Lock,
  LogOut,
  Settings,
  TrendingUp,
  User as UserIcon,
  Users,
} from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { CANONICAL_FACULTY, CANONICAL_STUDENT } from "@/lib/canonicalCampus";
import type { PortalRole } from "@/lib/navigation";
import ProfileAvatar from "@/components/common/ProfileAvatar";

interface AccountMenuProps {
  role: PortalRole;
  onOpenShortcuts: () => void;
}

export function AccountMenu({ role, onOpenShortcuts }: AccountMenuProps) {
  const router = useRouter();
  const { currentUser, isSuperAdmin, isDeptAdmin, adminDepartmentName, logout } =
    useAdminAuth();
  const [open, setOpen] = useState(false);
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

  const defaultName =
    role === "admin"
      ? "Syed Tariqul Islam"
      : role === "teacher"
      ? CANONICAL_FACULTY.name
      : CANONICAL_STUDENT.name;

  const defaultEmail =
    role === "admin"
      ? "admin@unicampus.edu"
      : role === "teacher"
      ? CANONICAL_FACULTY.email
      : CANONICAL_STUDENT.email;

  const displayName = currentUser?.full_name || defaultName;
  const displayEmail = currentUser?.email || defaultEmail;

  const roleBadge =
    role === "admin"
      ? isSuperAdmin
        ? "Super Admin"
        : `${adminDepartmentName || "Department"} Admin`
      : role === "teacher"
      ? `${currentUser?.department_name || "CSE"} Faculty`
      : `${currentUser?.semester_name || "6th Sem"} • ${
          currentUser?.department_name || "CSE"
        }`;

  const links =
    role === "admin"
      ? [
          {
            href: "/admin/settings",
            label: "Global Settings",
            icon: Settings,
            locked: isDeptAdmin,
          },
          {
            href: "/admin/analytics",
            label: "Analytics",
            icon: BarChart3,
            locked: false,
          },
        ]
      : role === "teacher"
      ? [
          {
            href: "/teacher/profile",
            label: "Faculty Profile",
            icon: UserIcon,
            locked: false,
          },
          {
            href: "/teachers",
            label: "Faculty Directory",
            icon: Users,
            locked: false,
          },
          {
            href: "/settings",
            label: "Account Settings",
            icon: Settings,
            locked: false,
          },
        ]
      : [
          {
            href: "/profile",
            label: "My Profile",
            icon: UserIcon,
            locked: false,
          },
          {
            href: "/dashboard/progress",
            label: "Academic Progress",
            icon: TrendingUp,
            locked: false,
          },
          {
            href: "/settings",
            label: "Account Settings",
            icon: Settings,
            locked: false,
          },
        ];

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Account menu"
        aria-expanded={open}
        aria-haspopup="menu"
        className="min-w-[44px] min-h-[44px] sm:min-w-[40px] sm:min-h-[40px] rounded-xl flex items-center justify-center hover:bg-surface-2 transition-colors cursor-pointer"
      >
        <ProfileAvatar
          alt={displayName}
          size="sm"
          className="border border-line"
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            aria-label="Account options"
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-72 max-w-[320px] rounded-2xl border border-line bg-surface shadow-lg p-4 text-fg z-50"
          >
            {/* User Header */}
            <div className="flex items-center gap-3 pb-3.5 border-b border-line">
              <ProfileAvatar size="md" alt={displayName} />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-fg truncate">
                  {displayName}
                </p>
                <p className="text-xs text-fg-muted truncate">{displayEmail}</p>
                <span className="inline-block max-w-full truncate mt-1 px-2 py-0.5 rounded-full bg-brand-soft text-brand text-[12px] font-medium">
                  {roleBadge}
                </span>
              </div>
            </div>

            {/* Links */}
            <div className="py-2 space-y-0.5">
              {links.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-fg-muted hover:text-fg hover:bg-surface-2 transition-colors min-h-[44px]"
                  >
                    <span className="flex items-center gap-2.5 min-w-0">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </span>
                    {item.locked && (
                      <Lock className="w-3.5 h-3.5 text-fg-subtle shrink-0" />
                    )}
                  </Link>
                );
              })}

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  onOpenShortcuts();
                }}
                className="hidden md:flex w-full items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-fg-muted hover:text-fg hover:bg-surface-2 transition-colors min-h-[44px] cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <Keyboard className="w-4 h-4 shrink-0" />
                  <span>Keyboard Shortcuts</span>
                </span>
                <kbd className="px-1.5 py-0.5 rounded bg-surface-2 border border-line font-mono text-xs text-fg-muted">
                  ?
                </kbd>
              </button>
            </div>

            {/* Sign Out */}
            <div className="pt-2 border-t border-line">
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  logout();
                  setOpen(false);
                  router.push("/login");
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-danger hover:bg-danger-light transition-colors min-h-[44px] cursor-pointer"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
