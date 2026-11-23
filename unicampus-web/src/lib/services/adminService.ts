import { 
  Profile, 
  Department, 
  Subject, 
  ClassRoutine, 
  Notice, 
  PaymentTransaction, 
  TeacherWage, 
  PaymentMethod,
  Semester,
  OrdinalSemesterName,
  AuditLogItem,
  GradebookPolicy
} from '@/types/admin';
import { 
  INITIAL_PROFILES, 
  INITIAL_DEPARTMENTS, 
  INITIAL_SEMESTERS, 
  INITIAL_SUBJECTS, 
  INITIAL_ROUTINES, 
  INITIAL_NOTICES, 
  INITIAL_TRANSACTIONS, 
  INITIAL_TEACHER_WAGES,
} from '@/lib/mockData';
import {
  clampProgramSemesters,
  DEFAULT_PROGRAM_SEMESTERS,
  getSemestersForCount,
} from '@/lib/canonicalCampus';
import { getSupabaseClient } from '@/lib/supabase/client';
import { supabaseSyncBridge } from '@/lib/supabase/syncBridge';
import {
  generateStudentAcademicId,
  generateTeacherAcademicId,
} from '@/lib/academicIdGenerator';

const ADMIN_SCHEMA_VERSION = 'v4-blank';
const SCHEMA_VERSION_KEY = 'unicampus_admin_schema_version';

const STORAGE_KEYS = {
  PROFILES: 'unicampus_admin_profiles',
  DEPARTMENTS: 'unicampus_admin_departments',
  SEMESTERS: 'unicampus_admin_semesters',
  SUBJECTS: 'unicampus_admin_subjects',
  ROUTINES: 'unicampus_admin_routines',
  NOTICES: 'unicampus_admin_notices',
  TRANSACTIONS: 'unicampus_admin_transactions',
  WAGES: 'unicampus_admin_wages',
  AUDIT_LOGS: 'unicampus_admin_audit_logs',
  GRADEBOOK_POLICIES: 'unicampus_admin_gradebook_policies',
};

const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: "log-1",
    time: "12m ago",
    timestamp: new Date(Date.now() - 12 * 60000).toISOString(),
    category: "Access",
    title: "Role Assignment",
    description: "Faculty portal role assigned to dr.farhana@unicampus.edu.",
    actor_name: "Admin",
    department_id: "dept-cse",
    department_name: "Computer Science & Engineering",
    iconBg: "bg-brand-soft",
    iconColor: "text-brand",
  },
  {
    id: "log-2",
    time: "24m ago",
    timestamp: new Date(Date.now() - 24 * 60000).toISOString(),
    category: "Gradebook",
    title: "Gradebook Lock",
    description: "CSE-3101 Sec A marks finalized and locked by Central Registry.",
    actor_name: "Academic Council",
    department_id: "dept-cse",
    department_name: "Computer Science & Engineering",
    iconBg: "bg-success-light",
    iconColor: "text-success",
  },
  {
    id: "log-3",
    time: "48m ago",
    timestamp: new Date(Date.now() - 48 * 60000).toISOString(),
    category: "Routine",
    title: "Master Routine Sync",
    description: "Room allocation verified for Lab 4A (Wednesday 02:45 PM slot).",
    actor_name: "Central Registrar",
    department_id: "dept-cse",
    department_name: "Computer Science & Engineering",
    iconBg: "bg-brand-soft",
    iconColor: "text-brand",
  },
  {
    id: "log-4",
    time: "1h ago",
    timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
    category: "Snapshot",
    title: "Academic Session Archive",
    description: "Semester gradebook & student registry records archived for Academic Year 2026.",
    actor_name: "System Registrar",
    department_id: null,
    department_name: "Central University Administration",
    iconBg: "bg-surface-2",
    iconColor: "text-fg-muted",
  },
];

const INITIAL_GRADEBOOK_POLICIES: Record<string, GradebookPolicy> = {
  "CSE-3101": {
    course_code: "CSE-3101",
    course_title: "Design & Analysis of Algorithms",
    department_id: "dept-cse",
    is_locked: false,
    status: "Open",
    submission_deadline: "2026-11-30",
  },
  "CSE-3102": {
    course_code: "CSE-3102",
    course_title: "Algorithms Lab & Problem Solving",
    department_id: "dept-cse",
    is_locked: true,
    locked_at: "2026-11-20T10:00:00Z",
    locked_by: "Central Registry",
    status: "Locked",
    submission_deadline: "2026-11-20",
  },
  "CSE-3205": {
    course_code: "CSE-3205",
    course_title: "Software Engineering & Architecture",
    department_id: "dept-cse",
    is_locked: false,
    status: "Open",
    submission_deadline: "2026-12-05",
  },
  "CSE-4109": {
    course_code: "CSE-4109",
    course_title: "Machine Learning & Neural Nets",
    department_id: "dept-cse",
    is_locked: false,
    status: "Open",
    submission_deadline: "2026-12-10",
  },
};

let schemaChecked = false;

