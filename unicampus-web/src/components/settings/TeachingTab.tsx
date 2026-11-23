"use client";

import { Select } from "@/components/ui/Select";

import { memo } from "react";
import { Switch } from "@/components/common/Switch";
import { Badge } from "@/components/ui/Badge";
import { type SettingsFormState } from "./settingsTypes";

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
          <Select
            id="settings-default-availability"
            ariaLabel="Default Availability Status"
            value={form.defaultAvailability}
            onChange={(val) =>
              onUpdateField(
                "defaultAvailability",
                val as SettingsFormState["defaultAvailability"]
              )
            }
            options={[
              { value: "In Office", label: "In Office" },
              { value: "Online", label: "Online" },
              { value: "By Appointment", label: "By Appointment" },
            ]}
            size="md"
            variant="surface2"
          />
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
            <Select
              id="settings-qr-interval"
              ariaLabel="Default QR Rotation Interval"
              value={form.qrInterval}
              onChange={(val) =>
                onUpdateField(
                  "qrInterval",
                  val as SettingsFormState["qrInterval"]
                )
              }
              options={[
                { value: "15s", label: "15 seconds (Recommended)" },
                { value: "30s", label: "30 seconds" },
                { value: "60s", label: "60 seconds" },
              ]}
              size="md"
              variant="surface2"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="settings-grace-period"
              className="block text-xs font-medium text-fg"
            >
              Late Check-in Grace Period
            </label>
            <Select
              id="settings-grace-period"
              ariaLabel="Late Check-in Grace Period"
              value={form.lateGracePeriod}
              onChange={(val) =>
                onUpdateField(
                  "lateGracePeriod",
                  val as SettingsFormState["lateGracePeriod"]
                )
              }
              options={[
                { value: "10 min", label: "10 minutes" },
                { value: "15 min", label: "15 minutes" },
              ]}
              size="md"
              variant="surface2"
            />
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
