import { CANONICAL_STUDENT } from "@/lib/canonicalCampus";
import { adminService } from "@/lib/services/adminService";
import {
  PaymentTransaction,
  SemesterInvoice,
} from "@/types/admin";

const INVOICES_STORAGE_KEY = "unicampus_student_invoices";

export const INITIAL_SEMESTER_INVOICES: SemesterInvoice[] = [
  {
    id: "inv-sem-6",
    invoice_no: "INV-2026-0622",
    student_id: CANONICAL_STUDENT.studentId,
    student_name: CANONICAL_STUDENT.name,
    department_name: CANONICAL_STUDENT.departmentName,
    semester_name: "6th Semester",
    term_label: "Spring 2026",
    due_date: "2026-10-31",
    total_amount: 48500,
    paid_amount: 25000,
    due_amount: 23500,
    status: "Pending",
    last_paid_at: "2026-03-05T11:30:00Z",
    line_items: [
      { id: "fee-6-1", label: "Tuition Fee (15 Credits)", category: "Tuition", amount: 32000 },
      { id: "fee-6-2", label: "Computer Lab & Cloud Sessional Fee", category: "Lab", amount: 9000 },
      { id: "fee-6-3", label: "Semester Final Examination Fee", category: "Exam", amount: 4500 },
      { id: "fee-6-4", label: "Central Library & ACM Portal Fee", category: "Library", amount: 3000 },
    ],
  },
  {
    id: "inv-sem-5",
    invoice_no: "INV-2025-0518",
    student_id: CANONICAL_STUDENT.studentId,
    student_name: CANONICAL_STUDENT.name,
    department_name: CANONICAL_STUDENT.departmentName,
    semester_name: "5th Semester",
    term_label: "Fall 2025",
    due_date: "2025-10-20",
    total_amount: 48500,
    paid_amount: 48500,
    due_amount: 0,
    status: "Paid",
    last_paid_at: "2025-10-17T09:12:00Z",
    line_items: [
      { id: "fee-5-1", label: "Tuition Fee (15 Credits)", category: "Tuition", amount: 32000 },
      { id: "fee-5-2", label: "Microprocessor & Hardware Lab Fee", category: "Lab", amount: 9000 },
      { id: "fee-5-3", label: "Semester Final Examination Fee", category: "Exam", amount: 4500 },
      { id: "fee-5-4", label: "Central Library & Digital Resource Fee", category: "Library", amount: 3000 },
    ],
  },
  {
    id: "inv-sem-4",
    invoice_no: "INV-2025-0412",
    student_id: CANONICAL_STUDENT.studentId,
    student_name: CANONICAL_STUDENT.name,
    department_name: CANONICAL_STUDENT.departmentName,
    semester_name: "4th Semester",
    term_label: "Spring 2025",
    due_date: "2025-04-20",
    total_amount: 48000,
    paid_amount: 48000,
    due_amount: 0,
    status: "Paid",
    last_paid_at: "2025-04-15T09:30:00Z",
    line_items: [
      { id: "fee-4-1", label: "Tuition Fee (15 Credits)", category: "Tuition", amount: 32000 },
      { id: "fee-4-2", label: "Data Structures & Algorithm Lab", category: "Lab", amount: 9000 },
      { id: "fee-4-3", label: "Semester Final Examination Fee", category: "Exam", amount: 4000 },
      { id: "fee-4-4", label: "Central Library & Student Activity Fee", category: "Library", amount: 3000 },
    ],
  },
  {
    id: "inv-sem-3",
    invoice_no: "INV-2024-0309",
    student_id: CANONICAL_STUDENT.studentId,
    student_name: CANONICAL_STUDENT.name,
    department_name: CANONICAL_STUDENT.departmentName,
    semester_name: "3rd Semester",
    term_label: "Fall 2024",
    due_date: "2024-10-25",
    total_amount: 47500,
    paid_amount: 47500,
    due_amount: 0,
    status: "Paid",
    last_paid_at: "2024-10-22T11:40:00Z",
    line_items: [
      { id: "fee-3-1", label: "Tuition Fee (15 Credits)", category: "Tuition", amount: 32000 },
      { id: "fee-3-2", label: "Object Oriented Programming Lab", category: "Lab", amount: 9000 },
      { id: "fee-3-3", label: "Semester Final Examination Fee", category: "Exam", amount: 3500 },
      { id: "fee-3-4", label: "Central Library Fee", category: "Library", amount: 3000 },
    ],
  },
  {
    id: "inv-sem-2",
    invoice_no: "INV-2024-0204",
    student_id: CANONICAL_STUDENT.studentId,
    student_name: CANONICAL_STUDENT.name,
    department_name: CANONICAL_STUDENT.departmentName,
    semester_name: "2nd Semester",
    term_label: "Spring 2024",
    due_date: "2024-04-20",
    total_amount: 47000,
    paid_amount: 47000,
    due_amount: 0,
    status: "Paid",
    last_paid_at: "2024-04-18T14:20:00Z",
    line_items: [
      { id: "fee-2-1", label: "Tuition Fee (15 Credits)", category: "Tuition", amount: 32000 },
      { id: "fee-2-2", label: "Structured Programming Lab", category: "Lab", amount: 9000 },
      { id: "fee-2-3", label: "Semester Final Examination Fee", category: "Exam", amount: 3000 },
      { id: "fee-2-4", label: "Central Library Fee", category: "Library", amount: 3000 },
    ],
  },
  {
    id: "inv-sem-1",
    invoice_no: "INV-2023-0101",
    student_id: CANONICAL_STUDENT.studentId,
    student_name: CANONICAL_STUDENT.name,
    department_name: CANONICAL_STUDENT.departmentName,
    semester_name: "1st Semester",
    term_label: "Fall 2023",
    due_date: "2023-11-15",
    total_amount: 46500,
    paid_amount: 46500,
    due_amount: 0,
    status: "Paid",
    last_paid_at: "2023-11-10T10:15:00Z",
    line_items: [
      { id: "fee-1-1", label: "Tuition Fee (15 Credits)", category: "Tuition", amount: 32000 },
      { id: "fee-1-2", label: "Physics & Electronics Lab", category: "Lab", amount: 8500 },
      { id: "fee-1-3", label: "Semester Final Examination Fee", category: "Exam", amount: 3000 },
      { id: "fee-1-4", label: "Admission & Registration Logistics", category: "Tuition", amount: 3000 },
    ],
  },
];

