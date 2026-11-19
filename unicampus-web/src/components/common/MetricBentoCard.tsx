"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { Card, Stat, cn } from "@/components/ui";

export interface MetricBentoCardProps {
  label: string;
  value: string | number;
  denominator?: string;
  badge?: React.ReactNode;
  progressPercent?: number;
  progressBarGradient?: string;
  footerText?: React.ReactNode;
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  className?: string;
  onClick?: () => void;
}

export default function MetricBentoCard({
  label,
  value,
  denominator,
  badge,
  progressPercent,
  progressBarGradient = "bg-brand",
  footerText,
  icon: Icon,
  iconBg = "bg-brand-soft border-brand/20",
  iconColor = "text-brand",
  className = "",
  onClick,
}: MetricBentoCardProps) {
  return (
    <Card
      padding="md"
      interactive={Boolean(onClick)}
      onClick={onClick}
      className={cn("flex flex-col justify-between gap-4", className)}
    >
      <Stat
        label={label}
        value={
          <span className="inline-flex items-baseline gap-2">
            <span>{value}</span>
            {denominator && (
              <span className="text-xs font-normal text-fg-muted">
                {denominator}
              </span>
            )}
          </span>
        }
        icon={
          <div
            className={cn(
              "w-9 h-9 rounded-xl border flex items-center justify-center shrink-0",
              iconBg,
              iconColor
            )}
          >
            <Icon className="w-4 h-4" aria-hidden="true" />
          </div>
        }
      />

      {(progressPercent !== undefined || badge || footerText) && (
        <div className="space-y-2">
          {progressPercent !== undefined && (
            <div className="w-full bg-surface-2 h-1.5 rounded-full overflow-hidden border border-line">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-300",
                  progressBarGradient
                )}
                style={{
                  width: `${
                    Number.isFinite(progressPercent)
                      ? Math.min(100, Math.max(0, progressPercent))
                      : 0
                  }%`,
                }}
              />
            </div>
          )}

          {badge && <div>{badge}</div>}
          {footerText && (
            <div className="text-xs text-fg-muted">{footerText}</div>
          )}
        </div>
      )}
    </Card>
  );
}
