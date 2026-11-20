"use client";

import React from "react";
import { cn } from "./cn";
import { Skeleton } from "./Skeleton";
import { EmptyState } from "./EmptyState";

export interface DataTableColumn<T> {
  key: string;
  header: React.ReactNode;
  align?: "left" | "center" | "right";
  numeric?: boolean;
  width?: string;
  className?: string;
  headerClassName?: string;
  render?: (row: T, index: number) => React.ReactNode;
  accessor?: (row: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string;
  stickyHeader?: boolean;
  onRowClick?: (row: T) => void;
  rowActions?: (row: T) => React.ReactNode;
  emptyState?: React.ReactNode;
  loading?: boolean;
  skeletonRows?: number;
  className?: string;
}

const alignClasses: Record<"left" | "center" | "right", string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  stickyHeader = false,
  onRowClick,
  rowActions,
  emptyState,
  loading = false,
  skeletonRows = 5,
  className,
}: DataTableProps<T>) {
  const totalCols = columns.length + (rowActions ? 1 : 0);
  const hasHeightConstraint = /(?:^|\s)(?:max-)?h-\S+/.test(className ?? "");
  const overflowClass = stickyHeader
    ? hasHeightConstraint
      ? "overflow-auto"
      : "overflow-x-auto md:overflow-x-clip"
    : "overflow-x-auto";

  if (!loading && data.length === 0) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-line bg-surface overflow-hidden",
          className
        )}
      >
        {emptyState ?? (
          <EmptyState
            title="No records found"
            description="There are no items to display right now."
          />
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        overflowClass,
        "rounded-2xl border border-line bg-surface",
        className
      )}
    >
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-surface-2 text-fg-muted text-xs font-medium border-b border-line">
          <tr>
            {columns.map((col) => {
              const align = col.align ?? (col.numeric ? "right" : "left");
              return (
                <th
                  key={col.key}
                  scope="col"
                  style={col.width ? { width: col.width } : undefined}
                  className={cn(
                    "px-4 py-3 font-medium whitespace-nowrap",
                    alignClasses[align],
                    stickyHeader && "sticky top-0 z-10 bg-surface-2",
                    col.headerClassName
                  )}
                >
                  {col.header}
                </th>
              );
            })}
            {rowActions && (
              <th
                scope="col"
                className={cn(
                  "px-4 py-3 text-right font-medium whitespace-nowrap w-1",
                  stickyHeader && "sticky top-0 z-10 bg-surface-2"
                )}
              >
                <span className="sr-only">Actions</span>
              </th>
            )}
          </tr>
        </thead>

        <tbody>
          {loading
            ? Array.from({ length: skeletonRows }).map((_, rowIndex) => (
                <tr
                  key={`skeleton-${rowIndex}`}
                  className="h-[52px] border-b border-line last:border-b-0"
                >
                  {Array.from({ length: totalCols }).map((__, colIndex) => (
                    <td key={`skeleton-${rowIndex}-${colIndex}`} className="px-4 py-3">
                      <Skeleton variant="text" className="h-4 w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            : data.map((row, index) => (
                <tr
                  key={keyExtractor(row, index)}
                  tabIndex={onRowClick ? 0 : undefined}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  onKeyDown={
                    onRowClick
                      ? (e) => {
                          if (e.key !== "Enter" && e.key !== " ") return;
                          const target = e.target as HTMLElement | null;
                          if (
                            target &&
                            target !== e.currentTarget &&
                            target.closest(
                              'button, a, input, select, textarea, [role="button"], [role="link"]'
                            )
                          ) {
                            return;
                          }
                          e.preventDefault();
                          onRowClick(row);
                        }
                      : undefined
                  }
                  className={cn(
                    "group h-[52px] border-b border-line last:border-b-0 transition-colors duration-150 hover:bg-surface-2/60",
                    onRowClick &&
                      "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand"
                  )}
                >
                  {columns.map((col) => {
                    const align = col.align ?? (col.numeric ? "right" : "left");
                    const cellContent = col.render
                      ? col.render(row, index)
                      : col.accessor
                      ? col.accessor(row)
                      : null;

                    return (
                      <td
                        key={col.key}
                        className={cn(
                          "px-4 py-2.5 text-fg align-middle",
                          alignClasses[align],
                          col.numeric && "tabular-nums",
                          col.className
                        )}
                      >
                        {cellContent}
                      </td>
                    );
                  })}

                  {rowActions && (
                    <td
                      className="px-4 py-2.5 text-right align-middle whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="inline-flex items-center justify-end gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150">
                        {rowActions(row)}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}
