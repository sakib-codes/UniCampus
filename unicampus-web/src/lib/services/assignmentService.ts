import { CANONICAL_FACULTY, CANONICAL_STUDENT } from "@/lib/canonicalCampus";

export interface CourseAssignment {
  id: string;
  courseCode: string;
  courseTitle: string;
  title: string;
  description: string;
  type: "Assignment" | "Lab Report" | "Project Milestone";
  dueDate: string;
  maxMarks: number;
  instructorName: string;
  attachmentName?: string;
  createdAt: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  fileName: string;
  submissionLink?: string;
  notes?: string;
  submittedAt: string;
  status: "Submitted" | "Graded";
  marks?: number | null;
  feedback?: string | null;
  gradedAt?: string | null;
}

const ASSIGNMENTS_KEY = "unicampus:assignments-v1";
const SUBMISSIONS_KEY = "unicampus:assignment-submissions-v1";

const INITIAL_ASSIGNMENTS: CourseAssignment[] = [
  {
    id: "asg-cse3101-1",
    courseCode: "CSE-3101",
    courseTitle: "Design & Analysis of Algorithms",
    title: "Dynamic Programming & Shortest Paths Problem Set",
    description:
      "Solve the 5 algorithmic optimization problems (Knapsack variants, Bellman-Ford negative cycles, and Floyd-Warshall path reconstruction) with Big-O complexity proofs.",
    type: "Assignment",
    dueDate: "2026-11-28",
    maxMarks: 20,
    instructorName: CANONICAL_FACULTY.name,
    attachmentName: "CSE3101_ProblemSet_03.pdf",
    createdAt: "2026-11-15T09:00:00Z",
  },
  {
    id: "asg-cse3102-1",
    courseCode: "CSE-3102",
    courseTitle: "Algorithms Sessional Lab",
    title: "Lab Report 05: Dijkstra vs A* Pathfinding Benchmark",
    description:
      "Implement both Dijkstra and A* search on a 500x500 grid graph in C++ or Python, benchmark execution time, and attach plots + source repository link.",
    type: "Lab Report",
    dueDate: "2026-11-25",
    maxMarks: 15,
    instructorName: CANONICAL_FACULTY.name,
    attachmentName: "Lab05_Rubric.pdf",
    createdAt: "2026-11-12T14:00:00Z",
  },
  {
    id: "asg-cse3205-1",
    courseCode: "CSE-3205",
    courseTitle: "Software Engineering",
    title: "SRS Document & Domain Architecture Diagram",
    description:
      "Submit your IEEE-830 compliant Software Requirements Specification including use-case, sequence, and ER diagrams for your semester project.",
    type: "Project Milestone",
    dueDate: "2026-11-18",
    maxMarks: 25,
    instructorName: "Farhan Tanvir",
    attachmentName: "SRS_Template_v2.docx",
    createdAt: "2026-11-02T10:30:00Z",
  },
];

const INITIAL_SUBMISSIONS: AssignmentSubmission[] = [
  {
    id: "sub-1",
    assignmentId: "asg-cse3205-1",
    studentId: CANONICAL_STUDENT.studentId,
    studentName: CANONICAL_STUDENT.name,
    fileName: "Sakib_Ahmed_SRS_Final.pdf",
    submissionLink: "https://github.com/sakib360/unicampus-srs",
    notes: "Included full ERD and sequence diagrams in Section 4.",
    submittedAt: "2026-11-17T18:40:00Z",
    status: "Graded",
    marks: 23,
    feedback: "Excellent architecture diagrams and clear non-functional requirements.",
    gradedAt: "2026-11-19T11:20:00Z",
  },
  {
    id: "sub-2",
    assignmentId: "asg-cse3102-1",
    studentId: "211-15-4425",
    studentName: "Anika Tabassum",
    fileName: "Anika_Lab05_Pathfinding.pdf",
    submissionLink: "https://github.com/anika/pathfinding-bench",
    notes: "Benchmarked across 10 random obstacle densities.",
    submittedAt: "2026-11-21T20:15:00Z",
    status: "Submitted",
    marks: null,
    feedback: null,
  },
  {
    id: "sub-3",
    assignmentId: "asg-cse3101-1",
    studentId: "211-15-4426",
    studentName: "Tanvir Mahmud",
    fileName: "Tanvir_DP_Solutions.pdf",
    notes: "Completed all 5 proofs with recurrence relations.",
    submittedAt: "2026-11-22T08:30:00Z",
    status: "Submitted",
    marks: null,
    feedback: null,
  },
];

function readStore<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeStore<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event("unicampus:assignments-updated"));
  } catch {
    // ignore storage errors
  }
}

class AssignmentService {
  getAssignments(): CourseAssignment[] {
    return readStore<CourseAssignment[]>(ASSIGNMENTS_KEY, INITIAL_ASSIGNMENTS);
  }

  createAssignment(data: Omit<CourseAssignment, "id" | "createdAt">): CourseAssignment {
    const list = this.getAssignments();
    const created: CourseAssignment = {
      ...data,
      id: `asg-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    writeStore(ASSIGNMENTS_KEY, [created, ...list]);
    return created;
  }

  deleteAssignment(id: string): CourseAssignment[] {
    const updated = this.getAssignments().filter((a) => a.id !== id);
    writeStore(ASSIGNMENTS_KEY, updated);
    return updated;
  }

  getSubmissions(assignmentId?: string): AssignmentSubmission[] {
    const all = readStore<AssignmentSubmission[]>(SUBMISSIONS_KEY, INITIAL_SUBMISSIONS);
    if (!assignmentId) return all;
    return all.filter((s) => s.assignmentId === assignmentId);
  }

  submitWork(data: {
    assignmentId: string;
    studentId: string;
    studentName: string;
    fileName: string;
    submissionLink?: string;
    notes?: string;
  }): AssignmentSubmission {
    const all = this.getSubmissions();
    const existing = all.find(
      (s) => s.assignmentId === data.assignmentId && s.studentId === data.studentId
    );
    const record: AssignmentSubmission = {
      id: existing?.id || `sub-${Date.now()}`,
      assignmentId: data.assignmentId,
      studentId: data.studentId,
      studentName: data.studentName,
      fileName: data.fileName,
      submissionLink: data.submissionLink,
      notes: data.notes,
      submittedAt: new Date().toISOString(),
      status: "Submitted",
      marks: existing?.marks ?? null,
      feedback: existing?.feedback ?? null,
    };
    const next = existing
      ? all.map((s) => (s.id === existing.id ? record : s))
      : [record, ...all];
    writeStore(SUBMISSIONS_KEY, next);
    return record;
  }

  gradeSubmission(
    submissionId: string,
    marks: number,
    feedback: string
  ): AssignmentSubmission[] {
    const all = this.getSubmissions();
    const updated = all.map((s) =>
      s.id === submissionId
        ? {
            ...s,
            status: "Graded" as const,
            marks,
            feedback: feedback.trim() || "Evaluated.",
            gradedAt: new Date().toISOString(),
          }
        : s
    );
    writeStore(SUBMISSIONS_KEY, updated);
    return updated;
  }
}

export const assignmentService = new AssignmentService();
