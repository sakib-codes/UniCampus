"use client";

import React, { ReactNode } from "react";
import { Tabs, type TabOption } from "@/components/ui";

export interface TabItem<T extends string = string> {
  id: T;
  label: string | ReactNode;
  badge?: string | number | null;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface AnimatedTabsProps<T extends string = string> {
  tabs: readonly TabItem<T>[] | TabItem<T>[];
  activeTab: T;
  onChange: (tabId: T) => void;
  layoutId?: string;
  className?: string;
  tabClassName?: string;
  activeTabClassName?: string;
  size?: "sm" | "md" | "lg";
}

export function AnimatedTabs<T extends string = string>({
  tabs,
  activeTab,
  onChange,
  layoutId,
  className = "",
  tabClassName = "",
  activeTabClassName = "",
  size = "md",
}: AnimatedTabsProps<T>) {
  const mappedTabs: TabOption<T>[] = tabs.map((tab) => {
    const Icon = tab.icon;
    return {
      id: tab.id,
      label: tab.label,
      count: tab.badge,
      icon: Icon ? <Icon className="w-3.5 h-3.5 shrink-0" /> : undefined,
    };
  });

  return (
    <Tabs
      tabs={mappedTabs}
      value={activeTab}
      onChange={onChange}
      layoutId={layoutId}
      variant="segmented"
      size={size}
      className={className}
      tabClassName={tabClassName}
      activeTabClassName={activeTabClassName}
    />
  );
}
