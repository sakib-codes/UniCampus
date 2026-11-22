"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "./cn";

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  ariaLabel?: string;
  id?: string;
  size?: "sm" | "md" | "lg";
  variant?: "surface" | "surface2";
  className?: string;
  menuAlign?: "left" | "right";
}

/**
 * Custom Calm Campus Dropdown Select (Linear / Slack / Discord / YouTube Studio pattern)
 * Replaces ugly OS-native <select> popups with a smooth, rounded, keyboard-accessible listbox.
 */
export function Select({
  value,
  onChange,
  options,
  placeholder = "Select...",
  disabled = false,
  ariaLabel,
  id,
  size = "md",
  variant = "surface2",
  className,
  menuAlign = "left",
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const selectedOption = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const heightClass =
    size === "sm" ? "h-9 text-xs" : size === "lg" ? "h-11 text-sm" : "h-10 text-xs";

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        id={id}
        type="button"
        disabled={disabled}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        className={cn(
          "w-full px-3 rounded-xl border text-left flex items-center justify-between gap-2 transition-colors cursor-pointer",
          "focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/15",
          "disabled:opacity-60 disabled:cursor-not-allowed",
          heightClass,
          variant === "surface" ? "bg-surface" : "bg-surface-2",
          open ? "border-brand ring-2 ring-brand/15" : "border-line hover:border-fg-subtle/50"
        )}
      >
        <span
          className={cn(
            "truncate font-medium",
            selectedOption ? "text-fg" : "text-fg-subtle"
          )}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 shrink-0 text-fg-muted transition-transform duration-150",
            open && "rotate-180 text-brand"
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="listbox"
            aria-label={ariaLabel}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -4, scale: 0.98, transition: { duration: 0.12 } }
            }
            transition={{ type: "spring", stiffness: 460, damping: 30, mass: 0.7 }}
            className={cn(
              "absolute top-full mt-1.5 min-w-full w-max max-w-[300px] z-50 rounded-xl bg-surface border border-line shadow-lg p-1.5 max-h-64 overflow-y-auto",
              menuAlign === "right" ? "right-0" : "left-0"
            )}
          >
            {options.length === 0 ? (
              <div className="px-3 py-2 text-xs text-fg-muted text-center">
                No options available
              </div>
            ) : (
              options.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    disabled={opt.disabled}
                    onClick={() => {
                      if (opt.disabled) return;
                      onChange(opt.value);
                      setOpen(false);
                    }}
                    className={cn(
                      "w-full px-2.5 py-2 rounded-lg text-left text-xs flex items-center justify-between gap-2.5 transition-colors cursor-pointer",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                      isSelected
                        ? "bg-brand-soft text-brand font-semibold"
                        : "text-fg hover:bg-surface-2 font-medium"
                    )}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-brand shrink-0" />}
                  </button>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
