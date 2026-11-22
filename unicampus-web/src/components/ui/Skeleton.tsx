import React from "react";
import { cn } from "./cn";

export type SkeletonVariant = "rect" | "circle" | "text";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
}

const variantClasses: Record<SkeletonVariant, string> = {
  rect: "rounded-xl",
  circle: "rounded-full",
  text: "rounded-md",
};

/**
 * Production Shimmer Skeleton (YouTube / Facebook / Slack pattern)
 * Uses a smooth diagonal shimmer wave (.uc-shimmer) instead of jarring opacity blinking,
 * automatically respecting prefers-reduced-motion.
 */
export function Skeleton({
  variant = "rect",
  width,
  height,
  style,
  className,
  ...props
}: SkeletonProps) {
  const hasWidthOverride =
    width !== undefined || /(?:^|\s)w-\S+/.test(className ?? "");
  const hasHeightOverride =
    height !== undefined || /(?:^|\s)h-\S+/.test(className ?? "");

  return (
    <div
      aria-hidden="true"
      style={{
        width,
        height,
        ...style,
      }}
      className={cn(
        "uc-shimmer",
        variantClasses[variant],
        variant === "text" && !hasHeightOverride && "h-4",
        variant === "text" && !hasWidthOverride && "w-full",
        className
      )}
      {...props}
    />
  );
}

/** Crisp brand-matched circular spinner for inline async states */
export function InlineSpinner({
  size = "sm",
  className,
  label = "Loading",
}: {
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  label?: string;
}) {
  const sizeClass =
    size === "xs"
      ? "w-3.5 h-3.5"
      : size === "sm"
        ? "w-4 h-4"
        : size === "md"
          ? "w-5 h-5"
          : "w-7 h-7";

  return (
    <span
      role="status"
      aria-label={label}
      className={cn("inline-flex items-center justify-center shrink-0", className)}
    >
      <svg
        className={cn("animate-spin text-brand", sizeClass)}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="currentColor"
          strokeWidth="2.5"
          className="opacity-20"
        />
        <path
          d="M21 12a9 9 0 0 0-9-9"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

/** Layout-matched skeleton for Admin Users directory table (zero CLS) */
export function TableRowsSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div
      className="bg-surface rounded-2xl border border-line overflow-hidden"
      aria-busy="true"
      aria-label="Loading user directory"
    >
      <div className="px-4 py-3 bg-surface-2 border-b border-line grid grid-cols-12 gap-3">
        <Skeleton variant="text" className="col-span-4 h-3.5 w-24" />
        <Skeleton variant="text" className="col-span-2 h-3.5 w-14 hidden md:block" />
        <Skeleton variant="text" className="col-span-2 h-3.5 w-16 hidden md:block" />
        <Skeleton variant="text" className="col-span-2 h-3.5 w-20 hidden md:block" />
        <Skeleton variant="text" className="col-span-2 h-3.5 w-14 ml-auto" />
      </div>
      <div className="divide-y divide-line">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="px-4 py-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Skeleton variant="circle" className="w-9 h-9 shrink-0" />
              <div className="space-y-2 flex-1 max-w-[220px]">
                <Skeleton variant="text" className="h-3.5 w-36" />
                <Skeleton variant="text" className="h-3 w-44" />
              </div>
            </div>
            <Skeleton variant="rect" className="h-6 w-16 rounded-full hidden md:block" />
            <Skeleton variant="text" className="h-3.5 w-24 hidden lg:block" />
            <Skeleton variant="rect" className="h-6 w-20 rounded-full" />
            <Skeleton variant="circle" className="w-8 h-8 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Layout-matched skeleton for Admin Departments grid (zero CLS) */
export function DepartmentCardsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
      aria-busy="true"
      aria-label="Loading departments"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-5 rounded-2xl bg-surface border border-line space-y-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2 flex-1">
              <Skeleton variant="rect" className="h-5 w-16 rounded-md" />
              <Skeleton variant="text" className="h-5 w-48" />
              <Skeleton variant="text" className="h-3.5 w-36" />
            </div>
            <Skeleton variant="circle" className="w-10 h-10 shrink-0" />
          </div>
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-line">
            <Skeleton variant="rect" className="h-12 rounded-xl" />
            <Skeleton variant="rect" className="h-12 rounded-xl" />
            <Skeleton variant="rect" className="h-12 rounded-xl" />
          </div>
          <div className="flex items-center gap-2 pt-1">
            <Skeleton variant="rect" className="h-9 flex-1 rounded-xl" />
            <Skeleton variant="rect" className="h-9 flex-1 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}
