"use client";

export type IdCardRequestType = "initial" | "reissue";

export type IdCardReissueReason =
  | "First-Time Issuance"
  | "Lost / Misplaced"
  | "Damaged / Broken"
  | "Photo or Info Update"
  | "Expired Card"
  | "Stolen (GD Attached)";

export type IdCardWorkflowStatus =
  | "payment_pending"
  | "queued_for_print"
  | "printing"
  | "ready_for_pickup"
  | "collected";

export interface IdCardRequest {
  id: string;
  academicId: string;
  fullName: string;
  role: "student" | "teacher";
  departmentCode: string;
  departmentName: string;
  section?: string;
  semesterName?: string | null;
  designation?: string | null;
  phone?: string;
  emergencyPhone?: string;
  bloodGroup?: string;
  photoUrl?: string | null;
  validThrough?: string;
  requestType: IdCardRequestType;
  reason: IdCardReissueReason;
  reasonNote?: string;
  feeAmount: number;
  paymentStatus: "free" | "pending" | "paid";
  paymentMethod?: "bKash" | "Nagad" | "SSLCommerz";
  paymentTrxId?: string;
  status: IdCardWorkflowStatus;
  createdAt: string;
  updatedAt: string;
  handledBy?: string;
}

export const ID_CARD_REQUESTS_EVENT = "unicampus:id-card-requests-updated";
const STORAGE_KEY = "unicampus_id_card_requests_v1";

export const REISSUE_REASONS: { value: IdCardReissueReason; label: string }[] = [
  { value: "Lost / Misplaced", label: "Lost / Misplaced" },
  { value: "Damaged / Broken", label: "Damaged / Broken" },
  { value: "Photo or Info Update", label: "Photo or Info Update" },
  { value: "Expired Card", label: "Expired Card" },
  { value: "Stolen (GD Attached)", label: "Stolen (GD Attached)" },
];

export const REISSUE_FEE_BDT = 500;

function readStorage(): IdCardRequest[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as IdCardRequest[]) : [];
  } catch {
    return [];
  }
}

function writeStorage(list: IdCardRequest[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent(ID_CARD_REQUESTS_EVENT));
  } catch {
    // Ignore storage quota errors
  }
}

export const idCardService = {
  getAllRequests(deptFilter?: string): IdCardRequest[] {
    const all = readStorage().sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    if (!deptFilter || deptFilter === "all") return all;
    const norm = deptFilter.toLowerCase().replace(/^dept-/, "");
    return all.filter(
      (r) =>
        r.departmentCode.toLowerCase() === norm ||
        r.departmentName.toLowerCase().includes(norm)
    );
  },

  getRequestsByAcademicId(academicId: string): IdCardRequest[] {
    if (!academicId) return [];
    return this.getAllRequests().filter(
      (r) => r.academicId.toLowerCase() === academicId.toLowerCase()
    );
  },

  getLatestRequest(academicId: string): IdCardRequest | null {
    const list = this.getRequestsByAcademicId(academicId);
    return list.length > 0 ? list[0] : null;
  },

  hasIssuedBefore(academicId: string): boolean {
    return this.getRequestsByAcademicId(academicId).length > 0;
  },

  createInitialRequest(
    payload: Omit<
      IdCardRequest,
      | "id"
      | "requestType"
      | "reason"
      | "feeAmount"
      | "paymentStatus"
      | "status"
      | "createdAt"
      | "updatedAt"
    >
  ): IdCardRequest {
    const now = new Date().toISOString();
    const record: IdCardRequest = {
      ...payload,
      id: `IDC-${Date.now().toString(36).toUpperCase()}`,
      requestType: "initial",
      reason: "First-Time Issuance",
      feeAmount: 0,
      paymentStatus: "free",
      status: "queued_for_print",
      createdAt: now,
      updatedAt: now,
    };
    const existing = readStorage();
    writeStorage([record, ...existing]);
    return record;
  },

  createReissueRequest(
    payload: Omit<
      IdCardRequest,
      | "id"
      | "requestType"
      | "feeAmount"
      | "paymentStatus"
      | "status"
      | "createdAt"
      | "updatedAt"
    > & {
      paymentMethod: "bKash" | "Nagad" | "SSLCommerz";
      paymentTrxId: string;
    }
  ): IdCardRequest {
    const now = new Date().toISOString();
    const record: IdCardRequest = {
      ...payload,
      id: `IDC-${Date.now().toString(36).toUpperCase()}`,
      requestType: "reissue",
      feeAmount: REISSUE_FEE_BDT,
      paymentStatus: "paid",
      status: "queued_for_print",
      createdAt: now,
      updatedAt: now,
    };
    const existing = readStorage();
    writeStorage([record, ...existing]);
    return record;
  },

  updateStatus(
    requestId: string,
    status: IdCardWorkflowStatus,
    handledBy?: string
  ): IdCardRequest | null {
    const list = readStorage();
    let updated: IdCardRequest | null = null;
    const next = list.map((item) => {
      if (item.id !== requestId) return item;
      updated = {
        ...item,
        status,
        handledBy: handledBy || item.handledBy,
        updatedAt: new Date().toISOString(),
      };
      return updated;
    });
    if (updated) {
      writeStorage(next);
    }
    return updated;
  },
};

export function getIdCardStatusLabel(status: IdCardWorkflowStatus): string {
  switch (status) {
    case "payment_pending":
      return "Payment Pending";
    case "queued_for_print":
      return "Queued for Print";
    case "printing":
      return "Printing in Progress";
    case "ready_for_pickup":
      return "Ready for Pickup";
    case "collected":
      return "Collected";
  }
}

export function getIdCardStatusVariant(
  status: IdCardWorkflowStatus
): "neutral" | "brand" | "warning" | "success" {
  switch (status) {
    case "payment_pending":
      return "warning";
    case "queued_for_print":
      return "brand";
    case "printing":
      return "warning";
    case "ready_for_pickup":
    case "collected":
      return "success";
  }
}
