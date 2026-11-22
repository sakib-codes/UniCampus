-- ============================================================================
-- UniCampus Production ERP & High-Scale Migration
-- File: 20261122_production_erp_scale.sql
-- Scope:
--   1. Bangladeshi Student/Teacher Registration Dossier & Rejection/Re-apply
--   2. Atomic Academic ID Generator RPC (Collision-Free Under High Concurrency)
--   3. Subject Instructor Assignment & Department Admin Governance Columns
--   4. Course Advising Submissions, Assignments LMS, Audit Logs, Gradebook Locks
--   5. High-Scale Composite Indexes & Scalar-Subquery RLS Policies
--   6. Supabase Storage Buckets for Direct Presigned Uploads
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. EXTEND EXISTING TABLES (IDEMPOTENT)
-- ----------------------------------------------------------------------------

-- 1a. Profiles: Bangladeshi registration metadata, holds, rejection workflow
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS admin_role TEXT CHECK (admin_role IN ('super_admin', 'dept_admin')),
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS academic_year TEXT,
  ADD COLUMN IF NOT EXISTS account_status TEXT DEFAULT 'pending' CHECK (account_status IN ('active', 'pending', 'suspended', 'rejected')),
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS reviewed_by TEXT,
  ADD COLUMN IF NOT EXISTS academic_hold BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS financial_hold BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS hold_reason TEXT,
  ADD COLUMN IF NOT EXISTS date_of_birth DATE,
  ADD COLUMN IF NOT EXISTS gender TEXT,
  ADD COLUMN IF NOT EXISTS blood_group TEXT,
  ADD COLUMN IF NOT EXISTS religion TEXT,
  ADD COLUMN IF NOT EXISTS nationality TEXT DEFAULT 'Bangladeshi',
  ADD COLUMN IF NOT EXISTS id_document_type TEXT CHECK (id_document_type IN ('NID', 'Birth Certificate')),
  ADD COLUMN IF NOT EXISTS nid_or_birth_cert TEXT,
  ADD COLUMN IF NOT EXISTS father_name TEXT,
  ADD COLUMN IF NOT EXISTS father_phone TEXT,
  ADD COLUMN IF NOT EXISTS mother_name TEXT,
  ADD COLUMN IF NOT EXISTS mother_phone TEXT,
  ADD COLUMN IF NOT EXISTS emergency_phone TEXT,
  ADD COLUMN IF NOT EXISTS present_address TEXT,
  ADD COLUMN IF NOT EXISTS permanent_address TEXT,
  ADD COLUMN IF NOT EXISTS board_exams JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS teacher_qualifications JSONB;

-- Unique constraints on auto-issued Academic IDs (partial so NULLs are allowed)
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_student_id_unique
  ON public.profiles (student_id) WHERE student_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_teacher_code_unique
  ON public.profiles (teacher_code) WHERE teacher_code IS NOT NULL;

-- 1b. Departments: Department Admin assignment
ALTER TABLE public.departments
  ADD COLUMN IF NOT EXISTS dept_admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS dept_admin_name TEXT,
  ADD COLUMN IF NOT EXISTS dept_admin_email TEXT;

-- 1c. Subjects: Assigned Instructor columns
ALTER TABLE public.subjects
  ADD COLUMN IF NOT EXISTS assigned_teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS assigned_teacher_name TEXT;

