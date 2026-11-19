# UniCampus — Issue, Bug & Technical Debt Registry

> **Purpose:** Centralized registry for all active bugs, regressions, and technical debt across the UniCampus monorepo.  
> **Protocol:** Every agent encountering a bug must check here first. When you discover or resolve a bug, update this file immediately.

---

## 1. Active Issues & Technical Debt

### Issue #1: Mock Data Layer Transition to Live Supabase Client
- **Platform:** `unicampus-web` & `unicampus-mobile`
- **Severity:** Medium (Architectural)
- **Status:** `[ ] Backlog`
- **Description:** The Web and Mobile applications currently read from in-memory mock datasets (`src/lib/mockData.ts`, `src/lib/facultyData.ts`, `src/lib/services/adminService.ts`). The database schema is fully drafted in `unicampus-supabase/migrations/20261017_admin_portal_schema.sql`, but client services have not been fully wired to live Supabase queries.
- **Remediation Plan:** Wire services through `src/lib/supabase/client.ts` with error fallbacks to mock data when offline or in test environments.

---

### Issue #2: Mobile Student & Faculty Screens Porting Backlog
- **Platform:** `unicampus-mobile`
- **Severity:** High (Feature Gap)
- **Status:** `[~] In Progress`
- **Description:** Mobile app has completed Splash, Onboarding, and Auth (Login, Register Wizard, Forgot/Reset Password), but the remaining screens (Student Dashboard, Academic Audit, Routine Matrix, Notices, Directory) need to be ported from Web UI to Flutter.
- **Remediation Plan:** Follow the porting blueprint in [`unicampus-mobile/MOBILE_CONTEXT.md`](file:///home/sakib360/sakib-codes/UniCampus/unicampus-mobile/MOBILE_CONTEXT.md).

---

### Issue #3: Profile Edit & Avatar Upload Modal
- **Platform:** `unicampus-web`
- **Severity:** Low (Feature Enhancement)
- **Status:** `[ ] Backlog`
- **Description:** The Student Profile view (`/profile`) shows avatar and info, but the edit modal (`/profile/edit`) with drag-and-drop file upload is not yet implemented.
- **Remediation Plan:** Build the profile editor modal and connect to Supabase Storage avatars bucket.

---

## 2. Resolved Issues Archive

| Issue ID | Platform | Summary | Resolution | Date Resolved |
|---|---|---|---|---|
| **RES-001** | `unicampus-web` | Desktop-first static pixel containers (`w-80`, `w-96`) causing horizontal scroll on mobile viewports. | Replaced with responsive boundaries (`w-[calc(100vw-2rem)] sm:w-... max-w-[...]`) and dual mobile/desktop view rendering. | 2026-10-18 |
| **RES-002** | `unicampus-web` | `CountUp` animation exhibiting asymptotic crawl near completion. | Added cubic-bezier `[0.16, 1, 0.3, 1]` easing with instant hard-snap completion at 99%. | 2026-10-18 |
| **RES-003** | `unicampus-web` | `select-none` utility preventing students and faculty from copying IDs, emails, and transaction numbers. | Removed `select-none` from all tabular and data-dense views while retaining it on interactive buttons. | 2026-10-18 |
| **RES-004** | `unicampus-mobile` | Package dependency incompatibilities during fresh flutter pub get. | Ran dependency alignment and verified 0 warnings/errors with `flutter analyze`. | 2026-11-18 |
| **RES-005** | `unicampus-web` | Dead Tailwind v4 animation classes (`animate-in`, `fade-in`, `zoom-in-95`, etc.) across 22 files producing zero motion. | Purged all 46 dead classes, replacing with subtle `framer-motion` and native CSS transitions. Verified 0 occurrences remain in `src/`. | 2026-11-18 |
| **RES-006** | `unicampus-web` | Mobile top header 390px viewport overlap and 3 disjointed duplicate sidebar/header implementations. | Unified Student, Teacher, and Admin layouts into single responsive `PortalShell` with clean hairline desktop `SideNav` and mobile `BottomTabs`. | 2026-11-18 |
| **RES-007** | `unicampus-web` | Admin users popover default open bug (`FAC-1042`) and teacher attendance fixed positioning container break. | Reset initial popover state to `null` and transformed attendance action bar into container-safe sticky bottom bar. | 2026-11-18 |
| **RES-008** | `unicampus-web` | AI-generated design clichés (floating dot badges, repetitive quick-actions duplicating sidebar, light mode chat bubble illegibility, fake AI prompt chips, DevOps cluster jargon). | Executed De-AI refinement across 13 files: calibrated WCAG AA contrast tokens, removed prompt chips, centered login card, purged duplicate actions, and verified clean independent build. | 2026-11-18 |
| **RES-009** | `unicampus-web` | System-wide UI congestion, text redundancy, identity mismatch, and tech jargon (SHA-256/blockchain notices, IoT sensor tags in routine, API gateway telemetry in admin analytics, 48 icon buttons in materials, 60+ buttons in faculty directory). | Complete systemic audit across 26 routes; consolidated card buttons to primary actions + menus; purged pseudo-blockchain & fake IoT data; harmonized user identity bindings to active student session; verified 0 errors across 34 routes. | 2026-11-18 |
| **RES-010** | `unicampus-web` | Comprehensive Browser Audit & UI Remediation across 34 routes: mobile bottom nav clipping, teacher attendance QR obscured by sticky footer, teacher grades policy 110% error, dead pagination, non-overlapping weekly routine periods, canonical entity alignment (Sakib Ahmed, Dr. Asif Rahman, Spring 2026, 5,072 total users), removed duplicate badges and AI clichés. | Re-architected mobile nav with overflow drawer; responsive QR layout; normalized grading policy to 100% with working pagination; unified canonical dataset in `src/lib/canonicalCampus.ts`; fixed routine timetable; verified clean production build across all 34 routes. | 2026-11-19 |
| **RES-011** | `unicampus-web` | E2E Audit Suite (406 checks) and Sentinel Victory Remediation: ThemeToggle SSR hydration mismatch (`tabindex="0"` on motion.span), landing header mobile 390px button overflow, admin analytics dual-metric sub-label separation (<8px gap), teacher attendance unscanned pre-finalization absent count, teacher grades canonical grade scale legend, routine weekly matrix single Midday Recess row, student directory mock name collisions, and sanitized admin settings developer jargon. | Replaced ThemeToggle motion.span with clean spans and hydration suppressors; wrapped mobile landing CTA in `hidden sm:inline-flex`; added clean grid separation on dual metrics; aligned teacher attendance pre-finalization status and enabled pagination (`pageSize: 4`); expanded grades scale legend to full canonical buckets; consolidated routine matrix break row; resolved student name collisions; verified 406/406 checks passed across all 4 E2E tiers and clean production build. | 2026-11-19 |
| **RES-012** | `unicampus-web` | Production UI Upgrade & Monolith Decomposition: 2.2k-line `messages/page.tsx` monolithic typing lag, `min-h-screen` viewport mismatch on mobile iOS/Android, missing App Router segment loading/error/not-found boundaries, remaining hardcoded hex leaks, and `transition-all` causing layout recalculation spikes. | Decomposed `messages/page.tsx` into 10 memoized subcomponents with isolated composer state; replaced `min-h-screen` with `min-h-dvh`; created root & segment `loading.tsx`, `error.tsx`, `not-found.tsx`, and `global-error.tsx`; purged 100% of `transition-all` across all 34 routes; eliminated hex leaks and nested button hydration error; passed `tsc --noEmit` (0 errors), `npm run lint` (0 errors), Next.js build (34/34 routes), and 406/406 E2E checks. | 2026-11-19 |
| **RES-013** | `unicampus-web` | Next.js Entry Export Bug `ts(71002)` & Multi-Role Navigation State Isolation: non-standard export in `notices/page.tsx`, Faculty persona role state dropping to Student when navigating to shared routes (`/messages`, `/settings`, `/teachers`, `/teachers/1`) in `AppShell`, `getPortalTitle` defaulting to "Home" for single-segment paths, non-canonical IDs in `NoticeSnippetCard`, and hardcoded `/dashboard` navigation on splash screen. | Extracted notice data to `src/lib/noticeData.ts` and component to `NoticeboardContent.tsx`; updated `AppShell` to preserve Faculty role across shared routes when `currentUser.role === 'teacher'`; fixed `getPortalTitle` for shared routes; mapped `NoticeSnippetCard` to canonical IDs (`not-exam-108`, `not-reg-089`, `not-hack-044`); updated `SplashScreen` to route dynamically based on active user role; verified 86/86 role navigation checks and 406/406 full E2E audit checks pass. | 2026-11-19 |
| **RES-014** | `unicampus-web` | Teacher Attendance Monolith Refactoring & Production UI Upgrade: 843-line monolith with 43 audit issues (A1–J3) including `font-extrabold` overuse, `font-mono` on labels/table headers/pagination, `shadow-xl`/`shadow-2xl`/`shadow-lg` elevation clashes, arbitrary blue ambient glow, corner blur-3xl blobs, 3+ icon colors in session bar, raw `slate-*` and `bg-white` classes, thick 4px QR border, clipping countdown badge, unstyled status buttons, raw `--:--:--` on unscanned rows, and missing keyboard focus indicators. | Decomposed monolith into 5 memoized components (`SessionConfigBar`, `AttendanceQrHub`, `AttendanceRosterRow`, `AttendanceRosterPanel`, `AttendanceStickyFooter`); capped headings at `font-semibold`; removed `font-mono` from labels/headers/stats; replaced heavy shadows with flat `border border-line rounded-2xl p-5 bg-surface`; purged blur blobs and translucent backdrops; unified icons to `text-fg-muted`; replaced all `slate-*` and `bg-white` with Option A tokens; theme-aware dynamic QR rendering; clean `"—"` check-in for unscanned rows; segmented status toggle with semantic active fills & `aria-pressed`; verified 86/86 role navigation and 406/406 E2E audit checks pass. | 2026-11-20 |
| **RES-015** | `unicampus-web` | Teacher Gradebook Spreadsheet Table Issues: Browser-native number spinners overlaying score digits in dark mode, narrow score inputs clipping 4–5 character digits, 1px focus border jitter, hardcoded "All 43 rows valid" contradiction while displaying 10 enrolled students, header-to-cell vertical axis misalignments, `font-mono` overuse in headers/cells, lingering `slate-*`, `bg-white`, `font-extrabold`, and `transition-all` classes, and unseparated footer keyboard hints. | Stripped native spinners via `[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`; widened inputs to `w-20` (80px) with `font-sans text-xs tabular-nums text-right` and keyboard `ArrowUp`/`ArrowDown` ±0.5 stepping; wrapped cells in `flex justify-end` matching `text-right` column headers; replaced hardcoded 43 counts with dynamic `${rows.length}`; purged 100% of `slate-*`, `bg-white`, `font-extrabold`, and `transition-all`; added footer vertical divider with styled `<kbd>` and semantic pagination buttons; verified `tsc --noEmit`, ESLint (0 errors), Next.js build (34/34), 86/86 role navigation checks, and 406/406 full E2E audit checks pass. | 2026-11-20 |
| **RES-016** | `unicampus-web` | Teacher Attendance Vertical Overflow, QR Token Overlap, Lopsided Column Heights, Count Contradiction & Status-in-Subtitle Redundancy: `CSE-3101-Rxx` overlapped the bottom QR modules; duplicate 3-stat sub-pills pushed the QR card behind the sticky footer; right roster panel left empty void below rows; pagination vs enrolled counts looked mismatched; student subtitles leaked check-in status (`Checked in +14m late`, `Awaiting check-in`). | Removed overlapping QR tag inside QR frame and merged token with countdown pill below the ring; removed duplicate sub-pills inside `AttendanceQrHub`; applied `lg:items-stretch` and `mt-auto` pagination footer in `AttendanceRosterPanel` for balanced card heights; added `45 total enrolled` clarifier to roster footer; normalized academic subtitles (`Section A`, `Section A • CR Assistant`) in `attendanceService.ts` and `AttendanceRosterRow.tsx`; verified 0 ESLint warnings/errors and 406/406 E2E checks. | 2026-11-20 |
| **RES-017** | `unicampus-web` | Teacher Routine Flat Timetable Layout & Heavy Card Styling: Mixed weekdays in a flat 3-column grid created a Thursday orphan card and poor chronological scanning; heavy `border-t-4 rounded-[20px]` stripes pinched corners; `font-extrabold` header and `font-mono` timestamps/rooms/badges clashed with Option A typography; `OFFICE`/`RESEARCH` used `text-brand` despite Warning Consultation styling; `AnimatePresence mode="wait"` caused 400ms tab switch lag. | Grouped `All Days` view by weekday (`Monday`–`Thursday`) with hairline dividers and chronological `parseTimeToMinutes` sorting; upgraded cards to flat `rounded-2xl border-line` (`RoutineSlotCard`) with semantic `Badge` primitives and matching code accent colors (`text-brand`, `text-success`, `text-warning`); added dynamic workload summary and day tab session counts; restricted `font-mono` to short course/slot codes; switched to reduced-motion `0.12s` opacity transition; verified `tsc --noEmit`, ESLint (0 errors), Next.js build (34/34), 86/86 role navigation, 406/406 E2E checks, and visual/DOM checks. | 2026-11-20 |
| **RES-018** | `unicampus-web` | Teacher Materials Sparse Filter Bar, Prototype Upload/Delete & Noisy Card Hierarchy: Filter toolbar only had a single native select, leaving empty width without search or type filters; `Upload New Document` inserted a hardcoded Lecture 10 without modal inputs; delete action permanently removed items with no confirmation or undo; bright `text-success font-bold` downloads and `font-mono` metadata/badges competed with document titles. | Upgraded toolbar with search input, styled course `<select>`, and clickable type `ChipRow` filters; built full Upload `Modal` (`course`, `type`, `title`, drag-and-drop/file picker); replaced instant delete with index-preserving Undo `Toast`; refactored cards (`MaterialCard`) to `rounded-2xl` with category icons (`Presentation`, `BookOpen`, `FlaskConical`, `ClipboardList`), semantic `<Badge>`, neutral download counts, `font-mono` limited to `courseCode`, and shared `EmptyState`; verified `tsc --noEmit`, ESLint (0 errors), build (34/34), 86/86 role navigation, 406/406 E2E checks, and visual/DOM checks. | 2026-11-20 |

---

## 3. Bug Reporting Template for Agents

When logging a new bug, append it to Section 1 using this standard format:

```markdown
### Issue #<NUMBER>: <TITLE>
- **Platform:** `unicampus-web` | `unicampus-mobile` | `unicampus-supabase`
- **Severity:** High | Medium | Low
- **Status:** `[ ] Backlog` | `[~] In Progress` | `[!] Blocked`
- **Description:** <Clear, concise description of the bug and behavior>
- **Affected Files:** <List of file paths>
- **Remediation Plan:** <Concrete technical proposal to fix it>
```
