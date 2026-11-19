"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { executeThemeTransition } from "@/lib/themeTransition";

const emptySubscribe = () => () => {};

interface ThemeToggleProps {
  className?: string;
  size?: "sm" | "md";
}

export function ThemeToggle({ className = "", size = "md" }: ThemeToggleProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const isDark = mounted ? resolvedTheme === "dark" : false;

  const handleToggle = (e: React.MouseEvent) => {
    const currentMode = resolvedTheme || (typeof document !== "undefined" && document.documentElement.classList.contains("dark") ? "dark" : "light");
    const nextTheme = currentMode === "dark" ? "light" : "dark";
    executeThemeTransition({
      theme: nextTheme,
      event: e,
      setTheme,
      currentTheme: currentMode,
    });
  };

  const buttonSizeClass =
    size === "sm"
      ? "w-9 h-9 min-h-[44px] min-w-[44px]"
      : "w-10 h-10 min-h-[44px] min-w-[44px]";
  const iconSize = "w-4 h-4";

  return (
    <button
      type="button"
      onClick={handleToggle}
      title={mounted ? (isDark ? "Switch to light theme" : "Switch to dark theme") : "Toggle theme"}
      aria-label={mounted ? (isDark ? "Switch to light theme" : "Switch to dark theme") : "Toggle theme"}
      suppressHydrationWarning
      className={`group relative inline-flex items-center justify-center rounded-xl bg-surface border border-line text-fg-muted hover:text-fg hover:bg-surface-2 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand shadow-2xs select-none ${buttonSizeClass} ${className}`}
    >
      <span className="sr-only">Toggle theme</span>
      {/* Sun icon visible in dark mode */}
      <Sun
        className={`${iconSize} hidden dark:block text-amber-400 group-hover:rotate-45 transition-transform duration-200`}
        aria-hidden="true"
      />
      {/* Moon icon visible in light mode */}
      <Moon
        className={`${iconSize} block dark:hidden text-slate-700 group-hover:-rotate-12 transition-transform duration-200`}
        aria-hidden="true"
      />
    </button>
  );
}

export default ThemeToggle;