-- ----------------------------------------------------------------------------
-- 2. ATOMIC ACADEMIC ID GENERATOR (HIGH-CONCURRENCY SAFE)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.academic_id_counters (
  counter_key TEXT PRIMARY KEY,
  last_value INT NOT NULL DEFAULT 1000,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.academic_id_counters ENABLE ROW LEVEL SECURITY;

-- Atomic upsert + increment guarantees zero duplicate Academic IDs even under
-- 500+ simultaneous student/teacher registrations on admission day.
CREATE OR REPLACE FUNCTION public.generate_academic_id(
  p_role TEXT,
  p_dept_code TEXT,
  p_admission_year INT DEFAULT EXTRACT(YEAR FROM NOW())::INT
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_clean_dept TEXT;
  v_yy TEXT;
  v_key TEXT;
  v_next_seq INT;
  v_start_val INT;
BEGIN
  v_clean_dept := UPPER(REGEXP_REPLACE(COALESCE(p_dept_code, 'GEN'), '[^A-Za-z]', '', 'g'));
  v_clean_dept := LEFT(v_clean_dept, 5);
  IF v_clean_dept = '' THEN
    v_clean_dept := 'GEN';
  END IF;

  IF p_role = 'teacher' THEN
    v_key := 'FAC-' || v_clean_dept;
    v_start_val := 1040;
  ELSE
    v_yy := RIGHT(p_admission_year::TEXT, 2);
    v_key := v_yy || '-' || v_clean_dept;
    v_start_val := 1001;
  END IF;

  INSERT INTO public.academic_id_counters (counter_key, last_value, updated_at)
  VALUES (v_key, v_start_val, NOW())
  ON CONFLICT (counter_key)
  DO UPDATE SET
    last_value = public.academic_id_counters.last_value + 1,
    updated_at = NOW()
  RETURNING last_value INTO v_next_seq;

  RETURN v_key || '-' || v_next_seq::TEXT;
END;
$$;

-- ----------------------------------------------------------------------------
-- 3. NEW PRODUCTION ERP TABLES
-- ----------------------------------------------------------------------------

-- 3a. Course Advising Submissions (Student <-> Faculty Advisor Queue)
CREATE TABLE IF NOT EXISTS public.advising_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  department_code TEXT NOT NULL,
  semester_name TEXT NOT NULL CHECK (
    semester_name IN (
      '1st Semester', '2nd Semester', '3rd Semester', '4th Semester',
      '5th Semester', '6th Semester', '7th Semester', '8th Semester'
    )
  ),
  cgpa NUMERIC(3,2) DEFAULT 0.00,
  max_credits NUMERIC(4,1) DEFAULT 21.0,
  selected_courses JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'revision_requested')),
  advisor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  advisor_name TEXT,
  advisor_note TEXT,
  idempotency_key TEXT UNIQUE,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3b. Course Assignments & Lab Reports (LMS)
CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
  course_code TEXT NOT NULL,
  course_title TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'Assignment' CHECK (type IN ('Assignment', 'Lab Report', 'Project Milestone')),
  due_date DATE NOT NULL,
  max_marks NUMERIC(5,2) NOT NULL DEFAULT 20,
  instructor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  instructor_name TEXT NOT NULL,
  attachment_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3c. Student Assignment Submissions
CREATE TABLE IF NOT EXISTS public.assignment_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT,
  submission_link TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'Submitted' CHECK (status IN ('Submitted', 'Graded')),
  marks NUMERIC(5,2),
  feedback TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  graded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (assignment_id, student_id)
);

-- 3d. Gradebook Lock Policies
CREATE TABLE IF NOT EXISTS public.gradebook_policies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_code TEXT NOT NULL UNIQUE,
  course_title TEXT,
  department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
  is_locked BOOLEAN NOT NULL DEFAULT FALSE,
  locked_at TIMESTAMPTZ,
  locked_by TEXT,
  submission_deadline DATE,
  status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'Submitted', 'Locked', 'Verified')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3e. Administrative Audit Logs (Append-Only Trail)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL CHECK (
    category IN ('Access', 'Gradebook', 'Routine', 'Snapshot', 'Finance', 'Notice', 'Curriculum', 'Hold')
  ),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  actor_name TEXT NOT NULL,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  department_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3f. Idempotency Ledger (Prevents Duplicate Payments / Mutations Under Retry Storms)
CREATE TABLE IF NOT EXISTS public.idempotency_keys (
  key TEXT PRIMARY KEY,
  scope TEXT NOT NULL,
  response_payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours')
);

-- ----------------------------------------------------------------------------
-- 4. HIGH-SCALE COMPOSITE & KEYSET PAGINATION INDEXES
-- ----------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_profiles_dept_status
  ON public.profiles (department_id, account_status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_profiles_email_lower
  ON public.profiles (LOWER(email));

CREATE INDEX IF NOT EXISTS idx_subjects_dept_sem
  ON public.subjects (department_id, semester_id);

CREATE INDEX IF NOT EXISTS idx_subjects_assigned_teacher
  ON public.subjects (assigned_teacher_id) WHERE assigned_teacher_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_advising_status_dept
  ON public.advising_submissions (status, department_code, submitted_at DESC);

CREATE INDEX IF NOT EXISTS idx_advising_student
  ON public.advising_submissions (student_id);

CREATE INDEX IF NOT EXISTS idx_assignments_course_due
  ON public.assignments (course_code, due_date DESC);

CREATE INDEX IF NOT EXISTS idx_assignment_subs_assignment
  ON public.assignment_submissions (assignment_id, status);

CREATE INDEX IF NOT EXISTS idx_audit_logs_dept_created
  ON public.audit_logs (department_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_idempotency_expires
  ON public.idempotency_keys (expires_at);

-- ----------------------------------------------------------------------------
-- 5. HIGH-SCALE ROW LEVEL SECURITY (SCALAR SUBQUERY OPTIMIZED)
-- ----------------------------------------------------------------------------

ALTER TABLE public.advising_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gradebook_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idempotency_keys ENABLE ROW LEVEL SECURITY;

-- Helper function (STABLE + SECURITY DEFINER) for fast single-evaluation role check
CREATE OR REPLACE FUNCTION public.is_verified_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = (SELECT auth.uid())
      AND role = 'admin'
      AND is_approved = TRUE
  );
$$;

CREATE OR REPLACE FUNCTION public.is_verified_teacher()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = (SELECT auth.uid())
      AND role = 'teacher'
      AND is_approved = TRUE
  );
