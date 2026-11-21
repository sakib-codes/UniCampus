"use client";

import React, { useState } from "react";
import {
  Crown,
  Download,
  DollarSign,
  Printer,
  Calendar,
} from "lucide-react";
import CountUp from "@/components/bits/CountUp";
import { Modal } from "@/components/ui/Modal";
import type { PaymentMethod, TeacherWage } from "@/types/admin";

interface PayrollItemProps {
  wage: TeacherWage;
  onViewSlip: (w: TeacherWage) => void;
  onDisburseSingle: (wageId: string, teacherName: string) => void;
}

export const PayrollRow = React.memo(function PayrollRow({
  wage,
  onViewSlip,
  onDisburseSingle,
}: PayrollItemProps) {
  return (
    <tr
      tabIndex={0}
      onClick={() => onViewSlip(wage)}
      onKeyDown={(e) => {
        if (e.target instanceof HTMLElement && e.target.closest("button, a")) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onViewSlip(wage);
        }
      }}
      className="hover:bg-surface-2/60 border-b border-line transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand"
    >
      <td className="px-4 py-3">
        <div className="font-semibold text-xs text-fg">
          {wage.teacher_name}
        </div>
        <div className="text-xs font-mono text-fg-muted">
          {wage.teacher_code}
        </div>
      </td>

      <td className="px-4 py-3 text-xs font-medium text-fg-muted">
        {wage.department_name}
      </td>

      <td className="px-4 py-3 text-xs font-medium text-fg-muted tabular-nums">
        ৳{wage.base_amount.toLocaleString()}
      </td>

      <td className="px-4 py-3 text-xs font-medium text-success tabular-nums">
        +৳{wage.allowances.toLocaleString()}
      </td>

      <td className="px-4 py-3 text-xs font-medium text-danger tabular-nums">
        -৳{wage.deductions.toLocaleString()}
      </td>

      <td className="px-4 py-3 font-semibold text-xs text-fg tabular-nums">
        ৳{wage.net_amount.toLocaleString()}
      </td>

      <td className="px-4 py-3">
        <span
          className={`px-2 py-0.5 rounded-md text-xs font-semibold border ${
            wage.status === "Disbursed"
              ? "bg-success-light text-success border-success/20"
              : "bg-warning-light text-warning border-warning/20"
          }`}
        >
          {wage.status}
        </span>
      </td>

      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-1.5">
          {wage.status === "Pending" ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDisburseSingle(wage.id, wage.teacher_name);
              }}
              className="px-2.5 py-1 bg-success hover:opacity-90 text-on-brand rounded-xl text-xs font-semibold transition-opacity cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              Disburse
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onViewSlip(wage);
              }}
              className="bg-canvas hover:bg-surface-2 text-fg border border-line rounded-xl font-semibold px-2.5 py-1 text-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              Salary Slip
            </button>
          )}
        </div>
      </td>
    </tr>
  );
});

