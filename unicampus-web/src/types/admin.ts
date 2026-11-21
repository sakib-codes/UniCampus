export type UserRoleType = 'student' | 'teacher' | 'admin';

export type AdminRoleLevel = 'super_admin' | 'dept_admin';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: UserRoleType;
  admin_role?: AdminRoleLevel;
  department_id: string;
  department_name?: string;
  semester_id: string | null;
  semester_name?: string | null;
  teacher_code: string | null;
  student_id: string | null;
  avatar_url: string;
  is_approved: boolean;
  created_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: string;
  is_primary: boolean;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  head_teacher_id: string | null;
  head_teacher_name?: string;
  dept_admin_id?: string | null;
  dept_admin_name?: string | null;
  dept_admin_email?: string | null;
  faculty?: string;
  color?: string;
  stats?: {
    students: number;
    teachers: number;
    courses: number;
  };
}

export type OrdinalSemesterName =
  | '1st Semester'
  | '2nd Semester'
  | '3rd Semester'
  | '4th Semester'
  | '5th Semester'
  | '6th Semester'
  | '7th Semester'
  | '8th Semester';

export interface Semester {
  id: string;
  department_id: string;
  name: OrdinalSemesterName;
  order_index: number;
}

export interface Subject {
  id: string;
  department_id: string;
  semester_id: string;
  code: string;
  title: string;
  credit: number;
  type?: 'Theory' | 'Lab';
}

export interface ClassRoutine {
  id: string;
  subject_code: string;
  subject_title: string;
  day_of_week: number; // 0 = Sunday, 1 = Monday, 2 = Tuesday, 3 = Wednesday, 4 = Thursday
  start_time: string; // 'HH:mm'
  end_time: string; // 'HH:mm'
  room: string;
  section: string;
  teacher_name: string;
  teacher_id: string | null;
  department_name: string;
  semester_name: OrdinalSemesterName;
}

export type NoticeTargetRole = 'all' | 'student' | 'teacher' | 'admin';

export interface Notice {
  id: string;
  title: string;
  body: string;
  category: string;
  target_role: NoticeTargetRole;
  department_id: string | null;
  department_name?: string;
  attachments: string[];
  pinned: boolean;
  created_at: string;
  author_name?: string;
  views?: number;
  status?: 'Published' | 'Draft' | 'Archived';
}

export type TransactionType = 'student_fee' | 'teacher_wage' | 'late_fine';
export type PaymentMethod = 'bKash' | 'SSLCommerz' | 'Nagad' | 'Bank Transfer' | 'Card';
export type PaymentStatus = 'Paid' | 'Pending' | 'Overdue';

export type FeeCategory = 'Tuition' | 'Lab' | 'Library' | 'Exam' | 'Late Fine' | 'Transport';

export interface FeeLineItem {
  id: string;
  label: string;
  category: FeeCategory;
  amount: number;
}

export interface SemesterInvoice {
  id: string;
  invoice_no: string;
  student_id: string;
  student_name: string;
  department_name: string;
  semester_name: OrdinalSemesterName;
  term_label: string;
  due_date: string;
  line_items: FeeLineItem[];
  total_amount: number;
  paid_amount: number;
  due_amount: number;
  status: PaymentStatus;
  last_paid_at: string | null;
}

export interface GatewaySessionRequest {
  gateway: 'bkash' | 'sslcommerz';
  mode?: 'live_sandbox' | 'interactive_demo';
  paymentId?: string;
  amount: number;
  invoiceId: string;
  studentId?: string;
  studentName?: string;
  payerReference?: string;
}

export interface GatewaySessionResponse {
  gateway: 'bkash' | 'sslcommerz';
  mode: 'live_sandbox' | 'interactive_demo';
  paymentId: string;
  redirectUrl?: string;
  amount: number;
  invoiceId: string;
  sessionKey?: string;
  bkashURL?: string;
  gatewayPageURL?: string;
  tran_id?: string;
}

export interface PaymentTransaction {
  id: string;
  transaction_id: string; // 'TXN-YYYYMMDD-XXXX'
  user_name: string;
  student_id: string | null;
  user_id: string;
  department_name: string;
  semester_name: OrdinalSemesterName;
  type: TransactionType;
  amount: number;
  payment_method: PaymentMethod;
  status: PaymentStatus;
  receipt_number: string; // 'REC-XXXXXX'
  created_at: string;
}

export type WageStatus = 'Disbursed' | 'Pending';

export interface TeacherWage {
  id: string;
  teacher_name: string;
  teacher_code: string;
  teacher_id: string;
  department_name: string;
  month: string; // e.g. 'August 2026'
  base_amount: number;
  allowances: number;
  deductions: number;
  net_amount: number;
  status: WageStatus;
  payment_method: string;
  disbursed_at: string | null;
  transaction_id: string | null;
}

