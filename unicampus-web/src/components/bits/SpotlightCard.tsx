"use client";

import React, { useRef, useState, useCallback, ReactNode, MouseEvent } from "react";
import { SPOTLIGHT } from "@/lib/theme";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
  borderGlowColor?: string;
}

export default function SpotlightCard({
  children,
  className = "",
  spotlightColor = SPOTLIGHT.wash,
  borderGlowColor = SPOTLIGHT.glow,
  ...props
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: -1000, y: -1000 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || isFocused) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, [isFocused]);

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = (e: MouseEvent<HTMLDivElement>) => {
    if (divRef.current) {
      const rect = divRef.current.getBoundingClientRect();
      setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden transition-all duration-300 ease-out ${className}`}
      {...props}
    >
      {/* Dynamic Cursor Spotlight Surface Glow */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 ease-out z-0"
        style={{
          opacity,
          background: `radial-gradient(480px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 65%)`,
        }}
      />

      {/* Dynamic Cursor Border Highlight (Raycast / Linear border beam) */}
      <div
        className="pointer-events-none absolute -inset-px rounded-[inherit] transition-opacity duration-300 ease-out z-0 border border-transparent"
        style={{
          opacity,
          WebkitMaskImage: `radial-gradient(240px circle at ${position.x}px ${position.y}px, black 35%, transparent 75%)`,
          maskImage: `radial-gradient(240px circle at ${position.x}px ${position.y}px, black 35%, transparent 75%)`,
          borderColor: borderGlowColor,
        }}
      />

      {children}
    </div>
  );
}