$$;

-- Advising Submissions Policies
DROP POLICY IF EXISTS "advising_student_own" ON public.advising_submissions;
CREATE POLICY "advising_student_own" ON public.advising_submissions
  FOR ALL TO authenticated
  USING (student_profile_id = (SELECT auth.uid()))
  WITH CHECK (student_profile_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "advising_faculty_admin_manage" ON public.advising_submissions;
CREATE POLICY "advising_faculty_admin_manage" ON public.advising_submissions
  FOR ALL TO authenticated
  USING (public.is_verified_teacher() OR public.is_verified_admin())
  WITH CHECK (public.is_verified_teacher() OR public.is_verified_admin());

-- Assignments Policies
DROP POLICY IF EXISTS "assignments_authenticated_read" ON public.assignments;
CREATE POLICY "assignments_authenticated_read" ON public.assignments
  FOR SELECT TO authenticated
  USING (TRUE);

DROP POLICY IF EXISTS "assignments_teacher_admin_write" ON public.assignments;
CREATE POLICY "assignments_teacher_admin_write" ON public.assignments
  FOR ALL TO authenticated
  USING (public.is_verified_teacher() OR public.is_verified_admin())
  WITH CHECK (public.is_verified_teacher() OR public.is_verified_admin());

-- Assignment Submissions Policies
DROP POLICY IF EXISTS "submissions_student_own" ON public.assignment_submissions;
CREATE POLICY "submissions_student_own" ON public.assignment_submissions
  FOR ALL TO authenticated
  USING (student_profile_id = (SELECT auth.uid()))
  WITH CHECK (student_profile_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "submissions_teacher_admin_grade" ON public.assignment_submissions;
CREATE POLICY "submissions_teacher_admin_grade" ON public.assignment_submissions
  FOR ALL TO authenticated
  USING (public.is_verified_teacher() OR public.is_verified_admin())
  WITH CHECK (public.is_verified_teacher() OR public.is_verified_admin());

-- Gradebook Policies
DROP POLICY IF EXISTS "gradebook_policies_read" ON public.gradebook_policies;
CREATE POLICY "gradebook_policies_read" ON public.gradebook_policies
  FOR SELECT TO authenticated
  USING (TRUE);

DROP POLICY IF EXISTS "gradebook_policies_admin_write" ON public.gradebook_policies;
CREATE POLICY "gradebook_policies_admin_write" ON public.gradebook_policies
  FOR ALL TO authenticated
  USING (public.is_verified_admin())
  WITH CHECK (public.is_verified_admin());

-- Audit Logs (Admins only)
DROP POLICY IF EXISTS "audit_logs_admin_read" ON public.audit_logs;
CREATE POLICY "audit_logs_admin_read" ON public.audit_logs
  FOR SELECT TO authenticated
  USING (public.is_verified_admin());

DROP POLICY IF EXISTS "audit_logs_authenticated_insert" ON public.audit_logs;
CREATE POLICY "audit_logs_authenticated_insert" ON public.audit_logs
  FOR INSERT TO authenticated
  WITH CHECK (TRUE);

-- ----------------------------------------------------------------------------
-- 6. SUPABASE STORAGE BUCKETS (DIRECT BROWSER-TO-STORAGE PRESIGNED UPLOADS)
-- ----------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('avatars', 'avatars', TRUE, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('academic-documents', 'academic-documents', FALSE, 10485760, ARRAY['application/pdf', 'image/jpeg', 'image/png']),
  ('assignment-submissions', 'assignment-submissions', FALSE, 26214400, ARRAY['application/pdf', 'application/zip', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/png', 'image/jpeg'])
ON CONFLICT (id) DO NOTHING;
