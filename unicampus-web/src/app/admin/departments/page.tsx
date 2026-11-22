"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Building2,
  Search,
  Plus,
  Users,
  GraduationCap,
  BookOpen,
  CheckCircle2,
  X,
  Download,
  ShieldCheck,
} from "lucide-react";
import { CAMPUS_METRICS } from "@/lib/canonicalCampus";
import {
  DEPARTMENTS,
  type DepartmentData,
} from "@/components/admin/departments/departmentsData";
import { DepartmentCard } from "@/components/admin/departments/DepartmentCard";
import { DepartmentModals } from "@/components/admin/departments/DepartmentModals";
import { adminService } from "@/lib/services/adminService";
import { useAdminAuth } from "@/context/AdminAuthContext";

export default function AdminDepartmentsPage() {
  const { isDeptAdmin } = useAdminAuth();
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
  const [newDeptHod, setNewDeptHod] = useState("");
  const [newDeptOffice, setNewDeptOffice] = useState("");
  const [newDeptCapacity, setNewDeptCapacity] = useState("500");
  const [newDeptFacultyCount, setNewDeptFacultyCount] = useState("20");

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  const loadDepartmentsData = useCallback(() => {
    const storedDepts = adminService.getDepartments();
    const storedSubjects = adminService.getSubjects();
    const storedProfiles = adminService.getProfiles();

    const combined: DepartmentData[] = storedDepts.map((d) => {
      const existing = DEPARTMENTS.find((base) => base.id === d.id);
      const deptFaculty = storedProfiles
        .filter((p) => p.role === "teacher" && p.department_id === d.id)
        .map((p) => ({
          id: p.id,
          name: p.full_name,
          designation: p.teacher_code ? `Faculty (${p.teacher_code})` : "Faculty Member",
          office: existing?.office || "Academic Wing, Room 301",
          email: p.email,
        }));

      const deptSubjects = storedSubjects
        .filter((s) => s.department_id === d.id)
        .map((s) => ({
          id: s.id,
          code: s.code,
          title: s.title,
          credits: s.credit,
          type: (s.type || "Theory") as "Theory" | "Lab",
          semester: "1st Semester",
          semesterId: s.semester_id,
        }));

      const initials =
        d.head_teacher_name
          ?.split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("")
          .toUpperCase() || existing?.initials || "HD";

      return {
        id: d.id,
        code: d.code,
        codeNumber: existing?.codeNumber || `CODE ${d.code}`,
        division: existing?.division || "Undergraduate Studies",
        name: d.name,
        initials,
        hodName: d.head_teacher_name || existing?.hodName || "Dean Appointee",
        hodRole: existing?.hodRole || "Head of Department",
        hodBadge: existing?.hodBadge || "HOD",
        headTeacherId: d.head_teacher_id,
        deptAdminId: d.dept_admin_id,
        deptAdminName: d.dept_admin_name,
        deptAdminEmail: d.dept_admin_email,
        office: existing?.office || "Academic Wing, Room 301",
        totalStudents: d.stats?.students ?? existing?.totalStudents ?? 450,
        totalFaculty: d.stats?.teachers ?? (deptFaculty.length || existing?.totalFaculty || 18),
        activePrograms: existing?.activePrograms || ["B.Sc.", "M.Sc."],
        status: (existing?.status as "Accredited • Active" | "Pending Review") || "Accredited • Active",
        facultyList: deptFaculty.length > 0 ? deptFaculty : existing?.facultyList || [],
        curriculumList: deptSubjects.length > 0 ? deptSubjects : existing?.curriculumList || [],
      };
    });

    setDepartments(combined);
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      loadDepartmentsData();
    });
  }, [loadDepartmentsData]);

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

    adminService.createDepartment({
      name: newDeptName.trim(),
      code: newDeptCode.toUpperCase().trim(),
      head_teacher_id: null,
      head_teacher_name: newDeptHod.trim() || "Dean Appointee",
      stats: {
        students: parseInt(newDeptCapacity, 10) || 450,
        teachers: parseInt(newDeptFacultyCount, 10) || 18,
        courses: 2,
      },
    });

    loadDepartmentsData();
    setIsAddModalOpen(false);
    setNewDeptName("");
    setNewDeptCode("");
    setNewDeptCodeNum("");
    setNewDeptHod("");
    setNewDeptOffice("");
    showToast(`Successfully created ${newDeptName.trim()} (${newDeptCode.toUpperCase().trim()}).`);
  };

  const handleSaveSettings = (
    dept: DepartmentData,
    updates: {
      hodName: string;
      office: string;
      status: "Accredited • Active" | "Pending Review";
      totalStudents: number;
      deptAdminName?: string;
      deptAdminEmail?: string;
    }
  ) => {
    if (updates.hodName) {
      adminService.updateDepartmentHOD(dept.id, dept.headTeacherId || "teach-hod", updates.hodName);
    }
    if (updates.deptAdminName && updates.deptAdminEmail) {
      adminService.updateDepartmentAdmin(
        dept.id,
        dept.deptAdminId || `admin-${dept.code.toLowerCase()}`,
        updates.deptAdminName,
        updates.deptAdminEmail
      );
    }
    loadDepartmentsData();
    setSelectedSettingsDept(null);
    showToast(`Saved governance parameters for ${dept.code}.`);
  };

  const handleCreateSubject = (
    deptId: string,
    subject: { code: string; title: string; credit: number; type: "Theory" | "Lab"; semester_name: string }
  ) => {
    adminService.createSubject({
      department_id: deptId,
      semester_id: `sem-${deptId}-1`,
      code: subject.code,
      title: subject.title,
      credit: subject.credit,
      type: subject.type,
    });
    loadDepartmentsData();
    showToast(`Added ${subject.code} (${subject.title}) to curriculum.`);
  };

  const handleDeleteSubject = (subjectId?: string, code?: string) => {
    if (subjectId) {
      adminService.deleteSubject(subjectId);
    }
    loadDepartmentsData();
    showToast(`Removed course ${code || ""} from syllabus.`);
  };

  return (
    <div className="w-full space-y-6 antialiased selection:bg-brand/30 pb-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-surface-2 border border-brand/40 text-xs font-semibold text-fg shadow-lg">
          <div className="w-5 h-5 rounded-full bg-brand-soft flex items-center justify-center text-brand shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <span>{toastMessage}</span>
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={() => setToastMessage(null)}
            className="ml-2 text-fg-muted hover:text-fg transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* PAGE HEADER & SUMMARY ROW */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-line">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-semibold tracking-tight text-fg leading-tight">
            Academic Departments &amp; Programs
          </h1>
          <p className="text-xs sm:text-[13px] text-fg-muted mt-1 font-sans">
            Configure faculty leadership, student enrollment capacity, and accredited degree syllabi
          </p>
        </div>

        {/* Right: Search filter input + Primary button */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto shrink-0">
          <div className="relative flex-1 sm:flex-initial min-w-0">
            <Search className="w-4 h-4 text-fg-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              aria-label="Filter departments by code or dean"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter by code or dean..."
              className="bg-surface text-fg placeholder:text-fg-muted text-xs pl-10 pr-8 py-2 min-h-[44px] rounded-xl border border-line focus:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand transition-colors w-full sm:w-60 font-sans"
            />
            {searchFilter && (
              <button
                type="button"
                aria-label="Clear filter"
                onClick={() => setSearchFilter("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-fg-muted hover:text-fg cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {!isDeptAdmin && (
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="min-h-[44px] flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-on-brand transition-colors text-xs font-semibold cursor-pointer active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <Plus className="w-4 h-4" />
              <span>Add Department</span>
            </button>
          )}
        </div>
      </div>

      {/* QUICK KPI STATS STRIP */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface border border-line rounded-2xl p-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs font-sans text-fg-muted">Active Faculties</div>
            <div className="text-2xl font-sans font-bold text-fg mt-1 tabular-nums">
              {CAMPUS_METRICS.departmentsCount}{" "}
              <span className="text-xs font-normal text-fg-muted">Depts</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-surface-2 border border-line flex items-center justify-center text-brand shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-surface border border-line rounded-2xl p-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs font-sans text-fg-muted">Total Enrolled Students</div>
            <div className="text-2xl font-sans font-bold text-fg mt-1 tabular-nums">
              {CAMPUS_METRICS.students.toLocaleString()}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-surface-2 border border-line flex items-center justify-center text-success shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-surface border border-line rounded-2xl p-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs font-sans text-fg-muted">Accredited Faculty</div>
            <div className="text-2xl font-sans font-bold text-fg mt-1 tabular-nums">
              {CAMPUS_METRICS.faculty.toLocaleString()}{" "}
              <span className="text-xs font-normal text-fg-muted">Members</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-surface-2 border border-line flex items-center justify-center text-brand shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-surface border border-line rounded-2xl p-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs font-sans text-fg-muted">Curriculum Sync Status</div>
            <div className="text-sm font-sans font-semibold text-success mt-1.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-success shrink-0" />
              <span>100% Verified</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-surface-2 border border-line flex items-center justify-center text-brand shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* DEPARTMENT CARD BENTO GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-1">
        {filteredDepartments.map((dept) => (
          <DepartmentCard
            key={dept.id}
            dept={dept}
            onSelectRoster={setSelectedRosterDept}
            onSelectCurriculum={setSelectedCurriculumDept}
            onSelectSettings={setSelectedSettingsDept}
          />
        ))}
      </div>

      {/* BOTTOM ENTERPRISE AUDIT LEDGER */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-fg-muted px-2 font-sans gap-2 pt-2 border-t border-line">
        <div>
          UniCampus Academic Council · Curriculum Registry · Active Semesters
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => showToast("Exported complete Curriculum Matrix PDF report.")}
            className="flex items-center gap-1 text-brand hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-md px-1"
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

      <DepartmentModals
        isAddModalOpen={isAddModalOpen}
        onCloseAddModal={() => setIsAddModalOpen(false)}
        newDeptName={newDeptName}
        onNewDeptNameChange={setNewDeptName}
        newDeptCode={newDeptCode}
        onNewDeptCodeChange={setNewDeptCode}
        newDeptCodeNum={newDeptCodeNum}
        onNewDeptCodeNumChange={setNewDeptCodeNum}
        newDeptHod={newDeptHod}
        onNewDeptHodChange={setNewDeptHod}
        newDeptOffice={newDeptOffice}
        onNewDeptOfficeChange={setNewDeptOffice}
        newDeptCapacity={newDeptCapacity}
        onNewDeptCapacityChange={setNewDeptCapacity}
        newDeptFacultyCount={newDeptFacultyCount}
        onNewDeptFacultyCountChange={setNewDeptFacultyCount}
        onCreateDepartment={handleCreateDepartment}
        selectedRosterDept={selectedRosterDept}
        onCloseRosterDept={() => setSelectedRosterDept(null)}
        selectedCurriculumDept={selectedCurriculumDept}
        onCloseCurriculumDept={() => setSelectedCurriculumDept(null)}
        onCreateSubject={handleCreateSubject}
        onDeleteSubject={handleDeleteSubject}
        selectedSettingsDept={selectedSettingsDept}
        onCloseSettingsDept={() => setSelectedSettingsDept(null)}
        onSaveSettings={handleSaveSettings}
        onShowToast={showToast}
      />
    </div>
  );
}
