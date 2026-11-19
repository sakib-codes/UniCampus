import React from "react";
import { User } from "lucide-react";
import { cn } from "./cn";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export interface AvatarProps {
  src?: string | null;
  name?: string;
  alt?: string;
  size?: AvatarSize;
  className?: string;
  iconClassName?: string;
}

const sizeDimensions: Record<
  AvatarSize,
  { width: string; height: string; text: string }
> = {
  xs: { width: "w-6", height: "h-6", text: "text-[12px]" },
  sm: { width: "w-8", height: "h-8", text: "text-[12px]" },
  md: { width: "w-10", height: "h-10", text: "text-sm" },
  lg: { width: "w-12", height: "h-12", text: "text-sm" },
  xl: { width: "w-16", height: "h-16", text: "text-lg" },
  "2xl": {
    width: "w-28 sm:w-32",
    height: "h-28 sm:h-32",
    text: "text-2xl",
  },
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) {
    return Array.from(parts[0]).slice(0, 2).join("").toUpperCase();
  }
  const firstChar = Array.from(parts[0])[0] ?? "";
  const lastChar = Array.from(parts[parts.length - 1])[0] ?? "";
  return `${firstChar}${lastChar}`.toUpperCase();
}

export function Avatar({
  src,
  name,
  alt = "",
  size = "md",
  className = "",
  iconClassName = "",
}: AvatarProps) {
  const hasWidthOverride = /(?:^|\s)w-\S+/.test(className);
  const hasHeightOverride = /(?:^|\s)h-\S+/.test(className);
  const hasTextSizeOverride =
    /(?:^|\s)text-(?:xs|sm|base|lg|xl|[2-9]xl|\[[^\]]+\])(?:\/\S+)?(?:\s|$)/.test(
      className
    );
  const hasBgOverride = /(?:^|\s)bg-\S+/.test(className);
  const hasRoundedOverride = /(?:^|\s)rounded(?:-\S+)?(?:\s|$)/.test(className);

  const dims = sizeDimensions[size];
  const resolvedRoundedClass = hasRoundedOverride ? "" : "rounded-full";

  const accessibleLabel = (alt || name || "").trim();
  const initials = !src && name ? getInitials(name) : "";

  return (
    <div
      {...(!src
        ? accessibleLabel
          ? { role: "img", "aria-label": accessibleLabel }
          : { "aria-hidden": true as const }
        : {})}
      className={cn(
        "text-fg-muted border border-line flex items-center justify-center shrink-0 select-none overflow-hidden",
        !hasBgOverride && "bg-surface-2",
        resolvedRoundedClass,
        !hasWidthOverride && dims.width,
        !hasHeightOverride && dims.height,
        !hasTextSizeOverride && dims.text,
        className
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={accessibleLabel}
          className="w-full h-full object-cover"
        />
      ) : initials ? (
        <span className="font-semibold leading-none">{initials}</span>
      ) : (
        <User
          className={cn("w-1/2 h-1/2 stroke-[2]", iconClassName)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
