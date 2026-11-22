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
  Check,
  ShieldAlert,
  FileSearch,
} from "lucide-react";
import { adminService } from "@/lib/services/adminService";
import {
  type BoardExamRecord,
  type Department,
  type OrdinalSemesterName,
  type Profile,
  type UserRoleType,
} from "@/types/admin";
import { INITIAL_DEPARTMENTS, ORDINAL_SEMESTERS } from "@/lib/mockData";
import { getAcademicYearForSemester } from "@/lib/canonicalCampus";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { Button, buttonVariants } from "@/components/ui/Button";
import { AcademicIdCard } from "@/components/common/AcademicIdCard";
import {
  INITIAL_STUDENT_FORM,
  INITIAL_TEACHER_FORM,
  type StudentRegistrationForm,
  type TeacherRegistrationForm,
} from "@/components/register/registerConstants";
import { StudentRegistrationSteps } from "@/components/register/StudentRegistrationSteps";
import { TeacherRegistrationSteps } from "@/components/register/TeacherRegistrationSteps";
import { ApplicationStatusPanel } from "@/components/register/ApplicationStatusPanel";

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

  const [viewMode, setViewMode] = useState<"register" | "status">("register");
  const [resubmittingProfile, setResubmittingProfile] = useState<Profile | null>(null);
  const [step, setStep] = useState<number>(1);
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [studentForm, setStudentForm] = useState<StudentRegistrationForm>(INITIAL_STUDENT_FORM);
  const [teacherForm, setTeacherForm] = useState<TeacherRegistrationForm>(INITIAL_TEACHER_FORM);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedPolicy, setAgreedPolicy] = useState(false);
  const [createdProfile, setCreatedProfile] = useState<Profile | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleStartReapply = (profile: Profile) => {
    setResubmittingProfile(profile);
    setCreatedProfile(null);
    setErrorMsg("");
    setStep(1);
    setViewMode("register");

    if (profile.role === "teacher") {
      setRole("teacher");
      const q = profile.teacher_qualifications;
      setTeacherForm({
        ...INITIAL_TEACHER_FORM,
        fullName: profile.full_name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        emergencyPhone: profile.emergency_phone || "",
        photoUrl: profile.avatar_url || "",
        dateOfBirth: profile.date_of_birth || "",
        gender: profile.gender || "Male",
        bloodGroup: profile.blood_group || "O+",
        nationality: profile.nationality || "Bangladeshi",
        nidNumber: profile.nid_or_birth_cert || "",
        presentAddress: profile.present_address || "",
        permanentAddress: profile.permanent_address || "",
        deptId: profile.department_id || "dept-cse",
        designation: q?.designation || "Lecturer",
        employmentType: q?.employment_type || "Full-Time",
        experienceYears: q?.experience_years || "2",
        specialization: q?.specialization || "",
        highestDegree: q?.highest_degree || "M.Sc. / M.A. / MBA",
        undergradDegree: q?.undergrad_degree || "",
        undergradUniversity: q?.undergrad_university || "",
        undergradYear: q?.undergrad_year || "",
        undergradCgpa: q?.undergrad_cgpa || "",
        postgradDegree: q?.postgrad_degree || "",
        postgradUniversity: q?.postgrad_university || "",
        postgradYear: q?.postgrad_year || "",
        cvFilename: q?.cv_filename || "",
        certificateFilename: q?.certificate_filename || "",
      });
    } else {
      setRole("student");
      const jsc = profile.board_exams?.find((b) => b.exam === "JSC");
      const ssc = profile.board_exams?.find((b) => b.exam === "SSC");
      const hsc = profile.board_exams?.find((b) => b.exam === "HSC");
      setStudentForm({
        ...INITIAL_STUDENT_FORM,
        fullName: profile.full_name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        photoUrl: profile.avatar_url || "",
        dateOfBirth: profile.date_of_birth || "",
        gender: profile.gender || "Male",
        bloodGroup: profile.blood_group || "B+",
        religion: profile.religion || "Islam",
        nationality: profile.nationality || "Bangladeshi",
        idDocumentType: profile.id_document_type || "Birth Certificate",
        nidOrBirthCert: profile.nid_or_birth_cert || "",
        fatherName: profile.father_name || "",
        fatherPhone: profile.father_phone || "",
        motherName: profile.mother_name || "",
        motherPhone: profile.mother_phone || "",
        presentAddress: profile.present_address || "",
        permanentAddress: profile.permanent_address || "",
        deptId: profile.department_id || "dept-cse",
        semesterName: (profile.semester_name as OrdinalSemesterName) || "1st Semester",
        jscBoard: jsc?.board || "Dhaka",
        jscYear: jsc?.passing_year || "2019",
        jscGpa: jsc?.gpa || "",
        jscRoll: jsc?.roll_number || "",
        sscBoard: ssc?.board || "Dhaka",
        sscGroup: ssc?.group || "Science",
        sscYear: ssc?.passing_year || "2022",
        sscInstitution: ssc?.institution || "",
        sscRoll: ssc?.roll_number || "",
        sscRegNo: ssc?.registration_number || "",
        sscGpa: ssc?.gpa || "",
        sscMarksheetName: ssc?.marksheet_filename || "",
        hscBoard: hsc?.board || "Dhaka",
        hscGroup: hsc?.group || "Science",
        hscYear: hsc?.passing_year || "2024",
        hscInstitution: hsc?.institution || "",
        hscRoll: hsc?.roll_number || "",
        hscRegNo: hsc?.registration_number || "",
        hscGpa: hsc?.gpa || "",
        hscMarksheetName: hsc?.marksheet_filename || "",
      });
    }
  };

  const updateStudentField = <K extends keyof StudentRegistrationForm>(
    key: K,
    value: StudentRegistrationForm[K]
  ) => {
    setStudentForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateTeacherField = <K extends keyof TeacherRegistrationForm>(
    key: K,
    value: TeacherRegistrationForm[K]
  ) => {
    setTeacherForm((prev) => ({ ...prev, [key]: value }));
  };

  const stepLabels =
    role === "student"
      ? [
          "Personal & Guardian Info",
          "Department & 4-Year Semester",
          "JSC, SSC & HSC Board Records",
          "Security & ID Issuance",
        ]
      : [
          "Personal & NID Details",
          "Department & Designation",
          "Academic Qualifications & CV",
          "Security & ID Issuance",
        ];

  const handleNext = () => {
    setErrorMsg("");

    if (role === "student") {
      if (step === 1) {
        if (!studentForm.fullName.trim() || !studentForm.email.trim() || !studentForm.phone.trim()) {
          setErrorMsg("Please enter your full name, email address, and mobile number.");
          return;
        }
        if (!studentForm.email.includes("@")) {
          setErrorMsg("Please enter a valid email address.");
          return;
        }
        if (!studentForm.dateOfBirth) {
          setErrorMsg("Please enter your date of birth.");
          return;
        }
        if (!studentForm.nidOrBirthCert.trim()) {
          setErrorMsg(`Please enter your ${studentForm.idDocumentType} number.`);
          return;
        }
        if (
          !studentForm.fatherName.trim() ||
          !studentForm.fatherPhone.trim() ||
          !studentForm.motherName.trim() ||
          !studentForm.motherPhone.trim()
        ) {
          setErrorMsg("Please provide Father's and Mother's names and phone numbers.");
          return;
        }
        if (!studentForm.presentAddress.trim()) {
          setErrorMsg("Please provide your present address.");
          return;
        }
        setStep(2);
      } else if (step === 2) {
        if (!studentForm.deptId) {
          setErrorMsg("Please select an academic department.");
          return;
        }
        setStep(3);
      } else if (step === 3) {
        if (
          !studentForm.sscRoll.trim() ||
          !studentForm.sscRegNo.trim() ||
          !studentForm.sscGpa.trim()
        ) {
          setErrorMsg("Please complete your SSC Roll, Registration Number, and GPA.");
          return;
        }
        if (
          !studentForm.hscRoll.trim() ||
          !studentForm.hscRegNo.trim() ||
          !studentForm.hscGpa.trim()
        ) {
          setErrorMsg("Please complete your HSC Roll, Registration Number, and GPA.");
          return;
        }
        setStep(4);
      }
    } else {
      if (step === 1) {
        if (
          !teacherForm.fullName.trim() ||
          !teacherForm.email.trim() ||
          !teacherForm.phone.trim()
        ) {
          setErrorMsg("Please enter your full name, email address, and mobile number.");
          return;
        }
        if (!teacherForm.email.includes("@")) {
          setErrorMsg("Please enter a valid email address.");
          return;
        }
        if (!teacherForm.nidNumber.trim() || !teacherForm.dateOfBirth) {
          setErrorMsg("Please provide your National ID (NID) number and date of birth.");
          return;
        }
        if (!teacherForm.emergencyPhone.trim() || !teacherForm.presentAddress.trim()) {
          setErrorMsg("Please provide an emergency contact number and present address.");
          return;
        }
        setStep(2);
      } else if (step === 2) {
        if (!teacherForm.deptId || !teacherForm.specialization.trim()) {
          setErrorMsg("Please select a department and enter your research specialization.");
          return;
        }
        setStep(3);
      } else if (step === 3) {
        if (
          !teacherForm.undergradDegree.trim() ||
          !teacherForm.undergradUniversity.trim() ||
          !teacherForm.undergradYear.trim() ||
          !teacherForm.undergradCgpa.trim()
        ) {
          setErrorMsg("Please fill in your Undergraduate degree, university, passing year, and CGPA.");
          return;
        }
        setStep(4);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!password.trim() || password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    if (!agreedPolicy) {
      setErrorMsg("Please confirm the academic accuracy declaration to proceed.");
      return;
    }

    if (role === "student") {
      const selectedDept = departments.find((d) => d.id === studentForm.deptId);
      const semIdx = Math.max(1, ORDINAL_SEMESTERS.indexOf(studentForm.semesterName) + 1);
      const deptSlug = (selectedDept?.code || studentForm.deptId.replace(/^dept-/, "") || "cse").toLowerCase();

      const boardExams: BoardExamRecord[] = [
        {
          exam: "JSC",
          board: studentForm.jscBoard,
          passing_year: studentForm.jscYear,
          roll_number: studentForm.jscRoll || undefined,
          gpa: studentForm.jscGpa || "N/A",
        },
        {
          exam: "SSC",
          board: studentForm.sscBoard,
          group: studentForm.sscGroup,
          passing_year: studentForm.sscYear,
          roll_number: studentForm.sscRoll,
          registration_number: studentForm.sscRegNo,
          gpa: studentForm.sscGpa,
          institution: studentForm.sscInstitution || undefined,
          marksheet_filename: studentForm.sscMarksheetName || undefined,
        },
        {
          exam: "HSC",
          board: studentForm.hscBoard,
          group: studentForm.hscGroup,
          passing_year: studentForm.hscYear,
          roll_number: studentForm.hscRoll,
          registration_number: studentForm.hscRegNo,
          gpa: studentForm.hscGpa,
          institution: studentForm.hscInstitution || undefined,
          marksheet_filename: studentForm.hscMarksheetName || undefined,
        },
      ];

      const studentPayload: Omit<Profile, "id" | "created_at"> = {
        full_name: studentForm.fullName.trim(),
        email: studentForm.email.trim().toLowerCase(),
        phone: studentForm.phone.trim(),
        role: "student" as UserRoleType,
        department_id: studentForm.deptId,
        department_name: selectedDept?.name || "Computer Science & Engineering",
        student_id: resubmittingProfile?.student_id || null,
        teacher_code: null,
        semester_name: studentForm.semesterName,
        academic_year: getAcademicYearForSemester(studentForm.semesterName),
        semester_id: `sem-${deptSlug}-${semIdx}`,
        avatar_url: studentForm.photoUrl || "",
        is_approved: false,
        account_status: "pending",
        date_of_birth: studentForm.dateOfBirth,
        gender: studentForm.gender,
        blood_group: studentForm.bloodGroup,
        religion: studentForm.religion,
        nationality: studentForm.nationality,
        id_document_type: studentForm.idDocumentType,
        nid_or_birth_cert: studentForm.nidOrBirthCert.trim(),
        father_name: studentForm.fatherName.trim(),
        father_phone: studentForm.fatherPhone.trim(),
        mother_name: studentForm.motherName.trim(),
        mother_phone: studentForm.motherPhone.trim(),
        emergency_phone: studentForm.fatherPhone.trim(),
        present_address: studentForm.presentAddress.trim(),
        permanent_address: studentForm.permanentAddress.trim() || studentForm.presentAddress.trim(),
        board_exams: boardExams,
      };

      const profile = resubmittingProfile
        ? adminService.resubmitProfile(resubmittingProfile.id, studentPayload) ||
          adminService.createProfile(studentPayload)
        : adminService.createProfile(studentPayload);
      setResubmittingProfile(null);
      setCreatedProfile(profile);
    } else {
      const selectedDept = departments.find((d) => d.id === teacherForm.deptId);
      const teacherPayload: Omit<Profile, "id" | "created_at"> = {
        full_name: teacherForm.fullName.trim(),
        email: teacherForm.email.trim().toLowerCase(),
        phone: teacherForm.phone.trim(),
        role: "teacher" as UserRoleType,
        department_id: teacherForm.deptId,
        department_name: selectedDept?.name || "Computer Science & Engineering",
        student_id: null,
        teacher_code: resubmittingProfile?.teacher_code || null,
        semester_id: null,
        semester_name: null,
        avatar_url: teacherForm.photoUrl || "",
        is_approved: false,
        account_status: "pending",
        date_of_birth: teacherForm.dateOfBirth,
        gender: teacherForm.gender,
        blood_group: teacherForm.bloodGroup,
        nationality: teacherForm.nationality,
        id_document_type: "NID",
        nid_or_birth_cert: teacherForm.nidNumber.trim(),
        emergency_phone: teacherForm.emergencyPhone.trim(),
        present_address: teacherForm.presentAddress.trim(),
        permanent_address: teacherForm.permanentAddress.trim() || teacherForm.presentAddress.trim(),
        teacher_qualifications: {
          designation: teacherForm.designation,
          employment_type: teacherForm.employmentType,
          highest_degree: teacherForm.highestDegree,
          undergrad_degree: teacherForm.undergradDegree.trim(),
          undergrad_university: teacherForm.undergradUniversity.trim(),
          undergrad_year: teacherForm.undergradYear.trim(),
          undergrad_cgpa: teacherForm.undergradCgpa.trim(),
          postgrad_degree: teacherForm.postgradDegree.trim() || undefined,
          postgrad_university: teacherForm.postgradUniversity.trim() || undefined,
          postgrad_year: teacherForm.postgradYear.trim() || undefined,
          experience_years: teacherForm.experienceYears,
          specialization: teacherForm.specialization.trim(),
          cv_filename: teacherForm.cvFilename || undefined,
          certificate_filename: teacherForm.certificateFilename || undefined,
        },
      };

      const profile = resubmittingProfile
        ? adminService.resubmitProfile(resubmittingProfile.id, teacherPayload) ||
          adminService.createProfile(teacherPayload)
        : adminService.createProfile(teacherPayload);
      setResubmittingProfile(null);
      setCreatedProfile(profile);
    }
  };

  const resetAll = () => {
    setCreatedProfile(null);
    setResubmittingProfile(null);
    setStep(1);
    setStudentForm(INITIAL_STUDENT_FORM);
    setTeacherForm(INITIAL_TEACHER_FORM);
    setPassword("");
    setConfirmPassword("");
    setAgreedPolicy(false);
    setErrorMsg("");
  };

  const activeDept = departments.find(
    (d) => d.id === (createdProfile?.department_id || (role === "student" ? studentForm.deptId : teacherForm.deptId))
  );

  return (
    <div className="min-h-dvh flex bg-canvas text-fg">
      {/* LEFT BRAND VALUE PANEL (DESKTOP ONLY) */}
      <div className="hidden lg:flex lg:w-[42%] xl:w-[44%] bg-surface border-r border-line p-10 xl:p-14 flex-col justify-between relative overflow-hidden print:hidden">
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand text-on-brand flex items-center justify-center font-bold text-sm">
              U
            </div>
            <span className="font-semibold text-lg text-fg tracking-tight">UniCampus</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-md space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-soft text-brand text-xs font-semibold">
            <span>4-Year / 8-Semester Academic Admission</span>
          </div>

          <h2 className="text-3xl xl:text-4xl font-semibold text-fg tracking-tight leading-tight">
            Official University Admission &amp; Faculty Registry
          </h2>

          <p className="text-sm text-fg-muted leading-relaxed">
            Complete your academic dossier with verified Bangladeshi board credentials (JSC, SSC, HSC) or faculty qualifications. Your official Academic ID is issued automatically upon submission.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 text-sm text-fg">
              <div className="w-5 h-5 rounded-full bg-brand-soft text-brand flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span>Automatic Academic ID &amp; printable Digital ID Card.</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-fg">
              <div className="w-5 h-5 rounded-full bg-brand-soft text-brand flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span>4-Year / 8-Semester structured undergraduate system.</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-fg">
              <div className="w-5 h-5 rounded-full bg-brand-soft text-brand flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span>Verified SSC/HSC transcripts &amp; NID / Birth Certificate records.</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs text-fg-muted border-t border-line/60 pt-6">
          <span>Office of the Registrar · UniCampus</span>
          <Link href="/login" className="hover:text-fg underline">
            Already registered? Sign in
          </Link>
        </div>
      </div>

      {/* RIGHT REGISTRATION FORM CONTAINER */}
      <div className="flex-1 flex flex-col justify-between px-4 py-4 sm:p-8 lg:p-10 overflow-y-auto">
        <div className="hidden lg:flex justify-end print:hidden">
          <ThemeToggle />
        </div>

        {/* Compact Mobile Top Bar */}
        <header className="lg:hidden space-y-2 pb-3 border-b border-line print:hidden">
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
            <Link href="/login" className="text-brand font-semibold hover:underline whitespace-nowrap">
              Sign in
            </Link>
          </div>
        </header>

        {/* Center Form Container */}
        <div className="w-full max-w-2xl mx-auto pt-5 pb-6 lg:my-auto lg:py-6 space-y-6">
          {/* Top Mode Switcher: New Registration vs Check Status / Re-Apply */}
          {!createdProfile && (
            <div className="flex items-center justify-between gap-2 p-1 rounded-xl bg-surface-2 border border-line print:hidden">
              <button
                type="button"
                onClick={() => setViewMode("register")}
                className={`flex-1 min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  viewMode === "register"
                    ? "bg-surface text-fg shadow-2xs"
                    : "text-fg-muted hover:text-fg"
                }`}
              >
                {resubmittingProfile ? "Re-Applying with Corrections" : "New Registration"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setViewMode("status");
                  setErrorMsg("");
                }}
                className={`flex-1 min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer ${
                  viewMode === "status"
                    ? "bg-surface text-fg shadow-2xs"
                    : "text-fg-muted hover:text-fg"
                }`}
              >
                <FileSearch className="w-3.5 h-3.5 text-brand" />
                <span>Check Status / Re-Apply</span>
              </button>
            </div>
          )}

          {viewMode === "status" && !createdProfile ? (
            <ApplicationStatusPanel
              departments={departments}
              onStartReapply={handleStartReapply}
              onBackToRegister={() => setViewMode("register")}
            />
          ) : createdProfile ? (
            /* Confirmation State + Official Auto-Issued Academic ID Card */
            <div className="space-y-6 text-center">
              <div className="space-y-2 print:hidden">
                <div className="w-14 h-14 rounded-2xl bg-success-light text-success border border-success/30 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success-light text-success text-xs font-semibold">
                  <Clock className="w-3.5 h-3.5" /> Application Recorded • ID Issued
                </div>
                <h2 className="text-2xl font-semibold text-fg tracking-tight">
                  Registration Submitted!
                </h2>
                <p className="text-xs sm:text-sm text-fg-muted leading-relaxed max-w-lg mx-auto">
                  Your official Academic ID{" "}
                  <strong className="font-mono text-brand">
                    {createdProfile.role === "student"
                      ? createdProfile.student_id
                      : createdProfile.teacher_code}
                  </strong>{" "}
                  has been automatically assigned to{" "}
                  <strong className="text-fg">{createdProfile.full_name}</strong>. Your department administrator will verify your documents to activate portal access.
                </p>
              </div>

              {/* Official Printable Academic ID Card */}
              <AcademicIdCard
                role={createdProfile.role === "teacher" ? "teacher" : "student"}
                academicId={
                  (createdProfile.role === "student"
                    ? createdProfile.student_id
                    : createdProfile.teacher_code) || "PENDING"
                }
                fullName={createdProfile.full_name}
                departmentName={createdProfile.department_name || activeDept?.name || "CSE"}
                departmentCode={activeDept?.code || "CSE"}
                photoUrl={createdProfile.avatar_url || null}
                semesterName={createdProfile.semester_name}
                designation={createdProfile.teacher_qualifications?.designation}
                bloodGroup={createdProfile.blood_group}
                phone={createdProfile.phone}
                emergencyPhone={createdProfile.emergency_phone}
                dateOfBirth={createdProfile.date_of_birth}
              />

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto print:hidden">
                <Link
                  href="/login"
                  className={buttonVariants({ variant: "primary", size: "lg", fullWidth: true })}
                >
                  Proceed to Sign In
                  <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                </Link>
                <button
                  type="button"
                  onClick={resetAll}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-medium text-xs text-fg-muted hover:text-fg border border-line hover:bg-surface-2 cursor-pointer transition-colors whitespace-nowrap"
                >
                  New Registration
                </button>
              </div>
            </div>
          ) : (
            /* 4-Step Registration Form */
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold text-fg tracking-tight">
                  Create an academic account
                </h1>
                <p className="text-xs sm:text-sm text-fg-muted mt-1">
                  Step {step} of 4: {stepLabels[step - 1]}
                </p>
              </div>

              {/* 4-Step Progress Bar */}
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((s) => (
                  <div
                    key={s}
                    className={`h-1.5 rounded-full transition-colors duration-150 ${
                      s <= step ? "bg-brand" : "bg-surface-2"
                    }`}
                  />
                ))}
              </div>

              {/* Role Selector (visible on Step 1) */}
              {step === 1 && (
                <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-surface-2 border border-line">
                  <button
                    type="button"
                    onClick={() => {
                      setRole("student");
                      setErrorMsg("");
                    }}
                    className={`min-h-[44px] px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                      role === "student"
                        ? "bg-surface text-fg shadow-2xs"
                        : "text-fg-muted hover:text-fg"
                    }`}
                  >
                    <GraduationCap className="w-4 h-4 text-brand" />
                    <span>Student Admission</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRole("teacher");
                      setErrorMsg("");
                    }}
                    className={`min-h-[44px] px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                      role === "teacher"
                        ? "bg-surface text-fg shadow-2xs"
                        : "text-fg-muted hover:text-fg"
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-success" />
                    <span>Faculty Onboarding</span>
                  </button>
                </div>
              )}

              {resubmittingProfile?.rejection_reason && (
                <div className="p-3.5 rounded-xl bg-warning-light border border-warning/30 space-y-1 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-warning flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      <span>Admin Correction Note (Re-Applying)</span>
                    </span>
                    <button
                      type="button"
                      onClick={resetAll}
                      className="text-[11px] font-semibold text-fg-muted hover:text-fg underline cursor-pointer"
                    >
                      Cancel Re-Apply
                    </button>
                  </div>
                  <p className="text-fg leading-relaxed">
                    {resubmittingProfile.rejection_reason}
                  </p>
                </div>
              )}

              {errorMsg && (
                <div className="p-3 rounded-xl bg-danger-light border border-danger/25 text-danger text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              {/* Steps 1-3: Role-Specific Fields */}
              {step < 4 && (
                <div className="space-y-5">
                  {role === "student" ? (
                    <StudentRegistrationSteps
                      step={step}
                      form={studentForm}
                      onChange={updateStudentField}
                      departments={departments}
                    />
                  ) : (
                    <TeacherRegistrationSteps
                      step={step}
                      form={teacherForm}
                      onChange={updateTeacherField}
                      departments={departments}
                    />
                  )}

                  <div className="flex items-center gap-3 pt-2 border-t border-line">
                    {step > 1 && (
                      <Button
                        type="button"
                        variant="secondary"
                        size="lg"
                        onClick={() => {
                          setErrorMsg("");
                          setStep((s) => s - 1);
                        }}
                        leftIcon={<ArrowLeft className="w-4 h-4" />}
                      >
                        Back
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="primary"
                      size="lg"
                      fullWidth
                      onClick={handleNext}
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      Continue to {stepLabels[step]}
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 4: Security, Review & Auto-ID Issuance */}
              {step === 4 && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="register-password" className="text-xs font-semibold text-fg block mb-1">
                        Choose Password *
                      </label>
                      <input
                        id="register-password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Minimum 6 characters"
                        className="w-full min-h-[42px] px-3 py-2 rounded-xl bg-surface border border-line text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all duration-150"
                      />
                    </div>
                    <div>
                      <label htmlFor="register-confirm-password" className="text-xs font-semibold text-fg block mb-1">
                        Confirm Password *
                      </label>
                      <input
                        id="register-confirm-password"
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full min-h-[42px] px-3 py-2 rounded-xl bg-surface border border-line text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all duration-150"
                      />
                    </div>
                  </div>

                  {/* Application Summary */}
                  <div className="p-4 rounded-xl bg-surface-2 border border-line space-y-2 text-xs">
                    <div className="flex items-center gap-2 font-semibold text-fg">
                      <ShieldCheck className="w-4 h-4 text-brand" />
                      <span>Dossier Summary &amp; Automatic ID Generation</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-fg-muted pt-1">
                      <span>Applicant: <strong className="text-fg">{role === "student" ? studentForm.fullName : teacherForm.fullName}</strong></span>
                      <span>Department: <strong className="text-fg">{activeDept?.code || "CSE"}</strong></span>
                      {role === "student" ? (
                        <>
                          <span>SSC / HSC GPA: <strong className="text-fg font-mono">{studentForm.sscGpa} / {studentForm.hscGpa}</strong></span>
                          <span>Semester: <strong className="text-fg">{studentForm.semesterName}</strong></span>
                        </>
                      ) : (
                        <>
                          <span>Designation: <strong className="text-fg">{teacherForm.designation}</strong></span>
                          <span>Highest Degree: <strong className="text-fg">{teacherForm.highestDegree}</strong></span>
                        </>
                      )}
                    </div>
                  </div>

                  <label className="flex items-start gap-2.5 p-3 rounded-xl bg-surface border border-line cursor-pointer text-xs text-fg-muted">
                    <input
                      type="checkbox"
                      checked={agreedPolicy}
                      onChange={(e) => setAgreedPolicy(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-brand focus:ring-brand"
                    />
                    <span>
                      I certify that all personal, identity, and academic examination records provided above are authentic and accurate. I understand my official Academic ID will be verified by the Registrar.
                    </span>
                  </label>

                  <div className="flex items-center gap-3 pt-1">
                    <Button
                      type="button"
                      variant="secondary"
                      size="lg"
                      onClick={() => setStep(3)}
                      leftIcon={<ArrowLeft className="w-4 h-4" />}
                    >
                      Back
                    </Button>
                    <Button type="submit" variant="primary" size="lg" fullWidth>
                      Submit &amp; Issue Academic ID Card
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        <div className="text-center text-xs text-fg-subtle print:hidden">
          <span>Need enrollment assistance? Contact Office of the Registrar</span>
        </div>
      </div>
    </div>
  );
}
