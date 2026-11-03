"use client";

import { useState } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import ProfileAvatar from "@/components/common/ProfileAvatar";
import { 
  Bell, 
  ShieldCheck, 
  User, 
  Save, 
  Check, 
} from "lucide-react";
import { themeTokens } from "@/lib/theme";
import ClickSpark from "@/components/bits/ClickSpark";

export default function SettingsPage() {
  const { currentUser } = useAdminAuth();
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "notifications" | "security">("general");

  // State toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [routineUpdates, setRoutineUpdates] = useState(true);
  const [twoFactor, setTwoFactor] = useState(true);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="w-full space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-[#F0F6FC] tracking-tight">
            Portal Settings
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-[#8D96A0] mt-1">
            Manage your account security, notification rules, and preferences
          </p>
        </div>

        <ClickSpark sparkColor="#10b981" sparkCount={8} sparkRadius={22}>
          <button
            onClick={handleSave}
            className="bg-brand hover:bg-brand-hover text-white px-6 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-sm transition-all self-start md:self-auto cursor-pointer"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4" /> Changes Saved
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Preferences
              </>
            )}
          </button>
        </ClickSpark>
      </div>

      {/* Tabs */}
      <div className={`flex items-center gap-2 border-b ${themeTokens.border} pb-3 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden`}>
        <ClickSpark sparkColor="#1D5BD8" sparkCount={5} sparkRadius={16}>
          <button
            onClick={() => setActiveTab("general")}
            className={`px-5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === "general"
                ? "bg-brand text-white shadow-sm"
                : `text-slate-600 dark:text-[#8D96A0] hover:bg-white dark:hover:bg-[#161B22]`
            }`}
          >
            <User className="w-3.5 h-3.5" /> General &amp; Profile
          </button>
        </ClickSpark>
        <ClickSpark sparkColor="#1D5BD8" sparkCount={5} sparkRadius={16}>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`px-5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === "notifications"
                ? "bg-brand text-white shadow-sm"
                : `text-slate-600 dark:text-[#8D96A0] hover:bg-white dark:hover:bg-[#161B22]`
            }`}
          >
            <Bell className="w-3.5 h-3.5" /> Notifications
          </button>
        </ClickSpark>
        <button
          onClick={() => setActiveTab("security")}
          className={`px-5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === "security"
              ? "bg-brand text-white shadow-sm"
              : `text-slate-600 dark:text-[#8D96A0] hover:bg-white dark:hover:bg-[#161B22]`
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" /> Security &amp; Sync
        </button>
      </div>

      {activeTab === "general" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Profile Card */}
          <div className={`lg:col-span-4 ${themeTokens.card3xl} p-7 flex flex-col items-center text-center transition-colors`}>
            <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-indigo-100 to-purple-100 dark:from-indigo-950 dark:to-purple-950 mb-4">
              <ProfileAvatar
                className="w-full h-full border-4 border-white dark:border-[#0D1117] shadow-sm bg-white dark:bg-[#161B22]"
                iconClassName="w-10 h-10"
              />
            </div>
            <h3 className="font-extrabold text-slate-900 dark:text-[#F0F6FC] text-lg">Sakib Ahmed</h3>
            <p className="text-xs text-slate-400 dark:text-[#6E747D] font-medium">Student ID • {currentUser?.student_id ?? '—'}</p>
            <div className="mt-3 inline-block px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-brand dark:text-indigo-300 font-bold text-xs rounded-full border border-brand/20">
              6th Semester • CSE
            </div>

            <div className={`w-full mt-6 pt-6 border-t ${themeTokens.border} text-left space-y-3 text-xs`}>
              <div className="flex justify-between">
                <span className="text-slate-400 dark:text-[#6E747D] font-medium">Department</span>
                <span className="font-bold text-slate-700 dark:text-[#F0F6FC]">Computer Science</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 dark:text-[#6E747D] font-medium">Portal Role</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Student (Verified)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 dark:text-[#6E747D] font-medium">Sync Status</span>
                <span className="font-bold text-brand">Supabase Live</span>
              </div>
            </div>
          </div>

          {/* Account Details Form */}
          <div className={`lg:col-span-8 ${themeTokens.card3xl} p-8 space-y-6 transition-colors`}>
            <h2 className="text-lg font-bold text-slate-900 dark:text-[#F0F6FC]">Personal &amp; Contact Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="settings-name" className="block text-xs font-bold text-slate-700 dark:text-[#F0F6FC] mb-2">
                  Full Display Name
                </label>
                <input
                  id="settings-name"
                  type="text"
                  defaultValue="Sakib Ahmed"
                  className={`w-full px-4 py-2.5 ${themeTokens.input}`}
                />
              </div>

              <div>
                <label htmlFor="settings-email" className="block text-xs font-bold text-slate-700 dark:text-[#F0F6FC] mb-2">
                  Primary Email
                </label>
                <input
                  id="settings-email"
                  type="email"
                  defaultValue="sakib.cse@unicampus.edu"
                  className={`w-full px-4 py-2.5 ${themeTokens.input}`}
                />
              </div>

              <div>
                <label htmlFor="settings-phone" className="block text-xs font-bold text-slate-700 dark:text-[#F0F6FC] mb-2">
                  Phone Number
                </label>
                <input
                  id="settings-phone"
                  type="text"
                  defaultValue="+880 1712-345678"
                  className={`w-full px-4 py-2.5 ${themeTokens.input}`}
                />
              </div>

              <div>
                <label htmlFor="settings-language" className="block text-xs font-bold text-slate-700 dark:text-[#F0F6FC] mb-2">
                  Language Preference
                </label>
                <select
                  id="settings-language"
                  defaultValue="en"
                  className={`w-full px-4 py-2.5 ${themeTokens.select}`}
                >
                  <option value="en">English (US)</option>
                  <option value="bn">Bengali</option>
                </select>
              </div>
            </div>

            <div className={`pt-4 border-t ${themeTokens.border}`}>
              <label htmlFor="settings-address" className="block text-xs font-bold text-slate-700 dark:text-[#F0F6FC] mb-2">
                Present Campus Address
              </label>
              <input
                id="settings-address"
                type="text"
                defaultValue="Bashundhara R/A, Dhaka, Bangladesh"
                className={`w-full px-4 py-2.5 ${themeTokens.input}`}
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === "notifications" && (
        <div className={`${themeTokens.card3xl} p-8 space-y-6 max-w-4xl transition-colors`}>
          <h2 className="text-lg font-bold text-slate-900 dark:text-[#F0F6FC]">Notification Channels &amp; Triggers</h2>

          <div className="space-y-4">
            <div className={`flex items-center justify-between p-4 ${themeTokens.cardRecessed2xl}`}>
              <label htmlFor="notify-email" className="space-y-0.5 cursor-pointer flex-1 mr-4">
                <h4 className="text-sm font-bold text-slate-800 dark:text-[#F0F6FC]">Email Announcements</h4>
                <p className="text-xs text-slate-500 dark:text-[#6E747D]">
                  Receive official university notices and emergency alerts via university email.
                </p>
              </label>
              <input
                id="notify-email"
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-5 h-5 accent-brand cursor-pointer rounded"
              />
            </div>

            <div className={`flex items-center justify-between p-4 ${themeTokens.cardRecessed2xl}`}>
              <label htmlFor="notify-sms" className="space-y-0.5 cursor-pointer flex-1 mr-4">
                <h4 className="text-sm font-bold text-slate-800 dark:text-[#F0F6FC]">SMS Urgent Notifications</h4>
                <p className="text-xs text-slate-500 dark:text-[#6E747D]">
                  Get instant SMS messages for class cancellations, exams, and payment deadlines.
                </p>
              </label>
              <input
                id="notify-sms"
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="w-5 h-5 accent-brand cursor-pointer rounded"
              />
            </div>

            <div className={`flex items-center justify-between p-4 ${themeTokens.cardRecessed2xl}`}>
              <label htmlFor="notify-routine" className="space-y-0.5 cursor-pointer flex-1 mr-4">
                <h4 className="text-sm font-bold text-slate-800 dark:text-[#F0F6FC]">Routine &amp; Timetable Alerts</h4>
                <p className="text-xs text-slate-500 dark:text-[#6E747D]">
                  Notify 15 minutes before active lectures start.
                </p>
              </label>
              <input
                id="notify-routine"
                type="checkbox"
                checked={routineUpdates}
                onChange={(e) => setRoutineUpdates(e.target.checked)}
                className="w-5 h-5 accent-brand cursor-pointer rounded"
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === "security" && (
        <div className={`${themeTokens.card3xl} p-8 space-y-6 max-w-4xl transition-colors`}>
          <h2 className="text-lg font-bold text-slate-900 dark:text-[#F0F6FC]">Security &amp; Backend Sync</h2>

          <div className="space-y-4">
            <div className={`flex items-center justify-between p-4 ${themeTokens.cardRecessed2xl}`}>
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-slate-800 dark:text-[#F0F6FC]">Two-Factor Authentication (2FA)</h4>
                <p className="text-xs text-slate-500 dark:text-[#6E747D]">
                  Secure your student portal with authenticator OTP verification.
                </p>
              </div>
              <button
                type="button"
                aria-pressed={twoFactor}
                onClick={() => setTwoFactor(!twoFactor)}
                className={`px-4 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer border ${
                  twoFactor
                    ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                    : "bg-slate-100 dark:bg-[#161B22] text-slate-700 dark:text-[#8D96A0] border-slate-300 dark:border-[#30363D] hover:border-slate-400"
                }`}
              >
                {twoFactor ? "Enabled" : "Disabled"}
              </button>
            </div>

            <div className={`flex items-center justify-between p-4 ${themeTokens.cardRecessed2xl}`}>
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-slate-800 dark:text-[#F0F6FC]">Supabase Cloud Sync</h4>
                <p className="text-xs text-slate-500 dark:text-[#6E747D]">
                  Data synchronizes in real-time with the unified campus database.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-bold text-slate-700 dark:text-[#F0F6FC]">Online</span>
              </div>
            </div>

            <div className={`pt-4 border-t ${themeTokens.border} flex items-center justify-between`}>
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-[#F0F6FC]">Account Password</h4>
                <p className="text-xs text-slate-500 dark:text-[#6E747D]">
                  Last updated 3 weeks ago
                </p>
              </div>
              <button className={`${themeTokens.btnSecondary} px-4 py-2 text-xs`}>
                Change Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
