"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { InlineSpinner } from "@/components/ui/Skeleton";

export function StudentRoleGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, isLoaded, isDemoMode } = useAdminAuth();

  useEffect(() => {
    if (!isLoaded) return;
    if (!isDemoMode && !currentUser) {
      const next = pathname ? `?next=${encodeURIComponent(pathname)}` : "";
      router.replace(`/login${next}`);
    }
  }, [isLoaded, isDemoMode, currentUser, pathname, router]);

  if (!isLoaded || (!isDemoMode && !currentUser)) {
    return (
      <div className="min-h-[60dvh] w-full flex flex-col items-center justify-center gap-3 p-6">
        <InlineSpinner size="lg" label="Verifying session" />
      </div>
    );
  }

  return <>{children}</>;
}
