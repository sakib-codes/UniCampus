"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Eye, 
  EyeOff, 
  ArrowRight,
  Copy,
  Check
} from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { CANONICAL_FACULTY, CANONICAL_STUDENT } from "@/lib/canonicalCampus";
import { adminService } from "@/lib/services/adminService";
import { supabaseSyncBridge } from "@/lib/supabase/syncBridge";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { CampusLottie } from "@/components/common/CampusLottie";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

type PortalType = "student" | "faculty" | "admin";
type AdminDeptOption = "super" | "dept-cse" | "dept-eee" | "dept-bba";

const DEMO_CREDENTIALS: Record<PortalType, { id: string; password: string; label: string }> = {
  student: {
    id: CANONICAL_STUDENT.studentId,
    password: "SuperScholar2026!",
    label: "Student",
  },
  faculty: {
    id: CANONICAL_FACULTY.email,
    password: "SuperScholar2026!",
    label: "Faculty",
  },
  admin: {
    id: "admin@unicampus.edu",
    password: "SuperScholar2026!",
    label: "Admin",
  },
};

export default function LoginPage() {
  const router = useRouter();
  const { loginAsStudent, loginAsFaculty, loginAsAdmin, loginAsDeptAdmin, loginWithSupabaseProfile } = useAdminAuth();

  const isLiveMode = supabaseSyncBridge.isLive();
  const [activePortal, setActivePortal] = useState<PortalType>("student");
  const [selectedAdminDept, setSelectedAdminDept] = useState<AdminDeptOption>("super");
  const [emailOrId, setEmailOrId] = useState(isLiveMode ? "" : DEMO_CREDENTIALS.student.id);
  const [password, setPassword] = useState(isLiveMode ? "" : DEMO_CREDENTIALS.student.password);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Surface status messages returned from /auth/callback (Google OAuth)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const oauthStatus = params.get("oauth_status");
    const oauthError = params.get("oauth_error");
    const reason = params.get("reason");
    queueMicrotask(() => {
      if (oauthStatus === "pending") {
        setAuthError(
          "Your Google account is registered and pending verification by your Department Admin or Central Admin."
        );
      } else if (oauthStatus === "rejected") {
        setAuthError(
          `Application rejected: "${reason || "Please review admin feedback"}". Open Register → Check Status to correct and re-apply.`
        );
      } else if (oauthStatus === "suspended") {
        setAuthError("This account is currently suspended. Contact the Registrar office.");
      } else if (oauthError) {
        setAuthError("Could not complete Google Sign-In. Please try again.");
      }
    });
  }, []);

  const handlePortalSwitch = (portal: PortalType) => {
    setActivePortal(portal);
    if (portal === "student") {
      setEmailOrId(DEMO_CREDENTIALS.student.id);
    } else if (portal === "faculty") {
      setEmailOrId(DEMO_CREDENTIALS.faculty.id);
    } else {
      if (selectedAdminDept === "super") {
        setEmailOrId("admin@unicampus.edu");
      } else {
        setEmailOrId(`${selectedAdminDept.replace("dept-", "")}.admin@unicampus.edu`);
      }
    }
  };

  const handleAdminDeptSelect = (dept: AdminDeptOption) => {
    setSelectedAdminDept(dept);
    if (dept === "super") {
      setEmailOrId("admin@unicampus.edu");
    } else {
      setEmailOrId(`${dept.replace("dept-", "")}.admin@unicampus.edu`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoading(true);

    const trimmedId = emailOrId.trim();
    const isDemoCredential =
      password === "SuperScholar2026!" &&
      (trimmedId === DEMO_CREDENTIALS.student.id ||
        trimmedId === DEMO_CREDENTIALS.faculty.id ||
        trimmedId === "admin@unicampus.edu" ||
        /^(cse|eee|bba)\.admin@unicampus\.edu$/i.test(trimmedId));

    // Check registered applicant approval status (Admin / Department Admin gate)
    if (!isDemoCredential) {
      const localMatch = adminService.getProfileByEmail(trimmedId);
      if (localMatch) {
        const localStatus =
          localMatch.account_status || (localMatch.is_approved ? "active" : "pending");
        if (localStatus === "rejected") {
          setIsLoading(false);
          setAuthError(
            `Application rejected: "${localMatch.rejection_reason || "Please review admin feedback"}". Open Register → Check Status to correct and re-apply.`
          );
          return;
        }
        if (localStatus === "pending" || !localMatch.is_approved) {
          setIsLoading(false);
          setAuthError(
            "Your registration and admission payment proof are pending verification by your Department Admin or Central Admin."
          );
          return;
        }
        if (localStatus === "suspended") {
          setIsLoading(false);
          setAuthError("This account is currently suspended. Contact the Registrar office.");
          return;
        }

        // Approved by Admin / Department Admin -> Enter respective portal!
        loginWithSupabaseProfile(localMatch);
        setIsLoading(false);
        if (localMatch.role === "admin") {
          router.push("/admin/dashboard");
        } else if (localMatch.role === "teacher") {
          router.push("/teacher/dashboard");
        } else {
          router.push("/dashboard");
        }
        return;
      }
    }

    // Attempt live Supabase Auth for real institutional email accounts
    if (!isDemoCredential && trimmedId.includes("@") && supabaseSyncBridge.isLive()) {
      const result = await supabaseSyncBridge.signInWithPassword(trimmedId, password);
      if (result.profile) {
        const status =
          result.profile.account_status ||
          (result.profile.is_approved ? "active" : "pending");
        if (status === "rejected") {
          setIsLoading(false);
          setAuthError(
            `Your registration was not approved: "${result.profile.rejection_reason || "Please review admin feedback"}". Use Register → Check Status to correct and re-apply.`
          );
          return;
        }
        if (status === "pending" || !result.profile.is_approved) {
          setIsLoading(false);
          setAuthError(
            "Your institutional account is still pending verification by Academic Administration."
          );
          return;
        }
        if (status === "suspended") {
          setIsLoading(false);
          setAuthError("This account is currently suspended. Contact the Registrar office.");
          return;
        }

        loginWithSupabaseProfile(result.profile);
        setIsLoading(false);
        if (result.profile.role === "admin") {
          router.push("/admin/dashboard");
        } else if (result.profile.role === "teacher") {
          router.push("/teacher/dashboard");
        } else {
          router.push("/dashboard");
        }
        return;
      }

      if (result.error) {
        setIsLoading(false);
        setAuthError(result.error);
        return;
      }
    }

    // Instant demo portal sign-in (works offline & preserves E2E flows)
    setTimeout(() => {
      setIsLoading(false);
      if (activePortal === "student") {
        loginAsStudent();
        router.push("/dashboard");
      } else if (activePortal === "faculty") {
        loginAsFaculty();
        router.push("/teacher/dashboard");
      } else {
        if (selectedAdminDept === "super") {
          loginAsAdmin();
        } else {
          loginAsDeptAdmin(selectedAdminDept);
        }
        router.push("/admin/dashboard");
      }
    }, 350);
  };

  const handleSSOLogin = async (provider: "google" | "microsoft") => {
    setAuthError(null);
    setIsLoading(true);

    if (provider === "google" && supabaseSyncBridge.isLive()) {
      const { error } = await supabaseSyncBridge.signInWithGoogle();
      if (error) {
        setIsLoading(false);
        setAuthError(
          error.toLowerCase().includes("provider")
            ? "Google OAuth is not enabled yet in your Supabase Dashboard (Authentication → Providers → Google)."
            : error
        );
      }
      return;
    }

    if (supabaseSyncBridge.isLive()) {
      setIsLoading(false);
      setAuthError("Microsoft 365 SSO is not configured yet. Please sign in with Email or Google.");
      return;
    }

    setTimeout(() => {
      setIsLoading(false);
      if (activePortal === "student") {
        loginAsStudent();
        router.push("/dashboard");
      } else if (activePortal === "faculty") {
        loginAsFaculty();
        router.push("/teacher/dashboard");
      } else {
        if (selectedAdminDept === "super") {
          loginAsAdmin();
        } else {
          loginAsDeptAdmin(selectedAdminDept);
        }
        router.push("/admin/dashboard");
      }
    }, 400);
  };

  return (
    <div className="min-h-dvh flex flex-col justify-between bg-canvas text-fg px-4 py-5 sm:py-7">
      {/* Top Header */}
      <header className="max-w-[440px] w-full mx-auto flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/unicampus_logo.png"
            alt="UniCampus"
            className="w-8 h-8 rounded-xl object-contain"
          />
          <span className="font-semibold text-base text-fg tracking-tight">UniCampus</span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Centered Sign-In Card */}
      <main className="w-full max-w-[440px] mx-auto my-auto py-5">
        <div className="p-6 sm:p-8 rounded-2xl bg-surface border border-line shadow-sm space-y-5">
          <div className="space-y-1 text-center">
            <CampusLottie
              name={activePortal === "faculty" ? "teacher" : activePortal === "admin" ? "routine" : "rocket"}
              className="w-16 h-16 mx-auto"
            />
            <h1 className="text-xl sm:text-2xl font-semibold text-fg tracking-tight">
              Sign in to your portal
            </h1>
            <p className="text-xs sm:text-sm text-fg-muted">
              Sign in with your University ID or institutional email.
            </p>
          </div>

          {/* Demo Quick-Fill Switcher (offline sandbox only — hidden in live Supabase mode) */}
          {!isLiveMode && (
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-surface-2 border border-line">
              {(
                [
                  { id: "student" as const, label: "Student" },
                  { id: "faculty" as const, label: "Faculty" },
                  { id: "admin" as const, label: "Admin" },
                ] as const
              ).map((item) => {
                const isActive = activePortal === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handlePortalSwitch(item.id)}
                    className={`relative h-8 rounded-lg text-xs font-semibold transition-colors cursor-pointer focus:outline-none z-10 ${
                      isActive ? "text-fg" : "text-fg-muted hover:text-fg"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="login-portal-tab"
                        transition={{ type: "spring", stiffness: 460, damping: 30, mass: 0.7 }}
                        className="absolute inset-0 bg-surface border border-line rounded-lg shadow-2xs -z-10"
                      />
                    )}
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Admin Department Sub-Selector (only when Admin selected) */}
            {activePortal === "admin" && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-0.5">
                {[
                  { id: "super", label: "Central Admin" },
                  { id: "dept-cse", label: "CSE Admin" },
                  { id: "dept-eee", label: "EEE Admin" },
                  { id: "dept-bba", label: "BBA Admin" },
                ].map((dept) => (
                  <button
                    key={dept.id}
                    type="button"
                    onClick={() => handleAdminDeptSelect(dept.id as AdminDeptOption)}
                    className={`h-9 px-2 rounded-lg text-[11px] font-semibold border flex items-center justify-center text-center transition-colors cursor-pointer whitespace-nowrap ${
                      selectedAdminDept === dept.id
                        ? "bg-brand-soft text-brand border-brand/40"
                        : "bg-surface text-fg-muted border-line hover:text-fg"
                    }`}
                  >
                    {dept.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          )}

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="login-identifier" className="text-xs font-semibold text-fg block">
                University ID or Institutional Email
              </label>
              <input
                id="login-identifier"
                type="text"
                required
                value={emailOrId}
                onChange={(e) => setEmailOrId(e.target.value)}
                placeholder="211-15-4424 or name@unicampus.edu"
                className="w-full h-11 px-3.5 rounded-xl bg-surface border border-line text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor="login-password" className="font-semibold text-fg">Password</label>
                <Link
                  href="/forgot-password"
                  className="text-brand hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-11 pl-3.5 pr-11 rounded-xl bg-surface border border-line text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-colors font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center text-fg-muted hover:text-fg cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-0.5">
              <label htmlFor="login-remember" className="flex items-center gap-2 text-xs text-fg-muted cursor-pointer select-none">
                <input
                  id="login-remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded accent-[var(--brand)] border-line cursor-pointer"
                />
                <span>Remember this device for 30 days</span>
              </label>
            </div>

            {/* Inline Auth Error Feedback */}
            {authError && (
              <div
                role="alert"
                className="p-3 rounded-xl bg-danger-light border border-danger/25 text-xs text-danger leading-relaxed"
              >
                {authError}
              </div>
            )}

            {/* Submit Button - Matched h-11 Primary CTA */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
              className="h-11 rounded-xl"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign in
            </Button>
          </form>

          {/* SSO Separator */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-line" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-surface text-fg-muted">or continue with</span>
            </div>
          </div>

          {/* SSO Options — Matched h-11 & rounded-xl */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSSOLogin("google")}
              disabled={isLoading}
              className="h-11 px-3 rounded-xl bg-surface hover:bg-surface-2 border border-line text-xs font-semibold text-fg flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleSSOLogin("microsoft")}
              disabled={isLoading}
              className="h-11 px-3 rounded-xl bg-surface hover:bg-surface-2 border border-line text-xs font-semibold text-fg flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 23 23">
                <path fill="#f35325" d="M1 1h10v10H1z" />
                <path fill="#81bc06" d="M12 1h10v10H12z" />
                <path fill="#05a6f0" d="M1 12h10v10H1z" />
                <path fill="#ffba08" d="M12 12h10v10H12z" />
              </svg>
              <span>Microsoft</span>
            </button>
          </div>

          <div className="pt-1 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-center text-xs text-fg-muted">
            <span>New to UniCampus?</span>
            <Link
              href="/register"
              className="text-brand font-semibold hover:underline whitespace-nowrap"
            >
              Create account
            </Link>
          </div>
        </div>
      </main>

      {/* Bottom Support Link */}
      <footer className="max-w-md w-full mx-auto flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-center text-xs text-fg-subtle">
        <span>Need IT assistance?</span>
        <button
          type="button"
          onClick={() => setHelpModalOpen(true)}
          className="text-fg-muted hover:text-fg underline cursor-pointer whitespace-nowrap"
        >
          Contact Campus Helpdesk
        </button>
      </footer>

      {/* PASSWORD RESET MODAL */}
      <Modal
        open={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        title="Credential Recovery Assistance"
        description="For security, university password resets are mediated by administrative officers."
        size="md"
        footer={
          <div className="flex items-center justify-end gap-2.5 w-full">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText("registrar@unicampus.edu");
                setCopiedEmail(true);
                setTimeout(() => setCopiedEmail(false), 2000);
              }}
              leftIcon={copiedEmail ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
            >
              {copiedEmail ? "Email Copied!" : "Copy Support Email"}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setForgotModalOpen(false)}
            >
              Understood
            </Button>
          </div>
        }
      >
        <div className="space-y-3 py-2 text-xs text-fg-muted">
          <p>
            Please contact the Academic Registrar or visit the IT Desk with your physical student/faculty ID card to request a reset link:
          </p>
          <div className="p-4 rounded-xl bg-surface-2 border border-line space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 sm:gap-2">
              <span className="font-semibold text-fg">Academic Registrar:</span>
              <span className="font-sans text-brand font-semibold break-all">registrar@unicampus.edu</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 sm:gap-2">
              <span className="font-semibold text-fg">IT Support Desk:</span>
              <span className="font-sans text-brand font-semibold break-all">it-helpdesk@unicampus.edu</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 sm:gap-2 pt-2 border-t border-line text-fg-subtle">
              <span>Physical Helpdesk:</span>
              <span className="font-medium text-fg">Room 102, Block A (9 AM – 5 PM)</span>
            </div>
          </div>
        </div>
      </Modal>

      {/* CAMPUS DIRECTORY / IT HELPDESK MODAL */}
      <Modal
        open={helpModalOpen}
        onClose={() => setHelpModalOpen(false)}
        title="Campus Support & Directory"
        description="Official contacts for technical assistance and account issues."
        size="md"
        footer={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setHelpModalOpen(false)}
          >
            Close Directory
          </Button>
        }
      >
        <div className="space-y-3 py-2 text-xs">
          <div className="p-3.5 rounded-xl bg-surface-2 border border-line space-y-1">
            <p className="font-semibold text-fg">Campus IT Operations Center</p>
            <p className="text-fg-muted">
              Central academic portal systems are operational. For urgent issues, contact the campus operations desk.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 sm:gap-2 py-1.5 border-b border-line">
              <span className="text-fg-muted">Direct Hotline</span>
              <span className="font-sans tabular-nums font-semibold text-fg">+880 (2) 9834-5500</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 sm:gap-2 py-1.5 border-b border-line">
              <span className="text-fg-muted">Emergency Escalation</span>
              <span className="font-sans font-semibold text-fg break-all">security@unicampus.edu</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 sm:gap-2 py-1.5">
              <span className="text-fg-muted">IT Operations Office</span>
              <span className="font-semibold text-fg">Block B, Level 3, Room 304</span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
