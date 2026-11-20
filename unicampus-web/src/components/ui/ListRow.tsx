import React from "react";
import Link from "next/link";
import { cn } from "./cn";

export interface ListRowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  leading?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  trailing?: React.ReactNode;
  divided?: boolean;
  href?: string;
  interactive?: boolean;
}

export function ListRow({
  leading,
  title,
  subtitle,
  badge,
  trailing,
  divided = true,
  href,
  interactive = false,
  className,
  onClick,
  onKeyDown,
  role,
  tabIndex,
  ...props
}: ListRowProps) {
  const isClickable = Boolean(href || interactive || onClick);
  const isButtonLike = !href && Boolean(onClick || interactive);

  const rowClasses = cn(
    "min-h-[56px] sm:min-h-[64px] px-4 py-3 flex items-center justify-between gap-3.5 transition-colors duration-150",
    divided && "border-b border-line last:border-b-0",
    isClickable &&
      "hover:bg-surface-2/70 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
    className
  );

  const content = (
    <>
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        {leading && <div className="shrink-0">{leading}</div>}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 min-w-0">
            <div className="text-sm font-medium text-fg truncate">{title}</div>
            {badge && <div className="shrink-0">{badge}</div>}
          </div>
          {subtitle && (
            <div className="text-xs text-fg-muted mt-0.5 truncate">
              {subtitle}
            </div>
          )}
        </div>
      </div>

      {trailing && (
        <div className="shrink-0 flex items-center gap-2">{trailing}</div>
      )}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={rowClasses}
        onClick={
          onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>
        }
        onKeyDown={
          onKeyDown as unknown as React.KeyboardEventHandler<HTMLAnchorElement>
        }
        role={role}
        tabIndex={tabIndex}
        {...(props as Omit<
          React.AnchorHTMLAttributes<HTMLAnchorElement>,
          "href" | "title"
        >)}
      >
        {content}
      </Link>
    );
  }

  if (isButtonLike) {
    return (
      <button
        type="button"
        onClick={onClick as unknown as React.MouseEventHandler<HTMLButtonElement>}
        onKeyDown={onKeyDown as unknown as React.KeyboardEventHandler<HTMLButtonElement>}
        role={role}
        tabIndex={tabIndex}
        className={cn("w-full text-left", rowClasses)}
        {...(props as Omit<
          React.ButtonHTMLAttributes<HTMLButtonElement>,
          "title" | "type"
        >)}
      >
        {content}
      </button>
    );
  }

  return (
    <div
      onKeyDown={onKeyDown}
      role={role}
      tabIndex={tabIndex}
      className={rowClasses}
      {...props}
    >
      {content}
    </div>
  );
}
