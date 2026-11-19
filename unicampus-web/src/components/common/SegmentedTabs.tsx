"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { Tabs, type TabOption } from "@/components/ui";

export interface TabItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  count?: number;
}

export interface SegmentedTabsProps {
  tabs: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
  tabClassName?: string;
}

export default function SegmentedTabs({
  tabs,
  activeId,
  onChange,
  className = "",
  tabClassName = "",
}: SegmentedTabsProps) {
  const mappedTabs: TabOption<string>[] = tabs.map((tab) => {
    const Icon = tab.icon;
    return {
      id: tab.id,
      label: tab.label,
      icon: Icon ? <Icon className="w-3.5 h-3.5 shrink-0" /> : undefined,
      count: tab.count,
    };
  });

  return (
    <Tabs
      tabs={mappedTabs}
      value={activeId}
      onChange={onChange}
      variant="segmented"
      size="sm"
      className={className}
      tabClassName={tabClassName}
    />
  );
}
