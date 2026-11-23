"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Briefcase,
  Camera,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  FileSearch,
  GraduationCap,
  ShieldAlert,
  Upload,
} from "lucide-react";
import { adminService } from "@/lib/services/adminService";
import { supabaseSyncBridge } from "@/lib/supabase/syncBridge";
import {
  type BoardExamRecord,
  type Department,
  type OrdinalSemesterName,
  type Profile,
  type UserRoleType,
} from "@/types/admin";
import { INITIAL_DEPARTMENTS } from "@/lib/mockData";
import { getSemesterIndex } from "@/lib/canonicalCampus";
import { getAcademicYearForSemester } from "@/lib/canonicalCampus";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { Button, buttonVariants } from "@/components/ui/Button";
import { AcademicIdCard } from "@/components/common/AcademicIdCard";
import { CampusLottie, type CampusAnimationName } from "@/components/common/CampusLottie";
import {
  INITIAL_STUDENT_FORM,
  INITIAL_TEACHER_FORM,
  type StudentRegistrationForm,
  type TeacherRegistrationForm,
} from "@/components/register/registerConstants";
import { StudentRegistrationSteps } from "@/components/register/StudentRegistrationSteps";
import { TeacherRegistrationSteps } from "@/components/register/TeacherRegistrationSteps";
import { ContactVerificationStep } from "@/components/register/ContactVerificationStep";
import { ApplicationStatusPanel } from "@/components/register/ApplicationStatusPanel";

interface StepMeta {
  title: string;
  subtitle: string;
  animation: CampusAnimationName;
}

function getStepMeta(step: number, role: "student" | "teacher"): StepMeta {
  if (step === 0) {
    return {
      title: "Join UniCampus",
      subtitle: "Choose how you will use the university portal.",
      animation: "rocket",
    };
  }
  if (step === 1) {
    return {
      title: "Let's start with your basics",
      subtitle: "Tell us your name, email, and mobile number.",
      animation: "rocket",
    };
  }
  if (step === 2) {
    return {
      title: "Verify your email & phone",
      subtitle: "Confirm both with a 6-digit OTP so we can protect your account.",
      animation: "rocket",
    };
  }
  if (step === 3) {
    return {
      title: "Verify your identity",
      subtitle: "Used for your official Academic ID Card and registry records.",
      animation: "routine",
    };
  }
  if (step === 4) {
    return role === "student"
      ? {
          title: "Guardian & address details",
          subtitle: "Required for student safety and institutional records.",
          animation: "routine",
        }
      : {
          title: "Emergency contact & address",
          subtitle: "Kept private for faculty HR and campus administration.",
          animation: "routine",
        };
  }
  if (step === 5) {
    return role === "student"
      ? {
          title: "Choose your department & program",
          subtitle: "Select your department, degree program, and semester track.",
          animation: "routine",
        }
      : {
          title: "Department & academic rank",
          subtitle: "Select your teaching department and specialization.",
          animation: "teacher",
        };
  }
  if (step === 6) {
    return role === "student"
      ? {
          title: "Your board exam results",
          subtitle: "Fill SSC and HSC details one tab at a time (JSC is optional).",
          animation: "teacher",
        }
      : {
          title: "Academic degrees & CV",
          subtitle: "Add your undergraduate degree, postgraduate (optional), and CV.",
          animation: "teacher",
        };
  }
  if (role === "student" && step === 7) {
    return {
      title: "Admission payment verification",
      subtitle: "Enter your TrxID and upload your admission pay slip screenshot or PDF.",
      animation: "routine",
    };
  }
  return {
    title: "Add a photo & secure your account",
    subtitle: "Your photo appears on your ID card. You can also skip it for now.",
    animation: "rocket",
  };
}

