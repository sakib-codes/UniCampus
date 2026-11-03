import React from "react";
import { themeTokens } from "@/lib/theme";

interface SidebarFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function SidebarFooter({ children, className = "" }: SidebarFooterProps) {
  return (
    <div className={`p-3 border-t ${themeTokens.border} bg-slate-50/50 dark:bg-[#010409]/60 ${className}`}>
      {children}
    </div>
  );
}

