-- ====================================================================
-- UniCampus Admin Management Portal — Supabase Master Schema Migration
-- Migration: 20261017_admin_portal_schema.sql
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. DEPARTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    head_teacher_id UUID,
    faculty TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SEMESTERS TABLE (Strictly Ordinal: '1st Semester' .. '8th Semester')
CREATE TABLE IF NOT EXISTS public.semesters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
    name TEXT NOT NULL CHECK (name IN (
        '1st Semester',
        '2nd Semester',
        '3rd Semester',
        '4th Semester',
        '5th Semester',
        '6th Semester',
        '7th Semester',
        '8th Semester'
    )),
    order_index INT NOT NULL CHECK (order_index BETWEEN 1 AND 8),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(department_id, order_index)
);

-- 3. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    semester_id UUID REFERENCES public.semesters(id) ON DELETE SET NULL,
    teacher_code TEXT,
    student_id TEXT,
    avatar_url TEXT,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Link head_teacher_id foreign key back to profiles
ALTER TABLE public.departments 
    DROP CONSTRAINT IF EXISTS fk_departments_head_teacher,
    ADD CONSTRAINT fk_departments_head_teacher FOREIGN KEY (head_teacher_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- 4. USER ROLES TABLE
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SUBJECTS / CURRICULUM TABLE
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
    semester_id UUID NOT NULL REFERENCES public.semesters(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    title TEXT NOT NULL,
    credit NUMERIC(3, 1) NOT NULL DEFAULT 3.0,
    type TEXT NOT NULL DEFAULT 'Theory' CHECK (type IN ('Theory', 'Lab')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(department_id, code)
);

-- 6. CLASS ROUTINES TABLE
CREATE TABLE IF NOT EXISTS public.class_routines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_code TEXT NOT NULL,
    subject_title TEXT NOT NULL,
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 4), -- 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu
    start_time TEXT NOT NULL, -- 'HH:mm'
    end_time TEXT NOT NULL,   -- 'HH:mm'
    room TEXT NOT NULL,
    section TEXT NOT NULL DEFAULT 'A',
    teacher_name TEXT NOT NULL,
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    department_name TEXT NOT NULL,
    semester_name TEXT NOT NULL CHECK (semester_name IN (
        '1st Semester',
        '2nd Semester',
        '3rd Semester',
        '4th Semester',
        '5th Semester',
        '6th Semester',
        '7th Semester',
        '8th Semester'
    )),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. NOTICES TABLE
CREATE TABLE IF NOT EXISTS public.notices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Academics',
    target_role TEXT NOT NULL DEFAULT 'all' CHECK (target_role IN ('all', 'student', 'teacher', 'admin')),
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    department_name TEXT DEFAULT 'Campus Wide',
    attachments JSONB DEFAULT '[]'::jsonb,
    pinned BOOLEAN DEFAULT FALSE,
    author_name TEXT DEFAULT 'University Registrar',
    views INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. PAYMENTS & ADMIN TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id TEXT NOT NULL UNIQUE, -- 'TXN-YYYYMMDD-XXXX'
    user_name TEXT NOT NULL,
    student_id TEXT,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    department_name TEXT NOT NULL,
    semester_name TEXT NOT NULL CHECK (semester_name IN (
        '1st Semester',
        '2nd Semester',
        '3rd Semester',
        '4th Semester',
        '5th Semester',
        '6th Semester',
        '7th Semester',
        '8th Semester'
    )),
    type TEXT NOT NULL CHECK (type IN ('student_fee', 'teacher_wage', 'late_fine')),
    amount NUMERIC(10, 2) NOT NULL,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('bKash', 'Nagad', 'Bank Transfer', 'Card')),
    status TEXT NOT NULL DEFAULT 'Paid' CHECK (status IN ('Paid', 'Pending', 'Overdue')),
    receipt_number TEXT NOT NULL UNIQUE, -- 'REC-XXXXXX'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. TEACHER WAGES TABLE (PAYROLL)
CREATE TABLE IF NOT EXISTS public.teacher_wages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_name TEXT NOT NULL,
    teacher_code TEXT NOT NULL,
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    department_name TEXT NOT NULL,
    month TEXT NOT NULL, -- 'August 2026', 'October 2026', etc.
    base_amount NUMERIC(10, 2) NOT NULL,
    allowances NUMERIC(10, 2) NOT NULL DEFAULT 0,
    deductions NUMERIC(10, 2) NOT NULL DEFAULT 0,
    net_amount NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Disbursed', 'Pending')),
    payment_method TEXT NOT NULL DEFAULT 'Bank Transfer',
    disbursed_at TIMESTAMPTZ,
    transaction_id TEXT REFERENCES public.payments(transaction_id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- INDICES & CONFLICT PREVENTION
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_routines_schedule ON public.class_routines (day_of_week, start_time, end_time, room);
CREATE INDEX IF NOT EXISTS idx_routines_teacher ON public.class_routines (day_of_week, start_time, end_time, teacher_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments (status, type, department_name);
CREATE INDEX IF NOT EXISTS idx_wages_month_status ON public.teacher_wages (month, status);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_wages ENABLE ROW LEVEL SECURITY;

-- Admins have full access to everything
CREATE POLICY "Admins full access profiles" ON public.profiles
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin' AND is_approved = TRUE));

CREATE POLICY "Admins full access departments" ON public.departments
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin' AND is_approved = TRUE));

CREATE POLICY "Admins full access semesters" ON public.semesters
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin' AND is_approved = TRUE));

CREATE POLICY "Admins full access subjects" ON public.subjects
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin' AND is_approved = TRUE));

CREATE POLICY "Admins full access class_routines" ON public.class_routines
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin' AND is_approved = TRUE));

CREATE POLICY "Admins full access notices" ON public.notices
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin' AND is_approved = TRUE));

CREATE POLICY "Admins full access payments" ON public.payments
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin' AND is_approved = TRUE));

CREATE POLICY "Admins full access teacher_wages" ON public.teacher_wages
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin' AND is_approved = TRUE));

-- Public read for verified notices, departments, semesters, subjects, routines
CREATE POLICY "Public read notices" ON public.notices FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Public read departments" ON public.departments FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Public read semesters" ON public.semesters FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Public read subjects" ON public.subjects FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Public read routines" ON public.class_routines FOR SELECT TO authenticated USING (TRUE);

