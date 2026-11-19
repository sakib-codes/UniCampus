import React from "react";
import { Chip } from "@/components/ui";

export interface FilterPillProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active: boolean;
  label: string;
}

export default function FilterPill({
  active,
  label,
  className = "",
  ...props
}: FilterPillProps) {
  const isTab = (props.role ?? "tab") === "tab";

  return (
    <Chip
      active={active}
      label={label}
      tone="brand"
      role="tab"
      aria-selected={isTab ? active : undefined}
      className={className}
      {...props}
    />
  );
}
