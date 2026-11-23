"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileCheck2, CheckCircle2 } from "lucide-react";
import { Select } from "@/components/ui/Select";
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
  hideEmailField?: boolean;
}

const INPUT_CLASS =
  "w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-surface border border-line text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-colors";
const LABEL_CLASS = "text-xs font-semibold text-fg block mb-1.5";

type CredTab = "Undergrad" | "Postgrad" | "Docs";

export function TeacherRegistrationSteps({
  step,
  form,
  onChange,
  departments,
  hideEmailField = false,
}: TeacherStepsProps) {
  const [sameAddress, setSameAddress] = useState(
    !form.permanentAddress || form.permanentAddress === form.presentAddress
  );
  const [activeCredTab, setActiveCredTab] = useState<CredTab>("Undergrad");

  // Step 1: Account Basics (First Name, Last Name, Email, Mobile)
  if (step === 1) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label htmlFor="teach-firstname" className={LABEL_CLASS}>
              First Name *
            </label>
            <input
              id="teach-firstname"
              type="text"
              required
              autoFocus
              value={form.firstName}
              onChange={(e) => onChange("firstName", e.target.value)}
              placeholder="e.g. Dr. Asif"
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label htmlFor="teach-lastname" className={LABEL_CLASS}>
              Last Name *
            </label>
            <input
              id="teach-lastname"
              type="text"
              required
              value={form.lastName}
              onChange={(e) => onChange("lastName", e.target.value)}
              placeholder="e.g. Rahman"
              className={INPUT_CLASS}
            />
          </div>
        </div>

        {hideEmailField ? (
          <div className="flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-success-light/60 border border-success/30 text-xs">
            <span className="text-fg font-medium truncate">
              Google account: <strong className="font-semibold">{form.email}</strong>
            </span>
            <span className="inline-flex items-center gap-1 text-success font-semibold shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified
            </span>
          </div>
        ) : (
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
        )}

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
      </div>
    );
  }

  // Step 2: Identity & Birthday (4 compact fields)
  if (step === 2) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
            <label htmlFor="teach-gender" className={LABEL_CLASS}>
              Gender *
            </label>
            <Select
              id="teach-gender"
              size="lg"
              variant="surface"
              value={form.gender}
              onChange={(v) => onChange("gender", v)}
              options={GENDERS.map((g) => ({ value: g, label: g }))}
            />
          </div>
        </div>

        <div>
          <span className={LABEL_CLASS}>Blood Group</span>
          <div className="grid grid-cols-4 gap-2">
            {BLOOD_GROUPS.map((bg) => (
              <button
                key={bg}
                type="button"
                onClick={() => onChange("bloodGroup", bg)}
                className={`min-h-[40px] rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                  form.bloodGroup === bg
                    ? "bg-brand-soft border-brand text-brand"
                    : "bg-surface border-line text-fg-muted hover:text-fg"
                }`}
              >
                {bg}
              </button>
            ))}
          </div>
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
            placeholder="10 or 17 digit NID number"
            className={`${INPUT_CLASS} font-mono`}
          />
        </div>
      </div>
    );
  }

  // Step 3: Emergency Contact & Address
  if (step === 3) {
    return (
      <div className="space-y-4">
        <div>
          <label htmlFor="teach-emergency" className={LABEL_CLASS}>
            Emergency Contact Number *
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
            onChange={(e) => {
              onChange("presentAddress", e.target.value);
              if (sameAddress) onChange("permanentAddress", e.target.value);
            }}
            placeholder="House, Road, Thana, District"
            className={INPUT_CLASS}
          />
        </div>

        <label className="inline-flex items-center gap-2 text-xs text-fg-muted cursor-pointer select-none">
          <input
            type="checkbox"
            checked={sameAddress}
            onChange={(e) => {
              const checked = e.target.checked;
              setSameAddress(checked);
              if (checked) onChange("permanentAddress", form.presentAddress);
            }}
            className="w-4 h-4 rounded text-brand border-line focus:ring-brand cursor-pointer"
          />
          <span>Permanent address is the same as present address</span>
        </label>

        {!sameAddress && (
          <div>
            <label htmlFor="teach-perm-addr" className={LABEL_CLASS}>
              Permanent Address
            </label>
            <input
              id="teach-perm-addr"
              type="text"
              value={form.permanentAddress}
              onChange={(e) => onChange("permanentAddress", e.target.value)}
              placeholder="Village / Area, Upazila, District"
              className={INPUT_CLASS}
            />
          </div>
        )}
      </div>
    );
  }

  // Step 4: Department & Academic Appointment
  if (step === 4) {
    return (
      <div className="space-y-4">
        <div>
          <label htmlFor="teach-dept" className={LABEL_CLASS}>
            Academic Department *
          </label>
          <Select
            id="teach-dept"
            size="lg"
            variant="surface"
            value={form.deptId}
            disabled={departments.length === 0}
            onChange={(v) => onChange("deptId", v)}
            placeholder="No departments available yet — ask Admin to create one"
            options={
              departments.length === 0
                ? [{ value: "", label: "No departments available yet — ask Admin to create one" }]
                : departments.map((d) => ({ value: d.id, label: `${d.name} (${d.code})` }))
            }
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label htmlFor="teach-desig" className={LABEL_CLASS}>
              Designation *
            </label>
            <Select
              id="teach-desig"
              size="lg"
              variant="surface"
              value={form.designation}
              onChange={(v) => onChange("designation", v)}
              options={FACULTY_DESIGNATIONS.map((desig) => ({ value: desig, label: desig }))}
            />
          </div>

          <div>
            <label htmlFor="teach-degree" className={LABEL_CLASS}>
              Highest Degree *
            </label>
            <Select
              id="teach-degree"
              size="lg"
              variant="surface"
              value={form.highestDegree}
              onChange={(v) => onChange("highestDegree", v)}
              options={HIGHEST_DEGREES.map((deg) => ({ value: deg, label: deg }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label htmlFor="teach-emp" className={LABEL_CLASS}>
              Appointment Type
            </label>
            <Select
              id="teach-emp"
              size="lg"
              variant="surface"
              value={form.employmentType}
              onChange={(v) =>
                onChange("employmentType", v as TeacherRegistrationForm["employmentType"])
              }
              options={[
                { value: "Full-Time", label: "Full-Time" },
                { value: "Adjunct", label: "Adjunct" },
                { value: "Visiting", label: "Visiting" },
              ]}
            />
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
        </div>

        <div>
          <label htmlFor="teach-spec" className={LABEL_CLASS}>
            Primary Specialization / Research Area *
          </label>
          <input
            id="teach-spec"
            type="text"
            required
            value={form.specialization}
            onChange={(e) => onChange("specialization", e.target.value)}
            placeholder="e.g. Machine Learning, Distributed Systems, VLSI"
            className={INPUT_CLASS}
          />
        </div>
      </div>
    );
  }

  // Step 5: Academic Degrees & CV (Tabbed: Undergrad | Postgrad | Docs)
  const ugDone = Boolean(
    form.undergradDegree.trim() &&
      form.undergradUniversity.trim() &&
      form.undergradYear.trim() &&
      form.undergradCgpa.trim()
  );
  const pgDone = Boolean(form.postgradDegree.trim() && form.postgradUniversity.trim());
  const docsDone = Boolean(form.cvFilename || form.certificateFilename);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-surface-2 border border-line">
        {(
          [
            { id: "Undergrad" as const, label: "Undergrad *", done: ugDone },
            { id: "Postgrad" as const, label: "Postgrad", done: pgDone },
            { id: "Docs" as const, label: "CV / Docs", done: docsDone },
          ] as const
        ).map((tab) => {
          const active = activeCredTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveCredTab(tab.id)}
              className={`relative h-8 px-2 rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer focus:outline-none z-10 ${
                active ? "text-fg" : "text-fg-muted hover:text-fg"
              }`}
            >
              {active && (
                <motion.div
                  layoutId="reg-teacher-cred-tab"
                  transition={{ type: "spring", stiffness: 460, damping: 30, mass: 0.7 }}
                  className="absolute inset-0 bg-surface border border-line rounded-lg shadow-2xs -z-10"
                />
              )}
              <span>{tab.label}</span>
              {tab.done && <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />}
            </button>
          );
        })}
      </div>

      {activeCredTab === "Undergrad" && (
        <div className="space-y-3.5">
          <div>
            <label htmlFor="ug-deg" className={LABEL_CLASS}>Undergraduate Degree *</label>
            <input
              id="ug-deg"
              type="text"
              value={form.undergradDegree}
              onChange={(e) => onChange("undergradDegree", e.target.value)}
              placeholder="e.g. B.Sc. in Computer Science & Engineering"
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label htmlFor="ug-uni" className={LABEL_CLASS}>University *</label>
            <input
              id="ug-uni"
              type="text"
              value={form.undergradUniversity}
              onChange={(e) => onChange("undergradUniversity", e.target.value)}
              placeholder="e.g. BUET / University of Dhaka"
              className={INPUT_CLASS}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="ug-year" className={LABEL_CLASS}>Passing Year *</label>
              <input
                id="ug-year"
                type="text"
                value={form.undergradYear}
                onChange={(e) => onChange("undergradYear", e.target.value)}
                placeholder="2018"
                className={`${INPUT_CLASS} font-mono`}
              />
            </div>
            <div>
              <label htmlFor="ug-cgpa" className={LABEL_CLASS}>CGPA (Out of 4.00) *</label>
              <input
                id="ug-cgpa"
                type="text"
                value={form.undergradCgpa}
                onChange={(e) => onChange("undergradCgpa", e.target.value)}
                placeholder="3.85"
                className={`${INPUT_CLASS} font-mono`}
              />
            </div>
          </div>
        </div>
      )}

      {activeCredTab === "Postgrad" && (
        <div className="space-y-3.5">
          <p className="text-xs text-fg-muted">
            Optional — add your M.Sc. / MBA / Ph.D. details if completed or ongoing.
          </p>
          <div>
            <label htmlFor="pg-deg" className={LABEL_CLASS}>Postgraduate Degree</label>
            <input
              id="pg-deg"
              type="text"
              value={form.postgradDegree}
              onChange={(e) => onChange("postgradDegree", e.target.value)}
              placeholder="e.g. M.Sc. in Artificial Intelligence"
              className={INPUT_CLASS}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label htmlFor="pg-uni" className={LABEL_CLASS}>University</label>
              <input
                id="pg-uni"
                type="text"
                value={form.postgradUniversity}
                onChange={(e) => onChange("postgradUniversity", e.target.value)}
                placeholder="e.g. BUET / University of Toronto"
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label htmlFor="pg-year" className={LABEL_CLASS}>Year</label>
              <input
                id="pg-year"
                type="text"
                value={form.postgradYear}
                onChange={(e) => onChange("postgradYear", e.target.value)}
                placeholder="2021"
                className={`${INPUT_CLASS} font-mono`}
              />
            </div>
          </div>
        </div>
      )}

      {activeCredTab === "Docs" && (
        <div className="space-y-3">
          <label className="flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl bg-surface-2 border border-dashed border-line hover:border-brand cursor-pointer transition-colors">
            <span className="inline-flex items-center gap-2 text-xs font-medium text-fg truncate">
              {form.cvFilename ? (
                <>
                  <FileCheck2 className="w-4 h-4 text-success shrink-0" />
                  <span className="truncate">{form.cvFilename}</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 text-brand shrink-0" />
                  <span>Upload Academic CV / Resume (PDF)</span>
                </>
              )}
            </span>
            <span className="text-[11px] font-semibold text-brand shrink-0">
              {form.cvFilename ? "Change" : "Browse"}
            </span>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onChange("cvFilename", file.name);
              }}
              className="hidden"
            />
          </label>

          <label className="flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl bg-surface-2 border border-dashed border-line hover:border-brand cursor-pointer transition-colors">
            <span className="inline-flex items-center gap-2 text-xs font-medium text-fg truncate">
              {form.certificateFilename ? (
                <>
                  <FileCheck2 className="w-4 h-4 text-success shrink-0" />
                  <span className="truncate">{form.certificateFilename}</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 text-brand shrink-0" />
                  <span>Upload Degree Certificate (PDF/JPG)</span>
                </>
              )}
            </span>
            <span className="text-[11px] font-semibold text-brand shrink-0">
              {form.certificateFilename ? "Change" : "Browse"}
            </span>
            <input
              type="file"
              accept=".pdf,image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onChange("certificateFilename", file.name);
              }}
              className="hidden"
            />
          </label>
        </div>
      )}
    </div>
  );
}
