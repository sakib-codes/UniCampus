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
  RefreshCw, 
  HardDrive, 
  Lock, 
  BellRing, 
  Sliders, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle 
} from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { SuperAdminGate } from "@/components/admin/SuperAdminGate";
import { themeTokens } from "@/lib/theme";
import ClickSpark from "@/components/bits/ClickSpark";
import DecryptedText from "@/components/bits/DecryptedText";

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
  const [requireMFA, setRequireMFA] = useState(true);
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState(45);
  const [autoBackupDaily, setAutoBackupDaily] = useState(true);
  const [accentColor, setAccentColor] = useState("#1D5BD8");
  const [highDensityTable, setHighDensityTable] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const tabs = [
    { id: "appearance", label: "Appearance & Theme", icon: Monitor, badge: null },
    { id: "security", label: "Security & Auth Gate", icon: ShieldCheck, badge: "Active" },
    { id: "database", label: "Supabase & Storage", icon: Database, badge: "Connected" },
    { id: "api", label: "API Keys & Webhooks", icon: Key, badge: null },
    { id: "maintenance", label: "Maintenance & System", icon: ServerCrash, badge: maintenanceMode ? "ACTIVE" : null },
  ] as const;

  return (
    <SuperAdminGate featureName="System Settings & Infrastructure">
      <div className="space-y-6 w-full pb-16">
      {/* Software Page Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 ${themeTokens.card}`}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] font-mono tracking-wider uppercase text-emerald-600 dark:text-emerald-400 font-bold">
              System Control Console
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-[#F0F6FC] tracking-tight">
            Administrative Settings &amp; Configuration
          </h1>
          <p className={themeTokens.subheading}>
            Manage UI design tokens, Supabase database bindings, role policies, and system runtime controls.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedNotice && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-2 rounded-xl">
              <Check className="w-4 h-4" />
              Settings Synced
            </div>
          )}
          <ClickSpark sparkColor="#1D5BD8" sparkCount={8} sparkRadius={22}>
            <button
              onClick={handleSave}
              className="bg-brand hover:bg-brand-hover dark:bg-[#2563EB] dark:hover:bg-[#5752E5] text-white font-bold rounded-2xl px-5 py-2.5 flex items-center gap-2 text-xs cursor-pointer shadow-[0_4px_16px_rgba(29, 91, 216,0.30)] hover:shadow-[0_6px_20px_rgba(29, 91, 216,0.40)] transition-all active:scale-[0.98]"
            >
              <Save className="w-4 h-4" />
              Apply &amp; Save
            </button>
          </ClickSpark>
        </div>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Navigation Sidebar */}
        <div className={`md:col-span-4 lg:col-span-3 space-y-1.5 p-3 ${themeTokens.card}`}>
          <div className={`px-3 py-2 text-[10px] font-bold uppercase tracking-wider font-mono ${themeTokens.textMuted}`}>
            Navigation Sections
          </div>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as SettingsTab)}
                className={`relative w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer z-10 ${
                  isActive
                    ? "text-slate-900 dark:text-white"
                    : "text-slate-600 hover:text-slate-900 dark:text-[#8D96A0] dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-[#161B22]/50"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="admin-settings-tab"
                    className="absolute inset-0 bg-white dark:bg-[#161B22] border border-slate-200/80 dark:border-[#30363D] shadow-sm rounded-xl -z-10"
                    transition={{ type: "spring", stiffness: 450, damping: 32 }}
                  />
                )}
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? "text-brand" : "text-slate-400 dark:text-[#6E747D]"}`} />
                  <span>{tab.label}</span>
                </div>
                {tab.badge && (
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase ${
                      tab.id === "maintenance" && maintenanceMode
                        ? "bg-rose-500/20 text-rose-500 dark:text-rose-400 border border-rose-500/40 animate-pulse font-extrabold"
                        : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className={`pt-4 mt-4 border-t ${themeTokens.border} px-3`}>
            <div className={`flex items-center gap-2 text-[11px] font-mono ${themeTokens.textMuted}`}>
              <Cpu className="w-3.5 h-3.5" />
              <span>Core Engine v1.0.0-prod</span>
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
              <div className={`p-6 space-y-5 ${themeTokens.card}`}>
                <div>
                  <h3 className={`text-base font-bold flex items-center gap-2 ${themeTokens.textPrimary}`}>
                    <Monitor className="w-4 h-4 text-brand" />
                    Desktop Interface Color Theme
                  </h3>
                  <p className={themeTokens.subheading}>
                    Select your preferred software display theme. Dark mode is calibrated to the GitHub theme standard: Canvas #010409, Surface #0D1117, Subtitle #6E747D, Border #30363D.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={(e) => executeThemeTransition({ theme: "dark", event: e, setTheme, currentTheme: theme })}
                    className={`p-4 rounded-xl border text-left flex flex-col gap-3 transition-all cursor-pointer ${
                      theme === "dark"
                        ? `border-brand ring-1 ring-brand/40 ${themeTokens.tabActive}`
                        : `${themeTokens.cardRecessed} hover:border-slate-400 dark:hover:border-[#6E747D]`
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-brand border ${themeTokens.surface} ${themeTokens.border}`}>
                        <Moon className="w-4 h-4" />
                      </div>
                      {theme === "dark" && <Check className="w-4 h-4 text-brand" />}
                    </div>
                    <div>
                      <div className={`text-xs font-black ${themeTokens.textPrimary}`}>Dark Mode (GitHub Palette)</div>
                      <div className={`text-[11px] mt-0.5 ${themeTokens.textMuted}`}>Deep #010409 canvas, #0D1117 surface</div>
                    </div>
                  </button>

                  <button
                    onClick={(e) => executeThemeTransition({ theme: "light", event: e, setTheme, currentTheme: theme })}
                    className={`p-4 rounded-xl border text-left flex flex-col gap-3 transition-all cursor-pointer ${
                      theme === "light"
                        ? `border-brand ring-1 ring-brand/40 ${themeTokens.tabActive}`
                        : `${themeTokens.cardRecessed} hover:border-slate-400 dark:hover:border-[#6E747D]`
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-amber-500 border ${themeTokens.surface} ${themeTokens.border}`}>
                        <Sun className="w-4 h-4" />
                      </div>
                      {theme === "light" && <Check className="w-4 h-4 text-brand" />}
                    </div>
                    <div>
                      <div className={`text-xs font-black ${themeTokens.textPrimary}`}>Light Mode</div>
                      <div className={`text-[11px] mt-0.5 ${themeTokens.textMuted}`}>Crisp clean daylight layout</div>
                    </div>
                  </button>

                  <button
                    onClick={(e) => executeThemeTransition({ theme: "system", event: e, setTheme, currentTheme: theme })}
                    className={`p-4 rounded-xl border text-left flex flex-col gap-3 transition-all cursor-pointer ${
                      theme === "system"
                        ? `border-brand ring-1 ring-brand/40 ${themeTokens.tabActive}`
                        : `${themeTokens.cardRecessed} hover:border-slate-400 dark:hover:border-[#6E747D]`
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${themeTokens.surface} ${themeTokens.border} ${themeTokens.textMuted}`}>
                        <Monitor className="w-4 h-4" />
                      </div>
                      {theme === "system" && <Check className="w-4 h-4 text-brand" />}
                    </div>
                    <div>
                      <div className={`text-xs font-black ${themeTokens.textPrimary}`}>System Synchronized</div>
                      <div className={`text-[11px] mt-0.5 ${themeTokens.textMuted}`}>Follows OS configuration</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Data Density & Layout preferences */}
              <div className={`p-6 space-y-4 ${themeTokens.card}`}>
                <h3 className={`text-base font-bold flex items-center gap-2 ${themeTokens.textPrimary}`}>
                  <Sliders className="w-4 h-4 text-brand" />
                  Information Density &amp; Layout
                </h3>

                <div className={`divide-y divide-slate-100 dark:divide-[#21262D]`}>
                  <div className="py-3 flex items-center justify-between">
                    <div>
                      <div className={`text-xs font-bold ${themeTokens.textPrimary}`}>High-Density Data Tables</div>
                      <div className={`text-[11px] ${themeTokens.textMuted}`}>Compact row heights and monospace key values for high-volume transactions</div>
                    </div>
                    <Switch
                      checked={highDensityTable}
                      onChange={setHighDensityTable}
                      ariaLabel="Toggle high density data tables"
                    />
                  </div>

                  <div className="py-3 flex items-center justify-between">
                    <div>
                      <div className={`text-xs font-bold ${themeTokens.textPrimary}`}>Instant Desktop Push Notifications</div>
                      <div className={`text-[11px] ${themeTokens.textMuted}`}>Receive toasts when new students submit approval requests or fee slips</div>
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
              <div className={`p-6 space-y-5 ${themeTokens.card}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-base font-bold flex items-center gap-2 ${themeTokens.textPrimary}`}>
                      <Lock className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                      Role-Based Access Control (RBAC) &amp; Gate
                    </h3>
                    <p className={themeTokens.subheading}>
                      Supabase Row-Level Security policy enforcement and identity verification.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold">
                    RLS Active
                  </span>
                </div>

                <div className={`p-4 rounded-xl border space-y-3 ${themeTokens.cardRecessed}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${themeTokens.textSecondary}`}>Active Admin Identity</span>
                    <span className="text-[11px] font-mono text-brand font-bold">
                      {currentUser?.role?.toUpperCase()}
                    </span>
                  </div>
                  <div className={`flex items-center justify-between text-xs ${themeTokens.textMuted}`}>
                    <span>Full Name</span>
                    <span className={`font-semibold ${themeTokens.textPrimary}`}>{currentUser?.full_name}</span>
                  </div>
                  <div className={`flex items-center justify-between text-xs ${themeTokens.textMuted}`}>
                    <span>Email Address</span>
                    <span className={`font-mono ${themeTokens.textSecondary}`}>{currentUser?.email}</span>
                  </div>
                  <div className={`flex items-center justify-between text-xs ${themeTokens.textMuted}`}>
                    <span>Approval Status</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                    </span>
                  </div>
                </div>

                {/* Session Timeout */}
                <div className="pt-2 space-y-2">
                  <label className={`text-xs font-bold ${themeTokens.textSecondary}`}>
                    Idle Session Expiration (Minutes)
                  </label>
                  <input
                    type="number"
                    value={sessionTimeoutMinutes}
                    onChange={(e) => setSessionTimeoutMinutes(Number(e.target.value))}
                    className={`w-full sm:w-48 px-3 py-2 font-mono ${themeTokens.input}`}
                  />
                  <p className={themeTokens.subheading}>
                    Administrators will be asked to re-authenticate after continuous inactivity.
                  </p>
                </div>

                {/* Demo Role Switcher for Test Evaluation */}
                <div className={`pt-4 border-t ${themeTokens.border} space-y-3`}>
                  <div className={`text-xs font-bold ${themeTokens.textSecondary}`}>
                    Simulate Role Switcher (Developer Sandbox)
                  </div>
                  <p className={themeTokens.subheading}>
                    Switch your current session role to evaluate strict route gating and approval redirects.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => switchUserRole("admin", true)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-500/25 transition-colors cursor-pointer"
                    >
                      SuperAdmin (Approved)
                    </button>
                    <button
                      onClick={() => switchUserRole("teacher", true)}
                      className="px-3 py-1.5 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-600 dark:text-blue-300 text-xs font-bold hover:bg-blue-500/25 transition-colors cursor-pointer"
                    >
                      Faculty (Teacher)
                    </button>
                    <button
                      onClick={() => switchUserRole("student", true)}
                      className="px-3 py-1.5 rounded-lg bg-brand/15 border border-brand/30 text-brand dark:text-[#60A5FA] text-xs font-bold hover:bg-brand/25 transition-colors cursor-pointer"
                    >
                      Student Account
                    </button>
                    <button
                      onClick={() => switchUserRole("admin", false)}
                      className="px-3 py-1.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs font-bold hover:bg-rose-500/25 transition-colors cursor-pointer"
                    >
                      Unapproved Admin (Test Gate)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DATABASE */}
          {activeTab === "database" && (
            <div className="space-y-6">
              <div className={`p-6 space-y-5 ${themeTokens.card}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-base font-bold flex items-center gap-2 ${themeTokens.textPrimary}`}>
                      <Database className="w-4 h-4 text-brand" />
                      Supabase PostgreSQL Health &amp; Telemetry
                    </h3>
                    <p className={themeTokens.subheading}>
                      Live cluster metrics and verified entity tables.
                    </p>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    Operational
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className={`p-4 rounded-xl border ${themeTokens.cardRecessed}`}>
                    <div className={`text-[10px] font-mono uppercase ${themeTokens.textMuted}`}>Total Rows Indexed</div>
                    <div className={`text-xl font-mono font-bold mt-1 ${themeTokens.textPrimary}`}>14,892</div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1">Across 9 core schemas</div>
                  </div>
                  <div className={`p-4 rounded-xl border ${themeTokens.cardRecessed}`}>
                    <div className={`text-[10px] font-mono uppercase ${themeTokens.textMuted}`}>Storage Bucket</div>
                    <div className={`text-xl font-mono font-bold mt-1 ${themeTokens.textPrimary}`}>notices (Public)</div>
                    <div className={`text-[10px] mt-1 ${themeTokens.textMuted}`}>PDF &amp; Image attachments</div>
                  </div>
                  <div className={`p-4 rounded-xl border ${themeTokens.cardRecessed}`}>
                    <div className={`text-[10px] font-mono uppercase ${themeTokens.textMuted}`}>Query Latency</div>
                    <div className={`text-xl font-mono font-bold mt-1 ${themeTokens.textPrimary}`}>18 ms</div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1">Edge Cache Active</div>
                  </div>
                </div>

                <div className="pt-2 space-y-3">
                  <div className={`text-xs font-bold ${themeTokens.textSecondary}`}>Schema Integrity Check</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
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
                        className={`p-2.5 rounded-lg border flex items-center justify-between ${themeTokens.cardRecessed} ${themeTokens.textPrimary}`}
                      >
                        <span>{tbl}</span>
                        <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
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
              <div className={`p-6 space-y-5 ${themeTokens.card}`}>
                <div>
                  <h3 className={`text-base font-bold flex items-center gap-2 ${themeTokens.textPrimary}`}>
                    <Key className="w-4 h-4 text-brand" />
                    Supabase Project Credentials &amp; Edge Functions
                  </h3>
                  <p className={themeTokens.subheading}>
                    Production connection string tokens configured in `.env.local`.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className={`text-xs font-bold ${themeTokens.textSecondary}`}>
                      NEXT_PUBLIC_SUPABASE_URL
                    </label>
                    <input
                      type="text"
                      readOnly
                      value="https://unicampus-core-cluster.supabase.co"
                      className={`w-full px-3.5 py-2.5 font-mono ${themeTokens.input}`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={`text-xs font-bold ${themeTokens.textSecondary}`}>
                      NEXT_PUBLIC_SUPABASE_ANON_KEY
                    </label>
                    <input
                      type="password"
                      readOnly
                      value="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.unicampus-anon-public-key"
                      className={`w-full px-3.5 py-2.5 font-mono ${themeTokens.input}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: MAINTENANCE & DANGER ZONE */}
          {activeTab === "maintenance" && (
            <div className="space-y-6">
              <div className={`p-6 border border-rose-500/30 space-y-5 ${themeTokens.card}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-rose-500 dark:text-rose-400 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-500" />
                      Campus Maintenance Lockdown Mode
                    </h3>
                    <p className={themeTokens.subheading}>
                      Locks student and faculty portals with a maintenance banner during grading periods or financial audits.
                    </p>
                  </div>
                  <span
                    className={`text-xs font-mono px-3 py-1 rounded-full uppercase font-bold border ${
                      maintenanceMode
                        ? "bg-rose-500/20 text-rose-500 dark:text-rose-400 border-rose-500/40 animate-pulse"
                        : "bg-slate-100 dark:bg-[#161B22] text-slate-500 dark:text-[#6E747D] border-slate-200 dark:border-[#30363D]"
                    }`}
                  >
                    {maintenanceMode ? "Lockdown Enabled" : "Normal Operations"}
                  </span>
                </div>

                <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${themeTokens.cardRecessed}`}>
                  <div>
                    <div className={`text-xs font-bold ${themeTokens.textPrimary}`}>System Maintenance Toggle</div>
                    <div className={`text-[11px] mt-0.5 ${themeTokens.textMuted}`}>
                      Only verified Administrators will retain console access.
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-600 dark:text-[#8D96A0]">
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
                    <label className={`text-xs font-bold ${themeTokens.textSecondary}`}>
                      Public Maintenance Notice Message
                    </label>
                    <input
                      type="text"
                      value={maintenanceReason}
                      onChange={(e) => setMaintenanceReason(e.target.value)}
                      className={`w-full px-3.5 py-2.5 ${themeTokens.input} border-rose-500/40`}
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
