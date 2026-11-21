"use client";

import React from "react";
import { ArrowUpRight, CheckCircle2, Clock, CreditCard, Landmark, Wallet } from "lucide-react";
import CountUp from "@/components/bits/CountUp";
import type { TeacherWage } from "@/types/admin";

interface PayrollKpiStripProps {
  currentMonthWage: TeacherWage | undefined;
  ytdDisbursedTotal: number;
  primaryPayoutMethod: {
    channel: string;
    details: string;
  };
  onManagePayout: () => void;
}

export function PayrollKpiStrip({
  currentMonthWage,
  ytdDisbursedTotal,
  primaryPayoutMethod,
  onManagePayout,
}: PayrollKpiStripProps) {
  const currentNet = currentMonthWage?.net_amount ?? 85000;
  const currentBase = currentMonthWage?.base_amount ?? 80000;
  const currentAllowances = currentMonthWage?.allowances ?? 10000;
  const currentDeductions = currentMonthWage?.deductions ?? 5000;
  const isDisbursed = currentMonthWage?.status === "Disbursed";
  const currentMonthLabel = currentMonthWage?.month ?? "November 2026";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {/* 1. Current Month Net Pay */}
      <div className="rounded-2xl bg-surface border border-line p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-fg-muted">
            Current Month Net Pay
          </span>
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold border ${
              isDisbursed
                ? "bg-success-light text-success border-success/20"
                : "bg-warning-light text-warning border-warning/20"
            }`}
          >
            {isDisbursed ? (
              <>
                <CheckCircle2 className="w-3 h-3 shrink-0" aria-hidden="true" />
                Disbursed
              </>
            ) : (
              <>
                <Clock className="w-3 h-3 shrink-0" aria-hidden="true" />
                Pending
              </>
            )}
          </span>
        </div>

        <div className="mt-3">
          <div className="text-2xl font-bold text-fg tabular-nums tracking-tight">
            BDT ৳<CountUp to={currentNet} duration={0.8} />
          </div>
          <p className="mt-1 text-xs text-fg-muted">
            For {currentMonthLabel} remuneration cycle
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between text-xs text-fg-muted">
          <span>Gross: ৳{(currentBase + currentAllowances).toLocaleString()}</span>
          <span>Deductions: -৳{currentDeductions.toLocaleString()}</span>
        </div>
      </div>

      {/* 2. YTD Total Disbursed */}
      <div className="rounded-2xl bg-surface border border-line p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-fg-muted">
            YTD Total Disbursed
          </span>
          <span className="p-1.5 rounded-lg bg-surface-2 text-success">
            <ArrowUpRight className="w-4 h-4 shrink-0" aria-hidden="true" />
          </span>
        </div>

        <div className="mt-3">
          <div className="text-2xl font-bold text-success tabular-nums tracking-tight">
            BDT ৳<CountUp to={ytdDisbursedTotal} duration={0.8} />
          </div>
          <p className="mt-1 text-xs text-fg-muted">
            Sum of all disbursed net salaries (2026)
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between text-xs text-fg-muted">
          <span>Direct to faculty account</span>
          <span className="text-success font-medium">100% Reconciled</span>
        </div>
      </div>

      {/* 3. Base + Allowances Breakdown */}
      <div className="rounded-2xl bg-surface border border-line p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-fg-muted">
            Base + Allowances
          </span>
          <span className="p-1.5 rounded-lg bg-surface-2 text-brand">
            <CreditCard className="w-4 h-4 shrink-0" aria-hidden="true" />
          </span>
        </div>

        <div className="mt-3">
          <div className="text-base font-semibold text-fg tabular-nums leading-snug">
            Base ৳{currentBase.toLocaleString()} + Allowances ৳{currentAllowances.toLocaleString()}
          </div>
          <p className="mt-1 text-xs text-fg-muted">
            Standard contractual compensation split
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-line/60">
          <div className="w-full bg-surface-2 rounded-full h-2 overflow-hidden flex">
            <div
              className="bg-brand h-full"
              style={{
                width: `${Math.round((currentBase / (currentBase + currentAllowances)) * 100)}%`,
              }}
              title="Base Salary"
            />
            <div
              className="bg-success h-full"
              style={{
                width: `${Math.round((currentAllowances / (currentBase + currentAllowances)) * 100)}%`,
              }}
              title="Allowances"
            />
          </div>
          <div className="flex items-center justify-between mt-1.5 text-[11px] text-fg-muted">
            <span>Base (89%)</span>
            <span>Allowances (11%)</span>
          </div>
        </div>
      </div>

      {/* 4. Primary Payout Channel */}
      <div className="rounded-2xl bg-surface border border-line p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-fg-muted">
            Primary Payout Channel
          </span>
          <span className="p-1.5 rounded-lg bg-surface-2 text-brand">
            {primaryPayoutMethod.channel.toLowerCase().includes("bkash") ? (
              <Wallet className="w-4 h-4 shrink-0" aria-hidden="true" />
            ) : (
              <Landmark className="w-4 h-4 shrink-0" aria-hidden="true" />
            )}
          </span>
        </div>

        <div className="mt-3">
          <div className="text-lg font-bold text-fg leading-tight truncate">
            {primaryPayoutMethod.channel}
          </div>
          <p className="mt-1 text-xs font-medium text-fg-muted truncate">
            {primaryPayoutMethod.details}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between">
          <span className="text-xs text-success font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 shrink-0" aria-hidden="true" />
            Active Channel
          </span>
          <button
            type="button"
            onClick={onManagePayout}
            className="text-xs font-semibold text-brand hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded py-1 px-1.5"
          >
            Manage Channel →
          </button>
        </div>
      </div>
    </div>
  );
}
