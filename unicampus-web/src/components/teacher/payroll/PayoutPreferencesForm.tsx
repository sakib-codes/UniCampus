"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, Landmark, RotateCcw, Save, ShieldCheck, Wallet, CreditCard } from "lucide-react";

export interface PayoutPreferences {
  channel: "bank" | "bkash" | "sslcommerz";
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  branchName: string;
  routingNumber: string;
  bkashNumber: string;
  bkashWalletType: string;
  sslPayoutId: string;
  sslLinkedCard: string;
}

const DEFAULT_PREFERENCES: PayoutPreferences = {
  channel: "bank",
  bankName: "Dutch-Bangla Bank PLC (DBBL)",
  accountHolder: "Dr. Asif Rahman",
  accountNumber: "115.120.••••4821",
  branchName: "Dhanmondi Branch, Dhaka",
  routingNumber: "090271345",
  bkashNumber: "+880 1712-••••78",
  bkashWalletType: "Faculty Payroll Direct",
  sslPayoutId: "SSL-PAY-FAC-1042",
  sslLinkedCard: "Visa Debit •••• 9942",
};

const STORAGE_KEY = "unicampus_faculty_payout_pref_FAC-1042";

interface PayoutPreferencesFormProps {
  onSaved: (prefs: PayoutPreferences) => void;
  onShowToast: (message: string) => void;
}

