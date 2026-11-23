"use client";

import { Select } from "@/components/ui/Select";

import React, { useState } from "react";
import {
  Smartphone,
  ShieldCheck,
  Building,
  CheckCircle2,
  RefreshCw,
  Terminal,
  Activity,
  ArrowUpRight,
  Receipt,
  Play,
  Lock,
} from "lucide-react";
import { adminService } from "@/lib/services/adminService";
import type { Department, OrdinalSemesterName, PaymentTransaction } from "@/types/admin";

interface GatewayConfigPanelProps {
  departments: Department[];
  transactions: PaymentTransaction[];
  onViewReceipt: (t: PaymentTransaction) => void;
  onPaymentRecorded: (t: PaymentTransaction) => void;
  showToast: (msg: string) => void;
}

export function GatewayConfigPanel({
  departments,
  transactions,
  onViewReceipt,
  onPaymentRecorded,
  showToast,
}: GatewayConfigPanelProps) {
  // Test Checkout Form State
  const [selectedGateway, setSelectedGateway] = useState<"bKash" | "SSLCommerz">("bKash");
  const [testStudentName, setTestStudentName] = useState("Sakib Al Hasan");
  const [testStudentId, setTestStudentId] = useState("STU-2024-001");
  const [testDept, setTestDept] = useState(departments[0]?.name || "Computer Science & Engineering");
  const [testSemester, setTestSemester] = useState<OrdinalSemesterName>("4th Semester");
  const [testAmount, setTestAmount] = useState<string>("15000");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationLog, setSimulationLog] = useState<{
    status: "idle" | "running" | "success";
    ipnPayload?: Record<string, unknown>;
    createdTxn?: PaymentTransaction;
  }>({ status: "idle" });

  const handleRunSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSimulating(true);
    setSimulationLog({ status: "running" });

    const amountNum = parseFloat(testAmount) || 15000;
    const dateTag = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    const randomReceipt = Math.floor(100000 + Math.random() * 900000);

    const generatedTrxId = `TXN-${dateTag}-${randomHex}`;
    const generatedReceiptNo = `REC-${randomReceipt}`;

    // Simulate 400ms network delay for realistic gateway webhook IPN response
    setTimeout(() => {
      const newTxn = adminService.createTransaction({
        transaction_id: generatedTrxId,
        receipt_number: generatedReceiptNo,
        user_name: testStudentName.trim() || "Sakib Al Hasan",
        student_id: testStudentId.trim() || "STU-2024-001",
        user_id: `stu-sandbox-${Date.now()}`,
        department_name: testDept,
        semester_name: testSemester,
        type: "student_fee",
        amount: amountNum,
        payment_method: selectedGateway,
        status: "Paid",
      });

      const mockIpn = {
        gateway: selectedGateway,
        mode: "sandbox",
        httpStatus: 200,
        webhookUrl: selectedGateway === "bKash"
          ? "https://unicampus.edu.bd/api/webhooks/bkash"
          : "https://unicampus.edu.bd/api/webhooks/sslcommerz",
        ipnPayload: selectedGateway === "bKash"
          ? {
              statusCode: "0000",
              statusMessage: "Successful",
              paymentID: `BKASH-SB-${Math.floor(100000000 + Math.random() * 900000000)}`,
              trxID: generatedTrxId,
              amount: `${amountNum}.00`,
              currency: "BDT",
              intent: "sale",
              paymentExecuteTime: new Date().toISOString(),
              merchantInvoiceNumber: `INV-${randomReceipt}`,
              verificationSignature: "RSA2048-VALID-HASH",
            }
          : {
              status: "VALID",
              tran_id: generatedTrxId,
              val_id: `SSL-${Math.floor(10000000 + Math.random() * 90000000)}`,
              amount: `${amountNum}.00`,
              card_type: "BKASH-BKash",
              store_id: "unicampus_sandbox_01",
              bank_tran_id: `BAN-${randomHex}`,
              status_code: "200",
            },
      };

      setSimulationLog({
        status: "success",
        ipnPayload: mockIpn,
        createdTxn: newTxn,
      });
      setIsSimulating(false);
      onPaymentRecorded(newTxn);
      showToast(`Sandbox checkout simulated! Received HTTP 200 IPN for ${generatedTrxId}.`);
    }, 450);
  };

  // Reconciled transactions count
  const bkashCount = transactions.filter((t) => t.payment_method === "bKash").length;
  const sslCount = transactions.filter((t) => t.payment_method === "SSLCommerz").length;

  return (
    <div className="space-y-5">
      {/* Overview Cards Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Card 1: bKash Sandbox */}
        <div className="p-4 rounded-2xl bg-surface border border-line space-y-3">
          <div className="flex items-center justify-between">
            <span className="w-8 h-8 rounded-xl bg-[#E2136E]/10 border border-[#E2136E]/20 text-[#E2136E] flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold bg-success-light text-success border border-success/20">
              <span className="w-1.5 h-1.5 rounded-full bg-success" />
              Sandbox Active
            </span>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-fg">
              bKash Tokenized Checkout
            </h3>
            <p className="text-xs text-fg-muted mt-0.5">
              PGW Direct Tokenized API v1.2.0-beta
            </p>
          </div>

          <div className="space-y-1.5 text-xs border-t border-line pt-2 text-fg-muted">
            <div className="flex justify-between">
              <span>App Key:</span>
              <span className="font-mono text-fg">bkash_sb_••••4921</span>
            </div>
            <div className="flex justify-between">
              <span>Webhook IPN:</span>
              <span className="font-mono text-success">HTTP 200 (Active)</span>
            </div>
            <div className="flex justify-between">
              <span>Settled Vouchers:</span>
              <span className="font-semibold text-fg tabular-nums">{bkashCount} records</span>
            </div>
          </div>
        </div>

        {/* Card 2: SSLCommerz Sandbox */}
        <div className="p-4 rounded-2xl bg-surface border border-line space-y-3">
          <div className="flex items-center justify-between">
            <span className="w-8 h-8 rounded-xl bg-[#005B99]/10 border border-[#005B99]/20 text-[#005B99] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold bg-success-light text-success border border-success/20">
              <span className="w-1.5 h-1.5 rounded-full bg-success" />
              Sandbox Active
            </span>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-fg">
              SSLCommerz Hosted Checkout
            </h3>
            <p className="text-xs text-fg-muted mt-0.5">
              Multi-channel Gateway (Cards, Nagad, Rocket)
            </p>
          </div>

          <div className="space-y-1.5 text-xs border-t border-line pt-2 text-fg-muted">
            <div className="flex justify-between">
              <span>Store ID:</span>
              <span className="font-mono text-fg">unicampus_sandbox_01</span>
            </div>
            <div className="flex justify-between">
              <span>IPN Listener:</span>
              <span className="font-mono text-success">Validated (Active)</span>
            </div>
            <div className="flex justify-between">
              <span>Settled Vouchers:</span>
              <span className="font-semibold text-fg tabular-nums">{sslCount} records</span>
            </div>
          </div>
        </div>

        {/* Card 3: Counter Cash & Bank Desk */}
        <div className="p-4 rounded-2xl bg-surface border border-line space-y-3">
          <div className="flex items-center justify-between">
            <span className="w-8 h-8 rounded-xl bg-brand-soft border border-brand/20 text-brand flex items-center justify-center">
              <Building className="w-4 h-4" />
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold bg-brand-soft text-brand border border-brand/20">
              Counter Active
            </span>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-fg">
              Accounts Counter &amp; Bank Clearing
            </h3>
            <p className="text-xs text-fg-muted mt-0.5">
              Central University Treasury Desk (Room 204)
            </p>
          </div>

          <div className="space-y-1.5 text-xs border-t border-line pt-2 text-fg-muted">
            <div className="flex justify-between">
              <span>Reconciliation Mode:</span>
              <span className="font-semibold text-fg">Instant Counter Batch</span>
            </div>
            <div className="flex justify-between">
              <span>Bank Clearing:</span>
              <span className="font-mono text-fg">BEFTN / RTGS</span>
            </div>
            <div className="flex justify-between">
              <span>Reconciliation Health:</span>
              <span className="font-semibold text-success">100% Synced</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive "Test Sandbox Checkout" Console */}
      <div className="p-5 rounded-2xl bg-surface border border-line space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-line">
          <div>
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-brand" />
              <h3 className="text-sm font-semibold text-fg">
                Test Sandbox Checkout &amp; Webhook IPN Simulator
              </h3>
            </div>
            <p className="text-xs text-fg-muted mt-1">
              Simulate an end-to-end student payment transaction, trigger automated webhook callbacks, and verify real-time treasury ledger updates.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs text-fg-muted">
              <Lock className="w-3 h-3 text-success" /> End-to-End Test Harness
            </span>
          </div>
        </div>

        <form onSubmit={handleRunSimulation} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {/* Gateway Selector */}
            <div>
              <label
                htmlFor="sandbox-gateway-choice"
                className="block text-xs font-semibold text-fg-muted mb-1"
              >
                Sandbox Gateway
              </label>
              <Select
                id="sandbox-gateway-choice"
                ariaLabel="Sandbox Gateway"
                value={selectedGateway}
                onChange={(val) => setSelectedGateway(val as "bKash" | "SSLCommerz")}
                options={[
                  { value: "bKash", label: "bKash Tokenized Checkout (Sandbox)" },
                  { value: "SSLCommerz", label: "SSLCommerz Hosted Checkout (Sandbox)" },
                ]}
                size="md"
                variant="surface2"
              />
            </div>

            {/* Student Name */}
            <div>
              <label
                htmlFor="sandbox-student-name"
                className="block text-xs font-semibold text-fg-muted mb-1"
              >
                Student Name
              </label>
              <input
                id="sandbox-student-name"
                type="text"
                required
                value={testStudentName}
                onChange={(e) => setTestStudentName(e.target.value)}
                className="w-full min-h-[40px] px-3 py-2 rounded-xl bg-canvas border border-line text-xs text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              />
            </div>

            {/* Student ID */}
            <div>
              <label
                htmlFor="sandbox-student-id"
                className="block text-xs font-semibold text-fg-muted mb-1"
              >
                Student ID
              </label>
              <input
                id="sandbox-student-id"
                type="text"
                required
                value={testStudentId}
                onChange={(e) => setTestStudentId(e.target.value)}
                className="w-full min-h-[40px] px-3 py-2 rounded-xl bg-canvas border border-line text-xs text-fg font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              />
            </div>

            {/* Department */}
            <div>
              <label
                htmlFor="sandbox-dept"
                className="block text-xs font-semibold text-fg-muted mb-1"
              >
                Department
              </label>
              <Select
                id="sandbox-dept"
                ariaLabel="Department"
                value={testDept}
                onChange={setTestDept}
                options={departments.map((d) => ({
                  value: d.name,
                  label: `${d.name} (${d.code})`,
                }))}
                size="md"
                variant="surface2"
              />
            </div>

            {/* Semester */}
            <div>
              <label
                htmlFor="sandbox-semester"
                className="block text-xs font-semibold text-fg-muted mb-1"
              >
                Semester
              </label>
              <Select
                id="sandbox-semester"
                ariaLabel="Semester"
                value={testSemester}
                onChange={(val) => setTestSemester(val as OrdinalSemesterName)}
                options={adminService
                  .getDepartmentSemesters(testDept)
                  .map((s) => ({
                    value: s,
                    label: s,
                  }))}
                size="md"
                variant="surface2"
              />
            </div>

            {/* Amount */}
            <div>
              <label
                htmlFor="sandbox-amount"
                className="block text-xs font-semibold text-fg-muted mb-1"
              >
                Test Amount (BDT)
              </label>
              <input
                id="sandbox-amount"
                type="number"
                min="500"
                step="500"
                required
                value={testAmount}
                onChange={(e) => setTestAmount(e.target.value)}
                className="w-full min-h-[40px] px-3 py-2 rounded-xl bg-canvas border border-line text-xs text-fg tabular-nums font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-fg-muted">
              Simulates real webhook dispatch, voucher generation, and event firing (<code className="font-mono text-brand">unicampus:finance-updated</code>).
            </span>

            <button
              type="submit"
              disabled={isSimulating}
              className="min-h-[40px] px-4 py-2 bg-brand text-on-brand hover:bg-brand-hover rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:opacity-50"
            >
              {isSimulating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Simulating Webhook IPN...
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  Test Sandbox Checkout
                </>
              )}
            </button>
          </div>
        </form>

        {/* Simulation Output Log Panel */}
        {simulationLog.status === "success" && simulationLog.createdTxn && (
          <div className="p-4 rounded-xl bg-canvas border border-line space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-success">
                <CheckCircle2 className="w-4 h-4" />
                <span>Simulation Succeeded • Webhook Handled (HTTP 200 OK)</span>
              </div>
              <button
                type="button"
                onClick={() => onViewReceipt(simulationLog.createdTxn!)}
                className="text-xs font-semibold text-brand hover:underline flex items-center gap-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded px-1"
              >
                <Receipt className="w-3 h-3" /> View Generated Voucher <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-surface border border-line space-y-1">
                <div className="text-fg-muted font-semibold">Ledger Entry Created</div>
                <div className="flex justify-between">
                  <span className="text-fg-muted">Transaction ID:</span>
                  <span className="font-mono font-semibold text-brand">
                    {simulationLog.createdTxn.transaction_id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-fg-muted">Receipt Number:</span>
                  <span className="font-mono font-semibold text-fg">
                    {simulationLog.createdTxn.receipt_number}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-fg-muted">Settled Amount:</span>
                  <span className="font-semibold text-fg tabular-nums">
                    ৳{simulationLog.createdTxn.amount.toLocaleString()} BDT
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-surface border border-line space-y-1">
                <div className="text-fg-muted font-semibold">Simulated Gateway Response (IPN)</div>
                <pre className="text-xs font-mono text-fg-muted overflow-x-auto max-h-24 p-1 bg-canvas rounded">
                  {JSON.stringify(simulationLog.ipnPayload, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Gateway Architecture & Security Overview */}
      <div className="p-5 rounded-2xl bg-surface border border-line space-y-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-brand" />
          <h3 className="text-sm font-semibold text-fg">
            Treasury Gateway Architecture &amp; PCI-DSS Compliance
          </h3>
        </div>
        <p className="text-xs text-fg-muted leading-relaxed">
          UniCampus routes student tuition settlements through zero-redirection tokenized APIs and SSL encrypted checkout sessions.
          No raw card or mobile wallet credentials are stored locally. All payment records are verified using webhook SHA-256 IPN signatures
          and cross-checked against departmental semester dues before official fee clearance receipts are minted.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-canvas border border-line text-xs">
            <div className="font-semibold text-fg">bKash PGW v1.2.0</div>
            <div className="text-fg-muted mt-0.5">RSA-2048 Tokenized • Instant settlement</div>
          </div>
          <div className="p-3 rounded-xl bg-canvas border border-line text-xs">
            <div className="font-semibold text-fg">SSLCommerz Hosted</div>
            <div className="text-fg-muted mt-0.5">TLS 1.3 • Visa / Mastercard / MFS</div>
          </div>
          <div className="p-3 rounded-xl bg-canvas border border-line text-xs">
            <div className="font-semibold text-fg">Cashier Counter Sync</div>
            <div className="text-fg-muted mt-0.5">Physical desk clearance with instant voucher</div>
          </div>
        </div>
      </div>
    </div>
  );
}
