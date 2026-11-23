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
import {
  ALL_ORDINAL_SEMESTERS,
  clampProgramSemesters,
  formatProgramDuration,
  getOrdinalSemesterName,
  getSemesterIndex,
} from "@/lib/canonicalCampus";
import {
  DEPARTMENTS,
  type DepartmentData,
} from "@/components/admin/departments/departmentsData";
import { DepartmentCard } from "@/components/admin/departments/DepartmentCard";
import { DepartmentModals } from "@/components/admin/departments/DepartmentModals";
import { DepartmentCardsSkeleton } from "@/components/ui/Skeleton";
import { adminService } from "@/lib/services/adminService";
import { useAdminAuth } from "@/context/AdminAuthContext";

function resolveSemesterName(semesterId: string, semestersMap: Map<string, string>): string {
  if (semestersMap.has(semesterId)) {
    return semestersMap.get(semesterId)!;
  }
  const match = semesterId.match(/-(\d+)$/);
  if (match) {
    const idx = parseInt(match[1], 10);
    if (idx >= 1 && idx <= ALL_ORDINAL_SEMESTERS.length) {
      return getOrdinalSemesterName(idx);
    }
  }
  return "1st Semester";
}

export default function AdminDepartmentsPage() {
  const { isDeptAdmin } = useAdminAuth();
  const [departments, setDepartments] = useState<DepartmentData[]>([]);
  const [isHydrating, setIsHydrating] = useState(true);
  const [totalStudentCount, setTotalStudentCount] = useState(0);
  const [totalSubjectCount, setTotalSubjectCount] = useState(0);
  const [allFaculty, setAllFaculty] = useState<
    { id: string; name: string; departmentId: string; code?: string | null }[]
  >([]);
  const [searchFilter, setSearchFilter] = useState("");

  // Modals & Drawers (store IDs so open modals always reflect live state)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedRosterDeptId, setSelectedRosterDeptId] = useState<string | null>(null);
  const [selectedCurriculumDeptId, setSelectedCurriculumDeptId] = useState<string | null>(null);
  const [selectedSettingsDeptId, setSelectedSettingsDeptId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedRosterDept = useMemo(
    () => departments.find((d) => d.id === selectedRosterDeptId) ?? null,
    [departments, selectedRosterDeptId]
  );
  const selectedCurriculumDept = useMemo(
    () => departments.find((d) => d.id === selectedCurriculumDeptId) ?? null,
    [departments, selectedCurriculumDeptId]
  );
  const selectedSettingsDept = useMemo(
    () => departments.find((d) => d.id === selectedSettingsDeptId) ?? null,
    [departments, selectedSettingsDeptId]
  );

  // New Department Form State
  const [newDeptName, setNewDeptName] = useState("");
  const [newDeptCode, setNewDeptCode] = useState("");
  const [newDeptCodeNum, setNewDeptCodeNum] = useState("");
  const [newDeptHod, setNewDeptHod] = useState("");
  const [newDeptOffice, setNewDeptOffice] = useState("");
  const [newDeptCapacity, setNewDeptCapacity] = useState("500");
  const [newDeptFacultyCount, setNewDeptFacultyCount] = useState("20");
  const [newDeptSemesterCount, setNewDeptSemesterCount] = useState("8");

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  const loadDepartmentsData = useCallback(() => {
    const storedDepts = adminService.getDepartments();
    const storedSubjects = adminService.getSubjects();
    const storedSemesters = adminService.getSemesters();
    const storedProfiles = adminService.getProfiles();
    const semestersMap = new Map(storedSemesters.map((sem) => [sem.id, sem.name]));

    setTotalStudentCount(storedProfiles.filter((p) => p.role === "student").length);
    setTotalSubjectCount(storedSubjects.length);

    setAllFaculty(
      storedProfiles
        .filter((p) => p.role === "teacher")
        .map((p) => ({
          id: p.id,
          name: p.full_name,
          departmentId: p.department_id,
          code: p.teacher_code,
        }))
    );

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
          semester: resolveSemesterName(s.semester_id, semestersMap),
          semesterId: s.semester_id,
          assignedTeacherId: s.assigned_teacher_id || null,
          assignedTeacherName: s.assigned_teacher_name || null,
        }))
        .sort((a, b) => {
          const semDiff = getSemesterIndex(a.semester) - getSemesterIndex(b.semester);
          if (semDiff !== 0) return semDiff;
          return a.code.localeCompare(b.code);
        });

      const initials =
        d.head_teacher_name
          ?.split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("")
          .toUpperCase() || existing?.initials || "HD";

      const deptStudentCount = storedProfiles.filter(
        (p) => p.role === "student" && p.department_id === d.id
      ).length;
      const totalSemesters = adminService.getDepartmentSemesterCount(d.id);

      return {
        id: d.id,
        code: d.code,
        codeNumber: existing?.codeNumber || `CODE ${d.code}`,
        division: d.faculty || existing?.division || formatProgramDuration(totalSemesters),
        name: d.name,
        initials,
        hodName: d.head_teacher_name || d.dept_admin_name || "Unassigned",
        hodRole: "Head of Department",
        hodBadge: "HOD",
        headTeacherId: d.head_teacher_id,
        deptAdminId: d.dept_admin_id,
        deptAdminName: d.dept_admin_name,
        deptAdminEmail: d.dept_admin_email,
        office: existing?.office || "Academic Wing",
        totalStudents: deptStudentCount,
        totalFaculty: deptFaculty.length,
        totalSemesters,
        activePrograms: existing?.activePrograms || [formatProgramDuration(totalSemesters)],
        status: "Accredited • Active" as const,
        facultyList: deptFaculty,
        curriculumList: deptSubjects,
      };
    });

    setDepartments(combined);
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      loadDepartmentsData();
    });
    void adminService
      .hydrateFromSupabase()
      .then((hydrated) => {
        if (hydrated) loadDepartmentsData();
      })
      .finally(() => {
        setIsHydrating(false);
      });
    window.addEventListener("unicampus:departments-updated", loadDepartmentsData);
    return () => {
      window.removeEventListener("unicampus:departments-updated", loadDepartmentsData);
    };
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

    const semCount = clampProgramSemesters(parseInt(newDeptSemesterCount, 10));
    const created = adminService.createDepartment({
      name: newDeptName.trim(),
      code: newDeptCode.toUpperCase().trim(),
      head_teacher_id: null,
      head_teacher_name: newDeptHod.trim() || "Dean Appointee",
      total_semesters: semCount,
      stats: {
        students: parseInt(newDeptCapacity, 10) || 450,
        teachers: parseInt(newDeptFacultyCount, 10) || 18,
        courses: 0,
      },
    });

    loadDepartmentsData();
    setIsAddModalOpen(false);
    setNewDeptName("");
    setNewDeptCode("");
    setNewDeptCodeNum("");
    setNewDeptHod("");
    setNewDeptOffice("");
    setNewDeptSemesterCount("8");
    setSelectedCurriculumDeptId(created.id);
    showToast(`Created ${created.name} (${created.code}) with ${formatProgramDuration(semCount)} curriculum. You can now add subjects per semester.`);
  };

  const handleSaveSettings = (
    dept: DepartmentData,
    updates: {
      hodName: string;
      headTeacherId?: string | null;
      office: string;
      status: "Accredited • Active" | "Pending Review";
      totalStudents: number;
      totalSemesters?: number;
      deptAdminName?: string;
      deptAdminEmail?: string;
    }
  ) => {
    if (!isDeptAdmin && updates.hodName) {
      adminService.updateDepartmentHOD(
        dept.id,
        updates.headTeacherId ?? dept.headTeacherId ?? null,
        updates.hodName
      );
    }
    if (!isDeptAdmin && updates.deptAdminName && updates.deptAdminEmail) {
      adminService.updateDepartmentAdmin(
        dept.id,
        dept.deptAdminId || `admin-${dept.code.toLowerCase()}`,
        updates.deptAdminName,
        updates.deptAdminEmail
      );
    }
    if (
      typeof updates.totalSemesters === "number" &&
      updates.totalSemesters !== clampProgramSemesters(dept.totalSemesters)
    ) {
      adminService.updateDepartmentSemesterCount(dept.id, updates.totalSemesters);
    }
    loadDepartmentsData();
    setSelectedSettingsDeptId(null);
    showToast(`Saved governance parameters & semester configuration for ${dept.code}.`);
  };

  const handleUpdateSemesterCount = (deptId: string, totalSemesters: number) => {
    const dept = departments.find((d) => d.id === deptId);
    adminService.updateDepartmentSemesterCount(deptId, totalSemesters);
    loadDepartmentsData();
    showToast(
      `Updated ${dept?.code || "department"} program to ${formatProgramDuration(totalSemesters)} across all portals.`
    );
  };

  const handleCreateSubject = (
    deptId: string,
    subject: { code: string; title: string; credit: number; type: "Theory" | "Lab"; semester_name: string }
  ) => {
    const dept = departments.find((d) => d.id === deptId);
    const deptSlug = (dept?.code || deptId.replace(/^dept-/, "")).toLowerCase();
    const semIndex = getSemesterIndex(subject.semester_name);
    const normalizedCode = subject.code.trim().toUpperCase();

    const duplicate = dept?.curriculumList.some(
      (c) => c.code.toUpperCase() === normalizedCode
    );
    if (duplicate) {
      showToast(`Subject code ${normalizedCode} already exists in ${dept?.code}.`);
      return;
    }

    adminService.createSubject({
      department_id: deptId,
      semester_id: `sem-${deptSlug}-${semIndex}`,
      code: normalizedCode,
      title: subject.title.trim(),
      credit: subject.credit,
      type: subject.type,
    });
    loadDepartmentsData();
    showToast(`Added ${normalizedCode} (${subject.title.trim()}) to ${subject.semester_name}.`);
  };

  const handleDeleteSubject = (subjectId?: string, code?: string) => {
    if (subjectId) {
      adminService.deleteSubject(subjectId);
    }
    loadDepartmentsData();
    showToast(`Removed course ${code || ""} from syllabus.`);
  };

  const handleAssignSubjectTeacher = (
    subjectId: string,
    courseCode: string,
    teacherId: string | null,
    teacherName: string | null
  ) => {
    adminService.updateSubject(subjectId, {
      assigned_teacher_id: teacherId,
      assigned_teacher_name: teacherName,
    });
    if (teacherId) {
      adminService.assignCourseToTeacher(teacherId, courseCode);
    }
    loadDepartmentsData();
    showToast(
      teacherName
        ? `Assigned ${teacherName} to teach ${courseCode}.`
        : `Cleared instructor assignment for ${courseCode}.`
    );
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
              {departments.length}{" "}
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
              {totalStudentCount.toLocaleString()}
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
              {allFaculty.length.toLocaleString()}{" "}
              <span className="text-xs font-normal text-fg-muted">Members</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-surface-2 border border-line flex items-center justify-center text-brand shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-surface border border-line rounded-2xl p-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs font-sans text-fg-muted">Curriculum Subjects</div>
            {totalSubjectCount > 0 ? (
              <div className="text-2xl font-sans font-bold text-fg mt-1 tabular-nums">
                {totalSubjectCount.toLocaleString()}{" "}
                <span className="text-xs font-normal text-fg-muted">Courses</span>
              </div>
            ) : (
              <div className="text-sm font-sans font-semibold text-fg-muted mt-1.5">
                Ready to configure
              </div>
            )}
          </div>
          <div className="w-10 h-10 rounded-xl bg-surface-2 border border-line flex items-center justify-center text-brand shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* DEPARTMENT CARD BENTO GRID */}
      {isHydrating && departments.length === 0 ? (
        <DepartmentCardsSkeleton count={2} />
      ) : filteredDepartments.length === 0 ? (
        <div className="p-10 rounded-2xl bg-surface border border-line text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-soft text-brand flex items-center justify-center mx-auto">
            <Building2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-fg">No departments yet</h2>
            <p className="text-xs sm:text-sm text-fg-muted max-w-sm mx-auto">
              Create your first academic department to configure its 4-Year / 8-Semester curriculum and subjects.
            </p>
          </div>
          {!isDeptAdmin && (
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-brand text-on-brand text-xs font-semibold hover:opacity-95 transition-opacity cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Department</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-1">
          {filteredDepartments.map((dept) => (
            <DepartmentCard
              key={dept.id}
              dept={dept}
              isSuperAdmin={!isDeptAdmin}
              onSelectRoster={(d) => setSelectedRosterDeptId(d.id)}
              onSelectCurriculum={(d) => setSelectedCurriculumDeptId(d.id)}
              onSelectSettings={(d) => setSelectedSettingsDeptId(d.id)}
              onAssignHod={(d) => setSelectedSettingsDeptId(d.id)}
            />
          ))}
        </div>
      )}

      {/* BOTTOM ENTERPRISE AUDIT LEDGER */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-fg-muted px-2 font-sans gap-2 pt-2 border-t border-line">
        <div>
          UniCampus Academic Council · Curriculum Registry · Active Semesters
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {departments.length > 0 && (
            <>
              <button
                type="button"
                onClick={() => showToast("Exported complete Curriculum Matrix PDF report.")}
                className="flex items-center gap-1 text-brand hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-md px-1"
              >
                <Download className="w-3 h-3" />
                <span>Export Curriculum Matrix</span>
              </button>
              <span>•</span>
            </>
          )}
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-success" />
            <span>Live Supabase Registry</span>
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
        newDeptSemesterCount={newDeptSemesterCount}
        onNewDeptSemesterCountChange={setNewDeptSemesterCount}
        onCreateDepartment={handleCreateDepartment}
        selectedRosterDept={selectedRosterDept}
        onCloseRosterDept={() => setSelectedRosterDeptId(null)}
        selectedCurriculumDept={selectedCurriculumDept}
        onCloseCurriculumDept={() => setSelectedCurriculumDeptId(null)}
        onCreateSubject={handleCreateSubject}
        onDeleteSubject={handleDeleteSubject}
        onAssignSubjectTeacher={handleAssignSubjectTeacher}
        onUpdateSemesterCount={handleUpdateSemesterCount}
        selectedSettingsDept={selectedSettingsDept}
        onCloseSettingsDept={() => setSelectedSettingsDeptId(null)}
        onSaveSettings={handleSaveSettings}
        onShowToast={showToast}
        isDeptAdmin={isDeptAdmin}
        allFaculty={allFaculty}
      />
    </div>
  );
}
