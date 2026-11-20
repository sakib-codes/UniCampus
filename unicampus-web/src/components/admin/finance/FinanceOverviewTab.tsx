"use client";

import {
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import CountUp from "@/components/bits/CountUp";
import type { Department, PaymentTransaction } from "@/types/admin";

export interface DeptProgressItem {
  department: Department;
  collected: number;
  target: number;
  pending: number;
  percentage: number;
}

interface FinanceOverviewTabProps {
  totalInflow: number;
  totalOutflow: number;
  totalTuitionFees: number;
  totalWagesDisbursed: number;
  totalDues: number;
  deptProgressList: DeptProgressItem[];
  recentTransactions: PaymentTransaction[];
  formatTransactionType: (type: string) => string;
  onSwitchTab: (tab: "departments" | "transactions") => void;
  onViewReceipt: (t: PaymentTransaction) => void;
}

export function FinanceOverviewTab({
  totalInflow,
  totalOutflow,
  totalTuitionFees,
  totalWagesDisbursed,
  totalDues,
  deptProgressList,
  recentTransactions,
  formatTransactionType,
  onSwitchTab,
  onViewReceipt,
}: FinanceOverviewTabProps) {
  return (
    <div className="space-y-5">
      {/* 4 Dynamic KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* KPI 1: Inflow vs Outflow */}
        <div className="p-4 rounded-2xl bg-surface border border-line">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-semibold text-fg-muted">
              Net Cash Flow
            </span>
            <span className="w-7 h-7 rounded-lg bg-brand-soft border border-brand/20 flex items-center justify-center text-brand">
              <CreditCard className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-success flex items-center gap-1 text-xs">
                <ArrowDownLeft className="w-3 h-3" /> Inflow:
              </span>
              <span className="font-bold text-fg tabular-nums">
                ৳{totalInflow.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-danger flex items-center gap-1 text-xs">
                <ArrowUpRight className="w-3 h-3" /> Outflow:
              </span>
              <span className="font-bold text-fg tabular-nums">
                ৳{totalOutflow.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-line flex items-center justify-between text-xs font-semibold text-fg-muted">
            <span>Net Balance</span>
            <span className="text-brand font-bold tabular-nums">
              ৳{(totalInflow - totalOutflow).toLocaleString()}
            </span>
          </div>
        </div>

        {/* KPI 2: Student Tuition Fees */}
        <div className="p-4 rounded-2xl bg-surface border border-line">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-semibold text-fg-muted">
              Tuition Collections
            </span>
            <span className="w-7 h-7 rounded-lg bg-success-light border border-success/20 flex items-center justify-center text-success">
              <ArrowDownLeft className="w-3.5 h-3.5" />
            </span>
          </div>
          <h3 className="text-xl font-bold mb-1 text-fg tabular-nums">
            ৳<CountUp to={totalTuitionFees} duration={0.8} />
          </h3>
          <p className="text-xs text-success font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 shrink-0" /> Fully verified through bKash, Nagad &amp; Bank
          </p>
        </div>

        {/* KPI 3: Faculty Wages Disbursed */}
        <div className="p-4 rounded-2xl bg-surface border border-line">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-semibold text-fg-muted">
              Faculty Payroll
            </span>
            <span className="w-7 h-7 rounded-lg bg-warning-light border border-warning/20 flex items-center justify-center text-warning">
              <DollarSign className="w-3.5 h-3.5" />
            </span>
          </div>
          <h3 className="text-xl font-bold mb-1 text-fg tabular-nums">
            ৳<CountUp to={totalWagesDisbursed} duration={0.8} />
          </h3>
          <p className="text-xs font-medium text-fg-muted">
            Disbursed to verified teachers across 5 academic departments
          </p>
        </div>

        {/* KPI 4: Total Dues */}
        <div className="p-4 rounded-2xl bg-surface border border-line">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-semibold text-fg-muted">
              Outstanding Dues
            </span>
            <span className="w-7 h-7 rounded-lg bg-danger-light border border-danger/20 flex items-center justify-center text-danger">
              <AlertCircle className="w-3.5 h-3.5" />
            </span>
          </div>
          <h3 className="text-xl font-bold text-danger mb-1 tabular-nums">
            ৳<CountUp to={totalDues} duration={0.8} />
          </h3>
          <p className="text-xs text-danger font-medium">
            Pending &amp; overdue student semester payments
          </p>
        </div>
      </div>

      {/* Department Fee Collection Progress Bars */}
      <div className="p-5 rounded-2xl bg-surface border border-line">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-semibold text-fg">
              Department Fee Collection Progress
            </h3>
            <p className="text-xs text-fg-muted mt-1">
              Real-time collection efficiency vs target tuition fee for the current semester
            </p>
          </div>
          <button
            type="button"
            onClick={() => onSwitchTab("departments")}
            className="text-xs font-semibold text-brand hover:underline flex items-center gap-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded px-1"
          >
            Granular Breakdown <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {deptProgressList.map((dp) => (
            <div
              key={dp.department.id}
              className="p-3.5 rounded-xl bg-canvas border border-line space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="px-2 py-0.5 bg-brand-soft border border-brand/20 text-brand rounded-md text-xs font-semibold font-mono shrink-0">
                    {dp.department.code}
                  </span>
                  <span className="font-semibold text-xs text-fg truncate">
                    {dp.department.name}
                  </span>
                </div>
                <span className="font-semibold tabular-nums text-xs text-brand shrink-0">
                  {dp.percentage}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-surface-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand rounded-full transition-[width] duration-300"
                  style={{ width: `${dp.percentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs font-medium pt-0.5 text-fg-muted tabular-nums">
                <span>
                  Collected:{" "}
                  <strong className="text-fg">
                    ৳{dp.collected.toLocaleString()}
                  </strong>
                </span>
                <span>Target: ৳{dp.target.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions Preview */}
      <div className="overflow-hidden rounded-2xl bg-surface border border-line">
        <div className="p-4 border-b border-line flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-fg">
            Recent Ledger Transactions
          </h3>
          <button
            type="button"
            onClick={() => onSwitchTab("transactions")}
            className="text-xs font-semibold text-brand hover:underline flex items-center gap-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded px-1"
          >
            View All Ledger Entries <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-canvas font-sans text-xs font-semibold text-fg-muted border-b border-line">
                <th className="px-4 py-3">Transaction ID</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Classification</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Gateway</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {recentTransactions.map((t) => (
                <tr
                  key={t.id}
                  tabIndex={0}
                  onClick={() => onViewReceipt(t)}
                  onKeyDown={(e) => {
                    if (e.target instanceof HTMLElement && e.target.closest("button, a")) return;
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onViewReceipt(t);
                    }
                  }}
                  className="hover:bg-surface-2/60 border-b border-line transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand"
                >
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewReceipt(t);
                      }}
                      className="font-mono font-semibold text-xs text-brand hover:underline cursor-pointer rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    >
                      {t.transaction_id}
                    </button>
                  </td>
                  <td className="px-4 py-3 font-semibold text-xs text-fg">
                    {t.user_name}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-canvas border border-line text-fg-muted">
                      {formatTransactionType(t.type)}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold tabular-nums text-xs text-fg">
                    ৳{t.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-xs font-medium text-fg-muted">
                    {t.payment_method}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-md text-xs font-semibold border ${
                        t.status === "Paid"
                          ? "bg-success-light text-success border-success/20"
                          : "bg-danger-light text-danger border-danger/20"
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
