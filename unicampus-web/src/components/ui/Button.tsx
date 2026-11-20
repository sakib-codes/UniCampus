import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "./cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand hover:bg-brand-hover text-on-brand border border-transparent",
  secondary:
    "bg-surface hover:bg-surface-2 text-fg border border-line",
  ghost:
    "bg-transparent text-fg-muted hover:text-fg hover:bg-surface-2 border border-transparent",
  danger:
    "bg-danger-light hover:bg-danger/15 text-danger border border-danger/25",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-[44px] px-3.5 py-2 text-xs",
  md: "min-h-[44px] px-4 py-2.5 text-sm",
  lg: "min-h-[44px] px-5 py-3 text-base",
};

export interface ButtonVariantsOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}

export function buttonVariants({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
}: ButtonVariantsOptions = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors duration-150 cursor-pointer select-none whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed",
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && "w-full",
    className
  );
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  type = "button",
  className,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = Boolean(disabled || loading);

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={buttonVariants({ variant, size, fullWidth, className })}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 shrink-0 motion-safe:animate-spin" aria-hidden="true" />
      ) : leftIcon ? (
        <span className="shrink-0 inline-flex items-center" aria-hidden="true">
          {leftIcon}
        </span>
      ) : null}
      {children}
      {!loading && rightIcon ? (
        <span className="shrink-0 inline-flex items-center" aria-hidden="true">
          {rightIcon}
        </span>
      ) : null}
    </button>
  );
}
