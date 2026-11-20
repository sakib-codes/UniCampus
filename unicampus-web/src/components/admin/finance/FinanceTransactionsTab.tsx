"use client";

import React from "react";
import { Search, Download, Copy, Receipt } from "lucide-react";
import type { Department, PaymentTransaction } from "@/types/admin";

interface TransactionItemProps {
  t: PaymentTransaction;
  formatTransactionType: (type: string) => string;
  onViewReceipt: (t: PaymentTransaction) => void;
  onCopy: (text: string, label: string) => void;
}

const TransactionRow = React.memo(function TransactionRow({
  t,
  formatTransactionType,
  onViewReceipt,
  onCopy,
}: TransactionItemProps) {
  return (
    <tr
      tabIndex={0}
      onClick={() => onViewReceipt(t)}
      onKeyDown={(e) => {
        if (e.target instanceof HTMLElement && e.target.closest("button, a")) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onViewReceipt(t);
        }
      }}
      className="hover:bg-surface-2/60 border-b border-line transition-colors group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand"
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="font-mono font-semibold text-xs text-brand group-hover:underline">
            {t.transaction_id}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCopy(t.transaction_id, "Transaction ID copied");
            }}
            title="Copy TXN ID"
            aria-label={`Copy transaction ID ${t.transaction_id}`}
            className="text-fg-muted hover:text-fg rounded-lg p-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>
        <span className="text-xs block mt-0.5 text-fg-muted tabular-nums">
          {new Date(t.created_at).toLocaleString()}
        </span>
      </td>

      <td className="px-4 py-3">
        <div className="font-semibold text-xs text-fg">{t.user_name}</div>
        <div className="text-xs text-fg-muted">
          {t.student_id ? (
            <>
              Student ID: <span className="font-mono">{t.student_id}</span>
            </>
          ) : (
            "Faculty Member"
          )}
        </div>
      </td>

      <td className="px-4 py-3">
        <div className="text-xs font-medium text-fg-muted">
          {t.department_name}
        </div>
        <div className="text-xs text-brand font-medium">{t.semester_name}</div>
      </td>

      <td className="px-4 py-3 font-semibold tabular-nums text-xs text-fg">
        ৳{t.amount.toLocaleString()}
        <span className="block text-xs font-normal text-fg-muted">
          {formatTransactionType(t.type)}
        </span>
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

      <td className="px-4 py-3 text-right">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onViewReceipt(t);
          }}
          className="bg-canvas hover:bg-surface-2 text-fg border border-line rounded-xl font-semibold px-2.5 py-1 inline-flex items-center gap-1.5 text-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <Receipt className="w-3.5 h-3.5 text-brand" />
          View Voucher
        </button>
      </td>
    </tr>
  );
});

const TransactionCard = React.memo(function TransactionCard({
  t,
  formatTransactionType,
  onViewReceipt,
  onCopy,
}: TransactionItemProps) {
  return (
    <div className="p-4 space-y-3 hover:bg-surface-2/50 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onViewReceipt(t)}
              className="font-mono font-semibold text-xs text-brand hover:underline cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
            >
              {t.transaction_id}
            </button>
            <button
              type="button"
              onClick={() => onCopy(t.transaction_id, "Transaction ID copied")}
              title="Copy TXN ID"
              aria-label={`Copy transaction ID ${t.transaction_id}`}
              className="text-fg-muted hover:text-fg rounded-lg p-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
          <span className="text-xs block mt-0.5 text-fg-muted tabular-nums">
            {new Date(t.created_at).toLocaleString()}
          </span>
        </div>

        <span
          className={`px-2 py-0.5 rounded-md text-xs font-semibold border shrink-0 ${
            t.status === "Paid"
              ? "bg-success-light text-success border-success/20"
              : t.status === "Pending"
              ? "bg-warning-light text-warning border-warning/20"
              : "bg-danger-light text-danger border-danger/20"
          }`}
        >
          {t.status}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs gap-2">
        <div className="min-w-0">
          <div className="font-semibold text-fg truncate">{t.user_name}</div>
          <div className="text-xs text-fg-muted truncate">
            {t.student_id ? (
              <>
                ID: <span className="font-mono">{t.student_id}</span>
              </>
            ) : (
              "Faculty Member"
            )}{" "}
            • {t.department_name} ({t.semester_name})
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="font-bold text-sm text-fg tabular-nums">
            ৳{t.amount.toLocaleString()}
          </div>
          <div className="text-xs text-fg-muted">{t.payment_method}</div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-line">
        <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-canvas border border-line text-fg-muted">
          {formatTransactionType(t.type)}
        </span>

        <button
          type="button"
          onClick={() => onViewReceipt(t)}
          className="min-h-[36px] bg-canvas hover:bg-surface-2 text-fg border border-line rounded-xl font-semibold px-2.5 py-1 inline-flex items-center gap-1.5 text-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <Receipt className="w-3.5 h-3.5 text-brand" />
          <span>View Voucher</span>
        </button>
      </div>
    </div>
  );
});

interface FinanceTransactionsTabProps {
  filteredTransactions: PaymentTransaction[];
  departments: Department[];
  txnSearch: string;
  onTxnSearchChange: (v: string) => void;
  selectedType: string;
  onTypeChange: (v: string) => void;
  selectedGateway: string;
  onGatewayChange: (v: string) => void;
  selectedStatus: string;
  onStatusChange: (v: string) => void;
  selectedDeptFilter: string;
  onDeptFilterChange: (v: string) => void;
  selectedDateRange: string;
  onDateRangeChange: (v: string) => void;
  formatTransactionType: (type: string) => string;
  onExportCsv: () => void;
  onViewReceipt: (t: PaymentTransaction) => void;
  onCopy: (text: string, label: string) => void;
}

