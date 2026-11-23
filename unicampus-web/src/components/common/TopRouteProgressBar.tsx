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
  const [fading, setFading] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const trickleRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevPathRef = useRef(pathname);

  const clearTimers = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (fadeRef.current) clearTimeout(fadeRef.current);
    if (trickleRef.current) clearInterval(trickleRef.current);
  };

  // Complete progress bar smoothly whenever pathname settles:
  // 1) Glide width to 100% while fully visible (180ms)
  // 2) Fade opacity out smoothly (240ms) as the new page enters via uc-page-enter
  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      clearTimers();
      queueMicrotask(() => {
        setFading(false);
        setProgress(100);
        fadeRef.current = setTimeout(() => {
          setFading(true);
        }, 180);
        timerRef.current = setTimeout(() => {
          setVisible(false);
          setFading(false);
          setProgress(0);
        }, 440);
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
      setFading(false);
      setVisible(true);
      setProgress(22);
      trickleRef.current = setInterval(() => {
        setProgress((prev) => (prev < 86 ? prev + Math.max(1.8, (88 - prev) * 0.14) : prev));
      }, 140);
      // Failsafe cleanup in case navigation is aborted
      timerRef.current = setTimeout(() => {
        clearTimers();
        setVisible(false);
        setFading(false);
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
      className="fixed top-0 left-0 right-0 z-[100] h-[2.5px] pointer-events-none bg-transparent overflow-hidden"
    >
      <div
        className="h-full w-full origin-left bg-brand shadow-[0_0_8px_var(--brand)] transition-[transform,opacity] duration-200 ease-out"
        style={{
          transform: `scaleX(${Math.max(0, Math.min(1, progress / 100))})`,
          opacity: fading ? 0 : 1,
        }}
      />
    </div>
  );
}
