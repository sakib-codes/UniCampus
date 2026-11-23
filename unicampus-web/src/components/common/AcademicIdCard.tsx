"use client";

import React, { useEffect, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  CreditCard,
  Download,
  Droplets,
  GraduationCap,
  Phone,
  Printer,
  RefreshCw,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { formatYearSemester } from "@/lib/canonicalCampus";
import {
  getIdCardStatusLabel,
  getIdCardStatusVariant,
  ID_CARD_REQUESTS_EVENT,
  idCardService,
  REISSUE_FEE_BDT,
  REISSUE_REASONS,
  type IdCardReissueReason,
  type IdCardRequest,
} from "@/lib/services/idCardService";

export interface AcademicIdCardProps {
  role: "student" | "teacher";
  academicId: string;
  fullName: string;
  departmentName: string;
  departmentCode: string;
  photoUrl?: string | null;
  section?: string | null;
  semesterName?: string | null;
  designation?: string | null;
  bloodGroup?: string;
  phone?: string;
  emergencyPhone?: string;
  dateOfBirth?: string;
  validThrough?: string;
  showPrintButton?: boolean;
  enableIssuanceActions?: boolean;
}

function getInitials(name: string): string {
  return (
    name
      .trim()
      .split(/\s+/)
      .map((p) => p[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "UC"
  );
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function BarcodeStrip({ value }: { value: string }) {
  const bars: number[] = [];
  const seed = value || "UNICAMPUS";
  for (let i = 0; i < 36; i++) {
    const code = seed.charCodeAt(i % seed.length) + i * 17;
    bars.push((code % 3) + 1);
  }
  return (
    <div
      className="flex items-stretch justify-center gap-[1.5px] h-7 w-full overflow-hidden"
      aria-hidden="true"
    >
      {bars.map((w, idx) => (
        <span
          key={idx}
          className="bg-fg/85 rounded-[0.5px]"
          style={{ width: `${w * 1.4}px`, opacity: idx % 5 === 0 ? 0.45 : 0.9 }}
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
  section,
  semesterName,
  designation,
  bloodGroup,
  phone,
  emergencyPhone,
  validThrough,
  showPrintButton = true,
  enableIssuanceActions = true,
}: AcademicIdCardProps) {
  const isStudent = role === "student";
  const validity = validThrough || (isStudent ? "2026 – 2030" : "Active Faculty");
  const resolvedSection = section || (isStudent ? "Section A" : null);
  const resolvedRoll = isStudent
    ? academicId.split("-").pop() || academicId
    : null;
  const resolvedSemester = isStudent
    ? semesterName
      ? formatYearSemester(semesterName)
      : "1st Year • 1st Semester"
    : designation || "Faculty Member";

  const [latestRequest, setLatestRequest] = useState<IdCardRequest | null>(() =>
    idCardService.getLatestRequest(academicId)
  );
  const [cardSide, setCardSide] = useState<"front" | "back">("front");
  const [reissueStep, setReissueStep] = useState<"idle" | "reason" | "payment" | "done">("idle");
  const [reissueReason, setReissueReason] = useState<IdCardReissueReason>("Lost / Misplaced");
  const [reissueNote, setReissueNote] = useState("");
  const [payMethod, setPayMethod] = useState<"bKash" | "Nagad" | "SSLCommerz">("bKash");
  const [trxId, setTrxId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const sync = () => {
      setLatestRequest(idCardService.getLatestRequest(academicId));
    };
    sync();
    void idCardService.hydrateFromSupabase().then(sync);
    const unsubRealtime = idCardService.subscribeRealtime();
    window.addEventListener(ID_CARD_REQUESTS_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      unsubRealtime();
      window.removeEventListener(ID_CARD_REQUESTS_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [academicId]);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleDownloadSvg = () => {
    const initials = getInitials(fullName);
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="1020" viewBox="0 0 640 1020">
  <rect width="640" height="1020" rx="36" fill="#FFFFFF" stroke="#E7E7F0" stroke-width="4"/>
  <path d="M0 36 Q0 0 36 0 H604 Q640 0 640 36 V240 H0 Z" fill="#605BFF"/>
  <rect x="270" y="24" width="100" height="18" rx="9" fill="#FFFFFF" opacity="0.85"/>
  <text x="320" y="96" text-anchor="middle" font-family="Inter, sans-serif" font-size="26" font-weight="700" fill="#FFFFFF">UniCampus University</text>
  <text x="320" y="128" text-anchor="middle" font-family="Inter, sans-serif" font-size="16" fill="#FFFFFF" opacity="0.88">Official ${isStudent ? "Student" : "Faculty"} Identity Card</text>
  <circle cx="320" cy="240" r="96" fill="#EEF0FF" stroke="#FFFFFF" stroke-width="10"/>
  <text x="320" y="256" text-anchor="middle" font-family="Inter, sans-serif" font-size="48" font-weight="700" fill="#605BFF">${escapeXml(initials)}</text>
  <text x="320" y="388" text-anchor="middle" font-family="Inter, sans-serif" font-size="32" font-weight="700" fill="#111118">${escapeXml(fullName)}</text>
  <text x="320" y="424" text-anchor="middle" font-family="Inter, sans-serif" font-size="18" fill="#5A5A6E">${escapeXml(departmentName)}</text>
  <rect x="190" y="448" width="260" height="44" rx="12" fill="#EEF0FF" stroke="#605BFF" stroke-opacity="0.3"/>
  <text x="320" y="477" text-anchor="middle" font-family="monospace" font-size="22" font-weight="700" fill="#605BFF">${escapeXml(academicId)}</text>
  <rect x="44" y="528" width="552" height="310" rx="20" fill="#F5F5FA" stroke="#E7E7F0"/>
  <text x="72" y="576" font-family="Inter, sans-serif" font-size="16" fill="#5A5A6E">${isStudent ? "Roll" : "Designation"}</text>
  <text x="568" y="576" text-anchor="end" font-family="Inter, sans-serif" font-size="16" font-weight="600" fill="#111118">${escapeXml(isStudent ? (resolvedRoll || academicId) : resolvedSemester)}</text>
  <text x="72" y="624" font-family="Inter, sans-serif" font-size="16" fill="#5A5A6E">${isStudent ? "Section" : "Department"}</text>
  <text x="568" y="624" text-anchor="end" font-family="Inter, sans-serif" font-size="16" font-weight="600" fill="#111118">${escapeXml(resolvedSection || departmentCode)}</text>
  <text x="72" y="672" font-family="Inter, sans-serif" font-size="16" fill="#5A5A6E">Phone</text>
  <text x="568" y="672" text-anchor="end" font-family="Inter, sans-serif" font-size="16" font-weight="600" fill="#111118">${escapeXml(phone || "N/A")}</text>
  <text x="72" y="720" font-family="Inter, sans-serif" font-size="16" fill="#5A5A6E">Blood Group</text>
  <text x="568" y="720" text-anchor="end" font-family="Inter, sans-serif" font-size="16" font-weight="600" fill="#D92D20">${escapeXml(bloodGroup || "N/A")}</text>
  <text x="72" y="768" font-family="Inter, sans-serif" font-size="16" fill="#5A5A6E">Emergency</text>
  <text x="568" y="768" text-anchor="end" font-family="Inter, sans-serif" font-size="16" font-weight="600" fill="#111118">${escapeXml(emergencyPhone || phone || "N/A")}</text>
  <text x="72" y="816" font-family="Inter, sans-serif" font-size="16" fill="#5A5A6E">Valid Through</text>
  <text x="568" y="816" text-anchor="end" font-family="Inter, sans-serif" font-size="16" font-weight="600" fill="#111118">${escapeXml(validity)}</text>
  <text x="320" y="920" text-anchor="middle" font-family="monospace" font-size="18" fill="#5A5A6E">${escapeXml(academicId)}</text>
  <text x="320" y="968" text-anchor="middle" font-family="Inter, sans-serif" font-size="16" font-weight="600" fill="#16A34A">Verified · Office of the Registrar</text>
</svg>`;
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `UniCampus-ID-${academicId}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleIssueInitial = () => {
    const req = idCardService.createInitialRequest({
      academicId,
      fullName,
      role,
      departmentCode,
      departmentName,
      section: resolvedSection || undefined,
      semesterName,
      designation,
      phone,
      emergencyPhone,
      bloodGroup,
      photoUrl,
      validThrough: validity,
    });
    setLatestRequest(req);
  };

  const handleConfirmReissuePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    const finalTrx =
      trxId.trim().toUpperCase() ||
      `${payMethod.slice(0, 3).toUpperCase()}${Date.now().toString(36).toUpperCase().slice(-7)}`;
    setTimeout(() => {
      const req = idCardService.createReissueRequest({
        academicId,
        fullName,
        role,
        departmentCode,
        departmentName,
        section: resolvedSection || undefined,
        semesterName,
        designation,
        phone,
        emergencyPhone,
        bloodGroup,
        photoUrl,
        validThrough: validity,
        reason: reissueReason,
        reasonNote: reissueNote.trim() || undefined,
        paymentMethod: payMethod,
        paymentTrxId: finalTrx,
      });
      setLatestRequest(req);
      setIsProcessing(false);
      setReissueStep("done");
      setTrxId("");
      setReissueNote("");
    }, 450);
  };

  const hasIssued = Boolean(latestRequest);
  const issueDateLabel = latestRequest
    ? new Date(latestRequest.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "12 Jan 2026";
  const expiryDateLabel = isStudent ? "31 Dec 2030" : "Active Tenure";

  return (
    <div
      className={
        enableIssuanceActions
          ? "grid grid-cols-1 md:grid-cols-[296px_1fr] gap-5 items-start w-full"
          : "space-y-4 w-full max-w-[320px] mx-auto"
      }
    >
      {/* Left Column: Front / Back Switcher + Authentic Portrait CR80 Card */}
      <div className="w-full max-w-[296px] mx-auto space-y-2.5">
        {/* Calm Segmented Front / Back Switcher */}
        <div
          role="tablist"
          aria-label="ID card side"
          className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-surface-2 border border-line print:hidden"
        >
          {(
            [
              { id: "front", label: "Front Side" },
              { id: "back", label: "Back Side" },
            ] as const
          ).map((side) => (
            <button
              key={side.id}
              type="button"
              role="tab"
              aria-selected={cardSide === side.id}
              onClick={() => setCardSide(side.id)}
              className={`h-8 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                cardSide === side.id
                  ? "bg-surface text-fg font-semibold border border-line/80 shadow-2xs"
                  : "text-fg-muted hover:text-fg"
              }`}
            >
              {side.label}
            </button>
          ))}
        </div>

        {cardSide === "front" ? (
          /* FRONT SIDE — Portrait CR80 Vertical ID Card */
          <div className="w-full rounded-[20px] bg-surface border border-line overflow-hidden shadow-sm print:shadow-none print:border-fg/30">
            {/* Top Institutional Brand Band + Lanyard Slot */}
            <div className="bg-brand text-on-brand px-4 pt-2.5 pb-10 text-center relative">
              <div
                className="w-11 h-1.5 rounded-full bg-surface/90 mx-auto mb-2.5 shadow-inner"
                aria-hidden="true"
              />
              <div className="flex items-center justify-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-on-brand shrink-0" />
                <span className="text-xs font-semibold tracking-tight">
                  UniCampus University
                </span>
              </div>
              <div className="mt-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-white/18 text-[10px] font-semibold uppercase tracking-wider">
                  {isStudent ? "Official Student ID" : "Official Faculty ID"}
                </span>
              </div>
            </div>

            {/* Overlapping Circular Photo Avatar */}
            <div className="-mt-9 flex justify-center relative z-10">
              <div className="w-20 h-20 rounded-full bg-brand-soft border-4 border-surface shadow-sm overflow-hidden flex items-center justify-center">
                {photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photoUrl}
                    alt={fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xl font-semibold text-brand tracking-tight">
                    {getInitials(fullName)}
                  </span>
                )}
              </div>
            </div>

            {/* Portrait Identity Core */}
            <div className="px-4 pt-2.5 pb-4 space-y-3 text-center">
              <div className="space-y-0.5">
                <h3 className="text-base font-semibold text-fg tracking-tight leading-snug">
                  {fullName}
                </h3>
                <p className="text-xs text-fg-muted font-medium truncate">
                  {departmentName}
                </p>
                <div className="pt-1 flex items-center justify-center">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-soft border border-brand/25">
                    <span className="text-[11px] font-medium text-fg-muted">
                      {isStudent ? "ID" : "Code"}
                    </span>
                    <span className="font-mono text-xs font-semibold text-brand">
                      {academicId}
                    </span>
                  </span>
                </div>
              </div>

              {/* Structured Portrait Metadata Table (uniform vertical rhythm) */}
              <div className="rounded-xl bg-surface-2 border border-line px-3 py-1.5 text-left text-xs divide-y divide-line">
                {!isStudent && (
                  <div className="flex items-center justify-between gap-2 py-1.5">
                    <span className="text-fg-muted">Designation</span>
                    <span className="font-semibold text-fg text-right truncate">
                      {resolvedSemester}
                    </span>
                  </div>
                )}

                {resolvedSection && (
                  <div className="flex items-center justify-between gap-2 py-1.5">
                    <span className="text-fg-muted">Section</span>
                    <span className="font-semibold text-fg">{resolvedSection}</span>
                  </div>
                )}

                {isStudent && resolvedRoll && (
                  <div className="flex items-center justify-between gap-2 py-1.5">
                    <span className="text-fg-muted">Roll</span>
                    <span className="font-mono font-semibold text-fg">{resolvedRoll}</span>
                  </div>
                )}

                {phone && (
                  <div className="flex items-center justify-between gap-2 py-1.5">
                    <span className="text-fg-muted inline-flex items-center gap-1">
                      <Phone className="w-3 h-3 text-fg-subtle" />
                      Phone
                    </span>
                    <span className="font-medium text-fg tabular-nums">{phone}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 py-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Droplets className="w-3.5 h-3.5 text-danger shrink-0" />
                    <span className="text-fg-muted">Blood:</span>
                    <strong className="text-fg truncate">{bloodGroup || "N/A"}</strong>
                  </div>
                  <div className="flex items-center justify-end gap-1.5 min-w-0">
                    <Calendar className="w-3.5 h-3.5 text-brand shrink-0" />
                    <strong className="text-fg tabular-nums truncate">{validity}</strong>
                  </div>
                </div>

                {emergencyPhone && (
                  <div className="flex items-center justify-between gap-2 py-1.5">
                    <span className="text-fg-muted">Emergency</span>
                    <span className="font-medium text-fg tabular-nums">
                      {emergencyPhone}
                    </span>
                  </div>
                )}
              </div>

              {/* Barcode & Registrar Verification Footer */}
              <div className="pt-2 border-t border-line space-y-1">
                <BarcodeStrip value={academicId} />
                <div className="flex items-center justify-between text-[11px] text-fg-muted pt-0.5">
                  <span className="font-mono">{academicId}</span>
                  <span className="inline-flex items-center gap-1 text-success font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Registrar Verified
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* BACK SIDE — Official Registry, Issue/Expiry, Stolen Return Notice & Campus Address */
          <div className="w-full rounded-[20px] bg-surface border border-line overflow-hidden shadow-sm print:shadow-none print:border-fg/30 flex flex-col">
            {/* Top Lanyard Slot & Magnetic Strip */}
            <div className="pt-3 pb-2.5 bg-surface">
              <div
                className="w-11 h-1.5 rounded-full bg-surface-2 border border-line mx-auto mb-3"
                aria-hidden="true"
              />
              <div className="h-7 w-full bg-fg/90 dark:bg-black/80" aria-hidden="true" />
            </div>

            <div className="px-4 pt-3 pb-4 space-y-3 text-left flex-1">
              {/* Issue & Expiry Dates */}
              <div className="rounded-xl bg-surface-2 border border-line px-3 py-1.5 text-xs divide-y divide-line">
                <div className="flex items-center justify-between gap-2 py-1.5">
                  <span className="text-fg-muted">Issue Date</span>
                  <span className="font-semibold text-fg tabular-nums">
                    {issueDateLabel}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 py-1.5">
                  <span className="text-fg-muted">Expiry Date</span>
                  <span className="font-semibold text-fg tabular-nums">
                    {expiryDateLabel}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 py-1.5">
                  <span className="text-fg-muted">Emergency</span>
                  <span className="font-medium text-fg tabular-nums">
                    {emergencyPhone || phone || "+880 9612-800900"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 py-1.5">
                  <span className="text-fg-muted">Blood Group</span>
                  <span className="font-semibold text-danger">
                    {bloodGroup || "N/A"}
                  </span>
                </div>
              </div>

              {/* Lost / Stolen Return Notice */}
              <div className="rounded-xl bg-canvas border border-line p-3 space-y-1">
                <p className="text-[11px] font-semibold text-fg uppercase tracking-wider">
                  Lost or Stolen Notice
                </p>
                <p className="text-[11px] text-fg-muted leading-relaxed">
                  This card is the property of UniCampus University and is
                  non-transferable. If found, please return it to the Office of
                  the Registrar or nearest Campus Security Desk.
                </p>
              </div>

              {/* Campus Address & Registrar Contact */}
              <div className="space-y-1 text-[11px] text-fg-muted px-0.5">
                <p className="font-semibold text-fg">UniCampus University</p>
                <p className="leading-snug">
                  Main Campus, Birulia, Savar, Dhaka-1216, Bangladesh
                </p>
                <p className="tabular-nums">
                  registrar@unicampus.edu · +880 9612-800900
                </p>
              </div>

              {/* Registrar Signature & Barcode */}
              <div className="pt-2 border-t border-line space-y-2">
                <div className="flex items-end justify-between gap-2">
                  <div className="space-y-0.5">
                    <p className="text-xs italic font-semibold text-fg/80">
                      Prof. A. K. M. Karim
                    </p>
                    <p className="text-[10px] text-fg-muted border-t border-line pt-0.5">
                      Authorized Registrar Signature
                    </p>
                  </div>
                  <span className="font-mono text-[11px] text-fg-muted">
                    {academicId}
                  </span>
                </div>
                <BarcodeStrip value={`REG-${academicId}`} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Column (Desktop) / Below Card (Mobile): Actions, Status & Reissue Panel */}
      <div className="space-y-3.5 print:hidden">
        {enableIssuanceActions && (
          <div className="rounded-xl bg-surface-2 border border-line p-4 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-fg">
                Physical Card Status
              </span>
              {latestRequest ? (
                <Badge variant={getIdCardStatusVariant(latestRequest.status)}>
                  {getIdCardStatusLabel(latestRequest.status)}
                </Badge>
              ) : (
                <Badge variant="neutral">Not Issued Yet</Badge>
              )}
            </div>

            {latestRequest ? (
              <div className="text-xs text-fg-muted space-y-1">
                <p className="font-medium text-fg">
                  {latestRequest.requestType === "reissue"
                    ? `Reissue · ${latestRequest.reason}`
                    : "First-Time Physical ID Card"}
                </p>
                <p className="text-[11px]">
                  Req <span className="font-mono text-fg">{latestRequest.id}</span>
                  {latestRequest.paymentTrxId && (
                    <>
                      {" · Trx "}
                      <span className="font-mono text-fg">
                        {latestRequest.paymentTrxId}
                      </span>
                    </>
                  )}
                </p>
              </div>
            ) : (
              <p className="text-xs text-fg-muted leading-relaxed">
                First physical card issuance is free. Once issued, replacements
                can be requested with a ৳{REISSUE_FEE_BDT} reissue fee.
              </p>
            )}
          </div>
        )}

        {/* Reissue Flow: Step 1 (Reason) -> Step 2 (Payment) -> Done */}
        {enableIssuanceActions && reissueStep === "reason" && (
          <div className="rounded-xl bg-surface-2 border border-line p-4 space-y-3 text-left">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-fg">Reissue ID Card</h4>
              <Badge variant="warning">Fee: ৳{REISSUE_FEE_BDT}</Badge>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-fg-muted">
                Reason for Reissue
              </label>
              <Select
                ariaLabel="Reason for Reissue"
                value={reissueReason}
                onChange={(v) => setReissueReason(v as IdCardReissueReason)}
                options={REISSUE_REASONS}
                size="md"
                variant="surface"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-fg-muted">
                Additional Note (Optional)
              </label>
              <input
                type="text"
                value={reissueNote}
                onChange={(e) => setReissueNote(e.target.value)}
                placeholder="e.g. Lost near Central Library or GD #4021"
                className="w-full h-11 px-3 rounded-xl bg-surface border border-line text-sm text-fg placeholder:text-fg-muted outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
              />
            </div>
            <div className="flex items-center gap-2 pt-1">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={() => setReissueStep("idle")}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                size="md"
                leftIcon={<Wallet className="w-4 h-4" />}
                onClick={() => setReissueStep("payment")}
                className="flex-1"
              >
                Pay ৳{REISSUE_FEE_BDT}
              </Button>
            </div>
          </div>
        )}

        {enableIssuanceActions && reissueStep === "payment" && (
          <form
            onSubmit={handleConfirmReissuePayment}
            className="rounded-xl bg-surface-2 border border-line p-4 space-y-3 text-left"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-fg">
                Reissue Fee Payment
              </h4>
              <span className="text-sm font-semibold text-brand tabular-nums">
                ৳{REISSUE_FEE_BDT}
              </span>
            </div>
            <p className="text-xs text-fg-muted">
              Reason: <strong className="text-fg">{reissueReason}</strong>. After
              payment, your department admin will receive this card in the Print
              Queue.
            </p>

            <div className="grid grid-cols-3 gap-1.5">
              {(["bKash", "Nagad", "SSLCommerz"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setPayMethod(m)}
                  className={`h-10 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                    payMethod === m
                      ? "bg-surface text-fg border-brand ring-2 ring-brand/15"
                      : "bg-surface/60 text-fg-muted border-line hover:text-fg"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-fg-muted">
                Transaction ID (leave blank for Sandbox auto-pay)
              </label>
              <input
                type="text"
                value={trxId}
                onChange={(e) => setTrxId(e.target.value)}
                placeholder="e.g. BKS8K29LM1"
                className="w-full h-11 px-3 rounded-xl bg-surface border border-line font-mono text-sm text-fg placeholder:text-fg-muted outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={() => setReissueStep("reason")}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isProcessing}
                className="flex-1"
              >
                {isProcessing ? "Verifying…" : `Confirm ৳${REISSUE_FEE_BDT}`}
              </Button>
            </div>
          </form>
        )}

        {enableIssuanceActions && reissueStep === "done" && (
          <div className="rounded-xl bg-success-light border border-success/25 p-3.5 flex items-start gap-2.5 text-left text-xs">
            <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-semibold text-fg">
                Payment verified &amp; sent to Admin Print Queue
              </p>
              <p className="text-fg-muted">
                Track printing &amp; pickup status live from your Dashboard.
              </p>
            </div>
          </div>
        )}

        {/* Primary Action Buttons (always visible above the fold) */}
        {showPrintButton && (
          <div className="space-y-2.5">
            {enableIssuanceActions && reissueStep === "idle" && (
              !hasIssued ? (
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={handleIssueInitial}
                  leftIcon={<CreditCard className="w-4 h-4" />}
                >
                  Issue Physical ID Card (Free)
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={() => setReissueStep("reason")}
                  leftIcon={<RefreshCw className="w-4 h-4" />}
                >
                  Reissue ID Card (৳{REISSUE_FEE_BDT})
                </Button>
              )
            )}

            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={handleDownloadSvg}
                leftIcon={<Download className="w-4 h-4" />}
              >
                Download
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={handlePrint}
                leftIcon={<Printer className="w-4 h-4" />}
              >
                Print
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
