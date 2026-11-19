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
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { Tabs, TabOption } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";

function formatNoticeDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function getCategoryVariant(
  category: string
): "brand" | "danger" | "warning" | "success" | "neutral" {
  switch (category) {
    case "Academics":
      return "brand";
    case "Exams":
    case "Emergency":
      return "danger";
    case "Events":
      return "success";
    case "Administrative":
    default:
      return "neutral";
  }
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

  const pinnedCount = useMemo(
    () => notices.filter((n) => n.pinned).length,
    [notices]
  );
  const facultyExclusiveCount = useMemo(
    () => notices.filter((n) => n.target_role === "teacher").length,
    [notices]
  );

  const tabOptions = useMemo<TabOption<"all" | "faculty" | "pinned">[]>(
    () => [
      { id: "all", label: "All", count: notices.length },
      { id: "faculty", label: "Faculty", count: facultyExclusiveCount },
      {
        id: "pinned",
        label: "Priority Pinned",
        count: pinnedCount,
        icon: (
          <Pin
            className={cn(
              "w-3.5 h-3.5",
              activeTab === "pinned"
                ? "text-warning fill-warning/30"
                : "text-fg-muted"
            )}
          />
        ),
      },
    ],
    [notices.length, facultyExclusiveCount, pinnedCount, activeTab]
  );

  const filteredNotices = useMemo(() => {
    const list = notices.filter((n) => {
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

    return list.sort((a, b) => {
      // Pinned notices first
      const pinDiff = Number(b.pinned) - Number(a.pinned);
      if (pinDiff !== 0) return pinDiff;
      // Newest created_at descending
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [notices, activeTab, selectedCategory, searchQuery]);

  return (
    <div className="w-full space-y-6 pb-16">
      {/* Header Bar */}
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-fg tracking-tight">
          Official Notices &amp; Circulars
        </h1>
        <p className="text-xs sm:text-sm text-fg-muted mt-1 font-sans">
          {ACTIVE_TERM} • Administrative mandates, exam controller notifications, and institutional broadcasts
        </p>
      </div>

      {/* Tabs & Search Filter */}
      <div className="rounded-2xl bg-surface border border-line p-4 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        {/* Tabs */}
        <div className="w-full lg:w-auto">
          <Tabs<"all" | "faculty" | "pinned">
            tabs={tabOptions}
            value={activeTab}
            onChange={setActiveTab}
            size="sm"
            ariaLabel="Filter notices by scope"
          />
        </div>

        {/* Search & Category */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-fg-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search circulars..."
              className="w-full min-h-[44px] sm:min-h-[38px] pl-8.5 pr-8 py-2 bg-canvas border border-line text-fg placeholder:text-fg-muted rounded-xl text-xs font-sans focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:border-brand"
            />
            {searchQuery.length > 0 && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 min-w-[28px] min-h-[28px] flex items-center justify-center text-fg-muted hover:text-fg rounded-lg hover:bg-surface-2 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <select
            aria-label="Filter notices by category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-44 min-h-[44px] sm:min-h-[38px] px-3 py-2 bg-canvas border border-line text-fg rounded-xl text-xs font-sans font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:border-brand"
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

      {/* Notices Grid or Empty State */}
      {filteredNotices.length === 0 ? (
        <div className="rounded-2xl bg-surface border border-line">
          <EmptyState
            icon={<FileText className="w-6 h-6" />}
            title="No notices found"
            description="No circulars or official notices match your current filters or search query."
            action={
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setActiveTab("all");
                }}
              >
                Clear filters
              </Button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNotices.map((notice) => (
            <button
              key={notice.id}
              type="button"
              onClick={() => setViewingNotice(notice)}
              className="w-full text-left rounded-2xl bg-surface border border-line hover:border-fg-subtle/40 p-5 flex flex-col justify-between transition-colors cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-[12px] font-sans font-medium border",
                        notice.target_role === "teacher"
                          ? "bg-surface-2 text-fg border-line"
                          : "bg-surface-2 text-fg-muted border-line"
                      )}
                    >
                      {notice.target_role === "teacher"
                        ? "Faculty Circular"
                        : "Campus Wide"}
                    </span>
                    <Badge
                      variant={getCategoryVariant(notice.category)}
                      className="font-sans text-[12px] font-medium"
                    >
                      {notice.category}
                    </Badge>
                  </div>

                  {notice.pinned && (
                    <span className="inline-flex items-center gap-1 text-[12px] font-sans font-medium text-warning bg-warning-light border border-warning/20 px-2 py-0.5 rounded-full shrink-0">
                      <Pin className="w-3 h-3 fill-current" /> Pinned
                    </span>
                  )}
                </div>

                <h2 className="font-semibold text-[15px] text-fg group-hover:text-brand transition-colors line-clamp-2 leading-snug mb-2 font-sans">
                  {notice.title}
                </h2>

                <p className="text-xs text-fg-muted line-clamp-3 leading-relaxed mb-4 font-sans">
                  {notice.body}
                </p>
              </div>

              <div className="pt-3 border-t border-line/70 flex flex-wrap items-center justify-between gap-2 text-xs font-sans w-full">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 min-w-0 text-fg-muted">
                  <span className="truncate">{notice.author_name}</span>
                  <span aria-hidden="true">•</span>
                  <span className="whitespace-nowrap tabular-nums">
                    {formatNoticeDate(notice.created_at)}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  {notice.attachments && notice.attachments.length > 0 && (
                    <span className="inline-flex items-center gap-1 text-fg-muted font-sans font-medium text-xs tabular-nums">
                      <Paperclip className="w-3.5 h-3.5 text-brand" />{" "}
                      {notice.attachments.length}
                    </span>
                  )}
                  <span className="text-brand font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Read <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Notice Detail View Modal */}
      <Modal
        open={!!viewingNotice}
        onClose={() => setViewingNotice(null)}
        size="lg"
        title={
          viewingNotice && (
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-1.5">
                <span
                  className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-sans font-medium border",
                    viewingNotice.target_role === "teacher"
                      ? "bg-surface-2 text-fg border-line"
                      : "bg-surface-2 text-fg-muted border-line"
                  )}
                >
                  {viewingNotice.target_role === "teacher"
                    ? "Faculty Circular"
                    : "Campus Wide"}
                </span>
                <Badge
                  variant={getCategoryVariant(viewingNotice.category)}
                  className="font-sans text-[11px] font-medium"
                >
                  {viewingNotice.category}
                </Badge>
                {viewingNotice.pinned && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-sans font-medium text-warning bg-warning-light border border-warning/20 px-2 py-0.5 rounded-full">
                    <Pin className="w-3 h-3 fill-current" /> Pinned
                  </span>
                )}
              </div>
              <div className="text-base sm:text-lg font-bold text-fg leading-snug">
                {viewingNotice.title}
              </div>
            </div>
          )
        }
        description={
          viewingNotice && (
            <span className="text-xs text-fg-muted font-sans">
              Issued by {viewingNotice.author_name} •{" "}
              {formatNoticeDate(viewingNotice.created_at)}
            </span>
          )
        }
        footer={
          <div className="flex justify-end w-full">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setViewingNotice(null)}
            >
              Close Circular
            </Button>
          </div>
        }
      >
        {viewingNotice && (
          <div className="space-y-4">
            <div className="text-sm text-fg leading-relaxed whitespace-pre-wrap font-sans">
              {viewingNotice.body}
            </div>

            {viewingNotice.attachments &&
              viewingNotice.attachments.length > 0 && (
                <div className="pt-4 border-t border-line space-y-2.5">
                  <h3 className="text-xs font-semibold text-fg flex items-center gap-1.5 font-sans">
                    <Paperclip className="w-3.5 h-3.5 text-brand" /> Attached Circular Documents
                  </h3>
                  <div className="space-y-2">
                    {viewingNotice.attachments.map((att, idx) => {
                      const name = att.includes("::")
                        ? att.split("::")[0]
                        : att.split("/").pop() || `Document ${idx + 1}`;
                      const url = att.includes("::") ? att.split("::")[1] : att;
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between gap-3 p-3 bg-canvas border border-line rounded-xl text-xs font-sans"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <FileText className="w-4 h-4 text-brand shrink-0" />
                            <span className="font-medium text-fg truncate">
                              {name}
                            </span>
                          </div>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand hover:underline font-semibold text-xs shrink-0 inline-flex items-center gap-1"
                          >
                            View / Download
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
          </div>
        )}
      </Modal>
    </div>
  );
}
