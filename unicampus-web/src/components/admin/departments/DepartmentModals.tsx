"use client";

import { Select } from "@/components/ui/Select";
import { TabPanel } from "@/components/ui/Tabs";

import React, { useState, useEffect } from "react";
import { Building2, Users, BookOpen, Settings, X, Plus, Trash2, Lock, Unlock } from "lucide-react";
import type { DepartmentData } from "./departmentsData";
import {
  clampProgramSemesters,
  formatProgramDuration,
  formatYearSemester,
  getSemestersForCount,
  MAX_PROGRAM_SEMESTERS,
  MIN_PROGRAM_SEMESTERS,
} from "@/lib/canonicalCampus";
import { adminService } from "@/lib/services/adminService";

const SEMESTER_COUNT_OPTIONS = Array.from(
  { length: MAX_PROGRAM_SEMESTERS - MIN_PROGRAM_SEMESTERS + 1 },
  (_, idx) => {
    const count = MIN_PROGRAM_SEMESTERS + idx;
    const label =
      count % 2 === 0
        ? `${count} Semesters (${count / 2} ${count / 2 === 1 ? "Year" : "Years"})`
        : `${count} Semesters`;
    return { value: String(count), label };
  }
);

interface DepartmentModalsProps {
  isAddModalOpen: boolean;
  onCloseAddModal: () => void;
  newDeptName: string;
  onNewDeptNameChange: (v: string) => void;
  newDeptCode: string;
  onNewDeptCodeChange: (v: string) => void;
  newDeptCodeNum: string;
  onNewDeptCodeNumChange: (v: string) => void;
  newDeptHod: string;
  onNewDeptHodChange: (v: string) => void;
  newDeptOffice: string;
  onNewDeptOfficeChange: (v: string) => void;
  newDeptCapacity: string;
  onNewDeptCapacityChange: (v: string) => void;
  newDeptFacultyCount: string;
  onNewDeptFacultyCountChange: (v: string) => void;
  newDeptSemesterCount?: string;
  onNewDeptSemesterCountChange?: (v: string) => void;
  onCreateDepartment: (e: React.FormEvent) => void;
  selectedRosterDept: DepartmentData | null;
  onCloseRosterDept: () => void;
  selectedCurriculumDept: DepartmentData | null;
  onCloseCurriculumDept: () => void;
  onCreateSubject?: (
    deptId: string,
    subject: { code: string; title: string; credit: number; type: "Theory" | "Lab"; semester_name: string }
  ) => void;
  onDeleteSubject?: (subjectId?: string, code?: string) => void;
  onAssignSubjectTeacher?: (
    subjectId: string,
    courseCode: string,
    teacherId: string | null,
    teacherName: string | null
  ) => void;
  onUpdateSemesterCount?: (deptId: string, totalSemesters: number) => void;
  selectedSettingsDept: DepartmentData | null;
  onCloseSettingsDept: () => void;
  onSaveSettings: (
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
  ) => void;
  onShowToast: (msg: string) => void;
  isDeptAdmin?: boolean;
  allFaculty?: { id: string; name: string; departmentId: string; code?: string | null }[];
}

