export interface StudentMarkEntry {
  id: string;
  studentId: string;
  name: string;
  rankBadge?: string;
  crBadge?: string;
  attendance: number; // Max 10
  quiz: number;       // Max 10
  midterm: number;    // Max 25
  lab: number;        // Max 15
  final: number;      // Max 40
  total: number;      // Max 100
  gpa: number;
  letterGrade: string;
  isFocused?: boolean;
}

export type ScoreField = "attendance" | "quiz" | "midterm" | "lab" | "final";
export type EditableScoreField = "quiz" | "midterm" | "lab" | "final";

export const COURSE_OPTIONS = [
  "CSE-3101 • Design & Analysis of Algorithms",
  "CSE-4109 • Advanced Graph Theory",
  "CSE-3102 • Algorithms Sessional Lab",
] as const;

export const SEMESTER_OPTIONS = [
  "Spring 2026 • Sec A",
  "Spring 2026 • Sec B",
  "Fall 2025 • Sec A",
] as const;

// Score limits definition (10 + 10 + 25 + 15 + 40 = 100% normalized basis)
export const LIMITS = {
  attendance: 10,
  quiz: 10,
  midterm: 25,
  lab: 15,
  final: 40,
} as const;

export const INITIAL_ROWS: StudentMarkEntry[] = [
  {
    id: "stud-1",
    studentId: "211-15-4424",
    name: "Sakib Ahmed",
    rankBadge: "Rank #6",
    attendance: 9.5,
    quiz: 9.0,
    midterm: 23.5,
    lab: 14.0,
    final: 36.5,
    total: 92.5,
    gpa: 4.0,
    letterGrade: "A+",
  },
  {
    id: "stud-2",
    studentId: "211-15-4425",
    name: "Anika Tabassum",
    crBadge: "CR Assistant",
    attendance: 10.0,
    quiz: 8.5,
    midterm: 22.0,
    lab: 13.5,
    final: 35.0,
    total: 89.0,
    gpa: 3.75,
    letterGrade: "A",
    isFocused: true,
  },
  {
    id: "stud-3",
    studentId: "211-15-4426",
    name: "Tanvir Mahmud",
    attendance: 8.5,
    quiz: 8.0,
    midterm: 20.0,
    lab: 12.5,
    final: 31.0,
    total: 80.0,
    gpa: 3.75,
    letterGrade: "A",
  },
  {
    id: "stud-4",
    studentId: "211-15-4430",
    name: "Rifat Chowdhury",
    attendance: 8.0,
    quiz: 7.5,
    midterm: 18.0,
    lab: 12.0,
    final: 28.5,
    total: 74.0,
    gpa: 3.25,
    letterGrade: "B+",
  },
  {
    id: "stud-5",
    studentId: "211-15-4432",
    name: "Mehrin Sultana",
    attendance: 9.0,
    quiz: 7.0,
    midterm: 17.5,
    lab: 11.5,
    final: 26.0,
    total: 71.0,
    gpa: 3.25,
    letterGrade: "B+",
  },
  {
    id: "stud-6",
    studentId: "211-15-4435",
    name: "Farhan Sadik",
    attendance: 7.5,
    quiz: 6.5,
    midterm: 15.0,
    lab: 10.5,
    final: 23.0,
    total: 62.5,
    gpa: 2.5,
    letterGrade: "C",
  },
  {
    id: "stud-7",
    studentId: "211-15-4427",
    name: "Zara Rahman",
    attendance: 9.0,
    quiz: 8.5,
    midterm: 21.0,
    lab: 13.0,
    final: 34.0,
    total: 85.5,
    gpa: 3.75,
    letterGrade: "A",
  },
  {
    id: "stud-8",
    studentId: "211-15-4428",
    name: "Mahmudul Karim",
    attendance: 8.0,
    quiz: 7.0,
    midterm: 19.0,
    lab: 12.0,
    final: 30.0,
    total: 76.0,
    gpa: 3.5,
    letterGrade: "A-",
  },
  {
    id: "stud-9",
    studentId: "211-15-4429",
    name: "Nusrat Fariha",
    attendance: 8.5,
    quiz: 8.0,
    midterm: 18.5,
    lab: 12.5,
    final: 29.0,
    total: 76.5,
    gpa: 3.5,
    letterGrade: "A-",
  },
  {
    id: "stud-10",
    studentId: "211-15-4431",
    name: "Sabrina Mostafa",
    attendance: 7.0,
    quiz: 6.5,
    midterm: 16.0,
    lab: 11.0,
    final: 26.5,
    total: 67.0,
    gpa: 3.0,
    letterGrade: "B",
  },
];

// Helper to compute Letter Grade and GPA based on standard university schema
export function calculateGrade(total: number): { gpa: number; letter: string } {
  if (total >= 90) return { gpa: 4.0, letter: "A+" };
  if (total >= 80) return { gpa: 3.75, letter: "A" };
  if (total >= 75) return { gpa: 3.5, letter: "A-" };
  if (total >= 70) return { gpa: 3.25, letter: "B+" };
  if (total >= 65) return { gpa: 3.0, letter: "B" };
  if (total >= 60) return { gpa: 2.5, letter: "C" };
  return { gpa: 0.0, letter: "F" };
}

// Helper for semantic grade pill styling
export function getGradeBadge(grade: string): string {
  switch (grade) {
    case "A+":
      return "bg-success-light text-success border border-success/30";
    case "A":
    case "A-":
      return "bg-brand-soft text-brand border border-brand/30";
    case "B+":
    case "B":
      return "bg-warning-light text-warning border border-warning/30";
    case "C":
    case "C+":
      return "bg-surface-2 text-fg-muted border border-line";
    case "F":
      return "bg-danger-light text-danger border border-danger/30";
    default:
      return "bg-surface-2 text-fg-muted border border-line";
  }
}
