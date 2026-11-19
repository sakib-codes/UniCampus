import React from "react";
import { cn } from "./cn";

export type ChipTone = "fg" | "brand";

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  count?: number | string;
  icon?: React.ReactNode;
  label?: React.ReactNode;
  tone?: ChipTone;
}

export interface ChipRowProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
}

export function Chip({
  active = false,
  count,
  icon,
  label,
  tone = "fg",
  type = "button",
  className,
  children,
  ...props
}: ChipProps) {
  const activeClasses =
    tone === "brand"
      ? "bg-brand text-on-brand border-brand"
      : "bg-fg text-surface border-fg";

  return (
    <button
      type={type}
      aria-pressed={props["aria-pressed"] ?? (props.role === "tab" ? undefined : active)}
      className={cn(
        "min-h-[44px] px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap shrink-0 inline-flex items-center justify-center gap-2 border transition-colors duration-150 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed",
        active
          ? activeClasses
          : "bg-surface text-fg-muted border-line hover:text-fg hover:bg-surface-2",
        className
      )}
      {...props}
    >
      {icon && (
        <span className="shrink-0 inline-flex items-center" aria-hidden="true">
          {icon}
        </span>
      )}
      <span>{label ?? children}</span>
      {count !== undefined && (
        <span
          className={cn(
            "text-[12px] leading-none tabular-nums px-1.5 py-0.5 rounded-full",
            active
              ? "bg-surface/20 text-current"
              : "bg-surface-2 text-fg-muted"
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}

export function ChipRow({ label, className, children, ...props }: ChipRowProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
