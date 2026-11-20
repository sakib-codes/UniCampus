"use client";

import { memo } from "react";
import { Switch } from "@/components/common/Switch";
import { Badge } from "@/components/ui/Badge";
import { SETTINGS_INPUT_CLASS, type SettingsFormState } from "./settingsTypes";

interface TeachingTabProps {
  form: SettingsFormState;
  onUpdateField: <K extends keyof SettingsFormState>(
    key: K,
    value: SettingsFormState[K]
  ) => void;
}

export const TeachingTab = memo(function TeachingTab({
  form,
  onUpdateField,
}: TeachingTabProps) {
  return (
    <div className="space-y-5 max-w-3xl">
      {/* Office Availability */}
      <div className="rounded-2xl bg-surface border border-line p-6 space-y-4">
        <h2 className="text-base font-semibold text-fg">
          Office Availability
        </h2>

        <div className="space-y-1.5 max-w-sm">
          <label
            htmlFor="settings-default-availability"
            className="block text-xs font-medium text-fg"
          >
            Default Availability Status
          </label>
          <select
            id="settings-default-availability"
            value={form.defaultAvailability}
            onChange={(e) =>
              onUpdateField(
                "defaultAvailability",
                e.target.value as SettingsFormState["defaultAvailability"]
              )
            }
            className={`${SETTINGS_INPUT_CLASS} cursor-pointer`}
          >
            <option value="In Office">In Office</option>
            <option value="Online">Online</option>
            <option value="By Appointment">By Appointment</option>
          </select>
        </div>

        <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-canvas border border-line">
          <div className="space-y-0.5">
            <h3 className="text-sm font-medium text-fg">
              Automatically show &lsquo;In Class&rsquo; during scheduled routine hours
            </h3>
            <p className="text-xs text-fg-muted">
              Syncs your live directory badge with your weekly teaching timetable.
            </p>
          </div>
          <Switch
            checked={form.autoInClassStatus}
            onChange={(val) => onUpdateField("autoInClassStatus", val)}
            ariaLabel="Automatically show In Class during scheduled routine hours"
          />
        </div>
      </div>

      {/* Live Attendance Defaults */}
      <div className="rounded-2xl bg-surface border border-line p-6 space-y-4">
        <h2 className="text-base font-semibold text-fg">
          Live Attendance Defaults
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label
              htmlFor="settings-qr-interval"
              className="block text-xs font-medium text-fg"
            >
              Default QR Rotation Interval
            </label>
            <select
              id="settings-qr-interval"
              value={form.qrInterval}
              onChange={(e) =>
                onUpdateField(
                  "qrInterval",
                  e.target.value as SettingsFormState["qrInterval"]
                )
              }
              className={`${SETTINGS_INPUT_CLASS} cursor-pointer`}
            >
              <option value="15s">15 seconds (Recommended)</option>
              <option value="30s">30 seconds</option>
              <option value="60s">60 seconds</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="settings-grace-period"
              className="block text-xs font-medium text-fg"
            >
              Late Check-in Grace Period
            </label>
            <select
              id="settings-grace-period"
              value={form.lateGracePeriod}
              onChange={(e) =>
                onUpdateField(
                  "lateGracePeriod",
                  e.target.value as SettingsFormState["lateGracePeriod"]
                )
              }
              className={`${SETTINGS_INPUT_CLASS} cursor-pointer`}
            >
              <option value="10 min">10 minutes</option>
              <option value="15 min">15 minutes</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-canvas border border-line">
          <div className="space-y-0.5">
            <h3 className="text-sm font-medium text-fg">
              Enable 6-digit Backup PIN for projector glare
            </h3>
            <p className="text-xs text-fg-muted">
              Displays a rotating 6-digit code alongside the classroom QR for students with camera glare.
            </p>
          </div>
          <Switch
            checked={form.enableBackupPin}
            onChange={(val) => onUpdateField("enableBackupPin", val)}
            ariaLabel="Enable 6-digit Backup PIN for projector glare"
          />
        </div>
      </div>

      {/* Gradebook & Advising */}
      <div className="rounded-2xl bg-surface border border-line p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-semibold text-fg">
            Gradebook &amp; Advising
          </h2>
          <Badge variant="neutral">UGC 4.00 Scale</Badge>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-canvas border border-line">
            <div className="space-y-0.5">
              <h3 className="text-sm font-medium text-fg">
                Allow students to request advising slots
              </h3>
              <p className="text-xs text-fg-muted">
                Enables 15-minute consultation bookings during your published office hours.
              </p>
            </div>
            <Switch
              checked={form.allowAdvisingRequests}
              onChange={(val) => onUpdateField("allowAdvisingRequests", val)}
              ariaLabel="Allow students to request advising slots"
            />
          </div>

          <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-canvas border border-line">
            <div className="space-y-0.5">
              <h3 className="text-sm font-medium text-fg">
                Auto-save gradebook edits
              </h3>
              <p className="text-xs text-fg-muted">
                Automatically save draft score changes as you navigate cells.
              </p>
            </div>
            <Switch
              checked={form.autoSaveGradebook}
              onChange={(val) => onUpdateField("autoSaveGradebook", val)}
              ariaLabel="Auto-save gradebook edits"
            />
          </div>
        </div>
      </div>
    </div>
  );
});