export function DepartmentModals({
  isAddModalOpen,
  onCloseAddModal,
  newDeptName,
  onNewDeptNameChange,
  newDeptCode,
  onNewDeptCodeChange,
  newDeptCodeNum,
  onNewDeptCodeNumChange,
  newDeptHod,
  onNewDeptHodChange,
  newDeptOffice,
  onNewDeptOfficeChange,
  newDeptCapacity,
  onNewDeptCapacityChange,
  newDeptFacultyCount,
  onNewDeptFacultyCountChange,
  newDeptSemesterCount = "8",
  onNewDeptSemesterCountChange,
  onCreateDepartment,
  selectedRosterDept,
  onCloseRosterDept,
  selectedCurriculumDept,
  onCloseCurriculumDept,
  onCreateSubject,
  onDeleteSubject,
  onAssignSubjectTeacher,
  onUpdateSemesterCount,
  selectedSettingsDept,
  onCloseSettingsDept,
  onSaveSettings,
  onShowToast,
  isDeptAdmin = false,
  allFaculty = [],
}: DepartmentModalsProps) {
  // Settings form states
  const [settingsHod, setSettingsHod] = useState("");
  const [settingsHodId, setSettingsHodId] = useState<string>("");
  const [settingsOffice, setSettingsOffice] = useState("");
  const [settingsStatus, setSettingsStatus] = useState<"Accredited • Active" | "Pending Review">("Accredited • Active");
  const [settingsStudents, setSettingsStudents] = useState("500");
  const [settingsSemesterCount, setSettingsSemesterCount] = useState("8");
  const [settingsAdminName, setSettingsAdminName] = useState("");
  const [settingsAdminEmail, setSettingsAdminEmail] = useState("");

  // Curriculum add form state (per-semester)
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState<string>("1st Semester");
  const [newCourseCode, setNewCourseCode] = useState("");
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [newCourseCredit, setNewCourseCredit] = useState("3.0");
  const [newCourseType, setNewCourseType] = useState<"Theory" | "Lab">("Theory");
  const [gradebookPolicies, setGradebookPolicies] = useState(() => adminService.getGradebookPolicies());

  const activeDeptSemCount = clampProgramSemesters(selectedCurriculumDept?.totalSemesters);
  const activeDeptSemesters = getSemestersForCount(activeDeptSemCount);
  const activeSemester = activeDeptSemesters.includes(
    selectedSemester as (typeof activeDeptSemesters)[number]
  )
    ? selectedSemester
    : activeDeptSemesters[0];

  useEffect(() => {
    const syncPolicies = () => {
      setGradebookPolicies(adminService.getGradebookPolicies());
    };
    window.addEventListener("unicampus:gradebook-policy-updated", syncPolicies);
    return () => window.removeEventListener("unicampus:gradebook-policy-updated", syncPolicies);
  }, []);

  useEffect(() => {
    if (selectedSettingsDept) {
      queueMicrotask(() => {
        setSettingsHod(selectedSettingsDept.hodName || "");
        setSettingsHodId(selectedSettingsDept.headTeacherId || "");
        setSettingsOffice(selectedSettingsDept.office || "");
        setSettingsStatus(selectedSettingsDept.status || "Accredited • Active");
        setSettingsStudents(String(selectedSettingsDept.totalStudents || 500));
        setSettingsSemesterCount(String(clampProgramSemesters(selectedSettingsDept.totalSemesters)));
        setSettingsAdminName(selectedSettingsDept.deptAdminName || "");
        setSettingsAdminEmail(selectedSettingsDept.deptAdminEmail || "");
      });
    }
  }, [selectedSettingsDept]);

  const handleAddCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCurriculumDept || !newCourseCode.trim() || !newCourseTitle.trim()) return;
    onCreateSubject?.(selectedCurriculumDept.id, {
      code: newCourseCode.trim().toUpperCase(),
      title: newCourseTitle.trim(),
      credit: parseFloat(newCourseCredit) || 3.0,
      type: newCourseType,
      semester_name: activeSemester,
    });
    setNewCourseCode("");
    setNewCourseTitle("");
    setIsAddingCourse(false);
  };

  const handleSaveParameters = () => {
    if (!selectedSettingsDept) return;
    onSaveSettings(selectedSettingsDept, {
      hodName: settingsHod.trim() || selectedSettingsDept.hodName,
      headTeacherId: settingsHodId || selectedSettingsDept.headTeacherId || null,
      office: settingsOffice.trim() || selectedSettingsDept.office,
      status: settingsStatus,
      totalStudents: parseInt(settingsStudents, 10) || selectedSettingsDept.totalStudents,
      totalSemesters: clampProgramSemesters(parseInt(settingsSemesterCount, 10)),
      deptAdminName: settingsAdminName.trim() || undefined,
      deptAdminEmail: settingsAdminEmail.trim() || undefined,
    });
  };
  return (
    <>
      {/* MODAL 1: Add Department */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-surface border border-line rounded-2xl w-full max-w-lg shadow-xl p-6 relative max-h-[90dvh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-line pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-soft border border-brand/30 text-brand flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-fg">
                    Create Academic Department
                  </h3>
                  <p className="text-xs text-fg-muted">
                    Establish new faculty unit and degree syllabus
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close modal"
                onClick={onCloseAddModal}
                className="min-w-[36px] min-h-[36px] inline-flex items-center justify-center rounded-lg text-fg-muted hover:text-fg hover:bg-surface-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={onCreateDepartment} className="space-y-4">
              <div>
                <label
                  htmlFor="add-dept-name"
                  className="block text-xs font-semibold text-fg-muted mb-1.5"
                >
                  Department Name
                </label>
                <input
                  id="add-dept-name"
                  type="text"
                  required
                  placeholder="e.g. Civil & Environmental Engineering"
                  value={newDeptName}
                  onChange={(e) => onNewDeptNameChange(e.target.value)}
                  className="w-full min-h-[44px] bg-surface-2 border border-line focus:border-brand rounded-xl px-3.5 py-2 text-xs text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="add-dept-code"
                    className="block text-xs font-semibold text-fg-muted mb-1.5"
                  >
                    Acronym / Code
                  </label>
                  <input
                    id="add-dept-code"
                    type="text"
                    required
                    placeholder="e.g. CEE"
                    value={newDeptCode}
                    onChange={(e) => onNewDeptCodeChange(e.target.value)}
                    className="w-full min-h-[44px] bg-surface-2 border border-line focus:border-brand rounded-xl px-3.5 py-2 text-xs font-sans text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  />
                </div>
                <div>
                  <label
                    htmlFor="add-dept-code-num"
                    className="block text-xs font-semibold text-fg-muted mb-1.5"
                  >
                    Code Number
                  </label>
                  <input
                    id="add-dept-code-num"
                    type="text"
                    placeholder="e.g. CODE 18"
                    value={newDeptCodeNum}
                    onChange={(e) => onNewDeptCodeNumChange(e.target.value)}
                    className="w-full min-h-[44px] bg-surface-2 border border-line focus:border-brand rounded-xl px-3.5 py-2 text-xs font-sans text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="add-dept-hod"
                  className="block text-xs font-semibold text-fg-muted mb-1.5"
                >
                  Head of Department / Dean Appointee
                </label>
                <input
                  id="add-dept-hod"
                  type="text"
                  required
                  placeholder="e.g. Prof. Dr. Tariqul Anam"
                  value={newDeptHod}
                  onChange={(e) => onNewDeptHodChange(e.target.value)}
                  className="w-full min-h-[44px] bg-surface-2 border border-line focus:border-brand rounded-xl px-3.5 py-2 text-xs text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                />
              </div>

              <div>
                <label
                  htmlFor="add-dept-office"
                  className="block text-xs font-semibold text-fg-muted mb-1.5"
                >
                  Office Location
                </label>
                <input
                  id="add-dept-office"
                  type="text"
                  placeholder="e.g. Engineering Tower, Room 501"
                  value={newDeptOffice}
                  onChange={(e) => onNewDeptOfficeChange(e.target.value)}
                  className="w-full min-h-[44px] bg-surface-2 border border-line focus:border-brand rounded-xl px-3.5 py-2 text-xs text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="add-dept-capacity"
                    className="block text-xs font-semibold text-fg-muted mb-1.5"
                  >
                    Student Capacity
                  </label>
                  <input
                    id="add-dept-capacity"
                    type="number"
                    value={newDeptCapacity}
                    onChange={(e) => onNewDeptCapacityChange(e.target.value)}
                    className="w-full min-h-[44px] bg-surface-2 border border-line focus:border-brand rounded-xl px-3.5 py-2 text-xs font-sans tabular-nums text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  />
                </div>
                <div>
                  <label
                    htmlFor="add-dept-faculty-quota"
                    className="block text-xs font-semibold text-fg-muted mb-1.5"
                  >
                    Faculty Quota
                  </label>
                  <input
                    id="add-dept-faculty-quota"
                    type="number"
                    value={newDeptFacultyCount}
                    onChange={(e) => onNewDeptFacultyCountChange(e.target.value)}
                    className="w-full min-h-[44px] bg-surface-2 border border-line focus:border-brand rounded-xl px-3.5 py-2 text-xs font-sans tabular-nums text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="add-dept-semester-count"
                  className="block text-xs font-semibold text-fg-muted mb-1.5"
                >
                  Program Semester Count
                </label>
                <Select
                  id="add-dept-semester-count"
                  ariaLabel="Program Semester Count"
                  value={newDeptSemesterCount}
                  onChange={(val) => onNewDeptSemesterCountChange?.(val)}
                  options={SEMESTER_COUNT_OPTIONS}
                  size="md"
                  variant="surface2"
                />
                <p className="text-[11px] text-fg-muted mt-1">
                  Sets the total semesters for this department across curriculum, registration, advising, and finance.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-line">
                <button
                  type="button"
                  onClick={onCloseAddModal}
                  className="min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold text-fg-muted hover:text-fg hover:bg-surface-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-brand hover:bg-brand-hover text-on-brand text-xs font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-surface border border-line rounded-2xl w-full max-w-xl shadow-xl p-6 relative max-h-[90dvh] flex flex-col">
            <div className="flex items-center justify-between border-b border-line pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-soft border border-brand/30 text-brand flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-fg">
                    Faculty Roster • {selectedRosterDept.code}
                  </h3>
                  <p className="text-xs text-fg-muted font-sans">
                    {selectedRosterDept.name}
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close modal"
                onClick={onCloseRosterDept}
                className="min-w-[36px] min-h-[36px] inline-flex items-center justify-center rounded-lg text-fg-muted hover:text-fg hover:bg-surface-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {selectedRosterDept.facultyList.map((faculty, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-surface-2 border border-line flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-xs text-fg flex flex-wrap items-center gap-2">
                      <span>{faculty.name}</span>
                      <span className="text-xs font-sans text-brand bg-brand-soft px-1.5 py-0.5 rounded border border-brand/20">
                        {faculty.designation}
                      </span>
                    </div>
                    <div className="text-xs text-fg-muted mt-1 font-sans">
                      <span>{faculty.office}</span> •{" "}
                      <span className="font-sans text-fg-muted">
                        {faculty.email}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      onShowToast(`Opening profile dossier for ${faculty.name}`)
                    }
                    className="min-h-[36px] px-3 py-1.5 rounded-lg bg-surface hover:bg-canvas text-fg-muted hover:text-fg border border-line text-xs font-semibold transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  >
                    View Dossier
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-4 mt-4 border-t border-line flex items-center justify-between text-xs text-fg-muted">
              <span className="tabular-nums">
                Showing {selectedRosterDept.facultyList.length} of{" "}
                {selectedRosterDept.totalFaculty} allocated faculty
              </span>
              <button
                type="button"
                onClick={onCloseRosterDept}
                className="min-h-[40px] px-4 py-2 rounded-xl bg-surface-2 border border-line text-fg font-semibold hover:bg-canvas cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Curriculum Syllabus Modal (Per-Semester) */}
      {selectedCurriculumDept && (() => {
        const semCourses = selectedCurriculumDept.curriculumList.filter(
          (course) => course.semester === activeSemester
        );
        const semCredits = semCourses.reduce((sum, c) => sum + c.credits, 0);

        return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-surface border border-line rounded-2xl w-full max-w-2xl shadow-xl p-6 relative max-h-[90dvh] flex flex-col">
            <div className="flex items-center justify-between gap-3 border-b border-line pb-4 mb-4">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-brand-soft border border-brand/30 text-brand flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-base text-fg truncate">
                    Accredited Curriculum Syllabus • {selectedCurriculumDept.code}
                  </h3>
                  <p className="text-xs text-fg-muted font-sans truncate">
                    {selectedCurriculumDept.name} • {formatProgramDuration(activeDeptSemCount)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {onUpdateSemesterCount && (
                  <div className="w-44 hidden sm:block">
                    <Select
                      ariaLabel="Edit department semester count"
                      value={String(activeDeptSemCount)}
                      onChange={(val) => {
                        const nextCount = clampProgramSemesters(parseInt(val, 10));
                        onUpdateSemesterCount(selectedCurriculumDept.id, nextCount);
                      }}
                      options={SEMESTER_COUNT_OPTIONS}
                      size="sm"
                      variant="surface2"
                      menuAlign="right"
                    />
                  </div>
                )}
                <button
                  type="button"
                  aria-label="Close modal"
                  onClick={onCloseCurriculumDept}
                  className="min-w-[36px] min-h-[36px] inline-flex items-center justify-center rounded-lg text-fg-muted hover:text-fg hover:bg-surface-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3.5 max-h-[480px] overflow-y-auto pr-1">
              {/* Mobile semester count editor */}
              {onUpdateSemesterCount && (
                <div className="sm:hidden">
                  <label className="block text-xs font-semibold text-fg-muted mb-1">
                    Program Semester Count
                  </label>
                  <Select
                    ariaLabel="Edit department semester count"
                    value={String(activeDeptSemCount)}
                    onChange={(val) => {
                      const nextCount = clampProgramSemesters(parseInt(val, 10));
                      onUpdateSemesterCount(selectedCurriculumDept.id, nextCount);
                    }}
                    options={SEMESTER_COUNT_OPTIONS}
                    size="sm"
                    variant="surface2"
                  />
                </div>
              )}

              {/* Per-Semester Segmented Tabs */}
              <div
                role="tablist"
                aria-label="Select semester to view or add subjects"
                className="flex items-center gap-1 p-1 rounded-xl bg-surface-2 border border-line overflow-x-auto max-w-full [scrollbar-width:none]"
              >
                {activeDeptSemesters.map((sem) => {
                  const isActive = activeSemester === sem;
                  const countInSem = selectedCurriculumDept.curriculumList.filter(
                    (c) => c.semester === sem
                  ).length;
                  return (
                    <button
                      key={sem}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => {
                        setSelectedSemester(sem);
                        setIsAddingCourse(false);
                      }}
                      className={`h-8 px-2.5 rounded-lg text-xs font-medium transition-colors shrink-0 cursor-pointer whitespace-nowrap inline-flex items-center gap-1.5 ${
                        isActive
                          ? "bg-surface text-fg font-semibold border border-line/80 shadow-2xs"
                          : "text-fg-muted hover:text-fg"
                      }`}
                    >
                      <span>{sem.replace(" Semester", " Sem")}</span>
                      {countInSem > 0 && (
                        <span
                          className={`px-1.5 py-0.2 rounded-full text-[10px] font-semibold tabular-nums ${
                            isActive
                              ? "bg-brand-soft text-brand"
                              : "bg-surface text-fg-muted border border-line"
                          }`}
                        >
                          {countInSem}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Active Semester Header + Add CTA + Subject List (160ms ease-out tab transition) */}
              <TabPanel tabKey={activeSemester} className="space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-fg">
                    {formatYearSemester(activeSemester)}
                  </span>
                  <span className="text-xs text-fg-muted tabular-nums">
                    • {semCourses.length} {semCourses.length === 1 ? "subject" : "subjects"}
                    {semCredits > 0 ? ` (${semCredits.toFixed(1)} cr)` : ""}
                  </span>
                </div>
                {(semCourses.length > 0 || isAddingCourse) && (
                  <button
                    type="button"
                    onClick={() => setIsAddingCourse(!isAddingCourse)}
                    className="h-9 px-3 rounded-xl bg-brand-soft text-brand hover:bg-brand/15 border border-brand/25 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isAddingCourse ? "Cancel" : `Add to ${activeSemester.replace(" Semester", " Sem")}`}</span>
                  </button>
                )}
              </div>

              {isAddingCourse && (
                <form
                  onSubmit={handleAddCourseSubmit}
                  className="p-3.5 rounded-xl bg-surface-2 border border-brand/40 space-y-3 mb-2"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="text-xs font-semibold text-fg flex items-center gap-1.5">
                      <Plus className="w-3.5 h-3.5 text-brand" />
                      <span>Add Subject to {activeSemester}</span>
                    </div>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-brand-soft text-brand border border-brand/20">
                      {formatYearSemester(activeSemester)}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-fg-muted mb-1">
                        Course Code
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={`e.g. ${selectedCurriculumDept.code}-1101`}
                        value={newCourseCode}
                        onChange={(e) => setNewCourseCode(e.target.value)}
                        className="w-full min-h-[38px] bg-surface border border-line rounded-lg px-2.5 py-1.5 text-xs font-mono text-fg focus:border-brand focus-visible:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-fg-muted mb-1">
                        Course Title
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Machine Learning"
                        value={newCourseTitle}
                        onChange={(e) => setNewCourseTitle(e.target.value)}
                        className="w-full min-h-[38px] bg-surface border border-line rounded-lg px-2.5 py-1.5 text-xs text-fg focus:border-brand focus-visible:outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-fg-muted mb-1">
                        Credits
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="0.5"
                        max="6"
                        value={newCourseCredit}
                        onChange={(e) => setNewCourseCredit(e.target.value)}
                        className="w-full min-h-[38px] bg-surface border border-line rounded-lg px-2.5 py-1.5 text-xs font-mono tabular-nums text-fg focus:border-brand focus-visible:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-fg-muted mb-1">
                        Course Type
                      </label>
                      <Select
                        ariaLabel="Course Type"
                        value={newCourseType}
                        onChange={(val) => setNewCourseType(val as "Theory" | "Lab")}
                        options={[
                          { value: "Theory", label: "Theory" },
                          { value: "Lab", label: "Lab" },
                        ]}
                        size="sm"
                        variant="surface"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingCourse(false)}
                      className="h-9 px-3 rounded-lg text-xs font-medium text-fg-muted hover:text-fg cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="h-9 px-3.5 rounded-lg bg-brand hover:bg-brand-hover text-on-brand text-xs font-semibold cursor-pointer"
                    >
                      Save to {activeSemester.replace(" Semester", " Sem")}
                    </button>
                  </div>
                </form>
              )}

              {semCourses.length === 0 ? (
                <div className="p-8 rounded-xl bg-surface-2 border border-dashed border-line text-center space-y-2">
                  <p className="text-xs font-semibold text-fg">
                    No subjects listed for {activeSemester} yet
                  </p>
                  <p className="text-xs text-fg-muted">
                    Add subjects with their official course codes and credits for {formatYearSemester(activeSemester)}.
                  </p>
                  {!isAddingCourse && (
                    <button
                      type="button"
                      onClick={() => setIsAddingCourse(true)}
                      className="mt-1 h-9 px-3.5 rounded-xl bg-brand hover:bg-brand-hover text-on-brand text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Subject to {activeSemester}</span>
                    </button>
                  )}
                </div>
              ) : (
              semCourses.map((course, idx) => (
                <div
                  key={course.id || `${course.code}-${idx}`}
                  className="p-3.5 rounded-xl bg-surface-2 border border-line flex flex-wrap items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-mono text-xs font-semibold text-brand bg-surface px-2 py-0.5 rounded border border-line">
                        {course.code}
                      </span>
                      <span className="text-xs font-sans px-2 py-0.5 rounded-full bg-surface text-fg-muted border border-line">
                        {formatYearSemester(course.semester)}
                      </span>
                    </div>
                    <div className="font-semibold text-xs text-fg truncate">
                      {course.title}
                    </div>
                    {course.id && allFaculty.length > 0 && (
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <span className="text-[11px] text-fg-muted shrink-0">Instructor:</span>
                        <Select
                          ariaLabel={`Assign instructor for ${course.code}`}
                          value={course.assignedTeacherId || ""}
                          onChange={(val) => {
                            const tid = val || null;
                            const match = allFaculty.find((f) => f.id === tid);
                            onAssignSubjectTeacher?.(
                              course.id!,
                              course.code,
                              tid,
                              match?.name || null
                            );
                          }}
                          options={[
                            { value: "", label: "Unassigned" },
                            ...allFaculty
                              .filter((f) => f.departmentId === selectedCurriculumDept.id)
                              .map((f) => ({ value: f.id, label: f.name })),
                            ...allFaculty
                              .filter((f) => f.departmentId !== selectedCurriculumDept.id)
                              .map((f) => ({ value: f.id, label: `${f.name} (Cross-Dept)` })),
                          ]}
                          size="sm"
                          variant="surface"
                          className="w-52"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-sans tabular-nums text-xs text-success font-semibold bg-success-light px-2.5 py-1 rounded-lg border border-success/30">
                      {course.credits.toFixed(1)} Credits
                    </span>
                    <span className="font-sans text-xs text-fg-muted bg-surface px-2 py-1 rounded border border-line">
                      {course.type}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const isCourseLocked = Boolean(gradebookPolicies[course.code]?.is_locked);
                        adminService.setGradebookLock(
                          course.code,
                          !isCourseLocked,
                          "Academic Administration",
                          selectedCurriculumDept.id
                        );
                        setGradebookPolicies(adminService.getGradebookPolicies());
                        onShowToast(
                          !isCourseLocked
                            ? `Gradebook locked for ${course.code}`
                            : `Gradebook reopened for ${course.code}`
                        );
                      }}
                      title={gradebookPolicies[course.code]?.is_locked ? "Unlock Gradebook" : "Lock Gradebook"}
                      aria-label={gradebookPolicies[course.code]?.is_locked ? "Unlock Gradebook" : "Lock Gradebook"}
                      className={`min-h-[32px] px-2.5 py-1 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors border ${
                        gradebookPolicies[course.code]?.is_locked
                          ? "bg-warning-light text-warning border-warning/30 hover:bg-warning-light/80"
                          : "bg-surface text-fg-muted hover:text-fg border-line hover:bg-surface-2"
                      }`}
                    >
                      {gradebookPolicies[course.code]?.is_locked ? (
                        <>
                          <Lock className="w-3 h-3 text-warning" />
                          <span>Locked</span>
                        </>
                      ) : (
                        <>
                          <Unlock className="w-3 h-3" />
                          <span>Lock</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteSubject?.(course.id, course.code)}
                      title={`Delete subject ${course.code}`}
                      aria-label={`Delete subject ${course.code}`}
                      className="p-1 rounded-lg text-fg-muted hover:text-danger hover:bg-danger-light transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )))}
              </TabPanel>
            </div>

            <div className="pt-4 mt-4 border-t border-line flex items-center justify-between text-xs text-fg-muted">
              <span className="font-sans">
                Total in {selectedCurriculumDept.code}: {selectedCurriculumDept.curriculumList.length} subjects across {activeDeptSemCount} semesters
              </span>
              <button
                type="button"
                onClick={onCloseCurriculumDept}
                className="min-h-[40px] px-4 py-2 rounded-xl bg-surface-2 border border-line text-fg font-semibold hover:bg-canvas cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                Done
              </button>
            </div>
          </div>
        </div>
        );
      })()}

      {/* MODAL 4: Manage Settings Modal */}
      {selectedSettingsDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-surface border border-line rounded-2xl w-full max-w-md shadow-xl p-6 relative max-h-[90dvh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-line pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-soft border border-brand/30 text-brand flex items-center justify-center shrink-0">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-fg">
                    Department Parameters
                  </h3>
                  <p className="text-xs text-fg-muted font-sans">
                    <span className="font-mono">{selectedSettingsDept.code}</span>{" "}
                    • Governance Settings
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close modal"
                onClick={onCloseSettingsDept}
                className="min-w-[36px] min-h-[36px] inline-flex items-center justify-center rounded-lg text-fg-muted hover:text-fg hover:bg-surface-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-surface-2/70 border border-line space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <label
                    htmlFor="dept-settings-hod-select"
                    className="block text-xs font-semibold text-fg"
                  >
                    Assign / Edit Head of Department (HOD)
                  </label>
                  {isDeptAdmin && (
                    <span className="text-[11px] font-semibold text-fg-muted">
                      Admin Only
                    </span>
                  )}
                </div>

                {allFaculty.length > 0 && (
                  <Select
                    id="dept-settings-hod-select"
                    ariaLabel="Assign Head of Department"
                    disabled={isDeptAdmin}
                    value={settingsHodId}
                    onChange={(pickedId) => {
                      setSettingsHodId(pickedId);
                      const match = allFaculty.find((f) => f.id === pickedId);
                      if (match) {
                        setSettingsHod(match.name);
                      }
                    }}
                    options={[
                      {
                        value: "",
                        label: "Select registered faculty or type custom name below...",
                      },
                      ...allFaculty
                        .filter((f) => f.departmentId === selectedSettingsDept.id)
                        .map((f) => ({
                          value: f.id,
                          label: `${f.name} (${selectedSettingsDept.code}${f.code ? ` · ${f.code}` : ""})`,
                        })),
                      ...allFaculty
                        .filter((f) => f.departmentId !== selectedSettingsDept.id)
                        .map((f) => ({
                          value: f.id,
                          label: `${f.name}${f.code ? ` (${f.code})` : ""}`,
                        })),
                    ]}
                    size="md"
                    variant="surface"
                  />
                )}

                <div>
                  <label
                    htmlFor="dept-settings-hod"
                    className="block text-[11px] font-medium text-fg-muted mb-1"
                  >
                    HOD Display Name
                  </label>
                  <input
                    id="dept-settings-hod"
                    type="text"
                    disabled={isDeptAdmin}
                    value={settingsHod}
                    onChange={(e) => setSettingsHod(e.target.value)}
                    placeholder="e.g. Prof. Dr. M. Lutfar Rahman"
                    className="w-full min-h-[42px] bg-surface border border-line focus:border-brand rounded-xl px-3.5 py-2 text-xs text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="dept-settings-admin-name"
                  className="block text-xs font-semibold text-fg-muted mb-1.5"
                >
                  Department Admin Name
                </label>
                <input
                  id="dept-settings-admin-name"
                  type="text"
                  disabled={isDeptAdmin}
                  placeholder="e.g. CSE Department Admin"
                  value={settingsAdminName}
                  onChange={(e) => setSettingsAdminName(e.target.value)}
                  className="w-full min-h-[44px] bg-surface-2 border border-line focus:border-brand rounded-xl px-3.5 py-2 text-xs text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label
                  htmlFor="dept-settings-admin-email"
                  className="block text-xs font-semibold text-fg-muted mb-1.5"
                >
                  Department Admin Email
                </label>
                <input
                  id="dept-settings-admin-email"
                  type="email"
                  disabled={isDeptAdmin}
                  placeholder="e.g. cse.admin@unicampus.edu"
                  value={settingsAdminEmail}
                  onChange={(e) => setSettingsAdminEmail(e.target.value)}
                  className="w-full min-h-[44px] bg-surface-2 border border-line focus:border-brand rounded-xl px-3.5 py-2 text-xs text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label
                  htmlFor="dept-settings-office"
                  className="block text-xs font-semibold text-fg-muted mb-1.5"
                >
                  Office Location
                </label>
                <input
                  id="dept-settings-office"
                  type="text"
                  value={settingsOffice}
                  onChange={(e) => setSettingsOffice(e.target.value)}
                  className="w-full min-h-[44px] bg-surface-2 border border-line focus:border-brand rounded-xl px-3.5 py-2 text-xs text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                />
              </div>

              <div>
                <label
                  htmlFor="dept-settings-semester-count"
                  className="block text-xs font-semibold text-fg-muted mb-1.5"
                >
                  Program Semester Count
                </label>
                <Select
                  id="dept-settings-semester-count"
                  ariaLabel="Program Semester Count"
                  value={settingsSemesterCount}
                  onChange={setSettingsSemesterCount}
                  options={SEMESTER_COUNT_OPTIONS}
                  size="md"
                  variant="surface2"
                />
                <p className="text-[11px] text-fg-muted mt-1">
                  Updates semester options for this department across Curriculum, Registration, Advising, Users, and Finance.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="dept-settings-status"
                    className="block text-xs font-semibold text-fg-muted mb-1.5"
                  >
                    Accreditation Status
                  </label>
                  <Select
                    id="dept-settings-status"
                    ariaLabel="Accreditation Status"
                    value={settingsStatus}
                    onChange={(val) =>
                      setSettingsStatus(val as "Accredited • Active" | "Pending Review")
                    }
                    options={[
                      { value: "Accredited • Active", label: "Accredited • Active" },
                      { value: "Pending Review", label: "Pending Review" },
                    ]}
                    size="md"
                    variant="surface2"
                  />
                </div>
                <div>
                  <label
                    htmlFor="dept-settings-students"
                    className="block text-xs font-semibold text-fg-muted mb-1.5"
                  >
                    Total Enrolled Students
                  </label>
                  <input
                    id="dept-settings-students"
                    type="number"
                    value={settingsStudents}
                    onChange={(e) => setSettingsStudents(e.target.value)}
                    className="w-full min-h-[44px] bg-surface-2 border border-line focus:border-brand rounded-xl px-3.5 py-2 text-xs font-sans tabular-nums text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-line">
                <button
                  type="button"
                  onClick={onCloseSettingsDept}
                  className="min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold text-fg-muted hover:text-fg hover:bg-surface-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveParameters}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-brand hover:bg-brand-hover text-on-brand text-xs font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  Save Parameters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
