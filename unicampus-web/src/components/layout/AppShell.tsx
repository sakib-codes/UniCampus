"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { AdminRoleGate } from "@/components/admin/AdminRoleGate";
import { TeacherSidebar } from "@/components/layout/TeacherSidebar";
import { TeacherHeader } from "@/components/layout/TeacherHeader";
import { TeacherRoleGate } from "@/components/teacher/TeacherRoleGate";
import { StatusBar } from "@/components/layout/StatusBar";
import { SubtleAuroraBackground } from "@/components/common/SubtleAuroraBackground";
import { themeTokens } from "@/lib/theme";
import { Command, Keyboard } from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { PageTransition } from "@/components/common/PageTransition";
import { executeThemeTransition } from "@/lib/themeTransition";

// Dynamic component imports for optimal bundle size (react-best-practices: bundle-dynamic-imports)
const CommandPalette = dynamic(
  () => import("@/components/common/CommandPalette").then((mod) => mod.CommandPalette),
  { ssr: false }
);
const KeyboardShortcutsModal = dynamic(
  () => import("@/components/common/KeyboardShortcutsModal").then((mod) => mod.KeyboardShortcutsModal),
  { ssr: false }
);
const MessagingDrawer = dynamic(
  () => import("@/components/common/MessagingDrawer").then((mod) => mod.MessagingDrawer),
  { ssr: false }
);
const MobileNavDrawer = dynamic(
  () => import("@/components/layout/MobileNavDrawer").then((mod) => mod.MobileNavDrawer),
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
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [pendingKey, setPendingKey] = useState<string | null>(null);

  const isSplash = pathname === "/splash" || pathname === "/" || pathname === "/login" || pathname === "/register";
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");
  const isTeacher = pathname === "/teacher" || pathname.startsWith("/teacher/");

  // Global Keyboard Shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isInput = 
        e.target instanceof HTMLInputElement || 
        e.target instanceof HTMLTextAreaElement || 
        (e.target as HTMLElement)?.isContentEditable;

      // Command Palette (Ctrl+K or Cmd+K)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
        return;
      }

      if (isInput) return;

      // Shortcuts Modal (?)
      if (e.key === "?") {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
        return;
      }

      // Theme toggle (T)
      if (e.key.toLowerCase() === "t" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        executeThemeTransition({
          theme: resolvedTheme === "dark" ? "light" : "dark",
          event: null,
          setTheme,
          currentTheme: resolvedTheme,
        });
        return;
      }

      // Two-key sequences (G then key)
      if (pendingKey === "g") {
        setPendingKey(null);
        const target = e.key.toLowerCase();
        if (target === "d") { router.push("/dashboard"); }
        else if (target === "f" && (currentUser?.role === 'teacher' || userIsAdmin)) { router.push("/teacher/dashboard"); }
        else if (target === "a" && userIsAdmin) { router.push("/admin/dashboard"); }
        else if (target === "r") { router.push("/routine"); }
        else if (target === "n") { router.push("/notices"); }
        else if (target === "t") { router.push("/teachers"); }
        else if (target === "s") { router.push("/students"); }
        else if (target === "m") { router.push("/dashboard/progress"); }
        else if (target === "c") { router.push("/messages"); }
        else if (target === "p") { router.push("/profile"); }
        return;
      }

      if (e.key.toLowerCase() === "g" && !e.ctrlKey && !e.metaKey) {
        setPendingKey("g");
        setTimeout(() => setPendingKey(null), 1000);
      }
    }

    // Custom event listeners
    function handleOpenCommand() {
      setIsCommandOpen(true);
    }

    function handleOpenMessaging(e: Event) {
      const detail = (e as CustomEvent<{ peerName?: string }>).detail;
      setMessagingPeerName(detail?.peerName ?? null);
      setIsMessagingOpen(true);
    }

    function handleOpenMobileNav() {
      setIsMobileNavOpen(true);
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleOpenCommand);
    window.addEventListener("open-messaging", handleOpenMessaging);
    window.addEventListener("open-mobile-nav", handleOpenMobileNav);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleOpenCommand);
      window.removeEventListener("open-messaging", handleOpenMessaging);
      window.removeEventListener("open-mobile-nav", handleOpenMobileNav);
    };
  }, [resolvedTheme, setTheme, pendingKey, router]);

  let mainLayout: React.ReactNode;

  if (isSplash) {
    mainLayout = (
      <div className="min-h-screen w-full bg-[#F0F4FA] dark:bg-[#070B14] relative selection:bg-[#1D5BD8] selection:text-white">
        <SubtleAuroraBackground />
        <div className="relative z-10">
          {children}
        </div>
      </div>
    );
  } else if (isAdmin) {
    mainLayout = (
      <AdminRoleGate>
        <div className="fixed inset-0 h-screen w-screen overflow-hidden flex bg-[#E2E7EE] dark:bg-[#070A12] relative">
          <SubtleAuroraBackground />
          <AdminSidebar />
          <main className="flex-1 flex flex-col h-full min-w-0 min-h-0 overflow-hidden relative z-10">
            <AdminHeader />
            <div className={`flex-1 min-h-0 [scrollbar-gutter:stable] ${pathname === '/messages' ? 'overflow-hidden p-0' : 'overflow-y-auto overflow-x-hidden px-4 md:px-8 py-5 pb-8'}`}>
              <PageTransition key={pathname}>
                {children}
              </PageTransition>
            </div>
            {/* Desktop Software Status Bar */}
            <StatusBar
              statusDotColor="bg-emerald-500"
              title="UniCampus Admin Web Console"
              subtitle="v1.2.0"
              onOpenShortcuts={() => setIsShortcutsOpen(true)}
              onOpenCommand={() => setIsCommandOpen(true)}
            />
          </main>
        </div>
      </AdminRoleGate>
    );
  } else if (isTeacher) {
    mainLayout = (
      <TeacherRoleGate>
        <div className="fixed inset-0 h-screen w-screen overflow-hidden flex bg-[#E2E7EE] dark:bg-[#070A12] relative">
          <SubtleAuroraBackground />
          <TeacherSidebar />
          <main className="flex-1 flex flex-col h-full min-w-0 min-h-0 overflow-hidden relative z-10">
            <TeacherHeader />
            <div className={`flex-1 min-h-0 [scrollbar-gutter:stable] ${pathname === '/messages' ? 'overflow-hidden p-0' : 'overflow-y-auto overflow-x-hidden px-4 md:px-8 py-5 pb-8'}`}>
              <PageTransition key={pathname}>
                {children}
              </PageTransition>
            </div>
            {/* Desktop Software Status Bar for Faculty Workspace */}
            <StatusBar
              statusDotColor="bg-blue-500"
              title="UniCampus Faculty Workspace"
              subtitle="v1.2.0 • Biometric Sync"
              onOpenShortcuts={() => setIsShortcutsOpen(true)}
              onOpenCommand={() => setIsCommandOpen(true)}
            />
          </main>
        </div>
      </TeacherRoleGate>
    );
  } else {
    mainLayout = (
      <div className="fixed inset-0 h-screen w-screen overflow-hidden flex bg-[#E2E7EE] dark:bg-[#070A12] relative">
        <SubtleAuroraBackground />
        <Sidebar />
        <main className="flex-1 flex flex-col h-full min-w-0 min-h-0 overflow-hidden relative z-10">
          <Header />
          <div className={`flex-1 min-h-0 [scrollbar-gutter:stable] ${pathname === '/messages' ? 'overflow-hidden p-0' : 'overflow-y-auto overflow-x-hidden px-4 md:px-8 py-4 pb-8'}`}>
            <PageTransition key={pathname}>
              {children}
            </PageTransition>
          </div>
          {/* Desktop Software Status Bar for Student Shell */}
          <StatusBar
            statusDotColor="bg-emerald-500"
            title="Live Campus Cloud"
            subtitle="Dhaka DC • 24ms"
            extraInfo="Fall 2026 • 6th Sem CSE"
            shortcutsLabel="Keys (?)"
            onOpenShortcuts={() => setIsShortcutsOpen(true)}
            onOpenCommand={() => setIsCommandOpen(true)}
          />
        </main>
      </div>
    );
  }

  return (
    <>
      {mainLayout}
      {isCommandOpen ? <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} /> : null}
      {isShortcutsOpen ? <KeyboardShortcutsModal isOpen={isShortcutsOpen} onClose={() => setIsShortcutsOpen(false)} /> : null}
      {isMessagingOpen ? (
        <MessagingDrawer
          isOpen={isMessagingOpen}
          initialPeerName={messagingPeerName}
          onClose={() => {
            setIsMessagingOpen(false);
            setMessagingPeerName(null);
          }}
        />
      ) : null}
      {isMobileNavOpen ? <MobileNavDrawer isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} /> : null}
    </>
  );
}
