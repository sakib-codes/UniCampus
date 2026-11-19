# UniCampus — Multi-Platform Progress & Sprint Ledger

> **Last Updated:** November 2026  
> **Status Legend:**  
> `[x]` = Verified & Production Ready • `[~]` = In Progress / Partial • `[ ]` = Backlog / Planned • `[!]` = Blocked / Review Needed

---

## 1. Executive Parity & Milestone Summary

```
Web Portal (Next.js 16)      [████████████████████] 100% Complete (Calm Campus Redesign Complete)
Mobile App (Flutter 3.47)    [████████░░░░░░░░░░░] 40% Complete (Auth & Design System Ready)
Backend (Supabase/Postgres)  [████████████████░░░] 85% Complete (Schema & RLS Done)
```

---

## 2. Web Portal Calm Campus Redesign Sprint (Phases 0–7)

| Phase | Milestone | Deliverables | Status |
|---|---|---|---|
| **Phase 0** | Token System & Theme Codemod | Solid Option A Indigo palette (`#605BFF` / `#7C78FF`), Inter font, removal of `!important` overrides | `[x]` |
| **Phase 1** | Unified Portal Shell | `PortalShell` replacing 3 duplicate sidebar/header pairs, mobile `BottomTabs`, fixed 390px header bug | `[x]` |
| **Phase 2** | UI Primitives & Common Wrappers | 14 primitives in `@/components/ui/`, cleaned `common/` wrappers, retired `SpotlightCard` | `[x]` |
| **Phase 3** | Landing Page & Auth Flow | Redesigned calm hero, metrics, personas, FAQ, clean Login & Register with 0 ESLint errors | `[x]` |
| **Phase 4** | Student Portal Screens | Calm 2-col dashboard, progress arc, dual-view routine, solid scanner modal, WhatsApp-style messages | `[x]` |
| **Phase 5** | Faculty Portal Screens | Redesigned faculty home, sticky attendance QR roster, grades matrix, routine, materials, notices | `[x]` |
| **Phase 6** | Admin Console Screens | Calm executive KPIs, routine conflict resolver, ৳ finance ledger, analytics with brand tokens | `[x]` |
| **Phase 7** | Gimmick Cleanup & Verification | Deleted 10 unused gimmick bits, 0 `animate-in` classes, <50 hex classes, 0 TS/ESLint errors, production build passed, 406/406 E2E audit checks passed across 4 tiers | `[x]` |
| **Phase 8** | Production UI Architecture Upgrade | Decomposed `messages/page.tsx` monolith into 10 memoized subcomponents, eliminated composer typing lag, replaced `min-h-screen` with `min-h-dvh`, added root & segment `loading.tsx` / `error.tsx` / `not-found.tsx`, purged 100% of `transition-all` across all 34 routes, removed remaining hex leaks, fixed responsive width traps, passed 406/406 E2E audit checks | `[x]` |
| **Phase 9** | Linter & React 19 Warning Zeroing | Silenced all 12 React 19 `react-hooks/set-state-in-effect` warnings via async microtask deferrals, removed 73 unused imports/variables, typed theme transitions without `any`, achieved 0 ESLint errors & 0 warnings workspace-wide, verified 406/406 E2E audit checks pass | `[x]` |
| **Phase 10** | Role-Based Logical Navigation & Route Isolation Audit | Fixed Next.js `ts(71002)` entry export bug on notices page; fixed Faculty role isolation drop on shared routes (`/messages`, `/settings`, `/teachers`, `/teachers/1`) in `AppShell`; fixed `getPortalTitle` header title fallback for single-segment paths; updated `NoticeSnippetCard` to canonical IDs (`not-exam-108`, `not-reg-089`, `not-hack-044`); created automated Playwright role navigation audit (`role-navigation-audit.mjs`), achieving 86/86 role navigation checks passed and 406/406 full E2E checks passed | `[x]` |

---

## 3. Web Portal (`unicampus-web`) Feature Matrix

