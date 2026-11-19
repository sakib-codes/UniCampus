"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { Card, Stat, cn } from "@/components/ui";

export interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  suffix?: string;
  duration?: number;
  className?: string;
  onClick?: () => void;
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  iconColor = "text-brand",
  iconBg = "bg-brand-soft",
  suffix = "",
  duration: _duration = 0.8,
  className = "",
  onClick,
}: StatCardProps) {
  const hasPaddingOverride = /(?:^|\s)p-\S+/.test(className);

  return (
    <Card
      padding="md"
      interactive={Boolean(onClick)}
      onClick={onClick}
      className={cn(!hasPaddingOverride && "p-5", className)}
    >
      <Stat
        label={label}
        value={
          <>
            <span>{value}</span>
            {suffix && (
              <span className="text-base font-medium ml-0.5 text-fg-muted">
                {suffix}
              </span>
            )}
          </>
        }
        icon={
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-line",
              iconBg,
              iconColor
            )}
          >
            <Icon className="w-5 h-5" aria-hidden="true" />
          </div>
        }
      />
    </Card>
  );
}
