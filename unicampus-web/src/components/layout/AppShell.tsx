"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { AdminRoleGate } from "@/components/admin/AdminRoleGate";
import { TeacherRoleGate } from "@/components/teacher/TeacherRoleGate";
import { PortalShell } from "@/components/shell/PortalShell";
import type { PortalRole } from "@/lib/navigation";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { executeThemeTransition } from "@/lib/themeTransition";

const CommandPalette = dynamic(
  () =>
    import("@/components/common/CommandPalette").then(
      (mod) => mod.CommandPalette
    ),
  { ssr: false }
);
const KeyboardShortcutsModal = dynamic(
  () =>
    import("@/components/common/KeyboardShortcutsModal").then(
      (mod) => mod.KeyboardShortcutsModal
    ),
  { ssr: false }
);
const MessagingDrawer = dynamic(
  () =>
    import("@/components/common/MessagingDrawer").then(
      (mod) => mod.MessagingDrawer
    ),
  { ssr: false }
);

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();
  const { currentUser, isAdmin: userIsAdmin } = useAdminAuth();

  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);
  const [messagingPeerName, setMessagingPeerName] = useState<string | null>(null);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const pendingKeyRef = useRef<string | null>(null);
  const pendingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isSplash =
    pathname === "/splash" ||
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register";
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");
  const isTeacherPath = pathname === "/teacher" || pathname.startsWith("/teacher/");
  const isTeacherUser = currentUser?.role === "teacher";
  const isSharedRoute =
    pathname === "/messages" ||
    pathname === "/settings" ||
    pathname === "/teachers" ||
    pathname.startsWith("/teachers/");

  const isTeacher = isTeacherPath || (isTeacherUser && isSharedRoute && !isAdmin);
  const normalizedPath = pathname?.replace(/\/$/, "") || "";
  const isMessages = normalizedPath === "/messages";
  const isFullBleed =
    normalizedPath === "/messages" ||
    normalizedPath === "/notices" ||
    normalizedPath.startsWith("/notices/");

  const role: PortalRole = isAdmin ? "admin" : isTeacher ? "teacher" : "student";

  // Global keyboard shortcuts & custom shell events
  useEffect(() => {
    function clearPendingChord() {
      pendingKeyRef.current = null;
      if (pendingTimerRef.current) {
        clearTimeout(pendingTimerRef.current);
        pendingTimerRef.current = null;
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const isInput =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        Boolean(target?.isContentEditable);

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        clearPendingChord();
        setIsCommandOpen((prev) => !prev);
        return;
      }

      if (isInput) return;

      if (pendingKeyRef.current === "g") {
        if (["Shift", "Control", "Alt", "Meta"].includes(e.key)) {
          return;
        }
        clearPendingChord();
        if (e.ctrlKey || e.metaKey || e.altKey) {
          return;
        }
        const key = e.key.toLowerCase();
        if (key === "d") {
          const home =
            currentUser?.role === "admin"
              ? "/admin/dashboard"
              : currentUser?.role === "teacher"
              ? "/teacher/dashboard"
              : "/dashboard";
          router.push(home);
        } else if (
          key === "f" &&
          (currentUser?.role === "teacher" || userIsAdmin)
        ) {
          router.push("/teacher/dashboard");
        } else if (key === "a" && userIsAdmin) {
          router.push("/admin/dashboard");
        } else if (key === "r") {
          router.push("/routine");
        } else if (key === "n") {
          router.push("/notices");
        } else if (key === "t") {
          router.push("/teachers");
        } else if (key === "s") {
          router.push("/students");
        } else if (key === "m") {
          router.push("/dashboard/progress");
        } else if (key === "c") {
          router.push("/messages");
        } else if (key === "p") {
          router.push("/profile");
        }
        return;
      }

      if (e.key === "?") {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
        return;
      }

      if (
        e.key.toLowerCase() === "t" &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey
      ) {
        e.preventDefault();
        executeThemeTransition({
          theme: resolvedTheme === "dark" ? "light" : "dark",
          event: null,
          setTheme,
          currentTheme: resolvedTheme,
        });
        return;
      }

      if (
        e.key.toLowerCase() === "g" &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey
      ) {
        clearPendingChord();
        pendingKeyRef.current = "g";
        pendingTimerRef.current = setTimeout(() => {
          pendingKeyRef.current = null;
          pendingTimerRef.current = null;
        }, 1000);
      }
    }

    function handleOpenCommand() {
      setIsCommandOpen(true);
    }

    function handleOpenMessaging(e: Event) {
      const detail = (e as CustomEvent<{ peerName?: string }>).detail;
      setMessagingPeerName(detail?.peerName ?? null);
      setIsMessagingOpen(true);
    }

    function handleOpenMobileNav() {
      setIsMoreOpen(true);
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleOpenCommand);
    window.addEventListener("open-messaging", handleOpenMessaging);
    window.addEventListener("open-mobile-nav", handleOpenMobileNav);

    return () => {
      clearPendingChord();
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleOpenCommand);
      window.removeEventListener("open-messaging", handleOpenMessaging);
      window.removeEventListener("open-mobile-nav", handleOpenMobileNav);
    };
  }, [
    resolvedTheme,
    setTheme,
    router,
    currentUser?.role,
    userIsAdmin,
  ]);

  let mainLayout: React.ReactNode;

  if (isSplash) {
    mainLayout = (
      <div className="min-h-dvh w-full bg-canvas text-fg selection:bg-brand selection:text-on-brand">
        {children}
      </div>
    );
  } else {
    const shell = (
      <PortalShell
        role={role}
        isMessages={isMessages}
        isFullBleed={isFullBleed}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenCommand={() => setIsCommandOpen(true)}
        isMoreOpen={isMoreOpen}
        onOpenMore={() => setIsMoreOpen(true)}
        onCloseMore={() => setIsMoreOpen(false)}
      >
        {children}
      </PortalShell>
    );

    if (isAdmin) {
      mainLayout = <AdminRoleGate>{shell}</AdminRoleGate>;
    } else if (isTeacher) {
      mainLayout = <TeacherRoleGate>{shell}</TeacherRoleGate>;
    } else {
      mainLayout = shell;
    }
  }

  return (
    <>
      {mainLayout}
      {isCommandOpen ? (
        <CommandPalette
          isOpen={isCommandOpen}
          onClose={() => setIsCommandOpen(false)}
        />
      ) : null}
      {isShortcutsOpen ? (
        <KeyboardShortcutsModal
          isOpen={isShortcutsOpen}
          onClose={() => setIsShortcutsOpen(false)}
        />
      ) : null}
      {isMessagingOpen ? (
        <MessagingDrawer
          key={`${currentUser?.role ?? "student"}-${messagingPeerName ?? "default"}`}
          isOpen={isMessagingOpen}
          initialPeerName={messagingPeerName}
          onClose={() => {
            setIsMessagingOpen(false);
            setMessagingPeerName(null);
          }}
        />
      ) : null}
    </>
  );
}
