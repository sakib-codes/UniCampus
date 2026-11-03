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
import { themeTokens } from "@/lib/theme";
import SpotlightCard from "@/components/bits/SpotlightCard";
import CountUp from "@/components/bits/CountUp";
import ClickSpark from "@/components/bits/ClickSpark";
import DecryptedText from "@/components/bits/DecryptedText";

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
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 ${themeTokens.card}`}>
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-[#F0F6FC]">
              Fees, Payments &amp; Faculty Payroll
            </h1>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-brand/15 text-brand border border-brand/35">
              Treasury Core
            </span>
          </div>
          <p className={themeTokens.subheading}>
            Manage student fee collections, digital transaction vouchers, and faculty payroll disbursements.
          </p>
        </div>
      </div>

      {/* 4 Core Tabs Segmented Dock */}
      <div className={`p-1.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none ${themeTokens.card} relative`}>
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
                  : "text-slate-600 hover:text-slate-900 dark:text-[#8D96A0] dark:hover:text-white"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="admin-finance-tab-pill"
                  className="absolute inset-0 bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] rounded-xl shadow-xs -z-10"
                  transition={{ type: "spring", stiffness: 450, damping: 32 }}
                />
              )}
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md transition-colors ${
                  isActive
                    ? 'bg-brand/15 text-brand dark:bg-brand/30 dark:text-[#2563EB] font-bold'
                    : 'bg-slate-200 dark:bg-[#161B22] text-slate-600 dark:text-[#6E747D]'
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
            <SpotlightCard className={`p-4 ${themeTokens.card}`} spotlightColor="rgba(99, 102, 241, 0.15)">
              <div className="flex items-center justify-between mb-2.5">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${themeTokens.textMuted}`}>Treasury Flow</span>
                <span className="w-7 h-7 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
                  <CreditCard className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-emerald-500 dark:text-emerald-400 flex items-center gap-1 text-[11px]">
                    <ArrowDownLeft className="w-3 h-3" /> Inflow:
                  </span>
                  <span className={`font-bold ${themeTokens.textPrimary}`}>৳{totalInflow.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-rose-500 dark:text-rose-400 flex items-center gap-1 text-[11px]">
                    <ArrowUpRight className="w-3 h-3" /> Outflow:
                  </span>
                  <span className={`font-bold ${themeTokens.textPrimary}`}>৳{totalOutflow.toLocaleString()}</span>
                </div>
              </div>
              <div className={`mt-2.5 pt-2 border-t ${themeTokens.border} flex items-center justify-between text-[11px] font-semibold ${themeTokens.textMuted}`}>
                <span>Net Balance</span>
                <span className="text-brand font-bold">৳{(totalInflow - totalOutflow).toLocaleString()}</span>
              </div>
            </SpotlightCard>

            {/* KPI 2: Student Tuition Fees */}
            <SpotlightCard className={`p-4 ${themeTokens.card}`} spotlightColor="rgba(16, 185, 129, 0.15)">
              <div className="flex items-center justify-between mb-2.5">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${themeTokens.textMuted}`}>Tuition Collections</span>
                <span className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 dark:text-emerald-400">
                  <ArrowDownLeft className="w-3.5 h-3.5" />
                </span>
              </div>
              <h3 className={`text-xl font-bold mb-1 ${themeTokens.textPrimary}`}>
                ৳<CountUp to={totalTuitionFees} duration={0.8} />
              </h3>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Fully verified through bKash, Nagad &amp; Bank
              </p>
            </SpotlightCard>

            {/* KPI 3: Faculty Wages Disbursed */}
            <SpotlightCard className={`p-4 ${themeTokens.card}`} spotlightColor="rgba(245, 158, 11, 0.15)">
              <div className="flex items-center justify-between mb-2.5">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${themeTokens.textMuted}`}>Faculty Payroll</span>
                <span className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 dark:text-amber-400">
                  <DollarSign className="w-3.5 h-3.5" />
                </span>
              </div>
              <h3 className={`text-xl font-bold mb-1 ${themeTokens.textPrimary}`}>
                ৳<CountUp to={totalWagesDisbursed} duration={0.8} />
              </h3>
              <p className={`text-[11px] font-medium ${themeTokens.textMuted}`}>
                Disbursed to verified teachers across 6 departments
              </p>
            </SpotlightCard>

            {/* KPI 4: Total Dues */}
            <SpotlightCard className={`p-4 ${themeTokens.card}`} spotlightColor="rgba(244, 63, 94, 0.15)">
              <div className="flex items-center justify-between mb-2.5">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${themeTokens.textMuted}`}>Outstanding Dues</span>
                <span className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 dark:text-rose-400">
                  <AlertCircle className="w-3.5 h-3.5" />
                </span>
              </div>
              <h3 className="text-xl font-bold text-rose-500 dark:text-rose-400 mb-1">
                ৳<CountUp to={totalDues} duration={0.8} />
              </h3>
              <p className="text-[11px] text-rose-500 dark:text-rose-400 font-medium">
                Pending &amp; overdue student semester payments
              </p>
            </SpotlightCard>
          </div>

          {/* Department Fee Collection Progress Bars */}
          <div className={`p-5 ${themeTokens.card}`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className={`text-base font-bold ${themeTokens.textPrimary}`}>
                  Department Fee Collection Progress
                </h3>
                <p className={themeTokens.subheading}>
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
                <div key={dp.department.id} className={`p-3.5 rounded-xl border space-y-2 ${themeTokens.cardRecessed}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-brand/10 border border-brand/20 text-brand rounded-md text-[10px] font-bold uppercase font-mono">
                        {dp.department.code}
                      </span>
                      <span className={`font-semibold text-xs ${themeTokens.textPrimary}`}>
                        {dp.department.name}
                      </span>
                    </div>
                    <span className="font-bold text-xs text-brand">{dp.percentage}%</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-slate-200 dark:bg-[#21262D] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-brand rounded-full transition-all duration-500"
                      style={{ width: `${dp.percentage}%` }}
                    ></div>
                  </div>

                  <div className={`flex items-center justify-between text-[11px] font-medium pt-0.5 ${themeTokens.textMuted}`}>
                    <span>Collected: <strong className={themeTokens.textPrimary}>৳{dp.collected.toLocaleString()}</strong></span>
                    <span>Target: ৳{dp.target.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions Preview */}
          <div className={`overflow-hidden ${themeTokens.card}`}>
            <div className={`p-4 border-b ${themeTokens.border} flex items-center justify-between`}>
              <h3 className={`text-sm font-bold uppercase tracking-wider ${themeTokens.textPrimary}`}>
                Recent Treasury Ledger Transactions
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
                  <tr className={themeTokens.tableHeader}>
                    <th className="px-4 py-3">Transaction ID</th>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Classification</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Gateway</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#21262D]">
                  {transactions.slice(0, 5).map((t) => (
                    <tr 
                      key={t.id} 
                      onClick={() => setViewingReceipt(t)}
                      className={themeTokens.tableRow}
                    >
                      <td className="px-4 py-3 font-mono font-bold text-xs text-brand">
                        {t.transaction_id}
                      </td>
                      <td className={`px-4 py-3 font-semibold text-xs ${themeTokens.textPrimary}`}>
                        {t.user_name}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${themeTokens.cardRecessed} ${themeTokens.textSecondary}`}>
                          {t.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className={`px-4 py-3 font-bold text-xs ${themeTokens.textPrimary}`}>
                        ৳{t.amount.toLocaleString()}
                      </td>
                      <td className={`px-4 py-3 text-xs font-medium ${themeTokens.textSecondary}`}>
                        {t.payment_method}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
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
          <div className={`p-4 space-y-3.5 ${themeTokens.card}`}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-3.5">
              <div className="relative w-full md:w-96">
                <Search className={`w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 ${themeTokens.textMuted}`} />
                <input 
                  type="text" 
                  value={txnSearch}
                  onChange={(e) => setTxnSearch(e.target.value)}
                  placeholder="Search Txn ID, student/teacher name, receipt..."
                  className={`w-full pl-9 pr-3.5 py-2 font-medium ${themeTokens.input}`}
                />
              </div>

              <button
                onClick={handleExportTransactionsCSV}
                className={`${themeTokens.btnSecondary} px-3.5 py-2 flex items-center gap-1.5 self-start md:self-auto`}
              >
                <Download className="w-3.5 h-3.5" />
                Export Ledger (CSV)
              </button>
            </div>

            {/* Classification Chips */}
            <div className={`flex flex-wrap items-center gap-1.5 pt-2 border-t ${themeTokens.border}`}>
              <span className={`text-[10px] font-bold uppercase tracking-wider mr-1 ${themeTokens.textMuted}`}>Classification:</span>
              {[
                { id: 'all', label: 'All Transactions' },
                { id: 'student_fee', label: 'Student Fees' },
                { id: 'teacher_wage', label: 'Teacher Wages' },
                { id: 'late_fine', label: 'Late Fines' },
              ].map(chip => (
                <button
                  key={chip.id}
                  onClick={() => setSelectedType(chip.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedType === chip.id
                      ? themeTokens.tabActive
                      : themeTokens.tabInactive
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Filter Dropdowns */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              <div className="relative">
                <label className={`text-[9px] font-bold uppercase tracking-wider block mb-1 ${themeTokens.textMuted}`}>Gateway</label>
                <select 
                  value={selectedGateway}
                  onChange={(e) => setSelectedGateway(e.target.value)}
                  className={`w-full px-3 py-1.5 font-semibold cursor-pointer ${themeTokens.select}`}
                >
                  <option value="all">All Gateways</option>
                  <option value="bKash">bKash</option>
                  <option value="Nagad">Nagad</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Card">Credit/Debit Card</option>
                </select>
              </div>

              <div className="relative">
                <label className={`text-[9px] font-bold uppercase tracking-wider block mb-1 ${themeTokens.textMuted}`}>Payment Status</label>
                <select 
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className={`w-full px-3 py-1.5 font-semibold cursor-pointer ${themeTokens.select}`}
                >
                  <option value="all">All Statuses</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>

              <div className="relative">
                <label className={`text-[9px] font-bold uppercase tracking-wider block mb-1 ${themeTokens.textMuted}`}>Department</label>
                <select 
                  value={selectedDeptFilter}
                  onChange={(e) => setSelectedDeptFilter(e.target.value)}
                  className={`w-full px-3 py-1.5 font-semibold cursor-pointer ${themeTokens.select}`}
                >
                  <option value="all">All Departments</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.name}>{d.name} ({d.code})</option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <label className={`text-[9px] font-bold uppercase tracking-wider block mb-1 ${themeTokens.textMuted}`}>Date Range</label>
                <select 
                  value={selectedDateRange}
                  onChange={(e) => setSelectedDateRange(e.target.value)}
                  className={`w-full px-3 py-1.5 font-semibold cursor-pointer ${themeTokens.select}`}
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
          <div className={`overflow-hidden shadow-sm ${themeTokens.card}`}>
            {/* Mobile View: Cards */}
            <div className="block md:hidden divide-y divide-slate-100 dark:divide-[#21262D]">
              {filteredTransactions.length === 0 ? (
                <div className={`px-6 py-12 text-center text-xs font-medium ${themeTokens.textMuted}`}>
                  No transactions found matching your criteria.
                </div>
              ) : (
                filteredTransactions.map((t) => (
                  <div 
                    key={t.id} 
                    onClick={() => setViewingReceipt(t)}
                    className="p-4 space-y-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-[#161B22]/50 transition-colors"
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
                            className={themeTokens.btnGhost}
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className={`text-[10px] block mt-0.5 ${themeTokens.textMuted}`}>
                          {new Date(t.created_at).toLocaleString()}
                        </span>
                      </div>

                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border shrink-0 ${
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
                        <div className={`font-semibold ${themeTokens.textPrimary}`}>
                          {t.user_name}
                        </div>
                        <div className={`text-[11px] font-mono ${themeTokens.textMuted}`}>
                          {t.student_id ? `ID: ${t.student_id}` : 'Faculty Member'} • {t.department_name} ({t.semester_name})
                        </div>
                      </div>

                      <div className="text-right">
                        <div className={`font-bold text-sm ${themeTokens.textPrimary}`}>
                          ৳{t.amount.toLocaleString()}
                        </div>
                        <div className={`text-[10px] uppercase ${themeTokens.textMuted}`}>
                          {t.payment_method}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-[#21262D]">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${themeTokens.cardRecessed} ${themeTokens.textSecondary}`}>
                        {t.type.replace('_', ' ')}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewingReceipt(t);
                        }}
                        className={`${themeTokens.btnSecondary} px-2.5 py-1 inline-flex items-center gap-1.5 text-xs`}
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
                  <tr className={themeTokens.tableHeader}>
                    <th className="px-4 py-3">Transaction ID</th>
                    <th className="px-4 py-3">User Identity</th>
                    <th className="px-4 py-3">Department &amp; Semester</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Gateway</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Receipt Voucher</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#21262D]">
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className={`px-6 py-12 text-center text-xs font-medium ${themeTokens.textMuted}`}>
                        No transactions found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((t) => (
                      <tr 
                        key={t.id} 
                        onClick={() => setViewingReceipt(t)}
                        className={`${themeTokens.tableRow} group`}
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
                              className={themeTokens.btnGhost}
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span className={`text-[10px] block mt-0.5 ${themeTokens.textMuted}`}>
                            {new Date(t.created_at).toLocaleString()}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <div className={`font-semibold text-xs ${themeTokens.textPrimary}`}>
                            {t.user_name}
                          </div>
                          <div className={`text-[11px] font-mono ${themeTokens.textMuted}`}>
                            {t.student_id ? `Student ID: ${t.student_id}` : 'Faculty Member'}
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <div className={`text-xs font-medium ${themeTokens.textSecondary}`}>
                            {t.department_name}
                          </div>
                          <div className="text-[11px] text-brand font-medium">
                            {t.semester_name}
                          </div>
                        </td>

                        <td className={`px-4 py-3 font-bold text-xs ${themeTokens.textPrimary}`}>
                          ৳{t.amount.toLocaleString()}
                          <span className={`block text-[10px] font-normal uppercase ${themeTokens.textMuted}`}>
                            {t.type.replace('_', ' ')}
                          </span>
                        </td>

                        <td className={`px-4 py-3 text-xs font-medium ${themeTokens.textSecondary}`}>
                          {t.payment_method}
                        </td>

                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
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
                            className={`${themeTokens.btnSecondary} px-2.5 py-1 inline-flex items-center gap-1.5 text-xs`}
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
          <div className={`flex items-center gap-1.5 overflow-x-auto pb-1 p-1 scrollbar-none ${themeTokens.tabTrack}`}>
            {departments.map((dept) => {
              const isSelected = activeDeptTab === dept.id;
              return (
                <button
                  key={dept.id}
                  onClick={() => setActiveDeptTab(dept.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-2 ${
                    isSelected
                      ? themeTokens.tabActive
                      : themeTokens.tabInactive
                  }`}
                >
                  <span className="font-bold uppercase font-mono">{dept.code}</span>
                  <span className="opacity-80 font-normal">({dept.name})</span>
                </button>
              );
            })}
          </div>

          {/* Department Collection Efficiency Banner */}
          <div className={`p-5 ${themeTokens.card}`}>
            <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b ${themeTokens.border}`}>
              <div>
                <span className="text-[10px] font-bold uppercase text-brand tracking-wider bg-brand/10 border border-brand/20 px-2 py-0.5 rounded-md font-mono">
                  {currentDeptObj.code} Fiscal Efficiency
                </span>
                <h2 className={`text-xl font-bold mt-1 ${themeTokens.textPrimary}`}>
                  {currentDeptObj.name}
                </h2>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleExportDepartmentCSV}
                  className={`${themeTokens.btnSecondary} px-3 py-1.5 text-xs flex items-center gap-1.5`}
                >
                  <Download className="w-3.5 h-3.5" /> Export Department Summary (CSV)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4">
              <div className={`p-3 rounded-xl border ${themeTokens.cardRecessed}`}>
                <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${themeTokens.textMuted}`}>Total Fee Target</p>
                <h3 className={`text-lg font-bold ${themeTokens.textPrimary}`}>
                  ৳{currentDeptProgress.target.toLocaleString()}
                </h3>
              </div>
              <div className={`p-3 rounded-xl border ${themeTokens.cardRecessed}`}>
                <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${themeTokens.textMuted}`}>Tuition Collected</p>
                <h3 className="text-lg font-bold text-emerald-500 dark:text-emerald-400">
                  ৳{currentDeptProgress.collected.toLocaleString()}
                </h3>
              </div>
              <div className={`p-3 rounded-xl border ${themeTokens.cardRecessed}`}>
                <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${themeTokens.textMuted}`}>Pending Balance</p>
                <h3 className="text-lg font-bold text-rose-500 dark:text-rose-400">
                  ৳{currentDeptProgress.pending.toLocaleString()}
                </h3>
              </div>
              <div className={`p-3 rounded-xl border ${themeTokens.cardRecessed}`}>
                <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${themeTokens.textMuted}`}>Collection Efficiency</p>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-brand">{currentDeptProgress.percentage}%</h3>
                  <div className="flex-1 h-2 bg-slate-200 dark:bg-[#21262D] rounded-full overflow-hidden">
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
            <h3 className={`text-xs font-bold uppercase tracking-wider ${themeTokens.textSecondary}`}>
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
                  className={`overflow-hidden ${themeTokens.card}`}
                >
                  <div 
                    onClick={() => setExpandedSemester(isExpanded ? null : semName)}
                    className="p-3.5 sm:p-4 flex items-center justify-between cursor-pointer hover:bg-slate-100/50 dark:hover:bg-[#161B22]/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-brand/10 border border-brand/20 text-brand font-bold text-xs flex items-center justify-center font-mono">
                        {semName.split(' ')[0]}
                      </span>
                      <div>
                        <h4 className={`font-bold text-xs ${themeTokens.textPrimary}`}>
                          {semName}
                        </h4>
                        <p className={`text-[11px] ${themeTokens.textMuted}`}>
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
                      {isExpanded ? <ChevronUp className={`w-4 h-4 ${themeTokens.textMuted}`} /> : <ChevronDown className={`w-4 h-4 ${themeTokens.textMuted}`} />}
                    </div>
                  </div>

                  {/* Accordion Content */}
                  {isExpanded && (
                    <div className={`border-t ${themeTokens.border} p-3 sm:p-4 ${themeTokens.subtle}`}>
                      {semTxns.length === 0 ? (
                        <p className={`text-xs text-center py-3 font-medium ${themeTokens.textMuted}`}>
                          No student payments recorded for {semName} in {currentDeptObj.name}.
                        </p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className={`border-b ${themeTokens.border} ${themeTokens.textMuted} text-[10px] font-bold uppercase tracking-wider`}>
                                <th className="pb-2">Student Name</th>
                                <th className="pb-2">Student ID</th>
                                <th className="pb-2">Amount</th>
                                <th className="pb-2">Gateway</th>
                                <th className="pb-2">Status</th>
                                <th className="pb-2 text-right">Receipt</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-[#21262D] text-xs">
                              {semTxns.map((t) => (
                                <tr key={t.id} className={themeTokens.tableRow}>
                                  <td className={`py-2.5 font-semibold ${themeTokens.textPrimary}`}>{t.user_name}</td>
                                  <td className={`py-2.5 font-mono text-[11px] ${themeTokens.textMuted}`}>{t.student_id || 'N/A'}</td>
                                  <td className={`py-2.5 font-bold ${themeTokens.textPrimary}`}>৳{t.amount.toLocaleString()}</td>
                                  <td className={`py-2.5 font-medium ${themeTokens.textSecondary}`}>{t.payment_method}</td>
                                  <td className="py-2.5">
                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
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
          <div className="p-8 text-center rounded-2xl border border-dashed border-slate-300 dark:border-[#30363D] bg-slate-50/50 dark:bg-[#0d1117] max-w-xl mx-auto my-8">
            <div className="w-12 h-12 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center mx-auto mb-4 text-brand dark:text-[#60A5FA]">
              <Crown className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-[#F0F6FC] mb-1">
              Super Admin Authority Required
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#8D96A0] leading-relaxed mb-4">
              Institutional faculty salary disbursements and corporate banking transfers are restricted to the central Super Administrator.
              As {adminDepartmentName || 'Department'} Administrator, you have full oversight over student fee collections and clearances under the <strong>Department Breakdown</strong> tab.
            </p>
            <button
              onClick={() => setActiveTab('departments')}
              className={`px-4 py-2 ${themeTokens.btnHero} text-xs font-bold cursor-pointer`}
            >
              Go to Department Tuition Ledger
            </button>
          </div>
        ) : (
          <div className="space-y-4">
          {/* Month Cycle Navigation & Actions */}
          <div className={`p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 ${themeTokens.card}`}>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <span className={`text-[10px] font-bold uppercase tracking-wider mr-1 ${themeTokens.textMuted}`}>Payroll Cycle:</span>
              {MONTH_CYCLES.map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMonth(m)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                    selectedMonth === m
                      ? themeTokens.tabActive
                      : themeTokens.tabInactive
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportPayrollCSV}
                className={`${themeTokens.btnSecondary} px-3.5 py-2 text-xs flex items-center gap-1.5`}
              >
                <Download className="w-3.5 h-3.5" /> Export Payroll (CSV)
              </button>

              <button
                onClick={() => setIsBulkDisburseOpen(true)}
                disabled={payrollSummary.pendingCount === 0}
                className={`${themeTokens.btnHero} px-3.5 py-2 text-xs flex items-center gap-1.5 disabled:opacity-40`}
              >
                <DollarSign className="w-3.5 h-3.5" /> Disburse All Pending ({payrollSummary.pendingCount})
              </button>
            </div>
          </div>

          {/* Payroll Cycle Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <SpotlightCard className={`p-4 ${themeTokens.card}`} spotlightColor="rgba(99, 102, 241, 0.15)">
              <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${themeTokens.textMuted}`}>Total Faculty Budget</p>
              <h3 className={`text-xl font-bold ${themeTokens.textPrimary}`}>
                ৳<CountUp to={payrollSummary.totalBudget} duration={0.8} />
              </h3>
              <p className={`text-[11px] mt-1 ${themeTokens.textMuted}`}>Total allocations for {selectedMonth}</p>
            </SpotlightCard>

            <SpotlightCard className={`p-4 ${themeTokens.card}`} spotlightColor="rgba(16, 185, 129, 0.15)">
              <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${themeTokens.textMuted}`}>Disbursed Wages</p>
              <h3 className="text-xl font-bold text-emerald-500 dark:text-emerald-400">
                ৳<CountUp to={payrollSummary.disbursed} duration={0.8} />
              </h3>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">Disbursed into faculty bank accounts</p>
            </SpotlightCard>

            <SpotlightCard className={`p-4 ${themeTokens.card}`} spotlightColor="rgba(245, 158, 11, 0.15)">
              <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${themeTokens.textMuted}`}>Pending Disbursements</p>
              <h3 className="text-xl font-bold text-amber-500 dark:text-amber-400">
                ৳<CountUp to={payrollSummary.pending} duration={0.8} />
              </h3>
              <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-1">
                {payrollSummary.pendingCount} faculty member{payrollSummary.pendingCount !== 1 ? 's' : ''} awaiting payout
              </p>
            </SpotlightCard>
          </div>

          {/* Faculty Salary Data: Mobile Cards + Desktop Table */}
          <div className={`overflow-hidden shadow-sm ${themeTokens.card}`}>
            {/* Mobile View: Cards */}
            <div className="block md:hidden divide-y divide-slate-100 dark:divide-[#21262D]">
              {currentMonthWages.length === 0 ? (
                <div className={`px-6 py-12 text-center text-xs font-medium ${themeTokens.textMuted}`}>
                  No faculty wages registered for {selectedMonth}.
                </div>
              ) : (
                currentMonthWages.map((wage) => (
                  <div 
                    key={wage.id}
                    onClick={() => setViewingSalarySlip(wage)}
                    className="p-4 space-y-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-[#161B22]/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className={`font-bold text-xs ${themeTokens.textPrimary}`}>
                          {wage.teacher_name}
                        </div>
                        <div className={`text-[11px] font-mono ${themeTokens.textMuted}`}>
                          {wage.teacher_code} • {wage.department_name}
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border shrink-0 ${
                        wage.status === 'Disbursed'
                          ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/20'
                      }`}>
                        {wage.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className={`text-[10px] block ${themeTokens.textMuted}`}>Base</span>
                        <span className="font-semibold text-xs">৳{wage.base_amount.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className={`text-[10px] block text-emerald-500`}>Allowances</span>
                        <span className="font-semibold text-xs text-emerald-600 dark:text-emerald-400">+৳{wage.allowances.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className={`text-[10px] block text-rose-500`}>Deductions</span>
                        <span className="font-semibold text-xs text-rose-600 dark:text-rose-400">-৳{wage.deductions.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-[#21262D]">
                      <div>
                        <span className={`text-[10px] block ${themeTokens.textMuted}`}>Net Amount</span>
                        <span className={`font-bold text-sm ${themeTokens.textPrimary}`}>৳{wage.net_amount.toLocaleString()}</span>
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
                            className={`${themeTokens.btnSecondary} px-3 py-1.5 text-xs rounded-xl`}
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
                  <tr className={themeTokens.tableHeader}>
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
                <tbody className="divide-y divide-slate-100 dark:divide-[#21262D]">
                  {currentMonthWages.length === 0 ? (
                    <tr>
                      <td colSpan={8} className={`px-6 py-12 text-center text-xs font-medium ${themeTokens.textMuted}`}>
                        No faculty wages registered for {selectedMonth}.
                      </td>
                    </tr>
                  ) : (
                    currentMonthWages.map((wage) => (
                      <tr 
                        key={wage.id}
                        onClick={() => setViewingSalarySlip(wage)}
                        className={themeTokens.tableRow}
                      >
                        <td className="px-4 py-3">
                          <div className={`font-semibold text-xs ${themeTokens.textPrimary}`}>
                            {wage.teacher_name}
                          </div>
                          <div className={`text-[11px] font-mono ${themeTokens.textMuted}`}>
                            {wage.teacher_code}
                          </div>
                        </td>

                        <td className={`px-4 py-3 text-xs font-medium ${themeTokens.textSecondary}`}>
                          {wage.department_name}
                        </td>

                        <td className={`px-4 py-3 text-xs font-medium ${themeTokens.textSecondary}`}>
                          ৳{wage.base_amount.toLocaleString()}
                        </td>

                        <td className="px-4 py-3 text-xs font-medium text-emerald-500 dark:text-emerald-400">
                          +৳{wage.allowances.toLocaleString()}
                        </td>

                        <td className="px-4 py-3 text-xs font-medium text-rose-500 dark:text-rose-400">
                          -৳{wage.deductions.toLocaleString()}
                        </td>

                        <td className={`px-4 py-3 font-bold text-xs ${themeTokens.textPrimary}`}>
                          ৳{wage.net_amount.toLocaleString()}
                        </td>

                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
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
                                className={`${themeTokens.btnSecondary} px-2.5 py-1 text-xs`}
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
        <div className={themeTokens.modalOverlay}>
          <div className={`w-full max-w-lg p-6 ${themeTokens.modalBox}`}>
            {/* Voucher Header with UniCampus Branding */}
            <div className={`flex items-center justify-between pb-3.5 border-b ${themeTokens.border} mb-5`}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-brand text-white flex items-center justify-center font-bold text-sm">
                  U
                </div>
                <div>
                  <h3 className={`text-sm font-bold ${themeTokens.textPrimary}`}>UniCampus Treasury</h3>
                  <p className={`text-[10px] font-semibold uppercase tracking-wider ${themeTokens.textMuted}`}>Official Digital Receipt</p>
                </div>
              </div>
              <button onClick={() => setViewingReceipt(null)} className={themeTokens.btnGhost}>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Receipt Summary Card */}
            <div className={`p-4 rounded-xl border mb-5 text-center ${themeTokens.cardRecessed}`}>
              <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${themeTokens.textMuted}`}>Receipt Number</span>
              <h2 className="text-xl font-bold font-mono text-brand mb-2">{viewingReceipt.receipt_number}</h2>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20">
                <Check className="w-3 h-3" /> Status: {viewingReceipt.status}
              </div>
            </div>

            {/* Itemized Details */}
            <div className="space-y-2 text-xs mb-5">
              <div className={`flex justify-between py-1.5 border-b ${themeTokens.border}`}>
                <span className={themeTokens.textMuted}>Transaction Reference:</span>
                <span className={`font-mono font-bold ${themeTokens.textPrimary}`}>{viewingReceipt.transaction_id}</span>
              </div>
              <div className={`flex justify-between py-1.5 border-b ${themeTokens.border}`}>
                <span className={themeTokens.textMuted}>Recipient / Payer:</span>
                <span className={`font-semibold ${themeTokens.textPrimary}`}>{viewingReceipt.user_name}</span>
              </div>
              {viewingReceipt.student_id && (
                <div className={`flex justify-between py-1.5 border-b ${themeTokens.border}`}>
                  <span className={themeTokens.textMuted}>Student ID:</span>
                  <span className={`font-mono font-semibold ${themeTokens.textPrimary}`}>{viewingReceipt.student_id}</span>
                </div>
              )}
              <div className={`flex justify-between py-1.5 border-b ${themeTokens.border}`}>
                <span className={themeTokens.textMuted}>Academic Department:</span>
                <span className={`font-semibold ${themeTokens.textPrimary}`}>{viewingReceipt.department_name}</span>
              </div>
              <div className={`flex justify-between py-1.5 border-b ${themeTokens.border}`}>
                <span className={themeTokens.textMuted}>Ordinal Semester:</span>
                <span className="font-bold text-brand">{viewingReceipt.semester_name}</span>
              </div>
              <div className={`flex justify-between py-1.5 border-b ${themeTokens.border}`}>
                <span className={themeTokens.textMuted}>Payment Gateway:</span>
                <span className={`font-semibold ${themeTokens.textPrimary}`}>{viewingReceipt.payment_method}</span>
              </div>
              <div className={`flex justify-between py-1.5 border-b ${themeTokens.border}`}>
                <span className={themeTokens.textMuted}>Date &amp; Timestamp:</span>
                <span className={themeTokens.textSecondary}>{new Date(viewingReceipt.created_at).toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 text-sm font-bold pt-2">
                <span className={themeTokens.textPrimary}>Total Settled Amount:</span>
                <span className="text-brand">৳{viewingReceipt.amount.toLocaleString()} BDT</span>
              </div>
            </div>

            <div className={`flex justify-end gap-2.5 pt-4 border-t ${themeTokens.border}`}>
              <button
                onClick={() => copyToClipboard(viewingReceipt.transaction_id, "TXN ID")}
                className={`${themeTokens.btnSecondary} px-3.5 py-1.5 text-xs flex items-center gap-1.5`}
              >
                <Copy className="w-3.5 h-3.5" /> Copy TXN ID
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className={`${themeTokens.btnHero} px-3.5 py-1.5 text-xs flex items-center gap-1.5`}
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
        <div className={themeTokens.modalOverlay}>
          <div className={`w-full max-w-lg p-6 ${themeTokens.modalBox}`}>
            <div className={`flex items-center justify-between pb-3.5 border-b ${themeTokens.border} mb-5`}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-brand text-white flex items-center justify-center font-bold text-sm">
                  U
                </div>
                <div>
                  <h3 className={`text-sm font-bold ${themeTokens.textPrimary}`}>Faculty Salary Voucher</h3>
                  <p className={`text-[10px] font-semibold uppercase tracking-wider ${themeTokens.textMuted}`}>{viewingSalarySlip.month}</p>
                </div>
              </div>
              <button onClick={() => setViewingSalarySlip(null)} className={themeTokens.btnGhost}>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Teacher Details */}
            <div className={`p-3.5 rounded-xl border mb-5 ${themeTokens.cardRecessed}`}>
              <h4 className={`font-bold text-sm ${themeTokens.textPrimary}`}>{viewingSalarySlip.teacher_name}</h4>
              <p className={`text-xs mt-0.5 ${themeTokens.textMuted}`}>{viewingSalarySlip.department_name} • Faculty Code: {viewingSalarySlip.teacher_code}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                  viewingSalarySlip.status === 'Disbursed' 
                    ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20' 
                    : 'bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/20'
                }`}>
                  Status: {viewingSalarySlip.status}
                </span>
                {viewingSalarySlip.transaction_id && (
                  <span className={`text-[10px] font-mono ${themeTokens.textMuted}`}>Ref: {viewingSalarySlip.transaction_id}</span>
                )}
              </div>
            </div>

            {/* Salary Calculation Breakdown */}
            <div className="space-y-2 text-xs mb-5">
              <div className={`flex justify-between py-1.5 border-b ${themeTokens.border}`}>
                <span className={themeTokens.textMuted}>Base Monthly Compensation:</span>
                <span className={`font-bold ${themeTokens.textPrimary}`}>৳{viewingSalarySlip.base_amount.toLocaleString()}</span>
              </div>
              <div className={`flex justify-between py-1.5 border-b ${themeTokens.border}`}>
                <span className={themeTokens.textMuted}>Academic &amp; Research Allowances:</span>
                <span className="font-semibold text-emerald-500 dark:text-emerald-400">+৳{viewingSalarySlip.allowances.toLocaleString()}</span>
              </div>
              <div className={`flex justify-between py-1.5 border-b ${themeTokens.border}`}>
                <span className={themeTokens.textMuted}>Tax &amp; Provident Fund Deductions:</span>
                <span className="font-semibold text-rose-500 dark:text-rose-400">-৳{viewingSalarySlip.deductions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 text-sm font-bold pt-2">
                <span className={themeTokens.textPrimary}>Net Payable Disbursed:</span>
                <span className="text-brand">৳{viewingSalarySlip.net_amount.toLocaleString()} BDT</span>
              </div>
            </div>

            <div className={`flex justify-end gap-2.5 pt-4 border-t ${themeTokens.border}`}>
              <button
                onClick={() => {
                  window.print();
                }}
                className={`${themeTokens.btnHero} px-3.5 py-1.5 text-xs flex items-center gap-1.5`}
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
        <div className={themeTokens.modalOverlay}>
          <div className={`w-full max-w-md p-6 text-center ${themeTokens.modalBox}`}>
            <div className="w-11 h-11 rounded-xl bg-brand/10 border border-brand/20 text-brand flex items-center justify-center mx-auto mb-3.5">
              <DollarSign className="w-5 h-5" />
            </div>

            <h3 className={`text-base font-bold mb-1 ${themeTokens.textPrimary}`}>
              Disburse All Pending Faculty Wages?
            </h3>
            <p className={`text-xs mb-4 ${themeTokens.textMuted}`}>
              Cycle: <strong className={themeTokens.textPrimary}>{selectedMonth}</strong> • Total Payout: <strong className="text-emerald-500 dark:text-emerald-400">৳{payrollSummary.pending.toLocaleString()} BDT</strong>
            </p>

            <div className="space-y-3 mb-5 text-left">
              <div>
                <label className={`block text-xs font-semibold mb-1 ${themeTokens.textSecondary}`}>
                  Settlement Gateway
                </label>
                <select 
                  value={bulkGateway}
                  onChange={(e) => setBulkGateway(e.target.value as PaymentMethod)}
                  className={`w-full px-3 py-2 font-semibold cursor-pointer ${themeTokens.select}`}
                >
                  <option value="Bank Transfer">Bank Electronic Transfer</option>
                  <option value="bKash">bKash Corporate Payout</option>
                  <option value="Nagad">Nagad Corporate Payout</option>
                </select>
              </div>

              <div className={`p-3 rounded-xl border text-[11px] ${themeTokens.cardRecessed} ${themeTokens.textMuted}`}>
                This action will mark all {payrollSummary.pendingCount} pending teacher wage records as <strong className={themeTokens.textPrimary}>Disbursed</strong> and record individual debit vouchers in the master ledger.
              </div>
            </div>

            <div className="flex justify-center gap-2.5">
              <button
                onClick={() => setIsBulkDisburseOpen(false)}
                className={`${themeTokens.btnSecondary} px-4 py-2`}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBulkDisburse}
                className={`${themeTokens.btnHero} px-4 py-2`}
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
        <div className={themeTokens.modalOverlay}>
          <div className={`w-full max-w-md p-6 text-center ${themeTokens.modalBox}`}>
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 dark:text-amber-400 flex items-center justify-center mx-auto mb-3.5">
              <Send className="w-5 h-5" />
            </div>

            <h3 className={`text-base font-bold mb-1 ${themeTokens.textPrimary}`}>
              Broadcast Due Payment Reminders
            </h3>
            <p className={`text-xs mb-4 ${themeTokens.textMuted}`}>
              {currentDeptObj?.name} • <strong className={themeTokens.textPrimary}>{reminderModalSemester}</strong>
            </p>

            <div className={`p-3 rounded-xl border max-h-48 overflow-y-auto mb-5 space-y-2 text-left ${themeTokens.cardRecessed}`}>
              <p className={`text-[10px] font-bold uppercase tracking-wider ${themeTokens.textMuted}`}>
                Recipients ({overdueStudentsInSelectedSemester.length} students)
              </p>
              {overdueStudentsInSelectedSemester.map(s => (
                <div key={s.id} className="flex justify-between items-center text-xs">
                  <span className={`font-semibold ${themeTokens.textPrimary}`}>{s.user_name} ({s.student_id})</span>
                  <span className="font-mono text-rose-500 dark:text-rose-400 font-bold">৳{s.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-2.5">
              <button
                onClick={() => setReminderModalSemester(null)}
                className={`${themeTokens.btnSecondary} px-4 py-2`}
              >
                Cancel
              </button>
              <button
                onClick={handleSendDueReminders}
                className={`${themeTokens.btnHero} px-4 py-2`}
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

