"use client";

import React from "react";
import { Download, Send, ChevronDown, ChevronUp } from "lucide-react";
import { ORDINAL_SEMESTERS } from "@/lib/mockData";
import type {
  Department,
  OrdinalSemesterName,
  PaymentTransaction,
} from "@/types/admin";
import type { DeptProgressItem } from "./FinanceOverviewTab";

interface SemesterDuesAccordionProps {
  semName: OrdinalSemesterName;
  semTxns: PaymentTransaction[];
  deptName: string;
  isExpanded: boolean;
  onToggle: (sem: OrdinalSemesterName) => void;
  onOpenReminder: (sem: OrdinalSemesterName) => void;
  onViewReceipt: (t: PaymentTransaction) => void;
}

const SemesterDuesAccordion = React.memo(function SemesterDuesAccordion({
  semName,
  semTxns,
  deptName,
  isExpanded,
  onToggle,
  onOpenReminder,
  onViewReceipt,
}: SemesterDuesAccordionProps) {
  const overdueCount = semTxns.filter(
    (t) => t.status === "Pending" || t.status === "Overdue"
  ).length;
  const semTotal = semTxns.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="overflow-hidden rounded-2xl bg-surface border border-line">
      <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-surface-2/50 transition-colors">
        <button
          type="button"
          aria-expanded={isExpanded}
          onClick={() => onToggle(semName)}
          className="flex-1 flex items-center justify-between gap-3 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-lg min-w-0"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-7 h-7 rounded-lg bg-brand-soft border border-brand/20 text-brand font-semibold text-xs flex items-center justify-center font-sans tabular-nums shrink-0">
              {semName.split(" ")[0]}
            </span>
            <div className="min-w-0">
              <h4 className="font-semibold text-xs text-fg truncate">
                {semName}
              </h4>
              <p className="text-xs text-fg-muted tabular-nums">
                {semTxns.length} payment record{semTxns.length !== 1 ? "s" : ""}{" "}
                • Total ৳{semTotal.toLocaleString()}
              </p>
            </div>
          </div>

          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-fg-muted shrink-0" />
          ) : (
            <ChevronDown className="w-4 h-4 text-fg-muted shrink-0" />
          )}
        </button>

        {overdueCount > 0 && (
          <button
            type="button"
            onClick={() => onOpenReminder(semName)}
            className="min-h-[36px] px-2.5 py-1 bg-danger-light border border-danger/30 text-danger rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <Send className="w-3 h-3" />
            Send Reminders ({overdueCount})
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="border-t border-line p-3 sm:p-4 bg-canvas/50">
          {semTxns.length === 0 ? (
            <p className="text-xs text-center py-3 font-medium text-fg-muted">
              No student payments recorded for {semName} in {deptName}.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-line text-fg-muted text-xs font-semibold">
                    <th className="pb-2">Student Name</th>
                    <th className="pb-2">Student ID</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Gateway</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2 text-right">Receipt</th>
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
                          className="hover:underline font-semibold text-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded px-1"
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
});

interface FinanceDepartmentsTabProps {
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
}

export function FinanceDepartmentsTab({
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
}: FinanceDepartmentsTabProps) {
  return (
    <div className="space-y-5">
      {/* Department Selector Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto p-1 scrollbar-none rounded-xl bg-canvas border border-line">
        {departments.map((dept) => {
          const isSelected = activeDeptTab === dept.id;
          return (
            <button
              key={dept.id}
              type="button"
              onClick={() => onSelectDeptTab(dept.id)}
              className={`px-3 py-1.5 rounded-lg text-xs transition-colors shrink-0 flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                isSelected
                  ? "bg-surface text-fg font-semibold border border-line"
                  : "text-fg-muted hover:text-fg font-medium"
              }`}
            >
              <span className="font-semibold font-mono">{dept.code}</span>
              <span className="opacity-80 font-normal">({dept.name})</span>
            </button>
          );
        })}
      </div>

      {/* Department Collection Efficiency Banner */}
      <div className="p-5 rounded-2xl bg-surface border border-line">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-line">
          <div>
            <span className="text-xs font-semibold text-brand bg-brand-soft border border-brand/20 px-2 py-0.5 rounded-md font-sans">
              <span className="font-mono">{currentDeptObj.code}</span> Fiscal Efficiency
            </span>
            <h2 className="text-xl font-semibold mt-1 text-fg">
              {currentDeptObj.name}
            </h2>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onExportDeptCsv}
              className="min-h-[40px] bg-canvas hover:bg-surface-2 text-fg border border-line rounded-xl font-semibold px-3 py-1.5 text-xs flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <Download className="w-3.5 h-3.5" /> Export Department Summary (CSV)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4">
          <div className="p-3 rounded-xl bg-canvas border border-line">
            <p className="text-xs font-semibold mb-1 text-fg-muted">
              Total Fee Target
            </p>
            <h3 className="text-lg font-bold text-fg tabular-nums">
              ৳{currentDeptProgress.target.toLocaleString()}
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-canvas border border-line">
            <p className="text-xs font-semibold mb-1 text-fg-muted">
              Tuition Collected
            </p>
            <h3 className="text-lg font-bold text-success tabular-nums">
              ৳{currentDeptProgress.collected.toLocaleString()}
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-canvas border border-line">
            <p className="text-xs font-semibold mb-1 text-fg-muted">
              Pending Balance
            </p>
            <h3 className="text-lg font-bold text-danger tabular-nums">
              ৳{currentDeptProgress.pending.toLocaleString()}
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-canvas border border-line">
            <p className="text-xs font-semibold mb-1 text-fg-muted">
              Collection Efficiency
            </p>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-brand tabular-nums">
                {currentDeptProgress.percentage}%
              </h3>
              <div className="flex-1 h-2 bg-surface-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand rounded-full"
                  style={{ width: `${currentDeptProgress.percentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Accordion by Ordinal Semester */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-fg-muted">
          Granular Semester Tuition Ledgers (1st Semester to 8th Semester)
        </h3>

        {ORDINAL_SEMESTERS.map((semName) => (
          <SemesterDuesAccordion
            key={semName}
            semName={semName}
            semTxns={departmentTransactions.filter(
              (t) => t.semester_name === semName
            )}
            deptName={currentDeptObj.name}
            isExpanded={expandedSemester === semName}
            onToggle={onToggleSemester}
            onOpenReminder={onOpenReminder}
            onViewReceipt={onViewReceipt}
          />
        ))}
      </div>
    </div>
  );
}
