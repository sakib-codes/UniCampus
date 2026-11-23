"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, CreditCard, Printer } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import {
  getIdCardStatusLabel,
  getIdCardStatusVariant,
  ID_CARD_REQUESTS_EVENT,
  idCardService,
  type IdCardRequest,
  type IdCardWorkflowStatus,
} from "@/lib/services/idCardService";

interface IdCardStatusWidgetProps {
  academicId: string;
  profileHref: string;
}

const STEPS: { key: IdCardWorkflowStatus; label: string }[] = [
  { key: "queued_for_print", label: "Queued" },
  { key: "printing", label: "Printing" },
  { key: "ready_for_pickup", label: "Ready" },
  { key: "collected", label: "Collected" },
];

function getStepIndex(status: IdCardWorkflowStatus): number {
  if (status === "payment_pending") return -1;
  return STEPS.findIndex((s) => s.key === status);
}

export function IdCardStatusWidget({
  academicId,
  profileHref,
}: IdCardStatusWidgetProps) {
  const [request, setRequest] = useState<IdCardRequest | null>(() =>
    idCardService.getLatestRequest(academicId)
  );

  useEffect(() => {
    const sync = () => {
      setRequest(idCardService.getLatestRequest(academicId));
    };
    sync();
    window.addEventListener(ID_CARD_REQUESTS_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(ID_CARD_REQUESTS_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [academicId]);

  if (!request) {
    return (
      <div className="rounded-2xl bg-surface border border-line p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-brand-soft text-brand flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-fg truncate">
              Official Academic ID Card
            </h3>
            <p className="text-xs text-fg-muted truncate">
              Download your digital portrait ID card or request physical issuance.
            </p>
          </div>
        </div>
        <Link
          href={profileHref}
          className="inline-flex items-center justify-center gap-1.5 min-h-[40px] px-3.5 py-2 rounded-xl bg-surface-2 hover:bg-surface border border-line text-xs font-semibold text-fg transition-colors shrink-0"
        >
          <span>Open ID Card</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  const activeIdx = getStepIndex(request.status);

  return (
    <div className="rounded-2xl bg-surface border border-line p-4 sm:p-5 space-y-3.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-brand-soft text-brand flex items-center justify-center shrink-0">
            <Printer className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-semibold text-fg">
                ID Card Application Status
              </h3>
              <Badge variant={getIdCardStatusVariant(request.status)}>
                {getIdCardStatusLabel(request.status)}
              </Badge>
            </div>
            <p className="text-xs text-fg-muted mt-0.5 truncate">
              {request.requestType === "reissue"
                ? `Reissue (${request.reason})`
                : "First-Time Physical Card"}{" "}
              · Req <span className="font-mono text-fg">{request.id}</span>
              {request.paymentTrxId && (
                <>
                  {" · Paid "}
                  <span className="font-mono text-fg">{request.paymentTrxId}</span>
                </>
              )}
            </p>
          </div>
        </div>

        <Link
          href={profileHref}
          className="inline-flex items-center justify-center gap-1.5 min-h-[38px] px-3 py-1.5 rounded-xl bg-surface-2 hover:bg-surface border border-line text-xs font-semibold text-fg transition-colors shrink-0 self-start sm:self-auto"
        >
          <span>View Card</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 4-Step Progress Tracker */}
      <div className="grid grid-cols-4 gap-2 pt-1">
        {STEPS.map((step, idx) => {
          const isCompleted = idx <= activeIdx;
          return (
            <div key={step.key} className="space-y-1.5">
              <div
                className={`h-1.5 rounded-full transition-colors ${
                  isCompleted ? "bg-brand" : "bg-surface-2"
                }`}
              />
              <div className="flex items-center gap-1 text-[11px] font-medium">
                {isCompleted && (
                  <CheckCircle2 className="w-3 h-3 text-brand shrink-0 hidden sm:inline" />
                )}
                <span className={isCompleted ? "text-fg" : "text-fg-muted"}>
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
