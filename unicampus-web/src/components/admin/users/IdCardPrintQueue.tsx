"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, CreditCard, Eye, Printer } from "lucide-react";
import { Badge, Button, EmptyState, Modal } from "@/components/ui";
import { AcademicIdCard } from "@/components/common/AcademicIdCard";
import {
  getIdCardStatusLabel,
  getIdCardStatusVariant,
  ID_CARD_REQUESTS_EVENT,
  idCardService,
  type IdCardRequest,
  type IdCardWorkflowStatus,
} from "@/lib/services/idCardService";

interface IdCardPrintQueueProps {
  deptFilter: string;
  adminName: string;
  onNotify: (msg: string) => void;
}

export function IdCardPrintQueue({
  deptFilter,
  adminName,
  onNotify,
}: IdCardPrintQueueProps) {
  const [requests, setRequests] = useState<IdCardRequest[]>(() =>
    idCardService.getAllRequests(deptFilter)
  );
  const [previewReq, setPreviewReq] = useState<IdCardRequest | null>(null);

  useEffect(() => {
    const sync = () => {
      setRequests(idCardService.getAllRequests(deptFilter));
    };
    sync();
    window.addEventListener(ID_CARD_REQUESTS_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(ID_CARD_REQUESTS_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [deptFilter]);

  const handleAdvanceStatus = (
    req: IdCardRequest,
    nextStatus: IdCardWorkflowStatus
  ) => {
    idCardService.updateStatus(req.id, nextStatus, adminName);
    setRequests(idCardService.getAllRequests(deptFilter));
    onNotify(
      `ID Card ${req.academicId} updated to "${getIdCardStatusLabel(nextStatus)}".`
    );
  };

  if (requests.length === 0) {
    return (
      <div className="rounded-2xl bg-surface border border-line p-10">
        <EmptyState
          icon={<CreditCard className="w-6 h-6" />}
          title="No ID card print requests yet"
          description="When students or faculty request a new physical ID card or pay for a reissue, their department-scoped requests will appear here for printing."
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-surface border border-line overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-line bg-surface-2/60 text-fg-muted">
                <th className="py-3 px-4 font-semibold">Applicant</th>
                <th className="py-3 px-4 font-semibold">Academic ID</th>
                <th className="py-3 px-4 font-semibold">Department</th>
                <th className="py-3 px-4 font-semibold">Request &amp; Reason</th>
                <th className="py-3 px-4 font-semibold">Payment</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-surface-2/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-fg">{req.fullName}</div>
                    <div className="text-fg-muted capitalize">{req.role}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-brand whitespace-nowrap">
                    {req.academicId}
                  </td>
                  <td className="py-3.5 px-4 text-fg whitespace-nowrap">
                    {req.departmentCode}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-fg">
                      {req.requestType === "reissue" ? "Reissue" : "First Issue"} ·{" "}
                      {req.reason}
                    </div>
                    {req.reasonNote && (
                      <div className="text-fg-muted truncate max-w-[220px]">
                        {req.reasonNote}
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {req.paymentStatus === "free" ? (
                      <Badge variant="neutral">Free (First Issue)</Badge>
                    ) : (
                      <div className="space-y-0.5">
                        <Badge variant="success">
                          Paid ৳{req.feeAmount} ({req.paymentMethod})
                        </Badge>
                        {req.paymentTrxId && (
                          <div className="font-mono text-[11px] text-fg-muted">
                            {req.paymentTrxId}
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <Badge variant={getIdCardStatusVariant(req.status)}>
                      {getIdCardStatusLabel(req.status)}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        leftIcon={<Eye className="w-3.5 h-3.5" />}
                        onClick={() => setPreviewReq(req)}
                      >
                        Preview
                      </Button>

                      {req.status === "queued_for_print" && (
                        <Button
                          type="button"
                          variant="primary"
                          size="sm"
                          leftIcon={<Printer className="w-3.5 h-3.5" />}
                          onClick={() => handleAdvanceStatus(req, "printing")}
                        >
                          Start Print
                        </Button>
                      )}

                      {req.status === "printing" && (
                        <Button
                          type="button"
                          variant="primary"
                          size="sm"
                          leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                          onClick={() =>
                            handleAdvanceStatus(req, "ready_for_pickup")
                          }
                        >
                          Mark Ready
                        </Button>
                      )}

                      {req.status === "ready_for_pickup" && (
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => handleAdvanceStatus(req, "collected")}
                        >
                          Collected
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Print Preview Modal */}
      <Modal
        open={Boolean(previewReq)}
        onClose={() => setPreviewReq(null)}
        title="Print Preview — Official Academic ID Card"
        description={
          previewReq
            ? `Request ${previewReq.id} · ${previewReq.departmentName}`
            : undefined
        }
        size="md"
      >
        {previewReq && (
          <AcademicIdCard
            role={previewReq.role}
            academicId={previewReq.academicId}
            fullName={previewReq.fullName}
            departmentName={previewReq.departmentName}
            departmentCode={previewReq.departmentCode}
            photoUrl={previewReq.photoUrl}
            section={previewReq.section}
            semesterName={previewReq.semesterName}
            designation={previewReq.designation}
            bloodGroup={previewReq.bloodGroup}
            phone={previewReq.phone}
            emergencyPhone={previewReq.emergencyPhone}
            validThrough={previewReq.validThrough}
            enableIssuanceActions={false}
          />
        )}
      </Modal>
    </div>
  );
}
