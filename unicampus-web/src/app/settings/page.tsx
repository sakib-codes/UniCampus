"use client";

import { useCallback, useMemo, useState } from "react";
import {
  Bell,
  BookOpen,
  Check,
  RotateCcw,
  Save,
  ShieldCheck,
  User,
} from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { Button } from "@/components/ui/Button";
import { Tabs, TabOption } from "@/components/ui/Tabs";
import { Toast } from "@/components/ui/Toast";
import { CANONICAL_FACULTY, CANONICAL_STUDENT } from "@/lib/canonicalCampus";
import {
  GeneralTab,
  TeachingTab,
  NotificationsTab,
  SecurityTab,
  type SettingsTab,
  type SettingsFormState,
} from "@/components/settings";

export default function SettingsPage() {
  const { currentUser } = useAdminAuth();
  const isTeacher = currentUser?.role === "teacher";
  const isAdmin = currentUser?.role === "admin";

  const resolvedName =
    currentUser?.full_name ||
    (isTeacher ? CANONICAL_FACULTY.name : CANONICAL_STUDENT.name);
  const resolvedEmail =
    currentUser?.email ||
    (isTeacher ? CANONICAL_FACULTY.email : CANONICAL_STUDENT.email);
  const resolvedDepartment =
    currentUser?.department_name ||
    (isTeacher
      ? CANONICAL_FACULTY.departmentName
      : CANONICAL_STUDENT.departmentName);
  const resolvedPhone = isTeacher
    ? CANONICAL_FACULTY.phone
    : CANONICAL_STUDENT.phone;
  const resolvedEmergency = isTeacher
    ? "Next of Kin: +880 1711-223344"
    : `Father: ${CANONICAL_STUDENT.emergencyPhone}`;

  const initialForm = useMemo<SettingsFormState>(
    () => ({
      displayName: resolvedName,
      phone: resolvedPhone,
      officeRoom: CANONICAL_FACULTY.office,
      campus: "permanent",
      emergencyContact: resolvedEmergency,
      defaultAvailability: "In Office",
      autoInClassStatus: true,
      qrInterval: "15s",
      lateGracePeriod: "10 min",
      enableBackupPin: true,
      allowAdvisingRequests: true,
      autoSaveGradebook: true,
      studentDirectMessages: true,
      examControllerCirculars: true,
      upcomingClassReminders: true,
      gradeSubmissionDeadlines: true,
      emailDigest: "Daily",
      emailAlerts: true,
      smsAlerts: false,
      routineUpdates: true,
      twoFactor: true,
    }),
    [resolvedName, resolvedPhone, resolvedEmergency]
  );

  const [savedSnapshot, setSavedSnapshot] = useState<SettingsFormState>(initialForm);
  const [form, setForm] = useState<SettingsFormState>(initialForm);
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otherSessionsActive, setOtherSessionsActive] = useState(true);
  const [toast, setToast] = useState<{ open: boolean; message: string }>({
    open: false,
    message: "",
  });

  const isDirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(savedSnapshot),
    [form, savedSnapshot]
  );

  const updateField = useCallback(
    <K extends keyof SettingsFormState>(key: K, value: SettingsFormState[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleSave = () => {
    setSavedSnapshot(form);
    setToast({ open: true, message: "Preferences saved" });
  };

  const handleDiscard = () => {
    setForm(savedSnapshot);
    setToast({ open: true, message: "Unsaved changes discarded" });
  };

  const handleNotifyPhotoSync = useCallback(() => {
    setToast({
      open: true,
      message: "Photo upload is synced with the Institutional ID Portal.",
    });
  }, []);

  const handlePasswordSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!currentPassword || !newPassword || newPassword !== confirmPassword) {
        setToast({
          open: true,
          message: "Please verify your current and matching new password.",
        });
        return;
      }
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setToast({ open: true, message: "Account password updated successfully." });
    },
    [currentPassword, newPassword, confirmPassword]
  );

  const handleSignOutOtherSessions = useCallback(() => {
    setOtherSessionsActive(false);
    setToast({
      open: true,
      message: "Signed out of all other sessions.",
    });
  }, []);

  const tabs: TabOption<SettingsTab>[] = isTeacher
    ? [
        { id: "general", label: "General", icon: <User className="w-3.5 h-3.5" /> },
        {
          id: "teaching",
          label: "Teaching & Office",
          icon: <BookOpen className="w-3.5 h-3.5" />,
        },
        {
          id: "notifications",
          label: "Notifications",
          icon: <Bell className="w-3.5 h-3.5" />,
        },
        {
          id: "security",
          label: "Security",
          icon: <ShieldCheck className="w-3.5 h-3.5" />,
        },
      ]
    : [
        { id: "general", label: "General", icon: <User className="w-3.5 h-3.5" /> },
        {
          id: "notifications",
          label: "Notifications",
          icon: <Bell className="w-3.5 h-3.5" />,
        },
        {
          id: "security",
          label: "Security",
          icon: <ShieldCheck className="w-3.5 h-3.5" />,
        },
      ];

  return (
    <div className="w-full space-y-6 pb-16">
      {/* Header with Dirty-State Save Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-fg tracking-tight">
            Portal Settings
          </h1>
          <p className="text-xs sm:text-sm text-fg-muted mt-1 font-sans">
            {isTeacher
              ? "Manage your faculty profile, teaching defaults, notifications, and account security."
              : "Manage your account security, notification rules, and preferences."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          {!isDirty ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-fg-muted mr-1">
              <Check className="w-3.5 h-3.5 text-success" />
              <span>All changes saved</span>
            </span>
          ) : (
            <Button variant="secondary" size="sm" onClick={handleDiscard}>
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Discard</span>
            </Button>
          )}

          <Button
            variant="primary"
            size="sm"
            disabled={!isDirty}
            onClick={handleSave}
            className={
              isDirty
                ? "bg-brand text-on-brand hover:bg-brand-hover"
                : "opacity-50 cursor-not-allowed"
            }
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Preferences</span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="w-full max-w-full overflow-x-auto">
        <Tabs<SettingsTab>
          tabs={tabs}
          value={activeTab}
          onChange={setActiveTab}
          variant="segmented"
          size="sm"
          ariaLabel="Settings sections"
        />
      </div>

      {activeTab === "general" && (
        <GeneralTab
          form={form}
          isTeacher={isTeacher}
          isAdmin={isAdmin}
          resolvedEmail={resolvedEmail}
          resolvedDepartment={resolvedDepartment}
          teacherCode={currentUser?.teacher_code}
          studentId={currentUser?.student_id}
          onUpdateField={updateField}
          onNotifyPhotoSync={handleNotifyPhotoSync}
        />
      )}

      {activeTab === "teaching" && isTeacher && (
        <TeachingTab form={form} onUpdateField={updateField} />
      )}

      {activeTab === "notifications" && (
        <NotificationsTab
          form={form}
          isTeacher={isTeacher}
          onUpdateField={updateField}
        />
      )}

      {activeTab === "security" && (
        <SecurityTab
          twoFactor={form.twoFactor}
          currentPassword={currentPassword}
          newPassword={newPassword}
          confirmPassword={confirmPassword}
          otherSessionsActive={otherSessionsActive}
          onToggleTwoFactor={(val) => updateField("twoFactor", val)}
          onCurrentPasswordChange={setCurrentPassword}
          onNewPasswordChange={setNewPassword}
          onConfirmPasswordChange={setConfirmPassword}
          onPasswordSubmit={handlePasswordSubmit}
          onSignOutOtherSessions={handleSignOutOtherSessions}
        />
      )}

      <Toast
        open={toast.open}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        tone="success"
        message={toast.message}
        durationMs={3000}
      />
    </div>
  );
}
