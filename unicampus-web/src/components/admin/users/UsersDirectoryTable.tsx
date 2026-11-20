"use client";

import React from "react";
import {
  Shield,
  GraduationCap,
  User,
  MoreVertical,
  CheckCircle2,
  KeyRound,
  Eye,
  Ban,
  AlertCircle,
} from "lucide-react";
import { Badge, Button } from "@/components/ui";
import type { UserRecord } from "./usersData";

interface UserRowProps {
  user: UserRecord;
  isPopoverOpen: boolean;
  openUpward?: boolean;
  popoverRef: React.RefObject<HTMLDivElement | null>;
  onTogglePopover: (userId: string) => void;
  onEditRole: (user: UserRecord) => void;
  onResetPassword: (user: UserRecord) => void;
  onImpersonate: (user: UserRecord) => void;
  onSuspendToggle: (user: UserRecord) => void;
}

const UserTableRow = React.memo(function UserTableRow({
  user,
  isPopoverOpen,
  openUpward = false,
  popoverRef,
  onTogglePopover,
  onEditRole,
  onResetPassword,
  onImpersonate,
  onSuspendToggle,
}: UserRowProps) {
  return (
    <tr
      className={`transition-colors h-14 ${
        isPopoverOpen ? "bg-surface-2 relative z-30" : "hover:bg-surface-2/60"
      }`}
    >
      {/* 1. Name & Email */}
      <td className="py-2.5 px-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-brand-soft border border-brand/25 flex items-center justify-center shrink-0 font-sans text-xs font-semibold text-brand">
            {user.initials}
          </div>
          <div className="min-w-0 max-w-[210px]">
            <div className="font-semibold text-fg flex items-center gap-1.5 truncate">
              <span className="truncate">{user.name}</span>
              {user.verified && (
                <span
                  title="Verified Superadmin Privileges"
                  className="inline-flex text-brand shrink-0"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </span>
              )}
            </div>
            <div className="text-xs text-fg-muted font-normal truncate">
              {user.email}
            </div>
          </div>
        </div>
      </td>

      {/* 2. Role Badge */}
      <td className="py-2.5 px-3 whitespace-nowrap">
        {user.role === "admin" && (
          <Badge variant="brand">
            <Shield className="w-3 h-3" />
            <span>Admin</span>
          </Badge>
        )}
        {user.role === "teacher" && (
          <Badge variant="brand">
            <GraduationCap className="w-3 h-3" />
            <span>Teacher</span>
          </Badge>
        )}
        {user.role === "student" && (
          <Badge variant="neutral">
            <User className="w-3 h-3" />
            <span>Student</span>
          </Badge>
        )}
      </td>

      {/* 3. User ID / Student ID */}
      <td className="py-2.5 px-3 whitespace-nowrap">
        <span className="font-mono text-xs text-fg bg-surface-2 px-2 py-1 rounded border border-line tabular-nums">
          {user.id}
        </span>
      </td>

      {/* 4. Department */}
      <td className="py-2.5 px-3 text-fg-muted font-medium max-w-[180px] truncate">
        {user.department}
      </td>

      {/* 5. Last Login */}
      <td className="py-2.5 px-3 whitespace-nowrap hidden xl:table-cell">
        <span
          className={`font-sans text-xs ${
            user.isOnlineNow ? "text-success font-medium" : "text-fg-muted"
          }`}
        >
          {user.lastLogin}
        </span>
      </td>

      {/* 6. Account Status */}
      <td className="py-2.5 px-3 whitespace-nowrap">
        {user.status === "active" && <Badge variant="success">Active</Badge>}
        {user.status === "pending" && (
          <Badge variant="warning">Pending Verification</Badge>
        )}
        {user.status === "suspended" && (
          <Badge variant="danger">Suspended</Badge>
        )}
      </td>

      {/* 7. Actions */}
      <td className="py-2.5 px-4 text-right whitespace-nowrap relative">
        <button
          type="button"
          data-action-trigger="true"
          onClick={() => onTogglePopover(user.id)}
          aria-label={`Manage ${user.name}`}
          className={`min-w-[40px] min-h-[40px] inline-flex items-center justify-center rounded-xl transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
            isPopoverOpen
              ? "bg-surface-2 text-brand border border-brand/40"
              : "text-fg-muted hover:text-fg hover:bg-surface-2"
          }`}
          title="Manage User Account"
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {isPopoverOpen && (
          <div
            ref={popoverRef}
            className={`absolute right-4 ${
              openUpward ? "bottom-12" : "top-12"
            } w-52 bg-surface border border-line rounded-xl shadow-lg p-1.5 z-50 text-left`}
          >
            <div className="px-2.5 py-1.5 text-xs font-sans text-fg-muted border-b border-line mb-1 flex items-center justify-between gap-2">
              <span>User Actions</span>
              <span className="font-mono text-xs text-brand truncate">
                {user.id}
              </span>
            </div>

            <button
              type="button"
              onClick={() => onEditRole(user)}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-fg hover:bg-surface-2 hover:text-brand text-xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <Shield className="w-3.5 h-3.5 text-fg-muted shrink-0" />
              <span className="font-medium">Edit Role &amp; Permissions</span>
            </button>

            <button
              type="button"
              onClick={() => onResetPassword(user)}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-fg hover:bg-surface-2 text-xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <KeyRound className="w-3.5 h-3.5 text-fg-muted shrink-0" />
              <span className="font-medium">Reset Password</span>
            </button>

            <button
              type="button"
              onClick={() => onImpersonate(user)}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-fg hover:bg-surface-2 text-xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <Eye className="w-3.5 h-3.5 text-fg-muted shrink-0" />
              <span className="font-medium">Preview Role View</span>
            </button>

            <div className="my-1 border-t border-line" />

            <button
              type="button"
              onClick={() => onSuspendToggle(user)}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-danger hover:bg-danger-light text-xs transition-colors font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <Ban className="w-3.5 h-3.5 text-danger shrink-0" />
              <span>
                {user.status === "suspended"
                  ? "Reactivate Account"
                  : "Suspend Account"}
              </span>
            </button>
          </div>
        )}
      </td>
    </tr>
  );
});

