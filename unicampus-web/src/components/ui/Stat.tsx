import React from "react";
import { cn } from "./cn";

export type StatTone = "neutral" | "brand" | "success" | "warning" | "danger";

export interface StatProps {
  label: React.ReactNode;
  value: React.ReactNode;
  delta?: React.ReactNode;
  hint?: React.ReactNode;
  icon?: React.ReactNode;
  tone?: StatTone;
  className?: string;
}

const deltaToneClasses: Record<StatTone, string> = {
  neutral: "text-fg-muted",
  brand: "text-brand",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
};

export function Stat({
  label,
  value,
  delta,
  hint,
  icon,
  tone = "neutral",
  className,
}: StatProps) {
  const meta = delta ?? hint;

  return (
    <div className={cn("flex flex-col justify-between gap-3", className)}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-fg-muted">{label}</span>
        {icon && <div className="shrink-0">{icon}</div>}
      </div>

      <div className="space-y-1.5">
        <div className="text-2xl sm:text-[32px] leading-[1.1] font-semibold tracking-tight text-fg tabular-nums">
          {value}
        </div>
        {meta && (
          <div className={cn("text-xs font-medium", delta ? deltaToneClasses[tone] : "text-fg-muted")}>
            {meta}
          </div>
        )}
      </div>
    </div>
  );
}
