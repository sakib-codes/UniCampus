"use client";

import React from "react";
import Link from "next/link";
import {
  Megaphone,
  MapPin,
  Play,
  CalendarDays,
  Printer,
  ChevronRight,
} from "lucide-react";
import { ACTIVE_TERM } from "@/lib/canonicalCampus";
import type { TeachingSession } from "./teacherDashboardData";

interface ScheduleRowProps {
  session: TeachingSession;
  onStartQr: (session: TeachingSession) => void;
}

const ScheduleTableRow = React.memo(function ScheduleTableRow({
  session,
  onStartQr,
}: ScheduleRowProps) {
  return (
    <tr className="group hover:bg-surface-2/60 transition-colors">
      <td className="py-4 px-2.5 font-sans tabular-nums font-semibold text-fg whitespace-nowrap">
        <span>{session.timeSlot}</span>
      </td>

      <td className="py-4 px-2.5 min-w-[160px]">
        <div className="font-mono font-semibold text-brand">
          {session.courseCode}
        </div>
        <div className="text-xs text-fg-muted">{session.courseTitle}</div>
      </td>

      <td className="py-4 px-2.5 whitespace-nowrap">
        <span className="px-2 py-0.5 rounded bg-surface-2 border border-line font-sans text-xs text-fg whitespace-nowrap inline-block">
          {session.section}
        </span>
      </td>

      <td className="py-4 px-2.5 font-sans text-fg whitespace-nowrap">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-fg-muted shrink-0" />
          {session.room}
        </span>
      </td>

      <td className="py-4 px-2.5 text-right font-sans text-fg font-semibold tabular-nums whitespace-nowrap">
        {session.enrolledCount}
      </td>

      <td className="py-4 px-2.5 text-right whitespace-nowrap">
        {session.isNext ? (
          <button
            type="button"
            onClick={() => onStartQr(session)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand hover:bg-brand-hover text-on-brand text-xs font-semibold transition-colors cursor-pointer active:scale-[0.98] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start QR</span>
          </button>
        ) : (
          <span className="text-xs font-sans text-fg-muted whitespace-nowrap">
            Upcoming
          </span>
        )}
      </td>
    </tr>
  );
});

const ScheduleMobileCard = React.memo(function ScheduleMobileCard({
  session,
  onStartQr,
}: ScheduleRowProps) {
  return (
    <div className="p-4 rounded-2xl bg-surface-2 border border-line space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-sans tabular-nums text-xs font-semibold text-fg">
          {session.timeSlot}
        </span>
        <span className="px-2 py-0.5 rounded bg-surface border border-line font-sans text-xs text-fg whitespace-nowrap">
          {session.section}
        </span>
      </div>

      <div>
        <div className="font-mono text-xs font-semibold text-brand">
          {session.courseCode}
        </div>
        <div className="text-sm font-semibold text-fg mt-0.5">
          {session.courseTitle}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-sans tabular-nums text-fg-muted">
        <span className="inline-flex items-center gap-1.5 text-fg">
          <MapPin className="w-3.5 h-3.5 text-fg-muted shrink-0" />
          {session.room}
        </span>
        <span>{session.enrolledCount} students</span>
      </div>

      {session.isNext ? (
        <button
          type="button"
          onClick={() => onStartQr(session)}
          className="w-full min-h-[44px] px-4 py-2 rounded-xl bg-brand hover:bg-brand-hover text-on-brand text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Start QR</span>
        </button>
      ) : (
        <div className="text-xs font-sans text-fg-muted pt-1 border-t border-line">
          Status: Upcoming
        </div>
      )}
    </div>
  );
});

interface TeachingSchedulePanelProps {
  sessions: TeachingSession[];
  onOpenAnnouncement: () => void;
  onStartQr: (session: TeachingSession) => void;
}

export function TeachingSchedulePanel({
  sessions,
  onOpenAnnouncement,
  onStartQr,
}: TeachingSchedulePanelProps) {
  return (
    <div className="lg:col-span-8 rounded-2xl bg-surface border border-line p-5 sm:p-6 flex flex-col justify-between">
      <div>
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-line">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold text-fg tracking-tight">
                Today&apos;s Teaching Schedule
              </h2>
              <span className="px-2 py-0.5 rounded-md bg-surface-2 text-fg-muted text-xs font-sans tabular-nums border border-line whitespace-nowrap">
                {sessions.length} Sessions
              </span>
            </div>
            <p className="text-xs text-fg-muted mt-0.5">
              Faculty course allocation for Monday, {ACTIVE_TERM}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onOpenAnnouncement}
              className="min-h-[44px] sm:min-h-[36px] px-3 py-1.5 rounded-xl bg-surface-2 text-xs font-semibold text-fg border border-line hover:border-brand/40 transition-colors inline-flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <Megaphone className="w-3.5 h-3.5 text-brand" />
              <span>Post Notice</span>
            </button>

            <Link
              href="/teacher/routine"
              className="min-h-[44px] sm:min-h-[36px] px-3 py-1.5 rounded-xl bg-surface-2 text-xs font-semibold text-fg border border-line hover:border-brand/40 transition-colors inline-flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <CalendarDays className="w-3.5 h-3.5 text-brand" />
              <span>Full Week</span>
            </Link>

            <button
              type="button"
              onClick={() => window.print()}
              className="min-h-[44px] sm:min-h-[36px] px-3 py-1.5 rounded-xl bg-brand text-on-brand text-xs font-semibold hover:bg-brand-hover transition-colors inline-flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Desktop Teaching Schedule Table */}
        <div className="hidden md:block overflow-x-auto mt-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-xs font-sans text-fg-muted border-b border-line/60">
                <th className="py-3 px-2.5 font-semibold">Time Slot</th>
                <th className="py-3 px-2.5 font-semibold min-w-[160px]">Course</th>
                <th className="py-3 px-2.5 font-semibold">Section</th>
                <th className="py-3 px-2.5 font-semibold">Room</th>
                <th className="py-3 px-2.5 font-semibold text-right">Students</th>
                <th className="py-3 px-2.5 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/40">
              {sessions.map((session) => (
                <ScheduleTableRow
                  key={session.id}
                  session={session}
                  onStartQr={onStartQr}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Session Cards (< md) */}
        <div className="md:hidden mt-4 space-y-3">
          {sessions.map((session) => (
            <ScheduleMobileCard
              key={session.id}
              session={session}
              onStartQr={onStartQr}
            />
          ))}
        </div>
      </div>

      {/* Table Footer */}
      <div className="mt-4 pt-4 border-t border-line flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-fg-muted">
        <span className="font-sans tabular-nums">
          Total teaching hours scheduled today: 5.0 hrs
        </span>
        <Link
          href="/teacher/routine"
          className="text-brand hover:underline font-semibold inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-md px-1"
        >
          <span>View Enrolled Student Rosters</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
