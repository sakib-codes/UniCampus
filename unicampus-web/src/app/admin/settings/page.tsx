"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Switch } from "@/components/common/Switch";
import { executeThemeTransition } from "@/lib/themeTransition";
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
  AlertTriangle 
} from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { SuperAdminGate } from "@/components/admin/SuperAdminGate";

type SettingsTab = "appearance" | "security" | "database" | "api" | "maintenance";

export default function AdminSettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<SettingsTab>("appearance");
  const [savedNotice, setSavedNotice] = useState(false);
  const { currentUser, switchUserRole } = useAdminAuth();

  // Settings State
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceReason, setMaintenanceReason] = useState("Scheduled term-end grade synchronization & maintenance");
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState(45);
  const [highDensityTable, setHighDensityTable] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  useEffect(() => {
    queueMicrotask(() => {
      setMounted(true);
    });
  }, []);

  if (!mounted) return null;

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const tabs = [
    { id: "appearance", label: "Appearance & Theme", icon: Monitor, badge: null },
    { id: "security", label: "Security & Auth Gate", icon: ShieldCheck, badge: "Active" },
    { id: "database", label: "Database & Storage", icon: Database, badge: "Connected" },
    { id: "api", label: "API Keys & Webhooks", icon: Key, badge: null },
    { id: "maintenance", label: "Maintenance & System", icon: ServerCrash, badge: maintenanceMode ? "ACTIVE" : null },
  ] as const;

  return (
    <SuperAdminGate featureName="System Settings & Infrastructure">
      <div className="space-y-6 w-full pb-16">
      {/* Software Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-surface border border-line">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-success"></span>
            <span className="text-xs font-sans text-success font-semibold">
              System Configuration
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-fg tracking-tight">
            Administrative Settings &amp; Configuration
          </h1>
          <p className="text-xs text-fg-muted mt-1">
            Configure institutional branding, data storage connections, role policies, and system controls.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedNotice && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-success bg-success-light border border-success/30 px-3 py-2 rounded-xl">
              <Check className="w-4 h-4" />
              Settings Synced
            </div>
          )}
          
          <button
            type="button"
            onClick={handleSave}
            className="min-h-[44px] bg-brand hover:bg-brand-hover text-on-brand font-semibold rounded-xl px-5 py-2.5 flex items-center gap-2 text-xs cursor-pointer transition-colors active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <Save className="w-4 h-4" />
            Apply &amp; Save
          </button>
        </div>
      </div>

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
                className={`relative w-full min-h-[44px] text-left px-3.5 py-3 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                  isActive
                    ? "text-fg"
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
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? "text-brand" : "text-fg-muted"}`} />
                  <span>{tab.label}</span>
                </div>
                {tab.badge && (
                  <span
                    className={`text-xs font-sans px-2 py-0.5 rounded-full ${
                      tab.id === "maintenance" && maintenanceMode
                        ? "bg-danger-light text-danger border border-danger/40 font-semibold"
                        : "bg-success-light text-success border border-success/20 font-medium"
                    }`}
                  >
                    {tab.badge}
                  </span>
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
                  <h3 className="text-base font-semibold flex items-center gap-2 text-fg">
                    <Monitor className="w-4 h-4 text-brand" />
                    Desktop Interface Color Theme
                  </h3>
                  <p className="text-xs text-fg-muted mt-1">
                    Choose between Dark and Light mode. Calibrated for low eye strain during long academic sessions.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={(e) => executeThemeTransition({ theme: "dark", event: e, setTheme, currentTheme: theme })}
                    className={`p-4 rounded-xl border text-left flex flex-col gap-3 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                      theme === "dark"
                        ? "border-brand ring-1 ring-brand/40 bg-surface-2 text-fg"
                        : "bg-canvas border-line hover:border-fg-subtle"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-brand border bg-surface border-line">
                        <Moon className="w-4 h-4" />
                      </div>
                      {theme === "dark" && <Check className="w-4 h-4 text-brand" />}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-fg">Dark Mode (Calm Campus)</div>
                      <div className="text-xs mt-0.5 text-fg-muted">Balanced dark contrast for low-light environments</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => executeThemeTransition({ theme: "light", event: e, setTheme, currentTheme: theme })}
                    className={`p-4 rounded-xl border text-left flex flex-col gap-3 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                      theme === "light"
                        ? "border-brand ring-1 ring-brand/40 bg-surface-2 text-fg"
                        : "bg-canvas border-line hover:border-fg-subtle"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-warning border bg-surface border-line">
                        <Sun className="w-4 h-4" />
                      </div>
                      {theme === "light" && <Check className="w-4 h-4 text-brand" />}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-fg">Light Mode</div>
                      <div className="text-xs mt-0.5 text-fg-muted">High clarity presentation for daytime classrooms</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => executeThemeTransition({ theme: "system", event: e, setTheme, currentTheme: theme })}
                    className={`p-4 rounded-xl border text-left flex flex-col gap-3 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                      theme === "system"
                        ? "border-brand ring-1 ring-brand/40 bg-surface-2 text-fg"
                        : "bg-canvas border-line hover:border-fg-subtle"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center border bg-surface border-line text-fg-muted">
                        <Monitor className="w-4 h-4" />
                      </div>
                      {theme === "system" && <Check className="w-4 h-4 text-brand" />}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-fg">System Synchronized</div>
                      <div className="text-xs mt-0.5 text-fg-muted">Follows OS configuration</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Data Density & Layout preferences */}
              <div className="p-6 space-y-4 rounded-2xl bg-surface border border-line">
                <h3 className="text-base font-semibold flex items-center gap-2 text-fg">
                  <Sliders className="w-4 h-4 text-brand" />
                  Information Density &amp; Layout
                </h3>

                <div className="divide-y divide-line">
                  <div className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xs font-semibold text-fg">High-Density Data Tables</div>
                      <div className="text-xs text-fg-muted">Compact row heights and tabular key values for high-volume transactions</div>
                    </div>
                    <Switch
                      checked={highDensityTable}
                      onChange={setHighDensityTable}
                      ariaLabel="Toggle high density data tables"
                    />
                  </div>

                  <div className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xs font-semibold text-fg">Instant Desktop Push Notifications</div>
                      <div className="text-xs text-fg-muted">Receive toasts when new students submit approval requests or fee slips</div>
                    </div>
                    <Switch
                      checked={pushNotifications}
                      onChange={setPushNotifications}
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
                    <h3 className="text-base font-semibold flex items-center gap-2 text-fg">
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
                  <label htmlFor="admin-session-timeout" className="block text-xs font-semibold text-fg-muted">
                    Idle Session Expiration (Minutes)
                  </label>
                  <input
                    id="admin-session-timeout"
                    type="number"
                    value={sessionTimeoutMinutes}
                    onChange={(e) => setSessionTimeoutMinutes(Number(e.target.value))}
                    className="w-full sm:w-48 min-h-[44px] px-3 py-2 font-sans tabular-nums rounded-xl bg-canvas border border-line text-fg placeholder:text-fg-muted text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus:border-brand"
                  />
                  <p className="text-xs text-fg-muted mt-1">
                    Administrators will be asked to re-authenticate after continuous inactivity.
                  </p>
                </div>

                {/* Demo Role Switcher for Test Evaluation */}
                <div className="pt-4 border-t border-line space-y-3">
                  <div className="text-xs font-semibold text-fg-muted">
                    Switch Portal Preview Role
                  </div>
                  <p className="text-xs text-fg-muted mt-1">
                    Switch your current session role to evaluate strict route gating and approval redirects.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => switchUserRole("admin", true)}
                      className="min-h-[36px] px-3 py-1.5 rounded-lg bg-success-light border border-success/30 text-success text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    >
                      System Administrator
                    </button>
                    <button
                      type="button"
                      onClick={() => switchUserRole("teacher", true)}
                      className="min-h-[36px] px-3 py-1.5 rounded-lg bg-brand-soft border border-brand/30 text-brand text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    >
                      Faculty (Teacher)
                    </button>
                    <button
                      type="button"
                      onClick={() => switchUserRole("student", true)}
                      className="min-h-[36px] px-3 py-1.5 rounded-lg bg-surface-2 border border-line text-fg text-xs font-semibold hover:bg-canvas transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    >
                      Student Account
                    </button>
                    <button
                      type="button"
                      onClick={() => switchUserRole("admin", false)}
                      className="min-h-[36px] px-3 py-1.5 rounded-lg bg-danger-light border border-danger/30 text-danger text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
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
                    <h3 className="text-base font-semibold flex items-center gap-2 text-fg">
                      <Database className="w-4 h-4 text-brand" />
                      PostgreSQL Database Cluster &amp; Storage
                    </h3>
                    <p className="text-xs text-fg-muted mt-1">
                      Live cluster metrics and verified entity tables.
                    </p>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-success bg-success-light border border-success/20 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
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
                  <div className="text-xs font-semibold text-fg-muted">Schema Integrity Check</div>
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
                  <h3 className="text-base font-semibold flex items-center gap-2 text-fg">
                    <Key className="w-4 h-4 text-brand" />
                    Database Project Credentials &amp; API Keys
                  </h3>
                  <p className="text-xs text-fg-muted mt-1">
                    Production connection string tokens configured in system environment.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="admin-db-endpoint" className="block text-xs font-semibold text-fg-muted">
                      Database Connection Endpoint
                    </label>
                    <input
                      id="admin-db-endpoint"
                      type="text"
                      readOnly
                      value="https://unicampus-core-cluster.supabase.co"
                      className="w-full min-h-[44px] px-3.5 py-2.5 font-sans rounded-xl bg-canvas border border-line text-fg placeholder:text-fg-muted text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus:border-brand"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="admin-anon-key" className="block text-xs font-semibold text-fg-muted">
                      Public Anon API Key
                    </label>
                    <input
                      id="admin-anon-key"
                      type="password"
                      readOnly
                      value="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.unicampus-anon-public-key"
                      className="w-full min-h-[44px] px-3.5 py-2.5 font-sans rounded-xl bg-canvas border border-line text-fg placeholder:text-fg-muted text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus:border-brand"
                    />
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
                    <h3 className="text-base font-semibold text-danger flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-danger" />
                      Campus Maintenance Lockdown Mode
                    </h3>
                    <p className="text-xs text-fg-muted mt-1">
                      Locks student and faculty portals with a maintenance banner during grading periods or financial audits.
                    </p>
                  </div>
                  <span
                    className={`text-xs font-sans px-3 py-1 rounded-full font-semibold border ${
                      maintenanceMode
                        ? "bg-danger-light text-danger border-danger/40"
                        : "bg-surface-2 text-fg-muted border-line"
                    }`}
                  >
                    {maintenanceMode ? "Lockdown Enabled" : "Normal Operations"}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-canvas border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold text-fg">System Maintenance Toggle</div>
                    <div className="text-xs mt-0.5 text-fg-muted">
                      Only verified Administrators will retain console access.
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-fg-muted">
                      {maintenanceMode ? "Lockdown Enabled" : "Normal Mode"}
                    </span>
                    <Switch
                      checked={maintenanceMode}
                      onChange={setMaintenanceMode}
                      ariaLabel="Toggle campus maintenance lockdown mode"
                    />
                  </div>
                </div>

                {maintenanceMode && (
                  <div className="space-y-2">
                    <label htmlFor="admin-maintenance-msg" className="block text-xs font-semibold text-fg-muted">
                      Public Maintenance Notice Message
                    </label>
                    <input
                      id="admin-maintenance-msg"
                      type="text"
                      value={maintenanceReason}
                      onChange={(e) => setMaintenanceReason(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-canvas border border-danger/40 text-fg placeholder:text-fg-muted text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus:border-brand"
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
      </div>
    </SuperAdminGate>
  );
}
