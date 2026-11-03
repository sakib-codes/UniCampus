import React from "react";
import { User } from "lucide-react";

export interface ProfileAvatarProps {
  className?: string;
  iconClassName?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  alt?: string;
}

export default function ProfileAvatar({
  className = "",
  iconClassName = "",
  size,
  alt = "",
}: ProfileAvatarProps) {
  const sizeClasses = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
    "2xl": "w-28 h-28 sm:w-32 sm:h-32",
  };

  const hasDimension = /\bw-/.test(className);
  const resolvedSize = size ? sizeClasses[size] : (hasDimension ? "" : sizeClasses.md);
  const isAccessible = Boolean(alt && alt.trim());

  return (
    <div
      {...(isAccessible ? { role: "img", "aria-label": alt } : { "aria-hidden": "true" })}
      className={`rounded-full bg-slate-100 dark:bg-[#161B22] text-slate-500 dark:text-[#8D96A0] border border-slate-200/80 dark:border-[#30363D] flex items-center justify-center shrink-0 select-none overflow-hidden ${resolvedSize} ${className}`.trim()}
    >
      <User className={`w-1/2 h-1/2 stroke-[2] ${iconClassName}`.trim()} />
    </div>
  );
}

