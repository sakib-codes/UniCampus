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
  CreditCard,
  Check,
  X,
  FileSearch,
  Trash2,
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
  onToggleHold?: (user: UserRecord, holdType: "academic" | "financial") => void;
  onApprove?: (user: UserRecord) => void;
  onReject?: (user: UserRecord) => void;
  onReview?: (user: UserRecord) => void;
  onDelete?: (user: UserRecord) => void;
  currentUserEmail?: string;
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
  onToggleHold,
  onApprove,
  onReject,
  onReview,
  onDelete,
  currentUserEmail,
}: UserRowProps) {
  return (
    <tr
      className={`transition-colors ${
        isPopoverOpen ? "bg-surface-2 relative z-30" : "hover:bg-surface-2/60"
      }`}
    >
      {/* 1. Name & Email */}
      <td className="py-[var(--row-py)] px-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-brand-soft border border-brand/25 flex items-center justify-center shrink-0 font-sans text-xs font-semibold text-brand">
            {user.initials}
          </div>
          <div className="min-w-0 max-w-[210px]">
            <div className="font-semibold text-fg flex items-center gap-1.5 truncate">
              <span className="truncate">{user.name}</span>
              {user.verified && (
                <span
                  title="Verified Admin Privileges"
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
      <td className="py-[var(--row-py)] px-3 whitespace-nowrap">
        {user.role === "admin" && (
          <Badge variant="brand">
            <Shield className="w-3 h-3" />
            <span>{user.roleLabel}</span>
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
      <td className="py-[var(--row-py)] px-3 whitespace-nowrap">
        <span className="font-mono text-xs text-fg bg-surface-2 px-2 py-1 rounded border border-line tabular-nums">
          {user.id}
        </span>
      </td>

      {/* 4. Department */}
      <td className="py-[var(--row-py)] px-3 text-fg-muted font-medium max-w-[180px] truncate">
        {user.department}
      </td>

      {/* 5. Last Login */}
      <td className="py-[var(--row-py)] px-3 whitespace-nowrap hidden xl:table-cell">
        <span
          className={`font-sans text-xs ${
            user.isOnlineNow ? "text-success font-medium" : "text-fg-muted"
          }`}
        >
          {user.lastLogin}
        </span>
      </td>

      {/* 6. Account Status */}
      <td className="py-[var(--row-py)] px-3 whitespace-nowrap">
        <div className="flex flex-wrap gap-1 items-center">
          {user.status === "active" && <Badge variant="success">Active</Badge>}
          {user.status === "pending" && (
            <Badge variant="warning">Pending Verification</Badge>
          )}
          {user.status === "rejected" && (
            <span title={user.rejectionReason || "Rejected — awaiting re-application"}>
              <Badge variant="danger">Rejected</Badge>
            </span>
          )}
          {user.status === "suspended" && (
            <Badge variant="danger">Suspended</Badge>
          )}
          {user.academic_hold && (
            <Badge variant="danger">Academic Hold</Badge>
          )}
          {user.financial_hold && (
            <Badge variant="danger">Financial Hold</Badge>
          )}
        </div>
      </td>

      {/* 7. Actions */}
      <td className="py-[var(--row-py)] px-4 text-right whitespace-nowrap relative">
        <div className="inline-flex items-center justify-end gap-1.5">
          {(user.status === "pending" || user.status === "rejected") && (
            <div className="inline-flex items-center gap-1 mr-1">
              <button
                type="button"
                onClick={() => onReview?.(user)}
                title="Review Registration Dossier"
                className="px-2 py-1 rounded-lg bg-brand-soft hover:bg-brand/20 text-brand border border-brand/25 text-xs font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <FileSearch className="w-3 h-3" />
                <span>Review</span>
              </button>
              <button
                type="button"
                onClick={() => onApprove?.(user)}
                title="Approve User"
                className="px-2 py-1 rounded-lg bg-success hover:bg-success/90 text-on-brand text-xs font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <Check className="w-3 h-3" />
                <span>Approve</span>
              </button>
              {user.status === "pending" && (
                <button
                  type="button"
                  onClick={() => onReject?.(user)}
                  title="Reject with Reason"
                  className="px-2 py-1 rounded-lg bg-danger hover:bg-danger/90 text-on-brand text-xs font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <X className="w-3 h-3" />
                  <span>Reject</span>
                </button>
              )}
            </div>
          )}

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
        </div>

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

            {user.status === "pending" && (
              <>
                <button
                  type="button"
                  onClick={() => onApprove?.(user)}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-success hover:bg-success-light text-xs font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                  <span>Approve Registration</span>
                </button>
                <button
                  type="button"
                  onClick={() => onReject?.(user)}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-danger hover:bg-danger-light text-xs font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <Ban className="w-3.5 h-3.5 text-danger shrink-0" />
                  <span>Reject Registration</span>
                </button>
                <div className="my-1 border-t border-line" />
              </>
            )}

            <button
              type="button"
              onClick={() => onReview?.(user)}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-fg hover:bg-surface-2 hover:text-brand text-xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <FileSearch className="w-3.5 h-3.5 text-brand shrink-0" />
              <span className="font-medium">Review Registration Dossier</span>
            </button>

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

            {user.role === "student" && (
              <>
                <div className="my-1 border-t border-line" />
                <button
                  type="button"
                  onClick={() => onToggleHold?.(user, "academic")}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-fg hover:bg-surface-2 text-xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-warning shrink-0" />
                  <span className="font-medium">
                    {user.academic_hold ? "Lift Academic Hold" : "Place Academic Hold"}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => onToggleHold?.(user, "financial")}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-fg hover:bg-surface-2 text-xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <CreditCard className="w-3.5 h-3.5 text-warning shrink-0" />
                  <span className="font-medium">
                    {user.financial_hold ? "Lift Financial Hold" : "Place Financial Hold"}
                  </span>
                </button>
              </>
            )}

            <div className="my-1 border-t border-line" />

            <button
              type="button"
              onClick={() => onSuspendToggle(user)}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-warning hover:bg-warning-light text-xs transition-colors font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <Ban className="w-3.5 h-3.5 text-warning shrink-0" />
              <span>
                {user.status === "suspended"
                  ? "Unsuspend Account"
                  : "Suspend Account"}
              </span>
            </button>

            {onDelete && user.email.toLowerCase() !== (currentUserEmail || "").toLowerCase() && (
              <button
                type="button"
                onClick={() => onDelete(user)}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-danger hover:bg-danger-light text-xs transition-colors font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <Trash2 className="w-3.5 h-3.5 text-danger shrink-0" />
                <span>Delete Account</span>
              </button>
            )}
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
  onToggleHold,
  onApprove,
  onReject,
  onReview,
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
        {user.status === "rejected" && (
          <Badge variant="danger">Rejected</Badge>
        )}
        {user.status === "suspended" && (
          <Badge variant="danger">Suspended</Badge>
        )}
        {user.academic_hold && (
          <Badge variant="danger">Academic Hold</Badge>
        )}
        {user.financial_hold && (
          <Badge variant="danger">Financial Hold</Badge>
        )}
      </div>

      {(user.status === "pending" || user.status === "rejected") && (
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => onReview?.(user)}
            className="flex-1 min-h-[36px] rounded-lg bg-brand-soft hover:bg-brand/20 text-brand border border-brand/25 text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
          >
            <FileSearch className="w-3.5 h-3.5" />
            <span>Review</span>
          </button>
          <button
            type="button"
            onClick={() => onApprove?.(user)}
            className="flex-1 min-h-[36px] rounded-lg bg-success hover:bg-success/90 text-on-brand text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Approve</span>
          </button>
          {user.status === "pending" && (
            <button
              type="button"
              onClick={() => onReject?.(user)}
              className="flex-1 min-h-[36px] rounded-lg bg-danger hover:bg-danger/90 text-on-brand text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reject</span>
            </button>
          )}
        </div>
      )}

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

          {user.role === "student" && (
            <>
              <button
                type="button"
                onClick={() => onToggleHold?.(user, "academic")}
                className="w-full min-h-[44px] flex items-center gap-2.5 px-3 py-2 rounded-lg text-fg hover:bg-surface text-xs font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <AlertCircle className="w-3.5 h-3.5 text-warning shrink-0" />
                <span>
                  {user.academic_hold ? "Lift Academic Hold" : "Place Academic Hold"}
                </span>
              </button>
              <button
                type="button"
                onClick={() => onToggleHold?.(user, "financial")}
                className="w-full min-h-[44px] flex items-center gap-2.5 px-3 py-2 rounded-lg text-fg hover:bg-surface text-xs font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <CreditCard className="w-3.5 h-3.5 text-warning shrink-0" />
                <span>
                  {user.financial_hold ? "Lift Financial Hold" : "Place Financial Hold"}
                </span>
              </button>
            </>
          )}

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
  onToggleHold?: (user: UserRecord, holdType: "academic" | "financial") => void;
  onApprove?: (user: UserRecord) => void;
  onReject?: (user: UserRecord) => void;
  onReview?: (user: UserRecord) => void;
  onDelete?: (user: UserRecord) => void;
  currentUserEmail?: string;
  statusSummary?: string;
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
  onToggleHold,
  onApprove,
  onReject,
  onReview,
  onDelete,
  currentUserEmail,
  statusSummary,
}: UsersDirectoryTableProps) {
  return (
    <div className="bg-surface rounded-2xl border border-line relative overflow-visible">
      {/* DESKTOP TABLE */}
      <div className="hidden md:block w-full overflow-x-auto lg:overflow-visible">
        <table className="w-full text-left border-collapse table-auto">
          <thead>
            <tr className="bg-surface-2 border-b border-line text-xs font-sans text-fg-muted">
              <th className="py-[var(--row-py)] px-4 font-semibold">User</th>
              <th className="py-[var(--row-py)] px-3 font-semibold">Role</th>
              <th className="py-[var(--row-py)] px-3 font-semibold whitespace-nowrap">ID</th>
              <th className="py-[var(--row-py)] px-3 font-semibold">Department</th>
              <th className="py-[var(--row-py)] px-3 font-semibold hidden xl:table-cell whitespace-nowrap">
                Last Login
              </th>
              <th className="py-[var(--row-py)] px-3 font-semibold">Status</th>
              <th className="py-[var(--row-py)] px-4 font-semibold text-right w-16">Actions</th>
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
                  onToggleHold={onToggleHold}
                  onApprove={onApprove}
                  onReject={onReject}
                  onReview={onReview}
                  onDelete={onDelete}
                  currentUserEmail={currentUserEmail}
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
              onToggleHold={onToggleHold}
              onApprove={onApprove}
              onReject={onReject}
              onReview={onReview}
            />
          ))
        )}
      </div>

      {/* LIVE TABLE FOOTER */}
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
          {totalFilteredCount === 1 ? "account" : "accounts"}
          {statusSummary ? <span className="ml-2 text-fg-subtle">• {statusSummary}</span> : null}
        </div>

        {totalPages > 1 ? (
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
        ) : (
          <span className="text-[11px] text-fg-muted">Synced live with Supabase</span>
        )}
      </div>
    </div>
  );
}
