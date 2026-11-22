"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, Mail, Smartphone, Send, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { OtpDigitInput } from "./OtpDigitInput";

interface ContactVerificationStepProps {
  email: string;
  phone: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  onEmailVerified: () => void;
  onPhoneVerified: () => void;
}

interface ChannelState {
  sent: boolean;
  code: string;
  sending: boolean;
  verifying: boolean;
  cooldown: number;
  error: string | null;
  sandboxHint: string | null;
  deliveryNote: string | null;
}

const INITIAL_CHANNEL: ChannelState = {
  sent: false,
  code: "",
  sending: false,
  verifying: false,
  cooldown: 0,
  error: null,
  sandboxHint: null,
  deliveryNote: null,
};

export function ContactVerificationStep({
  email,
  phone,
  emailVerified,
  phoneVerified,
  onEmailVerified,
  onPhoneVerified,
}: ContactVerificationStepProps) {
  const [emailState, setEmailState] = useState<ChannelState>(INITIAL_CHANNEL);
  const [phoneState, setPhoneState] = useState<ChannelState>(INITIAL_CHANNEL);

  // Cooldown countdown tickers
  useEffect(() => {
    if (emailState.cooldown <= 0) return;
    const t = setTimeout(
      () => setEmailState((prev) => ({ ...prev, cooldown: Math.max(0, prev.cooldown - 1) })),
      1000
    );
    return () => clearTimeout(t);
  }, [emailState.cooldown]);

  useEffect(() => {
    if (phoneState.cooldown <= 0) return;
    const t = setTimeout(
      () => setPhoneState((prev) => ({ ...prev, cooldown: Math.max(0, prev.cooldown - 1) })),
      1000
    );
    return () => clearTimeout(t);
  }, [phoneState.cooldown]);

  const sendOtp = async (channel: "email" | "phone") => {
    const target = channel === "email" ? email : phone;
    const setState = channel === "email" ? setEmailState : setPhoneState;

    setState((prev) => ({ ...prev, sending: true, error: null }));
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel, target }),
      });
      const data = await res.json();
      if (!res.ok) {
        setState((prev) => ({
          ...prev,
          sending: false,
          error: data.error || "Could not send verification code.",
        }));
        return;
      }

      setState((prev) => ({
        ...prev,
        sent: true,
        sending: false,
        cooldown: 60,
        code: "",
        error: null,
        sandboxHint: data.sandboxCode || null,
        deliveryNote:
          data.deliveryMode === "supabase-email"
            ? "6-digit code sent via Supabase Auth email."
            : data.deliveryMode === "supabase-sms"
              ? "6-digit SMS code sent via Supabase Phone Auth."
              : "Sandbox OTP active (configure SMTP/SMS provider in Supabase for live delivery).",
      }));
    } catch {
      setState((prev) => ({
        ...prev,
        sending: false,
        error: "Network error while sending code. Please try again.",
      }));
    }
  };

  const verifyOtp = async (channel: "email" | "phone") => {
    const target = channel === "email" ? email : phone;
    const state = channel === "email" ? emailState : phoneState;
    const setState = channel === "email" ? setEmailState : setPhoneState;

    if (state.code.length !== 6) {
      setState((prev) => ({ ...prev, error: "Enter all 6 digits to verify." }));
      return;
    }

    setState((prev) => ({ ...prev, verifying: true, error: null }));
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel, target, code: state.code }),
      });
      const data = await res.json();
      if (!res.ok || !data.verified) {
        setState((prev) => ({
          ...prev,
          verifying: false,
          error: data.error || "Invalid verification code.",
        }));
        return;
      }

      setState((prev) => ({ ...prev, verifying: false, error: null }));
      if (channel === "email") {
        onEmailVerified();
      } else {
        onPhoneVerified();
      }
    } catch {
      setState((prev) => ({
        ...prev,
        verifying: false,
        error: "Network error while verifying code.",
      }));
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Email OTP Verification Card */}
      <div
        className={`p-4 rounded-2xl border transition-colors ${
          emailVerified
            ? "bg-success-light/60 border-success/30"
            : "bg-surface-2 border-line"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                emailVerified ? "bg-success/15 text-success" : "bg-surface border border-line text-brand"
              }`}
            >
              {emailVerified ? <CheckCircle2 className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-fg">Email verification</div>
              <div className="text-xs text-fg-muted truncate">{email}</div>
            </div>
          </div>

          {emailVerified ? (
            <span className="px-2.5 py-1 rounded-full bg-success/15 text-success text-[11px] font-semibold shrink-0">
              Verified
            </span>
          ) : (
            <Button
              type="button"
              variant={emailState.sent ? "secondary" : "primary"}
              size="sm"
              loading={emailState.sending}
              disabled={emailState.cooldown > 0}
              onClick={() => sendOtp("email")}
              leftIcon={
                emailState.sent ? <RefreshCw className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />
              }
              className="h-9 px-3 rounded-xl shrink-0 whitespace-nowrap"
            >
              {emailState.cooldown > 0
                ? `Resend (${emailState.cooldown}s)`
                : emailState.sent
                  ? "Resend"
                  : "Send code"}
            </Button>
          )}
        </div>

        {!emailVerified && emailState.sent && (
          <div className="mt-3.5 pt-3.5 border-t border-line space-y-3">
            <OtpDigitInput
              value={emailState.code}
              onChange={(next) =>
                setEmailState((prev) => ({ ...prev, code: next, error: null }))
              }
              disabled={emailState.verifying}
              ariaLabelPrefix="Email OTP"
            />

            {emailState.sandboxHint && (
              <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-surface border border-line text-xs">
                <span className="text-fg-muted">
                  Test OTP: <strong className="font-mono text-fg">{emailState.sandboxHint}</strong>
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setEmailState((prev) => ({ ...prev, code: prev.sandboxHint || "" }))
                  }
                  className="text-brand font-semibold hover:underline cursor-pointer"
                >
                  Auto-fill
                </button>
              </div>
            )}

            {emailState.deliveryNote && !emailState.sandboxHint && (
              <p className="text-[11px] text-fg-muted">{emailState.deliveryNote}</p>
            )}

            {emailState.error && (
              <p className="text-xs text-danger font-medium">{emailState.error}</p>
            )}

            <Button
              type="button"
              variant="primary"
              size="sm"
              fullWidth
              loading={emailState.verifying}
              disabled={emailState.code.length !== 6}
              onClick={() => verifyOtp("email")}
              className="h-10 rounded-xl"
            >
              Verify email code
            </Button>
          </div>
        )}
      </div>

      {/* 2. Phone SMS OTP Verification Card */}
      <div
        className={`p-4 rounded-2xl border transition-colors ${
          phoneVerified
            ? "bg-success-light/60 border-success/30"
            : "bg-surface-2 border-line"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                phoneVerified ? "bg-success/15 text-success" : "bg-surface border border-line text-brand"
              }`}
            >
              {phoneVerified ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <Smartphone className="w-4 h-4" />
              )}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-fg">Phone verification</div>
              <div className="text-xs text-fg-muted font-mono truncate">{phone}</div>
            </div>
          </div>

          {phoneVerified ? (
            <span className="px-2.5 py-1 rounded-full bg-success/15 text-success text-[11px] font-semibold shrink-0">
              Verified
            </span>
          ) : (
            <Button
              type="button"
              variant={phoneState.sent ? "secondary" : "primary"}
              size="sm"
              loading={phoneState.sending}
              disabled={phoneState.cooldown > 0}
              onClick={() => sendOtp("phone")}
              leftIcon={
                phoneState.sent ? <RefreshCw className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />
              }
              className="h-9 px-3 rounded-xl shrink-0 whitespace-nowrap"
            >
              {phoneState.cooldown > 0
                ? `Resend (${phoneState.cooldown}s)`
                : phoneState.sent
                  ? "Resend"
                  : "Send SMS"}
            </Button>
          )}
        </div>

        {!phoneVerified && phoneState.sent && (
          <div className="mt-3.5 pt-3.5 border-t border-line space-y-3">
            <OtpDigitInput
              value={phoneState.code}
              onChange={(next) =>
                setPhoneState((prev) => ({ ...prev, code: next, error: null }))
              }
              disabled={phoneState.verifying}
              ariaLabelPrefix="Phone OTP"
            />

            {phoneState.sandboxHint && (
              <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-surface border border-line text-xs">
                <span className="text-fg-muted">
                  Test SMS OTP: <strong className="font-mono text-fg">{phoneState.sandboxHint}</strong>
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setPhoneState((prev) => ({ ...prev, code: prev.sandboxHint || "" }))
                  }
                  className="text-brand font-semibold hover:underline cursor-pointer"
                >
                  Auto-fill
                </button>
              </div>
            )}

            {phoneState.deliveryNote && !phoneState.sandboxHint && (
              <p className="text-[11px] text-fg-muted">{phoneState.deliveryNote}</p>
            )}

            {phoneState.error && (
              <p className="text-xs text-danger font-medium">{phoneState.error}</p>
            )}

            <Button
              type="button"
              variant="primary"
              size="sm"
              fullWidth
              loading={phoneState.verifying}
              disabled={phoneState.code.length !== 6}
              onClick={() => verifyOtp("phone")}
              className="h-10 rounded-xl"
            >
              Verify phone code
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
