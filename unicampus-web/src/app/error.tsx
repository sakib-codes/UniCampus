"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/Button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function RootError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Application error boundary triggered:", error);
  }, [error]);

  return (
    <div className="min-h-dvh flex items-center justify-center p-4 bg-canvas text-fg">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl bg-surface border border-line text-center space-y-5 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-danger/10 border border-danger/20 text-danger mx-auto flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-semibold tracking-tight text-fg">
            Something unexpected occurred
          </h1>
          <p className="text-xs text-fg-muted leading-relaxed">
            An unexpected error interrupted this view. You can reload the state or return to the campus portal home.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <Button
            variant="secondary"
            size="md"
            fullWidth
            onClick={() => reset()}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Try again
          </Button>
          <Link
            href="/dashboard"
            className={buttonVariants({ variant: "primary", size: "md", fullWidth: true })}
          >
            <Home className="w-4 h-4 shrink-0" aria-hidden="true" />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

