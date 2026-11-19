import React from "react";
import { cn } from "./cn";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "py-12 px-6 text-center flex flex-col items-center justify-center gap-3",
        className
      )}
    >
      {icon && (
        <div
          className="w-12 h-12 rounded-2xl bg-surface-2 border border-line text-fg-muted flex items-center justify-center shrink-0"
          aria-hidden="true"
        >
          {icon}
        </div>
      )}
      <div className="space-y-1 max-w-sm">
        <p className="text-base font-semibold text-fg">{title}</p>
        {description && (
          <p className="text-sm text-fg-muted">{description}</p>
        )}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
