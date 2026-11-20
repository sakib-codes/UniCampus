"use client";

import { Check, Copy, Printer, X, DollarSign, Send } from "lucide-react";
import type {
  Department,
  OrdinalSemesterName,
  PaymentMethod,
  PaymentTransaction,
  TeacherWage,
} from "@/types/admin";

interface FinanceModalsProps {
  viewingReceipt: PaymentTransaction | null;
  onCloseReceipt: () => void;
  onCopy: (text: string, label: string) => void;

  viewingSalarySlip: TeacherWage | null;
  onCloseSalarySlip: () => void;

  isBulkDisburseOpen: boolean;
  onCloseBulkDisburse: () => void;
  selectedMonth: string;
  payrollPending: number;
  payrollPendingCount: number;
  bulkGateway: PaymentMethod;
  onBulkGatewayChange: (m: PaymentMethod) => void;
  onConfirmBulkDisburse: () => void;

  reminderModalSemester: OrdinalSemesterName | null;
  onCloseReminderModal: () => void;
  currentDeptObj?: Department;
  overdueStudentsInSelectedSemester: PaymentTransaction[];
  onSendDueReminders: () => void;
}

export function FinanceModals({
  viewingReceipt,
  onCloseReceipt,
  onCopy,
  viewingSalarySlip,
  onCloseSalarySlip,
  isBulkDisburseOpen,
  onCloseBulkDisburse,
  selectedMonth,
  payrollPending,
  payrollPendingCount,
  bulkGateway,
  onBulkGatewayChange,
  onConfirmBulkDisburse,
  reminderModalSemester,
  onCloseReminderModal,
  currentDeptObj,
  overdueStudentsInSelectedSemester,
  onSendDueReminders,
}: FinanceModalsProps) {
  return (
    <>
      {/* DIGITAL RECEIPT VOUCHER MODAL */}
      {viewingReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg p-6 rounded-2xl bg-surface border border-line shadow-xl max-h-[90dvh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3.5 border-b border-line mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-brand text-on-brand flex items-center justify-center font-bold text-sm">
                  U
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-fg">
                    UniCampus Treasury
                  </h3>
                  <p className="text-xs font-medium text-fg-muted">
                    Official Digital Receipt
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close modal"
                onClick={onCloseReceipt}
                className="min-w-[36px] min-h-[36px] inline-flex items-center justify-center text-fg-muted hover:text-fg rounded-lg hover:bg-surface-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-canvas border border-line mb-5 text-center">
              <span className="text-xs font-semibold block mb-1 text-fg-muted">
                Receipt Number
              </span>
              <h2 className="text-xl font-bold font-mono text-brand mb-2">
                {viewingReceipt.receipt_number}
              </h2>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-success-light text-success border border-success/20">
                <Check className="w-3 h-3" /> Status: {viewingReceipt.status}
              </div>
            </div>

            <div className="space-y-2 text-xs mb-5">
              <div className="flex justify-between py-1.5 border-b border-line gap-2">
                <span className="text-fg-muted">Transaction Reference:</span>
                <span className="font-mono font-semibold text-fg">
                  {viewingReceipt.transaction_id}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-line gap-2">
                <span className="text-fg-muted">Recipient / Payer:</span>
                <span className="font-semibold text-fg">
                  {viewingReceipt.user_name}
                </span>
              </div>
              {viewingReceipt.student_id && (
                <div className="flex justify-between py-1.5 border-b border-line gap-2">
                  <span className="text-fg-muted">Student ID:</span>
                  <span className="font-mono font-semibold text-fg">
                    {viewingReceipt.student_id}
                  </span>
                </div>
              )}
              <div className="flex justify-between py-1.5 border-b border-line gap-2">
                <span className="text-fg-muted">Academic Department:</span>
                <span className="font-semibold text-fg">
                  {viewingReceipt.department_name}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-line gap-2">
                <span className="text-fg-muted">Ordinal Semester:</span>
                <span className="font-semibold text-brand">
                  {viewingReceipt.semester_name}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-line gap-2">
                <span className="text-fg-muted">Payment Gateway:</span>
                <span className="font-semibold text-fg">
                  {viewingReceipt.payment_method}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-line gap-2">
                <span className="text-fg-muted">Date &amp; Timestamp:</span>
                <span className="text-fg-muted tabular-nums">
                  {new Date(viewingReceipt.created_at).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-2 text-sm font-bold pt-2 gap-2">
                <span className="text-fg">Total Settled Amount:</span>
                <span className="text-brand tabular-nums">
                  ৳{viewingReceipt.amount.toLocaleString()} BDT
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-4 border-t border-line">
              <button
                type="button"
                onClick={() =>
                  onCopy(viewingReceipt.transaction_id, "TXN ID")
                }
                className="min-h-[40px] bg-canvas hover:bg-surface-2 text-fg border border-line rounded-xl font-semibold px-3.5 py-1.5 text-xs flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <Copy className="w-3.5 h-3.5" /> Copy TXN ID
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="min-h-[40px] bg-brand text-on-brand hover:bg-brand-hover rounded-xl font-semibold px-3.5 py-1.5 text-xs flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <Printer className="w-3.5 h-3.5" /> Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FACULTY SALARY SLIP VOUCHER MODAL */}
      {viewingSalarySlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg p-6 rounded-2xl bg-surface border border-line shadow-xl max-h-[90dvh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3.5 border-b border-line mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-brand text-on-brand flex items-center justify-center font-bold text-sm">
                  U
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-fg">
                    Faculty Salary Voucher
                  </h3>
                  <p className="text-xs font-medium text-fg-muted">
                    {viewingSalarySlip.month}
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close modal"
                onClick={onCloseSalarySlip}
                className="min-w-[36px] min-h-[36px] inline-flex items-center justify-center text-fg-muted hover:text-fg rounded-lg hover:bg-surface-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-canvas border border-line mb-5">
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

            <div className="space-y-2 text-xs mb-5 tabular-nums">
              <div className="flex justify-between py-1.5 border-b border-line gap-2">
                <span className="text-fg-muted">Base Monthly Compensation:</span>
                <span className="font-semibold text-fg">
                  ৳{viewingSalarySlip.base_amount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-line gap-2">
                <span className="text-fg-muted">
                  Academic &amp; Research Allowances:
                </span>
                <span className="font-semibold text-success">
                  +৳{viewingSalarySlip.allowances.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-line gap-2">
                <span className="text-fg-muted">
                  Tax &amp; Provident Fund Deductions:
                </span>
                <span className="font-semibold text-danger">
                  -৳{viewingSalarySlip.deductions.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-2 text-sm font-bold pt-2 gap-2">
                <span className="text-fg">Net Payable Disbursed:</span>
                <span className="text-brand">
                  ৳{viewingSalarySlip.net_amount.toLocaleString()} BDT
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-4 border-t border-line">
              <button
                type="button"
                onClick={() => window.print()}
                className="min-h-[40px] bg-brand text-on-brand hover:bg-brand-hover rounded-xl font-semibold px-3.5 py-1.5 text-xs flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <Printer className="w-3.5 h-3.5" /> Print Salary Slip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BULK DISBURSE CONFIRMATION MODAL */}
      {isBulkDisburseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 text-center rounded-2xl bg-surface border border-line shadow-xl">
            <div className="w-11 h-11 rounded-xl bg-brand-soft border border-brand/20 text-brand flex items-center justify-center mx-auto mb-3.5">
              <DollarSign className="w-5 h-5" />
            </div>

            <h3 className="text-base font-semibold mb-1 text-fg">
              Disburse All Pending Faculty Wages?
            </h3>
            <p className="text-xs mb-4 text-fg-muted tabular-nums">
              Cycle: <strong className="text-fg">{selectedMonth}</strong> • Total
              Payout:{" "}
              <strong className="text-success">
                ৳{payrollPending.toLocaleString()} BDT
              </strong>
            </p>

            <div className="space-y-3 mb-5 text-left">
              <div>
                <label
                  htmlFor="bulk-disburse-gateway"
                  className="block text-xs font-semibold mb-1 text-fg-muted"
                >
                  Settlement Gateway
                </label>
                <select
                  id="bulk-disburse-gateway"
                  value={bulkGateway}
                  onChange={(e) =>
                    onBulkGatewayChange(e.target.value as PaymentMethod)
                  }
                  className="w-full min-h-[40px] px-3 py-2 font-semibold cursor-pointer rounded-xl bg-canvas border border-line text-fg text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus:border-brand"
                >
                  <option value="Bank Transfer">Bank Electronic Transfer</option>
                  <option value="bKash">bKash Corporate Payout</option>
                  <option value="Nagad">Nagad Corporate Payout</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-canvas border border-line text-xs text-fg-muted">
                This action will mark all {payrollPendingCount} pending teacher
                wage records as <strong className="text-fg">Disbursed</strong>{" "}
                and record individual debit vouchers in the master ledger.
              </div>
            </div>

            <div className="flex justify-center gap-2.5">
              <button
                type="button"
                onClick={onCloseBulkDisburse}
                className="min-h-[40px] bg-canvas hover:bg-surface-2 text-fg border border-line rounded-xl font-semibold px-4 py-2 text-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirmBulkDisburse}
                className="min-h-[40px] bg-brand text-on-brand hover:bg-brand-hover rounded-xl font-semibold px-4 py-2 text-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                Confirm Bulk Payout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SEND DUE REMINDERS MODAL */}
      {reminderModalSemester && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 text-center rounded-2xl bg-surface border border-line shadow-xl">
            <div className="w-11 h-11 rounded-xl bg-warning-light border border-warning/20 text-warning flex items-center justify-center mx-auto mb-3.5">
              <Send className="w-5 h-5" />
            </div>

            <h3 className="text-base font-semibold mb-1 text-fg">
              Broadcast Due Payment Reminders
            </h3>
            <p className="text-xs mb-4 text-fg-muted">
              {currentDeptObj?.name} •{" "}
              <strong className="text-fg">{reminderModalSemester}</strong>
            </p>

            <div className="p-3 rounded-xl bg-canvas border border-line max-h-48 overflow-y-auto mb-5 space-y-2 text-left">
              <p className="text-xs font-semibold text-fg-muted">
                Recipients ({overdueStudentsInSelectedSemester.length} students)
              </p>
              {overdueStudentsInSelectedSemester.map((s) => (
                <div
                  key={s.id}
                  className="flex justify-between items-center text-xs gap-2"
                >
                  <span className="font-semibold text-fg truncate">
                    {s.user_name}{" "}
                    {s.student_id && (
                      <span className="font-mono text-fg-muted">
                        ({s.student_id})
                      </span>
                    )}
                  </span>
                  <span className="font-sans tabular-nums text-danger font-semibold shrink-0">
                    ৳{s.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-2.5">
              <button
                type="button"
                onClick={onCloseReminderModal}
                className="min-h-[40px] bg-canvas hover:bg-surface-2 text-fg border border-line rounded-xl font-semibold px-4 py-2 text-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onSendDueReminders}
                className="min-h-[40px] bg-brand text-on-brand hover:bg-brand-hover rounded-xl font-semibold px-4 py-2 text-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                Dispatch Reminders (SMS/Email)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
