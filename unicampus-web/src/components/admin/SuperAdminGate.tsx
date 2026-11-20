"use client";

import React from 'react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { Crown, ArrowLeft, Building2 } from 'lucide-react';
import Link from 'next/link';

interface SuperAdminGateProps {
  children: React.ReactNode;
  featureName?: string;
}

export function SuperAdminGate({ children, featureName = "System Settings" }: SuperAdminGateProps) {
  const { isSuperAdmin, isLoaded, currentUser, adminDepartmentName } = useAdminAuth();

  // During SSR or before auth state loads, render children to avoid layout flash
  if (!isLoaded || isSuperAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="flex-1 flex items-center justify-center p-6 min-h-[70vh]">
      <div className="w-full max-w-lg bg-surface border border-line rounded-2xl p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-brand-soft border border-brand/20 flex items-center justify-center mx-auto mb-5">
          <Crown className="w-7 h-7 text-brand" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-soft border border-brand/20 text-brand text-xs font-sans font-semibold mb-3">
          <span>Institutional Authority Required</span>
        </div>

        <h2 className="text-xl font-semibold text-fg mb-2">
          {featureName} Restricted
        </h2>

        <div className="text-xs text-fg-muted font-medium mb-5 leading-relaxed">
          This section contains central university infrastructure, institutional finance, and system-wide controls managed exclusively by the Super Administrator.
          
          <div className="block mt-4 p-3.5 rounded-xl bg-canvas border border-line text-xs font-semibold text-fg-muted text-left space-y-1.5">
            <div className="flex justify-between items-center text-xs gap-2">
              <span className="text-fg-muted">Current Account:</span>
              <span className="text-fg font-semibold">{currentUser?.full_name}</span>
            </div>
            <div className="flex justify-between items-center text-xs gap-2">
              <span className="text-fg-muted">Operating Scope:</span>
              <span className="inline-flex items-center gap-1 text-brand font-semibold">
                <Building2 className="w-3 h-3" /> {adminDepartmentName || 'Department'} Administrator
              </span>
            </div>
            <div className="flex justify-between items-center text-xs gap-2">
              <span className="text-fg-muted">Permission Level:</span>
              <span className="font-sans text-warning font-semibold">
                Departmental Scope Only
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <Link
            href="/admin/dashboard"
            className="w-full min-h-[44px] py-3 px-4 bg-brand text-on-brand hover:bg-brand-hover rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {adminDepartmentName || 'Department'} Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

