"use client";

import Link from "next/link";
import { 
  User, 
  Mail, 
  GraduationCap, 
  Award, 
  Edit3
} from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import ProfileAvatar from "@/components/common/ProfileAvatar";
import { Badge } from "@/components/ui/Badge";
import { ACTIVE_TERM, CANONICAL_FACULTY, CANONICAL_STUDENT } from "@/lib/canonicalCampus";

export default function ProfilePage() {
  const { currentUser } = useAdminAuth();
  const isTeacher = currentUser?.role === "teacher";
  const isAdmin = currentUser?.role === "admin";
  const displayName =
    currentUser?.full_name ||
    (isTeacher ? CANONICAL_FACULTY.name : CANONICAL_STUDENT.name);
  const studentId = currentUser?.student_id || CANONICAL_STUDENT.studentId;
  const facultyCode = currentUser?.teacher_code || CANONICAL_FACULTY.facultyCode;
  const email =
    currentUser?.email ||
    (isTeacher ? CANONICAL_FACULTY.email : CANONICAL_STUDENT.email);
  const departmentName =
    currentUser?.department_name ||
    (isTeacher ? CANONICAL_FACULTY.departmentName : CANONICAL_STUDENT.departmentName);
  const phone = isTeacher ? CANONICAL_FACULTY.phone : CANONICAL_STUDENT.phone;
  const emergencyPhone = CANONICAL_STUDENT.emergencyPhone;

  return (
    <div className="w-full space-y-6 pb-10">
      {/* 1. Profile Header Hero */}
      <section className="rounded-[20px] bg-surface border border-line p-6 md:p-8 transition-colors">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5 min-w-0">
            <ProfileAvatar
              alt={displayName}
              size="lg"
              className="w-20 h-20 md:w-24 md:h-24 rounded-2xl ring-4 ring-line shrink-0"
            />

            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-fg">
                  {displayName}
                </h1>
                <Badge variant="brand">
                  {isTeacher
                    ? "Active Faculty"
                    : isAdmin
                    ? "Administrator"
                    : "Active Student"}
                </Badge>
              </div>

              <p className="text-xs md:text-sm text-fg-muted font-medium">
                {isTeacher
                  ? `${CANONICAL_FACULTY.designation} · ${departmentName}`
                  : isAdmin
                  ? `${departmentName} Administration`
                  : `B.Sc. in ${departmentName}`}
              </p>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-fg-muted font-mono pt-0.5">
                {isTeacher ? (
                  <>
                    <span>Code: {facultyCode}</span>
                    <span>·</span>
                    <span>{CANONICAL_FACULTY.office}</span>
                    <span>·</span>
                    <span>{ACTIVE_TERM}</span>
                  </>
                ) : isAdmin ? (
                  <>
                    <span>Super Admin</span>
                    <span>·</span>
                    <span>{ACTIVE_TERM}</span>
                  </>
                ) : (
                  <>
                    <span>ID: {studentId}</span>
                    <span>·</span>
                    <span>{CANONICAL_STUDENT.batch}</span>
                    <span>·</span>
                    <span>{CANONICAL_STUDENT.semester}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <Link
            href="/settings"
            className="inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors duration-150 cursor-pointer select-none whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 bg-surface hover:bg-surface-2 text-fg border border-line min-h-[44px] px-4 py-2.5 text-sm shrink-0"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </Link>
        </div>
      </section>

      {/* 2. Grid Information Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details */}
        <div className="rounded-[20px] bg-surface border border-line p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-line">
            <User className="w-4 h-4 text-brand" />
            <h2 className="font-semibold text-base text-fg">Personal Details</h2>
          </div>
          <div className="divide-y divide-line text-xs">
            <div className="flex justify-between items-center gap-3 flex-wrap py-3">
              <span className="text-fg-muted font-medium">Campus</span>
              <span className="font-semibold text-fg">Main Campus (Birulia)</span>
            </div>
            <div className="flex justify-between items-center gap-3 flex-wrap py-3">
              <span className="text-fg-muted font-medium">Gender</span>
              <span className="font-semibold text-fg">Male</span>
            </div>
            <div className="flex justify-between items-center gap-3 flex-wrap py-3">
              <span className="text-fg-muted font-medium">Blood Group</span>
              <span className="font-semibold text-fg">B+</span>
            </div>
            <div className="flex justify-between items-center gap-3 flex-wrap py-3">
              <span className="text-fg-muted font-medium">Nationality</span>
              <span className="font-semibold text-fg">Bangladeshi</span>
            </div>
          </div>
        </div>

        {/* Academic Registry */}
        <div className="rounded-[20px] bg-surface border border-line p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-line">
            <GraduationCap className="w-4 h-4 text-brand" />
            <h2 className="font-semibold text-base text-fg">Academic Registry</h2>
          </div>
          <div className="divide-y divide-line text-xs">
            <div className="flex justify-between items-center gap-3 flex-wrap py-3">
              <span className="text-fg-muted font-medium">Academic Term</span>
              <span className="font-semibold text-fg">{ACTIVE_TERM}</span>
            </div>
            {isTeacher ? (
              <>
                <div className="flex justify-between items-center gap-3 flex-wrap py-3">
                  <span className="text-fg-muted font-medium">Office</span>
                  <span className="font-semibold text-fg">{CANONICAL_FACULTY.office}</span>
                </div>
                <div className="flex justify-between items-center gap-3 flex-wrap py-3">
                  <span className="text-fg-muted font-medium">Office Hours</span>
                  <span className="font-semibold text-fg">{CANONICAL_FACULTY.officeHours}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center gap-3 flex-wrap py-3">
                  <span className="text-fg-muted font-medium">CGPA &amp; Class Rank</span>
                  <span className="font-semibold text-fg font-mono">
                    CGPA {CANONICAL_STUDENT.cgpa.toFixed(2)} · Rank #{CANONICAL_STUDENT.rank}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-3 flex-wrap py-3">
                  <span className="text-fg-muted font-medium">Faculty Advisor</span>
                  <span className="font-semibold text-fg">{CANONICAL_FACULTY.name}</span>
                </div>
              </>
            )}
            <div className="flex justify-between items-center gap-3 flex-wrap py-3">
              <span className="text-fg-muted font-medium">Enrollment Status</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Regular / Good Standing</span>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="rounded-[20px] bg-surface border border-line p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-line">
            <Mail className="w-4 h-4 text-brand" />
            <h2 className="font-semibold text-base text-fg">Contact Information</h2>
          </div>
          <div className="divide-y divide-line text-xs">
            <div className="flex justify-between items-center gap-3 flex-wrap py-3">
              <span className="text-fg-muted font-medium">Institutional Email</span>
              <span className="font-mono font-medium text-fg min-w-0 break-all">{email}</span>
            </div>
            <div className="flex justify-between items-center gap-3 flex-wrap py-3">
              <span className="text-fg-muted font-medium">Phone Number</span>
              <span className="font-mono font-medium text-fg">{phone}</span>
            </div>
            <div className="flex justify-between items-center gap-3 flex-wrap py-3">
              <span className="text-fg-muted font-medium">Emergency Contact</span>
              <span className="font-mono font-medium text-fg">{emergencyPhone}</span>
            </div>
            <div className="flex justify-between items-center gap-3 flex-wrap py-3">
              <span className="text-fg-muted font-medium">Present Address</span>
              <span className="font-medium text-fg">Bashundhara R/A, Dhaka</span>
            </div>
          </div>
        </div>

        {/* Campus Activities */}
        <div className="rounded-[20px] bg-surface border border-line p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-line">
            <Award className="w-4 h-4 text-brand" />
            <h2 className="font-semibold text-base text-fg">Campus Affiliations</h2>
          </div>
          <div className="space-y-3 pt-1">
            <div className="p-3.5 rounded-xl bg-canvas border border-line flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shrink-0">
                ★
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-xs text-fg">UniCampus Robotics Club</h3>
                <p className="text-xs text-fg-muted">General Member · Joined 2nd Semester</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-canvas border border-line flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-brand/10 text-brand flex items-center justify-center font-bold shrink-0">
                #
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-xs text-fg">Competitive Programming Wing</h3>
                <p className="text-xs text-fg-muted">Lead Coordinator · CSE Association</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
