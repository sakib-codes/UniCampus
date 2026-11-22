"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  FileText,
  User,
  GraduationCap,
  ShieldAlert,
  Phone,
  MapPin,
  CreditCard,
} from "lucide-react";
import { Badge, Button, Modal } from "@/components/ui";
import { formatYearSemester } from "@/lib/canonicalCampus";
import type { UserRecord } from "./usersData";

interface RegistrationReviewModalProps {
  user: UserRecord | null;
  initialRejectMode?: boolean;
  onClose: () => void;
  onApprove: (user: UserRecord) => void;
  onReject: (user: UserRecord, reason: string) => void;
}

const STUDENT_REJECTION_PRESETS = [
  "Admission payment TrxID or pay slip screenshot could not be verified.",
  "SSC/HSC Roll or Registration number does not match board records.",
  "Uploaded SSC/HSC marksheet is unclear or missing. Please re-upload.",
  "Birth Certificate / NID number is invalid or incomplete.",
  "Guardian (Father/Mother) contact details require correction.",
];

const TEACHER_REJECTION_PRESETS = [
  "Degree certificate / official transcript is missing or unreadable.",
  "Academic CV is incomplete. Please include publication & teaching history.",
  "National ID (NID) verification failed. Please re-check your NID number.",
  "Requested designation requires verified postgraduate/Ph.D. credentials.",
];

