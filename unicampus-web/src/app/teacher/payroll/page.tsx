"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Download } from "lucide-react";
import { TeacherRoleGate } from "@/components/teacher/TeacherRoleGate";
import { Tabs, TabPanel } from "@/components/ui/Tabs";
import { Toast } from "@/components/ui/Toast";
import { CANONICAL_FACULTY } from "@/lib/canonicalCampus";
import { adminService } from "@/lib/services/adminService";
import type { TeacherWage } from "@/types/admin";
import {
  PayrollKpiStrip,
  PayrollFilterToolbar,
  PayrollLedgerTable,
  SalarySlipModal,
  PayoutPreferencesForm,
  type PayoutPreferences,
} from "@/components/teacher/payroll";

export default function TeacherPayrollPage() {
  return (
    <TeacherRoleGate>
      <TeacherPayrollContent />
    </TeacherRoleGate>
  );
}

function TeacherPayrollContent() {
  const [wages, setWages] = useState<TeacherWage[]>([]);
  const [activeTab, setActiveTab] = useState<"ledger" | "payout">("ledger");
  const [selectedWageForSlip, setSelectedWageForSlip] = useState<TeacherWage | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Payout preference state for KPI strip
  const [payoutInfo, setPayoutInfo] = useState<{ channel: string; details: string }>({
    channel: "Bank Transfer",
    details: "DBBL •••• 4821",
  });

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  // Synchronize wages dataset for Dr. Asif Rahman
  const reloadWages = useCallback(() => {
    const allWages = adminService.getTeacherWages();
    // Filter strictly for canonical faculty member Dr. Asif Rahman (FAC-1042 / user-teach-1)
    const facultyWages = allWages.filter(
      (w) =>
        w.teacher_id === CANONICAL_FACULTY.id ||
        w.teacher_code === CANONICAL_FACULTY.facultyCode ||
        w.teacher_name.toLowerCase().includes("asif rahman")
    );
    setWages(facultyWages);
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      reloadWages();
    });

    // Live sync with Admin finance disbursements and cross-tab/local-storage updates
    const handleSync = () => {
      reloadWages();
    };

    window.addEventListener("unicampus:finance-updated", handleSync);
    window.addEventListener("storage", handleSync);

    return () => {
      window.removeEventListener("unicampus:finance-updated", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, [reloadWages]);

  // Current month wage (e.g. November 2026 or most recent)
  const currentMonthWage = useMemo(() => {
    if (wages.length === 0) return undefined;
    const nov2026 = wages.find((w) => w.month.toLowerCase() === "november 2026");
    if (nov2026) return nov2026;
    return wages[0];
  }, [wages]);

  // YTD total disbursed (sum of disbursed salaries in 2026)
  const ytdDisbursedTotal = useMemo(() => {
    return wages
      .filter((w) => w.month.includes("2026") && w.status === "Disbursed")
      .reduce((acc, curr) => acc + curr.net_amount, 0);
  }, [wages]);

  // Filtered wages list based on toolbar criteria
  const filteredWages = useMemo(() => {
    return wages.filter((w) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesMonth = w.month.toLowerCase().includes(q);
        const matchesMethod = (w.payment_method || "").toLowerCase().includes(q);
        const matchesTxn = (w.transaction_id || "").toLowerCase().includes(q);
        const matchesStatus = w.status.toLowerCase().includes(q);
        if (!matchesMonth && !matchesMethod && !matchesTxn && !matchesStatus) {
          return false;
        }
      }

      // 2. Year Filter
      if (selectedYear !== "all") {
        if (!w.month.includes(selectedYear)) {
          return false;
        }
      }

      // 3. Status Filter
      if (selectedStatus !== "all") {
        if (w.status !== selectedStatus) {
          return false;
        }
      }

      // 4. Date-Wise Filter (From/To)
      if (fromDate || toDate) {
        // Use disbursed_at if present; otherwise deduce approximate date from month string
        let recordDate: Date | null = null;
        if (w.disbursed_at) {
          recordDate = new Date(w.disbursed_at);
        } else {
          // Parse month like "November 2026"
          const parsed = Date.parse(`1 ${w.month}`);
          if (!isNaN(parsed)) {
            recordDate = new Date(parsed);
          }
        }

        if (recordDate) {
          const recTime = recordDate.getTime();
          if (fromDate) {
            const fromTime = new Date(fromDate).getTime();
            if (recTime < fromTime) return false;
          }
          if (toDate) {
            // End of selected day
            const toTime = new Date(`${toDate}T23:59:59.999Z`).getTime();
            if (recTime > toTime) return false;
          }
        }
      }

      return true;
    });
  }, [wages, searchQuery, selectedYear, selectedStatus, fromDate, toDate]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedYear("all");
    setSelectedStatus("all");
    setFromDate("");
    setToDate("");
    showToast("Filters reset to default.");
  };

  const handleExportAnnualStatement = () => {
    const headers = [
      "Month",
      "Faculty Code",
      "Faculty Name",
      "Department",
      "Base Salary (BDT)",
      "Allowances (BDT)",
      "Deductions (BDT)",
      "Net Remuneration (BDT)",
      "Disbursement Channel",
      "Disbursed Date",
      "Status",
      "Transaction ID",
    ];

    const escapeCsv = (str: string | number | null | undefined) => {
      if (str === null || str === undefined) return '""';
      const s = String(str).replace(/"/g, '""');
      return `"${s}"`;
    };

    const rows = wages.map((w) => [
      escapeCsv(w.month),
      escapeCsv(w.teacher_code || CANONICAL_FACULTY.facultyCode),
      escapeCsv(w.teacher_name || CANONICAL_FACULTY.name),
      escapeCsv(w.department_name || CANONICAL_FACULTY.departmentName),
      escapeCsv(w.base_amount),
      escapeCsv(w.allowances),
      escapeCsv(w.deductions),
      escapeCsv(w.net_amount),
      escapeCsv(w.payment_method || "Bank Transfer"),
      escapeCsv(w.disbursed_at ? new Date(w.disbursed_at).toLocaleDateString() : "Pending"),
      escapeCsv(w.status),
      escapeCsv(w.transaction_id || "PENDING"),
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Faculty_Payroll_Statement_FAC-1042_2026.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast("Exported Faculty_Payroll_Statement_FAC-1042_2026.csv successfully.");
  };

  const handlePreferencesSaved = useCallback((prefs: PayoutPreferences) => {
    if (prefs.channel === "bank") {
      setPayoutInfo({
        channel: "Bank Transfer",
        details: `${prefs.bankName} (${prefs.accountNumber})`,
      });
    } else if (prefs.channel === "bkash") {
      setPayoutInfo({
        channel: "bKash Payroll",
        details: prefs.bkashNumber,
      });
    } else {
      setPayoutInfo({
        channel: "SSLCommerz Direct",
        details: prefs.sslPayoutId,
      });
    }
  }, []);

  const tabOptions = [
    {
      id: "ledger" as const,
      label: "Salary Ledger & Payslips",
      count: wages.length,
    },
    {
      id: "payout" as const,
      label: "Payout Account & Preferences",
    },
  ];

  return (
    <div className="w-full space-y-6 pb-16">
      {/* Page Header */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] leading-[1.25] font-semibold tracking-tight text-fg">
            Payroll & Salary Disbursements
          </h1>
          <p className="mt-1.5 text-sm text-fg-muted max-w-3xl">
            {CANONICAL_FACULTY.name} •{" "}
            <span className="font-mono">{CANONICAL_FACULTY.facultyCode}</span> •{" "}
            {CANONICAL_FACULTY.designation}, {CANONICAL_FACULTY.departmentCode} • Monthly remuneration &
            official payslips
          </p>
        </div>

        {/* CTA: Export Annual Statement (CSV) */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={handleExportAnnualStatement}
            className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 bg-brand text-on-brand hover:opacity-90 rounded-xl text-sm font-semibold transition-opacity cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand shadow-sm"
          >
            <Download className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Export Annual Statement (CSV)</span>
          </button>
        </div>
      </header>

      {/* Top KPI Summary Strip */}
      <PayrollKpiStrip
        currentMonthWage={currentMonthWage}
        ytdDisbursedTotal={ytdDisbursedTotal}
        primaryPayoutMethod={payoutInfo}
        onManagePayout={() => setActiveTab("payout")}
      />

      {/* Navigation Tabs */}
      <div className="pt-2">
        <Tabs
          tabs={tabOptions}
          value={activeTab}
          onChange={(tabId) => setActiveTab(tabId)}
          variant="segmented"
          size="md"
        />
      </div>

      <TabPanel tabKey={activeTab}>
        {/* Tab 1: Salary Ledger & Payslips */}
        {activeTab === "ledger" && (
          <div className="space-y-4">
            <PayrollFilterToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              fromDate={fromDate}
              onFromDateChange={setFromDate}
              toDate={toDate}
              onToDateChange={setToDate}
              onResetFilters={handleResetFilters}
              totalResults={filteredWages.length}
            />

            <PayrollLedgerTable
              wages={filteredWages}
              onViewPayslip={(wage) => setSelectedWageForSlip(wage)}
              onClearFilters={handleResetFilters}
            />
          </div>
        )}

        {/* Tab 2: Payout Account & Preferences */}
        {activeTab === "payout" && (
          <PayoutPreferencesForm
            onSaved={handlePreferencesSaved}
            onShowToast={showToast}
          />
        )}
      </TabPanel>

      {/* Salary Slip Modal */}
      <SalarySlipModal
        wage={selectedWageForSlip}
        open={Boolean(selectedWageForSlip)}
        onClose={() => setSelectedWageForSlip(null)}
        onShowToast={showToast}
      />

      {/* Global Toast */}
      <Toast
        open={Boolean(toastMessage)}
        onClose={() => setToastMessage(null)}
        message={toastMessage}
        tone="success"
        durationMs={3500}
      />
    </div>
  );
}
