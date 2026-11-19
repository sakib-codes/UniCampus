"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  PORTAL_NAV,
  isNavItemActive,
  resolveNavBadge,
  type PortalRole,
} from "@/lib/navigation";

interface BottomTabsProps {
  role: PortalRole;
  pendingCount: number;
  isMoreOpen: boolean;
  onOpenMore: () => void;
}

export function BottomTabs({
  role,
  pendingCount,
  isMoreOpen,
  onOpenMore,
}: BottomTabsProps) {
  const pathname = usePathname();
  const tabs = PORTAL_NAV[role].mobileTabs;

  return (
    <nav
      aria-label="Mobile navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-surface/95 backdrop-blur-md border-t border-line pb-[env(safe-area-inset-bottom)] select-none"
    >
      <div className="grid grid-cols-5 h-16 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const badge = resolveNavBadge(tab.badgeKey, role, pendingCount);

          if (tab.action === "more" || !tab.href) {
            return (
              <button
                key={tab.id}
                type="button"
                onClick={onOpenMore}
                aria-expanded={isMoreOpen}
                className={`min-h-[44px] flex flex-col items-center justify-center gap-1 rounded-xl transition-colors cursor-pointer ${
                  isMoreOpen ? "text-brand" : "text-fg-muted hover:text-fg"
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="text-[12px] font-medium leading-none truncate max-w-full px-0.5">
                  {tab.label}
                </span>
              </button>
            );
          }

          const isActive = isNavItemActive(pathname, tab.href, tab.exact);

          return (
            <Link
              key={tab.id}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              className={`relative min-h-[44px] flex flex-col items-center justify-center gap-1 rounded-xl transition-colors ${
                isActive ? "text-brand font-semibold" : "text-fg-muted hover:text-fg font-medium"
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5 shrink-0" />
                {badge === "Live" ? (
                  <span
                    aria-label="Live attendance session"
                    className="absolute -top-0.5 -right-1 w-2.5 h-2.5 rounded-full bg-success ring-2 ring-surface"
                  />
                ) : badge ? (
                  <span
                    aria-label={`${badge} notifications`}
                    className={`absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] px-1 rounded-full text-[12px] font-semibold leading-none flex items-center justify-center tabular-nums ${
                      tab.badgeKey === "pendingApprovals"
                        ? "bg-danger text-on-brand"
                        : "bg-brand text-on-brand"
                    }`}
                  >
                    {badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[12px] leading-none truncate max-w-full px-0.5">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
