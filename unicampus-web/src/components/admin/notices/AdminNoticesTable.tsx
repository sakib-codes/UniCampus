"use client";

import React from "react";
import {
  Pin,
  Trash2,
  Edit3,
  Eye,
  Paperclip,
  Users,
  MoreHorizontal,
} from "lucide-react";
import type { Notice } from "@/types/admin";

interface AdminNoticeRowProps {
  notice: Notice;
  isSelected: boolean;
  isMenuOpen: boolean;
  onToggleSelect: (id: string) => void;
  onTogglePin: (id: string) => void;
  onView: (notice: Notice) => void;
  onEdit: (notice: Notice) => void;
  onRequestDelete: (id: string) => void;
  onToggleMenu: (id: string | null) => void;
}

const AdminNoticeRow = React.memo(function AdminNoticeRow({
  notice,
  isSelected,
  isMenuOpen,
  onToggleSelect,
  onTogglePin,
  onView,
  onEdit,
  onRequestDelete,
  onToggleMenu,
}: AdminNoticeRowProps) {
  return (
    <tr className="hover:bg-surface-2/60 border-b border-line transition-colors group">
      <td className="px-5 py-3 text-center">
        <input
          type="checkbox"
          aria-label={`Select notice ${notice.title}`}
          checked={isSelected}
          onChange={() => onToggleSelect(notice.id)}
          className="rounded border-line bg-canvas text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand cursor-pointer"
        />
      </td>

      <td className="px-4 py-3 max-w-md">
        <div className="flex items-start gap-2.5">
          <button
            type="button"
            onClick={() => onTogglePin(notice.id)}
            title={notice.pinned ? "Unpin notice" : "Pin notice to top"}
            aria-label={notice.pinned ? "Unpin notice" : "Pin notice to top"}
            className={`mt-0.5 p-1 rounded-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
              notice.pinned
                ? "text-warning bg-warning-light border border-warning/30"
                : "text-fg-subtle hover:text-fg"
            }`}
          >
            <Pin className={`w-3.5 h-3.5 ${notice.pinned ? "fill-current" : ""}`} />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-surface-2 border border-line text-fg-muted rounded-md text-xs font-semibold">
                {notice.category}
              </span>
              {notice.pinned && (
                <span className="px-2 py-0.5 bg-warning-light border border-warning/30 text-warning rounded-md text-xs font-semibold flex items-center gap-1">
                  Pinned
                </span>
              )}
            </div>
            <h4 className="text-xs font-semibold text-fg line-clamp-1">
              <button
                type="button"
                onClick={() => onView(notice)}
                className="text-left hover:text-brand cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
              >
                {notice.title}
              </button>
            </h4>
            <p className="text-xs text-fg-muted line-clamp-1 mt-0.5">
              {notice.body}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold border ${
            notice.target_role === "student"
              ? "bg-success-light text-success border-success/20"
              : notice.target_role === "teacher"
              ? "bg-brand-soft text-brand border-brand/20"
              : "bg-surface-2 text-fg-muted border-line"
          }`}
        >
          <Users className="w-3 h-3" />
          {notice.target_role === "all"
            ? "All Members"
            : notice.target_role === "student"
            ? "Students Only"
            : "Faculty Only"}
        </span>
        {notice.department_name && notice.department_name !== "Campus Wide" && (
          <p className="text-xs font-medium text-fg-muted mt-1">
            {notice.department_name}
          </p>
        )}
      </td>

      <td className="px-4 py-3">
        {notice.attachments && notice.attachments.length > 0 ? (
          <div className="flex items-center gap-1.5 text-fg text-xs font-semibold tabular-nums">
            <Paperclip className="w-3.5 h-3.5 text-brand" />
            <span>
              {notice.attachments.length} file
              {notice.attachments.length > 1 ? "s" : ""}
            </span>
          </div>
        ) : (
          <span className="text-xs text-fg-muted">None</span>
        )}
      </td>

      <td className="px-4 py-3 tabular-nums">
        <div className="text-xs font-medium text-fg">
          {notice.views || 142} reads
        </div>
        <div className="text-xs text-fg-muted mt-0.5">
          {new Date(notice.created_at).toLocaleDateString()}
        </div>
      </td>

      <td className="px-5 py-3 text-right relative">
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleMenu(isMenuOpen ? null : notice.id);
            }}
            title="Notice Actions"
            aria-label="Notice Actions"
            className="min-w-[36px] min-h-[36px] inline-flex items-center justify-center rounded-lg text-fg-muted hover:text-fg hover:bg-surface-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {isMenuOpen && (
            <>
              <button
                type="button"
                aria-label="Close actions menu"
                tabIndex={-1}
                className="fixed inset-0 z-20 cursor-default bg-transparent"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleMenu(null);
                }}
              />
              <div className="absolute right-5 top-12 z-30 w-44 rounded-xl bg-surface border border-line shadow-lg p-1.5 text-left transition-opacity">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onView(notice);
                    onToggleMenu(null);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-fg hover:bg-surface-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <Eye className="w-3.5 h-3.5 text-fg-muted" />
                  <span>View Details</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(notice);
                    onToggleMenu(null);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-fg hover:bg-surface-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <Edit3 className="w-3.5 h-3.5 text-fg-muted" />
                  <span>Edit Notice</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTogglePin(notice.id);
                    onToggleMenu(null);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-fg hover:bg-surface-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <Pin className="w-3.5 h-3.5 text-warning" />
                  <span>{notice.pinned ? "Unpin Notice" : "Pin to Top"}</span>
                </button>
                <div className="my-1 border-t border-line" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRequestDelete(notice.id);
                    onToggleMenu(null);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-danger hover:bg-danger-light transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Notice</span>
                </button>
              </div>
            </>
          )}
        </div>
      </td>
    </tr>
  );
});

const AdminNoticeMobileCard = React.memo(function AdminNoticeMobileCard({
  notice,
  isMenuOpen,
  onTogglePin,
  onView,
  onEdit,
  onRequestDelete,
  onToggleMenu,
}: Omit<AdminNoticeRowProps, "isSelected" | "onToggleSelect">) {
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => onTogglePin(notice.id)}
            title={notice.pinned ? "Unpin notice" : "Pin notice"}
            aria-label={notice.pinned ? "Unpin notice" : "Pin notice"}
            className={`p-1 rounded-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
              notice.pinned
                ? "text-warning bg-warning-light border border-warning/30"
                : "text-fg-subtle hover:text-fg"
            }`}
          >
            <Pin className={`w-3.5 h-3.5 ${notice.pinned ? "fill-current" : ""}`} />
          </button>
          <span className="px-2 py-0.5 bg-surface-2 border border-line text-fg-muted rounded-md text-xs font-semibold">
            {notice.category}
          </span>
          {notice.pinned && (
            <span className="px-2 py-0.5 bg-warning-light border border-warning/30 text-warning rounded-md text-xs font-semibold">
              Pinned
            </span>
          )}
        </div>

        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border ${
            notice.target_role === "student"
              ? "bg-success-light text-success border-success/20"
              : notice.target_role === "teacher"
              ? "bg-brand-soft text-brand border-brand/20"
              : "bg-surface-2 text-fg-muted border-line"
          }`}
        >
          {notice.target_role === "all"
            ? "All"
            : notice.target_role === "student"
            ? "Students"
            : "Faculty"}
        </span>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-fg">
          <button
            type="button"
            onClick={() => onView(notice)}
            className="text-left hover:text-brand cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
          >
            {notice.title}
          </button>
        </h4>
        <p className="text-xs text-fg-muted line-clamp-2 mt-1 leading-relaxed">
          {notice.body}
        </p>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-line text-xs">
        <div className="flex items-center gap-2 text-fg-muted tabular-nums">
          <span>{(notice.views || 142).toLocaleString()} reads</span>
          <span>•</span>
          <span>{new Date(notice.created_at).toLocaleDateString()}</span>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleMenu(isMenuOpen ? null : notice.id);
            }}
            title="Notice Actions"
            aria-label="Notice Actions"
            className="min-w-[36px] min-h-[36px] inline-flex items-center justify-center rounded-lg text-fg-muted hover:text-fg hover:bg-surface-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {isMenuOpen && (
            <>
              <button
                type="button"
                aria-label="Close actions menu"
                tabIndex={-1}
                className="fixed inset-0 z-20 cursor-default bg-transparent"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleMenu(null);
                }}
              />
              <div className="absolute right-0 bottom-8 z-30 w-44 rounded-xl bg-surface border border-line shadow-lg p-1.5 text-left transition-opacity">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onView(notice);
                    onToggleMenu(null);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-fg hover:bg-surface-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <Eye className="w-3.5 h-3.5 text-fg-muted" />
                  <span>View Details</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(notice);
                    onToggleMenu(null);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-fg hover:bg-surface-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <Edit3 className="w-3.5 h-3.5 text-fg-muted" />
                  <span>Edit Notice</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTogglePin(notice.id);
                    onToggleMenu(null);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-fg hover:bg-surface-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <Pin className="w-3.5 h-3.5 text-warning" />
                  <span>{notice.pinned ? "Unpin Notice" : "Pin to Top"}</span>
                </button>
                <div className="my-1 border-t border-line" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRequestDelete(notice.id);
                    onToggleMenu(null);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-danger hover:bg-danger-light transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Notice</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

