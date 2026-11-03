"use client";

import React from 'react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { Crown, ArrowLeft, KeyRound, Building2 } from 'lucide-react';
import Link from 'next/link';
import { themeTokens } from '@/lib/theme';

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
      <div className={`w-full max-w-lg ${themeTokens.surface} border ${themeTokens.border} rounded-2xl p-8 text-center shadow-lg `}>
        <div className="w-14 h-14 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center mx-auto mb-5 shadow-inner">
          <Crown className="w-7 h-7 text-brand dark:text-[#60A5FA]" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand dark:text-[#60A5FA] text-[11px] font-mono font-bold uppercase tracking-wider mb-3">
          <span>Institutional Authority Required</span>
        </div>

        <h2 className="text-xl font-black text-slate-900 dark:text-[#F0F6FC] mb-2">
          {featureName} Restricted
        </h2>

        <div className={`text-xs ${themeTokens.textMuted} font-medium mb-5 leading-relaxed`}>
          This section contains central university infrastructure, institutional finance, and system-wide controls managed exclusively by the Super Administrator.
          
          <div className={`block mt-4 p-3.5 ${themeTokens.cardRecessed} text-xs font-semibold text-slate-700 dark:text-[#8D96A0] text-left space-y-1.5`}>
            <div className="flex justify-between items-center text-[11px]">
              <span className={themeTokens.textMuted}>Current Account:</span>
              <span className="text-slate-900 dark:text-[#F0F6FC] font-bold">{currentUser?.full_name}</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className={themeTokens.textMuted}>Operating Scope:</span>
              <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold">
                <Building2 className="w-3 h-3" /> {adminDepartmentName || 'Department'} Administrator
              </span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className={themeTokens.textMuted}>Permission Level:</span>
              <span className="font-mono text-amber-600 dark:text-amber-400 uppercase font-bold">
                Departmental Scope Only
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <Link
            href="/admin/dashboard"
            className={`w-full py-3 px-4 ${themeTokens.btnHero} text-xs flex items-center justify-center gap-2`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {adminDepartmentName || 'Department'} Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

