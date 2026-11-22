"use client";

import { useMemo } from "react";
import {
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Smartphone,
  ShieldCheck,
  Building,
} from "lucide-react";
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
  totalDues: number;
  totalPendingDues: number;
  totalOverdueAmount: number;
  netBalance: number;
  deptProgressList: DeptProgressItem[];
  recentTransactions: PaymentTransaction[];
  allTransactions: PaymentTransaction[];
  formatTransactionType: (type: string) => string;
  onSwitchTab: (tab: "overview" | "transactions" | "dues" | "payroll" | "gateways") => void;
  onViewReceipt: (t: PaymentTransaction) => void;
}

const GATEWAY_CONFIG: Record<
  string,
  { label: string; icon: typeof CreditCard; colorClass: string; bgClass: string; borderClass: string }
> = {
  bKash: {
    label: "bKash Tokenized (Sandbox)",
    icon: Smartphone,
    colorClass: "text-[#E2136E]",
    bgClass: "bg-[#E2136E]/10",
    borderClass: "border-[#E2136E]/20",
  },
  SSLCommerz: {
    label: "SSLCommerz Hosted (Sandbox)",
    icon: ShieldCheck,
    colorClass: "text-[#005B99]",
    bgClass: "bg-[#005B99]/10",
    borderClass: "border-[#005B99]/20",
  },
  Nagad: {
    label: "Nagad MFS",
    icon: Smartphone,
    colorClass: "text-[#F7941D]",
    bgClass: "bg-[#F7941D]/10",
    borderClass: "border-[#F7941D]/20",
  },
  "Bank Transfer": {
    label: "Electronic Bank Transfer",
    icon: Building,
    colorClass: "text-brand",
    bgClass: "bg-brand-soft",
    borderClass: "border-brand/20",
  },
  Card: {
    label: "Credit / Debit Card",
    icon: CreditCard,
    colorClass: "text-success",
    bgClass: "bg-success-light",
    borderClass: "border-success/20",
  },
};

