"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Lock,
  LogOut,
} from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import {
  PORTAL_NAV,
  isNavItemActive,
  resolveNavBadge,
  type PortalRole,
} from "@/lib/navigation";
import ProfileAvatar from "@/components/common/ProfileAvatar";

interface SideNavProps {
  role: PortalRole;
  collapsed: boolean;
  onToggleCollapse: () => void;
  pendingCount: number;
}

export function SideNav({
  role,
  collapsed,
  onToggleCollapse,
  pendingCount,
}: SideNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, isDeptAdmin, logout } = useAdminAuth();

  const config = PORTAL_NAV[role];

  const defaultName =
    role === "admin"
      ? "Syed Tariqul Islam"
      : role === "teacher"
      ? "Dr. Asif Rahman"
      : "Sakib Ahmed";

  const displayName = currentUser?.full_name || defaultName;
  const displayMeta =
    role === "admin"
      ? isDeptAdmin
        ? currentUser?.department_name || "Department Admin"
        : "Super Admin"
      : role === "teacher"
      ? currentUser?.department_name || "Faculty"
      : currentUser?.student_id || "Student";

  return (
    <aside
      aria-label={`${config.portalLabel} navigation`}
      className={`hidden md:flex flex-col justify-between shrink-0 h-dvh sticky top-0 bg-surface border-r border-line transition-[width] duration-200 select-none z-30 ${
        collapsed ? "w-[72px]" : "w-[240px]"
      }`}
    >
      {/* Top Brand + Nav Links */}
      <div className="flex flex-col flex-1 min-h-0">
        <div
          className={`h-16 flex items-center border-b border-line shrink-0 ${
            collapsed ? "px-3 justify-center" : "px-4 justify-between"
          }`}
        >
          <Link
            href={config.homeHref}
            className="flex items-center gap-2.5 min-w-0 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            title={`UniCampus ${config.portalLabel}`}
          >
            <div className="w-9 h-9 rounded-xl bg-brand-soft text-brand flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-[15px] font-semibold tracking-tight text-fg truncate leading-tight">
                  UniCampus
                </p>
                <p className="text-xs text-fg-muted truncate leading-tight">
                  {config.portalLabel}
                </p>
              </div>
            )}
          </Link>

          {!collapsed && (
            <button
              type="button"
              onClick={onToggleCollapse}
              title="Collapse sidebar ([)"
              aria-label="Collapse sidebar"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-fg-muted hover:text-fg hover:bg-surface-2 transition-colors cursor-pointer shrink-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {collapsed && (
          <div className="px-3 pt-3 flex justify-center">
            <button
              type="button"
              onClick={onToggleCollapse}
              title="Expand sidebar ([)"
              aria-label="Expand sidebar"
              className="w-11 h-9 rounded-xl flex items-center justify-center text-fg-muted hover:text-fg hover:bg-surface-2 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        <nav
          className={`flex-1 overflow-y-auto py-3 space-y-1 ${
            collapsed ? "px-2" : "px-3"
          }`}
        >
          {config.desktop.map((item) => {
            const isActive = isNavItemActive(pathname, item.href, item.exact);
            const badgeText = resolveNavBadge(item.badgeKey, role, pendingCount);
            const isRestrictedForDept = Boolean(isDeptAdmin && item.superAdminOnly);
            const Icon = item.icon;

            const badgeClass =
              item.badgeTone === "danger"
                ? "bg-danger-light text-danger"
                : item.badgeTone === "success"
                ? "bg-success-light text-success"
                : "bg-brand-soft text-brand";

            return (
              <Link
                key={item.id}
                href={item.href}
                title={collapsed ? item.label : undefined}
                aria-current={isActive ? "page" : undefined}
                className={`group relative flex items-center min-h-[44px] rounded-xl text-sm transition-colors ${
                  collapsed ? "justify-center px-2" : "gap-3 px-3"
                } ${
                  isActive
                    ? "bg-brand-soft text-brand font-semibold"
                    : isRestrictedForDept
                    ? "text-fg-subtle hover:bg-surface-2 hover:text-fg-muted font-medium"
                    : "text-fg-muted hover:bg-surface-2 hover:text-fg font-medium"
                }`}
              >
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-r-full bg-brand"
                  />
                )}
                <Icon className="w-[18px] h-[18px] shrink-0" />
                {!collapsed && (
                  <div className="flex-1 flex items-center justify-between gap-2 min-w-0">
                    <span className="truncate">{item.label}</span>
                    {badgeText && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[12px] font-medium leading-none shrink-0 tabular-nums ${badgeClass}`}
                      >
                        {badgeText}
                      </span>
                    )}
                    {isRestrictedForDept && (
                      <span
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-surface-2 text-fg-muted text-[12px] leading-none shrink-0"
                        title="Super Admin only"
                      >
                        <Lock className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Compact User Strip */}
      <div className="border-t border-line p-3 shrink-0">
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={() => {
                logout();
                router.push("/login");
              }}
              title="Sign out"
              aria-label="Sign out"
              className="w-11 h-11 rounded-xl flex items-center justify-center text-fg-muted hover:text-danger hover:bg-danger-light transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2 px-1.5 py-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <ProfileAvatar size="sm" alt={displayName} />
              <div className="min-w-0">
                <p className="text-sm font-medium text-fg truncate leading-tight">
                  {displayName}
                </p>
                <p className="text-xs text-fg-muted truncate leading-tight">
                  {displayMeta}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                logout();
                router.push("/login");
              }}
              title="Sign out"
              aria-label="Sign out"
              className="w-9 h-9 rounded-lg flex items-center justify-center text-fg-muted hover:text-danger hover:bg-danger-light transition-colors shrink-0 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
