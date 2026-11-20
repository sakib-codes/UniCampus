"use client";

import React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Paperclip,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import type { StudentInquiry } from "./teacherDashboardData";

interface InquiryRowProps {
  inquiry: StudentInquiry;
  onApproveMedical: (id: string) => void;
  onReply: (inquiry: StudentInquiry) => void;
}

const InquiryRow = React.memo(function InquiryRow({
  inquiry,
  onApproveMedical,
  onReply,
}: InquiryRowProps) {
  return (
    <div className="p-3.5 rounded-2xl bg-surface-2 border border-line hover:border-brand/40 transition-colors group">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-brand-soft border border-brand/20 font-semibold text-xs text-brand flex items-center justify-center shrink-0">
            {inquiry.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-semibold text-fg group-hover:text-brand transition-colors truncate">
              {inquiry.name}
            </h4>
            <p className="text-xs font-sans text-fg-muted">
              ID: <span className="font-mono">{inquiry.studentId}</span> •{" "}
              <span className="font-mono text-brand font-semibold whitespace-nowrap">
                {inquiry.courseCode}
              </span>
            </p>
          </div>
        </div>
        <span className="text-xs font-sans tabular-nums text-fg-muted whitespace-nowrap shrink-0">
          {inquiry.timeAgo}
        </span>
      </div>

      <p className="text-xs text-fg mt-2.5 leading-relaxed bg-surface p-2.5 rounded-xl border border-line font-normal">
        &quot;{inquiry.message}&quot;
      </p>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-line text-xs">
        {inquiry.attachment ? (
          inquiry.attachment.type === "medical" ? (
            <span className="inline-flex items-center gap-1 text-xs font-sans text-success font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Medical slip
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-sans text-fg-muted">
              <Paperclip className="w-3.5 h-3.5 text-warning shrink-0" />{" "}
              {inquiry.attachment.name}
            </span>
          )
        ) : (
          <span className="text-xs text-fg-muted font-sans">
            Office Hours Slot?
          </span>
        )}

        <div className="flex items-center gap-2">
          {inquiry.hasApproveAction && (
            <button
              type="button"
              onClick={() => onApproveMedical(inquiry.id)}
              disabled={inquiry.status === "approved"}
              className={`min-h-[36px] px-2.5 py-1 rounded-md text-xs font-sans font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                inquiry.status === "approved"
                  ? "bg-success-light text-success border border-success/30"
                  : "bg-success-light/60 text-success hover:bg-success-light border border-success/20"
              }`}
            >
              {inquiry.status === "approved" ? "Approved" : "Approve"}
            </button>
          )}

          <button
            type="button"
            onClick={() => onReply(inquiry)}
            className="min-h-[36px] px-1.5 text-xs font-semibold text-brand hover:underline transition-colors inline-flex items-center gap-1 cursor-pointer rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <span>Reply</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
});

interface StudentInquiriesPanelProps {
  inquiries: StudentInquiry[];
  onApproveMedical: (id: string) => void;
  onReply: (inquiry: StudentInquiry) => void;
}

export function StudentInquiriesPanel({
  inquiries,
  onApproveMedical,
  onReply,
}: StudentInquiriesPanelProps) {
  return (
    <div className="lg:col-span-4 rounded-2xl bg-surface border border-line p-5 sm:p-6 flex flex-col justify-between">
      <div>
        <div className="pb-4 border-b border-line">
          <h2 className="text-lg font-semibold text-fg tracking-tight">
            Student Inquiries Requiring Review
          </h2>
          <p className="text-xs text-fg-muted mt-0.5 tabular-nums">
            {inquiries.length} inquiries pending direct instructor review
          </p>
        </div>

        {/* Inquiries List */}
        <div className="mt-4 space-y-3.5">
          {inquiries.map((inquiry) => (
            <InquiryRow
              key={inquiry.id}
              inquiry={inquiry}
              onApproveMedical={onApproveMedical}
              onReply={onReply}
            />
          ))}
        </div>
      </div>

      {/* Bottom Action */}
      <div className="mt-4 pt-4 border-t border-line">
        <Link
          href="/messages"
          className="w-full min-h-[44px] py-2.5 px-3 rounded-xl bg-surface-2 hover:bg-surface border border-line text-xs font-semibold text-fg flex items-center justify-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <MessageSquare className="w-4 h-4 text-brand" />
          <span>Open Messages</span>
        </Link>
      </div>
    </div>
  );
}
