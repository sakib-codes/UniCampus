"use client";

import React from "react";
import { Paperclip, Pin } from "lucide-react";
import type { NoticeItem } from "./noticeData";

interface NoticeInboxRowProps {
  notice: NoticeItem;
  isSelected: boolean;
  onClick: () => void;
}

export const NoticeInboxRow = React.memo(function NoticeInboxRow({
  notice,
  isSelected,
  onClick,
}: NoticeInboxRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-4 py-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand ${
        isSelected
          ? "bg-brand-soft/45 shadow-[inset_3px_0_0_0_var(--brand)]"
          : "bg-surface hover:bg-surface-2/60"
      }`}
    >
      {/* Top row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className={`font-sans font-medium text-[11px] px-2 py-0.5 rounded-md border shrink-0 ${notice.categoryColor.bg} ${notice.categoryColor.text} ${notice.categoryColor.border}`}
          >
            {notice.category}
          </span>
          {notice.pinnedUrgent && (
            <span
              className="inline-flex items-center gap-0.5 text-danger shrink-0"
              title="Pinned Notice"
            >
              <Pin className="w-3 h-3 fill-danger" />
            </span>
          )}
        </div>
        <span className="font-sans tabular-nums text-xs text-fg-subtle shrink-0">
          {notice.dateStr}
        </span>
      </div>

      {/* Title & Preview */}
      <p
        className={`text-sm font-semibold mt-1.5 leading-snug line-clamp-2 transition-colors ${
          isSelected ? "text-brand" : "text-fg"
        }`}
      >
        {notice.title}
      </p>
      <p className="text-xs text-fg-muted mt-1 line-clamp-2 leading-relaxed">
        {notice.summary}
      </p>

      {/* Bottom row */}
      <div className="flex items-center justify-between gap-2 mt-2.5">
        <span className="text-xs text-fg-muted truncate font-medium">
          {notice.department}
        </span>
        {notice.attachmentName && (
          <span className="inline-flex items-center gap-1 text-[11px] text-fg-muted bg-surface-2 px-2 py-0.5 rounded-md border border-line/70 shrink-0">
            <Paperclip className="w-3 h-3 text-fg-subtle" />
            <span className="truncate max-w-[120px]">{notice.attachmentName}</span>
          </span>
        )}
      </div>
    </button>
  );
});

