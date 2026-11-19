/**
 * UniCampus Institutional Faculty & Leadership Directory Data
 * Contains comprehensive profiles for Board Chairman, Principal, Vice Principal,
 * and Department-wise Academic Faculty across CSE, EEE, BBA, Pharmacy, Mathematics, and English.
 */

import {
  CANONICAL_COURSES,
  CANONICAL_CSE_HOD,
  CANONICAL_FACULTY,
} from '@/lib/canonicalCampus';

export type FacultyCategory = 'leadership' | 'academic';

export type FacultyStatus = 
  | 'In Office' 
  | 'In Class' 
  | 'In Meeting' 
  | 'Online Consultation' 
  | 'On Leave';

export interface FacultyCourse {
  code: string;
  title: string;
  credit: number;
  enrollment: number;
}

export interface FacultyConsultation {
  day: string;
  time: string;
  room: string;
}

export interface FacultyMember {
  id: string;
  name: string;
  honorificTitle?: string;
  facultyCode: string;
  role: string;
  designationCategory: 'Chairman' | 'Principal' | 'Vice Principal' | 'Dean' | 'Head of Department' | 'Professor' | 'Associate Professor' | 'Assistant Professor' | 'Senior Lecturer' | 'Lecturer' | 'Visiting Professor';
  category: FacultyCategory;
  isLeadership?: boolean;
  department: string;
  departmentCode: 'EXEC' | 'CSE' | 'EEE' | 'BBA' | 'PHARM' | 'MAT' | 'ENG' | 'AI';
  office: string;
  email: string;
  phone: string;
  status: FacultyStatus;
  avatar: string;
  bio: string;
  qualifications: string[];
  executivePortfolios?: string[];
  courses: FacultyCourse[];
  consultations: FacultyConsultation[];
}

