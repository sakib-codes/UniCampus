import {
  CANONICAL_COURSES,
  CANONICAL_ROSTER,
} from "@/lib/canonicalCampus";
import { teacherService } from "@/lib/services/teacherService";

export interface TeachingSession {
  id: string;
  timeSlot: string;
  courseCode: string;
  courseTitle: string;
  section: string;
  room: string;
  enrolledCount: number;
  isNext?: boolean;
}

export interface StudentInquiry {
  id: string;
  name: string;
  studentId: string;
  courseCode: string;
  timeAgo: string;
  message: string;
  attachment?: {
    name: string;
    type: "pdf" | "medical";
  };
  hasApproveAction?: boolean;
  status?: "pending" | "approved";
}

function formatCompactRange(startTime: string, endTime: string): string {
  const startMeridiem = startTime.slice(-2);
  const endMeridiem = endTime.slice(-2);
  const startClean = startTime.replace(/\s*(AM|PM)$/i, "");
  if (startMeridiem === endMeridiem) {
    return `${startClean} - ${endTime}`;
  }
  return `${startTime} - ${endTime}`;
}

const CANONICAL_SECTION_ENROLLMENT: Record<string, number> = {
  "CSE-3101|Sec B": 48,
  "CSE-3101|Sec A": 45,
  "CSE-4109|Sec A": 36,
  "CSE-3102|Lab 4A": 45,
};

export const SCHEDULE_SESSIONS: TeachingSession[] = teacherService
  .getRoutine()
  .filter((slot) => slot.day === "Monday" && slot.type !== "Consultation")
  .map((slot) => ({
    id: slot.id,
    timeSlot: formatCompactRange(slot.startTime, slot.endTime),
    courseCode: slot.courseCode,
    courseTitle:
      CANONICAL_COURSES[slot.courseCode as keyof typeof CANONICAL_COURSES]
        ?.title ?? slot.courseTitle,
    section: slot.section,
    room: slot.room,
    enrolledCount:
      CANONICAL_SECTION_ENROLLMENT[`${slot.courseCode}|${slot.section}`] ?? 45,
    isNext: slot.courseCode === "CSE-3101" && slot.section === "Sec A",
  }));

export const TOTAL_ASSIGNED_STUDENTS = SCHEDULE_SESSIONS.reduce(
  (sum, s) => sum + s.enrolledCount,
  0
);

export const ANNOUNCEMENT_SECTION_OPTIONS = [
  {
    value: "All Sections",
    label: `All Sections (${TOTAL_ASSIGNED_STUDENTS} Assigned Students)`,
  },
  {
    value: "CSE-3101 Sec A",
    label: `CSE-3101 ${CANONICAL_COURSES["CSE-3101"].title} — Sec A (45 Students)`,
  },
  {
    value: "CSE-3101 Sec B",
    label: `CSE-3101 ${CANONICAL_COURSES["CSE-3101"].title} — Sec B (48 Students)`,
  },
  {
    value: "CSE-4109 Sec A",
    label: `CSE-4109 ${CANONICAL_COURSES["CSE-4109"].title} — Sec A (36 Students)`,
  },
  {
    value: "CSE-3102 Lab 4A",
    label: `CSE-3102 ${CANONICAL_COURSES["CSE-3102"].title} — Lab 4A (45 Students)`,
  },
];

export const INITIAL_INQUIRIES: StudentInquiry[] = [
  {
    id: "inq-1",
    name: CANONICAL_ROSTER[0].name,
    studentId: CANONICAL_ROSTER[0].studentId,
    courseCode: "CSE-3101",
    timeAgo: "12m ago",
    message: "Submitted Group 04 Heap Benchmark proposal PDF for approval.",
    attachment: {
      name: "proposal.pdf",
      type: "pdf",
    },
  },
  {
    id: "inq-2",
    name: CANONICAL_ROSTER[1].name,
    studentId: CANONICAL_ROSTER[1].studentId,
    courseCode: "CSE-3101",
    timeAgo: "45m ago",
    message: "Requesting medical leave attendance excusal for last lecture.",
    attachment: {
      name: "Medical slip",
      type: "medical",
    },
    hasApproveAction: true,
    status: "pending",
  },
  {
    id: "inq-3",
    name: CANONICAL_ROSTER[6].name,
    studentId: CANONICAL_ROSTER[6].studentId,
    courseCode: "CSE-4109",
    timeAgo: "2h ago",
    message: "Question regarding Assignment 2 NP-completeness proof reduction.",
  },
];
