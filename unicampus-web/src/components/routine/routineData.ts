import { FileText, ExternalLink, Video, FolderOpen } from "lucide-react";

export type ScheduleSlot = {
  id: string;
  startTime: string;
  endTime: string;
  isBreak?: boolean;
  breakLabel?: string;
  breakDuration?: string;
  breakLocation?: string;
  courseCode?: string;
  courseTitle?: string;
  status?: "completed" | "active" | "upcoming";
  statusText?: string;
  instructorName?: string;
  instructorAvatar?: string;
  room?: string;
  metaTopic?: string;
  isLab?: boolean;
  labHours?: string;
  primaryAction?: {
    label: string;
    icon: typeof Video | typeof ExternalLink;
    href?: string;
  };
  secondaryAction?: {
    label: string;
    icon: typeof FileText | typeof FolderOpen;
    href?: string;
  };
};

export type WeeklyMatrixRow = {
  time: string;
  mon: string;
  tue: string;
  wed: string;
  thu: string;
  fri: string;
  sat: string;
};

export const WEEKLY_ROUTINE_DATA: Record<string, ScheduleSlot[]> = {
  Monday: [
    {
      id: "mon-1",
      startTime: "08:30 AM",
      endTime: "10:00 AM",
      courseCode: "CSE-3103",
      courseTitle: "Database Management Systems",
      status: "completed",
      statusText: "Completed",
      instructorName: "Prof. Mahmudul Hasan",
      room: "Room 301-A",
      metaTopic: "Theory • 90 Mins",
      isLab: false,
      secondaryAction: { label: "Course Materials", icon: FolderOpen, href: "/materials" },
      primaryAction: { label: "Classroom Link", icon: ExternalLink, href: "#" },
    },
    {
      id: "mon-2",
      startTime: "10:15 AM",
      endTime: "11:45 AM",
      courseCode: "CSE-3101",
      courseTitle: "Design & Analysis of Algorithms",
      status: "active",
      statusText: "In Progress (42m left)",
      instructorName: "Dr. Asif Rahman",
      room: "Room 402",
      metaTopic: "Dynamic Programming & Graph Theory",
      isLab: false,
      secondaryAction: { label: "Course Materials", icon: FolderOpen, href: "/materials" },
      primaryAction: { label: "Classroom Link", icon: Video, href: "#" },
    },
    {
      id: "mon-3",
      startTime: "11:45 AM",
      endTime: "01:00 PM",
      isBreak: true,
      breakLabel: "Midday Prayer & Lunch Break",
      breakDuration: "1 hr 15 mins",
      breakLocation: "Cafeteria Open • Campus Mosque",
    },
    {
      id: "mon-4",
      startTime: "01:00 PM",
      endTime: "02:30 PM",
      courseCode: "CSE-3205",
      courseTitle: "Software Engineering & System Design",
      status: "upcoming",
      statusText: "Upcoming in 1h 15m",
      instructorName: "Farhan Tanvir",
      room: "Room 604-B",
      metaTopic: "Sprint Planning & Agile Modeling",
      isLab: false,
      secondaryAction: { label: "Course Materials", icon: FolderOpen, href: "/materials" },
      primaryAction: { label: "Classroom Link", icon: ExternalLink, href: "#" },
    },
    {
      id: "mon-5",
      startTime: "02:45 PM",
      endTime: "04:45 PM",
      courseCode: "CSE-3206",
      courseTitle: "Software Engineering Lab",
      status: "upcoming",
      statusText: "Upcoming",
      instructorName: "Sadia Afrin",
      room: "Software Lab 2 (Bldg 3)",
      metaTopic: "Workstation #14 Allocated",
      isLab: true,
      labHours: "2.0 hrs Lab",
      secondaryAction: { label: "Lab Manual", icon: FileText, href: "/materials" },
      primaryAction: { label: "Classroom Link", icon: ExternalLink, href: "#" },
    },
  ],
  Tuesday: [
    {
      id: "tue-1",
      startTime: "09:00 AM",
      endTime: "10:30 AM",
      courseCode: "CSE-3105",
      courseTitle: "Computer Networks & Protocols",
      status: "upcoming",
      statusText: "Scheduled",
      instructorName: "Dr. Tanvir Ahmed",
      room: "Room 502",
      metaTopic: "OSI Reference Model & Routing",
      isLab: false,
      secondaryAction: { label: "Course Materials", icon: FolderOpen, href: "/materials" },
      primaryAction: { label: "Classroom Link", icon: ExternalLink, href: "#" },
    },
    {
      id: "tue-2",
      startTime: "10:45 AM",
      endTime: "12:15 PM",
      courseCode: "CSE-3101",
      courseTitle: "Design & Analysis of Algorithms",
      status: "upcoming",
      statusText: "Scheduled",
      instructorName: "Dr. Asif Rahman",
      room: "Room 402",
      metaTopic: "Greedy Algorithms & Divide & Conquer",
      isLab: false,
      secondaryAction: { label: "Course Materials", icon: FolderOpen, href: "/materials" },
      primaryAction: { label: "Classroom Link", icon: ExternalLink, href: "#" },
    },
    {
      id: "tue-3",
      startTime: "12:15 PM",
      endTime: "01:30 PM",
      isBreak: true,
      breakLabel: "Midday Prayer & Lunch Break",
      breakDuration: "1 hr 15 mins",
      breakLocation: "Cafeteria Open • Campus Mosque",
    },
    {
      id: "tue-4",
      startTime: "01:30 PM",
      endTime: "04:30 PM",
      courseCode: "CSE-3104",
      courseTitle: "Database Management Systems Lab",
      status: "upcoming",
      statusText: "Scheduled",
      instructorName: "Prof. Mahmudul Hasan",
      room: "Database Lab 4",
      metaTopic: "PostgreSQL Complex Joins & Indices",
      isLab: true,
      labHours: "3.0 hrs Lab",
      secondaryAction: { label: "Lab Manual", icon: FileText, href: "/materials" },
      primaryAction: { label: "Classroom Link", icon: ExternalLink, href: "#" },
    },
  ],
  Wednesday: [
    {
      id: "wed-1",
      startTime: "08:30 AM",
      endTime: "10:00 AM",
      courseCode: "CSE-3205",
      courseTitle: "Software Engineering & System Design",
      status: "upcoming",
      statusText: "Scheduled",
      instructorName: "Dr. Farhana Khan",
      room: "Room 604-B",
      metaTopic: "Microservices Architecture & REST APIs",
      isLab: false,
      secondaryAction: { label: "Course Materials", icon: FolderOpen, href: "/materials" },
      primaryAction: { label: "Classroom Link", icon: ExternalLink, href: "#" },
    },
    {
      id: "wed-2",
      startTime: "10:15 AM",
      endTime: "11:45 AM",
      courseCode: "CSE-3103",
      courseTitle: "Database Management Systems",
      status: "upcoming",
      statusText: "Scheduled",
      instructorName: "Prof. Mahmudul Hasan",
      room: "Room 301-A",
      metaTopic: "ACID Properties & Transaction Control",
      isLab: false,
      secondaryAction: { label: "Course Materials", icon: FolderOpen, href: "/materials" },
      primaryAction: { label: "Classroom Link", icon: ExternalLink, href: "#" },
    },
    {
      id: "wed-3",
      startTime: "11:45 AM",
      endTime: "01:00 PM",
      isBreak: true,
      breakLabel: "Midday Prayer & Lunch Break",
      breakDuration: "1 hr 15 mins",
      breakLocation: "Student Center Lounge",
    },
    {
      id: "wed-4",
      startTime: "01:00 PM",
      endTime: "03:00 PM",
      courseCode: "GEN-2101",
      courseTitle: "Engineering Economics & Ethics",
      status: "upcoming",
      statusText: "Scheduled",
      instructorName: "Dr. Nazmul Huda",
      room: "Auditorium Hall B",
      metaTopic: "Cost Benefit Analysis & Professional Conduct",
      isLab: false,
      secondaryAction: { label: "Course Materials", icon: FolderOpen, href: "/materials" },
      primaryAction: { label: "Classroom Link", icon: ExternalLink, href: "#" },
    },
  ],
  Thursday: [
    {
      id: "thu-1",
      startTime: "09:00 AM",
      endTime: "10:30 AM",
      courseCode: "CSE-3105",
      courseTitle: "Computer Networks & Protocols",
      status: "upcoming",
      statusText: "Scheduled",
      instructorName: "Dr. Tanvir Ahmed",
      room: "Room 502",
      metaTopic: "TCP/UDP Flow Control & Congestion Avoidance",
      isLab: false,
      secondaryAction: { label: "Course Materials", icon: FolderOpen, href: "/materials" },
      primaryAction: { label: "Classroom Link", icon: ExternalLink, href: "#" },
    },
    {
      id: "thu-2",
      startTime: "10:45 AM",
      endTime: "12:15 PM",
      courseCode: "CSE-3101",
      courseTitle: "Design & Analysis of Algorithms",
      status: "upcoming",
      statusText: "Scheduled",
      instructorName: "Dr. Asif Rahman",
      room: "Room 402",
      metaTopic: "Complexity Theory (P vs NP & Reductions)",
      isLab: false,
      secondaryAction: { label: "Course Materials", icon: FolderOpen, href: "/materials" },
      primaryAction: { label: "Classroom Link", icon: ExternalLink, href: "#" },
    },
    {
      id: "thu-3",
      startTime: "12:15 PM",
      endTime: "01:30 PM",
      isBreak: true,
      breakLabel: "Midday Prayer & Lunch Break",
      breakDuration: "1 hr 15 mins",
      breakLocation: "Cafeteria Open • Campus Mosque",
    },
    {
      id: "thu-4",
      startTime: "01:30 PM",
      endTime: "04:30 PM",
      courseCode: "CSE-3106",
      courseTitle: "Computer Networks Sessional Lab",
      status: "upcoming",
      statusText: "Scheduled",
      instructorName: "Dr. Tanvir Ahmed",
      room: "Hardware & Telecom Lab 1",
      metaTopic: "Cisco Packet Tracer Subnetting Lab",
      isLab: true,
      labHours: "3.0 hrs Lab",
      secondaryAction: { label: "Lab Manual", icon: FileText, href: "/materials" },
      primaryAction: { label: "Classroom Link", icon: ExternalLink, href: "#" },
    },
  ],
  Friday: [
    {
      id: "fri-1",
      startTime: "08:30 AM",
      endTime: "11:30 AM",
      courseCode: "CSE-3200",
      courseTitle: "Capstone Project & Research Colloquium",
      status: "upcoming",
      statusText: "Scheduled",
      instructorName: "Prof. Mahmudul Hasan",
      room: "Innovation Hub Room 101",
      metaTopic: "Bi-Weekly Mentor Standup & Milestone Review",
      isLab: true,
      labHours: "3.0 hrs Lab",
      secondaryAction: { label: "Guidelines", icon: FileText, href: "/materials" },
      primaryAction: { label: "Classroom Link", icon: ExternalLink, href: "#" },
    },
    {
      id: "fri-2",
      startTime: "11:30 AM",
      endTime: "02:30 PM",
      isBreak: true,
      breakLabel: "Jumu'ah Prayer & Extended Weekend Recess",
      breakDuration: "3 hrs",
      breakLocation: "Campus Central Mosque & Dining Hall",
    },
  ],
  Saturday: [
    {
      id: "sat-1",
      startTime: "09:30 AM",
      endTime: "11:30 AM",
      courseCode: "CSE-3301",
      courseTitle: "Competitive Programming Seminar (Optional)",
      status: "upcoming",
      statusText: "Scheduled",
      instructorName: "Alumni Guest Mentors",
      room: "Seminar Hall CSE",
      metaTopic: "Advanced Segment Trees & Combinatorics",
      isLab: false,
      secondaryAction: { label: "Problems", icon: FolderOpen, href: "/materials" },
      primaryAction: { label: "Classroom Link", icon: ExternalLink, href: "#" },
    },
  ],
};

export const DAYS_LIST = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const WEEKLY_TIME_GRID_SLOTS: WeeklyMatrixRow[] = [
  { time: "08:30 - 10:00", mon: "CSE-3103", tue: "-", wed: "CSE-3205", thu: "-", fri: "CSE-3200 (Lab)", sat: "-" },
  { time: "10:15 - 11:45", mon: "CSE-3101 (Active)", tue: "CSE-3105", wed: "CSE-3103", thu: "CSE-3105", fri: "-", sat: "CSE-3301" },
  { time: "11:45 - 01:00", mon: "Break", tue: "Break", wed: "Break", thu: "Break", fri: "Break", sat: "-" },
  { time: "01:00 - 02:30", mon: "CSE-3205", tue: "CSE-3101", wed: "GEN-2101", thu: "CSE-3101", fri: "-", sat: "-" },
  { time: "02:45 - 04:45", mon: "CSE-3206 (Lab)", tue: "CSE-3104 (Lab)", wed: "-", thu: "CSE-3106 (Lab)", fri: "-", sat: "-" },
];
