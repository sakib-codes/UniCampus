import {
  ADVISING_OFFERINGS,
  type SelectedRegistrationItem,
} from "@/components/advising/advisingData";
import { CANONICAL_FACULTY, CANONICAL_STUDENT } from "@/lib/canonicalCampus";

export type AdvisingStatus = "draft" | "submitted" | "approved" | "revision_requested";

export interface AdvisingSubmissionRecord {
  id: string;
  studentId: string;
  studentName: string;
  departmentCode: string;
  semesterName: string;
  cgpa: number;
  maxCredits: number;
  items: SelectedRegistrationItem[];
  status: AdvisingStatus;
  submittedAt: string;
  reviewedAt?: string | null;
  reviewedBy?: string | null;
  advisorNote?: string | null;
}

const STORAGE_KEY = "unicampus:advising-submissions-v1";
const LEGACY_STUDENT_KEY = "unicampus:course-advising";

const INITIAL_SUBMISSIONS: AdvisingSubmissionRecord[] = [
  {
    id: "adv-211-15-4425",
    studentId: "211-15-4425",
    studentName: "Anika Tabassum",
    departmentCode: "CSE",
    semesterName: "7th Semester",
    cgpa: 3.86,
    maxCredits: 24.0,
    items: [
      { courseCode: "CSE-4101", sectionId: "cse-4101-sec-a", addedAt: "2026-11-20T09:15:00Z" },
      { courseCode: "CSE-4102", sectionId: "cse-4102-sec-a", addedAt: "2026-11-20T09:16:00Z" },
      { courseCode: "CSE-4109", sectionId: "cse-4109-sec-a", addedAt: "2026-11-20T09:17:00Z" },
      { courseCode: "CSE-4111", sectionId: "cse-4111-sec-a", addedAt: "2026-11-20T09:18:00Z" },
      { courseCode: "CSE-4215", sectionId: "cse-4215-sec-a", addedAt: "2026-11-20T09:20:00Z" },
    ],
    status: "submitted",
    submittedAt: "2026-11-20T09:25:00Z",
    advisorNote: null,
  },
  {
    id: "adv-211-15-4426",
    studentId: "211-15-4426",
    studentName: "Tanvir Mahmud",
    departmentCode: "CSE",
    semesterName: "7th Semester",
    cgpa: 3.52,
    maxCredits: 21.0,
    items: [
      { courseCode: "CSE-4101", sectionId: "cse-4101-sec-b", addedAt: "2026-11-21T11:00:00Z" },
      { courseCode: "CSE-4102", sectionId: "cse-4102-sec-a", addedAt: "2026-11-21T11:02:00Z" },
      { courseCode: "CSE-4109", sectionId: "cse-4109-sec-a", addedAt: "2026-11-21T11:05:00Z" },
      { courseCode: "ACT-2101", sectionId: "act-2101-sec-a", addedAt: "2026-11-21T11:10:00Z" },
    ],
    status: "submitted",
    submittedAt: "2026-11-21T11:12:00Z",
    advisorNote: null,
  },
  {
    id: "adv-211-15-4427",
    studentId: "211-15-4427",
    studentName: "Zara Rahman",
    departmentCode: "CSE",
    semesterName: "7th Semester",
    cgpa: 3.91,
    maxCredits: 24.0,
    items: [
      { courseCode: "CSE-4101", sectionId: "cse-4101-sec-a", addedAt: "2026-11-19T14:00:00Z" },
      { courseCode: "CSE-4102", sectionId: "cse-4102-sec-a", addedAt: "2026-11-19T14:01:00Z" },
      { courseCode: "CSE-4109", sectionId: "cse-4109-sec-a", addedAt: "2026-11-19T14:02:00Z" },
      { courseCode: "CSE-4111", sectionId: "cse-4111-sec-a", addedAt: "2026-11-19T14:03:00Z" },
    ],
    status: "approved",
    submittedAt: "2026-11-19T14:10:00Z",
    reviewedAt: "2026-11-19T16:30:00Z",
    reviewedBy: CANONICAL_FACULTY.name,
    advisorNote: "Balanced credit load and all prerequisites verified.",
  },
];

