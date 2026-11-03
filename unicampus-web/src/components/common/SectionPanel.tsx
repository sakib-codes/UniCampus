"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { themeTokens } from "@/lib/theme";

export interface SectionPanelProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  noDivider?: boolean;
}

export default function SectionPanel({
  title,
  subtitle,
  icon: Icon,
  iconColor = "text-brand",
  iconBg = "bg-brand/10 dark:bg-brand/20",
  action,
  children,
  className = "",
  headerClassName = "",
  bodyClassName = "",
  noDivider = false,
}: SectionPanelProps) {
  return (
    <section
      className={`bg-white dark:bg-[#0D1117] border border-slate-200/80 dark:border-[#21262D] rounded-3xl p-5 sm:p-6 shadow-xs ${className}`.trim()}
    >
      {/* Panel Header */}
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          !noDivider ? `pb-4 mb-5 border-b ${themeTokens.border}` : "mb-4"
        } ${headerClassName}`.trim()}
      >
        <div className="flex items-center gap-3 min-w-0">
          {Icon && (
            <div className={`w-9 h-9 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center shrink-0 border border-black/5 dark:border-white/5`}>
              <Icon className="w-4 h-4" />
            </div>
          )}
          <div className="min-w-0">
            {typeof title === "string" ? (
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-[#F0F6FC] tracking-tight truncate">
                {title}
              </h2>
            ) : (
              title
            )}
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-[#8D96A0] mt-0.5 truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {action && <div className="shrink-0 flex items-center gap-2">{action}</div>}
      </div>

      {/* Panel Body */}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}

