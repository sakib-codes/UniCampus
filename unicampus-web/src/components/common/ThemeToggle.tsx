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
      ? "w-11 h-11 min-h-[44px] min-w-[44px] sm:w-9 sm:h-9 sm:min-h-0 sm:min-w-0"
      : "w-11 h-11 min-h-[44px] min-w-[44px] sm:w-10 sm:h-10 sm:min-h-0 sm:min-w-0";
  const iconSize = "w-4 h-4";

  return (
    <button
      type="button"
      onClick={handleToggle}
      title={mounted ? (isDark ? "Switch to light theme" : "Switch to dark theme") : "Toggle theme"}
      aria-label={mounted ? (isDark ? "Switch to light theme" : "Switch to dark theme") : "Toggle theme"}
      suppressHydrationWarning
      className={`group relative inline-flex items-center justify-center rounded-lg bg-transparent border border-transparent text-fg-muted hover:text-fg hover:bg-surface-2 active:scale-90 transition-[background-color,border-color,color,transform] duration-140 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand select-none ${buttonSizeClass} ${className}`}
    >
      <span className="sr-only">Toggle theme</span>
      {/* Sun icon visible in dark mode */}
      <Sun
        className={`${iconSize} hidden dark:block text-warning group-hover:rotate-45 transition-transform duration-200`}
        aria-hidden="true"
      />
      {/* Moon icon visible in light mode */}
      <Moon
        className={`${iconSize} block dark:hidden text-fg-muted group-hover:-rotate-12 transition-transform duration-200`}
        aria-hidden="true"
      />
    </button>
  );
}

export default ThemeToggle;
