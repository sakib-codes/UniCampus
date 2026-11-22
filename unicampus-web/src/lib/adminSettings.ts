export const ADMIN_SETTINGS_STORAGE_KEY = "unicampus_admin_settings_v1";
export const ADMIN_SETTINGS_UPDATED_EVENT = "unicampus:admin-settings-updated";

export type WeekdayShort = "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";

export const ALL_WEEKDAYS: readonly WeekdayShort[] = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
] as const;

export const WEEKDAY_FULL_NAMES: Record<WeekdayShort, string> = {
  Sun: "Sunday",
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
};

export interface AdminSettingsData {
  highDensityTable: boolean;
  pushNotifications: boolean;
  sessionTimeoutMinutes: number;
  maintenanceMode: boolean;
  maintenanceReason: string;
  weeklyHolidays: WeekdayShort[];
}

export const DEFAULT_ADMIN_SETTINGS: AdminSettingsData = {
  highDensityTable: true,
  pushNotifications: true,
  sessionTimeoutMinutes: 45,
  maintenanceMode: false,
  maintenanceReason: "Scheduled term-end grade synchronization & maintenance",
  weeklyHolidays: ["Fri", "Sat"],
};

export function clampSessionTimeout(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_ADMIN_SETTINGS.sessionTimeoutMinutes;
  return Math.min(1440, Math.max(5, Math.round(value)));
}

function normalizeWeeklyHolidays(raw: unknown): WeekdayShort[] {
  if (!Array.isArray(raw)) return DEFAULT_ADMIN_SETTINGS.weeklyHolidays;
  const valid = raw.filter((d): d is WeekdayShort =>
    ALL_WEEKDAYS.includes(d as WeekdayShort)
  );
  // Guarantee at least 1 active working day
  return valid.length >= ALL_WEEKDAYS.length
    ? DEFAULT_ADMIN_SETTINGS.weeklyHolidays
    : Array.from(new Set(valid));
}

export function readAdminSettings(): AdminSettingsData {
  if (typeof window === "undefined") {
    return DEFAULT_ADMIN_SETTINGS;
  }
  try {
    const raw = window.localStorage.getItem(ADMIN_SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_ADMIN_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<AdminSettingsData>;
    return {
      ...DEFAULT_ADMIN_SETTINGS,
      ...parsed,
      sessionTimeoutMinutes: clampSessionTimeout(
        typeof parsed.sessionTimeoutMinutes === "number"
          ? parsed.sessionTimeoutMinutes
          : DEFAULT_ADMIN_SETTINGS.sessionTimeoutMinutes
      ),
      weeklyHolidays: normalizeWeeklyHolidays(parsed.weeklyHolidays),
    };
  } catch {
    return DEFAULT_ADMIN_SETTINGS;
  }
}

export function getActiveWorkingDays(holidays?: WeekdayShort[]): WeekdayShort[] {
  const offDays = new Set(holidays ?? readAdminSettings().weeklyHolidays);
  return ALL_WEEKDAYS.filter((day) => !offDays.has(day));
}

export function getActiveWorkingDayFullNames(holidays?: WeekdayShort[]): string[] {
  return getActiveWorkingDays(holidays).map((d) => WEEKDAY_FULL_NAMES[d]);
}

export function applyAdminDensity(highDensityTable: boolean): void {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute(
    "data-density",
    highDensityTable ? "compact" : "comfortable"
  );
}

export function syncAdminDensityFromStorage(): void {
  const settings = readAdminSettings();
  applyAdminDensity(settings.highDensityTable);
}
