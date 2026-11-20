"use client";

import { memo } from "react";
import {
  FolderDown,
  Eye,
  Download,
  MoreVertical,
  Bookmark,
  Check,
  Copy,
} from "lucide-react";
import ProfileAvatar from "@/components/common/ProfileAvatar";
import {
  CourseGroup,
  MaterialItem,
  FORMAT_BADGE_CLASSES,
} from "./materialsData";

interface MaterialResourceRowProps {
  item: MaterialItem;
  isSaved: boolean;
  isDownloading: boolean;
  isCopied: boolean;
  isMenuOpen: boolean;
  onPreview: (item: MaterialItem) => void;
  onDownload: (item: MaterialItem) => void;
  onToggleMenu: (id: string) => void;
  onToggleSave: (id: string) => void;
  onCopyLink: (item: MaterialItem) => void;
}

export const MaterialResourceRow = memo(function MaterialResourceRow({
  item,
  isSaved,
  isDownloading,
  isCopied,
  isMenuOpen,
  onPreview,
  onDownload,
  onToggleMenu,
  onToggleSave,
  onCopyLink,
}: MaterialResourceRowProps) {
  const formatClass = FORMAT_BADGE_CLASSES[item.format];

  return (
    <div className="p-4 rounded-xl bg-surface-2 border border-line hover:border-brand/40 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-3 group">
      {/* Left: Icon Badge + Title + Metadata */}
      <div className="flex items-start gap-3.5 min-w-0">
        <div
          className={`w-11 h-11 rounded-xl border flex items-center justify-center font-sans font-semibold text-xs shrink-0 ${formatClass}`}
        >
          {item.format}
        </div>

        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-sm text-fg group-hover:text-brand transition-colors">
              {item.title}
            </h3>
            <span className="text-xs text-fg-muted">· {item.moduleTag}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-fg-muted flex-wrap">
            <div className="flex items-center gap-1.5">
              <ProfileAvatar
                alt={item.instructor}
                size="xs"
                className="w-4 h-4 border border-line"
              />
              <span>{item.instructor}</span>
            </div>
            <span aria-hidden="true">•</span>
            <span className="font-sans tabular-nums">{item.fileSize}</span>
            <span aria-hidden="true">•</span>
            <span className="font-sans tabular-nums">{item.uploadedAt}</span>
          </div>
        </div>
      </div>

      {/* Right: Consolidated Action Buttons */}
      <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
        <button
          type="button"
          title="Preview In-Browser"
          aria-label={`Preview ${item.title}`}
          onClick={() => onPreview(item)}
          className="min-w-[36px] min-h-[36px] rounded-lg bg-surface hover:bg-canvas border border-line text-fg-muted hover:text-fg flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <Eye className="w-3.5 h-3.5" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={() => onDownload(item)}
          className="min-h-[36px] px-3.5 rounded-lg bg-brand hover:bg-brand-hover text-on-brand text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <Download className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{isDownloading ? "Downloading..." : "Download"}</span>
        </button>

        <div className="relative">
          <button
            type="button"
            title="More options"
            aria-label={`More options for ${item.title}`}
            aria-expanded={isMenuOpen}
            onClick={() => onToggleMenu(item.id)}
            className="min-w-[36px] min-h-[36px] rounded-lg bg-surface hover:bg-canvas border border-line text-fg-muted hover:text-fg flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <MoreVertical className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 top-10 w-40 py-1 bg-surface border border-line rounded-xl shadow-md z-20 text-xs">
              <button
                type="button"
                onClick={() => onToggleSave(item.id)}
                className="w-full min-h-[36px] px-3 py-1.5 text-left text-fg hover:bg-surface-2 flex items-center gap-2 cursor-pointer"
              >
                <Bookmark
                  className={`w-3.5 h-3.5 ${
                    isSaved ? "fill-current text-brand" : "text-fg-muted"
                  }`}
                  aria-hidden="true"
                />
                <span>{isSaved ? "Saved" : "Save for Later"}</span>
              </button>
              <button
                type="button"
                onClick={() => onCopyLink(item)}
                className="w-full min-h-[36px] px-3 py-1.5 text-left text-fg hover:bg-surface-2 flex items-center gap-2 cursor-pointer"
              >
                {isCopied ? (
                  <Check className="w-3.5 h-3.5 text-success" aria-hidden="true" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-fg-muted" aria-hidden="true" />
                )}
                <span>{isCopied ? "Copied!" : "Copy Link"}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

interface CourseResourceGroupProps {
  group: CourseGroup;
  savedItemIds: string[];
  downloadingId: string | null;
  copiedId: string | null;
  openMenuId: string | null;
  onDownloadAll: (courseCode: string) => void;
  onPreview: (item: MaterialItem) => void;
  onDownload: (item: MaterialItem) => void;
  onToggleMenu: (id: string) => void;
  onToggleSave: (id: string) => void;
  onCopyLink: (item: MaterialItem) => void;
}

export const CourseResourceGroup = memo(function CourseResourceGroup({
  group,
  savedItemIds,
  downloadingId,
  copiedId,
  openMenuId,
  onDownloadAll,
  onPreview,
  onDownload,
  onToggleMenu,
  onToggleSave,
  onCopyLink,
}: CourseResourceGroupProps) {
  return (
    <section className="p-5 sm:p-6 rounded-2xl bg-surface border border-line space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-line gap-3">
        <div className="flex items-center gap-3 flex-wrap min-w-0">
          <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-md bg-brand-soft text-brand border border-brand/25 shrink-0">
            {group.courseCode}
          </span>
          <h2 className="text-lg font-semibold text-fg">{group.courseName}</h2>
          <span className="text-xs font-sans tabular-nums text-fg-muted">
            • {group.totalFiles} Files • {group.modulesCount} Modules
          </span>
        </div>

        <button
          type="button"
          onClick={() => onDownloadAll(group.courseCode)}
          className="min-h-[38px] px-3.5 rounded-xl bg-surface-2 hover:bg-canvas border border-line text-xs font-semibold text-fg transition-colors flex items-center gap-1.5 self-start sm:self-center cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <FolderDown className="w-3.5 h-3.5 text-brand" aria-hidden="true" />
          <span>Download All (.ZIP)</span>
        </button>
      </div>

      <div className="space-y-3">
        {group.items.map((item) => (
          <MaterialResourceRow
            key={item.id}
            item={item}
            isSaved={savedItemIds.includes(item.id)}
            isDownloading={downloadingId === item.id}
            isCopied={copiedId === item.id}
            isMenuOpen={openMenuId === item.id}
            onPreview={onPreview}
            onDownload={onDownload}
            onToggleMenu={onToggleMenu}
            onToggleSave={onToggleSave}
            onCopyLink={onCopyLink}
          />
        ))}
      </div>
    </section>
  );
});
