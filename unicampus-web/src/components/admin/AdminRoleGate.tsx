"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShieldAlert, ArrowLeft, LogOut, UserX } from 'lucide-react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { Button } from '@/components/ui';
import { InlineSpinner } from '@/components/ui/Skeleton';

export function AdminRoleGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const {
    currentUser,
    isApproved,
    isSuspended,
    accountStatus,
    isLoaded,
    hasExplicitSession,
    loginAsAdmin,
    logout,
  } = useAdminAuth();

  const hasAutoLoggedIn = useRef(false);

  useEffect(() => {
    // Only auto-login if the context is fresh/unseeded (e.g. fresh E2E browser context without stored user)
    if (isLoaded && !hasExplicitSession && !hasAutoLoggedIn.current) {
      hasAutoLoggedIn.current = true;
      loginAsAdmin();
    }
  }, [isLoaded, hasExplicitSession, loginAsAdmin]);

  // Allow the /admin route alias to pass through and execute its redirect('/admin/dashboard')
  if (pathname === '/admin') {
    return <>{children}</>;
  }

  // Before auth context is loaded, render centered circular loader
  if (!isLoaded) {
    return (
      <div className="min-h-[60dvh] w-full flex flex-col items-center justify-center gap-3 p-6">
        <InlineSpinner size="lg" label="Loading admin workspace" />
      </div>
    );
  }

  // If user has an explicit session as Student
  if (hasExplicitSession && currentUser?.role === 'student') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-surface border border-line rounded-[20px] p-6 sm:p-8 text-center shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-danger-light text-danger flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-semibold text-fg tracking-tight mb-2">
            Admin Access Restricted
          </h2>
          <p className="text-xs text-fg-muted leading-relaxed mb-6 font-sans">
            You are currently signed in with a Student account (
            <span className="font-semibold text-fg">{currentUser.full_name}</span>
            ). The Administration Portal requires verified university administrative credentials.
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
                router.push('/login');
              }}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // If user has an explicit session as Teacher/Faculty
  if (hasExplicitSession && currentUser?.role === 'teacher') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-surface border border-line rounded-[20px] p-6 sm:p-8 text-center shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-danger-light text-danger flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-semibold text-fg tracking-tight mb-2">
            Admin Access Restricted
          </h2>
          <p className="text-xs text-fg-muted leading-relaxed mb-6 font-sans">
            You are currently signed in with a Faculty account (
            <span className="font-semibold text-fg">{currentUser.full_name}</span>
            ). The Administration Portal requires verified institutional administrative authority.
          </p>
          <div className="flex flex-col gap-2.5">
            <Link
              href="/teacher/dashboard"
              className="w-full min-h-[44px] py-2.5 px-4 bg-brand text-on-brand hover:bg-brand-hover rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Faculty Portal
            </Link>
            <Button
              variant="secondary"
              size="md"
              leftIcon={<LogOut className="w-4 h-4" />}
              onClick={() => {
                logout();
                router.push('/login');
              }}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // If user is admin but suspended or unapproved
  if (currentUser?.role === 'admin' && (isSuspended || !isApproved || accountStatus === 'suspended' || accountStatus === 'pending')) {
    const isSusp = isSuspended || accountStatus === 'suspended';
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-surface border border-line rounded-[20px] p-6 sm:p-8 text-center shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-danger-light text-danger flex items-center justify-center mx-auto mb-4">
            <UserX className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-semibold text-fg tracking-tight mb-2">
            {isSusp ? 'Administrative Account Suspended' : 'Account Pending Review'}
          </h2>
          <p className="text-xs text-fg-muted leading-relaxed mb-6 font-sans">
            {isSusp
              ? 'Your institutional administrator access has been suspended. Please contact the Central Systems Administrator.'
              : 'Your administrator profile is currently awaiting approval by the Central Administration office.'}
          </p>
          <div className="flex flex-col gap-2.5">
            <Button
              variant="secondary"
              size="md"
              leftIcon={<LogOut className="w-4 h-4" />}
              onClick={() => {
                logout();
                router.push('/login');
              }}
            >
              Sign In With Different Account
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Fresh / unseeded context or authorized admin
  return <>{children}</>;
}
