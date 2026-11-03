"use client";

import { useEffect, useRef } from "react";
import { useInView, animate } from "framer-motion";

interface CountUpProps {
  to: number;
  from?: number;
  delay?: number;
  duration?: number;
  className?: string;
  startWhen?: boolean;
  separator?: string;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}

export default function CountUp({
  to,
  from = 0,
  delay = 0,
  duration = 0.7,
  className = "",
  startWhen = true,
  separator = "",
  decimals = 0,
  prefix = "",
  suffix = "",
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    if (!isInView || !startWhen) return;

    // Fast-in, snappy settle cubic-bezier curve (Linear / Apple design standard)
    const controls = animate(from, to, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        if (ref.current) {
          const formatted = latest.toFixed(decimals);
          const parts = formatted.split(".");

          if (separator) {
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
          }

          ref.current.textContent = `${prefix}${parts.join(".")}${suffix}`;
        }
      },
      onComplete: () => {
        if (ref.current) {
          const formatted = to.toFixed(decimals);
          const parts = formatted.split(".");
          if (separator) {
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
          }
          ref.current.textContent = `${prefix}${parts.join(".")}${suffix}`;
        }
      },
    });

    return () => controls.stop();
  }, [isInView, startWhen, from, to, duration, delay, decimals, separator, prefix, suffix]);

  const formattedFinal = `${prefix}${to.toFixed(decimals)}${suffix}`;

  return (
    <>
      <span className="sr-only">{formattedFinal}</span>
      <span ref={ref} className={className} aria-hidden="true">
        {prefix}
        {from.toFixed(decimals)}
        {suffix}
      </span>
    </>
  );
}
