/**
 * UniCampus Canonical Notice Data & Types
 */

export interface NoticeItem {
  id: string;
  refNo: string;
  category: "EXAM SCHEDULE" | "ACADEMIC" | "EVENTS" | "ADMINISTRATION";
  categoryKey: "exam" | "academic" | "events" | "admin";
  categoryColor: {
    bg: string;
    text: string;
    border: string;
  };
  title: string;
  summary: string;
  body: string[];
  author: string;
  authorDesignation: string;
  authorCouncil: string;
  department: string;
  dateStr: string;
  timeStr: string;
  academicSession: string;
  targetAudience: string;
  attachmentName?: string;
  attachmentSize?: string;
  pinnedUrgent?: boolean;
  sha256: string;
  protocols?: {
    title: string;
    items: string[];
  };
  scheduleTable?: {
    title: string;
    headers: string[];
    rows: {
      code: string;
      title: string;
      col1: string;
      col2: string;
      col3: string;
    }[];
  };
}

export const OFFICIAL_NOTICES: NoticeItem[] = [
  {
    id: "not-exam-108",
    refNo: "UC/COE/2026/108",
    category: "EXAM SCHEDULE",
    categoryKey: "exam",
    categoryColor: {
      bg: "bg-brand-soft",
      text: "text-brand",
      border: "border-brand/30",
    },
    title: "Final Examination Schedule Spring 2026 Released",
    summary: "Mandatory clearance certification and physical admit cards are required for all 3000 & 4000 series course enrollments.",
    body: [
      "It is hereby notified for all undergraduate scholars of the Department of Computer Science & Engineering that the Semester Final Examinations (Spring 2026) will commence from November 12, 2026 in accordance with the routine delineated below.",
      "Scholars are advised to cross-examine their enrolled course codes, exam halls, and designated seat rows. Any clash in the examination timetable must be submitted to the Controller's Office within 72 hours of publication."
    ],
    author: "Dr. M. Rezaul Karim",
    authorDesignation: "Controller of Examinations",
    authorCouncil: "UniCampus Academic Council & Exam Directorate",
    department: "Office of the Controller of Examinations",
    dateStr: "October 22, 2026",
    timeStr: "Today, 10:30 AM",
    academicSession: "Spring Semester 2026",
    targetAudience: "All Undergrad Departments (CSE, EEE, BBA)",
    attachmentName: "PDF • 1.4 MB",
    attachmentSize: "1.4 MB",
    pinnedUrgent: true,
    sha256: "8f9b4d17c3e5a201...a12c4e88",
    protocols: {
      title: "MANDATORY EXAM HALL PROTOCOLS",
      items: [
        "Physical Admit Cards and Student Identity Smart Cards must be produced upon entry.",
        "Programmable scientific calculators and smart devices are strictly restricted unless authorized by course instructor.",
        "Reporting time is strictly 30 minutes prior to scheduled session. Examination hall gates lock 15 minutes post-commencement."
      ]
    },
    scheduleTable: {
      title: "Scheduled Course Assessments",
      headers: ["Course Code & Title", "Date", "Time Slot", "Venue Hall"],
      rows: [
        {
          code: "CSE-3101",
          title: "Design & Analysis of Algorithms",
          col1: "Nov 12, 2026",
          col2: "10:00 AM - 01:00 PM",
          col3: "Hall A-102"
        },
        {
          code: "CSE-3205",
          title: "Software Engineering & System Design",
          col1: "Nov 15, 2026",
          col2: "10:00 AM - 01:00 PM",
          col3: "Hall B-204"
        },
        {
          code: "CSE-3103",
          title: "Database Management Systems",
          col1: "Nov 18, 2026",
          col2: "02:00 PM - 05:00 PM",
          col3: "Hall A-105"
        }
      ]
    }
  },
  {
    id: "not-reg-089",
    refNo: "UC/REG/2026/089",
    category: "ACADEMIC",
    categoryKey: "academic",
    categoryColor: {
      bg: "bg-emerald-500/10 dark:bg-emerald-500/15",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-500/30",
    },
    title: "Course Advising & Pre-Registration Window for Fall 2026",
    summary: "All level-3 engineering scholars must finalize their elective tracks via ERP portal prior to slot freeze deadline.",
    body: [
      "All continuing undergraduate scholars of 3rd and 4th academic years are hereby informed that course pre-registration for the Fall 2026 semester will open according to the batch slots scheduled below.",
      "Scholars must review their completed credit tallies and prerequisite clearances before submitting their registration request. Academic advisors will be available during physical consultation hours for curriculum exceptions."
    ],
    author: "Prof. Shamsul Alam",
    authorDesignation: "Office of the Registrar",
    authorCouncil: "Admissions & Records Directorate",
    department: "Office of the Registrar",
    dateStr: "October 20, 2026",
    timeStr: "Oct 20, 2026",
    academicSession: "Fall Semester 2026",
    targetAudience: "Continuing Undergraduate Scholars (Batches 2021 - 2023)",
    attachmentName: "Form Link • ERP Guideline",
    attachmentSize: "0.8 MB",
    pinnedUrgent: false,
    sha256: "3c881fa4b7e901dc...e901ab33",
    protocols: {
      title: "PRE-REGISTRATION CRITERIA & POLICY",
      items: [
        "Maximum allowable credit load: 21 Credits for regular status; 24 Credits for CGPA ≥ 3.75.",
        "Prerequisites will be auto-validated by the ERP system; missing prerequisite courses require advisor waiver.",
        "Pre-registration slot freezes automatically at 05:00 PM on the designated batch day."
      ]
    },
    scheduleTable: {
      title: "Advising Timeline by Batch",
      headers: ["Batch / Cohort", "Date", "Window Time", "Portal Status"],
      rows: [
        {
          code: "Batch 2021",
          title: "Level 4 / Senior Scholars",
          col1: "Oct 28 - Oct 30, 2026",
          col2: "09:00 AM - 05:00 PM",
          col3: "Active Window"
        },
        {
          code: "Batch 2022",
          title: "Level 3 / Junior Scholars",
          col1: "Nov 01 - Nov 03, 2026",
          col2: "09:00 AM - 05:00 PM",
          col3: "Active Window"
        },
        {
          code: "Batch 2023",
          title: "Level 2 / Sophomore Scholars",
          col1: "Nov 04 - Nov 05, 2026",
          col2: "09:00 AM - 05:00 PM",
          col3: "Upcoming"
        }
      ]
    }
  },
  {
    id: "not-hack-044",
    refNo: "UC/CSE/2026/044",
    category: "EVENTS",
    categoryKey: "events",
    categoryColor: {
      bg: "bg-amber-500/10 dark:bg-amber-500/15",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-500/30",
    },
    title: "Intra-University Hackathon & AI Showcase 2026 Registration Open",
    summary: "48-hour sprint focusing on Large Multimodal Systems, Edge AI robotics, and Autonomous Agent Systems and Edge Computing.",
    body: [
      "Department of Computer Science & Engineering cordially invites multidisciplinary student innovators to participate in the flagship Intra-University Hackathon & AI Showcase 2026.",
      "The competition includes three tracks, mentorship from industry architects, and a total cash pool of $5,000 for top prototyping solutions."
    ],
    author: "Dr. Farhana Khan",
    authorDesignation: "Convenor, CSE Society",
    authorCouncil: "Department of Computer Science & Engineering",
    department: "Dept. of CSE",
    dateStr: "October 18, 2026",
    timeStr: "Oct 18, 2026",
    academicSession: "Spring 2026 Techfest",
    targetAudience: "All Engineering & Computing Students",
    attachmentName: "Prize Pool $5,000 • PDF",
    attachmentSize: "2.1 MB",
    pinnedUrgent: false,
    sha256: "7e2a9b31cd5e4402...ff3388a1",
    protocols: {
      title: "HACKATHON PARTICIPATION RULES",
      items: [
        "Teams must comprise 3 to 4 members with at least one member from CSE.",
        "All code repositories must be initialized from the official competition GitHub classroom template.",
        "Deployments must run on edge microcontrollers or live accessible cloud links during final jury demonstration."
      ]
    },
    scheduleTable: {
      title: "Event Milestones & Submission Deadlines",
      headers: ["Milestone Phase", "Target Date", "Time Slot", "Platform / Venue"],
      rows: [
        {
          code: "Phase 1",
          title: "Team Registration & Abstract Submission",
          col1: "Nov 05, 2026",
          col2: "11:59 PM (Hard Lock)",
          col3: "Online Portal"
        },
        {
          code: "Phase 2",
          title: "Preliminary Shortlisting & Pitch",
          col1: "Nov 08, 2026",
          col2: "02:00 PM - 06:00 PM",
          col3: "Virtual Screening"
        },
        {
          code: "Phase 3",
          title: "Grand 48-Hour On-Campus Hackathon",
          col1: "Nov 20 - Nov 22, 2026",
          col2: "Continuous Sprint",
          col3: "Innovation Hub Lab 4"
        }
      ]
    }
  },
  {
    id: "not-trn-021",
    refNo: "UC/TRN/2026/021",
    category: "ADMINISTRATION",
    categoryKey: "admin",
    categoryColor: {
      bg: "bg-slate-500/10 dark:bg-slate-500/15",
      text: "text-slate-600 dark:text-slate-300",
      border: "border-slate-500/30",
    },
    title: "Updated Campus Shuttle Bus Timings for Evening Lab Batches",
    summary: "Route 3 and Route 7 schedules have been extended up to 9:30 PM to facilitate capstone research teams.",
    body: [
      "In response to extended engineering laboratory schedules and senior capstone requirements, the Transport Operations Directorate has revised departure timings for campus shuttle buses effective immediately.",
      "Students commuting on evening routes are requested to verify their pickup points and board with verified RFID campus cards."
    ],
    author: "Engr. Tariq Hasan",
    authorDesignation: "Director of Transport Operations",
    authorCouncil: "University Administrative & Logistic Services",
    department: "Transport Division",
    dateStr: "October 15, 2026",
    timeStr: "Oct 15, 2026",
    academicSession: "Ongoing Term 2026",
    targetAudience: "Campus Commuters & Evening Laboratory Students",
    attachmentName: "Route Maps • PDF",
    attachmentSize: "3.4 MB",
    pinnedUrgent: false,
    sha256: "1f48bc29701aef42...9902bd81",
    protocols: {
      title: "CAMPUS FLEET TRANSIT REGULATIONS",
      items: [
        "Valid University ID Smart Card must be tapped at the onboard NFC scanner.",
        "Seating is allocated on a first-come, first-served basis; priority seating reserved for female scholars.",
        "Real-time GPS telemetry is viewable on the UniCampus Transport Tracker mobile interface."
      ]
    },
    scheduleTable: {
      title: "Evening Shuttle Route Matrix",
      headers: ["Transit Route", "Departure Days", "Evening Departures", "Pickup Station"],
      rows: [
        {
          code: "Route 3",
          title: "Campus to City Center Express",
          col1: "Daily (Sun - Thu)",
          col2: "07:30 PM & 09:30 PM",
          col3: "East Gate Bay 2"
        },
        {
          code: "Route 7",
          title: "Campus to North Suburb Transit",
          col1: "Daily (Sun - Thu)",
          col2: "08:00 PM & 09:30 PM",
          col3: "Main Terminal"
        },
        {
          code: "Route 1",
          title: "Campus to Central Railway Station",
          col1: "Daily (Sun - Thu)",
          col2: "06:30 PM, 08:30 PM, 10:00 PM",
          col3: "East Gate Bay 1"
        }
      ]
    }
  }
];
