"use client";

import React, { useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  CreditCard,
  Percent,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export function PaymentMethodsGuideTab() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isCredentialsOpen, setIsCredentialsOpen] = useState(true);

  const copyText = (key: string, text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Policy Highlights Banner Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Instant Verification */}
        <div className="p-5 rounded-2xl bg-surface border border-line flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-success-light text-success border border-success/20 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-fg">Instant Clearance</h4>
            <p className="text-xs text-fg-muted mt-1 leading-relaxed">
              Payments via bKash Sandbox and SSLCommerz Sandbox reconcile and clear dues
              immediately in the student ledger.
            </p>
          </div>
        </div>

        {/* 2. 0% Surcharge */}
        <div className="p-5 rounded-2xl bg-surface border border-line flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-brand-soft text-brand border border-brand/20 flex items-center justify-center shrink-0">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-fg">0% Gateway Surcharge</h4>
            <p className="text-xs text-fg-muted mt-1 leading-relaxed">
              UniCampus covers 100% of gateway processing commissions. Students pay the
              exact tuition balance without hidden charges.
            </p>
          </div>
        </div>

        {/* 3. Secure Protocol */}
        <div className="p-5 rounded-2xl bg-surface border border-line flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-surface-2 text-fg border border-line flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-brand" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-fg">256-bit TLS Encrypted</h4>
            <p className="text-xs text-fg-muted mt-1 leading-relaxed">
              Regulated by Bangladesh Bank National Payment Switch guidelines with PCI-DSS
              Level 1 tokenized transactions.
            </p>
          </div>
        </div>
      </div>

      {/* Gateway Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gateway 1: bKash Tokenized Checkout */}
        <div className="rounded-2xl border border-line bg-surface overflow-hidden flex flex-col justify-between">
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#E2136E]/10 border border-[#E2136E]/20 flex items-center justify-center text-[#E2136E]">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-fg tracking-tight">
                    bKash Tokenized Checkout
                  </h3>
                  <p className="text-xs text-fg-muted">Direct Mobile Financial Service</p>
                </div>
              </div>
              <Badge variant="brand" appearance="soft">
                Sandbox v1.2
              </Badge>
            </div>

            <p className="text-xs text-fg-muted leading-relaxed">
              Pay quickly using your bKash mobile wallet. Supports instantaneous OTP
              validation and PIN-authorized payment processing directly integrated into the
              university finance portal.
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-fg">
                <Check className="w-4 h-4 text-success" />
                <span>One-time password (OTP) two-factor authentication</span>
              </div>
              <div className="flex items-center gap-2 text-fg">
                <Check className="w-4 h-4 text-success" />
                <span>Automatic official digital receipt generation</span>
              </div>
              <div className="flex items-center gap-2 text-fg">
                <Check className="w-4 h-4 text-success" />
                <span>Full support for partial and installment payments</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-surface-2 border-t border-line flex items-center justify-between text-xs text-fg-muted">
            <span>Settlement: Real-time</span>
            <span className="font-medium text-fg">Max Limit: ৳150,000 / txn</span>
          </div>
        </div>

        {/* Gateway 2: SSLCommerz Multi-Channel Gateway */}
        <div className="rounded-2xl border border-line bg-surface overflow-hidden flex flex-col justify-between">
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-soft border border-brand/20 flex items-center justify-center text-brand">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-fg tracking-tight">
                    SSLCommerz Multi-Channel
                  </h3>
                  <p className="text-xs text-fg-muted">
                    Cards, Mobile Wallets &amp; Internet Banking
                  </p>
                </div>
              </div>
              <Badge variant="brand" appearance="soft">
                Sandbox v4
              </Badge>
            </div>

            <p className="text-xs text-fg-muted leading-relaxed">
              Bangladesh&apos;s largest payment gateway aggregator supporting Visa,
              Mastercard, American Express, Nagad, Rocket, Upay, and 12+ Internet Banking
              channels.
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-fg">
                <Check className="w-4 h-4 text-success" />
                <span>International and local Visa &amp; Mastercard debit/credit cards</span>
              </div>
              <div className="flex items-center gap-2 text-fg">
                <Check className="w-4 h-4 text-success" />
                <span>Nagad, Dutch-Bangla Rocket &amp; UCB Upay channels</span>
              </div>
              <div className="flex items-center gap-2 text-fg">
                <Check className="w-4 h-4 text-success" />
                <span>BRAC Bank, City Bank, DBBL, and EBL Net Banking</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-surface-2 border-t border-line flex items-center justify-between text-xs text-fg-muted">
            <span>Settlement: Real-time</span>
            <span className="font-medium text-fg">Max Limit: ৳500,000 / txn</span>
          </div>
        </div>
      </div>

      {/* Collapsible Sandbox Test Credentials Helper Card */}
      <div className="rounded-2xl border border-brand/30 bg-surface overflow-hidden">
        <button
          type="button"
          onClick={() => setIsCredentialsOpen(!isCredentialsOpen)}
          className="w-full p-4 bg-brand-soft/40 border-b border-brand/20 flex items-center justify-between text-left cursor-pointer hover:bg-brand-soft/60 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-brand" />
            <div>
              <h4 className="text-sm font-semibold text-fg">
                Sandbox Test Credentials &amp; Verification Keys
              </h4>
              <p className="text-xs text-fg-muted">
                Use these test values in local development and sandbox payment modal testing.
              </p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-xl bg-surface border border-line flex items-center justify-center text-fg-muted">
            {isCredentialsOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        </button>

        {isCredentialsOpen && (
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5 bg-surface text-xs">
            {/* bKash Test Credentials */}
            <div className="p-4 rounded-xl border border-line bg-surface-2/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-fg">bKash Sandbox Test Data</span>
                <Badge variant="brand" appearance="soft" className="text-[10px]">
                  Verified Sandbox
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-lg bg-surface border border-line">
                  <span className="text-fg-muted">Test Wallet Number:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-medium text-fg">01770771960</span>
                    <button
                      type="button"
                      aria-label="Copy bKash wallet number"
                      onClick={() => copyText("bkash-wallet", "01770771960")}
                      className="text-fg-muted hover:text-brand cursor-pointer p-0.5"
                    >
                      {copiedKey === "bkash-wallet" ? (
                        <Check className="w-3.5 h-3.5 text-success" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-surface border border-line">
                  <span className="text-fg-muted">Sandbox Test OTP:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-medium text-fg">123456</span>
                    <button
                      type="button"
                      aria-label="Copy bKash test OTP"
                      onClick={() => copyText("bkash-otp", "123456")}
                      className="text-fg-muted hover:text-brand cursor-pointer p-0.5"
                    >
                      {copiedKey === "bkash-otp" ? (
                        <Check className="w-3.5 h-3.5 text-success" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-surface border border-line">
                  <span className="text-fg-muted">Sandbox Test PIN:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-medium text-fg">12121</span>
                    <button
                      type="button"
                      aria-label="Copy bKash test PIN"
                      onClick={() => copyText("bkash-pin", "12121")}
                      className="text-fg-muted hover:text-brand cursor-pointer p-0.5"
                    >
                      {copiedKey === "bkash-pin" ? (
                        <Check className="w-3.5 h-3.5 text-success" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* SSLCommerz Test Credentials */}
            <div className="p-4 rounded-xl border border-line bg-surface-2/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-fg">SSLCommerz Sandbox Test Card</span>
                <Badge variant="brand" appearance="soft" className="text-[10px]">
                  Visa / Mastercard
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-lg bg-surface border border-line">
                  <span className="text-fg-muted">Card Number:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-medium text-fg">
                      4012 8888 8888 1881
                    </span>
                    <button
                      type="button"
                      aria-label="Copy test card number"
                      onClick={() => copyText("card-num", "4012888888881881")}
                      className="text-fg-muted hover:text-brand cursor-pointer p-0.5"
                    >
                      {copiedKey === "card-num" ? (
                        <Check className="w-3.5 h-3.5 text-success" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-surface border border-line">
                  <span className="text-fg-muted">Expiry / CVV:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-medium text-fg">12/28 • 123</span>
                    <button
                      type="button"
                      aria-label="Copy expiry and cvv"
                      onClick={() => copyText("card-exp", "12/28 123")}
                      className="text-fg-muted hover:text-brand cursor-pointer p-0.5"
                    >
                      {copiedKey === "card-exp" ? (
                        <Check className="w-3.5 h-3.5 text-success" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-surface border border-line">
                  <span className="text-fg-muted">Cardholder Name:</span>
                  <span className="font-medium text-fg">Sakib Ahmed</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
