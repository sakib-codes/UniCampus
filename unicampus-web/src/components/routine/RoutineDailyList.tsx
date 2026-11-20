"use client";

import { Info, ArrowRight } from "lucide-react";
import { ScheduleSlot } from "./routineData";
import { DailySlotCard } from "./DailySlotCard";

// Export DailyLectureCard as alias for backwards compatibility
export const DailyLectureCard = DailySlotCard;

interface RoutineDailyListProps {
  selectedDay: string;
  activeDaySlots: ScheduleSlot[];
  onOpenSwapModal: () => void;
}

export function RoutineDailyList({
  selectedDay,
  activeDaySlots,
  onOpenSwapModal,
}: RoutineDailyListProps) {
  return (
    <div className="lg:col-span-8 space-y-3">
      {activeDaySlots.length === 0 ? (
        <div className="bg-surface rounded-2xl border border-line p-12 text-center text-fg-muted font-sans text-xs">
          No scheduled lectures matching criteria for {selectedDay}. Enjoy your study break!
        </div>
      ) : (
        activeDaySlots.map((slot, index) => (
          <DailySlotCard key={slot.id} slot={slot} index={index} />
        ))
      )}

      {/* Bottom Council Notice Bar */}
      <div className="p-3.5 rounded-2xl bg-surface border border-line flex flex-col sm:flex-row items-center justify-between text-xs text-fg-muted gap-2">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-brand shrink-0" aria-hidden="true" />
          <span>
            Routine adjustments made by academic council are automatically reflected in real-time.
          </span>
        </div>
        <button
          type="button"
          onClick={onOpenSwapModal}
          className="text-brand hover:underline font-semibold flex items-center gap-1 cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
        >
          <span>Request reschedule or swap</span>
          <ArrowRight className="w-3 h-3" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
