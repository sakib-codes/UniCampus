"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import CountUp from "@/components/bits/CountUp";
import { themeTokens } from "@/lib/theme";

export interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  suffix?: string;
  duration?: number;
  className?: string;
  onClick?: () => void;
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  iconColor = "text-brand",
  iconBg = "bg-brand/10 dark:bg-brand/20",
  suffix = "",
  duration = 0.8,
  className = "",
  onClick,
}: StatCardProps) {
  const isNumeric = typeof value === "number";

  return (
    <div
      onClick={onClick}
      className={`${themeTokens.card} p-5 flex flex-col justify-between hover:border-slate-300 dark:hover:border-[#30363D] hover:shadow-[0_4px_20px_-2px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_0_20px_-4px_rgba(37, 99, 235,0.12)] transition-all duration-300 shadow-xs ${
        onClick ? "cursor-pointer" : ""
      } ${className}`.trim()}
    >
      {/* Top Label */}
      <span className="text-xs font-semibold text-slate-500 dark:text-[#8D96A0] tracking-wide block mb-3">
        {label}
      </span>

      {/* Bottom Row: Big Stat on Left, Icon Badge on Right */}
      <div className="flex items-end justify-between gap-3">
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F0F6FC] leading-none tracking-tight">
          {isNumeric ? <CountUp to={value} duration={duration} /> : value}
          {suffix && <span className="text-lg font-bold ml-0.5 text-slate-500 dark:text-[#8D96A0]">{suffix}</span>}
        </div>

        <div className={`w-10 h-10 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center shrink-0 border border-black/5 dark:border-white/5`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

