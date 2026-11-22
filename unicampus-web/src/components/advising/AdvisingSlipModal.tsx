"use client";

import React from "react";
import { Printer, GraduationCap } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { 
  CANONICAL_STUDENT, 
  CANONICAL_FACULTY, 
  ACTIVE_TERM 
} from "@/lib/canonicalCampus";
import type { AdvisingCourse, SelectedRegistrationItem } from "./advisingData";

interface AdvisingSlipModalProps {
  open: boolean;
  onClose: () => void;
  selectedItems: SelectedRegistrationItem[];
  offerings: AdvisingCourse[];
  status: "draft" | "submitted" | "approved";
}

export function AdvisingSlipModal({
  open,
  onClose,
  selectedItems,
  offerings,
  status,
}: AdvisingSlipModalProps) {
  const items = selectedItems.map((item) => {
    const course = offerings.find((c) => c.code === item.courseCode);
    const section = course?.sections.find((s) => s.id === item.sectionId);
    return {
      code: item.courseCode,
      title: course?.title || item.courseCode,
      credits: course?.credits || 0,
      type: course?.type || "Theory",
      section: section?.sectionName || "Section A",
      days: section?.days.join(", ") || "",
      time: section?.timeSlot || "",
      room: section?.room || "",
      instructor: section?.instructor || "",
    };
  });

  const totalCredits = items.reduce((acc, i) => acc + i.credits, 0);

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
      title="Official Course Advising Slip"
      description="Institutional record of registered semester courses and advisor authorization."
    >
      <div className="space-y-6 pt-1 pb-2">
        {/* Printable Document Sheet */}
        <div className="p-6 rounded-2xl bg-surface border border-line space-y-6 font-sans print:border-none print:p-0">
          {/* Letterhead */}
          <div className="flex items-start justify-between border-b border-line pb-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-brand-soft text-brand flex items-center justify-center font-bold">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-fg leading-tight">
                  UniCampus University of Technology
                </h2>
                <p className="text-xs text-fg-muted font-medium">
                  Office of the Registrar • Directorate of Academic Records
                </p>
                <p className="text-[11px] text-fg-subtle">
                  Official Course Registration Slip • {ACTIVE_TERM}
                </p>
              </div>
            </div>

            <div className="text-right text-xs space-y-0.5 shrink-0">
              <span className="inline-block px-2 py-0.5 rounded font-mono font-bold bg-surface-2 text-fg border border-line">
                REF: ADV-2026-0894
              </span>
              <p className="text-[11px] text-fg-muted">
                Status:{" "}
                <span className="font-semibold text-brand uppercase">
                  {status === "approved" ? "Verified" : "Submitted"}
                </span>
              </p>
            </div>
          </div>

          {/* Student & Term Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-canvas border border-line text-xs">
            <div>
              <span className="text-fg-muted block text-[11px]">Scholar Name</span>
              <strong className="text-fg">{CANONICAL_STUDENT.name}</strong>
            </div>
            <div>
              <span className="text-fg-muted block text-[11px]">Student ID</span>
              <strong className="font-mono text-fg">{CANONICAL_STUDENT.studentId}</strong>
            </div>
            <div>
              <span className="text-fg-muted block text-[11px]">Department / Batch</span>
              <strong className="text-fg">CSE • {CANONICAL_STUDENT.batch}</strong>
            </div>
            <div>
              <span className="text-fg-muted block text-[11px]">Faculty Advisor</span>
              <strong className="text-fg">{CANONICAL_FACULTY.name}</strong>
            </div>
          </div>

          {/* Courses Table */}
          <div className="border border-line rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-2 border-b border-line font-semibold text-fg-muted">
                <tr>
                  <th className="py-2.5 px-3 font-mono">Code</th>
                  <th className="py-2.5 px-3">Course Title</th>
                  <th className="py-2.5 px-3">Section</th>
                  <th className="py-2.5 px-3">Days &amp; Time</th>
                  <th className="py-2.5 px-3">Room</th>
                  <th className="py-2.5 px-3 text-right">Cr</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {items.map((c) => (
                  <tr key={c.code} className="hover:bg-surface-2/40">
                    <td className="py-2.5 px-3 font-mono font-bold text-brand">
                      {c.code}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-fg">{c.title}</td>
                    <td className="py-2.5 px-3 text-fg-muted">{c.section}</td>
                    <td className="py-2.5 px-3 text-fg-muted">
                      {c.days} • {c.time}
                    </td>
                    <td className="py-2.5 px-3 text-fg-muted">{c.room}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-fg">
                      {c.credits.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-surface-2 border-t border-line font-bold text-xs text-fg">
                <tr>
                  <td colSpan={5} className="py-2.5 px-3 text-right">
                    Total Registered Semester Credits:
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-brand text-sm">
                    {totalCredits.toFixed(1)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Signatures Row */}
          <div className="pt-8 flex items-end justify-between text-xs text-fg-muted">
            <div className="text-center w-48 border-t border-line pt-2">
              <p className="font-semibold text-fg">{CANONICAL_STUDENT.name}</p>
              <p className="text-[11px]">Student Signature</p>
            </div>

            <div className="text-center w-48 border-t border-line pt-2">
              <p className="font-semibold text-fg">{CANONICAL_FACULTY.name}</p>
              <p className="text-[11px]">Faculty Advisor Approval</p>
            </div>
          </div>
        </div>

        {/* Modal Controls */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-line">
          <Button variant="secondary" size="md" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handlePrint}
            className="flex items-center gap-2 font-semibold"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Slip</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}
