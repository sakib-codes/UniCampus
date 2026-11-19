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
        "bg-surface-2 motion-safe:animate-pulse",
        variantClasses[variant],
        variant === "text" && !hasHeightOverride && "h-4",
        variant === "text" && !hasWidthOverride && "w-full",
        className
      )}
      {...props}
    />
  );
}
