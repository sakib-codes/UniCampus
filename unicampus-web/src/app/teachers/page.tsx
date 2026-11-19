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
  BookOpen,
  Clock
} from "lucide-react";
import StatCard from "@/components/common/StatCard";
import SectionPanel from "@/components/common/SectionPanel";
import SegmentedTabs from "@/components/common/SegmentedTabs";
import { FACULTY_MEMBERS, FacultyStatus } from "@/lib/facultyData";
import { CAMPUS_METRICS } from "@/lib/canonicalCampus";

const filterCategories = [
  { id: "all", label: "All Faculty" },
  { id: "leadership", label: "Leadership" },
  { id: "CSE", label: "Computer Science (CSE)" },
  { id: "EEE", label: "Electrical (EEE)" },
  { id: "BBA", label: "Business (BBA)" },
  { id: "PHARM", label: "Pharmacy (PHARM)" },
  { id: "ENG", label: "English & Humanities" },
  { id: "available", label: "Available Now" },
];

export default function TeachersPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

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
      if (activeCategory === "PHARM") return member.departmentCode === "PHARM";
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
      departments: CAMPUS_METRICS.departmentsCount,
    };
  }, []);

  return (
    <div className="w-full space-y-8 pb-20">
      {/* Page Header */}
      <div className="w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-1">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 dark:bg-brand/20 border border-brand/20 text-brand text-xs font-bold mb-2">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Institutional Governance &amp; Faculty Roster</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-fg tracking-tight">
              Faculty &amp; Leadership Directory
            </h1>
            <p className="text-sm font-medium text-fg-muted mt-1 max-w-2xl">
              Official institutional directory of Chairman, Principal, Vice Principal, and department-wise professors with direct phone extensions, verified email addresses, and office locations.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-muted" />
            <input
              type="text"
              aria-label="Search faculty by name, phone, email, or course"
              placeholder="Search name, phone, email, course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-canvas border border-line text-fg placeholder:text-fg-muted rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            />
            {searchQuery && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-fg-muted hover:text-fg cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="w-full">
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
      </div>

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
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
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
                  <div className="bg-surface border border-line rounded-[20px] p-5 sm:p-6 h-full flex flex-col justify-between hover:border-brand/40 transition-colors duration-150 group">
                    <div>
                      {/* Top Row: Avatar + Designation + Status */}
                      <div className="flex flex-wrap items-start justify-between gap-2.5 mb-4">
                        <div className="flex items-center gap-3.5 min-w-0 flex-1">
                          <div className="relative shrink-0">
                            <ProfileAvatar
                              className="w-14 h-14 rounded-2xl border-2 border-amber-400/30 dark:border-amber-500/30 group-hover:border-amber-400/60 group-hover:scale-105 transition-all bg-amber-500/5 dark:bg-surface-2"
                              iconClassName="w-7 h-7 text-amber-500/80 dark:text-amber-400/80"
                            />
                            <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-surface border border-line">
                              <span className="w-4 h-4 rounded-full bg-amber-500/15 dark:bg-amber-500/25 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                                <Crown className="w-2.5 h-2.5" />
                              </span>
                            </span>
                          </div>
                          <div className="min-w-0">
                            <span className="inline-flex items-center gap-1 text-xs font-extrabold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                              {leader.designationCategory}
                            </span>
                            <h3 className="font-extrabold text-fg text-base leading-snug mt-1 truncate" title={leader.name}>
                              {leader.name}
                            </h3>
                            <p className="text-xs font-medium text-fg-muted mt-0.5 truncate" title={leader.role}>
                              {leader.role}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${statusStyle.text}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                          {leader.status}
                        </span>
                      </div>

                      {/* Department Tag & Code */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          {leader.facultyCode}
                        </span>
                        <span className="text-xs text-fg-muted font-medium truncate" title={leader.department}>
                          {leader.department}
                        </span>
                      </div>

                      {/* Contact Block: Phone, Email, Office with Direct Links */}
                      <div className="space-y-2 py-3 border-y border-line text-xs text-fg-muted">
                        {/* Direct Phone */}
                        <div className="flex items-center gap-2 min-w-0">
                          <Phone className="w-3.5 h-3.5 text-fg-muted shrink-0" />
                          <a
                            href={`tel:${leader.phone.replace(/[^0-9+]/g, "")}`}
                            className="font-mono text-xs font-semibold text-fg hover:text-brand transition-colors truncate"
                            title="Click to call"
                          >
                            {leader.phone}
                          </a>
                        </div>

                        {/* Official Email */}
                        <div className="flex items-center gap-2 min-w-0">
                          <Mail className="w-3.5 h-3.5 text-fg-muted shrink-0" />
                          <a
                            href={`mailto:${leader.email}`}
                            className="text-xs text-fg-muted hover:text-brand transition-colors truncate"
                            title="Click to send email"
                          >
                            {leader.email}
                          </a>
                        </div>

                        {/* Office Room */}
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-fg-muted shrink-0" />
                          <span className="font-mono text-xs font-medium text-fg truncate">
                            {leader.office}
                          </span>
                        </div>
                      </div>

                      {/* Executive Portfolios / Focus Areas */}
                      {leader.executivePortfolios && (
                        <div className="mt-3.5 space-y-1.5">
                          <span className="text-xs font-bold text-fg-muted block">
                            Institutional Portfolios:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {leader.executivePortfolios.map((portfolio, pIdx) => (
                              <span
                                key={pIdx}
                                className="px-2 py-0.5 bg-surface-2 text-fg-muted hover:text-fg rounded-md text-xs font-medium border border-line transition-colors"
                              >
                                {portfolio}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions Grid */}
                    <div className="mt-5 pt-3 border-t border-line grid grid-cols-2 gap-2">
                      <Link
                        href={`/teachers/${leader.id}`}
                        className="w-full min-h-[44px] py-2.5 px-3 bg-canvas hover:bg-surface-2 text-fg border border-line font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors duration-150 cursor-pointer"
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
                        className="w-full min-h-[44px] py-2.5 px-3 bg-brand hover:bg-brand-hover text-brand-fg font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors duration-150 cursor-pointer"
                        title={`Message ${leader.name}`}
                        aria-label={`Message ${leader.name}`}
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Message</span>
                      </button>
                    </div>
                  </div>
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
            <div className="rounded-[20px] bg-surface border border-line p-12 text-center space-y-3">
              <Search className="w-8 h-8 text-fg-muted mx-auto" />
              <h3 className="text-base font-bold text-fg">
                No faculty members found
              </h3>
              <p className="text-xs text-fg-muted max-w-sm mx-auto">
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
                  <div className="bg-surface border border-line rounded-[20px] p-5 sm:p-6 h-full flex flex-col justify-between hover:border-brand/40 transition-colors duration-150 group">
                  <div>
                    {/* Top Avatar & Status Row */}
                    <div className="flex flex-wrap items-start justify-between gap-2.5 mb-4">
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        <ProfileAvatar
                          className="w-14 h-14 rounded-2xl border-2 border-line shrink-0 group-hover:border-brand/40 group-hover:scale-105 transition-all bg-surface-2"
                          iconClassName="w-7 h-7"
                        />
                        <div className="min-w-0">
                          <h3 className="font-bold text-fg text-base leading-snug truncate" title={teacher.name}>
                            {teacher.name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="font-mono text-xs font-bold text-brand bg-brand/10 px-1.5 py-0.5 rounded border border-brand/20 shrink-0">
                              {teacher.facultyCode}
                            </span>
                            <span className="text-xs text-fg-muted font-medium truncate min-w-0" title={teacher.role}>
                              {teacher.role}
                            </span>
                          </div>
                        </div>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${statusStyle.text}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                        {teacher.status}
                      </span>
                    </div>

                    {/* Department Badge */}
                    <div className="mb-3">
                      <span className="inline-block text-xs font-semibold text-fg-muted bg-surface-2 px-2.5 py-1 rounded-lg border border-line">
                        {teacher.department}
                      </span>
                    </div>

                    {/* Contact Info Block: Phone, Email, Office with Direct Links */}
                    <div className="space-y-2 py-3 border-y border-line text-xs text-fg-muted">
                      {/* Direct Phone */}
                      <div className="flex items-center gap-2 min-w-0">
                        <Phone className="w-3.5 h-3.5 text-fg-muted shrink-0" />
                        <a
                          href={`tel:${teacher.phone.replace(/[^0-9+]/g, "")}`}
                          className="font-mono text-xs font-semibold text-fg hover:text-brand transition-colors truncate"
                          title="Click to call"
                        >
                          {teacher.phone}
                        </a>
                      </div>

                      {/* Email Address */}
                      <div className="flex items-center gap-2 min-w-0">
                        <Mail className="w-3.5 h-3.5 text-fg-muted shrink-0" />
                        <a
                          href={`mailto:${teacher.email}`}
                          className="text-xs text-fg-muted hover:text-brand transition-colors truncate"
                          title="Click to email"
                        >
                          {teacher.email}
                        </a>
                      </div>

                      {/* Office Room */}
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-fg-muted shrink-0" />
                        <span className="font-mono text-xs font-medium text-fg truncate">
                          {teacher.office}
                        </span>
                      </div>
                    </div>

                    {/* Courses Tags */}
                    <div className="mt-3.5">
                      <span className="text-xs font-bold text-fg-muted block mb-1.5">
                        Assigned Courses:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {teacher.courses.map((course, cIdx) => (
                          <span
                            key={cIdx}
                            className="px-2 py-0.5 bg-canvas text-fg rounded-lg text-xs font-medium border border-line"
                          >
                            <span className="font-bold text-brand mr-1">{course.code}</span>
                            {course.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-5 pt-3 border-t border-line grid grid-cols-2 gap-2">
                    <Link
                      href={`/teachers/${teacher.id}`}
                      className="w-full min-h-[44px] py-2.5 px-3 bg-canvas hover:bg-surface-2 text-fg border border-line font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors duration-150 cursor-pointer"
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
                      className="w-full min-h-[44px] py-2.5 px-3 bg-brand/10 hover:bg-brand text-brand hover:text-brand-fg border border-brand/20 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors duration-150 cursor-pointer"
                      title={`Message ${teacher.name}`}
                      aria-label={`Message ${teacher.name}`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Message</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </SectionPanel>
      )}
    </div>
  );
}
