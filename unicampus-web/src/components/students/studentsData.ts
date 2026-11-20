export type StudentAvatarTone = "brand" | "success" | "warning" | "danger" | "info" | "neutral";

export type Student = {
  id: string;
  name: string;
  studentId: string;
  semester: string;
  section: string;
  department: string;
  skills: string[];
  isActive: boolean;
  activeStatusText: string;
  avatarTone: StudentAvatarTone;
};

export const AVATAR_TONE_CLASSES: Record<StudentAvatarTone, string> = {
  brand: "bg-brand-soft text-brand border-brand/30",
  success: "bg-success-light text-success border-success/30",
  warning: "bg-warning-light text-warning border-warning/30",
  danger: "bg-danger-light text-danger border-danger/30",
  info: "bg-info-light text-info border-info/30",
  neutral: "bg-surface-2 text-fg-muted border-line",
};

export const STUDENTS_DATA: Student[] = [
  {
    id: "1",
    name: "Nusrat Jahan",
    studentId: "211-15-4425",
    semester: "6th Sem",
    section: "Sec A",
    department: "CSE",
    skills: ["Section A", "Robotics Club", "Study Group 1"],
    isActive: true,
    activeStatusText: "Active 2m ago",
    avatarTone: "brand",
  },
  {
    id: "2",
    name: "Tanvir Mahmud",
    studentId: "211-15-4412",
    semester: "6th Sem",
    section: "Sec A",
    department: "CSE",
    skills: ["Section A", "Study Group 3", "ACM Chapter"],
    isActive: true,
    activeStatusText: "Active now",
    avatarTone: "info",
  },
  {
    id: "3",
    name: "Rifat Chowdhury",
    studentId: "211-15-4438",
    semester: "6th Sem",
    section: "Sec B",
    department: "CSE",
    skills: ["Section B", "Competitive Programming", "Math Club"],
    isActive: true,
    activeStatusText: "Active 15m ago",
    avatarTone: "brand",
  },
  {
    id: "4",
    name: "Mehrin Sultana",
    studentId: "211-15-4409",
    semester: "6th Sem",
    section: "Sec A",
    department: "CSE",
    skills: ["Section A", "Design Guild", "Study Group 2"],
    isActive: true,
    activeStatusText: "Active now",
    avatarTone: "warning",
  },
  {
    id: "5",
    name: "Farhan Sadik",
    studentId: "211-15-4450",
    semester: "5th Sem",
    section: "Sec B",
    department: "EEE",
    skills: ["Section B", "Circuits Lab", "Robotics Club"],
    isActive: false,
    activeStatusText: "Seen 2h ago",
    avatarTone: "neutral",
  },
  {
    id: "6",
    name: "Tasnim Zara",
    studentId: "211-15-4467",
    semester: "6th Sem",
    section: "Sec A",
    department: "BBA",
    skills: ["Section A", "Debating Club", "Study Group 4"],
    isActive: true,
    activeStatusText: "Active now",
    avatarTone: "success",
  },
  {
    id: "7",
    name: "Anika Kabir",
    studentId: "211-15-4431",
    semester: "6th Sem",
    section: "Sec A",
    department: "CSE",
    skills: ["Section A", "Study Group 3", "Open Source Club"],
    isActive: true,
    activeStatusText: "Active now",
    avatarTone: "warning",
  },
  {
    id: "8",
    name: "Rifat Chowdhury",
    studentId: "211-15-4419",
    semester: "4th Sem",
    section: "Sec A",
    department: "CSE",
    skills: ["Section A", "Algorithms Lab", "Study Group 1"],
    isActive: true,
    activeStatusText: "Active 5m ago",
    avatarTone: "info",
  },
  {
    id: "9",
    name: "Sadia Afrin",
    studentId: "211-15-4402",
    semester: "6th Sem",
    section: "Sec A",
    department: "CSE",
    skills: ["Section A", "Database R&D", "IEEE Student Branch"],
    isActive: false,
    activeStatusText: "Seen 4h ago",
    avatarTone: "danger",
  },
  {
    id: "10",
    name: "Abrar Zahin",
    studentId: "211-15-4488",
    semester: "6th Sem",
    section: "Sec B",
    department: "EEE",
    skills: ["Section B", "Robotics Club", "IoT Research Group"],
    isActive: true,
    activeStatusText: "Active now",
    avatarTone: "brand",
  },
  {
    id: "11",
    name: "Fahim Faysal",
    studentId: "211-15-4441",
    semester: "4th Sem",
    section: "Sec B",
    department: "CSE",
    skills: ["Section B", "Study Group 2", "Mobile Dev Wing"],
    isActive: false,
    activeStatusText: "Seen yesterday",
    avatarTone: "neutral",
  },
];

export const STUDENT_FILTER_TABS = [
  { id: "all", label: "All Peers" },
  { id: "cse", label: "Computer Science (CSE)" },
  { id: "sem6", label: "6th Semester" },
  { id: "active", label: "Active Only" },
];
