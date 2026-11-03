"use client";

import { motion } from "framer-motion";
import React from "react";

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

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${
        isSm ? "h-5 w-9 p-[2px]" : "h-6 w-11 p-[2px]"
      } ${
        checked
          ? "bg-brand dark:bg-[#2563EB]"
          : "bg-slate-200 dark:bg-[#21262D] border border-slate-300 dark:border-[#30363D]"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "active:scale-95"} ${className}`}
    >
      <motion.span
        animate={{
          x: checked ? (isSm ? 16 : 20) : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 32,
        }}
        className={`pointer-events-none inline-block rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,0.18),0_1px_1px_rgba(0,0,0,0.1)] ${
          isSm ? "h-4 w-4" : "h-5 w-5"
        }`}
      />
    </button>
  );
}

export default Switch;

