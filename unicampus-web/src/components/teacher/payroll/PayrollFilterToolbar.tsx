"use client";

import React from "react";
import { Select } from "@/components/ui/Select";
import { RotateCcw, Search, X } from "lucide-react";

interface PayrollFilterToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedYear: string;
  onYearChange: (year: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  fromDate: string;
  onFromDateChange: (date: string) => void;
  toDate: string;
  onToDateChange: (date: string) => void;
  onResetFilters: () => void;
  totalResults: number;
}

export function PayrollFilterToolbar({
  searchQuery,
  onSearchChange,
  selectedYear,
  onYearChange,
  selectedStatus,
  onStatusChange,
  fromDate,
  onFromDateChange,
  toDate,
  onToDateChange,
  onResetFilters,
  totalResults,
}: PayrollFilterToolbarProps) {
  const isFiltered = Boolean(
    searchQuery ||
    selectedYear !== "all" ||
    selectedStatus !== "all" ||
    fromDate ||
    toDate
  );

  return (
    <div className="w-full rounded-2xl bg-surface border border-line p-4 sm:p-5 space-y-4">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search input with bound label */}
        <div className="flex-1 relative">
          <label htmlFor="payroll-search-input" className="sr-only">
            Search remuneration ledger by month, method, or transaction ID
          </label>
          <div className="relative">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-muted pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="payroll-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by month (e.g. October), payout method, or TXN ID..."
              className="w-full min-h-[44px] pl-10 pr-10 text-sm bg-canvas border border-line rounded-xl text-fg placeholder:text-fg-muted focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-colors duration-150"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                aria-label="Clear search input"
                className="absolute right-2 top-1/2 -translate-y-1/2 min-w-[36px] min-h-[36px] flex items-center justify-center text-fg-muted hover:text-fg rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        {/* Quick result counter & reset */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
          <span className="text-xs font-medium text-fg-muted">
            Showing <span className="font-semibold text-fg tabular-nums">{totalResults}</span> records
          </span>

          {isFiltered && (
            <button
              type="button"
              onClick={onResetFilters}
              className="min-h-[44px] inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-fg-muted hover:text-fg bg-surface-2 hover:bg-line/40 rounded-xl border border-line transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Structured date-wise & select filters bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-line/60">
        {/* Year Filter */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="payroll-year-select" className="text-xs font-medium text-fg-muted">
            Year / Term
          </label>
          <Select
            id="payroll-year-select"
            ariaLabel="Year / Term"
            value={selectedYear}
            onChange={onYearChange}
            options={[
              { value: "all", label: "All Years" },
              { value: "2026", label: "2026 (Active Fiscal Year)" },
              { value: "2025", label: "2025 (Historical)" },
            ]}
            size="md"
            variant="surface2"
          />
        </div>

        {/* Status Filter */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="payroll-status-select" className="text-xs font-medium text-fg-muted">
            Disbursement Status
          </label>
          <Select
            id="payroll-status-select"
            ariaLabel="Disbursement Status"
            value={selectedStatus}
            onChange={onStatusChange}
            options={[
              { value: "all", label: "All Statuses" },
              { value: "Disbursed", label: "Disbursed Only" },
              { value: "Pending", label: "Pending Only" },
            ]}
            size="md"
            variant="surface2"
          />
        </div>

        {/* From Date Filter */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="payroll-from-date" className="text-xs font-medium text-fg-muted">
            Date From
          </label>
          <input
            id="payroll-from-date"
            type="date"
            value={fromDate}
            onChange={(e) => onFromDateChange(e.target.value)}
            className="w-full min-h-[44px] px-3 text-sm bg-canvas border border-line rounded-xl text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand transition-colors"
          />
        </div>

        {/* To Date Filter */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="payroll-to-date" className="text-xs font-medium text-fg-muted">
            Date To
          </label>
          <input
            id="payroll-to-date"
            type="date"
            value={toDate}
            onChange={(e) => onToDateChange(e.target.value)}
            className="w-full min-h-[44px] px-3 text-sm bg-canvas border border-line rounded-xl text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
