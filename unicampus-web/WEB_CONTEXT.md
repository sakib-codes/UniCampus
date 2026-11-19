# UniCampus Web — Route, Component & Architecture Context

> **Framework:** Next.js 16.4.6 (App Router) • React 19.2.8 • Tailwind CSS v4 • TypeScript 5  
> **Directives:** [`AGENTS.md`](file:///home/sakib360/sakib-codes/UniCampus/unicampus-web/AGENTS.md) • **Master Router:** [`../AGENTS.md`](file:///home/sakib360/sakib-codes/UniCampus/AGENTS.md)

---

## 1. Route Inventory & Access Matrix

### Student & Public Routes
| Route | Component File | Description & Key Features | Gate / Layout |
|---|---|---|---|
| `/` & `/splash` | `src/app/page.tsx`, `src/app/splash/page.tsx` | Animated database sync splash card, logo squircle, auto-redirect | Full-screen (No Sidebar) |
| `/login` | `src/app/login/page.tsx` | Email/password sign-in with role switching and forgot password link | Standalone Shell |
| `/register` | `src/app/register/page.tsx` | Multi-step role selection (Student / Faculty), ID & dept setup | Standalone Shell |
| `/dashboard` | `src/app/dashboard/page.tsx` | "Good afternoon", live lecture progress, pinned notice, timetable | `AppShell` (Student) |
| `/dashboard/progress` | `src/app/dashboard/progress/page.tsx` | CGPA arc gauge (3.78/4.00), degree meter (66%), SVG SGPA spline, GPA simulator | `AppShell` (Student) |
| `/profile` | `src/app/profile/page.tsx` | Student profile hero, academic registry, activities list | `AppShell` (Student) |
| `/routine` | `src/app/routine/page.tsx` | Dual-view class timetable (mobile vertical timeline / desktop matrix) | `AppShell` (Student) |
| `/notices` | `src/app/notices/page.tsx` | Campus noticeboard with category pills (Exams, General, Seminars) | `AppShell` (Student) |
| `/notices/[id]` | `src/app/notices/[id]/page.tsx` | Announcement detail view, downloadable attachments, author card | `AppShell` (Student) |
| `/students` | `src/app/students/page.tsx` | Student directory with batch/department filters & search | `AppShell` (Student) |
| `/teachers` | `src/app/teachers/page.tsx` | Faculty directory with office availability pills (*In Office*, *Online*) | `AppShell` (Student) |
| `/teachers/[id]` | `src/app/teachers/[id]/page.tsx` | Faculty profile, consultation hours, courses taught | `AppShell` (Student) |
| `/materials` | `src/app/materials/page.tsx` | Course resource downloads and study files | `AppShell` (Student) |
| `/messages` | `src/app/messages/page.tsx` | Messaging drawer and direct peer conversations | `AppShell` (Student) |
| `/settings` | `src/app/settings/page.tsx` | Account details, notification toggles, 2FA, Supabase sync | `AppShell` (Student) |

### Admin Console Routes (`src/app/admin/*`)
| Route | Component File | Description & Key Features | Gate / Layout |
|---|---|---|---|
| `/admin/dashboard` | `src/app/admin/dashboard/page.tsx` | 5 KPI metrics, pending approvals banner, express notice composer | `AdminRoleGate` |
| `/admin/users` | `src/app/admin/users/page.tsx` | User approval queue, role editor dialog, add user modal | `AdminRoleGate` |
| `/admin/notices` | `src/app/admin/notices/page.tsx` | Noticeboard CRUD, audience targeting, pinned toggle, attachments | `AdminRoleGate` |
| `/admin/routine` | `src/app/admin/routine/page.tsx` | Timetable workspace with conflict detection (room/teacher overlaps) | `AdminRoleGate` |
| `/admin/departments` | `src/app/admin/departments/page.tsx` | Curriculum course manager (1st–8th Semesters) & HOD assigner | `AdminRoleGate` |
| `/admin/finance` | `src/app/admin/finance/page.tsx` | 4-tab finance hub: Overview, Ledger, Dept breakdown, Teacher Wages | `AdminRoleGate` |
| `/admin/analytics` | `src/app/admin/analytics/page.tsx` | Institutional metrics & enrollment charts | `AdminRoleGate` |
| `/admin/settings` | `src/app/admin/settings/page.tsx` | University-wide configuration & system logs | `AdminRoleGate` |

### Teacher Portal Routes (`src/app/teacher/*`)
| Route | Component File | Description & Key Features | Gate / Layout |
|---|---|---|---|
| `/teacher/dashboard` | `src/app/teacher/dashboard/page.tsx` | Instructor schedule overview, upcoming lectures, student count | `TeacherRoleGate` |
| `/teacher/attendance` | `src/app/teacher/attendance/page.tsx` | Interactive QR scanner & live attendance logging modal | `TeacherRoleGate` |
| `/teacher/grades` | `src/app/teacher/grades/page.tsx` | Grade submission matrix and student marks entry | `TeacherRoleGate` |
| `/teacher/materials` | `src/app/teacher/materials/page.tsx` | Lecture slides & assignment document repository | `TeacherRoleGate` |
| `/teacher/routine` | `src/app/teacher/routine/page.tsx` | Instructor timetable across university departments | `TeacherRoleGate` |

---

## 2. Component Hierarchy & Modular Directory

- **`src/components/shell/`** (Unified Portal Shell):
  - `PortalShell.tsx`: Unified, responsive shell container for Student, Teacher, and Admin portals.
  - `SideNav.tsx`: Desktop 240px clean hairline sidebar with active route pill indicators.
  - `TopBar.tsx`: Sticky calm topbar with breadcrumb context, search trigger, notifications, and profile menu.
  - `BottomTabs.tsx`: Mobile 5-tab bar with 4 primary destinations + `More` trigger (fixes 390px mobile header overflow).
  - `NotificationsMenu.tsx`: Notification popover with mark-all-read.
  - `AccountMenu.tsx`: Account switcher & theme toggle dropdown.
  - `MoreSheet.tsx`: Mobile bottom sheet for secondary navigation items.
- **`src/components/ui/`** (Calm Campus Primitives):
  - `Button.tsx`, `Card.tsx`, `PageHeader.tsx`, `Stat.tsx`, `Badge.tsx`, `Chip.tsx`, `ListRow.tsx`, `DataTable.tsx`, `Tabs.tsx`, `Modal.tsx`, `Sheet.tsx`, `Toast.tsx`, `EmptyState.tsx`, `Skeleton.tsx`, `Avatar.tsx`, `cn.ts`.
- **`src/components/layout/`**:
  - `AppShell.tsx`: Root layout shell mounting `PortalShell` for authenticated routes and bare layouts for landing/splash/auth.
  - `AdminRoleGate.tsx`: Role guard protecting `/admin/*` routes.
  - `TeacherRoleGate.tsx`: Role guard protecting `/teacher/*` routes.
- **`src/components/bits/`** (Micro-Interactions):
  - `CountUp.tsx`: Cubic-bezier easing metric counter with hard-snap finish.
  - `FadeIn.tsx`: Subtle Framer Motion enter transition.
  - *(Gimmicks retired: SpotlightCard, PixelCard, Aurora, BlurText, ShinyText, TiltedCard, DecryptedText, StarBorder, TrueFocus, ClickSpark)*.
- **`src/components/common/`** (Composed Components):
  - `StatCard.tsx`, `MetricBentoCard.tsx`, `FilterPill.tsx`, `SegmentedTabs.tsx`, `Switch.tsx`, `ThemeToggle.tsx`.
  - `CommandPalette.tsx`: Global `Cmd+K` / `Ctrl+K` calm search modal.
  - `KeyboardShortcutsModal.tsx`: Navigation shortcuts overlay (`?`).

---

## 3. State Management & Service Architecture

- **`src/context/AdminAuthContext.tsx`**: Provides admin authorization state, role simulation switcher, and clearance levels.
- **`src/lib/services/adminService.ts`**: Handles mock/live CRUD for users, departments, subjects, notices, and finance transactions.
- **`src/lib/services/teacherService.ts`**: Handles teacher classes, lecture routine, and attendance records.
- **`src/lib/attendanceService.ts`**: QR scanning verification, session hashing, and attendance recording.
- **`src/lib/mockData.ts` & `src/lib/facultyData.ts`**: Comprehensive fallback dataset reflecting Supabase relational tables.
- **`src/lib/supabase/client.ts`**: Supabase browser client configured via environment variables.

---

## 4. Web Verification Protocol
```bash
# Type safety check
cd unicampus-web
npx tsc --noEmit

# Linting
npm run lint

# Production build check
npm run build
```
