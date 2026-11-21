"use client";

import React from "react";
import { CheckCircle2, Clock, Eye, FileText } from "lucide-react";
import type { TeacherWage } from "@/types/admin";

interface PayrollLedgerTableProps {
  wages: TeacherWage[];
  onViewPayslip: (wage: TeacherWage) => void;
  onClearFilters?: () => void;
}

export function PayrollLedgerTable({
  wages,
  onViewPayslip,
  onClearFilters,
}: PayrollLedgerTableProps) {
  if (wages.length === 0) {
    return (
      <div className="w-full rounded-2xl bg-surface border border-line p-12 text-center">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-surface-2 border border-line flex items-center justify-center text-fg-muted mb-3">
          <FileText className="w-6 h-6" aria-hidden="true" />
        </div>
        <h3 className="text-base font-semibold text-fg">No disbursement records found</h3>
        <p className="mt-1 text-sm text-fg-muted max-w-sm mx-auto">
          No payroll entries matched your active filters or date range criteria.
        </p>
        {onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="mt-4 min-h-[44px] px-4 py-2 bg-brand text-on-brand rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            Clear Active Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl bg-surface border border-line overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-line bg-surface-2/60 text-xs font-semibold text-fg-muted uppercase tracking-wider">
              <th scope="col" className="px-5 py-3.5">
                Month / Period
              </th>
              <th scope="col" className="px-4 py-3.5 text-right">
                Base Salary
              </th>
              <th scope="col" className="px-4 py-3.5 text-right">
                Allowances
              </th>
              <th scope="col" className="px-4 py-3.5 text-right">
                Deductions
              </th>
              <th scope="col" className="px-5 py-3.5 text-right">
                Net Payable (BDT)
              </th>
              <th scope="col" className="px-4 py-3.5">
                Payout Method
              </th>
              <th scope="col" className="px-4 py-3.5">
                Disbursed Date
              </th>
              <th scope="col" className="px-4 py-3.5 text-center">
                Status
              </th>
              <th scope="col" className="px-5 py-3.5 text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60 text-sm">
            {wages.map((wage) => {
              const isDisbursed = wage.status === "Disbursed";
              const formattedDate = wage.disbursed_at
                ? new Date(wage.disbursed_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Awaiting Admin";

              return (
                <tr
                  key={wage.id}
                  className="hover:bg-surface-2/50 transition-colors"
                >
                  {/* Month */}
                  <td className="px-5 py-4 font-semibold text-fg whitespace-nowrap">
                    <div className="flex flex-col">
                      <span>{wage.month}</span>
                      <span className="text-xs font-normal text-fg-muted">
                        Regular Monthly Remuneration
                      </span>
                    </div>
                  </td>

                  {/* Base Salary */}
                  <td className="px-4 py-4 text-right text-fg-muted font-medium tabular-nums whitespace-nowrap">
                    ৳{wage.base_amount.toLocaleString()}
                  </td>

                  {/* Allowances */}
                  <td className="px-4 py-4 text-right text-success font-medium tabular-nums whitespace-nowrap">
                    +৳{wage.allowances.toLocaleString()}
                  </td>

                  {/* Deductions */}
                  <td className="px-4 py-4 text-right text-danger font-medium tabular-nums whitespace-nowrap">
                    -৳{wage.deductions.toLocaleString()}
                  </td>

                  {/* Net Payable */}
                  <td className="px-5 py-4 text-right font-bold text-fg tabular-nums whitespace-nowrap">
                    <span className="text-base">৳{wage.net_amount.toLocaleString()}</span>
                  </td>

                  {/* Payout Method */}
                  <td className="px-4 py-4 text-fg-muted whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-medium text-fg text-xs sm:text-sm">
                        {wage.payment_method || "Bank Transfer"}
                      </span>
                      {wage.transaction_id ? (
                        <span className="text-xs font-mono text-fg-muted">
                          {wage.transaction_id}
                        </span>
                      ) : (
                        <span className="text-xs text-fg-muted">Ref: Pending</span>
                      )}
                    </div>
                  </td>

                  {/* Disbursed Date */}
                  <td className="px-4 py-4 text-fg-muted text-xs whitespace-nowrap">
                    {formattedDate}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4 text-center whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold border ${
                        isDisbursed
                          ? "bg-success-light text-success border-success/20"
                          : "bg-warning-light text-warning border-warning/20"
                      }`}
                    >
                      {isDisbursed ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 shrink-0" aria-hidden="true" />
                          Disbursed
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3 shrink-0" aria-hidden="true" />
                          Pending
                        </>
                      )}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="px-5 py-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onViewPayslip(wage)}
                      aria-label={`View payslip for ${wage.month}`}
                      className="min-h-[44px] inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-2 hover:bg-line/40 text-fg border border-line rounded-xl text-xs font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    >
                      <Eye className="w-3.5 h-3.5 text-brand shrink-0" aria-hidden="true" />
                      <span>View Payslip</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
