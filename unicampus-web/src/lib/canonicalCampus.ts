/**
 * UniCampus Canonical Campus Data & Identity Layer
 *
 * Pure, framework-agnostic single source of truth shared across Student,
 * Teacher, and Admin portals as well as mock/service layers.
 */

export const ACTIVE_TERM = "Academic Year 2026" as const;

export const ACADEMIC_YEARS = [
  { year: 1, label: "1st Year", semesters: ["1st Semester", "2nd Semester"] as const },
  { year: 2, label: "2nd Year", semesters: ["3rd Semester", "4th Semester"] as const },
  { year: 3, label: "3rd Year", semesters: ["5th Semester", "6th Semester"] as const },
  { year: 4, label: "4th Year", semesters: ["7th Semester", "8th Semester"] as const },
] as const;

export function getAcademicYearForSemester(semester: string): string {
  const s = semester.toLowerCase();
  if (s.includes("1st") || s.includes("2nd") || s === "1" || s === "2" || s.endsWith("-1") || s.endsWith("-2")) {
    return "1st Year";
  }
  if (s.includes("3rd") || s.includes("4th") || s === "3" || s === "4" || s.endsWith("-3") || s.endsWith("-4")) {
    return "2nd Year";
  }
  if (s.includes("5th") || s.includes("6th") || s === "5" || s === "6" || s.endsWith("-5") || s.endsWith("-6")) {
    return "3rd Year";
  }
  if (s.includes("7th") || s.includes("8th") || s === "7" || s === "8" || s.endsWith("-7") || s.endsWith("-8")) {
    return "4th Year";
  }
  return "1st Year";
}

export function formatYearSemester(semester: string): string {
  return `${getAcademicYearForSemester(semester)} • ${semester}`;
}

export const CANONICAL_STUDENT = {
  id: "user-stud-1",
  name: "Sakib Ahmed",
  studentId: "211-15-4424",
  batch: "54th Batch",
  semester: "6th Semester",
  semesterId: "sem-cse-6",
  departmentId: "dept-cse",
  departmentCode: "CSE",
  departmentName: "Computer Science & Engineering",
  cgpa: 3.78,
  rank: 6,
  email: "sakib.cse@unicampus.edu",
  phone: "+880 1712-904511",
  emergencyPhone: "+880 1711-223344",
  credits: {
    completed: 96,
    active: 15,
    remaining: 33,
    total: 144,
    majorCore: { done: 60, total: 90 },
    generalElectives: { done: 20, total: 30 },
    mathScience: { done: 16, total: 24 },
  },
} as const;

export const CANONICAL_FACULTY = {
  id: "user-teach-1",
  facultyPageId: "1",
  name: "Dr. Asif Rahman",
  facultyCode: "FAC-1042",
  designation: "Associate Professor",
  departmentCode: "CSE",
  departmentName: "Computer Science & Engineering",
  office: "Room 508",
  email: "asif.rahman@unicampus.edu",
  phone: "+880 1712-345678",
  officeHours: "Mon 04:15 PM - 05:30 PM",
  courses: ["CSE-3101", "CSE-4109", "CSE-3102"],
} as const;

export const CANONICAL_CSE_HOD = {
  id: "user-teach-hod-cse",
  facultyPageId: "13",
  facultyCode: "FAC-1001",
  name: "Prof. Dr. M. Lutfar Rahman",
  designation: "Professor & Head",
  departmentId: "dept-cse",
  departmentCode: "CSE",
  departmentName: "Computer Science & Engineering",
  office: "Academic Bldg 1, Room 401",
  email: "lutfar.rahman@unicampus.edu",
  phone: "+880 1711-100401",
} as const;

export const CAMPUS_METRICS = {
  totalUsers: 5072,
  students: 4820,
  faculty: 240,
  admins: 12,
  departmentsCount: 5,
} as const;

export interface CanonicalDepartment {
  id: string;
  code: "CSE" | "EEE" | "BBA" | "PHARM" | "ENG";
  name: string;
  students: number;
  faculty: number;
  courses: number;
  hodId: string;
  hodName: string;
  deptAdminId: string | null;
  deptAdminName: string;
  deptAdminEmail: string | null;
  facultyGroup: string;
  color: string;
}

