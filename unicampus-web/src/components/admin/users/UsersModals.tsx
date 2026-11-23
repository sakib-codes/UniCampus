"use client";

import { Select } from "@/components/ui/Select";

import React from "react";
import { UserPlus, Upload, Shield, X, FileSpreadsheet, Download } from "lucide-react";
import { Button } from "@/components/ui";
import { CANONICAL_DEPARTMENTS } from "@/lib/canonicalCampus";
import { adminService } from "@/lib/services/adminService";
import { DEPT_META, type DeptKey, type UserRecord } from "./usersData";

interface UsersModalsProps {
  isInviteModalOpen: boolean;
  onCloseInviteModal: () => void;
  inviteName: string;
  onInviteNameChange: (v: string) => void;
  inviteEmail: string;
  onInviteEmailChange: (v: string) => void;
  inviteRole: "student" | "teacher" | "admin";
  onInviteRoleChange: (v: "student" | "teacher" | "admin") => void;
  inviteDept: DeptKey;
  onInviteDeptChange: (v: DeptKey) => void;
  inviteId: string;
  onInviteIdChange: (v: string) => void;
  onCreateUser: (e: React.FormEvent) => void;

  isCsvModalOpen: boolean;
  onCloseCsvModal: () => void;
  onDownloadTemplate: () => void;
  onProcessCsvImport: () => void;

  editingUser: UserRecord | null;
  onCloseEditModal: () => void;
  editRole: "student" | "teacher" | "admin";
  onEditRoleChange: (v: "student" | "teacher" | "admin") => void;
  editDeptKey: DeptKey;
  onEditDeptKeyChange: (v: DeptKey) => void;
  editSemester?: string;
  onEditSemesterChange?: (v: string) => void;
  editTeacherCode?: string;
  onEditTeacherCodeChange?: (v: string) => void;
  onSaveRoleChanges: () => void;
  isDeptAdmin?: boolean;
}