export const PayrollMobileCard = React.memo(function PayrollMobileCard({
  wage,
  onViewSlip,
  onDisburseSingle,
}: PayrollItemProps) {
  return (
    <div className="p-4 space-y-3 hover:bg-surface-2/50 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <button
            type="button"
            onClick={() => onViewSlip(wage)}
            className="font-semibold text-xs text-fg hover:text-brand text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
          >
            {wage.teacher_name}
          </button>
          <div className="text-xs text-fg-muted">
            <span className="font-mono">{wage.teacher_code}</span> •{" "}
            {wage.department_name}
          </div>
        </div>

        <span
          className={`px-2 py-0.5 rounded-md text-xs font-semibold border shrink-0 ${
            wage.status === "Disbursed"
              ? "bg-success-light text-success border-success/20"
              : "bg-warning-light text-warning border-warning/20"
          }`}
        >
          {wage.status}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs tabular-nums">
        <div>
          <span className="text-xs block text-fg-muted">Base</span>
          <span className="font-semibold text-xs">
            ৳{wage.base_amount.toLocaleString()}
          </span>
        </div>
        <div>
          <span className="text-xs block text-success">Allowances</span>
          <span className="font-semibold text-xs text-success">
            +৳{wage.allowances.toLocaleString()}
          </span>
        </div>
        <div>
          <span className="text-xs block text-danger">Deductions</span>
          <span className="font-semibold text-xs text-danger">
            -৳{wage.deductions.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-line">
        <div>
          <span className="text-xs block text-fg-muted">Net Amount</span>
          <span className="font-semibold text-sm text-fg tabular-nums">
            ৳{wage.net_amount.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {wage.status === "Pending" ? (
            <button
              type="button"
              onClick={() => onDisburseSingle(wage.id, wage.teacher_name)}
              className="min-h-[36px] px-3 py-1.5 bg-success hover:opacity-90 text-on-brand rounded-xl text-xs font-semibold transition-opacity cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              Disburse
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onViewSlip(wage)}
              className="min-h-[36px] bg-canvas hover:bg-surface-2 text-fg border border-line rounded-xl font-semibold px-3 py-1.5 text-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              Salary Slip
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

interface TeacherPayrollTabProps {
  isDeptAdmin: boolean;
  adminDepartmentName?: string | null;
  monthCycles: string[];
  selectedMonth: string;
  onSelectMonth: (m: string) => void;
  currentMonthWages: TeacherWage[];
  payrollSummary: {
    totalBudget: number;
    disbursed: number;
    pending: number;
    pendingCount: number;
  };
  onGoToDepartments: () => void;
  onExportPayrollCsv: () => void;
  onDisburseSingle: (wageId: string, teacherName: string) => void;
  onDisburseBulk: (month: string, gateway: PaymentMethod) => void;
}

export function TeacherPayrollTab({
  isDeptAdmin,
  adminDepartmentName,
  monthCycles,
  selectedMonth,
  onSelectMonth,
  currentMonthWages,
  payrollSummary,
  onGoToDepartments,
  onExportPayrollCsv,
  onDisburseSingle,
  onDisburseBulk,
}: TeacherPayrollTabProps) {
  const [viewingSalarySlip, setViewingSalarySlip] = useState<TeacherWage | null>(null);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkGateway, setBulkGateway] = useState<PaymentMethod>("Bank Transfer");

  if (isDeptAdmin) {
    return (
      <div className="p-8 text-center rounded-2xl border border-dashed border-line bg-surface max-w-xl mx-auto my-8">
        <div className="w-12 h-12 rounded-2xl bg-brand-soft border border-brand/20 flex items-center justify-center mx-auto mb-4 text-brand">
          <Crown className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-fg mb-1">
          Super Admin Authority Required
        </h3>
        <p className="text-xs text-fg-muted leading-relaxed mb-4">
          Institutional faculty salary disbursements and corporate banking transfers are restricted to the central Super Administrator.
          As {adminDepartmentName || "Department"} Administrator, you have full oversight over student fee collections and clearances under the{" "}
          <strong>Department Dues</strong> tab.
        </p>
        <button
          type="button"
          onClick={onGoToDepartments}
          className="min-h-[40px] px-4 py-2 bg-brand text-on-brand hover:bg-brand-hover rounded-xl font-semibold text-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          Go to Department Tuition Ledger
        </button>
      </div>
    );
  }

  const handleConfirmBulk = () => {
    onDisburseBulk(selectedMonth, bulkGateway);
    setIsBulkModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Month Cycle Navigation & Actions */}
      <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl bg-surface border border-line">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="text-xs font-semibold mr-1 text-fg-muted shrink-0 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-brand" /> Cycle:
          </span>
          {monthCycles.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => onSelectMonth(m)}
              className={`px-3 py-1.5 rounded-xl text-xs transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                selectedMonth === m
                  ? "bg-surface-2 text-fg font-semibold border border-line"
                  : "text-fg-muted hover:text-fg font-medium"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onExportPayrollCsv}
            className="min-h-[40px] bg-canvas hover:bg-surface-2 text-fg border border-line rounded-xl font-semibold px-3.5 py-2 text-xs flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <Download className="w-3.5 h-3.5" /> Export Payroll (CSV)
          </button>

          <button
            type="button"
            onClick={() => setIsBulkModalOpen(true)}
            disabled={payrollSummary.pendingCount === 0}
            className="min-h-[40px] bg-brand text-on-brand hover:bg-brand-hover rounded-xl font-semibold px-3.5 py-2 text-xs flex items-center gap-1.5 disabled:opacity-40 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <DollarSign className="w-3.5 h-3.5" /> Disburse All Pending ({payrollSummary.pendingCount})
          </button>
        </div>
      </div>

      {/* Payroll Cycle Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-2xl bg-surface border border-line">
          <p className="text-xs font-semibold mb-1 text-fg-muted">
            Total Faculty Budget
          </p>
          <h3 className="text-xl font-semibold text-fg tabular-nums">
            ৳<CountUp to={payrollSummary.totalBudget} duration={0.8} />
          </h3>
          <p className="text-xs text-fg-muted mt-1">
            {currentMonthWages.length} faculty members eligible
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-line">
          <p className="text-xs font-semibold mb-1 text-fg-muted">
            Disbursed Net Pay
          </p>
          <h3 className="text-xl font-semibold text-success tabular-nums">
            ৳<CountUp to={payrollSummary.disbursed} duration={0.8} />
          </h3>
          <p className="text-xs text-success mt-1">
            Settled electronic bank &amp; MFS transfers
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-line">
          <p className="text-xs font-semibold mb-1 text-fg-muted">
            Pending Remuneration
          </p>
          <h3 className="text-xl font-semibold text-warning tabular-nums">
            ৳<CountUp to={payrollSummary.pending} duration={0.8} />
          </h3>
          <p className="text-xs text-warning mt-1">
            {payrollSummary.pendingCount} faculty members awaiting clearance
          </p>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="overflow-hidden rounded-2xl bg-surface border border-line">
        {/* Mobile View */}
        <div className="block md:hidden divide-y divide-line">
          {currentMonthWages.length === 0 ? (
            <div className="px-6 py-12 text-center text-xs font-medium text-fg-muted">
              No payroll entries generated for {selectedMonth}.
            </div>
          ) : (
            currentMonthWages.map((wage) => (
              <PayrollMobileCard
                key={wage.id}
                wage={wage}
                onViewSlip={setViewingSalarySlip}
                onDisburseSingle={onDisburseSingle}
              />
            ))
          )}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-canvas text-xs font-semibold text-fg-muted border-b border-line">
                <th className="px-4 py-3">Faculty Member</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Base Pay</th>
                <th className="px-4 py-3">Allowances</th>
                <th className="px-4 py-3">Deductions</th>
                <th className="px-4 py-3">Net Payable</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {currentMonthWages.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-12 text-center text-xs font-medium text-fg-muted"
                  >
                    No payroll entries found for {selectedMonth}.
                  </td>
                </tr>
              ) : (
                currentMonthWages.map((wage) => (
                  <PayrollRow
                    key={wage.id}
                    wage={wage}
                    onViewSlip={setViewingSalarySlip}
                    onDisburseSingle={onDisburseSingle}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Disburse Confirmation Modal */}
      <Modal
        open={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        size="md"
        title={
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-soft border border-brand/20 text-brand flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-fg">
                Disburse All Pending Faculty Wages
              </h3>
              <p className="text-xs font-medium text-fg-muted">
                Cycle: {selectedMonth}
              </p>
            </div>
          </div>
        }
        description={`This action will mark all ${payrollSummary.pendingCount} pending teacher wage records as Disbursed and record individual debit vouchers in the master ledger.`}
        footer={
          <div className="flex items-center justify-end gap-2.5 w-full">
            <button
              type="button"
              onClick={() => setIsBulkModalOpen(false)}
              className="min-h-[40px] px-4 py-2 rounded-xl bg-canvas hover:bg-surface-2 text-fg border border-line text-xs font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmBulk}
              className="min-h-[40px] px-4 py-2 rounded-xl bg-brand text-on-brand hover:bg-brand-hover text-xs font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              Confirm Bulk Payout (৳{payrollSummary.pending.toLocaleString()})
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label
              htmlFor="bulk-disburse-gateway-select"
              className="block text-xs font-semibold text-fg-muted mb-1.5"
            >
              Settlement Gateway Channel
            </label>
            <select
              id="bulk-disburse-gateway-select"
              value={bulkGateway}
              onChange={(e) => setBulkGateway(e.target.value as PaymentMethod)}
              className="w-full min-h-[40px] px-3 py-2 rounded-xl bg-canvas border border-line text-xs font-semibold text-fg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <option value="Bank Transfer">Bank Electronic Clearing (Direct BEFTN / RTGS)</option>
              <option value="bKash">bKash Corporate Payroll API</option>
              <option value="SSLCommerz">SSLCommerz Corporate Mass Payout</option>
              <option value="Nagad">Nagad Corporate Payroll</option>
            </select>
          </div>

          <div className="p-3.5 rounded-xl bg-canvas border border-line text-xs space-y-1">
            <div className="flex justify-between text-fg-muted">
              <span>Recipients:</span>
              <strong className="text-fg">{payrollSummary.pendingCount} Faculty Members</strong>
            </div>
            <div className="flex justify-between text-fg-muted">
              <span>Total Outflow:</span>
              <strong className="text-success font-semibold tabular-nums">
                ৳{payrollSummary.pending.toLocaleString()} BDT
              </strong>
            </div>
          </div>
        </div>
      </Modal>

      {/* Salary Slip Voucher Modal */}
      <Modal
        open={Boolean(viewingSalarySlip)}
        onClose={() => setViewingSalarySlip(null)}
        size="md"
        title={
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand text-on-brand flex items-center justify-center font-semibold text-sm">
              U
            </div>
            <div>
              <h3 className="text-sm font-semibold text-fg">Faculty Salary Slip</h3>
              <p className="text-xs font-medium text-fg-muted">{viewingSalarySlip?.month}</p>
            </div>
          </div>
        }
        footer={
          <div className="flex items-center justify-end gap-2.5 w-full">
            <button
              type="button"
              onClick={() => window.print()}
              className="min-h-[40px] bg-brand text-on-brand hover:bg-brand-hover rounded-xl font-semibold px-4 py-1.5 text-xs flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <Printer className="w-3.5 h-3.5" /> Print Payslip
            </button>
          </div>
        }
      >
        {viewingSalarySlip && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-canvas border border-line">
              <h4 className="font-semibold text-sm text-fg">
                {viewingSalarySlip.teacher_name}
              </h4>
              <p className="text-xs mt-0.5 text-fg-muted">
                {viewingSalarySlip.department_name} • Faculty Code:{" "}
                <span className="font-mono">{viewingSalarySlip.teacher_code}</span>
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded-md text-xs font-semibold border ${
                    viewingSalarySlip.status === "Disbursed"
                      ? "bg-success-light text-success border-success/20"
                      : "bg-warning-light text-warning border-warning/20"
                  }`}
                >
                  Status: {viewingSalarySlip.status}
                </span>
                {viewingSalarySlip.transaction_id && (
                  <span className="text-xs font-mono text-fg-muted">
                    Ref: {viewingSalarySlip.transaction_id}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2 text-xs tabular-nums">
              <div className="flex justify-between py-1.5 border-b border-line gap-2">
                <span className="text-fg-muted">Base Monthly Compensation:</span>
                <span className="font-semibold text-fg">
                  ৳{viewingSalarySlip.base_amount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-line gap-2">
                <span className="text-fg-muted">Academic &amp; Research Allowances:</span>
                <span className="font-semibold text-success">
                  +৳{viewingSalarySlip.allowances.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-line gap-2">
                <span className="text-fg-muted">Tax &amp; Provident Fund Deductions:</span>
                <span className="font-semibold text-danger">
                  -৳{viewingSalarySlip.deductions.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-2 text-sm font-semibold pt-2 gap-2">
                <span className="text-fg">Net Payable Disbursed:</span>
                <span className="text-brand">
                  ৳{viewingSalarySlip.net_amount.toLocaleString()} BDT
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