export const INITIAL_STUDENT_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: "txn-stud-6-1",
    transaction_id: "TXN-20260305-4421",
    user_name: CANONICAL_STUDENT.name,
    student_id: CANONICAL_STUDENT.studentId,
    user_id: CANONICAL_STUDENT.id,
    department_name: CANONICAL_STUDENT.departmentName,
    semester_name: "6th Semester",
    type: "student_fee",
    amount: 25000,
    payment_method: "bKash",
    status: "Paid",
    receipt_number: "REC-984421",
    created_at: "2026-03-05T11:30:00Z",
  },
  {
    id: "txn-stud-5",
    transaction_id: "TXN-20251017-1042",
    user_name: CANONICAL_STUDENT.name,
    student_id: CANONICAL_STUDENT.studentId,
    user_id: CANONICAL_STUDENT.id,
    department_name: CANONICAL_STUDENT.departmentName,
    semester_name: "5th Semester",
    type: "student_fee",
    amount: 48500,
    payment_method: "bKash",
    status: "Paid",
    receipt_number: "REC-982144",
    created_at: "2025-10-17T09:12:00Z",
  },
  {
    id: "txn-stud-4",
    transaction_id: "TXN-20250415-3312",
    user_name: CANONICAL_STUDENT.name,
    student_id: CANONICAL_STUDENT.studentId,
    user_id: CANONICAL_STUDENT.id,
    department_name: CANONICAL_STUDENT.departmentName,
    semester_name: "4th Semester",
    type: "student_fee",
    amount: 48000,
    payment_method: "SSLCommerz",
    status: "Paid",
    receipt_number: "REC-871203",
    created_at: "2025-04-15T09:30:00Z",
  },
  {
    id: "txn-stud-3",
    transaction_id: "TXN-20241022-2291",
    user_name: CANONICAL_STUDENT.name,
    student_id: CANONICAL_STUDENT.studentId,
    user_id: CANONICAL_STUDENT.id,
    department_name: CANONICAL_STUDENT.departmentName,
    semester_name: "3rd Semester",
    type: "student_fee",
    amount: 47500,
    payment_method: "bKash",
    status: "Paid",
    receipt_number: "REC-762910",
    created_at: "2024-10-22T11:40:00Z",
  },
  {
    id: "txn-stud-2",
    transaction_id: "TXN-20240418-1845",
    user_name: CANONICAL_STUDENT.name,
    student_id: CANONICAL_STUDENT.studentId,
    user_id: CANONICAL_STUDENT.id,
    department_name: CANONICAL_STUDENT.departmentName,
    semester_name: "2nd Semester",
    type: "student_fee",
    amount: 47000,
    payment_method: "SSLCommerz",
    status: "Paid",
    receipt_number: "REC-654829",
    created_at: "2024-04-18T14:20:00Z",
  },
  {
    id: "txn-stud-1",
    transaction_id: "TXN-20231110-1120",
    user_name: CANONICAL_STUDENT.name,
    student_id: CANONICAL_STUDENT.studentId,
    user_id: CANONICAL_STUDENT.id,
    department_name: CANONICAL_STUDENT.departmentName,
    semester_name: "1st Semester",
    type: "student_fee",
    amount: 46500,
    payment_method: "bKash",
    status: "Paid",
    receipt_number: "REC-543210",
    created_at: "2023-11-10T10:15:00Z",
  },
];

