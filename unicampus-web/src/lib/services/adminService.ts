import { 
  Profile, 
  Department, 
  Subject, 
  ClassRoutine, 
  Notice, 
  PaymentTransaction, 
  TeacherWage, 
  PaymentMethod,
  Semester
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
  ORDINAL_SEMESTERS
} from '@/lib/mockData';
import { getSupabaseClient } from '@/lib/supabase/client';

const ADMIN_SCHEMA_VERSION = 'v2';
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
  if (typeof window === 'undefined') return fallback;
  ensureSchemaVersion();
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Error loading ${key} from storage:`, e);
    return fallback;
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
  // ===================== PROFILES =====================
  getProfiles(): Profile[] {
    return getStoredItem<Profile[]>(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
  }

  approveProfile(id: string): Profile[] {
    const profiles = this.getProfiles();
    const updated = profiles.map((p) => (p.id === id ? { ...p, is_approved: true } : p));
    setStoredItem(STORAGE_KEYS.PROFILES, updated);
    return updated;
  }

  rejectProfile(id: string): Profile[] {
    const profiles = this.getProfiles();
    const updated = profiles.filter((p) => p.id !== id);
    setStoredItem(STORAGE_KEYS.PROFILES, updated);
    return updated;
  }

  updateProfile(id: string, updates: Partial<Profile>): Profile[] {
    const profiles = this.getProfiles();
    const updated = profiles.map((p) => (p.id === id ? { ...p, ...updates } : p));
    setStoredItem(STORAGE_KEYS.PROFILES, updated);
    return updated;
  }

  createProfile(data: Omit<Profile, 'id' | 'created_at'>): Profile {
    const profiles = this.getProfiles();
    const newProfile: Profile = {
      ...data,
      id: `user-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    const updated = [newProfile, ...profiles];
    setStoredItem(STORAGE_KEYS.PROFILES, updated);
    return newProfile;
  }

  // ===================== DEPARTMENTS & CURRICULUM =====================
  getDepartments(): Department[] {
    return getStoredItem<Department[]>(STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
  }

  getSemesters(deptId?: string): Semester[] {
    const all = getStoredItem<Semester[]>(STORAGE_KEYS.SEMESTERS, INITIAL_SEMESTERS);
    if (!deptId) return all;
    return all.filter((s) => s.department_id === deptId);
  }

  updateDepartmentHOD(deptId: string, headTeacherId: string, headTeacherName: string): Department[] {
    const depts = this.getDepartments();
    const updated = depts.map((d) => 
      d.id === deptId 
        ? { ...d, head_teacher_id: headTeacherId, head_teacher_name: headTeacherName }
        : d
    );
    setStoredItem(STORAGE_KEYS.DEPARTMENTS, updated);
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

  createDepartment(data: Omit<Department, 'id'>): Department {
    const depts = this.getDepartments();
    const id = `dept-${data.code.toLowerCase()}`;
    const newDept: Department = { ...data, id };
    const updated = [...depts, newDept];
    setStoredItem(STORAGE_KEYS.DEPARTMENTS, updated);

    // Also auto-generate 1st to 8th semester for this new department
    const semesters = this.getSemesters();
    const newSemesters: Semester[] = ORDINAL_SEMESTERS.map((name, index) => ({
      id: `sem-${data.code.toLowerCase()}-${index + 1}`,
      department_id: id,
      name,
      order_index: index + 1,
    }));
    setStoredItem(STORAGE_KEYS.SEMESTERS, [...semesters, ...newSemesters]);

    return newDept;
  }

  getSubjects(departmentId?: string, semesterId?: string): Subject[] {
    let subjects = getStoredItem<Subject[]>(STORAGE_KEYS.SUBJECTS, INITIAL_SUBJECTS);
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
    return newSubject;
  }

  updateSubject(id: string, data: Partial<Subject>): Subject[] {
    const subjects = this.getSubjects();
    const updated = subjects.map((s) => (s.id === id ? { ...s, ...data } : s));
    setStoredItem(STORAGE_KEYS.SUBJECTS, updated);
    return updated;
  }

  deleteSubject(id: string): Subject[] {
    const subjects = this.getSubjects();
    const updated = subjects.filter((s) => s.id !== id);
    setStoredItem(STORAGE_KEYS.SUBJECTS, updated);
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
    return newRoutine;
  }

  updateRoutine(id: string, data: Partial<ClassRoutine>): ClassRoutine[] {
    const routines = getStoredItem<ClassRoutine[]>(STORAGE_KEYS.ROUTINES, INITIAL_ROUTINES);
    const updated = routines.map((r) => (r.id === id ? { ...r, ...data } : r));
    setStoredItem(STORAGE_KEYS.ROUTINES, updated);
    return updated;
  }

  deleteRoutine(id: string): ClassRoutine[] {
    const routines = getStoredItem<ClassRoutine[]>(STORAGE_KEYS.ROUTINES, INITIAL_ROUTINES);
    const updated = routines.filter((r) => r.id !== id);
    setStoredItem(STORAGE_KEYS.ROUTINES, updated);
    return updated;
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
    return newNotice;
  }

  updateNotice(id: string, data: Partial<Notice>): Notice[] {
    const notices = this.getNotices();
    const updated = notices.map((n) => (n.id === id ? { ...n, ...data } : n));
    setStoredItem(STORAGE_KEYS.NOTICES, updated);
    return updated;
  }

  deleteNotice(id: string): Notice[] {
    const notices = this.getNotices();
    const updated = notices.filter((n) => n.id !== id);
    setStoredItem(STORAGE_KEYS.NOTICES, updated);
    return updated;
  }

  bulkDeleteNotices(ids: string[]): Notice[] {
    const notices = this.getNotices();
    const set = new Set(ids);
    const updated = notices.filter((n) => !set.has(n.id));
    setStoredItem(STORAGE_KEYS.NOTICES, updated);
    return updated;
  }

  togglePinNotice(id: string): Notice[] {
    const notices = this.getNotices();
    const updated = notices.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n));
    setStoredItem(STORAGE_KEYS.NOTICES, updated);
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

  // ===================== RESET STORE =====================
  resetStore(): void {
    if (typeof window === 'undefined') return;
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    localStorage.setItem(SCHEMA_VERSION_KEY, ADMIN_SCHEMA_VERSION);
    schemaChecked = true;
  }
}

export const adminService = new AdminService();

