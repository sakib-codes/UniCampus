"use client";

import { useState, useMemo } from "react";
import ProfileAvatar from "@/components/common/ProfileAvatar";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Search, 
  Mail, 
  MapPin, 
  Calendar, 
  MessageSquare, 
  Phone, 
  Crown, 
  GraduationCap, 
  Building2, 
  Check, 
  Copy,
  BookOpen,
  Clock,
  Sparkles
} from "lucide-react";
import { themeTokens, SPOTLIGHT } from "@/lib/theme";
import SpotlightCard from "@/components/bits/SpotlightCard";
import BlurText from "@/components/bits/BlurText";
import FadeIn from "@/components/bits/FadeIn";
import StatCard from "@/components/common/StatCard";
import SectionPanel from "@/components/common/SectionPanel";
import SegmentedTabs from "@/components/common/SegmentedTabs";
import { FACULTY_MEMBERS, FacultyStatus } from "@/lib/facultyData";

const filterCategories = [
  { id: "all", label: "All Faculty" },
  { id: "leadership", label: "Leadership" },
  { id: "CSE", label: "Computer Science (CSE)" },
  { id: "EEE", label: "Electrical (EEE)" },
  { id: "BBA", label: "Business (BBA)" },
  { id: "MAT", label: "Mathematics & Sciences" },
  { id: "ENG", label: "English & Humanities" },
  { id: "available", label: "Available Now" },
];

