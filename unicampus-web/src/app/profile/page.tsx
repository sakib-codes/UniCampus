"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  User, 
  Mail, 
  GraduationCap, 
  Award, 
  Edit3,
  Camera,
  Copy,
  Check,
  Globe,
  Code
} from "lucide-react";

function GithubIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedinIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.47 1.47 0 1 0 0-2.94 1.47 1.47 0 0 0 0 2.94M7.86 18.5v-8.37H5.07v8.37h2.79z" />
    </svg>
  );
}
import { useAdminAuth } from "@/context/AdminAuthContext";
import ProfileAvatar from "@/components/common/ProfileAvatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { 
  ACTIVE_TERM, 
  CANONICAL_FACULTY, 
  CANONICAL_STUDENT 
} from "@/lib/canonicalCampus";
import { 
  StudentEditProfileModal, 
  type StudentProfileData 
} from "@/components/profile/StudentEditProfileModal";

const STORAGE_KEY = "unicampus:student-profile";

const DEFAULT_PROFILE_DATA: StudentProfileData = {
  fullName: CANONICAL_STUDENT.name,
  avatarUrl: null,
  bio: "Junior Computer Science & Engineering undergraduate focusing on distributed systems and competitive programming. Active member of UniCampus Robotics Club and ACM-ICPC problem solver.",
  phone: CANONICAL_STUDENT.phone,
  emergencyPhone: CANONICAL_STUDENT.emergencyPhone,
  presentAddress: "Bashundhara R/A, Block C, Dhaka",
  bloodGroup: "B+",
  githubUrl: "https://github.com/sakib360",
  linkedinUrl: "https://linkedin.com/in/sakib-ahmed",
  websiteUrl: "https://sakib.dev",
  skills: [
    "Data Structures",
    "Algorithms",
    "TypeScript",
    "Next.js",
    "Distributed Systems",
    "Docker"
  ],
};

