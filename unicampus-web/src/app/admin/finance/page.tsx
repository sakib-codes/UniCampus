"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Filter, 
  Download, 
  Copy, 
  Check, 
  Clock, 
  AlertCircle, 
  Send, 
  Printer, 
  Calendar, 
  Building2, 
  ChevronDown, 
  ChevronUp, 
  Receipt, 
  ShieldCheck, 
  X, 
  DollarSign, 
  Percent, 
  FileSpreadsheet,
  CheckCircle2,
  Crown,
  Lock
} from "lucide-react";
import { adminService } from "@/lib/services/adminService";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { 
  PaymentTransaction, 
  TeacherWage, 
  Department, 
  OrdinalSemesterName,
  TransactionType,
  PaymentMethod,
  PaymentStatus 
} from "@/types/admin";
import { ORDINAL_SEMESTERS } from "@/lib/mockData";
import CountUp from "@/components/bits/CountUp";

const formatTransactionType = (type: string) => {
  switch (type) {
    case 'student_fee': return 'Student Fee';
    case 'teacher_wage': return 'Teacher Wage';
    case 'late_fine': return 'Late Fine';
    default:
      return type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }
};

export default function AdminFinancePage() {
  const { currentUser, isSuperAdmin, isDeptAdmin, effectiveDeptId, adminDepartmentName } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'departments' | 'payroll'>('overview');
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [wages, setWages] = useState<TeacherWage[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Tab 2: Transactions Filter States
  const [txnSearch, setTxnSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedGateway, setSelectedGateway] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>("all");
  const [selectedDateRange, setSelectedDateRange] = useState<string>("all");

  // Modals for Tab 2
  const [viewingReceipt, setViewingReceipt] = useState<PaymentTransaction | null>(null);

  // Tab 3: Department Breakdown States
  const [activeDeptTab, setActiveDeptTab] = useState<string>("dept-cse");
  const [expandedSemester, setExpandedSemester] = useState<OrdinalSemesterName | null>("1st Semester");
  const [reminderModalSemester, setReminderModalSemester] = useState<OrdinalSemesterName | null>(null);

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
    } else if (effectiveDeptId !== 'all') {
      setActiveDeptTab(effectiveDeptId);
    }
  }, [currentUser, effectiveDeptId, isDeptAdmin]);

  useEffect(() => {
    loadData();
    // Check URL parameters for tab navigation
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam === "payroll") setActiveTab("payroll");
      else if (tabParam === "transactions") setActiveTab("transactions");
      else if (tabParam === "departments") setActiveTab("departments");
    }
  }, [loadData]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Copy to clipboard helper
  const copyToClipboard = (text: string, label: string = "Copied to clipboard") => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast(`${label}: ${text}`);
    }
  };

  // CSV Export Helper
  const downloadCsvFile = (csvContent: string, fileName: string) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${fileName}`);
  };

  // ==================== TAB 1: OVERVIEW CALCULATIONS ====================
  const totalInflow = useMemo(() => {
    return transactions
      .filter(t => (t.type === 'student_fee' || t.type === 'late_fine') && t.status === 'Paid')
      .reduce((acc, t) => acc + t.amount, 0);
  }, [transactions]);

  const totalOutflow = useMemo(() => {
    return transactions
      .filter(t => t.type === 'teacher_wage' && t.status === 'Paid')
      .reduce((acc, t) => acc + t.amount, 0);
  }, [transactions]);

  const totalTuitionFees = totalInflow;

  const totalWagesDisbursed = totalOutflow;

  const totalDues = useMemo(() => {
    return transactions
      .filter(t => t.type === 'student_fee' && (t.status === 'Pending' || t.status === 'Overdue'))
      .reduce((acc, t) => acc + t.amount, 0);
  }, [transactions]);

  // Department Collection Progress Targets (realistic data)
  const deptProgressList = useMemo(() => {
    return departments.map(d => {
      const deptTxns = transactions.filter(t => t.department_name === d.name && t.type === 'student_fee');
      const collected = deptTxns.filter(t => t.status === 'Paid').reduce((sum, t) => sum + t.amount, 0);
      const pending = deptTxns.filter(t => t.status !== 'Paid').reduce((sum, t) => sum + t.amount, 0);
      // Realistic target calculated or projected
      const target = collected + pending > 0 ? (collected + pending) * 1.25 : 120000;
      const percentage = Math.min(100, Math.round((collected / target) * 100));

      return {
        department: d,
        collected,
        target,
        pending,
        percentage,
      };
    });
  }, [departments, transactions]);

  // ==================== TAB 2: TRANSACTIONS FILTERING ====================
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      // Classification
      if (selectedType !== 'all' && t.type !== selectedType) return false;
      // Gateway
      if (selectedGateway !== 'all' && t.payment_method !== selectedGateway) return false;
      // Status
      if (selectedStatus !== 'all' && t.status !== selectedStatus) return false;
      // Department
      if (selectedDeptFilter !== 'all' && t.department_name !== selectedDeptFilter) return false;

      // Date Range
      if (selectedDateRange !== 'all') {
        const txnDate = new Date(t.created_at);
        const now = new Date();
        if (selectedDateRange === 'today') {
          if (txnDate.toDateString() !== now.toDateString()) return false;
        } else if (selectedDateRange === '7days') {
          const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (txnDate < sevenDaysAgo) return false;
        } else if (selectedDateRange === 'month') {
          if (txnDate.getMonth() !== now.getMonth() || txnDate.getFullYear() !== now.getFullYear()) return false;
        } else if (selectedDateRange === 'year') {
          if (txnDate.getFullYear() !== now.getFullYear()) return false;
        }
      }

      // Search Query
      if (txnSearch.trim()) {
        const q = txnSearch.toLowerCase();
        const matchesId = t.transaction_id.toLowerCase().includes(q);
        const matchesReceipt = t.receipt_number.toLowerCase().includes(q);
        const matchesUser = t.user_name.toLowerCase().includes(q);
        const matchesStudentId = t.student_id?.toLowerCase().includes(q);
        return matchesId || matchesReceipt || matchesUser || matchesStudentId;
      }

      return true;
    });
  }, [transactions, selectedType, selectedGateway, selectedStatus, selectedDeptFilter, selectedDateRange, txnSearch]);

  const handleExportTransactionsCSV = () => {
    const csv = adminService.exportTransactionsCSV(filteredTransactions);
    downloadCsvFile(csv, `UniCampus_Transactions_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  // ==================== TAB 3: DEPARTMENT BREAKDOWN ====================
  const currentDeptObj = useMemo(() => {
    return departments.find(d => d.id === activeDeptTab) || departments[0];
  }, [departments, activeDeptTab]);

  const currentDeptProgress = useMemo(() => {
    return deptProgressList.find(dp => dp.department.id === activeDeptTab) || deptProgressList[0];
  }, [deptProgressList, activeDeptTab]);

  const departmentTransactions = useMemo(() => {
    if (!currentDeptObj) return [];
    return transactions.filter(t => t.department_name === currentDeptObj.name);
  }, [transactions, currentDeptObj]);

  const overdueStudentsInSelectedSemester = useMemo(() => {
    if (!reminderModalSemester || !currentDeptObj) return [];
    return transactions.filter(
      t => t.department_name === currentDeptObj.name &&
           t.semester_name === reminderModalSemester &&
           (t.status === 'Pending' || t.status === 'Overdue')
    );
  }, [transactions, currentDeptObj, reminderModalSemester]);

  const handleSendDueReminders = () => {
    if (!reminderModalSemester) return;
    const count = overdueStudentsInSelectedSemester.length;
    setReminderModalSemester(null);
    showToast(`Sent payment due reminders to ${count} students in ${reminderModalSemester}.`);
  };

  const handleExportDepartmentCSV = () => {
    if (!currentDeptObj) return;
    const csv = adminService.exportTransactionsCSV(departmentTransactions);
    downloadCsvFile(csv, `UniCampus_${currentDeptObj.code}_Summary_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  // ==================== TAB 4: TEACHER WAGES (PAYROLL) ====================
  const MONTH_CYCLES = ["August 2026", "September 2026", "October 2026", "November 2026"];

  const currentMonthWages = useMemo(() => {
    return wages.filter(w => w.month.toLowerCase() === selectedMonth.toLowerCase());
  }, [wages, selectedMonth]);

  const payrollSummary = useMemo(() => {
    const totalBudget = currentMonthWages.reduce((sum, w) => sum + w.net_amount, 0);
    const disbursed = currentMonthWages.filter(w => w.status === 'Disbursed').reduce((sum, w) => sum + w.net_amount, 0);
    const pending = currentMonthWages.filter(w => w.status === 'Pending').reduce((sum, w) => sum + w.net_amount, 0);
    const pendingCount = currentMonthWages.filter(w => w.status === 'Pending').length;

    return { totalBudget, disbursed, pending, pendingCount };
  }, [currentMonthWages]);

  // Single disbursement
  const handleDisburseSingle = (wageId: string, teacherName: string) => {
    const { updatedWages } = adminService.disburseWage(wageId, 'Bank Transfer');
    setWages(updatedWages);
    setTransactions(adminService.getTransactions());
    showToast(`Salary disbursed for ${teacherName}. Transaction generated.`);
  };

  // Bulk disbursement
  const handleConfirmBulkDisburse = () => {
    const { updatedWages, count } = adminService.disburseAllPendingWages(selectedMonth, bulkGateway);
    setWages(updatedWages);
    setTransactions(adminService.getTransactions());
    setIsBulkDisburseOpen(false);
    showToast(`Disbursed wages for all ${count} pending faculty members for ${selectedMonth}!`);
  };

  const handleExportPayrollCSV = () => {
    const csv = adminService.exportWagesCSV(currentMonthWages);
    downloadCsvFile(csv, `UniCampus_Payroll_${selectedMonth.replace(/\s+/g, '_')}.csv`);
  };

  return (
    <div className="w-full space-y-5 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-8 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold border border-emerald-400/30">
          <Check className="w-4 h-4" /> {toastMessage}
        </div>
      )}

      {/* Software Header Bar */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-[20px] bg-surface border border-line`}>
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-fg">
              Fees, Payments &amp; Faculty Payroll
            </h1>
            <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-brand/15 text-brand border border-brand/35">
              Finance Hub
            </span>
          </div>
          <p className={"text-xs text-fg-muted mt-1"}>
            Manage student fee collections, digital transaction vouchers, and faculty payroll disbursements.
          </p>
        </div>
      </div>

      {/* 4 Core Tabs Segmented Dock */}
      <div className={`p-1.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none rounded-[20px] bg-surface border border-line relative`}>
        {[
          { id: 'overview', label: 'Financial Overview', icon: Receipt },
          { id: 'transactions', label: 'All Transactions', icon: CreditCard, count: transactions.length },
          { id: 'departments', label: 'Department Breakdown', icon: Building2 },
          { id: 'payroll', label: 'Faculty Payroll', icon: DollarSign },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`relative px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 shrink-0 cursor-pointer z-10 ${
                isActive
                  ? "text-slate-900 dark:text-white"
                  : "text-slate-600 hover:text-slate-900 dark:text-fg-muted dark:hover:text-white"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="admin-finance-tab-pill"
                  className="absolute inset-0 bg-white dark:bg-surface-2 border border-slate-200 dark:border-line rounded-xl shadow-xs -z-10"
                  transition={{ type: "spring", stiffness: 450, damping: 32 }}
                />
              )}
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span className={`text-xs px-1.5 py-0.2 rounded-md transition-colors ${
                  isActive
                    ? 'bg-brand/15 text-brand dark:bg-brand/30 dark:text-brand font-bold'
                    : 'bg-slate-200 dark:bg-surface-2 text-slate-600 dark:text-fg-muted'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: OVERVIEW */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          {/* 4 Dynamic KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* KPI 1: Inflow vs Outflow */}
            <div className="p-4 rounded-[20px] bg-surface border border-line">
              <div className="flex items-center justify-between mb-2.5">
                <span className={`text-xs font-bold text-fg-muted`}>Net Cash Flow</span>
                <span className="w-7 h-7 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
                  <CreditCard className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-emerald-500 dark:text-emerald-400 flex items-center gap-1 text-xs">
                    <ArrowDownLeft className="w-3 h-3" /> Inflow:
                  </span>
                  <span className={`font-bold text-fg`}>৳{totalInflow.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-rose-500 dark:text-rose-400 flex items-center gap-1 text-xs">
                    <ArrowUpRight className="w-3 h-3" /> Outflow:
                  </span>
                  <span className={`font-bold text-fg`}>৳{totalOutflow.toLocaleString()}</span>
                </div>
              </div>
              <div className={`mt-2.5 pt-2 border-t border-line flex items-center justify-between text-xs font-semibold text-fg-muted`}>
                <span>Net Balance</span>
                <span className="text-brand font-bold">৳{(totalInflow - totalOutflow).toLocaleString()}</span>
              </div>
            </div>

            {/* KPI 2: Student Tuition Fees */}
            <div className="p-4 rounded-[20px] bg-surface border border-line">
              <div className="flex items-center justify-between mb-2.5">
                <span className={`text-xs font-bold text-fg-muted`}>Tuition Collections</span>
                <span className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 dark:text-emerald-400">
                  <ArrowDownLeft className="w-3.5 h-3.5" />
                </span>
              </div>
              <h3 className={`text-xl font-bold mb-1 text-fg`}>
                ৳<CountUp to={totalTuitionFees} duration={0.8} />
              </h3>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Fully verified through bKash, Nagad &amp; Bank
              </p>
            </div>

            {/* KPI 3: Faculty Wages Disbursed */}
            <div className="p-4 rounded-[20px] bg-surface border border-line">
              <div className="flex items-center justify-between mb-2.5">
                <span className={`text-xs font-bold text-fg-muted`}>Faculty Payroll</span>
                <span className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 dark:text-amber-400">
                  <DollarSign className="w-3.5 h-3.5" />
                </span>
              </div>
              <h3 className={`text-xl font-bold mb-1 text-fg`}>
                ৳<CountUp to={totalWagesDisbursed} duration={0.8} />
              </h3>
              <p className={`text-xs font-medium text-fg-muted`}>
                Disbursed to verified teachers across 5 academic departments
              </p>
            </div>

            {/* KPI 4: Total Dues */}
            <div className="p-4 rounded-[20px] bg-surface border border-line">
              <div className="flex items-center justify-between mb-2.5">
                <span className={`text-xs font-bold text-fg-muted`}>Outstanding Dues</span>
                <span className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 dark:text-rose-400">
                  <AlertCircle className="w-3.5 h-3.5" />
                </span>
              </div>
              <h3 className="text-xl font-bold text-rose-500 dark:text-rose-400 mb-1">
                ৳<CountUp to={totalDues} duration={0.8} />
              </h3>
              <p className="text-xs text-rose-500 dark:text-rose-400 font-medium">
                Pending &amp; overdue student semester payments
              </p>
            </div>
          </div>

          {/* Department Fee Collection Progress Bars */}
          <div className={`p-5 rounded-[20px] bg-surface border border-line`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className={`text-base font-bold text-fg`}>
                  Department Fee Collection Progress
                </h3>
                <p className={"text-xs text-fg-muted mt-1"}>
                  Real-time collection efficiency vs target tuition fee for the current semester
                </p>
              </div>
              <button 
                onClick={() => setActiveTab('departments')}
                className="text-xs font-semibold text-brand hover:underline flex items-center gap-1 cursor-pointer"
              >
                Granular Breakdown <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {deptProgressList.map((dp) => (
                <div key={dp.department.id} className={`p-3.5 rounded-xl border space-y-2 rounded-xl bg-canvas border border-line`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-brand/10 border border-brand/20 text-brand rounded-md text-xs font-bold font-mono">
                        {dp.department.code}
                      </span>
                      <span className={`font-semibold text-xs text-fg`}>
                        {dp.department.name}
                      </span>
                    </div>
                    <span className="font-bold text-xs text-brand">{dp.percentage}%</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-slate-200 dark:bg-surface-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-brand rounded-full transition-[width] duration-300"
                      style={{ width: `${dp.percentage}%` }}
                    ></div>
                  </div>

                  <div className={`flex items-center justify-between text-xs font-medium pt-0.5 text-fg-muted`}>
                    <span>Collected: <strong className={"text-fg"}>৳{dp.collected.toLocaleString()}</strong></span>
                    <span>Target: ৳{dp.target.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions Preview */}
          <div className={`overflow-hidden rounded-[20px] bg-surface border border-line`}>
            <div className={`p-4 border-b border-line flex items-center justify-between`}>
              <h3 className={`text-sm font-bold text-fg`}>
                Recent Ledger Transactions
              </h3>
              <button 
                onClick={() => setActiveTab('transactions')}
                className="text-xs font-semibold text-brand hover:underline flex items-center gap-1 cursor-pointer"
              >
                View All Ledger Entries <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={"bg-canvas font-mono text-xs text-fg-muted border-b border-line"}>
                    <th className="px-4 py-3">Transaction ID</th>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Classification</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Gateway</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-line">
                  {transactions.slice(0, 5).map((t) => (
                    <tr 
                      key={t.id} 
                      onClick={() => setViewingReceipt(t)}
                      className={"hover:bg-surface-2/60 border-b border-line transition-colors"}
                    >
                      <td className="px-4 py-3 font-mono font-bold text-xs text-brand">
                        {t.transaction_id}
                      </td>
                      <td className={`px-4 py-3 font-semibold text-xs text-fg`}>
                        {t.user_name}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-md border rounded-xl bg-canvas border border-line text-fg-muted`}>
                          {formatTransactionType(t.type)}
                        </span>
                      </td>
                      <td className={`px-4 py-3 font-bold text-xs text-fg`}>
                        ৳{t.amount.toLocaleString()}
                      </td>
                      <td className={`px-4 py-3 text-xs font-medium text-fg-muted`}>
                        {t.payment_method}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-md text-xs font-bold border ${
                          t.status === 'Paid' 
                            ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20' 
                            : 'bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/20'
                        }`}>
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
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ALL TRANSACTIONS */}
      {/* ========================================================================= */}
      {activeTab === 'transactions' && (
        <div className="space-y-4">
          {/* Controls Bar: Search, Filters, CSV Export */}
          <div className={`p-4 space-y-3.5 rounded-[20px] bg-surface border border-line`}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-3.5">
              <div className="relative w-full md:w-96">
                <Search className={`w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-muted`} />
                <input 
                  type="text" 
                  value={txnSearch}
                  onChange={(e) => setTxnSearch(e.target.value)}
                  placeholder="Search Txn ID, student/teacher name, receipt..."
                  className={`w-full pl-9 pr-3.5 py-2 font-medium rounded-xl bg-canvas border border-line text-fg placeholder:text-fg-muted text-xs outline-hidden focus:border-brand`}
                />
              </div>

              <button
                onClick={handleExportTransactionsCSV}
                className={`bg-canvas hover:bg-surface-2 text-fg border border-line rounded-xl font-semibold px-3.5 py-2 flex items-center gap-1.5 self-start md:self-auto`}
              >
                <Download className="w-3.5 h-3.5" />
                Export Ledger (CSV)
              </button>
            </div>

            {/* Classification Chips */}
            <div className={`flex flex-wrap items-center gap-1.5 pt-2 border-t border-line`}>
              <span className={`text-xs font-bold mr-1 text-fg-muted`}>Classification:</span>
              {[
                { id: 'all', label: 'All Transactions' },
                { id: 'student_fee', label: 'Student Fees' },
                { id: 'teacher_wage', label: 'Teacher Wages' },
                { id: 'late_fine', label: 'Late Fines' },
              ].map(chip => (
                <button
                  key={chip.id}
                  onClick={() => setSelectedType(chip.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    selectedType === chip.id
                      ? "bg-surface text-fg font-bold shadow-xs rounded-lg px-3 py-1.5 text-xs transition-colors"
                      : "text-fg-muted hover:text-fg rounded-lg px-3 py-1.5 text-xs transition-colors"
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Filter Dropdowns */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              <div className="relative">
                <label className={`text-xs font-bold block mb-1 text-fg-muted`}>Gateway</label>
                <select 
                  value={selectedGateway}
                  onChange={(e) => setSelectedGateway(e.target.value)}
                  className={`w-full px-3 py-1.5 font-semibold cursor-pointer rounded-xl bg-canvas border border-line text-fg text-xs outline-hidden focus:border-brand cursor-pointer`}
                >
                  <option value="all">All Gateways</option>
                  <option value="bKash">bKash</option>
                  <option value="Nagad">Nagad</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Card">Credit/Debit Card</option>
                </select>
              </div>

              <div className="relative">
                <label className={`text-xs font-bold block mb-1 text-fg-muted`}>Payment Status</label>
                <select 
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className={`w-full px-3 py-1.5 font-semibold cursor-pointer rounded-xl bg-canvas border border-line text-fg text-xs outline-hidden focus:border-brand cursor-pointer`}
                >
                  <option value="all">All Statuses</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>

              <div className="relative">
                <label className={`text-xs font-bold block mb-1 text-fg-muted`}>Department</label>
                <select 
                  value={selectedDeptFilter}
                  onChange={(e) => setSelectedDeptFilter(e.target.value)}
                  className={`w-full px-3 py-1.5 font-semibold cursor-pointer rounded-xl bg-canvas border border-line text-fg text-xs outline-hidden focus:border-brand cursor-pointer`}
                >
                  <option value="all">All Departments</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.name}>{d.name} ({d.code})</option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <label className={`text-xs font-bold block mb-1 text-fg-muted`}>Date Range</label>
                <select 
                  value={selectedDateRange}
                  onChange={(e) => setSelectedDateRange(e.target.value)}
                  className={`w-full px-3 py-1.5 font-semibold cursor-pointer rounded-xl bg-canvas border border-line text-fg text-xs outline-hidden focus:border-brand cursor-pointer`}
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

          {/* Transactions Data: Mobile Cards + Desktop Table */}
          <div className={`overflow-hidden shadow-sm rounded-[20px] bg-surface border border-line`}>
            {/* Mobile View: Cards */}
            <div className="block md:hidden divide-y divide-slate-100 dark:divide-line">
              {filteredTransactions.length === 0 ? (
                <div className={`px-6 py-12 text-center text-xs font-medium text-fg-muted`}>
                  No transactions found matching your criteria.
                </div>
              ) : (
                filteredTransactions.map((t) => (
                  <div 
                    key={t.id} 
                    onClick={() => setViewingReceipt(t)}
                    className="p-4 space-y-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-surface-2/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-xs text-brand">
                            {t.transaction_id}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(t.transaction_id, "Transaction ID copied");
                            }}
                            title="Copy TXN ID"
                            className={"text-fg-muted hover:text-fg rounded-lg p-1"}
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className={`text-xs block mt-0.5 text-fg-muted`}>
                          {new Date(t.created_at).toLocaleString()}
                        </span>
                      </div>

                      <span className={`px-2 py-0.5 rounded-md text-xs font-bold border shrink-0 ${
                        t.status === 'Paid'
                          ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20'
                          : t.status === 'Pending'
                          ? 'bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/20'
                      }`}>
                        {t.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <div className={`font-semibold text-fg`}>
                          {t.user_name}
                        </div>
                        <div className={`text-xs font-mono text-fg-muted`}>
                          {t.student_id ? `ID: ${t.student_id}` : 'Faculty Member'} • {t.department_name} ({t.semester_name})
                        </div>
                      </div>

                      <div className="text-right">
                        <div className={`font-bold text-sm text-fg`}>
                          ৳{t.amount.toLocaleString()}
                        </div>
                        <div className={`text-xs text-fg-muted`}>
                          {t.payment_method}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-line">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-md border rounded-xl bg-canvas border border-line text-fg-muted`}>
                        {formatTransactionType(t.type)}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewingReceipt(t);
                        }}
                        className={`bg-canvas hover:bg-surface-2 text-fg border border-line rounded-xl font-semibold px-2.5 py-1 inline-flex items-center gap-1.5 text-xs`}
                      >
                        <Receipt className="w-3.5 h-3.5 text-brand" />
                        <span>View Voucher</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={"bg-canvas font-mono text-xs text-fg-muted border-b border-line"}>
                    <th className="px-4 py-3">Transaction ID</th>
                    <th className="px-4 py-3">User Identity</th>
                    <th className="px-4 py-3">Department &amp; Semester</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Gateway</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Receipt Voucher</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-line">
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className={`px-6 py-12 text-center text-xs font-medium text-fg-muted`}>
                        No transactions found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((t) => (
                      <tr 
                        key={t.id} 
                        onClick={() => setViewingReceipt(t)}
                        className={`hover:bg-surface-2/60 border-b border-line transition-colors group`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-brand group-hover:underline">
                              {t.transaction_id}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(t.transaction_id, "Transaction ID copied");
                              }}
                              title="Copy TXN ID"
                              className={"text-fg-muted hover:text-fg rounded-lg p-1"}
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span className={`text-xs block mt-0.5 text-fg-muted`}>
                            {new Date(t.created_at).toLocaleString()}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <div className={`font-semibold text-xs text-fg`}>
                            {t.user_name}
                          </div>
                          <div className={`text-xs font-mono text-fg-muted`}>
                            {t.student_id ? `Student ID: ${t.student_id}` : 'Faculty Member'}
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <div className={`text-xs font-medium text-fg-muted`}>
                            {t.department_name}
                          </div>
                          <div className="text-xs text-brand font-medium">
                            {t.semester_name}
                          </div>
                        </td>

                        <td className={`px-4 py-3 font-bold text-xs text-fg`}>
                          ৳{t.amount.toLocaleString()}
                          <span className={`block text-xs font-normal text-fg-muted`}>
                            {formatTransactionType(t.type)}
                          </span>
                        </td>

                        <td className={`px-4 py-3 text-xs font-medium text-fg-muted`}>
                          {t.payment_method}
                        </td>

                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-md text-xs font-bold border ${
                            t.status === 'Paid'
                              ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20'
                              : t.status === 'Pending'
                              ? 'bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/20'
                          }`}>
                            {t.status}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewingReceipt(t);
                            }}
                            className={`bg-canvas hover:bg-surface-2 text-fg border border-line rounded-xl font-semibold px-2.5 py-1 inline-flex items-center gap-1.5 text-xs`}
                          >
                            <Receipt className="w-3.5 h-3.5 text-brand" />
                            View Voucher
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: DEPARTMENT BREAKDOWN */}
      {/* ========================================================================= */}
      {activeTab === 'departments' && currentDeptObj && (
        <div className="space-y-5">
          {/* Department Selector Pills */}
          <div className={`flex items-center gap-1.5 overflow-x-auto pb-1 p-1 scrollbar-none rounded-xl bg-canvas border border-line p-1`}>
            {departments.map((dept) => {
              const isSelected = activeDeptTab === dept.id;
              return (
                <button
                  key={dept.id}
                  onClick={() => setActiveDeptTab(dept.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors shrink-0 flex items-center gap-2 ${
                    isSelected
                      ? "bg-surface text-fg font-bold shadow-xs rounded-lg px-3 py-1.5 text-xs transition-colors"
                      : "text-fg-muted hover:text-fg rounded-lg px-3 py-1.5 text-xs transition-colors"
                  }`}
                >
                  <span className="font-bold font-mono">{dept.code}</span>
                  <span className="opacity-80 font-normal">({dept.name})</span>
                </button>
              );
            })}
          </div>

          {/* Department Collection Efficiency Banner */}
          <div className={`p-5 rounded-[20px] bg-surface border border-line`}>
            <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-line`}>
              <div>
                <span className="text-xs font-bold text-brand bg-brand/10 border border-brand/20 px-2 py-0.5 rounded-md font-mono">
                  {currentDeptObj.code} Fiscal Efficiency
                </span>
                <h2 className={`text-xl font-bold mt-1 text-fg`}>
                  {currentDeptObj.name}
                </h2>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleExportDepartmentCSV}
                  className={`bg-canvas hover:bg-surface-2 text-fg border border-line rounded-xl font-semibold px-3 py-1.5 text-xs flex items-center gap-1.5`}
                >
                  <Download className="w-3.5 h-3.5" /> Export Department Summary (CSV)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4">
              <div className={`p-3 rounded-xl border rounded-xl bg-canvas border border-line`}>
                <p className={`text-xs font-bold mb-1 text-fg-muted`}>Total Fee Target</p>
                <h3 className={`text-lg font-bold text-fg`}>
                  ৳{currentDeptProgress.target.toLocaleString()}
                </h3>
              </div>
              <div className={`p-3 rounded-xl border rounded-xl bg-canvas border border-line`}>
                <p className={`text-xs font-bold mb-1 text-fg-muted`}>Tuition Collected</p>
                <h3 className="text-lg font-bold text-emerald-500 dark:text-emerald-400">
                  ৳{currentDeptProgress.collected.toLocaleString()}
                </h3>
              </div>
              <div className={`p-3 rounded-xl border rounded-xl bg-canvas border border-line`}>
                <p className={`text-xs font-bold mb-1 text-fg-muted`}>Pending Balance</p>
                <h3 className="text-lg font-bold text-rose-500 dark:text-rose-400">
                  ৳{currentDeptProgress.pending.toLocaleString()}
                </h3>
              </div>
              <div className={`p-3 rounded-xl border rounded-xl bg-canvas border border-line`}>
                <p className={`text-xs font-bold mb-1 text-fg-muted`}>Collection Efficiency</p>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-brand">{currentDeptProgress.percentage}%</h3>
                  <div className="flex-1 h-2 bg-slate-200 dark:bg-surface-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-brand rounded-full" 
                      style={{ width: `${currentDeptProgress.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Accordion by Ordinal Semester (1st to 8th Semester) */}
          <div className="space-y-3">
            <h3 className={`text-xs font-bold text-fg-muted`}>
              Granular Semester Tuition Ledgers (1st Semester to 8th Semester)
            </h3>

            {ORDINAL_SEMESTERS.map((semName) => {
              const semTxns = departmentTransactions.filter(t => t.semester_name === semName);
              const isExpanded = expandedSemester === semName;
              const overdueCount = semTxns.filter(t => t.status === 'Pending' || t.status === 'Overdue').length;
              const semTotal = semTxns.reduce((sum, t) => sum + t.amount, 0);

              return (
                <div 
                  key={semName} 
                  className={`overflow-hidden rounded-[20px] bg-surface border border-line`}
                >
                  <div 
                    onClick={() => setExpandedSemester(isExpanded ? null : semName)}
                    className="p-3.5 sm:p-4 flex items-center justify-between cursor-pointer hover:bg-slate-100/50 dark:hover:bg-surface-2/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-brand/10 border border-brand/20 text-brand font-bold text-xs flex items-center justify-center font-mono">
                        {semName.split(' ')[0]}
                      </span>
                      <div>
                        <h4 className={`font-bold text-xs text-fg`}>
                          {semName}
                        </h4>
                        <p className={`text-xs text-fg-muted`}>
                          {semTxns.length} payment record{semTxns.length !== 1 ? 's' : ''} • Total ৳{semTotal.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      {overdueCount > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setReminderModalSemester(semName);
                          }}
                          className="px-2.5 py-1 bg-rose-500/10 border border-rose-500/30 text-rose-500 dark:text-rose-300 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                          Send Reminders ({overdueCount})
                        </button>
                      )}
                      {isExpanded ? <ChevronUp className={`w-4 h-4 text-fg-muted`} /> : <ChevronDown className={`w-4 h-4 text-fg-muted`} />}
                    </div>
                  </div>

                  {/* Accordion Content */}
                  {isExpanded && (
                    <div className="border-t border-line p-3 sm:p-4 bg-canvas/50">
                      {semTxns.length === 0 ? (
                        <p className={`text-xs text-center py-3 font-medium text-fg-muted`}>
                          No student payments recorded for {semName} in {currentDeptObj.name}.
                        </p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className={`border-b border-line text-fg-muted text-xs font-bold`}>
                                <th className="pb-2">Student Name</th>
                                <th className="pb-2">Student ID</th>
                                <th className="pb-2">Amount</th>
                                <th className="pb-2">Gateway</th>
                                <th className="pb-2">Status</th>
                                <th className="pb-2 text-right">Receipt</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-line text-xs">
                              {semTxns.map((t) => (
                                <tr key={t.id} className={"hover:bg-surface-2/60 border-b border-line transition-colors"}>
                                  <td className={`py-2.5 font-semibold text-fg`}>{t.user_name}</td>
                                  <td className={`py-2.5 font-mono text-xs text-fg-muted`}>{t.student_id || 'N/A'}</td>
                                  <td className={`py-2.5 font-bold text-fg`}>৳{t.amount.toLocaleString()}</td>
                                  <td className={`py-2.5 font-medium text-fg-muted`}>{t.payment_method}</td>
                                  <td className="py-2.5">
                                    <span className={`px-2 py-0.5 rounded-md text-xs font-bold border ${
                                      t.status === 'Paid' 
                                        ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20' 
                                        : 'bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/20'
                                    }`}>
                                      {t.status}
                                    </span>
                                  </td>
                                  <td className="py-2.5 text-right font-mono text-brand">
                                    <button 
                                      onClick={() => setViewingReceipt(t)}
                                      className="hover:underline font-semibold text-xs cursor-pointer"
                                      role="link"
                                      aria-label={`View receipt ${t.receipt_number}`}
                                    >
                                      {t.receipt_number}
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: TEACHER WAGES (PAYROLL) */}
      {/* ========================================================================= */}
      {activeTab === 'payroll' && (
        isDeptAdmin ? (
          <div className="p-8 text-center rounded-2xl border border-dashed border-slate-300 dark:border-line bg-slate-50/50 dark:bg-surface max-w-xl mx-auto my-8">
            <div className="w-12 h-12 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center mx-auto mb-4 text-brand dark:text-brand">
              <Crown className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-fg mb-1">
              Super Admin Authority Required
            </h3>
            <p className="text-xs text-slate-500 dark:text-fg-muted leading-relaxed mb-4">
              Institutional faculty salary disbursements and corporate banking transfers are restricted to the central Super Administrator.
              As {adminDepartmentName || 'Department'} Administrator, you have full oversight over student fee collections and clearances under the <strong>Department Breakdown</strong> tab.
            </p>
            <button
              onClick={() => setActiveTab('departments')}
              className={`px-4 py-2 bg-brand text-white hover:bg-brand-hover rounded-xl font-bold text-xs font-bold cursor-pointer`}
            >
              Go to Department Tuition Ledger
            </button>
          </div>
        ) : (
          <div className="space-y-4">
          {/* Month Cycle Navigation & Actions */}
          <div className={`p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-[20px] bg-surface border border-line`}>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <span className={`text-xs font-bold mr-1 text-fg-muted`}>Payroll Cycle:</span>
              {MONTH_CYCLES.map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMonth(m)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors shrink-0 ${
                    selectedMonth === m
                      ? "bg-surface text-fg font-bold shadow-xs rounded-lg px-3 py-1.5 text-xs transition-colors"
                      : "text-fg-muted hover:text-fg rounded-lg px-3 py-1.5 text-xs transition-colors"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportPayrollCSV}
                className={`bg-canvas hover:bg-surface-2 text-fg border border-line rounded-xl font-semibold px-3.5 py-2 text-xs flex items-center gap-1.5`}
              >
                <Download className="w-3.5 h-3.5" /> Export Payroll (CSV)
              </button>

              <button
                onClick={() => setIsBulkDisburseOpen(true)}
                disabled={payrollSummary.pendingCount === 0}
                className={`bg-brand text-white hover:bg-brand-hover rounded-xl font-bold px-3.5 py-2 text-xs flex items-center gap-1.5 disabled:opacity-40`}
              >
                <DollarSign className="w-3.5 h-3.5" /> Disburse All Pending ({payrollSummary.pendingCount})
              </button>
            </div>
          </div>

          {/* Payroll Cycle Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-[20px] bg-surface border border-line">
              <p className={`text-xs font-bold mb-1 text-fg-muted`}>Total Faculty Budget</p>
              <h3 className={`text-xl font-bold text-fg`}>
                ৳<CountUp to={payrollSummary.totalBudget} duration={0.8} />
              </h3>
              <p className={`text-xs mt-1 text-fg-muted`}>Total allocations for {selectedMonth}</p>
            </div>

            <div className="p-4 rounded-[20px] bg-surface border border-line">
              <p className={`text-xs font-bold mb-1 text-fg-muted`}>Disbursed Wages</p>
              <h3 className="text-xl font-bold text-emerald-500 dark:text-emerald-400">
                ৳<CountUp to={payrollSummary.disbursed} duration={0.8} />
              </h3>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">Disbursed into faculty bank accounts</p>
            </div>

            <div className="p-4 rounded-[20px] bg-surface border border-line">
              <p className={`text-xs font-bold mb-1 text-fg-muted`}>Pending Disbursements</p>
              <h3 className="text-xl font-bold text-amber-500 dark:text-amber-400">
                ৳<CountUp to={payrollSummary.pending} duration={0.8} />
              </h3>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-1">
                {payrollSummary.pendingCount} faculty member{payrollSummary.pendingCount !== 1 ? 's' : ''} awaiting payout
              </p>
            </div>
          </div>

          {/* Faculty Salary Data: Mobile Cards + Desktop Table */}
          <div className={`overflow-hidden shadow-sm rounded-[20px] bg-surface border border-line`}>
            {/* Mobile View: Cards */}
            <div className="block md:hidden divide-y divide-slate-100 dark:divide-line">
              {currentMonthWages.length === 0 ? (
                <div className={`px-6 py-12 text-center text-xs font-medium text-fg-muted`}>
                  No faculty wages registered for {selectedMonth}.
                </div>
              ) : (
                currentMonthWages.map((wage) => (
                  <div 
                    key={wage.id}
                    onClick={() => setViewingSalarySlip(wage)}
                    className="p-4 space-y-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-surface-2/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className={`font-bold text-xs text-fg`}>
                          {wage.teacher_name}
                        </div>
                        <div className={`text-xs font-mono text-fg-muted`}>
                          {wage.teacher_code} • {wage.department_name}
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded-md text-xs font-bold border shrink-0 ${
                        wage.status === 'Disbursed'
                          ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/20'
                      }`}>
                        {wage.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className={`text-xs block text-fg-muted`}>Base</span>
                        <span className="font-semibold text-xs">৳{wage.base_amount.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className={`text-xs block text-emerald-500`}>Allowances</span>
                        <span className="font-semibold text-xs text-emerald-600 dark:text-emerald-400">+৳{wage.allowances.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className={`text-xs block text-rose-500`}>Deductions</span>
                        <span className="font-semibold text-xs text-rose-600 dark:text-rose-400">-৳{wage.deductions.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-line">
                      <div>
                        <span className={`text-xs block text-fg-muted`}>Net Amount</span>
                        <span className={`font-bold text-sm text-fg`}>৳{wage.net_amount.toLocaleString()}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {wage.status === 'Pending' ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDisburseSingle(wage.id, wage.teacher_name);
                            }}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors shadow-sm cursor-pointer"
                          >
                            Disburse
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewingSalarySlip(wage);
                            }}
                            className={`bg-canvas hover:bg-surface-2 text-fg border border-line rounded-xl font-semibold px-3 py-1.5 text-xs rounded-xl`}
                          >
                            Salary Slip
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={"bg-canvas font-mono text-xs text-fg-muted border-b border-line"}>
                    <th className="px-4 py-3">Faculty Member</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Base Salary</th>
                    <th className="px-4 py-3">Allowances</th>
                    <th className="px-4 py-3">Deductions</th>
                    <th className="px-4 py-3">Net Amount</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-line">
                  {currentMonthWages.length === 0 ? (
                    <tr>
                      <td colSpan={8} className={`px-6 py-12 text-center text-xs font-medium text-fg-muted`}>
                        No faculty wages registered for {selectedMonth}.
                      </td>
                    </tr>
                  ) : (
                    currentMonthWages.map((wage) => (
                      <tr 
                        key={wage.id}
                        onClick={() => setViewingSalarySlip(wage)}
                        className={"hover:bg-surface-2/60 border-b border-line transition-colors"}
                      >
                        <td className="px-4 py-3">
                          <div className={`font-semibold text-xs text-fg`}>
                            {wage.teacher_name}
                          </div>
                          <div className={`text-xs font-mono text-fg-muted`}>
                            {wage.teacher_code}
                          </div>
                        </td>

                        <td className={`px-4 py-3 text-xs font-medium text-fg-muted`}>
                          {wage.department_name}
                        </td>

                        <td className={`px-4 py-3 text-xs font-medium text-fg-muted`}>
                          ৳{wage.base_amount.toLocaleString()}
                        </td>

                        <td className="px-4 py-3 text-xs font-medium text-emerald-500 dark:text-emerald-400">
                          +৳{wage.allowances.toLocaleString()}
                        </td>

                        <td className="px-4 py-3 text-xs font-medium text-rose-500 dark:text-rose-400">
                          -৳{wage.deductions.toLocaleString()}
                        </td>

                        <td className={`px-4 py-3 font-bold text-xs text-fg`}>
                          ৳{wage.net_amount.toLocaleString()}
                        </td>

                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-md text-xs font-bold border ${
                            wage.status === 'Disbursed'
                              ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/20'
                          }`}>
                            {wage.status}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {wage.status === 'Pending' ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDisburseSingle(wage.id, wage.teacher_name);
                                }}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors shadow-sm cursor-pointer"
                              >
                                Disburse
                              </button>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setViewingSalarySlip(wage);
                                }}
                                className={`bg-canvas hover:bg-surface-2 text-fg border border-line rounded-xl font-semibold px-2.5 py-1 text-xs`}
                              >
                                Salary Slip
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ))}

      {/* ========================================================================= */}
      {/* DIGITAL RECEIPT VOUCHER MODAL */}
      {/* ========================================================================= */}
      {viewingReceipt && (
        <div className={"fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"}>
          <div className={`w-full max-w-lg p-6 rounded-[20px] bg-surface border border-line shadow-2xl`}>
            {/* Voucher Header with UniCampus Branding */}
            <div className={`flex items-center justify-between pb-3.5 border-b border-line mb-5`}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-brand text-white flex items-center justify-center font-bold text-sm">
                  U
                </div>
                <div>
                  <h3 className={`text-sm font-bold text-fg`}>UniCampus Treasury</h3>
                  <p className={`text-xs font-semibold text-fg-muted`}>Official Digital Receipt</p>
                </div>
              </div>
              <button onClick={() => setViewingReceipt(null)} className={"text-fg-muted hover:text-fg rounded-lg p-1"}>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Receipt Summary Card */}
            <div className={`p-4 rounded-xl border mb-5 text-center rounded-xl bg-canvas border border-line`}>
              <span className={`text-xs font-bold block mb-1 text-fg-muted`}>Receipt Number</span>
              <h2 className="text-xl font-bold font-mono text-brand mb-2">{viewingReceipt.receipt_number}</h2>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20">
                <Check className="w-3 h-3" /> Status: {viewingReceipt.status}
              </div>
            </div>

            {/* Itemized Details */}
            <div className="space-y-2 text-xs mb-5">
              <div className={`flex justify-between py-1.5 border-b border-line`}>
                <span className={"text-fg-muted"}>Transaction Reference:</span>
                <span className={`font-mono font-bold text-fg`}>{viewingReceipt.transaction_id}</span>
              </div>
              <div className={`flex justify-between py-1.5 border-b border-line`}>
                <span className={"text-fg-muted"}>Recipient / Payer:</span>
                <span className={`font-semibold text-fg`}>{viewingReceipt.user_name}</span>
              </div>
              {viewingReceipt.student_id && (
                <div className={`flex justify-between py-1.5 border-b border-line`}>
                  <span className={"text-fg-muted"}>Student ID:</span>
                  <span className={`font-mono font-semibold text-fg`}>{viewingReceipt.student_id}</span>
                </div>
              )}
              <div className={`flex justify-between py-1.5 border-b border-line`}>
                <span className={"text-fg-muted"}>Academic Department:</span>
                <span className={`font-semibold text-fg`}>{viewingReceipt.department_name}</span>
              </div>
              <div className={`flex justify-between py-1.5 border-b border-line`}>
                <span className={"text-fg-muted"}>Ordinal Semester:</span>
                <span className="font-bold text-brand">{viewingReceipt.semester_name}</span>
              </div>
              <div className={`flex justify-between py-1.5 border-b border-line`}>
                <span className={"text-fg-muted"}>Payment Gateway:</span>
                <span className={`font-semibold text-fg`}>{viewingReceipt.payment_method}</span>
              </div>
              <div className={`flex justify-between py-1.5 border-b border-line`}>
                <span className={"text-fg-muted"}>Date &amp; Timestamp:</span>
                <span className={"text-fg-muted"}>{new Date(viewingReceipt.created_at).toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 text-sm font-bold pt-2">
                <span className={"text-fg"}>Total Settled Amount:</span>
                <span className="text-brand">৳{viewingReceipt.amount.toLocaleString()} BDT</span>
              </div>
            </div>

            <div className={`flex justify-end gap-2.5 pt-4 border-t border-line`}>
              <button
                onClick={() => copyToClipboard(viewingReceipt.transaction_id, "TXN ID")}
                className={`bg-canvas hover:bg-surface-2 text-fg border border-line rounded-xl font-semibold px-3.5 py-1.5 text-xs flex items-center gap-1.5`}
              >
                <Copy className="w-3.5 h-3.5" /> Copy TXN ID
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className={`bg-brand text-white hover:bg-brand-hover rounded-xl font-bold px-3.5 py-1.5 text-xs flex items-center gap-1.5`}
              >
                <Printer className="w-3.5 h-3.5" /> Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FACULTY SALARY SLIP VOUCHER MODAL */}
      {/* ========================================================================= */}
      {viewingSalarySlip && (
        <div className={"fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"}>
          <div className={`w-full max-w-lg p-6 rounded-[20px] bg-surface border border-line shadow-2xl`}>
            <div className={`flex items-center justify-between pb-3.5 border-b border-line mb-5`}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-brand text-white flex items-center justify-center font-bold text-sm">
                  U
                </div>
                <div>
                  <h3 className={`text-sm font-bold text-fg`}>Faculty Salary Voucher</h3>
                  <p className={`text-xs font-semibold text-fg-muted`}>{viewingSalarySlip.month}</p>
                </div>
              </div>
              <button onClick={() => setViewingSalarySlip(null)} className={"text-fg-muted hover:text-fg rounded-lg p-1"}>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Teacher Details */}
            <div className={`p-3.5 rounded-xl border mb-5 rounded-xl bg-canvas border border-line`}>
              <h4 className={`font-bold text-sm text-fg`}>{viewingSalarySlip.teacher_name}</h4>
              <p className={`text-xs mt-0.5 text-fg-muted`}>{viewingSalarySlip.department_name} • Faculty Code: {viewingSalarySlip.teacher_code}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-md text-xs font-bold border ${
                  viewingSalarySlip.status === 'Disbursed' 
                    ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20' 
                    : 'bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/20'
                }`}>
                  Status: {viewingSalarySlip.status}
                </span>
                {viewingSalarySlip.transaction_id && (
                  <span className={`text-xs font-mono text-fg-muted`}>Ref: {viewingSalarySlip.transaction_id}</span>
                )}
              </div>
            </div>

            {/* Salary Calculation Breakdown */}
            <div className="space-y-2 text-xs mb-5">
              <div className={`flex justify-between py-1.5 border-b border-line`}>
                <span className={"text-fg-muted"}>Base Monthly Compensation:</span>
                <span className={`font-bold text-fg`}>৳{viewingSalarySlip.base_amount.toLocaleString()}</span>
              </div>
              <div className={`flex justify-between py-1.5 border-b border-line`}>
                <span className={"text-fg-muted"}>Academic &amp; Research Allowances:</span>
                <span className="font-semibold text-emerald-500 dark:text-emerald-400">+৳{viewingSalarySlip.allowances.toLocaleString()}</span>
              </div>
              <div className={`flex justify-between py-1.5 border-b border-line`}>
                <span className={"text-fg-muted"}>Tax &amp; Provident Fund Deductions:</span>
                <span className="font-semibold text-rose-500 dark:text-rose-400">-৳{viewingSalarySlip.deductions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 text-sm font-bold pt-2">
                <span className={"text-fg"}>Net Payable Disbursed:</span>
                <span className="text-brand">৳{viewingSalarySlip.net_amount.toLocaleString()} BDT</span>
              </div>
            </div>

            <div className={`flex justify-end gap-2.5 pt-4 border-t border-line`}>
              <button
                onClick={() => {
                  window.print();
                }}
                className={`bg-brand text-white hover:bg-brand-hover rounded-xl font-bold px-3.5 py-1.5 text-xs flex items-center gap-1.5`}
              >
                <Printer className="w-3.5 h-3.5" /> Print Salary Slip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BULK DISBURSE CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {isBulkDisburseOpen && (
        <div className={"fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"}>
          <div className={`w-full max-w-md p-6 text-center rounded-[20px] bg-surface border border-line shadow-2xl`}>
            <div className="w-11 h-11 rounded-xl bg-brand/10 border border-brand/20 text-brand flex items-center justify-center mx-auto mb-3.5">
              <DollarSign className="w-5 h-5" />
            </div>

            <h3 className={`text-base font-bold mb-1 text-fg`}>
              Disburse All Pending Faculty Wages?
            </h3>
            <p className={`text-xs mb-4 text-fg-muted`}>
              Cycle: <strong className={"text-fg"}>{selectedMonth}</strong> • Total Payout: <strong className="text-emerald-500 dark:text-emerald-400">৳{payrollSummary.pending.toLocaleString()} BDT</strong>
            </p>

            <div className="space-y-3 mb-5 text-left">
              <div>
                <label className={`block text-xs font-semibold mb-1 text-fg-muted`}>
                  Settlement Gateway
                </label>
                <select 
                  value={bulkGateway}
                  onChange={(e) => setBulkGateway(e.target.value as PaymentMethod)}
                  className={`w-full px-3 py-2 font-semibold cursor-pointer rounded-xl bg-canvas border border-line text-fg text-xs outline-hidden focus:border-brand cursor-pointer`}
                >
                  <option value="Bank Transfer">Bank Electronic Transfer</option>
                  <option value="bKash">bKash Corporate Payout</option>
                  <option value="Nagad">Nagad Corporate Payout</option>
                </select>
              </div>

              <div className={`p-3 rounded-xl border text-xs rounded-xl bg-canvas border border-line text-fg-muted`}>
                This action will mark all {payrollSummary.pendingCount} pending teacher wage records as <strong className={"text-fg"}>Disbursed</strong> and record individual debit vouchers in the master ledger.
              </div>
            </div>

            <div className="flex justify-center gap-2.5">
              <button
                onClick={() => setIsBulkDisburseOpen(false)}
                className={`bg-canvas hover:bg-surface-2 text-fg border border-line rounded-xl font-semibold px-4 py-2`}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBulkDisburse}
                className={`bg-brand text-white hover:bg-brand-hover rounded-xl font-bold px-4 py-2`}
              >
                Confirm Bulk Payout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SEND DUE REMINDERS MODAL (TAB 3) */}
      {/* ========================================================================= */}
      {reminderModalSemester && (
        <div className={"fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"}>
          <div className={`w-full max-w-md p-6 text-center rounded-[20px] bg-surface border border-line shadow-2xl`}>
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 dark:text-amber-400 flex items-center justify-center mx-auto mb-3.5">
              <Send className="w-5 h-5" />
            </div>

            <h3 className={`text-base font-bold mb-1 text-fg`}>
              Broadcast Due Payment Reminders
            </h3>
            <p className={`text-xs mb-4 text-fg-muted`}>
              {currentDeptObj?.name} • <strong className={"text-fg"}>{reminderModalSemester}</strong>
            </p>

            <div className={`p-3 rounded-xl border max-h-48 overflow-y-auto mb-5 space-y-2 text-left rounded-xl bg-canvas border border-line`}>
              <p className={`text-xs font-bold text-fg-muted`}>
                Recipients ({overdueStudentsInSelectedSemester.length} students)
              </p>
              {overdueStudentsInSelectedSemester.map(s => (
                <div key={s.id} className="flex justify-between items-center text-xs">
                  <span className={`font-semibold text-fg`}>{s.user_name} ({s.student_id})</span>
                  <span className="font-mono text-rose-500 dark:text-rose-400 font-bold">৳{s.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-2.5">
              <button
                onClick={() => setReminderModalSemester(null)}
                className={`bg-canvas hover:bg-surface-2 text-fg border border-line rounded-xl font-semibold px-4 py-2`}
              >
                Cancel
              </button>
              <button
                onClick={handleSendDueReminders}
                className={`bg-brand text-white hover:bg-brand-hover rounded-xl font-bold px-4 py-2`}
              >
                Dispatch Reminders (SMS/Email)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

