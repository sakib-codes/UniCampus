"use client";

import { Trash2 } from "lucide-react";

interface AdminNoticeDeleteModalProps {
  confirmDeleteId: string | null;
  onCancel: () => void;
  onConfirmDelete: (id: string) => void;
}

export function AdminNoticeDeleteModal({
  confirmDeleteId,
  onCancel,
  onConfirmDelete,
}: AdminNoticeDeleteModalProps) {
  if (!confirmDeleteId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-surface border border-danger/30 shadow-xl p-6 text-center">
        <div className="w-11 h-11 rounded-xl bg-danger-light border border-danger/20 flex items-center justify-center mx-auto mb-3.5">
          <Trash2 className="w-5 h-5 text-danger" />
        </div>
        <h3 className="text-base font-semibold text-fg mb-1.5">
          Delete Announcement Broadcast?
        </h3>
        <p className="text-xs text-fg-muted mb-5 leading-relaxed">
          This notice will be permanently deleted from the student noticeboard and administrative records.
        </p>
        <div className="flex items-center justify-center gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="min-h-[40px] px-4 py-2 bg-canvas hover:bg-surface-2 text-fg border border-line rounded-xl font-semibold text-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirmDelete(confirmDeleteId)}
            className="min-h-[40px] px-4 py-2 rounded-xl bg-danger hover:opacity-90 text-on-brand text-xs font-semibold transition-opacity cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
}
