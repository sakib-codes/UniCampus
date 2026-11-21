"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  CreditCard,
  FileText,
  Receipt,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SemesterInvoice } from "@/types/admin";

export interface SemesterFeesTabProps {
  invoices: SemesterInvoice[];
  onOpenGateway: (
    invoice: SemesterInvoice,
    amount: number,
    gateway: "bkash" | "sslcommerz"
  ) => void;
  onViewReceipt: (invoice: SemesterInvoice) => void;
}

export function SemesterFeesTab({
  invoices,
  onOpenGateway,
  onViewReceipt,
}: SemesterFeesTabProps) {
  // Default: 6th semester expanded
  const [expandedId, setExpandedId] = useState<string | null>(
    invoices[0]?.id || "inv-sem-6"
  );
  // Custom installment amount per semester
  const [customAmounts, setCustomAmounts] = useState<Record<string, string>>({});
  const [paymentModes, setPaymentModes] = useState<Record<string, "full" | "partial">>({});

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const getCustomAmount = (invoice: SemesterInvoice) => {
    return customAmounts[invoice.id] !== undefined
      ? customAmounts[invoice.id]
      : String(Math.min(10000, invoice.due_amount));
  };

  const handleAmountChange = (id: string, val: string) => {
    setCustomAmounts((prev) => ({ ...prev, [id]: val }));
  };

  const setMode = (id: string, mode: "full" | "partial") => {
    setPaymentModes((prev) => ({ ...prev, [id]: mode }));
  };

  return (
    <div className="space-y-4">
      {invoices.map((inv) => {
        const isExpanded = expandedId === inv.id;
        const isPaid = inv.status === "Paid" || inv.due_amount === 0;
        const currentMode = paymentModes[inv.id] || "full";
        const customVal = Number(getCustomAmount(inv)) || 0;
        const resolvedPayable = currentMode === "full" ? inv.due_amount : customVal;
        const isAmountValid =
          resolvedPayable >= 1000 && resolvedPayable <= inv.due_amount;

        return (
          <div
            key={inv.id}
            className={`rounded-2xl border bg-surface overflow-hidden ${
              isExpanded ? "border-brand/30 shadow-xs" : "border-line"
            }`}
          >
            {/* Semester Header Accordion Trigger */}
            <div
              className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-surface-2/40 select-none"
              onClick={() => toggleExpand(inv.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleExpand(inv.id);
                }
              }}
              aria-expanded={isExpanded}
            >
              <div className="flex items-start sm:items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                    isPaid
                      ? "bg-success-light border-success/20 text-success"
                      : "bg-brand-soft border-brand/20 text-brand"
                  }`}
                >
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold text-fg tracking-tight">
                      {inv.semester_name}
                    </h3>
                    <span className="text-xs text-fg-muted font-normal">
                      • {inv.term_label}
                    </span>
                    <Badge
                      variant={
                        isPaid
                          ? "success"
                          : inv.status === "Overdue"
                          ? "danger"
                          : "warning"
                      }
                      appearance="soft"
                    >
                      {isPaid ? "Paid" : inv.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-fg-muted mt-0.5">
                    Invoice No: <span className="font-mono text-fg">{inv.invoice_no}</span>
                    {inv.last_paid_at && (
                      <span className="ml-2">
                        • Last Paid:{" "}
                        {new Date(inv.last_paid_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Summary Numbers & Action Trigger */}
              <div className="flex items-center justify-between md:justify-end gap-6 pt-2 md:pt-0 border-t md:border-t-0 border-line">
                <div className="text-right">
                  <p className="text-xs text-fg-muted">Total / Paid</p>
                  <p className="text-sm font-medium text-fg tabular-nums">
                    ৳{inv.total_amount.toLocaleString()}{" "}
                    <span className="text-success text-xs">
                      (৳{inv.paid_amount.toLocaleString()})
                    </span>
                  </p>
                </div>

                <div className="text-right min-w-[90px]">
                  <p className="text-xs text-fg-muted">Remaining Due</p>
                  <p
                    className={`text-sm font-semibold tabular-nums ${
                      inv.due_amount > 0 ? "text-danger" : "text-success"
                    }`}
                  >
                    ৳{inv.due_amount.toLocaleString()}
                  </p>
                </div>

                <div className="w-8 h-8 rounded-xl bg-surface-2 border border-line flex items-center justify-center text-fg-muted shrink-0">
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </div>
            </div>

            {/* Accordion Expanded Content */}
            {isExpanded && (
              <div className="border-t border-line p-5 bg-surface-2/20 space-y-6">
                {/* Itemized Fee Breakdown Table */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-fg-muted mb-3">
                    Semester Fee Itemization
                  </h4>
                  <div className="border border-line rounded-2xl overflow-hidden bg-surface divide-y divide-line text-xs">
                    {inv.line_items.map((item) => (
                      <div
                        key={item.id}
                        className="px-4 py-3 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium text-fg">{item.label}</p>
                          <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-surface-2 text-[10px] text-fg-muted">
                            {item.category}
                          </span>
                        </div>
                        <span className="tabular-nums font-semibold text-fg">
                          ৳{item.amount.toLocaleString()}
                        </span>
                      </div>
                    ))}
                    <div className="bg-surface-2 px-4 py-3 flex items-center justify-between text-xs font-semibold text-fg">
                      <span>Total Semester Payable</span>
                      <span className="tabular-nums text-sm font-bold">
                        ৳{inv.total_amount.toLocaleString()} BDT
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Action Section (if due > 0) */}
                {!isPaid && (
                  <div className="p-4 rounded-2xl border border-line bg-surface space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line pb-3">
                      <div>
                        <h4 className="text-sm font-semibold text-fg">
                          Make a Payment for {inv.semester_name}
                        </h4>
                        <p className="text-xs text-fg-muted">
                          Choose full clearance or customized installment (Minimum ৳1,000)
                        </p>
                      </div>
                      <Badge variant="warning" appearance="soft">
                        Due Date: {inv.due_date}
                      </Badge>
                    </div>

                    {/* Choice: Full Due or Partial Installment */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setMode(inv.id, "full")}
                        className={`p-3.5 rounded-xl border text-left cursor-pointer transition-colors ${
                          currentMode === "full"
                            ? "bg-brand/5 border-brand ring-1 ring-brand text-fg"
                            : "bg-surface border-line text-fg hover:bg-surface-2"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold">Pay Full Due</span>
                          <span className="text-xs font-bold text-brand tabular-nums">
                            ৳{inv.due_amount.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-[11px] text-fg-muted">
                          Clear complete outstanding balance in a single transaction.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setMode(inv.id, "partial")}
                        className={`p-3.5 rounded-xl border text-left cursor-pointer transition-colors ${
                          currentMode === "partial"
                            ? "bg-brand/5 border-brand ring-1 ring-brand text-fg"
                            : "bg-surface border-line text-fg hover:bg-surface-2"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold">
                            Pay Partial Installment
                          </span>
                          <span className="text-xs font-semibold text-fg-muted">
                            Min ৳1,000
                          </span>
                        </div>
                        <p className="text-[11px] text-fg-muted">
                          Enter custom amount up to remaining due (৳
                          {inv.due_amount.toLocaleString()}).
                        </p>
                      </button>
                    </div>

                    {/* Custom Amount Input if Partial */}
                    {currentMode === "partial" && (
                      <div className="p-3 rounded-xl bg-surface-2 border border-line space-y-2">
                        <label
                          htmlFor={`custom-amount-${inv.id}`}
                          className="block text-xs font-medium text-fg"
                        >
                          Custom Installment Amount (BDT)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted font-semibold text-sm">
                            ৳
                          </span>
                          <input
                            id={`custom-amount-${inv.id}`}
                            type="number"
                            min={1000}
                            max={inv.due_amount}
                            step={500}
                            value={getCustomAmount(inv)}
                            onChange={(e) => handleAmountChange(inv.id, e.target.value)}
                            className="w-full min-h-[44px] pl-8 pr-4 py-2 rounded-xl border border-line bg-surface text-fg font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                          />
                        </div>
                        {!isAmountValid && (
                          <p className="text-xs text-danger">
                            Please enter an amount between ৳1,000 and ৳
                            {inv.due_amount.toLocaleString()}.
                          </p>
                        )}
                      </div>
                    )}

                    {/* Gateway Launch CTAs */}
                    <div className="pt-2">
                      <p className="text-xs font-medium text-fg-muted mb-2.5">
                        Select Payment Gateway to Proceed:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Button
                          type="button"
                          variant="primary"
                          size="md"
                          disabled={!isAmountValid}
                          leftIcon={<Smartphone className="w-4 h-4 text-white" />}
                          onClick={() => onOpenGateway(inv, resolvedPayable, "bkash")}
                          className="bg-[#E2136E] hover:bg-[#C90E5E] text-white min-h-[44px]"
                        >
                          Pay ৳{resolvedPayable.toLocaleString()} via bKash
                        </Button>

                        <Button
                          type="button"
                          variant="secondary"
                          size="md"
                          disabled={!isAmountValid}
                          leftIcon={<CreditCard className="w-4 h-4 text-brand" />}
                          onClick={() => onOpenGateway(inv, resolvedPayable, "sslcommerz")}
                          className="min-h-[44px] border-line hover:border-brand"
                        >
                          Pay ৳{resolvedPayable.toLocaleString()} via SSLCommerz
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* If already Paid: View Receipt Action */}
                {isPaid && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-success-light/40 border border-success/20">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-success-light text-success border border-success/20 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-fg">
                          Semester Dues Fully Cleared
                        </p>
                        <p className="text-[11px] text-fg-muted">
                          Official receipt generated and stored in university ledger.
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      leftIcon={<Receipt className="w-4 h-4 text-brand" />}
                      onClick={() => onViewReceipt(inv)}
                      className="min-h-[40px]"
                    >
                      View Official Receipt
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
