"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  Megaphone, 
  Pin, 
  Trash2, 
  Edit3, 
  Eye, 
  Paperclip, 
  FileText, 
  Check, 
  X, 
  Upload, 
  ChevronDown,
  Users,
  Lock,
  Crown,
  MoreHorizontal
} from "lucide-react";
import { adminService } from "@/lib/services/adminService";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { Notice, NoticeTargetRole, Department } from "@/types/admin";
import CountUp from "@/components/bits/CountUp";

export default function AdminNoticesPage() {
  const { currentUser, isSuperAdmin, isDeptAdmin, effectiveDeptId, adminDepartmentName } = useAdminAuth();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  // Search & Filter
  const [activeTab, setActiveTab] = useState<'all' | 'published' | 'pinned'>('all');
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
    loadNotices();
    setDepartments(adminService.getDepartments());
  }, [loadNotices]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Toggle Pin
  const handleTogglePin = (id: string) => {
    const updated = adminService.togglePinNotice(id);
    setNotices(updated);
    showToast("Notice priority pinned status updated.");
  };

  // Delete
  const handleDeleteNotice = (id: string) => {
    const updated = adminService.deleteNotice(id);
    setNotices(updated);
    setConfirmDeleteId(null);
    if (viewingNotice?.id === id) setViewingNotice(null);
    showToast("Notice removed from university broadcasts.");
  };

  // Bulk Delete
  const handleBulkDelete = () => {
    if (selectedNoticeIds.length === 0) return;
    const updated = adminService.bulkDeleteNotices(selectedNoticeIds);
    setNotices(updated);
    setSelectedNoticeIds([]);
    showToast(`Bulk removed ${selectedNoticeIds.length} notices.`);
  };

  // Selection toggle
  const toggleSelectNotice = (id: string) => {
    setSelectedNoticeIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedNoticeIds.length === filteredNotices.length) {
      setSelectedNoticeIds([]);
    } else {
      setSelectedNoticeIds(filteredNotices.map(n => n.id));
    }
  };

  // Open Compose Modal
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

  // Open Edit Modal
  const handleOpenEdit = (notice: Notice) => {
    setEditingNotice(notice);
    setFormTitle(notice.title);
    setFormBody(notice.body);
    setFormCategory(notice.category);
    setFormTargetRole(notice.target_role);
    setFormDeptId(notice.department_id || "");
    setFormPinned(notice.pinned);
    setFormAttachments(notice.attachments || []);
    setIsComposeOpen(true);
  };

  // File Upload to Supabase Storage Simulation
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const publicUrl = await adminService.uploadNoticeAttachment(file);
        setFormAttachments(prev => [...prev, `${file.name}::${publicUrl}`]);
        showToast(`Uploaded ${file.name} to storage bucket.`);
      } catch {
        showToast(`Failed to upload ${file.name}`);
      }
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeAttachment = (index: number) => {
    setFormAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // Submit Notice
  const handleSaveNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formBody.trim()) return;

    const targetDeptId = isDeptAdmin && currentUser?.department_id ? currentUser.department_id : formDeptId;
    const dept = departments.find(d => d.id === targetDeptId);
    const deptName = dept ? dept.name : 'Campus Wide';

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
        author_name: isSuperAdmin ? 'Central Executive Registrar' : `${adminDepartmentName || deptName} Admin Office`,
      });
      setNotices([newNotice, ...notices]);
      showToast("New notice broadcasted to portal.");
    }

    setIsComposeOpen(false);
  };

  // Filtered notices
  const filteredNotices = useMemo(() => {
    return notices.filter((notice) => {
      // Dept Admin isolation
      if (isDeptAdmin && currentUser?.department_id) {
        if (notice.department_id && notice.department_id !== currentUser.department_id) return false;
      } else if (effectiveDeptId !== 'all') {
        if (notice.department_id && notice.department_id !== effectiveDeptId) return false;
      }

      // Tab filter
      if (activeTab === 'pinned' && !notice.pinned) return false;

      // Category filter
      if (selectedCategory !== 'all' && notice.category !== selectedCategory) return false;

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = notice.title.toLowerCase().includes(q);
        const matchesBody = notice.body.toLowerCase().includes(q);
        const matchesCat = notice.category.toLowerCase().includes(q);
        if (!matchesTitle && !matchesBody && !matchesCat) return false;
      }

      return true;
    });
  }, [notices, activeTab, selectedCategory, searchQuery, isDeptAdmin, currentUser, effectiveDeptId]);

  const pinnedCount = notices.filter(n => n.pinned).length;
  const totalViews = notices.reduce((sum, n) => sum + (n.views || 142), 0);

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-6 right-8 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold border border-emerald-400/30">
          <Check className="w-4 h-4" /> {toastMessage}
        </div>
      )}

      {/* Software Header Bar */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-[20px] bg-surface border border-line p-5`}>
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-fg tracking-tight">
              Campus Announcements &amp; Notices
            </h1>
            <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${"bg-surface text-fg font-bold shadow-xs rounded-lg px-3 py-1.5 text-xs transition-colors"}`}>
              Broadcast
            </span>
          </div>
          <p className={`text-xs text-fg-muted mt-1`}>
            Dispatch urgent notices, upload official documents, and target student or faculty groups.
          </p>
        </div>
        
        <div className="flex items-center gap-2.5">
          {selectedNoticeIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-600 dark:text-rose-300 px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all text-xs cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Selected ({selectedNoticeIds.length})
            </button>
          )}

          
            <button 
              onClick={handleOpenCompose}
              className={`bg-brand text-white hover:bg-brand-hover rounded-xl font-bold px-4 py-2 flex items-center gap-1.5 text-xs cursor-pointer shadow-md`}
            >
              <Plus className="w-4 h-4" />
              Compose Notice
            </button>
          
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-[20px] bg-surface border border-line p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-brand/15 border border-brand/25 flex items-center justify-center shrink-0">
            <Megaphone className="w-5 h-5 text-brand" />
          </div>
          <div>
            <p className={`text-xs font-bold text-fg-muted mb-0.5`}>Active Notices</p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-fg">
              <CountUp to={notices.length} duration={0.8} />
            </h3>
          </div>
        </div>

        <div className="rounded-[20px] bg-surface border border-line p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center shrink-0">
            <Pin className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className={`text-xs font-bold text-fg-muted mb-0.5`}>Pinned Priority</p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-fg">
              <CountUp to={pinnedCount} duration={0.8} />
            </h3>
          </div>
        </div>

        <div className="rounded-[20px] bg-surface border border-line p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0">
            <Eye className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className={`text-xs font-bold text-fg-muted mb-0.5`}>Broadcast Readership</p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-fg">
              <CountUp to={totalViews} duration={1.0} suffix=" reads" />
            </h3>
          </div>
        </div>
      </div>

      {/* Tabs & Search Filter */}
      <div className={`rounded-[20px] bg-surface border border-line p-4 flex flex-col md:flex-row gap-4 items-center justify-between`}>
        <div className={`flex items-center gap-1.5 p-1 rounded-xl bg-canvas border border-line p-1 w-full md:w-auto relative`}>
          <button
            onClick={() => setActiveTab('all')}
            className={`relative px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer z-10 ${
              activeTab === 'all'
                ? "text-slate-900 dark:text-white"
                : "text-slate-600 hover:text-slate-900 dark:text-fg-muted dark:hover:text-white"
            }`}
          >
            {activeTab === 'all' && (
              <motion.div
                layoutId="admin-notices-tab-pill"
                className="absolute inset-0 bg-white dark:bg-surface-2 border border-slate-200 dark:border-line rounded-lg shadow-xs -z-10"
                transition={{ type: "spring", stiffness: 450, damping: 32 }}
              />
            )}
            All Broadcasts ({notices.length})
          </button>
          <button
            onClick={() => setActiveTab('pinned')}
            className={`relative px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer z-10 ${
              activeTab === 'pinned'
                ? "text-amber-600 dark:text-amber-300 font-bold"
                : "text-amber-600/80 dark:text-amber-400/80 hover:text-amber-500"
            }`}
          >
            {activeTab === 'pinned' && (
              <motion.div
                layoutId="admin-notices-tab-pill"
                className="absolute inset-0 bg-amber-500/20 border border-amber-500/35 rounded-lg shadow-xs -z-10"
                transition={{ type: "spring", stiffness: 450, damping: 32 }}
              />
            )}
            <Pin className="w-3.5 h-3.5" />
            Pinned Priority ({pinnedCount})
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className={`w-3.5 h-3.5 text-fg-muted absolute left-3.5 top-1/2 -translate-y-1/2`} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search announcements..." 
              className={`w-full pl-9 pr-3.5 py-2 rounded-xl bg-canvas border border-line text-fg placeholder:text-fg-muted text-xs outline-hidden focus:border-brand`}
            />
          </div>

          <div className="relative w-full sm:w-44">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`w-full pl-3 pr-8 py-2 rounded-xl bg-canvas border border-line text-fg text-xs outline-hidden focus:border-brand cursor-pointer appearance-none cursor-pointer`}
            >
              <option value="all">All Categories</option>
              <option value="Academics">Academics</option>
              <option value="Administrative">Administrative</option>
              <option value="Exams">Exams</option>
              <option value="Events">Events</option>
              <option value="Emergency">Emergency</option>
            </select>
            <ChevronDown className={`w-3.5 h-3.5 text-fg-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none`} />
          </div>
        </div>
      </div>

      {/* Notices Display: Mobile Cards + Desktop Table */}
      <div className={`rounded-[20px] bg-surface border border-line overflow-hidden`}>
        {/* Mobile View: Cards */}
        <div className="block md:hidden divide-y divide-slate-100 dark:divide-line">
          {filteredNotices.length === 0 ? (
            <div className={`px-6 py-12 text-center text-fg-muted text-xs font-medium`}>
              No notices found matching the filter criteria.
            </div>
          ) : (
            filteredNotices.map((notice) => (
              <div key={notice.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTogglePin(notice.id)}
                      title={notice.pinned ? "Unpin notice" : "Pin notice"}
                      className={`p-1 rounded-md transition-colors cursor-pointer ${
                        notice.pinned 
                          ? 'text-amber-400 bg-amber-500/15 border border-amber-500/30' 
                          : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                      }`}
                    >
                      <Pin className={`w-3.5 h-3.5 ${notice.pinned ? 'fill-amber-400' : ''}`} />
                    </button>
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-surface-2 border border-slate-200 dark:border-line text-slate-700 dark:text-fg-muted rounded-md text-xs font-semibold">
                      {notice.category}
                    </span>
                    {notice.pinned && (
                      <span className="px-2 py-0.5 bg-amber-500/15 border border-amber-500/30 text-amber-500 dark:text-amber-300 rounded-md text-xs font-bold">
                        Pinned
                      </span>
                    )}
                  </div>

                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border ${
                    notice.target_role === 'student'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                      : notice.target_role === 'teacher'
                      ? 'bg-brand/10 text-brand dark:text-brand border-brand/20'
                      : 'bg-slate-100 dark:bg-surface-2 text-slate-700 dark:text-fg-muted border-slate-200 dark:border-line'
                  }`}>
                    {notice.target_role === 'all' ? 'All' : notice.target_role === 'student' ? 'Students' : 'Faculty'}
                  </span>
                </div>

                <div>
                  <h4 
                    onClick={() => setViewingNotice(notice)}
                    className="text-xs font-bold text-slate-900 dark:text-fg hover:text-brand cursor-pointer transition-colors"
                  >
                    {notice.title}
                  </h4>
                  <p className={`text-xs text-fg-muted line-clamp-2 mt-1 leading-relaxed`}>
                    {notice.body}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-line text-xs">
                  <div className="flex items-center gap-2 text-slate-400 dark:text-fg-muted">
                    <span>{(notice.views || 142).toLocaleString()} reads</span>
                    <span>•</span>
                    <span>{new Date(notice.created_at).toLocaleDateString()}</span>
                  </div>

                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveActionMenuId(activeActionMenuId === notice.id ? null : notice.id);
                      }}
                      title="Notice Actions"
                      aria-label="Notice Actions"
                      className="p-1.5 rounded-lg text-fg-muted hover:text-fg hover:bg-surface-2 transition-colors cursor-pointer"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>

                    {activeActionMenuId === notice.id && (
                      <>
                        <div 
                          className="fixed inset-0 z-20" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveActionMenuId(null);
                          }} 
                        />
                        <div className="absolute right-0 bottom-8 z-30 w-44 rounded-xl bg-surface border border-line shadow-lg p-1.5 text-left transition-all">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewingNotice(notice);
                              setActiveActionMenuId(null);
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-fg hover:bg-surface-2 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-fg-muted" />
                            <span>View Details</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEdit(notice);
                              setActiveActionMenuId(null);
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-fg hover:bg-surface-2 transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-fg-muted" />
                            <span>Edit Notice</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTogglePin(notice.id);
                              setActiveActionMenuId(null);
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-fg hover:bg-surface-2 transition-colors cursor-pointer"
                          >
                            <Pin className="w-3.5 h-3.5 text-amber-500" />
                            <span>{notice.pinned ? "Unpin Notice" : "Pin to Top"}</span>
                          </button>
                          <div className="my-1 border-t border-line" />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmDeleteId(notice.id);
                              setActiveActionMenuId(null);
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
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
            ))
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={"bg-canvas font-mono text-xs text-fg-muted border-b border-line"}>
                <th className="px-5 py-3 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={filteredNotices.length > 0 && selectedNoticeIds.length === filteredNotices.length}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 dark:border-line bg-white dark:bg-canvas text-brand focus:ring-brand"
                  />
                </th>
                <th className="px-4 py-3">Announcement</th>
                <th className="px-4 py-3">Target Audience</th>
                <th className="px-4 py-3">Attachments</th>
                <th className="px-4 py-3">Views &amp; Date</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-line">
              {filteredNotices.length === 0 ? (
                <tr>
                  <td colSpan={6} className={`px-6 py-12 text-center text-fg-muted text-xs font-medium`}>
                    No notices found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredNotices.map((notice) => (
                  <tr key={notice.id} className={"hover:bg-surface-2/60 border-b border-line transition-colors" + " group"}>
                    <td className="px-5 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedNoticeIds.includes(notice.id)}
                        onChange={() => toggleSelectNotice(notice.id)}
                        className="rounded border-slate-300 dark:border-line bg-white dark:bg-canvas text-brand focus:ring-brand"
                      />
                    </td>

                    <td className="px-4 py-3 max-w-md">
                      <div className="flex items-start gap-2.5">
                        <button
                          onClick={() => handleTogglePin(notice.id)}
                          title={notice.pinned ? "Unpin notice" : "Pin notice to top"}
                          className={`mt-0.5 p-1 rounded-md transition-colors cursor-pointer ${
                            notice.pinned 
                              ? 'text-amber-400 bg-amber-500/15 border border-amber-500/30' 
                              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                          }`}
                        >
                          <Pin className={`w-3.5 h-3.5 ${notice.pinned ? 'fill-amber-400' : ''}`} />
                        </button>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 bg-slate-100 dark:bg-surface-2 border border-slate-200 dark:border-line text-slate-700 dark:text-fg-muted rounded-md text-xs font-semibold">
                              {notice.category}
                            </span>
                            {notice.pinned && (
                              <span className="px-2 py-0.5 bg-amber-500/15 border border-amber-500/30 text-amber-500 dark:text-amber-300 rounded-md text-xs font-bold flex items-center gap-1">
                                Pinned
                              </span>
                            )}
                          </div>
                          <h4 
                            onClick={() => setViewingNotice(notice)}
                            className="text-xs font-bold text-slate-900 dark:text-fg hover:text-brand dark:hover:text-brand cursor-pointer line-clamp-1 transition-colors"
                          >
                            {notice.title}
                          </h4>
                          <p className={`text-xs text-fg-muted line-clamp-1 mt-0.5`}>
                            {notice.body}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold border ${
                        notice.target_role === 'student'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                          : notice.target_role === 'teacher'
                          ? 'bg-brand/10 text-brand dark:text-brand border-brand/20'
                          : 'bg-slate-100 dark:bg-surface-2 text-slate-700 dark:text-fg-muted border-slate-200 dark:border-line'
                      }`}>
                        <Users className="w-3 h-3" />
                        {notice.target_role === 'all' 
                          ? 'All Members' 
                          : notice.target_role === 'student' 
                          ? 'Students Only' 
                          : 'Faculty Only'}
                      </span>
                      {notice.department_name && notice.department_name !== 'Campus Wide' && (
                        <p className={`text-xs font-medium text-fg-muted mt-1`}>{notice.department_name}</p>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {notice.attachments && notice.attachments.length > 0 ? (
                        <div className="flex items-center gap-1.5 text-slate-700 dark:text-fg text-xs font-semibold">
                          <Paperclip className="w-3.5 h-3.5 text-brand" />
                          <span>{notice.attachments.length} file{notice.attachments.length > 1 ? 's' : ''}</span>
                        </div>
                      ) : (
                        <span className={`text-xs text-fg-muted`}>None</span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <div className="text-xs font-medium text-slate-800 dark:text-fg">
                        {notice.views || 142} reads
                      </div>
                      <div className={`text-xs text-fg-muted mt-0.5`}>
                        {new Date(notice.created_at).toLocaleDateString()}
                      </div>
                    </td>

                    <td className="px-5 py-3 text-right relative">
                      <div className="flex items-center justify-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveActionMenuId(activeActionMenuId === notice.id ? null : notice.id);
                          }}
                          title="Notice Actions"
                          aria-label="Notice Actions"
                          className="p-1.5 rounded-lg text-fg-muted hover:text-fg hover:bg-surface-2 transition-colors cursor-pointer"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {activeActionMenuId === notice.id && (
                          <>
                            <div 
                              className="fixed inset-0 z-20" 
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveActionMenuId(null);
                              }} 
                            />
                            <div className="absolute right-5 top-12 z-30 w-44 rounded-xl bg-surface border border-line shadow-lg p-1.5 text-left transition-all">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setViewingNotice(notice);
                                  setActiveActionMenuId(null);
                                }}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-fg hover:bg-surface-2 transition-colors cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5 text-fg-muted" />
                                <span>View Details</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenEdit(notice);
                                  setActiveActionMenuId(null);
                                }}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-fg hover:bg-surface-2 transition-colors cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-fg-muted" />
                                <span>Edit Notice</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTogglePin(notice.id);
                                  setActiveActionMenuId(null);
                                }}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-fg hover:bg-surface-2 transition-colors cursor-pointer"
                              >
                                <Pin className="w-3.5 h-3.5 text-amber-500" />
                                <span>{notice.pinned ? "Unpin Notice" : "Pin to Top"}</span>
                              </button>
                              <div className="my-1 border-t border-line" />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setConfirmDeleteId(notice.id);
                                  setActiveActionMenuId(null);
                                }}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW NOTICE DETAIL MODAL */}
      {viewingNotice && (
        <div className={"fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"}>
          <div className={`w-full max-w-xl rounded-[20px] bg-surface border border-line shadow-2xl p-6 max-h-[90vh] overflow-y-auto`}>
            <div className={`flex items-start justify-between pb-4 border-b border-line mb-4`}>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 bg-slate-100 dark:bg-surface-2 border border-slate-200 dark:border-line text-slate-700 dark:text-fg-muted rounded-md text-xs font-bold">
                    {viewingNotice.category}
                  </span>
                  {viewingNotice.pinned && (
                    <span className="px-2 py-0.5 bg-amber-500/15 border border-amber-500/30 text-amber-500 dark:text-amber-300 rounded-md text-xs font-bold flex items-center gap-1">
                      <Pin className="w-3 h-3 fill-amber-400" /> Pinned
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-fg">
                  {viewingNotice.title}
                </h3>
                <p className={`text-xs text-fg-muted mt-1`}>
                  Issued by {viewingNotice.author_name} • {new Date(viewingNotice.created_at).toLocaleString()}
                </p>
              </div>
              <button 
                onClick={() => setViewingNotice(null)} 
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-surface-2 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-2 text-xs text-slate-700 dark:text-fg leading-relaxed whitespace-pre-wrap">
              {viewingNotice.body}
            </div>

            {/* Attachments view */}
            {viewingNotice.attachments && viewingNotice.attachments.length > 0 && (
              <div className={`mt-5 pt-4 border-t border-line`}>
                <h4 className="text-xs font-bold text-slate-800 dark:text-fg mb-2 flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5 text-brand" /> Attached Official Documents
                </h4>
                <div className="space-y-1.5">
                  {viewingNotice.attachments.map((att, idx) => {
                    const name = att.includes('::') ? att.split('::')[0] : att.split('/').pop() || `Attachment ${idx + 1}`;
                    const url = att.includes('::') ? att.split('::')[1] : att;
                    return (
                      <div key={idx} className={`flex items-center justify-between p-2.5 rounded-xl bg-canvas border border-line text-xs`}>
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="w-4 h-4 text-brand shrink-0" />
                          <span className="font-semibold text-slate-800 dark:text-fg truncate">{name}</span>
                        </div>
                        <a 
                          href={url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-brand hover:underline font-semibold"
                        >
                          View / Download
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className={`flex justify-end gap-2.5 pt-4 border-t border-line mt-4`}>
              <button
                onClick={() => {
                  setViewingNotice(null);
                  handleOpenEdit(viewingNotice);
                }}
                className={`px-4 py-2 bg-canvas hover:bg-surface-2 text-fg border border-line rounded-xl font-semibold text-xs flex items-center gap-1.5`}
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit Notice
              </button>
              <button
                onClick={() => {
                  handleDeleteNotice(viewingNotice.id);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COMPOSE / EDIT NOTICE MODAL */}
      {isComposeOpen && (
        <div className={"fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"}>
          <div className={`w-full max-w-xl rounded-[20px] bg-surface border border-line shadow-2xl p-6 max-h-[90vh] overflow-y-auto`}>
            <div className={`flex items-center justify-between pb-3.5 border-b border-line mb-5`}>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-fg">
                  {editingNotice ? 'Edit University Notice' : 'Dispatch New Announcement'}
                </h3>
                <p className={`text-xs text-fg-muted mt-0.5`}>
                  Publish to campus dashboards and push notification services
                </p>
              </div>
              <button onClick={() => setIsComposeOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-surface-2 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNotice} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Notice Headline</label>
                <input 
                  type="text" 
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Schedule for 4th Semester Lab Examinations"
                  required
                  className={`w-full px-3.5 py-2 rounded-xl bg-canvas border border-line text-fg placeholder:text-fg-muted text-xs outline-hidden focus:border-brand`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select 
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className={`w-full px-3.5 py-2 rounded-xl bg-canvas border border-line text-fg text-xs outline-hidden focus:border-brand cursor-pointer`}
                  >
                    <option value="Academics">Academics</option>
                    <option value="Administrative">Administrative</option>
                    <option value="Exams">Exams</option>
                    <option value="Events">Events</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Audience</label>
                  <select 
                    value={formTargetRole}
                    onChange={(e) => setFormTargetRole(e.target.value as NoticeTargetRole)}
                    className={`w-full px-3.5 py-2 rounded-xl bg-canvas border border-line text-fg text-xs outline-hidden focus:border-brand cursor-pointer`}
                  >
                    <option value="all">Everyone (All Campus)</option>
                    <option value="student">Students Only</option>
                    <option value="teacher">Faculty Only</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Department Scope</label>
                  {isDeptAdmin ? (
                    <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-surface-2 border border-slate-200 dark:border-line text-xs font-bold text-slate-700 dark:text-fg-muted">
                      <Lock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>{adminDepartmentName || 'Department'} (Governed)</span>
                    </div>
                  ) : (
                    <select 
                      value={formDeptId}
                      onChange={(e) => setFormDeptId(e.target.value)}
                      className={`w-full px-3.5 py-2 rounded-xl bg-canvas border border-line text-fg text-xs outline-hidden focus:border-brand cursor-pointer`}
                    >
                      <option value="">Campus Wide (All Departments)</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>{dept.name} ({dept.code})</option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="flex flex-col justify-end">
                  <label className={`flex items-center gap-2 p-2 rounded-xl bg-canvas border border-line cursor-pointer`}>
                    <input 
                      type="checkbox"
                      checked={formPinned}
                      onChange={(e) => setFormPinned(e.target.checked)}
                      className="rounded border-slate-300 dark:border-line bg-white dark:bg-canvas text-brand focus:ring-brand"
                    />
                    <span className="text-xs font-semibold text-slate-800 dark:text-fg flex items-center gap-1.5">
                      <Pin className="w-3.5 h-3.5 text-amber-400" /> Pin announcement to top
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Announcement Body</label>
                <textarea 
                  rows={5}
                  value={formBody}
                  onChange={(e) => setFormBody(e.target.value)}
                  placeholder="Enter complete notice text and details..."
                  required
                  className={`w-full px-3.5 py-2 rounded-xl bg-canvas border border-line text-fg placeholder:text-fg-muted text-xs outline-hidden focus:border-brand resize-none`}
                ></textarea>
              </div>

              {/* Attachments Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    File Attachments (PDF / Image to Supabase Storage)
                  </label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-semibold text-brand hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3 h-3" /> Upload File
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange}
                    accept=".pdf,image/png,image/jpeg,image/webp"
                    className="hidden" 
                  />
                </div>

                {formAttachments.length > 0 ? (
                  <div className="space-y-1.5">
                    {formAttachments.map((att, idx) => {
                      const name = att.includes('::') ? att.split('::')[0] : att.split('/').pop() || `File ${idx + 1}`;
                      return (
                        <div key={idx} className={`flex items-center justify-between p-2.5 rounded-xl bg-canvas border border-line text-xs`}>
                          <span className="font-semibold text-slate-800 dark:text-fg truncate max-w-xs">{name}</span>
                          <button 
                            type="button" 
                            onClick={() => removeAttachment(idx)}
                            className="text-rose-500 hover:text-rose-400 cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-4 border border-dashed border-line rounded-xl text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-surface-2 transition-colors`}
                  >
                    <Paperclip className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                    <p className={`text-xs font-medium text-fg-muted`}>Click to attach circular PDFs, examination routines, or flyers</p>
                  </div>
                )}
              </div>

              <div className={`pt-4 flex justify-end gap-2.5 border-t border-line mt-5`}>
                <button
                  type="button"
                  onClick={() => setIsComposeOpen(false)}
                  className={`px-4 py-2 bg-canvas hover:bg-surface-2 text-fg border border-line rounded-xl font-semibold text-xs`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 bg-brand text-white hover:bg-brand-hover rounded-xl font-bold text-xs`}
                >
                  {editingNotice ? 'Update Announcement' : 'Publish Broadcast'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {confirmDeleteId && (
        <div className={"fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"}>
          <div className={`w-full max-w-md rounded-[20px] bg-surface border border-line shadow-2xl p-6 border-rose-500/30 text-center`}>
            <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-3.5">
              <Trash2 className="w-5 h-5 text-rose-500" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-fg mb-1.5">
              Delete Announcement Broadcast?
            </h3>
            <p className={`text-xs text-fg-muted mb-5 leading-relaxed`}>
              This notice will be permanently deleted from the student noticeboard and administrative records.
            </p>
            <div className="flex items-center justify-center gap-2.5">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className={`px-4 py-2 bg-canvas hover:bg-surface-2 text-fg border border-line rounded-xl font-semibold text-xs`}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteNotice(confirmDeleteId)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
