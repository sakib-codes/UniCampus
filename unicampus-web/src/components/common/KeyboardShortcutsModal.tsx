"use client";

import { X, Keyboard, Command } from "lucide-react";
import { themeTokens } from "@/lib/theme";

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutItem {
  keys: string[];
  description: string;
}

interface ShortcutSection {
  title: string;
  items: ShortcutItem[];
}

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  if (!isOpen) return null;

  const sections: ShortcutSection[] = [
    {
      title: "Global Navigation (Press sequence)",
      items: [
        { keys: ["G", "D"], description: "Jump to Dashboard" },
        { keys: ["G", "F"], description: "Jump to Faculty Workspace" },
        { keys: ["G", "A"], description: "Jump to Admin Console" },
        { keys: ["G", "R"], description: "Jump to Class Routine" },
        { keys: ["G", "N"], description: "Jump to Notice Board" },
        { keys: ["G", "T"], description: "Jump to Faculty Directory" },
        { keys: ["G", "S"], description: "Jump to Student Roster" },
        { keys: ["G", "M"], description: "Jump to Academic Milestones" },
        { keys: ["G", "P"], description: "Jump to Profile & Records" },
      ],
    },
    {
      title: "System & Interface Controls",
      items: [
        { keys: ["Ctrl", "K"], description: "Open Command Palette Spotlight" },
        { keys: ["[ "], description: "Collapse / Expand Sidebar" },
        { keys: ["T"], description: "Toggle Dark / Light Theme" },
        { keys: ["?"], description: "Open this Keyboard Shortcuts Guide" },
        { keys: ["Esc"], description: "Close active modal or flyout" },
      ],
    },
  ];

  return (
    <div 
      className={`${themeTokens.modalOverlay} backdrop-blur-md  select-none`}
      onClick={onClose}
    >
      <div 
        className={`w-full max-w-lg max-h-[85vh] ${themeTokens.surface} border ${themeTokens.border} rounded-2xl shadow-2xl overflow-hidden flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-5 py-3.5 border-b ${themeTokens.border} bg-slate-50/50 dark:bg-[#161B22]/50 shrink-0`}>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-brand/10 text-brand flex items-center justify-center border border-brand/20">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-[#F0F6FC]">Keyboard Shortcuts</h3>
              <p className={`text-[11px] ${themeTokens.textMuted}`}>Power user controls for desktop productivity</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-[#F0F6FC] hover:bg-slate-100 dark:hover:bg-[#161B22] transition-colors cursor-pointer"
            title="Close shortcuts guide"
            aria-label="Close shortcuts guide"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 max-h-[420px] min-h-0 overflow-y-auto">
          {sections.map((sec, idx) => (
            <div key={idx} className="space-y-2.5">
              <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-[#6E747D]">
                {sec.title}
              </h4>
              <div className="space-y-1.5">
                {sec.items.map((item, itemIdx) => (
                  <div 
                    key={itemIdx}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl ${themeTokens.subtle} border border-slate-200/60 dark:border-[#21262D] text-xs`}
                  >
                    <span className="text-slate-700 dark:text-[#8D96A0] font-medium">
                      {item.description}
                    </span>
                    <div className="flex items-center gap-1">
                      {item.keys.map((k, kIdx) => (
                        <kbd
                          key={kIdx}
                          className="px-2 py-0.5 rounded-md bg-white dark:bg-[#21262D] text-[10px] font-mono font-bold text-slate-800 dark:text-[#F0F6FC] border border-slate-200 dark:border-[#30363D] shadow-2xs"
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className={`px-5 py-2.5 border-t ${themeTokens.border} bg-slate-50 dark:bg-[#161B22] flex items-center justify-between text-[11px] text-slate-500 dark:text-[#6E747D]`}>
          <span className="flex items-center gap-1.5">
            <Command className="w-3 h-3 text-brand" />
            <span>Shortcuts are active across all portal screens</span>
          </span>
          <span className="font-mono text-[10px]">Press ESC to dismiss</span>
        </div>
      </div>
    </div>
  );
}

