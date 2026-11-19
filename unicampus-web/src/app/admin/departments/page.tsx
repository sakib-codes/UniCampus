"use client";

import { useState, useMemo } from "react";
import {
  Building2,
  Search,
  Plus,
  Users,
  GraduationCap,
  BookOpen,
  Settings,
  CheckCircle2,
  X,
  Download,
  ShieldCheck,
} from "lucide-react";
import { CAMPUS_METRICS } from "@/lib/canonicalCampus";

interface DepartmentData {
  id: string;
  code: string;
  codeNumber: string;
  division: string;
  name: string;
  initials: string;
  hodName: string;
  hodRole: string;
  hodBadge: string;
  office: string;
  totalStudents: number;
  totalFaculty: number;
  activePrograms: string[];
  status: "Accredited • Active" | "Pending Review";
  facultyList: {
    name: string;
    designation: string;
    office: string;
    email: string;
  }[];
  curriculumList: {
    code: string;
    title: string;
    credits: number;
    type: "Theory" | "Lab";
    semester: string;
  }[];
}

const DEPARTMENTS: DepartmentData[] = [
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

export default function AdminDepartmentsPage() {
  const [departments, setDepartments] = useState<DepartmentData[]>(DEPARTMENTS);
  const [searchFilter, setSearchFilter] = useState("");

  // Modals & Drawers
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedRosterDept, setSelectedRosterDept] = useState<DepartmentData | null>(null);
  const [selectedCurriculumDept, setSelectedCurriculumDept] = useState<DepartmentData | null>(null);
  const [selectedSettingsDept, setSelectedSettingsDept] = useState<DepartmentData | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Department Form State
  const [newDeptName, setNewDeptName] = useState("");
  const [newDeptCode, setNewDeptCode] = useState("");
  const [newDeptCodeNum, setNewDeptCodeNum] = useState("");
  const [newDeptDivision, setNewDeptDivision] = useState("");
  const [newDeptHod, setNewDeptHod] = useState("");
  const [newDeptOffice, setNewDeptOffice] = useState("");
  const [newDeptCapacity, setNewDeptCapacity] = useState("500");
  const [newDeptFacultyCount, setNewDeptFacultyCount] = useState("20");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered Departments
  const filteredDepartments = useMemo(() => {
    if (!searchFilter.trim()) return departments;
    const q = searchFilter.toLowerCase().trim();
    return departments.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.code.toLowerCase().includes(q) ||
        d.codeNumber.toLowerCase().includes(q) ||
        d.hodName.toLowerCase().includes(q) ||
        d.division.toLowerCase().includes(q) ||
        d.activePrograms.some((p) => p.toLowerCase().includes(q))
    );
  }, [departments, searchFilter]);

  const handleCreateDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName.trim() || !newDeptCode.trim()) return;

    const initials = newDeptHod
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "HD";

    const newDept: DepartmentData = {
      id: `dept-${newDeptCode.toLowerCase()}`,
      code: newDeptCode.toUpperCase().trim(),
      codeNumber: newDeptCodeNum.trim() || `CODE ${Math.floor(10 + Math.random() * 89)}`,
      division: newDeptDivision.trim() || "Undergraduate Studies",
      name: newDeptName.trim(),
      initials,
      hodName: newDeptHod.trim() || "Dean Appointee",
      hodRole: "Head of Department",
      hodBadge: "HOD",
      office: newDeptOffice.trim() || "Administrative Wing, Room 101",
      totalStudents: parseInt(newDeptCapacity) || 450,
      totalFaculty: parseInt(newDeptFacultyCount) || 18,
      activePrograms: ["B.Sc.", "M.Sc."],
      status: "Accredited • Active",
      facultyList: [
        {
          name: newDeptHod.trim() || "Dean Appointee",
          designation: "Professor & Head",
          office: newDeptOffice.trim() || "Administrative Wing, Room 101",
          email: `${newDeptCode.toLowerCase()}.head@unicampus.edu`,
        },
      ],
      curriculumList: [
        { code: `${newDeptCode}-1101`, title: "Foundations Course I", credits: 3.0, type: "Theory", semester: "1st Semester" },
        { code: `${newDeptCode}-1102`, title: "Foundations Practical Lab", credits: 1.5, type: "Lab", semester: "1st Semester" },
      ],
    };

    setDepartments((prev) => [newDept, ...prev]);
    setIsAddModalOpen(false);
    setNewDeptName("");
    setNewDeptCode("");
    setNewDeptCodeNum("");
    setNewDeptDivision("");
    setNewDeptHod("");
    setNewDeptOffice("");
    showToast(`Successfully created ${newDept.name} (${newDept.code}).`);
  };

  return (
    <div className="w-full space-y-6 antialiased selection:bg-brand/30 pb-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-white dark:bg-surface-2 border border-slate-200 dark:border-brand/40 text-xs font-semibold text-slate-900 dark:text-fg shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.6)] backdrop-blur-md">
          <div className="w-5 h-5 rounded-full bg-brand/10 dark:bg-brand/20 flex items-center justify-center text-brand dark:text-brand shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 dark:text-fg-muted hover:text-slate-900 dark:hover:text-fg transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 3. PAGE HEADER & SUMMARY ROW */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-line/60">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold tracking-[-0.02em] text-slate-900 dark:text-fg leading-tight">
            Academic Departments &amp; Programs
          </h1>
          <p className="text-xs sm:text-[13px] text-slate-500 dark:text-fg-muted mt-1 font-sans">
            Configure faculty leadership, student enrollment capacity, and accredited degree syllabi
          </p>
        </div>

        {/* Right: Search filter input + Primary button */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-fg-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter by code or dean..."
              className="bg-white dark:bg-surface text-slate-900 dark:text-fg placeholder:text-slate-400 dark:placeholder:text-fg-muted text-xs pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-line focus:border-brand focus:outline-none transition-colors w-52 sm:w-60 font-sans"
            />
            {searchFilter && (
              <button
                onClick={() => setSearchFilter("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-fg-muted hover:text-fg"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white transition-colors text-xs font-bold shadow-xs cursor-pointer active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Department</span>
          </button>
        </div>
      </div>

      {/* QUICK KPI STATS STRIP (#0D1117 cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/70 dark:bg-surface border border-white/80 dark:border-line backdrop-blur-xl rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <div className="text-xs font-mono text-slate-500 dark:text-fg-muted">Active Faculties</div>
            <div className="text-2xl font-mono font-bold text-slate-900 dark:text-fg mt-1 tabular-nums">
              {CAMPUS_METRICS.departmentsCount} <span className="text-xs font-normal text-slate-400 dark:text-fg-muted">Depts</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-surface-2 border border-slate-200 dark:border-line flex items-center justify-center text-brand">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white/70 dark:bg-surface border border-white/80 dark:border-line backdrop-blur-xl rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <div className="text-xs font-mono text-slate-500 dark:text-fg-muted">Total Enrolled Students</div>
            <div className="text-2xl font-mono font-bold text-slate-900 dark:text-fg mt-1 tabular-nums">
              {CAMPUS_METRICS.students.toLocaleString()}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-surface-2 border border-slate-200 dark:border-line flex items-center justify-center text-success">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white/70 dark:bg-surface border border-white/80 dark:border-line backdrop-blur-xl rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <div className="text-xs font-mono text-slate-500 dark:text-fg-muted">Accredited Faculty</div>
            <div className="text-2xl font-mono font-bold text-slate-900 dark:text-fg mt-1 tabular-nums">
              {CAMPUS_METRICS.faculty.toLocaleString()} <span className="text-xs font-normal text-slate-400 dark:text-fg-muted">Members</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-surface-2 border border-slate-200 dark:border-line flex items-center justify-center text-brand">
            <GraduationCap className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white/70 dark:bg-surface border border-white/80 dark:border-line backdrop-blur-xl rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <div className="text-xs font-mono text-slate-500 dark:text-fg-muted">Curriculum Sync Status</div>
            <div className="text-sm font-mono font-bold text-success mt-1.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-success"></span>
              <span>100% Verified</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-surface-2 border border-slate-200 dark:border-line flex items-center justify-center text-brand">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 4. DEPARTMENT CARD BENTO GRID (2 columns x 2 rows, 24px gap) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-1">
        {filteredDepartments.map((dept) => (
          <div
            key={dept.id}
            className="bg-white/70 dark:bg-surface border border-white/80 dark:border-line backdrop-blur-xl rounded-3xl p-[26px] relative flex flex-col justify-between hover:border-brand/60 transition-colors duration-200 shadow-sm group"
          >
            {/* Subtle Top-Edge Brand Accent Bar */}
            <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-brand to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>

            <div>
              {/* Top Row: Monospace Code Pill + Division + Status Badge */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-brand/15 text-brand border border-brand/30 tracking-tight">
                    {dept.code} • {dept.codeNumber}
                  </span>
                  <span className="text-xs font-sans font-medium text-slate-500 dark:text-fg-muted">{dept.division}</span>
                </div>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-[rgba(35,134,54,0.15)] text-success border border-success/40 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                  <span>{dept.status}</span>
                </span>
              </div>

              {/* Department Title */}
              <h2 className="text-xl font-bold text-slate-900 dark:text-fg tracking-[-0.02em] mb-4">
                {dept.name}
              </h2>

              {/* Head of Department Inset Box (#161B22 surface, 14px radius, 12px padding) */}
              <div className="bg-slate-50 dark:bg-surface-2 border border-slate-200 dark:border-line rounded-[14px] p-3 mb-5 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-brand/20 border border-brand/40 flex items-center justify-center font-mono font-bold text-brand text-xs shrink-0 shadow-sm">
                  {dept.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-fg truncate">
                      {dept.hodName}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-xs font-mono font-bold bg-white dark:bg-surface text-brand dark:text-brand border border-brand/30 dark:border-brand/30">
                      {dept.hodBadge}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-fg-muted font-sans flex items-center gap-2 mt-0.5 truncate">
                    <span className="font-mono text-slate-700 dark:text-fg/80 text-xs truncate">
                      Office: {dept.office}
                    </span>
                  </div>
                </div>
              </div>

              {/* 3-Column Metric Strip (JetBrains Mono tabular-nums) */}
              <div className="grid grid-cols-3 gap-2.5 mb-6">
                <div className="bg-slate-50 dark:bg-surface-2/70 border border-slate-200 dark:border-line/80 rounded-xl p-3 text-center">
                  <div className="text-xs font-mono text-slate-500 dark:text-fg-muted">
                    Total Students
                  </div>
                  <div className="text-lg font-mono font-bold text-slate-900 dark:text-fg tabular-nums mt-0.5">
                    {dept.totalStudents.toLocaleString()}
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-surface-2/70 border border-slate-200 dark:border-line/80 rounded-xl p-3 text-center">
                  <div className="text-xs font-mono text-slate-500 dark:text-fg-muted">
                    Total Faculty
                  </div>
                  <div className="text-lg font-mono font-bold text-slate-900 dark:text-fg tabular-nums mt-0.5">
                    {dept.totalFaculty}
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-surface-2/70 border border-slate-200 dark:border-line/80 rounded-xl p-3 text-center">
                  <div className="text-xs font-mono text-slate-500 dark:text-fg-muted">
                    Active Programs
                  </div>
                  <div className="text-xs font-mono font-bold text-brand mt-1.5 truncate">
                    {dept.activePrograms.join(", ")}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Action Links Bar (3 equal buttons/links) */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-line/60">
              <button
                onClick={() => setSelectedRosterDept(dept)}
                className="py-2 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-sans font-medium border border-slate-200 dark:bg-surface-2 dark:hover:bg-surface-2 dark:text-fg-muted dark:hover:text-fg dark:border-line transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Faculty Roster</span>
              </button>

              <button
                onClick={() => setSelectedCurriculumDept(dept)}
                className="py-2 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-sans font-medium border border-slate-200 dark:bg-surface-2 dark:hover:bg-surface-2 dark:text-fg-muted dark:hover:text-fg dark:border-line transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Curriculum</span>
              </button>

              <button
                onClick={() => setSelectedSettingsDept(dept)}
                className="py-2 px-2.5 rounded-lg bg-brand/15 hover:bg-brand/25 text-brand text-xs font-sans font-semibold border border-brand/30 transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Manage Settings</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* BOTTOM ENTERPRISE AUDIT LEDGER */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-fg-muted px-2 font-mono gap-2 pt-2 border-t border-line/50">
        <div>
          UniCampus Academic Council · Curriculum Registry · Active Semesters
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => showToast("Exported complete Curriculum Matrix PDF report.")}
            className="flex items-center gap-1 text-brand hover:underline cursor-pointer"
          >
            <Download className="w-3 h-3" />
            <span>Export Curriculum Matrix</span>
          </button>
          <span>•</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-success" />
            <span>Academic Department Directory</span>
          </span>
        </div>
      </div>

      {/* MODAL 1: Add Department */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 dark:bg-black/80 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-surface border border-slate-200 dark:border-line rounded-3xl w-full max-w-lg shadow-2xl p-6 relative">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-line pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand/10 dark:bg-brand/20 border border-brand/20 dark:border-brand/40 text-brand dark:text-brand flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-fg">
                    Create Academic Department
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-fg-muted">Establish new faculty unit and degree syllabus</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 dark:text-fg-muted hover:text-slate-900 dark:hover:text-fg hover:bg-slate-100 dark:hover:bg-surface-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDepartment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-fg-muted mb-1.5">
                  Department Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Civil & Environmental Engineering"
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-surface-2 border border-slate-200 dark:border-line focus:border-brand dark:focus:border-brand rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-fg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-fg-muted mb-1.5">
                    Acronym / Code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CEE"
                    value={newDeptCode}
                    onChange={(e) => setNewDeptCode(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-surface-2 border border-slate-200 dark:border-line focus:border-brand dark:focus:border-brand rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 dark:text-fg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-fg-muted mb-1.5">
                    Code Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CODE 18"
                    value={newDeptCodeNum}
                    onChange={(e) => setNewDeptCodeNum(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-surface-2 border border-slate-200 dark:border-line focus:border-brand dark:focus:border-brand rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 dark:text-fg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-fg-muted mb-1.5">
                  Head of Department / Dean Appointee
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prof. Dr. Tariqul Anam"
                  value={newDeptHod}
                  onChange={(e) => setNewDeptHod(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-surface-2 border border-slate-200 dark:border-line focus:border-brand dark:focus:border-brand rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-fg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-fg-muted mb-1.5">
                  Office Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Engineering Tower, Room 501"
                  value={newDeptOffice}
                  onChange={(e) => setNewDeptOffice(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-surface-2 border border-slate-200 dark:border-line focus:border-brand dark:focus:border-brand rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-fg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-fg-muted mb-1.5">
                    Student Capacity
                  </label>
                  <input
                    type="number"
                    value={newDeptCapacity}
                    onChange={(e) => setNewDeptCapacity(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-surface-2 border border-slate-200 dark:border-line focus:border-brand dark:focus:border-brand rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 dark:text-fg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-fg-muted mb-1.5">
                    Faculty Quota
                  </label>
                  <input
                    type="number"
                    value={newDeptFacultyCount}
                    onChange={(e) => setNewDeptFacultyCount(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-surface-2 border border-slate-200 dark:border-line focus:border-brand dark:focus:border-brand rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 dark:text-fg focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-line">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-fg-muted hover:text-slate-900 dark:hover:text-fg hover:bg-slate-100 dark:hover:bg-surface-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand hover:bg-brand-hover dark:bg-brand dark:hover:bg-brand-hover text-white text-xs font-bold shadow-md shadow-brand/25 dark:shadow-brand/25 cursor-pointer"
                >
                  Confirm &amp; Provision Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Faculty Roster Drawer/Modal */}
      {selectedRosterDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 dark:bg-black/80 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-surface border border-slate-200 dark:border-line rounded-3xl w-full max-w-xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-line pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-500/10 dark:bg-brand/20 border border-sky-500/20 dark:border-brand/40 text-sky-600 dark:text-brand flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-fg">
                    Faculty Roster • {selectedRosterDept.code}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-fg-muted font-sans">{selectedRosterDept.name}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRosterDept(null)}
                className="p-1.5 rounded-lg text-slate-400 dark:text-fg-muted hover:text-slate-900 dark:hover:text-fg hover:bg-slate-100 dark:hover:bg-surface-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {selectedRosterDept.facultyList.map((faculty, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50/90 dark:bg-surface-2 border border-slate-200 dark:border-line flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-slate-900 dark:text-fg flex items-center gap-2">
                      <span>{faculty.name}</span>
                      <span className="text-xs font-mono text-sky-600 dark:text-brand bg-sky-50 dark:bg-brand/10 px-1.5 py-0.5 rounded border border-sky-200 dark:border-brand/20">
                        {faculty.designation}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-fg-muted mt-1 font-sans">
                      <span>{faculty.office}</span> • <span className="font-mono text-slate-600 dark:text-fg-muted">{faculty.email}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => showToast(`Opening profile dossier for ${faculty.name}`)}
                    className="p-2 rounded-lg bg-white dark:bg-surface hover:bg-slate-50 dark:hover:bg-surface-2 text-slate-700 dark:text-fg-muted hover:text-slate-900 dark:hover:text-fg border border-slate-200 dark:border-line text-xs font-semibold transition-colors shrink-0 cursor-pointer"
                  >
                    View Dossier
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-4 mt-4 border-t border-slate-200 dark:border-line flex items-center justify-between text-xs text-slate-500 dark:text-fg-muted">
              <span>Showing {selectedRosterDept.facultyList.length} of {selectedRosterDept.totalFaculty} allocated faculty</span>
              <button
                onClick={() => setSelectedRosterDept(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-surface-2 border border-slate-200 dark:border-line text-slate-700 dark:text-fg font-semibold hover:bg-slate-200 dark:hover:bg-surface-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Curriculum Syllabus Modal */}
      {selectedCurriculumDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 dark:bg-black/80 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-surface border border-slate-200 dark:border-line rounded-3xl w-full max-w-2xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-line pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand/10 dark:bg-brand/20 border border-brand/20 dark:border-brand/40 text-brand dark:text-brand flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-fg">
                    Accredited Curriculum Syllabus • {selectedCurriculumDept.code}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-fg-muted font-sans">
                    {selectedCurriculumDept.name} • {selectedCurriculumDept.activePrograms.join(", ")}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCurriculumDept(null)}
                className="p-1.5 rounded-lg text-slate-400 dark:text-fg-muted hover:text-slate-900 dark:hover:text-fg hover:bg-slate-100 dark:hover:bg-surface-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
              {selectedCurriculumDept.curriculumList.map((course, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50/90 dark:bg-surface-2 border border-slate-200 dark:border-line flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-brand dark:text-brand bg-brand/5 dark:bg-surface px-2 py-0.5 rounded border border-brand/20 dark:border-line">
                        {course.code}
                      </span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-surface-2 text-slate-600 dark:text-fg-muted border border-slate-200 dark:border-line">
                        {course.semester}
                      </span>
                    </div>
                    <div className="font-bold text-xs text-slate-900 dark:text-fg truncate">
                      {course.title}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono text-xs text-emerald-700 dark:text-success font-semibold bg-emerald-50 dark:bg-[rgba(35,134,54,0.15)] px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-success/30">
                      {course.credits.toFixed(1)} Credits
                    </span>
                    <span className="font-mono text-xs text-slate-600 dark:text-fg-muted bg-white dark:bg-surface px-2 py-1 rounded border border-slate-200 dark:border-line">
                      {course.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 mt-4 border-t border-slate-200 dark:border-line flex items-center justify-between text-xs text-slate-500 dark:text-fg-muted">
              <span className="font-mono">Outcome-Based Education (OBE) Standard Compliant</span>
              <button
                onClick={() => setSelectedCurriculumDept(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-surface-2 border border-slate-200 dark:border-line text-slate-700 dark:text-fg font-semibold hover:bg-slate-200 dark:hover:bg-surface-2"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Manage Settings Modal */}
      {selectedSettingsDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 dark:bg-black/80 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-surface border border-slate-200 dark:border-line rounded-3xl w-full max-w-md shadow-2xl p-6 relative">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-line pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand/10 dark:bg-brand/20 border border-brand/20 dark:border-brand/40 text-brand dark:text-brand flex items-center justify-center">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-fg">
                    Department Parameters
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-fg-muted font-mono">{selectedSettingsDept.code} • Governance Settings</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSettingsDept(null)}
                className="p-1.5 rounded-lg text-slate-400 dark:text-fg-muted hover:text-slate-900 dark:hover:text-fg hover:bg-slate-100 dark:hover:bg-surface-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-fg-muted mb-1.5">
                  Assigned Head of Department
                </label>
                <input
                  type="text"
                  defaultValue={selectedSettingsDept.hodName}
                  className="w-full bg-slate-50 dark:bg-surface-2 border border-slate-200 dark:border-line focus:border-brand dark:focus:border-brand rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-fg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-fg-muted mb-1.5">
                  Office Location
                </label>
                <input
                  type="text"
                  defaultValue={selectedSettingsDept.office}
                  className="w-full bg-slate-50 dark:bg-surface-2 border border-slate-200 dark:border-line focus:border-brand dark:focus:border-brand rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-fg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-fg-muted mb-1.5">
                    Accreditation Status
                  </label>
                  <select
                    defaultValue={selectedSettingsDept.status}
                    className="w-full bg-slate-50 dark:bg-surface-2 border border-slate-200 dark:border-line focus:border-brand dark:focus:border-brand rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-fg focus:outline-none"
                  >
                    <option value="Accredited • Active">Accredited • Active</option>
                    <option value="Pending Review">Pending Review</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-fg-muted mb-1.5">
                    Total Enrolled Students
                  </label>
                  <input
                    type="number"
                    defaultValue={selectedSettingsDept.totalStudents}
                    className="w-full bg-slate-50 dark:bg-surface-2 border border-slate-200 dark:border-line focus:border-brand dark:focus:border-brand rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-fg focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-line">
                <button
                  type="button"
                  onClick={() => setSelectedSettingsDept(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-fg-muted hover:text-slate-900 dark:hover:text-fg hover:bg-slate-100 dark:hover:bg-surface-2"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSettingsDept(null);
                    showToast(`Updated parameters for ${selectedSettingsDept.name}.`);
                  }}
                  className="px-4 py-2 rounded-xl bg-brand hover:bg-brand-hover dark:bg-brand dark:hover:bg-brand-hover text-white text-xs font-bold shadow-md shadow-brand/25 dark:shadow-brand/25 cursor-pointer"
                >
                  Save Parameters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