export default function TeachersPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getStatusBadge = (status: FacultyStatus) => {
    switch (status) {
      case "In Office":
        return {
          dot: "bg-emerald-500",
          text: "text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/25",
        };
      case "In Class":
        return {
          dot: "bg-amber-500",
          text: "text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-500/25",
        };
      case "In Meeting":
        return {
          dot: "bg-purple-500",
          text: "text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-500/25",
        };
      case "Online Consultation":
        return {
          dot: "bg-blue-500",
          text: "text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-500/25",
        };
      case "On Leave":
        return {
          dot: "bg-slate-400",
          text: "text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700",
        };
    }
  };

  // Filtered list based on search and active tab
  const filteredFaculty = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return FACULTY_MEMBERS.filter((member) => {
      const matchesSearch =
        q === "" ||
        member.name.toLowerCase().includes(q) ||
        member.role.toLowerCase().includes(q) ||
        member.department.toLowerCase().includes(q) ||
        member.email.toLowerCase().includes(q) ||
        member.phone.toLowerCase().includes(q) ||
        member.facultyCode.toLowerCase().includes(q) ||
        member.courses.some((c) => c.title.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)) ||
        (member.executivePortfolios && member.executivePortfolios.some((p) => p.toLowerCase().includes(q)));

      if (!matchesSearch) return false;

      if (activeCategory === "all") return true;
      if (activeCategory === "leadership") return member.category === "leadership";
      if (activeCategory === "CSE") return member.departmentCode === "CSE" || member.departmentCode === "AI";
      if (activeCategory === "EEE") return member.departmentCode === "EEE";
      if (activeCategory === "BBA") return member.departmentCode === "BBA";
      if (activeCategory === "MAT") return member.departmentCode === "MAT";
      if (activeCategory === "ENG") return member.departmentCode === "ENG";
      if (activeCategory === "available") return member.status === "In Office" || member.status === "Online Consultation";

      return true;
    });
  }, [searchQuery, activeCategory]);

  // Separate executive leadership from general faculty for featured layout
  const executiveLeaders = useMemo(() => {
    return filteredFaculty.filter((f) => f.isLeadership);
  }, [filteredFaculty]);

  const academicFaculty = useMemo(() => {
    return filteredFaculty.filter((f) => !f.isLeadership);
  }, [filteredFaculty]);

  // Quick statistics
  const stats = useMemo(() => {
    return {
      total: FACULTY_MEMBERS.length,
      leadership: FACULTY_MEMBERS.filter((f) => f.isLeadership).length,
      inOffice: FACULTY_MEMBERS.filter((f) => f.status === "In Office" || f.status === "Online Consultation").length,
      departments: 5,
    };
  }, []);

  return (
    <div className="w-full space-y-8 pb-20">
      {/* Page Header */}
      <FadeIn delay={0.05} direction="down">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-1">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 dark:bg-brand/20 border border-brand/20 text-brand text-xs font-bold uppercase tracking-wider mb-2">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Institutional Governance &amp; Faculty Roster</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-[#F0F6FC] tracking-tight">
              <BlurText text="Faculty &amp; Leadership Directory" delay={0.04} />
            </h1>
            <p className="text-sm font-medium text-slate-500 dark:text-[#8D96A0] mt-1 max-w-2xl">
              Official institutional directory of Chairman, Principal, Vice Principal, and department-wise professors with direct phone extensions, verified email addresses, and office locations.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-[#6E747D]" />
            <input
              type="text"
              aria-label="Search faculty by name, phone, email, or course"
              placeholder="Search name, phone, email, course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 ${themeTokens.input} rounded-2xl text-sm shadow-xs focus:ring-2 focus:ring-brand`}
            />
            {searchQuery && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-[#F0F6FC] cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </FadeIn>

      {/* KPI Stats Bar */}
      <FadeIn delay={0.1}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            label="Total Faculty"
            value={stats.total}
            icon={Building2}
            iconColor="text-brand"
            iconBg="bg-brand/10 dark:bg-brand/20"
          />
          <StatCard
            label="Executive Leaders"
            value={stats.leadership}
            icon={Crown}
            iconColor="text-amber-500"
            iconBg="bg-amber-500/10 dark:bg-amber-500/20"
          />
          <StatCard
            label="Academic Depts"
            value={stats.departments}
            icon={GraduationCap}
            iconColor="text-indigo-500"
            iconBg="bg-indigo-500/10 dark:bg-indigo-500/20"
          />
          <StatCard
            label="Available In Office"
            value={stats.inOffice}
            icon={Clock}
            iconColor="text-emerald-500"
            iconBg="bg-emerald-500/10 dark:bg-emerald-500/20"
          />
        </div>
      </FadeIn>

      {/* Filter Tabs using SegmentedTabs */}
      <SegmentedTabs
        tabs={filterCategories}
        activeId={activeCategory}
        onChange={setActiveCategory}
      />

      {/* SECTION 1: EXECUTIVE LEADERSHIP (Shown when 'all' or 'leadership' is active and matches search) */}
      {(activeCategory === "all" || activeCategory === "leadership") && executiveLeaders.length > 0 && (
        <SectionPanel
          title="Executive Leadership & Governance"
          subtitle="Chairman, Principal, Vice Principal & Academic Leadership"
          icon={Crown}
          iconColor="text-amber-500"
          iconBg="bg-amber-500/10 dark:bg-amber-500/20"
          action={
            <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              Institutional Council
            </span>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {executiveLeaders.map((leader, idx) => {
              const statusStyle = getStatusBadge(leader.status);

              return (
                <motion.div
                  key={leader.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full"
                >
                  <SpotlightCard
                    className={`${themeTokens.card3xl} p-6 h-full flex flex-col justify-between border-slate-200 dark:border-[#30363D] hover:border-amber-400/50 dark:hover:border-amber-400/40 hover:shadow-[0_12px_32px_-4px_rgba(245,158,11,0.08)] dark:hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.12)] transition-all duration-300 shadow-xs group relative overflow-hidden`}
                    spotlightColor="rgba(245, 158, 11, 0.08)"
                    borderGlowColor="rgba(245, 158, 11, 0.3)"
                  >
                    <div>
                      {/* Top Row: Avatar + Designation + Status */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="relative shrink-0">
                            <ProfileAvatar
                              className="w-14 h-14 rounded-2xl border-2 border-amber-400/30 dark:border-amber-500/30 group-hover:border-amber-400/60 group-hover:scale-105 transition-all shadow-xs bg-amber-500/5 dark:bg-[#161B22]"
                              iconClassName="w-7 h-7 text-amber-500/80 dark:text-amber-400/80"
                            />
                            <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-white dark:bg-[#0D1117] shadow-xs">
                              <span className="w-4 h-4 rounded-full bg-amber-500/15 dark:bg-amber-500/25 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                                <Crown className="w-2.5 h-2.5" />
                              </span>
                            </span>
                          </div>
                          <div className="min-w-0">
                            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                              <Sparkles className="w-3 h-3" />
                              {leader.designationCategory}
                            </span>
                            <h3 className="font-extrabold text-slate-900 dark:text-[#F0F6FC] text-base leading-snug mt-1 truncate" title={leader.name}>
                              {leader.name}
                            </h3>
                            <p className="text-xs font-medium text-slate-500 dark:text-[#8D96A0] mt-0.5 truncate" title={leader.role}>
                              {leader.role}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${statusStyle.text}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot} animate-pulse`} />
                          {leader.status}
                        </span>
                      </div>

                      {/* Department Tag & Code */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-mono text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          {leader.facultyCode}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-[#8D96A0] font-medium truncate" title={leader.department}>
                          {leader.department}
                        </span>
                      </div>

                      {/* Contact Block: Phone, Email, Office with Quick Copy */}
                      <div className={`space-y-2 py-3 border-y ${themeTokens.border} text-xs text-slate-600 dark:text-[#8D96A0]`}>
                        {/* Direct Phone */}
                        <div className="flex items-center justify-between group/field">
                          <div className="flex items-center gap-2 min-w-0">
                            <Phone className="w-3.5 h-3.5 text-slate-400 dark:text-[#6E747D] group-hover/field:text-brand transition-colors shrink-0" />
                            <a
                              href={`tel:${leader.phone.replace(/[^0-9+]/g, "")}`}
                              className="font-mono text-[11px] font-semibold text-slate-700 dark:text-[#F0F6FC] hover:text-brand transition-colors truncate"
                              title="Click to call"
                            >
                              {leader.phone}
                            </a>
                          </div>
                          <button
                            type="button"
                            aria-label={`Copy phone number for ${leader.name}`}
                            onClick={() => copyToClipboard(leader.phone, `phone-${leader.id}`)}
                            className="text-[10px] text-slate-400 hover:text-brand px-1.5 py-0.5 rounded hover:bg-slate-100 dark:hover:bg-[#161B22] transition-colors cursor-pointer"
                            title="Copy phone"
                          >
                            {copiedField === `phone-${leader.id}` ? (
                              <Check className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>

                        {/* Official Email */}
                        <div className="flex items-center justify-between group/field">
                          <div className="flex items-center gap-2 min-w-0">
                            <Mail className="w-3.5 h-3.5 text-slate-400 dark:text-[#6E747D] group-hover/field:text-brand transition-colors shrink-0" />
                            <a
                              href={`mailto:${leader.email}`}
                              className="text-[11px] text-slate-700 dark:text-[#8D96A0] hover:text-brand transition-colors truncate"
                              title="Click to send email"
                            >
                              {leader.email}
                            </a>
                          </div>
                          <button
                            type="button"
                            aria-label={`Copy email address for ${leader.name}`}
                            onClick={() => copyToClipboard(leader.email, `email-${leader.id}`)}
                            className="text-[10px] text-slate-400 hover:text-brand px-1.5 py-0.5 rounded hover:bg-slate-100 dark:hover:bg-[#161B22] transition-colors cursor-pointer"
                            title="Copy email"
                          >
                            {copiedField === `email-${leader.id}` ? (
                              <Check className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>

                        {/* Office Room */}
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-[#6E747D] shrink-0" />
                          <span className="font-mono text-[11px] font-medium text-slate-700 dark:text-[#F0F6FC] truncate">
                            {leader.office}
                          </span>
                        </div>
                      </div>

                      {/* Executive Portfolios / Focus Areas */}
                      {leader.executivePortfolios && (
                        <div className="mt-3.5 space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-400 dark:text-[#6E747D] uppercase tracking-wider block">
                            Institutional Portfolios:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {leader.executivePortfolios.map((portfolio, pIdx) => (
                              <span
                                key={pIdx}
                                className="px-2 py-0.5 bg-slate-100 dark:bg-[#161B22] text-slate-700 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-[#F0F6FC] rounded-md text-[10px] font-medium border border-slate-200 dark:border-[#30363D] transition-colors"
                              >
                                {portfolio}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions Grid */}
                    <div className="mt-5 pt-3 border-t border-slate-100 dark:border-[#21262D] grid grid-cols-2 gap-2">
                      <Link
                        href={`/teachers/${leader.id}`}
                        className={`w-full py-2.5 px-3 ${themeTokens.btnSecondary} hover:bg-slate-200 dark:hover:bg-[#30363D] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer shadow-2xs active:scale-[0.98]`}
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Profile</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() =>
                          window.dispatchEvent(
                            new CustomEvent("open-messaging", {
                              detail: { peerName: leader.name },
                            })
                          )
                        }
                        className="w-full py-2.5 px-3 bg-brand hover:bg-brand-hover text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer shadow-xs active:scale-[0.98]"
                        title={`Message ${leader.name}`}
                        aria-label={`Message ${leader.name}`}
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Message</span>
                      </button>
                    </div>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </div>
        </SectionPanel>
      )}

      {/* SECTION 2: DEPARTMENT-WISE ACADEMIC FACULTY */}
      {(activeCategory === "all" || activeCategory !== "leadership") && (
        <SectionPanel
          title="Department Faculty &amp; Professors"
          subtitle="Heads of Department, Professors, Lecturers &amp; Course Instructors"
          icon={BookOpen}
          action={
            <span className="text-xs font-mono font-bold text-brand bg-brand/10 px-2.5 py-1 rounded-full border border-brand/20">
              {academicFaculty.length} Instructors
            </span>
          }
        >
          {/* Empty State */}
          {filteredFaculty.length === 0 && (
            <div className={`${themeTokens.card3xl} p-12 text-center space-y-3`}>
              <Search className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-900 dark:text-[#F0F6FC]">
                No faculty members found
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#8D96A0] max-w-sm mx-auto">
                We couldn&apos;t find any faculty members matching &quot;{searchQuery}&quot;. Try searching with another name, course, or department.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
                className="mt-2 text-xs font-bold text-brand hover:underline cursor-pointer"
              >
                Reset all filters
              </button>
            </div>
          )}

          {/* Academic Faculty Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {academicFaculty.map((teacher, idx) => {
              const statusStyle = getStatusBadge(teacher.status);

              return (
                <motion.div
                  key={teacher.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.04, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full"
                >
                  <SpotlightCard
                    className={`${themeTokens.card3xl} p-6 h-full flex flex-col justify-between hover:border-slate-300 dark:hover:border-[#6E747D]/80 hover:shadow-[0_12px_32px_-4px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_0_35px_-5px_rgba(37, 99, 235,0.18)] transition-all duration-300 group`}
                    spotlightColor={SPOTLIGHT.wash}
                    borderGlowColor={SPOTLIGHT.glow}
                  >
                  <div>
                    {/* Top Avatar & Status Row */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <ProfileAvatar
                          className="w-14 h-14 rounded-2xl border-2 border-slate-100 dark:border-[#30363D] shrink-0 group-hover:border-brand/40 group-hover:scale-105 transition-all shadow-xs bg-white dark:bg-[#161B22]"
                          iconClassName="w-7 h-7"
                        />
                        <div className="min-w-0">
                          <h3 className="font-bold text-slate-900 dark:text-[#F0F6FC] text-base leading-snug truncate" title={teacher.name}>
                            {teacher.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-mono text-[10px] font-bold text-brand bg-brand/10 dark:text-brand px-1.5 py-0.2 rounded border border-brand/20">
                              {teacher.facultyCode}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-[#8D96A0] font-medium truncate max-w-[140px]" title={teacher.role}>
                              {teacher.role}
                            </span>
                          </div>
                        </div>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${statusStyle.text}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                        {teacher.status}
                      </span>
                    </div>

                    {/* Department Badge */}
                    <div className="mb-3">
                      <span className="inline-block text-[11px] font-semibold text-slate-600 dark:text-[#8D96A0] bg-slate-100 dark:bg-[#161B22] px-2.5 py-1 rounded-lg border border-slate-200 dark:border-[#30363D]">
                        {teacher.department}
                      </span>
                    </div>

                    {/* Contact Info Block: Phone, Email, Office */}
                    <div className={`space-y-2 py-3 border-y ${themeTokens.border} text-xs text-slate-600 dark:text-[#8D96A0]`}>
                      {/* Direct Phone */}
                      <div className="flex items-center justify-between group/field">
                        <div className="flex items-center gap-2 min-w-0">
                          <Phone className="w-3.5 h-3.5 text-slate-400 dark:text-[#6E747D] shrink-0 group-hover/field:text-brand transition-colors" />
                          <a
                            href={`tel:${teacher.phone.replace(/[^0-9+]/g, "")}`}
                            className="font-mono text-[11px] font-semibold text-slate-700 dark:text-[#F0F6FC] hover:text-brand transition-colors truncate"
                            title="Click to call"
                          >
                            {teacher.phone}
                          </a>
                        </div>
                        <button
                          type="button"
                          aria-label={`Copy phone number for ${teacher.name}`}
                          onClick={() => copyToClipboard(teacher.phone, `phone-${teacher.id}`)}
                          className="text-[10px] text-slate-400 hover:text-brand px-1.5 py-0.5 rounded hover:bg-slate-100 dark:hover:bg-[#161B22] transition-colors cursor-pointer"
                          title="Copy phone"
                        >
                          {copiedField === `phone-${teacher.id}` ? (
                            <Check className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>

                      {/* Email Address */}
                      <div className="flex items-center justify-between group/field">
                        <div className="flex items-center gap-2 min-w-0">
                          <Mail className="w-3.5 h-3.5 text-slate-400 dark:text-[#6E747D] shrink-0 group-hover/field:text-brand transition-colors" />
                          <a
                            href={`mailto:${teacher.email}`}
                            className="text-[11px] text-slate-700 dark:text-[#8D96A0] hover:text-brand transition-colors truncate"
                            title="Click to email"
                          >
                            {teacher.email}
                          </a>
                        </div>
                        <button
                          type="button"
                          aria-label={`Copy email address for ${teacher.name}`}
                          onClick={() => copyToClipboard(teacher.email, `email-${teacher.id}`)}
                          className="text-[10px] text-slate-400 hover:text-brand px-1.5 py-0.5 rounded hover:bg-slate-100 dark:hover:bg-[#161B22] transition-colors cursor-pointer"
                          title="Copy email"
                        >
                          {copiedField === `email-${teacher.id}` ? (
                            <Check className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>

                      {/* Office Room */}
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-[#6E747D] shrink-0" />
                        <span className="font-mono text-[11px] font-medium text-slate-700 dark:text-[#F0F6FC] truncate">
                          {teacher.office}
                        </span>
                      </div>
                    </div>

                    {/* Courses Tags */}
                    <div className="mt-3.5">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-[#6E747D] uppercase tracking-wider block mb-1.5">
                        Assigned Courses:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {teacher.courses.map((course, cIdx) => (
                          <span
                            key={cIdx}
                            className={`px-2 py-0.5 ${themeTokens.cardRecessed} text-slate-700 dark:text-[#F0F6FC] rounded-lg text-[10px] font-medium border border-slate-200/60 dark:border-[#30363D]/60`}
                          >
                            <span className="font-bold text-brand mr-1">{course.code}</span>
                            {course.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-5 pt-3 border-t border-slate-100 dark:border-[#21262D] grid grid-cols-2 gap-2">
                    <Link
                      href={`/teachers/${teacher.id}`}
                      className={`w-full py-2.5 px-3 ${themeTokens.btnSecondary} hover:bg-slate-200 dark:hover:bg-[#30363D] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer shadow-2xs active:scale-[0.98]`}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Profile</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() =>
                        window.dispatchEvent(
                          new CustomEvent("open-messaging", {
                            detail: { peerName: teacher.name },
                          })
                        )
                      }
                      className="w-full py-2.5 px-3 bg-brand/10 hover:bg-brand text-brand hover:text-white dark:bg-brand/15 dark:text-brand dark:hover:bg-brand dark:hover:text-white border border-brand/20 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer shadow-2xs active:scale-[0.98]"
                      title={`Message ${teacher.name}`}
                      aria-label={`Message ${teacher.name}`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Message</span>
                    </button>
                  </div>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </div>
      </SectionPanel>
      )}
    </div>
  );
}
