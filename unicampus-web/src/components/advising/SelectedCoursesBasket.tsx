"use client";

import React from "react";
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Printer, 
  Trash2, 
  Send 
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { 
  AdvisingCourse, 
  SelectedRegistrationItem, 
  AdvisingClash 
} from "./advisingData";

interface SelectedCoursesBasketProps {
  selectedItems: SelectedRegistrationItem[];
  offerings: AdvisingCourse[];
  clashes: AdvisingClash[];
  status: "draft" | "submitted" | "approved";
  onRemoveItem: (courseCode: string) => void;
  onSubmit: () => void;
  onWithdraw: () => void;
  onOpenSlip: () => void;
}

export function SelectedCoursesBasket({
  selectedItems,
  offerings,
  clashes,
  status,
  onRemoveItem,
  onSubmit,
  onWithdraw,
  onOpenSlip,
}: SelectedCoursesBasketProps) {
  const MAX_CREDITS = 24.0;
  const MIN_FULL_TIME_CREDITS = 12.0;

  // Resolve detailed items
  const details = selectedItems.map((item) => {
    const course = offerings.find((c) => c.code === item.courseCode);
    const section = course?.sections.find((s) => s.id === item.sectionId);
    return {
      courseCode: item.courseCode,
      title: course?.title || item.courseCode,
      credits: course?.credits || 0,
      type: course?.type || "Theory",
      sectionName: section?.sectionName || "Section A",
      days: section?.days || [],
      timeSlot: section?.timeSlot || "",
      room: section?.room || "",
    };
  });

  const totalCredits = details.reduce((sum, item) => sum + item.credits, 0);
  const creditPercent = Math.min(100, Math.round((totalCredits / MAX_CREDITS) * 100));
  const hasClashes = clashes.length > 0;
  const isCreditOverload = totalCredits > MAX_CREDITS;
  const isBelowMin = totalCredits > 0 && totalCredits < MIN_FULL_TIME_CREDITS;
  const canSubmit =
    status === "draft" &&
    totalCredits >= MIN_FULL_TIME_CREDITS &&
    !isCreditOverload &&
    !hasClashes;

  return (
    <div className="rounded-2xl bg-surface border border-line p-5 space-y-5 sticky top-20 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-line">
        <div>
          <h2 className="text-base font-semibold text-fg tracking-tight">
            Registration Basket
          </h2>
          <p className="text-xs text-fg-muted">
            {details.length} course{details.length === 1 ? "" : "s"} selected
          </p>
        </div>

        <span className="font-mono text-sm font-bold text-fg tabular-nums bg-surface-2 px-2.5 py-1 rounded-lg border border-line">
          {totalCredits.toFixed(1)} / {MAX_CREDITS.toFixed(1)} Cr
        </span>
      </div>

      {/* Credit Progress Gauge */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="text-fg-muted">Credit Load</span>
          <span
            className={
              isCreditOverload
                ? "text-danger font-semibold"
                : isBelowMin
                ? "text-warning font-semibold"
                : "text-success font-semibold"
            }
          >
            {totalCredits.toFixed(1)} Credits
          </span>
        </div>

        <div className="w-full h-2 rounded-full bg-surface-2 overflow-hidden border border-line">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              isCreditOverload
                ? "bg-danger"
                : isBelowMin
                ? "bg-warning"
                : "bg-brand"
            }`}
            style={{ width: `${creditPercent}%` }}
          />
        </div>

        <p className="text-[11px] text-fg-muted">
          Min full-time: {MIN_FULL_TIME_CREDITS} Cr • Regular cap: 21 Cr • Honor roll cap: 24 Cr
        </p>
      </div>

      {/* Clash Alert Box */}
      {hasClashes && (
        <div className="p-3.5 rounded-xl bg-danger-light border border-danger/30 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-danger">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Timetable Schedule Clash Detected!</span>
          </div>
          {clashes.map((c, idx) => (
            <div key={idx} className="text-[11px] text-danger/90 leading-snug">
              • <strong>{c.courseA}</strong> and <strong>{c.courseB}</strong> collide on{" "}
              {c.day} ({c.timeSlot}).
            </div>
          ))}
          <p className="text-[11px] text-fg-muted pt-1">
            Change the conflicting section in the course list to proceed.
          </p>
        </div>
      )}

      {/* Below Min Warning */}
      {isBelowMin && (
        <div className="p-3 rounded-xl bg-warning-light border border-warning/30 text-xs text-warning flex items-center gap-2">
          <Clock className="w-4 h-4 shrink-0" />
          <span>
            Minimum full-time load is 12.0 Credits. Add {MIN_FULL_TIME_CREDITS - totalCredits} more credit(s).
          </span>
        </div>
      )}

      {/* Selected Items List */}
      <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-0.5">
        {details.length === 0 ? (
          <div className="py-8 text-center text-xs text-fg-muted space-y-1">
            <p className="font-semibold text-fg">No courses selected yet</p>
            <p>Select required core or elective courses from the catalog.</p>
          </div>
        ) : (
          details.map((item) => (
            <div
              key={item.courseCode}
              className="p-3 rounded-xl bg-canvas border border-line space-y-1.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-fg">
                      {item.courseCode}
                    </span>
                    <span className="text-[11px] text-brand font-medium">
                      {item.credits.toFixed(1)} Cr
                    </span>
                  </div>
                  <h4 className="text-xs font-medium text-fg truncate">
                    {item.title}
                  </h4>
                </div>

                {status === "draft" && (
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.courseCode)}
                    aria-label={`Remove ${item.courseCode}`}
                    className="p-1 rounded text-fg-muted hover:text-danger hover:bg-danger-light transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="text-[11px] text-fg-muted flex items-center justify-between font-sans pt-0.5">
                <span>{item.sectionName}</span>
                <span>{item.days.join(", ")} • {item.timeSlot}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Action Strip */}
      <div className="space-y-2 pt-2 border-t border-line">
        {status === "draft" ? (
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={onSubmit}
            disabled={!canSubmit}
            className="w-full font-semibold flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Submit Registration Plan</span>
          </Button>
        ) : (
          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-brand-soft border border-brand/20 text-xs text-brand space-y-1">
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {status === "approved"
                    ? "Official Registration Approved"
                    : "Plan Submitted to Advisor"}
                </span>
              </div>
              <p className="text-[11px] text-fg-muted">
                {status === "approved"
                  ? "Classes are scheduled in your Weekly Routine."
                  : "Awaiting advisor verification and prerequisite review."}
              </p>
            </div>

            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={onOpenSlip}
              className="w-full flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>View / Print Advising Slip</span>
            </Button>

            {status === "submitted" && (
              <button
                type="button"
                onClick={onWithdraw}
                className="w-full text-center text-xs text-fg-muted hover:text-danger font-medium transition-colors py-1 cursor-pointer"
              >
                Withdraw &amp; Unlock Draft
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
