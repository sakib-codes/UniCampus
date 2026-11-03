"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

/**
 * ThemeUrlSync
 * Allows forcing theme via URL param (e.g. ?theme=light or ?theme=dark)
 * Runs purely on client-side mount without triggering Next.js Suspense de-opt.
 */
export function ThemeUrlSync() {
  const { setTheme } = useTheme();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const themeParam = params.get("theme");
    if (themeParam === "light") {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      setTheme("light");
    } else if (themeParam === "dark") {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
      setTheme("dark");
    }
  }, [setTheme]);

  return null;
}