export default function ProfilePage() {
  const { currentUser } = useAdminAuth();
  const isTeacher = currentUser?.role === "teacher";
  const isAdmin = currentUser?.role === "admin";

  const [profileData, setProfileData] = useState<StudentProfileData>(DEFAULT_PROFILE_DATA);
  const [editOpen, setEditOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [toast, setToast] = useState<{ open: boolean; message: string }>({
    open: false,
    message: "",
  });

  // Hydrate custom student profile from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        queueMicrotask(() => {
          setProfileData((prev) => ({ ...prev, ...parsed }));
        });
      }
    } catch {
      // Fallback to default canonical data
    }
  }, []);

  const handleCopy = (key: string, value: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(value).catch(() => {});
    }
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey((prev) => (prev === key ? null : prev));
    }, 1800);
  };

  const handleSaveProfile = (updated: StudentProfileData) => {
    setProfileData(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(
        new CustomEvent("unicampus:profile-updated", { detail: updated })
      );
    } catch {
      // Storage unavailable fallback
    }
    setToast({
      open: true,
      message: "Student profile updated successfully.",
    });
  };

  const displayName =
    currentUser?.full_name ||
    (isTeacher
      ? CANONICAL_FACULTY.name
      : profileData.fullName || CANONICAL_STUDENT.name);
  const studentId = currentUser?.student_id || CANONICAL_STUDENT.studentId;
  const facultyCode = currentUser?.teacher_code || CANONICAL_FACULTY.facultyCode;
  const email =
    currentUser?.email ||
    (isTeacher ? CANONICAL_FACULTY.email : CANONICAL_STUDENT.email);
  const departmentName =
    currentUser?.department_name ||
    (isTeacher ? CANONICAL_FACULTY.departmentName : CANONICAL_STUDENT.departmentName);
  const phone = isTeacher ? CANONICAL_FACULTY.phone : profileData.phone;
  const emergencyPhone = profileData.emergencyPhone;

  return (
    <div className="w-full space-y-6 pb-12">
      {/* 1. Profile Header Hero */}
      <section className="rounded-2xl bg-surface border border-line p-6 md:p-8 transition-colors">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5 min-w-0">
            <div className="relative group shrink-0">
              <ProfileAvatar
                alt={displayName}
                src={!isTeacher && !isAdmin ? profileData.avatarUrl : null}
                size="lg"
                className="w-20 h-20 md:w-24 md:h-24 rounded-2xl ring-4 ring-line shadow-sm overflow-hidden"
              />
              {!isTeacher && !isAdmin && (
                <button
                  type="button"
                  onClick={() => setEditOpen(true)}
                  aria-label="Change profile photo"
                  className="absolute inset-0 rounded-2xl bg-black/40 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity cursor-pointer"
                >
                  <Camera className="w-5 h-5 mb-0.5" />
                  <span className="text-[10px] font-medium">Edit</span>
                </button>
              )}
            </div>

            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-fg">
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

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-fg-muted font-sans pt-0.5">
                {isTeacher ? (
                  <>
                    <span>
                      Code: <span className="font-mono">{facultyCode}</span>
                    </span>
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
                    <span>
                      ID: <span className="font-mono">{studentId}</span>
                    </span>
                    <span>·</span>
                    <span>{CANONICAL_STUDENT.batch}</span>
                    <span>·</span>
                    <span>{CANONICAL_STUDENT.semester}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
            {!isTeacher && !isAdmin && (
              <Button
                variant="primary"
                size="md"
                onClick={() => setEditOpen(true)}
                className="w-full sm:w-auto"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </Button>
            )}
            <Link
              href="/settings"
              className="inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors duration-150 cursor-pointer select-none whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand bg-surface hover:bg-surface-2 text-fg border border-line min-h-[44px] px-4 py-2.5 text-sm w-full sm:w-auto"
            >
              <span>Settings</span>
            </Link>
          </div>
        </div>

        {/* Bio & Social Links Bar */}
        {!isTeacher && !isAdmin && (
          <div className="mt-6 pt-5 border-t border-line space-y-4">
            {profileData.bio && (
              <p className="text-xs sm:text-sm text-fg-muted leading-relaxed font-sans max-w-3xl">
                {profileData.bio}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Social / Portfolio Links */}
              <div className="flex flex-wrap items-center gap-2">
                {profileData.githubUrl && (
                  <a
                    href={profileData.githubUrl.startsWith("http") ? profileData.githubUrl : `https://${profileData.githubUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-2 hover:bg-surface border border-line text-xs font-medium text-fg transition-colors"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span>GitHub</span>
                  </a>
                )}
                {profileData.linkedinUrl && (
                  <a
                    href={profileData.linkedinUrl.startsWith("http") ? profileData.linkedinUrl : `https://${profileData.linkedinUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-2 hover:bg-surface border border-line text-xs font-medium text-fg transition-colors"
                  >
                    <LinkedinIcon className="w-3.5 h-3.5" />
                    <span>LinkedIn</span>
                  </a>
                )}
                {profileData.websiteUrl && (
                  <a
                    href={profileData.websiteUrl.startsWith("http") ? profileData.websiteUrl : `https://${profileData.websiteUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-2 hover:bg-surface border border-line text-xs font-medium text-fg transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Portfolio</span>
                  </a>
                )}
              </div>

              {/* Skills Chips */}
              {profileData.skills.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle mr-1">
                    <Code className="w-3 h-3" />
                    <span>Skills:</span>
                  </span>
                  {profileData.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-canvas border border-line text-[11px] font-medium text-fg-muted"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* 2. Grid Information Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details */}
        <div className="rounded-2xl bg-surface border border-line p-6 space-y-4">
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
              <span className="font-semibold text-fg">{profileData.bloodGroup}</span>
            </div>
            <div className="flex justify-between items-center gap-3 flex-wrap py-3">
              <span className="text-fg-muted font-medium">Nationality</span>
              <span className="font-semibold text-fg">Bangladeshi</span>
            </div>
          </div>
        </div>

        {/* Academic Registry */}
        <div className="rounded-2xl bg-surface border border-line p-6 space-y-4">
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
                  <span className="font-semibold text-fg tabular-nums">{CANONICAL_FACULTY.officeHours}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center gap-3 flex-wrap py-3">
                  <span className="text-fg-muted font-medium">CGPA &amp; Class Rank</span>
                  <span className="font-semibold text-fg font-sans tabular-nums">
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
              <span className="text-success font-semibold">Regular / Good Standing</span>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="rounded-2xl bg-surface border border-line p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-line">
            <Mail className="w-4 h-4 text-brand" />
            <h2 className="font-semibold text-base text-fg">Contact Information</h2>
          </div>
          <div className="divide-y divide-line text-xs">
            <div className="flex justify-between items-center gap-3 flex-wrap py-3">
              <span className="text-fg-muted font-medium">Institutional Email</span>
              <div className="flex items-center gap-2">
                <span className="font-sans font-medium text-fg min-w-0 break-all">{email}</span>
                <button
                  type="button"
                  onClick={() => handleCopy("email", email)}
                  title="Copy email"
                  aria-label="Copy email"
                  className="p-1 rounded text-fg-muted hover:text-fg hover:bg-surface-2 transition-colors cursor-pointer"
                >
                  {copiedKey === "email" ? (
                    <Check className="w-3.5 h-3.5 text-success" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center gap-3 flex-wrap py-3">
              <span className="text-fg-muted font-medium">Phone Number</span>
              <div className="flex items-center gap-2">
                <span className="font-sans tabular-nums font-medium text-fg">{phone}</span>
                <button
                  type="button"
                  onClick={() => handleCopy("phone", phone)}
                  title="Copy phone"
                  aria-label="Copy phone"
                  className="p-1 rounded text-fg-muted hover:text-fg hover:bg-surface-2 transition-colors cursor-pointer"
                >
                  {copiedKey === "phone" ? (
                    <Check className="w-3.5 h-3.5 text-success" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center gap-3 flex-wrap py-3">
              <span className="text-fg-muted font-medium">Emergency Contact</span>
              <div className="flex items-center gap-2">
                <span className="font-sans tabular-nums font-medium text-fg">{emergencyPhone}</span>
                <button
                  type="button"
                  onClick={() => handleCopy("emergency", emergencyPhone)}
                  title="Copy emergency phone"
                  aria-label="Copy emergency phone"
                  className="p-1 rounded text-fg-muted hover:text-fg hover:bg-surface-2 transition-colors cursor-pointer"
                >
                  {copiedKey === "emergency" ? (
                    <Check className="w-3.5 h-3.5 text-success" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center gap-3 flex-wrap py-3">
              <span className="text-fg-muted font-medium">Present Address</span>
              <span className="font-medium text-fg">{profileData.presentAddress}</span>
            </div>
          </div>
        </div>

        {/* Campus Activities */}
        <div className="rounded-2xl bg-surface border border-line p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-line">
            <Award className="w-4 h-4 text-brand" />
            <h2 className="font-semibold text-base text-fg">Campus Affiliations</h2>
          </div>
          <div className="space-y-3 pt-1">
            <div className="p-3.5 rounded-xl bg-canvas border border-line flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-success-light text-success flex items-center justify-center font-semibold shrink-0">
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

      {/* Interactive Edit Profile Modal */}
      <StudentEditProfileModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initialData={profileData}
        onSave={handleSaveProfile}
      />

      {/* Toast Notification */}
      <Toast
        open={toast.open}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      />
    </div>
  );
}
