"use client";

import React from "react";
import { Building2, Users, BookOpen, Settings, X } from "lucide-react";
import type { DepartmentData } from "./departmentsData";

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
  onCreateDepartment: (e: React.FormEvent) => void;
  selectedRosterDept: DepartmentData | null;
  onCloseRosterDept: () => void;
  selectedCurriculumDept: DepartmentData | null;
  onCloseCurriculumDept: () => void;
  selectedSettingsDept: DepartmentData | null;
  onCloseSettingsDept: () => void;
  onSaveSettings: (dept: DepartmentData) => void;
  onShowToast: (msg: string) => void;
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
  onCreateDepartment,
  selectedRosterDept,
  onCloseRosterDept,
  selectedCurriculumDept,
  onCloseCurriculumDept,
  selectedSettingsDept,
  onCloseSettingsDept,
  onSaveSettings,
  onShowToast,
}: DepartmentModalsProps) {
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

      {/* MODAL 3: Curriculum Syllabus Modal */}
      {selectedCurriculumDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-surface border border-line rounded-2xl w-full max-w-2xl shadow-xl p-6 relative max-h-[90dvh] flex flex-col">
            <div className="flex items-center justify-between border-b border-line pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-soft border border-brand/30 text-brand flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-fg">
                    Accredited Curriculum Syllabus •{" "}
                    {selectedCurriculumDept.code}
                  </h3>
                  <p className="text-xs text-fg-muted font-sans">
                    {selectedCurriculumDept.name} •{" "}
                    {selectedCurriculumDept.activePrograms.join(", ")}
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close modal"
                onClick={onCloseCurriculumDept}
                className="min-w-[36px] min-h-[36px] inline-flex items-center justify-center rounded-lg text-fg-muted hover:text-fg hover:bg-surface-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
              {selectedCurriculumDept.curriculumList.map((course, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-surface-2 border border-line flex flex-wrap items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-semibold text-brand bg-surface px-2 py-0.5 rounded border border-line">
                        {course.code}
                      </span>
                      <span className="text-xs font-sans px-2 py-0.5 rounded-full bg-surface text-fg-muted border border-line">
                        {course.semester}
                      </span>
                    </div>
                    <div className="font-semibold text-xs text-fg truncate">
                      {course.title}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-sans tabular-nums text-xs text-success font-semibold bg-success-light px-2.5 py-1 rounded-lg border border-success/30">
                      {course.credits.toFixed(1)} Credits
                    </span>
                    <span className="font-sans text-xs text-fg-muted bg-surface px-2 py-1 rounded border border-line">
                      {course.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 mt-4 border-t border-line flex items-center justify-between text-xs text-fg-muted">
              <span className="font-sans">
                Outcome-Based Education (OBE) Standard Compliant
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
      )}

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
              <div>
                <label
                  htmlFor="dept-settings-hod"
                  className="block text-xs font-semibold text-fg-muted mb-1.5"
                >
                  Assigned Head of Department
                </label>
                <input
                  id="dept-settings-hod"
                  type="text"
                  defaultValue={selectedSettingsDept.hodName}
                  className="w-full min-h-[44px] bg-surface-2 border border-line focus:border-brand rounded-xl px-3.5 py-2 text-xs text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
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
                  defaultValue={selectedSettingsDept.office}
                  className="w-full min-h-[44px] bg-surface-2 border border-line focus:border-brand rounded-xl px-3.5 py-2 text-xs text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="dept-settings-status"
                    className="block text-xs font-semibold text-fg-muted mb-1.5"
                  >
                    Accreditation Status
                  </label>
                  <select
                    id="dept-settings-status"
                    defaultValue={selectedSettingsDept.status}
                    className="w-full min-h-[44px] bg-surface-2 border border-line focus:border-brand rounded-xl px-3 py-2 text-xs text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  >
                    <option value="Accredited • Active">
                      Accredited • Active
                    </option>
                    <option value="Pending Review">Pending Review</option>
                  </select>
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
                    defaultValue={selectedSettingsDept.totalStudents}
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
                  onClick={() => onSaveSettings(selectedSettingsDept)}
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