export function FinanceOverviewTab({
  totalInflow,
  totalOutflow,
  totalDues,
  totalPendingDues,
  totalOverdueAmount,
  netBalance,
  deptProgressList,
  recentTransactions,
  allTransactions,
  formatTransactionType,
  onSwitchTab,
  onViewReceipt,
}: FinanceOverviewTabProps) {
  // Gateway Collection Split calculation
  const gatewayBreakdown = useMemo(() => {
    const paidStudentFees = allTransactions.filter(
      (t) => (t.type === "student_fee" || t.type === "late_fine") && t.status === "Paid"
    );
    const totalCollected = paidStudentFees.reduce((sum, t) => sum + t.amount, 0) || 1;

    const gateways = ["bKash", "SSLCommerz", "Nagad", "Bank Transfer", "Card"] as const;

    return gateways.map((gw) => {
      const gwTxns = paidStudentFees.filter((t) => t.payment_method === gw);
      const amount = gwTxns.reduce((sum, t) => sum + t.amount, 0);
      const count = gwTxns.length;
      const percentage = Math.round((amount / totalCollected) * 100);
      return {
        gateway: gw,
        amount,
        count,
        percentage,
        config: GATEWAY_CONFIG[gw] || {
          label: gw,
          icon: CreditCard,
          colorClass: "text-fg",
          bgClass: "bg-surface-2",
          borderClass: "border-line",
        },
      };
    });
  }, [allTransactions]);

  return (
    <div className="space-y-5 w-full max-w-full min-w-0">
      {/* 5 Executive KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* KPI 1: Inflow vs Outflow Net Cash Flow */}
        <div className="p-4 rounded-2xl bg-surface border border-line flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-fg-muted">Net Cash Flow</span>
              <span className="w-7 h-7 rounded-xl bg-surface-2 border border-line flex items-center justify-center text-fg">
                <CreditCard className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="space-y-1 my-1 text-xs">
              <div className="flex items-center justify-between font-medium">
                <span className="text-success flex items-center gap-1">
                  <ArrowDownLeft className="w-3 h-3" /> Inflow:
                </span>
                <span className="font-semibold text-fg tabular-nums">
                  ৳{totalInflow.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between font-medium">
                <span className="text-danger flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" /> Outflow:
                </span>
                <span className="font-semibold text-fg tabular-nums">
                  ৳{totalOutflow.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-line flex items-center justify-between text-xs font-semibold">
            <span className="text-fg-muted">Net Balance:</span>
            <span className="text-brand tabular-nums font-semibold">
              ৳{netBalance.toLocaleString()}
            </span>
          </div>
        </div>

        {/* KPI 2: Total Collected (Tuition Collections) */}
        <div className="p-4 rounded-2xl bg-surface border border-line flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-fg-muted">Total Collected</span>
              <span className="w-7 h-7 rounded-xl bg-success-light border border-success/20 flex items-center justify-center text-success">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            </div>
            <h3 className="text-xl font-semibold mb-1 text-fg tabular-nums">
              ৳{totalInflow.toLocaleString()}
            </h3>
          </div>
          <p className="text-xs text-success font-medium flex items-center gap-1 mt-2">
            <ArrowDownLeft className="w-3 h-3 shrink-0" /> Settled student tuition &amp; fees
          </p>
        </div>

        {/* KPI 3: Faculty Payroll (Outflow) */}
        <div className="p-4 rounded-2xl bg-surface border border-line flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-fg-muted">Faculty Payroll</span>
              <span className="w-7 h-7 rounded-xl bg-brand-soft border border-brand/20 flex items-center justify-center text-brand">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <h3 className="text-xl font-semibold mb-1 text-fg tabular-nums">
              ৳{totalOutflow.toLocaleString()}
            </h3>
          </div>
          <p className="text-xs text-fg-muted font-medium mt-2">
            Disbursed across academic faculty
          </p>
        </div>

        {/* KPI 4: Total Outstanding Dues */}
        <div className="p-4 rounded-2xl bg-surface border border-line flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-fg-muted">Total Outstanding Dues</span>
              <span className="w-7 h-7 rounded-xl bg-danger-light border border-danger/20 flex items-center justify-center text-danger">
                <AlertCircle className="w-3.5 h-3.5" />
              </span>
            </div>
            <h3 className="text-xl font-semibold text-danger mb-1 tabular-nums">
              ৳{totalDues.toLocaleString()}
            </h3>
          </div>
          <div className="flex items-center justify-between text-xs text-fg-muted pt-2 border-t border-line tabular-nums">
            <span className="flex items-center gap-1 text-warning">
              <Clock className="w-3 h-3" /> Pending: ৳{totalPendingDues.toLocaleString()}
            </span>
            <span className="text-danger">
              Overdue: ৳{totalOverdueAmount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* KPI 5: Net Treasury Balance */}
        <div className="p-4 rounded-2xl bg-surface border border-line flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-fg-muted">Treasury Net Balance</span>
              <span className="w-7 h-7 rounded-xl bg-surface-2 border border-line flex items-center justify-center text-fg">
                <CreditCard className="w-3.5 h-3.5" />
              </span>
            </div>
            <h3 className="text-xl font-semibold mb-1 text-brand tabular-nums">
              ৳{netBalance.toLocaleString()}
            </h3>
          </div>
          <p className="text-xs text-fg-muted font-medium mt-2">
            Inflow minus payroll disbursements
          </p>
        </div>
      </div>

      {/* Gateway Collection Split Section */}
      <div className="p-5 rounded-2xl bg-surface border border-line min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand" />
              <h3 className="text-sm font-semibold text-fg">
                Gateway Collection Split &amp; Reconciliation Share
              </h3>
            </div>
            <p className="text-xs text-fg-muted mt-1">
              Distribution of incoming fee revenue across MFS, electronic banking, and card processors
            </p>
          </div>
          <button
            type="button"
            onClick={() => onSwitchTab("gateways")}
            className="text-xs font-semibold text-brand hover:underline flex items-center gap-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded px-1"
          >
            Gateway Sandbox Console <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {gatewayBreakdown.map((item) => {
            const Icon = item.config.icon;
            return (
              <div
                key={item.gateway}
                className="p-3.5 rounded-xl bg-canvas border border-line space-y-2.5 flex flex-col justify-between min-w-0"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span
                      className={`w-7 h-7 rounded-lg ${item.config.bgClass} ${item.config.borderClass} border flex items-center justify-center ${item.config.colorClass}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </span>
                    <span className="font-semibold tabular-nums text-xs text-fg">
                      {item.percentage}%
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-fg truncate">
                    {item.config.label}
                  </h4>
                  <p className="text-xs text-fg-muted tabular-nums">
                    {item.count} transaction{item.count !== 1 ? "s" : ""}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-line">
                  <div className="w-full h-1.5 bg-surface-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand rounded-full transition-colors"
                      style={{ width: `${Math.max(item.percentage, 4)}%` }}
                    />
                  </div>
                  <div className="font-semibold text-xs text-fg tabular-nums">
                    ৳{item.amount.toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Department Fee Collection Progress */}
      <div className="p-5 rounded-2xl bg-surface border border-line min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-fg">
              Department Fee Collection Progress
            </h3>
            <p className="text-xs text-fg-muted mt-1">
              Real-time collection efficiency vs target tuition fee for the current academic session
            </p>
          </div>
          <button
            type="button"
            onClick={() => onSwitchTab("dues")}
            className="text-xs font-semibold text-brand hover:underline flex items-center gap-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded px-1"
          >
            Semester-Wise Breakdown <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {deptProgressList.map((dp) => (
            <div
              key={dp.department.id}
              className="p-3.5 rounded-xl bg-canvas border border-line space-y-2 min-w-0"
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
                  className="h-full bg-brand rounded-full transition-colors"
                  style={{ width: `${dp.percentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs font-medium pt-0.5 text-fg-muted tabular-nums">
                <span>
                  Collected:{" "}
                  <strong className="text-fg font-semibold">
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
      <div className="overflow-hidden rounded-2xl bg-surface border border-line min-w-0">
        <div className="p-4 border-b border-line flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand" />
            <h3 className="text-sm font-semibold text-fg">
              Recent Ledger Transactions
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onSwitchTab("transactions")}
            className="text-xs font-semibold text-brand hover:underline flex items-center gap-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded px-1"
          >
            View All Ledger Entries <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile View: Compact rows */}
        <div className="block md:hidden divide-y divide-line">
          {recentTransactions.map((t) => (
            <div
              key={t.id}
              onClick={() => onViewReceipt(t)}
              className="p-3.5 space-y-1.5 hover:bg-surface-2/60 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between text-xs gap-2">
                <span className="font-mono font-semibold text-brand">
                  {t.transaction_id}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-md text-xs font-semibold border ${
                    t.status === "Paid"
                      ? "bg-success-light text-success border-success/20"
                      : "bg-danger-light text-danger border-danger/20"
                  }`}
                >
                  {t.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-fg truncate">{t.user_name}</span>
                <span className="font-semibold tabular-nums text-fg">
                  ৳{t.amount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-fg-muted">
                <span>{formatTransactionType(t.type)}</span>
                <span>{t.payment_method}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto min-w-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-canvas text-xs font-semibold text-fg-muted border-b border-line">
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
                          : t.status === "Pending"
                          ? "bg-warning-light text-warning border-warning/20"
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
