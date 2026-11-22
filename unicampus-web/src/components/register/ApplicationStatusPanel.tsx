"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Edit3,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { adminService } from "@/lib/services/adminService";
import type { Department, Profile } from "@/types/admin";
import { Button, buttonVariants } from "@/components/ui/Button";
import { AcademicIdCard } from "@/components/common/AcademicIdCard";

interface ApplicationStatusPanelProps {
  departments: Department[];
  onStartReapply: (profile: Profile) => void;
  onBackToRegister: () => void;
}

export function ApplicationStatusPanel({
  departments,
  onStartReapply,
  onBackToRegister,
}: ApplicationStatusPanelProps) {
  const [lookupEmail, setLookupEmail] = useState("");
  const [searched, setSearched] = useState(false);
  const [foundProfile, setFoundProfile] = useState<Profile | null>(null);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupEmail.trim()) return;
    const match = adminService.getProfileByEmail(lookupEmail);
    setFoundProfile(match ?? null);
    setSearched(true);
  };

  const dept = departments.find((d) => d.id === foundProfile?.department_id);
  const status =
    foundProfile?.account_status === "rejected"
      ? "rejected"
      : foundProfile?.account_status === "suspended"
      ? "suspended"
      : foundProfile?.is_approved
      ? "active"
      : "pending";

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-semibold text-fg tracking-tight">
          Check application status
        </h1>
        <p className="text-xs sm:text-sm text-fg-muted leading-relaxed">
          Enter your registered email to track verification, view admin feedback, or correct and re-apply.
        </p>
      </div>

      <form onSubmit={handleLookup} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <div className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 text-fg-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="email"
            required
            value={lookupEmail}
            onChange={(e) => {
              setLookupEmail(e.target.value);
              if (searched) setSearched(false);
            }}
            placeholder="name@unicampus.edu"
            className="w-full h-11 pl-10 pr-3.5 rounded-xl bg-surface border border-line text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-colors"
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          size="md"
          className="h-11 px-5 rounded-xl shrink-0 whitespace-nowrap"
        >
          Check status
        </Button>
      </form>

      {searched && !foundProfile && (
        <div className="p-5 rounded-2xl bg-surface border border-line text-center space-y-2">
          <p className="text-sm font-semibold text-fg">
            No registration found for &ldquo;{lookupEmail}&rdquo;
          </p>
          <p className="text-xs text-fg-muted">
            Double-check your email address or start a new student/faculty application.
          </p>
          <div className="pt-2">
            <Button type="button" variant="secondary" size="sm" onClick={onBackToRegister}>
              Start New Registration
            </Button>
          </div>
        </div>
      )}

      {searched && foundProfile && (
        <div className="space-y-5">
          {status === "rejected" && (
            <div className="p-5 rounded-2xl bg-danger-light/70 border border-danger/30 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-danger/15 text-danger flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="text-sm font-semibold text-danger">
                    Application Rejected — Action Required
                  </div>
                  <p className="text-xs text-fg">
                    Applicant: <strong>{foundProfile.full_name}</strong> (
                    <span className="font-mono">
                      {foundProfile.student_id || foundProfile.teacher_code}
                    </span>
                    )
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-surface border border-danger/25 space-y-1 text-xs">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-danger">
                  Admin Rejection Reason / Note
                </div>
                <p className="text-fg leading-relaxed font-medium">
                  {foundProfile.rejection_reason ||
                    "Your application requires corrections before verification."}
                </p>
                {foundProfile.reviewed_by && (
                  <p className="text-[11px] text-fg-muted pt-1">
                    Reviewed by {foundProfile.reviewed_by}
                    {foundProfile.reviewed_at
                      ? ` on ${new Date(foundProfile.reviewed_at).toLocaleDateString()}`
                      : ""}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2.5">
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={() => onStartReapply(foundProfile)}
                  leftIcon={<Edit3 className="w-4 h-4" />}
                >
                  Edit &amp; Re-Apply with Corrections
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => {
                    setFoundProfile(null);
                    setSearched(false);
                    setLookupEmail("");
                  }}
                  leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                >
                  Close
                </Button>
              </div>
            </div>
          )}

          {status === "pending" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-warning-light border border-warning/30 flex items-start gap-3 text-xs">
                <Clock className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-semibold text-fg">
                    Pending Administrative Verification
                  </div>
                  <p className="text-fg-muted leading-relaxed">
                    Your dossier for <strong>{foundProfile.full_name}</strong> is currently in the verification queue for{" "}
                    <strong>{foundProfile.department_name || dept?.name}</strong>.
                  </p>
                </div>
              </div>

              <AcademicIdCard
                role={foundProfile.role === "teacher" ? "teacher" : "student"}
                academicId={
                  foundProfile.student_id || foundProfile.teacher_code || "PENDING"
                }
                fullName={foundProfile.full_name}
                departmentName={foundProfile.department_name || dept?.name || "CSE"}
                departmentCode={dept?.code || "CSE"}
                photoUrl={foundProfile.avatar_url || null}
                semesterName={foundProfile.semester_name}
                designation={foundProfile.teacher_qualifications?.designation}
                bloodGroup={foundProfile.blood_group}
                phone={foundProfile.phone}
                emergencyPhone={foundProfile.emergency_phone}
                dateOfBirth={foundProfile.date_of_birth}
              />
            </div>
          )}

          {status === "active" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-success-light border border-success/30 flex items-start gap-3 text-xs">
                <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-semibold text-fg">
                    Registration Approved &amp; Active
                  </div>
                  <p className="text-fg-muted leading-relaxed">
                    Your account has been verified. You can now sign in to your UniCampus portal.
                  </p>
                </div>
              </div>

              <AcademicIdCard
                role={foundProfile.role === "teacher" ? "teacher" : "student"}
                academicId={
                  foundProfile.student_id || foundProfile.teacher_code || "ACTIVE"
                }
                fullName={foundProfile.full_name}
                departmentName={foundProfile.department_name || dept?.name || "CSE"}
                departmentCode={dept?.code || "CSE"}
                photoUrl={foundProfile.avatar_url || null}
                semesterName={foundProfile.semester_name}
                designation={foundProfile.teacher_qualifications?.designation}
                bloodGroup={foundProfile.blood_group}
                phone={foundProfile.phone}
                emergencyPhone={foundProfile.emergency_phone}
                dateOfBirth={foundProfile.date_of_birth}
              />

              <Link
                href="/login"
                className={buttonVariants({ variant: "primary", size: "lg", fullWidth: true })}
              >
                Proceed to Sign In
                <ArrowRight className="w-4 h-4 shrink-0" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
