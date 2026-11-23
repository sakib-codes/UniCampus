"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  Check,
  Building2,
  Receipt,
  DollarSign,
  Smartphone,
} from "lucide-react";
import { adminService } from "@/lib/services/adminService";
import { TabPanel } from "@/components/ui/Tabs";
import { useAdminAuth } from "@/context/AdminAuthContext";
import {
  PaymentTransaction,
  TeacherWage,
  Department,
  OrdinalSemesterName,
  PaymentMethod,
} from "@/types/admin";
import { FinanceOverviewTab } from "@/components/admin/finance/FinanceOverviewTab";
import {
  TransactionsLedgerTab,
  OfficialReceiptModal,
} from "@/components/admin/finance/TransactionsLedgerTab";
import { SemesterDuesTab } from "@/components/admin/finance/SemesterDuesTab";
import { TeacherPayrollTab } from "@/components/admin/finance/TeacherPayrollTab";
import { GatewayConfigPanel } from "@/components/admin/finance/GatewayConfigPanel";
import { SuperAdminGate } from "@/components/admin/SuperAdminGate";

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

type FinanceTabId = "overview" | "transactions" | "dues" | "payroll" | "gateways";

export default function AdminFinancePage() {
  const { currentUser, isDeptAdmin, effectiveDeptId, adminDepartmentName } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<FinanceTabId>("overview");
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [wages, setWages] = useState<TeacherWage[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Global Viewing Receipt Modal
  const [viewingReceipt, setViewingReceipt] = useState<PaymentTransaction | null>(null);

  // Semester Dues Breakdown States
  const [activeDeptTab, setActiveDeptTab] = useState<string>("dept-cse");
  const [expandedSemester, setExpandedSemester] = useState<OrdinalSemesterName | null>(
    "1st Semester"
  );
  const [reminderModalSemester, setReminderModalSemester] =
    useState<OrdinalSemesterName | null>(null);

  // Payroll States
  const [selectedMonth, setSelectedMonth] = useState<string>("October 2026");

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
        else if (tabParam === "dues" || tabParam === "departments") setActiveTab("dues");
        else if (tabParam === "gateways" || tabParam === "gateway") setActiveTab("gateways");
      }
    });

    const handleFinanceUpdated = () => {
      loadData();
    };
    window.addEventListener("unicampus:finance-updated", handleFinanceUpdated);
    window.addEventListener("storage", handleFinanceUpdated);
    return () => {
      window.removeEventListener("unicampus:finance-updated", handleFinanceUpdated);
      window.removeEventListener("storage", handleFinanceUpdated);
    };
  }, [loadData]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
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

  const targetDeptName = useMemo(() => {
    if (isDeptAdmin && currentUser?.department_id) {
      return departments.find((d) => d.id === currentUser.department_id)?.name;
    }
    if (effectiveDeptId !== "all") {
      return departments.find((d) => d.id === effectiveDeptId)?.name;
    }
    return undefined;
  }, [isDeptAdmin, currentUser, effectiveDeptId, departments]);

  const scopedTransactions = useMemo(() => {
    if (!targetDeptName) return transactions;
    return transactions.filter((t) => t.department_name === targetDeptName);
  }, [transactions, targetDeptName]);

  // Overview Calculations
  const totalInflow = useMemo(
    () =>
      scopedTransactions
        .filter((t) => (t.type === "student_fee" || t.type === "late_fine") && t.status === "Paid")
        .reduce((acc, t) => acc + t.amount, 0),
    [scopedTransactions]
  );

  const totalOutflow = useMemo(
    () =>
      scopedTransactions
        .filter((t) => t.type === "teacher_wage" && t.status === "Paid")
        .reduce((acc, t) => acc + t.amount, 0),
    [scopedTransactions]
  );

  const totalDues = useMemo(
    () =>
      scopedTransactions
        .filter((t) => t.type === "student_fee" && (t.status === "Pending" || t.status === "Overdue"))
        .reduce((acc, t) => acc + t.amount, 0),
    [scopedTransactions]
  );

  const totalPendingDues = useMemo(
    () =>
      scopedTransactions
        .filter((t) => t.type === "student_fee" && t.status === "Pending")
        .reduce((acc, t) => acc + t.amount, 0),
    [scopedTransactions]
  );

  const totalOverdueAmount = useMemo(
    () =>
      scopedTransactions
        .filter((t) => t.type === "student_fee" && t.status === "Overdue")
        .reduce((acc, t) => acc + t.amount, 0),
    [scopedTransactions]
  );

  const netBalance = useMemo(() => totalInflow - totalOutflow, [totalInflow, totalOutflow]);

  const deptProgressList = useMemo(() => {
    return departments.map((d) => {
      const deptTxns = transactions.filter(
        (t) => t.department_name === d.name && (t.type === "student_fee" || t.type === "late_fine")
      );
      const collected = deptTxns
        .filter((t) => t.status === "Paid")
        .reduce((sum, t) => sum + t.amount, 0);
      const pending = deptTxns
        .filter((t) => t.status !== "Paid")
        .reduce((sum, t) => sum + t.amount, 0);
      const target = collected + pending > 0 ? Math.round((collected + pending) * 1.25) : 120000;
      const percentage = Math.min(100, Math.round((collected / target) * 100));
      return { department: d, collected, target, pending, percentage };
    });
  }, [departments, transactions]);

  const scopedDeptProgressList = useMemo(() => {
    if (!targetDeptName) return deptProgressList;
    return deptProgressList.filter((dp) => dp.department.name === targetDeptName);
  }, [deptProgressList, targetDeptName]);

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

  // Payroll Calculations
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

  const handleDisburseBulk = useCallback(
    (month: string, gateway: PaymentMethod) => {
      const { updatedWages, count } = adminService.disburseAllPendingWages(month, gateway);
      setWages(updatedWages);
      setTransactions(adminService.getTransactions());
      showToast(`Disbursed wages for all ${count} pending faculty members for ${month}!`);
    },
    [showToast]
  );

  const handleToggleSemester = useCallback((semName: OrdinalSemesterName) => {
    setExpandedSemester((prev) => (prev === semName ? null : semName));
  }, []);

  const handleSendDueReminders = useCallback(
    (channel: string) => {
      if (!reminderModalSemester) return;
      const count = overdueStudentsInSelectedSemester.length;
      setReminderModalSemester(null);
      showToast(
        `Sent due payment reminders via ${channel.toUpperCase()} to ${count} students in ${reminderModalSemester}.`
      );
    },
    [overdueStudentsInSelectedSemester.length, reminderModalSemester, showToast]
  );

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-5 pb-12 min-w-0 max-w-full overflow-x-clip">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-8 z-50 bg-success text-on-brand px-4 py-2.5 rounded-xl flex items-center gap-2 text-xs font-semibold border border-success/30">
          <Check className="w-4 h-4" /> {toastMessage}
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-surface border border-line min-w-0">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-fg">
              Fees, Payments &amp; Treasury Operations
            </h1>
            <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-brand-soft text-brand border border-brand/35">
              Finance Hub
            </span>
          </div>
          <p className="text-xs text-fg-muted mt-1">
            Institutional ledger for student tuition collections, digital gateway reconciliation, semester dues clearance, and faculty payroll.
          </p>
        </div>
      </div>

      {/* 5 Core Tabs Segmented Dock */}
      <div className="p-1.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none rounded-2xl bg-surface border border-line relative w-full max-w-full min-w-0">
        {[
          { id: "overview" as const, label: "Financial Overview", icon: Receipt },
          {
            id: "transactions" as const,
            label: "Transactions Ledger",
            icon: CreditCard,
            count: transactions.length,
          },
          { id: "dues" as const, label: "Semester Dues & Reminders", icon: Building2 },
          { id: "payroll" as const, label: "Faculty Payroll", icon: DollarSign },
          { id: "gateways" as const, label: "Gateway & Sandbox", icon: Smartphone },
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

      <TabPanel tabKey={activeTab}>
      {/* Tab 1: Financial Overview */}
      {activeTab === "overview" && (
        <FinanceOverviewTab
          totalInflow={totalInflow}
          totalOutflow={totalOutflow}
          totalDues={totalDues}
          totalPendingDues={totalPendingDues}
          totalOverdueAmount={totalOverdueAmount}
          netBalance={netBalance}
          deptProgressList={scopedDeptProgressList}
          recentTransactions={scopedTransactions.slice(0, 5)}
          allTransactions={scopedTransactions}
          formatTransactionType={formatTransactionType}
          onSwitchTab={setActiveTab}
          onViewReceipt={setViewingReceipt}
        />
      )}

      {/* Tab 2: Transactions Ledger */}
      {activeTab === "transactions" && (
        <TransactionsLedgerTab
          transactions={scopedTransactions}
          departments={departments}
          isDeptAdmin={isDeptAdmin}
          defaultDepartment={targetDeptName}
          formatTransactionType={formatTransactionType}
          onExportCsv={(filtered) => {
            const csv = adminService.exportTransactionsCSV(filtered);
            downloadCsvFile(
              csv,
              `UniCampus_Transactions_${new Date().toISOString().slice(0, 10)}.csv`
            );
          }}
          onViewReceipt={setViewingReceipt}
          onCopy={copyToClipboard}
          onPaymentRecorded={() => {
            loadData();
            showToast("Transaction recorded in master treasury ledger.");
          }}
        />
      )}

      {/* Tab 3: Semester Dues Breakdown */}
      {activeTab === "dues" && currentDeptObj && currentDeptProgress && (
        <SemesterDuesTab
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
          reminderModalSemester={reminderModalSemester}
          onCloseReminderModal={() => setReminderModalSemester(null)}
          overdueStudentsInSelectedSemester={overdueStudentsInSelectedSemester}
          onSendDueReminders={handleSendDueReminders}
        />
      )}

      {/* Tab 4: Faculty Payroll */}
      {activeTab === "payroll" && (
        <TeacherPayrollTab
          isDeptAdmin={isDeptAdmin}
          adminDepartmentName={adminDepartmentName}
          monthCycles={MONTH_CYCLES}
          selectedMonth={selectedMonth}
          onSelectMonth={setSelectedMonth}
          currentMonthWages={currentMonthWages}
          payrollSummary={payrollSummary}
          onGoToDepartments={() => setActiveTab("dues")}
          onExportPayrollCsv={() => {
            const csv = adminService.exportWagesCSV(currentMonthWages);
            downloadCsvFile(csv, `UniCampus_Payroll_${selectedMonth.replace(/\s+/g, "_")}.csv`);
          }}
          onDisburseSingle={handleDisburseSingle}
          onDisburseBulk={handleDisburseBulk}
        />
      )}

      {/* Tab 5: Gateway Config & Sandbox Simulation */}
      {activeTab === "gateways" && (
        <SuperAdminGate featureName="Payment Gateway Configuration">
          <GatewayConfigPanel
            departments={departments}
            transactions={transactions}
            onViewReceipt={setViewingReceipt}
            onPaymentRecorded={() => {
              loadData();
            }}
            showToast={showToast}
          />
        </SuperAdminGate>
      )}
      </TabPanel>

      {/* Global Digital Receipt Voucher Modal */}
      <OfficialReceiptModal
        receipt={viewingReceipt}
        open={Boolean(viewingReceipt)}
        onClose={() => setViewingReceipt(null)}
        onCopy={copyToClipboard}
      />
    </div>
  );
}
