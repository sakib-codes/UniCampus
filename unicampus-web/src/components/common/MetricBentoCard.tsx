"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import SpotlightCard from "@/components/bits/SpotlightCard";
import { SPOTLIGHT } from "@/lib/theme";

export interface MetricBentoCardProps {
  label: string;
  value: string | number;
  denominator?: string;
  badge?: React.ReactNode;
  progressPercent?: number;
  progressBarGradient?: string;
  footerText?: React.ReactNode;
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  className?: string;
  onClick?: () => void;
}

export default function MetricBentoCard({
  label,
  value,
  denominator,
  badge,
  progressPercent,
  progressBarGradient = "bg-brand dark:bg-[#2563EB]",
  footerText,
  icon: Icon,
  iconBg = "bg-brand/10 border-brand/20 dark:bg-[#2563EB]/15 dark:border-[#2563EB]/30",
  iconColor = "text-brand dark:text-[#2563EB]",
  className = "",
  onClick,
}: MetricBentoCardProps) {
  return (
    <SpotlightCard
      onClick={onClick}
      className={`rounded-3xl bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] p-6 hover:border-slate-300 dark:hover:border-[#2563EB]/60 hover:shadow-xs transition-all group flex flex-col justify-between relative overflow-hidden ${
        onClick ? "cursor-pointer" : ""
      } ${className}`.trim()}
      spotlightColor={SPOTLIGHT.wash}
      borderGlowColor={SPOTLIGHT.glow}
    >
      <div className="relative z-10 flex flex-col justify-between h-full">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#8D96A0]">
            {label}
          </span>
          <div
            className={`w-9 h-9 rounded-xl ${iconBg} border flex items-center justify-center ${iconColor} group-hover:scale-105 transition-transform shrink-0`}
          >
            <Icon className="w-4 h-4" />
          </div>
        </div>

        <div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="font-manrope font-extrabold text-[32px] tracking-[-0.02em] text-slate-900 dark:text-[#F0F6FC] leading-none">
              {value}
            </span>
            {denominator && (
              <span className="font-mono text-xs text-slate-400 dark:text-[#6E747D]">
                {denominator}
              </span>
            )}
          </div>

          {progressPercent !== undefined && (
            <div className="w-full bg-slate-100 dark:bg-[#161B22] h-1.5 rounded-full overflow-hidden border border-slate-200/60 dark:border-[#30363D]/50 mb-2.5">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${progressBarGradient}`}
                style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
              />
            </div>
          )}

          {badge && <div className="mt-1">{badge}</div>}
          {footerText && <div className="text-[11px] font-mono text-slate-500 dark:text-[#8D96A0] mt-1">{footerText}</div>}
        </div>
      </div>
    </SpotlightCard>
  );
}
