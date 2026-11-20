"use client";

import React from "react";
import { Lock, Upload } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { CANONICAL_FACULTY } from "@/lib/canonicalCampus";

export interface SubmitGradesModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedCourse: string;
  selectedSemester: string;
  enrolledCount: number;
}

export function SubmitGradesModal({
  open,
  onClose,
  onConfirm,
  selectedCourse,
  selectedSemester,
  enrolledCount,
}: SubmitGradesModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Submit Marks to Registrar?"
      description="Official Departmental Grade Submission • Office of Examination"
      size="md"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[40px] px-4 py-2 rounded-xl bg-surface-2 hover:bg-surface border border-line text-fg text-xs font-semibold cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            Cancel &amp; Continue Editing
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="min-h-[40px] px-5 py-2 rounded-xl bg-brand hover:bg-brand-hover text-on-brand text-xs font-semibold cursor-pointer transition-colors active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            Confirm &amp; Transmit Marks
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-soft text-brand flex items-center justify-center border border-brand/30 shrink-0">
            <Lock className="w-4 h-4" aria-hidden="true" />
          </div>
          <p className="text-xs text-fg-muted leading-relaxed">
            Finalizing evaluation marks locks all grade cells for the selected section and submits the official grade sheet.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-surface-2 border border-line space-y-2 text-xs">
          <div className="flex justify-between gap-2 text-fg-muted">
            <span>Course &amp; Section:</span>
            <span className="font-semibold text-fg text-right">
              {selectedCourse.split(" • ")[0]} • {selectedSemester.split(" • ")[1] || selectedSemester}
            </span>
          </div>
          <div className="flex justify-between gap-2 text-fg-muted">
            <span>Enrolled Records:</span>
            <span className="font-sans font-semibold text-fg tabular-nums">
              {enrolledCount} students verified
            </span>
          </div>
          <div className="flex justify-between gap-2 text-fg-muted">
            <span>Class Average GPA:</span>
            <span className="font-sans font-semibold text-success tabular-nums">
              3.64 / 4.00
            </span>
          </div>
          <div className="flex justify-between gap-2 text-fg-muted">
            <span>Instructor:</span>
            <span className="font-semibold text-fg">{CANONICAL_FACULTY.name}</span>
          </div>
        </div>

        <p className="text-xs text-warning leading-relaxed bg-warning-light p-3 rounded-xl border border-warning/25">
          <strong>Notice:</strong> Once submitted, marks are locked and cannot be edited without written approval from the Head of Department and the Controller of Examinations.
        </p>
      </div>
    </Modal>
  );
}

export interface ImportCsvModalProps {
  open: boolean;
  onClose: () => void;
}

export function ImportCsvModal({ open, onClose }: ImportCsvModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Import Marks Spreadsheet"
      description="Upload a UTF-8 formatted CSV or Excel file containing columns: StudentID, Quiz, Midterm, Lab, Final."
      size="sm"
      footer={
        <button
          type="button"
          onClick={onClose}
          className="min-h-[40px] px-4 py-2 rounded-xl bg-surface-2 border border-line text-fg text-xs font-semibold cursor-pointer hover:bg-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          Close
        </button>
      }
    >
      <div className="border-2 border-dashed border-line hover:border-brand/60 rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-colors bg-surface-2/50">
        <Upload className="w-8 h-8 text-brand mb-2" aria-hidden="true" />
        <div className="text-xs font-semibold text-fg">
          Drag and drop your marks file here
        </div>
        <div className="text-xs text-fg-muted mt-1">
          Supports .CSV, .XLSX (Max 5MB)
        </div>
      </div>
    </Modal>
  );
}
