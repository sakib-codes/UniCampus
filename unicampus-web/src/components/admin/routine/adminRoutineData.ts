import {
  CANONICAL_COURSES,
  CANONICAL_FACULTY,
  CANONICAL_TIME_SLOTS,
} from "@/lib/canonicalCampus";

export type DeptType = "cse" | "eee" | "bba" | "pharm" | "eng" | "lab";
export type BuildingType = "bldg-1" | "bldg-2" | "lab";

export interface SlotData {
  id: string;
  room: string;
  roomCapacity: number;
  roomType: string;
  slotIndex: number;
  slotSpan?: number;
  day: string;
  timeRange: string;
  courseCode: string;
  courseName: string;
  section: string;
  instructor: string;
  instructorDept: string;
  initials: string;
  enrolled: number;
  deptType: DeptType;
  conflictFree: boolean;
}

export const COURSE_OPTIONS = [
  {
    code: CANONICAL_COURSES["CSE-3101"].code,
    title: CANONICAL_COURSES["CSE-3101"].title,
    instructor: CANONICAL_COURSES["CSE-3101"].instructor,
    instructorDept: "Associate Professor • CSE",
    initials: "AR",
    deptType: "cse" as const,
  },
  {
    code: CANONICAL_COURSES["CSE-3102"].code,
    title: CANONICAL_COURSES["CSE-3102"].title,
    instructor: CANONICAL_FACULTY.name,
    instructorDept: "Associate Professor • CSE",
    initials: "AR",
    deptType: "lab" as const,
  },
  {
    code: CANONICAL_COURSES["CSE-3205"].code,
    title: CANONICAL_COURSES["CSE-3205"].title,
    instructor: CANONICAL_COURSES["CSE-3205"].instructor,
    instructorDept: "Senior Lecturer • CSE",
    initials: "FT",
    deptType: "cse" as const,
  },
  {
    code: CANONICAL_COURSES["CSE-4109"].code,
    title: CANONICAL_COURSES["CSE-4109"].title,
    instructor: CANONICAL_COURSES["CSE-4109"].instructor,
    instructorDept: "Associate Professor • CSE",
    initials: "AR",
    deptType: "cse" as const,
  },
  {
    code: "EEE-2201",
    title: "Circuit Theory & Analysis",
    instructor: "Prof. Jamal Uddin",
    instructorDept: "Professor & Head • EEE",
    initials: "JU",
    deptType: "eee" as const,
  },
  {
    code: "FIN-3102",
    title: "Managerial Finance",
    instructor: "Dr. Farhana Khan",
    instructorDept: "Professor & Head • BBA",
    initials: "FK",
    deptType: "bba" as const,
  },
];

