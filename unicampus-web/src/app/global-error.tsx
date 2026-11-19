"use client";

import React, { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

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
      <body className="min-h-dvh flex items-center justify-center p-4 bg-[#F5F5FA] dark:bg-[#0B0B10] text-[#111116] dark:text-[#ECECF4] font-sans">
        <div className="w-full max-w-md p-6 sm:p-8 rounded-[20px] bg-white dark:bg-[#15151D] border border-[#E7E7F0] dark:border-[#262630] text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 mx-auto flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">System Exception</h1>
          <p className="text-xs text-[#6E6E82] leading-relaxed">
            A critical rendering failure occurred. Please refresh the page to restore runtime services.
          </p>
          <button
            onClick={() => reset()}
            className="w-full px-4 py-2.5 rounded-xl bg-[#605BFF] hover:bg-[#524DE0] text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload Application</span>
          </button>
        </div>
      </body>
    </html>
  );
}

