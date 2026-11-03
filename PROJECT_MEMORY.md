# UniCampus — Project Memory & Master Roadmap

> **Last Updated:** September 2026  
> **Status:** Web UI Student Portal Complete • Ready for Mobile UI (Flutter) Implementation

---

## 1. Project Architecture

The UniCampus workspace is structured as a unified monorepo:
* **`/unicampus-web`**: Next.js 16 (Turbopack, App Router, TypeScript, Tailwind CSS v4) Web Application.
* **`/unicampus-mobile`**: Flutter cross-platform mobile application (Android, iOS, Windows, Linux — Web excluded).
* **`/unicampus-supabase`**: Backend migrations, schema scripts, and Edge Functions.

---

## 2. What Has Been Designed & Implemented (`unicampus-web`)

### Design System & Global Layout
- **Color Palette**: Theme background `#EAEBF6`, Brand Indigo `#605BFF`, Success Emerald `#10B981`, Amber `#F59E0B`.
- **Card Aesthetics**: Rounded cards (`rounded-3xl` / `rounded-[48px]`), subtle shadows, clean typography.
- **Custom Favicon**: Custom UniCampus SVG branding in browser tab with gradient squircle and bold white "U".
- **Scrolling & Viewport**: Custom smooth webkit scrollbars; fixed layout flex constraints enabling full scroll on all screen sizes.
- **Global Shell (`AppShell.tsx`)**:
  - Automatically hides Sidebar/Header on `/` and `/splash` for full-screen focus.
  - Renders persistent `Sidebar` and `Header` on all portal routes.
- **Header Interactive Flyouts (`Header.tsx`)**:
  - **Dynamic Multi-Level Breadcrumbs**: Auto-formats sub-routes (`Portal / Notices / Detail View`, `Portal / Teachers / Profile`, etc.).
  - **Notification Bell Dropdown**: Shows 3 actionable alerts with unread badge and "Mark read" action.
  - **User Profile Dropdown**: User identity banner, links to Profile, Milestones, Settings, sync status, and Sign Out.

### Web UI Pages Built (12 Screens / Views)
| Route | Screen | Description | Status |
|---|---|---|---|
| `/` & `/splash` | **Splash Screen** | Animated 87% campus database sync card, logo squircle, and automatic portal transition. | **Completed** |
| `/dashboard` | **Student Dashboard** | "Good afternoon, Sakib", live lecture card (DBMS) with progress bar, pinned notice, upcoming routine, accomplishments, recent notices. | **Completed** |
| `/dashboard/progress` | **Academic Progress & Degree Audit** | Overall CGPA radial arc gauge (3.78/4.00), degree completion (66%), credit distribution meters, forecast SGPA (3.85), SVG SGPA vs CGPA trajectory spline with tooltips, filterable semester course table, unofficial transcript modal, and interactive GPA Simulator. | **Completed** |
| `/profile` | **Student Profile** | Profile hero with avatar, Personal Info, Academic Registry, Contact Info, and Campus Activities. | **Completed** |
| `/routine` | **Class Routine (Student)** | 6-day timetable matrix (Sat–Thu), day selector pills, color-coded courses (Theory blue, SE green, Lab amber). | **Completed** |
| `/notices` | **Campus Noticeboard** | Category filters (Exams, General, Admission, Seminars, Schedules), live search, and notice cards with attachment tags. | **Completed** |
| `/notices/[id]` | **Notice Detail View** | Announcement body, author card (Dr. Asif Rahman), downloadable attachment widgets, action buttons, related notices. | **Completed** |
| `/students` | **Student Directory** | Batch & department filter pills, live search bar, student cards with avatars and section tags. | **Completed** |
| `/teachers` | **Faculty Directory** | Search by name/course, department filter tabs, availability status indicators (*In Office*, *In Class*, *Online*). | **Completed** |
| `/teachers/[id]` | **Teacher Profile** | Faculty profile card, contact info, Courses Taught list with enrollments, and consultation hours schedule cards. | **Completed** |
| `/settings` | **Portal Settings** | Profile details form, notification switches (Email, SMS, Routine), 2FA toggle, password update, Supabase sync status. | **Completed** |
| `/teachers` ↔ `/teachers/[id]` | **Faculty Profile Link** | Direct routing from faculty cards to individual consultation profiles. | **Completed** |

---

## 3. Current Phase: Mobile Application (`unicampus-mobile`)

We have built the mobile design system, splash screens, and 3-step onboarding flow in Flutter:

