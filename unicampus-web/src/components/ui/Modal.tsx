"use client";

import React, { useEffect, useId, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "./cn";

export type ModalSize = "sm" | "md" | "lg" | "xl";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  size?: ModalSize;
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
  children: React.ReactNode;
  className?: string;
}

const sizeClasses: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export function Modal({
  open,
  onClose,
  title,
  description,
  footer,
  size = "md",
  closeOnBackdrop = true,
  closeOnEsc = true,
  children,
  className,
}: ModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const shouldReduceMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    previousActiveElementRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const rafId = window.requestAnimationFrame(() => {
      const dialogEl = dialogRef.current;
      if (dialogEl && !dialogEl.contains(document.activeElement)) {
        dialogEl.focus({ preventScroll: true });
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
    : ({ type: "spring", stiffness: 430, damping: 28, mass: 0.8 } as const);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="modal-backdrop"
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transition}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
        >
          <button
            type="button"
            aria-label="Close"
            tabIndex={-1}
            onClick={closeOnBackdrop ? onClose : undefined}
            className="fixed inset-0 bg-black/45 dark:bg-black/70 cursor-default"
          />
          <motion.div
            key="modal-dialog"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            aria-describedby={description ? descriptionId : undefined}
            tabIndex={-1}
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.93, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -6, transition: { duration: 0.14, ease: "easeIn" } }}
            transition={transition}
            className={cn(
              "relative z-10 w-full bg-surface border border-line rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] focus:outline-none focus-visible:outline-none",
              sizeClasses[size],
              className
            )}
          >
            {(title || description) && (
              <div className="flex items-start justify-between gap-4 px-5 sm:px-6 pt-5 pb-4 border-b border-line">
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
                  aria-label="Close modal"
                  className="min-w-[44px] min-h-[44px] -mt-1.5 -mr-2 rounded-xl inline-flex items-center justify-center text-fg-muted hover:text-fg hover:bg-surface-2 transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            )}

            {!title && !description && (
              <div className="flex justify-end px-4 pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close modal"
                  className="min-w-[44px] min-h-[44px] rounded-xl inline-flex items-center justify-center text-fg-muted hover:text-fg hover:bg-surface-2 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            )}

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