function ensureSchemaVersion(): void {
  if (typeof window === 'undefined' || schemaChecked) return;
  try {
    if (localStorage.getItem(SCHEMA_VERSION_KEY) !== ADMIN_SCHEMA_VERSION) {
      Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
      localStorage.setItem(SCHEMA_VERSION_KEY, ADMIN_SCHEMA_VERSION);
    }
    schemaChecked = true;
  } catch (e) {
    console.error('Error verifying admin schema version:', e);
  }
}

function getStoredItem<T>(key: string, fallback: T): T {
  const effectiveFallback = supabaseSyncBridge.isLive()
    ? ((Array.isArray(fallback) ? [] : {}) as T)
    : fallback;
  if (typeof window === 'undefined') return effectiveFallback;
  ensureSchemaVersion();
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return effectiveFallback;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Error loading ${key} from storage:`, e);
    return effectiveFallback;
  }
}

function setStoredItem<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  ensureSchemaVersion();
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
}

class AdminService {
  private hydratePromise: Promise<boolean> | null = null;

  /**
   * Hydrates local reactive cache with live Supabase Postgres rows (departments,
   * semesters, subjects, and profiles) while preserving demo metadata & offline fallback.
   */
  async hydrateFromSupabase(force: boolean = false): Promise<boolean> {
    if (typeof window === 'undefined' || !supabaseSyncBridge.isLive()) return false;
    if (this.hydratePromise && !force) return this.hydratePromise;

    this.hydratePromise = (async () => {
      try {
        const [liveDepts, liveSemesters, liveSubjects, liveProfilesPage] = await Promise.all([
          supabaseSyncBridge.fetchDepartments(() => []),
          supabaseSyncBridge.fetchSemesters(() => []),
          supabaseSyncBridge.fetchSubjects(undefined, () => []),
          supabaseSyncBridge.fetchProfilesPage({ limit: 100 }, () => []),
        ]);

        let changedDepts = false;
        let changedProfiles = false;

        // Strictly mirror live Supabase state (supports 0 departments / blank slate)
        setStoredItem(STORAGE_KEYS.DEPARTMENTS, liveDepts);
        setStoredItem(STORAGE_KEYS.SEMESTERS, liveSemesters);
        setStoredItem(STORAGE_KEYS.SUBJECTS, liveSubjects);
        setStoredItem(STORAGE_KEYS.PROFILES, liveProfilesPage.items);
        changedDepts = true;
        changedProfiles = true;

        if (changedDepts) {
          window.dispatchEvent(new Event('unicampus:departments-updated'));
        }
        if (changedProfiles) {
          window.dispatchEvent(new Event('unicampus:profiles-updated'));
        }
        return changedDepts || changedProfiles;
      } catch {
        return false;
      } finally {
        this.hydratePromise = null;
      }
    })();

    return this.hydratePromise;
  }

  // ===================== PROFILES =====================
  getProfiles(): Profile[] {
    return getStoredItem<Profile[]>(
      STORAGE_KEYS.PROFILES,
      supabaseSyncBridge.isLive() ? [] : INITIAL_PROFILES
    );
  }

  approveProfile(id: string, actorName: string = 'Academic Administration'): Profile[] {
    const profiles = this.getProfiles();
    const target = profiles.find((p) => p.id === id);
    const updated = profiles.map((p) =>
      p.id === id
        ? {
            ...p,
            is_approved: true,
            account_status: 'active' as const,
            rejection_reason: null,
            reviewed_at: new Date().toISOString(),
            reviewed_by: actorName,
          }
        : p
    );
    setStoredItem(STORAGE_KEYS.PROFILES, updated);
    if (target) {
      this.logAction({
        category: 'Access',
        title: 'Registration Approved',
        description: `Approved ${target.role} registration for ${target.full_name} (${target.student_id || target.teacher_code || target.email}).`,
        actor_name: actorName,
        department_id: target.department_id,
        department_name: target.department_name,
      });
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('unicampus:profiles-updated'));
    }
    void supabaseSyncBridge.updateProfileStatus(id, {
      is_approved: true,
      account_status: 'active',
      rejection_reason: null,
      reviewed_at: new Date().toISOString(),
      reviewed_by: actorName,
    });
    return updated;
  }

  suspendProfile(id: string): Profile[] {
    const profiles = this.getProfiles();
    const updated = profiles.map((p) => (p.id === id ? { ...p, is_approved: false, account_status: 'suspended' as const } : p));
    setStoredItem(STORAGE_KEYS.PROFILES, updated);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('unicampus:profiles-updated'));
    }
    void supabaseSyncBridge.updateProfileStatus(id, {
      is_approved: false,
      account_status: 'suspended',
    });
    return updated;
  }

  reactivateProfile(id: string): Profile[] {
    const profiles = this.getProfiles();
    const updated = profiles.map((p) => (p.id === id ? { ...p, is_approved: true, account_status: 'active' as const } : p));
    setStoredItem(STORAGE_KEYS.PROFILES, updated);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('unicampus:profiles-updated'));
    }
    void supabaseSyncBridge.updateProfileStatus(id, {
      is_approved: true,
      account_status: 'active',
    });
    return updated;
  }

  assignCourseToTeacher(teacherId: string, courseCode: string): Profile[] {
    const profiles = this.getProfiles();
    const updated = profiles.map((p) => {
      if (p.id !== teacherId) return p;
      const assigned = ((p as unknown as Record<string, unknown>).assigned_courses as string[]) || [];
      if (assigned.includes(courseCode)) return p;
      return { ...p, assigned_courses: [...assigned, courseCode] };
    });
    setStoredItem(STORAGE_KEYS.PROFILES, updated);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('unicampus:profiles-updated'));
    }
    return updated;
  }

  rejectProfile(
    id: string,
    reason: string = 'Application requires correction before verification.',
    actorName: string = 'Academic Administration'
  ): Profile[] {
    const profiles = this.getProfiles();
    const target = profiles.find((p) => p.id === id);
    const trimmedReason = reason.trim() || 'Application requires correction before verification.';
    const updated = profiles.map((p) =>
      p.id === id
        ? {
            ...p,
            is_approved: false,
            account_status: 'rejected' as const,
            rejection_reason: trimmedReason,
            reviewed_at: new Date().toISOString(),
            reviewed_by: actorName,
          }
        : p
    );
    setStoredItem(STORAGE_KEYS.PROFILES, updated);
    if (target) {
      this.logAction({
        category: 'Access',
        title: 'Registration Rejected',
        description: `Rejected ${target.full_name} (${target.email}): "${trimmedReason}"`,
        actor_name: actorName,
        department_id: target.department_id,
        department_name: target.department_name,
      });
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('unicampus:profiles-updated'));
    }
    void supabaseSyncBridge.updateProfileStatus(id, {
      is_approved: false,
      account_status: 'rejected',
      rejection_reason: trimmedReason,
      reviewed_at: new Date().toISOString(),
      reviewed_by: actorName,
    });
    return updated;
  }

  getProfileByEmail(email: string): Profile | undefined {
    const normalized = email.trim().toLowerCase();
    if (!normalized) return undefined;
    return this.getProfiles().find((p) => p.email.trim().toLowerCase() === normalized);
  }

  resubmitProfile(id: string, updates: Partial<Profile>): Profile | null {
    const profiles = this.getProfiles();
    let resubmitted: Profile | null = null;
    const updated = profiles.map((p) => {
      if (p.id !== id) return p;
      resubmitted = {
        ...p,
        ...updates,
        is_approved: false,
        account_status: 'pending' as const,
        rejection_reason: null,
        reviewed_at: null,
        reviewed_by: null,
      };
      return resubmitted;
    });
    if (!resubmitted) return null;
    setStoredItem(STORAGE_KEYS.PROFILES, updated);
    const finalProfile = resubmitted as Profile;
    this.logAction({
      category: 'Access',
      title: 'Application Resubmitted',
      description: `${finalProfile.full_name} (${finalProfile.email}) updated their dossier and re-applied for verification.`,
      actor_name: finalProfile.full_name,
      department_id: finalProfile.department_id,
      department_name: finalProfile.department_name,
    });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('unicampus:profiles-updated'));
    }
    return finalProfile;
  }

  deleteProfile(id: string, actorName: string = 'Admin'): Profile[] {
    const profiles = this.getProfiles();
    const target = profiles.find((p) => p.id === id);
    const updated = profiles.filter((p) => p.id !== id);
    setStoredItem(STORAGE_KEYS.PROFILES, updated);
    if (target) {
      this.logAction({
        category: 'Access',
        title: 'Account Permanently Deleted',
        description: `Removed ${target.role} account ${target.full_name} (${target.email}).`,
        actor_name: actorName,
        department_id: target.department_id,
        department_name: target.department_name,
      });
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('unicampus:profiles-updated'));
    }
    void supabaseSyncBridge.deleteProfile(id);
    return updated;
  }

  updateProfile(id: string, updates: Partial<Profile>): Profile[] {
    const profiles = this.getProfiles();
    const updated = profiles.map((p) => (p.id === id ? { ...p, ...updates } : p));
    setStoredItem(STORAGE_KEYS.PROFILES, updated);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('unicampus:profiles-updated'));
    }
    return updated;
  }

  createProfile(data: Omit<Profile, 'id' | 'created_at'>): Profile {
    const profiles = this.getProfiles();
    const depts = this.getDepartments();
    const dept = depts.find((d) => d.id === data.department_id);
    const deptCode = dept?.code || data.department_id.replace(/^dept-/, '').toUpperCase() || 'GEN';

    const autoStudentId =
      data.role === 'student'
        ? data.student_id || generateStudentAcademicId(deptCode, profiles)
        : data.student_id;
    const autoTeacherCode =
      data.role === 'teacher'
        ? data.teacher_code || generateTeacherAcademicId(deptCode, profiles)
        : data.teacher_code;

    const newProfile: Profile = {
      ...data,
      student_id: autoStudentId,
      teacher_code: autoTeacherCode,
      id: `user-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    const updated = [newProfile, ...profiles];
    setStoredItem(STORAGE_KEYS.PROFILES, updated);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('unicampus:profiles-updated'));
    }
    return newProfile;
  }

  // ===================== DEPARTMENTS & CURRICULUM =====================
  getDepartments(): Department[] {
    return getStoredItem<Department[]>(
      STORAGE_KEYS.DEPARTMENTS,
      supabaseSyncBridge.isLive() ? [] : INITIAL_DEPARTMENTS
    );
  }

  getSemesters(deptId?: string): Semester[] {
    const all = getStoredItem<Semester[]>(
      STORAGE_KEYS.SEMESTERS,
      supabaseSyncBridge.isLive() ? [] : INITIAL_SEMESTERS
    );
    if (!deptId) return all;
    return all.filter((s) => s.department_id === deptId);
  }

  updateDepartmentHOD(deptId: string, headTeacherId: string | null, headTeacherName: string): Department[] {
    const depts = this.getDepartments();
    const target = depts.find((d) => d.id === deptId);
    const updated = depts.map((d) =>
      d.id === deptId
        ? { ...d, head_teacher_id: headTeacherId, head_teacher_name: headTeacherName }
        : d
    );
    setStoredItem(STORAGE_KEYS.DEPARTMENTS, updated);
    if (target) {
      this.logAction({
        category: 'Access',
        title: 'Department Head Updated',
        description: `Assigned ${headTeacherName} as Head of Department for ${target.name} (${target.code}).`,
        actor_name: 'Admin',
        department_id: target.id,
        department_name: target.name,
      });
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('unicampus:departments-updated'));
    }
    void supabaseSyncBridge.updateDepartmentHod(target?.code || deptId, headTeacherId, headTeacherName);
    return updated;
  }

  updateDepartmentAdmin(deptId: string, adminProfileId: string, adminName: string, adminEmail: string): Department[] {
    const depts = this.getDepartments();
    const updated = depts.map((d) => 
      d.id === deptId 
        ? { ...d, dept_admin_id: adminProfileId, dept_admin_name: adminName, dept_admin_email: adminEmail }
        : d
    );
    setStoredItem(STORAGE_KEYS.DEPARTMENTS, updated);

    // Also update profile to be a dept_admin for this department
    const profiles = this.getProfiles();
    const dept = depts.find(d => d.id === deptId);
    const updatedProfiles = profiles.map((p) =>
      p.id === adminProfileId
        ? { ...p, role: 'admin' as const, admin_role: 'dept_admin' as const, department_id: deptId, department_name: dept?.name || p.department_name }
        : p
    );
    setStoredItem(STORAGE_KEYS.PROFILES, updatedProfiles);
    return updated;
  }

  getDeptAdmins(): Profile[] {
    const profiles = this.getProfiles();
    return profiles.filter((p) => p.role === 'admin' && p.admin_role === 'dept_admin');
  }

  getSuperAdmins(): Profile[] {
    const profiles = this.getProfiles();
    return profiles.filter((p) => p.role === 'admin' && p.admin_role === 'super_admin');
  }

  getDepartmentSemesterCount(departmentIdOrCode?: string | null): number {
    if (!departmentIdOrCode) return DEFAULT_PROGRAM_SEMESTERS;
    const depts = this.getDepartments();
    const target = departmentIdOrCode.toLowerCase();
    const match = depts.find(
      (d) =>
        d.id.toLowerCase() === target ||
        d.code.toLowerCase() === target ||
        d.name.toLowerCase() === target
    );
    if (match && typeof match.total_semesters === 'number' && match.total_semesters >= 2) {
      return clampProgramSemesters(match.total_semesters);
    }
    if (match) {
      const deptSems = this.getSemesters(match.id);
      if (deptSems.length >= 2) {
        return clampProgramSemesters(deptSems.length);
      }
    }
    return DEFAULT_PROGRAM_SEMESTERS;
  }

  getDepartmentSemesters(departmentIdOrCode?: string | null): OrdinalSemesterName[] {
    return getSemestersForCount(this.getDepartmentSemesterCount(departmentIdOrCode));
  }

  getMaxSemesterCount(): number {
    const depts = this.getDepartments();
    if (depts.length === 0) return DEFAULT_PROGRAM_SEMESTERS;
    return depts.reduce<number>(
      (max, d) => Math.max(max, this.getDepartmentSemesterCount(d.id)),
      DEFAULT_PROGRAM_SEMESTERS
    );
  }

  updateDepartmentSemesterCount(deptId: string, totalSemesters: number): Department[] {
    const count = clampProgramSemesters(totalSemesters);
    const depts = this.getDepartments();
    const targetDept = depts.find((d) => d.id === deptId);
    const slug = (targetDept?.code || deptId.replace(/^dept-/, ''))
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');

    const updatedDepts = depts.map((d) =>
      d.id === deptId ? { ...d, total_semesters: count } : d
    );
    setStoredItem(STORAGE_KEYS.DEPARTMENTS, updatedDepts);

    // Synchronize stored semesters list for this department (1..count)
    const allSemesters = this.getSemesters();
    const otherSemesters = allSemesters.filter((s) => s.department_id !== deptId);
    const existingByIndex = new Map(
      allSemesters
        .filter((s) => s.department_id === deptId)
        .map((s) => [s.order_index, s])
    );

    const nextDeptSemesters: Semester[] = getSemestersForCount(count).map((name, idx) => {
      const orderIndex = idx + 1;
      const existing = existingByIndex.get(orderIndex);
      return (
        existing ?? {
          id: `sem-${slug}-${orderIndex}`,
          department_id: deptId,
          name,
          order_index: orderIndex,
        }
      );
    });

    setStoredItem(STORAGE_KEYS.SEMESTERS, [...otherSemesters, ...nextDeptSemesters]);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('unicampus:departments-updated'));
    }
    void supabaseSyncBridge.updateDepartmentSemesterCount(deptId, count);
    return updatedDepts;
  }

  createDepartment(data: Omit<Department, 'id'>): Department {
    const depts = this.getDepartments();
    const slug = data.code.toLowerCase().replace(/[^a-z0-9]/g, '');
    let id = `dept-${slug}`;
    if (depts.some((d) => d.id === id)) {
      id = `dept-${slug}-${Date.now().toString().slice(-4)}`;
    }
    const totalSemesters = clampProgramSemesters(data.total_semesters);
    const newDept: Department = { ...data, id, total_semesters: totalSemesters };
    const updated = [...depts, newDept];
    setStoredItem(STORAGE_KEYS.DEPARTMENTS, updated);

    // Auto-generate configured semester structure (1st through Nth Semester) for this department
    const semesters = this.getSemesters();
    const newSemesters: Semester[] = getSemestersForCount(totalSemesters).map((name, index) => ({
      id: `sem-${slug}-${index + 1}`,
      department_id: id,
      name,
      order_index: index + 1,
    }));
    setStoredItem(STORAGE_KEYS.SEMESTERS, [...semesters, ...newSemesters]);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('unicampus:departments-updated'));
    }
    void supabaseSyncBridge.createDepartmentWithSemesters({ ...data, total_semesters: totalSemesters });
    return newDept;
  }

  getSubjects(departmentId?: string, semesterId?: string): Subject[] {
    let subjects = getStoredItem<Subject[]>(
      STORAGE_KEYS.SUBJECTS,
      supabaseSyncBridge.isLive() ? [] : INITIAL_SUBJECTS
    );
    if (departmentId) {
      subjects = subjects.filter((s) => s.department_id === departmentId);
    }
    if (semesterId) {
      subjects = subjects.filter((s) => s.semester_id === semesterId);
    }
    return subjects;
  }

  createSubject(data: Omit<Subject, 'id'>): Subject {
    const subjects = this.getSubjects();
    const newSubject: Subject = {
      ...data,
      id: `sub-${Date.now()}`,
    };
    const updated = [...subjects, newSubject];
    setStoredItem(STORAGE_KEYS.SUBJECTS, updated);
    void supabaseSyncBridge.createSubject(data);
    return newSubject;
  }

  updateSubject(id: string, data: Partial<Subject>): Subject[] {
    const subjects = this.getSubjects();
    const updated = subjects.map((s) => (s.id === id ? { ...s, ...data } : s));
    setStoredItem(STORAGE_KEYS.SUBJECTS, updated);
    void supabaseSyncBridge.updateSubject(id, data);
    return updated;
  }

  deleteSubject(id: string): Subject[] {
    const subjects = this.getSubjects();
    const updated = subjects.filter((s) => s.id !== id);
    setStoredItem(STORAGE_KEYS.SUBJECTS, updated);
    void supabaseSyncBridge.deleteSubject(id);
    return updated;
  }

  // ===================== CLASS ROUTINES & TIMETABLE =====================
  getRoutines(departmentName?: string, semesterName?: string): ClassRoutine[] {
    let routines = getStoredItem<ClassRoutine[]>(STORAGE_KEYS.ROUTINES, INITIAL_ROUTINES);
    if (departmentName) {
      routines = routines.filter((r) => r.department_name === departmentName);
    }
    if (semesterName) {
      routines = routines.filter((r) => r.semester_name === semesterName);
    }
    return routines;
  }

  getRoutineItems(departmentName?: string, semesterName?: string): ClassRoutine[] {
    return this.getRoutines(departmentName, semesterName);
  }

  checkRoutineConflicts(candidate: {
    id?: string;
    day_of_week: number;
    start_time: string;
    end_time: string;
    room: string;
    teacher_name: string;
  }): { hasConflict: boolean; message: string; conflicts: string[] } {
    const allRoutines = getStoredItem<ClassRoutine[]>(STORAGE_KEYS.ROUTINES, INITIAL_ROUTINES);
    const conflicts: string[] = [];

    // Helper to test time overlap between two intervals [s1, e1) and [s2, e2)
    const timesOverlap = (s1: string, e1: string, s2: string, e2: string) => {
      return s1 < e2 && s2 < e1;
    };

    for (const r of allRoutines) {
      if (candidate.id && r.id === candidate.id) continue;
      if (r.day_of_week !== candidate.day_of_week) continue;

      if (timesOverlap(candidate.start_time, candidate.end_time, r.start_time, r.end_time)) {
        if (r.room.trim().toLowerCase() === candidate.room.trim().toLowerCase()) {
          conflicts.push(`Room conflict: ${r.room} is already booked for ${r.subject_code} (${r.subject_title}) at ${r.start_time} - ${r.end_time}.`);
        }
        if (r.teacher_name.trim().toLowerCase() === candidate.teacher_name.trim().toLowerCase()) {
          conflicts.push(`Faculty conflict: ${r.teacher_name} is already teaching ${r.subject_code} in ${r.room} at ${r.start_time} - ${r.end_time}.`);
        }
      }
    }

    return {
      hasConflict: conflicts.length > 0,
      message: conflicts.join(' '),
      conflicts,
    };
  }

  createRoutine(data: Omit<ClassRoutine, 'id'>): ClassRoutine {
    const routines = getStoredItem<ClassRoutine[]>(STORAGE_KEYS.ROUTINES, INITIAL_ROUTINES);
    const newRoutine: ClassRoutine = {
      ...data,
      id: `rtn-${Date.now()}`,
    };
    const updated = [...routines, newRoutine];
    setStoredItem(STORAGE_KEYS.ROUTINES, updated);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('unicampus:routines-updated'));
    }
    return newRoutine;
  }

  updateRoutine(id: string, data: Partial<ClassRoutine>): ClassRoutine[] {
    const routines = getStoredItem<ClassRoutine[]>(STORAGE_KEYS.ROUTINES, INITIAL_ROUTINES);
    const updated = routines.map((r) => (r.id === id ? { ...r, ...data } : r));
    setStoredItem(STORAGE_KEYS.ROUTINES, updated);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('unicampus:routines-updated'));
    }
    return updated;
  }

  deleteRoutine(id: string): ClassRoutine[] {
    const routines = getStoredItem<ClassRoutine[]>(STORAGE_KEYS.ROUTINES, INITIAL_ROUTINES);
    const updated = routines.filter((r) => r.id !== id);
    setStoredItem(STORAGE_KEYS.ROUTINES, updated);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('unicampus:routines-updated'));
    }
    return updated;
  }

  publishRoutines(routines?: ClassRoutine[]): void {
    if (routines) {
      setStoredItem(STORAGE_KEYS.ROUTINES, routines);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('unicampus:routines-updated'));
    }
  }

  // ===================== NOTICES & BROADCAST =====================
  getNotices(): Notice[] {
    return getStoredItem<Notice[]>(STORAGE_KEYS.NOTICES, INITIAL_NOTICES);
  }

  createNotice(data: Omit<Notice, 'id' | 'created_at' | 'views'>): Notice {
    const notices = this.getNotices();
    const newNotice: Notice = {
      ...data,
      id: `notif-${Date.now()}`,
      created_at: new Date().toISOString(),
      views: 0,
      status: 'Published',
    };
    const updated = [newNotice, ...notices];
    setStoredItem(STORAGE_KEYS.NOTICES, updated);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('unicampus:notices-updated'));
    }
    return newNotice;
  }

  updateNotice(id: string, data: Partial<Notice>): Notice[] {
    const notices = this.getNotices();
    const updated = notices.map((n) => (n.id === id ? { ...n, ...data } : n));
    setStoredItem(STORAGE_KEYS.NOTICES, updated);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('unicampus:notices-updated'));
    }
    return updated;
  }

  deleteNotice(id: string): Notice[] {
    const notices = this.getNotices();
    const updated = notices.filter((n) => n.id !== id);
    setStoredItem(STORAGE_KEYS.NOTICES, updated);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('unicampus:notices-updated'));
    }
    return updated;
  }

  bulkDeleteNotices(ids: string[]): Notice[] {
    const notices = this.getNotices();
    const set = new Set(ids);
    const updated = notices.filter((n) => !set.has(n.id));
    setStoredItem(STORAGE_KEYS.NOTICES, updated);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('unicampus:notices-updated'));
    }
    return updated;
  }

  togglePinNotice(id: string): Notice[] {
    const notices = this.getNotices();
    const updated = notices.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n));
    setStoredItem(STORAGE_KEYS.NOTICES, updated);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('unicampus:notices-updated'));
    }
    return updated;
  }

  async uploadNoticeAttachment(file: File): Promise<string> {
    try {
      const supabase = getSupabaseClient();
      if (!supabase) return URL.createObjectURL(file);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `notices/${fileName}`;

      const { data, error } = await supabase.storage
        .from('notices')
        .upload(filePath, file);

      if (error || !data) {
        return URL.createObjectURL(file);
      }

      const { data: urlData } = supabase.storage
        .from('notices')
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch {
      return URL.createObjectURL(file);
    }
  }

  // ===================== TRANSACTIONS & PAYMENTS =====================
  getTransactions(): PaymentTransaction[] {
    return getStoredItem<PaymentTransaction[]>(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
  }

  createTransaction(data: Omit<PaymentTransaction, 'id' | 'created_at'>): PaymentTransaction {
    const txns = this.getTransactions();
    const newTxn: PaymentTransaction = {
      ...data,
      id: `txn-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    const updated = [newTxn, ...txns];
    setStoredItem(STORAGE_KEYS.TRANSACTIONS, updated);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('unicampus:finance-updated'));
    }
    return newTxn;
  }

  exportTransactionsCSV(transactions: PaymentTransaction[]): string {
    const headers = [
      'Transaction ID',
      'Receipt Number',
      'User Name',
      'Student ID',
      'Department',
      'Semester',
      'Type',
      'Amount (BDT)',
      'Payment Gateway',
      'Status',
      'Date & Time',
    ];

    const escapeCsv = (str: string | number | null | undefined) => {
      if (str === null || str === undefined) return '""';
      const s = String(str).replace(/"/g, '""');
      return `"${s}"`;
    };

    const rows = transactions.map((t) => [
      escapeCsv(t.transaction_id),
      escapeCsv(t.receipt_number),
      escapeCsv(t.user_name),
      escapeCsv(t.student_id || 'N/A'),
      escapeCsv(t.department_name),
      escapeCsv(t.semester_name),
      escapeCsv(t.type),
      escapeCsv(t.amount),
      escapeCsv(t.payment_method),
      escapeCsv(t.status),
      escapeCsv(new Date(t.created_at).toLocaleString()),
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  }

  // ===================== TEACHER WAGES (PAYROLL) =====================
  getTeacherWages(month?: string): TeacherWage[] {
    const wages = getStoredItem<TeacherWage[]>(STORAGE_KEYS.WAGES, INITIAL_TEACHER_WAGES);
    if (!month) return wages;
    return wages.filter((w) => w.month.toLowerCase() === month.toLowerCase());
  }

  disburseWage(id: string, paymentMethod: string = 'Bank Transfer'): { updatedWages: TeacherWage[]; newTransaction: PaymentTransaction | null } {
    const wages = getStoredItem<TeacherWage[]>(STORAGE_KEYS.WAGES, INITIAL_TEACHER_WAGES);
    const target = wages.find((w) => w.id === id);
    if (!target) return { updatedWages: wages, newTransaction: null };

    const txnId = `TXN-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
    const receiptNum = `REC-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date().toISOString();

    const updated = wages.map((w) =>
      w.id === id
        ? {
            ...w,
            status: 'Disbursed' as const,
            payment_method: paymentMethod,
            disbursed_at: now,
            transaction_id: txnId,
          }
        : w
    );
    setStoredItem(STORAGE_KEYS.WAGES, updated);

    // Record matching finance outflow transaction
    const newTxn = this.createTransaction({
      transaction_id: txnId,
      receipt_number: receiptNum,
      user_name: target.teacher_name,
      student_id: null,
      user_id: target.teacher_id,
      department_name: target.department_name,
      semester_name: '8th Semester',
      type: 'teacher_wage',
      amount: target.net_amount,
      payment_method: (paymentMethod as PaymentMethod) || 'Bank Transfer',
      status: 'Paid',
    });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('unicampus:finance-updated'));
    }

    return { updatedWages: updated, newTransaction: newTxn };
  }

  disburseAllPendingWages(month: string, paymentMethod: string = 'Bank Transfer'): { updatedWages: TeacherWage[]; count: number } {
    const wages = getStoredItem<TeacherWage[]>(STORAGE_KEYS.WAGES, INITIAL_TEACHER_WAGES);
    let count = 0;
    const now = new Date().toISOString();

    const updated = wages.map((w) => {
      if (w.month.toLowerCase() === month.toLowerCase() && w.status === 'Pending') {
        count++;
        const txnId = `TXN-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
        const receiptNum = `REC-${Math.floor(100000 + Math.random() * 900000)}`;

        this.createTransaction({
          transaction_id: txnId,
          receipt_number: receiptNum,
          user_name: w.teacher_name,
          student_id: null,
          user_id: w.teacher_id,
          department_name: w.department_name,
          semester_name: '8th Semester',
          type: 'teacher_wage',
          amount: w.net_amount,
          payment_method: (paymentMethod as PaymentMethod) || 'Bank Transfer',
          status: 'Paid',
        });

        return {
          ...w,
          status: 'Disbursed' as const,
          payment_method: paymentMethod,
          disbursed_at: now,
          transaction_id: txnId,
        };
      }
      return w;
    });

    setStoredItem(STORAGE_KEYS.WAGES, updated);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('unicampus:finance-updated'));
    }
    return { updatedWages: updated, count };
  }

  exportWagesCSV(wages: TeacherWage[]): string {
    const headers = [
      'Faculty Name',
      'Teacher Code',
      'Department',
      'Payroll Month',
      'Base Salary (BDT)',
      'Allowances (BDT)',
      'Deductions (BDT)',
      'Net Amount (BDT)',
      'Payment Status',
      'Disbursed Timestamp',
      'Disbursement TXN ID',
    ];

    const escapeCsv = (str: string | number | null | undefined) => {
      if (str === null || str === undefined) return '""';
      const s = String(str).replace(/"/g, '""');
      return `"${s}"`;
    };

    const rows = wages.map((w) => [
      escapeCsv(w.teacher_name),
      escapeCsv(w.teacher_code),
      escapeCsv(w.department_name),
      escapeCsv(w.month),
      escapeCsv(w.base_amount),
      escapeCsv(w.allowances),
      escapeCsv(w.deductions),
      escapeCsv(w.net_amount),
      escapeCsv(w.status),
      escapeCsv(w.disbursed_at ? new Date(w.disbursed_at).toLocaleString() : 'N/A'),
      escapeCsv(w.transaction_id || 'N/A'),
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  }

  // ===================== AUDIT LOGS & ACTIONS =====================
  getAuditLogs(departmentId?: string): AuditLogItem[] {
    const logs = getStoredItem<AuditLogItem[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    if (!departmentId || departmentId === 'all') return logs;
    return logs.filter((l) => !l.department_id || l.department_id === departmentId);
  }

  logAction(log: Omit<AuditLogItem, 'id' | 'timestamp' | 'time'>): AuditLogItem {
    const logs = getStoredItem<AuditLogItem[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    const newLog: AuditLogItem = {
      ...log,
      id: `log-${Date.now()}`,
      time: 'Just now',
      timestamp: new Date().toISOString(),
      iconBg: log.iconBg || 'bg-brand-soft',
      iconColor: log.iconColor || 'text-brand',
    };
    const updated = [newLog, ...logs].slice(0, 50);
    setStoredItem(STORAGE_KEYS.AUDIT_LOGS, updated);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('unicampus:audit-updated'));
    }
    return newLog;
  }

  // ===================== GRADEBOOK GOVERNANCE =====================
  getGradebookPolicies(): Record<string, GradebookPolicy> {
    return getStoredItem<Record<string, GradebookPolicy>>(
      STORAGE_KEYS.GRADEBOOK_POLICIES,
      INITIAL_GRADEBOOK_POLICIES
    );
  }

  getGradebookPolicy(courseCode: string): GradebookPolicy {
    const policies = this.getGradebookPolicies();
    if (policies[courseCode]) return policies[courseCode];
    return {
      course_code: courseCode,
      is_locked: false,
      status: 'Open',
    };
  }

  setGradebookLock(
    courseCode: string,
    isLocked: boolean,
    lockedBy: string = 'Central Registry',
    departmentId?: string
  ): GradebookPolicy {
    const policies = this.getGradebookPolicies();
    const existing = policies[courseCode] || {
      course_code: courseCode,
      is_locked: false,
      status: 'Open',
    };
    const updatedPolicy: GradebookPolicy = {
      ...existing,
      department_id: departmentId || existing.department_id,
      is_locked: isLocked,
      locked_at: isLocked ? new Date().toISOString() : null,
      locked_by: isLocked ? lockedBy : null,
      status: isLocked ? 'Locked' : 'Open',
    };
    const updated = {
      ...policies,
      [courseCode]: updatedPolicy,
    };
    setStoredItem(STORAGE_KEYS.GRADEBOOK_POLICIES, updated);
    this.logAction({
      category: 'Gradebook',
      title: isLocked ? 'Gradebook Locked' : 'Gradebook Unlocked',
      description: `${courseCode} score sheet ${isLocked ? 'locked from faculty edits' : 'reopened for grade revision'} by ${lockedBy}.`,
      actor_name: lockedBy,
      department_id: departmentId || existing.department_id,
      iconBg: isLocked ? 'bg-warning-light' : 'bg-success-light',
      iconColor: isLocked ? 'text-warning' : 'text-success',
    });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('unicampus:gradebook-policy-updated'));
    }
    return updatedPolicy;
  }

  // ===================== STUDENT HOLDS =====================
  toggleStudentHold(
    id: string,
    holdType: 'academic' | 'financial',
    enable: boolean,
    reason: string = 'Administrative review'
  ): Profile | null {
    const profiles = this.getProfiles();
    let targetProfile: Profile | null = null;
    const updated = profiles.map((p) => {
      if (p.id === id || p.student_id === id) {
        targetProfile = {
          ...p,
          academic_hold: holdType === 'academic' ? enable : p.academic_hold,
          financial_hold: holdType === 'financial' ? enable : p.financial_hold,
          hold_reason: enable ? reason : null,
        };
        return targetProfile;
      }
      return p;
    });

    if (targetProfile) {
      setStoredItem(STORAGE_KEYS.PROFILES, updated);
      this.logAction({
        category: 'Hold',
        title: `${holdType === 'academic' ? 'Academic' : 'Financial'} Hold ${enable ? 'Applied' : 'Cleared'}`,
        description: `${enable ? 'Placed' : 'Removed'} ${holdType} hold on ${(targetProfile as Profile).full_name} (${(targetProfile as Profile).student_id || id}): ${reason}.`,
        actor_name: 'Academic Affairs',
        department_id: (targetProfile as Profile).department_id,
        department_name: (targetProfile as Profile).department_name,
        iconBg: enable ? 'bg-danger-light' : 'bg-success-light',
        iconColor: enable ? 'text-danger' : 'text-success',
      });
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('unicampus:profiles-updated'));
      }
    }
    return targetProfile;
  }

  // ===================== RESET STORE =====================
  resetStore(): void {
    if (typeof window === 'undefined') return;
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    localStorage.setItem(SCHEMA_VERSION_KEY, ADMIN_SCHEMA_VERSION);
    schemaChecked = true;
  }
}

export const adminService = new AdminService();

