"use client";

import { Search, FilterX, X } from "lucide-react";
import { Select, Tabs } from "@/components/ui";
import type { Department } from "@/types/admin";
import type { RoleTab } from "./usersData";

interface RoleTabOption {
  id: RoleTab;
  label: string;
  count: string;
}

interface UsersFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedDept: string;
  onDeptChange: (dept: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  activeTab: RoleTab;
  onTabChange: (tab: RoleTab) => void;
  roleTabs: RoleTabOption[];
  departments?: Department[];
  onClearFilters: () => void;
  isDeptAdmin?: boolean;
}

export function UsersFilterBar({
  searchQuery,
  onSearchChange,
  selectedDept,
  onDeptChange,
  selectedStatus,
  onStatusChange,
  activeTab,
  onTabChange,
  roleTabs,
  departments = [],
  onClearFilters,
  isDeptAdmin = false,
}: UsersFilterBarProps) {
  return (
    <div className="bg-surface rounded-2xl p-3.5 border border-line flex flex-col lg:flex-row lg:items-center justify-between gap-3">
      {/* Left: Role Filter Tabs */}
      <div className="w-full lg:w-auto overflow-x-auto max-w-full shrink-0">
        <Tabs
          tabs={roleTabs}
          value={activeTab}
          onChange={onTabChange}
          layoutId="admin-users-role-pill"
          size="sm"
          ariaLabel="Filter users by role"
        />
      </div>

      {/* Right: Search + Live Department + Status + Reset */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 flex-1 lg:justify-end min-w-0">
        <div className="relative flex-1 sm:max-w-xs min-w-0">
          <Search className="w-4 h-4 text-fg-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            aria-label="Search users by name, email, or ID"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search name, email, or ID..."
            className="w-full h-10 bg-surface-2 border border-line rounded-xl pl-9 pr-8 text-xs text-fg placeholder:text-fg-subtle focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
              className="w-8 h-8 inline-flex items-center justify-center absolute right-1 top-1/2 -translate-y-1/2 text-fg-muted hover:text-fg cursor-pointer rounded-lg"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Select
            value={selectedDept}
            onChange={onDeptChange}
            disabled={isDeptAdmin}
            ariaLabel="Filter by department"
            className="min-w-[155px]"
            options={[
              ...(!isDeptAdmin ? [{ value: "all", label: "All Departments" }] : []),
              ...departments.map((d) => ({
                value: d.code.toLowerCase(),
                label: `${d.name} (${d.code})`,
              })),
              ...(!isDeptAdmin ? [{ value: "it", label: "Central Administration" }] : []),
            ]}
          />

          <Select
            value={selectedStatus}
            onChange={onStatusChange}
            ariaLabel="Filter by status"
            className="min-w-[140px]"
            menuAlign="right"
            options={[
              { value: "all", label: "All Statuses" },
              { value: "active", label: "Active" },
              { value: "pending", label: "Pending" },
              { value: "rejected", label: "Rejected" },
              { value: "suspended", label: "Suspended" },
            ]}
          />

          <button
            type="button"
            onClick={onClearFilters}
            className="w-10 h-10 inline-flex items-center justify-center rounded-xl bg-surface-2 border border-line text-fg-muted hover:text-fg transition-colors cursor-pointer shrink-0"
            title="Reset Filters"
            aria-label="Reset filters"
          >
            <FilterX className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
