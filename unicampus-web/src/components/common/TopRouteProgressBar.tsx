"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * YouTube / GitHub-Style Top Route Progress Bar
 * Triggers immediately on internal link clicks and completes cleanly
 * once Next.js finishes the route transition.
 */
export function TopRouteProgressBar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const trickleRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevPathRef = useRef(pathname);

  const clearTimers = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (trickleRef.current) clearInterval(trickleRef.current);
  };

  // Complete progress bar whenever pathname settles
  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      clearTimers();
      queueMicrotask(() => {
        setProgress(100);
        timerRef.current = setTimeout(() => {
          setVisible(false);
          setProgress(0);
        }, 200);
      });
    }
  }, [pathname]);

  // Start progress bar on internal anchor navigation
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      const target = (e.target as HTMLElement | null)?.closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("http") ||
        target.getAttribute("target") === "_blank"
      ) {
        return;
      }
      if (href === window.location.pathname) return;

      clearTimers();
      setVisible(true);
      setProgress(24);
      trickleRef.current = setInterval(() => {
        setProgress((prev) => (prev < 86 ? prev + Math.max(2, (88 - prev) * 0.14) : prev));
      }, 140);
      // Failsafe cleanup in case navigation is aborted
      timerRef.current = setTimeout(() => {
        clearTimers();
        setVisible(false);
        setProgress(0);
      }, 8000);
    };

    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
      clearTimers();
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[100] h-[2.5px] pointer-events-none bg-transparent"
    >
      <div
        className="h-full bg-brand transition-[width,opacity] duration-150 ease-out"
        style={{
          width: `${progress}%`,
          opacity: progress >= 100 ? 0 : 1,
        }}
      />
    </div>
  );
}
