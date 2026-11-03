"use client";

import { useEffect, useRef } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";

export function TeacherRoleGate({ children }: { children: React.ReactNode }) {
  const { currentUser, loginAsFaculty } = useAdminAuth();
  const hasLoggedIn = useRef(false);

  useEffect(() => {
    if (!hasLoggedIn.current && currentUser?.role !== "teacher" && currentUser?.role !== "admin") {
      hasLoggedIn.current = true;
      loginAsFaculty();
    }
  }, [currentUser, loginAsFaculty]);

  return <>{children}</>;
}