const UserMobileCard = React.memo(function UserMobileCard({
  user,
  isPopoverOpen,
  popoverRef,
  onTogglePopover,
  onEditRole,
  onResetPassword,
  onSuspendToggle,
}: Omit<UserRowProps, "openUpward" | "onImpersonate">) {
  return (
    <div className="p-4 space-y-3 relative">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-brand-soft border border-brand/25 flex items-center justify-center shrink-0 font-sans text-xs font-semibold text-brand">
            {user.initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-fg truncate">{user.name}</p>
            <p className="text-xs text-fg-muted truncate">{user.email}</p>
          </div>
        </div>

        <button
          type="button"
          data-action-trigger="true"
          onClick={() => onTogglePopover(user.id)}
          aria-label={`Manage ${user.name}`}
          className="min-w-[44px] min-h-[44px] -mr-2 -mt-1 inline-flex items-center justify-center rounded-xl text-fg-muted hover:text-fg hover:bg-surface-2 cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="font-mono text-fg bg-surface-2 px-2 py-0.5 rounded border border-line tabular-nums">
          {user.id}
        </span>
        <Badge variant={user.role === "student" ? "neutral" : "brand"}>
          {user.roleLabel}
        </Badge>
        {user.status === "active" && <Badge variant="success">Active</Badge>}
        {user.status === "pending" && (
          <Badge variant="warning">Pending Verification</Badge>
        )}
        {user.status === "suspended" && (
          <Badge variant="danger">Suspended</Badge>
        )}
      </div>

      <div className="text-xs text-fg-muted flex items-center justify-between gap-2">
        <span className="truncate">{user.department}</span>
        <span className="font-sans shrink-0">{user.lastLogin}</span>
      </div>

      {isPopoverOpen && (
        <div
          ref={popoverRef}
          className="mt-2 p-1.5 rounded-xl bg-surface-2 border border-line grid grid-cols-1 gap-1"
        >
          <button
            type="button"
            onClick={() => onEditRole(user)}
            className="w-full min-h-[44px] flex items-center gap-2.5 px-3 py-2 rounded-lg text-fg hover:bg-surface text-xs font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <Shield className="w-3.5 h-3.5 text-fg-muted shrink-0" />
            <span>Edit Role &amp; Permissions</span>
          </button>
          <button
            type="button"
            onClick={() => onResetPassword(user)}
            className="w-full min-h-[44px] flex items-center gap-2.5 px-3 py-2 rounded-lg text-fg hover:bg-surface text-xs font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <KeyRound className="w-3.5 h-3.5 text-fg-muted shrink-0" />
            <span>Reset Password</span>
          </button>
          <button
            type="button"
            onClick={() => onSuspendToggle(user)}
            className="w-full min-h-[44px] flex items-center gap-2.5 px-3 py-2 rounded-lg text-danger hover:bg-danger-light text-xs font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <Ban className="w-3.5 h-3.5 text-danger shrink-0" />
            <span>
              {user.status === "suspended"
                ? "Reactivate Account"
                : "Suspend Account"}
            </span>
          </button>
        </div>
      )}
    </div>
  );
});

interface UsersDirectoryTableProps {
  paginatedUsers: UserRecord[];
  totalFilteredCount: number;
  startIdx: number;
  pageSize: number;
  safePage: number;
  totalPages: number;
  openPopoverId: string | null;
  popoverRef: React.RefObject<HTMLDivElement | null>;
  onPageChange: (page: number) => void;
  onClearFilters: () => void;
  onTogglePopover: (userId: string) => void;
  onEditRole: (user: UserRecord) => void;
  onResetPassword: (user: UserRecord) => void;
  onImpersonate: (user: UserRecord) => void;
  onSuspendToggle: (user: UserRecord) => void;
}

export function UsersDirectoryTable({
  paginatedUsers,
  totalFilteredCount,
  startIdx,
  pageSize,
  safePage,
  totalPages,
  openPopoverId,
  popoverRef,
  onPageChange,
  onClearFilters,
  onTogglePopover,
  onEditRole,
  onResetPassword,
  onImpersonate,
  onSuspendToggle,
}: UsersDirectoryTableProps) {
  return (
    <div className="bg-surface rounded-2xl border border-line relative overflow-visible">
      {/* DESKTOP TABLE */}
      <div className="hidden md:block w-full overflow-x-auto lg:overflow-visible">
        <table className="w-full text-left border-collapse table-auto">
          <thead>
            <tr className="bg-surface-2 border-b border-line text-xs font-sans text-fg-muted">
              <th className="py-3 px-4 font-semibold">User</th>
              <th className="py-3 px-3 font-semibold">Role</th>
              <th className="py-3 px-3 font-semibold whitespace-nowrap">ID</th>
              <th className="py-3 px-3 font-semibold">Department</th>
              <th className="py-3 px-3 font-semibold hidden xl:table-cell whitespace-nowrap">
                Last Login
              </th>
              <th className="py-3 px-3 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold text-right w-16">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-line text-xs font-sans">
            {paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center text-fg-muted">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertCircle className="w-8 h-8 text-fg-muted/50" />
                    <p className="text-sm font-semibold text-fg">
                      No user accounts matched your filters
                    </p>
                    <p className="text-xs text-fg-muted">
                      Try clearing the search query or adjusting role and department selections.
                    </p>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={onClearFilters}
                    >
                      Clear All Filters
                    </Button>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user, index) => (
                <UserTableRow
                  key={user.id}
                  user={user}
                  isPopoverOpen={openPopoverId === user.id}
                  openUpward={
                    index >= paginatedUsers.length - 2 &&
                    paginatedUsers.length > 2
                  }
                  popoverRef={popoverRef}
                  onTogglePopover={onTogglePopover}
                  onEditRole={onEditRole}
                  onResetPassword={onResetPassword}
                  onImpersonate={onImpersonate}
                  onSuspendToggle={onSuspendToggle}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden divide-y divide-line">
        {paginatedUsers.length === 0 ? (
          <div className="py-12 px-4 text-center text-fg-muted space-y-2">
            <AlertCircle className="w-8 h-8 text-fg-muted/50 mx-auto" />
            <p className="text-sm font-semibold text-fg">
              No user accounts matched your filters
            </p>
            <p className="text-xs text-fg-muted">
              Try clearing the search query or adjusting filters.
            </p>
            <Button variant="secondary" size="sm" onClick={onClearFilters}>
              Clear All Filters
            </Button>
          </div>
        ) : (
          paginatedUsers.map((user) => (
            <UserMobileCard
              key={user.id}
              user={user}
              isPopoverOpen={openPopoverId === user.id}
              popoverRef={popoverRef}
              onTogglePopover={onTogglePopover}
              onEditRole={onEditRole}
              onResetPassword={onResetPassword}
              onSuspendToggle={onSuspendToggle}
            />
          ))
        )}
      </div>

      {/* LIVE PAGINATION FOOTER */}
      <div className="px-4 sm:px-6 py-3 bg-surface-2 border-t border-line rounded-b-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="text-fg-muted font-sans tabular-nums">
          Showing{" "}
          <span className="text-fg font-semibold tabular-nums">
            {totalFilteredCount === 0 ? 0 : startIdx + 1}–
            {Math.min(startIdx + pageSize, totalFilteredCount)}
          </span>{" "}
          of{" "}
          <span className="text-fg font-semibold tabular-nums">
            {totalFilteredCount}
          </span>{" "}
          accounts
        </div>

        <div className="flex items-center gap-1.5 font-sans tabular-nums flex-wrap justify-center">
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => onPageChange(Math.max(1, safePage - 1))}
            className="min-h-[36px] px-2.5 py-1.5 rounded-lg bg-surface border border-line text-fg-muted hover:text-fg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            &lt; Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`min-w-[36px] min-h-[36px] rounded-lg text-xs font-semibold flex items-center justify-center cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                page === safePage
                  ? "bg-brand text-on-brand"
                  : "bg-surface border border-line text-fg-muted hover:text-fg"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => onPageChange(Math.min(totalPages, safePage + 1))}
            className="min-h-[36px] px-2.5 py-1.5 rounded-lg bg-surface border border-line text-fg-muted hover:text-fg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            Next &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
