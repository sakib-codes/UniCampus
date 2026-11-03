"use client";

import React from "react";
import Link from "next/link";
import SpotlightCard from "@/components/bits/SpotlightCard";
import { SPOTLIGHT } from "@/lib/theme";

export interface NoticeSnippetCardProps {
  id: string | number;
  category: "URGENT" | "EXAM" | "ACADEMIC" | "EVENT" | string;
  timeAgo: string;
  title: string;
  description: string;
  href?: string;
}

export default function NoticeSnippetCard({
  id,
  category,
  timeAgo,
  title,
  description,
  href = `/notices/${id}`,
}: NoticeSnippetCardProps) {
  const isUrgent = category.toUpperCase() === "URGENT";
  const isExam = category.toUpperCase() === "EXAM";

  return (
    <Link
      href={href}
      className="block group h-full cursor-pointer"
    >
      <SpotlightCard
        className="p-4 rounded-2xl bg-black/[0.025] hover:bg-white/80 dark:bg-white/[0.03] dark:hover:bg-white/[0.07] backdrop-blur-xl border border-white/80 dark:border-white/10 hover:border-white shadow-[0_2px_8px_rgba(0,0,0,0.02),inset_0_1px_1px_rgba(255,255,255,0.9)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.25)] transition-all duration-300 h-full flex flex-col justify-between"
        spotlightColor={SPOTLIGHT.wash}
        borderGlowColor={SPOTLIGHT.glow}
      >
        <div className="relative z-10 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                  isUrgent
                    ? "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/30"
                    : isExam
                    ? "bg-brand/10 text-brand border-brand/20 dark:bg-[#2563EB]/20 dark:text-[#2563EB] dark:border-[#2563EB]/30"
                    : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-[#21262D] dark:text-[#8D96A0] dark:border-[#30363D]"
                }`}
              >
                {category}
              </span>
              <span className="font-mono text-[11px] text-slate-400 dark:text-[#8D96A0]">{timeAgo}</span>
            </div>

            <h4 className="font-manrope font-bold text-xs text-slate-900 dark:text-[#F0F6FC] group-hover:text-brand dark:group-hover:text-[#2563EB] transition-colors line-clamp-2">
              {title}
            </h4>

            <p className="text-[11px] text-slate-500 dark:text-[#6E747D] mt-1 line-clamp-1">
              {description}
            </p>
          </div>
        </div>
      </SpotlightCard>
    </Link>
  );
}
