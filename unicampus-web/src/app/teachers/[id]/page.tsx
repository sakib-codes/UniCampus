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
  Check,
  Building2,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { themeTokens } from "@/lib/theme";
import SpotlightCard from "@/components/bits/SpotlightCard";
import { getFacultyById, FACULTY_MEMBERS, FacultyStatus } from "@/lib/facultyData";

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
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-[#8D96A0] hover:text-brand transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Faculty &amp; Leadership Directory
        </Link>
        <div className="flex items-center gap-2">
          {teacher.isLeadership && (
            <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              <Crown className="w-3 h-3" /> Executive Council
            </span>
          )}
          <span className="font-mono text-xs font-bold text-slate-500 dark:text-[#8D96A0] bg-slate-100 dark:bg-[#161B22] px-2.5 py-1 rounded border border-slate-200 dark:border-[#30363D]">
            Faculty Code: {teacher.facultyCode}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Faculty Identity Card */}
        <SpotlightCard 
          className={`lg:col-span-5 ${themeTokens.card3xl} p-6 sm:p-8 flex flex-col items-center text-center transition-colors shadow-sm relative overflow-hidden`}
          spotlightColor={teacher.isLeadership ? "rgba(245, 158, 11, 0.15)" : "rgba(99, 102, 241, 0.15)"}
        >
          {teacher.isLeadership && (
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-transparent rounded-bl-full pointer-events-none" />
          )}

          {/* Avatar with gradient ring */}
          <div className={`w-32 h-32 sm:w-36 sm:h-36 rounded-full p-1 mb-5 shadow-sm ${
            teacher.isLeadership 
              ? "bg-gradient-to-tr from-amber-400 to-indigo-500" 
              : "bg-gradient-to-tr from-blue-400 to-brand"
          }`}>
            <ProfileAvatar
              className="w-full h-full border-4 border-white dark:border-[#0D1117] bg-white dark:bg-[#161B22]"
              iconClassName="w-16 h-16 sm:w-20 sm:h-20"
            />
          </div>

          {/* Leadership Pill */}
          {teacher.isLeadership && (
            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 mb-2">
              <Sparkles className="w-3 h-3" />
              {teacher.designationCategory}
            </span>
          )}

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F0F6FC] tracking-tight">
            {teacher.name}
          </h1>
          <p className="text-sm font-bold text-brand mt-1">
            {teacher.role}
          </p>
          <p className="text-xs text-slate-500 dark:text-[#8D96A0] font-medium mt-1">
            {teacher.department}
          </p>

          <div className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-xs">
            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${statusStyle.text}`}>
              <span className={`w-2 h-2 rounded-full ${statusStyle.dot} animate-pulse`} />
              <span>{teacher.status}</span>
            </span>
          </div>

          {/* Quick Action Buttons */}
          <div className="w-full grid grid-cols-2 gap-3 mt-6">
            <button
              type="button"
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent("open-messaging", {
                    detail: { peerName: teacher.name },
                  })
                )
              }
              className={`py-2.5 px-3 ${themeTokens.btnPrimary} text-xs flex items-center justify-center gap-1.5`}
              title={`Message ${teacher.name}`}
              aria-label={`Message ${teacher.name}`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Message</span>
            </button>

            <a
              href={`mailto:${teacher.email}`}
              className={`py-2.5 px-3 ${themeTokens.btnSecondary} hover:bg-slate-100 dark:hover:bg-[#161B22] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer`}
              title="Send email"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Send Email</span>
            </a>
          </div>

          {/* Call Direct Button */}
          <a
            href={`tel:${teacher.phone.replace(/[^0-9+]/g, "")}`}
            className="w-full mt-2.5 py-2 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-[#161B22] dark:hover:bg-[#21262D] text-slate-800 dark:text-[#F0F6FC] rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5 text-brand" />
            <span>Call Direct: {teacher.phone}</span>
          </a>

          {/* Divider */}
          <div className={`w-full my-6 border-t ${themeTokens.border}`}></div>

          {/* Contact Details List */}
          <div className="w-full text-left space-y-3.5">
            <h3 className="text-xs font-extrabold text-slate-900 dark:text-[#F0F6FC] uppercase tracking-wider flex items-center justify-between">
              <span>Office &amp; Contact Details</span>
              <span className="text-[10px] font-normal text-slate-400 dark:text-[#6E747D]">Click to copy</span>
            </h3>

            <div className="space-y-3 text-xs text-slate-600 dark:text-[#8D96A0] font-medium">
              {/* Phone */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-[#161B22] border border-slate-100 dark:border-[#21262D]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Phone className="w-4 h-4 text-brand shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-400 dark:text-[#6E747D] uppercase font-bold">Direct Phone</div>
                    <a 
                      href={`tel:${teacher.phone.replace(/[^0-9+]/g, "")}`} 
                      className="font-mono text-slate-800 dark:text-[#F0F6FC] font-bold hover:text-brand transition-colors truncate block"
                    >
                      {teacher.phone}
                    </a>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Copy direct phone number"
                  onClick={() => copyToClipboard(teacher.phone, "profile-phone")}
                  className="p-1.5 text-slate-400 dark:text-[#6E747D] hover:text-brand rounded-lg hover:bg-slate-200 dark:hover:bg-[#30363D] transition-colors cursor-pointer"
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
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-[#161B22] border border-slate-100 dark:border-[#21262D]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Mail className="w-4 h-4 text-brand shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[10px] text-slate-400 dark:text-[#6E747D] uppercase font-bold">Institutional Email</div>
                    <a 
                      href={`mailto:${teacher.email}`} 
                      className="font-medium text-slate-800 dark:text-[#F0F6FC] hover:text-brand transition-colors truncate block"
                    >
                      {teacher.email}
                    </a>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Copy institutional email address"
                  onClick={() => copyToClipboard(teacher.email, "profile-email")}
                  className="p-1.5 text-slate-400 dark:text-[#6E747D] hover:text-brand rounded-lg hover:bg-slate-200 dark:hover:bg-[#30363D] transition-colors cursor-pointer"
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
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-[#161B22] border border-slate-100 dark:border-[#21262D]">
                <MapPin className="w-4 h-4 text-brand shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400 dark:text-[#6E747D] uppercase font-bold">Office Location</div>
                  <span className="font-mono text-slate-800 dark:text-[#F0F6FC] font-bold">
                    {teacher.office}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </SpotlightCard>

        {/* Right Column: Bio, Qualifications, Courses & Consultation */}
        <div className="lg:col-span-7 space-y-6">
          {/* Executive Overview & Biography */}
          <div className={`${themeTokens.card3xl} p-6 sm:p-8 space-y-4 shadow-sm`}>
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-lg bg-brand/10 dark:bg-brand/20 text-brand">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-[#F0F6FC]">
                Academic Profile &amp; Biography
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-[#8D96A0]">
              {teacher.bio}
            </p>

            {/* Qualifications / Degrees */}
            {teacher.qualifications && teacher.qualifications.length > 0 && (
              <div className="pt-3 border-t border-slate-100 dark:border-[#21262D] space-y-2.5">
                <h3 className="text-xs font-extrabold text-slate-900 dark:text-[#F0F6FC] uppercase tracking-wider flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5 text-brand" />
                  <span>Educational Background &amp; Fellowships</span>
                </h3>
                <div className="space-y-1.5">
                  {teacher.qualifications.map((q, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-[#8D96A0]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Executive Portfolios (if leadership) */}
            {teacher.executivePortfolios && teacher.executivePortfolios.length > 0 && (
              <div className="pt-3 border-t border-slate-100 dark:border-[#21262D] space-y-2">
                <h3 className="text-xs font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-2">
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
          <div className={`${themeTokens.card3xl} p-6 sm:p-8 space-y-5 transition-colors shadow-sm`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-[#F0F6FC]">
                  {teacher.isLeadership ? "Academic Courses & Seminars" : "Courses Taught (Current Semester)"}
                </h2>
                <p className={`text-xs ${themeTokens.textMuted} mt-0.5`}>
                  Enrolled student cohorts for Fall 2026
                </p>
              </div>
              <span className="font-mono text-xs font-bold text-brand bg-brand/10 px-2.5 py-1 rounded-full border border-brand/20">
                {teacher.courses.length} Assigned
              </span>
            </div>

            <div className="space-y-3">
              {teacher.courses.map((course) => (
                <div 
                  key={course.code}
                  className={`p-4 ${themeTokens.cardRecessed2xl} flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors`}
                >
                  <div className="flex items-center gap-3.5">
                    <span className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-brand dark:text-indigo-300 rounded-xl font-mono font-bold text-xs tracking-wide shrink-0 border border-brand/20">
                      {course.code}
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-[#F0F6FC] text-sm">
                        {course.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 dark:text-[#6E747D] font-mono mt-0.5">
                        {course.credit} Academic Credits
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-[#8D96A0] font-medium sm:text-right shrink-0">
                    Enrollment: {course.enrollment} Students
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Office / Consultation Hours Card */}
          <div className={`${themeTokens.card3xl} p-6 sm:p-8 space-y-5 transition-colors shadow-sm`}>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-[#F0F6FC]">
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
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-emerald-800 dark:text-emerald-200 text-sm">
                        {slot.day} Consultation
                      </h3>
                      <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                        Open
                      </span>
                    </div>
                    <p className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{slot.time}</span>
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-[#8D96A0] mt-2">
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
