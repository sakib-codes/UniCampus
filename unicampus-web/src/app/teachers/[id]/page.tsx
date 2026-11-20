"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  ArrowLeft, 
  Mail, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Phone, 
  ShieldCheck, 
  CheckCircle2, 
  Crown, 
  GraduationCap, 
  Copy, 
  Check 
} from "lucide-react";
import { getFacultyById, FACULTY_MEMBERS, FacultyStatus } from "@/lib/facultyData";
import { ACTIVE_TERM } from "@/lib/canonicalCampus";

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

  const statusStyle = getStatusBadge(teacher.status);

  return (
    <div className="w-full space-y-6 pb-20">
      {/* Top Back Link & Faculty Code */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <Link
          href="/teachers"
          className="inline-flex items-center gap-2 text-xs font-semibold text-fg-muted hover:text-brand transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back to Faculty &amp; Leadership Directory
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          {teacher.isLeadership && (
            <span className="inline-flex items-center gap-1 font-sans text-xs font-semibold text-warning bg-warning-light px-2.5 py-0.5 rounded-full border border-warning/20">
              <Crown className="w-3 h-3" aria-hidden="true" /> Executive Council
            </span>
          )}
          <span className="font-sans text-xs font-medium text-fg-muted bg-surface-2 px-2.5 py-1 rounded-md border border-line">
            Faculty Code: <span className="font-mono font-semibold text-fg">{teacher.facultyCode}</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Faculty Identity Card */}
        <div className="lg:col-span-5 bg-surface border border-line rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="mb-5">
            <Avatar
              name={getFacultyInitials(teacher.name)}
              alt={teacher.name}
              src={teacher.avatar || undefined}
              size="2xl"
              className="w-32 h-32 sm:w-36 sm:h-36 text-3xl sm:text-4xl border-2 border-line bg-surface-2 text-fg font-semibold"
            />
          </div>

          {/* Leadership Pill */}
          {teacher.isLeadership && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-warning bg-warning-light px-2.5 py-0.5 rounded-full border border-warning/20 mb-2">
              <Crown className="w-3 h-3" aria-hidden="true" />
              {teacher.designationCategory}
            </span>
          )}

          <h1 className="text-2xl sm:text-3xl font-semibold text-fg tracking-tight">
            {teacher.name}
          </h1>
          <p className="text-sm font-semibold text-brand mt-1">
            {teacher.role}
          </p>
          <p className="text-xs text-fg-muted font-medium mt-1">
            {teacher.department}
          </p>

          <span className={`mt-3.5 inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${statusStyle.text}`}>
            <span className={`w-2 h-2 rounded-full ${statusStyle.dot}`} aria-hidden="true" />
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
              className="w-full min-h-[44px] py-2.5 px-4 bg-brand hover:bg-brand-hover text-on-brand rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              title={`Message ${teacher.name}`}
              aria-label={`Message ${teacher.name}`}
            >
              <MessageSquare className="w-4 h-4" aria-hidden="true" />
              <span>Send Message</span>
            </button>
          </div>

          {/* Divider */}
          <div className="w-full my-6 border-t border-line"></div>

          {/* Contact Details List */}
          <div className="w-full text-left space-y-3.5">
            <h3 className="text-xs font-semibold text-fg flex items-center justify-between">
              <span>Office &amp; Contact Details</span>
              <span className="text-xs font-normal text-fg-muted">Click to copy</span>
            </h3>

            <div className="space-y-3 text-xs text-fg-muted font-medium">
              {/* Phone */}
              <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-canvas border border-line">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Phone className="w-4 h-4 text-brand shrink-0" aria-hidden="true" />
                  <div className="min-w-0">
                    <div className="text-xs text-fg-muted font-semibold">Direct Phone</div>
                    <a 
                      href={`tel:${teacher.phone.replace(/[^0-9+]/g, "")}`} 
                      className="font-sans tabular-nums text-fg font-semibold hover:text-brand transition-colors truncate block"
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
                    <Check className="w-3.5 h-3.5 text-success" aria-hidden="true" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  )}
                </button>
              </div>

              {/* Email */}
              <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-canvas border border-line">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Mail className="w-4 h-4 text-brand shrink-0" aria-hidden="true" />
                  <div className="min-w-0">
                    <div className="text-xs text-fg-muted font-semibold">Institutional Email</div>
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
                    <Check className="w-3.5 h-3.5 text-success" aria-hidden="true" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  )}
                </button>
              </div>

              {/* Office Location */}
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-canvas border border-line">
                <MapPin className="w-4 h-4 text-brand shrink-0" aria-hidden="true" />
                <div className="min-w-0">
                  <div className="text-xs text-fg-muted font-semibold">Office Location</div>
                  <span className="font-sans text-fg font-semibold">
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
          <div className="rounded-2xl bg-surface border border-line p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-lg bg-brand-soft text-brand">
                <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              </span>
              <h2 className="text-lg font-semibold text-fg">
                Academic Profile &amp; Biography
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-fg-muted">
              {teacher.bio}
            </p>

            {/* Qualifications / Degrees */}
            {teacher.qualifications && teacher.qualifications.length > 0 && (
              <div className="pt-3 border-t border-line space-y-2.5">
                <h3 className="text-xs font-semibold text-fg flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5 text-brand" aria-hidden="true" />
                  <span>Educational Background &amp; Fellowships</span>
                </h3>
                <div className="space-y-1.5">
                  {teacher.qualifications.map((q, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-fg-muted">
                      <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Executive Portfolios (if leadership) */}
            {teacher.executivePortfolios && teacher.executivePortfolios.length > 0 && (
              <div className="pt-3 border-t border-line space-y-2">
                <h3 className="text-xs font-semibold text-warning flex items-center gap-2">
                  <Crown className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Institutional Portfolios &amp; Committees</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {teacher.executivePortfolios.map((p, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-warning-light text-warning rounded-lg text-xs font-semibold border border-warning/20"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Courses Taught / Academic Portfolios */}
          <div className="rounded-2xl bg-surface border border-line p-6 sm:p-8 space-y-5 transition-colors">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-fg">
                  {teacher.isLeadership ? "Academic Courses & Seminars" : "Courses Taught (Current Semester)"}
                </h2>
                <p className="text-xs text-fg-muted mt-0.5">
                  Enrolled student cohorts for {ACTIVE_TERM}
                </p>
              </div>
              <span className="font-sans tabular-nums text-xs font-semibold text-brand bg-brand-soft px-2.5 py-1 rounded-full border border-brand/20 shrink-0 whitespace-nowrap">
                {teacher.courses.length} Assigned
              </span>
            </div>

            <div className="space-y-3">
              {teacher.courses.map((course) => (
                <div 
                  key={course.code}
                  className="p-4 rounded-xl bg-canvas border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="px-3 py-1.5 bg-brand-soft text-brand rounded-xl font-mono font-semibold text-xs tracking-wide shrink-0 border border-brand/20">
                      {course.code}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-fg text-sm">
                        {course.title}
                      </h3>
                      <p className="text-xs text-fg-muted font-sans tabular-nums mt-0.5">
                        {course.credit} Academic Credits
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-fg-muted font-medium font-sans tabular-nums sm:text-right shrink-0">
                    Enrollment: {course.enrollment} Students
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Office / Consultation Hours Card */}
          <div className="rounded-2xl bg-surface border border-line p-6 sm:p-8 space-y-5 transition-colors">
            <div>
              <h2 className="text-lg font-semibold text-fg">
                Office &amp; Advising Hours
              </h2>
              <p className="text-xs text-fg-muted mt-0.5">
                Weekly consultation sessions for project guidance, academic advising &amp; institutional appointments
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {teacher.consultations.map((slot, idx) => (
                <div 
                  key={idx}
                  className="border border-success/25 bg-success-light/60 rounded-2xl p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-fg text-sm">
                        {slot.day} Consultation
                      </h3>
                      <span className="text-xs font-sans font-semibold text-success bg-success-light px-2 py-0.5 rounded-full border border-success/20 shrink-0">
                        Open
                      </span>
                    </div>
                    <p className="text-xs font-sans tabular-nums font-semibold text-success mt-1 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" aria-hidden="true" />
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