export const INITIAL_SLOTS: SlotData[] = [
  {
    id: "slot-eee-101",
    room: "Room 101",
    roomCapacity: 60,
    roomType: "Auditorium Tier",
    slotIndex: 0,
    slotSpan: 1,
    day: "Mon",
    timeRange: CANONICAL_TIME_SLOTS[0],
    courseCode: "EEE-2201",
    courseName: "Circuit Theory & Analysis",
    section: "Section B",
    instructor: "Prof. Jamal Uddin",
    instructorDept: "Professor & Head • EEE",
    initials: "JU",
    enrolled: 54,
    deptType: "eee",
    conflictFree: true,
  },
  {
    id: "slot-bba-101",
    room: "Room 101",
    roomCapacity: 60,
    roomType: "Auditorium Tier",
    slotIndex: 3,
    slotSpan: 1,
    day: "Mon",
    timeRange: CANONICAL_TIME_SLOTS[3],
    courseCode: "FIN-3102",
    courseName: "Managerial Finance",
    section: "Section A",
    instructor: "Dr. Farhana Khan",
    instructorDept: "Professor & Head • BBA",
    initials: "FK",
    enrolled: 58,
    deptType: "bba",
    conflictFree: true,
  },
  {
    id: "slot-cse-102",
    room: "Room 102",
    roomCapacity: 60,
    roomType: "Multimedia Enabled",
    slotIndex: 1,
    slotSpan: 1,
    day: "Mon",
    timeRange: CANONICAL_TIME_SLOTS[1],
    courseCode: CANONICAL_COURSES["CSE-3205"].code,
    courseName: CANONICAL_COURSES["CSE-3205"].title,
    section: "Section A",
    instructor: CANONICAL_COURSES["CSE-3205"].instructor,
    instructorDept: "Senior Lecturer • CSE",
    initials: "FT",
    enrolled: 48,
    deptType: "cse",
    conflictFree: true,
  },
  {
    id: "slot-cse-402",
    room: "Room 402",
    roomCapacity: 50,
    roomType: "Interactive Board",
    slotIndex: 1,
    slotSpan: 1,
    day: "Mon",
    timeRange: CANONICAL_TIME_SLOTS[1],
    courseCode: CANONICAL_COURSES["CSE-3101"].code,
    courseName: CANONICAL_COURSES["CSE-3101"].title,
    section: "Section A",
    instructor: CANONICAL_FACULTY.name,
    instructorDept: "Associate Professor • CSE",
    initials: "AR",
    enrolled: 45,
    deptType: "cse",
    conflictFree: true,
  },
  {
    id: "slot-lab-4a",
    room: "Lab 4A",
    roomCapacity: 40,
    roomType: "Computing Lab",
    slotIndex: 3,
    slotSpan: 2,
    day: "Mon",
    timeRange: "01:00–04:45",
    courseCode: CANONICAL_COURSES["CSE-3102"].code,
    courseName: CANONICAL_COURSES["CSE-3102"].title,
    section: "Section A",
    instructor: CANONICAL_FACULTY.name,
    instructorDept: "Associate Professor • CSE",
    initials: "AR",
    enrolled: 38,
    deptType: "lab",
    conflictFree: true,
  },
  {
    id: "slot-cse-402-tue",
    room: "Room 402",
    roomCapacity: 50,
    roomType: "Interactive Board",
    slotIndex: 0,
    slotSpan: 1,
    day: "Tue",
    timeRange: CANONICAL_TIME_SLOTS[0],
    courseCode: CANONICAL_COURSES["CSE-4109"].code,
    courseName: CANONICAL_COURSES["CSE-4109"].title,
    section: "Section A",
    instructor: CANONICAL_FACULTY.name,
    instructorDept: "Associate Professor • CSE",
    initials: "AR",
    enrolled: 36,
    deptType: "cse",
    conflictFree: true,
  },
  {
    id: "slot-lab-4a-wed",
    room: "Lab 4A",
    roomCapacity: 40,
    roomType: "Computing Lab",
    slotIndex: 4,
    slotSpan: 1,
    day: "Wed",
    timeRange: CANONICAL_TIME_SLOTS[4],
    courseCode: CANONICAL_COURSES["CSE-3102"].code,
    courseName: CANONICAL_COURSES["CSE-3102"].title,
    section: "Section A",
    instructor: CANONICAL_FACULTY.name,
    instructorDept: "Associate Professor • CSE",
    initials: "AR",
    enrolled: 38,
    deptType: "lab",
    conflictFree: true,
  },
];

export const TIME_SLOTS = [
  { label: CANONICAL_TIME_SLOTS[0], sub: "Slot 1 • 90m" },
  { label: CANONICAL_TIME_SLOTS[1], sub: "Slot 2 • 90m" },
  { label: CANONICAL_TIME_SLOTS[2], sub: "Slot 3 • Midday", isBreak: true },
  { label: CANONICAL_TIME_SLOTS[3], sub: "Slot 4 • 90m" },
  { label: CANONICAL_TIME_SLOTS[4], sub: "Slot 5 • 120m" },
  { label: "04:45–06:00", sub: "Slot 6 • 75m" },
];

export const ROOMS = [
  { id: "r101", name: "Room 101", capacity: 60, util: "90%", type: "Auditorium Tier", building: "bldg-1" as const },
  { id: "r102", name: "Room 102", capacity: 60, util: "80%", type: "Multimedia Enabled", building: "bldg-1" as const },
  { id: "r402", name: "Room 402", capacity: 50, util: "90%", type: "Interactive Board", building: "bldg-2" as const },
  { id: "l4a", name: "Lab 4A", capacity: 40, util: "95%", type: "Computing Lab", isLab: true, building: "lab" as const },
  { id: "l4b", name: "Lab 4B", capacity: 40, util: "Maint", type: "Network Sim Lab", isLab: true, building: "lab" as const },
];

export type RoomItem = (typeof ROOMS)[number];
