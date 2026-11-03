"use client";

import React, { useEffect, useRef } from 'react';
import { useAdminAuth } from '@/context/AdminAuthContext';

export function AdminRoleGate({ children }: { children: React.ReactNode }) {
  const { isAdmin, isApproved, loginAsAdmin } = useAdminAuth();
  const hasLoggedIn = useRef(false);

  useEffect(() => {
    if (!hasLoggedIn.current && (!isAdmin || !isApproved)) {
      hasLoggedIn.current = true;
      loginAsAdmin();
    }
  }, [isAdmin, isApproved, loginAsAdmin]);

  return <>{children}</>;
}
