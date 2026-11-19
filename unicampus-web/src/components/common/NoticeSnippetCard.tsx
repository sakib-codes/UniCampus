"use client";

import React from "react";
import Link from "next/link";
import { Badge, Card, type BadgeVariant } from "@/components/ui";

export interface NoticeSnippetCardProps {
  id: string | number;
  category: "URGENT" | "EXAM" | "ACADEMIC" | "EVENT" | string;
  timeAgo: string;
  title: string;
  description: string;
  href?: string;
}

export default function NoticeSnippetCard({
  id,
  category,
  timeAgo,
  title,
  description,
  href = `/notices/${id}`,
}: NoticeSnippetCardProps) {
  const normalized = category.toUpperCase();
  const variant: BadgeVariant =
    normalized === "URGENT"
      ? "danger"
      : normalized === "EXAM" || normalized === "EXAM SCHEDULE"
      ? "brand"
      : "neutral";

  return (
    <Link href={href} className="block group h-full cursor-pointer">
      <Card
        padding="sm"
        interactive
        className="h-full flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <Badge variant={variant}>{category}</Badge>
            <span className="text-xs text-fg-muted tabular-nums">
              {timeAgo}
            </span>
          </div>

          <h4 className="font-semibold text-sm text-fg group-hover:text-brand transition-colors duration-150 line-clamp-2">
            {title}
          </h4>

          <p className="text-xs text-fg-muted mt-1 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>
      </Card>
    </Link>
  );
}
