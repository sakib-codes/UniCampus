# UniCampus Supabase — Database & Backend Agent Directive

> **Database:** PostgreSQL (Supabase) • Row Level Security (RLS) • Migrations  
> **Master Router:** [`../AGENTS.md`](file:///home/sakib360/sakib-codes/UniCampus/AGENTS.md) • **Backend Architecture Context:** [`BACKEND_CONTEXT.md`](file:///home/sakib360/sakib-codes/UniCampus/unicampus-supabase/BACKEND_CONTEXT.md)

---

## 1. Backend Fast Rules (Token-Efficient Reference)

1. **Migration File Conventions**:
   - All schema modifications must be placed under `unicampus-supabase/migrations/`.
   - Naming convention: `YYYYMMDD_feature_name.sql` (e.g. `20261017_admin_portal_schema.sql`).
   - Every table must have a primary key (UUID preferred with `uuid_generate_v4()`).
   - Timestamps: Include `created_at TIMESTAMPTZ DEFAULT NOW()` on every entity table.

2. **Row Level Security (RLS) Enforcements**:
   - `ALTER TABLE public.<table_name> ENABLE ROW LEVEL SECURITY;` is **mandatory** for every created table.
   - Separate access policies by role: `admin` (full access via `is_approved = TRUE`), `teacher`, and `student`.
   - Anonymous access is prohibited by default.

3. **Strict Ordinal Semesters Constraint**:
   - The university strictly enforces 8 ordinal semesters:
     `'1st Semester'`, `'2nd Semester'`, `'3rd Semester'`, `'4th Semester'`, `'5th Semester'`, `'6th Semester'`, `'7th Semester'`, `'8th Semester'`.
   - Any check constraint or foreign key referencing semester names must use this exact casing and syntax.

4. **Foreign Key Integrity**:
   - Use `ON DELETE CASCADE` for tightly bound dependent records (e.g. department semesters, subjects).
   - Use `ON DELETE SET NULL` for audit trails or user associations (e.g. `head_teacher_id`, `user_id` on payments).

---

## 2. Pre-Flight & Post-Flight Checklist for Backend Agents

### Pre-Flight:
1. Read [`BACKEND_CONTEXT.md`](file:///home/sakib360/sakib-codes/UniCampus/unicampus-supabase/BACKEND_CONTEXT.md) to inspect existing tables, relationships, and indices.
2. Check [`../PROGRESS.md`](file:///home/sakib360/sakib-codes/UniCampus/PROGRESS.md) Backend Status.
3. Check [`../BUGS_AND_DEBT.md`](file:///home/sakib360/sakib-codes/UniCampus/BUGS_AND_DEBT.md) for data schema issues.

### Post-Flight:
1. Verify SQL syntax and migration idempotency (`CREATE TABLE IF NOT EXISTS`, `DROP CONSTRAINT IF EXISTS`).
2. Update [`BACKEND_CONTEXT.md`](file:///home/sakib360/sakib-codes/UniCampus/unicampus-supabase/BACKEND_CONTEXT.md) with newly added tables or columns.
3. Update [`../PROGRESS.md`](file:///home/sakib360/sakib-codes/UniCampus/PROGRESS.md) Backend section.
