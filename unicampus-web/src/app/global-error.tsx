"use client";

import React, { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import "./globals.css";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("Global uncaught application error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-dvh flex items-center justify-center p-4 bg-canvas text-fg font-sans">
        <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl bg-surface border border-line text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-danger-light border border-danger/20 text-danger mx-auto flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-fg">System Exception</h1>
          <p className="text-xs text-fg-muted leading-relaxed">
            A critical rendering failure occurred. Please refresh the page to restore runtime services.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-on-brand text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload Application</span>
          </button>
        </div>
      </body>
    </html>
  );
}

