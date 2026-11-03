"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

export interface ResourceRowCardProps {
  icon?: LucideIcon;
  avatarNode?: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  tags?: React.ReactNode;
  metadata?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function ResourceRowCard({
  icon: Icon,
  avatarNode,
  iconBg = "bg-slate-100 dark:bg-[#21262D]",
  iconColor = "text-brand",
  title,
  subtitle,
  tags,
  metadata,
  action,
  className = "",
  onClick,
}: ResourceRowCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-slate-50/70 dark:bg-[#161B22] border border-slate-200/80 dark:border-[#21262D] hover:border-slate-300 dark:hover:border-[#30363D] hover:shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_0_25px_-5px_rgba(37, 99, 235,0.08)] rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-200 shadow-2xs ${
        onClick ? "cursor-pointer" : ""
      } ${className}`.trim()}
    >
      {/* Left Info: Icon/Avatar + Title/Subtitle/Tags */}
      <div className="flex items-start sm:items-center gap-3.5 min-w-0">
        {avatarNode ? (
          <div className="shrink-0">{avatarNode}</div>
        ) : Icon ? (
          <div
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center shrink-0 border border-slate-200/60 dark:border-[#30363D]`}
          >
            <Icon className="w-5 h-5" />
          </div>
        ) : null}

        <div className="min-w-0">
          <div className="font-bold text-slate-900 dark:text-[#F0F6FC] text-sm sm:text-base leading-snug">
            {title}
          </div>
          {subtitle && (
            <div className="text-xs text-slate-500 dark:text-[#8D96A0] mt-0.5">
              {subtitle}
            </div>
          )}
          {tags && <div className="mt-2 flex flex-wrap gap-1.5">{tags}</div>}
        </div>
      </div>

      {/* Right Info: Metadata & Action Button */}
      <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200/60 dark:border-[#21262D]">
        {metadata && <div className="text-xs text-slate-500 dark:text-[#8D96A0]">{metadata}</div>}
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}

