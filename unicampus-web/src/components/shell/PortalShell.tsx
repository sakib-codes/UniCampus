"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { adminService } from "@/lib/services/adminService";
import { getPortalTitle, type PortalRole } from "@/lib/navigation";
import { PageTransition } from "@/components/common/PageTransition";
import { SideNav } from "@/components/shell/SideNav";
import { TopBar } from "@/components/shell/TopBar";
import { BottomTabs } from "@/components/shell/BottomTabs";
import { MoreSheet } from "@/components/shell/MoreSheet";

const emptySubscribe = () => () => {};

const WIDE_WORKSPACE_ROUTES = new Set([
  "/teacher/attendance",
  "/teacher/grades",
  "/teacher/dashboard",
  "/teacher/payroll",
  "/routine",
  "/dashboard/progress",
  "/payments",
  "/admin/finance",
  "/admin/routine",
  "/admin/users",
  "/admin/analytics",
  "/admin/departments",
  "/admin/notices",
]);

function subscribeXlBreakpoint(callback: () => void) {
  const mq = window.matchMedia("(min-width: 1280px)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getXlSnapshot() {
  return window.matchMedia("(min-width: 1280px)").matches;
}

interface PortalShellProps {
  role: PortalRole;
  children: React.ReactNode;
  onOpenShortcuts: () => void;
  onOpenCommand: () => void;
  isMoreOpen: boolean;
  onOpenMore: () => void;
  onCloseMore: () => void;
  isMessages?: boolean;
  isFullBleed?: boolean;
}

export function PortalShell({
  role,
  children,
  onOpenShortcuts,
  onOpenCommand,
  isMoreOpen,
  onOpenMore,
  onCloseMore,
  isMessages = false,
  isFullBleed = false,
}: PortalShellProps) {
  const pathname = usePathname();
  const { currentUser, isDeptAdmin, effectiveDeptId } = useAdminAuth();

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const isXl = useSyncExternalStore(
    subscribeXlBreakpoint,
    getXlSnapshot,
    () => true
  );

  const [collapsedOverride, setCollapsedOverride] = useState<boolean | null>(null);
  const [storageVersion, setStorageVersion] = useState(0);

  const collapsed = collapsedOverride ?? !isXl;

  // Unified `[` sidebar collapse shortcut
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== "[" || e.ctrlKey || e.metaKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      const isEditable =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        Boolean(target?.isContentEditable);
      if (isEditable) return;

      e.preventDefault();
      setCollapsedOverride((prev) => !(prev ?? !getXlSnapshot()));
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Refresh pending count on cross-tab storage, window focus, visibility change, or profile updates
  useEffect(() => {
    function refreshStorage() {
      setStorageVersion((v) => v + 1);
    }
    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        refreshStorage();
      }
    }
    window.addEventListener("storage", refreshStorage);
    window.addEventListener("focus", refreshStorage);
    window.addEventListener("unicampus:profiles-updated", refreshStorage);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.removeEventListener("storage", refreshStorage);
      window.removeEventListener("focus", refreshStorage);
      window.removeEventListener("unicampus:profiles-updated", refreshStorage);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Compute pending approvals count for Admin scoped by effectiveDeptId
  const pendingCount = useMemo(() => {
    if (!mounted || role !== "admin") return 0;
    void storageVersion;
    try {
      const profiles = adminService.getProfiles();
      const scopedDept =
        effectiveDeptId && effectiveDeptId !== "all"
          ? effectiveDeptId
          : isDeptAdmin
          ? currentUser?.department_id
          : null;
      const relevant = scopedDept
        ? profiles.filter((p) => p.department_id === scopedDept)
        : profiles;
      return relevant.filter((p) => !p.is_approved).length;
    } catch {
      return 0;
    }
  }, [mounted, role, storageVersion, currentUser, isDeptAdmin, effectiveDeptId]);

  // Close MoreSheet when route changes
  useEffect(() => {
    onCloseMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const { section, title, homeHref } = getPortalTitle(role, pathname);
  const isWideWorkspace = Boolean(
    pathname && WIDE_WORKSPACE_ROUTES.has(pathname.replace(/\/$/, ""))
  );

  return (
    <div className="h-dvh w-full overflow-hidden flex bg-canvas text-fg">
      <SideNav
        role={role}
        collapsed={collapsed}
        onToggleCollapse={() =>
          setCollapsedOverride((prev) => !(prev ?? !isXl))
        }
        pendingCount={pendingCount}
      />

      <main className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
        <TopBar
          role={role}
          section={section}
          title={title}
          homeHref={homeHref}
          onOpenCommand={onOpenCommand}
          onOpenShortcuts={onOpenShortcuts}
        />

        {isFullBleed || isMessages ? (
          <div className="flex-1 w-full min-h-0 overflow-hidden p-0 pb-16 md:pb-0">
            <PageTransition key={pathname} className="h-full">
              {children}
            </PageTransition>
          </div>
        ) : (
          <div
            className={`flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-4 sm:px-6 ${
              isWideWorkspace ? "xl:px-8" : "xl:px-10"
            } py-6 pb-24 md:pb-10`}
          >
            <div
              className={`${
                isWideWorkspace ? "max-w-[1600px]" : "max-w-[1240px]"
              } mx-auto w-full`}
            >
              <PageTransition key={pathname}>{children}</PageTransition>
            </div>
          </div>
        )}
      </main>

      <BottomTabs
        role={role}
        pendingCount={pendingCount}
        isMoreOpen={isMoreOpen}
        onOpenMore={onOpenMore}
      />

      <MoreSheet
        role={role}
        isOpen={isMoreOpen}
        onClose={onCloseMore}
        onOpenShortcuts={onOpenShortcuts}
      />
    </div>
  );
}