### Flutter Mobile Screens Built:
| Feature | Files | Description | Status |
|---|---|---|---|
| **Design System & Theme** | `lib/src/core/theme.dart` | Light and dark themes, brand colors (`#605BFF`), Google Fonts Inter typography. | **Completed** |
| **Brand Logo Widget** | `lib/src/widgets/brand_logo.dart` | Gradient squircle, white "U" insignia, frosted outer container for dark/light modes. | **Completed** |
| **Splash Screen (Dark)** | `lib/src/features/splash/splash_screen.dart` | Deep dark `#0A0815` background, centered frosted logo, smooth scale & fade animations. | **Completed** |
| **Splash Screen (Light)** | `lib/src/features/splash/splash_screen.dart` | Clean `#F7F8FD` background, elevated squircle logo with soft drop shadow. | **Completed** |
| **Onboarding 1 (Notices)** | `lib/src/features/onboarding/` | "Stay updated with university notices", 3D glossy purple orb & orbital ring illustration, indicator pill. | **Completed** |
| **Onboarding 2 (Routine)** | `lib/src/features/onboarding/` | "Manage your class routine", tilted floating frosted cards & amber accent dot illustration. | **Completed** |
| **Onboarding 3 (Directory)** | `lib/src/features/onboarding/` | "Find teachers & students easily", intersecting concentric rings illustration, "Get Started" action. | **Completed** |
| **Onboarding Host & Transitions** | `lib/src/features/onboarding/onboarding_screen.dart` | Top bar (logo + Skip), PageView with smooth text transitions, bottom floating white card. | **Completed** |
| **Login Screen** | `lib/src/features/auth/login_screen.dart` | "Welcome back", email & password inputs, "Forgot Password?", "Sign In" button, "Create Account" secondary button. | **Completed** |
| **Multi-Step Sign Up Wizard** | `lib/src/features/auth/register_screen.dart` | UX Best Practice: Split into 3 bite-sized steps (Identity, Academic/Faculty, Security) with role tabs and progress bar. | **Completed** |
| **Forgot Password Screen** | `lib/src/features/auth/forgot_password_screen.dart` | Central frosted padlock icon, email input, "Send Reset Link", back to login link. | **Completed** |
| **Reset Password Screen** | `lib/src/features/auth/reset_password_screen.dart` | New & confirm password, 3-segment strength meter ("Strong"), and animated success alert banner. | **Completed** |


---

## 4. Master TODO List & Return-to-Web Backlog

When mobile UI design is complete, we will return to complete these remaining Web and Backend features:

### Phase A: Web Authentication & Onboarding
- [ ] **Login Screen (`/login`)**: Email/password inputs, "Remember me", validation, link to forgot password.
- [ ] **Registration Screen (`/register`)**: Student & teacher registration form with role selection, ID, department, and password setup.
- [ ] **Role-Based Auth Gate**: Redirect users based on role (`student`, `teacher`, `admin`).

### Phase B: Web Admin Console Screens (Completed)
- [x] **Admin Authentication & Role Gate (`AdminRoleGate.tsx`, `AdminAuthContext.tsx`)**:
  - Strict route protection: Only verified users with `role === 'admin'` can access admin layout.
  - Interactive Clearance Gate with test role switching and return navigation.
- [x] **Admin Executive Dashboard (`/admin/dashboard`)**:
  - Top 5 Metric KPI cards: Active Students, Verified Faculty, Pending User Approvals, Monthly Fee Collection, System Notices.
  - Urgent review banner with 1-click pending user navigation.
  - Quick navigation shortcuts: Approve Users, Create Routine, Post Notice, Disburse Wages.
  - Express notice composer with instant broadcast and live system activity stream.
- [x] **Admin User Approvals & Directory (`/admin/users`)**:
  - Filter segments: All Accounts, Pending Approvals, Students, Teachers, Administrators.
  - Instant search across name, email, student ID, and teacher code.
  - 1-click Approve and Reject confirmation workflows.
  - User role editing dialog with dynamic semester dropdown loading.
  - Add New User Account provisioning modal.
- [x] **Admin Notices Dispatch & Broadcast Manager (`/admin/notices`)**:
  - Full CRUD: Create, View Details modal, Edit, and Delete notices.
  - Bulk select & delete notices.
  - 1-click Pinned announcement toggle.
  - Storage attachment support (PDF & image uploads).
  - Multi-level audience targeting (All Campus, Students Only, Faculty Only, Department).
- [x] **Admin Timetable & Routine Maker Workspace (`/admin/routine`)**:
  - Department and Ordinal Semester (`1st Semester` to `8th Semester`) context selectors.
  - Interactive Day tabs (`Sunday` to `Thursday`) with lecture slot matrix.
  - Visual schedule builder modal with subject selection from curriculum and time presets.
  - Live Conflict Detection warning against occupied rooms and double-booked faculty.
  - Quick duplicate and delete actions.
