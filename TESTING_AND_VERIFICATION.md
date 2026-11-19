# UniCampus — Testing & Verification Playbook

> **Mission:** Zero regressions and 100% production readiness across Web, Mobile, and Backend.  
> **Rule:** No PR, commit, or task completion is acceptable without passing the designated verification commands.

---

## 1. Quick Verification Command Cheat-Sheet

| Platform | Scope | Exact Command | Pass Criteria |
|---|---|---|---|
| **Mobile (`unicampus-mobile`)** | Static Analysis | `cd unicampus-mobile && flutter analyze` | `No issues found!` |
| **Mobile (`unicampus-mobile`)** | Unit / Widget Tests | `cd unicampus-mobile && flutter test` | All tests pass (`0 failures`) |
| **Web (`unicampus-web`)** | TypeScript Typing | `cd unicampus-web && npx tsc --noEmit` | Exit code 0, 0 type errors |
| **Web (`unicampus-web`)** | ESLint / Code Style | `cd unicampus-web && npm run lint` | 0 errors |
| **Web (`unicampus-web`)** | Production Build | `cd unicampus-web && npm run build` | Successful build output in `.next/` |
| **Backend (`unicampus-supabase`)** | SQL Syntax Check | `npx supabase db lint` | Valid SQL and foreign key constraints |

---

## 2. Production Readiness Definition of Done (DoD)

Before any feature is marked `[x] Complete` in [`PROGRESS.md`](file:///home/sakib360/sakib-codes/UniCampus/PROGRESS.md), it must satisfy every item on this checklist:

### Quality & Code Health
- [ ] **Static Analysis Passed**: `flutter analyze` (Mobile) or `npx tsc --noEmit` (Web) produces zero errors and zero warnings.
- [ ] **No Dead Code**: All imported modules, unused parameters, and temporary test variables are removed.
- [ ] **No Console Clutter**: All temporary `print()`, `console.log()`, and `debugger;` statements are removed.

### UI / UX & Responsive Boundaries
- [ ] **Theme Parity**: Screen renders correctly in both **Light Mode** and **Dark Mode** with brand contrast compliance.
- [ ] **Zero Horizontal Overflow**: Screen tested at 375px (iPhone SE), 430px (iPhone Pro Max), 768px (iPad), and 1280px+ (Desktop). No horizontal scrollbar appears on vertical screens.
- [ ] **Touch Target Safety**: All buttons, links, and icon triggers meet the minimum 44px × 44px touch area with 8px+ touch margins.
- [ ] **Copyable Text**: Identifiers, emails, phone numbers, and currency values do not carry `select-none`.

### Monorepo & Documentation Synchronization
- [ ] **Task Ledger Updated**: Marked `[x]` with commit/date in [`PROGRESS.md`](file:///home/sakib360/sakib-codes/UniCampus/PROGRESS.md).
- [ ] **Bug/Debt Register Updated**: Any new technical debt or solved bugs logged in [`BUGS_AND_DEBT.md`](file:///home/sakib360/sakib-codes/UniCampus/BUGS_AND_DEBT.md).
- [ ] **Domain Context Updated**: If new screens, routes, or widgets were added, they are listed in `WEB_CONTEXT.md` or `MOBILE_CONTEXT.md`.

---

## 3. Subsystem Test Runbooks

### Mobile Test Runbook (Flutter)
```bash
# 1. Fetch dependencies and verify toolchain
cd unicampus-mobile
flutter pub get

# 2. Run static analysis
flutter analyze

# 3. Run unit and widget test suite
flutter test --coverage

# 4. (Optional) Run on connected device or emulator
flutter run -d linux # or android / ios
```

### Web Test Runbook (Next.js)
```bash
# 1. Install dependencies (if fresh checkout)
cd unicampus-web
npm install

# 2. Typecheck with TypeScript
npx tsc --noEmit

# 3. Run Next.js linter
npm run lint

# 4. Execute production build
npm run build
```

---

## 4. Verification Evidence Logging

Whenever an agent finishes a major milestone, append the verification evidence to the changelog:
- Command run: e.g. `flutter analyze`
- Output: `No issues found! (ran in 26.8s)`
- Timestamp: ISO-8601 string
- Operating System & SDK Version: e.g. `Linux, Flutter 3.47.6, Dart 3.13.5`
