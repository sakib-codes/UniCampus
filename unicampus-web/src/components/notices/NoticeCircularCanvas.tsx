"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Bookmark,
  Check,
  Download,
  GraduationCap,
  Printer,
  Share2,
  ShieldCheck,
} from "lucide-react";
import { buildCircularTextExport, type NoticeItem } from "./noticeData";

interface NoticeCircularCanvasProps {
  activeNotice: NoticeItem;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onBackToList?: () => void;
}

export const NoticeCircularCanvas = React.memo(function NoticeCircularCanvas({
  activeNotice,
  isBookmarked,
  onToggleBookmark,
  onBackToList,
}: NoticeCircularCanvasProps) {
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const text = buildCircularTextExport(activeNotice);
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeNotice.id}-circular.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section
      aria-label="Official Circular Reader"
      className="flex-1 min-w-0 h-full bg-canvas flex flex-col overflow-hidden"
    >
      {/* Sticky Single-Row Reader Toolbar */}
      <header className="h-14 px-4 sm:px-6 lg:px-8 bg-surface border-b border-line flex items-center justify-between gap-3 shrink-0">
        {/* Left Cluster */}
        <div className="flex items-center gap-2.5 min-w-0">
          {onBackToList && (
            <button
              type="button"
              onClick={onBackToList}
              className="lg:hidden inline-flex items-center gap-1.5 text-xs font-medium text-fg-muted hover:text-fg py-1.5 px-2.5 rounded-lg border border-line bg-surface hover:bg-surface-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand shrink-0"
              aria-label="Back to notices list"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Notices</span>
            </button>
          )}
          <span className="font-mono text-xs font-medium text-brand bg-brand-soft px-2.5 py-1 rounded-md border border-brand/20 shrink-0">
            Ref: {activeNotice.refNo}
          </span>
          <span className="font-sans text-xs font-medium text-success bg-success-light px-2.5 py-1 rounded-md hidden sm:inline-flex items-center gap-1 shrink-0">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Official</span>
          </span>
        </div>

        {/* Right Action Cluster (Guaranteed ONE row) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            aria-label={isBookmarked ? "Remove Bookmark" : "Bookmark Notice"}
            title={isBookmarked ? "Remove Bookmark" : "Bookmark Notice"}
            onClick={onToggleBookmark}
            className={`w-9 h-9 max-sm:w-10 max-sm:h-10 rounded-lg border border-line bg-surface hover:bg-surface-2 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand transition-colors ${
              isBookmarked ? "text-brand" : "text-fg-muted hover:text-fg"
            }`}
          >
            <Bookmark
              className={`w-4 h-4 ${isBookmarked ? "fill-brand" : ""}`}
            />
          </button>

          <button
            type="button"
            title="Print Official Circular"
            aria-label="Print Official Circular"
            onClick={handlePrint}
            className="w-9 h-9 max-sm:w-10 max-sm:h-10 rounded-lg border border-line bg-surface hover:bg-surface-2 text-fg-muted hover:text-fg flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand transition-colors"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            type="button"
            title="Share Notice Link"
            aria-label="Share Notice Link"
            onClick={handleShare}
            className="w-9 h-9 max-sm:w-10 max-sm:h-10 rounded-lg border border-line bg-surface hover:bg-surface-2 text-fg-muted hover:text-fg flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand transition-colors"
          >
            {copied ? (
              <Check className="w-4 h-4 text-success" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="h-9 px-3.5 rounded-lg bg-brand hover:bg-brand-hover text-on-brand text-xs font-semibold inline-flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download Circular</span>
            <span className="sm:hidden">Download</span>
          </button>
        </div>
      </header>

      {/* Scrollable Document Canvas */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-8">
        <article className="max-w-[840px] mx-auto w-full rounded-2xl bg-surface border border-line p-6 sm:p-8 lg:p-10 space-y-6">
          {/* Institutional Header */}
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-soft text-brand flex items-center justify-center shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="font-semibold uppercase tracking-wider text-fg-muted">
                  {activeNotice.department}
                </span>
                <span className="text-fg-subtle">•</span>
                <span className="font-medium text-fg-subtle">
                  UniCampus Official Circular
                </span>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-semibold text-fg tracking-tight leading-snug mt-3">
              {activeNotice.title}
            </h2>
          </div>

          {/* Structured 3-Column Metadata Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-surface-2/60 border border-line">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-fg-subtle font-medium">
                Published
              </p>
              <p className="text-xs font-medium text-fg tabular-nums mt-0.5">
                {activeNotice.dateStr}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-fg-subtle font-medium">
                Academic Session
              </p>
              <p className="text-xs font-medium text-fg mt-0.5">
                {activeNotice.academicSession}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-fg-subtle font-medium">
                Target Audience
              </p>
              <p className="text-xs font-medium text-fg mt-0.5">
                {activeNotice.targetAudience}
              </p>
            </div>
          </div>

          {/* Body Paragraphs */}
          <div className="space-y-4 text-sm sm:text-[15px] text-fg/90 leading-7">
            {activeNotice.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {/* Protocol Callout Box */}
          {activeNotice.protocols && (
            <div className="rounded-xl bg-surface-2/60 border border-line p-4 sm:p-5 space-y-2.5">
              <div className="flex items-center gap-2 text-brand">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span className="text-xs font-semibold uppercase tracking-wide">
                  {activeNotice.protocols.title}
                </span>
              </div>
              <ul className="space-y-1.5 text-xs sm:text-sm text-fg-muted list-disc list-inside leading-relaxed">
                {activeNotice.protocols.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Full-Width Schedule Table */}
          {activeNotice.scheduleTable && (
            <div className="rounded-xl border border-line bg-surface overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-surface-2/70 text-xs font-semibold text-fg-muted border-b border-line">
                  <tr>
                    {activeNotice.scheduleTable.headers.map((h, i) => (
                      <th key={i} className="px-4 py-3 font-semibold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {activeNotice.scheduleTable.rows.map((row, i) => (
                    <tr
                      key={i}
                      className="hover:bg-surface-2/40 transition-colors"
                    >
                      <td className="px-4 py-3.5">
                        <span className="font-mono font-medium text-brand">
                          {row.code}
                        </span>
                        <span className="text-fg-muted ml-2">{row.title}</span>
                      </td>
                      <td className="px-4 py-3.5 font-sans tabular-nums text-fg">
                        {row.col1}
                      </td>
                      <td className="px-4 py-3.5 font-sans tabular-nums text-fg-muted">
                        {row.col2}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-surface-2 border border-line text-xs font-medium text-fg">
                          {row.col3}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Sign-Off Footer */}
          <footer className="pt-6 border-t border-line flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-success-light text-success border border-success/20 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-success">
                  Verified Official Circular
                </p>
                <p className="text-xs text-fg-muted mt-0.5">
                  {activeNotice.department}
                </p>
                <p className="text-xs font-mono text-fg-subtle mt-0.5">
                  Ref: {activeNotice.refNo}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-start sm:items-end sm:text-right max-w-xs">
              <p className="font-serif italic text-sm text-fg-muted">
                Digital Verification Signature
              </p>
              <p className="text-sm font-semibold text-fg mt-1">
                {activeNotice.author}
              </p>
              <p className="font-sans text-xs text-fg-muted">
                {activeNotice.authorDesignation}
              </p>
              <p className="font-sans text-xs text-fg-subtle mt-0.5">
                {activeNotice.authorCouncil}
              </p>
            </div>
          </footer>
        </article>
      </div>
    </section>
  );
});