export const FACULTY_MEMBERS: FacultyMember[] = [
  // ==========================================
  // EXECUTIVE INSTITUTIONAL LEADERSHIP
  // ==========================================
  {
    id: 'lead-chairman',
    name: 'Prof. Dr. M. Shamsul Haque',
    honorificTitle: 'Chairman, Board of Trustees',
    facultyCode: 'EXEC-001',
    role: 'Chairman, Board of Trustees & Professor Emeritus',
    designationCategory: 'Chairman',
    category: 'leadership',
    isLeadership: true,
    department: 'Board of Trustees & Institutional Governance',
    departmentCode: 'EXEC',
    office: 'Executive Suite 101 • Chancellor Tower',
    email: 'chairman@unicampus.edu',
    phone: '+880 1711-001001',
    status: 'In Office',
    avatar: '',
    bio: 'Prof. Dr. M. Shamsul Haque is the Chairman of the Board of Trustees at UniCampus. With over 35 years in tertiary education leadership, he has spearheaded institutional vision, university accreditation, global academic partnerships, and higher education governance.',
    qualifications: [
      'Ph.D. in Higher Education Policy & Administration — University of Oxford, UK',
      'M.Sc. in Applied Physics & Electronics — University of Dhaka',
      'Fellow of the Royal Society of Arts (FRSA)',
    ],
    executivePortfolios: [
      'UniCampus Strategic Vision 2030 Council',
      'International University Accreditation & Governance',
      'Endowment & Capital Development Committee',
    ],
    courses: [
      { code: 'GOV 901', title: 'Institutional Governance & Strategic Policy', credit: 3.0, enrollment: 24 },
      { code: 'EDU 802', title: 'Global Higher Education Systems Seminar', credit: 3.0, enrollment: 18 },
    ],
    consultations: [
      { day: 'Sunday', time: '11:00 AM - 01:00 PM', room: 'Chancellor Suite 101' },
      { day: 'Wednesday', time: '03:00 PM - 05:00 PM', room: 'Chancellor Suite 101 (By Appointment)' },
    ],
  },
  {
    id: 'lead-principal',
    name: 'Prof. Dr. A. K. M. Fazlul Karim',
    honorificTitle: 'Principal & Vice-Chancellor',
    facultyCode: 'EXEC-002',
    role: 'Principal, Chief Academic Officer & Senior Professor',
    designationCategory: 'Principal',
    category: 'leadership',
    isLeadership: true,
    department: 'Office of the Principal & Academic Council',
    departmentCode: 'EXEC',
    office: 'Principal Suite 201 • Administrative Block A',
    email: 'principal@unicampus.edu',
    phone: '+880 1712-002002',
    status: 'In Office',
    avatar: '',
    bio: 'Prof. Dr. A. K. M. Fazlul Karim serves as the Principal and Chief Academic Officer of UniCampus. An internationally recognized scholar in Distributed Systems and Computer Engineering, he oversees academic policies, faculty excellence, and student progression.',
    qualifications: [
      'Ph.D. in Computer Science & Engineering — Stanford University, USA',
      'M.Sc. in Computer Engineering — BUET',
      'Senior Member, IEEE & Life Fellow of Computer Society',
    ],
    executivePortfolios: [
      'Chair of the Academic Council & Examination Board',
      'Faculty Recruitment & Doctoral Fellowship Committee',
      'Inter-Departmental Research Grants Directorate',
    ],
    courses: [
      { code: 'CSE 4901', title: 'Advanced Distributed Systems Architecture', credit: 3.0, enrollment: 42 },
      { code: 'CSE 4902', title: 'Graduate Colloquium on Emerging Tech', credit: 2.0, enrollment: 30 },
    ],
    consultations: [
      { day: 'Monday', time: '10:30 AM - 12:30 PM', room: 'Principal Suite 201' },
      { day: 'Thursday', time: '02:30 PM - 04:30 PM', room: 'Principal Suite 201' },
    ],
  },
  {
    id: 'lead-vp',
    name: 'Prof. Dr. Mahmuda Begum',
    honorificTitle: 'Vice Principal & Pro-VC',
    facultyCode: 'EXEC-003',
    role: 'Vice Principal & Dean of Academic Affairs',
    designationCategory: 'Vice Principal',
    category: 'leadership',
    isLeadership: true,
    department: 'Office of the Vice Principal & Academic Affairs',
    departmentCode: 'EXEC',
    office: 'Vice Principal Suite 202 • Administrative Block A',
    email: 'viceprincipal@unicampus.edu',
    phone: '+880 1713-003003',
    status: 'In Meeting',
    avatar: '',
    bio: 'Prof. Dr. Mahmuda Begum leads university academic curriculum modernization, faculty evaluation, and student welfare as Vice Principal. Her research in Signal Processing and Telecommunications has won multiple national awards.',
    qualifications: [
      'Ph.D. in Electrical & Computer Engineering — Imperial College London, UK',
      'M.Sc. in Electrical & Electronic Engineering — BUET',
      'Chair, Women in Engineering (WIE) National Chapter',
    ],
    executivePortfolios: [
      'Academic Curriculum Standardization Directorate',
      'Student Welfare & Grievance Redressal Committee',
      'Institutional Ethics & Academic Integrity Council',
    ],
    courses: [
      { code: 'EEE 4201', title: 'Digital Signal Processing & Wavelets', credit: 3.0, enrollment: 54 },
      { code: 'ENG 3102', title: 'Engineering Research Methodology', credit: 2.0, enrollment: 65 },
    ],
    consultations: [
      { day: 'Sunday', time: '02:00 PM - 04:00 PM', room: 'VP Suite 202' },
      { day: 'Tuesday', time: '02:00 PM - 04:00 PM', room: 'VP Suite 202' },
    ],
  },

  // ==========================================
  // DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING
  // ==========================================
  {
    id: CANONICAL_CSE_HOD.facultyPageId,
    name: CANONICAL_CSE_HOD.name,
    honorificTitle: 'Professor & HOD',
    facultyCode: CANONICAL_CSE_HOD.facultyCode,
    role: 'Professor & Head of Department (CSE)',
    designationCategory: 'Head of Department',
    category: 'academic',
    department: CANONICAL_CSE_HOD.departmentName,
    departmentCode: 'CSE',
    office: CANONICAL_CSE_HOD.office,
    email: CANONICAL_CSE_HOD.email,
    phone: CANONICAL_CSE_HOD.phone,
    status: 'In Office',
    avatar: '',
    bio: 'Prof. Dr. M. Lutfar Rahman serves as Professor and Head of the Department of Computer Science & Engineering. His research spans formal verification, compiler optimization, and university-scale distributed computing systems.',
    qualifications: [
      'Ph.D. in Computer Science — University of Toronto, Canada',
      'M.Sc. in Computer Science & Engineering — BUET',
      'Fellow, Bangladesh Computer Society',
    ],
    courses: [
      { code: 'CSE-4101', title: 'Compiler Construction & Formal Languages', credit: 3.0, enrollment: 52 },
      { code: 'CSE-499', title: 'Senior Undergraduate Capstone Supervision', credit: 6.0, enrollment: 38 },
    ],
    consultations: [
      { day: 'Sunday', time: '11:00 AM - 01:00 PM', room: 'Academic Bldg 1, Room 401' },
      { day: 'Tuesday', time: '02:00 PM - 04:00 PM', room: 'Academic Bldg 1, Room 401' },
    ],
  },
  {
    id: CANONICAL_FACULTY.facultyPageId,
    name: CANONICAL_FACULTY.name,
    honorificTitle: CANONICAL_FACULTY.designation,
    facultyCode: CANONICAL_FACULTY.facultyCode,
    role: CANONICAL_FACULTY.designation,
    designationCategory: 'Associate Professor',
    category: 'academic',
    department: CANONICAL_FACULTY.departmentName,
    departmentCode: 'CSE',
    office: CANONICAL_FACULTY.office,
    email: CANONICAL_FACULTY.email,
    phone: CANONICAL_FACULTY.phone,
    status: 'In Office',
    avatar: '',
    bio: 'Dr. Asif Rahman serves as an Associate Professor in the Department of Computer Science & Engineering. His research focuses on algorithm design, network flow optimization, and high-performance distributed computing.',
    qualifications: [
      'Ph.D. in Computer Science — National University of Singapore (NUS)',
      'B.Sc. in Computer Science & Engineering — BUET',
      'Senior Member of ACM & IEEE',
    ],
    courses: [
      { code: CANONICAL_COURSES['CSE-3101'].code, title: CANONICAL_COURSES['CSE-3101'].title, credit: CANONICAL_COURSES['CSE-3101'].credit, enrollment: 93 },
      { code: CANONICAL_COURSES['CSE-4109'].code, title: CANONICAL_COURSES['CSE-4109'].title, credit: CANONICAL_COURSES['CSE-4109'].credit, enrollment: 36 },
      { code: CANONICAL_COURSES['CSE-3102'].code, title: CANONICAL_COURSES['CSE-3102'].title, credit: CANONICAL_COURSES['CSE-3102'].credit, enrollment: 45 },
    ],
    consultations: [
      { day: 'Monday', time: '04:15 PM - 05:30 PM', room: 'Room 508' },
    ],
  },
  {
    id: '2',
    name: 'Dr. Kabir Hossain',
    honorificTitle: 'Professor & Dean',
    facultyCode: 'T-CSE-02',
    role: 'Professor & Dean, Faculty of Engineering',
    designationCategory: 'Dean',
    category: 'academic',
    department: 'Computer Science & Engineering',
    departmentCode: 'CSE',
    office: 'Room 401 • Block B',
    email: 'kabir.cse@unicampus.edu',
    phone: '+880 1819-234567',
    status: 'In Class',
    avatar: '',
    bio: 'Dr. Kabir Hossain is a Professor in CSE and Dean of the Faculty of Engineering. Specializing in graph algorithms, combinatorial optimization, and quantum computing paradigms, he has authored over 40 peer-reviewed journal papers.',
    qualifications: [
      'Ph.D. in Computer Science — University of Melbourne, Australia',
      'M.Sc. in CSE — University of Dhaka',
    ],
    courses: [
      { code: 'CSE 2101', title: 'Data Structures & Graph Algorithms', credit: 3.0, enrollment: 72 },
      { code: 'CSE 2102', title: 'Algorithms Laboratory Workshop', credit: 1.5, enrollment: 36 },
      { code: 'CSE 4501', title: 'Computational Complexity & Automata', credit: 3.0, enrollment: 40 },
    ],
    consultations: [
      { day: 'Monday', time: '11:00 AM - 01:00 PM', room: 'Cabin 401 • Block B' },
      { day: 'Wednesday', time: '11:00 AM - 01:00 PM', room: 'Cabin 401 • Block B' },
    ],
  },
  {
    id: '6',
    name: 'Dr. Tariqul Islam',
    honorificTitle: 'Associate Professor',
    facultyCode: 'T-CSE-04',
    role: 'Associate Professor',
    designationCategory: 'Associate Professor',
    category: 'academic',
    department: 'Computer Science & Engineering',
    departmentCode: 'CSE',
    office: 'Room 404 • Block B',
    email: 'tariqul.cse@unicampus.edu',
    phone: '+880 1616-778899',
    status: 'In Office',
    avatar: '',
    bio: 'Dr. Tariqul Islam specializes in database management systems, computer network protocols, and applied cryptographic systems. He directs the UniCampus Cyber Security Research Hub.',
    qualifications: [
      'Ph.D. in Cybersecurity & Networking — TU Munich, Germany',
      'M.Sc. in Computer Engineering — BUET',
      'Certified Information Systems Security Professional (CISSP)',
    ],
    courses: [
      { code: CANONICAL_COURSES['CSE-3103'].code, title: CANONICAL_COURSES['CSE-3103'].title, credit: CANONICAL_COURSES['CSE-3103'].credit, enrollment: 64 },
      { code: 'CSE 3301', title: 'Computer Networks & Protocols', credit: 3.0, enrollment: 60 },
      { code: 'CSE 4305', title: 'Network Security & Applied Cryptography', credit: 3.0, enrollment: 40 },
    ],
    consultations: [
      { day: 'Tuesday', time: '10:00 AM - 12:00 PM', room: 'Cabin 404 • Block B' },
      { day: 'Thursday', time: '01:00 PM - 02:30 PM', room: 'Cabin 404 • Block B' },
    ],
  },
  {
    id: '5',
    name: 'Farhan Tanvir',
    honorificTitle: 'Senior Lecturer',
    facultyCode: 'T-CSE-05',
    role: 'Senior Lecturer & Lab Director',
    designationCategory: 'Senior Lecturer',
    category: 'academic',
    department: 'Computer Science & Engineering',
    departmentCode: 'CSE',
    office: 'Room 403 • Block B',
    email: 'farhan.cse@unicampus.edu',
    phone: '+880 1515-889900',
    status: 'In Class',
    avatar: '',
    bio: 'Farhan Tanvir teaches core programming fundamentals, compiler construction, and modern web application development. He also mentors student hackathon delegations.',
    qualifications: [
      'M.Sc. in Computer Science & Engineering — BUET',
      'B.Sc. in CSE — UniCampus (Valedictorian)',
    ],
    courses: [
      { code: 'CSE 1101', title: 'Structured Programming Language (C)', credit: 3.0, enrollment: 70 },
      { code: 'CSE 3105', title: 'Compiler Design & Automata', credit: 3.0, enrollment: 50 },
      { code: 'CSE 3112', title: 'Full-Stack Web Engineering Lab', credit: 1.5, enrollment: 35 },
    ],
    consultations: [
      { day: 'Sunday', time: '11:30 AM - 01:00 PM', room: 'Cabin 403 • Block B' },
      { day: 'Wednesday', time: '02:30 PM - 04:00 PM', room: 'Cabin 403 • Block B' },
    ],
  },
  {
    id: '4',
    name: 'Dr. Jane Doe',
    honorificTitle: 'Visiting Professor',
    facultyCode: 'T-AI-01',
    role: 'Visiting Professor & AI Chair',
    designationCategory: 'Visiting Professor',
    category: 'academic',
    department: 'Artificial Intelligence & Ethics',
    departmentCode: 'AI',
    office: 'Room 501 • Block C',
    email: 'jane.ai@unicampus.edu',
    phone: '+880 1722-456789',
    status: 'In Office',
    avatar: '',
    bio: 'Dr. Jane Doe is a Visiting Scholar from UC Berkeley specializing in AI alignment, neural network interpretability, and ethical regulatory frameworks in machine intelligence.',
    qualifications: [
      'Ph.D. in Artificial Intelligence — UC Berkeley, USA',
      'Postdoctoral Fellowship — MIT CSAIL',
    ],
    courses: [
      { code: 'CSE 4301', title: 'Machine Learning & Neural Networks', credit: 3.0, enrollment: 45 },
      { code: 'CSE 4302', title: 'Ethical AI Governance & Alignment', credit: 2.0, enrollment: 45 },
    ],
    consultations: [
      { day: 'Saturday', time: '03:00 PM - 05:00 PM', room: 'Seminar Hall 501 • Block C' },
    ],
  },

  // ==========================================
  // DEPARTMENT OF ELECTRICAL & ELECTRONIC ENGINEERING
  // ==========================================
  {
    id: '7',
    name: 'Prof. Jamal Uddin',
    honorificTitle: 'Professor & HOD',
    facultyCode: 'T-EEE-01',
    role: 'Professor & Head of Department (EEE)',
    designationCategory: 'Head of Department',
    category: 'academic',
    department: 'Electrical & Electronic Engineering',
    departmentCode: 'EEE',
    office: 'Room 301 • Block D',
    email: 'jamal.eee@unicampus.edu',
    phone: '+880 1714-556677',
    status: 'In Office',
    avatar: '',
    bio: 'Prof. Jamal Uddin has over two decades of research in power systems grid stability, renewable smart grid topologies, and high-voltage transmission safety.',
    qualifications: [
      'Ph.D. in Power Systems — University of Manchester, UK',
      'M.Sc. in EEE — BUET',
      'Fellow of the Institution of Engineers (FIEB)',
    ],
    courses: [
      { code: 'EEE 101', title: 'Electrical Circuits I (DC & AC Analysis)', credit: 3.0, enrollment: 65 },
      { code: 'EEE 311', title: 'Power System Analysis & Grid Protection', credit: 3.0, enrollment: 52 },
    ],
    consultations: [
      { day: 'Monday', time: '02:00 PM - 03:30 PM', room: 'Cabin 301 • Block D' },
      { day: 'Wednesday', time: '02:00 PM - 03:30 PM', room: 'Cabin 301 • Block D' },
    ],
  },
  {
    id: '8',
    name: 'Dr. Mahbub Hasan',
    honorificTitle: 'Associate Professor',
    facultyCode: 'T-EEE-02',
    role: 'Associate Professor & Dept Administrator',
    designationCategory: 'Associate Professor',
    category: 'academic',
    department: 'Electrical & Electronic Engineering',
    departmentCode: 'EEE',
    office: 'Room 304 • Block D',
    email: 'eee.admin@unicampus.edu',
    phone: '+880 1817-667788',
    status: 'In Class',
    avatar: '',
    bio: 'Dr. Mahbub Hasan leads research in semiconductor device physics, microelectronics fabrication, and embedded IoT hardware designs for smart agricultural sensing.',
    qualifications: [
      'Ph.D. in Microelectronics — KAIST, South Korea',
      'B.Sc. in EEE — BUET',
    ],
    courses: [
      { code: 'EEE 121', title: 'Electronic Circuits & Semiconductor Devices', credit: 3.0, enrollment: 58 },
      { code: 'EEE 211', title: 'Signals, Systems & Transform Methods', credit: 3.0, enrollment: 60 },
    ],
    consultations: [
      { day: 'Tuesday', time: '11:00 AM - 12:30 PM', room: 'Cabin 304 • Block D' },
      { day: 'Thursday', time: '11:00 AM - 12:30 PM', room: 'Cabin 304 • Block D' },
    ],
  },

  // ==========================================
  // DEPARTMENT OF BUSINESS ADMINISTRATION
  // ==========================================
  {
    id: '9',
    name: 'Dr. Farhana Khan',
    honorificTitle: 'Professor & HOD',
    facultyCode: 'T-BBA-01',
    role: 'Professor & Head of Department (BBA)',
    designationCategory: 'Head of Department',
    category: 'academic',
    department: 'Business Administration',
    departmentCode: 'BBA',
    office: 'Room 201 • Business Tower',
    email: 'farhana.bba@unicampus.edu',
    phone: '+880 1718-990011',
    status: 'In Office',
    avatar: '',
    bio: 'Dr. Farhana Khan is an authority in Strategic Management and Corporate Governance. She advises emerging FinTech ventures and oversees the UniCampus Executive MBA Curriculum.',
    qualifications: [
      'Ph.D. in Strategic Management — London Business School, UK',
      'MBA in Finance — IBA, University of Dhaka',
    ],
    courses: [
      { code: 'BBA 101', title: 'Principles of Management & Leadership', credit: 3.0, enrollment: 80 },
      { code: 'BBA 401', title: 'Strategic Business Policy & Corporate Capstone', credit: 3.0, enrollment: 62 },
    ],
    consultations: [
      { day: 'Sunday', time: '10:00 AM - 12:00 PM', room: 'Executive Cabin 201 • Business Tower' },
      { day: 'Thursday', time: '10:00 AM - 12:00 PM', room: 'Executive Cabin 201 • Business Tower' },
    ],
  },
  {
    id: '10',
    name: 'Nazia Rahman, MBA',
    honorificTitle: 'Assistant Professor',
    facultyCode: 'T-BBA-02',
    role: 'Assistant Professor & Department Coordinator',
    designationCategory: 'Assistant Professor',
    category: 'academic',
    department: 'Business Administration',
    departmentCode: 'BBA',
    office: 'Room 205 • Business Tower',
    email: 'bba.admin@unicampus.edu',
    phone: '+880 1914-223344',
    status: 'In Meeting',
    avatar: '',
    bio: 'Nazia Rahman specializes in digital marketing ecosystems, consumer analytics, and brand equity development. She serves as faculty advisor for the UniCampus Business & Entrepreneurship Club.',
    qualifications: [
      'MBA in Marketing — University of Toronto, Canada',
      'BBA in International Business — University of Dhaka',
    ],
    courses: [
      { code: 'BBA 211', title: 'Principles of Marketing & Consumer Analytics', credit: 3.0, enrollment: 75 },
      { code: 'BBA 315', title: 'Human Resource Strategy & Organizational Behavior', credit: 3.0, enrollment: 64 },
    ],
    consultations: [
      { day: 'Monday', time: '03:00 PM - 04:30 PM', room: 'Cabin 205 • Business Tower' },
      { day: 'Wednesday', time: '03:00 PM - 04:30 PM', room: 'Cabin 205 • Business Tower' },
    ],
  },

  // ==========================================
  // DEPARTMENT OF MATHEMATICS & NATURAL SCIENCES
  // ==========================================
  {
    id: '3',
    name: 'Shirley Manson',
    honorificTitle: 'Senior Lecturer & Head',
    facultyCode: 'T-MAT-01',
    role: 'Senior Lecturer & Head of Mathematics',
    designationCategory: 'Head of Department',
    category: 'academic',
    department: 'Department of Mathematics',
    departmentCode: 'MAT',
    office: 'Room 305 • Block A',
    email: 'shirley.math@unicampus.edu',
    phone: '+880 1911-345678',
    status: 'Online Consultation',
    avatar: '',
    bio: 'Shirley Manson specializes in discrete mathematical structures, abstract algebraic rings, and linear algebra applications for cryptographic proofs and computational graphics.',
    qualifications: [
      'M.Sc. in Pure Mathematics — University of Edinburgh, UK',
      'B.Sc. (Honours) in Mathematics — University of Dhaka',
    ],
    courses: [
      { code: 'MATH 1105', title: 'Discrete Mathematics & Combinatorics', credit: 3.0, enrollment: 80 },
      { code: 'MATH 2103', title: 'Linear Algebra, Eigenvalues & Vector Spaces', credit: 3.0, enrollment: 55 },
    ],
    consultations: [
      { day: 'Sunday', time: '10:00 AM - 12:00 PM', room: 'Online Meet / Cabin 305' },
      { day: 'Thursday', time: '02:00 PM - 03:30 PM', room: 'Cabin 305 • Block A' },
    ],
  },
  {
    id: '12',
    name: 'Dr. Rafiqul Alam',
    honorificTitle: 'Associate Professor',
    facultyCode: 'T-PHY-01',
    role: 'Associate Professor of Applied Physics',
    designationCategory: 'Associate Professor',
    category: 'academic',
    department: 'Department of Mathematics & Natural Sciences',
    departmentCode: 'MAT',
    office: 'Room 308 • Block A',
    email: 'rafiqul.phys@unicampus.edu',
    phone: '+880 1715-667799',
    status: 'In Office',
    avatar: '',
    bio: 'Dr. Rafiqul Alam explores quantum mechanics, electrodynamics, and solid-state materials for next-generation solar photovoltaics.',
    qualifications: [
      'Ph.D. in Condensed Matter Physics — Uppsala University, Sweden',
      'M.Sc. in Physics — University of Dhaka',
    ],
    courses: [
      { code: 'PHY 101', title: 'Physics I: Classical Mechanics & Thermodynamics', credit: 3.0, enrollment: 78 },
      { code: 'PHY 102', title: 'Physics Laboratory Experiments', credit: 1.5, enrollment: 38 },
    ],
    consultations: [
      { day: 'Monday', time: '01:00 PM - 02:30 PM', room: 'Cabin 308 • Block A' },
      { day: 'Wednesday', time: '01:00 PM - 02:30 PM', room: 'Cabin 308 • Block A' },
    ],
  },

  // ==========================================
  // DEPARTMENT OF ENGLISH & HUMANITIES
  // ==========================================
  {
    id: '11',
    name: 'Dr. Nusrat Jahan',
    honorificTitle: 'Associate Professor & HOD',
    facultyCode: 'T-ENG-01',
    role: 'Associate Professor & Head of English',
    designationCategory: 'Head of Department',
    category: 'academic',
    department: 'Department of English & Humanities',
    departmentCode: 'ENG',
    office: 'Room 105 • Humanities Block',
    email: 'nusrat.eng@unicampus.edu',
    phone: '+880 1812-778899',
    status: 'In Office',
    avatar: '',
    bio: 'Dr. Nusrat Jahan is a scholar of modern post-colonial literature, linguistic pedagogy, and technical professional communication for engineers and corporate leaders.',
    qualifications: [
      'Ph.D. in English Linguistics & Applied Literature — University of Warwick, UK',
      'M.A. in English — University of Dhaka',
    ],
    courses: [
      { code: 'ENG 101', title: 'English Reading Skills & Academic Writing', credit: 3.0, enrollment: 88 },
      { code: 'ENG 202', title: 'Technical English & Professional Communication', credit: 3.0, enrollment: 70 },
    ],
    consultations: [
      { day: 'Tuesday', time: '01:30 PM - 03:00 PM', room: 'Cabin 105 • Humanities Block' },
      { day: 'Thursday', time: '01:30 PM - 03:00 PM', room: 'Cabin 105 • Humanities Block' },
    ],
  },

  // ==========================================
  // DEPARTMENT OF PHARMACY
  // ==========================================
  {
    id: '14',
    name: 'Prof. Dr. Rezaul Karim',
    honorificTitle: 'Professor & HOD',
    facultyCode: 'T-PHARM-01',
    role: 'Professor & Head of Department (PHARM)',
    designationCategory: 'Head of Department',
    category: 'academic',
    department: 'Department of Pharmacy',
    departmentCode: 'PHARM',
    office: 'Science Complex, Room 105',
    email: 'rezaul.pharm@unicampus.edu',
    phone: '+880 1716-445566',
    status: 'In Office',
    avatar: '',
    bio: 'Prof. Dr. Rezaul Karim serves as Professor and Head of the Department of Pharmacy. His research focuses on clinical pharmacology, targeted drug delivery systems, and pharmaceutical quality assurance.',
    qualifications: [
      'Ph.D. in Pharmaceutical Sciences — University of Tokyo, Japan',
      'M.Pharm. in Clinical Pharmacy & Pharmacology — University of Dhaka',
      'Registered Senior Pharmacist, Pharmacy Council of Bangladesh',
    ],
    courses: [
      { code: 'PHARM-101', title: 'Pharmaceutical Chemistry & Dosage Design', credit: 3.0, enrollment: 74 },
      { code: 'PHARM-301', title: 'Clinical Pharmacology & Therapeutics', credit: 3.0, enrollment: 68 },
    ],
    consultations: [
      { day: 'Sunday', time: '02:00 PM - 03:30 PM', room: 'Science Complex, Room 105' },
      { day: 'Wednesday', time: '11:00 AM - 12:30 PM', room: 'Science Complex, Room 105' },
    ],
  },
];

/**
 * Quick helper to find a faculty member by ID or alias
 */
export function getFacultyById(id: string): FacultyMember | undefined {
  if (!id) return undefined;
  
  // Direct match
  const found = FACULTY_MEMBERS.find((m) => m.id === id);
  if (found) return found;

  // Numerical aliases for leadership
  if (id === '101') return FACULTY_MEMBERS.find((m) => m.id === 'lead-chairman');
  if (id === '102') return FACULTY_MEMBERS.find((m) => m.id === 'lead-principal');
  if (id === '103') return FACULTY_MEMBERS.find((m) => m.id === 'lead-vp');

  return undefined;
}

