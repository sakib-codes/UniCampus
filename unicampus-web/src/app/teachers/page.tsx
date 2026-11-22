"use client";

import { useState, useMemo } from "react";
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
  Clock,
  X
} from "lucide-react";
import { Avatar } from "@/components/ui";
import StatCard from "@/components/common/StatCard";
import SectionPanel from "@/components/common/SectionPanel";
import SegmentedTabs from "@/components/common/SegmentedTabs";
import { FACULTY_MEMBERS, FacultyStatus } from "@/lib/facultyData";
import { CAMPUS_METRICS, CANONICAL_CSE_HOD } from "@/lib/canonicalCampus";

function getFacultyInitials(fullName: string): string {
  const cleaned = fullName
    .replace(/\b(Prof|Dr|Engr|Mr|Mrs|Ms)\b\.?/gi, "")
    .replace(/[.]/g, " ")
    .trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return fullName.slice(0, 2).toUpperCase();
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  if (parts[0].length === 1 && parts.length >= 2) {
    const significantWord = parts.find((p) => p.length > 1);
    if (significantWord) {
      return (parts[0][0] + significantWord[0]).toUpperCase();
    }
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

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
          dot: "bg-success",
          text: "text-success bg-success-light border border-success/25",
        };
      case "In Class":
        return {
          dot: "bg-warning",
          text: "text-warning bg-warning-light border border-warning/25",
        };
      case "In Meeting":
        return {
          dot: "bg-brand",
          text: "text-brand bg-brand-soft border border-brand/25",
        };
      case "Online Consultation":
        return {
          dot: "bg-info",
          text: "text-info bg-info-light border border-info/25",
        };
      case "On Leave":
        return {
          dot: "bg-fg-subtle",
          text: "text-fg-muted bg-surface-2 border border-line",
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
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-semibold text-fg tracking-tight">
              Faculty &amp; Leadership Directory
            </h1>
            <p className="text-xs sm:text-sm text-fg-muted mt-1 max-w-2xl font-sans">
              Official institutional directory of Chairman, Principal, Vice Principal, and department-wise professors with direct phone extensions, verified email addresses, and office locations.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-80 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-muted pointer-events-none" aria-hidden="true" />
            <input
              type="text"
              aria-label="Search faculty by name, phone, email, or course"
              placeholder="Search faculty, email, or course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full min-h-[44px] pl-10 pr-10 py-2.5 bg-surface-2 border border-line text-fg placeholder:text-fg-muted rounded-xl text-xs sm:text-sm font-sans focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all duration-150"
            />
            {searchQuery && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-fg-muted hover:text-fg rounded-lg hover:bg-surface transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <X className="w-4 h-4" aria-hidden="true" />
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
            iconBg="bg-brand-soft"
          />
          <StatCard
            label="Executive Leaders"
            value={stats.leadership}
            icon={Crown}
            iconColor="text-warning"
            iconBg="bg-warning-light"
          />
          <StatCard
            label="Academic Depts"
            value={stats.departments}
            icon={GraduationCap}
            iconColor="text-brand"
            iconBg="bg-brand-soft"
          />
          <StatCard
            label="Available In Office"
            value={stats.inOffice}
            icon={Clock}
            iconColor="text-success"
            iconBg="bg-success-light"
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
          iconColor="text-warning"
          iconBg="bg-warning-light"
          action={
            <span className="text-xs font-semibold text-warning bg-warning-light px-3 py-1 rounded-full border border-warning/20">
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
                  <div className="bg-surface border border-line rounded-2xl p-5 sm:p-6 h-full flex flex-col justify-between hover:border-brand/40 transition-colors duration-150 group">
                    <div>
                      {/* Top Row: Circular Avatar on left + Availability pill on top right */}
                      <div className="flex items-center justify-between gap-3 mb-3.5">
                        <Avatar
                          name={getFacultyInitials(leader.name)}
                          alt={leader.name}
                          src={leader.avatar || undefined}
                          size="lg"
                          className="border border-line bg-surface-2 text-fg font-semibold"
                        />

                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${statusStyle.text}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} aria-hidden="true" />
                          {leader.status}
                        </span>
                      </div>

                      {/* Directly below (spanning full card width): Full name, role subtitle, compact metadata */}
                      <div className="space-y-1 mb-4">
                        <Link href={`/teachers/${leader.id}`} className="block group/title">
                          <h3
                            className="text-[15px] sm:text-base font-semibold text-fg leading-snug block group-hover/title:text-brand transition-colors"
                            title={leader.name}
                          >
                            {leader.name}
                          </h3>
                        </Link>
                        <p className="text-xs text-fg-muted mt-0.5 block" title={leader.role}>
                          {leader.role}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-fg-muted mt-1.5 flex-wrap">
                          <span className="font-medium text-fg">{leader.designationCategory}</span>
                          <span className="text-fg-subtle">•</span>
                          <span className="font-mono text-xs text-fg-muted">{leader.facultyCode}</span>
                        </div>
                      </div>

                      {/* Contact Block: Phone, Email, Office with Direct Links */}
                      <div className="space-y-2 py-3 border-y border-line text-xs text-fg-muted">
                        {/* Direct Phone */}
                        <div className="flex items-center gap-2 min-w-0">
                          <Phone className="w-3.5 h-3.5 text-fg-muted shrink-0" aria-hidden="true" />
                          <a
                            href={`tel:${leader.phone.replace(/[^0-9+]/g, "")}`}
                            className="font-sans tabular-nums text-xs font-semibold text-fg hover:text-brand transition-colors truncate"
                            title="Click to call"
                          >
                            {leader.phone}
                          </a>
                        </div>

                        {/* Official Email */}
                        <div className="flex items-center gap-2 min-w-0">
                          <Mail className="w-3.5 h-3.5 text-fg-muted shrink-0" aria-hidden="true" />
                          <a
                            href={`mailto:${leader.email}`}
                            className="text-xs text-fg-muted hover:text-brand transition-colors truncate"
                            title="Click to send email"
                          >
                            {leader.email}
                          </a>
                        </div>

                        {/* Office Room */}
                        <div className="flex items-center gap-2 min-w-0">
                          <MapPin className="w-3.5 h-3.5 text-fg-muted shrink-0" aria-hidden="true" />
                          <span className="font-sans text-xs font-medium text-fg truncate">
                            {leader.office}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions Grid */}
                    <div className="mt-5 pt-3 border-t border-line grid grid-cols-2 gap-2">
                      <Link
                        href={`/teachers/${leader.id}`}
                        className="w-full min-h-[44px] py-2.5 px-3 bg-surface-2 hover:bg-surface text-fg border border-line font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                      >
                        <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
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
                        className="w-full min-h-[44px] py-2.5 px-3 bg-brand hover:bg-brand-hover text-on-brand font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                        title={`Message ${leader.name}`}
                        aria-label={`Message ${leader.name}`}
                      >
                        <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
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
          title="Department Faculty & Professors"
          subtitle="Heads of Department, Professors, Lecturers & Course Instructors"
          icon={BookOpen}
          action={
            <span className="text-xs font-sans tabular-nums font-semibold text-brand bg-brand-soft px-2.5 py-1 rounded-full border border-brand/20">
              {academicFaculty.length} Instructors
            </span>
          }
        >
          {/* Empty State */}
          {filteredFaculty.length === 0 && (
            <div className="rounded-2xl bg-surface border border-line p-12 text-center space-y-3">
              <Search className="w-8 h-8 text-fg-muted mx-auto" aria-hidden="true" />
              <h3 className="text-base font-semibold text-fg">
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
                className="mt-2 min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold text-brand hover:bg-brand-soft transition-colors cursor-pointer"
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
                  <div className="bg-surface border border-line rounded-2xl p-5 sm:p-6 h-full flex flex-col justify-between hover:border-brand/40 transition-colors duration-150 group">
                  <div>
                    {/* Top Row: Circular Avatar on left + Availability pill on top right */}
                    <div className="flex items-center justify-between gap-3 mb-3.5">
                      <Avatar
                        name={getFacultyInitials(teacher.name)}
                        alt={teacher.name}
                        src={teacher.avatar || undefined}
                        size="lg"
                        className="border border-line bg-surface-2 text-fg font-semibold"
                      />

                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${statusStyle.text}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} aria-hidden="true" />
                        {teacher.status}
                      </span>
                    </div>

                    {/* Directly below (spanning full card width): Full name, role subtitle, compact metadata */}
                    <div className="space-y-1 mb-4">
                      <Link href={`/teachers/${teacher.id}`} className="block group/title">
                        <h3
                          className="text-[15px] sm:text-base font-semibold text-fg leading-snug block group-hover/title:text-brand transition-colors"
                          title={teacher.name}
                        >
                          {teacher.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-fg-muted mt-0.5 block" title={teacher.role}>
                        {teacher.role}
                        {teacher.id === CANONICAL_CSE_HOD.facultyPageId ? " (CSE HOD)" : ""}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-fg-muted mt-1.5 flex-wrap">
                        <span className="font-medium text-fg">{teacher.department}</span>
                        <span className="text-fg-subtle">•</span>
                        <span className="font-mono text-xs text-fg-muted">{teacher.facultyCode}</span>
                      </div>
                    </div>

                    {/* Contact Info Block: Phone, Email, Office with Direct Links */}
                    <div className="space-y-2 py-3 border-y border-line text-xs text-fg-muted">
                      {/* Direct Phone */}
                      <div className="flex items-center gap-2 min-w-0">
                        <Phone className="w-3.5 h-3.5 text-fg-muted shrink-0" aria-hidden="true" />
                        <a
                          href={`tel:${teacher.phone.replace(/[^0-9+]/g, "")}`}
                          className="font-sans tabular-nums text-xs font-semibold text-fg hover:text-brand transition-colors truncate"
                          title="Click to call"
                        >
                          {teacher.phone}
                        </a>
                      </div>

                      {/* Email Address */}
                      <div className="flex items-center gap-2 min-w-0">
                        <Mail className="w-3.5 h-3.5 text-fg-muted shrink-0" aria-hidden="true" />
                        <a
                          href={`mailto:${teacher.email}`}
                          className="text-xs text-fg-muted hover:text-brand transition-colors truncate"
                          title="Click to email"
                        >
                          {teacher.email}
                        </a>
                      </div>

                      {/* Office Room */}
                      <div className="flex items-center gap-2 min-w-0">
                        <MapPin className="w-3.5 h-3.5 text-fg-muted shrink-0" aria-hidden="true" />
                        <span className="font-sans text-xs font-medium text-fg truncate">
                          {teacher.office}
                        </span>
                      </div>
                    </div>

                    {/* Courses Tags */}
                    {teacher.courses && teacher.courses.length > 0 && (
                      <div className="mt-3.5">
                        <span className="text-xs font-semibold text-fg-muted block mb-1.5">
                          Assigned Courses:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {teacher.courses.map((course, cIdx) => (
                            <span
                              key={cIdx}
                              className="px-2 py-0.5 bg-surface-2 text-fg rounded-lg text-xs font-medium border border-line"
                            >
                              <span className="font-mono font-semibold text-brand mr-1">{course.code}</span>
                              {course.title}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-5 pt-3 border-t border-line grid grid-cols-2 gap-2">
                    <Link
                      href={`/teachers/${teacher.id}`}
                      className="w-full min-h-[44px] py-2.5 px-3 bg-surface-2 hover:bg-surface text-fg border border-line font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    >
                      <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
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
                      className="w-full min-h-[44px] py-2.5 px-3 bg-brand-soft hover:bg-brand text-brand hover:text-on-brand border border-brand/20 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                      title={`Message ${teacher.name}`}
                      aria-label={`Message ${teacher.name}`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
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
