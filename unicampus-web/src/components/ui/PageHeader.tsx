import React from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { cn } from "./cn";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  backHref?: string;
  backLabel?: string;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  backHref,
  backLabel = "Back",
  breadcrumbs,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn("space-y-2.5", className)}>
      {(backHref || (breadcrumbs && breadcrumbs.length > 0)) && (
        <div className="flex flex-wrap items-center gap-3">
          {backHref && (
            <Link
              href={backHref}
              className="inline-flex items-center gap-1.5 min-h-[44px] pr-2 text-sm font-medium text-fg-muted hover:text-fg transition-colors duration-150"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{backLabel}</span>
            </Link>
          )}

          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1.5 text-xs text-fg-muted">
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return (
                  <React.Fragment key={`${crumb.label}-${index}`}>
                    {index > 0 && (
                      <ChevronRight className="w-3.5 h-3.5 text-fg-subtle shrink-0" aria-hidden="true" />
                    )}
                    {crumb.href && !isLast ? (
                      <Link
                        href={crumb.href}
                        className="hover:text-fg transition-colors duration-150 py-1"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className={cn(isLast && "text-fg font-medium")}>
                        {crumb.label}
                      </span>
                    )}
                  </React.Fragment>
                );
              })}
            </nav>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-[28px] leading-[1.25] font-semibold tracking-tight text-fg">
            {title}
          </h1>
          {description && (
            <p className="mt-1.5 text-sm text-fg-muted max-w-2xl">
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}
