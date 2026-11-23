"use client";

import { Select } from "@/components/ui/Select";

import { memo } from "react";
import { Switch } from "@/components/common/Switch";
import { type SettingsFormState } from "./settingsTypes";

interface NotificationsTabProps {
  form: SettingsFormState;
  isTeacher: boolean;
  onUpdateField: <K extends keyof SettingsFormState>(
    key: K,
    value: SettingsFormState[K]
  ) => void;
}

export const NotificationsTab = memo(function NotificationsTab({
  form,
  isTeacher,
  onUpdateField,
}: NotificationsTabProps) {
  return (
    <div className="rounded-2xl bg-surface border border-line p-6 space-y-5 max-w-3xl">
      <h2 className="text-base font-semibold text-fg">
        Notification Channels &amp; Triggers
      </h2>

      {isTeacher ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-canvas border border-line">
            <div className="space-y-0.5">
              <h3 className="text-sm font-medium text-fg">
                Student Direct Messages
              </h3>
              <p className="text-xs text-fg-muted">
                Notify when enrolled students send course questions or advising requests.
              </p>
            </div>
            <Switch
              checked={form.studentDirectMessages}
              onChange={(val) => onUpdateField("studentDirectMessages", val)}
              ariaLabel="Toggle student direct messages"
            />
          </div>

          <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-canvas border border-line">
            <div className="space-y-0.5">
              <h3 className="text-sm font-medium text-fg">
                Exam Controller &amp; Admin Circulars
              </h3>
              <p className="text-xs text-fg-muted">
                Immediate alerts for official institutional notices and pinned mandates.
              </p>
            </div>
            <Switch
              checked={form.examControllerCirculars}
              onChange={(val) => onUpdateField("examControllerCirculars", val)}
              ariaLabel="Toggle exam controller and admin circulars"
            />
          </div>

          <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-canvas border border-line">
            <div className="space-y-0.5">
              <h3 className="text-sm font-medium text-fg">
                Upcoming Class Reminders (15 min before)
              </h3>
              <p className="text-xs text-fg-muted">
                Receive a prompt with room number and attendance launch shortcut.
              </p>
            </div>
            <Switch
              checked={form.upcomingClassReminders}
              onChange={(val) => onUpdateField("upcomingClassReminders", val)}
              ariaLabel="Toggle upcoming class reminders"
            />
          </div>

          <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-canvas border border-line">
            <div className="space-y-0.5">
              <h3 className="text-sm font-medium text-fg">
                Grade Submission Deadlines
              </h3>
              <p className="text-xs text-fg-muted">
                Reminders 48 hours and 12 hours before registrar gradebook lock.
              </p>
            </div>
            <Switch
              checked={form.gradeSubmissionDeadlines}
              onChange={(val) => onUpdateField("gradeSubmissionDeadlines", val)}
              ariaLabel="Toggle grade submission deadlines"
            />
          </div>

          <div className="pt-4 border-t border-line space-y-1.5 max-w-xs">
            <label
              htmlFor="settings-email-digest"
              className="block text-xs font-medium text-fg"
            >
              Email Digest Frequency
            </label>
            <Select
              id="settings-email-digest"
              ariaLabel="Email Digest Frequency"
              value={form.emailDigest}
              onChange={(val) =>
                onUpdateField(
                  "emailDigest",
                  val as SettingsFormState["emailDigest"]
                )
              }
              options={[
                { value: "Instant", label: "Instant" },
                { value: "Daily", label: "Daily Summary" },
                { value: "Off", label: "Off" },
              ]}
              size="md"
              variant="surface2"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-canvas border border-line">
            <div className="space-y-0.5">
              <h3 className="text-sm font-medium text-fg">
                Email Announcements
              </h3>
              <p className="text-xs text-fg-muted">
                Receive official university notices and emergency alerts via university email.
              </p>
            </div>
            <Switch
              checked={form.emailAlerts}
              onChange={(val) => onUpdateField("emailAlerts", val)}
              ariaLabel="Toggle email announcements"
            />
          </div>

          <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-canvas border border-line">
            <div className="space-y-0.5">
              <h3 className="text-sm font-medium text-fg">
                SMS Urgent Notifications
              </h3>
              <p className="text-xs text-fg-muted">
                Get instant SMS messages for class cancellations, exams, and payment deadlines.
              </p>
            </div>
            <Switch
              checked={form.smsAlerts}
              onChange={(val) => onUpdateField("smsAlerts", val)}
              ariaLabel="Toggle SMS urgent alerts"
            />
          </div>

          <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-canvas border border-line">
            <div className="space-y-0.5">
              <h3 className="text-sm font-medium text-fg">
                Routine &amp; Timetable Alerts
              </h3>
              <p className="text-xs text-fg-muted">
                Notify 15 minutes before active lectures start.
              </p>
            </div>
            <Switch
              checked={form.routineUpdates}
              onChange={(val) => onUpdateField("routineUpdates", val)}
              ariaLabel="Toggle routine alerts"
            />
          </div>
        </div>
      )}
    </div>
  );
});
