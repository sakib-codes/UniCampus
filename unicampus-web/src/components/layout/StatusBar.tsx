"use client";

import React from "react";
import { Keyboard, Command } from "lucide-react";
import { themeTokens } from "@/lib/theme";

interface StatusBarProps {
  statusDotColor?: string;
  title: string;
  subtitle: string;
  extraInfo?: string;
  shortcutsLabel?: string;
  onOpenShortcuts: () => void;
  onOpenCommand: () => void;
}

export function StatusBar({
  statusDotColor = "bg-emerald-500",
  title,
  subtitle,
  extraInfo,
  shortcutsLabel = "Shortcuts (?)",
  onOpenShortcuts,
  onOpenCommand,
}: StatusBarProps) {
  return (
    <footer
      className={`h-7 border-t ${themeTokens.border} ${themeTokens.surface} px-4 flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-[#8D96A0] select-none shrink-0 z-20`}
    >
      <div className="flex items-center gap-2">
        <span className={`w-1.5 h-1.5 rounded-full ${statusDotColor} animate-pulse`} />
        <span className="font-semibold text-slate-700 dark:text-[#F0F6FC]">{title}</span>
        <span className={`text-[10px] ${themeTokens.textMuted}`}>{subtitle}</span>
      </div>

      <div className="flex items-center gap-3">
        {extraInfo && (
          <>
            <span className="hidden sm:inline text-slate-500 dark:text-[#8D96A0] font-mono text-[10px]">
              {extraInfo}
            </span>
            <span className="hidden sm:inline">•</span>
          </>
        )}
        <button
          onClick={onOpenShortcuts}
          className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-slate-700 dark:hover:text-[#F0F6FC] transition-colors cursor-pointer"
          aria-label={shortcutsLabel}
        >
          <Keyboard className="w-3 h-3" />
          <span>{shortcutsLabel}</span>
        </button>
        <span>•</span>
        <button
          onClick={onOpenCommand}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-white/60 hover:bg-white/80 dark:bg-white/10 dark:hover:bg-white/15 border border-white/80 dark:border-white/15 text-[10px] font-mono text-slate-600 dark:text-[#8D96A0] shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all cursor-pointer"
          aria-label="Open Command Palette (Ctrl+K)"
        >
          <Command className="w-2.5 h-2.5 text-brand" />
          <span>Ctrl+K</span>
        </button>
      </div>
    </footer>
  );
}

