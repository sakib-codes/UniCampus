"use client";

import { memo } from "react";
import { Camera, Lock } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CANONICAL_FACULTY, CANONICAL_STUDENT } from "@/lib/canonicalCampus";
import { SETTINGS_INPUT_CLASS, type SettingsFormState } from "./settingsTypes";

interface GeneralTabProps {
  form: SettingsFormState;
  isTeacher: boolean;
  isAdmin: boolean;
  resolvedEmail: string;
  resolvedDepartment: string;
  teacherCode?: string | null;
  studentId?: string | null;
  onUpdateField: <K extends keyof SettingsFormState>(
    key: K,
    value: SettingsFormState[K]
  ) => void;
  onNotifyPhotoSync: () => void;
}

export const GeneralTab = memo(function GeneralTab({
  form,
  isTeacher,
  isAdmin,
  resolvedEmail,
  resolvedDepartment,
  teacherCode,
  studentId,
  onUpdateField,
  onNotifyPhotoSync,
}: GeneralTabProps) {
  const avatarInitialsName = isTeacher ? "Asif Rahman" : form.displayName;
  const resolvedTeacherCode = teacherCode || CANONICAL_FACULTY.facultyCode;
  const resolvedStudentId = studentId || CANONICAL_STUDENT.studentId;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left: Identity Summary Card */}
      <div className="lg:col-span-4 rounded-2xl bg-surface border border-line p-6 flex flex-col items-center text-center">
        <Avatar
          name={avatarInitialsName}
          alt={form.displayName}
          size="2xl"
          className="bg-brand-soft text-brand border-brand/20"
        />
        <Button
          variant="secondary"
          size="sm"
          className="mt-3"
          onClick={onNotifyPhotoSync}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Change Photo</span>
        </Button>

        <h2 className="font-semibold text-base text-fg mt-4">
          {form.displayName}
        </h2>
        <p className="text-xs text-fg-muted mt-0.5">{resolvedDepartment}</p>

        <span className="mt-2.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-sans font-medium bg-brand-soft text-brand border border-brand/20">
          {isTeacher ? (
            <>
              <span>Faculty Code:</span>
              <span className="font-mono">{resolvedTeacherCode}</span>
            </>
          ) : isAdmin ? (
            <span>Admin Account</span>
          ) : (
            <>
              <span>Student ID:</span>
              <span className="font-mono">{resolvedStudentId}</span>
            </>
          )}
        </span>

        <div className="w-full mt-6 pt-5 border-t border-line text-left space-y-2.5 text-xs font-sans">
          <div className="flex justify-between gap-2">
            <span className="text-fg-muted">Department:</span>
            <span className="font-medium text-fg text-right">
              {resolvedDepartment}
            </span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-fg-muted">
              {isTeacher ? "Designation:" : isAdmin ? "Access Level:" : "Intake:"}
            </span>
            <span className="font-medium text-fg text-right">
              {isTeacher
                ? CANONICAL_FACULTY.designation
                : isAdmin
                ? "Super Admin"
                : CANONICAL_STUDENT.batch}
            </span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-fg-muted">Status:</span>
            <span className="text-success font-semibold">
              {isTeacher
                ? "Active Faculty"
                : isAdmin
                ? "Active Admin"
                : "Active Enrollment"}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Academic Identity & Contact Form */}
      <div className="lg:col-span-8 rounded-2xl bg-surface border border-line p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-semibold text-fg">
            {isTeacher ? "Academic Identity & Contact" : "Profile Information"}
          </h2>
          {isTeacher && (
            <Badge variant="brand">{CANONICAL_FACULTY.designation}</Badge>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label
              htmlFor="settings-display-name"
              className="block text-xs font-medium text-fg"
            >
              Display Name
            </label>
            <input
              id="settings-display-name"
              type="text"
              value={form.displayName}
              onChange={(e) => onUpdateField("displayName", e.target.value)}
              className={SETTINGS_INPUT_CLASS}
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="settings-email"
              className="block text-xs font-medium text-fg"
            >
              University Email
            </label>
            <div className="relative">
              <input
                id="settings-email"
                type="email"
                value={resolvedEmail}
                disabled
                className="w-full min-h-[44px] sm:min-h-[40px] pl-3.5 pr-9 py-2 rounded-xl bg-surface-2 border border-line text-fg-muted cursor-not-allowed text-sm font-sans"
              />
              <Lock
                className="w-3.5 h-3.5 text-fg-subtle absolute right-3 top-1/2 -translate-y-1/2"
                aria-hidden="true"
              />
            </div>
            <p className="text-[12px] text-fg-muted">
              Managed by University Registrar
            </p>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="settings-phone"
              className="block text-xs font-medium text-fg"
            >
              Direct Phone
            </label>
            <input
              id="settings-phone"
              type="tel"
              value={form.phone}
              onChange={(e) => onUpdateField("phone", e.target.value)}
              className={SETTINGS_INPUT_CLASS}
            />
          </div>

          {isTeacher && (
            <div className="space-y-1.5">
              <label
                htmlFor="settings-office-room"
                className="block text-xs font-medium text-fg"
              >
                Office Room
              </label>
              <input
                id="settings-office-room"
                type="text"
                value={form.officeRoom}
                onChange={(e) => onUpdateField("officeRoom", e.target.value)}
                className={SETTINGS_INPUT_CLASS}
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label
              htmlFor="settings-campus"
              className="block text-xs font-medium text-fg"
            >
              Primary Campus
            </label>
            <select
              id="settings-campus"
              value={form.campus}
              onChange={(e) => onUpdateField("campus", e.target.value)}
              className={`${SETTINGS_INPUT_CLASS} cursor-pointer`}
            >
              <option value="permanent">Main Campus (Birulia)</option>
              <option value="city">City Campus (Dhanmondi)</option>
            </select>
          </div>

          <div className="space-y-1.5 sm:col-span-2 pt-2 border-t border-line">
            <label
              htmlFor="settings-emergency-contact"
              className="block text-xs font-medium text-fg"
            >
              Emergency Contact
            </label>
            <input
              id="settings-emergency-contact"
              type="text"
              placeholder="Name & phone number"
              value={form.emergencyContact}
              onChange={(e) =>
                onUpdateField("emergencyContact", e.target.value)
              }
              className={SETTINGS_INPUT_CLASS}
            />
          </div>
        </div>
      </div>
    </div>
  );
});
