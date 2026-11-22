"use client";

import { Search, FilterX, ChevronDown, X } from "lucide-react";
import { Tabs } from "@/components/ui";
import { CANONICAL_DEPARTMENTS } from "@/lib/canonicalCampus";
import { DEPT_META, type DeptKey, type RoleTab } from "./usersData";

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
  onClearFilters,
  isDeptAdmin = false,
}: UsersFilterBarProps) {
  return (
    <div className="bg-surface rounded-2xl p-4 border border-line flex flex-col gap-3">
      {/* Row 1: Search + Department + Status + Reset */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-fg-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            aria-label="Search users by name, email, or ID"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, email, or ID..."
            className="w-full min-h-[44px] bg-surface-2 border border-line focus:border-brand rounded-xl pl-10 pr-9 py-2 text-xs text-fg placeholder:text-fg-muted focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all duration-150"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
              className="min-w-[36px] min-h-[36px] inline-flex items-center justify-center absolute right-1.5 top-1/2 -translate-y-1/2 text-fg-muted hover:text-fg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-lg"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
          <div className="relative flex-1 sm:flex-none">
            <select
              value={selectedDept}
              onChange={(e) => onDeptChange(e.target.value)}
              disabled={isDeptAdmin}
              aria-label="Filter by department"
              className="w-full min-h-[44px] appearance-none bg-surface-2 border border-line text-fg rounded-xl pl-3.5 pr-8 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus:border-brand cursor-pointer transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {!isDeptAdmin && <option value="all">All Departments</option>}
              {CANONICAL_DEPARTMENTS.map((d) => (
                <option key={d.id} value={d.code.toLowerCase()}>
                  {DEPT_META[d.code.toLowerCase() as DeptKey].shortLabel}
                </option>
              ))}
              {!isDeptAdmin && <option value="it">Central Administration</option>}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-fg-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative flex-1 sm:flex-none">
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              aria-label="Filter by status"
              className="w-full min-h-[44px] appearance-none bg-surface-2 border border-line text-fg rounded-xl pl-3.5 pr-8 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus:border-brand cursor-pointer transition-colors"
            >
              <option value="all">Status: All Accounts</option>
              <option value="active">Active Only</option>
              <option value="pending">Pending Verification</option>
              <option value="rejected">Rejected (Needs Re-apply)</option>
              <option value="suspended">Suspended</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-fg-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            type="button"
            onClick={onClearFilters}
            className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-xl bg-surface-2 border border-line text-fg-muted hover:text-fg transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            title="Reset Filters to Default"
            aria-label="Reset filters"
          >
            <FilterX className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Row 2: Role Filter Tabs */}
      <div className="w-full overflow-x-auto max-w-full">
        <Tabs
          tabs={roleTabs}
          value={activeTab}
          onChange={onTabChange}
          layoutId="admin-users-role-pill"
          size="sm"
          ariaLabel="Filter users by role"
        />
      </div>
    </div>
  );
}
