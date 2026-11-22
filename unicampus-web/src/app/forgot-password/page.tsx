"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { Button, buttonVariants } from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleRequestCode = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Please enter a valid institutional email address.");
      return;
    }
    setStep(2);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (otp.trim().length < 6) {
      setErrorMsg("Please enter the 6-digit verification code sent to your email.");
      return;
    }
    setStep(3);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (newPassword.length < 6) {
      setErrorMsg("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    setStep(4);
  };

  return (
    <div className="min-h-dvh flex flex-col justify-between bg-canvas text-fg px-4 py-6 sm:p-10">
      {/* Top Bar */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand text-on-brand flex items-center justify-center font-bold text-sm">
            U
          </div>
          <span className="font-semibold text-base text-fg tracking-tight">UniCampus</span>
        </Link>
        <ThemeToggle size="sm" />
      </header>

      {/* Main Card */}
      <main className="w-full max-w-md mx-auto my-8">
        <div className="rounded-2xl bg-surface border border-line p-6 sm:p-8 space-y-6">
          {step === 4 ? (
            <div className="text-center space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-success-light text-success border border-success/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h1 className="text-xl sm:text-2xl font-semibold text-fg tracking-tight">
                  Password Reset Complete
                </h1>
                <p className="text-xs sm:text-sm text-fg-muted leading-relaxed">
                  Your password for <strong className="text-fg">{email}</strong> has been updated. You can now sign in with your new credentials.
                </p>
              </div>
              <Link
                href="/login"
                className={buttonVariants({ variant: "primary", size: "lg", fullWidth: true })}
              >
                <span>Return to Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <div className="w-11 h-11 rounded-xl bg-brand-soft border border-brand/25 text-brand flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h1 className="text-xl sm:text-2xl font-semibold text-fg tracking-tight">
                  {step === 1
                    ? "Reset your password"
                    : step === 2
                    ? "Verify recovery code"
                    : "Choose a new password"}
                </h1>
                <p className="text-xs sm:text-sm text-fg-muted leading-relaxed">
                  {step === 1
                    ? "Enter your registered UniCampus email address to receive a 6-digit recovery code."
                    : step === 2
                    ? `We sent a 6-digit recovery code to ${email}. (Sandbox demo code: 482910)`
                    : "Create a strong new password for your institutional portal account."}
                </p>
              </div>

              {/* 3-Step Indicator */}
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`h-1.5 rounded-full transition-colors ${
                      s <= step ? "bg-brand" : "bg-surface-2"
                    }`}
                  />
                ))}
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-danger-light border border-danger/25 text-danger text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              {step === 1 && (
                <form onSubmit={handleRequestCode} className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="reset-email" className="text-xs font-semibold text-fg block">
                      Institutional Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-fg-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="reset-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="sakib.cse@unicampus.edu"
                        className="w-full min-h-[44px] pl-10 pr-3.5 py-2.5 rounded-xl bg-surface-2 border border-line text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-colors duration-150"
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Send Recovery Code
                  </Button>
                </form>
              )}

              {step === 2 && (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="reset-otp" className="text-xs font-semibold text-fg block">
                      6-Digit Verification Code
                    </label>
                    <input
                      id="reset-otp"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      placeholder="482910"
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-surface-2 border border-line text-center font-mono text-lg tracking-[0.35em] text-fg focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-colors duration-150"
                    />
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Button
                      type="button"
                      variant="secondary"
                      size="lg"
                      onClick={() => setStep(1)}
                      leftIcon={<ArrowLeft className="w-4 h-4" />}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      fullWidth
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      Verify Code
                    </Button>
                  </div>
                </form>
              )}

              {step === 3 && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="new-pass" className="text-xs font-semibold text-fg block">
                      New Password
                    </label>
                    <input
                      id="new-pass"
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-surface-2 border border-line text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-colors duration-150"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="confirm-pass" className="text-xs font-semibold text-fg block">
                      Confirm New Password
                    </label>
                    <input
                      id="confirm-pass"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-surface-2 border border-line text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-colors duration-150"
                    />
                  </div>
                  <div className="p-3 rounded-xl bg-surface-2 border border-line flex items-start gap-2 text-xs text-fg-muted">
                    <ShieldCheck className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                    <span>All other active sessions will be signed out once your password changes.</span>
                  </div>
                  <Button type="submit" variant="primary" size="lg" fullWidth>
                    Update Password
                  </Button>
                </form>
              )}

              <div className="pt-2 border-t border-line text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </main>

      <footer className="text-center text-xs text-fg-subtle">
        Office of the Registrar · UniCampus Account Recovery
      </footer>
    </div>
  );
}
