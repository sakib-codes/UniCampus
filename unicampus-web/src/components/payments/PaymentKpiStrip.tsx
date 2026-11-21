"use client";

import React from "react";
import { CreditCard, DollarSign, Calendar, CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { PaymentTransaction, SemesterInvoice } from "@/types/admin";

export interface PaymentKpiStripProps {
  invoices: SemesterInvoice[];
  transactions: PaymentTransaction[];
}

export function PaymentKpiStrip({ invoices, transactions }: PaymentKpiStripProps) {
  const totalPayable = invoices.reduce((acc, inv) => acc + (inv.total_amount || 0), 0);
  const totalPaid = invoices.reduce((acc, inv) => acc + (inv.paid_amount || 0), 0);
  const totalDue = invoices.reduce((acc, inv) => acc + (inv.due_amount || 0), 0);

  const currentInvoice = invoices[0];
  const dueDateFormatted = currentInvoice
    ? new Date(currentInvoice.due_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Oct 31, 2026";

  const lastPayment = transactions[0];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Payable */}
      <div className="rounded-2xl bg-surface border border-line p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-fg-muted mb-2">
          <span className="text-xs font-medium">Total Payable (All Semesters)</span>
          <div className="w-8 h-8 rounded-xl bg-surface-2 border border-line flex items-center justify-center text-fg-muted">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div>
          <p className="text-2xl sm:text-[26px] font-semibold text-fg tracking-tight tabular-nums">
            ৳{totalPayable.toLocaleString()}
          </p>
          <p className="text-xs text-fg-muted mt-1">
            Cumulative across {invoices.length} Semesters
          </p>
        </div>
      </div>

      {/* 2. Total Paid */}
      <div className="rounded-2xl bg-surface border border-line p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-fg-muted mb-2">
          <span className="text-xs font-medium">Total Paid</span>
          <div className="w-8 h-8 rounded-xl bg-success-light border border-success/20 flex items-center justify-center text-success">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div>
          <p className="text-2xl sm:text-[26px] font-semibold text-success tracking-tight tabular-nums">
            ৳{totalPaid.toLocaleString()}
          </p>
          <p className="text-xs text-fg-muted mt-1">
            Verified university accounts ledger
          </p>
        </div>
      </div>

      {/* 3. Current Due */}
      <div className="rounded-2xl bg-surface border border-line p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-fg-muted mb-2">
          <span className="text-xs font-medium">Current Semester Due</span>
          <div
            className={`w-8 h-8 rounded-xl border flex items-center justify-center ${
              totalDue > 0
                ? "bg-danger-light border-danger/20 text-danger"
                : "bg-success-light border-success/20 text-success"
            }`}
          >
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <p
              className={`text-2xl sm:text-[26px] font-semibold tracking-tight tabular-nums ${
                totalDue > 0 ? "text-danger" : "text-success"
              }`}
            >
              ৳{totalDue.toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <Calendar className="w-3.5 h-3.5 text-fg-muted" />
            <span className="text-xs text-fg-muted">
              {totalDue > 0 ? `Due ${dueDateFormatted}` : "All Dues Cleared"}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Last Payment */}
      <div className="rounded-2xl bg-surface border border-line p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-fg-muted mb-2">
          <span className="text-xs font-medium">Last Payment Recorded</span>
          <div className="w-8 h-8 rounded-xl bg-brand-soft border border-brand/20 flex items-center justify-center text-brand">
            <CreditCard className="w-4 h-4" />
          </div>
        </div>
        <div>
          {lastPayment ? (
            <>
              <p className="text-2xl sm:text-[26px] font-semibold text-fg tracking-tight tabular-nums">
                ৳{lastPayment.amount.toLocaleString()}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="brand" appearance="soft" className="text-[11px]">
                  {lastPayment.payment_method}
                </Badge>
                <span className="text-xs text-fg-muted tabular-nums">
                  {new Date(lastPayment.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </>
          ) : (
            <>
              <p className="text-lg font-medium text-fg">No Payments Yet</p>
              <p className="text-xs text-fg-muted mt-1">Make your first payment</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
