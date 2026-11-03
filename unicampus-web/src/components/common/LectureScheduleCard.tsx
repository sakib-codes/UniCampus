"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Monitor, Play } from "lucide-react";
import ProfileAvatar from "@/components/common/ProfileAvatar";
import SpotlightCard from "@/components/bits/SpotlightCard";
import { SPOTLIGHT } from "@/lib/theme";

export interface LectureScheduleCardProps {
  courseCode: string;
  courseTitle: string;
  timeRange: string;
  room: string;
  instructorName: string;
  status: "ongoing" | "upcoming" | "scheduled" | "completed";
  statusText?: string;
  actionButton?: {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: React.ComponentType<{ className?: string }>;
  };
  secondaryNote?: string;
  isLab?: boolean;
}

export default function LectureScheduleCard({
  courseCode,
  courseTitle,
  timeRange,
  room,
  instructorName,
  status,
  statusText,
  actionButton,
  secondaryNote,
  isLab = false,
}: LectureScheduleCardProps) {
  const isOngoing = status === "ongoing";
  const isUpcoming = status === "upcoming";

  return (
    <SpotlightCard
      className={`p-5 rounded-2xl transition-all relative overflow-hidden group ${
        isOngoing
          ? "bg-brand/[0.06] dark:bg-brand/[0.08] backdrop-blur-xl border border-brand/40 dark:border-brand/40 shadow-[0_4px_16px_rgba(29, 91, 216,0.08),inset_0_1px_1px_rgba(255,255,255,0.9)]"
          : "bg-black/[0.025] hover:bg-white/80 dark:bg-white/[0.03] dark:hover:bg-white/[0.07] backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.02),inset_0_1px_1px_rgba(255,255,255,0.9)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.25)]"
      }`}
      spotlightColor={SPOTLIGHT.wash}
      borderGlowColor={SPOTLIGHT.glow}
    >
      {isOngoing && <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand dark:bg-[#2563EB] z-20 rounded-r-full shadow-sm" />}

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          {/* Header Badges */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span
              className={`font-mono text-xs font-bold px-2 py-0.5 rounded-md border ${
                isOngoing
                  ? "bg-brand/10 text-brand border-brand/20 dark:bg-[#2563EB]/20 dark:text-[#2563EB] dark:border-[#2563EB]/30"
                  : "bg-slate-100 text-slate-700 border-slate-200 dark:bg-[#21262D] dark:text-[#8D96A0] dark:border-[#30363D]"
              }`}
            >
              {courseCode}
            </span>

            {isOngoing && (
              <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                {statusText || "Ongoing"}
              </span>
            )}

            {isUpcoming && (
              <span className="font-mono text-xs text-brand dark:text-[#2563EB] font-medium bg-brand/10 border border-brand/20 dark:bg-[#2563EB]/10 dark:border-[#2563EB]/20 px-2 py-0.5 rounded-md">
                {statusText || "Upcoming"}
              </span>
            )}

            {!isOngoing && !isUpcoming && (
              <span className="font-mono text-xs text-slate-600 dark:text-[#8D96A0] font-medium bg-slate-100 border border-slate-200 dark:bg-[#21262D] dark:border-[#30363D] px-2 py-0.5 rounded-md">
                {statusText || "Scheduled"}
              </span>
            )}

            <span className="font-mono text-xs text-slate-600 dark:text-[#8D96A0] bg-slate-100 dark:bg-[#21262D] px-2 py-0.5 rounded border border-slate-200 dark:border-[#30363D]">
              {timeRange}
            </span>
          </div>

          {/* Course Title */}
          <h3 className="font-manrope font-bold text-base text-slate-900 dark:text-[#F0F6FC] group-hover:text-brand dark:group-hover:text-[#2563EB] transition-colors">
            {courseTitle}
          </h3>

          {/* Room & Instructor Meta */}
          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-[#8D96A0]">
            <div className="flex items-center gap-1.5 font-mono text-slate-800 dark:text-[#F0F6FC]">
              {isLab ? (
                <Monitor className="w-3.5 h-3.5 text-slate-400 dark:text-[#8D96A0]" />
              ) : (
                <MapPin className={`w-3.5 h-3.5 ${isOngoing ? "text-brand dark:text-[#2563EB]" : "text-slate-400 dark:text-[#8D96A0]"}`} />
              )}
              <span>{room}</span>
            </div>

            <div className="flex items-center gap-2">
              <ProfileAvatar size="xs" className="w-5 h-5 border border-slate-200 dark:border-[#30363D]" />
              <span>{instructorName}</span>
            </div>
          </div>
        </div>

        {/* Right Action Cluster */}
        <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200 dark:border-[#30363D]">
          {secondaryNote && (
            <span
              className={`text-[11px] font-mono font-medium ${
                isOngoing
                  ? "text-emerald-600 dark:text-emerald-400"
                  : status === "scheduled"
                  ? "text-slate-400 dark:text-[#6E747D]"
                  : "text-slate-500 dark:text-[#8D96A0]"
              }`}
            >
              {secondaryNote}
            </span>
          )}

          {actionButton && (
            actionButton.href ? (
              <Link
                href={actionButton.href}
                className={`w-[130px] h-8 justify-center rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer whitespace-nowrap ${
                  isOngoing
                    ? "bg-brand hover:bg-brand-hover dark:bg-[#2563EB] dark:hover:bg-[#5852ff] text-white shadow-brand/20"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-[#21262D] dark:hover:bg-[#30363D] dark:text-[#F0F6FC] border border-slate-200 dark:border-[#30363D]"
                }`}
              >
                {actionButton.icon && <actionButton.icon className="w-3.5 h-3.5 shrink-0" />}
                <span>{actionButton.label}</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={actionButton.onClick}
                className={`w-[130px] h-8 justify-center rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer whitespace-nowrap ${
                  isOngoing
                    ? "bg-brand hover:bg-brand-hover dark:bg-[#2563EB] dark:hover:bg-[#5852ff] text-white shadow-brand/20"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-[#21262D] dark:hover:bg-[#30363D] dark:text-[#F0F6FC] border border-slate-200 dark:border-[#30363D]"
                }`}
              >
                {actionButton.icon && <actionButton.icon className="w-3.5 h-3.5 shrink-0" />}
                <span>{actionButton.label}</span>
              </button>
            )
          )}
        </div>
      </div>
    </SpotlightCard>
  );
}
