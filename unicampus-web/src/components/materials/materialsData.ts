export type MaterialFormat = "PDF" | "ZIP" | "PPTX" | "SQL";

export type MaterialItem = {
  id: string;
  courseCode: string;
  courseName: string;
  title: string;
  instructor: string;
  instructorAvatar?: string;
  uploadedAt: string;
  fileSize: string;
  moduleTag: string;
  format: MaterialFormat;
  downloads: number;
};

export type CourseGroup = {
  courseCode: string;
  courseName: string;
  totalFiles: number;
  modulesCount: number;
  items: MaterialItem[];
};

export const FORMAT_BADGE_CLASSES: Record<MaterialFormat, string> = {
  PDF: "bg-danger-light text-danger border-danger/25",
  ZIP: "bg-warning-light text-warning border-warning/25",
  PPTX: "bg-brand-soft text-brand border-brand/25",
  SQL: "bg-success-light text-success border-success/25",
};

export const COURSE_GROUPS: CourseGroup[] = [
  {
    courseCode: "CSE-3101",
    courseName: "Design & Analysis of Algorithms",
    totalFiles: 16,
    modulesCount: 4,
    items: [
      {
        id: "mat-alg-1",
        courseCode: "CSE-3101",
        courseName: "Design & Analysis of Algorithms",
        title: "Lecture 08: Dynamic Programming & Greedy Algorithms",
        instructor: "Dr. Asif Rahman",
        uploadedAt: "Oct 20, 2026",
        fileSize: "4.2 MB",
        moduleTag: "Module 4",
        format: "PDF",
        downloads: 84,
      },
      {
        id: "mat-alg-2",
        courseCode: "CSE-3101",
        courseName: "Design & Analysis of Algorithms",
        title: "Lab 05 Starter Code: Bellman-Ford & Floyd-Warshall Templates",
        instructor: "Tanvir Hasan",
        uploadedAt: "Oct 18, 2026",
        fileSize: "1.8 MB",
        moduleTag: "Lab Task",
        format: "ZIP",
        downloads: 62,
      },
      {
        id: "mat-alg-3",
        courseCode: "CSE-3101",
        courseName: "Design & Analysis of Algorithms",
        title: "Greedy Choice Property & Huffman Coding Reference Notes",
        instructor: "Dr. Asif Rahman",
        uploadedAt: "Oct 12, 2026",
        fileSize: "3.1 MB",
        moduleTag: "Module 3",
        format: "PDF",
        downloads: 47,
      },
    ],
  },
  {
    courseCode: "CSE-3205",
    courseName: "Software Engineering & System Design",
    totalFiles: 14,
    modulesCount: 5,
    items: [
      {
        id: "mat-se-1",
        courseCode: "CSE-3205",
        courseName: "Software Engineering & System Design",
        title: "Lecture 06: Microservices Architecture & Event-Driven Patterns",
        instructor: "Dr. Farhana Khan",
        uploadedAt: "Oct 19, 2026",
        fileSize: "6.5 MB",
        moduleTag: "Module 3",
        format: "PPTX",
        downloads: 112,
      },
      {
        id: "mat-se-2",
        courseCode: "CSE-3205",
        courseName: "Software Engineering & System Design",
        title: "2nd Year · 4th Semester Midterm Question Paper & Rubric (Solved)",
        instructor: "Dr. Farhana Khan",
        uploadedAt: "Oct 15, 2026",
        fileSize: "2.9 MB",
        moduleTag: "Past Papers Archive",
        format: "PDF",
        downloads: 145,
      },
      {
        id: "mat-se-3",
        courseCode: "CSE-3205",
        courseName: "Software Engineering & System Design",
        title: "Agile Sprint Backlog & Jira Storyboard Templates",
        instructor: "Sadia Afrin",
        uploadedAt: "Oct 14, 2026",
        fileSize: "4.0 MB",
        moduleTag: "Studio Resource",
        format: "ZIP",
        downloads: 73,
      },
    ],
  },
  {
    courseCode: "CSE-3102",
    courseName: "Database Systems & Engineering",
    totalFiles: 12,
    modulesCount: 4,
    items: [
      {
        id: "mat-db-1",
        courseCode: "CSE-3102",
        courseName: "Database Systems & Engineering",
        title: "Lecture 05: SQL Query Optimization & B-Tree Indexing",
        instructor: "Prof. Mahmudul Hasan",
        uploadedAt: "Oct 17, 2026",
        fileSize: "3.8 MB",
        moduleTag: "Module 2",
        format: "PDF",
        downloads: 98,
      },
      {
        id: "mat-db-2",
        courseCode: "CSE-3102",
        courseName: "Database Systems & Engineering",
        title: "PostgreSQL E-Commerce Schema & Seed Migrations (.SQL)",
        instructor: "Prof. Mahmudul Hasan",
        uploadedAt: "Oct 10, 2026",
        fileSize: "1.2 MB",
        moduleTag: "Lab Dataset",
        format: "SQL",
        downloads: 65,
      },
    ],
  },
];

export const COURSE_FILTER_OPTIONS = [
  { id: "all", label: "All Courses" },
  { id: "CSE-3101", label: "CSE-3101 Algorithms" },
  { id: "CSE-3205", label: "CSE-3205 Software Eng" },
  { id: "CSE-3102", label: "CSE-3102 Database" },
];

export const TYPE_FILTER_OPTIONS = [
  { id: "all", label: "All Types" },
  { id: "PDF", label: "Lecture Notes (.PDF)" },
  { id: "PPTX", label: "Slides (.PPTX)" },
  { id: "ZIP", label: "Code Archives (.ZIP)" },
  { id: "SQL", label: "Databases (.SQL)" },
];
