"use client";

import { useState } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import ProfileAvatar from "@/components/common/ProfileAvatar";
import { Switch } from "@/components/common/Switch";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Tabs, TabOption } from "@/components/ui/Tabs";
import { CANONICAL_FACULTY, CANONICAL_STUDENT } from "@/lib/canonicalCampus";
import { 
  Bell, 
  ShieldCheck, 
  User, 
  Save, 
  Check, 
  KeyRound
} from "lucide-react";

type SettingsTab = "general" | "notifications" | "security";

export default function SettingsPage() {
  const { currentUser } = useAdminAuth();
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");

  // State toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [routineUpdates, setRoutineUpdates] = useState(true);
  const [twoFactor, setTwoFactor] = useState(true);

  const isTeacher = currentUser?.role === "teacher";
  const isAdmin = currentUser?.role === "admin";
  const displayName =
    currentUser?.full_name ||
    (isTeacher ? CANONICAL_FACULTY.name : CANONICAL_STUDENT.name);
  const displayEmail =
    currentUser?.email ||
    (isTeacher ? CANONICAL_FACULTY.email : CANONICAL_STUDENT.email);
  const displayDepartment =
    currentUser?.department_name ||
    (isTeacher ? CANONICAL_FACULTY.departmentName : CANONICAL_STUDENT.departmentName);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const tabs: TabOption<SettingsTab>[] = [
    { id: "general", label: "General", icon: <User className="w-3.5 h-3.5" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="w-3.5 h-3.5" /> },
    { id: "security", label: "Security", icon: <ShieldCheck className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="w-full space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-fg tracking-tight">
            Portal Settings
          </h1>
          <p className="text-xs md:text-sm text-fg-muted mt-1">
            Manage your account security, notification rules, and preferences.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleSave}
          className="self-start md:self-auto"
        >
          {saved ? (
            <>
              <Check className="w-4 h-4" />
              <span>Changes Saved</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Preferences</span>
            </>
          )}
        </Button>
      </div>

      {/* Tabs */}
      <div className="w-full max-w-full overflow-x-auto">
        <Tabs
          tabs={tabs}
          value={activeTab}
          onChange={(tab) => setActiveTab(tab)}
          variant="segmented"
          size="sm"
        />
      </div>

      {/* Tab 1: General */}
      {activeTab === "general" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Avatar Card */}
          <div className="lg:col-span-4 rounded-[20px] bg-surface border border-line p-6 flex flex-col items-center text-center">
            <ProfileAvatar
              alt={displayName}
              size="lg"
              className="w-24 h-24 rounded-2xl ring-4 ring-line"
            />
            <h3 className="font-semibold text-base text-fg mt-3">
              {displayName}
            </h3>
            <p className="text-xs text-fg-muted">{displayDepartment}</p>
            <span className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand/10 text-brand">
              {isTeacher
                ? `Faculty Code: ${currentUser?.teacher_code || CANONICAL_FACULTY.facultyCode}`
                : isAdmin
                ? "Admin Account"
                : `Student ID: ${currentUser?.student_id || CANONICAL_STUDENT.studentId}`}
            </span>

            <div className="w-full mt-6 pt-5 border-t border-line text-left space-y-2.5 text-xs">
              <div className="flex justify-between gap-2">
                <span className="text-fg-muted">Role:</span>
                <span className="font-semibold text-fg">
                  {isAdmin
                    ? "System Administrator"
                    : isTeacher
                    ? "Faculty Member"
                    : "Undergraduate Student"}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-fg-muted">{isTeacher ? "Designation:" : isAdmin ? "Access Level:" : "Intake:"}</span>
                <span className="font-semibold text-fg">
                  {isTeacher ? CANONICAL_FACULTY.designation : isAdmin ? "Super Admin" : CANONICAL_STUDENT.batch}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-fg-muted">Status:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Active Enrollment</span>
              </div>
            </div>
          </div>

          {/* Right: Form Inputs */}
          <div className="lg:col-span-8 rounded-[20px] bg-surface border border-line p-6 space-y-5">
            <h2 className="text-base font-semibold text-fg">Profile Information</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-fg font-medium">Display Name</label>
                <input
                  key={`name-${currentUser?.id ?? "default"}`}
                  type="text"
                  defaultValue={displayName}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-line text-fg placeholder:text-fg-muted outline-hidden focus:border-brand text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-fg font-medium">University Email</label>
                <input
                  key={`email-${currentUser?.id ?? "default"}`}
                  type="email"
                  defaultValue={displayEmail}
                  disabled
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-line text-fg-muted outline-hidden cursor-not-allowed text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-fg font-medium">Phone Number</label>
                <input
                  key={`phone-${currentUser?.id ?? "default"}`}
                  type="tel"
                  defaultValue={isTeacher ? CANONICAL_FACULTY.phone : CANONICAL_STUDENT.phone}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-line text-fg placeholder:text-fg-muted outline-hidden focus:border-brand text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-fg font-medium">Primary Campus</label>
                <select
                  defaultValue="permanent"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-line text-fg outline-hidden focus:border-brand text-xs cursor-pointer"
                >
                  <option value="permanent">Main Campus (Birulia)</option>
                  <option value="city">City Campus (Dhanmondi)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-line space-y-1.5 text-xs">
              <label className="text-fg font-medium">Emergency Contact</label>
              <input
                key={`emergency-${currentUser?.id ?? "default"}`}
                type="text"
                defaultValue={`Father: ${CANONICAL_STUDENT.emergencyPhone}`}
                className="w-full px-3.5 py-2.5 rounded-xl bg-canvas border border-line text-fg placeholder:text-fg-muted outline-hidden focus:border-brand text-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Notifications */}
      {activeTab === "notifications" && (
        <div className="rounded-[20px] bg-surface border border-line p-6 space-y-5 max-w-3xl">
          <h2 className="text-base font-semibold text-fg">Notification Channels &amp; Triggers</h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-xl bg-canvas border border-line">
              <div className="space-y-0.5 pr-4">
                <h4 className="text-xs sm:text-sm font-semibold text-fg">Email Announcements</h4>
                <p className="text-xs text-fg-muted">
                  Receive official university notices and emergency alerts via university email.
                </p>
              </div>
              <Switch checked={emailAlerts} onChange={setEmailAlerts} ariaLabel="Toggle email announcements" />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-canvas border border-line">
              <div className="space-y-0.5 pr-4">
                <h4 className="text-xs sm:text-sm font-semibold text-fg">SMS Urgent Notifications</h4>
                <p className="text-xs text-fg-muted">
                  Get instant SMS messages for class cancellations, exams, and payment deadlines.
                </p>
              </div>
              <Switch checked={smsAlerts} onChange={setSmsAlerts} ariaLabel="Toggle SMS urgent alerts" />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-canvas border border-line">
              <div className="space-y-0.5 pr-4">
                <h4 className="text-xs sm:text-sm font-semibold text-fg">Routine &amp; Timetable Alerts</h4>
                <p className="text-xs text-fg-muted">
                  Notify 15 minutes before active lectures start.
                </p>
              </div>
              <Switch checked={routineUpdates} onChange={setRoutineUpdates} ariaLabel="Toggle routine alerts" />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Security */}
      {activeTab === "security" && (
        <div className="rounded-[20px] bg-surface border border-line p-6 space-y-5 max-w-3xl">
          <h2 className="text-base font-semibold text-fg">Security &amp; Account Access</h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3 p-4 rounded-xl bg-canvas border border-line">
              <div className="space-y-0.5 pr-4">
                <h4 className="text-xs sm:text-sm font-semibold text-fg">Two-Factor Authentication (2FA)</h4>
                <p className="text-xs text-fg-muted">
                  Secure your university portal with authenticator OTP verification.
                </p>
              </div>
              <Switch checked={twoFactor} onChange={setTwoFactor} ariaLabel="Toggle two-factor authentication" />
            </div>

            <div className="flex items-center justify-between gap-3 flex-wrap p-4 rounded-xl bg-canvas border border-line">
              <div className="space-y-0.5 pr-4 min-w-0">
                <h4 className="text-xs sm:text-sm font-semibold text-fg">Institutional Session</h4>
                <p className="text-xs text-fg-muted">
                  Signed in with your verified UniCampus institutional credentials.
                </p>
              </div>
              <Badge variant="success">Verified</Badge>
            </div>

            <div className="pt-4 border-t border-line flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-fg">Account Password</h4>
                <p className="text-xs text-fg-muted">Last updated 3 weeks ago</p>
              </div>
              <Button variant="secondary" size="sm">
                <KeyRound className="w-3.5 h-3.5" />
                <span>Change Password</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
