"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { motion, useReducedMotion } from "framer-motion";
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
  const reduceMotion = useReducedMotion();

  const isDark = mounted && resolvedTheme === "dark";
  const isLight = mounted && resolvedTheme === "light";

  const buttonSizeClass = size === "sm" ? "w-9 min-h-[44px]" : "w-10 min-h-[44px]";
  const iconSize = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";

  const handleThemeChange = (target: "dark" | "light", e: React.MouseEvent) => {
    executeThemeTransition({
      theme: target,
      event: e,
      setTheme,
      currentTheme: resolvedTheme,
    });
  };

  return (
    <div
      className={`relative inline-flex items-center bg-surface-2 border border-line rounded-xl p-0.5 select-none transition-colors ${className}`}
      role="group"
      aria-label="Theme selection"
      suppressHydrationWarning
    >
      {/* Dark Theme Button */}
      <button
        type="button"
        onClick={(e) => handleThemeChange("dark", e)}
        title="Dark theme"
        aria-label="Dark theme"
        aria-pressed={isDark}
        suppressHydrationWarning
        className={`relative ${buttonSizeClass} rounded-lg flex items-center justify-center transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand`}
      >
        {isDark && (
          <motion.div
            layoutId="theme-active-indicator"
            className="absolute inset-0 bg-surface border border-line rounded-lg"
            transition={
              reduceMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 500, damping: 34 }
            }
          />
        )}
        <span
          className={`relative z-10 flex items-center justify-center transition-transform duration-200 ${
            isDark ? "text-brand scale-105" : "text-fg-muted hover:text-fg"
          }`}
        >
          <Moon className={iconSize} />
        </span>
      </button>

      {/* Light Theme Button */}
      <button
        type="button"
        onClick={(e) => handleThemeChange("light", e)}
        title="Light theme"
        aria-label="Light theme"
        aria-pressed={isLight}
        suppressHydrationWarning
        className={`relative ${buttonSizeClass} rounded-lg flex items-center justify-center transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand`}
      >
        {isLight && (
          <motion.div
            layoutId="theme-active-indicator"
            className="absolute inset-0 bg-surface border border-line rounded-lg"
            transition={
              reduceMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 500, damping: 34 }
            }
          />
        )}
        <span
          className={`relative z-10 flex items-center justify-center transition-transform duration-200 ${
            isLight ? "text-warning scale-105" : "text-fg-muted hover:text-fg"
          }`}
        >
          <Sun className={iconSize} />
        </span>
      </button>
    </div>
  );
}
