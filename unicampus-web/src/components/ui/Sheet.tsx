"use client";

import React, { useEffect, useId, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "./cn";

export type SheetSide = "responsive" | "right" | "bottom";

export interface SheetProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  side?: SheetSide;
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Sheet({
  open,
  onClose,
  title,
  description,
  footer,
  side = "responsive",
  closeOnBackdrop = true,
  closeOnEsc = true,
  children,
  className,
}: SheetProps) {
  const titleId = useId();
  const descriptionId = useId();
  const shouldReduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    previousActiveElementRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const rafId = window.requestAnimationFrame(() => {
      const panelEl = panelRef.current;
      if (panelEl && !panelEl.contains(document.activeElement)) {
        panelEl.focus({ preventScroll: true });
      }
    });

    return () => {
      window.cancelAnimationFrame(rafId);
      const previous = previousActiveElementRef.current;
      if (previous && previous.isConnected) {
        previous.focus({ preventScroll: true });
      }
      previousActiveElementRef.current = null;
    };
  }, [open]);

  useEffect(() => {
    if (!open || !closeOnEsc) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, closeOnEsc, onClose]);

  const transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.18, ease: [0.16, 1, 0.3, 1] as const };

  const containerAlign =
    side === "right"
      ? "items-stretch justify-end"
      : side === "bottom"
      ? "items-end justify-center"
      : "items-end md:items-stretch md:justify-end";

  const panelShape =
    side === "right"
      ? "w-full max-w-md h-full rounded-l-2xl border-l border-line"
      : side === "bottom"
      ? "w-full max-h-[85vh] rounded-t-2xl border-t border-line"
      : "w-full md:max-w-md max-h-[85vh] md:max-h-none md:h-full rounded-t-2xl md:rounded-t-none md:rounded-l-2xl border-t md:border-t-0 md:border-l border-line";

  const initialMotion = shouldReduceMotion
    ? false
    : side === "right"
    ? { opacity: 0, x: 24 }
    : { opacity: 0, y: 16 };

  const animateMotion = { opacity: 1, x: 0, y: 0 };

  const exitMotion = shouldReduceMotion
    ? { opacity: 0 }
    : side === "right"
    ? { opacity: 0, x: 20 }
    : { opacity: 0, y: 12 };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="sheet-backdrop"
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transition}
          className={cn(
            "fixed inset-0 z-[60] flex",
            containerAlign
          )}
        >
          <button
            type="button"
            aria-label="Close"
            tabIndex={-1}
            onClick={closeOnBackdrop ? onClose : undefined}
            className="fixed inset-0 bg-black/45 dark:bg-black/70 cursor-default"
          />
          <motion.div
            key="sheet-panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            aria-describedby={description ? descriptionId : undefined}
            tabIndex={-1}
            initial={initialMotion}
            animate={animateMotion}
            exit={exitMotion}
            transition={transition}
            className={cn(
              "relative z-10 bg-surface shadow-xl flex flex-col overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-brand",
              panelShape,
              className
            )}
          >
            {side !== "right" && (
              <div
                className={cn(
                  "flex justify-center pt-2.5 pb-1",
                  side === "responsive" && "md:hidden"
                )}
                aria-hidden="true"
              >
                <span className="w-9 h-1 rounded-full bg-line" />
              </div>
            )}

            <div className="flex items-start justify-between gap-4 px-5 sm:px-6 pt-4 pb-4 border-b border-line">
              <div className="min-w-0">
                {title && (
                  <h2 id={titleId} className="text-lg font-semibold text-fg tracking-tight">
                    {title}
                  </h2>
                )}
                {description && (
                  <p id={descriptionId} className="text-sm text-fg-muted mt-1">
                    {description}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close panel"
                className="min-w-[44px] min-h-[44px] -mt-1 -mr-2 rounded-xl inline-flex items-center justify-center text-fg-muted hover:text-fg hover:bg-surface-2 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="px-5 sm:px-6 py-5 overflow-y-auto flex-1">
              {children}
            </div>

            {footer && (
              <div className="px-5 sm:px-6 py-4 border-t border-line bg-surface-2/40 flex flex-wrap items-center justify-end gap-2.5">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
