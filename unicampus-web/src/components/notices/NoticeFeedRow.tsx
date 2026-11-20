"use client";

import { memo } from "react";
import { Paperclip } from "lucide-react";
import { NoticeItem } from "@/lib/noticeData";

const CATEGORY_BADGE_MAP: Record<NoticeItem["categoryKey"], string> = {
  exam: "bg-brand-soft text-brand border-brand/25",
  academic: "bg-success-light text-success border-success/25",
  events: "bg-warning-light text-warning border-warning/25",
  admin: "bg-surface-2 text-fg-muted border-line",
};

interface NoticeFeedRowProps {
  notice: NoticeItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const NoticeFeedRow = memo(function NoticeFeedRow({
  notice,
  isSelected,
  onSelect,
}: NoticeFeedRowProps) {
  const categoryClass = CATEGORY_BADGE_MAP[notice.categoryKey];

  return (
    <button
      type="button"
      onClick={() => onSelect(notice.id)}
      aria-pressed={isSelected}
      className={`w-full text-left p-4 sm:p-5 rounded-2xl cursor-pointer transition-colors duration-150 flex flex-col gap-3 relative border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
        isSelected
          ? "bg-surface-2 border-brand"
          : "bg-surface border-line hover:border-fg-subtle/40 hover:bg-surface-2/60"
      }`}
    >
      {/* Left Active Indicator Bar */}
      {isSelected && (
        <span
          aria-hidden="true"
          className="absolute left-0 top-3 bottom-3 w-1 bg-brand rounded-r-md"
        />
      )}

      <div className="flex items-center justify-between gap-2 w-full">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className={`px-2.5 py-0.5 rounded-md text-xs font-sans font-semibold border ${categoryClass}`}
          >
            {notice.category}
          </span>
          {notice.pinnedUrgent && (
            <span className="px-2 py-0.5 rounded-md text-xs font-sans font-semibold bg-danger-light text-danger border border-danger/25">
              PINNED
            </span>
          )}
        </div>
        <span className="text-xs font-sans tabular-nums text-fg-muted shrink-0">
          {notice.timeStr}
        </span>
      </div>

      <h3
        className={`text-sm sm:text-base font-semibold leading-snug transition-colors ${
          isSelected ? "text-brand" : "text-fg"
        }`}
      >
        {notice.title}
      </h3>

      <p className="text-xs text-fg-muted line-clamp-2 leading-relaxed font-normal">
        {notice.summary}
      </p>

      <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-line text-xs w-full">
        <span className="text-fg-muted flex items-center gap-1.5 font-medium truncate max-w-[260px]">
          <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0" aria-hidden="true" />
          <span className="truncate">{notice.department}</span>
        </span>

        {notice.attachmentName && (
          <span className="px-2 py-0.5 rounded bg-surface-2 border border-line text-xs font-sans tabular-nums text-fg flex items-center gap-1 shrink-0">
            <Paperclip className="w-3 h-3 text-brand" aria-hidden="true" />
            {notice.attachmentName}
          </span>
        )}
      </div>
    </button>
  );
});
