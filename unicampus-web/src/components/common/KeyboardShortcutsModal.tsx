"use client";

import { X, Keyboard, Command } from "lucide-react";

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

export function KeyboardShortcutsModal({
  isOpen,
  onClose,
}: KeyboardShortcutsModalProps) {
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
        { keys: ["G", "M"], description: "Jump to Academic Progress" },
        { keys: ["G", "C"], description: "Jump to Campus Messenger" },
        { keys: ["G", "P"], description: "Jump to Profile & Records" },
      ],
    },
    {
      title: "System & Interface Controls",
      items: [
        { keys: ["Ctrl", "K"], description: "Open Command Palette" },
        { keys: ["["], description: "Collapse / Expand Sidebar" },
        { keys: ["T"], description: "Toggle Light / Dark Theme" },
        { keys: ["?"], description: "Open this Keyboard Shortcuts Guide" },
        { keys: ["Esc"], description: "Close active modal or flyout" },
      ],
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 dark:bg-black/70 select-none"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
    >
      <div
        className="w-full max-w-lg max-h-[85vh] bg-surface border border-line rounded-[20px] shadow-lg overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-line bg-surface-2 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-brand-soft text-brand flex items-center justify-center">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-[15px] font-semibold text-fg">
                Keyboard Shortcuts
              </h3>
              <p className="text-xs text-fg-muted">
                Quick controls across desktop portals
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-w-[40px] min-h-[40px] rounded-xl text-fg-muted hover:text-fg hover:bg-surface flex items-center justify-center transition-colors cursor-pointer"
            title="Close shortcuts guide"
            aria-label="Close shortcuts guide"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 max-h-[440px] min-h-0 overflow-y-auto">
          {sections.map((sec, idx) => (
            <div key={idx} className="space-y-2.5">
              <h4 className="text-xs font-semibold text-fg-muted">
                {sec.title}
              </h4>
              <div className="space-y-1.5">
                {sec.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-surface-2 border border-line text-sm"
                  >
                    <span className="text-fg font-medium">
                      {item.description}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      {item.keys.map((k, kIdx) => (
                        <kbd
                          key={kIdx}
                          className="px-2 py-0.5 rounded-md bg-surface text-xs font-mono font-semibold text-fg border border-line"
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
        <div className="px-5 py-3 border-t border-line bg-surface-2 flex items-center justify-between text-xs text-fg-muted">
          <span className="flex items-center gap-1.5">
            <Command className="w-3.5 h-3.5 text-brand" />
            <span>Shortcuts are active across all portal screens</span>
          </span>
          <span>Press Esc to dismiss</span>
        </div>
      </div>
    </div>
  );
}
