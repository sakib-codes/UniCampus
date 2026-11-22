"use client";

import React from "react";
import { Download, Printer, ShieldCheck } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import type { TeacherWage } from "@/types/admin";

interface SalarySlipModalProps {
  wage: TeacherWage | null;
  open: boolean;
  onClose: () => void;
  onShowToast?: (message: string) => void;
}

export function SalarySlipModal({
  wage,
  open,
  onClose,
  onShowToast,
}: SalarySlipModalProps) {
  if (!wage) return null;

  const isDisbursed = wage.status === "Disbursed";
  const formattedDisbursedAt = wage.disbursed_at
    ? new Date(wage.disbursed_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Pending Administrative Disbursal";

  // Itemized Earnings Breakdown (calculated deterministically from wage values)
  const baseSalary = wage.base_amount;
  const houseRent = Math.round(wage.allowances * 0.5);
  const medical = Math.round(wage.allowances * 0.3);
  const transport = wage.allowances - houseRent - medical;
  const grossEarnings = baseSalary + wage.allowances;

  // Itemized Deductions Breakdown
  const providentFund = Math.round(wage.deductions * 0.6);
  const withholdingTax = Math.round(wage.deductions * 0.3);
  const welfareFund = wage.deductions - providentFund - withholdingTax;
  const totalDeductions = wage.deductions;

  const netDisbursed = wage.net_amount;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadReceipt = () => {
    const receiptContent = `========================================================
UNICAMPUS OFFICIAL FACULTY SALARY SLIP
========================================================
Faculty Member:   Dr. Asif Rahman
Faculty Code:     FAC-1042
Department:       Department of Computer Science & Engineering
Designation:      Associate Professor
Remuneration Month: ${wage.month}
Status:           ${wage.status}
Payout Method:    ${wage.payment_method || "Bank Transfer (DBBL •••• 4821)"}
Transaction ID:   ${wage.transaction_id || "PENDING"}
Disbursement Date: ${formattedDisbursedAt}

--------------------------------------------------------
ITEMIZED EARNINGS
--------------------------------------------------------
Basic Salary:                   BDT ৳${baseSalary.toLocaleString()}
House Rent Allowance:           BDT ৳${houseRent.toLocaleString()}
Medical Allowance:              BDT ৳${medical.toLocaleString()}
Conveyance & Transport:         BDT ৳${transport.toLocaleString()}
--------------------------------------------------------
TOTAL GROSS EARNINGS:           BDT ৳${grossEarnings.toLocaleString()}

--------------------------------------------------------
ITEMIZED STATUTORY DEDUCTIONS
--------------------------------------------------------
Provident Fund (PF):            BDT ৳${providentFund.toLocaleString()}
Withholding Income Tax:         BDT ৳${withholdingTax.toLocaleString()}
Faculty Welfare & Group Trust:  BDT ৳${welfareFund.toLocaleString()}
--------------------------------------------------------
TOTAL DEDUCTIONS:               BDT ৳${totalDeductions.toLocaleString()}

========================================================
NET REMUNERATION DISBURSED:     BDT ৳${netDisbursed.toLocaleString()}
========================================================

Verified and certified by:
Office of the Comptroller & Finance Director
UniCampus University Management System
========================================================`;

    const blob = new Blob([receiptContent], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const sanitizedMonth = wage.month.replace(/\s+/g, "_");
    link.href = url;
    link.download = `Payslip_${sanitizedMonth}_FAC-1042.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    onShowToast?.(`Salary slip receipt for ${wage.month} downloaded.`);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={
        <div className="flex items-center gap-2">
          <span className="font-semibold text-lg text-fg">Official Salary Slip</span>
          <span
            className={`px-2 py-0.5 rounded text-xs font-semibold border ${
              isDisbursed
                ? "bg-success-light text-success border-success/20"
                : "bg-warning-light text-warning border-warning/20"
            }`}
          >
            {wage.status}
          </span>
        </div>
      }
      description={`Faculty Remuneration & Disbursement Statement • ${wage.month}`}
      footer={
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full">
          <div className="text-xs text-fg-muted flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-brand shrink-0" aria-hidden="true" />
            <span>Digital seal by UniCampus Comptroller & Payroll Division</span>
          </div>
          <div className="flex items-center justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={handlePrint}
              className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 bg-surface-2 hover:bg-line/40 text-fg border border-line rounded-xl text-xs font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <Printer className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Print Slip</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadReceipt}
              className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2 bg-brand text-on-brand rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Download Receipt</span>
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-5 print:p-0">
        {/* Institutional Header Banner */}
        <div className="rounded-2xl bg-canvas border border-line p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-3.5">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-brand">
                UniCampus Autonomous Faculty Payroll
              </div>
              <h2 className="text-base font-bold text-fg mt-0.5">Dr. Asif Rahman</h2>
              <p className="text-xs text-fg-muted">
                Associate Professor • Department of Computer Science & Engineering
              </p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs text-fg-muted block">Faculty ID</span>
              <span className="font-mono text-sm font-semibold text-fg">FAC-1042</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3.5 text-xs">
            <div>
              <span className="text-fg-muted block">Remuneration Month</span>
              <span className="font-semibold text-fg">{wage.month}</span>
            </div>
            <div>
              <span className="text-fg-muted block">Disbursement Channel</span>
              <span className="font-semibold text-fg">{wage.payment_method || "Bank Transfer"}</span>
            </div>
            <div>
              <span className="text-fg-muted block">Disbursed Date</span>
              <span className="font-semibold text-fg">{formattedDisbursedAt}</span>
            </div>
            <div>
              <span className="text-fg-muted block">Transaction ID</span>
              <span className="font-mono font-semibold text-fg">
                {wage.transaction_id || "PENDING"}
              </span>
            </div>
          </div>
        </div>

        {/* Itemized Earnings vs Deductions Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Earnings Card */}
          <div className="rounded-2xl bg-surface border border-line p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-line mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-success">
                  Gross Earnings (BDT)
                </span>
                <span className="text-xs text-fg-muted">Base + Allowances</span>
              </div>
              <ul className="space-y-2 text-xs">
                <li className="flex items-center justify-between">
                  <span className="text-fg-muted">Basic Contractual Salary</span>
                  <span className="font-medium text-fg tabular-nums">
                    ৳{baseSalary.toLocaleString()}
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-fg-muted">House Rent Allowance (50%)</span>
                  <span className="font-medium text-success tabular-nums">
                    +৳{houseRent.toLocaleString()}
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-fg-muted">Medical & Healthcare Subsidy (30%)</span>
                  <span className="font-medium text-success tabular-nums">
                    +৳{medical.toLocaleString()}
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-fg-muted">Conveyance & Transport Allowance</span>
                  <span className="font-medium text-success tabular-nums">
                    +৳{transport.toLocaleString()}
                  </span>
                </li>
              </ul>
            </div>

            <div className="pt-3 mt-3 border-t border-line flex items-center justify-between text-xs font-semibold">
              <span className="text-fg">Total Gross Remuneration</span>
              <span className="text-success tabular-nums text-sm font-bold">
                ৳{grossEarnings.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Deductions Card */}
          <div className="rounded-2xl bg-surface border border-line p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-line mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-danger">
                  Statutory Deductions (BDT)
                </span>
                <span className="text-xs text-fg-muted">Taxes & Provident</span>
              </div>
              <ul className="space-y-2 text-xs">
                <li className="flex items-center justify-between">
                  <span className="text-fg-muted">Provident Fund (PF Faculty Share)</span>
                  <span className="font-medium text-danger tabular-nums">
                    -৳{providentFund.toLocaleString()}
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-fg-muted">Withholding Income Tax (NBR 82C)</span>
                  <span className="font-medium text-danger tabular-nums">
                    -৳{withholdingTax.toLocaleString()}
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-fg-muted">Faculty Welfare & Insurance Fund</span>
                  <span className="font-medium text-danger tabular-nums">
                    -৳{welfareFund.toLocaleString()}
                  </span>
                </li>
              </ul>
            </div>

            <div className="pt-3 mt-3 border-t border-line flex items-center justify-between text-xs font-semibold">
              <span className="text-fg">Total Statutory Deductions</span>
              <span className="text-danger tabular-nums text-sm font-bold">
                -৳{totalDeductions.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Net Remuneration Banner */}
        <div className="rounded-2xl bg-surface-2 border border-line p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-fg-muted">
              Net Remuneration Disbursed
            </span>
            <p className="text-xs text-fg-muted mt-0.5">
              Net amount credited to selected institutional payout account
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl sm:text-3xl font-bold text-fg tabular-nums tracking-tight">
              BDT ৳{netDisbursed.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
