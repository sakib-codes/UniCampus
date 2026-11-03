"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export interface TabItem<T extends string = string> {
  id: T;
  label: string | ReactNode;
  badge?: string | number | null;
  icon?: React.ComponentType<{ className?: string }>;
}

interface AnimatedTabsProps<T extends string = string> {
  tabs: readonly TabItem<T>[] | TabItem<T>[];
  activeTab: T;
  onChange: (tabId: T) => void;
  layoutId?: string;
  className?: string;
  tabClassName?: string;
  activeTabClassName?: string;
  size?: "sm" | "md" | "lg";
}

export function AnimatedTabs<T extends string = string>({
  tabs,
  activeTab,
  onChange,
  layoutId = "animated-tab-pill",
  className = "",
  tabClassName = "",
  activeTabClassName = "",
  size = "md",
}: AnimatedTabsProps<T>) {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-[11px]",
    md: "px-4 py-2 text-xs",
    lg: "px-5 py-2.5 text-sm",
  }[size];

  return (
    <div
      className={`relative inline-flex items-center gap-1 p-1 bg-black/[0.04] dark:bg-white/[0.04] backdrop-blur-md border border-white/70 dark:border-white/10 rounded-2xl select-none custom-scrollbar overflow-x-auto ${className}`}
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`relative ${sizeClasses} font-semibold rounded-xl transition-colors shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand flex items-center justify-center gap-2 ${
              isActive
                ? "text-[#111827] dark:text-[#F0F6FC] font-bold"
                : "text-[#64748B] dark:text-[#8D96A0] hover:text-[#111827] dark:hover:text-[#F0F6FC] hover:bg-white/30 dark:hover:bg-white/5"
            } ${tabClassName}`}
          >
            {isActive && (
              <motion.div
                layoutId={layoutId}
                className={`absolute inset-0 bg-white dark:bg-[#1A2234] shadow-[0_2px_8px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,1)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.15)] border border-white dark:border-white/20 rounded-xl z-0 ${activeTabClassName}`}
                transition={{
                  type: "spring",
                  stiffness: 450,
                  damping: 34,
                }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {Icon && <Icon className="w-3.5 h-3.5" />}
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge !== null && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full transition-colors ${
                    isActive
                      ? "bg-[#1D5BD8]/15 text-[#1D5BD8] dark:bg-[#2563EB]/25 dark:text-[#60A5FA] font-bold"
                      : "bg-black/[0.06] dark:bg-white/10 text-slate-500 dark:text-[#8D96A0]"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

