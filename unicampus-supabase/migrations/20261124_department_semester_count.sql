-- Add configurable semester count per department program (2 to 12 semesters, default 8)
ALTER TABLE public.departments
  ADD COLUMN IF NOT EXISTS total_semesters integer NOT NULL DEFAULT 8
  CHECK (total_semesters >= 2 AND total_semesters <= 12);

COMMENT ON COLUMN public.departments.total_semesters IS
  'Number of semesters in this department degree program (2–12, default 8). Reflected across Student, Teacher, Admin, and Registration flows.';
