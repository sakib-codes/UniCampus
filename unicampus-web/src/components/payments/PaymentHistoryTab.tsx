"use client";

import React, { useState, useMemo } from "react";
import {
  CheckCircle2,
  Download,
  Receipt,
  RotateCcw,
  Search,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PaymentTransaction } from "@/types/admin";
import { adminService } from "@/lib/services/adminService";

export interface PaymentHistoryTabProps {
  transactions: PaymentTransaction[];
  onViewReceipt: (transaction: PaymentTransaction) => void;
}

export function PaymentHistoryTab({
  transactions,
  onViewReceipt,
}: PaymentHistoryTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [datePreset, setDatePreset] = useState<"all" | "30" | "90" | "year">("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedSemester, setSelectedSemester] = useState<string>("all");
  const [selectedMethod, setSelectedMethod] = useState<string>("all");

  const handlePresetChange = (preset: "all" | "30" | "90" | "year") => {
    setDatePreset(preset);
    const now = new Date();
    if (preset === "all") {
      setFromDate("");
      setToDate("");
    } else if (preset === "30") {
      const past = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      setFromDate(past.toISOString().slice(0, 10));
      setToDate(now.toISOString().slice(0, 10));
    } else if (preset === "90") {
      const past = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      setFromDate(past.toISOString().slice(0, 10));
      setToDate(now.toISOString().slice(0, 10));
    } else if (preset === "year") {
      const past = new Date(now.getFullYear(), 0, 1);
      setFromDate(past.toISOString().slice(0, 10));
      setToDate(now.toISOString().slice(0, 10));
    }
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setDatePreset("all");
    setFromDate("");
    setToDate("");
    setSelectedSemester("all");
    setSelectedMethod("all");
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          t.receipt_number.toLowerCase().includes(q) ||
          t.transaction_id.toLowerCase().includes(q) ||
          t.semester_name.toLowerCase().includes(q) ||
          t.payment_method.toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }

      // 2. Date Range
      if (fromDate) {
        const itemDate = new Date(t.created_at).getTime();
        const start = new Date(fromDate).getTime();
        if (itemDate < start) return false;
      }
      if (toDate) {
        const itemDate = new Date(t.created_at).getTime();
        // End of the day
        const end = new Date(toDate).getTime() + 24 * 60 * 60 * 1000 - 1;
        if (itemDate > end) return false;
      }

      // 3. Semester Filter
      if (selectedSemester !== "all" && t.semester_name !== selectedSemester) {
        return false;
      }

      // 4. Method Filter
      if (selectedMethod !== "all" && t.payment_method !== selectedMethod) {
        return false;
      }

      return true;
    });
  }, [transactions, searchQuery, fromDate, toDate, selectedSemester, selectedMethod]);

  const handleExportCsv = () => {
    const csv = adminService.exportTransactionsCSV(filteredTransactions);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `UniCampus_Student_Payments_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Filter Toolbar */}
      <div className="rounded-2xl bg-surface border border-line p-4 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-fg-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search receipt no, TXN ID, or semester..."
              className="w-full min-h-[44px] pl-10 pr-9 py-2 rounded-xl border border-line bg-surface text-fg text-sm placeholder:text-fg-muted focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-colors duration-150"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-fg-muted hover:text-fg cursor-pointer p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Date Presets */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-fg-muted mr-1">Presets:</span>
            {(
              [
                { id: "all", label: "All Time" },
                { id: "30", label: "Last 30 Days" },
                { id: "90", label: "Last 90 Days" },
                { id: "year", label: "This Year" },
              ] as const
            ).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handlePresetChange(p.id)}
                className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  datePreset === p.id
                    ? "bg-brand text-on-brand"
                    : "bg-surface-2 text-fg-muted hover:text-fg hover:bg-surface-2/80"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Export CSV CTA */}
          <Button
            type="button"
            variant="secondary"
            size="md"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={handleExportCsv}
            className="shrink-0"
          >
            Export CSV
          </Button>
        </div>

        {/* Detailed Secondary Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-line text-xs">
          {/* From Date */}
          <div>
            <label
              htmlFor="history-from-date"
              className="block font-medium text-fg-muted mb-1"
            >
              From Date
            </label>
            <input
              id="history-from-date"
              type="date"
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value);
                setDatePreset("all");
              }}
              className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-line bg-surface text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            />
          </div>

          {/* To Date */}
          <div>
            <label
              htmlFor="history-to-date"
              className="block font-medium text-fg-muted mb-1"
            >
              To Date
            </label>
            <input
              id="history-to-date"
              type="date"
              value={toDate}
              onChange={(e) => {
                setToDate(e.target.value);
                setDatePreset("all");
              }}
              className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-line bg-surface text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            />
          </div>

          {/* Semester Filter */}
          <div>
            <label
              htmlFor="history-semester-select"
              className="block font-medium text-fg-muted mb-1"
            >
              Semester
            </label>
            <select
              id="history-semester-select"
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-line bg-surface text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <option value="all">All Semesters</option>
              <option value="1st Semester">1st Semester</option>
              <option value="2nd Semester">2nd Semester</option>
              <option value="3rd Semester">3rd Semester</option>
              <option value="4th Semester">4th Semester</option>
              <option value="5th Semester">5th Semester</option>
              <option value="6th Semester">6th Semester</option>
            </select>
          </div>

          {/* Payment Method Filter */}
          <div>
            <label
              htmlFor="history-method-select"
              className="block font-medium text-fg-muted mb-1"
            >
              Payment Method
            </label>
            <select
              id="history-method-select"
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-line bg-surface text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <option value="all">All Gateways</option>
              <option value="bKash">bKash</option>
              <option value="SSLCommerz">SSLCommerz</option>
              <option value="Nagad">Nagad</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Card">Card</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transaction Ledger Table */}
      <div className="rounded-2xl bg-surface border border-line overflow-hidden">
        {filteredTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-surface-2 border-b border-line text-xs font-semibold text-fg-muted uppercase tracking-wider">
                  <th scope="col" className="px-4 py-3">Receipt No</th>
                  <th scope="col" className="px-4 py-3">Transaction ID</th>
                  <th scope="col" className="px-4 py-3">Semester</th>
                  <th scope="col" className="px-4 py-3">Date</th>
                  <th scope="col" className="px-4 py-3">Method</th>
                  <th scope="col" className="px-4 py-3 text-right">Amount (BDT)</th>
                  <th scope="col" className="px-4 py-3">Status</th>
                  <th scope="col" className="px-4 py-3 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredTransactions.map((t) => {
                  const isBkash = t.payment_method === "bKash";
                  return (
                    <tr
                      key={t.id}
                      className="hover:bg-surface-2/40 transition-colors"
                    >
                      {/* Receipt No */}
                      <td className="px-4 py-3.5 font-mono text-xs font-semibold text-fg">
                        {t.receipt_number}
                      </td>

                      {/* Transaction ID */}
                      <td className="px-4 py-3.5 font-mono text-xs text-fg-muted">
                        {t.transaction_id}
                      </td>

                      {/* Semester */}
                      <td className="px-4 py-3.5 text-xs font-medium text-fg whitespace-nowrap">
                        {t.semester_name}
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3.5 text-xs text-fg-muted tabular-nums whitespace-nowrap">
                        {new Date(t.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>

                      {/* Method */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                            isBkash
                              ? "bg-[#E2136E]/10 text-[#E2136E] border-[#E2136E]/20"
                              : "bg-brand-soft text-brand border-brand/20"
                          }`}
                        >
                          {t.payment_method}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="px-4 py-3.5 text-right font-semibold text-fg tabular-nums whitespace-nowrap">
                        ৳{t.amount.toLocaleString()}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>{t.status}</span>
                        </span>
                      </td>

                      {/* Receipt Action */}
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          leftIcon={<Receipt className="w-3.5 h-3.5 text-brand" />}
                          onClick={() => onViewReceipt(t)}
                          className="h-8 px-2.5 text-xs"
                        >
                          View / Print
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={<Receipt className="w-6 h-6" />}
            title="No payment records found"
            description="No transactions match your current search queries or date filters."
            action={
              <Button
                type="button"
                variant="secondary"
                size="sm"
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                onClick={handleResetFilters}
              >
                Reset filters
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
}
