"use client";

import React from "react";
import { GraduationCap, Printer, ShieldCheck, Droplets, Phone, Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatYearSemester } from "@/lib/canonicalCampus";

export interface AcademicIdCardProps {
  role: "student" | "teacher";
  academicId: string;
  fullName: string;
  departmentName: string;
  departmentCode: string;
  photoUrl?: string | null;
  semesterName?: string | null;
  designation?: string | null;
  bloodGroup?: string;
  phone?: string;
  emergencyPhone?: string;
  dateOfBirth?: string;
  validThrough?: string;
  showPrintButton?: boolean;
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "UC";
}

function BarcodeStrip({ value }: { value: string }) {
  // Deterministic visual barcode bars derived from academicId character codes
  const bars: number[] = [];
  const seed = value || "UNICAMPUS";
  for (let i = 0; i < 38; i++) {
    const code = seed.charCodeAt(i % seed.length) + i * 17;
    bars.push((code % 3) + 1);
  }
  return (
    <div className="flex items-stretch justify-center gap-[1.5px] h-7 w-full overflow-hidden" aria-hidden="true">
      {bars.map((w, idx) => (
        <span
          key={idx}
          className="bg-fg/80 rounded-[0.5px]"
          style={{ width: `${w * 1.5}px`, opacity: idx % 5 === 0 ? 0.45 : 0.9 }}
        />
      ))}
    </div>
  );
}

export function AcademicIdCard({
  role,
  academicId,
  fullName,
  departmentName,
  departmentCode,
  photoUrl,
  semesterName,
  designation,
  bloodGroup,
  phone,
  emergencyPhone,
  dateOfBirth,
  validThrough,
  showPrintButton = true,
}: AcademicIdCardProps) {
  const isStudent = role === "student";
  const validity = validThrough || (isStudent ? "2026 – 2030" : "Active Faculty");

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="space-y-3 w-full max-w-md mx-auto">
      <div className="rounded-2xl bg-surface border border-line overflow-hidden shadow-xs print:shadow-none print:border-fg/30">
        {/* Top Institutional Header */}
        <div className="bg-brand text-on-brand px-5 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
              <GraduationCap className="w-4 h-4 text-on-brand" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold tracking-tight truncate">
                UniCampus University
              </div>
              <div className="text-[10px] opacity-85 truncate">
                Official Academic Identity Card
              </div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-white/20 text-[10px] font-bold uppercase tracking-wider shrink-0">
            {isStudent ? "Student" : "Faculty"}
          </span>
        </div>

        {/* Main Card Body */}
        <div className="p-5 space-y-4">
          <div className="flex items-start gap-4">
            {/* Passport Photo */}
            <div className="w-20 h-24 rounded-xl bg-surface-2 border border-line overflow-hidden shrink-0 flex items-center justify-center">
              {photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photoUrl}
                  alt={fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-lg font-bold text-brand">
                  {getInitials(fullName)}
                </span>
              )}
            </div>

            {/* Identity Core */}
            <div className="min-w-0 flex-1 space-y-1.5 text-left">
              <div>
                <h3 className="text-base font-bold text-fg leading-snug truncate">
                  {fullName}
                </h3>
                <p className="text-xs text-fg-muted font-medium truncate">
                  {isStudent
                    ? departmentName
                    : `${designation || "Faculty Member"} · ${departmentCode}`}
                </p>
              </div>

              {/* Auto-Generated Academic ID Pill */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-soft border border-brand/25">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-fg-muted">
                  ID:
                </span>
                <span className="font-mono text-xs font-bold text-brand tracking-wide">
                  {academicId}
                </span>
              </div>

              <div className="text-[11px] text-fg-muted font-medium">
                {isStudent
                  ? semesterName
                    ? formatYearSemester(semesterName)
                    : "1st Year • 1st Semester"
                  : departmentName}
              </div>
            </div>
          </div>

          {/* Metadata Strip */}
          <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-surface-2 border border-line text-left text-[11px]">
            <div className="flex items-center gap-1.5 min-w-0">
              <Droplets className="w-3.5 h-3.5 text-danger shrink-0" />
              <span className="text-fg-muted">Blood:</span>
              <strong className="text-fg truncate">{bloodGroup || "N/A"}</strong>
            </div>
            <div className="flex items-center gap-1.5 min-w-0">
              <Calendar className="w-3.5 h-3.5 text-brand shrink-0" />
              <span className="text-fg-muted">Valid:</span>
              <strong className="text-fg truncate">{validity}</strong>
            </div>
            {(emergencyPhone || phone) && (
              <div className="col-span-2 flex items-center gap-1.5 min-w-0">
                <Phone className="w-3.5 h-3.5 text-success shrink-0" />
                <span className="text-fg-muted">
                  {emergencyPhone ? "Emergency:" : "Contact:"}
                </span>
                <strong className="text-fg font-mono truncate">
                  {emergencyPhone || phone}
                </strong>
              </div>
            )}
            {dateOfBirth && (
              <div className="col-span-2 flex items-center gap-1.5 min-w-0">
                <span className="text-fg-muted">DOB:</span>
                <strong className="text-fg truncate">{dateOfBirth}</strong>
              </div>
            )}
          </div>

          {/* Barcode & Registrar Seal */}
          <div className="pt-2 border-t border-line space-y-2">
            <BarcodeStrip value={academicId} />
            <div className="flex items-center justify-between text-[10px] text-fg-muted">
              <span className="font-mono">{academicId}</span>
              <span className="inline-flex items-center gap-1 text-success font-semibold">
                <ShieldCheck className="w-3 h-3" />
                Office of the Registrar
              </span>
            </div>
          </div>
        </div>
      </div>

      {showPrintButton && (
        <Button
          type="button"
          variant="secondary"
          size="md"
          fullWidth
          onClick={handlePrint}
          leftIcon={<Printer className="w-4 h-4" />}
          className="print:hidden"
        >
          Print / Save Academic ID Card
        </Button>
      )}
    </div>
  );
}
