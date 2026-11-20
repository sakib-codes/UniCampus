"use client";

import React from "react";
import { CheckCircle2, GripVertical, Plus } from "lucide-react";
import { TIME_SLOTS, type RoomItem, type SlotData } from "./adminRoutineData";

interface TimetableSlotCellProps {
  room: RoomItem;
  slotIndex: number;
  slotItem: SlotData | undefined;
  span: number;
  isActive: boolean;
  isBreak: boolean;
  onSelectSlot: (id: string) => void;
  onBreakClick: () => void;
  onAssignFreeSlot: (room: RoomItem, slotIdx: number) => void;
}

const TimetableSlotCell = React.memo(function TimetableSlotCell({
  room,
  slotIndex,
  slotItem,
  span,
  isActive,
  isBreak,
  onSelectSlot,
  onBreakClick,
  onAssignFreeSlot,
}: TimetableSlotCellProps) {
  if (slotItem) {
    const isEee = slotItem.deptType === "eee";
    const isBba = slotItem.deptType === "bba";

    const cardTone = isActive
      ? "bg-brand-soft/60 border-2 border-brand"
      : isEee
      ? "bg-success-light/60 border border-success/30 hover:border-success"
      : isBba
      ? "bg-warning-light/60 border border-warning/30 hover:border-warning"
      : "bg-brand-soft/40 border border-brand/30 hover:border-brand";

    const titleColor = isEee
      ? "text-success"
      : isBba
      ? "text-warning"
      : "text-brand";

    return (
      <div
        className={`${
          span === 2 ? "col-span-2" : ""
        } p-1.5 border-r border-line/50 last:border-r-0`}
      >
        <button
          type="button"
          onClick={() => onSelectSlot(slotItem.id)}
          className={`h-full w-full text-left rounded-xl p-2 flex flex-col justify-between transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${cardTone}`}
        >
          <div className="flex items-start justify-between gap-1">
            <span className={`text-xs font-semibold truncate ${titleColor}`}>
              <span className="font-mono">{slotItem.courseCode}</span> •{" "}
              {slotItem.section.replace("Section ", "")}
            </span>
            {isActive ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-brand shrink-0" />
            ) : (
              <GripVertical className="w-3.5 h-3.5 text-fg-muted/60 shrink-0" />
            )}
          </div>

          <p className="text-[11px] text-fg truncate font-medium my-1">
            {slotItem.instructor} • {slotItem.courseName}
          </p>

          <div className="flex items-center justify-between gap-1">
            <span className="font-sans text-[11px] px-1.5 py-0.5 rounded bg-surface border border-line text-fg font-semibold tabular-nums">
              {slotItem.enrolled}/{slotItem.roomCapacity}
            </span>
            {span === 2 ? (
              <span className="font-sans text-[11px] text-brand font-semibold">
                Lab Block
              </span>
            ) : isActive ? (
              <span className="text-[11px] text-brand font-semibold">
                Selected
              </span>
            ) : null}
          </div>
        </button>
      </div>
    );
  }

  return (
    <div
      className={`p-1.5 border-r border-line/50 last:border-r-0 ${
        isBreak ? "bg-surface-2/40" : ""
      }`}
    >
      <button
        type="button"
        onClick={() =>
          isBreak ? onBreakClick() : onAssignFreeSlot(room, slotIndex)
        }
        className="h-full w-full border border-dashed border-line rounded-xl flex flex-col items-center justify-center p-2 text-center hover:bg-surface-2 hover:border-brand/60 group transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        <Plus className="w-3.5 h-3.5 text-fg-muted group-hover:text-brand" />
        <span className="text-[11px] font-sans text-fg-muted group-hover:text-fg mt-1 whitespace-nowrap">
          {isBreak ? "Midday Break" : room.isLab ? "Free Lab" : "Free Slot"}
        </span>
      </button>
    </div>
  );
});

interface TimetableMatrixGridProps {
  rooms: RoomItem[];
  slots: SlotData[];
  selectedDay: string;
  deptFilter: string;
  activeSlotId: string | null;
  showUtilization: boolean;
  onSelectSlot: (id: string) => void;
  onBreakClick: () => void;
  onAssignFreeSlot: (room: RoomItem, slotIdx: number) => void;
}

