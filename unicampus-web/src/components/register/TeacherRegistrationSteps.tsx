"use client";

import React from "react";
import { Upload, FileCheck2, Sparkles, Camera } from "lucide-react";
import type { Department } from "@/types/admin";
import {
  BLOOD_GROUPS,
  FACULTY_DESIGNATIONS,
  GENDERS,
  HIGHEST_DEGREES,
  type TeacherRegistrationForm,
} from "./registerConstants";

interface TeacherStepsProps {
  step: number;
  form: TeacherRegistrationForm;
  onChange: <K extends keyof TeacherRegistrationForm>(
    key: K,
    value: TeacherRegistrationForm[K]
  ) => void;
  departments: Department[];
}

const INPUT_CLASS =
  "w-full min-h-[42px] px-3 py-2 rounded-xl bg-surface border border-line text-xs sm:text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all duration-150";
const LABEL_CLASS = "text-xs font-semibold text-fg block mb-1";

export function TeacherRegistrationSteps({
  step,
  form,
  onChange,
  departments,
}: TeacherStepsProps) {
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
        {/* Faculty Photo Upload */}
        <div className="flex items-center gap-4 p-3.5 rounded-xl bg-surface-2 border border-line">
          <div className="w-16 h-16 rounded-xl bg-surface border border-line overflow-hidden flex items-center justify-center shrink-0">
            {form.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.photoUrl} alt="Faculty" className="w-full h-full object-cover" />
            ) : (
              <Camera className="w-5 h-5 text-fg-muted" />
            )}
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <div className="text-xs font-semibold text-fg">
              Faculty Portrait Photo (Printed on Faculty ID Card)
            </div>
            <p className="text-[11px] text-fg-muted">
              Official formal portrait (JPG/PNG) for your Academic Faculty ID Card.
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <label htmlFor="teach-fullname" className={LABEL_CLASS}>
              Full Name with Academic Title *
            </label>
            <input
              id="teach-fullname"
              type="text"
              required
              value={form.fullName}
              onChange={(e) => onChange("fullName", e.target.value)}
              placeholder="e.g. Dr. Asif Rahman / Engr. Tanvir Ahmed"
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label htmlFor="teach-email" className={LABEL_CLASS}>
              Institutional / Academic Email *
            </label>
            <input
              id="teach-email"
              type="email"
              required
              value={form.email}
              onChange={(e) => onChange("email", e.target.value)}
              placeholder="faculty@unicampus.edu"
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label htmlFor="teach-phone" className={LABEL_CLASS}>
              Mobile Number *
            </label>
            <input
              id="teach-phone"
              type="tel"
              required
              value={form.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              placeholder="+880 17XX-XXXXXX"
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label htmlFor="teach-nid" className={LABEL_CLASS}>
              National ID (NID) Number *
            </label>
            <input
              id="teach-nid"
              type="text"
              required
              value={form.nidNumber}
              onChange={(e) => onChange("nidNumber", e.target.value)}
              placeholder="10 or 17-digit NID Number"
              className={`${INPUT_CLASS} font-mono`}
            />
          </div>

          <div>
            <label htmlFor="teach-dob" className={LABEL_CLASS}>
              Date of Birth *
            </label>
            <input
              id="teach-dob"
              type="date"
              required
              value={form.dateOfBirth}
              onChange={(e) => onChange("dateOfBirth", e.target.value)}
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label htmlFor="teach-blood" className={LABEL_CLASS}>
              Blood Group *
            </label>
            <select
              id="teach-blood"
              value={form.bloodGroup}
              onChange={(e) => onChange("bloodGroup", e.target.value)}
              className={`${INPUT_CLASS} cursor-pointer`}
            >
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="teach-gender" className={LABEL_CLASS}>
              Gender
            </label>
            <select
              id="teach-gender"
              value={form.gender}
              onChange={(e) => onChange("gender", e.target.value)}
              className={`${INPUT_CLASS} cursor-pointer`}
            >
              {GENDERS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="teach-emergency" className={LABEL_CLASS}>
              Emergency Contact Phone *
            </label>
            <input
              id="teach-emergency"
              type="tel"
              required
              value={form.emergencyPhone}
              onChange={(e) => onChange("emergencyPhone", e.target.value)}
              placeholder="+880 18XX-XXXXXX"
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label htmlFor="teach-present-addr" className={LABEL_CLASS}>
              Present Address *
            </label>
            <input
              id="teach-present-addr"
              type="text"
              required
              value={form.presentAddress}
              onChange={(e) => onChange("presentAddress", e.target.value)}
              placeholder="Road, Block, Dhanmondi, Dhaka"
              className={INPUT_CLASS}
            />
          </div>
        </div>
      </div>
    );
  }

  if (step === 2) {
    const selectedDept = departments.find((d) => d.id === form.deptId);
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <label htmlFor="teach-dept" className={LABEL_CLASS}>
              Department of Appointment *
            </label>
            <select
              id="teach-dept"
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
            <label htmlFor="teach-designation" className={LABEL_CLASS}>
              Academic Designation *
            </label>
            <select
              id="teach-designation"
              value={form.designation}
              onChange={(e) => onChange("designation", e.target.value)}
              className={`${INPUT_CLASS} cursor-pointer`}
            >
              {FACULTY_DESIGNATIONS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="teach-emp-type" className={LABEL_CLASS}>
              Employment Type *
            </label>
            <select
              id="teach-emp-type"
              value={form.employmentType}
              onChange={(e) =>
                onChange(
                  "employmentType",
                  e.target.value as "Full-Time" | "Adjunct" | "Visiting"
                )
              }
              className={`${INPUT_CLASS} cursor-pointer`}
            >
              <option value="Full-Time">Full-Time Permanent</option>
              <option value="Adjunct">Adjunct / Part-Time</option>
              <option value="Visiting">Visiting Faculty</option>
            </select>
          </div>

          <div>
            <label htmlFor="teach-exp" className={LABEL_CLASS}>
              Teaching Experience (Years)
            </label>
            <input
              id="teach-exp"
              type="number"
              min="0"
              max="50"
              value={form.experienceYears}
              onChange={(e) => onChange("experienceYears", e.target.value)}
              className={`${INPUT_CLASS} font-mono`}
            />
          </div>

          <div>
            <label htmlFor="teach-spec" className={LABEL_CLASS}>
              Research Specialization *
            </label>
            <input
              id="teach-spec"
              type="text"
              required
              value={form.specialization}
              onChange={(e) => onChange("specialization", e.target.value)}
              placeholder="e.g. Distributed Systems, AI, VLSI"
              className={INPUT_CLASS}
            />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-brand-soft border border-brand/25 space-y-1 text-xs">
          <div className="flex items-center gap-2 font-semibold text-brand">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>Automatic Faculty Academic ID Issuance</span>
          </div>
          <p className="text-fg-muted leading-relaxed">
            Upon submission, the portal will automatically issue your official{" "}
            <strong className="text-fg font-mono">
              FAC-{selectedDept?.code || "CSE"}-XXXX
            </strong>{" "}
            Faculty ID and generate your printable Faculty Academic ID Card.
          </p>
        </div>
      </div>
    );
  }

  // Step 3: Academic Qualifications & Documents
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="teach-highest" className={LABEL_CLASS}>
          Highest Earned Degree *
        </label>
        <select
          id="teach-highest"
          value={form.highestDegree}
          onChange={(e) => onChange("highestDegree", e.target.value)}
          className={`${INPUT_CLASS} cursor-pointer`}
        >
          {HIGHEST_DEGREES.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* Undergraduate Degree */}
      <div className="p-3.5 rounded-xl bg-surface-2 border border-line space-y-2.5">
        <div className="text-xs font-semibold text-fg">
          Undergraduate Degree (B.Sc. / B.A. / BBA / Honours) *
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label htmlFor="teach-ug-deg" className={LABEL_CLASS}>Degree Title *</label>
            <input
              id="teach-ug-deg"
              type="text"
              required
              value={form.undergradDegree}
              onChange={(e) => onChange("undergradDegree", e.target.value)}
              placeholder="B.Sc. in CSE"
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label htmlFor="teach-ug-uni" className={LABEL_CLASS}>University *</label>
            <input
              id="teach-ug-uni"
              type="text"
              required
              value={form.undergradUniversity}
              onChange={(e) => onChange("undergradUniversity", e.target.value)}
              placeholder="e.g. BUET / University of Dhaka"
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label htmlFor="teach-ug-year" className={LABEL_CLASS}>Passing Year *</label>
            <input
              id="teach-ug-year"
              type="text"
              required
              value={form.undergradYear}
              onChange={(e) => onChange("undergradYear", e.target.value)}
              placeholder="e.g. 2018"
              className={`${INPUT_CLASS} font-mono`}
            />
          </div>
          <div>
            <label htmlFor="teach-ug-cgpa" className={LABEL_CLASS}>CGPA (out of 4.00) *</label>
            <input
              id="teach-ug-cgpa"
              type="text"
              required
              value={form.undergradCgpa}
              onChange={(e) => onChange("undergradCgpa", e.target.value)}
              placeholder="e.g. 3.88"
              className={`${INPUT_CLASS} font-mono`}
            />
          </div>
        </div>
      </div>

      {/* Postgraduate / Doctoral Degree */}
      <div className="p-3.5 rounded-xl bg-surface-2 border border-line space-y-2.5">
        <div className="text-xs font-semibold text-fg">
          Postgraduate / Doctoral Degree (M.Sc. / MBA / Ph.D.)
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div>
            <label htmlFor="teach-pg-deg" className={LABEL_CLASS}>Degree Title</label>
            <input
              id="teach-pg-deg"
              type="text"
              value={form.postgradDegree}
              onChange={(e) => onChange("postgradDegree", e.target.value)}
              placeholder="M.Sc. / Ph.D."
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label htmlFor="teach-pg-uni" className={LABEL_CLASS}>University</label>
            <input
              id="teach-pg-uni"
              type="text"
              value={form.postgradUniversity}
              onChange={(e) => onChange("postgradUniversity", e.target.value)}
              placeholder="e.g. BUET / NUS"
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label htmlFor="teach-pg-year" className={LABEL_CLASS}>Passing Year</label>
            <input
              id="teach-pg-year"
              type="text"
              value={form.postgradYear}
              onChange={(e) => onChange("postgradYear", e.target.value)}
              placeholder="e.g. 2021"
              className={`${INPUT_CLASS} font-mono`}
            />
          </div>
        </div>
      </div>

      {/* Document Uploads */}
      <div className="space-y-2">
        <label className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl bg-surface border border-dashed border-line hover:border-brand cursor-pointer transition-colors">
          <div className="flex items-center gap-2 min-w-0 text-xs">
            {form.cvFilename ? (
              <FileCheck2 className="w-4 h-4 text-success shrink-0" />
            ) : (
              <Upload className="w-4 h-4 text-brand shrink-0" />
            )}
            <span className="truncate font-medium text-fg">
              {form.cvFilename || "Upload Academic CV / Resume (PDF)"}
            </span>
          </div>
          <span className="text-[11px] font-semibold text-brand shrink-0">
            {form.cvFilename ? "Replace" : "Browse"}
          </span>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onChange("cvFilename", f.name);
            }}
            className="hidden"
          />
        </label>

        <label className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl bg-surface border border-dashed border-line hover:border-brand cursor-pointer transition-colors">
          <div className="flex items-center gap-2 min-w-0 text-xs">
            {form.certificateFilename ? (
              <FileCheck2 className="w-4 h-4 text-success shrink-0" />
            ) : (
              <Upload className="w-4 h-4 text-brand shrink-0" />
            )}
            <span className="truncate font-medium text-fg">
              {form.certificateFilename || "Upload Highest Degree Certificate / Transcript (PDF or Image)"}
            </span>
          </div>
          <span className="text-[11px] font-semibold text-brand shrink-0">
            {form.certificateFilename ? "Replace" : "Browse"}
          </span>
          <input
            type="file"
            accept=".pdf,image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onChange("certificateFilename", f.name);
            }}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}
