export type UserRoleType = 'student' | 'teacher' | 'admin';

export type AdminRoleLevel = 'super_admin' | 'dept_admin';

export interface BoardExamRecord {
  exam: 'JSC' | 'SSC' | 'HSC';
  board: string;
  group?: string;
  passing_year: string;
  roll_number?: string;
  registration_number?: string;
  gpa: string;
  institution?: string;
  marksheet_filename?: string;
}

export interface TeacherQualificationRecord {
  designation: string;
  employment_type: 'Full-Time' | 'Adjunct' | 'Visiting';
  highest_degree: string;
  undergrad_degree: string;
  undergrad_university: string;
  undergrad_year: string;
  undergrad_cgpa: string;
  postgrad_degree?: string;
  postgrad_university?: string;
  postgrad_year?: string;
  experience_years: string;
  specialization: string;
  cv_filename?: string;
  certificate_filename?: string;
}

export interface AdmissionPaymentRecord {
  method: 'bKash' | 'Nagad' | 'Rocket' | 'Bank Deposit / Pay Slip';
  trx_id: string;
  amount: string;
  paid_date?: string;
  slip_filename?: string;
  slip_preview_url?: string;
}

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: UserRoleType;
  admin_role?: AdminRoleLevel;
  department_id: string;
  department_name?: string;
  program_name?: string | null;
  semester_id: string | null;
  semester_name?: string | null;
  academic_year?: string | null;
  teacher_code: string | null;
  student_id: string | null;
  avatar_url: string;
  is_approved: boolean;
  created_at: string;
  account_status?: 'active' | 'pending' | 'suspended' | 'rejected';
  rejection_reason?: string | null;
  reviewed_at?: string | null;
  reviewed_by?: string | null;
  academic_hold?: boolean;
  financial_hold?: boolean;
  hold_reason?: string | null;
  assigned_courses?: string[];
  // Bangladeshi Academic & Identity Metadata
  date_of_birth?: string;
  gender?: string;
  blood_group?: string;
  religion?: string;
  nationality?: string;
  id_document_type?: 'NID' | 'Birth Certificate';
  nid_or_birth_cert?: string;
  father_name?: string;
  father_phone?: string;
  mother_name?: string;
  mother_phone?: string;
  emergency_phone?: string;
  present_address?: string;
  permanent_address?: string;
  board_exams?: BoardExamRecord[];
  teacher_qualifications?: TeacherQualificationRecord;
  admission_payment?: AdmissionPaymentRecord | null;
  email_verified?: boolean;
  phone_verified?: boolean;
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
  /** Number of semesters in this department's degree program (2–12, default 8). */
  total_semesters?: number;
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
  | '8th Semester'
  | '9th Semester'
  | '10th Semester'
  | '11th Semester'
  | '12th Semester';

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
  assigned_teacher_id?: string | null;
  assigned_teacher_name?: string | null;
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

export interface AuditLogItem {
  id: string;
  time: string;
  timestamp: string;
  category: "Access" | "Gradebook" | "Routine" | "Snapshot" | "Finance" | "Notice" | "Curriculum" | "Hold";
  title: string;
  description: string;
  actor_name: string;
  department_id?: string | null;
  department_name?: string;
  iconBg?: string;
  iconColor?: string;
}

export interface GradebookPolicy {
  course_code: string;
  course_title?: string;
  department_id?: string;
  is_locked: boolean;
  locked_at?: string | null;
  locked_by?: string | null;
  submission_deadline?: string;
  status: 'Open' | 'Submitted' | 'Locked' | 'Verified';
}


