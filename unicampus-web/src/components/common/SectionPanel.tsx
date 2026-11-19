"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, cn } from "@/components/ui";

export interface SectionPanelProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  noDivider?: boolean;
}

export default function SectionPanel({
  title,
  subtitle,
  icon: Icon,
  iconColor = "text-brand",
  iconBg = "bg-brand-soft",
  action,
  children,
  className = "",
  headerClassName = "",
  bodyClassName = "",
  noDivider = false,
}: SectionPanelProps) {
  return (
    <Card as="section" padding="md" className={className}>
      <CardHeader divided={!noDivider} className={headerClassName}>
        <div className="flex items-center gap-3 min-w-0">
          {Icon && (
            <div
              className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-line",
                iconBg,
                iconColor
              )}
            >
              <Icon className="w-4 h-4" aria-hidden="true" />
            </div>
          )}

          <div className="min-w-0">
            {typeof title === "string" ? (
              <CardTitle as="h2" className="truncate">
                {title}
              </CardTitle>
            ) : (
              title
            )}
            {subtitle && (
              <p className="text-xs text-fg-muted mt-0.5 truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {action && (
          <div className="shrink-0 flex items-center gap-2">{action}</div>
        )}
      </CardHeader>

      <CardContent className={bodyClassName}>{children}</CardContent>
    </Card>
  );
}
