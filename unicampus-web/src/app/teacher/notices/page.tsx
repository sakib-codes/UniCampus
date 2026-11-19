"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Pin,
  Paperclip,
  FileText,
  ChevronRight,
  X,
} from "lucide-react";
import { ACTIVE_TERM } from "@/lib/canonicalCampus";
import { adminService } from "@/lib/services/adminService";
import { Notice } from "@/types/admin";

function formatNoticeDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function TeacherNoticesPage() {
  const [notices] = useState<Notice[]>(() =>
    adminService
      .getNotices()
      .filter((n) => n.target_role === "teacher" || n.target_role === "all")
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTab, setActiveTab] = useState<"all" | "faculty" | "pinned">("all");
  const [viewingNotice, setViewingNotice] = useState<Notice | null>(null);

  const filteredNotices = useMemo(() => {
    return notices.filter((n) => {
      if (activeTab === "faculty" && n.target_role !== "teacher") return false;
      if (activeTab === "pinned" && !n.pinned) return false;
      if (selectedCategory !== "all" && n.category !== selectedCategory) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = n.title.toLowerCase().includes(q);
        const matchBody = n.body.toLowerCase().includes(q);
        const matchCat = n.category.toLowerCase().includes(q);
        return matchTitle || matchBody || matchCat;
      }

      return true;
    });
  }, [notices, activeTab, selectedCategory, searchQuery]);

  const pinnedCount = notices.filter((n) => n.pinned).length;
  const facultyExclusiveCount = notices.filter(
    (n) => n.target_role === "teacher"
  ).length;

  const tabButtonBase =
    "min-h-[44px] sm:min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer inline-flex items-center gap-1.5";

  return (
    <div className="w-full space-y-6 pb-16">
      {/* Header Bar */}
      <div>
        <p className="text-xs font-mono text-fg-muted mb-1">
          {ACTIVE_TERM} • Official Circulars
        </p>
        <h1 className="text-2xl md:text-3xl font-extrabold text-fg tracking-tight">
          Official Notices &amp; Circulars
        </h1>
        <p className="text-xs font-medium text-fg-muted mt-0.5">
          Administrative mandates, exam controller notifications, and institutional broadcasts
        </p>
      </div>

      {/* Tabs & Search Filter */}
      <div className="rounded-[20px] bg-surface border border-line p-4 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        {/* Tabs */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-1 bg-canvas border border-line rounded-xl p-1 w-full lg:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`${tabButtonBase} ${
              activeTab === "all"
                ? "bg-surface text-fg font-bold shadow-xs"
                : "text-fg-muted hover:text-fg"
            }`}
          >
            All ({notices.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("faculty")}
            className={`${tabButtonBase} ${
              activeTab === "faculty"
                ? "bg-surface text-fg font-bold shadow-xs"
                : "text-fg-muted hover:text-fg"
            }`}
          >
            Faculty ({facultyExclusiveCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("pinned")}
            className={`${tabButtonBase} ${
              activeTab === "pinned"
                ? "bg-warning-light text-warning border border-warning/30 font-bold"
                : "text-warning hover:bg-warning-light/60"
            }`}
          >
            <Pin className="w-3.5 h-3.5 shrink-0" />
            <span>Priority Pinned ({pinnedCount})</span>
          </button>
        </div>

        {/* Search & Category */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-fg-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search circulars..."
              className="w-full min-h-[44px] sm:min-h-[38px] pl-8 pr-3 py-2 bg-canvas border border-line text-fg placeholder:text-fg-muted rounded-xl text-xs focus:outline-none focus:border-brand"
            />
          </div>

          <select
            aria-label="Filter notices by category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-44 min-h-[44px] sm:min-h-[38px] px-3 py-2 bg-canvas border border-line text-fg rounded-xl text-xs font-semibold cursor-pointer focus:outline-none focus:border-brand"
          >
            <option value="all">All Categories</option>
            <option value="Academics">Academics</option>
            <option value="Administrative">Administrative</option>
            <option value="Exams">Exams &amp; Grading</option>
            <option value="Events">Campus Events</option>
            <option value="Emergency">Emergency Alert</option>
          </select>
        </div>
      </div>

      {/* Notices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNotices.map((notice) => (
          <div
            key={notice.id}
            onClick={() => setViewingNotice(notice)}
            className="rounded-[20px] bg-surface border border-line p-5 flex flex-col justify-between hover:border-fg-muted transition-colors cursor-pointer group relative overflow-hidden"
          >
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                      notice.target_role === "teacher"
                        ? "bg-brand-soft text-brand border border-brand/20"
                        : "bg-surface-2 text-fg-muted border border-line"
                    }`}
                  >
                    {notice.target_role === "teacher"
                      ? "Faculty Circular"
                      : "Campus Wide"}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-brand-soft text-brand font-mono font-bold text-xs">
                    {notice.category}
                  </span>
                </div>

                {notice.pinned && (
                  <span className="flex items-center gap-1 text-xs font-bold text-warning bg-warning-light border border-warning/20 px-2 py-0.5 rounded shrink-0">
                    <Pin className="w-3 h-3 fill-current" /> Pinned
                  </span>
                )}
              </div>

              <h3 className="font-bold text-sm text-fg group-hover:text-brand transition-colors line-clamp-2 leading-snug mb-2">
                {notice.title}
              </h3>

              <p className="text-xs text-fg-muted line-clamp-3 leading-relaxed mb-4">
                {notice.body}
              </p>
            </div>

            <div className="pt-3 border-t border-line flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 min-w-0 text-fg-muted">
                <span className="truncate">{notice.author_name}</span>
                <span aria-hidden="true">•</span>
                <span className="whitespace-nowrap">
                  {formatNoticeDate(notice.created_at)}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {notice.attachments && notice.attachments.length > 0 && (
                  <span className="flex items-center gap-1 text-fg-muted font-mono font-bold text-xs">
                    <Paperclip className="w-3 h-3 text-brand" />{" "}
                    {notice.attachments.length}
                  </span>
                )}
                <span className="text-brand font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Read <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Notice Detail View Modal */}
      {viewingNotice && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
        >
          <div className="w-full max-w-xl rounded-[20px] bg-surface border border-line shadow-xl p-6 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-start justify-between gap-3 pb-3.5 border-b border-line">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 bg-brand-soft text-brand rounded text-xs font-mono font-bold">
                    {viewingNotice.category}
                  </span>
                  {viewingNotice.pinned && (
                    <span className="px-2 py-0.5 bg-warning-light text-warning rounded text-xs font-bold flex items-center gap-1">
                      <Pin className="w-3 h-3 fill-current" /> Pinned
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-fg">
                  {viewingNotice.title}
                </h3>
                <p className="text-xs text-fg-muted mt-1">
                  Issued by {viewingNotice.author_name} •{" "}
                  {formatNoticeDate(viewingNotice.created_at)}
                </p>
              </div>

              <button
                type="button"
                aria-label="Close circular"
                onClick={() => setViewingNotice(null)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center text-fg-muted hover:text-fg rounded-xl hover:bg-surface-2 cursor-pointer shrink-0 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-fg leading-relaxed whitespace-pre-wrap py-2">
              {viewingNotice.body}
            </div>

            {viewingNotice.attachments &&
              viewingNotice.attachments.length > 0 && (
                <div className="pt-4 border-t border-line">
                  <h4 className="text-xs font-bold text-fg mb-2 flex items-center gap-1.5">
                    <Paperclip className="w-3.5 h-3.5 text-brand" /> Attached Circular Documents
                  </h4>
                  <div className="space-y-1.5">
                    {viewingNotice.attachments.map((att, idx) => {
                      const name = att.includes("::")
                        ? att.split("::")[0]
                        : att.split("/").pop() || `Document ${idx + 1}`;
                      const url = att.includes("::") ? att.split("::")[1] : att;
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between gap-2 p-2.5 bg-canvas border border-line text-xs rounded-xl"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText className="w-4 h-4 text-brand shrink-0" />
                            <span className="font-semibold text-fg truncate">
                              {name}
                            </span>
                          </div>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand hover:underline font-bold text-xs shrink-0"
                          >
                            View / Download
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setViewingNotice(null)}
                className="min-h-[44px] px-4 py-2 bg-canvas hover:bg-surface-2 text-fg border border-line rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                Close Circular
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