export function PayoutPreferencesForm({
  onSaved,
  onShowToast,
}: PayoutPreferencesFormProps) {
  const [initialPrefs, setInitialPrefs] = useState<PayoutPreferences>(DEFAULT_PREFERENCES);
  const [formData, setFormData] = useState<PayoutPreferences>(DEFAULT_PREFERENCES);
  const [isSaved, setIsSaved] = useState(false);

  // Load from local storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          queueMicrotask(() => {
            setInitialPrefs(parsed);
            setFormData(parsed);
            onSaved(parsed);
          });
        }
      } catch (e) {
        console.error("Failed to parse faculty payout preferences:", e);
      }
    }
  }, [onSaved]);

  // Dirty state checking
  const isDirty = JSON.stringify(initialPrefs) !== JSON.stringify(formData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      setInitialPrefs(formData);
      setIsSaved(true);
      onSaved(formData);
      onShowToast("Payout account preferences saved and updated successfully.");
      setTimeout(() => setIsSaved(false), 3000);
    } catch (e) {
      console.error("Failed to save payout preferences:", e);
    }
  };

  const handleReset = () => {
    setFormData(initialPrefs);
    onShowToast("Changes discarded. Restored active configuration.");
  };

  return (
    <div className="w-full max-w-4xl space-y-6">
      {/* Intro info banner */}
      <div className="rounded-2xl bg-surface border border-line p-5">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-surface-2 text-brand shrink-0">
            <ShieldCheck className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-fg">
              Disbursement Account & Institutional Payout Routing
            </h2>
            <p className="mt-1 text-xs text-fg-muted leading-relaxed">
              Configure your primary destination for monthly remuneration and contractual allowances.
              All disbursement transactions are initiated by the University Comptroller and cleared via
              authorized Bangladesh Bank BEFTN, bKash Corporate Payroll, or SSLCommerz Gateway.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Channel Selection */}
        <div className="rounded-2xl bg-surface border border-line p-5 space-y-4">
          <div className="border-b border-line pb-3">
            <h3 className="text-sm font-semibold text-fg">Select Primary Disbursement Channel</h3>
            <p className="text-xs text-fg-muted mt-0.5">
              Choose the primary gateway channel for automated payroll disbursements.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Bank Transfer */}
            <label
              htmlFor="payout-channel-bank"
              className={`flex flex-col p-4 rounded-xl border cursor-pointer transition-colors ${
                formData.channel === "bank"
                  ? "bg-surface-2 border-brand ring-1 ring-brand"
                  : "bg-canvas border-line hover:border-fg-muted/40"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <input
                  id="payout-channel-bank"
                  type="radio"
                  name="payoutChannel"
                  value="bank"
                  checked={formData.channel === "bank"}
                  onChange={() => setFormData((prev) => ({ ...prev, channel: "bank" }))}
                  className="sr-only"
                />
                <Landmark className="w-5 h-5 text-brand" aria-hidden="true" />
                {formData.channel === "bank" && (
                  <CheckCircle2 className="w-4 h-4 text-brand" aria-hidden="true" />
                )}
              </div>
              <span className="text-sm font-semibold text-fg">Bank Transfer (EFTN)</span>
              <span className="text-xs text-fg-muted mt-1">
                Direct scheduled deposit to DBBL account
              </span>
            </label>

            {/* bKash Merchant / Payroll */}
            <label
              htmlFor="payout-channel-bkash"
              className={`flex flex-col p-4 rounded-xl border cursor-pointer transition-colors ${
                formData.channel === "bkash"
                  ? "bg-surface-2 border-brand ring-1 ring-brand"
                  : "bg-canvas border-line hover:border-fg-muted/40"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <input
                  id="payout-channel-bkash"
                  type="radio"
                  name="payoutChannel"
                  value="bkash"
                  checked={formData.channel === "bkash"}
                  onChange={() => setFormData((prev) => ({ ...prev, channel: "bkash" }))}
                  className="sr-only"
                />
                <Wallet className="w-5 h-5 text-brand" aria-hidden="true" />
                {formData.channel === "bkash" && (
                  <CheckCircle2 className="w-4 h-4 text-brand" aria-hidden="true" />
                )}
              </div>
              <span className="text-sm font-semibold text-fg">bKash Payroll</span>
              <span className="text-xs text-fg-muted mt-1">
                Direct mobile disbursement to registered wallet
              </span>
            </label>

            {/* SSLCommerz Direct Payout */}
            <label
              htmlFor="payout-channel-sslcommerz"
              className={`flex flex-col p-4 rounded-xl border cursor-pointer transition-colors ${
                formData.channel === "sslcommerz"
                  ? "bg-surface-2 border-brand ring-1 ring-brand"
                  : "bg-canvas border-line hover:border-fg-muted/40"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <input
                  id="payout-channel-sslcommerz"
                  type="radio"
                  name="payoutChannel"
                  value="sslcommerz"
                  checked={formData.channel === "sslcommerz"}
                  onChange={() => setFormData((prev) => ({ ...prev, channel: "sslcommerz" }))}
                  className="sr-only"
                />
                <CreditCard className="w-5 h-5 text-brand" aria-hidden="true" />
                {formData.channel === "sslcommerz" && (
                  <CheckCircle2 className="w-4 h-4 text-brand" aria-hidden="true" />
                )}
              </div>
              <span className="text-sm font-semibold text-fg">SSLCommerz Direct</span>
              <span className="text-xs text-fg-muted mt-1">
                Card settlement & institutional gateway payout
              </span>
            </label>
          </div>
        </div>

        {/* Channel Details Section */}
        {formData.channel === "bank" && (
          <div className="rounded-2xl bg-surface border border-line p-5 space-y-4">
            <div className="border-b border-line pb-3">
              <h3 className="text-sm font-semibold text-fg">Bank Account Parameters</h3>
              <p className="text-xs text-fg-muted mt-0.5">
                Institutional salary account registered under faculty code FAC-1042.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="bank-name-input" className="text-xs font-medium text-fg-muted">
                  Designated Bank Name
                </label>
                <input
                  id="bank-name-input"
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, bankName: e.target.value }))}
                  className="w-full min-h-[44px] px-3.5 text-sm bg-canvas border border-line rounded-xl text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="account-holder-input" className="text-xs font-medium text-fg-muted">
                  Account Holder Full Name
                </label>
                <input
                  id="account-holder-input"
                  type="text"
                  value={formData.accountHolder}
                  onChange={(e) => setFormData((prev) => ({ ...prev, accountHolder: e.target.value }))}
                  className="w-full min-h-[44px] px-3.5 text-sm bg-canvas border border-line rounded-xl text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="account-number-input" className="text-xs font-medium text-fg-muted">
                  Account Number (Masked)
                </label>
                <input
                  id="account-number-input"
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData((prev) => ({ ...prev, accountNumber: e.target.value }))}
                  placeholder="e.g. 115.120.••••4821"
                  className="w-full min-h-[44px] px-3.5 text-sm bg-canvas border border-line rounded-xl text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="branch-name-input" className="text-xs font-medium text-fg-muted">
                  Branch Name
                </label>
                <input
                  id="branch-name-input"
                  type="text"
                  value={formData.branchName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, branchName: e.target.value }))}
                  className="w-full min-h-[44px] px-3.5 text-sm bg-canvas border border-line rounded-xl text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label htmlFor="routing-number-input" className="text-xs font-medium text-fg-muted">
                  Electronic Routing Number (BEFTN / RTGS)
                </label>
                <input
                  id="routing-number-input"
                  type="text"
                  value={formData.routingNumber}
                  onChange={(e) => setFormData((prev) => ({ ...prev, routingNumber: e.target.value }))}
                  className="w-full min-h-[44px] px-3.5 text-sm bg-canvas border border-line rounded-xl text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand transition-colors max-w-sm"
                />
              </div>
            </div>
          </div>
        )}

        {formData.channel === "bkash" && (
          <div className="rounded-2xl bg-surface border border-line p-5 space-y-4">
            <div className="border-b border-line pb-3">
              <h3 className="text-sm font-semibold text-fg">bKash Payroll Parameters</h3>
              <p className="text-xs text-fg-muted mt-0.5">
                Mobile Financial Services (MFS) registered wallet for faculty monthly wage credit.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="bkash-number-input" className="text-xs font-medium text-fg-muted">
                  bKash Mobile Account Number (Masked)
                </label>
                <input
                  id="bkash-number-input"
                  type="text"
                  value={formData.bkashNumber}
                  onChange={(e) => setFormData((prev) => ({ ...prev, bkashNumber: e.target.value }))}
                  placeholder="+880 1712-••••78"
                  className="w-full min-h-[44px] px-3.5 text-sm bg-canvas border border-line rounded-xl text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="bkash-type-input" className="text-xs font-medium text-fg-muted">
                  Wallet Classification
                </label>
                <input
                  id="bkash-type-input"
                  type="text"
                  value={formData.bkashWalletType}
                  onChange={(e) => setFormData((prev) => ({ ...prev, bkashWalletType: e.target.value }))}
                  className="w-full min-h-[44px] px-3.5 text-sm bg-canvas border border-line rounded-xl text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        {formData.channel === "sslcommerz" && (
          <div className="rounded-2xl bg-surface border border-line p-5 space-y-4">
            <div className="border-b border-line pb-3">
              <h3 className="text-sm font-semibold text-fg">SSLCommerz Direct Settlement Parameters</h3>
              <p className="text-xs text-fg-muted mt-0.5">
                Card and merchant payout token identifier linked to institutional ledger.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="ssl-payout-id-input" className="text-xs font-medium text-fg-muted">
                  Gateway Payout Identifier
                </label>
                <input
                  id="ssl-payout-id-input"
                  type="text"
                  value={formData.sslPayoutId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, sslPayoutId: e.target.value }))}
                  className="w-full min-h-[44px] px-3.5 text-sm bg-canvas border border-line rounded-xl text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="ssl-card-input" className="text-xs font-medium text-fg-muted">
                  Linked Corporate / Debit Card (Masked)
                </label>
                <input
                  id="ssl-card-input"
                  type="text"
                  value={formData.sslLinkedCard}
                  onChange={(e) => setFormData((prev) => ({ ...prev, sslLinkedCard: e.target.value }))}
                  placeholder="Visa Debit •••• 9942"
                  className="w-full min-h-[44px] px-3.5 text-sm bg-canvas border border-line rounded-xl text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        {/* Action button bar with Dirty State detection */}
        <div className="rounded-2xl bg-surface border border-line p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="text-xs text-fg-muted">
            {isDirty ? (
              <span className="text-warning font-medium">
                Unsaved modifications detected in payout settings.
              </span>
            ) : isSaved ? (
              <span className="text-success font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                All preferences are up-to-date and active.
              </span>
            ) : (
              <span>Your payout channel is verified and configured for monthly auto-credit.</span>
            )}
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {isDirty && (
              <button
                type="button"
                onClick={handleReset}
                className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2 bg-surface-2 hover:bg-line/40 text-fg border border-line rounded-xl text-xs font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                Discard
              </button>
            )}

            <button
              type="submit"
              disabled={!isDirty}
              className={`min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand cursor-pointer ${
                isDirty
                  ? "bg-brand text-on-brand hover:opacity-90 shadow-sm"
                  : "bg-surface-2 text-fg-muted border border-line cursor-not-allowed opacity-60"
              }`}
            >
              <Save className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Save Payout Preferences</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
