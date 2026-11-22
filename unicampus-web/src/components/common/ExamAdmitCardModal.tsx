"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  AlertTriangle,
  Printer,
  GraduationCap,
  ShieldCheck,
  CreditCard,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import {
  ACTIVE_TERM,
  CANONICAL_STUDENT,
  formatYearSemester,
} from "@/lib/canonicalCampus";
import { studentPaymentService } from "@/lib/services/studentPaymentService";

interface ExamAdmitCardModalProps {
  open: boolean;
  onClose: () => void;
  studentName: string;
  studentId: string;
  departmentName: string;
  semesterName: string;
  photoUrl?: string | null;
  academicHold?: boolean;
  financialHold?: boolean;
}

const EXAM_SCHEDULE = [
  {
    code: "CSE-3101",
    title: "Design & Analysis of Algorithms",
    date: "Nov 12, 2026",
    time: "10:00 AM – 01:00 PM",
    hall: "Hall A-102 • Seat 14",
    attendance: 91,
  },
  {
    code: "CSE-3205",
    title: "Software Engineering & System Design",
    date: "Nov 15, 2026",
    time: "10:00 AM – 01:00 PM",
    hall: "Hall B-204 • Seat 08",
    attendance: 88,
  },
  {
    code: "CSE-3103",
    title: "Database Management Systems",
    date: "Nov 18, 2026",
    time: "02:00 PM – 05:00 PM",
    hall: "Hall A-105 • Seat 22",
    attendance: 86,
  },
  {
    code: "CSE-3102",
    title: "Algorithms Sessional Lab (Viva)",
    date: "Nov 21, 2026",
    time: "11:00 AM – 01:00 PM",
    hall: "Lab 4A • Bench 06",
    attendance: 94,
  },
];

