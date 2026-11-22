/**
 * UniCampus Course Advising & Pre-Registration Engine Data Layer
 */

export interface CourseSection {
  id: string;
  sectionName: string; // "Section A", "Section B", etc.
  instructor: string;
  instructorAvatar?: string;
  days: string[]; // ["Monday", "Wednesday"]
  timeSlot: string; // "08:30 AM - 10:00 AM"
  startMinutes: number; // minutes from midnight: e.g. 8*60 + 30 = 510
  endMinutes: number; // 10*60 = 600
  room: string;
  totalSeats: number;
  enrolledSeats: number;
}

export interface AdvisingCourse {
  code: string;
  title: string;
  credits: number;
  type: "Theory" | "Lab";
  category: "Core Requirement" | "Major Elective" | "Open Elective";
  department: string;
  prerequisites: string[]; // ["CSE-3101"]
  prereqMet: boolean;
  prereqGrade?: string; // "A"
  description: string;
  sections: CourseSection[];
}

export interface SelectedRegistrationItem {
  courseCode: string;
  sectionId: string;
  addedAt: string;
}

export interface AdvisingClash {
  courseA: string;
  sectionA: string;
  courseB: string;
  sectionB: string;
  day: string;
  timeSlot: string;
}

export const ADVISING_OFFERINGS: AdvisingCourse[] = [
  {
    code: "CSE-4101",
    title: "Artificial Intelligence & Machine Learning",
    credits: 3.0,
    type: "Theory",
    category: "Core Requirement",
    department: "Computer Science & Engineering",
    prerequisites: ["CSE-3101"],
    prereqMet: true,
    prereqGrade: "A",
    description: "Search algorithms, reinforcement learning, probabilistic reasoning, and deep neural network architectures.",
    sections: [
      {
        id: "cse-4101-sec-a",
        sectionName: "Section A",
        instructor: "Dr. Asif Rahman",
        days: ["Monday", "Wednesday"],
        timeSlot: "10:00 AM - 11:30 AM",
        startMinutes: 600,
        endMinutes: 690,
        room: "Room 402-A",
        totalSeats: 45,
        enrolledSeats: 38,
      },
      {
        id: "cse-4101-sec-b",
        sectionName: "Section B",
        instructor: "Prof. Mahmudul Hasan",
        days: ["Tuesday", "Thursday"],
        timeSlot: "01:00 PM - 02:30 PM",
        startMinutes: 780,
        endMinutes: 870,
        room: "Room 501",
        totalSeats: 45,
        enrolledSeats: 29,
      },
    ],
  },
  {
    code: "CSE-4102",
    title: "Machine Learning Sessional Lab",
    credits: 1.5,
    type: "Lab",
    category: "Core Requirement",
    department: "Computer Science & Engineering",
    prerequisites: ["CSE-3102"],
    prereqMet: true,
    prereqGrade: "A+",
    description: "Hands-on PyTorch modeling, dataset pipelines, hyperparameter tuning, and model deployment on GPU clusters.",
    sections: [
      {
        id: "cse-4102-sec-a",
        sectionName: "Section A",
        instructor: "Dr. Asif Rahman",
        days: ["Sunday"],
        timeSlot: "02:30 PM - 05:30 PM",
        startMinutes: 870,
        endMinutes: 1050,
        room: "Software Lab 3",
        totalSeats: 35,
        enrolledSeats: 32,
      },
      {
        id: "cse-4102-sec-b",
        sectionName: "Section B",
        instructor: "Farhan Tanvir",
        days: ["Tuesday"],
        timeSlot: "08:30 AM - 11:30 AM",
        startMinutes: 510,
        endMinutes: 690,
        room: "Software Lab 2",
        totalSeats: 35,
        enrolledSeats: 20,
      },
    ],
  },
  {
    code: "CSE-4109",
    title: "Distributed Systems & Cloud Computing",
    credits: 3.0,
    type: "Theory",
    category: "Core Requirement",
    department: "Computer Science & Engineering",
    prerequisites: ["CSE-3103"],
    prereqMet: true,
    prereqGrade: "A-",
    description: "Consensus protocols (Raft, Paxos), CAP theorem, distributed file systems, map-reduce architectures, and microservices.",
    sections: [
      {
        id: "cse-4109-sec-a",
        sectionName: "Section A",
        instructor: "Dr. Tariqul Islam",
        days: ["Monday", "Wednesday"],
        timeSlot: "01:00 PM - 02:30 PM",
        startMinutes: 780,
        endMinutes: 870,
        room: "Room 304",
        totalSeats: 50,
        enrolledSeats: 44,
      },
      {
        id: "cse-4109-sec-b",
        sectionName: "Section B",
        instructor: "Dr. Tariqul Islam",
        days: ["Tuesday", "Thursday"],
        timeSlot: "11:30 AM - 01:00 PM",
        startMinutes: 690,
        endMinutes: 780,
        room: "Room 304",
        totalSeats: 50,
        enrolledSeats: 31,
      },
    ],
  },
  {
    code: "CSE-4111",
    title: "Computer & Network Security",
    credits: 3.0,
    type: "Theory",
    category: "Major Elective",
    department: "Computer Science & Engineering",
    prerequisites: ["CSE-3205"],
    prereqMet: true,
    prereqGrade: "B+",
    description: "Symmetric and asymmetric cryptography, public key infrastructure (PKI), TLS/SSL protocols, network vulnerability audits, and penetration testing.",
    sections: [
      {
        id: "cse-4111-sec-a",
        sectionName: "Section A",
        instructor: "Engr. Tanvir Ahmed",
        days: ["Monday", "Wednesday"],
        timeSlot: "11:30 AM - 01:00 PM",
        startMinutes: 690,
        endMinutes: 780,
        room: "Room 408",
        totalSeats: 40,
        enrolledSeats: 35,
      },
      {
        id: "cse-4111-sec-b",
        sectionName: "Section B",
        instructor: "Engr. Tanvir Ahmed",
        days: ["Tuesday", "Thursday"],
        timeSlot: "02:30 PM - 04:00 PM",
        startMinutes: 870,
        endMinutes: 960,
        room: "Room 408",
        totalSeats: 40,
        enrolledSeats: 18,
      },
    ],
  },
  {
    code: "CSE-4215",
    title: "Cloud Native DevOps & Container Orchestration",
    credits: 3.0,
    type: "Theory",
    category: "Major Elective",
    department: "Computer Science & Engineering",
    prerequisites: ["CSE-3205"],
    prereqMet: true,
    prereqGrade: "A",
    description: "CI/CD pipeline automation, Docker containerization, Kubernetes cluster management, infrastructure-as-code (Terraform), and site reliability engineering.",
    sections: [
      {
        id: "cse-4215-sec-a",
        sectionName: "Section A",
        instructor: "Farhan Tanvir",
        days: ["Tuesday", "Thursday"],
        timeSlot: "10:00 AM - 11:30 AM",
        startMinutes: 600,
        endMinutes: 690,
        room: "Room 502",
        totalSeats: 45,
        enrolledSeats: 41,
      },
    ],
  },
  {
    code: "CSE-4221",
    title: "Natural Language Processing",
    credits: 3.0,
    type: "Theory",
    category: "Major Elective",
    department: "Computer Science & Engineering",
    prerequisites: ["CSE-4101"],
    prereqMet: false, // Requires CSE-4101 concurrent/completed
    description: "Tokenization, language models, transformer architectures, attention mechanisms, fine-tuning LLMs, and semantic search.",
    sections: [
      {
        id: "cse-4221-sec-a",
        sectionName: "Section A",
        instructor: "Dr. Asif Rahman",
        days: ["Wednesday"],
        timeSlot: "02:30 PM - 05:30 PM",
        startMinutes: 870,
        endMinutes: 1050,
        room: "Room 405",
        totalSeats: 35,
        enrolledSeats: 12,
      },
    ],
  },
  {
    code: "ACT-2101",
    title: "Engineering Economics & Financial Accounting",
    credits: 3.0,
    type: "Theory",
    category: "Open Elective",
    department: "Business Administration",
    prerequisites: [],
    prereqMet: true,
    description: "Cost-benefit analysis, depreciation methods, capital investment evaluation, cash flow accounting, and project financing.",
    sections: [
      {
        id: "act-2101-sec-a",
        sectionName: "Section A",
        instructor: "Nazia Rahman, MBA",
        days: ["Sunday", "Tuesday"],
        timeSlot: "11:30 AM - 01:00 PM",
        startMinutes: 690,
        endMinutes: 780,
        room: "BBA Hall 201",
        totalSeats: 60,
        enrolledSeats: 52,
      },
    ],
  },
];

