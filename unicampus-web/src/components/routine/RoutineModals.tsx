"use client";

import { useState } from "react";
import { Select } from "@/components/ui/Select";

import { CalendarPlus, Send, CheckCircle2 } from "lucide-react";
import { Modal, Button } from "@/components/ui";
import { ACTIVE_TERM } from "@/lib/canonicalCampus";

interface CalendarSyncModalProps {
  open: boolean;
  syncSuccess: boolean;
  onClose: () => void;
  onSync: () => void;
}

export function CalendarSyncModal({
  open,
  syncSuccess,
  onClose,
  onSync,
}: CalendarSyncModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      title={
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-soft text-brand flex items-center justify-center shrink-0">
            <CalendarPlus className="w-4 h-4" aria-hidden="true" />
          </div>
          <span>Google Calendar Sync</span>
        </div>
      }
      description={`Semester ${ACTIVE_TERM} • 18 Weekly Events`}
      footer={
        <div className="flex items-center justify-end gap-2.5 w-full">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
          {!syncSuccess && (
            <Button type="button" variant="primary" size="sm" onClick={onSync}>
              Sync Now
            </Button>
          )}
        </div>
      }
    >
      {syncSuccess ? (
        <div className="p-6 rounded-2xl bg-success-light border border-success/25 text-center space-y-2">
          <CheckCircle2 className="w-10 h-10 text-success mx-auto" aria-hidden="true" />
          <h3 className="font-semibold text-sm text-success">
            Synced Successfully!
          </h3>
          <p className="text-xs text-fg-muted">
            Your lectures and labs have been added to your linked Google Calendar with 10-minute notifications.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-surface-2 border border-line space-y-2.5 text-xs">
            <div className="flex items-center justify-between gap-2 text-fg">
              <span>Target Calendar:</span>
              <span className="font-sans font-semibold text-fg">
                sakib.cse@unicampus.edu
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 text-fg">
              <span>Reminders:</span>
              <span className="font-sans tabular-nums text-success font-semibold">
                10 mins before class
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 text-fg">
              <span>Automatic Updates:</span>
              <span className="font-sans text-brand font-semibold">Enabled</span>
            </div>
          </div>

          <p className="text-xs text-fg-muted leading-relaxed">
            Syncing imports all weekly lectures, room allocations, instructor names, and exam blackout slots directly into your calendar.
          </p>
        </div>
      )}
    </Modal>
  );
}

interface SwapRequestModalProps {
  open: boolean;
  submitted: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function SwapRequestModal({
  open,
  submitted,
  onClose,
  onSubmit,
}: SwapRequestModalProps) {
  const [selectedSlot, setSelectedSlot] = useState("CSE-3101");

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      title={
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-soft text-brand flex items-center justify-center shrink-0">
            <Send className="w-4 h-4" aria-hidden="true" />
          </div>
          <span>Request Reschedule or Swap</span>
        </div>
      }
      description="Academic Council & Class Representative Channel"
    >
      {submitted ? (
        <div className="p-6 rounded-2xl bg-success-light border border-success/25 text-center space-y-2">
          <CheckCircle2 className="w-10 h-10 text-success mx-auto" aria-hidden="true" />
          <h3 className="font-semibold text-sm text-success">
            Request Submitted to Academic CR!
          </h3>
          <p className="text-xs text-fg-muted">
            Your suggestion has been logged with the Department Routine Committee. You will receive a notification once reviewed.
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="swap-course-slot"
              className="block text-xs font-semibold text-fg"
            >
              Select Course Slot to Adjust
            </label>
            <Select
              id="swap-course-slot"
              ariaLabel="Select Course Slot to Adjust"
              value={selectedSlot}
              onChange={setSelectedSlot}
              options={[
                {
                  value: "CSE-3101",
                  label: "CSE-3101 • Design & Analysis of Algorithms (Monday 10:15 AM)",
                },
                {
                  value: "CSE-3205",
                  label: "CSE-3205 • Software Engineering & System Design (Monday 01:00 PM)",
                },
                {
                  value: "CSE-3206",
                  label: "CSE-3206 • Software Engineering Lab (Monday 02:45 PM)",
                },
              ]}
              size="md"
              variant="surface2"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="swap-proposed-time"
              className="block text-xs font-semibold text-fg"
            >
              Proposed Day &amp; Time Slot
            </label>
            <input
              id="swap-proposed-time"
              type="text"
              required
              placeholder="e.g. Wednesday 03:00 PM - 04:30 PM (Lab 4 Available)"
              className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-surface-2 border border-line text-xs text-fg placeholder:text-fg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:border-brand"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="swap-reason"
              className="block text-xs font-semibold text-fg"
            >
              Reason for Reschedule / Swap
            </label>
            <textarea
              id="swap-reason"
              rows={3}
              required
              placeholder="e.g. Consecutive lab clashes with department programming contest preparation..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-line text-xs text-fg placeholder:text-fg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:border-brand"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Submit Proposal
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
