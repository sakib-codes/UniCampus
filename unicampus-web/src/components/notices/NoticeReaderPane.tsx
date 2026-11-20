"use client";

import { RefObject } from "react";
import {
  Bookmark,
  BookmarkCheck,
  Printer,
  Share2,
  Check,
  Download,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import { NoticeItem } from "@/lib/noticeData";

interface NoticeReaderPaneProps {
  readerRef: RefObject<HTMLDivElement | null>;
  activeNotice: NoticeItem;
  isBookmarked: boolean;
  copiedShare: boolean;
  isDownloading: boolean;
  downloadSuccess: boolean;
  onToggleBookmark: (id: string) => void;
  onPrint: () => void;
  onShare: () => void;
  onDownloadPDF: () => void;
}

export function NoticeReaderPane({
  readerRef,
  activeNotice,
  isBookmarked,
  copiedShare,
  isDownloading,
  downloadSuccess,
  onToggleBookmark,
  onPrint,
  onShare,
  onDownloadPDF,
}: NoticeReaderPaneProps) {
  return (
    <div
      ref={readerRef}
      className="col-span-12 lg:col-span-7 lg:sticky lg:top-20 bg-surface rounded-2xl border border-line overflow-hidden relative"
    >
      {/* Reader Top Utility Toolbar */}
      <div className="px-5 sm:px-6 py-3.5 bg-surface-2 border-b border-line flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-sans text-brand bg-brand-soft px-2.5 py-1 rounded-md border border-brand/25 font-semibold">
            Ref: <span className="font-mono">{activeNotice.refNo}</span>
          </span>
          <span className="text-xs font-sans text-success bg-success-light px-2.5 py-1 rounded-md border border-success/25 flex items-center gap-1 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-success" aria-hidden="true" />
            Signed &amp; Sealed
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => onToggleBookmark(activeNotice.id)}
            title={isBookmarked ? "Remove Bookmark" : "Bookmark Notice"}
            aria-label={isBookmarked ? "Remove Bookmark" : "Bookmark Notice"}
            className="min-w-[44px] min-h-[44px] p-2.5 rounded-xl bg-surface border border-line text-fg-muted hover:text-fg hover:bg-surface-2 transition-colors cursor-pointer inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-4 h-4 text-brand" aria-hidden="true" />
            ) : (
              <Bookmark className="w-4 h-4" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            onClick={onPrint}
            title="Print Official Circular"
            aria-label="Print Official Circular"
            className="min-w-[44px] min-h-[44px] p-2.5 rounded-xl bg-surface border border-line text-fg-muted hover:text-fg hover:bg-surface-2 transition-colors cursor-pointer inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <Printer className="w-4 h-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={onShare}
            title={copiedShare ? "Link Copied" : "Share Notice Link"}
            aria-label={copiedShare ? "Link Copied" : "Share Notice Link"}
            className="min-w-[44px] min-h-[44px] p-2.5 rounded-xl bg-surface border border-line text-fg-muted hover:text-fg hover:bg-surface-2 transition-colors cursor-pointer inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            {copiedShare ? (
              <Check className="w-4 h-4 text-success" aria-hidden="true" />
            ) : (
              <Share2 className="w-4 h-4" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            onClick={onDownloadPDF}
            disabled={isDownloading}
            title="Download Official Circular PDF"
            aria-label="Download Official Circular PDF"
            className="min-h-[44px] flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand hover:bg-brand-hover text-on-brand text-xs font-semibold transition-colors cursor-pointer disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="font-sans tabular-nums">
              {isDownloading
                ? "Generating..."
                : downloadSuccess
                ? "Downloaded"
                : `Download PDF (${activeNotice.attachmentSize || "1.4 MB"})`}
            </span>
          </button>
        </div>
      </div>

      {/* Official Document Letterhead & Content Container */}
      <div className="p-6 sm:p-8 flex flex-col gap-6 relative z-10">
        {/* Formal University Letterhead */}
        <div className="text-center pb-6 border-b border-line flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-surface-2 border border-brand/25 flex items-center justify-center text-brand mb-3">
            <GraduationCap className="w-6 h-6" aria-hidden="true" />
          </div>
          <span className="text-xs font-sans text-fg-muted font-semibold tracking-wide">
            {activeNotice.department.toUpperCase()} • UNICAMPUS
          </span>
          <h2 className="text-xl sm:text-2xl font-semibold text-fg mt-1.5 leading-snug">
            {activeNotice.title}
          </h2>
          <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-4 mt-2.5 text-xs font-sans tabular-nums text-fg-muted">
            <span>Date: {activeNotice.dateStr} • {activeNotice.timeStr}</span>
            <span aria-hidden="true">•</span>
            <span>Session: {activeNotice.academicSession}</span>
            {activeNotice.targetAudience && (
              <>
                <span aria-hidden="true">•</span>
                <span>Target: {activeNotice.targetAudience}</span>
              </>
            )}
          </div>
        </div>

        {/* Document Body Paragraphs */}
        <div className="flex flex-col gap-4 text-xs sm:text-sm text-fg-muted leading-relaxed font-normal">
          {activeNotice.body.map((p, idx) => (
            <p key={idx} className="text-fg/90">{p}</p>
          ))}

          {/* Policy / Protocol Callout Box */}
          {activeNotice.protocols && (
            <div className="p-4 rounded-2xl bg-surface-2 border-l-4 border-brand border-t border-r border-b border-line flex flex-col gap-2">
              <span className="text-xs font-sans text-brand font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand" aria-hidden="true" />
                {activeNotice.protocols.title}
              </span>
              <ul className="list-disc list-inside text-xs sm:text-sm text-fg space-y-1.5 font-normal">
                {activeNotice.protocols.items.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Formatted Schedule Table */}
          {activeNotice.scheduleTable && (
            <div className="mt-2 flex flex-col gap-2.5">
              <span className="text-xs font-semibold text-fg">
                {activeNotice.scheduleTable.title}
              </span>

              <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-2 border-b border-line text-xs font-sans text-fg-muted">
                      {activeNotice.scheduleTable.headers.map((h, idx) => (
                        <th key={idx} className="py-2.5 px-4 font-semibold whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line text-xs sm:text-sm">
                    {activeNotice.scheduleTable.rows.map((row, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-surface-2/60 transition-colors"
                      >
                        <td className="py-3 px-4 font-semibold text-fg">
                          <span
                            className={`text-brand text-xs block ${
                              /^[A-Z]{2,}-\d+/i.test(row.code.trim())
                                ? "font-mono"
                                : "font-sans font-semibold"
                            }`}
                          >
                            {row.code}
                          </span>
                          {row.title}
                        </td>
                        <td className="py-3 px-4 text-fg-muted font-sans tabular-nums text-xs whitespace-nowrap">
                          {row.col1}
                        </td>
                        <td className="py-3 px-4 text-fg-muted font-sans tabular-nums text-xs whitespace-nowrap">
                          {row.col2}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="px-2.5 py-0.5 rounded-md bg-surface-2 border border-line text-xs font-sans tabular-nums text-fg whitespace-nowrap inline-block">
                            {row.col3}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Sign-Off Footer & Seal Verification Block */}
        <div className="mt-4 pt-6 border-t border-line flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          {/* Verification Badging */}
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 rounded-xl bg-surface-2 border border-line p-1.5 flex items-center justify-center shrink-0" aria-hidden="true">
              {/* Digital QR Code Pattern representation */}
              <div className="grid grid-cols-4 gap-0.5 w-full h-full p-1 bg-fg/10 rounded">
                <div className="bg-brand rounded-xs"></div>
                <div className="bg-brand/40 rounded-xs"></div>
                <div className="bg-brand rounded-xs"></div>
                <div className="bg-brand/20 rounded-xs"></div>
                <div className="bg-brand/30 rounded-xs"></div>
                <div className="bg-brand rounded-xs"></div>
                <div className="bg-brand/60 rounded-xs"></div>
                <div className="bg-brand rounded-xs"></div>
                <div className="bg-brand rounded-xs"></div>
                <div className="bg-brand/20 rounded-xs"></div>
                <div className="bg-brand rounded-xs"></div>
                <div className="bg-brand/50 rounded-xs"></div>
                <div className="bg-brand/40 rounded-xs"></div>
                <div className="bg-brand rounded-xs"></div>
                <div className="bg-brand/20 rounded-xs"></div>
                <div className="bg-brand rounded-xs"></div>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-sans text-success font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-success" aria-hidden="true" />
                VERIFIED OFFICIAL CIRCULAR
              </span>
              <span className="text-xs font-sans text-fg-muted">
                Office of the Controller of Examinations • Ref No.{" "}
                <span className="font-mono">{activeNotice.refNo}</span>
              </span>
            </div>
          </div>

          {/* Official Digital Signature */}
          <div className="flex flex-col items-start md:items-end">
            <div className="h-8 mb-1 flex items-end">
              <span className="font-serif italic text-brand text-lg font-semibold select-none border-b border-brand/40 pb-0.5">
                {activeNotice.author}
              </span>
            </div>
            <span className="text-xs sm:text-sm font-semibold text-fg">
              {activeNotice.author}
            </span>
            <span className="text-xs font-sans text-fg-muted">
              {activeNotice.authorDesignation}
            </span>
            <span className="text-xs font-sans text-fg-subtle">
              {activeNotice.authorCouncil}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
