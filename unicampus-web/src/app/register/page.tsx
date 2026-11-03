"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Lock, 
  Mail, 
  User, 
  ShieldCheck, 
  GraduationCap, 
  Building2, 
  CheckCircle2, 
  Clock, 
  ArrowLeft,
  Check,
  Layers,
  FileCheck
} from "lucide-react";
import { adminService } from "@/lib/services/adminService";
import { Department, OrdinalSemesterName, UserRoleType } from "@/types/admin";
import { ORDINAL_SEMESTERS } from "@/lib/mockData";
import { themeTokens } from "@/lib/theme";
import ClickSpark from "@/components/bits/ClickSpark";
import DecryptedText from "@/components/bits/DecryptedText";

export default function RegisterPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [deptId, setDeptId] = useState("");
  const [semesterName, setSemesterName] = useState<OrdinalSemesterName>("1st Semester");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const depts = adminService.getDepartments();
    setDepartments(depts);
    if (depts.length > 0) {
      setDeptId(depts[0].id);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!fullName.trim() || !email.trim() || !identifier.trim() || !password.trim()) {
      setErrorMsg("Please complete all required fields.");
      return;
    }

    if (!email.includes("@")) {
      setErrorMsg("Please enter a valid academic email address.");
      return;
    }

    const selectedDept = departments.find(d => d.id === deptId);

    // Register into mock database with pending approval state
    adminService.createProfile({
      full_name: fullName.trim(),
      email: email.trim().toLowerCase(),
      role: role as UserRoleType,
      department_id: deptId,
      department_name: selectedDept?.name || "Computer Science & Engineering",
      student_id: role === "student" ? identifier.trim() : null,
      teacher_code: role === "teacher" ? identifier.trim() : null,
      semester_name: role === "student" ? semesterName : null,
      semester_id: role === "student" ? `sem-${deptId || "cse"}-1` : null,
      avatar_url: "",
      is_approved: false,
    });

    setSubmitted(true);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 sm:p-6 ${themeTokens.canvas}`}>
      <div className={`w-full max-w-5xl ${themeTokens.surface} rounded-[36px] sm:rounded-[44px] shadow-2xl flex flex-row-reverse overflow-hidden min-h-[640px] max-h-[calc(100vh-2rem)] overflow-y-auto border ${themeTokens.border}`}>
        
        {/* Right Info Banner */}
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#1D5BD8] via-[#1548B0] to-[#133E92] dark:from-[#2563EB] dark:via-[#1D4ED8] dark:to-[#0D1117] p-12 flex-col justify-between relative overflow-hidden border-l border-slate-200 dark:border-[#30363D] text-white">
          <div className="relative z-10">
            <div className="bg-brand p-3 rounded-2xl w-max mb-8 shadow-lg shadow-brand/30">
              <span className="font-black text-2xl leading-none text-white">U</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white leading-tight mb-4">
              Academic Registry<br/>Onboarding
            </h1>
            <p className="text-slate-300 dark:text-[#8D96A0] font-medium max-w-xs text-sm leading-relaxed">
              Create your official institutional account. Access syllabus resources, live biometric routine, fee clearance, and campus communications.
            </p>
          </div>
          
          {/* Decorative Backdrops */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-24 -right-24 w-72 h-72 bg-emerald-500 rounded-full blur-3xl opacity-15"></div>
          
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-3.5 bg-white/5 dark:bg-[#161B22]/80 p-4 rounded-2xl backdrop-blur-md border border-white/10 dark:border-[#30363D]">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white text-xs font-bold">Identity Verification Gate</p>
                <p className="text-slate-300 text-[10px]">Accounts require department admin clearance before portal activation.</p>
              </div>
            </div>
            <p className="text-white/60 text-[10px] font-mono">
              &copy; 2026 UniCampus Systems Inc. • ISO 27001 Certified Architecture
            </p>
          </div>
        </div>

        {/* Left Form / Success View */}
        <div className="flex-1 p-6 sm:p-10 md:p-12 flex flex-col justify-center overflow-y-auto">
          <div className="max-w-md mx-auto w-full">
            
            {submitted ? (
              /* Success Confirmation Card */
              <div className="space-y-6 text-center">
                <div className="w-16 h-16 rounded-3xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-mono font-bold uppercase mb-2">
                    <Clock className="w-3.5 h-3.5" /> Pending Verification
                  </div>
                  <h2 className={`text-2xl font-black ${themeTokens.heading} tracking-tight`}>
                    Application Submitted!
                  </h2>
                  <p className={`text-xs ${themeTokens.textMuted} mt-2 leading-relaxed`}>
                    Your registration for <strong>{fullName}</strong> ({role === "student" ? "Student" : "Faculty"}) has been received. An Academic Administrator from your department will verify your ID (#{identifier}) before digital access is activated.
                  </p>
                </div>

                <div className={`p-4 rounded-2xl ${themeTokens.subtle} border ${themeTokens.border} text-left space-y-2 text-xs`}>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-[#8D96A0]">Account Role</span>
                    <span className="font-bold text-slate-800 dark:text-[#F0F6FC] capitalize">{role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-[#8D96A0]">Registered Email</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-[#F0F6FC]">{email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-[#8D96A0]">Department</span>
                    <span className="font-bold text-slate-800 dark:text-[#F0F6FC]">
                      {departments.find(d => d.id === deptId)?.name || "CSE"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-[#8D96A0]">Registry Status</span>
                    <span className="font-bold text-amber-500">Awaiting Admin Approval</span>
                  </div>
                </div>

                <div className="space-y-2.5 pt-2">
                  <Link
                    href="/login"
                    className={`w-full py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 ${themeTokens.btnHero} text-xs sm:text-sm shadow-md block`}
                  >
                    <span>Proceed to Portal Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFullName("");
                      setEmail("");
                      setIdentifier("");
                      setPassword("");
                    }}
                    className={`w-full py-2.5 rounded-xl font-semibold text-xs text-slate-500 dark:text-[#8D96A0] hover:text-slate-800 dark:hover:text-white cursor-pointer`}
                  >
                    Submit Another Application
                  </button>
                </div>
              </div>
            ) : (
              /* Registration Form */
              <div>
                <div className="mb-6">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
                    <FileCheck className="w-3.5 h-3.5" />
                    Student &amp; Faculty Registration
                  </div>
                  <h2 className={`text-2xl sm:text-3xl font-extrabold ${themeTokens.heading} tracking-tight`}>
                    Create Account
                  </h2>
                  <p className={`text-xs ${themeTokens.textMuted} font-medium mt-1`}>
                    Select your academic classification and enter enrollment details.
                  </p>
                </div>

                {/* Role Switcher */}
                <div className={`p-1 rounded-2xl ${themeTokens.subtle} border ${themeTokens.border} grid grid-cols-2 gap-1 mb-5`}>
                  <ClickSpark sparkColor="#1D5BD8" sparkCount={6} sparkRadius={18}>
                    <button
                      type="button"
                      onClick={() => setRole("student")}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        role === "student"
                          ? "bg-brand text-white shadow-sm"
                          : `${themeTokens.textSecondary} hover:text-slate-900 dark:hover:text-[#F0F6FC]`
                      }`}
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span>Student Enrollment</span>
                    </button>
                  </ClickSpark>

                  <ClickSpark sparkColor="#2563eb" sparkCount={6} sparkRadius={18}>
                    <button
                      type="button"
                      onClick={() => setRole("teacher")}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        role === "teacher"
                          ? "bg-blue-600 text-white shadow-sm"
                          : `${themeTokens.textSecondary} hover:text-slate-900 dark:hover:text-[#F0F6FC]`
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                      <span>Faculty Instructor</span>
                    </button>
                  </ClickSpark>
                </div>

                {errorMsg && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div>
                    <label htmlFor="reg-fullname" className={`block text-[11px] font-bold ${themeTokens.textSecondary} uppercase tracking-wider mb-1`}>
                      Full Legal Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-[#6E747D]" />
                      <input 
                        id="reg-fullname"
                        type="text" 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        placeholder="e.g. Sakib Ahmed"
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold ${themeTokens.input}`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="reg-email" className={`block text-[11px] font-bold ${themeTokens.textSecondary} uppercase tracking-wider mb-1`}>
                        Academic Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-[#6E747D]" />
                        <input 
                          id="reg-email"
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          placeholder="name@unicampus.edu"
                          className={`w-full pl-10 pr-3 py-2.5 rounded-xl text-xs font-semibold ${themeTokens.input}`}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="reg-identifier" className={`block text-[11px] font-bold ${themeTokens.textSecondary} uppercase tracking-wider mb-1`}>
                        {role === "student" ? "Student ID" : "Teacher Code"}
                      </label>
                      <input 
                        id="reg-identifier"
                        type="text" 
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        required
                        placeholder={role === "student" ? "e.g. 211-15-4424" : "e.g. T-0422"}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold font-mono ${themeTokens.input}`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="reg-dept" className={`block text-[11px] font-bold ${themeTokens.textSecondary} uppercase tracking-wider mb-1`}>
                        Department
                      </label>
                      <select
                        id="reg-dept"
                        value={deptId}
                        onChange={(e) => setDeptId(e.target.value)}
                        className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold ${themeTokens.select}`}
                      >
                        {departments.map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name} ({dept.code})
                          </option>
                        ))}
                      </select>
                    </div>

                    {role === "student" ? (
                      <div>
                        <label htmlFor="reg-semester" className={`block text-[11px] font-bold ${themeTokens.textSecondary} uppercase tracking-wider mb-1`}>
                          Initial Semester
                        </label>
                        <select
                          id="reg-semester"
                          value={semesterName}
                          onChange={(e) => setSemesterName(e.target.value as OrdinalSemesterName)}
                          className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold ${themeTokens.select}`}
                        >
                          {ORDINAL_SEMESTERS.map((sem) => (
                            <option key={sem} value={sem}>{sem}</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div>
                        <label htmlFor="reg-rank" className={`block text-[11px] font-bold ${themeTokens.textSecondary} uppercase tracking-wider mb-1`}>
                          Faculty Rank
                        </label>
                        <select id="reg-rank" className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold ${themeTokens.select}`}>
                          <option>Associate Professor</option>
                          <option>Assistant Professor</option>
                          <option>Senior Lecturer</option>
                          <option>Visiting Faculty</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="reg-password" className={`block text-[11px] font-bold ${themeTokens.textSecondary} uppercase tracking-wider mb-1`}>
                      Portal Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-[#6E747D]" />
                      <input 
                        id="reg-password"
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Create a secure password"
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold ${themeTokens.input}`}
                      />
                    </div>
                  </div>

                  <ClickSpark sparkColor={role === "teacher" ? "#2563eb" : "#1D5BD8"} sparkCount={10} sparkRadius={24}>
                    <button 
                      type="submit" 
                      className={`w-full py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-md mt-5 cursor-pointer text-xs sm:text-sm text-white ${
                        role === "teacher"
                          ? "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20"
                          : "bg-brand hover:bg-brand-hover shadow-brand/20"
                      }`}
                    >
                      <span>Submit Registration Application</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </ClickSpark>
                </form>

                <div className={`mt-6 pt-4 border-t ${themeTokens.borderSubtle} text-center`}>
                  <p className={`text-xs font-medium ${themeTokens.textMuted}`}>
                    Already registered and approved? <Link href="/login" className="font-bold text-brand hover:underline">Sign In</Link>
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}