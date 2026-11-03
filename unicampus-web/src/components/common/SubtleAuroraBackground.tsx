"use client";

import React from "react";

/**
 * SubtleAuroraBackground
 * Studio-grade neutral canvas with organic, colorful subtle fade colors.
 * Refracts through frosted glass cards in both Light Mode (alabaster) and Dark Mode (midnight).
 * Zero grid lines.
 */
export function SubtleAuroraBackground() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Light Mode Studio Base Gradient (Slide 1 & 4 Reference Ice-Blue Mist) */}
      <div 
        className="absolute inset-0 block dark:hidden transition-opacity duration-500"
        style={{
          background: "radial-gradient(ellipse 95% 85% at 50% -10%, #F8FAFD 0%, #F0F5FB 55%, #E5EFF9 100%)",
        }}
      />

      {/* Dark Mode Cosmic Base Gradient */}
      <div 
        className="absolute inset-0 hidden dark:block transition-opacity duration-500"
        style={{
          background: "radial-gradient(ellipse 95% 85% at 50% -10%, #0B1528 0%, #060A14 55%, #03050A 100%)",
        }}
      />

      {/* Colorful Subtle Fade Colors (Luminous Organic Aurora Blooms with Royal Cobalt Primary) */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Orb 1: Royal Cobalt Blue - Top Left */}
        <div className="absolute -top-28 -left-24 w-[740px] h-[740px] rounded-full bg-gradient-to-tr from-[#1D5BD8]/22 via-[#3B82F6]/14 to-transparent dark:from-[#1D5BD8]/32 dark:via-[#2563EB]/22 blur-[130px] opacity-90 dark:opacity-85 transition-all duration-700" />

        {/* Orb 2: Radiant Sky Blue / Cyan - Top Right */}
        <div className="absolute -top-24 -right-28 w-[700px] h-[700px] rounded-full bg-gradient-to-bl from-[#0EA5E9]/18 via-[#38BDF8]/12 to-transparent dark:from-[#06B6D4]/24 dark:via-[#0284C7]/18 blur-[125px] opacity-85 dark:opacity-80 transition-all duration-700" />

        {/* Orb 3: Soft Peach / Coral / Magenta - Center Right */}
        <div className="absolute top-1/3 -right-20 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-[#F43F5E]/13 via-[#FB923C]/10 to-transparent dark:from-[#EC4899]/20 dark:via-[#D946EF]/14 blur-[135px] opacity-80 dark:opacity-75 transition-all duration-700" />

        {/* Orb 4: Fresh Emerald / Mint - Bottom Left */}
        <div className="absolute -bottom-28 -left-20 w-[660px] h-[660px] rounded-full bg-gradient-to-tr from-[#10B981]/16 via-[#34D399]/11 to-transparent dark:from-[#10B981]/24 dark:via-[#059669]/16 blur-[130px] opacity-85 dark:opacity-80 transition-all duration-700" />

        {/* Orb 5: Warm Amber / Gold / Violet - Bottom Center/Right */}
        <div className="absolute -bottom-36 right-1/4 w-[640px] h-[640px] rounded-full bg-gradient-to-tl from-[#F59E0B]/13 via-[#A855F7]/10 to-transparent dark:from-[#F59E0B]/18 dark:via-[#D97706]/12 blur-[140px] opacity-80 dark:opacity-75 transition-all duration-700" />
      </div>
    </div>
  );
}
