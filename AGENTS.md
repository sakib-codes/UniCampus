# UniCampus — Universal Agent Router & Operating Protocol

> **Target Audience:** All AI Coding Agents (Antigravity, Claude Code, Gemini CLI, Cursor, Windsurf, Copilot).  
> **Mission:** Zero hallucinations, 100% token-efficient vibe coding, strict multi-platform consistency.

---

## 1. Fast Context Router (The 2-Hop Token-Minimization Matrix)

**STOP: Do NOT scan or load the entire repository into context.** UniCampus is a multi-platform monorepo. Loading all platforms wastes 20k–50k tokens per prompt. Use this 2-hop lookup table to read **only** what your current task requires:

| Task Type | Primary Context File (Hop 1) | Deep Context File (Hop 2) | Ledger to Check / Update |
|---|---|---|---|
| **Web UI / Next.js / Tailwind** | [`unicampus-web/AGENTS.md`](file:///home/sakib360/sakib-codes/UniCampus/unicampus-web/AGENTS.md) | [`unicampus-web/WEB_CONTEXT.md`](file:///home/sakib360/sakib-codes/UniCampus/unicampus-web/WEB_CONTEXT.md) | [`PROGRESS.md`](file:///home/sakib360/sakib-codes/UniCampus/PROGRESS.md) (Web Section) |
| **Mobile App / Flutter / Dart** | [`unicampus-mobile/AGENTS.md`](file:///home/sakib360/sakib-codes/UniCampus/unicampus-mobile/AGENTS.md) | [`unicampus-mobile/MOBILE_CONTEXT.md`](file:///home/sakib360/sakib-codes/UniCampus/unicampus-mobile/MOBILE_CONTEXT.md) | [`PROGRESS.md`](file:///home/sakib360/sakib-codes/UniCampus/PROGRESS.md) (Mobile Section) |
| **Database / Supabase / SQL** | [`unicampus-supabase/AGENTS.md`](file:///home/sakib360/sakib-codes/UniCampus/unicampus-supabase/AGENTS.md) | [`unicampus-supabase/BACKEND_CONTEXT.md`](file:///home/sakib360/sakib-codes/UniCampus/unicampus-supabase/BACKEND_CONTEXT.md) | [`PROGRESS.md`](file:///home/sakib360/sakib-codes/UniCampus/PROGRESS.md) (Backend Section) |
| **Architecture / Full-Stack** | [`PROJECT_MEMORY.md`](file:///home/sakib360/sakib-codes/UniCampus/PROJECT_MEMORY.md) | [`PROGRESS.md`](file:///home/sakib360/sakib-codes/UniCampus/PROGRESS.md) | [`BUGS_AND_DEBT.md`](file:///home/sakib360/sakib-codes/UniCampus/BUGS_AND_DEBT.md) |
| **Testing / Quality Assurance** | [`TESTING_AND_VERIFICATION.md`](file:///home/sakib360/sakib-codes/UniCampus/TESTING_AND_VERIFICATION.md) | Specific domain `AGENTS.md` | [`TESTING_AND_VERIFICATION.md`](file:///home/sakib360/sakib-codes/UniCampus/TESTING_AND_VERIFICATION.md) |

---

## 2. The Universal Agent Protocol (Mandatory)

Every agent must follow this exact 3-phase lifecycle for every task:

### Phase 1: Pre-Flight (Before Writing Any Code)
1. **Identify Scope**: Determine if the task touches `Web`, `Mobile`, `Backend`, or `Full-Stack`.
2. **Read Required Files**: Open the matching files from Section 1 above. Total context read should remain under 2,500 tokens.
3. **Verify Existing State**: Check [`PROGRESS.md`](file:///home/sakib360/sakib-codes/UniCampus/PROGRESS.md) to see if the feature was already built or partially implemented. Never duplicate existing components or re-implement solved problems.
4. **Inspect Known Issues**: Check [`BUGS_AND_DEBT.md`](file:///home/sakib360/sakib-codes/UniCampus/BUGS_AND_DEBT.md) to avoid known pitfalls (e.g. Tailwind v4 animation classes, responsive layout overflow constraints).

### Phase 2: In-Flight (While Writing Code)
1. **Design System Adherence**: All UI changes must adhere strictly to the UniCampus Calm Campus design tokens:
   - **Brand Indigo**: `#605BFF` (Light) / `#7C78FF` (Dark)
   - **Base Canvas**: `#F5F5FA` (Light) / `#0B0B10` (Dark)
   - **Surface & Cards**: Solid `#FFFFFF` (Light) / `#15151D` (Dark)
   - **Borders & Dividers**: Hairline 1px border `#E7E7F0` (Light) / `#262630` (Dark)
   - **Card Aesthetics**: Solid surfaces, `rounded-[20px]`, no glassmorphism or floating glow except sticky TopBar blur.
   - **UI Primitives**: Prefer shared primitives from `@/components/ui/` (`Button`, `Card`, `PageHeader`, `Stat`, `Badge`, `Chip`, `ListRow`, `DataTable`, `Tabs`, `Modal`, `Sheet`, `Toast`, `EmptyState`, `Skeleton`, `Avatar`).
   - **Typography**: Google Fonts Inter (min 12px anywhere, 15px body, 13px micro/subtext).
2. **Zero Code Evaporation**: Never delete a component, CSS class, or utility without first grepping to verify zero remaining references.
3. **Responsive Boundaries**: Always enforce viewport-safe boundaries (`w-full max-w-[...]`) with minimum 44px touch targets. Never use static wide pixel containers (`w-80`, `w-96`) that trigger horizontal scrolling.
4. **Incremental Testing**: Verify changes immediately using the platform test command (e.g. `flutter analyze` or `npx tsc --noEmit`).

### Phase 3: Post-Flight (Before Finishing Turn)
1. **Run Verification**: Execute the automated verification command specified in [`TESTING_AND_VERIFICATION.md`](file:///home/sakib360/sakib-codes/UniCampus/TESTING_AND_VERIFICATION.md).
2. **Update Task Ledger**: In [`PROGRESS.md`](file:///home/sakib360/sakib-codes/UniCampus/PROGRESS.md), mark completed features `[x]`, update in-progress items `[~]`, and list new files in the inventory.
3. **Log Regressions / Debt**: If any new caveat, bug, or technical debt is encountered or resolved, update [`BUGS_AND_DEBT.md`](file:///home/sakib360/sakib-codes/UniCampus/BUGS_AND_DEBT.md).
4. **Summary & File Links**: Provide a concise summary to the user with clickable `file:///` links and exact verification evidence.

---

## 3. Monorepo Map

```
UniCampus/
├── AGENTS.md                         <-- You are here (Universal Router & Protocol)
├── PROJECT_MEMORY.md                 <-- Monorepo Architecture & Canonical Reference
├── PROGRESS.md                       <-- Multi-Platform Sprint & Task Ledger
├── BUGS_AND_DEBT.md                  <-- Bug Tracker & Technical Debt Register
├── TESTING_AND_VERIFICATION.md       <-- QA Runbook & Definition of Done (DoD)
├── unicampus-web/                    <-- Next.js 16 + React 19 + Tailwind v4 Web Portal
│   ├── AGENTS.md                     <-- Web Agent Rules (Next.js 16 conventions)
│   ├── WEB_CONTEXT.md                <-- Route & Component Inventory
│   └── src/                          <-- Web Application Source
├── unicampus-mobile/                 <-- Flutter 3.47 / Dart 3.13 Mobile App
│   ├── AGENTS.md                     <-- Mobile Agent Rules (Flutter conventions)
│   ├── MOBILE_CONTEXT.md             <-- Screen Inventory & Porting Roadmap
│   └── lib/                          <-- Mobile Application Source
└── unicampus-supabase/               <-- Backend Database & Schema
    ├── AGENTS.md                     <-- Database & RLS Security Rules
    ├── BACKEND_CONTEXT.md            <-- Schema Map & Table Definitions
    └── migrations/                   <-- SQL Migrations
```

---

## 4. Token Minimization & Formatting Rules for Agents
- **Keep Documentation Dense**: Use markdown tables and lists. Avoid verbose paragraph filler.
- **Reference Over Duplication**: Never paste large blocks of source code into documentation files. Point to files with relative or absolute paths.
- **File Length Cap**: Keep all `.md` files under 350 lines. If a guide grows too long, decompose it into sub-topic context files.
- **Standard Status Flags**:
  - `[x]` = Verified & Complete
  - `[~]` = In Progress
  - `[ ]` = Backlog / Not Started
  - `[!]` = Blocked / Requires User Review
