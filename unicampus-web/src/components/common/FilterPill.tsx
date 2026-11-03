import React from "react";
import { themeTokens } from "@/lib/theme";

export interface FilterPillProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active: boolean;
  label: string;
}

export default function FilterPill({
  active,
  label,
  onClick,
  className = "",
  ...props
}: FilterPillProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`px-5 py-2.5 rounded-full text-xs font-bold transition-colors duration-150 whitespace-nowrap cursor-pointer border outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 ${
        active
          ? "bg-brand text-white border-brand shadow-sm shadow-brand/25"
          : `${themeTokens.surface} text-slate-600 dark:text-[#8D96A0] hover:bg-slate-50 dark:hover:bg-[#161B22] border-slate-200 dark:border-[#30363D] hover:border-slate-300 dark:hover:border-[#484F58]`
      } ${className}`.trim()}
      {...props}
    >
      {label}
    </button>
  );
}

