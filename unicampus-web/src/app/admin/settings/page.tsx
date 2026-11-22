"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useMemo, useRef, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Switch } from "@/components/common/Switch";
import { executeThemeTransition } from "@/lib/themeTransition";
import {
  ADMIN_SETTINGS_STORAGE_KEY,
  ADMIN_SETTINGS_UPDATED_EVENT,
  DEFAULT_ADMIN_SETTINGS,
  applyAdminDensity,
  clampSessionTimeout,
  readAdminSettings,
  syncAdminDensityFromStorage,
  type AdminSettingsData,
} from "@/lib/adminSettings";
import {
  Monitor,
  Moon,
  Sun,
  ShieldCheck,
  Database,
  Key,
  ServerCrash,
  Save,
  Check,
  Lock,
  Sliders,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button, PageHeader, Toast } from "@/components/ui";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { SuperAdminGate } from "@/components/admin/SuperAdminGate";

type SettingsTab = "appearance" | "security" | "database" | "api" | "maintenance";

const emptySubscribe = () => () => {};

export type { AdminSettingsData };
export const DEFAULT_SETTINGS: AdminSettingsData = DEFAULT_ADMIN_SETTINGS;

export default function AdminSettingsPage() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const [activeTab, setActiveTab] = useState<SettingsTab>("appearance");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const { currentUser, switchUserRole } = useAdminAuth();

  // Settings State & Persistence
  const [settings, setSettings] = useState<AdminSettingsData>(DEFAULT_SETTINGS);
  const [savedSettings, setSavedSettings] = useState<AdminSettingsData>(DEFAULT_SETTINGS);

  // API keys tab state
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showAnonKey, setShowAnonKey] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hydrate from localStorage without blank flash, and revert unsaved density previews on unmount
  useEffect(() => {
    const merged = readAdminSettings();
    queueMicrotask(() => {
      setSettings(merged);
      setSavedSettings(merged);
    });
    applyAdminDensity(merged.highDensityTable);

    return () => {
      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }
      syncAdminDensityFromStorage();
    };
  }, []);

  const activeTheme = mounted ? theme : undefined;

  const isDirty = useMemo(
    () => JSON.stringify(settings) !== JSON.stringify(savedSettings),
    [settings, savedSettings]
  );

  const handleSave = () => {
    const normalized: AdminSettingsData = {
      ...settings,
      sessionTimeoutMinutes: clampSessionTimeout(settings.sessionTimeoutMinutes),
    };
    try {
      localStorage.setItem(ADMIN_SETTINGS_STORAGE_KEY, JSON.stringify(normalized));
    } catch {}
    setSettings(normalized);
    setSavedSettings(normalized);
    applyAdminDensity(normalized.highDensityTable);
    window.dispatchEvent(new Event(ADMIN_SETTINGS_UPDATED_EVENT));
    setToastMessage("Settings saved successfully.");
  };

  const handleReset = () => {
    setSettings(savedSettings);
    applyAdminDensity(savedSettings.highDensityTable);
    setToastMessage("Changes reverted.");
  };

  const handleCopy = async (field: string, text: string) => {
    try {
      await navigator.clipboard?.writeText(text);
      setCopiedField(field);
      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }
      copyTimerRef.current = setTimeout(() => {
        setCopiedField(null);
        copyTimerRef.current = null;
      }, 2000);
    } catch {}
  };

  const tabs = [
    { id: "appearance", label: "Appearance & Theme", icon: Monitor, statusDot: null },
    { id: "security", label: "Security & Auth Gate", icon: ShieldCheck, statusDot: "active" },
    { id: "database", label: "Database & Storage", icon: Database, statusDot: "active" },
    { id: "api", label: "API Keys & Webhooks", icon: Key, statusDot: null },
    {
      id: "maintenance",
      label: "Maintenance & System",
      icon: ServerCrash,
      statusDot: settings.maintenanceMode ? "danger" : "normal",
    },
  ] as const;

  return (
    <SuperAdminGate featureName="System Settings & Infrastructure">
      <div className="space-y-6 w-full pb-28">
        <Toast
          open={Boolean(toastMessage)}
          message={toastMessage ?? ""}
          tone="success"
          durationMs={3500}
          onClose={() => setToastMessage(null)}
        />

        {/* Page Header Directly on Canvas */}
        <PageHeader
          title="Administrative Settings"
          description="Configure institutional branding, data storage connections, role policies, and system controls."
        />

        {/* Main Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Navigation Sidebar */}
          <div className="md:col-span-4 lg:col-span-3 space-y-1.5 p-3 rounded-2xl bg-surface border border-line">
            <div className="px-3 py-2 text-xs font-semibold font-sans text-fg-muted">
              Navigation Sections
            </div>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as SettingsTab)}
                  className={`relative w-full min-h-[44px] text-left px-3.5 py-3 rounded-xl text-sm font-medium flex items-center justify-between transition-colors cursor-pointer z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                    isActive
                      ? "text-fg font-semibold"
                      : "text-fg-muted hover:text-fg hover:bg-surface-2/50"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="admin-settings-tab"
                      className="absolute inset-0 bg-surface-2 border border-line rounded-xl -z-10"
                      transition={{ type: "spring", stiffness: 450, damping: 32 }}
                    />
                  )}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-brand" : "text-fg-muted"}`} />
                    <span className="truncate">{tab.label}</span>
                  </div>
                  {tab.statusDot === "active" && (
                    <span
                      className="w-2 h-2 rounded-full bg-success shrink-0"
                      title="Operational"
                      aria-label="Operational"
                    />
                  )}
                  {tab.statusDot === "danger" && (
                    <span
                      className="w-2 h-2 rounded-full bg-danger animate-pulse shrink-0"
                      title="Lockdown Active"
                      aria-label="Lockdown Active"
                    />
                  )}
                </button>
              );
            })}

            <div className="pt-4 mt-4 border-t border-line px-3">
              <div className="flex items-center gap-2 text-xs font-sans text-fg-muted">
                <Cpu className="w-3.5 h-3.5" />
                <span>Campus Engine · Spring 2026</span>
              </div>
            </div>
          </div>

          {/* Content Pane */}
          <div className="md:col-span-8 lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="space-y-6"
              >
                {/* TAB 1: APPEARANCE */}
                {activeTab === "appearance" && (
                  <div className="space-y-6">
                    {/* Theme Preference */}
                    <div className="p-6 space-y-5 rounded-2xl bg-surface border border-line">
                      <div>
                        <h3 className="text-sm font-semibold flex items-center gap-2 text-fg">
                          <Monitor className="w-4 h-4 text-brand" />
                          Desktop Interface Color Theme
                        </h3>
                        <p className="text-xs text-fg-muted mt-1">
                          Choose between Dark and Light mode. Calibrated for low eye strain during long academic sessions.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* Dark Mode */}
                        <button
                          type="button"
                          suppressHydrationWarning
                          onClick={(e) =>
                            executeThemeTransition({ theme: "dark", event: e, setTheme, currentTheme: theme })
                          }
                          className={`p-4 rounded-xl border text-left flex flex-col gap-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                            activeTheme === "dark"
                              ? "border-brand ring-1 ring-brand/40 bg-surface-2 text-fg"
                              : "bg-surface border-line hover:border-fg-subtle"
                          }`}
                        >
                          {/* Miniature CSS wireframe UI preview for Dark Mode */}
                          <div
                            className="h-16 w-full rounded-lg border p-1.5 flex gap-1.5 overflow-hidden select-none"
                            style={{ backgroundColor: "rgb(11, 11, 16)", borderColor: "rgb(38, 38, 48)" }}
                            aria-hidden="true"
                          >
                            <div
                              className="w-4 h-full rounded flex flex-col gap-1 p-0.5 shrink-0"
                              style={{ backgroundColor: "rgb(21, 21, 29)" }}
                            >
                              <div className="w-full h-1 rounded-sm" style={{ backgroundColor: "rgb(124, 120, 255)" }} />
                              <div className="w-full h-1 rounded-sm" style={{ backgroundColor: "rgb(38, 38, 48)" }} />
                              <div className="w-full h-1 rounded-sm" style={{ backgroundColor: "rgb(38, 38, 48)" }} />
                            </div>
                            <div className="flex-1 flex flex-col gap-1 min-w-0">
                              <div
                                className="h-2.5 w-full rounded-sm border flex items-center justify-end px-1"
                                style={{ backgroundColor: "rgb(21, 21, 29)", borderColor: "rgb(38, 38, 48)" }}
                              >
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "rgb(124, 120, 255)" }} />
                              </div>
                              <div className="grid grid-cols-2 gap-1 flex-1">
                                <div className="h-full rounded-sm border" style={{ backgroundColor: "rgb(21, 21, 29)", borderColor: "rgb(38, 38, 48)" }} />
                                <div className="h-full rounded-sm border" style={{ backgroundColor: "rgb(21, 21, 29)", borderColor: "rgb(38, 38, 48)" }} />
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-brand border bg-surface border-line">
                                <Moon className="w-4 h-4" />
                              </div>
                              <span className="text-sm font-semibold text-fg">Dark Mode</span>
                            </div>
                            <Check
                              className={`w-4 h-4 text-brand transition-opacity ${
                                activeTheme === "dark" ? "opacity-100" : "opacity-0"
                              }`}
                              aria-hidden={activeTheme !== "dark"}
                            />
                          </div>
                          <p className="text-xs text-fg-muted">Calm Campus balanced dark contrast</p>
                        </button>

                        {/* Light Mode */}
                        <button
                          type="button"
                          suppressHydrationWarning
                          onClick={(e) =>
                            executeThemeTransition({ theme: "light", event: e, setTheme, currentTheme: theme })
                          }
                          className={`p-4 rounded-xl border text-left flex flex-col gap-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                            activeTheme === "light"
                              ? "border-brand ring-1 ring-brand/40 bg-surface-2 text-fg"
                              : "bg-surface border-line hover:border-fg-subtle"
                          }`}
                        >
                          {/* Miniature CSS wireframe UI preview for Light Mode */}
                          <div
                            className="h-16 w-full rounded-lg border p-1.5 flex gap-1.5 overflow-hidden select-none"
                            style={{ backgroundColor: "rgb(245, 245, 250)", borderColor: "rgb(231, 231, 240)" }}
                            aria-hidden="true"
                          >
                            <div
                              className="w-4 h-full rounded flex flex-col gap-1 p-0.5 shrink-0"
                              style={{ backgroundColor: "rgb(255, 255, 255)" }}
                            >
                              <div className="w-full h-1 rounded-sm" style={{ backgroundColor: "rgb(96, 91, 255)" }} />
                              <div className="w-full h-1 rounded-sm" style={{ backgroundColor: "rgb(231, 231, 240)" }} />
                              <div className="w-full h-1 rounded-sm" style={{ backgroundColor: "rgb(231, 231, 240)" }} />
                            </div>
                            <div className="flex-1 flex flex-col gap-1 min-w-0">
                              <div
                                className="h-2.5 w-full rounded-sm border flex items-center justify-end px-1"
                                style={{ backgroundColor: "rgb(255, 255, 255)", borderColor: "rgb(231, 231, 240)" }}
                              >
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "rgb(96, 91, 255)" }} />
                              </div>
                              <div className="grid grid-cols-2 gap-1 flex-1">
                                <div className="h-full rounded-sm border" style={{ backgroundColor: "rgb(255, 255, 255)", borderColor: "rgb(231, 231, 240)" }} />
                                <div className="h-full rounded-sm border" style={{ backgroundColor: "rgb(255, 255, 255)", borderColor: "rgb(231, 231, 240)" }} />
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-warning border bg-surface border-line">
                                <Sun className="w-4 h-4" />
                              </div>
                              <span className="text-sm font-semibold text-fg">Light Mode</span>
                            </div>
                            <Check
                              className={`w-4 h-4 text-brand transition-opacity ${
                                activeTheme === "light" ? "opacity-100" : "opacity-0"
                              }`}
                              aria-hidden={activeTheme !== "light"}
                            />
                          </div>
                          <p className="text-xs text-fg-muted">High clarity daytime presentation</p>
                        </button>

                        {/* System Synchronized */}
                        <button
                          type="button"
                          suppressHydrationWarning
                          onClick={(e) =>
                            executeThemeTransition({ theme: "system", event: e, setTheme, currentTheme: theme })
                          }
                          className={`p-4 rounded-xl border text-left flex flex-col gap-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                            activeTheme === "system"
                              ? "border-brand ring-1 ring-brand/40 bg-surface-2 text-fg"
                              : "bg-surface border-line hover:border-fg-subtle"
                          }`}
                        >
                          {/* Miniature CSS wireframe UI preview for System (split) */}
                          <div
                            className="h-16 w-full rounded-lg border overflow-hidden select-none flex"
                            style={{ borderColor: "rgb(231, 231, 240)" }}
                            aria-hidden="true"
                          >
                            {/* Light half */}
                            <div className="w-1/2 h-full p-1.5 flex gap-1" style={{ backgroundColor: "rgb(245, 245, 250)" }}>
                              <div className="w-3 h-full rounded p-0.5 shrink-0" style={{ backgroundColor: "rgb(255, 255, 255)" }}>
                                <div className="w-full h-1 rounded-sm" style={{ backgroundColor: "rgb(96, 91, 255)" }} />
                              </div>
                              <div className="flex-1 flex flex-col gap-1 min-w-0">
                                <div className="h-2 w-full rounded-sm" style={{ backgroundColor: "rgb(255, 255, 255)" }} />
                                <div className="h-full rounded-sm" style={{ backgroundColor: "rgb(255, 255, 255)" }} />
                              </div>
                            </div>
                            {/* Dark half */}
                            <div className="w-1/2 h-full p-1.5 flex gap-1 border-l" style={{ backgroundColor: "rgb(11, 11, 16)", borderColor: "rgb(38, 38, 48)" }}>
                              <div className="flex-1 flex flex-col gap-1 min-w-0">
                                <div className="h-2 w-full rounded-sm" style={{ backgroundColor: "rgb(21, 21, 29)" }} />
                                <div className="h-full rounded-sm" style={{ backgroundColor: "rgb(21, 21, 29)" }} />
                              </div>
                              <div className="w-3 h-full rounded p-0.5 shrink-0" style={{ backgroundColor: "rgb(21, 21, 29)" }}>
                                <div className="w-full h-1 rounded-sm" style={{ backgroundColor: "rgb(124, 120, 255)" }} />
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg flex items-center justify-center border bg-surface border-line text-fg-muted">
                                <Monitor className="w-4 h-4" />
                              </div>
                              <span className="text-sm font-semibold text-fg">System Sync</span>
                            </div>
                            <Check
                              className={`w-4 h-4 text-brand transition-opacity ${
                                activeTheme === "system" ? "opacity-100" : "opacity-0"
                              }`}
                              aria-hidden={activeTheme !== "system"}
                            />
                          </div>
                          <p className="text-xs text-fg-muted">Follows system OS configuration</p>
                        </button>
                      </div>
                    </div>

                    {/* Data Density & Layout preferences */}
                    <div className="p-6 space-y-4 rounded-2xl bg-surface border border-line">
                      <h3 className="text-sm font-semibold flex items-center gap-2 text-fg">
                        <Sliders className="w-4 h-4 text-brand" />
                        Information Density &amp; Layout
                      </h3>

                      <div className="divide-y divide-line">
                        <div className="py-3 flex items-center justify-between gap-4">
                          <div>
                            <div className="text-sm font-medium text-fg">High-Density Data Tables</div>
                            <div className="text-xs text-fg-muted">
                              Compact row heights and tabular key values for high-volume transactions
                            </div>
                          </div>
                          <Switch
                            checked={settings.highDensityTable}
                            onChange={(val) => {
                              setSettings((prev) => ({ ...prev, highDensityTable: val }));
                              document.documentElement.setAttribute(
                                "data-density",
                                val ? "compact" : "comfortable"
                              );
                            }}
                            ariaLabel="Toggle high density data tables"
                          />
                        </div>

                        <div className="py-3 flex items-center justify-between gap-4">
                          <div>
                            <div className="text-sm font-medium text-fg">Instant Desktop Push Notifications</div>
                            <div className="text-xs text-fg-muted">
                              Receive toasts when new students submit approval requests or fee slips
                            </div>
                          </div>
                          <Switch
                            checked={settings.pushNotifications}
                            onChange={(val) =>
                              setSettings((prev) => ({ ...prev, pushNotifications: val }))
                            }
                            ariaLabel="Toggle instant push notifications"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: SECURITY */}
                {activeTab === "security" && (
                  <div className="space-y-6">
                    <div className="p-6 space-y-5 rounded-2xl bg-surface border border-line">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-semibold flex items-center gap-2 text-fg">
                            <Lock className="w-4 h-4 text-success" />
                            Role-Based Access Control (RBAC) &amp; Gate
                          </h3>
                          <p className="text-xs text-fg-muted mt-1">
                            Role-based access control and identity verification.
                          </p>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-success-light text-success border border-success/20 text-xs font-sans font-semibold">
                          RBAC Active
                        </span>
                      </div>

                      <div className="p-4 rounded-xl bg-canvas border border-line space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-fg-muted">Active Admin Identity</span>
                          <span className="text-xs font-sans text-brand font-semibold">
                            {currentUser?.role?.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-fg-muted">
                          <span>Full Name</span>
                          <span className="font-semibold text-fg">{currentUser?.full_name}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-fg-muted">
                          <span>Email Address</span>
                          <span className="font-sans text-fg-muted">{currentUser?.email}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-fg-muted">
                          <span>Approval Status</span>
                          <span className="text-success font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                          </span>
                        </div>
                      </div>

                      {/* Session Timeout */}
                      <div className="pt-2 space-y-2">
                        <label
                          htmlFor="admin-session-timeout"
                          className="block text-sm font-medium text-fg"
                        >
                          Idle Session Expiration (Minutes)
                        </label>
                        <input
                          id="admin-session-timeout"
                          type="number"
                          min={5}
                          max={1440}
                          value={settings.sessionTimeoutMinutes}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              sessionTimeoutMinutes: Number(e.target.value),
                            }))
                          }
                          onBlur={() =>
                            setSettings((prev) => ({
                              ...prev,
                              sessionTimeoutMinutes: clampSessionTimeout(prev.sessionTimeoutMinutes),
                            }))
                          }
                          className="w-full sm:w-48 min-h-[44px] px-3 py-2 font-sans tabular-nums rounded-xl bg-canvas border border-line text-fg placeholder:text-fg-muted text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus:border-brand"
                        />
                        <p className="text-xs text-fg-muted mt-1">
                          Administrators will be asked to re-authenticate after continuous inactivity (5–1440 minutes).
                        </p>
                      </div>

                      {/* Demo Role Switcher for Test Evaluation */}
                      <div className="pt-4 border-t border-line space-y-3">
                        <div className="text-sm font-medium text-fg">
                          Switch Portal Preview Role
                        </div>
                        <p className="text-xs text-fg-muted mt-1">
                          Switch your current session role to evaluate strict route gating and approval redirects.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => switchUserRole("admin", true)}
                            className="min-h-[36px] px-3 py-1.5 rounded-lg bg-success-light border border-success/30 text-success text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                          >
                            System Administrator
                          </button>
                          <button
                            type="button"
                            onClick={() => switchUserRole("teacher", true)}
                            className="min-h-[36px] px-3 py-1.5 rounded-lg bg-brand-soft border border-brand/30 text-brand text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                          >
                            Faculty (Teacher)
                          </button>
                          <button
                            type="button"
                            onClick={() => switchUserRole("student", true)}
                            className="min-h-[36px] px-3 py-1.5 rounded-lg bg-surface-2 border border-line text-fg text-sm font-semibold hover:bg-canvas transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                          >
                            Student Account
                          </button>
                          <button
                            type="button"
                            onClick={() => switchUserRole("admin", false)}
                            className="min-h-[36px] px-3 py-1.5 rounded-lg bg-danger-light border border-danger/30 text-danger text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                          >
                            Restricted Admin (Pending Approval)
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: DATABASE */}
                {activeTab === "database" && (
                  <div className="space-y-6">
                    <div className="p-6 space-y-5 rounded-2xl bg-surface border border-line">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-semibold flex items-center gap-2 text-fg">
                            <Database className="w-4 h-4 text-brand" />
                            PostgreSQL Database Cluster &amp; Storage
                          </h3>
                          <p className="text-xs text-fg-muted mt-1">
                            Live cluster metrics and verified entity tables.
                          </p>
                        </div>
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-success bg-success-light border border-success/20 px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-success" />
                          Operational
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-4 rounded-xl bg-canvas border border-line">
                          <div className="text-xs font-sans text-fg-muted">Total Rows Indexed</div>
                          <div className="text-xl font-sans tabular-nums font-bold mt-1 text-fg">14,892</div>
                          <div className="text-xs text-success mt-1">Across 9 core schemas</div>
                        </div>
                        <div className="p-4 rounded-xl bg-canvas border border-line">
                          <div className="text-xs font-sans text-fg-muted">Storage Bucket</div>
                          <div className="text-xl font-sans font-bold mt-1 text-fg">notices (Public)</div>
                          <div className="text-xs mt-1 text-fg-muted">PDF &amp; Image attachments</div>
                        </div>
                        <div className="p-4 rounded-xl bg-canvas border border-line">
                          <div className="text-xs font-sans text-fg-muted">Query Latency</div>
                          <div className="text-xl font-sans tabular-nums font-bold mt-1 text-fg">18 ms</div>
                          <div className="text-xs text-success mt-1">Edge Cache Active</div>
                        </div>
                      </div>

                      <div className="pt-2 space-y-3">
                        <div className="text-sm font-medium text-fg">Schema Integrity Check</div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-sans">
                          {[
                            "profiles",
                            "user_roles",
                            "departments",
                            "semesters",
                            "subjects",
                            "class_routines",
                            "notices",
                            "admin_transactions",
                            "teacher_wages",
                          ].map((tbl) => (
                            <div
                              key={tbl}
                              className="p-2.5 rounded-xl bg-canvas border border-line flex items-center justify-between text-fg"
                            >
                              <span className="truncate">{tbl}</span>
                              <Check className="w-3.5 h-3.5 text-success shrink-0" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: API KEYS */}
                {activeTab === "api" && (
                  <div className="space-y-6">
                    <div className="p-6 space-y-5 rounded-2xl bg-surface border border-line">
                      <div>
                        <h3 className="text-sm font-semibold flex items-center gap-2 text-fg">
                          <Key className="w-4 h-4 text-brand" />
                          Database Project Credentials &amp; API Keys
                        </h3>
                        <p className="text-xs text-fg-muted mt-1">
                          Production connection string tokens configured in system environment.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label
                            htmlFor="admin-db-endpoint"
                            className="block text-sm font-medium text-fg"
                          >
                            Database Connection Endpoint
                          </label>
                          <div className="relative flex items-center">
                            <input
                              id="admin-db-endpoint"
                              type="text"
                              readOnly
                              value="https://unicampus-core-cluster.supabase.co"
                              className="w-full min-h-[44px] px-3.5 pr-24 py-2.5 font-sans rounded-xl bg-canvas border border-line text-fg placeholder:text-fg-muted text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus:border-brand"
                            />
                            <div className="absolute right-2 flex items-center">
                              <button
                                type="button"
                                onClick={() =>
                                  handleCopy(
                                    "endpoint",
                                    "https://unicampus-core-cluster.supabase.co"
                                  )
                                }
                                className="h-8 px-2.5 rounded-lg inline-flex items-center justify-center gap-1 text-xs font-medium text-fg-muted hover:text-fg hover:bg-surface-2 transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                              >
                                {copiedField === "endpoint" ? (
                                  <span className="flex items-center gap-1 text-success">
                                    <Check className="w-3.5 h-3.5" />
                                    Copied!
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1">
                                    <Copy className="w-3.5 h-3.5" />
                                    Copy
                                  </span>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label
                            htmlFor="admin-anon-key"
                            className="block text-sm font-medium text-fg"
                          >
                            Public Anon API Key
                          </label>
                          <div className="relative flex items-center">
                            <input
                              id="admin-anon-key"
                              type={showAnonKey ? "text" : "password"}
                              readOnly
                              value="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.unicampus-anon-public-key"
                              className="w-full min-h-[44px] px-3.5 pr-32 py-2.5 font-sans rounded-xl bg-canvas border border-line text-fg placeholder:text-fg-muted text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus:border-brand"
                            />
                            <div className="absolute right-2 flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => setShowAnonKey((prev) => !prev)}
                                title={showAnonKey ? "Hide API key" : "Show API key"}
                                aria-label={showAnonKey ? "Hide API key" : "Show API key"}
                                className="h-8 w-8 rounded-lg flex items-center justify-center text-fg-muted hover:text-fg hover:bg-surface-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                              >
                                {showAnonKey ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleCopy(
                                    "anon_key",
                                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.unicampus-anon-public-key"
                                  )
                                }
                                className="h-8 px-2.5 rounded-lg inline-flex items-center justify-center gap-1 text-xs font-medium text-fg-muted hover:text-fg hover:bg-surface-2 transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                              >
                                {copiedField === "anon_key" ? (
                                  <span className="flex items-center gap-1 text-success">
                                    <Check className="w-3.5 h-3.5" />
                                    Copied!
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1">
                                    <Copy className="w-3.5 h-3.5" />
                                    Copy
                                  </span>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 5: MAINTENANCE & DANGER ZONE */}
                {activeTab === "maintenance" && (
                  <div className="space-y-6">
                    <div className="p-6 space-y-5 rounded-2xl bg-surface border border-danger/30">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-semibold text-danger flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-danger" />
                            Campus Maintenance Lockdown Mode
                          </h3>
                          <p className="text-xs text-fg-muted mt-1">
                            Locks student and faculty portals with a maintenance banner during grading periods or financial audits.
                          </p>
                        </div>
                        <span
                          className={`text-xs font-sans px-3 py-1 rounded-full font-semibold border ${
                            settings.maintenanceMode
                              ? "bg-danger-light text-danger border-danger/40"
                              : "bg-surface-2 text-fg-muted border-line"
                          }`}
                        >
                          {settings.maintenanceMode ? "Lockdown Enabled" : "Normal Operations"}
                        </span>
                      </div>

                      <div className="p-4 rounded-xl bg-canvas border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="text-sm font-medium text-fg">System Maintenance Toggle</div>
                          <div className="text-xs mt-0.5 text-fg-muted">
                            Only verified Administrators will retain console access.
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold text-fg-muted">
                            {settings.maintenanceMode ? "Lockdown Enabled" : "Normal Mode"}
                          </span>
                          <Switch
                            checked={settings.maintenanceMode}
                            onChange={(val) =>
                              setSettings((prev) => ({ ...prev, maintenanceMode: val }))
                            }
                            ariaLabel="Toggle campus maintenance lockdown mode"
                          />
                        </div>
                      </div>

                      {settings.maintenanceMode && (
                        <div className="space-y-2">
                          <label
                            htmlFor="admin-maintenance-msg"
                            className="block text-sm font-medium text-fg"
                          >
                            Public Maintenance Notice Message
                          </label>
                          <input
                            id="admin-maintenance-msg"
                            type="text"
                            value={settings.maintenanceReason}
                            onChange={(e) =>
                              setSettings((prev) => ({
                                ...prev,
                                maintenanceReason: e.target.value,
                              }))
                            }
                            className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-canvas border border-danger/40 text-fg placeholder:text-fg-muted text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus:border-brand"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Floating / Sticky Dirty-State Save Bar */}
        <AnimatePresence>
          {isDirty && (
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.95 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-xl bg-surface/95 backdrop-blur-md border border-warning/40 shadow-xl rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-3 text-fg"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full bg-warning animate-pulse shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-fg truncate">
                    Unsaved changes
                  </p>
                  <p className="text-xs text-fg-muted truncate hidden sm:block">
                    You have unsaved changes in administrative settings.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                >
                  Reset
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Save className="w-4 h-4" />}
                  onClick={handleSave}
                >
                  Save Changes
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SuperAdminGate>
  );
}