export default function RegisterPage() {
  const [departments, setDepartments] = useState<Department[]>(() =>
    supabaseSyncBridge.isLive() ? [] : INITIAL_DEPARTMENTS
  );

  useEffect(() => {
    const syncDepts = () => {
      try {
        const loaded = adminService.getDepartments();
        if (supabaseSyncBridge.isLive() || loaded.length > 0) {
          setDepartments(loaded);
        }
      } catch {
        // ignore storage error
      }
    };
    queueMicrotask(() => syncDepts());
    void adminService.hydrateFromSupabase().then((hydrated) => {
      if (hydrated) syncDepts();
    });
    window.addEventListener("unicampus:departments-updated", syncDepts);
    return () => {
      window.removeEventListener("unicampus:departments-updated", syncDepts);
    };
  }, []);

  const [viewMode, setViewMode] = useState<"register" | "status">("register");
  const [resubmittingProfile, setResubmittingProfile] = useState<Profile | null>(null);
  const [step, setStep] = useState<number>(0); // 0 = Role Picker, 1..6 = Micro-steps
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [studentForm, setStudentForm] = useState<StudentRegistrationForm>(INITIAL_STUDENT_FORM);
  const [teacherForm, setTeacherForm] = useState<TeacherRegistrationForm>(INITIAL_TEACHER_FORM);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedPolicy, setAgreedPolicy] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [isGoogleOAuth, setIsGoogleOAuth] = useState(false);
  const [createdProfile, setCreatedProfile] = useState<Profile | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Auto-detect Google OAuth handoff (/register?oauth=google) — pre-fill email/name & skip asking email!
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("oauth") !== "google") return;

    void supabaseSyncBridge.getOAuthUserMeta().then((meta) => {
      if (!meta) return;
      setIsGoogleOAuth(true);
      setEmailVerified(true);
      setStudentForm((prev) => ({
        ...prev,
        email: meta.email,
        firstName: prev.firstName || meta.firstName,
        lastName: prev.lastName || meta.lastName,
        photoUrl: prev.photoUrl || meta.avatarUrl,
      }));
      setTeacherForm((prev) => ({
        ...prev,
        email: meta.email,
        firstName: prev.firstName || meta.firstName,
        lastName: prev.lastName || meta.lastName,
        photoUrl: prev.photoUrl || meta.avatarUrl,
      }));
    });
  }, []);

  const updateStudent = <K extends keyof StudentRegistrationForm>(
    key: K,
    value: StudentRegistrationForm[K]
  ) => {
    setStudentForm((prev) => ({ ...prev, [key]: value }));
    if (key === "email") setEmailVerified(false);
    if (key === "phone") setPhoneVerified(false);
    if (errorMsg) setErrorMsg("");
  };

  const updateTeacher = <K extends keyof TeacherRegistrationForm>(
    key: K,
    value: TeacherRegistrationForm[K]
  ) => {
    setTeacherForm((prev) => ({ ...prev, [key]: value }));
    if (key === "email") setEmailVerified(false);
    if (key === "phone") setPhoneVerified(false);
    if (errorMsg) setErrorMsg("");
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        if (role === "student") {
          updateStudent("photoUrl", reader.result);
        } else {
          updateTeacher("photoUrl", reader.result);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleStartReapply = (profile: Profile) => {
    setResubmittingProfile(profile);
    setCreatedProfile(null);
    setErrorMsg("");
    setStep(1);
    setViewMode("register");

    const nameParts = (profile.full_name || "").trim().split(/\s+/);
    const parsedFirstName = nameParts[0] || "";
    const parsedLastName = nameParts.slice(1).join(" ");

    if (profile.role === "teacher") {
      setRole("teacher");
      const q = profile.teacher_qualifications;
      setTeacherForm({
        ...INITIAL_TEACHER_FORM,
        firstName: parsedFirstName,
        lastName: parsedLastName,
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
        firstName: parsedFirstName,
        lastName: parsedLastName,
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
        programName: profile.program_name || INITIAL_STUDENT_FORM.programName,
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
        paymentMethod: profile.admission_payment?.method || "bKash",
        paymentTrxId: profile.admission_payment?.trx_id || "",
        paymentAmount: profile.admission_payment?.amount || "15000",
        paymentDate: profile.admission_payment?.paid_date || "",
        paymentSlipName: profile.admission_payment?.slip_filename || "",
        paymentSlipPreviewUrl: profile.admission_payment?.slip_preview_url || "",
      });
    }
  };

  const totalFormSteps = role === "student" ? 8 : 7;

  const validateAndAdvance = () => {
    setErrorMsg("");

    // Step 2 is shared OTP verification for both Student and Teacher
    if (step === 2) {
      if (!emailVerified || !phoneVerified) {
        setErrorMsg("Please verify both your email address and mobile number via 6-digit OTP before continuing.");
        return;
      }
      setStep(3);
      return;
    }

    const innerStep = step >= 3 ? step - 1 : step;

    if (role === "student") {
      if (innerStep === 1) {
        if (
          !studentForm.firstName.trim() ||
          !studentForm.lastName.trim() ||
          !studentForm.email.trim() ||
          !studentForm.phone.trim()
        ) {
          setErrorMsg("Please enter your first name, last name, email address, and mobile number.");
          return;
        }
        if (!studentForm.email.includes("@")) {
          setErrorMsg("Please enter a valid email address.");
          return;
        }
      } else if (innerStep === 2) {
        if (!studentForm.dateOfBirth || !studentForm.nidOrBirthCert.trim()) {
          setErrorMsg("Please enter your date of birth and NID / Birth Certificate number.");
          return;
        }
      } else if (innerStep === 3) {
        if (
          !studentForm.fatherName.trim() ||
          !studentForm.fatherPhone.trim() ||
          !studentForm.motherName.trim() ||
          !studentForm.motherPhone.trim() ||
          !studentForm.presentAddress.trim()
        ) {
          setErrorMsg("Please enter both parents' names, phone numbers, and your present address.");
          return;
        }
      } else if (innerStep === 4) {
        if (!studentForm.deptId || !studentForm.programName.trim() || !studentForm.semesterName) {
          setErrorMsg("Please select your department, academic program, and semester.");
          return;
        }
      } else if (innerStep === 5) {
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
          setErrorMsg("Please switch to the HSC tab and enter your HSC Roll, Registration Number, and GPA.");
          return;
        }
      } else if (innerStep === 6) {
        if (!studentForm.paymentTrxId.trim()) {
          setErrorMsg("Please enter your Admission Fee Transaction ID (TrxID) or Bank Slip number.");
          return;
        }
        if (!studentForm.paymentSlipName.trim()) {
          setErrorMsg("Please upload your Admission Pay Slip screenshot or PDF for verification.");
          return;
        }
      }
    } else {
      if (innerStep === 1) {
        if (
          !teacherForm.firstName.trim() ||
          !teacherForm.lastName.trim() ||
          !teacherForm.email.trim() ||
          !teacherForm.phone.trim()
        ) {
          setErrorMsg("Please enter your first name, last name, email address, and mobile number.");
          return;
        }
        if (!teacherForm.email.includes("@")) {
          setErrorMsg("Please enter a valid email address.");
          return;
        }
      } else if (innerStep === 2) {
        if (!teacherForm.dateOfBirth || !teacherForm.nidNumber.trim()) {
          setErrorMsg("Please provide your date of birth and National ID (NID) number.");
          return;
        }
      } else if (innerStep === 3) {
        if (!teacherForm.emergencyPhone.trim() || !teacherForm.presentAddress.trim()) {
          setErrorMsg("Please provide an emergency contact number and present address.");
          return;
        }
      } else if (innerStep === 4) {
        if (!teacherForm.deptId || !teacherForm.specialization.trim()) {
          setErrorMsg("Please select a department and enter your research specialization.");
          return;
        }
      } else if (innerStep === 5) {
        if (
          !teacherForm.undergradDegree.trim() ||
          !teacherForm.undergradUniversity.trim() ||
          !teacherForm.undergradYear.trim() ||
          !teacherForm.undergradCgpa.trim()
        ) {
          setErrorMsg("Please fill in your Undergraduate degree, university, passing year, and CGPA.");
          return;
        }
      }
    }

    setStep((prev) => Math.min(totalFormSteps, prev + 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < totalFormSteps) {
      validateAndAdvance();
      return;
    }

    setErrorMsg("");

    if (!isGoogleOAuth) {
      if (!password.trim() || password.length < 6) {
        setErrorMsg("Password must be at least 6 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg("Passwords do not match.");
        return;
      }
    }
    if (!agreedPolicy) {
      setErrorMsg("Please confirm the academic accuracy declaration to proceed.");
      return;
    }

    if (role === "student") {
      const selectedDept = departments.find((d) => d.id === studentForm.deptId);
      const semIdx = getSemesterIndex(studentForm.semesterName);
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
        full_name: `${studentForm.firstName.trim()} ${studentForm.lastName.trim()}`.trim(),
        email: studentForm.email.trim().toLowerCase(),
        phone: studentForm.phone.trim(),
        role: "student" as UserRoleType,
        department_id: studentForm.deptId,
        department_name: selectedDept?.name || "Computer Science & Engineering",
        program_name: studentForm.programName.trim(),
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
        admission_payment: {
          method: studentForm.paymentMethod,
          trx_id: studentForm.paymentTrxId.trim(),
          amount: studentForm.paymentAmount.trim() || "15000",
          paid_date: studentForm.paymentDate || new Date().toISOString().slice(0, 10),
          slip_filename: studentForm.paymentSlipName || undefined,
          slip_preview_url: studentForm.paymentSlipPreviewUrl || undefined,
        },
        email_verified: emailVerified,
        phone_verified: phoneVerified,
      };

      const profile = resubmittingProfile
        ? adminService.resubmitProfile(resubmittingProfile.id, studentPayload) ||
          adminService.createProfile(studentPayload)
        : adminService.createProfile(studentPayload);

      if (!resubmittingProfile && supabaseSyncBridge.isLive()) {
        const deptCode = selectedDept?.code || deptSlug.toUpperCase();
        if (isGoogleOAuth) {
          void supabaseSyncBridge.completeOAuthProfile(
            { ...studentPayload, student_id: profile.student_id },
            deptCode
          );
        } else {
          void supabaseSyncBridge.signUpWithProfile(
            studentPayload.email,
            password,
            { ...studentPayload, student_id: profile.student_id },
            deptCode
          );
        }
      }

      setResubmittingProfile(null);
      setCreatedProfile(profile);
    } else {
      const selectedDept = departments.find((d) => d.id === teacherForm.deptId);
      const teacherPayload: Omit<Profile, "id" | "created_at"> = {
        full_name: `${teacherForm.firstName.trim()} ${teacherForm.lastName.trim()}`.trim(),
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
        email_verified: emailVerified,
        phone_verified: phoneVerified,
      };

      const profile = resubmittingProfile
        ? adminService.resubmitProfile(resubmittingProfile.id, teacherPayload) ||
          adminService.createProfile(teacherPayload)
        : adminService.createProfile(teacherPayload);

      if (!resubmittingProfile && supabaseSyncBridge.isLive()) {
        const deptCode = selectedDept?.code || teacherForm.deptId.replace(/^dept-/, "").toUpperCase();
        if (isGoogleOAuth) {
          void supabaseSyncBridge.completeOAuthProfile(
            { ...teacherPayload, teacher_code: profile.teacher_code },
            deptCode
          );
        } else {
          void supabaseSyncBridge.signUpWithProfile(
            teacherPayload.email,
            password,
            { ...teacherPayload, teacher_code: profile.teacher_code },
            deptCode
          );
        }
      }

      setResubmittingProfile(null);
      setCreatedProfile(profile);
    }
  };

  const resetAll = () => {
    setCreatedProfile(null);
    setResubmittingProfile(null);
    setStep(0);
    setStudentForm(INITIAL_STUDENT_FORM);
    setTeacherForm(INITIAL_TEACHER_FORM);
    setPassword("");
    setConfirmPassword("");
    setAgreedPolicy(false);
    setEmailVerified(false);
    setPhoneVerified(false);
    setErrorMsg("");
  };

  const activeDept = departments.find(
    (d) =>
      d.id ===
      (createdProfile?.department_id || (role === "student" ? studentForm.deptId : teacherForm.deptId))
  );
  const currentPhotoUrl = role === "student" ? studentForm.photoUrl : teacherForm.photoUrl;
  const stepMeta = getStepMeta(step, role);
  const progressPct = Math.round(((step + 1) / (totalFormSteps + 1)) * 100);

  return (
    <div className="min-h-dvh flex flex-col bg-canvas text-fg px-4 py-5 sm:py-7">
      {/* Clean Minimal Top Bar (Google / Discord / X pattern) */}
      <header className="w-full max-w-[540px] mx-auto flex items-center justify-between gap-3 print:hidden">
        <Link href="/" className="inline-flex items-center gap-2.5 min-h-[44px] group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/unicampus_logo.png"
            alt="UniCampus"
            className="w-8 h-8 rounded-xl object-contain"
          />
          <span className="font-semibold text-base text-fg tracking-tight">UniCampus</span>
        </Link>

        <div className="flex items-center gap-2">
          {!createdProfile && (
            <button
              type="button"
              onClick={() => {
                setViewMode((prev) => (prev === "register" ? "status" : "register"));
                setErrorMsg("");
              }}
              className={`h-11 px-3.5 rounded-xl border text-[13px] font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 whitespace-nowrap ${
                viewMode === "status"
                  ? "bg-brand-soft border-brand text-brand"
                  : "bg-surface border-line text-fg-muted hover:text-fg hover:border-line-strong"
              }`}
            >
              <FileSearch className="w-4 h-4" />
              <span>{viewMode === "status" ? "New Application" : "Check Status"}</span>
            </button>
          )}
          <div className="h-11 w-11 rounded-xl bg-surface border border-line flex items-center justify-center">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Centered Onboarding Card */}
      <main className="w-full max-w-[540px] mx-auto flex-1 flex flex-col justify-center py-6">
        {viewMode === "status" && !createdProfile ? (
          <div className="p-6 sm:p-8 rounded-2xl bg-surface border border-line shadow-sm">
            <ApplicationStatusPanel
              departments={departments}
              onStartReapply={handleStartReapply}
              onBackToRegister={() => setViewMode("register")}
            />
          </div>
        ) : createdProfile ? (
          /* Success Screen + Printable Official Academic ID Card */
          <div className="p-6 sm:p-8 rounded-2xl bg-surface border border-line shadow-sm space-y-6">
            <div className="text-center space-y-2 print:hidden">
              <CampusLottie
                name="rocket"
                className="w-28 h-28 mx-auto"
                ariaLabel="Application submitted celebration"
              />
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success-light text-success text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Application Submitted</span>
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-fg">
                Welcome to UniCampus!
              </h1>
              <p className="text-xs sm:text-sm text-fg-muted max-w-md mx-auto">
                Your Academic ID has been generated automatically. Once Academic Administration verifies your dossier, you can sign in immediately.
              </p>
            </div>

            <AcademicIdCard
              role={createdProfile.role === "teacher" ? "teacher" : "student"}
              academicId={
                createdProfile.student_id ||
                createdProfile.teacher_code ||
                "PENDING-ID"
              }
              fullName={createdProfile.full_name}
              departmentName={
                createdProfile.department_name ||
                activeDept?.name ||
                "Computer Science & Engineering"
              }
              departmentCode={activeDept?.code || "CSE"}
              photoUrl={createdProfile.avatar_url}
              semesterName={createdProfile.semester_name}
              designation={createdProfile.teacher_qualifications?.designation}
              bloodGroup={createdProfile.blood_group}
              phone={createdProfile.phone}
              emergencyPhone={createdProfile.emergency_phone}
              dateOfBirth={createdProfile.date_of_birth}
              showPrintButton
            />

            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-warning-light border border-warning/25 text-xs text-fg print:hidden">
              <Clock className="w-4 h-4 text-warning shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Status: Pending Verification</span>
                <p className="text-fg-muted mt-0.5">
                  You can track approval or re-apply anytime using <span className="font-medium text-fg">Check Status</span>.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 print:hidden">
              <Link
                href="/login"
                className={buttonVariants({ variant: "primary", size: "lg", fullWidth: true })}
              >
                Go to Sign In
              </Link>
              <Button variant="secondary" size="lg" fullWidth onClick={resetAll}>
                New Application
              </Button>
            </div>
          </div>
        ) : (
          /* Progressive Micro-Step Card */
          <div className="rounded-[20px] bg-surface border border-line overflow-hidden">
            {/* Thin Top Progress Bar */}
            <div className="h-1 w-full bg-line/70">
              <div
                className="h-full bg-brand transition-[width] duration-200 ease-out"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            <div className="p-6 sm:p-8 space-y-5">
              {/* Top Step Navigation Bar */}
              <div className="flex items-center justify-between min-h-[36px]">
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMsg("");
                      setStep((prev) => Math.max(0, prev - 1));
                    }}
                    className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-fg-muted hover:text-fg min-h-[44px] -ml-2 px-2 rounded-xl cursor-pointer transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                ) : (
                  <span className="text-xs font-semibold tracking-wide text-brand">
                    Admissions &amp; Onboarding
                  </span>
                )}

                <span className="text-xs font-medium text-fg-muted tabular-nums">
                  Step {step + 1} of {totalFormSteps + 1}
                </span>
              </div>

              {/* Re-Apply Banner */}
              {resubmittingProfile && (
                <div className="p-3 rounded-xl bg-warning-light border border-warning/25 text-xs flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                  <div className="space-y-0.5 min-w-0">
                    <div className="font-semibold text-fg">
                      Updating Rejected Application ({resubmittingProfile.student_id || resubmittingProfile.teacher_code})
                    </div>
                    {resubmittingProfile.rejection_reason && (
                      <p className="text-fg-muted">
                        Admin Note: &ldquo;{resubmittingProfile.rejection_reason}&rdquo;
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Contextual Lottie + Conversational Heading */}
              <div className="text-center space-y-1.5">
                <CampusLottie
                  name={stepMeta.animation}
                  className="w-24 h-24 mx-auto"
                />
                <h1 className="text-xl sm:text-2xl font-semibold text-fg tracking-tight">
                  {stepMeta.title}
                </h1>
                <p className="text-[13px] sm:text-sm text-fg-muted">
                  {stepMeta.subtitle}
                </p>
              </div>

              {/* Animated Step Body */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${role}-${step}`}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.16, ease: "easeOut" }}
                  >
                    {step === 0 ? (
                      /* Step 0: Cohesive Visual Role Picker */
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setRole("student");
                            setErrorMsg("");
                            setStep(1);
                          }}
                          className="group p-5 rounded-2xl bg-surface border border-line hover:border-brand hover:bg-brand-soft/30 text-left flex flex-col gap-4 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="w-11 h-11 rounded-xl bg-brand-soft text-brand flex items-center justify-center">
                              <GraduationCap className="w-5 h-5" />
                            </div>
                            <ArrowRight className="w-4 h-4 text-fg-muted group-hover:text-brand group-hover:translate-x-0.5 transition-transform" />
                          </div>
                          <div>
                            <div className="text-[15px] font-semibold text-fg">I&apos;m a Student</div>
                            <p className="text-[13px] text-fg-muted mt-1 leading-snug">
                              4-Year undergraduate admission &amp; Student ID.
                            </p>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setRole("teacher");
                            setErrorMsg("");
                            setStep(1);
                          }}
                          className="group p-5 rounded-2xl bg-surface border border-line hover:border-brand hover:bg-brand-soft/30 text-left flex flex-col gap-4 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="w-11 h-11 rounded-xl bg-brand-soft text-brand flex items-center justify-center">
                              <Briefcase className="w-5 h-5" />
                            </div>
                            <ArrowRight className="w-4 h-4 text-fg-muted group-hover:text-brand group-hover:translate-x-0.5 transition-transform" />
                          </div>
                          <div>
                            <div className="text-[15px] font-semibold text-fg">I&apos;m Faculty</div>
                            <p className="text-[13px] text-fg-muted mt-1 leading-snug">
                              Academic appointment &amp; Faculty ID.
                            </p>
                          </div>
                        </button>
                      </div>
                    ) : step === 2 ? (
                      <ContactVerificationStep
                        email={role === "student" ? studentForm.email : teacherForm.email}
                        phone={role === "student" ? studentForm.phone : teacherForm.phone}
                        emailVerified={emailVerified}
                        phoneVerified={phoneVerified}
                        onEmailVerified={() => {
                          setEmailVerified(true);
                          setErrorMsg("");
                        }}
                        onPhoneVerified={() => {
                          setPhoneVerified(true);
                          setErrorMsg("");
                        }}
                      />
                    ) : step >= 1 && step < totalFormSteps ? (
                      role === "student" ? (
                        <StudentRegistrationSteps
                          step={step >= 3 ? step - 1 : step}
                          form={studentForm}
                          onChange={updateStudent}
                          departments={departments}
                          hideEmailField={isGoogleOAuth}
                        />
                      ) : (
                        <TeacherRegistrationSteps
                          step={step >= 3 ? step - 1 : step}
                          form={teacherForm}
                          onChange={updateTeacher}
                          departments={departments}
                          hideEmailField={isGoogleOAuth}
                        />
                      )
                    ) : (
                      /* Step 6: Optional Photo + Password + Policy */
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 p-3.5 rounded-xl bg-surface-2 border border-line">
                          <div className="w-16 h-16 rounded-full bg-surface border border-line overflow-hidden flex items-center justify-center shrink-0">
                            {currentPhotoUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={currentPhotoUrl}
                                alt="Profile preview"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Camera className="w-5 h-5 text-fg-muted" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="text-xs font-semibold text-fg">
                              ID Card Photo <span className="text-fg-muted font-normal">(Optional)</span>
                            </div>
                            <p className="text-[11px] text-fg-muted">
                              Front-facing JPG/PNG printed on your digital ID card.
                            </p>
                            <label className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface border border-line hover:border-brand text-xs font-semibold text-fg cursor-pointer transition-colors">
                              <Upload className="w-3.5 h-3.5 text-brand" />
                              <span>{currentPhotoUrl ? "Change Photo" : "Upload Photo"}</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoUpload}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>

                        {!isGoogleOAuth ? (
                          <>
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <label htmlFor="reg-password" className="text-xs font-semibold text-fg">
                                  Create Password *
                                </label>
                                {password.length > 0 && (
                                  <span
                                    className={`text-[11px] font-semibold ${
                                      password.length >= 10 && /[0-9]/.test(password)
                                        ? "text-success"
                                        : password.length >= 6
                                          ? "text-warning"
                                          : "text-danger"
                                    }`}
                                  >
                                    {password.length >= 10 && /[0-9]/.test(password)
                                      ? "Strong"
                                      : password.length >= 6
                                        ? "Fair"
                                        : "Too short"}
                                  </span>
                                )}
                              </div>
                              <div className="relative">
                                <input
                                  id="reg-password"
                                  type={showPassword ? "text" : "password"}
                                  required
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  placeholder="Minimum 6 characters"
                                  className="w-full h-11 pl-3.5 pr-11 rounded-xl bg-surface border border-line text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-colors"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword((prev) => !prev)}
                                  className="absolute right-0 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center text-fg-muted hover:text-fg cursor-pointer"
                                  aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>

                            <div>
                              <label htmlFor="reg-confirm-password" className="text-xs font-semibold text-fg block mb-1.5">
                                Confirm Password *
                              </label>
                              <input
                                id="reg-confirm-password"
                                type={showPassword ? "text" : "password"}
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Re-enter your password"
                                className="w-full h-11 px-3.5 rounded-xl bg-surface border border-line text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-colors"
                              />
                              {confirmPassword.length > 0 && password !== confirmPassword && (
                                <p className="text-[11px] text-danger mt-1">
                                  Passwords do not match yet.
                                </p>
                              )}
                            </div>
                          </>
                        ) : (
                          <div className="p-3.5 rounded-xl bg-success-light/60 border border-success/30 text-xs text-fg">
                            <span className="font-semibold text-success">Google Authentication Linked</span>
                            <p className="text-fg-muted mt-0.5">
                              No separate password required — you will sign in using your verified Google account.
                            </p>
                          </div>
                        )}

                        <label className="flex items-start gap-2.5 text-xs text-fg-muted cursor-pointer select-none pt-1">
                          <input
                            type="checkbox"
                            checked={agreedPolicy}
                            onChange={(e) => setAgreedPolicy(e.target.checked)}
                            className="w-4 h-4 mt-0.5 rounded text-brand border-line focus:ring-brand cursor-pointer shrink-0"
                          />
                          <span>
                            I confirm all personal, guardian, and academic credentials are accurate and match my official documents.
                          </span>
                        </label>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Inline Validation Error */}
                {errorMsg && (
                  <div
                    role="alert"
                    className="p-3 rounded-xl bg-danger-light border border-danger/25 text-xs text-danger"
                  >
                    {errorMsg}
                  </div>
                )}

                {/* Primary CTA (hidden on Step 0 since tapping either card advances immediately) */}
                {step > 0 && (
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    {step < totalFormSteps
                      ? "Continue"
                      : resubmittingProfile
                        ? "Re-Submit Application"
                        : "Submit Application"}
                  </Button>
                )}
              </form>
            </div>
          </div>
        )}

        {/* Minimal Footer anchored directly below the card */}
        <footer className="w-full text-center text-[13px] text-fg-muted mt-6 print:hidden">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-brand hover:underline">
            Sign in
          </Link>
        </footer>
      </main>
    </div>
  );
}