export const CANONICAL_DEPARTMENTS: readonly CanonicalDepartment[] = [
  {
    id: "dept-cse",
    code: "CSE",
    name: "Computer Science & Engineering",
    students: 1420,
    faculty: 68,
    courses: 48,
    hodId: "user-teach-hod-cse",
    hodName: "Prof. Dr. M. Lutfar Rahman",
    deptAdminId: "user-admin-dept-cse",
    deptAdminName: "Engr. Tanvir Ahmed",
    deptAdminEmail: "cse.admin@unicampus.edu",
    facultyGroup: "Faculty of Science & Information Technology",
    color: "indigo",
  },
  {
    id: "dept-eee",
    code: "EEE",
    name: "Electrical & Electronic Engineering",
    students: 1080,
    faculty: 54,
    courses: 42,
    hodId: "user-teach-2",
    hodName: "Prof. Jamal Uddin",
    deptAdminId: "user-admin-dept-eee",
    deptAdminName: "Dr. Mahbub Hasan",
    deptAdminEmail: "eee.admin@unicampus.edu",
    facultyGroup: "Faculty of Engineering & Robotics",
    color: "emerald",
  },
  {
    id: "dept-bba",
    code: "BBA",
    name: "Business Administration",
    students: 960,
    faculty: 48,
    courses: 38,
    hodId: "user-teach-3",
    hodName: "Dr. Farhana Khan",
    deptAdminId: "user-admin-dept-bba",
    deptAdminName: "Nazia Rahman, MBA",
    deptAdminEmail: "bba.admin@unicampus.edu",
    facultyGroup: "Faculty of Business & Entrepreneurship",
    color: "amber",
  },
  {
    id: "dept-pharm",
    code: "PHARM",
    name: "Department of Pharmacy",
    students: 740,
    faculty: 38,
    courses: 30,
    hodId: "user-teach-8",
    hodName: "Prof. Dr. Rezaul Karim",
    deptAdminId: null,
    deptAdminName: "Unassigned",
    deptAdminEmail: null,
    facultyGroup: "Faculty of Health & Life Sciences",
    color: "cyan",
  },
  {
    id: "dept-eng",
    code: "ENG",
    name: "Department of English",
    students: 620,
    faculty: 32,
    courses: 24,
    hodId: "user-teach-5",
    hodName: "Dr. Nusrat Jahan",
    deptAdminId: null,
    deptAdminName: "Unassigned",
    deptAdminEmail: null,
    facultyGroup: "Faculty of Humanities & Social Sciences",
    color: "rose",
  },
] as const;

export interface CanonicalCourse {
  code: string;
  title: string;
  credit: number;
  type: "Theory" | "Lab";
  semester: "6th Semester" | "7th Semester";
  instructor: string;
}

export const CANONICAL_COURSES = {
  "CSE-3101": {
    code: "CSE-3101",
    title: "Design & Analysis of Algorithms",
    credit: 3.0,
    type: "Theory",
    semester: "6th Semester",
    instructor: "Dr. Asif Rahman",
  },
  "CSE-3102": {
    code: "CSE-3102",
    title: "Algorithms Sessional Lab",
    credit: 1.5,
    type: "Lab",
    semester: "6th Semester",
    instructor: "Dr. Asif Rahman",
  },
  "CSE-3103": {
    code: "CSE-3103",
    title: "Database Management Systems",
    credit: 3.0,
    type: "Theory",
    semester: "6th Semester",
    instructor: "Dr. Tariqul Islam",
  },
  "CSE-3205": {
    code: "CSE-3205",
    title: "Software Engineering",
    credit: 3.0,
    type: "Theory",
    semester: "6th Semester",
    instructor: "Farhan Tanvir",
  },
  "CSE-3206": {
    code: "CSE-3206",
    title: "Software Engineering Lab",
    credit: 1.5,
    type: "Lab",
    semester: "6th Semester",
    instructor: "Farhan Tanvir",
  },
  "CSE-4109": {
    code: "CSE-4109",
    title: "Advanced Graph Theory & Network Flows",
    credit: 3.0,
    type: "Theory",
    semester: "7th Semester",
    instructor: "Dr. Asif Rahman",
  },
} as const satisfies Record<string, CanonicalCourse>;

export const CANONICAL_COURSES_LIST: readonly CanonicalCourse[] =
  Object.values(CANONICAL_COURSES);

export const CANONICAL_ROSTER_NAMES = [
  "Sakib Ahmed",
  "Anika Tabassum",
  "Tanvir Mahmud",
  "Zara Rahman",
  "Mahmudul Karim",
  "Nusrat Fariha",
  "Rifat Chowdhury",
  "Sabrina Mostafa",
  "Mehrin Sultana",
  "Farhan Sadik",
] as const;

export const CANONICAL_ROSTER = [
  { studentId: "211-15-4424", name: "Sakib Ahmed" },
  { studentId: "211-15-4425", name: "Anika Tabassum" },
  { studentId: "211-15-4426", name: "Tanvir Mahmud" },
  { studentId: "211-15-4427", name: "Zara Rahman" },
  { studentId: "211-15-4428", name: "Mahmudul Karim" },
  { studentId: "211-15-4429", name: "Nusrat Fariha" },
  { studentId: "211-15-4430", name: "Rifat Chowdhury" },
  { studentId: "211-15-4431", name: "Sabrina Mostafa" },
  { studentId: "211-15-4432", name: "Mehrin Sultana" },
  { studentId: "211-15-4435", name: "Farhan Sadik" },
] as const;

export const CANONICAL_TIME_SLOTS = [
  "08:30–10:00",
  "10:15–11:45",
  "11:45–01:00",
  "01:00–02:30",
  "02:45–04:45",
] as const;

export const GRADE_WEIGHTS = {
  attendance: 10,
  quiz1: 10,
  midterm: 25,
  lab: 15,
  finalExam: 40,
} as const;

export function calculateGrade(total: number): {
  letterGrade: string;
  gpa: number;
} {
  if (total >= 90) return { letterGrade: "A+", gpa: 4.0 };
  if (total >= 80) return { letterGrade: "A", gpa: 3.75 };
  if (total >= 75) return { letterGrade: "A-", gpa: 3.5 };
  if (total >= 70) return { letterGrade: "B+", gpa: 3.25 };
  if (total >= 65) return { letterGrade: "B", gpa: 3.0 };
  if (total >= 60) return { letterGrade: "C", gpa: 2.5 };
  return { letterGrade: "F", gpa: 0.0 };
}
