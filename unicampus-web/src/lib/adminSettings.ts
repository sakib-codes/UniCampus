export const ADMIN_SETTINGS_STORAGE_KEY = "unicampus_admin_settings_v1";
export const ADMIN_SETTINGS_UPDATED_EVENT = "unicampus:admin-settings-updated";

export interface AdminSettingsData {
  highDensityTable: boolean;
  pushNotifications: boolean;
  sessionTimeoutMinutes: number;
  maintenanceMode: boolean;
  maintenanceReason: string;
}

export const DEFAULT_ADMIN_SETTINGS: AdminSettingsData = {
  highDensityTable: true,
  pushNotifications: true,
  sessionTimeoutMinutes: 45,
  maintenanceMode: false,
  maintenanceReason: "Scheduled term-end grade synchronization & maintenance",
};

export function clampSessionTimeout(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_ADMIN_SETTINGS.sessionTimeoutMinutes;
  return Math.min(1440, Math.max(5, Math.round(value)));
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
    };
  } catch {
    return DEFAULT_ADMIN_SETTINGS;
  }
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
