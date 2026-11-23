export interface DepartmentData {
  id: string;
  code: string;
  codeNumber: string;
  division: string;
  name: string;
  initials: string;
  hodName: string;
  hodRole: string;
  hodBadge: string;
  headTeacherId?: string | null;
  deptAdminId?: string | null;
  deptAdminName?: string | null;
  deptAdminEmail?: string | null;
  office: string;
  totalStudents: number;
  totalFaculty: number;
  totalSemesters?: number;
  activePrograms: string[];
  status: "Accredited • Active" | "Pending Review";
  facultyList: {
    id?: string;
    name: string;
    designation: string;
    office: string;
    email: string;
  }[];
  curriculumList: {
    id?: string;
    code: string;
    title: string;
    credits: number;
    type: "Theory" | "Lab";
    semester: string;
    semesterId?: string;
    assignedTeacherId?: string | null;
    assignedTeacherName?: string | null;
  }[];
}

export const DEPARTMENTS: DepartmentData[] = [
  {
    id: "dept-cse",
    code: "CSE",
    codeNumber: "CODE 15",
    division: "B.Sc. & M.Sc. Division",
    name: "Computer Science & Engineering",
    initials: "LR",
    hodName: "Prof. Dr. M. Lutfar Rahman",
    hodRole: "Head of Department",
    hodBadge: "HOD",
    office: "Academic Bldg 1, Room 401",
    totalStudents: 1420,
    totalFaculty: 42,
    activePrograms: ["B.Sc.", "M.Sc."],
    status: "Accredited • Active",
    facultyList: [
      { name: "Prof. Dr. M. Lutfar Rahman", designation: "Professor & Head", office: "Academic Bldg 1, Room 401", email: "lutfar.rahman@unicampus.edu" },
      { name: "Dr. Asif Rahman", designation: "Associate Professor", office: "Academic Bldg 1, Room 412", email: "asif.rahman@unicampus.edu" },
      { name: "Dr. Farhana Khan", designation: "Assistant Professor", office: "Academic Bldg 1, Room 418", email: "farhana.khan@unicampus.edu" },
      { name: "Tanvir Ahmed", designation: "Senior Lecturer", office: "Academic Bldg 1, Room 425", email: "tanvir.ahmed@unicampus.edu" },
    ],
    curriculumList: [
      { code: "CSE-3101", title: "Design & Analysis of Algorithms", credits: 3.0, type: "Theory", semester: "5th Semester" },
      { code: "CSE-3102", title: "Algorithms Lab & Problem Solving", credits: 1.5, type: "Lab", semester: "5th Semester" },
      { code: "CSE-3205", title: "Software Engineering & Architecture", credits: 3.0, type: "Theory", semester: "6th Semester" },
      { code: "CSE-3206", title: "Software Development Project Lab", credits: 1.5, type: "Lab", semester: "6th Semester" },
      { code: "CSE-4101", title: "Artificial Intelligence & Neural Nets", credits: 3.0, type: "Theory", semester: "7th Semester" },
    ],
  },
  {
    id: "dept-eee",
    code: "EEE",
    codeNumber: "CODE 14",
    division: "Circuits & Telecom",
    name: "Electrical & Electronic Engineering",
    initials: "SA",
    hodName: "Prof. Dr. Shahidul Alam",
    hodRole: "Head of Department",
    hodBadge: "HOD",
    office: "Academic Bldg 2, Room 204",
    totalStudents: 1080,
    totalFaculty: 38,
    activePrograms: ["B.Sc.", "M.Sc."],
    status: "Accredited • Active",
    facultyList: [
      { name: "Prof. Dr. Shahidul Alam", designation: "Professor & Head", office: "Academic Bldg 2, Room 204", email: "shahidul.alam@unicampus.edu" },
      { name: "Dr. Kazi Mostafa", designation: "Associate Professor", office: "Academic Bldg 2, Room 210", email: "kazi.mostafa@unicampus.edu" },
      { name: "Dr. Nasreen Akter", designation: "Assistant Professor", office: "Academic Bldg 2, Room 216", email: "nasreen.akter@unicampus.edu" },
    ],
    curriculumList: [
      { code: "EEE-2101", title: "Analog Electronics & Circuitry", credits: 3.0, type: "Theory", semester: "3rd Semester" },
      { code: "EEE-2102", title: "Electronics Circuit Design Lab", credits: 1.5, type: "Lab", semester: "3rd Semester" },
      { code: "EEE-3105", title: "Electromagnetic Fields & Waves", credits: 3.0, type: "Theory", semester: "5th Semester" },
      { code: "EEE-3201", title: "Digital Signal Processing", credits: 3.0, type: "Theory", semester: "6th Semester" },
    ],
  },
  {
    id: "dept-bba",
    code: "BBA",
    codeNumber: "CODE 11",
    division: "Executive & Grad",
    name: "School of Business Administration",
    initials: "NB",
    hodName: "Prof. Dr. Nazma Begum",
    hodRole: "Dean & Head",
    hodBadge: "DEAN",
    office: "Business Tower, Room 302",
    totalStudents: 960,
    totalFaculty: 34,
    activePrograms: ["BBA", "MBA", "EMBA"],
    status: "Accredited • Active",
    facultyList: [
      { name: "Prof. Dr. Nazma Begum", designation: "Dean & Professor", office: "Business Tower, Room 302", email: "nazma.begum@unicampus.edu" },
      { name: "Dr. Mahfuzul Huq", designation: "Associate Professor", office: "Business Tower, Room 308", email: "mahfuzul.huq@unicampus.edu" },
      { name: "Dr. Sabrina Parveen", designation: "Assistant Professor", office: "Business Tower, Room 314", email: "sabrina.parveen@unicampus.edu" },
    ],
    curriculumList: [
      { code: "BUS-1101", title: "Principles of Management", credits: 3.0, type: "Theory", semester: "1st Semester" },
      { code: "FIN-2201", title: "Corporate Finance & Valuation", credits: 3.0, type: "Theory", semester: "4th Semester" },
      { code: "MKT-3102", title: "Strategic Digital Marketing", credits: 3.0, type: "Theory", semester: "5th Semester" },
      { code: "MGT-4105", title: "Supply Chain & Operations", credits: 3.0, type: "Theory", semester: "7th Semester" },
    ],
  },
  {
    id: "dept-pharm",
    code: "PHARM",
    codeNumber: "CODE 22",
    division: "Clinical Sciences",
    name: "Department of Pharmacy & Life Sciences",
    initials: "RK",
    hodName: "Prof. Dr. Rezaul Karim",
    hodRole: "Head of Department",
    hodBadge: "HOD",
    office: "Science Complex, Room 105",
    totalStudents: 740,
    totalFaculty: 29,
    activePrograms: ["B.Pharm", "M.Pharm"],
    status: "Accredited • Active",
    facultyList: [
      { name: "Prof. Dr. Rezaul Karim", designation: "Professor & Head", office: "Science Complex, Room 105", email: "rezaul.karim@unicampus.edu" },
      { name: "Dr. Shamim Ara", designation: "Associate Professor", office: "Science Complex, Room 112", email: "shamim.ara@unicampus.edu" },
      { name: "Dr. Tariq Hasan", designation: "Assistant Professor", office: "Science Complex, Room 120", email: "tariq.hasan@unicampus.edu" },
    ],
    curriculumList: [
      { code: "PHM-1201", title: "Organic Pharmaceutical Chemistry", credits: 3.0, type: "Theory", semester: "2nd Semester" },
      { code: "PHM-1202", title: "Pharmaceutical Analysis Lab", credits: 1.5, type: "Lab", semester: "2nd Semester" },
      { code: "PHM-3105", title: "Pharmacology & Therapeutics I", credits: 3.0, type: "Theory", semester: "5th Semester" },
      { code: "PHM-4102", title: "Clinical Pharmacy & Toxicology", credits: 3.0, type: "Theory", semester: "7th Semester" },
    ],
  },
  {
    id: "dept-eng",
    code: "ENG",
    codeNumber: "CODE 18",
    division: "Humanities & Languages",
    name: "Department of English & Modern Languages",
    initials: "TA",
    hodName: "Prof. Dr. Tahmina Akhter",
    hodRole: "Head of Department",
    hodBadge: "HOD",
    office: "Arts & Humanities Bldg, Room 301",
    totalStudents: 620,
    totalFaculty: 25,
    activePrograms: ["B.A. (Hons)", "M.A."],
    status: "Accredited • Active",
    facultyList: [
      { name: "Prof. Dr. Tahmina Akhter", designation: "Professor & Head", office: "Arts & Humanities Bldg, Room 301", email: "tahmina.akhter@unicampus.edu" },
      { name: "Dr. Shafiqur Rahman", designation: "Associate Professor", office: "Arts & Humanities Bldg, Room 308", email: "shafiq.rahman@unicampus.edu" },
      { name: "Ms. Tania Sultana", designation: "Senior Lecturer", office: "Arts & Humanities Bldg, Room 315", email: "tania.sultana@unicampus.edu" },
    ],
    curriculumList: [
      { code: "ENG-1101", title: "English Reading & Academic Writing", credits: 3.0, type: "Theory", semester: "1st Semester" },
      { code: "ENG-1201", title: "Professional Communication & Linguistics", credits: 2.0, type: "Theory", semester: "2nd Semester" },
      { code: "ENG-2101", title: "Literary Theory & Criticism", credits: 3.0, type: "Theory", semester: "3rd Semester" },
    ],
  },
];