export function TimetableMatrixGrid({
  rooms,
  slots,
  selectedDay,
  deptFilter,
  activeSlotId,
  showUtilization,
  onSelectSlot,
  onBreakClick,
  onAssignFreeSlot,
}: TimetableMatrixGridProps) {
  return (
    <div className="w-full lg:flex-1 min-w-0 bg-surface rounded-2xl border border-line overflow-hidden flex flex-col">
      <div className="overflow-x-auto w-full">
        <div className="min-w-[736px]">
          {/* Matrix Header Row */}
          <div className="grid grid-cols-[124px_repeat(6,minmax(102px,1fr))] bg-surface-2 border-b border-line">
            <div className="sticky left-0 z-20 p-3 bg-surface-2 border-r border-line flex flex-col justify-center">
              <span className="font-sans text-xs font-semibold text-fg leading-tight">
                Room
              </span>
              <span className="font-sans text-[11px] text-fg-muted leading-tight">
                Time Slot →
              </span>
            </div>

            {TIME_SLOTS.map((slot, idx) => (
              <div
                key={idx}
                className={`p-2.5 text-center border-r border-line/60 last:border-r-0 ${
                  slot.isBreak ? "bg-warning-light/40" : ""
                }`}
              >
                <span
                  className={`font-sans text-xs font-semibold block tabular-nums whitespace-nowrap ${
                    slot.isBreak ? "text-warning" : "text-fg"
                  }`}
                >
                  {slot.label}
                </span>
                <span
                  className={`text-[11px] font-sans whitespace-nowrap ${
                    slot.isBreak ? "text-warning font-medium" : "text-fg-muted"
                  }`}
                >
                  {slot.sub}
                </span>
              </div>
            ))}
          </div>

          {/* Matrix Rows */}
          {rooms.length === 0 ? (
            <div className="py-12 px-6 text-center text-xs text-fg-muted">
              No rooms match the selected capacity filter.
            </div>
          ) : (
            rooms.map((room) => {
              const roomSlots = slots.filter(
                (s) =>
                  s.room === room.name &&
                  s.day === selectedDay &&
                  (deptFilter === "all" ||
                    s.deptType === deptFilter ||
                    (deptFilter === "cse" && s.deptType === "lab"))
              );

              const cells: React.ReactNode[] = [];
              let sIdx = 0;
              while (sIdx < TIME_SLOTS.length) {
                const currentIdx = sIdx;
                const slotItem = roomSlots.find((s) => s.slotIndex === currentIdx);
                const span = slotItem ? (slotItem.slotSpan ?? 1) : 1;
                sIdx += span;

                cells.push(
                  <TimetableSlotCell
                    key={`${room.id}-${currentIdx}`}
                    room={room}
                    slotIndex={currentIdx}
                    slotItem={slotItem}
                    span={span}
                    isActive={Boolean(slotItem && activeSlotId === slotItem.id)}
                    isBreak={Boolean(TIME_SLOTS[currentIdx].isBreak)}
                    onSelectSlot={onSelectSlot}
                    onBreakClick={onBreakClick}
                    onAssignFreeSlot={onAssignFreeSlot}
                  />
                );
              }

              return (
                <div
                  key={room.id}
                  className="grid grid-cols-[124px_repeat(6,minmax(102px,1fr))] border-b border-line/60 min-h-[104px] last:border-b-0"
                >
                  {/* Sticky Room Y-Axis Meta */}
                  <div className="sticky left-0 z-10 p-3 bg-surface-2 border-r border-line flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-sans text-xs font-semibold text-fg truncate">
                          {room.name}
                        </span>
                        {showUtilization && (
                          <span
                            className={`font-sans tabular-nums text-[11px] px-1 py-0.5 rounded shrink-0 ${
                              room.util === "Maint"
                                ? "bg-warning-light text-warning border border-warning/20"
                                : "bg-success-light text-success border border-success/20"
                            }`}
                          >
                            {room.util}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-fg-muted font-sans tabular-nums block mt-0.5">
                        {room.capacity} {room.isLab ? "PCs" : "Seats"}
                      </span>
                    </div>
                    <span className="text-[11px] text-fg-muted font-sans truncate">
                      {room.type}
                    </span>
                  </div>

                  {cells}
                </div>
              );
            })
          )}

          {/* Matrix Footer Bar */}
          <div className="p-3.5 bg-surface-2 border-t border-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-sans text-fg-muted px-4">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-success-light border border-success" />
                <span>Dept EEE</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-brand-soft border border-brand" />
                <span>Dept CSE &amp; Labs</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-warning-light border border-warning" />
                <span>Dept BBA</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span>Total Weekly Capacity Utilization:</span>
              <span className="font-semibold text-fg font-sans tabular-nums">
                78.4%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
