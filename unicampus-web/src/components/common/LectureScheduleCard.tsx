"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Monitor } from "lucide-react";
import ProfileAvatar from "@/components/common/ProfileAvatar";
import { Badge, Button, Card, cn, type BadgeVariant } from "@/components/ui";

export interface LectureScheduleCardProps {
  courseCode: string;
  courseTitle: string;
  timeRange: string;
  room: string;
  instructorName: string;
  status: "ongoing" | "upcoming" | "scheduled" | "completed";
  statusText?: string;
  actionButton?: {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: React.ComponentType<{ className?: string }>;
  };
  secondaryNote?: string;
  isLab?: boolean;
}

export default function LectureScheduleCard({
  courseCode,
  courseTitle,
  timeRange,
  room,
  instructorName,
  status,
  statusText,
  actionButton,
  secondaryNote,
  isLab = false,
}: LectureScheduleCardProps) {
  const isOngoing = status === "ongoing";
  const isUpcoming = status === "upcoming";

  const statusVariant: BadgeVariant = isOngoing
    ? "success"
    : isUpcoming
    ? "brand"
    : "neutral";

  const defaultStatusLabel = isOngoing
    ? "Ongoing"
    : isUpcoming
    ? "Upcoming"
    : status === "completed"
    ? "Completed"
    : "Scheduled";

  const ActionIcon = actionButton?.icon;

  return (
    <Card
      padding="md"
      className={cn(
        "relative overflow-hidden p-5",
        isOngoing && "border-brand/50 bg-brand-soft/20"
      )}
    >

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2 min-w-0">
          {/* Header Meta: course code, single status badge, tabular time range */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span
              className={cn(
                "font-mono text-xs font-medium",
                isOngoing ? "text-brand" : "text-fg-muted"
              )}
            >
              {courseCode}
            </span>

            <Badge variant={statusVariant} dot={false}>
              {statusText || defaultStatusLabel}
            </Badge>

            <span className="text-xs text-fg-muted tabular-nums">
              {timeRange}
            </span>
          </div>

          {/* Course Title */}
          <h3 className="font-semibold text-base text-fg">
            {courseTitle}
          </h3>

          {/* Room & Instructor Meta */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-fg-muted">
            <div className="flex items-center gap-1.5 text-fg">
              {isLab ? (
                <Monitor className="w-3.5 h-3.5 text-fg-muted shrink-0" aria-hidden="true" />
              ) : (
                <MapPin
                  className={cn(
                    "w-3.5 h-3.5 shrink-0",
                    isOngoing ? "text-brand" : "text-fg-muted"
                  )}
                  aria-hidden="true"
                />
              )}
              <span>{room}</span>
            </div>

            <div className="flex items-center gap-2">
              <ProfileAvatar size="xs" className="w-5 h-5" />
              <span>{instructorName}</span>
            </div>
          </div>
        </div>

        {/* Right Action Cluster */}
        {(secondaryNote || actionButton) && (
          <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-line">
            {secondaryNote && (
              <span
                className={cn(
                  "text-xs font-medium",
                  isOngoing ? "text-success" : "text-fg-muted"
                )}
              >
                {secondaryNote}
              </span>
            )}

            {actionButton &&
              (actionButton.href ? (
                <Link
                  href={actionButton.href}
                  className={cn(
                    "min-h-[44px] px-4 py-2 rounded-xl text-xs font-medium inline-flex items-center justify-center gap-1.5 transition-colors duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
                    isOngoing
                      ? "bg-brand hover:bg-brand-hover text-on-brand"
                      : "bg-surface hover:bg-surface-2 text-fg border border-line"
                  )}
                >
                  {ActionIcon && (
                    <ActionIcon className="w-3.5 h-3.5 shrink-0" />
                  )}
                  <span>{actionButton.label}</span>
                </Link>
              ) : (
                <Button
                  size="sm"
                  variant={isOngoing ? "primary" : "secondary"}
                  onClick={actionButton.onClick}
                  leftIcon={
                    ActionIcon ? (
                      <ActionIcon className="w-3.5 h-3.5 shrink-0" />
                    ) : undefined
                  }
                >
                  {actionButton.label}
                </Button>
              ))}
          </div>
        )}
      </div>
    </Card>
  );
}
