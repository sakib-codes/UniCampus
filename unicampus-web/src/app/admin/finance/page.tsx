"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { CreditCard, Check, Building2, Receipt, DollarSign } from "lucide-react";
import { adminService } from "@/lib/services/adminService";
import { useAdminAuth } from "@/context/AdminAuthContext";
import {
  PaymentTransaction,
  TeacherWage,
  Department,
  OrdinalSemesterName,
  PaymentMethod,
} from "@/types/admin";
import { FinanceOverviewTab } from "@/components/admin/finance/FinanceOverviewTab";
import { FinanceTransactionsTab } from "@/components/admin/finance/FinanceTransactionsTab";
import { FinanceDepartmentsTab } from "@/components/admin/finance/FinanceDepartmentsTab";
import { FinancePayrollTab } from "@/components/admin/finance/FinancePayrollTab";
import { FinanceModals } from "@/components/admin/finance/FinanceModals";

const MONTH_CYCLES = ["August 2026", "September 2026", "October 2026", "November 2026"];

const formatTransactionType = (type: string) => {
  switch (type) {
    case "student_fee":
      return "Student Fee";
    case "teacher_wage":
      return "Teacher Wage";
    case "late_fine":
      return "Late Fine";
    default:
      return type
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
  }
};

export default function AdminFinancePage() {
  const { currentUser, isDeptAdmin, effectiveDeptId, adminDepartmentName } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<
    "overview" | "transactions" | "departments" | "payroll"
  >("overview");
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [wages, setWages] = useState<TeacherWage[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Tab 2: Transactions Filter States
  const [txnSearch, setTxnSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedGateway, setSelectedGateway] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>("all");
  const [selectedDateRange, setSelectedDateRange] = useState<string>("all");
  const [viewingReceipt, setViewingReceipt] = useState<PaymentTransaction | null>(null);

  // Tab 3: Department Breakdown States
  const [activeDeptTab, setActiveDeptTab] = useState<string>("dept-cse");
  const [expandedSemester, setExpandedSemester] = useState<OrdinalSemesterName | null>(
    "1st Semester"
  );
  const [reminderModalSemester, setReminderModalSemester] =
    useState<OrdinalSemesterName | null>(null);

  // Tab 4: Payroll States
  const [selectedMonth, setSelectedMonth] = useState<string>("October 2026");
  const [viewingSalarySlip, setViewingSalarySlip] = useState<TeacherWage | null>(null);
  const [isBulkDisburseOpen, setIsBulkDisburseOpen] = useState(false);
  const [bulkGateway, setBulkGateway] = useState<PaymentMethod>("Bank Transfer");

  const loadData = useCallback(() => {
    setTransactions(adminService.getTransactions());
    setWages(adminService.getTeacherWages());
    setDepartments(adminService.getDepartments());

    if (isDeptAdmin && currentUser?.department_id) {
      setActiveDeptTab(currentUser.department_id);
    } else if (effectiveDeptId !== "all") {
      setActiveDeptTab(effectiveDeptId);
    }
  }, [currentUser, effectiveDeptId, isDeptAdmin]);

  useEffect(() => {
    queueMicrotask(() => {
      loadData();
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const tabParam = params.get("tab");
        if (tabParam === "payroll") setActiveTab("payroll");
        else if (tabParam === "transactions") setActiveTab("transactions");
        else if (tabParam === "departments") setActiveTab("departments");
      }
    });
  }, [loadData]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  const copyToClipboard = useCallback(
    (text: string, label: string = "Copied to clipboard") => {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        navigator.clipboard.writeText(text);
        showToast(`${label}: ${text}`);
      }
    },
    [showToast]
  );

  const downloadCsvFile = useCallback(
    (csvContent: string, fileName: string) => {
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(`Exported ${fileName}`);
    },
    [showToast]
  );

  // Overview Calculations
  const totalInflow = useMemo(
    () =>
      transactions
        .filter((t) => (t.type === "student_fee" || t.type === "late_fine") && t.status === "Paid")
        .reduce((acc, t) => acc + t.amount, 0),
    [transactions]
  );

  const totalOutflow = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "teacher_wage" && t.status === "Paid")
        .reduce((acc, t) => acc + t.amount, 0),
    [transactions]
  );

  const totalDues = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "student_fee" && (t.status === "Pending" || t.status === "Overdue"))
        .reduce((acc, t) => acc + t.amount, 0),
    [transactions]
  );

  const deptProgressList = useMemo(() => {
    return departments.map((d) => {
      const deptTxns = transactions.filter(
        (t) => t.department_name === d.name && t.type === "student_fee"
      );
      const collected = deptTxns
        .filter((t) => t.status === "Paid")
        .reduce((sum, t) => sum + t.amount, 0);
      const pending = deptTxns
        .filter((t) => t.status !== "Paid")
        .reduce((sum, t) => sum + t.amount, 0);
      const target = collected + pending > 0 ? (collected + pending) * 1.25 : 120000;
      const percentage = Math.min(100, Math.round((collected / target) * 100));
      return { department: d, collected, target, pending, percentage };
    });
  }, [departments, transactions]);

  // Transactions Filtering
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (selectedType !== "all" && t.type !== selectedType) return false;
      if (selectedGateway !== "all" && t.payment_method !== selectedGateway) return false;
      if (selectedStatus !== "all" && t.status !== selectedStatus) return false;
      if (selectedDeptFilter !== "all" && t.department_name !== selectedDeptFilter) return false;

      if (selectedDateRange !== "all") {
        const txnDate = new Date(t.created_at);
        const now = new Date();
        if (selectedDateRange === "today" && txnDate.toDateString() !== now.toDateString()) {
          return false;
        } else if (
          selectedDateRange === "7days" &&
          txnDate < new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        ) {
          return false;
        } else if (
          selectedDateRange === "month" &&
          (txnDate.getMonth() !== now.getMonth() || txnDate.getFullYear() !== now.getFullYear())
        ) {
          return false;
        } else if (selectedDateRange === "year" && txnDate.getFullYear() !== now.getFullYear()) {
          return false;
        }
      }

      if (txnSearch.trim()) {
        const q = txnSearch.toLowerCase();
        return (
          t.transaction_id.toLowerCase().includes(q) ||
          t.receipt_number.toLowerCase().includes(q) ||
          t.user_name.toLowerCase().includes(q) ||
          Boolean(t.student_id?.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [
    transactions,
    selectedType,
    selectedGateway,
    selectedStatus,
    selectedDeptFilter,
    selectedDateRange,
    txnSearch,
  ]);

  const currentDeptObj = useMemo(
    () => departments.find((d) => d.id === activeDeptTab) || departments[0],
    [departments, activeDeptTab]
  );

  const currentDeptProgress = useMemo(
    () => deptProgressList.find((dp) => dp.department.id === activeDeptTab) || deptProgressList[0],
    [deptProgressList, activeDeptTab]
  );

  const departmentTransactions = useMemo(() => {
    if (!currentDeptObj) return [];
    return transactions.filter((t) => t.department_name === currentDeptObj.name);
  }, [transactions, currentDeptObj]);

  const overdueStudentsInSelectedSemester = useMemo(() => {
    if (!reminderModalSemester || !currentDeptObj) return [];
    return transactions.filter(
      (t) =>
        t.department_name === currentDeptObj.name &&
        t.semester_name === reminderModalSemester &&
        (t.status === "Pending" || t.status === "Overdue")
    );
  }, [transactions, currentDeptObj, reminderModalSemester]);

  const currentMonthWages = useMemo(
    () => wages.filter((w) => w.month.toLowerCase() === selectedMonth.toLowerCase()),
    [wages, selectedMonth]
  );

  const payrollSummary = useMemo(() => {
    const totalBudget = currentMonthWages.reduce((sum, w) => sum + w.net_amount, 0);
    const disbursed = currentMonthWages
      .filter((w) => w.status === "Disbursed")
      .reduce((sum, w) => sum + w.net_amount, 0);
    const pending = currentMonthWages
      .filter((w) => w.status === "Pending")
      .reduce((sum, w) => sum + w.net_amount, 0);
    const pendingCount = currentMonthWages.filter((w) => w.status === "Pending").length;
    return { totalBudget, disbursed, pending, pendingCount };
  }, [currentMonthWages]);

  const handleDisburseSingle = useCallback(
    (wageId: string, teacherName: string) => {
      const { updatedWages } = adminService.disburseWage(wageId, "Bank Transfer");
      setWages(updatedWages);
      setTransactions(adminService.getTransactions());
      showToast(`Salary disbursed for ${teacherName}. Transaction generated.`);
    },
    [showToast]
  );

  const handleConfirmBulkDisburse = () => {
    const { updatedWages, count } = adminService.disburseAllPendingWages(
      selectedMonth,
      bulkGateway
    );
    setWages(updatedWages);
    setTransactions(adminService.getTransactions());
    setIsBulkDisburseOpen(false);
    showToast(`Disbursed wages for all ${count} pending faculty members for ${selectedMonth}!`);
  };

  const handleToggleSemester = useCallback((semName: OrdinalSemesterName) => {
    setExpandedSemester((prev) => (prev === semName ? null : semName));
  }, []);

  return (
    <div className="w-full space-y-5 pb-12">
      {toastMessage && (
        <div className="fixed top-6 right-8 z-50 bg-success text-on-brand px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold border border-success/30">
          <Check className="w-4 h-4" /> {toastMessage}
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-surface border border-line">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-fg">
              Fees, Payments &amp; Faculty Payroll
            </h1>
            <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-brand-soft text-brand border border-brand/35">
              Finance Hub
            </span>
          </div>
          <p className="text-xs text-fg-muted mt-1">
            Manage student fee collections, digital transaction vouchers, and faculty payroll disbursements.
          </p>
        </div>
      </div>

      {/* 4 Core Tabs Segmented Dock */}
      <div className="p-1.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none rounded-2xl bg-surface border border-line relative">
        {[
          { id: "overview" as const, label: "Financial Overview", icon: Receipt },
          { id: "transactions" as const, label: "All Transactions", icon: CreditCard, count: transactions.length },
          { id: "departments" as const, label: "Department Breakdown", icon: Building2 },
          { id: "payroll" as const, label: "Faculty Payroll", icon: DollarSign },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`relative min-h-[38px] px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 shrink-0 cursor-pointer z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                isActive ? "text-fg" : "text-fg-muted hover:text-fg"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="admin-finance-tab-pill"
                  className="absolute inset-0 bg-surface-2 border border-line rounded-xl -z-10"
                  transition={{ type: "spring", stiffness: 450, damping: 32 }}
                />
              )}
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {typeof tab.count === "number" && (
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-md tabular-nums transition-colors ${
                    isActive
                      ? "bg-brand-soft text-brand font-semibold"
                      : "bg-surface-2 text-fg-muted"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {activeTab === "overview" && (
        <FinanceOverviewTab
          totalInflow={totalInflow}
          totalOutflow={totalOutflow}
          totalTuitionFees={totalInflow}
          totalWagesDisbursed={totalOutflow}
          totalDues={totalDues}
          deptProgressList={deptProgressList}
          recentTransactions={transactions.slice(0, 5)}
          formatTransactionType={formatTransactionType}
          onSwitchTab={setActiveTab}
          onViewReceipt={setViewingReceipt}
        />
      )}

      {activeTab === "transactions" && (
        <FinanceTransactionsTab
          filteredTransactions={filteredTransactions}
          departments={departments}
          txnSearch={txnSearch}
          onTxnSearchChange={setTxnSearch}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          selectedGateway={selectedGateway}
          onGatewayChange={setSelectedGateway}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          selectedDeptFilter={selectedDeptFilter}
          onDeptFilterChange={setSelectedDeptFilter}
          selectedDateRange={selectedDateRange}
          onDateRangeChange={setSelectedDateRange}
          formatTransactionType={formatTransactionType}
          onExportCsv={() => {
            const csv = adminService.exportTransactionsCSV(filteredTransactions);
            downloadCsvFile(
              csv,
              `UniCampus_Transactions_${new Date().toISOString().slice(0, 10)}.csv`
            );
          }}
          onViewReceipt={setViewingReceipt}
          onCopy={copyToClipboard}
        />
      )}

      {activeTab === "departments" && currentDeptObj && currentDeptProgress && (
        <FinanceDepartmentsTab
          departments={departments}
          activeDeptTab={activeDeptTab}
          onSelectDeptTab={setActiveDeptTab}
          currentDeptObj={currentDeptObj}
          currentDeptProgress={currentDeptProgress}
          departmentTransactions={departmentTransactions}
          expandedSemester={expandedSemester}
          onToggleSemester={handleToggleSemester}
          onOpenReminder={setReminderModalSemester}
          onExportDeptCsv={() => {
            const csv = adminService.exportTransactionsCSV(departmentTransactions);
            downloadCsvFile(
              csv,
              `UniCampus_${currentDeptObj.code}_Summary_${new Date().toISOString().slice(0, 10)}.csv`
            );
          }}
          onViewReceipt={setViewingReceipt}
        />
      )}

      {activeTab === "payroll" && (
        <FinancePayrollTab
          isDeptAdmin={isDeptAdmin}
          adminDepartmentName={adminDepartmentName}
          monthCycles={MONTH_CYCLES}
          selectedMonth={selectedMonth}
          onSelectMonth={setSelectedMonth}
          currentMonthWages={currentMonthWages}
          payrollSummary={payrollSummary}
          onGoToDepartments={() => setActiveTab("departments")}
          onExportPayrollCsv={() => {
            const csv = adminService.exportWagesCSV(currentMonthWages);
            downloadCsvFile(csv, `UniCampus_Payroll_${selectedMonth.replace(/\s+/g, "_")}.csv`);
          }}
          onOpenBulkDisburse={() => setIsBulkDisburseOpen(true)}
          onViewSlip={setViewingSalarySlip}
          onDisburseSingle={handleDisburseSingle}
        />
      )}

      <FinanceModals
        viewingReceipt={viewingReceipt}
        onCloseReceipt={() => setViewingReceipt(null)}
        onCopy={copyToClipboard}
        viewingSalarySlip={viewingSalarySlip}
        onCloseSalarySlip={() => setViewingSalarySlip(null)}
        isBulkDisburseOpen={isBulkDisburseOpen}
        onCloseBulkDisburse={() => setIsBulkDisburseOpen(false)}
        selectedMonth={selectedMonth}
        payrollPending={payrollSummary.pending}
        payrollPendingCount={payrollSummary.pendingCount}
        bulkGateway={bulkGateway}
        onBulkGatewayChange={setBulkGateway}
        onConfirmBulkDisburse={handleConfirmBulkDisburse}
        reminderModalSemester={reminderModalSemester}
        onCloseReminderModal={() => setReminderModalSemester(null)}
        currentDeptObj={currentDeptObj}
        overdueStudentsInSelectedSemester={overdueStudentsInSelectedSemester}
        onSendDueReminders={() => {
          if (!reminderModalSemester) return;
          const count = overdueStudentsInSelectedSemester.length;
          setReminderModalSemester(null);
          showToast(
            `Sent payment due reminders to ${count} students in ${reminderModalSemester}.`
          );
        }}
      />
    </div>
  );
}