export function ExamAdmitCardModal({
  open,
  onClose,
  studentName,
  studentId,
  departmentName,
  semesterName,
  photoUrl,
  academicHold = false,
  financialHold = false,
}: ExamAdmitCardModalProps) {
  const duesSummary = useMemo(() => {
    if (!open) return { totalDue: 0 };
    const invoices = studentPaymentService.getInvoices();
    const totalDue = invoices.reduce((sum, inv) => sum + inv.due_amount, 0);
    return { totalDue };
  }, [open]);

  const minAttendanceMet = EXAM_SCHEDULE.every((c) => c.attendance >= 75);
  const duesCleared = duesSummary.totalDue === 0 && !financialHold;
  const attendanceCleared = minAttendanceMet && !academicHold;
  const isFullyEligible = duesCleared && attendanceCleared;

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="xl"
      title="Semester Final Exam Admit Card"
      description="Official examination clearance and printable hall entry pass."
    >
      <div className="space-y-5 pt-1 pb-2 max-h-[78dvh] overflow-y-auto pr-1">
        {/* Eligibility Verification Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs print:hidden">
          <div className="p-3 rounded-xl bg-success-light border border-success/25 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
            <div>
              <div className="font-semibold text-fg">Registration</div>
              <div className="text-[11px] text-success">Verified Active</div>
            </div>
          </div>

          <div
            className={`p-3 rounded-xl border flex items-center gap-2 ${
              attendanceCleared
                ? "bg-success-light border-success/25"
                : "bg-danger-light border-danger/25"
            }`}
          >
            {attendanceCleared ? (
              <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-danger shrink-0" />
            )}
            <div>
              <div className="font-semibold text-fg">Attendance (&ge;75%)</div>
              <div
                className={`text-[11px] ${
                  attendanceCleared ? "text-success" : "text-danger"
                }`}
              >
                {attendanceCleared ? "All courses ≥ 86%" : "Academic Hold / Deficit"}
              </div>
            </div>
          </div>

          <div
            className={`p-3 rounded-xl border flex items-center justify-between gap-2 ${
              duesCleared
                ? "bg-success-light border-success/25"
                : "bg-warning-light border-warning/30"
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              {duesCleared ? (
                <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-warning shrink-0" />
              )}
              <div className="min-w-0">
                <div className="font-semibold text-fg">Tuition Clearance</div>
                <div
                  className={`text-[11px] truncate ${
                    duesCleared ? "text-success" : "text-warning"
                  }`}
                >
                  {duesCleared
                    ? "100% Cleared"
                    : `৳${duesSummary.totalDue.toLocaleString()} due`}
                </div>
              </div>
            </div>
            {!duesCleared && (
              <Link
                href="/payments"
                onClick={onClose}
                className="px-2 py-1 rounded-lg bg-surface border border-line text-[11px] font-semibold text-brand hover:bg-surface-2 shrink-0 inline-flex items-center gap-1"
              >
                <CreditCard className="w-3 h-3" />
                <span>Pay</span>
              </Link>
            )}
          </div>
        </div>

        {/* Printable Admit Card Sheet */}
        <div className="p-6 rounded-2xl bg-surface border border-line space-y-5 font-sans print:border-none print:p-0">
          {/* University Letterhead */}
          <div className="flex items-start justify-between gap-4 border-b border-line pb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-brand text-on-brand flex items-center justify-center shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-fg leading-tight">
                  UniCampus University of Technology
                </h2>
                <p className="text-xs text-fg-muted">
                  Office of the Controller of Examinations
                </p>
                <p className="text-[11px] font-semibold text-brand mt-0.5">
                  OFFICIAL SEMESTER FINAL ADMIT CARD • {ACTIVE_TERM}
                </p>
              </div>
            </div>

            <div className="text-right text-xs space-y-1 shrink-0">
              <span className="inline-block px-2 py-0.5 rounded font-mono font-bold bg-surface-2 text-fg border border-line">
                PASS: COE-2026-4424
              </span>
              <div className="text-[11px]">
                {isFullyEligible ? (
                  <span className="text-success font-semibold">CLEARED FOR HALL ENTRY</span>
                ) : (
                  <span className="text-warning font-semibold">PROVISIONAL PREVIEW (DUES PENDING)</span>
                )}
              </div>
            </div>
          </div>

          {/* Student Details + Photo */}
          <div className="flex flex-col sm:flex-row items-start gap-4 p-4 rounded-xl bg-surface-2 border border-line">
            <div className="w-16 h-20 rounded-xl bg-surface border border-line overflow-hidden flex items-center justify-center shrink-0">
              {photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoUrl} alt={studentName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm font-bold text-brand">
                  {studentName.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1 text-xs">
              <div>
                <span className="text-fg-muted block text-[11px]">Student Name</span>
                <strong className="text-fg">{studentName}</strong>
              </div>
              <div>
                <span className="text-fg-muted block text-[11px]">Academic ID</span>
                <strong className="font-mono text-brand">{studentId}</strong>
              </div>
              <div>
                <span className="text-fg-muted block text-[11px]">Department</span>
                <strong className="text-fg">{departmentName}</strong>
              </div>
              <div>
                <span className="text-fg-muted block text-[11px]">Year &amp; Semester</span>
                <strong className="text-fg">{formatYearSemester(semesterName)}</strong>
              </div>
              <div>
                <span className="text-fg-muted block text-[11px]">Batch</span>
                <strong className="text-fg">{CANONICAL_STUDENT.batch}</strong>
              </div>
              <div className="col-span-2 sm:col-span-3">
                <span className="text-fg-muted block text-[11px]">Examination Center</span>
                <strong className="text-fg">Main Academic Campus, Dhaka</strong>
              </div>
            </div>
          </div>

          {/* Exam Schedule Table */}
          <div className="border border-line rounded-xl overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-2 border-b border-line text-fg-muted">
                <tr>
                  <th className="py-2.5 px-3 font-mono font-semibold">Code</th>
                  <th className="py-2.5 px-3 font-semibold">Course Title</th>
                  <th className="py-2.5 px-3 font-semibold">Date &amp; Time</th>
                  <th className="py-2.5 px-3 font-semibold">Hall &amp; Seat</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Attendance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {EXAM_SCHEDULE.map((row) => (
                  <tr key={row.code}>
                    <td className="py-2.5 px-3 font-mono font-bold text-brand">{row.code}</td>
                    <td className="py-2.5 px-3 font-medium text-fg">{row.title}</td>
                    <td className="py-2.5 px-3 text-fg-muted">
                      {row.date} • {row.time}
                    </td>
                    <td className="py-2.5 px-3 text-fg font-medium">{row.hall}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold text-success">
                      {row.attendance}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Rules & Signature */}
          <div className="pt-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-t border-line text-xs">
            <div className="space-y-1 text-[11px] text-fg-muted max-w-md">
              <div className="font-semibold text-fg flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-brand" />
                <span>Exam Hall Instructions</span>
              </div>
              <p>1. Carry both this Admit Card and your Official Student Academic ID Card.</p>
              <p>2. Report to the examination hall at least 20 minutes prior to start time.</p>
            </div>

            <div className="text-center w-48 border-t border-line pt-2 shrink-0">
              <p className="font-semibold text-fg">Dr. M. Rezaul Karim</p>
              <p className="text-[11px] text-fg-muted">Controller of Examinations</p>
            </div>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-line print:hidden">
          <Button variant="secondary" size="md" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handlePrint}
            leftIcon={<Printer className="w-4 h-4" />}
          >
            Print Admit Card
          </Button>
        </div>
      </div>
    </Modal>
  );
}