interface AdminNoticesTableProps {
  notices: Notice[];
  selectedNoticeIds: string[];
  activeActionMenuId: string | null;
  onToggleSelectAll: () => void;
  onToggleSelectNotice: (id: string) => void;
  onTogglePin: (id: string) => void;
  onView: (notice: Notice) => void;
  onEdit: (notice: Notice) => void;
  onRequestDelete: (id: string) => void;
  onToggleMenu: (id: string | null) => void;
}

export function AdminNoticesTable({
  notices,
  selectedNoticeIds,
  activeActionMenuId,
  onToggleSelectAll,
  onToggleSelectNotice,
  onTogglePin,
  onView,
  onEdit,
  onRequestDelete,
  onToggleMenu,
}: AdminNoticesTableProps) {
  return (
    <div className="rounded-2xl bg-surface border border-line overflow-hidden">
      {/* Mobile View: Cards */}
      <div className="block md:hidden divide-y divide-line">
        {notices.length === 0 ? (
          <div className="px-6 py-12 text-center text-fg-muted text-xs font-medium">
            No notices found matching the filter criteria.
          </div>
        ) : (
          notices.map((notice) => (
            <AdminNoticeMobileCard
              key={notice.id}
              notice={notice}
              isMenuOpen={activeActionMenuId === notice.id}
              onTogglePin={onTogglePin}
              onView={onView}
              onEdit={onEdit}
              onRequestDelete={onRequestDelete}
              onToggleMenu={onToggleMenu}
            />
          ))
        )}
      </div>

      {/* Desktop View: Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-canvas font-sans text-xs font-semibold text-fg-muted border-b border-line">
              <th className="px-5 py-3 w-12 text-center">
                <input
                  type="checkbox"
                  aria-label="Select all notices"
                  checked={
                    notices.length > 0 &&
                    selectedNoticeIds.length === notices.length
                  }
                  onChange={onToggleSelectAll}
                  className="rounded border-line bg-canvas text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand cursor-pointer"
                />
              </th>
              <th className="px-4 py-3">Announcement</th>
              <th className="px-4 py-3">Target Audience</th>
              <th className="px-4 py-3">Attachments</th>
              <th className="px-4 py-3">Views &amp; Date</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {notices.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-fg-muted text-xs font-medium"
                >
                  No notices found matching the filter criteria.
                </td>
              </tr>
            ) : (
              notices.map((notice) => (
                <AdminNoticeRow
                  key={notice.id}
                  notice={notice}
                  isSelected={selectedNoticeIds.includes(notice.id)}
                  isMenuOpen={activeActionMenuId === notice.id}
                  onToggleSelect={onToggleSelectNotice}
                  onTogglePin={onTogglePin}
                  onView={onView}
                  onEdit={onEdit}
                  onRequestDelete={onRequestDelete}
                  onToggleMenu={onToggleMenu}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
