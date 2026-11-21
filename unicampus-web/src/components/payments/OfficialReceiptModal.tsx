"use client";

import React, { useRef } from "react";
import { CheckCircle2, Download, Printer, ShieldCheck } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PaymentTransaction, SemesterInvoice } from "@/types/admin";
import { CANONICAL_STUDENT } from "@/lib/canonicalCampus";

export interface OfficialReceiptModalProps {
  open: boolean;
  onClose: () => void;
  transaction: PaymentTransaction | null;
  invoice?: SemesterInvoice | null;
}

export function OfficialReceiptModal({
  open,
  onClose,
  transaction,
  invoice,
}: OfficialReceiptModalProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!transaction) return null;

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleDownload = () => {
    if (typeof window === "undefined") return;
    const content = `
============================================================
UNICAMPUS UNIVERSITY OF SCIENCE & TECHNOLOGY
Office of the Controller of Accounts & Finance
OFFICIAL TUITION & FEE PAYMENT RECEIPT
============================================================
Receipt Number  : ${transaction.receipt_number}
Transaction ID  : ${transaction.transaction_id}
Date & Time     : ${new Date(transaction.created_at).toLocaleString()}
Payment Gateway : ${transaction.payment_method}
Payment Status  : ${transaction.status}

STUDENT INFORMATION:
Student Name    : ${transaction.user_name || CANONICAL_STUDENT.name}
Student ID      : ${transaction.student_id || CANONICAL_STUDENT.studentId}
Department      : ${transaction.department_name || CANONICAL_STUDENT.departmentName}
Semester        : ${transaction.semester_name || invoice?.semester_name || "6th Semester"}

FINANCIAL DETAILS:
Amount Paid     : BDT ৳${transaction.amount.toLocaleString()}
Payment Type    : ${transaction.type === "student_fee" ? "Semester Tuition & Fees" : transaction.type}

VERIFICATION:
Verified by UniCampus Central Financial ERP & Digital Ledger
Authorized Signatory: Office of the Controller of Accounts & Finance
============================================================
    `.trim();

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${transaction.receipt_number}_Receipt.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const lineItems = invoice?.line_items || [
    { id: "1", label: "Tuition Fee", category: "Tuition", amount: 32000 },
    { id: "2", label: "Lab & Sessional Fee", category: "Lab", amount: 9000 },
    { id: "3", label: "Examination Fee", category: "Exam", amount: 4500 },
    { id: "4", label: "Library & ICT Resource Fee", category: "Library", amount: 3000 },
  ];

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-brand" />
          <span className="font-semibold text-fg">Official University Payment Receipt</span>
        </div>
      }
      description="Digitally signed and archived in the UniCampus university accounts ledger."
      footer={
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full print:hidden">
          <div className="flex items-center gap-2 text-xs text-fg-muted">
            <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
            <span>Digital Ledger Stamp: Verified &amp; Cleared</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="secondary"
              size="md"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={handleDownload}
            >
              Download
            </Button>
            <Button
              type="button"
              variant="primary"
              size="md"
              leftIcon={<Printer className="w-4 h-4" />}
              onClick={handlePrint}
            >
              Print Receipt
            </Button>
          </div>
        </div>
      }
    >
      <div
        ref={receiptRef}
        id="printable-receipt"
        className="space-y-6 text-fg p-1 sm:p-2"
      >
        {/* Printable Letterhead */}
        <div className="border-b border-line pb-5 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand/10 text-brand font-bold text-xl mb-2">
            UC
          </div>
          <h2 className="text-lg font-semibold tracking-tight text-fg uppercase">
            UniCampus University of Science &amp; Technology
          </h2>
          <p className="text-xs text-fg-muted uppercase tracking-wider mt-0.5">
            Office of the Controller of Accounts &amp; Finance • Digital Billing Division
          </p>
          <div className="inline-block mt-2 px-3 py-1 rounded-full bg-surface-2 border border-line text-xs font-medium text-fg">
            Official Semester Payment Receipt
          </div>
        </div>

        {/* Receipt Header Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-surface-2 border border-line rounded-2xl p-4 text-xs">
          <div>
            <p className="text-fg-muted mb-0.5">Receipt No</p>
            <p className="font-mono font-medium text-fg text-sm">
              {transaction.receipt_number}
            </p>
          </div>
          <div>
            <p className="text-fg-muted mb-0.5">Transaction ID</p>
            <p className="font-mono text-fg break-all text-xs">
              {transaction.transaction_id}
            </p>
          </div>
          <div>
            <p className="text-fg-muted mb-0.5">Payment Method</p>
            <div className="pt-0.5">
              <Badge variant="brand" appearance="soft">
                {transaction.payment_method}
              </Badge>
            </div>
          </div>
          <div>
            <p className="text-fg-muted mb-0.5">Date &amp; Time</p>
            <p className="tabular-nums text-fg font-medium">
              {new Date(transaction.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Student Profile Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-line rounded-2xl p-4 bg-surface">
          <div className="space-y-1">
            <p className="text-xs text-fg-muted">Student Name</p>
            <p className="text-sm font-semibold text-fg">
              {transaction.user_name || CANONICAL_STUDENT.name}
            </p>
            <p className="text-xs text-fg-muted font-mono">
              Student ID: {transaction.student_id || CANONICAL_STUDENT.studentId}
            </p>
          </div>
          <div className="space-y-1 sm:text-right">
            <p className="text-xs text-fg-muted">Academic Department</p>
            <p className="text-sm font-semibold text-fg">
              {transaction.department_name || CANONICAL_STUDENT.departmentName}
            </p>
            <p className="text-xs text-fg-muted">
              Semester: {transaction.semester_name || invoice?.semester_name || "6th Semester"}
            </p>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="border border-line rounded-2xl overflow-hidden bg-surface">
          <div className="bg-surface-2 px-4 py-2.5 border-b border-line flex items-center justify-between text-xs font-semibold text-fg">
            <span>Fee Itemization Breakdown</span>
            <span>Category</span>
          </div>
          <div className="divide-y divide-line text-xs">
            {lineItems.map((item) => (
              <div
                key={item.id}
                className="px-4 py-2.5 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-fg">{item.label}</p>
                  <p className="text-[11px] text-fg-muted">{item.category}</p>
                </div>
                <span className="tabular-nums font-medium text-fg">
                  ৳{item.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
          <div className="bg-surface-2 px-4 py-3 border-t border-line flex items-center justify-between text-sm">
            <span className="font-semibold text-fg">Amount Paid This Transaction</span>
            <span className="tabular-nums font-bold text-base text-success">
              ৳{transaction.amount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Verification Stamp & Signatory */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-line">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-2xl border-2 border-brand/30 bg-brand/5 flex flex-col items-center justify-center text-[9px] uppercase tracking-wider text-brand font-bold text-center leading-tight p-1 select-none">
              <span>UniCampus</span>
              <span>Finance</span>
              <span className="text-[7px] text-success">✓ Cleared</span>
            </div>
            <div className="text-xs text-fg-muted space-y-0.5">
              <p className="font-medium text-fg">Accounts &amp; Finance Seal</p>
              <p>Digitally Authenticated by Controller</p>
              <p className="font-mono text-[11px] text-fg-subtle">
                HASH: {transaction.id}
              </p>
            </div>
          </div>

          <div className="text-right text-xs text-fg-muted">
            <p className="font-medium text-fg">Authorized Signatory</p>
            <p className="italic font-serif text-fg-subtle mt-1 text-sm">
              S. T. Islam
            </p>
            <p className="text-[11px]">UniCampus Financial Controller</p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
