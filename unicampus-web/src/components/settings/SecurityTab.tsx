"use client";

import { memo } from "react";
import { KeyRound, Monitor, Smartphone } from "lucide-react";
import { Switch } from "@/components/common/Switch";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SETTINGS_INPUT_CLASS, type SettingsFormState } from "./settingsTypes";

interface SecurityTabProps {
  twoFactor: boolean;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  otherSessionsActive: boolean;
  onToggleTwoFactor: (val: boolean) => void;
  onCurrentPasswordChange: (val: string) => void;
  onNewPasswordChange: (val: string) => void;
  onConfirmPasswordChange: (val: string) => void;
  onPasswordSubmit: (e: React.FormEvent) => void;
  onSignOutOtherSessions: () => void;
}

export const SecurityTab = memo(function SecurityTab({
  twoFactor,
  currentPassword,
  newPassword,
  confirmPassword,
  otherSessionsActive,
  onToggleTwoFactor,
  onCurrentPasswordChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onPasswordSubmit,
  onSignOutOtherSessions,
}: SecurityTabProps) {
  return (
    <div className="space-y-5 max-w-3xl">
      {/* Two-Factor Authentication */}
      <div className="rounded-2xl bg-surface border border-line p-6 space-y-4">
        <h2 className="text-base font-semibold text-fg">
          Security &amp; Account Access
        </h2>

        <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-canvas border border-line">
          <div className="space-y-0.5">
            <h3 className="text-sm font-medium text-fg">
              Two-Factor Authentication (2FA)
            </h3>
            <p className="text-xs text-fg-muted">
              Secure your university portal with authenticator OTP verification.
            </p>
          </div>
          <Switch
            checked={twoFactor}
            onChange={onToggleTwoFactor}
            ariaLabel="Toggle two-factor authentication"
          />
        </div>

        <div className="flex items-center justify-between gap-3 flex-wrap p-4 rounded-xl bg-canvas border border-line">
          <div className="space-y-0.5 min-w-0">
            <h3 className="text-sm font-medium text-fg">
              Institutional Session
            </h3>
            <p className="text-xs text-fg-muted">
              Signed in with your verified UniCampus institutional credentials.
            </p>
          </div>
          <Badge variant="success">Verified</Badge>
        </div>
      </div>

      {/* Change Password Form */}
      <form
        onSubmit={onPasswordSubmit}
        className="rounded-2xl bg-surface border border-line p-6 space-y-4"
      >
        <div className="flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-brand" />
          <h2 className="text-base font-semibold text-fg">
            Change Password
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 sm:col-span-2">
            <label
              htmlFor="settings-current-password"
              className="block text-xs font-medium text-fg"
            >
              Current Password
            </label>
            <input
              id="settings-current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => onCurrentPasswordChange(e.target.value)}
              placeholder="Enter current password"
              className={SETTINGS_INPUT_CLASS}
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="settings-new-password"
              className="block text-xs font-medium text-fg"
            >
              New Password
            </label>
            <input
              id="settings-new-password"
              type="password"
              value={newPassword}
              onChange={(e) => onNewPasswordChange(e.target.value)}
              placeholder="Minimum 8 characters"
              className={SETTINGS_INPUT_CLASS}
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="settings-confirm-password"
              className="block text-xs font-medium text-fg"
            >
              Confirm New Password
            </label>
            <input
              id="settings-confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => onConfirmPasswordChange(e.target.value)}
              placeholder="Re-enter new password"
              className={SETTINGS_INPUT_CLASS}
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" variant="secondary" size="sm">
            Update Password
          </Button>
        </div>
      </form>

      {/* Active Sessions */}
      <div className="rounded-2xl bg-surface border border-line p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-fg">
              Active Sessions
            </h2>
            <p className="text-xs text-fg-muted mt-0.5">
              Devices currently signed in to your UniCampus account.
            </p>
          </div>
          {otherSessionsActive && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onSignOutOtherSessions}
            >
              Sign out other sessions
            </Button>
          )}
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-canvas border border-line">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-surface-2 border border-line flex items-center justify-center text-brand shrink-0">
                <Monitor className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-fg truncate">
                  Current Desktop Session
                </p>
                <p className="text-xs text-fg-muted">
                  Chrome on Linux • Dhaka, BD • Active now
                </p>
              </div>
            </div>
            <Badge variant="success">Current</Badge>
          </div>

          {otherSessionsActive && (
            <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-canvas border border-line">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-surface-2 border border-line flex items-center justify-center text-fg-muted shrink-0">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-fg truncate">
                    UniCampus Mobile Companion
                  </p>
                  <p className="text-xs text-fg-muted">
                    Android • Dhaka, BD • Last active 2 hours ago
                  </p>
                </div>
              </div>
              <Badge variant="neutral">Active</Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export type { SettingsFormState };
