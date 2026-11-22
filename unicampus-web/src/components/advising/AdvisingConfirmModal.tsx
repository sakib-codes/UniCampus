"use client";

import React, { useState } from "react";
import { Send } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import type { AdvisingCourse, SelectedRegistrationItem } from "./advisingData";

interface AdvisingConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedItems: SelectedRegistrationItem[];
  offerings: AdvisingCourse[];
}

export function AdvisingConfirmModal({
  open,
  onClose,
  onConfirm,
  selectedItems,
  offerings,
}: AdvisingConfirmModalProps) {
  const [agreed, setAgreed] = useState(false);

  const items = selectedItems.map((item) => {
    const course = offerings.find((c) => c.code === item.courseCode);
    const section = course?.sections.find((s) => s.id === item.sectionId);
    return {
      code: item.courseCode,
      title: course?.title || item.courseCode,
      credits: course?.credits || 0,
      section: section?.sectionName || "Section A",
      time: section?.timeSlot || "",
      days: section?.days.join(", ") || "",
    };
  });

  const totalCredits = items.reduce((acc, i) => acc + i.credits, 0);

  const handleConfirm = () => {
    if (!agreed) return;
    onConfirm();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title="Confirm Course Registration Submission"
      description="Review your selected semester courses before dispatching to your Faculty Advisor."
    >
      <div className="space-y-5 pt-1 pb-2">
        {/* Course Summary Table */}
        <div className="border border-line rounded-xl overflow-hidden">
          <div className="bg-surface-2 px-4 py-2.5 border-b border-line flex items-center justify-between text-xs font-semibold text-fg">
            <span>Course Code &amp; Title</span>
            <span>Credits / Section</span>
          </div>

          <div className="divide-y divide-line text-xs font-sans">
            {items.map((item) => (
              <div
                key={item.code}
                className="px-4 py-2.5 flex items-center justify-between gap-4 bg-surface"
              >
                <div className="min-w-0">
                  <div className="font-semibold text-fg flex items-center gap-2">
                    <span className="font-mono text-brand">{item.code}</span>
                    <span className="truncate">{item.title}</span>
                  </div>
                  <div className="text-fg-muted text-[11px]">
                    {item.section} • {item.days} ({item.time})
                  </div>
                </div>

                <span className="font-mono font-bold text-fg tabular-nums shrink-0">
                  {item.credits.toFixed(1)} Cr
                </span>
              </div>
            ))}
          </div>

          <div className="bg-surface-2 px-4 py-2.5 border-t border-line flex items-center justify-between text-xs font-bold text-fg">
            <span>Total Enrolled Credits</span>
            <span className="font-mono text-brand text-sm">
              {totalCredits.toFixed(1)} Credits
            </span>
          </div>
        </div>

        {/* Declaration Checkbox */}
        <label className="flex items-start gap-3 p-3.5 rounded-xl bg-canvas border border-line cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-4 h-4 rounded text-brand focus:ring-brand mt-0.5"
          />
          <div className="text-xs text-fg space-y-0.5">
            <span className="font-semibold">Academic Policy Declaration</span>
            <p className="text-fg-muted leading-relaxed font-sans">
              I certify that I have verified my prerequisite clearances and credit limits. I understand that altering registered courses after advisor approval requires a signed Departmental Add/Drop petition.
            </p>
          </div>
        </label>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-line">
          <Button variant="secondary" size="md" onClick={onClose}>
            Back to Catalog
          </Button>
          <Button
            variant="primary"
            size="md"
            disabled={!agreed}
            onClick={handleConfirm}
            className="flex items-center gap-2 font-semibold"
          >
            <Send className="w-4 h-4" />
            <span>Confirm &amp; Send to Advisor</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}
