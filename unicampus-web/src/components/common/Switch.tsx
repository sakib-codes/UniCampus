"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/components/ui";

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  ariaLabel?: string;
  size?: "sm" | "md";
  className?: string;
}

export function Switch({
  checked,
  onChange,
  disabled = false,
  ariaLabel,
  size = "md",
  className = "",
}: SwitchProps) {
  const isSm = size === "sm";
  const shouldReduceMotion = useReducedMotion();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={cn(
        "relative inline-flex shrink-0 cursor-pointer rounded-full transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 before:content-[''] before:absolute before:-inset-x-1.5",
        isSm
          ? "h-5 w-9 p-[2px] before:-inset-y-3"
          : "h-6 w-11 p-[2px] before:-inset-y-2.5",
        checked
          ? "bg-brand"
          : "bg-surface-2 ring-1 ring-inset ring-line",
        disabled ? "opacity-50 cursor-not-allowed" : "active:scale-95",
        className
      )}
    >
      <motion.span
        animate={{
          x: checked ? (isSm ? 16 : 20) : 0,
        }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 500, damping: 32 }
        }
        className={cn(
          "pointer-events-none inline-block rounded-full bg-on-brand shadow-xs",
          isSm ? "h-4 w-4" : "h-5 w-5"
        )}
      />
    </button>
  );
}

export default Switch;