function readSubmissions(): AdvisingSubmissionRecord[] {
  if (typeof window === "undefined") return INITIAL_SUBMISSIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_SUBMISSIONS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_SUBMISSIONS;
  } catch {
    return INITIAL_SUBMISSIONS;
  }
}

function writeSubmissions(records: AdvisingSubmissionRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    window.dispatchEvent(new Event("unicampus:advising-updated"));
  } catch {
    // ignore storage quota errors
  }
}

export function calculateSubmissionCredits(items: SelectedRegistrationItem[]): number {
  return items.reduce((sum, item) => {
    const course = ADVISING_OFFERINGS.find((c) => c.code === item.courseCode);
    return sum + (course?.credits || 0);
  }, 0);
}

class AdvisingService {
  getSubmissions(): AdvisingSubmissionRecord[] {
    return readSubmissions();
  }

  getStudentSubmission(studentId: string = CANONICAL_STUDENT.studentId): AdvisingSubmissionRecord | null {
    return readSubmissions().find((s) => s.studentId === studentId) ?? null;
  }

  upsertStudentPlan(
    items: SelectedRegistrationItem[],
    status: AdvisingStatus,
    studentMeta?: { studentId?: string; studentName?: string; cgpa?: number }
  ): AdvisingSubmissionRecord {
    const studentId = studentMeta?.studentId || CANONICAL_STUDENT.studentId;
    const studentName = studentMeta?.studentName || CANONICAL_STUDENT.name;
    const cgpa = studentMeta?.cgpa ?? CANONICAL_STUDENT.cgpa;
    const all = readSubmissions();
    const existing = all.find((r) => r.studentId === studentId);

    const record: AdvisingSubmissionRecord = {
      id: existing?.id || `adv-${studentId}`,
      studentId,
      studentName,
      departmentCode: CANONICAL_STUDENT.departmentCode,
      semesterName: "7th Semester",
      cgpa,
      maxCredits: cgpa >= 3.75 ? 24.0 : 21.0,
      items,
      status,
      submittedAt: status === "submitted" ? new Date().toISOString() : existing?.submittedAt || new Date().toISOString(),
      reviewedAt: status === "submitted" || status === "draft" ? null : existing?.reviewedAt,
      reviewedBy: status === "submitted" || status === "draft" ? null : existing?.reviewedBy,
      advisorNote: status === "submitted" ? null : existing?.advisorNote,
    };

    const next = existing
      ? all.map((r) => (r.studentId === studentId ? record : r))
      : [record, ...all];
    writeSubmissions(next);

    // Keep legacy key in sync
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(LEGACY_STUDENT_KEY, JSON.stringify({ items, status }));
      } catch {
        // ignore
      }
    }
    return record;
  }

  approveSubmission(
    submissionId: string,
    advisorName: string = CANONICAL_FACULTY.name,
    note?: string
  ): AdvisingSubmissionRecord[] {
    const all = readSubmissions();
    const updated = all.map((r) =>
      r.id === submissionId
        ? {
            ...r,
            status: "approved" as const,
            reviewedAt: new Date().toISOString(),
            reviewedBy: advisorName,
            advisorNote: note?.trim() || "Approved by Faculty Advisor. Courses enrolled.",
          }
        : r
    );
    writeSubmissions(updated);
    return updated;
  }

  requestRevision(
    submissionId: string,
    note: string,
    advisorName: string = CANONICAL_FACULTY.name
  ): AdvisingSubmissionRecord[] {
    const all = readSubmissions();
    const updated = all.map((r) =>
      r.id === submissionId
        ? {
            ...r,
            status: "revision_requested" as const,
            reviewedAt: new Date().toISOString(),
            reviewedBy: advisorName,
            advisorNote: note.trim() || "Please adjust your course selection and resubmit.",
          }
        : r
    );
    writeSubmissions(updated);
    return updated;
  }
}

export const advisingService = new AdvisingService();
