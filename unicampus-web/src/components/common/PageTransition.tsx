"use client";

import React from "react";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Lightweight, GPU-composited pure-opacity page reveal.
 * Avoids JS main-thread spring jitter and transform snapping during route mounts.
 */
export function PageTransition({ children, className = "" }: PageTransitionProps) {
  return (
    <div
      className={`w-full uc-page-enter motion-reduce:animate-none ${className}`}
    >
      {children}
    </div>
  );
}

export default PageTransition;
