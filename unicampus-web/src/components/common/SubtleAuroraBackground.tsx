"use client";

import React from "react";

/**
 * SubtleAuroraBackground
 * Studio-grade neutral canvas with subtle brand indigo glow.
 * Zero hardcoded hex colors, zero transition-all, GPU-only opacity transitions.
 */
export function SubtleAuroraBackground() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Light Mode Base Ambient Layer */}
      <div 
        className="absolute inset-0 block dark:hidden transition-opacity duration-300"
        style={{
          background: "radial-gradient(ellipse 95% 85% at 50% -10%, var(--canvas) 0%, var(--surface) 100%)",
        }}
      />

      {/* Dark Mode Base Ambient Layer */}
      <div 
        className="absolute inset-0 hidden dark:block transition-opacity duration-300"
        style={{
          background: "radial-gradient(ellipse 95% 85% at 50% -10%, var(--surface-2) 0%, var(--canvas) 100%)",
        }}
      />

      {/* Subtle Brand Indigo Ambient Blooms */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Orb 1: Primary Brand Bloom - Top Left */}
        <div className="absolute -top-28 -left-24 w-[600px] h-[600px] rounded-full bg-brand/10 dark:bg-brand/15 blur-[120px] opacity-80 transition-opacity duration-500" />

        {/* Orb 2: Secondary Ambient Bloom - Top Right */}
        <div className="absolute -top-24 -right-28 w-[550px] h-[550px] rounded-full bg-brand/5 dark:bg-brand/10 blur-[120px] opacity-70 transition-opacity duration-500" />

        {/* Orb 3: Subtle Lower Bloom - Bottom Center */}
        <div className="absolute -bottom-32 left-1/3 w-[500px] h-[500px] rounded-full bg-brand/5 dark:bg-brand/8 blur-[130px] opacity-60 transition-opacity duration-500" />
      </div>
    </div>
  );
}

export default SubtleAuroraBackground;