export function UsersModals({
  isInviteModalOpen,
  onCloseInviteModal,
  inviteName,
  onInviteNameChange,
  inviteEmail,
  onInviteEmailChange,
  inviteRole,
  onInviteRoleChange,
  inviteDept,
  onInviteDeptChange,
  inviteId,
  onInviteIdChange,
  onCreateUser,
  isCsvModalOpen,
  onCloseCsvModal,
  onDownloadTemplate,
  onProcessCsvImport,
  editingUser,
  onCloseEditModal,
  editRole,
  onEditRoleChange,
  editDeptKey,
  onEditDeptKeyChange,
  editSemester = "1st Semester",
  onEditSemesterChange,
  editTeacherCode = "",
  onEditTeacherCodeChange,
  onSaveRoleChanges,
  isDeptAdmin = false,
}: UsersModalsProps) {
  return (
    <>
      {/* MODAL 1: Invite / Add New User */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-surface border border-line rounded-2xl w-full max-w-lg shadow-xl p-6 relative max-h-[90dvh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-line pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-soft border border-brand/20 text-brand flex items-center justify-center shrink-0">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-fg">
                    Invite &amp; Provision User
                  </h3>
                  <p className="text-xs text-fg-muted">
                    Create institutional identity credentials
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onCloseInviteModal}
                aria-label="Close modal"
                className="min-w-[40px] min-h-[40px] inline-flex items-center justify-center rounded-lg text-fg-muted hover:text-fg hover:bg-surface-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={onCreateUser} className="space-y-4">
              <div>
                <label
                  htmlFor="invite-user-name"
                  className="block text-xs font-semibold text-fg-muted mb-1.5"
                >
                  Full Legal Name
                </label>
                <input
                  id="invite-user-name"
                  type="text"
                  required
                  placeholder="e.g. Dr. Sabrina Noor or Tanvir Mahmud"
                  value={inviteName}
                  onChange={(e) => onInviteNameChange(e.target.value)}
                  className="w-full min-h-[44px] bg-surface-2 border border-line focus:border-brand rounded-xl px-3.5 py-2 text-xs text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                />
              </div>

              <div>
                <label
                  htmlFor="invite-user-email"
                  className="block text-xs font-semibold text-fg-muted mb-1.5"
                >
                  Institutional Email
                </label>
                <input
                  id="invite-user-email"
                  type="email"
                  required
                  placeholder="e.g. user@unicampus.edu"
                  value={inviteEmail}
                  onChange={(e) => onInviteEmailChange(e.target.value)}
                  className="w-full min-h-[44px] bg-surface-2 border border-line focus:border-brand rounded-xl px-3.5 py-2 text-xs text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="invite-user-role"
                    className="block text-xs font-semibold text-fg-muted mb-1.5"
                  >
                    Role Privilege
                  </label>
                  <Select
                    id="invite-user-role"
                    ariaLabel="Role Privilege"
                    value={inviteRole}
                    onChange={(val) =>
                      onInviteRoleChange(val as "student" | "teacher" | "admin")
                    }
                    options={[
                      { value: "student", label: "Student" },
                      { value: "teacher", label: "Teacher / Faculty" },
                      ...(!isDeptAdmin
                        ? [{ value: "admin", label: "Administrator" }]
                        : []),
                    ]}
                    size="md"
                    variant="surface2"
                  />
                </div>

                <div>
                  <label
                    htmlFor="invite-user-dept"
                    className="block text-xs font-semibold text-fg-muted mb-1.5"
                  >
                    Department
                  </label>
                  <Select
                    id="invite-user-dept"
                    ariaLabel="Department"
                    value={inviteDept}
                    disabled={isDeptAdmin}
                    onChange={(val) => onInviteDeptChange(val as DeptKey)}
                    options={[
                      ...CANONICAL_DEPARTMENTS.map((d) => {
                        const key = d.code.toLowerCase() as DeptKey;
                        return {
                          value: key,
                          label: DEPT_META[key].shortLabel,
                        };
                      }),
                      ...(!isDeptAdmin
                        ? [{ value: "it", label: "Central Administration" }]
                        : []),
                    ]}
                    size="md"
                    variant="surface2"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="invite-user-id"
                  className="block text-xs font-semibold text-fg-muted mb-1.5"
                >
                  Student ID / Faculty Code (Optional)
                </label>
                <input
                  id="invite-user-id"
                  type="text"
                  placeholder="e.g. 211-15-4499 or FAC-2090"
                  value={inviteId}
                  onChange={(e) => onInviteIdChange(e.target.value)}
                  className="w-full min-h-[44px] bg-surface-2 border border-line focus:border-brand rounded-xl px-3.5 py-2 text-xs font-sans text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-line">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onCloseInviteModal}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Send Invitation
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Bulk Import CSV */}
      {isCsvModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-surface border border-line rounded-2xl w-full max-w-lg shadow-xl p-6 relative max-h-[90dvh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-line pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-soft border border-brand/20 text-brand flex items-center justify-center shrink-0">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-fg">
                    Bulk Import User Accounts
                  </h3>
                  <p className="text-xs text-fg-muted">
                    Upload batch roster via CSV or XLSX file
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onCloseCsvModal}
                aria-label="Close modal"
                className="min-w-[40px] min-h-[40px] inline-flex items-center justify-center rounded-lg text-fg-muted hover:text-fg hover:bg-surface-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-line hover:border-brand rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-colors bg-surface-2/60">
                <div className="w-12 h-12 rounded-2xl bg-brand-soft text-brand flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-xs font-semibold text-fg">
                  Drag and drop roster CSV here, or{" "}
                  <span className="text-brand underline">browse</span>
                </p>
                <p className="text-xs text-fg-muted mt-1">
                  Supported formats: .CSV, .XLSX (Max file size: 25MB)
                </p>
              </div>

              <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-surface-2 border border-line text-xs">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-fg-muted shrink-0" />
                  <span className="text-fg-muted">
                    Need the correct header format?
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onDownloadTemplate}
                  className="flex items-center gap-1.5 text-brand hover:underline font-semibold cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded px-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Template</span>
                </button>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-line">
                <Button variant="secondary" size="sm" onClick={onCloseCsvModal}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={onProcessCsvImport}>
                  Process CSV Import
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Edit Role & Permissions */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-surface border border-line rounded-2xl w-full max-w-md shadow-xl p-6 relative max-h-[90dvh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-line pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-soft border border-brand/20 text-brand flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-fg">
                    Edit Role &amp; Permissions
                  </h3>
                  <p className="text-xs text-fg-muted font-sans">
                    <span className="font-mono">{editingUser.id}</span> •{" "}
                    {editingUser.name}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onCloseEditModal}
                aria-label="Close modal"
                className="min-w-[40px] min-h-[40px] inline-flex items-center justify-center rounded-lg text-fg-muted hover:text-fg hover:bg-surface-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="edit-user-role"
                  className="block text-xs font-semibold text-fg-muted mb-1.5"
                >
                  Assigned Role
                </label>
                <Select
                  id="edit-user-role"
                  ariaLabel="Assigned Role"
                  value={editRole}
                  onChange={(val) =>
                    onEditRoleChange(val as "student" | "teacher" | "admin")
                  }
                  options={[
                    { value: "student", label: "Student" },
                    { value: "teacher", label: "Teacher / Faculty" },
                    ...(!isDeptAdmin
                      ? [{ value: "admin", label: "Administrator" }]
                      : []),
                  ]}
                  size="md"
                  variant="surface2"
                />
              </div>

              <div>
                <label
                  htmlFor="edit-user-dept"
                  className="block text-xs font-semibold text-fg-muted mb-1.5"
                >
                  Academic Department
                </label>
                <Select
                  id="edit-user-dept"
                  ariaLabel="Academic Department"
                  value={editDeptKey}
                  disabled={isDeptAdmin}
                  onChange={(val) => onEditDeptKeyChange(val as DeptKey)}
                  options={[
                    ...CANONICAL_DEPARTMENTS.map((d) => {
                      const key = d.code.toLowerCase() as DeptKey;
                      return { value: key, label: DEPT_META[key].fullName };
                    }),
                    ...(!isDeptAdmin
                      ? [{ value: "it", label: "Central University Administration" }]
                      : []),
                  ]}
                  size="md"
                  variant="surface2"
                />
              </div>

              {/* Dynamic Role Fields */}
              {editRole === "student" && (
                <div>
                  <label
                    htmlFor="edit-user-semester"
                    className="block text-xs font-semibold text-fg-muted mb-1.5"
                  >
                    Assigned Semester &amp; Batch
                  </label>
                  <Select
                    id="edit-user-semester"
                    ariaLabel="Assigned Semester and Batch"
                    value={editSemester}
                    onChange={(val) => onEditSemesterChange?.(val)}
                    options={adminService
                      .getDepartmentSemesters(editDeptKey)
                      .map((sem) => ({
                        value: sem,
                        label: sem,
                      }))}
                    size="md"
                    variant="surface2"
                  />
                </div>
              )}

              {editRole === "teacher" && (
                <div>
                  <label
                    htmlFor="edit-user-teacher-code"
                    className="block text-xs font-semibold text-fg-muted mb-1.5"
                  >
                    Teacher Code / Faculty ID
                  </label>
                  <input
                    id="edit-user-teacher-code"
                    type="text"
                    placeholder="e.g. T-CSE-01 or FAC-102"
                    value={editTeacherCode}
                    onChange={(e) => onEditTeacherCodeChange?.(e.target.value)}
                    className="w-full min-h-[44px] bg-surface-2 border border-line focus:border-brand rounded-xl px-3.5 py-2 text-xs text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand font-mono"
                  />
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-line">
                <Button variant="secondary" size="sm" onClick={onCloseEditModal}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={onSaveRoleChanges}>
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
