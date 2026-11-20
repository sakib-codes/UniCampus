"use client";

import { BookOpen, Download } from "lucide-react";
import { Modal, Button } from "@/components/ui";
import { MaterialItem, FORMAT_BADGE_CLASSES } from "./materialsData";

interface MaterialPreviewModalProps {
  previewItem: MaterialItem | null;
  onClose: () => void;
  onDownload: (item: MaterialItem) => void;
}

export function MaterialPreviewModal({
  previewItem,
  onClose,
  onDownload,
}: MaterialPreviewModalProps) {
  return (
    <Modal
      open={Boolean(previewItem)}
      onClose={onClose}
      size="xl"
      title={
        previewItem && (
          <div className="flex items-center gap-3 min-w-0">
            <span
              className={`font-sans text-xs font-semibold px-2 py-0.5 rounded border shrink-0 ${
                FORMAT_BADGE_CLASSES[previewItem.format]
              }`}
            >
              {previewItem.format}
            </span>
            <span className="truncate">{previewItem.title}</span>
          </div>
        )
      }
      description={
        previewItem && (
          <span className="font-sans tabular-nums text-xs text-fg-muted">
            <span className="font-mono font-semibold text-brand">
              {previewItem.courseCode}
            </span>{" "}
            • {previewItem.instructor} • {previewItem.fileSize}
          </span>
        )
      }
      footer={
        previewItem && (
          <div className="flex items-center justify-end gap-2.5 w-full">
            <Button type="button" variant="secondary" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              leftIcon={<Download className="w-3.5 h-3.5" />}
              onClick={() => onDownload(previewItem)}
            >
              Download
            </Button>
          </div>
        )
      }
    >
      {previewItem && (
        <div className="min-h-[340px] bg-canvas border border-line rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-surface-2 border border-line flex items-center justify-center text-brand">
            <BookOpen className="w-8 h-8" aria-hidden="true" />
          </div>
          <div className="space-y-1.5 max-w-md">
            <h3 className="font-semibold text-base text-fg">
              Interactive Document Viewer
            </h3>
            <p className="text-xs text-fg-muted">
              Rendering authenticated secure stream for{" "}
              <span className="font-semibold text-fg">{previewItem.title}</span>.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-surface-2 border border-line w-full max-w-lg text-left text-xs font-sans space-y-2 text-fg">
            <div className="flex justify-between gap-4 border-b border-line pb-1.5">
              <span className="text-fg-muted">Course:</span>
              <span className="font-semibold text-right">
                <span className="font-mono text-brand">{previewItem.courseCode}</span>{" "}
                - {previewItem.courseName}
              </span>
            </div>
            <div className="flex justify-between gap-4 border-b border-line pb-1.5">
              <span className="text-fg-muted">Syllabus Topic:</span>
              <span className="text-right">{previewItem.moduleTag}</span>
            </div>
            <div className="flex justify-between gap-4 border-b border-line pb-1.5">
              <span className="text-fg-muted">File Type:</span>
              <span className="text-right">{previewItem.format} Document</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-fg-muted">Published By:</span>
              <span className="text-right tabular-nums">
                {previewItem.instructor} ({previewItem.uploadedAt})
              </span>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