/**
 * Detects schedule collisions between all selected sections.
 */
export function detectScheduleClashes(
  selectedItems: SelectedRegistrationItem[],
  offerings: AdvisingCourse[] = ADVISING_OFFERINGS
): AdvisingClash[] {
  const clashes: AdvisingClash[] = [];
  const sectionsList: {
    courseCode: string;
    courseTitle: string;
    section: CourseSection;
  }[] = [];

  for (const item of selectedItems) {
    const course = offerings.find((c) => c.code === item.courseCode);
    if (!course) continue;
    const section = course.sections.find((s) => s.id === item.sectionId);
    if (!section) continue;
    sectionsList.push({
      courseCode: course.code,
      courseTitle: course.title,
      section,
    });
  }

  for (let i = 0; i < sectionsList.length; i++) {
    for (let j = i + 1; j < sectionsList.length; j++) {
      const a = sectionsList[i];
      const b = sectionsList[j];

      // Check common days
      const commonDays = a.section.days.filter((d) => b.section.days.includes(d));
      if (commonDays.length === 0) continue;

      // Check time overlap: (startA < endB) && (endA > startB)
      const overlaps =
        a.section.startMinutes < b.section.endMinutes &&
        a.section.endMinutes > b.section.startMinutes;

      if (overlaps) {
        clashes.push({
          courseA: `${a.courseCode} (${a.section.sectionName})`,
          sectionA: a.section.timeSlot,
          courseB: `${b.courseCode} (${b.section.sectionName})`,
          sectionB: b.section.timeSlot,
          day: commonDays.join(" & "),
          timeSlot: `${a.section.timeSlot} vs ${b.section.timeSlot}`,
        });
      }
    }
  }

  return clashes;
}
