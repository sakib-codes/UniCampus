"use client";

import React, { useState, useMemo } from "react";
import {
  Download,
  Send,
  ChevronDown,
  ChevronUp,
  Users,
  Receipt,
  Mail,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { ORDINAL_SEMESTERS } from "@/lib/mockData";
import type {
  Department,
  OrdinalSemesterName,
  PaymentTransaction,
} from "@/types/admin";
import type { DeptProgressItem } from "./FinanceOverviewTab";

interface SemesterRowData {
  semName: OrdinalSemesterName;
  semTxns: PaymentTransaction[];
  enrolledStudentsCount: number;
  expectedTuition: number;
  collectedAmount: number;
  outstandingDue: number;
  collectionRate: number;
  overdueCount: number;
}

interface SemesterDuesAccordionProps {
  data: SemesterRowData;
  deptName: string;
  isExpanded: boolean;
  onToggle: (sem: OrdinalSemesterName) => void;
  onOpenReminder: (sem: OrdinalSemesterName) => void;
  onViewReceipt: (t: PaymentTransaction) => void;
}

const SemesterDuesAccordion = React.memo(function SemesterDuesAccordion({
  data,
  deptName,
  isExpanded,
  onToggle,
  onOpenReminder,
  onViewReceipt,
}: SemesterDuesAccordionProps) {
  const {
    semName,
    semTxns,
    enrolledStudentsCount,
    expectedTuition,
    collectedAmount,
    outstandingDue,
    collectionRate,
    overdueCount,
  } = data;

  return (
    <div className="overflow-hidden rounded-2xl bg-surface border border-line">
      <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3.5 hover:bg-surface-2/40 transition-colors">
        <button
          type="button"
          aria-expanded={isExpanded}
          onClick={() => onToggle(semName)}
          className="flex-1 flex items-start sm:items-center justify-between gap-3 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-lg min-w-0"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-8 h-8 rounded-xl bg-brand-soft border border-brand/20 text-brand font-semibold text-xs flex items-center justify-center shrink-0">
              {semName.split(" ")[0]}
            </span>
            <div className="min-w-0">
              <h4 className="font-semibold text-xs text-fg truncate">
                {semName}
              </h4>
              <p className="text-xs text-fg-muted flex items-center gap-2 mt-0.5 tabular-nums">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3 text-fg-muted" />
                  {enrolledStudentsCount} Enrolled
                </span>
                <span>•</span>
                <span>Expected: ৳{expectedTuition.toLocaleString()}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <div className="text-xs font-semibold text-fg tabular-nums">
                Collected: ৳{collectedAmount.toLocaleString()}
              </div>
              <div className="text-xs text-fg-muted tabular-nums">
                Due:{" "}
                <span className={outstandingDue > 0 ? "text-danger font-semibold" : "text-fg-muted"}>
                  ৳{outstandingDue.toLocaleString()}
                </span>
              </div>
            </div>

            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-fg-muted shrink-0" />
            ) : (
              <ChevronDown className="w-4 h-4 text-fg-muted shrink-0" />
            )}
          </div>
        </button>

        {/* Progress & Reminder Action */}
        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-line">
          <div className="w-32 flex items-center gap-2">
            <div className="flex-1 h-2 bg-surface-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand rounded-full transition-colors"
                style={{ width: `${collectionRate}%` }}
              />
            </div>
            <span className="text-xs font-semibold tabular-nums text-brand shrink-0">
              {collectionRate}%
            </span>
          </div>

          {overdueCount > 0 && (
            <button
              type="button"
              onClick={() => onOpenReminder(semName)}
              className="min-h-[36px] px-2.5 py-1 bg-danger-light border border-danger/30 text-danger hover:bg-danger-light/80 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <Send className="w-3 h-3" />
              Remind ({overdueCount})
            </button>
          )}
        </div>
      </div>

      {/* Expanded Student Ledger */}
      {isExpanded && (
        <div className="border-t border-line p-3 sm:p-4 bg-canvas/60">
          {semTxns.length === 0 ? (
            <p className="text-xs text-center py-3 font-medium text-fg-muted">
              No fee transactions currently logged for {semName} in {deptName}. All enrolled students are clear or on payment schedules.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-line text-fg-muted text-xs font-semibold">
                    <th className="pb-2.5">Student Name</th>
                    <th className="pb-2.5">Student ID</th>
                    <th className="pb-2.5">Classification</th>
                    <th className="pb-2.5">Amount</th>
                    <th className="pb-2.5">Gateway</th>
                    <th className="pb-2.5">Payment Status</th>
                    <th className="pb-2.5 text-right">Receipt Voucher</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line text-xs">
                  {semTxns.map((t) => (
                    <tr
                      key={t.id}
                      className="hover:bg-surface-2/60 border-b border-line transition-colors"
                    >
                      <td className="py-2.5 font-semibold text-fg">
                        {t.user_name}
                      </td>
                      <td className="py-2.5 font-mono text-xs text-fg-muted">
                        {t.student_id || "N/A"}
                      </td>
                      <td className="py-2.5">
                        <span className="px-2 py-0.5 rounded-lg bg-surface border border-line text-fg-muted font-medium text-xs">
                          {t.type === "late_fine" ? "Late Fine" : "Tuition Fee"}
                        </span>
                      </td>
                      <td className="py-2.5 font-semibold tabular-nums text-fg">
                        ৳{t.amount.toLocaleString()}
                      </td>
                      <td className="py-2.5 font-medium text-fg-muted">
                        {t.payment_method}
                      </td>
                      <td className="py-2.5">
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
                      <td className="py-2.5 text-right font-mono text-brand">
                        <button
                          type="button"
                          onClick={() => onViewReceipt(t)}
                          className="hover:underline font-semibold text-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded px-1 inline-flex items-center gap-1"
                          aria-label={`View receipt ${t.receipt_number}`}
                        >
                          <Receipt className="w-3 h-3 text-brand" />
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
});

interface SemesterDuesTabProps {
  departments: Department[];
  activeDeptTab: string;
  onSelectDeptTab: (deptId: string) => void;
  currentDeptObj: Department;
  currentDeptProgress: DeptProgressItem;
  departmentTransactions: PaymentTransaction[];
  expandedSemester: OrdinalSemesterName | null;
  onToggleSemester: (sem: OrdinalSemesterName) => void;
  onOpenReminder: (sem: OrdinalSemesterName) => void;
  onExportDeptCsv: () => void;
  onViewReceipt: (t: PaymentTransaction) => void;
  reminderModalSemester: OrdinalSemesterName | null;
  onCloseReminderModal: () => void;
  overdueStudentsInSelectedSemester: PaymentTransaction[];
  onSendDueReminders: (channel: string) => void;
}

export function SemesterDuesTab({
  departments,
  activeDeptTab,
  onSelectDeptTab,
  currentDeptObj,
  currentDeptProgress,
  departmentTransactions,
  expandedSemester,
  onToggleSemester,
  onOpenReminder,
  onExportDeptCsv,
  onViewReceipt,
  reminderModalSemester,
  onCloseReminderModal,
  overdueStudentsInSelectedSemester,
  onSendDueReminders,
}: SemesterDuesTabProps) {
  const [reminderChannel, setReminderChannel] = useState<"all" | "sms" | "email">("all");

  // Compute 1st to 8th Semester metrics
  const semesterBreakdown = useMemo(() => {
    return ORDINAL_SEMESTERS.map((semName) => {
      const semTxns = departmentTransactions.filter(
        (t) => t.semester_name === semName && (t.type === "student_fee" || t.type === "late_fine")
      );

      const paidTxns = semTxns.filter((t) => t.status === "Paid");
      const dueTxns = semTxns.filter((t) => t.status === "Pending" || t.status === "Overdue");

      const collectedAmount = paidTxns.reduce((sum, t) => sum + t.amount, 0);
      const outstandingDue = dueTxns.reduce((sum, t) => sum + t.amount, 0);

      // Estimated expected tuition (target per semester)
      const expectedTuition = collectedAmount + outstandingDue > 0
        ? Math.round((collectedAmount + outstandingDue) * 1.15)
        : 45000;

      // Unique student count
      const uniqueStudents = new Set(
        semTxns.map((t) => t.student_id || t.user_name).filter(Boolean)
      );
      const enrolledStudentsCount = Math.max(uniqueStudents.size, semTxns.length > 0 ? semTxns.length : 18);

      const collectionRate = expectedTuition > 0
        ? Math.min(100, Math.round((collectedAmount / expectedTuition) * 100))
        : 100;

      return {
        semName,
        semTxns,
        enrolledStudentsCount,
        expectedTuition,
        collectedAmount,
        outstandingDue,
        collectionRate,
        overdueCount: dueTxns.length,
      };
    });
  }, [departmentTransactions]);

  const totalOverdueInDept = useMemo(() => {
    return semesterBreakdown.reduce((sum, s) => sum + s.overdueCount, 0);
  }, [semesterBreakdown]);

  return (
    <div className="space-y-5">
      {/* Department Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 scrollbar-none rounded-2xl bg-surface border border-line">
        {departments.map((dept) => {
          const isSelected = activeDeptTab === dept.id;
          return (
            <button
              key={dept.id}
              type="button"
              onClick={() => onSelectDeptTab(dept.id)}
              className={`px-3.5 py-2 rounded-xl text-xs transition-colors shrink-0 flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                isSelected
                  ? "bg-surface-2 text-fg font-semibold border border-line"
                  : "text-fg-muted hover:text-fg font-medium"
              }`}
            >
              <span className="font-semibold font-mono text-brand">{dept.code}</span>
              <span>{dept.name}</span>
            </button>
          );
        })}
      </div>

      {/* Department Fiscal Efficiency Banner */}
      <div className="p-5 rounded-2xl bg-surface border border-line">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-line">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-brand-soft text-brand border border-brand/20 font-mono">
                {currentDeptObj.code}
              </span>
              <span className="text-xs font-semibold text-fg-muted">
                Fiscal Clearance &amp; Due Reconciliation
              </span>
            </div>
            <h2 className="text-xl font-semibold mt-1 text-fg">
              {currentDeptObj.name}
            </h2>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onExportDeptCsv}
              className="min-h-[40px] bg-canvas hover:bg-surface-2 text-fg border border-line rounded-xl font-semibold px-3.5 py-1.5 text-xs flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <Download className="w-3.5 h-3.5" /> Export Department Summary (CSV)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5 pt-4">
          <div className="p-3.5 rounded-xl bg-canvas border border-line">
            <p className="text-xs font-semibold mb-1 text-fg-muted">Total Fee Target</p>
            <h3 className="text-lg font-semibold text-fg tabular-nums">
              ৳{currentDeptProgress.target.toLocaleString()}
            </h3>
          </div>
          <div className="p-3.5 rounded-xl bg-canvas border border-line">
            <p className="text-xs font-semibold mb-1 text-fg-muted">Tuition Collected</p>
            <h3 className="text-lg font-semibold text-success tabular-nums">
              ৳{currentDeptProgress.collected.toLocaleString()}
            </h3>
          </div>
          <div className="p-3.5 rounded-xl bg-canvas border border-line">
            <p className="text-xs font-semibold mb-1 text-fg-muted">Outstanding Due</p>
            <h3 className="text-lg font-semibold text-danger tabular-nums">
              ৳{currentDeptProgress.pending.toLocaleString()}
            </h3>
          </div>
          <div className="p-3.5 rounded-xl bg-canvas border border-line">
            <p className="text-xs font-semibold mb-1 text-fg-muted">Collection Efficiency</p>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-brand tabular-nums">
                {currentDeptProgress.percentage}%
              </h3>
              <div className="flex-1 h-2 bg-surface-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand rounded-full transition-colors"
                  style={{ width: `${currentDeptProgress.percentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Accordion by Ordinal Semester (1st to 8th Semester) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-fg-muted">
            Semester-Wise Due vs. Collected Ledger (1st Semester to 8th Semester)
          </h3>
          <span className="text-xs text-fg-muted">
            {totalOverdueInDept} pending / overdue balance{totalOverdueInDept !== 1 ? "s" : ""} in {currentDeptObj.code}
          </span>
        </div>

        {semesterBreakdown.map((semData) => (
          <SemesterDuesAccordion
            key={semData.semName}
            data={semData}
            deptName={currentDeptObj.name}
            isExpanded={expandedSemester === semData.semName}
            onToggle={onToggleSemester}
            onOpenReminder={onOpenReminder}
            onViewReceipt={onViewReceipt}
          />
        ))}
      </div>

      {/* Send Due Reminder Modal */}
      <Modal
        open={Boolean(reminderModalSemester)}
        onClose={onCloseReminderModal}
        size="md"
        title={
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-warning-light border border-warning/20 text-warning flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-fg">
                Broadcast Due Payment Reminders
              </h3>
              <p className="text-xs font-medium text-fg-muted">
                {currentDeptObj.name} • {reminderModalSemester}
              </p>
            </div>
          </div>
        }
        description="Notify students with outstanding tuition dues via official campus channels."
        footer={
          <div className="flex items-center justify-end gap-2.5 w-full">
            <button
              type="button"
              onClick={onCloseReminderModal}
              className="min-h-[40px] px-4 py-2 rounded-xl bg-canvas hover:bg-surface-2 text-fg border border-line text-xs font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onSendDueReminders(reminderChannel)}
              className="min-h-[40px] px-4 py-2 rounded-xl bg-brand text-on-brand hover:bg-brand-hover text-xs font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              Dispatch Reminders ({overdueStudentsInSelectedSemester.length})
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          {/* Dispatch Channel Options */}
          <div>
            <label
              htmlFor="reminder-channel-select"
              className="block text-xs font-semibold text-fg-muted mb-1.5"
            >
              Dispatch Channel
            </label>
            <select
              id="reminder-channel-select"
              value={reminderChannel}
              onChange={(e) => setReminderChannel(e.target.value as "all" | "sms" | "email")}
              className="w-full min-h-[40px] px-3 py-2 rounded-xl bg-canvas border border-line text-xs font-semibold text-fg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <option value="all">Multichannel (SMS Gateway + Student Portal In-App + Email)</option>
              <option value="sms">SMS Gateway Only (Urgent Overdue Notice)</option>
              <option value="email">Institutional Email Notification</option>
            </select>
          </div>

          {/* Student Recipient List */}
          <div className="p-3 rounded-xl bg-canvas border border-line max-h-48 overflow-y-auto space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-fg-muted pb-1 border-b border-line">
              <span>Recipients ({overdueStudentsInSelectedSemester.length} students)</span>
              <span>Amount Due</span>
            </div>
            {overdueStudentsInSelectedSemester.map((s) => (
              <div
                key={s.id}
                className="flex justify-between items-center text-xs gap-2 py-1"
              >
                <div className="min-w-0">
                  <span className="font-semibold text-fg truncate block">
                    {s.user_name}
                  </span>
                  <span className="font-mono text-xs text-fg-muted">
                    {s.student_id || "N/A"} • {s.payment_method}
                  </span>
                </div>
                <span className="tabular-nums text-danger font-semibold shrink-0">
                  ৳{s.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {/* Message Preview */}
          <div className="p-3 rounded-xl bg-surface border border-line text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-fg-muted font-semibold">
              <Mail className="w-3.5 h-3.5 text-brand" />
              Template Preview
            </div>
            <p className="text-fg leading-relaxed">
              &quot;Dear Student, your semester fee payment for <strong>{reminderModalSemester}</strong> is currently pending. Please settle through bKash, SSLCommerz, or university bank counters to avoid academic holds.&quot;
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
