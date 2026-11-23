"use client";

import { Select } from "@/components/ui/Select";

import React from "react";
import { X, Lock, Pin, Upload, Paperclip } from "lucide-react";
import type { Notice, NoticeTargetRole, Department } from "@/types/admin";

interface AdminNoticeComposeModalProps {
  open: boolean;
  editingNotice: Notice | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formTitle: string;
  onTitleChange: (v: string) => void;
  formCategory: string;
  onCategoryChange: (v: string) => void;
  formTargetRole: NoticeTargetRole;
  onTargetRoleChange: (v: NoticeTargetRole) => void;
  formDeptId: string;
  onDeptIdChange: (v: string) => void;
  formPinned: boolean;
  onPinnedChange: (v: boolean) => void;
  formBody: string;
  onBodyChange: (v: string) => void;
  formAttachments: string[];
  onRemoveAttachment: (index: number) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  isDeptAdmin: boolean;
  adminDepartmentName?: string | null;
  departments: Department[];
}

export function AdminNoticeComposeModal({
  open,
  editingNotice,
  onClose,
  onSubmit,
  formTitle,
  onTitleChange,
  formCategory,
  onCategoryChange,
  formTargetRole,
  onTargetRoleChange,
  formDeptId,
  onDeptIdChange,
  formPinned,
  onPinnedChange,
  formBody,
  onBodyChange,
  formAttachments,
  onRemoveAttachment,
  onFileChange,
  fileInputRef,
  isDeptAdmin,
  adminDepartmentName,
  departments,
}: AdminNoticeComposeModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-xl rounded-2xl bg-surface border border-line shadow-xl p-6 max-h-[90dvh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3.5 border-b border-line mb-5">
          <div>
            <h3 className="text-base font-semibold text-fg">
              {editingNotice ? "Edit University Notice" : "Dispatch New Announcement"}
            </h3>
            <p className="text-xs text-fg-muted mt-0.5">
              Publish to campus dashboards and push notification services
            </p>
          </div>
          <button
            type="button"
            aria-label="Close modal"
            onClick={onClose}
            className="min-w-[36px] min-h-[36px] inline-flex items-center justify-center text-fg-muted hover:text-fg rounded-lg hover:bg-surface-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="admin-notice-title"
              className="block text-xs font-semibold text-fg-muted mb-1"
            >
              Notice Headline
            </label>
            <input
              id="admin-notice-title"
              type="text"
              value={formTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="e.g. Schedule for 4th Semester Lab Examinations"
              required
              className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-canvas border border-line text-fg placeholder:text-fg-muted text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus:border-brand"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="admin-notice-category"
                className="block text-xs font-semibold text-fg-muted mb-1"
              >
                Category
              </label>
              <Select
                id="admin-notice-category"
                ariaLabel="Category"
                value={formCategory}
                onChange={onCategoryChange}
                options={[
                  { value: "Academics", label: "Academics" },
                  { value: "Administrative", label: "Administrative" },
                  { value: "Exams", label: "Exams" },
                  { value: "Events", label: "Events" },
                  { value: "Emergency", label: "Emergency" },
                ]}
                size="md"
                variant="surface2"
              />
            </div>

            <div>
              <label
                htmlFor="admin-notice-target-role"
                className="block text-xs font-semibold text-fg-muted mb-1"
              >
                Target Audience
              </label>
              <Select
                id="admin-notice-target-role"
                ariaLabel="Target Audience"
                value={formTargetRole}
                onChange={(val) => onTargetRoleChange(val as NoticeTargetRole)}
                options={[
                  { value: "all", label: "Everyone (All Campus)" },
                  { value: "student", label: "Students Only" },
                  { value: "teacher", label: "Faculty Only" },
                ]}
                size="md"
                variant="surface2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="admin-notice-dept-scope"
                className="block text-xs font-semibold text-fg-muted mb-1"
              >
                Target Department Scope
              </label>
              {isDeptAdmin ? (
                <div
                  id="admin-notice-dept-scope"
                  className="flex items-center gap-2 min-h-[44px] px-3.5 py-2 rounded-xl bg-surface-2 border border-line text-xs font-semibold text-fg-muted"
                >
                  <Lock className="w-3.5 h-3.5 text-brand shrink-0" />
                  <span>{adminDepartmentName || "Department"} (Governed)</span>
                </div>
              ) : (
                <Select
                  id="admin-notice-dept-scope"
                  ariaLabel="Target Department Scope"
                  value={formDeptId}
                  onChange={onDeptIdChange}
                  options={[
                    { value: "", label: "Campus Wide (All Departments)" },
                    ...departments.map((dept) => ({
                      value: dept.id,
                      label: `${dept.name} (${dept.code})`,
                    })),
                  ]}
                  size="md"
                  variant="surface2"
                />
              )}
            </div>

            <div className="flex flex-col justify-end">
              <label
                htmlFor="admin-notice-pinned"
                className="flex items-center gap-2 min-h-[44px] p-2.5 rounded-xl bg-canvas border border-line cursor-pointer"
              >
                <input
                  id="admin-notice-pinned"
                  type="checkbox"
                  checked={formPinned}
                  onChange={(e) => onPinnedChange(e.target.checked)}
                  className="rounded border-line bg-canvas text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                />
                <span className="text-xs font-semibold text-fg flex items-center gap-1.5">
                  <Pin className="w-3.5 h-3.5 text-warning" /> Pin announcement to top
                </span>
              </label>
            </div>
          </div>

          <div>
            <label
              htmlFor="admin-notice-body"
              className="block text-xs font-semibold text-fg-muted mb-1"
            >
              Full Announcement Body
            </label>
            <textarea
              id="admin-notice-body"
              rows={5}
              value={formBody}
              onChange={(e) => onBodyChange(e.target.value)}
              placeholder="Enter complete notice text and details..."
              required
              className="w-full px-3.5 py-2 rounded-xl bg-canvas border border-line text-fg placeholder:text-fg-muted text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus:border-brand resize-none"
            />
          </div>

          {/* Attachments Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="admin-notice-attachments"
                className="text-xs font-semibold text-fg-muted"
              >
                File Attachments (PDF / Image)
              </label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-semibold text-brand hover:underline flex items-center gap-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded px-1"
              >
                <Upload className="w-3 h-3" /> Upload File
              </button>
              <input
                id="admin-notice-attachments"
                type="file"
                ref={fileInputRef}
                onChange={onFileChange}
                accept=".pdf,image/png,image/jpeg,image/webp"
                className="hidden"
              />
            </div>

            {formAttachments.length > 0 ? (
              <div className="space-y-1.5">
                {formAttachments.map((att, idx) => {
                  const name = att.includes("::")
                    ? att.split("::")[0]
                    : att.split("/").pop() || `File ${idx + 1}`;
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-canvas border border-line text-xs"
                    >
                      <span className="font-semibold text-fg truncate max-w-xs">
                        {name}
                      </span>
                      <button
                        type="button"
                        aria-label={`Remove ${name}`}
                        onClick={() => onRemoveAttachment(idx)}
                        className="text-danger hover:opacity-80 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-4 border border-dashed border-line rounded-xl text-center cursor-pointer hover:bg-surface-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <Paperclip className="w-5 h-5 text-fg-muted mx-auto mb-1" />
                <p className="text-xs font-medium text-fg-muted">
                  Click to attach circular PDFs, examination routines, or flyers
                </p>
              </button>
            )}
          </div>

          <div className="pt-4 flex justify-end gap-2.5 border-t border-line mt-5">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[40px] px-4 py-2 bg-canvas hover:bg-surface-2 text-fg border border-line rounded-xl font-semibold text-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-h-[40px] px-4 py-2 bg-brand text-on-brand hover:bg-brand-hover rounded-xl font-semibold text-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              {editingNotice ? "Update Announcement" : "Publish Broadcast"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
