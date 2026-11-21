"use client";

import React, { useState, useEffect, useCallback } from "react";
import { CheckCircle2, CreditCard } from "lucide-react";
import { CANONICAL_STUDENT, ACTIVE_TERM } from "@/lib/canonicalCampus";
import { studentPaymentService } from "@/lib/services/studentPaymentService";
import { PaymentTransaction, SemesterInvoice } from "@/types/admin";
import { Tabs, TabOption } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { PaymentKpiStrip } from "@/components/payments/PaymentKpiStrip";
import { SemesterFeesTab } from "@/components/payments/SemesterFeesTab";
import { PaymentHistoryTab } from "@/components/payments/PaymentHistoryTab";
import { PaymentMethodsGuideTab } from "@/components/payments/PaymentMethodsGuideTab";
import { PaymentGatewayModal } from "@/components/payments/PaymentGatewayModal";
import { OfficialReceiptModal } from "@/components/payments/OfficialReceiptModal";

type PaymentTabKey = "semesters" | "history" | "guide";

const PAYMENT_TABS: readonly TabOption<PaymentTabKey>[] = [
  { id: "semesters", label: "Semester-Wise Fees & Dues" },
  { id: "history", label: "Payment History & Receipts" },
  { id: "guide", label: "Payment Methods & Sandbox Guide" },
] as const;

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState<PaymentTabKey>("semesters");
  const [invoices, setInvoices] = useState<SemesterInvoice[]>([]);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Gateway Modal State
  const [isGatewayOpen, setIsGatewayOpen] = useState(false);
  const [gatewayInvoice, setGatewayInvoice] = useState<SemesterInvoice | null>(null);
  const [gatewayAmount, setGatewayAmount] = useState<number>(0);
  const [gatewayInitialChannel, setGatewayInitialChannel] = useState<
    "bkash" | "sslcommerz"
  >("bkash");

  // Receipt Modal State
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [activeReceiptTransaction, setActiveReceiptTransaction] =
    useState<PaymentTransaction | null>(null);
  const [activeReceiptInvoice, setActiveReceiptInvoice] =
    useState<SemesterInvoice | null>(null);

  const loadPaymentData = useCallback(() => {
    const invs = studentPaymentService.getInvoices();
    const txns = studentPaymentService.getStudentTransactions();
    setInvoices(invs);
    setTransactions(txns);
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      loadPaymentData();

      // Check callback parameters from SSLCommerz or bKash
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const status = params.get("status");
        const tranId = params.get("tran_id");
        if (status === "VALID") {
          setToastMessage(
            `Payment completed successfully! Transaction ID: ${tranId || "Verified"}`
          );
          setTimeout(() => setToastMessage(null), 4000);
        } else if (status === "FAILED" || status === "CANCELLED") {
          setToastMessage("Payment transaction was cancelled or declined.");
          setTimeout(() => setToastMessage(null), 4000);
        }
      }
    });

    const handleFinanceUpdated = () => {
      loadPaymentData();
    };
    window.addEventListener("unicampus:finance-updated", handleFinanceUpdated);
    return () => {
      window.removeEventListener("unicampus:finance-updated", handleFinanceUpdated);
    };
  }, [loadPaymentData]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  const currentSemesterInvoice = invoices[0] || null;
  const currentSemesterDue = currentSemesterInvoice?.due_amount || 0;

  // Open Gateway Handler
  const handleOpenGateway = useCallback(
    (
      invoice: SemesterInvoice,
      amount: number,
      gateway: "bkash" | "sslcommerz" = "bkash"
    ) => {
      setGatewayInvoice(invoice);
      setGatewayAmount(amount);
      setGatewayInitialChannel(gateway);
      setIsGatewayOpen(true);
    },
    []
  );

  // Top CTA Click: pay current semester due
  const handleTopCtaPay = () => {
    if (currentSemesterInvoice && currentSemesterDue > 0) {
      handleOpenGateway(currentSemesterInvoice, currentSemesterDue, "bkash");
    }
  };

  // Payment Completed Handler
  const handlePaymentSuccess = useCallback(
    (newTxn: PaymentTransaction, updatedInvoice: SemesterInvoice) => {
      loadPaymentData();
      showToast(
        `Payment of ৳${newTxn.amount.toLocaleString()} confirmed! Receipt ${newTxn.receipt_number} generated.`
      );
      // Automatically open receipt
      setActiveReceiptTransaction(newTxn);
      setActiveReceiptInvoice(updatedInvoice);
      setIsReceiptOpen(true);
    },
    [loadPaymentData, showToast]
  );

  // View Receipt for a semester invoice
  const handleViewSemesterReceipt = useCallback(
    (invoice: SemesterInvoice) => {
      // Find matching transaction
      const match = transactions.find(
        (t) =>
          t.semester_name === invoice.semester_name ||
          t.receipt_number === invoice.invoice_no
      );
      if (match) {
        setActiveReceiptTransaction(match);
        setActiveReceiptInvoice(invoice);
        setIsReceiptOpen(true);
      } else {
        // Fallback synthetic transaction
        const fallbackTxn: PaymentTransaction = {
          id: `txn-${invoice.id}`,
          transaction_id: `TXN-${invoice.last_paid_at?.slice(0, 10).replace(/-/g, "") || "20261017"}-1042`,
          receipt_number: `REC-${invoice.invoice_no.slice(-6)}`,
          user_name: invoice.student_name,
          student_id: invoice.student_id,
          user_id: CANONICAL_STUDENT.id,
          department_name: invoice.department_name,
          semester_name: invoice.semester_name,
          type: "student_fee",
          amount: invoice.paid_amount,
          payment_method: "bKash",
          status: "Paid",
          created_at: invoice.last_paid_at || new Date().toISOString(),
        };
        setActiveReceiptTransaction(fallbackTxn);
        setActiveReceiptInvoice(invoice);
        setIsReceiptOpen(true);
      }
    },
    [transactions]
  );

  // View Receipt directly from transaction row
  const handleViewTransactionReceipt = useCallback(
    (transaction: PaymentTransaction) => {
      const matchInv = invoices.find(
        (inv) => inv.semester_name === transaction.semester_name
      );
      setActiveReceiptTransaction(transaction);
      setActiveReceiptInvoice(matchInv || null);
      setIsReceiptOpen(true);
    },
    [invoices]
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Feedback */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-surface border border-line shadow-md text-sm text-fg flex items-center gap-3 max-w-md"
        >
          <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-semibold text-fg tracking-tight">
            Tuition &amp; Fee Payments
          </h1>
          <p className="text-xs sm:text-sm text-fg-muted mt-1">
            {CANONICAL_STUDENT.name} • {CANONICAL_STUDENT.studentId} • Dept. of{" "}
            {CANONICAL_STUDENT.departmentName} • {ACTIVE_TERM}
          </p>
        </div>

        {/* Primary CTA */}
        <div>
          {currentSemesterDue > 0 ? (
            <Button
              type="button"
              variant="primary"
              size="md"
              leftIcon={<CreditCard className="w-4 h-4 text-on-brand" />}
              onClick={handleTopCtaPay}
              className="bg-brand hover:bg-brand-hover text-on-brand rounded-xl min-h-[44px] px-4 font-semibold shadow-xs"
            >
              Pay Current Due (৳{currentSemesterDue.toLocaleString()})
            </Button>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-success-light border border-success/20 text-success text-sm font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>All Dues Cleared</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Top KPI Summary Strip */}
      <PaymentKpiStrip invoices={invoices} transactions={transactions} />

      {/* 3. Segmented Navigation Tabs */}
      <div className="pt-2">
        <Tabs
          tabs={PAYMENT_TABS}
          value={activeTab}
          onChange={(tab) => setActiveTab(tab)}
          variant="segmented"
          size="md"
          ariaLabel="Tuition payment sections"
        />
      </div>

      {/* Tab Panels */}
      {activeTab === "semesters" && (
        <SemesterFeesTab
          invoices={invoices}
          onOpenGateway={handleOpenGateway}
          onViewReceipt={handleViewSemesterReceipt}
        />
      )}

      {activeTab === "history" && (
        <PaymentHistoryTab
          transactions={transactions}
          onViewReceipt={handleViewTransactionReceipt}
        />
      )}

      {activeTab === "guide" && <PaymentMethodsGuideTab />}

      {/* Modals */}
      {gatewayInvoice && (
        <PaymentGatewayModal
          open={isGatewayOpen}
          onClose={() => setIsGatewayOpen(false)}
          invoice={gatewayInvoice}
          payableAmount={gatewayAmount}
          initialGateway={gatewayInitialChannel}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {activeReceiptTransaction && (
        <OfficialReceiptModal
          open={isReceiptOpen}
          onClose={() => setIsReceiptOpen(false)}
          transaction={activeReceiptTransaction}
          invoice={activeReceiptInvoice}
        />
      )}
    </div>
  );
}
