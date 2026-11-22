"use client";

import React from "react";
import Link from "next/link";
import { 
  Clock, 
  MessageSquare,
  ShieldCheck 
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { CANONICAL_FACULTY } from "@/lib/canonicalCampus";

interface AdvisingHeaderProps {
  status: "draft" | "submitted" | "approved";
  submittedAt?: string | null;
  onOpenAdvisorChat?: () => void;
}

export function AdvisingHeader({
  status,
  submittedAt: _submittedAt,
}: AdvisingHeaderProps) {
  return (
    <section className="rounded-2xl bg-surface border border-line p-5 sm:p-6 transition-colors space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-brand-soft text-brand text-xs font-semibold">
              Fall 2026 Registration
            </span>
            <div className="flex items-center gap-1.5 text-xs text-fg-muted font-medium">
              <Clock className="w-3.5 h-3.5 text-brand" />
              <span>Active Window: 09:00 AM – 05:00 PM (Batch 2022)</span>
            </div>
            {status === "approved" ? (
              <Badge variant="success">Approved &amp; Enrolled</Badge>
            ) : status === "submitted" ? (
              <Badge variant="brand">Pending Advisor Approval</Badge>
            ) : (
              <Badge variant="neutral">Draft (Unsubmitted)</Badge>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-fg">
            Course Advising &amp; Pre-Registration Studio
          </h1>
          <p className="text-xs sm:text-sm text-fg-muted font-sans">
            Select curriculum courses, resolve timetable schedule conflicts in real time, and submit for Faculty Advisor authorization.
          </p>
        </div>

        {/* Advisor & Scholar Badge Strip */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 p-3 rounded-xl bg-surface-2 border border-line shrink-0">
          <div className="w-9 h-9 rounded-xl bg-brand-soft text-brand flex items-center justify-center font-semibold text-xs shrink-0">
            AR
          </div>
          <div className="min-w-0 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-fg">
              <span>Advisor: {CANONICAL_FACULTY.name}</span>
            </div>
            <p className="text-fg-muted truncate">
              {CANONICAL_FACULTY.office} • Mon 04:15 PM
            </p>
          </div>

          <Link
            href="/messages"
            className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-2 border border-line text-xs font-semibold text-fg transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-brand" />
            <span>Consult</span>
          </Link>
        </div>
      </div>

      {/* Policy Exemption Notice Bar */}
      <div className="p-3 rounded-xl bg-canvas border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-fg">
          <ShieldCheck className="w-4 h-4 text-success shrink-0" />
          <span>
            <strong>Academic Exemption Active:</strong> Scholar CGPA is{" "}
            <span className="font-semibold text-brand">3.78 ≥ 3.75</span>. Maximum allowable credit ceiling expanded to{" "}
            <strong>24.0 Credits</strong> (Standard: 21.0 Cr).
          </span>
        </div>
        <div className="text-fg-muted font-medium shrink-0">
          Regular Full-Time Minimum: 12.0 Cr
        </div>
      </div>
    </section>
  );
}
