"use client";

import React, { useSyncExternalStore } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export type CampusAnimationName = "rocket" | "routine" | "teacher";

const LOTTIE_SRC: Record<CampusAnimationName, string> = {
  rocket: "/lottie/rocket.lottie",
  routine: "/lottie/routine.lottie",
  teacher: "/lottie/teacher.lottie",
};

const emptySubscribe = () => () => {};

interface CampusLottieProps {
  name: CampusAnimationName;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
  speed?: number;
  ariaLabel?: string;
}

/**
 * Shared Lottie Animation Player for UniCampus Web
 * Uses the same `.lottie` animations as the Flutter mobile app,
 * respects `prefers-reduced-motion`, and renders safely on SSR.
 */
export function CampusLottie({
  name,
  className = "w-44 h-44",
  loop = true,
  autoplay = true,
  speed = 1,
  ariaLabel,
}: CampusLottieProps) {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const reducedMotion = useSyncExternalStore(
    emptySubscribe,
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );

  if (!mounted) {
    return <div className={className} aria-hidden="true" />;
  }

  return (
    <div
      className={`flex items-center justify-center select-none ${className}`}
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
    >
      <DotLottieReact
        src={LOTTIE_SRC[name]}
        loop={loop && !reducedMotion}
        autoplay={autoplay && !reducedMotion}
        speed={speed}
        className="w-full h-full"
      />
    </div>
  );
}