- [x] **Admin Departments & Curriculum Roster (`/admin/departments`)**:
  - Department directory cards with faculty count, student count, and Head of Department indicator.
  - Assign or change Head of Department (HOD) from eligible verified faculty.
  - Semester-wise Curriculum Course Manager grouped from `1st Semester` to `8th Semester`.
  - Add/Edit/Delete curriculum subjects with Course Code, Title, and Credit Hours.
- [x] **Fees, Payments & Faculty Payroll Portal (`/admin/finance`)**:
  - Tab 1: Financial Overview with 4 KPI cards and department fee collection progress bars.
  - Tab 2: All Transactions ledger with search, multi-faceted filtering, 1-tap Copy TXN ID, Digital Receipt Voucher modal, and RFC 4180 CSV export.
  - Tab 3: Department Breakdown with collection efficiency banner, ordinal semester accordions, and Send Due Reminders broadcast modal.
  - Tab 4: Teacher Wages (Payroll) with cycle navigation, faculty salary table, 1-click single/bulk disbursement, and itemized Faculty Salary Slip Voucher modal.

### Phase C: Profile & Teacher Enhancements
- [ ] **Profile Edit & Photo Upload Modal (`/profile/edit`)**:
  - Drag-and-drop avatar uploader.
  - Edit form for contact number, emergency contact, present address, and bio.
- [ ] **Class Routine — Teacher View (`/routine/teacher`)**:
  - Toggle or view showing instructor's assigned lectures across departments, free slots, and office hours.

### Phase D: Backend & Supabase Integration (`unicampus-supabase`)
- [x] Database Schema & Migrations (`20261017_admin_portal_schema.sql`):
  - `profiles`, `user_roles`, `departments`, `semesters` (1st to 8th Semester check), `subjects`, `class_routines`, `notices`, `payments`, `teacher_wages`.
  - Row Level Security (RLS) policies for Student, Teacher, and Admin roles.
  - Storage bucket attachment support.
- [ ] Real-time Supabase channels configuration in production.

---

## 5. UI/UX Global Design Skills & Responsive Architecture (Completed)

- **UI Intelligence & Skills Mounted Globally (`~/.gemini/config/skills/`)**:
  - `ui-ux-pro-max`: Design intelligence for web & mobile with 79 styles, 192 palettes, 119 UX guidelines, and tech stack references.
  - `styleseed`: Open-source design-method engine with 22 workflows for token architecture, accessibility audits, and motion curves.
  - `awesome-design-md`: Design token systems reverse-engineered from world-class software craft (Linear, Supabase, Vercel, Stripe, Raycast, Notion, GitHub).
  - `react-bits`: Complete animated and interactive component catalog (`SpotlightCard`, `CountUp`, `ShinyText`).
  - `awesome-design-skills`: 67 aesthetic systems (`clean`, `bento`, `enterprise`, `shadcn`, `neobrutalism`, `glassmorphism`, `minimal`, `modern`).

- **Responsive Engineering & Layout Upgrades**:
  - **Zero Horizontal Overflow**: Fixed desktop-first static pixel containers (`w-80`, `w-84`, `w-96`) replaced with viewport-safe responsive boundaries (`w-[calc(100vw-2rem)] sm:w-... max-w-[...]`).
  - **Dual Mobile/Desktop Rendering**:
    - `/routine`: Mobile timeline view with horizontal day picker and vertical lecture cards; wide timetable table on desktop.
    - `/admin/users`: Dedicated mobile cards with user avatars, roles, department tags, and 1-tap Approve/Edit/Reject actions; full table on desktop.
    - `/admin/departments`: Mobile course cards with credit/type badges and actions; full table on desktop.
    - `/admin/finance`: Mobile transaction ledger cards and payroll cards with copy TXN ID, view voucher, and disburse triggers; full table on desktop.
    - `/admin/notices`: Mobile notice cards with priority pins, target audience pills, and view/edit/delete actions; full table on desktop.
  - **Interactive Craft & Component Micro-Interactions**:
    - `SpotlightCard`: Integrated across Student, Faculty, and Admin interfaces with responsive cursor-following ambient gradient lighting.
    - `CountUp`: Smooth cubic-bezier `[0.16, 1, 0.3, 1]` easing with instant completion hard-snap, completely resolving asymptotic animation crawl.
    - `Select-none` stripped from tabular and informative sections so students, faculty, and admins can freely copy IDs, emails, codes, and currency amounts.
    - Touch target accessibility compliant with 44px minimum sizing and 8px+ touch gaps across all mobile drawers and action bars.