export function RegistrationReviewModal({
  user,
  initialRejectMode = false,
  onClose,
  onApprove,
  onReject,
}: RegistrationReviewModalProps) {
  const [showRejectBox, setShowRejectBox] = useState(initialRejectMode);
  const [rejectionReason, setRejectionReason] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  if (!user) return null;

  const p = user.profile;
  const isStudent = user.role === "student";
  const presets = isStudent ? STUDENT_REJECTION_PRESETS : TEACHER_REJECTION_PRESETS;

  const handleConfirmReject = () => {
    if (!rejectionReason.trim()) {
      setErrorMsg("Please enter a clear reason or note so the applicant knows what to correct.");
      return;
    }
    onReject(user, rejectionReason.trim());
    setRejectionReason("");
    setShowRejectBox(false);
    setErrorMsg("");
    onClose();
  };

  return (
    <Modal
      open={Boolean(user)}
      onClose={onClose}
      size="xl"
      title="Registration Dossier & Verification Review"
      description="Inspect submitted credentials before approving access or rejecting with correction instructions."
    >
      <div className="space-y-5 pt-1 pb-2 max-h-[75dvh] overflow-y-auto pr-1">
        {/* Applicant Header Card */}
        <div className="p-4 rounded-2xl bg-surface-2 border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-14 h-14 rounded-xl bg-surface border border-line overflow-hidden flex items-center justify-center shrink-0">
              {p.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.avatar_url}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-base font-bold text-brand">{user.initials}</span>
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-semibold text-fg truncate">{user.name}</h3>
                <Badge variant={isStudent ? "neutral" : "brand"}>
                  {isStudent ? "Student" : "Faculty"}
                </Badge>
                {user.status === "active" && <Badge variant="success">Approved</Badge>}
                {user.status === "pending" && <Badge variant="warning">Pending Review</Badge>}
                {user.status === "rejected" && <Badge variant="danger">Rejected</Badge>}
                {p.email_verified && <Badge variant="success">Email Verified</Badge>}
                {p.phone_verified && <Badge variant="success">Phone Verified</Badge>}
              </div>
              <p className="text-xs text-fg-muted mt-0.5 truncate">
                {user.email} • {user.department}
              </p>
              <div className="flex items-center gap-2 mt-1 text-xs">
                <span className="inline-flex items-center gap-1 font-mono font-semibold text-brand bg-brand-soft px-2 py-0.5 rounded border border-brand/25">
                  <CreditCard className="w-3 h-3" />
                  ID: {user.id}
                </span>
                {isStudent && p.semester_name && (
                  <span className="text-fg-muted font-medium">
                    {formatYearSemester(p.semester_name)}
                  </span>
                )}
              </div>
              {isStudent && p.program_name && (
                <p className="text-xs font-medium text-fg mt-1">
                  Program: <span className="text-brand">{p.program_name}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Existing Rejection Note Banner (if previously rejected) */}
        {p.rejection_reason && (
          <div className="p-3.5 rounded-xl bg-danger-light border border-danger/25 space-y-1 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-danger">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Previous Rejection Note</span>
            </div>
            <p className="text-fg leading-relaxed">{p.rejection_reason}</p>
            {p.reviewed_by && (
              <p className="text-[11px] text-fg-muted">
                Reviewed by {p.reviewed_by}
                {p.reviewed_at ? ` • ${new Date(p.reviewed_at).toLocaleDateString()}` : ""}
              </p>
            )}
          </div>
        )}

        {/* Personal & National Identity Section */}
        <div className="p-4 rounded-xl bg-surface border border-line space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-fg border-b border-line pb-2">
            <User className="w-4 h-4 text-brand" />
            <span>Personal &amp; National Identity Details</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-fg-muted block text-[11px]">Mobile Phone</span>
              <strong className="text-fg font-mono">{p.phone || "Not provided"}</strong>
            </div>
            <div>
              <span className="text-fg-muted block text-[11px]">Date of Birth</span>
              <strong className="text-fg">{p.date_of_birth || "Not provided"}</strong>
            </div>
            <div>
              <span className="text-fg-muted block text-[11px]">Blood Group / Gender</span>
              <strong className="text-fg">
                {p.blood_group || "N/A"} {p.gender ? `• ${p.gender}` : ""}
              </strong>
            </div>
            <div className="col-span-2 sm:col-span-2">
              <span className="text-fg-muted block text-[11px]">
                {p.id_document_type || "NID / Birth Certificate"} Number
              </span>
              <strong className="text-fg font-mono">
                {p.nid_or_birth_cert || "Not provided"}
              </strong>
            </div>
            <div>
              <span className="text-fg-muted block text-[11px]">Nationality / Religion</span>
              <strong className="text-fg">
                {p.nationality || "Bangladeshi"}
                {p.religion ? ` • ${p.religion}` : ""}
              </strong>
            </div>
            <div className="col-span-2 sm:col-span-3 flex items-start gap-1.5 pt-1 border-t border-line/60">
              <MapPin className="w-3.5 h-3.5 text-fg-muted shrink-0 mt-0.5" />
              <div>
                <span className="text-fg-muted">Present: </span>
                <strong className="text-fg">{p.present_address || "Not provided"}</strong>
                {p.permanent_address && (
                  <>
                    <span className="text-fg-muted"> • Permanent: </span>
                    <strong className="text-fg">{p.permanent_address}</strong>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Student-Specific: Parents & Board Exams (JSC, SSC, HSC) */}
        {isStudent && (
          <>
            <div className="p-4 rounded-xl bg-surface border border-line space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-fg border-b border-line pb-2">
                <Phone className="w-4 h-4 text-brand" />
                <span>Parents &amp; Guardian Contacts</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-surface-2 border border-line">
                  <span className="text-[11px] text-fg-muted block">Father&apos;s Name &amp; Phone</span>
                  <strong className="text-fg block">{p.father_name || "Not provided"}</strong>
                  <span className="font-mono text-fg-muted">{p.father_phone || "—"}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-2 border border-line">
                  <span className="text-[11px] text-fg-muted block">Mother&apos;s Name &amp; Phone</span>
                  <strong className="text-fg block">{p.mother_name || "Not provided"}</strong>
                  <span className="font-mono text-fg-muted">{p.mother_phone || "—"}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface border border-line space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-fg border-b border-line pb-2">
                <GraduationCap className="w-4 h-4 text-brand" />
                <span>Bangladeshi Board Examination Records (JSC / SSC / HSC)</span>
              </div>
              {p.board_exams && p.board_exams.length > 0 ? (
                <div className="overflow-x-auto border border-line rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-surface-2 border-b border-line text-fg-muted">
                      <tr>
                        <th className="py-2 px-3 font-semibold">Exam</th>
                        <th className="py-2 px-3 font-semibold">Board &amp; Group</th>
                        <th className="py-2 px-3 font-semibold">Year</th>
                        <th className="py-2 px-3 font-semibold">Roll / Reg No</th>
                        <th className="py-2 px-3 font-semibold">GPA</th>
                        <th className="py-2 px-3 font-semibold">Marksheet</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {p.board_exams.map((ex, i) => (
                        <tr key={`${ex.exam}-${i}`}>
                          <td className="py-2 px-3 font-semibold text-brand">{ex.exam}</td>
                          <td className="py-2 px-3 text-fg">
                            {ex.board}
                            {ex.group ? ` (${ex.group})` : ""}
                            {ex.institution && (
                              <span className="block text-[11px] text-fg-muted">{ex.institution}</span>
                            )}
                          </td>
                          <td className="py-2 px-3 font-mono text-fg">{ex.passing_year}</td>
                          <td className="py-2 px-3 font-mono text-fg">
                            <div>Roll: {ex.roll_number || "—"}</div>
                            {ex.registration_number && (
                              <div className="text-[11px] text-fg-muted">
                                Reg: {ex.registration_number}
                              </div>
                            )}
                          </td>
                          <td className="py-2 px-3 font-mono font-bold text-success">{ex.gpa}</td>
                          <td className="py-2 px-3">
                            {ex.marksheet_filename ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-brand-soft text-brand text-[11px] font-medium">
                                <FileText className="w-3 h-3 shrink-0" />
                                <span className="truncate max-w-[140px]">{ex.marksheet_filename}</span>
                              </span>
                            ) : (
                              <span className="text-fg-subtle text-[11px]">Not attached</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-fg-muted">
                  No board examination records attached to this legacy profile.
                </p>
              )}
            </div>

            {/* Admission Fee Payment Proof */}
            <div className="p-4 rounded-xl bg-surface border border-line space-y-3">
              <div className="flex items-center justify-between gap-2 text-xs font-semibold text-fg border-b border-line pb-2">
                <span className="inline-flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-brand" />
                  <span>Admission Fee Payment Proof</span>
                </span>
                {p.admission_payment?.trx_id ? (
                  <Badge variant="brand">{p.admission_payment.method}</Badge>
                ) : (
                  <Badge variant="neutral">Not Submitted</Badge>
                )}
              </div>
              {p.admission_payment?.trx_id ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-fg-muted block text-[11px]">Transaction ID / Slip No.</span>
                      <strong className="text-fg font-mono">{p.admission_payment.trx_id}</strong>
                    </div>
                    <div>
                      <span className="text-fg-muted block text-[11px]">Amount Paid</span>
                      <strong className="text-fg tabular-nums">
                        ৳{Number(p.admission_payment.amount || 0).toLocaleString()}
                      </strong>
                    </div>
                    <div>
                      <span className="text-fg-muted block text-[11px]">Payment Date</span>
                      <strong className="text-fg tabular-nums">
                        {p.admission_payment.paid_date || "—"}
                      </strong>
                    </div>
                  </div>
                  {p.admission_payment.slip_filename && (
                    <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-surface-2 border border-line text-xs">
                      <span className="inline-flex items-center gap-2 text-fg font-medium truncate">
                        <FileText className="w-4 h-4 text-brand shrink-0" />
                        <span className="truncate">{p.admission_payment.slip_filename}</span>
                      </span>
                      <span className="text-[11px] text-success font-semibold shrink-0">Attached</span>
                    </div>
                  )}
                  {p.admission_payment.slip_preview_url && (
                    <div className="rounded-xl overflow-hidden border border-line bg-surface-2 max-h-52 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.admission_payment.slip_preview_url}
                        alt="Admission payment slip"
                        className="max-h-52 w-auto object-contain"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-fg-muted">
                  No admission payment TrxID or pay slip attached to this application.
                </p>
              )}
            </div>
          </>
        )}

        {/* Teacher-Specific: Academic Qualifications & CV */}
        {!isStudent && p.teacher_qualifications && (
          <div className="p-4 rounded-xl bg-surface border border-line space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-fg border-b border-line pb-2">
              <GraduationCap className="w-4 h-4 text-brand" />
              <span>Faculty Appointment &amp; Academic Qualifications</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-fg-muted block text-[11px]">Designation</span>
                <strong className="text-fg">{p.teacher_qualifications.designation}</strong>
              </div>
              <div>
                <span className="text-fg-muted block text-[11px]">Employment / Exp.</span>
                <strong className="text-fg">
                  {p.teacher_qualifications.employment_type} •{" "}
                  {p.teacher_qualifications.experience_years} yrs
                </strong>
              </div>
              <div>
                <span className="text-fg-muted block text-[11px]">Highest Degree</span>
                <strong className="text-fg">{p.teacher_qualifications.highest_degree}</strong>
              </div>
              <div className="col-span-2 sm:col-span-3">
                <span className="text-fg-muted block text-[11px]">Research Specialization</span>
                <strong className="text-fg">{p.teacher_qualifications.specialization}</strong>
              </div>
              <div className="col-span-2 sm:col-span-3 p-2.5 rounded-lg bg-surface-2 border border-line space-y-1">
                <div>
                  <span className="text-fg-muted">Undergraduate: </span>
                  <strong className="text-fg">
                    {p.teacher_qualifications.undergrad_degree} —{" "}
                    {p.teacher_qualifications.undergrad_university} (
                    {p.teacher_qualifications.undergrad_year}, CGPA{" "}
                    {p.teacher_qualifications.undergrad_cgpa})
                  </strong>
                </div>
                {p.teacher_qualifications.postgrad_degree && (
                  <div>
                    <span className="text-fg-muted">Postgraduate: </span>
                    <strong className="text-fg">
                      {p.teacher_qualifications.postgrad_degree} —{" "}
                      {p.teacher_qualifications.postgrad_university} (
                      {p.teacher_qualifications.postgrad_year})
                    </strong>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {p.teacher_qualifications.cv_filename && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-soft text-brand text-xs font-medium border border-brand/20">
                  <FileText className="w-3.5 h-3.5" />
                  <span>CV: {p.teacher_qualifications.cv_filename}</span>
                </span>
              )}
              {p.teacher_qualifications.certificate_filename && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-success-light text-success text-xs font-medium border border-success/20">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Certificate: {p.teacher_qualifications.certificate_filename}</span>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Rejection Reason Composer */}
        {showRejectBox && (
          <div className="p-4 rounded-xl bg-danger-light/60 border border-danger/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-danger flex items-center gap-1.5">
                <XCircle className="w-4 h-4" />
                <span>Rejection Reason / Correction Note for Applicant *</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  setShowRejectBox(false);
                  setErrorMsg("");
                }}
                className="text-xs text-fg-muted hover:text-fg cursor-pointer"
              >
                Cancel
              </button>
            </div>

            {/* Quick-select presets */}
            <div className="flex flex-wrap gap-1.5">
              {presets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setRejectionReason(preset);
                    setErrorMsg("");
                  }}
                  className="px-2.5 py-1 rounded-lg bg-surface border border-line hover:border-danger/50 text-[11px] text-fg-muted hover:text-fg text-left cursor-pointer transition-colors"
                >
                  + {preset}
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => {
                setRejectionReason(e.target.value);
                if (errorMsg) setErrorMsg("");
              }}
              placeholder="Write a clear explanation of what is missing or incorrect so the applicant can fix it and re-apply..."
              className="w-full rounded-xl bg-surface border border-line focus:border-danger focus:outline-none focus:ring-2 focus:ring-danger/15 p-3 text-xs text-fg placeholder:text-fg-subtle resize-none"
            />

            {errorMsg && (
              <p className="text-xs font-semibold text-danger">{errorMsg}</p>
            )}

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={handleConfirmReject}
                leftIcon={<XCircle className="w-3.5 h-3.5" />}
              >
                Confirm Rejection &amp; Send Note
              </Button>
            </div>
          </div>
        )}

        {/* Footer Decision Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-line">
          <Button type="button" variant="secondary" size="md" onClick={onClose}>
            Close
          </Button>

          <div className="flex flex-wrap items-center gap-2.5">
            {!showRejectBox && user.status !== "active" && (
              <Button
                type="button"
                variant="danger"
                size="md"
                onClick={() => setShowRejectBox(true)}
                leftIcon={<XCircle className="w-4 h-4" />}
              >
                Reject with Reason
              </Button>
            )}

            {user.status !== "active" && (
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={() => {
                  onApprove(user);
                  onClose();
                }}
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
              >
                Approve &amp; Activate Account
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
