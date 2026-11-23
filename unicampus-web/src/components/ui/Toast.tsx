"use client";

import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertCircle, Info, X } from "lucide-react";
import { CheckIcon, type CheckIconHandle } from "@/components/icons/check";
import {
  TriangleAlertIcon,
  type TriangleAlertIconHandle,
} from "@/components/icons/triangle-alert";
import { cn } from "./cn";

export type ToastTone = "neutral" | "success" | "warning" | "danger";

export interface ToastProps {
  open: boolean;
  onClose?: () => void;
  title?: React.ReactNode;
  message: React.ReactNode;
  tone?: ToastTone;
  action?: React.ReactNode;
  durationMs?: number;
  className?: string;
}

function ToastToneIcon({ tone }: { tone: ToastTone }) {
  const checkRef = useRef<CheckIconHandle>(null);
  const alertRef = useRef<TriangleAlertIconHandle>(null);

  useEffect(() => {
    if (tone === "success") {
      checkRef.current?.startAnimation();
    } else if (tone === "warning") {
      alertRef.current?.startAnimation();
    }
  }, [tone]);

  if (tone === "success") {
    return <CheckIcon ref={checkRef} size={16} className="text-success shrink-0" aria-hidden="true" />;
  }
  if (tone === "warning") {
    return <TriangleAlertIcon ref={alertRef} size={16} className="text-warning shrink-0" aria-hidden="true" />;
  }
  if (tone === "danger") {
    return <AlertCircle className="w-4 h-4 text-danger shrink-0" aria-hidden="true" />;
  }
  return <Info className="w-4 h-4 text-brand shrink-0" aria-hidden="true" />;
}

export function Toast({
  open,
  onClose,
  title,
  message,
  tone = "neutral",
  action,
  durationMs,
  className,
}: ToastProps) {
  const shouldReduceMotion = useReducedMotion();
  const onCloseRef = useRef(onClose);
  const hasOnClose = Boolean(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open || !durationMs || durationMs <= 0 || !hasOnClose) return;
    const timer = window.setTimeout(() => {
      onCloseRef.current?.();
    }, durationMs);
    return () => window.clearTimeout(timer);
  }, [open, durationMs, hasOnClose]);

  const transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.18, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="ui-toast"
          role="status"
          aria-live="polite"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
          transition={transition}
          className={cn(
            "fixed bottom-20 md:bottom-6 right-4 sm:right-6 left-4 sm:left-auto z-[60] max-w-sm bg-surface border border-line rounded-2xl shadow-lg px-4 py-3 text-fg flex items-start gap-3",
            className
          )}
        >
          <div className="mt-0.5"><ToastToneIcon tone={tone} /></div>

          <div className="min-w-0 flex-1">
            {title && (
              <p className="text-sm font-semibold text-fg leading-snug">{title}</p>
            )}
            <div className="text-sm text-fg-muted leading-snug">{message}</div>
            {action && <div className="mt-2">{action}</div>}
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Dismiss notification"
              className="min-w-[44px] min-h-[44px] -my-2 -mr-2 rounded-xl inline-flex items-center justify-center text-fg-muted hover:text-fg hover:bg-surface-2 transition-colors cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
