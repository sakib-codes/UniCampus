"use client";

import { Pin, X, Paperclip, FileText, Edit3, Trash2 } from "lucide-react";
import type { Notice } from "@/types/admin";

interface AdminNoticeDetailModalProps {
  notice: Notice | null;
  onClose: () => void;
  onEdit: (notice: Notice) => void;
  onDelete: (id: string) => void;
}

export function AdminNoticeDetailModal({
  notice,
  onClose,
  onEdit,
  onDelete,
}: AdminNoticeDetailModalProps) {
  if (!notice) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-xl rounded-2xl bg-surface border border-line shadow-xl p-6 max-h-[90dvh] overflow-y-auto">
        <div className="flex items-start justify-between pb-4 border-b border-line mb-4 gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 bg-surface-2 border border-line text-fg-muted rounded-md text-xs font-semibold">
                {notice.category}
              </span>
              {notice.pinned && (
                <span className="px-2 py-0.5 bg-warning-light border border-warning/30 text-warning rounded-md text-xs font-semibold flex items-center gap-1">
                  <Pin className="w-3 h-3 fill-current" /> Pinned
                </span>
              )}
            </div>
            <h3 className="text-lg font-semibold text-fg">{notice.title}</h3>
            <p className="text-xs text-fg-muted mt-1 tabular-nums">
              Issued by {notice.author_name} •{" "}
              {new Date(notice.created_at).toLocaleString()}
            </p>
          </div>
          <button
            type="button"
            aria-label="Close modal"
            onClick={onClose}
            className="min-w-[36px] min-h-[36px] inline-flex items-center justify-center text-fg-muted hover:text-fg rounded-lg hover:bg-surface-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-2 text-xs text-fg leading-relaxed whitespace-pre-wrap">
          {notice.body}
        </div>

        {notice.attachments && notice.attachments.length > 0 && (
          <div className="mt-5 pt-4 border-t border-line">
            <h4 className="text-xs font-semibold text-fg mb-2 flex items-center gap-1.5">
              <Paperclip className="w-3.5 h-3.5 text-brand" /> Attached Official Documents
            </h4>
            <div className="space-y-1.5">
              {notice.attachments.map((att, idx) => {
                const name = att.includes("::")
                  ? att.split("::")[0]
                  : att.split("/").pop() || `Attachment ${idx + 1}`;
                const url = att.includes("::") ? att.split("::")[1] : att;
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-canvas border border-line text-xs gap-2"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-brand shrink-0" />
                      <span className="font-semibold text-fg truncate">
                        {name}
                      </span>
                    </div>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand hover:underline font-semibold shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
                    >
                      View / Download
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2.5 pt-4 border-t border-line mt-4">
          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit(notice);
            }}
            className="min-h-[40px] px-4 py-2 bg-canvas hover:bg-surface-2 text-fg border border-line rounded-xl font-semibold text-xs flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit Notice
          </button>
          <button
            type="button"
            onClick={() => onDelete(notice.id)}
            className="min-h-[40px] px-4 py-2 bg-danger hover:opacity-90 text-on-brand rounded-xl text-xs font-semibold transition-opacity flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
