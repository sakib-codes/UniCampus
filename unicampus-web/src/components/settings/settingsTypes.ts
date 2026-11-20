export type SettingsTab = "general" | "teaching" | "notifications" | "security";

export interface SettingsFormState {
  displayName: string;
  phone: string;
  officeRoom: string;
  campus: string;
  emergencyContact: string;
  // Teaching & Office (Faculty)
  defaultAvailability: "In Office" | "Online" | "By Appointment";
  autoInClassStatus: boolean;
  qrInterval: "15s" | "30s" | "60s";
  lateGracePeriod: "10 min" | "15 min";
  enableBackupPin: boolean;
  allowAdvisingRequests: boolean;
  autoSaveGradebook: boolean;
  // Notifications
  studentDirectMessages: boolean;
  examControllerCirculars: boolean;
  upcomingClassReminders: boolean;
  gradeSubmissionDeadlines: boolean;
  emailDigest: "Instant" | "Daily" | "Off";
  // Student notifications fallback
  emailAlerts: boolean;
  smsAlerts: boolean;
  routineUpdates: boolean;
  // Security
  twoFactor: boolean;
}

export const SETTINGS_INPUT_CLASS =
  "w-full min-h-[44px] sm:min-h-[40px] px-3.5 py-2 rounded-xl bg-canvas border border-line text-fg placeholder:text-fg-muted text-sm font-sans focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:border-brand";
