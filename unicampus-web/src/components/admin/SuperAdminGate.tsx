"use client";

import React from 'react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { Crown, ArrowLeft, KeyRound, Building2 } from 'lucide-react';
import Link from 'next/link';

interface SuperAdminGateProps {
  children: React.ReactNode;
  featureName?: string;
}

export function SuperAdminGate({ children, featureName = "System Settings" }: SuperAdminGateProps) {
  const { isSuperAdmin, isLoaded, currentUser, adminDepartmentName, loginAsAdmin } = useAdminAuth();

  // During SSR or before auth state loads, render children to avoid layout flash
  if (!isLoaded || isSuperAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="flex-1 flex items-center justify-center p-6 min-h-[70vh]">
      <div className="w-full max-w-lg bg-surface border border-line rounded-[20px] p-8 text-center shadow-lg">
        <div className="w-14 h-14 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center mx-auto mb-5 shadow-inner">
          <Crown className="w-7 h-7 text-brand dark:text-brand" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand dark:text-brand text-xs font-mono font-bold mb-3">
          <span>Institutional Authority Required</span>
        </div>

        <h2 className="text-xl font-black text-slate-900 dark:text-fg mb-2">
          {featureName} Restricted
        </h2>

        <div className={`text-xs text-fg-muted font-medium mb-5 leading-relaxed`}>
          This section contains central university infrastructure, institutional finance, and system-wide controls managed exclusively by the Super Administrator.
          
          <div className={`block mt-4 p-3.5 rounded-xl bg-canvas border border-line text-xs font-semibold text-slate-700 dark:text-fg-muted text-left space-y-1.5`}>
            <div className="flex justify-between items-center text-xs">
              <span className={"text-fg-muted"}>Current Account:</span>
              <span className="text-slate-900 dark:text-fg font-bold">{currentUser?.full_name}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className={"text-fg-muted"}>Operating Scope:</span>
              <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold">
                <Building2 className="w-3 h-3" /> {adminDepartmentName || 'Department'} Administrator
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className={"text-fg-muted"}>Permission Level:</span>
              <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">
                Departmental Scope Only
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <Link
            href="/admin/dashboard"
            className={`w-full py-3 px-4 bg-brand text-white hover:bg-brand-hover rounded-xl font-bold text-xs flex items-center justify-center gap-2`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {adminDepartmentName || 'Department'} Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

