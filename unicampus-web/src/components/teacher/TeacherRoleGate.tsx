"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, LogOut, ShieldAlert, UserX } from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { Button } from "@/components/ui";
import { InlineSpinner } from "@/components/ui/Skeleton";

export function TeacherRoleGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const {
    currentUser,
    isApproved,
    isSuspended,
    accountStatus,
    isLoaded,
    hasExplicitSession,
    isDemoMode,
    loginAsFaculty,
    logout,
  } = useAdminAuth();

  const hasAutoLoggedIn = useRef(false);

  useEffect(() => {
    if (!isLoaded) return;

    // Live mode: NEVER auto-login — redirect unauthenticated visitors to /login
    if (!isDemoMode && !currentUser) {
      const next = pathname ? `?next=${encodeURIComponent(pathname)}` : "";
      router.replace(`/login${next}`);
      return;
    }

    // Demo mode only: auto-seed faculty only if no explicit session exists
    if (isDemoMode && !hasExplicitSession && !hasAutoLoggedIn.current) {
      hasAutoLoggedIn.current = true;
      loginAsFaculty();
    }
  }, [isLoaded, isDemoMode, currentUser, hasExplicitSession, loginAsFaculty, pathname, router]);

  if (!isLoaded || (!isDemoMode && !currentUser)) {
    return (
      <div className="min-h-[60dvh] w-full flex flex-col items-center justify-center gap-3 p-6">
        <InlineSpinner size="lg" label="Verifying faculty session" />
      </div>
    );
  }

  // Block Student accounts from accessing Faculty Portal
  if (currentUser?.role === "student") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-surface border border-line rounded-[20px] p-6 sm:p-8 text-center shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-danger-light text-danger flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-semibold text-fg tracking-tight mb-2">
            Faculty Access Restricted
          </h2>
          <p className="text-xs text-fg-muted leading-relaxed mb-6 font-sans">
            You are currently signed in with a Student account (
            <span className="font-semibold text-fg">{currentUser.full_name}</span>
            ). The Faculty Portal requires verified instructor credentials.
          </p>
          <div className="flex flex-col gap-2.5">
            <Link
              href="/dashboard"
              className="w-full min-h-[44px] py-2.5 px-4 bg-brand text-on-brand hover:bg-brand-hover rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Student Portal
            </Link>
            <Button
              variant="secondary"
              size="md"
              leftIcon={<LogOut className="w-4 h-4" />}
              onClick={() => {
                logout();
                router.push("/login");
              }}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Block suspended or unapproved faculty accounts
  if (
    currentUser?.role === "teacher" &&
    (isSuspended || !isApproved || accountStatus === "suspended" || accountStatus === "pending")
  ) {
    const isSusp = isSuspended || accountStatus === "suspended";
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-surface border border-line rounded-[20px] p-6 sm:p-8 text-center shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-danger-light text-danger flex items-center justify-center mx-auto mb-4">
            <UserX className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-semibold text-fg tracking-tight mb-2">
            {isSusp ? "Faculty Account Suspended" : "Account Pending Review"}
          </h2>
          <p className="text-xs text-fg-muted leading-relaxed mb-6 font-sans">
            {isSusp
              ? "Your faculty portal access has been suspended. Please contact the Department Administration."
              : "Your faculty profile is currently awaiting approval by the Administration office."}
          </p>
          <div className="flex flex-col gap-2.5">
            <Button
              variant="secondary"
              size="md"
              leftIcon={<LogOut className="w-4 h-4" />}
              onClick={() => {
                logout();
                router.push("/login");
              }}
            >
              Sign In With Different Account
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
