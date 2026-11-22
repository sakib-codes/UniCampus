export const DEFAULT_BASE_URL = "http://localhost:3000";

export const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

export const THEMES = ["light", "dark"];

/**
 * All 33 Next.js page routes (with /notices/[id] exercised at both /notices/1
 * and /notices/not-exam-108, totaling 34 concrete route targets).
 */
export const ROUTE_TARGETS = [
  { path: "/", portal: "public" },
  { path: "/splash", portal: "public" },
  { path: "/login", portal: "public" },
  { path: "/register", portal: "public" },

  { path: "/student", portal: "student", expectedFinalPath: "/dashboard" },
  { path: "/dashboard", portal: "student" },
  { path: "/dashboard/progress", portal: "student" },
  { path: "/routine", portal: "student" },
  { path: "/notices", portal: "student" },
  { path: "/notices/1", portal: "student" },
  { path: "/notices/not-exam-108", portal: "student" },
  { path: "/students", portal: "student" },
  { path: "/teachers", portal: "student" },
  { path: "/teachers/1", portal: "student" },
  { path: "/materials", portal: "student" },
  { path: "/messages", portal: "student" },
  { path: "/profile", portal: "student" },
  { path: "/settings", portal: "student" },

  { path: "/teacher", portal: "teacher", expectedFinalPath: "/teacher/dashboard" },
  { path: "/teacher/dashboard", portal: "teacher" },
  { path: "/teacher/attendance", portal: "teacher" },
  { path: "/teacher/grades", portal: "teacher" },
  { path: "/teacher/routine", portal: "teacher" },
  { path: "/teacher/materials", portal: "teacher" },
  { path: "/teacher/notices", portal: "teacher" },

  { path: "/admin", portal: "admin", expectedFinalPath: "/admin/dashboard" },
  { path: "/admin/dashboard", portal: "admin" },
  { path: "/admin/users", portal: "admin" },
  { path: "/admin/routine", portal: "admin" },
  { path: "/admin/departments", portal: "admin" },
  { path: "/admin/notices", portal: "admin" },
  { path: "/admin/finance", portal: "admin" },
  { path: "/admin/analytics", portal: "admin" },
  { path: "/admin/settings", portal: "admin" },
];

export const PORTAL_ORDER = ["public", "student", "teacher", "admin"];

export const CANONICAL = {
  term: "Academic Year 2026",
  student: {
    name: "Sakib Ahmed",
    id: "211-15-4424",
    batch: "54th Batch",
    semester: "6th Semester",
    creditsTotal: 144,
    creditsCompleted: 96,
    creditsActive: 15,
    creditsRemaining: 33,
  },
  faculty: {
    name: "Dr. Asif Rahman",
    room: "Room 508",
  },
  cseHod: "Prof. Dr. M. Lutfar Rahman",
  departments: [
    { code: "CSE", students: "1,420" },
    { code: "EEE", students: "1,080" },
    { code: "BBA", students: "960" },
    { code: "PHARM", students: "740" },
    { code: "ENG", students: "620" },
  ],
  totalStudents: "4,820",
  totalUsers: "5,072",
  forbiddenUsersCount: "5,060",
  financeTotals: ["৳143,500", "৳327,000", "৳115,000"],
  forbiddenFinanceTotals: ["৳143500", "৳327000", "৳115000"],
  analyticsDeptTicks: ["CSE", "EEE", "BBA", "PHARM", "ENG"],
};

export const AI_CLICHES = [
  "with zero setup friction",
  "Elevate your university experience today",
  "Modern University Operating System",
  "Live Syncing",
  "Executive institutional intelligence",
];

export const SETTINGS_FORBIDDEN_JARGON = [
  "#0B0B10",
  "#15151D",
  "#F5F5FA",
  "#605BFF",
  "UI design tokens",
  "Core Engine",
  "Developer Sandbox",
  "Supabase",
  "RLS Active",
  ".env.local",
  "NEXT_PUBLIC_SUPABASE_",
  "Test Gate",
];

export const DEAD_TAILWIND_V3_CLASSES = [
  "animate-in",
  "fade-in",
  "zoom-in-95",
];