export function FinanceTransactionsTab({
  filteredTransactions,
  departments,
  txnSearch,
  onTxnSearchChange,
  selectedType,
  onTypeChange,
  selectedGateway,
  onGatewayChange,
  selectedStatus,
  onStatusChange,
  selectedDeptFilter,
  onDeptFilterChange,
  selectedDateRange,
  onDateRangeChange,
  formatTransactionType,
  onExportCsv,
  onViewReceipt,
  onCopy,
}: FinanceTransactionsTabProps) {
  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="p-4 space-y-3.5 rounded-2xl bg-surface border border-line">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3.5">
          <div className="relative w-full md:max-w-96">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-muted pointer-events-none" />
            <input
              type="text"
              aria-label="Search transactions by ID, name, or receipt"
              value={txnSearch}
              onChange={(e) => onTxnSearchChange(e.target.value)}
              placeholder="Search Txn ID, student/teacher name, receipt..."
              className="w-full min-h-[40px] pl-9 pr-3.5 py-2 font-medium rounded-xl bg-canvas border border-line text-fg placeholder:text-fg-muted text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus:border-brand"
            />
          </div>

          <button
            type="button"
            onClick={onExportCsv}
            className="min-h-[40px] bg-canvas hover:bg-surface-2 text-fg border border-line rounded-xl font-semibold px-3.5 py-2 flex items-center gap-1.5 text-xs self-start md:self-auto cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <Download className="w-3.5 h-3.5" />
            Export Ledger (CSV)
          </button>
        </div>

        {/* Classification Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-line">
          <span className="text-xs font-semibold mr-1 text-fg-muted">
            Classification:
          </span>
          {[
            { id: "all", label: "All Transactions" },
            { id: "student_fee", label: "Student Fees" },
            { id: "teacher_wage", label: "Teacher Wages" },
            { id: "late_fine", label: "Late Fines" },
          ].map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={() => onTypeChange(chip.id)}
              className={`px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                selectedType === chip.id
                  ? "bg-surface-2 text-fg font-semibold border border-line"
                  : "text-fg-muted hover:text-fg font-medium"
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <div className="relative">
            <label
              htmlFor="finance-filter-gateway"
              className="text-xs font-semibold block mb-1 text-fg-muted"
            >
              Gateway
            </label>
            <select
              id="finance-filter-gateway"
              value={selectedGateway}
              onChange={(e) => onGatewayChange(e.target.value)}
              className="w-full min-h-[40px] px-3 py-1.5 font-semibold cursor-pointer rounded-xl bg-canvas border border-line text-fg text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus:border-brand"
            >
              <option value="all">All Gateways</option>
              <option value="bKash">bKash</option>
              <option value="Nagad">Nagad</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Card">Credit/Debit Card</option>
            </select>
          </div>

          <div className="relative">
            <label
              htmlFor="finance-filter-status"
              className="text-xs font-semibold block mb-1 text-fg-muted"
            >
              Payment Status
            </label>
            <select
              id="finance-filter-status"
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full min-h-[40px] px-3 py-1.5 font-semibold cursor-pointer rounded-xl bg-canvas border border-line text-fg text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus:border-brand"
            >
              <option value="all">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>

          <div className="relative">
            <label
              htmlFor="finance-filter-dept"
              className="text-xs font-semibold block mb-1 text-fg-muted"
            >
              Department
            </label>
            <select
              id="finance-filter-dept"
              value={selectedDeptFilter}
              onChange={(e) => onDeptFilterChange(e.target.value)}
              className="w-full min-h-[40px] px-3 py-1.5 font-semibold cursor-pointer rounded-xl bg-canvas border border-line text-fg text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus:border-brand"
            >
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name} ({d.code})
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <label
              htmlFor="finance-filter-date"
              className="text-xs font-semibold block mb-1 text-fg-muted"
            >
              Date Range
            </label>
            <select
              id="finance-filter-date"
              value={selectedDateRange}
              onChange={(e) => onDateRangeChange(e.target.value)}
              className="w-full min-h-[40px] px-3 py-1.5 font-semibold cursor-pointer rounded-xl bg-canvas border border-line text-fg text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus:border-brand"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Data */}
      <div className="overflow-hidden rounded-2xl bg-surface border border-line">
        {/* Mobile View: Cards */}
        <div className="block md:hidden divide-y divide-line">
          {filteredTransactions.length === 0 ? (
            <div className="px-6 py-12 text-center text-xs font-medium text-fg-muted">
              No transactions found matching your criteria.
            </div>
          ) : (
            filteredTransactions.map((t) => (
              <TransactionCard
                key={t.id}
                t={t}
                formatTransactionType={formatTransactionType}
                onViewReceipt={onViewReceipt}
                onCopy={onCopy}
              />
            ))
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-canvas font-sans text-xs font-semibold text-fg-muted border-b border-line">
                <th className="px-4 py-3">Transaction ID</th>
                <th className="px-4 py-3">User Identity</th>
                <th className="px-4 py-3">Department &amp; Semester</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Gateway</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Receipt Voucher</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-xs font-medium text-fg-muted"
                  >
                    No transactions found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((t) => (
                  <TransactionRow
                    key={t.id}
                    t={t}
                    formatTransactionType={formatTransactionType}
                    onViewReceipt={onViewReceipt}
                    onCopy={onCopy}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
