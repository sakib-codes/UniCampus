"use client";

import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  CheckCircle2,
  CreditCard,
  Info,
  Lock,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PaymentTransaction, SemesterInvoice } from "@/types/admin";
import { studentPaymentService } from "@/lib/services/studentPaymentService";
import { CANONICAL_STUDENT } from "@/lib/canonicalCampus";

export interface PaymentGatewayModalProps {
  open: boolean;
  onClose: () => void;
  invoice: SemesterInvoice;
  payableAmount: number;
  initialGateway?: "bkash" | "sslcommerz";
  onSuccess: (transaction: PaymentTransaction, invoice: SemesterInvoice) => void;
}

export function PaymentGatewayModal({
  open,
  onClose,
  invoice,
  payableAmount,
  initialGateway = "bkash",
  onSuccess,
}: PaymentGatewayModalProps) {
  const [selectedGateway, setSelectedGateway] = useState<"bkash" | "sslcommerz">(
    initialGateway
  );

  // bKash Flow States
  const [bkashStep, setBkashStep] = useState<"wallet" | "otp" | "pin">("wallet");
  const [bkashWallet, setBkashWallet] = useState("01770771960");
  const [bkashOtp, setBkashOtp] = useState("123456");
  const [bkashPin, setBkashPin] = useState("12121");
  const [bkashPaymentId, setBkashPaymentId] = useState("");

  // SSLCommerz Flow States
  const [sslTab, setSslTab] = useState<"card" | "mobile" | "netbanking">("card");
  const [cardNumber, setCardNumber] = useState("4012 8888 8888 1881");
  const [cardHolder, setCardHolder] = useState<string>(CANONICAL_STUDENT.name);
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvv, setCardCvv] = useState("123");
  const [mobileProvider, setMobileProvider] = useState("bkash");
  const [mobileNumber, setMobileNumber] = useState("01712904511");
  const [bankName, setBankName] = useState("BRAC Bank");

  // Common UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync initial gateway when opened
  useEffect(() => {
    if (open) {
      queueMicrotask(() => {
        setSelectedGateway(initialGateway);
        setBkashStep("wallet");
        setBkashWallet("01770771960");
        setBkashOtp("123456");
        setBkashPin("12121");
        setError(null);
        setLoading(false);
      });
    }
  }, [open, initialGateway]);

  // bKash Step 1: Initialize Payment
  const handleBkashStart = async () => {
    if (!bkashWallet || bkashWallet.length < 11) {
      setError("Please enter a valid 11-digit bKash wallet number.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/payments/bkash/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId: invoice.invoice_no,
          amount: payableAmount,
          payerReference: bkashWallet,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.mode === "live_sandbox" && data.redirectUrl) {
        window.location.href = data.redirectUrl;
        return;
      }

      setBkashPaymentId(data.paymentID || `TR-BKASH-${Date.now()}`);
      setBkashStep("otp");
    } catch {
      setLoading(false);
      setBkashPaymentId(`TR-BKASH-${Date.now()}`);
      setBkashStep("otp");
    }
  };

  // bKash Step 2: Verify OTP
  const handleBkashVerifyOtp = () => {
    if (bkashOtp !== "123456") {
      setError("Invalid sandbox OTP. Sandbox test OTP is: 123456");
      return;
    }
    setError(null);
    setBkashStep("pin");
  };

  // bKash Step 3: Execute Payment with PIN
  const handleBkashExecute = async () => {
    if (bkashPin !== "12121") {
      setError("Invalid sandbox PIN. Sandbox test PIN is: 12121");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/payments/bkash/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentID: bkashPaymentId || `TR-BKASH-${Date.now()}`,
          otp: bkashOtp,
          pin: bkashPin,
          mode: "interactive_demo",
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok && data.status === "Completed") {
        const recorded = studentPaymentService.recordGatewayPayment({
          invoiceId: invoice.id,
          amount: payableAmount,
          gateway: "bkash",
          trxId: data.trxID,
        });
        onSuccess(recorded.transaction, recorded.invoice);
        onClose();
      } else {
        setError(data.message || "bKash sandbox payment failed.");
      }
    } catch {
      setLoading(false);
      const recorded = studentPaymentService.recordGatewayPayment({
        invoiceId: invoice.id,
        amount: payableAmount,
        gateway: "bkash",
      });
      onSuccess(recorded.transaction, recorded.invoice);
      onClose();
    }
  };

  // SSLCommerz Init & Execution
  const handleSslSimulate = async (shouldSucceed: boolean) => {
    setError(null);
    setLoading(true);

    if (!shouldSucceed) {
      setTimeout(() => {
        setLoading(false);
        setError("Transaction cancelled by user or declined by issuing bank (Simulated Sandbox Failure).");
      }, 700);
      return;
    }

    try {
      const res = await fetch("/api/payments/sslcommerz/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: payableAmount,
          invoiceId: invoice.invoice_no,
          studentName: CANONICAL_STUDENT.name,
          studentEmail: CANONICAL_STUDENT.email,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.mode === "live_sandbox" && data.redirectUrl) {
        window.location.href = data.redirectUrl;
        return;
      }

      // Complete interactive simulation
      const recorded = studentPaymentService.recordGatewayPayment({
        invoiceId: invoice.id,
        amount: payableAmount,
        gateway: "sslcommerz",
        trxId: data.tran_id,
      });

      onSuccess(recorded.transaction, recorded.invoice);
      onClose();
    } catch {
      setLoading(false);
      const recorded = studentPaymentService.recordGatewayPayment({
        invoiceId: invoice.id,
        amount: payableAmount,
        gateway: "sslcommerz",
      });
      onSuccess(recorded.transaction, recorded.invoice);
      onClose();
    }
  };

  const autofillSslTestCard = () => {
    setCardNumber("4012 8888 8888 1881");
    setCardExpiry("12/28");
    setCardCvv("123");
    setCardHolder(CANONICAL_STUDENT.name);
    setError(null);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      title={
        <div className="flex items-center justify-between w-full pr-2">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-brand" />
            <span className="font-semibold text-fg">Secure Payment Sandbox</span>
          </div>
          <Badge variant="brand" appearance="soft">
            ৳{payableAmount.toLocaleString()} BDT
          </Badge>
        </div>
      }
      description={`Paying ${invoice.semester_name} fee invoice (${invoice.invoice_no})`}
    >
      <div className="space-y-4">
        {/* Gateway Selector Segmented Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-surface-2 border border-line rounded-2xl">
          <button
            type="button"
            onClick={() => {
              setSelectedGateway("bkash");
              setError(null);
            }}
            className={`min-h-[44px] px-3 py-2 rounded-xl text-sm font-semibold cursor-pointer transition-colors flex items-center justify-center gap-2 ${
              selectedGateway === "bkash"
                ? "bg-surface text-[#E2136E] border border-line shadow-xs font-bold"
                : "text-fg-muted hover:text-fg hover:bg-surface/50"
            }`}
          >
            <Smartphone className="w-4 h-4 text-[#E2136E]" />
            <span>bKash Sandbox</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedGateway("sslcommerz");
              setError(null);
            }}
            className={`min-h-[44px] px-3 py-2 rounded-xl text-sm font-semibold cursor-pointer transition-colors flex items-center justify-center gap-2 ${
              selectedGateway === "sslcommerz"
                ? "bg-surface text-brand border border-line shadow-xs font-bold"
                : "text-fg-muted hover:text-fg hover:bg-surface/50"
            }`}
          >
            <CreditCard className="w-4 h-4 text-brand" />
            <span>SSLCommerz Sandbox</span>
          </button>
        </div>

        {/* Error Callout */}
        {error && (
          <div className="p-3 rounded-xl bg-danger-light border border-danger/20 text-danger text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* ======================= BKASH SANDBOX FLOW ======================= */}
        {selectedGateway === "bkash" && (
          <div className="border border-line rounded-2xl overflow-hidden bg-surface">
            {/* Authentic bKash Brand Header ONLY inside this gateway container */}
            <div className="bg-[#E2136E] text-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider font-semibold opacity-90">
                    bKash Tokenized Checkout
                  </p>
                  <p className="text-lg font-bold">৳{payableAmount.toLocaleString()} BDT</p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-medium border border-white/30">
                    Sandbox Mode
                  </span>
                  <p className="text-[11px] opacity-80 mt-1">Invoice: {invoice.invoice_no}</p>
                </div>
              </div>
            </div>

            {/* bKash Body Steps */}
            <div className="p-5 space-y-4">
              {bkashStep === "wallet" && (
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="bkash-wallet-input"
                      className="block text-xs font-medium text-fg mb-1.5"
                    >
                      Your bKash Account Number
                    </label>
                    <div className="relative">
                      <input
                        id="bkash-wallet-input"
                        type="tel"
                        value={bkashWallet}
                        onChange={(e) => setBkashWallet(e.target.value)}
                        placeholder="e.g. 01770771960"
                        className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-line bg-surface text-fg font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-2 border border-line text-xs text-fg-muted space-y-1">
                    <div className="flex items-center gap-1.5 font-medium text-fg">
                      <Info className="w-3.5 h-3.5 text-brand" />
                      <span>Sandbox Test Account:</span>
                    </div>
                    <p>
                      Use any standard BD number or the default test wallet (
                      <span className="font-mono text-fg">01770771960</span>).
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    fullWidth
                    loading={loading}
                    onClick={handleBkashStart}
                    className="bg-[#E2136E] hover:bg-[#C90E5E] text-white"
                  >
                    Proceed to Verification
                  </Button>
                </div>
              )}

              {bkashStep === "otp" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-fg-muted">Wallet: {bkashWallet}</span>
                    <button
                      type="button"
                      onClick={() => setBkashStep("wallet")}
                      className="text-brand hover:underline cursor-pointer"
                    >
                      Change
                    </button>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="bkash-otp-input"
                        className="text-xs font-medium text-fg"
                      >
                        Enter 6-digit Sandbox OTP
                      </label>
                      <Badge variant="brand" appearance="soft" className="text-[11px]">
                        Hint: 123456
                      </Badge>
                    </div>
                    <input
                      id="bkash-otp-input"
                      type="text"
                      maxLength={6}
                      value={bkashOtp}
                      onChange={(e) => setBkashOtp(e.target.value)}
                      placeholder="123456"
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-line bg-surface text-fg font-mono text-center tracking-widest text-lg font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    />
                  </div>

                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    fullWidth
                    onClick={handleBkashVerifyOtp}
                    className="bg-[#E2136E] hover:bg-[#C90E5E] text-white"
                  >
                    Confirm OTP
                  </Button>
                </div>
              )}

              {bkashStep === "pin" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-fg-muted">Wallet: {bkashWallet}</span>
                    <span className="text-success flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> OTP Verified
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="bkash-pin-input"
                        className="text-xs font-medium text-fg"
                      >
                        Enter 5-digit bKash Sandbox PIN
                      </label>
                      <Badge variant="brand" appearance="soft" className="text-[11px]">
                        Hint: 12121
                      </Badge>
                    </div>
                    <input
                      id="bkash-pin-input"
                      type="password"
                      maxLength={5}
                      value={bkashPin}
                      onChange={(e) => setBkashPin(e.target.value)}
                      placeholder="•••••"
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-line bg-surface text-fg font-mono text-center tracking-widest text-lg font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    />
                  </div>

                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    fullWidth
                    loading={loading}
                    onClick={handleBkashExecute}
                    className="bg-[#E2136E] hover:bg-[#C90E5E] text-white"
                  >
                    Confirm &amp; Pay ৳{payableAmount.toLocaleString()}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===================== SSLCOMMERZ SANDBOX FLOW ===================== */}
        {selectedGateway === "sslcommerz" && (
          <div className="border border-line rounded-2xl overflow-hidden bg-surface">
            {/* SSLCommerz Header Banner */}
            <div className="bg-surface-2 p-4 border-b border-line flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-fg-muted">
                  SSLCommerz Multi-Channel Payment
                </p>
                <p className="text-sm font-bold text-fg">
                  Total Payable: ৳{payableAmount.toLocaleString()} BDT
                </p>
              </div>
              <Badge variant="brand" appearance="soft">
                Sandbox Environment
              </Badge>
            </div>

            {/* Channels Navigation */}
            <div className="flex border-b border-line bg-surface-2/50 text-xs">
              <button
                type="button"
                onClick={() => setSslTab("card")}
                className={`flex-1 min-h-[40px] px-3 py-2 font-medium cursor-pointer border-b-2 text-center transition-colors ${
                  sslTab === "card"
                    ? "border-brand text-brand font-semibold bg-surface"
                    : "border-transparent text-fg-muted hover:text-fg"
                }`}
              >
                Cards (Visa/MC)
              </button>
              <button
                type="button"
                onClick={() => setSslTab("mobile")}
                className={`flex-1 min-h-[40px] px-3 py-2 font-medium cursor-pointer border-b-2 text-center transition-colors ${
                  sslTab === "mobile"
                    ? "border-brand text-brand font-semibold bg-surface"
                    : "border-transparent text-fg-muted hover:text-fg"
                }`}
              >
                Mobile Banking
              </button>
              <button
                type="button"
                onClick={() => setSslTab("netbanking")}
                className={`flex-1 min-h-[40px] px-3 py-2 font-medium cursor-pointer border-b-2 text-center transition-colors ${
                  sslTab === "netbanking"
                    ? "border-brand text-brand font-semibold bg-surface"
                    : "border-transparent text-fg-muted hover:text-fg"
                }`}
              >
                Net Banking
              </button>
            </div>

            <div className="p-5 space-y-4">
              {sslTab === "card" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-fg">Test Sandbox Card</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      leftIcon={<Sparkles className="w-3.5 h-3.5 text-brand" />}
                      onClick={autofillSslTestCard}
                      className="text-xs text-brand h-8 px-2"
                    >
                      1-Click Autofill
                    </Button>
                  </div>

                  <div>
                    <label
                      htmlFor="ssl-card-number"
                      className="block text-xs font-medium text-fg-muted mb-1"
                    >
                      Card Number
                    </label>
                    <input
                      id="ssl-card-number"
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4012 8888 8888 1881"
                      className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-line bg-surface text-fg font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="ssl-card-expiry"
                        className="block text-xs font-medium text-fg-muted mb-1"
                      >
                        Expiry (MM/YY)
                      </label>
                      <input
                        id="ssl-card-expiry"
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="12/28"
                        className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-line bg-surface text-fg font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="ssl-card-cvv"
                        className="block text-xs font-medium text-fg-muted mb-1"
                      >
                        CVV / CVC
                      </label>
                      <input
                        id="ssl-card-cvv"
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="123"
                        className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-line bg-surface text-fg font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="ssl-card-holder"
                      className="block text-xs font-medium text-fg-muted mb-1"
                    >
                      Cardholder Name
                    </label>
                    <input
                      id="ssl-card-holder"
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="Sakib Ahmed"
                      className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-line bg-surface text-fg text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    />
                  </div>
                </div>
              )}

              {sslTab === "mobile" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    {["bkash", "nagad", "rocket"].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setMobileProvider(p)}
                        className={`min-h-[44px] px-3 py-2 rounded-xl border text-xs font-medium cursor-pointer capitalize ${
                          mobileProvider === p
                            ? "bg-brand/10 border-brand text-brand font-semibold"
                            : "bg-surface border-line text-fg hover:bg-surface-2"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  <div>
                    <label
                      htmlFor="ssl-mobile-acc"
                      className="block text-xs font-medium text-fg-muted mb-1"
                    >
                      Account Number
                    </label>
                    <input
                      id="ssl-mobile-acc"
                      type="tel"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="01712904511"
                      className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-line bg-surface text-fg font-mono text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    />
                  </div>
                </div>
              )}

              {sslTab === "netbanking" && (
                <div className="space-y-3">
                  <label
                    htmlFor="ssl-bank-select"
                    className="block text-xs font-medium text-fg-muted mb-1"
                  >
                    Select Internet Banking Gateway
                  </label>
                  <select
                    id="ssl-bank-select"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-line bg-surface text-fg text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  >
                    <option value="BRAC Bank">BRAC Bank Internet Banking</option>
                    <option value="City Bank">City Bank CityTouch</option>
                    <option value="DBBL">Dutch Bangla Bank NexusPay</option>
                    <option value="Eastern Bank">Eastern Bank EBL Skybanking</option>
                  </select>
                </div>
              )}

              {/* Simulation Action Controls */}
              <div className="pt-2 border-t border-line grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  loading={loading}
                  onClick={() => handleSslSimulate(true)}
                  className="bg-brand hover:bg-brand-hover text-on-brand"
                >
                  Simulate Success
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  disabled={loading}
                  onClick={() => handleSslSimulate(false)}
                  className="text-danger hover:bg-danger-light border border-line"
                >
                  Simulate Failure
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
