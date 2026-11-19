"use client";

import { useState } from "react";
import ProfileAvatar from "@/components/common/ProfileAvatar";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  ArrowLeft, 
  Mail, 
  MapPin, 
  Calendar, 
  Clock, 
  MessageSquare, 
  BookOpen, 
  Phone,
  ShieldCheck,
  CheckCircle2,
  Crown,
  GraduationCap,
  Copy,
  Check
} from "lucide-react";
import { themeTokens } from "@/lib/theme";
import { getFacultyById, FACULTY_MEMBERS, FacultyStatus } from "@/lib/facultyData";
import { ACTIVE_TERM } from "@/lib/canonicalCampus";

export default function TeacherProfilePage() {
  const params = useParams();
  const rawId = (params?.id as string) || "1";
  
  // Find member from shared directory data (with fallback to first member)
  const teacher = getFacultyById(rawId) || FACULTY_MEMBERS[0];

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

  const statusStyle = getStatusBadge(teacher.status);

  return (
    <div className="w-full space-y-6 pb-20">
      {/* Top Back Link & Faculty Code */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <Link
          href="/teachers"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-fg-muted hover:text-brand transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Faculty &amp; Leadership Directory
        </Link>
        <div className="flex items-center gap-2">
          {teacher.isLeadership && (
            <span className="inline-flex items-center gap-1 font-mono text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              <Crown className="w-3 h-3" /> Executive Council
            </span>
          )}
          <span className="font-mono text-xs font-bold text-slate-500 dark:text-fg-muted bg-slate-100 dark:bg-surface-2 px-2.5 py-1 rounded border border-slate-200 dark:border-line">
            Faculty Code: {teacher.facultyCode}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Faculty Identity Card */}
        <div className="lg:col-span-5 bg-surface border border-line rounded-[20px] p-6 sm:p-8 flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full p-1 mb-5 border-2 border-line bg-surface-2">
            <ProfileAvatar
              className="w-full h-full border-4 border-surface bg-surface-2"
              iconClassName="w-16 h-16 sm:w-20 sm:h-20"
            />
          </div>

          {/* Leadership Pill */}
          {teacher.isLeadership && (
            <span className="inline-flex items-center gap-1 text-xs font-extrabold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 mb-2">
              <Crown className="w-3 h-3" />
              {teacher.designationCategory}
            </span>
          )}

          <h1 className="text-2xl sm:text-3xl font-extrabold text-fg tracking-tight">
            {teacher.name}
          </h1>
          <p className="text-sm font-bold text-brand mt-1">
            {teacher.role}
          </p>
          <p className="text-xs text-fg-muted font-medium mt-1">
            {teacher.department}
          </p>

          <span className={`mt-3.5 inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${statusStyle.text}`}>
            <span className={`w-2 h-2 rounded-full ${statusStyle.dot}`} />
            <span>{teacher.status}</span>
          </span>

          {/* Primary Action Button */}
          <div className="w-full mt-6">
            <button
              type="button"
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent("open-messaging", {
                    detail: { peerName: teacher.name },
                  })
                )
              }
              className={`w-full min-h-[44px] py-2.5 px-4 ${themeTokens.btnPrimary} text-xs flex items-center justify-center gap-2`}
              title={`Message ${teacher.name}`}
              aria-label={`Message ${teacher.name}`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </div>

          {/* Divider */}
          <div className={`w-full my-6 border-t ${themeTokens.border}`}></div>

          {/* Contact Details List */}
          <div className="w-full text-left space-y-3.5">
            <h3 className="text-xs font-extrabold text-fg flex items-center justify-between">
              <span>Office &amp; Contact Details</span>
              <span className="text-xs font-normal text-fg-muted">Click to copy</span>
            </h3>

            <div className="space-y-3 text-xs text-fg-muted font-medium">
              {/* Phone */}
              <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-canvas border border-line">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Phone className="w-4 h-4 text-brand shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs text-fg-muted font-bold">Direct Phone</div>
                    <a 
                      href={`tel:${teacher.phone.replace(/[^0-9+]/g, "")}`} 
                      className="font-mono text-fg font-bold hover:text-brand transition-colors truncate block"
                    >
                      {teacher.phone}
                    </a>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Copy direct phone number"
                  onClick={() => copyToClipboard(teacher.phone, "profile-phone")}
                  className="p-2 text-fg-muted hover:text-brand rounded-lg hover:bg-surface-2 transition-colors cursor-pointer shrink-0"
                  title="Copy Phone"
                >
                  {copiedField === "profile-phone" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Email */}
              <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-canvas border border-line">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Mail className="w-4 h-4 text-brand shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs text-fg-muted font-bold">Institutional Email</div>
                    <a 
                      href={`mailto:${teacher.email}`} 
                      className="font-medium text-fg hover:text-brand transition-colors truncate block"
                    >
                      {teacher.email}
                    </a>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Copy institutional email address"
                  onClick={() => copyToClipboard(teacher.email, "profile-email")}
                  className="p-2 text-fg-muted hover:text-brand rounded-lg hover:bg-surface-2 transition-colors cursor-pointer shrink-0"
                  title="Copy Email"
                >
                  {copiedField === "profile-email" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Office Location */}
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-canvas border border-line">
                <MapPin className="w-4 h-4 text-brand shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs text-fg-muted font-bold">Office Location</div>
                  <span className="font-mono text-fg font-bold">
                    {teacher.office}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Bio, Qualifications, Courses & Consultation */}
        <div className="lg:col-span-7 space-y-6">
          {/* Executive Overview & Biography */}
          <div className={`${themeTokens.card3xl} p-6 sm:p-8 space-y-4 shadow-sm`}>
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-lg bg-brand/10 dark:bg-brand/20 text-brand">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-fg">
                Academic Profile &amp; Biography
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-fg-muted">
              {teacher.bio}
            </p>

            {/* Qualifications / Degrees */}
            {teacher.qualifications && teacher.qualifications.length > 0 && (
              <div className="pt-3 border-t border-slate-100 dark:border-line space-y-2.5">
                <h3 className="text-xs font-extrabold text-slate-900 dark:text-fg flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5 text-brand" />
                  <span>Educational Background &amp; Fellowships</span>
                </h3>
                <div className="space-y-1.5">
                  {teacher.qualifications.map((q, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-fg-muted">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Executive Portfolios (if leadership) */}
            {teacher.executivePortfolios && teacher.executivePortfolios.length > 0 && (
              <div className="pt-3 border-t border-slate-100 dark:border-line space-y-2">
                <h3 className="text-xs font-extrabold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <Crown className="w-3.5 h-3.5" />
                  <span>Institutional Portfolios &amp; Committees</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {teacher.executivePortfolios.map((p, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-amber-500/10 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 rounded-lg text-xs font-semibold border border-amber-500/20"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Courses Taught / Academic Portfolios */}
          <div className="rounded-[20px] bg-surface border border-line p-6 sm:p-8 space-y-5 transition-colors">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-fg">
                  {teacher.isLeadership ? "Academic Courses & Seminars" : "Courses Taught (Current Semester)"}
                </h2>
                <p className={`text-xs ${themeTokens.textMuted} mt-0.5`}>
                  Enrolled student cohorts for {ACTIVE_TERM}
                </p>
              </div>
              <span className="font-mono text-xs font-bold text-brand bg-brand/10 px-2.5 py-1 rounded-full border border-brand/20 shrink-0 whitespace-nowrap">
                {teacher.courses.length} Assigned
              </span>
            </div>

            <div className="space-y-3">
              {teacher.courses.map((course) => (
                <div 
                  key={course.code}
                  className={`p-4 ${themeTokens.cardRecessed2xl} flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-brand dark:text-indigo-300 rounded-xl font-mono font-bold text-xs tracking-wide shrink-0 border border-brand/20">
                      {course.code}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-bold text-fg text-sm">
                        {course.title}
                      </h3>
                      <p className="text-xs text-fg-muted font-mono mt-0.5">
                        {course.credit} Academic Credits
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-fg-muted font-medium sm:text-right shrink-0">
                    Enrollment: {course.enrollment} Students
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Office / Consultation Hours Card */}
          <div className="rounded-[20px] bg-surface border border-line p-6 sm:p-8 space-y-5 transition-colors">
            <div>
              <h2 className="text-lg font-bold text-fg">
                Office &amp; Advising Hours
              </h2>
              <p className={`text-xs ${themeTokens.textMuted} mt-0.5`}>
                Weekly consultation sessions for project guidance, academic advising &amp; institutional appointments
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {teacher.consultations.map((slot, idx) => (
                <div 
                  key={idx}
                  className="border border-emerald-200/90 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/30 rounded-2xl p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-bold text-emerald-800 dark:text-emerald-200 text-sm">
                        {slot.day} Consultation
                      </h3>
                      <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded shrink-0">
                        Open
                      </span>
                    </div>
                    <p className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{slot.time}</span>
                    </p>
                    <p className="text-xs text-fg-muted mt-2">
                      Location: {slot.room}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