class StudentPaymentService {
  private ensureSeededTransactions(): void {
    if (typeof window === "undefined") return;
    try {
      const allTxns = adminService.getTransactions();
      const existingIds = new Set(allTxns.map((t) => t.receipt_number));
      let added = false;
      const missing = INITIAL_STUDENT_TRANSACTIONS.filter(
        (t) => !existingIds.has(t.receipt_number)
      );

      if (missing.length > 0) {
        // Seed into admin transactions
        const storageKey = "unicampus_admin_transactions";
        const updated = [...allTxns, ...missing];
        localStorage.setItem(storageKey, JSON.stringify(updated));
        added = true;
      }

      if (added) {
        window.dispatchEvent(new Event("unicampus:finance-updated"));
      }
    } catch {
      // localStorage may fail in restricted sandbox
    }
  }

  getInvoices(): SemesterInvoice[] {
    if (typeof window === "undefined") return INITIAL_SEMESTER_INVOICES;
    try {
      this.ensureSeededTransactions();
      const stored = localStorage.getItem(INVOICES_STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(
          INVOICES_STORAGE_KEY,
          JSON.stringify(INITIAL_SEMESTER_INVOICES)
        );
        return INITIAL_SEMESTER_INVOICES;
      }
      return JSON.parse(stored) as SemesterInvoice[];
    } catch {
      return INITIAL_SEMESTER_INVOICES;
    }
  }

  getInvoiceById(id: string): SemesterInvoice | undefined {
    return this.getInvoices().find((inv) => inv.id === id || inv.invoice_no === id);
  }

  getCurrentSemesterInvoice(): SemesterInvoice {
    const invoices = this.getInvoices();
    return invoices[0] || INITIAL_SEMESTER_INVOICES[0];
  }

  recordGatewayPayment(params: {
    invoiceId: string;
    amount: number;
    gateway: "bkash" | "sslcommerz";
    trxId?: string;
  }): { invoice: SemesterInvoice; transaction: PaymentTransaction } {
    const invoices = this.getInvoices();
    const invoiceIndex = invoices.findIndex(
      (inv) => inv.id === params.invoiceId || inv.invoice_no === params.invoiceId
    );

    const targetInvoice =
      invoiceIndex >= 0 ? invoices[invoiceIndex] : this.getCurrentSemesterInvoice();

    const paidAmount = Number(params.amount);
    const updatedPaid = (targetInvoice.paid_amount || 0) + paidAmount;
    const updatedDue = Math.max(0, (targetInvoice.total_amount || 0) - updatedPaid);
    const updatedStatus = updatedDue === 0 ? "Paid" : "Pending";
    const now = new Date().toISOString();

    const updatedInvoice: SemesterInvoice = {
      ...targetInvoice,
      paid_amount: updatedPaid,
      due_amount: updatedDue,
      status: updatedStatus,
      last_paid_at: now,
    };

    if (invoiceIndex >= 0) {
      invoices[invoiceIndex] = updatedInvoice;
    } else {
      invoices[0] = updatedInvoice;
    }

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(invoices));
      } catch {
        // storage quota or disabled
      }
    }

    // Generate matching receipt and transaction
    const dateTag = now.slice(0, 10).replace(/-/g, "");
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    const randomReceipt = Math.floor(100000 + Math.random() * 900000);

    const generatedTrxId =
      params.trxId || `TXN-${dateTag}-${randomHex}`;
    const generatedReceiptNo = `REC-${randomReceipt}`;

    const newTxn = adminService.createTransaction({
      transaction_id: generatedTrxId,
      receipt_number: generatedReceiptNo,
      user_name: CANONICAL_STUDENT.name,
      student_id: CANONICAL_STUDENT.studentId,
      user_id: CANONICAL_STUDENT.id,
      department_name: CANONICAL_STUDENT.departmentName,
      semester_name: targetInvoice.semester_name,
      type: "student_fee",
      amount: paidAmount,
      payment_method: params.gateway === "bkash" ? "bKash" : "SSLCommerz",
      status: "Paid",
    });

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("unicampus:finance-updated"));
    }

    return {
      invoice: updatedInvoice,
      transaction: newTxn,
    };
  }

  getStudentTransactions(): PaymentTransaction[] {
    this.ensureSeededTransactions();
    const all = adminService.getTransactions();
    return all.filter(
      (t) =>
        t.student_id === CANONICAL_STUDENT.studentId ||
        t.user_id === CANONICAL_STUDENT.id ||
        t.user_name === CANONICAL_STUDENT.name
    );
  }

  getTransactionByReceipt(receiptNo: string): PaymentTransaction | undefined {
    const transactions = this.getStudentTransactions();
    return transactions.find((t) => t.receipt_number === receiptNo);
  }

  resetInvoices(): SemesterInvoice[] {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          INVOICES_STORAGE_KEY,
          JSON.stringify(INITIAL_SEMESTER_INVOICES)
        );
        window.dispatchEvent(new Event("unicampus:finance-updated"));
      } catch {
        // ignore
      }
    }
    return INITIAL_SEMESTER_INVOICES;
  }
}

export const studentPaymentService = new StudentPaymentService();
