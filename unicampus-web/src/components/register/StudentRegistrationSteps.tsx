"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileCheck2, CheckCircle2 } from "lucide-react";
import type { Department, OrdinalSemesterName } from "@/types/admin";
import { ORDINAL_SEMESTERS } from "@/lib/mockData";
import { ACADEMIC_YEARS, formatYearSemester } from "@/lib/canonicalCampus";
import {
  ADMISSION_PAYMENT_METHODS,
  BD_ACADEMIC_GROUPS,
  BD_EDUCATION_BOARDS,
  BLOOD_GROUPS,
  GENDERS,
  getProgramsForDepartment,
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
  hideEmailField?: boolean;
}

const INPUT_CLASS =
  "w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-surface border border-line text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-colors";
const LABEL_CLASS = "text-xs font-semibold text-fg block mb-1.5";

type ExamTab = "SSC" | "HSC" | "JSC";

export function StudentRegistrationSteps({
  step,
  form,
  onChange,
  departments,
  hideEmailField = false,
}: StudentStepsProps) {
  const [sameAddress, setSameAddress] = useState(
    !form.permanentAddress || form.permanentAddress === form.presentAddress
  );
  const [activeExamTab, setActiveExamTab] = useState<ExamTab>("SSC");

  // Step 1: Account Basics (First Name, Last Name, Email, Mobile — Google / Meta style)
  if (step === 1) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label htmlFor="stud-firstname" className={LABEL_CLASS}>
              First Name *
            </label>
            <input
              id="stud-firstname"
              type="text"
              required
              autoFocus
              value={form.firstName}
              onChange={(e) => onChange("firstName", e.target.value)}
              placeholder="e.g. Sakib"
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label htmlFor="stud-lastname" className={LABEL_CLASS}>
              Last Name *
            </label>
            <input
              id="stud-lastname"
              type="text"
              required
              value={form.lastName}
              onChange={(e) => onChange("lastName", e.target.value)}
              placeholder="e.g. Ahmed"
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
            <label htmlFor="stud-email" className={LABEL_CLASS}>
              Email Address *
            </label>
            <input
              id="stud-email"
              type="email"
              required
              value={form.email}
              onChange={(e) => onChange("email", e.target.value)}
              placeholder="name@unicampus.edu"
              className={INPUT_CLASS}
            />
          </div>
        )}

        <div>
          <label htmlFor="stud-phone" className={LABEL_CLASS}>
            Mobile Number *
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
      </div>
    );
  }

  // Step 2: Identity & Birthday (4 compact fields — Google / Meta style)
  if (step === 2) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
            <label htmlFor="stud-gender" className={LABEL_CLASS}>
              Gender *
            </label>
            <select
              id="stud-gender"
              value={form.gender}
              onChange={(e) => onChange("gender", e.target.value)}
              className={INPUT_CLASS}
            >
              {GENDERS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
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

        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between gap-2">
            <label htmlFor="stud-id-doc" className="text-xs font-semibold text-fg">
              {form.idDocumentType === "NID" ? "National ID (NID) Number *" : "Birth Certificate Number *"}
            </label>
            <div className="inline-flex rounded-lg bg-surface-2 p-0.5 border border-line">
              {(["Birth Certificate", "NID"] as const).map((docType) => (
                <button
                  key={docType}
                  type="button"
                  onClick={() => onChange("idDocumentType", docType)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                    form.idDocumentType === docType
                      ? "bg-surface text-fg shadow-2xs"
                      : "text-fg-muted hover:text-fg"
                  }`}
                >
                  {docType === "Birth Certificate" ? "Birth Cert" : "NID"}
                </button>
              ))}
            </div>
          </div>
          <input
            id="stud-id-doc"
            type="text"
            required
            value={form.nidOrBirthCert}
            onChange={(e) => onChange("nidOrBirthCert", e.target.value)}
            placeholder={
              form.idDocumentType === "NID"
                ? "10 or 17 digit NID number"
                : "17 digit Birth Registration number"
            }
            className={`${INPUT_CLASS} font-mono`}
          />
        </div>
      </div>
    );
  }

  // Step 3: Parents & Address (compact guardian & address details)
  if (step === 3) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
              placeholder="e.g. Md. Rafiqul Islam"
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
              placeholder="e.g. Mrs. Fatema Begum"
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

        <div>
          <label htmlFor="stud-present-addr" className={LABEL_CLASS}>
            Present Address *
          </label>
          <input
            id="stud-present-addr"
            type="text"
            required
            value={form.presentAddress}
            onChange={(e) => {
              onChange("presentAddress", e.target.value);
              if (sameAddress) onChange("permanentAddress", e.target.value);
            }}
            placeholder="House, Road, Thana, District (e.g. Dhanmondi, Dhaka)"
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
            <label htmlFor="stud-perm-addr" className={LABEL_CLASS}>
              Permanent Address
            </label>
            <input
              id="stud-perm-addr"
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

  // Step 4: Department, Program & 4-Year / 8-Semester Track
  if (step === 4) {
    const activeDept = departments.find((d) => d.id === form.deptId) || departments[0];
    const availablePrograms = getProgramsForDepartment(activeDept?.code, activeDept?.name);

    return (
      <div className="space-y-4">
        <div>
          <label htmlFor="stud-dept" className={LABEL_CLASS}>
            Academic Department *
          </label>
          <select
            id="stud-dept"
            value={form.deptId}
            disabled={departments.length === 0}
            onChange={(e) => {
              const nextDeptId = e.target.value;
              onChange("deptId", nextDeptId);
              const nextDept = departments.find((d) => d.id === nextDeptId);
              const nextPrograms = getProgramsForDepartment(nextDept?.code, nextDept?.name);
              onChange("programName", nextPrograms[0] || "");
            }}
            className={INPUT_CLASS}
          >
            {departments.length === 0 ? (
              <option value="">No departments available yet — ask Admin to create one</option>
            ) : (
              departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.code})
                </option>
              ))
            )}
          </select>
        </div>

        <div>
          <label htmlFor="stud-program" className={LABEL_CLASS}>
            Program Applying / Admitted To *
          </label>
          <select
            id="stud-program"
            required
            value={availablePrograms.includes(form.programName) ? form.programName : availablePrograms[0] || ""}
            onChange={(e) => onChange("programName", e.target.value)}
            className={INPUT_CLASS}
          >
            {availablePrograms.map((prog) => (
              <option key={prog} value={prog}>
                {prog}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-fg">
              Admission Year &amp; Semester *
            </span>
            <span className="text-xs font-medium text-brand">
              {formatYearSemester(form.semesterName)}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {ACADEMIC_YEARS.map((yr) => (
              <div
                key={yr.year}
                className="p-2.5 rounded-xl bg-surface-2 border border-line space-y-2"
              >
                <div className="text-[11px] font-semibold uppercase tracking-wider text-fg-muted">
                  {yr.label}
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {yr.semesters.map((sem) => {
                    const active = form.semesterName === sem;
                    return (
                      <button
                        key={sem}
                        type="button"
                        onClick={() => onChange("semesterName", sem as OrdinalSemesterName)}
                        className={`min-h-[38px] px-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                          active
                            ? "bg-brand text-on-brand border-brand"
                            : "bg-surface text-fg border-line hover:border-brand/50"
                        }`}
                      >
                        {sem.replace(" Semester", " Sem")}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-fg-muted">
            UniCampus uses the standard 4-Year / 8-Semester undergraduate system ({ORDINAL_SEMESTERS[0]} to {ORDINAL_SEMESTERS[7]}).
          </p>
        </div>
      </div>
    );
  }

  // Step 6: Admission Fee Payment Verification (TrxID + Pay Slip Screenshot/PDF)
  if (step === 6) {
    const handleSlipUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      onChange("paymentSlipName", file.name);
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            onChange("paymentSlipPreviewUrl", reader.result);
          }
        };
        reader.readAsDataURL(file);
      } else {
        onChange("paymentSlipPreviewUrl", "");
      }
    };

    return (
      <div className="space-y-4">
        <div>
          <span className={LABEL_CLASS}>Payment Method *</span>
          <div className="grid grid-cols-2 gap-2">
            {ADMISSION_PAYMENT_METHODS.map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => onChange("paymentMethod", method)}
                className={`min-h-[42px] px-3 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                  form.paymentMethod === method
                    ? "bg-brand-soft border-brand text-brand"
                    : "bg-surface border-line text-fg-muted hover:text-fg"
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="pay-trx-id" className={LABEL_CLASS}>
            Transaction ID (TrxID) / Bank Slip No. *
          </label>
          <input
            id="pay-trx-id"
            type="text"
            required
            value={form.paymentTrxId}
            onChange={(e) => onChange("paymentTrxId", e.target.value)}
            placeholder="e.g. BKH89A42K1 or SLIP-2026-0412"
            className={`${INPUT_CLASS} font-mono`}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="pay-amount" className={LABEL_CLASS}>
              Amount Paid (BDT ৳) *
            </label>
            <input
              id="pay-amount"
              type="number"
              min="0"
              required
              value={form.paymentAmount}
              onChange={(e) => onChange("paymentAmount", e.target.value)}
              placeholder="15000"
              className={`${INPUT_CLASS} font-mono`}
            />
          </div>
          <div>
            <label htmlFor="pay-date" className={LABEL_CLASS}>
              Payment Date
            </label>
            <input
              id="pay-date"
              type="date"
              value={form.paymentDate}
              onChange={(e) => onChange("paymentDate", e.target.value)}
              className={INPUT_CLASS}
            />
          </div>
        </div>

        <div className="space-y-2">
          <span className={LABEL_CLASS}>
            Admission Pay Slip Screenshot / PDF *
          </span>
          <label className="flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl bg-surface-2 border border-dashed border-line hover:border-brand cursor-pointer transition-colors">
            <span className="inline-flex items-center gap-2 text-xs font-medium text-fg truncate">
              {form.paymentSlipName ? (
                <>
                  <FileCheck2 className="w-4 h-4 text-success shrink-0" />
                  <span className="truncate">{form.paymentSlipName}</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 text-brand shrink-0" />
                  <span>Upload Pay Slip (PNG, JPG, or PDF)</span>
                </>
              )}
            </span>
            <span className="text-[11px] font-semibold text-brand shrink-0">
              {form.paymentSlipName ? "Change" : "Browse"}
            </span>
            <input
              type="file"
              accept=".pdf,image/*"
              onChange={handleSlipUpload}
              className="hidden"
            />
          </label>

          {form.paymentSlipPreviewUrl && (
            <div className="rounded-xl overflow-hidden border border-line bg-surface-2 max-h-36 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.paymentSlipPreviewUrl}
                alt="Admission pay slip preview"
                className="max-h-36 w-auto object-contain"
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Step 5: Board Exam Credentials (Clean Tabbed Switcher: SSC | HSC | JSC)
  const sscDone = Boolean(form.sscRoll.trim() && form.sscRegNo.trim() && form.sscGpa.trim());
  const hscDone = Boolean(form.hscRoll.trim() && form.hscRegNo.trim() && form.hscGpa.trim());
  const jscDone = Boolean(form.jscGpa.trim() || form.jscRoll.trim());

  return (
    <div className="space-y-4">
      {/* Spring-Animated Segmented Exam Tab Switcher */}
      <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-surface-2 border border-line">
        {(
          [
            { id: "SSC" as const, label: "SSC *", done: sscDone },
            { id: "HSC" as const, label: "HSC *", done: hscDone },
            { id: "JSC" as const, label: "JSC (Opt.)", done: jscDone },
          ] as const
        ).map((tab) => {
          const active = activeExamTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveExamTab(tab.id)}
              className={`relative h-8 px-2 rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer focus:outline-none z-10 ${
                active ? "text-fg" : "text-fg-muted hover:text-fg"
              }`}
            >
              {active && (
                <motion.div
                  layoutId="reg-student-exam-tab"
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

      {activeExamTab === "SSC" && (
        <div className="space-y-3.5">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="ssc-board" className={LABEL_CLASS}>Board *</label>
              <select
                id="ssc-board"
                value={form.sscBoard}
                onChange={(e) => onChange("sscBoard", e.target.value)}
                className={INPUT_CLASS}
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
                className={INPUT_CLASS}
              >
                {BD_ACADEMIC_GROUPS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="ssc-year" className={LABEL_CLASS}>Passing Year *</label>
              <input
                id="ssc-year"
                type="text"
                value={form.sscYear}
                onChange={(e) => onChange("sscYear", e.target.value)}
                placeholder="2022"
                className={`${INPUT_CLASS} font-mono`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="ssc-roll" className={LABEL_CLASS}>SSC Roll No. *</label>
              <input
                id="ssc-roll"
                type="text"
                value={form.sscRoll}
                onChange={(e) => onChange("sscRoll", e.target.value)}
                placeholder="6-digit roll"
                className={`${INPUT_CLASS} font-mono`}
              />
            </div>
            <div>
              <label htmlFor="ssc-reg" className={LABEL_CLASS}>Registration No. *</label>
              <input
                id="ssc-reg"
                type="text"
                value={form.sscRegNo}
                onChange={(e) => onChange("sscRegNo", e.target.value)}
                placeholder="10-digit reg no."
                className={`${INPUT_CLASS} font-mono`}
              />
            </div>
            <div>
              <label htmlFor="ssc-gpa" className={LABEL_CLASS}>GPA (Out of 5.00) *</label>
              <input
                id="ssc-gpa"
                type="text"
                value={form.sscGpa}
                onChange={(e) => onChange("sscGpa", e.target.value)}
                placeholder="5.00"
                className={`${INPUT_CLASS} font-mono`}
              />
            </div>
          </div>

          <label className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-surface-2 border border-dashed border-line hover:border-brand cursor-pointer transition-colors">
            <span className="inline-flex items-center gap-2 text-xs font-medium text-fg truncate">
              {form.sscMarksheetName ? (
                <>
                  <FileCheck2 className="w-4 h-4 text-success shrink-0" />
                  <span className="truncate">{form.sscMarksheetName}</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 text-brand shrink-0" />
                  <span>Upload SSC Marksheet / Transcript (PDF/JPG)</span>
                </>
              )}
            </span>
            <span className="text-[11px] font-semibold text-brand shrink-0">
              {form.sscMarksheetName ? "Change" : "Browse"}
            </span>
            <input
              type="file"
              accept=".pdf,image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onChange("sscMarksheetName", file.name);
              }}
              className="hidden"
            />
          </label>

          {sscDone && !hscDone && (
            <button
              type="button"
              onClick={() => setActiveExamTab("HSC")}
              className="text-xs font-semibold text-brand hover:underline cursor-pointer"
            >
              SSC complete &rarr; Fill HSC details next
            </button>
          )}
        </div>
      )}

      {activeExamTab === "HSC" && (
        <div className="space-y-3.5">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="hsc-board" className={LABEL_CLASS}>Board *</label>
              <select
                id="hsc-board"
                value={form.hscBoard}
                onChange={(e) => onChange("hscBoard", e.target.value)}
                className={INPUT_CLASS}
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
                className={INPUT_CLASS}
              >
                {BD_ACADEMIC_GROUPS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="hsc-year" className={LABEL_CLASS}>Passing Year *</label>
              <input
                id="hsc-year"
                type="text"
                value={form.hscYear}
                onChange={(e) => onChange("hscYear", e.target.value)}
                placeholder="2024"
                className={`${INPUT_CLASS} font-mono`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="hsc-roll" className={LABEL_CLASS}>HSC Roll No. *</label>
              <input
                id="hsc-roll"
                type="text"
                value={form.hscRoll}
                onChange={(e) => onChange("hscRoll", e.target.value)}
                placeholder="6-digit roll"
                className={`${INPUT_CLASS} font-mono`}
              />
            </div>
            <div>
              <label htmlFor="hsc-reg" className={LABEL_CLASS}>Registration No. *</label>
              <input
                id="hsc-reg"
                type="text"
                value={form.hscRegNo}
                onChange={(e) => onChange("hscRegNo", e.target.value)}
                placeholder="10-digit reg no."
                className={`${INPUT_CLASS} font-mono`}
              />
            </div>
            <div>
              <label htmlFor="hsc-gpa" className={LABEL_CLASS}>GPA (Out of 5.00) *</label>
              <input
                id="hsc-gpa"
                type="text"
                value={form.hscGpa}
                onChange={(e) => onChange("hscGpa", e.target.value)}
                placeholder="5.00"
                className={`${INPUT_CLASS} font-mono`}
              />
            </div>
          </div>

          <label className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-surface-2 border border-dashed border-line hover:border-brand cursor-pointer transition-colors">
            <span className="inline-flex items-center gap-2 text-xs font-medium text-fg truncate">
              {form.hscMarksheetName ? (
                <>
                  <FileCheck2 className="w-4 h-4 text-success shrink-0" />
                  <span className="truncate">{form.hscMarksheetName}</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 text-brand shrink-0" />
                  <span>Upload HSC Marksheet / Transcript (PDF/JPG)</span>
                </>
              )}
            </span>
            <span className="text-[11px] font-semibold text-brand shrink-0">
              {form.hscMarksheetName ? "Change" : "Browse"}
            </span>
            <input
              type="file"
              accept=".pdf,image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onChange("hscMarksheetName", file.name);
              }}
              className="hidden"
            />
          </label>
        </div>
      )}

      {activeExamTab === "JSC" && (
        <div className="space-y-3.5">
          <p className="text-xs text-fg-muted">
            Optional — provide JSC / JDC details if applicable to your cohort.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="jsc-board" className={LABEL_CLASS}>Board</label>
              <select
                id="jsc-board"
                value={form.jscBoard}
                onChange={(e) => onChange("jscBoard", e.target.value)}
                className={INPUT_CLASS}
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
              <label htmlFor="jsc-roll" className={LABEL_CLASS}>JSC Roll No.</label>
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
              <label htmlFor="jsc-gpa" className={LABEL_CLASS}>JSC GPA</label>
              <input
                id="jsc-gpa"
                type="text"
                value={form.jscGpa}
                onChange={(e) => onChange("jscGpa", e.target.value)}
                placeholder="e.g. 5.00"
                className={`${INPUT_CLASS} font-mono`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
