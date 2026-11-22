"use client";

import React from "react";
import { Upload, FileCheck2, Sparkles, Camera } from "lucide-react";
import type { Department, OrdinalSemesterName } from "@/types/admin";
import { ORDINAL_SEMESTERS } from "@/lib/mockData";
import { ACADEMIC_YEARS, formatYearSemester } from "@/lib/canonicalCampus";
import {
  BD_ACADEMIC_GROUPS,
  BD_EDUCATION_BOARDS,
  BLOOD_GROUPS,
  GENDERS,
  RELIGIONS,
  type StudentRegistrationForm,
} from "./registerConstants";

interface StudentStepsProps {
  step: number;
  form: StudentRegistrationForm;
  onChange: <K extends keyof StudentRegistrationForm>(
    key: K,
    value: StudentRegistrationForm[K]
  ) => void;
  departments: Department[];
}

const INPUT_CLASS =
  "w-full min-h-[42px] px-3 py-2 rounded-xl bg-surface border border-line text-xs sm:text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all duration-150";
const LABEL_CLASS = "text-xs font-semibold text-fg block mb-1";

export function StudentRegistrationSteps({
  step,
  form,
  onChange,
  departments,
}: StudentStepsProps) {
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onChange("photoUrl", reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  if (step === 1) {
    return (
      <div className="space-y-4">
        {/* Passport Photo Upload for ID Card */}
        <div className="flex items-center gap-4 p-3.5 rounded-xl bg-surface-2 border border-line">
          <div className="w-16 h-16 rounded-xl bg-surface border border-line overflow-hidden flex items-center justify-center shrink-0">
            {form.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.photoUrl} alt="Applicant" className="w-full h-full object-cover" />
            ) : (
              <Camera className="w-5 h-5 text-fg-muted" />
            )}
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <div className="text-xs font-semibold text-fg">
              Passport Photo (Printed on Student ID Card)
            </div>
            <p className="text-[11px] text-fg-muted">
              Clear front-facing photo (JPG/PNG). Appears on your official ID card.
            </p>
            <label className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface border border-line hover:border-brand text-xs font-semibold text-fg cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5 text-brand" />
              <span>{form.photoUrl ? "Change Photo" : "Upload Photo"}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Core Personal Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <label htmlFor="stud-fullname" className={LABEL_CLASS}>
              Full Legal Name (as per SSC/HSC Certificate) *
            </label>
            <input
              id="stud-fullname"
              type="text"
              required
              value={form.fullName}
              onChange={(e) => onChange("fullName", e.target.value)}
              placeholder="e.g. Md. Sakib Ahmed"
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label htmlFor="stud-email" className={LABEL_CLASS}>
              Email Address *
            </label>
            <input
              id="stud-email"
              type="email"
              required
              value={form.email}
              onChange={(e) => onChange("email", e.target.value)}
              placeholder="student@unicampus.edu"
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label htmlFor="stud-phone" className={LABEL_CLASS}>
              Student Mobile Number *
            </label>
            <input
              id="stud-phone"
              type="tel"
              required
              value={form.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              placeholder="+880 17XX-XXXXXX"
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label htmlFor="stud-dob" className={LABEL_CLASS}>
              Date of Birth *
            </label>
            <input
              id="stud-dob"
              type="date"
              required
              value={form.dateOfBirth}
              onChange={(e) => onChange("dateOfBirth", e.target.value)}
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label htmlFor="stud-blood" className={LABEL_CLASS}>
              Blood Group *
            </label>
            <select
              id="stud-blood"
              value={form.bloodGroup}
              onChange={(e) => onChange("bloodGroup", e.target.value)}
              className={`${INPUT_CLASS} cursor-pointer`}
            >
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="stud-gender" className={LABEL_CLASS}>
              Gender
            </label>
            <select
              id="stud-gender"
              value={form.gender}
              onChange={(e) => onChange("gender", e.target.value)}
              className={`${INPUT_CLASS} cursor-pointer`}
            >
              {GENDERS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="stud-religion" className={LABEL_CLASS}>
              Religion
            </label>
            <select
              id="stud-religion"
              value={form.religion}
              onChange={(e) => onChange("religion", e.target.value)}
              className={`${INPUT_CLASS} cursor-pointer`}
            >
              {RELIGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Birth Certificate / NID */}
        <div className="p-3.5 rounded-xl bg-surface-2 border border-line space-y-2.5">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-xs font-semibold text-fg">
              National Identity Verification *
            </span>
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-surface border border-line">
              {(["Birth Certificate", "NID"] as const).map((docType) => (
                <button
                  key={docType}
                  type="button"
                  onClick={() => onChange("idDocumentType", docType)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold cursor-pointer transition-colors ${
                    form.idDocumentType === docType
                      ? "bg-brand text-on-brand"
                      : "text-fg-muted hover:text-fg"
                  }`}
                >
                  {docType}
                </button>
              ))}
            </div>
          </div>
          <input
            id="stud-nid-bc"
            type="text"
            required
            value={form.nidOrBirthCert}
            onChange={(e) => onChange("nidOrBirthCert", e.target.value)}
            placeholder={
              form.idDocumentType === "Birth Certificate"
                ? "17-digit Birth Registration Number (e.g. 20052610984012345)"
                : "10 or 17-digit National ID (NID) Number"
            }
            className={`${INPUT_CLASS} font-mono`}
          />
        </div>

        {/* Parents / Guardian Details */}
        <div className="space-y-3 pt-1 border-t border-line">
          <div className="text-xs font-semibold text-fg">
            Parents &amp; Guardian Information
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="stud-father-name" className={LABEL_CLASS}>
                Father&apos;s Name *
              </label>
              <input
                id="stud-father-name"
                type="text"
                required
                value={form.fatherName}
                onChange={(e) => onChange("fatherName", e.target.value)}
                placeholder="e.g. Md. Kamrul Islam"
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label htmlFor="stud-father-phone" className={LABEL_CLASS}>
                Father&apos;s Phone *
              </label>
              <input
                id="stud-father-phone"
                type="tel"
                required
                value={form.fatherPhone}
                onChange={(e) => onChange("fatherPhone", e.target.value)}
                placeholder="+880 17XX-XXXXXX"
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label htmlFor="stud-mother-name" className={LABEL_CLASS}>
                Mother&apos;s Name *
              </label>
              <input
                id="stud-mother-name"
                type="text"
                required
                value={form.motherName}
                onChange={(e) => onChange("motherName", e.target.value)}
                placeholder="e.g. Rashida Begum"
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label htmlFor="stud-mother-phone" className={LABEL_CLASS}>
                Mother&apos;s Phone *
              </label>
              <input
                id="stud-mother-phone"
                type="tel"
                required
                value={form.motherPhone}
                onChange={(e) => onChange("motherPhone", e.target.value)}
                placeholder="+880 18XX-XXXXXX"
                className={INPUT_CLASS}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="stud-present-addr" className={LABEL_CLASS}>
                Present Address *
              </label>
              <input
                id="stud-present-addr"
                type="text"
                required
                value={form.presentAddress}
                onChange={(e) => onChange("presentAddress", e.target.value)}
                placeholder="House, Road, Thana, Dhaka"
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label htmlFor="stud-perm-addr" className={LABEL_CLASS}>
                Permanent Address
              </label>
              <input
                id="stud-perm-addr"
                type="text"
                value={form.permanentAddress}
                onChange={(e) => onChange("permanentAddress", e.target.value)}
                placeholder="Village/Ward, Upazila, District"
                className={INPUT_CLASS}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 2) {
    const selectedDept = departments.find((d) => d.id === form.deptId);
    return (
      <div className="space-y-4">
        <div>
          <label htmlFor="register-department" className={LABEL_CLASS}>
            Academic Department *
          </label>
          <select
            id="register-department"
            value={form.deptId}
            onChange={(e) => onChange("deptId", e.target.value)}
            className={`${INPUT_CLASS} cursor-pointer`}
          >
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.code})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="register-semester" className={LABEL_CLASS}>
            Academic Year &amp; Semester (4-Year / 8-Semester System) *
          </label>
          <select
            id="register-semester"
            value={form.semesterName}
            onChange={(e) => onChange("semesterName", e.target.value as OrdinalSemesterName)}
            className={`${INPUT_CLASS} cursor-pointer`}
          >
            {ORDINAL_SEMESTERS.map((s) => (
              <option key={s} value={s}>
                {formatYearSemester(s)}
              </option>
            ))}
          </select>
        </div>

        {/* 4-Year / 8-Semester Visual Guide */}
        <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-surface-2 border border-line text-[11px]">
          {ACADEMIC_YEARS.map((yr) => (
            <div key={yr.year} className="p-2 rounded-lg bg-surface border border-line">
              <div className="font-semibold text-fg">{yr.label}</div>
              <div className="text-fg-muted">{yr.semesters.join(" & ")}</div>
            </div>
          ))}
        </div>

        {/* Auto-Generated Academic ID Banner */}
        <div className="p-3.5 rounded-xl bg-brand-soft border border-brand/25 space-y-1 text-xs">
          <div className="flex items-center gap-2 font-semibold text-brand">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>Automatic Student Academic ID Issuance</span>
          </div>
          <p className="text-fg-muted leading-relaxed">
            No manual ID required. Upon submission, the portal will automatically issue your unique{" "}
            <strong className="text-fg font-mono">
              26-{selectedDept?.code || "CSE"}-XXXX
            </strong>{" "}
            Academic ID and generate your printable Digital Student ID Card.
          </p>
        </div>
      </div>
    );
  }

  // Step 3: Bangladeshi Board Exam Records (JSC, SSC, HSC) & Marksheet Uploads
  return (
    <div className="space-y-4">
      {/* JSC / Equivalent */}
      <div className="p-3.5 rounded-xl bg-surface-2 border border-line space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-fg">
            JSC / JDC / Equivalent Examination
          </span>
          <span className="text-[11px] text-fg-muted">Junior School</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div>
            <label htmlFor="jsc-board" className={LABEL_CLASS}>Board</label>
            <select
              id="jsc-board"
              value={form.jscBoard}
              onChange={(e) => onChange("jscBoard", e.target.value)}
              className={`${INPUT_CLASS} cursor-pointer`}
            >
              {BD_EDUCATION_BOARDS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="jsc-year" className={LABEL_CLASS}>Passing Year</label>
            <input
              id="jsc-year"
              type="text"
              value={form.jscYear}
              onChange={(e) => onChange("jscYear", e.target.value)}
              placeholder="2019"
              className={`${INPUT_CLASS} font-mono`}
            />
          </div>
          <div>
            <label htmlFor="jsc-roll" className={LABEL_CLASS}>JSC Roll</label>
            <input
              id="jsc-roll"
              type="text"
              value={form.jscRoll}
              onChange={(e) => onChange("jscRoll", e.target.value)}
              placeholder="Optional"
              className={`${INPUT_CLASS} font-mono`}
            />
          </div>
          <div>
            <label htmlFor="jsc-gpa" className={LABEL_CLASS}>GPA (5.00)</label>
            <input
              id="jsc-gpa"
              type="text"
              value={form.jscGpa}
              onChange={(e) => onChange("jscGpa", e.target.value)}
              placeholder="5.00"
              className={`${INPUT_CLASS} font-mono`}
            />
          </div>
        </div>
      </div>

      {/* SSC / Dakhil / O-Level */}
      <div className="p-3.5 rounded-xl bg-surface-2 border border-line space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-fg">
            SSC / Dakhil / O-Level Examination *
          </span>
          <span className="text-[11px] font-semibold text-brand">Required</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          <div>
            <label htmlFor="ssc-board" className={LABEL_CLASS}>Board *</label>
            <select
              id="ssc-board"
              value={form.sscBoard}
              onChange={(e) => onChange("sscBoard", e.target.value)}
              className={`${INPUT_CLASS} cursor-pointer`}
            >
              {BD_EDUCATION_BOARDS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="ssc-group" className={LABEL_CLASS}>Group *</label>
            <select
              id="ssc-group"
              value={form.sscGroup}
              onChange={(e) => onChange("sscGroup", e.target.value)}
              className={`${INPUT_CLASS} cursor-pointer`}
            >
              {BD_ACADEMIC_GROUPS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="ssc-year" className={LABEL_CLASS}>Passing Year *</label>
            <input
              id="ssc-year"
              type="text"
              required
              value={form.sscYear}
              onChange={(e) => onChange("sscYear", e.target.value)}
              placeholder="2022"
              className={`${INPUT_CLASS} font-mono`}
            />
          </div>
          <div>
            <label htmlFor="ssc-roll" className={LABEL_CLASS}>SSC Roll No *</label>
            <input
              id="ssc-roll"
              type="text"
              required
              value={form.sscRoll}
              onChange={(e) => onChange("sscRoll", e.target.value)}
              placeholder="e.g. 142890"
              className={`${INPUT_CLASS} font-mono`}
            />
          </div>
          <div>
            <label htmlFor="ssc-reg" className={LABEL_CLASS}>SSC Registration No *</label>
            <input
              id="ssc-reg"
              type="text"
              required
              value={form.sscRegNo}
              onChange={(e) => onChange("sscRegNo", e.target.value)}
              placeholder="e.g. 1910458921"
              className={`${INPUT_CLASS} font-mono`}
            />
          </div>
          <div>
            <label htmlFor="ssc-gpa" className={LABEL_CLASS}>SSC GPA (5.00) *</label>
            <input
              id="ssc-gpa"
              type="text"
              required
              value={form.sscGpa}
              onChange={(e) => onChange("sscGpa", e.target.value)}
              placeholder="e.g. 5.00"
              className={`${INPUT_CLASS} font-mono`}
            />
          </div>
          <div className="col-span-2 sm:col-span-3">
            <label htmlFor="ssc-school" className={LABEL_CLASS}>School / Institution Name</label>
            <input
              id="ssc-school"
              type="text"
              value={form.sscInstitution}
              onChange={(e) => onChange("sscInstitution", e.target.value)}
              placeholder="e.g. Ideal School & College, Motijheel"
              className={INPUT_CLASS}
            />
          </div>
        </div>

        <label className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl bg-surface border border-dashed border-line hover:border-brand cursor-pointer transition-colors">
          <div className="flex items-center gap-2 min-w-0 text-xs">
            {form.sscMarksheetName ? (
              <FileCheck2 className="w-4 h-4 text-success shrink-0" />
            ) : (
              <Upload className="w-4 h-4 text-brand shrink-0" />
            )}
            <span className="truncate font-medium text-fg">
              {form.sscMarksheetName || "Upload SSC Marksheet / Transcript (PDF or Image)"}
            </span>
          </div>
          <span className="text-[11px] font-semibold text-brand shrink-0">
            {form.sscMarksheetName ? "Replace" : "Browse"}
          </span>
          <input
            type="file"
            accept=".pdf,image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onChange("sscMarksheetName", f.name);
            }}
            className="hidden"
          />
        </label>
      </div>

      {/* HSC / Alim / A-Level / Diploma */}
      <div className="p-3.5 rounded-xl bg-surface-2 border border-line space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-fg">
            HSC / Alim / A-Level / Diploma Examination *
          </span>
          <span className="text-[11px] font-semibold text-brand">Required</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          <div>
            <label htmlFor="hsc-board" className={LABEL_CLASS}>Board *</label>
            <select
              id="hsc-board"
              value={form.hscBoard}
              onChange={(e) => onChange("hscBoard", e.target.value)}
              className={`${INPUT_CLASS} cursor-pointer`}
            >
              {BD_EDUCATION_BOARDS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="hsc-group" className={LABEL_CLASS}>Group *</label>
            <select
              id="hsc-group"
              value={form.hscGroup}
              onChange={(e) => onChange("hscGroup", e.target.value)}
              className={`${INPUT_CLASS} cursor-pointer`}
            >
              {BD_ACADEMIC_GROUPS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="hsc-year" className={LABEL_CLASS}>Passing Year *</label>
            <input
              id="hsc-year"
              type="text"
              required
              value={form.hscYear}
              onChange={(e) => onChange("hscYear", e.target.value)}
              placeholder="2024"
              className={`${INPUT_CLASS} font-mono`}
            />
          </div>
          <div>
            <label htmlFor="hsc-roll" className={LABEL_CLASS}>HSC Roll No *</label>
            <input
              id="hsc-roll"
              type="text"
              required
              value={form.hscRoll}
              onChange={(e) => onChange("hscRoll", e.target.value)}
              placeholder="e.g. 214590"
              className={`${INPUT_CLASS} font-mono`}
            />
          </div>
          <div>
            <label htmlFor="hsc-reg" className={LABEL_CLASS}>HSC Registration No *</label>
            <input
              id="hsc-reg"
              type="text"
              required
              value={form.hscRegNo}
              onChange={(e) => onChange("hscRegNo", e.target.value)}
              placeholder="e.g. 2110984512"
              className={`${INPUT_CLASS} font-mono`}
            />
          </div>
          <div>
            <label htmlFor="hsc-gpa" className={LABEL_CLASS}>HSC GPA (5.00) *</label>
            <input
              id="hsc-gpa"
              type="text"
              required
              value={form.hscGpa}
              onChange={(e) => onChange("hscGpa", e.target.value)}
              placeholder="e.g. 5.00"
              className={`${INPUT_CLASS} font-mono`}
            />
          </div>
          <div className="col-span-2 sm:col-span-3">
            <label htmlFor="hsc-college" className={LABEL_CLASS}>College / Institution Name</label>
            <input
              id="hsc-college"
              type="text"
              value={form.hscInstitution}
              onChange={(e) => onChange("hscInstitution", e.target.value)}
              placeholder="e.g. Notre Dame College, Dhaka"
              className={INPUT_CLASS}
            />
          </div>
        </div>

        <label className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl bg-surface border border-dashed border-line hover:border-brand cursor-pointer transition-colors">
          <div className="flex items-center gap-2 min-w-0 text-xs">
            {form.hscMarksheetName ? (
              <FileCheck2 className="w-4 h-4 text-success shrink-0" />
            ) : (
              <Upload className="w-4 h-4 text-brand shrink-0" />
            )}
            <span className="truncate font-medium text-fg">
              {form.hscMarksheetName || "Upload HSC Marksheet / Transcript (PDF or Image)"}
            </span>
          </div>
          <span className="text-[11px] font-semibold text-brand shrink-0">
            {form.hscMarksheetName ? "Replace" : "Browse"}
          </span>
          <input
            type="file"
            accept=".pdf,image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onChange("hscMarksheetName", f.name);
            }}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}