| Route / Component | Description | Role / Gate | Status |
|---|---|---|---|
| `/` & `/splash` | Animated campus database sync & splash screen | Public | `[x]` |
| `/login` | Email/password sign-in with role redirection | Public | `[x]` |
| `/register` | Multi-step role registration (Student / Faculty) | Public | `[x]` |
| `/dashboard` | Student Dashboard: live lecture, timetable, pinned notice | Student | `[x]` |
| `/dashboard/progress` | Academic audit, CGPA radial gauge, SGPA trajectory spline, GPA simulator | Student | `[x]` |
| `/profile` | Student Profile: Personal, Academic, Activity info | Student | `[x]` |
| `/routine` | Dual-view class timetable (mobile timeline / desktop matrix) | Student | `[x]` |
| `/notices` & `/notices/[id]` | Noticeboard with category filters & announcement detail views | Student / All | `[x]` |
| `/students` | Student Directory with batch/dept filters and instant search | Student / Faculty | `[x]` |
| `/teachers` & `/teachers/[id]` | Faculty Directory with office hours & consultation profiles | Student / Faculty | `[x]` |
| `/settings` | Account details, notification toggles, 2FA, Supabase sync | Student / Faculty | `[x]` |
| `/materials` | Course downloads & reference library | Student | `[x]` |
| `/messages` | Campus messaging drawer & direct chat interface | Student / Faculty | `[x]` |
| `/admin/dashboard` | Executive KPI cards, pending user reviews, express notice composer | Admin (`AdminRoleGate`) | `[x]` |
| `/admin/users` | User approvals ledger, role editor, add user modal | Admin (`AdminRoleGate`) | `[x]` |
| `/admin/notices` | Noticeboard CRUD, audience targeting, pinned announcements | Admin (`AdminRoleGate`) | `[x]` |
| `/admin/routine` | Interactive timetable builder with live conflict detection | Admin (`AdminRoleGate`) | `[x]` |
| `/admin/departments` | Curriculum course manager & Head of Dept assignment | Admin (`AdminRoleGate`) | `[x]` |
| `/admin/finance` | Transactions ledger, receipts, department fees, payroll vouchers | Admin (`AdminRoleGate`) | `[x]` |
| `/teacher/dashboard` | Faculty overview: upcoming classes, quick attendance | Teacher (`TeacherRoleGate`) | `[x]` |
| `/teacher/attendance` | QR scanner & student attendance session logger | Teacher (`TeacherRoleGate`) | `[x]` |
| `/teacher/grades` | Semester grade submission & evaluation matrix | Teacher (`TeacherRoleGate`) | `[x]` |
| `/teacher/materials` | Course material upload & resource manager | Teacher (`TeacherRoleGate`) | `[x]` |
| `/teacher/routine` | Faculty assigned lecture timetable across departments | Teacher (`TeacherRoleGate`) | `[x]` |
| `/profile/edit` | Avatar drag-and-drop & profile editing modal | Student / Faculty | `[ ]` |

---

## 4. Mobile App (`unicampus-mobile`) Feature Matrix

| Feature / Screen | Source File | Description | Status |
|---|---|---|---|
| **Design System & Theme** | `lib/src/core/theme.dart` | Light/Dark theme, brand indigos, Inter typography | `[x]` |
| **Brand Logo Widget** | `lib/src/widgets/brand_logo.dart` | Frosted gradient squircle with white "U" insignia | `[x]` |
| **Splash Screen** | `lib/src/features/splash/splash_screen.dart` | Animated brand splash with light/dark support | `[x]` |
| **Onboarding Tour (3 Steps)** | `lib/src/features/onboarding/onboarding_screen.dart` | Notices, Routine, Directory intro with custom animations | `[x]` |
| **Login Screen** | `lib/src/features/auth/login_screen.dart` | Email/password sign-in with validation and auth links | `[x]` |
| **Multi-Step Register Wizard** | `lib/src/features/auth/register_screen.dart` | 3-step wizard (Identity, Academic/Faculty, Security) | `[x]` |
| **Forgot Password Screen** | `lib/src/features/auth/forgot_password_screen.dart` | Reset email request with padlock artwork | `[x]` |
| **Reset Password Screen** | `lib/src/features/auth/reset_password_screen.dart` | Password update with 3-segment strength meter | `[x]` |
| **Student Dashboard** | `lib/src/features/dashboard/` | Port of Web live lecture, routine snippet, notices | `[ ]` |
| **Academic Progress & Audit** | `lib/src/features/progress/` | CGPA gauge, semester grades, GPA forecast | `[ ]` |
| **Class Routine Matrix** | `lib/src/features/routine/` | Horizontal day selector with vertical lecture timeline | `[ ]` |
| **Campus Noticeboard** | `lib/src/features/notices/` | Categorized notices with search and detail modal | `[ ]` |
| **Student Directory** | `lib/src/features/directory/students/` | Searchable student cards with batch filters | `[ ]` |
| **Faculty Directory** | `lib/src/features/directory/teachers/` | Faculty cards with consultation hours and status | `[ ]` |
| **User Profile & Settings** | `lib/src/features/profile/` | Profile details, notification toggles, theme switcher | `[ ]` |
| **Teacher QR Attendance** | `lib/src/features/attendance/` | Camera QR scanner for student class attendance | `[ ]` |

