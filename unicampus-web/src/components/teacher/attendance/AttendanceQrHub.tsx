"use client";

import React, { memo } from "react";
import { QrCode, RefreshCw, Copy, Check, GraduationCap } from "lucide-react";
import { ActiveAttendanceSession } from "@/lib/attendanceService";

export interface AttendanceQrHubProps {
  session: ActiveAttendanceSession;
  countdown: number;
  isRotating: boolean;
  qrDataUrl: string;
  copiedPin: boolean;
  onCopyPin: () => void;
  onManualRotate: () => void;
  checkedInCount: number;
  totalEnrolled: number;
  presentCount: number;
  lateCount: number;
  remainingCount: number;
}

export const AttendanceQrHub = memo(function AttendanceQrHub({
  session,
  countdown,
  isRotating,
  qrDataUrl,
  copiedPin,
  onCopyPin,
  onManualRotate,
  checkedInCount,
  totalEnrolled,
  presentCount,
  lateCount,
  remainingCount: _remainingCount,
}: AttendanceQrHubProps) {
  // Circular timer calculation (r=100 -> circumference ~628.32)
  const circleRadius = 100;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeOffset = circumference - (countdown / 15) * circumference;

  // Whole integer attendance percentage
  const attendancePercentage = totalEnrolled > 0
    ? Math.round((checkedInCount / totalEnrolled) * 100)
    : 0;

  return (
    <div className="bg-surface rounded-2xl p-5 border border-line flex flex-col items-center text-center relative shadow-xs h-full">
      {/* Header Pill */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-2 border border-line text-xs font-semibold text-brand mb-2">
        <QrCode className="w-3.5 h-3.5 text-brand" aria-hidden="true" />
        <span>Classroom Check-In QR</span>
      </div>

      <h2 className="font-semibold text-base sm:text-lg text-fg tracking-tight mb-0.5">
        Live Attendance Check-In
      </h2>
      <p className="text-xs text-fg-muted mb-3.5 max-w-xs font-normal">
        Dynamic QR code rotates every 15s for secure classroom check-in.
      </p>

      {/* CENTERPIECE: DYNAMIC QR CODE WITH CIRCULAR PROGRESS RING */}
      <div className="relative w-[220px] h-[220px] flex items-center justify-center mb-3 shrink-0">
        {/* Circular Progress Ring (SVG) */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
          viewBox="0 0 220 220"
          aria-hidden="true"
        >
          <circle
            cx="110"
            cy="110"
            r={circleRadius}
            stroke="currentColor"
            strokeWidth="5"
            fill="transparent"
            className="text-line"
          />
          <circle
            cx="110"
            cy="110"
            r={circleRadius}
            stroke="url(#indigoGrad)"
            strokeWidth="5"
            strokeDasharray={circumference}
            strokeDashoffset={isRotating ? strokeOffset : 0}
            strokeLinecap="round"
            fill="transparent"
            className="transition-[stroke-dashoffset] duration-1000 ease-linear"
          />
          <defs>
            <linearGradient id="indigoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--color-brand, #605BFF)" />
              <stop offset="100%" stopColor="var(--color-brand, #7C78FF)" />
            </linearGradient>
          </defs>
        </svg>

        {/* High-Contrast QR Code Frame (100% Unobstructed) */}
        <div className="w-[176px] h-[176px] rounded-xl bg-surface p-2.5 flex flex-col items-center justify-center relative z-10 border border-line shadow-sm overflow-hidden">
          {qrDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={qrDataUrl}
              alt="Dynamic Live Attendance QR"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-fg-muted gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-brand" aria-hidden="true" />
              <span className="text-xs font-normal">Generating QR...</span>
            </div>
          )}

          {/* Center UniCampus Academic Squircle */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-8 h-8 rounded-lg bg-brand border-2 border-surface shadow-xs flex items-center justify-center text-white">
              <GraduationCap className="w-4 h-4 text-white" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>

      {/* Merged Session Token & Refresh Timer Metadata Pill (In Normal Flex Flow) */}
      <div className="mb-3 flex items-center justify-center">
        <button
          type="button"
          onClick={onManualRotate}
          title="Click to force rotate QR code"
          className="bg-surface-2 border border-line hover:border-brand/60 px-3.5 py-1.5 rounded-full flex items-center gap-2 cursor-pointer transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand min-h-[32px] text-xs shadow-xs"
        >
          <span className="font-mono font-semibold text-fg tracking-wide">
            {session.courseCode}-R{session.rotationCount}
          </span>
          <span className="text-fg-subtle" aria-hidden="true">•</span>
          <div className="flex items-center gap-1.5 text-fg-muted font-sans tabular-nums">
            <RefreshCw className={`w-3 h-3 text-brand ${isRotating ? "animate-spin" : ""}`} aria-hidden="true" />
            {isRotating ? (
              <span>
                Refreshes in <span className="text-brand font-semibold">{countdown}s</span>
              </span>
            ) : (
              <span className="text-warning font-semibold">Rotation Paused</span>
            )}
          </div>
        </button>
      </div>

      {/* BACKUP SESSION PIN BOX - Visually Subordinate */}
      <div className="w-full bg-surface-2 border border-line rounded-xl p-3 mb-3 flex items-center justify-between shadow-xs">
        <div className="text-left">
          <span className="text-xs font-medium text-fg block">
            6-digit backup PIN
          </span>
          <span className="text-[11px] text-fg-muted">
            For students with camera glare
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="font-mono font-semibold text-sm sm:text-base text-fg tracking-[0.16em] bg-surface px-3 py-1 rounded-lg border border-line shadow-xs select-all whitespace-nowrap">
            {session.currentPin.slice(0, 3)} - {session.currentPin.slice(3, 6)}
          </div>
          <button
            type="button"
            onClick={onCopyPin}
            title="Copy Backup PIN"
            aria-label="Copy backup PIN"
            className="p-2 rounded-lg bg-surface hover:bg-surface-2 text-fg-muted hover:text-brand border border-line transition-colors duration-150 cursor-pointer shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand min-h-[36px] min-w-[36px] flex items-center justify-center"
          >
            {copiedPin ? (
              <Check className="w-4 h-4 text-success" aria-hidden="true" />
            ) : (
              <Copy className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* LIVE CHECK-IN PROGRESS METER */}
      <div className="w-full bg-surface-2 border border-line rounded-xl p-3.5 text-left shadow-xs mt-auto">
        <div className="flex items-baseline justify-between mb-2">
          <div className="font-semibold text-xs sm:text-[13px] text-fg">
            <span className="tabular-nums">{checkedInCount}</span>{" "}
            <span className="text-xs font-normal text-fg-muted">
              of {totalEnrolled} Students Checked In
            </span>
          </div>
          <div className="font-semibold text-xs sm:text-[13px] text-success tabular-nums">
            {attendancePercentage}%
          </div>
        </div>

        {/* Borderless Progress Bar Track */}
        <div className="w-full h-2 bg-line rounded-full overflow-hidden flex">
          <div
            className="h-full bg-success transition-[width] duration-300"
            style={{ width: `${totalEnrolled > 0 ? (presentCount / totalEnrolled) * 100 : 0}%` }}
          />
          <div
            className="h-full bg-warning ml-0.5 transition-[width] duration-300"
            style={{ width: `${totalEnrolled > 0 ? (lateCount / totalEnrolled) * 100 : 0}%` }}
          />
        </div>
      </div>
    </div>
  );
});
