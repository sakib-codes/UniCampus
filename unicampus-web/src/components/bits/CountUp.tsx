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

export function formatCountValue(
  value: number,
  decimals: number,
  separator: string,
  prefix: string,
  suffix: string
): string {
  const formatted = value.toFixed(decimals);
  const parts = formatted.split(".");
  if (separator) {
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  }
  return `${prefix}${parts.join(".")}${suffix}`;
}

export default function CountUp({
  to,
  from = 0,
  delay = 0,
  duration = 0.7,
  className = "",
  startWhen = true,
  separator = ",",
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
          ref.current.textContent = formatCountValue(
            latest,
            decimals,
            separator,
            prefix,
            suffix
          );
        }
      },
      onComplete: () => {
        if (ref.current) {
          ref.current.textContent = formatCountValue(
            to,
            decimals,
            separator,
            prefix,
            suffix
          );
        }
      },
    });

    return () => controls.stop();
  }, [isInView, startWhen, from, to, duration, delay, decimals, separator, prefix, suffix]);

  const formattedFinal = formatCountValue(to, decimals, separator, prefix, suffix);
  const formattedInitial = formatCountValue(from, decimals, separator, prefix, suffix);

  return (
    <>
      <span className="sr-only">{formattedFinal}</span>
      <span ref={ref} className={className} aria-hidden="true">
        {formattedInitial}
      </span>
    </>
  );
}