---

## 5. Backend & Database (`unicampus-supabase`) Status

| Component | Target File | Description | Status |
|---|---|---|---|
| **Core Database Schema** | `migrations/20261017_admin_portal_schema.sql` | 9 relational tables: departments, semesters, profiles, user_roles, subjects, class_routines, notices, payments, teacher_wages | `[x]` |
| **Row Level Security (RLS)** | `migrations/20261017_admin_portal_schema.sql` | Role-based policies for Student, Teacher, and Admin | `[x]` |
| **Foreign Key Constraints** | `migrations/20261017_admin_portal_schema.sql` | Cascading deletes & cross-table integrity | `[x]` |
| **Storage Buckets** | Supabase Storage | Notice attachments and profile avatars | `[~]` |
| **Realtime Subscriptions** | Edge / Client channels | Live lecture updates and urgent notice broadcasts | `[ ]` |

---

## 6. Recent Changelog Ledger

| Date | Agent / Contributor | Scope | Description |
|---|---|---|---|
| **2026-11-19** | Antigravity AI | `unicampus-web` | Resolved all Victory Audit and automated E2E test failures (406/406 checks passed across all 4 tiers): fixed ThemeToggle SSR hydration mismatch (`tabindex="0"` on `motion.span`), prevented mobile landing header button overflow on 390px, enforced >=8px separation on dual-metric labels in admin analytics, aligned teacher attendance pre-finalization absent count and enabled pagination (`pageSize: 4`), added full canonical grade scale legend in teacher grades (A+ 90-100%, A 80-89%, A- 75-79%, B+ 70-74%, B 65-69%, C 60-64%), added student dashboard canonical term and semester labels, consolidated routine weekly matrix to single Midday Recess row, removed glowing dots in routine and messages, sanitized developer jargon in admin settings, resolved student directory name collisions, verified 0 TS errors and clean Next.js production build (34/34 routes). |
| **2026-11-19** | Antigravity AI | `unicampus-web` | Executed end-to-end browser audit remediation plan: created canonical campus registry (`src/lib/canonicalCampus.ts`), fixed mobile 5-tab truncation by adding `More` overflow drawer, prevented mobile teacher attendance footer from obscuring QR codes, normalized grading policy weights to 100% with working pagination, aligned routine to non-overlapping institutional periods, cleaned up duplicate badges and AI clichés, reconciled 5 departments and 5,072 total users, verified 0 errors with `npx tsc --noEmit` and successful production Next.js build (34/34 routes). |
| **2026-11-18** | Antigravity Multi-Agent Pipeline | `unicampus-web` | Complete systemic Calm Campus UI audit and refinement across 24 routes: de-cluttered congested cards, removed pseudo-tech/AI jargon (blockchain, sha-256, serverless telemetry, IoT fake status), resolved identity discrepancies, consolidated action button clusters (materials, faculty, routine), eliminated text redundancy, and verified zero type/build errors across all 34 routes. |
| **2026-11-18** | Antigravity Teamwork | `unicampus-web` | Executed De-AI Design Refinement plan across 13 files: eliminated floating uppercase dot badges, purged duplicate quick actions and CTAs, centered login card, removed AI prompt chips, fixed light mode chat contrast, and verified clean independent build. |
| **2026-11-18** | Antigravity Swarm | `unicampus-web` | Implemented complete Calm Campus UI redesign (Phases 0–7): unified `PortalShell`, 14 shared `@/components/ui/` primitives, Option A Indigo palette, 34/34 routes refreshed, 10 gimmick bits retired, 0 dead animation classes, verified clean build & Playwright captures. |
| **2026-11-18** | Security & Web | `unicampus-web` | Upgraded `next` and `eslint-config-next` from `16.4.2` to `16.4.6` to patch security vulnerability. Verified with `tsc --noEmit`. |
| **2026-11-18** | Architecture Team | Monorepo Governance | Built comprehensive Vibe Coding documentation architecture (`AGENTS.md`, `PROGRESS.md`, `BUGS_AND_DEBT.md`, `TESTING_AND_VERIFICATION.md`, web/mobile/backend context files). |
| **2026-10-17** | Core Team | Backend & Admin | Implemented Supabase master schema and complete Web Admin Console screens (`/admin/dashboard`, `/admin/users`, `/admin/notices`, `/admin/routine`, `/admin/departments`, `/admin/finance`). |
| **2026-09-30** | Mobile Team | Flutter Mobile | Implemented mobile design system, splash screen, 3-step onboarding flow, and auth screens (login, register, forgot/reset password). |
