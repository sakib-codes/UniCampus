"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { executeThemeTransition } from "@/lib/themeTransition";

interface ThemeToggleProps {
  className?: string;
  size?: "sm" | "md";
}

export function ThemeToggle({ className = "", size = "md" }: ThemeToggleProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const isLight = mounted && resolvedTheme === "light";

  const paddingClass = size === "sm" ? "p-1" : "p-1.5";
  const iconSize = size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5";

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
      className={`relative inline-flex items-center bg-slate-100 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] rounded-xl p-0.5 select-none shadow-xs transition-colors ${className}`}
      role="group"
      aria-label="Theme selection"
    >
      {/* Dark Theme Button */}
      <button
        type="button"
        onClick={(e) => handleThemeChange("dark", e)}
        title="Dark theme"
        aria-label="Dark theme"
        aria-pressed={isDark}
        className={`relative ${paddingClass} rounded-lg flex items-center justify-center transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand`}
      >
        {isDark && (
          <motion.div
            layoutId="theme-active-indicator"
            className="absolute inset-0 bg-slate-200 dark:bg-[#21262D] rounded-lg shadow-xs"
            transition={{ type: "spring", stiffness: 500, damping: 34 }}
          />
        )}
        <motion.span
          className={`relative z-10 flex items-center justify-center ${
            isDark
              ? "text-brand dark:text-[#2563EB]"
              : "text-slate-400 dark:text-[#6E747D] hover:text-slate-900 dark:hover:text-[#F0F6FC]"
          }`}
          whileTap={{ scale: 0.82 }}
          animate={{
            rotate: isDark ? 0 : -20,
            scale: isDark ? 1.08 : 0.94,
          }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          <Moon className={iconSize} />
        </motion.span>
      </button>

      {/* Light Theme Button */}
      <button
        type="button"
        onClick={(e) => handleThemeChange("light", e)}
        title="Light theme"
        aria-label="Light theme"
        aria-pressed={isLight}
        className={`relative ${paddingClass} rounded-lg flex items-center justify-center transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand`}
      >
        {isLight && (
          <motion.div
            layoutId="theme-active-indicator"
            className="absolute inset-0 bg-white text-amber-500 rounded-lg shadow-xs"
            transition={{ type: "spring", stiffness: 500, damping: 34 }}
          />
        )}
        <motion.span
          className={`relative z-10 flex items-center justify-center ${
            isLight
              ? "text-amber-500"
              : "text-slate-400 dark:text-[#6E747D] hover:text-slate-900 dark:hover:text-[#F0F6FC]"
          }`}
          whileTap={{ scale: 0.82 }}
          animate={{
            rotate: isLight ? 0 : 25,
            scale: isLight ? 1.08 : 0.94,
          }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          <Sun className={iconSize} />
        </motion.span>
      </button>
    </div>
  );
}

