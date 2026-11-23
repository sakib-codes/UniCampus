"use client";

import { useRef, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { SunIcon, type SunIconHandle } from "@/components/icons/sun";
import { MoonIcon, type MoonIconHandle } from "@/components/icons/moon";
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

  const sunRef = useRef<SunIconHandle>(null);
  const moonRef = useRef<MoonIconHandle>(null);

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

  return (
    <button
      type="button"
      onClick={handleToggle}
      onMouseEnter={() => {
        sunRef.current?.startAnimation();
        moonRef.current?.startAnimation();
      }}
      onMouseLeave={() => {
        sunRef.current?.stopAnimation();
        moonRef.current?.stopAnimation();
      }}
      title={mounted ? (isDark ? "Switch to light theme" : "Switch to dark theme") : "Toggle theme"}
      aria-label={mounted ? (isDark ? "Switch to light theme" : "Switch to dark theme") : "Toggle theme"}
      suppressHydrationWarning
      className={`group relative inline-flex items-center justify-center rounded-lg bg-transparent border border-transparent text-fg-muted hover:text-fg hover:bg-surface-2 active:scale-90 transition-[background-color,border-color,color,transform] duration-140 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand select-none ${buttonSizeClass} ${className}`}
    >
      <span className="sr-only">Toggle theme</span>
      {/* Sun icon visible in dark mode */}
      <span className="hidden dark:inline-flex items-center justify-center text-warning" aria-hidden="true">
        <SunIcon ref={sunRef} size={16} />
      </span>
      {/* Moon icon visible in light mode */}
      <span className="inline-flex dark:hidden items-center justify-center text-fg-muted" aria-hidden="true">
        <MoonIcon ref={moonRef} size={16} />
      </span>
    </button>
  );
}

export default ThemeToggle;
