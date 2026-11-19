import React from "react";
import { cn } from "./cn";

export type BadgeVariant = "neutral" | "brand" | "success" | "warning" | "danger";
export type BadgeAppearance = "soft" | "solid";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  appearance?: BadgeAppearance;
  dot?: boolean;
}

const softVariantClasses: Record<BadgeVariant, string> = {
  neutral: "bg-surface-2 text-fg-muted border-line",
  brand: "bg-brand-soft text-brand border-brand/20",
  success: "bg-success-light text-success border-success/20",
  warning: "bg-warning-light text-warning border-warning/20",
  danger: "bg-danger-light text-danger border-danger/20",
};

const solidVariantClasses: Record<BadgeVariant, string> = {
  neutral: "bg-fg text-surface border-fg",
  brand: "bg-brand text-on-brand border-brand",
  success: "bg-success text-on-brand border-success",
  warning: "bg-warning text-on-brand border-warning",
  danger: "bg-danger text-on-brand border-danger",
};

export function Badge({
  variant = "neutral",
  appearance = "soft",
  dot = false,
  className,
  children,
  ...props
}: BadgeProps) {
  const paletteClass =
    appearance === "solid"
      ? solidVariantClasses[variant]
      : softVariantClasses[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] leading-[1.35] font-medium border whitespace-nowrap",
        paletteClass,
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full bg-current shrink-0"
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
