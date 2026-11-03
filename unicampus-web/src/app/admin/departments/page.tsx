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
  FileSpreadsheet,
  Download,
  Award,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Briefcase,
  Layers,
  Calendar,
  ExternalLink,
  Edit3,
  Check
} from "lucide-react";
import { themeTokens } from "@/lib/theme";

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
    totalStudents: 1240,
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
    <div className="w-full space-y-6 antialiased selection:bg-[#2563EB]/30 pb-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#2563EB]/40 text-xs font-semibold text-slate-900 dark:text-[#F0F6FC] shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.6)] backdrop-blur-md animate-in slide-in-from-bottom-3 duration-200">
          <div className="w-5 h-5 rounded-full bg-brand/10 dark:bg-[#2563EB]/20 flex items-center justify-center text-brand dark:text-[#2563EB] shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-[#F0F6FC] transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 3. PAGE HEADER & SUMMARY ROW */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-[#30363D]/60">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold tracking-[-0.02em] text-slate-900 dark:text-[#F0F6FC] font-manrope leading-tight">
            Academic Departments &amp; Programs
          </h1>
          <p className="text-xs sm:text-[13px] text-slate-500 dark:text-[#8D96A0] mt-1 font-sans">
            Configure faculty leadership, student enrollment capacity, and accredited degree syllabi
          </p>
        </div>

        {/* Right: Search filter input + Primary button */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-[#8D96A0] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter by code or dean..."
              className="bg-white dark:bg-[#0D1117] text-slate-900 dark:text-[#F0F6FC] placeholder:text-slate-400 dark:placeholder:text-[#8D96A0] text-xs pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-[#30363D] focus:border-[#2563EB] focus:outline-none transition-colors w-52 sm:w-60 font-sans"
            />
            {searchFilter && (
              <button
                onClick={() => setSearchFilter("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8D96A0] hover:text-[#F0F6FC]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#5752E5] text-white transition-all text-xs font-bold font-manrope shadow-[0_0_20px_rgba(37, 99, 235,0.35)] cursor-pointer active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Department</span>
          </button>
        </div>
      </div>

      {/* QUICK KPI STATS STRIP (#0D1117 cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/70 dark:bg-[#0D1117] border border-white/80 dark:border-[#30363D] backdrop-blur-xl rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-[#8D96A0]">Active Faculties</div>
            <div className="text-2xl font-mono font-bold text-slate-900 dark:text-[#F0F6FC] mt-1 tabular-nums">
              4 <span className="text-xs font-normal text-slate-400 dark:text-[#8D96A0]">Depts</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] flex items-center justify-center text-[#2563EB]">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white/70 dark:bg-[#0D1117] border border-white/80 dark:border-[#30363D] backdrop-blur-xl rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-[#8D96A0]">Total Scholars Enrolled</div>
            <div className="text-2xl font-mono font-bold text-slate-900 dark:text-[#F0F6FC] mt-1 tabular-nums">4,020</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] flex items-center justify-center text-[#3FB950]">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white/70 dark:bg-[#0D1117] border border-white/80 dark:border-[#30363D] backdrop-blur-xl rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-[#8D96A0]">Accredited Faculty</div>
            <div className="text-2xl font-mono font-bold text-slate-900 dark:text-[#F0F6FC] mt-1 tabular-nums">
              143 <span className="text-xs font-normal text-slate-400 dark:text-[#8D96A0]">Members</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] flex items-center justify-center text-[#58A6FF]">
            <GraduationCap className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white/70 dark:bg-[#0D1117] border border-white/80 dark:border-[#30363D] backdrop-blur-xl rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-[#8D96A0]">Curriculum Sync Status</div>
            <div className="text-sm font-mono font-bold text-[#3FB950] mt-1.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#3FB950] animate-pulse"></span>
              <span>100% Verified</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] flex items-center justify-center text-brand">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 4. DEPARTMENT CARD BENTO GRID (2 columns x 2 rows, 24px gap) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-1">
        {filteredDepartments.map((dept) => (
          <div
            key={dept.id}
            className="bg-white/70 dark:bg-[#0D1117] border border-white/80 dark:border-[#30363D] backdrop-blur-xl rounded-3xl p-[26px] relative flex flex-col justify-between hover:border-[#2563EB]/60 transition-all duration-300 shadow-xl group"
          >
            {/* Subtle Top-Edge Brand Accent Bar */}
            <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#2563EB] to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>

            <div>
              {/* Top Row: Monospace Code Pill + Division + Status Badge */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-[#2563EB]/15 text-[#2563EB] border border-[#2563EB]/30 tracking-tight">
                    {dept.code} • {dept.codeNumber}
                  </span>
                  <span className="text-[11px] font-sans font-medium text-slate-500 dark:text-[#8D96A0]">{dept.division}</span>
                </div>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-[rgba(35,134,54,0.15)] text-[#3FB950] border border-[#3FB950]/40 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3FB950]"></span>
                  <span>{dept.status}</span>
                </span>
              </div>

              {/* Department Title */}
              <h2 className="text-xl font-manrope font-bold text-slate-900 dark:text-[#F0F6FC] tracking-[-0.02em] mb-4">
                {dept.name}
              </h2>

              {/* Head of Department Inset Box (#161B22 surface, 14px radius, 12px padding) */}
              <div className="bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] rounded-[14px] p-3 mb-5 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#2563EB]/20 border border-[#2563EB]/40 flex items-center justify-center font-mono font-bold text-[#2563EB] text-xs shrink-0 shadow-sm">
                  {dept.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-manrope font-bold text-slate-900 dark:text-[#F0F6FC] truncate">
                      {dept.hodName}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-white dark:bg-[#0D1117] text-brand dark:text-[#2563EB] border border-brand/30 dark:border-[#2563EB]/30">
                      {dept.hodBadge}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-[#8D96A0] font-sans flex items-center gap-2 mt-0.5 truncate">
                    <span>{dept.hodRole}</span>
                    <span>•</span>
                    <span className="font-mono text-slate-700 dark:text-[#F0F6FC]/80 text-[11px] truncate">
                      Office: {dept.office}
                    </span>
                  </div>
                </div>
              </div>

              {/* 3-Column Metric Strip (JetBrains Mono tabular-nums) */}
              <div className="grid grid-cols-3 gap-2.5 mb-6">
                <div className="bg-slate-50 dark:bg-[#161B22]/70 border border-slate-200 dark:border-[#30363D]/80 rounded-xl p-3 text-center">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-[#8D96A0]">
                    Total Students
                  </div>
                  <div className="text-lg font-mono font-bold text-slate-900 dark:text-[#F0F6FC] tabular-nums mt-0.5">
                    {dept.totalStudents.toLocaleString()}
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-[#161B22]/70 border border-slate-200 dark:border-[#30363D]/80 rounded-xl p-3 text-center">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-[#8D96A0]">
                    Total Faculty
                  </div>
                  <div className="text-lg font-mono font-bold text-slate-900 dark:text-[#F0F6FC] tabular-nums mt-0.5">
                    {dept.totalFaculty}
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-[#161B22]/70 border border-slate-200 dark:border-[#30363D]/80 rounded-xl p-3 text-center">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-[#8D96A0]">
                    Active Programs
                  </div>
                  <div className="text-xs font-mono font-bold text-[#2563EB] mt-1.5 truncate">
                    {dept.activePrograms.join(", ")}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Action Links Bar (3 equal buttons/links) */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#30363D]/60">
              <button
                onClick={() => setSelectedRosterDept(dept)}
                className="py-2 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-sans font-medium border border-slate-200 dark:bg-[#161B22] dark:hover:bg-[#21262D] dark:text-[#8D96A0] dark:hover:text-[#F0F6FC] dark:border-[#30363D] transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Faculty Roster</span>
              </button>

              <button
                onClick={() => setSelectedCurriculumDept(dept)}
                className="py-2 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-sans font-medium border border-slate-200 dark:bg-[#161B22] dark:hover:bg-[#21262D] dark:text-[#8D96A0] dark:hover:text-[#F0F6FC] dark:border-[#30363D] transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Curriculum</span>
              </button>

              <button
                onClick={() => setSelectedSettingsDept(dept)}
                className="py-2 px-2.5 rounded-lg bg-[#2563EB]/15 hover:bg-[#2563EB]/25 text-[#2563EB] text-xs font-sans font-semibold border border-[#2563EB]/30 transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Manage Settings</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* BOTTOM ENTERPRISE AUDIT LEDGER */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#8D96A0] px-2 font-mono gap-2 pt-2 border-t border-[#30363D]/50">
        <div>
          UniCampus OS v4.2.0-enterprise • Node.js / PostgreSQL / AWS S3 • Curriculum Schema: v2.4 (HEC API Compliant)
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => showToast("Exported complete Curriculum Matrix PDF report.")}
            className="flex items-center gap-1 text-[#2563EB] hover:underline cursor-pointer"
          >
            <Download className="w-3 h-3" />
            <span>Export Curriculum Matrix</span>
          </button>
          <span>•</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#3FB950]" />
            <span>Accreditation Audit Ledger</span>
          </span>
        </div>
      </div>

      {/* MODAL 1: Add Department */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 dark:bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] rounded-3xl w-full max-w-lg shadow-2xl p-6 relative">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#30363D] pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand/10 dark:bg-[#2563EB]/20 border border-brand/20 dark:border-[#2563EB]/40 text-brand dark:text-[#2563EB] flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-manrope font-bold text-base text-slate-900 dark:text-[#F0F6FC]">
                    Create Academic Department
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#8D96A0]">Establish new faculty unit and degree syllabus</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-[#F0F6FC] hover:bg-slate-100 dark:hover:bg-[#161B22]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDepartment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-[#8D96A0] mb-1.5">
                  Department Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Civil & Environmental Engineering"
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] focus:border-brand dark:focus:border-[#2563EB] rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-[#F0F6FC] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-[#8D96A0] mb-1.5">
                    Acronym / Code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CEE"
                    value={newDeptCode}
                    onChange={(e) => setNewDeptCode(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] focus:border-brand dark:focus:border-[#2563EB] rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 dark:text-[#F0F6FC] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-[#8D96A0] mb-1.5">
                    Code Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CODE 18"
                    value={newDeptCodeNum}
                    onChange={(e) => setNewDeptCodeNum(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] focus:border-brand dark:focus:border-[#2563EB] rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 dark:text-[#F0F6FC] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-[#8D96A0] mb-1.5">
                  Head of Department / Dean Appointee
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prof. Dr. Tariqul Anam"
                  value={newDeptHod}
                  onChange={(e) => setNewDeptHod(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] focus:border-brand dark:focus:border-[#2563EB] rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-[#F0F6FC] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-[#8D96A0] mb-1.5">
                  Office Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Engineering Tower, Room 501"
                  value={newDeptOffice}
                  onChange={(e) => setNewDeptOffice(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] focus:border-brand dark:focus:border-[#2563EB] rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-[#F0F6FC] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-[#8D96A0] mb-1.5">
                    Student Capacity
                  </label>
                  <input
                    type="number"
                    value={newDeptCapacity}
                    onChange={(e) => setNewDeptCapacity(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] focus:border-brand dark:focus:border-[#2563EB] rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 dark:text-[#F0F6FC] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-[#8D96A0] mb-1.5">
                    Faculty Quota
                  </label>
                  <input
                    type="number"
                    value={newDeptFacultyCount}
                    onChange={(e) => setNewDeptFacultyCount(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] focus:border-brand dark:focus:border-[#2563EB] rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 dark:text-[#F0F6FC] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-[#30363D]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-[#F0F6FC] hover:bg-slate-100 dark:hover:bg-[#161B22]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand hover:bg-brand-hover dark:bg-[#2563EB] dark:hover:bg-[#5752E5] text-white text-xs font-bold shadow-md shadow-brand/25 dark:shadow-[#2563EB]/25 cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 dark:bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] rounded-3xl w-full max-w-xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#30363D] pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-500/10 dark:bg-[#58A6FF]/20 border border-sky-500/20 dark:border-[#58A6FF]/40 text-sky-600 dark:text-[#58A6FF] flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-manrope font-bold text-base text-slate-900 dark:text-[#F0F6FC]">
                    Faculty Roster • {selectedRosterDept.code}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#8D96A0] font-sans">{selectedRosterDept.name}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRosterDept(null)}
                className="p-1.5 rounded-lg text-slate-400 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-[#F0F6FC] hover:bg-slate-100 dark:hover:bg-[#161B22]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {selectedRosterDept.facultyList.map((faculty, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50/90 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="font-manrope font-bold text-xs text-slate-900 dark:text-[#F0F6FC] flex items-center gap-2">
                      <span>{faculty.name}</span>
                      <span className="text-[10px] font-mono text-sky-600 dark:text-[#58A6FF] bg-sky-50 dark:bg-[#58A6FF]/10 px-1.5 py-0.5 rounded border border-sky-200 dark:border-[#58A6FF]/20">
                        {faculty.designation}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-[#8D96A0] mt-1 font-sans">
                      <span>{faculty.office}</span> • <span className="font-mono text-slate-600 dark:text-[#8D96A0]">{faculty.email}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => showToast(`Opening profile dossier for ${faculty.name}`)}
                    className="p-2 rounded-lg bg-white dark:bg-[#0D1117] hover:bg-slate-50 dark:hover:bg-[#1C2128] text-slate-700 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-[#F0F6FC] border border-slate-200 dark:border-[#30363D] text-xs font-semibold transition-colors shrink-0 cursor-pointer"
                  >
                    View Dossier
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-4 mt-4 border-t border-slate-200 dark:border-[#30363D] flex items-center justify-between text-xs text-slate-500 dark:text-[#8D96A0]">
              <span>Showing {selectedRosterDept.facultyList.length} of {selectedRosterDept.totalFaculty} allocated faculty</span>
              <button
                onClick={() => setSelectedRosterDept(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] text-slate-700 dark:text-[#F0F6FC] font-semibold hover:bg-slate-200 dark:hover:bg-[#21262D]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Curriculum Syllabus Modal */}
      {selectedCurriculumDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 dark:bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] rounded-3xl w-full max-w-2xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#30363D] pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand/10 dark:bg-brand/20 border border-brand/20 dark:border-brand/40 text-brand dark:text-[#60A5FA] flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-manrope font-bold text-base text-slate-900 dark:text-[#F0F6FC]">
                    Accredited Curriculum Syllabus • {selectedCurriculumDept.code}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#8D96A0] font-sans">
                    {selectedCurriculumDept.name} • {selectedCurriculumDept.activePrograms.join(", ")}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCurriculumDept(null)}
                className="p-1.5 rounded-lg text-slate-400 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-[#F0F6FC] hover:bg-slate-100 dark:hover:bg-[#161B22]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
              {selectedCurriculumDept.curriculumList.map((course, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50/90 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-brand dark:text-[#2563EB] bg-brand/5 dark:bg-[#0D1117] px-2 py-0.5 rounded border border-brand/20 dark:border-[#30363D]">
                        {course.code}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#1C2128] text-slate-600 dark:text-[#8D96A0] border border-slate-200 dark:border-[#30363D]">
                        {course.semester}
                      </span>
                    </div>
                    <div className="font-manrope font-bold text-xs text-slate-900 dark:text-[#F0F6FC] truncate">
                      {course.title}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono text-xs text-emerald-700 dark:text-[#3FB950] font-semibold bg-emerald-50 dark:bg-[rgba(35,134,54,0.15)] px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-[#3FB950]/30">
                      {course.credits.toFixed(1)} Credits
                    </span>
                    <span className="font-mono text-xs text-slate-600 dark:text-[#8D96A0] bg-white dark:bg-[#0D1117] px-2 py-1 rounded border border-slate-200 dark:border-[#30363D]">
                      {course.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 mt-4 border-t border-slate-200 dark:border-[#30363D] flex items-center justify-between text-xs text-slate-500 dark:text-[#8D96A0]">
              <span className="font-mono">Outcome-Based Education (OBE) Standard Compliant</span>
              <button
                onClick={() => setSelectedCurriculumDept(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] text-slate-700 dark:text-[#F0F6FC] font-semibold hover:bg-slate-200 dark:hover:bg-[#21262D]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Manage Settings Modal */}
      {selectedSettingsDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 dark:bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] rounded-3xl w-full max-w-md shadow-2xl p-6 relative">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#30363D] pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand/10 dark:bg-[#2563EB]/20 border border-brand/20 dark:border-[#2563EB]/40 text-brand dark:text-[#2563EB] flex items-center justify-center">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-manrope font-bold text-base text-slate-900 dark:text-[#F0F6FC]">
                    Department Parameters
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#8D96A0] font-mono">{selectedSettingsDept.code} • Governance Settings</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSettingsDept(null)}
                className="p-1.5 rounded-lg text-slate-400 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-[#F0F6FC] hover:bg-slate-100 dark:hover:bg-[#161B22]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-[#8D96A0] mb-1.5">
                  Assigned Head of Department
                </label>
                <input
                  type="text"
                  defaultValue={selectedSettingsDept.hodName}
                  className="w-full bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] focus:border-brand dark:focus:border-[#2563EB] rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-[#F0F6FC] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-[#8D96A0] mb-1.5">
                  Office Location
                </label>
                <input
                  type="text"
                  defaultValue={selectedSettingsDept.office}
                  className="w-full bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] focus:border-brand dark:focus:border-[#2563EB] rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-[#F0F6FC] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-[#8D96A0] mb-1.5">
                    Accreditation Status
                  </label>
                  <select
                    defaultValue={selectedSettingsDept.status}
                    className="w-full bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] focus:border-brand dark:focus:border-[#2563EB] rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-[#F0F6FC] focus:outline-none"
                  >
                    <option value="Accredited • Active">Accredited • Active</option>
                    <option value="Pending Review">Pending Review</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-[#8D96A0] mb-1.5">
                    Total Enrolled Scholars
                  </label>
                  <input
                    type="number"
                    defaultValue={selectedSettingsDept.totalStudents}
                    className="w-full bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] focus:border-brand dark:focus:border-[#2563EB] rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-[#F0F6FC] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-[#30363D]">
                <button
                  type="button"
                  onClick={() => setSelectedSettingsDept(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-[#8D96A0] hover:text-slate-900 dark:hover:text-[#F0F6FC] hover:bg-slate-100 dark:hover:bg-[#161B22]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSettingsDept(null);
                    showToast(`Updated parameters for ${selectedSettingsDept.name}.`);
                  }}
                  className="px-4 py-2 rounded-xl bg-brand hover:bg-brand-hover dark:bg-[#2563EB] dark:hover:bg-[#5752E5] text-white text-xs font-bold shadow-md shadow-brand/25 dark:shadow-[#2563EB]/25 cursor-pointer"
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
