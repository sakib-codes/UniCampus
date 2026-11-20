"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ACTIVE_TERM } from "@/lib/canonicalCampus";
import { useAdminAuth } from "@/context/AdminAuthContext";

interface SplashScreenProps {
  autoRedirect?: boolean;
}

export function SplashScreen({ autoRedirect = false }: SplashScreenProps) {
  const router = useRouter();
  const { currentUser } = useAdminAuth();

  const targetDashboard =
    currentUser?.role === "admin"
      ? "/admin/dashboard"
      : currentUser?.role === "teacher"
      ? "/teacher/dashboard"
      : "/dashboard";

  useEffect(() => {
    if (!autoRedirect) return;
    const redirectTimer = setTimeout(() => {
      router.push(targetDashboard);
    }, 900);
    return () => clearTimeout(redirectTimer);
  }, [autoRedirect, router, targetDashboard]);

  const handleSkip = () => {
    router.push(targetDashboard);
  };

  return (
    <div className="min-h-dvh w-full flex flex-col items-center justify-between py-6 px-4 bg-canvas text-fg">
      {/* Floating Center Splash Card */}
      <main className="w-full flex-1 flex items-center justify-center">
        <div className="w-full max-w-[420px] bg-surface rounded-2xl p-6 sm:p-10 border border-line shadow-sm flex flex-col items-center text-center">
          {/* Brand Icon Squircle */}
          <div className="w-16 h-16 rounded-2xl bg-brand flex items-center justify-center shadow-sm mb-6">
            <span className="text-3xl font-bold text-on-brand leading-none">
              U
            </span>
          </div>

          {/* Brand Name */}
          <h1 className="text-2xl sm:text-3xl font-semibold text-fg tracking-tight mb-1">
            UniCampus
          </h1>

          {/* Subtitle */}
          <p className="text-sm text-fg-muted mb-7">
            Academic Portal · {ACTIVE_TERM}
          </p>

          <div className="w-full space-y-2">
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={handleSkip}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Portal
            </Button>
            <div className="flex items-center justify-center gap-3 text-xs text-fg-muted">
              <Link
                href="/login"
                className="inline-flex items-center min-h-[44px] px-2 font-medium hover:text-fg hover:underline"
              >
                Sign in
              </Link>
              <span className="text-line" aria-hidden="true">·</span>
              <Link
                href="/"
                className="inline-flex items-center min-h-[44px] px-2 font-medium hover:text-fg hover:underline"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-xs text-fg-muted text-center pt-4">
        © {new Date().getFullYear()} UniCampus. All rights reserved.
      </footer>
    </div>
  );
}
