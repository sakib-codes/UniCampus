"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Megaphone,
  Pin,
  Trash2,
  Eye,
  Check,
  ChevronDown,
} from "lucide-react";
import { adminService } from "@/lib/services/adminService";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { Notice, NoticeTargetRole, Department } from "@/types/admin";
import CountUp from "@/components/bits/CountUp";
import { AdminNoticesTable } from "@/components/admin/notices/AdminNoticesTable";
import { AdminNoticeDetailModal } from "@/components/admin/notices/AdminNoticeDetailModal";
import { AdminNoticeComposeModal } from "@/components/admin/notices/AdminNoticeComposeModal";
import { AdminNoticeDeleteModal } from "@/components/admin/notices/AdminNoticeDeleteModal";

export default function AdminNoticesPage() {
  const { currentUser, isSuperAdmin, isDeptAdmin, effectiveDeptId, adminDepartmentName } =
    useAdminAuth();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  // Search & Filter
  const [activeTab, setActiveTab] = useState<"all" | "pinned">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Selection for bulk action
  const [selectedNoticeIds, setSelectedNoticeIds] = useState<string[]>([]);

  // Modals
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [viewingNotice, setViewingNotice] = useState<Notice | null>(null);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeActionMenuId, setActiveActionMenuId] = useState<string | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState("");
  const [formBody, setFormBody] = useState("");
  const [formCategory, setFormCategory] = useState("Academics");
  const [formTargetRole, setFormTargetRole] = useState<NoticeTargetRole>("all");
  const [formDeptId, setFormDeptId] = useState<string>("");
  const [formPinned, setFormPinned] = useState(false);
  const [formAttachments, setFormAttachments] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadNotices = useCallback(() => {
    setNotices(adminService.getNotices());
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      loadNotices();
      setDepartments(adminService.getDepartments());
    });
  }, [loadNotices]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  const handleTogglePin = useCallback(
    (id: string) => {
      const updated = adminService.togglePinNotice(id);
      setNotices(updated);
      showToast("Notice priority pinned status updated.");
    },
    [showToast]
  );

  const handleDeleteNotice = useCallback(
    (id: string) => {
      const updated = adminService.deleteNotice(id);
      setNotices(updated);
      setConfirmDeleteId(null);
      setViewingNotice((prev) => (prev?.id === id ? null : prev));
      showToast("Notice removed from university broadcasts.");
    },
    [showToast]
  );

  const handleBulkDelete = () => {
    if (selectedNoticeIds.length === 0) return;
    const updated = adminService.bulkDeleteNotices(selectedNoticeIds);
    setNotices(updated);
    setSelectedNoticeIds([]);
    showToast(`Bulk removed ${selectedNoticeIds.length} notices.`);
  };

  const toggleSelectNotice = useCallback((id: string) => {
    setSelectedNoticeIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }, []);

  const filteredNotices = notices.filter((notice) => {
    if (isDeptAdmin && currentUser?.department_id) {
      if (notice.department_id && notice.department_id !== currentUser.department_id)
        return false;
    } else if (effectiveDeptId !== "all") {
      if (notice.department_id && notice.department_id !== effectiveDeptId) return false;
    }

    if (activeTab === "pinned" && !notice.pinned) return false;
    if (selectedCategory !== "all" && notice.category !== selectedCategory) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = notice.title.toLowerCase().includes(q);
      const matchesBody = notice.body.toLowerCase().includes(q);
      const matchesCat = notice.category.toLowerCase().includes(q);
      if (!matchesTitle && !matchesBody && !matchesCat) return false;
    }

    return true;
  });

  const toggleSelectAll = useCallback(() => {
    setSelectedNoticeIds((prev) =>
      prev.length === filteredNotices.length ? [] : filteredNotices.map((n) => n.id)
    );
  }, [filteredNotices]);

  const handleOpenCompose = () => {
    setEditingNotice(null);
    setFormTitle("");
    setFormBody("");
    setFormCategory("Academics");
    setFormTargetRole("all");
    setFormDeptId("");
    setFormPinned(false);
    setFormAttachments([]);
    setIsComposeOpen(true);
  };

  const handleOpenEdit = useCallback((notice: Notice) => {
    setEditingNotice(notice);
    setFormTitle(notice.title);
    setFormBody(notice.body);
    setFormCategory(notice.category);
    setFormTargetRole(notice.target_role);
    setFormDeptId(notice.department_id || "");
    setFormPinned(notice.pinned);
    setFormAttachments(notice.attachments || []);
    setIsComposeOpen(true);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const publicUrl = await adminService.uploadNoticeAttachment(file);
        setFormAttachments((prev) => [...prev, `${file.name}::${publicUrl}`]);
        showToast(`Uploaded ${file.name} to storage bucket.`);
      } catch {
        showToast(`Failed to upload ${file.name}`);
      }
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeAttachment = (index: number) => {
    setFormAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formBody.trim()) return;

    const targetDeptId =
      isDeptAdmin && currentUser?.department_id
        ? currentUser.department_id
        : formDeptId;
    const dept = departments.find((d) => d.id === targetDeptId);
    const deptName = dept ? dept.name : "Campus Wide";

    if (editingNotice) {
      const updated = adminService.updateNotice(editingNotice.id, {
        title: formTitle,
        body: formBody,
        category: formCategory,
        target_role: formTargetRole,
        department_id: targetDeptId || null,
        department_name: deptName,
        pinned: formPinned,
        attachments: formAttachments,
      });
      setNotices(updated);
      showToast("Announcement details modified successfully.");
    } else {
      const newNotice = adminService.createNotice({
        title: formTitle,
        body: formBody,
        category: formCategory,
        target_role: formTargetRole,
        department_id: targetDeptId || null,
        department_name: deptName,
        pinned: formPinned,
        attachments: formAttachments,
        author_name: isSuperAdmin
          ? "Central Executive Registrar"
          : `${adminDepartmentName || deptName} Admin Office`,
      });
      setNotices([newNotice, ...notices]);
      showToast("New notice broadcasted to portal.");
    }

    setIsComposeOpen(false);
  };

  const pinnedCount = notices.filter((n) => n.pinned).length;
  const totalViews = notices.reduce((sum, n) => sum + (n.views || 142), 0);

  return (
    <div className="w-full space-y-6 pb-12">
      {toastMessage && (
        <div className="fixed top-6 right-8 z-50 bg-success text-on-brand px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold border border-success/30">
          <Check className="w-4 h-4" /> {toastMessage}
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl bg-surface border border-line p-5">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl md:text-2xl font-semibold text-fg tracking-tight">
              Campus Announcements &amp; Notices
            </h1>
            <span className="px-2.5 py-1 rounded-lg bg-surface-2 border border-line text-fg text-xs font-semibold">
              Broadcast
            </span>
          </div>
          <p className="text-xs text-fg-muted mt-1">
            Dispatch urgent notices, upload official documents, and target student or faculty groups.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {selectedNoticeIds.length > 0 && (
            <button
              type="button"
              onClick={handleBulkDelete}
              className="min-h-[44px] bg-danger-light border border-danger/30 hover:opacity-90 text-danger px-3.5 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition-opacity text-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Selected ({selectedNoticeIds.length})
            </button>
          )}

          <button
            type="button"
            onClick={handleOpenCompose}
            className="min-h-[44px] bg-brand text-on-brand hover:bg-brand-hover rounded-xl font-semibold px-4 py-2 flex items-center gap-1.5 text-xs cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <Plus className="w-4 h-4" />
            Compose Notice
          </button>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-surface border border-line p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-brand-soft border border-brand/25 flex items-center justify-center shrink-0">
            <Megaphone className="w-5 h-5 text-brand" />
          </div>
          <div>
            <p className="text-xs font-semibold text-fg-muted mb-0.5">Active Notices</p>
            <h3 className="text-xl font-bold text-fg tabular-nums">
              <CountUp to={notices.length} duration={0.8} />
            </h3>
          </div>
        </div>

        <div className="rounded-2xl bg-surface border border-line p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-warning-light border border-warning/25 flex items-center justify-center shrink-0">
            <Pin className="w-5 h-5 text-warning" />
          </div>
          <div>
            <p className="text-xs font-semibold text-fg-muted mb-0.5">Pinned Priority</p>
            <h3 className="text-xl font-bold text-fg tabular-nums">
              <CountUp to={pinnedCount} duration={0.8} />
            </h3>
          </div>
        </div>

        <div className="rounded-2xl bg-surface border border-line p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-success-light border border-success/25 flex items-center justify-center shrink-0">
            <Eye className="w-5 h-5 text-success" />
          </div>
          <div>
            <p className="text-xs font-semibold text-fg-muted mb-0.5">
              Broadcast Readership
            </p>
            <h3 className="text-xl font-bold text-fg tabular-nums">
              <CountUp to={totalViews} duration={1.0} suffix=" reads" />
            </h3>
          </div>
        </div>
      </div>

      {/* Tabs & Search Filter */}
      <div className="rounded-2xl bg-surface border border-line p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-canvas border border-line w-full md:w-auto relative overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`relative min-h-[36px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer z-10 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
              activeTab === "all" ? "text-fg" : "text-fg-muted hover:text-fg"
            }`}
          >
            {activeTab === "all" && (
              <motion.div
                layoutId="admin-notices-tab-pill"
                className="absolute inset-0 bg-surface-2 border border-line rounded-lg -z-10"
                transition={{ type: "spring", stiffness: 450, damping: 32 }}
              />
            )}
            All Broadcasts ({notices.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("pinned")}
            className={`relative min-h-[36px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer z-10 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
              activeTab === "pinned"
                ? "text-warning"
                : "text-warning/80 hover:text-warning"
            }`}
          >
            {activeTab === "pinned" && (
              <motion.div
                layoutId="admin-notices-tab-pill"
                className="absolute inset-0 bg-warning-light border border-warning/35 rounded-lg -z-10"
                transition={{ type: "spring", stiffness: 450, damping: 32 }}
              />
            )}
            <Pin className="w-3.5 h-3.5" />
            Pinned Priority ({pinnedCount})
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-fg-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              aria-label="Search announcements"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search announcements..."
              className="w-full min-h-[40px] pl-9 pr-3.5 py-2 rounded-xl bg-canvas border border-line text-fg placeholder:text-fg-muted text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus:border-brand"
            />
          </div>

          <div className="relative w-full sm:w-44">
            <select
              aria-label="Filter notices by category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full min-h-[40px] pl-3 pr-8 py-2 rounded-xl bg-canvas border border-line text-fg text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus:border-brand cursor-pointer appearance-none"
            >
              <option value="all">All Categories</option>
              <option value="Academics">Academics</option>
              <option value="Administrative">Administrative</option>
              <option value="Exams">Exams</option>
              <option value="Events">Events</option>
              <option value="Emergency">Emergency</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-fg-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      <AdminNoticesTable
        notices={filteredNotices}
        selectedNoticeIds={selectedNoticeIds}
        activeActionMenuId={activeActionMenuId}
        onToggleSelectAll={toggleSelectAll}
        onToggleSelectNotice={toggleSelectNotice}
        onTogglePin={handleTogglePin}
        onView={setViewingNotice}
        onEdit={handleOpenEdit}
        onRequestDelete={setConfirmDeleteId}
        onToggleMenu={setActiveActionMenuId}
      />

      <AdminNoticeDetailModal
        notice={viewingNotice}
        onClose={() => setViewingNotice(null)}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteNotice}
      />

      <AdminNoticeComposeModal
        open={isComposeOpen}
        editingNotice={editingNotice}
        onClose={() => setIsComposeOpen(false)}
        onSubmit={handleSaveNotice}
        formTitle={formTitle}
        onTitleChange={setFormTitle}
        formCategory={formCategory}
        onCategoryChange={setFormCategory}
        formTargetRole={formTargetRole}
        onTargetRoleChange={setFormTargetRole}
        formDeptId={formDeptId}
        onDeptIdChange={setFormDeptId}
        formPinned={formPinned}
        onPinnedChange={setFormPinned}
        formBody={formBody}
        onBodyChange={setFormBody}
        formAttachments={formAttachments}
        onRemoveAttachment={removeAttachment}
        onFileChange={handleFileChange}
        fileInputRef={fileInputRef}
        isDeptAdmin={isDeptAdmin}
        adminDepartmentName={adminDepartmentName}
        departments={departments}
      />

      <AdminNoticeDeleteModal
        confirmDeleteId={confirmDeleteId}
        onCancel={() => setConfirmDeleteId(null)}
        onConfirmDelete={handleDeleteNotice}
      />
    </div>
  );
}
