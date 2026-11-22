"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Download,
  Copy,
  Receipt,
  PlusCircle,
  Calendar,
  X,
  Printer,
  CheckCircle2,
  Filter,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { adminService } from "@/lib/services/adminService";
import { ORDINAL_SEMESTERS } from "@/lib/mockData";
import type {
  Department,
  OrdinalSemesterName,
  PaymentMethod,
  PaymentTransaction,
  TransactionType,
} from "@/types/admin";

interface TransactionItemProps {
  t: PaymentTransaction;
  formatTransactionType: (type: string) => string;
  onViewReceipt: (t: PaymentTransaction) => void;
  onCopy: (text: string, label: string) => void;
}

export const TransactionRow = React.memo(function TransactionRow({
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
        <div className="text-xs font-medium text-fg-muted">{t.department_name}</div>
        <div className="text-xs text-brand font-medium">{t.semester_name}</div>
      </td>

      <td className="px-4 py-3 font-semibold tabular-nums text-xs text-fg">
        ৳{t.amount.toLocaleString()}
        <span className="block text-xs font-normal text-fg-muted">
          {formatTransactionType(t.type)}
        </span>
      </td>

      <td className="px-4 py-3 text-xs font-medium text-fg-muted">{t.payment_method}</td>

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

export const TransactionCard = React.memo(function TransactionCard({
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
          <div className="font-semibold text-sm text-fg tabular-nums">
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

export interface OfficialReceiptModalProps {
  receipt: PaymentTransaction | null;
  open: boolean;
  onClose: () => void;
  onCopy: (text: string, label: string) => void;
}

export function OfficialReceiptModal({
  receipt,
  open,
  onClose,
  onCopy,
}: OfficialReceiptModalProps) {
  if (!receipt) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      title={
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand text-on-brand flex items-center justify-center font-semibold text-sm">
            U
          </div>
          <div>
            <h3 className="text-sm font-semibold text-fg">UniCampus Treasury</h3>
            <p className="text-xs font-medium text-fg-muted">Official Digital Receipt</p>
          </div>
        </div>
      }
      footer={
        <div className="flex items-center justify-end gap-2.5 w-full">
          <button
            type="button"
            onClick={() => onCopy(receipt.transaction_id, "TXN ID")}
            className="min-h-[40px] bg-canvas hover:bg-surface-2 text-fg border border-line rounded-xl font-semibold px-3.5 py-1.5 text-xs flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <Copy className="w-3.5 h-3.5" /> Copy TXN ID
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="min-h-[40px] bg-brand text-on-brand hover:bg-brand-hover rounded-xl font-semibold px-4 py-1.5 text-xs flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <Printer className="w-3.5 h-3.5" /> Print Receipt
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-canvas border border-line text-center">
          <span className="text-xs font-semibold block mb-1 text-fg-muted">Receipt Number</span>
          <h2 className="text-xl font-semibold font-mono text-brand mb-2">
            {receipt.receipt_number}
          </h2>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-success-light text-success border border-success/20">
            <CheckCircle2 className="w-3 h-3" /> Status: {receipt.status}
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between py-1.5 border-b border-line gap-2">
            <span className="text-fg-muted">Transaction Reference:</span>
            <span className="font-mono font-semibold text-fg">{receipt.transaction_id}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-line gap-2">
            <span className="text-fg-muted">Payer / Recipient:</span>
            <span className="font-semibold text-fg">{receipt.user_name}</span>
          </div>
          {receipt.student_id && (
            <div className="flex justify-between py-1.5 border-b border-line gap-2">
              <span className="text-fg-muted">Student ID:</span>
              <span className="font-mono font-semibold text-fg">{receipt.student_id}</span>
            </div>
          )}
          <div className="flex justify-between py-1.5 border-b border-line gap-2">
            <span className="text-fg-muted">Academic Department:</span>
            <span className="font-semibold text-fg">{receipt.department_name}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-line gap-2">
            <span className="text-fg-muted">Semester:</span>
            <span className="font-semibold text-brand">{receipt.semester_name}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-line gap-2">
            <span className="text-fg-muted">Payment Gateway / Method:</span>
            <span className="font-semibold text-fg">{receipt.payment_method}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-line gap-2">
            <span className="text-fg-muted">Date &amp; Timestamp:</span>
            <span className="text-fg-muted tabular-nums">
              {new Date(receipt.created_at).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between py-2 text-sm font-semibold pt-2 gap-2">
            <span className="text-fg">Total Settled Amount:</span>
            <span className="text-brand tabular-nums">
              ৳{receipt.amount.toLocaleString()} BDT
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
}

interface TransactionsLedgerTabProps {
  transactions: PaymentTransaction[];
  departments: Department[];
  isDeptAdmin?: boolean;
  defaultDepartment?: string;
  formatTransactionType: (type: string) => string;
  onExportCsv: (filtered: PaymentTransaction[]) => void;
  onViewReceipt: (t: PaymentTransaction) => void;
  onCopy: (text: string, label: string) => void;
  onPaymentRecorded?: (t: PaymentTransaction) => void;
}

export function TransactionsLedgerTab({
  transactions,
  departments,
  isDeptAdmin = false,
  defaultDepartment,
  formatTransactionType,
  onExportCsv,
  onViewReceipt,
  onCopy,
  onPaymentRecorded,
}: TransactionsLedgerTabProps) {
  // Filter States
  const [txnSearch, setTxnSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedGateway, setSelectedGateway] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>(
    isDeptAdmin && defaultDepartment ? defaultDepartment : "all"
  );
  const [selectedSemesterFilter, setSelectedSemesterFilter] = useState<string>("all");
  const [dateRangePreset, setDateRangePreset] = useState<string>("all");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  // Counter Payment Modal state
  const [isCollectModalOpen, setIsCollectModalOpen] = useState(false);
  const [counterStudentName, setCounterStudentName] = useState("");
  const [counterStudentId, setCounterStudentId] = useState("");
  const [counterDept, setCounterDept] = useState(
    isDeptAdmin && defaultDepartment
      ? defaultDepartment
      : departments[0]?.name || "Computer Science & Engineering"
  );
  const [counterSemester, setCounterSemester] = useState<OrdinalSemesterName>("1st Semester");
  const [counterFeeType, setCounterFeeType] = useState<TransactionType>("student_fee");
  const [counterAmount, setCounterAmount] = useState<string>("15000");
  const [counterMethod, setCounterMethod] = useState<PaymentMethod>("Bank Transfer");
  const [counterNotes, setCounterNotes] = useState("");

  // Preset Date Handler
  const handlePresetDateChange = (preset: string) => {
    setDateRangePreset(preset);
    const now = new Date();
    const toStr = now.toISOString().slice(0, 10);

    if (preset === "all") {
      setFromDate("");
      setToDate("");
    } else if (preset === "today") {
      setFromDate(toStr);
      setToDate(toStr);
    } else if (preset === "7days") {
      const past = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      setFromDate(past.toISOString().slice(0, 10));
      setToDate(toStr);
    } else if (preset === "month") {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      setFromDate(firstDay.toISOString().slice(0, 10));
      setToDate(toStr);
    } else if (preset === "year") {
      const jan1 = new Date(now.getFullYear(), 0, 1);
      setFromDate(jan1.toISOString().slice(0, 10));
      setToDate(toStr);
    }
  };

  const handleCustomFromChange = (val: string) => {
    setFromDate(val);
    setDateRangePreset("custom");
  };

  const handleCustomToChange = (val: string) => {
    setToDate(val);
    setDateRangePreset("custom");
  };

  const handleClearDates = () => {
    setFromDate("");
    setToDate("");
    setDateRangePreset("all");
  };

  // Filtered transactions calculation
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (selectedType !== "all" && t.type !== selectedType) return false;
      if (selectedGateway !== "all" && t.payment_method !== selectedGateway) return false;
      if (selectedStatus !== "all" && t.status !== selectedStatus) return false;
      if (selectedDeptFilter !== "all" && t.department_name !== selectedDeptFilter) return false;
      if (selectedSemesterFilter !== "all" && t.semester_name !== selectedSemesterFilter) return false;

      // True Date-Wise Filtering
      if (fromDate) {
        const fromLimit = new Date(`${fromDate}T00:00:00`);
        const txnDate = new Date(t.created_at);
        if (txnDate < fromLimit) return false;
      }
      if (toDate) {
        const toLimit = new Date(`${toDate}T23:59:59.999`);
        const txnDate = new Date(t.created_at);
        if (txnDate > toLimit) return false;
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
    selectedSemesterFilter,
    fromDate,
    toDate,
    txnSearch,
  ]);

  // Reconciliation summary bar metrics
  const summaryMetrics = useMemo(() => {
    const totalAmount = filteredTransactions.reduce((acc, t) => acc + t.amount, 0);

    const paidTxns = filteredTransactions.filter((t) => t.status === "Paid");
    const paidAmount = paidTxns.reduce((acc, t) => acc + t.amount, 0);

    const pendingTxns = filteredTransactions.filter((t) => t.status === "Pending");
    const pendingAmount = pendingTxns.reduce((acc, t) => acc + t.amount, 0);

    const overdueTxns = filteredTransactions.filter((t) => t.status === "Overdue");
    const overdueAmount = overdueTxns.reduce((acc, t) => acc + t.amount, 0);

    return {
      totalAmount,
      totalCount: filteredTransactions.length,
      paidCount: paidTxns.length,
      paidAmount,
      pendingCount: pendingTxns.length,
      pendingAmount,
      overdueCount: overdueTxns.length,
      overdueAmount,
    };
  }, [filteredTransactions]);

  // Handle Counter / Manual Fee Collection Submit
  const handleRecordCounterPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(counterAmount) || 0;
    if (parsedAmount <= 0 || !counterStudentName.trim()) return;

    const dateTag = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    const randomReceipt = Math.floor(100000 + Math.random() * 900000);

    const txnId = `TXN-${dateTag}-${randomHex}`;
    const receiptNo = `REC-${randomReceipt}`;

    const newTxn = adminService.createTransaction({
      transaction_id: txnId,
      receipt_number: receiptNo,
      user_name: counterStudentName.trim(),
      student_id: counterStudentId.trim() || null,
      user_id: `user-${Date.now()}`,
      department_name: counterDept,
      semester_name: counterSemester,
      type: counterFeeType,
      amount: parsedAmount,
      payment_method: counterMethod,
      status: "Paid",
    });

    setIsCollectModalOpen(false);
    // Reset form
    setCounterStudentName("");
    setCounterStudentId("");
    setCounterAmount("15000");
    setCounterNotes("");

    if (onPaymentRecorded) {
      onPaymentRecorded(newTxn);
    }
    // Directly open receipt modal for user convenience
    onViewReceipt(newTxn);
  };

  return (
    <div className="space-y-4">
      {/* Top Filter & Actions Panel */}
      <div className="p-4 space-y-4 rounded-2xl bg-surface border border-line">
        {/* Search, Action Buttons */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-muted pointer-events-none" />
            <input
              type="text"
              aria-label="Search transactions by ID, name, or receipt"
              value={txnSearch}
              onChange={(e) => setTxnSearch(e.target.value)}
              placeholder="Search Txn ID, student name, student ID, receipt..."
              className="w-full min-h-[40px] pl-9 pr-8 py-2 font-medium rounded-xl bg-canvas border border-line text-fg placeholder:text-fg-muted text-xs focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-colors duration-150"
            />
            {txnSearch && (
              <button
                type="button"
                onClick={() => setTxnSearch("")}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-fg-muted hover:text-fg p-1 rounded-md"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCollectModalOpen(true)}
              className="min-h-[40px] bg-brand text-on-brand hover:bg-brand-hover rounded-xl font-semibold px-3.5 py-2 flex items-center gap-1.5 text-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Collect Fee (Counter)
            </button>

            <button
              type="button"
              onClick={() => onExportCsv(filteredTransactions)}
              className="min-h-[40px] bg-canvas hover:bg-surface-2 text-fg border border-line rounded-xl font-semibold px-3.5 py-2 flex items-center gap-1.5 text-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV ({filteredTransactions.length})
            </button>
          </div>
        </div>

        {/* Classification Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-line">
          <span className="text-xs font-semibold mr-1 text-fg-muted">Classification:</span>
          {[
            { id: "all", label: "All Types" },
            { id: "student_fee", label: "Student Fees" },
            { id: "teacher_wage", label: "Teacher Wages" },
            { id: "late_fine", label: "Late Fines" },
          ].map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={() => setSelectedType(chip.id)}
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

        {/* Primary Dropdown Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
          {/* Gateway Filter */}
          <div>
            <label
              htmlFor="finance-filter-gateway"
              className="text-xs font-semibold block mb-1 text-fg-muted"
            >
              Gateway Processor
            </label>
            <select
              id="finance-filter-gateway"
              value={selectedGateway}
              onChange={(e) => setSelectedGateway(e.target.value)}
              className="w-full min-h-[40px] px-3 py-1.5 font-semibold cursor-pointer rounded-xl bg-canvas border border-line text-fg text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus:border-brand"
            >
              <option value="all">All Gateways</option>
              <option value="bKash">bKash Tokenized (Sandbox)</option>
              <option value="SSLCommerz">SSLCommerz Hosted (Sandbox)</option>
              <option value="Nagad">Nagad MFS</option>
              <option value="Bank Transfer">Bank Electronic Transfer</option>
              <option value="Card">Credit/Debit Card</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label
              htmlFor="finance-filter-status"
              className="text-xs font-semibold block mb-1 text-fg-muted"
            >
              Payment Status
            </label>
            <select
              id="finance-filter-status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full min-h-[40px] px-3 py-1.5 font-semibold cursor-pointer rounded-xl bg-canvas border border-line text-fg text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus:border-brand"
            >
              <option value="all">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <label
              htmlFor="finance-filter-dept"
              className="text-xs font-semibold block mb-1 text-fg-muted"
            >
              Academic Department
            </label>
            <select
              id="finance-filter-dept"
              value={isDeptAdmin && defaultDepartment ? defaultDepartment : selectedDeptFilter}
              onChange={(e) => setSelectedDeptFilter(e.target.value)}
              disabled={isDeptAdmin}
              className={`w-full min-h-[40px] px-3 py-1.5 font-semibold rounded-xl bg-canvas border border-line text-fg text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus:border-brand ${
                isDeptAdmin ? "opacity-75 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name} ({d.code})
                </option>
              ))}
            </select>
          </div>

          {/* Semester Filter */}
          <div>
            <label
              htmlFor="finance-filter-semester"
              className="text-xs font-semibold block mb-1 text-fg-muted"
            >
              Semester Term
            </label>
            <select
              id="finance-filter-semester"
              value={selectedSemesterFilter}
              onChange={(e) => setSelectedSemesterFilter(e.target.value)}
              className="w-full min-h-[40px] px-3 py-1.5 font-semibold cursor-pointer rounded-xl bg-canvas border border-line text-fg text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus:border-brand"
            >
              <option value="all">All Semesters (1st – 8th)</option>
              {ORDINAL_SEMESTERS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date Filter Strip with Bound Labels */}
        <div className="pt-2 border-t border-line flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-fg-muted flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-brand" /> Date Presets:
            </span>
            {[
              { id: "all", label: "All Time" },
              { id: "today", label: "Today" },
              { id: "7days", label: "Last 7 Days" },
              { id: "month", label: "This Month" },
              { id: "year", label: "This Year" },
            ].map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handlePresetDateChange(preset.id)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                  dateRangePreset === preset.id
                    ? "bg-surface-2 text-fg font-semibold border border-line"
                    : "text-fg-muted hover:text-fg font-medium"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              <label
                htmlFor="finance-from-date"
                className="text-xs font-semibold text-fg-muted shrink-0"
              >
                From
              </label>
              <input
                id="finance-from-date"
                type="date"
                value={fromDate}
                onChange={(e) => handleCustomFromChange(e.target.value)}
                className="min-h-[36px] px-2.5 py-1 text-xs rounded-xl bg-canvas border border-line text-fg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <label
                htmlFor="finance-to-date"
                className="text-xs font-semibold text-fg-muted shrink-0"
              >
                To
              </label>
              <input
                id="finance-to-date"
                type="date"
                value={toDate}
                onChange={(e) => handleCustomToChange(e.target.value)}
                className="min-h-[36px] px-2.5 py-1 text-xs rounded-xl bg-canvas border border-line text-fg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              />
            </div>

            {(fromDate || toDate) && (
              <button
                type="button"
                onClick={handleClearDates}
                className="text-xs font-semibold text-fg-muted hover:text-fg px-2 py-1 rounded-lg bg-canvas border border-line cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                Clear Dates
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Summary Reconciliation Strip */}
      <div className="p-3.5 rounded-2xl bg-surface border border-line flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-brand" />
          <span className="font-semibold text-fg">Reconciliation Summary:</span>
          <span className="text-fg-muted">
            Filtered Total:{" "}
            <strong className="text-fg tabular-nums font-semibold">
              ৳{summaryMetrics.totalAmount.toLocaleString()} BDT
            </strong>{" "}
            ({summaryMetrics.totalCount} records)
          </span>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-success-light border border-success/20 text-success font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            Paid: {summaryMetrics.paidCount} (৳{summaryMetrics.paidAmount.toLocaleString()})
          </span>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-warning-light border border-warning/20 text-warning font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-warning" />
            Pending: {summaryMetrics.pendingCount} (৳{summaryMetrics.pendingAmount.toLocaleString()})
          </span>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-danger-light border border-danger/20 text-danger font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-danger" />
            Overdue: {summaryMetrics.overdueCount} (৳{summaryMetrics.overdueAmount.toLocaleString()})
          </span>
        </div>
      </div>

      {/* Transactions Data Container */}
      <div className="overflow-hidden rounded-2xl bg-surface border border-line">
        {/* Mobile View: Cards */}
        <div className="block md:hidden divide-y divide-line">
          {filteredTransactions.length === 0 ? (
            <div className="px-6 py-12 text-center text-xs font-medium text-fg-muted">
              No transactions match the selected filters or date range.
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
              <tr className="bg-canvas text-xs font-semibold text-fg-muted border-b border-line">
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
                    No transactions match the selected filters or date range.
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

      {/* Counter Fee Collection Modal */}
      <Modal
        open={isCollectModalOpen}
        onClose={() => setIsCollectModalOpen(false)}
        size="md"
        title={
          <div className="flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-brand" />
            <span className="text-sm font-semibold text-fg">
              Counter Fee Collection (Physical / Manual Receipt)
            </span>
          </div>
        }
        description="Record on-the-spot fee collection at the university accounts counter. Immediately generates a verifiable digital receipt."
      >
        <form onSubmit={handleRecordCounterPayment} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="counter-student-name"
                className="block text-xs font-semibold text-fg-muted mb-1"
              >
                Student Full Name *
              </label>
              <input
                id="counter-student-name"
                type="text"
                required
                value={counterStudentName}
                onChange={(e) => setCounterStudentName(e.target.value)}
                placeholder="e.g. Sakib Al Hasan"
                className="w-full min-h-[40px] px-3 py-2 rounded-xl bg-canvas border border-line text-xs text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              />
            </div>

            <div>
              <label
                htmlFor="counter-student-id"
                className="block text-xs font-semibold text-fg-muted mb-1"
              >
                Student ID
              </label>
              <input
                id="counter-student-id"
                type="text"
                value={counterStudentId}
                onChange={(e) => setCounterStudentId(e.target.value)}
                placeholder="e.g. STU-2024-001"
                className="w-full min-h-[40px] px-3 py-2 rounded-xl bg-canvas border border-line text-xs text-fg font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="counter-dept"
                className="block text-xs font-semibold text-fg-muted mb-1"
              >
                Academic Department
              </label>
              <select
                id="counter-dept"
                value={isDeptAdmin && defaultDepartment ? defaultDepartment : counterDept}
                onChange={(e) => setCounterDept(e.target.value)}
                disabled={isDeptAdmin}
                className={`w-full min-h-[40px] px-3 py-2 rounded-xl bg-canvas border border-line text-xs font-semibold text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                  isDeptAdmin ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name} ({d.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="counter-semester"
                className="block text-xs font-semibold text-fg-muted mb-1"
              >
                Semester
              </label>
              <select
                id="counter-semester"
                value={counterSemester}
                onChange={(e) => setCounterSemester(e.target.value as OrdinalSemesterName)}
                className="w-full min-h-[40px] px-3 py-2 rounded-xl bg-canvas border border-line text-xs font-semibold text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                {ORDINAL_SEMESTERS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label
                htmlFor="counter-fee-type"
                className="block text-xs font-semibold text-fg-muted mb-1"
              >
                Fee Category
              </label>
              <select
                id="counter-fee-type"
                value={counterFeeType}
                onChange={(e) => setCounterFeeType(e.target.value as TransactionType)}
                className="w-full min-h-[40px] px-3 py-2 rounded-xl bg-canvas border border-line text-xs font-semibold text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <option value="student_fee">Semester Tuition Fee</option>
                <option value="late_fine">Late Fine / Penalty</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="counter-amount"
                className="block text-xs font-semibold text-fg-muted mb-1"
              >
                Amount (BDT) *
              </label>
              <input
                id="counter-amount"
                type="number"
                min="100"
                step="50"
                required
                value={counterAmount}
                onChange={(e) => setCounterAmount(e.target.value)}
                className="w-full min-h-[40px] px-3 py-2 rounded-xl bg-canvas border border-line text-xs text-fg tabular-nums font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              />
            </div>

            <div>
              <label
                htmlFor="counter-method"
                className="block text-xs font-semibold text-fg-muted mb-1"
              >
                Collection Channel
              </label>
              <select
                id="counter-method"
                value={counterMethod}
                onChange={(e) => setCounterMethod(e.target.value as PaymentMethod)}
                className="w-full min-h-[40px] px-3 py-2 rounded-xl bg-canvas border border-line text-xs font-semibold text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <option value="Bank Transfer">Bank Transfer (Cash Desk)</option>
                <option value="bKash">bKash (Counter QR)</option>
                <option value="Nagad">Nagad (Counter QR)</option>
                <option value="SSLCommerz">SSLCommerz POS</option>
                <option value="Card">Card Swipe Terminal</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="counter-notes"
              className="block text-xs font-semibold text-fg-muted mb-1"
            >
              Teller Notes / Reference ID (Optional)
            </label>
            <input
              id="counter-notes"
              type="text"
              value={counterNotes}
              onChange={(e) => setCounterNotes(e.target.value)}
              placeholder="e.g. Counter Desk A2 • Deposit slip #88219"
              className="w-full min-h-[40px] px-3 py-2 rounded-xl bg-canvas border border-line text-xs text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-line">
            <button
              type="button"
              onClick={() => setIsCollectModalOpen(false)}
              className="min-h-[40px] px-4 py-2 rounded-xl bg-canvas hover:bg-surface-2 text-fg border border-line text-xs font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-h-[40px] px-4 py-2 rounded-xl bg-brand text-on-brand hover:bg-brand-hover text-xs font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              Generate Receipt &amp; Post Ledger
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
