"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Send, X } from "lucide-react";
import { Button } from "@/components/ui";
import { ACTIVE_TERM } from "@/lib/canonicalCampus";

interface PublishTimetableModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  assignedCount?: number;
  studentCount?: number;
  facultyCount?: number;
}

export function PublishTimetableModal({
  open,
  onClose,
  onConfirm,
  assignedCount = 0,
  studentCount = 0,
  facultyCount = 0,
}: PublishTimetableModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 4 }}
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
            className="bg-surface border border-line rounded-2xl w-full max-w-md shadow-xl p-6 relative"
          >
        <div className="flex items-center justify-between border-b border-line pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-soft border border-brand/20 text-brand flex items-center justify-center shrink-0">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-fg">
                Publish Semester Timetable
              </h3>
              <p className="text-xs text-fg-muted">
                Deploy live schedule to student &amp; faculty portals
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-lg text-fg-muted hover:text-fg hover:bg-surface-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3.5 text-xs text-fg-muted">
          <div className="p-3.5 rounded-xl bg-surface-2 border border-line space-y-2">
            <div className="flex items-center justify-between font-sans">
              <span>Target Semester:</span>
              <span className="text-fg font-semibold">{ACTIVE_TERM}</span>
            </div>
            <div className="flex items-center justify-between font-sans tabular-nums">
              <span>Assigned Sections:</span>
              <span className="text-success font-semibold">{assignedCount} scheduled</span>
            </div>
            <div className="flex items-center justify-between font-sans">
              <span>Conflict Validation:</span>
              <span className="text-success font-semibold">0 Overlaps Detected</span>
            </div>
          </div>

          <p className="text-xs leading-relaxed">
            Publishing will push notifications to{" "}
            {studentCount.toLocaleString()} enrolled students and{" "}
            {facultyCount.toLocaleString()} teaching faculty. Course
            routines will be immediately reflected across student dashboard calendars.
          </p>
        </div>

        <div className="pt-4 mt-4 border-t border-line flex items-center justify-end gap-3">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={onConfirm}>
            Confirm &amp; Deploy Routine
          </Button>
        </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
