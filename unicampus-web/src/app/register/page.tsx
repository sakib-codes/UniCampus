"use client";

import React, { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  ArrowLeft,
  ShieldCheck, 
  GraduationCap, 
  Building2, 
  CheckCircle2, 
  Clock, 
  Check
} from "lucide-react";
import { adminService } from "@/lib/services/adminService";
import { Department, OrdinalSemesterName, UserRoleType } from "@/types/admin";
import { INITIAL_DEPARTMENTS, ORDINAL_SEMESTERS } from "@/lib/mockData";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { Button } from "@/components/ui/Button";

const emptySubscribe = () => () => {};

export default function RegisterPage() {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const departments = useMemo<Department[]>(() => {
    if (!mounted) return INITIAL_DEPARTMENTS;
    try {
      const loaded = adminService.getDepartments();
      return loaded.length > 0 ? loaded : INITIAL_DEPARTMENTS;
    } catch {
      return INITIAL_DEPARTMENTS;
    }
  }, [mounted]);

  const [step, setStep] = useState<number>(1);
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [deptId, setDeptId] = useState<string>(INITIAL_DEPARTMENTS[0]?.id ?? "dept-cse");
  const [semesterName, setSemesterName] = useState<OrdinalSemesterName>("1st Semester");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");


  const handleNext = () => {
    setErrorMsg("");
    if (step === 1) {
      if (!fullName.trim() || !email.trim()) {
        setErrorMsg("Please enter your name and email.");
        return;
      }
      if (!email.includes("@")) {
        setErrorMsg("Please enter a valid academic email address.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!identifier.trim()) {
        setErrorMsg(role === "student" ? "Please enter your Student ID." : "Please enter your Teacher Code.");
        return;
      }
      setStep(3);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!password.trim() || password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    const selectedDept = departments.find(d => d.id === deptId);
    const semIdx = Math.max(1, ORDINAL_SEMESTERS.indexOf(semesterName) + 1);
    const deptSlug = (selectedDept?.code || deptId.replace(/^dept-/, "") || "cse").toLowerCase();

    adminService.createProfile({
      full_name: fullName.trim(),
      email: email.trim().toLowerCase(),
      role: role as UserRoleType,
      department_id: deptId,
      department_name: selectedDept?.name || "Computer Science & Engineering",
      student_id: role === "student" ? identifier.trim() : null,
      teacher_code: role === "teacher" ? identifier.trim() : null,
      semester_name: role === "student" ? semesterName : null,
      semester_id: role === "student" ? `sem-${deptSlug}-${semIdx}` : null,
      avatar_url: "",
      is_approved: false,
    });

    setSubmitted(true);
  };

  return (
    <div className="min-h-dvh flex bg-canvas text-fg">
      {/* =========================================================================
          LEFT BRAND VALUE PANEL (DESKTOP ONLY)
      ========================================================================= */}
      <div className="hidden lg:flex lg:w-1/2 bg-surface border-r border-line p-12 xl:p-16 flex-col justify-between relative overflow-hidden">
        {/* Brand Header */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand text-on-brand flex items-center justify-center font-bold text-sm">
              U
            </div>
            <span className="font-semibold text-lg text-fg tracking-tight">UniCampus</span>
          </Link>
        </div>

        {/* Value Proposition */}
        <div className="relative z-10 max-w-md space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-soft text-brand text-xs font-semibold">
            <span>Academic Onboarding</span>
          </div>

          <h2 className="text-3xl xl:text-4xl font-semibold text-fg tracking-tight leading-tight">
            Create your official university account
          </h2>

          <p className="text-sm text-fg-muted leading-relaxed">
            Register with your institutional credentials to gain access to class timetables, attendance passes, gradebooks, and department communications.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 text-sm text-fg">
              <div className="w-5 h-5 rounded-full bg-brand-soft text-brand flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span>Verified semester enrollment records.</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-fg">
              <div className="w-5 h-5 rounded-full bg-brand-soft text-brand flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span>Fast departmental credential approval.</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-fg">
              <div className="w-5 h-5 rounded-full bg-brand-soft text-brand flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span>Unified access across web and mobile.</span>
            </div>
          </div>
        </div>

        {/* Footer Notes */}
        <div className="relative z-10 flex items-center justify-between text-xs text-fg-muted border-t border-line/60 pt-6">
          <span>Official University Registry</span>
          <Link href="/login" className="hover:text-fg underline">
            Already have an account? Sign in
          </Link>
        </div>
      </div>

      {/* =========================================================================
          RIGHT REGISTRATION FORM CONTAINER
      ========================================================================= */}
      <div className="flex-1 flex flex-col justify-between px-4 py-4 sm:p-10 lg:p-12 xl:p-16 overflow-y-auto">
        {/* Desktop Theme Toggle */}
        <div className="hidden lg:flex justify-end">
          <ThemeToggle />
        </div>

        {/* Compact Mobile Top Bar */}
        <header className="lg:hidden space-y-2 pb-3 border-b border-line">
          <div className="flex items-center justify-between gap-2">
            <Link href="/" className="inline-flex items-center gap-2 min-h-[44px] pr-2">
              <div className="w-7 h-7 rounded-lg bg-brand text-on-brand flex items-center justify-center font-bold text-xs">
                U
              </div>
              <span className="font-semibold text-fg text-sm tracking-tight">UniCampus</span>
            </Link>
            <ThemeToggle size="sm" />
          </div>
          <div className="flex items-center justify-between gap-2 text-xs text-fg-muted">
            <span>Already have an account?</span>
            <Link
              href="/login"
              className="text-brand font-semibold hover:underline whitespace-nowrap"
            >
              Sign in
            </Link>
          </div>
        </header>

        {/* Center Container */}
        <div className="w-full max-w-md mx-auto pt-5 pb-6 lg:my-auto lg:py-8 space-y-6">
          {submitted ? (
            /* Confirmation State */
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                  <Clock className="w-3.5 h-3.5" /> Pending Verification
                </div>
                <h2 className="text-2xl font-semibold text-fg tracking-tight">
                  Registration Submitted!
                </h2>
                <p className="text-xs sm:text-sm text-fg-muted leading-relaxed">
                  Your registration for <strong className="text-fg">{fullName}</strong> ({role === "student" ? "Student" : "Faculty"}) has been received. Your department administrator will verify your ID before your portal session is activated.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-surface border border-line text-left space-y-2 text-xs">
                <div className="flex justify-between gap-3 items-start">
                  <span className="text-fg-muted shrink-0">Role</span>
                  <span className="font-semibold text-fg capitalize text-right">{role}</span>
                </div>
                <div className="flex justify-between gap-3 items-start">
                  <span className="text-fg-muted shrink-0">Email</span>
                  <span className="font-mono text-fg font-medium text-right break-all">{email}</span>
                </div>
                <div className="flex justify-between gap-3 items-start">
                  <span className="text-fg-muted shrink-0">Department</span>
                  <span className="font-semibold text-fg text-right">
                    {departments.find(d => d.id === deptId)?.name || "CSE"}
                  </span>
                </div>
                <div className="flex justify-between gap-3 items-start">
                  <span className="text-fg-muted shrink-0">Status</span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400 text-right">Awaiting Admin Approval</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Link href="/login" className="block">
                  <Button variant="primary" size="lg" fullWidth rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Proceed to Sign In
                  </Button>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setStep(1);
                    setFullName("");
                    setEmail("");
                    setIdentifier("");
                    setPassword("");
                  }}
                  className="w-full py-2.5 rounded-xl font-medium text-xs text-fg-muted hover:text-fg cursor-pointer transition-colors"
                >
                  Submit Another Application
                </button>
              </div>
            </div>
          ) : (
            /* Multi-Step Form */
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold text-fg tracking-tight">
                  Create an account
                </h1>
                <p className="text-sm text-fg-muted mt-1">
                  Step {step} of 3: {step === 1 ? "Role & Identity" : step === 2 ? "Academic Details" : "Security & Password"}
                </p>
              </div>

              {/* Step Progression Bar */}
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`h-1.5 rounded-full transition-[width,background-color] duration-150 ${
                      s <= step ? "bg-brand" : "bg-surface-2"
                    }`}
                  />
                ))}
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-danger-light border border-danger/25 text-danger text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              {/* Step 1: Role & Identity */}
              {step === 1 && (
                <div className="space-y-4">
                  {/* Role Selector */}
                  <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-surface-2 border border-line">
                    <button
                      type="button"
                      onClick={() => setRole("student")}
                      className={`min-h-[44px] px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                        role === "student"
                          ? "bg-surface text-fg shadow-2xs"
                          : "text-fg-muted hover:text-fg"
                      }`}
                    >
                      <GraduationCap className="w-4 h-4 text-brand" />
                      <span>Student</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole("teacher")}
                      className={`min-h-[44px] px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                        role === "teacher"
                          ? "bg-surface text-fg shadow-2xs"
                          : "text-fg-muted hover:text-fg"
                      }`}
                    >
                      <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Faculty</span>
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-fg block">Full Legal Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Sakib Ahmed"
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-surface border border-line text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-fg block">Institutional Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={role === "student" ? "student@unicampus.edu" : "faculty@unicampus.edu"}
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-surface border border-line text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-colors font-mono"
                    />
                  </div>

                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={handleNext}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Continue to Academic Details
                  </Button>
                </div>
              )}

              {/* Step 2: Academic Details */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-fg block">Department</label>
                    <select
                      value={deptId}
                      onChange={(e) => setDeptId(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-surface border border-line text-sm text-fg focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-colors cursor-pointer"
                    >
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-fg block">
                      {role === "student" ? "Student ID Number" : "Faculty Code / Identifier"}
                    </label>
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder={role === "student" ? "e.g. 211-15-4424" : "e.g. FAC-1042"}
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-surface border border-line text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-colors font-mono"
                    />
                  </div>

                  {role === "student" && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-fg block">Current Semester</label>
                      <select
                        value={semesterName}
                        onChange={(e) => setSemesterName(e.target.value as OrdinalSemesterName)}
                        className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-surface border border-line text-sm text-fg focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-colors cursor-pointer"
                      >
                        {ORDINAL_SEMESTERS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-1">
                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={() => setStep(1)}
                      leftIcon={<ArrowLeft className="w-4 h-4" />}
                    >
                      Back
                    </Button>
                    <Button
                      variant="primary"
                      size="lg"
                      fullWidth
                      onClick={handleNext}
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      Continue to Password
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Password & Submit */}
              {step === 3 && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-fg block">Choose Password</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-surface border border-line text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-colors font-mono"
                    />
                  </div>

                  <div className="p-3.5 rounded-xl bg-surface-2 border border-line space-y-1 text-xs text-fg-muted">
                    <div className="flex items-center gap-2 font-semibold text-fg">
                      <ShieldCheck className="w-4 h-4 text-brand" />
                      <span>Verification Policy</span>
                    </div>
                    <p>
                      Your account will be created with pending approval status. A department officer will verify your enrollment credentials before activating your portal pass.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={() => setStep(2)}
                      leftIcon={<ArrowLeft className="w-4 h-4" />}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      fullWidth
                    >
                      Submit Registration
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Bottom Support Link */}
        <div className="text-center text-xs text-fg-subtle">
          <span>Need enrollment assistance? Contact Academic Registrar</span>
        </div>
      </div>
    </div>
  );
}
