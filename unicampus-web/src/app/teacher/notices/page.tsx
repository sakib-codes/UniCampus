"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  Megaphone, 
  Search, 
  Pin, 
  Eye, 
  Paperclip, 
  FileText, 
  ChevronRight, 
  X, 
  Filter,
  CheckCircle2,
  Calendar,
  Building2
} from "lucide-react";
import { adminService } from "@/lib/services/adminService";
import { Notice } from "@/types/admin";
import { themeTokens } from "@/lib/theme";
import SpotlightCard from "@/components/bits/SpotlightCard";
import ClickSpark from "@/components/bits/ClickSpark";
import DecryptedText from "@/components/bits/DecryptedText";

export default function TeacherNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTab, setActiveTab] = useState<"all" | "faculty" | "pinned">("all");
  const [viewingNotice, setViewingNotice] = useState<Notice | null>(null);

  useEffect(() => {
    // Only fetch notices targeted to teachers or campus-wide
    const allNotices = adminService.getNotices();
    const facultyRelevant = allNotices.filter(
      (n) => n.target_role === "teacher" || n.target_role === "all"
    );
    setNotices(facultyRelevant);
  }, []);

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
  const facultyExclusiveCount = notices.filter((n) => n.target_role === "teacher").length;

  return (
    <div className="w-full space-y-6 pb-16">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 uppercase tracking-wider">
              FACULTY DIRECTIVES
            </span>
            <span className="text-xs text-slate-400 dark:text-[#6E747D] font-mono">• Academic Governance</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-[#F0F6FC] tracking-tight">
            Official Notices &amp; Circulars
          </h1>
          <p className="text-xs font-medium text-slate-500 dark:text-[#8D96A0] mt-0.5">
            Administrative mandates, exam controller notifications, and institutional broadcasts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-slate-500 dark:text-[#8D96A0] px-3 py-1.5 bg-slate-100 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] rounded-xl">
            {notices.length} Active Circulars
          </span>
        </div>
      </div>

      {/* Tabs & Search Filter */}
      <div className={`${themeTokens.card} p-4 flex flex-col md:flex-row gap-4 items-center justify-between`}>
        {/* Tabs */}
        <div className={`flex items-center gap-1.5 ${themeTokens.tabTrack} w-full md:w-auto overflow-x-auto`}>
          <ClickSpark sparkColor="#1D5BD8" sparkCount={5} sparkRadius={16}>
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "all" ? themeTokens.tabActive : themeTokens.tabInactive
              }`}
            >
              All Bulletins ({notices.length})
            </button>
          </ClickSpark>
          <ClickSpark sparkColor="#3b82f6" sparkCount={5} sparkRadius={16}>
            <button
              onClick={() => setActiveTab("faculty")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "faculty" ? themeTokens.tabActive : themeTokens.tabInactive
              }`}
            >
              Faculty Exclusive ({facultyExclusiveCount})
            </button>
          </ClickSpark>
          <ClickSpark sparkColor="#f59e0b" sparkCount={5} sparkRadius={16}>
            <button
              onClick={() => setActiveTab("pinned")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === "pinned"
                  ? "bg-amber-500/20 text-amber-500 dark:text-amber-300 border border-amber-500/35"
                  : "text-amber-600/80 dark:text-amber-400/80 hover:text-amber-500"
              }`}
            >
              <Pin className="w-3.5 h-3.5" />
              <span>Priority Pinned ({pinnedCount})</span>
            </button>
          </ClickSpark>
        </div>

        {/* Search & Category */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className={`w-3.5 h-3.5 ${themeTokens.textMuted} absolute left-3 top-1/2 -translate-y-1/2`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search circulars..."
              className={`w-full pl-8 pr-3 py-2 ${themeTokens.input} text-xs`}
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`w-full sm:w-40 px-3 py-2 ${themeTokens.select} text-xs font-semibold cursor-pointer`}
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
          <SpotlightCard
            key={notice.id}
            onClick={() => setViewingNotice(notice)}
            className={`${themeTokens.card} p-5 flex flex-col justify-between hover:border-slate-400 dark:hover:border-[#6E747D] transition-all cursor-pointer group relative overflow-hidden`}
            spotlightColor="rgba(99, 102, 241, 0.12)"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] uppercase tracking-wider ${
                    notice.target_role === 'teacher'
                      ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                      : 'bg-slate-100 dark:bg-[#161B22] text-slate-600 dark:text-[#8D96A0] border border-slate-200 dark:border-[#30363D]'
                  }`}>
                    {notice.target_role === 'teacher' ? 'Faculty Circular' : 'Campus Wide'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-brand/10 text-brand font-mono font-bold text-[10px]">
                    {notice.category}
                  </span>
                </div>

                {notice.pinned && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                    <Pin className="w-3 h-3 fill-amber-500" /> Pinned
                  </span>
                )}
              </div>

              <h3 className="font-bold text-sm text-slate-900 dark:text-[#F0F6FC] group-hover:text-brand transition-colors line-clamp-2 leading-snug mb-2">
                {notice.title}
              </h3>

              <p className={`text-xs ${themeTokens.textMuted} line-clamp-3 leading-relaxed mb-4`}>
                {notice.body}
              </p>
            </div>

            <div className={`pt-3 border-t ${themeTokens.border} flex items-center justify-between text-[11px]`}>
              <div className="flex items-center gap-2 text-slate-400 dark:text-[#6E747D]">
                <span>{notice.author_name}</span>
                <span>•</span>
                <span>{new Date(notice.created_at).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center gap-2">
                {notice.attachments && notice.attachments.length > 0 && (
                  <span className="flex items-center gap-1 text-slate-500 font-mono font-bold text-[10px]">
                    <Paperclip className="w-3 h-3 text-brand" /> {notice.attachments.length}
                  </span>
                )}
                <span className="text-brand font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Read <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </SpotlightCard>
        ))}
      </div>

      {/* Notice Detail View Modal */}
      {viewingNotice && (
        <div className={themeTokens.modalOverlay}>
          <div className={`w-full max-w-xl ${themeTokens.modalBox} p-6 max-h-[90vh] overflow-y-auto space-y-4`}>
            <div className={`flex items-start justify-between pb-3.5 border-b ${themeTokens.border}`}>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 bg-brand/10 text-brand rounded text-[10px] font-mono font-bold uppercase">
                    {viewingNotice.category}
                  </span>
                  {viewingNotice.pinned && (
                    <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 rounded text-[10px] font-bold flex items-center gap-1">
                      <Pin className="w-3 h-3 fill-amber-500" /> Pinned
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-[#F0F6FC]">
                  {viewingNotice.title}
                </h3>
                <p className={`text-xs ${themeTokens.textMuted} mt-1`}>
                  Issued by {viewingNotice.author_name} • {new Date(viewingNotice.created_at).toLocaleDateString()}
                </p>
              </div>

              <button
                onClick={() => setViewingNotice(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-[#161B22] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-700 dark:text-[#F0F6FC] leading-relaxed whitespace-pre-wrap py-2">
              {viewingNotice.body}
            </div>

            {viewingNotice.attachments && viewingNotice.attachments.length > 0 && (
              <div className={`pt-4 border-t ${themeTokens.border}`}>
                <h4 className="text-xs font-bold text-slate-800 dark:text-[#F0F6FC] mb-2 flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5 text-brand" /> Attached Circular Documents
                </h4>
                <div className="space-y-1.5">
                  {viewingNotice.attachments.map((att, idx) => {
                    const name = att.includes("::") ? att.split("::")[0] : att.split("/").pop() || `Document ${idx + 1}`;
                    const url = att.includes("::") ? att.split("::")[1] : att;
                    return (
                      <div key={idx} className={`flex items-center justify-between p-2.5 ${themeTokens.cardRecessed} text-xs rounded-xl`}>
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="w-4 h-4 text-brand shrink-0" />
                          <span className="font-semibold text-slate-800 dark:text-[#F0F6FC] truncate">{name}</span>
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
                onClick={() => setViewingNotice(null)}
                className={`px-4 py-2 ${themeTokens.btnSecondary} text-xs font-bold`}
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

