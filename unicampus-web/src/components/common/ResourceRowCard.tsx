"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { Card, cn } from "@/components/ui";

export interface ResourceRowCardProps {
  icon?: LucideIcon;
  avatarNode?: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  tags?: React.ReactNode;
  metadata?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function ResourceRowCard({
  icon: Icon,
  avatarNode,
  iconBg = "bg-surface-2",
  iconColor = "text-brand",
  title,
  subtitle,
  tags,
  metadata,
  action,
  className = "",
  onClick,
}: ResourceRowCardProps) {
  return (
    <Card
      padding="sm"
      interactive={Boolean(onClick)}
      onClick={onClick}
      className={cn(
        "p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4",
        className
      )}
    >
      {/* Left Info: Icon/Avatar + Title/Subtitle/Tags */}
      <div className="flex items-start sm:items-center gap-3.5 min-w-0">
        {avatarNode ? (
          <div className="shrink-0">{avatarNode}</div>
        ) : Icon ? (
          <div
            className={cn(
              "w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 border border-line",
              iconBg,
              iconColor
            )}
          >
            <Icon className="w-5 h-5" aria-hidden="true" />
          </div>
        ) : null}

        <div className="min-w-0">
          <div className="font-semibold text-fg text-sm sm:text-base leading-snug">
            {title}
          </div>
          {subtitle && (
            <div className="text-xs text-fg-muted mt-0.5">{subtitle}</div>
          )}
          {tags && <div className="mt-2 flex flex-wrap gap-1.5">{tags}</div>}
        </div>
      </div>

      {/* Right Info: Metadata & Action Button */}
      {(metadata || action) && (
        <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-line">
          {metadata && <div className="text-xs text-fg-muted">{metadata}</div>}
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
    </Card>
  );
}
