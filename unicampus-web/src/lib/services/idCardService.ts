"use client";

import { getSupabaseClient } from "@/lib/supabase/client";

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
  userId?: string;
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

interface DbIdCardRow {
  id: string;
  user_id: string | null;
  academic_id: string;
  full_name: string;
  role: "student" | "teacher";
  department_code: string;
  department_name: string;
  section: string | null;
  semester_name: string | null;
  designation: string | null;
  phone: string | null;
  emergency_phone: string | null;
  blood_group: string | null;
  photo_url: string | null;
  valid_through: string | null;
  request_type: IdCardRequestType;
  reason: IdCardReissueReason;
  reason_note: string | null;
  fee_amount: number;
  payment_status: "free" | "pending" | "paid";
  payment_method: "bKash" | "Nagad" | "SSLCommerz" | null;
  payment_trx_id: string | null;
  status: IdCardWorkflowStatus;
  handled_by: string | null;
  created_at: string;
  updated_at: string;
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

export const ID_CARD_STATUS_OPTIONS: {
  value: IdCardWorkflowStatus;
  label: string;
}[] = [
  { value: "queued_for_print", label: "Queued for Print" },
  { value: "printing", label: "Printing in Progress" },
  { value: "ready_for_pickup", label: "Ready for Pickup" },
  { value: "collected", label: "Collected" },
];

export const REISSUE_FEE_BDT = 500;

function mapRowToRequest(row: DbIdCardRow): IdCardRequest {
  return {
    id: row.id,
    userId: row.user_id || undefined,
    academicId: row.academic_id,
    fullName: row.full_name,
    role: row.role,
    departmentCode: row.department_code,
    departmentName: row.department_name,
    section: row.section || undefined,
    semesterName: row.semester_name,
    designation: row.designation,
    phone: row.phone || undefined,
    emergencyPhone: row.emergency_phone || undefined,
    bloodGroup: row.blood_group || undefined,
    photoUrl: row.photo_url,
    validThrough: row.valid_through || undefined,
    requestType: row.request_type,
    reason: row.reason,
    reasonNote: row.reason_note || undefined,
    feeAmount: row.fee_amount,
    paymentStatus: row.payment_status,
    paymentMethod: row.payment_method || undefined,
    paymentTrxId: row.payment_trx_id || undefined,
    status: row.status,
    handledBy: row.handled_by || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

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

let realtimeSubscribed = false;

export const idCardService = {
  /** Hydrate live ID card requests from Supabase Postgres into local cache and broadcast update */
  async hydrateFromSupabase(): Promise<IdCardRequest[]> {
    const client = getSupabaseClient();
    if (!client) return readStorage();

    try {
      const { data, error } = await client
        .from("id_card_requests")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);

      if (error || !data) return readStorage();

      const mapped = (data as DbIdCardRow[]).map(mapRowToRequest);
      writeStorage(mapped);
      return mapped;
    } catch {
      return readStorage();
    }
  },

  /** Subscribe once to Supabase Realtime changes on id_card_requests so Admin updates appear live on Student/Teacher portals */
  subscribeRealtime(): () => void {
    const client = getSupabaseClient();
    if (!client || realtimeSubscribed) return () => {};

    realtimeSubscribed = true;
    const channel = client
      .channel("unicampus-id-card-requests-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "id_card_requests" },
        () => {
          void this.hydrateFromSupabase();
        }
      )
      .subscribe();

    return () => {
      realtimeSubscribed = false;
      void client.removeChannel(channel);
    };
  },

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

    // Persist asynchronously to live Supabase when connected
    void this._persistInsert(record);
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

    void this._persistInsert(record);
    return record;
  },

  updateStatus(
    requestId: string,
    status: IdCardWorkflowStatus,
    handledBy?: string
  ): IdCardRequest | null {
    const now = new Date().toISOString();
    const list = readStorage();
    let updated: IdCardRequest | null = null;
    const next = list.map((item) => {
      if (item.id !== requestId) return item;
      updated = {
        ...item,
        status,
        handledBy: handledBy || item.handledBy,
        updatedAt: now,
      };
      return updated;
    });
    if (updated) {
      writeStorage(next);
      void this._persistStatusUpdate(requestId, status, handledBy, now);
    }
    return updated;
  },

  async _persistInsert(record: IdCardRequest): Promise<void> {
    const client = getSupabaseClient();
    if (!client) return;
    try {
      const {
        data: { user },
      } = await client.auth.getUser();
      await client.from("id_card_requests").insert({
        id: record.id,
        user_id: user?.id ?? null,
        academic_id: record.academicId,
        full_name: record.fullName,
        role: record.role,
        department_code: record.departmentCode,
        department_name: record.departmentName,
        section: record.section ?? null,
        semester_name: record.semesterName ?? null,
        designation: record.designation ?? null,
        phone: record.phone ?? null,
        emergency_phone: record.emergencyPhone ?? null,
        blood_group: record.bloodGroup ?? null,
        photo_url: record.photoUrl ?? null,
        valid_through: record.validThrough ?? null,
        request_type: record.requestType,
        reason: record.reason,
        reason_note: record.reasonNote ?? null,
        fee_amount: record.feeAmount,
        payment_status: record.paymentStatus,
        payment_method: record.paymentMethod ?? null,
        payment_trx_id: record.paymentTrxId ?? null,
        status: record.status,
        handled_by: record.handledBy ?? null,
        created_at: record.createdAt,
        updated_at: record.updatedAt,
      });
    } catch {
      // Local fallback already persisted
    }
  },

  async _persistStatusUpdate(
    requestId: string,
    status: IdCardWorkflowStatus,
    handledBy: string | undefined,
    updatedAt: string
  ): Promise<void> {
    const client = getSupabaseClient();
    if (!client) return;
    try {
      await client
        .from("id_card_requests")
        .update({
          status,
          handled_by: handledBy ?? null,
          updated_at: updatedAt,
        })
        .eq("id", requestId);
    } catch {
      // Local fallback already persisted
    }
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
