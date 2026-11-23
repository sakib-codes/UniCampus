"use client";

import React, { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "./cn";

export interface TabOption<T extends string = string> {
  id: T;
  label: React.ReactNode;
  icon?: React.ReactNode;
  count?: number | string | null;
  disabled?: boolean;
}

export interface TabsProps<T extends string = string> {
  tabs: readonly TabOption<T>[] | TabOption<T>[];
  value: T;
  onChange: (value: T) => void;
  layoutId?: string;
  variant?: "segmented" | "underline";
  size?: "sm" | "md" | "lg";
  className?: string;
  tabClassName?: string;
  activeTabClassName?: string;
  ariaLabel?: string;
}

const sizeClasses: Record<"sm" | "md" | "lg", string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-9 px-3.5 text-sm",
  lg: "h-10 px-4 text-sm",
};

export function Tabs<T extends string = string>({
  tabs,
  value,
  onChange,
  layoutId,
  variant = "segmented",
  size = "md",
  className,
  tabClassName,
  activeTabClassName,
  ariaLabel,
}: TabsProps<T>) {
  const autoId = useId();
  const resolvedLayoutId = layoutId ?? `tabs-indicator-${autoId}`;
  const shouldReduceMotion = useReducedMotion();

  const transition = shouldReduceMotion
    ? { duration: 0 }
    : ({ type: "spring", stiffness: 440, damping: 28, mass: 0.8 } as const);

  const isUnderline = variant === "underline";

  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      aria-label={ariaLabel}
      className={cn(
        isUnderline
          ? "flex items-center gap-1 border-b border-line overflow-x-auto max-w-full [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          : "inline-flex items-center gap-1 p-1 rounded-xl bg-surface-2 border border-line overflow-x-auto max-w-full [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === value;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            disabled={tab.disabled}
            onClick={() => !tab.disabled && onChange(tab.id)}
            className={cn(
              "relative inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer select-none focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 disabled:opacity-50 disabled:cursor-not-allowed",
              sizeClasses[size],
              isUnderline ? "rounded-t-xl" : "rounded-lg",
              isActive
                ? "text-fg font-semibold"
                : "text-fg-muted hover:text-fg",
              tabClassName
            )}
          >
            {isActive && (
              <motion.div
                layoutId={resolvedLayoutId}
                transition={transition}
                className={cn(
                  isUnderline
                    ? "absolute bottom-0 left-0 right-0 h-0.5 bg-brand rounded-full"
                    : "absolute inset-0 bg-surface border border-line/80 rounded-lg shadow-2xs z-0",
                  activeTabClassName
                )}
              />
            )}

            <span className="relative z-10 inline-flex items-center gap-1.5">
              {tab.icon && (
                <span className="shrink-0 inline-flex items-center" aria-hidden="true">
                  {tab.icon}
                </span>
              )}
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count !== null && (
                <span
                  className={cn(
                    "text-[12px] leading-none tabular-nums px-1.5 py-0.5 rounded-full transition-colors",
                    isActive
                      ? "bg-brand-soft text-brand font-semibold"
                      : "bg-surface text-fg-muted"
                  )}
                >
                  {tab.count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export interface TabPanelProps {
  tabKey: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Animated tab content container using a crisp 160ms ease-out reveal
 * synced with the segmented Tabs pill transition (honors prefers-reduced-motion).
 */
export function TabPanel({ tabKey, children, className }: TabPanelProps) {
  return (
    <div
      key={tabKey}
      role="tabpanel"
      className={cn("uc-tab-enter motion-reduce:animate-none", className)}
    >
      {children}
    </div>
  );
}
