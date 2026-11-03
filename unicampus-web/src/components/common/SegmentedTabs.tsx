"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

export interface TabItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  count?: number;
}

export interface SegmentedTabsProps {
  tabs: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
  tabClassName?: string;
}

export default function SegmentedTabs({
  tabs,
  activeId,
  onChange,
  className = "",
  tabClassName = "",
}: SegmentedTabsProps) {
  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      className={`bg-slate-100 dark:bg-[#010409] p-1.5 rounded-2xl flex items-center gap-1.5 border border-slate-200/80 dark:border-[#21262D] overflow-x-auto [scrollbar-width:none] ${className}`.trim()}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs transition-all duration-150 whitespace-nowrap cursor-pointer flex items-center gap-2 shrink-0 ${
              isActive
                ? "bg-brand text-white font-bold shadow-xs shadow-brand/20"
                : "text-slate-600 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-[#F0F6FC] hover:bg-slate-200/60 dark:hover:bg-[#161B22] font-semibold"
            } ${tabClassName}`.trim()}
          >
            {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
            <span>{tab.label}</span>
            {typeof tab.count === "number" && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold font-mono ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-slate-200 dark:bg-[#21262D] text-slate-700 dark:text-[#8D96A0]"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

