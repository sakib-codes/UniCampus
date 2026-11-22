"use client";

import React, { useRef } from "react";

interface OtpDigitInputProps {
  value: string;
  onChange: (next: string) => void;
  disabled?: boolean;
  ariaLabelPrefix: string;
}

/**
 * 6-Digit Individual OTP Input Boxes (WhatsApp / Telegram / Google / Discord pattern)
 * Supports auto-advance, Backspace navigation, Arrow keys, and full 6-digit paste.
 */
export function OtpDigitInput({
  value,
  onChange,
  disabled = false,
  ariaLabelPrefix,
}: OtpDigitInputProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length: 6 }, (_, i) => value[i] || "");

  const setDigitAt = (index: number, char: string) => {
    const clean = char.replace(/\D/g, "");
    if (!clean) return;

    // Handle paste of multiple digits
    if (clean.length > 1) {
      const next = (value.slice(0, index) + clean).slice(0, 6);
      onChange(next);
      const focusIdx = Math.min(5, index + clean.length);
      inputRefs.current[focusIdx]?.focus();
      return;
    }

    const nextArr = [...digits];
    nextArr[index] = clean[0];
    onChange(nextArr.join("").slice(0, 6));
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const nextArr = [...digits];
      if (nextArr[index]) {
        nextArr[index] = "";
        onChange(nextArr.join(""));
      } else if (index > 0) {
        nextArr[index - 1] = "";
        onChange(nextArr.join(""));
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    onChange(pasted);
    inputRefs.current[Math.min(5, pasted.length - 1)]?.focus();
  };

  return (
    <div className="grid grid-cols-6 gap-2">
      {digits.map((digit, idx) => (
        <input
          key={idx}
          ref={(el) => {
            inputRefs.current[idx] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={idx === 0 ? "one-time-code" : "off"}
          maxLength={6}
          disabled={disabled}
          value={digit}
          onChange={(e) => setDigitAt(idx, e.target.value)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          onPaste={handlePaste}
          aria-label={`${ariaLabelPrefix} digit ${idx + 1}`}
          className="w-full h-12 rounded-xl bg-surface border border-line text-center font-mono text-lg font-semibold text-fg focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 disabled:opacity-50 transition-colors"
        />
      ))}
    </div>
  );
}
